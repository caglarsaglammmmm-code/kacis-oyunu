// iPhone/iPad "Ana Ekrana Ekle" rehberi testi. node tools/a2hs-test.mjs [port]. Çıktı: e2e-out/v19
import { chromium } from 'playwright-core';
import fs from 'node:fs';
const port = Number(process.argv[2] || 8080);
const OUT = 'e2e-out/v19';
fs.mkdirSync(OUT, { recursive: true });
let pass = 0; let fail = 0;
const ok = (c, m, d = '') => { if (c) pass++; else { fail++; console.log('HATA', m, d); } };
const UA = {
  iphoneSafari: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1',
  iphoneChrome: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/126.0.6478.54 Mobile/15E148 Safari/604.1',
  ipad: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  instagram: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 330.0',
  android: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36',
  desktop: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
};
const b = await chromium.launch({ channel: 'msedge', headless: true });
const errs = [];
async function open({ ua, w = 390, h = 664, lang = 'tr', standalone = false, touch = 5, store = null, brokenStorage = false }) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: !/Windows|Macintosh/.test(ua) || touch > 0, hasTouch: touch > 0, userAgent: ua, locale: lang });
  await ctx.addInitScript(({ standalone, touch, store, brokenStorage, lang }) => {
    if (standalone) Object.defineProperty(navigator, 'standalone', { get: () => true });
    Object.defineProperty(navigator, 'maxTouchPoints', { get: () => touch });
    if (store && !sessionStorage.getItem('seeded')) { for (const [k, v] of Object.entries(store)) localStorage.setItem(k, v); sessionStorage.setItem('seeded', '1'); }
    if (!localStorage.getItem('drift-lab-v1')) localStorage.setItem('drift-lab-v1', JSON.stringify({ settings: { lang } }));
    if (brokenStorage) Object.defineProperty(window, 'localStorage', { get() { throw new Error('engelli'); } });
  }, { standalone, touch, store, brokenStorage, lang });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(`http://localhost:${port}/`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden, null, { timeout: 30000 });
  await page.waitForTimeout(1700);
  return { ctx, page };
}
const shown = (page) => page.evaluate(() => { const e = document.getElementById('a2hs'); return !!e && !e.hidden && e.getBoundingClientRect().height > 0; });

// 1) Görünür: iPhone Safari (Paylaş altta), iPhone Chrome ve iPad (üstte)
for (const [name, ua, share, touch] of [['iphone-safari', UA.iphoneSafari, 'bottom', 5], ['iphone-chrome', UA.iphoneChrome, 'top', 5], ['ipad-safari', UA.ipad, 'top', 5]]) {
  const { ctx, page } = await open({ ua, touch, w: name.startsWith('ipad') ? 820 : 390, h: name.startsWith('ipad') ? 1100 : 664 });
  ok(await shown(page), `${name}: kart görünüyor`);
  const info = await page.evaluate(() => {
    const e = document.getElementById('a2hs'); const r = e.getBoundingClientRect();
    const btns = ['btn-play', 'btn-garage', 'btn-settings', 'btn-howto'].map((i) => document.getElementById(i).getBoundingClientRect());
    const cover = btns.some((k) => k.top < r.bottom && r.top < k.bottom && k.left < r.right && r.left < k.right);
    return { share: e.dataset.share, step1: e.querySelector('[data-a2hs-step1]').textContent, cover, inView: r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth };
  });
  ok(info.share === share, `${name}: Paylaş yeri ${share}`, JSON.stringify(info));
  ok(!info.cover && info.inView, `${name}: menü düğmelerini kapatmıyor, ekranın içinde`, JSON.stringify(info));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await ctx.close();
}

// 2) Görünmez: ana ekrandan açılmış, Android, masaüstü, uygulama içi tarayıcı
for (const [name, o] of [['standalone', { ua: UA.iphoneSafari, standalone: true }], ['android', { ua: UA.android }], ['masaustu', { ua: UA.desktop, touch: 0, w: 1280, h: 800 }], ['instagram', { ua: UA.instagram }]]) {
  const { ctx, page } = await open(o);
  ok(!(await shown(page)), `${name}: kart görünmüyor`);
  await ctx.close();
}

// 3) Tamam: bu açılışta kapanır, oyun başlamaz, yeniden açılışta tekrar gelir. Bir daha gösterme: kalıcı
{
  const { ctx, page } = await open({ ua: UA.iphoneSafari });
  await page.tap('#a2hs-ok');
  await page.waitForTimeout(200);
  ok(!(await shown(page)), 'Tamam kartı kapatır');
  ok(await page.evaluate(() => __drift.game.state !== 'play' && !document.getElementById('menu').hidden), 'Tamam oyunu başlatmaz, menü yerinde');
  await page.reload(); await page.waitForFunction(() => !document.getElementById('menu').hidden); await page.waitForTimeout(1700);
  ok(await shown(page), 'Tamam sonrası yeniden açılışta kart yine gelir');
  await page.tap('#a2hs-never');
  await page.waitForTimeout(200);
  ok(!(await shown(page)), 'Bir daha gösterme kartı kapatır');
  ok((await page.evaluate(() => localStorage.getItem('drift-lab-a2hs'))) === 'never', 'tercih kaydedildi');
  await page.reload(); await page.waitForFunction(() => !document.getElementById('menu').hidden); await page.waitForTimeout(1700);
  ok(!(await shown(page)), 'yeniden açılışta gösterilmiyor');
  // Oyun açılınca kart menüyle birlikte gizlidir
  await ctx.close();
}
{
  const { ctx, page } = await open({ ua: UA.iphoneSafari });
  await page.evaluate(() => __drift.play());
  await page.waitForFunction(() => __drift.game.state === 'play');
  ok(!(await shown(page)), 'oyun sırasında kart görünmüyor');
  await ctx.close();
}
// 4) localStorage erişilemez (özel mod): kart çalışır, hata yok
{
  const before = errs.length;
  const { ctx, page } = await open({ ua: UA.iphoneSafari, brokenStorage: true });
  ok(await shown(page), 'localStorage kapalıyken de kart görünüyor');
  await page.tap('#a2hs-never');
  ok(!(await shown(page)), 'localStorage kapalıyken kapanıyor');
  ok(errs.slice(before).every((e) => !/a2hs/i.test(e)), 'localStorage kapalıyken rehber hatası yok', errs.slice(before).join(' | '));
  await ctx.close();
  errs.length = before; // Oyunun kendi depolama uyarıları bu senaryoya özel
}

// 5) Altı dil, dikey küçük ekran ve yatay: taşma yok
for (const lang of ['tr', 'en', 'ja', 'zh', 'es', 'de']) {
  for (const [tag, w, h] of [['dikey', 320, 568], ['dikey', 390, 664], ['yatay', 844, 390]]) {
    const { ctx, page } = await open({ ua: UA.iphoneSafari, lang, w, h });
    const r = await page.evaluate(() => {
      const e = document.getElementById('a2hs'); const box = e.getBoundingClientRect();
      const over = [...e.querySelectorAll('h3, li span, button')].filter((k) => k.scrollWidth > k.clientWidth + 1 || k.scrollHeight > k.clientHeight + 1 && k.tagName === 'BUTTON').map((k) => k.textContent);
      const btns = ['btn-play', 'btn-garage', 'btn-settings', 'btn-howto'].map((i) => document.getElementById(i).getBoundingClientRect());
      const cover = btns.some((k) => k.top < box.bottom && box.top < k.bottom && k.left < box.right && box.left < k.right);
      const texts = [...e.querySelectorAll('h3, li span, button')].map((k) => k.textContent);
      return { shown: !e.hidden, over, cover, inView: box.top >= 0 && box.bottom <= innerHeight && box.left >= 0 && box.right <= innerWidth, texts, minBtn: Math.min(...[...e.querySelectorAll('button')].map((k) => k.getBoundingClientRect().height)), lang: document.documentElement.lang };
    });
    ok(r.shown, `${lang} ${tag} ${w}x${h}: görünüyor`);
    ok(r.over.length === 0, `${lang} ${tag} ${w}x${h}: taşma yok`, r.over.join(','));
    ok(r.inView && !r.cover, `${lang} ${tag} ${w}x${h}: ekranda, düğmeleri kapatmıyor`, JSON.stringify(r));
    ok(r.minBtn >= 48, `${lang} ${tag}: düğme en az 48px`, String(r.minBtn));
    ok(r.texts.every((t) => t && !t.startsWith('a2hs.')), `${lang}: çeviriler yerinde`, r.texts.join(' / '));
    if (lang !== 'tr') ok(r.texts[0] !== 'Oyunu ana ekrana ekle', `${lang}: başlık Türkçe kalmadı`, r.texts[0]);
    if (w === 390 || tag === 'yatay') await page.screenshot({ path: `${OUT}/dil-${lang}-${tag}.png` });
    await ctx.close();
  }
}

// 6) iOS meta etiketleri ve ikon
{
  const { ctx, page } = await open({ ua: UA.iphoneSafari });
  const m = await page.evaluate(async () => {
    const meta = (n) => document.querySelector(`meta[name="${n}"]`)?.content;
    const link = document.querySelector('link[rel="apple-touch-icon"]');
    const img = new Image(); img.src = link.href; await img.decode();
    const man = await (await fetch(document.querySelector('link[rel="manifest"]').href)).json();
    return { capable: meta('apple-mobile-web-app-capable'), title: meta('apple-mobile-web-app-title'), bar: meta('apple-mobile-web-app-status-bar-style'), sizes: link.getAttribute('sizes'), w: img.naturalWidth, h: img.naturalHeight, name: man.name, short: man.short_name, display: man.display, docTitle: document.title };
  });
  ok(m.capable === 'yes', 'apple-mobile-web-app-capable = yes');
  ok(m.title === 'Drift Lab' && m.short === 'Drift Lab' && m.docTitle === 'Drift Lab', 'ana ekran adı Drift Lab', JSON.stringify(m));
  ok(m.bar === 'black-translucent', 'durum çubuğu stili black-translucent');
  ok(m.sizes === '180x180' && m.w === 180 && m.h === 180, 'apple-touch-icon 180x180', JSON.stringify(m));
  ok(['fullscreen', 'standalone'].includes(m.display), 'manifest tam ekran');
  await ctx.close();
}

await b.close();
ok(errs.length === 0, 'konsol hatası yok', errs.slice(0, 5).join(' | '));
console.log(`SONUÇ: ${pass} geçti, ${fail} hata`);
process.exit(fail ? 1 : 0);
