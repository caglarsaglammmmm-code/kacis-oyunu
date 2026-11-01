// Zorla sahne görüntüleri: tank atışı, barikat, ateş, SWAT
import puppeteer from 'puppeteer-core';
const EXE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = process.env.E2E_OUT || 'e2e-out';
async function scene(name, w, h, q, setup, wait = 700) {
  const page = await b.newPage();
  page.on('pageerror', (e) => console.log('HATA', name, e.message));
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(`http://localhost:8080/${q}`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 8000 });
  await page.click('#btn-play');
  await sleep(1200);
  await page.evaluate(setup);
  await sleep(wait);
  await page.screenshot({ path: `${OUT}/z-${name}.png` });
  await page.close();
}
await scene('tank', 390, 844, '?t=285&god=1', () => {
  const g = globalThis.__kacis.game; const p = g.player;
  const c = g.spawnCop('tank', 'chaser', p.x + 60, p.y + 300, -1.57);
  c.turret = -1.4;
  c.fireT = 0.1;
  g.spawnCop('swat', 'chaser', p.x - 60, p.y + 180, -1.57);
  g.spawnCop('advanced', 'flanker', p.x + 70, p.y - 60, 1.57);
}, 400);
await scene('barikat', 844, 390, '?t=120&god=1', () => {
  const g = globalThis.__kacis.game; const p = g.player;
  g.time = 120; g.cam.halfW = 100; g.cam.halfH = 100;
  for (let i = 0; i < 30 && !g.placeBarricade(); i++);
  const c = g.cops.find((k) => k.state === 'barricade');
  if (c) { p.x = c.x - 0; p.y = c.y - 240; g.player.vy = 200; g.player.vx=0; p.a = 1.57; g.cam.x = p.x; g.cam.y = p.y + 100; }
  console.log(!!c);
}, 300);
await scene('ates', 390, 844, '?t=60', () => {
  const g = globalThis.__kacis.game; g.damage = 85;
}, 900);
await scene('duman', 844, 390, '?t=60', () => { globalThis.__kacis.game.damage = 60; }, 900);
await scene('uyari', 390, 844, '?t=198&god=1', () => {}, 1500);
await b.close();
