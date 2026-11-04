// Direksiyon ve joystick: sentetik dokunma dizileriyle sıçrama, takılma ve geri dönüş sınaması.
// Her adımda değerin (steer) en büyük ani değişimi ölçülür
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Input, WHEEL_MAX, STICK_R } from '../js/input.js';
import { CONFIG } from '../js/config.js';

const dt = 1 / 60;
const W = { cx: 300, cy: 700, r: 70 };
const report = {};

function wheel() {
  const i = new Input();
  i.setMode('wheel');
  i.width = 400;
  i.wheel = { ...W };
  return i;
}
// Parmak direksiyon çevresinde deg açısında (0 = sağ, saat yönü pozitif), R yarıçapında
const at = (deg, R = 55, c = W) => [c.cx + Math.cos((deg * Math.PI) / 180) * R, c.cy + Math.sin((deg * Math.PI) / 180) * R];
// Her olaydan sonra bir adım: en büyük adım farkı
function track(i, steps) {
  let prev = i.steer; let max = 0;
  for (const s of steps) { s(); i.tick(dt); const v = i.steer; max = Math.max(max, Math.abs(v - prev)); prev = v; assert.ok(Number.isFinite(v) && Math.abs(v) <= 1 + 1e-9, 'değer -1..1'); }
  return max;
}

test('direksiyon: ±135° sınırlı, açıyla orantılı, basıldığı yerden devam eder', () => {
  assert.equal(CONFIG.input.wheel.maxDeg, 135);
  const i = wheel();
  i.down(1, ...at(-90)); // Üstten tut
  const steps = [];
  for (let d = -90; d <= 0; d += 3) steps.push(() => i.move(1, ...at(d))); // 90° sağa
  for (let k = 0; k < 30; k++) steps.push(() => {});
  track(i, steps);
  assert.ok(Math.abs(i.wheelS - Math.PI / 2) < 0.03, `90° ${i.wheelS}`);
  assert.ok(Math.abs(i.steer - (Math.PI / 2) / WHEEL_MAX) < 0.03, 'orantılı');
  for (let d = 0; d <= 200; d += 5) i.move(1, ...at(d));
  assert.equal(i.wheelA, WHEEL_MAX, 'tam kilitten öteye gitmez');
  // Kilitteyken geri çevirince hemen tepki verir
  i.move(1, ...at(190));
  assert.ok(i.wheelA < WHEEL_MAX);
});

test('direksiyon: -180/+180 sınırından geçerken sıçrama yok', () => {
  const i = wheel();
  i.down(1, ...at(150));
  const steps = [];
  for (let d = 150; d <= 260; d += 2) steps.push(() => i.move(1, ...at(d))); // 180°'yi geçer
  for (let d = 260; d >= 140; d -= 2) steps.push(() => i.move(1, ...at(d))); // geri
  const max = track(i, steps);
  report.wheelWrap = +max.toFixed(3);
  assert.ok(max < 0.08, `sınırda en büyük adım ${max}`);
  assert.ok(Math.abs(i.wheelA - (-10 * Math.PI) / 180) < 0.05, 'açı doğru birikti');
});

test('direksiyon: hızlı sağ-sol değişim akıcı; merkezden geçen parmak sıçratmaz; dışarı sürüklenince kontrol sürer', () => {
  const i = wheel();
  i.down(1, ...at(-90));
  const steps = [];
  for (let n = 0; n < 6; n++) {
    for (let d = -90; d <= -20; d += 10) steps.push(() => i.move(1, ...at(d)));
    for (let d = -20; d >= -160; d -= 10) steps.push(() => i.move(1, ...at(d)));
    for (let d = -160; d <= -90; d += 10) steps.push(() => i.move(1, ...at(d)));
  }
  report.wheelZigzag = +track(i, steps).toFixed(3);
  assert.ok(report.wheelZigzag < 0.15, `zikzak ${report.wheelZigzag}`);
  // Merkeze girip ters taraftan çıkma: eskiden tek olayda ~180° eklenirdi
  const j = wheel();
  j.down(1, ...at(-90));
  for (let d = -90; d <= -60; d += 5) j.move(1, ...at(d));
  for (let k = 0; k < 30; k++) j.tick(dt);
  const before = j.wheelA;
  const hole = [() => j.move(1, W.cx + 3, W.cy + 2), () => j.move(1, ...at(100)), () => j.move(1, ...at(105))];
  report.wheelHole = +track(j, hole).toFixed(3);
  assert.ok(Math.abs(j.wheelA - before - (5 * Math.PI) / 180) < 0.02, 'merkezden çıkınca yalnız sonraki fark eklenir');
  assert.ok(report.wheelHole < 0.05, `merkez ${report.wheelHole}`);
  // Parmak direksiyonun çok dışına sürüklenir: açı farkı sürer, bırakılmaz
  const k = wheel();
  k.down(1, ...at(-90));
  for (let d = -90; d <= -30; d += 4) k.move(1, ...at(d, 260));
  assert.equal(k.wheelId, 1, 'dışarıda da tutulu');
  assert.ok(k.wheelA > 0.9, 'dışarıda da döner');
  // Tek olayda dev atlama (kaçan olay) yok sayılır
  const v = k.wheelA;
  k.move(1, ...at(150, 260));
  assert.equal(k.wheelA, v, 'büyük atlama yok sayıldı');
});

test('direksiyon: bırakınca yaylı ve tekdüze ortaya döner; ikinci parmak karışmaz; yerleşim kayınca sıçramaz; ekran dönünce bırakılır', () => {
  const i = wheel();
  i.down(1, ...at(-90));
  for (let d = -90; d <= 10; d += 4) { i.move(1, ...at(d)); i.tick(dt); }
  for (let n = 0; n < 30; n++) i.tick(dt);
  assert.equal(i.down(2, ...at(30)), false, 'ikinci parmak alınmaz');
  i.move(2, ...at(170)); i.up(2);
  assert.equal(i.wheelId, 1);
  i.up(1);
  let prev = i.steer; let mono = true; let max = 0; let t0 = -1;
  for (let n = 0; n < 120; n++) { i.tick(dt); const v = i.steer; if (v > prev + 1e-9) mono = false; max = Math.max(max, prev - v); prev = v; if (v === 0 && t0 < 0) t0 = n * dt; }
  report.wheelReturn = { maxStep: +max.toFixed(3), zeroAt: +t0.toFixed(2) };
  assert.ok(mono, 'geri dönüş tekdüze (ileri geri sallanmaz)');
  assert.equal(i.steer, 0, 'ortaya döndü');
  assert.ok(t0 > 0 && t0 < 1, `${t0} sn içinde`);
  // Yerleşim kayması (adres çubuğu): merkez 60 px aşağı iner
  const j = wheel();
  j.down(1, ...at(-90));
  for (let d = -90; d <= -40; d += 5) { j.move(1, ...at(d)); j.tick(dt); }
  for (let n = 0; n < 30; n++) j.tick(dt);
  const before = j.wheelA;
  j.wheel.cy += 60; j.wheelHole = true; // controls.layout() bunu yapar
  const sh = [() => j.move(1, ...at(-40, 55, j.wheel)), () => j.move(1, ...at(-35, 55, j.wheel))];
  report.wheelLayout = +track(j, sh).toFixed(3);
  assert.ok(Math.abs(j.wheelA - before - (5 * Math.PI) / 180) < 0.02, 'kayma sıçratmadı');
  // Ekran döndü: tutuş bırakılır, direksiyon ortaya döner
  j.resetPointers();
  for (let n = 0; n < 120; n++) j.tick(dt);
  assert.equal(j.wheelId, null);
  assert.equal(j.steer, 0);
});

function stick() {
  const i = new Input();
  i.setMode('stick');
  i.width = 400;
  i.bounds = { l: 0, t: 0, r: 400, b: 800 };
  return i;
}

test('joystick: basılan nokta merkez; kenarda basınca ani dönüş yok; ölü bölge; yarıçapla sınırlı; akıcı', () => {
  const i = stick();
  i.down(1, 6, 400); // Sol kenara çok yakın: halka görünüşte içeri alınır
  assert.ok(i.stick.x > 6, 'halka ekrana sığar');
  const first = [() => i.move(1, 9, 401)]; // 3 px kayma: ölü bölge
  report.stickEdge = +track(i, first).toFixed(3);
  assert.equal(i.steer, 0, 'kenarda basınca ilk hareket dönüş yapmaz (eskiden tam sola atlardı)');
  const steps = [];
  for (let x = 9; x <= 6 + STICK_R + 40; x += 4) steps.push(() => i.move(1, x, 400));
  for (let n = 0; n < 30; n++) steps.push(() => {});
  report.stickSweep = +track(i, steps).toFixed(3);
  assert.ok(i.steer > 0.97, 'tam sağ');
  assert.ok(report.stickSweep < 0.15, `süpürme ${report.stickSweep}`);
  assert.ok(Math.abs(i.stick.dx) <= STICK_R, 'yarıçapla sınırlı');
});

test('joystick: hızlı sağ-sol, ikinci parmak, bırakınca yumuşak sıfır, ekran dönmesi', () => {
  const i = stick();
  i.down(1, 150, 400);
  const steps = [];
  for (let n = 0; n < 8; n++) {
    for (let x = 150; x <= 210; x += 6) steps.push(() => i.move(1, x, 400));
    for (let x = 210; x >= 90; x -= 6) steps.push(() => i.move(1, x, 400));
    for (let x = 90; x <= 150; x += 6) steps.push(() => i.move(1, x, 400));
  }
  report.stickZigzag = +track(i, steps).toFixed(3);
  assert.ok(report.stickZigzag < 0.2, `zikzak ${report.stickZigzag}`);
  i.move(1, 220, 400);
  for (let n = 0; n < 30; n++) i.tick(dt);
  const v = i.steer;
  assert.equal(i.down(2, 60, 300), false, 'ikinci parmak joystick almaz');
  i.move(2, 0, 300); i.up(2);
  assert.equal(i.steer, v, 'ikinci parmak karışmadı');
  i.up(1);
  let prev = i.steer; let max = 0;
  for (let n = 0; n < 60; n++) { i.tick(dt); max = Math.max(max, Math.abs(i.steer - prev)); prev = i.steer; }
  report.stickRelease = +max.toFixed(3);
  assert.equal(i.steer, 0, 'bırakınca sıfır');
  assert.ok(max < 0.35, 'yumuşak');
  i.down(3, 100, 400); i.move(3, 180, 400);
  i.resetPointers();
  for (let n = 0; n < 60; n++) i.tick(dt);
  assert.equal(i.steer, 0, 'ekran dönünce bırakıldı');
  console.log('# kontrol ölçümleri (en büyük adım değişimi, -1..1 ölçeğinde)', JSON.stringify(report));
});
