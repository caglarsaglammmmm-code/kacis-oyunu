// gorseller/start-button.png görselinden yazısız, yumuşak kenarlı BAŞLA düğmesi üretir: assets/ui/btn-start.png
// Yazı oyunda seçili dilde üstüne konur. Çalıştır: node tools/make-start-button.mjs
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const src = `data:image/png;base64,${fs.readFileSync('gorseller/start-button.png').toString('base64')}`;
const b = await chromium.launch({ channel: 'msedge', headless: true });
const page = await b.newPage();
const png = await page.evaluate(async (src) => {
  const img = new Image();
  await new Promise((ok) => { img.onload = ok; img.src = src; });
  // Kaynakta düğmenin sınırları ve ortadaki koyu plaka (1456 x 813 ölçeğinde)
  const K = img.naturalWidth / 1456;
  const box = { x: 102 * K, y: 164 * K, w: 1250 * K, h: 484 * K };
  const plate = { x: 324 * K, y: 308 * K, w: 806 * K, h: 200 * K, r: 16 * K };
  const W = 500; const H = Math.round((W * box.h) / box.w);
  // 1) Yazıyı kaynak ölçekte sil: plaka içi koyu degrade, üstte hafif ışık
  const big = document.createElement('canvas');
  big.width = img.naturalWidth; big.height = img.naturalHeight;
  const q = big.getContext('2d');
  q.drawImage(img, 0, 0);
  const rr = (g, x, y, w, h, r) => { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); };
  const gr = q.createLinearGradient(0, plate.y, 0, plate.y + plate.h);
  gr.addColorStop(0, '#2b2b31'); gr.addColorStop(0.5, '#1d1d22'); gr.addColorStop(1, '#151518');
  q.fillStyle = gr; rr(q, plate.x, plate.y, plate.w, plate.h, plate.r); q.fill();
  const hi = q.createLinearGradient(0, plate.y, 0, plate.y + plate.h * 0.45);
  hi.addColorStop(0, 'rgba(255,255,255,.10)'); hi.addColorStop(1, 'rgba(255,255,255,0)');
  q.fillStyle = hi; rr(q, plate.x + 6 * K, plate.y + 6 * K, plate.w - 12 * K, plate.h * 0.45, plate.r * 0.8); q.fill();
  // 2) Yumuşak küçültme: kare kenarlar yumuşar
  const c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high';
  // Köşeler saydam, kenarlar yumuşak: yuvarlatılmış maske
  rr(g, 1, 1, W - 2, H - 2, 18); g.clip();
  g.drawImage(big, box.x, box.y, box.w, box.h, 0, 0, W, H);
  // 3) Hafif iç ışık: üst kenarda parlak, alt kenarda koyu şerit
  const lift = g.createLinearGradient(0, 0, 0, H);
  lift.addColorStop(0, 'rgba(255,255,255,.16)'); lift.addColorStop(0.18, 'rgba(255,255,255,0)');
  lift.addColorStop(0.82, 'rgba(0,0,0,0)'); lift.addColorStop(1, 'rgba(0,0,0,.22)');
  g.fillStyle = lift; g.fillRect(0, 0, W, H);
  return c.toDataURL('image/png').split(',')[1];
}, src);
fs.writeFileSync('assets/ui/btn-start.png', Buffer.from(png, 'base64'));
const meta = await page.evaluate(() => 0);
await b.close();
console.log('assets/ui/btn-start.png', meta === 0 ? 'hazır' : '');
