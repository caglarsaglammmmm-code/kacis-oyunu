// Yayalar, sokak insanları, kediler, sivil trafik ve trafik ışıkları.
// Sabit havuz kullanır, sadece oyuncunun çevresinde yaşar.
import { CONFIG, GROUND } from './config.js';
import { makeBody, resetBody, stepCar, wrapAngle } from './physics.js';
import { CHUNK, TILE, isHighwayRow, HIGHWAY } from './world.js';
import { FX } from './effects.js';

const PD = CONFIG.peds;
const NP = CONFIG.npc;
const TL = CONFIG.traffic;
const HT = CONFIG.highwayTraffic;
const HWC = CONFIG.world.highway;
const ROAD_W = CONFIG.world.arterial * TILE;
const ART_MID = ROAD_W / 2;
export const PED_WALK = 0;
export const PED_RUN = 1;
export const PED_FLY = 2;
export const PED_DOWN = 3;
export const PED_WAIT = 4;
export const PED_CROSS = 5;
export const PED_IDLE = 6;

// Yönler: 0 doğu, 1 güney, 2 batı, 3 kuzey. Trafik sağdan akar.
const DX = [1, 0, -1, 0];
const DY = [0, 1, 0, -1];
const LANE = [1, -1, -1, 1];

export const PED_KIND_NAMES = Object.keys(PD.kinds);
const HW_CARS = ['tofas', 'murat', 'tog', 'bavyera', 'halka', 'yildiz', 'golf', 'focus', 'kore', 'megane', 'linea', 'pickup', 'clio', 'duster', 'grandland', 'egea'];
let pedWeight = 0;
for (const k of PED_KIND_NAMES) pedWeight += PD.kinds[k].weight;
let npcWeight = 0;
for (const k in NP.types) npcWeight += NP.types[k].weight;

// Trafik ışığı: her kavşağın kendi evresi var. axis: 0 doğu-batı, 1 kuzey-güney
export function lightState(time, jx, jy, axis) {
  const cycle = (TL.green + TL.yellow + TL.allRed) * 2;
  const offset = (((jx * 7 + jy * 13) % 16) + 16) % 16;
  const t = (time + offset + (axis ? cycle / 2 : 0)) % cycle;
  if (t < TL.green) return 'g';
  if (t < TL.green + TL.yellow) return 'y';
  return 'r';
}

export class Crowd {
  constructor(game) {
    this.g = game;
    this.peds = [];
    for (let i = 0; i < PD.max; i++) {
      this.peds.push({
        alive: false, x: 0, y: 0, a: 0, vx: 0, vy: 0, z: 0, vz: 0, spin: 0, state: 0, t: 0, turnT: 0,
        look: 0, step: 0, scale: 1, pace: 1, kind: 'man', info: PD.kinds.man, tx: 0, ty: 0, axis: 0, jx: 0, jy: 0,
      });
    }
    this.npcs = [];
    for (let i = 0; i < NP.max; i++) {
      const b = makeBody();
      b.alive = false; b.kind = 'tofas'; b.spec = null; b.state = 'drive'; b.color = 0; b.t = 0;
      b.dir = 0; b.line = 0; b.lastCross = 1e9; b.hornT = 0; b.ctlS = 0; b.ctlT = 1; b.breaker = true;
      b.panicT = 0; b.waitT = 0;
      b.drive = { maxSpeed: 0, accel: 0, turnRate: 0, grip: 0, driftGrip: 0 };
      this.npcs.push(b);
    }
    // Otoban: hafif araç havuzu
    this.hw = [];
    for (let i = 0; i < HT.count; i++) this.hw.push({ alive: false, x: 0, y: 0, a: 0, vx: 0, vy: 0, speed: 0, cruise: 0, dir: 1, lane: 0, row: 0, kind: 'taxi', color: 0, spec: null, len: 0, wid: 0, mass: 1, hitT: 0, hornT: 0 });
    this.hwT = 0;
    this.hwCount = 0;
    this.pedT = 0;
    this.npcT = 0;
    this.waitT = 0;
    this.limit = 1; // Yavaş cihazda azalır
    this.screamT = 0;
    this.meowT = 0;
    this.pedCount = 0;
    this.npcCount = 0;
    this.clock = 0;
  }

  clear() {
    for (const p of this.peds) p.alive = false;
    for (const n of this.npcs) n.alive = false;
    for (const h of this.hw) h.alive = false;
    this.hwCount = 0;
    this.pedCount = 0;
    this.npcCount = 0;
  }

  update(dt) {
    const g = this.g;
    this.clock += dt;
    this.screamT -= dt;
    this.meowT -= dt;
    this.pedT -= dt;
    if (this.pedT <= 0) { this.pedT = PD.spawnEvery; this.spawnPed(); }
    this.waitT -= dt;
    if (this.waitT <= 0) { this.waitT = PD.waiterEvery; this.spawnWaiter(); }
    this.npcT -= dt;
    if (this.npcT <= 0) { this.npcT = NP.spawnEvery; this.spawnNpc(); }

    let peds = 0;
    for (const p of this.peds) {
      if (!p.alive) continue;
      peds++;
      this.updatePed(p, dt);
    }
    this.pedCount = peds;
    let npcs = 0;
    for (const n of this.npcs) {
      if (!n.alive) continue;
      npcs++;
      this.updateNpc(n, dt, g);
    }
    this.npcCount = npcs;
    this.updateHighway(dt, g);
  }

  // --- Otoban trafiği ---
  spawnHighway(g) {
    const p = g.player;
    const cy = Math.floor(p.y / CHUNK);
    let row = null;
    for (const k of [cy, cy - 1, cy + 1]) if (isHighwayRow(k)) row = k;
    if (row === null) return;
    const mid = row * CHUNK + HIGHWAY.mid;
    if (Math.abs(p.y - mid) > HT.near) return;
    const h = this.hw.find((k) => !k.alive);
    if (!h) return;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const lane = Math.floor(Math.random() * HWC.lanes);
    const laneW = (HWC.half * TILE - 24) / HWC.lanes;
    const y = mid + dir * (HIGHWAY.mid - HIGHWAY.top - 12 - laneW * (lane + 0.5));
    const R = g.viewRadius() + 60 + Math.random() * 480;
    const x = p.x + (Math.random() < 0.5 ? -R : R);
    if (g.onScreen(x, y, 90)) return;
    for (const o of this.hw) if (o.alive && o.y === y && Math.abs(o.x - x) < 110) return;
    const m = HT.mix;
    let r = Math.random() * (m.car + m.taxi + m.minibus + m.bus + m.truck);
    let kind;
    if ((r -= m.taxi) < 0) kind = 'taxi';
    else if ((r -= m.minibus) < 0) kind = 'minibus';
    else if ((r -= m.bus) < 0) kind = 'bus';
    else if ((r -= m.truck) < 0) kind = 'truck';
    else kind = HW_CARS[Math.floor(Math.random() * HW_CARS.length)];
    const spec = NP.types[kind];
    const heavy = kind === 'truck' || kind === 'bus';
    const [a, b] = heavy ? HT.truckSpeed : HT.speed;
    h.alive = true; h.x = x; h.y = y; h.dir = dir; h.lane = lane; h.row = row;
    h.kind = kind; h.spec = spec; h.color = Math.floor(Math.random() * spec.colors.length);
    h.len = spec.len; h.wid = spec.wid; h.mass = spec.mass;
    h.a = dir > 0 ? 0 : Math.PI;
    // İç şerit daha hızlı akar
    h.cruise = a + (b - a) * ((HWC.lanes - lane) / HWC.lanes) * (0.8 + Math.random() * 0.2);
    h.speed = h.cruise; h.hitT = 0; h.hornT = 0;
    h.vx = dir * h.speed; h.vy = 0;
  }

  updateHighway(dt, g) {
    this.hwT -= dt;
    if (this.hwT <= 0) {
      this.hwT = HT.spawnEvery;
      if (this.hwCount < HT.count * this.limit) this.spawnHighway(g);
    }
    const p = g.player;
    const hw = this.hw;
    const tick = g.tickCount;
    let n = 0;
    for (let i = 0; i < hw.length; i++) {
      const h = hw[i];
      if (!h.alive) continue;
      n++;
      if (Math.abs(h.x - p.x) > HT.range || Math.abs(h.y - p.y) > HT.range) { h.alive = false; continue; }
      // Öndeki aracı sırayla kontrol eder: her kare hepsi değil
      if ((tick + i) % 5 === 0) {
        let gap = 1e9; let lead = 0;
        for (let j = 0; j < hw.length; j++) {
          const o = hw[j];
          if (!o.alive || o.y !== h.y || j === i) continue;
          const d = (o.x - h.x) * h.dir;
          if (d > 0 && d < gap) { gap = d; lead = o.speed; }
        }
        const pd = (p.x - h.x) * h.dir;
        if (Math.abs(p.y - h.y) < 26 && pd > 0 && pd < gap) {
          gap = pd; lead = Math.max(0, (p.vx || 0) * h.dir);
          if (pd < HT.hornDist && h.hornT <= 0 && g.state === 'play') { h.hornT = 3; g.emit('horn', h.spec.horn); }
        }
        h.limit = gap < (h.len + 40) / 2 + HT.safeGap + h.speed * 0.28 ? lead : 1e9;
      }
      if (h.hornT > 0) h.hornT -= dt;
      const want = h.hitT > 0 ? 0 : Math.min(h.cruise, h.limit ?? 1e9);
      if (h.hitT > 0) h.hitT -= dt;
      h.speed += Math.max(-HT.brake * dt, Math.min(HT.accel * dt, want - h.speed));
      if (h.speed < 0) h.speed = 0;
      h.vx = h.dir * h.speed;
      h.x += h.vx * dt;
      const dx = h.x - p.x;
      const dy = h.y - p.y;
      const reach = (h.len + p.len) * 0.62;
      if (g.state === 'play' && dx * dx + dy * dy < reach * reach) {
        const y = h.y;
        const rv = g.collideCars(p, h);
        h.y = y; h.vy = 0;
        if (rv > 30) {
          h.hitT = 2.5;
          g.fx.sparks((h.x + p.x) / 2, (h.y + p.y) / 2, 8);
          g.npcHits++;
          g.playerImpact(rv + 30, HT.hitScale * Math.min(2, Math.sqrt(h.mass)), true, HT.maxHit);
        }
      }
      if ((tick + i) % 3 === 0 && h.y > p.y - 1000 && h.y < p.y + 1000) {
        for (const c of g.cops) {
          if (c.flying) continue;
          const ax = c.x - h.x; const ay = c.y - h.y;
          const r2 = (c.len + h.len) * 0.55;
          if (ax * ax + ay * ay > r2 * r2) continue;
          const y = h.y;
          const rv = g.collideCars(c, h);
          h.y = y; h.vy = 0;
          if (rv > 50) { c.hp -= rv * 0.04; h.hitT = 2; }
        }
      }
    }
    this.hwCount = n;
  }

  // --- Yayalar ---
  pickKind() {
    let r = Math.random() * pedWeight;
    for (const k of PED_KIND_NAMES) {
      r -= PD.kinds[k].weight;
      if (r < 0) return k;
    }
    return 'man';
  }

  setupPed(p, kind, x, y, a) {
    p.alive = true;
    p.kind = kind;
    p.info = PD.kinds[kind];
    p.x = x; p.y = y; p.z = 0;
    p.a = a;
    p.state = PED_WALK;
    p.t = 0; p.turnT = 1 + Math.random() * 3; p.step = Math.random() * 6;
    const half = PD.looks >> 1;
    p.look = Math.floor(Math.random() * half) + (kind === 'woman' ? half : 0);
    p.scale = 0.84 + Math.random() * 0.32; // Boy farkı
    p.pace = 0.75 + Math.random() * 0.55; // Yürüyüş hızı farkı
    p.curb = false;
  }

  spawnPed() {
    const g = this.g;
    if (this.pedCount >= PD.max * this.limit) return;
    const p = this.peds.find((k) => !k.alive);
    if (!p) return;
    const pl = g.player;
    const R = g.viewRadius();
    const kind = this.pickKind();
    // Yarısı ana yol kenarındaki kaldırım bandında yürür: bina yoğun, boş alan az
    if (!PD.kinds[kind].road && kind !== 'cat' && Math.random() < PD.curbShare && this.spawnCurb(p, kind, pl, R)) return;
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * 6.283;
      const r = R * (0.75 + Math.random() * 0.55);
      const x = pl.x + Math.cos(a) * r;
      const y = pl.y + Math.sin(a) * r;
      if (g.onScreen(x, y, 30)) continue;
      const gr = g.world.groundAt(x, y);
      const chance = gr === GROUND.ROAD && PD.kinds[kind].road ? 1 : PD.density[gr] || 0;
      if (Math.random() > chance || g.world.blockedAt(x, y)) continue;
      this.setupPed(p, kind, x, y, Math.floor(Math.random() * 4) * 1.5708);
      // Bazıları dükkân önünde durur, sohbet eder
      if (!PD.kinds[kind].road && kind !== 'cat' && (gr === GROUND.WALK || gr === GROUND.ALLEY) && Math.random() < PD.idleChance) p.state = PED_IDLE;
      return;
    }
  }

  spawnCurb(p, kind, pl, R) {
    const g = this.g;
    const along = (Math.random() < 0.5 ? -1 : 1) * R * (0.75 + Math.random() * 0.5);
    const vertical = Math.random() < 0.5;
    const base = Math.floor((vertical ? pl.x : pl.y) / CHUNK) + Math.floor(Math.random() * 3) - 1;
    const line = base * CHUNK + ROAD_W - 6;
    const x = vertical ? line : pl.x + along;
    const y = vertical ? pl.y + along : line;
    const at = ((vertical ? y : x) % CHUNK + CHUNK) % CHUNK;
    if (at < ROAD_W + 30 || g.onScreen(x, y, 30)) return false;
    if (g.world.blockedAt(x, y) || g.world.chunk(Math.floor(x / CHUNK), Math.floor(y / CHUNK)).biome !== 'city') return false;
    const dir = Math.random() < 0.5 ? 1 : -1;
    this.setupPed(p, kind, x, y, vertical ? (dir > 0 ? 1.5708 : -1.5708) : (dir > 0 ? 0 : 3.1416));
    p.curb = true;
    if (Math.random() < PD.idleChance) p.state = PED_IDLE;
    return true;
  }

  // Kavşakta yaya geçidi önünde bekleyen yaya: arabalara kırmızı yanınca karşıya geçer
  spawnWaiter() {
    const g = this.g;
    if (this.pedCount >= PD.max * this.limit) return;
    const p = this.peds.find((k) => !k.alive);
    if (!p) return;
    const pl = g.player;
    const jx = Math.floor(pl.x / CHUNK) + Math.floor(Math.random() * 3) - 1;
    const jy = Math.floor(pl.y / CHUNK) + Math.floor(Math.random() * 3) - 1;
    const c = g.world.chunk(jx, jy);
    if (c.biome !== 'city') return;
    const vertical = Math.random() < 0.5; // Dikey ana yolu mu geçiyor
    const flip = Math.random() < 0.5;
    const a = -18;
    const b = ROAD_W + 18;
    const along = ROAD_W + 13;
    const fromS = flip ? b : a;
    const toS = flip ? a : b;
    const x = c.x + (vertical ? fromS : along);
    const y = c.y + (vertical ? along : fromS);
    const tx = c.x + (vertical ? toS : along);
    const ty = c.y + (vertical ? along : toS);
    if (g.onScreen(x, y, 40) || g.world.blockedAt(x, y) || g.world.blockedAt(tx, ty)) return;
    let kind = this.pickKind();
    if (PD.kinds[kind].road || PD.kinds[kind].dodge) kind = 'man';
    this.setupPed(p, kind, x, y, Math.atan2(ty - y, tx - x));
    p.state = PED_WAIT;
    p.tx = tx; p.ty = ty;
    p.axis = vertical ? 1 : 0;
    p.jx = jx; p.jy = jy;
    p.t = 14;
  }

  launch(p, b, scream) {
    const g = this.g;
    const dx = p.x - b.x;
    const dy = p.y - b.y;
    const d = Math.hypot(dx, dy) || 1;
    p.state = PED_FLY;
    p.vx = b.vx * 0.85 + (dx / d) * PD.launch;
    p.vy = b.vy * 0.85 + (dy / d) * PD.launch;
    p.vz = PD.launchUp * (0.8 + Math.random() * 0.4);
    p.spin = (Math.random() < 0.5 ? -1 : 1) * (9 + Math.random() * 8);
    g.fx.burst(FX.GLINT, p.x, p.y, 7, 150, 0.45, 4); // Çizgi film yıldızları
    g.fx.burst(FX.DUST, p.x, p.y, 4, 60, 0.5, 8);
    const info = p.info;
    if (info.fx === 'simit') {
      g.fx.burst(FX.SIMIT, p.x, p.y, 12, 240, 1.3, 7);
      g.emit('simit');
    } else if (info.fx === 'tea') {
      g.fx.debris(p.x, p.y, '#c9622b', 6, 200);
      g.fx.debris(p.x, p.y, '#e8f3ff', 6, 240);
      g.emit('tea');
    }
    if (scream && this.screamT <= 0) {
      this.screamT = 0.2;
      g.lastVoice = info.voice;
      g.emit('scream', Math.min(1, 500 / (Math.hypot(p.x - g.player.x, p.y - g.player.y) + 200)));
      const words = info.words || PD.words[info.voice];
      if (Math.random() < 0.6) g.fx.float(p.x, p.y - 16, words[Math.floor(Math.random() * words.length)], '#ffffff');
    }
    g.emit('thud');
  }

  blockedForPed(p, x, y) {
    const w = this.g.world;
    return w.blockedAt(x, y) || (!p.info.road && !p.curb && w.groundAt(x, y) === GROUND.ROAD);
  }

  updatePed(p, dt) {
    const g = this.g;
    const pl = g.player;
    if (Math.abs(p.x - pl.x) > PD.despawn || Math.abs(p.y - pl.y) > PD.despawn) { p.alive = false; return; }

    if (p.state === PED_FLY) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.a += p.spin * dt;
      p.z += p.vz * dt;
      p.vz -= PD.gravity * dt;
      p.vx *= 1 - 0.8 * dt;
      p.vy *= 1 - 0.8 * dt;
      if (p.z <= 0) {
        p.z = 0;
        if (p.vz < -220) {
          p.vz *= -0.35; // Bir kez sekerek düşer
        } else {
          p.state = PED_DOWN;
          p.t = PD.downTime;
        }
      }
      return;
    }
    if (p.state === PED_DOWN) {
      p.t -= dt;
      if (p.t <= 0) { p.state = PED_RUN; p.turnT = 2; }
      return;
    }

    // Araç tehlikesi: kaç, çarpılırsa uç
    if (this.checkHit(p, pl, g.state === 'play')) return;
    for (const c of g.cops) {
      if (Math.abs(c.x - p.x) < 60 && Math.abs(c.y - p.y) < 60 && this.checkHit(p, c, false)) return;
    }
    for (const n of this.npcs) {
      if (n.alive && Math.abs(n.x - p.x) < 80 && Math.abs(n.y - p.y) < 80 && this.checkHit(p, n, false)) return;
    }

    if (p.state === PED_IDLE) {
      const ix = p.x - pl.x;
      const iy = p.y - pl.y;
      if (ix * ix + iy * iy < PD.fearDist * PD.fearDist && pl.speed > 150 && g.state === 'play') {
        p.state = PED_RUN;
        p.a = Math.atan2(iy, ix);
        p.turnT = 1.6;
      }
      return;
    }
    if (p.state === PED_WAIT) {
      p.t -= dt;
      if (lightState(this.clock, p.jx, p.jy, p.axis) === 'r') p.state = PED_CROSS;
      else if (p.t <= 0) p.state = PED_WALK;
      return;
    }
    if (p.state === PED_CROSS) {
      const dx = p.tx - p.x;
      const dy = p.ty - p.y;
      const d = Math.hypot(dx, dy);
      if (d < 8) { p.state = PED_WALK; return; }
      const v = PD.walkSpeed * 2.1 * dt;
      p.x += (dx / d) * v;
      p.y += (dy / d) * v;
      p.step += dt * 16;
      return;
    }

    const dx = p.x - pl.x;
    const dy = p.y - pl.y;
    const d2 = dx * dx + dy * dy;
    const fear = PD.fearDist * PD.fearDist;
    if (d2 < fear && pl.speed > 150 && p.state === PED_WALK && g.state === 'play') {
      p.state = PED_RUN;
      p.a = Math.atan2(dy, dx) + (Math.random() - 0.5);
      p.turnT = 1.6;
      if (this.screamT <= 0 && Math.random() < 0.35) {
        this.screamT = 0.5;
        g.lastVoice = p.info.voice;
        g.emit('scream', 0.45);
      }
    }
    const speed = (p.state === PED_RUN ? PD.runSpeed : PD.walkSpeed * p.info.speed) * p.pace;
    const nx = p.x + Math.cos(p.a) * speed * dt;
    const ny = p.y + Math.sin(p.a) * speed * dt;
    const lookX = p.x + Math.cos(p.a) * 16;
    const lookY = p.y + Math.sin(p.a) * 16;
    if (p.state === PED_WALK ? this.blockedForPed(p, lookX, lookY) : g.world.blockedAt(lookX, lookY)) {
      p.a += p.curb ? 3.1416 : (Math.random() < 0.5 ? 1 : -1) * 1.5708;
      p.turnT = 1 + Math.random() * 3;
    } else {
      p.x = nx;
      p.y = ny;
    }
    if (p.curb && p.state === PED_WALK) {
      // Kavşağa gelince geri döner, kaldırımdan yola inmez
      const at = ((Math.abs(Math.cos(p.a)) > 0.5 ? p.x : p.y) % CHUNK + CHUNK) % CHUNK;
      if (at < ROAD_W + 26 && p.turnT < 90) { p.a += 3.1416; p.x += Math.cos(p.a) * 30; p.y += Math.sin(p.a) * 30; }
    }
    p.step += dt * (speed * 0.3);
    p.turnT -= dt;
    if (p.turnT <= 0) {
      p.turnT = 1.5 + Math.random() * 4;
      if (p.state === PED_RUN) p.state = PED_WALK;
      else if (!p.curb) p.a += (Math.floor(Math.random() * 3) - 1) * 1.5708;
    }
  }

  checkHit(p, b, isPlayer) {
    const r = b.len * 0.44 + 7;
    const dx = p.x - b.x;
    const dy = p.y - b.y;
    if (dx * dx + dy * dy >= r * r) return false;
    const speed = Math.hypot(b.vx, b.vy);
    // Kedi ezilmez: son anda sıçrar
    if (p.info.dodge) {
      const d = Math.hypot(dx, dy) || 1;
      p.x += (dx / d) * 34;
      p.y += (dy / d) * 34;
      p.a = Math.atan2(dy, dx);
      p.state = PED_RUN;
      p.turnT = 1.4;
      if (this.meowT <= 0) {
        this.meowT = 1;
        this.g.lastVoice = 'cat';
        this.g.emit('scream', 0.5);
      }
      return false;
    }
    if (speed < PD.hitSpeed) {
      p.a = Math.atan2(dy, dx);
      p.state = PED_RUN;
      p.turnT = 1.2;
      return false;
    }
    this.launch(p, b, true);
    if (isPlayer) this.g.pedHits++;
    return true;
  }

  blast(x, y, R) {
    for (const p of this.peds) {
      if (!p.alive || p.state === PED_FLY || p.info.dodge) continue;
      if (Math.hypot(p.x - x, p.y - y) < R * 0.6) this.launch(p, { x, y, vx: 0, vy: 0 }, true);
    }
    const g = this.g;
    for (const n of this.npcs) {
      if (!n.alive) continue;
      if (Math.hypot(n.x - x, n.y - y) < R) this.explodeNpc(n);
    }
    g.cam.shake = Math.max(g.cam.shake, 22);
  }

  explodeNpc(n) {
    const g = this.g;
    g.fx.explosion(n.x, n.y, 60);
    g.fx.debris(n.x, n.y, n.spec.colors[n.color], 12, 260);
    n.alive = false;
  }

  // --- Sivil trafik ---
  spawnNpc() {
    const g = this.g;
    if (this.npcCount >= NP.max * this.limit) return;
    const n = this.npcs.find((k) => !k.alive);
    if (!n) return;
    const p = g.player;
    const R = g.viewRadius() + 120 + Math.random() * 400;
    const dir = Math.floor(Math.random() * 4);
    // Oyuncuya yakın bir ana yol çizgisi seç
    const horizontal = dir === 0 || dir === 2;
    const base = horizontal ? p.y : p.x;
    const line = (Math.floor(base / CHUNK) + Math.floor(Math.random() * 3) - 1) * CHUNK + ART_MID;
    const back = Math.random() < 0.5 ? R : -R; // Önden ya da arkadan girer
    const x = horizontal ? p.x + back : line + LANE[dir] * NP.laneOffset;
    const y = horizontal ? line + LANE[dir] * NP.laneOffset : p.y + back;
    if (g.onScreen(x, y, 100)) return;
    // Dikey ana yol otoban bandına araç bırakmaz
    if (!horizontal) {
      const row = Math.floor(y / CHUNK);
      const ly = y - row * CHUNK;
      if (isHighwayRow(row) && ly > HIGHWAY.top - 60) return;
    }
    for (const o of this.npcs) if (o.alive && Math.hypot(o.x - x, o.y - y) < 180) return;

    let r = Math.random() * npcWeight;
    let kind = 'tofas';
    for (const k in NP.types) {
      r -= NP.types[k].weight;
      if (r < 0) { kind = k; break; }
    }
    const spec = NP.types[kind];
    resetBody(n, x, y, dir * 1.5708, spec);
    n.alive = true;
    n.kind = kind;
    n.spec = spec;
    n.state = 'drive';
    n.dir = dir;
    n.line = line;
    n.color = Math.floor(Math.random() * spec.colors.length);
    n.t = 0;
    n.lastCross = 1e9;
    n.hornT = 0;
    n.panicT = 0;
    n.waitT = 0;
    n.drive.maxSpeed = spec.cruise * (0.9 + Math.random() * 0.2);
    n.drive.accel = 260;
    n.drive.turnRate = spec.turnRate;
    n.drive.grip = spec.grip;
    n.drive.driftGrip = spec.grip;
    n.vx = DX[n.dir] * n.drive.maxSpeed;
    n.vy = DY[n.dir] * n.drive.maxSpeed;
  }

  // Öndeki kavşağa uzaklık. Kavşağa gelince bazen sağa ya da sola döner
  crossing(n) {
    const horizontal = n.dir === 0 || n.dir === 2;
    const forward = n.dir === 0 || n.dir === 1;
    const pos = horizontal ? n.x : n.y;
    const u = (pos - ART_MID) / CHUNK;
    const k = forward ? Math.ceil(u) : Math.floor(u);
    const center = k * CHUNK + ART_MID;
    const ahead = (center - pos) * (forward ? 1 : -1);
    if (ahead < 70 && n.lastCross !== k) {
      n.lastCross = k;
      // Otobana inen kol yok: dikey trafik bandın önünde döner
      const hwAhead = !horizontal && (forward ? isHighwayRow(k) : isHighwayRow(k - 1));
      if (hwAhead || Math.random() < NP.turnChance) {
        n.dir = (n.dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
        n.line = center;
        n.lastCross = 1e9;
        return 1e9;
      }
    }
    n.jk = k;
    return ahead;
  }

  hold(n) {
    n.ctlS = 0;
    if (n.speed > 14) n.ctlT = -0.75;
    else { n.ctlT = 0; n.vx *= 0.8; n.vy *= 0.8; }
  }

  updateNpc(n, dt, g) {
    const p = g.player;
    const far = Math.max(Math.abs(n.x - p.x), Math.abs(n.y - p.y));
    if (far > NP.despawn) { n.alive = false; return; }
    n.t += dt;
    if (n.hornT > 0) n.hornT -= dt;

    if (n.state === 'drive') this.driveNpc(n, dt, g);
    else {
      n.ctlS = 0;
      n.ctlT = 0;
      n.grip = Math.min(n.grip, 1.2); // Savrulurken lastik tutmaz
      if (n.t > 2 && Math.random() < 0.08) g.fx.spawn(FX.SMOKE, n.x, n.y, 0, 0, 0.9, 11);
    }
    const surf = CONFIG.surfaces[g.world.groundAt(n.x, n.y)];
    stepCar(n, n.ctlS, n.ctlT, n.drive, surf, dt);
    g.collideWorld(n, false);
    if ((g.tickCount + n.dir) % 4 < 1 && g.onScreen(n.x, n.y, 120)) g.collideProps(n, false);

    // Oyuncuyla çarpışma
    if (g.state === 'play' && far < (n.len + p.len) * 0.8) {
      const rv = g.collideCars(p, n);
      if (rv > 30) this.hitNpc(n, rv, true);
    }
    // Polislerle çarpışma
    for (const c of g.cops) {
      const dx = c.x - n.x;
      const dy = c.y - n.y;
      const r = (c.len + n.len) * 0.6;
      if (dx * dx + dy * dy > r * r) continue;
      const rv = g.collideCars(c, n);
      if (rv > 50) {
        this.hitNpc(n, rv, false);
        c.hp -= rv * 0.03;
      }
    }
  }

  driveNpc(n, dt, g) {
    const p = g.player;
    const ahead = this.crossing(n);
    const horizontal = n.dir === 0 || n.dir === 2;

    // Panik: siren ya da hızlı oyuncu yaklaşınca kenara kaçar, korna çalar, ışık dinlemez
    if (n.panicT > 0) n.panicT -= dt;
    let threat = g.state === 'play' && p.speed > NP.panicSpeed && Math.hypot(p.x - n.x, p.y - n.y) < NP.panicDist;
    if (!threat && g.state === 'play') {
      for (const c of g.cops) {
        if (Math.abs(c.x - n.x) < NP.panicDist && Math.abs(c.y - n.y) < NP.panicDist && c.state === 'chase') { threat = true; break; }
      }
    }
    if (threat) {
      if (n.panicT <= 0 && n.hornT <= 0) {
        n.hornT = 2.5;
        g.emit('horn', n.spec.horn);
      }
      n.panicT = NP.panicTime;
    }
    const panic = n.panicT > 0;
    const offset = panic ? NP.panicLane : NP.laneOffset;
    const lane = n.line + LANE[n.dir] * offset;
    const tx = horizontal ? n.x + DX[n.dir] * 90 : lane;
    const ty = horizontal ? lane : n.y + DY[n.dir] * 90;
    const err = wrapAngle(Math.atan2(ty - n.y, tx - n.x) - n.a);
    const top = n.drive.maxSpeed * (panic ? NP.panicBoost : 1);
    n.ctlS = Math.max(-1, Math.min(1, err * 2.4));
    n.ctlT = Math.abs(err) > 0.5 && n.speed > 110 ? -0.4 : n.speed < top ? 1 : 0;

    // Öndeki araç
    const fx = Math.cos(n.a);
    const fy = Math.sin(n.a);
    let blocked = false;
    for (const o of this.npcs) {
      if (o === n || !o.alive) continue;
      const ax = o.x - n.x;
      const ay = o.y - n.y;
      const front = ax * fx + ay * fy;
      const gap = (n.len + o.len) / 2 + 26 + n.speed * 0.22;
      if (front > 0 && front < gap && Math.abs(-ax * fy + ay * fx) < 26) { blocked = true; break; }
    }

    // Trafik ışığı: yalnızca şehir kavşaklarında
    let waiting = false;
    if (ahead < 1e8 && !panic) {
      const stopDist = ahead - TL.stopLine;
      const need = (n.speed * n.speed) / (2 * TL.brake) + 18;
      if (stopDist > -4 && stopDist < need) {
        const jx = horizontal ? n.jk : Math.floor(n.line / CHUNK);
        const jy = horizontal ? Math.floor(n.line / CHUNK) : n.jk;
        if (g.world.chunk(jx, jy).biome === 'city' && lightState(this.clock, jx, jy, horizontal ? 0 : 1) !== 'g') waiting = true;
      }
    }
    if (waiting || blocked) this.hold(n);

    // Önündeki oyuncuya fren ve korna
    const ax = p.x - n.x;
    const ay = p.y - n.y;
    const front = ax * fx + ay * fy;
    const side = Math.abs(-ax * fy + ay * fx);
    if (front > 0 && front < 150 + n.len && side < 34 && !panic) {
      n.ctlT = -0.8;
      if (n.hornT <= 0 && g.state === 'play') {
        n.hornT = 3;
        g.emit('horn', n.spec.horn);
      }
    }

    // Işıkta bekleyen sabırsız korna
    if (n.speed < 20 && (waiting || blocked)) {
      n.waitT += dt;
      if (n.waitT > TL.hornAfter && n.hornT <= 0 && Math.random() < dt * TL.hornRate && Math.hypot(ax, ay) < 900) {
        n.hornT = 2;
        g.emit('horn', n.spec.horn);
      }
    } else {
      n.waitT = 0;
    }
  }

  hitNpc(n, rv, byPlayer) {
    const g = this.g;
    if (n.state !== 'wreck') { n.state = 'wreck'; n.t = 0; }
    n.w += (Math.random() < 0.5 ? -1 : 1) * Math.min(5, rv / 90) / Math.sqrt(n.mass);
    g.fx.sparks(n.x, n.y, 8);
    g.fx.debris(n.x, n.y, n.spec.colors[n.color], 4);
    if (byPlayer) {
      g.npcHits++;
      g.playerImpact(rv + 30, NP.hitScale * Math.min(2, Math.sqrt(n.mass)), true, NP.maxHit);
      if (g.giantT > 0) { n.vx *= 1.6; n.vy *= 1.6; }
    }
  }
}
