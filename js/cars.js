// Her araç modeli kendi çizimine sahiptir: gövde hattı, cam, far ve stop şekli modele özgüdür.
// Burun +x yönünde. Sprite'lar açılışta bir kez çizilir, oyun sırasında maliyeti yoktur.
import { rr, shade } from './art.js';

// Boya: metalik, parlak, mat. İki ton modelin kendi çizimindedir
function coat(g, H, color, finish = 'gloss') {
  const c = g.createLinearGradient(0, -H, 0, H);
  if (finish === 'matte') {
    c.addColorStop(0, shade(color, 0.08));
    c.addColorStop(1, shade(color, -0.22));
  } else if (finish === 'metal') {
    c.addColorStop(0, shade(color, 0.5));
    c.addColorStop(0.22, shade(color, 0.08));
    c.addColorStop(0.5, shade(color, 0.34));
    c.addColorStop(0.78, shade(color, -0.12));
    c.addColorStop(1, shade(color, -0.46));
  } else {
    c.addColorStop(0, shade(color, 0.4));
    c.addColorStop(0.35, color);
    c.addColorStop(1, shade(color, -0.42));
  }
  return c;
}

// Gövde hattı: [x, y] noktaları sadece üst yarı, alt yarı aynalanır
function hull(g, pts) {
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  for (let i = pts.length - 1; i >= 0; i--) g.lineTo(pts[i][0], -pts[i][1]);
  g.closePath();
}

// Yumuşak köşeli gövde hattı
function smooth(g, pts) {
  const all = [...pts, ...pts.slice().reverse().map(([x, y]) => [x, -y])];
  const n = all.length;
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const s = mid(all[n - 1], all[0]);
  g.beginPath();
  g.moveTo(s[0], s[1]);
  for (let i = 0; i < n; i++) {
    const m = mid(all[i], all[(i + 1) % n]);
    g.quadraticCurveTo(all[i][0], all[i][1], m[0], m[1]);
  }
  g.closePath();
}

function tyre(g, x, y, w = 10, h = 4.6, rim = '#c9d2dc') {
  g.fillStyle = '#0d0d11';
  rr(g, x - w / 2, y - h / 2, w, h, 1.4);
  g.fill();
  g.fillStyle = rim;
  g.fillRect(x - w * 0.28, y - h * 0.24, w * 0.56, h * 0.48);
}

function tyres(g, fx, rx, H, w, h, rim) {
  for (const y of [-H + 1.1, H - 1.1]) { tyre(g, fx, y, w, h, rim); tyre(g, rx, y, w, h, rim); }
}

function fillHull(g, paint, line = 'rgba(0,0,0,.55)') {
  g.fillStyle = paint;
  g.fill();
  g.strokeStyle = line;
  g.lineWidth = 0.7;
  g.stroke();
}

// Cam: ön, arka, yan camlar ve tavan
function cabin(g, f, r, wf, wr, roofF, roofR, wRoof, roof, glass = '#1b3044') {
  g.fillStyle = glass;
  hull(g, [[f, wf], [r, wr]]);
  g.fill();
  const shine = g.createLinearGradient(f, 0, f - 4, 0);
  shine.addColorStop(0, 'rgba(190,235,255,.75)');
  shine.addColorStop(1, 'rgba(190,235,255,0)');
  g.fillStyle = shine;
  hull(g, [[f, wf - 1], [f - 4, wf - 1.2]]);
  g.fill();
  g.fillStyle = roof;
  rr(g, roofR, -wRoof, roofF - roofR, wRoof * 2, 2.2);
  g.fill();
  g.fillStyle = 'rgba(255,255,255,.2)';
  rr(g, roofR + 1.5, -wRoof + 1.4, (roofF - roofR) * 0.62, wRoof * 0.42, 1);
  g.fill();
  // Kapı çizgileri
  g.strokeStyle = 'rgba(0,0,0,.28)';
  g.lineWidth = 0.5;
  const m = (roofF + roofR) / 2;
  g.beginPath();
  g.moveTo(m, -wf - 1); g.lineTo(m, -wRoof); g.moveTo(m, wf + 1); g.lineTo(m, wRoof);
  g.stroke();
}

function mirrors(g, x, H, color) {
  g.fillStyle = color;
  g.fillRect(x, -H - 1.4, 3, 1.8);
  g.fillRect(x, H - 0.4, 3, 1.8);
}

function lamps(g, x, ys, w, h, color) {
  g.fillStyle = color;
  for (const y of ys) { g.fillRect(x, y - h / 2, w, h); g.fillRect(x, -y - h / 2, w, h); }
}

// Drift Lab rozeti: küçük altıgen
function emblem(g, x) {
  g.save();
  g.translate(x, 0);
  g.strokeStyle = '#eef2f6';
  g.lineWidth = 0.6;
  g.beginPath();
  for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3; g[i ? 'lineTo' : 'moveTo'](Math.cos(a) * 2, Math.sin(a) * 2); }
  g.closePath();
  g.stroke();
  g.restore();
}

// --- Oyuncu modelleri ---
function atmaca(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.56, H - 0.6, 9, 4, '#9aa3ad');
// Klasik sedan
  hull(g, [[L, H * 0.84], [L - 1.5, H * 0.96], [-L + 1.5, H * 0.96], [-L, H * 0.84]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.2, -L * 0.54, H * 0.8, H * 0.76, L * 0.04, -L * 0.42, H * 0.64, coat(g, H, c, fin));
  g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 0.6;
  g.strokeRect(L * 0.3, -H * 0.72, L * 0.62, H * 1.44);
  // Krom tampon, ikili dikdörtgen far, siyah ızgara
  g.fillStyle = '#dde2e7'; g.fillRect(L - 0.5, -H * 0.9, 1.6, H * 1.8); g.fillRect(-L - 1, -H * 0.9, 1.6, H * 1.8);
  g.fillStyle = '#14161a'; g.fillRect(L - 2.6, -H * 0.4, 2.2, H * 0.8);
  lamps(g, L - 3, [H * 0.66], 2.8, H * 0.32, '#fff5c4');
  lamps(g, -L, [H * 0.62], 2, H * 0.44, '#d8232a');
  lamps(g, -L, [H * 0.3], 1.4, H * 0.2, '#f09a2a');
  mirrors(g, L * 0.16, H * 0.92, '#2a2d33');
}

function simsek(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.56, H - 0.2, 10, 5, '#e8c547');
  hull(g, [[L, H * 0.8], [L - 2, H * 0.97], [-L + 2, H * 0.97], [-L, H * 0.82]]);
  fillHull(g, coat(g, H, c, fin));
// Tuning sedan
  cabin(g, L * 0.24, -L * 0.48, H * 0.8, H * 0.74, L * 0.06, -L * 0.34, H * 0.62, coat(g, H, c, fin), '#07090d');
  g.fillStyle = a;
  g.fillRect(-L + 1, -H * 0.36, l - 2, H * 0.2);
  g.fillRect(-L + 1, H * 0.16, l - 2, H * 0.2);
  g.fillStyle = '#0a0a0d'; g.fillRect(L - 3, -H * 0.42, 3, H * 0.84);
  lamps(g, L - 2.6, [H * 0.56, H * 0.82], 2.6, H * 0.2, '#fff8d8');
  lamps(g, -L, [H * 0.58], 2, H * 0.5, '#ff2030');
  g.fillStyle = a;
  rr(g, -L - 3, -H - 1, 3.6, w + 2, 1); g.fill();
  g.fillStyle = '#0a0a0d'; g.fillRect(-L + 0.8, -H * 0.8, 1.2, H * 0.3); g.fillRect(-L + 0.8, H * 0.5, 1.2, H * 0.3);
  mirrors(g, L * 0.2, H * 0.92, '#0a0a0d');
}

function efe(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H - 0.8, 9, 4, '#dfe4e9');
// Köşeli 70ler sedanı
  hull(g, [[L, H * 0.88], [L - 1, H * 0.94], [-L + 1, H * 0.94], [-L, H * 0.88]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.16, -L * 0.5, H * 0.8, H * 0.8, 0, -L * 0.4, H * 0.68, coat(g, H, c, fin));
  g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(-L * 0.8, -H * 0.5, L * 0.22, H);
  g.fillStyle = '#e9edf1'; g.fillRect(L - 0.4, -H * 0.94, 1.8, H * 1.88); g.fillRect(-L - 1.4, -H * 0.94, 1.8, H * 1.88);
  g.fillStyle = '#16181c'; g.fillRect(L - 2.4, -H * 0.86, 2, H * 1.72);
  g.fillStyle = '#fff8d8';
  for (const y of [H * 0.32, H * 0.66]) { g.beginPath(); g.arc(L - 1.6, y, 1.9, 0, 7); g.arc(L - 1.6, -y, 1.9, 0, 7); g.fill(); }
  lamps(g, -L, [H * 0.66], 1.8, H * 0.36, '#d8232a');
  lamps(g, -L, [H * 0.34], 1.8, H * 0.2, '#e8862a');
  g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-L * 0.3, -H * 0.97, L * 0.7, 0.7); g.fillRect(-L * 0.3, H * 0.9, L * 0.7, 0.7);
  mirrors(g, L * 0.12, H * 0.94, '#c9ced4');
}

function cinar(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.62, -L * 0.56, H - 0.8, 9, 4, '#c9ced4');
// Yuvarlak klasik
  smooth(g, [[L + 1, 0], [L, H * 0.7], [L * 0.7, H], [0, H * 0.94], [-L * 0.7, H * 0.96], [-L - 1, H * 0.86], [-L - 1, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.08, -L * 0.56, H * 0.76, H * 0.66, -L * 0.1, -L * 0.42, H * 0.56, coat(g, H, c, fin), '#1a2c38');
  g.strokeStyle = a; g.lineWidth = 1.1;
  g.beginPath(); g.moveTo(L * 0.86, -H * 0.86); g.lineTo(-L * 0.9, -H * 0.8); g.moveTo(L * 0.86, H * 0.86); g.lineTo(-L * 0.9, H * 0.8); g.stroke();
  g.fillStyle = '#dfe4e9'; g.fillRect(L * 0.98, -H * 0.72, 1.8, H * 1.44);
  g.fillStyle = '#fff8d8';
  for (const y of [H * 0.54]) { g.beginPath(); g.arc(L - 0.6, y, 2.5, 0, 7); g.arc(L - 0.6, -y, 2.5, 0, 7); g.fill(); }
  g.fillStyle = '#d8232a';
  g.beginPath(); g.arc(-L, H * 0.56, 2.1, 0, 7); g.arc(-L, -H * 0.56, 2.1, 0, 7); g.fill();
  mirrors(g, L * 0.1, H * 0.9, '#d0d5da');
}

function marmara(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.56, H - 0.2, 10, 4.6, '#d7dde4');
// Modern aile sedanı
  smooth(g, [[L, 0], [L, H * 0.58], [L * 0.78, H * 0.96], [0, H], [-L * 0.8, H * 0.96], [-L, H * 0.7], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.34, -L * 0.6, H * 0.8, H * 0.7, L * 0.08, -L * 0.36, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#23272e'; g.fillRect(L - 1.4, -H * 0.36, 1.4, H * 0.72);
  emblem(g, L - 3.6);
  g.fillStyle = '#e8fbff';
  hull(g, [[L - 0.4, H * 0.42], [L * 0.8, H * 0.86]]); g.fill();
  lamps(g, -L, [H * 0.66], 2.6, H * 0.5, '#e01c2b');
  g.fillStyle = '#c9ced4'; g.fillRect(-L * 0.9, -H * 0.3, 0.8, H * 0.6);
  mirrors(g, L * 0.3, H * 0.96, shade(c, -0.2));
}

function liva(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.62, -L * 0.58, H - 0.2, 10, 4.8, '#e7eaee');
// Şehir hatchbacki
  smooth(g, [[L, 0], [L, H * 0.6], [L * 0.72, H * 1.0], [0, H * 0.9], [-L * 0.68, H * 1.02], [-L, H * 0.74], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.3, -L * 0.82, H * 0.76, H * 0.66, L * 0.06, -L * 0.68, H * 0.6, '#14171c');
  g.strokeStyle = '#eefaff'; g.lineWidth = 1.3;
  for (const s of [-1, 1]) { g.beginPath(); g.arc(L * 0.82, s * H * 0.7, 3.2, s > 0 ? 0.2 : -2.6, s > 0 ? 2.6 : -0.2); g.stroke(); }
  emblem(g, L - 3.4);
  g.fillStyle = '#e01c2b';
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(-L * 0.78, s * H * 0.94); g.lineTo(-L, s * H * 0.66); g.lineTo(-L, s * H * 0.34); g.lineTo(-L + 2.6, s * H * 0.56); g.closePath(); g.fill(); }
  mirrors(g, L * 0.28, H * 0.9, a);
}

function suv(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.58, H + 0.2, 12, 5.4, '#3a3f47');
  // Kompakt SUV, çift tonlu tavan, ince far, geniş siyah ızgara
  smooth(g, [[L, 0], [L, H * 0.76], [L * 0.86, H], [-L * 0.82, H], [-L, H * 0.8], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.3, -L * 0.8, H * 0.8, H * 0.74, L * 0.12, -L * 0.68, H * 0.66, '#101317');
  g.fillStyle = '#c6ccd4'; g.fillRect(-L * 0.66, -H * 0.76, L * 0.76, 1.1); g.fillRect(-L * 0.66, H * 0.76 - 1.1, L * 0.76, 1.1);
  g.fillStyle = '#0c0e12'; g.fillRect(L - 2.6, -H * 0.8, 2.6, H * 1.6);
  g.fillStyle = '#e8fbff'; g.fillRect(L - 2, -H * 0.82, 1.6, H * 0.34); g.fillRect(L - 2, H * 0.48, 1.6, H * 0.34);
  emblem(g, L - 1.4);
  lamps(g, -L, [H * 0.7], 1.6, H * 0.4, '#e01c2b');
  g.fillStyle = '#23272e'; g.fillRect(-L, -H * 0.42, 1.2, H * 0.84);
  mirrors(g, L * 0.26, H * 0.98, '#101317');
}

function bozkir(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.58, H + 0.6, 13, 6, '#20242a');
// Arazi aracı
  g.fillStyle = '#23272e';
  rr(g, -L - 0.5, -H - 1, l + 1, w + 2, 4); g.fill();
  hull(g, [[L - 1, H * 0.72], [L - 3, H * 0.86], [-L + 3, H * 0.86], [-L + 1, H * 0.72]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.3, -L * 0.8, H * 0.72, H * 0.7, L * 0.14, -L * 0.66, H * 0.56, coat(g, H, c, fin));
  g.fillStyle = '#d7dde4'; g.fillRect(-L * 0.74, -H * 0.72, L * 0.96, 1.6); g.fillRect(-L * 0.74, H * 0.72 - 1.6, L * 0.96, 1.6);
  g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 0.7;
  g.beginPath(); g.moveTo(L * 0.92, -H * 0.3); g.lineTo(L * 0.4, -H * 0.36); g.moveTo(L * 0.92, H * 0.3); g.lineTo(L * 0.4, H * 0.36); g.stroke();
  g.fillStyle = '#c2c8cf'; g.fillRect(L - 1.2, -H * 0.5, 2, H); g.fillRect(-L - 1, -H * 0.5, 2, H);
  lamps(g, L - 2.4, [H * 0.7], 2.4, H * 0.34, '#fff5c4');
  g.fillStyle = '#e01c2b';
  for (const s of [-1, 1]) { g.fillRect(-L, s * H * 0.56 - 1, 1.6, 3.4); g.fillRect(-L + 2, s * H * 0.76 - 1, 1.6, 2); }
  mirrors(g, L * 0.26, H * 0.98, '#23272e');
}

function elektra(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.62, -L * 0.62, H + 0.1, 12, 5.2, '#a7b0ba');
// Elektrikli crossover
  smooth(g, [[L + 0.4, 0], [L, H * 0.8], [L * 0.84, H], [-L * 0.8, H], [-L, H * 0.84], [-L - 0.4, 0]]);
  fillHull(g, coat(g, H, c, fin));
  g.fillStyle = '#070a0e';
  hull(g, [[L * 0.36, H * 0.8], [-L * 0.82, H * 0.74]]);
  g.fill();
  g.fillStyle = 'rgba(120,190,230,.2)';
  hull(g, [[L * 0.3, H * 0.62], [-L * 0.2, H * 0.6]]);
  g.fill();
  g.fillStyle = '#e8e9ea'; g.fillRect(-L * 0.74, -H * 0.82, L * 1.06, 0.8); g.fillRect(-L * 0.74, H * 0.82 - 0.8, L * 1.06, 0.8);
  // Lale motifli ön: ince LED ve ince siyah bant
  g.fillStyle = '#e4fbff'; g.fillRect(L - 1.3, -H * 0.86, 1.5, H * 1.72);
  g.fillStyle = '#0c0f13'; g.fillRect(L - 3.6, -H * 0.56, 2, H * 1.12);
  g.strokeStyle = '#e4fbff'; g.lineWidth = 0.7;
  g.beginPath(); g.moveTo(L - 4.2, 0); g.lineTo(L - 6.6, -2); g.moveTo(L - 4.2, 0); g.lineTo(L - 6.6, 2); g.stroke();
  g.fillStyle = '#ff1f33'; g.fillRect(-L - 0.3, -H * 0.9, 1.5, H * 1.8);
  g.fillStyle = '#ffd6d6'; g.fillRect(-L - 0.3, -0.4, 1.5, 0.8);
  mirrors(g, L * 0.24, H * 0.98, '#070a0e');
}

function moto(g, l, w, c, a, fin) {
  const L = l / 2;
  g.fillStyle = '#0f0f13';
  rr(g, L * 0.36, -2.3, 13, 4.6, 2); g.fill();
  rr(g, -L - 0.5, -2.8, 14, 5.6, 2); g.fill();
  // Spor motor: dar kaporta, depo, sele, gidon
  smooth(g, [[L * 0.92, 0], [L * 0.5, 4.8], [0, 5.4], [-L * 0.3, 3.4], [-L * 0.74, 1.8], [-L * 0.74, 0]]);
  fillHull(g, coat(g, 5, c, fin));
  g.fillStyle = a;
  g.fillRect(L * 0.1, -1, L * 0.62, 2);
  g.fillStyle = '#1c2632'; g.fillRect(L * 0.46, -3.4, 3, 6.8);
  g.strokeStyle = '#c9d2dc'; g.lineWidth = 1.7;
  g.beginPath(); g.moveTo(L * 0.34, -7.4); g.lineTo(L * 0.34, 7.4); g.stroke();
  g.fillStyle = '#20252f';
  g.beginPath(); g.ellipse(-3, 0, 5.4, 6.6, 0, 0, 7); g.fill();
  g.fillStyle = a;
  g.beginPath(); g.arc(1, 0, 4, 0, 7); g.fill();
  g.fillStyle = '#16212e'; g.fillRect(2.6, -2.6, 2.2, 5.2);
  g.fillStyle = '#c9d2dc'; g.fillRect(-L * 0.74, 3, 8, 1.6);
  g.fillStyle = '#fff6c9'; g.fillRect(L - 1.4, -1.8, 2.4, 3.6);
  g.fillStyle = '#ff2733'; g.fillRect(-L - 1, -2, 1.6, 4);
}

// --- NPC modelleri: özgün tasarımlar ---
function bavar(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H, 10, 4.6, '#b6bdc5');
  smooth(g, [[L, 0], [L, H * 0.74], [L * 0.8, H], [-L * 0.8, H * 0.98], [-L, H * 0.76], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.2, -L * 0.6, H * 0.8, H * 0.72, 0, -L * 0.42, H * 0.6, coat(g, H, c, fin));
  // Alçak tek parça ağız, ince far
  g.fillStyle = '#0d0f12';
  rr(g, L - 1.8, -H * 0.5, 1.6, H, 0.6); g.fill();
  emblem(g, L * 0.74);
  lamps(g, L - 3.4, [H * 0.72], 3, H * 0.28, '#eafcff');
  lamps(g, -L, [H * 0.68], 2.2, H * 0.44, '#d8132a');
  mirrors(g, L * 0.16, H * 0.96, shade(c, -0.3));
}

function aurum(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.58, H, 10, 4.6, '#d6dbe1');
  smooth(g, [[L, 0], [L, H * 0.8], [L * 0.86, H], [-L * 0.86, H], [-L, H * 0.8], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.28, -L * 0.66, H * 0.8, H * 0.7, L * 0.04, -L * 0.46, H * 0.6, coat(g, H, c, fin));
  // Üstte ince şerit, altta ağ panel, çift stop
  g.fillStyle = '#c4cad2'; g.fillRect(L - 2.6, -H * 0.5, 0.8, H);
  g.fillStyle = '#0d0f12'; g.fillRect(L - 1.6, -H * 0.5, 1.6, H);
  emblem(g, L - 3.6);
  g.fillStyle = '#eafcff';
  hull(g, [[L - 0.4, H * 0.58], [L * 0.8, H * 0.92]]); g.fill();
  g.fillStyle = '#d8132a'; g.fillRect(-L, -H * 0.84, 1.4, H * 1.68);
  mirrors(g, L * 0.22, H * 0.98, shade(c, -0.3));
}

function stella(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.62, -L * 0.6, H, 10, 4.6, '#e2e6ea');
  smooth(g, [[L + 0.4, 0], [L, H * 0.7], [L * 0.76, H], [-L * 0.76, H], [-L, H * 0.72], [-L - 0.4, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.16, -L * 0.62, H * 0.8, H * 0.72, -L * 0.04, -L * 0.46, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#c9ced4'; g.fillRect(L - 2, -H * 0.4, 2.2, H * 0.8);
  g.strokeStyle = '#0d0f12'; g.lineWidth = 0.5;
  for (const y of [-H * 0.22, 0, H * 0.22]) { g.beginPath(); g.moveTo(L - 2, y); g.lineTo(L, y); g.stroke(); }
  emblem(g, L * 0.82);
  lamps(g, L - 3.6, [H * 0.68], 3.2, H * 0.3, '#eafcff');
  lamps(g, -L, [H * 0.66], 2, H * 0.5, '#c81425');
  g.fillStyle = '#dfe4e9'; g.fillRect(-L * 0.8, -H * 0.36, 0.8, H * 0.72);
  mirrors(g, L * 0.12, H * 0.96, shade(c, -0.3));
}

function volta(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.6, H, 10, 4.6, '#c0c7cf');
  smooth(g, [[L, 0], [L, H * 0.78], [L * 0.8, H], [-L * 0.8, H], [-L, H * 0.84], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.26, -L * 0.86, H * 0.78, H * 0.72, L * 0.04, -L * 0.7, H * 0.62, coat(g, H, c, fin));
  g.fillStyle = '#0d0f12'; g.fillRect(L - 1.4, -H * 0.5, 1.4, H);
  emblem(g, L - 3);
  lamps(g, L - 2.6, [H * 0.72], 2.6, H * 0.26, '#eafcff');
  lamps(g, -L, [H * 0.72], 1.8, H * 0.34, '#d8132a');
  mirrors(g, L * 0.22, H * 0.96, shade(c, -0.3));
}

function pusula(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H, 10, 4.6, '#aeb6bf');
  smooth(g, [[L, 0], [L, H * 0.5], [L * 0.76, H * 0.98], [-L * 0.74, H], [-L, H * 0.8], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.32, -L * 0.8, H * 0.78, H * 0.68, L * 0.06, -L * 0.64, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#0d0f12'; g.fillRect(L - 2.2, -H * 0.5, 2.2, H);
  emblem(g, L - 3.6);
  g.fillStyle = '#eafcff'; hull(g, [[L - 0.4, H * 0.5], [L * 0.76, H * 0.9]]); g.fill();
  g.fillStyle = '#d8132a'; g.fillRect(-L, -H * 0.76, 1.6, H * 0.5); g.fillRect(-L, H * 0.26, 1.6, H * 0.5);
  mirrors(g, L * 0.26, H * 0.96, shade(c, -0.3));
}

function dalga(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H, 10, 4.6, '#c7ced6');
  smooth(g, [[L + 0.5, 0], [L, H * 0.62], [L * 0.8, H], [-L * 0.8, H], [-L, H * 0.68], [-L - 0.5, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.3, -L * 0.62, H * 0.8, H * 0.72, L * 0.06, -L * 0.42, H * 0.62, coat(g, H, c, fin));
  g.fillStyle = '#0d0f12'; rr(g, L - 2.6, -H * 0.5, 2.8, H, 1); g.fill();
  g.strokeStyle = '#8a929b'; g.lineWidth = 0.4;
  for (let y = -H * 0.4; y < H * 0.45; y += 1.6) { g.beginPath(); g.moveTo(L - 2.4, y); g.lineTo(L, y); g.stroke(); }
  emblem(g, L - 3.8);
  g.fillStyle = '#eafcff'; g.fillRect(L * 0.76, -H * 0.9, L * 0.22, 1.1); g.fillRect(L * 0.76, H * 0.9 - 1.1, L * 0.22, 1.1);
  g.fillStyle = '#d8132a'; g.fillRect(-L, -H * 0.78, 1.2, H * 1.56);
  mirrors(g, L * 0.26, H * 0.96, shade(c, -0.3));
}

function lale(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H, 10, 4.6, '#bcc4cc');
  smooth(g, [[L, 0], [L, H * 0.66], [L * 0.76, H * 0.98], [-L * 0.8, H], [-L, H * 0.7], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.28, -L * 0.6, H * 0.78, H * 0.7, L * 0.04, -L * 0.42, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#16181c'; g.fillRect(L - 1.6, -H * 0.42, 1.6, H * 0.84);
  emblem(g, L - 3.2);
  lamps(g, L - 3, [H * 0.7], 2.8, H * 0.3, '#eafcff');
  lamps(g, -L, [H * 0.68], 2.2, H * 0.42, '#d8132a');
  mirrors(g, L * 0.24, H * 0.96, shade(c, -0.3));
}

function vadi(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.58, H, 9.6, 4.4, '#a9b2bb');
  smooth(g, [[L, 0], [L, H * 0.74], [L * 0.84, H * 0.96], [-L * 0.84, H * 0.96], [-L, H * 0.74], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.26, -L * 0.54, H * 0.78, H * 0.72, L * 0.04, -L * 0.36, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#c9ced4'; g.fillRect(L - 1.4, -H * 0.3, 1.4, H * 0.6);
  emblem(g, L - 3);
  lamps(g, L - 2.6, [H * 0.68], 2.6, H * 0.34, '#fff5c4');
  lamps(g, -L, [H * 0.66], 2, H * 0.4, '#d8132a');
  mirrors(g, L * 0.22, H * 0.94, shade(c, -0.3));
}

function kamyonet(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.6, H + 0.2, 11, 5, '#6d747c');
  g.fillStyle = coat(g, H, c, fin);
  rr(g, -L, -H, l, w, 4); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = 0.7; g.stroke();
  cabin(g, L * 0.44, -L * 0.04, H * 0.8, H * 0.78, L * 0.3, L * 0.02, H * 0.66, coat(g, H, c, fin));
  g.fillStyle = '#25282e'; rr(g, -L + 2, -H + 2.4, L * 0.92, w - 4.8, 1.6); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 0.7;
  for (let x = -L + 5; x < -L * 0.1; x += 4) { g.beginPath(); g.moveTo(x, -H + 3); g.lineTo(x, H - 3); g.stroke(); }
  g.fillStyle = '#0d0f12'; g.fillRect(L - 2, -H * 0.6, 2, H * 1.2);
  lamps(g, L - 2, [H * 0.78], 2, H * 0.28, '#fff5c4');
  lamps(g, -L, [H * 0.74], 1.6, H * 0.36, '#d8132a');
  mirrors(g, L * 0.3, H * 0.98, '#16181c');
}

// Gölge R (gizli motosiklet): dar, uzun, keskin kaporta; neon şeritler, ışıklı jantlar, çift egzoz
function golge(g, l, w, c, a, fin) {
  const L = l / 2;
  // Işıklı jantlar: neon halka
  for (const x of [L * 0.62, -L * 0.7]) {
    g.fillStyle = '#07080c'; rr(g, x - 6.5, -2.6, 13, 5.2, 2.2); g.fill();
    g.strokeStyle = a; g.lineWidth = 1.1; rr(g, x - 6, -2.2, 12, 4.4, 2); g.stroke();
  }
  smooth(g, [[L * 1.02, 0], [L * 0.62, 3.6], [L * 0.1, 5.6], [-L * 0.42, 4.2], [-L * 0.86, 2.4], [-L * 0.95, 0]]);
  fillHull(g, coat(g, 5.6, c, fin), 'rgba(0,0,0,.8)');
  // Neon kenar şeritleri ve sırt çizgisi
  g.strokeStyle = a; g.lineWidth = 1;
  g.beginPath(); g.moveTo(L * 0.92, 0.6); g.lineTo(L * 0.2, 4.4); g.lineTo(-L * 0.6, 3.2); g.moveTo(L * 0.92, -0.6); g.lineTo(L * 0.2, -4.4); g.lineTo(-L * 0.6, -3.2); g.stroke();
  g.fillStyle = a; g.fillRect(-L * 0.1, -0.7, L * 0.8, 1.4);
  // Cam grenaj, sele, gidon
  g.fillStyle = '#1b2a3a'; g.beginPath(); g.ellipse(L * 0.42, 0, 3.4, 3, 0, 0, 7); g.fill();
  g.fillStyle = '#0b0c10'; rr(g, -L * 0.42, -2.6, 8, 5.2, 2); g.fill();
  g.strokeStyle = '#c9d2dc'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(L * 0.3, -6.6); g.lineTo(L * 0.3, 6.6); g.stroke();
  g.fillStyle = a; g.fillRect(L * 0.3 - 1, -7.6, 2, 2); g.fillRect(L * 0.3 - 1, 5.6, 2, 2);
  // Çift egzoz, arka stop, ön far
  g.fillStyle = '#9aa3ad'; g.fillRect(-L - 1.5, -3.6, 5, 1.6); g.fillRect(-L - 1.5, 2, 5, 1.6);
  g.fillStyle = '#ff2346'; g.fillRect(-L * 0.98, -1.4, 1.6, 2.8);
  g.fillStyle = '#e8fbff'; g.fillRect(L - 0.6, -1.6, 2, 3.2);
  lamps(g, L - 1, [0], 2.4, 2.6, '#e6fbff');
}

const MODELS = {
  atmaca, motor: moto, moto, golge, simsek, efe, cinar, marmara, liva, suv, granit: suv, bozkir, elektra,
  bavar, aurum, stella, volta, pusula, dalga, lale, vadi, kamyonet,
};

export const MODEL_NAMES = Object.keys(MODELS);

export function paintTr(g, len, wid, body, accent, shape, finish = 'gloss') {
  MODELS[shape](g, len, wid, body, accent, finish);
}

// Garaj için yandan profil: tanınmayı asıl bu sağlar.
// body: gövde hattı, glass: cam, w: tekerlek konumları (0-1), h: göreli yükseklik
const SIDE = {
  atmaca: { body: [[0, 62], [3, 50], [30, 46], [39, 18], [68, 18], [80, 44], [100, 48], [100, 64]], glass: [[37, 44], [44, 23], [57, 23], [57, 44]], glass2: [[60, 44], [60, 23], [67, 23], [76, 44]], w: [20, 79] },
  motor: null,
  granit: { body: [[0, 60], [2, 44], [24, 34], [36, 12], [82, 10], [96, 30], [100, 38], [100, 66]], glass: [[35, 34], [44, 17], [60, 17], [60, 34]], glass2: [[63, 34], [63, 17], [80, 15], [90, 32]], w: [20, 80], tall: 1 },
  elektra: { body: [[0, 62], [1, 46], [18, 36], [36, 10], [80, 10], [98, 30], [100, 42], [100, 66]], glass: [[30, 35], [42, 14], [62, 14], [62, 35]], glass2: [[65, 35], [65, 14], [79, 14], [92, 32]], w: [18, 82], tall: 1 },
  simsek: { body: [[0, 62], [3, 50], [30, 46], [40, 19], [66, 19], [78, 42], [100, 46], [100, 64]], glass: [[38, 44], [45, 24], [57, 24], [57, 44]], glass2: [[60, 44], [60, 24], [66, 24], [74, 44]], w: [20, 79], wing: 1 },
  cinar: { body: [[0, 60], [2, 50], [36, 44], [46, 22], [66, 22], [84, 44], [100, 46], [100, 62]], glass: [[44, 42], [50, 26], [60, 26], [60, 42]], glass2: [[63, 42], [63, 26], [68, 26], [78, 42]], w: [20, 81] },
  efe: { body: [[0, 64], [1, 48], [29, 45], [37, 16], [69, 16], [79, 43], [100, 46], [100, 66]], glass: [[35, 43], [41, 21], [56, 21], [56, 43]], glass2: [[59, 43], [59, 21], [67, 21], [75, 43]], w: [20, 79] },
  marmara: { body: [[0, 60], [2, 46], [26, 40], [40, 15], [70, 15], [86, 38], [100, 40], [100, 64]], glass: [[36, 38], [45, 19], [57, 19], [57, 38]], glass2: [[60, 38], [60, 19], [69, 19], [80, 38]], w: [20, 80] },
  liva: { body: [[0, 60], [2, 44], [24, 37], [40, 12], [78, 13], [97, 36], [100, 42], [100, 64]], glass: [[34, 36], [45, 16], [60, 16], [60, 36]], glass2: [[63, 36], [63, 16], [77, 17], [90, 34]], w: [20, 80] },
  bozkir: { body: [[0, 60], [1, 40], [22, 34], [33, 10], [85, 9], [98, 30], [100, 38], [100, 62]], glass: [[31, 33], [39, 15], [57, 15], [57, 33]], glass2: [[60, 33], [60, 15], [83, 14], [92, 32]], w: [19, 81], tall: 1, rails: 1, clad: 1 },
};

export function paintSide(g, W, H, spec) {
  g.clearRect(0, 0, W, H);
  const pad = W * 0.06;
  const k = (W - pad * 2) / 100;
  const y0 = H * 0.86;
  const scaleY = k * 0.62;
  const px = (x) => pad + (100 - x) * k; // Burun sağda
  const py = (y) => y0 - (66 - y) * scaleY;
  g.fillStyle = 'rgba(0,0,0,.4)';
  g.beginPath(); g.ellipse(W / 2, y0 + 5, W * 0.42, 6, 0, 0, 7); g.fill();
  if (spec.shape === 'moto') {
    const col = spec.color;
    g.strokeStyle = '#15171c'; g.lineWidth = W * 0.022;
    for (const x of [0.24, 0.76]) { g.beginPath(); g.arc(W * x, y0 - W * 0.09, W * 0.09, 0, 7); g.stroke(); }
    g.fillStyle = col;
    g.beginPath();
    g.moveTo(W * 0.2, y0 - W * 0.2); g.lineTo(W * 0.42, y0 - W * 0.26); g.lineTo(W * 0.66, y0 - W * 0.26);
    g.lineTo(W * 0.8, y0 - W * 0.34); g.lineTo(W * 0.8, y0 - W * 0.14); g.lineTo(W * 0.56, y0 - W * 0.07); g.lineTo(W * 0.4, y0 - W * 0.12);
    g.closePath(); g.fill();
    g.fillStyle = '#1b1e24'; g.fillRect(W * 0.22, y0 - W * 0.235, W * 0.2, W * 0.03);
    g.strokeStyle = '#c9d2dc'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(W * 0.76, y0 - W * 0.09); g.lineTo(W * 0.69, y0 - W * 0.33); g.stroke();
    return;
  }
  const s = SIDE[spec.shape];
  const grad = g.createLinearGradient(0, py(s.body[3][1]), 0, y0);
  grad.addColorStop(0, shade(spec.color, 0.42));
  grad.addColorStop(0.5, spec.color);
  grad.addColorStop(1, shade(spec.color, -0.45));
  g.beginPath();
  s.body.forEach(([x, y], i) => (i ? g.lineTo(px(x), py(y)) : g.moveTo(px(x), py(y))));
  g.closePath();
  g.fillStyle = grad;
  g.fill();
  g.lineJoin = 'round';
  g.strokeStyle = grad;
  g.lineWidth = 4;
  g.stroke();
  if (s.clad) { g.fillStyle = '#23272e'; g.fillRect(px(100), py(56), px(0) - px(100), py(66) - py(56)); }
  g.fillStyle = '#1b2d3f';
  for (const p of [s.glass, s.glass2]) {
    g.beginPath();
    p.forEach(([x, y], i) => (i ? g.lineTo(px(x), py(y)) : g.moveTo(px(x), py(y))));
    g.closePath();
    g.fill();
  }
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(px(0), py(52)); g.lineTo(px(100), py(52)); g.stroke();
  if (s.rails) { g.strokeStyle = '#d7dde4'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(px(36), py(s.body[3][1] - 3)); g.lineTo(px(84), py(s.body[3][1] - 3)); g.stroke(); }
  if (s.wing) { g.fillStyle = spec.accent; g.fillRect(px(98), py(36), px(84) - px(98), 5); g.fillRect(px(94), py(36), 3, py(46) - py(36)); }
  g.fillStyle = spec.shape === 'elektra' ? '#e4fbff' : '#fff5c4';
  g.fillRect(px(3) - 7, py(49), 7, 5);
  g.fillStyle = '#e01c2b';
  g.fillRect(px(100), py(47), 6, 6);
  for (const x of s.w) {
    const cx = px(x);
    const cy = y0 - k * 3;
    const r = k * (s.tall ? 9.6 : 8.2);
    g.fillStyle = '#0f1014';
    g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill();
    g.fillStyle = '#c9d2dc';
    g.beginPath(); g.arc(cx, cy, r * 0.56, 0, 7); g.fill();
    g.fillStyle = '#6d7782';
    g.beginPath(); g.arc(cx, cy, r * 0.2, 0, 7); g.fill();
  }
}
