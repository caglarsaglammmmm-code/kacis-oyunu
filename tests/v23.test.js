// v23: hava renk koruma, kar kalınlığı, gizli yazı süresi, egzoz patlaması, egzoz mağazası (kayıt), dil
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';
import { Storage, sanitize } from '../js/storage.js';
import { snowLevel } from '../js/snow.js';
import { exhaustOf, ENGINE_KINDS } from '../js/audio.js';

const dt = 1 / 60;
const EX = CONFIG.custom.exhausts;
function mem() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

test('renk koruma: dünyaya genel örtü en fazla %10; sis yalnız kenarda', () => {
  const W = CONFIG.weather;
  assert.ok(W.fogFlat <= 0.1 && W.rainTint <= 0.1 && W.iceTint <= 0.1, 'düz örtüler');
  assert.ok(W.fogAlpha <= 0.2, 'sis kenar katmanı hafif');
});

test('kar kalınlığı oyun süresince adım adım artar, tavanı var; güneşli havada kar yok (çizim tarafı)', () => {
  const S = CONFIG.snow;
  const a = snowLevel(0); const b = snowLevel(S.grow / 2); const c = snowLevel(S.grow * 3);
  assert.ok(a > 0 && a < b && b < c, `${a} < ${b} < ${c}`);
  assert.equal(c, 1, 'tavan');
  assert.ok(a <= 0.5, 'başta ince');
  // Adımlı: sık yeniden çizim yok
  const vals = new Set(); for (let t = 0; t < S.grow * 2; t += 1) vals.add(snowLevel(t));
  assert.ok(vals.size <= S.steps + 1, `${vals.size} adım`);
});

test('gizli geçit yazısı 5-10 sn arasında ayarlanır, varsayılan 7', () => {
  assert.equal(CONFIG.secret.GIZLI_YAZI_SURESI, 7);
  assert.ok(CONFIG.secret.GIZLI_YAZI_SURESI >= 5 && CONFIG.secret.GIZLI_YAZI_SURESI <= 10);
});

test('egzoz patlaması: araç başına şans config\'te; gaz bırakınca olay ve alev; elektrikli araçta yok', () => {
  for (const c of [...CONFIG.cars, CONFIG.secretCar]) assert.ok(typeof c.egzozPatlamaSansi === 'number', c.id);
  assert.equal(CONFIG.cars.find((c) => c.id === 'elektra').egzozPatlamaSansi, 0);
  const g = new Game(1);
  const car = CONFIG.cars.find((c) => c.id === 'kartal');
  g.start(car, { seed: 3, god: true });
  g.look = { exhaust: 'patlamali' };
  const ev = [];
  g.onEvent = (n, v) => { if (n === 'backfire') ev.push(v); };
  const p = g.player;
  for (let k = 0; k < 40; k++) {
    p.speed = car.maxSpeed * 0.7; p.gas = 1; g.updateBackfire(dt);
    p.gas = 0.2; g.updateBackfire(dt); // Gaz bırakıldı
    g.bfCd = 0;
  }
  assert.ok(ev.length >= 20, `patlama olayı ${ev.length}`);
  assert.ok(ev.every((n) => n >= 2 && n <= 4), 'pat, pat, pop');
  const e = new Game(1);
  e.start(CONFIG.cars.find((c) => c.id === 'elektra'), { seed: 3, god: true });
  let n = 0; e.onEvent = (k) => { if (k === 'backfire') n++; };
  for (let k = 0; k < 40; k++) { e.player.speed = 300; e.player.gas = 1; e.updateBackfire(dt); e.player.gas = 0.2; e.updateBackfire(dt); e.bfCd = 0; }
  assert.equal(n, 0, 'elektrikli araçta egzoz patlaması yok');
});

test('egzoz mağazası: en az 6 ses, Standart ücretsiz, diğerleri 1000; her biri farklı', () => {
  assert.equal(CONFIG.custom.EGZOZ_FIYATI, 1000);
  assert.ok(EX.length >= 6);
  assert.equal(EX[0].id, 'std'); assert.equal(EX[0].price, 0);
  for (const x of EX.slice(1)) assert.equal(x.price, CONFIG.custom.EGZOZ_FIYATI, x.id);
  for (const id of ['v8', 'patlamali', 'turbo', 'spor', 'derin']) assert.ok(EX.some((x) => x.id === id), id);
  const sig = new Set(EX.map((x) => `${x.pitch}:${x.sub}:${x.rough}:${x.bright}:${x.pops}:${x.turbo}`));
  assert.equal(sig.size, EX.length, 'her egzoz farklı');
  assert.equal(exhaustOf('turbo').turbo, 1);
  assert.ok(exhaustOf('patlamali').pops >= 3, 'sık patlama');
  assert.equal(exhaustOf('yok-boyle').id, 'std');
  assert.ok(ENGINE_KINDS.v8 && ENGINE_KINDS.ev, 'motor karakterleri farklı kaldı');
});

test('egzoz satın alma: para düşer, kalıcı, araç başına seçim; yetersiz parada alınmaz; satın alınmamış takılamaz', () => {
  const b = mem();
  const s = new Storage(b);
  s.data.coins = 1500; s.data.owned.push('motor');
  assert.equal(s.setLook('atmaca', 'exhaust', 'v8'), false, 'alınmadan takılamaz');
  assert.equal(s.buyItem('exhaust', 'v8'), 'ok');
  assert.equal(s.data.coins, 500);
  assert.equal(s.buyItem('exhaust', 'turbo'), 'poor', 'yetersiz para');
  assert.equal(s.data.coins, 500);
  assert.ok(s.setLook('atmaca', 'exhaust', 'v8'));
  assert.equal(s.look('atmaca').exhaust, 'v8');
  assert.equal(s.look('motor').exhaust, 'std', 'araç başına');
  assert.equal(s.buyItem('exhaust', 'v8'), 'owned');
  const again = new Storage(b);
  assert.ok(again.owns('exhaust', 'v8'), 'kalıcı');
  assert.equal(again.look('atmaca').exhaust, 'v8');
  // Sahte kayıt: alınmamış egzoz seçili olamaz
  const fake = sanitize({ custom: { atmaca: { exhaust: 'derin' } } });
  assert.equal(fake.custom.atmaca.exhaust, 'std');
});

test('dil: egzoz adları, açıklamaları ve düğmeler altı dilde', async () => {
  const { tx, setLang } = await import('../js/i18n/index.js');
  for (const l of ['tr', 'en', 'ja', 'zh', 'es', 'de']) {
    setLang(l);
    for (const k of ['custom.exhaust', 'custom.listen', 'roadblock.warn']) assert.ok(tx(k) && !tx(k).startsWith('custom.'), `${l} ${k}`);
    for (const x of EX) {
      assert.ok(tx(`custom.exhausts.${x.id}`) && !tx(`custom.exhausts.${x.id}`).includes('.'), `${l} ${x.id}`);
      assert.ok(tx(`custom.exhaustInfo.${x.id}`).length > 6, `${l} ${x.id} açıklama`);
    }
  }
  setLang('tr');
});
