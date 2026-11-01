// En ağır sahnelerde kare ölçümü: otoban ve kule bölgesi, işlemci yavaşlatmalı. node tools/perf6.mjs [kat]
import puppeteer from 'puppeteer-core';
const rate = Number(process.argv[2] || 6);
const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist', '--use-angle=d3d11'], protocolTimeout: 180000 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const place = (test, x, y, ang) => `(()=>{const g=__kacis.game;const p=g.player;g.god=true;for(let r=1;r<70;r++)for(let cy=-r;cy<=r;cy++)for(let cx=-r;cx<=r;cx++){if(Math.max(Math.abs(cx),Math.abs(cy))!==r)continue;const c=g.world.chunk(cx,cy);if(!(${test}))continue;p.x=c.x+${x};p.y=c.y+${y};p.a=${ang};p.vx=p.vy=0;g.cam.x=p.x;g.cam.y=p.y;g.cam.lvx=g.cam.lvy=0;return 'ok'}return 'yok'})()`;
const S = { otoban: place('c.hw&&c.biome==="city"', 200, 700, 0), kule: place('c.template==="downtown"', 60, 200, 1.57) };
for (const n of Object.keys(S)) {
  const page = await b.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:8080/?god=1&t=240', { timeout: 0 });
  await page.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 30000 });
  await page.evaluate(() => document.getElementById('btn-play').click());
  await sleep(300);
  await page.evaluate(S[n]);
  const cdp = await page.createCDPSession();
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  await sleep(3000);
  await page.evaluate(() => { const p = __kacis.perf; p.i = 0; p.count = 0; });
  // Otoban için kaydırma sürüşü: sağ-sol dokunuş yerine doğrudan girdi
  await sleep(18000);
  const r = await page.evaluate(() => {
    const k = __kacis; const p = k.perf; const n = Math.min(p.count, p.frames.length);
    const f = Array.from(p.frames.slice(0, n)).sort((a, c) => a - c);
    const w = Array.from(p.work.slice(0, n)).sort((a, c) => a - c);
    const q = (a, x) => +a[Math.floor(a.length * x)].toFixed(1);
    return { kare: n, p50: q(f, 0.5), p95: q(f, 0.95), p99: q(f, 0.99), max: +f[f.length - 1].toFixed(0), yavas33: f.filter((v) => v > 33.4).length, is_p95: q(w, 0.95), is_p99: q(w, 0.99), is_max: +w[w.length - 1].toFixed(0), dpr: k.renderer.dpr, polis: k.game.cops.length, otoban: k.game.crowd.hwCount, npc: k.game.crowd.npcCount };
  });
  console.log(n, `${rate}x`, JSON.stringify(r), errs.length ? errs[0] : 'hata yok');
  await page.close();
}
await b.close();
