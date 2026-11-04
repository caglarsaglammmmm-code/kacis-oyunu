// 360° OTOMATİK TARAMALI SİLAH: weapon: true olan bütün araçların ORTAK bileşeni (42-66 arabası ve gizli motosiklet).
// Araç hangi yöne bakarsa baksın ekranda görünen düşmanlara sırayla ateş eder; ekran dışındakine ateş etmez.
// Küçük hızlı mermiler, sabit hasar, sınırsız cephane, düğme yok. Mermiler havuzdan gelir: oyun sırasında bellek ayrılmaz.
// Korunan alanlara (anıt, gizli geçit, stadyum) giren mermi kaybolur; o alanların ardındaki hedefe nişan alınmaz.
import { CONFIG } from './config.js';

const GUN = CONFIG.weapon;
const GUN_D = CONFIG.difficulty;
const GUN_GROW = CONFIG.copHpGrowth;

// Türün oyuna ilk girdiği saniye: can artışı o andan sayılır, yani her tür ilk çıktığında tablodaki mermi sayısıyla ölür
export function gunFirstAt(type) {
  if (type === 'swat') return GUN_D.swatAt;
  if (type === 'advanced') return GUN_D.advancedAt;
  if (type === 'tank') return GUN_D.tanksAt;
  if (CONFIG.aliens.types[type]) return GUN_D.aliensAt;
  return 0;
}

// Yeni çıkan düşmanın silah canı: temel can x zamanla artan kat (tavanlı, hiç 1'in altına inmez)
export function gunHp(type, time) {
  const base = GUN.hp[type] || GUN.hp.car;
  const minutes = Math.max(0, time - gunFirstAt(type)) / 60;
  return base * Math.min(GUN_GROW.max, GUN_GROW.perMin ** minutes);
}

// Gereken mermi sayısı
export function bulletsToKill(type, time = gunFirstAt(type)) {
  return Math.ceil(gunHp(type, time) / GUN.damage - 1e-9);
}

export class AutoGun {
  constructor() {
    this.bullets = [];
    for (let i = 0; i < GUN.maxBullets; i++) this.bullets.push({ alive: false, x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0, t: 0 });
    this.reset();
  }

  reset() {
    this.cd = 0;
    this.shots = 0; // Atılan mermi
    this.hits = 0; // İsabet
    this.aim = 0; // Taretin baktığı açı
    this.target = null;
    this.flash = 0; // Namlu parlaması
    this.inView = 0; // Ekrandaki hedef sayısı (son tarama)
    this.clock = 0; // Silahın kendi saati: hedeflerin bekleme süresi buna göre
    for (const b of this.bullets) b.alive = false;
  }

  // Hedef ekranda mı: kenardan inset kadar içeride olmalı
  visible(game, c) {
    const cam = game.cam;
    return Math.abs(c.x - cam.x) < cam.halfW - GUN.inset && Math.abs(c.y - cam.y) < cam.halfH - GUN.inset;
  }

  // Öncelik: tehlike x yakınlık + bekleme. Bekleyen hedefin önceliği büyür: hepsi taranır, biri üstünde takılıp kalınmaz
  pick(game) {
    const p = game.player;
    let best = null;
    let bs = -1e9;
    let n = 0;
    for (const c of game.cops) {
      if (c.hp <= 0 || c.sinkT > 0 || !this.visible(game, c)) continue;
      if (game.world.segmentProtected(p.x, p.y, c.x, c.y)) continue;
      n++;
      const d = Math.hypot(c.x - p.x, c.y - p.y);
      const wait = Math.min(2, this.clock - c.aimAt);
      const s = (GUN.danger[c.type] || 1) * (1 - Math.min(0.85, d / GUN.near)) + wait * GUN.wait;
      if (s > bs) { bs = s; best = c; }
    }
    this.inView = n;
    return best;
  }

  shoot(game, c) {
    const b = this.bullets.find((k) => !k.alive);
    if (!b) return false;
    const p = game.player;
    // Öne nişan: merminin varış süresi kadar hedefin ilerisi
    const d = Math.hypot(c.x - p.x, c.y - p.y);
    const t = d / GUN.speed;
    const tx = c.x + c.vx * t;
    const ty = c.y + c.vy * t;
    const a = Math.atan2(ty - p.y, tx - p.x) + (Math.random() - 0.5) * GUN.spread;
    const ca = Math.cos(a); const sa = Math.sin(a);
    b.alive = true; b.t = 0;
    b.x = p.x + ca * 12; b.y = p.y + sa * 12;
    b.px = b.x; b.py = b.y;
    b.vx = ca * GUN.speed; b.vy = sa * GUN.speed;
    c.aimAt = this.clock;
    this.aim = a;
    this.target = c;
    this.flash = 0.06;
    this.shots++;
    game.emit('shot');
    return true;
  }

  update(game, dt) {
    this.clock += dt;
    if (this.flash > 0) this.flash -= dt;
    this.cd -= dt;
    if (game.state === 'play') {
      // Düşük kare hızında da saniyede rate mermi: bir karede en çok üç
      let k = 0;
      while (this.cd <= 0 && k < 3) {
        const c = this.pick(game);
        if (!c || !this.shoot(game, c)) { this.cd = 0; break; } // Hedef yokken süre birikmez
        this.cd += 1 / GUN.rate;
        k++;
      }
      if (this.target && (this.target.hp <= 0 || !game.cops.includes(this.target))) this.target = null;
    } else {
      this.cd = Math.max(0, this.cd);
    }
    for (const b of this.bullets) if (b.alive) this.step(game, b, dt);
  }

  step(game, b, dt) {
    b.t += dt;
    b.px = b.x; b.py = b.y;
    b.x += b.vx * dt; b.y += b.vy * dt;
    if (b.t > GUN.life || game.world.protectedAt(b.x, b.y, GUN.hitR, false)) { b.alive = false; return; }
    // Kare arası yol boyunca isabet: hızlı mermi hedefin içinden geçip gitmez
    const sx = b.x - b.px; const sy = b.y - b.py;
    const len2 = sx * sx + sy * sy || 1;
    for (const c of game.cops) {
      if (c.hp <= 0) continue;
      const R = GUN.hitR + c.wid * 0.5;
      const ox = c.x - b.px; const oy = c.y - b.py;
      if (Math.abs(ox) > R + 40 && Math.abs(c.x - b.x) > R + 40) continue;
      const u = Math.max(0, Math.min(1, (ox * sx + oy * sy) / len2));
      const qx = b.px + sx * u - c.x; const qy = b.py + sy * u - c.y;
      if (qx * qx + qy * qy > R * R) continue;
      b.alive = false;
      this.hits++;
      game.gunHit(c, b.px + sx * u, b.py + sy * u);
      return;
    }
  }
}
