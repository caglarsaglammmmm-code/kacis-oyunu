// v22: oyuncuyu hedef alan meteor, bütün araçların suya düşmesi, 8 sn düz gidişte yol kapatma barikatı
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';
import { meteorAim } from '../js/meteor.js';
import { isDeep, CHUNK } from '../js/world.js';
import { GROUND } from '../js/config.js';

const dt = 1 / 60;
const MET = CONFIG.meteor;
const RB = CONFIG.roadblock;
const VW = CONFIG.vehWater;
function game(opts = {}) {
  const g = new Game(1);
  g.view.w = 1280; g.view.h = 720;
  g.start(CONFIG.cars[6], { seed: 99, startTime: 0, god: false, ...opts });
  return g;
}

// --- METEOR ---
test('meteor nişanı: oyuncunun gideceği noktaya, hıza orantılı (yavaşta yakın, hızlıda uzak), yolda; tam üstüne değil', () => {
  const g = game({ startTime: MET.at + 1, god: true });
  const p = g.player; // Başlangıç: +y yönünde uzanan ana yol
  const out = { x: 0, y: 0, lead: 0 };
  const rows = [];
  for (const v of [80, 200, 320, 420]) {
    p.x = 100; p.y = 300; p.a = Math.PI / 2; p.vx = 0; p.vy = v;
    g.world.update(p.x, p.y);
    assert.ok(meteorAim(g, out), `${v}: nişan bulundu`);
    const d = Math.hypot(out.x - p.x, out.y - p.y);
    rows.push({ v, d: Math.round(d), want: Math.round(v * (MET.warn + MET.fall)), road: g.world.groundAt(out.x, out.y) === GROUND.ROAD });
    assert.ok(d >= MET.minR, 'tam üstünde değil');
    assert.ok(out.y > p.y && Math.abs(out.x - p.x) < 140, 'gidiş yönünde');
    assert.ok(g.world.groundAt(out.x, out.y) === GROUND.ROAD, 'yolda');
  }
  console.log('# hız -> nişan uzaklığı', JSON.stringify(rows));
  for (let i = 1; i < rows.length; i++) assert.ok(rows[i].d >= rows[i - 1].d, 'hızlı araçta daha ileride');
  assert.ok(rows.at(-1).d > rows[0].d * 2, 'belirgin fark');
  // Hızlıda tahmin süreye uyar (yol açık olduğu sürece)
  assert.ok(Math.abs(rows[2].d - rows[2].want) < 120, `320 hızda ${rows[2].d} ~ ${rows[2].want}`);
});

test('meteor: asıl meteor kilitlenir (takip etmez); uyarı en az 3 sn; nişan eskisinden küçük; çarpma 1-2 sn sarsar', () => {
  assert.ok(MET.warn >= 3);
  assert.ok(MET.radius <= 120 * 0.6, `yarıçap ${MET.radius} (eskisi 120)`);
  assert.ok(MET.quake >= 1 && MET.quake <= 2);
  const g = game({ startTime: MET.at - 0.1, god: true });
  const p = g.player;
  let m = null;
  for (let i = 0; i < 120 && !m; i++) { p.vx = 0; p.vy = 300; g.tick(dt, 0, false); m = g.meteors.list.find((k) => k.alive && k.main); }
  assert.ok(m, 'asıl meteor çıktı');
  const at = { x: m.x, y: m.y };
  // Oyuncu sola kıvrılır, nişan yerinde kalır
  for (let i = 0; i < 60; i++) { p.vx = -300; p.vy = 0; g.tick(dt, -1, false); }
  assert.deepEqual({ x: m.x, y: m.y }, at, 'kilitli');
  // Çarpma: sarsıntı 1-2 sn sürer
  m.t = MET.warn + MET.fall - dt / 2;
  g.tick(dt, 0, false);
  assert.ok(g.quakeT > 1 && g.quakeT <= 2, `sarsıntı ${g.quakeT}`);
  let shaken = 0;
  for (let i = 0; i < 60 * 2.2; i++) { g.tick(dt, 0, false); if (g.cam.shake > 1) shaken += dt; }
  assert.ok(shaken > 0.9 && shaken < 2.3, `sarsıntı süresi ${shaken.toFixed(2)} sn`);
});

test('meteor: fren yapan ya da dönen bot kaçar; sabit giden ölür (adalet)', () => {
  const run = (mode) => {
    const g = game({ startTime: MET.at + 1, god: false });
    g.meteors.waveT = 999; // Yalnız bu meteor
    g.cops.length = 0;
    const p = g.player;
    p.x = 100; p.y = 300; p.a = Math.PI / 2; p.vx = 0; p.vy = 300; p.speed = 300;
    g.world.update(p.x, p.y);
    g.meteors.spawn(g, true);
    const m = g.meteors.list.find((k) => k.alive);
    for (let t = 0; t < MET.warn + MET.fall + 0.3 && g.state === 'play'; t += dt) {
      g.cops.length = 0;
      g.damage = 0;
      if (mode === 'sabit') { p.a = Math.PI / 2; p.vx = 0; p.vy = Math.hypot(m.x - p.x, m.y - p.y) / Math.max(0.05, MET.warn + MET.fall - t); }
      g.tick(dt, 0, mode === 'fren');
    }
    return g.cause === 'meteor' ? 'öldü' : 'kaçtı';
  };
  const r = { sabit: run('sabit'), fren: run('fren') };
  console.log('# meteor kaçış', JSON.stringify(r));
  assert.equal(r.sabit, 'öldü', 'tahmin doğru noktaya');
  assert.equal(r.fren, 'kaçtı', 'fren yapan kaçar');
});

test('meteor: korunan alanlara (anıt, gizli geçit, stadyum) asıl nişan da düşmez', () => {
  const g = game({ startTime: MET.at + 1, god: true });
  const out = { x: 0, y: 0, lead: 0 };
  let tries = 0;
  for (const z of g.world.zones()) {
    for (let i = 0; i < 400; i++) {
      const p = g.player;
      const a = Math.random() * 6.283;
      p.x = z.x + z.w / 2 + Math.cos(a) * (z.w / 2 + 300 + Math.random() * 500);
      p.y = z.y + z.h / 2 + Math.sin(a) * (z.h / 2 + 300 + Math.random() * 500);
      p.vx = -Math.cos(a) * 400; p.vy = -Math.sin(a) * 400; // Alana doğru sürüyor
      if (!meteorAim(g, out)) continue;
      tries++;
      for (const k of g.world.zones()) {
        const dx = Math.max(k.x - out.x, 0, out.x - k.x - k.w); const dy = Math.max(k.y - out.y, 0, out.y - k.y - k.h);
        assert.ok(Math.hypot(dx, dy) > MET.radius, `${k.kind}`);
      }
    }
  }
  assert.ok(tries > 20, `deneme ${tries}`);
});

// --- SU ---
function findWater(g) {
  for (let r = 0; r < 8; r++) {
    for (let cy = -r; cy <= r; cy++) {
      for (let cx = -r; cx <= r; cx++) {
        const c = g.world.chunk(cx, cy);
        for (let i = 0; i < c.rectCount; i++) {
          const w = c.rects[i];
          if (isDeep(w) && w.w > 120 && w.h > 120) return w;
        }
      }
    }
  }
  return null;
}

test('su: polis, SWAT, uzaylı, tank ve trafik itilince ya da hızla dalınca suya düşer, sıçrar ve batıp kaybolur; tank daha yavaş', () => {
  const g = game({ god: true });
  const w = findWater(g);
  assert.ok(w, 'derin su bulundu');
  const ev = [];
  g.onEvent = (n) => ev.push(n);
  g.player.x = w.x - 400; g.player.y = w.y - 400;
  const times = {};
  for (const type of ['car', 'swat', 'dart', 'tank']) {
    g.cops.length = 0;
    const c = g.spawnCop(type, 'chaser', w.x - 30, w.y + w.h / 2, 0);
    c.x = w.x - c.wid * 0.5 - 2; c.vx = 120; c.vy = 0; c.pushT = VW.pushTime; // İtilmiş, suya doğru
    g.collideWorld(c, false);
    assert.ok(c.sinkT > 0, `${type} suya düştü`);
    let t = 0;
    while (g.cops.includes(c) && t < 6) { g.updateCops(dt); t += dt; }
    assert.ok(!g.cops.includes(c), `${type} batıp kayboldu`);
    times[type] = +t.toFixed(2);
  }
  assert.ok(times.tank > times.car, 'tank daha yavaş batar');
  assert.ok(ev.filter((e) => e === 'vehsink').length >= 4, 'sıçrama olayı');
  // Hızla dalan (itilmemiş) polis de düşer
  const fast = g.spawnCop('car', 'chaser', w.x - 13, w.y + w.h / 2, 0);
  fast.vx = VW.speed + 60; fast.vy = 0;
  g.collideWorld(fast, false);
  assert.ok(fast.sinkT > 0, 'hızlı virajda suya dalan düşer');
  // Yavaş ve itilmemiş: yapay zekâ suyu engel bilir, düşmez (sekip döner)
  const slow = g.spawnCop('car', 'chaser', w.x - 13, w.y + w.h / 2, 0);
  slow.vx = 90; slow.vy = 0; slow.pushT = 0;
  g.collideWorld(slow, false);
  assert.ok(!(slow.sinkT > 0), 'yavaş araç düşmez');
  // Trafik aracı: çarpılıp savrulunca düşer
  const n = g.crowd.npcs[0];
  Object.assign(n, { alive: true, x: w.x - 14, y: w.y + w.h / 2, vx: 140, vy: 0, a: 0, state: 'wreck', sinkT: 0, pushT: VW.pushTime, len: 46, wid: 23, mass: 1.2, spec: CONFIG.npc.types.klasik, kind: 'klasik', color: 0, t: 0, dir: 0 });
  g.collideWorld(n, false);
  assert.ok(n.sinkT > 0, 'trafik aracı suya düştü');
  let k = 0;
  while (n.alive && k++ < 400) g.crowd.updateNpc(n, dt, g);
  assert.equal(n.alive, false, 'trafik aracı batıp kayboldu');
  console.log('# batma süreleri (sn)', JSON.stringify(times));
});

test('su: oyuncu polisi suya itebilir (çarpma itmiş sayılır); basınç dalgası da iter', () => {
  const g = game({ god: true });
  const w = findWater(g);
  const c = g.spawnCop('car', 'chaser', w.x - 40, w.y + w.h / 2, 0);
  c.vx = 0; c.vy = 0;
  g.copContact(c, 200);
  assert.ok(c.pushT > 0, 'oyuncu çarpması itme sayılır');
  c.vx = 160; c.x = w.x - c.wid * 0.5 - 2;
  g.collideWorld(c, false);
  assert.ok(c.sinkT > 0, 'itilen polis suya düştü');
  const d = g.spawnCop('swat', 'chaser', w.x - 120, w.y + w.h / 2, 0);
  d.vx = 0; d.vy = 0;
  g.shockwave(w.x - 220, w.y + w.h / 2, 300, 420);
  assert.ok(d.pushT > 0 && d.vx > 30, 'basınç dalgası savurur');
});

// --- YOL KAPATMA ---
function straightRun(g, sec, cb) {
  const p = g.player;
  for (let t = 0; t < sec; t += dt) {
    for (let i = g.cops.length - 1; i >= 0; i--) if (!g.cops[i].roadblock) g.removeCop(i);
    p.a = Math.PI / 2; p.vx = 0; p.vy = 300; p.x = 100;
    g.tick(dt, 0, false);
    if (cb && cb(t)) return t;
  }
  return sec;
}

test('barikat: 8 sn düz gidince önce uyarı, sonra en az ~3 sn ileride yolun tamamını kaplayan barikat; arada yan yol var', () => {
  assert.equal(RB.DUZ_GIDIS_SURESI, 8);
  const g = game({ startTime: 60, god: true });
  const ev = [];
  g.onEvent = (n) => ev.push([n, g.runTime]);
  let warnAt = -1;
  straightRun(g, 14, () => { if (warnAt < 0 && ev.some(([n]) => n === 'roadblock')) warnAt = g.straightT; return g.rb.phase === 'up'; });
  assert.ok(warnAt >= RB.DUZ_GIDIS_SURESI - 0.05, `uyarı ${warnAt} sn düz gidişten sonra`);
  assert.equal(g.rb.phase, 'up', 'barikat kuruldu');
  const r = g.rb;
  const p = g.player;
  const dist = Math.hypot(r.x - p.x, r.y - p.y);
  assert.ok(dist / 300 >= 2.9, `barikat ${(dist / 300).toFixed(1)} sn ileride`);
  assert.ok(r.cars.length >= 3, `${r.cars.length} araç`);
  // Yolun tamamı: araçların kapladığı genişlik iki yandaki binaya kadar
  const xs = r.cars.map((c) => c.x).sort((a, b) => a - b);
  for (let i = 1; i < xs.length; i++) assert.ok(xs[i] - xs[i - 1] <= 46, 'aralarında boşluk yok');
  assert.ok(g.world.blockedAt(xs[0] - 34, r.y) || xs[0] < 20, 'sol kenar kapalı');
  assert.ok(g.world.blockedAt(xs.at(-1) + 34, r.y), 'sağ kenar kapalı');
  console.log('# barikat', JSON.stringify({ uyari: +warnAt.toFixed(2), uzaklikSn: +(dist / 300).toFixed(2), arac: r.cars.length, genislik: Math.round(xs.at(-1) - xs[0]) }));
});

test('barikat: geçilemez; hile açıkken geçilir; silahla patlatılınca yol açılır; yön değiştirince dağılır', () => {
  const g = game({ startTime: 60, god: true });
  straightRun(g, 14, () => g.rb.phase === 'up');
  assert.equal(g.rb.phase, 'up');
  const r = g.rb;
  const p = g.player;
  // Geçilemez: barikata doğru sür
  p.x = r.x; p.y = r.y - 160; p.vx = 0; p.vy = 300; p.a = Math.PI / 2;
  for (let i = 0; i < 90; i++) { p.vy = Math.max(p.vy, 250); p.a = Math.PI / 2; g.tick(dt, 0, false); }
  assert.ok(p.y < r.y, 'barikattan geçemedi');
  // Hile: geçer
  g.toggleCheat();
  for (let i = 0; i < 90; i++) { p.vx = 0; p.vy = 300; p.a = Math.PI / 2; g.tick(dt, 0, false); }
  assert.ok(p.y > r.y + 20, 'hile açıkken geçti');
  g.toggleCheat();
  // Silahla patlatılabilir: normal polis ~20-25 mermi
  const c = r.cars[0];
  assert.ok(c.mhpMax / CONFIG.weapon.damage >= 20 && c.mhpMax / CONFIG.weapon.damage <= 25, 'polis kadar mermi');
  while (c.mhp > 0) g.hitCop(c, c.x, c.y);
  g.updateCops(dt);
  assert.ok(!g.cops.includes(c), 'patladı, yol açıldı');
  // Dönüp uzaklaşınca dağılır
  p.x = r.x; p.y = r.y - 900; p.vx = 0; p.vy = -300; p.a = -Math.PI / 2;
  for (let i = 0; i < 30; i++) { p.vy = -300; g.tick(dt, 0, false); }
  assert.equal(g.rb.phase, 'none', 'dağıldı');
  assert.ok(!g.cops.some((k) => k.roadblock), 'barikat polisi kalmadı');
});

test('barikat: korunan alanlara kurulmaz; meteor yakındaysa kurulmaz; düz gitmeyen oyuncuya kurulmaz', () => {
  const g = game({ startTime: 60, god: true });
  // Zikzak: barikat yok
  const p = g.player;
  for (let t = 0; t < 12; t += dt) { p.x = 100; p.vx = 0; p.vy = 300; g.tick(dt, Math.sin(t * 2) > 0 ? 1 : -1, false); }
  assert.equal(g.rb.phase, 'none', 'düz gitmeyene barikat yok');
  const z = g.world.zone('memorial');
  p.x = z.x + z.w / 2; p.y = z.y + z.h + 500; p.vx = 0; p.vy = -350; p.speed = 350;
  assert.equal(g.planRoadblock(), false, 'anıtın önüne kurulmaz');
});
