// Anıt içeriği: PLAY STORE sürümü (kurgusal). Şehir meydanındaki kurgusal bir heykel: gerçek kişi, fotoğraf,
// gerçek metin ya da gerçek bayrak yoktur. Her şey kodla çizilir, yazı yoktur (dil gerektirmez).
// Arkadaş sürümünde bu dosyanın yerine names/anit-gercek.js konur (tools/flavor.mjs, tools/serve.mjs).
// Not: js/app.file.js tüm modülleri tek kapsamda birleştirir; buradaki adlar MEMD ön ekiyle benzersizdir.
export const MEM_REAL = false;
export const MEM_IMAGES = [];
export const MEM_TITLE = '';
export const MEM_YEAR = '';
export const MEM_TEXT = '';
export const MEM_MOTTO = '';
export const MEM_SIGNATURE = '';

const MEMD_TAU = Math.PI * 2;

// Kurgusal şehir bayrağı (3:2): lacivert zemin, gönder tarafında beyaz şerit, altın sekiz köşeli pusula yıldızı
export function paintMemFlag(g, w, h, mirror = false) {
  g.save();
  if (mirror) { g.translate(w, 0); g.scale(-1, 1); }
  g.scale(w / 300, h / 200);
  g.fillStyle = '#1d4f91'; g.fillRect(0, 0, 300, 200);
  g.fillStyle = '#f4f1e6'; g.fillRect(0, 0, 70, 200);
  g.fillStyle = '#2f9e8f'; g.fillRect(70, 0, 10, 200);
  memdStar(g, 190, 100, 62, 26, 8, '#f2c14e');
  g.fillStyle = '#1d4f91'; g.beginPath(); g.arc(190, 100, 14, 0, MEMD_TAU); g.fill();
  g.restore();
}

function memdStar(g, x, y, ro, ri, n, color) {
  g.fillStyle = color;
  g.beginPath();
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? ri : ro;
    const a = (i / (n * 2)) * MEMD_TAU - Math.PI / 2;
    g[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * r, y + Math.sin(a) * r);
  }
  g.closePath(); g.fill();
}

// Bronz dolgu: üstten ışık alan sıcak metal
function memdBronze(g, x, y, w, h) {
  const gr = g.createLinearGradient(x, y, x + w, y + h);
  gr.addColorStop(0, '#e2b06a'); gr.addColorStop(0.35, '#b07a3c'); gr.addColorStop(0.7, '#7a4f24'); gr.addColorStop(1, '#4e3116');
  return gr;
}

// Defne dalı kabartması: eğri sap boyunca karşılıklı yapraklar
function memdLaurel(g, x, y, len, ang, size, color) {
  g.save();
  g.translate(x, y); g.rotate(ang);
  g.strokeStyle = color; g.lineWidth = Math.max(1, size * 0.18);
  g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(len * 0.5, -len * 0.08, len, 0); g.stroke();
  g.fillStyle = color;
  const n = Math.max(3, Math.round(len / (size * 1.25)));
  for (let i = 1; i <= n; i++) {
    const t = i / (n + 0.5);
    const px = len * t; const py = -len * 0.08 * 4 * t * (1 - t);
    for (const s of [-1, 1]) {
      g.save(); g.translate(px, py); g.rotate(s * 0.75 - 0.25);
      g.beginPath(); g.ellipse(size * 0.55, 0, size * 0.62, size * 0.26, 0, 0, MEMD_TAU); g.fill();
      g.restore();
    }
  }
  g.restore();
}

// Çerçeve içi kurgusal heykel ve kabartmalar. f: çerçeve iç alanı {x, y, w, h}, i: 0 orta (heykel), 1-2 yan, 3 alt
export function paintMemStatue(g, f, i, detail) {
  g.save();
  g.beginPath(); g.rect(f.x, f.y, f.w, f.h); g.clip();
  // Koyu taş niş, ortası hafif aydınlık
  const bg = g.createRadialGradient(f.x + f.w / 2, f.y + f.h * 0.4, 4, f.x + f.w / 2, f.y + f.h * 0.5, Math.max(f.w, f.h) * 0.75);
  bg.addColorStop(0, '#4a4651'); bg.addColorStop(1, '#1c1b20');
  g.fillStyle = bg; g.fillRect(f.x, f.y, f.w, f.h);
  const cx = f.x + f.w / 2;
  if (i === 0) {
    // Meşale taşıyan kurgusal figür: yüz ayrıntısı yok, sade biçimler
    const u = Math.min(f.w, f.h) / 100;
    const base = f.y + f.h - 6 * u;
    // Kaide
    g.fillStyle = '#9b927f'; g.fillRect(cx - 26 * u, base - 12 * u, 52 * u, 12 * u);
    g.fillStyle = '#c9bfa9'; g.fillRect(cx - 26 * u, base - 12 * u, 52 * u, 2.4 * u);
    g.fillStyle = '#7c7464'; g.fillRect(cx - 30 * u, base - 3 * u, 60 * u, 3 * u);
    const top = base - 12 * u;
    g.fillStyle = memdBronze(g, cx - 20 * u, top - 70 * u, 40 * u, 70 * u);
    // Uzun pelerin / gövde
    g.beginPath();
    g.moveTo(cx - 15 * u, top); g.lineTo(cx - 9 * u, top - 46 * u); g.lineTo(cx + 9 * u, top - 46 * u); g.lineTo(cx + 15 * u, top);
    g.closePath(); g.fill();
    // Omuzlar ve baş (yüz yok)
    g.beginPath(); g.ellipse(cx, top - 47 * u, 11 * u, 4.5 * u, 0, 0, MEMD_TAU); g.fill();
    g.beginPath(); g.arc(cx, top - 56 * u, 6.2 * u, 0, MEMD_TAU); g.fill();
    // Yukarı kalkan kol ve meşale
    g.lineCap = 'round'; g.strokeStyle = memdBronze(g, cx, top - 80 * u, 16 * u, 34 * u); g.lineWidth = 4.6 * u;
    g.beginPath(); g.moveTo(cx + 9 * u, top - 46 * u); g.lineTo(cx + 15 * u, top - 64 * u); g.lineTo(cx + 16 * u, top - 74 * u); g.stroke();
    g.fillStyle = '#6b4520'; g.fillRect(cx + 13.6 * u, top - 84 * u, 5 * u, 11 * u);
    const fl = g.createRadialGradient(cx + 16 * u, top - 88 * u, 0.5 * u, cx + 16 * u, top - 88 * u, 9 * u);
    fl.addColorStop(0, '#fff6c8'); fl.addColorStop(0.45, '#ffb340'); fl.addColorStop(1, 'rgba(255,90,20,0)');
    g.fillStyle = fl; g.beginPath(); g.ellipse(cx + 16 * u, top - 89 * u, 6 * u, 9.5 * u, 0, 0, MEMD_TAU); g.fill();
    // Öteki kolda kitap
    g.strokeStyle = memdBronze(g, cx - 20 * u, top - 46 * u, 12 * u, 20 * u);
    g.beginPath(); g.moveTo(cx - 9 * u, top - 45 * u); g.lineTo(cx - 14 * u, top - 32 * u); g.stroke();
    g.fillStyle = '#c99a55'; g.fillRect(cx - 19 * u, top - 34 * u, 10 * u, 7 * u);
    g.fillStyle = '#6b4520'; g.fillRect(cx - 14.4 * u, top - 34 * u, 0.9 * u, 7 * u);
    // Bronz üzerinde parlak çizgi
    if (detail) {
      g.strokeStyle = 'rgba(255,236,190,.45)'; g.lineWidth = 1.2 * u;
      g.beginPath(); g.moveTo(cx - 7 * u, top - 44 * u); g.lineTo(cx - 12 * u, top - 2 * u); g.stroke();
    }
    // Defne dalları kaidenin iki yanında
    memdLaurel(g, cx - 24 * u, base - 16 * u, 22 * u, -2.5, 4.2 * u, '#c79a52');
    memdLaurel(g, cx + 24 * u, base - 16 * u, 22 * u, -0.64, 4.2 * u, '#c79a52');
  } else if (i === 1 || i === 2) {
    // Yan kabartmalar: dikey defne dalı ve küçük yıldız
    const s = Math.min(f.w, f.h / 2) / 30;
    memdLaurel(g, cx + (i === 1 ? -6 : 6) * s, f.y + f.h - 8 * s, f.h * 0.8, -Math.PI / 2 + (i === 1 ? 0.08 : -0.08), 4 * s, '#c79a52');
    memdStar(g, cx, f.y + 10 * s, 6 * s, 2.6 * s, 8, '#e2b06a');
  } else {
    // Alt kabartma: halka içinde pusula yıldızı
    const r = Math.min(f.w, f.h) * 0.36;
    const cy = f.y + f.h / 2;
    g.strokeStyle = '#c79a52'; g.lineWidth = Math.max(1.5, r * 0.08);
    g.beginPath(); g.arc(cx, cy, r, 0, MEMD_TAU); g.stroke();
    memdStar(g, cx, cy, r * 0.82, r * 0.3, 8, '#d8a85e');
    g.fillStyle = '#4e3116'; g.beginPath(); g.arc(cx, cy, r * 0.16, 0, MEMD_TAU); g.fill();
  }
  g.restore();
}

// Levha: yazı yerine defne çelengi içinde pusula yıldızı. p: levha {x, y, w, h}
export function paintMemEmblem(g, p) {
  const cx = p.x + p.w / 2; const cy = p.y + p.h / 2;
  const r = p.h * 0.36;
  memdLaurel(g, cx - r * 0.25, cy + r * 0.95, r * 1.9, -2.2, r * 0.22, '#8a6a2e');
  memdLaurel(g, cx + r * 0.25, cy + r * 0.95, r * 1.9, -0.94, r * 0.22, '#8a6a2e');
  memdStar(g, cx, cy, r * 0.62, r * 0.24, 8, '#b8892e');
  g.fillStyle = '#f2ead8'; g.beginPath(); g.arc(cx, cy, r * 0.12, 0, MEMD_TAU); g.fill();
  g.fillStyle = '#b8892e';
  g.fillRect(p.x + p.w * 0.12, cy - 1, p.w * 0.16, 2);
  g.fillRect(p.x + p.w * 0.72, cy - 1, p.w * 0.16, 2);
}
