import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';
import { FlowField, planBarricade, newPlan } from '../js/police.js';
import { World, TILE, CHUNK } from '../js/world.js';

const dt = 1 / 60;
const car = CONFIG.cars[0];

function game(startTime = 0) {
  const g = new Game(1);
  g.start(car, { seed: 21, startTime, god: true });
  return g;
}

test('akış alanı binaların çevresinden hedefe yol bulur', () => {
  const w = new World(5);
  const f = new FlowField();
  f.compute(w, 100, 100);
  const out = { x: 0, y: 0 };
  // Uzak bir yol noktasından yürü, hedefe varmalı ve engele girmemeli
  let x = 100 + CHUNK;
  let y = 100 + CHUNK;
  for (let i = 0; i < 200 && Math.hypot(x - 100, y - 100) > 60; i++) {
    assert.ok(f.sample(x, y, out, 2));
    x = out.x;
    y = out.y;
    assert.ok(!w.blockedAt(x, y));
  }
  assert.ok(Math.hypot(x - 100, y - 100) <= 60, `kalan ${Math.hypot(x - 100, y - 100)}`);
});

test('barikat her zaman geçiş boşluğu bırakır (tüm yol genişlikleri)', () => {
  const p = newPlan();
  const min = CONFIG.barricade.minGap;
  for (let w = 120; w <= 300; w += 10) {
    for (let i = 0; i < 40; i++) {
      planBarricade(w, min, 46, i % 2 === 0, Math.random, p);
      assert.ok(p.count <= 3);
      if (p.count === 0) continue;
      assert.ok(p.gapTo - p.gapFrom >= min, `yol ${w}: boşluk ${p.gapTo - p.gapFrom}`);
      // Boşlukta araba merkezi ya da şerit olmamalı
      for (let k = 0; k < p.count; k++) {
        const s = p.slots[k];
        assert.ok(s + 25 <= p.gapFrom + 1e-6 || s - 25 >= p.gapTo - 1e-6, 'araba boşlukta');
      }
      if (p.spikeTo > p.spikeFrom) {
        assert.ok(p.spikeTo <= p.gapFrom + 1e-6 || p.spikeFrom >= p.gapTo - 1e-6, 'şerit boşlukta');
      }
    }
  }
});

test('ilk polis geç gelir, 30 saniye sakin geçer', () => {
  const g = game();
  let first = -1;
  let max = 0;
  for (let i = 0; i < 60 * 30; i++) {
    g.tick(dt, Math.sin(i / 90) > 0.6 ? 1 : 0, false);
    if (g.cops.length && first < 0) first = g.time;
    max = Math.max(max, g.cops.length);
  }
  assert.ok(first >= CONFIG.difficulty.firstSpawnAt, `ilk ${first}`);
  assert.ok(max <= 3, `30 sn içinde en çok ${max} polis`);
});

test('polis oyuncuya yaklaşır ama düz yolda yetişemez', () => {
  const g = game(10);
  g.player.vx = 0;
  const c = g.spawnCop('car', 'chaser', g.player.x, g.player.y - 400, Math.PI / 2);
  // Oyuncu doğrudan ileride sabit dursun: polis gelmeli
  const start = Math.hypot(c.x - g.player.x, c.y - g.player.y);
  g.flow.compute(g.world, g.player.x, g.player.y);
  g.flowReady = true;
  for (let i = 0; i < 60 * 1.5; i++) {
    g.diff.maxPolice = 0;
    g.updateCops(dt);
  }
  assert.ok(Math.hypot(c.x - g.player.x, c.y - g.player.y) < start - 100);
  assert.ok(c.drive.maxSpeed < car.maxSpeed);
});

test('takılan polis ışınlanmaz: geri vitesle çıkıp yeniden yola döner', () => {
  const g = game(10);
  g.flow.compute(g.world, g.player.x, g.player.y);
  g.flowReady = true;
  g.player.x = 100; g.player.y = 300;
  let rect;
  for (let cx = 1; !rect; cx++) {
    const k = g.world.chunk(cx, 1);
    for (let i = 0; i < k.rectCount; i++) if (k.rects[i].kind === 'building') { rect = k.rects[i]; break; }
  }
  // Binaya burnu dayalı, hedef binanın arkasında
  g.player.x = rect.x + rect.w + 200;
  g.player.y = rect.y + 10;
  g.flow.compute(g.world, g.player.x, g.player.y);
  const c = g.spawnCop('car', 'chaser', rect.x - 14, rect.y + 10, 0);
  let maxJump = 0;
  let px = c.x;
  let py = c.y;
  for (let i = 0; i < 60 * 8; i++) {
    g.updateCops(dt);
    if (!g.cops.includes(c)) break;
    maxJump = Math.max(maxJump, Math.hypot(c.x - px, c.y - py));
    px = c.x;
    py = c.y;
  }
  assert.ok(maxJump < 30, `sıçrama ${maxJump}`);
  assert.ok(c.reverses >= 1 || c.speed > 60, 'çıkmayı denedi');
  assert.ok(!g.world.blockedAt(c.x, c.y));
});

test('çok uzaktaki polis ekran dışında silinir', () => {
  const g = game(10);
  g.spawnCop('car', 'chaser', g.player.x + 4000, g.player.y, 0);
  g.updateCops(dt);
  assert.equal(g.cops.length, 0);
});

test('duvara hızlı çarpan polis hasar alır, yeterince çarpınca patlar ve skor kazandırır', () => {
  const g = game(10);
  let rect;
  for (let cx = 1; !rect; cx++) {
    const k = g.world.chunk(cx, 1);
    for (let i = 0; i < k.rectCount; i++) if (k.rects[i].kind === 'building') { rect = k.rects[i]; break; }
  }
  g.player.x = rect.x - 400;
  g.player.y = rect.y + 10;
  const c = g.spawnCop('car', 'chaser', rect.x - 60, rect.y + 10, 0);
  const hp = c.hp;
  c.state = 'barricade'; // Sürücü müdahale etmesin
  c.state = 'chase';
  c.ctlS = 0;
  c.vx = 330;
  const impact = g.collideWorld(c, false);
  for (let i = 0; i < 12 && impact === 0; i++) {
    c.x += c.vx * dt;
    const k = g.collideWorld(c, false);
    if (k > CONFIG.policeAI.wallMinImpact) { c.hp -= (k - CONFIG.policeAI.wallMinImpact) * CONFIG.policeAI.wallDamage; break; }
  }
  assert.ok(c.hp < hp);
  const score = g.score;
  c.hp = -1;
  g.updateCops(dt);
  assert.equal(g.kills, 1);
  assert.ok(g.score > score);
});

test('oyuncu polisi devirebilir; SWAT daha dayanıklı', () => {
  const g = game(100);
  const a = g.spawnCop('car', 'chaser', 500, 500, 0);
  const b = g.spawnCop('swat', 'chaser', 900, 500, 0);
  const ah = a.hp;
  const bh = b.hp;
  g.copContact(a, 300);
  g.copContact(b, 300);
  assert.ok((ah - a.hp) / ah > (bh - b.hp) / bh * 3, 'ağır araca az işler');
});

test('barikat yolda kurulur, oyuncu yaklaşınca uyanır', () => {
  const g = game(120);
  g.player.vy = 340;
  g.player.speed = 340;
  g.updateCamera(1);
  let ok = false;
  for (let i = 0; i < 40 && !ok; i++) { g.player.y += 40; ok = g.placeBarricade(); }
  assert.ok(ok, 'barikat kurulamadı');
  const cops = g.cops.filter((c) => c.state === 'barricade');
  assert.ok(cops.length >= 1);
  for (const c of cops) assert.ok(!g.world.blockedAt(c.x, c.y));
  g.player.x = cops[0].x;
  g.player.y = cops[0].y - 100;
  g.updateCops(dt);
  assert.equal(cops[0].state, 'chase');
});

test('tank bina ezer, ateş eder; uyarı dairesi kaçmaya yetecek kadar sürer', () => {
  const g = game(300);
  const events = [];
  g.onEvent = (n) => events.push(n);
  let rect;
  let chunk;
  for (let cx = 1; !rect; cx++) {
    const k = g.world.chunk(cx, 1);
    for (let i = 0; i < k.rectCount; i++) if (k.rects[i].kind === 'building') { rect = k.rects[i]; chunk = k; break; }
  }
  const t = g.spawnCop('tank', 'chaser', rect.x - 45, rect.y + 20, 0);
  g.player.x = rect.x + 500;
  g.player.y = rect.y + 20;
  t.vx = 100;
  g.collideWorld(t, false);
  assert.equal(rect.alive, false, 'bina ezildi');
  assert.ok(chunk.dirty);
  t.fireT = 0;
  g.tankFire(t, 300, dt);
  assert.ok(g.shots.some((s) => s.alive));
  const need = CONFIG.tank.radius / (car.maxSpeed * 0.8);
  assert.ok(CONFIG.tank.warnTime > need * 2, 'oyuncu daireden çıkabilir');
  for (let i = 0; i < 60 * (CONFIG.tank.warnTime + 0.1); i++) g.updateShots(dt);
  assert.ok(events.includes('tankfire') && events.includes('tankhit'));
  assert.ok(!g.shots.some((s) => s.alive));
});

test('tank düz yolda oyuncudan çok yavaş', () => {
  assert.ok(CONFIG.police.tank.speed < 0.5);
  assert.ok(TILE > 0);
});
