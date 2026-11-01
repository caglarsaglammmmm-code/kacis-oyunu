// Canvas çizimi. Sprite'lar açılışta koddan üretilir; sadece ekrandaki nesneler çizilir.
import { CONFIG, GROUND, BUILD } from './config.js';
import { CHUNK, CT, TILE, PROP, isPower, powerName } from './world.js';
import { PED_FLY, lightState } from './crowd.js';
import { paintTr } from './cars.js';
import { sheetSprite } from './sheet.js';
import { paintBuilding2, shadowOf } from './buildings.js';
import { FX } from './effects.js';
import { rr, shade, paintLux, paintCar, paintPolice, paintPoliceFast, paintMoto, paintSwat, paintTankHull, paintTurret, paintNpc, paintPed, paintPedKind, paintUfo, paintRover, signCanvas, roofClutter, paintLight, paintSimit, paintPower, paintSpecial, TALL_STYLES, POWER_LOOK } from './art.js';

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

// Tabela boyutu: 0 minicik, 1 normal, 2 büyük, 3 dev çatı yazısı
const signOut = { x: 0, y: 0, w: 0, h: 0 };
function signBox(r, img) {
  const size = r.signSize ?? 1;
  const hTarget = [10, 16, 24, 40][size] ?? 16;
  const maxW = size === 3 ? r.w * 0.94 : r.w - 6;
  const w = Math.min(maxW, (img.width / img.height) * hTarget);
  const h = (w / img.width) * img.height;
  signOut.w = w;
  signOut.h = h;
  signOut.x = r.x + (r.w - w) / 2;
  // Dev yazı çatının ortasında, öteki tabelalar cephede
  signOut.y = size === 3 ? r.y + 8 : r.y + r.h - h - 7;
  return signOut;
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
    this.makeSprites();
  }

  // Atlas yüklenince polis ve park etmiş araçlar 3B modellerden gelir
  useAtlas() {
    const P = CONFIG.police;
    const s = this.sprites;
    for (const k of ['car', 'fast', 'advanced', 'swat', 'moto']) {
      const img = sheetSprite(`cop:${k}`, P[k].len);
      if (img) s[k] = img;
    }
    const list = [];
    for (const [k, n] of [['egea', 4], ['clio', 4], ['tofas', 5], ['golf', 5], ['focus', 4], ['megane', 4], ['linea', 4], ['bavyera', 5], ['kore', 4], ['murat', 4]]) {
      for (let i = 0; i < n; i++) { const img = sheetSprite(`npc:${k}:${i}`, 44); if (img) list.push(img); }
    }
    if (list.length) s.parked = list;
    s.npc = {};
    this.playerId = '';
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
  drawTalls(game, c0x, c1x, c0y, c1y) {
    const ctx = this.ctx;
    const cam = game.cam;
    const cx = cam.x; const cy = cam.y;
    const N = 6;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    const mx = cam.halfW + 120; const my = cam.halfH + 120;
    for (let gy = c0y - 1; gy <= c1y + 1; gy++) {
      for (let gx = c0x - 1; gx <= c1x + 1; gx++) {
        const key = (gx + 32768) * 65536 + (gy + 32768);
        const c = game.world.chunks.get(key);
        if (!c) continue;
        for (const r of c.talls) {
          if (!r.alive) continue;
          const k = r.tall;
          if (r.x + r.w < cx - mx || r.x > cx + mx || r.y + r.h < cy - my || r.y > cy + my) continue;
          const x0 = r.x; const x1 = r.x + r.w; const y0 = r.y; const y1 = r.y + r.h;
          const X0 = x0 + (x0 - cx) * k; const X1 = x1 + (x1 - cx) * k;
          const Y0 = y0 + (y0 - cy) * k; const Y1 = y1 + (y1 - cy) * k;
          const tex = this.walls[r.seed % this.walls.length];
          // Güney ve kuzey duvarları
          for (const south of [cy > y1, cy < y0]) {
            if (!south) continue;
            const fromY = cy > y1 ? y1 : y0; const toY = cy > y1 ? Y1 : Y0;
            ctx.globalAlpha = 1;
            for (let t = 0; t < N; t++) {
              const a = t / N; const b = (t + 1) / N;
              const xa = x0 + (X0 - x0) * b; const xb = x1 + (X1 - x1) * b;
              const ya = fromY + (toY - fromY) * a; const yb = fromY + (toY - fromY) * b;
              ctx.drawImage(tex.n, 0, 192 * (1 - b), Math.min(96, r.w), 192 / N, xa, Math.min(ya, yb) - 0.4, xb - xa, Math.abs(yb - ya) + 0.8);
            }
            if (cy < y0) { ctx.fillStyle = 'rgba(0,0,20,.28)'; ctx.fillRect(Math.min(x0, X0), Y0, Math.max(x1, X1) - Math.min(x0, X0), y0 - Y0); }
          }
          // Doğu ve batı duvarları
          for (const east of [cx > x1, cx < x0]) {
            if (!east) continue;
            const fromX = cx > x1 ? x1 : x0; const toX = cx > x1 ? X1 : X0;
            for (let t = 0; t < N; t++) {
              const a = t / N; const b = (t + 1) / N;
              const ya = y0 + (Y0 - y0) * b; const yb = y1 + (Y1 - y1) * b;
              const xa = fromX + (toX - fromX) * a; const xc = fromX + (toX - fromX) * b;
              ctx.drawImage(tex.e, 192 * (1 - b), 0, 192 / N, Math.min(96, r.h), Math.min(xa, xc) - 0.4, ya, Math.abs(xc - xa) + 0.8, yb - ya);
            }
            ctx.fillStyle = 'rgba(0,0,20,.16)';
            ctx.beginPath(); ctx.moveTo(fromX, y0); ctx.lineTo(toX, Y0); ctx.lineTo(toX, Y1); ctx.lineTo(fromX, y1); ctx.closePath(); ctx.fill();
          }
          ctx.drawImage(this.roofs[(r.seed >> 2) % this.roofs.length], X0, Y0, X1 - X0, Y1 - Y0);
          if (r.sign) {
            const img = signCanvas(r.sign, r.signColor, r.seed);
            const w = Math.min((X1 - X0) * 0.86, (img.width / img.height) * 26);
            const h = (w / img.width) * img.height;
            ctx.drawImage(img, (X0 + X1) / 2 - w / 2, (Y0 + Y1) / 2 - h / 2, w, h);
          }
        }
      }
    }
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
            for (let k = 0; k < 2; k++) {
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
    const AL = CONFIG.aliens;
    s.ufo = sprite(AL.ufo.len + 10, AL.ufo.len + 10, (g) => paintUfo(g, AL.ufo));
    s.rover = sprite(AL.rover.len + 16, AL.rover.wid + 16, (g) => paintRover(g, AL.rover));
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
  bakePads(g, c) {
    for (let i = 0; i < c.padCount; i++) {
      const p = c.pads[i];
      if (p.w <= 0 || p.h <= 0) continue; // Otoban bandında kalan saha iptal edilmiştir
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
    if (!r.sign) return;
    const img = signCanvas(r.sign, r.signColor, r.seed);
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

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#6cc24a';
    ctx.fillRect(0, 0, w * dpr, h * dpr);
    ctx.setTransform(s, 0, 0, s, ox, oy);

    const c0x = Math.floor(vx0 / CHUNK);
    const c1x = Math.floor(vx1 / CHUNK);
    const c0y = Math.floor(vy0 / CHUNK);
    const c1y = Math.floor(vy1 / CHUNK);
    this.frameId = (this.frameId || 0) + 1;
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = world.chunk(cx, cy);
        c.lastSeen = this.frameId;
        if (!c.canvas || c.dirty) this.bake(c);
        ctx.drawImage(c.canvas, c.x, c.y, CHUNK + 0.6, CHUNK + 0.6);
      }
    }
    // Görünmeden önce hazırla: kaydırmada takılma olmasın (karede en fazla 1)
    // Telefonda takılma olmasın diye dört karede bir
    if (game.state === 'play') {
      if (!this.job) this.prebake(game, c0x, c1x, c0y, c1y);
      this.stepJob(PF.bakeBudget);
    }

    this.drawDecals(game, vx0, vx1, vy0, vy1);
    this.drawSkids(game, vx0, vx1, vy0, vy1);
    this.drawSpikes(game);
    this.drawShots(game, now);
    this.drawProps(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now, false);
    this.drawPeds(game, vx0, vx1, vy0, vy1, false);
    this.drawNpcs(game, vx0, vx1, vy0, vy1);
    this.drawHighway(game, vx0, vx1, vy0, vy1);
    this.drawCops(game, now, vx0, vx1, vy0, vy1);
    if (game.state !== 'dying' && game.state !== 'over') this.drawPlayer(game);
    this.drawProps(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now, true);
    this.drawPeds(game, vx0, vx1, vy0, vy1, true);
    this.drawLights(game, c0x, c1x, c0y, c1y);
    this.drawFires(game, now, c0x, c1x, c0y, c1y);
    this.drawTalls(game, c0x, c1x, c0y, c1y);
    this.drawUfos(game, now, vx0, vx1, vy0, vy1);
    this.drawParticles(game, vx0, vx1, vy0, vy1);
    this.drawNight(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now);
    this.drawSirens(game, now, vx0, vx1, vy0, vy1);
    this.drawWaves(game);
    this.drawFloats(game);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    this.drawSpeedLines(game, now);
    this.drawOverlay(game, now);
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
          const isTall = pr.kind === PROP.QUEUE || pr.kind === PROP.TREE || pr.kind === PROP.PALM || pr.kind === PROP.PINE || pr.kind === PROP.LAUNDRY;
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
    ctx.globalCompositeOperation = 'lighter';
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = game.world.chunk(cx, cy);
        for (let i = 0; i < c.lightCount; i++) {
          const l = c.lights[i];
          if (l.x + l.w < x0 - 60 || l.x > x1 + 60 || l.y + l.h < y0 - 60 || l.y > y1 + 60) continue;
          if (l.kind === 0) {
            ctx.globalAlpha = night * 0.85;
            ctx.drawImage(sp.lamp, l.x - 70, l.y - 70, 140, 140);
          } else if (l.kind === 1) {
            if (!l.rect.alive || (l.rect.seed + i) % 3 === 0) continue; // Bazı evlerde ışık kapalı
            ctx.globalAlpha = night * 0.8;
            ctx.drawImage(sp.win, l.x, l.y, l.w, l.h);
          } else if (l.kind === 2) {
            if (!l.rect.alive) continue;
            ctx.globalAlpha = night * (0.65 + 0.3 * Math.sin(now * 0.006 + l.x));
            ctx.drawImage(sp.neons[l.rect.seed % sp.neons.length], l.x - 50, l.y - 50, l.w + 100, l.h + 100);
          }
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    // Tabelalar gece aydınlık kalır
    ctx.globalAlpha = night * 0.9;
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = game.world.chunk(cx, cy);
        for (let i = 0; i < c.lightCount; i++) {
          const l = c.lights[i];
          if (l.kind < 2 || !l.rect.alive || l.x + l.w < x0 || l.x > x1 || l.y + l.h < y0 || l.y > y1) continue;
          const r = l.rect;
          const img = signCanvas(r.sign, r.signColor, r.seed);
          const b = signBox(r, img);
          ctx.drawImage(img, b.x, b.y, b.w, b.h);
        }
      }
    }
    // Araç farları
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = night * 0.9;
    const beam = sp.beam;
    const bw = beam.width / SPR;
    const bh = beam.height / SPR;
    const head = (b) => {
      if (b.x < x0 - 120 || b.x > x1 + 120 || b.y < y0 - 120 || b.y > y1 + 120) return;
      this.place(b.x + Math.cos(b.a) * b.len * 0.46, b.y + Math.sin(b.a) * b.len * 0.46, b.a);
      ctx.drawImage(beam, -bw / 2, -bh / 2, bw, bh);
    };
    if (game.state === 'play') head(game.player);
    for (const c of game.cops) if (c.type !== 'tank' && !c.flying) head(c);
    for (const n of game.crowd.npcs) if (n.alive && n.state === 'drive') head(n);
    for (const n of game.crowd.hw) if (n.alive) head(n);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
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

  drawPlayer(game) {
    const ctx = this.ctx;
    const p = game.player;
    const pid = `${game.carSpec.id}:${game.paint || 0}`;
    if (this.playerId !== pid) {
      this.playerId = pid;
      this.playerSprite = carSprite(game.carSpec, game.paint || 0);
    }
    const k = p.len / game.carSpec.len;
    if (game.giantT > 0 || game.ghostT > 0) {
      ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
      const aura = game.giantT > 0 ? this.sprites.auras[3] : this.sprites.auras[1];
      const R = p.len * 1.25;
      ctx.globalAlpha = 0.6;
      ctx.drawImage(aura, p.x - R, p.y - R, R * 2, R * 2);
      ctx.globalAlpha = 1;
    }
    if (game.ghostT > 0) ctx.globalAlpha = 0.5;
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
    ctx.globalAlpha = game.ghostT > 0 ? 0.5 : 1;
    this.drawBody(this.playerSprite, p, k, k);
    ctx.globalAlpha = 1;
    if (game.stage >= 2) {
      ctx.globalAlpha = game.stage >= 3 ? 0.42 : 0.22;
      ctx.drawImage(this.sprites.dark, -p.len * 0.2, -p.wid * 0.9, p.len, p.wid * 1.8);
      ctx.globalAlpha = 1;
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  // Uçan daireler en üstte: gölgesi yerde, ışını oyuncunun üstünde
  drawUfos(game, now, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const sp = this.sprites;
    for (const c of game.cops) {
      if (!c.flying || c.x < x0 - 200 || c.x > x1 + 200 || c.y < y0 - 200 || c.y > y1 + 200) continue;
      const R = c.len / 2;
      ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
      ctx.globalAlpha = 0.3;
      ctx.drawImage(sp.dark, c.x + 16, c.y + 44, R * 2.1, R * 1.6);
      if (c.beam) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.5 + 0.2 * Math.sin(now * 0.03);
        ctx.fillStyle = '#39ff9c';
        ctx.beginPath(); ctx.moveTo(c.x - 16, c.y); ctx.lineTo(c.x + 16, c.y); ctx.lineTo(game.player.x + 42, game.player.y); ctx.lineTo(game.player.x - 42, game.player.y); ctx.closePath(); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
      this.place(c.x, c.y - 10, c.a);
      const w = sp.ufo.width / SPR;
      ctx.drawImage(sp.ufo, -w / 2, -w / 2, w, w);
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawCops(game, now, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const sp = this.sprites;
    for (const c of game.cops) {
      if (c.flying) continue;
      if (c.x < x0 - 80 || c.x > x1 + 80 || c.y < y0 - 80 || c.y > y1 + 80) continue;
      this.drawBody(sp[c.type], c, c.type === 'tank' ? 1.6 : 1);
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
      if (c.type === 'tank' || c.flying || c.type === 'rover' || game.ghostT > 0) continue;
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
    if (k <= 0 || game.state !== 'play') return;
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

