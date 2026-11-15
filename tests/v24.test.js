// v24.1: yumuşak direksiyon/joystick, para ve puan yalnız dojlama ve makastan, duvar teması ödülü bozar,
// gizli geçidin binası yalnız arkadaş sürümünde
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';
import { CHUNK, TILE } from '../js/world.js';
import { SECRET_LOOK } from '../js/secret-look.js';
import { buildWeb } from '../tools/flavor.mjs';
import * as IN from '../js/input.js';

const dt = 1 / 60;
const OD = CONFIG.odul;
const car = CONFIG.cars[0];

function setup() {
  const g = new Game(1);
  g.start(car, { seed: 21, startTime: 60, god: true });
  g.runTime = 20;
  const events = [];
  g.onEvent = (n, v) => { if (n === 'escape') events.push(v); };
  return { g, events };
}

// Oyuncu +x yönünde hızla geçer; araç yolun kenarında lateral kadar yanda durur. onStep: her adımda ek olay
function pass(g, o, { lateral = 45, speed = 300, seconds = 1.6, check, onStep } = {}) {
  const p = g.player;
  o.x = p.x + 200; o.y = p.y + lateral;
  let got = 0;
  for (let t = 0; t < seconds; t += dt) {
    p.x += speed * dt;
    p.vx = speed; p.vy = 0; p.speed = speed; p.forward = speed;
    g.runTime += dt;
    if (onStep) onStep(t);
    got += check(o, Math.hypot(o.x - p.x, o.y - p.y)) || 0;
  }
  return got;
}
const cop = (g) => { const c = g.spawnCop('car', 'chaser', 0, 0, 0); c.state = 'chase'; c.vx = 0; c.vy = 0; return c; };
// Trafik aracı: gerçek havuzdan, duran değil ters yönde giden
function npc(g) {
  const n = g.crowd.npcs[0];
  Object.assign(n, { alive: true, state: 'drive', sinkT: 0, len: 44, wid: 22, vx: -120, vy: 0, escIn: false, escAt: -99, passN: 0 });
  return n;
}
const npcCheck = (g) => () => { const before = g.coins; g.checkTraffic(); return g.coins - before; };

test('dojlama sırasında duvara, bariyere ya da nesneye değmek ödülü bozar', () => {
  const { g, events } = setup();
  const got = pass(g, cop(g), { check: (c, d) => g.checkEscape(c, d), onStep: (t) => { if (t > 0.6 && t < 0.62) g.bumpT = g.runTime; } });
  assert.equal(got, 0);
  assert.equal(events.length, 0);
  // Aynı geçiş temas olmadan ödül verir
  const b = setup();
  assert.ok(pass(b.g, cop(b.g), { check: (c, d) => b.g.checkEscape(c, d) }) > 0);
});

test('gerçek duvar teması bumpT yazar: collideWorld oyuncu için', () => {
  const { g } = setup();
  let rect;
  for (let cx = 1; !rect; cx++) {
    const k = g.world.chunk(cx, 1);
    for (let i = 0; i < k.rectCount; i++) if (k.rects[i].kind === 'building') { rect = k.rects[i]; break; }
  }
  const p = g.player;
  p.x = rect.x - 5; p.y = rect.y + rect.h / 2; p.a = 0; p.vx = 300; p.vy = 0;
  g.bumpT = -99;
  g.collideWorld(p, true);
  assert.equal(g.bumpT, g.runTime);
});

test('duvara çarpmak, nesne kırmak, süre ve drift para da puan da vermez', () => {
  const g = new Game(1);
  g.start(car, { seed: 7, startTime: 60, god: true });
  const p = g.player;
  // Nesne kırma
  const c = g.world.chunk(Math.floor(p.x / CHUNK), Math.floor(p.y / CHUNK));
  for (let k = 0; k < 6; k++) g.world.addProp(c, 2, p.x, p.y + 30 + k * 3);
  p.vy = 320; p.speed = 320;
  const quiet = () => { g.cops.length = 0; for (const n of g.crowd.npcs) n.alive = false; for (const h of g.crowd.hw) h.alive = false; };
  for (let i = 0; i < 240; i++) { quiet(); g.tick(dt, i % 60 < 30 ? 1 : -1, false); if (g.state !== 'play') break; }
  assert.ok(g.broken > 0 || g.driftTime >= 0);
  assert.equal(g.score, 0, 'puan yok');
  assert.equal(g.coins, 0, 'para yok');
  g.state = 'dying'; g.finish();
  assert.equal(g.result.coins, 0, 'koşu sonu da para yok');
});

test('makas: trafikteki aracın yanından değmeden çok yakın geçmek para ve puan verir', () => {
  const { g, events } = setup();
  const s = g.score;
  const got = pass(g, npc(g), { lateral: 40, check: npcCheck(g) });
  assert.ok(got >= OD.makasPara[0] && got <= OD.makasPara[1], `para ${got}`);
  assert.ok(g.score >= s + OD.makasPuan, 'puan');
  assert.equal(events.length, 1);
  assert.equal(events[0].kind, 'makas');
  assert.equal(g.passes, 1);
});

test('makas: uzaktan geçmek, çarpmak ya da duran araç ödül vermez', () => {
  let r = setup();
  assert.equal(pass(r.g, npc(r.g), { lateral: 120, check: npcCheck(r.g) }), 0, 'uzak');
  r = setup();
  assert.equal(pass(r.g, npc(r.g), { lateral: 40, check: npcCheck(r.g), onStep: (t) => { if (t > 0.6 && t < 0.62) r.g.bumpT = r.g.runTime; } }), 0, 'temas');
  r = setup();
  const n = npc(r.g); n.vx = 0;
  r.g.player.vx = 0;
  // Bağıl hız yalnız oyuncunun hızı: eşik oyuncu hızının üstündeyse ödül yok
  const keep = OD.makasBagilHiz; OD.makasBagilHiz = 400;
  try { assert.equal(pass(r.g, n, { lateral: 40, check: npcCheck(r.g) }), 0, 'bağıl hız düşük'); } finally { OD.makasBagilHiz = keep; }
});

test('makas: aynı araçtan bekleme süresinde ikinci ödül yok, araç başı sınır var (yerinde dönerek kasılmaz)', () => {
  const { g, events } = setup();
  const n = npc(g);
  pass(g, n, { lateral: 40, check: npcCheck(g) });
  assert.equal(events.length, 1);
  pass(g, n, { lateral: 40, check: npcCheck(g) }); // Bekleme dolmadı
  assert.equal(events.length, 1, 'bekleme');
  for (let k = 0; k < 6; k++) { g.runTime += OD.makasBekleme; pass(g, n, { lateral: 40, check: npcCheck(g) }); }
  assert.equal(events.length, OD.makasAracBasi, 'araç başı sınır');
  // Yeni doğan araç yeniden ödül verebilir
  g.crowd.spawnNpc();
  const fresh = npc(g);
  g.runTime += OD.makasBekleme;
  pass(g, fresh, { lateral: 40, check: npcCheck(g) });
  assert.equal(events.length, OD.makasAracBasi + 1);
});

test('polis: aynı polisten bekleme süresinde ikinci ödül yok', () => {
  const { g, events } = setup();
  const c = cop(g);
  const check = (o, d) => g.checkEscape(o, d);
  pass(g, c, { check });
  pass(g, c, { check, seconds: 1.2 });
  assert.equal(events.length, 1);
  g.runTime += OD.polisBekleme;
  pass(g, c, { check });
  assert.equal(events.length, 2);
});

test('direksiyon/joystick: sabitler dosyanın başında, yumuşatma, hızda kısma, dönüş çarpanı', () => {
  for (const k of ['DONUS_HIZI', 'HIZDA_ACI_AZALMA', 'AZALMA_BASLANGICI', 'GIRDI_YUMUSATMA', 'BIRAKINCA_YUMUSATMA', 'GIRDI_EGRISI']) assert.equal(typeof IN[k], 'number', k);
  assert.ok(IN.DONUS_HIZI < 1 && IN.DONUS_HIZI > 0.4);
  const make = (mode) => { const i = new IN.Input(); i.setMode(mode); i.width = 400; i.bounds = { l: 0, t: 0, r: 400, b: 800 }; return i; };
  // Joystick tam sağ: araca giden değer ham değerden yavaş yükselir
  const a = make('stick');
  a.down(1, 100, 400); a.move(1, 100 + IN.STICK_R, 400);
  for (let n = 0; n < 6; n++) a.tick(dt);
  assert.ok(a.steer < a.axis * 0.8, `yumuşatma ${a.steer} / ${a.axis}`);
  for (let n = 0; n < 120; n++) a.tick(dt);
  assert.ok(a.steer > 0.97, 'durgun hızda tam kilit');
  // Tepe hızda açı kısılır, ama viraj freni eşiğinin üstünde kalır
  a.speedK = 1;
  for (let n = 0; n < 120; n++) a.tick(dt);
  assert.ok(Math.abs(a.steer - (1 - IN.HIZDA_ACI_AZALMA)) < 0.01, `tepe hız ${a.steer}`);
  assert.ok(a.steer > CONFIG.physics.cornerSteer, 'tam kırınca viraj freni çalışır');
  // Küçük hareket eğriyle daha az döndürür
  const b = make('stick');
  b.down(1, 100, 400); b.move(1, 100 + CONFIG.input.stick.dead + (IN.STICK_R - CONFIG.input.stick.dead) / 2, 400);
  for (let n = 0; n < 200; n++) b.tick(dt);
  assert.ok(b.steer < b.axis - 0.1, `eğri ${b.steer} < ${b.axis}`);
  // Dönüş çarpanı: yalnız direksiyon ve joystick
  assert.equal(make('zones').yawMul, 1);
  assert.equal(make('wheel').yawMul, IN.DONUS_HIZI);
  assert.equal(make('stick').yawMul, IN.DONUS_HIZI);
});

test('dönüş çarpanı fizikte yalnız oyuncuyu etkiler: aynı girdide daha geniş dönüş', async () => {
  const { stepCar, makeBody, resetBody } = await import('../js/physics.js');
  const surf = CONFIG.surfaces[1];
  const turn = (mul) => {
    const b = makeBody(); resetBody(b, 0, 0, 0, car); b.vx = 300; b.yawMul = mul;
    for (let i = 0; i < 30; i++) stepCar(b, 1, 1, car, surf, dt);
    return b.a;
  };
  assert.ok(turn(IN.DONUS_HIZI) < turn(1) * 0.95, `${turn(IN.DONUS_HIZI)} < ${turn(1)}`);
  assert.equal(turn(undefined), turn(1), 'diğer araçlar eskisi gibi');
});

test('gizli bina yalnız arkadaş sürümünde: Play deposu ve paketinde yok; yer, tetik ve şehir aynı', async () => {
  assert.equal(SECRET_LOOK, null, 'Play (depo) sürümünde görünüş yok');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'v24-'));
  const ark = path.join(tmp, 'ark'); const play = path.join(tmp, 'play');
  await buildWeb('arkadas', ark);
  await buildWeb('play', play);
  // Play paketinde tabela yazısı ve isim yok
  const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]));
  for (const f of walk(play)) {
    if (!/\.(js|html|css|json|txt)$/.test(f)) continue;
    const t = fs.readFileSync(f, 'utf8');
    assert.ok(!/YILDIZ/.test(t), `${f}: tabela yazısı`);
    assert.ok(!/Ömer|ömer|ÖMER/.test(t), `${f}: isim`);
  }
  assert.match(fs.readFileSync(path.join(play, 'js', 'secret-look.js'), 'utf8'), /SECRET_LOOK\s*=\s*null/);
  // Arkadaş paketinde bina var; tabela yalnız "YILDIZ", isim yok
  const look = fs.readFileSync(path.join(ark, 'js', 'secret-look.js'), 'utf8');
  assert.match(look, /'YILDIZ'/);
  assert.ok(!/Ömer|ömer/.test(look), 'tabelada isim yok');
  const A = await import(pathToFileURL(path.join(ark, 'js', 'world.js')).href);
  const P = await import(pathToFileURL(path.join(play, 'js', 'world.js')).href);
  const wa = new A.World(5); const wp = new P.World(5);
  const za = wa.zone('secret'); const zp = wp.zone('secret');
  assert.deepEqual([za.x, za.y, za.w, za.h], [zp.x, zp.y, zp.w, zp.h], 'tetik alanı aynı yerde');
  const ca = wa.chunk(Math.floor(za.x / CHUNK), Math.floor(za.y / CHUNK));
  const cp = wp.chunk(Math.floor(zp.x / CHUNK), Math.floor(zp.y / CHUNK));
  const bina = ca.rects.slice(0, ca.rectCount).filter((r) => r.secretLook);
  assert.equal(bina.length, 1, 'arkadaşta bina');
  assert.equal(cp.rects.slice(0, cp.rectCount).filter((r) => r.secretLook).length, 0, 'Play\'de bina yok');
  assert.equal(ca.rectCount, cp.rectCount + 1, 'tek fark bina');
  const b = bina[0];
  // Bina rampanın hemen kuzeyinde: güney yüzü rampaya dayanır, rampayı örtmez (giriş açık)
  assert.equal(b.y + b.h, za.y, 'giriş rampada');
  assert.ok(b.x <= za.x + za.w / 2 && b.x + b.w >= za.x + za.w / 2, 'kapı rampanın üstünde');
  assert.ok(!(za.x < b.x + b.w && za.x + za.w > b.x && za.y < b.y + b.h && za.y + za.h > b.y), 'rampa açık');
  // Gizli geçitten dönüş noktası binanın dışında
  const ex = za.x - 70; const ey = za.y - 70;
  assert.ok(!(ex > b.x - 30 && ex < b.x + b.w + 30 && ey > b.y - 30 && ey < b.y + b.h + 30), 'dönüş noktası açık');
  // Komşu chunk'lar birebir aynı üretilir (zar durumu korunur)
  const sig = (c) => JSON.stringify([c.rects.slice(0, c.rectCount).filter((r) => !r.secretLook).map((r) => [r.x, r.y, r.w, r.h, r.style, r.seed]), [...c.ground]]);
  assert.equal(sig(ca), sig(cp), 'geçit chunk\'ının geri kalanı aynı');
  for (const [dx, dy] of [[1, 0], [0, 1], [-1, 0], [5, 5]]) {
    const cx = Math.floor(za.x / CHUNK) + dx; const cy = Math.floor(za.y / CHUNK) + dy;
    assert.equal(sig(wa.chunk(cx, cy)), sig(wp.chunk(cx, cy)), `chunk ${dx},${dy}`);
  }
  assert.ok(TILE > 0);
  fs.rmSync(tmp, { recursive: true, force: true });
});
