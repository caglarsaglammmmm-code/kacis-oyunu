// METEOR YAĞMURU (tanklardan sonra). Her dalganın ASIL meteoru oyuncuyu hedef alır: çarpma anında arabanın olacağı
// nokta, oyuncunun konumu, hızı ve yönünden tahmin edilir (konum + hız x (uyarı + düşüş)), yol üzerinde tutulur ve
// KİLİTLENİR: sonra takip etmez, oyuncu hız ya da yön değiştirerek kaçabilir. Diğerleri çevreye düşen meteorlardır.
// Uyarı en az 3 sn; düşüş sonra başlar. İçindeki oyuncu ölür, dışındaki zarar görmez. Binalar yıkılır; polis, uzaylı,
// tank ve trafik etkilenir. Korunan alanlara (anıt, gizli geçit, stadyumlar) asla düşmez. Havuz kullanılır, sayı sınırlıdır.
import { CONFIG, GROUND } from './config.js';
import { FX } from './effects.js';

const MET = CONFIG.meteor;
const MET_TOTAL = MET.warn + MET.fall; // Nişandan çarpmaya

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

// Tahmini nişan: oyuncunun gidiş yönünde, hızla orantılı uzaklıkta, yol boyunca (binaya girmeden) ve yola çekilmiş.
// out: x, y, lead (tahmin uzaklığı). Uygun yer yoksa false
export function meteorAim(game, out) {
  const p = game.player;
  const w = game.world;
  const sp = Math.hypot(p.vx, p.vy);
  const dx = sp > 25 ? p.vx / sp : Math.cos(p.a);
  const dy = sp > 25 ? p.vy / sp : Math.sin(p.a);
  const lead = Math.min(MET.maxLead, sp * MET_TOTAL);
  const want = Math.max(MET.minR, lead);
  // Gidiş yönünde, binaya girmeden ne kadar ilerlenebilir: yol bitiyorsa nişan dönüş noktasına düşer
  let L = 0;
  for (let d = 20; d <= want; d += 20) {
    if (w.blockedAt(p.x + dx * d, p.y + dy * d)) break;
    L = d;
  }
  let x = p.x + dx * L; let y = p.y + dy * L;
  // Yola çek: araba yoldan gidiyorsa nişan da yolda
  if (w.groundAt(x, y) !== GROUND.ROAD) {
    let best = null; let bd = 1e9;
    for (let r = 20; r <= MET.road && !best; r += 20) {
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        const qx = x + Math.cos(a) * r; const qy = y + Math.sin(a) * r;
        if (w.groundAt(qx, qy) !== GROUND.ROAD || w.blockedAt(qx, qy)) continue;
        if (r < bd) { bd = r; best = [qx, qy]; }
      }
    }
    if (best) [x, y] = best;
  }
  if (Math.hypot(x - p.x, y - p.y) < MET.minR) return false; // Tam üstünde (kaçılamaz) doğmaz
  if (w.protectedAt(x, y, MET.radius)) return false;
  out.x = x; out.y = y; out.lead = L;
  return true;
}

const aimOut = { x: 0, y: 0, lead: 0 };

export class MeteorStorm {
  constructor() {
    this.list = [];
    for (let i = 0; i < MET.max; i++) this.list.push({ alive: false, x: 0, y: 0, t: 0, seed: 0, main: false, falling: false });
    this.reset();
  }

  reset() {
    this.waveT = 0.6; // Aşama başlayınca ilk meteor hemen uyarılır
    this.spawned = 0;
    this.aimed = 0;
    this.impacts = 0;
    this.on = false;
    this.trailT = 0;
    for (const m of this.list) m.alive = false;
  }

  active() {
    let n = 0;
    for (const m of this.list) if (m.alive) n++;
    return n;
  }

  clash(m, x, y) {
    for (const o of this.list) if (o.alive && o !== m && Math.hypot(o.x - x, o.y - y) < MET.radius * 2.2) return true;
    return false;
  }

  // Çevre meteoru: oyuncudan uzak bir halkada, korunan alan ve başka meteor dışında
  place(game, m) {
    const p = game.player;
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = MET.randMin + Math.random() * (MET.randMax - MET.randMin);
      const x = p.x + Math.cos(a) * r;
      const y = p.y + Math.sin(a) * r;
      if (game.world.protectedAt(x, y, MET.radius) || this.clash(m, x, y)) continue;
      m.x = x; m.y = y;
      return true;
    }
    return false;
  }

  spawn(game, main) {
    const m = this.list.find((k) => !k.alive);
    if (!m) return false;
    if (main) {
      if (!meteorAim(game, aimOut) || this.clash(m, aimOut.x, aimOut.y)) return false;
      m.x = aimOut.x; m.y = aimOut.y;
      this.aimed++;
    } else if (!this.place(game, m)) return false;
    m.alive = true;
    m.main = main;
    m.t = 0;
    m.falling = false;
    m.seed = Math.random();
    this.spawned++;
    game.emit('meteorwarn', main ? 1 : 0);
    return true;
  }

  update(game, dt) {
    if (game.time < MET.at) return;
    if (!this.on) { this.on = true; game.emit('meteors'); }
    this.trailT -= dt;
    const trail = this.trailT <= 0;
    if (trail) this.trailT = 1 / MET.trail;
    for (const m of this.list) {
      if (!m.alive) continue;
      m.t += dt;
      if (!m.falling && m.t >= MET.warn) { m.falling = true; game.emit('meteorfall', m.main ? 1 : 0.5); }
      // Düşerken alev ve duman kuyruğu (yalnız ekrandaysa, sınırlı)
      if (m.falling && trail && game.onScreen(m.x, m.y, 200)) {
        const q = (m.t - MET.warn) / MET.fall;
        const h = (1 - q) * (game.cam.halfH * 0.7 + 80);
        game.fx.spawn(FX.FIRE, m.x + (1 - q) * 120, m.y - h, 0, -30, 0.3, 14);
        game.fx.spawn(FX.SMOKE, m.x + (1 - q) * 130, m.y - h - 10, 0, -50, 0.7, 16);
      }
      if (m.t >= MET_TOTAL) this.impact(game, m);
    }
    if (game.state !== 'play') return;
    this.waveT -= dt;
    if (this.waveT <= 0) {
      const r = meteorRate(game.time);
      // Asıl meteor oyuncuyu hedef alır; yolu kapanmışsa (barikat yakında) bu dalga yalnız çevreye düşer: köşeye sıkışma olmaz
      const main = !game.roadblockNear || !game.roadblockNear();
      let made = main ? this.spawn(game, true) : false;
      for (let i = made ? 1 : 0; i < r.perWave; i++) this.spawn(game, false);
      if (!made && main) this.waveT = 0.4; // Nişan yeri bulunamadı: kısa süre sonra yeniden dene
      else this.waveT = r.every;
    }
  }

  impact(game, m) {
    m.alive = false;
    this.impacts++;
    const R = MET.radius;
    const fx = game.fx;
    const p = game.player;
    const d = Math.hypot(p.x - m.x, p.y - m.y);
    const near = game.onScreen(m.x, m.y, 200);
    // BAM: parlak flaş, ateş topu, basınç dalgası, kıvılcım, moloz, toz, krater
    fx.explosion(m.x, m.y, R * 1.2);
    fx.wave(m.x, m.y, R * 4);
    if (near) {
      fx.burst(FX.DUST, m.x, m.y, MET.dust, 300, 1.4, 34);
      fx.sparks(m.x, m.y, MET.sparks);
      fx.debris(m.x, m.y, '#6b4a2e', MET.debris, 380);
    }
    fx.decal(m.x, m.y, MET.crater);
    const k = Math.max(0.35, 1 - d / 1400);
    game.cam.shake = Math.min(20, game.cam.shake + MET.shake * k);
    if (game.quake) game.quake(MET.quake, MET.quakeShake * k);
    if (near && game.flash) game.flash(MET.flash * k);
    game.emit('meteorhit', Math.max(0.2, Math.min(1, 900 / (d + 300))));
    if (game.state === 'play' && d < R && !game.cheat && !game.god) game.meteorKill(m.x, m.y);
    // Polis, uzaylı ve tank: içindeki patlar, tank ağır hasar alır
    for (let i = game.cops.length - 1; i >= 0; i--) {
      const c = game.cops[i];
      if (Math.hypot(c.x - m.x, c.y - m.y) > R + c.wid * 0.5) continue;
      if (c.type === 'tank') { c.hp -= MET.tankDamage; c.hurtFlash = 0.5; if (c.hp > 0) continue; }
      game.destroyCop(i, false);
    }
    // Basınç dalgası: çevredeki araçlar itilir (suya da düşebilirler)
    if (game.shockwave) game.shockwave(m.x, m.y, R * 3, 420);
    game.crowd.blast(m.x, m.y, R, 0);
    game.crushCircle(m.x, m.y, R * 0.9);
  }
}
