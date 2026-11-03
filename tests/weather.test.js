import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG, GROUND } from '../js/config.js';
import { Game, pickWeather } from '../js/game.js';
import { Storage } from '../js/storage.js';

const dt = 1 / 60;
const car = CONFIG.cars[0];
const WX = CONFIG.weather;

test('ayardaki hava aynen seçilir; rastgele seçim bütün türleri üretir', () => {
  for (const t of WX.types) assert.equal(pickWeather(t), t);
  const seen = new Set();
  for (let i = 0; i < 400; i++) seen.add(pickWeather('random'));
  assert.deepEqual([...seen].sort(), [...WX.types].sort());
  let k = 0;
  const rnd = () => [0, 0.999][k++ % 2];
  assert.equal(pickWeather('random', rnd), 'sunny');
  assert.equal(pickWeather('random', rnd), 'ice');
});

test('her hava türü çalışır; tutuş yumuşakça değişir, polis etkinin yarısını hisseder', () => {
  for (const t of WX.types) {
    const g = new Game(1);
    g.start(car, { seed: 21, weather: t, god: true });
    assert.equal(g.weather, t);
    assert.equal(g.wk, 0);
    for (let i = 0; i < 60 * (WX.fade + 0.2); i++) g.tick(dt, 0, false);
    assert.equal(g.wk, 1);
    const road = GROUND.ROAD;
    const base = CONFIG.surfaces[road].grip;
    assert.ok(Math.abs(g.surfP[road].grip - base * WX.grip[t]) < 1e-9, t);
    const copLoss = base - g.surfC[road].grip;
    assert.ok(Math.abs(copLoss - (base - g.surfP[road].grip) * WX.copShare) < 1e-9, `${t} polis`);
  }
});

test('buzlu yolda tutuş gerçekten düşer: yana kayan araba toparlanamaz, drift uzar', () => {
  // Araç yana kayarken direksiyon bırakılır: yarım saniye sonra kalan yanal hız ölçülür
  const slide = (w) => {
    const g = new Game(1);
    g.start(car, { seed: 21, weather: w, god: true });
    g.wk = 1; g.applyWeather();
    const p = g.player;
    p.a = Math.PI / 2; p.vx = -160; p.vy = 300; p.speed = Math.hypot(300, 160); // Yol yönünde ileri, yana kayarak
    const x0 = p.x; const y0 = p.y; // Başlangıç noktası yolun üstünde
    let drift = 0;
    for (let i = 0; i < 30; i++) {
      g.updatePlayer(dt, 0, false);
      p.x = x0; p.y = y0; // Duvar etkisi olmasın
      if (p.drifting) drift++;
    }
    return { lateral: Math.abs(p.lateral), drift };
  };
  const sunny = slide('sunny');
  const ice = slide('ice');
  assert.ok(ice.lateral > sunny.lateral * 2, `buz ${ice.lateral.toFixed(1)} güneş ${sunny.lateral.toFixed(1)}`);
  assert.ok(ice.drift > sunny.drift, `drift kare: buz ${ice.drift} güneş ${sunny.drift}`);
  assert.ok(WX.grip.ice < WX.grip.rain && WX.grip.rain < 1 && WX.grip.snow < 1);
});

test('hava ayarı kaydedilir, bozuk değer rastgeleye döner', () => {
  const m = new Map();
  const b = { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
  const s = new Storage(b);
  assert.equal(s.data.settings.weather, 'random');
  s.data.settings.weather = 'ice';
  s.save();
  assert.equal(new Storage(b).data.settings.weather, 'ice');
  m.set('drift-lab-v1', JSON.stringify({ settings: { weather: 'tornado' } }));
  assert.equal(new Storage(b).data.settings.weather, 'random');
});

test('menüde hazırlanan dünya aynı havayla kullanılır, ayar değişirse yeniden seçilir', () => {
  const g = new Game(1);
  g.start(car, { seed: 21, weather: 'random' });
  const w = g.weather;
  g.start(car, { keepWorld: true, weather: 'random' });
  assert.equal(g.weather, w);
  g.start(car, { keepWorld: true, weather: 'snow' });
  assert.equal(g.weather, 'snow');
});
