// Özel yerlerin önünde, gece, 4x yavaş işlemciyle FPS. node tools/perf-landmark.mjs <port> <etiket>
// v13 ile karşılaştırma için aynı koordinatlar kullanılır (kolej her iki sürümde aynı chunk'ta).
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const port = Number(process.argv[2] || 8080);
const tag = process.argv[3] || `p${port}`;
const b = await chromium.launch({ channel: 'msedge', headless: true, args: process.env.LOWGPU ? [] : ['--enable-gpu-rasterization', '--ignore-gpu-blocklist', '--use-angle=d3d11'] });
const rows = [];
for (const [name, night] of [['kolej-gunduz', false], ['kolej-gece', true], ['kule-gece', true]]) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'tr-TR' });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await page.goto(`http://localhost:${port}/?god=1&t=120`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluate(() => __drift.play());
  await page.waitForFunction(() => __drift.game.state === 'play');
  await page.evaluate(({ name, night }) => {
    const k = __drift; const g = k.game; const w = g.world;
    const m = name.startsWith('kule') && w.landmarkList ? w.landmarkList().find((o) => o.id === 'kule') : w.sistemChunk();
    const C = 40 * 32;
    const p = g.player;
    // Yapının güneyindeki ana yoldan doğuya doğru geçer
    p.x = m.cx * C + 60; p.y = (m.cy + 1) * C + 60; p.a = 0; p.vx = 300; p.vy = 0;
    g.cam.x = p.x; g.cam.y = p.y;
    if (night) g.dayT = 100;
    let s = 0;
    globalThis.__bot = setInterval(() => {
      const a = p.a;
      const open = (an) => { let n = 0; for (let d = 40; d <= 320; d += 40) { if (g.world.blockedAt(p.x + Math.cos(an) * d, p.y + Math.sin(an) * d)) break; n++; } return n; };
      const c = open(a); const l = open(a - 0.6); const r = open(a + 0.6);
      s = c >= 5 ? 0 : l > r ? -1 : 1;
      k.input.axis = 0; k.input.keyL = s < 0; k.input.keyR = s > 0;
    }, 120);
  }, { name, night });
  await page.waitForTimeout(3000);
  const res = await page.evaluate(async () => {
    const P = __drift.perf; const i0 = P.count;
    const fr = []; let last = performance.now(); const t0 = last;
    while (performance.now() - t0 < 8000) {
      await new Promise(requestAnimationFrame);
      const now = performance.now(); fr.push(now - last); last = now;
    }
    fr.sort((a, b) => a - b);
    // Kare başına oyun + çizim işi (ms): ekran tazelemesine takılmayan ölçü
    const n = Math.min(P.count - i0, P.work.length);
    const work = [];
    for (let k = 1; k <= n; k++) work.push(P.work[(P.i - k + P.work.length) % P.work.length]);
    work.sort((a, b) => a - b);
    const avg = work.reduce((a, b) => a + b, 0) / (work.length || 1);
    return { fps: Math.round(fr.length / 8), p95: +fr[Math.floor(fr.length * 0.95)].toFixed(1), workAvg: +avg.toFixed(2), workP95: +work[Math.floor(work.length * 0.95)].toFixed(2), level: __drift.quality.level };
  });
  rows.push({ name, ...res });
  console.log(tag, name, JSON.stringify(res));
  await ctx.close();
}
fs.mkdirSync('e2e-out/v14', { recursive: true });
fs.writeFileSync(`e2e-out/v14/perf-yer-${tag}.json`, JSON.stringify(rows, null, 1));
await b.close();
