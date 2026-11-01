// Oyunun TÜM ayarları burada. Denge değiştirmek için yalnızca bu dosyayı düzenleyin,
// ardından `npm run bundle` çalıştırın (file:// kopyası için).

export const GROUND = { GRASS: 0, ROAD: 1, WALK: 2, PLAZA: 3, WATER: 4, SAND: 5, DIRT: 6 };

export const CONFIG = {
  version: '1.0.0',

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
    templates: { city: 42, suburb: 18, park: 14, lake: 9, industrial: 11, plaza: 6 },
  },

  camera: {
    viewArea: 640, // Ekran alanının karekökü bu kadar dünya birimine denk gelir
    lookAhead: 0.42, // Hızın önüne kaç saniyelik bakılır
    follow: 4.5,
    zoomOut: 0.2, // Son hızda ne kadar uzaklaşılır
    zoomRate: 1.8,
    shakeDecay: 6,
  },

  physics: {
    driftMinSpeed: 110, // Bunun altında arka lastikler kaymaz
    driftLateral: 58, // Drift sayılması için yanal hız
    steerResponse: 12, // Parmak girdisinin direksiyona geçiş hızı
    gripLoseRate: 9, // Direksiyon kırınca yol tutuşun düşme hızı
    gripRecoverRate: 2.4, // Bırakınca yol tutuşun dönme hızı (toparlanma kayması)
    yawResponse: 6.5, // Düşük = ağır araç, burun geç döner
    alignTorque: 6, // Bırakınca burnu gidiş yönüne çeken tork
    maxLateralDecel: 1500, // Lastiklerin üretebileceği en büyük yanal ivme
    scrub: 0.2, // Yan kaymanın hızdan yediği pay
    rollingDrag: 0.12,
    reverseSpeed: 170,
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
  ],

  // En az 5 araba. durability hasarı böler, mass polis çarpışmalarını etkiler.
  cars: [
    { id: 'serce', name: 'Serçe', cost: 0, desc: 'Dengeli başlangıç arabası', maxSpeed: 372, accel: 430, turnRate: 3.05, grip: 6.2, driftGrip: 1.65, durability: 1, mass: 1, len: 46, wid: 24, color: '#ff3d3d', accent: '#ffe14d' },
    { id: 'pars', name: 'Pars', cost: 150, desc: 'Hızlı ama kırılgan', maxSpeed: 415, accel: 470, turnRate: 2.85, grip: 6, driftGrip: 1.75, durability: 0.8, mass: 0.9, len: 48, wid: 23, color: '#ffa41b', accent: '#1d1d24' },
    { id: 'tosun', name: 'Tosun', cost: 300, desc: 'Ağır kamyonet, darbeye dayanıklı', maxSpeed: 352, accel: 370, turnRate: 2.65, grip: 7, driftGrip: 2.3, durability: 1.6, mass: 1.7, len: 52, wid: 27, color: '#37c871', accent: '#eaf7d0' },
    { id: 'kelebek', name: 'Kelebek', cost: 350, desc: 'Drift ustası, kuyruk bırakır', maxSpeed: 382, accel: 440, turnRate: 3.5, grip: 5.2, driftGrip: 1.05, durability: 0.95, mass: 0.95, len: 45, wid: 24, color: '#ff4fd8', accent: '#7af6ff' },
    { id: 'yildirim', name: 'Yıldırım', cost: 800, desc: 'En yüksek son hız', maxSpeed: 455, accel: 520, turnRate: 3, grip: 6.4, driftGrip: 1.5, durability: 0.85, mass: 0.95, len: 48, wid: 23, color: '#28d7ff', accent: '#ffffff' },
    { id: 'kaplan', name: 'Kaplan', cost: 1500, desc: 'Her işi iyi yapan efsane', maxSpeed: 430, accel: 520, turnRate: 3.35, grip: 6.6, driftGrip: 1.3, durability: 1.35, mass: 1.35, len: 50, wid: 26, color: '#ffd700', accent: '#111111' },
  ],

  damage: {
    minImpact: 90, // Bunun altındaki darbeler hasar vermez
    perSpeed: 0.09, // Hız birimi başına hasar: 370 hızla kafa kafaya ~25
    maxSingleHit: 34, // Tek darbe en fazla bu kadar: anlık ölüm yok
    earlyGraceUntil: 30, // Bu saniyeye kadar hasar azaltılır
    earlyGraceMul: 0.6,
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
    swatShare: [[50, 0.15], [200, 0.35], [280, 0.3]],
    advancedShare: [[200, 0.3], [280, 0.5]],
    tankCount: [[280, 1], [340, 2], [420, 3], [600, 4]],
    tankInterval: 22,
  },

  // speed: oyuncunun son hızına oran. HER ZAMAN 1'in altında kalmalı (test eder).
  police: {
    car: { hp: 40, mass: 1.15, speed: 0.87, accel: 400, turnRate: 3, grip: 7.5, driftGrip: 3.2, len: 46, wid: 24, ram: 1, smart: 0.5 },
    swat: { hp: 130, mass: 3, speed: 0.78, accel: 300, turnRate: 2.1, grip: 8, driftGrip: 4.5, len: 66, wid: 32, ram: 1.7, smart: 0.6 },
    advanced: { hp: 75, mass: 1.5, speed: 0.95, accel: 520, turnRate: 3.4, grip: 9, driftGrip: 4.5, len: 48, wid: 24, ram: 1.25, smart: 1 },
    tank: { hp: 700, mass: 22, speed: 0.4, accel: 160, turnRate: 1.2, grip: 14, driftGrip: 14, len: 104, wid: 66, ram: 2.2, smart: 0.3 },
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

  perf: { maxParticles: 380, maxSkids: 900, maxDecals: 24, maxDpr: 2, bakeScale: 0.85, bakePool: 12 },
};

// Yıldız seviyesi: başlangıçta 1, her eşikte artar
export const MAX_STARS = 4;
