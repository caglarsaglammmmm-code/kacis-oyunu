// METEOR YAĞMURU (tanklardan sonra). Her dalganın ASIL meteoru oyuncuyu hedef alır:
//   1) Uyarı (warn sn): nişan her karede arabanın çarpma anında olacağı yeri izler. Tahmin = konum + hız x kalan süre,
//      yol boyunca (köşede yolun döndüğü yere, direksiyon yönüne) ve hızla orantılı: hızlı arabada daha ileride.
//   2) Düşüş (fall sn): meteor gökten düşmeye başlarken nişan KİLİTLENİR: hedef = konum + hız x düşüş süresi.
//      Bundan sonra takip etmez; oyuncu düşüş süresi içinde hız ya da yön değiştirerek kaçar.
// Zamanla dalgalar sıklaşır (every, minEvery) ve meteor hızlanır: düşüş süresi kısalır (fallCurve, minFall tabanı).
// Diğerleri çevreye düşen meteorlardır. İçindeki oyuncu ölür, dışındaki zarar görmez. Binalar yıkılır; polis, uzaylı,
// tank ve trafik etkilenir. Korunan alanlara (anıt, gizli geçit, stadyumlar) asla düşmez. Havuz kullanılır, sayı sınırlıdır.
import { CONFIG, GROUND } from './config.js';
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

// Dalga aralığı, dalgadaki sayı ve düşüş süresi: zamanla sıklaşır ve hızlanır, tabanların altına inmez.
// Uyarı süresi (warn) hiç değişmez
export function meteorRate(t) {
  return {
    every: Math.max(MET.minEvery, meteorCurve(MET.every, t)),
    perWave: Math.round(meteorCurve(MET.perWave, t)),
    fall: Math.max(MET.minFall, meteorCurve(MET.fallCurve, t)),
  };
}

// Meteorun uyarı ve düşüş süresi (elle konmuş eski kayıtlarda varsayılan)
const mWarn = (m) => m.warn || MET.warn;
const mFall = (m) => m.fall || MET.fall;
export const meteorTotal = (m) => mWarn(m) + mFall(m);

// t saniyede alınacak yol, oyun fiziğiyle aynı (js/physics.js): araba kendi gaz verir, hız
// v' = ivme x gaz x (1 - v / son hız) - sürtünme x v. Yani yavaş araba hızlanır, son hızın üstündeki yavaşlar.
// Gaz yoksa (fren, geri vites): konum + hız x süre. surf: oyuncunun zemini (son hız ve sürtünme)
export function meteorLead(sp, t, spec, gas = 1, surf = null) {
  if (!spec || gas <= 0 || !(spec.accel > 0) || t <= 0) return sp * Math.max(0, t);
  const top = spec.maxSpeed * (surf ? surf.speed : 1);
  const drag = CONFIG.physics.rollingDrag + (surf ? surf.drag : 0);
  const a = spec.accel * Math.min(1, gas);
  const k = a / top + drag;
  const vEnd = a / k; // Bu zeminde ulaşılan hız
  return vEnd * t - ((vEnd - sp) * (1 - Math.exp(-k * t))) / k;
}

// Köşede hangi yöne dönülür: direksiyon yönü açıksa o, değilse daha açık taraf. 0: ikisi de kapalı
function meteorTurn(w, x, y, dx, dy, steer) {
  const open = (sx, sy) => { let n = 0; for (let d = 20; d <= 120; d += 20) { if (w.blockedAt(x + sx * d, y + sy * d)) break; n++; } return n; };
  const r = open(-dy, dx); // +90 derece: sağ (ekranda y aşağı)
  const l = open(dy, -dx);
  if (steer > 0.2 && r >= 3) return 1;
  if (steer < -0.2 && l >= 3) return -1;
  if (r < 3 && l < 3) return 0;
  return r >= l ? 1 : -1;
}

// Tahmini nişan: arabanın t saniye sonra olacağı yer. Hızla orantılı uzaklık (meteorLead), gidiş yönünde, binaya
// girmeden; yol bitiyorsa köşeyi döner (en çok MET.turns kez), sonunda yola çekilir (geriye değil).
// out: x, y, lead (yol boyunca uzaklık). t verilmezse yeni meteorun çarpmasına kalan süre. Uygun yer yoksa false
export function meteorAim(game, out, t = MET.warn + meteorRate(game.time).fall, { minR = MET.minR } = {}) {
  const p = game.player;
  const w = game.world;
  const sp = Math.hypot(p.vx, p.vy);
  let dx = sp > 25 ? p.vx / sp : Math.cos(p.a);
  let dy = sp > 25 ? p.vy / sp : Math.sin(p.a);
  const surf = game.surfP ? (game.cheat ? CONFIG.surfaces[GROUND.ROAD] : game.surfP[w.groundAt(p.x, p.y)]) : null;
  let left = Math.min(MET.maxLead, Math.max(0, meteorLead(sp, Math.max(0, t), game.carSpec, p.gas ?? 1, surf)));
  let x = p.x; let y = p.y;
  let L = 0;
  let turns = 0;
  while (left > 0.5) {
    const s = Math.min(20, left);
    const nx = x + dx * s; const ny = y + dy * s;
    if (!w.blockedAt(nx, ny)) { x = nx; y = ny; left -= s; L += s; continue; }
    // Yol bitti: araba orada durmaz, döner. Nişan da dönülen yolda kalan uzaklık kadar ileriye
    const side = turns < MET.turns ? meteorTurn(w, x, y, dx, dy, game.lastSteer || 0) : 0;
    if (!side) break;
    [dx, dy] = side > 0 ? [-dy, dx] : [dy, -dx];
    turns++;
  }
  // Yola çek: araba yoldan gidiyorsa nişan da yolda. Yalnız gidiş yönünde geriye düşmeyen noktalar
  if (w.groundAt(x, y) !== GROUND.ROAD) {
    let best = null;
    for (let r = 20; r <= MET.road && !best; r += 20) {
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2;
        const qx = x + Math.cos(a) * r; const qy = y + Math.sin(a) * r;
        if ((qx - x) * dx + (qy - y) * dy < -r * 0.3) continue;
        if (w.groundAt(qx, qy) !== GROUND.ROAD || w.blockedAt(qx, qy)) continue;
        best = [qx, qy];
        break;
      }
    }
    if (best) [x, y] = best;
  }
  if (Math.hypot(x - p.x, y - p.y) < minR) return false; // Yeni nişan tam üstünde (kaçılamaz) doğmaz
  if (w.protectedAt(x, y, MET.radius)) return false;
  out.x = x; out.y = y; out.lead = L;
  return true;
}

const aimOut = { x: 0, y: 0, lead: 0 };

export class MeteorStorm {
  constructor() {
    this.list = [];
    for (let i = 0; i < MET.max; i++) this.list.push({ alive: false, x: 0, y: 0, t: 0, warn: MET.warn, fall: MET.fall, seed: 0, main: false, falling: false });
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
    const fall = meteorRate(game.time).fall;
    if (main) {
      if (!meteorAim(game, aimOut, MET.warn + fall) || this.clash(m, aimOut.x, aimOut.y)) return false;
      m.x = aimOut.x; m.y = aimOut.y;
      this.aimed++;
    } else if (!this.place(game, m)) return false;
    m.alive = true;
    m.main = main;
    m.t = 0;
    m.warn = MET.warn;
    m.fall = fall;
    m.falling = false;
    m.seed = Math.random();
    this.spawned++;
    game.emit('meteorwarn', main ? 1 : 0);
    return true;
  }

  // Asıl meteorun nişanı uyarı boyunca arabanın çarpma anındaki tahmini yerini izler; düşüş başlarken
  // hedef = konum + hız x düşüş süresi noktasına kilitlenir. Korunan alana giden tahmin izlenmez
  track(game, m, dt) {
    const left = meteorTotal(m) - m.t;
    if (!meteorAim(game, aimOut, left, { minR: 0 })) return;
    const k = m.falling ? 1 : Math.min(1, dt * MET.follow);
    m.x += (aimOut.x - m.x) * k;
    m.y += (aimOut.y - m.y) * k;
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
      if (m.main && !m.falling && game.state === 'play') {
        // Düşüş başlarken son kez ve yumuşatmasız: hedef = konum + hız x kalan düşüş süresi, sonra kilitli
        const lock = m.t >= mWarn(m);
        if (lock) m.falling = true;
        this.track(game, m, dt);
        if (lock) game.emit('meteorfall', 1);
      }
      if (!m.falling && m.t >= mWarn(m)) { m.falling = true; game.emit('meteorfall', m.main ? 1 : 0.5); }
      // Düşerken alev ve duman kuyruğu (yalnız ekrandaysa, sınırlı)
      if (m.falling && trail && game.onScreen(m.x, m.y, 200)) {
        const q = (m.t - mWarn(m)) / mFall(m);
        const h = (1 - q) * (game.cam.halfH * 0.7 + 80);
        game.fx.spawn(FX.FIRE, m.x + (1 - q) * 120, m.y - h, 0, -30, 0.3, 14);
        game.fx.spawn(FX.SMOKE, m.x + (1 - q) * 130, m.y - h - 10, 0, -50, 0.7, 16);
      }
      if (m.t >= meteorTotal(m)) this.impact(game, m);
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
