// İki dar boğaz: BAŞLA'ya basıştaki uzun görev ve 240. saniye ağır sahnesi. node tools/perf-heavy.mjs
import { chromium } from 'playwright-core';
const port = Number(process.argv[2] || 8080);
const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-gpu', '--disable-gpu-compositing', '--disable-accelerated-2d-canvas', '--enable-precise-memory-info'] });
const fresh = async () => {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => false }); });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  return { ctx, page, cdp };
};
const top = (profile, n = 16) => {
  const self = new Map(); const byId = new Map(profile.nodes.map((x) => [x.id, x]));
  profile.samples.forEach((id, i) => { const f = byId.get(id).callFrame; const k = `${f.functionName || '(anon)'} ${f.url.split('/').pop()}:${f.lineNumber + 1}`; self.set(k, (self.get(k) || 0) + profile.timeDeltas[i] / 1000); });
  return [...self.entries()].sort((a, c) => c[1] - a[1]).slice(0, n).map(([k, v]) => `${v.toFixed(0)}ms ${k}`);
};
// 1) Basış anı: dokunuştan sonraki 450 ms
{
  const { ctx, page, cdp } = await fresh();
  await page.goto(`http://localhost:${port}/?fx=1`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  await page.waitForTimeout(4000);
  await cdp.send('Profiler.enable');
  await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
  await page.evaluate(() => { globalThis.__l = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) __l.push([Math.round(e.startTime - globalThis.__t0), Math.round(e.duration)]); }).observe({ entryTypes: ['longtask'] }); globalThis.__t0 = performance.now(); });
  await cdp.send('Profiler.start');
  await page.evaluate(() => { const e = document.getElementById('btn-play'); e.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); e.click(); });
  await page.waitForTimeout(1800);
  const { profile } = await cdp.send('Profiler.stop');
  console.log('BASIS uzun gorevler', JSON.stringify(await page.evaluate(() => __l)));
  console.log(top(profile).join('\n'));
  await ctx.close();
}
// 2) Ağır sahne
{
  const { ctx, page, cdp } = await fresh();
  await page.goto(`http://localhost:${port}/?god=1&t=240`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  await page.evaluate(() => __drift.play());
  await page.evaluate(() => { const i = __drift.input; let t = 0; setInterval(() => { t++; i.keyL = t % 6 === 1; i.keyR = t % 6 === 4; }, 250); });
  await page.waitForTimeout(8000);
  await cdp.send('Profiler.enable');
  await cdp.send('Profiler.setSamplingInterval', { interval: 500 });
  await cdp.send('Profiler.start');
  const before = await page.evaluate(() => { const p = __drift.perf; return p.count; });
  await page.waitForTimeout(6000);
  const { profile } = await cdp.send('Profiler.stop');
  const info = await page.evaluate((before) => { const k = __drift; const p = k.perf; const n = p.count - before; let s = 0; const a = []; for (let i = 1; i <= n; i++) { const v = p.work[(p.i - i + p.work.length) % p.work.length]; s += v; a.push(v); } a.sort((x, y) => x - y); return { kare: n, isOrt: +(s / n).toFixed(1), isP95: +a[Math.floor(n * 0.95)].toFixed(1), seviye: k.quality.level, dpr: k.renderer.dpr, polis: k.game.cops.length, npc: k.game.crowd.npcCount, oto: k.game.crowd.hwCount, yaya: k.game.crowd.pedCount, par: k.game.fx.liveCount(), sync: k.renderer.syncBakes, gece: k.game.daylight.k, alert: k.game.stage }; }, before);
  console.log('AGIR', JSON.stringify(info));
  console.log(top(profile, 24).join('\n'));
  await ctx.close();
}
await b.close();
