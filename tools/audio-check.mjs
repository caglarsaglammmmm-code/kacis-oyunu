// Motor sesi ölçümü: tarayıcıda her aracı önizler, sesin çıktığını ve baskın frekansı raporlar.
import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', args: ['--autoplay-policy=no-user-gesture-required', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'], protocolTimeout: 120000 });
const p = await b.newPage();
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.goto('http://localhost:8080/?god=1');
await p.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 30000 });
const r = await p.evaluate(async () => {
  const { AudioEngine } = await import('/js/audio.js');
  const D = globalThis.__drift;
  const a = new AudioEngine();
  a.unlock();
  await a.ctx.resume();
  const an = a.ctx.createAnalyser();
  an.fftSize = 8192;
  await new Promise((r2) => setTimeout(r2, 800));
  a.master.connect(an);
  const buf = new Float32Array(an.fftSize);
  const f = new Float32Array(an.frequencyBinCount);
  const sleep = (ms) => new Promise((r2) => setTimeout(r2, ms));
  const out = [];
  for (const car of D.cfg.cars) {
    a.preview(car.engine, 'rev');
    let peak = 0; let hz = 0;
    const t0 = performance.now();
    while (performance.now() - t0 < 1100) {
      a.update(D.game, false, performance.now());
      await sleep(30);
      an.getFloatTimeDomainData(buf);
      let e = 0; for (const v of buf) e += v * v;
      const rms = Math.sqrt(e / buf.length);
      if (rms > peak) { peak = rms; an.getFloatFrequencyData(f); let m = -1e9; let mi = 0; for (let i = 2; i < f.length; i++) if (f[i] > m) { m = f[i]; mi = i; } hz = (mi * a.ctx.sampleRate) / an.fftSize; }
    }
    out.push(`${car.id.padEnd(8)} ${car.engine.kind.padEnd(7)} tepe ${peak.toFixed(3)} baskin ${hz.toFixed(0)} Hz`);
    await sleep(400);
  }
  // Sürüş taklidi: vites değişimi
  D.game.player.gas = 1;
  return out;
});
console.log(r.join('\n'));
console.log('hata', errs.length, errs[0] || '');
await b.close();
