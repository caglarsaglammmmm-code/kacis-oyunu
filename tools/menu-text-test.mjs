// Menü yazılarının okunaklılığı (24.2.0): ana ekran, garaj (araba seçme ve mağaza: boya, silah), ayarlar.
// 6 dil x 3 ekran (390x844, küçük 320x568, yatay 844x390). Her görünür yazı için:
//   - yazı tipi okunaklı yığın (Nunito / cihaz yazı tipi), piksel yazı tipi değil
//   - en az 11 px
//   - taşma ya da kesilme yok (kutusundan geniş yazı)
//   - yazı ile arkasındaki zemin arasında kontrast en az 3 (WCAG büyük / kalın yazı); zemin görselse gölge şartı
// Önce sunucu: npm run serve.  node tools/menu-text-test.mjs [port]
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const PORT = Number(process.argv[2] || 8080);
const OUT = 'e2e-out/menu-text';
fs.mkdirSync(OUT, { recursive: true });
const fails = [];
let checked = 0;
const b = await chromium.launch({ channel: 'msedge', headless: true });

// Sayfada: görünür yazı öğelerini ölçer. Zemin rengi: ilk opak arka planlı ata; görsel zeminde gölge aranır
const audit = () => {
  const parse = (c) => { const m = c.match(/rgba?\(([^)]+)\)/); if (!m) return null; const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; };
  const lum = ({ r, g, b: bl }) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(bl); };
  const ratio = (x, y) => { const a = lum(x) + 0.05; const c = lum(y) + 0.05; return Math.max(a, c) / Math.min(a, c); };
  const out = [];
  for (const el of document.querySelectorAll('.screen:not([hidden]) *')) {
    if (!el.offsetParent || el.closest('.sr') || el.classList.contains('sr')) continue;
    const own = [...el.childNodes].filter((n) => n.nodeType === 3 && n.textContent.trim()).map((n) => n.textContent.trim()).join(' ');
    if (!own) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.bottom < 0 || r.top > innerHeight) continue;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || Number(cs.opacity) === 0) continue;
    const item = { t: own.slice(0, 24), id: el.id || String(el.className).slice(0, 24), font: cs.fontFamily, size: parseFloat(cs.fontSize), issues: [] };
    if (/Pixelify|Press Start/i.test(cs.fontFamily.split(',')[0])) item.issues.push('piksel yazı tipi');
    if (item.size < 11) item.issues.push(`küçük ${item.size}px`);
    const clipX = el.scrollWidth > el.clientWidth + 1 && cs.overflow !== 'visible';
    const parent = el.parentElement;
    const spill = cs.overflow === 'visible' && el.scrollWidth > parent.clientWidth + 2 && parent.scrollWidth > parent.clientWidth + 2 && getComputedStyle(parent).overflow !== 'visible';
    if (clipX || spill) item.issues.push('taşma/kesilme');
    let bg = null;
    let image = false;
    for (let a = el; a; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (s.backgroundImage !== 'none' && !/gradient/.test(s.backgroundImage)) { image = true; break; }
      const g = s.backgroundImage.match(/rgba?\([^)]+\)/);
      const c = parse(s.backgroundColor);
      if (c && c.a > 0.6) { bg = c; break; }
      if (g) { const gc = parse(g[0]); if (gc && gc.a > 0.6) { bg = gc; break; } }
      if (a.tagName === 'CANVAS') { image = true; break; }
    }
    const fg = parse(cs.color);
    if (bg && fg) {
      item.contrast = +ratio(fg, bg).toFixed(2);
      if (item.contrast < 3) item.issues.push(`kontrast ${item.contrast}`);
    } else if (image || !bg) {
      // Görsel ya da tuval üstünde: gölge ya da koyu yarı saydam kutu şart
      item.contrast = 'görsel';
      const shadowed = cs.textShadow !== 'none';
      let boxed = false;
      for (let a = el; a && a !== document.body; a = a.parentElement) { const c = parse(getComputedStyle(a).backgroundColor); if (c && c.a >= 0.3 && lum(c) < 0.1) { boxed = true; break; } }
      if (!shadowed && !boxed) item.issues.push('görsel üstünde gölgesiz');
    }
    out.push(item);
  }
  return out;
};

for (const [w, h] of [[390, 844], [320, 568], [844, 390]]) {
  for (const lang of ['tr', 'en', 'ja', 'zh', 'es', 'de']) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage();
    await page.goto(`http://localhost:${PORT}/?god=1&t=0`);
    await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden, null, { timeout: 30000 });
    await page.evaluate((l) => { const k = __drift; k.storage.data.settings.lang = l; k.storage.data.coins = 1234567; k.storage.setBerserk(2400); k.storage.save(); k.applySettings(); k.ui.refreshMenu(); }, lang);
    await page.waitForTimeout(500);
    const tag = `${w}x${h}-${lang}`;
    const screens = [];
    screens.push(['ana ekran', await page.evaluate(audit)]);
    await page.screenshot({ path: `${OUT}/menu-${tag}.png` });
    await page.click('#btn-garage');
    await page.waitForTimeout(300);
    screens.push(['garaj', await page.evaluate(audit)]);
    await page.screenshot({ path: `${OUT}/garaj-${tag}.png` });
    await page.click('.custom-tabs button[data-tab="gun"]');
    await page.locator('#custom-buy').scrollIntoViewIfNeeded();
    screens.push(['silah', await page.evaluate(audit)]);
    await page.screenshot({ path: `${OUT}/silah-${tag}.png` });
    await page.locator('#garage-list').scrollIntoViewIfNeeded();
    screens.push(['araba listesi', await page.evaluate(audit)]);
    await page.evaluate(() => document.querySelector('#garage .back').click());
    await page.click('#btn-settings');
    screens.push(['ayarlar', await page.evaluate(audit)]);
    await page.locator('.code-row').scrollIntoViewIfNeeded();
    screens.push(['ayarlar alt', await page.evaluate(audit)]);
    await page.screenshot({ path: `${OUT}/ayarlar-${tag}.png` });
    for (const [name, items] of screens) {
      for (const it of items) {
        checked++;
        if (it.issues.length) fails.push(`${tag} ${name}: "${it.t}" (${it.id}) ${it.issues.join(', ')}`);
      }
    }
    await ctx.close();
  }
}
await b.close();
console.log(`${checked} yazı ölçüldü, ${fails.length} sorun`);
if (fails.length) { console.log([...new Set(fails)].slice(0, 60).join('\n')); process.exit(1); }
