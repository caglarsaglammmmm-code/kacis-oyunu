// 24.1.0 üçüncü yayın: oyun dünyasındaki BÜTÜN yazılar Türkçe dışındaki dillerde İngilizce
// (tabelalar, araç üstü yazılar, yaya sözleri, afişler, yol levhaları). Tarayıcıda tam tur: tools/world-text-audit.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CONFIG } from '../js/config.js';
import { NAMES } from '../js/names.js';
import { setLang } from '../js/i18n/index.js';
import { tabelaText, tabelaKnown, TABELA_EN } from '../js/tabela.js';
import { TABLO } from '../names/tablo.mjs';

const TR_CHARS = /[çğıöşüÇĞİÖŞÜâÂîÎûÛ]/;

test('yaya sözleri, araç yazıları ve küçük yazıların hepsinin İngilizcesi var', () => {
  const P = CONFIG.peds;
  const words = [...Object.values(P.kinds).flatMap((k) => k.words || []), ...Object.values(P.words).flat()];
  const english = new Set(['OH NO!', 'MAMMA MIA!', 'WOW!', 'HELP!']); // Turist sözleri zaten İngilizce
  for (const w of words) if (!english.has(w)) assert.ok(tabelaKnown(w), `yaya sözü: ${w}`);
  for (const w of ['TAKSİ', 'DOLMUŞ', 'BELEDİYE', 'NAKLİYAT', 'POLİS', 'ÖZEL HAREKAT', '12 MERKEZ', 'PİKAP', 'OKUL TAŞITI', 'İŞ HANI', 'ACİL', 'AMBULANS', 'DUR', ...CONFIG.signs.promos]) {
    assert.ok(tabelaKnown(w), w);
  }
});

test('Play İngilizce yazılarında Türkçe harf yok; Türkçede yazılar aynen kalır', () => {
  for (const [tr, en] of [...Object.entries(TABELA_EN), ...Object.entries(TABLO.ingilizce.uydurma)]) assert.ok(!TR_CHARS.test(en), `${tr} -> ${en}`);
  try {
    setLang('tr');
    for (const k of Object.keys(TABELA_EN)) assert.equal(tabelaText(k), k);
    for (const k of Object.keys(NAMES.ingilizce)) assert.equal(tabelaText(k), k);
    for (const lang of ['en', 'de', 'ja', 'zh', 'es']) {
      setLang(lang);
      assert.equal(tabelaText('Bakkal'), 'Grocery Store');
      assert.equal(tabelaText('Züccaciye'), 'Housewares Store');
      assert.equal(tabelaText('Kuaför'), 'Hair Salon');
      assert.equal(tabelaText('Şehir Hastanesi'), 'City Hospital');
      assert.equal(tabelaText('NAKLİYAT'), 'FREIGHT');
      assert.equal(tabelaText('İMDAT!'), 'HELP!');
      for (const k of Object.keys(TABELA_EN)) assert.ok(!TR_CHARS.test(tabelaText(k)), `${lang}: ${k}`);
    }
  } finally { setLang('tr'); }
});

test('İngilizce araç atlası var ve hücre düzeni aynı; araç üstü yazı İngilizce atlastan gelir', () => {
  const head = (f) => fs.readFileSync(f).subarray(0, 4).toString();
  assert.equal(head('assets/cars-en.webp'), 'RIFF');
  assert.ok(fs.statSync('assets/cars-en.webp').size > 100000);
  const sheet = fs.readFileSync('js/sheet.js', 'utf8');
  assert.match(sheet, /assets\/cars-en\.webp/);
  assert.match(sheet, /tabelaEnglish\(\) && ATLAS\.en/);
  assert.match(fs.readFileSync('sw.js', 'utf8'), /'assets\/cars-en\.webp'/);
});

test('tabela büyük harfi dile göre: İngilizcede "HAIR", Türkçede "İ"', () => {
  const art = fs.readFileSync('js/art.js', 'utf8');
  assert.match(art, /tabelaEnglish\(\) \? text\.toUpperCase\(\) : text\.toLocaleUpperCase\('tr'\)/);
  assert.equal('Hair Salon'.toUpperCase(), 'HAIR SALON');
});

test('yazı gömülü Türkçe arayüz görseli pakette yok', () => {
  assert.ok(!fs.existsSync('assets/ui/btn-basla.png'));
  assert.ok(!/btn-basla/.test(fs.readFileSync('css/style.css', 'utf8')));
});
