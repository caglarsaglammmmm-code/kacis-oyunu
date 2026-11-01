// Dönüş botu: haritanın farklı yerlerinde sokak dönüşü, kavşak geçişi, U dönüşü ve çıkmaz sokak dener.
// Polis ve trafik yoktur; yalnızca sürüş ve duvar teması ölçülür. Girdiler oyuncununkiyle aynıdır:
// sol, sağ, ikisi birden (fren/geri). Araba kendi gaz verir.
// Kullanım: node tools/turnbot.mjs [tohum sayısı] [tohum başına deneme] [--json dosya] [--fails]
import { writeFileSync } from 'node:fs';
import { CONFIG, GROUND } from '../js/config.js';
import { Game } from '../js/game.js';
import { TILE, CT } from '../js/world.js';

const args = process.argv.slice(2);
const seeds = Number(args[0] || 10);
const perSeed = Number(args[1] || 120);
const jsonOut = args.includes('--json') ? args[args.indexOf('--json') + 1] : '';
const showFails = args.includes('--fails');
const dt = 1 / 60;
const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];
const CARS = ['dogan', 'motor', 'clio', 'duster'].map((id) => CONFIG.cars.find((c) => c.id === id)).filter(Boolean);
const SPEED = { dusuk: 110, orta: 220, yuksek: 0.95 }; // yuksek: arabanın son hızına oran

let rs = 1;
const rnd = () => { rs = (rs * 1664525 + 1013904223) >>> 0; return rs / 4294967296; };
const pick = (a) => a[Math.floor(rnd() * a.length)];

function isOpen(w, tx, ty) {
  if (w.costAtTile(tx, ty) === 0) return false;
  const g = w.groundAt((tx + 0.5) * TILE, (ty + 0.5) * TILE);
  return g === GROUND.ROAD || g === GROUND.ALLEY || g === GROUND.TRACK;
}
function run(w, tx, ty, d, max) {
  let n = 0;
  while (n < max && isOpen(w, tx + DIRS[d][0] * (n + 1), ty + DIRS[d][1] * (n + 1))) n++;
  return n;
}
// Yol genişliği: enine kaç karo açık
const widthAt = (w, tx, ty, d) => 1 + run(w, tx, ty, (d + 1) % 4, 6) + run(w, tx, ty, (d + 3) % 4, 6);
const center = (tx, ty) => [(tx + 0.5) * TILE, (ty + 0.5) * TILE];

// Geniş yolda yolu eksene çek: karo merkezi duvara yapışık kalmasın
function centered(w, tx, ty, d) {
  const a = run(w, tx, ty, (d + 1) % 4, 6);
  const b = run(w, tx, ty, (d + 3) % 4, 6);
  const shift = (a - b) / 2;
  const s = DIRS[(d + 1) % 4];
  return [(tx + 0.5 + s[0] * shift) * TILE, (ty + 0.5 + s[1] * shift) * TILE];
}

function line(w, tx, ty, d, n) {
  const out = [];
  for (let i = 0; i <= n; i++) out.push(centered(w, tx + DIRS[d][0] * i, ty + DIRS[d][1] * i, d));
  return out;
}

// Rastgele karodan senaryo üretir: dönüş, kavşak, U dönüşü, çıkmaz sokak
function scenario(g, kind) {
  const w = g.world;
  for (let tries = 0; tries < 900; tries++) {
    const tx = Math.floor((rnd() * 10 - 5) * CT);
    const ty = Math.floor((rnd() * 10 - 5) * CT);
    if (!isOpen(w, tx, ty)) continue;
    const d = Math.floor(rnd() * 4);
    const back = (d + 2) % 4;
    const approach = run(w, tx, ty, back, 7);
    if (approach < 5) continue;
    const start = [tx - DIRS[d][0] * 5, ty - DIRS[d][1] * 5];
    const app = line(w, start[0], start[1], d, 5);
    const tmpl = w.chunk(Math.floor(tx / CT), Math.floor(ty / CT)).template;
    const ownW = widthAt(w, tx, ty, d);
    if (kind === 'donus') {
      const side = (d + (rnd() < 0.5 ? 1 : 3)) % 4;
      if (run(w, tx, ty, side, 6) < 5) continue;
      const sw = widthAt(w, tx + DIRS[side][0] * 3, ty + DIRS[side][1] * 3, side);
      if (sw > 4 && ownW > 4) continue; // İki ana yol kesişimi kolay, sokak ağırlıklı dene
      return { kind, pts: [...app, ...line(w, tx + DIRS[side][0], ty + DIRS[side][1], side, 4)], width: Math.min(ownW, sw), template: tmpl };
    }
    if (kind === 'kavsak') {
      const l = run(w, tx, ty, (d + 1) % 4, 3); const r = run(w, tx, ty, (d + 3) % 4, 3);
      if ((l < 2 && r < 2) || run(w, tx, ty, d, 6) < 5) continue;
      if (ownW > 5) continue;
      return { kind, pts: [...app, ...line(w, tx + DIRS[d][0], ty + DIRS[d][1], d, 4)], width: ownW, template: tmpl };
    }
    if (kind === 'uturn') {
      if (ownW > 4) continue;
      return { kind, pts: [...app, ...line(w, tx, ty, back, 4).slice(1)], width: ownW, template: tmpl, turnBack: true };
    }
    if (kind === 'cikmaz') {
      // Burnun gittiği yönde 1-5 karo sonra biten ve yanı kapalı yol
      const ahead = run(w, tx, ty, d, 7);
      if (ahead > 5 || widthAt(w, tx, ty, d) > 3) continue;
      const ex = tx + DIRS[d][0] * ahead; const ey = ty + DIRS[d][1] * ahead;
      const sideOut = run(w, ex, ey, (d + 1) % 4, 3) + run(w, ex, ey, (d + 3) % 4, 3);
      const beyond = w.costAtTile(ex + DIRS[d][0], ey + DIRS[d][1]) !== 0;
      if (beyond || sideOut > 2) continue;
      return { kind, pts: [...app, ...line(w, tx, ty, d, ahead).slice(1), ...line(w, ex, ey, back, ahead + 5).slice(1)], width: ownW, template: tmpl, turnBack: true };
    }
  }
  return null;
}

// Karo üzerinde en kısa yol: hedefe giden yolun birkaç adım ilerisini verir
function detour(w, x, y, goal) {
  const R = 34;
  const ox = Math.floor(x / TILE) - R; const oy = Math.floor(y / TILE) - R;
  const S = R * 2 + 1;
  const gx = Math.floor(goal[0] / TILE) - ox; const gy = Math.floor(goal[1] / TILE) - oy;
  if (gx < 0 || gy < 0 || gx >= S || gy >= S) return null;
  const dist = new Int16Array(S * S).fill(-1);
  const q = [gy * S + gx];
  dist[q[0]] = 0;
  for (let h = 0; h < q.length; h++) {
    const i = q[h]; const cx = i % S; const cy = (i / S) | 0;
    if (cx === R && cy === R) break;
    for (const [dx, dy] of DIRS) {
      const nx = cx + dx; const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= S || ny >= S) continue;
      const j = ny * S + nx;
      if (dist[j] >= 0 || w.costAtTile(nx + ox, ny + oy) === 0) continue;
      dist[j] = dist[i] + 1;
      q.push(j);
    }
  }
  let cx = R; let cy = R;
  if (dist[cy * S + cx] < 0) return null;
  for (let s = 0; s < 3; s++) {
    for (const [dx, dy] of DIRS) {
      const nx = cx + dx; const ny = cy + dy;
      if (nx < 0 || ny < 0 || nx >= S || ny >= S) continue;
      const v = dist[ny * S + nx];
      if (v >= 0 && v < dist[cy * S + cx]) { cx = nx; cy = ny; break; }
    }
  }
  return [(cx + ox + 0.5) * TILE, (cy + oy + 0.5) * TILE];
}

// Yol izleyici: ilerideki noktaya bakar, keskin dönüş yaklaşırsa frene basar. İnsan gibi kesikli girdi
function driveTrial(g, car, sc, entry, useBrake) {
  const p = g.player;
  const pts = sc.pts;
  const a0 = Math.atan2(pts[1][1] - pts[0][1], pts[1][0] - pts[0][0]);
  g.carSpec = car;
  g.resetRun(0);
  g.state = 'play';
  g.time = 60; // Erken dönem hasar indirimi ölçümü karıştırmasın
  g.god = true; // Derin su duvar gibi davranır
  const base = { len: car.len, wid: car.wid, mass: car.mass, grip: car.grip };
  p.x = pts[0][0]; p.y = pts[0][1]; p.a = a0; p.vx = Math.cos(a0) * entry; p.vy = Math.sin(a0) * entry;
  p.w = 0; p.steer = 0; p.grip = base.grip; p.len = base.len; p.wid = base.wid; p.mass = base.mass; p.flat = 0;
  let idx = 0; let t = 0; let slowT = 0; let stuck = 0; let hits = 0; let dmg = 0; let maxSlow = 0;
  const limit = 9 + pts.length * 0.5;
  let steerCmd = 0; let revHold = 0;
  while (t < limit) {
    t += dt;
    while (idx < pts.length - 1 && Math.hypot(pts[idx][0] - p.x, pts[idx][1] - p.y) < 62) idx++;
    if (idx === pts.length - 1 && Math.hypot(pts[idx][0] - p.x, pts[idx][1] - p.y) < 62) {
      return { ok: true, t, stuck, hits, dmg, maxSlow };
    }
    let tgt = pts[Math.min(pts.length - 1, idx + (p.speed > 200 ? 1 : 0))];
    // Hedef duvar arkasında kaldıysa oyuncu gibi etrafından dolaş
    if (!g.world.lineClear(p.x, p.y, tgt[0], tgt[1])) tgt = detour(g.world, p.x, p.y, pts[idx]) || tgt;
    const want = Math.atan2(tgt[1] - p.y, tgt[0] - p.x);
    let err = want - p.a;
    while (err > Math.PI) err -= Math.PI * 2;
    while (err < -Math.PI) err += Math.PI * 2;
    // Yaklaşan köşe: üç nokta ilerideki yön farkına göre hız hedefi
    let corner = 0;
    for (let k = idx; k < Math.min(pts.length - 2, idx + 4); k++) {
      const a = Math.atan2(pts[k + 1][1] - pts[k][1], pts[k + 1][0] - pts[k][0]);
      const b = Math.atan2(pts[k + 2][1] - pts[k + 1][1], pts[k + 2][0] - pts[k + 1][0]);
      let d = Math.abs(b - a); if (d > Math.PI) d = Math.PI * 2 - d;
      corner = Math.max(corner, d);
    }
    const safe = corner > 2 ? 70 : corner > 1 ? (sc.width <= 1 ? 120 : 170) : 1e9;
    let brake = useBrake && (p.forward > safe + 15 || (Math.abs(err) > 1.2 && p.speed > 150));
    if (Math.abs(err) > 0.09) steerCmd = Math.sign(err); else steerCmd = 0;
    // U dönüşü sıkışırsa üç noktalı manevra: geri giderken direksiyon ters
    if (Math.abs(err) > 1.3 && p.speed < 75) revHold = Math.max(revHold, 0.5);
    if (revHold > 0) { revHold -= dt; brake = true; if (Math.abs(err) < 0.7) revHold = 0; }
    const backing = p.forward < -5 || g.autoRevT > 0;
    const steer = backing ? -steerCmd : steerCmd;
    g.world.update(p.x, p.y);
    g.updatePlayer(dt, steer, brake);
    if (p.speed < 25) { slowT += dt; if (slowT > maxSlow) maxSlow = slowT; if (slowT > 1 && slowT - dt <= 1) stuck++; } else slowT = 0;
  }
  return { ok: false, t, stuck, hits, dmg, maxSlow, idx, n: pts.length, px: Math.round(p.x), py: Math.round(p.y), v: Math.round(p.speed), a: +p.a.toFixed(2), spawn: pts[idx] };
}

const groups = {};
const fails = [];
const add = (k, r) => {
  const s = (groups[k] ??= { deneme: 0, basarili: 0, takilma: 0, sure: 0, hasar: 0 });
  s.deneme++; if (r.ok) { s.basarili++; s.sure += r.t; } if (r.stuck) s.takilma++; s.hasar += r.dmg;
};

const t0 = Date.now();
for (let si = 0; si < seeds; si++) {
  const seed = 9000 + si * 37;
  rs = seed;
  const g = new Game(seed);
  g.start(CARS[0], { seed, startTime: 0, god: true });
  let dmg = 0;
  const hurt = g.hurt.bind(g);
  g.hurt = (x) => { dmg += x; hurt(x); };
  for (let i = 0; i < perSeed; i++) {
    const kind = pick(['donus', 'donus', 'donus', 'kavsak', 'uturn', 'uturn', 'cikmaz']);
    const sc = scenario(g, kind);
    if (!sc) continue;
    const car = pick(CARS);
    const sk = pick(Object.keys(SPEED));
    const entry = sk === 'yuksek' ? car.maxSpeed * SPEED[sk] : SPEED[sk];
    dmg = 0;
    const fren = rnd() < 0.5; // Yarısı yalnızca direksiyonla döner: çoğu oyuncu böyle sürer
    const r = driveTrial(g, car, sc, entry, fren);
    r.dmg = dmg;
    const wk = sc.width <= 1 ? 'dar' : sc.width <= 2 ? 'sokak' : 'genis';
    add('TOPLAM', r); add(`tur:${kind}`, r); add(`hiz:${sk}`, r); add(`gen:${wk}`, r); add(`arac:${car.id}`, r); add(fren ? 'surus:frenli' : 'surus:yalniz-direksiyon', r);
    if (!r.ok || r.stuck) fails.push({ seed, kind, car: car.id, hiz: sk, gen: sc.width, sablon: sc.template, ok: r.ok, fren, son: r.px === undefined ? '' : [r.idx, r.n, r.px, r.py, r.v, r.a, ...(r.spawn||[])].join(' '), x: Math.round(sc.pts[5]?.[0] ?? 0), y: Math.round(sc.pts[5]?.[1] ?? 0) });
  }
}

const rows = Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)).map(([k, s]) => ({
  grup: k, deneme: s.deneme, bitirdi: s.basarili, bitiremedi: s.deneme - s.basarili, takildi: s.takilma, 'ort.sn': +(s.sure / Math.max(1, s.basarili)).toFixed(2), 'ort.hasar': +(s.hasar / s.deneme).toFixed(1),
}));
console.table(rows);
const bySablon = {};
for (const f of fails) bySablon[`${f.sablon}/${f.kind}`] = (bySablon[`${f.sablon}/${f.kind}`] || 0) + 1;
console.log('takılan yerler (şablon/tür):', Object.entries(bySablon).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([k, v]) => `${k}:${v}`).join('  '));
console.log(`süre ${((Date.now() - t0) / 1000).toFixed(1)} sn`);
if (showFails) console.log(fails.slice(0, 40));
if (jsonOut) writeFileSync(jsonOut, JSON.stringify({ rows, fails }, null, 1));
