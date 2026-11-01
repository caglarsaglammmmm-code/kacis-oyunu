// Üretilmiş dosya, elle düzenlemeyin. Kaynak: js/*.js (npm run bundle)
(function () {
'use strict';
// --- config.js ---
// Oyunun TÜM ayarları burada. Denge değiştirmek için yalnızca bu dosyayı düzenleyin,
// ardından `npm run bundle` çalıştırın (file:// kopyası için).

const GROUND = { GRASS: 0, ROAD: 1, WALK: 2, PLAZA: 3, WATER: 4, SAND: 5, DIRT: 6, SHALLOW: 7, FIELD: 8 };

// Bina stilleri. 0-6 şehir çatıları, sonrası js/art.js içinde özel çizilir
const BUILD = {
  TOWER_GLASS: 7, TOWER_ROUND: 8, TOWER_STEP: 9, HUT: 10, LIFEGUARD: 11, LIGHTHOUSE: 12, CABIN: 13,
  FIRETOWER: 14, ADOBE: 15, MESA: 16, BARN: 17, SILO: 18, WINDMILL: 19, WATERTOWER: 20, GAS: 21,
};

const CONFIG = {
  version: '2.0.0',
  apkUrl: 'https://github.com/caglarsaglammmmm-code/kacis-oyunu/releases/latest/download/KacKacabilirsen.apk',

  // Geliştirici kısayolları. Adres çubuğundan da verilebilir: ?t=280&god=1
  dev: {
    startTime: 0, // Oyun bu saniyeden başlar (ör. 280 = tanklar)
    godMode: false, // Ölümsüzlük. Ayarlarda sürüm yazısına 7 kez dokununca da açılır
  },

  world: {
    tile: 40,
    chunkTiles: 24,
    arterial: 5, // Her chunk'ın batı ve kuzeyindeki ana yolun karo genişliği
    loadRadius: 3, // Oyuncu çevresinde kaç chunk yüklü kalır
    unloadRadius: 4, // Bu uzaklığın ötesindeki chunk'lar silinir
    biomeCell: 11, // Bir biyom bölgesinin chunk cinsinden boyutu (rastgele sınırlı)
    biomes: { city: 34, beach: 20, forest: 16, desert: 15, rural: 15 },
    seaRadius: 0.42, // Sahil bölgesinin ortasındaki denizin biyom hücresine oranı
    templates: { city: 30, downtown: 18, suburb: 16, park: 12, lake: 7, industrial: 11, plaza: 6 },
  },

  camera: {
    viewArea: 740, // Ekran alanının karekökü bu kadar dünya birimine denk gelir
    lookAhead: 0.46, // Hızın önüne kaç saniyelik bakılır
    follow: 4.5,
    zoomOut: 0.2, // Son hızda ne kadar uzaklaşılır
    zoomRate: 1.8,
    shakeDecay: 6,
  },

  physics: {
    driftMinSpeed: 110, // Bunun altında arka lastikler kaymaz
    driftLateral: 52, // Drift sayılması için yanal hız
    steerResponse: 12, // Parmak girdisinin direksiyona geçiş hızı
    gripLoseRate: 9, // Direksiyon kırınca yol tutuşun düşme hızı
    gripRecoverRate: 1.5, // Bırakınca yol tutuşun dönme hızı (toparlanma kayması)
    yawResponse: 5.4, // Düşük = ağır araç, burun geç döner
    alignTorque: 4.2, // Bırakınca burnu gidiş yönüne çeken tork
    maxLateralDecel: 1500, // Lastiklerin üretebileceği en büyük yanal ivme
    scrub: 0.11, // Yan kaymanın hızdan yediği pay
    rollingDrag: 0.12,
    reverseSpeed: 200,
    reverseAccel: 460,
    brakeDecel: 950,
    wallBounce: 0.3,
    wallFriction: 0.05,
  },

  // Zemin etkileri, GROUND sırasına göre: grip ve speed çarpan, drag ek sürtünme
  surfaces: [
    { grip: 0.7, speed: 0.86, drag: 0.35, name: 'grass' },
    { grip: 1, speed: 1, drag: 0, name: 'road' },
    { grip: 0.95, speed: 0.97, drag: 0.05, name: 'walk' },
    { grip: 1, speed: 1, drag: 0, name: 'plaza' },
    { grip: 0.6, speed: 0.6, drag: 0.8, name: 'water' },
    { grip: 0.55, speed: 0.8, drag: 0.5, name: 'sand' },
    { grip: 0.75, speed: 0.92, drag: 0.15, name: 'dirt' },
    { grip: 0.6, speed: 0.66, drag: 0.55, name: 'shallow' },
    { grip: 0.72, speed: 0.9, drag: 0.22, name: 'field' },
  ],

  // En az 5 araba. durability hasarı böler, mass polis çarpışmalarını etkiler.
  cars: [
    { id: 'serce', name: 'Serçe', cost: 0, desc: 'Dengeli başlangıç arabası', maxSpeed: 432, accel: 520, turnRate: 3.2, grip: 4.5, driftGrip: 1.15, durability: 1, mass: 1, len: 48, wid: 24, color: '#e8112d', accent: '#ffe14d' },
    { id: 'pars', name: 'Pars', cost: 150, desc: 'Hızlı ama kırılgan', maxSpeed: 482, accel: 570, turnRate: 3, grip: 4.4, driftGrip: 1.2, durability: 0.8, mass: 0.9, len: 50, wid: 24, color: '#ff8a00', accent: '#1d1d24' },
    { id: 'tosun', name: 'Tosun', cost: 300, desc: 'Ağır gran turismo, darbeye dayanıklı', maxSpeed: 408, accel: 450, turnRate: 2.8, grip: 5.2, driftGrip: 1.6, durability: 1.6, mass: 1.7, len: 54, wid: 27, color: '#0fa958', accent: '#eaf7d0' },
    { id: 'kelebek', name: 'Kelebek', cost: 350, desc: 'Drift ustası, kuyruk bırakır', maxSpeed: 444, accel: 530, turnRate: 3.65, grip: 3.7, driftGrip: 0.72, durability: 0.95, mass: 0.95, len: 47, wid: 24, color: '#e81fa8', accent: '#7af6ff' },
    { id: 'yildirim', name: 'Yıldırım', cost: 800, desc: 'En yüksek son hız', maxSpeed: 530, accel: 630, turnRate: 3.15, grip: 4.7, driftGrip: 1.05, durability: 0.85, mass: 0.95, len: 50, wid: 24, color: '#0aa5e8', accent: '#ffffff' },
    { id: 'kaplan', name: 'Kaplan', cost: 1500, desc: 'Her işi iyi yapan efsane', maxSpeed: 498, accel: 630, turnRate: 3.5, grip: 4.9, driftGrip: 0.92, durability: 1.35, mass: 1.35, len: 52, wid: 26, color: '#f5b800', accent: '#111111' },
  ],

  damage: {
    minImpact: 90, // Bunun altındaki darbeler hasar vermez
    perSpeed: 0.072, // Hız birimi başına hasar: 430 hızla kafa kafaya ~24
    maxSingleHit: 34, // Tek darbe en fazla bu kadar: anlık ölüm yok
    earlyGraceUntil: 30, // Bu saniyeye kadar hasar azaltılır
    earlyGraceMul: 0.48,
    hitCooldown: 0.28, // Aynı temasın üst üste saymaması için
    copScale: 0.5, // Polis darbesi duvara göre kaç kat işler (kafa kafaya da öldürmesin)
    maxCopHit: 15, // Normal polisin tek darbesi; ram değeriyle çarpılır, maxSingleHit sınırlar
    stages: [30, 55, 80, 100], // hafif duman, yoğun duman+kıvılcım, ateş, patlama
    burnTime: 7, // Ateş aşamasının süresi (yeni darbe sayacı başa alır)
    burnRate: 1.1, // Yanarken saniyede eklenen hasar
    regenRate: 0.55, // Ateş sönünce saniyede geri kazanılan
    regenFloor: 72, // Kurtarma en fazla buraya kadar: yani yoğun dumanda kalırsın
    idleRegenAfter: 10, // Bu kadar saniye temiz sürüşten sonra çok yavaş toparlanır
    idleRegenRate: 0.35,
    idleRegenFloor: 15, // Tam sağlığa dönmez. regenFloor üstündeyken (ateş görmüşse) hiç iyileşmez
    dyingTime: 1.7, // Patlamadan skor ekranına geçiş
  },

  difficulty: {
    swatAt: 50,
    advancedAt: 200,
    tanksAt: 280,
    alerts: { 50: 'SWAT geliyor!', 200: 'Ağır takviye!', 280: 'TANKLAR!' },
    firstSpawnAt: 5,
    // [saniye, değer] noktaları arasında doğrusal artar, yani her saniye biraz zorlaşır
    policeCurve: [[0, 1], [15, 2], [30, 3], [50, 5], [120, 8], [200, 12], [280, 16], [420, 20]],
    spawnCurve: [[0, 6], [30, 4.5], [50, 3.5], [200, 1.6], [280, 1.1], [420, 0.8]],
    hpCurve: [[0, 1], [50, 1], [200, 1.9], [280, 2.3], [600, 3.5]],
    powerCurve: [[0, 0.65], [30, 0.8], [50, 0.9], [200, 1.25], [280, 1.4], [600, 1.8]],
    aggressionCurve: [[0, 0.3], [50, 0.5], [200, 0.85], [280, 1], [600, 1.2]],
    flankerShare: [[0, 0], [30, 0.1], [50, 0.25], [200, 0.45]],
    maxActive: 22, // Performans için mutlak üst sınır (barikat ve tank dahil)
    swatShare: [[50, 0.15], [200, 0.3], [280, 0.25]],
    motoFrom: 15,
    motoShare: [[15, 0.12], [50, 0.2], [280, 0.18]],
    fastFrom: 25,
    fastShare: [[25, 0.12], [50, 0.2], [200, 0.22]],
    advancedShare: [[200, 0.3], [280, 0.5]],
    tankCount: [[280, 1], [340, 2], [420, 3], [600, 4]],
    tankInterval: 22,
  },

  // speed: oyuncunun son hızına oran. HER ZAMAN 1'in altında kalmalı (test eder).
  police: {
    fast: { hp: 32, mass: 1, speed: 0.93, accel: 540, turnRate: 3.3, grip: 8, driftGrip: 4, len: 46, wid: 22, ram: 0.85, smart: 0.75, siren: 'yelp' },
    moto: { hp: 16, mass: 0.4, speed: 0.96, accel: 580, turnRate: 3.8, grip: 9, driftGrip: 5, len: 30, wid: 12, ram: 0.4, smart: 0.6, siren: 'chirp' },
    car: { hp: 40, mass: 1.15, speed: 0.87, accel: 400, turnRate: 3, grip: 7.5, driftGrip: 3.2, len: 46, wid: 24, ram: 1, smart: 0.5, siren: 'wail' },
    swat: { hp: 130, mass: 3, speed: 0.78, accel: 300, turnRate: 2.1, grip: 8, driftGrip: 4.5, len: 66, wid: 32, ram: 1.7, smart: 0.6, siren: 'hilo' },
    advanced: { hp: 75, mass: 1.5, speed: 0.95, accel: 520, turnRate: 3.4, grip: 9, driftGrip: 4.5, len: 48, wid: 24, ram: 1.25, smart: 1, siren: 'yelp' },
    tank: { hp: 700, mass: 22, speed: 0.4, accel: 160, turnRate: 1.2, grip: 14, driftGrip: 14, len: 104, wid: 66, ram: 2.2, smart: 0.3, siren: '' },
  },

  policeAI: {
    despawnDist: 2300,
    wallDamage: 0.22,
    wallMinImpact: 85,
    ramDamage: 0.34, // Oyuncu polise çarpınca polisin aldığı (hız başına)
    stuckTime: 1.1,
    reverseTime: 0.9,
    pitYaw: 1.5, // Gelişmiş polisin yandan vuruşunun oyuncuyu döndürmesi
    flowInterval: 0.3,
    viewMargin: 140,
    spawnExtra: 620,
  },

  barricade: {
    from: 38,
    intervalCurve: [[38, 24], [200, 15], [280, 11]],
    minGap: 72, // Barikatta her zaman kalan geçiş boşluğu
    spikeChance: 0.45,
    spikeFrom: 80,
    spikeDamage: 5,
    flatTime: 2.2, // Çivili şeritten sonra yol tutuşun düştüğü süre
    flatGrip: 0.55,
    wakeDist: 170,
    wakeTime: 12,
    distAhead: 260,
  },

  tank: {
    fireEvery: 5.5,
    range: 800,
    warnTime: 1.7, // Uyarı dairesi süresi: oyuncu kaçabilmeli
    radius: 105,
    damage: 34,
    lead: 0.45,
  },

  score: {
    perSecond: 10,
    kill: 100,
    prop: 10,
    driftPerSecond: 30,
    nearMiss: 50,
    comboTime: 3.5,
    comboMax: 5,
    comboDriftStep: 0.15, // Drift saniyesi başına çarpan artışı
    comboNearStep: 0.5,
    comboKillStep: 0.25,
    nearMissDist: 66,
    nearMissSpeed: 130,
    coinPerSeconds: 20, // Bitişte her bu kadar saniye için 1 coin
  },

  coin: { magnet: 56, dropChance: 0.3 },

  // Yayalar. density: zemin başına doğma olasılığı (GROUND sırasıyla)
  peds: {
    max: 30, spawnEvery: 0.18, despawn: 1300,
    walkSpeed: 26, runSpeed: 82, fearDist: 130, hitSpeed: 45,
    launch: 190, launchUp: 330, gravity: 900, downTime: 2.2,
    density: [0.12, 0, 1, 1, 0, 0.55, 0.15, 0.3, 0.1],
  },

  // Sivil arabalar: ana yollarda sağdan akar
  npc: {
    max: 9, spawnEvery: 0.9, despawn: 1700, laneOffset: 50, turnChance: 0.28,
    hitScale: 0.42, maxHit: 12,
    totalWeight: 10,
    colors: ['#d9534f', '#3e7cb1', '#f2c14e', '#4f9d69', '#e8e8e8', '#7a5ea8', '#333a45', '#e8833a'],
    types: {
      sedan: { weight: 5, len: 44, wid: 23, mass: 1.3, cruise: 205, turnRate: 2.4, grip: 7 },
      pickup: { weight: 2.6, len: 50, wid: 25, mass: 1.9, cruise: 190, turnRate: 2.2, grip: 7 },
      bus: { weight: 1.2, len: 96, wid: 30, mass: 7, cruise: 150, turnRate: 1.7, grip: 8 },
      truck: { weight: 1.2, len: 108, wid: 32, mass: 8, cruise: 155, turnRate: 1.6, grip: 8 },
    },
  },

  powers: {
    duration: 30, // Süreli güçler (görünmezlik, dev mod)
    chunkChance: 0.34, // Bir chunk'ta güç bulunma olasılığı
    spawnEvery: 24, // Oyuncunun önüne yol üstüne bırakma aralığı
    weights: { blast: 1, ghost: 1, heal: 1.2, giant: 0.8 },
    blastRadius: 430,
    blastTankDamage: 420,
    healAmount: 45,
    giantScale: 1.75,
    giantMass: 3,
    giantCrushTank: 200,
  },

  perf: { maxParticles: 380, maxSkids: 900, maxDecals: 24, maxDpr: 1.75, bakeScale: 0.8, bakePool: 12, slowFrameMs: 21 },
};

// Yıldız seviyesi: başlangıçta 1, her eşikte artar
const MAX_STARS = 4;

// --- physics.js ---
// Araba fiziği: ileri hız, yanal kayma ve açısal hız ayrı ayrı hesaplanır.

const P = CONFIG.physics;

function makeBody() {
  return {
    x: 0, y: 0, vx: 0, vy: 0, a: 0, w: 0,
    steer: 0, grip: 6, slip: 0, speed: 0, forward: 0, lateral: 0, drifting: false,
    len: 46, wid: 24, mass: 1, flat: 0, onGround: 1,
  };
}

function resetBody(b, x, y, a, spec) {
  b.x = x; b.y = y; b.a = a;
  b.vx = 0; b.vy = 0; b.w = 0;
  b.steer = 0; b.grip = spec.grip; b.slip = 0; b.speed = 0; b.forward = 0; b.lateral = 0;
  b.drifting = false; b.flat = 0;
  b.len = spec.len; b.wid = spec.wid; b.mass = spec.mass;
}

// steerIn: -1 sol, +1 sağ. throttle: 1 gaz, 0 boşta, -1 fren ve geri vites.
// spec: maxSpeed, accel, turnRate, grip, driftGrip. surf: CONFIG.surfaces öğesi.
function stepCar(c, steerIn, throttle, spec, surf, dt) {
  c.steer += (steerIn - c.steer) * (1 - Math.exp(-P.steerResponse * dt));

  const ca = Math.cos(c.a);
  const sa = Math.sin(c.a);
  let vF = c.vx * ca + c.vy * sa; // ileri bileşen
  let vL = -c.vx * sa + c.vy * ca; // yanal bileşen (sağa doğru pozitif)
  const speed = Math.hypot(vF, vL);
  const top = spec.maxSpeed * surf.speed;

  // 1) Boyuna: motor, fren, geri vites
  if (throttle > 0) {
    if (vF < 0) vF += P.brakeDecel * throttle * dt;
    else if (vF < top) vF += spec.accel * throttle * (1 - vF / top) * dt;
  } else if (throttle < 0) {
    if (vF > 8) vF = Math.max(0, vF - P.brakeDecel * -throttle * dt);
    else vF = Math.max(-P.reverseSpeed, vF - P.reverseAccel * -throttle * dt);
  }
  if (vF > top) vF -= (vF - top) * Math.min(1, 2.5 * dt);
  vF *= Math.exp(-(P.rollingDrag + surf.drag) * dt);
  vF -= Math.sign(vF) * Math.min(Math.abs(vF), P.scrub * Math.abs(vL) * dt * 4);

  // 2) Yanal: yol tutuş direksiyon kırılınca düşer, bırakınca yavaşça döner
  const steering = Math.abs(c.steer) > 0.25 && speed > P.driftMinSpeed;
  let targetGrip = steering ? spec.driftGrip : spec.grip;
  if (c.flat > 0) targetGrip *= CONFIG.barricade.flatGrip;
  const rate = targetGrip < c.grip ? P.gripLoseRate : P.gripRecoverRate;
  c.grip += (targetGrip - c.grip) * (1 - Math.exp(-rate * dt));

  const keep = Math.exp(-c.grip * surf.grip * dt);
  const drop = Math.min(Math.abs(vL) * (1 - keep), P.maxLateralDecel * dt);
  vL -= Math.sign(vL) * drop;

  // 3) Açısal hız: ağırlık hissi için hedefe üstel yaklaşır, anında dönmez
  const dir = vF >= 0 ? 1 : -1;
  const speedFactor = Math.min(1, speed / 140) * (1 - 0.1 * Math.min(1, speed / spec.maxSpeed));
  const yawTarget = c.steer * spec.turnRate * speedFactor * dir;
  c.w += (yawTarget - c.w) * (1 - Math.exp(-P.yawResponse * dt));

  // 4) Bırakınca burun gidiş yönüne döner
  if (!steering && speed > 40 && vF > 0) {
    const slipAngle = Math.atan2(vL, Math.max(vF, 60));
    c.w += slipAngle * P.alignTorque * Math.min(1, speed / 200) * dt * 2;
  }

  c.vx = vF * ca - vL * sa;
  c.vy = vF * sa + vL * ca;
  c.x += c.vx * dt;
  c.y += c.vy * dt;
  c.a += c.w * dt;

  c.forward = vF;
  c.lateral = vL;
  c.speed = speed;
  c.slip = Math.abs(vL);
  c.drifting = c.slip > P.driftLateral && speed > P.driftMinSpeed;
  if (c.flat > 0) c.flat -= dt;
}

// Bir dairenin AABB ile teması. Temas yoksa -1, varsa derinlik döner; normal out'a yazılır.
function circleRect(cx, cy, r, rx, ry, rw, rh, out) {
  const px = cx < rx ? rx : cx > rx + rw ? rx + rw : cx;
  const py = cy < ry ? ry : cy > ry + rh ? ry + rh : cy;
  let dx = cx - px;
  let dy = cy - py;
  const d2 = dx * dx + dy * dy;
  if (d2 >= r * r) return -1;
  if (d2 > 1e-6) {
    const d = Math.sqrt(d2);
    out.nx = dx / d;
    out.ny = dy / d;
    return r - d;
  }
  // Merkez dikdörtgenin içinde: en yakın kenardan dışarı it
  const left = cx - rx;
  const right = rx + rw - cx;
  const top = cy - ry;
  const bottom = ry + rh - cy;
  const m = Math.min(left, right, top, bottom);
  if (m === left) { out.nx = -1; out.ny = 0; } else if (m === right) { out.nx = 1; out.ny = 0; } else if (m === top) { out.nx = 0; out.ny = -1; } else { out.nx = 0; out.ny = 1; }
  return r + m;
}

// Duvara çarpma: hızı normal boyunca yansıtır, darbe şiddetini döndürür.
function bounceOff(b, nx, ny) {
  const vn = b.vx * nx + b.vy * ny;
  if (vn >= 0) return 0;
  const e = P.wallBounce;
  b.vx -= (1 + e) * vn * nx;
  b.vy -= (1 + e) * vn * ny;
  const keep = 1 - P.wallFriction;
  b.vx *= keep;
  b.vy *= keep;
  // Burun duvardan uzağa, teğete doğru döner
  const fx = Math.cos(b.a);
  const fy = Math.sin(b.a);
  b.w += (fx * ny - fy * nx) * vn * 0.008;
  return -vn;
}

function wrapAngle(a) {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}

// --- world.js ---
// Sonsuz şehir. Her chunk yalnızca kendi koordinatından ve tohumdan üretilir.
// Bağlantı garantisi: her chunk'ın batı ve kuzey kenarı kesintisiz ana yoldur; iç sokaklar
// kenardan kenara uzanır, yani iki ucu da ana yola bağlıdır. Çıkmaz sokak oluşmaz.

const W = CONFIG.world;
const TILE = W.tile;
const CT = W.chunkTiles;
const CHUNK = TILE * CT;
const CELLS = CT * CT;
const ART = W.arterial;

const PROP = {
  TREE: 0, FENCE: 1, CRATE: 2, BARREL: 3, CONE: 4, BARRIER: 5, PARKED: 6, HYDRANT: 7, BENCH: 8, COIN: 9, BUSH: 10,
  PALM: 11, UMBRELLA: 12, PINE: 13, ROCK: 14, CACTUS: 15, HAY: 16, POWER_BLAST: 17, POWER_GHOST: 18, POWER_HEAL: 19, POWER_GIANT: 20,
};

// r: çarpışma yarıçapı, brk: kırılması için gereken hız, drag: arabanın kaybettiği hız payı,
// dmg: oyuncuya hasar, coin: coin düşürür mü
const PROP_INFO = [
  { r: 13, brk: 60, drag: 0.1, dmg: 1, coin: true, chip: '#5da33e' },
  { r: 9, brk: 30, drag: 0.03, dmg: 0.3, coin: false, chip: '#c79a5b' },
  { r: 12, brk: 30, drag: 0.05, dmg: 0.5, coin: true, chip: '#b98446' },
  { r: 11, brk: 30, drag: 0.06, dmg: 0.5, coin: true, chip: '#e0562f' },
  { r: 7, brk: 20, drag: 0.01, dmg: 0, coin: false, chip: '#ff8a2a' },
  { r: 11, brk: 150, drag: 0.14, dmg: 2.5, coin: false, chip: '#dfe4ea' },
  { r: 20, brk: 170, drag: 0.32, dmg: 4, coin: true, chip: '#6a7aa0' },
  { r: 7, brk: 40, drag: 0.04, dmg: 0.5, coin: false, chip: '#e23c3c' },
  { r: 11, brk: 40, drag: 0.05, dmg: 0.5, coin: false, chip: '#9a6b3f' },
  { r: 12, brk: 0, drag: 0, dmg: 0, coin: false, chip: '#ffd23f' },
  { r: 11, brk: 25, drag: 0.03, dmg: 0, coin: false, chip: '#4f9a3a' },
  { r: 10, brk: 60, drag: 0.08, dmg: 1, coin: true, chip: '#6fae3e' },
  { r: 12, brk: 20, drag: 0.02, dmg: 0, coin: false, chip: '#ff5a4d' },
  { r: 12, brk: 60, drag: 0.1, dmg: 1, coin: true, chip: '#2f7a3c' },
  { r: 15, brk: 190, drag: 0.3, dmg: 4, coin: false, chip: '#8e8a84' },
  { r: 9, brk: 40, drag: 0.05, dmg: 0.5, coin: false, chip: '#4f9a5a' },
  { r: 13, brk: 30, drag: 0.08, dmg: 0, coin: true, chip: '#e0c060' },
  { r: 18, brk: 0, drag: 0, dmg: 0, coin: false, chip: '#ff7a1a' },
  { r: 18, brk: 0, drag: 0, dmg: 0, coin: false, chip: '#a07bff' },
  { r: 18, brk: 0, drag: 0, dmg: 0, coin: false, chip: '#2fd872' },
  { r: 18, brk: 0, drag: 0, dmg: 0, coin: false, chip: '#ffd23f' },
];

const POWER_KINDS = ['blast', 'ghost', 'heal', 'giant'];
const isPower = (kind) => kind >= PROP.POWER_BLAST;
const powerName = (kind) => POWER_KINDS[kind - PROP.POWER_BLAST];
const isWaterRect = (rect) => rect.kind === 'water' || rect.kind === 'sea';

// --- Tekrarlanabilir rastgele sayı (mulberry32) ---
let rngState = 1;
function seedRng(a, b, c) {
  let h = (Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(c, 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  rngState = (h ^ (h >>> 16)) | 0;
}
function rnd() {
  rngState = (rngState + 0x6d2b79f5) | 0;
  let t = rngState;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const rint = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const chance = (p) => rnd() < p;

const ROOFS = ['#e8604c', '#f2b134', '#4fb3bf', '#7d5ba6', '#ef8354', '#5c9ead', '#d1495b', '#66a182', '#edae49', '#c44569', '#3d84a8', '#a3b18a'];
const TOWER_COLORS = ['#5fb3d9', '#7a9cc6', '#54c2b0', '#9aa7c7', '#6d8fd1', '#c58fd0'];
const HUT_COLORS = ['#ff6f61', '#3fa7d6', '#ffb400', '#2ec4b6'];
const ADOBE_COLORS = ['#e0ab74', '#d99c62', '#eabd8c'];
const HOUSE_ROOFS = ['#c8553d', '#b5523b', '#d9822b', '#8c5a3c', '#a44a3f', '#5f7f95'];

function newChunk() {
  return {
    cx: 0, cy: 0, x: 0, y: 0,
    ground: new Uint8Array(CELLS),
    cost: new Uint8Array(CELLS), // 0 = geçilmez
    rectAt: new Int16Array(CELLS), // karodaki dikdörtgenin sırası + 1
    rects: [], rectCount: 0,
    props: [], propCount: 0,
    streets: [], streetCount: 0,
    template: 'city', biome: 'city', dirty: true, canvas: null, lastSeen: 0, baseProps: 0,
  };
}

class World {
  constructor(seed = 12345) {
    this.seed = seed | 0;
    this.chunks = new Map();
    this.free = [];
    this.onRelease = null; // Çizim tarafı önbelleği geri alır
    this.frame = 0;
    this.lastChunk = null;
    this.lastKey = -1;
    this.list = []; // Yüklü chunk'ların tahsissiz dolaşımı için
    this.changes = new Map(); // Silinen chunk'larda kırılan, toplanan ve yıkılanlar: geri dönünce aynı kalır
  }

  reset(seed) {
    for (const c of this.chunks.values()) this.release(c);
    this.chunks.clear();
    this.list.length = 0;
    this.changes.clear();
    this.lastChunk = null;
    this.lastKey = -1;
    this.seed = seed | 0;
  }

  release(c) {
    if (this.onRelease) this.onRelease(c);
    this.free.push(c);
  }

  chunk(cx, cy) {
    const key = (cx + 32768) * 65536 + (cy + 32768);
    if (key === this.lastKey) return this.lastChunk;
    let c = this.chunks.get(key);
    if (!c) {
      c = this.free.pop() || newChunk();
      this.generate(c, cx, cy);
      this.chunks.set(key, c);
      this.list.push(c);
    }
    this.lastKey = key;
    this.lastChunk = c;
    return c;
  }

  // Oyuncunun çevresini yükle, uzaktakileri sil. Kare başına en fazla 2 chunk üretir.
  update(px, py) {
    const pcx = Math.floor(px / CHUNK);
    const pcy = Math.floor(py / CHUNK);
    this.frame++;
    let budget = 2;
    const R = W.loadRadius;
    for (let d = 0; d <= R && budget > 0; d++) {
      for (let y = -d; y <= d && budget > 0; y++) {
        for (let x = -d; x <= d && budget > 0; x++) {
          if (Math.max(Math.abs(x), Math.abs(y)) !== d) continue;
          const key = (pcx + x + 32768) * 65536 + (pcy + y + 32768);
          if (!this.chunks.has(key)) { this.chunk(pcx + x, pcy + y); budget--; }
        }
      }
    }
    if (this.frame % 45 === 0) {
      const U = W.unloadRadius;
      for (let i = this.list.length - 1; i >= 0; i--) {
        const c = this.list[i];
        if (Math.abs(c.cx - pcx) > U || Math.abs(c.cy - pcy) > U) {
          this.chunks.delete((c.cx + 32768) * 65536 + (c.cy + 32768));
          this.list[i] = this.list[this.list.length - 1];
          this.list.pop();
          this.saveChanges(c);
          this.release(c);
          this.lastKey = -1;
          this.lastChunk = null;
        }
      }
    }
  }

  // --- Sorgular ---
  groundAt(x, y) {
    const tx = Math.floor(x / TILE);
    const ty = Math.floor(y / TILE);
    const cx = Math.floor(tx / CT);
    const cy = Math.floor(ty / CT);
    return this.chunk(cx, cy).ground[(ty - cy * CT) * CT + (tx - cx * CT)];
  }

  costAtTile(tx, ty) {
    const cx = Math.floor(tx / CT);
    const cy = Math.floor(ty / CT);
    return this.chunk(cx, cy).cost[(ty - cy * CT) * CT + (tx - cx * CT)];
  }

  blockedAt(x, y) {
    return this.costAtTile(Math.floor(x / TILE), Math.floor(y / TILE)) === 0;
  }

  // Polis akış alanı için bir bölgenin geçiş maliyetlerini doldurur
  fillCost(out, ox, oy, size) {
    let i = 0;
    for (let ty = oy; ty < oy + size; ty++) {
      const cy = Math.floor(ty / CT);
      const ly = ty - cy * CT;
      let cx = Math.floor(ox / CT);
      let lx = ox - cx * CT;
      let c = this.chunk(cx, cy);
      for (let n = 0; n < size; n++) {
        out[i++] = c.cost[ly * CT + lx];
        if (++lx === CT) { lx = 0; cx++; c = this.chunk(cx, cy); }
      }
    }
  }

  // Görüş hattı: 30 birimlik adımlarla yol kontrol eder
  lineClear(x0, y0, x1, y1) {
    const d = Math.hypot(x1 - x0, y1 - y0);
    const steps = Math.min(40, Math.ceil(d / 30));
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      if (this.blockedAt(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t)) return false;
    }
    return true;
  }

  // Dairenin en derin temasını bulur; out: nx, ny, depth, rect, chunk
  circleHit(x, y, r, out) {
    const t0x = Math.floor((x - r) / TILE);
    const t1x = Math.floor((x + r) / TILE);
    const t0y = Math.floor((y - r) / TILE);
    const t1y = Math.floor((y + r) / TILE);
    let best = -1;
    let prev = null;
    for (let ty = t0y; ty <= t1y; ty++) {
      for (let tx = t0x; tx <= t1x; tx++) {
        const cx = Math.floor(tx / CT);
        const cy = Math.floor(ty / CT);
        const c = this.chunk(cx, cy);
        const id = c.rectAt[(ty - cy * CT) * CT + (tx - cx * CT)];
        if (id === 0) continue;
        const rect = c.rects[id - 1];
        if (rect === prev) continue;
        prev = rect;
        const depth = circleRect(x, y, r, rect.x, rect.y, rect.w, rect.h, this.tmp);
        if (depth > best) {
          best = depth;
          out.nx = this.tmp.nx;
          out.ny = this.tmp.ny;
          out.depth = depth;
          out.rect = rect;
          out.chunk = c;
        }
      }
    }
    return best > 0;
  }

  // Tank binayı ezer ya da top mermisi yıkar
  crush(chunk, rect) {
    if (!rect.alive) return;
    rect.alive = false;
    const id = chunk.rects.indexOf(rect) + 1;
    for (let i = 0; i < CELLS; i++) {
      if (chunk.rectAt[i] === id) {
        chunk.rectAt[i] = 0;
        chunk.cost[i] = 2;
        chunk.ground[i] = GROUND.DIRT;
      }
    }
    chunk.dirty = true;
  }

  addProp(chunk, kind, x, y, rot = 0) {
    let p = chunk.props[chunk.propCount];
    if (!p) { p = { kind: 0, x: 0, y: 0, rot: 0, alive: true, phase: 0 }; chunk.props[chunk.propCount] = p; }
    chunk.propCount++;
    p.kind = kind; p.x = x; p.y = y; p.rot = rot; p.alive = true; p.phase = (x + y) * 0.01;
    return p;
  }

  dropCoin(x, y) {
    const cx = Math.floor(x / CHUNK);
    const cy = Math.floor(y / CHUNK);
    const c = this.chunk(cx, cy);
    if (c.propCount < 200) this.addProp(c, PROP.COIN, x, y);
  }

  // --- Üretim ---
  generate(c, cx, cy) {
    c.cx = cx; c.cy = cy;
    c.x = cx * CHUNK; c.y = cy * CHUNK;
    c.ground.fill(GROUND.GRASS);
    c.cost.fill(0);
    c.rectAt.fill(0);
    c.rectCount = 0;
    c.propCount = 0;
    c.streetCount = 0;
    c.dirty = true;
    seedRng(cx, cy, this.seed);

    // Ana yollar
    for (let y = 0; y < CT; y++) {
      for (let x = 0; x < CT; x++) {
        if (x < ART || y < ART) c.ground[y * CT + x] = GROUND.ROAD;
      }
    }

    this.biomeAt(cx, cy, biomeOut);
    seedRng(cx, cy, this.seed);
    c.biome = biomeOut.biome;
    const home = Math.abs(cx) <= 1 && Math.abs(cy) <= 1;
    let t = 'city';
    if (!home) {
      if (c.biome === 'city') t = pickTemplate();
      else if (c.biome === 'beach') t = biomeOut.sea ? 'sea' : 'beach';
      else t = c.biome;
    }
    c.template = t;
    if (t === 'city' || t === 'downtown') this.fillCity(c);
    else if (t === 'sea') this.fillSea(c);
    else if (t === 'beach') this.fillBeach(c);
    else if (t === 'forest') this.fillForest(c);
    else if (t === 'desert') this.fillDesert(c);
    else if (t === 'rural') this.fillRural(c);
    else if (t === 'suburb') this.fillSuburb(c);
    else if (t === 'park') this.fillPark(c);
    else if (t === 'lake') this.fillLake(c);
    else if (t === 'industrial') this.fillIndustrial(c);
    else this.fillPlaza(c);

    this.arterialDetails(c);
    this.finishCost(c);
    c.baseProps = c.propCount;
    this.applyChanges(c);
  }

  setGround(c, x0, y0, x1, y1, g) {
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) c.ground[y * CT + x] = g;
  }

  addRect(c, kind, tx0, ty0, tx1, ty1, inset, style, color) {
    let r = c.rects[c.rectCount];
    if (!r) { r = { kind: '', x: 0, y: 0, w: 0, h: 0, style: 0, color: '', alive: true, seed: 0 }; c.rects[c.rectCount] = r; }
    c.rectCount++;
    r.kind = kind; r.style = style; r.color = color; r.alive = true; r.seed = rint(0, 999);
    r.x = c.x + tx0 * TILE + inset;
    r.y = c.y + ty0 * TILE + inset;
    r.w = (tx1 - tx0) * TILE - inset * 2;
    r.h = (ty1 - ty0) * TILE - inset * 2;
    for (let y = ty0; y < ty1; y++) for (let x = tx0; x < tx1; x++) c.rectAt[y * CT + x] = c.rectCount;
    return r;
  }

  addStreet(c, vertical, pos, width, ground = GROUND.ROAD) {
    let s = c.streets[c.streetCount];
    if (!s) { s = { vertical: false, pos: 0, width: 0 }; c.streets[c.streetCount] = s; }
    c.streetCount++;
    s.vertical = vertical; s.pos = pos; s.width = width; s.ground = ground;
    if (vertical) this.setGround(c, pos, ART, pos + width, CT, ground);
    else this.setGround(c, ART, pos, CT, pos + width, ground);
  }

  // Kenardan kenara sokak: iki ucu da ana yola bağlanır. Kesim noktaları lots dizisine yazılır.
  cutStreets(c, count, vertical, out) {
    out.length = 0;
    out.push(ART);
    if (count === 1) {
      const w = rint(3, 4);
      const p = rint(10, 14);
      this.addStreet(c, vertical, p, w);
      out.push(p, p + w);
    } else if (count === 2) {
      const p1 = rint(9, 10);
      const p2 = rint(16, 17);
      this.addStreet(c, vertical, p1, 3);
      this.addStreet(c, vertical, p2, 3);
      out.push(p1, p1 + 3, p2, p2 + 3);
    }
    out.push(CT);
  }

  fillCity(c) {
    const nv = rint(0, 2);
    const nh = nv === 0 ? rint(1, 2) : rint(0, 2);
    this.cutStreets(c, nv, true, xsBuf);
    this.cutStreets(c, nh, false, ysBuf);
    for (let j = 0; j < ysBuf.length; j += 2) {
      for (let i = 0; i < xsBuf.length; i += 2) {
        this.cityLot(c, xsBuf[i], ysBuf[j], xsBuf[i + 1], ysBuf[j + 1]);
      }
    }
    this.parkedAlongStreets(c, 0.3);
  }

  cityLot(c, x0, y0, x1, y1) {
    this.setGround(c, x0, y0, x1, y1, GROUND.WALK);
    if (x1 - x0 < 3 || y1 - y0 < 3) return;
    const big = (x1 - x0) * (y1 - y0) > 110;
    this.lotY0 = y0 + 1; this.lotY1 = y1 - 1; this.lotX0 = x0 + 1; this.lotX1 = x1 - 1;
    this.split(c, x0 + 1, y0 + 1, x1 - 1, y1 - 1, big ? 7 : 5);
    this.sidewalkTrees(c, x0, y0, x1, y1);
  }

  // Parselleri bölerek binalar.
  split(c, x0, y0, x1, y1, maxB) {
    const w = x1 - x0;
    const h = y1 - y0;
    if (w < 2 || h < 2) return;
    if (w <= maxB && h <= maxB && (w <= 3 || h <= 3 || chance(0.55))) {
      this.building(c, x0, y0, x1, y1);
      return;
    }
    const vertical = w === h ? chance(0.5) : w > h;
    const len = vertical ? w : h;
    if (len < 4) { this.building(c, x0, y0, x1, y1); return; }
    // Ara sokak yalnızca parselin iki kenarına da ulaşıyorsa açılır; yoksa kapalı cep oluşurdu
    const through = vertical ? y0 === this.lotY0 && y1 === this.lotY1 : x0 === this.lotX0 && x1 === this.lotX1;
    const gap = through && len >= 8 && chance(0.55) ? 2 : 0;
    const at = rint(2, len - 2 - gap);
    if (vertical) {
      this.split(c, x0, y0, x0 + at, y1, maxB);
      this.split(c, x0 + at + gap, y0, x1, y1, maxB);
    } else {
      this.split(c, x0, y0, x1, y0 + at, maxB);
      this.split(c, x0, y0 + at + gap, x1, y1, maxB);
    }
  }

  building(c, x0, y0, x1, y1) {
    const area = (x1 - x0) * (y1 - y0);
    const downtown = c.template === 'downtown';
    if (area >= 9 && chance(downtown ? 0.75 : 0.14)) {
      this.addRect(c, 'building', x0, y0, x1, y1, 3, rint(BUILD.TOWER_GLASS, BUILD.TOWER_STEP), TOWER_COLORS[rint(0, TOWER_COLORS.length - 1)]);
      return;
    }
    const style = area >= 30 ? rint(0, 4) : rint(0, 3);
    this.addRect(c, 'building', x0, y0, x1, y1, 3, style, ROOFS[rint(0, ROOFS.length - 1)]);
  }

  sidewalkTrees(c, x0, y0, x1, y1) {
    for (let x = x0 + 1; x < x1 - 1; x += 2) {
      if (chance(0.3)) this.addProp(c, chance(0.8) ? PROP.TREE : PROP.HYDRANT, c.x + (x + 0.5) * TILE, c.y + y0 * TILE + 13);
      if (chance(0.3)) this.addProp(c, chance(0.8) ? PROP.TREE : PROP.BENCH, c.x + (x + 0.5) * TILE, c.y + y1 * TILE - 13);
    }
    for (let y = y0 + 1; y < y1 - 1; y += 2) {
      if (chance(0.25)) this.addProp(c, PROP.TREE, c.x + x0 * TILE + 13, c.y + (y + 0.5) * TILE);
      if (chance(0.25)) this.addProp(c, PROP.TREE, c.x + x1 * TILE - 13, c.y + (y + 0.5) * TILE);
    }
  }

  // Yol kenarına park etmiş arabalar; kavşak ağızlarına konmaz
  parkedAlongStreets(c, p) {
    for (let i = 0; i < c.streetCount; i++) {
      const s = c.streets[i];
      const a = (s.pos * TILE) + 15;
      const b = ((s.pos + s.width) * TILE) - 15;
      for (let k = ART + 1; k < CT - 2; k += 2) {
        if (!chance(p)) continue;
        const side = chance(0.5) ? a : b;
        const ax = s.vertical ? side : (k + 0.5) * TILE;
        const ay = s.vertical ? (k + 0.5) * TILE : side;
        const off = side === a ? -TILE : TILE;
        const nx = s.vertical ? Math.floor((ax + off) / TILE) : k;
        const ny = s.vertical ? k : Math.floor((ay + off) / TILE);
        if (nx < 0 || ny < 0 || nx >= CT || ny >= CT) continue;
        if (c.ground[ny * CT + nx] === GROUND.ROAD) continue;
        // Çapraz sokakla kesişimde de bırakma
        const lx = s.vertical ? nx + (off > 0 ? -1 : 1) : k;
        if (s.vertical ? c.ground[(k + 1) * CT + nx] === GROUND.ROAD || c.ground[(k - 1) * CT + nx] === GROUND.ROAD : lx < 0) continue;
        if (!s.vertical && (c.ground[ny * CT + k + 1] === GROUND.ROAD || c.ground[ny * CT + k - 1] === GROUND.ROAD)) continue;
        this.addProp(c, PROP.PARKED, c.x + ax, c.y + ay, s.vertical ? Math.PI / 2 : 0);
      }
    }
  }

  fillSuburb(c) {
    const vertical = chance(0.5);
    this.cutStreets(c, 1, vertical, xsBuf);
    for (let i = 0; i < xsBuf.length; i += 2) {
      const a = xsBuf[i];
      const b = xsBuf[i + 1];
      if (vertical) this.suburbLot(c, a, ART, b, CT);
      else this.suburbLot(c, ART, a, CT, b);
    }
    this.parkedAlongStreets(c, 0.2);
  }

  suburbLot(c, x0, y0, x1, y1) {
    this.setGround(c, x0, y0, x1, y0 + 1, GROUND.WALK);
    this.setGround(c, x0, y1 - 1, x1, y1, GROUND.WALK);
    this.setGround(c, x0, y0, x0 + 1, y1, GROUND.WALK);
    this.setGround(c, x1 - 1, y0, x1, y1, GROUND.WALK);
    for (let y = y0 + 1; y + 4 <= y1 - 1; y += 5) {
      for (let x = x0 + 1; x + 4 <= x1 - 1; x += 5) {
        this.addRect(c, 'building', x, y, x + 3, y + 3, 4, 5, HOUSE_ROOFS[rint(0, HOUSE_ROOFS.length - 1)]);
        // Çit: evin önünde kırılabilir sıra
        const fy = c.y + (y + 3.5) * TILE;
        for (let k = 0; k < 3; k++) {
          if (chance(0.8)) this.addProp(c, PROP.FENCE, c.x + (x + 0.5 + k) * TILE, fy);
        }
        if (chance(0.6)) this.addProp(c, chance(0.5) ? PROP.TREE : PROP.BUSH, c.x + (x + 3.5) * TILE, c.y + (y + rnd() * 3) * TILE);
      }
    }
  }

  fillPark(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.GRASS);
    // Serbest sürülebilen çimen, yalnızca ortada gölet
    const pw = rint(5, 8);
    const ph = rint(5, 8);
    const px = rint(8, 22 - pw);
    const py = rint(8, 22 - ph);
    this.setGround(c, px, py, px + pw, py + ph, GROUND.WATER);
    this.addRect(c, 'water', px, py, px + pw, py + ph, 6, 0, '#3aa7e8');
    // Patikalar
    this.setGround(c, ART, py + (ph >> 1), px, py + (ph >> 1) + 1, GROUND.DIRT);
    this.setGround(c, px + pw, py + (ph >> 1), CT, py + (ph >> 1) + 1, GROUND.DIRT);
    const n = rint(16, 28);
    for (let i = 0; i < n; i++) {
      const tx = rint(ART + 1, CT - 1);
      const ty = rint(ART + 1, CT - 1);
      if (c.ground[ty * CT + tx] !== GROUND.GRASS) continue;
      const k = rnd();
      this.addProp(c, k < 0.65 ? PROP.TREE : k < 0.88 ? PROP.BUSH : PROP.BENCH, c.x + (tx + rnd()) * TILE, c.y + (ty + rnd()) * TILE);
    }
  }

  fillLake(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.SAND);
    const a = ART + 2;
    const b = CT - 2;
    this.setGround(c, a, a, b, b, GROUND.WATER);
    this.addRect(c, 'water', a, a, b, b, 4, 1, '#2f9be0');
    for (let k = ART; k < CT - 1; k += 2) {
      if (chance(0.5)) this.addProp(c, PROP.BUSH, c.x + (k + 0.5) * TILE, c.y + (ART + 0.5) * TILE);
      if (chance(0.5)) this.addProp(c, PROP.TREE, c.x + (ART + 0.5) * TILE, c.y + (k + 0.5) * TILE);
    }
  }

  fillIndustrial(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.DIRT);
    const vertical = chance(0.5);
    this.cutStreets(c, 1, vertical, xsBuf);
    for (let i = 0; i < xsBuf.length; i += 2) {
      const a = xsBuf[i];
      const b = xsBuf[i + 1];
      const x0 = vertical ? a : ART;
      const x1 = vertical ? b : CT;
      const y0 = vertical ? ART : a;
      const y1 = vertical ? CT : b;
      this.industrialLot(c, x0, y0, x1, y1);
    }
  }

  industrialLot(c, x0, y0, x1, y1) {
    const w = x1 - x0;
    const h = y1 - y0;
    if (w >= 5 && h >= 5) {
      this.addRect(c, 'building', x0 + 1, y0 + 1, x1 - 2, Math.min(y1 - 2, y0 + 7), 3, 6, chance(0.5) ? '#8fa3b0' : '#b0a08f');
      // Duvar yalnızca bir kenarda ve yarım boyda: etraf kapanmaz
      if (y1 - y0 >= 11) {
        const wy = y0 + 8;
        const r = this.addRect(c, 'wall', x0 + 1, wy, Math.min(x1 - 1, x0 + 1 + (w >> 1)), wy + 1, 0, 0, '#a7adb5');
        r.y += 16; r.h = 8;
      }
    }
    const n = rint(6, 12);
    for (let i = 0; i < n; i++) {
      const tx = rint(x0, x1 - 1);
      const ty = rint(y0, y1 - 1);
      const id = ty * CT + tx;
      if (c.rectAt[id] !== 0 || c.ground[id] === GROUND.ROAD) continue;
      this.addProp(c, chance(0.55) ? PROP.CRATE : PROP.BARREL, c.x + (tx + 0.5) * TILE, c.y + (ty + 0.5) * TILE, rnd() * 3);
    }
  }

  fillPlaza(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.PLAZA);
    this.addRect(c, 'water', 12, 12, 17, 17, 8, 2, '#57c1f0');
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2;
      this.addProp(c, PROP.BENCH, c.x + 14.5 * TILE + Math.cos(a) * 170, c.y + 14.5 * TILE + Math.sin(a) * 170, a);
      this.addProp(c, PROP.TREE, c.x + 14.5 * TILE + Math.cos(a + 0.3) * 290, c.y + 14.5 * TILE + Math.sin(a + 0.3) * 290);
    }
  }

  // Biyom haritası: gelişigüzel yerleşmiş tohum noktalarına en yakın olanın biyomu.
  // Sınırlar düzgün ızgara olmaz, bölgeler büyük ve düzensiz görünür.
  biomeAt(cx, cy, out) {
    const cs = W.biomeCell;
    const gx = Math.floor(cx / cs);
    const gy = Math.floor(cy / cs);
    let best = 1e12;
    let bx = 0;
    let by = 0;
    for (let y = gy - 1; y <= gy + 1; y++) {
      for (let x = gx - 1; x <= gx + 1; x++) {
        seedRng(x, y, this.seed ^ 0x5bd1);
        const px = (x + 0.15 + rnd() * 0.7) * cs;
        const py = (y + 0.15 + rnd() * 0.7) * cs;
        const d = (px - cx) * (px - cx) + (py - cy) * (py - cy);
        if (d < best) { best = d; bx = x; by = y; }
      }
    }
    seedRng(bx, by, this.seed ^ 0x2f77);
    out.biome = bx === 0 && by === 0 ? 'city' : pickFrom(W.biomes);
    out.sea = out.biome === 'beach' && Math.sqrt(best) < cs * W.seaRadius;
    return out;
  }

  isSea(cx, cy) {
    this.biomeAt(cx, cy, biomeOut2);
    return biomeOut2.sea;
  }

  // Boş yer varsa bina koyar. Çevresinde bir karo boşluk kalır, yani kapalı cep oluşmaz.
  place(c, kind, x0, y0, w, h, style, color, inset = 3) {
    if (x0 < ART + 1 || y0 < ART + 1 || x0 + w > CT - 1 || y0 + h > CT - 1) return null;
    for (let y = y0 - 1; y <= y0 + h; y++) {
      for (let x = x0 - 1; x <= x0 + w; x++) {
        const i = y * CT + x;
        if (c.rectAt[i] !== 0) return null;
        const g = c.ground[i];
        if (g === GROUND.ROAD || g === GROUND.WATER || g === GROUND.SHALLOW) return null;
      }
    }
    return this.addRect(c, kind, x0, y0, x0 + w, y0 + h, inset, style, color);
  }

  scatter(c, kind, n, grounds) {
    for (let i = 0; i < n; i++) {
      const tx = rint(ART, CT - 1);
      const ty = rint(ART, CT - 1);
      const id = ty * CT + tx;
      if (c.rectAt[id] !== 0 || !grounds.includes(c.ground[id])) continue;
      this.addProp(c, kind, c.x + (tx + 0.2 + rnd() * 0.6) * TILE, c.y + (ty + 0.2 + rnd() * 0.6) * TILE, 0);
    }
  }

  // Deniz: komşu da denizse kum şeridi bırakılmaz, ana yollar köprü olarak geçer
  fillSea(c) {
    const { cx, cy } = c;
    this.setGround(c, ART, ART, CT, CT, GROUND.SAND);
    const n = this.isSea(cx, cy - 1);
    const s = this.isSea(cx, cy + 1);
    const e = this.isSea(cx + 1, cy);
    const w = this.isSea(cx - 1, cy);
    seedRng(cx, cy, this.seed + 7);
    const top = ART + (n ? 0 : rint(3, 5));
    const bottom = CT - (s ? 0 : rint(3, 5));
    for (let y = top; y < bottom; y++) {
      const x0 = ART + (w ? 0 : rint(3, 5));
      const x1 = CT - (e ? 0 : rint(3, 5));
      this.setGround(c, x0, y, x1, y + 1, GROUND.WATER);
    }
    // Kıyıda arabayla girilebilen sığ su
    for (let pass = 0; pass < 2; pass++) {
      const from = pass === 0 ? GROUND.SAND : GROUND.SHALLOW;
      for (let y = ART; y < CT; y++) {
        for (let x = ART; x < CT; x++) {
          const i = y * CT + x;
          if (c.ground[i] !== GROUND.WATER) continue;
          const near = (x > ART && c.ground[i - 1] === from) || (x < CT - 1 && c.ground[i + 1] === from)
            || (y > ART && c.ground[i - CT] === from) || (y < CT - 1 && c.ground[i + CT] === from);
          if (near) c.cost[i] = 1;
        }
      }
      for (let i = 0; i < CELLS; i++) if (c.cost[i] === 1) { c.ground[i] = GROUND.SHALLOW; c.cost[i] = 0; }
    }
    for (let y = ART; y < CT; y++) {
      let x = ART;
      while (x < CT) {
        if (c.ground[y * CT + x] !== GROUND.WATER) { x++; continue; }
        let end = x;
        while (end < CT && c.ground[y * CT + end] === GROUND.WATER) end++;
        this.addRect(c, 'sea', x, y, end, y + 1, 0, 0, '#1f8fd6');
        x = end;
      }
    }
    this.scatter(c, PROP.UMBRELLA, 8, [GROUND.SAND]);
    this.scatter(c, PROP.PALM, 6, [GROUND.SAND]);
  }

  fillBeach(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.SAND);
    if (chance(0.6)) {
      this.addStreet(c, chance(0.5), rint(8, 18), 3, GROUND.PLAZA); // Sahil yürüyüş yolu
    }
    for (let i = 0; i < 5; i++) {
      this.place(c, 'building', rint(6, 20), rint(6, 20), 2, 2, BUILD.HUT, HUT_COLORS[rint(0, 3)]);
    }
    this.place(c, 'building', rint(7, 18), rint(7, 18), 2, 2, BUILD.LIFEGUARD, '#e8352e');
    if (chance(0.35)) this.place(c, 'building', rint(7, 17), rint(7, 17), 3, 3, BUILD.LIGHTHOUSE, '#e8352e');
    this.scatter(c, PROP.UMBRELLA, 22, [GROUND.SAND]);
    this.scatter(c, PROP.PALM, 16, [GROUND.SAND]);
    this.scatter(c, PROP.BUSH, 4, [GROUND.SAND]);
  }

  fillForest(c) {
    if (chance(0.7)) this.addStreet(c, chance(0.5), rint(9, 17), 3, GROUND.DIRT); // Orman yolu
    if (chance(0.25)) {
      const px = rint(8, 14);
      const py = rint(8, 14);
      if (c.streetCount === 0) {
        this.setGround(c, px, py, px + 6, py + 6, GROUND.WATER);
        this.addRect(c, 'water', px, py, px + 6, py + 6, 6, 0, '#3aa7e8');
      }
    }
    for (let i = 0; i < 2; i++) this.place(c, 'building', rint(6, 19), rint(6, 19), 3, 2, BUILD.CABIN, '#7d5230');
    if (chance(0.5)) this.place(c, 'building', rint(7, 19), rint(7, 19), 2, 2, BUILD.FIRETOWER, '#8a6a3f');
    this.scatter(c, PROP.PINE, 95, [GROUND.GRASS]);
    this.scatter(c, PROP.TREE, 22, [GROUND.GRASS]);
    this.scatter(c, PROP.BUSH, 22, [GROUND.GRASS, GROUND.DIRT]);
    this.scatter(c, PROP.ROCK, 6, [GROUND.GRASS]);
  }

  fillDesert(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.SAND);
    if (chance(0.6)) this.addStreet(c, chance(0.5), rint(9, 17), 3, GROUND.DIRT);
    for (let i = 0; i < 3; i++) this.place(c, 'building', rint(6, 15), rint(6, 15), rint(3, 7), rint(3, 6), BUILD.MESA, '#b36a3c', 2);
    for (let i = 0; i < 4; i++) this.place(c, 'building', rint(6, 19), rint(6, 19), rint(2, 3), 2, BUILD.ADOBE, ADOBE_COLORS[rint(0, 2)]);
    if (chance(0.3)) this.place(c, 'building', rint(7, 19), rint(7, 19), 2, 2, BUILD.WATERTOWER, '#9cc6d8');
    if (chance(0.3)) this.place(c, 'building', rint(6, 18), rint(6, 18), 3, 2, BUILD.GAS, '#efefef');
    this.scatter(c, PROP.CACTUS, 34, [GROUND.SAND]);
    this.scatter(c, PROP.ROCK, 12, [GROUND.SAND]);
    this.scatter(c, PROP.BARREL, 4, [GROUND.SAND, GROUND.DIRT]);
  }

  fillRural(c) {
    if (chance(0.7)) this.addStreet(c, chance(0.5), rint(9, 17), 3, GROUND.DIRT); // Köy yolu
    // Tarlalar
    for (let i = 0; i < 4; i++) {
      const x = rint(6, 15);
      const y = rint(6, 15);
      const w = rint(5, 8);
      const h = rint(5, 8);
      for (let ty = y; ty < y + h && ty < CT; ty++) {
        for (let tx = x; tx < x + w && tx < CT; tx++) {
          if (c.ground[ty * CT + tx] === GROUND.GRASS) c.ground[ty * CT + tx] = GROUND.FIELD;
        }
      }
      for (let tx = x; tx < x + w && tx < CT; tx++) {
        if (chance(0.7) && c.ground[y * CT + tx] === GROUND.FIELD) this.addProp(c, PROP.FENCE, c.x + (tx + 0.5) * TILE, c.y + y * TILE);
      }
    }
    this.place(c, 'building', rint(6, 18), rint(6, 18), 4, 3, BUILD.BARN, '#b5352a');
    this.place(c, 'building', rint(6, 19), rint(6, 19), 3, 3, 5, HOUSE_ROOFS[rint(0, HOUSE_ROOFS.length - 1)], 4);
    for (let i = 0; i < 2; i++) this.place(c, 'building', rint(6, 20), rint(6, 20), 2, 2, BUILD.SILO, '#c3cad2');
    if (chance(0.45)) this.place(c, 'building', rint(7, 18), rint(7, 18), 3, 3, BUILD.WINDMILL, '#d9d2c2');
    this.scatter(c, PROP.HAY, 16, [GROUND.FIELD, GROUND.GRASS]);
    this.scatter(c, PROP.TREE, 12, [GROUND.GRASS]);
    this.scatter(c, PROP.BUSH, 8, [GROUND.GRASS]);
  }

  saveChanges(c) {
    let changed = false;
    const rects = new Uint8Array(c.rectCount);
    for (let i = 0; i < c.rectCount; i++) if (!c.rects[i].alive) { rects[i] = 1; changed = true; }
    const props = new Uint8Array(c.baseProps);
    for (let i = 0; i < c.baseProps; i++) if (!c.props[i].alive) { props[i] = 1; changed = true; }
    const extra = [];
    for (let i = c.baseProps; i < c.propCount; i++) {
      const p = c.props[i];
      if (p.alive) { extra.push(p.kind, p.x, p.y); changed = true; }
    }
    const key = (c.cx + 32768) * 65536 + (c.cy + 32768);
    if (changed) this.changes.set(key, { rects, props, extra });
    else this.changes.delete(key);
  }

  applyChanges(c) {
    const saved = this.changes.get((c.cx + 32768) * 65536 + (c.cy + 32768));
    if (!saved) return;
    for (let i = 0; i < saved.rects.length; i++) if (saved.rects[i]) this.crush(c, c.rects[i]);
    for (let i = 0; i < saved.props.length; i++) if (saved.props[i]) c.props[i].alive = false;
    for (let i = 0; i < saved.extra.length; i += 3) this.addProp(c, saved.extra[i], saved.extra[i + 1], saved.extra[i + 2]);
  }

  addPower(x, y, kind) {
    const c = this.chunk(Math.floor(x / CHUNK), Math.floor(y / CHUNK));
    if (c.propCount < 300) this.addProp(c, kind, x, y);
  }

  // Ana yol üstü: kenarda park, yol çalışması, coin sıraları
  arterialDetails(c) {
    const edgeFar = ART * TILE - 15;
    const urban = c.biome === 'city';
    for (let k = ART + 1; k < CT - 1 && urban; k += 2) {
      // Dikey ana yolun doğu kenarı
      if (chance(0.16) && c.ground[k * CT + ART] !== GROUND.ROAD && c.ground[(k + 1) * CT + ART] !== GROUND.ROAD && c.ground[(k - 1) * CT + ART] !== GROUND.ROAD) {
        this.addProp(c, PROP.PARKED, c.x + edgeFar, c.y + (k + 0.5) * TILE, Math.PI / 2);
      }
      if (chance(0.16) && c.ground[ART * CT + k] !== GROUND.ROAD && c.ground[ART * CT + k + 1] !== GROUND.ROAD && c.ground[ART * CT + k - 1] !== GROUND.ROAD) {
        this.addProp(c, PROP.PARKED, c.x + (k + 0.5) * TILE, c.y + edgeFar, 0);
      }
    }
    // Yol çalışması: yolun yarısından azını kaplar, her zaman boşluk kalır
    if (urban && chance(0.3)) {
      const vertical = chance(0.5);
      const s = rint(7, 16);
      for (let i = 0; i < 6; i++) {
        const along = (s + i) * TILE;
        const across = 26 + (i === 0 || i === 5 ? 0 : 40);
        const x = vertical ? across : along;
        const y = vertical ? along : across;
        this.addProp(c, i === 0 || i === 5 ? PROP.BARRIER : PROP.CONE, c.x + x, c.y + y, vertical ? 0 : Math.PI / 2);
      }
    }
    if (chance(0.6)) {
      const vertical = chance(0.5);
      const s = rint(7, 18);
      const lane = chance(0.5) ? 60 : 140;
      for (let i = 0; i < 5; i++) {
        const along = (s + i * 0.9) * TILE;
        this.addProp(c, PROP.COIN, c.x + (vertical ? lane : along), c.y + (vertical ? along : lane));
      }
    }
    if (chance(CONFIG.powers.chunkChance) && !(Math.abs(c.cx) <= 1 && Math.abs(c.cy) <= 1)) {
      const vertical = chance(0.5);
      const along = rint(7, 20) * TILE;
      this.addProp(c, PROP.POWER_BLAST + pickPowerIndex(), c.x + (vertical ? 100 : along), c.y + (vertical ? along : 100));
    }
  }

  finishCost(c) {
    const COST = [3, 1, 2, 1, 0, 3, 2, 3, 3];
    for (let i = 0; i < CELLS; i++) c.cost[i] = c.rectAt[i] ? 0 : COST[c.ground[i]];
    // Binaya bitişik karolar pahalı: polisler köşeye sürtmesin
    for (let y = 1; y < CT - 1; y++) {
      for (let x = 1; x < CT - 1; x++) {
        const i = y * CT + x;
        if (c.cost[i] === 0) continue;
        if (c.rectAt[i - 1] || c.rectAt[i + 1] || c.rectAt[i - CT] || c.rectAt[i + CT]) c.cost[i] += 2;
      }
    }
  }
}
World.prototype.tmp = { nx: 0, ny: 0 };

const biomeOut = { biome: 'city', sea: false };
const biomeOut2 = { biome: 'city', sea: false };
const xsBuf = [];
const ysBuf = [];

function pickTemplate() {
  return pickFrom(W.templates);
}

function pickPowerIndex() {
  return POWER_KINDS.indexOf(pickFrom(CONFIG.powers.weights));
}

function pickFrom(t) {
  let sum = 0;
  for (const k in t) sum += t[k];
  let r = rnd() * sum;
  for (const k in t) {
    r -= t[k];
    if (r < 0) return k;
  }
  return Object.keys(t)[0];
}

// --- effects.js ---
// Efekt verileri (çizimden bağımsız). Her şey sabit boyutlu havuzda: oyun sırasında bellek ayrılmaz.

const FX = { SMOKE: 0, DARK: 1, FIRE: 2, SPARK: 3, DEBRIS: 4, GLINT: 5, DUST: 6, WATER: 7 };

const FXP = CONFIG.perf;

class Effects {
  constructor() {
    const n = FXP.maxParticles;
    this.max = n;
    this.x = new Float32Array(n);
    this.y = new Float32Array(n);
    this.vx = new Float32Array(n);
    this.vy = new Float32Array(n);
    this.life = new Float32Array(n);
    this.ttl = new Float32Array(n);
    this.size = new Float32Array(n);
    this.rot = new Float32Array(n);
    this.kind = new Uint8Array(n);
    this.color = new Uint8Array(n);
    this.cursor = 0;
    this.colors = ['#888888'];

    // Lastik izleri halka tampon: x1,y1,x2,y2,yaş
    this.skidMax = FXP.maxSkids;
    this.skid = new Float32Array(this.skidMax * 5);
    this.skidCursor = 0;

    this.decals = [];
    for (let i = 0; i < FXP.maxDecals; i++) this.decals.push({ x: 0, y: 0, r: 0, alive: false, rot: 0 });
    this.decalCursor = 0;

    this.waves = [];
    for (let i = 0; i < 8; i++) this.waves.push({ x: 0, y: 0, r: 0, max: 0, t: 0, alive: false });

    this.floats = [];
    for (let i = 0; i < 14; i++) this.floats.push({ x: 0, y: 0, t: 0, text: '', color: '', alive: false });
    this.floatCursor = 0;
  }

  clear() {
    this.life.fill(0);
    this.skid.fill(0);
    for (const d of this.decals) d.alive = false;
    for (const w of this.waves) w.alive = false;
    for (const f of this.floats) f.alive = false;
  }

  colorId(c) {
    let i = this.colors.indexOf(c);
    if (i < 0) { i = this.colors.length; this.colors.push(c); }
    return i;
  }

  // Havuz doluysa en eskinin üstüne yazar
  spawn(kind, x, y, vx, vy, ttl, size, color = 0) {
    const i = this.cursor;
    this.cursor = (i + 1) % this.max;
    this.kind[i] = kind;
    this.x[i] = x; this.y[i] = y;
    this.vx[i] = vx; this.vy[i] = vy;
    this.life[i] = ttl; this.ttl[i] = ttl;
    this.size[i] = size;
    this.rot[i] = Math.random() * 6.28;
    this.color[i] = color;
  }

  burst(kind, x, y, n, speed, ttl, size, color = 0) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283;
      const s = speed * (0.3 + Math.random() * 0.7);
      this.spawn(kind, x, y, Math.cos(a) * s, Math.sin(a) * s, ttl * (0.6 + Math.random() * 0.6), size * (0.7 + Math.random() * 0.6), color);
    }
  }

  sparks(x, y, n, nx = 0, ny = 0) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.283;
      const s = 80 + Math.random() * 260;
      this.spawn(FX.SPARK, x, y, Math.cos(a) * s + nx * 160, Math.sin(a) * s + ny * 160, 0.25 + Math.random() * 0.3, 2.5);
    }
  }

  debris(x, y, color, n, speed = 170) {
    this.burst(FX.DEBRIS, x, y, n, speed, 0.8, 7, this.colorId(color));
  }

  explosion(x, y, size) {
    this.burst(FX.FIRE, x, y, Math.round(size * 0.4), size * 2.8, 0.85, size * 0.62);
    this.burst(FX.DARK, x, y, Math.round(size * 0.14), size * 1.5, 1.1, size * 0.34);
    this.sparks(x, y, Math.round(size * 0.3));
    this.wave(x, y, size * 2.6);
    this.decal(x, y, size * 0.8);
  }

  wave(x, y, max) {
    for (const w of this.waves) {
      if (!w.alive) {
        w.alive = true; w.x = x; w.y = y; w.r = 0; w.max = max; w.t = 0;
        return;
      }
    }
  }

  decal(x, y, r) {
    const d = this.decals[this.decalCursor];
    this.decalCursor = (this.decalCursor + 1) % this.decals.length;
    d.alive = true; d.x = x; d.y = y; d.r = r; d.rot = Math.random() * 6.28;
  }

  float(x, y, text, color = '#fff') {
    const f = this.floats[this.floatCursor];
    this.floatCursor = (this.floatCursor + 1) % this.floats.length;
    f.alive = true; f.x = x; f.y = y; f.t = 0; f.text = text; f.color = color;
  }

  addSkid(x1, y1, x2, y2) {
    const i = this.skidCursor * 5;
    this.skidCursor = (this.skidCursor + 1) % this.skidMax;
    const s = this.skid;
    s[i] = x1; s[i + 1] = y1; s[i + 2] = x2; s[i + 3] = y2; s[i + 4] = 1;
  }

  update(dt) {
    const { x, y, vx, vy, life, kind } = this;
    for (let i = 0; i < this.max; i++) {
      if (life[i] <= 0) continue;
      life[i] -= dt;
      x[i] += vx[i] * dt;
      y[i] += vy[i] * dt;
      const k = kind[i];
      const drag = k === FX.SPARK ? 3 : k === FX.DEBRIS ? 2.6 : 1.8;
      const f = 1 - drag * dt;
      vx[i] *= f;
      vy[i] *= f;
      if (k === FX.DEBRIS) this.rot[i] += dt * 9 * (life[i] / this.ttl[i]);
    }
    for (const w of this.waves) {
      if (!w.alive) continue;
      w.t += dt * 2.4;
      w.r = w.max * (1 - (1 - w.t) * (1 - w.t));
      if (w.t >= 1) w.alive = false;
    }
    for (const f of this.floats) {
      if (!f.alive) continue;
      f.t += dt;
      f.y -= 46 * dt;
      if (f.t > 1.1) f.alive = false;
    }
  }

  liveCount() {
    let n = 0;
    for (let i = 0; i < this.max; i++) if (this.life[i] > 0) n++;
    return n;
  }
}

// --- police.js ---
// Polis yapay zekâsı: akış alanıyla yol bulma, kovalama, sıkıştırma, barikat, tank.

const COP_AI = CONFIG.policeAI;

// Oyuncunun çevresinde 96x96 karoluk en kısa yol alanı. Binalar, su ve çıkmazlar çözülür.
class FlowField {
  constructor(size = 96) {
    this.size = size;
    const n = size * size;
    this.cost = new Uint8Array(n);
    this.dist = new Uint16Array(n);
    this.queue = new Int32Array(n);
    this.inQueue = new Uint8Array(n);
    this.ox = 0;
    this.oy = 0;
  }

  compute(world, x, y) {
    const { size, cost, dist, queue, inQueue } = this;
    const n = size * size;
    const tx = Math.floor(x / TILE);
    const ty = Math.floor(y / TILE);
    this.ox = tx - (size >> 1);
    this.oy = ty - (size >> 1);
    world.fillCost(cost, this.ox, this.oy, size);
    dist.fill(65535);
    inQueue.fill(0);
    const start = (size >> 1) * size + (size >> 1);
    cost[start] = cost[start] || 1;
    dist[start] = 0;
    let head = 0;
    let tail = 1;
    let count = 1;
    queue[0] = start;
    inQueue[start] = 1;
    while (count > 0) {
      const i = queue[head];
      head = (head + 1) % n;
      count--;
      inQueue[i] = 0;
      const d = dist[i];
      const col = i % size;
      for (let k = 0; k < 4; k++) {
        let j;
        if (k === 0) { if (col === size - 1) continue; j = i + 1; }
        else if (k === 1) { if (col === 0) continue; j = i - 1; }
        else if (k === 2) { j = i + size; if (j >= n) continue; }
        else { j = i - size; if (j < 0) continue; }
        const c = cost[j];
        if (c === 0) continue;
        const nd = d + c;
        if (nd < dist[j]) {
          dist[j] = nd;
          if (!inQueue[j]) {
            inQueue[j] = 1;
            queue[tail] = j;
            tail = (tail + 1) % n;
            count++;
          }
        }
      }
    }
  }

  // Bulunduğu karodan birkaç adım ilerideki yol noktasını verir
  sample(x, y, out, steps = 4) {
    const { size, dist, cost } = this;
    let cx = Math.floor(x / TILE) - this.ox;
    let cy = Math.floor(y / TILE) - this.oy;
    if (cx < 1 || cy < 1 || cx >= size - 1 || cy >= size - 1) return false;
    if (dist[cy * size + cx] === 65535) {
      // Engelli karoya sürüklendiyse yanındaki açık karodan devam et
      let found = false;
      for (let d = 0; d < 4 && !found; d++) {
        const nx = cx + (d === 0 ? 1 : d === 1 ? -1 : 0);
        const ny = cy + (d === 2 ? 1 : d === 3 ? -1 : 0);
        if (dist[ny * size + nx] !== 65535) { cx = nx; cy = ny; found = true; }
      }
      if (!found) return false;
    }
    for (let s = 0; s < steps; s++) {
      let best = dist[cy * size + cx];
      let bx = cx;
      let by = cy;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (!dx && !dy) continue;
          const nx = cx + dx;
          const ny = cy + dy;
          if (nx < 0 || ny < 0 || nx >= size || ny >= size) continue;
          if (dx && dy && (cost[cy * size + nx] === 0 || cost[ny * size + cx] === 0)) continue;
          const v = dist[ny * size + nx];
          if (v < best) { best = v; bx = nx; by = ny; }
        }
      }
      if (bx === cx && by === cy) break;
      cx = bx;
      cy = by;
    }
    out.x = (cx + this.ox + 0.5) * TILE;
    out.y = (cy + this.oy + 0.5) * TILE;
    return true;
  }
}

// Barikat yerleşimi. roadW: yol genişliği. Sonuç yol kenarından ölçülen merkezler.
// Boşluk her zaman minGap'ten büyüktür, gerekirse daha az araba konur.
function planBarricade(roadW, minGap, carLen, wantSpike, random, out) {
  const slot = carLen + 4;
  let n = Math.min(3, Math.floor((roadW - minGap) / slot));
  n = Math.max(0, n);
  out.count = n;
  out.spikeFrom = 0;
  out.spikeTo = 0;
  if (n === 0) return out;
  const free = roadW - n * slot;
  const edge = random() < 0.5 ? 0 : 1; // Boşluk hangi tarafta
  const start = edge === 0 ? 0 : free;
  for (let i = 0; i < n; i++) out.slots[i] = start + slot * (i + 0.5);
  out.gapFrom = edge === 0 ? n * slot : 0;
  out.gapTo = out.gapFrom + free;
  const extra = free - minGap;
  if (wantSpike && extra > 28) {
    // Çivili şerit arabaların yanına serilir, geçiş boşluğunu daraltmaz
    if (edge === 0) {
      out.spikeFrom = n * slot;
      out.spikeTo = n * slot + extra;
      out.gapFrom += extra;
    } else {
      out.spikeFrom = free - extra;
      out.spikeTo = free;
      out.gapTo -= extra;
    }
  }
  return out;
}

function newPlan() {
  return { count: 0, slots: [0, 0, 0], spikeFrom: 0, spikeTo: 0, gapFrom: 0, gapTo: 0 };
}

const target = { x: 0, y: 0 };

function drivePatrol(cop, g, dt) {
  const p = g.player;
  const d = g.diff;
  const dx = p.x - cop.x;
  const dy = p.y - cop.y;
  const dist = Math.hypot(dx, dy);

  // Görüş hattı her karede değil, sırayla bakılır
  if ((g.tickCount + cop.id) % 10 === 0) cop.los = dist < 900 && g.world.lineClear(cop.x, cop.y, p.x, p.y);

  const smart = cop.spec.smart * (0.55 + 0.45 * Math.min(1, d.aggression));
  const lead = Math.min(0.95, dist / Math.max(160, cop.drive.maxSpeed)) * smart;
  target.x = p.x + p.vx * lead;
  target.y = p.y + p.vy * lead;

  // Kıstırıcı: önce yanına gelir, yakındayken içeri kırar. Gelişmiş polis arka çeyreğe vurur (PIT).
  if (cop.role === 'flanker' && dist < 520) {
    const fx = Math.cos(p.a);
    const fy = Math.sin(p.a);
    const side = (dx * -fy + dy * fx) > 0 ? -1 : 1; // Oyuncunun hangi tarafındayız
    const gap = dist < 90 ? 14 : 44;
    const back = cop.type === 'advanced' ? -22 : 8;
    target.x = p.x + p.vx * 0.32 + fx * back - fy * side * gap;
    target.y = p.y + p.vy * 0.32 + fy * back + fx * side * gap;
  }

  if (g.ghostT > 0) {
    // Görünmezlik: oyuncuyu göremez, bulunduğu yerde rastgele dolaşır
    cop.wanderT -= dt;
    if (cop.wanderT <= 0) {
      const a = cop.a + (Math.random() - 0.5) * 2.4;
      cop.wx = cop.x + Math.cos(a) * 320;
      cop.wy = cop.y + Math.sin(a) * 320;
      cop.wanderT = 1.5 + Math.random() * 2.5;
    }
    target.x = cop.wx;
    target.y = cop.wy;
  } else if (!cop.los && g.flowReady) {
    g.flow.sample(cop.x, cop.y, target, 5);
  }

  const err = wrapAngle(Math.atan2(target.y - cop.y, target.x - cop.x) - cop.a);
  let steer = Math.max(-1, Math.min(1, err * 2.6));

  // Duvar bıyıkları: ön iki noktada engel varsa kaç
  const reach = 70 + cop.speed * 0.2;
  const ca = Math.cos(cop.a);
  const sa = Math.sin(cop.a);
  const lx = cop.x + (ca * 0.92 + sa * 0.42) * reach;
  const ly = cop.y + (sa * 0.92 - ca * 0.42) * reach;
  const rx = cop.x + (ca * 0.92 - sa * 0.42) * reach;
  const ry = cop.y + (sa * 0.92 + ca * 0.42) * reach;
  const left = g.world.blockedAt(lx, ly);
  const right = g.world.blockedAt(rx, ry);
  if (left && !right) steer = Math.min(1, steer + 0.9);
  else if (right && !left) steer = Math.max(-1, steer - 0.9);

  let throttle = 1;
  const sharp = Math.abs(err) > 1.1;
  if (sharp && cop.speed > 190) throttle = -0.35;
  if ((left && right) && cop.speed > 200) throttle = -0.5;

  // Takılma: ışınlanma yok. Geri vitese takar, burnu çevirip yeniden dener.
  if (cop.reverseT > 0) {
    cop.reverseT -= dt;
    cop.ctlS = -Math.sign(err || 1);
    cop.ctlT = -1;
    return;
  }
  if (cop.speed < 34) cop.stuckT += dt;
  else cop.stuckT = Math.max(0, cop.stuckT - dt * 2);
  if (cop.stuckT > COP_AI.stuckTime) {
    cop.stuckT = 0;
    cop.reverseT = COP_AI.reverseTime;
    cop.reverses++;
  }
  cop.ctlS = steer;
  cop.ctlT = throttle;
}

function driveTank(cop, g, dt) {
  const p = g.player;
  target.x = g.ghostT > 0 ? cop.x + Math.cos(cop.a) * 200 : p.x;
  target.y = g.ghostT > 0 ? cop.y + Math.sin(cop.a) * 200 : p.y;
  const ahead = g.world.groundAt(cop.x + Math.cos(cop.a) * 110, cop.y + Math.sin(cop.a) * 110);
  if (ahead === GROUND.WATER && g.flowReady) g.flow.sample(cop.x, cop.y, target, 6);
  const err = wrapAngle(Math.atan2(target.y - cop.y, target.x - cop.x) - cop.a);
  cop.ctlS = Math.max(-1, Math.min(1, err * 2));
  cop.ctlT = Math.abs(err) > 1.4 ? 0.3 : 1;
  const aim = wrapAngle(Math.atan2(p.y - cop.y, p.x - cop.x) - cop.turret);
  cop.turret += Math.max(-1, Math.min(1, aim)) * 1.8 * dt;
}

function driveCop(cop, g, dt) {
  if (cop.state === 'barricade') {
    cop.ctlS = 0;
    cop.ctlT = 0;
    cop.wakeT -= dt;
    const d = Math.hypot(g.player.x - cop.x, g.player.y - cop.y);
    if ((d < CONFIG.barricade.wakeDist && g.ghostT <= 0) || cop.wakeT <= 0) cop.state = 'chase';
    return;
  }
  if (cop.type === 'tank') driveTank(cop, g, dt);
  else drivePatrol(cop, g, dt);
}

// --- crowd.js ---
// Yayalar ve sivil trafik. Sabit havuz kullanır, sadece oyuncunun çevresinde yaşar.

const PD = CONFIG.peds;
const NP = CONFIG.npc;
const ART_MID = (CONFIG.world.arterial * TILE) / 2;
const PED_WALK = 0;
const PED_RUN = 1;
const PED_FLY = 2;
const PED_DOWN = 3;

// Yönler: 0 doğu, 1 güney, 2 batı, 3 kuzey. Trafik sağdan akar.
const DX = [1, 0, -1, 0];
const DY = [0, 1, 0, -1];
const LANE = [1, -1, -1, 1];

class Crowd {
  constructor(game) {
    this.g = game;
    this.peds = [];
    for (let i = 0; i < PD.max; i++) {
      this.peds.push({ alive: false, x: 0, y: 0, a: 0, vx: 0, vy: 0, z: 0, vz: 0, spin: 0, state: 0, t: 0, turnT: 0, look: 0, step: 0 });
    }
    this.npcs = [];
    for (let i = 0; i < NP.max; i++) {
      const b = makeBody();
      b.alive = false; b.kind = 'sedan'; b.spec = null; b.state = 'drive'; b.color = 0; b.t = 0;
      b.dir = 0; b.line = 0; b.lastCross = 1e9; b.hornT = 0; b.ctlS = 0; b.ctlT = 1; b.breaker = true;
      b.drive = { maxSpeed: 0, accel: 0, turnRate: 0, grip: 0, driftGrip: 0 };
      this.npcs.push(b);
    }
    this.pedT = 0;
    this.npcT = 0;
    this.limit = 1; // Yavaş cihazda azalır
    this.screamT = 0;
    this.pedCount = 0;
    this.npcCount = 0;
  }

  clear() {
    for (const p of this.peds) p.alive = false;
    for (const n of this.npcs) n.alive = false;
    this.pedCount = 0;
    this.npcCount = 0;
  }

  update(dt) {
    const g = this.g;
    this.screamT -= dt;
    this.pedT -= dt;
    if (this.pedT <= 0) { this.pedT = PD.spawnEvery; this.spawnPed(); }
    this.npcT -= dt;
    if (this.npcT <= 0) { this.npcT = NP.spawnEvery; this.spawnNpc(); }

    let peds = 0;
    for (const p of this.peds) {
      if (!p.alive) continue;
      peds++;
      this.updatePed(p, dt);
    }
    this.pedCount = peds;
    let npcs = 0;
    for (const n of this.npcs) {
      if (!n.alive) continue;
      npcs++;
      this.updateNpc(n, dt, g);
    }
    this.npcCount = npcs;
  }

  // --- Yayalar ---
  spawnPed() {
    const g = this.g;
    if (this.pedCount >= PD.max * this.limit) return;
    const p = this.peds.find((k) => !k.alive);
    if (!p) return;
    const pl = g.player;
    const R = g.viewRadius();
    for (let i = 0; i < 6; i++) {
      const a = Math.random() * 6.283;
      const r = R * (0.75 + Math.random() * 0.55);
      const x = pl.x + Math.cos(a) * r;
      const y = pl.y + Math.sin(a) * r;
      if (g.onScreen(x, y, 30)) continue;
      const gr = g.world.groundAt(x, y);
      const chance = PD.density[gr] || 0;
      if (Math.random() > chance || g.world.blockedAt(x, y)) continue;
      p.alive = true;
      p.x = x; p.y = y; p.z = 0;
      p.a = Math.floor(Math.random() * 4) * 1.5708;
      p.state = PED_WALK;
      p.t = 0; p.turnT = 1 + Math.random() * 3; p.step = Math.random() * 6;
      p.look = Math.floor(Math.random() * 6);
      return;
    }
  }

  launch(p, b, scream) {
    const g = this.g;
    const dx = p.x - b.x;
    const dy = p.y - b.y;
    const d = Math.hypot(dx, dy) || 1;
    p.state = PED_FLY;
    p.vx = b.vx * 0.85 + (dx / d) * PD.launch;
    p.vy = b.vy * 0.85 + (dy / d) * PD.launch;
    p.vz = PD.launchUp * (0.8 + Math.random() * 0.4);
    p.spin = (Math.random() < 0.5 ? -1 : 1) * (9 + Math.random() * 8);
    g.fx.burst(FX.GLINT, p.x, p.y, 6, 150, 0.4, 4);
    g.fx.burst(FX.DUST, p.x, p.y, 4, 60, 0.5, 8);
    if (scream && this.screamT <= 0) {
      this.screamT = 0.22;
      g.emit('scream', Math.min(1, 500 / (Math.hypot(p.x - g.player.x, p.y - g.player.y) + 200)));
      if (Math.random() < 0.4) g.fx.float(p.x, p.y - 16, 'AAAH!', '#ffffff');
    }
    g.emit('thud');
  }

  blockedForPed(x, y) {
    const w = this.g.world;
    return w.blockedAt(x, y) || w.groundAt(x, y) === GROUND.ROAD;
  }

  updatePed(p, dt) {
    const g = this.g;
    const pl = g.player;
    if (Math.abs(p.x - pl.x) > PD.despawn || Math.abs(p.y - pl.y) > PD.despawn) { p.alive = false; return; }

    if (p.state === PED_FLY) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.a += p.spin * dt;
      p.z += p.vz * dt;
      p.vz -= PD.gravity * dt;
      p.vx *= 1 - 0.8 * dt;
      p.vy *= 1 - 0.8 * dt;
      if (p.z <= 0) {
        p.z = 0;
        if (p.vz < -220) {
          p.vz *= -0.35; // Bir kez sekerek düşer
        } else {
          p.state = PED_DOWN;
          p.t = PD.downTime;
        }
      }
      return;
    }
    if (p.state === PED_DOWN) {
      p.t -= dt;
      if (p.t <= 0) { p.state = PED_RUN; p.turnT = 2; }
      return;
    }

    // Araç tehlikesi: kaç, çarpılırsa uç
    if (this.checkHit(p, pl, g.state === 'play')) return;
    for (const c of g.cops) {
      if (Math.abs(c.x - p.x) < 60 && Math.abs(c.y - p.y) < 60 && this.checkHit(p, c, false)) return;
    }
    for (const n of this.npcs) {
      if (n.alive && Math.abs(n.x - p.x) < 80 && Math.abs(n.y - p.y) < 80 && this.checkHit(p, n, false)) return;
    }

    const dx = p.x - pl.x;
    const dy = p.y - pl.y;
    const d2 = dx * dx + dy * dy;
    const fear = PD.fearDist * PD.fearDist;
    if (d2 < fear && pl.speed > 150 && p.state === PED_WALK && g.state === 'play') {
      p.state = PED_RUN;
      p.a = Math.atan2(dy, dx) + (Math.random() - 0.5);
      p.turnT = 1.6;
      if (this.screamT <= 0 && Math.random() < 0.35) {
        this.screamT = 0.5;
        g.emit('scream', 0.45);
      }
    }
    const speed = p.state === PED_RUN ? PD.runSpeed : PD.walkSpeed;
    const nx = p.x + Math.cos(p.a) * speed * dt;
    const ny = p.y + Math.sin(p.a) * speed * dt;
    const lookX = p.x + Math.cos(p.a) * 16;
    const lookY = p.y + Math.sin(p.a) * 16;
    if (p.state === PED_WALK ? this.blockedForPed(lookX, lookY) : g.world.blockedAt(lookX, lookY)) {
      p.a += (Math.random() < 0.5 ? 1 : -1) * 1.5708;
      p.turnT = 1 + Math.random() * 3;
    } else {
      p.x = nx;
      p.y = ny;
    }
    p.step += dt * (speed * 0.3);
    p.turnT -= dt;
    if (p.turnT <= 0) {
      p.turnT = 1.5 + Math.random() * 4;
      if (p.state === PED_RUN) p.state = PED_WALK;
      else p.a += (Math.floor(Math.random() * 3) - 1) * 1.5708;
    }
  }

  checkHit(p, b, isPlayer) {
    const r = b.len * 0.44 + 7;
    const dx = p.x - b.x;
    const dy = p.y - b.y;
    if (dx * dx + dy * dy >= r * r) return false;
    const speed = Math.hypot(b.vx, b.vy);
    if (speed < PD.hitSpeed) {
      p.a = Math.atan2(dy, dx);
      p.state = PED_RUN;
      p.turnT = 1.2;
      return false;
    }
    this.launch(p, b, true);
    if (isPlayer) this.g.pedHits++;
    return true;
  }

  blast(x, y, R) {
    for (const p of this.peds) {
      if (!p.alive || p.state === PED_FLY) continue;
      if (Math.hypot(p.x - x, p.y - y) < R * 0.6) this.launch(p, { x, y, vx: 0, vy: 0 }, true);
    }
    const g = this.g;
    for (const n of this.npcs) {
      if (!n.alive) continue;
      if (Math.hypot(n.x - x, n.y - y) < R) this.explodeNpc(n);
    }
    g.cam.shake = Math.max(g.cam.shake, 22);
  }

  explodeNpc(n) {
    const g = this.g;
    g.fx.explosion(n.x, n.y, 60);
    g.fx.debris(n.x, n.y, NP.colors[n.color], 12, 260);
    n.alive = false;
  }

  // --- Sivil trafik ---
  spawnNpc() {
    const g = this.g;
    if (this.npcCount >= NP.max * this.limit) return;
    const n = this.npcs.find((k) => !k.alive);
    if (!n) return;
    const p = g.player;
    const R = g.viewRadius() + 120 + Math.random() * 400;
    const dir = Math.floor(Math.random() * 4);
    // Oyuncuya yakın bir ana yol çizgisi seç
    const horizontal = dir === 0 || dir === 2;
    const base = horizontal ? p.y : p.x;
    const line = (Math.floor(base / CHUNK) + Math.floor(Math.random() * 3) - 1) * CHUNK + ART_MID;
    const back = Math.random() < 0.5 ? R : -R; // Önden ya da arkadan girer
    const x = horizontal ? p.x + back : line + LANE[dir] * NP.laneOffset;
    const y = horizontal ? line + LANE[dir] * NP.laneOffset : p.y + back;
    if (g.onScreen(x, y, 100)) return;
    for (const o of this.npcs) if (o.alive && Math.hypot(o.x - x, o.y - y) < 180) return;

    let r = Math.random() * NP.totalWeight;
    let kind = 'sedan';
    for (const k in NP.types) {
      r -= NP.types[k].weight;
      if (r < 0) { kind = k; break; }
    }
    const spec = NP.types[kind];
    resetBody(n, x, y, dir * 1.5708, spec);
    n.alive = true;
    n.kind = kind;
    n.spec = spec;
    n.state = 'drive';
    n.dir = dir;
    n.line = line;
    n.color = Math.floor(Math.random() * NP.colors.length);
    n.t = 0;
    n.lastCross = 1e9;
    n.hornT = 0;
    n.drive.maxSpeed = spec.cruise * (0.9 + Math.random() * 0.2);
    n.drive.accel = 260;
    n.drive.turnRate = spec.turnRate;
    n.drive.grip = spec.grip;
    n.drive.driftGrip = spec.grip;
    n.vx = DX[dir] * n.drive.maxSpeed;
    n.vy = DY[dir] * n.drive.maxSpeed;
  }

  // Kavşağa gelince bazen sağa ya da sola döner
  crossing(n) {
    const horizontal = n.dir === 0 || n.dir === 2;
    const pos = horizontal ? n.x : n.y;
    const k = Math.round((pos - ART_MID) / CHUNK);
    const center = k * CHUNK + ART_MID;
    const ahead = (center - pos) * (n.dir === 0 || n.dir === 1 ? 1 : -1);
    if (ahead < 70 && ahead > 0 && n.lastCross !== k) {
      n.lastCross = k;
      if (Math.random() < NP.turnChance) {
        n.dir = (n.dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
        n.line = center;
        n.lastCross = 1e9;
      }
    }
  }

  updateNpc(n, dt, g) {
    const p = g.player;
    const far = Math.max(Math.abs(n.x - p.x), Math.abs(n.y - p.y));
    if (far > NP.despawn) { n.alive = false; return; }
    n.t += dt;
    if (n.hornT > 0) n.hornT -= dt;

    if (n.state === 'drive') {
      this.crossing(n);
      const lane = n.line + LANE[n.dir] * NP.laneOffset;
      const horizontal = n.dir === 0 || n.dir === 2;
      const tx = horizontal ? n.x + DX[n.dir] * 90 : lane;
      const ty = horizontal ? lane : n.y + DY[n.dir] * 90;
      const err = wrapAngle(Math.atan2(ty - n.y, tx - n.x) - n.a);
      n.ctlS = Math.max(-1, Math.min(1, err * 2.4));
      n.ctlT = Math.abs(err) > 0.5 && n.speed > 110 ? -0.4 : n.speed < n.drive.maxSpeed ? 1 : 0;
      // Önündeki oyuncuya fren ve korna
      const fx = Math.cos(n.a);
      const fy = Math.sin(n.a);
      const ax = p.x - n.x;
      const ay = p.y - n.y;
      const front = ax * fx + ay * fy;
      const side = Math.abs(-ax * fy + ay * fx);
      if (front > 0 && front < 150 + n.len && side < 34) {
        n.ctlT = -0.8;
        if (n.hornT <= 0 && g.state === 'play') {
          n.hornT = 3;
          g.emit('horn', n.kind === 'bus' || n.kind === 'truck' ? 1 : 0);
        }
      }
    } else {
      n.ctlS = 0;
      n.ctlT = 0;
      n.grip = Math.min(n.grip, 1.2); // Savrulurken lastik tutmaz
      if (n.t > 2 && Math.random() < 0.08) g.fx.spawn(FX.SMOKE, n.x, n.y, 0, 0, 0.9, 11);
    }
    const surf = CONFIG.surfaces[g.world.groundAt(n.x, n.y)];
    stepCar(n, n.ctlS, n.ctlT, n.drive, surf, dt);
    g.collideWorld(n, false);
    if ((g.tickCount + n.line) % 4 < 1 && g.onScreen(n.x, n.y, 120)) g.collideProps(n, false);

    // Oyuncuyla çarpışma
    if (g.state === 'play' && far < (n.len + p.len) * 0.8) {
      const rv = g.collideCars(p, n);
      if (rv > 30) this.hitNpc(n, rv, true);
    }
    // Polislerle çarpışma
    for (const c of g.cops) {
      const dx = c.x - n.x;
      const dy = c.y - n.y;
      const r = (c.len + n.len) * 0.6;
      if (dx * dx + dy * dy > r * r) continue;
      const rv = g.collideCars(c, n);
      if (rv > 50) {
        this.hitNpc(n, rv, false);
        c.hp -= rv * 0.03;
      }
    }
  }

  hitNpc(n, rv, byPlayer) {
    const g = this.g;
    if (n.state !== 'wreck') { n.state = 'wreck'; n.t = 0; }
    n.w += (Math.random() < 0.5 ? -1 : 1) * Math.min(5, rv / 90) / Math.sqrt(n.mass);
    g.fx.sparks(n.x, n.y, 8);
    g.fx.debris(n.x, n.y, NP.colors[n.color], 4);
    if (byPlayer) {
      g.npcHits++;
      g.playerImpact(rv + 30, NP.hitScale * Math.min(2, Math.sqrt(n.mass)), true, NP.maxHit);
      if (g.giantT > 0) { n.vx *= 1.6; n.vy *= 1.6; }
    }
  }
}

// --- game.js ---
// Oyun mantığı. DOM'a dokunmaz; tarayıcısız test edilebilir.

const D = CONFIG.difficulty;
const DMG = CONFIG.damage;
const AI = CONFIG.policeAI;
const SC = CONFIG.score;
const BAR = CONFIG.barricade;
const TK = CONFIG.tank;
const PW = CONFIG.powers;
const tmpSirens = { wail: 1e9, yelp: 1e9, hilo: 1e9, chirp: 1e9 };

function interp(curve, t) {
  if (t <= curve[0][0]) return curve[0][1];
  for (let i = 1; i < curve.length; i++) {
    if (t <= curve[i][0]) {
      const [t0, v0] = curve[i - 1];
      const [t1, v1] = curve[i];
      return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
    }
  }
  return curve[curve.length - 1][1];
}

// Süreye göre zorluk: eğriler doğrusal olduğu için her saniye biraz artar
function difficultyAt(t, out = {}) {
  out.stage = t >= D.tanksAt ? 3 : t >= D.advancedAt ? 2 : t >= D.swatAt ? 1 : 0;
  out.stars = Math.min(MAX_STARS, 1 + out.stage);
  out.maxPolice = Math.min(D.maxActive, Math.round(interp(D.policeCurve, t)));
  out.spawnInterval = interp(D.spawnCurve, t);
  out.hpMul = interp(D.hpCurve, t);
  out.power = interp(D.powerCurve, t);
  out.aggression = interp(D.aggressionCurve, t);
  out.flankerShare = interp(D.flankerShare, t);
  out.swatShare = t >= D.swatAt ? interp(D.swatShare, t) : 0;
  out.advancedShare = t >= D.advancedAt ? interp(D.advancedShare, t) : 0;
  out.motoShare = t >= D.motoFrom ? interp(D.motoShare, t) : 0;
  out.fastShare = t >= D.fastFrom ? interp(D.fastShare, t) : 0;
  out.tanks = t >= D.tanksAt ? Math.round(interp(D.tankCount, t)) : 0;
  out.barricadeEvery = t >= BAR.from ? interp(BAR.intervalCurve, t) : Infinity;
  return out;
}

function damageStage(d) {
  const s = DMG.stages;
  return d >= s[3] ? 4 : d >= s[2] ? 3 : d >= s[1] ? 2 : d >= s[0] ? 1 : 0;
}

// Hıza ve araca bağlı çarpma hasarı
function impactDamage(impact, durability, mul, time) {
  if (impact <= DMG.minImpact) return 0;
  const grace = time < DMG.earlyGraceUntil ? DMG.earlyGraceMul : 1;
  return Math.min(DMG.maxSingleHit, ((impact - DMG.minImpact) * DMG.perSpeed * mul * grace) / durability);
}

function makeCop() {
  const b = makeBody();
  b.id = 0; b.type = 'car'; b.spec = null; b.role = 'chaser'; b.state = 'chase';
  b.drive = { maxSpeed: 0, accel: 0, turnRate: 0, grip: 0, driftGrip: 0 };
  b.hp = 0; b.maxHp = 0; b.power = 1;
  b.ctlS = 0; b.ctlT = 1; b.stuckT = 0; b.reverseT = 0; b.reverses = 0;
  b.los = false; b.hitCd = 0; b.nearCd = 0; b.wakeT = 0;
  b.turret = 0; b.fireT = 0; b.fxT = 0; b.hurtFlash = 0;
  b.wanderT = 0; b.wx = 0; b.wy = 0;
  return b;
}

const hit = { nx: 0, ny: 0, depth: 0, rect: null, chunk: null };
const spawnPt = { x: 0, y: 0 };
const plan = newPlan();

class Game {
  constructor(seed = (Math.random() * 1e9) | 0) {
    this.world = new World(seed);
    this.fx = new Effects();
    this.crowd = new Crowd(this);
    this.sirens = tmpSirens;
    this.flow = new FlowField();
    this.player = makeBody();
    this.cops = [];
    this.copPool = [];
    this.shots = [];
    for (let i = 0; i < 8; i++) this.shots.push({ x: 0, y: 0, t: 0, alive: false });
    this.spikes = [];
    for (let i = 0; i < 6; i++) this.spikes.push({ x: 0, y: 0, a: 0, len: 0, alive: false, used: false });
    this.diff = difficultyAt(0);
    this.state = 'idle';
    this.carSpec = CONFIG.cars[0];
    this.view = { w: 390, h: 844 };
    this.cam = { x: 0, y: 0, zoom: 1, shake: 0, sx: 0, sy: 0, scale: 1, halfW: 200, halfH: 400 };
    this.onEvent = null;
    this.god = false;
    this.tickCount = 0;
    this.nextId = 1;
    this.resetRun(0);
    this.updateCamera(1);
  }

  emit(name, value = 0) {
    if (this.onEvent) this.onEvent(name, value);
  }

  resetRun(startTime) {
    this.time = startTime;
    this.runTime = 0;
    this.score = 0;
    this.coins = 0;
    this.kills = 0;
    this.broken = 0;
    this.driftTime = 0;
    this.nearMisses = 0;
    this.pedHits = 0;
    this.npcHits = 0;
    this.ghostT = 0;
    this.giantT = 0;
    this.powerT = 12;
    this.powersTaken = 0;
    this.combo = 1;
    this.comboT = 0;
    this.damage = 0;
    this.stage = 0;
    this.burning = false;
    this.burnT = 0;
    this.hitCd = 0;
    this.sinceHit = 0;
    this.smokeT = 0;
    this.dyingT = 0;
    this.hitFlash = 0;
    this.spawnT = 0;
    this.barricadeT = 12;
    this.tankT = 2;
    this.flowT = 0;
    this.flowReady = false;
    this.warnT = 0;
    this.fireShake = 0;
    this.sirenDist = 1e9;
    this.sirenClosing = 0;
    while (this.cops.length) this.copPool.push(this.cops.pop());
    for (const s of this.shots) s.alive = false;
    for (const s of this.spikes) s.alive = false;
    this.fx.clear();
    this.crowd.clear();
    difficultyAt(this.time, this.diff);
    this.lastStage = this.diff.stage;
    this.result = null;
  }

  start(carSpec, { startTime = CONFIG.dev.startTime, god = CONFIG.dev.godMode, seed = (Math.random() * 1e9) | 0 } = {}) {
    this.carSpec = carSpec;
    this.god = god;
    this.world.reset(seed);
    this.resetRun(startTime);
    resetBody(this.player, 100, 300, Math.PI / 2, carSpec);
    this.player.vy = 120;
    this.player.vx = 0;
    this.state = 'play';
    this.cam.x = this.player.x;
    this.cam.y = this.player.y;
    this.cam.zoom = 1;
    this.cam.shake = 0;
  }

  // Menü arkası: ana yolda giden bir kaçış sahnesi
  startAttract() {
    this.state = 'attract';
    this.world.reset(4242);
    this.resetRun(0);
    this.god = true;
    resetBody(this.player, 0, 100, 0, this.carSpec);
    this.player.vx = 300;
    for (let i = 0; i < 2; i++) {
      const c = this.spawnCop('car', 'chaser', -170 - i * 90, 62 + i * 76, 0);
      c.vx = 300;
    }
    this.cam.x = 0;
    this.cam.y = 100;
  }

  stopToIdle() {
    this.state = 'idle';
  }

  // --- Ana adım ---
  tick(dt, steer, reverse) {
    this.tickCount++;
    if (this.state === 'attract') this.tickAttract(dt);
    else if (this.state === 'play') this.tickPlay(dt, steer, reverse);
    else if (this.state === 'dying') this.tickDying(dt);
    this.fx.update(dt);
    this.updateCamera(dt);
  }

  tickAttract(dt) {
    const p = this.player;
    p.x += p.vx * dt;
    p.speed = 300;
    for (const c of this.cops) { c.x += c.vx * dt; c.fxT += dt; }
    this.world.update(p.x, p.y);
    this.crowd.update(dt);
  }

  tickPlay(dt, steer, reverse) {
    this.time += dt;
    this.runTime += dt;
    difficultyAt(this.time, this.diff);
    this.world.update(this.player.x, this.player.y);

    if (this.diff.stage !== this.lastStage) {
      if (this.diff.stage > this.lastStage) {
        this.warnT = 2.4;
        this.emit('alert', this.diff.stage);
      }
      this.lastStage = this.diff.stage;
    }

    this.updatePlayer(dt, steer, reverse);
    this.updateFlow(dt);
    this.updateCops(dt);
    this.crowd.update(dt);
    this.director(dt);
    this.updatePowers(dt);
    this.updateShots(dt);
    this.updateSpikes();
    this.updateScore(dt);
    this.updateDamage(dt);
    if (this.warnT > 0) this.warnT -= dt;
    if (this.hitFlash > 0) this.hitFlash -= dt * 3;
  }

  tickDying(dt) {
    this.dyingT -= dt;
    this.world.update(this.player.x, this.player.y);
    const p = this.player;
    p.vx *= 1 - 2 * dt;
    p.vy *= 1 - 2 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (Math.random() < 0.3) this.fx.burst(FX.DARK, p.x, p.y, 1, 40, 1, 15);
    this.updateCops(dt * 0.5);
    this.crowd.update(dt);
    this.updateShots(dt);
    if (this.hitFlash > 0) this.hitFlash -= dt * 3;
    if (this.dyingT <= 0) this.finish();
  }

  // --- Oyuncu ---
  updatePlayer(dt, steer, reverse) {
    const p = this.player;
    const g = this.world.groundAt(p.x, p.y);
    const surf = CONFIG.surfaces[g];
    stepCar(p, steer, reverse ? -1 : 1, this.carSpec, surf, dt);
    if (this.hitCd > 0) this.hitCd -= dt;

    const impact = this.collideWorld(p, true);
    if (impact > 0) this.playerImpact(impact, hit.rect && isWaterRect(hit.rect) ? 0.35 : 1, false);
    this.collideProps(p, true);
    this.driftEffects(dt, g);

    if (this.hitFlash > 0 && Math.random() < 0.02) this.fx.sparks(p.x, p.y, 2);
    // Sığ suda sıçrama, kumda toz
    if (p.speed > 130 && Math.random() < 0.4) {
      if (g === GROUND.SHALLOW) this.fx.spawn(FX.WATER, p.x, p.y, -p.vx * 0.15 + (Math.random() - 0.5) * 90, -p.vy * 0.15 + (Math.random() - 0.5) * 90, 0.5, 9);
      else if (g === GROUND.SAND || g === GROUND.DIRT) this.fx.spawn(FX.DUST, p.x, p.y, p.vx * 0.1, p.vy * 0.1, 0.6, 11);
    }
  }

  driftEffects(dt, ground) {
    const p = this.player;
    if (!p.drifting) { p.lastRearValid = false; return; }
    const ca = Math.cos(p.a);
    const sa = Math.sin(p.a);
    const back = -p.len * 0.34;
    const side = p.wid * 0.42;
    const rlx = p.x + ca * back + sa * side;
    const rly = p.y + sa * back - ca * side;
    const rrx = p.x + ca * back - sa * side;
    const rry = p.y + sa * back + ca * side;
    const paved = ground === GROUND.ROAD || ground === GROUND.PLAZA || ground === GROUND.WALK;
    if (p.lastRearValid && paved) {
      this.fx.addSkid(p.lrx, p.lry, rlx, rly);
      this.fx.addSkid(p.rrx, p.rry, rrx, rry);
    }
    p.lrx = rlx; p.lry = rly; p.rrx = rrx; p.rry = rry;
    p.lastRearValid = true;
    this.smokeT -= dt;
    if (this.smokeT <= 0) {
      this.smokeT = 0.035;
      const kind = paved ? FX.SMOKE : ground === GROUND.WATER ? FX.WATER : FX.DUST;
      const px = Math.random() < 0.5 ? rlx : rrx;
      const py = px === rlx ? rly : rry;
      this.fx.spawn(kind, px, py, p.vx * 0.12 + (Math.random() - 0.5) * 30, p.vy * 0.12 + (Math.random() - 0.5) * 30, 0.55 + Math.random() * 0.35, 9 + Math.random() * 7);
    }
  }

  playerImpact(impact, mul, fromCop, cap = DMG.maxSingleHit) {
    const dmg = Math.min(cap, impactDamage(impact, this.carSpec.durability, mul, this.time));
    if (dmg <= 0) return 0;
    this.emit('crash', Math.min(1, impact / 380));
    if (this.hitCd > 0 && !fromCop) return 0;
    this.hitCd = DMG.hitCooldown;
    this.hurt(dmg);
    const p = this.player;
    this.fx.sparks(p.x, p.y, 8 + Math.round(dmg));
    this.cam.shake = Math.min(14, this.cam.shake + dmg * 0.5);
    this.hitFlash = Math.min(1, dmg / 25);
    return dmg;
  }

  hurt(amount) {
    if (this.god || this.giantT > 0) return;
    this.damage = Math.min(DMG.stages[3], this.damage + amount);
    if (amount >= 2) this.sinceHit = 0;
    if (this.burning) this.burnT = DMG.burnTime;
  }

  updateDamage(dt) {
    const s = damageStage(this.damage);
    if (s >= 3) {
      if (!this.burning) {
        this.burning = true;
        this.burnT = DMG.burnTime;
        this.emit('fire');
      }
      this.burnT -= dt;
      if (this.burnT > 0) {
        if (!this.god && this.giantT <= 0) this.damage += DMG.burnRate * dt;
      } else {
        this.damage = Math.max(DMG.regenFloor, this.damage - DMG.regenRate * dt);
      }
    } else if (this.burning) {
      this.burning = false;
    } else if (this.burnT < 0 && this.damage > DMG.regenFloor) {
      // Ateş söndükten sonra kurtarma alt sınırına kadar çok yavaş iner
      this.damage = Math.max(DMG.regenFloor, this.damage - DMG.regenRate * dt);
    }
    this.sinceHit += dt;
    if (this.sinceHit > DMG.idleRegenAfter && this.damage < DMG.regenFloor && this.damage > DMG.idleRegenFloor) {
      this.damage = Math.max(DMG.idleRegenFloor, this.damage - DMG.idleRegenRate * dt);
    }
    this.stage = damageStage(this.damage);

    // Hasar efektleri
    const p = this.player;
    this.damageFxT = (this.damageFxT || 0) - dt;
    if (this.stage >= 1 && this.damageFxT <= 0) {
      this.damageFxT = this.stage === 1 ? 0.14 : this.stage === 2 ? 0.05 : 0.03;
      const hx = p.x + Math.cos(p.a) * p.len * 0.3;
      const hy = p.y + Math.sin(p.a) * p.len * 0.3;
      if (this.stage === 1) this.fx.spawn(FX.SMOKE, hx, hy, p.vx * 0.2, p.vy * 0.2, 0.7, 9);
      if (this.stage >= 2) this.fx.spawn(FX.DARK, hx, hy, p.vx * 0.3, p.vy * 0.3, 0.9, 13);
      if (this.stage === 2 && Math.random() < 0.3) this.fx.sparks(hx, hy, 1);
      if (this.stage >= 3) this.fx.spawn(FX.FIRE, hx + (Math.random() - 0.5) * 12, hy + (Math.random() - 0.5) * 12, p.vx * 0.5, p.vy * 0.5, 0.36, 8);
    }

    if (this.damage >= DMG.stages[3]) this.explodePlayer();
  }

  explodePlayer() {
    if (this.state !== 'play') return;
    const p = this.player;
    this.state = 'dying';
    this.dyingT = DMG.dyingTime;
    this.stage = 4;
    this.fx.explosion(p.x, p.y, 110);
    this.fx.debris(p.x, p.y, this.carSpec.color, 18, 340);
    this.fx.debris(p.x, p.y, '#2b2b33', 12, 280);
    this.cam.shake = 26;
    this.hitFlash = 1;
    this.emit('explosion', 1);
  }

  finish() {
    this.state = 'over';
    if (this.giantT > 0) this.setGiant(false);
    const earned = this.coins + Math.floor(this.runTime / SC.coinPerSeconds) + this.kills;
    this.result = {
      score: Math.floor(this.score),
      time: this.time,
      coins: earned,
      kills: this.kills,
      broken: this.broken,
      driftTime: this.driftTime,
      nearMisses: this.nearMisses,
    };
    this.emit('gameover');
  }

  // --- Çarpışma ---
  collideWorld(b, isPlayer) {
    let best = 0;
    const off = b.len * 0.27;
    const r = b.wid * 0.5;
    for (let i = 0; i < 2; i++) {
      const sign = i === 0 ? 1 : -1;
      const cx = b.x + Math.cos(b.a) * off * sign;
      const cy = b.y + Math.sin(b.a) * off * sign;
      if (!this.world.circleHit(cx, cy, r, hit)) continue;
      const rect = hit.rect;
      if (b.crusher && !isWaterRect(rect)) {
        this.crushRect(hit.chunk, rect);
        continue;
      }
      b.x += hit.nx * hit.depth;
      b.y += hit.ny * hit.depth;
      const impact = bounceOff(b, hit.nx, hit.ny);
      if (impact > best) best = impact;
      if (impact > 60) {
        const px = cx - hit.nx * r;
        const py = cy - hit.ny * r;
        if (isWaterRect(rect)) {
          this.fx.burst(FX.WATER, px, py, 8, 170, 0.5, 8);
          if (isPlayer) this.emit('splash');
        } else {
          this.fx.sparks(px, py, Math.round(impact / 40), hit.nx, hit.ny);
        }
      }
    }
    return best;
  }

  crushRect(chunk, rect) {
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    this.fx.debris(cx, cy, rect.color || '#999', 14, 260);
    this.fx.burst(FX.DUST, cx, cy, 14, 120, 1.1, 26);
    this.cam.shake = Math.min(10, this.cam.shake + 3);
    this.world.crush(chunk, rect);
    this.emit('crush');
  }

  collideProps(b, isPlayer) {
    const world = this.world;
    const reach = 60;
    const c0x = Math.floor((b.x - reach) / CHUNK);
    const c1x = Math.floor((b.x + reach) / CHUNK);
    const c0y = Math.floor((b.y - reach) / CHUNK);
    const c1y = Math.floor((b.y + reach) / CHUNK);
    const R = b.len * 0.42;
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = world.chunk(cx, cy);
        for (let i = 0; i < c.propCount; i++) {
          const pr = c.props[i];
          if (!pr.alive) continue;
          const dx = pr.x - b.x;
          const dy = pr.y - b.y;
          if (dx > 90 || dx < -90 || dy > 90 || dy < -90) continue;
          if (isPower(pr.kind)) {
            if (isPlayer && dx * dx + dy * dy < (40 + R) * (40 + R)) {
              pr.alive = false;
              this.takePower(powerName(pr.kind), pr.x, pr.y);
            }
            continue;
          }
          if (pr.kind === PROP.COIN) {
            if (!isPlayer) continue;
            const m = CONFIG.coin.magnet;
            if (dx * dx + dy * dy < m * m) {
              pr.alive = false;
              this.coins++;
              this.fx.burst(FX.GLINT, pr.x, pr.y, 6, 110, 0.4, 5);
              this.emit('coin');
            }
            continue;
          }
          const info = PROP_INFO[pr.kind];
          const rr = info.r + R;
          const d2 = dx * dx + dy * dy;
          if (d2 >= rr * rr) continue;
          const speed = Math.hypot(b.vx, b.vy);
          if (speed >= info.brk || b.crusher || b.breaker || (isPlayer && this.giantT > 0)) {
            this.breakProp(b, pr, info, isPlayer);
          } else {
            // Yavaş temas: katı engel gibi it
            const d = Math.sqrt(d2) || 1;
            const nx = -dx / d;
            const ny = -dy / d;
            b.x += nx * (rr - d);
            b.y += ny * (rr - d);
            bounceOff(b, nx, ny);
          }
        }
      }
    }
  }

  breakProp(b, pr, info, isPlayer) {
    pr.alive = false;
    const keep = 1 - info.drag / (b.mass || 1);
    b.vx *= keep;
    b.vy *= keep;
    this.fx.debris(pr.x, pr.y, info.chip, pr.kind === PROP.PARKED ? 16 : 8);
    if (pr.kind === PROP.PARKED) this.fx.sparks(pr.x, pr.y, 10);
    if (!isPlayer) return;
    this.broken++;
    this.addScore(SC.prop, pr.x, pr.y);
    if (info.dmg > 0) this.hurt(info.dmg / this.carSpec.durability);
    this.emit('break', info.drag);
    if (info.coin && Math.random() < CONFIG.coin.dropChance) {
      this.world.dropCoin(pr.x + (Math.random() - 0.5) * 30, pr.y + (Math.random() - 0.5) * 30);
    }
  }

  // Araba-araba: 2x2 daire içinden en derin çift
  collideCars(a, b) {
    const ao = a.len * 0.27;
    const bo = b.len * 0.27;
    const ar = a.wid * 0.5;
    const br = b.wid * 0.5;
    const acx = Math.cos(a.a) * ao;
    const acy = Math.sin(a.a) * ao;
    const bcx = Math.cos(b.a) * bo;
    const bcy = Math.sin(b.a) * bo;
    let bestD = 0;
    let nx = 0;
    let ny = 0;
    const sum = ar + br;
    for (let i = -1; i <= 1; i += 2) {
      for (let j = -1; j <= 1; j += 2) {
        const dx = b.x + bcx * j - (a.x + acx * i);
        const dy = b.y + bcy * j - (a.y + acy * i);
        const d2 = dx * dx + dy * dy;
        if (d2 >= sum * sum) continue;
        const d = Math.sqrt(d2) || 0.01;
        const pen = sum - d;
        if (pen > bestD) { bestD = pen; nx = dx / d; ny = dy / d; }
      }
    }
    if (bestD <= 0) return 0;
    const ma = a.staticBody ? 1e6 : a.mass;
    const mb = b.staticBody ? 1e6 : b.mass;
    const ia = 1 / ma;
    const ib = 1 / mb;
    const k = bestD / (ia + ib);
    a.x -= nx * k * ia;
    a.y -= ny * k * ia;
    b.x += nx * k * ib;
    b.y += ny * k * ib;
    const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
    if (rv >= 0) return 0.001;
    const j = (-(1 + 0.25) * rv) / (ia + ib);
    a.vx -= j * nx * ia;
    a.vy -= j * ny * ia;
    b.vx += j * nx * ib;
    b.vy += j * ny * ib;
    return -rv;
  }

  // --- Polis ---
  spawnCop(type, role, x, y, a) {
    const spec = CONFIG.police[type];
    const c = this.copPool.pop() || makeCop();
    const d = this.diff;
    resetBody(c, x, y, a, { ...spec, grip: spec.grip });
    c.id = this.nextId++;
    c.type = type;
    c.spec = spec;
    c.role = role;
    c.state = 'chase';
    c.crusher = type === 'tank';
    c.wanderT = 0;
    c.staticBody = false;
    // Polis son hızı her zaman oyuncu arabasına oranlıdır, yani hep biraz yavaştır
    c.drive.maxSpeed = this.carSpec.maxSpeed * spec.speed;
    c.drive.accel = spec.accel;
    c.drive.turnRate = spec.turnRate;
    c.drive.grip = spec.grip;
    c.drive.driftGrip = spec.driftGrip;
    c.maxHp = spec.hp * d.hpMul;
    c.hp = c.maxHp;
    c.power = d.power;
    c.ctlS = 0; c.ctlT = 1; c.stuckT = 0; c.reverseT = 0; c.reverses = 0;
    c.los = false; c.hitCd = 0; c.nearCd = 0; c.wakeT = 0;
    c.turret = a; c.fireT = TK.fireEvery * 0.6; c.fxT = Math.random() * 3; c.hurtFlash = 0;
    this.cops.push(c);
    return c;
  }

  removeCop(i) {
    const c = this.cops[i];
    this.cops[i] = this.cops[this.cops.length - 1];
    this.cops.pop();
    this.copPool.push(c);
  }

  destroyCop(i, byPlayer) {
    const c = this.cops[i];
    const size = c.type === 'tank' ? 120 : c.type === 'swat' ? 70 : 52;
    this.fx.explosion(c.x, c.y, size);
    this.fx.debris(c.x, c.y, c.type === 'tank' ? '#5d6b3a' : '#2f4c8a', 12, 280);
    this.fx.debris(c.x, c.y, '#f4f4f4', 6, 240);
    this.kills++;
    this.addScore(SC.kill * (c.type === 'tank' ? 8 : c.type === 'swat' ? 2 : 1), c.x, c.y, byPlayer ? SC.comboKillStep : 0);
    if (Math.random() < 0.6) this.world.dropCoin(c.x, c.y);
    const near = Math.hypot(c.x - this.player.x, c.y - this.player.y) < 500;
    this.emit('copdown', near ? 1 : 0.4);
    if (near) this.cam.shake = Math.min(12, this.cam.shake + 5);
    this.removeCop(i);
  }

  updateFlow(dt) {
    this.flowT -= dt;
    if (this.flowT <= 0) {
      this.flowT = AI.flowInterval;
      this.flow.compute(this.world, this.player.x, this.player.y);
      this.flowReady = true;
    }
  }

  viewRadius() {
    return Math.hypot(this.cam.halfW, this.cam.halfH);
  }

  onScreen(x, y, m) {
    const c = this.cam;
    return Math.abs(x - c.x) < c.halfW + m && Math.abs(y - c.y) < c.halfH + m;
  }

  updateCops(dt) {
    const p = this.player;
    const world = this.world;
    let nearest = 1e9;
    let closing = 0;
    const sirens = this.sirens;
    sirens.wail = 1e9; sirens.yelp = 1e9; sirens.hilo = 1e9; sirens.chirp = 1e9;
    const playing = this.state === 'play';

    for (let i = this.cops.length - 1; i >= 0; i--) {
      const c = this.cops[i];
      const dx = p.x - c.x;
      const dy = p.y - c.y;
      const dist = Math.hypot(dx, dy);

      // Çok uzaktaki silinir, yöneten yakında yenisini doğurur
      if (dist > AI.despawnDist && !this.onScreen(c.x, c.y, 80)) {
        this.removeCop(i);
        continue;
      }
      driveCop(c, this, dt);
      if (c.hitCd > 0) c.hitCd -= dt;
      if (c.nearCd > 0) c.nearCd -= dt;
      c.fxT += dt;

      if (c.state === 'barricade') {
        c.staticBody = true;
      } else {
        c.staticBody = false;
        const surf = CONFIG.surfaces[world.groundAt(c.x, c.y)];
        stepCar(c, c.ctlS, c.ctlT, c.drive, surf, dt);
        const impact = this.collideWorld(c, false);
        if (impact > AI.wallMinImpact) {
          c.hp -= (impact - AI.wallMinImpact) * AI.wallDamage * (40 / Math.max(40, c.spec.hp * 0.5));
          c.hurtFlash = 0.3;
        }
        // Nesne taraması ekran çevresinde ve kare atlayarak: telefonda yük azalır
        if ((this.tickCount + c.id) % 3 === 0 && this.onScreen(c.x, c.y, 160)) this.collideProps(c, false);
      }

      if (c.hurtFlash > 0) c.hurtFlash -= dt;
      if (c.hp < c.maxHp * 0.5 && Math.random() < 0.25 && this.onScreen(c.x, c.y, 60)) {
        this.fx.spawn(c.hp < c.maxHp * 0.25 ? FX.DARK : FX.SMOKE, c.x, c.y, c.vx * 0.2, c.vy * 0.2, 0.7, 11);
      }
      if (c.hp <= 0) { this.destroyCop(i, false); continue; }

      if (playing) {
        // Oyuncu ile çarpışma
        if (dist < (c.len + p.len) * 0.75 && this.ghostT <= 0) {
          const rv = this.collideCars(p, c);
          if (rv > 1) this.copContact(c, rv, i);
          if (i >= this.cops.length || this.cops[i] !== c) continue;
        }
        // Yakın kaçış
        if (this.ghostT <= 0 && c.nearCd <= 0 && c.hitCd <= 0 && dist < SC.nearMissDist + c.wid * 0.5 && c.state === 'chase') {
          const rvx = p.vx - c.vx;
          const rvy = p.vy - c.vy;
          const rel = Math.hypot(rvx, rvy);
          if (rel > SC.nearMissSpeed && dist > (c.wid + p.wid) * 0.55 && rvx * -dx + rvy * -dy > 0) {
            c.nearCd = 2.5;
            this.nearMisses++;
            this.addScore(SC.nearMiss, p.x, p.y - 30, SC.comboNearStep, '#7af6ff');
            this.emit('nearmiss');
          }
        }
        if (dist < nearest) {
          nearest = dist;
          closing = (dx * (c.vx - p.vx) + dy * (c.vy - p.vy)) / (dist || 1);
        }
        const sk = c.spec.siren;
        if (sk && dist < sirens[sk]) sirens[sk] = dist;
        if (c.type === 'tank' && this.ghostT <= 0) this.tankFire(c, dist, dt);
      }
    }

    // Polisler birbirinin içinden geçmez
    const cops = this.cops;
    for (let i = 0; i < cops.length; i++) {
      for (let j = i + 1; j < cops.length; j++) {
        const a = cops[i];
        const b = cops[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const r = (a.len + b.len) * 0.6;
        if (dx * dx + dy * dy < r * r) this.collideCars(a, b);
      }
    }
    this.sirenDist = nearest;
    this.sirenClosing = closing;
  }

  copContact(c, rv) {
    const p = this.player;
    if (c.hitCd > 0) return;
    c.hitCd = 0.5;
    const spec = c.spec;
    if (this.giantT > 0) {
      // Dev mod: polisi ezer, hasar almaz
      c.hp -= c.type === 'tank' ? PW.giantCrushTank : 1e6;
      this.fx.sparks(c.x, c.y, 14);
      this.cam.shake = Math.min(12, this.cam.shake + 4);
      return;
    }
    const mul = spec.ram * c.power * Math.min(2, Math.sqrt(spec.mass / this.carSpec.mass));
    this.playerImpact(rv + 40, mul * DMG.copScale, true, DMG.maxCopHit * spec.ram * c.power);
    // Oyuncu ne kadar ağır ve hızlıysa polise o kadar vurur. Ağır araçlara az işler.
    const force = (rv * AI.ramDamage * this.carSpec.mass) / Math.max(1, spec.mass * 0.75);
    c.hp -= force;
    c.hurtFlash = 0.3;
    this.fx.sparks((p.x + c.x) / 2, (p.y + c.y) / 2, 10);
    // PIT: gelişmiş kıstırıcı yandan vurursa oyuncunun kuyruğu savrulur
    if (c.role === 'flanker' && c.type === 'advanced') {
      const fx = Math.cos(p.a);
      const fy = Math.sin(p.a);
      const side = (c.x - p.x) * -fy + (c.y - p.y) * fx;
      p.w += (side > 0 ? -1 : 1) * AI.pitYaw;
      p.grip *= 0.5;
    }
  }

  // --- Yönetmen: doğma, barikat, tank ---
  countType(type) {
    let n = 0;
    for (const c of this.cops) if (c.type === type) n++;
    return n;
  }

  pickType(r) {
    const d = this.diff;
    let s = d.advancedShare;
    if (r < s) return 'advanced';
    s += d.swatShare;
    if (r < s) return 'swat';
    s += d.fastShare;
    if (r < s) return 'fast';
    s += d.motoShare;
    if (r < s) return 'moto';
    return 'car';
  }

  // Ekran dışı yol karosu bulur; akış alanında ulaşılabilir olmalı
  findSpawn(out, minR, maxR, bias) {
    const p = this.player;
    const heading = Math.atan2(p.vy, p.vx);
    for (let i = 0; i < 16; i++) {
      const spread = bias ? (Math.random() - 0.5) * 2.2 : Math.random() * 6.283;
      const a = bias ? heading + spread : spread;
      const r = minR + Math.random() * (maxR - minR);
      const x = p.x + Math.cos(a) * r;
      const y = p.y + Math.sin(a) * r;
      if (this.world.groundAt(x, y) !== GROUND.ROAD) continue;
      const tx = (Math.floor(x / TILE) + 0.5) * TILE;
      const ty = (Math.floor(y / TILE) + 0.5) * TILE;
      if (this.world.blockedAt(tx, ty)) continue;
      if (this.onScreen(tx, ty, 70)) continue;
      out.x = tx;
      out.y = ty;
      return true;
    }
    return false;
  }

  director(dt) {
    const d = this.diff;
    const p = this.player;
    if (this.runTime < Math.min(D.firstSpawnAt, this.time < D.swatAt ? D.firstSpawnAt : 2)) return;
    this.spawnT -= dt;
    const active = this.cops.length;
    if (this.spawnT <= 0 && active < d.maxPolice) {
      const min = this.viewRadius() + AI.viewMargin;
      if (this.findSpawn(spawnPt, min, min + AI.spawnExtra, Math.random() < 0.5)) {
        const type = this.pickType(Math.random());
        const role = Math.random() < d.flankerShare ? 'flanker' : 'chaser';
        this.spawnCop(type, role, spawnPt.x, spawnPt.y, Math.atan2(p.y - spawnPt.y, p.x - spawnPt.x));
        this.spawnT = d.spawnInterval;
      } else {
        this.spawnT = 0.25;
      }
    }

    if (d.tanks > 0) {
      this.tankT -= dt;
      if (this.tankT <= 0 && this.countType('tank') < d.tanks && active < D.maxActive) {
        const min = this.viewRadius() + 200;
        if (this.findSpawn(spawnPt, min, min + 500, true)) {
          this.spawnCop('tank', 'chaser', spawnPt.x, spawnPt.y, Math.atan2(p.y - spawnPt.y, p.x - spawnPt.x));
          this.tankT = D.tankInterval;
          this.emit('tankspawn');
        } else {
          this.tankT = 0.5;
        }
      }
    }

    if (d.barricadeEvery < Infinity && this.ghostT <= 0) {
      this.barricadeT -= dt;
      if (this.barricadeT <= 0) {
        this.barricadeT = this.placeBarricade() ? d.barricadeEvery : 1.5;
      }
    }
  }

  // Oyuncunun önündeki yolu tespit eder, yan yana arabalarla kapatır, boşluk bırakır
  placeBarricade() {
    const p = this.player;
    if (p.speed < 120 || this.cops.length >= D.maxActive - 2) return false;
    const dist = this.viewRadius() + BAR.distAhead;
    const hx = p.vx / p.speed;
    const hy = p.vy / p.speed;
    const px = p.x + hx * dist;
    const py = p.y + hy * dist;
    const world = this.world;
    if (world.groundAt(px, py) !== GROUND.ROAD) return false;

    // Yol ekseni gidiş yönündedir; enine tarayıp kenarları bul
    const horizontal = Math.abs(hx) > Math.abs(hy);
    const cxd = horizontal ? 0 : 1;
    const cyd = horizontal ? 1 : 0;
    const road = (x, y) => world.groundAt(x, y) === GROUND.ROAD && !world.blockedAt(x, y);
    const stepMax = 7;
    let a = 0;
    while (a < stepMax && road(px - cxd * (a + 1) * 20, py - cyd * (a + 1) * 20)) a++;
    let b = 0;
    while (b < stepMax && road(px + cxd * (b + 1) * 20, py + cyd * (b + 1) * 20)) b++;
    const roadW = (a + b) * 20 + 20;
    const ox = px - cxd * (a * 20 + 10);
    const oy = py - cyd * (a * 20 + 10);

    const wantSpike = this.time >= BAR.spikeFrom && Math.random() < BAR.spikeChance;
    planBarricade(roadW, BAR.minGap, 46, wantSpike, Math.random, plan);
    if (plan.count === 0) return false;

    const crossAngle = Math.atan2(cyd, cxd);
    for (let i = 0; i < plan.count; i++) {
      const s = plan.slots[i];
      const c = this.spawnCop('car', 'chaser', ox + cxd * s, oy + cyd * s, crossAngle);
      c.state = 'barricade';
      c.staticBody = true;
      c.wakeT = BAR.wakeTime;
    }
    if (plan.spikeTo > plan.spikeFrom) {
      const s = this.spikes.find((k) => !k.alive);
      if (s) {
        const mid = (plan.spikeFrom + plan.spikeTo) / 2;
        s.alive = true; s.used = false;
        s.x = ox + cxd * mid; s.y = oy + cyd * mid;
        s.a = crossAngle; s.len = plan.spikeTo - plan.spikeFrom;
      }
    }
    this.emit('barricade');
    return true;
  }

  updateSpikes() {
    const p = this.player;
    for (const s of this.spikes) {
      if (!s.alive) continue;
      const dx = p.x - s.x;
      const dy = p.y - s.y;
      if (dx * dx + dy * dy > 2800 * 2800) { s.alive = false; continue; }
      if (s.used) continue;
      const along = dx * Math.cos(s.a) + dy * Math.sin(s.a);
      const across = -dx * Math.sin(s.a) + dy * Math.cos(s.a);
      if (Math.abs(along) < s.len / 2 + p.wid * 0.4 && Math.abs(across) < 16 + p.len * 0.3) {
        s.used = true;
        p.flat = BAR.flatTime;
        this.hurt(BAR.spikeDamage / this.carSpec.durability);
        this.fx.sparks(s.x, s.y, 10);
        this.emit('spike');
      }
    }
  }

  tankFire(c, dist, dt) {
    c.fireT -= dt;
    if (c.fireT > 0 || dist > TK.range) return;
    const s = this.shots.find((k) => !k.alive);
    if (!s) return;
    const p = this.player;
    c.fireT = TK.fireEvery;
    s.alive = true;
    s.t = 0;
    s.x = p.x + p.vx * TK.lead;
    s.y = p.y + p.vy * TK.lead;
    const mx = c.x + Math.cos(c.turret) * 62;
    const my = c.y + Math.sin(c.turret) * 62;
    this.fx.burst(FX.FIRE, mx, my, 8, 100, 0.25, 14);
    this.fx.burst(FX.DARK, mx, my, 5, 60, 0.7, 16);
    this.emit('tankfire');
  }

  updateShots(dt) {
    for (const s of this.shots) {
      if (!s.alive) continue;
      s.t += dt;
      if (s.t < TK.warnTime) continue;
      s.alive = false;
      this.fx.explosion(s.x, s.y, 90);
      this.emit('tankhit', Math.min(1, 700 / (Math.hypot(s.x - this.player.x, s.y - this.player.y) + 200)));
      this.cam.shake = Math.min(16, this.cam.shake + 8);
      const p = this.player;
      const d = Math.hypot(p.x - s.x, p.y - s.y);
      if (this.state === 'play' && d < TK.radius) {
        const amount = (TK.damage * (1 - (0.5 * d) / TK.radius)) / this.carSpec.durability;
        this.hurt(amount);
        this.hitFlash = 1;
        const k = 260 / (d + 40);
        p.vx += ((p.x - s.x) / (d + 1)) * k * 40;
        p.vy += ((p.y - s.y) / (d + 1)) * k * 40;
      }
      for (let i = this.cops.length - 1; i >= 0; i--) {
        const c = this.cops[i];
        if (c.type === 'tank') continue;
        if (Math.hypot(c.x - s.x, c.y - s.y) < TK.radius) c.hp -= 60;
      }
      // Düştüğü bina yıkılır
      const tx = Math.floor(s.x / TILE);
      const ty = Math.floor(s.y / TILE);
      if (this.world.costAtTile(tx, ty) === 0 && this.world.circleHit(s.x, s.y, 8, hit) && !isWaterRect(hit.rect)) {
        this.crushRect(hit.chunk, hit.rect);
      }
    }
  }

  // --- Özel güçler ---
  updatePowers(dt) {
    if (this.ghostT > 0) {
      this.ghostT -= dt;
      if (this.ghostT <= 0) { this.ghostT = 0; this.emit('powerend'); }
    }
    if (this.giantT > 0) {
      this.giantT -= dt;
      if (this.giantT <= 0) { this.giantT = 0; this.setGiant(false); this.emit('powerend'); }
    }
    this.powerT -= dt;
    if (this.powerT <= 0) {
      const min = this.viewRadius() * 0.9;
      if (this.findSpawn(spawnPt, min, min + 500, true)) {
        const w = PW.weights;
        let r = Math.random() * (w.blast + w.ghost + w.heal + w.giant);
        let i = 0;
        for (const k of POWER_KINDS) {
          r -= w[k];
          if (r < 0) break;
          i++;
        }
        this.world.addPower(spawnPt.x, spawnPt.y, PROP.POWER_BLAST + Math.min(3, i));
        this.powerT = PW.spawnEvery;
      } else {
        this.powerT = 1;
      }
    }
  }

  takePower(name, x, y) {
    this.powersTaken++;
    const p = this.player;
    this.fx.burst(FX.GLINT, x, y, 16, 220, 0.6, 7);
    this.fx.wave(x, y, 120);
    this.emit('power', name);
    if (name === 'blast') this.blast();
    else if (name === 'heal') {
      this.damage = Math.max(0, this.damage - PW.healAmount);
      this.burning = false;
      this.burnT = 0;
      this.sinceHit = 0;
      this.fx.float(p.x, p.y - 34, 'CAN +', '#2fd872');
    } else if (name === 'ghost') {
      this.ghostT = PW.duration;
      this.fx.float(p.x, p.y - 34, 'GÖRÜNMEZ', '#a07bff');
    } else if (name === 'giant') {
      this.giantT = PW.duration;
      this.setGiant(true);
      this.fx.float(p.x, p.y - 34, 'DEV MOD', '#ffd23f');
    }
  }

  setGiant(on) {
    const p = this.player;
    const s = this.carSpec;
    const k = on ? PW.giantScale : 1;
    p.len = s.len * k;
    p.wid = s.wid * k;
    p.mass = s.mass * (on ? PW.giantMass : 1);
  }

  // Patlama: çevredeki tüm polis ve sivil araçlar patlar; tank ağır hasar alır
  blast() {
    const p = this.player;
    const R = PW.blastRadius;
    this.fx.explosion(p.x, p.y, 150);
    this.fx.wave(p.x, p.y, R);
    this.emit('explosion', 0.9);
    for (let i = this.cops.length - 1; i >= 0; i--) {
      const c = this.cops[i];
      if (Math.hypot(c.x - p.x, c.y - p.y) > R) continue;
      if (c.type === 'tank') {
        c.hp -= PW.blastTankDamage;
        c.hurtFlash = 0.5;
        if (c.hp > 0) continue;
      }
      this.destroyCop(i, true);
    }
    this.crowd.blast(p.x, p.y, R);
  }

  // --- Skor ---
  addScore(base, x, y, comboStep = 0, color = '#ffe14d') {
    const amount = Math.round(base * this.combo);
    this.score += amount;
    if (comboStep > 0) this.bumpCombo(comboStep);
    if (x !== undefined && base >= 50) this.fx.float(x, y - 20, `+${amount}`, color);
  }

  bumpCombo(step) {
    this.combo = Math.min(SC.comboMax, this.combo + step);
    this.comboT = SC.comboTime;
  }

  updateScore(dt) {
    this.score += SC.perSecond * dt;
    const p = this.player;
    if (p.drifting) {
      this.driftTime += dt;
      this.score += SC.driftPerSecond * this.combo * dt;
      this.bumpCombo(SC.comboDriftStep * dt);
    }
    if (this.comboT > 0) {
      this.comboT -= dt;
      if (this.comboT <= 0) this.combo = 1;
    }
  }

  // --- Kamera ---
  updateCamera(dt) {
    const c = this.cam;
    const p = this.player;
    const V = CONFIG.camera;
    const top = this.carSpec.maxSpeed;
    const speedK = Math.min(1, p.speed / top);
    const z = (1 - V.zoomOut * speedK) * (this.giantT > 0 ? 0.82 : 1);
    c.zoom += (z - c.zoom) * (1 - Math.exp(-V.zoomRate * dt));
    const base = Math.sqrt(this.view.w * this.view.h) / V.viewArea;
    c.scale = base * c.zoom;
    c.halfW = this.view.w / 2 / c.scale;
    c.halfH = this.view.h / 2 / c.scale;
    const tx = p.x + p.vx * V.lookAhead;
    // Menüde araba üst tarafta, düğmelerin arkasında kalmasın
    const ty = p.y + p.vy * V.lookAhead + (this.state === 'attract' ? c.halfH * 0.6 : 0);
    const k = 1 - Math.exp(-V.follow * dt);
    c.x += (tx - c.x) * k;
    c.y += (ty - c.y) * k;
    if (c.shake > 0.05) {
      c.sx = (Math.random() - 0.5) * c.shake * 2;
      c.sy = (Math.random() - 0.5) * c.shake * 2;
      c.shake *= Math.exp(-V.shakeDecay * dt);
    } else {
      c.sx = 0;
      c.sy = 0;
      c.shake = 0;
    }
  }
}



// --- art.js ---
// Koddan üretilen çizimler: lüks araba, polis çeşitleri, sivil araçlar, yayalar, güçler, binalar.
// Tüm araçlar burun +x yönünde çizilir.

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

function wheel(g, x, y, w, h) {
  g.fillStyle = '#0f0f13';
  rr(g, x - w / 2, y - h / 2, w, h, 1.6);
  g.fill();
  g.fillStyle = '#c9d2dc'; // Jant
  rr(g, x - w * 0.3, y - h * 0.26, w * 0.6, h * 0.52, 1);
  g.fill();
  g.fillStyle = '#6d7782';
  g.fillRect(x - 0.5, y - h * 0.26, 1, h * 0.52);
  g.fillRect(x - w * 0.18, y - h * 0.26, 1, h * 0.52);
  g.fillRect(x + w * 0.16, y - h * 0.26, 1, h * 0.52);
}

// Alçak, aerodinamik lüks spor araba
function paintLux(g, len, wid, body, accent) {
  const L = len / 2;
  const H = wid / 2;
  for (const [x, y] of [[L * 0.56, -H], [L * 0.56, H], [-L * 0.56, -H - 0.4], [-L * 0.56, H + 0.4]]) wheel(g, x, y, 11, 5.4);

  // Gövde: burun sivri, beller içe kavisli, kalça geniş
  const outline = () => {
    g.beginPath();
    g.moveTo(L, -H * 0.42);
    g.quadraticCurveTo(L + 0.6, 0, L, H * 0.42);
    g.bezierCurveTo(L * 0.84, H * 0.92, L * 0.5, H * 1.02, L * 0.3, H * 0.94);
    g.bezierCurveTo(L * 0.05, H * 0.82, -L * 0.2, H * 0.84, -L * 0.42, H);
    g.bezierCurveTo(-L * 0.74, H * 1.08, -L * 0.98, H * 0.92, -L, H * 0.6);
    g.lineTo(-L, -H * 0.6);
    g.bezierCurveTo(-L * 0.98, -H * 0.92, -L * 0.74, -H * 1.08, -L * 0.42, -H);
    g.bezierCurveTo(-L * 0.2, -H * 0.84, L * 0.05, -H * 0.82, L * 0.3, -H * 0.94);
    g.bezierCurveTo(L * 0.5, -H * 1.02, L * 0.84, -H * 0.92, L, -H * 0.42);
    g.closePath();
  };
  const paint = g.createLinearGradient(0, -H, 0, H);
  paint.addColorStop(0, shade(body, 0.42));
  paint.addColorStop(0.3, body);
  paint.addColorStop(0.72, shade(body, -0.12));
  paint.addColorStop(1, shade(body, -0.5));
  outline();
  g.fillStyle = paint;
  g.fill();
  g.strokeStyle = 'rgba(0,0,0,.6)';
  g.lineWidth = 0.7;
  g.stroke();

  // Kaput hatları ve hava girişleri
  g.strokeStyle = 'rgba(0,0,0,.28)';
  g.lineWidth = 0.6;
  g.beginPath();
  g.moveTo(L * 0.92, -H * 0.42); g.quadraticCurveTo(L * 0.6, -H * 0.62, L * 0.36, -H * 0.58);
  g.moveTo(L * 0.92, H * 0.42); g.quadraticCurveTo(L * 0.6, H * 0.62, L * 0.36, H * 0.58);
  g.stroke();
  g.fillStyle = 'rgba(0,0,0,.5)';
  rr(g, L * 0.56, -H * 0.3, L * 0.16, H * 0.2, 0.6); g.fill();
  rr(g, L * 0.56, H * 0.1, L * 0.16, H * 0.2, 0.6); g.fill();
  // Yarış şeritleri
  g.fillStyle = accent;
  g.globalAlpha = 0.9;
  g.fillRect(-L * 0.96, -H * 0.2, L * 0.34, H * 0.12);
  g.fillRect(-L * 0.96, H * 0.08, L * 0.34, H * 0.12);
  g.fillRect(L * 0.34, -H * 0.2, L * 0.6, H * 0.12);
  g.fillRect(L * 0.34, H * 0.08, L * 0.6, H * 0.12);
  g.globalAlpha = 1;

  // Kabin: damla biçimli cam
  const glass = g.createLinearGradient(L * 0.34, 0, -L * 0.5, 0);
  glass.addColorStop(0, '#9fdcff');
  glass.addColorStop(0.28, '#27425c');
  glass.addColorStop(1, '#101c2a');
  g.fillStyle = glass;
  g.beginPath();
  g.moveTo(L * 0.36, -H * 0.62);
  g.quadraticCurveTo(L * 0.46, 0, L * 0.36, H * 0.62);
  g.lineTo(-L * 0.3, H * 0.66);
  g.quadraticCurveTo(-L * 0.62, H * 0.34, -L * 0.62, 0);
  g.quadraticCurveTo(-L * 0.62, -H * 0.34, -L * 0.3, -H * 0.66);
  g.closePath();
  g.fill();
  // Tavan ve yan cam ayrımı
  g.fillStyle = paint;
  rr(g, -L * 0.34, -H * 0.42, L * 0.46, H * 0.84, 3);
  g.fill();
  g.fillStyle = 'rgba(255,255,255,.34)'; // Parlak boya yansıması
  rr(g, -L * 0.28, -H * 0.34, L * 0.34, H * 0.18, 1.5);
  g.fill();
  g.fillRect(L * 0.4, -H * 0.66, L * 0.4, 0.9);
  // Aynalar
  g.fillStyle = shade(body, -0.25);
  g.fillRect(L * 0.24, -H - 1.6, 3.2, 2.4);
  g.fillRect(L * 0.24, H - 0.8, 3.2, 2.4);
  // Farlar (LED)
  g.fillStyle = '#eaf6ff';
  g.beginPath(); g.moveTo(L - 0.4, -H * 0.42); g.lineTo(L * 0.8, -H * 0.8); g.lineTo(L * 0.72, -H * 0.66); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(L - 0.4, H * 0.42); g.lineTo(L * 0.8, H * 0.8); g.lineTo(L * 0.72, H * 0.66); g.closePath(); g.fill();
  // Spoyler ve stop çizgisi
  g.fillStyle = 'rgba(10,10,14,.92)';
  rr(g, -L * 0.9, -H * 0.86, 2.4, H * 1.72, 1);
  g.fill();
  g.fillStyle = '#ff1f2d';
  g.fillRect(-L - 0.2, -H * 0.62, 1.6, H * 1.24);
  g.fillStyle = '#ffa0a0';
  g.fillRect(-L - 0.2, -H * 0.62, 1.6, 1.6);
  g.fillRect(-L - 0.2, H * 0.62 - 1.6, 1.6, 1.6);
  // Egzozlar
  g.fillStyle = '#b6bcc4';
  g.fillRect(-L - 1.2, -H * 0.3, 1.2, 1.8);
  g.fillRect(-L - 1.2, H * 0.3 - 1.8, 1.2, 1.8);
}

// Düz gövdeli araba (park etmiş, sivil, polis tabanı)
function paintCar(g, len, wid, body, accent, style = 'plain') {
  const L = len / 2;
  const H = wid / 2;
  g.fillStyle = '#16161c';
  for (const [x, y] of [[L * 0.52, -H - 1.2], [L * 0.52, H - 3], [-L * 0.62, -H - 1.2], [-L * 0.62, H - 3]]) {
    rr(g, x - 5, y, 10, 4.2, 1.5);
    g.fill();
  }
  const grad = g.createLinearGradient(0, -H, 0, H);
  grad.addColorStop(0, shade(body, 0.28));
  grad.addColorStop(0.5, body);
  grad.addColorStop(1, shade(body, -0.28));
  g.fillStyle = grad;
  rr(g, -L, -H, len, wid, 7);
  g.fill();
  g.strokeStyle = 'rgba(0,0,0,.45)';
  g.lineWidth = 1;
  g.stroke();
  if (style === 'sport') {
    g.fillStyle = accent;
    g.fillRect(-L + 2, -2.4, len - 4, 1.8);
    g.fillRect(-L + 2, 0.6, len - 4, 1.8);
  }
  g.fillStyle = '#20303f';
  rr(g, L * 0.02, -H + 3.5, L * 0.5, wid - 7, 3);
  g.fill();
  rr(g, -L * 0.72, -H + 4, L * 0.3, wid - 8, 3);
  g.fill();
  g.fillStyle = 'rgba(160,220,255,.55)';
  g.fillRect(L * 0.3, -H + 5, 2.4, wid - 10);
  g.fillStyle = grad;
  rr(g, -L * 0.42, -H + 3.8, L * 0.44, wid - 7.6, 3);
  g.fill();
  g.fillStyle = 'rgba(255,255,255,.22)';
  rr(g, -L * 0.38, -H + 5, L * 0.36, 3, 1.5);
  g.fill();
  g.fillStyle = '#fff7c2';
  g.fillRect(L - 2.5, -H + 2.5, 2.5, 4.5);
  g.fillRect(L - 2.5, H - 7, 2.5, 4.5);
  g.fillStyle = '#ff2b2b';
  g.fillRect(-L, -H + 2.5, 2, 4.5);
  g.fillRect(-L, H - 7, 2, 4.5);
}

function lightBar(g, x, H) {
  g.fillStyle = '#ff2a3c';
  rr(g, x, -H + 2, 5, H - 2, 1.5);
  g.fill();
  g.fillStyle = '#2a66ff';
  rr(g, x, 0, 5, H - 2, 1.5);
  g.fill();
}

function paintPolice(g, spec, advanced) {
  const L = spec.len / 2;
  const H = spec.wid / 2;
  paintCar(g, spec.len, spec.wid, advanced ? '#20242f' : '#f5f7fb', '#fff');
  g.fillStyle = advanced ? '#4d7cff' : '#2356c7';
  g.fillRect(-L * 0.42, -H, L * 0.44, 3.5);
  g.fillRect(-L * 0.42, H - 3.5, L * 0.44, 3.5);
  g.fillRect(L * 0.62, -H + 2, L * 0.3, spec.wid - 4);
  lightBar(g, -L * 0.28, H);
}

// Hızlı polis: alçak spor gövde, koyu mavi
function paintPoliceFast(g, spec) {
  paintLux(g, spec.len, spec.wid, '#123a8c', '#ffffff');
  const H = spec.wid / 2;
  lightBar(g, -spec.len * 0.12, H * 0.8);
}

function paintMoto(g, spec) {
  const L = spec.len / 2;
  g.fillStyle = '#111';
  rr(g, L * 0.42, -1.8, 9, 3.6, 1.5); g.fill();
  rr(g, -L - 0.5, -2, 10, 4, 1.5); g.fill();
  g.fillStyle = '#f5f7fb';
  rr(g, -L * 0.6, -3.6, L * 1.3, 7.2, 3); g.fill();
  g.fillStyle = '#2356c7';
  g.fillRect(-L * 0.1, -3.6, L * 0.3, 7.2);
  g.strokeStyle = '#bfc6cf';
  g.lineWidth = 1.5;
  g.beginPath(); g.moveTo(L * 0.5, -5.6); g.lineTo(L * 0.5, 5.6); g.stroke();
  // Sürücü
  g.fillStyle = '#1b2436';
  g.beginPath(); g.ellipse(-1, 0, 5.2, 6, 0, 0, 7); g.fill();
  g.fillStyle = '#f2f4f8';
  g.beginPath(); g.arc(2, 0, 3.6, 0, 7); g.fill();
  g.fillStyle = '#22354f';
  g.fillRect(3.4, -2.2, 1.6, 4.4);
  g.fillStyle = '#ff2a3c'; g.fillRect(-L + 2, -3.6, 3, 3.4);
  g.fillStyle = '#2a66ff'; g.fillRect(-L + 2, 0.2, 3, 3.4);
}

function paintSwat(g, spec) {
  const L = spec.len / 2;
  const H = spec.wid / 2;
  g.fillStyle = '#101014';
  for (const [x, y] of [[L * 0.6, -H - 1.5], [L * 0.6, H - 3.5], [-L * 0.6, -H - 1.5], [-L * 0.6, H - 3.5], [0, -H - 1.5], [0, H - 3.5]]) {
    rr(g, x - 7, y, 14, 5, 1.5);
    g.fill();
  }
  g.fillStyle = '#23272f';
  rr(g, -L, -H, spec.len, spec.wid, 5);
  g.fill();
  g.fillStyle = '#343a45';
  rr(g, -L + 3, -H + 3, spec.len - 18, spec.wid - 6, 3);
  g.fill();
  g.fillStyle = '#16212b';
  rr(g, L - 14, -H + 3, 9, spec.wid - 6, 2);
  g.fill();
  g.fillStyle = '#ffd23f';
  g.fillRect(-L + 6, -2.5, spec.len - 26, 5);
  g.fillStyle = '#16161c';
  g.font = 'bold 6px sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText('SWAT', -8, 0.4);
  g.fillStyle = '#444b57';
  g.fillRect(L - 2, -H, 3, spec.wid);
  g.fillStyle = '#ff2a3c';
  g.fillRect(4, -H + 3, 5, H - 3);
  g.fillStyle = '#2a66ff';
  g.fillRect(4, 0, 5, H - 3);
}

function paintTankHull(g, spec) {
  const L = spec.len / 2;
  const H = spec.wid / 2;
  g.fillStyle = '#23261d';
  rr(g, -L, -H, spec.len, 14, 4);
  g.fill();
  rr(g, -L, H - 14, spec.len, 14, 4);
  g.fill();
  g.fillStyle = '#3a3e30';
  for (let x = -L + 3; x < L - 3; x += 7) {
    g.fillRect(x, -H + 1, 3.5, 12);
    g.fillRect(x, H - 13, 3.5, 12);
  }
  g.fillStyle = '#6d7a42';
  rr(g, -L + 4, -H + 11, spec.len - 8, spec.wid - 22, 5);
  g.fill();
  g.fillStyle = '#556131';
  g.fillRect(L - 18, -H + 13, 10, spec.wid - 26);
  g.fillRect(-L + 10, -H + 13, 12, spec.wid - 26);
  g.fillStyle = '#8c9a58';
  g.beginPath(); g.arc(-22, 12, 6, 0, 7); g.fill();
  g.beginPath(); g.arc(24, -10, 5, 0, 7); g.fill();
}

function paintTurret(g) {
  g.fillStyle = '#4c5730';
  g.fillRect(14, -3.5, 56, 7);
  g.fillStyle = '#3a4324';
  g.fillRect(62, -4.8, 10, 9.6);
  g.fillStyle = '#7a8749';
  g.beginPath(); g.arc(0, 0, 21, 0, 7); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.35)';
  g.lineWidth = 1.5;
  g.stroke();
  g.fillStyle = '#5f6b39';
  g.beginPath(); g.arc(-4, 2, 9, 0, 7); g.fill();
  g.fillStyle = '#c2d07c';
  g.beginPath(); g.arc(8, -8, 3, 0, 7); g.fill();
}

// --- Sivil araçlar ---
function paintNpc(g, kind, spec, color) {
  const L = spec.len / 2;
  const H = spec.wid / 2;
  if (kind === 'sedan') {
    paintCar(g, spec.len, spec.wid, color, color);
  } else if (kind === 'pickup') {
    paintCar(g, spec.len, spec.wid, color, color);
    g.fillStyle = shade(color, -0.35);
    rr(g, -L + 2, -H + 2.5, spec.len * 0.42, spec.wid - 5, 2); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.3)';
    g.lineWidth = 1;
    for (let x = -L + 7; x < -L + spec.len * 0.4; x += 6) { g.beginPath(); g.moveTo(x, -H + 3); g.lineTo(x, H - 3); g.stroke(); }
  } else if (kind === 'bus') {
    g.fillStyle = '#121216';
    for (const x of [L * 0.6, -L * 0.6]) { g.fillRect(x - 7, -H - 1, 14, 3); g.fillRect(x - 7, H - 2, 14, 3); }
    g.fillStyle = color;
    rr(g, -L, -H, spec.len, spec.wid, 5); g.fill();
    g.fillStyle = 'rgba(255,255,255,.24)';
    g.fillRect(-L + 4, -H + 3, spec.len - 12, 3);
    g.fillStyle = '#24384c';
    rr(g, L - 9, -H + 3, 6, spec.wid - 6, 2); g.fill();
    g.fillStyle = 'rgba(0,0,0,.2)';
    for (let x = -L + 10; x < L - 18; x += 20) { rr(g, x, -6, 11, 12, 2); g.fill(); }
    g.fillStyle = '#fff7c2';
    g.fillRect(L - 2, -H + 3, 2, 4); g.fillRect(L - 2, H - 7, 2, 4);
  } else {
    // Kamyon: kabin + römork
    g.fillStyle = '#121216';
    for (const x of [L * 0.74, L * 0.1, -L * 0.7]) { g.fillRect(x - 7, -H - 1, 14, 3); g.fillRect(x - 7, H - 2, 14, 3); }
    g.fillStyle = '#d7dbe1';
    rr(g, -L, -H, spec.len * 0.72, spec.wid, 3); g.fill();
    g.fillStyle = 'rgba(0,0,0,.08)';
    for (let x = -L + 8; x < -L + spec.len * 0.7; x += 9) g.fillRect(x, -H, 2, spec.wid);
    g.fillStyle = color;
    g.fillRect(-L + 6, -H + 5, spec.len * 0.58, 4);
    g.fillStyle = color;
    rr(g, L - spec.len * 0.24, -H + 1, spec.len * 0.24, spec.wid - 2, 5); g.fill();
    g.fillStyle = '#24384c';
    rr(g, L - 10, -H + 4, 6, spec.wid - 8, 2); g.fill();
    g.fillStyle = '#fff7c2';
    g.fillRect(L - 2, -H + 3, 2, 4); g.fillRect(L - 2, H - 7, 2, 4);
  }
}

// --- Yaya: üstten küçük insan. step: adım evresi ---
function paintPed(g, shirt, skin, hair, step) {
  const s = step ? 1 : -1;
  g.fillStyle = '#2b3140';
  g.beginPath(); g.ellipse(2.6 * s, -1.9, 1.9, 1.2, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(-2.6 * s, 1.9, 1.9, 1.2, 0, 0, 7); g.fill();
  g.fillStyle = shirt;
  g.beginPath(); g.ellipse(0, 0, 2.5, 4.3, 0, 0, 7); g.fill();
  g.fillStyle = skin;
  g.beginPath(); g.arc(-1.5 * s, -4.1, 1, 0, 7); g.fill();
  g.beginPath(); g.arc(1.5 * s, 4.1, 1, 0, 7); g.fill();
  g.beginPath(); g.arc(0, 0, 2.3, 0, 7); g.fill();
  g.fillStyle = hair;
  g.beginPath(); g.arc(-0.5, 0, 2.2, 1.57, 4.71); g.fill();
}

// --- Güç simgeleri ---
const POWER_LOOK = {
  blast: { color: '#ff7a1a', name: 'Patlama' },
  ghost: { color: '#a07bff', name: 'Görünmezlik' },
  heal: { color: '#2fd872', name: 'Can' },
  giant: { color: '#ffd23f', name: 'Dev mod' },
};

function paintPower(g, kind) {
  const col = POWER_LOOK[kind].color;
  g.fillStyle = 'rgba(0,0,0,.28)';
  g.beginPath(); g.arc(2, 3, 15, 0, 7); g.fill();
  g.fillStyle = col;
  g.beginPath(); g.arc(0, 0, 15, 0, 7); g.fill();
  g.strokeStyle = '#fff';
  g.lineWidth = 2.4;
  g.stroke();
  g.fillStyle = '#fff';
  g.strokeStyle = '#fff';
  if (kind === 'blast') {
    // Bomba
    g.fillStyle = '#1b1b22';
    g.beginPath(); g.arc(-1, 2, 7.6, 0, 7); g.fill();
    g.strokeStyle = '#1b1b22';
    g.lineWidth = 2.2;
    g.beginPath(); g.moveTo(3, -3); g.quadraticCurveTo(6, -9, 9, -7); g.stroke();
    g.fillStyle = '#fff36b';
    g.beginPath(); g.arc(9.4, -7.4, 2.5, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,.5)';
    g.beginPath(); g.arc(-3.5, -0.5, 2, 0, 7); g.fill();
  } else if (kind === 'ghost') {
    // Hayalet
    g.beginPath();
    g.moveTo(-8, 9);
    g.lineTo(-8, -1);
    g.arc(0, -1, 8, Math.PI, 0);
    g.lineTo(8, 9);
    g.lineTo(5, 6.4); g.lineTo(2.6, 9); g.lineTo(0, 6.4); g.lineTo(-2.6, 9); g.lineTo(-5, 6.4);
    g.closePath();
    g.fill();
    g.fillStyle = '#4a2fb0';
    g.beginPath(); g.arc(-3, -1.6, 1.9, 0, 7); g.arc(3, -1.6, 1.9, 0, 7); g.fill();
  } else if (kind === 'heal') {
    // Artı
    rr(g, -3.4, -9, 6.8, 18, 1.5); g.fill();
    rr(g, -9, -3.4, 18, 6.8, 1.5); g.fill();
  } else {
    // Dev mod: büyüyen ok
    g.fillStyle = '#5a3c00';
    g.beginPath();
    g.moveTo(0, -10); g.lineTo(8.6, -0.5); g.lineTo(3.6, -0.5); g.lineTo(3.6, 9.4);
    g.lineTo(-3.6, 9.4); g.lineTo(-3.6, -0.5); g.lineTo(-8.6, -0.5);
    g.closePath();
    g.fill();
  }
}

// --- Biyoma özel bina ve kuleler ---
const TALL_STYLES = new Set([BUILD.TOWER_GLASS, BUILD.TOWER_ROUND, BUILD.TOWER_STEP, BUILD.LIGHTHOUSE, BUILD.FIRETOWER, BUILD.SILO, BUILD.WINDMILL, BUILD.WATERTOWER]);

function roofWindows(g, x, y, w, h, gap, color) {
  g.fillStyle = color;
  for (let py = y; py < y + h - 2; py += gap) {
    for (let px = x; px < x + w - 2; px += gap) g.fillRect(px, py, gap - 3, gap - 3);
  }
}

function paintSpecial(g, r) {
  const { x, y, w, h, color, seed } = r;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const d = Math.min(w, h) / 2;
  const S = BUILD;
  switch (r.style) {
    case S.TOWER_GLASS: {
      const gl = g.createLinearGradient(x, y, x + w, y + h);
      gl.addColorStop(0, shade(color, 0.45));
      gl.addColorStop(0.5, color);
      gl.addColorStop(1, shade(color, -0.4));
      g.fillStyle = shade(color, -0.55);
      rr(g, x, y, w, h, 3); g.fill();
      g.fillStyle = gl;
      rr(g, x, y, w, h - 14, 3); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.3)';
      g.lineWidth = 1;
      for (let px = x + 10; px < x + w; px += 12) { g.beginPath(); g.moveTo(px, y + 2); g.lineTo(px, y + h - 16); g.stroke(); }
      for (let py = y + 10; py < y + h - 16; py += 12) { g.beginPath(); g.moveTo(x + 2, py); g.lineTo(x + w - 2, py); g.stroke(); }
      g.fillStyle = 'rgba(255,255,255,.2)';
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + w * 0.6, y); g.lineTo(x, y + (h - 14) * 0.6); g.closePath(); g.fill();
      break;
    }
    case S.TOWER_ROUND: {
      g.fillStyle = shade(color, -0.5);
      g.beginPath(); g.arc(cx, cy + 7, d, 0, 7); g.fill();
      g.fillStyle = color;
      g.beginPath(); g.arc(cx, cy, d, 0, 7); g.fill();
      for (let i = 1; i <= 3; i++) {
        g.strokeStyle = `rgba(255,255,255,${0.32 - i * 0.05})`;
        g.lineWidth = 2;
        g.beginPath(); g.arc(cx, cy, (d * i) / 4, 0, 7); g.stroke();
      }
      g.fillStyle = '#e8f3ff';
      g.beginPath(); g.arc(cx, cy, d * 0.16, 0, 7); g.fill();
      break;
    }
    case S.TOWER_STEP: {
      // Kademeli gökdelen ve anten
      g.fillStyle = shade(color, -0.5);
      rr(g, x, y, w, h, 3); g.fill();
      const steps = 3;
      for (let i = 0; i < steps; i++) {
        const m = i * Math.min(w, h) * 0.13;
        g.fillStyle = shade(color, i * 0.14 - 0.08);
        rr(g, x + m, y + m, w - m * 2, h - 12 - m * 2, 3); g.fill();
        roofWindows(g, x + m + 3, y + m + 3, w - m * 2 - 6, 4, 6, 'rgba(210,235,255,.5)');
      }
      g.strokeStyle = '#f2f2f2';
      g.lineWidth = 2;
      g.beginPath(); g.moveTo(cx - 8, cy - 12); g.lineTo(cx + 8, cy + 4); g.moveTo(cx + 8, cy - 12); g.lineTo(cx - 8, cy + 4); g.stroke();
      g.fillStyle = '#ff3b3b';
      g.beginPath(); g.arc(cx, cy - 4, 3, 0, 7); g.fill();
      break;
    }
    case S.HUT: {
      // Çizgili plaj kulübesi
      g.fillStyle = '#b08a55';
      g.fillRect(x, y + h - 9, w, 9);
      for (let i = 0; i < w; i += 12) {
        g.fillStyle = i % 24 ? '#fff4dc' : color;
        g.fillRect(x + i, y, Math.min(12, w - i), h - 9);
      }
      g.fillStyle = 'rgba(0,0,0,.12)';
      g.fillRect(x, y + (h - 9) / 2, w, (h - 9) / 2);
      break;
    }
    case S.LIFEGUARD: {
      g.fillStyle = '#d9c29a';
      g.fillRect(x + 4, y + 4, w - 8, h - 8);
      g.fillStyle = '#e8352e';
      rr(g, x, y, w, h - 10, 4); g.fill();
      g.fillStyle = '#fff';
      g.fillRect(cx - 3, y + 6, 6, h - 22);
      g.fillRect(x + 8, cy - 8, w - 16, 6);
      break;
    }
    case S.LIGHTHOUSE: {
      g.fillStyle = '#c4c8cc';
      g.beginPath(); g.arc(cx, cy, d, 0, 7); g.fill();
      for (let i = 4; i > 0; i--) {
        g.fillStyle = i % 2 ? '#e8352e' : '#fff';
        g.beginPath(); g.arc(cx, cy, (d * 0.84 * i) / 4, 0, 7); g.fill();
      }
      g.fillStyle = '#ffe98a';
      g.beginPath(); g.arc(cx, cy, d * 0.18, 0, 7); g.fill();
      break;
    }
    case S.CABIN: {
      g.fillStyle = '#5a3a22';
      rr(g, x, y, w, h, 3); g.fill();
      g.fillStyle = '#7d5230';
      rr(g, x, y, w, h - 8, 3); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.25)';
      g.lineWidth = 2;
      for (let py = y + 7; py < y + h - 10; py += 8) { g.beginPath(); g.moveTo(x + 2, py); g.lineTo(x + w - 2, py); g.stroke(); }
      g.fillStyle = 'rgba(255,255,255,.18)';
      g.fillRect(x + 3, cy - 5, w - 6, 2.5);
      g.fillStyle = '#6b6f76';
      g.fillRect(x + w * 0.7, y + 8, 11, 11);
      break;
    }
    case S.FIRETOWER: {
      g.strokeStyle = '#6a4a2c';
      g.lineWidth = 3;
      g.strokeRect(x + 6, y + 6, w - 12, h - 12);
      g.beginPath(); g.moveTo(x + 6, y + 6); g.lineTo(x + w - 6, y + h - 6); g.moveTo(x + w - 6, y + 6); g.lineTo(x + 6, y + h - 6); g.stroke();
      g.fillStyle = '#8a6a3f';
      rr(g, cx - d * 0.58, cy - d * 0.58, d * 1.16, d * 1.16, 3); g.fill();
      g.fillStyle = '#b5352a';
      g.beginPath(); g.moveTo(cx, cy - d * 0.72); g.lineTo(cx + d * 0.72, cy); g.lineTo(cx, cy + d * 0.72); g.lineTo(cx - d * 0.72, cy); g.closePath(); g.fill();
      break;
    }
    case S.ADOBE: {
      g.fillStyle = shade(color, -0.3);
      rr(g, x, y, w, h, 8); g.fill();
      g.fillStyle = color;
      rr(g, x, y, w, h - 8, 8); g.fill();
      g.strokeStyle = 'rgba(120,70,30,.3)';
      g.lineWidth = 2;
      rr(g, x + 6, y + 6, w - 12, h - 20, 5); g.stroke();
      if (seed % 2) {
        g.fillStyle = shade(color, 0.3);
        g.beginPath(); g.arc(cx, cy - 4, d * 0.42, 0, 7); g.fill();
      }
      break;
    }
    case S.MESA: {
      // Kaya platosu: katmanlı
      g.fillStyle = '#8c4f2d';
      rr(g, x, y, w, h, 14); g.fill();
      g.fillStyle = '#b36a3c';
      rr(g, x + 3, y + 2, w - 6, h - 12, 13); g.fill();
      g.fillStyle = '#cf8a54';
      rr(g, x + 14, y + 10, w - 28, h - 30, 10); g.fill();
      g.fillStyle = '#e3a874';
      rr(g, x + 28, y + 20, Math.max(8, w - 56), Math.max(8, h - 52), 8); g.fill();
      break;
    }
    case S.BARN: {
      g.fillStyle = '#7a2018';
      rr(g, x, y, w, h, 3); g.fill();
      g.fillStyle = '#b5352a';
      rr(g, x, y, w, h - 9, 3); g.fill();
      g.fillStyle = 'rgba(0,0,0,.16)';
      g.fillRect(x, y, w, (h - 9) / 2);
      g.fillStyle = '#f3ead8';
      g.fillRect(x, y + (h - 9) / 2 - 2, w, 4);
      g.strokeStyle = '#f3ead8';
      g.lineWidth = 2.5;
      g.strokeRect(cx - 10, y + h - 9, 20, 8);
      break;
    }
    case S.SILO: {
      g.fillStyle = '#88909a';
      g.beginPath(); g.arc(cx, cy + 5, d, 0, 7); g.fill();
      g.fillStyle = '#c3cad2';
      g.beginPath(); g.arc(cx, cy, d, 0, 7); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.2)';
      g.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * 6.283;
        g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * d, cy + Math.sin(a) * d); g.stroke();
      }
      g.fillStyle = '#eef2f6';
      g.beginPath(); g.arc(cx, cy, 5, 0, 7); g.fill();
      break;
    }
    case S.WINDMILL: {
      g.fillStyle = '#d9d2c2';
      g.beginPath(); g.arc(cx, cy, d * 0.62, 0, 7); g.fill();
      g.fillStyle = '#8b5a33';
      g.beginPath(); g.arc(cx, cy, d * 0.4, 0, 7); g.fill();
      g.strokeStyle = '#f7f1e3';
      g.lineWidth = 6;
      const a0 = (seed % 90) * 0.0174;
      for (let i = 0; i < 4; i++) {
        const a = a0 + (i * Math.PI) / 2;
        g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * d * 1.02, cy + Math.sin(a) * d * 1.02); g.stroke();
      }
      g.fillStyle = '#3f2a18';
      g.beginPath(); g.arc(cx, cy, 5, 0, 7); g.fill();
      break;
    }
    case S.WATERTOWER: {
      g.strokeStyle = '#6e4e33';
      g.lineWidth = 3;
      g.strokeRect(x + 7, y + 7, w - 14, h - 14);
      g.fillStyle = '#9cc6d8';
      g.beginPath(); g.arc(cx, cy, d * 0.74, 0, 7); g.fill();
      g.fillStyle = '#c8e3ee';
      g.beginPath(); g.arc(cx - 3, cy - 3, d * 0.44, 0, 7); g.fill();
      break;
    }
    default: {
      // Benzin istasyonu
      g.fillStyle = '#efefef';
      rr(g, x, y, w, h - 6, 3); g.fill();
      g.fillStyle = '#e8352e';
      g.fillRect(x, y, w, 8);
      g.fillRect(x, y + h - 14, w, 8);
      g.fillStyle = '#5c6066';
      for (let i = 0; i < 3; i++) g.fillRect(x + (w * (i + 0.5)) / 3 - 4, cy - 6, 8, 12);
    }
  }
}

// --- render.js ---
// Canvas çizimi. Sprite'lar açılışta koddan üretilir; sadece ekrandaki nesneler çizilir.

const PF = CONFIG.perf;
const SPR = 3; // Sprite ölçeği: arabalar yakın çekimde de keskin kalsın
const ART_W = CONFIG.world.arterial * TILE;
const BIOME_COLORS = {
  city: { grass: '#6cc24a', road: '#585f6b', sand: '#f2dfa4', dirt: '#b79c6c' },
  beach: { grass: '#8ecb62', road: '#666b74', sand: '#f8e6ae', dirt: '#d4b98a' },
  forest: { grass: '#3f8f44', road: '#4c4f55', sand: '#d9cf9e', dirt: '#8f6f47' },
  desert: { grass: '#d2a964', road: '#6f675d', sand: '#ecc680', dirt: '#c29655' },
  rural: { grass: '#9ccd58', road: '#5e6168', sand: '#e6d7a2', dirt: '#a98d5c' },
};

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.ceil(w);
  c.height = Math.ceil(h);
  return c;
}

function sprite(w, h, paint) {
  const c = makeCanvas(w * SPR, h * SPR);
  const g = c.getContext('2d');
  g.setTransform(SPR, 0, 0, SPR, (w * SPR) / 2, (h * SPR) / 2);
  paint(g);
  return c;
}

function glow(size, stops) {
  const c = makeCanvas(size, size);
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  for (const [o, col] of stops) grad.addColorStop(o, col);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

function carSprite(spec) {
  return sprite(spec.len + 10, spec.wid + 10, (g) => paintLux(g, spec.len, spec.wid, spec.color, spec.accent));
}

class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false });
    this.dpr = 1;
    this.w = 0;
    this.h = 0;
    this.sprites = {};
    this.canvasPool = [];
    this.bakedCount = 0;
    this.baked = [];
    this.playerSprite = null;
    this.playerId = '';
    this.makeSprites();
  }

  resize(w, h, dpr) {
    this.w = w;
    this.h = h;
    this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr);
    this.canvas.height = Math.round(h * dpr);
    this.ctx.imageSmoothingEnabled = true;
    this.vignette = null;
  }

  releaseChunk(c) {
    if (c.canvas) {
      this.canvasPool.push(c.canvas);
      c.canvas = null;
      const i = this.baked.indexOf(c);
      if (i >= 0) this.baked.splice(i, 1);
    }
  }

  makeSprites() {
    const P = CONFIG.police;
    const s = this.sprites;
    s.car = sprite(P.car.len + 8, P.car.wid + 8, (g) => paintPolice(g, P.car, false));
    s.fast = sprite(P.fast.len + 10, P.fast.wid + 10, (g) => paintPoliceFast(g, P.fast));
    s.moto = sprite(P.moto.len + 12, P.moto.wid + 14, (g) => paintMoto(g, P.moto));
    s.advanced = sprite(P.advanced.len + 8, P.advanced.wid + 8, (g) => paintPolice(g, P.advanced, true));
    s.swat = sprite(P.swat.len + 8, P.swat.wid + 8, (g) => paintSwat(g, P.swat));
    s.tank = sprite(P.tank.len + 8, P.tank.wid + 8, (g) => paintTankHull(g, P.tank));
    s.turret = sprite(150, 50, paintTurret);
    s.shadow = sprite(60, 34, (g) => {
      g.fillStyle = 'rgba(0,0,0,1)';
      rr(g, -28, -15, 56, 30, 9);
      g.fill();
    });
    s.red = glow(128, [[0, 'rgba(255,40,50,.9)'], [0.35, 'rgba(255,30,50,.35)'], [1, 'rgba(255,0,40,0)']]);
    s.blue = glow(128, [[0, 'rgba(60,110,255,.9)'], [0.35, 'rgba(40,90,255,.35)'], [1, 'rgba(0,40,255,0)']]);
    s.smoke = glow(64, [[0, 'rgba(235,235,235,.75)'], [0.6, 'rgba(220,220,220,.35)'], [1, 'rgba(210,210,210,0)']]);
    s.dark = glow(64, [[0, 'rgba(40,40,44,.9)'], [0.6, 'rgba(40,40,44,.5)'], [1, 'rgba(30,30,34,0)']]);
    s.fire = glow(64, [[0, 'rgba(255,245,190,1)'], [0.3, 'rgba(255,170,40,.9)'], [0.7, 'rgba(255,70,10,.45)'], [1, 'rgba(200,30,0,0)']]);
    s.dust = glow(64, [[0, 'rgba(205,175,125,.7)'], [1, 'rgba(205,175,125,0)']]);
    s.water = glow(64, [[0, 'rgba(235,250,255,.9)'], [1, 'rgba(180,230,255,0)']]);
    s.glint = glow(32, [[0, 'rgba(255,255,220,1)'], [0.4, 'rgba(255,215,70,.8)'], [1, 'rgba(255,200,0,0)']]);

    const prop = (w, h, paint) => sprite(w, h, paint);
    const N = CONFIG.npc;
    s.npc = {};
    for (const kind of Object.keys(N.types)) {
      const spec = N.types[kind];
      s.npc[kind] = N.colors.map((col) => sprite(spec.len + 8, spec.wid + 8, (g) => paintNpc(g, kind, spec, col)));
    }
    const LOOKS = [['#e8533f', '#e0a878', '#3b2a1e'], ['#3e7cb1', '#f0c8a0', '#6b4a2b'], ['#f2c14e', '#8d5a3a', '#16131a'], ['#4f9d69', '#e0a878', '#c9a24a'], ['#c45fbd', '#f0c8a0', '#2b2b33'], ['#ececec', '#8d5a3a', '#16131a']];
    s.peds = LOOKS.map(([a, b, c]) => [0, 1].map((step) => sprite(20, 20, (g) => paintPed(g, a, b, c, step))));
    s.props = [];
    s.props[PROP.PALM] = prop(70, 70, (g) => {
      g.fillStyle = 'rgba(0,0,0,.18)';
      g.beginPath(); g.ellipse(8, 9, 20, 18, 0, 0, 7); g.fill();
      for (let i = 0; i < 7; i++) {
        const a = (i / 7) * 6.283 + 0.3;
        g.save(); g.rotate(a);
        g.fillStyle = i % 2 ? '#4ea03a' : '#6fbc47';
        g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(13, -7.5, 25, 0); g.quadraticCurveTo(13, 6, 0, 0); g.fill();
        g.restore();
      }
      g.fillStyle = '#9a6b3f';
      g.beginPath(); g.arc(0, 0, 3.6, 0, 7); g.fill();
    });
    s.props[PROP.UMBRELLA] = prop(56, 56, (g) => {
      g.fillStyle = '#f7f1e3'; g.fillRect(9, 3, 11, 17); // Havlu
      g.fillStyle = '#3fa7d6'; g.fillRect(9, 8, 11, 4);
      g.fillStyle = 'rgba(0,0,0,.16)';
      g.beginPath(); g.arc(3, 4, 15, 0, 7); g.fill();
      for (let i = 0; i < 8; i++) {
        g.fillStyle = i % 2 ? '#fff' : '#ff5a4d';
        g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, 15, (i / 8) * 6.283, ((i + 1) / 8) * 6.283); g.fill();
      }
    });
    s.props[PROP.PINE] = prop(64, 64, (g) => {
      g.fillStyle = 'rgba(0,0,0,.24)';
      g.beginPath(); g.arc(7, 8, 20, 0, 7); g.fill();
      for (const [r, c] of [[21, '#1f5e38'], [15, '#2b7846'], [9, '#3b9558']]) {
        g.fillStyle = c;
        g.beginPath();
        for (let i = 0; i < 16; i++) {
          const a = (i / 16) * 6.283;
          const rad = i % 2 ? r : r * 0.74;
          g.lineTo(Math.cos(a) * rad, Math.sin(a) * rad);
        }
        g.closePath();
        g.fill();
      }
    });
    s.props[PROP.ROCK] = prop(44, 44, (g) => {
      g.fillStyle = 'rgba(0,0,0,.22)';
      g.beginPath(); g.ellipse(3, 4, 16, 13, 0, 0, 7); g.fill();
      g.fillStyle = '#8e8a84';
      g.beginPath(); g.moveTo(-15, 3); g.lineTo(-9, -11); g.lineTo(5, -13); g.lineTo(15, -3); g.lineTo(11, 10); g.lineTo(-7, 12); g.closePath(); g.fill();
      g.fillStyle = '#b4b0a8';
      g.beginPath(); g.moveTo(-9, -8); g.lineTo(4, -10); g.lineTo(8, -2); g.lineTo(-4, 1); g.closePath(); g.fill();
    });
    s.props[PROP.CACTUS] = prop(36, 36, (g) => {
      g.fillStyle = 'rgba(0,0,0,.2)';
      g.beginPath(); g.ellipse(4, 5, 7, 11, 0, 0, 7); g.fill();
      g.fillStyle = '#3f9a5c';
      rr(g, -3.5, -11, 7, 22, 3.5); g.fill();
      rr(g, -11, -5, 8, 5, 2.5); g.fill();
      rr(g, 3, -1, 8, 5, 2.5); g.fill();
      rr(g, -11, -10, 4.4, 9, 2.2); g.fill();
      rr(g, 7, -7, 4.4, 9, 2.2); g.fill();
      g.fillStyle = '#74c98e';
      g.fillRect(-1, -10, 1.6, 19);
    });
    s.props[PROP.HAY] = prop(34, 34, (g) => {
      g.fillStyle = 'rgba(0,0,0,.2)';
      g.beginPath(); g.arc(3, 4, 12, 0, 7); g.fill();
      g.fillStyle = '#e0c060';
      g.beginPath(); g.arc(0, 0, 12, 0, 7); g.fill();
      g.strokeStyle = '#b8922e';
      g.lineWidth = 1.6;
      for (const r of [4, 8]) { g.beginPath(); g.arc(0, 0, r, 0.4, 5.6); g.stroke(); }
    });
    s.auras = [];
    for (const [i, name] of ['blast', 'ghost', 'heal', 'giant'].entries()) {
      s.props[PROP.POWER_BLAST + i] = prop(40, 40, (g) => paintPower(g, name));
      const col = POWER_LOOK[name].color;
      s.auras[i] = glow(96, [[0, `${col}cc`], [0.55, `${col}55`], [1, `${col}00`]]);
    }
    s.props[PROP.TREE] = prop(64, 64, (g) => {
      g.fillStyle = 'rgba(0,0,0,.2)';
      g.beginPath(); g.ellipse(6, 7, 21, 19, 0, 0, 7); g.fill();
      g.fillStyle = '#3f8f35';
      g.beginPath(); g.arc(0, 0, 21, 0, 7); g.fill();
      g.fillStyle = '#58ad45';
      g.beginPath(); g.arc(-4, -4, 15, 0, 7); g.fill();
      g.fillStyle = '#7ecb5e';
      g.beginPath(); g.arc(-7, -8, 8, 0, 7); g.fill();
    });
    s.props[PROP.BUSH] = prop(36, 36, (g) => {
      g.fillStyle = 'rgba(0,0,0,.18)';
      g.beginPath(); g.ellipse(3, 4, 11, 10, 0, 0, 7); g.fill();
      g.fillStyle = '#4f9a3a';
      g.beginPath(); g.arc(0, 0, 11, 0, 7); g.fill();
      g.fillStyle = '#74bf58';
      g.beginPath(); g.arc(-3, -3, 6, 0, 7); g.fill();
    });
    s.props[PROP.FENCE] = prop(44, 14, (g) => {
      g.fillStyle = '#e8d3ac';
      g.fillRect(-20, -1.5, 40, 3);
      g.fillStyle = '#c79a5b';
      for (let x = -20; x <= 20; x += 8) g.fillRect(x - 1.5, -3.5, 3, 7);
    });
    s.props[PROP.CRATE] = prop(30, 30, (g) => {
      g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(-9, -9, 22, 22);
      g.fillStyle = '#c99656'; g.fillRect(-11, -11, 22, 22);
      g.strokeStyle = '#8a5f2f'; g.lineWidth = 2; g.strokeRect(-10, -10, 20, 20);
      g.beginPath(); g.moveTo(-10, -10); g.lineTo(10, 10); g.stroke();
    });
    s.props[PROP.BARREL] = prop(30, 30, (g) => {
      g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.arc(3, 3, 10, 0, 7); g.fill();
      g.fillStyle = '#e0562f'; g.beginPath(); g.arc(0, 0, 10, 0, 7); g.fill();
      g.strokeStyle = '#a23514'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#ffd23f'; g.fillRect(-6, -1.5, 12, 3);
    });
    s.props[PROP.CONE] = prop(20, 20, (g) => {
      g.fillStyle = '#ff8a2a'; g.fillRect(-6, -6, 12, 12);
      g.fillStyle = '#fff'; g.beginPath(); g.arc(0, 0, 4, 0, 7); g.fill();
      g.fillStyle = '#ff5e1a'; g.beginPath(); g.arc(0, 0, 2.2, 0, 7); g.fill();
    });
    s.props[PROP.BARRIER] = prop(52, 20, (g) => {
      g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(-20, -5, 44, 13);
      g.fillStyle = '#eef1f4'; rr(g, -22, -7, 44, 13, 2); g.fill();
      g.fillStyle = '#e23c3c';
      for (let x = -20; x < 20; x += 10) g.fillRect(x, -7, 5, 13);
    });
    s.props[PROP.HYDRANT] = prop(20, 20, (g) => {
      g.fillStyle = '#e23c3c'; g.beginPath(); g.arc(0, 0, 6, 0, 7); g.fill();
      g.fillStyle = '#ffd5d5'; g.beginPath(); g.arc(-1, -1, 2, 0, 7); g.fill();
    });
    s.props[PROP.BENCH] = prop(32, 16, (g) => {
      g.fillStyle = '#9a6b3f'; g.fillRect(-12, -4, 24, 8);
      g.fillStyle = '#c29465'; g.fillRect(-12, -4, 24, 2);
    });
    s.parked = ['#6a7aa0', '#b0504a', '#d6c56b', '#59a58c', '#dddddd'].map((col) => sprite(54, 32, (g) => paintCar(g, 44, 24, col, col)));
    s.coin = sprite(32, 32, (g) => {
      g.fillStyle = '#b8860b'; g.beginPath(); g.arc(0, 1, 10.5, 0, 7); g.fill();
      g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(0, 0, 10, 0, 7); g.fill();
      g.fillStyle = '#ffec8a'; g.beginPath(); g.arc(-2, -2, 6, 0, 7); g.fill();
      g.fillStyle = '#c9920f'; g.font = 'bold 12px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('₺', 0, 0.5);
    });
  }

  // --- Chunk önbelleği: zemin ve binalar bir kez çizilir ---
  getBakeCanvas() {
    const size = Math.ceil(CHUNK * PF.bakeScale);
    if (this.canvasPool.length) return this.canvasPool.pop();
    if (this.bakedCount < PF.bakePool) {
      this.bakedCount++;
      return makeCanvas(size, size);
    }
    // En uzun süredir görünmeyeni boşalt
    let old = null;
    for (const c of this.baked) if (!old || c.lastSeen < old.lastSeen) old = c;
    const canvas = old.canvas;
    old.canvas = null;
    this.baked.splice(this.baked.indexOf(old), 1);
    return canvas;
  }

  bake(c) {
    if (!c.canvas) {
      c.canvas = this.getBakeCanvas();
      this.baked.push(c);
    }
    const g = c.canvas.getContext('2d');
    const k = PF.bakeScale;
    g.setTransform(k, 0, 0, k, -c.x * k, -c.y * k);
    this.bakeGround(g, c);
    for (let i = 0; i < c.rectCount; i++) if (!c.rects[i].alive) this.bakeRubble(g, c.rects[i]);
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (r.alive && r.kind === 'water') this.bakeWater(g, r);
    }
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (r.alive && r.kind === 'building') {
        const k2 = TALL_STYLES.has(r.style) ? 2.4 : 1;
        g.fillStyle = 'rgba(0,10,30,.26)';
        rr(g, r.x + 12 * k2, r.y + 15 * k2, r.w, r.h, 5);
        g.fill();
      }
    }
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (!r.alive) continue;
      if (r.kind === 'building') this.bakeBuilding(g, r);
      else if (r.kind === 'wall') this.bakeWall(g, r);
    }
    c.dirty = false;
  }

  bakeGround(g, c) {
    // Biyoma göre palet. Su karosu kıyı rengindedir; yuvarlak gölet köşelerinde mavi taşmasın
    const pal = BIOME_COLORS[c.biome];
    const urban = c.biome === 'city';
    const sea = c.template === 'sea';
    const shore = sea ? '#1f8fd6' : c.template === 'lake' ? pal.sand : c.template === 'plaza' ? '#e5d7bf' : pal.grass;
    const colors = [pal.grass, pal.road, '#cdd2d6', '#e5d7bf', shore, pal.sand, pal.dirt, '#5fd3e6', '#c9ae4c'];
    const fieldGreen = (c.cx + c.cy) & 1;
    for (let y = 0; y < CT; y++) {
      for (let x = 0; x < CT; x++) {
        const t = c.ground[y * CT + x];
        g.fillStyle = colors[t];
        const px = c.x + x * TILE;
        const py = c.y + y * TILE;
        g.fillRect(px, py, TILE + 1, TILE + 1);
        const h = ((x * 73856093) ^ (y * 19349663) ^ (c.cx * 83492791) ^ (c.cy * 49979693)) >>> 0;
        if (t === GROUND.FIELD) {
          // Tarla sıraları
          if (fieldGreen) { g.fillStyle = '#7fae3f'; g.fillRect(px, py, TILE + 1, TILE + 1); }
          g.fillStyle = fieldGreen ? 'rgba(40,90,20,.35)' : 'rgba(120,80,20,.3)';
          for (let k = 3; k < TILE; k += 9) g.fillRect(px, py + k, TILE, 3);
        } else if (t === GROUND.WATER && sea) {
          g.fillStyle = 'rgba(255,255,255,.14)';
          g.fillRect(px + (h % 26), py + ((h >>> 7) % 34), 14, 2.5);
          g.fillStyle = 'rgba(0,50,110,.12)';
          g.fillRect(px + ((h >>> 3) % 20), py + ((h >>> 11) % 30), 20, 6);
        } else if (t === GROUND.SHALLOW) {
          g.fillStyle = 'rgba(255,255,255,.2)';
          g.fillRect(px + (h % 24), py + ((h >>> 9) % 32), 12, 2);
        } else if (t === GROUND.GRASS) {
          g.fillStyle = h & 1 ? 'rgba(40,120,40,.05)' : 'rgba(170,230,110,.07)';
          g.fillRect(px, py, TILE, TILE);
          g.fillStyle = 'rgba(30,100,40,.3)';
          for (let k = 0; k < 3; k++) {
            const m = (h >>> (k * 7)) & 127;
            const n = (h >>> (k * 5 + 3)) & 127;
            g.fillRect(px + (m % 36), py + (n % 36), 3, 3);
          }
        } else if (t === GROUND.WALK) {
          g.strokeStyle = 'rgba(90,100,110,.2)';
          g.lineWidth = 1;
          g.strokeRect(px + 0.5, py + 0.5, TILE, TILE);
        } else if (t === GROUND.PLAZA) {
          if ((x + y) & 1) { g.fillStyle = 'rgba(190,120,80,.2)'; g.fillRect(px, py, TILE, TILE); }
        } else if (t === GROUND.SAND || t === GROUND.DIRT) {
          g.fillStyle = 'rgba(120,90,50,.16)';
          g.fillRect(px + (h % 30), py + ((h >>> 8) % 30), 4, 3);
          g.fillRect(px + ((h >>> 4) % 30), py + ((h >>> 12) % 30), 3, 2);
        } else if (t === GROUND.ROAD && (h & 7) === 0) {
          g.fillStyle = 'rgba(0,0,0,.06)';
          g.fillRect(px + (h >>> 8) % 24, py + (h >>> 14) % 24, 14, 10);
        }
      }
    }
    // Sığ su kıyısında köpük
    if (sea) {
      g.fillStyle = 'rgba(255,255,255,.7)';
      for (let y = 1; y < CT - 1; y++) {
        for (let x = 1; x < CT - 1; x++) {
          if (c.ground[y * CT + x] !== GROUND.SHALLOW) continue;
          const px = c.x + x * TILE;
          const py = c.y + y * TILE;
          if (c.ground[y * CT + x - 1] === GROUND.SAND) g.fillRect(px - 1, py, 4, TILE);
          if (c.ground[y * CT + x + 1] === GROUND.SAND) g.fillRect(px + TILE - 3, py, 4, TILE);
          if (c.ground[(y - 1) * CT + x] === GROUND.SAND) g.fillRect(px, py - 1, TILE, 4);
          if (c.ground[(y + 1) * CT + x] === GROUND.SAND) g.fillRect(px, py + TILE - 3, TILE, 4);
        }
      }
    }
    // Kaldırım kenarları: şehirde beyaz, kırda sade, denizde köprü korkuluğu
    g.fillStyle = urban || sea ? 'rgba(245,247,250,.85)' : 'rgba(0,0,0,.2)';
    for (let y = 0; y < CT; y++) {
      for (let x = 0; x < CT; x++) {
        if (c.ground[y * CT + x] !== GROUND.ROAD) continue;
        const px = c.x + x * TILE;
        const py = c.y + y * TILE;
        if (x < CT - 1 && c.ground[y * CT + x + 1] !== GROUND.ROAD) g.fillRect(px + TILE - 2, py, 3, TILE);
        if (y < CT - 1 && c.ground[(y + 1) * CT + x] !== GROUND.ROAD) g.fillRect(px, py + TILE - 2, TILE, 3);
        if (x > 0 && c.ground[y * CT + x - 1] !== GROUND.ROAD) g.fillRect(px - 1, py, 3, TILE);
        if (y > 0 && c.ground[(y - 1) * CT + x] !== GROUND.ROAD) g.fillRect(px, py - 1, TILE, 3);
      }
    }
    // Sınırda: komşu chunk'ın ana yoluna bakan kenar
    for (let i = ART_W / TILE; i < CT; i++) {
      if (c.ground[i * CT + CT - 1] !== GROUND.ROAD) g.fillRect(c.x + CHUNK - 2, c.y + i * TILE, 2, TILE);
      if (c.ground[(CT - 1) * CT + i] !== GROUND.ROAD) g.fillRect(c.x + i * TILE, c.y + CHUNK - 2, TILE, 2);
    }

    // Ana yol çizgileri: sarı orta şerit, beyaz yaya geçidi
    const mid = ART_W / 2;
    g.fillStyle = '#ffd23f';
    for (let d = ART_W + 30; d < CHUNK - 30; d += 56) {
      g.fillRect(c.x + mid - 2, c.y + d, 4, 30);
      g.fillRect(c.x + d, c.y + mid - 2, 30, 4);
    }
    g.fillStyle = 'rgba(255,255,255,.8)';
    for (let i = 8; i < ART_W - 8 && urban; i += 18) {
      g.fillRect(c.x + i, c.y + ART_W + 4, 9, 18);
      g.fillRect(c.x + ART_W + 4, c.y + i, 18, 9);
      g.fillRect(c.x + i, c.y - 22, 9, 18);
      g.fillRect(c.x - 22, c.y + i, 18, 9);
    }
    // İç sokak kesik çizgileri
    g.fillStyle = 'rgba(255,255,255,.65)';
    for (let i = 0; i < c.streetCount; i++) {
      const s = c.streets[i];
      if (s.ground !== GROUND.ROAD) continue;
      const m = (s.pos + s.width / 2) * TILE;
      for (let d = ART_W + 26; d < CHUNK - 30; d += 50) {
        if (s.vertical) {
          if (c.ground[Math.floor(d / TILE) * CT + s.pos - 1] !== GROUND.ROAD) g.fillRect(c.x + m - 1.5, c.y + d, 3, 24);
        } else if (c.ground[(s.pos - 1) * CT + Math.floor(d / TILE)] !== GROUND.ROAD) {
          g.fillRect(c.x + d, c.y + m - 1.5, 24, 3);
        }
      }
    }
  }

  bakeWater(g, r) {
    const rad = r.style === 2 ? r.w / 2 : Math.min(40, r.w / 3);
    g.fillStyle = r.style === 1 ? '#e9d79c' : '#7bb65a';
    rr(g, r.x - 6, r.y - 6, r.w + 12, r.h + 12, rad + 4);
    g.fill();
    if (r.style === 2) { g.fillStyle = '#c7ccd2'; rr(g, r.x - 7, r.y - 7, r.w + 14, r.h + 14, rad + 7); g.fill(); }
    const grad = g.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
    grad.addColorStop(0, '#59c6f2');
    grad.addColorStop(1, '#2b86d4');
    g.fillStyle = grad;
    rr(g, r.x, r.y, r.w, r.h, rad);
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,.4)';
    g.lineWidth = 2.5;
    const n = Math.floor((r.w * r.h) / 9000) + 3;
    for (let i = 0; i < n; i++) {
      const u = (r.seed * (i + 7) * 37) % 100;
      const v = (r.seed * (i + 3) * 61) % 100;
      const x = r.x + r.w * (0.14 + u * 0.0072);
      const y = r.y + r.h * (0.14 + v * 0.0072);
      g.beginPath();
      g.moveTo(x - 10, y);
      g.quadraticCurveTo(x - 5, y - 4, x, y);
      g.quadraticCurveTo(x + 5, y + 4, x + 10, y);
      g.stroke();
    }
    if (r.style === 2) {
      g.fillStyle = '#d7e9f2';
      g.beginPath(); g.arc(r.x + r.w / 2, r.y + r.h / 2, 14, 0, 7); g.fill();
      g.fillStyle = '#fff';
      g.beginPath(); g.arc(r.x + r.w / 2, r.y + r.h / 2, 7, 0, 7); g.fill();
    }
  }

  bakeBuilding(g, r) {
    if (r.style >= 7) { paintSpecial(g, r); return; }
    const wall = 9; // Güneye bakan cephe: yükseklik hissi
    g.fillStyle = shade(r.color, -0.42);
    rr(g, r.x, r.y, r.w, r.h, 5);
    g.fill();
    // Cephe pencereleri
    g.fillStyle = 'rgba(190,230,255,.7)';
    for (let x = r.x + 7; x < r.x + r.w - 8; x += 13) g.fillRect(x, r.y + r.h - wall + 2, 6, 4);
    g.fillStyle = r.color;
    rr(g, r.x, r.y, r.w, r.h - wall, 5);
    g.fill();
    g.fillStyle = 'rgba(255,255,255,.14)';
    g.fillRect(r.x + 3, r.y + 3, r.w - 6, 3);
    g.fillRect(r.x + 3, r.y + 3, 3, r.h - wall - 6);
    const x = r.x + 8;
    const y = r.y + 8;
    const w = r.w - 16;
    const h = r.h - wall - 16;
    if (w < 8 || h < 8) return;
    const s = r.seed;
    if (r.style === 0) {
      // Klima üniteleri
      g.fillStyle = 'rgba(0,0,0,.14)';
      g.strokeStyle = 'rgba(0,0,0,.14)';
      g.lineWidth = 2;
      g.strokeRect(x, y, w, h);
      g.fillStyle = '#cfd5da';
      for (let i = 0; i < 3; i++) {
        const ax = x + 4 + ((s * (i + 2) * 13) % Math.max(1, w - 20));
        const ay = y + 4 + ((s * (i + 5) * 17) % Math.max(1, h - 18));
        g.fillStyle = 'rgba(0,0,0,.22)'; g.fillRect(ax + 2, ay + 2, 14, 11);
        g.fillStyle = '#d7dde2'; g.fillRect(ax, ay, 14, 11);
        g.fillStyle = '#8b959e'; g.beginPath(); g.arc(ax + 7, ay + 5.5, 3.5, 0, 7); g.fill();
      }
    } else if (r.style === 1) {
      // Beşik çatı
      const vertical = h > w;
      g.fillStyle = 'rgba(0,0,0,.14)';
      if (vertical) g.fillRect(x + w / 2, y - 8, w / 2 + 8, h + 16);
      else g.fillRect(x - 8, y + h / 2, w + 16, h / 2 + 8);
      g.fillStyle = 'rgba(255,255,255,.3)';
      if (vertical) g.fillRect(x + w / 2 - 1.5, y - 8, 3, h + 16);
      else g.fillRect(x - 8, y + h / 2 - 1.5, w + 16, 3);
    } else if (r.style === 2) {
      // Çatı bahçesi
      g.fillStyle = '#7fc66a';
      rr(g, x, y, w, h, 4);
      g.fill();
      g.fillStyle = '#4f9a3a';
      for (let i = 0; i < 4; i++) {
        g.beginPath();
        g.arc(x + 6 + ((s * (i + 1) * 23) % Math.max(1, w - 12)), y + 6 + ((s * (i + 3) * 31) % Math.max(1, h - 12)), 6, 0, 7);
        g.fill();
      }
    } else if (r.style === 3) {
      // Güneş panelleri
      g.fillStyle = '#1f3f77';
      for (let py = y; py < y + h - 8; py += 13) {
        for (let px = x; px < x + w - 12; px += 18) g.fillRect(px, py, 15, 10);
      }
      g.fillStyle = 'rgba(160,210,255,.35)';
      for (let py = y; py < y + h - 8; py += 13) g.fillRect(x, py + 4.5, w - 6, 1);
    } else if (r.style === 4) {
      // Helikopter pisti
      const cx = x + w / 2;
      const cy = y + h / 2;
      const d = Math.min(w, h) / 2 - 2;
      g.fillStyle = '#3d444e';
      g.beginPath(); g.arc(cx, cy, d, 0, 7); g.fill();
      g.strokeStyle = '#ffd23f';
      g.lineWidth = 3;
      g.stroke();
      g.fillStyle = '#fff';
      g.font = `bold ${Math.round(d)}px sans-serif`;
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.fillText('H', cx, cy + 1);
    } else if (r.style === 5) {
      // Ev çatısı: dört eğim
      g.fillStyle = 'rgba(0,0,0,.14)';
      g.beginPath();
      g.moveTo(r.x, r.y + r.h - wall);
      g.lineTo(r.x + r.w, r.y + r.h - wall);
      g.lineTo(r.x + r.w - 20, r.y + (r.h - wall) / 2);
      g.lineTo(r.x + 20, r.y + (r.h - wall) / 2);
      g.closePath();
      g.fill();
      g.strokeStyle = 'rgba(255,255,255,.28)';
      g.lineWidth = 2;
      g.beginPath();
      g.moveTo(r.x + 20, r.y + (r.h - wall) / 2);
      g.lineTo(r.x + r.w - 20, r.y + (r.h - wall) / 2);
      g.stroke();
      g.fillStyle = '#7a4e3a';
      g.fillRect(r.x + r.w - 26, r.y + 10, 10, 10);
    } else {
      // Depo: oluklu çatı
      g.strokeStyle = 'rgba(0,0,0,.14)';
      g.lineWidth = 2;
      for (let px = r.x + 10; px < r.x + r.w - 6; px += 14) {
        g.beginPath(); g.moveTo(px, r.y + 4); g.lineTo(px, r.y + r.h - wall - 4); g.stroke();
      }
    }
  }

  bakeWall(g, r) {
    g.fillStyle = 'rgba(0,10,30,.25)';
    g.fillRect(r.x + 4, r.y + 5, r.w, r.h);
    g.fillStyle = r.color;
    g.fillRect(r.x, r.y, r.w, r.h);
    g.fillStyle = 'rgba(0,0,0,.2)';
    for (let x = r.x + 16; x < r.x + r.w; x += 20) g.fillRect(x, r.y, 2, r.h);
  }

  bakeRubble(g, r) {
    g.fillStyle = '#9b8a72';
    g.fillRect(r.x, r.y, r.w, r.h);
    for (let i = 0; i < 26; i++) {
      const u = (r.seed * (i + 3) * 41) % 97;
      const v = (r.seed * (i + 9) * 59) % 89;
      g.fillStyle = i % 3 ? '#786a56' : (r.color || '#aaa');
      g.fillRect(r.x + (u / 97) * r.w - 4, r.y + (v / 89) * r.h - 4, 8 + (u % 9), 6 + (v % 7));
    }
  }

  // --- Kare çizimi ---
  draw(game, now) {
    const { ctx, dpr, w, h } = this;
    const cam = game.cam;
    const s = cam.scale * dpr;
    const ox = (w * dpr) / 2 - (cam.x + cam.sx) * s;
    const oy = (h * dpr) / 2 - (cam.y + cam.sy) * s;
    this.s = s; this.ox = ox; this.oy = oy;
    const vx0 = cam.x - cam.halfW - 30;
    const vx1 = cam.x + cam.halfW + 30;
    const vy0 = cam.y - cam.halfH - 30;
    const vy1 = cam.y + cam.halfH + 30;
    const world = game.world;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = '#6cc24a';
    ctx.fillRect(0, 0, w * dpr, h * dpr);
    ctx.setTransform(s, 0, 0, s, ox, oy);

    const c0x = Math.floor(vx0 / CHUNK);
    const c1x = Math.floor(vx1 / CHUNK);
    const c0y = Math.floor(vy0 / CHUNK);
    const c1y = Math.floor(vy1 / CHUNK);
    this.frameId = (this.frameId || 0) + 1;
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = world.chunk(cx, cy);
        c.lastSeen = this.frameId;
        if (!c.canvas || c.dirty) this.bake(c);
        ctx.drawImage(c.canvas, c.x, c.y, CHUNK + 0.6, CHUNK + 0.6);
      }
    }
    // Görünmeden önce hazırla: kaydırmada takılma olmasın (karede en fazla 1)
    // Telefonda takılma olmasın diye dört karede bir
    if (game.state === 'play' && this.frameId % 4 === 0) this.prebake(game, c0x, c1x, c0y, c1y);

    this.drawDecals(game, vx0, vx1, vy0, vy1);
    this.drawSkids(game, vx0, vx1, vy0, vy1);
    this.drawSpikes(game);
    this.drawShots(game, now);
    this.drawProps(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now, false);
    this.drawPeds(game, vx0, vx1, vy0, vy1, false);
    this.drawNpcs(game, vx0, vx1, vy0, vy1);
    this.drawCops(game, now, vx0, vx1, vy0, vy1);
    if (game.state !== 'dying' && game.state !== 'over') this.drawPlayer(game);
    this.drawProps(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now, true);
    this.drawPeds(game, vx0, vx1, vy0, vy1, true);
    this.drawParticles(game, vx0, vx1, vy0, vy1);
    this.drawSirens(game, now, vx0, vx1, vy0, vy1);
    this.drawWaves(game);
    this.drawFloats(game);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    this.drawSpeedLines(game, now);
    this.drawOverlay(game, now);
  }

  prebake(game, c0x, c1x, c0y, c1y) {
    const p = game.player;
    const dx = Math.sign(p.vx);
    const dy = Math.sign(p.vy);
    const cx = dx > 0 ? c1x + 1 : dx < 0 ? c0x - 1 : c0x;
    const cy = dy > 0 ? c1y + 1 : dy < 0 ? c0y - 1 : c0y;
    for (let y = c0y; y <= c1y; y++) {
      const c = game.world.chunk(cx, y);
      if (!c.canvas) { c.lastSeen = this.frameId; this.bake(c); return; }
    }
    for (let x = c0x; x <= c1x; x++) {
      const c = game.world.chunk(x, cy);
      if (!c.canvas) { c.lastSeen = this.frameId; this.bake(c); return; }
    }
  }

  place(x, y, rot) {
    const { s, ox, oy } = this;
    const c = Math.cos(rot) * s;
    const n = Math.sin(rot) * s;
    this.ctx.setTransform(c, n, -n, c, x * s + ox, y * s + oy);
  }

  drawDecals(game, x0, x1, y0, y1) {
    const ctx = this.ctx;
    for (const d of game.fx.decals) {
      if (!d.alive || d.x + d.r < x0 || d.x - d.r > x1 || d.y + d.r < y0 || d.y - d.r > y1) continue;
      ctx.globalAlpha = 0.75;
      ctx.drawImage(this.sprites.dark, d.x - d.r, d.y - d.r, d.r * 2, d.r * 2);
    }
    ctx.globalAlpha = 1;
  }

  drawSkids(game, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const fx = game.fx;
    const n = fx.skidMax;
    const buf = fx.skid;
    ctx.strokeStyle = '#17171a';
    ctx.lineWidth = 3.6;
    ctx.lineCap = 'butt';
    const parts = 4;
    for (let p = 0; p < parts; p++) {
      ctx.globalAlpha = 0.1 + 0.11 * p;
      ctx.beginPath();
      const from = Math.floor((p * n) / parts);
      const to = Math.floor(((p + 1) * n) / parts);
      for (let k = from; k < to; k++) {
        const i = ((fx.skidCursor + k) % n) * 5;
        if (buf[i + 4] === 0) continue;
        const ax = buf[i];
        const ay = buf[i + 1];
        if (ax < x0 || ax > x1 || ay < y0 || ay > y1) continue;
        ctx.moveTo(ax, ay);
        ctx.lineTo(buf[i + 2], buf[i + 3]);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  drawSpikes(game) {
    const ctx = this.ctx;
    for (const k of game.spikes) {
      if (!k.alive) continue;
      this.place(k.x, k.y, k.a);
      ctx.fillStyle = '#2d2f35';
      ctx.fillRect(-k.len / 2, -5, k.len, 10);
      ctx.fillStyle = '#e8edf2';
      ctx.beginPath();
      for (let x = -k.len / 2; x < k.len / 2 - 4; x += 7) {
        ctx.moveTo(x, 5);
        ctx.lineTo(x + 3.5, -9);
        ctx.lineTo(x + 7, 5);
      }
      ctx.fill();
    }
    this.ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawShots(game, now) {
    const ctx = this.ctx;
    const R = CONFIG.tank.radius;
    const warn = CONFIG.tank.warnTime;
    for (const k of game.shots) {
      if (!k.alive) continue;
      const t = k.t / warn;
      const pulse = 0.5 + 0.5 * Math.sin(now * 0.02);
      ctx.beginPath();
      ctx.arc(k.x, k.y, R, 0, 6.3);
      ctx.fillStyle = `rgba(255,40,30,${0.1 + 0.12 * pulse})`;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,60,30,.95)';
      ctx.lineWidth = 4;
      ctx.setLineDash([16, 10]);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.arc(k.x, k.y, R * t, 0, 6.3);
      ctx.fillStyle = 'rgba(255,90,20,.35)';
      ctx.fill();
      ctx.fillStyle = '#ffec3d';
      ctx.font = '700 44px Bungee, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', k.x, k.y);
    }
  }

  drawProps(game, c0x, c1x, c0y, c1y, x0, x1, y0, y1, now, tall) {
    const ctx = this.ctx;
    const sp = this.sprites;
    const world = game.world;
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = world.chunk(cx, cy);
        for (let i = 0; i < c.propCount; i++) {
          const pr = c.props[i];
          if (!pr.alive || pr.x < x0 - 30 || pr.x > x1 + 30 || pr.y < y0 - 30 || pr.y > y1 + 30) continue;
          const isTall = pr.kind === PROP.TREE || pr.kind === PROP.PALM || pr.kind === PROP.PINE;
          if (isTall !== tall) continue;
          if (isPower(pr.kind)) {
            const bob = 1 + 0.1 * Math.sin(now * 0.006 + pr.phase * 5);
            const look = POWER_LOOK[powerName(pr.kind)];
            ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
            ctx.globalAlpha = 0.45 + 0.25 * Math.sin(now * 0.005);
            ctx.drawImage(sp.auras[pr.kind - PROP.POWER_BLAST], pr.x - 46, pr.y - 46, 92, 92);
            ctx.globalAlpha = 1;
            const pw = 42 * bob;
            ctx.drawImage(sp.props[pr.kind], pr.x - pw / 2, pr.y - pw / 2, pw, pw);
            if (!look) continue;
            continue;
          }
          if (pr.kind === PROP.COIN) {
            const w = 22 * Math.abs(Math.cos(now * 0.006 + pr.phase * 7));
            ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
            ctx.globalAlpha = 0.5;
            ctx.drawImage(sp.glint, pr.x - 22, pr.y - 22, 44, 44);
            ctx.globalAlpha = 1;
            ctx.drawImage(sp.coin, pr.x - w / 2 - 1, pr.y - 12, w + 2, 24);
            continue;
          }
          let img = sp.props[pr.kind];
          if (pr.kind === PROP.PARKED) img = sp.parked[Math.abs(Math.floor(pr.phase * 100)) % sp.parked.length];
          const w = img.width / SPR;
          const h = img.height / SPR;
          if (pr.rot) {
            this.place(pr.x, pr.y, pr.rot);
            ctx.drawImage(img, -w / 2, -h / 2, w, h);
          } else {
            ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
            ctx.drawImage(img, pr.x - w / 2, pr.y - h / 2, w, h);
          }
        }
      }
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawPeds(game, x0, x1, y0, y1, flying) {
    const ctx = this.ctx;
    const sp = this.sprites;
    for (const p of game.crowd.peds) {
      if (!p.alive || (p.state === PED_FLY) !== flying) continue;
      if (p.x < x0 || p.x > x1 || p.y < y0 || p.y > y1) continue;
      const img = sp.peds[p.look][Math.floor(p.step) & 1];
      const k = 1 + p.z / 170;
      const size = 27 * k;
      if (flying) {
        ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
        ctx.globalAlpha = 0.3;
        ctx.drawImage(sp.dark, p.x - 8, p.y - 6, 16, 12);
        ctx.globalAlpha = 1;
      }
      this.place(p.x, p.y - p.z * 0.7, p.a);
      ctx.drawImage(img, -size / 2, -size / 2, size, size);
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawNpcs(game, x0, x1, y0, y1) {
    const sp = this.sprites.npc;
    for (const n of game.crowd.npcs) {
      if (!n.alive || n.x < x0 - 80 || n.x > x1 + 80 || n.y < y0 - 80 || n.y > y1 + 80) continue;
      this.drawBody(sp[n.kind][n.color], n);
    }
    this.ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawBody(img, b, shadowScale = 1, k = 1) {
    const ctx = this.ctx;
    const sp = this.sprites.shadow;
    ctx.globalAlpha = 0.28;
    this.place(b.x + 5 * shadowScale, b.y + 7 * shadowScale, b.a);
    const sw = (b.len + 6);
    const sh = (b.wid + 4);
    ctx.drawImage(sp, -sw / 2, -sh / 2, sw, sh);
    ctx.globalAlpha = 1;
    this.place(b.x, b.y, b.a);
    const w = (img.width / SPR) * k;
    const h = (img.height / SPR) * k;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  }

  drawPlayer(game) {
    const ctx = this.ctx;
    const p = game.player;
    if (this.playerId !== game.carSpec.id) {
      this.playerId = game.carSpec.id;
      this.playerSprite = carSprite(game.carSpec);
    }
    const k = p.len / game.carSpec.len;
    if (game.giantT > 0 || game.ghostT > 0) {
      ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
      const aura = game.giantT > 0 ? this.sprites.auras[3] : this.sprites.auras[1];
      const R = p.len * 1.25;
      ctx.globalAlpha = 0.6;
      ctx.drawImage(aura, p.x - R, p.y - R, R * 2, R * 2);
      ctx.globalAlpha = 1;
    }
    if (game.ghostT > 0) ctx.globalAlpha = 0.5;
    this.drawBody(this.playerSprite, p, k, k);
    ctx.globalAlpha = 1;
    if (game.stage >= 2) {
      ctx.globalAlpha = game.stage >= 3 ? 0.42 : 0.22;
      ctx.drawImage(this.sprites.dark, -p.len * 0.2, -p.wid * 0.9, p.len, p.wid * 1.8);
      ctx.globalAlpha = 1;
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawCops(game, now, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const sp = this.sprites;
    for (const c of game.cops) {
      if (c.x < x0 - 80 || c.x > x1 + 80 || c.y < y0 - 80 || c.y > y1 + 80) continue;
      this.drawBody(sp[c.type], c, c.type === 'tank' ? 1.6 : 1);
      if (c.type === 'tank') {
        this.place(c.x, c.y, c.turret);
        const w = sp.turret.width / SPR;
        const h = sp.turret.height / SPR;
        ctx.drawImage(sp.turret, -w / 2, -h / 2, w, h);
      }
      if (c.hurtFlash > 0) {
        this.place(c.x, c.y, c.a);
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.5;
        ctx.drawImage(sp.fire, -c.len / 2, -c.wid, c.len, c.wid * 2);
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
      }
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawParticles(game, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const fx = game.fx;
    const { x, y, life, ttl, size, kind, rot, color } = fx;
    const sp = this.sprites;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    for (let i = 0; i < fx.max; i++) {
      if (life[i] <= 0) continue;
      const k = kind[i];
      if (k === FX.FIRE || k === FX.SPARK || k === FX.GLINT) continue;
      if (x[i] < x0 || x[i] > x1 || y[i] < y0 || y[i] > y1) continue;
      const t = life[i] / ttl[i];
      if (k === FX.DEBRIS) {
        this.place(x[i], y[i], rot[i]);
        ctx.globalAlpha = Math.min(1, t * 2);
        ctx.fillStyle = fx.colors[color[i]];
        ctx.fillRect(-size[i] / 2, -size[i] / 3, size[i], size[i] * 0.66);
        ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
        continue;
      }
      const img = k === FX.DARK ? sp.dark : k === FX.DUST ? sp.dust : k === FX.WATER ? sp.water : sp.smoke;
      const r = size[i] * (1 + (1 - t) * 1.7);
      ctx.globalAlpha = t * 0.9;
      ctx.drawImage(img, x[i] - r, y[i] - r, r * 2, r * 2);
    }
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = '#ffd98a';
    ctx.lineWidth = 2;
    for (let i = 0; i < fx.max; i++) {
      if (life[i] <= 0) continue;
      const k = kind[i];
      if (k !== FX.FIRE && k !== FX.SPARK && k !== FX.GLINT) continue;
      if (x[i] < x0 || x[i] > x1 || y[i] < y0 || y[i] > y1) continue;
      const t = life[i] / ttl[i];
      ctx.globalAlpha = Math.min(1, t * 1.4);
      if (k === FX.SPARK) {
        ctx.beginPath();
        ctx.moveTo(x[i], y[i]);
        ctx.lineTo(x[i] - fx.vx[i] * 0.03, y[i] - fx.vy[i] * 0.03);
        ctx.stroke();
      } else {
        const r = k === FX.GLINT ? size[i] * 2 : size[i] * (0.6 + t * 0.8);
        ctx.drawImage(k === FX.GLINT ? sp.glint : sp.fire, x[i] - r, y[i] - r, r * 2, r * 2);
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  drawSirens(game, now, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const sp = this.sprites;
    ctx.globalCompositeOperation = 'lighter';
    for (const c of game.cops) {
      if (c.type === 'tank' || game.ghostT > 0) continue;
      if (c.x < x0 - 90 || c.x > x1 + 90 || c.y < y0 - 90 || c.y > y1 + 90) continue;
      const on = Math.floor(now / 130 + c.id) % 2 === 0;
      const side = c.wid * 0.5;
      const nx = -Math.sin(c.a) * side;
      const ny = Math.cos(c.a) * side;
      const R = c.type === 'swat' ? 66 : c.type === 'moto' ? 38 : 54;
      ctx.globalAlpha = on ? 0.85 : 0.22;
      ctx.drawImage(sp.red, c.x - nx - R, c.y - ny - R, R * 2, R * 2);
      ctx.globalAlpha = on ? 0.22 : 0.85;
      ctx.drawImage(sp.blue, c.x + nx - R, c.y + ny - R, R * 2, R * 2);
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
  }

  drawWaves(game) {
    const ctx = this.ctx;
    for (const w of game.fx.waves) {
      if (!w.alive) continue;
      ctx.globalAlpha = (1 - w.t) * 0.85;
      ctx.strokeStyle = '#fff3c4';
      ctx.lineWidth = 3 + 13 * (1 - w.t);
      ctx.beginPath();
      ctx.arc(w.x, w.y, w.r, 0, 6.3);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  drawFloats(game) {
    const ctx = this.ctx;
    ctx.font = '400 19px Bungee, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const f of game.fx.floats) {
      if (!f.alive) continue;
      ctx.globalAlpha = Math.min(1, (1.1 - f.t) * 3);
      ctx.fillStyle = 'rgba(0,0,0,.55)';
      ctx.fillText(f.text, f.x + 1.5, f.y + 1.5);
      ctx.fillStyle = f.color;
      ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
  }

  drawSpeedLines(game, now) {
    const p = game.player;
    const k = (p.speed / game.carSpec.maxSpeed - 0.72) / 0.28;
    if (k <= 0 || game.state !== 'play') return;
    const ctx = this.ctx;
    const { dpr, w, h } = this;
    const a = Math.atan2(p.vy, p.vx);
    const cx = (w * dpr) / 2;
    const cy = (h * dpr) / 2;
    const diag = Math.hypot(w, h) * dpr * 0.5;
    ctx.strokeStyle = 'rgba(255,255,255,.55)';
    ctx.lineWidth = 1.5 * dpr;
    ctx.globalAlpha = Math.min(0.32, k * 0.32);
    ctx.beginPath();
    for (let i = 0; i < 14; i++) {
      const seed = (i * 2654435761) >>> 0;
      const off = ((seed >>> 8) % 1000) / 500 - 1;
      const phase = ((now * 0.003 + (seed & 255) / 255) % 1);
      const along = diag * (1 - phase * 2);
      const across = off * diag * 0.95;
      if (Math.abs(across) < diag * 0.28) continue;
      const len = 90 * dpr;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      const px = cx + ca * along - sa * across;
      const py = cy + sa * along + ca * across;
      ctx.moveTo(px, py);
      ctx.lineTo(px - ca * len, py - sa * len);
    }
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  drawOverlay(game, now) {
    const ctx = this.ctx;
    const { dpr, w, h } = this;
    let a = Math.max(0, game.hitFlash) * 0.55;
    if (game.stage >= 3) a = Math.max(a, 0.22 + 0.14 * Math.sin(now * 0.012));
    const warn = game.warnT > 0 ? 0.3 + 0.25 * Math.sin(now * 0.02) : 0;
    if (a <= 0.01 && warn <= 0) return;
    if (!this.vignette) {
      const W = 256;
      const H = 256;
      const c = makeCanvas(W, H);
      const g = c.getContext('2d');
      const grad = g.createRadialGradient(W / 2, H / 2, W * 0.28, W / 2, H / 2, W * 0.72);
      grad.addColorStop(0, 'rgba(255,0,0,0)');
      grad.addColorStop(1, 'rgba(255,20,10,1)');
      g.fillStyle = grad;
      g.fillRect(0, 0, W, H);
      this.vignette = c;
      const c2 = makeCanvas(W, H);
      const g2 = c2.getContext('2d');
      const grad2 = g2.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.72);
      grad2.addColorStop(0, 'rgba(0,60,255,0)');
      grad2.addColorStop(1, 'rgba(40,80,255,1)');
      g2.fillStyle = grad2;
      g2.fillRect(0, 0, W, H);
      this.vignette2 = c2;
    }
    if (a > 0.01) {
      ctx.globalAlpha = Math.min(0.8, a);
      ctx.drawImage(this.vignette, 0, 0, w * dpr, h * dpr);
    }
    if (warn > 0) {
      ctx.globalAlpha = warn;
      ctx.drawImage(Math.floor(now / 220) % 2 ? this.vignette : this.vignette2, 0, 0, w * dpr, h * dpr);
    }
    ctx.globalAlpha = 1;
  }
}


// --- input.js ---
// Tek parmak kontrol: sağ yarı = sağa drift, sol yarı = sola drift, ikisi birden = geri.
// Klavye: sol/sağ ok veya A/D, ikisi birden = geri.

class Input {
  constructor() {
    this.touches = new Map(); // pointerId -> 'L' | 'R'
    this.keyL = false;
    this.keyR = false;
    this.width = 1;
  }

  get left() {
    if (this.keyL) return true;
    for (const s of this.touches.values()) if (s === 'L') return true;
    return false;
  }

  get right() {
    if (this.keyR) return true;
    for (const s of this.touches.values()) if (s === 'R') return true;
    return false;
  }

  get reverse() {
    return this.left && this.right;
  }

  get steer() {
    const l = this.left;
    const r = this.right;
    if (l === r) return 0;
    return r ? 1 : -1;
  }

  press(id, side) {
    this.touches.set(id, side);
  }

  release(id) {
    this.touches.delete(id);
  }

  clear() {
    this.touches.clear();
    this.keyL = false;
    this.keyR = false;
  }

  sideOf(x) {
    return x < this.width / 2 ? 'L' : 'R';
  }

  key(code, down) {
    if (code === 'ArrowLeft' || code === 'KeyA') { this.keyL = down; return true; }
    if (code === 'ArrowRight' || code === 'KeyD') { this.keyR = down; return true; }
    return false;
  }

  // Dokunma yüzeyine bağlanır. Parmak yarı değiştirirse yön de değişir.
  attach(el, win = window) {
    el.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault();
      try { el.setPointerCapture(e.pointerId); } catch { /* bazı tarayıcılar reddeder */ }
      this.press(e.pointerId, this.sideOf(e.clientX));
    });
    el.addEventListener('pointermove', (e) => {
      if (this.touches.has(e.pointerId)) this.touches.set(e.pointerId, this.sideOf(e.clientX));
    });
    const end = (e) => this.release(e.pointerId);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('lostpointercapture', end);
    win.addEventListener('keydown', (e) => { if (!e.repeat && this.key(e.code, true)) e.preventDefault(); });
    win.addEventListener('keyup', (e) => { this.key(e.code, false); });
    win.addEventListener('blur', () => this.clear());
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}

// --- storage.js ---
// En yüksek skor, coin, arabalar ve ayarlar localStorage'da.

const KEY = 'kac-kacabilirsen-v1';

function defaultSave() {
  return {
    bestScore: 0,
    bestTime: 0,
    coins: 0,
    owned: [CONFIG.cars[0].id],
    selected: CONFIG.cars[0].id,
    settings: { sound: true, vibrate: true },
    dev: { god: false, startTime: 0 },
    tutorial: false,
  };
}

// Bozuk ya da eski veriyi güvenli biçimde varsayılana tamamlar
function sanitize(data) {
  const d = defaultSave();
  if (!data || typeof data !== 'object') return d;
  const num = (v, min = 0) => (Number.isFinite(v) && v >= min ? v : min);
  d.bestScore = num(data.bestScore);
  d.bestTime = num(data.bestTime);
  d.coins = Math.floor(num(data.coins));
  if (Array.isArray(data.owned)) {
    const valid = data.owned.filter((id) => CONFIG.cars.some((c) => c.id === id));
    d.owned = [...new Set([CONFIG.cars[0].id, ...valid])];
  }
  if (d.owned.includes(data.selected)) d.selected = data.selected;
  if (data.settings) {
    d.settings.sound = data.settings.sound !== false;
    d.settings.vibrate = data.settings.vibrate !== false;
  }
  if (data.dev) {
    d.dev.god = data.dev.god === true;
    d.dev.startTime = num(data.dev.startTime);
  }
  d.tutorial = data.tutorial === true;
  return d;
}

class Storage {
  constructor(backend = null) {
    this.backend = backend;
    this.data = this.load();
  }

  store() {
    if (this.backend) return this.backend;
    try { return globalThis.localStorage; } catch { return null; }
  }

  load() {
    try {
      return sanitize(JSON.parse(this.store().getItem(KEY)));
    } catch {
      return defaultSave();
    }
  }

  save() {
    try {
      this.store().setItem(KEY, JSON.stringify(this.data));
    } catch { /* Gizli sekme ya da dolu depo: oyun yine çalışır */ }
  }

  selectedCar() {
    return CONFIG.cars.find((c) => c.id === this.data.selected) || CONFIG.cars[0];
  }

  // Sonucu işler, rekor bilgisini döndürür
  recordRun(result) {
    const d = this.data;
    const newScore = result.score > d.bestScore;
    const newTime = result.time > d.bestTime;
    if (newScore) d.bestScore = result.score;
    if (newTime) d.bestTime = result.time;
    d.coins += result.coins;
    this.save();
    return { newScore, newTime };
  }

  buy(id) {
    const car = CONFIG.cars.find((c) => c.id === id);
    const d = this.data;
    if (!car || d.owned.includes(id) || d.coins < car.cost) return false;
    d.coins -= car.cost;
    d.owned.push(id);
    d.selected = id;
    this.save();
    return true;
  }

  select(id) {
    if (!this.data.owned.includes(id)) return false;
    this.data.selected = id;
    this.save();
    return true;
  }
}

// --- audio.js ---
// Tüm sesler Web Audio ile üretilir; harici dosya yok.

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.master = null;
    this.running = false;
  }

  // Tarayıcılar sesi yalnızca kullanıcı dokunuşundan sonra başlatır
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = this.enabled ? 0.8 : 0;
    const comp = ctx.createDynamicsCompressor();
    this.master.connect(comp);
    comp.connect(ctx.destination);

    // Beyaz gürültü tamponu: drift, çarpma, patlama
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    // Motor: iki testere + alçak geçiren
    this.engGain = ctx.createGain();
    this.engGain.gain.value = 0;
    this.engFilter = ctx.createBiquadFilter();
    this.engFilter.type = 'lowpass';
    this.engFilter.frequency.value = 500;
    this.eng1 = ctx.createOscillator();
    this.eng2 = ctx.createOscillator();
    this.eng1.type = 'sawtooth';
    this.eng2.type = 'square';
    this.eng1.connect(this.engFilter);
    const sub = ctx.createGain();
    sub.gain.value = 0.4;
    this.eng2.connect(sub);
    sub.connect(this.engFilter);
    this.engFilter.connect(this.engGain);
    this.engGain.connect(this.master);
    this.eng1.start();
    this.eng2.start();

    // Drift cızırtısı: bant geçiren gürültü
    const nsrc = ctx.createBufferSource();
    nsrc.buffer = this.noise;
    nsrc.loop = true;
    this.driftFilter = ctx.createBiquadFilter();
    this.driftFilter.type = 'bandpass';
    this.driftFilter.frequency.value = 1900;
    this.driftFilter.Q.value = 2.4;
    this.driftGain = ctx.createGain();
    this.driftGain.gain.value = 0;
    nsrc.connect(this.driftFilter);
    this.driftFilter.connect(this.driftGain);
    this.driftGain.connect(this.master);
    nsrc.start();

    // Lastik ciyaklaması: dar bant testere
    this.tyreOsc = ctx.createOscillator();
    this.tyreOsc.type = 'sawtooth';
    const tyreF = ctx.createBiquadFilter();
    tyreF.type = 'bandpass';
    tyreF.frequency.value = 1700;
    tyreF.Q.value = 9;
    this.tyreGain = ctx.createGain();
    this.tyreGain.gain.value = 0;
    this.tyreOsc.connect(tyreF);
    tyreF.connect(this.tyreGain);
    this.tyreGain.connect(this.master);
    this.tyreOsc.start();

    // Dört farklı siren: her tür en yakın aracına göre ayrı çalar
    // Perde yaklaşma hızına göre kayar (Doppler hissi)
    this.voices = {};
    const makeVoice = (name, type, center) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = center;
      f.Q.value = 0.8;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(f);
      f.connect(gain);
      gain.connect(this.master);
      osc.start();
      this.voices[name] = { osc, gain };
    };
    makeVoice('wail', 'triangle', 1100);
    makeVoice('yelp', 'sawtooth', 1200);
    makeVoice('hilo', 'square', 620);
    makeVoice('chirp', 'triangle', 1900);
    this.radioT = 6;
  }

  setEnabled(on) {
    this.enabled = on;
    if (this.master) this.master.gain.setTargetAtTime(on ? 0.8 : 0, this.ctx.currentTime, 0.02);
  }

  suspend() {
    if (this.ctx && this.ctx.state === 'running') this.ctx.suspend();
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  // Her karede: motor, drift ve siren döngüleri
  update(game, active, now) {
    const c = this.ctx;
    if (!c) return;
    const t = c.currentTime;
    const p = game.player;
    const k = Math.min(1.1, p.speed / game.carSpec.maxSpeed);
    const on = active && game.state === 'play';
    const base = 52 + 150 * k + (p.drifting ? 34 : 0);
    this.eng1.frequency.setTargetAtTime(base, t, 0.06);
    this.eng2.frequency.setTargetAtTime(base * 1.5, t, 0.06);
    this.engFilter.frequency.setTargetAtTime(300 + 1300 * k, t, 0.08);
    this.engGain.gain.setTargetAtTime(on ? 0.05 + 0.09 * k : 0, t, 0.08);

    const slip = on && p.drifting ? Math.min(1, p.slip / 240) : 0;
    this.driftGain.gain.setTargetAtTime(slip * 0.26, t, 0.05);
    this.driftFilter.frequency.setTargetAtTime(1500 + 900 * slip, t, 0.05);

    this.tyreOsc.frequency.setTargetAtTime(760 + 500 * slip + 60 * Math.sin(now * 0.03), t, 0.03);
    this.tyreGain.gain.setTargetAtTime(slip > 0.35 ? (slip - 0.35) * 0.16 : 0, t, 0.04);

    // Yaklaşıyorsa perde yükselir, uzaklaşıyorsa düşer
    const doppler = 1 + Math.max(-0.14, Math.min(0.14, game.sirenClosing / 1800));
    const sec = now / 1000;
    const S = game.sirens;
    const quiet = game.ghostT > 0 ? 0.35 : 1;
    const setVoice = (name, freq) => {
      const v = this.voices[name];
      const d = S[name];
      if (on && d < 1300) {
        const vol = 1 - d / 1300;
        v.osc.frequency.setTargetAtTime(freq * doppler, t, 0.02);
        v.gain.gain.setTargetAtTime((0.02 + vol * vol * 0.075) * quiet, t, 0.1);
      } else {
        v.gain.gain.setTargetAtTime(0, t, 0.15);
      }
    };
    setVoice('wail', 680 + 760 * (0.5 - 0.5 * Math.cos((sec / 3.6) * 6.283))); // Yavaş uluma
    setVoice('yelp', 760 + 720 * (0.5 + 0.5 * Math.sin(sec * 19))); // Hızlı yelp
    setVoice('hilo', Math.floor(sec / 0.62) % 2 ? 640 : 475); // Ağır araç iki tonlu
    setVoice('chirp', 1300 + 900 * (sec * 9 - Math.floor(sec * 9))); // Motosiklet kesik siren

    // Ara sıra polis telsizi ve megafon
    if (on && game.sirenDist < 1000) {
      this.radioT -= Math.min(0.05, (now - (this.lastNow || now)) / 1000);
      if (this.radioT <= 0) {
        this.radioT = 6 + Math.random() * 8;
        if (Math.random() < 0.5) this.radio(); else this.megaphone();
      }
    }
    this.lastNow = now;
  }

  burst(duration, freq, gain, type = 'lowpass', sweepTo = 0) {
    const c = this.ctx;
    if (!c || !this.enabled) return;
    const t = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    src.loopEnd = 1.9;
    src.playbackRate.value = 0.7 + Math.random() * 0.5;
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + duration);
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    src.connect(f);
    f.connect(g);
    g.connect(this.master);
    src.start(t, Math.random());
    src.stop(t + duration + 0.02);
  }

  tone(freq, duration, gain, type = 'sine', slideTo = 0, delay = 0) {
    const c = this.ctx;
    if (!c || !this.enabled) return;
    const t = c.currentTime + delay;
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + duration + 0.02);
  }

  crash(k) {
    this.burst(0.2 + k * 0.2, 800 + k * 1400, 0.3 + k * 0.5, 'lowpass', 180);
    this.tone(150, 0.14, 0.2 * k + 0.08, 'square', 60);
    if (k > 0.35) {
      if (Math.random() < 0.5) this.metal(k); else this.glass(k);
    }
  }

  // Sac ezilmesi: uyumsuz kısa tonlar
  metal(k) {
    for (const f of [317, 523, 871, 1307]) this.tone(f * (0.9 + Math.random() * 0.2), 0.16 + k * 0.1, 0.07 + k * 0.05, 'square', f * 0.6);
  }

  // Cam kırılması: tiz parçalar
  glass(k) {
    this.burst(0.22, 5200, 0.3 * k + 0.08, 'highpass');
    for (let i = 0; i < 5; i++) this.tone(2600 + Math.random() * 3200, 0.1, 0.05, 'sine', 0, i * 0.03);
  }

  // Sentez çığlık: testere sesi + iki gırtlak bandı + titreme
  scream(k = 1) {
    const c = this.ctx;
    if (!c || !this.enabled) return;
    const t = c.currentTime;
    const dur = 0.45 + Math.random() * 0.45;
    const base = [300, 390, 520, 640, 780][Math.floor(Math.random() * 5)];
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(base * 0.9, t);
    o.frequency.exponentialRampToValueAtTime(base * 1.5, t + dur * 0.28);
    o.frequency.exponentialRampToValueAtTime(base * 0.75, t + dur);
    const vib = c.createOscillator();
    vib.frequency.value = 7 + Math.random() * 5;
    const vibGain = c.createGain();
    vibGain.gain.value = base * 0.05;
    vib.connect(vibGain);
    vibGain.connect(o.frequency);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16 * k + 0.03, t + 0.04);
    g.gain.setValueAtTime(0.16 * k + 0.03, t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    for (const [freq, q] of [[850, 7], [1500, 9], [2800, 11]]) {
      const f = c.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = freq * (0.92 + Math.random() * 0.16);
      f.Q.value = q;
      o.connect(f);
      f.connect(g);
    }
    g.connect(this.master);
    o.start(t);
    vib.start(t);
    o.stop(t + dur + 0.02);
    vib.stop(t + dur + 0.02);
  }

  thud() {
    this.tone(120, 0.12, 0.3, 'sine', 55);
    this.burst(0.07, 900, 0.16, 'lowpass');
  }

  horn(big) {
    const f = big ? 196 : 392;
    this.tone(f, 0.34, 0.09, 'square');
    this.tone(f * 1.26, 0.34, 0.08, 'square');
  }

  // Telsiz: cızırtı ve kısa konuşma darbeleri
  radio() {
    this.tone(1750, 0.06, 0.05, 'square');
    for (let i = 0; i < 6; i++) {
      this.burst(0.05 + Math.random() * 0.08, 900 + Math.random() * 900, 0.09, 'bandpass');
    }
    this.tone(1320, 0.07, 0.05, 'square', 0, 0.75);
  }

  // Megafon: heceli dalgalı ses
  megaphone() {
    for (let i = 0; i < 3; i++) {
      const f = 170 + Math.random() * 80;
      this.tone(f, 0.17, 0.11, 'sawtooth', f * 0.72, i * 0.21);
    }
    this.burst(0.65, 1200, 0.05, 'bandpass');
  }

  power(name) {
    const seq = { blast: [220, 330, 495], ghost: [880, 660, 990, 740], heal: [523, 659, 784, 1047], giant: [130, 196, 262, 392] }[name];
    seq.forEach((f, i) => this.tone(f, 0.2, 0.17, name === 'giant' ? 'sawtooth' : 'triangle', 0, i * 0.08));
  }

  powerEnd() { this.tone(660, 0.18, 0.1, 'triangle', 240); }

  crunch() { this.burst(0.12, 1300, 0.22, 'bandpass', 500); }
  coin() {
    this.tone(1320, 0.07, 0.16, 'square');
    this.tone(1975, 0.14, 0.16, 'square', 0, 0.06);
  }

  nearMiss() { this.tone(500, 0.22, 0.14, 'sawtooth', 1500); }
  explosion(k = 1) {
    this.burst(1.3 * k, 1300, 1.1 * k, 'lowpass', 45);
    this.tone(110, 0.9 * k, 0.6 * k, 'sine', 28);
  }

  tankFire() {
    this.burst(0.55, 700, 0.8, 'lowpass', 70);
    this.tone(90, 0.4, 0.5, 'sine', 40);
  }

  splash() { this.burst(0.4, 2400, 0.3, 'highpass', 600); }
  spike() { this.tone(900, 0.5, 0.14, 'sawtooth', 100); this.burst(0.3, 3200, 0.3, 'highpass'); }

  // Eşik uyarısı: kısa yükselen siren
  alert() {
    for (let i = 0; i < 3; i++) {
      this.tone(520, 0.34, 0.2, 'sawtooth', 1250, i * 0.36);
    }
  }
}

// --- ui.js ---
// Menüler ve oyun içi gösterge. HUD yalnızca değer değişince DOM'a yazar.

const $ = (id) => document.getElementById(id);

function formatTime(t) {
  const s = Math.floor(t);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

const SCREENS = ['menu', 'garage', 'settings', 'howto', 'over', 'pause'];

class UI {
  constructor(storage, actions) {
    this.storage = storage;
    this.actions = actions; // play, resume, toMenu, sound, vibrate
    this.last = { time: '', score: '', coins: '', stage: -1, stars: -1, combo: '' };
    this.devTaps = 0;
    this.bind();
    this.buildStars();
    this.buildPowers();
    this.syncSettings();
    this.refreshMenu();
  }

  bind() {
    const a = this.actions;
    const click = (id, fn) => $(id).addEventListener('click', () => { a.tap(); fn(); });
    click('btn-play', () => a.play());
    click('btn-garage', () => { this.renderGarage(); this.show('garage'); });
    click('btn-settings', () => this.show('settings'));
    click('btn-howto', () => this.show('howto'));
    for (const b of document.querySelectorAll('[data-back]')) {
      b.addEventListener('click', () => { a.tap(); this.refreshMenu(); this.show(b.dataset.back); });
    }
    click('btn-retry', () => a.play());
    click('btn-over-menu', () => a.toMenu());
    click('btn-pause', () => a.pause());
    click('btn-resume', () => a.resume());
    click('btn-pause-menu', () => a.toMenu());
    // Duraklat tuşu sürüş girdisi sayılmasın
    $('btn-pause').addEventListener('pointerdown', (e) => e.stopPropagation());

    const d = this.storage.data;
    $('set-sound').addEventListener('change', (e) => { d.settings.sound = e.target.checked; this.storage.save(); a.applySettings(); });
    $('set-vibrate').addEventListener('change', (e) => { d.settings.vibrate = e.target.checked; this.storage.save(); a.applySettings(); });
    $('dev-god').addEventListener('change', (e) => { d.dev.god = e.target.checked; this.storage.save(); });
    $('dev-start').addEventListener('change', (e) => { d.dev.startTime = Number(e.target.value); this.storage.save(); });
    // Gizli geliştirici bölümü: sürüm yazısına 7 kez dokun
    $('version').textContent = `Sürüm ${CONFIG.version}`;
    $('version').addEventListener('click', () => {
      if (++this.devTaps >= 7) $('dev-panel').hidden = false;
    });
  }

  syncSettings() {
    const d = this.storage.data;
    $('set-sound').checked = d.settings.sound;
    $('set-vibrate').checked = d.settings.vibrate;
    $('dev-god').checked = d.dev.god;
    $('dev-start').value = String(d.dev.startTime);
  }

  show(name) {
    for (const s of SCREENS) $(s).hidden = s !== name;
  }

  hideAll() {
    this.show('');
  }

  setHud(on) {
    $('hud').hidden = !on;
  }

  refreshMenu() {
    const d = this.storage.data;
    $('menu-coins').textContent = d.coins;
    $('menu-best').textContent = d.bestScore ? `En iyi: ${d.bestScore.toLocaleString('tr-TR')} puan · ${formatTime(d.bestTime)}` : 'İlk kaçışın seni bekliyor';
    $('menu-car').textContent = this.storage.selectedCar().name;
  }

  splash(done) {
    const el = $('splash');
    el.hidden = false;
    el.classList.add('play');
    setTimeout(() => {
      el.hidden = true;
      done();
    }, 3000);
  }

  buildStars() {
    const box = $('hud-stars');
    box.textContent = '';
    for (let i = 0; i < MAX_STARS; i++) {
      const s = document.createElement('span');
      s.textContent = '★';
      box.appendChild(s);
    }
  }

  setApkButton(show, url) {
    const a = $('btn-apk');
    a.href = url;
    a.hidden = !show;
  }

  // Güç simgesi küçük tuval olarak: HUD ve Nasıl Oynanır aynı çizimi kullanır
  powerCanvas(kind, size) {
    const c = document.createElement('canvas');
    c.width = size * 2;
    c.height = size * 2;
    c.className = 'pw-icon';
    const g = c.getContext('2d');
    g.setTransform((size * 2) / 36, 0, 0, (size * 2) / 36, size, size);
    paintPower(g, kind);
    return c;
  }

  buildPowers() {
    this.pw = {};
    const box = $('hud-powers');
    for (const kind of ['ghost', 'giant']) {
      const el = document.createElement('div');
      el.className = 'pw';
      el.hidden = true;
      el.style.setProperty('--c', POWER_LOOK[kind].color);
      const t = document.createElement('b');
      const bar = document.createElement('i');
      const fill = document.createElement('u');
      bar.appendChild(fill);
      el.append(this.powerCanvas(kind, 15), t, bar);
      box.appendChild(el);
      this.pw[kind] = { el, t, fill, last: '' };
    }
    const list = $('howto-powers');
    const info = { blast: 'Yakındaki bütün arabalar patlar', ghost: '30 sn polis seni göremez', heal: 'Hasarı onarır, ateşi söndürür', giant: '30 sn devleşirsin, hasar almazsın' };
    for (const kind of Object.keys(info)) {
      const row = document.createElement('div');
      const name = document.createElement('b');
      name.textContent = POWER_LOOK[kind].name;
      const d = document.createElement('span');
      d.textContent = info[kind];
      const text = document.createElement('p');
      text.append(name, d);
      row.append(this.powerCanvas(kind, 20), text);
      list.appendChild(row);
    }
  }

  toast(text, color) {
    const el = $('toast');
    el.textContent = text;
    el.style.color = color;
    el.classList.remove('run');
    void el.offsetWidth;
    el.classList.add('run');
  }

  powerToast(kind) {
    this.toast(POWER_LOOK[kind].name, POWER_LOOK[kind].color);
  }

  alert(stage) {
    const text = CONFIG.difficulty.alerts[[0, CONFIG.difficulty.swatAt, CONFIG.difficulty.advancedAt, CONFIG.difficulty.tanksAt][stage]];
    const el = $('alert');
    el.textContent = text;
    el.classList.remove('run');
    void el.offsetWidth; // Animasyonu baştan başlat
    el.classList.add('run');
  }

  showHint(on) {
    $('hint').hidden = !on;
  }

  resetHud() {
    this.last = { time: '', score: '', coins: '', stage: -1, stars: -1, combo: '' };
    $('alert').classList.remove('run');
  }

  hud(g) {
    const l = this.last;
    const time = formatTime(g.time);
    if (time !== l.time) { l.time = time; $('hud-time').textContent = time; }
    const score = Math.floor(g.score).toLocaleString('tr-TR');
    if (score !== l.score) { l.score = score; $('hud-score').textContent = score; }
    if (g.coins !== l.coins) { l.coins = g.coins; $('hud-coins').textContent = g.coins; }
    const stage = g.stage;
    if (stage !== l.stage) {
      l.stage = stage;
      $('hud-car').dataset.stage = stage;
    }
    const stars = g.diff.stars;
    if (stars !== l.stars) {
      l.stars = stars;
      const list = $('hud-stars').children;
      for (let i = 0; i < list.length; i++) list[i].classList.toggle('on', i < stars);
    }
    this.powerChip('ghost', g.ghostT);
    this.powerChip('giant', g.giantT);
    const combo = g.combo >= 1.25 ? `x${g.combo.toFixed(1).replace('.', ',')}` : '';
    if (combo !== l.combo) { l.combo = combo; $('hud-combo').textContent = combo; }
  }

  powerChip(kind, left) {
    const p = this.pw[kind];
    const text = left > 0 ? String(Math.ceil(left)) : '';
    if (text === p.last) return;
    p.last = text;
    p.el.hidden = left <= 0;
    p.t.textContent = text;
    p.fill.style.width = `${Math.round((left / CONFIG.powers.duration) * 100)}%`;
  }

  over(result, record) {
    const d = this.storage.data;
    $('over-title').textContent = record.newScore ? 'YENİ REKOR!' : 'YAKALANDIN!';
    $('over-title').classList.toggle('record', record.newScore);
    $('over-score').textContent = result.score.toLocaleString('tr-TR');
    $('over-time').textContent = formatTime(result.time);
    $('over-coins').textContent = `+${result.coins}`;
    $('over-kills').textContent = result.kills;
    $('over-broken').textContent = result.broken;
    $('over-near').textContent = result.nearMisses;
    $('over-drift').textContent = `${result.driftTime.toFixed(1).replace('.', ',')} sn`;
    $('over-best').textContent = `En iyi skor: ${d.bestScore.toLocaleString('tr-TR')} · En uzun süre: ${formatTime(d.bestTime)}`;
    this.show('over');
    // Hâlâ basılı parmak yanlışlıkla düğmeye basmasın
    const btns = $('over-actions');
    btns.classList.add('wait');
    setTimeout(() => btns.classList.remove('wait'), 700);
  }

  renderGarage() {
    const d = this.storage.data;
    $('garage-coins').textContent = d.coins;
    const list = $('garage-list');
    list.textContent = '';
    const max = {
      maxSpeed: Math.max(...CONFIG.cars.map((c) => c.maxSpeed)),
      durability: Math.max(...CONFIG.cars.map((c) => c.durability)),
    };
    const minDrift = Math.min(...CONFIG.cars.map((c) => c.driftGrip));
    for (const car of CONFIG.cars) {
      const owned = d.owned.includes(car.id);
      const selected = d.selected === car.id;
      const card = document.createElement('div');
      card.className = `car-card${selected ? ' selected' : ''}`;

      const art = carSprite(car);
      art.className = 'car-art';
      card.appendChild(art);

      const name = document.createElement('h3');
      name.textContent = car.name;
      card.appendChild(name);
      const desc = document.createElement('p');
      desc.textContent = car.desc;
      card.appendChild(desc);

      const stat = (label, value) => {
        const row = document.createElement('div');
        row.className = 'stat';
        const t = document.createElement('span');
        t.textContent = label;
        const bar = document.createElement('i');
        const fill = document.createElement('b');
        fill.style.width = `${Math.round(value * 100)}%`;
        bar.appendChild(fill);
        row.append(t, bar);
        card.appendChild(row);
      };
      stat('Hız', (car.maxSpeed - 340) / (max.maxSpeed - 340));
      stat('Sağlamlık', car.durability / max.durability);
      stat('Drift', minDrift / car.driftGrip);

      const btn = document.createElement('button');
      btn.className = 'btn small';
      if (selected) { btn.textContent = 'Seçili'; btn.disabled = true; }
      else if (owned) btn.textContent = 'Seç';
      else {
        btn.textContent = `${car.cost} coin`;
        btn.disabled = d.coins < car.cost;
      }
      btn.addEventListener('click', () => {
        this.actions.tap();
        if (owned) this.storage.select(car.id);
        else this.storage.buy(car.id);
        this.actions.carChanged();
        this.renderGarage();
      });
      card.appendChild(btn);
      list.appendChild(card);
    }
  }
}

// --- main.js ---
// Giriş noktası: döngü, boyutlandırma, olayların ses ve titreşime bağlanması.

const STEP = 1 / 60;
const canvas = document.getElementById('game');
const storage = new Storage();
const game = new Game();
const renderer = new Renderer(canvas);
const input = new Input();
const audio = new AudioEngine();
game.world.onRelease = (c) => renderer.releaseChunk(c);
game.carSpec = storage.selectedCar();

const params = new URLSearchParams(location.search);
let paused = false;
let accumulator = 0;
let last = 0;
let hudT = 0;
let hintT = 0;
let dprCap = CONFIG.perf.maxDpr;
const perf = { frames: new Float32Array(20000), work: new Float32Array(20000), i: 0, count: 0, dprDrops: 0 };

function vibrate(ms) {
  if (storage.data.settings.vibrate && navigator.vibrate) {
    try { navigator.vibrate(ms); } catch { /* desteklenmiyor */ }
  }
}

function applySettings() {
  audio.setEnabled(storage.data.settings.sound);
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = Math.min(dprCap, window.devicePixelRatio || 1);
  renderer.resize(w, h, dpr);
  game.view.w = w;
  game.view.h = h;
  input.width = w;
  game.updateCamera(1);
}

function play() {
  audio.unlock();
  const d = storage.data.dev;
  const qt = Number(params.get('t'));
  const startTime = params.has('t') ? qt : (d.startTime || CONFIG.dev.startTime);
  const god = params.get('god') === '1' || d.god || CONFIG.dev.godMode;
  paused = false;
  input.clear();
  ui.hideAll();
  ui.resetHud();
  ui.setHud(true);
  game.start(storage.selectedCar(), { startTime, god });
  perf.i = 0;
  perf.count = 0;
  hintT = storage.data.tutorial ? 0 : 5;
  ui.showHint(hintT > 0);
  if (hintT > 0) { storage.data.tutorial = true; storage.save(); }
  keepAwake(true);
}

function toMenu() {
  paused = false;
  ui.setHud(false);
  ui.showHint(false);
  game.carSpec = storage.selectedCar();
  game.startAttract();
  ui.refreshMenu();
  ui.show('menu');
  keepAwake(false);
}

function pause() {
  if (game.state !== 'play' || paused) return;
  paused = true;
  input.clear();
  audio.suspend();
  ui.show('pause');
}

function resume() {
  paused = false;
  audio.resume();
  ui.hideAll();
  last = 0;
}

const ui = new UI(storage, {
  tap() { audio.unlock(); },
  play, toMenu, pause, resume, applySettings,
  carChanged() { game.carSpec = storage.selectedCar(); },
});

let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && navigator.wakeLock && !wakeLock) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) {
      await wakeLock.release();
    }
  } catch { /* Pil tasarrufunda reddedilebilir */ }
}

game.onEvent = (name, v) => {
  switch (name) {
    case 'crash': audio.crash(v); vibrate(Math.round(18 + v * 40)); break;
    case 'scream': audio.scream(v); break;
    case 'thud': audio.thud(); vibrate(15); break;
    case 'horn': audio.horn(v); break;
    case 'power': audio.power(v); ui.powerToast(v); vibrate(35); break;
    case 'powerend': audio.powerEnd(); break;
    case 'break': audio.crunch(); break;
    case 'crush': audio.crunch(); vibrate(25); break;
    case 'coin': audio.coin(); break;
    case 'nearmiss': audio.nearMiss(); break;
    case 'splash': audio.splash(); break;
    case 'spike': audio.spike(); vibrate(60); break;
    case 'copdown': audio.explosion(0.55 * v); vibrate(40); break;
    case 'explosion': audio.explosion(1); vibrate([120, 40, 220]); break;
    case 'tankfire': audio.tankFire(); vibrate(30); break;
    case 'tankhit': audio.explosion(0.5 + 0.4 * v); vibrate(70); break;
    case 'alert': audio.alert(); ui.alert(v); vibrate([60, 40, 60]); break;
    case 'gameover': {
      const record = storage.recordRun(game.result);
      ui.setHud(false);
      ui.over(game.result, record);
      keepAwake(false);
      break;
    }
    default:
  }
};

function frame(now) {
  requestAnimationFrame(frame);
  if (!last) last = now;
  const elapsed = Math.min(0.1, (now - last) / 1000);
  last = now;
  const t0 = performance.now();

  if (!paused) {
    accumulator += elapsed;
    let steps = 0;
    while (accumulator >= STEP && steps < 5) {
      game.tick(STEP, input.steer, input.reverse);
      accumulator -= STEP;
      steps++;
    }
    if (steps === 5) accumulator = 0;
    if (hintT > 0) {
      hintT -= elapsed;
      if (hintT <= 0) ui.showHint(false);
    }
  }
  renderer.draw(game, now);
  audio.update(game, !paused, now);

  hudT -= elapsed;
  if (hudT <= 0 && game.state === 'play') {
    hudT = 0.1;
    ui.hud(game);
  }

  // Kare süresi ölçümü ve uyarlanabilir çözünürlük
  const i = perf.i;
  perf.frames[i] = elapsed * 1000;
  perf.work[i] = performance.now() - t0;
  perf.i = (i + 1) % perf.frames.length;
  perf.count++;
  if (perf.count % 120 === 0 && perf.count >= 120 && game.state === 'play') {
    let sum = 0;
    for (let k = 1; k <= 120; k++) sum += perf.frames[(perf.i - k + perf.frames.length) % perf.frames.length];
    if (sum / 120 > CONFIG.perf.slowFrameMs) {
      // Önce çözünürlük, sonra kalabalık azalır
      if (dprCap > 1) {
        dprCap = Math.max(1, dprCap - 0.25);
        perf.dprDrops++;
        resize();
      } else if (game.crowd.limit > 0.4) {
        game.crowd.limit -= 0.2;
        perf.dprDrops++;
      }
    }
  }
}

// Geri tuşu: oyundan çıkarmaz. Sırayla duraklatır, menüye döner; menüde iki kez basınca çıkar.
let lastBack = 0;
function handleBack() {
  const visible = (id) => !document.getElementById(id).hidden;
  if (visible('splash')) return false;
  if (game.state === 'play' || game.state === 'dying') {
    if (paused) resume(); else pause();
    return false;
  }
  if (visible('over')) { toMenu(); return false; }
  if (visible('menu')) {
    const t = performance.now();
    if (t - lastBack < 2000) return true;
    lastBack = t;
    ui.toast('Çıkmak için tekrar bas', '#ffffff');
    return false;
  }
  ui.refreshMenu();
  ui.show('menu');
  return false;
}
globalThis.__kacisBack = handleBack;

function boot() {
  const native = !!(globalThis.Capacitor && globalThis.Capacitor.isNativePlatform && globalThis.Capacitor.isNativePlatform());
  ui.setApkButton(!native, CONFIG.apkUrl);
  // Telefona kurulu web sürümünde de geri tuşu oyunu kapatmasın
  if (!native && location.protocol !== 'file:') {
    history.pushState({ kacis: 1 }, '');
    window.addEventListener('popstate', () => {
      if (handleBack()) history.back();
      else history.pushState({ kacis: 1 }, '');
    });
  }
  input.attach(canvas);
  applySettings();
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (game.state === 'play') pause();
      else audio.suspend();
    } else if (game.state !== 'play' || !paused) {
      audio.resume();
    }
  });

  game.startAttract();
  requestAnimationFrame(frame);
  ui.splash(() => { toMenu(); });

  if ('serviceWorker' in navigator && !native && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').catch(() => {});
    // Yeni sürüm gelince menüdeyken yenile, oyun sırasında bölme
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && game.state !== 'play') location.reload();
    });
  }
}

// Test ve geliştirici erişimi
globalThis.__kacis = { game, input, perf, storage, renderer, ui, play, pause, resume, cfg: CONFIG };

boot();

})();
