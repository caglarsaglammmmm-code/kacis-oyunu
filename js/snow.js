// KAR VE BUZ: yalnız üst yüzeyler. Çatılara kalın, kabarık kar örtüsü; çatı nesnelerine, tabelaların üst kenarına,
// ağaçlara ve park halindeki arabalara ince kar. Buzlu havada çatı kenarlarında buz sarkıtları. Yol, kaldırım, duvar ve
// tabela renkleri hiç değişmez. Çizimler binaya özel ve önbellekli: chunk önbelleğine bir kez işlenir (alçak binalar),
// yüksek binalarda binaya özel küçük tuval saklanır. Anıt alanı ve stadyumlar bina değildir: kar almaz.
import { CONFIG } from './config.js';

const SNW = CONFIG.snow;
const SNW_TAU = Math.PI * 2;

// Tohumdan tekrarlanabilir sayı dizisi: aynı bina her çizimde aynı karı alır
function snwRand(seed) {
  let s = (seed * 2654435761) >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}

function snwCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(Math.max(1, Math.ceil(w)), Math.max(1, Math.ceil(h)));
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h));
  return c;
}

// Kalın kar örtüsü bu stillerde (düz çatılı şehir binaları); diğerleri (kubbe, değirmen, kule) yalnız hafif serpinti alır
const SNW_FLAT = new Set([0, 1, 2, 3, 4, 5, 6, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 35, 36, 37, 38, 39, 40, 41, 42, 44, 45, 17, 13, 15]);
export function snowFlat(r) { return SNW_FLAT.has(r.style); }

// Kar kalınlığı 0..1: oyun süresince yavaşça artar, adım adım (önbellek az yenilenir)
export function snowLevel(runTime) {
  const k = Math.min(1, SNW.start + (1 - SNW.start) * (runTime / SNW.grow));
  return Math.round(k * SNW.steps) / SNW.steps;
}

// Çatı karı: tek bir beyaz örtü değil, kabarık kar yığınları. Yığınların arasında ve kenarda çatı rengi belli olur
// (şehir renkli kalır), kalınlaştıkça yığınlar büyür. Kenar gölgeli ve hacimli, üst-sol ışıklı
export function paintRoofSnow(g, x, y, w, h, level, seed, flat = true) {
  if (w < 12 || h < 10) return;
  const rnd = snwRand(seed + 7);
  const m = Math.max(3, (flat ? SNW.edge : SNW.edge * 2) * (1.6 - level * 0.7)); // Kenar payı: çatı rengi bandı
  const X = x + m; const Y = y + m; const W = w - m * 2; const H = h - m * 2;
  if (W < 6 || H < 6) return;
  const a = flat ? SNW.alpha : SNW.alpha * 0.6;
  // Yığın ızgarası: büyük çatıda birkaç yığın; aralık kalınlıkla daralır
  const nx = Math.max(1, Math.round(W / 70)); const ny = Math.max(1, Math.round(H / 70));
  const gap = (flat ? SNW.gap : SNW.gap * 1.6) * (1.25 - level * 0.75);
  const cw = W / nx; const ch = H / ny;
  const bump = 2.4 + level * 3;
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      // Bazı hücreler boş kalır (rüzgâr süpürmüş), kalınlıkla azalır
      if (nx * ny > 2 && rnd() < SNW.bare * (1 - level * 0.8)) continue;
      const jx = (rnd() - 0.5) * gap; const jy = (rnd() - 0.5) * gap;
      const bx = X + i * cw + gap / 2 + jx * 0.5; const by = Y + j * ch + gap / 2 + jy * 0.5;
      const bw = cw - gap * (0.6 + rnd() * 0.6); const bh = ch - gap * (0.6 + rnd() * 0.6);
      if (bw < 8 || bh < 8) continue;
      // Kar gövdesi: üst-sol ışıklı, alt-sağ kenarı içeride gölgeli (hacim). Gölge çatı rengine taşmaz: renk solmaz
      const grd = g.createLinearGradient(bx, by, bx + bw, by + bh);
      grd.addColorStop(0, `rgba(255,255,255,${a.toFixed(3)})`);
      grd.addColorStop(0.55, `rgba(245,249,255,${a.toFixed(3)})`);
      grd.addColorStop(0.85, `rgba(222,232,246,${a.toFixed(3)})`);
      grd.addColorStop(1, `rgba(186,202,226,${a.toFixed(3)})`);
      g.fillStyle = grd;
      snwBlob(g, bx, by, bw, bh, bump, snwRand(seed + i * 13 + j * 7));
      g.fill();
      // Yumuşak tümsek ışığı
      g.fillStyle = `rgba(255,255,255,${(0.6 * a).toFixed(3)})`;
      g.beginPath(); g.ellipse(bx + bw * (0.25 + rnd() * 0.3), by + bh * (0.25 + rnd() * 0.3), Math.min(bw, bh) * 0.22, Math.min(bw, bh) * 0.13, -0.5, 0, SNW_TAU); g.fill();
    }
  }
}

// Kenarı tümsekli dikdörtgen
function snwBlob(g, x, y, w, h, bump, rnd) {
  g.beginPath();
  const r = Math.min(6, w / 4, h / 4);
  g.moveTo(x + r, y);
  const edge = (x0, y0, x1, y1, nx, ny) => {
    const L = Math.hypot(x1 - x0, y1 - y0);
    const n = Math.max(2, Math.floor(L / 9));
    for (let i = 1; i <= n; i++) {
      const t = i / n; const tm = (i - 0.5) / n;
      const b = bump * (0.4 + rnd() * 0.6);
      g.quadraticCurveTo(x0 + (x1 - x0) * tm + nx * b, y0 + (y1 - y0) * tm + ny * b, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t);
    }
  };
  edge(x + r, y, x + w - r, y, 0, -1);
  g.quadraticCurveTo(x + w, y, x + w, y + r);
  edge(x + w, y + r, x + w, y + h - r, 1, 0);
  g.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  edge(x + w - r, y + h, x + r, y + h, 0, 1);
  g.quadraticCurveTo(x, y + h, x, y + h - r);
  edge(x, y + h - r, x, y + r, -1, 0);
  g.quadraticCurveTo(x, y, x + r, y);
  g.closePath();
}

// Çatı nesnelerinin (baca, klima, su deposu) üstünde kar birikintisi: roofClutter ile aynı yerler
export function paintClutterSnow(g, r, level) {
  const n = 1 + (r.seed % 3);
  const wall = 12;
  g.fillStyle = `rgba(255,255,255,${(0.75 + 0.2 * level).toFixed(3)})`;
  for (let i = 0; i < n; i++) {
    const px = r.x + 10 + ((r.seed * (i + 2) * 17) % Math.max(1, r.w - 22));
    const py = r.y + 9 + ((r.seed * (i + 4) * 23) % Math.max(1, r.h - wall - 24));
    g.beginPath(); g.ellipse(px - 1, py - 1.5, 4 + level, 2.4 + level * 0.8, -0.6, 0, SNW_TAU); g.fill();
  }
  if (r.seed % 2 === 0 && r.w > 60) g.fillRect(r.x + r.w - 26, r.y + 5, 15, 2 + level * 1.5);
}

// Tabelanın üst kenarında ince kar çizgisi (yazı kendi renginde kalır)
export function paintSignSnow(g, x, y, w, level) {
  g.fillStyle = 'rgba(255,255,255,.92)';
  const t = 1.4 + level * 1.6;
  g.beginPath();
  g.moveTo(x, y + 0.5);
  for (let k = 0; k <= 6; k++) g.quadraticCurveTo(x + (w * (k + 0.5)) / 7, y - t * (0.6 + ((k * 7) % 5) / 10), x + (w * (k + 1)) / 7, y + 0.5);
  g.lineTo(x + w, y + 1.2); g.lineTo(x, y + 1.2);
  g.closePath(); g.fill();
}

// BUZ SARKITLARI: kenar boyunca düzensiz gruplar, sivri uç, yarı saydam açık mavi-beyaz, parlak yansıma çizgisi
// Tek sarkıt görüntüsü bir kez çizilir (birkaç boy), sonra yalnız kopyalanır: önbellek hazırlığı ucuz kalır
const SNW_ICE = [];
function snwIcicle(drip) {
  const k = drip ? 1 : 0;
  if (SNW_ICE[k]) return SNW_ICE[k];
  const W = 12; const H = 52; const sc = 4;
  const c = snwCanvas(W * sc, (H + 6) * sc);
  const g = c.getContext('2d');
  g.scale(sc, sc);
  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, 'rgba(235,248,255,.95)');
  gr.addColorStop(0.55, 'rgba(180,225,255,.7)');
  gr.addColorStop(1, 'rgba(160,215,255,.35)');
  g.fillStyle = gr;
  g.beginPath();
  g.moveTo(0, 0);
  g.quadraticCurveTo(W * 0.28, H * 0.55, W / 2, H);
  g.quadraticCurveTo(W * 0.72, H * 0.55, W, 0);
  g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.9)'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(W * 0.35, 2); g.lineTo(W * 0.45, H * 0.7); g.stroke();
  if (drip) { g.fillStyle = 'rgba(200,236,255,.85)'; g.beginPath(); g.ellipse(W / 2, H + 3, 2.2, 3, 0, 0, SNW_TAU); g.fill(); }
  SNW_ICE[k] = c;
  return c;
}

// BUZ SARKITLARI: kenar boyunca düzensiz gruplar, farklı boy, sivri uç, yarı saydam açık mavi-beyaz, parlak yansıma çizgisi
export function paintIcicles(g, x, y, w, seed, scale = 1) {
  const I = CONFIG.icicles;
  const rnd = snwRand(seed + 31);
  let px = x + 2 + rnd() * 4;
  while (px < x + w - 3) {
    // Grup: birkaç sarkıt yan yana, sonra boşluk
    const group = 2 + Math.floor(rnd() * 4);
    for (let k = 0; k < group && px < x + w - 3; k++) {
      const wd = (I.width[0] + rnd() * (I.width[1] - I.width[0])) * scale;
      const len = (I.len[0] + rnd() * rnd() * (I.len[1] - I.len[0])) * scale;
      const drip = rnd() < 0.35;
      g.drawImage(snwIcicle(drip), px - wd / 2, y, wd, len * (58 / 52));
      px += wd * (0.8 + rnd() * 0.9);
    }
    px += (I.gap[0] + rnd() * (I.gap[1] - I.gap[0])) * scale;
  }
  // Kenarı kaplayan ince buz şeridi
  g.fillStyle = 'rgba(220,244,255,.7)';
  g.fillRect(x, y - 1, w, 2);
}

// Sarkıtların göz kırpan ışıkları ve damlaları için kenar noktaları (canlı katman, binaya özel)
// Konumlar kenarın başına göre (göreli): binaya bir kez hesaplanıp saklanır, her karede üretilmez
export function icicleTips(w, seed) {
  const rnd = snwRand(seed + 97);
  const out = [];
  const n = Math.min(CONFIG.icicles.glints, Math.max(1, Math.floor(w / 26)));
  for (let i = 0; i < n; i++) out.push({ x: 4 + rnd() * (w - 8), y: 4 + rnd() * 6, ph: rnd() * SNW_TAU, sp: 0.6 + rnd() * 0.9 });
  return out;
}

// Yüksek bina çatısı için binaya özel önbellek: kar ya da sarkıt (anahtar: bina, boyut, kalınlık)
export class RoofCache {
  constructor(max) { this.map = new Map(); this.max = max; }

  get(key, w, h, paint) {
    let c = this.map.get(key);
    if (c) { this.map.delete(key); this.map.set(key, c); return c; } // En son kullanılan sona
    const k = SNW.cacheScale;
    c = snwCanvas(w * k, h * k);
    const g = c.getContext('2d');
    g.scale(k, k);
    paint(g);
    this.map.set(key, c);
    if (this.map.size > this.max) this.map.delete(this.map.keys().next().value);
    return c;
  }

  clear() { this.map.clear(); }
}

// Ağaç tepesi ve park halindeki araba için küçük kar sprite'ları
export function paintTreeSnow(g, R) {
  const grd = g.createRadialGradient(-R * 0.25, -R * 0.35, 1, 0, -R * 0.1, R);
  grd.addColorStop(0, 'rgba(255,255,255,.95)'); grd.addColorStop(0.7, 'rgba(240,246,255,.75)'); grd.addColorStop(1, 'rgba(230,240,255,0)');
  g.fillStyle = grd;
  g.beginPath(); g.ellipse(-R * 0.15, -R * 0.25, R * 0.7, R * 0.55, -0.3, 0, SNW_TAU); g.fill();
  g.beginPath(); g.ellipse(R * 0.3, -R * 0.05, R * 0.35, R * 0.3, 0.4, 0, SNW_TAU); g.fill();
}

export function paintCarSnow(g, L, W) {
  g.fillStyle = 'rgba(255,255,255,.88)';
  g.beginPath(); g.ellipse(-L * 0.05, 0, L * 0.26, W * 0.33, 0, 0, SNW_TAU); g.fill();
  g.fillStyle = 'rgba(255,255,255,.6)';
  g.beginPath(); g.ellipse(L * 0.28, 0, L * 0.1, W * 0.3, 0, 0, SNW_TAU); g.fill();
}

