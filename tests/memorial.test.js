// Cumhuriyet Meydanı anıtı: yer, koruma kuralı, ceza, hile, polis/UFO/mermi, Gençliğe Hitabe metni
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';
import { World, TILE } from '../js/world.js';
import { Storage } from '../js/storage.js';
import { HITABE, HITABE_TITLE, HITABE_YEAR, MEM_MOTTO, MEM_SIGNATURE, MEM_LAYOUT, memFitFrame } from '../js/memorial.js';

const dt = 1 / 60;
const MC = CONFIG.memorial;
const car = CONFIG.cars[0];

function mem() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}
function setup({ god = false, seed = 21 } = {}) {
  const g = new Game(1);
  g.start(car, { seed, startTime: 0, god });
  g.runTime = 5;
  const ev = [];
  g.onEvent = (n, v) => ev.push([n, v]);
  const b = g.world.memorialBox();
  g.world.chunk(b.cx, b.cy);
  return { g, b, ev };
}
const inside = (b, x, y) => x > b.x && x < b.x + b.w && y > b.y && y < b.y + b.h;

// Oyuncuyu anıtın güneyine koyup kuzeye, korunan bölüme doğru sürer
function driveIn(g, b, seconds = 3) {
  const p = g.player;
  p.x = b.x + b.w / 2; p.y = b.y + b.h + 90; p.a = -Math.PI / 2; p.vx = 0; p.vy = -260; p.speed = 260;
  g.cops.length = 0;
  for (let t = 0; t < seconds && g.state === 'play'; t += dt) g.tick(dt, 0, false);
}

test('Gençliğe Hitabe metni kullanıcının verdiği metinle karakter karakter aynı', () => {
  const ref = fs.readFileSync(new URL('./fixtures/hitabe.txt', import.meta.url), 'utf8');
  assert.equal(HITABE.length, ref.length);
  for (let i = 0; i < ref.length; i++) assert.equal(HITABE[i], ref[i], `karakter ${i}`);
  assert.equal(HITABE, ref);
  assert.equal(HITABE_TITLE, 'Gençliğe Hitabe');
  assert.equal(HITABE_YEAR, '1927');
  assert.equal(MEM_MOTTO, 'Ne mutlu Türküm diyene!');
  assert.equal(MEM_SIGNATURE, 'Gazi Mustafa Kemal Atatürk');
  for (const ch of ['â', 'î', 'ğ', 'ş', 'ı', 'İ', 'ü', 'ö', 'ç']) assert.ok(HITABE.includes(ch), ch);
});

test('anıt her tohumda şehirde tek bir yerde; korunan bölüm geçilmez ve kutsal', () => {
  for (const seed of [1, 21, 12345, 777, 9]) {
    const w = new World(seed);
    const b = w.memorialBox();
    assert.ok(b, `tohum ${seed}: anıt var`);
    const ring = Math.max(Math.abs(b.cx), Math.abs(b.cy));
    assert.ok(ring >= 2 && ring <= 6, `tohum ${seed}: başlangıca yakın (${ring})`);
    const c = w.chunk(b.cx, b.cy);
    assert.equal(c.template, 'anit');
    assert.equal(c.biome, 'city');
    const rect = c.rects.slice(0, c.rectCount).find((r) => r.memorial);
    assert.ok(rect && rect.sacred, 'korunan ve yıkılmaz');
    assert.deepEqual([rect.x, rect.y, rect.w, rect.h], [b.x, b.y, b.w, b.h]);
    for (let y = b.y + 5; y < b.y + b.h; y += TILE) for (let x = b.x + 5; x < b.x + b.w; x += TILE) assert.ok(w.blockedAt(x, y), 'polis yol bulmada engel');
    assert.equal(w.landmarkList().filter((m) => m.id === 'anit').length, 1);
    assert.ok(w.inMemorial(b.x + 10, b.y + 10) && !w.inMemorial(b.x - 10, b.y - 10));
    w.crush(c, rect);
    assert.ok(rect.alive, 'tank ve top yıkamaz');
  }
});

test('oyuncu sınırı geçince araba patlar, oyun biter, 30 para düşer', () => {
  const { g, b, ev } = setup();
  driveIn(g, b);
  assert.equal(g.state, 'dying');
  assert.equal(g.cause, 'memorial');
  assert.ok(!inside(b, g.player.x, g.player.y), 'araba içeri girmedi');
  assert.ok(ev.some(([n]) => n === 'memorialfail'));
  assert.ok(ev.some(([n]) => n === 'explosion'));
  for (let t = 0; t < 4 && g.state !== 'over'; t += dt) g.tick(dt, 0, false);
  assert.equal(g.state, 'over');
  assert.equal(g.result.cause, 'memorial');
  assert.equal(g.result.penalty, MC.penalty);
  assert.equal(g.result.coins, 0, 'koşudan kazanç yok');
  const s = new Storage(mem());
  s.data.coins = 50;
  const r = s.recordRun(g.result);
  assert.equal(r.penalty, 30);
  assert.equal(s.data.coins, 20);
});

test('ceza parayı 0nın altına indirmez, kalıcı kayıt güncellenir', () => {
  const b = mem();
  const s = new Storage(b);
  s.data.coins = 12;
  const r = s.recordRun({ score: 1, time: 1, coins: 0, penalty: 30 });
  assert.equal(r.penalty, 12);
  assert.equal(s.data.coins, 0);
  assert.equal(new Storage(b).data.coins, 0, 'kayıtta 0');
  s.data.coins = 0;
  assert.equal(s.applyPenalty(30), 0);
  assert.equal(s.data.coins, 0);
});

test('hile açıkken anıt katı engel: araba girmez, ceza ve patlama yok', () => {
  const { g, b, ev } = setup();
  g.toggleCheat();
  assert.ok(g.cheat);
  const p = g.player;
  p.x = b.x + b.w / 2; p.y = b.y + b.h + 90; p.a = -Math.PI / 2;
  let maxIn = 0;
  for (let t = 0; t < 3; t += dt) {
    p.vy = Math.min(p.vy, -200); // Sürekli içeri doğru sürer
    g.tick(dt, 0, false);
    if (inside(b, p.x, p.y)) maxIn = Math.max(maxIn, b.y + b.h - p.y);
  }
  assert.equal(g.state, 'play');
  assert.equal(maxIn, 0, 'merkez hiç içeri girmedi');
  assert.ok(p.y >= b.y + b.h, 'korkuluğun önünde kaldı');
  assert.ok(!ev.some(([n]) => n === 'memorialfail' || n === 'explosion'));
  assert.equal(g.penalty, 0);
  // Yandan ve köşeden de girilmez
  for (const [x, y, a] of [[b.x - 90, b.y + b.h / 2, 0], [b.x + b.w + 90, b.y + 100, Math.PI], [b.x + b.w / 2, b.y - 90, Math.PI / 2]]) {
    p.x = x; p.y = y; p.a = a; p.vx = Math.cos(a) * 300; p.vy = Math.sin(a) * 300;
    for (let t = 0; t < 2; t += dt) { g.tick(dt, 0, false); assert.ok(!inside(b, p.x, p.y), 'içeri girmez'); }
  }
  assert.equal(g.state, 'play');
});

test('ölümsüzlükte (geliştirici) anıt yalnızca duvar', () => {
  const { g, b } = setup({ god: true });
  driveIn(g, b, 2);
  assert.equal(g.state, 'play');
  assert.ok(!inside(b, g.player.x, g.player.y));
});

test('polis ve trafik anıta girmez; polis çevresinden dolaşır', () => {
  const { g, b } = setup({ god: true });
  const p = g.player;
  // Oyuncu anıtın kuzeyinde durur, polisler güneyden kovalar
  p.x = b.x + b.w / 2; p.y = b.y - 160; p.vx = 0; p.vy = 0;
  g.cops.length = 0;
  for (let i = 0; i < 4; i++) {
    const c = g.spawnCop('car', 'chaser', b.x + 80 + i * 160, b.y + b.h + 120, -Math.PI / 2);
    c.state = 'chase';
  }
  let entered = 0;
  for (let t = 0; t < 8; t += dt) {
    p.vx = 0; p.vy = 0; p.x = b.x + b.w / 2; p.y = b.y - 160;
    g.tick(dt, 0, false);
    for (const c of g.cops) if (!c.flying && inside(b, c.x, c.y)) entered++;
    for (const n of g.crowd.npcs) if (n.alive && inside(b, n.x, n.y)) entered++;
    for (const q of g.crowd.peds) if (q.alive && inside(b, q.x, q.y)) entered++;
  }
  assert.equal(entered, 0);
});

test('mermi anıt alanına girince söner; UFO ve top mermisi alanın üstüne gelmez', () => {
  const { g, b } = setup({ god: true });
  const m = g.missiles[0];
  Object.assign(m, { alive: true, x: b.x + 20, y: b.y - 30, vx: 0, vy: 760, t: 0, target: null });
  for (let i = 0; i < 20 && m.alive; i++) g.stepMissile(m, dt);
  assert.equal(m.alive, false);
  assert.ok(m.y < b.y + 40, 'alanın kenarında söndü');
  const u = g.spawnCop('ufo', 'chaser', b.x + b.w / 2, b.y + b.h / 2, 0);
  g.player.x = b.x + b.w / 2; g.player.y = b.y + b.h / 2 + 10;
  for (let i = 0; i < 30; i++) {
    g.updateUfo(u, dt, true);
    assert.ok(!g.world.inMemorial(u.x, u.y), 'UFO alanın üstünde değil');
  }
});

test('yaklaşınca "Anıt alanı" uyarısı ve okuma kartı; uzaklaşınca kart kapanır; dokunulunca kapanır', () => {
  const { g, b, ev } = setup({ god: true });
  const p = g.player;
  const put = (d) => { p.x = b.x + b.w / 2; p.y = b.y + b.h + d; g.updateMemorial(); };
  put(1400);
  assert.equal(g.mem.reading, false);
  put(MC.readDist - 20);
  assert.equal(g.mem.reading, true);
  assert.ok(ev.some(([n, v]) => n === 'memorialread' && v === 1));
  assert.ok(!ev.some(([n]) => n === 'memorialwarn'));
  put(MC.warnDist - 20);
  assert.ok(ev.some(([n]) => n === 'memorialwarn'), 'kısa uyarı');
  put(MC.readDist + 100);
  assert.equal(g.mem.reading, true, 'arada kapanıp açılmaz');
  put(MC.readClose + 50);
  assert.equal(g.mem.reading, false);
  assert.ok(ev.some(([n, v]) => n === 'memorialread' && v === 0));
  put(200);
  assert.equal(g.mem.reading, true);
  g.dismissMemorialCard();
  assert.equal(g.mem.reading, false);
  put(150);
  assert.equal(g.mem.reading, false, 'dokunulunca bu yaklaşımda kapalı kalır');
  put(MC.readClose + 100);
  put(300);
  assert.equal(g.mem.reading, true, 'uzaklaşıp dönünce yeniden açılır');
});

test('düzen: ortada en büyük 1, solda 2, sağda 3, altta 4, üstte levha; fotoğraf kırpılmaz', () => {
  const [c, l, r, d] = MEM_LAYOUT.slots;
  const P = MEM_LAYOUT.plaque;
  assert.ok(c.w * c.h > l.w * l.h && c.w * c.h > r.w * r.h && c.w * c.h > d.w * d.h, 'ortadaki en büyük');
  assert.ok(l.x + l.w <= c.x && r.x >= c.x + c.w, 'sol ve sağ');
  assert.ok(d.y >= c.y + c.h && Math.abs(d.x + d.w / 2 - (c.x + c.w / 2)) < 1, 'altta, ortalı');
  assert.ok(P.y + P.h <= c.y && P.w > c.w, 'üstte uzun levha');
  for (const [slot, aspect] of [[c, 735 / 728], [l, 736 / 1308], [r, 537 / 570], [d, 1448 / 2047]]) {
    const f = memFitFrame(slot, aspect);
    assert.ok(Math.abs(f.w / f.h - aspect) < 1e-9, 'en-boy oranı aynı');
    assert.ok(f.fx >= slot.x - 1e-9 && f.fy >= slot.y - 1e-9 && f.fx + f.fw <= slot.x + slot.w + 1e-9 && f.fy + f.fh <= slot.y + slot.h + 1e-9, 'çerçeve yuvaya sığar');
  }
  assert.equal(MEM_LAYOUT.poles.length, 6);
});
