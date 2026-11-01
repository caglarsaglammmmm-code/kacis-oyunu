// Denge ölçümü: basit bot N kez oynar, hayatta kalma süresini raporlar. node tools/balance.mjs
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';
const dt = 1 / 60;
const N = Number(process.argv[2] || 40);
const start = Number(process.argv[3] || 0);
function bot(g, skill, avoid) {
  const p = g.player;
  const look = (a) => { let s = 0; for (let d = 40; d <= 360; d += 40) { if (g.world.blockedAt(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d)) break; s++; } return s; };
  const c = look(p.a); const l = look(p.a - 0.55); const r = look(p.a + 0.55);
  // Polisten kaçınma: önündeki en yakın polisten yana kır
  if (avoid) {
    let best = null; let bd = 260;
    for (const k of g.cops) {
      const dx = k.x - p.x; const dy = k.y - p.y; const d = Math.hypot(dx, dy);
      if (d < bd && dx * Math.cos(p.a) + dy * Math.sin(p.a) > 0) { bd = d; best = k; }
    }
    if (best && c >= 3) {
      const side = (best.x - p.x) * -Math.sin(p.a) + (best.y - p.y) * Math.cos(p.a);
      const want = side > 0 ? -1 : 1;
      if ((want < 0 ? l : r) >= 3) return want;
    }
  }
  if (c >= 5 && Math.random() > 0.01) return 0;
  if (Math.random() > skill) return 0;
  return l > r ? -1 : 1;
}
for (const [skill, avoid] of [[0.35, false], [0.8, true]]) {
  const res = [];
  let d30 = 0;
  for (let i = 0; i < N; i++) {
    const g = new Game(i);
    g.start(CONFIG.cars[0], { seed: 1000 + i, startTime: start, god: false });
    let t = 0; let s = 0;
    while (g.state !== 'over' && t < 900) {
      if ((t * 60 | 0) % 8 === 0) s = bot(g, skill, avoid);
      g.tick(dt, s, false); t += dt;
    }
    res.push({ t: g.time, kills: g.kills, score: g.score | 0, coins: g.result ? g.result.coins : 0 });
    if (g.time < 30) d30++;
  }
  const ts = res.map((r) => r.t).sort((a, b) => a - b);
  const q = (k) => ts[Math.floor(ts.length * k)].toFixed(0);
  console.log(`bot ${avoid ? 'polisten kaçan' : 'kör'}: min ${q(0)} p25 ${q(.25)} medyan ${q(.5)} p75 ${q(.75)} max ${ts.at(-1).toFixed(0)} | 30 sn altı ölüm ${d30}/${N} | ort. kill ${(res.reduce((a,r)=>a+r.kills,0)/N).toFixed(1)} | ort. coin ${(res.reduce((a,r)=>a+r.coins,0)/N).toFixed(0)}`);
}
