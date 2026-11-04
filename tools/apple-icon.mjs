// iOS ana ekran ikonu: icons/icon-512.png'den 180x180, saydamsız (iOS saydam yeri siyah boyar).
// node tools/apple-icon.mjs
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const src = fs.readFileSync('icons/icon-512.png').toString('base64');
const b = await chromium.launch({ channel: 'msedge', headless: true });
const p = await b.newPage();
const out = await p.evaluate(async (src) => {
  const img = new Image();
  img.src = `data:image/png;base64,${src}`;
  await img.decode();
  const probe = document.createElement('canvas'); probe.width = img.width; probe.height = img.height;
  const pg = probe.getContext('2d'); pg.drawImage(img, 0, 0);
  const corner = pg.getImageData(2, 2, 1, 1).data;
  // İki adımda küçültme: daha yumuşak kenar
  const mid = document.createElement('canvas'); mid.width = 360; mid.height = 360;
  const mg = mid.getContext('2d'); mg.imageSmoothingQuality = 'high'; mg.drawImage(img, 0, 0, 360, 360);
  const c = document.createElement('canvas'); c.width = 180; c.height = 180;
  const g = c.getContext('2d');
  g.fillStyle = '#0a0824'; g.fillRect(0, 0, 180, 180);
  g.imageSmoothingQuality = 'high'; g.drawImage(mid, 0, 0, 180, 180);
  return { data: c.toDataURL('image/png').split(',')[1], corner: [...corner] };
}, src);
fs.writeFileSync('icons/apple-touch-icon.png', Buffer.from(out.data, 'base64'));
console.log('icons/apple-touch-icon.png 180x180, kaynak köşe RGBA', out.corner.join(','));
await b.close();
