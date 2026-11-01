// Arac galerisini tarayicida acip buyuk ekran goruntuleri alir.
import puppeteer from 'puppeteer-core';
const EXE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const only = process.argv[2] || '';
const out = process.argv[3] || 'e2e-out/galeri';
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'], protocolTimeout: 300000 });
const page = await b.newPage();
page.on('pageerror', (e) => console.log('HATA', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('KONSOL', m.text()); });
await page.setViewport({ width: 1290, height: 900 });
await page.goto(`http://localhost:8080/tools/gallery.html${only ? `?only=${only}` : ''}`);
await page.waitForFunction(() => document.title === 'hazir', { timeout: 280000 });
const figs = await page.$$('figure');
const per = 8;
for (let i = 0; i < figs.length; i += per) {
  const a = await figs[i].boundingBox();
  const last = await figs[Math.min(figs.length - 1, i + per - 1)].boundingBox();
  await page.screenshot({ path: `${out}-${i / per}.png`, captureBeyondViewport: true, clip: { x: 0, y: a.y, width: 1290, height: last.y + last.height - a.y } });
}
console.log('adet', figs.length);
await b.close();

