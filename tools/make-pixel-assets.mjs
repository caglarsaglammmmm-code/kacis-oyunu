// Kapak ve START görsellerinden tüm piksel arayüz varlıklarını, ikonları ve mağaza görsellerini üretir.
// Girdi: gorseller/drift-lab-cover.png, gorseller/start-button.png   Çalıştır: npm run icons
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const EXE = process.env.BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = await puppeteer.launch({ executablePath: EXE, headless: 'new' });
const page = await browser.newPage();
const uri = (f) => {
  const b = fs.readFileSync(f);
  const mime = b.toString('latin1', 8, 12) === 'WEBP' ? 'image/webp' : 'image/png';
  return `data:${mime};base64,${b.toString('base64')}`;
};
await page.goto('about:blank');
await page.evaluate(async (cover, start) => {
  const load = (s) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = s; });
  const P = globalThis.P = {};
  P.cover = await load(cover);
  P.start = await load(start);
  P.mk = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  P.png = (c) => c.toDataURL('image/png').split(',')[1];
  P.sharp = (w, h, src, sx = 0, sy = 0, sw = src.width, sh = src.height) => {
    const c = P.mk(w, h); const g = c.getContext('2d');
    g.imageSmoothingEnabled = false;
    g.drawImage(src, sx, sy, sw, sh, 0, 0, w, h);
    return c;
  };
  // Küçültmede ortalama alınır, büyütmede en yakın komşu: kenarlar bulanmaz
  P.box = (w, h, src, sx = 0, sy = 0, sw = src.width, sh = src.height) => {
    const c = P.mk(w, h); const g = c.getContext('2d');
    g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
    g.drawImage(src, sx, sy, sw, sh, 0, 0, w, h);
    return c;
  };
  const CW = P.cover.naturalWidth;
  globalThis.tri2 = (v, lo, hi) => { const n = hi - lo; let m = (v - lo) % (2 * n); if (m < 0) m += 2 * n; return lo + (m < n ? m : 2 * n - m); };
  P.K = CW / 1092; // Koordinatlar 1092 ölçeğinde yazıldı
  P.base = P.mk(1092, 1092);
  P.base.getContext('2d').drawImage(P.cover, 0, 0, 1092, 1092);
  // İkon sahnesi: kapak ortalanır, dışı aynalanır. Yazı ve araba 33 dp güvenli daireye sığar
  const F = 1443; const CX = 622; const CY = 428;
  const data = P.base.getContext('2d').getImageData(0, 0, 1092, 1092).data;
  // Dışarı taşan alan yalnız yazı içermeyen kenar bandından, ileri geri yansıyarak doldurulur
  const tri = (v, lo, hi) => { const n = hi - lo; let m = (v - lo) % (2 * n); if (m < 0) m += 2 * n; return lo + (m < n ? m : 2 * n - m); };
  P.remap = (w, h, fn) => {
    const c = P.mk(w, h); const g2 = c.getContext('2d'); const im = g2.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const [sx, sy] = fn(x, y);
        const i = ((sy | 0) * 1092 + (sx | 0)) * 4; const o = (y * w + x) * 4;
        im.data[o] = data[i]; im.data[o + 1] = data[i + 1]; im.data[o + 2] = data[i + 2]; im.data[o + 3] = 255;
      }
    }
    g2.putImageData(im, 0, 0);
    return c;
  };
  const ox = F / 2 - CX; const oy = F / 2 - CY;
  const clampX = (v) => (v < 0 ? tri(v, 0, 60) : v > 1091 ? tri(v, 1030, 1091) : v);
  const clampY = (v) => (v < 0 ? tri(v, 0, 40) : v > 1091 ? tri(v, 1030, 1091) : v);
  P.full = P.remap(F, F, (x, y) => [clampX(x - ox), clampY(y - oy)]);
  P.grid = (S, src, sx, sy, sw) => {
    const logical = Math.round(sw / 3);
    return S >= logical ? P.sharp(S, S, P.box(logical, logical, src, sx, sy, sw, sw)) : P.box(S, S, src, sx, sy, sw, sw);
  };
  P.icon = (S, round) => {
    const c = P.grid(S, P.base, 240, 45, 765);
    if (!round) return P.png(c);
    const r = P.mk(S, S); const q = r.getContext('2d');
    q.beginPath(); q.arc(S / 2, S / 2, S / 2, 0, 7); q.clip(); q.drawImage(c, 0, 0);
    return P.png(r);
  };
  P.layer = (S, mask) => {
    const c = P.grid(S, P.full, 0, 0, F);
    if (!mask) return P.png(c);
    const r = P.mk(S, S); const q = r.getContext('2d');
    q.beginPath(); q.arc(S / 2, S / 2, S * (40 / 108), 0, 7); q.clip(); q.drawImage(c, 0, 0);
    return P.png(r);
  };
}, uri('gorseller/drift-lab-cover.png'), uri('gorseller/start-button.png'));

const save = (file, b64) => { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, Buffer.from(b64, 'base64')); };
const out = (f, fn, ...a) => page.evaluate(fn, ...a).then((b) => save(f, b));

// Özgün görseller gerçek PNG olarak saklanır
await out('gorseller/drift-lab-cover.png', () => P.png(P.sharp(P.cover.naturalWidth, P.cover.naturalHeight, P.cover)));
await out('gorseller/start-button.png', () => P.png(P.sharp(P.start.naturalWidth, P.start.naturalHeight, P.start)));

// --- Arayüz ---
await out('assets/ui/cover.png', () => P.png(P.box(364, 364, P.base)));
await out('assets/ui/btn-basla.png', () => {
  const W = P.start.naturalWidth / 1456;
  const c = P.box(210, 82, P.start, 96 * W, 158 * W, 1260 * W, 496 * W);
  const g = c.getContext('2d');
  // Yuvarlatılmış köşeyi korumak için yalnız yazı alanı silinir
  g.fillStyle = '#1b1b1e';
  g.fillRect(40, 26, 132, 31);
  const glyph = {
    B: ['111111.', '11...11', '11...11', '111111.', '11...11', '11...11', '111111.'],
    A: ['.11111.', '11...11', '11...11', '1111111', '11...11', '11...11', '11...11'],
    S: ['.111111', '11.....', '11.....', '.11111.', '.....11', '.....11', '111111.', '...11..', '..11...'],
    L: ['11.....', '11.....', '11.....', '11.....', '11.....', '11.....', '1111111'],
  };
  const cell = 3;
  let x = 50;
  const y = 25;
  [['B', '#ffffff'], ['A', '#e8421a'], ['S', '#ffffff'], ['L', '#e8421a'], ['A', '#ffffff']].forEach(([k, col]) => {
    const rows = glyph[k];
    rows.forEach((r, ry) => {
      [...r].forEach((v, rx) => {
        if (v !== '1') return;
        g.fillStyle = '#000000'; g.fillRect(x + rx * cell + 1, y + ry * cell + 1, cell, cell);
      });
    });
    rows.forEach((r, ry) => {
      [...r].forEach((v, rx) => {
        if (v !== '1') return;
        g.fillStyle = col;
        g.fillRect(x + rx * cell, y + ry * cell, cell, cell);
        if (ry === 6 || (ry > 6)) { g.fillStyle = '#a82a12'; g.fillRect(x + rx * cell, y + ry * cell + 2, cell, 1); }
      });
    });
    x += 7 * cell + 3;
  });
  return P.png(c);
});
await out('assets/ui/garage-bg.png', () => P.png(P.box(182, 182, P.base, 0, 300, 546, 546)));
await out('assets/ui/frame.png', () => {
  const c = P.mk(32, 32); const g = c.getContext('2d');
  const put = (x, y, col) => { g.fillStyle = col; g.fillRect(x, y, 1, 1); };
  for (let y = 0; y < 32; y++) {
    for (let x = 0; x < 32; x++) {
      const d = Math.min(x, y, 31 - x, 31 - y);
      const corner = (x < 8 || x > 23) && (y < 8 || y > 23);
      let col = '#1c1c20';
      if (d === 0) col = '#050506';
      else if (d === 1) col = '#857f6a';
      else if (d === 2) col = '#35353a';
      else if (d < 7) col = (x + y) % 16 < 8 ? '#ffd400' : '#2b2b2e';
      else if (d === 7) col = '#d9a400';
      if (corner && d > 0) {
        col = d === 1 ? '#857f6a' : '#46464c';
        const rx = x < 8 ? x : 31 - x; const ry = y < 8 ? y : 31 - y;
        if (rx >= 3 && rx <= 4 && ry >= 3 && ry <= 4) col = '#d6c690';
        if (rx === 5 && ry >= 3 && ry <= 5) col = '#17171a';
        if (ry === 5 && rx >= 3 && rx <= 5) col = '#17171a';
      }
      put(x, y, col);
    }
  }
  return P.png(c);
});
await out('assets/ui/hazard.png', () => {
  const c = P.mk(16, 8); const g = c.getContext('2d');
  for (let y = 0; y < 8; y++) for (let x = 0; x < 16; x++) { g.fillStyle = (x + y) % 16 < 8 ? '#ffd400' : '#1d1d20'; g.fillRect(x, y, 1, 1); }
  return P.png(c);
});
await out('assets/ui/plate.png', () => {
  const c = P.mk(32, 32); const g = c.getContext('2d');
  g.fillStyle = '#1f1f26'; g.fillRect(0, 0, 32, 32);
  let s = 11;
  for (let i = 0; i < 90; i++) {
    s = (s * 16807) % 2147483647;
    g.fillStyle = s % 2 ? '#26262e' : '#191920';
    g.fillRect(s % 32, (s >> 6) % 32, 1 + (s >> 3) % 3, 1);
  }
  return P.png(c);
});

// --- Web ikonları ---
for (const s of [48, 72, 96, 144, 192, 512]) await out(`icons/icon-${s}.png`, (S) => P.icon(S), s);
await out('icons/favicon-32.png', () => P.icon(32));
await out('icons/favicon-16.png', () => P.icon(16));
await out('icons/icon-maskable-192.png', () => P.layer(192));
await out('icons/icon-maskable-512.png', () => P.layer(512));

// --- Android ---
const res = 'android/app/src/main/res';
for (const [name, s] of Object.entries({ mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 })) {
  const a = Math.round(s * 2.25);
  await out(`${res}/mipmap-${name}/ic_launcher.png`, (S) => P.icon(S), s);
  await out(`${res}/mipmap-${name}/ic_launcher_round.png`, (S) => P.icon(S, true), s);
  await out(`${res}/mipmap-${name}/ic_launcher_foreground.png`, (S) => P.layer(S, true), a);
  await out(`${res}/mipmap-${name}/ic_launcher_background.png`, (S) => P.layer(S), a);
  await out(`${res}/mipmap-${name}/splash_icon.png`, (S) => P.layer(S, true), a);
}
// Eski Android'ler için açılış: düz gece zemini, ortada kapak
for (const d of fs.readdirSync(res)) {
  const f = `${res}/${d}/splash.png`;
  if (!d.startsWith('drawable') || !fs.existsSync(f)) continue;
  const b = fs.readFileSync(f);
  const W = b.readUInt32BE(16); const H = b.readUInt32BE(20);
  await out(f, (w, h) => {
    const c = P.mk(w, h); const g = c.getContext('2d');
    g.fillStyle = '#0a0f2c'; g.fillRect(0, 0, w, h);
    const n = Math.max(1, Math.floor(Math.min(w, h) * 0.86 / 364));
    const s = P.box(364, 364, P.base);
    g.imageSmoothingEnabled = false;
    g.drawImage(s, Math.round((w - 364 * n) / 2), Math.round((h - 364 * n) / 2), 364 * n, 364 * n);
    return P.png(c);
  }, W, H);
}

// --- Play Store ---
await out('gorseller/play-store/icon-512.png', () => P.icon(512));
await out('gorseller/play-store/feature-1024x500.png', () => {
  const k = 1012 / 500; const x0 = 262;
  const m = P.remap(1024, 500, (x, y) => {
    let sx = 80 + (x - x0) * k;
    if (sx < 80) sx = tri2(sx, 0, 250);
    else if (sx > 1091) sx = tri2(sx, 985, 1091);
    return [sx, y * k];
  });
  const g = m.getContext('2d');
  for (const [from, to] of [[0, x0], [1024, x0 + 500]]) {
    const q = g.createLinearGradient(from, 0, to, 0);
    q.addColorStop(0, 'rgba(8,8,30,.7)'); q.addColorStop(1, 'rgba(8,8,30,0)');
    g.fillStyle = q; g.fillRect(Math.min(from, to), 0, Math.abs(to - from), 500);
  }
  return P.png(m);
});
await browser.close();
