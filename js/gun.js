// 360° OTOMATİK TARAMALI SİLAH: mağazadan takılan 6 kademeli silahların ve kendi silahı olan araçların (42-66 arabası,
// gizli motosiklet) ORTAK bileşeni. Araç hangi yöne bakarsa baksın ekranda görünen düşmanlara sırayla ateş eder;
// ekran dışındakine ateş etmez. Hedefin varış anındaki yerine nişan alır. Sınırsız cephane, düğme yok.
// Mermiler havuzdan gelir: oyun sırasında bellek ayrılmaz.
// Korunan alanlara (anıt, gizli geçit, stadyum) giren mermi kaybolur; o alanların ardındaki hedefe nişan alınmaz.
import { CONFIG } from './config.js';

const GUN = CONFIG.weapon;
const GUN_D = CONFIG.difficulty;
const GUN_GROW = CONFIG.copHpGrowth;

// Türün oyuna ilk girdiği saniye: can artışı (açıksa) o andan sayılır
export function gunFirstAt(type) {
  if (type === 'swat') return GUN_D.swatAt;
  if (type === 'advanced') return GUN_D.advancedAt;
  if (type === 'tank') return GUN_D.tanksAt;
  if (CONFIG.aliens.types[type]) return GUN_D.aliensAt;
  return 0;
}

// Türün Silah 1 ile vuruş sayısı (zorluk kademesi). Tabloda olmayan tür en zor kademeden 5 fazla sayılır
export function enemyHits(type) {
  const t = GUN.enemyHits;
  if (t[type]) return t[type];
  return Math.max(...Object.values(t)) + 5;
}

// Temel silah canı: normal polis canı x kademe vuruşu / 15
export function gunBaseHp(type) {
  return (GUN.copHp * enemyHits(type)) / GUN.enemyHits.car;
}

// Yeni çıkan düşmanın silah canı: temel can x zamanla artan kat (copHpGrowth, tavanlı; max 1 = kapalı)
export function gunHp(type, time) {
  const minutes = Math.max(0, time - gunFirstAt(type)) / 60;
  return gunBaseHp(type) * Math.min(GUN_GROW.max, GUN_GROW.perMin ** minutes);
}

// Silahın oyun değerleri: ateş aralığı (sn), saniyede mermi, mermi hasarı
export function gunStats(spec) {
  const every = spec.every / 100;
  return { id: spec.id || 'builtin', every, rate: 1 / every, damage: GUN.copHp / spec.hits, hits: spec.hits };
}
export const gunSpec = (id) => CONFIG.guns.find((g) => g.id === id) || null;
export const BUILTIN = gunStats({ id: 'builtin', ...GUN.builtin });

// Kayan nokta payı: 150 / 7 hasarın 7 katı canı tam bitirir
const KILL_EPS = 1e-6;
export const gunDead = (mhp) => mhp <= KILL_EPS;

// Gereken mermi sayısı (stats: gunStats; verilmezse dahili silah)
export function bulletsToKill(type, time = gunFirstAt(type), stats = BUILTIN) {
  return Math.max(1, Math.ceil(gunHp(type, time) / stats.damage - 1e-6));
}

export class AutoGun {
  constructor() {
    this.stats = BUILTIN; // Takılı silah: game.start belirler (setGun)
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

  setGun(stats) {
    this.stats = stats || BUILTIN;
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
      if (c.hp <= 0 || gunDead(c.mhp) || c.sinkT > 0 || !this.visible(game, c)) continue;
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
      // Düşük kare hızında da ateş aralığı korunur: bir karede en çok üç mermi
      let k = 0;
      while (this.cd <= 0 && k < 3) {
        const c = this.pick(game);
        if (!c || !this.shoot(game, c)) { this.cd = 0; break; } // Hedef yokken süre birikmez
        this.cd += this.stats.every;
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
