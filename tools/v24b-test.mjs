// 24.1.0 ikinci yayın tarayıcı sınaması: kolej ve siyah-beyaz site görünümü, tabela dili (tr / en / ja / de),
// 16 basışlık hile kodu klavyeyle, eski 12 basışlık kod açmaz. Konsol hatası olmamalı.
// Önce iki sunucu: npm run serve (8080, play) ve FLAVOR=arkadas PORT=8082 node tools/serve.mjs
// node tools/v24b-test.mjs [play portu] [arkadaş portu]
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const PORTS = { play: Number(process.argv[2] || 8080), arkadas: Number(process.argv[3] || 8082) };
const OUT = 'e2e-out/v24b';
fs.mkdirSync(OUT, { recursive: true });
const fails = [];
let passes = 0;
const ok = (c, name, extra = '') => { if (c) passes++; else { fails.push(`${name} ${extra}`); console.log('HATA', name, extra); } };
const b = await chromium.launch({ channel: 'msedge', headless: true });
const errs = [];

async function open(port) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'tr' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(`pageerror ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(`http://localhost:${port}/?god=1&t=0`);
  await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden, null, { timeout: 30000 });
  await setLang(page, 'tr');
  return { ctx, page };
}
const setLang = (page, code) => page.evaluate((c) => { const k = __drift; k.storage.data.settings.lang = c; k.storage.save(); k.applySettings(); }, code);
const play = async (page) => {
  await page.evaluate(() => __drift.play());
  await page.waitForFunction(() => __drift.game.state === 'play' && !__drift.renderer.warmingNow, null, { timeout: 20000 });
  await page.waitForTimeout(400);
};
const hold = (page, x, y) => page.evaluate(([x, y]) => {
  const g = __drift.game;
  clearInterval(globalThis.__hold);
  globalThis.__hold = setInterval(() => { const p = g.player; p.x = x; p.y = y; p.vx = 0; p.vy = 0; p.speed = 0; p.a = -Math.PI / 2; g.cops.length = 0; }, 4);
}, [x, y]);
const release = (page) => page.evaluate(() => clearInterval(globalThis.__hold));
const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` });
// Tuval üzerinde bir bölgedeki farklı renk sayısı: sahne gerçekten çizildi mi
const colorful = (page) => page.evaluate(() => {
  const c = document.querySelector('canvas'); const g = c.getContext('2d');
  const d = g.getImageData(c.width * 0.2, c.height * 0.2, c.width * 0.6, c.height * 0.4).data;
  const s = new Set(); for (let i = 0; i < d.length; i += 64) s.add(`${d[i] >> 4},${d[i + 1] >> 4},${d[i + 2] >> 4}`); return s.size;
});

for (const flavor of ['play', 'arkadas']) {
  const { ctx, page } = await open(PORTS[flavor]);
  await play(page);
  const info = await page.evaluate(() => {
    const w = __drift.game.world;
    const k = w.kolejChunk();
    const kc = w.chunk(k.cx, k.cy);
    let kr = null; for (let i = 0; i < kc.rectCount; i++) if (kc.rects[i].landmark === 'kolej') kr = kc.rects[i];
    const s = w.sites.find((x) => x.layout === 2);
    const sc = w.chunk(s.cx, s.cy);
    const blocks = []; for (let i = 0; i < sc.rectCount; i++) if (sc.rects[i].landmark === 'monokrom') blocks.push({ x: sc.rects[i].x, y: sc.rects[i].y, w: sc.rects[i].w, h: sc.rects[i].h, sign: sc.rects[i].sign });
    return { kolej: { cx: k.cx, cy: k.cy, x: kr.x, y: kr.y, w: kr.w, h: kr.h, sign: kr.sign }, site: { cx: s.cx, cy: s.cy, name: s.name, x: sc.x, y: sc.y }, blocks };
  });
  console.log(flavor, 'kolej chunk', info.kolej.cx, info.kolej.cy, 'site chunk', info.site.cx, info.site.cy, info.site.name);
  ok(info.kolej.sign === (flavor === 'play' ? 'KOLEJ' : 'SİSTEM KOLEJİ'), `${flavor}: kolej adı`, info.kolej.sign);
  ok(info.site.name === (flavor === 'play' ? 'Monokrom Sitesi' : 'Anthropic Sitesi'), `${flavor}: site adı`, info.site.name);
  ok(info.blocks.length === 6, `${flavor}: 6 blok`, String(info.blocks.length));

  const views = [
    ['kolej', info.kolej.x + info.kolej.w / 2, info.kolej.y + info.kolej.h + 260],
    ['site', info.site.x + 640, info.site.y + 700],
  ];
  for (const lang of ['tr', 'en', 'ja', 'de']) {
    await setLang(page, lang);
    for (const [name, x, y] of views) {
      await hold(page, x, y);
      await page.waitForTimeout(1300);
      await shot(page, `${flavor}-${name}-${lang}`);
      ok((await colorful(page)) > 12, `${flavor}-${name}-${lang}: sahne çizildi`);
    }
    // Tabela görüntüleri o dilde üretildi mi: kolej tabelası ve site tabelası yeniden çizilmiş olmalı
    const t = await page.evaluate(async () => {
      const m = await import('./js/tabela.js');
      return { kolej: m.tabelaText(__drift.game.world.kolejChunk() && (await import('./js/names.js')).NAMES.kolej.ad), z: m.tabelaText('Züccaciye'), lang: __drift.renderer.signLang };
    });
    const en = lang !== 'tr';
    ok(t.lang === (en ? 'en' : 'tr'), `${flavor}-${lang}: çizici tabela dili`, t.lang);
    ok(t.z === (en ? 'Crockery Store' : 'Züccaciye'), `${flavor}-${lang}: Züccaciye`, t.z);
    const want = flavor === 'play' ? (en ? 'COLLEGE' : 'KOLEJ') : (en ? 'SYSTEM COLLEGE' : 'SİSTEM KOLEJİ');
    ok(t.kolej === want, `${flavor}-${lang}: kolej tabelası`, t.kolej);
  }
  // Gece: blokların pencereleri yanar
  await page.evaluate(() => { const D = __drift.cfg.day; __drift.game.dayT = (0.7 - D.start) * D.length; });
  await hold(page, views[1][1], views[1][2]);
  await page.waitForTimeout(1300);
  await shot(page, `${flavor}-site-gece`);
  await release(page);
  await setLang(page, 'tr');

  // Hile kodu: klavyeyle kısa basışlar. Eski 12'li kod açmaz, yeni 16'lı açar, yanlış basış sıfırlar
  const tap = async (d) => { const k = d === 'L' ? 'ArrowLeft' : 'ArrowRight'; await page.keyboard.down(k); await page.waitForTimeout(90); await page.keyboard.up(k); await page.waitForTimeout(110); };
  const cheat = () => page.evaluate(() => __drift.game.cheat);
  for (const d of 'LLRRLRLRLLRR') await tap(d);
  await page.waitForTimeout(2300);
  ok((await cheat()) === false, `${flavor}: eski 12 basışlık kod açmaz`);
  for (const d of 'LLRRLRLRLLRRL') await tap(d);
  await tap('R'); // Yanlış
  for (const d of 'LLR') await tap(d);
  await page.waitForTimeout(2300);
  ok((await cheat()) === false, `${flavor}: araya yanlış basış girince açmaz`);
  for (const d of 'LLRRLRLRLLRRLLLR') await tap(d);
  await page.waitForTimeout(300);
  ok((await cheat()) === true, `${flavor}: yeni 16 basışlık kod açar`);
  await shot(page, `${flavor}-hile-acik`);
  await ctx.close();
}
await b.close();
ok(errs.length === 0, 'konsol hatası yok', errs.slice(0, 5).join(' | '));
console.log(`\n${passes} geçti, ${fails.length} hata`);
for (const f of fails) console.log('  -', f);
process.exit(fails.length ? 1 : 0);
