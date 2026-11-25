// v24.2-3: silah fiyatları yarıda, en pahalı araba (Kuzgun) yalnız kodla, meteor zamanla sıklaşır ve hızlanır,
// nişan arabanın hızına göre ileriyi öngörür (arkaya düşmez)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';
import { Storage, sanitize } from '../js/storage.js';
import { meteorAim, meteorLead, meteorRate } from '../js/meteor.js';

const dt = 1 / 60;
const MET = CONFIG.meteor;
const KUZGUN = CONFIG.cars.find((c) => c.id === 'kuzgun');
function mem(init) {
  const m = new Map(init ? [['drift-lab-v1', JSON.stringify(init)]] : []);
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

// ---------- SİLAH FİYATLARI ----------
test('silah fiyatları yarıda: 1.250 / 3.000 / 6.000 / 12.500 / 22.500 / 45.000, ucuzdan pahalıya sıralı', () => {
  const p = CONFIG.guns.map((g) => g.price);
  assert.deepEqual(p, [2500, 6000, 12000, 25000, 45000, 90000].map((n) => n / 2));
  for (let i = 1; i < p.length; i++) assert.ok(p[i] > p[i - 1]);
  const s = new Storage(mem());
  s.data.coins = 1250;
  assert.equal(s.buyGun('g1'), 'ok', 'yeni fiyatla alınır');
  assert.equal(s.data.coins, 0);
});

// ---------- KODLA AÇILAN ARABA ----------
test('en pahalı araba Kuzgun (60.000) yalnız kodla: garajda görünmez, parayla alınamaz', () => {
  const top = CONFIG.cars.reduce((a, c) => (c.cost > a.cost ? c : a));
  assert.equal(top.id, 'kuzgun');
  assert.equal(top.cost, 60000);
  assert.equal(KUZGUN.codeOnly, true);
  const s = new Storage(mem());
  s.data.coins = 1e6;
  assert.ok(!s.garageCars().some((c) => c.id === 'kuzgun'), 'garajda / mağazada yok');
  assert.equal(s.buy('kuzgun'), false, 'satın alınamaz');
  assert.equal(s.data.coins, 1e6);
  assert.ok(!s.data.owned.includes('kuzgun'));
  assert.equal(s.select('kuzgun'), false);
  assert.equal(s.buy('volt'), true, 'diğer arabalar hâlâ satılır');
});

test('kodla açan oyuncuda Kuzgun garajda, seçilir ve silahıyla çalışır; kod bozulmadı', () => {
  for (const code of ['4266', '42-66', ' 42 66 ']) {
    const b = mem();
    const s = new Storage(b);
    assert.equal(s.redeem(code), 'ok', code);
    assert.ok(s.garageCars().some((c) => c.id === 'kuzgun'), 'garajda');
    assert.equal(s.select('kuzgun'), true);
    assert.equal(s.selectedCar().id, 'kuzgun');
    assert.equal(new Storage(b).selectedCar().id, 'kuzgun', 'yeniden açılışta seçili');
    assert.equal(s.redeem('4266'), 'owned');
  }
  const g = new Game(1);
  g.view.w = 1280; g.view.h = 720;
  g.start(KUZGUN, { seed: 3, god: true });
  assert.ok(g.weapon, 'dahili silah');
  for (let i = 0; i < 120; i++) g.tick(dt, 0, false);
  assert.equal(g.state, 'play');
});

test('Kuzguna zaten sahip eski kayıt bozulmaz: sahip, seçili ve garajda kalır', () => {
  const old = { coins: 5, owned: ['atmaca', 'kuzgun', 'volt'], selected: 'kuzgun', paints: { kuzgun: 2 } };
  const s = new Storage(mem(old));
  assert.deepEqual(s.data.owned, ['atmaca', 'kuzgun', 'volt']);
  assert.equal(s.data.selected, 'kuzgun');
  assert.equal(s.paintIndex('kuzgun'), 2);
  assert.ok(s.garageCars().some((c) => c.id === 'kuzgun'));
  assert.deepEqual(sanitize(old).owned, ['atmaca', 'kuzgun', 'volt']);
});

// ---------- METEOR ----------
test('meteor zamanla sıklaşır ve hızlanır (düşüş kısalır); tabanlar kaçış payı bırakır', () => {
  const ts = [MET.at, MET.at + 100, MET.at + 220, MET.at + 370, MET.at + 520, MET.at + 2000];
  const r = ts.map(meteorRate);
  console.log('# meteor', JSON.stringify(ts.map((t, i) => ({ t, every: +r[i].every.toFixed(2), fall: +r[i].fall.toFixed(2), perWave: r[i].perWave }))));
  for (let i = 1; i < 5; i++) {
    assert.ok(r[i].every < r[i - 1].every, 'dalga aralığı kısalır');
    assert.ok(r[i].fall < r[i - 1].fall || r[i].fall === MET.minFall, 'düşüş hızlanır (tabana kadar)');
  }
  assert.ok(r[3].fall < r[0].fall * 0.75, 'belirgin hızlanma');
  assert.ok(r[5].every >= MET.minEvery && r[5].fall >= MET.minFall, 'üst sınır');
  assert.ok(MET.minFall >= 1, 'kilitten sonra en az 1 sn kaçış');
  assert.ok(MET.warn >= 3, 'uyarı süresi kısalmaz');
});

// Uzun düz yol: başlangıçtaki +y ana yol
function straight(car, time, v) {
  const g = new Game(1);
  g.view.w = 1280; g.view.h = 720;
  g.start(car, { seed: 99, startTime: time, god: true });
  const p = g.player;
  p.x = 100; p.y = 300; p.a = Math.PI / 2; p.vx = 0; p.vy = v; p.speed = v;
  g.world.update(p.x, p.y);
  return g;
}

test('kilit anı nişanı = konum + hız x düşüş süresi (seyir hızında); hızlı araba daha ileride; meteor hızlanınca kısalır; önde', () => {
  const out = { x: 0, y: 0, lead: 0 };
  const rows = [];
  for (const car of [CONFIG.cars[0], KUZGUN]) {
    for (const time of [MET.at + 1, MET.at + 400]) {
      const fall = meteorRate(time).fall;
      const v = car.maxSpeed * 0.95;
      const g = straight(car, time, v);
      assert.ok(meteorAim(g, out, fall, { minR: 0 }));
      const d = out.y - g.player.y;
      rows.push({ car: car.id, time, fall: +fall.toFixed(2), v: Math.round(v), d: Math.round(d), want: Math.round(v * fall) });
      assert.ok(d > 0 && Math.abs(out.x - g.player.x) < 100, 'önünde');
      assert.ok(Math.abs(d - meteorLead(v, fall, g.carSpec, 1, g.surfP[g.world.groundAt(100, 300)])) < 25);
      assert.ok(Math.abs(d - v * fall) < v * fall * 0.06, `${car.id}: ${d.toFixed(0)} ~ ${(v * fall).toFixed(0)}`);
    }
  }
  console.log('# kilit anı nişanı', JSON.stringify(rows));
  assert.ok(rows[2].d > rows[0].d + 80, 'Kuzgun daha ileride');
  assert.ok(rows[1].d < rows[0].d, 'meteor hızlanınca (düşüş kısa) nişan daha yakın');
});

test('tepki vermeden düz giden araba (Atmaca, hızlı Kuzgun): asıl meteor üstüne düşer, hiç arkaya düşmez (erken ve geç aşama)', () => {
  const rows = [];
  for (const time of [MET.at + 1, MET.at + 400]) {
    for (const car of [CONFIG.cars[0], KUZGUN]) {
      for (const v of [car.maxSpeed * 0.3, car.maxSpeed * 0.9]) {
        const g = straight(car, time, v);
        g.meteors.waveT = 999;
        g.cops.length = 0;
        assert.ok(g.meteors.spawn(g, true), 'nişan');
        const m = g.meteors.list.find((k) => k.alive && k.main);
        let at = null;
        const imp = g.meteors.impact.bind(g.meteors);
        g.meteors.impact = (game, mm) => { if (mm === m) at = { mx: mm.x, my: mm.y, px: game.player.x, py: game.player.y }; return imp(game, mm); };
        for (let t = 0; t < m.warn + m.fall + 0.2 && !at; t += dt) { g.cops.length = 0; g.crowd.clear(); g.tick(dt, 0, false); } // Trafik ve polis yok: düz yol
        assert.ok(at, 'çarptı');
        const d = Math.hypot(at.mx - at.px, at.my - at.py);
        // Gidiş yönünde (+y) meteorun araca göre konumu: eksi = arkada
        const ahead = at.my - at.py;
        rows.push({ car: car.id, time, v: Math.round(v), d: Math.round(d), ahead: Math.round(ahead), hit: d < MET.radius });
        assert.ok(ahead > -MET.radius, `${car.id} @${time} v${v.toFixed(0)}: meteor ${(-ahead).toFixed(0)} px arkada`);
      }
    }
  }
  console.log('# çarpma anında araba-meteor', JSON.stringify(rows));
  // Yoldaki trafik / engel arabayı yavaşlatırsa meteor biraz önde kalabilir; çoğunda tam üstüne düşer
  assert.ok(rows.filter((r) => r.hit).length >= rows.length - 2, `isabet ${rows.filter((r) => r.hit).length}/${rows.length}`);
});

test('kaçılabilir: kilitten sonra fren yapan ya da direksiyon kıran araba kurtulur (geç aşamada, hızlı arabada da)', () => {
  for (const mode of ['fren', 'don']) {
    for (const car of [CONFIG.cars[0], KUZGUN]) {
      const g = straight(car, MET.at + 400, car.maxSpeed * 0.9);
      g.god = false;
      g.meteors.waveT = 999;
      g.meteors.spawn(g, true);
      const m = g.meteors.list.find((k) => k.alive && k.main);
      for (let t = 0; t < m.warn + m.fall + 0.3 && g.state === 'play'; t += dt) {
        g.cops.length = 0; g.damage = 0;
        g.tick(dt, mode === 'don' && m.falling ? 1 : 0, mode === 'fren' && m.falling);
      }
      assert.notEqual(g.cause, 'meteor', `${mode} ${car.id}`);
    }
  }
});
