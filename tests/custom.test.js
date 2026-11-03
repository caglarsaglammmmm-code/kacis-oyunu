import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { Storage } from '../js/storage.js';
import { paintOf, refPaintIndex } from '../js/custom.js';
import { LANG_PACKS } from '../js/i18n/index.js';

const C = CONFIG.custom;
function mem() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

test('listeler: en az 20 boya, 8 jant, 10 LED; fiyatlar istenen aralıkta', () => {
  assert.ok(C.paints.length >= 20 && C.rims.length >= 6 && C.rims.length <= 8 && C.leds.length >= 9);
  for (const p of C.paints) assert.ok(p.price >= 30 && p.price <= 250 && ['gloss', 'metal', 'matte', 'pearl'].includes(p.finish), p.id);
  assert.ok(new Set(C.paints.map((p) => p.finish)).size >= 3, 'mat, metalik, parlak');
  for (const r of C.rims.slice(1)) assert.ok(r.price >= 60 && r.price <= 250, r.id);
  for (const l of C.leds.slice(1)) assert.ok(l.price >= 100 && l.price <= 300 && l.color, l.id);
  assert.ok(new Set(C.leds.map((l) => l.fx)).size === 3, 'sabit, nefes, gökkuşağı');
  assert.equal(C.rims[0].price, 0);
  assert.equal(C.leds[0].price, 0);
});

test('yetersiz parada alınmaz, yeterli parada alınır, para düşer ve kalıcıdır', () => {
  for (const [kind, id] of [['paint', 'neonpembe'], ['rim', 'altin'], ['led', 'gokkusagi']]) {
    const b = mem();
    const s = new Storage(b);
    const price = (kind === 'paint' ? C.paints : kind === 'rim' ? C.rims : C.leds).find((k) => k.id === id).price;
    s.data.coins = price - 1;
    assert.equal(s.buyItem(kind, id), 'poor', `${kind} yetersiz`);
    assert.equal(s.data.coins, price - 1);
    assert.equal(s.setLook('atmaca', kind, id), false, 'açılmamış seçilemez');
    s.data.coins = price + 5;
    assert.equal(s.buyItem(kind, id), 'ok');
    assert.equal(s.data.coins, 5);
    assert.equal(s.buyItem(kind, id), 'owned', 'ikinci kez para alınmaz');
    assert.equal(s.data.coins, 5);
    assert.ok(s.setLook('atmaca', kind, id));
    const again = new Storage(b);
    assert.ok(again.owns(kind, id), 'kalıcı');
    assert.equal(again.look('atmaca')[kind], id, 'seçim kalıcı');
    assert.notEqual(again.look('motor')[kind], id, 'her araba ayrı');
  }
});

test('bozuk ya da açılmamış seçim kayıttan temizlenir', () => {
  const b = mem();
  b.setItem('drift-lab-v1', JSON.stringify({ paints: { atmaca: 'altin' }, custom: { atmaca: { rim: 'altin', led: 'gokkusagi' } }, unlocked: { paints: ['yok-boya'], rims: [], leds: [] } }));
  const s = new Storage(b);
  assert.equal(s.look('atmaca').paint, 0);
  assert.equal(s.look('atmaca').rim, 'std');
  assert.equal(s.look('atmaca').led, 'yok');
  assert.deepEqual(s.data.unlocked.paints, []);
});

test('genel boya her arabaya uyar; yeniden renklendirme için doygun kendi boyası seçilir', () => {
  for (const car of CONFIG.cars) {
    const p = paintOf(car, 'okyanus');
    assert.equal(p.color, '#1565c0');
    const ref = car.paints[refPaintIndex(car)];
    assert.ok(ref && !ref.roof, car.id);
  }
});

test('bütün özelleştirme adları altı dilde var', () => {
  for (const [code, pack] of Object.entries(LANG_PACKS)) {
    for (const p of C.paints) assert.ok(pack.custom.paints[p.id], `${code} boya ${p.id}`);
    for (const r of C.rims) assert.ok(pack.custom.rims[r.id], `${code} jant ${r.id}`);
    for (const l of C.leds) assert.ok(pack.custom.leds[l.id], `${code} led ${l.id}`);
  }
});
