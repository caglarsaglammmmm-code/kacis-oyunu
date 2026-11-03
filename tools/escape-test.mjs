// Kıl payı kaçış bildirimi: görünüp kaybolur, art arda gelenler birleşir, dile göre yazılır, hilede çıkmaz.
// node tools/escape-test.mjs [port]   Çıktı: e2e-out/v16
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const port = Number(process.argv[2] || 8080);
const OUT = 'e2e-out/v16';
fs.mkdirSync(OUT, { recursive: true });
const fails = [];
let passes = 0;
const ok = (c, n, e = '') => { if (c) passes++; else { fails.push(`${n} ${e}`); console.log('HATA', n, e); } };
const b = await chromium.launch({ channel: 'msedge', headless: true });
const errs = [];

// Sayfada gerçek oyun nesneleriyle kıl payı geçiş: oyuncu polisin 45 birim yanından hızla geçer
const PASS = () => {
  const g = __drift.game; const p = g.player;
  const c = g.spawnCop('car', 'chaser', p.x + 200, p.y + 45, 0); c.state = 'chase';
  let got = 0;
  for (let t = 0; t < 1.6; t += 1 / 60) {
    p.x += 300 / 60; p.speed = 300; p.forward = 300; p.vx = 300; p.vy = 0;
    g.runTime += 1 / 60;
    c.x = p.x - (p.x - c.x); // Polis yerinde
    got += g.checkEscape(c, Math.hypot(c.x - p.x, c.y - p.y));
  }
  return got;
};
const msg = (page) => page.evaluate(() => { const el = document.getElementById('escape-msg'); const r = el.getBoundingClientRect(); return { text: el.firstElementChild.textContent, combo: el.lastElementChild.textContent, op: +getComputedStyle(el).opacity, top: r.top, left: r.left, right: r.right, w: innerWidth }; });

for (const [lang, word] of [['tr', 'KIL PAYI!'], ['en', 'CLOSE CALL!'], ['ja', 'ギリギリ回避！']]) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: lang });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(`${lang} ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`${lang} ${m.text()}`); });
  await page.goto(`http://localhost:${port}/?god=1`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  await page.evaluate(() => __drift.play());
  await page.waitForFunction(() => __drift.game.state === 'play');
  await page.waitForTimeout(600);
  const coins0 = await page.evaluate(() => __drift.game.coins);
  const got = await page.evaluate(`(${PASS})()`);
  await page.waitForTimeout(220);
  const m1 = await msg(page);
  ok(got >= 5 && got <= 12, `${lang}: ödül verildi`, String(got));
  ok(m1.op > 0.9 && m1.text === `+${got} ${word}`, `${lang}: bildirim görünüyor`, JSON.stringify(m1));
  ok(m1.left >= 0 && m1.right <= m1.w && m1.top > 40, `${lang}: bildirim ekranda, üst göstergeye binmiyor`, JSON.stringify(m1));
  await page.waitForTimeout(150);
  const hud = await page.evaluate(() => document.getElementById('hud-coins').textContent);
  ok(Number(hud) === coins0 + got, `${lang}: para göstergesi arttı`, `${hud}`);
  await page.screenshot({ path: `${OUT}/kil-payi-${lang}.png` });
  // Yük altında da çalışsın: süre değil durum beklenir (animasyon 1,3 sn)
  const gone = await page.waitForFunction(() => +getComputedStyle(document.getElementById('escape-msg')).opacity < 0.05, null, { timeout: 2500 }).then(() => true, () => false);
  ok(gone, `${lang}: bildirim kayboldu`);
  if (lang === 'tr') {
    // Art arda iki kaçış: tek bildirimde toplanır, üst üste binmez
    const [a, bb] = await page.evaluate(`[(${PASS})(), (${PASS})()]`);
    await page.waitForTimeout(150);
    const m2 = await msg(page);
    const count = await page.evaluate(() => document.querySelectorAll('#escape-msg').length);
    ok(count === 1 && m2.text === `+${a + bb} KIL PAYI!` && m2.op > 0.9, 'art arda kaçışlar birleşir', JSON.stringify({ m2, a, bb }));
    ok(m2.combo === 'KOMBO +2', 'üçüncü kaçışta kombo', m2.combo);
    await page.screenshot({ path: `${OUT}/kil-payi-birlesik.png` });
    await page.waitForTimeout(1500);
    // Hile açıkken ödül ve bildirim yok
    const before = await page.evaluate(() => { __drift.game.toggleCheat(); return __drift.game.coins; });
    await page.waitForTimeout(2800);
    const g3 = await page.evaluate(`(${PASS})()`);
    await page.waitForTimeout(200);
    const m3 = await msg(page);
    ok(g3 === 0 && m3.op < 0.05 && (await page.evaluate(() => __drift.game.coins)) === before, 'hile açıkken ödül ve bildirim yok', JSON.stringify({ g3, m3 }));
  }
  await ctx.close();
}
await b.close();
ok(errs.length === 0, 'konsol hatası ve uyarısı yok', errs.slice(0, 4).join(' | '));
console.log(`SONUÇ: ${passes} geçti, ${fails.length} hata`);
process.exit(fails.length ? 1 : 0);
