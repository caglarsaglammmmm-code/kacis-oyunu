// Açılış ekranı: oyun adı yok, geliştirici yazısı görünüyor, 1 saniyeden kısa, sonra ana ekran.
// Her karede (rAF) durum kaydedilir, birkaç kare ekran görüntüsü olarak saklanır.
// node tools/splash-test.mjs [port]   Çıktı: e2e-out/v15/acilis
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const port = Number(process.argv[2] || 8080);
const OUT = 'e2e-out/v15/acilis';
fs.mkdirSync(OUT, { recursive: true });
const WANT = { tr: 'Çağlar Sağlam tarafından geliştirildi', en: 'Developed by Çağlar Sağlam', de: 'Entwickelt von Çağlar Sağlam', ja: '開発：Çağlar Sağlam' };
const fails = [];
let passes = 0;
const ok = (c, n, e = '') => { if (c) passes++; else { fails.push(`${n} ${e}`); console.log('HATA', n, e); } };
const b = await chromium.launch({ channel: 'msedge', headless: true });
const errs = [];
for (const [lang, want] of Object.entries(WANT)) {
  for (const [sname, w, h] of [['dikey', 390, 844], ['yatay', 844, 390]]) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: lang });
    await ctx.addInitScript(() => {
      const log = globalThis.__splash = [];
      const t0 = performance.now();
      const step = () => {
        const s = document.getElementById('splash');
        const m = document.getElementById('menu');
        if (s) {
          const p = s.querySelector('p');
          log.push({ t: performance.now() - t0, on: !s.hidden, op: p ? +getComputedStyle(p).opacity : 0, text: p ? p.textContent : '', menu: m ? !m.hidden : false, all: s.textContent });
        }
        if (log.length < 2000) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errs.push(`${lang} ${e.message}`));
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(`${lang} ${m.text()}`); });
    await page.goto(`http://localhost:${port}/`);
    // Ekran görüntüleri: belirme, ortası, ana ekran
    for (const [k, at] of [['1', 150], ['2', 400], ['3', 650]]) {
      await page.waitForFunction((at) => (globalThis.__splash.at(-1) || { t: 0 }).t >= at || !document.getElementById('menu').hidden, at);
      if (sname === 'dikey' || lang === 'tr') await page.screenshot({ path: `${OUT}/${lang}-${sname}-${k}.png` });
    }
    await page.waitForFunction(() => !document.getElementById('menu').hidden);
    await page.waitForTimeout(400);
    if (sname === 'dikey' || lang === 'tr') await page.screenshot({ path: `${OUT}/${lang}-${sname}-4-ana.png` });
    const log = await page.evaluate(() => globalThis.__splash);
    const shown = log.filter((e) => e.on);
    const visible = log.filter((e) => e.on && e.op > 0.05);
    const dur = shown.length ? shown.at(-1).t - shown[0].t : 0;
    ok(shown.length > 5, `${lang} ${sname}: açılış ekranı göründü`, String(shown.length));
    ok(shown.every((e) => e.text === want), `${lang} ${sname}: yazı "${want}"`, [...new Set(shown.map((e) => e.text))].join(' | '));
    ok(shown.every((e) => !/drift\s*lab/i.test(e.all)), `${lang} ${sname}: oyun adı yazısı yok`);
    ok(Math.max(...shown.map((e) => e.op)) > 0.95, `${lang} ${sname}: tam okunur`);
    ok(dur > 500 && dur < 1000, `${lang} ${sname}: süre 1 sn'den kısa`, `${Math.round(dur)} ms`);
    ok(visible.length && visible[0].op < 0.6 && visible.at(-1).op < 0.6, `${lang} ${sname}: yumuşak belirip kaybolur`);
    const after = log.findIndex((e, i) => i > 0 && log[i - 1].on && !e.on);
    ok(after > 0 && log.slice(after).some((e) => e.menu), `${lang} ${sname}: hemen ana ekran`, `${after}`);
    const center = await page.evaluate(() => document.getElementById('menu').hidden === false && !!document.getElementById('btn-play').offsetParent);
    ok(center, `${lang} ${sname}: BAŞLA görünüyor`);
    console.log(lang, sname, `açılış ${Math.round(dur)} ms, ana ekran ${Math.round(log[after]?.t || 0)} ms`);
    await ctx.close();
  }
}
await b.close();
ok(errs.length === 0, 'konsol hatası ve uyarısı yok', errs.slice(0, 4).join(' | '));
console.log(`SONUÇ: ${passes} geçti, ${fails.length} hata`);
process.exit(fails.length ? 1 : 0);
