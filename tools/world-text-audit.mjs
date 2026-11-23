// Dünya yazısı denetimi: oyun sırasında tuvale çizilen BÜTÜN yazılar kaydedilir (fillText/strokeText), harita
// geniş bir alanda ve bütün özel yerlerde dolaşılır. Dil tr, en, de, ja için ayrı ayrı.
// Türkçe dışındaki dillerde: Türkçe harf (ç ğ ı ö ş ü İ â) içeren ya da Türkçe tabela tablosunda anahtar olarak geçen
// her yazı hatadır. Ayrıca Türkçe turda da görülen ve çevirisi kendisine eşit olmayan yazılar raporlanır.
// HUD ve menü DOM'dadır (o dillerde çevrilir), burada yalnız dünya (tuval) yazıları sayılır.
// Önce sunucu: npm run serve (8080, play) ya da FLAVOR=arkadas PORT=8082 node tools/serve.mjs
// node tools/world-text-audit.mjs [port] [yarıçap chunk]
import fs from 'node:fs';
import { chromium } from 'playwright-core';

// İlk bağımsız değişken port ya da tam adres (canlı yayın: https://.../drift-lab/)
const BASE = /^https?:/.test(process.argv[2] || '') ? process.argv[2].replace(/\/?$/, '/') : `http://localhost:${Number(process.argv[2] || 8080)}/`;
const R = Number(process.argv[3] || 7);
const OUT = 'e2e-out/v24c';
fs.mkdirSync(OUT, { recursive: true });
const TR_CHARS = /[çğıöşüÇĞİÖŞÜâÂîÎûÛ]/;

const b = await chromium.launch({ channel: 'msedge', headless: true });
const errs = [];
const result = {};
for (const lang of ['tr', 'en', 'de', 'ja']) {
  const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, locale: lang });
  await ctx.addInitScript(() => {
    globalThis.__texts = new Map();
    for (const fn of ['fillText', 'strokeText']) {
      const orig = CanvasRenderingContext2D.prototype[fn];
      CanvasRenderingContext2D.prototype[fn] = function (t, ...a) {
        const d = globalThis.__drift;
        if (d && d.game && d.game.state === 'play' && typeof t === 'string') globalThis.__texts.set(t, (globalThis.__texts.get(t) || 0) + 1);
        return orig.call(this, t, ...a);
      };
    }
  });
  const page = await ctx.newPage();
  page.on('pageerror', (e) => errs.push(`${lang} pageerror ${e.message}`));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(`${lang} ${m.text()}`); });
  await page.goto(`${BASE}?god=1&t=0&v=${Date.now()}`);
  await page.waitForFunction(() => window.__drift && !document.getElementById('menu').hidden, null, { timeout: 30000 });
  await page.evaluate((c) => { const k = __drift; k.storage.data.settings.lang = c; k.storage.save(); k.applySettings(); }, lang);
  await page.evaluate(() => __drift.play());
  await page.waitForFunction(() => __drift.game.state === 'play' && !__drift.renderer.warmingNow, null, { timeout: 30000 });
  // Gezilecek yerler: özel yerler, kolej, siteler, gizli geçit ve R yarıçaplı ızgara
  const stops = await page.evaluate((R) => {
    const w = __drift.game.world;
    const C = 1280;
    const list = [];
    const k = w.kolejChunk(); list.push([k.cx, k.cy]);
    w.chunk(0, 0);
    for (const s of w.sites) for (let dx = 0; dx < (s.span || 2); dx++) for (let dy = 0; dy < (s.span || 2); dy++) list.push([s.cx + dx, s.cy + dy]);
    for (const m of w.landmarkList()) list.push([m.cx, m.cy]);
    for (let cy = -R; cy <= R; cy++) for (let cx = -R; cx <= R; cx++) list.push([cx, cy]);
    const seen = new Set();
    return list.filter(([x, y]) => { const key = `${x},${y}`; if (seen.has(key)) return false; seen.add(key); return true; })
      .map(([x, y]) => [x * C + C * 0.55, y * C + C * 0.55]);
  }, R);
  await page.evaluate(() => {
    const g = __drift.game;
    globalThis.__pos = null;
    clearInterval(globalThis.__h);
    globalThis.__h = setInterval(() => { const q = globalThis.__pos; if (!q) return; const p = g.player; p.x = q[0]; p.y = q[1]; p.vx = 0; p.vy = 0; p.speed = 0; g.cops.length = 0; g.hp = 100; }, 4);
  });
  let n = 0;
  for (const s of stops) {
    await page.evaluate((s) => { globalThis.__pos = s; }, s);
    await page.waitForTimeout(170);
    if (++n % 60 === 0) await page.screenshot({ path: `${OUT}/${lang}-tur-${n}.png` });
  }
  // Gece: ışıklı tabelalar ayrı çizilir
  await page.evaluate(() => { const D = __drift.cfg.day; __drift.game.dayT = (0.7 - D.start) * D.length; });
  for (const s of stops.slice(0, 40)) { await page.evaluate((s) => { globalThis.__pos = s; }, s); await page.waitForTimeout(150); }
  // Yaya sözleri: her yaya türünün sözü yüzen yazı olarak çizilir (çarpışmanın kendisi rastgele olduğundan doğrudan)
  await page.evaluate(async () => {
    const g = __drift.game; const p = g.player;
    const { tabelaText } = await import('./js/tabela.js');
    const P = __drift.cfg.peds;
    const all = [...Object.values(P.kinds).flatMap((k) => k.words || []), ...Object.values(P.words).flat()];
    for (const w of all) g.fx.float(p.x, p.y - 30, tabelaText(w), '#fff');
  });
  await page.waitForTimeout(400);
  // Araç atlası: dil İngilizce ise kamyon, taksi, dolmuş ve polis görüntüsü İngilizce atlastan gelmeli
  const atlas = await page.evaluate(async () => {
    const r = __drift.renderer;
    const tr = new Image(); tr.src = 'assets/cars.webp'; await tr.decode();
    const en = new Image(); en.src = 'assets/cars-en.webp'; await en.decode();
    const { CAR_SHEET } = await import('./js/carsheet.js');
    const cell = CAR_SHEET.cells['npc:truck:0'];
    const spr = r.sprites.npc && r.sprites.npc.truck0;
    if (!spr) return 'sprite yok';
    const cmp = (img) => {
      const a = document.createElement('canvas'); a.width = cell[2]; a.height = cell[3];
      const ga = a.getContext('2d'); ga.drawImage(img, cell[0], cell[1], cell[2], cell[3], 0, 0, cell[2], cell[3]);
      const gb = document.createElement('canvas').getContext('2d'); gb.canvas.width = cell[2]; gb.canvas.height = cell[3]; gb.drawImage(spr, 0, 0);
      const da = ga.getImageData(0, 0, cell[2], cell[3]).data; const db = gb.getImageData(0, 0, cell[2], cell[3]).data;
      let d = 0; for (let i = 0; i < da.length; i += 16) d += Math.abs(da[i] - db[i]); return d;
    };
    return cmp(en) < cmp(tr) ? 'en' : 'tr';
  });
  const texts = await page.evaluate(() => [...globalThis.__texts.keys()]);
  await page.screenshot({ path: `${OUT}/${lang}-son.png` });
  result[lang] = { texts, atlas, stops: stops.length };
  console.log(lang, 'durak', stops.length, 'farklı yazı', texts.length, 'araç atlası', atlas);
  await ctx.close();
}
await b.close();

const keysTr = new Set(result.tr.texts);
const report = { hatalar: [], ortak: {} };
for (const lang of ['en', 'de', 'ja']) {
  const r = result[lang];
  const bad = r.texts.filter((t) => TR_CHARS.test(t));
  const same = r.texts.filter((t) => keysTr.has(t) && /\p{L}{3,}/u.test(t) && !TR_CHARS.test(t));
  report.ortak[lang] = same.sort();
  for (const t of bad) report.hatalar.push(`${lang}: Türkçe harfli yazı: ${t}`);
  if (r.atlas !== 'en') report.hatalar.push(`${lang}: araç atlası ${r.atlas}`);
}
if (result.tr.atlas !== 'tr') report.hatalar.push(`tr: araç atlası ${result.tr.atlas}`);
for (const e of errs) report.hatalar.push(e);
fs.writeFileSync(`${OUT}/rapor.json`, JSON.stringify({ result, report }, null, 1));
console.log('\nTürkçe turda görülen yazı sayısı:', result.tr.texts.length);
console.log('İngilizce turda Türkçe turla aynı kalan harfli yazılar (elle bakılacak):', report.ortak.en.join(' | '));
console.log('\nHATALAR:', report.hatalar.length);
for (const h of report.hatalar.slice(0, 60)) console.log('  -', h);
process.exit(report.hatalar.length ? 1 : 0);
