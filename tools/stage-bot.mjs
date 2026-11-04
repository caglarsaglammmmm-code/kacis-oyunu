// Aşama botu: makul sürüş yapan bot her aşamanın başından itibaren oynar, hayatta kalma süresini ölçer.
// Bot gerçek oyuncu girdileriyle sürer (sol, sağ, ikisi = geri): çevresine ışın atar, en açık yönü seçer; binadan,
// derin sudan, anıt alanından, meteor halkasından ve polis/uzaylı/tanktan kaçınır.
// Kullanım: node tools/stage-bot.mjs [tohum sayısı] [aşama başına süre] [--json dosya]
import fs from 'node:fs';
import { CONFIG, GROUND } from '../js/config.js';
import { Game } from '../js/game.js';

const dt = 1 / 60;
const MET = CONFIG.meteor;

export function smartBot(g) {
  const p = g.player;
  const w = g.world;
  const meteors = g.meteors.list;
  const blocked = (x, y) => {
    if (w.blockedAt(x, y) || w.inMemorial(x, y, 40)) return true;
    const gr = w.groundAt(x, y);
    if (gr === GROUND.WATER) return true;
    for (const m of meteors) if (m.alive && Math.hypot(m.x - x, m.y - y) < MET.radius + 40) return true;
    for (const s of g.shots) if (s.alive && Math.hypot(s.x - x, s.y - y) < CONFIG.tank.radius + 20) return true; // Tank ateşi halkası
    return false;
  };
  let best = 0; let bs = -1e9; let front = 0;
  for (let k = -5; k <= 5; k++) {
    const a = p.a + k * 0.32;
    const ca = Math.cos(a); const sa = Math.sin(a);
    let free = 0;
    for (let d = 30; d <= 480; d += 30) { if (blocked(p.x + ca * d, p.y + sa * d)) break; free++; }
    let pen = 0;
    const avoid = (c, w) => {
      const dx = c.x - p.x; const dy = c.y - p.y;
      const along = dx * ca + dy * sa;
      if (along < 0 || along > 420) return;
      const side = Math.abs(-dx * sa + dy * ca);
      if (side < 70 + c.wid * 0.5) pen += w * (1 - along / 460);
    };
    for (const c of g.cops) avoid(c, c.type === 'tank' ? 9 : 5);
    for (const n of g.crowd.npcs) if (n.alive) avoid(n, 3); // Sivil trafik
    for (const n of g.crowd.hw) if (n.alive) avoid(n, 3); // Otoban trafiği
    // Meteor ya da tank halkasının içindeyse en hızlı dışarı yön
    for (const m of [...meteors, ...g.shots]) {
      if (!m.alive) continue;
      const d0 = Math.hypot(m.x - p.x, m.y - p.y) || 1;
      if (d0 < Math.max(MET.radius, CONFIG.tank.radius) + 60) pen += Math.max(0, ((m.x - p.x) * ca + (m.y - p.y) * sa) / d0) * 12;
    }
    const sc = free - pen - Math.abs(k) * 0.35;
    if (sc > bs) { bs = sc; best = k; }
    if (k === 0) front = free;
  }
  const reverse = front <= 1 && p.speed < 90;
  if (reverse) return { steer: 0, reverse: true };
  return { steer: best < 0 ? -1 : best > 0 ? 1 : 0, reverse: false };
}

// Oyunu T0'dan itibaren bot sürer; önce ölümsüz ısınma (T0 - warm), sonra hasar açık
export function runStage(seed, T0, span, { warm = 30, car = CONFIG.cars[6], onTick = null, cops = CONFIG.difficulty.maxActive } = {}) {
  const g = new Game(seed);
  g.copLimit = cops; // 24 masaüstü yüksek kalite, 12 telefon
  g.alienLimit = cops <= CONFIG.pursuit.phoneCap ? CONFIG.aliens.phoneCap : CONFIG.aliens.desktopCap;
  // Isınma gerçekçi: su ve anıt gerçek, yalnız hasar kapalı. Isınmada batan ya da anıta giren deneme sayılmaz (yeniden)
  for (let tries = 0; tries < 6; tries++) {
    g.start(car, { seed: 700 + seed + tries * 1000, startTime: Math.max(0, T0 - warm), god: false });
    g.hurt = () => {};
    let t0 = 0;
    while (g.time < T0 && g.state === 'play') {
      const c = smartBot(g);
      g.tick(dt, c.steer, c.reverse);
      t0 += dt;
    }
    delete g.hurt;
    if (g.state === 'play') break;
  }
  let t = 0; let ctl = { steer: 0, reverse: false };
  const step = () => {
    if (((t * 60) | 0) % 4 === 0) ctl = smartBot(g);
    g.tick(dt, ctl.steer, ctl.reverse);
    t += dt;
  };
  g.damage = 0; g.burning = false; g.burnT = 0;
  const t1 = g.time;
  while (g.state === 'play' && g.time < T0 + span) { step(); if (onTick) onTick(g, g.time - t1); }
  return { g, survived: g.state === 'play', time: g.time - t1, cause: g.cause, damage: g.damage };
}

if (process.argv[1] && process.argv[1].endsWith('stage-bot.mjs')) {
  const args = process.argv.slice(2);
  const N = Number(args[0] || 10);
  const span = Number(args[1] || 30);
  const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : '';
  const cops = args.includes('--cops') ? Number(args[args.indexOf('--cops') + 1]) : CONFIG.difficulty.maxActive;
  const D = CONFIG.difficulty;
  const stages = [['polis', 20], ['SWAT', D.swatAt], ['ağır takviye', D.advancedAt], ['uzaylı', D.aliensAt], ['tank', D.tanksAt], ['meteor', MET.at]];
  const out = [];
  for (const [name, T] of stages) {
    let ok = 0; let dead5 = 0; const times = []; const causes = {};
    for (let i = 0; i < N; i++) {
      const r = runStage(i, T, span, { cops });
      if (r.survived) ok++;
      if (!r.survived && r.time < 5) dead5++;
      if (!r.survived) causes[r.cause] = (causes[r.cause] || 0) + 1;
      times.push(r.time);
    }
    times.sort((a, b) => a - b);
    const row = { stage: name, cops, at: T, span, survived: ok, n: N, deadIn5s: dead5, median: +times[N >> 1].toFixed(1), min: +times[0].toFixed(1), causes };
    out.push(row);
    console.log(JSON.stringify(row));
  }
  if (jsonOut) fs.writeFileSync(jsonOut, JSON.stringify(out, null, 1));
}
