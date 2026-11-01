// Araba fiziği: ileri hız, yanal kayma ve açısal hız ayrı ayrı hesaplanır.
import { CONFIG } from './config.js';

const P = CONFIG.physics;

export function makeBody() {
  return {
    x: 0, y: 0, vx: 0, vy: 0, a: 0, w: 0,
    steer: 0, grip: 6, slip: 0, speed: 0, forward: 0, lateral: 0, drifting: false,
    len: 46, wid: 24, mass: 1, flat: 0, onGround: 1,
  };
}

export function resetBody(b, x, y, a, spec) {
  b.x = x; b.y = y; b.a = a;
  b.vx = 0; b.vy = 0; b.w = 0;
  b.steer = 0; b.grip = spec.grip; b.slip = 0; b.speed = 0; b.forward = 0; b.lateral = 0;
  b.drifting = false; b.flat = 0;
  b.len = spec.len; b.wid = spec.wid; b.mass = spec.mass;
}

// steerIn: -1 sol, +1 sağ. throttle: 1 gaz, 0 boşta, -1 fren ve geri vites.
// spec: maxSpeed, accel, turnRate, grip, driftGrip. surf: CONFIG.surfaces öğesi.
export function stepCar(c, steerIn, throttle, spec, surf, dt) {
  c.steer += (steerIn - c.steer) * (1 - Math.exp(-P.steerResponse * dt));

  const ca = Math.cos(c.a);
  const sa = Math.sin(c.a);
  let vF = c.vx * ca + c.vy * sa; // ileri bileşen
  let vL = -c.vx * sa + c.vy * ca; // yanal bileşen (sağa doğru pozitif)
  const speed = Math.hypot(vF, vL);
  const top = spec.maxSpeed * surf.speed;

  // 1) Boyuna: motor, fren, geri vites
  if (throttle > 0) {
    if (vF < 0) vF += P.brakeDecel * throttle * dt;
    else if (vF < top) vF += spec.accel * throttle * (1 - vF / top) * dt;
  } else if (throttle < 0) {
    if (vF > 8) vF = Math.max(0, vF - P.brakeDecel * -throttle * dt);
    else vF = Math.max(-P.reverseSpeed, vF - P.reverseAccel * -throttle * dt);
  }
  if (vF > top) vF -= (vF - top) * Math.min(1, 2.5 * dt);
  vF *= Math.exp(-(P.rollingDrag + surf.drag) * dt);
  vF -= Math.sign(vF) * Math.min(Math.abs(vF), P.scrub * Math.abs(vL) * dt * 4);

  // 2) Yanal: yol tutuş direksiyon kırılınca düşer, bırakınca yavaşça döner
  const steering = Math.abs(c.steer) > 0.25 && speed > P.driftMinSpeed;
  let targetGrip = steering ? spec.driftGrip : spec.grip;
  if (c.flat > 0) targetGrip *= CONFIG.barricade.flatGrip;
  const rate = targetGrip < c.grip ? P.gripLoseRate : P.gripRecoverRate;
  c.grip += (targetGrip - c.grip) * (1 - Math.exp(-rate * dt));

  const keep = Math.exp(-c.grip * surf.grip * dt);
  const drop = Math.min(Math.abs(vL) * (1 - keep), P.maxLateralDecel * dt);
  vL -= Math.sign(vL) * drop;

  // 3) Açısal hız: ağırlık hissi için hedefe üstel yaklaşır, anında dönmez
  const dir = vF >= 0 ? 1 : -1;
  const speedFactor = Math.min(1, speed / 130) * (1 - 0.18 * Math.min(1, speed / spec.maxSpeed));
  const yawTarget = c.steer * spec.turnRate * speedFactor * dir;
  c.w += (yawTarget - c.w) * (1 - Math.exp(-P.yawResponse * dt));

  // 4) Bırakınca burun gidiş yönüne döner
  if (!steering && speed > 40 && vF > 0) {
    const slipAngle = Math.atan2(vL, Math.max(vF, 60));
    c.w += slipAngle * P.alignTorque * Math.min(1, speed / 200) * dt * 2;
  }

  c.vx = vF * ca - vL * sa;
  c.vy = vF * sa + vL * ca;
  c.x += c.vx * dt;
  c.y += c.vy * dt;
  c.a += c.w * dt;

  c.forward = vF;
  c.lateral = vL;
  c.speed = speed;
  c.slip = Math.abs(vL);
  c.drifting = c.slip > P.driftLateral && speed > P.driftMinSpeed;
  if (c.flat > 0) c.flat -= dt;
}

// Bir dairenin AABB ile teması. Temas yoksa -1, varsa derinlik döner; normal out'a yazılır.
export function circleRect(cx, cy, r, rx, ry, rw, rh, out) {
  const px = cx < rx ? rx : cx > rx + rw ? rx + rw : cx;
  const py = cy < ry ? ry : cy > ry + rh ? ry + rh : cy;
  let dx = cx - px;
  let dy = cy - py;
  const d2 = dx * dx + dy * dy;
  if (d2 >= r * r) return -1;
  if (d2 > 1e-6) {
    const d = Math.sqrt(d2);
    out.nx = dx / d;
    out.ny = dy / d;
    return r - d;
  }
  // Merkez dikdörtgenin içinde: en yakın kenardan dışarı it
  const left = cx - rx;
  const right = rx + rw - cx;
  const top = cy - ry;
  const bottom = ry + rh - cy;
  const m = Math.min(left, right, top, bottom);
  if (m === left) { out.nx = -1; out.ny = 0; } else if (m === right) { out.nx = 1; out.ny = 0; } else if (m === top) { out.nx = 0; out.ny = -1; } else { out.nx = 0; out.ny = 1; }
  return r + m;
}

// Duvara çarpma: hızı normal boyunca yansıtır, darbe şiddetini döndürür.
export function bounceOff(b, nx, ny) {
  const vn = b.vx * nx + b.vy * ny;
  if (vn >= 0) return 0;
  const e = P.wallBounce;
  b.vx -= (1 + e) * vn * nx;
  b.vy -= (1 + e) * vn * ny;
  const keep = 1 - P.wallFriction;
  b.vx *= keep;
  b.vy *= keep;
  // Burun duvardan uzağa, teğete doğru döner
  const fx = Math.cos(b.a);
  const fy = Math.sin(b.a);
  b.w += (fx * ny - fy * nx) * vn * 0.008;
  return -vn;
}

export function wrapAngle(a) {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}
