// Gerçek tarayıcıda (Edge/Chrome) uçtan uca deneme. Sunucu açıkken: npm run e2e
// Ekran görüntüleri ve kare süreleri e2e-out/ altına yazılır.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.E2E_OUT || 'e2e-out';
fs.mkdirSync(OUT, { recursive: true });
const BASE = process.env.E2E_URL || 'http://localhost:8080/';
const EXE = process.env.BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const MINUTES = Number(process.env.E2E_SECONDS || 60);

const browser = await puppeteer.launch({ executablePath: EXE, headless: 'new', args: ['--autoplay-policy=no-user-gesture-required', '--enable-gpu-rasterization', '--ignore-gpu-blocklist', '--use-angle=d3d11'] });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const report = new Proxy({}, { set(t, k, v) { t[k] = v; fs.writeFileSync(path.join(OUT, 'rapor.json'), JSON.stringify(t, null, 2)); return true; } });

async function open(w, h, query = '') {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errors.push(`console: ${m.text()}`); });
  page.on('requestfailed', (r) => errors.push(`istek: ${r.url()}`));
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(BASE + query, { waitUntil: 'load' });
  return { page, errors };
}

// Gerçek dokunma olayları: Touch.dispatch ile basılı tut / bırak
async function touch(page, cdp, points) {
  const type = points.length ? 'touchStart' : 'touchEnd';
  await cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points });
}

async function statsOf(page) {
  return page.evaluate(() => {
    const k = globalThis.__kacis;
    const p = k.perf;
    const n = Math.min(p.count, p.frames.length);
    const f = Array.from(p.frames.slice(0, n)).sort((a, b) => a - b);
    const w = Array.from(p.work.slice(0, n)).sort((a, b) => a - b);
    const pick = (arr, q) => +arr[Math.floor(arr.length * q)].toFixed(2);
    const g = k.game;
    return { n, frameAvg: +(f.reduce((a, b) => a + b, 0) / n).toFixed(2), frameP50: pick(f, 0.5), frameP95: pick(f, 0.95), frameP99: pick(f, 0.99), workP50: pick(w, 0.5), workP95: pick(w, 0.95), workP99: pick(w, 0.99), workMax: pick(w, 0.9999), frameMax: pick(f, 0.9999), dprDrops: p.dprDrops, dpr: k.renderer.dpr, state: g.state, time: +g.time.toFixed(1), cops: g.cops.length, chunks: g.world.chunks.size, kills: g.kills, damage: +g.damage.toFixed(1), score: Math.floor(g.score), particles: g.fx.liveCount() };
  });
}

// Basit oto-sürücü: dokunma yerine Input üzerinden değil, gerçek touch ile sürer
async function drive(page, cdp, seconds) {
  const end = Date.now() + seconds * 1000;
  const W = page.viewport().width;
  const H = page.viewport().height;
  while (Date.now() < end) {
    const steer = await page.evaluate(() => {
      const { game: g } = globalThis.__kacis;
      const p = g.player;
      // Önündeki engele göre yön: 3 ışın
      const look = (a, d) => g.world.blockedAt(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d);
      const score = (a) => { let s = 0; for (let d = 40; d <= 320; d += 40) { if (look(a, d)) break; s += 1; } return s; };
      const l = score(p.a - 0.6);
      const c = score(p.a);
      const r = score(p.a + 0.6);
      if (c >= 6) return Math.random() < 0.12 ? (Math.random() < 0.5 ? -1 : 1) : 0;
      return l > r ? -1 : 1;
    });
    const pts = steer === 0 ? [] : [{ x: steer > 0 ? W * 0.8 : W * 0.2, y: H * 0.7, id: 1 }];
    if (pts.length) await touch(page, cdp, pts);
    await sleep(steer === 0 ? 180 : 260);
    if (pts.length) await touch(page, cdp, []);
  }
}

const screens = [[390, 844, 'portre'], [844, 390, 'yatay']];
for (const [w, h, name] of screens) {
  const { page, errors } = await open(w, h);
  await sleep(1200);
  await page.screenshot({ path: path.join(OUT, `${name}-1-splash.png`) });
  await page.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 8000 });
  await sleep(900);
  await page.screenshot({ path: path.join(OUT, `${name}-2-menu.png`) });
  for (const [btn, label] of [['btn-garage', 'garage'], ['btn-settings', 'settings'], ['btn-howto', 'howto']]) {
    await page.click(`#${btn}`);
    await sleep(500);
    await page.screenshot({ path: path.join(OUT, `${name}-3-${label}.png`) });
    const over = await page.evaluate(() => {
      const el = [...document.querySelectorAll('.screen')].find((s) => !s.hidden);
      return { sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, panelW: el.scrollWidth, panelCW: el.clientWidth };
    });
    if (over.panelW > over.panelCW + 1) errors.push(`${label} yatay taşma ${JSON.stringify(over)}`);
    await page.click(`#${label} .back`);
    await sleep(200);
  }
  await page.click('#btn-play');
  const cdp = await page.createCDPSession();
  await drive(page, cdp, 7);
  await page.screenshot({ path: path.join(OUT, `${name}-4-oyun.png`) });
  report[name] = { errors };
  await page.close();
}

// Sahne denemeleri: 50/200/280. saniye
for (const [t, label] of [[52, 'swat'], [205, 'takviye'], [283, 'tank']]) {
  const { page, errors } = await open(390, 844, `?t=${t}&god=1`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 8000 });
  await page.click('#btn-play');
  const cdp = await page.createCDPSession();
  await drive(page, cdp, 14);
  await page.screenshot({ path: path.join(OUT, `sahne-${label}.png`) });
  report[`sahne-${label}`] = { ...(await statsOf(page)), errors };
  await page.close();
}

// Uzun oturum: gerçek dokunma ile, ölümsüz, 280. saniyeden önce başlar
// E2E_THROTTLE=6 telefona yakın işlemci yavaşlatması uygular
const { page, errors } = await open(390, 844, '?t=240&god=1');
await page.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 8000 });
await page.click('#btn-play');
const cdp = await page.createCDPSession();
if (process.env.E2E_THROTTLE) await cdp.send('Emulation.setCPUThrottlingRate', { rate: Number(process.env.E2E_THROTTLE) });
await drive(page, cdp, MINUTES);
await page.screenshot({ path: path.join(OUT, 'uzun-oturum.png') });
report.uzun = { ...(await statsOf(page)), errors };
await page.close();

// Klavye ve ölüm akışı
{
  const { page: p2, errors: e2 } = await open(844, 390);
  await p2.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 8000 });
  await p2.click('#btn-play');
  await sleep(600);
  await p2.keyboard.down('ArrowLeft');
  await sleep(600);
  const keyTurn = await p2.evaluate(() => globalThis.__kacis.input.steer);
  await p2.keyboard.down('ArrowRight');
  await sleep(1000);
  const rev = await p2.evaluate(() => ({ reverse: globalThis.__kacis.input.reverse, forward: globalThis.__kacis.game.player.forward }));
  await p2.keyboard.up('ArrowRight');
  await p2.keyboard.up('ArrowLeft');
  await p2.evaluate(() => { const g = globalThis.__kacis.game; g.hurt(100); });
  await sleep(700);
  await p2.screenshot({ path: path.join(OUT, 'patlama.png') });
  await p2.waitForFunction(() => !document.getElementById('over').hidden, { timeout: 5000 });
  await sleep(800);
  await p2.screenshot({ path: path.join(OUT, 'yatay-5-bitis.png') });
  await p2.click('#btn-retry');
  await sleep(500);
  const again = await p2.evaluate(() => globalThis.__kacis.game.state);
  report.klavye = { keyTurn, rev, again, errors: e2 };
  await p2.close();
}

// Geri tuşu mantığı ve APK düğmesi
{
  const { page: p6, errors: e6 } = await open(390, 844);
  await p6.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 8000 });
  const apk = await p6.evaluate(() => { const a = document.getElementById('btn-apk'); const r = a.getBoundingClientRect(); return { href: a.href, visible: !a.hidden && r.width > 100 && r.bottom <= innerHeight }; });
  await p6.click('#btn-play');
  await sleep(500);
  const seq = [];
  const st = () => p6.evaluate(() => ({ state: globalThis.__kacis.game.state, pause: !document.getElementById('pause').hidden, menu: !document.getElementById('menu').hidden }));
  seq.push(await p6.evaluate(() => globalThis.__kacisBack()), await st());
  seq.push(await p6.evaluate(() => globalThis.__kacisBack()), await st());
  await p6.evaluate(() => globalThis.__kacis.pause());
  await p6.click('#btn-pause-menu');
  await sleep(200);
  const first = await p6.evaluate(() => globalThis.__kacisBack());
  const second = await p6.evaluate(() => globalThis.__kacisBack());
  report.geri = { apk, seq, menuBirinci: first, menuIkinci: second, errors: e6 };
  await p6.close();
}

// Araçlar listesi parmakla kaydırılabiliyor mu
{
  const { page: p3, errors: e3 } = await open(390, 844);
  await p3.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 8000 });
  await p3.click('#btn-garage');
  const c3 = await p3.createCDPSession();
  const t3 = (type, y) => c3.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x: 40, y }] });
  await t3('touchStart', 700);
  for (let y = 680; y >= 200; y -= 20) { await t3('touchMove', y); await sleep(16); }
  await t3('touchEnd');
  await sleep(300);
  report.kaydirma = { scrollTop: await p3.evaluate(() => document.getElementById('garage').scrollTop), errors: e3 };
  await p3.close();
}

// Çevrimdışı PWA
{
  const { page: p4, errors: e4 } = await open(390, 844);
  await p4.waitForFunction(() => navigator.serviceWorker.controller || navigator.serviceWorker.ready.then(() => true), { timeout: 8000 });
  await sleep(1500);
  await p4.reload({ waitUntil: 'load' });
  await sleep(800);
  const c4 = await p4.createCDPSession();
  await c4.send('Network.enable');
  await c4.send('Network.emulateNetworkConditions', { offline: true, latency: 0, downloadThroughput: 0, uploadThroughput: 0 });
  e4.length = 0;
  await p4.reload({ waitUntil: 'load' });
  await p4.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 8000 });
  await p4.click('#btn-play');
  await sleep(1000);
  report.cevrimdisi = { state: await p4.evaluate(() => globalThis.__kacis.game.state), controller: await p4.evaluate(() => !!navigator.serviceWorker.controller), errors: e4 };
  await p4.close();
}

// file:// tek dosya kopyası
{
  const url = 'file:///' + path.resolve('index.html').split(path.sep).join('/');
  const p5 = await browser.newPage();
  const e5 = [];
  p5.on('pageerror', (e) => e5.push(e.message));
  await p5.goto(url);
  await p5.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 8000 });
  await p5.click('#btn-play');
  await sleep(1000);
  report.dosya = { state: await p5.evaluate(() => globalThis.__kacis.game.state), errors: e5 };
  await p5.close();
}

fs.writeFileSync(path.join(OUT, 'rapor.json'), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
await browser.close();
