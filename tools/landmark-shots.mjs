// Özel yerlerin gündüz ve gece görüntüsü ve isim doğrulaması.
// node tools/landmark-shots.mjs [port] [sürüm: play|arkadas]  (sunucu: FLAVOR=arkadas PORT=8082 node tools/serve.mjs)
import fs from 'node:fs';
import { chromium } from 'playwright-core';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const port = Number(process.argv[2] || 8080);
const flavor = process.argv[3] || 'play';
const OUT = `e2e-out/v14/yerler-${flavor}`;
fs.mkdirSync(OUT, { recursive: true });
const { TABLO } = await import(pathToFileURL(path.resolve('names/tablo.mjs')).href);
const col = flavor === 'arkadas' ? 'gercek' : 'uydurma';
const WANT = {
  kolej: TABLO.kolej.ad[col],
  mevlana: TABLO.konya.mevlana[col], alaaddin: TABLO.konya.alaaddin[col], zafer: TABLO.konya.zafer[col],
  bedesten: TABLO.konya.bedesten[col], kongre: TABLO.konya.kongre[col], kule: TABLO.kule[col],
  kulturpark: TABLO.konya.kulturpark[col], meram: TABLO.konya.meram[col],
  serife: TABLO.okullar.serife[col], ted: TABLO.okullar.ted[col], gundogdu: TABLO.okullar.gundogdu[col],
};
const fails = [];
let passes = 0;
const ok = (c, n, e = '') => { if (c) passes++; else { fails.push(`${n} ${e}`); console.log('HATA', n, e); } };
const b = await chromium.launch({ channel: 'msedge', headless: true, args: ['--enable-gpu-rasterization', '--ignore-gpu-blocklist'] });
const ctx = await b.newContext({ viewport: { width: 900, height: 900 }, deviceScaleFactor: 1, locale: 'tr-TR' });
const page = await ctx.newPage();
const errs = [];
page.on('pageerror', (e) => errs.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errs.push(m.text()); });
await page.goto(`http://localhost:${port}/?god=1`);
await page.waitForFunction(() => !document.getElementById('menu').hidden);
await page.evaluate(() => __drift.play());
await page.waitForFunction(() => __drift.game.state === 'play');
await page.waitForTimeout(800);

for (const id of Object.keys(WANT)) {
  for (const night of [false, true]) {
    const info = await page.evaluate(async ({ id, night }) => {
      const k = __drift; const g = k.game; const w = g.world;
      const m = id === 'kolej' ? w.sistemChunk() : w.landmarkList().find((o) => o.id === id);
      if (!m) return { missing: true };
      const C = 40 * 32;
      const cx = m.cx * C + C / 2 + 60; const cy = m.cy * C + C / 2 + (id === 'kolej' ? 330 : id === 'kule' ? 120 : 0);
      // Oyun duraklatılır, kare elle çizilir: kamera arabaya geri bağlanmaz
      if (g.state === 'play') k.pause();
      for (const el of ['pause', 'over', 'hud', 'hint']) { const e = document.getElementById(el); if (e) e.hidden = true; }
      const p = g.player; p.x = cx; p.y = cy + 400; p.vx = 0; p.vy = 0; p.speed = 0;
      g.cops.length = 0;
      w.update(cx, cy);
      g.cam.x = cx; g.cam.y = cy; g.cam.zoom = 0.55; g.cam.sx = 0; g.cam.sy = 0; g.cam.kx = 0; g.cam.ky = 0; g.cam.shake = 0;
      const base = Math.sqrt(g.view.w * g.view.h) / k.cfg.camera.viewArea;
      g.cam.scale = base * g.cam.zoom; g.cam.halfW = g.view.w / 2 / g.cam.scale; g.cam.halfH = g.view.h / 2 / g.cam.scale;
      Object.assign(g.daylight, night ? { k: 1, a: 0.62, r: 10, g: 14, b: 46 } : { k: 0, a: 0, r: 10, g: 14, b: 46 });
      k.renderer.warm(g, 1.5, 3000);
      k.renderer.draw(g, performance.now());
      await new Promise((r) => setTimeout(r, 120));
      const c = w.chunk(m.cx, m.cy);
      const signs = [];
      for (let i = 0; i < c.rectCount; i++) if (c.rects[i].sign) signs.push(c.rects[i].sign);
      return { signs, at: [m.cx, m.cy] };
    }, { id, night });
    if (info.missing) { ok(false, `${id} haritada`); continue; }
    await page.screenshot({ path: `${OUT}/${id}-${night ? 'gece' : 'gunduz'}.png` });
    if (!night) {
      ok(info.signs.includes(WANT[id]), `${id}: tabela "${WANT[id]}"`, JSON.stringify(info.signs));
    }
  }
}
// Gerçek adların öteki sürüme karışmadığı: sayfadaki tüm tabelalarda karşı sütunun farklı adları yok
const other = flavor === 'arkadas' ? 'uydurma' : 'gercek';
const forbidden = Object.keys(WANT).map((id) => {
  const t = { kolej: TABLO.kolej.ad, kule: TABLO.kule, serife: TABLO.okullar.serife, ted: TABLO.okullar.ted, gundogdu: TABLO.okullar.gundogdu }[id];
  return t && t[other] !== t[col] ? t[other] : null;
}).filter(Boolean);
const leaked = await page.evaluate((list) => {
  const w = __drift.game.world; const found = [];
  for (const c of w.chunks.values()) for (let i = 0; i < c.rectCount; i++) if (list.includes(c.rects[i].sign)) found.push(c.rects[i].sign);
  return found;
}, forbidden);
ok(leaked.length === 0, `${flavor}: karşı sürümün adları yok`, leaked.join(','));
await b.close();
ok(errs.length === 0, 'konsol hatası ve uyarısı yok', errs.slice(0, 4).join(' | '));
console.log(`SONUÇ ${flavor}: ${passes} geçti, ${fails.length} hata`);
process.exit(fails.length ? 1 : 0);
