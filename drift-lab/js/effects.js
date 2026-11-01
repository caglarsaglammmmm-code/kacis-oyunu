// Efekt verileri (çizimden bağımsız). Her şey sabit boyutlu havuzda: oyun sırasında bellek ayrılmaz.
import { CONFIG } from './config.js';

export const FX = { SMOKE: 0, DARK: 1, FIRE: 2, SPARK: 3, DEBRIS: 4, GLINT: 5, DUST: 6, WATER: 7, SIMIT: 8 };

const FXP = CONFIG.perf;

export class Effects {
  constructor() {
    const n = FXP.maxParticles;
    this.max = n;
    this.x = new Float32Array(n);
    this.y = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.life = new Float32Array(n);
    this.ttl = new Float32Array(n);
    this.size = new Float32Array(n);
    this.rot = new Float32Array(n);
    this.kind = new Uint8Array(n);
    this.color = new Uint8Array(n);
    this.cursor = 0;
    this.colors = ['#888888'];

    // Lastik izleri aurum tampon: x1,y1,x2,y2,yaş
    this.skidMax = FXP.maxSkids;
    this.skid = new Float32Array(this.skidMax * 5);
    this.skidCursor = 0;

    this.decals = [];
    for (let i = 0; i < FXP.maxDecals; i++) this.decals.push({ x: 0, y: 0, r: 0, alive: false, rot: 0 });
    this.decalCursor = 0;

    this.waves = [];
    for (let i = 0; i < 8; i++) this.waves.push({ x: 0, y: 0, r: 0, max: 0, t: 0, alive: false });

    this.floats = [];
    for (let i = 0; i < 14; i++) this.floats.push({ x: 0, y: 0, t: 0, text: '', color: '', alive: false });
    this.floatCursor = 0;
  }

  clear() {
    this.life.fill(0);
    this.skid.fill(0);
    for (const d of this.decals) d.alive = false;
    for (const w of this.waves) w.alive = false;
    for (const f of this.floats) f.alive = false;
  }

  colorId(c) {
    let i = this.colors.indexOf(c);
    if (i < 0) { i = this.colors.length; this.colors.push(c); }
    return i;
  }

  // Havuz doluysa en eskinin üstüne yazar
  spawn(kind, x, y, vx, vy, ttl, size, color = 0) {
    const i = this.cursor;
    this.cursor = (i + 1) % this.max;
    this.kind[i] = kind;
    this.x[i] = x; this.y[i] = y;
    this.vx[i] = vx; this.vy[i] = vy;
    this.life[i] = ttl; this.ttl[i] = ttl;
    this.size[i] = size;
    this.rot[i] = Math.random() * 6.28;
    this.color[i] = color;
  }

  burst(kind, x, y, n, speed, ttl, size, color = 0) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283;
      const s = speed * (0.3 + Math.random() * 0.7);
      this.spawn(kind, x, y, Math.cos(a) * s, Math.sin(a) * s, ttl * (0.6 + Math.random() * 0.6), size * (0.7 + Math.random() * 0.6), color);
    }
  }

  sparks(x, y, n, nx = 0, ny = 0) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283;
      const s = 80 + Math.random() * 260;
      this.spawn(FX.SPARK, x, y, Math.cos(a) * s + nx * 160, Math.sin(a) * s + ny * 160, 0.25 + Math.random() * 0.3, 2.5);
    }
  }

  debris(x, y, color, n, speed = 170) {
    this.burst(FX.DEBRIS, x, y, n, speed, 0.8, 7, this.colorId(color));
  }

  explosion(x, y, size) {
    this.burst(FX.FIRE, x, y, Math.round(size * 0.4), size * 2.8, 0.85, size * 0.62);
    this.burst(FX.DARK, x, y, Math.round(size * 0.14), size * 1.5, 1.1, size * 0.34);
    this.sparks(x, y, Math.round(size * 0.3));
    this.wave(x, y, size * 2.6);
    this.decal(x, y, size * 0.8);
  }

  wave(x, y, max) {
    for (const w of this.waves) {
      if (!w.alive) {
        w.alive = true; w.x = x; w.y = y; w.r = 0; w.max = max; w.t = 0;
        return;
      }
    }
  }

  decal(x, y, r) {
    const d = this.decals[this.decalCursor];
    this.decalCursor = (this.decalCursor + 1) % this.decals.length;
    d.alive = true; d.x = x; d.y = y; d.r = r; d.rot = Math.random() * 6.28;
  }

  float(x, y, text, color = '#fff') {
    const f = this.floats[this.floatCursor];
    this.floatCursor = (this.floatCursor + 1) % this.floats.length;
    f.alive = true; f.x = x; f.y = y; f.t = 0; f.text = text; f.color = color;
  }

  addSkid(x1, y1, x2, y2) {
    const i = this.skidCursor * 5;
    this.skidCursor = (this.skidCursor + 1) % this.skidMax;
    const s = this.skid;
    s[i] = x1; s[i + 1] = y1; s[i + 2] = x2; s[i + 3] = y2; s[i + 4] = 1;
  }

  update(dt) {
    const { x, y, vx, vy, life, kind } = this;
    for (let i = 0; i < this.max; i++) {
      if (life[i] <= 0) continue;
      life[i] -= dt;
      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;
      const k = kind[i];
      const drag = k === FX.SPARK ? 3 : k === FX.DEBRIS ? 2.6 : 1.8;
      const f = 1 - drag * dt;
      vx[i] *= f;
      vy[i] *= f;
      if (k === FX.DEBRIS) this.rot[i] += dt * 9 * (life[i] / this.ttl[i]);
    }
    for (const w of this.waves) {
      if (!w.alive) continue;
      w.t += dt * 2.4;
      w.r = w.max * (1 - (1 - w.t) * (1 - w.t));
      if (w.t >= 1) w.alive = false;
    }
    for (const f of this.floats) {
      if (!f.alive) continue;
      f.t += dt;
      f.y -= 46 * dt;
      if (f.t > 1.1) f.alive = false;
    }
  }

  liveCount() {
    let n = 0;
    for (let i = 0; i < this.max; i++) if (this.life[i] > 0) n++;
    return n;
  }
}
