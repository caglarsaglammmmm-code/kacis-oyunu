import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';
import { Storage } from '../js/storage.js';

const dt = 1 / 60;
const W = CONFIG.weapon;
const KUZGUN = CONFIG.cars.find((c) => c.weapon);

function setup(car = KUZGUN) {
  const g = new Game(1);
  g.start(car, { seed: 21, startTime: 60, god: true });
  g.runTime = 20;
  return g;
}
function mem() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

test('silah yalnız 60.000 paralık arabada; diğerlerinde ateş edilmez', () => {
  assert.equal(KUZGUN.cost, 60000);
  const g = setup(CONFIG.cars[0]);
  assert.equal(g.weapon, null);
  assert.equal(g.fire(), false);
  const k = setup();
  assert.ok(k.weapon && k.weapon.ammo === W.ammo);
});

test('tek mermi polisi bitirmez: normal 4, motosiklet 3, gelişmiş 5, SWAT 8, tank 16 isabet', () => {
  const want = { car: 4, moto: 3, advanced: 5, swat: 8, tank: 16, fast: 4 };
  for (const [type, hits] of Object.entries(want)) {
    const g = setup();
    const c = g.spawnCop(type, 'chaser', 3000, 3000, 0);
    for (let i = 1; i < hits; i++) {
      g.hitCop(c, c.x, c.y);
      assert.ok(c.hp > 0 && c.mhp > 0, `${type}: ${i}. isabette hâlâ ayakta`);
    }
    g.hitCop(c, c.x, c.y);
    assert.ok(c.hp <= 0, `${type}: ${hits}. isabette etkisiz`);
    assert.equal(W.hp[type] / W.damage, hits);
  }
});

test('son isabette polis patlar ve oyuncuya yazılır', () => {
  const g = setup();
  const c = g.spawnCop('car', 'chaser', g.player.x + 600, g.player.y, 0);
  for (let i = 0; i < 4; i++) g.hitCop(c, c.x, c.y);
  const kills = g.kills;
  g.updateCops(dt);
  assert.ok(!g.cops.includes(c));
  assert.equal(g.kills, kills + 1);
});

test('atış arası bekleme ve sınırlı cephane; zamanla ve kıl payı kaçışla dolar', () => {
  const g = setup();
  const w = g.weapon;
  assert.equal(g.fire(), true);
  assert.equal(g.fire(), false, 'bekleme süresinde atılmaz');
  let shots = 1;
  for (let k = 0; k < 20; k++) {
    w.cd = 0;
    for (const m of g.missiles) m.alive = false;
    if (g.fire()) shots++;
  }
  assert.equal(shots, W.ammo, 'cephane bitince atılmaz');
  assert.equal(w.ammo, 0);
  w.cd = 0;
  assert.equal(g.fire(), false);
  for (let t = 0; t < W.regen + 0.1; t += dt) g.updateWeapon(dt);
  assert.equal(w.ammo, 1, 'zamanla dolar');
  const c = g.spawnCop('car', 'chaser', 5000, 5000, 0);
  g.rewardEscape(c);
  assert.equal(w.ammo, 2, 'kıl payı kaçış cephane verir');
  assert.ok(W.cooldown >= 1.5 && W.cooldown <= 2);
});

test('hedef kilidi öndeki konide en yakın polis; mermi izler ve vurur', () => {
  const g = setup();
  const p = g.player;
  p.a = Math.PI / 2; // Başlangıç yolu +y yönünde uzanır
  const near = g.spawnCop('car', 'chaser', p.x - 30, p.y + 260, 0); // Yol koridoru x 40..110
  g.spawnCop('car', 'chaser', p.x - 30, p.y + 520, 0);
  const behind = g.spawnCop('car', 'chaser', p.x - 30, p.y - 150, 0);
  assert.equal(g.findLock(), near);
  g.weapon.lock = near;
  g.fire();
  const m = g.missiles.find((k) => k.alive);
  near.x -= 25; near.y += 40; // Hedef kaçsa da mermi döner
  let hit = false;
  for (let t = 0; t < W.life && m.alive; t += dt) {
    g.stepMissile(m, dt);
    if (near.mhp < W.hp.car) hit = true;
  }
  assert.ok(hit, 'izleyip vurdu');
  assert.equal(behind.mhp, W.hp.car, 'arkadaki polis etkilenmez');
});

test('duvara çarpan mermi kaybolur; aynı anda en çok 4 mermi', () => {
  const g = setup();
  const p = g.player;
  let wall = null;
  for (let cx = 1; !wall; cx++) {
    const c = g.world.chunk(cx, 1);
    for (let i = 0; i < c.rectCount; i++) if (c.rects[i].kind === 'building' && c.rects[i].w > 80) { wall = c.rects[i]; break; }
  }
  p.x = wall.x - 120; p.y = wall.y + wall.h / 2; p.a = 0; p.vx = 0; p.vy = 0;
  g.weapon.lock = null;
  g.fire();
  const m = g.missiles.find((k) => k.alive);
  let steps = 0;
  while (m.alive && steps++ < 200) g.stepMissile(m, dt);
  assert.equal(m.alive, false);
  assert.ok(m.x < wall.x + 30, 'binanın içinden geçmedi');
  assert.equal(g.missiles.length, W.maxMissiles);
  assert.ok(W.maxMissiles <= 4);
  for (const k of g.missiles) { k.alive = true; }
  g.weapon.cd = 0;
  assert.equal(g.fire(), false, 'havuz doluyken yeni mermi yok');
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
});

test('gizli kod hile açıkken de çalışır ve parayı değiştirmez', () => {
  const s = new Storage(mem());
  s.data.coins = 123;
  const g = setup(CONFIG.cars[0]);
  g.toggleCheat();
  assert.equal(s.redeem('4266'), 'ok');
  assert.equal(s.data.coins, 123);
});
