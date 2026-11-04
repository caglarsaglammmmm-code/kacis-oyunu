// v23 tarayıcı sınaması: hava renk koruma (doygunluk, ekran ortası dikiş), çatı karı, buz sarkıtları, anıtta efekt yok,
// gizli geçit yazısı süresi, egzoz mağazası, motor sesi (çevrimdışı render). node tools/v23-test.mjs [port] [klasör] [bölümler]
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const port = Number(process.argv[2] || 8080);
const OUT = process.argv[3] || 'e2e-out/v23/play';
const only = (process.argv[4] || 'color,snow,ice,memorial,secret,shop,sound,lang').split(',');
fs.mkdirSync(OUT, { recursive: true });
const fails = [];
let passes = 0;
const ok = (c, name, extra = '') => { if (c) passes++; else { fails.push(`${name} ${extra}`); console.log('HATA', name, extra); } };
const b = await chromium.launch({ channel: 'msedge', headless: true });
const errs = [];
const report = {};

async function open({ url = '?god=1&t=0', save = null, lang = 'tr', w = 390, h = 844 } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: lang });
  const data = save || { settings: { weather: 'sunny', lang } };
  await ctx.addInitScript((d) => { try { if (!localStorage.getItem('drift-lab-v1')) localStorage.setItem('drift-lab-v1', JSON.stringify(d)); } catch {} }, data);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(`pageerror ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(`http://localhost:${port}/${url}`);
  await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden, null, { timeout: 30000 });
  return { ctx, page };
}
const play = async (page) => {
  if (process.env.FLAKES) await page.evaluate((n) => { __drift.cfg.weather.particles.snow = n; }, Number(process.env.FLAKES));
  await page.evaluate(() => __drift.play());
  await page.waitForFunction(() => __drift.game.state === 'play' && !__drift.renderer.warmingNow, null, { timeout: 20000 });
  await page.waitForTimeout(300);
};
// Sabit dünya ve sabit kamera: aynı sahne her havada
const scene = (page, { x, y, seed = 777, day = 20, area = 0 }) => page.evaluate(([x, y, seed, day, area]) => {
  const k = __drift; const g = k.game;
  if (seed && g.world.seed !== seed) g.world.reset(seed);
  if (area) k.cfg.camera.viewArea = area;
  clearInterval(globalThis.__h);
  globalThis.__h = setInterval(() => { const p = g.player; p.x = x; p.y = y; p.vx = 0; p.vy = 0; p.speed = 0; p.a = -Math.PI / 2; g.cops.length = 0; g.dayT = day; for (const q of g.crowd.peds) q.alive = false; for (const n of g.crowd.npcs) n.alive = false; for (const hw of g.crowd.hw) hw.alive = false; }, 4);
  for (const e of ['hud', 'hint']) { const el = document.getElementById(e); if (el) el.hidden = true; }
}, [x, y, seed, day, area]);
const weather = (page, w, run = 200) => page.evaluate(([w, run]) => { const g = __drift.game; g.weather = w; g.wk = 1; g.runTime = run; g.applyWeather(); }, [w, run]);
const settle = async (page) => { await page.waitForTimeout(400); await page.waitForFunction(() => !__drift.renderer.job, null, { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(900); };

// Ekran görüntüsünü sayfada çözüp ölçer: renkli piksellerin doygunluğu (sunny maskesiyle), orta dikiş
async function measure(page, png, mask) {
  return page.evaluate(async ([b64, mask]) => {
    const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode();
    const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
    const g = c.getContext('2d'); g.drawImage(img, 0, 0);
    const { data } = g.getImageData(0, 0, c.width, c.height);
    const W = c.width; const H = c.height;
    const S = new Float32Array((W >> 1) * (H >> 1));
    const SN = new Uint8Array(S.length); // Kar altında kalan (beyaz) piksel
    let i2 = 0;
    for (let y = 0; y < H - 1; y += 2) for (let x = 0; x < W - 1; x += 2) {
      const i = (y * W + x) * 4; const r = data[i]; const gg = data[i + 1]; const bb = data[i + 2];
      const mx = Math.max(r, gg, bb); const mn = Math.min(r, gg, bb);
      S[i2] = mx > 8 ? (mx - mn) / mx : 0;
      SN[i2] = (r + gg + bb) / 3 > 205 && S[i2] < 0.14 ? 1 : 0;
      i2++;
    }
    // Renkli (binalar, tabelalar, ağaçlar) pikseller: güneşli karede doygunluğu 0.25 üstü
    // Kar kenarındaki yumuşak geçiş (2 px) de kar sayılır
    const sw = W >> 1;
    const SD = SN.slice();
    for (let k = 0; k < SN.length; k++) if (SN[k]) { if (k > 0) SD[k - 1] = 1; if (k + 1 < SN.length) SD[k + 1] = 1; if (k >= sw) SD[k - sw] = 1; if (k + sw < SN.length) SD[k + sw] = 1; }
    SN.set(SD);
    // Karlı havada kar örtüsünün altındaki pikseller sayılmaz: soru, karın değmediği yerin rengi soluyor mu
    let sum = 0; let n = 0; const m = []; let snowN = 0; let maskN = 0;
    for (let k = 0; k < S.length; k++) {
      let sel = mask ? mask[k] : S[k] > 0.25;
      if (!mask) m.push(sel ? 1 : 0);
      if (sel) maskN++;
      if (sel && mask && SN[k]) { snowN++; sel = false; }
      if (sel) { sum += S[k]; n++; }
    }
    // Orta dikiş: orta sütun çiftinin satır satır farkı, rastgele sütun çiftleriyle kıyas
    const L = (x, y) => { const i = (y * W + x) * 4; return (data[i] + data[i + 1] + data[i + 2]) / 3; };
    const step = (x) => { let s = 0; let k = 0; for (let y = Math.floor(H * 0.2); y < H * 0.8; y += 2) { s += L(x, y) - L(x - 1, y); k++; } return s / k; };
    const mid = W >> 1;
    const midStep = Math.abs(step(mid));
    const ref = []; for (let q = 1; q <= 20; q++) ref.push(Math.abs(step(Math.floor((W * q) / 21))));
    ref.sort((a, b2) => a - b2);
    let lsum = 0; let rsum = 0;
    for (let y = Math.floor(H * 0.2); y < H * 0.8; y += 4) { for (let x = 0; x < mid; x += 4) lsum += L(x, y); for (let x = mid; x < W; x += 4) rsum += L(x, y); }
    return { sat: n ? sum / n : 0, n, cover: maskN ? +(snowN / maskN).toFixed(3) : 0, mask: mask ? null : m, midStep: +midStep.toFixed(2), refMedian: +ref[10].toFixed(2), lr: +((lsum - rsum) / Math.max(1, lsum + rsum) * 2).toFixed(3) };
  }, [png.toString('base64'), mask]);
}

if (only.includes('color')) {
  const { ctx, page } = await open();
  await play(page);
  const rows = {};
  let mask = null;
  for (const [i, spot] of [{ x: 700, y: 700 }, { x: 60, y: 900 }, { x: -600, y: 1500 }].entries()) {
    await scene(page, { ...spot });
    for (const w of ['sunny', 'snow', 'rain', 'fog', 'ice']) {
      await weather(page, w);
      await settle(page);
      // İki kare: neon tabela ve alev kareden kareye değişir. Maske iki güneşli karede de renkli kalan pikseller
      const png = await page.screenshot({ path: `${OUT}/renk-${i}-${w}.png` });
      await page.waitForTimeout(700);
      const png2 = await page.screenshot();
      let r;
      if (w === 'sunny') {
        const r1 = await measure(page, png, null); const r2 = await measure(page, png2, null);
        mask = r1.mask.map((v, k) => (v && r2.mask[k] ? 1 : 0));
        const a1 = await measure(page, png, mask); const a2 = await measure(page, png2, mask);
        r = { ...a1, sat: (a1.sat + a2.sat) / 2, cover: 0 };
      } else {
        const a1 = await measure(page, png, mask); const a2 = await measure(page, png2, mask);
        r = { ...a1, sat: (a1.sat + a2.sat) / 2, cover: +((a1.cover + a2.cover) / 2).toFixed(3) };
      }
      rows[`${i}-${w}`] = { sat: +r.sat.toFixed(3), kar: r.cover, midStep: r.midStep, ref: r.refMedian, lr: r.lr };
    }
    for (const w of ['snow', 'rain', 'fog', 'ice']) {
      const k = rows[`${i}-${w}`].sat / rows[`${i}-sunny`].sat;
      rows[`${i}-${w}`].oran = +k.toFixed(3);
      ok(k >= 0.85, `sahne ${i} ${w}: doygunluk güneşlinin %85'i`, k.toFixed(3));
    }
    for (const w of ['sunny', 'snow', 'rain', 'fog', 'ice']) {
      const r = rows[`${i}-${w}`];
      ok(r.midStep <= Math.max(6, r.ref * 3), `sahne ${i} ${w}: ekran ortasında dikiş yok`, JSON.stringify(r));
    }
  }
  report.color = rows;
  console.log('renk', JSON.stringify(rows));
  await ctx.close();
}

if (only.includes('snow')) {
  const { ctx, page } = await open();
  await play(page);
  await scene(page, { x: 700, y: 700 });
  for (const [run, name] of [[0, 'ince'], [400, 'kalin']]) {
    await weather(page, 'snow', run);
    await settle(page);
    await page.screenshot({ path: `${OUT}/kar-catilar-${name}.png` });
  }
  const lv = await page.evaluate(() => [__drift.renderer.snowLv]);
  ok(lv[0] === 1, 'kalınlık zamanla tavana çıktı', JSON.stringify(lv));
  // Yol rengi: yol karolarının ortalama rengi güneşliyle aynı kalır
  const road = async () => page.evaluate(async () => {
    const g = __drift.game; const r = __drift.renderer; const { GROUND } = await import('/js/config.js');
    const c = document.getElementById('game'); const d = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
    let s = 0; let n = 0;
    for (let k = 0; k < 4000; k++) {
      const px = Math.floor(Math.random() * c.width); const py = Math.floor(Math.random() * c.height);
      const wx = (px - r.ox) / r.s; const wy = (py - r.oy) / r.s;
      if (g.world.groundAt(wx, wy) !== GROUND.ROAD || g.world.blockedAt(wx, wy)) continue;
      const i = (py * c.width + px) * 4; s += (d[i] + d[i + 1] + d[i + 2]) / 3; n++;
    }
    return s / Math.max(1, n);
  });
  const snowRoad = await road();
  await page.evaluate(() => { const g = __drift.game; g.dayT = 110; });
  await settle(page);
  await page.screenshot({ path: `${OUT}/kar-gece.png` });
  await page.evaluate(() => { const g = __drift.game; g.dayT = 20; });
  await weather(page, 'sunny');
  await settle(page);
  const sunRoad = await road();
  report.road = { sunny: +sunRoad.toFixed(1), snow: +snowRoad.toFixed(1) };
  ok(Math.abs(snowRoad - sunRoad) < 22, 'yollar karla beyazlamadı', JSON.stringify(report.road));
  // Kar yalnız kar havasında
  const lvSun = await page.evaluate(() => __drift.renderer.snowLv);
  ok(lvSun === 0, 'güneşli havada kar yok');
  await ctx.close();
}

if (only.includes('ice')) {
  const { ctx, page } = await open();
  await play(page);
  await scene(page, { x: 700, y: 700, area: 600 });
  await weather(page, 'ice');
  await settle(page);
  await page.screenshot({ path: `${OUT}/buz-sarkit-gunduz.png` });
  await page.evaluate(() => { __drift.game.dayT = 110; });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/buz-sarkit-gece.png` });
  const grip = await page.evaluate(() => __drift.game.surfP[1].grip);
  ok(grip < 0.6, 'buzlu yolda tutuş düşük (mevcut sistem)', String(grip));
  await page.evaluate(() => { __drift.cfg.camera.viewArea = 740; });
  await ctx.close();
}

if (only.includes('memorial')) {
  const { ctx, page } = await open();
  await play(page);
  const bx = await page.evaluate(() => { const b = __drift.game.world.memorialBox(); return { x: b.x, y: b.y, w: b.w, h: b.h }; });
  await scene(page, { x: bx.x + bx.w / 2, y: bx.y + bx.h + 380, seed: 0, area: 1400 });
  await page.waitForFunction(() => __drift.renderer.memorial.hi, null, { timeout: 15000 });
  const crop = async (name) => {
    await page.evaluate(() => { __drift.game.dismissMemorialCard(); document.getElementById('memorial-card').hidden = true; });
    await page.waitForTimeout(900);
    const r = await page.evaluate(() => { const m = __drift.renderer.memScreen(); const d = __drift.renderer.dpr; return m && { x: m.x0 / d, y: m.y0 / d, width: (m.x1 - m.x0) / d, height: (m.y1 - m.y0) / d }; });
    const clip = { x: Math.max(0, r.x + 6), y: Math.max(0, r.y + 6), width: 260, height: 290 };
    return page.screenshot({ path: `${OUT}/anit-${name}.png`, clip });
  };
  await weather(page, 'sunny');
  const a = await crop('gunes');
  const res = {};
  for (const w of ['snow', 'ice', 'rain', 'fog']) {
    await weather(page, w);
    const p2 = await crop(w);
    // Aynı kare mi: piksel farkı (kar tanesi, ton, sis olmamalı)
    res[w] = await page.evaluate(async ([x, y]) => {
      const load = async (b64) => { const i = new Image(); i.src = `data:image/png;base64,${b64}`; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; };
      const A = await load(x); const B = await load(y);
      // Ortalama parlaklık ve doygunluk: kar tanesi, ton ya da sis olsaydı değişirdi (dalgalanan bayrak ortalamayı değiştirmez)
      const stat = (D) => { let L = 0; let S = 0; let n = 0; for (let k = 0; k < D.length; k += 8) { const r = D[k]; const g = D[k + 1]; const b2 = D[k + 2]; const mx = Math.max(r, g, b2); const mn = Math.min(r, g, b2); L += (r + g + b2) / 3; S += mx ? (mx - mn) / mx : 0; n++; } return [L / n, S / n]; };
      const [la, sa] = stat(A); const [lb, sb] = stat(B);
      return +Math.max(Math.abs(la - lb), Math.abs(sa - sb) * 100).toFixed(2);
    }, [a.toString('base64'), p2.toString('base64')]);
  }
  report.memorial = res;
  console.log('anıt fark', JSON.stringify(res));
  for (const [w, d] of Object.entries(res)) ok(d < 3, `anıtta ${w} efekti yok`, String(d));
  await page.evaluate(() => { __drift.cfg.camera.viewArea = 740; });
  await ctx.close();
}

if (only.includes('secret')) {
  const { ctx, page } = await open();
  await play(page);
  const z = await page.evaluate(() => { const z = __drift.game.world.zone('secret'); return { x: z.x, y: z.y }; });
  await page.evaluate(([x, y]) => { const p = __drift.game.player; p.x = x - 60; p.y = y - 60; p.a = Math.PI / 4; p.vx = 180; p.vy = 180; p.speed = 250; __drift.game.cops.length = 0; }, [z.x, z.y]);
  await page.waitForFunction(() => __drift.game.state === 'secret', null, { timeout: 5000 });
  const t0 = Date.now();
  const op = () => page.evaluate(() => { const e = document.getElementById('secret-msg'); return { o: +getComputedStyle(e).opacity, txt: e.querySelector('b').textContent, state: __drift.game.state, pe: getComputedStyle(e).pointerEvents }; });
  await page.waitForTimeout(1500);
  const a = await op();
  await page.waitForFunction(() => __drift.game.state === 'play', null, { timeout: 6000 });
  await page.waitForTimeout(Math.max(0, 5500 - (Date.now() - t0)));
  const bb = await op();
  await page.screenshot({ path: `${OUT}/gizli-yazi-oyunda.png` });
  await page.waitForTimeout(Math.max(0, 9000 - (Date.now() - t0)));
  const c = await op();
  report.secret = { a, bb, c };
  ok(a.o > 0.8 && a.txt.length > 5, 'yazı göründü', JSON.stringify(a));
  ok(bb.o > 0.5 && bb.state === 'play' && bb.pe === 'none', '5.5 sn sonra yazı sürüyor, oyun akıyor, dokunuşu engellemiyor', JSON.stringify(bb));
  ok(c.o < 0.05, '9 sn sonra kayboldu', JSON.stringify(c));
  await ctx.close();
}

if (only.includes('shop')) {
  const save = { coins: 2500, owned: ['atmaca', 'motor'], selected: 'atmaca', settings: { lang: 'tr', weather: 'sunny' } };
  const { ctx, page } = await open({ save });
  await page.evaluate(() => { document.getElementById('btn-garage').click(); });
  await page.waitForTimeout(500);
  await page.evaluate(() => { const t = document.querySelector('.custom-tabs [data-tab="exhaust"]'); if (t) t.click(); });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/egzoz-magaza.png` });
  const r = await page.evaluate(async () => {
    const out = {};
    const chips = [...document.querySelectorAll('#custom-grid .chip.exhaust')];
    out.n = chips.length;
    out.names = chips.map((c) => c.getAttribute('aria-label'));
    const listen = document.getElementById('custom-listen');
    out.listen = !!listen && !listen.hidden;
    chips[1].click(); await new Promise((r2) => setTimeout(r2, 200));
    out.listenText = listen ? listen.textContent : '';
    listen && listen.click();
    out.previewed = !!__drift.audio.pv && !!__drift.audio.pvExhaust;
    const buy = document.getElementById('custom-buy');
    out.buyText = buy.textContent;
    buy.click(); await new Promise((r2) => setTimeout(r2, 100));
    if (buy.textContent.includes('Onayla')) buy.click();
    await new Promise((r2) => setTimeout(r2, 200));
    out.coins = __drift.storage.data.coins;
    out.owned = __drift.storage.owns('exhaust', 'v8');
    out.sel = __drift.storage.look('atmaca').exhaust;
    return out;
  });
  await page.screenshot({ path: `${OUT}/egzoz-satin.png` });
  report.shop = r;
  console.log('mağaza', JSON.stringify(r));
  ok(r.n >= 6, 'en az 6 egzoz', String(r.n));
  ok(r.listen && /Dinle/.test(r.listenText), 'Dinle düğmesi');
  ok(r.previewed, 'önizleme çaldı');
  ok(r.coins === 1500 && r.owned, '1000 para düştü, kalıcı açıldı', JSON.stringify(r));
  ok(r.sel === 'v8', 'araca takıldı');
  // Yetersiz para
  const r2 = await page.evaluate(async () => {
    const chips = [...document.querySelectorAll('#custom-grid .chip.exhaust')];
    __drift.storage.data.coins = 300; __drift.storage.save();
    chips[2].click(); await new Promise((q) => setTimeout(q, 200));
    const buy = document.getElementById('custom-buy'); buy.click(); await new Promise((q) => setTimeout(q, 100)); if (buy.textContent.includes('Onayla')) buy.click();
    await new Promise((q) => setTimeout(q, 200));
    return { msg: document.getElementById('custom-buy').textContent, disabled: document.getElementById('custom-buy').disabled, coins: __drift.storage.data.coins, owned: __drift.storage.owns('exhaust', 'patlamali') };
  });
  ok(/Yetersiz/.test(r2.msg) && r2.coins === 300 && !r2.owned, 'yetersiz parada alınmaz', JSON.stringify(r2));
  // Kalıcılık ve araç başına seçim
  await page.reload();
  await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden);
  const r3 = await page.evaluate(() => ({ owned: __drift.storage.owns('exhaust', 'v8'), a: __drift.storage.look('atmaca').exhaust, m: __drift.storage.look('motor').exhaust }));
  ok(r3.owned && r3.a === 'v8' && r3.m === 'std', 'kalıcı ve araç başına', JSON.stringify(r3));
  // Gizli motosiklet listelenmiyor
  const hidden = await page.evaluate(() => { document.getElementById('btn-garage').click(); return [...document.querySelectorAll('#garage-list .thumb')].length; });
  ok(hidden === 14, 'gizli araç listelenmiyor', String(hidden));
  await ctx.close();
}

if (only.includes('sound')) {
  // Çevrimdışı render: her arabanın motoru sabit devirde 1 sn. Alt frekans enerjisi, tepe seviyesi
  const { ctx, page } = await open();
  const res = await page.evaluate(async () => {
    const { AudioEngine } = await import('/js/audio.js');
    const { CONFIG } = await import('/js/config.js');
    const SR = 22050;
    const render = async (engine, k, gas, exhaust) => {
      const RealAC = globalThis.AudioContext;
      globalThis.AudioContext = function () { return new OfflineAudioContext(1, SR * 1.2, SR); };
      const a = new AudioEngine();
      a.unlock();
      globalThis.AudioContext = RealAC;
      a.setEngine(engine, exhaust);
      const game = { player: { speed: k * 400, gas, drifting: false, slip: 0 }, carSpec: { maxSpeed: 400, engine }, state: 'play', daylight: { k: 0 }, weather: 'sunny', wk: 0, sirens: new Float32Array(CONFIG.sirens.length).fill(1e9), sirenClosing: 0, ghostT: 0, sirenDist: 1e9 };
      a.update(game, true, 1000);
      const buf = await a.ctx.startRendering();
      const d = buf.getChannelData(0).slice(SR * 0.3);
      let peak = 0; let all = 0; let low = 0; let lp = 0;
      const alpha = 1 - Math.exp((-2 * Math.PI * 150) / SR); // 150 Hz altı
      for (let i = 0; i < d.length; i++) { const v = d[i]; peak = Math.max(peak, Math.abs(v)); all += v * v; lp += alpha * (v - lp); low += lp * lp; }
      return { rms: Math.sqrt(all / d.length), low: Math.sqrt(low / d.length), peak };
    };
    const out = {};
    for (const c of [...CONFIG.cars, CONFIG.secretCar]) out[c.id] = await render(c.engine, 0.55, 1);
    return out;
  });
  report.sound = res;
  fs.writeFileSync(`${OUT}/ses.json`, JSON.stringify(res, null, 1));
  const peaks = Object.values(res).map((r) => r.peak);
  ok(Math.max(...peaks) < 1, 'tepe 0 dBFS altında (bozulma yok)', Math.max(...peaks).toFixed(3));
  const sig = new Set(Object.values(res).map((r) => `${r.rms.toFixed(5)}:${r.low.toFixed(5)}`));
  ok(sig.size === Object.keys(res).length, 'her araç sesi farklı');
  await ctx.close();
}

if (only.includes('lang')) {
  for (const lang of ['tr', 'en', 'ja', 'zh', 'es', 'de']) {
    const save = { coins: 3000, owned: ['atmaca'], selected: 'atmaca', settings: { lang, weather: 'sunny' } };
    const { ctx, page } = await open({ save, lang });
    await page.evaluate(() => { document.getElementById('btn-garage').click(); });
    await page.waitForTimeout(400);
    await page.evaluate(() => { const t = document.querySelector('.custom-tabs [data-tab="exhaust"]'); if (t) t.click(); });
    await page.waitForTimeout(300);
    const t = await page.evaluate(() => ({ tab: (document.querySelector('.custom-tabs [data-tab="exhaust"]') || {}).textContent, listen: document.getElementById('custom-listen').textContent, name: document.getElementById('custom-name').textContent, leak: /\b(custom|exhaust)\.[a-z]/.test(document.body.innerText) }));
    await page.screenshot({ path: `${OUT}/dil-${lang}-egzoz.png` });
    ok(t.tab && t.listen && t.name && !t.leak, `${lang}: egzoz metinleri`, JSON.stringify(t));
    console.log(lang, JSON.stringify(t));
    await ctx.close();
  }
}

await b.close();
const bad = errs.filter((e) => !/favicon|net::ERR_ABORTED/.test(e));
ok(bad.length === 0, 'konsol hatası yok', bad.slice(0, 5).join(' | '));
fs.writeFileSync(`${OUT}/rapor.json`, JSON.stringify(report, null, 1));
console.log(JSON.stringify({ passes, fails }));
process.exit(fails.length ? 1 : 0);
