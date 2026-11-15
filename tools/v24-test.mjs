// v24.1 tarayıcı sınaması: gizli geçit görünüşü (arkadaş: YILDIZ binası, Play: eski rampa), girişten sürünce sahne ve
// hediye, gece görünümü, direksiyon/joystick yumuşaklığı, ödül olayları. Konsol hatası olmamalı.
// Önce iki sunucu: npm run serve (8080, play) ve FLAVOR=arkadas PORT=8082 node tools/serve.mjs
// node tools/v24-test.mjs [play portu] [arkadaş portu]
import fs from 'node:fs';
import { chromium } from 'playwright-core';

const PORTS = { play: Number(process.argv[2] || 8080), arkadas: Number(process.argv[3] || 8082) };
const OUT = 'e2e-out/v24';
fs.mkdirSync(OUT, { recursive: true });
const fails = [];
let passes = 0;
const ok = (c, name, extra = '') => { if (c) passes++; else { fails.push(`${name} ${extra}`); console.log('HATA', name, extra); } };
const b = await chromium.launch({ channel: 'msedge', headless: true });
const errs = [];

async function open(port, { w = 390, h = 844, url = '?god=1&t=0' } = {}) {
  const ctx = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'tr' });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(`pageerror ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto(`http://localhost:${port}/${url}`);
  await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden, null, { timeout: 30000 });
  await page.evaluate(() => { const k = __drift; k.storage.data.settings.lang = 'tr'; k.storage.save(); k.applySettings && k.applySettings(); });
  return { ctx, page };
}
const play = async (page) => {
  await page.evaluate(() => __drift.play());
  await page.waitForFunction(() => __drift.game.state === 'play' && !__drift.renderer.warmingNow, null, { timeout: 20000 });
  await page.waitForTimeout(400);
};
const hold = (page, x, y, a = -Math.PI / 2) => page.evaluate(([x, y, a]) => {
  const g = __drift.game;
  clearInterval(globalThis.__hold);
  globalThis.__hold = setInterval(() => { const p = g.player; p.x = x; p.y = y; p.vx = 0; p.vy = 0; p.speed = 0; p.a = a; g.cops.length = 0; }, 4);
}, [x, y, a]);
const release = (page) => page.evaluate(() => clearInterval(globalThis.__hold));
const shot = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` });

for (const flavor of ['arkadas', 'play']) {
  const { ctx, page } = await open(PORTS[flavor]);
  await play(page);
  const info = await page.evaluate(async () => {
    const m = await import('./js/secret-look.js');
    const z = __drift.game.world.zone('secret');
    return { look: !!m.SECRET_LOOK, z: { x: z.x, y: z.y, w: z.w, h: z.h } };
  });
  const { z } = info;
  ok(info.look === (flavor === 'arkadas'), `${flavor}: görünüş modülü`, String(info.look));
  // Yakın görünüm, gündüz: binanın önünde, güneyde dur
  await hold(page, z.x + z.w / 2, z.y + z.h + 150, -Math.PI / 2);
  await page.waitForTimeout(1500);
  await shot(page, `${flavor}-gecit-gunduz`);
  // Binanın bölgesinde katı engel var mı (yalnız arkadaş)
  const solid = await page.evaluate(([x, y]) => { const out = {}; return __drift.game.world.circleHit(x, y, 4, out) ? out.rect.secretLook === true : false; }, [z.x + z.w / 2, z.y - 60]);
  ok(solid === (flavor === 'arkadas'), `${flavor}: bina katı`, String(solid));
  // Gece görünümü
  await page.evaluate(() => { const D = __drift.cfg.day; __drift.game.dayT = (0.7 - D.start) * D.length; });
  await page.waitForTimeout(1200);
  const night = await page.evaluate(() => __drift.game.daylight.k);
  await shot(page, `${flavor}-gecit-gece`);
  console.log(flavor, 'gece oranı', night.toFixed(2));
  // Girişten (güneyden, kapıya doğru) sür: sahne, yazı ve hediye
  await release(page);
  await page.evaluate(([x, y]) => { const g = __drift.game; const p = g.player; p.x = x; p.y = y; p.a = -Math.PI / 2; p.vx = 0; p.vy = -240; p.speed = 240; p.forward = 240; g.cops.length = 0; }, [z.x + z.w / 2, z.y + z.h + 70]);
  await page.waitForFunction(() => __drift.game.state === 'secret', null, { timeout: 5000 }).catch(() => {});
  const entered = await page.evaluate(() => __drift.game.state === 'secret');
  ok(entered, `${flavor}: girişten girince sahne başladı`);
  await page.waitForTimeout(1500);
  const s = await page.evaluate(() => ({ text: document.querySelector('#secret-msg b').textContent, gift: document.querySelector('#secret-msg small').textContent, owned: __drift.storage.data.owned.includes('golge') }));
  await shot(page, `${flavor}-gecit-garaj`);
  console.log(flavor, 'yazı', JSON.stringify(s));
  ok(flavor === 'arkadas' ? s.text === "Artık Ömer Yıldız'ın da misafirisiniz" : s.text === 'Gizli bölümü buldun! Hoş geldin', `${flavor}: yazı`, s.text);
  ok(/Gölge R/.test(s.gift) && s.owned, `${flavor}: hediye motosiklet`);
  await page.waitForFunction(() => __drift.game.state === 'play', null, { timeout: 8000 });
  // Batıdan (rampanın batı yüzü açık) ikinci giriş de çalışır: yalnız arkadaşta bina kuzeyi kapatır
  await page.evaluate(([x, y]) => { const g = __drift.game; const p = g.player; p.x = x; p.y = y; p.a = 0; p.vx = 240; p.vy = 0; p.speed = 240; p.forward = 240; g.cops.length = 0; g.shieldT = 0; }, [z.x - 90, z.y + z.h / 2]);
  await page.waitForFunction(() => __drift.game.state === 'secret', null, { timeout: 5000 }).catch(() => {});
  ok(await page.evaluate(() => __drift.game.state === 'secret'), `${flavor}: batıdan giriş`);
  await page.waitForFunction(() => __drift.game.state === 'play', null, { timeout: 8000 }).catch(() => {});
  await ctx.close();
}

// Direksiyon ve joystick: gerçek dokunma olaylarıyla, oyun içinde aracın dönüş açısı (eski keskinliğe göre)
{
  const { ctx, page } = await open(PORTS.play);
  for (const mode of ['stick', 'wheel']) {
    await page.evaluate((m) => { const k = __drift; k.storage.data.settings.control = m; k.storage.save(); k.applySettings && k.applySettings(); }, mode);
    await play(page);
    const r = await page.evaluate(async (mode) => {
      const k = __drift; const g = k.game; const inp = k.input;
      g.cops.length = 0;
      const p = g.player; p.a = 0; p.vx = 320; p.vy = 0; p.speed = 320; p.w = 0;
      const a0 = p.a;
      // Tam kırılmış girdi 0.5 sn: araca giden değer ve dönülen açı
      if (mode === 'stick') { inp.down(77, 60, 600); inp.move(77, 60 + 80, 600); } else { const w = inp.wheel; inp.down(77, w.cx, w.cy - w.r * 0.8); for (let d = -90; d <= 45; d += 15) { const a = (d * Math.PI) / 180; inp.move(77, w.cx + Math.cos(a) * w.r * 0.8, w.cy + Math.sin(a) * w.r * 0.8); } }
      const steerAt = [];
      for (let i = 0; i < 4; i++) { await new Promise((r) => setTimeout(r, 120)); steerAt.push(+inp.steer.toFixed(3)); }
      const turned = p.a - a0;
      inp.up(77);
      return { steerAt, turned: +turned.toFixed(3), yawMul: p.yawMul, axis: +inp.axis.toFixed(3) };
    }, mode);
    console.log(mode, JSON.stringify(r));
    ok(r.yawMul < 1, `${mode}: dönüş çarpanı uygulandı`, String(r.yawMul));
    ok(r.steerAt[0] < r.steerAt[3], `${mode}: girdi yumuşak artar`, r.steerAt.join(','));
    await page.evaluate(() => __drift.toMenu && __drift.toMenu());
    await page.waitForTimeout(300);
  }
  await ctx.close();
}

await b.close();
ok(errs.length === 0, 'konsol hatası yok', errs.slice(0, 5).join(' | '));
console.log(`v24: ${passes} geçti, ${fails.length} hata`);
if (fails.length) { console.log(fails.join('\n')); process.exit(1); }
