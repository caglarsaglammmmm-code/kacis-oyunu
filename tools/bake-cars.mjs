// 3B araç modellerinden oyun içi üstten görünüm atlasını üretir: assets/cars.webp ve js/carsheet.js
import fs from 'node:fs';
import puppeteer from 'puppeteer-core';
const EXE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'], protocolTimeout: 600000 });
const page = await b.newPage();
page.on('pageerror', (e) => console.log('HATA', e.message));
// node tools/bake-cars.mjs en : yalnız İngilizce yazılı atlas (assets/cars-en.webp); hücre düzeni js/carsheet.js ile aynı olmalı
const EN = process.argv[2] === 'en';
await page.goto(`http://localhost:8080/tools/bake-cars.html${EN ? '?lang=en' : ''}`, { timeout: 0 });
await page.waitForFunction(() => document.title === 'hazir', { timeout: 580000 });
const out = await page.evaluate(() => window.__out);
await b.close();
fs.mkdirSync('assets', { recursive: true });
if (EN) {
  const { CAR_SHEET } = await import('../js/carsheet.js');
  if (JSON.stringify(CAR_SHEET) !== JSON.stringify(out.sheet)) throw new Error('İngilizce atlasın hücre düzeni js/carsheet.js ile aynı değil: önce node tools/bake-cars.mjs');
  fs.writeFileSync('assets/cars-en.webp', Buffer.from(out.data.split(',')[1], 'base64'));
} else {
  fs.writeFileSync('assets/cars.webp', Buffer.from(out.data.split(',')[1], 'base64'));
  fs.writeFileSync('js/carsheet.js', `// Üretilmiş dosya: node tools/bake-cars.mjs\nexport const CAR_SHEET = ${JSON.stringify(out.sheet)};\n`);
}
console.log(EN ? 'atlas (en)' : 'atlas', out.sheet.w, out.sheet.h, Object.keys(out.sheet.cells).length, 'sprite', fs.statSync(EN ? 'assets/cars-en.webp' : 'assets/cars.webp').size, 'bayt');
