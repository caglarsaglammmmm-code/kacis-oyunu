// Kodla çizilen binalar. Çizimler chunk önbelleğine bir kez işlenir; oyun sırasında ek yük yoktur.
// Her bina seed değerinden kendi kat, çatı, cephe ve renk seçimini türetir.
import { BUILD, CONFIG } from './config.js';
import { rr, shade } from './art.js';
import { NAMES } from './names.js';
import { paintLandmark } from './landmarks.js';

function hsl(h, s, l) { return `hsl(${h % 360},${s}%,${l}%)`; }

function label(g, text, x, y, size, color, weight = 800) {
  g.fillStyle = color;
  g.font = `${weight} ${size}px Nunito, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, x, y);
}

// Cephe: güneye bakan yüz. floors kat sayısı kadar pencere sırası
function facade(g, r, wall, color, windowColor, style) {
  const y = r.y + r.h - wall;
  g.fillStyle = shade(color, -0.42);
  g.fillRect(r.x, y, r.w, wall);
  const rows = Math.max(1, Math.floor(wall / 6));
  const step = 8 + (r.seed % 5);
  for (let j = 0; j < rows; j++) {
    for (let x = r.x + 4; x < r.x + r.w - 6; x += step) {
      g.fillStyle = (r.seed + x + j) % 7 === 0 ? '#ffe9a8' : windowColor;
      if (style === 1) g.fillRect(x, y + 2 + j * 6, step - 3, 3.6);
      else g.fillRect(x, y + 2 + j * 6, 4, 3.6);
    }
  }
}

// --- Her apartman farklı ---
function apartment(g, r) {
  const s = r.seed;
  const { x, y, w, h } = r;
  const wall = 8 + (s % 4) * 4;
  const hue = (s * 37) % 360;
  const base = (s % 5 === 0) ? `hsl(${hue},12%,78%)` : hsl(hue, 34 + (s % 26), 62 + (s % 16));
  const hex = baseHex(s);
  facade(g, r, wall, hex, 'rgba(195,230,255,.8)', s % 3 === 0 ? 1 : 0);
  // Balkonlar ve çamaşır
  for (let px = x + 6; px < x + w - 12; px += 18 + (s % 8)) {
    g.fillStyle = 'rgba(255,255,255,.65)';
    g.fillRect(px, y + h - 4.6, 12, 1.4);
    if ((s + px) % 3 === 0) {
      const cols = ['#f4f6f8', '#e8533f', '#3e7cb1', '#f2c14e', '#7a5ea8'];
      for (let i = 0; i < 3; i++) { g.fillStyle = cols[(s + i + px) % 5]; g.fillRect(px + 1 + i * 3.6, y + h - 3.4, 2.8, 3.4); }
    }
  }
  const rh = h - wall;
  const roof = s % 6;
  if (roof === 0 || roof === 1) {
    // Kiremit: beşik çatı
    const tile = roof ? '#b5482f' : '#9c4a35';
    g.fillStyle = tile;
    rr(g, x, y, w, rh, 2); g.fill();
    g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(x, y + rh / 2, w, rh / 2);
    g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = 1;
    for (let py = y + 5; py < y + rh; py += 6) { g.beginPath(); g.moveTo(x, py); g.lineTo(x + w, py); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x, y + rh / 2 - 1, w, 2);
    g.fillStyle = '#7a4e3a'; g.fillRect(x + w * 0.7, y + 6, 8, 8);
  } else if (roof === 2) {
    // Dört yüzlü çatı
    g.fillStyle = '#a8543a'; rr(g, x, y, w, rh, 2); g.fill();
    g.fillStyle = 'rgba(0,0,0,.18)';
    g.beginPath(); g.moveTo(x, y + rh); g.lineTo(x + w, y + rh); g.lineTo(x + w - 18, y + rh / 2); g.lineTo(x + 18, y + rh / 2); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.14)';
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + 18, y + rh / 2); g.lineTo(x, y + rh); g.closePath(); g.fill();
  } else if (roof === 3) {
    // Teraslı: fayans ve korkuluk
    g.fillStyle = base; rr(g, x, y, w, rh, 3); g.fill();
    g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x + 7, y + 7, w - 14, rh - 14);
    g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 1;
    for (let px = x + 14; px < x + w - 8; px += 8) { g.beginPath(); g.moveTo(px, y + 7); g.lineTo(px, y + rh - 7); g.stroke(); }
    g.fillStyle = shade(hex, 0.1); g.fillRect(x + w * 0.2, y + 10, 16, 12);
  } else {
    // Düz çatı, merdiven kulesi, su deposu
    g.fillStyle = base; rr(g, x, y, w, rh, 3); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2;
    g.strokeRect(x + 3, y + 3, w - 6, rh - 6);
    g.fillStyle = shade(hex, -0.18); g.fillRect(x + w * 0.58, y + 8, 15, 12);
    g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x + w * 0.58, y + 18, 15, 2);
    if (roof === 5) { g.fillStyle = '#d9dde2'; g.fillRect(x + 8, y + 8, 18, 6); g.fillRect(x + 8, y + 16, 18, 6); }
  }
}

const PASTEL = ['#e8b4a0', '#d9c98a', '#a9c7a4', '#9fc1d6', '#c3a9d0', '#e6cfa8', '#d59a8a', '#b5b8a0', '#e0a0a8', '#9ecfc2', '#d8b870', '#b0a6c6'];
function baseHex(s) { return PASTEL[s % PASTEL.length]; }

function gecekondu(g, r) {
  // Yamalı çatılı küçük ev
  const s = r.seed;
  const { x, y, w, h } = r;
  g.fillStyle = '#8a7a66'; g.fillRect(x, y, w, h);
  const cols = ['#b08a5a', '#8e9aa6', '#a56a4a', '#7f8c6a', '#c0a080'];
  const n = 3 + (s % 3);
  for (let i = 0; i < n; i++) {
    g.fillStyle = cols[(s + i) % 5];
    const pw = w / n;
    g.fillRect(x + i * pw, y, pw - 1, h - 7);
  }
  g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 1;
  for (let py = y + 4; py < y + h - 8; py += 5) { g.beginPath(); g.moveTo(x, py); g.lineTo(x + w, py); g.stroke(); }
  g.fillStyle = '#2f2a25'; g.fillRect(x + w * 0.3, y + h - 6, 6, 6);
  g.fillStyle = '#a7c9df'; g.fillRect(x + w * 0.6, y + h - 5, 5, 3);
  g.fillStyle = '#5c6b7a'; g.fillRect(x + w * 0.7, y + 3, 6, 6); // Soba borusu
}

function villa(g, r) {
  const s = r.seed;
  const { x, y, w, h } = r;
  const c = ['#b5482f', '#7a4e3a', '#4d6b7a', '#8c5a3c', '#a44a3f'][s % 5];
  g.fillStyle = '#efe6d4'; rr(g, x, y, w, h, 3); g.fill();
  g.fillStyle = 'rgba(160,210,240,.8)';
  for (let px = x + 8; px < x + w - 10; px += 16) g.fillRect(px, y + h - 7, 8, 4);
  g.fillStyle = c; rr(g, x, y, w, h - 9, 3); g.fill();
  g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x, y + (h - 9) / 2, w, (h - 9) / 2);
  g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x + 6, y + (h - 9) / 2 - 1, w - 12, 2);
}

function shoprow(g, r) {
  // Yan yana dükkânlar: üstte tek apartman, altta farklı renkli dükkân cepheleri
  const { x, y, w, h, seed: s } = r;
  const cols = ['#c8261e', '#1d6fb8', '#178a4d', '#d97706', '#6d28a8', '#0f766e', '#be185d'];
  g.fillStyle = baseHex(s + 3); rr(g, x, y, w, h - 14, 3); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, w - 6, h - 20);
  const n = Math.max(2, Math.floor(w / 42));
  const pw = w / n;
  for (let i = 0; i < n; i++) {
    const c = cols[(s + i) % cols.length];
    for (let k = 0; k * 6 < pw; k++) { g.fillStyle = k % 2 ? '#fff' : c; g.fillRect(x + i * pw + k * 6, y + h - 14, Math.min(6, pw - k * 6), 6); }
    g.fillStyle = '#26303a'; g.fillRect(x + i * pw + 2, y + h - 8, pw - 4, 8);
    g.fillStyle = 'rgba(190,230,255,.8)'; g.fillRect(x + i * pw + 4, y + h - 7, pw - 8, 5);
  }
}

function ishani(g, r) {
  const { x, y, w, h, seed: s } = r;
  const wall = 16;
  facade(g, r, wall, '#8b8f94', 'rgba(170,215,240,.8)', 1);
  g.fillStyle = '#b0b4b8'; g.fillRect(x, y, w, h - wall);
  g.fillStyle = '#cfd3d7'; g.fillRect(x + 8, y + 8, w - 16, h - wall - 16);
  g.fillStyle = '#8fa8b8'; g.fillRect(x + 18, y + 18, Math.max(6, w - 36), Math.max(6, h - wall - 36)); // Avlu camı
  label(g, 'İŞ HANI', x + w / 2, y + 12 + (s % 3), 9, '#2b3036');
}

function office(g, r) {
  const { x, y, w, h, seed: s } = r;
  const c = ['#3d5a78', '#4a6a6a', '#55607a', '#2f4a60'][s % 4];
  g.fillStyle = shade(c, -0.5); g.fillRect(x, y, w, h);
  g.fillStyle = c; g.fillRect(x, y, w, h - 20);
  g.strokeStyle = 'rgba(160,210,240,.55)'; g.lineWidth = 1;
  for (let px = x + 9; px < x + w; px += 9) { g.beginPath(); g.moveTo(px, y); g.lineTo(px, y + h - 20); g.stroke(); }
  for (let py = y + 9; py < y + h - 20; py += 9) { g.beginPath(); g.moveTo(x, py); g.lineTo(x + w, py); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,.16)';
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + w * 0.7, y); g.lineTo(x, y + (h - 20) * 0.7); g.closePath(); g.fill();
  g.fillStyle = 'rgba(190,230,255,.7)';
  for (let px = x + 4; px < x + w - 4; px += 6) g.fillRect(px, y + h - 17, 3, 14);
}

function hotel(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = '#7a6a4f'; g.fillRect(x, y, w, h);
  g.fillStyle = '#f0e4c8'; g.fillRect(x, y, w, h - 16);
  g.fillStyle = '#c9a24a'; g.fillRect(x + 4, y + 4, w - 8, 3);
  for (let py = y + 12; py < y + h - 22; py += 9) {
    for (let px = x + 8; px < x + w - 8; px += 10) { g.fillStyle = 'rgba(110,150,180,.6)'; g.fillRect(px, py, 6, 5); }
  }
  g.fillStyle = '#5a9fd4'; rr(g, x + w * 0.6, y + 12, w * 0.26, 18, 6); g.fill(); // Çatı havuzu
  label(g, '★★★★★', x + w * 0.3, y + 22, 9, '#b78a1c');
  g.fillStyle = '#c62828'; g.fillRect(x + w / 2 - 10, y + h - 16, 20, 16); // Giriş halısı
}

function stadium(g, r) {
  const { x, y, w, h } = r;
  const cx = x + w / 2; const cy = y + h / 2;
  g.fillStyle = '#58606b'; rr(g, x, y, w, h, Math.min(w, h) * 0.4); g.fill();
  for (let i = 0; i < 4; i++) {
    g.fillStyle = ['#c8261e', '#f4f6f8', '#c8261e', '#f4f6f8'][i];
    rr(g, x + 10 + i * 12, y + 10 + i * 12, w - 20 - i * 24, h - 20 - i * 24, Math.min(w, h) * 0.34);
    g.fill();
  }
  const fw = w * 0.52; const fh = h * 0.46;
  g.fillStyle = '#3f9a3f'; g.fillRect(cx - fw / 2, cy - fh / 2, fw, fh);
  for (let i = 0; i < 8; i++) if (i % 2) { g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(cx - fw / 2 + (i * fw) / 8, cy - fh / 2, fw / 8, fh); }
  g.strokeStyle = '#fff'; g.lineWidth = 2;
  g.strokeRect(cx - fw / 2 + 3, cy - fh / 2 + 3, fw - 6, fh - 6);
  g.beginPath(); g.moveTo(cx, cy - fh / 2 + 3); g.lineTo(cx, cy + fh / 2 - 3); g.stroke();
  g.beginPath(); g.arc(cx, cy, fh * 0.18, 0, 7); g.stroke();
  for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { g.fillStyle = '#eef2f6'; g.fillRect(x + a * (w - 16) + 4, y + b * (h - 16) + 4, 10, 10); } // Projektörler
}

function siteBlock(g, r) {
  // Site bloğu: sitenin rengi ortak, kat sayısı, çatı ve balkon düzeni bloktan bloğa değişir
  const { x, y, w, h, seed: s } = r;
  const c = r.color;
  const floors = 6 + (s % 7);
  const wall = Math.min(h * 0.46, floors * 7);
  g.fillStyle = shade(c, -0.34); g.fillRect(x, y + h - wall, w, wall);
  const bal = s % 3;
  for (let j = 0; j < floors; j++) {
    const py = y + h - wall + 2 + j * 7;
    for (let px = x + 4; px < x + w - 8; px += 10 + (s % 3)) {
      g.fillStyle = (s + px + j * 3) % 7 === 0 ? '#ffe9a8' : 'rgba(195,230,255,.9)';
      g.fillRect(px, py, bal === 1 ? 7 : 5, 4);
      if (bal !== 2 && (px + j) % 2 === 0) { g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(px - 1, py + 4, 8, 1.2); }
    }
  }
  const rh = h - wall;
  g.fillStyle = shade(c, 0.3 - (s % 4) * 0.08); rr(g, x, y, w, rh, 3); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, w - 6, rh - 6);
  const t = s % 4;
  if (t === 0) { g.fillStyle = '#1f3f77'; for (let py = y + 9; py < y + rh - 12; py += 11) for (let px = x + 9; px < x + w - 18; px += 15) g.fillRect(px, py, 12, 8); }
  else if (t === 1) { g.fillStyle = '#7fb56a'; rr(g, x + 9, y + 9, w - 18, rh - 18, 6); g.fill(); g.fillStyle = '#4f9a3a'; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(x + 18 + i * 13, y + 18 + (i % 2) * 9, 4.5, 0, 7); g.fill(); } }
  else if (t === 2) { g.fillStyle = shade(c, -0.1); g.fillRect(x + w * 0.2, y + rh * 0.25, w * 0.6, rh * 0.5); g.fillStyle = '#d7dde2'; g.fillRect(x + w * 0.3, y + rh * 0.4, 14, 10); }
  else { g.fillStyle = '#b5482f'; g.fillRect(x + 6, y + 6, w - 12, rh - 12); g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x + 6, y + rh / 2, w - 12, rh / 2 - 6); }
  g.fillStyle = 'rgba(0,0,0,.55)'; g.beginPath(); g.arc(x + w / 2, y + rh / 2, 11, 0, 7); g.fill();
  label(g, String.fromCharCode(65 + (r.block || 0)), x + w / 2, y + rh / 2 + 1, 15, '#fff');
}

// Sokak keyfi: müzikli kafe, çay bahçesi ya da spor salonu. Çatıdan ne olduğu anlaşılır
function cafe(g, r) {
  const { x, y, w, h } = r;
  const gym = r.sign.includes('Spor');
  const tea = r.sign.includes('Çay');
  g.fillStyle = gym ? '#39424e' : tea ? '#6f9a5a' : '#e9d9bf'; rr(g, x, y, w, h, 4); g.fill();
  g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x + 3, y + h - 22, w - 6, 4);
  g.strokeStyle = r.color; g.lineWidth = 3; rr(g, x + 5, y + 5, w - 10, h - 30, 3); g.stroke();
  const cx = x + w / 2; const cy = y + (h - 26) / 2;
  if (gym) {
    g.fillStyle = '#d7dde2'; g.fillRect(cx - 18, cy - 2, 36, 4);
    for (const s of [-1, 1]) { g.fillRect(cx + s * 18 - 3, cy - 9, 6, 18); g.fillRect(cx + s * 12 - 2, cy - 7, 4, 14); }
  } else if (tea) {
    for (const [dx, dy] of [[-16, -6], [14, -8], [0, 8]]) { g.fillStyle = '#f4ead2'; g.beginPath(); g.arc(cx + dx, cy + dy, 7, 0, 7); g.fill(); g.fillStyle = '#b5482f'; g.beginPath(); g.arc(cx + dx, cy + dy, 2.5, 0, 7); g.fill(); }
  } else {
    g.fillStyle = '#6a3f28';
    g.beginPath(); g.ellipse(cx - 9, cy + 8, 6, 4.5, -0.3, 0, 7); g.ellipse(cx + 9, cy + 5, 6, 4.5, -0.3, 0, 7); g.fill();
    g.fillRect(cx - 4, cy - 12, 2.5, 20); g.fillRect(cx + 14, cy - 15, 2.5, 20); g.fillRect(cx - 4, cy - 15, 20.5, 4);
  }
  g.fillStyle = r.color;
  for (let px = x + 2; px < x + w - 6; px += 10) g.fillRect(px, y + h - 18, 5, 8);
  g.fillStyle = '#d7dde2'; g.fillRect(x + 3, y + h - 18, w - 6, 1.5);
}

// Her zincirin kendi cephesi: renk, biçim, tente ve otopark
const CHAINS = {
  // Tenteli küçük market: çizgili sundurma
  pazarcik: (g, r) => { box(g, r, '#3f8f5b', '#f4ead2'); for (let px = r.x; px < r.x + r.w; px += 16) { g.fillStyle = (px - r.x) % 32 ? '#f4ead2' : '#3f8f5b'; g.fillRect(px, r.y + r.h - 22, 16, 7); } },
  // İndirim marketi: büyük yıldız çatı yaması
  ucuzlar: (g, r) => { box(g, r, '#7b3fa0', '#ffd23f'); g.fillStyle = '#ffd23f'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -1.57 + i * 0.628; const q = i % 2 ? 9 : 20; g[i ? 'lineTo' : 'moveTo'](r.x + r.w * 0.78 + Math.cos(a) * q, r.y + 24 + Math.sin(a) * q); } g.closePath(); g.fill(); },
  sepet: (g, r) => { box(g, r, '#1f9e9e', '#e9f6f4'); g.strokeStyle = '#e9f6f4'; g.lineWidth = 3; g.strokeRect(r.x + r.w * 0.7, r.y + 16, 26, 14); g.beginPath(); g.arc(r.x + r.w * 0.7 + 13, r.y + 16, 11, 3.14, 0); g.stroke(); },
  yildiz: (g, r) => { box(g, r, '#c23b6b', '#fff0d8'); g.fillStyle = '#fff0d8'; for (const k of [0.2, 0.5, 0.8]) { g.beginPath(); g.arc(r.x + r.w * k, r.y + 18, 5, 0, 7); g.fill(); } },
  dortyol: (g, r) => { box(g, r, '#6a7f2a', '#f7f3e3'); g.fillStyle = '#f7f3e3'; g.fillRect(r.x + r.w * 0.5 - 2, r.y + 8, 4, r.h - 34); g.fillRect(r.x + 8, r.y + (r.h - 26) * 0.5, r.w - 16, 4); },
  teknoloji: (g, r) => {
    box(g, r, '#2b3a67', '#b7f34a');
    g.strokeStyle = '#b7f34a'; g.lineWidth = 2;
    for (let px = r.x + 14; px < r.x + r.w - 16; px += 22) { g.beginPath(); g.arc(px, r.y + 16, 5, 0, 7); g.stroke(); }
  },
  yapi: (g, r) => {
    box(g, r, '#8a5a2b', '#f2e6d0');
    g.fillStyle = '#6f8f55'; g.fillRect(r.x + r.w * 0.7, r.y, r.w * 0.3, r.h - 18); // Bahçe bölümü
    g.fillStyle = 'rgba(255,255,255,.25)';
    for (let px = r.x + r.w * 0.7; px < r.x + r.w; px += 12) g.fillRect(px, r.y, 2, r.h - 18);
  },
  kose: (g, r) => { box(g, r, '#b5651d', '#fff4d8'); stripe(g, r, '#fff4d8', '#b5651d'); },
};

function box(g, r, roof, band) {
  const { x, y, w, h } = r;
  g.fillStyle = '#b7bcc2'; g.fillRect(x, y, w, h);
  g.fillStyle = roof === '#ffffff' ? '#eceff2' : shade(roof, 0.55); g.fillRect(x, y, w, h - 24);
  g.strokeStyle = 'rgba(0,0,0,.07)'; g.lineWidth = 2;
  for (let px = x + 14; px < x + w - 6; px += 18) { g.beginPath(); g.moveTo(px, y + 3); g.lineTo(px, y + h - 26); g.stroke(); }
  g.fillStyle = '#d7dde2'; g.fillRect(x + 10, y + 10, 16, 10); g.fillRect(x + 36, y + 10, 16, 10);
  g.fillStyle = 'rgba(170,220,245,.85)'; g.fillRect(x + 4, y + h - 8, w - 8, 8);
  g.fillStyle = roof; g.fillRect(x, y + h - 24, w, 16);
  r.bandColor = band;
}

function stripe(g, r, a, b) {
  for (let i = 0; i * 10 < r.w; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(r.x + i * 10, r.y + r.h - 30, Math.min(10, r.w - i * 10), 6); }
}

function kolej(g, r) {
  // Haritanın en büyük binası: turuncu, beyaz, siyah
  const { x, y, w, h } = r;
  g.fillStyle = '#17181b'; rr(g, x, y, w, h, 6); g.fill();
  g.fillStyle = '#ff7a00'; rr(g, x, y, w, h - 40, 6); g.fill();
  g.fillStyle = '#ffffff'; g.fillRect(x + 22, y + 22, w - 44, h - 84);
  g.fillStyle = '#ff7a00'; g.fillRect(x + 44, y + 44, w - 88, h - 128);
  g.fillStyle = '#17181b'; g.fillRect(x, y + (h - 40) / 2 - 3, 22, 6); g.fillRect(x + w - 22, y + (h - 40) / 2 - 3, 22, 6);
  // Yazı: turuncu üstüne beyaz, siyah gölgeli
  const size = Math.floor(w / 11);
  const cx = x + w / 2; const cy = y + (h - 40) / 2;
  g.font = `900 ${size}px Bungee, Nunito, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#17181b';
  const [top, ...rest] = NAMES.kolej.ad.split(' ');
  const bottom = rest.join(' ');
  g.fillText(top, cx + 4, cy - size * 0.55 + 4);
  g.fillText(bottom, cx + 4, cy + size * 0.55 + 4);
  g.fillStyle = '#ffffff';
  g.fillText(top, cx, cy - size * 0.55);
  g.fillText(bottom, cx, cy + size * 0.55);
  // Cephe: beyaz sütunlar, siyah camlar, turuncu giriş
  for (let px = x + 10; px < x + w - 12; px += 24) {
    g.fillStyle = '#ffffff'; g.fillRect(px, y + h - 38, 6, 38);
    g.fillStyle = '#23262b'; g.fillRect(px + 6, y + h - 36, 16, 12);
    g.fillStyle = '#ff9a3c'; g.fillRect(px + 6, y + h - 20, 16, 12);
  }
  g.fillStyle = '#ff7a00'; g.fillRect(x + w / 2 - 58, y + h - 40, 116, 40);
  label(g, NAMES.kolej.ad, x + w / 2, y + h - 22, 8.5, '#ffffff', 900);
}


// --- v5: tek tek kimlikli binalar ---
const SHOP_LOOK = [
  [/döner|dönerci|kebap|iskender|ciğer|çiğköfte/i, { wall: '#7a2a18', awn: ['#c8261e', '#ffd23f'], fx: 'spit' }],
  [/pide|lahmacun|börek|fırın|ekmek/i, { wall: '#a8733f', awn: ['#d97706', '#fff4d8'], fx: 'oven' }],
  [/eczane/i, { wall: '#f4f6f4', awn: ['#d0121b', '#ffffff'], fx: 'cross' }],
  [/kuaför|berber/i, { wall: '#2d3a55', awn: ['#1d6fb8', '#ffffff'], fx: 'pole' }],
  [/çay|kahve|kafe|tost/i, { wall: '#5a3a24', awn: ['#178a4d', '#f4e7c8'], fx: 'tables' }],
  [/büfe|bayii|bakkal|market/i, { wall: '#30536e', awn: ['#ffd23f', '#1d6fb8'], fx: 'crates' }],
  [/kasap|manav|tatlı|lokanta/i, { wall: '#6d3b2a', awn: ['#178a4d', '#ffffff'], fx: 'crates' }],
];

function shop(g, r) {
  const { x, y, w, h, seed: s } = r;
  let look = { wall: PASTEL[s % PASTEL.length], awn: ['#6d28a8', '#ffffff'], fx: '' };
  for (const [re, l] of SHOP_LOOK) if (re.test(r.sign)) { look = l; break; }
  const front = Math.min(18, h * 0.42);
  // Küçük dükkân: düz çatı, klima, baca
  g.fillStyle = shade(baseHex(s + 5), -0.08); g.fillRect(x, y, w, h - front);
  g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 1.5; g.strokeRect(x + 2, y + 2, w - 4, h - front - 4);
  g.fillStyle = '#c9ced3'; g.fillRect(x + 6 + (s % 9), y + 6, 11, 8);
  g.fillStyle = '#6d7680'; g.beginPath(); g.arc(x + 11.5 + (s % 9), y + 10, 2.6, 0, 7); g.fill();
  if (look.fx === 'spit' || look.fx === 'oven') { g.fillStyle = '#4a4f55'; g.fillRect(x + w - 15, y + 5, 9, 9); g.fillStyle = 'rgba(255,255,255,.3)'; g.beginPath(); g.arc(x + w - 10, y + 9, 2.4, 0, 7); g.fill(); }
  // Cephe
  const fy = y + h - front;
  g.fillStyle = look.wall; g.fillRect(x, fy, w, front);
  const gw = w - 8;
  g.fillStyle = 'rgba(180,225,250,.86)'; g.fillRect(x + 4, fy + 8, gw * 0.62, front - 10);
  g.fillStyle = '#2a2520'; g.fillRect(x + 6 + gw * 0.66, fy + 7, gw * 0.26, front - 7);
  // Tente: çizgili
  const n = Math.max(3, Math.floor(w / 7));
  for (let i = 0; i < n; i++) { g.fillStyle = look.awn[i % 2]; g.fillRect(x + (i * w) / n, fy + 1, w / n + 0.5, 5); }
  if (look.fx === 'spit') { g.fillStyle = '#8a4a1e'; g.fillRect(x + 7, fy + 9, 5, front - 12); g.fillStyle = '#e8a04a'; g.fillRect(x + 8, fy + 10, 3, front - 14); }
  if (look.fx === 'cross') { g.fillStyle = '#d0121b'; g.fillRect(x + w - 11, fy - 9, 8, 3); g.fillRect(x + w - 8.5, fy - 11.5, 3, 8); }
  if (look.fx === 'pole') { for (let i = 0; i < 4; i++) { g.fillStyle = ['#d0121b', '#fff', '#1d6fb8', '#fff'][i]; g.fillRect(x + w - 6, fy + 6 + i * 3, 3, 3); } }
  if (look.fx === 'crates') { for (let i = 0; i < 3; i++) { g.fillStyle = ['#e8533f', '#7fc241', '#ffb020'][(s + i) % 3]; g.fillRect(x + 4 + i * 6, y + h - 4, 5, 4); } }
}

// Uzun bina cephesi: kat sayısı kadar pencere sırası, güneye bakar
function towerFace(g, x, y, w, wall, frame, glass, s, vertical) {
  g.fillStyle = frame; g.fillRect(x, y, w, wall);
  const rows = Math.floor(wall / 6.5);
  const cw = vertical ? 5 : 8 + (s % 3);
  for (let j = 0; j < rows; j++) {
    for (let px = x + 3; px < x + w - cw; px += cw + 2) {
      g.fillStyle = (s + Math.floor(px) * 3 + j * 7) % 9 === 0 ? '#ffe9a8' : glass;
      g.fillRect(px, y + 3 + j * 6.5, cw, 4.2);
    }
  }
}

function skyscraper(g, r) {
  // Gökdelen: kademeli yükselen, çok yüksek cephe, tepede anten ve helikopter pisti
  const { x, y, w, h, seed: s } = r;
  const wall = Math.min(h * 0.46, 92);
  const c = r.color;
  const kind = s % 4;
  towerFace(g, x, y + h - wall, w, wall, shade(c, -0.6), shade(c, 0.35), s, kind % 2 === 0);
  const rh = h - wall;
  const gl = g.createLinearGradient(x, y, x + w, y + rh);
  gl.addColorStop(0, shade(c, 0.55)); gl.addColorStop(0.55, c); gl.addColorStop(1, shade(c, -0.3));
  g.fillStyle = gl;
  if (kind === 3) { g.beginPath(); g.ellipse(x + w / 2, y + rh / 2, w / 2, rh / 2, 0, 0, 7); g.fill(); }
  else { rr(g, x, y, w, rh, kind === 1 ? 14 : 3); g.fill(); }
  g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1;
  const steps = 3 + (s % 3);
  for (let i = 1; i < steps; i++) { const m = i * Math.min(w, rh) * 0.07; rr(g, x + m, y + m, w - m * 2, rh - m * 2, 6); g.stroke(); }
  const cx = x + w / 2; const cy = y + rh / 2; const d = Math.min(w, rh) * 0.2;
  g.fillStyle = '#3d444e'; g.beginPath(); g.arc(cx, cy, d, 0, 7); g.fill();
  g.strokeStyle = '#ffd23f'; g.lineWidth = 2; g.stroke();
  label(g, s % 2 ? 'H' : '✦', cx, cy + 1, d, '#fff');
}

function residence2(g, r) {
  // Rezidans: bombeli balkon sıraları, teras bahçesi, çok katlı
  const { x, y, w, h, seed: s } = r;
  const c = ['#d9d3c7', '#c7d4dc', '#e2c8b4', '#b9c8c0', '#d5c2d6'][s % 5];
  const wall = Math.min(h * 0.42, 74);
  g.fillStyle = shade(c, -0.42); g.fillRect(x, y + h - wall, w, wall);
  for (let j = 0; j * 9 < wall - 4; j++) {
    const py = y + h - wall + 3 + j * 9;
    for (let px = x + 3; px < x + w - 12; px += 14 + (s % 4)) {
      g.fillStyle = '#9fd2ee'; g.fillRect(px, py, 9, 5);
      g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(px - 1, py + 5, 11, 1.6);
    }
  }
  const rh = h - wall;
  g.fillStyle = c; rr(g, x, y, w, rh, 12); g.fill();
  g.fillStyle = '#7fb56a'; rr(g, x + 6, y + 6, w * 0.4, rh * 0.4, 6); g.fill();
  g.fillStyle = '#4f9a3a'; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x + 12 + i * 9, y + 12 + (i % 2) * 6, 4, 0, 7); g.fill(); }
  g.fillStyle = '#57c1f0'; rr(g, x + w * 0.55, y + rh * 0.5, w * 0.34, rh * 0.32, 5); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.stroke();
}

function bank2(g, r) {
  // Banka: geniş cam cephe, kurumsal renk bandı, sütun, ATM sırası
  const { x, y, w, h } = r;
  const c = r.signColor;
  const f = Math.min(30, h * 0.46);
  g.fillStyle = '#d7dbdf'; g.fillRect(x, y, w, h);
  g.fillStyle = '#eef0f2'; g.fillRect(x, y, w, h - f);
  g.fillStyle = shade(c, 0.05); g.fillRect(x + 4, y + 4, w - 8, Math.min(8, (h - f) * 0.3));
  g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(x + 10, y + 16, Math.max(2, w - 20), Math.max(2, h - f - 22));
  const gl = g.createLinearGradient(0, y + h - f, 0, y + h);
  gl.addColorStop(0, '#a9dcf5'); gl.addColorStop(1, '#3f7ea3');
  g.fillStyle = gl; g.fillRect(x + 3, y + h - f, w - 6, f);
  g.fillStyle = '#f7f8f9';
  for (let px = x + 5; px < x + w - 4; px += 14) g.fillRect(px, y + h - f, 3, f);
  for (let i = 0; i < 3 && i * 11 < w - 12; i++) {
    const px = x + w - 14 - i * 11;
    g.fillStyle = c; g.fillRect(px, y + h - 12, 9, 12);
    g.fillStyle = '#bfe7ff'; g.fillRect(px + 1.5, y + h - 10, 6, 4);
    g.fillStyle = '#fff'; g.fillRect(px + 2, y + h - 4.5, 5, 1.4);
  }
  label(g, 'ATM', x + w - 22, y + h - f + 6, 7, '#fff');
}

function hospital2(g, r) {
  const { x, y, w, h } = r;
  const wall = 34;
  // Dört katlı beyaz bloklar, ortada avlu, tepede haç ve helikopter pisti
  g.fillStyle = '#9fb0bc'; g.fillRect(x, y + h - wall, w, wall);
  for (let j = 0; j < 4; j++) for (let px = x + 6; px < x + w - 12; px += 13) { g.fillStyle = 'rgba(160,210,240,.95)'; g.fillRect(px, y + h - wall + 3 + j * 7.4, 9, 4.6); }
  g.fillStyle = '#f4f7f9'; g.fillRect(x, y, w, h - wall);
  g.fillStyle = '#d7e2e8'; g.fillRect(x + w * 0.34, y + (h - wall) * 0.28, w * 0.32, (h - wall) * 0.44);
  g.fillStyle = '#7fb56a'; g.fillRect(x + w * 0.37, y + (h - wall) * 0.33, w * 0.26, (h - wall) * 0.34);
  // Koca kırmızı haç
  const cx = x + w * 0.17; const cy = y + (h - wall) * 0.5; const q = Math.min(w, h) * 0.14;
  g.fillStyle = '#fff'; g.beginPath(); g.arc(cx, cy, q * 1.5, 0, 7); g.fill();
  g.fillStyle = '#e30a17'; g.fillRect(cx - q, cy - q * 0.34, q * 2, q * 0.68); g.fillRect(cx - q * 0.34, cy - q, q * 0.68, q * 2);
  const hx = x + w * 0.83;
  g.fillStyle = '#3d444e'; g.beginPath(); g.arc(hx, cy, q * 1.4, 0, 7); g.fill();
  g.strokeStyle = '#ffd23f'; g.lineWidth = 2.5; g.stroke();
  label(g, 'H', hx, cy + 1, q * 1.7, '#fff');
  // Acil girişi
  g.fillStyle = '#d0121b'; g.fillRect(x + w * 0.4, y + h - 13, w * 0.2, 13);
  label(g, 'ACİL', x + w * 0.5, y + h - 6.5, 9, '#fff', 900);
}

function school2(g, r) {
  const { x, y, w, h } = r;
  const wall = 22;
  g.fillStyle = '#a06b34'; g.fillRect(x, y + h - wall, w, wall);
  for (let j = 0; j < 2; j++) for (let px = x + 6; px < x + w - 10; px += 12) { g.fillStyle = 'rgba(170,215,240,.95)'; g.fillRect(px, y + h - wall + 3 + j * 9, 8, 6); }
  g.fillStyle = '#e8cf9a'; g.fillRect(x, y, w, h - wall);
  g.fillStyle = '#c8553d'; g.fillRect(x, y, w, 7);
  g.fillStyle = '#d9b97a'; g.fillRect(x + 8, y + 12, w - 16, Math.max(2, h - wall - 18));
  g.fillStyle = '#3a2a1a'; g.fillRect(x + w / 2 - 9, y + h - 15, 18, 15);
}

function mosque2(g, r) {
  // Cami: taş avlu, şadırvan, merkezi kubbe, yarım kubbeler, kurşun rengi, dört minare
  const { x, y, w, h, seed: s } = r;
  const cx = x + w / 2; const cy = y + h * 0.42;
  g.fillStyle = '#d9d2c2'; rr(g, x, y, w, h, 6); g.fill();
  // Avlu revakları
  const ay = y + h * 0.72;
  g.fillStyle = '#efe8d8'; g.fillRect(x + 12, ay, w - 24, h * 0.24);
  g.fillStyle = '#b9b09c';
  for (let px = x + 18; px < x + w - 18; px += 20) { g.beginPath(); g.arc(px, ay + 5, 6, 0, 7); g.arc(px, ay + h * 0.24 - 5, 6, 0, 7); g.fill(); }
  g.fillStyle = '#6fb6d0'; g.beginPath(); g.arc(cx, ay + h * 0.12, 11, 0, 7); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke();
  // Ana yapı
  g.fillStyle = '#c9c3b4'; g.fillRect(x + 22, y + 16, w - 44, h * 0.56);
  const d = Math.min(w, h) * 0.24;
  for (const [a, b] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
    const gr = g.createRadialGradient(cx + a * d * 0.9 - 3, cy + b * d * 0.9 - 3, 1, cx + a * d * 0.9, cy + b * d * 0.9, d * 0.56);
    gr.addColorStop(0, '#a8b8c4'); gr.addColorStop(1, '#5f7180');
    g.fillStyle = gr; g.beginPath(); g.arc(cx + a * d * 0.9, cy + b * d * 0.9, d * 0.56, 0, 7); g.fill();
  }
  for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.fillStyle = '#7d8f9c'; g.beginPath(); g.arc(cx + a * d * 0.92, cy + b * d * 0.92, d * 0.26, 0, 7); g.fill(); }
  const gr = g.createRadialGradient(cx - d * 0.35, cy - d * 0.35, 2, cx, cy, d);
  gr.addColorStop(0, '#d2dde5'); gr.addColorStop(0.6, '#8fa2b0'); gr.addColorStop(1, '#55697a');
  g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, d, 0, 7); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = 1;
  for (let i = 0; i < 16; i++) { const t = (i / 16) * 6.283; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(t) * d, cy + Math.sin(t) * d); g.stroke(); }
  g.fillStyle = '#e8c547'; g.beginPath(); g.arc(cx, cy, 3.4, 0, 7); g.fill();
  // Minareler: gölgesi yere uzanan ince kuleler
  const n = s % 2 ? 4 : 2;
  const mins = n === 4 ? [[x + 12, y + 12], [x + w - 12, y + 12], [x + 12, y + h * 0.7], [x + w - 12, y + h * 0.7]] : [[x + 12, y + h * 0.68], [x + w - 12, y + h * 0.68]];
  for (const [px, py] of mins) {
    g.fillStyle = 'rgba(0,10,30,.28)'; g.beginPath(); g.moveTo(px - 2, py); g.lineTo(px + 48, py + 60); g.lineTo(px + 53, py + 56); g.lineTo(px + 3, py - 3); g.closePath(); g.fill();
    g.fillStyle = '#f4f2ea'; g.beginPath(); g.arc(px, py, 7.5, 0, 7); g.fill();
    g.strokeStyle = '#b9b09c'; g.lineWidth = 1.2; g.stroke();
    g.fillStyle = '#6f8192'; g.beginPath(); g.moveTo(px, py - 5); g.lineTo(px + 5, py); g.lineTo(px, py + 5); g.lineTo(px - 5, py); g.closePath(); g.fill();
  }
}

// Sıradan apartmanda daha fazla kat ve cephe çeşidi
function apartment2(g, r) {
  const { x, y, w, h, seed: s } = r;
  if (h < 90) { apartment(g, r); return; }
  const floors = 3 + (s % 6);
  const wall = Math.min(h * 0.5, floors * 8);
  const col = baseHex(s);
  const kind = s % 4;
  g.fillStyle = shade(col, -0.2); g.fillRect(x, y + h - wall, w, wall);
  for (let j = 0; j < floors; j++) {
    const py = y + h - wall + 2 + j * 8;
    for (let px = x + 4; px < x + w - 8; px += 11 + (s % 3)) {
      g.fillStyle = (s + px + j) % 6 === 0 ? '#ffe9a8' : 'rgba(195,230,255,.9)';
      g.fillRect(px, py, kind === 1 ? 8 : 5, 4.6);
      if (kind === 2) { g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(px - 1, py + 4.6, 8, 1.2); }
      if (kind === 3 && (px + j) % 3 === 0) { g.fillStyle = ['#e8533f', '#f2c14e', '#3e7cb1'][(px + j) % 3]; g.fillRect(px, py + 4.6, 5, 2.4); }
    }
  }
  const sub = { ...r, h: h - wall + 12 };
  const roofY = y;
  const rh = h - wall;
  const t = s % 5;
  if (t <= 1) {
    g.fillStyle = t ? '#b5482f' : '#a0533a'; g.fillRect(x, roofY, w, rh);
    g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(x, roofY + rh / 2, w, rh / 2);
    g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = 1;
    for (let py = roofY + 5; py < roofY + rh; py += 6) { g.beginPath(); g.moveTo(x, py); g.lineTo(x + w, py); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(x, roofY + rh / 2 - 1, w, 2);
  } else if (t === 2) {
    g.fillStyle = col; g.fillRect(x, roofY, w, rh);
    g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 2; g.strokeRect(x + 3, roofY + 3, w - 6, rh - 6);
    g.fillStyle = '#1f3f77';
    for (let py = roofY + 8; py < roofY + rh - 12; py += 12) for (let px = x + 8; px < x + w - 16; px += 16) g.fillRect(px, py, 13, 9);
  } else if (t === 3) {
    g.fillStyle = '#c6b8a0'; g.fillRect(x, roofY, w, rh);
    g.fillStyle = shade(col, -0.1); g.fillRect(x + w * 0.1, roofY + rh * 0.2, w * 0.3, rh * 0.5);
    g.fillStyle = '#d7dde2'; g.beginPath(); g.ellipse(x + w * 0.7, roofY + rh * 0.4, 7, 6, 0, 0, 7); g.fill();
  } else {
    g.fillStyle = shade(col, 0.12); g.fillRect(x, roofY, w, rh);
    g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 1;
    for (let px = x + 9; px < x + w; px += 9) { g.beginPath(); g.moveTo(px, roofY); g.lineTo(px, roofY + rh); g.stroke(); }
    g.fillStyle = '#8a4a2a'; g.fillRect(x + w * 0.2, roofY + 8, 14, 11);
  }
  void sub;
}

// Cephe süsleri: tohumdan seçilir, hiçbir bina aynı düzende olmaz
function facadeBits(g, r) {
  if (r.h < 56 || r.w < 44) return;
  const s = r.seed;
  const y = r.y + r.h - Math.min(r.h * 0.34, 34);
  const step = 15 + (s % 9);
  let k = s % 11;
  for (let px = r.x + 6; px < r.x + r.w - 14; px += step) {
    k = (k * 7 + 3) % 11;
    const py = y + (k % 3) * 8;
    if (k < 3) { // Çamaşır
      g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 0.7; g.beginPath(); g.moveTo(px, py); g.lineTo(px + 12, py); g.stroke();
      for (let i = 0; i < 3; i++) { g.fillStyle = ['#f4f6f8', '#e8533f', '#3e7cb1', '#f2c14e', '#d94f9c'][(s + i + k) % 5]; g.fillRect(px + 1 + i * 4, py, 3, 4 + (i % 2) * 2); }
    } else if (k < 5) { // Klima
      g.fillStyle = '#dfe3e8'; g.fillRect(px, py, 9, 6); g.fillStyle = '#6d7680'; g.beginPath(); g.arc(px + 4.5, py + 3, 2, 0, 7); g.fill();
    } else if (k < 7) { // Çiçekli balkon
      g.fillStyle = '#8a5a3a'; g.fillRect(px, py + 3, 12, 2.4);
      for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? '#4f9a3a' : ['#ff5a8a', '#ffd23f', '#e8352e'][(s + k) % 3]; g.beginPath(); g.arc(px + 1.6 + i * 3, py + 2, 1.7, 0, 7); g.fill(); }
    } else if (k < 9) { // Tente
      for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? '#fff' : ['#c8261e', '#1d6fb8', '#178a4d'][s % 3]; g.fillRect(px + i * 3, py, 3, 4); }
    } else { // Uydu çanağı
      g.fillStyle = '#eceff2'; g.beginPath(); g.ellipse(px + 4, py + 3, 4, 3.4, 0.5, 0, 7); g.fill();
      g.strokeStyle = '#7d8590'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(px + 4, py + 3); g.lineTo(px + 7, py + 7); g.stroke();
    }
  }
}

// Harabe: çöken çatı, kırık duvar, çatlaklar, moloz
function ruin(g, r) {
  const { x, y, w, h, seed: s } = r;
  g.fillStyle = '#8b8378'; g.fillRect(x, y, w, h);
  g.fillStyle = '#2a2622'; // İç boşluk
  g.beginPath();
  // Delik her harabede farklı yerde ve boyda
  const hx = 0.1 + ((s % 7) / 7) * 0.34; const hw = 0.34 + ((s % 5) / 5) * 0.36;
  const hy = 0.12 + ((s % 3) / 3) * 0.3; const hh = 0.3 + ((s % 4) / 4) * 0.34;
  g.moveTo(x + w * hx, y + h * hy);
  for (let i = 0; i <= 7; i++) { const t = i / 7; g.lineTo(x + w * (hx + hw * t), y + h * (hy + (((s * (i + 3)) % 13) / 13) * 0.2)); }
  for (let i = 7; i >= 0; i--) { const t = i / 7; g.lineTo(x + w * (hx + hw * t), y + h * (hy + hh + (((s * (i + 7)) % 11) / 11) * 0.2)); }
  g.closePath(); g.fill();
  g.strokeStyle = '#5b544b'; g.lineWidth = 1.2;
  for (let i = 0; i < 7; i++) {
    let px = x + ((s * (i + 2) * 37) % 100) / 100 * w; let py = y + ((s * (i + 5) * 53) % 100) / 100 * h;
    g.beginPath(); g.moveTo(px, py);
    for (let k = 0; k < 4; k++) { px += ((s + k * 17 + i) % 19) - 9; py += ((s + k * 23 + i) % 17) - 6; g.lineTo(px, py); }
    g.stroke();
  }
  // Duvar kalıntısı ve kırık kenar
  g.fillStyle = '#a79c8d';
  for (let px = x; px < x + w; px += 11) { const hh = 4 + ((s + px) % 13); g.fillRect(px, y, 8, hh); g.fillRect(px, y + h - hh, 8, hh); }
  for (let i = 0; i < 16; i++) {
    g.fillStyle = ['#786a56', '#9b8a72', '#b5482f', '#5e564b'][(s + i) % 4];
    const u = ((s * (i + 3) * 41) % 97) / 97; const v = ((s * (i + 9) * 59) % 89) / 89;
    g.beginPath(); g.moveTo(x + u * w, y + v * h); g.lineTo(x + u * w + 9, y + v * h + 2); g.lineTo(x + u * w + 4, y + v * h + 8); g.closePath(); g.fill();
  }
  // Açıkta kalan kiriş
  g.strokeStyle = '#3f3a33'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + w * 0.2, y + h * 0.3); g.lineTo(x + w * 0.74, y + h * 0.62); g.stroke();
}

// İnşaat: iskele, açık kat döşemesi, kum yığını, iş makinesi, vinç, bariyer
function sitework(g, r) {
  const { x, y, w, h, seed: s } = r;
  g.fillStyle = '#b79c6c'; g.fillRect(x, y, w, h);
  const bw = w * 0.66; const bh = h * 0.62;
  g.fillStyle = '#b7bbbf'; g.fillRect(x + 6, y + 6, bw, bh);
  g.fillStyle = '#8d9196'; for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) g.fillRect(x + 10 + (i * bw) / 4, y + 10 + (j * bh) / 3, 5, 5);
  g.strokeStyle = '#c4c9ce'; g.lineWidth = 1;
  for (let px = x + 2; px < x + bw + 12; px += 9) { g.beginPath(); g.moveTo(px, y + 2); g.lineTo(px, y + bh + 11); g.stroke(); }
  for (let py = y + 2; py < y + bh + 12; py += 9) { g.beginPath(); g.moveTo(x + 2, py); g.lineTo(x + bw + 11, py); g.stroke(); }
  g.strokeStyle = 'rgba(30,110,60,.55)'; g.lineWidth = 2.5; g.strokeRect(x + 2, y + 2, bw + 9, bh + 9);
  // Kum yığını
  const sx = x + w * 0.84; const sy = y + h * 0.28;
  const gr = g.createRadialGradient(sx - 3, sy - 3, 2, sx, sy, 17);
  gr.addColorStop(0, '#f0d9a0'); gr.addColorStop(1, '#c9a860');
  g.fillStyle = gr; g.beginPath(); g.arc(sx, sy, 15, 0, 7); g.fill();
  // İş makinesi
  const mx = x + w * 0.22 + (s % 30); const my = y + h - 22;
  g.fillStyle = '#23262b'; g.fillRect(mx - 2, my + 9, 30, 4); g.fillRect(mx - 2, my - 2, 30, 4);
  g.fillStyle = '#ffb020'; g.fillRect(mx, my, 26, 11);
  g.fillStyle = '#23303a'; g.fillRect(mx + 15, my + 2, 8, 7);
  g.strokeStyle = '#e8a010'; g.lineWidth = 3.4; g.beginPath(); g.moveTo(mx + 3, my + 5); g.lineTo(mx - 18, my - 10); g.lineTo(mx - 28, my + 2); g.stroke();
  // Vinç: kol şantiyeyi aşar
  const cx = x + w * 0.72; const cy = y + h * 0.7; const a = ((s % 8) / 8) * 6.283;
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 5; g.beginPath(); g.moveTo(cx + 8, cy + 10); g.lineTo(cx + 8 + Math.cos(a) * 80, cy + 10 + Math.sin(a) * 80); g.stroke();
  g.strokeStyle = '#ffd23f'; g.lineWidth = 4.5; g.beginPath(); g.moveTo(cx - Math.cos(a) * 20, cy - Math.sin(a) * 20); g.lineTo(cx + Math.cos(a) * 80, cy + Math.sin(a) * 80); g.stroke();
  g.strokeStyle = '#a87a10'; g.lineWidth = 1; for (let k = -2; k < 8; k++) { const q = k * 10; g.beginPath(); g.moveTo(cx + Math.cos(a) * q - Math.sin(a) * 2, cy + Math.sin(a) * q + Math.cos(a) * 2); g.lineTo(cx + Math.cos(a) * (q + 8) + Math.sin(a) * 2, cy + Math.sin(a) * (q + 8) - Math.cos(a) * 2); g.stroke(); }
  g.fillStyle = '#d0121b'; g.fillRect(cx - 5, cy - 5, 10, 10);
  // Bariyer
  for (let px = x; px < x + w - 6; px += 16) { g.fillStyle = (px - x) % 32 ? '#fff' : '#e8352e'; g.fillRect(px, y + h - 5, 16, 5); }
}

// Eski sanayi: testere dişi paslı çatı, baca, boru, sarnıç
function factory(g, r) {
  const { x, y, w, h, seed: s } = r;
  const rust = ['#8a5a3a', '#7a6650', '#6d6a60', '#94603f'][s % 4];
  const wall = Math.min(26, h * 0.3);
  g.fillStyle = '#5a5148'; g.fillRect(x, y + h - wall, w, wall);
  g.fillStyle = 'rgba(150,190,200,.45)'; for (let px = x + 5; px < x + w - 12; px += 15) g.fillRect(px, y + h - wall + 4, 11, 10);
  const rh = h - wall;
  const n = Math.max(2, Math.floor(rh / 20));
  for (let i = 0; i < n; i++) {
    const py = y + (i * rh) / n; const ph = rh / n;
    const gr = g.createLinearGradient(0, py, 0, py + ph);
    gr.addColorStop(0, shade(rust, 0.3)); gr.addColorStop(0.6, rust); gr.addColorStop(1, shade(rust, -0.45));
    g.fillStyle = gr; g.fillRect(x, py, w, ph);
    g.fillStyle = 'rgba(170,215,230,.5)'; g.fillRect(x + 4, py + ph - 4, w - 8, 3);
  }
  for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(50,25,10,.3)'; g.fillRect(x + ((s * (i + 3) * 31) % 100) / 100 * w, y + ((s * (i + 7) * 43) % 100) / 100 * rh, 10, 5); }
  // Bacalar
  const m = 1 + (s % 3);
  for (let i = 0; i < m; i++) {
    const cx = x + w * (0.2 + i * 0.3); const cy = y + rh * 0.3;
    g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.moveTo(cx - 5, cy); g.lineTo(cx + 44, cy + 54); g.lineTo(cx + 50, cy + 48); g.lineTo(cx + 5, cy - 3); g.closePath(); g.fill();
    g.fillStyle = '#a8553a'; g.beginPath(); g.arc(cx, cy, 9, 0, 7); g.fill();
    g.fillStyle = '#e8e4d8'; g.beginPath(); g.arc(cx, cy, 6.6, 0, 7); g.fill();
    g.fillStyle = '#1b1a18'; g.beginPath(); g.arc(cx, cy, 4.6, 0, 7); g.fill();
  }
  g.strokeStyle = '#5f6972'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 8, y + rh * 0.76); g.lineTo(x + w - 8, y + rh * 0.76); g.stroke();
}

export function paintBuilding2(g, r) {
  const S = BUILD;
  switch (r.style) {
    case S.APARTMENT: apartment2(g, r); break;
    case S.KOLEJ: kolej(g, r); break;
    case S.CHAIN: (CHAINS[r.brand] || CHAINS.pazarcik)(g, r); break;
    case S.BANK: bank2(g, r); break;
    case S.RUIN: ruin(g, r); return true;
    case S.SITEWORK: sitework(g, r); return true;
    case S.FACTORY: factory(g, r); return true;
    case S.SHOP: shop(g, r); break;
    case S.SKYSCRAPER: skyscraper(g, r); break;
    case S.RESIDENCE: residence2(g, r); break;
    case S.OFFICE: office(g, r); break;
    case S.HOTEL: hotel(g, r); break;
    case S.HOSPITAL: hospital2(g, r); break;
    case S.SCHOOL: school2(g, r); break;
    case S.MOSQUE: mosque2(g, r); break;
    case S.STADIUM: stadium(g, r); break;
    case S.SITE_BLOCK: siteBlock(g, r); break;
    case S.GECEKONDU: gecekondu(g, r); break;
    case S.VILLA: villa(g, r); break;
    case S.ISHANI: ishani(g, r); break;
    case S.SHOPROW: shoprow(g, r); break;
    case S.CAFE: cafe(g, r); break;
    default: return paintLandmark(g, r);
  }
  if (r.style === S.APARTMENT || r.style === S.SITE_BLOCK || r.style === S.RESIDENCE || r.style === S.HOTEL || r.style === S.ISHANI || r.style === S.SHOPROW) facadeBits(g, r);
  return true;
}

// Gölge boyu: bina yüksekliğine göre
export function shadowOf(r) {
  const S = BUILD;
  if (r.tall) return 1.4 + r.tall * 16;
  switch (r.style) {
    case S.SKYSCRAPER: return 4.6;
    case S.RESIDENCE: case S.OFFICE: return 3.2;
    case S.HOTEL: case S.KOLEJ: case S.HOSPITAL: return 2;
    case S.SITE_BLOCK: return 1.5 + (r.seed % 3) * 0.3;
    case S.APARTMENT: return 0.9 + (r.seed % 4) * 0.3;
    case S.GECEKONDU: case S.VILLA: case S.SHOP: return 0.45;
    case S.STADIUM: return 1;
    case S.MUZE: case S.OZEL_OKUL: return 2.2;
    case S.ANIT: return 2.6;
    case S.SELCUK_CAMI: case S.KONGRE: return 1.8;
    case S.AVM: return 1.5;
    case S.BEDESTEN: return 1.2;
    case S.SERVIS: return 0.8;
    case S.BAGEVI: return 0.6;
    default: return 1;
  }
}

export const NIGHT_LIGHTS = CONFIG.day;
