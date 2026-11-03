// v17 tarayıcı sınaması: silah (üç kontrol), kod girişi, garaj özelleştirme, hava durumu, ekran görüntüleri.
// node tools/v17-test.mjs [port]   Çıktı: e2e-out/v17
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const port = Number(process.argv[2] || 8080);
const OUT = 'e2e-out/v17';
fs.mkdirSync(OUT, { recursive: true });
const fails = [];
let passes = 0;
const ok = (c, n, e = '') => { if (c) passes++; else { fails.push(`${n} ${e}`); console.log('HATA', n, e); } };
const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const errs = [];

async function open(w, h, url = '?god=1', locale = 'tr-TR', seed = null) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale });
  if (seed) await ctx.addInitScript((d) => { if (!localStorage.getItem('drift-lab-v1')) localStorage.setItem('drift-lab-v1', d); }, JSON.stringify(seed));
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(`${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
  await page.goto(`http://localhost:${port}/${url}`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  await page.waitForTimeout(500);
  return { ctx, page, cdp: await ctx.newCDPSession(page) };
}
const OWN = { coins: 50, owned: ['atmaca', 'kuzgun'], selected: 'kuzgun', settings: { weather: 'sunny' } };
const touch = (cdp, type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map((p) => ({ x: p.x, y: p.y, id: p.id || 1 })) });
const start = async (page) => { await page.evaluate(() => __drift.play()); await page.waitForFunction(() => __drift.game.state === 'play'); await page.waitForTimeout(500); };

// 1) Silah: otomatik ateş, sınırsız cephane. Üç kontrol sisteminde ateş düğmesi yok, sürüş bozulmaz
for (const mode of ['zones', 'wheel', 'stick']) {
  const { ctx, page, cdp } = await open(390, 844, '?god=1', 'tr-TR', { ...OWN, settings: { ...OWN.settings, control: mode } });
  await start(page);
  const g0 = await page.evaluate(() => ({ btn: !!document.getElementById('btn-fire'), ammo: 'ammo' in __drift.game.weapon, mode: __drift.input.mode }));
  ok(!g0.btn && !g0.ammo && g0.mode === mode, `${mode}: ateş düğmesi ve cephane göstergesi yok`, JSON.stringify(g0));
  // Önde sürekli bir hedef tutulur (ölmez): atış zamanları oyun saatinden ölçülür
  const res = await page.evaluate(async () => {
    const g = __drift.game; const p = g.player;
    const c = g.spawnCop('car', 'chaser', p.x, p.y, 0); c.state = 'chase';
    const hold = () => { c.x = p.x + Math.cos(p.a) * 200; c.y = p.y + Math.sin(p.a) * 200; c.vx = p.vx; c.vy = p.vy; c.mhp = c.mhpMax; c.hp = c.maxHp; if (!g.cops.includes(c)) g.cops.push(c); };
    const t0 = performance.now(); const at = []; let last = g.weapon.shots; let most = 0;
    while (performance.now() - t0 < 11000) {
      hold();
      await new Promise(requestAnimationFrame);
      if (g.weapon.shots !== last) { last = g.weapon.shots; at.push(g.runTime); }
      most = Math.max(most, g.missiles.filter((m) => m.alive).length);
    }
    return { at, most, state: g.state };
  });
  const gaps = res.at.slice(1).map((v, i) => +(v - res.at[i]).toFixed(3));
  console.log(`  ${mode} atış aralıkları: ${gaps.join(' ')}`);
  ok(gaps.length >= 2 && gaps.every((x) => Math.abs(x - 3) < 0.05), `${mode}: ~3,0 sn eşit aralıkla otomatik ateş`, JSON.stringify(gaps));
  ok(res.most <= 4 && res.state === 'play', `${mode}: en çok ${res.most} mermi, oyun sürüyor`);
  // Dokunmatik sürüş çalışıyor
  const W = 390; const H = 844;
  const pt = mode === 'wheel' ? null : { x: W * (mode === 'stick' ? 0.3 : 0.85), y: H * 0.6, id: 1 };
  if (pt) {
    await touch(cdp, 'touchStart', [pt]);
    if (mode === 'stick') { await page.waitForTimeout(40); await touch(cdp, 'touchMove', [{ ...pt, x: pt.x + 70 }]); }
    await page.waitForTimeout(120);
    const st = await page.evaluate(() => __drift.input.steer);
    await touch(cdp, 'touchEnd', []);
    ok(st !== 0, `${mode}: dokunuşla direksiyon çalışıyor`, String(st));
  }
  if (mode === 'zones') {
    // Boşluk: bekleme süresinde atmaz, süre dolunca atar
    const before = await page.evaluate(() => { const g = __drift.game; g.cops.length = 0; g.weapon.cd = 1.5; return g.weapon.shots; });
    await page.keyboard.press('Space');
    await page.waitForTimeout(80);
    ok((await page.evaluate(() => __drift.game.weapon.shots)) === before, 'Boşluk bekleme süresinde atmaz');
    await page.evaluate(() => { __drift.game.weapon.cd = 0; });
    await page.keyboard.press('Space');
    await page.waitForTimeout(80);
    ok((await page.evaluate(() => __drift.game.weapon.shots)) === before + 1, 'Boşluk süre dolunca atar');
    // Ekran görüntüsü: hedef kilidi ve mermi
    await page.waitForTimeout(3100);
    await page.evaluate(() => {
      const g = __drift.game; const p = g.player;
      const c = g.spawnCop('car', 'chaser', p.x + Math.cos(p.a) * 260, p.y + Math.sin(p.a) * 260, p.a + Math.PI); c.state = 'chase';
    });
    await page.waitForTimeout(160);
    await page.screenshot({ path: `${OUT}/silahli-araba.png` });
  }
  await ctx.close();
}

// 2) Kod girişi
{
  const { ctx, page } = await open(390, 844, '', 'tr-TR');
  await page.evaluate(() => document.getElementById('btn-settings').click());
  await page.waitForTimeout(200);
  const enter = async (code) => {
    await page.fill('#code-input', code);
    await page.click('#code-apply');
    await page.waitForTimeout(120);
    return page.evaluate(() => ({ msg: document.getElementById('code-msg').textContent, owned: __drift.storage.data.owned.includes('kuzgun') }));
  };
  let r = await enter('12-34');
  ok(r.msg === 'Geçersiz kod.' && !r.owned, 'yanlış kod açmaz', JSON.stringify(r));
  r = await enter('42 66');
  ok(r.msg.startsWith('Kod kabul edildi!') && r.owned, '42 66 arabayı açar', JSON.stringify(r));
  await page.evaluate(() => document.getElementById('code-input').scrollIntoView());
  await page.screenshot({ path: `${OUT}/kod-ekrani.png` });
  r = await enter('4266');
  ok(r.msg === 'Bu araba zaten sende.', 'ikinci girişte zaten sende', JSON.stringify(r));
  await page.reload();
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  ok(await page.evaluate(() => __drift.storage.data.owned.includes('kuzgun')), 'yeniden açılınca araba hâlâ açık');
  const shown = await page.evaluate(() => [...document.querySelectorAll('body *')].some((e) => e.children.length === 0 && /4266|42-66/.test(e.textContent)));
  ok(!shown, 'kod menülerde görünmüyor');
  await ctx.close();
}
for (const code of ['42-66', '4266']) {
  const { ctx, page } = await open(390, 844, '', 'tr-TR');
  await page.evaluate(() => document.getElementById('btn-settings').click());
  await page.fill('#code-input', code);
  await page.press('#code-input', 'Enter');
  await page.waitForTimeout(120);
  ok(await page.evaluate(() => __drift.storage.data.owned.includes('kuzgun')), `${code} arabayı açar`);
  await ctx.close();
}

// 3) Garaj özelleştirme: yetersiz para, onaylı satın alma, kalıcılık, ekran görüntüleri
{
  const { ctx, page } = await open(390, 844, '', 'tr-TR', { coins: 40, owned: ['atmaca'], selected: 'atmaca' });
  await page.evaluate(() => document.getElementById('btn-garage').click());
  await page.waitForTimeout(300);
  const chip = (tab, n) => page.evaluate(([t, i]) => { document.querySelector(`.custom-tabs button[data-tab=${t}]`).click(); document.querySelectorAll('#custom-grid .chip')[i].click(); }, [tab, n]);
  const state = () => page.evaluate(() => { const b = document.getElementById('custom-buy'); return { hidden: b.hidden, disabled: b.disabled, text: b.textContent, coins: __drift.storage.data.coins, msg: document.getElementById('custom-msg').textContent }; });
  await chip('paint', 14); // Neon pembe 120
  let s = await state();
  ok(!s.hidden && s.disabled && s.text === 'Yetersiz para' && s.coins === 40, 'yetersiz parada alınmaz', JSON.stringify(s));
  await page.evaluate(() => { __drift.storage.data.coins = 1000; __drift.storage.save(); __drift.ui.renderGarage(); });
  s = await state();
  ok(s.text === 'Satın al · 120' && !s.disabled, 'yeterli parada satın al düğmesi', JSON.stringify(s));
  await page.click('#custom-buy');
  s = await state();
  ok(s.text === 'Onayla · 120' && s.coins === 1000, 'önce onay ister', JSON.stringify(s));
  await page.click('#custom-buy');
  s = await state();
  ok(s.coins === 880 && s.hidden && s.msg === 'Satın alındı!', 'onaylayınca alınır, para düşer', JSON.stringify(s));
  await page.screenshot({ path: `${OUT}/garaj-boya.png` });
  // Jant ve LED: alıp seç
  for (const [tab, n] of [['rim', 7], ['led', 9]]) {
    await chip(tab, n);
    await page.click('#custom-buy'); await page.click('#custom-buy');
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${OUT}/garaj-${tab === 'rim' ? 'jant' : 'led'}.png` });
  }
  const look = await page.evaluate(() => __drift.storage.look('atmaca'));
  ok(look.paint === 'neonpembe' && look.rim === 'altin' && look.led === 'gokkusagi', 'üçü de seçili', JSON.stringify(look));
  await page.reload();
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  const after = await page.evaluate(() => ({ look: __drift.storage.look('atmaca'), coins: __drift.storage.data.coins, owns: __drift.storage.owns('rim', 'altin') }));
  ok(after.look.led === 'gokkusagi' && after.owns && after.coins === 880 - 250 - 300, 'yeniden açılınca kalıcı', JSON.stringify(after));
  // Oyunda: yeni boya, jant ve LED gece görünür
  await start(page);
  await page.evaluate(() => { const g = __drift.game; Object.assign(g.daylight, { k: 1, a: 0.62 }); g.dayT = 100; });
  await page.waitForTimeout(400);
  const lk = await page.evaluate(() => ({ paint: __drift.game.paint, look: __drift.game.look }));
  ok(lk.paint === 'neonpembe' && lk.look.rim === 'altin', 'oyunda seçili görünüş', JSON.stringify(lk));
  await page.screenshot({ path: `${OUT}/oyunda-boya-jant-led-gece.png` });
  await ctx.close();
}

// 4) Hava durumu: dört tür, buz uyarısı
for (const w of ['rain', 'snow', 'fog', 'ice']) {
  const { ctx, page } = await open(390, 844, '?god=1&t=30', 'tr-TR', { settings: { weather: w } });
  await start(page);
  const toast = await page.evaluate(() => document.getElementById('toast').textContent);
  await page.waitForTimeout(3300);
  const st = await page.evaluate(() => ({ w: __drift.game.weather, wk: __drift.game.wk, grip: __drift.game.surfP[1].grip }));
  ok(st.w === w && st.wk === 1, `${w}: hava çalışıyor`, JSON.stringify(st));
  if (w === 'ice') ok(toast === 'Yol buzlu!', 'buzlu yol uyarısı', toast);
  await page.screenshot({ path: `${OUT}/hava-${w}.png` });
  await ctx.close();
}

// 5) Ayardan hava seçimi kaydedilir
{
  const { ctx, page } = await open(390, 844, '', 'tr-TR');
  await page.evaluate(() => document.getElementById('btn-settings').click());
  await page.evaluate(() => document.querySelector('.seg[data-set=weather] button[data-v=snow]').click());
  await page.reload();
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  ok(await page.evaluate(() => __drift.storage.data.settings.weather) === 'snow', 'hava ayarı kaydedildi');
  await page.evaluate(() => __drift.play());
  await page.waitForFunction(() => __drift.game.state === 'play');
  ok(await page.evaluate(() => __drift.game.weather) === 'snow', 'seçilen hava oyunda');
  await ctx.close();
}

// 6) Altı dilde garaj özelleştirme ve ayarlar
for (const lang of ['tr', 'en', 'ja', 'zh', 'es', 'de']) {
  const { ctx, page } = await open(390, 844, '', lang, { coins: 30, owned: ['atmaca', 'kuzgun'], selected: 'kuzgun' });
  await page.evaluate(() => document.getElementById('btn-garage').click());
  await page.waitForTimeout(300);
  await page.evaluate(() => { document.querySelector('.custom-tabs button[data-tab=led]').click(); document.querySelectorAll('#custom-grid .chip')[3].click(); });
  await page.waitForTimeout(150);
  const bad = await page.evaluate(() => [...document.querySelectorAll('#garage .custom-tabs button, #custom-buy, #custom-name, #garage-name, #garage-desc, #garage-paint-name')].filter((e) => e.offsetParent && e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).whiteSpace === 'nowrap').map((e) => e.textContent));
  ok(bad.length === 0, `${lang}: garaj yazıları sığıyor`, bad.join(' | '));
  await page.evaluate(() => document.getElementById('garage-custom').scrollIntoView());
  await page.screenshot({ path: `${OUT}/dil-${lang}-garaj.png` });
  await page.evaluate(() => { document.querySelector('#garage .back').click(); document.getElementById('btn-settings').click(); });
  await page.waitForTimeout(200);
  await page.evaluate(() => document.querySelector('.weather-row').scrollIntoView());
  await page.screenshot({ path: `${OUT}/dil-${lang}-ayarlar.png` });
  await ctx.close();
}

await b.close();
const e2 = errs.filter((e) => !/favicon/.test(e));
ok(e2.length === 0, 'konsol hatası ve uyarısı yok', e2.slice(0, 5).join(' | '));
console.log(`SONUÇ: ${passes} geçti, ${fails.length} hata`);
process.exit(fails.length ? 1 : 0);
