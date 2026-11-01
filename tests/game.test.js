import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { Game, difficultyAt, damageStage, impactDamage, interp } from '../js/game.js';

const dt = 1 / 60;
const car = CONFIG.cars[0];
const DMG = CONFIG.damage;

function game(opts = {}) {
  const g = new Game(1);
  g.start(car, { seed: 99, startTime: 0, god: false, ...opts });
  return g;
}

test('zorluk eşikleri: 50, 200, 280', () => {
  assert.equal(difficultyAt(49.9).stage, 0);
  assert.equal(difficultyAt(50).stage, 1);
  assert.equal(difficultyAt(199).stage, 1);
  assert.equal(difficultyAt(200).stage, 2);
  assert.equal(difficultyAt(280).stage, 3);
  assert.equal(difficultyAt(10).swatShare, 0, '50 sn öncesi SWAT yok');
  assert.equal(difficultyAt(199).advancedShare, 0, '200 sn öncesi gelişmiş yok');
  assert.equal(difficultyAt(279).tanks, 0, '280 sn öncesi tank yok');
  assert.ok(difficultyAt(280).tanks >= 1);
});

test('yıldızlar eşiklerde artar', () => {
  assert.deepEqual([0, 50, 200, 280].map((t) => difficultyAt(t).stars), [1, 2, 3, 4]);
});

test('zorluk 50-200 arasında her saniye artar, azalmaz', () => {
  for (let t = 50; t < 200; t++) {
    const a = difficultyAt(t);
    const b = difficultyAt(t + 1);
    assert.ok(b.hpMul > a.hpMul, `hp ${t}`);
    assert.ok(b.power > a.power);
    assert.ok(b.aggression > a.aggression);
    assert.ok(b.spawnInterval < a.spawnInterval);
    assert.ok(b.maxPolice >= a.maxPolice);
  }
});

test('üst sınır aşılmaz', () => {
  assert.ok(difficultyAt(10000).maxPolice <= CONFIG.difficulty.maxActive);
  assert.equal(interp([[0, 1], [10, 3]], 5), 2);
  assert.equal(interp([[0, 1], [10, 3]], 50), 3);
});

test('polisler her arabadan yavaş', () => {
  for (const c of CONFIG.cars) {
    for (const [k, p] of Object.entries(CONFIG.police)) {
      assert.ok(c.maxSpeed * p.speed < c.maxSpeed, k);
      assert.ok(p.speed < 1, k);
    }
  }
});

test('hasar aşamaları sırayla: hafif duman, yoğun, ateş, patlama', () => {
  const s = DMG.stages;
  assert.deepEqual([0, s[0], s[1], s[2], s[3]].map(damageStage), [0, 1, 2, 3, 4]);
});

test('hasar çarpma hızına göre artar, tek darbe öldürmez', () => {
  assert.equal(impactDamage(50, 1, 1, 100), 0);
  const a = impactDamage(200, 1, 1, 100);
  const b = impactDamage(350, 1, 1, 100);
  assert.ok(b > a && a > 0);
  assert.ok(impactDamage(5000, 1, 3, 100) <= DMG.maxSingleHit);
  assert.ok(DMG.maxSingleHit < 100 / 2, 'en az üç darbe gerekir');
  assert.ok(impactDamage(300, 1.6, 1, 100) < impactDamage(300, 1, 1, 100), 'sağlam araba az hasar');
  assert.ok(impactDamage(300, 1, 1, 10) < impactDamage(300, 1, 1, 100), 'ilk 30 sn tolerans');
});

test('ateş: yeni darbe yoksa söner ve yalnızca alt sınıra kadar iyileşir', () => {
  const g = game();
  g.time = 100;
  g.damage = DMG.stages[2] + 1;
  for (let i = 0; i < 60 * 30; i++) g.updateDamage(dt);
  assert.equal(g.state, 'play');
  assert.ok(g.damage >= DMG.regenFloor - 0.01, `hasar ${g.damage}`);
  assert.ok(g.damage < DMG.stages[2], 'ateş söndü');
});

test('ateşte yeni darbe sayacı başa alır, hasar 100 olunca patlar ve bitiş ekranı gelir', () => {
  const g = game();
  const events = [];
  g.onEvent = (n) => events.push(n);
  g.damage = 95;
  for (let i = 0; i < 5; i++) { g.hurt(5); g.updateDamage(dt); }
  assert.equal(g.state, 'dying');
  assert.ok(events.includes('explosion'));
  g.player.speed = 0;
  for (let i = 0; i < 60 * 2.5; i++) g.tick(dt, 0, false);
  assert.equal(g.state, 'over');
  assert.ok(events.includes('gameover'));
  assert.ok(g.result.time >= 0);
});

test('temiz sürüş çok yavaş toparlar, ateş görmüş arabayı iyileştirmez', () => {
  const g = game();
  g.damage = 50;
  g.sinceHit = 0;
  for (let i = 0; i < 60 * 40; i++) g.updateDamage(dt);
  assert.ok(g.damage < 50 && g.damage > 30, `hasar ${g.damage}`);
  g.damage = DMG.regenFloor;
  g.sinceHit = 60;
  for (let i = 0; i < 60 * 60; i++) g.updateDamage(dt);
  assert.equal(g.damage, DMG.regenFloor);
  g.damage = 20;
  for (let i = 0; i < 60 * 60; i++) g.updateDamage(dt);
  assert.equal(g.damage, DMG.idleRegenFloor, 'tam sağlığa dönmez');
});

test('ölümsüzlük hasarı engeller', () => {
  const g = game({ god: true });
  g.hurt(500);
  assert.equal(g.damage, 0);
});

test('binaya tam gaz çarpma hasar verir ama öldürmez', () => {
  const g = game({ startTime: 100 });
  // Binaya doğru sür
  let c;
  for (let cx = 1; !c; cx++) {
    const k = g.world.chunk(cx, 1);
    for (let i = 0; i < k.rectCount; i++) if (k.rects[i].kind === 'building') { c = k.rects[i]; break; }
  }
  g.player.x = c.x - 70;
  g.player.y = c.y + 20;
  g.player.a = 0;
  g.player.vx = 360;
  g.player.vy = 0;
  for (let i = 0; i < 12; i++) g.tick(dt, 0, false);
  assert.ok(g.damage > 5, `hasar ${g.damage}`);
  assert.ok(g.damage <= DMG.maxSingleHit);
  assert.equal(g.state, 'play');
});

test('skor süre, kırılan nesne ve drift ile artar; combo sınırlı', () => {
  const g = game();
  for (let i = 0; i < 120; i++) g.tick(dt, 0, false);
  const s = g.score;
  assert.ok(s > 15);
  g.bumpCombo(99);
  assert.equal(g.combo, CONFIG.score.comboMax);
  g.addScore(10);
  assert.ok(g.score >= s + 50);
  for (let i = 0; i < 60 * 4; i++) g.updateScore(dt);
  assert.equal(g.combo, 1, 'combo zamanla sıfırlanır');
});

test('uyarı olayı eşik geçilince bir kez gelir', () => {
  const g = game({ startTime: 49.5, god: true });
  const alerts = [];
  g.onEvent = (n, v) => { if (n === 'alert') alerts.push(v); };
  for (let i = 0; i < 60; i++) g.tick(dt, 0, false);
  assert.deepEqual(alerts, [1]);
});

test('coin toplanır', () => {
  const g = game();
  g.world.dropCoin(g.player.x + 40, g.player.y);
  g.tick(dt, 0, false);
  assert.equal(g.coins, 1);
});

test('kırılabilir nesne hızlı temasta kırılır, sayaç artar', () => {
  const g = game();
  const c = g.world.chunk(0, 0);
  g.world.addProp(c, 2, g.player.x, g.player.y + 30);
  g.player.vy = 300;
  g.player.speed = 300;
  g.tick(dt, 0, false);
  assert.equal(g.broken, 1);
});

test('dört güç: can, görünmezlik, dev mod, patlama', () => {
  const g = game({ startTime: 100 });
  const P = CONFIG.powers;
  g.damage = 90; g.burning = true;
  g.takePower('heal', 0, 0);
  assert.equal(g.damage, 90 - P.healAmount);
  assert.equal(g.burning, false);

  g.takePower('ghost', 0, 0);
  assert.equal(g.ghostT, P.duration);
  g.takePower('giant', 0, 0);
  assert.equal(g.giantT, P.duration);
  assert.ok(g.player.len > car.len * 1.5);
  const d = g.damage;
  g.hurt(50);
  assert.equal(g.damage, d, 'dev modda hasar yok');
  for (let i = 0; i < 60 * 31; i++) g.updatePowers(dt);
  assert.equal(g.ghostT, 0);
  assert.equal(g.giantT, 0);
  assert.equal(g.player.len, car.len, 'boyut geri döner');
});

test('patlama yakındaki araçları yok eder, uzaktakine ve tanka tam işlemez', () => {
  const g = game({ startTime: 100, god: true });
  const p = g.player;
  g.spawnCop('car', 'chaser', p.x + 100, p.y, 0);
  g.spawnCop('swat', 'chaser', p.x - 200, p.y, 0);
  const far = g.spawnCop('car', 'chaser', p.x + 900, p.y, 0);
  const tank = g.spawnCop('tank', 'chaser', p.x, p.y + 200, 0);
  g.takePower('blast', p.x, p.y);
  assert.deepEqual(g.cops.map((c) => c.type).sort(), ['car', 'tank']);
  assert.ok(g.cops.includes(far) && g.cops.includes(tank));
  assert.ok(tank.hp < tank.maxHp);
  assert.ok(g.kills >= 2);
});

test('görünmezken polis oyuncuya yönelmez ve çarpamaz, dev modda polis ezilir', () => {
  const g = game({ startTime: 100 });
  const p = g.player;
  g.ghostT = 30;
  const c = g.spawnCop('car', 'chaser', p.x + 30, p.y, 0);
  g.updateCops(dt);
  assert.equal(g.damage, 0);
  g.ghostT = 0;
  g.takePower('giant', 0, 0);
  g.copContact(c, 200);
  g.updateCops(dt);
  assert.equal(g.damage, 0);
  assert.ok(!g.cops.includes(c));
});

test('haritadaki güç alınır, kalıcı olarak kaybolur', () => {
  const g = game();
  const ev = [];
  g.onEvent = (n, v) => { if (n === 'power') ev.push(v); };
  g.world.addPower(g.player.x + 30, g.player.y, 19);
  g.damage = 50;
  g.tick(dt, 0, false);
  assert.deepEqual(ev, ['heal']);
  assert.ok(g.damage < 50);
});

test('polis çeşitleri zamana göre gelir, şekil ve hızları farklı', () => {
  assert.equal(difficultyAt(10).motoShare, 0);
  assert.equal(difficultyAt(20).fastShare, 0);
  assert.ok(difficultyAt(60).motoShare > 0 && difficultyAt(60).fastShare > 0);
  const P = CONFIG.police;
  assert.ok(new Set(Object.values(P).map((p) => p.speed)).size >= 5);
  assert.ok(new Set(Object.values(P).map((p) => p.len)).size >= 5);
  const g = game({ startTime: 120 });
  const seen = new Set();
  for (let i = 0; i < 400; i++) seen.add(g.pickType(Math.random()));
  for (const t of ['car', 'fast', 'moto', 'swat']) assert.ok(seen.has(t), t);
});

test('yayalar doğar, araba çarpınca fırlar ve ses olayı gelir', () => {
  const g = game();
  const ev = [];
  g.onEvent = (n) => ev.push(n);
  for (let i = 0; i < 60 * 12; i++) g.tick(dt, 0, false);
  const live = g.crowd.peds.filter((p) => p.alive);
  assert.ok(live.length > 3, `yaya ${live.length}`);
  const p = live[0];
  p.state = 0; p.z = 0;
  p.x = g.player.x + 10; p.y = g.player.y;
  g.player.vx = 300; g.player.speed = 300;
  g.crowd.checkHit(p, g.player, true);
  assert.equal(p.state, 2);
  assert.ok(p.vz > 0);
  assert.ok(ev.includes('thud'));
  for (let i = 0; i < 60 * 2; i++) g.crowd.updatePed(p, dt);
  assert.ok(p.z === 0);
});

test('sivil arabalar ana yolda şeridinde gider, çarpılınca savrulur', () => {
  const g = game({ god: true });
  g.player.vy = 0;
  for (let i = 0; i < 60 * 14; i++) g.tick(dt, 0, true);
  const live = g.crowd.npcs.filter((n) => n.alive);
  assert.ok(live.length >= 2, `araç ${live.length}`);
  const kinds = new Set();
  for (let i = 0; i < 300; i++) { g.crowd.npcT = 0; g.crowd.update(dt); g.crowd.npcs.forEach((n) => { if (n.alive) { kinds.add(n.kind); n.alive = i > 290; } }); }
  assert.ok(kinds.size >= 3, [...kinds].join());
  for (const n of g.crowd.npcs) n.alive = false;
  g.crowd.npcCount = 0;
  g.crowd.npcT = 1e9;
  g.crowd.spawnNpc();
  let n = g.crowd.npcs.find((k) => k.alive);
  for (let tries = 0; !n && tries < 50; tries++) { g.crowd.spawnNpc(); n = g.crowd.npcs.find((k) => k.alive); }
  assert.ok(n);
  const w0 = n.w;
  g.crowd.hitNpc(n, 300, false);
  assert.equal(n.state, 'wreck');
  assert.notEqual(n.w, w0);
});

test('uzun simülasyon: tüm süreler boyunca hata yok, polis sınırı aşılmaz, efekt havuzu sınırlı', () => {
  const g = game({ god: true });
  let maxCops = 0;
  let steer = 1;
  for (let i = 0; i < 60 * 420; i++) {
    if (i % 90 === 0) steer = [-1, 0, 1, 0][(i / 90) % 4];
    g.tick(dt, steer, i % 700 < 40);
    maxCops = Math.max(maxCops, g.cops.length);
    for (const k of [g.player.x, g.player.y, g.player.vx, g.score]) assert.ok(Number.isFinite(k));
  }
  assert.ok(maxCops <= CONFIG.difficulty.maxActive, `${maxCops}`);
  assert.ok(maxCops >= 8, `en çok polis ${maxCops}`);
  assert.ok(g.kills > 0 || g.broken > 0);
  assert.ok(g.world.chunks.size <= 100);
  assert.ok(g.copPool.length + g.cops.length < 80, 'havuz büyümez');
});
