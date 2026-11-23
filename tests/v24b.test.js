// 24.1.0 ikinci yayın: 16 basışlık hile kodu (cheat.test.js), tabela dili (Türkçe / diğer bütün dillerde İngilizce),
// büyük kolej (Play: Kolej / College), siyah-beyaz site (Play: Monokrom Sitesi / Monochrome Residence),
// Play paketinde yasak kelime yok
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { CONFIG } from '../js/config.js';
import { NAMES } from '../js/names.js';
import { setLang, LANG_PACKS } from '../js/i18n/index.js';
import { tabelaText, tabelaKnown, TABELA_EN } from '../js/tabela.js';
import { World, CT, TILE } from '../js/world.js';
import { GROUND } from '../js/config.js';
import { collectSigns } from '../tools/sign-list.mjs';
import { TABLO } from '../names/tablo.mjs';
import { namesSource } from '../tools/names.mjs';
import { buildWeb } from '../tools/flavor.mjs';

test('hile kodu 16 basış ve istenen sıra', () => {
  assert.equal(CONFIG.cheat.sequence.join(' '), 'L L R R L R L R L L R R L L L R');
});

test('haritadaki her tabelanın İngilizcesi var; Türkçede Türkçe, diğer bütün dillerde İngilizce yazar', () => {
  const signs = collectSigns([4, 7], 30);
  assert.ok(signs.length > 100, String(signs.length));
  const extra = ['İŞ HANI', 'ACİL', 'AMBULANS', 'DUR', 'OKUL TAŞITI', ...CONFIG.signs.promos, NAMES.stadyum.kucuk, NAMES.stadyum.buyuk,
    ...NAMES.yol.sol, ...NAMES.yol.sag, ...NAMES.yol.yon, ...NAMES.tarihi.duraklar];
  const missing = [...signs, ...extra].filter((s) => !tabelaKnown(s));
  assert.deepEqual(missing, [], 'çevirisi olmayan tabela');
  try {
    setLang('tr');
    assert.equal(tabelaText('Züccaciye'), 'Züccaciye');
    assert.equal(tabelaText(NAMES.kolej.ad), 'KOLEJ');
    for (const code of Object.keys(LANG_PACKS).filter((c) => c !== 'tr')) {
      setLang(code);
      assert.equal(tabelaText('Züccaciye'), 'Crockery Store', code);
      assert.equal(tabelaText(NAMES.ilkokul), 'Plane Tree Primary School', code);
      assert.equal(tabelaText(NAMES.kolej.ad), 'COLLEGE', code);
      assert.equal(tabelaText(NAMES.siteler.monokrom), 'Monochrome Residence', code);
      assert.equal(tabelaText('Şehir Hastanesi'), 'City Hospital', code);
    }
  } finally { setLang('tr'); }
  // İngilizce yazılar gerçekten İngilizce: Türkçeye özgü harf yalnız özel adlarda kalır (Çınarlı, İşbank gibi değil, Play'de)
  for (const en of Object.values(TABELA_EN)) assert.ok(!/[ğĞşŞıİ]/.test(en), en);
});

test('iki sürümün isim tablosunda her tabela adının İngilizcesi var', () => {
  const pairs = [];
  const walk = (v) => {
    if (!v || typeof v !== 'object') return;
    if ('gercek' in v && 'uydurma' in v) {
      if (typeof v.gercek === 'string' || Array.isArray(v.gercek)) pairs.push([[v.gercek].flat(), [v.uydurma].flat()]);
      return;
    }
    for (const k of Object.keys(v)) walk(v[k]);
  };
  for (const k of ['kolej', 'okullar', 'ilkokul', 'kule', 'tarihi', 'yol', 'siteler', 'tekil', 'stadyum']) walk(TABLO[k]);
  for (const k of ['saray', 'pide', 'lahmacun', 'ocak', 'kebapci', 'ozocak']) walk(TABLO.dukkan[k]);
  for (const z of [...TABLO.zincirler, ...TABLO.bankalar]) walk(z.ad);
  const E = TABLO.ingilizce;
  for (const [g, u] of pairs) {
    for (const s of g) assert.ok(E.gercek[s] || TABELA_EN[s], `arkadaş: ${s}`);
    for (const s of u) assert.ok(E.uydurma[s] || TABELA_EN[s], `play: ${s}`);
  }
  assert.equal(E.gercek['SİSTEM KOLEJİ'], 'SYSTEM COLLEGE');
  assert.equal(E.gercek['Anthropic Sitesi'], 'Anthropic Residence');
  assert.equal(E.uydurma.KOLEJ, 'COLLEGE');
  assert.equal(E.uydurma['Monokrom Sitesi'], 'Monochrome Residence');
});

test('kolej: haritada tek, en büyük bina, turuncu; adı Play: KOLEJ, arkadaş: SİSTEM KOLEJİ', async () => {
  assert.equal(NAMES.kolej.ad, 'KOLEJ');
  assert.match(await namesSource('arkadas'), /"SİSTEM KOLEJİ"/);
  const w = new World(4);
  const k = w.kolejChunk();
  const c = w.chunk(k.cx, k.cy);
  let r = null;
  let biggest = 0;
  for (let i = 0; i < c.rectCount; i++) if (c.rects[i].landmark === 'kolej') r = c.rects[i];
  assert.ok(r, 'kolej binası');
  for (const s of [4, 7]) {
    const w2 = new World(s);
    for (let cy = -12; cy < 12; cy++) for (let cx = -12; cx < 12; cx++) {
      const c2 = w2.chunk(cx, cy);
      for (let i = 0; i < c2.rectCount; i++) { const b = c2.rects[i]; if (b.kind === 'building' && b.landmark !== 'kolej' && !b.stadium) biggest = Math.max(biggest, b.w * b.h); }
    }
  }
  assert.ok(r.w * r.h > biggest, `kolej ${r.w}x${r.h}, en büyük diğer ${biggest}`);
  assert.equal(r.color, '#ff7a00');
  assert.ok(CONFIG.world.landmarkHeight.kolej >= 0.5);
});

test('siyah-beyaz site: her haritada bir tane, 6 uzun blok, yola taşmaz, adlı tabela', () => {
  for (const seed of [1, 4, 7, 21, 99, 12345]) {
    const w = new World(seed);
    w.chunk(0, 0);
    const s = w.sites.find((x) => x.layout === 2);
    assert.ok(s, `tohum ${seed}: site yerleşti`);
    assert.equal(s.name, 'Monokrom Sitesi');
    const k = w.kolejChunk();
    assert.ok(Math.abs(k.cx - s.cx) >= 3 || Math.abs(k.cy - s.cy) >= 3, 'kolejden ayrı');
    for (const m of w.landmarkList()) assert.ok(!(m.cx === s.cx && m.cy === s.cy), `özel yerle çakışmaz: ${m.id}`);
    const c = w.chunk(s.cx, s.cy);
    assert.equal(c.template, 'bigsite');
    const blocks = [];
    for (let i = 0; i < c.rectCount; i++) if (c.rects[i].landmark === 'monokrom') blocks.push(c.rects[i]);
    assert.equal(blocks.length, 6, `tohum ${seed}`);
    assert.equal(blocks.filter((b) => b.sign === 'Monokrom Sitesi').length, 1, 'tek tabela');
    for (const b of blocks) {
      assert.ok(b.tall >= 0.8, 'uzun blok');
      for (let ty = Math.floor((b.y - c.y) / TILE); ty <= Math.floor((b.y + b.h - c.y - 1) / TILE); ty++)
        for (let tx = Math.floor((b.x - c.x) / TILE); tx <= Math.floor((b.x + b.w - c.x - 1) / TILE); tx++)
          assert.notEqual(c.ground[ty * CT + tx], GROUND.ROAD, 'blok yolda değil');
    }
    // Komşu chunk'lar site değildir: tek chunk
    for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [0, -1]]) assert.notEqual(w.bigSiteAt(s.cx + dx, s.cy + dy), s);
  }
});

test('Play paketinde Yıldız, Ömer, Sistem, Anthropic hiçbir biçimde yok; arkadaş paketinde adlar var', async () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'v24b-'));
  const play = await buildWeb('play', path.join(tmp, 'play'), { pages: true });
  const ark = await buildWeb('arkadas', path.join(tmp, 'ark'), { pages: true });
  const all = (dir) => {
    let t = '';
    const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else if (/\.(js|html|css|json|txt)$/.test(e.name)) t += `${f}\n${fs.readFileSync(f, 'utf8')}\n`; } };
    walk(dir);
    return t;
  };
  const p = all(play).toLocaleLowerCase('tr').replace(/ı/g, 'i');
  for (const w of ['yildiz', 'ömer', 'sistem', 'anthropic', 'system college']) assert.ok(!p.includes(w), `Play: ${w}`);
  const a = all(ark);
  for (const w of ['SİSTEM KOLEJİ', 'SYSTEM COLLEGE', 'Anthropic Sitesi', 'Anthropic Residence', "'YILDIZ'"]) assert.ok(a.includes(w), `arkadaş: ${w}`);
  fs.rmSync(tmp, { recursive: true, force: true });
});
