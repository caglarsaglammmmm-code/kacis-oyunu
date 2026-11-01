// Çizim taraması: birkaç tohumda geniş alandaki her chunk gerçekten çizilir, tek hata bile yakalanır.
import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', protocolTimeout: 300000 });
const p = await b.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://localhost:8080/?god=1', { timeout: 0 });
await p.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 30000 });
const r = await p.evaluate(async () => {
  const { World } = await import('/js/world.js');
  const k = globalThis.__drift;
  const R = k.renderer;
  const fail = {};
  const seen = {};
  let n = 0; let slow = 0; let worst = 0;
  for (const seed of [1, 7, 21, 99, 12345, 777]) {
    const w = new World(seed);
    w.onRelease = (c) => R.releaseChunk(c);
    for (let cy = -16; cy < 16; cy++) {
      for (let cx = -16; cx < 16; cx++) {
        const c = w.chunk(cx, cy);
        seen[c.template] = (seen[c.template] || 0) + 1;
        const t0 = performance.now();
        try { R.bake(c); } catch (e) { R.job = null; const m = `${c.template}${c.hw ? '+otoban' : ''}: ${e.message}`; fail[m] = (fail[m] || 0) + 1; }
        const d = performance.now() - t0;
        n++; if (d > worst) worst = d; if (d > 50) slow++;
        R.releaseChunk(c);
      }
    }
  }
  return { n, seen, fail, worst: Math.round(worst), slow };
});
console.log(JSON.stringify(r));
console.log('sayfa hatası', errs.length, errs[0] || '');
await b.close();
