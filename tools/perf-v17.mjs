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
      const t0 = last; let shots = 0;
      while (performance.now() - t0 < 9000) {
        await new Promise(requestAnimationFrame);
        const now = performance.now(); fr.push(now - last); last = now;
        cops += g.cops.length; n++;
        shots = Math.max(shots, (g.missiles || []).filter((m) => m.alive !== false && m.on !== false).length);
      }
      fr.sort((a, b) => a - b);
      return { fps: fr.length / 9, p95: fr[Math.floor(fr.length * 0.95)], cops: cops / n, level: k.quality.level, weather: g.weather || '-' };
    });
    runs.push({ ...res, errs: errs.length });
    await ctx.close();
  }
  const avg = (f) => runs.reduce((a, r) => a + r[f], 0) / runs.length;
  const row = { tag, name, fps: +avg('fps').toFixed(1), p95: +avg('p95').toFixed(1), cops: +avg('cops').toFixed(1), level: runs.map((r) => r.level).join('/'), weather: runs[0].weather, errs: runs.reduce((a, r) => a + r.errs, 0) };
  rows.push(row);
  console.log(JSON.stringify(row));
}
fs.mkdirSync('e2e-out/v17', { recursive: true });
fs.writeFileSync(`e2e-out/v17/perf-${tag}.json`, JSON.stringify(rows, null, 1));
await b.close();
