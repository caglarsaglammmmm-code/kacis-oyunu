import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { makeBody, resetBody, stepCar, circleRect, bounceOff, wrapAngle, roundCorner } from '../js/physics.js';

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
  assert.ok(maxSlip > 140, `kayma ${maxSlip}`);
  assert.ok(drifted > 20, `drift kareleri ${drifted}`);
});

test('bırakınca kayarak toparlar: kayma hemen bitmez ama 2,5 sn içinde biter', () => {
  const c = car();
  run(c, 0, 1, 3);
  run(c, 1, 1, 1);
  const at = c.slip;
  run(c, 0, 1, 0.1);
  assert.ok(c.slip > at * 0.4, `0,1 sn sonra kayma ${c.slip} / ${at}`);
  run(c, 0, 1, 2.4);
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
  assert.ok(c.x - x0 < 520, `açılma ${c.x - x0}`);
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

test('hız çarpanı: tüm araçlar ölçeklenir, polis oyuncudan hep yavaş', () => {
  const S = CONFIG.speedScale;
  assert.ok(S.player >= 0.8 && S.player <= 0.92, 'yaklaşık %10-15 yavaş');
  assert.equal(CONFIG.cars[0].maxSpeed, Math.round(432 * S.player));
  for (const p of Object.values(CONFIG.police)) assert.ok(p.speed * S.police < 1);
  assert.equal(CONFIG.npc.types.bus.cruise, Math.round(150 * S.npc));
  assert.equal(CONFIG.highwayTraffic.speed[1], Math.round(400 * S.highway));
});

test('düşük hızda dönüş yarıçapı bir karoluk sokağa sığar, direksiyon tek başına hız keser', () => {
  const c = car();
  c.vx = 120;
  run(c, 1, 1, 3);
  const r = c.speed / Math.abs(c.w);
  assert.ok(r < 46, 'yarıçap ' + r);
  const f = car();
  run(f, 0, 1, 4);
  const v0 = f.speed;
  run(f, 1, 1, 1.2);
  assert.ok(f.speed < v0 * 0.72, 'viraj hızı ' + f.speed);
});

test('duvara dayalı duran araç direksiyonla burnunu çevirir', () => {
  const c = car();
  run(c, 1, 1, 0.5);
  assert.ok(Math.abs(c.a) > 0.15, 'açı ' + c.a);
});

test('sürtme: dar açıda sekme yok, hız korunur; dik darbede sekme sürer', () => {
  const b = makeBody();
  b.vx = 300; b.vy = 60; b.a = 0.2;
  bounceOff(b, 0, -1);
  assert.equal(b.graze, true);
  assert.ok(Math.abs(b.vy) < 1e-6, 'duvardan sekmez');
  assert.ok(b.vx > 290, 'hız korunur ' + b.vx);
  const h = makeBody();
  h.vy = 300;
  bounceOff(h, 0, -1);
  assert.equal(h.graze, false);
  assert.ok(h.vy < 0);
});

test('açık bina köşesi yay gibi çalışır, kapalı köşe dik kalır', () => {
  const rect = { x: 0, y: 0, w: 100, h: 100, radius: 16, corners: 1 };
  const out = { nx: 0, ny: 0 };
  // Köşeye çapraz yaklaşan daire: dik köşede temas var, yayda henüz yok
  const px = -4; const py = -4;
  const d = circleRect(px, py, 12, rect.x, rect.y, rect.w, rect.h, out);
  assert.ok(d > 0);
  assert.equal(roundCorner(px, py, 12, rect, out, d), -1);
  assert.equal(roundCorner(px, py, 12, { ...rect, corners: 2 }, out, d), d);
});
