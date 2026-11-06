// Özel yerler: kolej, tarihi yapılar, okullar. Kodla çizilir, gerçek logo ya da marka kullanılmaz.
// Zemin çizimleri chunk önbelleğine bir kez işlenir. Yüksek yapıların (kolej, kule) duvar, çatı ve
// gece pencere dokuları ilk görüldüğünde bir kez üretilir, sonra yalnızca kopyalanır.
import { BUILD } from './config.js';
import { rr, shade } from './art.js';

const S = BUILD;
const TAU = Math.PI * 2;

function mk(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function text(g, s, x, y, size, color, weight = 900, font = 'Nunito, sans-serif') {
  g.font = `${weight} ${size}px ${font}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = color;
  g.fillText(s, x, y);
}

// Selçuklu yıldızı: iç içe iki kare, sekiz köşe
function star8(g, x, y, R, fill, stroke) {
  g.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU - Math.PI / 2;
    const q = i % 2 ? R * 0.62 : R;
    g[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * q, y + Math.sin(a) * q);
  }
  g.closePath();
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.stroke(); }
}

// Kubbe: kurşun gri ya da firuze, yumuşak ışık
function dome(g, x, y, R, base = '#8d98a3') {
  const gr = g.createRadialGradient(x - R * 0.35, y - R * 0.4, R * 0.1, x, y, R);
  gr.addColorStop(0, shade(base, 0.45)); gr.addColorStop(0.7, base); gr.addColorStop(1, shade(base, -0.35));
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, R, 0, TAU); g.fill();
  g.strokeStyle = shade(base, -0.45); g.lineWidth = 1; g.stroke();
  g.fillStyle = '#d9b44a'; g.beginPath(); g.arc(x, y, Math.max(1.4, R * 0.12), 0, TAU); g.fill();
}

// Taç kapı: taş çerçeve, mukarnas sıraları, ortada geçit
function portal(g, cx, y, w, h, stone = '#cbb894') {
  g.fillStyle = shade(stone, -0.25); g.fillRect(cx - w / 2 - 3, y - 3, w + 6, h + 6);
  g.fillStyle = stone; g.fillRect(cx - w / 2, y, w, h);
  g.fillStyle = shade(stone, -0.18);
  for (let row = 0; row < 3; row++) {
    const n = 5 - row;
    for (let i = 0; i < n; i++) {
      const px = cx - w * 0.32 + (i + 0.5) * (w * 0.64 / n);
      g.beginPath(); g.arc(px, y + 4 + row * 4.5, 2.4, Math.PI, 0); g.fill();
    }
  }
  g.fillStyle = '#4a3a2a'; rr(g, cx - w * 0.18, y + h * 0.45, w * 0.36, h * 0.55, w * 0.18); g.fill();
  star8(g, cx, y + h * 0.3, Math.min(5, w * 0.12), '#e9d9b0', null);
}

// --- Zemin çizimleri (düz yapılar) ---

// Okul servisi: sarı, üstten görünüm
function servis(g, r) {
  const v = r.h >= r.w;
  const L = v ? r.h : r.w; const W = v ? r.w : r.h;
  g.save();
  g.translate(r.x + r.w / 2, r.y + r.h / 2);
  if (!v) g.rotate(-Math.PI / 2);
  g.fillStyle = 'rgba(0,0,0,.25)'; rr(g, -W / 2 + 3, -L / 2 + 4, W, L, 7); g.fill();
  g.fillStyle = '#f5b800'; rr(g, -W / 2, -L / 2, W, L, 7); g.fill();
  g.fillStyle = '#ffd23f'; rr(g, -W / 2 + 4, -L / 2 + 16, W - 8, L - 26, 4); g.fill();
  g.fillStyle = '#20242b'; rr(g, -W / 2 + 3, -L / 2 + 3, W - 6, 10, 3); g.fill();
  g.fillStyle = '#2b3038';
  for (let k = -L / 2 + 22; k < L / 2 - 12; k += 14) { g.fillRect(-W / 2, k, 3, 9); g.fillRect(W / 2 - 3, k, 3, 9); }
  g.fillStyle = '#f4f6f8'; g.fillRect(-W / 2 + 6, -L / 2 + 30, W - 12, 3);
  g.save(); g.rotate(Math.PI / 2);
  text(g, 'OKUL TAŞITI', 0, 0, Math.min(9, W * 0.32), '#1b1d22');
  g.restore();
  g.fillStyle = '#e8352e'; g.fillRect(-W / 2 + 4, L / 2 - 4, 6, 3); g.fillRect(W / 2 - 10, L / 2 - 4, 6, 3);
  g.restore();
}

// Müze: taş külliye, kurşun kubbeler ve yeşil konik kubbe (stilize)
function muze(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = '#b6a585'; rr(g, x, y, w, h, 6); g.fill();
  g.fillStyle = '#dcccaa'; rr(g, x + 5, y + 5, w - 10, h - 14, 5); g.fill();
  // Avlu revakları
  g.fillStyle = '#cdbb96';
  for (let px = x + 14; px < x + w * 0.6; px += 22) { g.beginPath(); g.arc(px, y + h - 16, 8, Math.PI, 0); g.fill(); }
  // Küçük kubbeler
  for (let i = 0; i < 6; i++) {
    const px = x + w * 0.1 + (i % 3) * w * 0.17;
    const py = y + h * (i < 3 ? 0.28 : 0.6);
    dome(g, px, py, Math.min(w, h) * 0.1);
  }
  // Yeşil kubbe: dilimli koni, tepede alem
  const cx = x + w * 0.76; const cy = y + h * 0.4; const R = Math.min(w, h) * 0.3;
  g.fillStyle = 'rgba(20,30,40,.3)'; g.beginPath(); g.ellipse(cx + R * 0.5, cy + R * 0.7, R * 1.1, R * 0.8, 0.4, 0, TAU); g.fill();
  g.fillStyle = '#e8dcc0'; g.beginPath(); g.arc(cx, cy, R * 1.12, 0, TAU); g.fill();
  const n = 16;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * TAU; const a1 = ((i + 1) / n) * TAU;
    g.fillStyle = i % 2 ? '#13a183' : '#0b7f69';
    g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R, a0, a1); g.closePath(); g.fill();
  }
  const hi = g.createRadialGradient(cx - R * 0.4, cy - R * 0.45, 1, cx, cy, R);
  hi.addColorStop(0, 'rgba(255,255,255,.55)'); hi.addColorStop(0.5, 'rgba(255,255,255,.08)'); hi.addColorStop(1, 'rgba(0,0,0,.25)');
  g.fillStyle = hi; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
  g.fillStyle = '#e2bd4c'; g.beginPath(); g.arc(cx, cy, R * 0.12, 0, TAU); g.fill();
  // Minare
  const mx = x + w - 12; const my = y + 12;
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(mx, my, 34, 4);
  g.fillStyle = '#e6dcc8'; g.beginPath(); g.arc(mx, my, 6, 0, TAU); g.fill();
  g.fillStyle = '#1aa58a'; g.beginPath(); g.arc(mx, my, 3.6, 0, TAU); g.fill();
  portal(g, x + w * 0.32, y + h - 26, 40, 26);
}

// Selçuklu camisi (tepe üstünde): taş gövde, düz ahşap çatı çizgileri, piramit külahlı türbe
function tepeCami(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = '#a8977a'; rr(g, x, y, w, h, 5); g.fill();
  g.fillStyle = '#c9b99a'; rr(g, x + 4, y + 4, w - 8, h - 12, 4); g.fill();
  g.strokeStyle = 'rgba(90,70,50,.35)'; g.lineWidth = 1;
  for (let px = x + 10; px < x + w - 8; px += 9) { g.beginPath(); g.moveTo(px, y + 8); g.lineTo(px, y + h * 0.6); g.stroke(); }
  dome(g, x + w * 0.62, y + h * 0.32, Math.min(w, h) * 0.16, '#8a96a2');
  // Türbe: sekizgen, külah
  const tx = x + w * 0.2; const ty = y + h * 0.3; const R = Math.min(w, h) * 0.16;
  g.fillStyle = '#d8cbb0'; g.beginPath();
  for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU + 0.39; g[i ? 'lineTo' : 'moveTo'](tx + Math.cos(a) * R * 1.15, ty + Math.sin(a) * R * 1.15); }
  g.closePath(); g.fill();
  for (let i = 0; i < 8; i++) {
    const a0 = (i / 8) * TAU + 0.39; const a1 = ((i + 1) / 8) * TAU + 0.39;
    g.fillStyle = i % 2 ? '#5e8f86' : '#4a7870';
    g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(a0) * R, ty + Math.sin(a0) * R); g.lineTo(tx + Math.cos(a1) * R, ty + Math.sin(a1) * R); g.closePath(); g.fill();
  }
  const mx = x + w - 10; const my = y + h * 0.7;
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(mx, my, 30, 4);
  g.fillStyle = '#b8a27c'; g.beginPath(); g.arc(mx, my, 5.5, 0, TAU); g.fill();
  portal(g, x + w * 0.45, y + h - 24, 34, 22, '#c4ae86');
}

// Kongre merkezi: cam kenar, Selçuklu yıldızlı çatı deseni
function kongre(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = '#244a60'; rr(g, x, y, w, h, 10); g.fill();
  g.fillStyle = '#7fc4dc'; rr(g, x + 4, y + 4, w - 8, h - 8, 8); g.fill();
  g.fillStyle = '#1c7a8c'; rr(g, x + 12, y + 12, w - 24, h - 30, 6); g.fill();
  g.save(); rr(g, x + 12, y + 12, w - 24, h - 30, 6); g.clip();
  g.lineWidth = 1.2;
  for (let py = y + 24; py < y + h; py += 26) {
    for (let px = x + 24 + ((py / 26) % 2) * 13; px < x + w; px += 26) star8(g, px, py, 10, 'rgba(255,255,255,.18)', 'rgba(240,210,120,.75)');
  }
  g.restore();
  g.fillStyle = '#e9edf0'; g.fillRect(x + w * 0.3, y + h - 18, w * 0.4, 14);
  g.fillStyle = '#1d2a33'; for (let px = x + w * 0.32; px < x + w * 0.68; px += 12) g.fillRect(px, y + h - 15, 8, 9);
}

// Alışveriş merkezi podyumu: tavan pencereleri, çatı makineleri
function avm(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = '#6f7780'; rr(g, x, y, w, h, 6); g.fill();
  g.fillStyle = '#aab3bb'; rr(g, x + 4, y + 4, w - 8, h - 14, 5); g.fill();
  g.fillStyle = '#7ec6e8';
  for (let px = x + 20; px < x + w - 30; px += 46) { rr(g, px, y + h * 0.3, 28, h * 0.32, 4); g.fill(); }
  g.fillStyle = '#e4e7ea'; for (let px = x + 14; px < x + w - 14; px += 34) g.fillRect(px, y + 10, 14, 9);
  g.fillStyle = '#d0121b'; g.fillRect(x + w * 0.4, y + h - 12, w * 0.2, 8);
}

// Kapalı çarşı: uzun taş sıra, üstünde dizi dizi küçük kubbe
function kapaliCarsi(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = '#9d8a6c'; rr(g, x, y, w, h, 4); g.fill();
  g.fillStyle = '#c6b28c'; rr(g, x + 3, y + 3, w - 6, h - 12, 3); g.fill();
  const R = Math.min(h * 0.28, 14);
  for (let px = x + R + 6; px < x + w - R; px += R * 2.3) dome(g, px, y + h * 0.42, R, '#8f9aa4');
  g.fillStyle = '#4e3b2a';
  for (let px = x + 10; px < x + w - 10; px += 22) { g.beginPath(); g.arc(px + 6, y + h - 3, 6, Math.PI, 0); g.fill(); }
}

// Bağ evi: kiremit çatı, baca, asma çardak
function bagevi(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x + 4, y + 5, w, h);
  g.fillStyle = '#f0e6d2'; g.fillRect(x, y, w, h);
  g.fillStyle = '#b5523b'; g.fillRect(x, y, w, h * 0.5);
  g.fillStyle = '#9c4430'; g.fillRect(x, y + h * 0.5, w, h * 0.32);
  g.fillStyle = '#7a3526'; g.fillRect(x, y + h * 0.48, w, 3);
  g.fillStyle = '#8c8c8c'; g.fillRect(x + w * 0.72, y + 4, 7, 7);
  g.fillStyle = '#6b4a2a'; g.fillRect(x - 10, y + h * 0.5, 10, 2); g.fillRect(x - 10, y + h - 2, 10, 2);
  g.fillStyle = '#4f9a3a'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x - 6 + (k % 2) * 4, y + h * 0.55 + k * 6, 4, 0, TAU); g.fill(); }
}

// Okul ve kolejler: renk paleti binada (r.color gövde, r.signColor vurgu)
function ozelOkul(g, r) {
  const { x, y, w, h } = r;
  const body = r.color; const acc = r.signColor || '#1d6fb8';
  g.fillStyle = shade(body, -0.35); rr(g, x, y, w, h, 6); g.fill();
  g.fillStyle = body; rr(g, x + 4, y + 4, w - 8, h - 16, 5); g.fill();
  // İç avlu
  g.fillStyle = shade(body, 0.25); rr(g, x + w * 0.35, y + h * 0.22, w * 0.3, h * 0.38, 4); g.fill();
  g.fillStyle = '#5da33e'; g.beginPath(); g.arc(x + w * 0.5, y + h * 0.41, Math.min(w, h) * 0.08, 0, TAU); g.fill();
  // Vurgu çizgileri ve güneş panelleri
  g.fillStyle = acc; g.fillRect(x + 4, y + 4, w - 8, 6); g.fillRect(x + 4, y + h - 22, w - 8, 6);
  g.fillStyle = '#26303a';
  for (let px = x + 12; px < x + w * 0.3; px += 14) g.fillRect(px, y + 16, 10, 16);
  for (let px = x + w * 0.7; px < x + w - 12; px += 14) g.fillRect(px, y + 16, 10, 16);
  // Giriş saçağı
  g.fillStyle = '#f4f6f8'; g.fillRect(x + w / 2 - 30, y + h - 14, 60, 12);
  g.fillStyle = acc; g.fillRect(x + w / 2 - 30, y + h - 14, 60, 3);
}

// Anıt ve köşk: taş kaide, sekiz köşeli yıldız, uzun gölge
function anit(g, r) {
  const { x, y, w, h } = r;
  const cx = x + w / 2; const cy = y + h / 2; const R = Math.min(w, h) / 2;
  if (r.variant === 'kosk') {
    g.fillStyle = '#7a5a3a'; rr(g, x, y, w, h, 8); g.fill();
    g.fillStyle = '#b5523b'; rr(g, x + 3, y + 3, w - 6, h - 6, 6); g.fill();
    g.strokeStyle = '#8c3e2c'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(x + 3, y + 3); g.lineTo(x + w - 3, y + h - 3); g.moveTo(x + w - 3, y + 3); g.lineTo(x + 3, y + h - 3); g.stroke();
    return;
  }
  g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(cx + R * 0.8, cy + R * 0.6, R * 1.2, R * 0.5, 0.5, 0, TAU); g.fill();
  g.fillStyle = '#b9ad98'; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
  g.fillStyle = '#d8cfbd'; g.beginPath(); g.arc(cx, cy, R * 0.78, 0, TAU); g.fill();
  star8(g, cx, cy, R * 0.6, '#c9a24a', '#8a6d1f');
  g.fillStyle = '#f2eee6'; g.beginPath(); g.arc(cx, cy, R * 0.18, 0, TAU); g.fill();
}

export function paintLandmark(g, r) {
  switch (r.style) {
    case S.SERVIS: servis(g, r); return true;
    case S.MUZE: muze(g, r); return true;
    case S.TEPE_CAMI: tepeCami(g, r); return true;
    case S.KONGRE: kongre(g, r); return true;
    case S.AVM: avm(g, r); return true;
    case S.CARSI: kapaliCarsi(g, r); return true;
    case S.BAGEVI: bagevi(g, r); return true;
    case S.OZEL_OKUL: ozelOkul(g, r); return true;
    case S.ANIT: anit(g, r); return true;
    case S.KULE: g.fillStyle = '#1d3550'; g.fillRect(r.x, r.y, r.w, r.h); return true;
    default: return false;
  }
}

// --- Açık alanlar (pad) ---
export function paintPad(g, p, x, y, w, h) {
  switch (p.kind) {
    case 'stairs': {
      // Geniş giriş merdiveni ve turuncu korkuluk
      for (let k = 0; k < 6; k++) { g.fillStyle = k % 2 ? '#e9ecef' : '#d3d8dd'; g.fillRect(x, y + (k * h) / 6, w, h / 6 + 0.5); }
      g.fillStyle = '#ff7a00'; g.fillRect(x, y, 4, h); g.fillRect(x + w - 4, y, 4, h); g.fillRect(x + w / 2 - 2, y, 4, h);
      return true;
    }
    case 'flag': {
      const fx = x + w / 2; const fy = y + h / 2;
      g.fillStyle = '#c9ced4'; g.beginPath(); g.arc(fx, fy, 9, 0, TAU); g.fill();
      g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(fx, fy, 46, 3);
      g.fillStyle = '#f2f4f6'; g.beginPath(); g.arc(fx, fy, 3.5, 0, TAU); g.fill();
      g.fillStyle = '#e30a17'; g.fillRect(fx + 4, fy - 20, 40, 24);
      g.fillStyle = '#fff'; g.beginPath(); g.arc(fx + 18, fy - 8, 7, 0, TAU); g.fill();
      g.fillStyle = '#e30a17'; g.beginPath(); g.arc(fx + 20, fy - 8, 5.8, 0, TAU); g.fill();
      star8(g, fx + 29, fy - 8, 3.4, '#fff', null);
      return true;
    }
    case 'tram': {
      // Tramvay: yolun ortasında iki ray, durak peronu, sundurma ve durak adı
      const vertical = h > w;
      const mid = vertical ? x + w / 2 : y + h / 2;
      g.fillStyle = 'rgba(60,62,66,.55)';
      if (vertical) g.fillRect(mid - 18, y, 36, h); else g.fillRect(x, mid - 18, w, 36);
      g.fillStyle = '#b8bec5';
      for (const o of [-13, -7, 7, 13]) { if (vertical) g.fillRect(mid + o - 1, y, 2, h); else g.fillRect(x, mid + o - 1, w, 2); }
      g.fillStyle = 'rgba(90,70,50,.6)';
      for (let k = 0; k < (vertical ? h : w); k += 14) { if (vertical) g.fillRect(mid - 16, y + k, 32, 3); else g.fillRect(x + k, mid - 16, 3, 32); }
      if (p.text) {
        const px = vertical ? mid + 22 : x + w * 0.3; const py = vertical ? y + h * 0.3 : mid + 22;
        const pw = vertical ? 16 : 150; const ph = vertical ? 150 : 16;
        g.fillStyle = '#c9ced4'; g.fillRect(px, py, pw, ph);
        g.fillStyle = '#ffd23f'; if (vertical) g.fillRect(px, py, 3, ph); else g.fillRect(px, py, pw, 3);
        g.fillStyle = '#2b6fd6'; if (vertical) g.fillRect(px + 6, py + ph * 0.3, 9, ph * 0.4); else g.fillRect(px + pw * 0.3, py + 6, pw * 0.4, 9);
        g.fillStyle = '#1b2a4a'; rr(g, px + (vertical ? 18 : pw * 0.05), py + (vertical ? 4 : 18), vertical ? 70 : 70, 14, 3); g.fill();
        text(g, p.text, px + (vertical ? 53 : pw * 0.05 + 35), py + (vertical ? 11 : 25), 8, '#ffffff', 800);
      }
      return true;
    }
    case 'hill': {
      // Tepe: üst üste yeşil halkalar, ışık sol üstten
      const cx = x + w / 2; const cy = y + h / 2; const R = Math.min(w, h) / 2;
      for (let k = 0; k < 6; k++) {
        const q = R * (1 - k * 0.14);
        g.fillStyle = shade('#5f9f45', 0.06 * k);
        g.beginPath(); g.ellipse(cx - k * 3, cy - k * 4, q, q * 0.96, 0, 0, TAU); g.fill();
      }
      g.strokeStyle = 'rgba(40,80,30,.35)'; g.lineWidth = 1.2;
      for (let k = 1; k < 6; k++) { g.beginPath(); g.ellipse(cx - k * 3, cy - k * 4, R * (1 - k * 0.14), R * (1 - k * 0.14) * 0.96, 0, 0, TAU); g.stroke(); }
      return true;
    }
    case 'amfi': {
      const cx = x + w / 2; const cy = y + h * 0.15; const R = Math.min(w, h * 1.6) * 0.5;
      for (let k = 0; k < 7; k++) { g.fillStyle = k % 2 ? '#d8cfbd' : '#c4b9a3'; g.beginPath(); g.arc(cx, cy, R * (1 - k * 0.11), 0, Math.PI); g.fill(); }
      g.fillStyle = '#8a5a3a'; g.fillRect(cx - R * 0.32, cy - 12, R * 0.64, 14);
      return true;
    }
    case 'yildiz': {
      // Meydan taşı: büyük Selçuklu yıldızı, çevresinde küçükleri
      g.fillStyle = '#d9d2c4'; g.fillRect(x, y, w, h);
      g.lineWidth = 1.5;
      const R = Math.min(w, h) * 0.32;
      star8(g, x + w / 2, y + h / 2, R, '#c9b48a', '#8f7a52');
      star8(g, x + w / 2, y + h / 2, R * 0.55, '#a8323a', '#7a2028');
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU;
        star8(g, x + w / 2 + Math.cos(a) * R * 1.35, y + h / 2 + Math.sin(a) * R * 1.35, R * 0.18, '#b8a37a', '#8f7a52');
      }
      return true;
    }
    case 'bag': {
      // Bağ: toprak üstünde asma sıraları
      g.fillStyle = '#b89463'; g.fillRect(x, y, w, h);
      for (let k = 8; k < h; k += 16) {
        g.fillStyle = '#8a6a42'; g.fillRect(x + 4, y + k + 4, w - 8, 2);
        g.fillStyle = '#5c9a3c';
        for (let px = x + 8; px < x + w - 8; px += 11) { g.beginPath(); g.arc(px, y + k + 3, 4.2, 0, TAU); g.fill(); }
      }
      return true;
    }
    case 'gul': {
      // Gül bahçesi: yuvarlak tarhlar
      g.fillStyle = '#5c9a3c'; g.fillRect(x, y, w, h);
      for (let py = y + 14; py < y + h - 8; py += 26) {
        for (let px = x + 14; px < x + w - 8; px += 26) {
          g.fillStyle = '#3f7d2f'; g.beginPath(); g.arc(px, py, 10, 0, TAU); g.fill();
          for (let k = 0; k < 5; k++) { g.fillStyle = k % 2 ? '#e8395a' : '#ff8fb0'; g.beginPath(); g.arc(px + Math.cos(k * 1.26) * 5, py + Math.sin(k * 1.26) * 5, 2.4, 0, TAU); g.fill(); }
        }
      }
      return true;
    }
    default: return false;
  }
}

// --- Tabela ---
// Kolej tabelası: siyah zemin, turuncu çerçeve, beyaz ve turuncu harfler
export function landmarkSign(r) {
  if (r.signArt !== 'kolej') return null;
  const words = r.sign.split(' ');
  const last = words.pop();
  const first = words.join(' ');
  const H = 96;
  const c0 = mk(8, 8).getContext('2d');
  c0.font = `400 ${H * 0.62}px Bungee, Nunito, sans-serif`;
  const w1 = c0.measureText(`${first} `).width;
  const w2 = c0.measureText(last).width;
  const W = Math.ceil(w1 + w2 + H * 0.8);
  const c = mk(W, H);
  const g = c.getContext('2d');
  g.fillStyle = '#121316'; rr(g, 0, 0, W, H, 18); g.fill();
  g.strokeStyle = '#ff7a00'; g.lineWidth = 7; rr(g, 6, 6, W - 12, H - 12, 13); g.stroke();
  g.font = `400 ${H * 0.62}px Bungee, Nunito, sans-serif`;
  g.textBaseline = 'middle';
  g.textAlign = 'left';
  const x0 = H * 0.4;
  g.fillStyle = '#ffffff'; g.fillText(`${first} `, x0, H * 0.54);
  g.fillStyle = '#ff7a00'; g.fillText(last, x0 + w1, H * 0.54);
  return c;
}

// --- Yüksek yapılar: duvar, çatı ve gece pencereleri ---
// Duvar dokusu yüksekliği 192: alt kenar zemin, üst kenar çatı (render.js drawTalls ile aynı)
const H0 = 192;

function wallKolej(len, lit, front) {
  const c = mk(len, H0);
  const g = c.getContext('2d');
  const floors = 7;
  const fh = (H0 - 26) / floors;
  if (!lit) {
    g.fillStyle = '#ff7a00'; g.fillRect(0, 0, len, H0);
    g.fillStyle = '#16171a'; g.fillRect(0, 0, len, 9);
    g.fillStyle = '#ff9a3c'; for (let px = 6; px < len; px += 18) g.fillRect(px, 3, 6, 3);
  }
  for (let f = 0; f < floors; f++) {
    const y = 12 + f * fh;
    if (!lit) { g.fillStyle = '#f7f7f5'; g.fillRect(0, y + fh - 4, len, 4); }
    for (let px = 6, col = 0; px < len - 10; px += 22, col++) {
      if (front && f >= floors - 2 && Math.abs(px + 8 - len / 2) < 46) continue; // Giriş holü
      if (!lit) {
        if (col % 4 === 0) { g.fillStyle = '#f7f7f5'; g.fillRect(px - 3, y, 3, fh - 4); }
        g.fillStyle = '#1e2127'; g.fillRect(px, y + 3, 16, fh - 10);
        g.fillStyle = 'rgba(140,190,230,.35)'; g.fillRect(px, y + 3, 6, fh - 10);
      } else {
        const on = ((f * 131 + col * 71 + len) % 10) < 7;
        if (!on) continue;
        g.fillStyle = (f + col) % 5 === 0 ? '#bfe4ff' : '#ffe2a0';
        g.fillRect(px, y + 3, 16, fh - 10);
      }
    }
  }
  if (front) {
    // Büyük giriş: beyaz sütunlar, cam kapılar, siyah saçak
    const ex = len / 2; const top = 12 + (floors - 2) * fh;
    if (!lit) {
      g.fillStyle = '#16171a'; g.fillRect(ex - 50, top, 100, 7);
      g.fillStyle = '#2a3440'; g.fillRect(ex - 44, top + 7, 88, H0 - top - 7);
      g.fillStyle = '#f7f7f5'; for (let k = -44; k <= 40; k += 21) g.fillRect(ex + k, top + 7, 5, H0 - top - 7);
    } else {
      g.fillStyle = '#ffe7b0'; g.fillRect(ex - 39, top + 9, 78, H0 - top - 9);
    }
  }
  return c;
}

function roofKolej(w, h) {
  const c = mk(w, h);
  const g = c.getContext('2d');
  g.fillStyle = '#16171a'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#ff8a1f'; g.fillRect(8, 8, w - 16, h - 16);
  g.fillStyle = '#ffffff'; g.fillRect(8, 8, w - 16, 5); g.fillRect(8, h - 13, w - 16, 5);
  // Güneş panelleri
  g.fillStyle = '#23324a';
  for (let py = 22; py < h - 30; py += 18) for (let px = 20; px < w * 0.3; px += 26) { g.fillRect(px, py, 22, 13); }
  g.strokeStyle = 'rgba(160,200,240,.5)'; g.lineWidth = 1;
  for (let py = 22; py < h - 30; py += 18) for (let px = 20; px < w * 0.3; px += 26) { g.strokeRect(px + 0.5, py + 0.5, 21, 12); }
  // Çatı bahçesi
  g.fillStyle = '#5da33e'; rr(g, w * 0.72, 20, w * 0.24, h - 44, 10); g.fill();
  for (let k = 0; k < 7; k++) { g.fillStyle = k % 2 ? '#3f7d2f' : '#7fbf4e'; g.beginPath(); g.arc(w * 0.75 + (k % 4) * w * 0.05, 34 + Math.floor(k / 4) * (h * 0.3), 9, 0, TAU); g.fill(); }
  // Renkli su depoları ve klimalar
  [['#e8352e', 0.36], ['#2b6fd6', 0.42], ['#ffd23f', 0.48], ['#39c47a', 0.54]].forEach(([col, k]) => { g.fillStyle = col; g.beginPath(); g.arc(w * k, h - 30, 8, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.arc(w * k - 2, h - 32, 3, 0, TAU); g.fill(); });
  g.fillStyle = '#e4e7ea'; for (let px = w * 0.6; px < w * 0.7; px += 14) g.fillRect(px, 24, 10, 8);
  return c;
}

function wallKule(len, lit) {
  const c = mk(len, H0);
  const g = c.getContext('2d');
  if (!lit) {
    const gr = g.createLinearGradient(0, 0, len, 0);
    gr.addColorStop(0, '#20456a'); gr.addColorStop(0.5, '#3f78a6'); gr.addColorStop(1, '#1b3a5a');
    g.fillStyle = gr; g.fillRect(0, 0, len, H0);
    g.fillStyle = 'rgba(255,255,255,.18)'; for (let py = 14; py < H0; py += 4.4) g.fillRect(0, py, len, 1);
    g.fillStyle = '#c9d2db'; for (let px = 4; px < len; px += 16) g.fillRect(px, 0, 2, H0);
    g.fillStyle = '#dfe6ec'; g.fillRect(0, 0, len, 12);
  } else {
    for (let py = 16; py < H0 - 4; py += 4.4) {
      for (let px = 6; px < len - 6; px += 16) {
        if (((py * 7 + px * 3) | 0) % 9 > 3) continue;
        g.fillStyle = ((px + py) | 0) % 3 ? '#fff1c8' : '#cfe8ff';
        g.fillRect(px, py, 12, 2.6);
      }
    }
  }
  return c;
}

function roofKule(w, h) {
  const c = mk(w, h);
  const g = c.getContext('2d');
  // Sivri tepe: dört yüzlü piramit, ortada anten
  const cx = w / 2; const cy = h / 2;
  const faces = [['#cfd8e0', [0, 0, w, 0]], ['#9fb0bf', [w, 0, w, h]], ['#7d8fa0', [w, h, 0, h]], ['#b6c4d0', [0, h, 0, 0]]];
  for (const [col, [ax, ay, bx, by]] of faces) { g.fillStyle = col; g.beginPath(); g.moveTo(cx, cy); g.lineTo(ax, ay); g.lineTo(bx, by); g.closePath(); g.fill(); }
  g.strokeStyle = 'rgba(30,50,70,.45)'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.stroke();
  g.fillStyle = '#e8352e'; g.beginPath(); g.arc(cx, cy, Math.max(3, w * 0.05), 0, TAU); g.fill();
  return c;
}

const ART_CACHE = new Map();
// r.landmark: 'kolej' | 'kule'. Doku boyu binanın kendi oranına göre, bir kez üretilir
export function tallArt(r) {
  const key = `${r.landmark}:${Math.round(r.w)}x${Math.round(r.h)}`;
  let a = ART_CACHE.get(key);
  if (a) return a;
  const lenN = Math.min(1024, Math.max(96, Math.round(r.w * 0.6)));
  const lenE = Math.min(1024, Math.max(96, Math.round(r.h * 0.6)));
  const rot = (src) => {
    const c = mk(H0, src.width);
    const g = c.getContext('2d');
    g.translate(H0 / 2, src.width / 2); g.rotate(Math.PI / 2); g.drawImage(src, -src.width / 2, -H0 / 2);
    return c;
  };
  if (r.landmark === 'kolej') {
    a = {
      n: wallKolej(lenN, false, true), e: rot(wallKolej(lenE, false, false)),
      litN: wallKolej(lenN, true, true), litE: rot(wallKolej(lenE, true, false)),
      roof: roofKolej(Math.round(r.w * 0.6), Math.round(r.h * 0.6)),
    };
  } else if (r.landmark === 'kule') {
    a = {
      n: wallKule(lenN, false), e: rot(wallKule(lenE, false)),
      litN: wallKule(lenN, true), litE: rot(wallKule(lenE, true)),
      roof: roofKule(128, 128), beacon: true,
    };
  } else {
    return null;
  }
  ART_CACHE.set(key, a);
  return a;
}
