// Gerçek tarayıcıda performans profili: node tools/perf-profile.mjs <etiket> [kat=4] [port=8080]
// Sonuç e2e-out/perf/<etiket>.json. Oyun kodundan bağımsız ölçer: rAF aralıkları, uzun görevler,
// V8 GC süreleri (trace), yığın artışı ve CPU örnekleme profili.
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const label = process.argv[2] || 'olcum';
const rate = Number(process.argv[3] || 4);
const port = Number(process.argv[4] || 8080);
const dir = 'e2e-out/perf';
fs.mkdirSync(dir, { recursive: true });

// LOWGPU=1: ekran kartı kapalı, çizim işlemcide. Zayıf telefon GPU'suna daha yakın, darboğazı gösterir.
const gpuArgs = process.env.LOWGPU ? ['--disable-gpu', '--disable-gpu-compositing', '--disable-accelerated-2d-canvas'] : ['--enable-gpu-rasterization', '--ignore-gpu-blocklist', '--use-angle=d3d11'];
const browser = await chromium.launch({ channel: 'msedge', headless: true, args: [...gpuArgs, '--enable-precise-memory-info'] });

const probe = () => {
  const p = { raf: [], long: [], marks: {} };
  globalThis.__probe = p;
  let last = 0;
  const tick = (t) => { if (last) p.raf.push([t, t - last]); last = t; requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) p.long.push([e.startTime, e.duration]); }).observe({ entryTypes: ['longtask'] });
  } catch { /* desteklenmiyor */ }
};

const stat = (rows) => {
  const v = rows.map((r) => r[1]).sort((a, b) => a - b);
  if (!v.length) return null;
  const q = (x) => +v[Math.min(v.length - 1, Math.floor(v.length * x))].toFixed(1);
  const sum = v.reduce((a, b) => a + b, 0);
  return { kare: v.length, fps: +(1000 * v.length / sum).toFixed(1), p50: q(0.5), p95: q(0.95), p99: q(0.99), enKotu: +v[v.length - 1].toFixed(1), kaba33: v.filter((d) => d > 33.4).length, kaba50: v.filter((d) => d > 50).length, kaba100: v.filter((d) => d > 100).length };
};

async function scenario(name, run) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: Number(process.env.DSF || 3), isMobile: true, hasTouch: true });
  await ctx.addInitScript(probe);
  await ctx.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => false }); });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  const out = await run(page, cdp);
  out.hatalar = errors;
  await ctx.close();
  return { name, ...out };
}

const between = (raf, a, b) => raf.filter((r) => r[0] >= a && r[0] < b);
const snapshot = (page) => page.evaluate(() => { const p = __probe; return { raf: p.raf, long: p.long, marks: p.marks, heap: performance.memory ? performance.memory.usedJSHeapSize : 0 }; });

async function waitMenu(page) {
  await page.waitForFunction(() => !document.getElementById('menu').hidden, null, { timeout: 60000 });
}

// Oyunun sürüşe gerçekten geçtiği anı işaretler
const markPlay = (page) => page.evaluate(() => new Promise((res) => {
  const iv = setInterval(() => {
    const g = __drift.game;
    if (g.state === 'play' && !g.drop) { clearInterval(iv); __probe.marks.play = performance.now(); res(); }
  }, 16);
}));

// Basit şoför: yolda kalmak için sağ-sol tuşlarını dönüşümlü basar
const bot = (page) => page.evaluate(() => {
  const inp = __drift.input; let t = 0;
  __probe.bot = setInterval(() => { t++; inp.keyL = t % 6 === 1; inp.keyR = t % 6 === 4; }, 250);
});

async function profiled(cdp, run) {
  await cdp.send('Profiler.enable');
  await cdp.send('Profiler.setSamplingInterval', { interval: 500 });
  await cdp.send('Profiler.start');
  await run();
  const { profile } = await cdp.send('Profiler.stop');
  const self = new Map();
  const byId = new Map(profile.nodes.map((n) => [n.id, n]));
  const dts = profile.timeDeltas;
  profile.samples.forEach((id, i) => {
    const n = byId.get(id); const f = n.callFrame;
    const key = `${f.functionName || '(anon)'} ${f.url.split('/').pop()}:${f.lineNumber + 1}`;
    self.set(key, (self.get(key) || 0) + dts[i] / 1000);
  });
  const total = [...self.values()].reduce((a, b) => a + b, 0);
  return [...self.entries()].sort((a, b) => b[1] - a[1]).slice(0, 26).map(([k, v]) => `${(v / total * 100).toFixed(1)}% ${v.toFixed(0)}ms ${k}`);
}

const results = [];

// A: soğuk açılış, menü, BAŞLA, oynanışın ilk 5 saniyesi + 25 sn sürüş
results.push(await scenario('soguk-baslat', async (page, cdp) => {
  const t0 = Date.now();
  await page.goto(`http://localhost:${port}/?fx=1`, { timeout: 0 });
  await waitMenu(page);
  const menuAt = Date.now() - t0;
  await page.waitForTimeout(2500);
  let top = [];
  await page.evaluate(() => { __probe.marks.press = performance.now(); });
  top = await profiled(cdp, async () => {
    await page.touchscreen.tap(195, 700).catch(() => {});
    await page.evaluate(() => { if (__drift.game.state === 'attract') document.getElementById('btn-play').click(); });
    await markPlay(page);
    await bot(page);
    await page.waitForTimeout(5000);
  });
  await page.waitForTimeout(20000);
  const heapA = await page.evaluate(() => performance.memory.usedJSHeapSize);
  const s = await snapshot(page);
  const { press, play } = s.marks;
  const end = s.raf[s.raf.length - 1][0];
  const lastLong = s.long.filter((l) => l[0] >= press);
  return {
    menuAcilisMs: menuAt,
    gecis: stat(between(s.raf, press, play)),
    ilk5sn: stat(between(s.raf, play, play + 5000)),
    surus: stat(between(s.raf, play + 5000, end)),
    ilk5snTakilma: between(s.raf, play, play + 5000).filter((r) => r[1] > 33.4).map((r) => [Math.round(r[0] - play), Math.round(r[1])]).slice(0, 30),
    uzunGorev: { adet: lastLong.length, toplamMs: Math.round(lastLong.reduce((a, l) => a + l[1], 0)), enUzun: Math.round(Math.max(0, ...lastLong.map((l) => l[1]))) },
    yigin: { mb: +(heapA / 1048576).toFixed(1) },
    dpr: await page.evaluate(() => __drift.renderer.dpr),
    enPahaliIlk5sn: top,
  };
}));

// B: "Tekrar dene" yolu: hazır dünya yok, doğrudan play()
results.push(await scenario('tekrar-dene', async (page) => {
  await page.goto(`http://localhost:${port}/?fx=1`, { timeout: 0 });
  await waitMenu(page);
  await page.waitForTimeout(1000);
  await page.evaluate(() => { __drift.play(); });
  await page.waitForTimeout(3000);
  await page.evaluate(() => { __probe.marks.press = performance.now(); __drift.play(); __probe.marks.play = performance.now(); });
  await page.waitForTimeout(5000);
  const s = await snapshot(page);
  return { eszamanliPlayMs: Math.round(s.marks.play - s.marks.press), ilk5sn: stat(between(s.raf, s.marks.press, s.marks.press + 5000)) };
}));

// C: uzun sürüşte bellek ve GC: trace ile V8 toplama süreleri
results.push(await scenario('surus-gc', async (page, cdp) => {
  await page.goto(`http://localhost:${port}/?god=1&t=240`, { timeout: 0 });
  await waitMenu(page);
  await page.evaluate(() => __drift.play());
  await bot(page);
  await page.waitForTimeout(4000);
  await cdp.send('HeapProfiler.collectGarbage');
  const before = await page.evaluate(() => performance.memory.usedJSHeapSize);
  const tracePath = `${dir}/${label}-trace.json`;
  await browser.startTracing(page, { path: tracePath, categories: ['disabled-by-default-v8.gc', 'v8', 'devtools.timeline'] });
  await page.evaluate(() => { __probe.raf.length = 0; });
  await page.waitForTimeout(25000);
  await browser.stopTracing();
  const after = await page.evaluate(() => performance.memory.usedJSHeapSize);
  await cdp.send('HeapProfiler.collectGarbage');
  const kept = await page.evaluate(() => performance.memory.usedJSHeapSize);
  const s = await snapshot(page);
  const trace = JSON.parse(fs.readFileSync(tracePath, 'utf8'));
  const events = trace.traceEvents || trace;
  const gc = { MinorGC: [0, 0, 0], MajorGC: [0, 0, 0] };
  for (const e of events) {
    if (e.ph === 'X' && gc[e.name]) { const ms = e.dur / 1000; gc[e.name][0]++; gc[e.name][1] += ms; gc[e.name][2] = Math.max(gc[e.name][2], ms); }
  }
  fs.unlinkSync(tracePath);
  return {
    kare: stat(s.raf),
    artisMBsn: +(((after - before) / 1048576) / 25).toFixed(2),
    kaliciArtisMB: +((kept - before) / 1048576).toFixed(2),
    gc: { minorAdet: gc.MinorGC[0], minorToplamMs: Math.round(gc.MinorGC[1]), minorEnUzun: +gc.MinorGC[2].toFixed(1), majorAdet: gc.MajorGC[0], majorToplamMs: Math.round(gc.MajorGC[1]), majorEnUzun: +gc.MajorGC[2].toFixed(1) },
    polis: await page.evaluate(() => __drift.game.cops.length),
    parcacik: await page.evaluate(() => __drift.game.fx.liveCount()),
  };
}));

await browser.close();
const file = `${dir}/${label}.json`;
fs.writeFileSync(file, JSON.stringify({ label, rate, results }, null, 1));
console.log(JSON.stringify(results, null, 1));
