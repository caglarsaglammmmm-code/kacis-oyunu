// Arayüz denetimi: her ekran ve boyutta hizalama, taşma, yazı boyu, kontrast, tek BAŞLA görseli,
// ve geçişte küçülme olmadığı. node tools/ui-audit.mjs [port]
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const port = Number(process.argv[2] || 8080);
const OUT = 'e2e-out/v12';
fs.mkdirSync(OUT, { recursive: true });
const SIZES = [['kucuk', 360, 640], ['kucuk-yatay', 640, 360], ['dikey', 390, 844], ['yatay', 844, 390], ['tablet', 820, 1180], ['tablet-yatay', 1180, 820]];
const fails = [];
let passes = 0;
const ok = (c, n, x = '') => { if (c) passes++; else { fails.push(`${n} ${x}`); console.log('HATA', n, x); } };
const b = await chromium.launch({ channel: 'msedge', headless: true });

const AUDIT = () => {
  const lum = (r, g, b2) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b2); };
  const rgb = (s) => (s.match(/[\d.]+/g) || [0, 0, 0]).map(Number);
  const screen = document.querySelector('.screen:not([hidden])');
  const sel = 'button, a.btn';
  const list = [...screen.querySelectorAll(sel)].filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; });
  const scroller = screen.querySelector('.gsheet') || screen;
  const out = [];
  for (const e of list) {
    const r = e.getBoundingClientRect(); const c = getComputedStyle(e);
    const hasText = e.id !== 'btn-play' && e.textContent.trim().length > 0 && !e.querySelector('svg');
    const [cr, cg, cb] = rgb(c.color);
    const L = lum(cr, cg, cb); const B = lum(15, 16, 22);
    out.push({ id: e.id || e.className || e.textContent.trim(), text: e.textContent.trim(), l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height, font: parseFloat(c.fontSize), hasText, contrast: (Math.max(L, B) + 0.05) / (Math.min(L, B) + 0.05), over: e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1, image: c.backgroundImage.includes('.png') || (c.borderImageSource && c.borderImageSource !== 'none') || [...e.children].some((k) => getComputedStyle(k).backgroundImage.includes('.png')), radius: parseFloat(c.borderTopLeftRadius), inScroll: scroller.contains(e) });
  }
  const texts = [...screen.querySelectorAll('h2,h3,p,span,small,label,b,em,li')].filter((e) => e.getBoundingClientRect().width > 0 && e.textContent.trim() && !e.closest('button') && !e.closest('.sr')).map((e) => ({ t: e.textContent.trim().slice(0, 24), f: parseFloat(getComputedStyle(e).fontSize) }));
  return { rows: out, texts, sx: getComputedStyle(screen).overflowX === 'hidden' ? 0 : screen.scrollWidth - screen.clientWidth };
};

for (const [name, w, h] of SIZES) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  const log = [];
  page.on('pageerror', (e) => log.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log.push(m.text()); });
  await page.goto(`http://localhost:${port}/?god=1`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(350);
  const fontOk = await page.evaluate(() => document.fonts.check('700 16px Pixelify', 'ŞİĞÜÖÇşığüöç'));
  ok(fontOk, `${name} Türkçe yazı tipi yüklü`);
  const run = async (scr) => {
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${OUT}/${name}-${scr}.png` });
    const a = await page.evaluate(AUDIT);
    ok(a.sx <= 0, `${name}/${scr} yatay taşma yok`, String(a.sx));
    for (const r of a.rows) {
      const t = `${name}/${scr}/${r.id}`;
      ok(r.w >= 48 && r.h >= 48, `${t} en az 48px`, `${r.w.toFixed(0)}x${r.h.toFixed(0)}`);
      if (!r.inScroll || scr === 'menu') ok(r.l >= -0.5 && r.r <= w + 0.5 && r.t >= -0.5 && r.b <= h + 0.5, `${t} ekranda`, JSON.stringify([r.l, r.t, r.r, r.b]));
      if (r.hasText) {
        ok(r.font >= 14, `${t} yazı en az 14px`, String(r.font));
        ok(r.contrast >= 4.5, `${t} kontrast`, r.contrast.toFixed(1));
        ok(!r.over, `${t} yazı taşmaz`);
      }
      if (r.id === 'btn-play') ok(r.image, `${t} görselli`); else ok(!r.image, `${t} görselsiz`, r.id);
    }
    for (const x of a.texts) ok(x.f >= 14, `${name}/${scr} metin ${x.t} en az 14px`, String(x.f));
    const R = a.rows.filter((r) => r.id !== 'btn-apk');
    for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
      const A = R[i]; const B = R[j];
      ok(A.r <= B.l + 0.5 || B.r <= A.l + 0.5 || A.b <= B.t + 0.5 || B.b <= A.t + 0.5, `${name}/${scr} ${A.id}/${B.id} çakışmaz`);
    }
    return a;
  };
  const m = await run('menu');
  const id = (a, x) => a.rows.find((r) => r.id === x);
  const [t1, t2, t3] = ['btn-garage', 'btn-settings', 'btn-howto'].map((x) => id(m, x));
  ok(t1.h === t2.h && t2.h === t3.h && t1.t === t2.t && t2.t === t3.t, `${name} satır aynı yükseklik`);
  ok(Math.abs(t1.w - t2.w) < 1 && Math.abs(t2.w - t3.w) < 1, `${name} satır aynı genişlik`);
  const g1 = t2.l - t1.r; const g2 = t3.l - t2.r; const p = id(m, 'btn-play'); const apk = id(m, 'btn-apk');
  ok(Math.abs(g1 - g2) < 1 && Math.abs(t1.t - p.b - g1) < 1 && Math.abs(apk.t - t1.b - g1) < 1, `${name} boşluklar eşit`, [g1, g2, t1.t - p.b, apk.t - t1.b].join(','));
  ok(Math.abs((p.l + p.r) / 2 - (t2.l + t2.r) / 2) < 1.5, `${name} BAŞLA ortalı`);
  ok(p.h > t1.h * 1.3, `${name} BAŞLA en öne çıkan`);

  await page.evaluate(() => { document.getElementById('btn-garage').click(); });
  const gg = await run('garaj');
  const a1 = id(gg, 'car-prev'); const a2 = id(gg, 'car-next');
  ok(a1.w === a2.w && a1.h === a2.h && a1.t === a2.t && a1.w >= 56, `${name} oklar simetrik`, JSON.stringify([a1.w, a2.w, a1.t, a2.t]));
  const center = await page.evaluate(() => { const c = document.getElementById('px-car').getBoundingClientRect(); return { y: c.top + c.height / 2, h: c.height }; });
  ok(Math.abs(center.y - (a1.t + a1.b) / 2) < 2, `${name} oklar araba hizasında`);
  ok(center.h >= 40, `${name} araba görünür`, String(center.h));
  const sh = await page.evaluate(() => { const r = document.querySelector('.gsheet').getBoundingClientRect(); return [r.left, r.right]; });
  ok(Math.abs(sh[1] - w) < 1 && (w > h * 1.15 ? Math.abs(sh[0] - w / 2) < 8 : sh[0] === 0), `${name} alt panel tam`, String(sh));
  await page.evaluate(() => document.getElementById('car-next').click());
  await page.waitForTimeout(100);
  ok(await page.evaluate(() => __drift.ui.gi === 1 || __drift.ui.gi !== undefined), `${name} ok çalışır`);

  await page.evaluate(() => __drift.ui.show('settings'));
  await run('ayarlar');
  await page.evaluate(() => __drift.ui.show('howto'));
  await page.waitForTimeout(100);
  await page.evaluate(() => { __drift.ui.show('menu'); __drift.play(); });
  await page.waitForFunction(() => __drift.game.state === 'play' && !document.getElementById('hud').hidden);
  await page.waitForTimeout(500);
  const pz = await page.evaluate(() => { const r = document.getElementById('btn-pause').getBoundingClientRect(); return [r.width, r.height, getComputedStyle(document.getElementById('btn-pause')).borderImageSource]; });
  ok(pz[0] >= 48 && pz[1] >= 48 && pz[2] === 'none', `${name} duraklat düğmesi`, String(pz));
  await page.screenshot({ path: `${OUT}/${name}-oyun.png` });
  await page.evaluate(() => __drift.pause());
  await run('duraklat');
  ok(log.length === 0, `${name} konsol temiz`, log.slice(0, 3).join('|'));
  await ctx.close();
}

// Geçiş kareleri: kapak ölçüsü sabit, dönüşüm yok, opaklık iner
for (const [name, w, h] of [['dikey', 390, 844], ['yatay', 844, 390]]) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { Object.defineProperty(navigator, 'webdriver', { get: () => false }); });
  const page = await ctx.newPage();
  const log = [];
  page.on('pageerror', (e) => log.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') log.push(m.text()); });
  await page.goto(`http://localhost:${port}/?fx=1`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden);
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    globalThis.__fr = []; const t0 = performance.now();
    const rec = () => { const m = document.getElementById('menu'); const c = document.getElementById('cover'); const r = c.getBoundingClientRect(); const pr = m.querySelector('.menu-panel').getBoundingClientRect(); const s = getComputedStyle(c); __fr.push({ t: performance.now() - t0, hidden: m.hidden, leaving: m.classList.contains('leaving'), op: +getComputedStyle(m).opacity, w: r.width, h: r.height, x: r.left, y: r.top, ptop: pr.top, tr: s.transform, ms: getComputedStyle(m).transform }); if (performance.now() - t0 < 2300) requestAnimationFrame(rec); };
    document.getElementById('btn-play').dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
    document.getElementById('btn-play').click();
    requestAnimationFrame(rec);
  });
  for (const at of [250, 550, 850, 1150, 1700]) {
    await page.waitForFunction((a) => __fr.length && __fr[__fr.length - 1].t >= a, at);
    await page.screenshot({ path: `${OUT}/gecis-${name}-${at}.png` });
  }
  await page.waitForTimeout(800);
  const fr = await page.evaluate(() => __fr);
  const vis = fr.filter((f) => f.leaving && !f.hidden);
  const base = fr.find((f) => !f.hidden);
  ok(vis.length > 10, `${name} geçiş kareleri`, String(vis.length));
  ok(vis.every((f) => f.tr === 'none' && f.ms === 'none'), `${name} dönüşüm yok`);
  ok(vis.every((f) => Math.abs(f.w - base.w) < 0.01 && Math.abs(f.h - base.h) < 0.01 && f.x === base.x && f.y === base.y), `${name} küçülme, kayma yok`);
  ok(vis.every((f) => f.ptop === base.ptop), `${name} panel yerinde`);
  let mono = true; for (let i = 1; i < vis.length; i++) if (vis[i].op > vis[i - 1].op + 0.001) mono = false;
  ok(mono && vis[vis.length - 1].op < 0.15, `${name} opaklık iner`, String(vis[vis.length - 1].op));
  const dur = vis[vis.length - 1].t - vis[0].t;
  ok(dur >= 800 && dur <= 1200, `${name} süre 0,8-1,2 sn`, String(Math.round(dur)));
  ok(await page.evaluate(() => __drift.game.state === 'play' && document.getElementById('menu').hidden), `${name} oyuna geçti`);
  ok(log.length === 0, `${name} geçiş konsol temiz`, log.slice(0, 3).join('|'));
  console.log(name, 'geçiş', Math.round(dur), 'ms');
  await ctx.close();
}
await b.close();
console.log(`\ngecti ${passes}, hata ${fails.length}`);
if (fails.length) { console.log([...new Set(fails)].slice(0, 40).join('\n')); process.exit(1); }
