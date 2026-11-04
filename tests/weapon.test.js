// 360° otomatik taramalı silah (js/gun.js): 42-66 arabası ve gizli motosiklet aynı bileşeni kullanır
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';
import { Storage } from '../js/storage.js';
import { AutoGun, gunHp, gunFirstAt, bulletsToKill } from '../js/gun.js';

const dt = 1 / 60;
const W = CONFIG.weapon;
const KUZGUN = CONFIG.cars.find((c) => c.weapon);
const GOLGE = CONFIG.secretCar;
const ARMED = [KUZGUN, GOLGE];

function setup(car = KUZGUN, startTime = 0) {
  const g = new Game(1);
  g.view.w = 1280; g.view.h = 720;
  g.start(car, { seed: 21, startTime, god: true });
  g.runTime = 20;
  g.player.vx = 0; g.player.vy = 0; g.player.speed = 0;
  g.cam.x = g.player.x; g.cam.y = g.player.y; g.cam.lvx = 0; g.cam.lvy = 0;
  g.updateCamera(1);
  g.cam.x = g.player.x; g.cam.y = g.player.y;
  return g;
}
// Sabit hedef: kendi kendine hareket etmez
const target = (g, type, dx, dy) => { const c = g.spawnCop(type, 'chaser', g.player.x + dx, g.player.y + dy, 0); c.vx = 0; c.vy = 0; return c; };
const fireFor = (g, sec) => { for (let t = 0; t < sec; t += dt) { g.cam.x = g.player.x; g.cam.y = g.player.y; g.gun.update(g, dt); } };
function mem() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

test('silah yalnız 42-66 arabasında ve gizli motosiklette; ikisi de aynı ortak bileşen; cephane alanı yok', () => {
  assert.equal(CONFIG.cars.filter((c) => c.weapon).length, 1, 'satılık arabalarda tek silahlı');
  assert.equal(KUZGUN.id, 'kuzgun');
  assert.equal(GOLGE.weapon, true);
  assert.equal(setup(CONFIG.cars[0]).weapon, null, 'diğer arabalarda silah yok');
  for (const car of ARMED) {
    const g = setup(car);
    assert.ok(g.weapon instanceof AutoGun, car.id);
    assert.ok(!('ammo' in g.weapon), 'sınırsız cephane');
  }
  assert.equal(typeof new Game(1).fire, 'undefined', 'eski füze ve ateş düğmesi kalktı');
  assert.ok(W.rate >= 5 && W.rate <= 10);
});

// Her tür ilk çıktığı anda: gerçek ateşle kaç mermide ölür
function bulletsFor(car, type) {
  const g = setup(car, gunFirstAt(type));
  const c = target(g, type, 320, 0);
  const before = g.gun.hits;
  for (let t = 0; t < 40 && g.cops.includes(c) && c.mhp > 0; t += dt) {
    g.cam.x = g.player.x; g.cam.y = g.player.y;
    g.gun.update(g, dt);
    if (c.mhp > 0) assert.ok(c.hp > 0, `${type}: ölmeden önce ayakta`);
  }
  assert.ok(c.mhp <= 0, `${type}: öldü`);
  return g.gun.hits - before;
}

test('mermi sayıları: polis ~20-25, SWAT ~50-60, uzaylı ~70-90, tank en az 100 (iki araçta aynı)', () => {
  const table = {};
  for (const car of ARMED) {
    const row = {};
    for (const t of ['car', 'fast', 'moto', 'advanced', 'swat', 'dart', 'blob', 'crab', 'tank']) row[t] = bulletsFor(car, t);
    table[car.id] = row;
  }
  console.log('# türün ilk çıktığı anda gereken mermi', JSON.stringify(table));
  assert.deepEqual(table.kuzgun, table.golge, 'iki araç aynı silah');
  const r = table.kuzgun;
  assert.ok(r.car >= 20 && r.car <= 25, `polis ${r.car}`);
  assert.ok(r.fast >= 20 && r.fast <= 25);
  assert.ok(r.swat >= 50 && r.swat <= 60, `SWAT ${r.swat}`);
  for (const a of ['dart', 'blob', 'crab']) assert.ok(r[a] >= 70 && r[a] <= 90, `${a} ${r[a]}`);
  assert.ok(r.tank >= 100, `tank ${r.tank}`);
  assert.ok(r.car < r.swat && r.swat < Math.min(r.dart, r.blob, r.crab) && Math.max(r.dart, r.blob, r.crab) < r.tank, 'güç sırası');
  for (const [t, n] of Object.entries(r)) assert.equal(n, bulletsToKill(t), t);
});

test('saniyede ~7 mermi, düzenli; cephane sınırsız (300+ mermi)', () => {
  for (const car of ARMED) {
    const g = setup(car);
    const c = target(g, 'tank', 300, 120);
    let shots = 0;
    const at = [];
    for (let k = 0; k < 60 * 45; k++) {
      c.mhp = c.mhpMax; c.hp = c.maxHp; // Hedef ölmesin
      const before = g.gun.shots;
      g.cam.x = g.player.x; g.cam.y = g.player.y;
      g.gun.update(g, dt);
      if (g.gun.shots > before) at.push(k * dt);
      shots = g.gun.shots;
    }
    const span = at.at(-1) - at[0];
    const rate = (at.length - 1) / span;
    console.log(`# ${car.id}: ${at.length} mermi, ${rate.toFixed(2)} / sn`);
    assert.ok(Math.abs(rate - W.rate) < 0.25, `hız ${rate}`);
    assert.ok(shots > 300, 'sınırsız');
  }
});

test('360°: araç hangi yöne bakarsa baksın ekrandaki her yöndeki düşmana ateş eder; ekran dışındakine etmez', () => {
  for (const car of ARMED) {
    for (const heading of [0, Math.PI / 2, Math.PI, -Math.PI / 2, 2.4]) {
      const g = setup(car);
      g.player.a = heading;
      const ring = [];
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        ring.push(target(g, 'tank', Math.cos(a) * 200, Math.sin(a) * 160));
      }
      const off = target(g, 'tank', g.cam.halfW + 260, 0); // Ekranın dışında
      const behind = target(g, 'tank', 0, -(g.cam.halfH + 200)); // Ekranın arkasında (üstünde)
      fireFor(g, 4);
      for (const c of ring) assert.ok(c.mhp < c.mhpMax, `${car.id} yön ${heading.toFixed(1)}: ekrandaki her hedef vuruldu`);
      assert.equal(off.mhp, off.mhpMax, 'ekran dışına ateş yok');
      assert.equal(behind.mhp, behind.mhpMax, 'ekranın arkasına ateş yok');
    }
  }
});

test('hedef dağılımı: hepsini sırayla tarar, en tehlikeli ve yakına biraz öncelik, tek hedefe takılmaz', () => {
  const g = setup();
  const near = target(g, 'tank', 150, 0);
  const far = target(g, 'car', -400, 200);
  const mid = target(g, 'swat', 0, -250);
  const hits = new Map([[near, 0], [far, 0], [mid, 0]]);
  for (let k = 0; k < 60 * 6; k++) {
    for (const c of hits.keys()) { if (c.mhp < c.mhpMax) hits.set(c, hits.get(c) + 1); c.mhp = c.mhpMax; c.hp = c.maxHp; }
    g.cam.x = g.player.x; g.cam.y = g.player.y;
    g.gun.update(g, dt);
  }
  const total = [...hits.values()].reduce((a, b) => a + b, 0);
  console.log('# isabet dağılımı (yakın tank, uzak polis, SWAT)', [...hits.values()].join(' / '));
  for (const [c, n] of hits) assert.ok(n / total > 0.15, `${c.type} de taranır`);
  assert.ok(hits.get(near) > hits.get(far), 'yakın ve tehlikeli önce');
  assert.ok(hits.get(near) / total < 0.6, 'tek hedefe takılmaz');
});

test('ölen düşman çizgi film patlamasıyla gider ve oyuncuya yazılır; isabette kıvılcım ve yanıp sönme', () => {
  const g = setup();
  const c = target(g, 'car', 260, 0);
  const kills = g.kills;
  let flashed = false;
  for (let t = 0; t < 6 && g.cops.includes(c); t += dt) {
    g.cam.x = g.player.x; g.cam.y = g.player.y;
    g.gun.update(g, dt);
    if (c.hurtFlash > 0) flashed = true;
    g.updateCops(dt);
    c.vx = 0; c.vy = 0;
  }
  assert.ok(flashed, 'yanıp sönme');
  assert.ok(!g.cops.includes(c), 'patladı');
  assert.equal(g.kills, kills + 1);
});

test('zamanla yeni düşmanların canı artar (tavanlı), ilk çıkıştaki sayının altına inmez; sahadakiler değişmez', () => {
  const row = {};
  for (const min of [0, 2, 5, 10, 30]) {
    row[min] = { car: bulletsToKill('car', min * 60), swat: bulletsToKill('swat', gunFirstAt('swat') + min * 60), tank: bulletsToKill('tank', gunFirstAt('tank') + min * 60) };
  }
  console.log('# türün çıkışından sonraki dakikaya göre mermi', JSON.stringify(row));
  assert.ok(row[2].car > row[0].car && row[5].car > row[2].car && row[10].car > row[5].car);
  assert.ok(row[5].tank > row[0].tank);
  assert.equal(gunHp('car', 3600), W.hp.car * CONFIG.copHpGrowth.max, 'tavan');
  for (const t of Object.keys(W.hp)) assert.ok(bulletsToKill(t, 0) >= bulletsToKill(t), `${t} alt sınır`);
  const g = setup(KUZGUN, 0);
  const old = g.spawnCop('car', 'chaser', 3000, 3000, 0);
  g.time = 600;
  g.spawnCop('car', 'chaser', 3000, 3000, 0);
  assert.equal(old.mhpMax, W.hp.car, 'sahadaki polis değişmedi');
});

test('mermi anıt alanına, gizli geçide ve stadyuma girince kaybolur; o alanların ardındaki hedefe nişan alınmaz', () => {
  const g = setup();
  for (const z of g.world.zones()) {
    const b = g.gun.bullets[0];
    Object.assign(b, { alive: true, x: z.x - 60, y: z.y + z.h / 2, px: z.x - 60, py: z.y + z.h / 2, vx: W.speed, vy: 0, t: 0 });
    let steps = 0;
    while (b.alive && steps++ < 30) g.gun.step(g, b, dt);
    assert.equal(b.alive, false, z.kind);
    assert.ok(b.x < z.x + 30, `${z.kind}: kenarda kayboldu`);
  }
  const m = g.world.zone('memorial');
  g.player.x = m.x - 200; g.player.y = m.y + m.h / 2;
  g.cam.x = g.player.x; g.cam.y = g.player.y;
  const across = g.spawnCop('car', 'chaser', m.x + m.w + 60, m.y + m.h / 2, 0);
  assert.equal(g.gun.pick(g), null, 'anıtın arkasındaki hedef seçilmez');
  assert.ok(across);
});

test('kıl payı kaçış ödülü silahlı araçlarda da çalışır', () => {
  for (const car of ARMED) {
    const g = setup(car);
    const c = g.spawnCop('car', 'chaser', 5000, 5000, 0);
    const coins = g.coins;
    g.rewardEscape(c);
    assert.ok(g.coins > coins);
  }
});

test('gizli kod: 42-66, 4266 ve 42 66 arabayı açar; yanlış kod açmaz; ikinci girişte zaten sende; yeniden açılışta kalır', () => {
  for (const code of ['42-66', '4266', '42 66', ' 42 - 66 ']) {
    const b = mem();
    const s = new Storage(b);
    assert.equal(s.redeem('1234'), 'invalid');
    assert.equal(s.redeem(''), 'invalid');
    assert.ok(!s.data.owned.includes('kuzgun'));
    assert.equal(s.redeem(code), 'ok', code);
    assert.ok(s.data.owned.includes('kuzgun'));
    assert.equal(s.redeem('4266'), 'owned');
    const again = new Storage(b);
    assert.ok(again.data.owned.includes('kuzgun'), 'kalıcı');
  }
  assert.ok(CONFIG.codes.every((k) => k.code && k.car), 'kod tablosu');
  assert.ok(!CONFIG.codes.some((k) => k.car === GOLGE.id), 'gizli motosiklet kodla açılmaz');
});

test('gizli kod hile açıkken de çalışır ve parayı değiştirmez', () => {
  const s = new Storage(mem());
  s.data.coins = 123;
  const g = setup(CONFIG.cars[0]);
  g.toggleCheat();
  assert.equal(s.redeem('4266'), 'ok');
  assert.equal(s.data.coins, 123);
});
