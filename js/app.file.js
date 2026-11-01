// Üretilmiş dosya, elle düzenlemeyin. Kaynak: js/*.js (npm run bundle)
(function () {
'use strict';
// --- config.js ---
// Oyunun TÜM ayarları burada. Denge değiştirmek için yalnızca bu dosyayı düzenleyin,
// ardından `npm run bundle` çalıştırın (file:// kopyası için).

const GROUND = { GRASS: 0, ROAD: 1, WALK: 2, PLAZA: 3, WATER: 4, SAND: 5, DIRT: 6, SHALLOW: 7, FIELD: 8, ALLEY: 9 };

// Bina stilleri. 0-6 şehir çatıları, sonrası js/art.js içinde özel çizilir
const BUILD = {
  TOWER_GLASS: 7, TOWER_ROUND: 8, TOWER_STEP: 9, HUT: 10, LIFEGUARD: 11, LIGHTHOUSE: 12, CABIN: 13,
  FIRETOWER: 14, ADOBE: 15, MESA: 16, BARN: 17, SILO: 18, WINDMILL: 19, WATERTOWER: 20, GAS: 21,
  APARTMENT: 22, MARKET: 23, SISTEM: 24, BAZAAR: 25, CHAIN: 26, BANK: 27, RESIDENCE: 28, OFFICE: 29, HOTEL: 30,
  HOSPITAL: 31, SCHOOL: 32, MOSQUE: 33, STADIUM: 34, SITE_BLOCK: 35, GECEKONDU: 36, VILLA: 37, ISHANI: 38, SHOPROW: 39, CLUB: 40, SHOP: 41, SKYSCRAPER: 42,
};

const CONFIG = {
  name: 'Penci Zorn',
  version: '5.0.0',
  apkUrl: 'https://github.com/caglarsaglammmmm-code/kacis-oyunu/releases/latest/download/PenciZorn.apk',

  // Geliştirici kısayolları. Adres çubuğundan da verilebilir: ?t=280&god=1
  dev: {
    startTime: 0, // Oyun bu saniyeden başlar (ör. 280 = tanklar)
    godMode: false, // Ölümsüzlük. Ayarlarda sürüm yazısına 7 kez dokununca da açılır
  },

  input: {
    bothDelay: 0.09, // Baş parmak geçişi geri vites sanılmasın: ikisine bu kadar basılı kalınca geri
  },

  world: {
    tile: 40,
    chunkTiles: 32,
    arterial: 3, // Her chunk'ın batı ve kuzeyindeki ana yolun karo genişliği
    loadRadius: 2, // Oyuncu çevresinde kaç chunk yüklü kalır
    unloadRadius: 3, // Bu uzaklığın ötesindeki chunk'lar silinir
    biomeCell: 8, // Bir biyom bölgesinin chunk cinsinden boyutu (rastgele sınırlı)
    biomes: { city: 62, beach: 22, forest: 6, desert: 4, rural: 6 },
    seaRadius: 0.42, // Sahil bölgesinin ortasındaki denizin biyom hücresine oranı
    templates: { mahalle: 30, downtown: 15, esnaf: 12, gecekondu: 7, site: 7, gece: 5, cami: 7, stadyum: 2, hastane: 4, okul: 5, spor: 6, golet: 4, park: 2, pazar: 3, industrial: 3 },
    // Yoğunluk: alleys ara sokak sayısı (dikey, yatay), maxB en büyük parsel, wide iki karo sokak olasılığı,
    // detached ayrık bina olasılığı, stub çıkmaz sokak olasılığı
    profiles: {
      mahalle: { alleys: [1, 1], maxB: 7, wide: 0.15, detached: 0.14, stub: 0.5 },
      downtown: { alleys: [1, 1], maxB: 11, wide: 0.35, detached: 0.2, stub: 0.1 },
      esnaf: { alleys: [1, 1], maxB: 5, wide: 0.2, detached: 0.05, stub: 0.4 },
      gecekondu: { alleys: [1, 1], maxB: 3, wide: 0, detached: 0.3, stub: 0.7 },
      gece: { alleys: [1, 1], maxB: 6, wide: 0.3, detached: 0.1, stub: 0.2 },
    },
    sistemRing: [4, 9], // Tek Sistem Koleji başlangıçtan bu kadar chunk uzakta
    bigSites: [
      { name: 'Natura Park Sitesi', color: '#7fa86b', ring: [5, 11], layout: 0 },
      { name: 'Doğa Şehir Sitesi', color: '#c98a5a', ring: [8, 15], layout: 1 },
    ],
  },

  camera: {
    viewArea: 740, // Ekran alanının karekökü bu kadar dünya birimine denk gelir
    lookAhead: 0.46, // Hızın önüne kaç saniyelik bakılır
    follow: 5.5,
    followFast: 8, // Son hızda kamera arabadan kopmaz
    lookSmooth: 3.2, // Bakış yönü drift sırasında titremesin
    kick: 14, // Sert darbede kameranın itilmesi
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
    { grip: 0.97, speed: 0.98, drag: 0.02, name: 'alley' },
  ],

  // En az 5 araba. durability hasarı böler, mass polis çarpışmalarını etkiler.
  // Sıra önemli: pahalılaştıkça hız, kayma ve dayanıklılık artar. engine: motor sesi
  cars: [
    { id: 'dogan', paints: [{ name: 'Mahalle Beji', color: '#d9d4c7', finish: 'gloss' }, { name: 'Şarap Kırmızı', color: '#8e1b24', finish: 'metal' }, { name: 'Mat Asker Yeşili', color: '#4d5a3a', finish: 'matte' }, { name: 'Çift Ton Krem-Bordo', color: '#e6dcc2', finish: 'gloss', roof: '#6d1620' }], finish: 'gloss', name: 'Tofaş Doğan', cost: 0, desc: 'Her mahallenin emektarı', shape: 'dogan', maxSpeed: 432, accel: 520, turnRate: 3.2, grip: 4.5, driftGrip: 1.15, durability: 1, mass: 1, len: 48, wid: 24, color: '#d9d4c7', accent: '#8a1f1f', engine: { base: 46, range: 150, wave: 'sawtooth', sub: 1.5, gain: 1 } },
    { id: 'motor', paints: [{ name: 'Yarış Kırmızı', color: '#e8352e', finish: 'gloss', accent: '#ffe14d' }, { name: 'Elektrik Mavi', color: '#0a7cff', finish: 'metal', accent: '#ffffff' }, { name: 'Mat Siyah', color: '#1b1d22', finish: 'matte', accent: '#ff7a00' }, { name: 'İnci Beyaz', color: '#f2f4f7', finish: 'pearl', accent: '#e8352e' }], finish: 'gloss', name: 'Motosiklet', cost: 100, desc: 'Dar sokakların kralı', shape: 'moto', maxSpeed: 445, accel: 610, turnRate: 3.3, grip: 4.5, driftGrip: 1.1, durability: 1.05, mass: 0.9, len: 36, wid: 16, color: '#e8352e', accent: '#ffe14d', engine: { base: 88, range: 270, wave: 'square', sub: 2, gain: 0.8 } },
    { id: 'grandland', paints: [{ name: 'Gece Mavisi', color: '#1f3a68', finish: 'metal' }, { name: 'Kor Turuncu', color: '#e8551e', finish: 'metal' }, { name: 'Mat Gümüş', color: '#a7aeb7', finish: 'matte' }, { name: 'İnci Beyaz', color: '#f2f4f7', finish: 'pearl' }], finish: 'metal', name: 'Grandland', cost: 200, desc: 'Yüksek ve güvenli SUV', shape: 'grandland', maxSpeed: 458, accel: 540, turnRate: 3.24, grip: 4.6, driftGrip: 1.05, durability: 1.12, mass: 1.15, len: 52, wid: 27, color: '#3b4a5c', accent: '#d7dde5', engine: { base: 42, range: 125, wave: 'sawtooth', sub: 1.33, gain: 1 } },
    { id: 'tog', paints: [{ name: 'Anadolu Kırmızı', color: '#b3122a', finish: 'metal' }, { name: 'Fırtına Grisi', color: '#4a5560', finish: 'metal' }, { name: 'Mat Toprak', color: '#8a6a4a', finish: 'matte' }, { name: 'Buz Mavisi', color: '#bcd9e6', finish: 'pearl' }], finish: 'metal', name: 'TOG', cost: 320, desc: 'Sessiz, güçlü, elektrikli', shape: 'tog', maxSpeed: 472, accel: 680, turnRate: 3.28, grip: 4.6, driftGrip: 1, durability: 1.18, mass: 1.2, len: 50, wid: 26, color: '#b3122a', accent: '#111418', engine: { base: 240, range: 620, wave: 'sine', sub: 1.5, gain: 0.45 } },
    { id: 'sahin', paints: [{ name: 'Mat Siyah Sarı Şerit', color: '#111318', finish: 'matte', accent: '#ffd23f' }, { name: 'Ateş Turuncu', color: '#ff5a12', finish: 'gloss', accent: '#111318' }, { name: 'Neon Yeşil', color: '#39d353', finish: 'gloss', accent: '#111318' }, { name: 'Mor Metalik', color: '#6a2bd9', finish: 'metal', accent: '#21d4fd' }], finish: 'matte', name: 'Tofaş Şahin', cost: 480, desc: 'Abartılı spoyler, tam tuning', shape: 'sahin', maxSpeed: 486, accel: 590, turnRate: 3.32, grip: 4.7, driftGrip: 0.95, durability: 1.24, mass: 1.1, len: 48, wid: 24, color: '#111318', accent: '#ffd23f', engine: { base: 50, range: 175, wave: 'sawtooth', sub: 1.5, gain: 1.15 } },
    { id: 'anadol', paints: [{ name: 'Efsane Turuncu', color: '#e8782a', finish: 'gloss', accent: '#f6efe0' }, { name: 'Bebek Mavisi', color: '#7ec6e8', finish: 'gloss', accent: '#f6efe0' }, { name: 'Çift Ton Krem-Vişne', color: '#ead9b0', finish: 'gloss', roof: '#8a1f2f' }, { name: 'Mat Zeytin', color: '#6b6b3a', finish: 'matte', accent: '#f6efe0' }], finish: 'gloss', name: 'Anadol', cost: 680, desc: 'Fiberglas efsane', shape: 'anadol', maxSpeed: 500, accel: 600, turnRate: 3.36, grip: 4.7, driftGrip: 0.9, durability: 1.3, mass: 1.15, len: 50, wid: 24, color: '#e8782a', accent: '#f6efe0', engine: { base: 40, range: 140, wave: 'square', sub: 1.5, gain: 0.9 } },
    { id: 'murat', paints: [{ name: 'Boğaz Mavisi', color: '#2f6fb0', finish: 'gloss' }, { name: 'Haki', color: '#75805a', finish: 'matte' }, { name: 'Gümüş', color: '#b9c1ca', finish: 'metal' }, { name: 'Çift Ton Bej-Kahve', color: '#dcc9a4', finish: 'gloss', roof: '#5c3a22' }], finish: 'gloss', name: 'Murat 131', cost: 920, desc: 'Çelik gibi, babadan kalma', shape: 'murat', maxSpeed: 514, accel: 610, turnRate: 3.4, grip: 4.8, driftGrip: 0.86, durability: 1.38, mass: 1.25, len: 50, wid: 25, color: '#2f6fb0', accent: '#eef1f5', engine: { base: 38, range: 150, wave: 'sawtooth', sub: 1.26, gain: 1.1 } },
    { id: 'egea', paints: [{ name: 'Kar Beyaz', color: '#f2f2f2', finish: 'gloss' }, { name: 'Volkan Kırmızı', color: '#c1121f', finish: 'metal' }, { name: 'Mat Antrasit', color: '#3a3f47', finish: 'matte' }, { name: 'Çift Ton Mavi-Siyah', color: '#1565c0', finish: 'metal', roof: '#0b0d11' }], finish: 'metal', name: 'Fiat Egea', cost: 1200, desc: 'Filo arabası, sürprizli', shape: 'egea', maxSpeed: 528, accel: 640, turnRate: 3.45, grip: 4.8, driftGrip: 0.82, durability: 1.46, mass: 1.25, len: 50, wid: 25, color: '#f2f2f2', accent: '#1f2933', engine: { base: 52, range: 165, wave: 'triangle', sub: 1.5, gain: 1.2 } },
    { id: 'clio', paints: [{ name: 'Okyanus Mavi', color: '#1c9ad6', finish: 'metal', accent: '#ffffff' }, { name: 'Alev Turuncu', color: '#ff6a13', finish: 'metal' }, { name: 'Mat Beyaz', color: '#e6e8ea', finish: 'matte' }, { name: 'Çift Ton Kırmızı-Siyah', color: '#d3162b', finish: 'gloss', roof: '#0b0d11' }], finish: 'metal', name: 'Renault Clio', cost: 1550, desc: 'Küçük, çevik, uçan hatchback', shape: 'clio', maxSpeed: 542, accel: 680, turnRate: 3.52, grip: 4.9, driftGrip: 0.78, durability: 1.54, mass: 1.25, len: 45, wid: 24, color: '#1c9ad6', accent: '#ffffff', engine: { base: 56, range: 185, wave: 'triangle', sub: 2, gain: 1.15 } },
    { id: 'duster', paints: [{ name: 'Atacama Turuncu', color: '#e8701a', finish: 'matte', accent: '#23272e' }, { name: 'Orman Yeşili', color: '#2f6b4f', finish: 'metal' }, { name: 'Kum Beji', color: '#c9b48a', finish: 'matte' }, { name: 'Çift Ton Gri-Siyah', color: '#7a838d', finish: 'metal', roof: '#0b0d11' }], finish: 'matte', name: 'Dacia Duster', cost: 2000, desc: 'Her yerde gider, hiç durmaz', shape: 'duster', maxSpeed: 558, accel: 700, turnRate: 3.6, grip: 5, driftGrip: 0.74, durability: 1.62, mass: 1.5, len: 52, wid: 27, color: '#e8701a', accent: '#23272e', engine: { base: 44, range: 160, wave: 'sawtooth', sub: 1.5, gain: 1.25 } },
  ],

  damage: {
    minImpact: 90, // Bunun altındaki darbeler hasar vermez
    perSpeed: 0.072, // Hız birimi başına hasar: 430 hızla kafa kafaya ~24
    maxSingleHit: 34, // Tek darbe en fazla bu kadar: anlık ölüm yok
    earlyGraceUntil: 30, // Bu saniyeye kadar hasar azaltılır
    earlyGraceMul: 0.48,
    hitCooldown: 0.28, // Aynı temasın üst üste saymaması için
    hitStop: 0.055, // Sert darbede oyun bir an durur: çarpışma hissi
    hitStopMin: 9,
    autoReverseAfter: 1.1, // Duvara saplanınca kendiliğinden geri çıkar
    autoReverseTime: 0.75,
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
    aliensAt: 225, // 200-250 sn arası: uzaylı işgali başlar. Oyun burada gerçekten zorlaşır
    aliensAlert: 'UZAYLILAR GELDİ!',
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

  // On ayrı polis sireni ve iki uzaylı sesi. Her araç o an boşta olan sireni seçer
  sirens: ['wail', 'yelp', 'hilo', 'chirp', 'euro', 'rumble', 'horn', 'bip', 'pulse', 'warble', 'ufo', 'zap'],

  // Uzaylılar: bu aşamada oyuncudan HIZLIDIR, kaçmak zordur. Eşikler ve güç burada
  aliens: {
    ufoCount: [[225, 1], [250, 2], [300, 3], [420, 5]], // [saniye, aynı anda en çok]
    roverCount: [[225, 2], [250, 4], [300, 6], [420, 9]],
    spawnEvery: 3.2,
    ufo: { hp: 240, mass: 9, speed: 1.14, accel: 760, turnRate: 6, grip: 20, driftGrip: 20, len: 74, wid: 74, ram: 0, smart: 1, siren: 'ufo' },
    rover: { hp: 110, mass: 1.7, speed: 1.05, accel: 860, turnRate: 4.6, grip: 13, driftGrip: 9, len: 46, wid: 28, ram: 1.7, smart: 1, siren: 'zap' },
    beamRange: 105, // Işın dairesi
    beamDps: 15, // Işın altında saniyede hasar
    beamPull: 520, // Oyuncuyu merkeze çekme
    beamSlow: 1.1, // Işın altında hız kaybı (saniyede oran)
  },

  // Derin su: sahil, göl, gölet. Sığ suya girilir, derine düşen araç batar
  water: { sinkTime: 2.3, bubbleEvery: 0.06, shrink: 0.5, spin: 1.5, deepProbe: 6 },

  policeAI: {
    despawnDist: 2100,
    catchUpDist: 1150, // Polis bu kadar geride kalınca yenisi öne doğar: kovalama kopmasın
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
    coinPerSeconds: 8, // Bitişte her bu kadar saniye için 1 coin
    coinPerNearMisses: 2, // Her bu kadar yakın kaçış için 1 coin
    coinPerKill: 2,
  },

  coin: { magnet: 56, dropChance: 0.3 },

  // Sokak insanları. density: zemin başına doğma olasılığı (GROUND sırasıyla)
  // voice: bağırma sesi, road: yolda gider, dodge: asla çarpılmaz, fx: özel dağılma
  peds: {
    looks: 36, // Saç, kıyafet, ten, aksesuar birleşimi: yarısı erkek, yarısı kadın
    idleChance: 0.34,
    curbShare: 0.55, // Ana yol kenarı kaldırımında yürüyenlerin oranı // Dükkân önünde duran, sohbet eden yaya oranı
    max: 50, spawnEvery: 0.09, waiterEvery: 0.7, despawn: 1300,
    walkSpeed: 26, runSpeed: 82, fearDist: 130, hitSpeed: 45,
    launch: 190, launchUp: 330, gravity: 900, downTime: 2.2,
    density: [0.12, 0, 1, 1, 0, 0.55, 0.15, 0.3, 0.1, 0.8],
    kinds: {
      man: { weight: 5, speed: 1, voice: 'man' },
      woman: { weight: 5, speed: 1, voice: 'woman' },
      child: { weight: 2.6, speed: 1.4, voice: 'child' },
      elder: { weight: 2.2, speed: 0.6, voice: 'old' },
      simitci: { weight: 1.3, speed: 0.8, voice: 'simit', fx: 'simit', words: ['SİMİTLERİM!', 'SİMİİİT!', 'TEPSİM!'] },
      stroller: { weight: 1, speed: 0.8, voice: 'mom', words: ['BEBEĞİM!', 'DİKKAT ET!'] },
      wheelchair: { weight: 0.7, speed: 0.75, voice: 'wheel', words: ['YAVAŞ!', 'SANDALYEM!'] },
      bike: { weight: 1.5, speed: 3, voice: 'bike', words: ['ZİLİM BOZUK!', 'YOLDAN!'] },
      courier: { weight: 1, speed: 5.4, voice: 'courier', road: true, words: ['PAKET GİTTİ!', 'SİPARİŞ!', 'OHA!'] },
      cayci: { weight: 1.1, speed: 1, voice: 'cayci', fx: 'tea', words: ['ÇAYLAR!', 'BARDAKLAR!', 'TAZE DEMLEMİŞTİM!'] },
      esnaf: { weight: 1.5, speed: 0.9, voice: 'man', words: ['DÜKKÂNIM!', 'HOOP!', 'YAVAŞ OĞLUM!'] },
      student: { weight: 2, speed: 1.2, voice: 'teen', words: ['SINAVIM VARDI!', 'KANKA!', 'YOK ARTIK!'] },
      tourist: { weight: 1, speed: 0.7, voice: 'tourist', words: ['OH NO!', 'MAMMA MIA!', 'WOW!'] },
      jogger: { weight: 1, speed: 3, voice: 'man', words: ['NEFESİM!', 'KOŞTUM YA!'] },
      guard: { weight: 0.7, speed: 0.6, voice: 'man', words: ['DUR ORADA!', 'GİRİŞ YOK!'] },
      teyze: { weight: 2, speed: 0.65, voice: 'grandma', words: ['VAY BAŞIMA!', 'ÇANTAM!', 'TERBİYESİZ!'] },
      hawker: { weight: 0.9, speed: 0.7, voice: 'man', fx: 'simit', words: ['TEZGÂHIM!', 'MALLAR!'] },
      cat: { weight: 1.7, speed: 1.3, voice: 'cat', dodge: true },
    },
    words: {
      man: ['YANDIM!', 'OHA!', 'HOOP!', 'NOLUYOR YA!'],
      woman: ['AMAN!', 'İMDAT!', 'EYVAH!', 'YAPMA!'],
      child: ['ANNEE!', 'VIIIU!', 'YİNE!'],
      old: ['EVLADIM!', 'TÖVBE!', 'GENÇLİK İŞTE!'],
      teen: ['OHA!', 'ABİ YA!'],
      grandma: ['VAY!', 'ÖLDÜM!'],
      tourist: ['HELP!'],
      cat: ['MİYAV!'],
    },
  },

  // Sivil Türk trafiği: hepsi oyuncu araçlarından yavaş. Ana yollarda sağdan akar
  npc: {
    max: 22, spawnEvery: 0.4, despawn: 1700, laneOffset: 30, turnChance: 0.2,
    hitScale: 0.42, maxHit: 12,
    panicDist: 300, panicSpeed: 300, panicTime: 2.4, panicLane: 44, panicBoost: 1.3,
    // Boyalar: metalik, parlak, mat sırayla atanır. Modeller özgün, gerçek logo yok
    finishes: ['metal', 'gloss', 'matte'],
    types: {
      tofas: { weight: 2.6, shape: 'dogan', model: 'dogan', len: 46, wid: 23, mass: 1.2, cruise: 195, turnRate: 2.4, grip: 7, horn: 'car', colors: ['#d9d4c7', '#8a1f1f', '#3e7cb1', '#2f6b4f', '#e0a020'] },
      murat: { weight: 1.5, shape: 'murat', len: 47, wid: 24, mass: 1.25, cruise: 175, turnRate: 2.3, grip: 7, horn: 'old', colors: ['#3e8ad0', '#e8e4d8', '#b5352a', '#3a7a55'] },
      anadol: { weight: 0.9, shape: 'anadol', len: 47, wid: 23, mass: 1.15, cruise: 165, turnRate: 2.3, grip: 7, horn: 'old', colors: ['#e8782a', '#e0c060', '#7a3b9c'] },
      tog: { weight: 1, shape: 'tog', len: 48, wid: 25, mass: 1.4, cruise: 215, turnRate: 2.5, grip: 7, horn: 'car', colors: ['#3f4a55', '#e8e8e8', '#14506b', '#a01c30'] },
      taxi: { weight: 2.4, shape: 'egea', model: 'egea', len: 48, wid: 24, mass: 1.25, cruise: 225, turnRate: 2.6, grip: 7, horn: 'taxi', colors: ['#f7c600'] },
      bavyera: { weight: 1.6, shape: 'bavyera', len: 49, wid: 25, mass: 1.35, cruise: 225, turnRate: 2.6, grip: 7, horn: 'car', colors: ['#14233f', '#e9edf1', '#1a1c20', '#2b6fd6', '#7d8894'] },
      halka: { weight: 1.5, shape: 'halka', len: 49, wid: 25, mass: 1.35, cruise: 225, turnRate: 2.6, grip: 7, horn: 'car', colors: ['#c2c8cf', '#23262c', '#7c1f2b', '#1f6e5a'] },
      yildiz: { weight: 1.5, shape: 'yildiz', len: 51, wid: 25, mass: 1.45, cruise: 210, turnRate: 2.4, grip: 7, horn: 'old', colors: ['#111317', '#d8dde3', '#34495e', '#6d6358'] },
      golf: { weight: 1.7, shape: 'golf', len: 43, wid: 24, mass: 1.15, cruise: 205, turnRate: 2.7, grip: 7, horn: 'car', colors: ['#d62839', '#f4f4f4', '#2e3a4a', '#1e88a8', '#ffd23f'] },
      focus: { weight: 1.3, shape: 'focus', len: 46, wid: 24, mass: 1.2, cruise: 200, turnRate: 2.6, grip: 7, horn: 'car', colors: ['#2b5fa8', '#e5e7ea', '#e8703a', '#3a3f47'] },
      kore: { weight: 1.3, shape: 'kore', len: 46, wid: 24, mass: 1.2, cruise: 200, turnRate: 2.6, grip: 7, horn: 'car', colors: ['#4bb5a9', '#d9dde2', '#a01c30', '#222630'] },
      megane: { weight: 1.3, shape: 'megane', len: 47, wid: 24, mass: 1.2, cruise: 200, turnRate: 2.5, grip: 7, horn: 'car', colors: ['#f2f2f2', '#b0272f', '#3e6a95', '#5b5f66'] },
      linea: { weight: 1.3, shape: 'linea', len: 47, wid: 24, mass: 1.2, cruise: 190, turnRate: 2.5, grip: 7, horn: 'car', colors: ['#eae6dc', '#8e9299', '#4a6a8a', '#7a2f2f'] },
      pickup: { weight: 1.2, shape: 'kamyonet', len: 52, wid: 26, mass: 1.9, cruise: 185, turnRate: 2.2, grip: 7, horn: 'truck', colors: ['#e8e8e8', '#3e6a4f', '#b5352a', '#3e6a95'] },
      motosiklet: { weight: 1.1, shape: 'moto', model: 'moto', len: 34, wid: 14, mass: 0.5, cruise: 225, turnRate: 3, grip: 8, horn: 'car', colors: ['#d62839', '#1e88a8', '#23262c', '#e8c547'] },
      clio: { weight: 1.2, shape: 'clio', len: 42, wid: 24, mass: 1.1, cruise: 205, turnRate: 2.7, grip: 7, horn: 'car', colors: ['#1c9ad6', '#ff6a13', '#e6e8ea', '#d3162b'] },
      duster: { weight: 1.1, shape: 'duster', len: 48, wid: 26, mass: 1.5, cruise: 195, turnRate: 2.4, grip: 7, horn: 'truck', colors: ['#e8701a', '#2f6b4f', '#c9b48a'] },
      grandland: { weight: 0.9, shape: 'grandland', len: 49, wid: 26, mass: 1.45, cruise: 205, turnRate: 2.5, grip: 7, horn: 'car', colors: ['#1f3a68', '#a7aeb7', '#e8551e'] },
      egea: { weight: 1.5, shape: 'egea', len: 48, wid: 24, mass: 1.25, cruise: 205, turnRate: 2.5, grip: 7, horn: 'car', colors: ['#f2f2f2', '#c1121f', '#3a3f47', '#1565c0'] },
      minibus: { weight: 1.6, model: 'minibus', len: 64, wid: 28, mass: 3, cruise: 190, turnRate: 2, grip: 8, horn: 'dolmus', colors: ['#f4f6f8'] },
      bus: { weight: 1.1, len: 96, wid: 30, mass: 7, cruise: 150, turnRate: 1.7, grip: 8, horn: 'bus', colors: ['#2a7fc1', '#2c9e8f', '#e8732a'] },
      truck: { weight: 0.8, accent: '#2a6db0', len: 108, wid: 32, mass: 8, cruise: 155, turnRate: 1.6, grip: 8, horn: 'truck', colors: ['#d9534f', '#3e7cb1', '#e8833a', '#2f7a4f'] },
    },
  },

  // Trafik ışığı süreleri (saniye)
  traffic: { green: 6, yellow: 1.2, allRed: 0.8, stopLine: 94, brake: 520, hornAfter: 2.5, hornRate: 0.5 },

  // Tabela adları. Marketler uydurmadır, gerçek marka değildir
  signs: {
    bigshops: ['Grand Bazaar İş Hanı', 'Merkez İş Merkezi', 'Kristal Plaza', 'Boğaz Tower', 'Anadolu Plaza', 'Sultan Rezidans', 'Lale Rezidans', 'Marmara Residence', 'Mavi Kule', 'Atlas Tower'],
    hotels: ['Grand Otel', 'Otel Boğaz', 'Park Hotel', 'Pera Palas Oteli', 'Otel Saray', 'Mavi Otel'],
    shops: ['Usta Döner', 'İskender Sarayı', 'Karadeniz Pide', 'Urfa Lahmacun', 'Adana Kebapçısı', 'Nöbetçi Eczane', 'Ekmek Fırını', 'Bayan Kuaförü', 'Erkek Berberi', 'Köşe Büfe', 'Tekel Bayii', 'Maydanoz Döner', 'Soslu Döner', 'Eczane', 'Fırın', 'Dönerci', 'İskenderci', 'Pideci', 'Lahmacun', 'Kebapçı', 'Büfe', 'Tekel', 'Çay Ocağı', 'Kuaför', 'Nargile Cafe', 'Bakkal', 'Kahveci', 'Nevada Kafe', 'Berber', 'Lokanta', 'Börekçi', 'Kasap', 'Manav', 'Züccaciye', 'Kırtasiye', 'Emlakçı', 'Terzi', 'Tuhafiye', 'Ciğerci', 'Tatlıcı', 'Çiğköfte', 'Tamirci', 'Oto Yıkama', 'Usta Dönerci', 'Hacı Baba Pide', 'Kardeşler Bakkal', 'Tekel 7/24', 'Mahalle Çay Ocağı', 'Öz Urfa Kebap', 'Nevada Kafe'],
    chains: { Migros: '#ff7a00', 'BİM': '#d0121b', 'ŞOK': '#e6a800', A101: '#0088b0', CarrefourSA: '#0a4ea2', 'İtopya': '#ff2a6d', 'Koçtaş': '#f59300', 'CZN Burak': '#16a34a' },
    banks: { Akbank: '#d0121b', 'İş Bankası': '#0a4ea2', 'Ziraat Bankası': '#c8102e', Garanti: '#0f7a45', 'Yapı Kredi': '#1b2f6b' },
    sites: ['Yeşil Vadi Sitesi', 'Boğaz Evleri', 'Mavi Konak Sitesi', 'Çamlık Sitesi', 'Güneş Sitesi', 'Lale Evleri', 'Marmara Konutları', 'Park Evleri'],
    clubs: ['Pavyon Yıldız', 'Gece Kuşu', 'Neon Bar', 'Mavi Club', 'Saz Evi', 'Kırmızı Kapı'],
    neon: ['#ff2a6d', '#21d4fd', '#b967ff', '#05ffa1', '#fffb96'],
    markets: ['Ucuzluk Market', 'Bereket Gross', 'Komşu Market', 'Anadolu Gross', 'Yıldız Gross', 'Hesaplı Market', 'Doyuran Gross', 'Tasarruf Market'],
    colors: ['#c8261e', '#1d6fb8', '#178a4d', '#d97706', '#6d28a8', '#0f766e', '#be185d', '#1f2937'],
  },

  // Gece-gündüz: tek döngü süresi (saniye). start: başlangıç evresi (0 gündüz, 0.55 gece başı)
  day: { length: 170, start: 0.08, duskFrom: 0.42, nightFrom: 0.55, dawnFrom: 0.86, darkness: 0.62 },

  powers: {
    duration: 15, // Süreli güçler (görünmezlik, dev mod)
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

  perf: { maxParticles: 380, maxSkids: 900, maxDecals: 24, maxDpr: 1.75, bakeScale: 0.72, bakePool: 9, slowFrameMs: 21 },
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
  CHAIRS: 21, UNCLES: 22, SIMITCART: 23, STALL: 24, LAUNDRY: 25, QUEUE: 26,
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
  { r: 13, brk: 20, drag: 0.03, dmg: 0, coin: true, chip: '#d9281e', snd: 'chairs' },
  { r: 14, brk: 20, drag: 0.04, dmg: 0, coin: false, chip: '#5c6b7a', snd: 'uncles' },
  { r: 13, brk: 30, drag: 0.05, dmg: 0.3, coin: true, chip: '#d9a441', snd: 'simit' },
  { r: 15, brk: 25, drag: 0.05, dmg: 0.3, coin: true, chip: '#5bb04a', snd: 'chairs' },
  { r: 0, brk: 0, drag: 0, dmg: 0, coin: false, chip: '#fff', pass: true },
  { r: 15, brk: 20, drag: 0.04, dmg: 0, coin: false, chip: '#2a1f3a', snd: 'uncles' },
];

const POWER_KINDS = ['blast', 'ghost', 'heal', 'giant'];
const isPower = (kind) => kind >= PROP.POWER_BLAST && kind <= PROP.POWER_GIANT;
const powerName = (kind) => POWER_KINDS[kind - PROP.POWER_BLAST];
const isWaterRect = (rect) => rect.kind === 'water' || rect.kind === 'sea';
// Havuz ve şadırvan duvar gibidir; göl, gölet ve denize araba düşer
const isDeep = (rect) => rect.kind === 'sea' || (rect.kind === 'water' && rect.deep);

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

// Karoları bitişik dizilen şehir için yardımcı
function newChunk() {
  return {
    pads: [], padCount: 0, road: 0, alley: 0,
    cx: 0, cy: 0, x: 0, y: 0,
    ground: new Uint8Array(CELLS),
    cost: new Uint8Array(CELLS), // 0 = geçilmez
    rectAt: new Int16Array(CELLS), // karodaki dikdörtgenin sırası + 1
    rects: [], rectCount: 0,
    props: [], propCount: 0,
    streets: [], streetCount: 0,
    template: 'city', biome: 'city', dirty: true, canvas: null, lastSeen: 0, baseProps: 0,
    lights: [], lightCount: 0, siteName: '',
  };
}

class World {
  constructor(seed = 12345) {
    this.seed = seed | 0;
    this.sistem = null;
    this.sites = null;
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
    this.sistem = null;
    this.sites = null;
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
    c.lightCount = 0;
    c.padCount = 0;
    c.siteName = '';
    c.dirty = true;
    seedRng(cx, cy, this.seed);

    // Ana yollar
    for (let y = 0; y < CT; y++) {
      for (let x = 0; x < CT; x++) {
        if (x < ART || y < ART) c.ground[y * CT + x] = GROUND.ROAD;
      }
    }

    // Tek seferlik yerler önce hesaplanır: ilk çağrı rastgele diziyi bozmasın
    const sis = this.sistemChunk();
    const big = this.bigSiteAt(cx, cy);
    this.biomeAt(cx, cy, biomeOut);
    seedRng(cx, cy, this.seed);
    c.biome = biomeOut.biome;
    c.road = rint(0, 3); // Yol malzemesi: koyu asfalt, beton, parke taşı, kırık asfalt
    c.alley = rint(0, 2);
    const home = Math.abs(cx) <= 1 && Math.abs(cy) <= 1;
    let t = home ? 'mahalle' : 'city';
    if (cx === sis.cx && cy === sis.cy) {
      t = 'sistem';
    } else if (big) {
      t = 'bigsite';
    } else if (!home) {
      if (c.biome === 'city') t = pickTemplate();
      else if (c.biome === 'beach') t = biomeOut.sea ? 'sea' : 'beach';
      else t = c.biome;
    }
    c.template = t;
    if (t === 'city' || t === 'mahalle') this.fillDense(c, 'mahalle', null);
    else if (t === 'downtown') this.fillDense(c, 'downtown', null);
    else if (t === 'esnaf') this.fillDense(c, 'esnaf', null);
    else if (t === 'gecekondu') this.fillDense(c, 'gecekondu', null);
    else if (t === 'gece') this.fillDense(c, 'gece', null);
    else if (t === 'site') this.fillSite(c, SITE_NAMES[rint(0, SITE_NAMES.length - 1)], PASTELS[rint(0, PASTELS.length - 1)], rint(0, 1), true);
    else if (t === 'bigsite') this.fillSite(c, big.name, big.color, big.layout, c.cx === big.cx && c.cy === big.cy);
    else if (t === 'cami') this.fillDense(c, 'mahalle', { style: BUILD.MOSQUE, w: 12, h: 12, color: '#c7cdd3', pad: 'courtyard', sign: '' });
    else if (t === 'stadyum') this.fillDense(c, 'mahalle', { style: BUILD.STADIUM, w: 18, h: 16, color: '#58606b', sign: '' });
    else if (t === 'hastane') this.fillDense(c, 'mahalle', { style: BUILD.HOSPITAL, w: 13, h: 10, color: '#f1f5f8', pad: 'ambulance', sign: 'Devlet Hastanesi' });
    else if (t === 'okul') this.fillDense(c, 'mahalle', { style: BUILD.SCHOOL, w: 12, h: 6, color: '#e8cf9a', pad: 'yard', sign: 'Atatürk İlkokulu' });
    else if (t === 'spor') this.fillDense(c, 'mahalle', { sport: true });
    else if (t === 'golet') this.fillDense(c, 'mahalle', { pond: true });
    else if (t === 'pazar') this.fillPazar(c);
    else if (t === 'sistem') this.fillSistem(c);
    else if (t === 'sea') this.fillSea(c);
    else if (t === 'beach') this.fillBeach(c);
    else if (t === 'forest') this.fillForest(c);
    else if (t === 'desert') this.fillDesert(c);
    else if (t === 'rural') this.fillRural(c);
    else if (t === 'park') this.fillPark(c);
    else if (t === 'lake') this.fillLake(c);
    else if (t === 'industrial') this.fillIndustrial(c);
    else this.fillPlaza(c);

    this.arterialDetails(c);
    this.finishCost(c);
    c.baseProps = c.propCount;
    this.applyChanges(c);
    this.collectLights(c);
  }

  setGround(c, x0, y0, x1, y1, g) {
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) c.ground[y * CT + x] = g;
  }

  addRect(c, kind, tx0, ty0, tx1, ty1, inset, style, color) {
    let r = c.rects[c.rectCount];
    if (!r) { r = { kind: '', x: 0, y: 0, w: 0, h: 0, style: 0, color: '', alive: true, seed: 0 }; c.rects[c.rectCount] = r; }
    c.rectCount++;
    r.kind = kind; r.style = style; r.color = color; r.alive = true; r.seed = rint(0, 999);
    r.sign = ''; r.signColor = ''; r.brand = ''; r.neon = false; r.deep = false; r.signSize = 1;
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

  // Yoğun şehir: bitişik binalar, aralarında yalnızca bir arabanın geçeceği ara sokaklar
  fillDense(c, profile, mark) {
    const P = W.profiles[profile];
    this.P = P;
    this.profile = profile;
    this.setGround(c, ART, ART, CT, CT, GROUND.WALK);
    this.cutAlleys(c, true, P.alleys[0], P.wide, xsBuf);
    this.cutAlleys(c, false, P.alleys[1], P.wide, ysBuf);
    // En büyük blok özel yapıya ayrılır
    let bi = -1; let bj = -1; let best = 0;
    for (let j = 0; j < ysBuf.length; j += 2) {
      for (let i = 0; i < xsBuf.length; i += 2) {
        const a = (xsBuf[i + 1] - xsBuf[i]) * (ysBuf[j + 1] - ysBuf[j]);
        if (a > best) { best = a; bi = i; bj = j; }
      }
    }
    for (let j = 0; j < ysBuf.length; j += 2) {
      for (let i = 0; i < xsBuf.length; i += 2) {
        const x0 = xsBuf[i]; const x1 = xsBuf[i + 1]; const y0 = ysBuf[j]; const y1 = ysBuf[j + 1];
        if (mark && i === bi && j === bj) this.markBlock(c, mark, x0, y0, x1, y1);
        else this.packBlock(c, x0, y0, x1, y1);
      }
    }
    // Sokak hayatı yalnızca kalan boş yerlerde
    if (profile !== 'gecekondu') this.alleyLife(c);
    else { this.scatter(c, PROP.CRATE, 5, [GROUND.ALLEY, GROUND.WALK]); this.scatter(c, PROP.UNCLES, 4, [GROUND.WALK]); }
  }

  // n ara sokak: kenardan kenara, iki ucu da ana yola bağlanır
  cutAlleys(c, vertical, n, wide, out) {
    out.length = 0;
    out.push(ART);
    const span = CT - ART;
    for (let i = 1; i <= n; i++) {
      const w = chance(wide) ? 2 : 1;
      const p = ART + Math.round((span * i) / (n + 1)) + rint(-3, 3);
      this.addStreet(c, vertical, p, w, GROUND.ALLEY);
      out.push(p, p + w);
    }
    out.push(CT);
  }

  packBlock(c, x0, y0, x1, y1) {
    const P = this.P;
    const w = x1 - x0;
    const h = y1 - y0;
    // Çıkmaz sokak: bloğun kenarından içeri bir karo, ucu binaya dayanır
    if (w >= 9 && h >= 7 && chance(P.stub)) {
      const sx = x0 + rint(3, w - 4);
      const len = rint(3, h - 3);
      this.setGround(c, sx, y0, sx + 1, y0 + len, GROUND.ALLEY);
      this.split2(c, x0, y0, sx, y1, P.maxB);
      this.split2(c, sx + 1, y0, x1, y1, P.maxB);
      this.split2(c, sx, y0 + len, sx + 1, y1, P.maxB);
      return;
    }
    this.split2(c, x0, y0, x1, y1, P.maxB);
  }

  split2(c, x0, y0, x1, y1, maxB) {
    const w = x1 - x0;
    const h = y1 - y0;
    if (w < 1 || h < 1) return;
    if (w <= maxB && h <= maxB && (w <= 2 || h <= 2 || chance(0.55))) { this.lot(c, x0, y0, x1, y1); return; }
    const vertical = w === h ? chance(0.5) : w > h;
    const len = vertical ? w : h;
    if (len < 3) { this.lot(c, x0, y0, x1, y1); return; }
    const at = rint(1, len - 1) < 2 ? 2 : rint(2, Math.max(2, len - 2));
    if (vertical) { this.split2(c, x0, y0, x0 + at, y1, maxB); this.split2(c, x0 + at, y0, x1, y1, maxB); }
    else { this.split2(c, x0, y0, x1, y0 + at, maxB); this.split2(c, x0, y0 + at, x1, y1, maxB); }
  }

  // Kavşak köşeleri boş kalır: yaya orada bekler
  lot(c, x0, y0, x1, y1) {
    for (const [rx, ry] of RESERVED) {
      if (rx >= x0 && rx < x1 && ry >= y0 && ry < y1) {
        if (rx === x0) x0++;
        else if (rx === x1 - 1) x1--;
        else if (ry === y0) y0++;
        else y1--;
      }
    }
    if (x1 <= x0 || y1 <= y0) return;
    this.building2(c, x0, y0, x1, y1);
  }

  alleyLife(c) {
    this.scatter(c, PROP.CHAIRS, 2, [GROUND.WALK]);
    this.scatter(c, PROP.SIMITCART, 1, [GROUND.WALK]);
    for (let i = 0; i < c.streetCount; i++) {
      const s = c.streets[i];
      if (s.ground !== GROUND.ALLEY) continue;
      for (let k = ART + rint(3, 7); k < CT - 2; k += rint(8, 13)) {
        const m = (s.pos + s.width / 2) * TILE;
        const at = (k + 0.5) * TILE;
        if (s.vertical) this.addProp(c, PROP.LAUNDRY, c.x + m, c.y + at, 0);
        else this.addProp(c, PROP.LAUNDRY, c.x + at, c.y + m, Math.PI / 2);
      }
    }
  }

  addPad(c, kind, tx, ty, w, h) {
    let p = c.pads[c.padCount];
    if (!p) { p = { kind: '', tx: 0, ty: 0, w: 0, h: 0 }; c.pads[c.padCount] = p; }
    c.padCount++;
    p.kind = kind; p.tx = tx; p.ty = ty; p.w = w; p.h = h;
  }

  // Bloğa özel yapı: cami, hastane, okul, stadyum, spor sahaları ya da gölet. Artan yer yine dolar
  markBlock(c, m, x0, y0, x1, y1) {
    const bw = x1 - x0;
    const bh = y1 - y0;
    if (m.sport) {
      const fw = Math.min(bw - 2, 14); const fh = Math.min(bh - 2, 9);
      this.setGround(c, x0, y0, x0 + fw, y0 + fh, GROUND.PLAZA);
      this.addPad(c, 'foot', x0, y0, fw, fh);
      const hx = x0 + fw;
      const rest = bw - fw;
      if (rest >= 4) {
        this.setGround(c, hx, y0, x1, y0 + Math.min(5, bh), GROUND.PLAZA);
        this.addPad(c, 'basket', hx, y0, Math.min(rest, 6), Math.min(5, bh));
      }
      const hh = Math.min(bh - fh, 6);
      if (hh >= 4) {
        const hw = Math.min(bw, 9);
        this.setGround(c, x0, y0 + fh, x0 + hw, y0 + fh + hh, GROUND.PLAZA);
        this.addPad(c, 'hali', x0, y0 + fh, hw, hh);
        this.split2(c, x0 + hw, y0 + Math.max(fh, 5), x1, y1, this.P.maxB);
        this.split2(c, x0, y0 + fh + hh, x0 + hw, y1, this.P.maxB);
      } else {
        this.split2(c, x0, y0 + fh, x1, y1, this.P.maxB);
      }
      return;
    }
    if (m.pond) {
      const pw = Math.min(bw - 2, rint(7, 11)); const ph = Math.min(bh - 2, rint(6, 9));
      const px = x0 + 1; const py = y0 + 1;
      this.setGround(c, x0, y0, x0 + pw + 2, y0 + ph + 2, GROUND.GRASS);
      this.setGround(c, px, py, px + pw, py + ph, GROUND.WATER);
      const r = this.addRect(c, 'water', px, py, px + pw, py + ph, 4, 0, '#3aa7e8');
      r.deep = true;
      for (let i = 0; i < 6; i++) this.addProp(c, chance(0.6) ? PROP.TREE : PROP.BENCH, c.x + (x0 + 0.5 + rnd() * (pw + 1)) * TILE, c.y + (chance(0.5) ? y0 + 0.5 : y0 + ph + 1.5) * TILE);
      this.split2(c, x0 + pw + 2, y0, x1, y1, this.P.maxB);
      this.split2(c, x0, y0 + ph + 2, x0 + pw + 2, y1, this.P.maxB);
      return;
    }
    const w = Math.min(bw, m.w);
    const h = Math.min(bh, m.h);
    const padH = m.pad === 'yard' ? Math.min(bh - h, 7) : m.pad === 'ambulance' ? Math.min(bh - h, 4) : 0;
    const r = this.addRect(c, 'building', x0, y0, x0 + w, y0 + h, 2, m.style, m.color);
    if (m.sign) { r.sign = m.sign; r.signColor = m.style === BUILD.HOSPITAL ? '#d0121b' : '#23422f'; r.signSize = 3; }
    if (padH > 0) {
      this.setGround(c, x0, y0 + h, x0 + w, y0 + h + padH, GROUND.PLAZA);
      this.addPad(c, m.pad, x0, y0 + h, w, padH);
    }
    this.split2(c, x0 + w, y0, x1, y1, this.P.maxB);
    this.split2(c, x0, y0 + h + padH, x0 + w, y1, this.P.maxB);
  }

  building2(c, x0, y0, x1, y1) {
    const w = x1 - x0;
    const h = y1 - y0;
    const area = w * h;
    const P = this.P;
    const ins = chance(P.detached) ? 6 : 1; // Çoğu bitişik, bazıları ayrık
    const SG = CONFIG.signs;
    const pick = (o) => o[rint(0, o.length - 1)];
    const keys = (o) => Object.keys(o);
    const add = (style, color, sign, signColor, size) => {
      const r = this.addRect(c, 'building', x0, y0, x1, y1, ins, style, color);
      if (sign) { r.sign = sign; r.signColor = signColor || pick(SG.colors); r.signSize = size ?? rint(0, 2); }
      return r;
    };
    const pf = this.profile;
    if (pf === 'gecekondu') {
      if (area >= 9) { add(BUILD.APARTMENT, ROOFS[rint(0, ROOFS.length - 1)], chance(0.4) ? pick(SG.shops) : ''); return; }
      add(BUILD.GECEKONDU, '#b08a5a', chance(0.12) ? pick(SG.shops) : '', '', 0);
      return;
    }
    if (pf === 'gece') {
      if (area >= 6 && chance(0.7)) {
        const r = add(BUILD.CLUB, pick(SG.neon), pick(SG.clubs), '#1b1426', rint(1, 3));
        r.neon = true;
        this.addProp(c, PROP.QUEUE, r.x + r.w / 2, r.y + r.h + 24);
        return;
      }
      const shop = area <= 6 ? BUILD.SHOP : BUILD.APARTMENT;
      add(shop, ROOFS[rint(0, ROOFS.length - 1)], pick(SG.shops));
      return;
    }
    if (pf === 'esnaf') {
      if (area <= 9 || chance(0.5)) { add(BUILD.SHOP, ROOFS[rint(0, ROOFS.length - 1)], pick(SG.shops), '', rint(0, 2)); return; }
      if (w >= 3 && chance(0.6)) { add(BUILD.SHOPROW, '#c8c0b0', pick(SG.shops)); return; }
    }
    // Büyük parseller: kuleler, rezidans, ofis, otel, iş hanı
    if (area >= 36) {
      const k = pf === 'downtown' ? rint(0, 5) : rint(1, 4);
      if (k === 0) { add(BUILD.SKYSCRAPER, pick(TOWER_COLORS), pick(SG.bigshops), '#0f2038', 3); return; }
      if (k === 1) { add(BUILD.RESIDENCE, '#8aa0b8', pick(SG.bigshops), '#1f3a68', 2); return; }
      if (k === 2) { add(BUILD.OFFICE, '#8aa0b8', chance(0.5) ? pick(SG.bigshops) : ''); return; }
      if (k === 3) { add(BUILD.HOTEL, '#8aa0b8', pick(SG.hotels), '#7a5a1c', 2); return; }
      if (k === 4) { add(BUILD.ISHANI, '#b0b4b8', pick(SG.bigshops)); return; }
      add(rint(BUILD.TOWER_GLASS, BUILD.TOWER_STEP), pick(TOWER_COLORS));
      return;
    }
    if (area >= 12 && chance(0.2)) {
      const brand = pick(keys(SG.chains));
      const r = add(BUILD.CHAIN, SG.chains[brand], brand, SG.chains[brand], 2);
      r.brand = brand;
      return;
    }
    if (area >= 12 && chance(0.08)) { add(BUILD.MARKET, pick(SG.colors), pick(SG.markets)); return; }
    if (area >= 6 && chance(0.13)) { const n = pick(keys(SG.banks)); add(BUILD.BANK, '#d7dbdf', n, SG.banks[n], 1); return; }
    if (pf === 'downtown' && area >= 12) {
      if (chance(0.5)) { add(BUILD.OFFICE, '#8aa0b8', ''); return; }
      add(BUILD.RESIDENCE, '#8aa0b8', pick(SG.bigshops), '#1f3a68', 1);
      return;
    }
    if (w >= 4 && chance(0.14)) { add(BUILD.SHOPROW, '#c8c0b0', pick(SG.shops)); return; }
    if (area <= 6) {
      if (chance(0.65)) { add(BUILD.SHOP, ROOFS[rint(0, ROOFS.length - 1)], pick(SG.shops), '', rint(0, 2)); return; }
      add(chance(0.5) ? BUILD.VILLA : BUILD.GECEKONDU, '#efe6d4');
      return;
    }
    add(BUILD.APARTMENT, ROOFS[rint(0, ROOFS.length - 1)], chance(0.65) ? pick(SG.shops) : '');
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

  // Site: çok bloklu, ortası havuz ve yeşil alan, kenarda otopark. layout mimariyi değiştirir
  fillSite(c, name, color, layout, withSign) {
    this.setGround(c, ART, ART, CT, CT, GROUND.GRASS);
    this.setGround(c, ART, ART, CT, ART + 1, GROUND.WALK);
    this.setGround(c, ART, CT - 1, CT, CT, GROUND.WALK);
    this.setGround(c, ART, ART, ART + 1, CT, GROUND.WALK);
    this.setGround(c, CT - 1, ART, CT, CT, GROUND.WALK);
    c.siteName = name;
    // Ortada havuz: içine düşülmez, kenarı duvar gibidir
    const mid = (CT + ART) >> 1;
    this.setGround(c, mid - 3, mid - 3, mid + 3, mid + 3, GROUND.PLAZA);
    this.addRect(c, 'water', mid - 3, mid - 3, mid + 3, mid + 3, 6, 0, '#57c1f0');
    const q = (v) => Math.round((v * CT) / 24);
    const blocks = layout === 0
      ? [[6, 6], [12, 6], [18, 6], [6, 11], [18, 11], [6, 17], [12, 17], [18, 17]]
      : [[7, 6], [15, 6], [6, 12], [18, 12], [7, 18], [15, 18]];
    const bw = q(layout === 0 ? 4 : 5);
    const bh = q(4);
    for (const [x, y] of blocks) {
      const r = this.place(c, 'building', q(x), q(y), bw, bh, BUILD.SITE_BLOCK, color);
      if (r && withSign && !c.siteSigned) { r.sign = name; r.signColor = '#23422f'; r.signSize = 2; c.siteSigned = true; }
    }
    c.siteSigned = false;
    this.addPad(c, 'parking', ART + 1, ART + 1, CT - ART - 2, 2);
    this.scatter(c, PROP.TREE, 34, [GROUND.GRASS]);
    this.scatter(c, PROP.BENCH, 10, [GROUND.GRASS]);
    this.scatter(c, PROP.BUSH, 16, [GROUND.GRASS]);
    // Otopark sırası
    for (let k = 7; k < CT - 2; k += 2) this.addProp(c, PROP.PARKED, c.x + (k + 0.5) * TILE, c.y + (ART + 1.6) * TILE, Math.PI / 2);
  }

  // Tek seferlik büyük siteler. Bir site 2x2 chunk kaplar
  bigSiteAt(cx, cy) {
    if (!this.sites) {
      this.sites = [];
      const out = { biome: '', sea: false };
      W.bigSites.forEach((s, n) => {
        const [a, b] = s.ring;
        for (let i = 0; i < 500; i++) {
          seedRng(i, 91 + n, this.seed ^ 0x2468);
          const r = a + rnd() * (b - a);
          const t = rnd() * 6.283;
          const ax = Math.round(Math.cos(t) * r);
          const ay = Math.round(Math.sin(t) * r);
          this.biomeAt(ax, ay, out);
          const sis = this.sistem;
          const clash = this.sites.some((o) => Math.abs(o.cx - ax) < 3 && Math.abs(o.cy - ay) < 3) || (Math.abs(sis.cx - ax) < 3 && Math.abs(sis.cy - ay) < 3);
          if (out.biome === 'city' && !clash && Math.max(Math.abs(ax), Math.abs(ay)) > 3) {
            this.sites.push({ ...s, cx: ax, cy: ay });
            break;
          }
        }
      });
    }
    for (const s of this.sites) if (cx - s.cx >= 0 && cx - s.cx <= 1 && cy - s.cy >= 0 && cy - s.cy <= 1) return s;
    return null;
  }

  addLight(c, kind, x, y, w, h, rect) {
    let l = c.lights[c.lightCount];
    if (!l) { l = { kind: 0, x: 0, y: 0, w: 0, h: 0, rect: null }; c.lights[c.lightCount] = l; }
    c.lightCount++;
    l.kind = kind; l.x = x; l.y = y; l.w = w; l.h = h; l.rect = rect;
  }

  // Gece ışıkları: 0 sokak lambası, 1 pencere, 2 neon, 3 tabela
  collectLights(c) {
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (r.kind !== 'building' || r.style === BUILD.MESA) continue;
      if (r.style !== BUILD.STADIUM) this.addLight(c, 1, r.x + 3, r.y + r.h - 12, r.w - 6, 11, r);
      if (r.sign) this.addLight(c, r.neon ? 2 : 3, r.x, r.y, r.w, r.h, r);
    }
    if (c.biome === 'city' || c.biome === 'beach') {
      for (let k = ART + 2; k < CT - 1; k += 5) {
        this.addLight(c, 0, c.x + ART * TILE - 9, c.y + (k + 0.5) * TILE, 0, 0, null);
        this.addLight(c, 0, c.x + (k + 0.5) * TILE, c.y + ART * TILE - 9, 0, 0, null);
      }
      for (let i = 0; i < c.streetCount; i++) {
        const s = c.streets[i];
        const m = (s.pos + s.width / 2) * TILE;
        for (let k = ART + 4; k < CT - 1; k += 8) {
          if (s.vertical) this.addLight(c, 0, c.x + m, c.y + (k + 0.5) * TILE, 0, 0, null);
          else this.addLight(c, 0, c.x + (k + 0.5) * TILE, c.y + m, 0, 0, null);
        }
      }
    }
  }

  // Üstü kapalı pazar yeri ve çevresindeki tezgâhlar
  fillPazar(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.PLAZA);
    this.addRect(c, 'building', 8, 8, 28, 13, 3, BUILD.BAZAAR, '#d9281e');
    this.addRect(c, 'building', 8, 16, 28, 21, 3, BUILD.BAZAAR, '#1d6fb8');
    this.addRect(c, 'building', 8, 24, 28, 29, 3, BUILD.BAZAAR, '#178a4d');
    this.scatter(c, PROP.STALL, 22, [GROUND.PLAZA]);
    this.scatter(c, PROP.CHAIRS, 8, [GROUND.PLAZA]);
    this.scatter(c, PROP.UNCLES, 5, [GROUND.PLAZA]);
    this.scatter(c, PROP.SIMITCART, 4, [GROUND.PLAZA]);
  }

  // Haritanın tek Sistem Koleji chunk'ı: tohuma bağlı, başlangıca yakın bir şehir bölgesinde
  sistemChunk() {
    if (this.sistem) return this.sistem;
    const [a, b] = W.sistemRing;
    const out = { biome: '', sea: false };
    let found = null;
    for (let i = 0; i < 400 && !found; i++) {
      seedRng(i, 77, this.seed ^ 0x1357);
      const r = a + rnd() * (b - a);
      const t = rnd() * 6.283;
      const cx = Math.round(Math.cos(t) * r);
      const cy = Math.round(Math.sin(t) * r);
      this.biomeAt(cx, cy, out);
      if (out.biome === 'city' && Math.max(Math.abs(cx), Math.abs(cy)) > 1) found = { cx, cy };
    }
    this.sistem = found || { cx: a, cy: a };
    return this.sistem;
  }

  fillSistem(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.PLAZA);
    // Haritanın en büyük binası: chunk'ın neredeyse tamamı
    this.addRect(c, 'building', 5, 5, 30, 27, 3, BUILD.SISTEM, '#ff7a00');
    for (let k = 6; k < 29; k += 3) this.addProp(c, PROP.BENCH, c.x + (k + 0.5) * TILE, c.y + 28.6 * TILE);
    this.scatter(c, PROP.SIMITCART, 3, [GROUND.PLAZA]);
  }

  fillPark(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.GRASS);
    // Serbest sürülebilen çimen, yalnızca ortada gölet
    const pw = rint(5, 8);
    const ph = rint(5, 8);
    const px = rint(8, 22 - pw);
    const py = rint(8, 22 - ph);
    this.setGround(c, px, py, px + pw, py + ph, GROUND.WATER);
    this.addRect(c, 'water', px, py, px + pw, py + ph, 6, 0, '#3aa7e8').deep = true;
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
    this.addRect(c, 'water', a, a, b, b, 4, 1, '#2f9be0').deep = true;
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
    if (n) { const r = this.addRect(c, 'wall', ART, ART, CT, ART + 1, 0, 0, '#dfe4ea'); r.h = 7; }
    if (w) { const r = this.addRect(c, 'wall', ART, ART, ART + 1, CT, 0, 0, '#dfe4ea'); r.w = 7; }
  }

  fillBeach(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.SAND);
    if (chance(0.6)) {
      this.addStreet(c, chance(0.5), rint(8, 26), 3, GROUND.PLAZA); // Sahil yürüyüş yolu
    }
    for (let i = 0; i < 5; i++) {
      this.place(c, 'building', rint(6, 28), rint(6, 28), 2, 2, BUILD.HUT, HUT_COLORS[rint(0, 3)]);
    }
    this.place(c, 'building', rint(7, 26), rint(7, 26), 2, 2, BUILD.LIFEGUARD, '#e8352e');
    if (chance(0.35)) this.place(c, 'building', rint(7, 25), rint(7, 25), 3, 3, BUILD.LIGHTHOUSE, '#e8352e');
    this.scatter(c, PROP.UMBRELLA, 22, [GROUND.SAND]);
    this.scatter(c, PROP.PALM, 16, [GROUND.SAND]);
    this.scatter(c, PROP.BUSH, 4, [GROUND.SAND]);
  }

  fillForest(c) {
    if (chance(0.7)) this.addStreet(c, chance(0.5), rint(9, 25), 3, GROUND.DIRT); // Orman yolu
    if (chance(0.25)) {
      const px = rint(8, 22);
      const py = rint(8, 22);
      if (c.streetCount === 0) {
        this.setGround(c, px, py, px + 6, py + 6, GROUND.WATER);
        this.addRect(c, 'water', px, py, px + 6, py + 6, 6, 0, '#3aa7e8').deep = true;
      }
    }
    for (let i = 0; i < 2; i++) this.place(c, 'building', rint(6, 27), rint(6, 27), 3, 2, BUILD.CABIN, '#7d5230');
    if (chance(0.5)) this.place(c, 'building', rint(7, 27), rint(7, 27), 2, 2, BUILD.FIRETOWER, '#8a6a3f');
    this.scatter(c, PROP.PINE, 95, [GROUND.GRASS]);
    this.scatter(c, PROP.TREE, 22, [GROUND.GRASS]);
    this.scatter(c, PROP.BUSH, 22, [GROUND.GRASS, GROUND.DIRT]);
    this.scatter(c, PROP.ROCK, 6, [GROUND.GRASS]);
  }

  fillDesert(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.SAND);
    if (chance(0.6)) this.addStreet(c, chance(0.5), rint(9, 25), 3, GROUND.DIRT);
    for (let i = 0; i < 3; i++) this.place(c, 'building', rint(6, 23), rint(6, 23), rint(3, 7), rint(3, 6), BUILD.MESA, '#b36a3c', 2);
    for (let i = 0; i < 4; i++) this.place(c, 'building', rint(6, 27), rint(6, 27), rint(2, 3), 2, BUILD.ADOBE, ADOBE_COLORS[rint(0, 2)]);
    if (chance(0.3)) this.place(c, 'building', rint(7, 27), rint(7, 27), 2, 2, BUILD.WATERTOWER, '#9cc6d8');
    if (chance(0.3)) this.place(c, 'building', rint(6, 26), rint(6, 26), 3, 2, BUILD.GAS, '#efefef');
    this.scatter(c, PROP.CACTUS, 34, [GROUND.SAND]);
    this.scatter(c, PROP.ROCK, 12, [GROUND.SAND]);
    this.scatter(c, PROP.BARREL, 4, [GROUND.SAND, GROUND.DIRT]);
  }

  fillRural(c) {
    if (chance(0.7)) this.addStreet(c, chance(0.5), rint(9, 25), 3, GROUND.DIRT); // Köy yolu
    // Tarlalar
    for (let i = 0; i < 4; i++) {
      const x = rint(6, 23);
      const y = rint(6, 23);
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
    this.place(c, 'building', rint(6, 26), rint(6, 26), 4, 3, BUILD.BARN, '#b5352a');
    this.place(c, 'building', rint(6, 27), rint(6, 27), 3, 3, 5, HOUSE_ROOFS[rint(0, HOUSE_ROOFS.length - 1)], 4);
    for (let i = 0; i < 2; i++) this.place(c, 'building', rint(6, 28), rint(6, 28), 2, 2, BUILD.SILO, '#c3cad2');
    if (chance(0.45)) this.place(c, 'building', rint(7, 26), rint(7, 26), 3, 3, BUILD.WINDMILL, '#d9d2c2');
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
    for (let i = 0; i < saved.props.length && i < c.propCount; i++) if (saved.props[i]) c.props[i].alive = false;
    for (let i = 0; i < saved.extra.length; i += 3) this.addProp(c, saved.extra[i], saved.extra[i + 1], saved.extra[i + 2]);
  }

  addPower(x, y, kind) {
    const c = this.chunk(Math.floor(x / CHUNK), Math.floor(y / CHUNK));
    if (c.propCount < 300) this.addProp(c, kind, x, y);
  }

  // Ana yol üstü: kenarda park, yol çalışması, coin sıraları
  arterialDetails(c) {
    const edgeFar = ART * TILE - 13;
    const urban = c.biome === 'city';
    for (let k = ART + 1; k < CT - 1 && urban; k += 2) {
      // Dikey ana yolun doğu kenarı
      if (chance(0.05) && c.ground[k * CT + ART] !== GROUND.ROAD && c.ground[(k + 1) * CT + ART] !== GROUND.ROAD && c.ground[(k - 1) * CT + ART] !== GROUND.ROAD) {
        this.addProp(c, PROP.PARKED, c.x + edgeFar, c.y + (k + 0.5) * TILE, Math.PI / 2);
      }
      if (chance(0.05) && c.ground[ART * CT + k] !== GROUND.ROAD && c.ground[ART * CT + k + 1] !== GROUND.ROAD && c.ground[ART * CT + k - 1] !== GROUND.ROAD) {
        this.addProp(c, PROP.PARKED, c.x + (k + 0.5) * TILE, c.y + edgeFar, 0);
      }
    }
    // Yol çalışması: yolun yarısından azını kaplar, her zaman boşluk kalır
    if (urban && chance(0.3)) {
      const vertical = chance(0.5);
      const s = rint(7, 16);
      for (let i = 0; i < 6; i++) {
        const along = (s + i) * TILE;
        const across = 18 + (i === 0 || i === 5 ? 0 : 22);
        const x = vertical ? across : along;
        const y = vertical ? along : across;
        this.addProp(c, i === 0 || i === 5 ? PROP.BARRIER : PROP.CONE, c.x + x, c.y + y, vertical ? 0 : Math.PI / 2);
      }
    }
    if (chance(0.6)) {
      const vertical = chance(0.5);
      const s = rint(7, 18);
      const lane = chance(0.5) ? 30 : 90;
      for (let i = 0; i < 5; i++) {
        const along = (s + i * 0.9) * TILE;
        this.addProp(c, PROP.COIN, c.x + (vertical ? lane : along), c.y + (vertical ? along : lane));
      }
    }
    if (chance(CONFIG.powers.chunkChance) && !(Math.abs(c.cx) <= 1 && Math.abs(c.cy) <= 1)) {
      const vertical = chance(0.5);
      const along = rint(7, 20) * TILE;
      this.addProp(c, PROP.POWER_BLAST + pickPowerIndex(), c.x + (vertical ? 60 : along), c.y + (vertical ? along : 60));
    }
  }

  finishCost(c) {
    const COST = [3, 1, 2, 1, 0, 3, 2, 3, 3, 1];
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
const SITE_NAMES = CONFIG.signs.sites;
const PASTELS = ['#7fa8c9', '#c9a27f', '#a0a8b8', '#8fb59a', '#c98f8f', '#b0a080', '#9a8fc0'];
const RESERVED = [[CT - 1, ART], [ART, CT - 1], [ART, ART]];
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

const FX = { SMOKE: 0, DARK: 1, FIRE: 2, SPARK: 3, DEBRIS: 4, GLINT: 5, DUST: 6, WATER: 7, SIMIT: 8 };

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
  if (cop.flying) return;
  if (cop.type === 'tank') driveTank(cop, g, dt);
  else drivePatrol(cop, g, dt);
}

// --- crowd.js ---
// Yayalar, sokak insanları, kediler, sivil trafik ve trafik ışıkları.
// Sabit havuz kullanır, sadece oyuncunun çevresinde yaşar.

const PD = CONFIG.peds;
const NP = CONFIG.npc;
const TL = CONFIG.traffic;
const ROAD_W = CONFIG.world.arterial * TILE;
const ART_MID = ROAD_W / 2;
const PED_WALK = 0;
const PED_RUN = 1;
const PED_FLY = 2;
const PED_DOWN = 3;
const PED_WAIT = 4;
const PED_CROSS = 5;
const PED_IDLE = 6;

// Yönler: 0 doğu, 1 güney, 2 batı, 3 kuzey. Trafik sağdan akar.
const DX = [1, 0, -1, 0];
const DY = [0, 1, 0, -1];
const LANE = [1, -1, -1, 1];

const PED_KIND_NAMES = Object.keys(PD.kinds);
let pedWeight = 0;
for (const k of PED_KIND_NAMES) pedWeight += PD.kinds[k].weight;
let npcWeight = 0;
for (const k in NP.types) npcWeight += NP.types[k].weight;

// Trafik ışığı: her kavşağın kendi evresi var. axis: 0 doğu-batı, 1 kuzey-güney
function lightState(time, jx, jy, axis) {
  const cycle = (TL.green + TL.yellow + TL.allRed) * 2;
  const offset = (((jx * 7 + jy * 13) % 16) + 16) % 16;
  const t = (time + offset + (axis ? cycle / 2 : 0)) % cycle;
  if (t < TL.green) return 'g';
  if (t < TL.green + TL.yellow) return 'y';
  return 'r';
}

class Crowd {
  constructor(game) {
    this.g = game;
    this.peds = [];
    for (let i = 0; i < PD.max; i++) {
      this.peds.push({
        alive: false, x: 0, y: 0, a: 0, vx: 0, vy: 0, z: 0, vz: 0, spin: 0, state: 0, t: 0, turnT: 0,
        look: 0, step: 0, scale: 1, pace: 1, kind: 'man', info: PD.kinds.man, tx: 0, ty: 0, axis: 0, jx: 0, jy: 0,
      });
    }
    this.npcs = [];
    for (let i = 0; i < NP.max; i++) {
      const b = makeBody();
      b.alive = false; b.kind = 'tofas'; b.spec = null; b.state = 'drive'; b.color = 0; b.t = 0;
      b.dir = 0; b.line = 0; b.lastCross = 1e9; b.hornT = 0; b.ctlS = 0; b.ctlT = 1; b.breaker = true;
      b.panicT = 0; b.waitT = 0;
      b.drive = { maxSpeed: 0, accel: 0, turnRate: 0, grip: 0, driftGrip: 0 };
      this.npcs.push(b);
    }
    this.pedT = 0;
    this.npcT = 0;
    this.waitT = 0;
    this.limit = 1; // Yavaş cihazda azalır
    this.screamT = 0;
    this.meowT = 0;
    this.pedCount = 0;
    this.npcCount = 0;
    this.clock = 0;
  }

  clear() {
    for (const p of this.peds) p.alive = false;
    for (const n of this.npcs) n.alive = false;
    this.pedCount = 0;
    this.npcCount = 0;
  }

  update(dt) {
    const g = this.g;
    this.clock += dt;
    this.screamT -= dt;
    this.meowT -= dt;
    this.pedT -= dt;
    if (this.pedT <= 0) { this.pedT = PD.spawnEvery; this.spawnPed(); }
    this.waitT -= dt;
    if (this.waitT <= 0) { this.waitT = PD.waiterEvery; this.spawnWaiter(); }
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
  pickKind() {
    let r = Math.random() * pedWeight;
    for (const k of PED_KIND_NAMES) {
      r -= PD.kinds[k].weight;
      if (r < 0) return k;
    }
    return 'man';
  }

  setupPed(p, kind, x, y, a) {
    p.alive = true;
    p.kind = kind;
    p.info = PD.kinds[kind];
    p.x = x; p.y = y; p.z = 0;
    p.a = a;
    p.state = PED_WALK;
    p.t = 0; p.turnT = 1 + Math.random() * 3; p.step = Math.random() * 6;
    const half = PD.looks >> 1;
    p.look = Math.floor(Math.random() * half) + (kind === 'woman' ? half : 0);
    p.scale = 0.84 + Math.random() * 0.32; // Boy farkı
    p.pace = 0.75 + Math.random() * 0.55; // Yürüyüş hızı farkı
    p.curb = false;
  }

  spawnPed() {
    const g = this.g;
    if (this.pedCount >= PD.max * this.limit) return;
    const p = this.peds.find((k) => !k.alive);
    if (!p) return;
    const pl = g.player;
    const R = g.viewRadius();
    const kind = this.pickKind();
    // Yarısı ana yol kenarındaki kaldırım bandında yürür: bina yoğun, boş alan az
    if (!PD.kinds[kind].road && kind !== 'cat' && Math.random() < PD.curbShare && this.spawnCurb(p, kind, pl, R)) return;
    for (let i = 0; i < 14; i++) {
      const a = Math.random() * 6.283;
      const r = R * (0.75 + Math.random() * 0.55);
      const x = pl.x + Math.cos(a) * r;
      const y = pl.y + Math.sin(a) * r;
      if (g.onScreen(x, y, 30)) continue;
      const gr = g.world.groundAt(x, y);
      const chance = gr === GROUND.ROAD && PD.kinds[kind].road ? 1 : PD.density[gr] || 0;
      if (Math.random() > chance || g.world.blockedAt(x, y)) continue;
      this.setupPed(p, kind, x, y, Math.floor(Math.random() * 4) * 1.5708);
      // Bazıları dükkân önünde durur, sohbet eder
      if (!PD.kinds[kind].road && kind !== 'cat' && (gr === GROUND.WALK || gr === GROUND.ALLEY) && Math.random() < PD.idleChance) p.state = PED_IDLE;
      return;
    }
  }

  spawnCurb(p, kind, pl, R) {
    const g = this.g;
    const along = (Math.random() < 0.5 ? -1 : 1) * R * (0.75 + Math.random() * 0.5);
    const vertical = Math.random() < 0.5;
    const base = Math.floor((vertical ? pl.x : pl.y) / CHUNK) + Math.floor(Math.random() * 3) - 1;
    const line = base * CHUNK + ROAD_W - 6;
    const x = vertical ? line : pl.x + along;
    const y = vertical ? pl.y + along : line;
    const at = ((vertical ? y : x) % CHUNK + CHUNK) % CHUNK;
    if (at < ROAD_W + 30 || g.onScreen(x, y, 30)) return false;
    if (g.world.blockedAt(x, y) || g.world.chunk(Math.floor(x / CHUNK), Math.floor(y / CHUNK)).biome !== 'city') return false;
    const dir = Math.random() < 0.5 ? 1 : -1;
    this.setupPed(p, kind, x, y, vertical ? (dir > 0 ? 1.5708 : -1.5708) : (dir > 0 ? 0 : 3.1416));
    p.curb = true;
    if (Math.random() < PD.idleChance) p.state = PED_IDLE;
    return true;
  }

  // Kavşakta yaya geçidi önünde bekleyen yaya: arabalara kırmızı yanınca karşıya geçer
  spawnWaiter() {
    const g = this.g;
    if (this.pedCount >= PD.max * this.limit) return;
    const p = this.peds.find((k) => !k.alive);
    if (!p) return;
    const pl = g.player;
    const jx = Math.floor(pl.x / CHUNK) + Math.floor(Math.random() * 3) - 1;
    const jy = Math.floor(pl.y / CHUNK) + Math.floor(Math.random() * 3) - 1;
    const c = g.world.chunk(jx, jy);
    if (c.biome !== 'city') return;
    const vertical = Math.random() < 0.5; // Dikey ana yolu mu geçiyor
    const flip = Math.random() < 0.5;
    const a = -18;
    const b = ROAD_W + 18;
    const along = ROAD_W + 13;
    const fromS = flip ? b : a;
    const toS = flip ? a : b;
    const x = c.x + (vertical ? fromS : along);
    const y = c.y + (vertical ? along : fromS);
    const tx = c.x + (vertical ? toS : along);
    const ty = c.y + (vertical ? along : toS);
    if (g.onScreen(x, y, 40) || g.world.blockedAt(x, y) || g.world.blockedAt(tx, ty)) return;
    let kind = this.pickKind();
    if (PD.kinds[kind].road || PD.kinds[kind].dodge) kind = 'man';
    this.setupPed(p, kind, x, y, Math.atan2(ty - y, tx - x));
    p.state = PED_WAIT;
    p.tx = tx; p.ty = ty;
    p.axis = vertical ? 1 : 0;
    p.jx = jx; p.jy = jy;
    p.t = 14;
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
    g.fx.burst(FX.GLINT, p.x, p.y, 7, 150, 0.45, 4); // Çizgi film yıldızları
    g.fx.burst(FX.DUST, p.x, p.y, 4, 60, 0.5, 8);
    const info = p.info;
    if (info.fx === 'simit') {
      g.fx.burst(FX.SIMIT, p.x, p.y, 12, 240, 1.3, 7);
      g.emit('simit');
    } else if (info.fx === 'tea') {
      g.fx.debris(p.x, p.y, '#c9622b', 6, 200);
      g.fx.debris(p.x, p.y, '#e8f3ff', 6, 240);
      g.emit('tea');
    }
    if (scream && this.screamT <= 0) {
      this.screamT = 0.2;
      g.lastVoice = info.voice;
      g.emit('scream', Math.min(1, 500 / (Math.hypot(p.x - g.player.x, p.y - g.player.y) + 200)));
      const words = info.words || PD.words[info.voice];
      if (Math.random() < 0.6) g.fx.float(p.x, p.y - 16, words[Math.floor(Math.random() * words.length)], '#ffffff');
    }
    g.emit('thud');
  }

  blockedForPed(p, x, y) {
    const w = this.g.world;
    return w.blockedAt(x, y) || (!p.info.road && !p.curb && w.groundAt(x, y) === GROUND.ROAD);
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

    if (p.state === PED_IDLE) {
      const ix = p.x - pl.x;
      const iy = p.y - pl.y;
      if (ix * ix + iy * iy < PD.fearDist * PD.fearDist && pl.speed > 150 && g.state === 'play') {
        p.state = PED_RUN;
        p.a = Math.atan2(iy, ix);
        p.turnT = 1.6;
      }
      return;
    }
    if (p.state === PED_WAIT) {
      p.t -= dt;
      if (lightState(this.clock, p.jx, p.jy, p.axis) === 'r') p.state = PED_CROSS;
      else if (p.t <= 0) p.state = PED_WALK;
      return;
    }
    if (p.state === PED_CROSS) {
      const dx = p.tx - p.x;
      const dy = p.ty - p.y;
      const d = Math.hypot(dx, dy);
      if (d < 8) { p.state = PED_WALK; return; }
      const v = PD.walkSpeed * 2.1 * dt;
      p.x += (dx / d) * v;
      p.y += (dy / d) * v;
      p.step += dt * 16;
      return;
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
        g.lastVoice = p.info.voice;
        g.emit('scream', 0.45);
      }
    }
    const speed = (p.state === PED_RUN ? PD.runSpeed : PD.walkSpeed * p.info.speed) * p.pace;
    const nx = p.x + Math.cos(p.a) * speed * dt;
    const ny = p.y + Math.sin(p.a) * speed * dt;
    const lookX = p.x + Math.cos(p.a) * 16;
    const lookY = p.y + Math.sin(p.a) * 16;
    if (p.state === PED_WALK ? this.blockedForPed(p, lookX, lookY) : g.world.blockedAt(lookX, lookY)) {
      p.a += p.curb ? 3.1416 : (Math.random() < 0.5 ? 1 : -1) * 1.5708;
      p.turnT = 1 + Math.random() * 3;
    } else {
      p.x = nx;
      p.y = ny;
    }
    if (p.curb && p.state === PED_WALK) {
      // Kavşağa gelince geri döner, kaldırımdan yola inmez
      const at = ((Math.abs(Math.cos(p.a)) > 0.5 ? p.x : p.y) % CHUNK + CHUNK) % CHUNK;
      if (at < ROAD_W + 26 && p.turnT < 90) { p.a += 3.1416; p.x += Math.cos(p.a) * 30; p.y += Math.sin(p.a) * 30; }
    }
    p.step += dt * (speed * 0.3);
    p.turnT -= dt;
    if (p.turnT <= 0) {
      p.turnT = 1.5 + Math.random() * 4;
      if (p.state === PED_RUN) p.state = PED_WALK;
      else if (!p.curb) p.a += (Math.floor(Math.random() * 3) - 1) * 1.5708;
    }
  }

  checkHit(p, b, isPlayer) {
    const r = b.len * 0.44 + 7;
    const dx = p.x - b.x;
    const dy = p.y - b.y;
    if (dx * dx + dy * dy >= r * r) return false;
    const speed = Math.hypot(b.vx, b.vy);
    // Kedi ezilmez: son anda sıçrar
    if (p.info.dodge) {
      const d = Math.hypot(dx, dy) || 1;
      p.x += (dx / d) * 34;
      p.y += (dy / d) * 34;
      p.a = Math.atan2(dy, dx);
      p.state = PED_RUN;
      p.turnT = 1.4;
      if (this.meowT <= 0) {
        this.meowT = 1;
        this.g.lastVoice = 'cat';
        this.g.emit('scream', 0.5);
      }
      return false;
    }
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
      if (!p.alive || p.state === PED_FLY || p.info.dodge) continue;
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
    g.fx.debris(n.x, n.y, n.spec.colors[n.color], 12, 260);
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

    let r = Math.random() * npcWeight;
    let kind = 'tofas';
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
    n.color = Math.floor(Math.random() * spec.colors.length);
    n.t = 0;
    n.lastCross = 1e9;
    n.hornT = 0;
    n.panicT = 0;
    n.waitT = 0;
    n.drive.maxSpeed = spec.cruise * (0.9 + Math.random() * 0.2);
    n.drive.accel = 260;
    n.drive.turnRate = spec.turnRate;
    n.drive.grip = spec.grip;
    n.drive.driftGrip = spec.grip;
    n.vx = DX[n.dir] * n.drive.maxSpeed;
    n.vy = DY[n.dir] * n.drive.maxSpeed;
  }

  // Öndeki kavşağa uzaklık. Kavşağa gelince bazen sağa ya da sola döner
  crossing(n) {
    const horizontal = n.dir === 0 || n.dir === 2;
    const forward = n.dir === 0 || n.dir === 1;
    const pos = horizontal ? n.x : n.y;
    const u = (pos - ART_MID) / CHUNK;
    const k = forward ? Math.ceil(u) : Math.floor(u);
    const center = k * CHUNK + ART_MID;
    const ahead = (center - pos) * (forward ? 1 : -1);
    if (ahead < 70 && n.lastCross !== k) {
      n.lastCross = k;
      if (Math.random() < NP.turnChance) {
        n.dir = (n.dir + (Math.random() < 0.5 ? 1 : 3)) % 4;
        n.line = center;
        n.lastCross = 1e9;
        return 1e9;
      }
    }
    n.jk = k;
    return ahead;
  }

  hold(n) {
    n.ctlS = 0;
    if (n.speed > 14) n.ctlT = -0.75;
    else { n.ctlT = 0; n.vx *= 0.8; n.vy *= 0.8; }
  }

  updateNpc(n, dt, g) {
    const p = g.player;
    const far = Math.max(Math.abs(n.x - p.x), Math.abs(n.y - p.y));
    if (far > NP.despawn) { n.alive = false; return; }
    n.t += dt;
    if (n.hornT > 0) n.hornT -= dt;

    if (n.state === 'drive') this.driveNpc(n, dt, g);
    else {
      n.ctlS = 0;
      n.ctlT = 0;
      n.grip = Math.min(n.grip, 1.2); // Savrulurken lastik tutmaz
      if (n.t > 2 && Math.random() < 0.08) g.fx.spawn(FX.SMOKE, n.x, n.y, 0, 0, 0.9, 11);
    }
    const surf = CONFIG.surfaces[g.world.groundAt(n.x, n.y)];
    stepCar(n, n.ctlS, n.ctlT, n.drive, surf, dt);
    g.collideWorld(n, false);
    if ((g.tickCount + n.dir) % 4 < 1 && g.onScreen(n.x, n.y, 120)) g.collideProps(n, false);

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

  driveNpc(n, dt, g) {
    const p = g.player;
    const ahead = this.crossing(n);
    const horizontal = n.dir === 0 || n.dir === 2;

    // Panik: siren ya da hızlı oyuncu yaklaşınca kenara kaçar, korna çalar, ışık dinlemez
    if (n.panicT > 0) n.panicT -= dt;
    let threat = g.state === 'play' && p.speed > NP.panicSpeed && Math.hypot(p.x - n.x, p.y - n.y) < NP.panicDist;
    if (!threat && g.state === 'play') {
      for (const c of g.cops) {
        if (Math.abs(c.x - n.x) < NP.panicDist && Math.abs(c.y - n.y) < NP.panicDist && c.state === 'chase') { threat = true; break; }
      }
    }
    if (threat) {
      if (n.panicT <= 0 && n.hornT <= 0) {
        n.hornT = 2.5;
        g.emit('horn', n.spec.horn);
      }
      n.panicT = NP.panicTime;
    }
    const panic = n.panicT > 0;
    const offset = panic ? NP.panicLane : NP.laneOffset;
    const lane = n.line + LANE[n.dir] * offset;
    const tx = horizontal ? n.x + DX[n.dir] * 90 : lane;
    const ty = horizontal ? lane : n.y + DY[n.dir] * 90;
    const err = wrapAngle(Math.atan2(ty - n.y, tx - n.x) - n.a);
    const top = n.drive.maxSpeed * (panic ? NP.panicBoost : 1);
    n.ctlS = Math.max(-1, Math.min(1, err * 2.4));
    n.ctlT = Math.abs(err) > 0.5 && n.speed > 110 ? -0.4 : n.speed < top ? 1 : 0;

    // Öndeki araç
    const fx = Math.cos(n.a);
    const fy = Math.sin(n.a);
    let blocked = false;
    for (const o of this.npcs) {
      if (o === n || !o.alive) continue;
      const ax = o.x - n.x;
      const ay = o.y - n.y;
      const front = ax * fx + ay * fy;
      const gap = (n.len + o.len) / 2 + 26 + n.speed * 0.22;
      if (front > 0 && front < gap && Math.abs(-ax * fy + ay * fx) < 26) { blocked = true; break; }
    }

    // Trafik ışığı: yalnızca şehir kavşaklarında
    let waiting = false;
    if (ahead < 1e8 && !panic) {
      const stopDist = ahead - TL.stopLine;
      const need = (n.speed * n.speed) / (2 * TL.brake) + 18;
      if (stopDist > -4 && stopDist < need) {
        const jx = horizontal ? n.jk : Math.floor(n.line / CHUNK);
        const jy = horizontal ? Math.floor(n.line / CHUNK) : n.jk;
        if (g.world.chunk(jx, jy).biome === 'city' && lightState(this.clock, jx, jy, horizontal ? 0 : 1) !== 'g') waiting = true;
      }
    }
    if (waiting || blocked) this.hold(n);

    // Önündeki oyuncuya fren ve korna
    const ax = p.x - n.x;
    const ay = p.y - n.y;
    const front = ax * fx + ay * fy;
    const side = Math.abs(-ax * fy + ay * fx);
    if (front > 0 && front < 150 + n.len && side < 34 && !panic) {
      n.ctlT = -0.8;
      if (n.hornT <= 0 && g.state === 'play') {
        n.hornT = 3;
        g.emit('horn', n.spec.horn);
      }
    }

    // Işıkta bekleyen sabırsız korna
    if (n.speed < 20 && (waiting || blocked)) {
      n.waitT += dt;
      if (n.waitT > TL.hornAfter && n.hornT <= 0 && Math.random() < dt * TL.hornRate && Math.hypot(ax, ay) < 900) {
        n.hornT = 2;
        g.emit('horn', n.spec.horn);
      }
    } else {
      n.waitT = 0;
    }
  }

  hitNpc(n, rv, byPlayer) {
    const g = this.g;
    if (n.state !== 'wreck') { n.state = 'wreck'; n.t = 0; }
    n.w += (Math.random() < 0.5 ? -1 : 1) * Math.min(5, rv / 90) / Math.sqrt(n.mass);
    g.fx.sparks(n.x, n.y, 8);
    g.fx.debris(n.x, n.y, n.spec.colors[n.color], 4);
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
const AL = CONFIG.aliens;
const WT = CONFIG.water;
const tmpSirens = new Float32Array(CONFIG.sirens.length);

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
  out.ufos = t >= D.aliensAt ? Math.round(interp(AL.ufoCount, t)) : 0;
  out.rovers = t >= D.aliensAt ? Math.round(interp(AL.roverCount, t)) : 0;
  return out;
}

// Gece-gündüz: k gece oranı, r/g/b/a ekran rengi. Gündüz boş, alacakaranlık turuncu, gece lacivert
function dayState(t, out = {}) {
  const Y = CONFIG.day;
  const p = ((t / Y.length + Y.start) % 1 + 1) % 1;
  let k = 0;
  if (p >= Y.duskFrom && p < Y.nightFrom) k = (p - Y.duskFrom) / (Y.nightFrom - Y.duskFrom);
  else if (p >= Y.nightFrom && p < Y.dawnFrom) k = 1;
  else if (p >= Y.dawnFrom) k = 1 - (p - Y.dawnFrom) / (1 - Y.dawnFrom);
  k = k * k * (3 - 2 * k);
  const warm = Math.sin(Math.min(1, k * 1.15) * Math.PI); // Geçişte turuncu
  out.k = k;
  out.a = +(k * Y.darkness + warm * 0.14).toFixed(3);
  out.r = Math.round(8 + warm * 190);
  out.g = Math.round(12 + warm * 70);
  out.b = Math.round(46 - warm * 20);
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
    this.dayT = 0;
    this.daylight = dayState(0);
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
    this.cam = { x: 0, y: 0, zoom: 1, shake: 0, sx: 0, sy: 0, kx: 0, ky: 0, lvx: 0, lvy: 0, scale: 1, halfW: 200, halfH: 400 };
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
    this.stopT = 0;
    this.stuckT = 0;
    this.autoRevT = 0;
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
    this.alienT = 0;
    this.aliensOn = startTime >= D.aliensAt;
    this.sinkT = 0;
    this.bubbleT = 0;
    this.cause = '';
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
    this.dayT = 0;
    dayState(0, this.daylight);
    resetBody(this.player, 100, 300, Math.PI / 2, carSpec);
    this.player.vy = 120;
    this.player.vx = 0;
    this.state = 'play';
    this.cam.x = this.player.x;
    this.cam.y = this.player.y;
    this.cam.zoom = 1;
    this.cam.shake = 0;
    this.cam.lvx = 0;
    this.cam.lvy = 0;
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
    if (this.state === 'play') {
      this.dayT += dt;
      if (this.tickCount % 12 === 0) dayState(this.dayT, this.daylight);
    }
    // Sert darbede kısa duraksama: çarpışma hissi
    if (this.stopT > 0) {
      this.stopT -= dt;
      this.fx.update(dt);
      this.updateCamera(dt);
      return;
    }
    if (this.state === 'attract') this.tickAttract(dt);
    else if (this.state === 'play') this.tickPlay(dt, steer, reverse);
    else if (this.state === 'dying') this.tickDying(dt);
    else if (this.state === 'sinking') this.tickSinking(dt);
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
    if (!this.aliensOn && this.time >= D.aliensAt) {
      this.aliensOn = true;
      this.warnT = 3;
      this.emit('aliens');
    }

    this.updatePlayer(dt, steer, reverse);
    if (this.state !== 'play') return;
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

  // Suya düşen araç: çizgi film batışı. Sıçrama, kabarcık, dalga halkaları, sonra skor ekranı
  startSink() {
    const p = this.player;
    this.state = 'sinking';
    this.sinkT = WT.sinkTime;
    this.cause = 'water';
    this.fx.burst(FX.WATER, p.x, p.y, 34, 340, 0.9, 13);
    this.fx.wave(p.x, p.y, 150);
    this.cam.shake = Math.max(this.cam.shake, 9);
    this.emit('sink');
  }

  tickSinking(dt) {
    this.sinkT -= dt;
    const p = this.player;
    p.vx *= 1 - 2.6 * dt;
    p.vy *= 1 - 2.6 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.a += WT.spin * dt;
    this.bubbleT -= dt;
    if (this.bubbleT <= 0) {
      this.bubbleT = WT.bubbleEvery;
      this.fx.spawn(FX.WATER, p.x + (Math.random() - 0.5) * p.len, p.y + (Math.random() - 0.5) * p.len, 0, -26 - Math.random() * 40, 0.8, 4 + Math.random() * 6);
      if (Math.random() < 0.09) this.fx.wave(p.x, p.y, 60 + Math.random() * 70);
    }
    this.world.update(p.x, p.y);
    this.updateCops(dt * 0.5);
    this.crowd.update(dt);
    if (this.sinkT <= 0) this.finish();
  }

  sinkProgress() {
    return this.state === 'sinking' ? 1 - this.sinkT / WT.sinkTime : 0;
  }

  // --- Oyuncu ---
  updatePlayer(dt, steer, reverse) {
    const p = this.player;
    const g = this.world.groundAt(p.x, p.y);
    const surf = CONFIG.surfaces[g];
    // Duvara saplanınca kendiliğinden geri çıkar: tek parmakla oyun kilitlenmesin
    if (this.autoRevT > 0) {
      this.autoRevT -= dt;
      reverse = true;
    } else if (p.speed < 40 && !reverse) {
      this.stuckT += dt;
      if (this.stuckT > DMG.autoReverseAfter) {
        this.stuckT = 0;
        this.autoRevT = DMG.autoReverseTime;
      }
    } else {
      this.stuckT = 0;
    }
    stepCar(p, steer, reverse ? -1 : 1, this.carSpec, surf, dt);
    if (this.hitCd > 0) this.hitCd -= dt;

    // Derin suya düştü: ölümsüzlükte duvar gibi davranır, testler ve geliştirici için
    if (g === GROUND.WATER && !this.god && this.world.circleHit(p.x, p.y, WT.deepProbe, hit) && isDeep(hit.rect)) {
      this.startSink();
      return;
    }

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
    if (dmg >= DMG.hitStopMin) this.stopT = DMG.hitStop;
    // Kamera darbenin yönüne itilir
    const sp = p.speed || 1;
    this.cam.kx = (p.vx / sp) * CONFIG.camera.kick * Math.min(1, dmg / 20);
    this.cam.ky = (p.vy / sp) * CONFIG.camera.kick * Math.min(1, dmg / 20);
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
    this.cause = 'wreck';
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
    const earned = this.coins + Math.floor(this.runTime / SC.coinPerSeconds) + this.kills * SC.coinPerKill + Math.floor(this.nearMisses / SC.coinPerNearMisses);
    this.result = {
      score: Math.floor(this.score),
      time: this.time,
      coins: earned,
      kills: this.kills,
      broken: this.broken,
      driftTime: this.driftTime,
      nearMisses: this.nearMisses,
      cause: this.cause,
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
      if (isPlayer && !this.god && isDeep(rect)) continue; // Oyuncu suya girer, batış ayrı karar verilir
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
          if (info.pass) continue;
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
    if (info.snd) {
      this.emit(info.snd);
      if (pr.kind === PROP.SIMITCART) this.fx.burst(FX.SIMIT, pr.x, pr.y, 10, 210, 1.2, 7);
      if (pr.kind === PROP.UNCLES) {
        this.lastVoice = 'old';
        this.emit('scream', 0.8);
        this.fx.float(pr.x, pr.y - 16, 'HAYIRDIR EVLADIM!', '#ffffff');
      }
    }
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
    const spec = CONFIG.police[type] || AL[type];
    const c = this.copPool.pop() || makeCop();
    const d = this.diff;
    resetBody(c, x, y, a, { ...spec, grip: spec.grip });
    c.id = this.nextId++;
    c.type = type;
    c.spec = spec;
    c.role = role;
    c.state = 'chase';
    c.crusher = type === 'tank';
    c.flying = type === 'ufo';
    c.beam = 0;
    c.sirenId = spec.siren ? this.pickSiren(spec.siren) : -1;
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

  // En az kullanılan siren: aynı anda gelen polisler farklı duyulur.
  // Eşitlikte önce araç tipinin sireni, sonra rastgele biri
  pickSiren(pref) {
    const n = CONFIG.sirens.length;
    const use = new Array(n).fill(0);
    for (const c of this.cops) if (c.sirenId >= 0) use[c.sirenId]++;
    const p = CONFIG.sirens.indexOf(pref);
    if (pref === 'ufo' || pref === 'zap') return p; // Uzaylıların sesi kendine özgü
    const police = n - 2;
    let min = 1e9;
    for (let i = 0; i < police; i++) if (use[i] < min) min = use[i];
    if (use[p] === min) return p;
    const free = [];
    for (let i = 0; i < police; i++) if (use[i] === min) free.push(i);
    return free[Math.floor(Math.random() * free.length)];
  }

  removeCop(i) {
    const c = this.cops[i];
    this.cops[i] = this.cops[this.cops.length - 1];
    this.cops.pop();
    this.copPool.push(c);
  }

  destroyCop(i, byPlayer) {
    const c = this.cops[i];
    const size = c.type === 'tank' ? 120 : c.type === 'swat' ? 70 : c.type === 'ufo' ? 110 : 52;
    this.fx.explosion(c.x, c.y, size);
    this.fx.debris(c.x, c.y, c.type === 'tank' ? '#5d6b3a' : c.type === 'ufo' || c.type === 'rover' ? '#39ff9c' : '#2f4c8a', 12, 280);
    this.fx.debris(c.x, c.y, '#f4f4f4', 6, 240);
    this.kills++;
    this.addScore(SC.kill * (c.type === 'tank' ? 8 : c.type === 'ufo' ? 6 : c.type === 'rover' ? 3 : c.type === 'swat' ? 2 : 1), c.x, c.y, byPlayer ? SC.comboKillStep : 0);
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
    sirens.fill(1e9);
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

      if (c.flying) {
        this.updateUfo(c, dt, playing);
      } else if (c.state === 'barricade') {
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
        if (!c.flying && dist < (c.len + p.len) * 0.75 && this.ghostT <= 0) {
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
        if (c.sirenId >= 0 && dist < sirens[c.sirenId]) sirens[c.sirenId] = dist;
        if (c.type === 'tank' && this.ghostT <= 0) this.tankFire(c, dist, dt);
      }
    }

    // Polisler birbirinin içinden geçmez
    const cops = this.cops;
    for (let i = 0; i < cops.length; i++) {
      for (let j = i + 1; j < cops.length; j++) {
        const a = cops[i];
        const b = cops[j];
        if (a.flying || b.flying) continue;
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

  // Uçan daire: binaların üstünden düz gelir, üstüne çıkınca ışınla çeker ve hasar verir
  updateUfo(c, dt, playing) {
    const p = this.player;
    const dx = p.x + p.vx * 0.35 - c.x;
    const dy = p.y + p.vy * 0.35 - c.y;
    const d = Math.hypot(dx, dy) || 1;
    const top = c.drive.maxSpeed;
    const slow = this.ghostT > 0 ? 0.25 : 1;
    const want = Math.min(top, d * 3.2) * slow;
    const k = 1 - Math.exp(-3.4 * dt);
    c.vx += ((dx / d) * want - c.vx) * k;
    c.vy += ((dy / d) * want - c.vy) * k;
    c.x += c.vx * dt;
    c.y += c.vy * dt;
    c.a += dt * 2;
    const bx = p.x - c.x;
    const by = p.y - c.y;
    const bd = Math.hypot(bx, by);
    c.beam = playing && this.ghostT <= 0 && bd < AL.beamRange ? 1 : 0;
    if (c.beam) {
      p.vx -= (bx / (bd + 1)) * AL.beamPull * dt;
      p.vy -= (by / (bd + 1)) * AL.beamPull * dt;
      const keep = 1 - AL.beamSlow * dt;
      p.vx *= keep;
      p.vy *= keep;
      this.hurt((AL.beamDps * dt) / this.carSpec.durability);
      this.sinceHit = 0;
      this.hitFlash = Math.max(this.hitFlash, 0.25);
      if (Math.random() < 0.3) this.fx.spawn(FX.GLINT, p.x + (Math.random() - 0.5) * 60, p.y + (Math.random() - 0.5) * 60, 0, 0, 0.4, 5);
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
    // Oyuncu çok açılırsa kovalama kopmasın
    if (this.sirenDist > AI.catchUpDist && this.spawnT > 0.6) this.spawnT = 0.6;
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

    if (d.ufos > 0 && active < D.maxActive - 1) {
      this.alienT -= dt;
      if (this.alienT <= 0) {
        this.alienT = AL.spawnEvery;
        const min = this.viewRadius() + 160;
        const heading = Math.atan2(p.vy, p.vx) + (Math.random() - 0.5) * 2.6;
        if (this.countType('ufo') < d.ufos) {
          // Daire binaya takılmaz, önünden gelir
          this.spawnCop('ufo', 'chaser', p.x + Math.cos(heading) * min, p.y + Math.sin(heading) * min, 0);
        }
        if (this.countType('rover') < d.rovers && this.findSpawn(spawnPt, min, min + 300, true)) {
          this.spawnCop('rover', Math.random() < 0.5 ? 'flanker' : 'chaser', spawnPt.x, spawnPt.y, Math.atan2(p.y - spawnPt.y, p.x - spawnPt.x));
        }
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
    // Bakış yönü yumuşatılır: drift sırasında kamera sallanmaz
    const ls = 1 - Math.exp(-V.lookSmooth * dt);
    c.lvx += (p.vx - c.lvx) * ls;
    c.lvy += (p.vy - c.lvy) * ls;
    const tx = p.x + c.lvx * V.lookAhead;
    // Menüde araba üst tarafta, düğmelerin arkasında kalmasın
    const ty = p.y + c.lvy * V.lookAhead + (this.state === 'attract' ? c.halfH * 0.6 : 0);
    const k = 1 - Math.exp(-(V.follow + (V.followFast - V.follow) * speedK) * dt);
    c.x += (tx - c.x) * k;
    c.y += (ty - c.y) * k;
    c.kx *= Math.exp(-9 * dt);
    c.ky *= Math.exp(-9 * dt);
    if (c.shake > 0.05) {
      c.sx = (Math.random() - 0.5) * c.shake * 2 + c.kx;
      c.sy = (Math.random() - 0.5) * c.shake * 2 + c.ky;
      c.shake *= Math.exp(-V.shakeDecay * dt);
    } else {
      c.sx = c.kx;
      c.sy = c.ky;
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
function paintNpc(g, kind, spec, color, finish) {
  const L = spec.len / 2;
  const H = spec.wid / 2;
  if (spec.shape) {
    paintTr(g, spec.len, spec.wid, color, '#101216', spec.shape, finish);
    if (kind === 'taxi') {
      // Dama şerit ve tepe lambası
      for (let x = -L + 4; x < L - 6; x += 5) {
        g.fillStyle = Math.round(x / 5) % 2 ? '#111' : '#fff';
        g.fillRect(x, -H + 0.6, 2.5, 1.6);
        g.fillRect(x, H - 2.2, 2.5, 1.6);
      }
      g.fillStyle = '#1b1b1f';
      rr(g, -5, -6, 8, 12, 1); g.fill();
      g.fillStyle = '#ffe14d';
      g.font = 'bold 4px sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.save(); g.rotate(1.57); g.fillText('TAKSİ', 0, 1); g.restore();
    }
  } else if (kind === 'minibus') {
    g.fillStyle = '#121216';
    for (const x of [L * 0.6, -L * 0.6]) { g.fillRect(x - 6, -H - 1, 12, 3); g.fillRect(x - 6, H - 2, 12, 3); }
    g.fillStyle = color;
    rr(g, -L, -H, spec.len, spec.wid, 6); g.fill();
    g.fillStyle = '#2878b5';
    g.fillRect(-L + 2, -H, spec.len - 12, 3);
    g.fillRect(-L + 2, H - 3, spec.len - 12, 3);
    g.fillStyle = '#24384c';
    rr(g, L - 13, -H + 3, 7, spec.wid - 6, 2); g.fill();
    g.fillStyle = 'rgba(0,0,0,.14)';
    rr(g, -L + 5, -H + 5, spec.len - 22, spec.wid - 10, 2); g.fill();
    g.fillStyle = '#ffffff';
    g.font = 'bold 6.5px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('DOLMUŞ', -6, 0.5);
    g.fillStyle = '#fff7c2';
    g.fillRect(L - 2, -H + 3, 2, 4); g.fillRect(L - 2, H - 7, 2, 4);
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
    for (let x = -L + 10; x < L - 18; x += 20) { rr(g, x, -H + 6, 11, 3, 1); g.fill(); rr(g, x, H - 9, 11, 3, 1); g.fill(); }
    g.fillStyle = '#ffffff';
    g.font = 'bold 8px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('BELEDİYE', -6, 0.6);
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
// Her yaya kıyafet, ten, saç ve aksesuarla ayrışır. acc: 0 yok, 1 şapka, 2 başörtüsü, 3 sırt çantası, 4 omuz çantası, 5 uzun saç, 6 kel
function paintPed(g, shirt, skin, hair, step, acc = 0) {
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
  if (acc === 2) { g.beginPath(); g.arc(0, 0, 2.7, 0, 7); g.fill(); g.fillStyle = shade(hair, 0.25); g.fillRect(-3, -0.6, 1.4, 1.2); }
  else if (acc === 5) { g.beginPath(); g.arc(-0.9, 0, 2.7, 1.2, 5.1); g.fill(); }
  else if (acc !== 6) { g.beginPath(); g.arc(-0.5, 0, 2.2, 1.57, 4.71); g.fill(); }
  if (acc === 1) { g.fillStyle = shade(shirt, -0.3); g.beginPath(); g.arc(0, 0, 2.4, 0, 7); g.fill(); g.fillRect(1.6, -1.6, 2.4, 3.2); }
  if (acc === 3) { g.fillStyle = '#39414d'; g.fillRect(-4.2, -2.2, 2.2, 4.4); }
  if (acc === 4) { g.fillStyle = '#7a4e2a'; g.fillRect(-1.5, 3.8, 3.4, 2.4); }
}

// Uçan daire: üstten yuvarlak gövde, cam kubbe, dönen ışıklar, içinde yeşil pilot
function paintUfo(g, spec) {
  const R = spec.len / 2;
  const grd = g.createRadialGradient(-R * 0.3, -R * 0.3, 2, 0, 0, R);
  grd.addColorStop(0, '#d9e4ec'); grd.addColorStop(0.55, '#7f93a6'); grd.addColorStop(1, '#3b4757');
  g.fillStyle = grd; g.beginPath(); g.arc(0, 0, R, 0, 7); g.fill();
  g.strokeStyle = '#1c2530'; g.lineWidth = 1.4; g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1; g.beginPath(); g.arc(0, 0, R * 0.74, 0, 7); g.stroke();
  for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283; g.fillStyle = i % 2 ? '#39ff9c' : '#ffe14d'; g.beginPath(); g.arc(Math.cos(a) * R * 0.86, Math.sin(a) * R * 0.86, 3.2, 0, 7); g.fill(); }
  const dome = g.createRadialGradient(-5, -6, 1, 0, 0, R * 0.46);
  dome.addColorStop(0, '#d8fff0'); dome.addColorStop(1, '#2fb88a');
  g.fillStyle = dome; g.beginPath(); g.arc(0, 0, R * 0.46, 0, 7); g.fill();
  g.fillStyle = '#4de08a'; g.beginPath(); g.ellipse(0, 0, 8, 10, 0, 0, 7); g.fill();
  g.fillStyle = '#10151c'; g.beginPath(); g.ellipse(-3, -2.4, 2.1, 3.2, 0.4, 0, 7); g.ellipse(3, -2.4, 2.1, 3.2, -0.4, 0, 7); g.fill();
}

// Uzaylı aracı: yerden yüksek, parlak yeşil çizgili, sivri burunlu
function paintRover(g, spec) {
  const L = spec.len / 2; const H = spec.wid / 2;
  g.fillStyle = 'rgba(57,255,156,.28)'; rr(g, -L - 4, -H - 4, spec.len + 8, spec.wid + 8, 12); g.fill();
  const c = g.createLinearGradient(0, -H, 0, H);
  c.addColorStop(0, '#5a3d9a'); c.addColorStop(0.5, '#2c1d58'); c.addColorStop(1, '#170e33');
  g.fillStyle = c;
  g.beginPath(); g.moveTo(L + 3, 0); g.quadraticCurveTo(L * 0.4, -H * 1.2, -L * 0.6, -H); g.lineTo(-L, -H * 0.5); g.lineTo(-L, H * 0.5); g.lineTo(-L * 0.6, H); g.quadraticCurveTo(L * 0.4, H * 1.2, L + 3, 0); g.closePath(); g.fill();
  g.strokeStyle = '#39ff9c'; g.lineWidth = 1.6; g.stroke();
  g.fillStyle = '#a0ffd8'; g.beginPath(); g.ellipse(L * 0.1, 0, L * 0.34, H * 0.46, 0, 0, 7); g.fill();
  g.fillStyle = '#39ff9c'; g.fillRect(-L * 0.8, -H * 0.72, L * 0.7, 1.6); g.fillRect(-L * 0.8, H * 0.72 - 1.6, L * 0.7, 1.6);
  g.fillStyle = '#ff2ad4'; g.beginPath(); g.arc(-L, -H * 0.4, 2.2, 0, 7); g.arc(-L, H * 0.4, 2.2, 0, 7); g.fill();
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
    case S.APARTMENT: {
      // Apartman: düz çatı, merdiven kulesi, balkonlu cephe
      const wall = 12;
      g.fillStyle = shade(color, -0.44);
      rr(g, x, y, w, h, 3); g.fill();
      g.fillStyle = 'rgba(205,235,255,.75)';
      for (let px = x + 6; px < x + w - 7; px += 12) g.fillRect(px, y + h - wall + 2, 7, 4);
      // Balkon çamaşırı
      const cols = ['#f4f6f8', '#e8533f', '#3e7cb1', '#f2c14e'];
      for (let px = x + 6; px < x + w - 8; px += 8) {
        if ((seed + px) % 3 === 0) { g.fillStyle = cols[(seed + px) % 4]; g.fillRect(px, y + h - wall + 6, 5, 5); }
      }
      g.fillStyle = shade(color, 0.42);
      rr(g, x, y, w, h - wall, 3); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.16)';
      g.lineWidth = 2;
      g.strokeRect(x + 3, y + 3, w - 6, h - wall - 6);
      g.fillStyle = shade(color, 0.15);
      g.fillRect(x + w * 0.62, y + 6, 15, 13);
      g.fillStyle = 'rgba(0,0,0,.2)';
      g.fillRect(x + w * 0.62, y + 16, 15, 3);
      break;
    }
    case S.MARKET: {
      // Gross market: geniş çatı, çizgili tente
      g.fillStyle = '#c9ced4';
      rr(g, x, y, w, h, 3); g.fill();
      g.fillStyle = '#dfe3e7';
      rr(g, x + 2, y + 2, w - 4, h - 24, 3); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.08)';
      g.lineWidth = 2;
      for (let px = x + 12; px < x + w - 6; px += 16) { g.beginPath(); g.moveTo(px, y + 4); g.lineTo(px, y + h - 26); g.stroke(); }
      for (let i = 0; i * 12 < w; i++) {
        g.fillStyle = i % 2 ? '#ffffff' : color;
        g.fillRect(x + i * 12, y + h - 24, Math.min(12, w - i * 12), 7);
      }
      g.fillStyle = color;
      g.fillRect(x, y + h - 17, w, 17);
      break;
    }
    case S.SISTEM: {
      // Haritanın tek turuncu binası
      g.fillStyle = '#b84f00';
      rr(g, x, y, w, h, 5); g.fill();
      g.fillStyle = '#ff7a00';
      rr(g, x, y, w, h - 16, 5); g.fill();
      g.fillStyle = '#ffa24a';
      rr(g, x + 14, y + 14, w - 28, h - 44, 4); g.fill();
      g.fillStyle = '#ff7a00';
      rr(g, x + 34, y + 34, w - 68, h - 84, 3); g.fill();
      g.fillStyle = 'rgba(255,255,255,.75)';
      for (let px = x + 12; px < x + w - 14; px += 20) g.fillRect(px, y + h - 12, 12, 7);
      g.strokeStyle = '#fff';
      g.lineWidth = 3;
      g.beginPath(); g.moveTo(cx, y + 10); g.lineTo(cx, cy); g.stroke();
      g.fillStyle = '#e30a17';
      g.fillRect(cx, y + 10, 26, 16);
      g.fillStyle = '#fff';
      g.beginPath(); g.arc(cx + 10, y + 18, 5, 0, 7); g.fill();
      g.fillStyle = '#e30a17';
      g.beginPath(); g.arc(cx + 12, y + 18, 4, 0, 7); g.fill();
      break;
    }
    case S.BAZAAR: {
      // Üstü kapalı pazar: çizgili branda
      g.fillStyle = '#7b7f85';
      g.fillRect(x, y, w, h);
      for (let i = 0; i * 26 < w; i++) {
        g.fillStyle = i % 2 ? '#f6efe0' : color;
        g.fillRect(x + i * 26, y, Math.min(26, w - i * 26), h - 8);
      }
      g.fillStyle = 'rgba(0,0,0,.14)';
      g.fillRect(x, y + (h - 8) / 2, w, (h - 8) / 2);
      g.fillStyle = 'rgba(255,255,255,.35)';
      g.fillRect(x, y + (h - 8) / 2 - 1.5, w, 3);
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

// Çatı detayları: uydu çanakları ve termosifon
function roofClutter(g, r) {
  const n = 1 + (r.seed % 3);
  const wall = 12;
  for (let i = 0; i < n; i++) {
    const px = r.x + 10 + ((r.seed * (i + 2) * 17) % Math.max(1, r.w - 22));
    const py = r.y + 9 + ((r.seed * (i + 4) * 23) % Math.max(1, r.h - wall - 24));
    g.fillStyle = 'rgba(0,0,0,.22)';
    g.beginPath(); g.ellipse(px + 2, py + 2, 5.5, 5, 0, 0, 7); g.fill();
    g.fillStyle = '#eceff2';
    g.beginPath(); g.ellipse(px, py, 5.5, 5, -0.6, 0, 7); g.fill();
    g.fillStyle = '#b8bfc7';
    g.beginPath(); g.ellipse(px, py, 3, 2.7, -0.6, 0, 7); g.fill();
    g.strokeStyle = '#6d7782';
    g.lineWidth = 1;
    g.beginPath(); g.moveTo(px, py); g.lineTo(px + 4, py - 4); g.stroke();
  }
  if (r.seed % 2 === 0 && r.w > 60) {
    const px = r.x + r.w - 26;
    g.fillStyle = '#1f3f77';
    g.fillRect(px, r.y + 8, 15, 9);
    g.fillStyle = '#d7dde2';
    g.fillRect(px, r.y + 6, 15, 3);
  }
}

// Tabelalar önbelleğe alınır: bina çizimi telefonda ucuz kalsın
const signCache = new Map();
// Tabela: on farklı yazı tarzı. Aynı ad farklı tohumda farklı görünür
const SIGN_FONTS = [
  ['800 30px Nunito, sans-serif', 'panel'],
  ['400 34px Anton, Impact, sans-serif', 'panel'],
  ['500 30px Oswald, sans-serif', 'dark'],
  ['400 34px Lobster, cursive', 'bare'],
  ['400 30px Pacifico, cursive', 'board'],
  ['400 34px "Tilt Neon", sans-serif', 'neon'],
  ['400 32px Monoton, sans-serif', 'neon'],
  ['400 32px Righteous, sans-serif', 'two'],
  ['400 30px Bungee, sans-serif', 'bare'],
  ['italic 400 30px Playfair, Georgia, serif', 'brass'],
];

function signCanvas(text, color, seed = 0) {
  const v = seed % SIGN_FONTS.length;
  const key = text + color + v;
  let c = signCache.get(key);
  if (c) return c;
  if (signCache.size > 400) signCache.clear();
  const [font, kind] = SIGN_FONTS[v];
  const shown = v === 1 || v === 8 ? text.toLocaleUpperCase('tr') : text;
  c = document.createElement('canvas');
  const g0 = c.getContext('2d');
  g0.font = font;
  const w = Math.ceil(g0.measureText(shown).width) + 34;
  c.width = w;
  c.height = 56;
  const g = c.getContext('2d');
  g.font = font;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const cy = 29;
  if (kind === 'panel') {
    g.fillStyle = color; rr(g, 2, 4, w - 4, 48, 7); g.fill();
    g.lineWidth = 3; g.strokeStyle = '#fff'; g.stroke();
    g.fillStyle = '#fff'; g.fillText(shown, w / 2, cy);
  } else if (kind === 'dark') {
    g.fillStyle = '#14161c'; g.fillRect(1, 6, w - 2, 44);
    g.fillStyle = color; g.fillRect(1, 44, w - 2, 6);
    g.fillStyle = '#f4f6f8'; g.fillText(shown, w / 2, cy - 2);
  } else if (kind === 'bare') {
    g.lineWidth = 7; g.lineJoin = 'round'; g.strokeStyle = 'rgba(10,12,20,.85)'; g.strokeText(shown, w / 2, cy);
    g.fillStyle = shade(color, 0.32); g.fillText(shown, w / 2, cy);
  } else if (kind === 'board') {
    g.fillStyle = '#f4ead2'; rr(g, 2, 4, w - 4, 48, 14); g.fill();
    g.lineWidth = 2.5; g.strokeStyle = color; g.stroke();
    g.fillStyle = color; g.fillText(shown, w / 2, cy - 1);
  } else if (kind === 'neon') {
    g.fillStyle = '#0d0a18'; rr(g, 2, 4, w - 4, 48, 6); g.fill();
    const glow = shade(color, 0.5);
    g.shadowColor = glow; g.shadowBlur = 14;
    g.fillStyle = glow; g.fillText(shown, w / 2, cy);
    g.fillText(shown, w / 2, cy);
    g.shadowBlur = 0;
    g.fillStyle = '#ffffff'; g.globalAlpha = 0.55; g.fillText(shown, w / 2, cy); g.globalAlpha = 1;
  } else if (kind === 'two') {
    g.fillStyle = color; g.fillRect(1, 4, w * 0.5, 48);
    g.fillStyle = '#fff4d8'; g.fillRect(w * 0.5, 4, w * 0.5 - 1, 48);
    g.fillStyle = '#16181c'; g.fillText(shown, w / 2 + 1.5, cy + 1.5);
    g.fillStyle = '#ffd23f'; g.fillText(shown, w / 2, cy);
  } else {
    const gr = g.createLinearGradient(0, 4, 0, 52);
    gr.addColorStop(0, '#e8c97a'); gr.addColorStop(1, '#a5792c');
    g.fillStyle = gr; rr(g, 2, 6, w - 4, 44, 2); g.fill();
    g.fillStyle = '#2b1d08'; g.fillText(shown, w / 2, cy);
  }
  signCache.set(key, c);
  return c;
}

function paintLight(g, st) {
  g.fillStyle = 'rgba(0,0,0,.25)';
  rr(g, -4, -10, 10, 23, 2); g.fill();
  g.fillStyle = '#20232a';
  rr(g, -5, -12, 10, 23, 2); g.fill();
  g.fillStyle = st === 'r' ? '#ff3030' : '#4a1414';
  g.beginPath(); g.arc(0, -7.5, 3, 0, 7); g.fill();
  g.fillStyle = st === 'y' ? '#ffc21f' : '#4a3a12';
  g.beginPath(); g.arc(0, -0.5, 3, 0, 7); g.fill();
  g.fillStyle = st === 'g' ? '#2fe36a' : '#124a22';
  g.beginPath(); g.arc(0, 6.5, 3, 0, 7); g.fill();
}

function paintSimit(g) {
  g.strokeStyle = '#b5742a';
  g.lineWidth = 4.2;
  g.beginPath(); g.arc(0, 0, 4.6, 0, 7); g.stroke();
  g.strokeStyle = '#e0ad62';
  g.lineWidth = 1.4;
  g.beginPath(); g.arc(-0.5, -0.5, 4.6, 0, 7); g.stroke();
}

// Sokak insanları: 34 birimlik çizim, baş +x yönüne bakar
function paintPedKind(g, kind, step) {
  g.scale(1.1, 1.1);
  const person = (shirt, skin, hair) => paintPed(g, shirt, skin, hair, step);
  switch (kind) {
    case 'woman':
      person('#c45fbd', '#f0c8a0', '#c45fbd');
      g.fillStyle = '#d07ac9'; // Başörtüsü
      g.beginPath(); g.arc(0, 0, 2.8, 0, 7); g.fill();
      break;
    case 'child':
      g.save(); g.scale(0.72, 0.72);
      person('#ffb400', '#f0c8a0', '#3b2a1e');
      g.restore();
      g.fillStyle = '#2ec4b6';
      g.beginPath(); g.arc(-3, 0, 2.2, 0, 7); g.fill(); // Sırt çantası
      break;
    case 'elder':
      person('#6b5a4a', '#e0a878', '#e8e8e8');
      g.strokeStyle = '#7a4e2c'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(1, 4.2); g.lineTo(6.5, 5.5); g.stroke(); // Baston
      break;
    case 'simitci':
      person('#3e7cb1', '#e0a878', '#3b2a1e');
      g.fillStyle = '#c9a050';
      g.beginPath(); g.ellipse(0, 0, 6.4, 6.4, 0, 0, 7); g.fill(); // Başta tepsi
      g.strokeStyle = '#a8651f'; g.lineWidth = 1.5;
      for (const [x, y] of [[-3, -2], [2, -3], [3, 2], [-2, 3]]) { g.beginPath(); g.arc(x, y, 1.6, 0, 7); g.stroke(); }
      break;
    case 'stroller':
      person('#4f9d69', '#f0c8a0', '#6b4a2b');
      g.fillStyle = '#e8533f';
      rr(g, 6, -4, 10, 8, 3); g.fill(); // Bebek arabası
      g.fillStyle = '#f7b5a9';
      rr(g, 11, -4, 5, 8, 2.5); g.fill();
      g.fillStyle = '#222';
      for (const [x, y] of [[7, -5], [7, 4], [14, -5], [14, 4]]) { g.beginPath(); g.arc(x, y, 1.1, 0, 7); g.fill(); }
      break;
    case 'wheelchair':
      g.fillStyle = '#1e2228';
      g.fillRect(-3, -6.4, 7, 2); g.fillRect(-3, 4.4, 7, 2); // Büyük tekerler
      g.fillStyle = '#7a8796';
      rr(g, -4, -4.4, 8, 8.8, 1.5); g.fill();
      person('#5c6b7a', '#e0a878', '#dfe3e8');
      break;
    case 'bike':
      g.fillStyle = '#16181d';
      g.fillRect(-10, -0.8, 7, 1.6); g.fillRect(4, -0.8, 7, 1.6); // Tekerler
      g.fillStyle = '#2a9df4';
      g.fillRect(-5, -1, 10, 2);
      g.strokeStyle = '#c9d2dc'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(5, -3.4); g.lineTo(5, 3.4); g.stroke();
      person('#f2c14e', '#e0a878', '#2b2b33');
      break;
    case 'courier':
      g.fillStyle = '#14161a';
      g.fillRect(-11, -1, 8, 2); g.fillRect(5, -1, 8, 2);
      g.fillStyle = '#d9281e';
      rr(g, -6, -3, 13, 6, 2); g.fill();
      g.fillStyle = '#ff7a1a';
      rr(g, -13, -5, 9, 10, 1.5); g.fill(); // Paket kutusu
      g.fillStyle = '#fff'; g.fillRect(-13, -1, 9, 1.5);
      g.fillStyle = '#20252f';
      g.beginPath(); g.arc(1, 0, 3.4, 0, 7); g.fill();
      g.fillStyle = '#ff7a1a';
      g.beginPath(); g.arc(1.6, 0, 2.3, 0, 7); g.fill();
      break;
    case 'cayci':
      person('#f4f6f8', '#e0a878', '#3b2a1e');
      g.strokeStyle = '#c0c6cc'; g.lineWidth = 1.2;
      g.beginPath(); g.arc(4.6, 0, 4.4, 0, 7); g.stroke(); // Askılı tepsi
      g.fillStyle = '#b5481f';
      for (const [x, y] of [[3.2, -1.6], [6, -1.6], [4.6, 1.6]]) { g.beginPath(); g.arc(x, y, 1.2, 0, 7); g.fill(); }
      break;
    case 'student':
      person('#2a4d8f', '#f0c8a0', '#2b2b33');
      g.fillStyle = '#e8533f'; rr(g, -5.6, -3, 3.4, 6, 1.2); g.fill();
      break;
    case 'tourist':
      person('#f7a8c4', '#f0d0b0', '#d9c48a');
      g.fillStyle = '#e8d9a8'; g.beginPath(); g.arc(0, 0, 3.4, 0, 7); g.fill(); // Hasır şapka
      g.fillStyle = '#1b1b1f'; g.fillRect(2.4, -2, 2.4, 1.8);
      break;
    case 'jogger':
      person('#21d4a8', '#d9a06a', '#16131a');
      g.fillStyle = '#ff2a6d'; g.fillRect(-0.6, -2.4, 1.2, 4.8); // Saç bandı
      break;
    case 'guard':
      person('#11131a', '#e0a878', '#11131a');
      g.fillStyle = '#e8c547'; g.fillRect(-1, 2.2, 2, 1.4);
      break;
    case 'teyze':
      person('#7a4a6a', '#e0a878', '#7a4a6a');
      g.fillStyle = '#c7a24a'; g.beginPath(); g.arc(0, 0, 2.8, 0, 7); g.fill(); // Çiçekli başörtü
      g.fillStyle = '#6b4a2b'; rr(g, 1, 4, 4, 3, 1); g.fill(); // Pazar çantası
      break;
    case 'hawker':
      person('#b5482f', '#d9a06a', '#3b2a1e');
      g.fillStyle = '#e8d9a8'; rr(g, 3, -5, 7, 10, 1); g.fill();
      g.fillStyle = '#ff9d1a'; g.beginPath(); g.arc(6, -2, 1.3, 0, 7); g.arc(6, 2, 1.3, 0, 7); g.fill();
      break;
    case 'esnaf':
      person('#ececec', '#e0a878', '#16131a');
      g.fillStyle = '#7a4e2c';
      g.fillRect(-1.2, -3, 2.4, 6); // Önlük
      break;
    default: {
      // Sokak kedisi
      g.fillStyle = '#e8903a';
      g.beginPath(); g.ellipse(-1, 0, 4.8, 2.6, 0, 0, 7); g.fill();
      g.strokeStyle = '#e8903a'; g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(-5, 0); g.quadraticCurveTo(-8, step ? 3 : -3, -10, step ? 1 : -1); g.stroke();
      g.beginPath(); g.arc(4, 0, 2.6, 0, 7); g.fill();
      g.fillStyle = '#e8903a';
      g.beginPath(); g.moveTo(3.6, -2); g.lineTo(6, -3.2); g.lineTo(5.6, -0.8); g.fill();
      g.beginPath(); g.moveTo(3.6, 2); g.lineTo(6, 3.2); g.lineTo(5.6, 0.8); g.fill();
      g.fillStyle = '#fff';
      g.fillRect(-3, -0.8, 3, 1.6);
    }
  }
}

// --- cars.js ---
// Her araç modeli kendi çizimine sahiptir: gövde hattı, cam, far ve stop şekli modele özgüdür.
// Burun +x yönünde. Sprite'lar açılışta bir kez çizilir, oyun sırasında maliyeti yoktur.

// Boya: metalik, parlak, mat. İki ton modelin kendi çizimindedir
function coat(g, H, color, finish = 'gloss') {
  const c = g.createLinearGradient(0, -H, 0, H);
  if (finish === 'matte') {
    c.addColorStop(0, shade(color, 0.08));
    c.addColorStop(1, shade(color, -0.22));
  } else if (finish === 'metal') {
    c.addColorStop(0, shade(color, 0.5));
    c.addColorStop(0.22, shade(color, 0.08));
    c.addColorStop(0.5, shade(color, 0.34));
    c.addColorStop(0.78, shade(color, -0.12));
    c.addColorStop(1, shade(color, -0.46));
  } else {
    c.addColorStop(0, shade(color, 0.4));
    c.addColorStop(0.35, color);
    c.addColorStop(1, shade(color, -0.42));
  }
  return c;
}

// Gövde hattı: [x, y] noktaları sadece üst yarı, alt yarı aynalanır
function hull(g, pts) {
  g.beginPath();
  g.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) g.lineTo(pts[i][0], pts[i][1]);
  for (let i = pts.length - 1; i >= 0; i--) g.lineTo(pts[i][0], -pts[i][1]);
  g.closePath();
}

// Yumuşak köşeli gövde hattı
function smooth(g, pts) {
  const all = [...pts, ...pts.slice().reverse().map(([x, y]) => [x, -y])];
  const n = all.length;
  const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const s = mid(all[n - 1], all[0]);
  g.beginPath();
  g.moveTo(s[0], s[1]);
  for (let i = 0; i < n; i++) {
    const m = mid(all[i], all[(i + 1) % n]);
    g.quadraticCurveTo(all[i][0], all[i][1], m[0], m[1]);
  }
  g.closePath();
}

function tyre(g, x, y, w = 10, h = 4.6, rim = '#c9d2dc') {
  g.fillStyle = '#0d0d11';
  rr(g, x - w / 2, y - h / 2, w, h, 1.4);
  g.fill();
  g.fillStyle = rim;
  g.fillRect(x - w * 0.28, y - h * 0.24, w * 0.56, h * 0.48);
}

function tyres(g, fx, rx, H, w, h, rim) {
  for (const y of [-H + 1.1, H - 1.1]) { tyre(g, fx, y, w, h, rim); tyre(g, rx, y, w, h, rim); }
}

function fillHull(g, paint, line = 'rgba(0,0,0,.55)') {
  g.fillStyle = paint;
  g.fill();
  g.strokeStyle = line;
  g.lineWidth = 0.7;
  g.stroke();
}

// Cam: ön, arka, yan camlar ve tavan
function cabin(g, f, r, wf, wr, roofF, roofR, wRoof, roof, glass = '#1b3044') {
  g.fillStyle = glass;
  hull(g, [[f, wf], [r, wr]]);
  g.fill();
  const shine = g.createLinearGradient(f, 0, f - 4, 0);
  shine.addColorStop(0, 'rgba(190,235,255,.75)');
  shine.addColorStop(1, 'rgba(190,235,255,0)');
  g.fillStyle = shine;
  hull(g, [[f, wf - 1], [f - 4, wf - 1.2]]);
  g.fill();
  g.fillStyle = roof;
  rr(g, roofR, -wRoof, roofF - roofR, wRoof * 2, 2.2);
  g.fill();
  g.fillStyle = 'rgba(255,255,255,.2)';
  rr(g, roofR + 1.5, -wRoof + 1.4, (roofF - roofR) * 0.62, wRoof * 0.42, 1);
  g.fill();
  // Kapı çizgileri
  g.strokeStyle = 'rgba(0,0,0,.28)';
  g.lineWidth = 0.5;
  const m = (roofF + roofR) / 2;
  g.beginPath();
  g.moveTo(m, -wf - 1); g.lineTo(m, -wRoof); g.moveTo(m, wf + 1); g.lineTo(m, wRoof);
  g.stroke();
}

function mirrors(g, x, H, color) {
  g.fillStyle = color;
  g.fillRect(x, -H - 1.4, 3, 1.8);
  g.fillRect(x, H - 0.4, 3, 1.8);
}

function lamps(g, x, ys, w, h, color) {
  g.fillStyle = color;
  for (const y of ys) { g.fillRect(x, y - h / 2, w, h); g.fillRect(x, -y - h / 2, w, h); }
}

function emblem(g, x, kind) {
  g.save();
  g.translate(x, 0);
  g.strokeStyle = '#eef2f6';
  g.fillStyle = '#eef2f6';
  g.lineWidth = 0.6;
  if (kind === 'ring') { for (let i = -1; i <= 1; i++) { g.beginPath(); g.arc(0, i * 1.5, 1, 0, 7); g.stroke(); } }
  else if (kind === 'star') {
    g.beginPath(); g.arc(0, 0, 2, 0, 7); g.stroke();
    g.beginPath(); for (let i = 0; i < 3; i++) { const a = (i / 3) * 6.283 + 1.57; g.moveTo(0, 0); g.lineTo(Math.cos(a) * 2, Math.sin(a) * 2); } g.stroke();
  } else if (kind === 'wheel') {
    g.beginPath(); g.arc(0, 0, 2.1, 0, 7); g.stroke();
    g.beginPath(); g.moveTo(-2, 0); g.lineTo(2, 0); g.moveTo(0, -2); g.lineTo(0, 2); g.stroke();
  } else if (kind === 'oval') { g.beginPath(); g.ellipse(0, 0, 1.4, 2.6, 0, 0, 7); g.stroke(); }
  else { g.beginPath(); g.moveTo(1.8, 0); g.lineTo(0, -2); g.lineTo(-1.8, 0); g.lineTo(0, 2); g.closePath(); g.stroke(); }
  g.restore();
}

// --- Oyuncu modelleri ---
function dogan(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.56, H - 0.6, 9, 4, '#9aa3ad');
  // Doğan: uzun düz kaput, kare bagaj, üç kutulu sedan
  hull(g, [[L, H * 0.84], [L - 1.5, H * 0.96], [-L + 1.5, H * 0.96], [-L, H * 0.84]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.2, -L * 0.54, H * 0.8, H * 0.76, L * 0.04, -L * 0.42, H * 0.64, coat(g, H, c, fin));
  g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 0.6;
  g.strokeRect(L * 0.3, -H * 0.72, L * 0.62, H * 1.44);
  // Krom tampon, ikili dikdörtgen far, siyah ızgara
  g.fillStyle = '#dde2e7'; g.fillRect(L - 0.5, -H * 0.9, 1.6, H * 1.8); g.fillRect(-L - 1, -H * 0.9, 1.6, H * 1.8);
  g.fillStyle = '#14161a'; g.fillRect(L - 2.6, -H * 0.4, 2.2, H * 0.8);
  lamps(g, L - 3, [H * 0.66], 2.8, H * 0.32, '#fff5c4');
  lamps(g, -L, [H * 0.62], 2, H * 0.44, '#d8232a');
  lamps(g, -L, [H * 0.3], 1.4, H * 0.2, '#f09a2a');
  mirrors(g, L * 0.16, H * 0.92, '#2a2d33');
}

function sahin(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.56, H - 0.2, 10, 5, '#e8c547');
  hull(g, [[L, H * 0.8], [L - 2, H * 0.97], [-L + 2, H * 0.97], [-L, H * 0.82]]);
  fillHull(g, coat(g, H, c, fin));
  // Şahin: daha kısa arka, ön dörtlü far, kalın şeritler, koca spoyler
  cabin(g, L * 0.24, -L * 0.48, H * 0.8, H * 0.74, L * 0.06, -L * 0.34, H * 0.62, coat(g, H, c, fin), '#07090d');
  g.fillStyle = a;
  g.fillRect(-L + 1, -H * 0.36, l - 2, H * 0.2);
  g.fillRect(-L + 1, H * 0.16, l - 2, H * 0.2);
  g.fillStyle = '#0a0a0d'; g.fillRect(L - 3, -H * 0.42, 3, H * 0.84);
  lamps(g, L - 2.6, [H * 0.56, H * 0.82], 2.6, H * 0.2, '#fff8d8');
  lamps(g, -L, [H * 0.58], 2, H * 0.5, '#ff2030');
  g.fillStyle = a;
  rr(g, -L - 3, -H - 1, 3.6, w + 2, 1); g.fill();
  g.fillStyle = '#0a0a0d'; g.fillRect(-L + 0.8, -H * 0.8, 1.2, H * 0.3); g.fillRect(-L + 0.8, H * 0.5, 1.2, H * 0.3);
  mirrors(g, L * 0.2, H * 0.92, '#0a0a0d');
}

function murat(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H - 0.8, 9, 4, '#dfe4e9');
  // Murat 131: dik köşeler, dörtlü yuvarlak far, büyük bagaj
  hull(g, [[L, H * 0.88], [L - 1, H * 0.94], [-L + 1, H * 0.94], [-L, H * 0.88]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.16, -L * 0.5, H * 0.8, H * 0.8, 0, -L * 0.4, H * 0.68, coat(g, H, c, fin));
  g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(-L * 0.8, -H * 0.5, L * 0.22, H);
  g.fillStyle = '#e9edf1'; g.fillRect(L - 0.4, -H * 0.94, 1.8, H * 1.88); g.fillRect(-L - 1.4, -H * 0.94, 1.8, H * 1.88);
  g.fillStyle = '#16181c'; g.fillRect(L - 2.4, -H * 0.86, 2, H * 1.72);
  g.fillStyle = '#fff8d8';
  for (const y of [H * 0.32, H * 0.66]) { g.beginPath(); g.arc(L - 1.6, y, 1.9, 0, 7); g.arc(L - 1.6, -y, 1.9, 0, 7); g.fill(); }
  lamps(g, -L, [H * 0.66], 1.8, H * 0.36, '#d8232a');
  lamps(g, -L, [H * 0.34], 1.8, H * 0.2, '#e8862a');
  g.fillStyle = 'rgba(255,255,255,.35)'; g.fillRect(-L * 0.3, -H * 0.97, L * 0.7, 0.7); g.fillRect(-L * 0.3, H * 0.9, L * 0.7, 0.7);
  mirrors(g, L * 0.12, H * 0.94, '#c9ced4');
}

function anadol(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.62, -L * 0.56, H - 0.8, 9, 4, '#c9ced4');
  // Anadol: yuvarlak fiberglas gövde, uzun kaput, kısa arka, kuyruk yüzgeci
  smooth(g, [[L + 1, 0], [L, H * 0.7], [L * 0.7, H], [0, H * 0.94], [-L * 0.7, H * 0.96], [-L - 1, H * 0.86], [-L - 1, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.08, -L * 0.56, H * 0.76, H * 0.66, -L * 0.1, -L * 0.42, H * 0.56, coat(g, H, c, fin), '#1a2c38');
  g.strokeStyle = a; g.lineWidth = 1.1;
  g.beginPath(); g.moveTo(L * 0.86, -H * 0.86); g.lineTo(-L * 0.9, -H * 0.8); g.moveTo(L * 0.86, H * 0.86); g.lineTo(-L * 0.9, H * 0.8); g.stroke();
  g.fillStyle = '#dfe4e9'; g.fillRect(L * 0.98, -H * 0.72, 1.8, H * 1.44);
  g.fillStyle = '#fff8d8';
  for (const y of [H * 0.54]) { g.beginPath(); g.arc(L - 0.6, y, 2.5, 0, 7); g.arc(L - 0.6, -y, 2.5, 0, 7); g.fill(); }
  g.fillStyle = '#d8232a';
  g.beginPath(); g.arc(-L, H * 0.56, 2.1, 0, 7); g.arc(-L, -H * 0.56, 2.1, 0, 7); g.fill();
  mirrors(g, L * 0.1, H * 0.9, '#d0d5da');
}

function egea(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.56, H - 0.2, 10, 4.6, '#d7dde4');
  // Egea: akıcı sedan, kısa kaput, sivri LED far, çıkıntılı bagaj
  smooth(g, [[L, 0], [L, H * 0.58], [L * 0.78, H * 0.96], [0, H], [-L * 0.8, H * 0.96], [-L, H * 0.7], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.34, -L * 0.6, H * 0.8, H * 0.7, L * 0.08, -L * 0.36, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#23272e'; g.fillRect(L - 1.4, -H * 0.36, 1.4, H * 0.72);
  emblem(g, L - 3.6, 'oval');
  g.fillStyle = '#e8fbff';
  hull(g, [[L - 0.4, H * 0.42], [L * 0.8, H * 0.86]]); g.fill();
  lamps(g, -L, [H * 0.66], 2.6, H * 0.5, '#e01c2b');
  g.fillStyle = '#c9ced4'; g.fillRect(-L * 0.9, -H * 0.3, 0.8, H * 0.6);
  mirrors(g, L * 0.3, H * 0.96, shade(c, -0.2));
}

function clio(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.62, -L * 0.58, H - 0.2, 10, 4.8, '#e7eaee');
  // Clio: kısa hatchback, kavisli omuz, C biçimli LED far, bagajsız arka
  smooth(g, [[L, 0], [L, H * 0.6], [L * 0.72, H * 1.0], [0, H * 0.9], [-L * 0.68, H * 1.02], [-L, H * 0.74], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.3, -L * 0.82, H * 0.76, H * 0.66, L * 0.06, -L * 0.68, H * 0.6, '#14171c');
  g.strokeStyle = '#eefaff'; g.lineWidth = 1.3;
  for (const s of [-1, 1]) { g.beginPath(); g.arc(L * 0.82, s * H * 0.7, 3.2, s > 0 ? 0.2 : -2.6, s > 0 ? 2.6 : -0.2); g.stroke(); }
  emblem(g, L - 3.4, 'diamond');
  g.fillStyle = '#e01c2b';
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(-L * 0.78, s * H * 0.94); g.lineTo(-L, s * H * 0.66); g.lineTo(-L, s * H * 0.34); g.lineTo(-L + 2.6, s * H * 0.56); g.closePath(); g.fill(); }
  mirrors(g, L * 0.28, H * 0.9, a);
}

function suv(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.58, H + 0.2, 12, 5.4, '#3a3f47');
  // Grandland: kompakt SUV, çift tonlu tavan, ince far, geniş siyah ızgara
  smooth(g, [[L, 0], [L, H * 0.76], [L * 0.86, H], [-L * 0.82, H], [-L, H * 0.8], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.3, -L * 0.8, H * 0.8, H * 0.74, L * 0.12, -L * 0.68, H * 0.66, '#101317');
  g.fillStyle = '#c6ccd4'; g.fillRect(-L * 0.66, -H * 0.76, L * 0.76, 1.1); g.fillRect(-L * 0.66, H * 0.76 - 1.1, L * 0.76, 1.1);
  g.fillStyle = '#0c0e12'; g.fillRect(L - 2.6, -H * 0.8, 2.6, H * 1.6);
  g.fillStyle = '#e8fbff'; g.fillRect(L - 2, -H * 0.82, 1.6, H * 0.34); g.fillRect(L - 2, H * 0.48, 1.6, H * 0.34);
  emblem(g, L - 1.4, 'wheel');
  lamps(g, -L, [H * 0.7], 1.6, H * 0.4, '#e01c2b');
  g.fillStyle = '#23272e'; g.fillRect(-L, -H * 0.42, 1.2, H * 0.84);
  mirrors(g, L * 0.26, H * 0.98, '#101317');
}

function duster(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.58, H + 0.6, 13, 6, '#20242a');
  // Duster: geniş siyah çamurluk kaplamaları, tavan barları, kutu gibi arazi gövdesi
  g.fillStyle = '#23272e';
  rr(g, -L - 0.5, -H - 1, l + 1, w + 2, 4); g.fill();
  hull(g, [[L - 1, H * 0.72], [L - 3, H * 0.86], [-L + 3, H * 0.86], [-L + 1, H * 0.72]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.3, -L * 0.8, H * 0.72, H * 0.7, L * 0.14, -L * 0.66, H * 0.56, coat(g, H, c, fin));
  g.fillStyle = '#d7dde4'; g.fillRect(-L * 0.74, -H * 0.72, L * 0.96, 1.6); g.fillRect(-L * 0.74, H * 0.72 - 1.6, L * 0.96, 1.6);
  g.strokeStyle = 'rgba(0,0,0,.3)'; g.lineWidth = 0.7;
  g.beginPath(); g.moveTo(L * 0.92, -H * 0.3); g.lineTo(L * 0.4, -H * 0.36); g.moveTo(L * 0.92, H * 0.3); g.lineTo(L * 0.4, H * 0.36); g.stroke();
  g.fillStyle = '#c2c8cf'; g.fillRect(L - 1.2, -H * 0.5, 2, H); g.fillRect(-L - 1, -H * 0.5, 2, H);
  lamps(g, L - 2.4, [H * 0.7], 2.4, H * 0.34, '#fff5c4');
  g.fillStyle = '#e01c2b';
  for (const s of [-1, 1]) { g.fillRect(-L, s * H * 0.56 - 1, 1.6, 3.4); g.fillRect(-L + 2, s * H * 0.76 - 1, 1.6, 2); }
  mirrors(g, L * 0.26, H * 0.98, '#23272e');
}

function tog(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.62, -L * 0.62, H + 0.1, 12, 5.2, '#a7b0ba');
  // TOG T10X: kısa çıkıntılar, geniş gövde, boydan boya ışık çubuğu, siyah cam tavan
  smooth(g, [[L + 0.4, 0], [L, H * 0.8], [L * 0.84, H], [-L * 0.8, H], [-L, H * 0.84], [-L - 0.4, 0]]);
  fillHull(g, coat(g, H, c, fin));
  g.fillStyle = '#070a0e';
  hull(g, [[L * 0.36, H * 0.8], [-L * 0.82, H * 0.74]]);
  g.fill();
  g.fillStyle = 'rgba(120,190,230,.2)';
  hull(g, [[L * 0.3, H * 0.62], [-L * 0.2, H * 0.6]]);
  g.fill();
  g.fillStyle = '#e8e9ea'; g.fillRect(-L * 0.74, -H * 0.82, L * 1.06, 0.8); g.fillRect(-L * 0.74, H * 0.82 - 0.8, L * 1.06, 0.8);
  // Lale motifli ön: ince LED ve ince siyah bant
  g.fillStyle = '#e4fbff'; g.fillRect(L - 1.3, -H * 0.86, 1.5, H * 1.72);
  g.fillStyle = '#0c0f13'; g.fillRect(L - 3.6, -H * 0.56, 2, H * 1.12);
  g.strokeStyle = '#e4fbff'; g.lineWidth = 0.7;
  g.beginPath(); g.moveTo(L - 4.2, 0); g.lineTo(L - 6.6, -2); g.moveTo(L - 4.2, 0); g.lineTo(L - 6.6, 2); g.stroke();
  g.fillStyle = '#ff1f33'; g.fillRect(-L - 0.3, -H * 0.9, 1.5, H * 1.8);
  g.fillStyle = '#ffd6d6'; g.fillRect(-L - 0.3, -0.4, 1.5, 0.8);
  mirrors(g, L * 0.24, H * 0.98, '#070a0e');
}

function moto(g, l, w, c, a, fin) {
  const L = l / 2;
  g.fillStyle = '#0f0f13';
  rr(g, L * 0.36, -2.3, 13, 4.6, 2); g.fill();
  rr(g, -L - 0.5, -2.8, 14, 5.6, 2); g.fill();
  // Spor motor: dar kaporta, depo, sele, gidon
  smooth(g, [[L * 0.92, 0], [L * 0.5, 4.8], [0, 5.4], [-L * 0.3, 3.4], [-L * 0.74, 1.8], [-L * 0.74, 0]]);
  fillHull(g, coat(g, 5, c, fin));
  g.fillStyle = a;
  g.fillRect(L * 0.1, -1, L * 0.62, 2);
  g.fillStyle = '#1c2632'; g.fillRect(L * 0.46, -3.4, 3, 6.8);
  g.strokeStyle = '#c9d2dc'; g.lineWidth = 1.7;
  g.beginPath(); g.moveTo(L * 0.34, -7.4); g.lineTo(L * 0.34, 7.4); g.stroke();
  g.fillStyle = '#20252f';
  g.beginPath(); g.ellipse(-3, 0, 5.4, 6.6, 0, 0, 7); g.fill();
  g.fillStyle = a;
  g.beginPath(); g.arc(1, 0, 4, 0, 7); g.fill();
  g.fillStyle = '#16212e'; g.fillRect(2.6, -2.6, 2.2, 5.2);
  g.fillStyle = '#c9d2dc'; g.fillRect(-L * 0.74, 3, 8, 1.6);
  g.fillStyle = '#fff6c9'; g.fillRect(L - 1.4, -1.8, 2.4, 3.6);
  g.fillStyle = '#ff2733'; g.fillRect(-L - 1, -2, 1.6, 4);
}

// --- NPC modelleri: marka havası veren özgün tasarımlar, gerçek logo yok ---
function bavyera(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H, 10, 4.6, '#b6bdc5');
  smooth(g, [[L, 0], [L, H * 0.74], [L * 0.8, H], [-L * 0.8, H * 0.98], [-L, H * 0.76], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.2, -L * 0.6, H * 0.8, H * 0.72, 0, -L * 0.42, H * 0.6, coat(g, H, c, fin));
  // Çift böbrek ızgara, köşeli far
  g.fillStyle = '#0d0f12';
  rr(g, L - 2.4, -H * 0.42, 2.2, H * 0.38, 0.8); g.fill();
  rr(g, L - 2.4, H * 0.04, 2.2, H * 0.38, 0.8); g.fill();
  emblem(g, L * 0.74, 'wheel');
  lamps(g, L - 3.4, [H * 0.72], 3, H * 0.28, '#eafcff');
  lamps(g, -L, [H * 0.68], 2.2, H * 0.44, '#d8132a');
  mirrors(g, L * 0.16, H * 0.96, shade(c, -0.3));
}

function halka(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.58, H, 10, 4.6, '#d6dbe1');
  smooth(g, [[L, 0], [L, H * 0.8], [L * 0.86, H], [-L * 0.86, H], [-L, H * 0.8], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.28, -L * 0.66, H * 0.8, H * 0.7, L * 0.04, -L * 0.46, H * 0.6, coat(g, H, c, fin));
  // Tek parça geniş ızgara, üçgen LED, boydan boya stop
  g.fillStyle = '#0d0f12'; g.fillRect(L - 2, -H * 0.56, 2, H * 1.12);
  emblem(g, L - 3.6, 'ring');
  g.fillStyle = '#eafcff';
  hull(g, [[L - 0.4, H * 0.58], [L * 0.8, H * 0.92]]); g.fill();
  g.fillStyle = '#d8132a'; g.fillRect(-L, -H * 0.84, 1.4, H * 1.68);
  mirrors(g, L * 0.22, H * 0.98, shade(c, -0.3));
}

function yildiz(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.62, -L * 0.6, H, 10, 4.6, '#e2e6ea');
  smooth(g, [[L + 0.4, 0], [L, H * 0.7], [L * 0.76, H], [-L * 0.76, H], [-L, H * 0.72], [-L - 0.4, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.16, -L * 0.62, H * 0.8, H * 0.72, -L * 0.04, -L * 0.46, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#c9ced4'; g.fillRect(L - 2, -H * 0.4, 2.2, H * 0.8);
  g.strokeStyle = '#0d0f12'; g.lineWidth = 0.5;
  for (const y of [-H * 0.22, 0, H * 0.22]) { g.beginPath(); g.moveTo(L - 2, y); g.lineTo(L, y); g.stroke(); }
  emblem(g, L * 0.82, 'star');
  lamps(g, L - 3.6, [H * 0.68], 3.2, H * 0.3, '#eafcff');
  lamps(g, -L, [H * 0.66], 2, H * 0.5, '#c81425');
  g.fillStyle = '#dfe4e9'; g.fillRect(-L * 0.8, -H * 0.36, 0.8, H * 0.72);
  mirrors(g, L * 0.12, H * 0.96, shade(c, -0.3));
}

function golf(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.6, H, 10, 4.6, '#c0c7cf');
  smooth(g, [[L, 0], [L, H * 0.78], [L * 0.8, H], [-L * 0.8, H], [-L, H * 0.84], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.26, -L * 0.86, H * 0.78, H * 0.72, L * 0.04, -L * 0.7, H * 0.62, coat(g, H, c, fin));
  g.fillStyle = '#0d0f12'; g.fillRect(L - 1.4, -H * 0.5, 1.4, H);
  emblem(g, L - 3, 'wheel');
  lamps(g, L - 2.6, [H * 0.72], 2.6, H * 0.26, '#eafcff');
  lamps(g, -L, [H * 0.72], 1.8, H * 0.34, '#d8132a');
  mirrors(g, L * 0.22, H * 0.96, shade(c, -0.3));
}

function focus(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H, 10, 4.6, '#aeb6bf');
  smooth(g, [[L, 0], [L, H * 0.5], [L * 0.76, H * 0.98], [-L * 0.74, H], [-L, H * 0.8], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.32, -L * 0.8, H * 0.78, H * 0.68, L * 0.06, -L * 0.64, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#0d0f12'; g.fillRect(L - 2.2, -H * 0.5, 2.2, H);
  emblem(g, L - 3.6, 'oval');
  g.fillStyle = '#eafcff'; hull(g, [[L - 0.4, H * 0.5], [L * 0.76, H * 0.9]]); g.fill();
  g.fillStyle = '#d8132a'; g.fillRect(-L, -H * 0.76, 1.6, H * 0.5); g.fillRect(-L, H * 0.26, 1.6, H * 0.5);
  mirrors(g, L * 0.26, H * 0.96, shade(c, -0.3));
}

function kore(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H, 10, 4.6, '#c7ced6');
  smooth(g, [[L + 0.5, 0], [L, H * 0.62], [L * 0.8, H], [-L * 0.8, H], [-L, H * 0.68], [-L - 0.5, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.3, -L * 0.62, H * 0.8, H * 0.72, L * 0.06, -L * 0.42, H * 0.62, coat(g, H, c, fin));
  g.fillStyle = '#0d0f12'; rr(g, L - 2.6, -H * 0.5, 2.8, H, 1); g.fill();
  g.strokeStyle = '#8a929b'; g.lineWidth = 0.4;
  for (let y = -H * 0.4; y < H * 0.45; y += 1.6) { g.beginPath(); g.moveTo(L - 2.4, y); g.lineTo(L, y); g.stroke(); }
  emblem(g, L - 3.8, 'oval');
  g.fillStyle = '#eafcff'; g.fillRect(L * 0.76, -H * 0.9, L * 0.22, 1.1); g.fillRect(L * 0.76, H * 0.9 - 1.1, L * 0.22, 1.1);
  g.fillStyle = '#d8132a'; g.fillRect(-L, -H * 0.78, 1.2, H * 1.56);
  mirrors(g, L * 0.26, H * 0.96, shade(c, -0.3));
}

function megane(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H, 10, 4.6, '#bcc4cc');
  smooth(g, [[L, 0], [L, H * 0.66], [L * 0.76, H * 0.98], [-L * 0.8, H], [-L, H * 0.7], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.28, -L * 0.6, H * 0.78, H * 0.7, L * 0.04, -L * 0.42, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#16181c'; g.fillRect(L - 1.6, -H * 0.42, 1.6, H * 0.84);
  emblem(g, L - 3.2, 'diamond');
  lamps(g, L - 3, [H * 0.7], 2.8, H * 0.3, '#eafcff');
  lamps(g, -L, [H * 0.68], 2.2, H * 0.42, '#d8132a');
  mirrors(g, L * 0.24, H * 0.96, shade(c, -0.3));
}

function linea(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.58, H, 9.6, 4.4, '#a9b2bb');
  smooth(g, [[L, 0], [L, H * 0.74], [L * 0.84, H * 0.96], [-L * 0.84, H * 0.96], [-L, H * 0.74], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.26, -L * 0.54, H * 0.78, H * 0.72, L * 0.04, -L * 0.36, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#c9ced4'; g.fillRect(L - 1.4, -H * 0.3, 1.4, H * 0.6);
  emblem(g, L - 3, 'oval');
  lamps(g, L - 2.6, [H * 0.68], 2.6, H * 0.34, '#fff5c4');
  lamps(g, -L, [H * 0.66], 2, H * 0.4, '#d8132a');
  mirrors(g, L * 0.22, H * 0.94, shade(c, -0.3));
}

function kamyonet(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.6, H + 0.2, 11, 5, '#6d747c');
  g.fillStyle = coat(g, H, c, fin);
  rr(g, -L, -H, l, w, 4); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.5)'; g.lineWidth = 0.7; g.stroke();
  cabin(g, L * 0.44, -L * 0.04, H * 0.8, H * 0.78, L * 0.3, L * 0.02, H * 0.66, coat(g, H, c, fin));
  g.fillStyle = '#25282e'; rr(g, -L + 2, -H + 2.4, L * 0.92, w - 4.8, 1.6); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.14)'; g.lineWidth = 0.7;
  for (let x = -L + 5; x < -L * 0.1; x += 4) { g.beginPath(); g.moveTo(x, -H + 3); g.lineTo(x, H - 3); g.stroke(); }
  g.fillStyle = '#0d0f12'; g.fillRect(L - 2, -H * 0.6, 2, H * 1.2);
  lamps(g, L - 2, [H * 0.78], 2, H * 0.28, '#fff5c4');
  lamps(g, -L, [H * 0.74], 1.6, H * 0.36, '#d8132a');
  mirrors(g, L * 0.3, H * 0.98, '#16181c');
}

const MODELS = {
  dogan, motor: moto, moto, sahin, murat, anadol, egea, clio, suv, grandland: suv, duster, tog,
  bavyera, halka, yildiz, golf, focus, kore, megane, linea, kamyonet,
};

const MODEL_NAMES = Object.keys(MODELS);

function paintTr(g, len, wid, body, accent, shape, finish = 'gloss') {
  MODELS[shape](g, len, wid, body, accent, finish);
}

// Garaj için yandan profil: tanınmayı asıl bu sağlar.
// body: gövde hattı, glass: cam, w: tekerlek konumları (0-1), h: göreli yükseklik
const SIDE = {
  dogan: { body: [[0, 62], [3, 50], [30, 46], [39, 18], [68, 18], [80, 44], [100, 48], [100, 64]], glass: [[37, 44], [44, 23], [57, 23], [57, 44]], glass2: [[60, 44], [60, 23], [67, 23], [76, 44]], w: [20, 79] },
  motor: null,
  grandland: { body: [[0, 60], [2, 44], [24, 34], [36, 12], [82, 10], [96, 30], [100, 38], [100, 66]], glass: [[35, 34], [44, 17], [60, 17], [60, 34]], glass2: [[63, 34], [63, 17], [80, 15], [90, 32]], w: [20, 80], tall: 1 },
  tog: { body: [[0, 62], [1, 46], [18, 36], [36, 10], [80, 10], [98, 30], [100, 42], [100, 66]], glass: [[30, 35], [42, 14], [62, 14], [62, 35]], glass2: [[65, 35], [65, 14], [79, 14], [92, 32]], w: [18, 82], tall: 1 },
  sahin: { body: [[0, 62], [3, 50], [30, 46], [40, 19], [66, 19], [78, 42], [100, 46], [100, 64]], glass: [[38, 44], [45, 24], [57, 24], [57, 44]], glass2: [[60, 44], [60, 24], [66, 24], [74, 44]], w: [20, 79], wing: 1 },
  anadol: { body: [[0, 60], [2, 50], [36, 44], [46, 22], [66, 22], [84, 44], [100, 46], [100, 62]], glass: [[44, 42], [50, 26], [60, 26], [60, 42]], glass2: [[63, 42], [63, 26], [68, 26], [78, 42]], w: [20, 81] },
  murat: { body: [[0, 64], [1, 48], [29, 45], [37, 16], [69, 16], [79, 43], [100, 46], [100, 66]], glass: [[35, 43], [41, 21], [56, 21], [56, 43]], glass2: [[59, 43], [59, 21], [67, 21], [75, 43]], w: [20, 79] },
  egea: { body: [[0, 60], [2, 46], [26, 40], [40, 15], [70, 15], [86, 38], [100, 40], [100, 64]], glass: [[36, 38], [45, 19], [57, 19], [57, 38]], glass2: [[60, 38], [60, 19], [69, 19], [80, 38]], w: [20, 80] },
  clio: { body: [[0, 60], [2, 44], [24, 37], [40, 12], [78, 13], [97, 36], [100, 42], [100, 64]], glass: [[34, 36], [45, 16], [60, 16], [60, 36]], glass2: [[63, 36], [63, 16], [77, 17], [90, 34]], w: [20, 80] },
  duster: { body: [[0, 60], [1, 40], [22, 34], [33, 10], [85, 9], [98, 30], [100, 38], [100, 62]], glass: [[31, 33], [39, 15], [57, 15], [57, 33]], glass2: [[60, 33], [60, 15], [83, 14], [92, 32]], w: [19, 81], tall: 1, rails: 1, clad: 1 },
};

function paintSide(g, W, H, spec) {
  g.clearRect(0, 0, W, H);
  const pad = W * 0.06;
  const k = (W - pad * 2) / 100;
  const y0 = H * 0.86;
  const scaleY = k * 0.62;
  const px = (x) => pad + (100 - x) * k; // Burun sağda
  const py = (y) => y0 - (66 - y) * scaleY;
  g.fillStyle = 'rgba(0,0,0,.4)';
  g.beginPath(); g.ellipse(W / 2, y0 + 5, W * 0.42, 6, 0, 0, 7); g.fill();
  if (spec.shape === 'moto') {
    const col = spec.color;
    g.strokeStyle = '#15171c'; g.lineWidth = W * 0.022;
    for (const x of [0.24, 0.76]) { g.beginPath(); g.arc(W * x, y0 - W * 0.09, W * 0.09, 0, 7); g.stroke(); }
    g.fillStyle = col;
    g.beginPath();
    g.moveTo(W * 0.2, y0 - W * 0.2); g.lineTo(W * 0.42, y0 - W * 0.26); g.lineTo(W * 0.66, y0 - W * 0.26);
    g.lineTo(W * 0.8, y0 - W * 0.34); g.lineTo(W * 0.8, y0 - W * 0.14); g.lineTo(W * 0.56, y0 - W * 0.07); g.lineTo(W * 0.4, y0 - W * 0.12);
    g.closePath(); g.fill();
    g.fillStyle = '#1b1e24'; g.fillRect(W * 0.22, y0 - W * 0.235, W * 0.2, W * 0.03);
    g.strokeStyle = '#c9d2dc'; g.lineWidth = 3;
    g.beginPath(); g.moveTo(W * 0.76, y0 - W * 0.09); g.lineTo(W * 0.69, y0 - W * 0.33); g.stroke();
    return;
  }
  const s = SIDE[spec.shape];
  const grad = g.createLinearGradient(0, py(s.body[3][1]), 0, y0);
  grad.addColorStop(0, shade(spec.color, 0.42));
  grad.addColorStop(0.5, spec.color);
  grad.addColorStop(1, shade(spec.color, -0.45));
  g.beginPath();
  s.body.forEach(([x, y], i) => (i ? g.lineTo(px(x), py(y)) : g.moveTo(px(x), py(y))));
  g.closePath();
  g.fillStyle = grad;
  g.fill();
  g.lineJoin = 'round';
  g.strokeStyle = grad;
  g.lineWidth = 4;
  g.stroke();
  if (s.clad) { g.fillStyle = '#23272e'; g.fillRect(px(100), py(56), px(0) - px(100), py(66) - py(56)); }
  g.fillStyle = '#1b2d3f';
  for (const p of [s.glass, s.glass2]) {
    g.beginPath();
    p.forEach(([x, y], i) => (i ? g.lineTo(px(x), py(y)) : g.moveTo(px(x), py(y))));
    g.closePath();
    g.fill();
  }
  g.strokeStyle = 'rgba(0,0,0,.35)'; g.lineWidth = 1;
  g.beginPath(); g.moveTo(px(0), py(52)); g.lineTo(px(100), py(52)); g.stroke();
  if (s.rails) { g.strokeStyle = '#d7dde4'; g.lineWidth = 2.4; g.beginPath(); g.moveTo(px(36), py(s.body[3][1] - 3)); g.lineTo(px(84), py(s.body[3][1] - 3)); g.stroke(); }
  if (s.wing) { g.fillStyle = spec.accent; g.fillRect(px(98), py(36), px(84) - px(98), 5); g.fillRect(px(94), py(36), 3, py(46) - py(36)); }
  g.fillStyle = spec.shape === 'tog' ? '#e4fbff' : '#fff5c4';
  g.fillRect(px(3) - 7, py(49), 7, 5);
  g.fillStyle = '#e01c2b';
  g.fillRect(px(100), py(47), 6, 6);
  for (const x of s.w) {
    const cx = px(x);
    const cy = y0 - k * 3;
    const r = k * (s.tall ? 9.6 : 8.2);
    g.fillStyle = '#0f1014';
    g.beginPath(); g.arc(cx, cy, r, 0, 7); g.fill();
    g.fillStyle = '#c9d2dc';
    g.beginPath(); g.arc(cx, cy, r * 0.56, 0, 7); g.fill();
    g.fillStyle = '#6d7782';
    g.beginPath(); g.arc(cx, cy, r * 0.2, 0, 7); g.fill();
  }
}

// --- buildings.js ---
// Kodla çizilen binalar. Çizimler chunk önbelleğine bir kez işlenir; oyun sırasında ek yük yoktur.
// Her bina seed değerinden kendi kat, çatı, cephe ve renk seçimini türetir.

function hsl(h, s, l) { return `hsl(${h % 360},${s}%,${l}%)`; }

function label(g, text, x, y, size, color, weight = 800) {
  g.fillStyle = color;
  g.font = `${weight} ${size}px Nunito, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, x, y);
}

// Cephe: güneye bakan yüz. floors kat sayısı kadar pencere sırası
function facade(g, r, wall, color, windowColor, style) {
  const y = r.y + r.h - wall;
  g.fillStyle = shade(color, -0.42);
  g.fillRect(r.x, y, r.w, wall);
  const rows = Math.max(1, Math.floor(wall / 6));
  const step = 8 + (r.seed % 5);
  for (let j = 0; j < rows; j++) {
    for (let x = r.x + 4; x < r.x + r.w - 6; x += step) {
      g.fillStyle = (r.seed + x + j) % 7 === 0 ? '#ffe9a8' : windowColor;
      if (style === 1) g.fillRect(x, y + 2 + j * 6, step - 3, 3.6);
      else g.fillRect(x, y + 2 + j * 6, 4, 3.6);
    }
  }
}

// --- Her apartman farklı ---
function apartment(g, r) {
  const s = r.seed;
  const { x, y, w, h } = r;
  const wall = 8 + (s % 4) * 4;
  const hue = (s * 37) % 360;
  const base = (s % 5 === 0) ? `hsl(${hue},12%,78%)` : hsl(hue, 34 + (s % 26), 62 + (s % 16));
  const hex = baseHex(s);
  facade(g, r, wall, hex, 'rgba(195,230,255,.8)', s % 3 === 0 ? 1 : 0);
  // Balkonlar ve çamaşır
  for (let px = x + 6; px < x + w - 12; px += 18 + (s % 8)) {
    g.fillStyle = 'rgba(255,255,255,.65)';
    g.fillRect(px, y + h - 4.6, 12, 1.4);
    if ((s + px) % 3 === 0) {
      const cols = ['#f4f6f8', '#e8533f', '#3e7cb1', '#f2c14e', '#7a5ea8'];
      for (let i = 0; i < 3; i++) { g.fillStyle = cols[(s + i + px) % 5]; g.fillRect(px + 1 + i * 3.6, y + h - 3.4, 2.8, 3.4); }
    }
  }
  const rh = h - wall;
  const roof = s % 6;
  if (roof === 0 || roof === 1) {
    // Kiremit: beşik çatı
    const tile = roof ? '#b5482f' : '#9c4a35';
    g.fillStyle = tile;
    rr(g, x, y, w, rh, 2); g.fill();
    g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(x, y + rh / 2, w, rh / 2);
    g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = 1;
    for (let py = y + 5; py < y + rh; py += 6) { g.beginPath(); g.moveTo(x, py); g.lineTo(x + w, py); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x, y + rh / 2 - 1, w, 2);
    g.fillStyle = '#7a4e3a'; g.fillRect(x + w * 0.7, y + 6, 8, 8);
  } else if (roof === 2) {
    // Dört yüzlü çatı
    g.fillStyle = '#a8543a'; rr(g, x, y, w, rh, 2); g.fill();
    g.fillStyle = 'rgba(0,0,0,.18)';
    g.beginPath(); g.moveTo(x, y + rh); g.lineTo(x + w, y + rh); g.lineTo(x + w - 18, y + rh / 2); g.lineTo(x + 18, y + rh / 2); g.closePath(); g.fill();
    g.fillStyle = 'rgba(255,255,255,.14)';
    g.beginPath(); g.moveTo(x, y); g.lineTo(x + 18, y + rh / 2); g.lineTo(x, y + rh); g.closePath(); g.fill();
  } else if (roof === 3) {
    // Teraslı: fayans ve korkuluk
    g.fillStyle = base; rr(g, x, y, w, rh, 3); g.fill();
    g.fillStyle = 'rgba(255,255,255,.3)'; g.fillRect(x + 7, y + 7, w - 14, rh - 14);
    g.strokeStyle = 'rgba(0,0,0,.08)'; g.lineWidth = 1;
    for (let px = x + 14; px < x + w - 8; px += 8) { g.beginPath(); g.moveTo(px, y + 7); g.lineTo(px, y + rh - 7); g.stroke(); }
    g.fillStyle = shade(hex, 0.1); g.fillRect(x + w * 0.2, y + 10, 16, 12);
  } else {
    // Düz çatı, merdiven kulesi, su deposu
    g.fillStyle = base; rr(g, x, y, w, rh, 3); g.fill();
    g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2;
    g.strokeRect(x + 3, y + 3, w - 6, rh - 6);
    g.fillStyle = shade(hex, -0.18); g.fillRect(x + w * 0.58, y + 8, 15, 12);
    g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x + w * 0.58, y + 18, 15, 2);
    if (roof === 5) { g.fillStyle = '#d9dde2'; g.fillRect(x + 8, y + 8, 18, 6); g.fillRect(x + 8, y + 16, 18, 6); }
  }
}

const PASTEL = ['#e8b4a0', '#d9c98a', '#a9c7a4', '#9fc1d6', '#c3a9d0', '#e6cfa8', '#d59a8a', '#b5b8a0', '#e0a0a8', '#9ecfc2', '#d8b870', '#b0a6c6'];
function baseHex(s) { return PASTEL[s % PASTEL.length]; }

function gecekondu(g, r) {
  // Yamalı çatılı küçük ev
  const s = r.seed;
  const { x, y, w, h } = r;
  g.fillStyle = '#8a7a66'; g.fillRect(x, y, w, h);
  const cols = ['#b08a5a', '#8e9aa6', '#a56a4a', '#7f8c6a', '#c0a080'];
  const n = 3 + (s % 3);
  for (let i = 0; i < n; i++) {
    g.fillStyle = cols[(s + i) % 5];
    const pw = w / n;
    g.fillRect(x + i * pw, y, pw - 1, h - 7);
  }
  g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 1;
  for (let py = y + 4; py < y + h - 8; py += 5) { g.beginPath(); g.moveTo(x, py); g.lineTo(x + w, py); g.stroke(); }
  g.fillStyle = '#2f2a25'; g.fillRect(x + w * 0.3, y + h - 6, 6, 6);
  g.fillStyle = '#a7c9df'; g.fillRect(x + w * 0.6, y + h - 5, 5, 3);
  g.fillStyle = '#5c6b7a'; g.fillRect(x + w * 0.7, y + 3, 6, 6); // Soba borusu
}

function villa(g, r) {
  const s = r.seed;
  const { x, y, w, h } = r;
  const c = ['#b5482f', '#7a4e3a', '#4d6b7a', '#8c5a3c', '#a44a3f'][s % 5];
  g.fillStyle = '#efe6d4'; rr(g, x, y, w, h, 3); g.fill();
  g.fillStyle = 'rgba(160,210,240,.8)';
  for (let px = x + 8; px < x + w - 10; px += 16) g.fillRect(px, y + h - 7, 8, 4);
  g.fillStyle = c; rr(g, x, y, w, h - 9, 3); g.fill();
  g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x, y + (h - 9) / 2, w, (h - 9) / 2);
  g.fillStyle = 'rgba(255,255,255,.25)'; g.fillRect(x + 6, y + (h - 9) / 2 - 1, w - 12, 2);
}

function shoprow(g, r) {
  // Yan yana dükkânlar: üstte tek apartman, altta farklı renkli dükkân cepheleri
  const { x, y, w, h, seed: s } = r;
  const cols = ['#c8261e', '#1d6fb8', '#178a4d', '#d97706', '#6d28a8', '#0f766e', '#be185d'];
  g.fillStyle = baseHex(s + 3); rr(g, x, y, w, h - 14, 3); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, w - 6, h - 20);
  const n = Math.max(2, Math.floor(w / 42));
  const pw = w / n;
  for (let i = 0; i < n; i++) {
    const c = cols[(s + i) % cols.length];
    for (let k = 0; k * 6 < pw; k++) { g.fillStyle = k % 2 ? '#fff' : c; g.fillRect(x + i * pw + k * 6, y + h - 14, Math.min(6, pw - k * 6), 6); }
    g.fillStyle = '#26303a'; g.fillRect(x + i * pw + 2, y + h - 8, pw - 4, 8);
    g.fillStyle = 'rgba(190,230,255,.8)'; g.fillRect(x + i * pw + 4, y + h - 7, pw - 8, 5);
  }
}

function ishani(g, r) {
  const { x, y, w, h, seed: s } = r;
  const wall = 16;
  facade(g, r, wall, '#8b8f94', 'rgba(170,215,240,.8)', 1);
  g.fillStyle = '#b0b4b8'; g.fillRect(x, y, w, h - wall);
  g.fillStyle = '#cfd3d7'; g.fillRect(x + 8, y + 8, w - 16, h - wall - 16);
  g.fillStyle = '#8fa8b8'; g.fillRect(x + 18, y + 18, Math.max(6, w - 36), Math.max(6, h - wall - 36)); // Avlu camı
  label(g, 'İŞ HANI', x + w / 2, y + 12 + (s % 3), 9, '#2b3036');
}

function office(g, r) {
  const { x, y, w, h, seed: s } = r;
  const c = ['#3d5a78', '#4a6a6a', '#55607a', '#2f4a60'][s % 4];
  g.fillStyle = shade(c, -0.5); g.fillRect(x, y, w, h);
  g.fillStyle = c; g.fillRect(x, y, w, h - 20);
  g.strokeStyle = 'rgba(160,210,240,.55)'; g.lineWidth = 1;
  for (let px = x + 9; px < x + w; px += 9) { g.beginPath(); g.moveTo(px, y); g.lineTo(px, y + h - 20); g.stroke(); }
  for (let py = y + 9; py < y + h - 20; py += 9) { g.beginPath(); g.moveTo(x, py); g.lineTo(x + w, py); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,.16)';
  g.beginPath(); g.moveTo(x, y); g.lineTo(x + w * 0.7, y); g.lineTo(x, y + (h - 20) * 0.7); g.closePath(); g.fill();
  g.fillStyle = 'rgba(190,230,255,.7)';
  for (let px = x + 4; px < x + w - 4; px += 6) g.fillRect(px, y + h - 17, 3, 14);
}

function hotel(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = '#7a6a4f'; g.fillRect(x, y, w, h);
  g.fillStyle = '#f0e4c8'; g.fillRect(x, y, w, h - 16);
  g.fillStyle = '#c9a24a'; g.fillRect(x + 4, y + 4, w - 8, 3);
  for (let py = y + 12; py < y + h - 22; py += 9) {
    for (let px = x + 8; px < x + w - 8; px += 10) { g.fillStyle = 'rgba(110,150,180,.6)'; g.fillRect(px, py, 6, 5); }
  }
  g.fillStyle = '#5a9fd4'; rr(g, x + w * 0.6, y + 12, w * 0.26, 18, 6); g.fill(); // Çatı havuzu
  label(g, '★★★★★', x + w * 0.3, y + 22, 9, '#b78a1c');
  g.fillStyle = '#c62828'; g.fillRect(x + w / 2 - 10, y + h - 16, 20, 16); // Giriş halısı
}

function stadium(g, r) {
  const { x, y, w, h } = r;
  const cx = x + w / 2; const cy = y + h / 2;
  g.fillStyle = '#58606b'; rr(g, x, y, w, h, Math.min(w, h) * 0.4); g.fill();
  for (let i = 0; i < 4; i++) {
    g.fillStyle = ['#c8261e', '#f4f6f8', '#c8261e', '#f4f6f8'][i];
    rr(g, x + 10 + i * 12, y + 10 + i * 12, w - 20 - i * 24, h - 20 - i * 24, Math.min(w, h) * 0.34);
    g.fill();
  }
  const fw = w * 0.52; const fh = h * 0.46;
  g.fillStyle = '#3f9a3f'; g.fillRect(cx - fw / 2, cy - fh / 2, fw, fh);
  for (let i = 0; i < 8; i++) if (i % 2) { g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(cx - fw / 2 + (i * fw) / 8, cy - fh / 2, fw / 8, fh); }
  g.strokeStyle = '#fff'; g.lineWidth = 2;
  g.strokeRect(cx - fw / 2 + 3, cy - fh / 2 + 3, fw - 6, fh - 6);
  g.beginPath(); g.moveTo(cx, cy - fh / 2 + 3); g.lineTo(cx, cy + fh / 2 - 3); g.stroke();
  g.beginPath(); g.arc(cx, cy, fh * 0.18, 0, 7); g.stroke();
  for (const [a, b] of [[0, 0], [1, 0], [0, 1], [1, 1]]) { g.fillStyle = '#eef2f6'; g.fillRect(x + a * (w - 16) + 4, y + b * (h - 16) + 4, 10, 10); } // Projektörler
}

function siteBlock(g, r) {
  // Site bloğu: sitenin paleti, her blok kat ve çatı ile ayrışır
  const { x, y, w, h, seed: s } = r;
  const c = r.color;
  const wall = 14 + (s % 3) * 4;
  facade(g, r, wall, c, 'rgba(195,230,255,.85)', 1);
  g.fillStyle = shade(c, 0.34); rr(g, x, y, w, h - wall, 4); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, w - 6, h - wall - 6);
  g.fillStyle = shade(c, 0.1);
  g.fillRect(x + w * 0.3, y + 8, w * 0.4, Math.max(8, h - wall - 18));
  g.fillStyle = '#eceff2'; g.beginPath(); g.ellipse(x + 12, y + 12, 4, 3.6, 0, 0, 7); g.fill();
  label(g, String.fromCharCode(65 + (s % 12)), x + w / 2, y + (h - wall) / 2, 16, 'rgba(255,255,255,.85)');
}

function club(g, r) {
  // Pavyon: koyu cephe, kırmızı halı, neon çerçeve (neon gece ayrıca parlar)
  const { x, y, w, h } = r;
  g.fillStyle = '#1b1426'; rr(g, x, y, w, h, 4); g.fill();
  g.fillStyle = '#2a1f3a'; rr(g, x + 3, y + 3, w - 6, h - 22, 3); g.fill();
  g.strokeStyle = r.color; g.lineWidth = 2.5; rr(g, x + 6, y + 6, w - 12, h - 28, 3); g.stroke();
  g.fillStyle = '#c62828'; g.fillRect(x + w / 2 - 9, y + h - 18, 18, 18);
  g.fillStyle = '#e8c547'; g.fillRect(x + w / 2 - 13, y + h - 4, 3, 4); g.fillRect(x + w / 2 + 10, y + h - 4, 3, 4);
}

// Her zincirin kendi cephesi: renk, biçim, tente ve otopark
const CHAINS = {
  Migros: (g, r) => { box(g, r, '#ff7a00', '#ffffff'); stripe(g, r, '#ff7a00', '#fff'); },
  'BİM': (g, r) => { box(g, r, '#d0121b', '#1b4fa8'); g.fillStyle = '#1b4fa8'; g.fillRect(r.x, r.y + r.h - 27, r.w, 4); },
  'ŞOK': (g, r) => { box(g, r, '#ffd400', '#d0121b'); g.fillStyle = '#d0121b'; g.fillRect(r.x, r.y + 4, r.w, 5); },
  A101: (g, r) => { box(g, r, '#00a6c8', '#0a4f8a'); g.fillStyle = '#fff'; g.fillRect(r.x, r.y + r.h - 26, r.w, 3); },
  CarrefourSA: (g, r) => { box(g, r, '#ffffff', '#0a4ea2'); g.fillStyle = '#d0121b'; g.fillRect(r.x, r.y + r.h - 25, r.w / 2, 5); g.fillStyle = '#0a4ea2'; g.fillRect(r.x + r.w / 2, r.y + r.h - 25, r.w / 2, 5); },
  'İtopya': (g, r) => {
    box(g, r, '#10131a', '#ff2a6d');
    g.strokeStyle = '#21d4fd'; g.lineWidth = 2; g.strokeRect(r.x + 6, r.y + 6, r.w - 12, r.h - 34);
    g.strokeStyle = 'rgba(33,212,253,.4)'; g.lineWidth = 1;
    for (let px = r.x + 16; px < r.x + r.w - 10; px += 18) { g.beginPath(); g.moveTo(px, r.y + 6); g.lineTo(px, r.y + 16); g.lineTo(px + 8, r.y + 22); g.stroke(); }
  },
  'Koçtaş': (g, r) => {
    box(g, r, '#f59300', '#1f3a68');
    g.fillStyle = '#d8dce0'; g.fillRect(r.x + r.w * 0.68, r.y, r.w * 0.32, r.h - 18); // Bahçe bölümü
    g.strokeStyle = '#8a9198'; g.lineWidth = 1;
    for (let px = r.x + r.w * 0.68; px < r.x + r.w; px += 7) { g.beginPath(); g.moveTo(px, r.y); g.lineTo(px, r.y + r.h - 18); g.stroke(); }
  },
  'CZN Burak': (g, r) => { box(g, r, '#16a34a', '#fff'); stripe(g, r, '#ffd400', '#16a34a'); },
};

function box(g, r, roof, band) {
  const { x, y, w, h } = r;
  g.fillStyle = '#b7bcc2'; g.fillRect(x, y, w, h);
  g.fillStyle = roof === '#ffffff' ? '#eceff2' : shade(roof, 0.55); g.fillRect(x, y, w, h - 24);
  g.strokeStyle = 'rgba(0,0,0,.07)'; g.lineWidth = 2;
  for (let px = x + 14; px < x + w - 6; px += 18) { g.beginPath(); g.moveTo(px, y + 3); g.lineTo(px, y + h - 26); g.stroke(); }
  g.fillStyle = '#d7dde2'; g.fillRect(x + 10, y + 10, 16, 10); g.fillRect(x + 36, y + 10, 16, 10);
  g.fillStyle = 'rgba(170,220,245,.85)'; g.fillRect(x + 4, y + h - 8, w - 8, 8);
  g.fillStyle = roof; g.fillRect(x, y + h - 24, w, 16);
  r.bandColor = band;
}

function stripe(g, r, a, b) {
  for (let i = 0; i * 10 < r.w; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(r.x + i * 10, r.y + r.h - 30, Math.min(10, r.w - i * 10), 6); }
}

function sistem(g, r) {
  // Haritanın en büyük binası: turuncu, beyaz, siyah
  const { x, y, w, h } = r;
  g.fillStyle = '#17181b'; rr(g, x, y, w, h, 6); g.fill();
  g.fillStyle = '#ff7a00'; rr(g, x, y, w, h - 40, 6); g.fill();
  g.fillStyle = '#ffffff'; g.fillRect(x + 22, y + 22, w - 44, h - 84);
  g.fillStyle = '#ff7a00'; g.fillRect(x + 44, y + 44, w - 88, h - 128);
  g.fillStyle = '#17181b'; g.fillRect(x, y + (h - 40) / 2 - 3, 22, 6); g.fillRect(x + w - 22, y + (h - 40) / 2 - 3, 22, 6);
  // Yazı: turuncu üstüne beyaz, siyah gölgeli
  const size = Math.floor(w / 8.6);
  const cx = x + w / 2; const cy = y + (h - 40) / 2;
  g.font = `900 ${size}px Bungee, Nunito, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#17181b';
  g.fillText('SİSTEM', cx + 4, cy - size * 0.55 + 4);
  g.fillText('KOLEJİ', cx + 4, cy + size * 0.55 + 4);
  g.fillStyle = '#ffffff';
  g.fillText('SİSTEM', cx, cy - size * 0.55);
  g.fillText('KOLEJİ', cx, cy + size * 0.55);
  // Cephe: beyaz sütunlar, siyah camlar, turuncu giriş
  for (let px = x + 10; px < x + w - 12; px += 24) {
    g.fillStyle = '#ffffff'; g.fillRect(px, y + h - 38, 6, 38);
    g.fillStyle = '#23262b'; g.fillRect(px + 6, y + h - 36, 16, 12);
    g.fillStyle = '#ff9a3c'; g.fillRect(px + 6, y + h - 20, 16, 12);
  }
  g.fillStyle = '#ff7a00'; g.fillRect(x + w / 2 - 36, y + h - 40, 72, 40);
  label(g, 'SİSTEM KOLEJİ', x + w / 2, y + h - 22, 11, '#ffffff', 900);
}


// --- v5: tek tek kimlikli binalar ---
const SHOP_LOOK = [
  [/döner|dönerci|kebap|iskender|ciğer|çiğköfte/i, { wall: '#7a2a18', awn: ['#c8261e', '#ffd23f'], fx: 'spit' }],
  [/pide|lahmacun|börek|fırın|ekmek/i, { wall: '#a8733f', awn: ['#d97706', '#fff4d8'], fx: 'oven' }],
  [/eczane/i, { wall: '#f4f6f4', awn: ['#d0121b', '#ffffff'], fx: 'cross' }],
  [/kuaför|berber/i, { wall: '#2d3a55', awn: ['#1d6fb8', '#ffffff'], fx: 'pole' }],
  [/çay|kahve|kafe|nevada|nargile/i, { wall: '#5a3a24', awn: ['#178a4d', '#f4e7c8'], fx: 'tables' }],
  [/büfe|tekel|bakkal|market/i, { wall: '#30536e', awn: ['#ffd23f', '#1d6fb8'], fx: 'crates' }],
  [/kasap|manav|tatlı|lokanta/i, { wall: '#6d3b2a', awn: ['#178a4d', '#ffffff'], fx: 'crates' }],
];

function shop(g, r) {
  const { x, y, w, h, seed: s } = r;
  let look = { wall: PASTEL[s % PASTEL.length], awn: ['#6d28a8', '#ffffff'], fx: '' };
  for (const [re, l] of SHOP_LOOK) if (re.test(r.sign)) { look = l; break; }
  const front = Math.min(18, h * 0.42);
  // Küçük dükkân: düz çatı, klima, baca
  g.fillStyle = shade(baseHex(s + 5), -0.08); g.fillRect(x, y, w, h - front);
  g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 1.5; g.strokeRect(x + 2, y + 2, w - 4, h - front - 4);
  g.fillStyle = '#c9ced3'; g.fillRect(x + 6 + (s % 9), y + 6, 11, 8);
  g.fillStyle = '#6d7680'; g.beginPath(); g.arc(x + 11.5 + (s % 9), y + 10, 2.6, 0, 7); g.fill();
  if (look.fx === 'spit' || look.fx === 'oven') { g.fillStyle = '#4a4f55'; g.fillRect(x + w - 15, y + 5, 9, 9); g.fillStyle = 'rgba(255,255,255,.3)'; g.beginPath(); g.arc(x + w - 10, y + 9, 2.4, 0, 7); g.fill(); }
  // Cephe
  const fy = y + h - front;
  g.fillStyle = look.wall; g.fillRect(x, fy, w, front);
  const gw = w - 8;
  g.fillStyle = 'rgba(180,225,250,.86)'; g.fillRect(x + 4, fy + 8, gw * 0.62, front - 10);
  g.fillStyle = '#2a2520'; g.fillRect(x + 6 + gw * 0.66, fy + 7, gw * 0.26, front - 7);
  // Tente: çizgili
  const n = Math.max(3, Math.floor(w / 7));
  for (let i = 0; i < n; i++) { g.fillStyle = look.awn[i % 2]; g.fillRect(x + (i * w) / n, fy + 1, w / n + 0.5, 5); }
  if (look.fx === 'spit') { g.fillStyle = '#8a4a1e'; g.fillRect(x + 7, fy + 9, 5, front - 12); g.fillStyle = '#e8a04a'; g.fillRect(x + 8, fy + 10, 3, front - 14); }
  if (look.fx === 'cross') { g.fillStyle = '#d0121b'; g.fillRect(x + w - 11, fy - 9, 8, 3); g.fillRect(x + w - 8.5, fy - 11.5, 3, 8); }
  if (look.fx === 'pole') { for (let i = 0; i < 4; i++) { g.fillStyle = ['#d0121b', '#fff', '#1d6fb8', '#fff'][i]; g.fillRect(x + w - 6, fy + 6 + i * 3, 3, 3); } }
  if (look.fx === 'crates') { for (let i = 0; i < 3; i++) { g.fillStyle = ['#e8533f', '#7fc241', '#ffb020'][(s + i) % 3]; g.fillRect(x + 4 + i * 6, y + h - 4, 5, 4); } }
}

// Uzun bina cephesi: kat sayısı kadar pencere sırası, güneye bakar
function towerFace(g, x, y, w, wall, frame, glass, s, vertical) {
  g.fillStyle = frame; g.fillRect(x, y, w, wall);
  const rows = Math.floor(wall / 6.5);
  const cw = vertical ? 5 : 8 + (s % 3);
  for (let j = 0; j < rows; j++) {
    for (let px = x + 3; px < x + w - cw; px += cw + 2) {
      g.fillStyle = (s + Math.floor(px) * 3 + j * 7) % 9 === 0 ? '#ffe9a8' : glass;
      g.fillRect(px, y + 3 + j * 6.5, cw, 4.2);
    }
  }
}

function skyscraper(g, r) {
  // Gökdelen: kademeli yükselen, çok yüksek cephe, tepede anten ve helikopter pisti
  const { x, y, w, h, seed: s } = r;
  const wall = Math.min(h * 0.46, 92);
  const c = r.color;
  const kind = s % 4;
  towerFace(g, x, y + h - wall, w, wall, shade(c, -0.6), shade(c, 0.35), s, kind % 2 === 0);
  const rh = h - wall;
  const gl = g.createLinearGradient(x, y, x + w, y + rh);
  gl.addColorStop(0, shade(c, 0.55)); gl.addColorStop(0.55, c); gl.addColorStop(1, shade(c, -0.3));
  g.fillStyle = gl;
  if (kind === 3) { g.beginPath(); g.ellipse(x + w / 2, y + rh / 2, w / 2, rh / 2, 0, 0, 7); g.fill(); }
  else { rr(g, x, y, w, rh, kind === 1 ? 14 : 3); g.fill(); }
  g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1;
  const steps = 3 + (s % 3);
  for (let i = 1; i < steps; i++) { const m = i * Math.min(w, rh) * 0.07; rr(g, x + m, y + m, w - m * 2, rh - m * 2, 6); g.stroke(); }
  const cx = x + w / 2; const cy = y + rh / 2; const d = Math.min(w, rh) * 0.2;
  g.fillStyle = '#3d444e'; g.beginPath(); g.arc(cx, cy, d, 0, 7); g.fill();
  g.strokeStyle = '#ffd23f'; g.lineWidth = 2; g.stroke();
  label(g, s % 2 ? 'H' : '✦', cx, cy + 1, d, '#fff');
}

function residence2(g, r) {
  // Rezidans: bombeli balkon sıraları, teras bahçesi, çok katlı
  const { x, y, w, h, seed: s } = r;
  const c = ['#d9d3c7', '#c7d4dc', '#e2c8b4', '#b9c8c0', '#d5c2d6'][s % 5];
  const wall = Math.min(h * 0.42, 74);
  g.fillStyle = shade(c, -0.42); g.fillRect(x, y + h - wall, w, wall);
  for (let j = 0; j * 9 < wall - 4; j++) {
    const py = y + h - wall + 3 + j * 9;
    for (let px = x + 3; px < x + w - 12; px += 14 + (s % 4)) {
      g.fillStyle = '#9fd2ee'; g.fillRect(px, py, 9, 5);
      g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(px - 1, py + 5, 11, 1.6);
    }
  }
  const rh = h - wall;
  g.fillStyle = c; rr(g, x, y, w, rh, 12); g.fill();
  g.fillStyle = '#7fb56a'; rr(g, x + 6, y + 6, w * 0.4, rh * 0.4, 6); g.fill();
  g.fillStyle = '#4f9a3a'; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(x + 12 + i * 9, y + 12 + (i % 2) * 6, 4, 0, 7); g.fill(); }
  g.fillStyle = '#57c1f0'; rr(g, x + w * 0.55, y + rh * 0.5, w * 0.34, rh * 0.32, 5); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.stroke();
}

function bank2(g, r) {
  // Banka: geniş cam cephe, kurumsal renk bandı, sütun, ATM sırası
  const { x, y, w, h } = r;
  const c = r.signColor;
  const f = Math.min(30, h * 0.46);
  g.fillStyle = '#d7dbdf'; g.fillRect(x, y, w, h);
  g.fillStyle = '#eef0f2'; g.fillRect(x, y, w, h - f);
  g.fillStyle = shade(c, 0.05); g.fillRect(x + 4, y + 4, w - 8, Math.min(8, (h - f) * 0.3));
  g.fillStyle = 'rgba(0,0,0,.06)'; g.fillRect(x + 10, y + 16, Math.max(2, w - 20), Math.max(2, h - f - 22));
  const gl = g.createLinearGradient(0, y + h - f, 0, y + h);
  gl.addColorStop(0, '#a9dcf5'); gl.addColorStop(1, '#3f7ea3');
  g.fillStyle = gl; g.fillRect(x + 3, y + h - f, w - 6, f);
  g.fillStyle = '#f7f8f9';
  for (let px = x + 5; px < x + w - 4; px += 14) g.fillRect(px, y + h - f, 3, f);
  for (let i = 0; i < 3 && i * 11 < w - 12; i++) {
    const px = x + w - 14 - i * 11;
    g.fillStyle = c; g.fillRect(px, y + h - 12, 9, 12);
    g.fillStyle = '#bfe7ff'; g.fillRect(px + 1.5, y + h - 10, 6, 4);
    g.fillStyle = '#fff'; g.fillRect(px + 2, y + h - 4.5, 5, 1.4);
  }
  label(g, 'ATM', x + w - 22, y + h - f + 6, 7, '#fff');
}

function hospital2(g, r) {
  const { x, y, w, h } = r;
  const wall = 34;
  // Dört katlı beyaz bloklar, ortada avlu, tepede haç ve helikopter pisti
  g.fillStyle = '#9fb0bc'; g.fillRect(x, y + h - wall, w, wall);
  for (let j = 0; j < 4; j++) for (let px = x + 6; px < x + w - 12; px += 13) { g.fillStyle = 'rgba(160,210,240,.95)'; g.fillRect(px, y + h - wall + 3 + j * 7.4, 9, 4.6); }
  g.fillStyle = '#f4f7f9'; g.fillRect(x, y, w, h - wall);
  g.fillStyle = '#d7e2e8'; g.fillRect(x + w * 0.34, y + (h - wall) * 0.28, w * 0.32, (h - wall) * 0.44);
  g.fillStyle = '#7fb56a'; g.fillRect(x + w * 0.37, y + (h - wall) * 0.33, w * 0.26, (h - wall) * 0.34);
  // Koca kırmızı haç
  const cx = x + w * 0.17; const cy = y + (h - wall) * 0.5; const q = Math.min(w, h) * 0.14;
  g.fillStyle = '#fff'; g.beginPath(); g.arc(cx, cy, q * 1.5, 0, 7); g.fill();
  g.fillStyle = '#e30a17'; g.fillRect(cx - q, cy - q * 0.34, q * 2, q * 0.68); g.fillRect(cx - q * 0.34, cy - q, q * 0.68, q * 2);
  const hx = x + w * 0.83;
  g.fillStyle = '#3d444e'; g.beginPath(); g.arc(hx, cy, q * 1.4, 0, 7); g.fill();
  g.strokeStyle = '#ffd23f'; g.lineWidth = 2.5; g.stroke();
  label(g, 'H', hx, cy + 1, q * 1.7, '#fff');
  // Acil girişi
  g.fillStyle = '#d0121b'; g.fillRect(x + w * 0.4, y + h - 13, w * 0.2, 13);
  label(g, 'ACİL', x + w * 0.5, y + h - 6.5, 9, '#fff', 900);
}

function school2(g, r) {
  const { x, y, w, h } = r;
  const wall = 22;
  g.fillStyle = '#a06b34'; g.fillRect(x, y + h - wall, w, wall);
  for (let j = 0; j < 2; j++) for (let px = x + 6; px < x + w - 10; px += 12) { g.fillStyle = 'rgba(170,215,240,.95)'; g.fillRect(px, y + h - wall + 3 + j * 9, 8, 6); }
  g.fillStyle = '#e8cf9a'; g.fillRect(x, y, w, h - wall);
  g.fillStyle = '#c8553d'; g.fillRect(x, y, w, 7);
  g.fillStyle = '#d9b97a'; g.fillRect(x + 8, y + 12, w - 16, Math.max(2, h - wall - 18));
  g.fillStyle = '#3a2a1a'; g.fillRect(x + w / 2 - 9, y + h - 15, 18, 15);
}

function mosque2(g, r) {
  // Cami: taş avlu, şadırvan, merkezi kubbe, yarım kubbeler, kurşun rengi, dört minare
  const { x, y, w, h, seed: s } = r;
  const cx = x + w / 2; const cy = y + h * 0.42;
  g.fillStyle = '#d9d2c2'; rr(g, x, y, w, h, 6); g.fill();
  // Avlu revakları
  const ay = y + h * 0.72;
  g.fillStyle = '#efe8d8'; g.fillRect(x + 12, ay, w - 24, h * 0.24);
  g.fillStyle = '#b9b09c';
  for (let px = x + 18; px < x + w - 18; px += 20) { g.beginPath(); g.arc(px, ay + 5, 6, 0, 7); g.arc(px, ay + h * 0.24 - 5, 6, 0, 7); g.fill(); }
  g.fillStyle = '#6fb6d0'; g.beginPath(); g.arc(cx, ay + h * 0.12, 11, 0, 7); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 2; g.stroke();
  // Ana yapı
  g.fillStyle = '#c9c3b4'; g.fillRect(x + 22, y + 16, w - 44, h * 0.56);
  const d = Math.min(w, h) * 0.24;
  for (const [a, b] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
    const gr = g.createRadialGradient(cx + a * d * 0.9 - 3, cy + b * d * 0.9 - 3, 1, cx + a * d * 0.9, cy + b * d * 0.9, d * 0.56);
    gr.addColorStop(0, '#a8b8c4'); gr.addColorStop(1, '#5f7180');
    g.fillStyle = gr; g.beginPath(); g.arc(cx + a * d * 0.9, cy + b * d * 0.9, d * 0.56, 0, 7); g.fill();
  }
  for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { g.fillStyle = '#7d8f9c'; g.beginPath(); g.arc(cx + a * d * 0.92, cy + b * d * 0.92, d * 0.26, 0, 7); g.fill(); }
  const gr = g.createRadialGradient(cx - d * 0.35, cy - d * 0.35, 2, cx, cy, d);
  gr.addColorStop(0, '#d2dde5'); gr.addColorStop(0.6, '#8fa2b0'); gr.addColorStop(1, '#55697a');
  g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, d, 0, 7); g.fill();
  g.strokeStyle = 'rgba(255,255,255,.28)'; g.lineWidth = 1;
  for (let i = 0; i < 16; i++) { const t = (i / 16) * 6.283; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(t) * d, cy + Math.sin(t) * d); g.stroke(); }
  g.fillStyle = '#e8c547'; g.beginPath(); g.arc(cx, cy, 3.4, 0, 7); g.fill();
  // Minareler: gölgesi yere uzanan ince kuleler
  const n = s % 2 ? 4 : 2;
  const mins = n === 4 ? [[x + 12, y + 12], [x + w - 12, y + 12], [x + 12, y + h * 0.7], [x + w - 12, y + h * 0.7]] : [[x + 12, y + h * 0.68], [x + w - 12, y + h * 0.68]];
  for (const [px, py] of mins) {
    g.fillStyle = 'rgba(0,10,30,.28)'; g.beginPath(); g.moveTo(px - 2, py); g.lineTo(px + 48, py + 60); g.lineTo(px + 53, py + 56); g.lineTo(px + 3, py - 3); g.closePath(); g.fill();
    g.fillStyle = '#f4f2ea'; g.beginPath(); g.arc(px, py, 7.5, 0, 7); g.fill();
    g.strokeStyle = '#b9b09c'; g.lineWidth = 1.2; g.stroke();
    g.fillStyle = '#6f8192'; g.beginPath(); g.moveTo(px, py - 5); g.lineTo(px + 5, py); g.lineTo(px, py + 5); g.lineTo(px - 5, py); g.closePath(); g.fill();
  }
}

// Sıradan apartmanda daha fazla kat ve cephe çeşidi
function apartment2(g, r) {
  const { x, y, w, h, seed: s } = r;
  if (h < 90) { apartment(g, r); return; }
  const floors = 3 + (s % 6);
  const wall = Math.min(h * 0.5, floors * 8);
  const col = baseHex(s);
  const kind = s % 4;
  g.fillStyle = shade(col, -0.2); g.fillRect(x, y + h - wall, w, wall);
  for (let j = 0; j < floors; j++) {
    const py = y + h - wall + 2 + j * 8;
    for (let px = x + 4; px < x + w - 8; px += 11 + (s % 3)) {
      g.fillStyle = (s + px + j) % 6 === 0 ? '#ffe9a8' : 'rgba(195,230,255,.9)';
      g.fillRect(px, py, kind === 1 ? 8 : 5, 4.6);
      if (kind === 2) { g.fillStyle = 'rgba(255,255,255,.7)'; g.fillRect(px - 1, py + 4.6, 8, 1.2); }
      if (kind === 3 && (px + j) % 3 === 0) { g.fillStyle = ['#e8533f', '#f2c14e', '#3e7cb1'][(px + j) % 3]; g.fillRect(px, py + 4.6, 5, 2.4); }
    }
  }
  const sub = { ...r, h: h - wall + 12 };
  const roofY = y;
  const rh = h - wall;
  const t = s % 5;
  if (t <= 1) {
    g.fillStyle = t ? '#b5482f' : '#a0533a'; g.fillRect(x, roofY, w, rh);
    g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(x, roofY + rh / 2, w, rh / 2);
    g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = 1;
    for (let py = roofY + 5; py < roofY + rh; py += 6) { g.beginPath(); g.moveTo(x, py); g.lineTo(x + w, py); g.stroke(); }
    g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(x, roofY + rh / 2 - 1, w, 2);
  } else if (t === 2) {
    g.fillStyle = col; g.fillRect(x, roofY, w, rh);
    g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 2; g.strokeRect(x + 3, roofY + 3, w - 6, rh - 6);
    g.fillStyle = '#1f3f77';
    for (let py = roofY + 8; py < roofY + rh - 12; py += 12) for (let px = x + 8; px < x + w - 16; px += 16) g.fillRect(px, py, 13, 9);
  } else if (t === 3) {
    g.fillStyle = '#c6b8a0'; g.fillRect(x, roofY, w, rh);
    g.fillStyle = shade(col, -0.1); g.fillRect(x + w * 0.1, roofY + rh * 0.2, w * 0.3, rh * 0.5);
    g.fillStyle = '#d7dde2'; g.beginPath(); g.ellipse(x + w * 0.7, roofY + rh * 0.4, 7, 6, 0, 0, 7); g.fill();
  } else {
    g.fillStyle = shade(col, 0.12); g.fillRect(x, roofY, w, rh);
    g.strokeStyle = 'rgba(0,0,0,.12)'; g.lineWidth = 1;
    for (let px = x + 9; px < x + w; px += 9) { g.beginPath(); g.moveTo(px, roofY); g.lineTo(px, roofY + rh); g.stroke(); }
    g.fillStyle = '#8a4a2a'; g.fillRect(x + w * 0.2, roofY + 8, 14, 11);
  }
  void sub;
}

function paintBuilding2(g, r) {
  const S = BUILD;
  switch (r.style) {
    case S.APARTMENT: apartment2(g, r); break;
    case S.SISTEM: sistem(g, r); break;
    case S.CHAIN: (CHAINS[r.brand] || CHAINS.Migros)(g, r); break;
    case S.BANK: bank2(g, r); break;
    case S.SHOP: shop(g, r); break;
    case S.SKYSCRAPER: skyscraper(g, r); break;
    case S.RESIDENCE: residence2(g, r); break;
    case S.OFFICE: office(g, r); break;
    case S.HOTEL: hotel(g, r); break;
    case S.HOSPITAL: hospital2(g, r); break;
    case S.SCHOOL: school2(g, r); break;
    case S.MOSQUE: mosque2(g, r); break;
    case S.STADIUM: stadium(g, r); break;
    case S.SITE_BLOCK: siteBlock(g, r); break;
    case S.GECEKONDU: gecekondu(g, r); break;
    case S.VILLA: villa(g, r); break;
    case S.ISHANI: ishani(g, r); break;
    case S.SHOPROW: shoprow(g, r); break;
    case S.CLUB: club(g, r); break;
    default: return false;
  }
  return true;
}

// Gölge boyu: bina yüksekliğine göre
function shadowOf(r) {
  const S = BUILD;
  switch (r.style) {
    case S.SKYSCRAPER: return 4.6;
    case S.RESIDENCE: case S.OFFICE: return 3.2;
    case S.HOTEL: case S.SISTEM: case S.HOSPITAL: return 2;
    case S.SITE_BLOCK: return 1.5 + (r.seed % 3) * 0.3;
    case S.APARTMENT: return 0.9 + (r.seed % 4) * 0.3;
    case S.GECEKONDU: case S.VILLA: case S.SHOP: return 0.45;
    case S.STADIUM: return 1;
    default: return 1;
  }
}

const NIGHT_LIGHTS = CONFIG.day;

// --- carsheet.js ---
// Üretilmiş dosya: node tools/bake-cars.mjs
const CAR_SHEET = {"w":2048,"h":1675,"cells":{"p:dogan:0":[0,0,288,144],"p:dogan:1":[290,0,288,144],"p:dogan:2":[580,0,288,144],"p:dogan:3":[870,0,288,144],"p:motor:0":[1160,0,288,162],"p:motor:1":[1450,0,288,162],"p:motor:2":[1740,0,288,162],"p:motor:3":[0,164,288,162],"p:grandland:0":[290,164,288,144],"p:grandland:1":[580,164,288,144],"p:grandland:2":[870,164,288,144],"p:grandland:3":[1160,164,288,144],"p:tog:0":[1450,164,288,144],"p:tog:1":[1740,164,288,144],"p:tog:2":[0,328,288,144],"p:tog:3":[290,328,288,144],"p:sahin:0":[580,328,288,144],"p:sahin:1":[870,328,288,144],"p:sahin:2":[1160,328,288,144],"p:sahin:3":[1450,328,288,144],"p:anadol:0":[1740,328,288,144],"p:anadol:1":[0,474,288,144],"p:anadol:2":[290,474,288,144],"p:anadol:3":[580,474,288,144],"p:murat:0":[870,474,288,144],"p:murat:1":[1160,474,288,144],"p:murat:2":[1450,474,288,144],"p:murat:3":[1740,474,288,144],"p:egea:0":[0,620,288,144],"p:egea:1":[290,620,288,144],"p:egea:2":[580,620,288,144],"p:egea:3":[870,620,288,144],"p:clio:0":[1160,620,288,144],"p:clio:1":[1450,620,288,144],"p:clio:2":[1740,620,288,144],"p:clio:3":[0,766,288,144],"p:duster:0":[290,766,288,144],"p:duster:1":[580,766,288,144],"p:duster:2":[870,766,288,144],"p:duster:3":[1160,766,288,144],"npc:tofas:0":[1450,766,168,84],"npc:tofas:1":[1620,766,168,84],"npc:tofas:2":[1790,766,168,84],"npc:tofas:3":[0,912,168,84],"npc:tofas:4":[170,912,168,84],"npc:murat:0":[340,912,168,84],"npc:murat:1":[510,912,168,84],"npc:murat:2":[680,912,168,84],"npc:murat:3":[850,912,168,84],"npc:anadol:0":[1020,912,168,84],"npc:anadol:1":[1190,912,168,84],"npc:anadol:2":[1360,912,168,84],"npc:tog:0":[1530,912,168,84],"npc:tog:1":[1700,912,168,84],"npc:tog:2":[1870,912,168,84],"npc:tog:3":[0,998,168,84],"npc:taxi:0":[170,998,168,84],"npc:bavyera:0":[340,998,168,84],"npc:bavyera:1":[510,998,168,84],"npc:bavyera:2":[680,998,168,84],"npc:bavyera:3":[850,998,168,84],"npc:bavyera:4":[1020,998,168,84],"npc:halka:0":[1190,998,168,84],"npc:halka:1":[1360,998,168,84],"npc:halka:2":[1530,998,168,84],"npc:halka:3":[1700,998,168,84],"npc:yildiz:0":[1870,998,168,84],"npc:yildiz:1":[0,1084,168,84],"npc:yildiz:2":[170,1084,168,84],"npc:yildiz:3":[340,1084,168,84],"npc:golf:0":[510,1084,168,84],"npc:golf:1":[680,1084,168,84],"npc:golf:2":[850,1084,168,84],"npc:golf:3":[1020,1084,168,84],"npc:golf:4":[1190,1084,168,84],"npc:focus:0":[1360,1084,168,84],"npc:focus:1":[1530,1084,168,84],"npc:focus:2":[1700,1084,168,84],"npc:focus:3":[1870,1084,168,84],"npc:kore:0":[0,1170,168,84],"npc:kore:1":[170,1170,168,84],"npc:kore:2":[340,1170,168,84],"npc:kore:3":[510,1170,168,84],"npc:megane:0":[680,1170,168,84],"npc:megane:1":[850,1170,168,84],"npc:megane:2":[1020,1170,168,84],"npc:megane:3":[1190,1170,168,84],"npc:linea:0":[1360,1170,168,84],"npc:linea:1":[1530,1170,168,84],"npc:linea:2":[1700,1170,168,84],"npc:linea:3":[1870,1170,168,84],"npc:pickup:0":[0,1256,168,84],"npc:pickup:1":[170,1256,168,84],"npc:pickup:2":[340,1256,168,84],"npc:pickup:3":[510,1256,168,84],"npc:motosiklet:0":[680,1256,168,84],"npc:motosiklet:1":[850,1256,168,84],"npc:motosiklet:2":[1020,1256,168,84],"npc:motosiklet:3":[1190,1256,168,84],"npc:clio:0":[1360,1256,168,84],"npc:clio:1":[1530,1256,168,84],"npc:clio:2":[1700,1256,168,84],"npc:clio:3":[1870,1256,168,84],"npc:duster:0":[0,1342,168,84],"npc:duster:1":[170,1342,168,84],"npc:duster:2":[340,1342,168,84],"npc:grandland:0":[510,1342,168,84],"npc:grandland:1":[680,1342,168,84],"npc:grandland:2":[850,1342,168,84],"npc:egea:0":[1020,1342,168,84],"npc:egea:1":[1190,1342,168,84],"npc:egea:2":[1360,1342,168,84],"npc:egea:3":[1530,1342,168,84],"npc:minibus:0":[1700,1342,300,108],"npc:bus:0":[0,1452,300,108],"npc:bus:1":[302,1452,300,108],"npc:bus:2":[604,1452,300,108],"npc:truck:0":[906,1452,300,108],"npc:truck:1":[1208,1452,300,108],"npc:truck:2":[1510,1452,300,108],"npc:truck:3":[0,1562,300,108],"cop:car":[302,1562,200,100],"cop:fast":[504,1562,200,100],"cop:advanced":[706,1562,200,100],"cop:swat":[908,1562,200,88],"cop:moto":[1110,1562,200,113]}};

// --- sheet.js ---
// 3B modellerden üretilmiş araç atlası. Atlas yüklenemezse çizim kodlu yedek sprite'lar kullanılır.

const FRAME_L = 1.08; // Kare, aracın boyundan bu kadar geniş
const FRAME_W = 1.5;
const FATTEN = 1.14; // Üstten görünümde dar kalmasın diye genişlik büyütülür
const DRAW_LEN = 1.1; // Çizilen boy, çarpışma boyuna oranla

const ATLAS = { img: null, ready: false };

function loadAtlas(done) {
  if (typeof Image === 'undefined') return;
  const img = new Image();
  img.onload = () => { ATLAS.img = img; ATLAS.ready = true; if (done) done(); };
  img.onerror = () => { ATLAS.ready = false; if (done) done(); };
  img.src = 'assets/cars.webp';
}

const atlasReady = () => ATLAS.ready;

// Atlas hücresini ayrı tuvale keser. wu/hu: dünya birimi çizim boyutu
function sheetSprite(key, len) {
  const cell = CAR_SHEET.cells[key];
  if (!ATLAS.ready || !cell) return null;
  const [x, y, w, h] = cell;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  c.getContext('2d').drawImage(ATLAS.img, x, y, w, h, 0, 0, w, h);
  c.wu = len * DRAW_LEN * FRAME_L;
  c.hu = (c.wu * h) / w;
  return c;
}

// Üretilecek sprite listesi: oyuncu boyaları, sivil trafik ve polis
function spriteList(cfg) {
  const list = [];
  for (const c of cfg.cars) {
    c.paints.forEach((p, i) => list.push({
      key: `p:${c.id}:${i}`, model: c.shape, px: 288, ar: c.shape === 'moto' ? 0.56 : 0.5,
      paint: { ...p, accent: p.accent || c.accent, premium: 1, rim: c.rim, caliper: '#ff3a2a', mirror: 'black' },
    }));
  }
  const fin = cfg.npc.finishes;
  for (const k of Object.keys(cfg.npc.types)) {
    const t = cfg.npc.types[k];
    const big = t.len > 60;
    t.colors.forEach((color, i) => list.push({
      key: `npc:${k}:${i}`, model: t.model || k, px: big ? 300 : 168, ar: big ? 0.36 : 0.5,
      paint: { color, finish: fin[i % 3], accent: t.accent || t.colors[(i + 1) % t.colors.length], sign: k === 'taxi' ? { text: 'TAKSİ', c: '#ffd23f' } : null },
    }));
  }
  const cops = {
    car: ['egea', { color: '#f2f4f7', finish: 'gloss', band: '#1c4fb0', roof: '#f2f4f7', police: 1, text: 'POLİS', textColor: '#1c4fb0' }],
    fast: ['bavyera', { color: '#16305f', finish: 'metal', police: 1, band: '#ffffff', text: 'POLİS' }],
    advanced: ['tog', { color: '#14161b', finish: 'metal', police: 1, band: '#ff2a3c' }],
    swat: ['minibus', { color: '#23272e', finish: 'matte', police: 1, band: '#ffd23f', text: 'ÖZEL HAREKAT' }],
    moto: ['moto', { color: '#1c4fb0', finish: 'gloss', accent: '#ffffff' }],
  };
  for (const k of Object.keys(cops)) list.push({ key: `cop:${k}`, model: cops[k][0], px: 200, ar: k === 'swat' ? 0.44 : k === 'moto' ? 0.56 : 0.5, paint: cops[k][1] });
  return list;
}

// --- carmodels.js ---
// Araç tanımları. Her model önce gerçek aracın özellik listesiyle (features) başlar, geometri bu listeye göre verilir.
// Ölçüler metredir. s: burundan kuyruğa 0-1 konum. deck: kaput/omuz/bagaj hattı, roof: tavan hattı, plan: üstten yarı genişlik oranı.
// Gerçek logo yoktur: emblemler marka havası veren özgün çizimlerdir.

const LED = '#eafcff';
const AMB = '#ff9a1f';
const RED = '#e0142a';
const BLK = '#0c0e12';
const CRM = '#d9dfe6';
const GRY = '#2a2e35';

// d: fascia çizim yardımcısı. Koordinat metre: y sola/sağa merkezden, z yerden yukarı
const CAR_MODELS = {
  dogan: {
    name: 'Tofaş Doğan', L: 4.25, W: 1.65, H: 1.38, wb: 2.49, fo: 0.8, r: 0.29, sill: 0.2, crown: 0.03, tumble: 0.85, bowF: 0.03, bowR: 0.03, rim: 'hub',
    features: ['Üç kutulu köşeli sedan, uzun düz kaput', 'Dikdörtgen tek parça far, araya yatay siyah ızgara', 'Siyah plastik tamponlar', 'Dik ön cam ve geniş kare yan camlar', 'Geniş dikdörtgen stop grubu, kırmızı-turuncu-beyaz'],
    plan: [[0, 0.93], [0.03, 0.98], [0.5, 1], [0.97, 0.98], [1, 0.94]],
    deck: [[0, 0.7], [0.025, 0.77], [0.3, 0.86], [0.36, 0.88], [0.78, 0.9], [0.97, 0.87], [1, 0.76]],
    roof: [[0.31, 0.86], [0.44, 1.36], [0.7, 1.38], [0.8, 0.93], [0.82, 0.9]],
    win: [[0.4, 0.545], [0.56, 0.74]], seams: [0.345, 0.55, 0.76], handles: [0.53, 0.735], hood: 0.3, trunk: 0.82,
    bumper: { c: GRY, z: 0.44, h: 0.12, d: 0.08 },
    top: [{ s0: 0.002, s1: 0.03, a: 0.52, b: 0.93, c: LED, glow: 1 }, { s0: 0.975, s1: 0.999, a: 0.34, b: 0.93, c: RED, glow: 1 }],
    front(d) {
      d.box(0, 0.68, 1.5, 0.22, BLK, 0.02);
      d.both(0.57, 0.68, 0.33, 0.17, LED, 0.02); d.both(0.57, 0.68, 0.33, 0.17, '#fff5c4', 0.02);
      d.both(0.72, 0.68, 0.06, 0.15, AMB, 0.01);
      for (let z = 0.61; z < 0.76; z += 0.05) d.box(0, z, 0.72, 0.02, '#555b63');
      d.emblem(0, 0.68, 'shield');
    },
    rear(d) {
      d.both(0.55, 0.72, 0.5, 0.2, RED, 0.02); d.both(0.42, 0.72, 0.13, 0.18, AMB); d.both(0.3, 0.72, 0.1, 0.18, '#f1f3f5');
      d.box(0, 0.58, 0.46, 0.13, '#f0f2f4', 0.01); d.text('DOĞAN', 0.25, 0.8);
    },
  },
  sahin: {
    name: 'Tofaş Şahin', L: 4.23, W: 1.65, H: 1.36, wb: 2.49, fo: 0.8, r: 0.31, sill: 0.15, crown: 0.03, tumble: 0.85, bowF: 0.03, bowR: 0.03, rim: 'five',
    features: ['Doğan gövdesi, alçaltılmış sokak tuning', 'Dev bagaj spoyleri, kaputta çift şerit', 'Kararmış cam, geniş jant', 'Yan etek ve kalın egzoz', 'Kare far, siyah ızgara'],
    plan: [[0, 0.93], [0.03, 0.98], [0.5, 1], [0.97, 0.98], [1, 0.94]],
    deck: [[0, 0.66], [0.025, 0.73], [0.3, 0.82], [0.36, 0.84], [0.78, 0.86], [0.97, 0.83], [1, 0.72]],
    roof: [[0.31, 0.82], [0.44, 1.32], [0.7, 1.34], [0.8, 0.89], [0.82, 0.86]],
    win: [[0.4, 0.545], [0.56, 0.74]], seams: [0.345, 0.55, 0.76], handles: [0.53, 0.735], hood: 0.3, trunk: 0.82, darkGlass: 1,
    wing: { s: 0.965, z: 1.12, span: 1.6, chord: 0.3 }, skirt: 1, exhaust: 1,
    bumper: { c: BLK, z: 0.38, h: 0.15, d: 0.1 },
    stripes: [{ s0: 0, s1: 1, a: 0.12, b: 0.3 }],
    top: [{ s0: 0.002, s1: 0.03, a: 0.5, b: 0.93, c: LED, glow: 1 }, { s0: 0.975, s1: 0.999, a: 0.34, b: 0.93, c: RED, glow: 1 }],
    front(d) {
      d.box(0, 0.64, 1.52, 0.23, BLK, 0.02);
      d.both(0.57, 0.64, 0.33, 0.18, '#fff8d8', 0.02);
      d.both(0.57, 0.44, 0.17, 0.08, '#ffe9a0', 0.03);
      d.box(0, 0.37, 0.7, 0.1, '#050608', 0.02);
      d.emblem(0, 0.64, 'shield');
    },
    rear(d) { d.both(0.55, 0.68, 0.5, 0.21, RED, 0.02); d.box(0, 0.68, 0.56, 0.17, BLK); d.text('ŞAHİN', 0.24, 0.68, '#ffd23f'); d.both(0.52, 0.3, 0.1, 0.1, '#7d858f', 0.05); },
  },
  murat: {
    name: 'Murat 131', L: 4.26, W: 1.65, H: 1.4, wb: 2.49, fo: 0.78, r: 0.28, sill: 0.22, crown: 0.02, tumble: 0.88, bowF: 0.0, bowR: 0.0, rim: 'steel',
    features: ['1970ler Fiat 131 çizgisi, çok dik köşeler', 'Dörtlü yuvarlak far, far arası krom ızgara', 'Parlak krom tamponlar, tampon lastikleri', 'İnce direkler, kocaman camlar', 'Uzun bagaj, dikey dikdörtgen stoplar'],
    plan: [[0, 0.95], [0.012, 0.99], [0.5, 1], [0.988, 0.99], [1, 0.96]],
    deck: [[0, 0.74], [0.015, 0.82], [0.3, 0.88], [0.36, 0.9], [0.78, 0.92], [0.985, 0.9], [1, 0.8]],
    roof: [[0.32, 0.88], [0.43, 1.38], [0.71, 1.4], [0.79, 0.95], [0.81, 0.92]],
    win: [[0.395, 0.54], [0.555, 0.745]], seams: [0.345, 0.545, 0.76], handles: [0.525, 0.735], hood: 0.31, trunk: 0.81, roofStrip: 1,
    bumper: { c: CRM, z: 0.48, h: 0.1, d: 0.09 },
    top: [{ s0: 0, s1: 0.016, a: 0.2, b: 0.92, c: BLK }, { s0: 0.984, s1: 1, a: 0.5, b: 0.93, c: RED, glow: 1 }],
    front(d) {
      d.box(0, 0.7, 1.5, 0.22, CRM, 0.01); d.box(0, 0.7, 1.46, 0.18, BLK, 0.01);
      for (const y of [0.36, 0.6]) { d.circ(y, 0.7, 0.095, CRM); d.circ(-y, 0.7, 0.095, CRM); d.circ(y, 0.7, 0.078, '#fff8d8'); d.circ(-y, 0.7, 0.078, '#fff8d8'); }
      for (let y = -0.2; y <= 0.2; y += 0.05) d.box(y, 0.7, 0.012, 0.14, CRM);
      d.both(0.62, 0.55, 0.12, 0.05, AMB, 0.01);
      d.emblem(0, 0.7, 'bars');
    },
    rear(d) { d.both(0.62, 0.76, 0.2, 0.24, RED, 0.01); d.both(0.46, 0.76, 0.1, 0.24, AMB); d.box(0, 0.62, 0.44, 0.13, '#f0f2f4', 0.01); d.box(0, 0.76, 0.6, 0.02, CRM); d.text('131', 0.2, 0.84, CRM); },
  },
  anadol: {
    name: 'Anadol A1', L: 4.2, W: 1.61, H: 1.43, wb: 2.47, fo: 0.72, r: 0.3, sill: 0.2, crown: 0.07, tumble: 0.78, bowF: 0.2, bowR: 0.16, rim: 'steel', smooth: 7,
    features: ['Fiberglas gövde, kavisli çamurluklar', 'İki kapılı 60\'lar sedanı, yuvarlak tavan', 'Oval ızgara içinde yuvarlak tek far', 'Krom tampon, küçük yuvarlak stoplar', 'Kısa kabin, uzun kaput'],
    plan: [[0, 0.72], [0.03, 0.88], [0.12, 0.97], [0.3, 1], [0.7, 0.98], [0.92, 0.92], [1, 0.76]],
    deck: [[0, 0.68], [0.04, 0.78], [0.2, 0.86], [0.42, 0.88], [0.7, 0.86], [0.92, 0.8], [1, 0.68]],
    roof: [[0.4, 0.88], [0.5, 1.36], [0.62, 1.42], [0.72, 1.36], [0.88, 0.9], [0.92, 0.82]],
    win: [[0.48, 0.66], [0.675, 0.77]], seams: [0.43, 0.68], handles: [0.65], hood: 0.36, trunk: 0.86, sideStripe: 0.7,
    bumper: { c: CRM, z: 0.46, h: 0.09, d: 0.09 },
    top: [{ s0: 0.01, s1: 0.06, a: 0.42, b: 0.82, c: '#fff8d8', glow: 1 }, { s0: 0.96, s1: 0.995, a: 0.4, b: 0.76, c: RED, glow: 1 }],
    front(d) {
      d.oval(0, 0.66, 1.2, 0.2, BLK);
      for (let y = -0.48; y <= 0.48; y += 0.08) d.box(y, 0.66, 0.015, 0.16, CRM);
      d.circ(0.56, 0.68, 0.11, CRM); d.circ(-0.56, 0.68, 0.11, CRM); d.circ(0.56, 0.68, 0.09, '#fff8d8'); d.circ(-0.56, 0.68, 0.09, '#fff8d8');
      d.emblem(0, 0.68, 'bars');
    },
    rear(d) { d.circ(0.52, 0.7, 0.085, RED); d.circ(-0.52, 0.7, 0.085, RED); d.circ(0.36, 0.7, 0.05, AMB); d.circ(-0.36, 0.7, 0.05, AMB); d.box(0, 0.6, 0.4, 0.12, '#f0f2f4', 0.01); },
  },
  tog: {
    name: 'TOG T10X', L: 4.6, W: 1.89, H: 1.68, wb: 2.89, fo: 0.8, r: 0.38, sill: 0.3, crown: 0.05, tumble: 0.8, bowF: 0.14, bowR: 0.1, rim: 'turbine', smooth: 5,
    features: ['C-SUV, çok kısa çıkıntılar, uzun aks', 'Boydan boya ince LED çubuğu', 'Lale motifli altıgen desenli ön panel', 'Yüzen siyah tavan, yukarı kıvrılan krom cam hattı', 'Boydan boya arka stop, 20 inç turbin jant'],
    plan: [[0, 0.82], [0.03, 0.93], [0.1, 0.98], [0.5, 1], [0.9, 0.98], [0.98, 0.92], [1, 0.84]],
    deck: [[0, 0.72], [0.03, 0.9], [0.2, 1.06], [0.3, 1.12], [0.8, 1.18], [0.95, 1.1], [1, 0.88]],
    roof: [[0.2, 1.06], [0.38, 1.62], [0.56, 1.68], [0.87, 1.58], [0.965, 1.16], [0.98, 1.1]],
    win: [[0.33, 0.56], [0.57, 0.8]], seams: [0.27, 0.56, 0.8], handles: [], hood: 0.22, trunk: 0.94, roofBlack: 1, chromeBelt: 1, clad: 0.48,
    top: [{ s0: 0.012, s1: 0.042, a: 0, b: 0.92, c: LED, glow: 1 }, { s0: 0.955, s1: 0.985, a: 0, b: 0.92, c: RED, glow: 1 }],
    front(d) {
      d.box(0, 0.86, 1.62, 0.03, LED, 0.01);
      d.box(0, 0.68, 1.5, 0.3, '#10141a', 0.04);
      for (let y = -0.66; y <= 0.66; y += 0.13) for (let z = 0.58; z <= 0.78; z += 0.1) d.diamond(y + ((Math.round(z * 10) % 2) ? 0.065 : 0), z, 0.05, '#39424e');
      d.both(0.7, 0.72, 0.16, 0.05, LED, 0.02);
      d.box(0, 0.38, 1.1, 0.12, '#10141a', 0.03);
      d.emblem(0, 0.86, 'tulip');
    },
    rear(d) { d.box(0, 1.0, 1.66, 0.05, RED, 0.02); d.box(0, 0.82, 1.4, 0.26, '#10141a', 0.03); d.text('T10X', 0.16, 0.84, '#dfe6ee'); d.box(0, 0.38, 1.2, 0.12, '#10141a', 0.03); },
  },
  egea: {
    name: 'Fiat Egea', L: 4.53, W: 1.79, H: 1.5, wb: 2.64, fo: 0.87, r: 0.32, sill: 0.2, crown: 0.05, tumble: 0.8, bowF: 0.16, bowR: 0.08, rim: 'multi', smooth: 4,
    features: ['Modern dört kapılı sedan, yüksek bagaj', 'Geriye süpürülmüş sivri farlar', 'Yamuk krom çerçeveli ızgara', 'Kavisli tavan, kısa kaput', 'Geniş yatay LED stop, bagajda krom bant'],
    plan: [[0, 0.76], [0.03, 0.9], [0.12, 0.98], [0.5, 1], [0.9, 0.98], [0.99, 0.88], [1, 0.84]],
    deck: [[0, 0.62], [0.03, 0.78], [0.24, 0.96], [0.3, 1.0], [0.72, 1.06], [0.93, 1.06], [0.99, 1.0], [1, 0.82]],
    roof: [[0.24, 0.96], [0.42, 1.44], [0.56, 1.5], [0.72, 1.44], [0.87, 1.08], [0.89, 1.06]],
    win: [[0.37, 0.56], [0.57, 0.77]], seams: [0.27, 0.565, 0.78], handles: [0.54, 0.75], hood: 0.27, trunk: 0.88,
    top: [{ s0: 0.035, s1: 0.085, a: 0.48, b: 0.9, b1: 0.97, a1: 0.8, c: LED, glow: 1 }, { s0: 0.93, s1: 0.99, a: 0.42, b: 0.92, c: RED, glow: 1 }],
    front(d) {
      d.poly([[-0.42, 0.72], [0.42, 0.72], [0.34, 0.54], [-0.34, 0.54]], BLK);
      d.polyLine([[-0.42, 0.72], [0.42, 0.72], [0.34, 0.54], [-0.34, 0.54]], CRM, 0.02);
      for (let z = 0.58; z < 0.7; z += 0.04) d.box(0, z, 0.68, 0.012, CRM);
      d.polyB([[0.46, 0.76], [0.86, 0.84], [0.8, 0.72], [0.48, 0.68]], LED);
      d.box(0, 0.32, 1.1, 0.12, BLK, 0.03);
      d.both(0.66, 0.38, 0.14, 0.05, '#c9d2dc', 0.02);
      d.emblem(0, 0.64, 'oval');
    },
    rear(d) { d.polyB([[0.3, 1.0], [0.86, 0.98], [0.82, 0.86], [0.34, 0.9]], RED); d.box(0, 0.92, 0.6, 0.02, CRM); d.box(0, 0.76, 0.5, 0.13, '#f0f2f4', 0.01); d.text('EGEA', 0.2, 0.86, CRM); },
  },
  clio: {
    name: 'Renault Clio', L: 4.05, W: 1.8, H: 1.44, wb: 2.58, fo: 0.82, r: 0.33, sill: 0.2, crown: 0.07, tumble: 0.76, bowF: 0.2, bowR: 0.08, rim: 'five', smooth: 6,
    features: ['Beş kapılı kısa hatchback, şişkin omuz', 'C biçimli gündüz LED\'i', 'Kaputta iki kabartma, baklava ızgara', 'Arka kapı kolu C direğinde gizli', 'Kavisli C biçimli stoplar, siyah tavan seçeneği'],
    plan: [[0, 0.72], [0.04, 0.9], [0.14, 0.98], [0.32, 0.96], [0.72, 1], [0.92, 0.96], [1, 0.82]],
    deck: [[0, 0.62], [0.04, 0.8], [0.22, 0.94], [0.3, 0.98], [0.75, 1.02], [0.95, 1.02], [1, 0.72]],
    roof: [[0.22, 0.94], [0.4, 1.38], [0.54, 1.44], [0.84, 1.39], [0.965, 1.08], [0.98, 1.02]],
    win: [[0.36, 0.56], [0.57, 0.78]], seams: [0.27, 0.565, 0.8], handles: [0.54], hood: 0.27, trunk: 0.95, hoodRibs: 1,
    top: [{ s0: 0.045, s1: 0.1, a: 0.56, b: 0.9, c: LED, glow: 1 }, { s0: 0.93, s1: 0.995, a: 0.55, b: 0.93, c: RED, glow: 1 }],
    front(d) {
      d.poly([[-0.34, 0.68], [0.34, 0.68], [0.28, 0.52], [-0.28, 0.52]], BLK);
      for (let y = -0.24; y <= 0.24; y += 0.08) d.diamond(y, 0.6, 0.03, '#59616b');
      d.polyB([[0.42, 0.72], [0.8, 0.76], [0.8, 0.66], [0.46, 0.64]], '#141a20');
      d.arcB(0.68, 0.56, 0.17, LED);
      d.box(0, 0.32, 1.16, 0.13, BLK, 0.04);
      d.emblem(0, 0.62, 'rhomb');
    },
    rear(d) { d.arcR(0.68, 0.88, 0.17, RED); d.box(0, 0.5, 1.2, 0.13, BLK, 0.03); d.box(0, 0.68, 0.46, 0.12, '#f0f2f4', 0.01); d.text('CLIO', 0.17, 0.84); d.emblem(0, 0.92, 'rhomb'); },
  },
  grandland: {
    name: 'Opel Grandland', L: 4.48, W: 1.86, H: 1.61, wb: 2.68, fo: 0.9, r: 0.36, sill: 0.25, crown: 0.05, tumble: 0.8, bowF: 0.14, bowR: 0.08, rim: 'multi', smooth: 5,
    features: ['Kompakt SUV, yüksek kaput', 'Boydan boya siyah "vizör" ön yüz, ince LED', 'Çift tonlu siyah yüzen tavan', 'Kısa arka çıkıntı, tavan rayı', 'Yatay ince stoplar, ortada dikey çizgi motifi'],
    plan: [[0, 0.8], [0.03, 0.92], [0.12, 0.98], [0.5, 1], [0.92, 0.98], [1, 0.84]],
    deck: [[0, 0.72], [0.03, 0.9], [0.24, 1.06], [0.3, 1.1], [0.8, 1.12], [0.96, 1.1], [1, 0.84]],
    roof: [[0.24, 1.06], [0.4, 1.56], [0.6, 1.61], [0.86, 1.54], [0.965, 1.16], [0.98, 1.1]],
    win: [[0.36, 0.56], [0.57, 0.82]], seams: [0.27, 0.565, 0.82], handles: [0.54, 0.79], hood: 0.27, trunk: 0.95, roofBlack: 1, rails: 1, clad: 0.46,
    top: [{ s0: 0, s1: 0.1, a: 0, b: 0.94, c: '#0d1014' }, { s0: 0.02, s1: 0.07, a: 0.56, b: 0.94, c: LED, glow: 1 }, { s0: 0.96, s1: 0.99, a: 0.4, b: 0.92, c: RED, glow: 1 }],
    front(d) {
      d.box(0, 0.84, 1.66, 0.2, '#0d1014', 0.05);
      d.both(0.62, 0.86, 0.38, 0.05, LED, 0.02);
      d.box(0, 0.84, 0.012, 0.18, CRM);
      d.box(0, 0.42, 1.2, 0.14, '#14181e', 0.03);
      d.both(0.66, 0.54, 0.18, 0.04, LED, 0.02);
      d.emblem(0, 0.84, 'bolt');
    },
    rear(d) { d.both(0.55, 0.98, 0.56, 0.06, RED, 0.02); d.box(0, 0.98, 0.5, 0.02, RED); d.box(0, 0.78, 0.012, 0.3, CRM); d.box(0, 0.42, 1.2, 0.14, '#14181e', 0.03); d.emblem(0, 0.96, 'bolt'); },
  },
  duster: {
    name: 'Dacia Duster', L: 4.34, W: 1.8, H: 1.69, wb: 2.67, fo: 0.84, r: 0.37, sill: 0.34, crown: 0.03, tumble: 0.86, bowF: 0.08, bowR: 0.03, rim: 'hub',
    features: ['Kutu gibi arazi gövdesi, yüksek tavan', 'Üç yatay çubuklu krom ızgara, kare far', 'Kalın siyah çamurluk kaplamaları', 'Gümüş ön-arka koruma, tavan barları', 'Dört kareli haç biçimli stoplar'],
    plan: [[0, 0.84], [0.025, 0.95], [0.1, 0.99], [0.5, 1], [0.95, 0.99], [1, 0.9]],
    deck: [[0, 0.82], [0.03, 0.98], [0.26, 1.1], [0.32, 1.13], [0.82, 1.15], [0.975, 1.12], [1, 0.92]],
    roof: [[0.27, 1.1], [0.41, 1.62], [0.6, 1.66], [0.86, 1.62], [0.965, 1.18], [0.975, 1.13]],
    win: [[0.375, 0.57], [0.58, 0.77], [0.78, 0.89]], seams: [0.29, 0.575, 0.8], handles: [0.555, 0.775], hood: 0.29, trunk: 0.97, rails: 1, clad: 0.6, roofColor: 0,
    top: [{ s0: 0.01, s1: 0.05, a: 0.56, b: 0.94, c: LED, glow: 1 }, { s0: 0.97, s1: 0.995, a: 0.56, b: 0.94, c: RED, glow: 1 }, { s0: 0, s1: 0.014, a: 0, b: 0.5, c: '#b8bec6' }],
    front(d) {
      d.both(0.62, 0.92, 0.38, 0.17, '#141a20', 0.03);
      d.both(0.62, 0.92, 0.3, 0.1, LED, 0.02);
      d.box(0, 0.92, 0.84, 0.2, BLK, 0.02);
      for (const z of [0.86, 0.92, 0.98]) d.box(0, z, 0.8, 0.02, CRM);
      d.box(0, 0.44, 1.5, 0.22, '#23272e', 0.03);
      d.box(0, 0.38, 0.9, 0.1, '#c2c8cf', 0.02);
      d.emblem(0, 0.92, 'link');
    },
    rear(d) { for (const y of [0.55, 0.72]) for (const z of [0.98, 1.1]) { d.box(y, z, 0.14, 0.09, RED, 0.01); d.box(-y, z, 0.14, 0.09, RED, 0.01); } d.box(0, 0.74, 0.46, 0.13, '#f0f2f4', 0.01); d.box(0, 0.42, 1.5, 0.24, '#23272e', 0.03); d.box(0, 0.38, 0.84, 0.1, '#c2c8cf', 0.02); d.text('DUSTER', 0.22, 1.0, CRM); },
  },
  bavyera: {
    name: 'Bavyera sedan', L: 4.71, W: 1.83, H: 1.44, wb: 2.85, fo: 0.79, r: 0.33, sill: 0.17, crown: 0.05, tumble: 0.77, bowF: 0.15, bowR: 0.1, rim: 'star', smooth: 4,
    features: ['Uzun kaput, kabin geride, sportif sedan', 'İkiz böbrek ızgara', 'Köşeli çift halkalı far', 'C direğinde geriye kıvrılan cam ucu', 'L biçimli yatay stoplar'],
    plan: [[0, 0.78], [0.03, 0.92], [0.12, 0.98], [0.5, 1], [0.93, 0.98], [1, 0.86]],
    deck: [[0, 0.58], [0.03, 0.74], [0.3, 0.92], [0.4, 0.96], [0.82, 1.0], [0.97, 0.99], [1, 0.76]],
    roof: [[0.3, 0.92], [0.46, 1.38], [0.6, 1.44], [0.76, 1.38], [0.88, 1.02], [0.9, 1.0]],
    win: [[0.41, 0.59], [0.6, 0.79]], seams: [0.33, 0.6, 0.8], handles: [0.57, 0.77], hood: 0.33, trunk: 0.89,
    top: [{ s0: 0.035, s1: 0.085, a: 0.5, b: 0.92, c: LED, glow: 1 }, { s0: 0.955, s1: 0.99, a: 0.45, b: 0.92, c: RED, glow: 1 }, { s0: 0.0, s1: 0.035, a: 0.03, b: 0.3, c: BLK }],
    front(d) {
      for (const s of [-1, 1]) { d.round(s * 0.17, 0.62, 0.3, 0.2, CRM, 0.05); d.round(s * 0.17, 0.62, 0.26, 0.17, BLK, 0.04); for (let y = -0.1; y <= 0.1; y += 0.04) d.box(s * 0.17 + y, 0.62, 0.012, 0.15, '#6a727c'); }
      d.polyB([[0.36, 0.7], [0.82, 0.78], [0.8, 0.64], [0.38, 0.6]], '#141a20');
      for (const y of [0.52, 0.7]) { d.ring(y, 0.68, 0.06, LED); d.ring(-y, 0.68, 0.06, LED); }
      d.box(0, 0.32, 1.2, 0.12, BLK, 0.03);
      d.emblem(0, 0.8, 'propeller');
    },
    rear(d) { d.polyB([[0.3, 0.94], [0.88, 0.92], [0.86, 0.82], [0.52, 0.84], [0.5, 0.88], [0.32, 0.88]], RED); d.box(0, 0.7, 0.5, 0.13, '#f0f2f4', 0.01); d.box(0, 0.32, 1.2, 0.12, BLK, 0.03); d.both(0.5, 0.3, 0.1, 0.08, '#8c949e', 0.04); },
  },
  halka: {
    name: 'Halka sedan', L: 4.76, W: 1.84, H: 1.43, wb: 2.82, fo: 0.9, r: 0.33, sill: 0.17, crown: 0.04, tumble: 0.78, bowF: 0.12, bowR: 0.08, rim: 'multi', smooth: 4,
    features: ['Keskin omuz çizgili, yatay duruşlu sedan', 'Tek parça altıgen dev ızgara', 'Dar yatay LED far', 'Düz bagaj kapağı', 'Boydan boya ışık bandı'],
    plan: [[0, 0.8], [0.025, 0.93], [0.1, 0.99], [0.5, 1], [0.95, 0.99], [1, 0.88]],
    deck: [[0, 0.6], [0.03, 0.76], [0.26, 0.93], [0.34, 0.97], [0.82, 1.03], [0.975, 1.03], [1, 0.8]],
    roof: [[0.26, 0.93], [0.43, 1.37], [0.58, 1.43], [0.75, 1.37], [0.875, 1.05], [0.89, 1.03]],
    win: [[0.38, 0.57], [0.58, 0.77]], seams: [0.3, 0.58, 0.79], handles: [0.55, 0.75], hood: 0.3, trunk: 0.885,
    top: [{ s0: 0.03, s1: 0.09, a: 0.46, b: 0.94, c: LED, glow: 1 }, { s0: 0.965, s1: 0.992, a: 0, b: 0.93, c: RED, glow: 1 }, { s0: 0, s1: 0.03, a: 0.05, b: 0.42, c: BLK }],
    front(d) {
      d.poly([[-0.4, 0.74], [0.4, 0.74], [0.5, 0.6], [0.36, 0.34], [-0.36, 0.34], [-0.5, 0.6]], BLK);
      d.polyLine([[-0.4, 0.74], [0.4, 0.74], [0.5, 0.6], [0.36, 0.34], [-0.36, 0.34], [-0.5, 0.6]], '#7d8590', 0.02);
      for (let z = 0.4; z < 0.72; z += 0.05) d.box(0, z, 0.76, 0.012, '#4a515a');
      d.polyB([[0.52, 0.76], [0.86, 0.8], [0.84, 0.7], [0.56, 0.68]], LED);
      d.both(0.74, 0.38, 0.2, 0.14, BLK, 0.03);
      d.emblem(0, 0.66, 'rings3');
    },
    rear(d) { d.box(0, 0.97, 1.64, 0.05, RED, 0.01); d.both(0.6, 0.93, 0.44, 0.08, RED, 0.01); d.box(0, 0.74, 0.5, 0.13, '#f0f2f4', 0.01); d.box(0, 0.34, 1.3, 0.1, BLK, 0.03); d.emblem(0, 0.9, 'rings3'); },
  },
  yildiz: {
    name: 'Yıldız sedan', L: 4.69, W: 1.82, H: 1.45, wb: 2.84, fo: 0.81, r: 0.33, sill: 0.17, crown: 0.06, tumble: 0.76, bowF: 0.18, bowR: 0.12, rim: 'five', smooth: 6,
    features: ['Yumuşak kavisli lüks sedan, yay çizen tavan', 'Ortada iki yatay barlı krom ızgara', 'Kaput ucunda dik amblem', 'Geriye uzanan oval farlar', 'Yuvarlak omuzlu bagaj, oval stop'],
    plan: [[0, 0.76], [0.03, 0.9], [0.12, 0.98], [0.5, 1], [0.92, 0.97], [1, 0.82]],
    deck: [[0, 0.6], [0.03, 0.76], [0.28, 0.93], [0.38, 0.97], [0.8, 1.02], [0.96, 1.0], [1, 0.78]],
    roof: [[0.28, 0.93], [0.44, 1.38], [0.58, 1.45], [0.74, 1.38], [0.89, 1.04], [0.91, 1.02]],
    win: [[0.4, 0.59], [0.6, 0.79]], seams: [0.31, 0.6, 0.8], handles: [0.57, 0.77], hood: 0.31, trunk: 0.9, hoodStar: 1,
    top: [{ s0: 0.04, s1: 0.11, a: 0.5, b: 0.86, b1: 0.95, a1: 0.8, c: LED, glow: 1 }, { s0: 0.95, s1: 0.99, a: 0.45, b: 0.9, c: RED, glow: 1 }, { s0: 0, s1: 0.035, a: 0.03, b: 0.4, c: CRM }],
    front(d) {
      d.round(0, 0.62, 0.8, 0.25, '#14171c', 0.05);
      d.box(0, 0.65, 0.76, 0.03, CRM); d.box(0, 0.58, 0.76, 0.03, CRM);
      d.polyB([[0.44, 0.74], [0.84, 0.82], [0.86, 0.72], [0.48, 0.64]], LED);
      d.box(0, 0.3, 1.2, 0.11, BLK, 0.03);
      d.emblem(0, 0.62, 'star3', 0.09);
    },
    rear(d) { d.polyB([[0.32, 0.92], [0.86, 0.94], [0.86, 0.82], [0.4, 0.84]], RED); d.box(0, 0.86, 0.6, 0.015, CRM); d.box(0, 0.72, 0.5, 0.13, '#f0f2f4', 0.01); d.emblem(0, 0.92, 'star3'); },
  },
  golf: {
    name: 'Halk hatchback', L: 4.28, W: 1.79, H: 1.45, wb: 2.62, fo: 0.87, r: 0.32, sill: 0.17, crown: 0.04, tumble: 0.8, bowF: 0.1, bowR: 0.05, rim: 'multi', smooth: 3,
    features: ['Klasik hatchback, kalın eğik C direği', 'İnce yatay ızgara, boydan boya krom çizgi', 'Yatay dar far', 'Kısa kuyruk, dik arka cam', 'Yatay yuvarlak köşeli stop'],
    plan: [[0, 0.82], [0.025, 0.94], [0.1, 0.99], [0.5, 1], [0.94, 0.99], [1, 0.9]],
    deck: [[0, 0.62], [0.03, 0.8], [0.26, 0.97], [0.32, 1.0], [0.8, 1.04], [0.97, 1.05], [1, 0.82]],
    roof: [[0.26, 0.97], [0.41, 1.4], [0.58, 1.45], [0.87, 1.4], [0.965, 1.1], [0.98, 1.05]],
    win: [[0.38, 0.58], [0.59, 0.76]], seams: [0.3, 0.585, 0.8], handles: [0.56, 0.75], hood: 0.3, trunk: 0.96,
    top: [{ s0: 0.025, s1: 0.08, a: 0.48, b: 0.94, c: LED, glow: 1 }, { s0: 0.96, s1: 0.992, a: 0.5, b: 0.94, c: RED, glow: 1 }],
    front(d) {
      d.box(0, 0.72, 1.56, 0.1, BLK, 0.02); d.box(0, 0.74, 1.58, 0.015, CRM);
      d.both(0.6, 0.72, 0.34, 0.09, LED, 0.02);
      d.box(0, 0.38, 1.1, 0.15, BLK, 0.03);
      d.emblem(0, 0.72, 'vw2');
    },
    rear(d) { d.both(0.58, 0.96, 0.44, 0.12, RED, 0.05); d.box(0, 0.74, 0.46, 0.12, '#f0f2f4', 0.01); d.box(0, 0.34, 1.2, 0.1, BLK, 0.03); d.emblem(0, 0.94, 'vw2'); },
  },
  focus: {
    name: 'Oval hatchback', L: 4.38, W: 1.83, H: 1.47, wb: 2.7, fo: 0.87, r: 0.33, sill: 0.17, crown: 0.05, tumble: 0.78, bowF: 0.14, bowR: 0.08, rim: 'five', smooth: 5,
    features: ['Eğik tavanlı hatchback', 'Altıgen geniş alt ızgara', 'Yukarı kıvrılan sivri far', 'Kısa bagaj, çatı spoyleri', 'İkiye bölünmüş yatay stop'],
    plan: [[0, 0.76], [0.03, 0.9], [0.12, 0.98], [0.5, 1], [0.93, 0.98], [1, 0.84]],
    deck: [[0, 0.62], [0.03, 0.82], [0.24, 0.97], [0.3, 1.0], [0.8, 1.06], [0.965, 1.06], [1, 0.8]],
    roof: [[0.24, 0.97], [0.41, 1.42], [0.56, 1.47], [0.85, 1.39], [0.96, 1.1], [0.975, 1.06]],
    win: [[0.37, 0.57], [0.58, 0.75]], seams: [0.29, 0.575, 0.79], handles: [0.55, 0.74], hood: 0.29, trunk: 0.955, roofSpoiler: 1,
    top: [{ s0: 0.035, s1: 0.085, a: 0.5, b: 0.9, b1: 0.97, a1: 0.84, c: LED, glow: 1 }, { s0: 0.955, s1: 0.992, a: 0.52, b: 0.92, c: RED, glow: 1 }],
    front(d) {
      d.poly([[-0.56, 0.62], [0.56, 0.62], [0.42, 0.34], [-0.42, 0.34]], BLK);
      for (let y = -0.4; y <= 0.4; y += 0.08) for (let z = 0.4; z < 0.6; z += 0.08) d.diamond(y, z, 0.025, '#3a4048');
      d.polyB([[0.5, 0.78], [0.86, 0.9], [0.84, 0.76], [0.54, 0.7]], LED);
      d.emblem(0, 0.74, 'oval');
    },
    rear(d) { d.both(0.62, 1.0, 0.36, 0.1, RED, 0.03); d.box(0, 1.0, 0.8, 0.02, CRM); d.box(0, 0.74, 0.46, 0.12, '#f0f2f4', 0.01); d.box(0, 0.34, 1.3, 0.12, BLK, 0.03); d.emblem(0, 0.86, 'oval'); },
  },
  kore: {
    name: 'Kore sedan', L: 4.5, W: 1.8, H: 1.45, wb: 2.67, fo: 0.87, r: 0.32, sill: 0.17, crown: 0.05, tumble: 0.78, bowF: 0.15, bowR: 0.08, rim: 'turbine', smooth: 5,
    features: ['Coupe çizgili akıcı sedan', 'Geniş şelale ızgara', 'İnce uzun far, ayrı gündüz LED\'i', 'C direğine akan tavan', 'Boydan boya ince stop'],
    plan: [[0, 0.8], [0.03, 0.92], [0.12, 0.98], [0.5, 1], [0.93, 0.98], [1, 0.86]],
    deck: [[0, 0.6], [0.03, 0.8], [0.26, 0.95], [0.34, 0.98], [0.8, 1.04], [0.97, 1.03], [1, 0.8]],
    roof: [[0.26, 0.95], [0.43, 1.39], [0.56, 1.45], [0.72, 1.37], [0.88, 1.06], [0.9, 1.04]],
    win: [[0.38, 0.56], [0.57, 0.77]], seams: [0.3, 0.57, 0.79], handles: [0.54, 0.74], hood: 0.3, trunk: 0.89,
    top: [{ s0: 0.035, s1: 0.085, a: 0.52, b: 0.93, c: LED, glow: 1 }, { s0: 0.965, s1: 0.992, a: 0, b: 0.92, c: RED, glow: 1 }],
    front(d) {
      d.poly([[-0.5, 0.7], [0.5, 0.7], [0.6, 0.36], [-0.6, 0.36]], BLK);
      for (let y = -0.5; y <= 0.5; y += 0.08) d.box(y, 0.53, 0.014, 0.32, '#59616b');
      d.both(0.66, 0.78, 0.36, 0.05, LED, 0.02);
      d.emblem(0, 0.76, 'oval');
    },
    rear(d) { d.box(0, 0.96, 1.6, 0.04, RED, 0.02); d.box(0, 0.74, 0.46, 0.12, '#f0f2f4', 0.01); d.box(0, 0.34, 1.3, 0.1, BLK, 0.03); },
  },
  megane: {
    name: 'Baklava sedan', L: 4.63, W: 1.81, H: 1.46, wb: 2.71, fo: 0.9, r: 0.32, sill: 0.17, crown: 0.05, tumble: 0.78, bowF: 0.16, bowR: 0.09, rim: 'five', smooth: 5,
    features: ['Bombeli omuzlu aile sedanı', 'Baklava amblemli geniş krom kanat ızgara', 'C biçimli LED gündüz farı', 'Yüksek ve kısa bagaj', 'Yatay uzun stop, krom bant'],
    plan: [[0, 0.76], [0.03, 0.9], [0.12, 0.98], [0.5, 1], [0.93, 0.98], [1, 0.85]],
    deck: [[0, 0.6], [0.03, 0.8], [0.26, 0.96], [0.32, 1.0], [0.78, 1.05], [0.965, 1.05], [1, 0.8]],
    roof: [[0.26, 0.96], [0.42, 1.4], [0.56, 1.46], [0.72, 1.4], [0.87, 1.07], [0.89, 1.05]],
    win: [[0.38, 0.56], [0.57, 0.76]], seams: [0.29, 0.57, 0.78], handles: [0.54, 0.74], hood: 0.29, trunk: 0.885,
    top: [{ s0: 0.035, s1: 0.085, a: 0.5, b: 0.91, c: LED, glow: 1 }, { s0: 0.95, s1: 0.99, a: 0.44, b: 0.92, c: RED, glow: 1 }],
    front(d) {
      d.box(0, 0.7, 1.0, 0.03, CRM, 0.01);
      d.box(0, 0.62, 0.6, 0.12, BLK, 0.02);
      d.both(0.66, 0.74, 0.38, 0.1, '#141a20', 0.03); d.arcB(0.68, 0.68, 0.11, LED);
      d.box(0, 0.34, 1.2, 0.12, BLK, 0.03);
      d.emblem(0, 0.66, 'rhomb', 0.08);
    },
    rear(d) { d.both(0.58, 0.96, 0.5, 0.1, RED, 0.02); d.box(0, 0.96, 0.66, 0.018, CRM); d.box(0, 0.74, 0.5, 0.13, '#f0f2f4', 0.01); d.emblem(0, 0.9, 'rhomb'); },
  },
  linea: {
    name: 'Linea sedan', L: 4.56, W: 1.73, H: 1.49, wb: 2.6, fo: 0.92, r: 0.3, sill: 0.19, crown: 0.05, tumble: 0.8, bowF: 0.14, bowR: 0.08, rim: 'steel', smooth: 4,
    features: ['Dar yüksek filo sedanı', 'Damla biçimli far', 'İnce krom ızgara bandı', 'Uzun arka çıkıntı', 'Köşeli yüksek stop'],
    plan: [[0, 0.76], [0.03, 0.9], [0.12, 0.98], [0.5, 1], [0.93, 0.98], [1, 0.86]],
    deck: [[0, 0.62], [0.03, 0.8], [0.27, 0.96], [0.33, 1.0], [0.75, 1.04], [0.97, 1.03], [1, 0.82]],
    roof: [[0.27, 0.96], [0.43, 1.42], [0.56, 1.49], [0.71, 1.42], [0.85, 1.06], [0.87, 1.04]],
    win: [[0.39, 0.56], [0.57, 0.75]], seams: [0.3, 0.57, 0.77], handles: [0.54, 0.73], hood: 0.3, trunk: 0.865,
    top: [{ s0: 0.035, s1: 0.085, a: 0.5, b: 0.9, c: '#fff5c4', glow: 1 }, { s0: 0.95, s1: 0.99, a: 0.5, b: 0.94, c: RED, glow: 1 }],
    front(d) {
      d.polyB([[0.4, 0.74], [0.8, 0.8], [0.78, 0.66], [0.46, 0.62]], '#fff5c4');
      d.box(0, 0.7, 0.66, 0.04, CRM, 0.02); d.box(0, 0.36, 1.0, 0.1, BLK, 0.03);
      d.emblem(0, 0.7, 'oval');
    },
    rear(d) { d.both(0.6, 0.96, 0.36, 0.17, RED, 0.03); d.box(0, 0.74, 0.46, 0.12, '#f0f2f4', 0.01); d.box(0, 0.86, 0.5, 0.015, CRM); },
  },
  pickup: {
    name: 'Kamyonet', L: 5.28, W: 1.86, H: 1.81, wb: 3.09, fo: 0.92, r: 0.38, sill: 0.34, crown: 0.03, tumble: 0.85, bowF: 0.08, bowR: 0.0, rim: 'steel',
    features: ['Çift kabin pikap', 'Dik yüksek burun, geniş ızgara', 'Açık kasa, kasa içi siyah', 'Ayrık krom arka tampon', 'Dikey uzun stop'],
    plan: [[0, 0.86], [0.025, 0.96], [0.1, 1], [1, 1]],
    deck: [[0, 0.86], [0.03, 1.02], [0.24, 1.16], [0.3, 1.2], [0.98, 1.26], [1, 1.26]],
    roof: [[0.24, 1.16], [0.36, 1.76], [0.56, 1.81], [0.63, 1.74], [0.65, 1.22]],
    win: [[0.33, 0.47], [0.48, 0.6]], seams: [0.27, 0.48, 0.62, 0.65], handles: [0.455, 0.595], hood: 0.27, trunk: 2, clad: 0.5,
    bumper: { c: CRM, z: 0.58, h: 0.16, d: 0.1, rearOnly: 1 },
    top: [{ s0: 0.66, s1: 0.975, a: 0, b: 0.84, c: '#1a1d22', flat: 1 }, { s0: 0.02, s1: 0.07, a: 0.56, b: 0.96, c: LED, glow: 1 }, { s0: 0.975, s1: 0.998, a: 0.8, b: 0.98, c: RED, glow: 1 }],
    front(d) {
      d.box(0, 0.94, 1.1, 0.3, BLK, 0.03); for (const z of [0.86, 0.94, 1.02]) d.box(0, z, 1.06, 0.03, CRM);
      d.both(0.72, 0.98, 0.3, 0.2, LED, 0.03); d.box(0, 0.54, 1.6, 0.2, '#30353c', 0.03);
      d.emblem(0, 0.94, 'bars', 0.1);
    },
    rear(d) { d.both(0.78, 1.0, 0.13, 0.4, RED, 0.02); d.box(0, 1.0, 1.3, 0.34, '#d8d8d8', 0.01); d.text('PİKAP', 0.2, 1.0, '#444'); },
  },
  minibus: {
    name: 'Dolmuş minibüs', L: 5.53, W: 2.03, H: 2.5, wb: 3.3, fo: 1.0, r: 0.36, sill: 0.28, crown: 0.06, tumble: 0.88, bowF: 0.1, bowR: 0.02, rim: 'steel', tall: 1,
    features: ['Yüksek tavanlı uzun van', 'Kısa eğik burun, büyük ön cam', 'Sürgülü yan kapı, ardışık yan camlar', 'Üstte dolmuş tabelası, gövdede mavi şerit', 'Arkada dikey stoplar, çift kapı'],
    plan: [[0, 0.84], [0.03, 0.95], [0.12, 1], [1, 0.98]],
    deck: [[0, 0.8], [0.04, 1.02], [0.14, 1.2], [0.2, 1.32], [0.98, 1.4], [1, 1.1]],
    roof: [[0.13, 1.2], [0.27, 2.34], [0.36, 2.48], [0.97, 2.5], [1, 1.4]],
    win: [[0.25, 0.36], [0.37, 0.53], [0.54, 0.7], [0.71, 0.87]], seams: [0.2, 0.37, 0.53, 0.88], handles: [0.35], hood: 0.15, trunk: 2, band: { z: 1.1, h: 0.1, c: '#1565c0' },
    roofSign: { text: 'DOLMUŞ', c: '#ffd23f' },
    top: [{ s0: 0.035, s1: 0.085, a: 0.56, b: 0.92, c: LED, glow: 1 }, { s0: 0.985, s1: 1, a: 0.74, b: 0.96, c: RED, glow: 1 }],
    front(d) { d.box(0, 0.92, 1.1, 0.2, BLK, 0.03); d.both(0.74, 0.98, 0.34, 0.24, LED, 0.03); d.box(0, 0.52, 1.7, 0.2, '#30353c', 0.03); d.emblem(0, 0.92, 'oval'); },
    rear(d) { d.both(0.86, 1.3, 0.12, 0.5, RED, 0.02); d.box(0, 1.8, 1.4, 0.7, '#0f1a22', 0.03); d.box(0, 1.4, 0.012, 1.8, '#5a6068'); },
  },
  bus: {
    name: 'Belediye otobüsü', L: 12, W: 2.55, H: 3.1, wb: 5.9, fo: 2.7, r: 0.5, sill: 0.34, crown: 0.05, tumble: 0.94, bowF: 0.12, bowR: 0.05, rim: 'steel', tall: 1, flatFront: 1,
    features: ['12 metre alçak tabanlı şehir otobüsü', 'Tek parça dev ön cam, üstte hat göstergesi', 'Üç çift kapı, uzun bant camlar', 'Tavanda klima kutuları', 'Belediye renkleri, numara panosu'],
    plan: [[0, 0.93], [0.012, 0.99], [0.03, 1], [1, 0.97]],
    deck: [[0, 0.72], [0.015, 1.1], [0.05, 1.18], [0.98, 1.2], [1, 1.0]],
    roof: [[0.008, 1.1], [0.024, 2.9], [0.05, 3.08], [0.975, 3.08], [1, 1.2]],
    win: [[0.04, 0.07], [0.12, 0.3], [0.31, 0.46], [0.53, 0.7], [0.71, 0.86], [0.87, 0.96]], seams: [0.07, 0.12, 0.46, 0.53, 0.86], handles: [], hood: 2, trunk: 2,
    band: { z: 0.92, h: 0.16, c: '#ffffff' }, roofPods: 2, doors: [[0.07, 0.12], [0.46, 0.53]],
    top: [{ s0: 0.008, s1: 0.025, a: 0.5, b: 0.94, c: LED, glow: 1 }, { s0: 0.99, s1: 0.999, a: 0.7, b: 0.94, c: RED, glow: 1 }],
    front(d) { d.box(0, 3.02, 1.8, 0.2, '#101214', 0.02); d.text('34 KADIKÖY', 0.15, 3.02, '#ffa726'); d.both(0.95, 0.7, 0.34, 0.14, LED, 0.03); d.box(0, 0.4, 2.2, 0.2, '#30353c', 0.03); },
    rear(d) { d.both(1.05, 1.2, 0.2, 0.6, RED, 0.02); d.box(0, 2.2, 1.9, 1.3, '#0f1a22', 0.03); d.box(0, 0.5, 2.2, 0.3, '#30353c', 0.03); },
  },
  truck: {
    name: 'Kamyon', L: 9.2, W: 2.5, H: 3.5, wb: 5.2, fo: 1.35, r: 0.52, sill: 0.56, crown: 0.05, tumble: 0.9, bowF: 0.08, bowR: 0, rim: 'steel', tall: 1,
    features: ['Düz burunlu kabin', 'Kabin üstünde rüzgârlık, iki aynalı', 'Geniş kasa, branda örtü', 'Kalın çamurluk, çift arka teker', 'Ön panelde yatay çubuklu ızgara'],
    plan: [[0, 0.92], [0.012, 0.98], [0.03, 1], [1, 1]],
    deck: [[0, 1.0], [0.012, 1.3], [0.05, 1.5], [0.21, 1.56], [0.225, 1.3], [1, 1.2]],
    roof: [[0.008, 1.3], [0.03, 2.8], [0.06, 2.92], [0.205, 2.92], [0.22, 1.5]],
    win: [[0.05, 0.16]], seams: [0.03, 0.18, 0.21], handles: [0.15], hood: 2, trunk: 2,
    cargo: { s0: 0.235, s1: 0.995, z0: 1.25, z1: 3.45 }, wind: 1,
    top: [{ s0: 0.006, s1: 0.02, a: 0.6, b: 0.94, c: LED, glow: 1 }],
    front(d) { d.box(0, 1.3, 1.6, 0.5, BLK, 0.03); for (let z = 1.1; z < 1.52; z += 0.08) d.box(0, z, 1.56, 0.03, '#59616b'); d.both(1.0, 0.9, 0.3, 0.2, LED, 0.04); d.box(0, 0.74, 2.3, 0.3, '#30353c', 0.03); d.emblem(0, 1.3, 'bars', 0.12); },
    rear(d) { d.both(1.0, 1.0, 0.24, 0.12, RED, 0.01); },
  },
};

// Motosiklet ayrı kurulur, burada yalnızca özellik listesi var
const MOTO_FEATURES = ['Sport naked motosiklet, dar uzun gövde', 'Kapalı depo ve kısa kaporta', 'Tek sele, yukarı kalkık kuyruk', 'Geniş gidon ve aynalar', 'Kasklı sürücü'];

// Oyun içi sprite listesi: bake aracı bunları üretir
const BAKE_NPC = (types) => {
  const list = [];
  for (const kind of Object.keys(types)) {
    const t = types[kind];
    t.colors.forEach((c, i) => list.push({ key: `npc:${kind}:${i}`, model: t.model || kind, color: c, finish: ['metal', 'gloss', 'matte'][i % 3], len: t.len, wid: t.wid, taxi: kind === 'taxi' }));
  }
  return list;
};

// --- car3d.js ---
// Araç tanımından gerçek üç boyutlu model üretir. Menü, garaj ve sprite üretim aracı aynı kodu kullanır.
// x burun yönü değil: model önce (s, y, z) uzayında kurulur; dünya ekseni X uzunluk, Y yükseklik, Z yan.

function curve(pts, smooth = 2) {
  const N = 240;
  const t = new Float32Array(N + 1);
  for (let i = 0; i <= N; i++) {
    const s = i / N;
    let k = 0;
    while (k < pts.length - 2 && s > pts[k + 1][0]) k++;
    const [a, va] = pts[k];
    const [b, vb] = pts[k + 1];
    const u = Math.max(0, Math.min(1, (s - a) / (b - a || 1)));
    t[i] = va + (vb - va) * u;
  }
  let out = t;
  for (let pass = 0; pass < smooth; pass++) {
    const nx = new Float32Array(N + 1);
    for (let i = 0; i <= N; i++) {
      let sum = 0; let n = 0;
      for (let j = -3; j <= 3; j++) { const q = i + j; if (q >= 0 && q <= N) { sum += out[q]; n++; } }
      nx[i] = sum / n;
    }
    out = nx;
  }
  return (s) => {
    const p = Math.max(0, Math.min(1, s)) * N;
    const i = Math.min(N - 1, Math.floor(p));
    return out[i] + (out[i + 1] - out[i]) * (p - i);
  };
}

// Üstten/önden çizilen panolar için tuval yardımcısı. Birim metre
function fascia(THREE, W, Z, draw, px = 512) {
  const c = document.createElement('canvas');
  c.width = px;
  c.height = Math.ceil((px * Z) / W);
  const g = c.getContext('2d');
  const k = px / W;
  const X = (y) => (y + W / 2) * k;
  const Y = (z) => c.height - z * k;
  const round = (x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };
  const d = {
    g, k,
    box(y, z, w, h, col, r = 0) { g.fillStyle = col; round(X(y - w / 2), Y(z + h / 2), w * k, h * k, r * k); g.fill(); },
    round(y, z, w, h, col, r) { d.box(y, z, w, h, col, r); },
    both(y, z, w, h, col, r = 0) { d.box(y, z, w, h, col, r); d.box(-y, z, w, h, col, r); },
    circ(y, z, r, col) { g.fillStyle = col; g.beginPath(); g.arc(X(y), Y(z), r * k, 0, 7); g.fill(); },
    ring(y, z, r, col) { g.strokeStyle = col; g.lineWidth = r * k * 0.4; g.beginPath(); g.arc(X(y), Y(z), r * k, 0, 7); g.stroke(); },
    oval(y, z, w, h, col) { g.fillStyle = col; g.beginPath(); g.ellipse(X(y), Y(z), (w / 2) * k, (h / 2) * k, 0, 0, 7); g.fill(); },
    diamond(y, z, r, col) { d.poly([[y - r, z], [y, z + r], [y + r, z], [y, z - r]], col); },
    poly(p, col) { g.fillStyle = col; g.beginPath(); p.forEach(([a, b], i) => (i ? g.lineTo(X(a), Y(b)) : g.moveTo(X(a), Y(b)))); g.closePath(); g.fill(); },
    polyB(p, col) { d.poly(p, col); d.poly(p.map(([a, b]) => [-a, b]), col); },
    polyLine(p, col, w) { g.strokeStyle = col; g.lineWidth = w * k; g.lineJoin = 'round'; g.beginPath(); p.forEach(([a, b], i) => (i ? g.lineTo(X(a), Y(b)) : g.moveTo(X(a), Y(b)))); g.closePath(); g.stroke(); },
    arcB(y, z, r, col) { for (const s of [-1, 1]) { g.strokeStyle = col; g.lineWidth = r * k * 0.3; g.lineCap = 'round'; g.beginPath(); g.arc(X(s * y), Y(z), r * k, s > 0 ? 0.5 : 3.14 - 2.6, s > 0 ? 3.14 + 0.1 + 0.9 : 3.14 - 0.5); g.stroke(); } },
    arcR(y, z, r, col) { d.arcB(y, z, r, col); },
    text(t, h, z, col = '#23262b', y = 0) { g.fillStyle = col; g.font = `900 ${h * k * 0.8}px Nunito, Arial, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, X(y), Y(z)); },
    emblem(y, z, kind, r = 0.055) {
      const cx = X(y); const cy = Y(z); const q = r * k;
      g.save(); g.translate(cx, cy); g.strokeStyle = '#eef2f6'; g.fillStyle = '#eef2f6'; g.lineWidth = q * 0.2;
      if (kind === 'rings3') { for (let i = -1; i <= 1; i++) { g.beginPath(); g.arc(i * q * 1.1, 0, q * 0.8, 0, 7); g.stroke(); } }
      else if (kind === 'star3') { g.beginPath(); g.arc(0, 0, q, 0, 7); g.stroke(); for (let i = 0; i < 3; i++) { const a = -1.57 + (i * 6.283) / 3; g.beginPath(); g.moveTo(Math.cos(a + 2) * q * 0.12, Math.sin(a + 2) * q * 0.12); g.lineTo(Math.cos(a) * q, Math.sin(a) * q); g.lineTo(Math.cos(a - 2) * q * 0.12, Math.sin(a - 2) * q * 0.12); g.fill(); } }
      else if (kind === 'propeller') { g.beginPath(); g.arc(0, 0, q, 0, 7); g.stroke(); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, q * 0.8, -1.57, 0); g.closePath(); g.fill(); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, q * 0.8, 1.57, 3.14); g.closePath(); g.fill(); }
      else if (kind === 'rhomb') { g.beginPath(); g.moveTo(0, -q * 1.2); g.lineTo(q * 0.8, 0); g.lineTo(0, q * 1.2); g.lineTo(-q * 0.8, 0); g.closePath(); g.stroke(); }
      else if (kind === 'oval') { g.beginPath(); g.ellipse(0, 0, q * 1.3, q * 0.8, 0, 0, 7); g.stroke(); }
      else if (kind === 'bolt') { g.beginPath(); g.arc(0, 0, q, 0, 7); g.stroke(); g.beginPath(); g.moveTo(-q * 0.9, q * 0.1); g.lineTo(q * 0.9, -q * 0.1); g.stroke(); }
      else if (kind === 'tulip') { g.beginPath(); g.moveTo(0, q * 0.9); g.quadraticCurveTo(-q * 1.2, q * 0.1, -q * 0.7, -q); g.lineTo(0, -q * 0.3); g.lineTo(q * 0.7, -q); g.quadraticCurveTo(q * 1.2, q * 0.1, 0, q * 0.9); g.stroke(); }
      else if (kind === 'vw2') { g.beginPath(); g.arc(0, 0, q, 0, 7); g.stroke(); g.beginPath(); g.moveTo(-q * 0.6, -q * 0.3); g.lineTo(0, q * 0.5); g.lineTo(q * 0.6, -q * 0.3); g.stroke(); }
      else if (kind === 'link') { g.beginPath(); g.moveTo(-q, -q * 0.4); g.lineTo(0, q * 0.4); g.lineTo(q, -q * 0.4); g.stroke(); }
      else if (kind === 'shield') { g.beginPath(); g.moveTo(-q, -q); g.lineTo(q, -q); g.lineTo(q * 0.8, q * 0.4); g.lineTo(0, q); g.lineTo(-q * 0.8, q * 0.4); g.closePath(); g.stroke(); }
      else { g.fillRect(-q, -q * 0.5, q * 2, q * 0.28); g.fillRect(-q, q * 0.2, q * 2, q * 0.28); }
      g.restore();
    },
  };
  draw(d, c);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const FINISH = {
  metal: { metalness: 0.72, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.08 },
  gloss: { metalness: 0.05, roughness: 0.32, clearcoat: 1, clearcoatRoughness: 0.05 },
  matte: { metalness: 0.15, roughness: 0.68, clearcoat: 0, clearcoatRoughness: 0.6 },
  pearl: { metalness: 0.5, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.03, sheen: 1, iridescence: 0.5 },
};

function collector() {
  return { pos: [], uv: [], idx: [], map: new Map() };
}
function vert(c, key, x, y, z, u, v) {
  let i = c.map.get(key);
  if (i === undefined) { i = c.pos.length / 3; c.map.set(key, i); c.pos.push(x, z, y); c.uv.push(u, v); }
  return i;
}
function quad(c, a, b, d, e) { c.idx.push(a, d, b, a, e, d); }
function mesh(THREE, c, mat) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(c.pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(c.uv, 2));
  g.setIndex(c.idx);
  g.computeVertexNormals();
  return new THREE.Mesh(g, mat);
}

function wheelTexture(THREE, style, premium, caliper) {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const g = c.getContext('2d');
  g.translate(128, 128);
  g.fillStyle = '#0a0b0e'; g.beginPath(); g.arc(0, 0, 128, 0, 7); g.fill();
  const rimC = premium ? '#eef2f6' : '#b9c2cc';
  g.fillStyle = '#20242a'; g.beginPath(); g.arc(0, 0, 96, 0, 7); g.fill();
  if (premium && caliper) { g.fillStyle = caliper; g.fillRect(40, -30, 34, 60); }
  g.strokeStyle = rimC; g.fillStyle = rimC; g.lineCap = 'round';
  g.lineWidth = 7; g.beginPath(); g.arc(0, 0, 96, 0, 7); g.stroke();
  if (style === 'steel' || style === 'hub') {
    g.fillStyle = style === 'hub' ? '#9aa3ad' : '#74808b'; g.beginPath(); g.arc(0, 0, 92, 0, 7); g.fill();
    g.fillStyle = '#20242a';
    for (let i = 0; i < (style === 'hub' ? 10 : 6); i++) { const a = (i / (style === 'hub' ? 10 : 6)) * 6.283; g.beginPath(); g.ellipse(Math.cos(a) * 66, Math.sin(a) * 66, 12, 8, a, 0, 7); g.fill(); }
    g.fillStyle = '#dfe4e9'; g.beginPath(); g.arc(0, 0, 32, 0, 7); g.fill();
  } else if (style === 'turbine') {
    for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; g.save(); g.rotate(a); g.beginPath(); g.moveTo(18, -8); g.quadraticCurveTo(60, -30, 92, -10); g.lineTo(92, 10); g.quadraticCurveTo(60, -6, 18, 8); g.fill(); g.restore(); }
    g.beginPath(); g.arc(0, 0, 26, 0, 7); g.fill();
  } else {
    const n = style === 'five' ? 5 : style === 'star' ? 10 : 8;
    g.lineWidth = style === 'five' ? 20 : style === 'star' ? 8 : 12;
    for (let i = 0; i < n; i++) { const a = (i / n) * 6.283; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(a) * 94, Math.sin(a) * 94); g.stroke(); }
    g.beginPath(); g.arc(0, 0, 26, 0, 7); g.fill();
  }
  g.fillStyle = '#2a2e35'; g.beginPath(); g.arc(0, 0, 12, 0, 7); g.fill();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function addWheel(THREE, group, x, y, r, w, tex, tyreMat) {
  const tyre = new THREE.Mesh(new THREE.CylinderGeometry(r, r, w, 26, 1), tyreMat);
  tyre.rotation.x = Math.PI / 2;
  tyre.position.set(x, r, y);
  group.add(tyre);
  const rim = new THREE.Mesh(new THREE.CircleGeometry(r * 0.98, 26), new THREE.MeshStandardMaterial({ map: tex, metalness: 0.75, roughness: 0.3 }));
  rim.position.set(x, r, y + Math.sign(y) * (w / 2 + 0.002));
  if (y < 0) rim.rotation.y = Math.PI;
  group.add(rim);
}

function box(THREE, group, sx, sy, sz, x, y, z, mat) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), mat);
  m.position.set(x, y, z);
  group.add(m);
  return m;
}

// paint: { color, finish, roof, accent, premium, sign, police }
function buildCar(THREE, id, paint) {
  if (id === 'moto') return buildMoto(THREE, paint);
  const m = CAR_MODELS[id];
  const { L, W, H } = m;
  const planF = curve(m.plan, 2);
  const deckF = curve(m.deck, m.smooth ?? 3);
  const roofF = curve(m.roof, m.smooth ?? 3);
  const sF = m.fo / L;
  const sR = (m.fo + m.wb) / L;
  const archR = m.r * 1.2;
  const sill = m.sill;
  const crown = m.crown;
  const bowF = m.bowF || 0;
  const bowR = m.bowR || 0;
  const N = m.tall ? 110 : 84;
  const group = new THREE.Group();

  const halfW = (s) => (W / 2) * planF(s);
  const bow = (s, yy) => {
    const u = yy * yy;
    return (s < 0.14 ? bowF * (1 - s / 0.14) * u : 0) - (s > 0.86 ? bowR * ((s - 0.86) / 0.14) * u : 0);
  };
  const deckTop = (s, y) => { const b = halfW(s); const u = Math.min(1, Math.abs(y) / b); return deckF(s) + crown * (1 - u * u); };
  const roofOK = (s) => s >= m.roof[0][0] && s <= m.roof[m.roof.length - 1][0] && roofF(s) > deckF(s) + 0.012;
  const roofTop = (s, y) => {
    const rw = halfW(s) * m.tumble;
    const u = Math.min(1, Math.abs(y) / rw);
    return roofF(s) + 0.05 * (1 - u * u);
  };
  const surface = (s, y) => {
    const d = deckTop(s, y);
    if (roofOK(s) && Math.abs(y) < halfW(s) * m.tumble) return Math.max(d, roofTop(s, y));
    return d;
  };

  const bottomAt = (s) => {
    let z = sill;
    for (const w of [sF, sR]) {
      const dx = (s - w) * L;
      if (Math.abs(dx) < archR) z = Math.max(z, m.r + Math.sqrt(archR * archR - dx * dx));
    }
    return Math.min(z, deckF(s) - 0.04);
  };

  // Boya malzemeleri
  const f = FINISH[paint.finish || 'gloss'];
  const sideTex = sideTexture(THREE, m, paint);
  const paintMat = new THREE.MeshPhysicalMaterial({ color: paint.color, map: sideTex, ...f, envMapIntensity: 0.9 });
  const roofColor = paint.roof || (m.roofBlack ? '#0b0d11' : paint.color);
  const roofMat = new THREE.MeshPhysicalMaterial({ color: roofColor, ...f, envMapIntensity: 0.85 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: m.darkGlass ? '#040507' : '#0d171f', metalness: 0.25, roughness: 0.08, clearcoat: 1, envMapIntensity: 0.55 });
  const darkMat = new THREE.MeshStandardMaterial({ color: '#0a0b0d', roughness: 0.8 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: '#e2e7ec', metalness: 1, roughness: 0.14 });
  const plastic = new THREE.MeshStandardMaterial({ color: '#17191d', roughness: 0.7 });

  // Alt gövde
  const body = collector();
  const TOP = 6;
  const ringPts = (i) => {
    const s = i / N;
    const b = halfW(s);
    const z0 = bottomAt(s);
    const zt = deckF(s);
    const zm = z0 + (zt - z0) * 0.56;
    const p = [];
    const side = (k, yk, z) => p.push([k, yk, z]);
    side(0, b * 0.92, z0);
    side(1, b * 0.985, z0 + (zm - z0) * 0.4);
    side(2, b, zm);
    side(3, b * 0.975, zt - (zt - zm) * 0.3);
    for (let t = 0; t <= TOP; t++) {
      const yy = b * 0.95 * (1 - t / TOP);
      const u = yy / b;
      side(4 + t, yy, zt + crown * (1 - u * u));
    }
    return p;
  };
  const R = 4 + TOP + 1;
  for (let i = 0; i < N; i++) {
    const a = ringPts(i); const c = ringPts(i + 1);
    for (let j = 0; j < R - 1; j++) {
      for (const sg of [1, -1]) {
        const mk = (ii, jj, list) => {
          const s = ii / N; const [, yy, z] = list[jj];
          const y = yy * sg;
          const yn = Math.abs(yy) / halfW(s);
          return vert(body, `${ii}_${sg}_${jj}`, s * L + bow(s, yn), y, z, s, z / H);
        };
        const p0 = mk(i, j, a); const p1 = mk(i + 1, j, c); const p2 = mk(i + 1, j + 1, c); const p3 = mk(i, j + 1, a);
        if (sg > 0) quad(body, p0, p3, p2, p1); else quad(body, p0, p1, p2, p3);
      }
    }
  }
  group.add(mesh(THREE, body, paintMat));

  // Uç kapakları: tampon ve far panoları bunun üstüne oturur
  const capFront = fascia(THREE, W * 1.04, H, (d) => m.front(d), m.tall ? 512 : 640);
  const capRear = fascia(THREE, W * 1.04, H, (d) => m.rear(d), m.tall ? 512 : 640);
  addCap(THREE, group, m, 0, capFront, paintMat, halfW, bow, bottomAt, deckTop, deckF);
  addCap(THREE, group, m, 1, capRear, paintMat, halfW, bow, bottomAt, deckTop, deckF);

  // Kabin: yan şerit ve tavan
  const cabPaint = collector();
  const cabRoof = collector();
  const cabGlass = collector();
  const inWin = (s) => m.win.some(([a, b]) => s > a && s < b);
  const SN = N * 2;
  const beltY = (s) => halfW(s) * 0.93;
  const pts = (i) => {
    const s = i / SN;
    const b = beltY(s);
    const zb = deckTop(s, b);
    const rt = Math.max(zb, roofF(s));
    const rw = Math.max(0.01, halfW(s) * m.tumble);
    const wt = zb + (rt - zb) * 0.87;
    const o = [[b, zb], [b + (rw - b) * 0.87, wt], [rw, rt]];
    for (const t of [0.13, 0.45, 0.75, 1]) { const y = rw * (1 - t); const u = y / rw; o.push([y, rt + 0.05 * (1 - u * u)]); }
    return o;
  };
  const slope = (s) => (roofF(s + 0.005) - roofF(s - 0.005)) / (0.01 * L);
  const push = (col, i0, j0, sg, ring0, ring1) => {
    const mk = (ii, jj, list) => { const s = ii / SN; const [yy, z] = list[jj]; return vert(col, `${ii}_${sg}_${jj}`, s * L, yy * sg, z, s, z / H); };
    const p0 = mk(i0, j0, ring0); const p1 = mk(i0 + 1, j0, ring1); const p2 = mk(i0 + 1, j0 + 1, ring1); const p3 = mk(i0, j0 + 1, ring0);
    if (sg > 0) quad(col, p0, p3, p2, p1); else quad(col, p0, p1, p2, p3);
  };
  for (let i = 0; i < SN; i++) {
    const s = (i + 0.5) / SN;
    if (!roofOK(s) && !roofOK(s + 1 / SN) && !roofOK(s - 1 / SN)) continue;
    const a = pts(i); const c = pts(i + 1);
    const sl = slope(s);
    const windscreen = sl > 0.5;
    const backlight = sl < -0.5;
    for (const sg of [1, -1]) {
      push(inWin(s) ? cabGlass : cabPaint, i, 0, sg, a, c);
      push(cabPaint, i, 1, sg, a, c);
      for (let j = 2; j < 6; j++) {
        const glassy = (windscreen || backlight) && j >= 2;
        // Ön cam yanlarında ince direk kalır
        push(glassy && j > 2 ? cabGlass : glassy ? cabPaint : cabRoof, i, j, sg, a, c);
      }
    }
  }
  if (cabPaint.idx.length) group.add(mesh(THREE, cabPaint, paintMat));
  if (cabRoof.idx.length) group.add(mesh(THREE, cabRoof, roofMat));
  if (cabGlass.idx.length) group.add(mesh(THREE, cabGlass, glassMat));

  // Üst yüzeye oturan yamalar: far, stop, şerit (üstten görünümde tanınmayı sağlar)
  const patch = (s0, s1, a, b, a1, b1, color, glow, sgs = [1, -1], flat = false) => {
    const col = collector();
    const NX = 8; const NY = 6;
    for (const sg of sgs) {
      for (let i = 0; i <= NX; i++) {
        const u = i / NX;
        const s = s0 + (s1 - s0) * u;
        const hw = halfW(s);
        const aa = (a + (a1 - a) * u) * hw;
        const bb = (b + (b1 - b) * u) * hw;
        for (let j = 0; j <= NY; j++) {
          const y = (aa + (bb - aa) * (j / NY)) * sg;
          const z = flat ? deckF(s) - 0.01 : surface(s, y) + 0.008;
          const v = vert(col, `${sg}_${i}_${j}`, s * L + bow(s, Math.abs(y) / hw), y, z, u, j / NY);
          if (i && j) {
            const p = v - (NY + 1) - 1;
            const q = v - (NY + 1);
            const r = v - 1;
            if (sg > 0) quad(col, p, r, v, q); else quad(col, p, q, v, r);
          }
        }
      }
    }
    const mat = glow
      ? new THREE.MeshStandardMaterial({ color, emissive: color, emissiveIntensity: 0.9, roughness: 0.25 })
      : new THREE.MeshStandardMaterial({ color, roughness: 0.6 });
    group.add(mesh(THREE, col, mat));
  };
  if (paint.sprite) for (const t of m.top || []) patch(t.s0, t.s1, t.a, t.b, t.a1 ?? t.a, t.b1 ?? t.b, t.c, t.glow, [1, -1], t.flat);
  const accent = paint.accent || '#ffd23f';
  for (const t of m.stripes || []) patch(t.s0, t.s1, t.a, t.b, t.a, t.b, accent, 0);
  if (paint.stripe) patch(0.02, 0.98, 0.06, 0.22, 0.06, 0.22, paint.stripe, 0);
  if (m.hoodRibs) { patch(0.06, 0.26, 0.33, 0.355, 0.26, 0.285, '#' + ('000000' + (new THREE.Color(paint.color).multiplyScalar(0.55).getHex()).toString(16)).slice(-6), 0); }

  // Tekerler
  const tyreMat = new THREE.MeshStandardMaterial({ color: '#101114', roughness: 0.9 });
  const tex = wheelTexture(THREE, paint.rim || m.rim, paint.premium, paint.caliper);
  const tw = 0.1 * W + (m.tall ? 0.08 : 0.04);
  const wy = W / 2 * 0.97 - tw / 2 + 0.03;
  for (const s of [sF, sR]) for (const sg of [1, -1]) addWheel(THREE, group, s * L, sg * wy, m.r, tw, tex, tyreMat);
  box(THREE, group, L * 0.92, 0.1, W * 0.86, L / 2, sill + 0.02, 0, darkMat);

  // Aynalar
  const mirrorS = m.win[0][0] + 0.005;
  const mirZ = deckF(mirrorS) + 0.1;
  for (const sg of [1, -1]) {
    const mm = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 8), paint.mirror === 'black' || m.roofBlack ? plastic : paintMat);
    mm.scale.set(0.7, 0.6, 1.1);
    mm.position.set(mirrorS * L + 0.02, mirZ, sg * (halfW(mirrorS) * 0.98 + 0.08));
    group.add(mm);
  }

  // Tampon, spoyler, tavan rayı, tabela
  if (m.bumper) {
    const bm = m.bumper.c === '#d9dfe6' ? chromeMat : plastic;
    const { z, h, d } = m.bumper;
    if (!m.bumper.rearOnly) {
      box(THREE, group, d, h, halfW(0) * 2 * 1.02, -0.01 + (m.bowF || 0) * 0.5, z, 0, bm);
      for (const sg of [1, -1]) box(THREE, group, 0.3, h, 0.05, 0.14 + (m.bowF || 0) * 0.5, z, sg * halfW(0.05) * 0.99, bm);
    }
    box(THREE, group, d, h, halfW(1) * 2 * 1.02, L + 0.01 - (m.bowR || 0) * 0.5, z, 0, bm);
    for (const sg of [1, -1]) box(THREE, group, 0.3, h, 0.05, L - 0.14 - (m.bowR || 0) * 0.5, z, sg * halfW(0.95) * 0.99, bm);
  }
  if (m.wing) {
    const w = m.wing;
    const am = new THREE.MeshPhysicalMaterial({ color: accent, ...FINISH.gloss });
    box(THREE, group, w.chord, 0.05, w.span, w.s * L - 0.03, w.z, 0, am);
    for (const sg of [1, -1]) {
      box(THREE, group, w.chord * 0.9, 0.15, 0.04, w.s * L - 0.03, w.z + 0.04, sg * (w.span / 2), am);
      box(THREE, group, 0.1, w.z - deckF(w.s), 0.05, w.s * L - 0.03, (w.z + deckF(w.s)) / 2, sg * 0.46, plastic);
    }
  }
  if (m.rails) {
    const a = (m.win[0][0] + 0.02) * L;
    const b = (m.win[m.win.length - 1][1] + 0.03) * L;
    for (const sg of [1, -1]) box(THREE, group, b - a, 0.04, 0.05, (a + b) / 2, roofF((a + b) / 2 / L) + 0.07, sg * (W / 2) * m.tumble * 0.86, chromeMat);
  }
  if (m.roofSpoiler) box(THREE, group, 0.34, 0.05, W * 0.74, (m.roof[m.roof.length - 2][0] - 0.1) * L, roofF(m.roof[m.roof.length - 2][0] - 0.1) + 0.02, 0, plastic);
  if (m.hoodStar) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.02, 0.09, 6), chromeMat); st.position.set(0.05, deckF(0.02) + 0.09, 0); group.add(st); }
  if (m.chromeBelt) {
    const a = 0.3; const bd = 0.8;
    for (let i = 0; i < 20; i++) {
      const s = a + ((bd - a) * (i + 0.5)) / 20;
      for (const sg of [1, -1]) box(THREE, group, ((bd - a) * L) / 20 + 0.02, 0.025, 0.02, s * L, deckF(s) + 0.05, sg * (beltY(s) + 0.012), chromeMat);
    }
  }
  if (m.roofPods) for (const k of [0.3, 0.62]) box(THREE, group, 2.2, 0.26, W * 0.62, k * L, H + 0.06, 0, new THREE.MeshStandardMaterial({ color: '#dfe3e7', roughness: 0.5 }));
  if (m.wind) { const w = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.42, W * 0.86), new THREE.MeshStandardMaterial({ color: paint.accent || '#dfe3e7', roughness: 0.4 })); w.position.set(0.18 * L, roofF(0.12) + 0.26, 0); w.rotation.z = 0.2; group.add(w); }
  if (m.cargo) {
    const q = m.cargo;
    const tarp = new THREE.MeshStandardMaterial({ map: tarpTexture(THREE, paint.accent || '#2a6db0', 'NAKLİYAT'), roughness: 0.7 });
    const x0 = q.s0 * L; const x1 = q.s1 * L;
    box(THREE, group, x1 - x0, q.z1 - q.z0, W * 0.98, (x0 + x1) / 2, (q.z0 + q.z1) / 2, 0, tarp);
    box(THREE, group, x1 - x0, 0.14, W, (x0 + x1) / 2, q.z0 - 0.04, 0, plastic);
    for (const s of [0.74]) for (const sg of [1, -1]) addWheel(THREE, group, s * L, sg * (wy - tw - 0.04), m.r, tw, tex, tyreMat);
  }
  if (m.doors) {
    for (const [a, b] of m.doors) for (const sg of [1, -1]) box(THREE, group, (b - a) * L, 2.2, 0.03, ((a + b) / 2) * L, 1.6, sg * (W / 2 + 0.002), glassMat);
  }
  const sign = paint.sign || (m.roofSign && m.roofSign);
  if (sign) {
    const t = fascia(THREE, 1.4, 0.3, (d) => { d.box(0, 0.15, 1.4, 0.3, sign.c || '#ffd23f'); d.text(sign.text, 0.26, 0.14, '#111'); }, 256);
    const mat = new THREE.MeshStandardMaterial({ map: t, emissive: '#555', emissiveMap: t, roughness: 0.4 });
    box(THREE, group, 0.34, 0.2, 0.74, 0.52 * L, roofF(0.52) + 0.14, 0, mat);
  }
  if (paint.police) {
    const bar = roofF(0.52) + 0.1;
    box(THREE, group, 0.26, 0.09, 1.1, 0.5 * L, bar, 0, plastic);
    for (const [sg, c] of [[1, '#ff2030'], [-1, '#2060ff']]) box(THREE, group, 0.24, 0.1, 0.42, 0.5 * L, bar + 0.02, sg * 0.3, new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1 }));
  }
  group.userData.L = L;
  group.userData.W = W;
  group.userData.H = H;
  return group;
}

function addCap(THREE, group, m, rear, tex, paintMat, halfW, bow, bottomAt, deckTop, deckF) {
  const { L, W, H } = m;
  const s = rear ? 1 : 0;
  const col = collector();
  const NY = 14; const NZ = 8;
  const b = halfW(s);
  const z0 = bottomAt(s); const zt = deckF(s);
  for (let i = 0; i <= NY; i++) {
    const yn = -1 + (2 * i) / NY;
    const y = yn * b;
    for (let j = 0; j <= NZ; j++) {
      const z = z0 + (Math.min(zt, zt) - z0) * (j / NZ);
      const zm = z + (deckTop(s, y) - zt) * (j / NZ);
      const k = vert(col, `${i}_${j}`, s * L + bow(s, Math.abs(yn)), y, zm, 0.5, zm / H);
      if (i && j) { const p = k - (NZ + 1) - 1; const q = k - (NZ + 1); const r = k - 1; if (rear) quad(col, p, q, k, r); else quad(col, p, r, k, q); }
    }
  }
  const capMat = paintMat.clone(); capMat.side = THREE.DoubleSide; const geo = mesh(THREE, col, capMat);
  group.add(geo);
  // Pano: ince bir kavisli ızgara, tuval yerleşimi metre ile eşleşir
  const panel = collector();
  const Wc = W * 1.04;
  const N2 = 20;
  const off = rear ? 0.012 : -0.012;
  for (let i = 0; i <= N2; i++) {
    const yn = -1 + (2 * i) / N2;
    const y = yn * Wc / 2;
    const xb = s * L + bow(s, Math.min(1, Math.abs(y) / b)) + off;
    for (const [j, z] of [[0, 0], [1, H]]) {
      const u = rear ? 0.5 + y / Wc : 0.5 - y / Wc;
      const v = z / H;
      vert(panel, `${i}_${j}`, xb, y, z, u, v);
    }
    if (i) { const a = (i - 1) * 2; if (rear) quad(panel, a, a + 2, a + 3, a + 1); else quad(panel, a, a + 1, a + 3, a + 2); }
  }
  const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.04, roughness: 0.32, metalness: 0.15, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.35 });
  group.add(mesh(THREE, panel, mat));
}

// Kapı çizgileri, kol, siyah kaplama ve şeritler: boyanın üstüne yan izdüşümle gelir
function sideTexture(THREE, m, paint) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  g.fillRect(0, 0, 1024, 256);
  const X = (s) => s * 1024;
  const Y = (z) => 256 - (z / m.H) * 256;
  g.strokeStyle = 'rgba(0,0,0,.8)';
  g.lineWidth = 3;
  for (const s of m.seams || []) { g.beginPath(); g.moveTo(X(s), Y(m.H)); g.lineTo(X(s), Y(0.15)); g.stroke(); }
  // Kaput ve bagaj açılış çizgisi
  for (const s of [m.hood, m.trunk]) if (s <= 1) { g.lineWidth = 3; g.beginPath(); g.moveTo(X(s), 0); g.lineTo(X(s), 256); g.stroke(); }
  g.fillStyle = 'rgba(10,12,16,.75)';
  const belt = m.deck[Math.floor(m.deck.length / 2)][1];
  for (const s of m.handles || []) g.fillRect(X(s) - 12, Y(belt - 0.1), 24, 5);
  // Etek çizgisi
  g.strokeStyle = 'rgba(0,0,0,.25)';
  g.lineWidth = 2;
  g.beginPath(); g.moveTo(0, Y(belt - 0.05)); g.lineTo(1024, Y(belt - 0.05)); g.stroke();
  if (m.clad) { g.fillStyle = '#1b1e23'; g.fillRect(0, Y(m.clad), 1024, 256 - Y(m.clad)); }
  if (m.skirt) { g.fillStyle = paint.accent || '#ffd23f'; g.fillRect(0, Y(0.3), 1024, 8); }
  if (m.sideStripe) { g.fillStyle = paint.accent || '#f6efe0'; g.fillRect(0, Y(m.sideStripe), 1024, 6); }
  if (m.band) { g.fillStyle = m.band.c; g.fillRect(0, Y(m.band.z + m.band.h / 2), 1024, (m.band.h / m.H) * 256); }
  if (paint.band) { g.fillStyle = paint.band; g.fillRect(0, Y(0.8), 1024, (0.26 / m.H) * 256); }
  if (paint.lower) { g.fillStyle = paint.lower; g.fillRect(0, Y(0.62), 1024, 256 - Y(0.62)); }
  if (paint.text) { g.fillStyle = paint.textColor || '#fff'; g.font = `900 ${(0.2 / m.H) * 256}px Nunito, Arial`; g.textAlign = 'center'; g.fillText(paint.text, X(0.55), Y(0.74)); }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function tarpTexture(THREE, col, text) {
  const c = document.createElement('canvas');
  c.width = 512; c.height = 128;
  const g = c.getContext('2d');
  g.fillStyle = col; g.fillRect(0, 0, 512, 128);
  g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 3;
  for (let x = 32; x < 512; x += 42) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 128); g.stroke(); }
  g.fillStyle = '#fff'; g.font = '900 44px Nunito, Arial'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 256, 66);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function buildMoto(THREE, paint) {
  const g = new THREE.Group();
  const L = 2.1;
  const f = FINISH[paint.finish || 'gloss'];
  const pm = new THREE.MeshPhysicalMaterial({ color: paint.color, ...f });
  const dark = new THREE.MeshStandardMaterial({ color: '#111317', roughness: 0.6 });
  const chrome = new THREE.MeshStandardMaterial({ color: '#d9dfe6', metalness: 1, roughness: 0.2 });
  const acc = new THREE.MeshPhysicalMaterial({ color: paint.accent || '#ffe14d', ...FINISH.gloss });
  const ell = (sx, sy, sz, x, y, z, mat) => { const m = new THREE.Mesh(new THREE.SphereGeometry(1, 18, 12), mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); g.add(m); return m; };
  const tyre = (x) => { const t = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.075, 12, 28), dark); t.position.set(x, 0.355, 0); g.add(t); const r = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.03, 16), chrome); r.rotation.x = Math.PI / 2; r.position.set(x, 0.355, 0); g.add(r); };
  tyre(0.32); tyre(1.78);
  ell(0.34, 0.2, 0.17, 0.84, 0.86, 0, pm); // Depo
  ell(0.26, 0.22, 0.15, 0.36, 0.86, 0, pm); // Kaporta
  ell(0.16, 0.05, 0.13, 0.22, 0.98, 0, acc);
  ell(0.4, 0.09, 0.13, 1.34, 0.86, 0, dark); // Sele
  const tail = ell(0.3, 0.07, 0.1, 1.68, 0.96, 0, pm); tail.rotation.z = -0.3;
  ell(0.22, 0.2, 0.13, 0.95, 0.5, 0, dark); // Motor
  ell(0.26, 0.05, 0.05, 1.5, 0.48, 0.17, chrome); // Egzoz
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.74, 8), chrome); bar.rotation.x = Math.PI / 2; bar.position.set(0.5, 1.06, 0); g.add(bar);
  const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.78, 8), chrome); fork.rotation.z = -0.3; fork.position.set(0.4, 0.72, 0); g.add(fork);
  for (const s of [1, -1]) ell(0.04, 0.03, 0.06, 0.48, 1.16, s * 0.3, dark);
  ell(0.06, 0.05, 0.06, 0.08, 0.86, 0, new THREE.MeshStandardMaterial({ color: '#fff6c9', emissive: '#fff6c9', emissiveIntensity: 1 }));
  ell(0.03, 0.03, 0.08, 1.96, 0.98, 0, new THREE.MeshStandardMaterial({ color: '#ff2733', emissive: '#ff2733', emissiveIntensity: 1 }));
  // Sürücü
  const suit = new THREE.MeshStandardMaterial({ color: '#1b1e24', roughness: 0.6 });
  const torso = ell(0.17, 0.3, 0.2, 1.08, 1.22, 0, suit); torso.rotation.z = 0.7;
  ell(0.13, 0.13, 0.13, 0.82, 1.5, 0, pm);
  ell(0.07, 0.07, 0.1, 0.72, 1.5, 0, new THREE.MeshStandardMaterial({ color: '#0a0f14', metalness: 0.8, roughness: 0.1 }));
  for (const s of [1, -1]) { const a = ell(0.28, 0.05, 0.05, 0.74, 1.2, s * 0.24, suit); a.rotation.z = 0.5; ell(0.26, 0.07, 0.07, 1.14, 0.78, s * 0.2, suit); }
  g.userData.L = L;
  g.userData.W = 0.82;
  g.userData.H = 1.6;
  return g;
}

// Stüdyo ışık ortamı: gerçek zamanlı yansıma için küçük bir sahneden üretilir
function makeEnv(THREE, renderer, warm = true, panels = true) {
  const pm = new THREE.PMREMGenerator(renderer);
  const s = new THREE.Scene();
  const sky = new THREE.Mesh(new THREE.SphereGeometry(30, 16, 12), new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: { warm: { value: warm ? 1 : 0 } },
    vertexShader: 'varying vec3 p; void main(){ p=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
    fragmentShader: 'varying vec3 p; uniform float warm; void main(){ float h=normalize(p).y; vec3 top=mix(vec3(.42,.5,.62),vec3(.1,.09,.26),warm); vec3 hor=mix(vec3(.72),vec3(.8,.42,.24),warm); vec3 c=mix(hor,top,smoothstep(0.,.6,h)); if(h<0.) c=mix(hor,vec3(.08,.08,.1),smoothstep(0.,-.25,h)); gl_FragColor=vec4(c,1.); }',
  }));
  s.add(sky);
  const panel = (x, y, z, w, h, c, I) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(c).multiplyScalar(I), side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); s.add(m); };
  if (panels) panel(0, 12, 0, 12, 4, '#ffffff', 2.6);
  panel(14, 6, 8, 5, 10, '#ffffff', 1.6);
  panel(-14, 6, -8, 5, 10, warm ? '#ffb070' : '#ffffff', 1.6);
  const rt = pm.fromScene(s, 0.03);
  pm.dispose();
  return rt.texture;
}


// --- menu3d.js ---
// Ana menü ve garaj sahnesi: Three.js ile dönen gerçek araç, İstanbul silüeti, deniz, hareketli ışıklar.
// Three.js vendor/ klasöründen gelir, internet gerekmez. WebGL yoksa CSS silüeti yedek olarak kalır.

function tex(T, w, h, paint) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  paint(c.getContext('2d'), w, h);
  const t = new T.CanvasTexture(c);
  t.colorSpace = T.SRGBColorSpace;
  return t;
}

// Tek bir tepe çizgisi. kind: 0 uzak tepeler ve bloklar, 1 yakın anıtlar
function skyline(g, W, H, near) {
  const base = H;
  g.fillStyle = near ? '#120c2a' : '#2c1a52';
  const mosque = (x, y, s) => {
    g.beginPath(); g.arc(x, y - 58 * s, 62 * s, Math.PI, 0); g.fill();
    g.fillRect(x - 62 * s, y - 58 * s, 124 * s, 60 * s);
    for (const k of [-1, 1]) {
      g.beginPath(); g.arc(x + k * 84 * s, y - 34 * s, 34 * s, Math.PI, 0); g.fill();
      g.fillRect(x + k * 84 * s - 34 * s, y - 34 * s, 68 * s, 36 * s);
      for (const m of [108, 150]) {
        const px = x + k * m * s;
        g.beginPath(); g.moveTo(px - 6 * s, y); g.lineTo(px - 5 * s, y - 170 * s); g.lineTo(px, y - 214 * s); g.lineTo(px + 5 * s, y - 170 * s); g.lineTo(px + 6 * s, y); g.fill();
        g.fillRect(px - 8 * s, y - 128 * s, 16 * s, 5 * s);
      }
    }
    g.fillRect(x - 1.5 * s, y - 136 * s, 3 * s, 18 * s);
  };
  const galata = (x, y, s) => {
    g.fillRect(x - 26 * s, y - 150 * s, 52 * s, 150 * s);
    g.fillRect(x - 30 * s, y - 158 * s, 60 * s, 10 * s);
    g.beginPath(); g.moveTo(x - 30 * s, y - 158 * s); g.lineTo(x, y - 214 * s); g.lineTo(x + 30 * s, y - 158 * s); g.fill();
  };
  const tower = (x, w, h, top) => {
    g.fillRect(x, base - h, w, h);
    if (top === 1) { g.beginPath(); g.moveTo(x, base - h); g.lineTo(x + w / 2, base - h - w * 0.7); g.lineTo(x + w, base - h); g.fill(); }
    if (top === 2) g.fillRect(x + w / 2 - 1.5, base - h - 30, 3, 30);
  };
  if (!near) {
    for (let x = 0; x < W; x += 18) {
      const n = Math.sin(x * 0.006) * 34 + Math.sin(x * 0.019) * 18;
      g.fillRect(x, base - 70 - n, 19, 90 + n);
    }
    // Levent gökdelenleri
    for (const [x, w, h, t] of [[1270, 46, 250, 1], [1326, 38, 300, 2], [1372, 50, 268, 0], [1430, 34, 216, 1], [1470, 44, 330, 1], [1524, 36, 240, 2], [1570, 50, 200, 0], [420, 40, 170, 0], [470, 32, 196, 1]]) tower(x, w, h, t);
  } else {
    for (let x = 0; x < W; x += 34) {
      const h = 30 + ((x * 7919) % 46);
      g.fillRect(x, base - h, 36, h);
      g.beginPath(); g.moveTo(x - 2, base - h); g.lineTo(x + 18, base - h - 12); g.lineTo(x + 38, base - h); g.fill();
    }
    mosque(310, base - 34, 1.25);
    mosque(1660, base - 26, 0.9);
    galata(830, base - 36, 1.05);
  }
}

function windows(g, W, H, near) {
  g.clearRect(0, 0, W, H);
  let seed = near ? 77 : 13;
  const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  for (let i = 0; i < (near ? 260 : 560); i++) {
    const x = rnd() * W;
    const top = near ? 62 : 110;
    const y = H - rnd() * top - 6;
    g.fillStyle = ['#ffd27a', '#ffb860', '#fff0c0', '#8fd8ff'][Math.floor(rnd() * 4)];
    g.fillRect(x, y, near ? 3 : 2, near ? 4 : 3);
  }
  if (!near) {
    for (const [x, w, h] of [[1270, 46, 250], [1326, 38, 300], [1372, 50, 268], [1430, 34, 216], [1470, 44, 330], [1524, 36, 240], [1570, 50, 200]]) {
      for (let y = H - h + 8; y < H - 60; y += 9) {
        for (let k = x + 4; k < x + w - 4; k += 7) {
          if (rnd() < 0.5) continue;
          g.fillStyle = rnd() < 0.3 ? '#8fd8ff' : '#ffd27a';
          g.fillRect(k, y, 3, 4);
        }
      }
    }
  }
}

class Stage {
  constructor(canvas) {
    const T = globalThis.THREE;
    this.T = T;
    this.canvas = canvas;
    this.ok = false;
    try {
      this.r = new T.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'low-power' });
    } catch { return; }
    this.ok = true;
    const r = this.r;
    r.toneMapping = T.ACESFilmicToneMapping;
    r.toneMappingExposure = 1.05;
    r.outputColorSpace = T.SRGBColorSpace;
    this.pixel = Math.min(1.5, window.devicePixelRatio || 1);
    r.setPixelRatio(this.pixel);
    this.scene = new T.Scene();
    this.scene.environment = makeEnv(T, r, true, true);
    this.cam = new T.PerspectiveCamera(28, 1, 0.1, 400);
    this.mode = 'menu';
    this.angle = 0.7;
    this.spin = 0.32;
    this.drag = null;
    this.yShift = 0;
    this.fps = { t: 0, n: 0, slow: 0 };
    this.buildWorld();
    this.resize();
    canvas.addEventListener('pointerdown', (e) => { this.drag = e.clientX; this.spinHold = 2; });
    window.addEventListener('pointermove', (e) => {
      if (this.drag === null) return;
      this.angle += (e.clientX - this.drag) * 0.009;
      this.drag = e.clientX;
    });
    window.addEventListener('pointerup', () => { this.drag = null; });
  }

  buildWorld() {
    const { T, scene } = this;
    const bg = new T.Group();
    this.bg = bg;
    scene.add(bg);
    // Gökyüzü: gün batımı, güneş, yıldız
    const sky = tex(T, 512, 512, (g, w, h) => {
      const c = g.createLinearGradient(0, 0, 0, h);
      c.addColorStop(0, '#0b0a2a'); c.addColorStop(0.36, '#2b1458'); c.addColorStop(0.6, '#8a2a70'); c.addColorStop(0.78, '#f0603f'); c.addColorStop(0.92, '#ffb45e'); c.addColorStop(1, '#ffd98e');
      g.fillStyle = c; g.fillRect(0, 0, w, h);
      for (let i = 0; i < 220; i++) { g.fillStyle = `rgba(255,255,255,${Math.random() * 0.8})`; g.fillRect(Math.random() * w, Math.random() * h * 0.5, 1, 1); }
      const sun = g.createRadialGradient(w * 0.62, h * 0.86, 4, w * 0.62, h * 0.86, 150);
      sun.addColorStop(0, 'rgba(255,245,200,1)'); sun.addColorStop(0.16, 'rgba(255,220,140,.95)'); sun.addColorStop(0.2, 'rgba(255,170,90,.5)'); sun.addColorStop(1, 'rgba(255,120,60,0)');
      g.fillStyle = sun; g.fillRect(0, 0, w, h);
      g.globalAlpha = 0.5;
      for (let i = 0; i < 9; i++) {
        g.fillStyle = i % 2 ? '#ff8a5a' : '#c44a7a';
        g.beginPath(); g.ellipse(Math.random() * w, h * (0.55 + Math.random() * 0.25), 60 + Math.random() * 130, 3 + Math.random() * 6, 0, 0, 7); g.fill();
      }
    });
    const back = new T.Mesh(new T.PlaneGeometry(240, 110), new T.MeshBasicMaterial({ map: sky, fog: false }));
    back.position.set(0, 42, -96);
    bg.add(back);

    // Silüet katmanları
    const layer = (near, z, width, height, y) => {
      const W = 2048; const H = near ? 300 : 400;
      const body = tex(T, W, H, (g) => { g.clearRect(0, 0, W, H); skyline(g, W, H, near); });
      const m = new T.Mesh(new T.PlaneGeometry(width, height), new T.MeshBasicMaterial({ map: body, transparent: true, fog: false }));
      m.position.set(0, y, z);
      bg.add(m);
      const lit = tex(T, W, H, (g) => windows(g, W, H, near));
      const l = new T.Mesh(new T.PlaneGeometry(width, height), new T.MeshBasicMaterial({ map: lit, transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false }));
      l.position.set(0, y, z + 0.1);
      bg.add(l);
      return l;
    };
    this.farLit = layer(false, -78, 190, 37, 18);
    this.nearLit = layer(true, -62, 150, 22, 10.6);

    // Boğaz Köprüsü: kuleler, kablolar ve renk değiştiren LED'ler
    const bw = 1024; const bh = 256;
    const bridge = tex(T, bw, bh, (g) => {
      g.clearRect(0, 0, bw, bh);
      g.strokeStyle = '#150e30'; g.fillStyle = '#150e30'; g.lineWidth = 6;
      g.fillRect(0, 196, bw, 10);
      for (const x of [240, 780]) { g.fillRect(x - 11, 40, 8, 200); g.fillRect(x + 3, 40, 8, 200); g.fillRect(x - 11, 62, 22, 6); g.fillRect(x - 11, 120, 22, 6); }
      g.lineWidth = 3;
      g.beginPath(); g.moveTo(0, 170); g.quadraticCurveTo(120, 90, 240, 42); g.quadraticCurveTo(510, 330, 780, 42); g.quadraticCurveTo(900, 90, 1024, 170); g.stroke();
      g.lineWidth = 1;
      for (let x = 250; x < 780; x += 16) { const t = (x - 240) / 540; const y = 42 + 288 * 2 * t * (1 - t) * 0.5 * 2 * 0.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x, 196); g.stroke(); }
    });
    const b = new T.Mesh(new T.PlaneGeometry(120, 30), new T.MeshBasicMaterial({ map: bridge, transparent: true, fog: false }));
    b.position.set(-16, 13.4, -70);
    bg.add(b);
    const ledT = tex(T, bw, bh, (g) => {
      g.clearRect(0, 0, bw, bh);
      g.fillStyle = '#fff';
      for (let i = 0; i <= 120; i++) { const t = i / 120; const x = 240 + 540 * t; const y = 42 + 4 * t * (1 - t) * 144; g.fillRect(x - 1.5, y - 1.5, 3, 3); }
      for (let x = 0; x < bw; x += 8) g.fillRect(x, 193, 3, 3);
      for (const x of [240, 780]) for (let y = 44; y < 196; y += 10) g.fillRect(x - 1.5, y, 3, 4);
    });
    this.led = new T.Mesh(new T.PlaneGeometry(120, 30), new T.MeshBasicMaterial({ map: ledT, transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false, color: '#ff4fa0' }));
    this.led.position.set(-16, 13.4, -69.9);
    bg.add(this.led);
    // Köprüden geçen farlar
    const n = 26;
    const pos = new Float32Array(n * 3);
    this.traffic = { pos, n, off: Array.from({ length: n }, () => Math.random()) };
    const pg = new T.BufferGeometry();
    pg.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    this.trafficPts = new T.Points(pg, new T.PointsMaterial({ color: '#fff0c0', size: 0.5, sizeAttenuation: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false, fog: false }));
    bg.add(this.trafficPts);

    // Deniz: gün batımı parıltısı
    this.seaU = { t: { value: 0 } };
    const sea = new T.Mesh(new T.PlaneGeometry(320, 96), new T.ShaderMaterial({
      uniforms: this.seaU,
      vertexShader: 'varying vec2 v; void main(){ v=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: `varying vec2 v; uniform float t;
        float n(vec2 p){ return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453); }
        void main(){
          float y=v.y; vec3 far=vec3(.92,.42,.32); vec3 nr=vec3(.05,.05,.17);
          vec3 c=mix(nr,far,pow(y,3.));
          float band=sin(y*220.+sin(v.x*30.+t)*2.+t*2.)*.5+.5;
          float w=sin(v.x*9.+y*40.+t*.7)*.5+.5;
          float glit=smoothstep(.15,.0,abs(v.x-.56+(.5-y)*.03))*pow(band,3.)*(.35+.65*y);
          glit+=smoothstep(.5,.0,abs(v.x-.56))*pow(band*w,6.)*.5;
          c+=vec3(1.,.72,.42)*glit;
          gl_FragColor=vec4(c,1.);
        }`,
    }));
    sea.rotation.x = -Math.PI / 2;
    sea.position.set(0, -2.6, -36);
    scene.add(sea);

    // Rıhtım zemini ve döner platform
    const floorT = tex(T, 1024, 1024, (g, w, h) => {
      g.fillStyle = '#10121c'; g.fillRect(0, 0, w, h);
      g.globalAlpha = 0.5;
      for (let i = 0; i < 1600; i++) { g.fillStyle = i % 2 ? '#1a1d2b' : '#0a0b12'; g.fillRect(Math.random() * w, Math.random() * h, 2, 2); }
      g.globalAlpha = 1;
      g.strokeStyle = 'rgba(255,150,70,.5)'; g.lineWidth = 3;
      for (let i = 0; i < 24; i++) { const a = (i / 24) * 6.283; g.beginPath(); g.moveTo(512 + Math.cos(a) * 372, 512 + Math.sin(a) * 372); g.lineTo(512 + Math.cos(a) * 412, 512 + Math.sin(a) * 412); g.stroke(); }
    });
    const floor = new T.Mesh(new T.CircleGeometry(34, 64), new T.MeshStandardMaterial({ map: floorT, roughness: 0.3, metalness: 0.5, transparent: true, opacity: 0.8, envMapIntensity: 0.5 }));
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);
    const under = new T.Mesh(new T.CircleGeometry(34, 48), new T.MeshBasicMaterial({ color: '#090a14' }));
    under.rotation.x = -Math.PI / 2;
    under.position.y = -2.3;
    scene.add(under);
    const edge = new T.Mesh(new T.RingGeometry(33.6, 34, 64), new T.MeshBasicMaterial({ color: '#ff7a2a' }));
    edge.rotation.x = -Math.PI / 2; edge.position.y = 0.02;
    scene.add(edge);
    this.ring = new T.Mesh(new T.RingGeometry(3.72, 3.84, 96), new T.MeshBasicMaterial({ color: '#ffb35a', transparent: true, opacity: 0.95 }));
    this.ring.rotation.x = -Math.PI / 2;
    this.ring.position.y = 0.03;
    scene.add(this.ring);
    const glowT = tex(T, 256, 256, (g, w) => {
      const c = g.createRadialGradient(w / 2, w / 2, w * 0.2, w / 2, w / 2, w / 2);
      c.addColorStop(0, 'rgba(255,160,70,.5)'); c.addColorStop(1, 'rgba(255,120,40,0)');
      g.fillStyle = c; g.fillRect(0, 0, w, w);
    });
    const glow = new T.Mesh(new T.PlaneGeometry(10, 10), new T.MeshBasicMaterial({ map: glowT, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
    glow.rotation.x = -Math.PI / 2; glow.position.y = 0.04;
    scene.add(glow);

    // Işıklar
    scene.add(new T.HemisphereLight('#ffc9a0', '#20204a', 0.5));
    const key = new T.DirectionalLight('#ffd9b0', 2.2);
    key.position.set(4, 7, 6);
    scene.add(key);
    const rim = new T.DirectionalLight('#7fb0ff', 1.4);
    rim.position.set(-6, 4, -6);
    scene.add(rim);
    this.copR = new T.PointLight('#ff2a3c', 0, 18, 1.4);
    this.copR.position.set(-5, 1.6, 3);
    this.copB = new T.PointLight('#2a6bff', 0, 18, 1.4);
    this.copB.position.set(5, 1.6, 3);
    scene.add(this.copR, this.copB);

    // Süpüren ışık huzmeleri
    const beamT = tex(T, 64, 256, (g, w, h) => {
      const c = g.createLinearGradient(0, h, 0, 0);
      c.addColorStop(0, 'rgba(255,230,190,.55)'); c.addColorStop(1, 'rgba(255,220,170,0)');
      g.fillStyle = c; g.beginPath(); g.moveTo(w / 2 - 4, h); g.lineTo(w / 2 + 4, h); g.lineTo(w, 0); g.lineTo(0, 0); g.fill();
    });
    this.beams = [];
    for (const [x, z, sp, c] of [[-26, -58, 0.5, '#ffd9a0'], [18, -60, -0.42, '#a0c8ff'], [44, -64, 0.33, '#ff9ad0']]) {
      const b2 = new T.Mesh(new T.PlaneGeometry(14, 90), new T.MeshBasicMaterial({ map: beamT, transparent: true, blending: T.AdditiveBlending, depthWrite: false, color: c, fog: false, side: T.DoubleSide }));
      b2.geometry.translate(0, 45, 0);
      b2.position.set(x, 4, z);
      bg.add(b2);
      this.beams.push({ m: b2, sp, ph: x });
    }

    // Uçuşan ışık tozu
    const dn = 70;
    const dp = new Float32Array(dn * 3);
    for (let i = 0; i < dn; i++) { dp[i * 3] = (Math.random() - 0.5) * 16; dp[i * 3 + 1] = Math.random() * 6; dp[i * 3 + 2] = (Math.random() - 0.5) * 12; }
    const dg = new T.BufferGeometry();
    dg.setAttribute('position', new T.Float32BufferAttribute(dp, 3));
    this.dust = new T.Points(dg, new T.PointsMaterial({ color: '#ffcf90', size: 0.05, transparent: true, opacity: 0.8, blending: T.AdditiveBlending, depthWrite: false }));
    scene.add(this.dust);

    this.turn = new T.Group();
    scene.add(this.turn);
  }

  // shape: model, paint: boya
  setCar(shape, paint) {
    const key = `${shape}|${paint.color}|${paint.finish}|${paint.roof || ''}|${paint.accent || ''}`;
    if (key === this.carKey || !this.ok) return;
    this.carKey = key;
    const { T, turn } = this;
    while (turn.children.length) {
      const o = turn.children.pop();
      o.traverse((m) => { if (m.geometry) m.geometry.dispose(); if (m.material) { if (m.material.map) m.material.map.dispose(); m.material.dispose(); } });
    }
    const car = buildCar(T, shape, { ...paint, premium: 1, caliper: '#ff3a2a' });
    const { L } = car.userData;
    const k = 4.6 / Math.max(L, 2.4);
    const pivot = new T.Group();
    car.position.x = -L / 2;
    pivot.add(car);
    pivot.scale.setScalar(shape === 'moto' ? 1.5 : k);
    turn.add(pivot);
    // Yerde yansıma: ters çevrilmiş kopya
    const mirror = pivot.clone();
    mirror.scale.y *= -1;
    mirror.position.y = -0.01;
    turn.add(mirror);
  }

  setMode(mode) {
    this.mode = mode;
    this.canvas.hidden = !mode;
    if (mode) this.resize();
  }

  resize() {
    if (!this.ok) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.r.setSize(w, h, false);
    this.cam.aspect = w / h;
    this.cam.updateProjectionMatrix();
  }

  frame(now, dt) {
    if (!this.ok || !this.mode) return;
    const t = now / 1000;
    if (this.spinHold > 0) this.spinHold -= dt;
    else if (this.drag === null) this.angle += this.spin * dt;
    this.turn.rotation.y = this.angle;

    const asp = this.cam.aspect;
    const portrait = asp < 1;
    const garage = this.mode === 'garage';
    // Araç genişliğe sığsın: kamera uzaklığı en boy oranından gelir
    const dist = Math.max(11, 11 / asp) * (garage ? 0.92 : 1);
    const lift = portrait ? (garage ? -2.1 : -0.55) : 0;
    const lateral = !portrait ? (garage ? 2.2 : -1.4) : 0;
    const orbit = Math.sin(t * 0.14) * 0.07;
    const ease = Math.min(1, dt * 3);
    this.cx = this.cx === undefined ? dist : this.cx + (dist - this.cx) * ease;
    this.cl = this.cl === undefined ? lift : this.cl + (lift - this.cl) * ease;
    this.ct = this.ct === undefined ? lateral : this.ct + (lateral - this.ct) * ease;
    this.cam.position.set(Math.sin(orbit) * this.cx + this.ct, 2.5, Math.cos(orbit) * this.cx);
    this.cam.lookAt(this.ct, 1.0 + this.cl, 0);
    // Dar ekranda arka plan küçülür: köprü ve silüet kadraja girer
    const k = Math.max(0.36, Math.min(1, asp / 1.45));
    this.bg.scale.set(k, k, 1);
    this.bg.position.x = (portrait ? 13 : 4) * k;

    // Hareketli ışıklar
    this.seaU.t.value = t;
    this.ring.material.opacity = 0.7 + 0.3 * Math.sin(t * 2);
    for (const b of this.beams) b.m.rotation.z = Math.sin(t * b.sp + b.ph) * 0.5;
    const hue = (t * 0.04) % 1;
    this.led.material.color.setHSL(hue, 0.9, 0.62);
    this.farLit.material.opacity = 0.82 + 0.18 * Math.sin(t * 0.9);
    this.nearLit.material.opacity = 0.82 + 0.18 * Math.sin(t * 1.3 + 1);
    const tr = this.traffic;
    for (let i = 0; i < tr.n; i++) {
      const u = (tr.off[i] + t * 0.018 * (i % 2 ? 1 : -1)) % 1;
      const p = u < 0 ? u + 1 : u;
      tr.pos[i * 3] = -76 + p * 120;
      tr.pos[i * 3 + 1] = 13.4 + 15 - (198 / 256) * 30 + 0.1;
      tr.pos[i * 3 + 2] = -69.8;
    }
    this.trafficPts.geometry.attributes.position.needsUpdate = true;
    // Uzakta dönen polis lambaları
    const flash = Math.floor(t * 5) % 2;
    const wave = Math.max(0, Math.sin(t * 0.5)) * 34;
    this.copR.intensity = flash ? wave : 0;
    this.copB.intensity = flash ? 0 : wave;
    const d = this.dust.geometry.attributes.position;
    for (let i = 0; i < d.count; i++) {
      let y = d.getY(i) + dt * 0.14;
      if (y > 6) y = 0;
      d.setY(i, y);
    }
    d.needsUpdate = true;

    this.r.render(this.scene, this.cam);

    // Yavaş cihazda çözünürlük düşer
    const F = this.fps;
    F.t += dt; F.n++;
    if (F.t >= 2) {
      if (F.n / F.t < 28 && this.pixel > 0.75) { this.pixel = Math.max(0.75, this.pixel - 0.25); this.r.setPixelRatio(this.pixel); this.resize(); }
      F.t = 0; F.n = 0;
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

// Tabela boyutu: 0 minicik, 1 normal, 2 büyük, 3 dev çatı yazısı
const signOut = { x: 0, y: 0, w: 0, h: 0 };
function signBox(r, img) {
  const size = r.signSize ?? 1;
  const hTarget = [10, 16, 24, 40][size] ?? 16;
  const maxW = size === 3 ? r.w * 0.94 : r.w - 6;
  const w = Math.min(maxW, (img.width / img.height) * hTarget);
  const h = (w / img.width) * img.height;
  signOut.w = w;
  signOut.h = h;
  signOut.x = r.x + (r.w - w) / 2;
  // Dev yazı çatının ortasında, öteki tabelalar cephede
  signOut.y = size === 3 ? r.y + r.h * 0.26 - h / 2 : r.y + r.h - h - 7;
  return signOut;
}

function carSprite(spec, paint = 0) {
  const img = sheetSprite(`p:${spec.id}:${paint}`, spec.len);
  if (img) return img;
  return sprite(spec.len + 10, spec.wid + 14, (g) => paintTr(g, spec.len, spec.wid, spec.color, spec.accent, spec.shape, spec.finish));
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

  // Atlas yüklenince polis ve park etmiş araçlar 3B modellerden gelir
  useAtlas() {
    const P = CONFIG.police;
    const s = this.sprites;
    for (const k of ['car', 'fast', 'advanced', 'swat', 'moto']) {
      const img = sheetSprite(`cop:${k}`, P[k].len);
      if (img) s[k] = img;
    }
    const list = [];
    for (const [k, n] of [['egea', 4], ['clio', 4], ['tofas', 5], ['golf', 5], ['focus', 4], ['megane', 4], ['linea', 4], ['bavyera', 5], ['kore', 4], ['murat', 4]]) {
      for (let i = 0; i < n; i++) { const img = sheetSprite(`npc:${k}:${i}`, 44); if (img) list.push(img); }
    }
    if (list.length) s.parked = list;
    s.npc = {};
    this.playerId = '';
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

  // Yol ve sokak dokuları: karo başına tek görüntü, pişirme çok hızlanır
  makePatterns() {
    const T = TILE;
    const mk = (paint) => [0, 1, 2, 3].map((v) => {
      const c = makeCanvas(T, T);
      const g = c.getContext('2d');
      paint(g, v);
      return c;
    });
    const noise = (g, n, a, b, s = 3) => { for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? a : b; g.fillRect(Math.random() * T, Math.random() * T, s, s); } };
    this.roads = [
      mk((g, v) => { // Koyu asfalt
        g.fillStyle = '#34373e'; g.fillRect(0, 0, T, T);
        noise(g, 26, 'rgba(255,255,255,.05)', 'rgba(0,0,0,.14)', 2);
        if (v === 1) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(6, 10, 20, 9); }
      }),
      mk((g, v) => { // Açık beton: derzli plakalar
        g.fillStyle = v % 2 ? '#aeb0ad' : '#a6a8a6'; g.fillRect(0, 0, T, T);
        noise(g, 14, 'rgba(255,255,255,.1)', 'rgba(0,0,0,.08)', 2);
        g.fillStyle = 'rgba(40,40,40,.35)'; g.fillRect(0, 0, T, 1.5); g.fillRect(0, 0, 1.5, T);
      }),
      mk((g, v) => { // Parke taşı
        g.fillStyle = '#6d645b'; g.fillRect(0, 0, T, T);
        const cols = ['#8b8074', '#7f7468', '#94897b', '#766c60'];
        for (let y = 0; y < 4; y++) for (let x = -1; x < 5; x++) { g.fillStyle = cols[(x * 3 + y + v) & 3]; g.fillRect(x * 10 + (y % 2) * 5 + 0.6, y * 10 + 0.6, 8.8, 8.8); }
      }),
      mk((g, v) => { // Kırık asfalt: çatlak ve yama
        g.fillStyle = '#44474c'; g.fillRect(0, 0, T, T);
        noise(g, 22, 'rgba(255,255,255,.05)', 'rgba(0,0,0,.14)', 2);
        g.strokeStyle = 'rgba(10,10,12,.7)'; g.lineWidth = 1.2;
        g.beginPath(); g.moveTo(Math.random() * T, 0);
        for (let i = 1; i <= 4; i++) g.lineTo(Math.random() * T, (i / 4) * T);
        g.stroke();
        if (v === 2) { g.fillStyle = '#2b2d31'; g.fillRect(4, 8, 22, 17); }
        if (v === 3) { g.fillStyle = 'rgba(20,18,16,.8)'; g.beginPath(); g.ellipse(20, 22, 7, 5, 0.4, 0, 7); g.fill(); }
      }),
    ];
    this.alleys = [
      mk((g, v) => { // Arnavut kaldırımı
        g.fillStyle = '#5b554d'; g.fillRect(0, 0, T, T);
        for (let y = 0; y < 5; y++) for (let x = 0; x < 5; x++) { g.fillStyle = ['#8e8578', '#7a7267', '#9c9385'][(x + y * 2 + v) % 3]; g.beginPath(); g.arc(x * 8 + 4 + (y % 2) * 2, y * 8 + 4, 3.5, 0, 7); g.fill(); }
      }),
      mk(() => { // Yamalı beton
        return;
      }),
      mk((g, v) => { // Tuğla döşeme
        g.fillStyle = '#6e4a3c'; g.fillRect(0, 0, T, T);
        for (let y = 0; y < 5; y++) for (let x = -1; x < 4; x++) { g.fillStyle = ['#a56a4e', '#96604a', '#b0745a'][(x + y + v) & 1]; g.fillRect(x * 14 + (y % 2) * 7 + 0.6, y * 8 + 0.6, 12.8, 6.8); }
      }),
    ];
    this.alleys[1] = mk((g, v) => {
      g.fillStyle = v === 2 ? '#7c7f82' : '#8b8e8f'; g.fillRect(0, 0, T, T);
      noise(g, 16, 'rgba(255,255,255,.08)', 'rgba(0,0,0,.12)', 2);
      if (v === 1) { g.fillStyle = '#6a6d70'; g.fillRect(8, 6, 18, 22); }
    });
  }

  makeSprites() {
    const P = CONFIG.police;
    const s = this.sprites;
    this.makePatterns();
    s.car = sprite(P.car.len + 8, P.car.wid + 8, (g) => paintPolice(g, P.car, false));
    s.fast = sprite(P.fast.len + 10, P.fast.wid + 10, (g) => paintPoliceFast(g, P.fast));
    s.moto = sprite(P.moto.len + 12, P.moto.wid + 14, (g) => paintMoto(g, P.moto));
    s.advanced = sprite(P.advanced.len + 8, P.advanced.wid + 8, (g) => paintPolice(g, P.advanced, true));
    s.swat = sprite(P.swat.len + 8, P.swat.wid + 8, (g) => paintSwat(g, P.swat));
    s.tank = sprite(P.tank.len + 8, P.tank.wid + 8, (g) => paintTankHull(g, P.tank));
    s.turret = sprite(150, 50, paintTurret);
    const AL = CONFIG.aliens;
    s.ufo = sprite(AL.ufo.len + 10, AL.ufo.len + 10, (g) => paintUfo(g, AL.ufo));
    s.rover = sprite(AL.rover.len + 16, AL.rover.wid + 16, (g) => paintRover(g, AL.rover));
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
    s.npc = {}; // İlk görüldüğünde çizilir: açılış kısa kalır
    // Yarısı erkek, yarısı kadın: kıyafet, ten, saç ve aksesuar birleşimi
    const SHIRT = ['#e8533f', '#3e7cb1', '#f2c14e', '#4f9d69', '#2f3440', '#ececec', '#8a5a3a', '#d94f9c', '#7a5ea8', '#2fa8a0', '#f08a3c', '#a8c64a', '#e84a5f', '#4a7ce0', '#55607a', '#c9b48a'];
    const SKIN = ['#e0a878', '#f0c8a0', '#8d5a3a', '#d9a06a', '#c08a5e'];
    const HAIR = ['#3b2a1e', '#6b4a2b', '#16131a', '#c9a24a', '#2b2b33', '#55595f', '#a8552a', '#d9d4c7'];
    const half = CONFIG.peds.looks >> 1;
    s.peds = [];
    for (let i = 0; i < CONFIG.peds.looks; i++) {
      const woman = i >= half;
      const shirt = SHIRT[(i * 7 + 3) % SHIRT.length];
      const skin = SKIN[(i * 3) % SKIN.length];
      const hair = HAIR[(i * 5 + 1) % HAIR.length];
      const acc = woman ? [0, 2, 5, 4, 2, 5, 3][i % 7] : [0, 1, 3, 6, 0, 1, 4][i % 7];
      s.peds.push([0, 1].map((step) => sprite(20, 20, (g) => paintPed(g, shirt, skin, hair, step, acc))));
    }
    s.pedKinds = {};
    for (const k of Object.keys(CONFIG.peds.kinds)) {
      if (k === 'man' || k === 'woman') continue;
      s.pedKinds[k] = [0, 1].map((step) => sprite(34, 34, (g) => paintPedKind(g, k, step)));
    }
    s.simit = sprite(16, 16, paintSimit);
    s.lamp = glow(96, [[0, 'rgba(255,225,150,.75)'], [0.3, 'rgba(255,200,110,.3)'], [1, 'rgba(255,180,80,0)']]);
    s.win = glow(48, [[0, 'rgba(255,214,130,.95)'], [0.6, 'rgba(255,190,100,.35)'], [1, 'rgba(255,170,80,0)']]);
    s.neons = CONFIG.signs.neon.map((c) => glow(96, [[0, `${c}cc`], [0.45, `${c}55`], [1, `${c}00`]]));
    s.beam = sprite(150, 90, (g) => {
      const b = g.createLinearGradient(0, 0, 70, 0);
      b.addColorStop(0, 'rgba(255,245,200,.55)');
      b.addColorStop(1, 'rgba(255,245,200,0)');
      g.fillStyle = b;
      g.beginPath(); g.moveTo(0, -6); g.lineTo(72, -34); g.lineTo(72, 34); g.lineTo(0, 6); g.closePath(); g.fill();
    });
    s.lights = ['r', 'y', 'g'].map((st) => sprite(12, 26, (g) => paintLight(g, st)));
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
    s.props[PROP.CHAIRS] = prop(46, 46, (g) => {
      // Plastik masa ve dört sandalye, üstünde ince belli çay
      g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(-9, -7, 22, 22);
      for (const [x, y] of [[-14, 0], [14, 0], [0, -14], [0, 14]]) { g.fillStyle = '#d9281e'; rr(g, x - 5, y - 5, 10, 10, 2.5); g.fill(); g.fillStyle = '#f04a3e'; rr(g, x - 3, y - 3, 6, 6, 1.5); g.fill(); }
      g.fillStyle = '#f4f6f8'; rr(g, -9, -9, 18, 18, 3); g.fill();
      for (const [x, col] of [[-14, '#3e7cb1'], [14, '#8a5a3a']]) { g.fillStyle = col; g.beginPath(); g.ellipse(x, 0, 4, 5, 0, 0, 7); g.fill(); g.fillStyle = '#e0a878'; g.beginPath(); g.arc(x, 0, 2.5, 0, 7); g.fill(); }
      g.fillStyle = '#b5481f'; g.beginPath(); g.arc(-3, -2, 2.2, 0, 7); g.arc(4, 3, 2.2, 0, 7); g.fill();
    });
    s.props[PROP.QUEUE] = prop(76, 36, (g) => {
      // Mekân önü: siyah takım güvenlik ve sıra bekleyen kalabalık
      g.fillStyle = '#c62828'; g.fillRect(-34, -6, 12, 2);
      g.fillStyle = '#e8c547'; g.fillRect(-35, -8, 2, 6); g.fillRect(-23, -8, 2, 6);
      g.fillStyle = '#11131a'; g.beginPath(); g.ellipse(-30, 5, 6, 6.5, 0, 0, 7); g.fill();
      g.fillStyle = '#e0a878'; g.beginPath(); g.arc(-30, 5, 3, 0, 7); g.fill();
      const cols = ['#e8533f', '#3e7cb1', '#f2c14e', '#7a5ea8', '#4f9d69', '#e87ab0'];
      for (let i = 0; i < 6; i++) {
        g.fillStyle = cols[i]; g.beginPath(); g.ellipse(-14 + i * 9, (i % 2) * 3, 3.6, 4.6, 0, 0, 7); g.fill();
        g.fillStyle = i % 3 ? '#e0a878' : '#8d5a3a'; g.beginPath(); g.arc(-14 + i * 9, (i % 2) * 3, 2, 0, 7); g.fill();
      }
    });
    s.props[PROP.UNCLES] = prop(52, 40, (g) => {
      // Apartman önünde iki amca ve tabure
      for (const [x, col] of [[-10, '#5c6b7a'], [10, '#7a6a55']]) {
        g.fillStyle = '#6b4a2b'; rr(g, x - 6, -5, 12, 11, 2); g.fill();
        g.fillStyle = col; g.beginPath(); g.ellipse(x, 1, 6, 5.4, 0, 0, 7); g.fill();
        g.fillStyle = '#e0a878'; g.beginPath(); g.arc(x, -1, 3, 0, 7); g.fill();
        g.fillStyle = '#dfe3e8'; g.beginPath(); g.arc(x - 0.6, -1.4, 2.2, 0, 7); g.fill();
      }
      g.fillStyle = '#c9622b'; g.beginPath(); g.arc(0, 2, 1.8, 0, 7); g.fill();
    });
    s.props[PROP.SIMITCART] = prop(44, 36, (g) => {
      g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(-14, -7, 32, 20);
      g.fillStyle = '#c62828'; rr(g, -16, -10, 32, 20, 3); g.fill();
      g.fillStyle = '#f5e6b8'; rr(g, -13, -7, 26, 14, 2); g.fill();
      for (const [x, y] of [[-8, -3], [0, -3], [8, -3], [-4, 3], [4, 3]]) { g.strokeStyle = '#b5742a'; g.lineWidth = 2.4; g.beginPath(); g.arc(x, y, 2.6, 0, 7); g.stroke(); }
    });
    s.props[PROP.STALL] = prop(46, 40, (g) => {
      g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(-15, -10, 36, 26);
      for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#fff' : '#1d9a4f'; g.fillRect(-18 + i * 6, -13, 6, 26); }
      g.fillStyle = 'rgba(0,0,0,.1)'; g.fillRect(-18, 3, 36, 10);
      for (const [x, y, col] of [[-9, -5, '#e8352e'], [0, 2, '#ff9d1a'], [9, -6, '#7fc241'], [-5, 5, '#ffd23f']]) { g.fillStyle = col; g.beginPath(); g.arc(x, y, 3, 0, 7); g.fill(); }
    });
    s.props[PROP.LAUNDRY] = prop(90, 26, (g) => {
      // Sokak üstünde ip: yukarıdan görünen çamaşırlar
      g.strokeStyle = 'rgba(255,255,255,.75)'; g.lineWidth = 1; g.beginPath(); g.moveTo(-42, -2); g.quadraticCurveTo(0, 3, 42, -2); g.stroke();
      const cols = ['#f4f6f8', '#e8533f', '#3e7cb1', '#f2c14e', '#7a5ea8', '#4f9d69'];
      for (let i = 0; i < 6; i++) { g.fillStyle = cols[i]; g.fillRect(-34 + i * 12, -1, 9, 9 + (i % 2) * 3); }
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
        const k2 = TALL_STYLES.has(r.style) ? 2.4 : shadowOf(r);
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
    const colors = [pal.grass, pal.road, '#cdd2d6', '#e5d7bf', shore, pal.sand, pal.dirt, '#5fd3e6', '#c9ae4c', '#8b8e8f'];
    const roads = this.roads[urban ? c.road : 0];
    const alleys = this.alleys[c.alley];
    const fieldGreen = (c.cx + c.cy) & 1;
    for (let y = 0; y < CT; y++) {
      for (let x = 0; x < CT; x++) {
        const t = c.ground[y * CT + x];
        g.fillStyle = colors[t];
        const px = c.x + x * TILE;
        const py = c.y + y * TILE;
        g.fillRect(px, py, TILE + 1, TILE + 1);
        const h = ((x * 73856093) ^ (y * 19349663) ^ (c.cx * 83492791) ^ (c.cy * 49979693)) >>> 0;
        if (t === GROUND.ROAD) { g.drawImage(roads[h & 3], px, py, TILE + 1, TILE + 1); continue; }
        if (t === GROUND.ALLEY) { g.drawImage(alleys[h & 3], px, py, TILE + 1, TILE + 1); continue; }
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
        }
      }
    }
    // Kavşak öncesi dur çizgileri
    if (urban) {
      g.fillStyle = 'rgba(255,255,255,.85)';
      g.fillRect(c.x + 4, c.y + ART_W + 24, ART_W / 2 - 6, 4);
      g.fillRect(c.x + ART_W + 24, c.y + ART_W / 2 + 2, 4, ART_W / 2 - 6);
      g.fillRect(c.x + ART_W / 2 + 2, c.y - 28, ART_W / 2 - 6, 4);
      g.fillRect(c.x - 28, c.y + 4, 4, ART_W / 2 - 6);
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
    // Yol kenarı: dar taş kaldırım bandı (sürülebilir) ve bordür
    const K = 11;
    const stone = urban || sea ? '#c6cace' : 'rgba(0,0,0,.2)';
    const lip = urban || sea ? '#eef1f4' : 'rgba(0,0,0,.25)';
    const open = (t) => t !== GROUND.ROAD && t !== GROUND.ALLEY;
    const edge = (px, py, dx, dy) => {
      g.fillStyle = stone;
      if (dx > 0) g.fillRect(px + TILE - K, py, K, TILE);
      if (dx < 0) g.fillRect(px, py, K, TILE);
      if (dy > 0) g.fillRect(px, py + TILE - K, TILE, K);
      if (dy < 0) g.fillRect(px, py, TILE, K);
      g.fillStyle = lip;
      if (dx > 0) g.fillRect(px + TILE - K, py, 2, TILE);
      if (dx < 0) g.fillRect(px + K - 2, py, 2, TILE);
      if (dy > 0) g.fillRect(px, py + TILE - K, TILE, 2);
      if (dy < 0) g.fillRect(px, py + K - 2, TILE, 2);
    };
    for (let y = 0; y < CT; y++) {
      for (let x = 0; x < CT; x++) {
        if (c.ground[y * CT + x] !== GROUND.ROAD) continue;
        const px = c.x + x * TILE;
        const py = c.y + y * TILE;
        if (x < CT - 1 && open(c.ground[y * CT + x + 1])) edge(px, py, 1, 0);
        if (y < CT - 1 && open(c.ground[(y + 1) * CT + x])) edge(px, py, 0, 1);
      }
    }
    // Ana yol kenar çizgileri, kesik orta şerit, yön okları
    const mid = ART_W / 2;
    const yellow = '#ffd23f';
    for (let d = ART_W + 30; d < CHUNK - 40; d += 56) {
      g.fillStyle = yellow;
      g.fillRect(c.x + mid - 2, c.y + d, 4, 30);
      g.fillRect(c.x + d, c.y + mid - 2, 30, 4);
    }
    if (urban) {
      g.fillStyle = 'rgba(255,255,255,.75)';
      const arrow = (x, y, a) => {
        g.save(); g.translate(x, y); g.rotate(a);
        g.fillRect(-14, -2, 18, 4);
        g.beginPath(); g.moveTo(4, -7); g.lineTo(16, 0); g.lineTo(4, 7); g.closePath(); g.fill();
        g.restore();
      };
      const q = ART_W * 0.25;
      arrow(c.x + q, c.y + ART_W + 90, Math.PI / 2 * -1);
      arrow(c.x + ART_W - q, c.y + CHUNK - 90, Math.PI / 2);
      arrow(c.x + ART_W + 90, c.y + ART_W - q, 0);
      arrow(c.x + CHUNK - 90, c.y + q, Math.PI);
      this.bakeSigns(g, c);
    }
    g.fillStyle = 'rgba(255,255,255,.8)';
    for (let i = 8; i < ART_W - 8 && urban; i += 18) {
      g.fillRect(c.x + i, c.y + ART_W + 4, 9, 18);
      g.fillRect(c.x + ART_W + 4, c.y + i, 18, 9);
      g.fillRect(c.x + i, c.y - 22, 9, 18);
      g.fillRect(c.x - 22, c.y + i, 18, 9);
    }
    this.bakePads(g, c);
  }

  // Trafik levhaları: pişirilir, oyun sırasında maliyeti yoktur
  bakeSigns(g, c) {
    const post = (x, y, draw) => {
      g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(x + 3, y + 4, 8, 4, 0, 0, 7); g.fill();
      g.save(); g.translate(x, y); draw(); g.restore();
    };
    const round = (bg, ring, text) => () => {
      g.fillStyle = bg; g.beginPath(); g.arc(0, 0, 8.5, 0, 7); g.fill();
      g.lineWidth = 2.4; g.strokeStyle = ring; g.stroke();
      g.fillStyle = '#16181c'; g.font = '900 9px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(text, 0, 0.5);
    };
    const tri = (sym) => () => {
      g.fillStyle = '#fff'; g.beginPath(); g.moveTo(0, -10); g.lineTo(10, 8); g.lineTo(-10, 8); g.closePath(); g.fill();
      g.lineWidth = 2.4; g.strokeStyle = '#d0121b'; g.stroke();
      g.fillStyle = '#16181c'; g.font = '900 10px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(sym, 0, 2);
    };
    const stop = () => {
      g.fillStyle = '#d0121b'; g.beginPath();
      for (let i = 0; i < 8; i++) { const a = 0.39 + (i / 8) * 6.283; g.lineTo(Math.cos(a) * 9.5, Math.sin(a) * 9.5); }
      g.closePath(); g.fill();
      g.fillStyle = '#fff'; g.font = '900 7px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('DUR', 0, 0.5);
    };
    const panel = (t) => () => {
      g.font = '800 9px Nunito, sans-serif';
      const w = g.measureText(t).width + 10;
      g.fillStyle = '#0a4ea2'; g.fillRect(-w / 2, -7, w, 14);
      g.strokeStyle = '#fff'; g.lineWidth = 1; g.strokeRect(-w / 2 + 1, -6, w - 2, 12);
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, 0, 0.5);
    };
    const DIR = ['← KADIKÖY', 'BEŞİKTAŞ →', '↑ TAKSİM', 'ÜSKÜDAR →', '← ŞİŞLİ', 'SARIYER →', '↑ BOĞAZ KÖPRÜSÜ', '← FATİH', 'BAKIRKÖY →'];
    const h = (Math.imul(c.cx, 73856093) ^ Math.imul(c.cy, 19349663)) >>> 0;
    const list = [round('#fff', '#d0121b', String(30 + (h % 4) * 10)), tri('!'), tri('⚠'), round('#fff', '#d0121b', '50'), stop];
    const E = ART_W - 6;
    post(c.x + E, c.y + ART_W + 44, stop);
    post(c.x + ART_W + 44, c.y + E, list[h % 5]);
    post(c.x + E, c.y + CHUNK * 0.55, panel(DIR[h % DIR.length]));
    post(c.x + CHUNK * 0.55, c.y + E, panel(DIR[(h >>> 4) % DIR.length]));
    post(c.x + E, c.y + CHUNK * 0.8, list[(h >>> 3) % 5]);
    post(c.x + CHUNK * 0.8, c.y + E, list[(h >>> 6) % 5]);
    // Ara sokak ağzı: tek yön ya da çıkmaz uyarısı
    for (let i = 0; i < c.streetCount; i++) {
      const s = c.streets[i];
      if (s.ground !== GROUND.ALLEY) continue;
      const at = (s.pos + s.width / 2) * TILE;
      const sign = i % 2 ? round('#2a6fd6', '#fff', '⇧') : tri('Y');
      if (s.vertical) post(c.x + at + 13, c.y + ART_W - 5, sign);
      else post(c.x + ART_W - 5, c.y + at + 13, sign);
    }
    // Yaya geçitleri ara sokak ağızlarında
    g.fillStyle = 'rgba(255,255,255,.7)';
    for (let i = 0; i < c.streetCount; i++) {
      const s = c.streets[i];
      if (s.ground !== GROUND.ALLEY) continue;
      const a = s.pos * TILE + 4;
      const b = (s.pos + s.width) * TILE - 4;
      for (let k = a; k < b; k += 12) {
        if (s.vertical) g.fillRect(c.x + k, c.y + ART_W + 3, 6, 15);
        else g.fillRect(c.x + ART_W + 3, c.y + k, 15, 6);
      }
    }
  }

  // Açık alanlar: spor sahaları, avlu, otopark, ambulans alanı, okul bahçesi
  bakePads(g, c) {
    for (let i = 0; i < c.padCount; i++) {
      const p = c.pads[i];
      const x = c.x + p.tx * TILE + 3;
      const y = c.y + p.ty * TILE + 3;
      const w = p.w * TILE - 6;
      const h = p.h * TILE - 6;
      if (p.kind === 'foot' || p.kind === 'hali') {
        const hali = p.kind === 'hali';
        const n = hali ? 6 : 10;
        for (let k = 0; k < n; k++) { g.fillStyle = k % 2 ? (hali ? '#2fa654' : '#46a84a') : (hali ? '#27934a' : '#3e9a44'); g.fillRect(x + (k * w) / n, y, w / n + 0.5, h); }
        g.strokeStyle = '#fff'; g.lineWidth = 2.5;
        g.strokeRect(x + 6, y + 6, w - 12, h - 12);
        g.beginPath(); g.moveTo(x + w / 2, y + 6); g.lineTo(x + w / 2, y + h - 6); g.stroke();
        g.beginPath(); g.arc(x + w / 2, y + h / 2, h * 0.17, 0, 7); g.stroke();
        for (const s of [0, 1]) {
          const bx = s ? x + w - 6 - w * 0.13 : x + 6;
          g.strokeRect(bx, y + h * 0.24, w * 0.13, h * 0.52);
          g.fillStyle = '#fff'; g.fillRect(s ? x + w - 6 : x + 2, y + h * 0.42, 4, h * 0.16);
        }
        if (hali) { g.strokeStyle = 'rgba(240,244,248,.55)'; g.lineWidth = 1; for (let k = 0; k <= w; k += 12) { g.beginPath(); g.moveTo(x + k, y); g.lineTo(x + k, y + h); g.stroke(); } for (let k = 0; k <= h; k += 12) { g.beginPath(); g.moveTo(x, y + k); g.lineTo(x + w, y + k); g.stroke(); } }
        g.strokeStyle = 'rgba(40,50,60,.8)'; g.lineWidth = 2; g.strokeRect(x, y, w, h);
      } else if (p.kind === 'basket') {
        g.fillStyle = '#c8682e'; g.fillRect(x, y, w, h);
        g.fillStyle = '#2f6fb0'; g.fillRect(x + 8, y + 8, w - 16, h - 16);
        g.strokeStyle = '#fff'; g.lineWidth = 2;
        g.strokeRect(x + 8, y + 8, w - 16, h - 16);
        g.beginPath(); g.moveTo(x + w / 2, y + 8); g.lineTo(x + w / 2, y + h - 8); g.stroke();
        g.beginPath(); g.arc(x + w / 2, y + h / 2, h * 0.14, 0, 7); g.stroke();
        for (const s of [0, 1]) {
          const px = s ? x + w - 8 : x + 8;
          g.beginPath(); g.arc(px, y + h / 2, h * 0.32, s ? 1.57 : -1.57, s ? 4.71 : 1.57); g.stroke();
          g.fillStyle = '#ff7a1a'; g.beginPath(); g.arc(px + (s ? -8 : 8), y + h / 2, 3.4, 0, 7); g.fill();
        }
      } else if (p.kind === 'yard') {
        g.fillStyle = '#c9b48a'; g.fillRect(x, y, w, h);
        g.strokeStyle = '#fff'; g.lineWidth = 2; g.strokeRect(x + w * 0.1, y + h * 0.2, w * 0.5, h * 0.6);
        g.beginPath(); g.arc(x + w * 0.35, y + h / 2, h * 0.14, 0, 7); g.stroke();
        // Bayrak direği ve Türk bayrağı
        const fx = x + w * 0.8; const fy = y + h * 0.3;
        g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(fx, fy, 30, 2);
        g.fillStyle = '#dfe3e8'; g.beginPath(); g.arc(fx, fy, 3, 0, 7); g.fill();
        g.fillStyle = '#e30a17'; g.fillRect(fx + 3, fy - 12, 26, 15);
        g.fillStyle = '#fff'; g.beginPath(); g.arc(fx + 12, fy - 4.5, 4.6, 0, 7); g.fill();
        g.fillStyle = '#e30a17'; g.beginPath(); g.arc(fx + 13.4, fy - 4.5, 3.8, 0, 7); g.fill();
        g.fillStyle = '#fff'; g.fillRect(fx + 17, fy - 6, 3, 3);
        g.fillStyle = '#4f9a3a'; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(x + 10 + k * (w / 6), y + h - 7, 6, 0, 7); g.fill(); }
      } else if (p.kind === 'ambulance') {
        g.fillStyle = '#b9bec4'; g.fillRect(x, y, w, h);
        g.strokeStyle = '#fff'; g.lineWidth = 2;
        for (let k = 0; k < 7; k++) { g.beginPath(); g.moveTo(x + 14 + k * 34, y + 4); g.lineTo(x + 14 + k * 34, y + 40); g.stroke(); }
        g.fillStyle = '#d0121b'; g.fillRect(x + w * 0.4, y, w * 0.2, h);
        g.fillStyle = '#fff'; g.font = '900 13px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('AMBULANS', x + w * 0.5, y + h / 2);
        const am = this.sprites.parked && this.sprites.ambulance;
        if (am) g.drawImage(am, x + 22, y + 8, 54, 24);
      } else if (p.kind === 'parking') {
        g.fillStyle = '#7c7f82'; g.fillRect(x, y, w, h);
        g.strokeStyle = '#fff'; g.lineWidth = 1.5;
        for (let k = 0; k < w; k += 40) { g.beginPath(); g.moveTo(x + k, y); g.lineTo(x + k, y + 34); g.stroke(); }
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
    if (paintBuilding2(g, r)) { this.bakeSign(g, r); return; }
    if (r.style >= 7) { paintSpecial(g, r); this.bakeSign(g, r); return; }
    this.bakeRoof(g, r);
    this.bakeSign(g, r);
  }

  bakeRoof(g, r) {
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

  // Tabela, uydu çanağı, güneş paneli ve balkon çamaşırı
  bakeSign(g, r) {
    if (r.style === 0 || r.style === 1 || r.style === 2 || r.style === 3 || r.style === 5 || r.style === BUILD.APARTMENT) roofClutter(g, r);
    if (!r.sign) return;
    const img = signCanvas(r.sign, r.signColor, r.seed);
    const b = signBox(r, img);
    g.drawImage(img, b.x, b.y, b.w, b.h);
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
    this.drawUfos(game, now, vx0, vx1, vy0, vy1);
    this.drawProps(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now, true);
    this.drawPeds(game, vx0, vx1, vy0, vy1, true);
    this.drawLights(game, c0x, c1x, c0y, c1y);
    this.drawParticles(game, vx0, vx1, vy0, vy1);
    this.drawNight(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now);
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
          const isTall = pr.kind === PROP.QUEUE || pr.kind === PROP.TREE || pr.kind === PROP.PALM || pr.kind === PROP.PINE || pr.kind === PROP.LAUNDRY;
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
          const w = img.wu || img.width / SPR;
          const h = img.hu || img.height / SPR;
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
      const frame = Math.floor(p.step) & 1;
      const plain = p.kind === 'man' || p.kind === 'woman';
      const img = plain ? sp.peds[p.look][frame] : sp.pedKinds[p.kind][frame];
      const k = (1 + p.z / 170) * p.scale;
      const size = (plain ? 27 : 46) * k;
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

  // Trafik ışıkları yalnızca şehir kavşaklarında, köşelere çizilir
  drawLights(game, c0x, c1x, c0y, c1y) {
    const ctx = this.ctx;
    const sp = this.sprites.lights;
    const clock = game.crowd.clock;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    const idx = (st) => (st === 'r' ? 0 : st === 'y' ? 1 : 2);
    for (let cy = c0y; cy <= c1y + 1; cy++) {
      for (let cx = c0x; cx <= c1x + 1; cx++) {
        const c = game.world.chunk(cx, cy);
        if (c.biome !== 'city') continue;
        const ew = sp[idx(lightState(clock, cx, cy, 0))];
        const ns = sp[idx(lightState(clock, cx, cy, 1))];
        ctx.drawImage(ew, c.x - 22, c.y - 34, 12, 26);
        ctx.drawImage(ew, c.x + ART_W + 10, c.y + ART_W + 8, 12, 26);
        ctx.drawImage(ns, c.x + ART_W + 10, c.y - 34, 12, 26);
        ctx.drawImage(ns, c.x - 22, c.y + ART_W + 8, 12, 26);
      }
    }
  }

  // Gece-gündüz: ekranın üstüne yumuşak renk, ardından ışıklar eklenir
  drawNight(game, c0x, c1x, c0y, c1y, x0, x1, y0, y1, now) {
    const ctx = this.ctx;
    const d = game.daylight;
    if (d.a < 0.01) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = `rgba(${d.r},${d.g},${d.b},${d.a})`;
    ctx.fillRect(0, 0, this.w * this.dpr, this.h * this.dpr);
    const night = d.k;
    if (night < 0.05) return;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    const sp = this.sprites;
    ctx.globalCompositeOperation = 'lighter';
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = game.world.chunk(cx, cy);
        for (let i = 0; i < c.lightCount; i++) {
          const l = c.lights[i];
          if (l.x + l.w < x0 - 60 || l.x > x1 + 60 || l.y + l.h < y0 - 60 || l.y > y1 + 60) continue;
          if (l.kind === 0) {
            ctx.globalAlpha = night * 0.85;
            ctx.drawImage(sp.lamp, l.x - 70, l.y - 70, 140, 140);
          } else if (l.kind === 1) {
            if (!l.rect.alive || (l.rect.seed + i) % 3 === 0) continue; // Bazı evlerde ışık kapalı
            ctx.globalAlpha = night * 0.8;
            ctx.drawImage(sp.win, l.x, l.y, l.w, l.h);
          } else if (l.kind === 2) {
            if (!l.rect.alive) continue;
            ctx.globalAlpha = night * (0.65 + 0.3 * Math.sin(now * 0.006 + l.x));
            ctx.drawImage(sp.neons[l.rect.seed % sp.neons.length], l.x - 50, l.y - 50, l.w + 100, l.h + 100);
          }
        }
      }
    }
    ctx.globalCompositeOperation = 'source-over';
    // Tabelalar gece aydınlık kalır
    ctx.globalAlpha = night * 0.9;
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = game.world.chunk(cx, cy);
        for (let i = 0; i < c.lightCount; i++) {
          const l = c.lights[i];
          if (l.kind < 2 || !l.rect.alive || l.x + l.w < x0 || l.x > x1 || l.y + l.h < y0 || l.y > y1) continue;
          const r = l.rect;
          const img = signCanvas(r.sign, r.signColor, r.seed);
          const b = signBox(r, img);
          ctx.drawImage(img, b.x, b.y, b.w, b.h);
        }
      }
    }
    // Araç farları
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = night * 0.9;
    const beam = sp.beam;
    const bw = beam.width / SPR;
    const bh = beam.height / SPR;
    const head = (b) => {
      if (b.x < x0 - 120 || b.x > x1 + 120 || b.y < y0 - 120 || b.y > y1 + 120) return;
      this.place(b.x + Math.cos(b.a) * b.len * 0.46, b.y + Math.sin(b.a) * b.len * 0.46, b.a);
      ctx.drawImage(beam, -bw / 2, -bh / 2, bw, bh);
    };
    if (game.state === 'play') head(game.player);
    for (const c of game.cops) if (c.type !== 'tank' && !c.flying) head(c);
    for (const n of game.crowd.npcs) if (n.alive && n.state === 'drive') head(n);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawNpcs(game, x0, x1, y0, y1) {
    const sp = this.sprites.npc;
    const fins = CONFIG.npc.finishes;
    for (const n of game.crowd.npcs) {
      if (!n.alive || n.x < x0 - 80 || n.x > x1 + 80 || n.y < y0 - 80 || n.y > y1 + 80) continue;
      const key = `${n.kind}${n.color}`;
      let img = sp[key];
      if (!img) {
        const spec = n.spec;
        img = sheetSprite(`npc:${n.kind}:${n.color}`, spec.len) || sprite(spec.len + 8, spec.wid + 10, (g) => paintNpc(g, n.kind, spec, spec.colors[n.color], fins[n.color % fins.length]));
        sp[key] = img;
      }
      this.drawBody(img, n);
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
    const w = (img.wu || img.width / SPR) * k;
    const h = (img.hu || img.height / SPR) * k;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  }

  drawPlayer(game) {
    const ctx = this.ctx;
    const p = game.player;
    const pid = `${game.carSpec.id}:${game.paint || 0}`;
    if (this.playerId !== pid) {
      this.playerId = pid;
      this.playerSprite = carSprite(game.carSpec, game.paint || 0);
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
    const sink = game.sinkProgress();
    if (sink > 0) {
      // Çizgi film batışı: küçülür, maviye gömülür
      const q = k * (1 - CONFIG.water.shrink * sink);
      this.place(p.x, p.y, p.a);
      ctx.globalAlpha = 1 - sink * 0.92;
      const w = (this.playerSprite.wu || this.playerSprite.width / SPR) * q;
      const h = (this.playerSprite.hu || this.playerSprite.height / SPR) * q;
      ctx.drawImage(this.playerSprite, -w / 2, -h / 2, w, h);
      ctx.globalAlpha = sink * 0.75;
      ctx.drawImage(this.sprites.water, -w * 0.7, -w * 0.7, w * 1.4, w * 1.4);
      ctx.globalAlpha = 1;
      ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
      return;
    }
    this.drawBody(this.playerSprite, p, k, k);
    ctx.globalAlpha = 1;
    if (game.stage >= 2) {
      ctx.globalAlpha = game.stage >= 3 ? 0.42 : 0.22;
      ctx.drawImage(this.sprites.dark, -p.len * 0.2, -p.wid * 0.9, p.len, p.wid * 1.8);
      ctx.globalAlpha = 1;
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  // Uçan daireler en üstte: gölgesi yerde, ışını oyuncunun üstünde
  drawUfos(game, now, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const sp = this.sprites;
    for (const c of game.cops) {
      if (!c.flying || c.x < x0 - 200 || c.x > x1 + 200 || c.y < y0 - 200 || c.y > y1 + 200) continue;
      const R = c.len / 2;
      ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
      ctx.globalAlpha = 0.3;
      ctx.drawImage(sp.dark, c.x + 16, c.y + 44, R * 2.1, R * 1.6);
      if (c.beam) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = 0.5 + 0.2 * Math.sin(now * 0.03);
        ctx.fillStyle = '#39ff9c';
        ctx.beginPath(); ctx.moveTo(c.x - 16, c.y); ctx.lineTo(c.x + 16, c.y); ctx.lineTo(game.player.x + 42, game.player.y); ctx.lineTo(game.player.x - 42, game.player.y); ctx.closePath(); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
      this.place(c.x, c.y - 10, c.a);
      const w = sp.ufo.width / SPR;
      ctx.drawImage(sp.ufo, -w / 2, -w / 2, w, w);
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawCops(game, now, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const sp = this.sprites;
    for (const c of game.cops) {
      if (c.flying) continue;
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
      if (k === FX.SIMIT) {
        const q = size[i];
        ctx.globalAlpha = Math.min(1, t * 2.5);
        ctx.drawImage(sp.simit, x[i] - q, y[i] - q, q * 2, q * 2);
        continue;
      }
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
      if (c.type === 'tank' || c.flying || c.type === 'rover' || game.ghostT > 0) continue;
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
    this.last = 'R'; // Son basılan yön: iki parmak kısa süre çakışınca bu kazanır
    this.bothT = 0;
  }

  // Her fizik adımında çağrılır
  tick(dt) {
    this.bothT = this.left && this.right ? this.bothT + dt : 0;
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
    return this.bothT >= CONFIG.input.bothDelay;
  }

  get steer() {
    const l = this.left;
    const r = this.right;
    if (!l && !r) return 0;
    if (l && r) return this.reverse ? 0 : this.last === 'R' ? 1 : -1;
    return r ? 1 : -1;
  }

  press(id, side) {
    this.touches.set(id, side);
    this.last = side;
  }

  release(id) {
    this.touches.delete(id);
  }

  clear() {
    this.touches.clear();
    this.keyL = false;
    this.keyR = false;
    this.bothT = 0;
  }

  sideOf(x) {
    return x < this.width / 2 ? 'L' : 'R';
  }

  key(code, down) {
    if (code === 'ArrowLeft' || code === 'KeyA') { this.keyL = down; if (down) this.last = 'L'; return true; }
    if (code === 'ArrowRight' || code === 'KeyD') { this.keyR = down; if (down) this.last = 'R'; return true; }
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

const KEY = 'kac-kacabilirsen-v1'; // Eski adla kalır: mevcut coin ve rekorlar kaybolmasın

function defaultSave() {
  return {
    bestScore: 0,
    bestTime: 0,
    coins: 0,
    owned: [CONFIG.cars[0].id],
    selected: CONFIG.cars[0].id,
    settings: { sound: true, vibrate: true, ambient: true },
    dev: { god: false, startTime: 0 },
    tutorial: false,
    paints: {},
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
    d.settings.ambient = data.settings.ambient !== false;
  }
  if (data.dev) {
    d.dev.god = data.dev.god === true;
    d.dev.startTime = num(data.dev.startTime);
  }
  d.tutorial = data.tutorial === true;
  if (data.paints && typeof data.paints === 'object') {
    for (const c of CONFIG.cars) {
      const i = data.paints[c.id];
      if (Number.isInteger(i) && i >= 0 && i < c.paints.length) d.paints[c.id] = i;
    }
  }
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

  paintIndex(id) {
    return (this.data.paints && this.data.paints[id]) || 0;
  }

  setPaint(id, i) {
    if (!this.data.paints) this.data.paints = {};
    this.data.paints[id] = i;
    this.save();
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
    this.ambientOn = true;
    this.ambT = 2;
    this.engine = { base: 46, range: 150, wave: 'sawtooth', sub: 1.5, gain: 1 };
    this.coinStreak = 0;
    this.coinAt = 0;
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

    // Sokak uğultusu: çok kısık alçak gürültü
    const ambSrc = ctx.createBufferSource();
    ambSrc.buffer = this.noise;
    ambSrc.loop = true;
    const ambF = ctx.createBiquadFilter();
    ambF.type = 'lowpass';
    ambF.frequency.value = 420;
    this.ambGain = ctx.createGain();
    this.ambGain.gain.value = this.ambientOn ? 0.035 : 0;
    ambSrc.connect(ambF);
    ambF.connect(this.ambGain);
    this.ambGain.connect(this.master);
    ambSrc.start();
    this.setEngine(this.engine);

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
    makeVoice('euro', 'square', 760);
    makeVoice('rumble', 'sawtooth', 300);
    makeVoice('horn', 'sawtooth', 480);
    makeVoice('bip', 'square', 1700);
    makeVoice('pulse', 'sawtooth', 900);
    makeVoice('warble', 'triangle', 1400);
    makeVoice('ufo', 'sine', 1300);
    makeVoice('zap', 'sawtooth', 2100);
    this.radioT = 6;
  }

  setEngine(e) {
    this.engine = e;
    if (!this.eng1) return;
    this.eng1.type = e.wave;
    this.eng2.type = e.wave === 'sine' ? 'sine' : 'square';
  }

  setAmbient(on) {
    this.ambientOn = on;
    if (this.ambGain) this.ambGain.gain.setTargetAtTime(on ? 0.035 : 0, this.ctx.currentTime, 0.2);
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
    const e = this.engine;
    const base = e.base + e.range * k + (p.drifting ? e.range * 0.22 : 0);
    this.eng1.frequency.setTargetAtTime(base, t, 0.06);
    this.eng2.frequency.setTargetAtTime(base * e.sub, t, 0.06);
    this.engFilter.frequency.setTargetAtTime(300 + 1300 * k, t, 0.08);
    this.engGain.gain.setTargetAtTime(on ? (0.05 + 0.09 * k) * e.gain : 0, t, 0.08);

    // Ara sıra sokak sesleri
    if (this.ambientOn && this.enabled) {
      this.ambT -= Math.min(0.05, (now - (this.ambNow || now)) / 1000);
      this.ambNow = now;
      if (this.ambT <= 0) {
        this.ambT = 2.5 + Math.random() * 6;
        this.streetSound();
      }
    }

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
    const setVoice = (name, freq, gate = 1) => {
      const v = this.voices[name];
      const d = S[CONFIG.sirens.indexOf(name)];
      if (on && d < 1300 && gate) {
        const vol = 1 - d / 1300;
        v.osc.frequency.setTargetAtTime(freq * doppler, t, 0.02);
        v.gain.gain.setTargetAtTime((0.018 + vol * vol * 0.062) * quiet, t, 0.04);
      } else {
        v.gain.gain.setTargetAtTime(0, t, gate ? 0.15 : 0.02);
      }
    };
    setVoice('wail', 680 + 760 * (0.5 - 0.5 * Math.cos((sec / 3.6) * 6.283))); // Yavaş uluma
    setVoice('yelp', 760 + 720 * (0.5 + 0.5 * Math.sin(sec * 19))); // Hızlı yelp
    setVoice('hilo', Math.floor(sec / 0.62) % 2 ? 640 : 475); // Ağır araç iki tonlu
    setVoice('chirp', 1300 + 900 * (sec * 9 - Math.floor(sec * 9))); // Motosiklet kesik siren
    setVoice('euro', Math.floor(sec / 0.42) % 2 ? 580 : 435); // Hızlı iki ton
    setVoice('rumble', 170 + 130 * Math.abs(Math.sin(sec * 2.2))); // Tok gürültü
    setVoice('horn', 330, Math.floor(sec * 2.6) % 3 === 0 ? 1 : 0); // Hava kornası
    setVoice('bip', 1760, Math.floor(sec * 7) % 4 === 0 ? 1 : 0); // Megafon bip
    setVoice('pulse', 900, Math.floor(sec * 12) % 2 ? 1 : 0); // Kesik nabız
    setVoice('warble', 1050 + 340 * Math.sin(sec * 36), Math.floor(sec * 1.6) % 2 ? 1 : 0); // Titrek çift ton
    setVoice('ufo', 880 + 620 * Math.sin(sec * 5.4) * Math.sin(sec * 0.9)); // Bilim kurgu teremin
    setVoice('zap', 2600 - 2100 * (sec * 3 - Math.floor(sec * 3))); // Lazer süpürmesi

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

  // Suya düşüş: gümbürtü, sıçrama ve yükselen kabarcıklar
  sink() {
    this.splash();
    this.tone(95, 0.5, 0.3, 'sine', 45);
    this.burst(0.8, 1600, 0.4, 'lowpass', 180);
    for (let i = 0; i < 16; i++) {
      const f = 240 + Math.random() * 520;
      this.tone(f, 0.09, 0.05, 'sine', f * 2.1, 0.25 + i * 0.1);
    }
  }

  crash(k) {
    const r = Math.random();
    this.burst(0.2 + k * 0.2, 700 + k * (r < 0.5 ? 1000 : 1900), 0.3 + k * 0.5, 'lowpass', 160);
    this.tone(120 + r * 90, 0.14, 0.2 * k + 0.08, 'square', 55);
    if (k > 0.3) {
      if (r < 0.4) this.metal(k);
      else if (r < 0.7) this.glass(k);
      else this.tone(90, 0.3, 0.2 * k, 'sawtooth', 40); // Gövde gümbürtüsü
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

  // Ortam: kuş, uzak korna, çay kaşığı, uzaktan seslenen satıcı
  streetSound() {
    const r = Math.random();
    if (r < 0.34) {
      // Kuş cıvıltısı
      const f = 2600 + Math.random() * 1400;
      for (let i = 0; i < 3; i++) this.tone(f, 0.08, 0.018, 'sine', f * 1.3, i * 0.13);
    } else if (r < 0.58) {
      // Uzak korna
      this.tone(380, 0.28, 0.018, 'square');
      this.tone(478, 0.28, 0.015, 'square');
    } else if (r < 0.8) {
      // Bardakta çay kaşığı
      for (let i = 0; i < 3; i++) this.tone(3400 + Math.random() * 500, 0.05, 0.025, 'sine', 0, i * 0.11);
    } else {
      // Satıcı sesi: iki uzun hece
      this.tone(240, 0.4, 0.02, 'sawtooth', 300);
      this.tone(300, 0.6, 0.02, 'sawtooth', 210, 0.42);
    }
  }

  // Sentez bağırma: testere sesi, gırtlak bantları, titreme. Sesler kişiye göre değişir
  scream(k = 1, voice = 'man') {
    const c = this.ctx;
    if (!c || !this.enabled) return;
    if (voice === 'cat') { this.meow(k); return; }
    const t = c.currentTime;
    const P = {
      man: { pitch: [170, 210, 250], form: [650, 1150, 2400], rise: 1.3, vib: 0.03, dur: 0.5 },
      woman: { pitch: [380, 460, 560], form: [900, 1700, 3000], rise: 1.5, vib: 0.04, dur: 0.6 },
      child: { pitch: [620, 740, 860], form: [1100, 2100, 3500], rise: 1.6, vib: 0.05, dur: 0.45 },
      old: { pitch: [150, 180, 215], form: [550, 1000, 2100], rise: 1.15, vib: 0.1, dur: 0.75 },
      teen: { pitch: [260, 320, 400], form: [800, 1500, 2700], rise: 1.8, vib: 0.05, dur: 0.4 },
      grandma: { pitch: [290, 340, 390], form: [780, 1350, 2500], rise: 1.2, vib: 0.14, dur: 0.8 },
      tourist: { pitch: [230, 300, 480], form: [700, 1800, 2900], rise: 1.05, vib: 0.02, dur: 0.55 },
      simit: { pitch: [195, 235], form: [600, 1400, 2300], rise: 1.7, vib: 0.08, dur: 0.85 }, // Uzun satıcı nidası
      mom: { pitch: [420, 500], form: [950, 1500, 3200], rise: 1.9, vib: 0.06, dur: 0.5 },
      wheel: { pitch: [135, 160], form: [500, 900, 1900], rise: 1.1, vib: 0.16, dur: 0.9 },
      bike: { pitch: [300, 350], form: [850, 1600, 2600], rise: 1.35, vib: 0.02, dur: 0.3 },
      courier: { pitch: [225, 275], form: [720, 1300, 2300], rise: 2, vib: 0.01, dur: 0.28 },
      cayci: { pitch: [190, 240], form: [640, 1050, 2100], rise: 1.45, vib: 0.12, dur: 0.65 },
    }[voice] || { pitch: [200], form: [700, 1200, 2400], rise: 1.3, vib: 0.03, dur: 0.5 };
    const dur = P.dur + Math.random() * 0.25;
    const base = P.pitch[Math.floor(Math.random() * P.pitch.length)];
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(base * 0.9, t);
    o.frequency.exponentialRampToValueAtTime(base * P.rise, t + dur * 0.28);
    o.frequency.exponentialRampToValueAtTime(base * 0.75, t + dur);
    const vib = c.createOscillator();
    vib.frequency.value = 7 + Math.random() * 5;
    const vibGain = c.createGain();
    vibGain.gain.value = base * P.vib;
    vib.connect(vibGain);
    vibGain.connect(o.frequency);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16 * k + 0.03, t + 0.04);
    g.gain.setValueAtTime(0.16 * k + 0.03, t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    for (let i = 0; i < 3; i++) {
      const f = c.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = P.form[i] * (0.92 + Math.random() * 0.16);
      f.Q.value = 7 + i * 2;
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

  meow(k) {
    this.tone(620, 0.16, 0.1 * k + 0.04, 'triangle', 980);
    this.tone(980, 0.24, 0.1 * k + 0.04, 'triangle', 520, 0.15);
  }

  // Araca göre korna: dolmuşun melodili kornası dahil
  horn(kind = 'car') {
    const T = {
      car: [[392, 494, 0.3]],
      old: [[300, 340, 0.4]],
      taxi: [[440, 554, 0.12], [440, 554, 0.12, 0.17], [440, 554, 0.28, 0.34]],
      bus: [[185, 233, 0.6]],
      truck: [[131, 165, 0.8]],
      dolmus: [[523, 659, 0.13], [587, 740, 0.13, 0.16], [659, 831, 0.13, 0.32], [784, 988, 0.26, 0.48]],
    }[kind] || [[392, 494, 0.3]];
    for (const [a, b, d, at = 0] of T) {
      this.tone(a, d, 0.07, 'square', 0, at);
      this.tone(b, d, 0.06, 'square', 0, at);
    }
  }

  // Simit dağılması: hafif tıkırtılar
  simit() {
    for (let i = 0; i < 7; i++) this.tone(420 + Math.random() * 500, 0.05, 0.08, 'triangle', 200, i * 0.035);
    this.burst(0.18, 1400, 0.1, 'bandpass');
  }

  // Çay bardakları kırılır
  tea() {
    this.glass(0.8);
    for (let i = 0; i < 4; i++) this.tone(3000 + Math.random() * 1500, 0.08, 0.05, 'sine', 0, 0.05 + i * 0.05);
  }

  // Plastik masa sandalye
  chairs() {
    for (let i = 0; i < 4; i++) this.tone(170 + Math.random() * 140, 0.07, 0.14, 'square', 90, i * 0.05);
    this.burst(0.14, 1800, 0.14, 'bandpass');
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

  // Satın alma: kasa zili
  purchase() {
    [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, 0.16, 0.18, 'triangle', 0, i * 0.07));
    this.burst(0.25, 5000, 0.07, 'highpass');
  }

  powerEnd() { this.tone(660, 0.18, 0.1, 'triangle', 240); }

  crunch() { this.burst(0.12, 1300, 0.22, 'bandpass', 500); }
  // Coin: üst üste toplayınca perde yükselir
  coin() {
    const c = this.ctx;
    if (!c) return;
    const t = c.currentTime;
    this.coinStreak = t - this.coinAt < 0.7 ? Math.min(8, this.coinStreak + 1) : 0;
    this.coinAt = t;
    const k = 2 ** (this.coinStreak / 12);
    this.tone(1320 * k, 0.07, 0.15, 'square');
    this.tone(1975 * k, 0.14, 0.15, 'square', 0, 0.06);
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
    click('btn-garage', () => { this.gi = undefined; this.renderGarage(); this.show('garage'); a.stage('garage'); });
    click('btn-garage2', () => { this.gi = undefined; this.renderGarage(); this.show('garage'); a.stage('garage'); });
    click('car-prev', () => this.stepCar(-1));
    click('car-next', () => this.stepCar(1));
    click('btn-settings', () => { this.show('settings'); a.stage(null); });
    click('btn-howto', () => { this.show('howto'); a.stage(null); });
    for (const b of document.querySelectorAll('[data-back]')) {
      b.addEventListener('click', () => { a.tap(); this.refreshMenu(); this.show(b.dataset.back); a.stage(b.dataset.back); a.carChanged(); });
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
    $('set-ambient').addEventListener('change', (e) => { d.settings.ambient = e.target.checked; this.storage.save(); a.applySettings(); });
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
    $('set-ambient').checked = d.settings.ambient;
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
    const car = this.storage.selectedCar();
    $('menu-car-name').textContent = car.name;
    $('menu-car-paint').textContent = (car.paints[this.storage.paintIndex(car.id)] || car.paints[0]).name;
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
    const info = { blast: 'Yakındaki bütün arabalar patlar', ghost: `${CONFIG.powers.duration} sn polis seni göremez`, heal: 'Hasarı onarır, ateşi söndürür', giant: `${CONFIG.powers.duration} sn devleşirsin, hasar almazsın` };
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

  alienAlert() {
    const el = $('alert');
    el.textContent = CONFIG.difficulty.aliensAlert;
    el.classList.remove('run');
    void el.offsetWidth;
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
    const health = Math.max(0, Math.round(100 - g.damage));
    if (health !== l.health) {
      l.health = health;
      const bar = $('hud-health').firstElementChild;
      bar.style.width = `${health}%`;
      bar.style.background = health > 45 ? 'linear-gradient(90deg,#16c172,#7dffb0)' : health > 20 ? 'linear-gradient(90deg,#ff9d00,#ffd23f)' : 'linear-gradient(90deg,#ff2a3c,#ff7a5a)';
      $('hud-hp').textContent = health;
    }
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
    $('over-title').textContent = record.newScore ? 'YENİ REKOR!' : result.cause === 'water' ? 'BATTIN!' : 'YAKALANDIN!';
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
    const cars = CONFIG.cars;
    $('garage-coins').textContent = d.coins;
    if (this.gi === undefined) this.gi = Math.max(0, cars.findIndex((c) => c.id === d.selected));
    const car = cars[this.gi];
    const owned = d.owned.includes(car.id);
    const selected = d.selected === car.id;
    const paintI = owned ? this.storage.paintIndex(car.id) : (this.gp || 0);
    this.actions.previewCar(car, paintI);
    const swatch = $('garage-paints');
    swatch.textContent = '';
    car.paints.forEach((p, i) => {
      const b = document.createElement('button');
      b.className = `swatch ${p.finish}${i === paintI ? ' on' : ''}`;
      b.style.setProperty('--c', p.color);
      b.style.setProperty('--r', p.roof || p.color);
      b.title = p.name;
      b.setAttribute('aria-label', p.name);
      b.addEventListener('click', () => {
        this.actions.tap();
        this.gp = i;
        if (owned) { this.storage.setPaint(car.id, i); this.actions.carChanged(); }
        this.renderGarage();
      });
      swatch.appendChild(b);
    });
    $('garage-paint-name').textContent = `${car.paints[paintI].name} · ${{ gloss: 'Parlak', metal: 'Metalik', matte: 'Mat', pearl: 'İnci' }[car.paints[paintI].finish]}${car.paints[paintI].roof ? ' · Çift ton' : ''}`;
    $('garage-name').textContent = car.name;
    $('garage-desc').textContent = car.desc;

    const stats = $('garage-stats');
    stats.textContent = '';
    const top = cars[cars.length - 1];
    const base = cars[0];
    const stat = (label, value, text) => {
      const row = document.createElement('div');
      row.className = 'stat';
      const t = document.createElement('span');
      t.textContent = label;
      const bar = document.createElement('i');
      const fill = document.createElement('b');
      fill.style.width = `${Math.round(25 + value * 75)}%`;
      bar.appendChild(fill);
      const n = document.createElement('em');
      n.textContent = text;
      row.append(t, bar, n);
      stats.appendChild(row);
    };
    const norm = (v, a, b) => (v - a) / (b - a);
    stat('Hız', norm(car.maxSpeed, base.maxSpeed, top.maxSpeed), String(Math.round(car.maxSpeed / 3)));
    stat('Kayma', norm(base.driftGrip / car.driftGrip, 1, base.driftGrip / top.driftGrip), String(Math.round((base.driftGrip / car.driftGrip) * 100)));
    stat('Dayanıklılık', norm(car.durability, base.durability, top.durability), String(Math.round(car.durability * 100)));

    const act = $('garage-action');
    act.classList.toggle('buy', !owned);
    if (selected) { act.textContent = 'Seçili'; act.disabled = true; }
    else if (owned) { act.textContent = 'Seç'; act.disabled = false; }
    else {
      act.textContent = d.coins >= car.cost ? `Satın al · ${car.cost}` : `${car.cost} coin`;
      act.disabled = d.coins < car.cost;
    }
    act.onclick = () => {
      this.actions.tap();
      if (owned) this.storage.select(car.id);
      else if (this.storage.buy(car.id)) this.actions.purchased();
      this.actions.carChanged();
      this.renderGarage();
    };

    const list = $('garage-list');
    list.textContent = '';
    cars.forEach((c, i) => {
      const b = document.createElement('button');
      const has = d.owned.includes(c.id);
      b.className = `thumb${i === this.gi ? ' on' : ''}${has ? '' : ' locked'}${d.selected === c.id ? ' selected' : ''}`;
      const art = carSprite(c, this.storage.paintIndex(c.id));
      art.className = 'car-art';
      const label = document.createElement('span');
      label.textContent = has ? c.name : `${c.cost}`;
      b.append(art, label);
      b.addEventListener('click', () => { this.actions.tap(); this.gi = i; this.gp = 0; this.renderGarage(); });
      list.appendChild(b);
    });
    const on = list.children[this.gi];
    if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest' });
  }

  stepCar(dir) {
    const n = CONFIG.cars.length;
    this.gi = (this.gi + dir + n) % n;
    this.gp = 0;
    this.renderGarage();
  }

  // Atlas geç yüklenirse garaj küçük resimleri yenilenir
  atlasLoaded() {
    if (!$('garage').hidden) this.renderGarage();
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
game.paint = storage.paintIndex(game.carSpec.id);

let stage = null;
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
  audio.setAmbient(storage.data.settings.ambient);
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
  game.paint = storage.paintIndex(storage.selectedCar().id);
  game.start(storage.selectedCar(), { startTime, god });
  showStage(null);
  audio.setEngine(storage.selectedCar().engine);
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
  showStage('menu');
  keepAwake(false);
}

// 3B sahne: seçili araç, seçili boya
function showStage(mode) {
  if (!stage || !stage.ok) return;
  stage.setMode(mode);
  if (mode) syncStage();
}

function syncStage(car = storage.selectedCar(), paintIdx = storage.paintIndex(car.id)) {
  if (!stage || !stage.ok) return;
  const paint = car.paints[paintIdx] || car.paints[0];
  stage.setCar(car.shape, { ...paint, accent: paint.accent || car.accent });
}

function loadThree() {
  if (!document.getElementById('stage3d')) return;
  const s = document.createElement('script');
  s.src = 'vendor/three.min.js';
  s.onload = () => {
    try {
      stage = new Stage(document.getElementById('stage3d'));
    } catch { stage = null; }
    if (stage && stage.ok) {
      document.body.classList.add('has3d');
      const on = ['menu', 'garage'].find((id) => !document.getElementById(id).hidden);
      showStage(on || null);
      if (!on) stage.setMode(null);
    }
  };
  document.body.appendChild(s);
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
  carChanged() { game.carSpec = storage.selectedCar(); game.paint = storage.paintIndex(game.carSpec.id); },
  previewCar(car, paintIdx) { syncStage(car, paintIdx); },
  stage(mode) { showStage(mode); },
  purchased() { audio.purchase(); vibrate([30, 30, 60]); },
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
    case 'scream': audio.scream(v, game.lastVoice); break;
    case 'simit': audio.simit(); break;
    case 'tea': audio.tea(); break;
    case 'chairs': audio.chairs(); break;
    case 'uncles': break;
    case 'thud': audio.thud(); vibrate(15); break;
    case 'horn': audio.horn(v); break;
    case 'power': audio.power(v); ui.powerToast(v); vibrate(35); break;
    case 'powerend': audio.powerEnd(); break;
    case 'break': audio.crunch(); break;
    case 'crush': audio.crunch(); vibrate(25); break;
    case 'coin': audio.coin(); break;
    case 'nearmiss': audio.nearMiss(); break;
    case 'splash': audio.splash(); break;
    case 'sink': audio.sink(); vibrate([80, 60, 200]); break;
    case 'aliens': audio.alert(); ui.alienAlert(); vibrate([100, 50, 100, 50, 200]); break;
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
  if (stage && stage.mode) stage.frame(now, elapsed);

  if (!paused) {
    accumulator += elapsed;
    let steps = 0;
    // Menü kendi sahnesini çizer: arkada oyun dönmez, pil harcanmaz
    while (game.state !== 'attract' && accumulator >= STEP && steps < 5) {
      input.tick(STEP);
      game.tick(STEP, input.steer, input.reverse);
      accumulator -= STEP;
      steps++;
    }
    if (steps === 5 || game.state === 'attract') accumulator = 0;
    if (hintT > 0) {
      hintT -= elapsed;
      if (hintT <= 0) ui.showHint(false);
    }
  }
  if (game.state !== 'attract') renderer.draw(game, now);
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
  if (game.state === 'play' || game.state === 'dying' || game.state === 'sinking') {
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
  showStage('menu');
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
  if (document.fonts) {
    for (const f of ['800 30px Nunito', '400 30px Bungee', '400 30px Pacifico', '400 30px Anton', '400 30px Righteous', '400 30px Lobster', '400 30px "Tilt Neon"', '400 30px Monoton', '500 30px Oswald', 'italic 400 30px Playfair']) document.fonts.load(f, 'ÇŞĞİçşğı').catch(() => {});
  }
  resize();
  window.addEventListener('resize', () => { resize(); if (stage) stage.resize(); });
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
  loadThree();
  loadAtlas(() => { renderer.useAtlas(); ui.atlasLoaded(); });
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
globalThis.__kacis = { game, input, perf, storage, renderer, ui, play, pause, resume, cfg: CONFIG, get stage() { return stage; } };

boot();

})();
