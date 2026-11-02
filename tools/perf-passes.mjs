// Çizim katmanlarının gerçek maliyeti: her katmandan sonra tuval zorla işlenir (getImageData),
// böylece ertelenen raster süresi de doğru katmana yazılır. node tools/perf-passes.mjs [dpr=1.75]
import { chromium } from 'playwright-core';
const dpr = Number(process.argv[2] || 1.75);
const port = Number(process.argv[3] || 8080);
const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--disable-gpu', '--disable-gpu-compositing', '--disable-accelerated-2d-canvas'] });
const SCENES = { gunduz: '', gece: ';__drift.game.dayT=((0.7-__drift.cfg.day.start+1)%1)*__drift.cfg.day.length' };
for (const [name, extra] of Object.entries(SCENES)) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${port}/?god=1&t=120`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  await page.evaluate(() => __drift.play());
  await page.waitForTimeout(800);
  await page.evaluate(extra ? `(()=>{${extra.slice(1)}})()` : '0');
  const r = await page.evaluate(async (dpr) => {
    const R = __drift.renderer; const G = __drift.game;
    R.resize(innerWidth, innerHeight, dpr);
    const names = ['drawDecals', 'drawSkids', 'drawProps', 'drawPeds', 'drawNpcs', 'drawHighway', 'drawCops', 'drawPlayer', 'drawLights', 'drawFires', 'drawBalconies', 'drawTalls', 'drawParticles', 'drawNight', 'drawSirens', 'drawOverlay'];
    const proto = Object.getPrototypeOf(R);
    const t = {}; const orig = {};
    const flush = () => R.ctx.getImageData(0, 0, 1, 1);
    for (const n of names) {
      orig[n] = proto[n]; t[n] = 0;
      proto[n] = function (...a) { flush(); const s = performance.now(); const v = orig[n].apply(this, a); flush(); t[n] += performance.now() - s; return v; };
    }
    let total = 0; let frames = 0;
    await new Promise((res) => {
      const f = (now) => {
        const s = performance.now();
        flush();
        const self = performance.now();
        total += self - s;
        if (++frames < 90) requestAnimationFrame(f); else res();
      };
      requestAnimationFrame(f);
    });
    // Tam kare: ayrı ölçüm, sarmalayıcıların dışında
    for (const n of names) proto[n] = orig[n];
    let full = 0;
    for (let i = 0; i < 30; i++) { flush(); const s = performance.now(); R.draw(G, performance.now()); flush(); full += performance.now() - s; }
    // Zemin
    const base = {};
    return { dpr: R.dpr, boy: [R.canvas ? R.canvas.width : 0, R.canvas ? R.canvas.height : 0], tamKareMs: +(full / 30).toFixed(1), katman: Object.fromEntries(Object.entries(t).map(([k, v]) => [k, +(v / frames).toFixed(2)]).sort((a, c) => c[1] - a[1])), polis: G.cops.length, base };
  }, dpr);
  console.log(name, JSON.stringify(r));
  await ctx.close();
}
await b.close();
