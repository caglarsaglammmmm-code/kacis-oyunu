// Ana ekran, garaj, geçiş kareleri, gece görüntüsü ve kare süresi: Playwright ile gerçek tarayıcıda.
// Kullanım: önce npm run serve, sonra node tools/v10-shots.mjs [klasör]
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const out = process.argv[2] || 'e2e-out/v10';
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ channel: 'msedge', headless: true });
const errs = [];
const open = async (w, h, url, dpr = 1) => {
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, hasTouch: true });
  const p = await c.newPage();
  p.on('pageerror', (e) => errs.push(`${w}x${h}: ${e.message}`));
  p.on('response', (r) => { if (r.status() >= 400) errs.push(`${r.status()} ${r.url()}`); });
  await p.goto(`http://localhost:8080/${url}`);
  await p.waitForFunction(() => !document.getElementById('menu').hidden);
  return p;
};
for (const [name, w, h, dpr] of [['dikey', 390, 844, 3], ['uzun', 360, 800, 3], ['kucuk', 360, 640, 2], ['tablet', 800, 1200, 2], ['yatay', 844, 390, 3], ['yatay-kucuk', 640, 360, 2]]) {
  const p = await open(w, h, '', dpr);
  await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/menu-${name}.png` });
  console.log(name, await p.evaluate(() => {
    const over = [...document.querySelectorAll('#menu button, #menu a, #maker')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && (r.left < -1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1); }).map((e) => e.id);
    return { taşan: over, kaydırma: document.documentElement.scrollWidth - innerWidth };
  }));
  if (name === 'dikey' || name === 'yatay') {
    await p.click('#btn-garage');
    await p.waitForTimeout(600);
    await p.click('#garage-list .thumb:nth-child(5)');
    await p.waitForTimeout(500);
    await p.screenshot({ path: `${out}/garaj-${name}.png` });
    await p.click('#garage .back');
    await p.click('#btn-settings');
    await p.waitForTimeout(300);
    await p.screenshot({ path: `${out}/ayarlar-${name}.png` });
  }
  await p.context().close();
}

// Geçiş: gerçek zamanlı kareler
{
  const p = await open(390, 844, '?fx=1&god=1', 2);
  await p.waitForTimeout(6000);
  await p.evaluate(() => document.getElementById('btn-play').click());
  const t0 = Date.now();
  for (const at of [150, 420, 700, 900, 1120, 1300, 1420, 1600, 1900, 2300]) {
    const w = at - (Date.now() - t0);
    if (w > 0) await p.waitForTimeout(w);
    await p.screenshot({ path: `${out}/gecis-${String(Date.now() - t0).padStart(4, '0')}.png` });
  }
  console.log('sonra', await p.evaluate(() => ({ state: __drift.game.state, hiz: Math.round(__drift.game.player.speed), menu: document.getElementById('menu').hidden })));
  await p.evaluate(() => __drift.pause());
  await p.waitForTimeout(300);
  await p.screenshot({ path: `${out}/duraklat.png` });
  await p.context().close();
}

// Gece ve kare süresi (işlemci 6 kat yavaş): ekran görüntüsü alınmadan
for (const [name, k] of [['gun', 0.2], ['gece', 0.7], ['safak', 0.86]]) {
  const p = await open(390, 844, '?god=1', 2);
  await p.waitForTimeout(800);
  await p.evaluate((u) => { document.getElementById('btn-play').click(); __drift.game.dayT = ((u - __drift.cfg.day.start + 1) % 1) * __drift.cfg.day.length; }, k);
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${out}/sahne-${name}.png` });
  await p.context().close();
}
{
  const p = await open(390, 844, '?fx=1&god=1');
  await p.waitForTimeout(9000);
  const cdp = await p.context().newCDPSession(p);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 6 });
  const res = await p.evaluate(() => new Promise((done) => {
    const log = []; let last = performance.now(); const t0 = last;
    const tick = (n) => { log.push([Math.round(n - t0), +(n - last).toFixed(1), __drift.game.state]); last = n; if (n - t0 < 8000) requestAnimationFrame(tick); else done(log); };
    requestAnimationFrame(tick);
    document.getElementById('btn-play').click();
  }));
  const film = res.filter((l) => l[0] < 2000).map((l) => l[1]).sort((x, y) => x - y);
  const run = res.filter((l) => l[0] >= 2000).map((l) => l[1]).sort((x, y) => x - y);
  const pct = (a, q) => a[Math.floor(a.length * q)];
  console.log('gecis 6x', 'kare', film.length, 'p50', pct(film, 0.5), 'p95', pct(film, 0.95), 'max', film.at(-1), 'play', res.find((l) => l[2] === 'play')?.[0]);
  console.log('oyun 6x', 'kare', run.length, 'p50', pct(run, 0.5), 'p95', pct(run, 0.95), 'p99', pct(run, 0.99), 'max', run.at(-1), 'fps', Math.round(1000 / (run.reduce((s, v) => s + v, 0) / run.length)));
  await p.context().close();
}
console.log('hata', errs.length, errs.slice(0, 6));
await b.close();
