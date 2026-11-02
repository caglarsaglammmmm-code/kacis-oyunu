// Mobil emülasyonda gerçek çoklu dokunma testi (CDP dokunma olayları). node tools/controls-test.mjs [port]
// Her ekran boyutunda üç kontrolü, düğmeleri ve takılı kalma durumlarını kanıtlar.
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const port = Number(process.argv[2] || 8080);
const OUT = 'e2e-out/v11';
fs.mkdirSync(OUT, { recursive: true });
const SIZES = [['dikey', 390, 844], ['yatay', 844, 390], ['kucuk', 360, 640], ['tablet', 820, 1180]];
const fails = [];
let passes = 0;
const ok = (cond, name, extra = '') => { if (cond) passes++; else { fails.push(`${name} ${extra}`); console.log('HATA', name, extra); } };
const b = await chromium.launch({ channel: 'msedge', headless: true });

async function open(w, h, extraUrl = '') {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const log = [];
  page.on('pageerror', (e) => log.push(`pageerror ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log.push(`${m.type()} ${m.text()}`); });
  const cdp = await ctx.newCDPSession(page);
  await page.goto(`http://localhost:${port}/?god=1${extraUrl}`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  return { ctx, page, cdp, log };
}

// Çok parmak: points = [{x,y,id}]
// touchEnd listesindeki parmaklar kalkar; liste boşsa hepsi kalkar
const touch = (cdp, type, points) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: points.map((p) => ({ x: p.x, y: p.y, id: p.id })) });
const st = (page) => page.evaluate(() => { const k = __drift; const i = k.input; return { steer: i.steer, wheelA: i.wheelA, axis: i.axis, rev: i.reverse, pSteer: k.game.player.steer, on: i.stick.on, touches: i.touches.size, wheelId: i.wheelId, stickId: i.stickId, state: k.game.state, mode: i.mode }; });
const settle = (page, ms = 120) => page.waitForTimeout(ms);
const setControl = (page, m) => page.evaluate((m) => { const s = __drift.storage; s.data.settings.control = m; s.save(); __drift.ui.syncSettings(); document.querySelector(`#settings .seg[data-set=control] button[data-v=${m}]`).click(); }, m);
const play = async (page) => { await page.evaluate(() => __drift.play()); await page.waitForFunction(() => { const k = __drift; return k.game.state === 'play' && !document.getElementById('hud').hidden; }); await settle(page, 450); };
const geom = (page) => page.evaluate(() => { const r = document.getElementById('ctl-wheel').getBoundingClientRect(); const w = __drift.input.wheel; return { cx: w.cx, cy: w.cy, r: w.r, left: r.left, top: r.top, right: r.right, bottom: r.bottom, viewW: innerWidth, viewH: innerHeight }; });
const arc = (g, deg, rr = 0.72) => { const a = (deg - 90) * Math.PI / 180; return { x: g.cx + Math.cos(a) * g.r * rr, y: g.cy + Math.sin(a) * g.r * rr, id: 1 }; };
async function turn(cdp, g, from, to) {
  const n = 12;
  for (let i = 1; i <= n; i++) await touch(cdp, 'touchMove', [arc(g, from + (to - from) * i / n)]);
}

for (const [name, w, h] of SIZES) {
  const T = `${name}:`;
  const { ctx, page, cdp, log } = await open(w, h);
  await play(page);

  // --- 1) ZONES
  let s = await st(page);
  ok(s.mode === 'zones', `${T} varsayılan mod sağ/sol`, s.mode);
  await touch(cdp, 'touchStart', [{ x: w * 0.2, y: h * 0.6, id: 1 }]);
  await settle(page);
  s = await st(page);
  ok(s.steer === -1 && s.pSteer < -0.3, `${T} zones sola`, JSON.stringify(s));
  await touch(cdp, 'touchEnd', []);
  await settle(page, 300);
  s = await st(page);
  ok(s.steer === 0 && Math.abs(s.pSteer) < 0.25, `${T} zones bırakınca düzelir`, JSON.stringify(s));
  await touch(cdp, 'touchStart', [{ x: w * 0.8, y: h * 0.6, id: 1 }]);
  await settle(page);
  s = await st(page);
  ok(s.steer === 1 && s.pSteer > 0.3, `${T} zones sağa`, JSON.stringify(s));
  await touch(cdp, 'touchStart', [{ x: w * 0.8, y: h * 0.6, id: 1 }, { x: w * 0.2, y: h * 0.6, id: 2 }]);
  await settle(page, 400);
  s = await st(page);
  ok(s.rev === true, `${T} zones iki yarı geri`, JSON.stringify(s));
  await touch(cdp, 'touchEnd', []);
  await settle(page);
  // Duraklat ve ikinci parmak
  await touch(cdp, 'touchStart', [{ x: w * 0.8, y: h * 0.6, id: 1 }]);
  await settle(page, 60);
  await touch(cdp, 'touchCancel', []);
  await settle(page);
  s = await st(page);
  ok(s.touches === 0 && s.steer === 0, `${T} zones touchcancel takılmaz`, JSON.stringify(s));

  // --- 2) WHEEL
  await page.evaluate(() => __drift.pause());
  await page.click('#pause .seg button[data-v=wheel]');
  await page.click('#btn-resume');
  await settle(page, 150);
  s = await st(page);
  ok(s.mode === 'wheel', `${T} duraklatmadan direksiyona geçiş`, s.mode);
  const vis = await page.evaluate(() => ({ w: !document.getElementById('ctl-wheel').hidden, s: !document.getElementById('ctl-stick').hidden, r: !document.getElementById('ctl-rev').hidden }));
  ok(vis.w && !vis.s && vis.r, `${T} yalnız direksiyon görünür`, JSON.stringify(vis));
  const g = await geom(page);
  ok(g.r >= 55 && g.left >= 0 && g.top >= 0 && g.right <= g.viewW && g.bottom <= g.viewH, `${T} direksiyon ekranda`, JSON.stringify(g));
  ok((Math.PI * g.r * g.r) / (g.viewW * g.viewH) < 0.13, `${T} direksiyon ekranın azını kaplar`);
  await page.screenshot({ path: `${OUT}/${name}-direksiyon.png` });
  // Sağa
  await touch(cdp, 'touchStart', [arc(g, 0)]);
  await turn(cdp, g, 0, 90);
  await settle(page, 200);
  s = await st(page);
  ok(Math.abs(s.wheelA - Math.PI / 2) < 0.12 && s.steer > 0.55 && s.steer < 0.8, `${T} direksiyon 90° sağ, orantılı`, JSON.stringify(s));
  ok(s.pSteer > 0.3, `${T} direksiyon arabayı sağa çevirir`, JSON.stringify(s));
  const rot = await page.evaluate(() => document.getElementById('ctl-rim').style.transform);
  ok(/rotate\(1\.[4-7]/.test(rot), `${T} direksiyon görseli döner`, rot);
  await page.screenshot({ path: `${OUT}/${name}-direksiyon-sag.png` });
  // Dış dokunuş ve ikinci parmak karışmaz
  const held = s.wheelA;
  const held1 = arc(g, 90);
  const second = { x: w * 0.25, y: h * 0.45, id: 2 };
  await touch(cdp, 'touchStart', [held1, second]);
  await settle(page);
  s = await st(page);
  ok(Math.abs(s.wheelA - held) < 0.02 && s.wheelId !== null, `${T} ikinci parmak direksiyonu etkilemez`, JSON.stringify(s));
  await touch(cdp, 'touchEnd', [second]);
  await settle(page);
  s = await st(page);
  ok(Math.abs(s.wheelA - held) < 0.02 && s.wheelId !== null, `${T} ikinci parmak kalkınca direksiyon bırakılmaz`, JSON.stringify(s));
  // Sınır
  await turn(cdp, g, 90, 179);
  await turn(cdp, g, 179, 260);
  await settle(page, 80);
  s = await st(page);
  ok(s.wheelA <= (130 * Math.PI) / 180 + 1e-6 && s.steer > 0.97, `${T} direksiyon 130° sınırı`, JSON.stringify(s));
  await touch(cdp, 'touchEnd', []);
  await settle(page, 700);
  s = await st(page);
  ok(Math.abs(s.wheelA) < 0.02 && s.steer === 0, `${T} direksiyon ortaya döner`, JSON.stringify(s));
  // Sola
  await touch(cdp, 'touchStart', [arc(g, 0)]);
  await turn(cdp, g, 0, -90);
  await settle(page, 200);
  s = await st(page);
  ok(s.wheelA < -1.4 && s.pSteer < -0.3, `${T} direksiyon sola`, JSON.stringify(s));
  // Direksiyon tutulurken duraklat: ikinci parmakla gerçek düğme
  const pz = await page.evaluate(() => { const r = document.getElementById('btn-pause').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, id: 2 }; });
  const hold2 = arc(g, -90);
  await touch(cdp, 'touchStart', [hold2, pz]);
  await touch(cdp, 'touchEnd', [pz]);
  await settle(page, 200);
  let paused = await page.evaluate(() => !document.getElementById('pause').hidden);
  ok(paused, `${T} direksiyon tutulurken duraklat çalışır`);
  await touch(cdp, 'touchEnd', []);
  s = await st(page);
  ok(s.wheelA === 0 && s.steer === 0 && s.wheelId === null, `${T} duraklatınca direksiyon takılmaz`, JSON.stringify(s));
  await page.click('#btn-resume');
  await settle(page, 200);
  // GERİ düğmesi direksiyonla birlikte
  const rv = await page.evaluate(() => { const r = document.getElementById('ctl-rev').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, id: 2 }; });
  await touch(cdp, 'touchStart', [arc(g, 0)]);
  await turn(cdp, g, 0, 60);
  const hold3 = arc(g, 60);
  await touch(cdp, 'touchStart', [hold3, rv]);
  await settle(page);
  s = await st(page);
  ok(s.rev && s.wheelA > 0.8, `${T} GERİ ile direksiyon birlikte`, JSON.stringify(s));
  await touch(cdp, 'touchEnd', [rv]);
  await settle(page);
  s = await st(page);
  ok(!s.rev && s.wheelA > 0.8, `${T} GERİ bırakılınca yalnız geri kapanır`, JSON.stringify(s));
  // Ekran dışına sürükleme ve iptal
  await touch(cdp, 'touchMove', [{ x: g.viewW + 80, y: g.viewH + 80, id: 1 }]);
  await touch(cdp, 'touchCancel', []);
  await settle(page, 700);
  s = await st(page);
  ok(s.wheelId === null && s.wheelA === 0, `${T} direksiyon ekran dışı + iptal takılmaz`, JSON.stringify(s));
  // Arka plana gidip gelme
  await touch(cdp, 'touchStart', [arc(g, 0)]);
  await turn(cdp, g, 0, 70);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await settle(page);
  s = await st(page);
  ok(s.wheelId === null && s.wheelA === 0, `${T} arka plana gidince sıfırlanır`, JSON.stringify(s));
  await touch(cdp, 'touchEnd', []);
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { value: false, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
  await page.click('#btn-resume');

  // --- 3) STICK: duraklatmadan geçiş
  await settle(page, 100);
  await page.evaluate(() => __drift.pause());
  await page.click('#pause .seg button[data-v=stick]');
  await page.click('#btn-resume');
  await settle(page, 150);
  const vis2 = await page.evaluate(() => ({ w: !document.getElementById('ctl-wheel').hidden, s: !document.getElementById('ctl-stick').hidden, o: getComputedStyle(document.getElementById('ctl-stick')).opacity }));
  ok(!vis2.w && vis2.s && Number(vis2.o) === 0, `${T} eski direksiyon tamamen kapandı, joystick görünmez`, JSON.stringify(vis2));
  const sx = w * 0.25; const sy = h * 0.6;
  await touch(cdp, 'touchStart', [{ x: w * 0.75, y: sy, id: 1 }]);
  await settle(page);
  s = await st(page);
  ok(!s.on && s.steer === 0, `${T} joystick sağ yarıda açılmaz`, JSON.stringify(s));
  await touch(cdp, 'touchEnd', []);
  await touch(cdp, 'touchStart', [{ x: sx, y: sy, id: 1 }]);
  await settle(page, 260);
  const vis3 = await page.evaluate(() => { const e = document.getElementById('ctl-stick'); const m = new DOMMatrix(getComputedStyle(e).transform); return { o: Number(getComputedStyle(e).opacity), x: m.e, y: m.f }; });
  ok(vis3.o > 0.14 && vis3.o <= 0.21, `${T} joystick %15-20 görünür`, JSON.stringify(vis3));
  ok(Math.abs(vis3.x - sx) < 70 && Math.abs(vis3.y - sy) < 70, `${T} joystick parmağın altında`, JSON.stringify(vis3));
  await touch(cdp, 'touchMove', [{ x: sx + 5, y: sy + 3, id: 1 }]);
  await settle(page);
  s = await st(page);
  ok(s.steer === 0, `${T} joystick ölü bölge`, JSON.stringify(s));
  await touch(cdp, 'touchMove', [{ x: sx + 70, y: sy, id: 1 }]);
  await settle(page, 220);
  s = await st(page);
  ok(s.steer > 0.9 && s.pSteer > 0.3, `${T} joystick sağa`, JSON.stringify(s));
  await page.screenshot({ path: `${OUT}/${name}-joystick.png` });
  await touch(cdp, 'touchMove', [{ x: sx - 70, y: sy, id: 1 }]);
  await settle(page, 260);
  s = await st(page);
  ok(s.steer < -0.9 && s.pSteer < -0.3, `${T} joystick sola`, JSON.stringify(s));
  // Çoklu dokunma: ikinci parmak joystick'i kapmaz
  const hold4 = { x: sx - 70, y: sy, id: 1 };
  const extra = { x: sx + 10, y: sy - 40, id: 2 };
  await touch(cdp, 'touchStart', [hold4, extra]);
  await settle(page);
  s = await st(page);
  ok(s.steer < -0.9, `${T} joystick ikinci parmakla karışmaz`, JSON.stringify(s));
  const pz2 = await page.evaluate(() => { const r = document.getElementById('btn-pause').getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, id: 3 }; });
  await touch(cdp, 'touchEnd', [extra]);
  await touch(cdp, 'touchStart', [hold4, pz2]);
  await touch(cdp, 'touchEnd', [pz2]);
  await settle(page, 200);
  paused = await page.evaluate(() => !document.getElementById('pause').hidden);
  ok(paused, `${T} joystick tutulurken duraklat çalışır`);
  await touch(cdp, 'touchEnd', []);
  s = await st(page);
  ok(!s.on && s.axis === 0, `${T} duraklatınca joystick takılmaz`, JSON.stringify(s));
  await page.click('#btn-resume');
  await settle(page, 200);
  await touch(cdp, 'touchStart', [{ x: sx, y: sy, id: 1 }]);
  await touch(cdp, 'touchMove', [{ x: -60, y: sy, id: 1 }]);
  await touch(cdp, 'touchEnd', []);
  await settle(page, 300);
  s = await st(page);
  ok(!s.on && s.axis === 0 && s.steer === 0, `${T} joystick kalkınca düzelir`, JSON.stringify(s));
  const off = await page.evaluate(() => Number(getComputedStyle(document.getElementById('ctl-stick')).opacity));
  ok(off < 0.01, `${T} joystick kaybolur`, String(off));
  // Klavye her modda
  await page.keyboard.down('ArrowLeft');
  await settle(page, 80);
  s = await st(page);
  ok(s.steer === -1, `${T} klavye joystick modunda`, JSON.stringify(s));
  await page.keyboard.up('ArrowLeft');
  // Pencere odağı gidince
  await page.keyboard.down('ArrowRight');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  s = await st(page);
  ok(s.steer === 0, `${T} odak gidince tuş takılmaz`, JSON.stringify(s));
  await page.keyboard.up('ArrowRight');

  // Yenileme: ayar kalıcı
  await page.reload();
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  s = await st(page);
  ok(s.mode === 'stick', `${T} seçim yenilemede hatırlanır`, s.mode);
  const on = await page.evaluate(() => document.querySelector('#settings .seg[data-set=control] .on').dataset.v);
  ok(on === 'stick', `${T} ayar ekranı doğru seçili`, on);

  ok(log.length === 0, `${T} konsol temiz`, log.slice(0, 3).join(' | '));
  await ctx.close();
}

// Bozuk kayıt: varsayılana döner
{
  const { ctx, page, log } = await open(390, 844);
  await page.evaluate(() => localStorage.setItem('drift-lab-v1', '{bozuk'));
  await page.reload();
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  ok((await st(page)).mode === 'zones', 'bozuk kayıtta varsayılan');
  await page.evaluate(() => { const d = JSON.parse(localStorage.getItem('drift-lab-v1') || '{"settings":{}}'); d.settings = d.settings || {}; d.settings.control = 'uydurma'; d.settings.quality = 'x'; localStorage.setItem('drift-lab-v1', JSON.stringify(d)); });
  await page.reload();
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  ok((await st(page)).mode === 'zones', 'geçersiz değerde varsayılan');
  ok(log.length === 0, 'bozuk kayıt konsol temiz', log.join('|'));
  await ctx.close();
}
// localStorage tamamen erişilemez
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('yasak'); } }); });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  await page.goto(`http://localhost:${port}/?god=1`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  ok((await st(page)).mode === 'zones', 'localStorage yokken varsayılan');
  await page.evaluate(() => document.querySelector('#settings .seg[data-set=control] button[data-v=wheel]').click());
  ok((await st(page)).mode === 'wheel', 'localStorage yokken seçim yine çalışır');
  ok(errs.length === 0, 'localStorage yokken hata yok', errs.join('|'));
  await ctx.close();
}

// Düğmeler: dokunma alanı, hizalama, taşma, basma hissi
for (const [name, w, h] of [...SIZES, ['kucuk-yatay', 640, 360], ['genis', 1280, 720]]) {
  const { ctx, page, log } = await open(w, h);
  await settle(page, 300);
  await page.screenshot({ path: `${OUT}/${name}-menu.png` });
  const audit = (sel) => page.evaluate((sel) => {
    const list = [...document.querySelectorAll(sel)].filter((e) => e.offsetParent !== null || getComputedStyle(e).position === 'fixed').filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height; });
    return list.map((e) => { const r = e.getBoundingClientRect(); return { id: e.id || e.className || e.textContent, l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height }; });
  }, sel);
  const checkGroup = (rows, tag) => {
    for (const r of rows) {
      ok(r.w >= 48 && r.h >= 48, `${name} ${tag} ${r.id} en az 48 px`, `${r.w.toFixed(0)}x${r.h.toFixed(0)}`);
      ok(r.l >= -0.5 && r.t >= -0.5 && r.r <= w + 0.5 && r.b <= h + 0.5, `${name} ${tag} ${r.id} ekranda`, JSON.stringify(r));
    }
    for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
      const A = rows[i]; const B = rows[j];
      ok(A.r <= B.l + 0.5 || B.r <= A.l + 0.5 || A.b <= B.t + 0.5 || B.b <= A.t + 0.5, `${name} ${tag} ${A.id}/${B.id} çakışmaz`);
    }
  };
  const menu = await audit('#menu button, #menu a.btn');
  checkGroup(menu, 'menu');
  // Eşit boşluk: BAŞLA-satır ve satır-APK, satır içi
  const g = await page.evaluate(() => {
    const r = (id) => document.getElementById(id).getBoundingClientRect();
    return { a: r('btn-play'), t1: r('btn-garage'), t2: r('btn-settings'), t3: r('btn-howto'), apk: r('btn-apk') };
  });
  const g1 = g.t1.top - g.a.bottom; const g2 = g.apk.top - g.t1.bottom; const g3 = g.t2.left - g.t1.right; const g4 = g.t3.left - g.t2.right;
  ok(Math.abs(g1 - g2) < 1 && Math.abs(g3 - g4) < 1 && Math.abs(g1 - g3) < 1, `${name} boşluklar eşit`, [g1, g2, g3, g4].join(','));
  ok(Math.abs((g.a.left + g.a.right) / 2 - (g.t2.left + g.t2.right) / 2) < 1.5, `${name} BAŞLA ortalı`);
  ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} yatay taşma yok`);
  for (const [screen, sel] of [['settings', '#settings button:not(#dev-panel *), #settings .seg button'], ['pause', '#pause button']]) {
    await page.evaluate((s) => __drift.ui.show(s), screen);
    await settle(page, 60);
    await page.screenshot({ path: `${OUT}/${name}-${screen}.png` });
    const rows = await audit(sel);
    for (const r of rows) ok(r.w >= 48 && r.h >= 48, `${name} ${screen} ${r.id} en az 48 px`, `${r.w.toFixed(0)}x${r.h.toFixed(0)}`);
    const over = await page.evaluate((s) => { const e = document.getElementById(s); return { x: e.scrollWidth - e.clientWidth, y: e.scrollHeight - e.clientHeight, ov: getComputedStyle(e).overflowY }; }, screen);
    ok(over.x <= 0, `${name} ${screen} yatay taşma yok`, JSON.stringify(over));
    ok(over.y <= 0 || over.ov === 'auto', `${name} ${screen} sığar ya da kayar`, JSON.stringify(over));
  }
  await page.evaluate(() => __drift.ui.show('menu'));
  ok(log.length === 0, `${name} düğme konsol temiz`, log.slice(0, 3).join('|'));
  await ctx.close();
}

// Basma hissi: dönüşüm, küçülen gölge, yumuşak geri dönüş, ses, titreşim
{
  const { ctx, page, cdp, log } = await open(390, 844);
  await page.evaluate(() => { globalThis.__v = []; navigator.vibrate = (m) => { __v.push(m); return true; }; });
  await settle(page, 300);
  await page.evaluate(() => __drift.audio.unlock());
  await page.evaluate(() => { const a = __drift.audio; const o = a.press.bind(a); a.pressN = 0; a.press = () => { a.pressN++; o(); }; });
  const r = await page.evaluate(() => { const e = document.getElementById('btn-settings').getBoundingClientRect(); return { x: e.left + e.width / 2, y: e.top + e.height / 2 }; });
  const shadow = () => page.evaluate(() => { const c = getComputedStyle(document.getElementById('btn-settings')); return { sh: c.boxShadow, tr: c.transform, du: c.transitionDuration }; });
  const idle = await shadow();
  await touch(cdp, 'touchStart', [{ ...r, id: 1 }]);
  await settle(page, 200);
  const down = await shadow();
  await page.screenshot({ path: `${OUT}/basili-dugme.png` });
  const blur = (s) => Math.max(...[...s.sh.matchAll(/px (\d+)px \d+px/g)].map((m) => Number(m[1])));
  ok(down.tr !== 'none' && down.tr !== idle.tr, 'düğme içeri çöker', down.tr);
  await touch(cdp, 'touchCancel', []);
  await settle(page, 40);
  const mid = await shadow();
  ok(mid.tr !== 'none', 'bırakınca yumuşak döner (hemen atlamaz)', mid.tr);
  await settle(page, 400);
  const end = await shadow();
  ok(end.tr === 'none' || end.tr === idle.tr, 'sonunda yerine oturur', end.tr);
  const info = await page.evaluate(() => ({ n: __drift.audio.pressN, v: __v.length }));
  ok(info.n >= 1, 'basma sesi çalar', JSON.stringify(info));
  ok(info.v >= 1, 'hafif titreşim', JSON.stringify(info));
  console.log('gölge', idle.sh.slice(0, 60), '->', down.sh.slice(0, 60), blur(idle), blur(down));
  ok(log.length === 0, 'basma konsol temiz', log.join('|'));
  await ctx.close();
}

await b.close();
console.log(`\ngecti ${passes}, hata ${fails.length}`);
if (fails.length) { console.log(fails.join('\n')); process.exit(1); }
