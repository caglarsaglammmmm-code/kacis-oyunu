// Tarayıcıda uçtan uca v13 sınaması: gizli kod (gerçek dokunuş ve tuş), tabela konumu, polis sayısı ve FPS.
// node tools/pursuit-test.mjs [port] [bölüm: code,signs,perf]. Çıktı: e2e-out/v13
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const port = Number(process.argv[2] || 8080);
const only = (process.argv[3] || 'code,signs,perf').split(',');
const OUT = 'e2e-out/v13';
fs.mkdirSync(OUT, { recursive: true });
const fails = [];
let passes = 0;
const ok = (c, name, extra = '') => { if (c) passes++; else { fails.push(`${name} ${extra}`); console.log('HATA', name, extra); } };
const b = await chromium.launch({ channel: 'msedge', headless: true, args: process.env.LOWGPU ? [] : ['--enable-gpu-rasterization', '--ignore-gpu-blocklist', '--use-angle=d3d11'] });
const logs = [];

async function open(w, h, mobile, url = '') {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, locale: 'tr-TR' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => logs.push(`pageerror ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') logs.push(m.text()); });
  await page.goto(`http://localhost:${port}/${url}`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  await page.waitForTimeout(600);
  return { ctx, page, cdp: mobile ? await ctx.newCDPSession(page) : null };
}
const setControl = (page, m) => page.evaluate((m) => { const k = __drift; k.storage.data.settings.control = m; k.storage.save(); k.input.setMode(m); k.controls.setMode(m); }, m);
const start = async (page) => { await page.evaluate(() => __drift.play()); await page.waitForFunction(() => __drift.game.state === 'play' && !__drift.renderer.warmingNow); await page.waitForTimeout(500); };
const cheat = (page) => page.evaluate(() => ({ on: __drift.game.cheat, i: __drift.input.code.i, badge: !document.getElementById('cheat-badge').hidden, msg: document.querySelector('#cheat-msg span').textContent, shown: getComputedStyle(document.getElementById('cheat-msg')).opacity }));
const touch = (cdp, type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((p) => ({ x: p.x, y: p.y, id: 1 })) });

const SEQ = [...'LLRRLRLRLLRR']; // 12 basışlık kod
const OLD = [...'LLRRLRLR']; // Eski 8'li kod artık açmaz
const WRONG = [...'LRLRLRLRLRLR'];
const gap = 170;

async function pressAll(page, cdp, mode, seq, g) {
  const dims = await page.evaluate(() => { const w = __drift.input.wheel; return { W: innerWidth, H: innerHeight, cx: w.cx, cy: w.cy, r: w.r }; });
  for (const d of seq) {
    if (mode === 'key') {
      await page.keyboard.press(d === 'L' ? 'ArrowLeft' : 'KeyD', { delay: 40 });
    } else if (mode === 'zones') {
      const p = { x: d === 'L' ? dims.W * 0.2 : dims.W * 0.8, y: dims.H * 0.6 };
      await touch(cdp, 'touchStart', [p]);
      await page.waitForTimeout(50);
      await touch(cdp, 'touchEnd', []);
    } else if (mode === 'stick') {
      const c = { x: dims.W * 0.25, y: dims.H * 0.65 };
      await touch(cdp, 'touchStart', [c]);
      await touch(cdp, 'touchMove', [{ x: c.x + (d === 'L' ? -60 : 60), y: c.y }]);
      await page.waitForTimeout(110);
      await touch(cdp, 'touchEnd', []);
      await page.waitForTimeout(90);
    } else {
      const R = dims.r * 0.72;
      const at = (deg) => { const a = (deg - 90) * Math.PI / 180; return { x: dims.cx + Math.cos(a) * R, y: dims.cy + Math.sin(a) * R }; };
      await touch(cdp, 'touchStart', [at(0)]);
      for (let k = 1; k <= 8; k++) await touch(cdp, 'touchMove', [at((d === 'L' ? -1 : 1) * k * 10)]);
      await page.waitForTimeout(70);
      await touch(cdp, 'touchEnd', []);
      await page.waitForTimeout(220);
    }
    await page.waitForTimeout(g);
  }
}

async function testMode(mode, mobile) {
  const { ctx, page, cdp } = await open(mobile ? 390 : 1280, mobile ? 844 : 720, mobile, '?god=1');
  if (mode !== 'key') await setControl(page, mode);
  await start(page);
  await pressAll(page, cdp, mode, WRONG, gap);
  ok(!(await cheat(page)).on, `${mode}: yanlış kod açmaz`);
  await page.waitForTimeout(2150);
  await pressAll(page, cdp, mode, OLD, gap);
  await page.waitForTimeout(400);
  ok(!(await cheat(page)).on, `${mode}: eski 8 basışlık kod açmaz`);
  await page.waitForTimeout(2150);
  await pressAll(page, cdp, mode, [...SEQ.slice(0, 9), 'R', ...SEQ.slice(9)], gap);
  ok(!(await cheat(page)).on, `${mode}: araya yanlış basış girince açmaz`);
  await page.waitForTimeout(2150);
  await pressAll(page, cdp, mode, SEQ.slice(0, 4), gap);
  ok((await cheat(page)).i >= 3, `${mode}: sıra ilerliyor`, JSON.stringify(await cheat(page)));
  await page.waitForTimeout(2300);
  await pressAll(page, cdp, mode, SEQ.slice(4), gap);
  ok(!(await cheat(page)).on, `${mode}: süre aşımı sıfırlar`);
  await page.waitForTimeout(2150);
  await pressAll(page, cdp, mode, SEQ, gap);
  await page.waitForTimeout(350);
  const on = await cheat(page);
  ok(on.on && on.badge, `${mode}: doğru kod açar`, JSON.stringify(on));
  ok(on.msg === 'Aferin, hile kodunu buldun la!' && Number(on.shown) > 0.8, `${mode}: mesaj görünür`, JSON.stringify(on));
  if (mode === 'zones') await page.screenshot({ path: `${OUT}/hile-acik-mesaj.png` });
  // Kesin sınır: oyun saati elle ilerletilir, basışlar gerçek giriş yolundan geçer
  if (mode === 'key') {
    const t = await page.evaluate(() => {
      const i = __drift.input; const g = __drift.game; const out = {};
      for (const gap of [1.9, 2.0, 0.3]) {
        if (g.cheat) g.toggleCheat();
        i.code.reset();
        let first = true;
        for (const d of 'LLRRLRLRLLRR') { if (!first) i.clock += gap; first = false; const k = d === 'L' ? 'ArrowLeft' : 'ArrowRight'; i.key(k, true); i.key(k, false); }
        out[gap] = g.cheat;
      }
      if (g.cheat) g.toggleCheat();
      return out;
    });
    ok(t['1.9'] === true && t['2'] === false && t['0.3'] === true, 'klavye: 1,9 sn açar, 2,0 sn açmaz, hızlı açar', JSON.stringify(t));
    await page.evaluate(() => { if (!__drift.game.cheat) __drift.game.toggleCheat(); });
    await page.waitForTimeout(2800);
  }
  await page.waitForTimeout(2800);
  ok(Number((await cheat(page)).shown) < 0.05, `${mode}: mesaj kaybolur`);
  await pressAll(page, cdp, mode, SEQ, gap);
  await page.waitForTimeout(300);
  const off = await cheat(page);
  ok(!off.on && !off.badge && off.msg === 'Hile kapatıldı', `${mode}: ikinci kez kapanır`, JSON.stringify(off));
  await ctx.close();
}

async function testProof() {
  const { ctx, page } = await open(390, 844, true, '?t=300');
  await start(page);
  // Yakındaki bir yüksek binanın içinden geçir
  const r = await page.evaluate(async () => {
    const k = __drift; const g = k.game; const p = g.player;
    g.toggleCheat();
    const hitBefore = g.damage;
    let rect = null;
    const cx = Math.floor(p.x / (40 * 32)); const cy = Math.floor(p.y / (40 * 32));
    for (let dx = -2; dx <= 2 && !rect; dx++) for (let dy = -2; dy <= 2 && !rect; dy++) {
      const c = g.world.chunk(cx + dx, cy + dy);
      rect = c.talls.find((t) => t.alive && t.w > 90);
    }
    p.x = rect.x - 90; p.y = rect.y + rect.h / 2; p.a = 0; p.vx = 330; p.vy = 0; p.speed = 330;
    g.cam.x = p.x; g.cam.y = p.y;
    return { hitBefore, rx: rect.x, rw: rect.w };
  });
  const samples = [];
  for (let i = 0; i < 14; i++) {
    await page.waitForTimeout(100);
    samples.push(await page.evaluate(() => { const g = __drift.game; const p = g.player; const blocked = g.world.blockedAt(p.x, p.y); return { x: p.x, blocked, phasing: g.phasing, speed: p.speed, damage: g.damage, camD: Math.hypot(g.cam.x - p.x, g.cam.y - p.y) }; }));
    if (i === 4) await page.screenshot({ path: `${OUT}/hile-bina-icinde.png` });
  }
  ok(samples.some((s) => s.blocked), 'hile: araba bina içinden geçti');
  ok(samples.some((s) => s.phasing), 'hile: içeride yarı saydam çizim');
  ok(samples.every((s) => s.damage === 0), 'hile: hasar yok');
  ok(Math.min(...samples.filter((s) => s.blocked).map((s) => s.speed)) > 200, 'hile: yavaşlamadı', JSON.stringify(samples.map((s) => s.speed | 0)));
  ok(Math.max(...samples.map((s) => s.camD)) < 420, 'hile: kamera takılmadı');
  // Polisleri üstüne sür: dokunamaz
  const cops = await page.evaluate(async () => {
    const g = __drift.game; const p = g.player;
    const t0 = performance.now(); let most = 0; let touches = 0;
    while (performance.now() - t0 < 5000) {
      await new Promise(requestAnimationFrame);
      most = Math.max(most, g.cops.length);
      for (const c of g.cops) { if (c.flying || c.type === 'tank') continue; if (Math.hypot(c.x - p.x, c.y - p.y) < 45) touches++; }
      const c = g.cops.find((k) => !k.flying && k.type !== 'tank');
      if (c) { c.x = p.x + 20; c.y = p.y + 8; c.vx = p.vx; c.vy = p.vy; }
    }
    return { most, touches, damage: g.damage, state: g.state };
  });
  ok(cops.touches > 50 && cops.damage === 0 && cops.state === 'play', 'hile: polis yakalayamıyor', JSON.stringify(cops));
  ok(cops.most >= 4, 'hile: polisler görünür', JSON.stringify(cops));
  // Kayıt yok, menüden dönünce kapalı
  const rec = await page.evaluate(async () => {
    const k = __drift; const g = k.game; const d = k.storage.data; const before = { s: d.bestScore, t: d.bestTime, c: d.coins };
    g.score = 9e7; g.time = 9999; g.state = 'dying'; g.dyingT = 0.01;
    await new Promise((r) => setTimeout(r, 300));
    return { before, after: { s: d.bestScore, t: d.bestTime, c: d.coins }, st: g.state };
  });
  ok(JSON.stringify(rec.before) === JSON.stringify(rec.after) && rec.st === 'over', 'hile: rekor ve coin yazılmadı', JSON.stringify(rec));
  await page.evaluate(() => __drift.ui.show('menu'));
  await start(page);
  ok(!(await cheat(page)).on, 'yeni oyunda hile kapalı');
  const stored = await page.evaluate(() => localStorage.length ? JSON.stringify({ ...localStorage }).toLowerCase().includes('cheat') : false);
  ok(!stored, 'hile kaydedilmiyor');
  const shown = await page.evaluate(() => { const t = ['menu', 'settings', 'pause', 'garage'].map((i) => document.getElementById(i)?.textContent || '').join(' ').toLocaleLowerCase('tr'); return t.includes('hile'); });
  ok(!shown, 'menülerde hile yazmıyor');
  await ctx.close();
}

// Gece: her tabela kutusu gündüzle aynı yerde, ışıltı merkezi yazıyla aynı
async function testSigns() {
  const { ctx, page } = await open(844, 390, true, '?god=1');
  await page.setViewportSize({ width: 1000, height: 1000 });
  await start(page);
  const want = { banka: /Bankası|Tasarruf|Kredi|Yatırım/, market: /Market|Gross|Mağaza/, kafe: /Kafe|Çay/, doner: /[Dd]öner/, oyun: /Oyun|Bilgisayar/ };
  const found = await page.evaluate((src) => {
    const g = __drift.game; const res = {};
    const re = Object.fromEntries(Object.entries(src).map(([k, v]) => [k, new RegExp(v)]));
    for (let cx = -14; cx <= 14; cx++) for (let cy = -14; cy <= 14; cy++) {
      const c = g.world.chunk(cx, cy);
      for (let i = 0; i < c.rectCount; i++) {
        const r = c.rects[i];
        if (r.kind !== 'building' || !r.sign) continue;
        for (const k in re) {
          if (!re[k].test(r.sign)) continue;
          const key = `${k}${r.tall > 0 ? '-yuksek' : '-alcak'}`;
          if (!res[key]) res[key] = { x: r.x, y: r.y, w: r.w, h: r.h, sign: r.sign, tall: r.tall };
        }
      }
    }
    g.world.update(g.player.x, g.player.y);
    return res;
  }, Object.fromEntries(Object.entries(want).map(([k, v]) => [k, v.source])));
  console.log('tabelalar:', Object.keys(found).join(' '));
  for (const k of Object.keys(want)) ok(Object.keys(found).some((n) => n.startsWith(k)), `tabela bulundu: ${k}`);

  const install = () => page.evaluate(() => {
    const k = __drift; const ctx = k.renderer.ctx;
    if (!ctx.__orig) { ctx.__orig = ctx.drawImage.bind(ctx); ctx.drawImage = (...a) => { if (ctx.__rec) ctx.__rec.push({ img: a[0], a: a.slice(1), t: ctx.getTransform().a, op: ctx.globalCompositeOperation }); return ctx.__orig(...a); }; }
  });
  await install();
  const measure = (key, loc, dayT, off) => page.evaluate(({ loc, dayT, off }) => {
    const k = __drift; const g = k.game; const r0 = k.renderer;
    // Konum ölçülür: otomatik kalite zorlamalı hazırlığı yavaşlık sanıp ışıltıyı kapatmasın
    k.quality.setMode('high'); r0.lod = k.LEVELS[0];
    g.state = 'over'; // Yalnız çizim: adım atılmaz
    const cx = loc.x + loc.w / 2 + off[0]; const cy = loc.y + loc.h + off[1];
    const p = g.player; p.x = cx; p.y = cy; p.vx = 0; p.vy = 0; p.speed = 0;
    g.cam.x = cx; g.cam.y = cy; g.cam.lvx = 0; g.cam.lvy = 0; g.cam.shake = 0; g.cam.kx = 0; g.cam.ky = 0; g.cam.sx = 0; g.cam.sy = 0;
    g.world.update(cx, cy);
    g.dayT = dayT;
    g.state = 'play';
    g.tick(0, 0, false); g.state = 'play';
    g.cops.length = 0;
    g.cam.x = cx; g.cam.y = cy; g.cam.sx = 0; g.cam.sy = 0;
    let dl = g.daylight;
    const Y = k.cfg.day; // dayState gün saati dt ile güncellenir: elle hesaplanır
    g.daylight.k = dayT > 90 ? 1 : 0; g.daylight.a = dayT > 90 ? 0.62 : 0; g.daylight.r = 10; g.daylight.g = 14; g.daylight.b = 46;
    r0.warm(g, 2, 2000);
    r0.ctx.__rec = [];
    r0.draw(g, 1000);
    const rec = r0.ctx.__rec; r0.ctx.__rec = null;
    let rect = null;
    const tx = Math.floor((loc.x + 1) / (40 * 32)); const ty = Math.floor((loc.y + 1) / (40 * 32));
    const c = g.world.chunk(tx, ty);
    for (let i = 0; i < c.rectCount; i++) if (c.rects[i].x === loc.x && c.rects[i].y === loc.y) rect = c.rects[i];
    const img = rect.signImg;
    // Aynı ad ve renkteki tabelalar önbellekte aynı görüntüyü paylaşabilir: yalnız bu binanın yakınındakiler
    const mx = loc.x + loc.w / 2; const my = loc.y + loc.h / 2; const R = Math.max(loc.w, loc.h) * 0.6 + 260;
    const draws = rec.filter((e) => e.img === img && Math.hypot(e.a[0] + e.a[2] / 2 - mx, e.a[1] + e.a[3] / 2 - my) < R).map((e) => e.a.map((v) => +v.toFixed(2)));
    const halos = rec.filter((e) => e.img !== img && e.a.length === 4 && e.img.width === 64 && e.op === 'lighter').map((e) => e.a);
    return { draws, halos, tall: rect.tall, tX: rect.tX0, roof: rect.tall ? [rect.tX0, rect.tX1, rect.tY0, rect.tY1] : null, y1: rect.y + rect.h };
  }, { loc, dayT, off });

  for (const [key, loc] of Object.entries(found)) {
    for (const [name, off] of [['guney', [0, 180]], ['dogu', [260, -40]], ['bati', [-260, -40]], ['kuzey', [0, -loc.h - 170]]]) {
      const day = await measure(key, loc, 10, off);
      const night = await measure(key, loc, 100, off);
      if (loc.tall > 0) {
        ok(day.draws.length >= 1, `${key} ${name}: gündüz tabela çiziliyor`);
        const d = day.draws[0];
        ok(night.draws.length >= 2 && night.draws.every((n) => n.every((v, i) => Math.abs(v - d[i]) < 0.6)), `${key} ${name}: gece yeri gündüzle aynı`, JSON.stringify({ d, n: night.draws }));
      } else {
        // Gündüz tabela zemine işli: beklenen kutu parça ölçeğiyle aynıdır
        ok(night.draws.length >= 1, `${key} ${name}: gece yazısı var`);
        const n = night.draws[0];
        ok(n[0] >= loc.x - 2 && n[0] + n[2] <= loc.x + loc.w + 2 && n[1] >= loc.y - 2 && n[1] + n[3] <= loc.y + loc.h + 2, `${key} ${name}: yazı bina içinde`, JSON.stringify({ n, loc }));
      }
      if (night.draws.length) {
        const n = night.draws[0];
        const mx = n[0] + n[2] / 2; const my = n[1] + n[3] / 2;
        const glow = night.halos.find((a) => Math.abs(a[0] + a[2] / 2 - mx) < 1 && Math.abs(a[1] + a[3] / 2 - my) < 1);
        ok(!!glow, `${key} ${name}: ışıltı yazının tam arkasında`);
      }
      await page.waitForTimeout(40);
      if (name === 'guney' || name === 'dogu') await page.screenshot({ path: `${OUT}/gece-${key}-${name}.png` });
    }
  }
  await ctx.close();
}

// FPS ve polis sayısı. Bot yolda sürer, ölümsüz. ?t ile süre seçilir
async function perf(tag) {
  const rows = [];
  for (const t of [30, 120, 240, 330]) {
    const { ctx, page, cdp } = await open(390, 844, true, `?god=1&t=${t}`);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await start(page);
    await page.evaluate(() => {
      const k = __drift; const g = k.game; let s = 0; let i = 0;
      globalThis.__bot = setInterval(() => {
        const p = g.player; const a = p.a;
        const open = (an) => { let n = 0; for (let d = 40; d <= 320; d += 40) { if (g.world.blockedAt(p.x + Math.cos(an) * d, p.y + Math.sin(an) * d)) break; n++; } return n; };
        const c = open(a); const l = open(a - 0.6); const r = open(a + 0.6);
        s = c >= 5 ? 0 : l > r ? -1 : 1; i++;
        k.input.axis = 0; k.input.keyL = s < 0; k.input.keyR = s > 0;
      }, 120);
    });
    await page.waitForTimeout(6000);
    const res = await page.evaluate(async () => {
      const k = __drift; const g = k.game; const fr = []; let last = performance.now(); let cops = 0; let screen = 0; let n = 0; let max = 0;
      const t0 = last;
      while (performance.now() - t0 < 9000) {
        await new Promise(requestAnimationFrame);
        const now = performance.now(); fr.push(now - last); last = now;
        cops += g.cops.length; max = Math.max(max, g.cops.length); n++;
        screen += g.cops.filter((c) => g.onScreen(c.x, c.y, 0)).length;
      }
      fr.sort((a, b) => a - b);
      return { fps: Math.round(fr.length / 9), p95: +fr[Math.floor(fr.length * 0.95)].toFixed(1), cops: +(cops / n).toFixed(1), max, screen: +(screen / n).toFixed(1), limit: g.copLimit, level: k.quality.level };
    });
    rows.push({ t, ...res });
    console.log(tag, JSON.stringify({ t, ...res }));
    await ctx.close();
  }
  fs.writeFileSync(`${OUT}/perf-${tag}.json`, JSON.stringify(rows, null, 1));
  return rows;
}

if (only.includes('code')) {
  for (const m of ['zones', 'wheel', 'stick']) await testMode(m, true);
  await testMode('key', false);
  await testProof();
}
if (only.includes('signs')) await testSigns();
if (only.includes('perf')) await perf(process.env.TAG || `p${port}`);
await b.close();
const errs = logs.filter((l) => !/favicon|404/.test(l));
ok(errs.length === 0, 'konsol hatası yok', errs.slice(0, 5).join(' | '));
console.log(`SONUÇ: ${passes} geçti, ${fails.length} hata`);
process.exit(fails.length ? 1 : 0);
