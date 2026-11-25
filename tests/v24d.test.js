// v24.2: para kodları (Dante, Berserk, Guts), Berserk süresi, ayrı ses düzeyleri, 6 kademeli mağaza silahı
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG } from '../js/config.js';
import { Game } from '../js/game.js';
import { Storage, SOUND_GROUPS, sanitize } from '../js/storage.js';
import { AudioEngine, SOUND_GROUP_OF } from '../js/audio.js';
import { gunStats, gunSpec, bulletsToKill, enemyHits, gunBaseHp } from '../js/gun.js';

const dt = 1 / 60;
function mem() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}
function setup(car = CONFIG.cars[0], gun = '', startTime = 0) {
  const g = new Game(1);
  g.view.w = 1280; g.view.h = 720;
  g.start(car, { seed: 21, startTime, god: true, gun });
  g.runTime = 20;
  g.player.vx = 0; g.player.vy = 0; g.player.speed = 0;
  g.updateCamera(1);
  g.cam.x = g.player.x; g.cam.y = g.player.y;
  return g;
}
const target = (g, type, dx, dy) => { const c = g.spawnCop(type, 'chaser', g.player.x + dx, g.player.y + dy, 0); c.vx = 0; c.vy = 0; return c; };

// ---------- KODLAR ----------
test('kodlar: Dante 3000, Guts 10000 para; büyük/küçük harf ve baş/son boşluk fark etmez', () => {
  for (const [a, b] of [['Dante', 'guts'], ['  dAnTe ', ' GUTS'], ['DANTE', 'Guts  ']]) {
    const s = new Storage(mem());
    s.data.coins = 50;
    assert.equal(s.redeem(a), 'coins', a);
    assert.equal(s.data.coins, 3050);
    assert.equal(s.redeem(b), 'coins', b);
    assert.equal(s.data.coins, 13050);
  }
});

test('her kod bir kayıtta bir kez: ikinci girişte "used", para artmaz; yeniden açılışta da kullanılmış sayılır', () => {
  const b = mem();
  const s = new Storage(b);
  assert.equal(s.redeem('dante'), 'coins');
  assert.equal(s.redeem('DANTE'), 'used');
  assert.equal(s.redeem(' Dante '), 'used');
  assert.equal(s.data.coins, 3000, 'kasılamaz');
  assert.equal(s.redeem('berserk'), 'berserk');
  assert.equal(s.redeem('Berserk'), 'used');
  assert.equal(s.data.berserk, 3600, 'süre ikinci girişte uzamaz');
  const again = new Storage(b);
  assert.equal(again.redeem('Dante'), 'used');
  assert.equal(again.redeem('guts'), 'coins');
  assert.equal(again.redeem('GUTS'), 'used');
  assert.equal(again.data.coins, 13000);
});

test('yanlış kod "invalid"; eski araba kodu çalışmaya devam eder', () => {
  const s = new Storage(mem());
  for (const bad of ['dant', 'gutss', 'berserker', 'xyz', '']) assert.equal(s.redeem(bad), 'invalid', bad);
  assert.equal(s.data.coins, 0);
  assert.equal(s.redeem('4266'), 'ok');
  assert.equal(s.redeem('4266'), 'owned');
});

test('kod mesajları altı dilde: kullanılmış ve geçersiz kod', async () => {
  const { setLang, tx } = await import('../js/i18n/index.js');
  const want = { tr: ['Bu kod zaten kullanıldı.', 'Geçersiz kod.'], en: ['This code has already been used.', 'Invalid code.'] };
  for (const l of ['tr', 'en', 'ja', 'zh', 'es', 'de']) {
    setLang(l);
    for (const k of ['used', 'invalid', 'coins', 'berserk']) assert.ok(tx(`code.${k}`) !== `code.${k}`, `${l} ${k}`);
    if (want[l]) assert.deepEqual([tx('code.used'), tx('code.invalid')], want[l]);
  }
  setLang('tr');
});

// ---------- BERSERK ----------
test('Berserk: para kazancı 2 kat (kıl payı ve makas), süre bitince 1 kat', () => {
  const g = setup();
  const c = g.spawnCop('car', 'chaser', 5000, 5000, 0);
  const n = { escAt: -99, passN: 0 };
  g.berserkT = 0;
  const realRandom = Math.random;
  Math.random = () => 0; // En düşük ödül: polis 5, makas 2
  try {
    let before = g.coins; g.rewardEscape(c); const normal = g.coins - before;
    before = g.coins; g.rewardPass(n); const normalPass = g.coins - before;
    g.berserkT = 100;
    c.escAt = -99; g.escLastT = -99;
    before = g.coins; g.rewardEscape(c); const boosted = g.coins - before;
    n.passN = 0;
    before = g.coins; g.rewardPass(n); const boostedPass = g.coins - before;
    assert.equal(normal, CONFIG.odul.polisPara[0]);
    assert.equal(boosted, normal * 2, 'polis 2 kat');
    assert.equal(normalPass, CONFIG.odul.makasPara[0]);
    assert.equal(boostedPass, normalPass * 2, 'makas 2 kat');
    g.berserkT = 0;
    assert.equal(g.coinMul(), 1);
  } finally { Math.random = realRandom; }
});

test('Berserk süresi yalnız oyun oynanırken azalır; duraklatma (tick yok) ve menüde durur; sıfırda biter', () => {
  const g = setup();
  g.berserkT = 10;
  for (let i = 0; i < 60; i++) g.tick(dt, 0, false); // 1 sn oyun
  assert.ok(Math.abs(g.berserkT - 9) < 0.02, `1 sn düştü: ${g.berserkT}`);
  // Duraklatmada ana döngü tick çağırmaz: süre aynı kalır. Menüde (attract) tick oyunu ilerletmez
  const keep = g.berserkT;
  g.startAttract();
  g.berserkT = keep;
  for (let i = 0; i < 120; i++) g.tick(dt, 0, false);
  assert.equal(g.berserkT, keep, 'menüde akmaz');
  const h = setup();
  h.berserkT = 0.5;
  for (let i = 0; i < 60; i++) h.tick(dt, 0, false);
  assert.equal(h.berserkT, 0);
  assert.equal(h.coinMul(), 1, 'süre bitince çarpan kalkar');
});

test('Berserk kalan süresi kayda yazılır, yeniden açılışta kaldığı yerden sürer; bozuk değer temizlenir', () => {
  const b = mem();
  const s = new Storage(b);
  s.redeem('Berserk');
  s.setBerserk(1234.5);
  const again = new Storage(b);
  assert.equal(again.data.berserk, 1234.5);
  assert.equal(sanitize({ berserk: -5 }).berserk, 0);
  assert.equal(sanitize({ berserk: 1e9 }).berserk, CONFIG.berserk.seconds);
  assert.equal(sanitize({ berserk: 'x' }).berserk, 0);
});

// ---------- SES ----------
test('ayrı ses düzeyleri: varsayılan 100, 0-100 aralığında kaydedilir ve yüklenir', () => {
  assert.deepEqual(SOUND_GROUPS, ['music', 'sfx', 'engine', 'police', 'traffic', 'gun']);
  const b = mem();
  const s = new Storage(b);
  for (const k of SOUND_GROUPS) assert.equal(s.data.settings.vols[k], 100);
  s.data.settings.vols.police = 25; s.data.settings.vols.gun = 0; s.save();
  const again = new Storage(b);
  assert.equal(again.data.settings.vols.police, 25);
  assert.equal(again.data.settings.vols.gun, 0);
  const d = sanitize({ settings: { vols: { music: 140, sfx: -3, engine: 'a', traffic: 55.4 } } });
  assert.deepEqual(d.settings.vols, { music: 100, sfx: 0, engine: 100, police: 100, traffic: 55, gun: 100 });
});

// Sahte Web Audio: her düğüm nereye bağlandığını tutar
function fakeAudio() {
  const nodes = [];
  const param = () => ({ value: 0, setValueAtTime() {}, setTargetAtTime(v) { this.value = v; }, exponentialRampToValueAtTime() {}, linearRampToValueAtTime() {} });
  const node = (kind) => {
    const n = { kind, out: [], gain: param(), frequency: param(), Q: param(), playbackRate: param(), threshold: param(), knee: param(), ratio: param(), attack: param(), release: param(), connect(t) { this.out.push(t); return t; }, start() {}, stop() {}, setPeriodicWave() {} };
    nodes.push(n);
    return n;
  };
  class Ctx {
    constructor() { this.currentTime = 0; this.sampleRate = 8000; this.state = 'running'; this.destination = node('dest'); }
    createGain() { return node('gain'); } createOscillator() { return node('osc'); } createBiquadFilter() { return node('filter'); }
    createDynamicsCompressor() { return node('comp'); } createWaveShaper() { return node('shaper'); } createBufferSource() { return node('src'); }
    createBuffer(c, len) { return { getChannelData: () => new Float32Array(len) }; } createPeriodicWave() { return {}; }
    resume() {} suspend() {}
  }
  return { Ctx, nodes };
}

test('her ses doğru gruba bağlı: silah, polis, trafik, motor, müzik, efekt; grup kısılınca o grup susar', () => {
  const { Ctx, nodes } = fakeAudio();
  const prev = globalThis.AudioContext;
  globalThis.AudioContext = Ctx;
  try {
    const a = new AudioEngine();
    a.unlock();
    const busOf = (n) => Object.entries(a.buses).find(([, b]) => n.out.includes(b))?.[0];
    const played = (fn) => { a.shots = 0; const from = nodes.length; fn(); return [...new Set(nodes.slice(from).map(busOf).filter(Boolean))]; };
    assert.deepEqual(played(() => a.gunShot()), ['gun']);
    assert.deepEqual(played(() => a.horn('taxi')), ['traffic']);
    assert.deepEqual(played(() => a.radio()), ['police']);
    assert.deepEqual(played(() => a.tankFire()), ['police']);
    assert.deepEqual(played(() => a.purchase()), ['music']);
    assert.deepEqual(played(() => a.crash(0.8)), ['sfx']);
    assert.deepEqual(played(() => a.coin()), ['sfx']);
    assert.deepEqual(played(() => a.landing()), ['engine']);
    // Sürekli sesler
    assert.equal(busOf(a.engGain), 'engine');
    assert.equal(busOf(a.driftGain), 'engine');
    for (const v of Object.values(a.voices)) assert.equal(busOf(v.gain), 'police', 'siren');
    assert.equal(busOf(a.ambGain), 'sfx');
    for (const k of SOUND_GROUPS) assert.ok(a.buses[k].out.includes(a.master), `${k} ana sesten geçer`);
    a.setGroupVolume('police', 0.3);
    assert.equal(a.buses.police.gain.value, 0.3);
    a.setGroupVolume('gun', 0);
    assert.equal(a.buses.gun.gain.value, 0);
    assert.equal(a.vols.gun, 0);
    assert.ok(Object.values(SOUND_GROUP_OF).every((g) => SOUND_GROUPS.includes(g)));
  } finally { globalThis.AudioContext = prev; }
});

// ---------- SİLAHLAR ----------
const EXPECT_NORMAL = { g1: [100, 15], g2: [75, 10], g3: [50, 7], g4: [25, 4], g5: [20, 2], g6: [10, 2] };

test('silah tablosu: 6 kademe, her biri öncekinden hızlı, güçlü ve çok daha pahalı', () => {
  assert.equal(CONFIG.guns.length, 6);
  for (let i = 0; i < 6; i++) {
    const g = CONFIG.guns[i];
    const [every, hits] = EXPECT_NORMAL[g.id];
    assert.equal(g.every, every, g.id);
    assert.equal(bulletsToKill('car', 0, gunStats(g)), hits, `${g.id} normal polis`);
    if (i) {
      const p = CONFIG.guns[i - 1];
      assert.ok(g.every < p.every && g.hits < p.hits, `${g.id} daha hızlı ve güçlü`);
      assert.ok(g.price >= p.price * 1.7, `${g.id} çok daha pahalı`);
    }
  }
  assert.ok(Math.abs(gunStats(gunSpec('g6')).damage - CONFIG.weapon.copHp / 1.5) < 1e-9, 'Silah 6 hasarı polis canının 1/1,5i');
  const maxCar = Math.max(...CONFIG.cars.map((c) => c.cost));
  assert.ok(CONFIG.guns[5].price > maxCar, 'Silah 6 oyundaki en pahalı şey');
});

test('düşman canı = normal polis canı x vuruş / 15; kademeler 15, 20, 25 ... 45', () => {
  assert.deepEqual(CONFIG.weapon.enemyHits, { car: 15, fast: 15, moto: 15, swat: 20, advanced: 25, dart: 30, blob: 35, crab: 40, tank: 45 });
  for (const [t, h] of Object.entries(CONFIG.weapon.enemyHits)) assert.equal(gunBaseHp(t), (CONFIG.weapon.copHp * h) / 15, t);
  assert.equal(enemyHits('yeniTur'), 50, 'tabloda olmayan tür bir sonraki kademe (+5)');
  // Kullanıcı örnekleri: Silah 5 40 vuruşluk düşmanı 5-6, Silah 6 yaklaşık 4 vuruşta
  const g5 = bulletsToKill('crab', 0, gunStats(gunSpec('g5')));
  const g6 = bulletsToKill('crab', 0, gunStats(gunSpec('g6')));
  assert.ok(g5 >= 5 && g5 <= 6, `Silah 5: ${g5}`);
  assert.equal(g6, 4);
});

// Gerçek ateşle: hedef ölene kadar isabet sayısı
function realHits(gun, type) {
  const g = setup(CONFIG.cars[0], gun);
  const c = target(g, type, 320, 0);
  for (let t = 0; t < 120 && c.mhp > 0; t += dt) { g.cam.x = g.player.x; g.cam.y = g.player.y; g.gun.update(g, dt); }
  assert.ok(c.mhp <= 0, `${gun} ${type} öldü`);
  return g.gun.hits;
}

test('gerçek atışla her silahın her düşman türüne vuruş sayısı tablo ile aynı', () => {
  const types = ['car', 'fast', 'moto', 'swat', 'advanced', 'dart', 'blob', 'crab', 'tank'];
  const table = {};
  for (const gs of CONFIG.guns) {
    table[gs.id] = {};
    for (const t of types) {
      const n = realHits(gs.id, t);
      table[gs.id][t] = n;
      assert.equal(n, Math.ceil((enemyHits(t) * gs.hits) / 15 - 1e-6), `${gs.id} ${t}`);
    }
  }
  console.log('# vuruş tablosu', JSON.stringify(table));
});

test('gerçek ateş aralığı: 1,00 / 0,75 / 0,50 / 0,25 / 0,20 / 0,10 sn', () => {
  for (const gs of CONFIG.guns) {
    const g = setup(CONFIG.cars[0], gs.id);
    const c = target(g, 'tank', 300, 120);
    const at = [];
    for (let k = 0; k < 60 * 12; k++) {
      c.mhp = c.mhpMax; c.hp = c.maxHp;
      const before = g.gun.shots;
      g.cam.x = g.player.x; g.cam.y = g.player.y;
      g.gun.update(g, dt);
      if (g.gun.shots > before) at.push(k * dt);
    }
    const every = (at.at(-1) - at[0]) / (at.length - 1);
    assert.ok(Math.abs(every - gs.every / 100) < 0.01, `${gs.id}: ${every.toFixed(3)} sn`);
  }
});

test('silah satın alma: para yetmezse "poor", alınınca takılır ve para düşer; ikinci kez alınmaz; kayıtta kalır', () => {
  const b = mem();
  const s = new Storage(b);
  s.data.coins = 1000;
  assert.equal(s.buyGun('g1'), 'poor');
  assert.equal(s.data.coins, 1000);
  s.data.coins = 10000;
  assert.equal(s.buyGun('g1'), 'ok');
  assert.equal(s.data.coins, 10000 - CONFIG.guns[0].price);
  assert.equal(s.data.gun, 'g1');
  assert.equal(s.buyGun('g1'), 'owned');
  assert.equal(s.buyGun('yok'), 'invalid');
  const again = new Storage(b);
  assert.deepEqual(again.data.guns, ['g1']);
  assert.equal(again.data.gun, 'g1');
});

test('takma / çıkarma: alınmamış silah takılmaz; çıkarınca silah yok; bozuk kayıt temizlenir', () => {
  const s = new Storage(mem());
  assert.equal(s.equipGun('g3'), false);
  s.data.coins = 1e6;
  s.buyGun('g1'); s.buyGun('g4');
  assert.equal(s.data.gun, 'g4');
  assert.equal(s.equipGun('g1'), true);
  assert.equal(s.data.gun, 'g1');
  assert.equal(s.equipGun(''), true);
  assert.equal(s.data.gun, '');
  const d = sanitize({ guns: ['g2', 'hile', 'g2'], gun: 'g5' });
  assert.deepEqual(d.guns, ['g2']);
  assert.equal(d.gun, '', 'alınmamış silah takılı sayılmaz');
});

test('takılı silah her arabada çalışır, dahili silahın yerini alır; silahsız arabada takılı silah yoksa silah yok', () => {
  assert.equal(setup(CONFIG.cars[0]).weapon, null);
  const g = setup(CONFIG.cars[0], 'g2');
  assert.ok(g.weapon);
  assert.equal(g.gun.stats.id, 'g2');
  const k = setup(CONFIG.cars.find((c) => c.weapon), 'g6');
  assert.equal(k.gun.stats.id, 'g6', 'kuzgun takılı silahı kullanır');
  const kb = setup(CONFIG.cars.find((c) => c.weapon));
  assert.equal(kb.gun.stats.id, 'builtin', 'takılı yoksa dahili');
  // Ekrandaki düşmana ateş eder ve hasar verir
  const c = target(g, 'car', 260, 0);
  for (let t = 0; t < 2; t += dt) { g.cam.x = g.player.x; g.cam.y = g.player.y; g.gun.update(g, dt); }
  assert.ok(c.mhp < c.mhpMax);
});
