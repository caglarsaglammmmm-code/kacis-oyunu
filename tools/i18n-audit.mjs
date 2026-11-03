// Dil denetimi: 6 dil x dikey/yatay x 5 ekran. Taşma, kesilme, bozuk karakter, BAŞLA ortası, anında dil değişimi.
// node tools/i18n-audit.mjs [port]   Çıktı: e2e-out/v14/dil
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const port = Number(process.argv[2] || 8080);
const OUT = 'e2e-out/v14/dil';
fs.mkdirSync(OUT, { recursive: true });
const LANGS = ['tr', 'en', 'ja', 'zh', 'es', 'de'];
const SIZES = [['dikey', 390, 844], ['yatay', 844, 390], ['kucuk', 360, 640], ['tablet-yatay', 1180, 820]];
const fails = [];
let passes = 0;
const ok = (c, n, e = '') => { if (c) passes++; else { fails.push(`${n} ${e}`); console.log('HATA', n, e); } };
const b = await chromium.launch({ channel: 'msedge', headless: true });
const errs = [];

// Görünen ekrandaki yazılar: kutudan taşan, ekran dışına çıkan, bozuk karakterli
const inspect = (page, screen) => page.evaluate((screen) => {
  const root = document.getElementById(screen);
  const bad = [];
  const W = innerWidth; const H = innerHeight;
  const els = root.querySelectorAll('button, a.btn, h2, h3, span, b, small, p, li, strong, em, label');
  for (const el of els) {
    if (!el.offsetParent || el.closest('[hidden]')) continue;
    const txt = el.textContent.trim();
    if (!txt) continue;
    if (/�|\?\?/.test(txt)) bad.push(`bozuk: ${txt}`);
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width === 0) continue;
    if (cs.whiteSpace === 'nowrap' && el.scrollWidth > el.clientWidth + 1) bad.push(`taşma: ${txt} (${el.scrollWidth}>${el.clientWidth})`);
    // Kaydırılabilir paneller hariç ekrandan çıkan yazı
    const scroller = el.closest('.gsheet, #garage-list, .form, .howto, #settings, #howto');
    if (!scroller && (r.right > W + 1 || r.left < -1)) bad.push(`ekran dışı: ${txt}`);
    // Düğme içindeki yazı düğmeden taşmasın
    const btn = el.closest('button, a.btn');
    if (btn && btn !== el) {
      const q = btn.getBoundingClientRect();
      if (r.left < q.left - 1 || r.right > q.right + 1) bad.push(`düğmeden taşma: ${txt}`);
    }
  }
  return bad;
}, screen);

for (const [sname, w, h] of SIZES) {
  for (const lang of LANGS) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: lang === 'zh' ? 'zh-CN' : lang });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errs.push(`${lang} ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`${lang} ${m.text()}`); });
    await page.goto(`http://localhost:${port}/?god=1`);
    await page.waitForFunction(() => !document.getElementById('menu').hidden);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(500);
    const shot = (n) => (sname === 'dikey' || sname === 'yatay') && page.screenshot({ path: `${OUT}/${lang}-${sname}-${n}.png` });
    // Cihaz dili algılandı mı
    const got = await page.evaluate(() => document.documentElement.lang);
    ok(got.startsWith(lang), `${sname} ${lang}: cihaz dili algılandı`, got);

    // Ana ekran ve BAŞLA ortası
    const center = await page.evaluate(() => {
      const s = document.getElementById('btn-play').getBoundingClientRect();
      const nav = document.querySelector('.menu nav').getBoundingClientRect();
      // Panelin solundaki şeritli bant düzenin parçası değildir: görünür alanın ortası alınır
      const pn = document.querySelector('.menu-panel');
      const panel = pn.getBoundingClientRect().toJSON();
      const band = getComputedStyle(pn, '::before');
      if (band.left === '0px' && parseFloat(band.width) < 40) panel.left += (parseFloat(band.width) || 0) + parseFloat(band.borderLeftWidth) + parseFloat(band.borderRightWidth);
      const t = document.getElementById('start-txt');
      const tr = t.getBoundingClientRect();
      return { dx: Math.abs((s.left + s.right) / 2 - (nav.left + nav.right) / 2), dp: Math.abs((s.left + s.right) / 2 - (panel.left + panel.right) / 2), text: t.textContent, over: t.scrollWidth > t.clientWidth + 1, inside: tr.left >= s.left && tr.right <= s.right };
    });
    ok(center.dx <= 1 && center.dp <= 1, `${sname} ${lang}: BAŞLA ortada`, JSON.stringify(center));
    ok(!center.over && center.inside, `${sname} ${lang}: BAŞLA yazısı sığıyor`, center.text);
    ok((await inspect(page, 'menu')).length === 0, `${sname} ${lang}: ana ekran`, (await inspect(page, 'menu')).join(' | '));
    await shot('ana');

    await page.evaluate(() => document.getElementById('btn-settings').click());
    await page.waitForTimeout(250);
    ok((await inspect(page, 'settings')).length === 0, `${sname} ${lang}: ayarlar`, (await inspect(page, 'settings')).join(' | '));
    await shot('ayarlar');

    await page.evaluate(() => document.querySelector('#settings .back').click());
    await page.evaluate(() => document.getElementById('btn-garage').click());
    await page.waitForTimeout(350);
    ok((await inspect(page, 'garage')).length === 0, `${sname} ${lang}: garaj`, (await inspect(page, 'garage')).join(' | '));
    await shot('garaj');
    await page.evaluate(() => document.querySelector('#garage .back').click());

    await page.evaluate(() => __drift.play());
    await page.waitForFunction(() => __drift.game.state === 'play');
    await page.waitForTimeout(300);
    await page.evaluate(() => __drift.pause());
    await page.waitForTimeout(250);
    ok((await inspect(page, 'pause')).length === 0, `${sname} ${lang}: duraklatma`, (await inspect(page, 'pause')).join(' | '));
    await shot('duraklat');

    await page.evaluate(() => { __drift.resume(); const g = __drift.game; g.score = 123456; g.time = 187; g.driftTime = 12.5; g.state = 'dying'; g.dyingT = 0.01; });
    await page.waitForFunction(() => !document.getElementById('over').hidden);
    await page.waitForTimeout(800);
    ok((await inspect(page, 'over')).length === 0, `${sname} ${lang}: oyun bitti`, (await inspect(page, 'over')).join(' | '));
    await shot('bitti');
    await ctx.close();
  }
}

// Ayarlardan dil değişimi: sayfa yenilenmeden, kayıtlı kalır, BAŞLA ortada
{
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'pt-BR' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(`degisim ${e.message}`));
  await page.goto(`http://localhost:${port}/`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  ok(await page.evaluate(() => document.documentElement.lang) === 'en', 'desteklenmeyen cihaz dili: İngilizce');
  await page.evaluate(() => { window.__mark = 1; document.getElementById('btn-settings').click(); });
  for (const lang of ['de', 'ja', 'tr']) {
    await page.evaluate((l) => document.querySelector(`.seg[data-set=lang] button[data-v=${l}]`).click(), lang);
    await page.waitForTimeout(150);
    const r = await page.evaluate(() => ({ mark: window.__mark, lang: document.documentElement.lang, title: document.querySelector('#settings h2').textContent, saved: JSON.parse(localStorage.getItem('drift-lab-v1')).settings.lang }));
    ok(r.mark === 1 && r.lang.startsWith(lang) && r.saved === lang, `anında ${lang}`, JSON.stringify(r));
  }
  await page.evaluate(() => document.querySelector('#settings .back').click());
  ok(await page.evaluate(() => document.getElementById('start-txt').textContent) === 'BAŞLA', 'menü Türkçe');
  await page.reload();
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  ok(await page.evaluate(() => document.documentElement.lang) === 'tr', 'yeniden açılınca kayıtlı dil');
  await ctx.close();
}
await b.close();
const e2 = errs.filter((e) => !/favicon/.test(e));
ok(e2.length === 0, 'konsol hatası ve uyarısı yok', e2.slice(0, 5).join(' | '));
console.log(`SONUÇ: ${passes} geçti, ${fails.length} hata`);
process.exit(fails.length ? 1 : 0);
