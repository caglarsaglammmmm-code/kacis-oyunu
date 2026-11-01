// Tek ekran görüntüsü aracı: node tools/shot.mjs ad gen boy [sorgu] [betik]
import puppeteer from 'puppeteer-core';
const [name, w, h, q = '', code = ''] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required'], protocolTimeout: 180000 });
const page = await b.newPage();
page.on('pageerror', (e) => console.log('HATA', e.message));
page.on('console', (m) => { if (m.type() === 'error') console.log('KONSOL', m.text(), m.location().url || ''); });
await page.setViewport({ width: +w, height: +h, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
await page.goto(`http://localhost:8080/${q}`, { timeout: 0 });
await page.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 30000 });
await new Promise((r) => setTimeout(r, 3500));
if (code) { const r = await page.evaluate(code); if (r !== undefined) console.log(JSON.stringify(r)); await new Promise((d) => setTimeout(d, 2500)); }
await page.screenshot({ path: `e2e-out/${name}.png` });
await b.close();
