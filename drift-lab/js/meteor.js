// METEOR YAĞMURU (tanklardan sonra). Her meteor düşmeden TAM warn saniye önce yerde nişangâh ve uyarı dairesi belirir;
// süre dolunca meteor çakılır: içindeki oyuncu ölür, dışındaki zarar görmez. Binalar yıkılır; polis, uzaylı, tank ve
// trafik etkilenir. Korunan alanlara (anıt, gizli geçit, stadyumlar) asla düşmez. Havuz kullanılır, sayı sınırlıdır.
import { CONFIG } from './config.js';
import { FX } from './effects.js';

const MET = CONFIG.meteor;

// [saniye, değer] noktaları arası doğrusal
function meteorCurve(curve, t) {
  if (t <= curve[0][0]) return curve[0][1];
  for (let i = 1; i < curve.length; i++) {
    if (t <= curve[i][0]) {
      const [t0, v0] = curve[i - 1];
      const [t1, v1] = curve[i];
      return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
    }
  }
  return curve[curve.length - 1][1];
}

// Dalga aralığı ve dalgadaki sayı: zamanla artar, uyarı süresi hiç değişmez
export function meteorRate(t) {
  return { every: meteorCurve(MET.every, t), perWave: Math.round(meteorCurve(MET.perWave, t)) };
}

export class MeteorStorm {
  constructor() {
    this.list = [];
    for (let i = 0; i < MET.max; i++) this.list.push({ alive: false, x: 0, y: 0, t: 0, seed: 0 });
    this.reset();
  }

  reset() {
    this.waveT = 0.6; // Aşama başlayınca ilk meteor hemen uyarılır
    this.spawned = 0;
    this.impacts = 0;
    this.on = false;
    for (const m of this.list) m.alive = false;
  }

  active() {
    let n = 0;
    for (const m of this.list) if (m.alive) n++;
    return n;
  }

  // Hedef: oyuncunun hemen altı değil, korunan alan değil, başka meteorun dairesi değil
  place(game, m) {
    const p = game.player;
    const R = MET.radius;
    const lx = p.x + p.vx * MET.lead;
    const ly = p.y + p.vy * MET.lead;
    for (let i = 0; i < 14; i++) {
      const aimed = Math.random() < MET.aimShare;
      const cx = aimed ? lx : p.x;
      const cy = aimed ? ly : p.y;
      const a = Math.random() * Math.PI * 2;
      const r = MET.minR + Math.random() * (MET.maxR - MET.minR) * (aimed ? 0.45 : 1);
      const x = cx + Math.cos(a) * r;
      const y = cy + Math.sin(a) * r;
      if (Math.hypot(x - p.x, y - p.y) < MET.minR) continue;
      if (game.world.protectedAt(x, y, R)) continue;
      let clash = false;
      for (const o of this.list) if (o.alive && o !== m && Math.hypot(o.x - x, o.y - y) < R * 1.6) { clash = true; break; }
      if (clash) continue;
      m.x = x; m.y = y;
      return true;
    }
    return false;
  }

  spawn(game) {
    const m = this.list.find((k) => !k.alive);
    if (!m || !this.place(game, m)) return false;
    m.alive = true;
    m.t = 0;
    m.seed = Math.random();
    this.spawned++;
    game.emit('meteorwarn');
    return true;
  }

  update(game, dt) {
    if (game.time < MET.at) return;
    if (!this.on) { this.on = true; game.emit('meteors'); }
    for (const m of this.list) {
      if (!m.alive) continue;
      m.t += dt;
      if (m.t >= MET.warn) this.impact(game, m);
    }
    if (game.state !== 'play') return;
    this.waveT -= dt;
    if (this.waveT <= 0) {
      const r = meteorRate(game.time);
      for (let i = 0; i < r.perWave; i++) this.spawn(game);
      this.waveT = r.every;
    }
  }

  impact(game, m) {
    m.alive = false;
    this.impacts++;
    const R = MET.radius;
    const fx = game.fx;
    fx.explosion(m.x, m.y, R * 0.9);
    fx.burst(FX.DUST, m.x, m.y, MET.dust, 260, 1.3, 30);
    fx.sparks(m.x, m.y, MET.sparks);
    fx.decal(m.x, m.y, MET.crater);
    const p = game.player;
    const d = Math.hypot(p.x - m.x, p.y - m.y);
    game.cam.shake = Math.min(18, game.cam.shake + MET.shake * Math.max(0.35, 1 - d / 1400));
    game.emit('meteorhit', Math.max(0.2, Math.min(1, 900 / (d + 300))));
    if (game.state === 'play' && d < R && !game.cheat && !game.god) game.meteorKill(m.x, m.y);
    // Polis, uzaylı ve tank: içindeki patlar, tank ağır hasar alır
    for (let i = game.cops.length - 1; i >= 0; i--) {
      const c = game.cops[i];
      if (Math.hypot(c.x - m.x, c.y - m.y) > R + c.wid * 0.5) continue;
      if (c.type === 'tank') { c.hp -= MET.tankDamage; c.hurtFlash = 0.5; if (c.hp > 0) continue; }
      game.destroyCop(i, false);
    }
    game.crowd.blast(m.x, m.y, R, 0);
    game.crushCircle(m.x, m.y, R * 0.85);
  }
}
