// ANIT: şehir meydanındaki korunan anıt. Saygılı, sade ve görkemli; şaka ya da komik efekt yok.
// Anıt önbellekli tuvallere bir kez çizilir: uzakta sade (lo), yakında ayrıntılı (hi). Her karede yalnızca
// hazır görüntü kopyalanır, üstüne dalgalanan bayraklar eklenir. Gece spot ışıklarıyla aydınlanır.
// İçerik (fotoğraflar, levha metni, bayrak) sürüme göre ./memorial-data.js dosyasından gelir:
//   Play Store: kurgusal heykel ve kabartmalar, yazısız levha, kurgusal şehir bayrağı (js/memorial-data.js)
//   arkadaş   : names/anit-gercek.js (derlemede memorial-data.js yerine konur)
// Fotoğraflar kırpılmaz ve değiştirilmez: en-boy oranı korunarak ölçeklenir ve çerçevelenir.
// Not: js/app.file.js tüm modülleri tek kapsamda birleştirir; bu yüzden buradaki adlar MEM ön ekiyle benzersizdir.
import { CONFIG } from './config.js';
import { MEM_REAL, MEM_IMAGES, MEM_TITLE, MEM_YEAR, MEM_TEXT, MEM_MOTTO, MEM_SIGNATURE, paintMemFlag, paintMemStatue, paintMemEmblem } from './memorial-data.js';

export { MEM_REAL, MEM_IMAGES, MEM_TITLE, MEM_YEAR, MEM_TEXT, MEM_MOTTO, MEM_SIGNATURE };
// Eski ad: anıtın bayrağı (sürüme göre)
export const paintTrFlag = paintMemFlag;

const MEMC = CONFIG.memorial;
const MEM_TILE = CONFIG.world.tile;
const MEM_TAU = Math.PI * 2;

const MEM_SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";

// Korunan bölümün ölçüsü (dünya birimi). Düzen 680 x 760'lık tasarım alanında tanımlıdır
export const MEM_W = (MEMC.rect[2] - MEMC.rect[0]) * MEM_TILE;
export const MEM_H = (MEMC.rect[3] - MEMC.rect[1]) * MEM_TILE;
const MEM_SX = MEM_W / 680;
const MEM_SY = MEM_H / 760;
const memBox = (x, y, w, h, border) => ({ x: x * MEM_SX, y: y * MEM_SY, w: w * MEM_SX, h: h * MEM_SY, border });

// Yerleşim (anıt içi yerel koordinat). Ortada en büyük çerçeve; solunda 2, sağında 3, altında 4; üstünde levha
export const MEM_LAYOUT = {
  rail: 14 * MEM_SY,
  stele: memBox(80, 22, 520, 718),
  plaque: memBox(92, 34, 496, 162),
  flag: { x: 340 * MEM_SX - 38 * MEM_SX, y: 206 * MEM_SY, w: 76 * MEM_SX, h: 50 * MEM_SY },
  slots: [
    memBox(222, 258, 236, 236, 12), // 1: orta, en büyük
    memBox(92, 262, 120, 228, 8), // 2: sol
    memBox(468, 262, 120, 228, 8), // 3: sağ
    memBox(262, 502, 156, 168, 8), // 4: alt
  ],
  motto: { x: 340 * MEM_SX, y: 694 * MEM_SY, size: 22 * MEM_SY },
  signature: { x: 340 * MEM_SX, y: 722 * MEM_SY, size: 16 * MEM_SY },
  // Bayrak direkleri: korunan bölümün içinde, anıtın iki yanında. dir: bayrağın uzandığı yön
  poles: [
    { x: 30 * MEM_SX, y: 150 * MEM_SY, dir: 1 }, { x: 30 * MEM_SX, y: 420 * MEM_SY, dir: 1 }, { x: 30 * MEM_SX, y: 690 * MEM_SY, dir: 1 },
    { x: 650 * MEM_SX, y: 150 * MEM_SY, dir: -1 }, { x: 650 * MEM_SX, y: 420 * MEM_SY, dir: -1 }, { x: 650 * MEM_SX, y: 690 * MEM_SY, dir: -1 },
  ],
  poleH: 104 * MEM_SY,
  poleFlag: { w: 46 * MEM_SX, h: 31 * MEM_SX },
};

// Fotoğrafı kırpmadan çerçeveye sığdırır. aspect = genişlik / yükseklik
export function memFitFrame(slot, aspect) {
  const b = slot.border;
  const iw = slot.w - b * 2;
  const ih = slot.h - b * 2;
  let w = iw;
  let h = iw / aspect;
  if (h > ih) { h = ih; w = ih * aspect; }
  const x = slot.x + (slot.w - w) / 2;
  const y = slot.y + (slot.h - h) / 2;
  return { x, y, w, h, fx: x - b, fy: y - b, fw: w + b * 2, fh: h + b * 2 };
}

function memCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function memWrap(g, text, maxW) {
  const out = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(' ')) {
      const t = line ? `${line} ${word}` : word;
      if (g.measureText(t).width > maxW && line) { out.push(line); line = word; } else line = t;
    }
    if (line) out.push(line);
  }
  return out;
}

// Altın çerçeve. big: ortadaki büyük portre için daha zengin
function memGoldFrame(g, f, b, big) {
  g.save();
  g.fillStyle = 'rgba(0,0,0,.45)';
  g.fillRect(f.fx + 4, f.fy + 6, f.fw, f.fh);
  const gr = g.createLinearGradient(f.fx, f.fy, f.fx + f.fw, f.fy + f.fh);
  gr.addColorStop(0, big ? '#f6dc8a' : '#d9b65c');
  gr.addColorStop(0.45, big ? '#c7952f' : '#a9822e');
  gr.addColorStop(1, big ? '#7d5716' : '#5f4318');
  g.fillStyle = gr;
  g.fillRect(f.fx, f.fy, f.fw, f.fh);
  g.strokeStyle = 'rgba(40,26,6,.9)';
  g.lineWidth = 1.2;
  g.strokeRect(f.fx + 0.6, f.fy + 0.6, f.fw - 1.2, f.fh - 1.2);
  g.strokeStyle = 'rgba(255,240,190,.55)';
  g.strokeRect(f.fx + b * 0.45, f.fy + b * 0.45, f.fw - b * 0.9, f.fh - b * 0.9);
  if (big) {
    g.fillStyle = '#fbe9b0';
    for (const [x, y] of [[f.fx, f.fy], [f.fx + f.fw, f.fy], [f.fx, f.fy + f.fh], [f.fx + f.fw, f.fy + f.fh]]) {
      g.beginPath(); g.arc(x, y, b * 0.55, 0, MEM_TAU); g.fill();
    }
  }
  g.fillStyle = '#151311';
  g.fillRect(f.x - 1.5, f.y - 1.5, f.w + 3, f.h + 3);
  g.restore();
}

// Bayraklı küçük madalyon
function memMedallion(g, x, y, r) {
  g.save();
  g.fillStyle = '#b8892e'; g.beginPath(); g.arc(x, y, r + 2.5, 0, MEM_TAU); g.fill();
  g.beginPath(); g.arc(x, y, r, 0, MEM_TAU); g.clip();
  g.translate(x - r * 1.5, y - r);
  paintMemFlag(g, r * 3, r * 2);
  g.restore();
}

// Anıtın bir parçasını çizer (dilim dilim üretim: karede takılma olmasın). detail: yakın görünüm ayrıntısı
function memPaint(g, part, imgs, detail, frames) {
  const L = MEM_LAYOUT;
  const W = MEM_W; const H = MEM_H;
  if (part === 'base') {
    // Cilalı mermer zemin: korunan bölüm dış meydandan farklı görünür
    const gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, '#f1ece1'); gr.addColorStop(1, '#ddd5c4');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    if (detail) {
      g.strokeStyle = 'rgba(120,108,88,.18)'; g.lineWidth = 1;
      for (let x = 40; x < W; x += 40) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
      for (let y = 40; y < H; y += 40) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    }
    // Alçak taş korkuluk, zincirli direkler: sınır net görünür
    const R = L.rail;
    g.fillStyle = '#a99d86'; g.fillRect(0, 0, W, R); g.fillRect(0, H - R, W, R); g.fillRect(0, 0, R, H); g.fillRect(W - R, 0, R, H);
    g.fillStyle = '#c9bea8'; g.fillRect(2, 2, W - 4, R * 0.4); g.fillRect(2, H - R + 2, W - 4, R * 0.4); g.fillRect(2, 2, R * 0.4, H - 4); g.fillRect(W - R + 2, 2, R * 0.4, H - 4);
    g.strokeStyle = '#6f6555'; g.lineWidth = 1.5; g.strokeRect(0.75, 0.75, W - 1.5, H - 1.5); g.strokeRect(R, R, W - R * 2, H - R * 2);
    const posts = [];
    const n = Math.round(W / 60);
    const m = Math.round(H / 60);
    for (let i = 0; i <= n; i++) { posts.push([R / 2 + (i * (W - R)) / n, R / 2]); posts.push([R / 2 + (i * (W - R)) / n, H - R / 2]); }
    for (let i = 1; i < m; i++) { posts.push([R / 2, R / 2 + (i * (H - R)) / m]); posts.push([W - R / 2, R / 2 + (i * (H - R)) / m]); }
    if (detail) {
      g.strokeStyle = 'rgba(48,44,40,.85)'; g.lineWidth = 1.6;
      const chain = (x0, y0, x1, y1) => { g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo((x0 + x1) / 2 + (y1 !== y0 ? 4 : 0), (y0 + y1) / 2 + (y1 !== y0 ? 0 : 4), x1, y1); g.stroke(); };
      for (let i = 0; i < n; i++) {
        const xa = R / 2 + (i * (W - R)) / n; const xb = R / 2 + ((i + 1) * (W - R)) / n;
        chain(xa, R / 2, xb, R / 2); chain(xa, H - R / 2, xb, H - R / 2);
      }
      for (let i = 0; i < m; i++) {
        const ya = R / 2 + (i * (H - R)) / m; const yb = R / 2 + ((i + 1) * (H - R)) / m;
        chain(R / 2, ya, R / 2, yb); chain(W - R / 2, ya, W - R / 2, yb);
      }
    }
    for (const [x, y] of posts) {
      g.fillStyle = '#5f5647'; g.fillRect(x - 7, y - 7, 14, 14);
      g.fillStyle = '#8e826d'; g.fillRect(x - 5.5, y - 5.5, 11, 11);
      g.fillStyle = '#d7b45a'; g.beginPath(); g.arc(x, y, 3, 0, MEM_TAU); g.fill();
    }
    // Bayrak direklerinin taş kaideleri
    for (const p of L.poles) {
      g.fillStyle = 'rgba(0,0,0,.25)'; g.beginPath(); g.ellipse(p.x + 3, p.y + 4, 13, 7, 0, 0, MEM_TAU); g.fill();
      g.fillStyle = '#9b907b'; g.fillRect(p.x - 11, p.y - 6, 22, 10);
      g.fillStyle = '#c5baa4'; g.fillRect(p.x - 11, p.y - 6, 22, 3);
    }
    // Anıt taşı: koyu granit, altın kenar
    const s = L.stele;
    g.fillStyle = 'rgba(30,24,16,.35)'; g.fillRect(s.x + 8, s.y + 12, s.w, s.h);
    const sg = g.createLinearGradient(0, s.y, 0, s.y + s.h);
    sg.addColorStop(0, '#34333a'); sg.addColorStop(1, '#1f1e23');
    g.fillStyle = sg; g.fillRect(s.x, s.y, s.w, s.h);
    g.strokeStyle = '#c9a24a'; g.lineWidth = 3; g.strokeRect(s.x + 1.5, s.y + 1.5, s.w - 3, s.h - 3);
    g.strokeStyle = 'rgba(201,162,74,.45)'; g.lineWidth = 1; g.strokeRect(s.x + 7, s.y + 7, s.w - 14, s.h - 14);
    return;
  }
  if (part === 'plaque') {
    const p = L.plaque;
    const pg = g.createLinearGradient(p.x, p.y, p.x + p.w, p.y + p.h);
    pg.addColorStop(0, '#f7f3ea'); pg.addColorStop(0.6, '#ebe5d8'); pg.addColorStop(1, '#ddd5c5');
    g.fillStyle = pg; g.fillRect(p.x, p.y, p.w, p.h);
    if (detail) {
      // Mermer damarları
      g.strokeStyle = 'rgba(150,140,125,.22)'; g.lineWidth = 1.2;
      for (let i = 0; i < 5; i++) {
        const y = p.y + 20 + i * 30;
        g.beginPath(); g.moveTo(p.x, y); g.bezierCurveTo(p.x + p.w * 0.3, y - 14, p.x + p.w * 0.6, y + 18, p.x + p.w, y - 6); g.stroke();
      }
    }
    g.strokeStyle = '#a58a4a'; g.lineWidth = 2; g.strokeRect(p.x + 5, p.y + 5, p.w - 10, p.h - 10);
    if (!MEM_TITLE) { if (paintMemEmblem) paintMemEmblem(g, p); return; }
    g.textAlign = 'center'; g.textBaseline = 'middle';
    const cx = p.x + p.w / 2;
    g.fillStyle = 'rgba(255,255,255,.7)';
    g.font = `700 ${34 * MEM_SY}px ${MEM_SERIF}`;
    g.fillText(MEM_TITLE, cx + 1, p.y + 33 * MEM_SY + 1);
    g.fillStyle = '#2b2620';
    g.fillText(MEM_TITLE, cx, p.y + 33 * MEM_SY);
    g.font = `400 ${18 * MEM_SY}px ${MEM_SERIF}`;
    g.fillStyle = '#7a5b1e';
    g.fillText(MEM_YEAR, cx, p.y + 62 * MEM_SY);
    g.fillStyle = '#b8892e'; g.fillRect(cx - 60, p.y + 75 * MEM_SY, 120, 1.6);
    // Metnin başı: büyük ve net. Tamamı yaklaşınca okuma kartında kayarak gösterilir
    g.font = `400 ${15 * MEM_SY}px ${MEM_SERIF}`;
    g.fillStyle = '#2f2a24';
    const lines = memWrap(g, MEM_TEXT, p.w - 44).slice(0, 4);
    lines.forEach((t, i) => g.fillText(i === lines.length - 1 ? `${t} …` : t, cx, p.y + (92 + i * 19) * MEM_SY));
    // Son satır hafifçe söner
    const fade = g.createLinearGradient(0, p.y + p.h - 32, 0, p.y + p.h - 8);
    fade.addColorStop(0, 'rgba(225,218,204,0)'); fade.addColorStop(1, 'rgba(225,218,204,.85)');
    g.fillStyle = fade; g.fillRect(p.x + 8, p.y + p.h - 32, p.w - 16, 24);
    return;
  }
  if (part.startsWith('frame')) {
    const i = Number(part.slice(5));
    const slot = L.slots[i];
    const f = frames[i];
    memGoldFrame(g, f, slot.border, i === 0);
    const it = imgs[i];
    if (it && it.ok) {
      g.imageSmoothingEnabled = true;
      if ('imageSmoothingQuality' in g) g.imageSmoothingQuality = 'high';
      g.drawImage(it.img, f.x, f.y, f.w, f.h);
    } else if (paintMemStatue) {
      // Kurgusal sürüm: fotoğraf yerine kodla çizilen heykel ve kabartmalar
      paintMemStatue(g, f, i, detail);
    } else {
      // Fotoğraf yoksa yer tutucu: boş, sade koyu çerçeve
      g.fillStyle = '#2a2724'; g.fillRect(f.x, f.y, f.w, f.h);
      g.strokeStyle = 'rgba(201,162,74,.6)'; g.lineWidth = 1.5; g.strokeRect(f.x + 6, f.y + 6, f.w - 12, f.h - 12);
    }
    // Camın üstünde çok hafif parıltı
    const gl = g.createLinearGradient(f.x, f.y, f.x + f.w, f.y + f.h);
    gl.addColorStop(0, 'rgba(255,255,255,.08)'); gl.addColorStop(0.4, 'rgba(255,255,255,0)');
    g.fillStyle = gl; g.fillRect(f.x, f.y, f.w, f.h);
    return;
  }
  if (part === 'words') {
    const s4 = frames[3];
    memMedallion(g, (L.stele.x + s4.fx) / 2 + 10, s4.fy + s4.fh / 2, 15 * MEM_SY);
    memMedallion(g, (L.stele.x + L.stele.w + s4.fx + s4.fw) / 2 - 10, s4.fy + s4.fh / 2, 15 * MEM_SY);
    g.textAlign = 'center'; g.textBaseline = 'middle';
    if (!MEM_MOTTO && !MEM_SIGNATURE) return;
    g.font = `700 ${L.motto.size}px ${MEM_SERIF}`;
    g.fillStyle = '#e8c76c';
    g.fillText(MEM_MOTTO, L.motto.x, L.motto.y);
    g.font = `400 ${L.signature.size}px ${MEM_SERIF}`;
    g.fillStyle = '#ddd3bb';
    g.fillText(MEM_SIGNATURE, L.signature.x, L.signature.y);
    return;
  }
  if (part === 'poles') {
    // Direkler sabit; bayraklar her karede dalgalanır (uzak görünümde düz çizilir)
    for (const p of L.poles) {
      g.fillStyle = '#8c8f96'; g.fillRect(p.x - 1.6, p.y - L.poleH, 3.2, L.poleH);
      g.fillStyle = '#e2c46a'; g.beginPath(); g.arc(p.x, p.y - L.poleH - 2, 3.4, 0, MEM_TAU); g.fill();
    }
    const f = L.flag;
    g.fillStyle = '#8c8f96'; g.fillRect(f.x - 3, f.y - 4, 2.6, f.h + 10);
    g.fillStyle = '#e2c46a'; g.beginPath(); g.arc(f.x - 1.7, f.y - 5, 2.8, 0, MEM_TAU); g.fill();
  }
}

const MEM_PARTS = ['base', 'plaque', 'frame0', 'frame1', 'frame2', 'frame3', 'words', 'poles'];

export class MemorialArt {
  constructor() {
    this.imgs = [null, null, null, null];
    this.loaded = 0; // Yüklenen ya da hata veren fotoğraf sayısı
    this.fonts = false;
    this.started = false;
    this.hi = null; this.lo = null;
    this.hiJob = null;
    this.frames = null;
    this.flag = null; this.flagM = null;
    this.missing = [];
  }

  // Fotoğrafları ve yazı tipini yükler (yalnız tarayıcıda)
  start() {
    if (this.started || typeof Image === 'undefined') return;
    this.started = true;
    MEM_IMAGES.forEach((src, i) => {
      const img = new Image();
      const done = (ok) => {
        if (this.imgs[i]) return;
        this.imgs[i] = { img, ok };
        if (!ok) this.missing.push(src);
        this.loaded++;
      };
      img.onload = () => done(img.naturalWidth > 0);
      img.onerror = () => done(false);
      img.src = src;
    });
    const fontsDone = () => { this.fonts = true; };
    try {
      const f = document.fonts;
      Promise.all([f.load(`700 34px 'Playfair Display'`, 'Anıt ğüşıöçİâîû'), f.load(`400 16px 'Playfair Display'`, 'ğüşıöçİâîû')]).then(fontsDone, fontsDone);
      setTimeout(fontsDone, 4000);
    } catch { fontsDone(); }
  }

  get ready() { return this.loaded >= MEM_IMAGES.length && this.fonts; }

  computeFrames() {
    this.frames = MEM_LAYOUT.slots.map((slot, i) => {
      const it = this.imgs[i];
      const aspect = it && it.ok ? it.img.naturalWidth / it.img.naturalHeight : (slot.w - slot.border * 2) / (slot.h - slot.border * 2);
      return memFitFrame(slot, aspect);
    });
  }

  makeFlags() {
    const w = 120; const h = 80;
    this.flag = memCanvas(w, h); paintMemFlag(this.flag.getContext('2d'), w, h);
    this.flagM = memCanvas(w, h); paintMemFlag(this.flagM.getContext('2d'), w, h, true);
  }

  build(k, detail) {
    const c = memCanvas(Math.ceil(MEM_W * k), Math.ceil(MEM_H * k));
    const g = c.getContext('2d');
    g.setTransform(k, 0, 0, k, 0, 0);
    return { c, g, i: 0, detail };
  }

  // Karede en çok bir dilim iş. d: kameranın anıta uzaklığı. Uzakta önbellek bırakılır
  update(d) {
    if (!this.started) this.start();
    if (!this.ready) return;
    if (!this.frames) { this.computeFrames(); this.makeFlags(); }
    if (!this.lo && d < MEMC.art.loFree) {
      const j = this.build(MEMC.art.loScale, false);
      for (const p of MEM_PARTS) memPaint(j.g, p, this.imgs, false, this.frames);
      this.staticFlags(j.g);
      this.lo = j.c;
      return;
    }
    if (this.lo && d > MEMC.art.loFree * 1.2) this.lo = null;
    if (!this.hi && !this.hiJob && d < MEMC.art.hiNear) this.hiJob = this.build(MEMC.art.hiScale, true);
    if (this.hiJob) {
      const j = this.hiJob;
      memPaint(j.g, MEM_PARTS[j.i++], this.imgs, true, this.frames);
      if (j.i >= MEM_PARTS.length) { this.hi = j.c; this.hiJob = null; }
    }
    if (this.hi && d > MEMC.art.hiFree) { this.hi.width = 1; this.hi = null; } // Belleği bırak
  }

  // Uzak görünüm: bayraklar düz
  staticFlags(g) {
    const L = MEM_LAYOUT;
    for (const p of L.poles) {
      const w = L.poleFlag.w; const h = L.poleFlag.h;
      g.drawImage(p.dir > 0 ? this.flag : this.flagM, p.dir > 0 ? p.x + 1.6 : p.x - 1.6 - w, p.y - L.poleH, w, h);
    }
    g.drawImage(this.flag, L.flag.x, L.flag.y, L.flag.w, L.flag.h);
  }

  // Dalgalanan bayrak: dilimler halinde, gönderden uzaklaştıkça artan dalga
  waveFlag(ctx, x, y, w, h, dir, t, phase) {
    const F = MEMC.flag;
    const n = F.slices;
    const img = dir > 0 ? this.flag : this.flagM;
    const iw = img.width; const ih = img.height;
    const sw = w / n;
    for (let i = 0; i < n; i++) {
      const u = i / n;
      const wv = t * F.wave + u * 5.2 + phase;
      const dy = Math.sin(wv) * F.amp * w * (u + 0.12);
      const src = dir > 0 ? u * iw : (1 - u - 1 / n) * iw;
      const dx = dir > 0 ? x + u * w : x - (u + 1 / n) * w;
      ctx.drawImage(img, src, 0, iw / n, ih, dx, y + dy, sw + 0.5, h);
      const sh = Math.cos(wv);
      if (sh < -0.2) {
        ctx.fillStyle = `rgba(60,0,0,${(-sh - 0.2) * 0.32})`;
        ctx.fillRect(dx, y + dy, sw + 0.5, h);
      }
    }
  }

  drawFlags(ctx, bx, by, t) {
    const L = MEM_LAYOUT;
    L.poles.forEach((p, i) => this.waveFlag(ctx, bx + p.x + p.dir * 1.6, by + p.y - L.poleH, L.poleFlag.w, L.poleFlag.h, p.dir, t, i * 0.9));
    this.waveFlag(ctx, bx + L.flag.x, by + L.flag.y, L.flag.w, L.flag.h, 1, t, 2.1);
  }

  // Anıtı çizer. ctx dünya dönüşümünde, b korunan bölüm kutusu, px: ekranda dünya birimi başına piksel
  draw(ctx, b, now, px) {
    const useHi = this.hi && px >= MEMC.art.hiMinPx;
    const img = useHi ? this.hi : this.lo;
    if (!img) {
      // Hazırlanana kadar sade taş görünüm
      ctx.fillStyle = '#e4ddcf'; ctx.fillRect(b.x, b.y, b.w, b.h);
      ctx.fillStyle = '#2a292f'; ctx.fillRect(b.x + MEM_LAYOUT.stele.x, b.y + MEM_LAYOUT.stele.y, MEM_LAYOUT.stele.w, MEM_LAYOUT.stele.h);
      return;
    }
    ctx.drawImage(img, b.x, b.y, b.w, b.h);
    if (useHi) this.drawFlags(ctx, b.x, b.y, now / 1000);
  }

  // Gece: anıt spot ışıklarıyla aydınlık kalır. Karanlık katmanın üstüne çizilir
  drawNight(ctx, b, now, px, night, lamp) {
    const img = this.hi && px >= MEMC.art.hiMinPx ? this.hi : this.lo;
    if (!img) return;
    ctx.globalAlpha = night * 0.62;
    ctx.drawImage(img, b.x, b.y, b.w, b.h);
    if (img === this.hi) this.drawFlags(ctx, b.x, b.y, now / 1000);
    ctx.globalCompositeOperation = 'lighter';
    const L = MEM_LAYOUT;
    const spot = (x, y, r, a) => { ctx.globalAlpha = night * a; ctx.drawImage(lamp, b.x + x - r, b.y + y - r, r * 2, r * 2); };
    const c = this.frames[0];
    spot(c.fx + c.fw / 2, c.fy + c.fh / 2, 190, 0.32);
    spot(L.plaque.x + L.plaque.w / 2, L.plaque.y + L.plaque.h / 2, 210, 0.22);
    for (const p of L.poles) spot(p.x, p.y - L.poleH * 0.6, 70, 0.3);
    spot(L.stele.x, L.stele.y + L.stele.h, 120, 0.35);
    spot(L.stele.x + L.stele.w, L.stele.y + L.stele.h, 120, 0.35);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  // Testler ve ekran düzeni için: çerçevelerin dünya koordinatları
  layoutAt(b) {
    if (!this.frames) this.computeFrames();
    const L = MEM_LAYOUT;
    const at = (f) => ({ x: b.x + f.fx, y: b.y + f.fy, w: f.fw, h: f.fh });
    return {
      frames: this.frames.map(at),
      plaque: { x: b.x + L.plaque.x, y: b.y + L.plaque.y, w: L.plaque.w, h: L.plaque.h },
      flag: { x: b.x + L.flag.x, y: b.y + L.flag.y, w: L.flag.w, h: L.flag.h },
      motto: { x: b.x + L.motto.x, y: b.y + L.motto.y, text: MEM_MOTTO },
      signature: { x: b.x + L.signature.x, y: b.y + L.signature.y, text: MEM_SIGNATURE },
      title: MEM_TITLE, year: MEM_YEAR,
      images: this.imgs.slice(0, MEM_IMAGES.length).map((it) => (it ? (it.ok ? 'ok' : 'missing') : 'loading')),
      real: MEM_REAL,
      hi: !!this.hi, lo: !!this.lo,
    };
  }
}

// Zemin önbelleği: güneydeki basamaklar (chunk çiziminde bir kez)
export function bakeMemorialPad(g, x, y, w, h) {
  const steps = 4;
  for (let i = 0; i < steps; i++) {
    const sy = y + (i * h) / steps;
    g.fillStyle = i % 2 ? '#cfc6b4' : '#ddd5c5';
    g.fillRect(x - i * 6, sy, w + i * 12, h / steps + 0.5);
    g.fillStyle = 'rgba(80,70,55,.35)';
    g.fillRect(x - i * 6, sy + h / steps - 2, w + i * 12, 2);
  }
}

// Okuma kartı (yalnız levha metni olan sürümde): metnin tamamı yavaşça kayar. Oyunu engellemez, dokununca kapanır.
// el: #memorial-card. Metin DOM'a bir kez yazılır; açıkken yalnızca kaydırma konumu değişir
export class MemorialCard {
  constructor(el, onDismiss) {
    this.el = el;
    this.open = false;
    this.t = 0;
    this.pos = 0;
    if (!el) return;
    el.textContent = '';
    if (!MEM_TEXT) return; // Kurgusal sürüm: okunacak metin yok, kart açılmaz
    const head = document.createElement('header');
    const h = document.createElement('h3'); h.textContent = MEM_TITLE;
    const y = document.createElement('span'); y.textContent = MEM_YEAR;
    head.append(h, y);
    this.body = document.createElement('div');
    this.body.className = 'mc-body';
    this.inner = document.createElement('div');
    this.inner.className = 'mc-text';
    for (const para of MEM_TEXT.split('\n')) {
      const p = document.createElement('p'); p.textContent = para; this.inner.appendChild(p);
    }
    const foot = document.createElement('p');
    foot.className = 'mc-sign';
    foot.textContent = MEM_SIGNATURE;
    this.inner.appendChild(foot);
    this.body.appendChild(this.inner);
    el.append(head, this.body);
    const close = (e) => { e.stopPropagation(); e.preventDefault(); if (onDismiss) onDismiss(); };
    el.addEventListener('pointerdown', close);
    el.addEventListener('touchstart', (e) => e.stopPropagation(), { passive: true });
  }

  // Karttaki levha metni (test: tam metin karşılaştırması)
  text() {
    return this.inner ? [...this.inner.querySelectorAll('p:not(.mc-sign)')].map((p) => p.textContent).join('\n') : '';
  }

  show(on) {
    if (!this.el || !this.inner || on === this.open) return;
    this.open = on;
    this.el.hidden = !on;
    if (on) { this.t = 0; this.pos = 0; this.body.scrollTop = 0; }
  }

  // Otomatik kaydırma: önce kısa bekleme, sonra sabit hız; sona gelince durur
  tick(dt) {
    if (!this.open) return;
    this.t += dt;
    if (this.t < MEMC.scroll.delay) return;
    const max = this.body.scrollHeight - this.body.clientHeight;
    if (this.pos >= max) return;
    this.pos = Math.min(max, this.pos + MEMC.scroll.speed * dt);
    const v = Math.round(this.pos);
    if (v !== this.body.scrollTop) this.body.scrollTop = v;
  }
}
