// v22 tarayıcı sınaması: hedefli meteor (nişan, düşüş, çarpma, sarsıntı), suya düşen araçlar, yol kapatma barikatı,
// gerçek dokunma olaylarıyla (CDP) direksiyon ve joystick. Konsol hatası olmamalı.
// node tools/v22-test.mjs [port] [klasör] [bölümler: meteor,water,roadblock,wheel,stick]
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const port = Number(process.argv[2] || 8080);
const OUT = process.argv[3] || 'e2e-out/v22/play';
const only = (process.argv[4] || 'meteor,water,roadblock,wheel,stick').split(',');
fs.mkdirSync(OUT, { recursive: true });
const fails = [];
let passes = 0;
const ok = (c, name, extra = '') => { if (c) passes++; else { fails.push(`${name} ${extra}`); console.log('HATA', name, extra); } };
const b = await chromium.launch({ channel: 'msedge', headless: true });
const errs = [];
const report = {};

async function open({ url = '?god=1&t=0', control = 'zones', w = 390, h = 844 } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'tr' });
  await ctx.addInitScript((c) => { try { localStorage.setItem('drift-lab-v1', JSON.stringify({ settings: { control: c, lang: 'tr', weather: 'sunny' } })); } catch {} }, control);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(`pageerror ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(`http://localhost:${port}/${url}`);
  await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden, null, { timeout: 30000 });
  const cdp = await ctx.newCDPSession(page);
  return { ctx, page, cdp };
}
const play = async (page) => {
  await page.evaluate(() => __drift.play());
  await page.waitForFunction(() => __drift.game.state === 'play' && !__drift.renderer.warmingNow, null, { timeout: 20000 });
  await page.waitForTimeout(400);
};
const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` });

// --- METEOR ---
if (only.includes('meteor')) {
  const { ctx, page } = await open({ url: '?god=1&t=384' });
  await play(page);
  // Oyuncu ana yolda sabit hızla gider: nişan hıza göre ileride
  const aim = await page.evaluate(async () => {
    const g = __drift.game; const p = g.player;
    const { meteorAim } = await import('/js/meteor.js');
    const out = { x: 0, y: 0 }; const rows = [];
    for (const v of [100, 250, 400]) { p.vx = 0; p.vy = v; p.a = Math.PI / 2; meteorAim(g, out); rows.push([v, Math.round(Math.hypot(out.x - p.x, out.y - p.y))]); }
    return rows;
  });
  report.meteorAim = aim;
  ok(aim[0][1] < aim[1][1] && aim[1][1] < aim[2][1], 'nişan hızla ileri', JSON.stringify(aim));
  await page.evaluate(() => {
    const g = __drift.game;
    g.meteors.waveT = 999; for (const m of g.meteors.list) m.alive = false;
    globalThis.__hold = setInterval(() => { const p = g.player; p.vx = 0; p.vy = 45; p.a = Math.PI / 2; g.cops.length = 0; }, 4);
    g.meteors.spawn(g, true);
  });
  await page.waitForTimeout(1200);
  const m0 = await page.evaluate(() => { const m = __drift.game.meteors.list.find((k) => k.alive); return { x: m.x, y: m.y, R: __drift.cfg.meteor.radius }; });
  await shot(page, 'meteor-nisan');
  await page.waitForFunction(() => { const m = __drift.game.meteors.list.find((k) => k.alive); return m && m.t > __drift.cfg.meteor.warn + 0.35; }, null, { timeout: 6000 });
  const m1 = await page.evaluate(() => { const m = __drift.game.meteors.list.find((k) => k.alive); return { x: m.x, y: m.y }; });
  ok(m1.x === m0.x && m1.y === m0.y, 'nişan kilitli (takip etmiyor)');
  await shot(page, 'meteor-dusus');
  await page.waitForFunction(() => __drift.game.meteors.impacts > 0, null, { timeout: 4000 });
  await page.waitForTimeout(60);
  await shot(page, 'meteor-carpma');
  const q = await page.evaluate(() => ({ quake: __drift.game.quakeT, shake: __drift.game.cam.shake, t: __drift.game.runTime }));
  // Oyun saatiyle ~0.6 sn sonra hâlâ sarsılıyor
  await page.waitForFunction((t0) => __drift.game.runTime > t0 + 0.6, q.t, { timeout: 4000 });
  const q2 = await page.evaluate(() => __drift.game.cam.shake);
  ok(q.quake > 1 && q2 > 0.5, 'çarpınca 1-2 sn sarsıntı', JSON.stringify({ ...q, after: q2 }));
  report.meteor = { radius: m0.R, quake: +q.quake.toFixed(2), shakeAfter09s: +q2.toFixed(2) };
  await page.evaluate(() => clearInterval(globalThis.__hold));
  await ctx.close();
}

// --- SU ---
if (only.includes('water')) {
  const { ctx, page } = await open({ url: '?god=1&t=310' });
  await play(page);
  const w = await page.evaluate(async () => {
    const g = __drift.game;
    const { isDeep } = await import('/js/world.js');
    for (let r = 0; r < 8; r++) for (let cy = -r; cy <= r; cy++) for (let cx = -r; cx <= r; cx++) {
      const c = g.world.chunk(cx, cy);
      for (let i = 0; i < c.rectCount; i++) { const k = c.rects[i]; if (isDeep(k) && k.w > 160 && k.h > 160) return { x: k.x, y: k.y, w: k.w, h: k.h }; }
    }
    return null;
  });
  ok(!!w, 'su bulundu');
  await page.evaluate((w) => {
    const g = __drift.game;
    globalThis.__hold = setInterval(() => { const p = g.player; p.x = w.x - 180; p.y = w.y + w.h / 2; p.vx = 0; p.vy = 0; p.a = 0; }, 4);
  }, w);
  await page.waitForTimeout(1200);
  const res = await page.evaluate((w) => {
    const g = __drift.game; g.cops.length = 0;
    const out = [];
    // Su kenarında, suya doğru itilmiş araçlar (itilme ve hızla düşme birim testte ayrıca sınanır)
    ['car', 'swat', 'blob', 'tank'].forEach((t, i) => {
      const c = g.spawnCop(t, 'chaser', w.x - 40, w.y + w.h / 2 + (i - 1.5) * w.h * 0.2, 0);
      c.x = w.x - c.wid * 0.5 - 2; c.vx = 200; c.vy = 0; c.pushT = 1;
      g.collideWorld(c, false);
      out.push({ c, id: c.id });
    });
    globalThis.__sinkers = out;
    return out.length;
  }, w);
  await page.waitForTimeout(450);
  await shot(page, 'suya-dusen-araclar');
  const st = await page.evaluate(() => globalThis.__sinkers.map(({ c }) => ({ type: c.type, sink: +c.sinkT.toFixed(2) })));
  ok(st.every((s) => s.sink > 0), 'dört tür suya düştü', JSON.stringify(st));
  await page.waitForTimeout(1100);
  await shot(page, 'suya-batan-araclar');
  await page.waitForTimeout(3000);
  const gone = await page.evaluate(() => globalThis.__sinkers.filter(({ c, id }) => __drift.game.cops.includes(c) && c.id === id).length);
  ok(gone === 0, 'batıp kayboldular', String(gone));
  report.water = st;
  await page.evaluate(() => clearInterval(globalThis.__hold));
  await ctx.close();
}

// --- YOL KAPATMA ---
if (only.includes('roadblock')) {
  const { ctx, page } = await open({ url: '?god=1&t=60' });
  await play(page);
  await page.evaluate(() => {
    const g = __drift.game;
    globalThis.__hold = setInterval(() => { const p = g.player; p.a = Math.PI / 2; p.vx = 0; p.vy = 300; p.x = 100; for (let i = g.cops.length - 1; i >= 0; i--) if (!g.cops[i].roadblock) g.removeCop(i); }, 4);
  });
  await page.waitForFunction(() => __drift.game.rb.phase !== 'none', null, { timeout: 15000 });
  await page.waitForTimeout(250);
  const toast = await page.evaluate(() => (document.getElementById('toast') || {}).textContent || '');
  ok(/Yol kapandı/.test(toast), 'uyarı çıktı', toast);
  await page.waitForFunction(() => __drift.game.rb.phase === 'up', null, { timeout: 5000 });
  // Barikata yaklaş: görüntü
  await page.evaluate(() => { const g = __drift.game; clearInterval(globalThis.__hold); const r = g.rb; globalThis.__hold = setInterval(() => { const p = g.player; p.x = r.x; p.y = r.y - 260; p.vx = 0; p.vy = 0; p.a = Math.PI / 2; }, 4); });
  await page.waitForTimeout(900);
  await shot(page, 'barikat');
  const rb = await page.evaluate(() => ({ n: __drift.game.rb.cars.length, made: __drift.game.rb.made }));
  ok(rb.n >= 3, 'barikat kuruldu', JSON.stringify(rb));
  await page.evaluate(() => clearInterval(globalThis.__hold));
  await ctx.close();
}

// Dokunma yardımcıları
const touch = (cdp, type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((p) => ({ x: p.x, y: p.y, id: p.id || 1 })) });
// Her karede değeri okuyan kayıt
const startRec = (page) => page.evaluate(() => { globalThis.__rec = []; const f = () => { globalThis.__rec.push(__drift.input.steer); globalThis.__recRaf = requestAnimationFrame(f); }; f(); });
const stopRec = (page) => page.evaluate(() => { cancelAnimationFrame(globalThis.__recRaf); const r = globalThis.__rec; let max = 0; for (let i = 1; i < r.length; i++) max = Math.max(max, Math.abs(r[i] - r[i - 1])); return { max: +max.toFixed(3), last: r.at(-1), n: r.length, peak: Math.max(...r.map(Math.abs)) }; });

// --- DİREKSİYON ---
if (only.includes('wheel')) {
  const { ctx, page, cdp } = await open({ url: '?god=1&t=0', control: 'wheel' });
  await play(page);
  const W = await page.evaluate(() => { const w = __drift.input.wheel; return { cx: w.cx, cy: w.cy, r: w.r }; });
  const at = (deg, R = W.r * 0.75) => ({ x: W.cx + Math.cos((deg * Math.PI) / 180) * R, y: W.cy + Math.sin((deg * Math.PI) / 180) * R, id: 1 });
  await startRec(page);
  await touch(cdp, 'touchStart', [at(-90)]);
  // Saat yönünde 120°, sonra -180/+180 sınırından geçerek geri, hızlı sağ-sol
  for (let d = -90; d <= 30; d += 4) { await touch(cdp, 'touchMove', [at(d)]); await page.waitForTimeout(8); }
  for (let d = 30; d >= -250; d -= 5) { await touch(cdp, 'touchMove', [at(d)]); await page.waitForTimeout(8); }
  for (let n = 0; n < 4; n++) {
    for (let d = -250; d <= -150; d += 10) await touch(cdp, 'touchMove', [at(d)]);
    for (let d = -150; d >= -250; d -= 10) await touch(cdp, 'touchMove', [at(d)]);
  }
  // Parmak direksiyonun dışına sürüklenir: kontrol sürer
  for (let d = -250; d <= -200; d += 5) { await touch(cdp, 'touchMove', [at(d, W.r * 2.6)]); await page.waitForTimeout(8); }
  await page.waitForTimeout(150);
  const held = await page.evaluate(() => ({ id: __drift.input.wheelId, a: __drift.input.wheelA }));
  await shot(page, 'direksiyon');
  // İkinci parmak ekranda başka yere
  await touch(cdp, 'touchMove', [at(-200, W.r * 2.6), { x: 60, y: 300, id: 2 }]);
  await touch(cdp, 'touchMove', [at(-200, W.r * 2.6), { x: 120, y: 340, id: 2 }]);
  const two = await page.evaluate(() => __drift.input.wheelId);
  await touch(cdp, 'touchEnd', []);
  await page.waitForTimeout(900);
  const rec = await stopRec(page);
  report.wheel = rec;
  console.log('direksiyon', JSON.stringify(rec));
  ok(held.id !== null, 'dışarı sürüklenince bırakılmadı');
  ok(two !== null, 'ikinci parmak karışmadı');
  ok(rec.max < 0.2, 'sıçrama yok (eski kodda merkezden geçişte 0.77)', String(rec.max));
  ok(rec.last === 0, 'bırakınca ortaya döndü', String(rec.last));
  // Ekran döndürme: tutarken boyut değişir
  await touch(cdp, 'touchStart', [at(-90)]);
  for (let d = -90; d <= -40; d += 5) await touch(cdp, 'touchMove', [at(d)]);
  await startRec(page);
  await page.setViewportSize({ width: 844, height: 390 });
  await page.evaluate(() => window.dispatchEvent(new Event('orientationchange')));
  await page.waitForTimeout(300);
  await touch(cdp, 'touchMove', [at(-30)]);
  await touch(cdp, 'touchEnd', []);
  await page.waitForTimeout(900);
  const rot = await stopRec(page);
  report.wheelRotate = rot;
  ok(rot.max < 0.2 && rot.last === 0, 'ekran dönünce sıçrama yok, sıfırlandı', JSON.stringify(rot));
  await ctx.close();
}

// --- JOYSTICK ---
if (only.includes('stick')) {
  const { ctx, page, cdp } = await open({ url: '?god=1&t=0', control: 'stick' });
  await play(page);
  await startRec(page);
  // Sol kenara çok yakın bas (eskiden ilk harekette tam sola atlıyordu)
  await touch(cdp, 'touchStart', [{ x: 6, y: 600 }]);
  await touch(cdp, 'touchMove', [{ x: 9, y: 601 }]);
  await page.waitForTimeout(200);
  const edge = await page.evaluate(() => __drift.input.steer);
  for (let x = 9; x <= 110; x += 4) { await touch(cdp, 'touchMove', [{ x, y: 600 }]); await page.waitForTimeout(8); }
  for (let n = 0; n < 4; n++) {
    for (let x = 110; x >= 0; x -= 8) await touch(cdp, 'touchMove', [{ x, y: 600 }]);
    for (let x = 0; x <= 110; x += 8) await touch(cdp, 'touchMove', [{ x, y: 600 }]);
  }
  await page.waitForTimeout(200);
  await shot(page, 'joystick');
  await touch(cdp, 'touchMove', [{ x: 110, y: 600 }, { x: 300, y: 300, id: 2 }]);
  await touch(cdp, 'touchMove', [{ x: 110, y: 600 }, { x: 200, y: 320, id: 2 }]);
  const v2 = await page.evaluate(() => ({ s: __drift.input.steer, id: __drift.input.stickId }));
  await touch(cdp, 'touchEnd', []);
  await page.waitForTimeout(700);
  const rec = await stopRec(page);
  report.stick = { ...rec, edge };
  console.log('joystick', JSON.stringify(report.stick));
  ok(edge === 0, 'kenarda basınca ani dönüş yok', String(edge));
  ok(rec.peak > 0.95, 'tam yöne ulaşır');
  ok(v2.id !== null && v2.s > 0.9, 'ikinci parmak karışmadı', JSON.stringify(v2));
  ok(rec.max < 0.36, 'sıçrama yok', String(rec.max));
  ok(rec.last === 0, 'bırakınca sıfır');
  await ctx.close();
}

await b.close();
const bad = errs.filter((e) => !/favicon|net::ERR_ABORTED/.test(e));
ok(bad.length === 0, 'konsol hatası yok', bad.slice(0, 5).join(' | '));
fs.writeFileSync(`${OUT}/rapor.json`, JSON.stringify(report, null, 1));
console.log(JSON.stringify({ passes, fails }));
process.exit(fails.length ? 1 : 0);
