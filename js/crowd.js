// Yayalar ve sivil trafik. Sabit havuz kullanır, sadece oyuncunun çevresinde yaşar.
import { CONFIG, GROUND } from './config.js';
import { makeBody, resetBody, stepCar, wrapAngle } from './physics.js';
import { CHUNK, TILE } from './world.js';
import { FX } from './effects.js';

const PD = CONFIG.peds;
const NP = CONFIG.npc;
const ART_MID = (CONFIG.world.arterial * TILE) / 2;
export const PED_WALK = 0;
export const PED_RUN = 1;
export const PED_FLY = 2;
export const PED_DOWN = 3;

// Yönler: 0 doğu, 1 güney, 2 batı, 3 kuzey. Trafik sağdan akar.
const DX = [1, 0, -1, 0];
const DY = [0, 1, 0, -1];
const LANE = [1, -1, -1, 1];

export class Crowd {
  constructor(game) {
    this.g = game;
    this.peds = [];
    for (let i = 0; i < PD.max; i++) {
      this.peds.push({ alive: false, x: 0, y: 0, a: 0, vx: 0, vy: 0, z: 0, vz: 0, spin: 0, state: 0, t: 0, turnT: 0, look: 0, step: 0 });
    }
    this.npcs = [];
    for (let i = 0; i < NP.max; i++) {
      const b = makeBody();
      b.alive = false; b.kind = 'sedan'; b.spec = null; b.state = 'drive'; b.color = 0; b.t = 0;
      b.dir = 0; b.line = 0; b.lastCross = 1e9; b.hornT = 0; b.ctlS = 0; b.ctlT = 1; b.breaker = true;
      b.drive = { maxSpeed: 0, accel: 0, turnRate: 0, grip: 0, driftGrip: 0 };
      this.npcs.push(b);
    }
    this.pedT = 0;
    this.npcT = 0;
    this.limit = 1; // Yavaş cihazda azalır
    this.screamT = 0;
    this.pedCount = 0;
    this.npcCount = 0;
  }

  clear() {
    for (const p of this.peds) p.alive = false;
    for (const n of this.npcs) n.alive = false;
    this.pedCount = 0;
    this.npcCount = 0;
  }

  update(dt) {
    const g = this.g;
    this.screamT -= dt;
    this.pedT -= dt;
    if (this.pedT <= 0) { this.pedT = PD.spawnEvery; this.spawnPed(); }
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
  }

  // --- Yayalar ---
  spawnPed() {
    const g = this.g;
    if (this.pedCount >= PD.max * this.limit) return;
    const p = this.peds.find((k) => !k.alive);
    if (!p) return;
    const pl = g.player;
    const R = g.viewRadius();
    for (let i = 0; i < 6; i++) {
      const a = Math.random() * 6.283;
      const r = R * (0.75 + Math.random() * 0.55);
      const x = pl.x + Math.cos(a) * r;
      const y = pl.y + Math.sin(a) * r;
      if (g.onScreen(x, y, 30)) continue;
      const gr = g.world.groundAt(x, y);
      const chance = PD.density[gr] || 0;
      if (Math.random() > chance || g.world.blockedAt(x, y)) continue;
      p.alive = true;
      p.x = x; p.y = y; p.z = 0;
      p.a = Math.floor(Math.random() * 4) * 1.5708;
      p.state = PED_WALK;
      p.t = 0; p.turnT = 1 + Math.random() * 3; p.step = Math.random() * 6;
      p.look = Math.floor(Math.random() * 6);
      return;
    }
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
    g.fx.burst(FX.GLINT, p.x, p.y, 6, 150, 0.4, 4);
    g.fx.burst(FX.DUST, p.x, p.y, 4, 60, 0.5, 8);
    if (scream && this.screamT <= 0) {
      this.screamT = 0.22;
      g.emit('scream', Math.min(1, 500 / (Math.hypot(p.x - g.player.x, p.y - g.player.y) + 200)));
      if (Math.random() < 0.4) g.fx.float(p.x, p.y - 16, 'AAAH!', '#ffffff');
    }
    g.emit('thud');
  }

  blockedForPed(x, y) {
    const w = this.g.world;
    return w.blockedAt(x, y) || w.groundAt(x, y) === GROUND.ROAD;
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
        g.emit('scream', 0.45);
      }
    }
    const speed = p.state === PED_RUN ? PD.runSpeed : PD.walkSpeed;
    const nx = p.x + Math.cos(p.a) * speed * dt;
    const ny = p.y + Math.sin(p.a) * speed * dt;
    const lookX = p.x + Math.cos(p.a) * 16;
    const lookY = p.y + Math.sin(p.a) * 16;
    if (p.state === PED_WALK ? this.blockedForPed(lookX, lookY) : g.world.blockedAt(lookX, lookY)) {
      p.a += (Math.random() < 0.5 ? 1 : -1) * 1.5708;
      p.turnT = 1 + Math.random() * 3;
    } else {
      p.x = nx;
      p.y = ny;
    }
    p.step += dt * (speed * 0.3);
    p.turnT -= dt;
    if (p.turnT <= 0) {
      p.turnT = 1.5 + Math.random() * 4;
      if (p.state === PED_RUN) p.state = PED_WALK;
      else p.a += (Math.floor(Math.random() * 3) - 1) * 1.5708;
    }
  }

  checkHit(p, b, isPlayer) {
    const r = b.len * 0.44 + 7;
    const dx = p.x - b.x;
    const dy = p.y - b.y;
    if (dx * dx + dy * dy >= r * r) return false;
    const speed = Math.hypot(b.vx, b.vy);
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
      if (!p.alive || p.state === PED_FLY) continue;
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
    g.fx.debris(n.x, n.y, NP.colors[n.color], 12, 260);
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
    for (const o of this.npcs) if (o.alive && Math.hypot(o.x - x, o.y - y) < 180) return;

    let r = Math.random() * NP.totalWeight;
    let kind = 'sedan';
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
    n.color = Math.floor(Math.random() * NP.colors.length);
    n.t = 0;
    n.lastCross = 1e9;
    n.hornT = 0;
    n.drive.maxSpeed = spec.cruise * (0.9 + Math.random() * 0.2);
    n.drive.accel = 260;
    n.drive.turnRate = spec.turnRate;
    n.drive.grip = spec.grip;
    n.drive.driftGrip = spec.grip;
    n.vx = DX[dir] * n.drive.maxSpeed;
    n.vy = DY[dir] * n.drive.maxSpeed;
  }

  // Kavşağa gelince bazen sağa ya da sola döner
  crossing(n) {
    const horizontal = n.dir === 0 || n.dir === 2;
    const pos = horizontal ? n.x : n.y;
    const k = Math.round((pos - ART_MID) / CHUNK);
    const center = k * CHUNK + ART_MID;
    const ahead = (center - pos) * (n.dir === 0 || n.dir === 1 ? 1 : -1);
    if (ahead < 70 && ahead > 0 && n.lastCross !== k) {
      n.lastCross = k;
      if (Math.random() < NP.turnChance) {
        n.dir = (n.dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
        n.line = center;
        n.lastCross = 1e9;
      }
    }
  }

  updateNpc(n, dt, g) {
    const p = g.player;
    const far = Math.max(Math.abs(n.x - p.x), Math.abs(n.y - p.y));
    if (far > NP.despawn) { n.alive = false; return; }
    n.t += dt;
    if (n.hornT > 0) n.hornT -= dt;

    if (n.state === 'drive') {
      this.crossing(n);
      const lane = n.line + LANE[n.dir] * NP.laneOffset;
      const horizontal = n.dir === 0 || n.dir === 2;
      const tx = horizontal ? n.x + DX[n.dir] * 90 : lane;
      const ty = horizontal ? lane : n.y + DY[n.dir] * 90;
      const err = wrapAngle(Math.atan2(ty - n.y, tx - n.x) - n.a);
      n.ctlS = Math.max(-1, Math.min(1, err * 2.4));
      n.ctlT = Math.abs(err) > 0.5 && n.speed > 110 ? -0.4 : n.speed < n.drive.maxSpeed ? 1 : 0;
      // Önündeki oyuncuya fren ve korna
      const fx = Math.cos(n.a);
      const fy = Math.sin(n.a);
      const ax = p.x - n.x;
      const ay = p.y - n.y;
      const front = ax * fx + ay * fy;
      const side = Math.abs(-ax * fy + ay * fx);
      if (front > 0 && front < 150 + n.len && side < 34) {
        n.ctlT = -0.8;
        if (n.hornT <= 0 && g.state === 'play') {
          n.hornT = 3;
          g.emit('horn', n.kind === 'bus' || n.kind === 'truck' ? 1 : 0);
        }
      }
    } else {
      n.ctlS = 0;
      n.ctlT = 0;
      n.grip = Math.min(n.grip, 1.2); // Savrulurken lastik tutmaz
      if (n.t > 2 && Math.random() < 0.08) g.fx.spawn(FX.SMOKE, n.x, n.y, 0, 0, 0.9, 11);
    }
    const surf = CONFIG.surfaces[g.world.groundAt(n.x, n.y)];
    stepCar(n, n.ctlS, n.ctlT, n.drive, surf, dt);
    g.collideWorld(n, false);
    if ((g.tickCount + n.line) % 4 < 1 && g.onScreen(n.x, n.y, 120)) g.collideProps(n, false);

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

  hitNpc(n, rv, byPlayer) {
    const g = this.g;
    if (n.state !== 'wreck') { n.state = 'wreck'; n.t = 0; }
    n.w += (Math.random() < 0.5 ? -1 : 1) * Math.min(5, rv / 90) / Math.sqrt(n.mass);
    g.fx.sparks(n.x, n.y, 8);
    g.fx.debris(n.x, n.y, NP.colors[n.color], 4);
    if (byPlayer) {
      g.npcHits++;
      g.playerImpact(rv + 30, NP.hitScale * Math.min(2, Math.sqrt(n.mass)), true, NP.maxHit);
      if (g.giantT > 0) { n.vx *= 1.6; n.vy *= 1.6; }
    }
  }
}
