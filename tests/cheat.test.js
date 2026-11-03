import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { Game, difficultyAt } from '../js/game.js';
import { Input } from '../js/input.js';
import { CheatCode } from '../js/cheat.js';
import { loudest } from '../js/police.js';
import { LEVELS } from '../js/quality.js';

const dt = 1 / 60;
const car = CONFIG.cars[0];
const SEQ = CONFIG.cheat.sequence;

function play(seed = 21, startTime = 0) {
  const g = new Game(1);
  g.start(car, { seed, startTime, god: false });
  return g;
}

function findBuilding(g) {
  for (let cx = 1; ; cx++) {
    const c = g.world.chunk(cx, 1);
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (r.kind === 'building' && r.w > 90 && r.h > 90) return r;
    }
  }
}

const countOf = (input) => { let n = 0; input.onCode = () => n++; return () => n; };
function wait(input, sec) { for (let i = 0; i < sec * 60; i++) input.tick(dt); }

function tapZones(i, side) { i.down(1, side === 'L' ? 10 : 300, 100); wait(i, 0.1); i.up(1); wait(i, 0.1); }
function tapKeys(i, side) { const k = side === 'L' ? 'ArrowLeft' : 'KeyD'; i.key(k, true); wait(i, 0.1); i.key(k, false); wait(i, 0.1); }
function tapStick(i, side) {
  i.down(1, 100, 300); i.move(1, side === 'L' ? 46 : 154, 300); wait(i, 0.12); i.up(1); wait(i, 0.15);
}
function tapWheel(i, side) {
  const w = i.wheel;
  i.down(1, w.cx, w.cy - 50);
  for (let d = 10; d <= 90; d += 10) {
    const a = ((side === 'L' ? -d : d) - 90) * Math.PI / 180;
    i.move(1, w.cx + Math.cos(a) * 50, w.cy + Math.sin(a) * 50);
  }
  wait(i, 0.08);
  i.up(1);
  wait(i, 0.25);
}
function makeInput(mode) {
  const i = new Input();
  i.setMode(mode);
  i.width = 400;
  i.wheel = { cx: 300, cy: 600, r: 70 };
  i.bounds = { l: 0, t: 0, r: 400, b: 800 };
  return i;
}

test('sıra doğru girilince tamamlanır, süre aşımı ve yanlış yön başa alır', () => {
  const c = new CheatCode();
  let t = 0;
  const all = (gap) => { let done = false; for (const d of SEQ) { t += gap; done = c.press(d, t); } return done; };
  assert.equal(SEQ.join(''), 'LLRRLRLRLLRR');
  assert.equal(all(0.5), true);
  assert.equal(all(2.0), false, 'süre aşımı');
  c.reset();
  for (const d of SEQ.slice(0, 7)) { t += 0.3; c.press(d, t); }
  assert.equal(c.press('L', t + 0.3), false, 'son basış yanlış');
  assert.equal(c.i, 1, 'yanlış L yeni başlangıç sayılır');
  assert.equal(all(0.3), false, 'sıra baştan girilmedi');
  c.reset();
  assert.equal(all(0.3), true);
});

for (const [mode, tap] of [['zones', tapZones], ['wheel', tapWheel], ['stick', tapStick], ['zones', tapKeys], ['wheel', tapKeys], ['stick', tapKeys]]) {
  test(`${mode} + ${tap.name}: doğru kod sayılır, yanlış kod sayılmaz`, () => {
    const i = makeInput(mode);
    const n = countOf(i);
    for (const d of SEQ) tap(i, d);
    assert.equal(n(), 1, 'doğru kod');
    for (const d of 'LRLRLRLRLRLR') tap(i, d);
    assert.equal(n(), 1, 'yanlış kod');
    wait(i, 2.1);
    for (const d of 'LLRRLRLR') tap(i, d);
    wait(i, 2.1);
    assert.equal(n(), 1, 'eski 8 basışlık kod açmaz');
    for (const d of 'LLRRLRLRL') tap(i, d);
    tap(i, 'R'); // Araya yanlış basış
    for (const d of 'LRR') tap(i, d);
    assert.equal(n(), 1, 'araya yanlış basış girince açmaz');
    wait(i, 2.1);
    wait(i, 2);
    for (const d of SEQ.slice(0, 4)) tap(i, d);
    wait(i, 2.0);
    for (const d of SEQ.slice(4)) tap(i, d);
    assert.equal(n(), 1, 'süre aşımı');
  });
}

test('normal sürüş kazara tetiklemez: uzun tutuş sırayı bozar', () => {
  const i = makeInput('zones');
  const n = countOf(i);
  for (const d of SEQ) { i.down(1, d === 'L' ? 10 : 300, 100); wait(i, 0.8); i.up(1); wait(i, 0.05); }
  assert.equal(n(), 0);
  // Rastgele direksiyon: yarım saatlik oyun
  let seen = 0;
  for (let run = 0; run < 30; run++) {
    const r = makeInput('zones');
    const m = countOf(r);
    for (let k = 0; k < 400; k++) {
      r.down(1, Math.random() < 0.5 ? 10 : 300, 100);
      wait(r, 0.25 + Math.random() * 0.9);
      r.up(1);
      wait(r, 0.05 + Math.random() * 0.5);
    }
    seen += m();
  }
  assert.ok(seen <= 1, `kazara ${seen}`);
});

test('direksiyon merkeze dönmeden ikinci basış sayılmaz', () => {
  const i = makeInput('stick');
  i.down(1, 100, 300);
  i.move(1, 40, 300);
  wait(i, 0.1);
  assert.equal(i.code.i, 1);
  i.move(1, 75, 300); // Merkeze dönmedi
  wait(i, 0.1);
  i.move(1, 40, 300);
  wait(i, 0.1);
  assert.equal(i.code.i, 1);
});

test('hile açıkken binadan geçer, hasar almaz, yavaşlamaz; kapanınca dışarı süzülür', () => {
  const g = play();
  const r = findBuilding(g);
  g.toggleCheat();
  assert.ok(g.cheat && g.cheatUsed);
  const p = g.player;
  p.x = r.x - 60; p.y = r.y + r.h / 2; p.a = 0; p.vx = 340; p.vy = 0; p.speed = 340;
  let inside = false;
  for (let i = 0; i < 90; i++) {
    g.tick(dt, 0, false);
    if (g.world.blockedAt(p.x, p.y)) inside = true;
  }
  assert.ok(inside, 'bina içine girdi');
  assert.ok(p.x > r.x + r.w, `geçti ${p.x}`);
  assert.equal(g.damage, 0);
  assert.ok(p.speed > 330, `hız ${p.speed}`);

  p.x = r.x + r.w / 2; p.y = r.y + r.h / 2;
  g.tick(dt, 0, false);
  assert.ok(g.phasing, 'yarı saydam');
  g.toggleCheat();
  assert.equal(g.cheat, false);
  assert.ok(g.exitOn, 'dışarı süzülüyor');
  for (let i = 0; i < 180; i++) g.tick(dt, 0, false);
  assert.equal(g.exitOn, false);
  assert.equal(g.world.circleHit(p.x, p.y, p.wid * 0.5, { nx: 0, ny: 0, depth: 0, rect: null, chunk: null }), false, 'boş yerde');
});

test('hile açıkken polis, tank, uzaylı ve şerit etkisiz; polis yine kovalar; oyun bitmez', () => {
  const g = play(21, 320);
  g.copLimit = 24;
  const hits = [];
  g.onEvent = (n) => { if (n === 'crash' || n === 'spike') hits.push(n); };
  g.toggleCheat();
  const p = g.player;
  let mostCops = 0;
  for (let i = 0; i < 60 * 40; i++) {
    g.tick(dt, Math.sin(i / 70) > 0.5 ? 1 : 0, false);
    if (i % 200 === 0) for (const c of g.cops) { if (!c.flying) { c.x = p.x + 30; c.y = p.y; break; } }
    mostCops = Math.max(mostCops, g.cops.length);
  }
  assert.equal(g.state, 'play');
  assert.equal(g.damage, 0);
  assert.equal(hits.length, 0);
  assert.ok(mostCops >= 8, `polis ${mostCops}`);
});

test('hile koşusu kazandırmaz, yeni koşuda kapalı başlar', () => {
  const g = play();
  g.coins = 50;
  g.toggleCheat();
  g.toggleCheat();
  g.state = 'dying';
  g.finish();
  assert.equal(g.result.cheated, true);
  assert.equal(g.result.coins, 0);
  g.start(car, { seed: 3 });
  assert.equal(g.cheat, false);
  assert.equal(g.cheatUsed, false);
});

test('polis sayısı artar; başta kolay, adil üst sınırlar korunur', () => {
  const n = [0, 30, 60, 120, 180, 240, 300].map((t) => difficultyAt(t).maxPolice);
  assert.deepEqual(n, [...n].sort((a, b) => a - b));
  assert.ok(n[0] === 1 && n[1] <= 3, 'başlangıç kolay');
  assert.ok(n[3] >= 12 && n[6] >= 24, n.join());
  assert.ok(difficultyAt(100, {}, 30).maxPolice > difficultyAt(100).maxPolice, 'arananlık öne alır');
  assert.equal(difficultyAt(100, {}, 30).stage, difficultyAt(100).stage, 'aşama süreye bağlı');
  assert.ok(difficultyAt(600).closeMax <= 5);
  const g = play(21, 600);
  for (const type of Object.keys(CONFIG.police)) {
    const c = g.spawnCop(type, 'chaser', 5000, 5000, 0);
    assert.ok(c.drive.maxSpeed < car.maxSpeed, `${type} oyuncudan yavaş`);
  }
});

test('kalite sınırı aşılmaz, polis havuzdan gelir', () => {
  assert.deepEqual(LEVELS.map((l) => l.cops), [24, 18, 12, 8]);
  for (const limit of [8, 12]) {
    const g = play(30, 300);
    g.copLimit = limit;
    let max = 0;
    let steer = 1;
    for (let i = 0; i < 60 * 90; i++) {
      if (i % 90 === 0) steer = [-1, 0, 1, 0][(i / 90) % 4];
      g.god = true;
      g.tick(dt, steer, false);
      max = Math.max(max, g.cops.length);
    }
    assert.ok(max <= limit, `${limit}: ${max}`);
    assert.ok(max >= limit - 1, `sınır dolar: ${max}`);
    assert.ok(g.copPool.length + g.cops.length <= CONFIG.difficulty.maxActive, 'havuz büyümedi');
  }
});

test('üç rol de oyunda görülür, oyuncunun çevresi tamamen kapanmaz', () => {
  // Roller rastgele seçilir: birkaç haritada bakılır. Kuşatma her haritada sıfır olmalı
  const roles = new Set();
  const states = new Set();
  let sealed = 0;
  let samples = 0;
  let run = 0;
  let longest = 0;
  for (const seed of [44, 45, 46, 47]) {
    const g = play(seed, 240);
    g.god = true;
    let steer = 0;
    const p = g.player;
    for (let i = 0; i < 60 * 150; i++) {
      if (i % 80 === 0) steer = [0, 1, 0, -1][(i / 80) % 4];
      g.tick(dt, steer, false);
      for (const c of g.cops) { roles.add(c.role); states.add(c.state); }
      if (i % 30) continue;
      samples++;
      const sect = new Uint8Array(8);
      for (const c of g.cops) {
        // Barikat arabaları sayılmaz: geçiş boşluğunu ayrı test denetler.
        // 110 birimlik halkada dolu sektörler arası boşluk araba genişliğindedir
        if (c.flying || c.state === 'barricade' || Math.hypot(c.x - p.x, c.y - p.y) > 110) continue;
        sect[Math.floor(((Math.atan2(c.y - p.y, c.x - p.x) + Math.PI) / 6.2832) * 8) % 8] = 1;
      }
      if (sect.every(Boolean)) { sealed++; run++; longest = Math.max(longest, run); } else run = 0;
    }
    if (['chaser', 'flanker', 'interceptor', 'blocker'].every((r) => roles.has(r)) && states.has('block') && seed >= 45) break;
  }
  for (const r of ['chaser', 'flanker', 'interceptor', 'blocker']) assert.ok(roles.has(r), r);
  assert.ok(states.has('block'), [...states].join());
  // Kaçış yolu sürekli kapanmaz: yarım saniyeden uzun kuşatma yok, toplamda da çok nadir
  assert.ok(longest <= 1, `art arda kapalı ${longest}`);
  assert.ok(sealed <= samples * 0.01, `kapalı ${sealed}/${samples}`);
});

test('aynı anda en çok üç siren sesi çalar, en yakınlar seçilir', () => {
  const d = new Float32Array([900, 1e9, 100, 300, 700, 1e9, 50]);
  const m = loudest(d, 3, new Uint8Array(7));
  assert.deepEqual([...m], [0, 0, 1, 1, 0, 0, 1]);
  assert.equal(loudest(new Float32Array(4).fill(1e9), 3, new Uint8Array(4)).reduce((a, b) => a + b), 0);
  assert.ok(CONFIG.pursuit.maxSirens <= 3);
});

test('zaman sınırı: 1,9 sn aralık geçerli, 2,0 sn ve üstü geçersiz, hızlı giriş geçerli', () => {
  assert.equal(CONFIG.cheat.gap, 2);
  const run = (gap) => { const c = new CheatCode(); let t = 10; let done = false; for (const d of SEQ) { t += gap; done = c.press(d, t); } return done; };
  assert.equal(run(1.9), true, '1,9 sn');
  assert.equal(run(1.99), true, '1,99 sn');
  assert.equal(run(2.0), false, '2,0 sn');
  assert.equal(run(2.5), false, '2,5 sn');
  assert.equal(run(0.12), true, 'hızlı');
  // Tek bir uzun ara da sırayı bozar: sonda 2,0 sn bekleyen giriş açmaz
  const c = new CheatCode(); let t = 0;
  SEQ.slice(0, 7).forEach((d) => { t += 0.3; c.press(d, t); });
  assert.equal(c.press('R', t + 2.0), false);
});

// Gerçek giriş yolu: oyun adımları (1/60 sn) birikerek saat ilerler
for (const [mode, tap] of [['zones', tapZones], ['wheel', tapWheel], ['stick', tapStick], ['zones', tapKeys]]) {
  test(`${mode} + ${tap.name}: 1,9 sn aralıkla açılır, 2,0 sn aralıkla açılmaz`, () => {
    for (const [gap, want] of [[1.9, 1], [2.0, 0], [0.25, 1]]) {
      const i = makeInput(mode);
      const n = countOf(i);
      for (const d of SEQ) {
        const t0 = i.clock;
        tap(i, d);
        // Basışın kendisi de süreden sayılır: bir sonraki basış tam gap sonra başlar
        const pressAt = i.code.t;
        wait(i, Math.max(0, gap - (i.clock - pressAt)));
        assert.ok(i.clock >= t0);
      }
      assert.equal(n(), want, `${gap} sn`);
    }
  });
}

test('12 basışlık kod: eski 8 basışlık kod açmaz, tam kod açar ve ikinci kez kapatır', () => {
  assert.equal(SEQ.length, 12);
  const c = new CheatCode();
  let t = 0;
  for (const d of 'LLRRLRLR') { t += 0.3; assert.equal(c.press(d, t), false); }
  t += 2.0;
  assert.equal(c.press('L', t), false, 'eski kodun ardı süre aşımı');
  const g = play();
  const i = makeInput('zones');
  i.onCode = () => g.toggleCheat();
  for (const d of SEQ) tapKeys(i, d);
  assert.equal(g.cheat, true, 'açtı');
  for (const d of SEQ) tapKeys(i, d);
  assert.equal(g.cheat, false, 'ikinci kez kapattı');
});
