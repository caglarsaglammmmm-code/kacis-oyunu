// 24.2.0 tarayıcı sınaması (iki sürüm): Kod gir alanına gerçek yazı ve tıklamayla Dante / Berserk / Guts, kullanılmış ve
// yanlış kod mesajları; Berserk sayacı oyunda görünür, oynarken azalır, duraklatınca ve menüde durur, kayıttan sürer;
// ayrı ses kaydırıcıları kaydedilip yeniden açılışta yüklenir ve ses grubuna uygulanır; garajın Silah sekmesinden satın
// alma, takma, çıkarma; takılı silah oyunda gerçekten ateş eder ve normal polisi tablodaki vuruşta indirir. Konsol hatası olmamalı.
// Önce iki sunucu: npm run serve (8080, play) ve FLAVOR=arkadas PORT=8082 node tools/serve.mjs
// node tools/v242-test.mjs [play portu] [arkadaş portu]
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const PORTS = { play: Number(process.argv[2] || 8080), arkadas: Number(process.argv[3] || 8082) };
const OUT = 'e2e-out/v242';
fs.mkdirSync(OUT, { recursive: true });
const fails = [];
let passes = 0;
const ok = (c, name, extra = '') => { if (c) passes++; else { fails.push(`${name} ${extra}`); console.log('HATA', name, extra); } };
const b = await chromium.launch({ channel: 'msedge', headless: true });
const errs = [];

async function open(ctx, port) {
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(`pageerror ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(`http://localhost:${port}/?god=1&t=0`);
  await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden, null, { timeout: 30000 });
  return page;
}
const setLang = (page, code) => page.evaluate((c) => { const k = __drift; k.storage.data.settings.lang = c; k.storage.save(); k.applySettings(); }, code);
const play = async (page) => {
  await page.evaluate(() => __drift.play());
  await page.waitForFunction(() => __drift.game.state === 'play' && !__drift.renderer.warmingNow, null, { timeout: 20000 });
  await page.waitForTimeout(300);
};
const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` });
const openSettings = async (page) => { await page.click('#btn-settings'); await page.waitForSelector('#settings:not([hidden])'); };
const back = async (page, id) => { await page.click(`#${id} .back`); await page.waitForSelector('#menu:not([hidden])'); };
const enterCode = async (page, text) => {
  await page.fill('#code-input', text);
  await page.click('#code-apply');
  return page.textContent('#code-msg');
};

for (const flavor of ['play', 'arkadas']) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'tr' });
  let page = await open(ctx, PORTS[flavor]);
  await page.evaluate(() => { localStorage.clear(); });
  await page.reload();
  await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden, null, { timeout: 30000 });
  await setLang(page, 'tr');

  // ---- KODLAR (gerçek yazma ve tıklama) ----
  await openSettings(page);
  const coins0 = await page.evaluate(() => __drift.storage.data.coins);
  let m = await enterCode(page, '  dAnTe ');
  ok(/3\.000/.test(m), `${flavor} Dante mesajı`, m);
  m = await enterCode(page, 'DANTE');
  ok(m.trim() === 'Bu kod zaten kullanıldı.', `${flavor} Dante ikinci`, m);
  m = await enterCode(page, 'guts');
  ok(/10\.000/.test(m), `${flavor} Guts`, m);
  m = await enterCode(page, 'yanlis');
  ok(m.trim() === 'Geçersiz kod.', `${flavor} yanlış kod`, m);
  const coins1 = await page.evaluate(() => __drift.storage.data.coins);
  ok(coins1 - coins0 === 13000, `${flavor} para +13000`, `${coins1 - coins0}`);
  m = await enterCode(page, 'Berserk');
  ok(/BERSERK/.test(m), `${flavor} Berserk mesajı`, m);
  m = await enterCode(page, ' berserk ');
  ok(m.trim() === 'Bu kod zaten kullanıldı.', `${flavor} Berserk ikinci`, m);
  // Dil değişince mesajlar da çevrilir
  await setLang(page, 'en');
  m = await enterCode(page, 'GUTS');
  ok(m.trim() === 'This code has already been used.', `${flavor} İngilizce kullanılmış`, m);
  m = await enterCode(page, 'nope');
  ok(m.trim() === 'Invalid code.', `${flavor} İngilizce geçersiz`, m);
  await setLang(page, 'tr');

  // ---- SES KAYDIRICILARI ----
  const sliders = await page.$$eval('#set-mix input[data-vol]', (els) => els.map((e) => e.dataset.vol));
  ok(sliders.join() === 'music,sfx,engine,police,traffic,gun', `${flavor} 6 kaydırıcı`, sliders.join());
  const labels = await page.$$eval('#set-mix .volume > span', (els) => els.map((e) => e.textContent));
  ok(labels.join('|') === 'Müzik|Ses efektleri|Araba / motor|Polis sesleri|Trafik|Silah sesleri', `${flavor} etiketler`, labels.join('|'));
  await page.$eval('#set-mix input[data-vol="police"]', (el) => { el.value = '20'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.$eval('#set-mix input[data-vol="gun"]', (el) => { el.value = '0'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.$eval('#set-volume', (el) => { el.value = '60'; el.dispatchEvent(new Event('input', { bubbles: true })); });
  const audioV = await page.evaluate(() => { const a = __drift.audio; a.unlock(); __drift.applySettings(); return { police: a.vols.police, gun: a.vols.gun, music: a.vols.music, vol: a.volume, bus: a.buses ? a.buses.police.gain.value : -1 }; });
  ok(audioV.police === 0.2 && audioV.gun === 0 && audioV.music === 1 && audioV.vol === 0.6, `${flavor} ses motoruna uygulandı`, JSON.stringify(audioV));
  await shot(page, `${flavor}-ayarlar-ses`);
  await page.locator('#code-row, .code-row').first().scrollIntoViewIfNeeded();
  await shot(page, `${flavor}-ayarlar-kod`);
  await back(page, 'settings');
  // Menüde Berserk etiketi
  const tag = await page.evaluate(() => ({ hidden: document.getElementById('menu-berserk').hidden, text: document.getElementById('menu-berserk').textContent }));
  ok(!tag.hidden && /60:00/.test(tag.text), `${flavor} menüde Berserk`, JSON.stringify(tag));
  await shot(page, `${flavor}-menu-berserk`);

  // Yeniden açılış: ses ve kodlar kayıttan
  await page.reload();
  await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden, null, { timeout: 30000 });
  const re = await page.evaluate(() => ({ vols: __drift.storage.data.settings.vols, a: __drift.audio.vols, used: __drift.storage.data.usedCodes, bz: __drift.storage.data.berserk, slider: document.querySelector('#set-mix input[data-vol="police"]').value }));
  ok(re.vols.police === 20 && re.vols.gun === 0 && re.a.police === 0.2 && re.slider === '20', `${flavor} ses kayıttan yüklendi`, JSON.stringify(re));
  ok(re.used.join() === 'DANTE,GUTS,BERSERK' && re.bz === 3600, `${flavor} kodlar kalıcı`, JSON.stringify(re));

  // ---- BERSERK SAYACI ----
  await play(page);
  const hud0 = await page.evaluate(() => ({ hidden: document.getElementById('hud-berserk').hidden, t: document.getElementById('hud-berserk-t').textContent, mul: __drift.game.coinMul() }));
  ok(!hud0.hidden && hud0.mul === 2, `${flavor} HUD Berserk görünür, 2 kat`, JSON.stringify(hud0));
  await page.waitForTimeout(3200);
  const t1 = await page.evaluate(() => __drift.game.berserkT);
  ok(t1 < 3598 && t1 > 3590, `${flavor} oynarken azaldı`, `${t1}`);
  await shot(page, `${flavor}-hud-berserk`);
  await page.evaluate(() => __drift.pause());
  const tp = await page.evaluate(() => __drift.storage.data.berserk);
  ok(Math.abs(tp - t1) < 0.6, `${flavor} duraklatınca kaydedildi`, `${tp} ${t1}`);
  await page.waitForTimeout(2500);
  const tp2 = await page.evaluate(() => __drift.game.berserkT);
  ok(Math.abs(tp2 - tp) < 1e-6 || tp2 <= tp, `${flavor} duraklatmada durdu`, `${tp} -> ${tp2}`);
  ok(Math.abs(tp2 - tp) < 0.05, `${flavor} duraklatmada akmadı`, `${tp} -> ${tp2}`);
  await page.evaluate(() => __drift.toMenu());
  await page.waitForTimeout(2500);
  const tm = await page.evaluate(() => __drift.storage.data.berserk);
  ok(Math.abs(tm - tp2) < 0.05, `${flavor} menüde durdu`, `${tp2} -> ${tm}`);
  // Uygulama kapanıp açılınca kaldığı yerden
  await page.close();
  page = await open(ctx, PORTS[flavor]);
  const tr = await page.evaluate(() => __drift.storage.data.berserk);
  ok(Math.abs(tr - tm) < 0.05, `${flavor} kapat-aç sonrası kaldığı yer`, `${tm} -> ${tr}`);
  // Süre biterken: bar kaybolur, çarpan kalkar
  await page.evaluate(() => { __drift.storage.setBerserk(1.2); });
  await play(page);
  await page.waitForTimeout(2600);
  const end = await page.evaluate(() => ({ t: __drift.game.berserkT, mul: __drift.game.coinMul(), hidden: document.getElementById('hud-berserk').hidden }));
  ok(end.t === 0 && end.mul === 1 && end.hidden, `${flavor} süre bitti, bar kayboldu`, JSON.stringify(end));
  await page.evaluate(() => __drift.toMenu());
  await page.waitForTimeout(300);
  const after = await page.evaluate(() => ({ s: __drift.storage.data.berserk, hidden: document.getElementById('menu-berserk').hidden }));
  ok(after.s === 0 && after.hidden, `${flavor} menü etiketi kalktı`, JSON.stringify(after));

  // ---- SİLAH MAĞAZASI (garaj, Silah sekmesi, gerçek tıklama) ----
  await page.evaluate(() => { __drift.storage.data.coins = 60000; __drift.storage.save(); __drift.ui.refreshMenu(); });
  await page.click('#btn-garage');
  await page.waitForSelector('#garage:not([hidden])');
  await page.click('.custom-tabs button[data-tab="gun"]');
  const chips = await page.$$eval('#custom-grid .chip.gun', (els) => els.map((e) => ({ locked: e.classList.contains('locked'), price: e.querySelector('em') && e.querySelector('em').textContent })));
  ok(chips.length === 6 && chips.every((c) => c.locked), `${flavor} 6 kilitli silah`, JSON.stringify(chips));
  ok(chips.map((c) => c.price).join() === '2.500,6.000,12.000,25.000,45.000,90.000', `${flavor} fiyat etiketleri`, chips.map((c) => c.price).join());
  await shot(page, `${flavor}-garaj-silah`);
  // Silah 2'yi seç, iki adımda satın al (Satın al -> Onayla)
  await page.click('#custom-grid .chip.gun.t2');
  let btn = await page.textContent('#custom-buy');
  ok(/Satın al/.test(btn), `${flavor} satın al düğmesi`, btn);
  const info = await page.textContent('#custom-name');
  ok(/Silah 2/.test(info) && /0,75/.test(info) && /10 vuruş/.test(info), `${flavor} silah bilgisi`, info);
  await page.click('#custom-buy');
  btn = await page.textContent('#custom-buy');
  ok(/Onayla/.test(btn), `${flavor} onay`, btn);
  await page.click('#custom-buy');
  const bought = await page.evaluate(() => ({ guns: __drift.storage.data.guns, gun: __drift.storage.data.gun, coins: __drift.storage.data.coins, msg: document.getElementById('custom-msg').textContent, btn: document.getElementById('custom-buy').textContent }));
  ok(bought.guns.join() === 'g2' && bought.gun === 'g2' && bought.coins === 54000, `${flavor} satın alındı ve takıldı`, JSON.stringify(bought));
  ok(bought.btn === 'Çıkar', `${flavor} çıkar düğmesi`, bought.btn);
  await shot(page, `${flavor}-garaj-silah-alindi`);
  // Para yetmeyen silah
  await page.click('#custom-grid .chip.gun.t6');
  const poor = await page.evaluate(() => ({ dis: document.getElementById('custom-buy').disabled, t: document.getElementById('custom-buy').textContent }));
  ok(poor.dis && poor.t === 'Yetersiz para', `${flavor} yetersiz para`, JSON.stringify(poor));
  // Çıkar, sonra tak
  await page.click('#custom-grid .chip.gun.t2');
  await page.click('#custom-buy');
  ok((await page.evaluate(() => __drift.storage.data.gun)) === '', `${flavor} çıkarıldı`);
  ok((await page.textContent('#custom-buy')) === 'Tak', `${flavor} tak düğmesi`);
  await page.click('#custom-buy');
  ok((await page.evaluate(() => __drift.storage.data.gun)) === 'g2', `${flavor} yeniden takıldı`);
  await back(page, 'garage');

  // Takılı silah oyunda: silahsız başlangıç arabasında ateş eder, normal polisi 10 vuruşta indirir
  await page.evaluate(() => { __drift.storage.select('atmaca'); });
  await play(page);
  const fire = await page.evaluate(async () => {
    const g = __drift.game;
    const out = { weapon: !!g.weapon, id: g.gun.stats.id };
    const hold = setInterval(() => { const p = g.player; p.vx = 0; p.vy = 0; p.speed = 0; }, 4);
    g.cops.length = 0;
    const c = g.spawnCop('car', 'chaser', g.player.x, g.player.y - 200, 0);
    // Yalnız bu hedefe giden isabetler sayılır (ekrana giren başka polisler de vurulabilir)
    let onTarget = 0;
    const hit0 = g.gunHit;
    const s0 = g.gun.shots;
    // Ölen polis havuza döner ve yeni polis olarak yeniden doğabilir: ilk ölümde sayım biter
    g.gunHit = function (k, x, y) {
      if (k !== c || out.done) return hit0.call(this, k, x, y);
      onTarget++;
      const r = hit0.call(this, k, x, y);
      if (k.mhp <= 0) out.done = true;
      return r;
    };
    const keep = setInterval(() => { if (out.done) return; c.vx = 0; c.vy = 0; c.x = g.player.x; c.y = g.player.y - 200; out.vis = g.gun.visible(g, c); }, 4);
    const t0 = performance.now();
    while (!out.done && performance.now() - t0 < 15000) await new Promise((r) => setTimeout(r, 50));
    clearInterval(keep); clearInterval(hold);
    g.gunHit = hit0;
    out.hits = onTarget;
    out.shots = g.gun.shots - s0;
    out.dead = !!out.done;
    out.sec = (performance.now() - t0) / 1000;
    return out;
  });
  ok(fire.weapon && fire.id === 'g2' && fire.dead && fire.hits === 10, `${flavor} oyunda Silah 2: normal polis 10 vuruş`, JSON.stringify(fire));
  await shot(page, `${flavor}-oyunda-silah`);
  await page.evaluate(() => __drift.toMenu());
  // Diğer dillerde Silah sekmesi ve ses başlıkları
  for (const [l, gun, mix] of [['en', 'Gun', 'Sound mix'], ['ja', '武器', 'サウンド設定'], ['zh', '武器', '声音设置'], ['es', 'Arma', 'Ajustes de sonido'], ['de', 'Waffe', 'Sound-Einstellungen']]) {
    await setLang(page, l);
    const t = await page.evaluate(() => ({ gun: document.querySelector('.custom-tabs button[data-tab="gun"]').textContent, mix: document.querySelector('#set-mix h3').textContent }));
    ok(t.gun === gun && t.mix === mix, `${flavor} ${l} çeviri`, JSON.stringify(t));
  }
  await setLang(page, 'tr');
  await ctx.close();
}

await b.close();
ok(errs.length === 0, 'konsol hatası yok', errs.slice(0, 5).join(' | '));
console.log(`\n${passes} geçti, ${fails.length} hata`);
if (fails.length) { console.log(fails.join('\n')); process.exit(1); }
