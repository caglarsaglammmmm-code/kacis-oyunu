import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LANG_PACKS, LANGS, detectLang, setLang, tx, txNum, langKeys, getLang } from '../js/i18n/index.js';
import { CONFIG } from '../js/config.js';

test('altı dil var, her dilde bütün anahtarlar dolu', () => {
  assert.deepEqual(Object.keys(LANGS), ['tr', 'en', 'ja', 'zh', 'es', 'de']);
  const ref = langKeys('tr').sort();
  for (const code of Object.keys(LANG_PACKS)) {
    assert.deepEqual(langKeys(code).sort(), ref, code);
    for (const k of ref) {
      setLang(code);
      const v = tx(k);
      if (Array.isArray(v)) assert.ok(v.length && v.every((s) => typeof s === 'string' && s.trim()), `${code}:${k}`);
      else assert.ok(typeof v === 'string' && v.trim() && v !== k, `${code}:${k}`);
    }
  }
  setLang('tr');
});

test('dizi uzunlukları her dilde aynı (ipuçları, boyalar)', () => {
  for (const code of Object.keys(LANG_PACKS)) {
    setLang(code);
    assert.equal(tx('howto.tips').length, 7, code);
    for (const k of ['zones', 'wheel', 'stick']) assert.equal(tx(`hint.${k}`).length, 6, `${code} ${k}`);
    for (const car of CONFIG.cars) assert.equal(tx(`cars.${car.id}.paints`).length, car.paints.length, `${code} ${car.id}`);
  }
  setLang('tr');
});

test('cihaz dili algılanır, desteklenmeyen dilde İngilizce', () => {
  assert.equal(detectLang(['de-DE', 'en']), 'de');
  assert.equal(detectLang(['zh-Hans-CN']), 'zh');
  assert.equal(detectLang(['ja']), 'ja');
  assert.equal(detectLang(['pt-BR', 'fr']), 'en');
  assert.equal(detectLang([]), 'en');
  assert.equal(setLang('xx'), 'en');
  setLang('tr');
});

test('yer tutucular ve sayı biçimi dile göre', () => {
  setLang('tr');
  assert.equal(tx('garage.buy', { cost: 100 }), 'Satın al · 100');
  assert.equal(txNum(12345), '12.345');
  setLang('en');
  assert.equal(txNum(12345), '12,345');
  assert.equal(tx('settings.version', { v: '1.2.3' }), 'Version 1.2.3');
  setLang('de');
  assert.equal(txNum(1.5, 1), '1,5');
  setLang('tr');
  assert.equal(getLang(), 'tr');
});

test('arayüz kodunda sabit Türkçe metin kalmadı', () => {
  // Yorumlar ve dünya içi tabelalar (isim tablosu, dükkân adları, yaya bağırışları) hariç
  const TR = /[çğıöşüÇĞİÖŞÜ]/;
  // art.js dışarıda: araç üstündeki TAKSİ, DOLMUŞ gibi yazılar dünyanın parçasıdır
  for (const f of ['js/ui.js', 'js/main.js', 'js/controls.js', 'js/game.js', 'js/input.js', 'js/cheat.js', 'js/storage.js', 'js/pixelmenu.js']) {
    const lines = fs.readFileSync(f, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      if (line.includes('fonts.load(')) return; // Yazı tipini önden yüklemek için örnek harfler, ekranda görünmez
      const code = line.replace(/\/\/.*$/, '').replace(/\/\*.*?\*\//g, '');
      for (const m of code.matchAll(/(['`])((?:\.|(?!\1).)*)\1/g)) {
        assert.ok(!TR.test(m[2]), `${f}:${i + 1} ${m[2]}`);
      }
    });
  }
});

test('Play Store metinleri: 6 dil, başlık en çok 30, kısa açıklama ve tanıtım en çok 80 karakter, gerçek ad yok', async () => {
  const { gercekAdlar } = await import('../names/tablo.mjs');
  const real = gercekAdlar().filter((s) => !s.startsWith('http'));
  for (const code of ['tr', 'en', 'ja', 'zh', 'es', 'de']) {
    const text = fs.readFileSync(`gorseller/play-store/metinler/${code}.txt`, 'utf8').replace(/\r\n/g, '\n');
    const parts = text.split(/\n\n(?=[^\n]+:\n)/).map((p) => p.split('\n').slice(1).join('\n').trim());
    const [title, short, promo, long] = parts;
    assert.ok(title && [...title].length <= 30, `${code} başlık ${[...title].length}`);
    assert.ok(short && [...short].length <= 80, `${code} kısa ${[...short].length}`);
    assert.ok(promo && [...promo].length <= 80, `${code} tanıtım ${[...promo].length}`);
    const minLong = code === 'ja' || code === 'zh' ? 300 : 600; // Çince ve Japonca karakter başına daha yoğun
    assert.ok(long && [...long].length > minLong && [...long].length <= 4000, `${code} uzun ${long && [...long].length}`);
    for (const r of real) assert.ok(!text.includes(r), `${code}: ${r}`);
  }
});
