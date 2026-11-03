// Polis yapay zekâsı: akış alanıyla yol bulma, kovalama, sıkıştırma, barikat, tank.
import { CONFIG, GROUND } from './config.js';
import { TILE } from './world.js';
import { wrapAngle } from './physics.js';

const COP_AI = CONFIG.policeAI;
const CHASE = CONFIG.pursuit;

// En yakın k sesi işaretler: siren sesleri üst üste binip bozulmasın
export function loudest(dists, k, mask) {
  mask.fill(0);
  for (let n = 0; n < k; n++) {
    let best = -1;
    let d = 1e8;
    for (let i = 0; i < dists.length; i++) if (!mask[i] && dists[i] < d) { d = dists[i]; best = i; }
    if (best < 0) break;
    mask[best] = 1;
  }
  return mask;
}

// Oyuncunun çevresinde 96x96 karoluk en kısa yol alanı. Binalar, su ve çıkmazlar çözülür.
export class FlowField {
  constructor(size = 96) {
    this.size = size;
    const n = size * size;
    this.cost = new Uint8Array(n);
    this.dist = new Uint16Array(n);
    this.queue = new Int32Array(n);
    this.inQueue = new Uint8Array(n);
    this.ox = 0;
    this.oy = 0;
  }

  compute(world, x, y) {
    const { size, cost, dist, queue, inQueue } = this;
    const n = size * size;
    const tx = Math.floor(x / TILE);
    const ty = Math.floor(y / TILE);
    this.ox = tx - (size >> 1);
    this.oy = ty - (size >> 1);
    world.fillCost(cost, this.ox, this.oy, size);
    dist.fill(65535);
    inQueue.fill(0);
    const start = (size >> 1) * size + (size >> 1);
    cost[start] = cost[start] || 1;
    dist[start] = 0;
    let head = 0;
    let tail = 1;
    let count = 1;
    queue[0] = start;
    inQueue[start] = 1;
    while (count > 0) {
      const i = queue[head];
      head = (head + 1) % n;
      count--;
      inQueue[i] = 0;
      const d = dist[i];
      const col = i % size;
      for (let k = 0; k < 4; k++) {
        let j;
        if (k === 0) { if (col === size - 1) continue; j = i + 1; }
        else if (k === 1) { if (col === 0) continue; j = i - 1; }
        else if (k === 2) { j = i + size; if (j >= n) continue; }
        else { j = i - size; if (j < 0) continue; }
        const c = cost[j];
        if (c === 0) continue;
        const nd = d + c;
        if (nd < dist[j]) {
          dist[j] = nd;
          if (!inQueue[j]) {
            inQueue[j] = 1;
            queue[tail] = j;
            tail = (tail + 1) % n;
            count++;
          }
        }
      }
    }
  }

  // Bulunduğu karodan birkaç adım ilerideki yol noktasını verir
  sample(x, y, out, steps = 4) {
    const { size, dist, cost } = this;
    let cx = Math.floor(x / TILE) - this.ox;
    let cy = Math.floor(y / TILE) - this.oy;
    if (cx < 1 || cy < 1 || cx >= size - 1 || cy >= size - 1) return false;
    if (dist[cy * size + cx] === 65535) {
      // Engelli karoya sürüklendiyse yanındaki açık karodan devam et
      let found = false;
      for (let d = 0; d < 4 && !found; d++) {
        const nx = cx + (d === 0 ? 1 : d === 1 ? -1 : 0);
        const ny = cy + (d === 2 ? 1 : d === 3 ? -1 : 0);
        if (dist[ny * size + nx] !== 65535) { cx = nx; cy = ny; found = true; }
      }
      if (!found) return false;
    }
    for (let s = 0; s < steps; s++) {
      let best = dist[cy * size + cx];
      let bx = cx;
      let by = cy;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
          if (dx && dy && (cost[cy * size + nx] === 0 || cost[ny * size + cx] === 0)) continue;
          const v = dist[ny * size + nx];
          if (v < best) { best = v; bx = nx; by = ny; }
        }
      }
      if (bx === cx && by === cy) break;
      cx = bx;
      cy = by;
    }
    out.x = (cx + this.ox + 0.5) * TILE;
    out.y = (cy + this.oy + 0.5) * TILE;
    return true;
  }
}

// Barikat yerleşimi. roadW: yol genişliği. Sonuç yol kenarından ölçülen merkezler.
// Boşluk her zaman minGap'ten büyüktür, gerekirse daha az araba konur.
export function planBarricade(roadW, minGap, carLen, wantSpike, random, out) {
  const slot = carLen + 4;
  let n = Math.min(3, Math.floor((roadW - minGap) / slot));
  n = Math.max(0, n);
  out.count = n;
  out.spikeFrom = 0;
  out.spikeTo = 0;
  if (n === 0) return out;
  const free = roadW - n * slot;
  const edge = random() < 0.5 ? 0 : 1; // Boşluk hangi tarafta
  const start = edge === 0 ? 0 : free;
  for (let i = 0; i < n; i++) out.slots[i] = start + slot * (i + 0.5);
  out.gapFrom = edge === 0 ? n * slot : 0;
  out.gapTo = out.gapFrom + free;
  const extra = free - minGap;
  if (wantSpike && extra > 28) {
    // Çivili şerit arabaların yanına serilir, geçiş boşluğunu daraltmaz
    if (edge === 0) {
      out.spikeFrom = n * slot;
      out.spikeTo = n * slot + extra;
      out.gapFrom += extra;
    } else {
      out.spikeFrom = free - extra;
      out.spikeTo = free;
      out.gapTo -= extra;
    }
  }
  return out;
}

export function newPlan() {
  return { count: 0, slots: [0, 0, 0], spikeFrom: 0, spikeTo: 0, gapFrom: 0, gapTo: 0 };
}

const target = { x: 0, y: 0 };

function drivePatrol(cop, g, dt) {
  const p = g.player;
  const d = g.diff;
  const dx = p.x - cop.x;
  const dy = p.y - cop.y;
  const dist = Math.hypot(dx, dy);

  // Görüş hattı her karede değil, sırayla bakılır
  if ((g.tickCount + cop.id) % 10 === 0) cop.los = dist < 900 && g.world.lineClear(cop.x, cop.y, p.x, p.y);

  const smart = cop.spec.smart * (0.55 + 0.45 * Math.min(1, d.aggression));
  const lead = Math.min(0.95, dist / Math.max(160, cop.drive.maxSpeed)) * smart;
  target.x = p.x + p.vx * lead;
  target.y = p.y + p.vy * lead;

  // Kıstırıcı: önce yanına gelir, yakındayken içeri kırar. Gelişmiş polis arka çeyreğe vurur (PIT).
  if (cop.role === 'flanker' && dist < 520) {
    const fx = Math.cos(p.a);
    const fy = Math.sin(p.a);
    // İki yandan sırayla gelir, erken safhada bulunduğu yandan
    const side = g.time >= CHASE.pincerFrom ? cop.side : (dx * -fy + dy * fx) > 0 ? -1 : 1;
    const gap = dist < 90 ? 14 : 44;
    const back = cop.type === 'advanced' ? -22 : 8;
    target.x = p.x + p.vx * 0.32 + fx * back - fy * side * gap;
    target.y = p.y + p.vy * 0.32 + fy * back + fx * side * gap;
  }

  // Önden gelen ve yol kapatan: oyuncunun gidiş çizgisindeki bir noktaya gider
  let brake = false;
  if ((cop.role === 'interceptor' || cop.role === 'blocker') && g.ghostT <= 0) {
    cop.roleT -= dt;
    const sp = Math.max(1, p.speed);
    const hx = p.vx / sp;
    const hy = p.vy / sp;
    const ahead = -(dx * hx + dy * hy);
    if (ahead < 60 || cop.roleT <= 0 || p.speed < 60) {
      cop.role = 'chaser';
    } else if (cop.role === 'blocker' && ahead < CHASE.blockDist && g.roadWidthAt(cop.x, cop.y, hx, hy) >= CHASE.blockMinRoad) {
      cop.state = 'block';
      cop.blockT = CHASE.blockTime;
      cop.blockA = Math.atan2(hy, hx) + Math.PI / 2;
    } else {
      const off = cop.role === 'interceptor' ? cop.side * CHASE.interceptOffset : 0;
      const k = Math.min(ahead * 0.6, CHASE.interceptAhead);
      target.x = p.x + hx * k - hy * off;
      target.y = p.y + hy * k + hx * off;
      brake = cop.role === 'interceptor' && ahead < CHASE.interceptBrake;
    }
  }

  if (g.ghostT > 0) {
    // Görünmezlik: oyuncuyu göremez, bulunduğu yerde rastgele dolaşır
    cop.wanderT -= dt;
    if (cop.wanderT <= 0) {
      const a = cop.a + (Math.random() - 0.5) * 2.4;
      cop.wx = cop.x + Math.cos(a) * 320;
      cop.wy = cop.y + Math.sin(a) * 320;
      cop.wanderT = 1.5 + Math.random() * 2.5;
    }
    target.x = cop.wx;
    target.y = cop.wy;
  } else if (!cop.los && g.flowReady) {
    g.flow.sample(cop.x, cop.y, target, 5);
  }

  const err = wrapAngle(Math.atan2(target.y - cop.y, target.x - cop.x) - cop.a);
  let steer = Math.max(-1, Math.min(1, err * 2.6));

  // Duvar bıyıkları: ön iki noktada engel varsa kaç
  const reach = 70 + cop.speed * 0.2;
  const ca = Math.cos(cop.a);
  const sa = Math.sin(cop.a);
  const lx = cop.x + (ca * 0.92 + sa * 0.42) * reach;
  const ly = cop.y + (sa * 0.92 - ca * 0.42) * reach;
  const rx = cop.x + (ca * 0.92 - sa * 0.42) * reach;
  const ry = cop.y + (sa * 0.92 + ca * 0.42) * reach;
  const left = g.world.blockedAt(lx, ly);
  const right = g.world.blockedAt(rx, ry);
  if (left && !right) steer = Math.min(1, steer + 0.9);
  else if (right && !left) steer = Math.max(-1, steer - 0.9);

  let throttle = 1;
  const sharp = Math.abs(err) > 1.1;
  if (sharp && cop.speed > 190) throttle = -0.35;
  if ((left && right) && cop.speed > 200) throttle = -0.5;
  if (brake) throttle = Math.min(throttle, 0.35);
  if (cop.hold) throttle = dist < 150 ? -1 : cop.speed > 70 ? -0.5 : 0; // Sıra bekler: oyuncunun çevresi tamamen kapanmaz

  // Takılma: ışınlanma yok. Geri vitese takar, burnu çevirip yeniden dener.
  if (cop.reverseT > 0) {
    cop.reverseT -= dt;
    cop.ctlS = -Math.sign(err || 1);
    cop.ctlT = -1;
    return;
  }
  if (cop.speed < 34) cop.stuckT += dt;
  else cop.stuckT = Math.max(0, cop.stuckT - dt * 2);
  if (cop.stuckT > COP_AI.stuckTime) {
    cop.stuckT = 0;
    cop.reverseT = COP_AI.reverseTime;
    cop.reverses++;
  }
  cop.ctlS = steer;
  cop.ctlT = throttle;
}

function driveTank(cop, g, dt) {
  const p = g.player;
  target.x = g.ghostT > 0 ? cop.x + Math.cos(cop.a) * 200 : p.x;
  target.y = g.ghostT > 0 ? cop.y + Math.sin(cop.a) * 200 : p.y;
  const ahead = g.world.groundAt(cop.x + Math.cos(cop.a) * 110, cop.y + Math.sin(cop.a) * 110);
  const sacred = g.world.sacredAt(cop.x + Math.cos(cop.a) * 110, cop.y + Math.sin(cop.a) * 110);
  if ((ahead === GROUND.WATER || sacred) && g.flowReady) g.flow.sample(cop.x, cop.y, target, 6);
  const err = wrapAngle(Math.atan2(target.y - cop.y, target.x - cop.x) - cop.a);
  cop.ctlS = Math.max(-1, Math.min(1, err * 2));
  cop.ctlT = Math.abs(err) > 1.4 ? 0.3 : 1;
  const aim = wrapAngle(Math.atan2(p.y - cop.y, p.x - cop.x) - cop.turret);
  cop.turret += Math.max(-1, Math.min(1, aim)) * 1.8 * dt;
}

export function driveCop(cop, g, dt) {
  if (cop.state === 'barricade') {
    cop.ctlS = 0;
    cop.ctlT = 0;
    cop.wakeT -= dt;
    const d = Math.hypot(g.player.x - cop.x, g.player.y - cop.y);
    if ((d < CONFIG.barricade.wakeDist && g.ghostT <= 0) || cop.wakeT <= 0) cop.state = 'chase';
    return;
  }
  if (cop.state === 'block') {
    // Yolun ortasında durup enine döner, oyuncu yaklaşınca ya da süre dolunca kovalamaya geçer
    cop.blockT -= dt;
    cop.ctlS = Math.max(-1, Math.min(1, wrapAngle(cop.blockA - cop.a) * 2));
    cop.ctlT = cop.speed > 60 ? -1 : 0;
    const d = Math.hypot(g.player.x - cop.x, g.player.y - cop.y);
    if (d < CONFIG.barricade.wakeDist || cop.blockT <= 0 || g.ghostT > 0) { cop.state = 'chase'; cop.role = 'chaser'; }
    return;
  }
  if (cop.flying) return;
  if (cop.type === 'tank') driveTank(cop, g, dt);
  else drivePatrol(cop, g, dt);
}
