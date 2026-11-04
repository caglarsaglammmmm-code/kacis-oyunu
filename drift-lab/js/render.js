// Canvas çizimi. Sprite'lar açılışta koddan üretilir; sadece ekrandaki nesneler çizilir.
import { CONFIG, GROUND, BUILD } from './config.js';
import { CHUNK, CT, TILE, PROP, isPower, powerName } from './world.js';
import { PED_FLY, lightState } from './crowd.js';
import { paintTr } from './cars.js';
import { sheetSprite } from './sheet.js';
import { CUSTOM, paintOf, ledOf, refPaintIndex } from './custom.js';
import { rimIcon } from './pixelcars.js';
import { paintPad, tallArt, landmarkSign } from './landmarks.js';
import { paintBuilding2, shadowOf } from './buildings.js';
import { FX } from './effects.js';
import { MemorialArt, bakeMemorialPad } from './memorial.js';
import { Stadiums } from './stadium.js';
import { signKind, paintDoner, paintPromo, paintDancer, paintBalcony, paintWashing, paintMoon, paintStars, rr, shade, paintLux, paintCar, paintPolice, paintPoliceFast, paintMoto, paintSwat, paintTankHull, paintTurret, paintNpc, paintPed, paintPedKind, paintAlien, signCanvas, roofClutter, paintLight, paintSimit, paintPower, paintSpecial, TALL_STYLES, POWER_LOOK } from './art.js';

const PF = CONFIG.perf;
const SPR = 3; // Sprite ölçeği: arabalar yakın çekimde de keskin kalsın
const ART_W = CONFIG.world.arterial * TILE;
const BIOME_COLORS = {
  city: { grass: '#6cc24a', road: '#585f6b', sand: '#f2dfa4', dirt: '#b79c6c' },
  beach: { grass: '#8ecb62', road: '#666b74', sand: '#f8e6ae', dirt: '#d4b98a' },
  forest: { grass: '#3f8f44', road: '#4c4f55', sand: '#d9cf9e', dirt: '#8f6f47' },
  desert: { grass: '#d2a964', road: '#6f675d', sand: '#ecc680', dirt: '#c29655' },
  rural: { grass: '#9ccd58', road: '#5e6168', sand: '#e6d7a2', dirt: '#a98d5c' },
};

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.ceil(w);
  c.height = Math.ceil(h);
  return c;
}

function sprite(w, h, paint) {
  const c = makeCanvas(w * SPR, h * SPR);
  const g = c.getContext('2d');
  g.setTransform(SPR, 0, 0, SPR, (w * SPR) / 2, (h * SPR) / 2);
  paint(g);
  return c;
}

function glow(size, stops) {
  const c = makeCanvas(size, size);
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) grad.addColorStop(o, col);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

// Her tabela rengine özel yumuşak ışık: önbellekli
const haloCache = new Map();
function signHalo(color) {
  let c = haloCache.get(color);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 2, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = shade(color, 0.4); g.fillRect(0, 0, 64, 64);
  haloCache.set(color, c);
  return c;
}

// Tabela görüntüsü binada saklanır: her karede anahtar metni üretilmez
// Hedef işareti: dört köşeli dönen halka, bir kez çizilir
function reticleSprite() {
  const c = makeCanvas(96, 96);
  const g = c.getContext('2d');
  g.translate(48, 48);
  g.strokeStyle = '#ff2f6a'; g.lineWidth = 5;
  g.beginPath(); g.arc(0, 0, 36, 0, Math.PI * 2); g.stroke();
  g.strokeStyle = '#ffffff'; g.lineWidth = 3;
  for (let k = 0; k < 4; k++) { g.rotate(Math.PI / 2); g.beginPath(); g.moveTo(0, -46); g.lineTo(0, -30); g.stroke(); }
  g.fillStyle = '#ff2f6a'; g.beginPath(); g.arc(0, 0, 4, 0, Math.PI * 2); g.fill();
  return c;
}

function rectSign(r) {
  return r.signImg || (r.signImg = landmarkSign(r) || signCanvas(r.sign, r.signColor, r.seed));
}

// Tabela boyutu: 0 minicik, 1 normal, 2 büyük, 3 dev çatı yazısı
const signOut = { x: 0, y: 0, w: 0, h: 0 };
const CHUNK_FIT = (CHUNK + 0.6) / CHUNK; // Zemin parçaları ek yeri kapansın diye bu kadar büyük çizilir

// Yüksek binada tabela çatının ortasındadır: gündüz, gece ve ışıltı aynı kutuyu kullanır
function roofSignBox(r, img) {
  const w = Math.min((r.tX1 - r.tX0) * 0.92, (img.width / img.height) * (r.roofSignH || 38));
  const h = (w / img.width) * img.height;
  signOut.w = w;
  signOut.h = h;
  signOut.x = (r.tX0 + r.tX1) / 2 - w / 2;
  signOut.y = (r.tY0 + r.tY1) / 2 - h / 2;
  return signOut;
}

// Özel yapının güney cephesindeki dev tabela: duvar kameraya bakınca görünür, duvarla birlikte uzar
function facadeSignBox(r, img, camY) {
  const y1 = r.y + r.h;
  if (camY <= y1) return null;
  const t = 0.56;
  const wy = y1 + (r.tY1 - y1) * t;
  const xa = r.x + (r.tX0 - r.x) * t;
  const xb = r.x + r.w + (r.tX1 - r.x - r.w) * t;
  const wallH = y1 - r.tY1;
  let w = (xb - xa) * (r.landmark === 'kule' ? 0.86 : 0.6);
  let h = (w * img.height) / img.width;
  if (h > wallH * 0.3) { h = wallH * 0.3; w = (h * img.width) / img.height; }
  if (h < 5) return null;
  signOut.w = w; signOut.h = h;
  signOut.x = (xa + xb) / 2 - w / 2;
  signOut.y = wy - h / 2;
  return signOut;
}

// Alçak binada tabela zemin parçasına işlenmiştir: gece katmanı aynı ölçeğe oturur, çift görünmez
function groundSignBox(r, img, c) {
  const b = signBox(r, img);
  b.x = c.x + (b.x - c.x) * CHUNK_FIT;
  b.y = c.y + (b.y - c.y) * CHUNK_FIT;
  b.w *= CHUNK_FIT;
  b.h *= CHUNK_FIT;
  return b;
}
function signBox(r, img) {
  const size = r.signSize ?? 1;
  const hTarget = [18, 24, 32, 46][size] ?? 24;
  const maxW = size === 3 ? r.w * 0.94 : r.w - 6;
  // Dar binada tabela sığacak kadar küçülür, cepheden taşmaz
  const fit = Math.min(hTarget, Math.max(10, r.h - 9));
  const w = Math.min(maxW, (img.width / img.height) * fit);
  const h = (w / img.width) * img.height;
  signOut.w = w;
  signOut.h = h;
  signOut.x = r.x + (r.w - w) / 2;
  // Dev yazı çatının ortasında, öteki tabelalar cephede
  signOut.y = size === 3 ? r.y + 8 : r.y + r.h - h - 7;
  return signOut;
}

// Satın alınan genel boya: arabanın en doygun kendi boyası yeniden renklendirilir. Koşu başında bir kez
function rgbToHsl(r, g, b) {
  const mx = Math.max(r, g, b); const mn = Math.min(r, g, b);
  const l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn;
  const s = d / (1 - Math.abs(2 * l - 1));
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h *= 60; if (h < 0) h += 360;
  return [h, s, l];
}
export function recolorSprite(spec, sel) {
  const ref = refPaintIndex(spec);
  const base = carSprite(spec, ref);
  const from = spec.paints[ref].color;
  const to = paintOf(spec, sel);
  const hex = (c) => [parseInt(c.slice(1, 3), 16) / 255, parseInt(c.slice(3, 5), 16) / 255, parseInt(c.slice(5, 7), 16) / 255];
  const [fh, fs, fl] = rgbToHsl(...hex(from));
  const [tr, tg, tb] = hex(to.color);
  const c = makeCanvas(base.width, base.height);
  const g = c.getContext('2d');
  g.drawImage(base, 0, 0);
  let img;
  try { img = g.getImageData(0, 0, c.width, c.height); } catch { return base; }
  const d = img.data;
  const matte = to.finish === 'matte'; const metal = to.finish === 'metal' || to.finish === 'pearl';
  for (let i = 0; i < d.length; i += 4) {
    if (d[i + 3] < 12) continue;
    const r = d[i] / 255; const gg = d[i + 1] / 255; const b = d[i + 2] / 255;
    const [h, s, l] = rgbToHsl(r, gg, b);
    let dh = Math.abs(h - fh); if (dh > 180) dh = 360 - dh;
    if (dh > 28 || s < fs * 0.35) continue;
    // Gövde pikseli: ışık ve gölge korunur, renk hedefe taşınır
    let k = l / Math.max(0.08, fl);
    if (matte) k = 1 + (k - 1) * 0.55;
    if (metal) k = 1 + (k - 1) * 1.25;
    const w = Math.min(1, (s - fs * 0.35) / (fs * 0.4));
    const sheen = Math.max(0, k - 1) * 0.35;
    d[i] = Math.round(255 * Math.min(1, (r * (1 - w)) + w * (tr * k + sheen)));
    d[i + 1] = Math.round(255 * Math.min(1, (gg * (1 - w)) + w * (tg * k + sheen)));
    d[i + 2] = Math.round(255 * Math.min(1, (b * (1 - w)) + w * (tb * k + sheen)));
  }
  g.putImageData(img, 0, 0);
  c.wu = base.wu; c.hu = base.hu;
  return c;
}

export function carSprite(spec, paint = 0) {
  const img = sheetSprite(`p:${spec.id}:${paint}`, spec.len);
  if (img) return img;
  return sprite(spec.len + 10, spec.wid + 14, (g) => paintTr(g, spec.len, spec.wid, spec.color, spec.accent, spec.shape, spec.finish));
}

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.dpr = 1;
    this.w = 0;
    this.h = 0;
    this.sprites = {};
    this.canvasPool = [];
    this.bakedCount = 0;
    this.baked = [];
    this.playerSprite = null;
    this.playerId = '';
    this.lod = { slices: 6, balcony: 1, night: 2, speedLines: true, fireSmoke: true };
    this.tallList = [];
    this.syncBakes = 0; // Görünür parça hazır değilse kare beklemiştir: ölçüm için
    this.queue = []; // Sprite işleri kare bütçesiyle yapılır
    this.memorial = new MemorialArt(); // Cumhuriyet Meydanı anıtı: önbellekli, yakında ayrıntılı
    this.stadiums = new Stadiums(); // İki stadyum: önbellekli, uzakta sade
    this.makeSprites();
  }

  // Atlas yüklenince polis ve park etmiş araçlar 3B modellerden gelir
  // Tek karede donmasın diye işler kuyruğa girer; stepQueue kare başına birkaç ms harcar
  useAtlas() {
    const P = CONFIG.police;
    const s = this.sprites;
    const q = this.queue;
    this.playerId = '';
    s.npc = {};
    for (const k of ['car', 'fast', 'advanced', 'swat', 'moto']) {
      q.push(() => { const img = sheetSprite(`cop:${k}`, P[k].len); if (img) s[k] = img; });
    }
    let first = true;
    for (const [k, n] of [['marmara', 4], ['liva', 4], ['klasik', 5], ['volta', 5], ['pusula', 4], ['lale', 4], ['vadi', 4], ['bavar', 5], ['dalga', 4], ['efe', 4]]) {
      for (let i = 0; i < n; i++) {
        q.push(() => {
          const img = sheetSprite(`npc:${k}:${i}`, 44);
          if (!img) return;
          if (first) { s.parked = []; first = false; }
          s.parked.push(img);
        });
      }
    }
    // Trafik araçları ilk görüldüğünde üretilmez: oyun ortasında takılma yapıyordu
    for (const k of Object.keys(CONFIG.npc.types)) {
      const t = CONFIG.npc.types[k];
      t.colors.forEach((_, i) => q.push(() => {
        const key = `${k}${i}`;
        if (s.npc[key]) return;
        const img = sheetSprite(`npc:${k}:${i}`, t.len);
        if (img) s.npc[key] = img;
      }));
    }
  }

  stepQueue(ms) {
    if (!this.queue.length) return;
    const t0 = performance.now();
    while (this.queue.length) {
      this.queue.shift()();
      if (performance.now() - t0 >= ms) break;
    }
  }

  resize(w, h, dpr) {
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.imageSmoothingEnabled = true;
    this.vignette = null;
  }

  releaseChunk(c) {
    if (this.job && this.job.c === c) this.job = null;
    if (c.canvas) {
      this.canvasPool.push(c.canvas);
      c.canvas = null;
      const i = this.baked.indexOf(c);
      if (i >= 0) this.baked.splice(i, 1);
    }
  }

  // Yol ve sokak dokuları: karo başına tek görüntü, pişirme çok hızlanır
  makePatterns() {
    const T = TILE;
    const mk = (paint) => [0, 1, 2, 3].map((v) => {
      const c = makeCanvas(T, T);
      const g = c.getContext('2d');
      paint(g, v);
      return c;
    });
    const noise = (g, n, a, b, s = 3) => { for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(Math.random() * T, Math.random() * T, s, s); } };
    // Üç yol tonu: ince doku farkıyla, araçlar net ayrılsın
    const tone = (col) => mk((g, v) => {
      g.fillStyle = col; g.fillRect(0, 0, T, T);
      noise(g, 22, 'rgba(255,255,255,.035)', 'rgba(0,0,0,.05)', 2);
      if (v === 1) { g.fillStyle = 'rgba(0,0,0,.05)'; g.fillRect(6, 10, 22, 12); }
      if (v === 3) { g.fillStyle = 'rgba(255,255,255,.03)'; g.fillRect(14, 4, 20, 26); }
    });
    const RT = CONFIG.world.roadTones;
    this.roads = RT.map(tone);
    this.roads[2] = mk((g, v) => {
      g.fillStyle = RT[2]; g.fillRect(0, 0, T, T);
      noise(g, 14, 'rgba(255,255,255,.04)', 'rgba(0,0,0,.05)', 2);
      g.fillStyle = 'rgba(40,40,40,.16)'; g.fillRect(0, 0, T, 1); g.fillRect(0, 0, 1, T);
      if (v === 2) { g.fillStyle = 'rgba(0,0,0,.03)'; g.fillRect(0, 0, T, T); }
    });
    this.alleys = [this.roads[1], tone('#70747a')];
  }

  // Yüksek bina dokuları: duvarda pencere, balkon, çamaşır, klima, çanak, çiçek. Çatılar ayrı
  makeTallArt() {
    const W0 = 96; const H0 = 192;
    const tones = [['#6f93b5', '#c8e4f4'], ['#c9c0ae', '#9fd2ee'], ['#d8b890', '#a8d4e8'], ['#7fb0a8', '#d0f0ea'], ['#b5705a', '#ffe2b0'], ['#e4e6e8', '#8fc0dc'], ['#858b93', '#c4d8e4'], ['#3d4a5c', '#8fd0f4']];
    this.walls = [];
    tones.forEach(([wall, glass], t) => {
      for (let d = 0; d < 3; d++) {
        const c = makeCanvas(W0, H0);
        const g = c.getContext('2d');
        g.fillStyle = wall; g.fillRect(0, 0, W0, H0);
        const glassy = t === 0 || t === 7;
        for (let row = 0; row < 11; row++) {
          const y = 4 + row * 17;
          g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(0, y + 13, W0, 2);
          for (let col = 0; col < 5; col++) {
            const x = 3 + col * 19;
            const h = (row * 31 + col * 17 + t * 7 + d * 13) % 23;
            g.fillStyle = h % 6 === 0 ? '#ffe9a8' : glass;
            g.fillRect(x, y, glassy ? 17 : 13, glassy ? 13 : 10);
            if (glassy) continue;
            if (d === 1 && h % 4 === 0) { // Balkon, çamaşır
              g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(x - 1, y + 10, 15, 2);
              for (let k = 0; k < 3; k++) { g.fillStyle = ['#f4f6f8', '#e8533f', '#3e7cb1', '#f2c14e'][(h + k) % 4]; g.fillRect(x + 1 + k * 4, y + 3, 3, 7); }
            } else if (d === 2 && h % 5 === 0) { // Klima
              g.fillStyle = '#e6e9ec'; g.fillRect(x + 1, y + 7, 10, 6); g.fillStyle = '#7d8590'; g.beginPath(); g.arc(x + 6, y + 10, 2, 0, 7); g.fill();
            } else if (h % 7 === 1) { // Çiçek
              g.fillStyle = '#8a5a3a'; g.fillRect(x - 1, y + 10, 15, 2.4);
              for (let k = 0; k < 5; k++) { g.fillStyle = k % 2 ? '#4f9a3a' : '#ff5a8a'; g.beginPath(); g.arc(x + k * 3, y + 9, 2, 0, 7); g.fill(); }
            } else if (h % 9 === 2) { // Uydu çanağı
              g.fillStyle = '#f0f2f4'; g.beginPath(); g.ellipse(x + 11, y + 9, 4, 3, 0.5, 0, 7); g.fill();
            }
          }
        }
        // Yan kenar için döndürülmüş kopya
        const rot = makeCanvas(H0, W0);
        const q = rot.getContext('2d');
        q.translate(H0 / 2, W0 / 2); q.rotate(Math.PI / 2); q.drawImage(c, -W0 / 2, -H0 / 2);
        this.walls.push({ n: c, e: rot });
      }
    });
    this.roofs = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
      const c = makeCanvas(128, 128);
      const g = c.getContext('2d');
      const base = ['#c5c9cc', '#8fa6b8', '#b0a690', '#d8d4cc', '#7a8a96', '#a8b8a8', '#b09a8a', '#c0c8d0'][k];
      g.fillStyle = base; g.fillRect(0, 0, 128, 128);
      g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 5; g.strokeRect(3, 3, 122, 122);
      g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(8, 8, 112, 7);
      if (k % 3 === 0) { g.fillStyle = '#3d444e'; g.beginPath(); g.arc(64, 64, 34, 0, 7); g.fill(); g.strokeStyle = '#ffd23f'; g.lineWidth = 4; g.stroke(); g.fillStyle = '#fff'; g.font = '900 38px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('H', 64, 66); }
      else if (k % 3 === 1) { g.fillStyle = '#1f3f77'; for (let y = 18; y < 104; y += 19) for (let x = 18; x < 100; x += 25) g.fillRect(x, y, 21, 15); }
      else { g.fillStyle = '#7fb56a'; g.fillRect(20, 20, 60, 50); g.fillStyle = '#4f9a3a'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(30 + i * 11, 34 + (i % 2) * 18, 8, 0, 7); g.fill(); } g.fillStyle = '#57c1f0'; g.fillRect(88, 62, 26, 44); }
      for (let i = 0; i < 3; i++) { const x = 16 + ((k + 1) * (i + 2) * 23) % 90; const y = 88 + (i * 11) % 24; g.fillStyle = '#dfe3e8'; g.fillRect(x, y, 15, 11); g.fillStyle = '#6d7680'; g.beginPath(); g.arc(x + 7, y + 5, 3.4, 0, 7); g.fill(); }
      g.fillStyle = '#eceff2'; g.beginPath(); g.ellipse(106, 22, 8, 7, 0.5, 0, 7); g.fill();
      return c;
    });
    // Yangın: üç kare alev, tek kare duman
    this.flames = [0, 1, 2].map((v) => sprite(44, 60, (g) => {
      for (const [r, col] of [[1, '#ff3a10'], [0.72, '#ff9a1a'], [0.42, '#ffe98a']]) {
        g.fillStyle = col;
        g.beginPath(); g.moveTo(-17 * r, 24);
        g.quadraticCurveTo(-21 * r, 2, -9 * r + v, -6 * r);
        g.quadraticCurveTo(-10 * r, -18 * r, 0 + v * 2 - 2, -28 * r);
        g.quadraticCurveTo(10 * r, -15 * r, 9 * r, -4 * r);
        g.quadraticCurveTo(21 * r, 4, 17 * r, 24);
        g.closePath(); g.fill();
      }
    }));
  }

  // Kameraya göre yukarı uzanan binalar: taban sabit, çatı kameradan dışa kayar ve büyür
  // Görünen yüksek binalar uzaktan yakına sıralanır: yakın olan uzak olanı örter.
  // Çatı izdüşümü binada saklanır, tabela ve ışıltı buradan okur
  collectTalls(game, c0x, c1x, c0y, c1y) {
    const cam = game.cam;
    const cx = cam.x; const cy = cam.y;
    const mx = cam.halfW + 120; const my = cam.halfH + 120;
    const list = this.tallList;
    let n = 0;
    for (let gy = c0y - 1; gy <= c1y + 1; gy++) {
      for (let gx = c0x - 1; gx <= c1x + 1; gx++) {
        const c = game.world.chunks.get((gx + 32768) * 65536 + (gy + 32768));
        if (!c) continue;
        for (let ti = 0; ti < c.talls.length; ti++) {
          const r = c.talls[ti];
          if (!r.alive || r.x + r.w < cx - mx || r.x > cx + mx || r.y + r.h < cy - my || r.y > cy + my) continue;
          const k = r.tall;
          r.tX0 = r.x + (r.x - cx) * k; r.tX1 = r.x + r.w + (r.x + r.w - cx) * k;
          r.tY0 = r.y + (r.y - cy) * k; r.tY1 = r.y + r.h + (r.y + r.h - cy) * k;
          const dx = cx < r.x ? r.x - cx : cx > r.x + r.w ? cx - r.x - r.w : 0;
          const dy = cy < r.y ? r.y - cy : cy > r.y + r.h ? cy - r.y - r.h : 0;
          r.tDist = dx * dx + dy * dy;
          list[n++] = r;
        }
      }
    }
    list.length = n;
    for (let i = 1; i < n; i++) {
      const r = list[i];
      let j = i - 1;
      while (j >= 0 && list[j].tDist < r.tDist) { list[j + 1] = list[j]; j--; }
      list[j + 1] = r;
    }
    for (let i = 0; i < n; i++) list[i].tSeq = i;
  }

  drawTalls(game, c0x, c1x, c0y, c1y) {
    const ctx = this.ctx;
    const cam = game.cam;
    const cx = cam.x; const cy = cam.y;
    const N = this.lod.slices;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    this.collectTalls(game, c0x, c1x, c0y, c1y);
    const list = this.tallList;
    for (let ti = 0; ti < list.length; ti++) {
      const r = list[ti];
      const x0 = r.x; const x1 = r.x + r.w; const y0 = r.y; const y1 = r.y + r.h;
      const X0 = r.tX0; const X1 = r.tX1; const Y0 = r.tY0; const Y1 = r.tY1;
      // Özel yapı (kolej, kule) kendi duvar ve çatı dokusunu getirir
      const art = r.landmark ? tallArt(r) : null;
      const tex = art || this.walls[r.seed % this.walls.length];
      ctx.globalAlpha = 1;
      this.tallWalls(r, tex, art, cx, cy, N, true);
      ctx.drawImage(art ? art.roof : this.roofs[(r.seed >> 2) % this.roofs.length], X0, Y0, X1 - X0, Y1 - Y0);
      if (this.weather === 'snow') { ctx.fillStyle = 'rgba(248,251,255,.5)'; ctx.fillRect(X0 + 3, Y0 + 3, X1 - X0 - 6, Y1 - Y0 - 6); }
      if (r.sign && !r.noRoofSign) {
        const img = rectSign(r);
        const b = roofSignBox(r, img);
        ctx.drawImage(img, b.x, b.y, b.w, b.h);
      }
      if (r.sign && r.landmark) {
        const img = rectSign(r);
        const b = facadeSignBox(r, img, cy);
        if (b) ctx.drawImage(img, b.x, b.y, b.w, b.h);
      }
    }
  }

  // Yüksek binanın kameraya bakan duvarları. tex: { n, e } dokusu. shadeIt: gölge katmanı (gündüz)
  tallWalls(r, tex, art, cx, cy, N, shadeIt) {
    const ctx = this.ctx;
    const x0 = r.x; const x1 = r.x + r.w; const y0 = r.y; const y1 = r.y + r.h;
    const X0 = r.tX0; const X1 = r.tX1; const Y0 = r.tY0; const Y1 = r.tY1;
    const nW = art ? tex.n.width : Math.min(96, r.w);
    const eH = art ? tex.e.height : Math.min(96, r.h);
    // Güney ve kuzey duvarları
    if (cy > y1 || cy < y0) {
      const fromY = cy > y1 ? y1 : y0; const toY = cy > y1 ? Y1 : Y0;
      for (let t = 0; t < N; t++) {
        const a = t / N; const b = (t + 1) / N;
        const xa = x0 + (X0 - x0) * b; const xb = x1 + (X1 - x1) * b;
        const ya = fromY + (toY - fromY) * a; const yb = fromY + (toY - fromY) * b;
        ctx.drawImage(tex.n, 0, 192 * (1 - b), nW, 192 / N, xa, Math.min(ya, yb) - 0.4, xb - xa, Math.abs(yb - ya) + 0.8);
      }
      if (shadeIt && cy < y0) { ctx.fillStyle = 'rgba(0,0,20,.28)'; ctx.fillRect(Math.min(x0, X0), Y0, Math.max(x1, X1) - Math.min(x0, X0), y0 - Y0); }
    }
    // Doğu ve batı duvarları
    if (cx > x1 || cx < x0) {
      const fromX = cx > x1 ? x1 : x0; const toX = cx > x1 ? X1 : X0;
      for (let t = 0; t < N; t++) {
        const a = t / N; const b = (t + 1) / N;
        const ya = y0 + (Y0 - y0) * b; const yb = y1 + (Y1 - y1) * b;
        const xa = fromX + (toX - fromX) * a; const xc = fromX + (toX - fromX) * b;
        ctx.drawImage(tex.e, 192 * (1 - b), 0, 192 / N, eH, Math.min(xa, xc) - 0.4, ya, Math.abs(xc - xa) + 0.8, yb - ya);
      }
      if (shadeIt) {
        ctx.fillStyle = 'rgba(0,0,20,.16)';
        ctx.beginPath(); ctx.moveTo(fromX, y0); ctx.lineTo(toX, Y0); ctx.lineTo(toX, Y1); ctx.lineTo(fromX, y1); ctx.closePath(); ctx.fill();
      }
    }
  }

  // Balkon hayatı: yalnızca oyuncu yakınındaki apartmanlarda, sınırlı sayıda. Geceleri içeri girerler
  drawBalconies(game, now, c0x, c1x, c0y, c1y, tall) {
    const B = CONFIG.balcony;
    const night = game.daylight.k;
    const maxDrawn = Math.round(B.maxDrawn * this.lod.balcony);
    if (night > 0.75 || maxDrawn <= 0) return;
    const ctx = this.ctx;
    const sp = this.sprites;
    const p = game.player;
    const cam = game.cam;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    ctx.globalAlpha = 1 - night / 0.75;
    let drawn = 0;
    const R2 = B.range * B.range;
    const swing = Math.floor(now / 260);
    for (let cy = c0y; cy <= c1y && drawn < maxDrawn; cy++) {
      for (let cx = c0x; cx <= c1x && drawn < maxDrawn; cx++) {
        const c = game.world.chunks.get((cx + 32768) * 65536 + (cy + 32768));
        if (!c) continue;
        for (let bi = 0; bi < c.balc.length; bi++) {
          const r = c.balc[bi];
          if (!r.alive || drawn >= maxDrawn || (r.tall > 0) !== tall) continue;
          const mx = r.x + r.w / 2; const my = r.y + r.h;
          const dx = mx - p.x; const dy = my - p.y;
          if (dx * dx + dy * dy > R2) continue;
          // Yüksek binada güney duvarı kameraya bakıyorsa duvara, değilse cepheye yerleşir
          const k = r.tall;
          if (k && cam.y <= my) continue;
          const slots = 1 + (r.seed % 3);
          for (let i = 0; i < slots; i++) {
            const h = ((r.seed * (i + 3) * 2654435761) >>> 0) / 4294967296;
            const u = 0.14 + ((i + h * 0.7) / slots) * 0.74;
            const b = k ? 0.3 + ((r.seed >> (i + 1)) % 5) * 0.11 : 0;
            const x0 = r.x + r.w * u;
            const fx = k ? x0 + (x0 - cam.x) * k * b : x0;
            const fy = k ? my + (my - cam.y) * k * b : my - 7;
            const q = 1 + (k ? k * b : 0);
            if (h < 0.34) {
              ctx.drawImage(sp.washing[(swing + i + (r.seed & 3)) % 3], fx - 15 * q, fy - 15 * q, 30 * q, 18 * q);
            } else {
              const act = sp.balcony[Math.floor(h * 97) % 4];
              ctx.drawImage(act[Math.floor(now / 480 + h * 7) & 1], fx - 10 * q, fy - 21 * q, 20 * q, 24 * q);
            }
            drawn++;
          }
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // Yangın: en fazla birkaç alev karesi, parçacık harcamaz
  drawFires(game, now, c0x, c1x, c0y, c1y) {
    const ctx = this.ctx;
    const sp = this.sprites;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    const fr = Math.floor(now / 110);
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = game.world.chunk(cx, cy);
        for (const r of c.fires) {
          if (!r.alive) continue;
          for (let i = 0; i < 3; i++) {
            const x = r.x + r.w * (0.22 + i * 0.28);
            const y = r.y + r.h * (0.3 + ((r.seed + i * 3) % 4) * 0.13);
            for (let k = 0; this.lod.fireSmoke && k < 2; k++) {
              const t = ((now * 0.00035 + k * 0.5 + i * 0.3) % 1);
              ctx.globalAlpha = 0.5 * (1 - t);
              const R = 18 + t * 46;
              ctx.drawImage(sp.dark, x + t * 26 - R, y - 26 - t * 100 - R, R * 2, R * 2);
            }
            ctx.globalAlpha = 1;
            const img = this.flames[(fr + i) % 3];
            const q = 0.9 + 0.12 * Math.sin(now * 0.012 + i);
            ctx.drawImage(img, x - 22 * q, y - 42 * q, 44 * q, 60 * q);
          }
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  makeSprites() {
    const P = CONFIG.police;
    const s = this.sprites;
    this.makePatterns();
    this.makeTallArt();
    s.car = sprite(P.car.len + 8, P.car.wid + 8, (g) => paintPolice(g, P.car, false));
    s.fast = sprite(P.fast.len + 10, P.fast.wid + 10, (g) => paintPoliceFast(g, P.fast));
    s.moto = sprite(P.moto.len + 12, P.moto.wid + 14, (g) => paintMoto(g, P.moto));
    s.advanced = sprite(P.advanced.len + 8, P.advanced.wid + 8, (g) => paintPolice(g, P.advanced, true));
    s.swat = sprite(P.swat.len + 8, P.swat.wid + 8, (g) => paintSwat(g, P.swat));
    s.tank = sprite(P.tank.len + 8, P.tank.wid + 8, (g) => paintTankHull(g, P.tank));
    s.turret = sprite(150, 50, paintTurret);
    // Uzaylı arabaları: türe göre ayrı görünüş
    for (const [k, spec] of Object.entries(CONFIG.aliens.types)) s[k] = sprite(spec.len + 18, spec.wid + 18, (g) => paintAlien(g, spec, k));
    // Meteor: kızgın kaya, alev kuyruğu yukarıda (gökten iner)
    s.meteor = sprite(70, 110, (g) => {
      const tail = g.createLinearGradient(0, -52, 0, 6);
      tail.addColorStop(0, 'rgba(255,90,20,0)'); tail.addColorStop(0.6, 'rgba(255,150,40,.75)'); tail.addColorStop(1, 'rgba(255,240,180,.95)');
      g.fillStyle = tail; g.beginPath(); g.moveTo(-9, -52); g.lineTo(9, -52); g.lineTo(20, 4); g.lineTo(-20, 4); g.closePath(); g.fill();
      const rock = g.createRadialGradient(-6, 0, 3, 0, 8, 24);
      rock.addColorStop(0, '#ffcf6b'); rock.addColorStop(0.35, '#a0522d'); rock.addColorStop(1, '#3a2418');
      g.fillStyle = rock; g.beginPath();
      for (let i = 0; i < 11; i++) { const a = (i / 11) * 6.283; const q = 19 + (i % 3) * 3; g[i ? 'lineTo' : 'moveTo'](Math.cos(a) * q, 10 + Math.sin(a) * q); }
      g.closePath(); g.fill();
      g.strokeStyle = '#ffb347'; g.lineWidth = 1.4; g.stroke();
      g.fillStyle = 'rgba(40,20,10,.6)'; g.beginPath(); g.arc(6, 14, 4, 0, 7); g.arc(-7, 6, 3, 0, 7); g.fill();
    });
    s.shadow = sprite(60, 34, (g) => {
      g.fillStyle = 'rgba(0,0,0,1)';
      rr(g, -28, -15, 56, 30, 9);
      g.fill();
    });
    s.red = glow(128, [[0, 'rgba(255,40,50,.9)'], [0.35, 'rgba(255,30,50,.35)'], [1, 'rgba(255,0,40,0)']]);
    s.blue = glow(128, [[0, 'rgba(60,110,255,.9)'], [0.35, 'rgba(40,90,255,.35)'], [1, 'rgba(0,40,255,0)']]);
    s.smoke = glow(64, [[0, 'rgba(235,235,235,.75)'], [0.6, 'rgba(220,220,220,.35)'], [1, 'rgba(210,210,210,0)']]);
    s.dark = glow(64, [[0, 'rgba(40,40,44,.9)'], [0.6, 'rgba(40,40,44,.5)'], [1, 'rgba(30,30,34,0)']]);
    s.fire = glow(64, [[0, 'rgba(255,245,190,1)'], [0.3, 'rgba(255,170,40,.9)'], [0.7, 'rgba(255,70,10,.45)'], [1, 'rgba(200,30,0,0)']]);
    s.dust = glow(64, [[0, 'rgba(205,175,125,.7)'], [1, 'rgba(205,175,125,0)']]);
    s.water = glow(64, [[0, 'rgba(235,250,255,.9)'], [1, 'rgba(180,230,255,0)']]);
    s.orb = glow(48, [[0, 'rgba(255,255,255,1)'], [0.25, 'rgba(120,240,255,.95)'], [0.6, 'rgba(255,60,200,.45)'], [1, 'rgba(255,40,180,0)']]);
    s.reticle = reticleSprite();
    s.launcher = sprite(26, 14, (g) => { g.fillStyle = '#16181e'; rr(g, -8, -5, 14, 10, 3); g.fill(); g.fillStyle = '#2a2f38'; g.fillRect(2, -2.2, 10, 1.8); g.fillRect(2, 0.4, 10, 1.8); g.fillStyle = '#ffd23f'; g.fillRect(11, -2.4, 1.6, 4.8); g.fillStyle = '#21e6ff'; g.fillRect(-6, -1, 4, 2); });
    s.glint = glow(32, [[0, 'rgba(255,255,220,1)'], [0.4, 'rgba(255,215,70,.8)'], [1, 'rgba(255,200,0,0)']]);

    const prop = (w, h, paint) => sprite(w, h, paint);
    s.npc = {}; // İlk görüldüğünde çizilir: açılış kısa kalır
    // Yarısı erkek, yarısı kadın: kıyafet, ten, saç ve aksesuar birleşimi
    const SHIRT = ['#e8533f', '#3e7cb1', '#f2c14e', '#4f9d69', '#2f3440', '#ececec', '#8a5a3a', '#d94f9c', '#7a5ea8', '#2fa8a0', '#f08a3c', '#a8c64a', '#e84a5f', '#4a7ce0', '#55607a', '#c9b48a'];
    const SKIN = ['#e0a878', '#f0c8a0', '#8d5a3a', '#d9a06a', '#c08a5e'];
    const HAIR = ['#3b2a1e', '#6b4a2b', '#16131a', '#c9a24a', '#2b2b33', '#55595f', '#a8552a', '#d9d4c7'];
    const half = CONFIG.peds.looks >> 1;
    s.peds = [];
    for (let i = 0; i < CONFIG.peds.looks; i++) {
      const woman = i >= half;
      const shirt = SHIRT[(i * 7 + 3) % SHIRT.length];
      const skin = SKIN[(i * 3) % SKIN.length];
      const hair = HAIR[(i * 5 + 1) % HAIR.length];
      const acc = woman ? [0, 2, 5, 4, 2, 5, 3][i % 7] : [0, 1, 3, 6, 0, 1, 4][i % 7];
      s.peds.push([0, 1].map((step) => sprite(20, 20, (g) => paintPed(g, shirt, skin, hair, step, acc))));
    }
    s.pedKinds = {};
    for (const k of Object.keys(CONFIG.peds.kinds)) {
      if (k === 'man' || k === 'woman') continue;
      s.pedKinds[k] = [0, 1].map((step) => sprite(34, 34, (g) => paintPedKind(g, k, step)));
    }
    s.simit = sprite(16, 16, paintSimit);
    // Dükkân önü: döner şişi, afişler, üç renk şişme balon
    s.doner = [0, 1, 2, 3].map((f) => sprite(18, 24, (g) => paintDoner(g, f)));
    s.promos = CONFIG.signs.promos.map((t, i) => sprite(44, 26, (g) => paintPromo(g, t, i)));
    s.dancers = ['#e8352e', '#ffd23f', '#21a9e0'].map((c) => [0, 1, 2, 3, 4, 5].map((f) => sprite(46, 78, (g) => paintDancer(g, c, f))));
    // Balkon: çay içen, el sallayan, çiçek sulayan, çamaşır asan ve sallanan çamaşır
    s.balcony = ['tea', 'wave', 'water', 'hang'].map((a) => [0, 1].map((f) => sprite(20, 24, (g) => paintBalcony(g, a, f, SHIRT[(a.length * 3 + f * 0) % SHIRT.length]))));
    s.washing = [0, 1, 2].map((f) => sprite(30, 18, (g) => paintWashing(g, f)));
    // Gökyüzü: yıldızlar iki kümede, sırayla parıldar
    s.moon = sprite(44, 44, paintMoon);
    s.stars = [11, 37].map((seed) => sprite(320, 90, (g) => paintStars(g, seed)));
    s.tail = glow(32, [[0, 'rgba(255,50,40,.85)'], [0.5, 'rgba(255,30,30,.3)'], [1, 'rgba(255,20,20,0)']]);
    s.lamp = glow(96, [[0, 'rgba(255,225,150,.75)'], [0.3, 'rgba(255,200,110,.3)'], [1, 'rgba(255,180,80,0)']]);
    s.win = glow(48, [[0, 'rgba(255,214,130,.95)'], [0.6, 'rgba(255,190,100,.35)'], [1, 'rgba(255,170,80,0)']]);
    s.neons = CONFIG.signs.neon.map((c) => glow(96, [[0, `${c}cc`], [0.45, `${c}55`], [1, `${c}00`]]));
    s.beam = sprite(150, 90, (g) => {
      const b = g.createLinearGradient(0, 0, 70, 0);
      b.addColorStop(0, 'rgba(255,245,200,.55)');
      b.addColorStop(1, 'rgba(255,245,200,0)');
      g.fillStyle = b;
      g.beginPath(); g.moveTo(0, -6); g.lineTo(72, -34); g.lineTo(72, 34); g.lineTo(0, 6); g.closePath(); g.fill();
    });
    s.lights = ['r', 'y', 'g'].map((st) => sprite(12, 26, (g) => paintLight(g, st)));
    s.props = [];
    s.props[PROP.PALM] = prop(70, 70, (g) => {
      g.fillStyle = 'rgba(0,0,0,.18)';
      g.beginPath(); g.ellipse(8, 9, 20, 18, 0, 0, 7); g.fill();
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * 6.283 + 0.3;
        g.save(); g.rotate(a);
        g.fillStyle = i % 2 ? '#4ea03a' : '#6fbc47';
        g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(13, -7.5, 25, 0); g.quadraticCurveTo(13, 6, 0, 0); g.fill();
        g.restore();
      }
      g.fillStyle = '#9a6b3f';
      g.beginPath(); g.arc(0, 0, 3.6, 0, 7); g.fill();
    });
    s.props[PROP.UMBRELLA] = prop(56, 56, (g) => {
      g.fillStyle = '#f7f1e3'; g.fillRect(9, 3, 11, 17); // Havlu
      g.fillStyle = '#3fa7d6'; g.fillRect(9, 8, 11, 4);
      g.fillStyle = 'rgba(0,0,0,.16)';
      g.beginPath(); g.arc(3, 4, 15, 0, 7); g.fill();
      for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 ? '#fff' : '#ff5a4d';
        g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 15, (i / 8) * 6.283, ((i + 1) / 8) * 6.283); g.fill();
      }
    });
    s.props[PROP.PINE] = prop(64, 64, (g) => {
      g.fillStyle = 'rgba(0,0,0,.24)';
      g.beginPath(); g.arc(7, 8, 20, 0, 7); g.fill();
      for (const [r, c] of [[21, '#1f5e38'], [15, '#2b7846'], [9, '#3b9558']]) {
        g.fillStyle = c;
        g.beginPath();
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * 6.283;
          const rad = i % 2 ? r : r * 0.74;
          g.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        }
        g.closePath();
        g.fill();
      }
    });
    s.props[PROP.ROCK] = prop(44, 44, (g) => {
      g.fillStyle = 'rgba(0,0,0,.22)';
      g.beginPath(); g.ellipse(3, 4, 16, 13, 0, 0, 7); g.fill();
      g.fillStyle = '#8e8a84';
      g.beginPath(); g.moveTo(-15, 3); g.lineTo(-9, -11); g.lineTo(5, -13); g.lineTo(15, -3); g.lineTo(11, 10); g.lineTo(-7, 12); g.closePath(); g.fill();
      g.fillStyle = '#b4b0a8';
      g.beginPath(); g.moveTo(-9, -8); g.lineTo(4, -10); g.lineTo(8, -2); g.lineTo(-4, 1); g.closePath(); g.fill();
    });
    s.props[PROP.CACTUS] = prop(36, 36, (g) => {
      g.fillStyle = 'rgba(0,0,0,.2)';
      g.beginPath(); g.ellipse(4, 5, 7, 11, 0, 0, 7); g.fill();
      g.fillStyle = '#3f9a5c';
      rr(g, -3.5, -11, 7, 22, 3.5); g.fill();
      rr(g, -11, -5, 8, 5, 2.5); g.fill();
      rr(g, 3, -1, 8, 5, 2.5); g.fill();
      rr(g, -11, -10, 4.4, 9, 2.2); g.fill();
      rr(g, 7, -7, 4.4, 9, 2.2); g.fill();
      g.fillStyle = '#74c98e';
      g.fillRect(-1, -10, 1.6, 19);
    });
    s.props[PROP.HAY] = prop(34, 34, (g) => {
      g.fillStyle = 'rgba(0,0,0,.2)';
      g.beginPath(); g.arc(3, 4, 12, 0, 7); g.fill();
      g.fillStyle = '#e0c060';
      g.beginPath(); g.arc(0, 0, 12, 0, 7); g.fill();
      g.strokeStyle = '#b8922e';
      g.lineWidth = 1.6;
      for (const r of [4, 8]) { g.beginPath(); g.arc(0, 0, r, 0.4, 5.6); g.stroke(); }
    });
    s.props[PROP.CHAIRS] = prop(46, 46, (g) => {
      // Plastik masa ve dört sandalye, üstünde ince belli çay
      g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(-9, -7, 22, 22);
      for (const [x, y] of [[-14, 0], [14, 0], [0, -14], [0, 14]]) { g.fillStyle = '#d9281e'; rr(g, x - 5, y - 5, 10, 10, 2.5); g.fill(); g.fillStyle = '#f04a3e'; rr(g, x - 3, y - 3, 6, 6, 1.5); g.fill(); }
      g.fillStyle = '#f4f6f8'; rr(g, -9, -9, 18, 18, 3); g.fill();
      for (const [x, col] of [[-14, '#3e7cb1'], [14, '#8a5a3a']]) { g.fillStyle = col; g.beginPath(); g.ellipse(x, 0, 4, 5, 0, 0, 7); g.fill(); g.fillStyle = '#e0a878'; g.beginPath(); g.arc(x, 0, 2.5, 0, 7); g.fill(); }
      g.fillStyle = '#b5481f'; g.beginPath(); g.arc(-3, -2, 2.2, 0, 7); g.arc(4, 3, 2.2, 0, 7); g.fill();
    });
    s.props[PROP.QUEUE] = prop(76, 36, (g) => {
      // Mekân önü: siyah takım güvenlik ve sıra bekleyen kalabalık
      g.fillStyle = '#c62828'; g.fillRect(-34, -6, 12, 2);
      g.fillStyle = '#e8c547'; g.fillRect(-35, -8, 2, 6); g.fillRect(-23, -8, 2, 6);
      g.fillStyle = '#11131a'; g.beginPath(); g.ellipse(-30, 5, 6, 6.5, 0, 0, 7); g.fill();
      g.fillStyle = '#e0a878'; g.beginPath(); g.arc(-30, 5, 3, 0, 7); g.fill();
      const cols = ['#e8533f', '#3e7cb1', '#f2c14e', '#7a5ea8', '#4f9d69', '#e87ab0'];
      for (let i = 0; i < 6; i++) {
        g.fillStyle = cols[i]; g.beginPath(); g.ellipse(-14 + i * 9, (i % 2) * 3, 3.6, 4.6, 0, 0, 7); g.fill();
        g.fillStyle = i % 3 ? '#e0a878' : '#8d5a3a'; g.beginPath(); g.arc(-14 + i * 9, (i % 2) * 3, 2, 0, 7); g.fill();
      }
    });
    s.props[PROP.UNCLES] = prop(52, 40, (g) => {
      // Apartman önünde iki amca ve tabure
      for (const [x, col] of [[-10, '#5c6b7a'], [10, '#7a6a55']]) {
        g.fillStyle = '#6b4a2b'; rr(g, x - 6, -5, 12, 11, 2); g.fill();
        g.fillStyle = col; g.beginPath(); g.ellipse(x, 1, 6, 5.4, 0, 0, 7); g.fill();
        g.fillStyle = '#e0a878'; g.beginPath(); g.arc(x, -1, 3, 0, 7); g.fill();
        g.fillStyle = '#dfe3e8'; g.beginPath(); g.arc(x - 0.6, -1.4, 2.2, 0, 7); g.fill();
      }
      g.fillStyle = '#c9622b'; g.beginPath(); g.arc(0, 2, 1.8, 0, 7); g.fill();
    });
    s.props[PROP.SIMITCART] = prop(44, 36, (g) => {
      g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(-14, -7, 32, 20);
      g.fillStyle = '#c62828'; rr(g, -16, -10, 32, 20, 3); g.fill();
      g.fillStyle = '#f5e6b8'; rr(g, -13, -7, 26, 14, 2); g.fill();
      for (const [x, y] of [[-8, -3], [0, -3], [8, -3], [-4, 3], [4, 3]]) { g.strokeStyle = '#b5742a'; g.lineWidth = 2.4; g.beginPath(); g.arc(x, y, 2.6, 0, 7); g.stroke(); }
    });
    s.props[PROP.STALL] = prop(46, 40, (g) => {
      g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(-15, -10, 36, 26);
      for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#fff' : '#1d9a4f'; g.fillRect(-18 + i * 6, -13, 6, 26); }
      g.fillStyle = 'rgba(0,0,0,.1)'; g.fillRect(-18, 3, 36, 10);
      for (const [x, y, col] of [[-9, -5, '#e8352e'], [0, 2, '#ff9d1a'], [9, -6, '#7fc241'], [-5, 5, '#ffd23f']]) { g.fillStyle = col; g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); }
    });
    s.props[PROP.LAUNDRY] = prop(90, 26, (g) => {
      // Sokak üstünde ip: yukarıdan görünen çamaşırlar
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-42, -2); g.quadraticCurveTo(0, 3, 42, -2); g.stroke();
      const cols = ['#f4f6f8', '#e8533f', '#3e7cb1', '#f2c14e', '#7a5ea8', '#4f9d69'];
      for (let i = 0; i < 6; i++) { g.fillStyle = cols[i]; g.fillRect(-34 + i * 12, -1, 9, 9 + (i % 2) * 3); }
    });
    s.auras = [];
    for (const [i, name] of ['blast', 'ghost', 'heal', 'giant'].entries()) {
      s.props[PROP.POWER_BLAST + i] = prop(40, 40, (g) => paintPower(g, name));
      const col = POWER_LOOK[name].color;
      s.auras[i] = glow(96, [[0, `${col}cc`], [0.55, `${col}55`], [1, `${col}00`]]);
    }
    s.props[PROP.TREE] = prop(64, 64, (g) => {
      g.fillStyle = 'rgba(0,0,0,.2)';
      g.beginPath(); g.ellipse(6, 7, 21, 19, 0, 0, 7); g.fill();
      g.fillStyle = '#3f8f35';
      g.beginPath(); g.arc(0, 0, 21, 0, 7); g.fill();
      g.fillStyle = '#58ad45';
      g.beginPath(); g.arc(-4, -4, 15, 0, 7); g.fill();
      g.fillStyle = '#7ecb5e';
      g.beginPath(); g.arc(-7, -8, 8, 0, 7); g.fill();
    });
    s.props[PROP.BUSH] = prop(36, 36, (g) => {
      g.fillStyle = 'rgba(0,0,0,.18)';
      g.beginPath(); g.ellipse(3, 4, 11, 10, 0, 0, 7); g.fill();
      g.fillStyle = '#4f9a3a';
      g.beginPath(); g.arc(0, 0, 11, 0, 7); g.fill();
      g.fillStyle = '#74bf58';
      g.beginPath(); g.arc(-3, -3, 6, 0, 7); g.fill();
    });
    s.props[PROP.FENCE] = prop(44, 14, (g) => {
      g.fillStyle = '#e8d3ac';
      g.fillRect(-20, -1.5, 40, 3);
      g.fillStyle = '#c79a5b';
      for (let x = -20; x <= 20; x += 8) g.fillRect(x - 1.5, -3.5, 3, 7);
    });
    s.props[PROP.CRATE] = prop(30, 30, (g) => {
      g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(-9, -9, 22, 22);
      g.fillStyle = '#c99656'; g.fillRect(-11, -11, 22, 22);
      g.strokeStyle = '#8a5f2f'; g.lineWidth = 2; g.strokeRect(-10, -10, 20, 20);
      g.beginPath(); g.moveTo(-10, -10); g.lineTo(10, 10); g.stroke();
    });
    s.props[PROP.BARREL] = prop(30, 30, (g) => {
      g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.arc(3, 3, 10, 0, 7); g.fill();
      g.fillStyle = '#e0562f'; g.beginPath(); g.arc(0, 0, 10, 0, 7); g.fill();
      g.strokeStyle = '#a23514'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#ffd23f'; g.fillRect(-6, -1.5, 12, 3);
    });
    s.props[PROP.CONE] = prop(20, 20, (g) => {
      g.fillStyle = '#ff8a2a'; g.fillRect(-6, -6, 12, 12);
      g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 4, 0, 7); g.fill();
      g.fillStyle = '#ff5e1a'; g.beginPath(); g.arc(0, 0, 2.2, 0, 7); g.fill();
    });
    s.props[PROP.BARRIER] = prop(52, 20, (g) => {
      g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(-20, -5, 44, 13);
      g.fillStyle = '#eef1f4'; rr(g, -22, -7, 44, 13, 2); g.fill();
      g.fillStyle = '#e23c3c';
      for (let x = -20; x < 20; x += 10) g.fillRect(x, -7, 5, 13);
    });
    s.props[PROP.HYDRANT] = prop(20, 20, (g) => {
      g.fillStyle = '#e23c3c'; g.beginPath(); g.arc(0, 0, 6, 0, 7); g.fill();
      g.fillStyle = '#ffd5d5'; g.beginPath(); g.arc(-1, -1, 2, 0, 7); g.fill();
    });
    s.props[PROP.BENCH] = prop(32, 16, (g) => {
      g.fillStyle = '#9a6b3f'; g.fillRect(-12, -4, 24, 8);
      g.fillStyle = '#c29465'; g.fillRect(-12, -4, 24, 2);
    });
    s.parked = ['#6a7aa0', '#b0504a', '#d6c56b', '#59a58c', '#dddddd'].map((col) => sprite(54, 32, (g) => paintCar(g, 44, 24, col, col)));
    s.coin = sprite(32, 32, (g) => {
      g.fillStyle = '#b8860b'; g.beginPath(); g.arc(0, 1, 10.5, 0, 7); g.fill();
      g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(0, 0, 10, 0, 7); g.fill();
      g.fillStyle = '#ffec8a'; g.beginPath(); g.arc(-2, -2, 6, 0, 7); g.fill();
      g.fillStyle = '#c9920f'; g.font = 'bold 12px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('₺', 0, 0.5);
    });
  }

  // --- Chunk önbelleği: zemin ve binalar bir kez çizilir ---
  getBakeCanvas() {
    const size = Math.ceil(CHUNK * PF.bakeScale);
    if (this.canvasPool.length) return this.canvasPool.pop();
    if (this.bakedCount < PF.bakePool) {
      this.bakedCount++;
      return makeCanvas(size, size);
    }
    // En uzun süredir görünmeyeni boşalt
    let old = null;
    for (const c of this.baked) if (!old || c.lastSeen < old.lastSeen) old = c;
    const canvas = old.canvas;
    old.canvas = null;
    this.baked.splice(this.baked.indexOf(old), 1);
    return canvas;
  }

  // Chunk çizimi dilimlere bölünür: tek karede donma olmasın
  startJob(c) {
    if (!c.canvas) {
      c.canvas = this.getBakeCanvas();
      this.baked.push(c);
    }
    this.job = { c, phase: 0, i: 0 };
  }

  // Bir birim iş yapar; bitince true döner
  jobUnit() {
    const j = this.job;
    const c = j.c;
    const g = c.canvas.getContext('2d');
    const k = PF.bakeScale;
    g.setTransform(k, 0, 0, k, -c.x * k, -c.y * k);
    if (j.phase === 0) { this.bakeGround(g, c); j.phase = 1; return false; }
    if (j.phase === 1) {
      for (let i = 0; i < c.rectCount; i++) if (!c.rects[i].alive) this.bakeRubble(g, c.rects[i]);
      for (let i = 0; i < c.rectCount; i++) {
        const r = c.rects[i];
        if (r.alive && r.kind === 'water') this.bakeWater(g, r);
      }
      for (let i = 0; i < c.rectCount; i++) {
        const r = c.rects[i];
        if (r.alive && r.kind === 'building') {
          const k2 = r.tall ? shadowOf(r) : TALL_STYLES.has(r.style) ? 2.4 : shadowOf(r);
          g.fillStyle = 'rgba(0,10,30,.26)';
          rr(g, r.x + 12 * k2, r.y + 15 * k2, r.w, r.h, 5);
          g.fill();
        }
      }
      j.phase = 2;
      return false;
    }
    while (j.i < c.rectCount) {
      const r = c.rects[j.i++];
      if (!r.alive) continue;
      if (r.kind === 'building') { this.bakeBuilding(g, r); return false; }
      if (r.kind === 'wall') this.bakeWall(g, r);
    }
    if (this.weather === 'snow' || this.weather === 'ice') this.bakeWeather(g, c);
    c.dirty = false;
    this.job = null;
    return true;
  }

  // Görünen chunk hazır değilse beklenmez: işi hemen bitirir
  bake(c) {
    if (!this.job || this.job.c !== c) this.startJob(c);
    while (!this.jobUnit());
  }

  // Kare başına bütçe kadar arka plan çizimi
  stepJob(ms) {
    const t0 = performance.now();
    while (this.job) {
      this.job.c.lastSeen = this.frameId;
      this.jobUnit();
      if (performance.now() - t0 >= ms) break;
    }
  }

  bakeGround(g, c) {
    // Biyoma göre palet. Su karosu kıyı rengindedir; yuvarlak gölet köşelerinde mavi taşmasın
    const pal = BIOME_COLORS[c.biome];
    const urban = c.biome === 'city';
    const sea = c.template === 'sea';
    const shore = sea ? '#1f8fd6' : c.template === 'lake' ? pal.sand : c.template === 'plaza' ? '#e5d7bf' : pal.grass;
    const colors = [pal.grass, pal.road, '#cdd2d6', '#e5d7bf', shore, pal.sand, pal.dirt, '#5fd3e6', '#c9ae4c', '#70747a', '#cdd2d6'];
    const roads = this.roads[urban ? c.road : 1];
    const alleys = this.alleys[c.alley];
    const fieldGreen = (c.cx + c.cy) & 1;
    for (let y = 0; y < CT; y++) {
      for (let x = 0; x < CT; x++) {
        const t = c.ground[y * CT + x];
        g.fillStyle = colors[t];
        const px = c.x + x * TILE;
        const py = c.y + y * TILE;
        g.fillRect(px, py, TILE + 1, TILE + 1);
        const h = ((x * 73856093) ^ (y * 19349663) ^ (c.cx * 83492791) ^ (c.cy * 49979693)) >>> 0;
        if (t === GROUND.ROAD) { g.drawImage(roads[h & 3], px, py, TILE + 1, TILE + 1); continue; }
        if (t === GROUND.ALLEY) { g.drawImage(alleys[h & 3], px, py, TILE + 1, TILE + 1); continue; }
        if (t === GROUND.FIELD) {
          // Tarla sıraları
          if (fieldGreen) { g.fillStyle = '#7fae3f'; g.fillRect(px, py, TILE + 1, TILE + 1); }
          g.fillStyle = fieldGreen ? 'rgba(40,90,20,.35)' : 'rgba(120,80,20,.3)';
          for (let k = 3; k < TILE; k += 9) g.fillRect(px, py + k, TILE, 3);
        } else if (t === GROUND.WATER && sea) {
          g.fillStyle = 'rgba(255,255,255,.14)';
          g.fillRect(px + (h % 26), py + ((h >>> 7) % 34), 14, 2.5);
          g.fillStyle = 'rgba(0,50,110,.12)';
          g.fillRect(px + ((h >>> 3) % 20), py + ((h >>> 11) % 30), 20, 6);
        } else if (t === GROUND.SHALLOW) {
          g.fillStyle = 'rgba(255,255,255,.2)';
          g.fillRect(px + (h % 24), py + ((h >>> 9) % 32), 12, 2);
        } else if (t === GROUND.GRASS) {
          g.fillStyle = h & 1 ? 'rgba(40,120,40,.05)' : 'rgba(170,230,110,.07)';
          g.fillRect(px, py, TILE, TILE);
          g.fillStyle = 'rgba(30,100,40,.3)';
          for (let k = 0; k < 3; k++) {
            const m = (h >>> (k * 7)) & 127;
            const n = (h >>> (k * 5 + 3)) & 127;
            g.fillRect(px + (m % 36), py + (n % 36), 3, 3);
          }
        } else if (t === GROUND.WALK) {
          g.strokeStyle = 'rgba(90,100,110,.2)';
          g.lineWidth = 1;
          g.strokeRect(px + 0.5, py + 0.5, TILE, TILE);
        } else if (t === GROUND.PLAZA) {
          if ((x + y) & 1) { g.fillStyle = 'rgba(190,120,80,.2)'; g.fillRect(px, py, TILE, TILE); }
        } else if (t === GROUND.SAND || t === GROUND.DIRT) {
          g.fillStyle = 'rgba(120,90,50,.16)';
          g.fillRect(px + (h % 30), py + ((h >>> 8) % 30), 4, 3);
          g.fillRect(px + ((h >>> 4) % 30), py + ((h >>> 12) % 30), 3, 2);
        }
      }
    }
    // Kavşak öncesi dur çizgileri
    if (urban) {
      g.fillStyle = 'rgba(255,255,255,.85)';
      g.fillRect(c.x + 4, c.y + ART_W + 24, ART_W / 2 - 6, 4);
      g.fillRect(c.x + ART_W + 24, c.y + ART_W / 2 + 2, 4, ART_W / 2 - 6);
      g.fillRect(c.x + ART_W / 2 + 2, c.y - 28, ART_W / 2 - 6, 4);
      g.fillRect(c.x - 28, c.y + 4, 4, ART_W / 2 - 6);
    }
    // Sığ su kıyısında köpük
    if (sea) {
      g.fillStyle = 'rgba(255,255,255,.7)';
      for (let y = 1; y < CT - 1; y++) {
        for (let x = 1; x < CT - 1; x++) {
          if (c.ground[y * CT + x] !== GROUND.SHALLOW) continue;
          const px = c.x + x * TILE;
          const py = c.y + y * TILE;
          if (c.ground[y * CT + x - 1] === GROUND.SAND) g.fillRect(px - 1, py, 4, TILE);
          if (c.ground[y * CT + x + 1] === GROUND.SAND) g.fillRect(px + TILE - 3, py, 4, TILE);
          if (c.ground[(y - 1) * CT + x] === GROUND.SAND) g.fillRect(px, py - 1, TILE, 4);
          if (c.ground[(y + 1) * CT + x] === GROUND.SAND) g.fillRect(px, py + TILE - 3, TILE, 4);
        }
      }
    }
    // Yol kenarı: dar taş kaldırım bandı (sürülebilir) ve bordür
    const K = 11;
    const stone = urban || sea ? '#c6cace' : 'rgba(0,0,0,.2)';
    const lip = urban || sea ? '#eef1f4' : 'rgba(0,0,0,.25)';
    const open = (t) => t !== GROUND.ROAD && t !== GROUND.ALLEY && t !== GROUND.TRACK;
    const edge = (px, py, dx, dy) => {
      g.fillStyle = stone;
      if (dx > 0) g.fillRect(px + TILE - K, py, K, TILE);
      if (dx < 0) g.fillRect(px, py, K, TILE);
      if (dy > 0) g.fillRect(px, py + TILE - K, TILE, K);
      if (dy < 0) g.fillRect(px, py, TILE, K);
      g.fillStyle = lip;
      if (dx > 0) g.fillRect(px + TILE - K, py, 2, TILE);
      if (dx < 0) g.fillRect(px + K - 2, py, 2, TILE);
      if (dy > 0) g.fillRect(px, py + TILE - K, TILE, 2);
      if (dy < 0) g.fillRect(px, py + K - 2, TILE, 2);
    };
    for (let y = 0; y < CT; y++) {
      for (let x = 0; x < CT; x++) {
        if (c.ground[y * CT + x] !== GROUND.ROAD) continue;
        const px = c.x + x * TILE;
        const py = c.y + y * TILE;
        if (x < CT - 1 && open(c.ground[y * CT + x + 1])) edge(px, py, 1, 0);
        if (y < CT - 1 && open(c.ground[(y + 1) * CT + x])) edge(px, py, 0, 1);
      }
    }
    // Ana yol kenar çizgileri, kesik orta şerit, yön okları
    const mid = ART_W / 2;
    const yellow = '#ffd23f';
    for (let d = ART_W + 30; d < CHUNK - 40; d += 56) {
      g.fillStyle = yellow;
      g.fillRect(c.x + mid - 2, c.y + d, 4, 30);
      g.fillRect(c.x + d, c.y + mid - 2, 30, 4);
    }
    if (urban) {
      g.fillStyle = 'rgba(255,255,255,.75)';
      const arrow = (x, y, a) => {
        g.save(); g.translate(x, y); g.rotate(a);
        g.fillRect(-14, -2, 18, 4);
        g.beginPath(); g.moveTo(4, -7); g.lineTo(16, 0); g.lineTo(4, 7); g.closePath(); g.fill();
        g.restore();
      };
      const q = ART_W * 0.25;
      arrow(c.x + q, c.y + ART_W + 90, Math.PI / 2 * -1);
      arrow(c.x + ART_W - q, c.y + CHUNK - 90, Math.PI / 2);
      arrow(c.x + ART_W + 90, c.y + ART_W - q, 0);
      arrow(c.x + CHUNK - 90, c.y + q, Math.PI);
      this.bakeSigns(g, c);
    }
    g.fillStyle = 'rgba(255,255,255,.8)';
    for (let i = 8; i < ART_W - 8 && urban; i += 18) {
      g.fillRect(c.x + i, c.y + ART_W + 4, 9, 18);
      g.fillRect(c.x + ART_W + 4, c.y + i, 18, 9);
      g.fillRect(c.x + i, c.y - 22, 9, 18);
      g.fillRect(c.x - 22, c.y + i, 18, 9);
    }
    this.bakePads(g, c);
    this.bakePaths(g, c);
    if (c.hw) this.bakeHighway(g, c);
  }

  // Kıvrımlı yollar, U dönüşü, Y ayrımı ve dönel kavşak: yumuşak eğri olarak çizilir
  bakePaths(g, c) {
    if (!c.paths.length) return;
    const tones = CONFIG.world.roadTones;
    const col = tones[c.road];
    const stroke = (p) => {
      g.beginPath();
      for (let i = 0; i < p.pts.length; i += 2) {
        const x = c.x + p.pts[i] * TILE; const y = c.y + p.pts[i + 1] * TILE;
        if (i) g.lineTo(x, y); else g.moveTo(x, y);
      }
      if (p.ring) g.closePath();
    };
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (const p of c.paths) { stroke(p); g.strokeStyle = '#eef1f4'; g.lineWidth = p.w * TILE + 8; g.stroke(); }
    for (const p of c.paths) { stroke(p); g.strokeStyle = col; g.lineWidth = p.w * TILE; g.stroke(); }
    const light = c.road === 2;
    g.strokeStyle = light ? '#6d7076' : '#ffd23f'; g.lineWidth = 3; g.setLineDash([22, 18]);
    for (const p of c.paths) { stroke(p); g.stroke(); }
    g.setLineDash([]);
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (r.kind !== 'island') continue;
      const R0 = r.w / 2 + 6;
      g.fillStyle = '#eef1f4'; g.beginPath(); g.arc(r.cx, r.cy, R0 + 5, 0, 7); g.fill();
      g.fillStyle = '#6fae3e'; g.beginPath(); g.arc(r.cx, r.cy, R0, 0, 7); g.fill();
      g.fillStyle = '#4f9a3a'; for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.283; g.beginPath(); g.arc(r.cx + Math.cos(a) * R0 * 0.68, r.cy + Math.sin(a) * R0 * 0.68, 11, 0, 7); g.fill(); }
      g.fillStyle = '#e30a17'; g.beginPath(); g.arc(r.cx, r.cy, 13, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(r.cx, r.cy, 5, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,255,255,.8)';
      for (let k = 0; k < 4; k++) { const a = (k / 4) * 6.283 + 0.4; const q = R0 + 66; g.save(); g.translate(r.cx + Math.cos(a) * q, r.cy + Math.sin(a) * q); g.rotate(a + 1.57); g.fillRect(-12, -2, 16, 4); g.beginPath(); g.moveTo(4, -7); g.lineTo(15, 0); g.lineTo(4, 7); g.closePath(); g.fill(); g.restore(); }
    }
  }

  // Otoban: asfalt, şerit, emniyet şeridi, beton bariyer, yeşil tabela köprüsü
  bakeHighway(g, c) {
    const H = CONFIG.world.highway;
    const top = c.y + H.y0 * TILE; const bot = top + (H.half * 2 + 1) * TILE;
    const x0 = c.x + ART_W; const x1 = c.x + CHUNK;
    g.fillStyle = CONFIG.world.roadTones[0]; g.fillRect(x0, top, x1 - x0, bot - top);
    const side = H.half * TILE;
    const laneW = (side - 24) / H.lanes;
    g.fillStyle = '#fff'; g.fillRect(x0, top + 6, x1 - x0, 4); g.fillRect(x0, bot - 10, x1 - x0, 4);
    g.fillStyle = '#ffd23f'; g.fillRect(x0, top + side - 8, x1 - x0, 3); g.fillRect(x0, bot - side + 5, x1 - x0, 3);
    g.fillStyle = 'rgba(255,255,255,.85)';
    for (let k = 1; k < H.lanes; k++) {
      for (let x = x0 + 16; x < x1; x += 58) {
        g.fillRect(x, top + 12 + k * laneW, 32, 3);
        g.fillRect(x, bot - 12 - k * laneW, 32, 3);
      }
    }
    // Beton bariyer
    const by = top + side + 15;
    g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(x0, by + 4, x1 - x0, 12);
    g.fillStyle = '#d4d7da'; g.fillRect(x0, by, x1 - x0, 10);
    g.fillStyle = '#9ea2a6'; for (let x = x0; x < x1; x += 40) g.fillRect(x, by, 2, 10);
    g.fillStyle = '#fff'; g.fillRect(x0, by + 3, x1 - x0, 2);
    // Tabela köprüsü
    const gx = c.x + CHUNK * 0.62;
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(gx + 8, top + 8, 10, bot - top);
    g.fillStyle = '#7e8690'; g.fillRect(gx, top - 6, 7, bot - top + 12);
    const pan = (y, t) => {
      g.font = '900 15px Nunito, sans-serif';
      const w = g.measureText(t).width + 18;
      g.fillStyle = '#0d6b3c'; g.fillRect(gx - w / 2 + 3, y - 15, w, 30);
      g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.strokeRect(gx - w / 2 + 6, y - 12, w - 6, 24);
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, gx + 3, y + 1);
    };
    const h = (Math.imul(c.cx, 73856093) >>> 0) % 4;
    pan(top + side * 0.5, ['← EDİRNE O-3', '← SARAY O-3', '← GEBZE O-4', '← ÇORLU O-3'][h]);
    pan(bot - side * 0.5, ['ANKARA O-4 →', 'İZMİT O-4 →', 'BOLU O-4 →', 'BURSA O-5 →'][h]);
    // Hız tabelası
    for (const [y, t] of [[top + 2, '120'], [bot - 2, '120']]) {
      g.fillStyle = '#fff'; g.beginPath(); g.arc(c.x + CHUNK * 0.3, y, 11, 0, 7); g.fill();
      g.strokeStyle = '#d0121b'; g.lineWidth = 3; g.stroke();
      g.fillStyle = '#111'; g.font = '900 10px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, c.x + CHUNK * 0.3, y + 1);
    }
  }

  // Trafik levhaları: pişirilir, oyun sırasında maliyeti yoktur
  bakeSigns(g, c) {
    const post = (x, y, draw) => {
      g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(x + 3, y + 4, 8, 4, 0, 0, 7); g.fill();
      g.save(); g.translate(x, y); draw(); g.restore();
    };
    const round = (bg, ring, text) => () => {
      g.fillStyle = bg; g.beginPath(); g.arc(0, 0, 8.5, 0, 7); g.fill();
      g.lineWidth = 2.4; g.strokeStyle = ring; g.stroke();
      g.fillStyle = '#16181c'; g.font = '900 9px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 0, 0.5);
    };
    const tri = (sym) => () => {
      g.fillStyle = '#fff'; g.beginPath(); g.moveTo(0, -10); g.lineTo(10, 8); g.lineTo(-10, 8); g.closePath(); g.fill();
      g.lineWidth = 2.4; g.strokeStyle = '#d0121b'; g.stroke();
      g.fillStyle = '#16181c'; g.font = '900 10px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(sym, 0, 2);
    };
    const stop = () => {
      g.fillStyle = '#d0121b'; g.beginPath();
      for (let i = 0; i < 8; i++) { const a = 0.39 + (i / 8) * 6.283; g.lineTo(Math.cos(a) * 9.5, Math.sin(a) * 9.5); }
      g.closePath(); g.fill();
      g.fillStyle = '#fff'; g.font = '900 7px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('DUR', 0, 0.5);
    };
    const panel = (t) => () => {
      g.font = '800 9px Nunito, sans-serif';
      const w = g.measureText(t).width + 10;
      g.fillStyle = '#0a4ea2'; g.fillRect(-w / 2, -7, w, 14);
      g.strokeStyle = '#fff'; g.lineWidth = 1; g.strokeRect(-w / 2 + 1, -6, w - 2, 12);
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 0.5);
    };
    const DIR = ['← KADIKÖY', 'BEŞİKTAŞ →', '↑ TAKSİM', 'ÜSKÜDAR →', '← ŞİŞLİ', 'SARIYER →', '↑ BOĞAZ KÖPRÜSÜ', '← FATİH', 'BAKIRKÖY →'];
    const h = (Math.imul(c.cx, 73856093) ^ Math.imul(c.cy, 19349663)) >>> 0;
    const list = [round('#fff', '#d0121b', String(30 + (h % 4) * 10)), tri('!'), tri('⚠'), round('#fff', '#d0121b', '50'), stop];
    const E = ART_W - 6;
    post(c.x + E, c.y + ART_W + 44, stop);
    post(c.x + ART_W + 44, c.y + E, list[h % 5]);
    post(c.x + E, c.y + CHUNK * 0.55, panel(DIR[h % DIR.length]));
    post(c.x + CHUNK * 0.55, c.y + E, panel(DIR[(h >>> 4) % DIR.length]));
    post(c.x + E, c.y + CHUNK * 0.8, list[(h >>> 3) % 5]);
    post(c.x + CHUNK * 0.8, c.y + E, list[(h >>> 6) % 5]);
    // Ara sokak ağzı: tek yön ya da çıkmaz uyarısı
    for (let i = 0; i < c.streetCount; i++) {
      const s = c.streets[i];
      if (s.ground !== GROUND.ALLEY && s.ground !== GROUND.ROAD) continue;
      const at = (s.pos + s.width / 2) * TILE;
      // Geniş sokakta kesik orta çizgi
      if (s.width >= 2) {
        g.fillStyle = c.road === 2 ? '#6d7076' : 'rgba(255,255,255,.75)';
        for (let d = ART_W + 40; d < CHUNK - 30; d += 46) {
          if (s.vertical) g.fillRect(c.x + at - 1.5, c.y + d, 3, 24);
          else g.fillRect(c.x + d, c.y + at - 1.5, 24, 3);
        }
      }
      const sign = i % 2 ? round('#2a6fd6', '#fff', '⇧') : tri('Y');
      if (s.vertical) post(c.x + at + 13, c.y + ART_W - 5, sign);
      else post(c.x + ART_W - 5, c.y + at + 13, sign);
    }
    // Yaya geçitleri ara sokak ağızlarında
    g.fillStyle = 'rgba(255,255,255,.82)';
    for (let i = 0; i < c.streetCount; i++) {
      const s = c.streets[i];
      if (s.ground !== GROUND.ALLEY && s.ground !== GROUND.ROAD) continue;
      const a = s.pos * TILE + 4;
      const b = (s.pos + s.width) * TILE - 4;
      for (let k = a; k < b; k += 12) {
        if (s.vertical) g.fillRect(c.x + k, c.y + ART_W + 3, 6, 15);
        else g.fillRect(c.x + ART_W + 3, c.y + k, 15, 6);
      }
    }
  }

  // Açık alanlar: spor sahaları, avlu, otopark, ambulans alanı, okul bahçesi
  // Gizli geçit rampası: neredeyse görünmez. Hafif koyu zemin, soluk eğim çizgileri, köşede karanlık bir boşluk
  bakeRamp(g, x, y, w, h) {
    const grd = g.createLinearGradient(x, y, x + w, y + h);
    grd.addColorStop(0, 'rgba(0,0,0,0)'); grd.addColorStop(0.55, 'rgba(20,16,12,.10)'); grd.addColorStop(1, 'rgba(8,6,5,.26)');
    g.fillStyle = grd; g.fillRect(x, y, w, h);
    g.strokeStyle = 'rgba(30,24,18,.10)'; g.lineWidth = 1.2;
    for (let k = 1; k < 5; k++) { const u = k / 5; g.beginPath(); g.moveTo(x + w * u, y + h); g.lineTo(x + w, y + h * u); g.stroke(); }
    g.fillStyle = 'rgba(6,5,4,.22)';
    g.beginPath(); g.moveTo(x + w, y + h * 0.62); g.lineTo(x + w, y + h); g.lineTo(x + w * 0.62, y + h); g.closePath(); g.fill();
  }

  bakePads(g, c) {
    for (let i = 0; i < c.padCount; i++) {
      const p = c.pads[i];
      if (p.w <= 0 || p.h <= 0) continue; // Otoban bandında kalan saha iptal edilmiştir
      if (p.kind === 'anit') { bakeMemorialPad(g, c.x + (p.tx + 1) * TILE, c.y + p.ty * TILE, (p.w - 2) * TILE, p.h * TILE * 0.7); continue; }
      if (p.kind === 'gecit') { this.bakeRamp(g, c.x + p.tx * TILE, c.y + p.ty * TILE, p.w * TILE, p.h * TILE); continue; }
      const x = c.x + p.tx * TILE + 3;
      const y = c.y + p.ty * TILE + 3;
      const w = p.w * TILE - 6;
      const h = p.h * TILE - 6;
      if (p.kind === 'foot' || p.kind === 'hali') {
        const hali = p.kind === 'hali';
        const n = hali ? 6 : 10;
        for (let k = 0; k < n; k++) { g.fillStyle = k % 2 ? (hali ? '#2fa654' : '#46a84a') : (hali ? '#27934a' : '#3e9a44'); g.fillRect(x + (k * w) / n, y, w / n + 0.5, h); }
        g.strokeStyle = '#fff'; g.lineWidth = 2.5;
        g.strokeRect(x + 6, y + 6, w - 12, h - 12);
        g.beginPath(); g.moveTo(x + w / 2, y + 6); g.lineTo(x + w / 2, y + h - 6); g.stroke();
        g.beginPath(); g.arc(x + w / 2, y + h / 2, h * 0.17, 0, 7); g.stroke();
        for (const s of [0, 1]) {
          const bx = s ? x + w - 6 - w * 0.13 : x + 6;
          g.strokeRect(bx, y + h * 0.24, w * 0.13, h * 0.52);
          g.fillStyle = '#fff'; g.fillRect(s ? x + w - 6 : x + 2, y + h * 0.42, 4, h * 0.16);
        }
        if (hali) { g.strokeStyle = 'rgba(240,244,248,.55)'; g.lineWidth = 1; for (let k = 0; k <= w; k += 12) { g.beginPath(); g.moveTo(x + k, y); g.lineTo(x + k, y + h); g.stroke(); } for (let k = 0; k <= h; k += 12) { g.beginPath(); g.moveTo(x, y + k); g.lineTo(x + w, y + k); g.stroke(); } }
        g.strokeStyle = 'rgba(40,50,60,.8)'; g.lineWidth = 2; g.strokeRect(x, y, w, h);
      } else if (p.kind === 'basket') {
        g.fillStyle = '#c8682e'; g.fillRect(x, y, w, h);
        g.fillStyle = '#2f6fb0'; g.fillRect(x + 8, y + 8, w - 16, h - 16);
        g.strokeStyle = '#fff'; g.lineWidth = 2;
        g.strokeRect(x + 8, y + 8, w - 16, h - 16);
        g.beginPath(); g.moveTo(x + w / 2, y + 8); g.lineTo(x + w / 2, y + h - 8); g.stroke();
        g.beginPath(); g.arc(x + w / 2, y + h / 2, h * 0.14, 0, 7); g.stroke();
        for (const s of [0, 1]) {
          const px = s ? x + w - 8 : x + 8;
          g.beginPath(); g.arc(px, y + h / 2, h * 0.32, s ? 1.57 : -1.57, s ? 4.71 : 1.57); g.stroke();
          g.fillStyle = '#ff7a1a'; g.beginPath(); g.arc(px + (s ? -8 : 8), y + h / 2, 3.4, 0, 7); g.fill();
        }
      } else if (p.kind === 'yard') {
        g.fillStyle = '#c9b48a'; g.fillRect(x, y, w, h);
        g.strokeStyle = '#fff'; g.lineWidth = 2; g.strokeRect(x + w * 0.1, y + h * 0.2, w * 0.5, h * 0.6);
        g.beginPath(); g.arc(x + w * 0.35, y + h / 2, h * 0.14, 0, 7); g.stroke();
        // Bayrak direği ve Türk bayrağı
        const fx = x + w * 0.8; const fy = y + h * 0.3;
        g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(fx, fy, 30, 2);
        g.fillStyle = '#dfe3e8'; g.beginPath(); g.arc(fx, fy, 3, 0, 7); g.fill();
        g.fillStyle = '#e30a17'; g.fillRect(fx + 3, fy - 12, 26, 15);
        g.fillStyle = '#fff'; g.beginPath(); g.arc(fx + 12, fy - 4.5, 4.6, 0, 7); g.fill();
        g.fillStyle = '#e30a17'; g.beginPath(); g.arc(fx + 13.4, fy - 4.5, 3.8, 0, 7); g.fill();
        g.fillStyle = '#fff'; g.fillRect(fx + 17, fy - 6, 3, 3);
        g.fillStyle = '#4f9a3a'; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(x + 10 + k * (w / 6), y + h - 7, 6, 0, 7); g.fill(); }
      } else if (p.kind === 'ambulance') {
        g.fillStyle = '#b9bec4'; g.fillRect(x, y, w, h);
        g.strokeStyle = '#fff'; g.lineWidth = 2;
        for (let k = 0; k < 7; k++) { g.beginPath(); g.moveTo(x + 14 + k * 34, y + 4); g.lineTo(x + 14 + k * 34, y + 40); g.stroke(); }
        g.fillStyle = '#d0121b'; g.fillRect(x + w * 0.4, y, w * 0.2, h);
        g.fillStyle = '#fff'; g.font = '900 13px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('AMBULANS', x + w * 0.5, y + h / 2);
        const am = this.sprites.parked && this.sprites.ambulance;
        if (am) g.drawImage(am, x + 22, y + 8, 54, 24);
      } else if (p.kind === 'parking') {
        g.fillStyle = '#7c7f82'; g.fillRect(x, y, w, h);
        g.strokeStyle = '#fff'; g.lineWidth = 1.5;
        for (let k = 0; k < w; k += 40) { g.beginPath(); g.moveTo(x + k, y); g.lineTo(x + k, y + 34); g.stroke(); }
      } else {
        paintPad(g, p, x, y, w, h); // Özel yerlerin alanları: merdiven, bayrak, tramvay, tepe, bağ
      }
    }
  }

  bakeWater(g, r) {
    const rad = r.style === 2 ? r.w / 2 : Math.min(40, r.w / 3);
    g.fillStyle = r.style === 1 ? '#e9d79c' : '#7bb65a';
    rr(g, r.x - 6, r.y - 6, r.w + 12, r.h + 12, rad + 4);
    g.fill();
    if (r.style === 2) { g.fillStyle = '#c7ccd2'; rr(g, r.x - 7, r.y - 7, r.w + 14, r.h + 14, rad + 7); g.fill(); }
    const grad = g.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
    grad.addColorStop(0, '#59c6f2');
    grad.addColorStop(1, '#2b86d4');
    g.fillStyle = grad;
    rr(g, r.x, r.y, r.w, r.h, rad);
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,.4)';
    g.lineWidth = 2.5;
    const n = Math.floor((r.w * r.h) / 9000) + 3;
    for (let i = 0; i < n; i++) {
      const u = (r.seed * (i + 7) * 37) % 100;
      const v = (r.seed * (i + 3) * 61) % 100;
      const x = r.x + r.w * (0.14 + u * 0.0072);
      const y = r.y + r.h * (0.14 + v * 0.0072);
      g.beginPath();
      g.moveTo(x - 10, y);
      g.quadraticCurveTo(x - 5, y - 4, x, y);
      g.quadraticCurveTo(x + 5, y + 4, x + 10, y);
      g.stroke();
    }
    if (r.style === 2) {
      g.fillStyle = '#d7e9f2';
      g.beginPath(); g.arc(r.x + r.w / 2, r.y + r.h / 2, 14, 0, 7); g.fill();
      g.fillStyle = '#fff';
      g.beginPath(); g.arc(r.x + r.w / 2, r.y + r.h / 2, 7, 0, 7); g.fill();
    }
  }

  bakeBuilding(g, r) {
    if (paintBuilding2(g, r)) { this.bakeSign(g, r); return; }
    if (r.style >= 7) { paintSpecial(g, r); this.bakeSign(g, r); return; }
    this.bakeRoof(g, r);
    this.bakeSign(g, r);
  }

  bakeRoof(g, r) {
    const wall = 9; // Güneye bakan cephe: yükseklik hissi
    g.fillStyle = shade(r.color, -0.42);
    rr(g, r.x, r.y, r.w, r.h, 5);
    g.fill();
    // Cephe pencereleri
    g.fillStyle = 'rgba(190,230,255,.7)';
    for (let x = r.x + 7; x < r.x + r.w - 8; x += 13) g.fillRect(x, r.y + r.h - wall + 2, 6, 4);
    g.fillStyle = r.color;
    rr(g, r.x, r.y, r.w, r.h - wall, 5);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.14)';
    g.fillRect(r.x + 3, r.y + 3, r.w - 6, 3);
    g.fillRect(r.x + 3, r.y + 3, 3, r.h - wall - 6);
    const x = r.x + 8;
    const y = r.y + 8;
    const w = r.w - 16;
    const h = r.h - wall - 16;
    if (w < 8 || h < 8) return;
    const s = r.seed;
    if (r.style === 0) {
      // Klima üniteleri
      g.fillStyle = 'rgba(0,0,0,.14)';
      g.strokeStyle = 'rgba(0,0,0,.14)';
      g.lineWidth = 2;
      g.strokeRect(x, y, w, h);
      g.fillStyle = '#cfd5da';
      for (let i = 0; i < 3; i++) {
        const ax = x + 4 + ((s * (i + 2) * 13) % Math.max(1, w - 20));
        const ay = y + 4 + ((s * (i + 5) * 17) % Math.max(1, h - 18));
        g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(ax + 2, ay + 2, 14, 11);
        g.fillStyle = '#d7dde2'; g.fillRect(ax, ay, 14, 11);
        g.fillStyle = '#8b959e'; g.beginPath(); g.arc(ax + 7, ay + 5.5, 3.5, 0, 7); g.fill();
      }
    } else if (r.style === 1) {
      // Beşik çatı
      const vertical = h > w;
      g.fillStyle = 'rgba(0,0,0,.14)';
      if (vertical) g.fillRect(x + w / 2, y - 8, w / 2 + 8, h + 16);
      else g.fillRect(x - 8, y + h / 2, w + 16, h / 2 + 8);
      g.fillStyle = 'rgba(255,255,255,.3)';
      if (vertical) g.fillRect(x + w / 2 - 1.5, y - 8, 3, h + 16);
      else g.fillRect(x - 8, y + h / 2 - 1.5, w + 16, 3);
    } else if (r.style === 2) {
      // Çatı bahçesi
      g.fillStyle = '#7fc66a';
      rr(g, x, y, w, h, 4);
      g.fill();
      g.fillStyle = '#4f9a3a';
      for (let i = 0; i < 4; i++) {
        g.beginPath();
        g.arc(x + 6 + ((s * (i + 1) * 23) % Math.max(1, w - 12)), y + 6 + ((s * (i + 3) * 31) % Math.max(1, h - 12)), 6, 0, 7);
        g.fill();
      }
    } else if (r.style === 3) {
      // Güneş panelleri
      g.fillStyle = '#1f3f77';
      for (let py = y; py < y + h - 8; py += 13) {
        for (let px = x; px < x + w - 12; px += 18) g.fillRect(px, py, 15, 10);
      }
      g.fillStyle = 'rgba(160,210,255,.35)';
      for (let py = y; py < y + h - 8; py += 13) g.fillRect(x, py + 4.5, w - 6, 1);
    } else if (r.style === 4) {
      // Helikopter pisti
      const cx = x + w / 2;
      const cy = y + h / 2;
      const d = Math.min(w, h) / 2 - 2;
      g.fillStyle = '#3d444e';
      g.beginPath(); g.arc(cx, cy, d, 0, 7); g.fill();
      g.strokeStyle = '#ffd23f';
      g.lineWidth = 3;
      g.stroke();
      g.fillStyle = '#fff';
      g.font = `bold ${Math.round(d)}px sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('H', cx, cy + 1);
    } else if (r.style === 5) {
      // Ev çatısı: dört eğim
      g.fillStyle = 'rgba(0,0,0,.14)';
      g.beginPath();
      g.moveTo(r.x, r.y + r.h - wall);
      g.lineTo(r.x + r.w, r.y + r.h - wall);
      g.lineTo(r.x + r.w - 20, r.y + (r.h - wall) / 2);
      g.lineTo(r.x + 20, r.y + (r.h - wall) / 2);
      g.closePath();
      g.fill();
      g.strokeStyle = 'rgba(255,255,255,.28)';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(r.x + 20, r.y + (r.h - wall) / 2);
      g.lineTo(r.x + r.w - 20, r.y + (r.h - wall) / 2);
      g.stroke();
      g.fillStyle = '#7a4e3a';
      g.fillRect(r.x + r.w - 26, r.y + 10, 10, 10);
    } else {
      // Depo: oluklu çatı
      g.strokeStyle = 'rgba(0,0,0,.14)';
      g.lineWidth = 2;
      for (let px = r.x + 10; px < r.x + r.w - 6; px += 14) {
        g.beginPath(); g.moveTo(px, r.y + 4); g.lineTo(px, r.y + r.h - wall - 4); g.stroke();
      }
    }
  }

  // Tabela, uydu çanağı, güneş paneli ve balkon çamaşırı
  bakeSign(g, r) {
    if (r.style === 0 || r.style === 1 || r.style === 2 || r.style === 3 || r.style === 5 || r.style === BUILD.APARTMENT) roofClutter(g, r);
    if (!r.sign || r.tall > 0) return; // Yüksek binanın tabelası çatıda, her karede çizilir
    const img = rectSign(r);
    const b = signBox(r, img);
    g.drawImage(img, b.x, b.y, b.w, b.h);
  }

  bakeWall(g, r) {
    g.fillStyle = 'rgba(0,10,30,.25)';
    g.fillRect(r.x + 4, r.y + 5, r.w, r.h);
    g.fillStyle = r.color;
    g.fillRect(r.x, r.y, r.w, r.h);
    g.fillStyle = 'rgba(0,0,0,.2)';
    for (let x = r.x + 16; x < r.x + r.w; x += 20) g.fillRect(x, r.y, 2, r.h);
  }

  bakeRubble(g, r) {
    g.fillStyle = '#9b8a72';
    g.fillRect(r.x, r.y, r.w, r.h);
    for (let i = 0; i < 26; i++) {
      const u = (r.seed * (i + 3) * 41) % 97;
      const v = (r.seed * (i + 9) * 59) % 89;
      g.fillStyle = i % 3 ? '#786a56' : (r.color || '#aaa');
      g.fillRect(r.x + (u / 97) * r.w - 4, r.y + (v / 89) * r.h - 4, 8 + (u % 9), 6 + (v % 7));
    }
  }

  // --- Kare çizimi ---
  draw(game, now) {
    // Hava değişince çizilmiş zemin yeniden işlenir (kar, buz)
    if (this.weather !== game.weather) {
      const snowy = (w) => w === 'snow' || w === 'ice';
      if (snowy(this.weather) || snowy(game.weather)) for (const c of game.world.chunks.values()) c.dirty = true;
      this.weather = game.weather;
    }
    const { ctx, dpr, w, h } = this;
    const cam = game.cam;
    const s = cam.scale * dpr;
    const ox = (w * dpr) / 2 - (cam.x + cam.sx) * s;
    const oy = (h * dpr) / 2 - (cam.y + cam.sy) * s;
    this.s = s; this.ox = ox; this.oy = oy;
    const vx0 = cam.x - cam.halfW - 30;
    const vx1 = cam.x + cam.halfW + 30;
    const vy0 = cam.y - cam.halfH - 30;
    const vy1 = cam.y + cam.halfH + 30;
    const world = game.world;

    ctx.setTransform(s, 0, 0, s, ox, oy);

    // Zemin temizlenmez: sarsıntıda da kadraj parçalarla tam örtülür
    const c0x = Math.floor((vx0 - 30) / CHUNK);
    const c1x = Math.floor((vx1 + 30) / CHUNK);
    const c0y = Math.floor((vy0 - 30) / CHUNK);
    const c1y = Math.floor((vy1 + 30) / CHUNK);
    this.frameId = (this.frameId || 0) + 1;
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = world.chunk(cx, cy);
        c.lastSeen = this.frameId;
        if (!c.canvas || c.dirty) { this.syncBakes++; this.bake(c); }
        ctx.drawImage(c.canvas, c.x, c.y, CHUNK + 0.6, CHUNK + 0.6);
      }
    }
    // Görünmeden önce hazırla: kaydırmada takılma olmasın (karede en fazla 1)
    // Telefonda takılma olmasın diye dört karede bir
    if (game.state === 'play' || game.state === 'drop') {
      if (!this.job) this.prebake(game, c0x, c1x, c0y, c1y);
      this.stepJob(PF.bakeBudget);
    }
    this.stepQueue(2);

    // Cumhuriyet Meydanı anıtı: yer zeminin üstünde, her şeyin altında. Görünmüyorsa çizilmez
    const mb = world.memorialBox();
    this.memBox = null;
    if (mb) {
      this.memorial.update(world.memorialDist(cam.x, cam.y));
      if (mb.x < vx1 && mb.x + mb.w > vx0 && mb.y < vy1 && mb.y + mb.h > vy0) {
        this.memBox = mb;
        this.memorial.draw(ctx, mb, now, s);
      }
    }
    this.stadiums.draw(ctx, world, cam, vx0, vx1, vy0, vy1, now, s);

    this.drawDecals(game, vx0, vx1, vy0, vy1);
    this.drawSkids(game, vx0, vx1, vy0, vy1);
    this.drawSpikes(game);
    this.drawShots(game, now);
    this.drawMeteorWarn(game, now);
    this.drawProps(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now, false);
    this.drawPeds(game, vx0, vx1, vy0, vy1, false);
    this.drawNpcs(game, vx0, vx1, vy0, vy1);
    this.drawHighway(game, vx0, vx1, vy0, vy1);
    this.drawCops(game, now, vx0, vx1, vy0, vy1);
    if (game.state !== 'dying' && game.state !== 'over') this.drawPlayer(game, now);
    this.drawProps(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now, true);
    this.drawPeds(game, vx0, vx1, vy0, vy1, true);
    this.drawLights(game, c0x, c1x, c0y, c1y);
    this.drawFires(game, now, c0x, c1x, c0y, c1y);
    this.drawBalconies(game, now, c0x, c1x, c0y, c1y, false); // Alçak binalar yüksek binaların altında kalır
    this.drawTalls(game, c0x, c1x, c0y, c1y);
    this.drawBalconies(game, now, c0x, c1x, c0y, c1y, true);
    if (game.weapon) this.drawWeapon(game, now);
    this.drawMeteorSky(game, now);
    this.drawParticles(game, vx0, vx1, vy0, vy1);
    this.drawNight(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now);
    this.drawPhasing(game);
    this.drawSirens(game, now, vx0, vx1, vy0, vy1);
    this.drawWaves(game);
    this.drawFloats(game);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    this.drawWeather(game, now);
    this.drawSpeedLines(game, now);
    this.drawOverlay(game, now);
  }

  // Görünecek parçaları karede en çok birer birer hazırlar: geçişte ekran donmaz
  warm(game, k = 1, ms = 0) {
    const t0 = performance.now();
    this.stepQueue(ms || 3);
    const cam = game.cam;
    const hw = cam.halfW * k + 30; const hh = cam.halfH * k + 30;
    const c0x = Math.floor((cam.x - hw) / CHUNK); const c1x = Math.floor((cam.x + hw) / CHUNK);
    const c0y = Math.floor((cam.y - hh) / CHUNK); const c1y = Math.floor((cam.y + hh) / CHUNK);
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = game.world.chunk(cx, cy);
        c.lastSeen = this.frameId || 0;
        for (let i = 0; i < c.talls.length; i++) if (c.talls[i].sign) rectSign(c.talls[i]);
        if (!c.canvas || c.dirty) {
          this.bake(c);
          if (performance.now() - t0 >= ms) return false;
        }
      }
    }
    return true;
  }

  prebake(game, c0x, c1x, c0y, c1y) {
    const p = game.player;
    const dx = Math.sign(p.vx);
    const dy = Math.sign(p.vy);
    const cx = dx > 0 ? c1x + 1 : dx < 0 ? c0x - 1 : c0x;
    const cy = dy > 0 ? c1y + 1 : dy < 0 ? c0y - 1 : c0y;
    for (let y = c0y; y <= c1y; y++) {
      const c = game.world.chunk(cx, y);
      if (!c.canvas || c.dirty) { c.lastSeen = this.frameId; this.startJob(c); return; }
    }
    for (let x = c0x; x <= c1x; x++) {
      const c = game.world.chunk(x, cy);
      if (!c.canvas || c.dirty) { c.lastSeen = this.frameId; this.startJob(c); return; }
    }
  }

  place(x, y, rot) {
    const { s, ox, oy } = this;
    const c = Math.cos(rot) * s;
    const n = Math.sin(rot) * s;
    this.ctx.setTransform(c, n, -n, c, x * s + ox, y * s + oy);
  }

  drawDecals(game, x0, x1, y0, y1) {
    const ctx = this.ctx;
    for (const d of game.fx.decals) {
      if (!d.alive || d.x + d.r < x0 || d.x - d.r > x1 || d.y + d.r < y0 || d.y - d.r > y1) continue;
      ctx.globalAlpha = 0.75;
      ctx.drawImage(this.sprites.dark, d.x - d.r, d.y - d.r, d.r * 2, d.r * 2);
    }
    ctx.globalAlpha = 1;
  }

  drawSkids(game, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const fx = game.fx;
    const n = fx.skidMax;
    const buf = fx.skid;
    ctx.strokeStyle = '#17171a';
    ctx.lineWidth = 3.6;
    ctx.lineCap = 'butt';
    const parts = 4;
    for (let p = 0; p < parts; p++) {
      ctx.globalAlpha = 0.1 + 0.11 * p;
      ctx.beginPath();
      const from = Math.floor((p * n) / parts);
      const to = Math.floor(((p + 1) * n) / parts);
      for (let k = from; k < to; k++) {
        const i = ((fx.skidCursor + k) % n) * 5;
        if (buf[i + 4] === 0) continue;
        const ax = buf[i];
        const ay = buf[i + 1];
        if (ax < x0 || ax > x1 || ay < y0 || ay > y1) continue;
        ctx.moveTo(ax, ay);
        ctx.lineTo(buf[i + 2], buf[i + 3]);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  drawSpikes(game) {
    const ctx = this.ctx;
    for (const k of game.spikes) {
      if (!k.alive) continue;
      this.place(k.x, k.y, k.a);
      ctx.fillStyle = '#2d2f35';
      ctx.fillRect(-k.len / 2, -5, k.len, 10);
      ctx.fillStyle = '#e8edf2';
      ctx.beginPath();
      for (let x = -k.len / 2; x < k.len / 2 - 4; x += 7) {
        ctx.moveTo(x, 5);
        ctx.lineTo(x + 3.5, -9);
        ctx.lineTo(x + 7, 5);
      }
      ctx.fill();
    }
    this.ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawShots(game, now) {
    const ctx = this.ctx;
    const R = CONFIG.tank.radius;
    const warn = CONFIG.tank.warnTime;
    for (const k of game.shots) {
      if (!k.alive) continue;
      const t = k.t / warn;
      const pulse = 0.5 + 0.5 * Math.sin(now * 0.02);
      ctx.beginPath();
      ctx.arc(k.x, k.y, R, 0, 6.3);
      ctx.fillStyle = `rgba(255,40,30,${0.1 + 0.12 * pulse})`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,60,30,.95)';
      ctx.lineWidth = 4;
      ctx.setLineDash([16, 10]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(k.x, k.y, R * t, 0, 6.3);
      ctx.fillStyle = 'rgba(255,90,20,.35)';
      ctx.fill();
      ctx.fillStyle = '#ffec3d';
      ctx.font = '700 44px Bungee, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', k.x, k.y);
    }
  }

  drawProps(game, c0x, c1x, c0y, c1y, x0, x1, y0, y1, now, tall) {
    const ctx = this.ctx;
    const sp = this.sprites;
    const world = game.world;
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = world.chunk(cx, cy);
        for (let i = 0; i < c.propCount; i++) {
          const pr = c.props[i];
          if (!pr.alive || pr.x < x0 - 30 || pr.x > x1 + 30 || pr.y < y0 - 30 || pr.y > y1 + 30) continue;
          const isTall = pr.kind === PROP.QUEUE || pr.kind === PROP.DANCER || pr.kind === PROP.TREE || pr.kind === PROP.PALM || pr.kind === PROP.PINE || pr.kind === PROP.LAUNDRY;
          if (isTall !== tall) continue;
          if (isPower(pr.kind)) {
            const bob = 1 + 0.1 * Math.sin(now * 0.006 + pr.phase * 5);
            const look = POWER_LOOK[powerName(pr.kind)];
            ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
            ctx.globalAlpha = 0.45 + 0.25 * Math.sin(now * 0.005);
            ctx.drawImage(sp.auras[pr.kind - PROP.POWER_BLAST], pr.x - 46, pr.y - 46, 92, 92);
            ctx.globalAlpha = 1;
            const pw = 42 * bob;
            ctx.drawImage(sp.props[pr.kind], pr.x - pw / 2, pr.y - pw / 2, pw, pw);
            if (!look) continue;
            continue;
          }
          if (pr.kind === PROP.DONER) {
            ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
            ctx.drawImage(sp.doner[Math.floor(now / 130 + pr.x) & 3], pr.x - 9, pr.y - 20, 18, 24);
            continue;
          }
          if (pr.kind === PROP.PROMO) {
            ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
            ctx.drawImage(sp.promos[pr.v || 0], pr.x - 22, pr.y - 20, 44, 26);
            continue;
          }
          if (pr.kind === PROP.DANCER) {
            ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
            ctx.drawImage(sp.dancers[pr.v || 0][Math.abs(Math.floor(now / 105 + pr.x * 0.1)) % 6], pr.x - 23, pr.y - 72, 46, 78);
            continue;
          }
          if (pr.kind === PROP.COIN) {
            const w = 22 * Math.abs(Math.cos(now * 0.006 + pr.phase * 7));
            ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
            ctx.globalAlpha = 0.5;
            ctx.drawImage(sp.glint, pr.x - 22, pr.y - 22, 44, 44);
            ctx.globalAlpha = 1;
            ctx.drawImage(sp.coin, pr.x - w / 2 - 1, pr.y - 12, w + 2, 24);
            continue;
          }
          let img = sp.props[pr.kind];
          if (pr.kind === PROP.PARKED) img = sp.parked[Math.abs(Math.floor(pr.phase * 100)) % sp.parked.length];
          const w = img.wu || img.width / SPR;
          const h = img.hu || img.height / SPR;
          if (pr.rot) {
            this.place(pr.x, pr.y, pr.rot);
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
          } else {
            ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
            ctx.drawImage(img, pr.x - w / 2, pr.y - h / 2, w, h);
          }
        }
      }
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawPeds(game, x0, x1, y0, y1, flying) {
    const ctx = this.ctx;
    const sp = this.sprites;
    for (const p of game.crowd.peds) {
      if (!p.alive || (p.state === PED_FLY) !== flying) continue;
      if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) continue;
      const frame = Math.floor(p.step) & 1;
      const plain = p.kind === 'man' || p.kind === 'woman';
      const img = plain ? sp.peds[p.look][frame] : sp.pedKinds[p.kind][frame];
      const k = (1 + p.z / 170) * p.scale;
      const size = (plain ? 27 : 46) * k;
      if (flying) {
        ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
        ctx.globalAlpha = 0.3;
        ctx.drawImage(sp.dark, p.x - 8, p.y - 6, 16, 12);
        ctx.globalAlpha = 1;
      }
      this.place(p.x, p.y - p.z * 0.7, p.a);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  // Trafik ışıkları yalnızca şehir kavşaklarında, köşelere çizilir
  drawLights(game, c0x, c1x, c0y, c1y) {
    const ctx = this.ctx;
    const sp = this.sprites.lights;
    const clock = game.crowd.clock;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    const idx = (st) => (st === 'r' ? 0 : st === 'y' ? 1 : 2);
    for (let cy = c0y; cy <= c1y + 1; cy++) {
      for (let cx = c0x; cx <= c1x + 1; cx++) {
        const c = game.world.chunk(cx, cy);
        if (c.biome !== 'city') continue;
        const ew = sp[idx(lightState(clock, cx, cy, 0))];
        const ns = sp[idx(lightState(clock, cx, cy, 1))];
        ctx.drawImage(ew, c.x - 22, c.y - 34, 12, 26);
        ctx.drawImage(ew, c.x + ART_W + 10, c.y + ART_W + 8, 12, 26);
        ctx.drawImage(ns, c.x + ART_W + 10, c.y - 34, 12, 26);
        ctx.drawImage(ns, c.x - 22, c.y + ART_W + 8, 12, 26);
        for (let i = 0; i < c.streetCount; i++) {
          const s = c.streets[i];
          if (s.width < 2) continue;
          const at = (s.pos + s.width) * TILE + 6;
          if (s.vertical) ctx.drawImage(ns, c.x + at, c.y + ART_W - 34, 10, 22);
          else ctx.drawImage(ew, c.x + ART_W - 18, c.y + at, 10, 22);
        }
      }
    }
  }

  // Gece-gündüz: ekranın üstüne yumuşak renk, ardından ışıklar eklenir
  drawNight(game, c0x, c1x, c0y, c1y, x0, x1, y0, y1, now) {
    const ctx = this.ctx;
    const d = game.daylight;
    if (d.a < 0.01) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = `rgba(${d.r},${d.g},${d.b},${d.a})`;
    ctx.fillRect(0, 0, this.w * this.dpr, this.h * this.dpr);
    const night = d.k;
    if (night < 0.05) return;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    const sp = this.sprites;
    if (this.memBox) this.memorial.drawNight(ctx, this.memBox, now, this.s, night, sp.lamp);
    this.stadiums.drawNight(ctx, now, night, sp.lamp);
    ctx.globalCompositeOperation = 'lighter';
    const wet = game.weather === 'rain' || game.weather === 'ice';
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = game.world.chunk(cx, cy);
        for (let i = 0; i < c.lightCount; i++) {
          const l = c.lights[i];
          if (l.x + l.w < x0 - 60 || l.x > x1 + 60 || l.y + l.h < y0 - 60 || l.y > y1 + 60) continue;
          if (l.kind === 0) {
            ctx.globalAlpha = night * 0.85;
            ctx.drawImage(sp.lamp, l.x - 70, l.y - 70, 140, 140);
            if (wet) { ctx.globalAlpha = night * 0.32 * game.wk; ctx.drawImage(sp.lamp, l.x - 22, l.y - 10, 44, 150); } // Islak yolda uzun yansıma
          } else if (l.kind === 1) {
            if (!l.rect.alive || (l.rect.seed + i) % 4 === 0 || night <= l.at) continue; // Bazı evlerde ışık kapalı
            if (l.rect.tall > 0 && game.cam.y <= l.rect.y + l.rect.h) continue; // Bu açıda cephe görünmez, ışık çatıya binmesin
            ctx.globalAlpha = Math.min(1, (night - l.at) / 0.16) * 0.85; // Her pencere kendi sırasında yanar
            ctx.drawImage(sp.win, l.x, l.y, l.w, l.h);
          } else if (l.kind === 2) {
            if (!l.rect.alive) continue;
            ctx.globalAlpha = night * (0.65 + 0.3 * Math.sin(now * 0.006 + l.x));
            ctx.drawImage(sp.neons[l.rect.seed % sp.neons.length], l.x - 50, l.y - 50, l.w + 100, l.h + 100);
          }
        }
      }
    }
    // Tabelalar gece aydınlık kalır. Alçak binalarınki zemindeki yerinde, yüksek binalarınki çatıda
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = game.world.chunk(cx, cy);
        for (let i = 0; i < c.lightCount; i++) {
          const l = c.lights[i];
          if (l.kind < 2 || !l.rect.alive || l.rect.tall > 0 || l.x + l.w < x0 || l.x > x1 || l.y + l.h < y0 || l.y > y1 + 40) continue;
          const img = rectSign(l.rect);
          this.litSign(l.rect, img, groundSignBox(l.rect, img, c), night, now, 0, true);
        }
      }
    }
    const talls = this.tallList;
    const cam = game.cam;
    for (let i = 0; i < talls.length; i++) {
      const r = talls[i];
      if (r.tX1 < x0 || r.tX0 > x1 || r.tY1 < y0 || r.tY0 > y1) continue;
      if (r.landmark) this.litLandmark(r, night, now, i + 1, cam);
      if (!r.sign) continue;
      const img = rectSign(r);
      if (!r.noRoofSign) this.litSign(r, img, roofSignBox(r, img), night, now, i + 1, cam.y > r.y + r.h);
      if (r.landmark) {
        const b = facadeSignBox(r, img, cam.y);
        if (b) this.litSign(r, img, { x: b.x, y: b.y, w: b.w, h: b.h }, night, now, i + 1, false);
      }
    }
    // Araç farları
    ctx.globalCompositeOperation = 'lighter';
    // Siste farlar daha belirgin
    const beamA = Math.min(1, night * (game.weather === 'fog' ? 1 + 0.45 * game.wk : 1));
    ctx.globalAlpha = beamA;
    const beam = sp.beam;
    const bw = beam.width / SPR;
    const bh = beam.height / SPR;
    const head = (b) => {
      if (b.x < x0 - 120 || b.x > x1 + 120 || b.y < y0 - 120 || b.y > y1 + 120) return;
      this.place(b.x + Math.cos(b.a) * b.len * 0.46, b.y + Math.sin(b.a) * b.len * 0.46, b.a);
      ctx.drawImage(beam, -bw / 2, -bh / 2, bw, bh);
      // Stop lambası ve farın asfalttaki parıltısı
      ctx.globalAlpha = night * 0.7;
      ctx.drawImage(sp.tail, -b.len * 0.92 - 14, -14, 28, 28);
      ctx.globalAlpha = night * 0.32;
      ctx.drawImage(sp.lamp, 40, -44, 110, 88);
      ctx.globalAlpha = night;
    };
    if (game.state === 'play') head(game.player);
    if (game.state === 'play') this.drawLed(game, night * CUSTOM.ledNight / CUSTOM.ledAlpha, now, true);
    ctx.globalAlpha = night;
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < game.cops.length; i++) { const c = game.cops[i]; if (c.type !== 'tank' && !c.alien) head(c); }
    for (let i = 0; i < game.crowd.npcs.length; i++) { const n = game.crowd.npcs[i]; if (n.alive && n.state === 'drive') head(n); }
    for (let i = 0; i < game.crowd.hw.length; i++) { const n = game.crowd.hw[i]; if (n.alive) head(n); }
    ctx.globalCompositeOperation = 'source-over';
    // Gök: üst kenarda ay ve sırayla parıldayan yıldızlar
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (night > 0.3 && this.lod.night > 0) {
      const a = (night - 0.3) / 0.7;
      const W = this.w;
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 2; i++) {
        ctx.globalAlpha = a * (0.45 + 0.4 * Math.sin(now * 0.0016 + i * 2.4));
        ctx.drawImage(sp.stars[i], 0, 0, W, 104);
      }
      ctx.globalAlpha = a * 0.95;
      ctx.drawImage(sp.moon, W * 0.62, 12, 44, 44);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  // Tek tabelanın gece hâli: yazı, tam arkasında ışıltı, yola düşen yansıma.
  // from: tallList içinde bu tabelayı örtebilecek ilk bina. Örtenlerin izdüşümü kırpılır
  litSign(r, img, b, night, now, from, reflect) {
    const ctx = this.ctx;
    const x = b.x; const y = b.y; const w = b.w; const h = b.h;
    const bottom = reflect ? Math.max(y + h + 22, r.y + r.h + 38) : y + h + 22;
    const clipped = this.clipOccluders(x - 26, y - 22, w + 52, bottom - y + 22, from);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = night * 0.9;
    ctx.drawImage(img, x, y, w, h);
    if (this.lod.night > 0) {
      const halo = signHalo(r.signColor);
      const flick = signKind(r.sign) === 'led' ? 0.82 + 0.18 * Math.sin(now * 0.02 + r.seed) : 1;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = night * 0.6 * flick;
      ctx.drawImage(img, x, y, w, h);
      ctx.globalAlpha = night * 0.5 * flick;
      ctx.drawImage(halo, x - 26, y - 22, w + 52, h + 44);
      if (reflect && this.lod.night >= 2) {
        ctx.globalAlpha = night * 0.3;
        ctx.drawImage(halo, r.x - 6, r.y + r.h - 2, r.w + 12, 40);
      }
    }
    if (clipped) ctx.restore();
  }

  // Özel yapının gece pencereleri ve kulenin ikaz lambası. Öndeki binalar kırpar
  litLandmark(r, night, now, from, cam) {
    const art = tallArt(r);
    if (!art) return;
    const ctx = this.ctx;
    const minX = Math.min(r.x, r.tX0); const maxX = Math.max(r.x + r.w, r.tX1);
    const minY = Math.min(r.y, r.tY0); const maxY = Math.max(r.y + r.h, r.tY1);
    const clipped = this.clipOccluders(minX, minY, maxX - minX, maxY - minY, from);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, night * 1.1);
    this.tallWalls(r, { n: art.litN, e: art.litE }, art, cam.x, cam.y, this.lod.slices, false);
    if (art.beacon) {
      const on = Math.floor(now / 700) % 2 === 0;
      const bx = (r.tX0 + r.tX1) / 2; const by = (r.tY0 + r.tY1) / 2;
      ctx.globalAlpha = night * (on ? 0.95 : 0.25);
      ctx.drawImage(this.sprites.red, bx - 40, by - 40, 80, 80);
    }
    ctx.globalCompositeOperation = 'source-over';
    if (clipped) ctx.restore();
  }

  // Kutunun üstüne binen yüksek bina gövdelerini (taban ve çatının dış zarfı) çizim alanından çıkarır
  clipOccluders(x, y, w, h, from) {
    const ctx = this.ctx;
    const list = this.tallList;
    let clipped = false;
    for (let i = from; i < list.length; i++) {
      const r = list[i];
      const x0 = r.x; const x1 = r.x + r.w; const y0 = r.y; const y1 = r.y + r.h;
      const minX = Math.min(x0, r.tX0); const maxX = Math.max(x1, r.tX1);
      const minY = Math.min(y0, r.tY0); const maxY = Math.max(y1, r.tY1);
      if (maxX <= x || minX >= x + w || maxY <= y || minY >= y + h) continue;
      if (!clipped) { ctx.save(); clipped = true; }
      ctx.beginPath();
      ctx.rect(x - 400, y - 400, w + 800, h + 800);
      const top = r.tY0 < y0; const bot = r.tY1 > y1; const left = r.tX0 < x0; const right = r.tX1 > x1;
      ctx.moveTo(top ? r.tX0 : x0, minY);
      ctx.lineTo(top ? r.tX1 : x1, minY);
      ctx.lineTo(maxX, right ? r.tY0 : y0);
      ctx.lineTo(maxX, right ? r.tY1 : y1);
      ctx.lineTo(bot ? r.tX1 : x1, maxY);
      ctx.lineTo(bot ? r.tX0 : x0, maxY);
      ctx.lineTo(minX, left ? r.tY1 : y1);
      ctx.lineTo(minX, left ? r.tY0 : y0);
      ctx.closePath();
      ctx.clip('evenodd');
    }
    return clipped;
  }

  // Hilede bina içinden geçen araç kaybolmaz: en üstte yarı saydam görünür
  drawPhasing(game) {
    if (!game.phasing || game.state !== 'play') return;
    const ctx = this.ctx;
    const p = game.player;
    const img = this.playerSprite;
    const k = p.len / game.carSpec.len;
    const w = (img.wu || img.width / SPR) * k;
    const h = (img.hu || img.height / SPR) * k;
    this.place(p.x, p.y, p.a);
    ctx.globalAlpha = 0.72;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  // Taramalı silah: kısa, ince iz çizgileri (en çok maxTracers), namlu parlaması. Tek yol, tek çizim
  drawWeapon(game, now) {
    const ctx = this.ctx;
    const gun = game.gun;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    ctx.globalCompositeOperation = 'lighter';
    ctx.beginPath();
    let n = 0;
    const L = 0.022; // İz uzunluğu (sn)
    for (const b of gun.bullets) {
      if (!b.alive || n >= CONFIG.weapon.maxTracers) continue;
      ctx.moveTo(b.x - b.vx * L, b.y - b.vy * L); ctx.lineTo(b.x, b.y);
      n++;
    }
    ctx.strokeStyle = 'rgba(255,214,90,.95)'; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,235,.9)'; ctx.lineWidth = 1; ctx.stroke();
    if (gun.flash > 0 && game.state === 'play') {
      const p = game.player;
      const x = p.x + Math.cos(gun.aim) * 16; const y = p.y + Math.sin(gun.aim) * 16;
      ctx.globalAlpha = Math.min(1, gun.flash / 0.06);
      ctx.drawImage(this.sprites.glint, x - 9, y - 9, 18, 18);
      ctx.globalAlpha = 1;
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.lineCap = 'butt';
  }

  // Alt LED: önceden çizilmiş yumuşak ışık, yere yansır. Gece drawNight içinde ikinci kez, daha parlak
  // ring: gece katmanı için ortası boş halka; araba gövdesinin üstüne renk basmaz
  ledSprite(color, ring = false) {
    const cache = this.ledCache || (this.ledCache = new Map());
    const key = ring ? `r${color}` : color;
    let c = cache.get(key);
    if (!c) {
      c = makeCanvas(128, 64);
      const g = c.getContext('2d');
      g.translate(64, 32); g.scale(1, 0.5);
      const gr = g.createRadialGradient(0, 0, 4, 0, 0, 62);
      if (ring) { gr.addColorStop(0, `${color}00`); gr.addColorStop(0.42, `${color}00`); gr.addColorStop(0.6, color); gr.addColorStop(1, `${color}00`); }
      else { gr.addColorStop(0, color); gr.addColorStop(0.45, `${color}88`); gr.addColorStop(1, `${color}00`); }
      g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 62, 0, Math.PI * 2); g.fill();
      cache.set(key, c);
    }
    return c;
  }

  drawLed(game, strength, now, ring = false) {
    const look = game.look;
    if (!look || game.drop) return;
    const led = ledOf(look.led);
    if (!led.color || strength <= 0) return;
    const p = game.player;
    const ctx = this.ctx;
    const t = now / 1000;
    let color = led.color;
    if (led.fx === 'rainbow') {
      const hues = ['#ff2fa0', '#ff5a24', '#ffd23f', '#39ff7a', '#21d4fd', '#5a7bff', '#9b5cff', '#ff2fd0'];
      color = hues[Math.floor(t * 4) % hues.length];
    }
    const k = led.fx === 'breathe' ? 0.55 + 0.45 * Math.sin(t * 3) : 1;
    this.place(p.x, p.y, p.a);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, CUSTOM.ledAlpha * k * strength);
    const w = p.len * (ring ? 2.1 : 1.75); const h = p.wid * (ring ? 3.2 : 2.6);
    ctx.drawImage(this.ledSprite(color, ring), -w / 2, -h / 2, w, h);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  // Jant: tekerlek yerlerinde dönen küçük görüntüler (yalnız standart dışı jantlarda)
  drawRims(game, now) {
    const look = game.look;
    if (!look || look.rim === 'std' || game.drop) return;
    const p = game.player;
    if (p.len < 30) return; // Motosiklet: üstten jant görünmez
    const frames = this.rimFrames || (this.rimFrames = new Map());
    let f = frames.get(look.rim);
    if (!f) { f = [0, 1, 2, 3].map((i) => rimIcon(look.rim, (i * Math.PI) / 8)); frames.set(look.rim, f); }
    const dtW = Math.min(0.1, (now - (this.rimNow || now)) / 1000);
    this.rimNow = now;
    this.rimAng = ((this.rimAng || 0) + (p.forward || 0) * dtW * 0.12) % 4;
    const img = f[(Math.floor(this.rimAng) + 4) % 4];
    const ctx = this.ctx;
    // Küçük ve gövde kenarının biraz dışında: üstten bakışta görünen jant yüzü
    const r = p.wid * 0.2;
    this.place(p.x, p.y, p.a);
    ctx.globalAlpha = 0.95;
    for (const sx of [0.3, -0.3]) {
      for (const sy of [0.54, -0.54]) ctx.drawImage(img, p.len * sx - r, p.wid * sy - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  // Kar ve buz zemine bir kez işlenir: yol kenarı ve çatılar beyazlar, buzlu yol parlar
  bakeWeather(g, c) {
    const snow = this.weather === 'snow';
    for (let y = 0; y < CT; y++) {
      for (let x = 0; x < CT; x++) {
        const t = c.ground[y * CT + x];
        if (t === GROUND.WATER) continue;
        const road = t === GROUND.ROAD || t === GROUND.ALLEY || t === GROUND.TRACK;
        if (snow) {
          if (road) continue;
          g.fillStyle = 'rgba(244,248,255,.62)';
        } else {
          g.fillStyle = road ? 'rgba(190,228,255,.3)' : 'rgba(236,246,255,.28)';
        }
        g.fillRect(c.x + x * TILE, c.y + y * TILE, TILE, TILE);
        if (!snow && road && ((x * 7 + y * 3) % 5 === 0)) {
          g.fillStyle = 'rgba(255,255,255,.35)';
          g.fillRect(c.x + x * TILE + 6, c.y + y * TILE + 10, 22, 3);
        }
      }
    }
    if (!snow) return;
    g.fillStyle = 'rgba(250,252,255,.55)';
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (r.alive && r.kind === 'building') { rr(g, r.x + 3, r.y + 3, r.w - 6, r.h - 6, 4); g.fill(); }
    }
  }

  // Ekran katmanı: yağmur çizgileri, kar taneleri, sis. Havuzlu, kaliteye göre sayılı, ekran dışı çizilmez
  // Sis: canvas yerine CSS katmanı. Tarayıcı birleştirir, her karede tam ekran çizim yok
  fogLayer(game) {
    if (typeof document === 'undefined') return;
    const on = game.weather === 'fog' && game.state !== 'attract';
    let el = this.fogEl;
    if (!el) {
      if (!on) return;
      el = this.fogEl = document.createElement('div');
      el.id = 'fog-layer';
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = '<i></i><i></i>';
      Object.assign(el.style, { position: 'fixed', inset: '0', pointerEvents: 'none' });
      const [a, b] = el.children;
      Object.assign(a.style, { position: 'absolute', inset: '0', background: 'radial-gradient(circle 62vmax at 50% 50%, rgba(210,214,222,0) 13%, rgba(210,214,222,.55) 61%, rgba(210,214,222,.95) 100%)', opacity: '0' });
      Object.assign(b.style, { position: 'absolute', inset: '0', background: '#d2d6de', opacity: '0' });
      this.canvas.after(el);
      this.fogV = [-1, -1, ''];
    }
    const night = game.daylight.k;
    const wk = on ? game.wk : 0;
    const ga = Math.round(100 * wk * CONFIG.weather.fogAlpha * (1 - night * 0.55)) / 100;
    const fa = Math.round(100 * wk * 0.18) / 100;
    const col = night > 0.5 ? '#141822' : '#d2d6de';
    const v = this.fogV; const [a, b] = el.children;
    if (v[0] !== ga) { v[0] = ga; a.style.opacity = String(ga); }
    if (v[1] !== fa) { v[1] = fa; b.style.opacity = String(fa); }
    if (v[2] !== col) { v[2] = col; b.style.background = col; }
  }

  drawWeather(game, now) {
    const w = game.weather;
    this.fogLayer(game);
    if (w === 'sunny' || w === 'fog' || game.state === 'attract') return;
    const ctx = this.ctx;
    const k = game.wk * (this.lod.weather ?? 1);
    const W = this.w * this.dpr; const H = this.h * this.dpr;
    const P = CONFIG.weather;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (w === 'rain' || w === 'snow') {
      const max = P.particles[w];
      const n = Math.round(max * k);
      const wp = this.wp || (this.wp = { x: new Float32Array(200), y: new Float32Array(200), v: new Float32Array(200), cx: 0, cy: 0, t: now });
      if (!wp.init) { for (let i = 0; i < 200; i++) { wp.x[i] = Math.random() * W; wp.y[i] = Math.random() * H; wp.v[i] = 0.6 + Math.random() * 0.8; } wp.init = true; }
      const dt = Math.min(0.05, (now - wp.t) / 1000); wp.t = now;
      // Kamera kayınca taneler de kayar: dünyaya bağlı his
      const s = this.s;
      const mx = (game.cam.x - wp.cx) * s; const my = (game.cam.y - wp.cy) * s;
      wp.cx = game.cam.x; wp.cy = game.cam.y;
      const shift = Math.abs(mx) < W && Math.abs(my) < H;
      if (w === 'rain') {
        ctx.strokeStyle = 'rgba(190,210,255,.5)';
        ctx.lineWidth = 1.3 * this.dpr;
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          wp.y[i] += 900 * this.dpr * wp.v[i] * dt; wp.x[i] += 180 * this.dpr * dt;
          if (shift) { wp.x[i] -= mx * 0.6; wp.y[i] -= my * 0.6; }
          if (wp.y[i] > H) wp.y[i] -= H; if (wp.y[i] < 0) wp.y[i] += H;
          if (wp.x[i] > W) wp.x[i] -= W; if (wp.x[i] < 0) wp.x[i] += W;
          const L = 14 * this.dpr * wp.v[i];
          ctx.moveTo(wp.x[i], wp.y[i]); ctx.lineTo(wp.x[i] - L * 0.2, wp.y[i] - L);
        }
        ctx.stroke();
        // Islak zemin: hafif koyu, mavi ton
        ctx.fillStyle = `rgba(20,36,64,${(0.12 * game.wk).toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
      } else {
        ctx.fillStyle = 'rgba(255,255,255,.85)';
        const tt = now / 1000;
        for (let i = 0; i < n; i++) {
          wp.y[i] += 70 * this.dpr * wp.v[i] * dt;
          wp.x[i] += Math.sin(tt * 1.3 + i) * 22 * this.dpr * dt;
          if (shift) { wp.x[i] -= mx * 0.8; wp.y[i] -= my * 0.8; }
          if (wp.y[i] > H) wp.y[i] -= H; if (wp.y[i] < 0) wp.y[i] += H;
          if (wp.x[i] > W) wp.x[i] -= W; if (wp.x[i] < 0) wp.x[i] += W;
          const r = (1.2 + wp.v[i] * 1.4) * this.dpr;
          ctx.fillRect(wp.x[i], wp.y[i], r, r);
        }
      }
    } else if (w === 'ice') {
      ctx.fillStyle = `rgba(170,215,255,${(0.08 * game.wk).toFixed(3)})`;
      ctx.fillRect(0, 0, W, H);
    }
    ctx.globalAlpha = 1;
  }

  drawHighway(game, x0, x1, y0, y1) {
    const sp = this.sprites.npc;
    const list = game.crowd.hw;
    for (const h of list) {
      if (!h.alive || h.x < x0 - 80 || h.x > x1 + 80 || h.y < y0 - 60 || h.y > y1 + 60) continue;
      const key = `${h.kind}${h.color}`;
      let img = sp[key];
      if (!img) {
        img = sheetSprite(`npc:${h.kind}:${h.color}`, h.spec.len);
        if (!img) continue;
        sp[key] = img;
      }
      this.drawBody(img, h);
    }
    this.ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawNpcs(game, x0, x1, y0, y1) {
    const sp = this.sprites.npc;
    const fins = CONFIG.npc.finishes;
    for (const n of game.crowd.npcs) {
      if (!n.alive || n.x < x0 - 80 || n.x > x1 + 80 || n.y < y0 - 80 || n.y > y1 + 80) continue;
      const key = `${n.kind}${n.color}`;
      let img = sp[key];
      if (!img) {
        const spec = n.spec;
        img = sheetSprite(`npc:${n.kind}:${n.color}`, spec.len) || sprite(spec.len + 8, spec.wid + 10, (g) => paintNpc(g, n.kind, spec, spec.colors[n.color], fins[n.color % fins.length]));
        sp[key] = img;
      }
      this.drawBody(img, n);
    }
    this.ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawBody(img, b, shadowScale = 1, k = 1) {
    const ctx = this.ctx;
    const sp = this.sprites.shadow;
    ctx.globalAlpha = 0.42;
    this.place(b.x + 5 * shadowScale, b.y + 7 * shadowScale, b.a);
    const sw = (b.len + 6);
    const sh = (b.wid + 4);
    ctx.drawImage(sp, -sw / 2, -sh / 2, sw, sh);
    ctx.globalAlpha = 1;
    this.place(b.x, b.y, b.a);
    const w = (img.wu || img.width / SPR) * k;
    const h = (img.hu || img.height / SPR) * k;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  }

  drawPlayer(game, now = performance.now()) {
    const ctx = this.ctx;
    const p = game.player;
    const pid = `${game.carSpec.id}:${game.paint || 0}`;
    if (this.playerId !== pid) {
      this.playerId = pid;
      this.playerSprite = typeof game.paint === 'string' ? recolorSprite(game.carSpec, game.paint) : carSprite(game.carSpec, game.paint || 0);
    }
    const k = p.len / game.carSpec.len;
    if (game.drop) {
      // Düşen araç: yerde büyüyen gölge, ekranın üstünden inen gövde
      const D = game.drop;
      const fall = D.y * (game.cam.halfH + 120);
      const q = k * D.size;
      this.place(p.x, p.y, p.a);
      ctx.globalAlpha = 0.55 * D.shadow;
      const sw = p.len * (0.7 + 0.5 * D.y) * D.size; const sh = p.wid * (0.8 + 0.5 * D.y) * D.size;
      ctx.drawImage(this.sprites.dark, -sw * 0.75, -sh * 0.75, sw * 1.5, sh * 1.5);
      ctx.globalAlpha = 1;
      if (D.y > 0.02) {
        ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
        const tail = 70 + 230 * D.y;
        const tw = p.wid * D.size * 1.05;
        const tg = ctx.createLinearGradient(0, p.y - fall - tail, 0, p.y - fall);
        tg.addColorStop(0, 'rgba(33,230,255,0)'); tg.addColorStop(1, 'rgba(210,250,255,.8)');
        ctx.fillStyle = tg;
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath(); ctx.moveTo(p.x - tw * 0.2, p.y - fall - tail); ctx.lineTo(p.x + tw * 0.2, p.y - fall - tail); ctx.lineTo(p.x + tw / 2, p.y - fall); ctx.lineTo(p.x - tw / 2, p.y - fall); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      this.place(p.x, p.y - fall, p.a);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = CONFIG.playerGlow.alpha;
      const gw = p.len * CONFIG.playerGlow.scale * D.size; const gh = p.wid * CONFIG.playerGlow.scale * 1.3 * D.size;
      ctx.drawImage(this.sprites.auras[3], -gw / 2, -gh / 2, gw, gh);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      const w = (this.playerSprite.wu || this.playerSprite.width / SPR) * q;
      const h = (this.playerSprite.hu || this.playerSprite.height / SPR) * q;
      ctx.drawImage(this.playerSprite, -w / 2, -h / 2, w, h);
      ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
      return;
    }
    if (game.giantT > 0 || game.ghostT > 0) {
      ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
      const aura = game.giantT > 0 ? this.sprites.auras[3] : this.sprites.auras[1];
      const R = p.len * 1.25;
      ctx.globalAlpha = 0.6;
      ctx.drawImage(aura, p.x - R, p.y - R, R * 2, R * 2);
      ctx.globalAlpha = 1;
    }
    if (game.ghostT > 0) ctx.globalAlpha = 0.5;
    // Koruma (uzaylı geçişi, gizli geçit dönüşü): hafif yanıp sönme ve ince kalkan halkası
    if (game.shieldT > 0) {
      ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = 0.35 + 0.25 * Math.sin(now * 0.02);
      const R = p.len * 1.15;
      ctx.drawImage(this.sprites.auras[2], p.x - R, p.y - R, R * 2, R * 2);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = Math.floor(now / 110) % 2 ? 0.55 : 1;
    }
    // Gizli geçit: araba rampadan aşağı kayar, küçülür ve kararır
    const down = game.secretProgress();
    if (game.state === 'secret') {
      const q = k * (1 - 0.45 * down);
      this.place(p.x, p.y, p.a);
      ctx.globalAlpha = Math.max(0, 1 - down * 0.95);
      const w = (this.playerSprite.wu || this.playerSprite.width / SPR) * q;
      const h = (this.playerSprite.hu || this.playerSprite.height / SPR) * q;
      ctx.drawImage(this.playerSprite, -w / 2, -h / 2, w, h);
      ctx.globalAlpha = 1;
      ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
      return;
    }
    const sink = game.sinkProgress();
    if (sink > 0) {
      // Çizgi film batışı: küçülür, maviye gömülür
      const q = k * (1 - CONFIG.water.shrink * sink);
      this.place(p.x, p.y, p.a);
      ctx.globalAlpha = 1 - sink * 0.92;
      const w = (this.playerSprite.wu || this.playerSprite.width / SPR) * q;
      const h = (this.playerSprite.hu || this.playerSprite.height / SPR) * q;
      ctx.drawImage(this.playerSprite, -w / 2, -h / 2, w, h);
      ctx.globalAlpha = sink * 0.75;
      ctx.drawImage(this.sprites.water, -w * 0.7, -w * 0.7, w * 1.4, w * 1.4);
      ctx.globalAlpha = 1;
      ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
      return;
    }
    // Oyuncu aracının altında boya rengine yakın ışık
    const PG = CONFIG.playerGlow;
    this.place(p.x, p.y, p.a);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = PG.alpha * (game.ghostT > 0 ? 0.5 : 1);
    const gw = p.len * PG.scale; const gh = p.wid * PG.scale * 1.3;
    ctx.drawImage(this.sprites.auras[3], -gw / 2, -gh / 2, gw, gh);
    ctx.globalCompositeOperation = 'source-over';
    this.drawLed(game, 1, now);
    ctx.globalAlpha = game.ghostT > 0 ? 0.5 : 1;
    this.drawBody(this.playerSprite, p, k, k);
    ctx.globalAlpha = 1;
    this.drawRims(game, now);
    if (game.weapon) {
      // 360° taret: son hedefe döner, hedef yoksa ileri
      const a = game.gun.target ? game.gun.aim : p.a;
      this.place(p.x - Math.cos(p.a) * p.len * 0.08, p.y - Math.sin(p.a) * p.len * 0.08, a);
      const lw = this.sprites.launcher.width / SPR; const lh = this.sprites.launcher.height / SPR;
      ctx.drawImage(this.sprites.launcher, -lw / 2, -lh / 2, lw, lh);
    }
    if (game.stage >= 2) {
      ctx.globalAlpha = game.stage >= 3 ? 0.42 : 0.22;
      ctx.drawImage(this.sprites.dark, -p.len * 0.2, -p.wid * 0.9, p.len, p.wid * 1.8);
      ctx.globalAlpha = 1;
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  // Meteor uyarısı (yerde): kırmızı daire, nişangâh, 3 saniyede dolan halka, yanıp sönen hedef işareti
  drawMeteorWarn(game, now) {
    const ctx = this.ctx;
    const M = CONFIG.meteor;
    const R = M.radius;
    for (const m of game.meteors.list) {
      if (!m.alive) continue;
      const k = Math.min(1, m.t / M.warn);
      const blink = Math.floor(now / (k > 0.7 ? 90 : 170)) % 2 === 0;
      ctx.beginPath(); ctx.arc(m.x, m.y, R, 0, 6.283);
      ctx.fillStyle = `rgba(255,40,30,${0.1 + 0.16 * k})`; ctx.fill();
      ctx.strokeStyle = 'rgba(255,70,40,.9)'; ctx.lineWidth = 3; ctx.setLineDash([14, 9]); ctx.stroke(); ctx.setLineDash([]);
      // İlerleme halkası: 3 saniyede dolar
      ctx.beginPath(); ctx.arc(m.x, m.y, R - 7, -Math.PI / 2, -Math.PI / 2 + k * 6.283);
      ctx.strokeStyle = '#ffd23f'; ctx.lineWidth = 7; ctx.stroke();
      // Nişangâh
      ctx.strokeStyle = blink ? '#ffffff' : '#ff3b2a'; ctx.lineWidth = 3;
      const r1 = R * 0.28; const r2 = R * 0.62;
      ctx.beginPath();
      ctx.moveTo(m.x - r2, m.y); ctx.lineTo(m.x - r1, m.y); ctx.moveTo(m.x + r1, m.y); ctx.lineTo(m.x + r2, m.y);
      ctx.moveTo(m.x, m.y - r2); ctx.lineTo(m.x, m.y - r1); ctx.moveTo(m.x, m.y + r1); ctx.lineTo(m.x, m.y + r2);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(m.x, m.y, r1 * 0.6, 0, 6.283); ctx.stroke();
      // Yere düşen gölge büyür
      const fall = M.fall / M.warn;
      if (k > 1 - fall) {
        const q = (k - (1 - fall)) / fall;
        ctx.globalAlpha = 0.25 + 0.45 * q;
        ctx.drawImage(this.sprites.dark, m.x - R * 0.5 * q, m.y - R * 0.35 * q, R * q, R * 0.7 * q);
        ctx.globalAlpha = 1;
      }
    }
  }

  // Düşen meteor (gökte): uyarının son anlarında yukarıdan çakılır
  drawMeteorSky(game, now) {
    const ctx = this.ctx;
    const M = CONFIG.meteor;
    const sp = this.sprites;
    const fallFrom = M.warn - M.fall;
    for (const m of game.meteors.list) {
      if (!m.alive || m.t < fallFrom) continue;
      const q = (m.t - fallFrom) / M.fall; // 0 gökte, 1 yerde
      const h = (1 - q) * (game.cam.halfH * 0.7 + 80); // Ekranın içinden düşer: görünür
      const sz = 1.6 - 0.7 * q;
      const w = 70 * sz; const hh = 110 * sz;
      ctx.drawImage(sp.meteor, m.x - w / 2 + (1 - q) * 120, m.y - h - hh * 0.62, w, hh);
    }
  }

  drawCops(game, now, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const sp = this.sprites;
    for (const c of game.cops) {
      if (c.flying) continue;
      if (c.x < x0 - 80 || c.x > x1 + 80 || c.y < y0 - 80 || c.y > y1 + 80) continue;
      if (c.alien) {
        // Işınlanma sütunu ve yerdeki parıltı
        ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
        ctx.globalCompositeOperation = 'lighter';
        const pulse = 0.55 + 0.25 * Math.sin(now * 0.008 + c.id);
        ctx.globalAlpha = c.warpT > 0 ? 0.9 : 0.35 * pulse;
        const R = c.len * (c.warpT > 0 ? 1.4 : 0.95);
        ctx.drawImage(sp.auras[1], c.x - R, c.y - R, R * 2, R * 2);
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = c.warpT > 0 ? Math.max(0.15, 1 - c.warpT / CONFIG.aliens.wake) : 1;
        this.drawBody(sp[c.type], c, 1);
        ctx.globalAlpha = 1;
      } else this.drawBody(sp[c.type], c, c.type === 'tank' ? 1.6 : 1);
      if (c.type === 'tank') {
        this.place(c.x, c.y, c.turret);
        const w = sp.turret.width / SPR;
        const h = sp.turret.height / SPR;
        ctx.drawImage(sp.turret, -w / 2, -h / 2, w, h);
      }
      if (c.hurtFlash > 0) {
        this.place(c.x, c.y, c.a);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.5;
        ctx.drawImage(sp.fire, -c.len / 2, -c.wid, c.len, c.wid * 2);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawParticles(game, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const fx = game.fx;
    const { x, y, life, ttl, size, kind, rot, color } = fx;
    const sp = this.sprites;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    for (let i = 0; i < fx.max; i++) {
      if (life[i] <= 0) continue;
      const k = kind[i];
      if (k === FX.FIRE || k === FX.SPARK || k === FX.GLINT) continue;
      if (x[i] < x0 || x[i] > x1 || y[i] < y0 || y[i] > y1) continue;
      const t = life[i] / ttl[i];
      if (k === FX.SIMIT) {
        const q = size[i];
        ctx.globalAlpha = Math.min(1, t * 2.5);
        ctx.drawImage(sp.simit, x[i] - q, y[i] - q, q * 2, q * 2);
        continue;
      }
      if (k === FX.DEBRIS) {
        this.place(x[i], y[i], rot[i]);
        ctx.globalAlpha = Math.min(1, t * 2);
        ctx.fillStyle = fx.colors[color[i]];
        ctx.fillRect(-size[i] / 2, -size[i] / 3, size[i], size[i] * 0.66);
        ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
        continue;
      }
      const img = k === FX.DARK ? sp.dark : k === FX.DUST ? sp.dust : k === FX.WATER ? sp.water : sp.smoke;
      const r = size[i] * (1 + (1 - t) * 1.7);
      ctx.globalAlpha = t * 0.9;
      ctx.drawImage(img, x[i] - r, y[i] - r, r * 2, r * 2);
    }
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = '#ffd98a';
    ctx.lineWidth = 2;
    for (let i = 0; i < fx.max; i++) {
      if (life[i] <= 0) continue;
      const k = kind[i];
      if (k !== FX.FIRE && k !== FX.SPARK && k !== FX.GLINT) continue;
      if (x[i] < x0 || x[i] > x1 || y[i] < y0 || y[i] > y1) continue;
      const t = life[i] / ttl[i];
      ctx.globalAlpha = Math.min(1, t * 1.4);
      if (k === FX.SPARK) {
        ctx.beginPath();
        ctx.moveTo(x[i], y[i]);
        ctx.lineTo(x[i] - fx.vx[i] * 0.03, y[i] - fx.vy[i] * 0.03);
        ctx.stroke();
      } else {
        const r = k === FX.GLINT ? size[i] * 2 : size[i] * (0.6 + t * 0.8);
        ctx.drawImage(k === FX.GLINT ? sp.glint : sp.fire, x[i] - r, y[i] - r, r * 2, r * 2);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  drawSirens(game, now, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const sp = this.sprites;
    ctx.globalCompositeOperation = 'lighter';
    for (const c of game.cops) {
      if (c.type === 'tank' || c.alien || game.ghostT > 0) continue;
      if (c.x < x0 - 90 || c.x > x1 + 90 || c.y < y0 - 90 || c.y > y1 + 90) continue;
      const on = Math.floor(now / 130 + c.id) % 2 === 0;
      const side = c.wid * 0.5;
      const nx = -Math.sin(c.a) * side;
      const ny = Math.cos(c.a) * side;
      const R = c.type === 'swat' ? 66 : c.type === 'moto' ? 38 : 54;
      ctx.globalAlpha = on ? 0.85 : 0.22;
      ctx.drawImage(sp.red, c.x - nx - R, c.y - ny - R, R * 2, R * 2);
      ctx.globalAlpha = on ? 0.22 : 0.85;
      ctx.drawImage(sp.blue, c.x + nx - R, c.y + ny - R, R * 2, R * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  drawWaves(game) {
    const ctx = this.ctx;
    for (const w of game.fx.waves) {
      if (!w.alive) continue;
      ctx.globalAlpha = (1 - w.t) * 0.85;
      ctx.strokeStyle = '#fff3c4';
      ctx.lineWidth = 3 + 13 * (1 - w.t);
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, 6.3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  drawFloats(game) {
    const ctx = this.ctx;
    ctx.font = '400 19px Bungee, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const f of game.fx.floats) {
      if (!f.alive) continue;
      ctx.globalAlpha = Math.min(1, (1.1 - f.t) * 3);
      ctx.fillStyle = 'rgba(0,0,0,.55)';
      ctx.fillText(f.text, f.x + 1.5, f.y + 1.5);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
  }

  drawSpeedLines(game, now) {
    const p = game.player;
    const k = (p.speed / game.carSpec.maxSpeed - 0.72) / 0.28;
    if (k <= 0 || game.state !== 'play' || !this.lod.speedLines) return;
    const ctx = this.ctx;
    const { dpr, w, h } = this;
    const a = Math.atan2(p.vy, p.vx);
    const cx = (w * dpr) / 2;
    const cy = (h * dpr) / 2;
    const diag = Math.hypot(w, h) * dpr * 0.5;
    ctx.strokeStyle = 'rgba(255,255,255,.55)';
    ctx.lineWidth = 1.5 * dpr;
    ctx.globalAlpha = Math.min(0.32, k * 0.32);
    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
      const seed = (i * 2654435761) >>> 0;
      const off = ((seed >>> 8) % 1000) / 500 - 1;
      const phase = ((now * 0.003 + (seed & 255) / 255) % 1);
      const along = diag * (1 - phase * 2);
      const across = off * diag * 0.95;
      if (Math.abs(across) < diag * 0.28) continue;
      const len = 90 * dpr;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const px = cx + ca * along - sa * across;
      const py = cy + sa * along + ca * across;
      ctx.moveTo(px, py);
      ctx.lineTo(px - ca * len, py - sa * len);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  drawOverlay(game, now) {
    const ctx = this.ctx;
    const { dpr, w, h } = this;
    let a = Math.max(0, game.hitFlash) * 0.55;
    if (game.stage >= 3) a = Math.max(a, 0.22 + 0.14 * Math.sin(now * 0.012));
    const warn = game.warnT > 0 ? 0.3 + 0.25 * Math.sin(now * 0.02) : 0;
    if (a <= 0.01 && warn <= 0) return;
    if (!this.vignette) {
      const W = 256;
      const H = 256;
      const c = makeCanvas(W, H);
      const g = c.getContext('2d');
      const grad = g.createRadialGradient(W / 2, H / 2, W * 0.28, W / 2, H / 2, W * 0.72);
      grad.addColorStop(0, 'rgba(255,0,0,0)');
      grad.addColorStop(1, 'rgba(255,20,10,1)');
      g.fillStyle = grad;
      g.fillRect(0, 0, W, H);
      this.vignette = c;
      const c2 = makeCanvas(W, H);
      const g2 = c2.getContext('2d');
      const grad2 = g2.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.72);
      grad2.addColorStop(0, 'rgba(0,60,255,0)');
      grad2.addColorStop(1, 'rgba(40,80,255,1)');
      g2.fillStyle = grad2;
      g2.fillRect(0, 0, W, H);
      this.vignette2 = c2;
    }
    if (a > 0.01) {
      ctx.globalAlpha = Math.min(0.8, a);
      ctx.drawImage(this.vignette, 0, 0, w * dpr, h * dpr);
    }
    if (warn > 0) {
      ctx.globalAlpha = warn;
      ctx.drawImage(Math.floor(now / 220) % 2 ? this.vignette : this.vignette2, 0, 0, w * dpr, h * dpr);
    }
    ctx.globalAlpha = 1;
  }
}

