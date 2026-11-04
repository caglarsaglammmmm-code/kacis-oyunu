import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';

const dt = 1 / 60;
const E = CONFIG.escape;
const car = CONFIG.cars[0];

function setup() {
  const g = new Game(1);
  g.start(car, { seed: 21, startTime: 60, god: true });
  g.runTime = 20;
  const events = [];
  g.onEvent = (n, v) => { if (n === 'escape') events.push(v); };
  return { g, events };
}

// Oyuncu +x yönünde hızla geçer, polis yolun kenarında lateral kadar yanda durur
function pass(g, c, { lateral = 45, speed = 300, forward = speed, seconds = 1.6, hit = false } = {}) {
  const p = g.player;
  const x0 = p.x;
  c.x = x0 + 200; c.y = p.y + lateral; c.vx = 0; c.vy = 0;
  let got = 0;
  for (let t = 0; t < seconds; t += dt) {
    p.x += Math.sign(forward || 1) * Math.abs(speed) * dt * (forward === 0 ? 0 : 1);
    p.vx = speed; p.vy = 0; p.speed = Math.abs(speed); p.forward = forward;
    g.runTime += dt;
    if (hit && Math.abs(p.x - c.x) < 20) c.escHit = true;
    got += g.checkEscape(c, Math.hypot(c.x - p.x, c.y - p.y));
  }
  return got;
}

const cop = (g) => { const c = g.spawnCop('car', 'chaser', 0, 0, 0); c.state = 'chase'; return c; };

test('yakın ve hızlı geçiş ödül verir; ödül 5-10, para hemen eklenir', () => {
  const { g, events } = setup();
  const c = cop(g);
  const before = g.coins;
  const got = pass(g, c);
  assert.ok(got >= E.min && got <= E.max + E.comboBonus, `ödül ${got}`);
  assert.equal(events.length, 1);
  assert.ok(events[0].amount >= 5 && events[0].amount <= 10);
  assert.equal(g.coins - before, got);
  assert.equal(g.escapes, 1);
});

test('çarpışma olursa ödül yok', () => {
  const { g, events } = setup();
  assert.equal(pass(g, cop(g), { lateral: 10, hit: true }), 0);
  assert.equal(events.length, 0);
});

test('gerçek oyunda polise çarparak geçmek ödül vermez', () => {
  const { g, events } = setup();
  const p = g.player;
  g.flow.compute(g.world, p.x, p.y); g.flowReady = true;
  const c = g.spawnCop('car', 'chaser', p.x + 160, p.y, Math.PI);
  c.state = 'barricade'; c.staticBody = true; c.wakeT = 99;
  // Barikat uyanıp kenara kaçmasın: oyuncu gerçekten çarpsın
  const wake = CONFIG.barricade.wakeDist;
  CONFIG.barricade.wakeDist = 0;
  let touched = false;
  try {
    for (let i = 0; i < 90; i++) {
      p.x += 320 * dt; p.y = c.y; p.vx = 320; p.vy = 0; p.speed = 320; p.forward = 320;
      g.runTime += dt;
      g.updateCops(dt);
      if (c.escHitAt > 0) touched = true;
    }
  } finally { CONFIG.barricade.wakeDist = wake; }
  assert.ok(touched, 'temas oldu');
  assert.equal(events.length, 0);
});

test('duruyorken, yavaşken ve geri giderken ödül yok', () => {
  for (const o of [{ speed: 0, forward: 0 }, { speed: 120 }, { speed: E.minSpeed - 1 }, { speed: 300, forward: -300 }]) {
    const { g, events } = setup();
    pass(g, cop(g), o);
    assert.equal(events.length, 0, JSON.stringify(o));
  }
});

test('polisin yanında uzun kalmak (sıkışma, dönüp durma) ödül vermez', () => {
  const { g, events } = setup();
  const c = cop(g);
  const p = g.player;
  c.x = p.x + 10; c.y = p.y + 40;
  for (let t = 0; t < E.maxClose + 0.5; t += dt) {
    p.speed = 300; p.forward = 300; g.runTime += dt;
    g.checkEscape(c, Math.hypot(c.x - p.x, c.y - p.y));
  }
  p.x -= 400; // Sonra uzaklaşır
  g.checkEscape(c, Math.hypot(c.x - p.x, c.y - p.y));
  assert.equal(events.length, 0);
});

test('aynı polisten 3 saniye içinde ikinci ödül yok, sonra yine var', () => {
  const { g, events } = setup();
  const c = cop(g);
  pass(g, c);
  assert.equal(events.length, 1);
  pass(g, c, { seconds: 1.2 }); // 3 sn dolmadı
  assert.equal(events.length, 1, 'bekleme süresinde');
  g.runTime += E.cooldown;
  pass(g, c);
  assert.equal(events.length, 2, 'süre dolunca');
});

test('hile açıkken ve görünmezken ödül yok; kovalamayan polisten ödül yok', () => {
  const { g, events } = setup();
  g.toggleCheat();
  pass(g, cop(g));
  g.toggleCheat();
  g.ghostT = 5;
  pass(g, cop(g));
  g.ghostT = 0;
  const warping = g.spawnCop('dart', 'chaser', 0, 0, 0);
  warping.warpT = 5; // Işınlanan uzaylı henüz belirmedi: kovalamıyor
  pass(g, warping);
  assert.equal(events.length, 0);
});

test('barikattan ve yolu kapatan polisten değmeden geçmek ödül verir', () => {
  for (const state of ['barricade', 'block']) {
    const { g, events } = setup();
    const c = cop(g);
    c.state = state;
    pass(g, c);
    assert.equal(events.length, 1, state);
  }
});

test('ödül her zaman 5-10; kombo her 3 kaçışta +2, toplam makul', () => {
  const { g, events } = setup();
  let total = 0;
  for (let i = 0; i < 300; i++) total += pass(g, cop(g));
  assert.equal(events.length, 300);
  for (const e of events) assert.ok(e.amount >= 5 && e.amount <= 10 && Number.isInteger(e.amount), JSON.stringify(e));
  const amounts = new Set(events.map((e) => e.amount));
  assert.equal(amounts.size, 6, 'bütün değerler çıkar');
  events.forEach((e, i) => assert.equal(e.bonus, (i + 1) % 3 === 0 ? 2 : 0, `kombo ${i}`));
  assert.ok(total / events.length < 9.2, `ortalama ${total / events.length}`);
});

test('koşu sonu kazancı yaklaşık %30 artar, kıl payı paraları ayrıca eklenir', () => {
  const { g } = setup();
  g.runTime = 80; g.kills = 4; g.nearMisses = 6; g.coins = 10;
  const base = 10 + Math.floor(80 / CONFIG.score.coinPerSeconds) + 4 * CONFIG.score.coinPerKill + Math.floor(6 / CONFIG.score.coinPerNearMisses);
  const c = cop(g);
  const esc = pass(g, c);
  g.state = 'dying';
  g.finish();
  assert.equal(g.result.coins, Math.round(base * 1.3) + esc);
  assert.ok(CONFIG.score.earnMul >= 1.25 && CONFIG.score.earnMul <= 1.4);
});
