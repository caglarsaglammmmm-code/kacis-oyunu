// v21 tarayıcı sınaması ve ekran görüntüleri: uzaylı geçişi, meteor halkası ve çarpması, gizli geçit, motosiklet,
// taramalı ateş, iki stadyum gündüz/gece, anıt alanı, 6 dilde yazılar. Konsol hatası olmamalı.
// node tools/v21-test.mjs [port] [klasör] [bölümler: alien,meteor,secret,gun,stadium,memorial,lang]
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const port = Number(process.argv[2] || 8080);
const OUT = process.argv[3] || 'e2e-out/v21/play';
const only = (process.argv[4] || 'alien,meteor,secret,gun,stadium,memorial,lang').split(',');
fs.mkdirSync(OUT, { recursive: true });
const fails = [];
let passes = 0;
const ok = (c, name, extra = '') => { if (c) passes++; else { fails.push(`${name} ${extra}`); console.log('HATA', name, extra); } };
const b = await chromium.launch({ channel: 'msedge', headless: true });
const errs = [];

async function open({ w = 390, h = 844, mobile = true, lang = 'tr', url = '?god=1&t=0', save = null } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile, locale: lang });
  if (save) await ctx.addInitScript((s) => { try { localStorage.setItem('drift-lab-v1', s); } catch {} }, save);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(`pageerror ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(`http://localhost:${port}/${url}`);
  await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden, null, { timeout: 30000 });
  await page.evaluate((l) => { const k = __drift; k.storage.data.settings.lang = l; k.storage.save(); k.applySettings && k.applySettings(); }, lang);
  return { ctx, page };
}
const play = async (page) => {
  await page.evaluate(() => __drift.play());
  await page.waitForFunction(() => __drift.game.state === 'play' && !__drift.renderer.warmingNow, null, { timeout: 20000 });
  await page.waitForTimeout(400);
};
// Oyuncuyu bir noktada tutar (polis temizlenebilir)
const hold = (page, x, y, a = -Math.PI / 2, clear = true) => page.evaluate(([x, y, a, clear]) => {
  const g = __drift.game;
  clearInterval(globalThis.__hold);
  globalThis.__hold = setInterval(() => { const p = g.player; p.x = x; p.y = y; p.vx = 0; p.vy = 0; p.speed = 0; p.a = a; if (clear) g.cops.length = 0; }, 4);
}, [x, y, a, clear]);
const release = (page) => page.evaluate(() => clearInterval(globalThis.__hold));
const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` });

// --- UZAYLI GEÇİŞİ ---
if (only.includes('alien')) {
  const { ctx, page } = await open({ url: '?god=0&t=220' });
  await play(page);
  await page.evaluate(() => {
    const g = __drift.game; g.time = __drift.cfg.difficulty.aliensAt - 0.3; g.damage = 0;
    // Doğdukları anda oyuncuya uzaklık
    const orig = g.onEvent;
    g.onEvent = (n, v) => { if (n === 'aliens') globalThis.__spawnD = Math.min(...g.cops.filter((c) => c.alien).map((c) => Math.hypot(c.x - g.player.x, c.y - g.player.y))); orig(n, v); };
  });
  // Yazı 3 sn görünür: 0.5, 2.6 ve 3.4. saniyede opaklık
  await page.waitForFunction(() => __drift.game.aliensOn, null, { timeout: 5000 });
  const t0 = Date.now();
  const op = async () => page.evaluate(() => ({ o: +getComputedStyle(document.getElementById('alert')).opacity, txt: document.getElementById('alert').textContent, shield: __drift.game.shieldT, aliens: __drift.game.cops.filter((c) => c.alien).length, state: __drift.game.state, dmg: __drift.game.damage, minD: Math.min(...__drift.game.cops.filter((c) => c.alien).map((c) => Math.hypot(c.x - __drift.game.player.x, c.y - __drift.game.player.y))) }));
  await page.waitForTimeout(500);
  const a = await op();
  await shot(page, 'uzayli-yazi');
  await page.waitForTimeout(Math.max(0, 2550 - (Date.now() - t0)));
  const bb = await op();
  await page.waitForTimeout(Math.max(0, 3500 - (Date.now() - t0)));
  const c = await op();
  console.log('uzaylı yazısı', JSON.stringify({ a, bb, c }));
  ok(a.txt === 'UZAYLILAR GELDİ!' && a.o > 0.8, 'yazı göründü', JSON.stringify(a));
  ok(bb.o > 0.5, '2.5 sn sonra hâlâ görünür', String(bb.o));
  ok(c.o < 0.05, '3.5 sn sonra kayboldu', String(c.o));
  ok(a.shield > 2 && a.shield <= 3, '3 sn koruma', String(a.shield));
  ok(a.aliens >= 4, 'her yönden uzaylılar', String(a.aliens));
  const spawnD = await page.evaluate(() => globalThis.__spawnD);
  ok(spawnD >= 419, 'doğarken güvenli uzaklık', String(spawnD));
  // İlk 5 saniye: oyuncu sürmeye devam eder, ölmez
  await page.waitForTimeout(Math.max(0, 5200 - (Date.now() - t0)));
  const d = await op();
  ok(d.state === 'play', 'ilk 5 sn ölüm yok', d.state);
  await shot(page, 'uzayli-arabalari');
  ok(await page.evaluate(() => !('ufo' in __drift.cfg.aliens.types) && !__drift.game.cops.some((c) => c.type === 'ufo')), 'UFO yok');
  await ctx.close();
}

// --- METEOR ---
if (only.includes('meteor')) {
  const { ctx, page } = await open({ url: '?god=1&t=376' });
  await play(page);
  await page.evaluate(() => { const g = __drift.game; g.time = __drift.cfg.meteor.at - 0.2; });
  await page.waitForFunction(() => __drift.game.meteors.list.some((m) => m.alive), null, { timeout: 8000 });
  // Bir meteoru ekranın ortasına, bir binanın üstüne al: halka ve çarpma görüntüsü
  const r = await page.evaluate(() => {
    const g = __drift.game; const p = g.player;
    const m = g.meteors.list.find((k) => k.alive);
    m.x = p.x + 60; m.y = p.y - 260; m.t = 0.2;
    g.player.vx = 0; g.player.vy = 0;
    return { x: m.x, y: m.y };
  });
  await hold(page, r.x - 60, r.y + 260, -Math.PI / 2, false);
  await page.waitForTimeout(1400);
  await shot(page, 'meteor-halka');
  await page.waitForFunction(() => __drift.game.meteors.list.some((m) => m.alive && m.t > __drift.cfg.meteor.warn + __drift.cfg.meteor.fall - 0.3), null, { timeout: 5000 });
  await shot(page, 'meteor-dusus');
  await page.waitForTimeout(380);
  await shot(page, 'meteor-carpma');
  const imp = await page.evaluate(() => __drift.game.meteors.impacts);
  ok(imp >= 1, 'meteor çarptı', String(imp));
  await release(page);
  await ctx.close();
}

// --- GİZLİ GEÇİT (iki sürümde farklı yazı) ---
if (only.includes('secret')) {
  const { ctx, page } = await open({ url: '?god=1&t=0' });
  await play(page);
  const z = await page.evaluate(() => { const z = __drift.game.world.zone('secret'); return { x: z.x, y: z.y, w: z.w, h: z.h }; });
  // Girişin yakın görünümü: neredeyse görünmez
  await hold(page, z.x - 140, z.y - 140, Math.PI / 4);
  await page.waitForTimeout(1500);
  await shot(page, 'gecit-giris');
  // Rampaya doğru sür
  await release(page);
  await page.evaluate(([x, y]) => { const p = __drift.game.player; p.x = x; p.y = y; p.a = Math.PI / 4; p.vx = 180; p.vy = 180; p.speed = 250; __drift.game.cops.length = 0; }, [z.x - 60, z.y - 60]);
  await page.waitForFunction(() => __drift.game.state === 'secret', null, { timeout: 5000 });
  await page.waitForTimeout(350);
  await shot(page, 'gecit-inis');
  await page.waitForTimeout(1300);
  const s = await page.evaluate(() => ({ text: document.querySelector('#secret b').textContent, gift: document.querySelector('#secret small').textContent, shown: !document.getElementById('secret').hidden, owned: __drift.storage.data.owned.includes('golge'), secret: __drift.storage.data.secret }));
  await shot(page, 'gecit-garaj');
  console.log('gizli geçit', JSON.stringify(s));
  const flavor = await page.evaluate(() => fetch('js/names.js').then((r) => r.text()).then((t) => (t.includes("'arkadas'") ? 'arkadas' : 'play')));
  ok(s.shown, 'bodrum sahnesi');
  ok(flavor === 'arkadas' ? s.text === "Artık Ömer Yıldız'ın da misafirisiniz" : s.text === 'Gizli bölümü buldun! Hoş geldin', `${flavor} yazısı`, s.text);
  ok(s.owned && s.secret, 'motosiklet kalıcı açıldı');
  await page.waitForFunction(() => __drift.game.state === 'play', null, { timeout: 6000 });
  ok(await page.evaluate(() => document.getElementById('secret').hidden), 'sahne kapandı');
  // Garajda görünür
  await page.evaluate(() => __drift.toMenu && __drift.toMenu());
  await page.waitForTimeout(500);
  const g2 = await page.evaluate(() => { document.getElementById('btn-garage').click(); return [...document.querySelectorAll('#garage-list .thumb span')].map((e) => e.textContent); });
  await page.waitForTimeout(400);
  ok(g2.includes('Gölge R'), 'garajda Gölge R', g2.join(','));
  await page.evaluate(() => { const l = [...document.querySelectorAll('#garage-list .thumb')]; l[l.length - 1].click(); });
  await page.waitForTimeout(500);
  await shot(page, 'garaj-motosiklet');
  await ctx.close();
  // Bulmayan oyuncu: garajda iz yok
  const fresh = await open({ url: '?god=1&t=0' });
  const g3 = await fresh.page.evaluate(() => { document.getElementById('btn-garage').click(); return { n: document.querySelectorAll('#garage-list .thumb').length, text: document.body.innerText.includes('Gölge') }; });
  ok(g3.n === 14 && !g3.text, 'bulmayanda motosiklet yok', JSON.stringify(g3));
  await fresh.ctx.close();
}

// --- MOTOSİKLET VE TARAMALI ATEŞ ---
if (only.includes('gun')) {
  const save = JSON.stringify({ owned: ['atmaca', 'kuzgun', 'golge'], selected: 'golge', secret: true, coins: 0, settings: { lang: 'tr' } });
  for (const id of ['golge', 'kuzgun']) {
    const { ctx, page } = await open({ url: '?god=1&t=300', save: save.replace('"selected":"golge"', `"selected":"${id}"`) });
    await play(page);
    const res = await page.evaluate(() => {
      const g = __drift.game; const p = g.player;
      g.cops.length = 0;
      const types = ['car', 'swat', 'dart', 'blob', 'crab', 'tank'];
      types.forEach((t, i) => { const a = (i / types.length) * Math.PI * 2; const c = g.spawnCop(t, 'chaser', p.x + Math.cos(a) * 170, p.y + Math.sin(a) * 260, 0); c.drive.maxSpeed = 1; });
      return { car: g.carSpec.id, weapon: !!g.weapon };
    });
    await hold(page, ...(await page.evaluate(() => [__drift.game.player.x, __drift.game.player.y])), Math.PI / 2, false);
    await page.waitForTimeout(900);
    await shot(page, `taramali-ates-${id}`);
    const st = await page.evaluate(() => ({ shots: __drift.game.gun.shots, hits: __drift.game.gun.hits, hit: __drift.game.cops.filter((c) => c.mhp < c.mhpMax).length, n: __drift.game.cops.length }));
    ok(res.weapon && st.shots > 4 && st.hit >= 3, `${id}: 360° ateş`, JSON.stringify(st));
    await release(page);
    await ctx.close();
  }
}

// --- STADYUMLAR gündüz/gece ---
if (only.includes('stadium')) {
  const { ctx, page } = await open({ url: '?god=1&t=0' });
  await play(page);
  const zs = await page.evaluate(() => __drift.game.world.zones().filter((z) => z.kind === 'stadium').map((z) => ({ x: z.x, y: z.y, w: z.w, h: z.h })));
  for (const z of zs) {
    const name = z.w > 600 ? 'konya' : 'yozgat';
    await page.evaluate((a) => { __drift.cfg.camera.viewArea = a; }, z.w > 600 ? 1500 : 1050);
    await hold(page, z.x + z.w / 2, z.y + z.h + 110, -Math.PI / 2);
    await page.evaluate(() => { __drift.game.dayT = 0; });
    await page.waitForFunction((k) => { const a = __drift.renderer.stadiums.arts.get(k); return a && a.hi; }, name, { timeout: 20000 });
    await page.waitForTimeout(1600);
    await shot(page, `stadyum-${name}-gunduz`);
    const vis = await page.evaluate(() => __drift.renderer.stadiums.visible.length);
    ok(vis >= 1, `${name}: stadyum çizildi`);
    await page.evaluate(() => { __drift.game.dayT = 110; });
    await page.waitForTimeout(1600);
    await shot(page, `stadyum-${name}-gece`);
    // Yakın: tabela ve taraftarlar
    await page.evaluate(() => { __drift.cfg.camera.viewArea = 740; __drift.game.dayT = 0; });
    await page.waitForTimeout(1200);
    await shot(page, `stadyum-${name}-yakin`);
  }
  await page.evaluate(() => { __drift.cfg.camera.viewArea = 740; });
  await release(page);
  await ctx.close();
}

// --- ANIT ---
if (only.includes('memorial')) {
  const { ctx, page } = await open({ url: '?god=1&t=0' });
  await play(page);
  const bx = await page.evaluate(() => { const b = __drift.game.world.memorialBox(); return { x: b.x, y: b.y, w: b.w, h: b.h }; });
  await page.evaluate(() => { __drift.cfg.camera.viewArea = 1500; });
  await hold(page, bx.x + bx.w / 2, bx.y + bx.h + 430);
  await page.waitForFunction(() => __drift.renderer.memorial.hi, null, { timeout: 15000 });
  await page.waitForTimeout(1300);
  await shot(page, 'anit-alani');
  await page.evaluate(() => { __drift.cfg.camera.viewArea = 740; });
  await release(page);
  await ctx.close();
}

// --- 6 DİLDE YAZILAR ---
if (only.includes('lang')) {
  for (const lang of ['tr', 'en', 'ja', 'zh', 'es', 'de']) {
    const { ctx, page } = await open({ lang, url: '?god=1&t=0' });
    await play(page);
    await page.evaluate(() => __drift.ui.alienAlert());
    await page.waitForTimeout(700); // Büyüme animasyonu oturur
    const t = await page.evaluate(() => {
      const a = document.getElementById('alert');
      // Satırların en genişi ekrana sığmalı (dönüşüm etkisiz ölçüm)
      const rg = document.createRange(); rg.selectNodeContents(a);
      const w = Math.max(...[...rg.getClientRects()].map((r) => r.width));
      return { text: a.textContent, fits: a.scrollWidth <= a.clientWidth + 1 && w <= innerWidth + 1, w };
    });
    await shot(page, `dil-${lang}-uzayli`);
    const m = await page.evaluate(() => { __drift.ui.meteorAlert(); return document.getElementById('alert').textContent; });
    await page.waitForTimeout(1600);
    const toast = await page.evaluate(() => document.getElementById('toast') ? document.getElementById('toast').textContent : '');
    await shot(page, `dil-${lang}-meteor`);
    ok(t.text && t.fits, `${lang}: uzaylı yazısı ekrana sığar`, t.text);
    ok(m && m !== t.text, `${lang}: meteor yazısı`, m);
    // Gizli bölüm yazısı (sürüme göre) ve hediye satırı
    const sc = await page.evaluate(async () => {
      const { tx } = await import('/js/i18n/index.js');
      const { NAMES } = await import('/js/names.js');
      const title = NAMES.misafir ? tx('secret.guest', { name: NAMES.misafir }) : tx('secret.found');
      __drift.secretScene.play(title, tx('secret.gift', { name: tx('cars.golge.name') }), true);
      return title;
    });
    await page.waitForTimeout(1500);
    const fitS = await page.evaluate(() => { const e = document.querySelector('#secret .secret-text'); const r = e.getBoundingClientRect(); return r.left >= -1 && r.right <= innerWidth + 1; });
    await shot(page, `dil-${lang}-gizli`);
    ok(sc && fitS, `${lang}: gizli bölüm yazısı`, sc);
    console.log(lang, '|', t.text, '|', m, '|', toast, '|', sc);
    await ctx.close();
  }
}

await b.close();
const bad = errs.filter((e) => !/favicon|net::ERR_ABORTED/.test(e));
ok(bad.length === 0, 'konsol hatası yok', bad.slice(0, 5).join(' | '));
console.log(JSON.stringify({ passes, fails }));
process.exit(fails.length ? 1 : 0);
