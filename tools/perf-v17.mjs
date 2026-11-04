// v16 / v17 FPS karşılaştırması: yoğun sahne (t=240), 4x CPU yavaşlatma, bot sürer.
// node tools/perf-v17.mjs <port> <etiket> [senaryolar: base,rain,snow,armed]
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const port = Number(process.argv[2] || 8080);
const tag = process.argv[3] || `p${port}`;
const only = (process.argv[4] || 'base').split(',');
const b = await chromium.launch({ channel: 'msedge', headless: true, args: process.env.LOWGPU ? ['--disable-gpu', '--disable-gpu-compositing', '--disable-accelerated-2d-canvas'] : [] });
const SC = {
  base: { weather: 'sunny', car: 'atmaca', t: 240 },
  rain: { weather: 'rain', car: 'atmaca', t: 240 },
  snow: { weather: 'snow', car: 'atmaca', t: 240 },
  fog: { weather: 'fog', car: 'atmaca', t: 240 },
  ice: { weather: 'ice', car: 'atmaca', t: 240 },
  armed: { weather: 'rain', car: 'kuzgun', t: 240, look: true, fire: true },
  // v20: anıtın önünde (gündüz ve gece). Eski sürümde anıt yoksa olduğu yerde ölçülür
  anit: { weather: 'sunny', car: 'atmaca', t: 240, memorial: true },
  anitgece: { weather: 'rain', car: 'atmaca', t: 240, memorial: true, night: true },
  // v21: yoğun sahne (çok düşman + taramalı ateş + meteor + tank), stadyum yakını gündüz/gece
  yogun: { weather: 'sunny', car: 'kuzgun', t: 400, heavy: true },
  stadyum: { weather: 'sunny', car: 'atmaca', t: 240, stadium: true },
  stadyumgece: { weather: 'sunny', car: 'atmaca', t: 240, stadium: true, night: true },
  // v23: yoğun sahne kar ve buz altında (çatı karı, sarkıtlar, çok araç, ateş, ses)
  karyogun: { weather: 'snow', car: 'kuzgun', t: 400, heavy: true },
  buzyogun: { weather: 'ice', car: 'kuzgun', t: 400, heavy: true },
};
const rows = [];
for (const name of only) {
  const s = SC[name];
  const runs = [];
  for (let rep = 0; rep < 2; rep++) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: 'tr' });
    await ctx.addInitScript((s) => {
      const d = { coins: 0, owned: ['atmaca', s.car], selected: s.car, settings: { weather: s.weather } };
      if (s.look) { d.paints = { [s.car]: 'neonpembe' }; d.custom = { [s.car]: { rim: 'altin', led: 'gokkusagi' } }; d.unlocked = { paints: ['neonpembe'], rims: ['altin'], leds: ['gokkusagi'] }; }
      localStorage.setItem('drift-lab-v1', JSON.stringify(d));
    }, s);
    const page = await ctx.newPage();
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    const cdp = await ctx.newCDPSession(page);
    await page.goto(`http://localhost:${port}/?god=1&t=${s.t}`);
    await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden, null, { timeout: 30000 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.evaluate(() => __drift.play());
    if (s.memorial) await page.evaluate((night) => { const g = __drift.game; const b = g.world.memorialBox && g.world.memorialBox(); if (night) g.dayT = 110; if (!b) return; const p = g.player; p.x = b.x + b.w / 2; p.y = b.y + b.h + 160; p.vx = 300; p.vy = 0; p.a = 0; globalThis.__back = setInterval(() => { if (g.world.memorialDist(p.x, p.y) > 420) { p.x = b.x + b.w / 2 - 300; p.y = b.y + b.h + 160; p.vx = 300; p.vy = 0; p.a = 0; } }, 100); }, !!s.night);
    if (s.stadium) await page.evaluate((night) => { const g = __drift.game; if (night) g.dayT = 110; const zs = g.world.zones ? g.world.zones().filter((z) => z.kind === 'stadium') : []; const z = zs.sort((a, b) => b.w - a.w)[0]; if (!z) return; const p = g.player; const go = () => { p.x = z.x - 60; p.y = z.y + z.h + 60; p.vx = 300; p.vy = 0; p.a = 0; }; go(); globalThis.__back = setInterval(() => { if (Math.hypot(p.x - (z.x + z.w / 2), p.y - (z.y + z.h / 2)) > z.w) go(); }, 100); }, !!s.night);
    // Yoğun: ekranda hep 8 düşman olsun (silah sürekli ateş eder), tanklar ve meteorlar zaten var
    if (s.heavy) await page.evaluate(() => { const g = __drift.game; const al = __drift.cfg.aliens.types ? Object.keys(__drift.cfg.aliens.types) : ['rover']; const T = ['car', 'swat', 'advanced', ...al]; globalThis.__heavy = setInterval(() => { const p = g.player; const vis = g.cops.filter((c) => g.onScreen(c.x, c.y, -20)).length; for (let i = vis; i < 8; i++) { const a = Math.random() * 6.283; g.spawnCop(T[i % T.length], 'chaser', p.x + Math.cos(a) * 220, p.y + Math.sin(a) * 300, a + Math.PI); } }, 700); });
    await page.evaluate((fire) => {
      const k = __drift; const g = k.game;
      globalThis.__bot = setInterval(() => {
        const p = g.player; const a = p.a;
        const open = (an) => { let n = 0; for (let d = 40; d <= 320; d += 40) { if (g.world.blockedAt(p.x + Math.cos(an) * d, p.y + Math.sin(an) * d)) break; n++; } return n; };
        const c = open(a); const l = open(a - 0.6); const r = open(a + 0.6);
        const st = c >= 5 ? 0 : l > r ? -1 : 1;
        k.input.axis = 0; k.input.keyL = st < 0; k.input.keyR = st > 0;
        if (fire && g.fire) g.fire();
      }, 120);
    }, !!s.fire);
    await page.waitForTimeout(6000);
    const res = await page.evaluate(async () => {
      const k = __drift; const g = k.game; const fr = []; let last = performance.now(); let cops = 0; let n = 0;
      const t0 = last; let shots = 0; let meteors = 0;
      while (performance.now() - t0 < 9000) {
        await new Promise(requestAnimationFrame);
        const now = performance.now(); fr.push(now - last); last = now;
        cops += g.cops.length; n++;
        shots = Math.max(shots, (g.gun ? g.gun.bullets : g.missiles || []).filter((m) => m.alive !== false && m.on !== false).length);
        meteors = Math.max(meteors, g.meteors ? g.meteors.active() : 0);
      }
      fr.sort((a, b) => a - b);
      return { fps: fr.length / 9, p95: fr[Math.floor(fr.length * 0.95)], cops: cops / n, level: k.quality.level, weather: g.weather || '-', shots, meteors };
    });
    runs.push({ ...res, errs: errs.length });
    await ctx.close();
  }
  const avg = (f) => runs.reduce((a, r) => a + r[f], 0) / runs.length;
  const row = { tag, name, fps: +avg('fps').toFixed(1), p95: +avg('p95').toFixed(1), cops: +avg('cops').toFixed(1), bullets: Math.max(...runs.map((r) => r.shots)), meteors: Math.max(...runs.map((r) => r.meteors)), level: runs.map((r) => r.level).join('/'), weather: runs[0].weather, errs: runs.reduce((a, r) => a + r.errs, 0) };
  rows.push(row);
  console.log(JSON.stringify(row));
}
fs.mkdirSync('e2e-out/v17', { recursive: true });
fs.writeFileSync(`e2e-out/v17/perf-${tag}.json`, JSON.stringify(rows, null, 1));
await b.close();
