import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { makeBody, resetBody, stepCar, circleRect, bounceOff, wrapAngle } from '../js/physics.js';

const spec = CONFIG.cars[0];
const road = CONFIG.surfaces[1];
const grass = CONFIG.surfaces[0];
const dt = 1 / 60;

function car() {
  const c = makeBody();
  resetBody(c, 0, 0, 0, spec);
  return c;
}
function run(c, steer, throttle, seconds, surf = road) {
  for (let i = 0; i < seconds * 60; i++) stepCar(c, steer, throttle, spec, surf, dt);
}

test('otomatik gazla son hıza yaklaşır, aşmaz', () => {
  const c = car();
  run(c, 0, 1, 8);
  assert.ok(c.speed > spec.maxSpeed * 0.85, `hız ${c.speed}`);
  assert.ok(c.speed <= spec.maxSpeed + 1);
});

test('çimen yolu yavaşlatır', () => {
  const a = car();
  const b = car();
  run(a, 0, 1, 6);
  run(b, 0, 1, 6, grass);
  assert.ok(b.speed < a.speed * 0.92);
});

test('sağ girdide burun sağa (a artar), sol girdide sola döner', () => {
  const a = car();
  run(a, 0, 1, 2);
  const start = a.a;
  run(a, 1, 1, 0.4);
  assert.ok(a.a > start);
  const b = car();
  run(b, 0, 1, 2);
  run(b, -1, 1, 0.4);
  assert.ok(b.a < 0);
});

test('araba bir anda dönmez: açısal hız ağırlıkla yükselir', () => {
  const c = car();
  run(c, 0, 1, 3);
  stepCar(c, 1, 1, spec, road, dt);
  assert.ok(Math.abs(c.w) < 0.3, `ilk kare açısal hız ${c.w}`);
  run(c, 1, 1, 0.5);
  assert.ok(c.w > 1.5);
});

test('basılı dönüşte drift oluşur: yanal kayma ve açısal hız ayrı', () => {
  const c = car();
  run(c, 0, 1, 3);
  let maxSlip = 0;
  let drifted = 0;
  for (let i = 0; i < 60; i++) {
    stepCar(c, 1, 1, spec, road, dt);
    maxSlip = Math.max(maxSlip, c.slip);
    if (c.drifting) drifted++;
  }
  assert.ok(maxSlip > 90, `kayma ${maxSlip}`);
  assert.ok(drifted > 20, `drift kareleri ${drifted}`);
});

test('bırakınca kayarak toparlar: kayma hemen bitmez ama 1,5 sn içinde biter', () => {
  const c = car();
  run(c, 0, 1, 3);
  run(c, 1, 1, 1);
  const at = c.slip;
  run(c, 0, 1, 0.1);
  assert.ok(c.slip > at * 0.4, `0,1 sn sonra kayma ${c.slip} / ${at}`);
  run(c, 0, 1, 1.4);
  assert.ok(c.slip < 20, `kayma ${c.slip}`);
  assert.ok(Math.abs(c.w) < 0.4, `açısal ${c.w}`);
  assert.ok(Math.cos(Math.atan2(c.vy, c.vx) - c.a) > 0.97, 'burun gidiş yönünde');
});

test('90 derece dönüş yaklaşık bir saniyede ve ana yol genişliğinde biter', () => {
  const c = car();
  run(c, 0, 1, 3);
  const x0 = c.x;
  const y0 = c.y;
  let t = 0;
  while (c.a < Math.PI / 2 - 0.25 && t < 3) { stepCar(c, 1, 1, spec, road, dt); t += dt; }
  run(c, 0, 1, 0.4);
  assert.ok(t < 1.1, `süre ${t}`);
  assert.ok(c.x - x0 < 340, `açılma ${c.x - x0}`);
  assert.ok(c.y > y0);
});

test('fren ve geri vites: önce durur, sonra geri gider', () => {
  const c = car();
  run(c, 0, 1, 3);
  run(c, 0, -1, 0.9);
  assert.ok(c.forward < 60);
  run(c, 0, -1, 1.5);
  assert.ok(c.forward < -100, `geri hız ${c.forward}`);
  assert.ok(c.forward >= -CONFIG.physics.reverseSpeed - 5);
});

test('daire-dikdörtgen teması ve yansıma', () => {
  const out = { nx: 0, ny: 0 };
  assert.equal(circleRect(0, 0, 10, 50, 50, 20, 20, out), -1);
  const d = circleRect(45, 60, 10, 50, 50, 20, 20, out);
  assert.equal(d, 5);
  assert.equal(out.nx, -1);
  const b = makeBody();
  b.vx = 200;
  const impact = bounceOff(b, -1, 0);
  assert.equal(impact, 200);
  assert.ok(b.vx < 0);
  assert.equal(bounceOff(b, -1, 0), 0, 'uzaklaşırken darbe yok');
});

test('wrapAngle', () => {
  assert.ok(Math.abs(wrapAngle(Math.PI * 3) - Math.PI) < 1e-9);
  assert.ok(Math.abs(wrapAngle(-Math.PI * 2.5) + Math.PI / 2) < 1e-9);
});

test('tüm arabalar ayırt edilir ve en az 5 tane', () => {
  assert.ok(CONFIG.cars.length >= 5);
  for (const key of ['maxSpeed', 'durability', 'driftGrip']) {
    assert.ok(new Set(CONFIG.cars.map((c) => c[key])).size >= 4, key);
  }
});
