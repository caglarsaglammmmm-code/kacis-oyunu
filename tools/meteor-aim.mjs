// Meteor nişan ölçümü: bot meteor aşamasında sürer (polis yok, ölümsüz), asıl meteor çarptığında arabaya göre nerede:
// üstünde (yarıçap içinde), önde, yanda, arkada. Ayrıca kilitten sonra yönünü koruyan arabalar ayrı sayılır.
// node tools/meteor-aim.mjs [tohum sayısı]
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';
const dt = 1 / 60; const R = CONFIG.meteor.radius;
function bot(g) { const p = g.player; const w = g.world; const look = (a) => { let s = 0; for (let d = 40; d <= 360; d += 40) { if (w.blockedAt(p.x + Math.cos(a) * d, p.y + Math.sin(a) * d)) break; s++; } return s; }; const c = look(p.a), l = look(p.a - 0.55), r = look(p.a + 0.55); if (c >= 5) return 0; return l > r ? -1 : 1; }
for (const carId of ['atmaca', 'kuzgun']) {
  const car = CONFIG.cars.find((c) => c.id === carId);
  const st = { n: 0, hit: 0, straightN: 0, straightHit: 0, straightBehind: 0, turnedN: 0, turnedBehind: 0, sb: [] };
  for (let seed = 0; seed < Number(process.argv[2] || 10); seed++) {
    const g = new Game(seed); g.view.w = 1280; g.view.h = 720;
    g.start(car, { seed: 900 + seed, startTime: CONFIG.meteor.at - 2, god: true });
    const ms = g.meteors; const imp = ms.impact.bind(ms);
    const lockA = new Map();
    ms.impact = (game, m) => {
      if (m.main && lockA.has(m)) {
        const p = game.player; const sp = Math.hypot(p.vx, p.vy) || 1;
        const dx = m.x - p.x, dy = m.y - p.y; const d = Math.hypot(dx, dy); const along = (dx * p.vx + dy * p.vy) / sp;
        let da = Math.abs(Math.atan2(p.vy, p.vx) - lockA.get(m)); if (da > Math.PI) da = 2 * Math.PI - da;
        st.n++; if (d < R) st.hit++;
        if (da < 0.5) { st.straightN++; if (d < R) st.straightHit++; else if (along < -R) { st.straightBehind++; st.sb.push(Math.round(-along)); } }
        else { st.turnedN++; if (along < -R && d >= R) st.turnedBehind++; }
        lockA.delete(m);
      }
      return imp(game, m);
    };
    for (let t = 0; t < 120 && g.state === 'play'; t += dt) {
      g.tick(dt, bot(g), false); g.cops.length = 0;
      for (const m of ms.list) if (m.alive && m.main && m.falling && !lockA.has(m)) lockA.set(m, Math.atan2(g.player.vy, g.player.vx));
    }
  }
  st.sb.sort((a, b) => a - b); st.sb = st.sb.slice(-6);
  console.log(carId, JSON.stringify(st));
}
