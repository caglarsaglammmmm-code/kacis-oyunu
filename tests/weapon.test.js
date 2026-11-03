import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';
import { Storage } from '../js/storage.js';

const dt = 1 / 60;
const W = CONFIG.weapon;
const KUZGUN = CONFIG.cars.find((c) => c.weapon);

function setup(car = KUZGUN, startTime = 0) {
  const g = new Game(1);
  g.start(car, { seed: 21, startTime, god: true });
  g.runTime = 20;
  return g;
}
function mem() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

test('silah yalnız 60.000 paralık arabada; diğerlerinde ateş edilmez; cephane alanı yok', () => {
  assert.equal(KUZGUN.cost, 60000);
  const g = setup(CONFIG.cars[0]);
  assert.equal(g.weapon, null);
  assert.equal(g.fire(), false);
  const k = setup();
  assert.ok(k.weapon && !('ammo' in k.weapon), 'sınırsız cephane');
  assert.equal(W.fireEvery, 3.0);
});

// Oyunun başında (0. dakika) gereken isabet
const hitsToKill = (type, t = 0) => {
  const g = setup(KUZGUN, t);
  const c = g.spawnCop(type, 'chaser', 3000, 3000, 0);
  let n = 0;
  while (c.mhp > 0 && n < 200) { g.hitCop(c, c.x, c.y); n++; if (c.mhp > 0) assert.ok(c.hp > 0, `${type}: ${n}. isabette ayakta`); }
  assert.ok(c.hp <= 0, `${type}: son isabette etkisiz`);
  return n;
};

test('normal polis başta 4-5 isabette gider; SWAT ve tank çok daha dayanıklı ve az hasar alır', () => {
  const rows = {};
  for (const t of ['car', 'fast', 'moto', 'advanced', 'swat', 'tank', 'rover', 'ufo']) rows[t] = hitsToKill(t);
  console.log('# 0. dakikada gereken isabet', JSON.stringify(rows));
  assert.ok(rows.car >= 4 && rows.car <= 5, `normal ${rows.car}`);
  assert.ok(rows.fast >= 4 && rows.fast <= 5);
  assert.ok(rows.car > 1, 'tek atışta ölmez');
  assert.ok(rows.swat >= 15 && rows.swat <= 22, `SWAT ${rows.swat}`);
  assert.ok(rows.tank > rows.swat);
  assert.ok(W.hp.swat >= W.hp.car * 3 && W.hp.swat <= W.hp.car * 4, 'SWAT canı normalin 3-4 katı');
  assert.ok(W.armor.swat < 1 && W.armor.tank < 1, 'zırhlıya az hasar');
});

test('son isabette polis patlar ve oyuncuya yazılır', () => {
  const g = setup();
  const c = g.spawnCop('car', 'chaser', g.player.x + 600, g.player.y, 0);
  while (c.mhp > 0) g.hitCop(c, c.x, c.y);
  const kills = g.kills;
  g.updateCops(dt);
  assert.ok(!g.cops.includes(c));
  assert.equal(g.kills, kills + 1);
});

test('otomatik ateş: eşit ~3 sn aralık, sınırsız cephane (10+ atış), hedef yoksa atmaz, Boşluk aralığı kısaltmaz', () => {
  const g = setup();
  const p = g.player;
  p.a = Math.PI / 2;
  const w = g.weapon;
  g.cops.length = 0;
  // Hedef yokken atış yok
  for (let t = 0; t < 5; t += dt) g.updateWeapon(dt);
  assert.equal(w.shots, 0, 'hedef yokken ateş yok');
  assert.ok(w.cd <= 0, 'süre doldu, hazır');
  // Hedef çıkar: aynı karede atılır
  const c = g.spawnCop('car', 'chaser', p.x - 30, p.y + 300, 0);
  g.updateWeapon(dt);
  assert.equal(w.shots, 1, 'hedef çıkınca hemen');
  assert.equal(g.fire(), false, 'Boşluk bekleme süresinde atmaz');
  const at = [0];
  let time = 0;
  for (let k = 0; k < 60 * 40; k++) {
    c.x = p.x - 30; c.y = p.y + 300; c.mhp = c.mhpMax; c.hp = c.maxHp; // Hedef ölmesin
    const before = w.shots;
    g.updateWeapon(dt); time += dt;
    if (w.shots > before) at.push(time);
    if (k === 60) assert.equal(g.fire(), false, 'Boşluk aralığı kısaltmaz');
  }
  const gaps = at.slice(1).map((v, i) => v - at[i]);
  console.log('# atış aralıkları (sn)', gaps.map((x) => x.toFixed(3)).join(' '));
  assert.ok(w.shots >= 11, `10+ atış: ${w.shots}`);
  for (const gp of gaps) assert.ok(Math.abs(gp - W.fireEvery) <= dt * 1.01, `aralık ${gp}`);
  assert.ok(g.missiles.filter((m) => m.alive).length <= W.maxMissiles);
});

test('zamanla yeni polislerin canı artar (tavanlı); sahadakiler değişmez', () => {
  const g = setup(KUZGUN, 0);
  const old = g.spawnCop('car', 'chaser', 3000, 3000, 0);
  const row = {};
  for (const min of [0, 2, 5, 10, 20]) {
    g.time = min * 60;
    const c = g.spawnCop('car', 'chaser', 3000, 3000, 0);
    const s = g.spawnCop('swat', 'chaser', 3000, 3000, 0);
    row[min] = { car: +c.mhpMax.toFixed(1), swat: +s.mhpMax.toFixed(1), carHits: Math.ceil(c.mhpMax / W.damage - 1e-9), swatHits: Math.ceil(s.mhpMax / (W.damage * W.armor.swat) - 1e-9) };
  }
  console.log('# dakikaya göre yeni polis canı', JSON.stringify(row));
  assert.equal(row[0].car, W.hp.car);
  assert.ok(row[2].car > row[0].car && row[5].car > row[2].car && row[10].car > row[5].car);
  assert.ok(row[2].swat > row[0].swat && row[5].swat > row[2].swat);
  const perMin = row[2].car / row[0].car;
  assert.ok(perMin > 1.2 && perMin < 1.33, 'dakikada %10-15');
  assert.equal(row[20].car, W.hp.car * CONFIG.copHpGrowth.max, 'tavan');
  assert.equal(old.mhpMax, W.hp.car, 'sahadaki polis değişmedi');
  assert.ok(row[5].carHits > row[0].carHits, 'ilerleyen dakikada daha çok isabet');
});

test('kıl payı kaçış ödülü silahlı arabada da çalışır', () => {
  const g = setup();
  const c = g.spawnCop('car', 'chaser', 5000, 5000, 0);
  const coins = g.coins;
  g.rewardEscape(c);
  assert.ok(g.coins > coins);
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
    if (near.mhp < near.mhpMax) hit = true;
  }
  assert.ok(hit, 'izleyip vurdu');
  assert.equal(behind.mhp, behind.mhpMax, 'arkadaki polis etkilenmez');
});

test('duvara çarpan mermi kaybolur; aynı anda en çok 3-4 mermi', () => {
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
  assert.ok(W.maxMissiles >= 3 && W.maxMissiles <= 4);
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
