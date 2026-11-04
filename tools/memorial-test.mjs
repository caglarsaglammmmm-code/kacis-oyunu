// v20 Cumhuriyet Meydanı anıtı tarayıcı testi: düzen, gündüz/gece, okuma kartı (tam metin), sınırı geçince
// patlama + oyun sonu + 30 para cezası (0'ın altına inmez), hile açıkken giremez, polis/trafik/yaya girmez,
// mermi alana zarar vermez, 6 dilde uyarılar, konsol hatası yok. Ekran görüntüleri: e2e-out/v20/<sürüm>/
// node tools/memorial-test.mjs <port> [play|arkadas]
import { chromium } from 'playwright-core';
import fs from 'node:fs';

const port = Number(process.argv[2] || 8080);
const flavor = process.argv[3] || 'play';
const OUT = `e2e-out/v20/${flavor}`;
fs.mkdirSync(OUT, { recursive: true });
const REF = fs.readFileSync('tests/fixtures/hitabe.txt', 'utf8').replace(/\r\n/g, '\n');
const LANGS = ['tr', 'en', 'ja', 'zh', 'es', 'de'];
const I18N = {};
for (const l of LANGS) I18N[l] = (await import(`../js/i18n/${l}.js`)).default.memorial;

let pass = 0; let fail = 0;
const ok = (c, name, info = '') => { if (c) pass++; else { fail++; console.log('HATA:', name, info); } };
const errs = [];
const b = await chromium.launch({ channel: 'msedge', headless: true });

async function open({ lang = 'tr', god = false, coins = 0, car = 'atmaca', t = 0, w = 390, h = 844 } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: lang === 'zh' ? 'zh-CN' : lang });
  await ctx.addInitScript(([lang, coins, car]) => {
    if (sessionStorage.getItem('seeded')) return;
    sessionStorage.setItem('seeded', '1');
    localStorage.setItem('drift-lab-v1', JSON.stringify({ coins, owned: ['atmaca', car], selected: car, tutorial: true, settings: { lang, weather: 'sunny' } }));
  }, [lang, coins, car]);
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(`${lang}: ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(`${lang}: ${m.text()}`); });
  await page.goto(`http://localhost:${port}/?t=${t}${god ? '&god=1' : ''}`);
  await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden, null, { timeout: 30000 });
  await page.evaluate(() => __drift.play());
  await page.waitForFunction(() => __drift.game.state === 'play', null, { timeout: 15000 });
  return { ctx, page };
}
// Oyuncuyu anıta göre bir yere sabitler (polisler temizlenir). dy: korunan bölümün güney kenarından uzaklık
const holdAt = (page, dy, area = 0) => page.evaluate(([dy, area]) => {
  const k = __drift; const g = k.game; const bx = g.world.memorialBox();
  if (area) k.cfg.camera.viewArea = area;
  clearInterval(globalThis.__hold);
  globalThis.__hold = setInterval(() => { const p = g.player; p.x = bx.x + bx.w / 2; p.y = bx.y + bx.h + dy; p.vx = 0; p.vy = 0; p.a = -Math.PI / 2; g.cops.length = 0; }, 4);
}, [dy, area]);
const release = (page) => page.evaluate(() => clearInterval(globalThis.__hold));
const cardOpen = (page) => page.evaluate(() => !document.getElementById('memorial-card').hidden);

// --- 1) Düzen, gündüz ve gece ---
{
  const { ctx, page } = await open({ god: true });
  await holdAt(page, 50, 1500);
  await page.waitForFunction(() => __drift.renderer.memorial.hi, null, { timeout: 20000 });
  await page.evaluate(() => __drift.game.dismissMemorialCard());
  await page.waitForTimeout(900);
  const L = await page.evaluate(() => __drift.renderer.memorial.layoutAt(__drift.game.world.memorialBox()));
  const [c, l, r, d] = L.frames;
  ok(L.images.every((s) => s === 'ok'), 'dört fotoğraf yüklendi', L.images);
  const area = (f) => f.w * f.h;
  ok(area(c) > area(l) && area(c) > area(r) && area(c) > area(d), 'ortada en büyük: ataturk-1');
  ok(l.x + l.w <= c.x && Math.abs((l.y + l.h / 2) - (c.y + c.h / 2)) < c.h / 2, 'solda ataturk-2');
  ok(r.x >= c.x + c.w && Math.abs((r.y + r.h / 2) - (c.y + c.h / 2)) < c.h / 2, 'sağda ataturk-3');
  ok(d.y >= c.y + c.h && Math.abs((d.x + d.w / 2) - (c.x + c.w / 2)) < 2, 'altta ataturk-4');
  ok(L.plaque.y + L.plaque.h <= c.y && L.plaque.w > c.w * 1.8, 'üstte uzun levha');
  ok(L.flag.y + L.flag.h <= c.y && L.flag.y >= L.plaque.y + L.plaque.h, 'portrenin üstünde bayrak');
  ok(L.title === 'Gençliğe Hitabe' && L.year === '1927', 'levha başlığı ve 1927', `${L.title} ${L.year}`);
  ok(L.motto.text === 'Ne mutlu Türküm diyene!' && L.signature.text === 'Gazi Mustafa Kemal Atatürk' && L.motto.y > d.y + d.h, 'alt satırlar');
  // Ekranda fotoğraf çizildi mi: çerçeve içinde renk çeşitliliği (yer tutucu düz renktir)
  const variety = await page.evaluate((frames) => {
    const R = __drift.renderer; const cv = document.getElementById('game'); const g = cv.getContext('2d');
    return frames.map((f) => {
      const sx = (f.x + f.w * 0.3) * R.s + R.ox; const sy = (f.y + f.h * 0.3) * R.s + R.oy;
      const w = Math.max(4, f.w * 0.4 * R.s); const h = Math.max(4, f.h * 0.4 * R.s);
      const px = g.getImageData(sx, sy, w, h).data; let n = 0; let s = 0; let s2 = 0;
      for (let i = 0; i < px.length; i += 4) { const l = (px[i] + px[i + 1] + px[i + 2]) / 3; n++; s += l; s2 += l * l; }
      return Math.round(Math.sqrt(s2 / n - (s / n) ** 2)); // Parlaklık sapması: düz yer tutucuda ~0
    });
  }, L.frames);
  ok(variety.every((v) => v > 12), 'dört çerçevede fotoğraf görünüyor (parlaklık sapması)', variety);
  ok(await page.evaluate(() => document.fonts.check("700 20px 'Playfair Display'", 'Gençliğe âîû')), 'Türkçe karakterli serif yazı tipi yüklü');
  await page.screenshot({ path: `${OUT}/1-gunduz-genel.png` });
  await holdAt(page, 60, 740);
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${OUT}/2-gunduz-yakin.png` });
  await holdAt(page, 50, 1500);
  await page.evaluate(() => { __drift.game.dayT = 110; });
  await page.waitForTimeout(1200);
  const night = await page.evaluate((f) => {
    const g = __drift.game; const R = __drift.renderer; const cv = document.getElementById('game').getContext('2d');
    const lum = (x, y) => { const p = cv.getImageData(x * R.s + R.ox, y * R.s + R.oy, 6, 6).data; let s = 0; for (let i = 0; i < p.length; i += 4) s += p[i] + p[i + 1] + p[i + 2]; return s / (p.length / 4) / 3; };
    const bx = g.world.memorialBox();
    return { k: g.daylight.k, plaque: lum(bx.x + bx.w / 2, bx.y + 70), ground: lum(bx.x + bx.w / 2, bx.y + bx.h + 380) };
  }, c);
  ok(night.k > 0.9, 'gece', night.k);
  ok(night.plaque > night.ground * 1.6, 'gece anıt aydınlık (spot)', JSON.stringify(night));
  await page.screenshot({ path: `${OUT}/3-gece.png` });
  await ctx.close();
}

// --- 2) Okuma kartı ---
{
  const { ctx, page } = await open({ god: true });
  const MC = await page.evaluate(() => __drift.cfg.memorial);
  await holdAt(page, 1600);
  await page.waitForTimeout(400);
  ok(!(await cardOpen(page)), 'uzakta kart kapalı');
  await holdAt(page, MC.readDist - 60);
  await page.waitForTimeout(400);
  ok(await cardOpen(page), 'yaklaşınca kart açıldı (sınırdan önce)');
  const card = await page.evaluate(() => {
    const el = document.getElementById('memorial-card'); const r = el.getBoundingClientRect();
    const p = el.querySelector('.mc-text p'); const cs = getComputedStyle(p);
    return { text: __drift.memorialCard.text(), dom: [...el.querySelectorAll('.mc-text p:not(.mc-sign)')].map((x) => x.textContent).join('\n'), title: el.querySelector('h3').textContent, year: el.querySelector('header span').textContent, sign: el.querySelector('.mc-sign').textContent, font: parseFloat(cs.fontSize), family: cs.fontFamily, top: r.top, bottom: r.bottom, left: r.left, right: r.right, vh: innerHeight, vw: innerWidth, lang: el.lang };
  });
  ok(card.text === REF && card.dom === REF, 'kartta Gençliğe Hitabe tam ve aynen', `${card.text.length}/${REF.length}`);
  let diff = -1; for (let i = 0; i < REF.length; i++) if (card.dom[i] !== REF[i]) { diff = i; break; }
  ok(diff === -1, 'karakter karakter karşılaştırma', diff);
  ok(card.title === 'Gençliğe Hitabe' && card.year === '1927' && card.sign === 'Gazi Mustafa Kemal Atatürk', 'kart başlığı, yıl, imza');
  ok(card.font >= 16 && /Playfair/.test(card.family), 'telefonda okunur büyüklük ve ciddi yazı tipi', `${card.font} ${card.family}`);
  ok(card.top >= 0 && card.bottom < card.vh * 0.5 && card.left >= 0 && card.right <= card.vw, 'kart üstte, ekranın yarısını geçmiyor', JSON.stringify(card));
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${OUT}/4-kart-bas.png` });
  const s0 = await page.evaluate(() => document.querySelector('#memorial-card .mc-body').scrollTop);
  await page.waitForTimeout(MC.scroll.delay * 1000 + 2500);
  const s1 = await page.evaluate(() => document.querySelector('#memorial-card .mc-body').scrollTop);
  ok(s1 > s0 + 10, 'metin kendiliğinden yavaşça kayıyor', `${s0} -> ${s1}`);
  // Sonuna kadar kaydırılınca son cümle görünür
  const end = await page.evaluate(() => {
    const k = __drift.memorialCard; for (let i = 0; i < 400; i++) k.tick(0.5);
    const body = document.querySelector('#memorial-card .mc-body'); const ps = body.querySelectorAll('.mc-text p:not(.mc-sign)');
    const last = ps[ps.length - 1].getBoundingClientRect(); const br = body.getBoundingClientRect();
    return { atEnd: Math.abs(body.scrollTop - (body.scrollHeight - body.clientHeight)) <= 1, lastVisible: last.bottom <= br.bottom + 1 && last.bottom > br.top };
  });
  ok(end.atEnd && end.lastVisible, 'kayma sonunda metnin sonu okunuyor', JSON.stringify(end));
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${OUT}/5-kart-son.png` });
  ok(await page.evaluate(() => __drift.game.state === 'play'), 'kart oyunu durdurmuyor');
  await holdAt(page, MC.readClose + 120);
  await page.waitForTimeout(400);
  ok(!(await cardOpen(page)), 'uzaklaşınca kart kapandı');
  await holdAt(page, 300);
  await page.waitForTimeout(400);
  ok(await cardOpen(page), 'yeniden yaklaşınca açıldı');
  const box = await page.locator('#memorial-card').boundingBox();
  await page.touchscreen.tap(box.x + box.width / 2, box.y + box.height / 2);
  await page.waitForTimeout(300);
  ok(!(await cardOpen(page)), 'dokununca kapandı');
  ok(await page.evaluate(() => __drift.game.state === 'play'), 'dokunma oyunu bozmadı');
  await page.waitForTimeout(800);
  ok(!(await cardOpen(page)), 'dokunulunca aynı yaklaşımda kapalı kalır');
  // Duraklatınca kart gizlenir
  await holdAt(page, MC.readClose + 200); await page.waitForTimeout(300);
  await holdAt(page, 300); await page.waitForTimeout(300);
  await page.evaluate(() => __drift.pause()); await page.waitForTimeout(200);
  ok(!(await cardOpen(page)), 'duraklatınca kart gizli');
  await page.evaluate(() => __drift.resume()); await page.waitForTimeout(400);
  ok(await cardOpen(page), 'devam edince kart yeniden açıldı');
  await release(page);
  await ctx.close();
}

// --- 3) Sınırı geçince patlama, oyun sonu, ceza; 6 dilde uyarılar ---
const driveIn = (page) => page.evaluate(() => {
  const g = __drift.game; const bx = g.world.memorialBox(); const p = g.player;
  clearInterval(globalThis.__hold);
  globalThis.__toasts = []; const ui = __drift.ui; const orig = ui.toast.bind(ui); ui.toast = (s, c) => { globalThis.__toasts.push(s); orig(s, c); };
  p.x = bx.x + bx.w / 2; p.y = bx.y + bx.h + 420; p.a = -Math.PI / 2; p.vx = 0; p.vy = -300;
  globalThis.__hold = setInterval(() => { g.cops.length = 0; if (g.state === 'play') { p.x = bx.x + bx.w / 2; p.a = -Math.PI / 2; p.vy = Math.min(p.vy, -260); } }, 4);
});
for (const lang of LANGS) {
  const coins = lang === 'tr' ? 50 : lang === 'en' ? 12 : 100;
  const { ctx, page } = await open({ lang, coins });
  const T = I18N[lang];
  await driveIn(page);
  await page.waitForFunction((z) => globalThis.__toasts.includes(z), T.zone, { timeout: 8000 }).catch(() => {});
  const toast = await page.evaluate(() => globalThis.__toasts.join(','));
  ok(toast.split(',').includes(T.zone), `${lang}: yaklaşırken "${T.zone}" uyarısı`, toast);
  await page.waitForFunction(() => __drift.game.state !== 'play', null, { timeout: 8000 });
  const st = await page.evaluate(() => {
    const g = __drift.game; const bx = g.world.memorialBox(); const p = g.player; const m = document.getElementById('memorial-msg');
    const r = { left: m.offsetLeft, right: m.offsetLeft + m.offsetWidth }; const cs = getComputedStyle(m.firstElementChild);
    return { state: g.state, cause: g.cause, inside: p.x > bx.x && p.x < bx.x + bx.w && p.y > bx.y && p.y < bx.y + bx.h, fire: g.fx.particles ? g.fx.particles.filter((q) => q.alive).length : -1, msg: m.firstElementChild.textContent, sub: m.lastElementChild.textContent, run: m.classList.contains('run'), color: cs.color, l: r.left, rr: r.right, vw: innerWidth };
  });
  ok(st.state === 'dying' && st.cause === 'memorial', `${lang}: araba patladı (oyun bitiyor)`, JSON.stringify(st));
  ok(!st.inside, `${lang}: araba alana girmedi`);
  ok(st.run && st.msg === T.penalty.replace('{n}', '30') && st.sub === T.disrespect, `${lang}: kırmızı "${T.penalty}" ve "${T.disrespect}"`, `${st.msg} | ${st.sub}`);
  ok(/rgb\(255, (43|74), (43|74)\)/.test(st.color), `${lang}: yazı kırmızı`, st.color);
  ok(st.l >= 0 && st.rr <= st.vw, `${lang}: ceza yazısı ekrana sığıyor`, `${st.l}-${st.rr}`);
  if (lang === 'tr') { await page.waitForTimeout(250); await page.screenshot({ path: `${OUT}/6-patlama-ceza.png` }); }
  await page.waitForFunction(() => !document.getElementById('over').hidden, null, { timeout: 8000 });
  const over = await page.evaluate(() => {
    const t = document.getElementById('over-title'); const d = JSON.parse(localStorage.getItem('drift-lab-v1'));
    return { msgGone: !document.getElementById('memorial-msg').classList.contains('run'), title: t.textContent, fits: t.scrollWidth <= t.clientWidth + 1, coins: document.getElementById('over-coins').textContent, mem: __drift.storage.data.coins, saved: d.coins, result: __drift.game.result };
  });
  const cut = Math.min(coins, 30);
  ok(over.msgGone, lang + ': oyun bitti ekranında ceza yazısı kalktı');
  ok(over.title === T.over && over.fits, `${lang}: oyun bitti nedeni "${T.over}"`, JSON.stringify(over.title));
  ok(over.coins === `-${cut}`, `${lang}: sonuçta -${cut}`, over.coins);
  ok(over.mem === coins - cut && over.saved === coins - cut, `${lang}: para ${coins} -> ${coins - cut}, kalıcı kayıt`, `${over.mem}/${over.saved}`);
  ok(over.result.coins === 0 && over.result.penalty === 30, `${lang}: koşu kazancı yok, ceza 30`);
  if (lang === 'tr' || lang === 'de') await page.screenshot({ path: `${OUT}/7-oyun-bitti-${lang}.png` });
  // Hitabe kartı her dilde Türkçe kalır
  const cardText = await page.evaluate(() => __drift.memorialCard.text());
  ok(cardText === REF, `${lang}: Hitabe çevrilmedi`);
  await release(page);
  await ctx.close();
}

// --- 4) Hile açıkken araba giremez, ceza ve patlama yok ---
{
  const { ctx, page } = await open({ coins: 80 });
  await page.evaluate(() => __drift.game.toggleCheat());
  ok(await page.evaluate(() => __drift.game.cheat), 'hile açık');
  const res = await page.evaluate(async () => {
    const g = __drift.game; const bx = g.world.memorialBox(); const p = g.player;
    let inside = 0;
    const runs = [[bx.x + bx.w / 2, bx.y + bx.h + 140, -Math.PI / 2], [bx.x - 140, bx.y + bx.h / 2, 0], [bx.x + bx.w + 140, bx.y + 200, Math.PI], [bx.x + bx.w / 2, bx.y - 140, Math.PI / 2]];
    for (const [x, y, a] of runs) {
      p.x = x; p.y = y; p.a = a;
      const t0 = performance.now();
      while (performance.now() - t0 < 1500) {
        g.cops.length = 0; p.a = a; p.vx = Math.cos(a) * 320; p.vy = Math.sin(a) * 320;
        await new Promise(requestAnimationFrame);
        if (p.x > bx.x && p.x < bx.x + bx.w && p.y > bx.y && p.y < bx.y + bx.h) inside++;
      }
    }
    return { inside, state: g.state, penalty: g.penalty, msg: document.getElementById('memorial-msg').classList.contains('run') };
  });
  ok(res.inside === 0, 'hilede araba alana giremedi (4 yönden)', res.inside);
  ok(res.state === 'play' && res.penalty === 0 && !res.msg, 'hilede ceza ve patlama yok', JSON.stringify(res));
  await page.screenshot({ path: `${OUT}/8-hile-sinir.png` });
  ok(await page.evaluate(() => __drift.storage.data.coins) === 80, 'hilede para değişmedi');
  await ctx.close();
}

// --- 5) Polis, trafik, yaya ve uçan araçlar girmez; mermi alana zarar vermez ---
{
  const { ctx, page } = await open({ god: true, t: 300, car: 'kuzgun' });
  const res = await page.evaluate(async () => {
    const g = __drift.game; const bx = g.world.memorialBox(); const p = g.player;
    const ins = (x, y) => x > bx.x && x < bx.x + bx.w && y > bx.y && y < bx.y + bx.h;
    let inside = 0; let near = 0; let maxCops = 0; let flying = 0; let shots = 0;
    for (let i = 0; i < 4; i++) { const c = g.spawnCop(i === 3 ? 'ufo' : 'car', 'chaser', bx.x + 100 + i * 150, bx.y + bx.h + 260, -Math.PI / 2); c.state = 'chase'; }
    const t0 = performance.now();
    while (performance.now() - t0 < 12000) {
      p.x = bx.x + bx.w / 2; p.y = bx.y - 150; p.vx = 0; p.vy = 0;
      if (g.fire) shots += g.fire() ? 1 : 0;
      await new Promise(requestAnimationFrame);
      maxCops = Math.max(maxCops, g.cops.length);
      for (const c of g.cops) { if (ins(c.x, c.y)) { inside++; if (c.flying) flying++; } if (Math.hypot(c.x - p.x, c.y - p.y) < 260) near++; }
      for (const n of g.crowd.npcs) if (n.alive && ins(n.x, n.y)) inside++;
      for (const q of g.crowd.peds) if (q.alive && ins(q.x, q.y)) inside++;
      for (const m of g.missiles) if (m.alive && ins(m.x, m.y)) inside++;
    }
    // Mermiyi doğrudan anıta yolla: sınırda söner
    const m = g.missiles[0];
    Object.assign(m, { alive: true, x: bx.x + bx.w / 2, y: bx.y + bx.h + 60, vx: 0, vy: -760, t: 0, target: null });
    for (let i = 0; i < 30 && m.alive; i++) g.stepMissile(m, 1 / 60);
    const c = g.world.chunk(bx.cx, bx.cy); const rect = c.rects.slice(0, c.rectCount).find((r) => r.memorial);
    return { inside, flying, near, maxCops, missileGone: !m.alive && m.y > bx.y + bx.h - 30, rectAlive: rect.alive && rect.sacred, shots };
  });
  ok(res.inside === 0, 'polis, trafik, yaya, UFO ve mermi alana girmedi', JSON.stringify(res));
  ok(res.maxCops >= 3 && res.near > 0, 'polisler kovaladı ve alanın çevresinden dolaşıp oyuncuya ulaştı', JSON.stringify(res));
  ok(res.missileGone, 'anıta giden mermi sınırda söndü');
  ok(res.rectAlive, 'anıt sağlam (yıkılmaz)');
  await page.screenshot({ path: `${OUT}/9-polis-cevre.png` });
  await ctx.close();
}

// --- 6) 6 dil x ekran: uyarı ve ceza yazıları taşmıyor; yatay ekranda kart ---
for (const [w, h] of [[360, 740], [844, 390]]) {
  for (const lang of LANGS) {
    const { ctx, page } = await open({ lang, god: true, w, h });
    const T = I18N[lang];
    const fit = await page.evaluate((T) => {
      __drift.ui.toast(T.zone, '#ffd34d'); __drift.ui.memorialFail(30);
      const e = document.getElementById('memorial-msg'); const m = { left: e.offsetLeft, right: e.offsetLeft + e.offsetWidth }; const t = document.getElementById('toast');
      return { m: m.left >= 0 && m.right <= innerWidth, t: t.scrollWidth <= innerWidth };
    }, T);
    ok(fit.m && fit.t, `${lang} ${w}x${h}: yazılar sığıyor`, JSON.stringify(fit));
    if (w > h && lang === 'tr') {
      await holdAt(page, 300); await page.waitForTimeout(600);
      const r = await page.evaluate(() => { const e = document.getElementById('memorial-card'); const b = e.getBoundingClientRect(); return { open: !e.hidden, b: b.bottom, h: innerHeight, l: b.left, r: b.right, w: innerWidth }; });
      ok(r.open && r.b < r.h * 0.75 && r.l >= 0 && r.r <= r.w, 'yatay ekranda kart sığıyor', JSON.stringify(r));
      await page.screenshot({ path: `${OUT}/10-yatay-kart.png` });
      await release(page);
    }
    await ctx.close();
  }
}

ok(errs.length === 0, 'konsolda hata yok', errs.slice(0, 5).join(' | '));
console.log(`SONUÇ ${flavor}: ${pass} geçti, ${fail} hata`);
await b.close();
process.exit(fail ? 1 : 0);
