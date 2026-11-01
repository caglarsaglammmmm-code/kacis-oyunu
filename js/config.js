// Oyunun TÜM ayarları burada. Denge değiştirmek için yalnızca bu dosyayı düzenleyin,
// ardından `npm run bundle` çalıştırın (file:// kopyası için).

export const GROUND = { GRASS: 0, ROAD: 1, WALK: 2, PLAZA: 3, WATER: 4, SAND: 5, DIRT: 6, SHALLOW: 7, FIELD: 8, ALLEY: 9, TRACK: 10 };

// Bina stilleri. 0-6 şehir çatıları, sonrası js/art.js içinde özel çizilir
export const BUILD = {
  TOWER_GLASS: 7, TOWER_ROUND: 8, TOWER_STEP: 9, HUT: 10, LIFEGUARD: 11, LIGHTHOUSE: 12, CABIN: 13,
  FIRETOWER: 14, ADOBE: 15, MESA: 16, BARN: 17, SILO: 18, WINDMILL: 19, WATERTOWER: 20, GAS: 21,
  APARTMENT: 22, MARKET: 23, KOLEJ: 24, BAZAAR: 25, CHAIN: 26, BANK: 27, RESIDENCE: 28, OFFICE: 29, HOTEL: 30,
  HOSPITAL: 31, SCHOOL: 32, MOSQUE: 33, STADIUM: 34, SITE_BLOCK: 35, GECEKONDU: 36, VILLA: 37, ISHANI: 38, SHOPROW: 39, CAFE: 40, SHOP: 41, SKYSCRAPER: 42, RUIN: 43, SITEWORK: 44, FACTORY: 45,
};

export const CONFIG = {
  name: 'Drift Lab',
  version: '7.0.0',
  apkUrl: 'https://github.com/caglarsaglammmmm-code/kacis-oyunu/releases/download/driftlab-v7.0.0/DriftLab.apk',

  // TEK HIZ DÜĞMESİ. Tüm son hızlar açılışta bu çarpanlarla ölçeklenir (dosyanın sonuna bakın).
  // player: oyuncu araçları. npc: sokak trafiği. highway: otoban trafiği.
  // police: polis zaten oyuncu hızına oranlıdır, yani player ile birlikte yavaşlar; bu ek çarpandır.
  speedScale: { player: 0.88, npc: 0.88, highway: 0.88, police: 1 },

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
    templates: { mahalle: 26, downtown: 13, esnaf: 10, gecekondu: 6, site: 6, keyif: 4, cami: 6, stadyum: 2, hastane: 3, okul: 4, spor: 5, golet: 3, park: 2, pazar: 2, industrial: 1, donel: 8, viraj: 14, insaat: 3, harabe: 3, sanayi: 3 },
    // Yoğunluk: alleys ara sokak sayısı (dikey, yatay), maxB en büyük parsel, wide iki karo sokak olasılığı,
    // detached ayrık bina olasılığı, stub çıkmaz sokak olasılığı
    profiles: {
      mahalle: { alleys: [4, 3], maxB: 6, wide: 0.72, detached: 0.14, stub: 0.3 },
      downtown: { alleys: [3, 3], maxB: 9, wide: 0.9, detached: 0.2, stub: 0.1 },
      esnaf: { alleys: [4, 3], maxB: 5, wide: 0.7, detached: 0.05, stub: 0.25 },
      gecekondu: { alleys: [4, 3], maxB: 3, wide: 0.4, detached: 0.3, stub: 0.5 },
      keyif: { alleys: [3, 3], maxB: 6, wide: 0.8, detached: 0.1, stub: 0.2 },
      insaat: { alleys: [3, 3], maxB: 7, wide: 0.8, detached: 0.5, stub: 0.1 },
      harabe: { alleys: [4, 3], maxB: 5, wide: 0.5, detached: 0.4, stub: 0.4 },
      sanayi: { alleys: [3, 2], maxB: 8, wide: 0.8, detached: 0.3, stub: 0.2 },
    },
    sistemRing: [4, 9],
    // Bina yüksekliği: share yüksek bina oranı, height kameraya uzanma payı
    // ruin ve work: sıradan mahallede harabe ve inşaat, fire: yangın olasılığı
    tall: { share: 0.62, height: [0.16, 0.42], maxPerChunk: 16 },
    ruin: 0.035, work: 0.04, fire: 0.008, ruinFire: 0.07,
    // Otoban: her satırı doğudan batıya kesen geniş yol. every: kaç chunk'ta bir, y0: bant başlangıç karosu
    // half: bir yönün karo sayısı, lanes: yön başına şerit
    highway: { every: 10, offset: 2, y0: 10, half: 5, lanes: 4 },
    // Yol tonları: yalnızca üç aile, araçlar net ayrılsın
    // Sokak geometrisi. setback: binaların sokağa bakan cephesi karodan bu kadar içeride, yani bir karoluk
    // sokak 40 + 2 * setback genişliğindedir. cornerRadius: açık bina köşelerinin çarpışma yuvarlaması
    street: { setback: 7, cornerRadius: 16 },
    roadTones: ['#3f4249', '#5b5f66', '#a4a7a9'], // Tek Kolej Koleji başlangıçtan bu kadar chunk uzakta
    bigSites: [
      { name: 'Yeşilvadi Sitesi', color: '#7fa86b', ring: [5, 11], layout: 0 },
      { name: 'Mavi Orman Sitesi', color: '#c98a5a', ring: [8, 15], layout: 1 },
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
    driftMinSpeed: 175, // Bunun altında arka lastikler kaymaz: dar sokak hızında araç yol tutar
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
    // Düşük ve orta hız çevikliği: agileFrom altında tam, agileTo üstünde yok. Yüksek hız drift hissi değişmez
    agileFrom: 170,
    agileTo: 330,
    agileTurn: 0.42, // Dönüş hızına eklenen pay
    agileYaw: 4, // Burnun tepki hızına eklenen pay
    pivot: 0.35, // Duran araçta kalan dönüş payı
    lowTurnSpeed: 78, // Bu hızın altında dönüş hıza oranla azalır (en küçük yarıçapı belirler)
    // Direksiyon sonuna kadar kırılınca araba kendi hız keser: tek parmakla sokağa girilir
    cornerSteer: 0.6,
    cornerSpeed: 165,
    cornerBrake: 230,
    // Sürtme: hız yönü duvarla bu orandan dar açı yapıyorsa araç sekmeden boyunca kayar
    slideRatio: 0.62,
    slideFriction: 0.008,
    slideAlign: 0.16, // Kayarken burun duvara paralele döner (temas başına pay)
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
    { grip: 1, speed: 1, drag: 0, name: 'track' },
  ],

  // En az 5 araba. durability hasarı böler, mass polis çarpışmalarını etkiler.
  // Sıra önemli: pahalılaştıkça hız, kayma ve dayanıklılık artar.
  // engine: motor sesi. kind ses karakteri (js/audio.js ENGINE_KINDS), cyl silindir, idle-red devir aralığı, gears vites
  cars: [
    { id: 'atmaca', paints: [{ name: 'Mahalle Beji', color: '#d9d4c7', finish: 'gloss' }, { name: 'Şarap Kırmızı', color: '#8e1b24', finish: 'metal' }, { name: 'Mat Asker Yeşili', color: '#4d5a3a', finish: 'matte' }, { name: 'Çift Ton Krem-Bordo', color: '#e6dcc2', finish: 'gloss', roof: '#6d1620' }], finish: 'gloss', name: 'Atmaca', cost: 0, desc: 'Her mahallenin emektarı', shape: 'atmaca', maxSpeed: 432, accel: 520, turnRate: 3.2, grip: 4.5, driftGrip: 1.15, durability: 1, mass: 1, len: 48, wid: 24, color: '#d9d4c7', accent: '#8a1f1f', engine: { kind: 'old', cyl: 4, idle: 800, red: 5000, gears: 4, gain: 1 } },
    { id: 'motor', paints: [{ name: 'Yarış Kırmızı', color: '#e8352e', finish: 'gloss', accent: '#ffe14d' }, { name: 'Elektrik Mavi', color: '#0a7cff', finish: 'metal', accent: '#ffffff' }, { name: 'Mat Siyah', color: '#1b1d22', finish: 'matte', accent: '#ff7a00' }, { name: 'İnci Beyaz', color: '#f2f4f7', finish: 'pearl', accent: '#e8352e' }], finish: 'gloss', name: 'Motosiklet', cost: 100, desc: 'Dar sokakların kralı', shape: 'moto', maxSpeed: 445, accel: 610, turnRate: 3.3, grip: 4.5, driftGrip: 1.1, durability: 1.05, mass: 0.9, len: 36, wid: 16, color: '#e8352e', accent: '#ffe14d', engine: { kind: 'moto', cyl: 4, idle: 1500, red: 12500, gears: 6, gain: 0.8 } },
    { id: 'granit', paints: [{ name: 'Gece Mavisi', color: '#1f3a68', finish: 'metal' }, { name: 'Kor Turuncu', color: '#e8551e', finish: 'metal' }, { name: 'Mat Gümüş', color: '#a7aeb7', finish: 'matte' }, { name: 'İnci Beyaz', color: '#f2f4f7', finish: 'pearl' }], finish: 'metal', name: 'Granit SUV', cost: 200, desc: 'Yüksek ve güvenli SUV', shape: 'granit', maxSpeed: 458, accel: 540, turnRate: 3.24, grip: 4.6, driftGrip: 1.05, durability: 1.12, mass: 1.15, len: 52, wid: 27, color: '#3b4a5c', accent: '#d7dde5', engine: { kind: 'diesel', cyl: 4, idle: 750, red: 4300, gears: 6, gain: 1 } },
    { id: 'elektra', paints: [{ name: 'Anadolu Kırmızı', color: '#b3122a', finish: 'metal' }, { name: 'Fırtına Grisi', color: '#4a5560', finish: 'metal' }, { name: 'Mat Toprak', color: '#8a6a4a', finish: 'matte' }, { name: 'Buz Mavisi', color: '#bcd9e6', finish: 'pearl' }], finish: 'metal', name: 'Elektra X1', cost: 320, desc: 'Sessiz, güçlü, elektrikli', shape: 'elektra', maxSpeed: 472, accel: 680, turnRate: 3.28, grip: 4.6, driftGrip: 1, durability: 1.18, mass: 1.2, len: 50, wid: 26, color: '#b3122a', accent: '#111418', engine: { kind: 'ev', cyl: 6, idle: 0, red: 24000, gears: 1, gain: 0.7 } },
    { id: 'simsek', paints: [{ name: 'Mat Siyah Sarı Şerit', color: '#111318', finish: 'matte', accent: '#ffd23f' }, { name: 'Ateş Turuncu', color: '#ff5a12', finish: 'gloss', accent: '#111318' }, { name: 'Neon Yeşil', color: '#39d353', finish: 'gloss', accent: '#111318' }, { name: 'Mor Metalik', color: '#6a2bd9', finish: 'metal', accent: '#21d4fd' }], finish: 'matte', name: 'Şimşek', cost: 480, desc: 'Abartılı spoyler, tam tuning', shape: 'simsek', maxSpeed: 486, accel: 590, turnRate: 3.32, grip: 4.7, driftGrip: 0.95, durability: 1.24, mass: 1.1, len: 48, wid: 24, color: '#111318', accent: '#ffd23f', engine: { kind: 'turbo', cyl: 4, idle: 950, red: 7400, gears: 5, gain: 1 } },
    { id: 'cinar', paints: [{ name: 'Efsane Turuncu', color: '#e8782a', finish: 'gloss', accent: '#f6efe0' }, { name: 'Bebek Mavisi', color: '#7ec6e8', finish: 'gloss', accent: '#f6efe0' }, { name: 'Çift Ton Krem-Vişne', color: '#ead9b0', finish: 'gloss', roof: '#8a1f2f' }, { name: 'Mat Zeytin', color: '#6b6b3a', finish: 'matte', accent: '#f6efe0' }], finish: 'gloss', name: 'Çınar A', cost: 680, desc: 'Klasik efsane', shape: 'cinar', maxSpeed: 500, accel: 600, turnRate: 3.36, grip: 4.7, driftGrip: 0.9, durability: 1.3, mass: 1.15, len: 50, wid: 24, color: '#e8782a', accent: '#f6efe0', engine: { kind: 'old', cyl: 3, idle: 700, red: 4600, gears: 4, gain: 1.05 } },
    { id: 'efe', paints: [{ name: 'Boğaz Mavisi', color: '#2f6fb0', finish: 'gloss' }, { name: 'Haki', color: '#75805a', finish: 'matte' }, { name: 'Gümüş', color: '#b9c1ca', finish: 'metal' }, { name: 'Çift Ton Bej-Kahve', color: '#dcc9a4', finish: 'gloss', roof: '#5c3a22' }], finish: 'gloss', name: 'Efe 131', cost: 920, desc: 'Çelik gibi, babadan kalma', shape: 'efe', maxSpeed: 514, accel: 610, turnRate: 3.4, grip: 4.8, driftGrip: 0.86, durability: 1.38, mass: 1.25, len: 50, wid: 25, color: '#2f6fb0', accent: '#eef1f5', engine: { kind: 'old', cyl: 6, idle: 650, red: 5200, gears: 4, gain: 1 } },
    { id: 'marmara', paints: [{ name: 'Kar Beyaz', color: '#f2f2f2', finish: 'gloss' }, { name: 'Volkan Kırmızı', color: '#c1121f', finish: 'metal' }, { name: 'Mat Antrasit', color: '#3a3f47', finish: 'matte' }, { name: 'Çift Ton Mavi-Siyah', color: '#1565c0', finish: 'metal', roof: '#0b0d11' }], finish: 'metal', name: 'Marmara S', cost: 1200, desc: 'Sade sedan, sürprizli', shape: 'marmara', maxSpeed: 528, accel: 640, turnRate: 3.45, grip: 4.8, driftGrip: 0.82, durability: 1.46, mass: 1.25, len: 50, wid: 25, color: '#f2f2f2', accent: '#1f2933', engine: { kind: 'inline', cyl: 4, idle: 800, red: 6400, gears: 5, gain: 1 } },
    { id: 'liva', paints: [{ name: 'Okyanus Mavi', color: '#1c9ad6', finish: 'metal', accent: '#ffffff' }, { name: 'Alev Turuncu', color: '#ff6a13', finish: 'metal' }, { name: 'Mat Beyaz', color: '#e6e8ea', finish: 'matte' }, { name: 'Çift Ton Kırmızı-Siyah', color: '#d3162b', finish: 'gloss', roof: '#0b0d11' }], finish: 'metal', name: 'Liva', cost: 1550, desc: 'Küçük, çevik, uçan hatchback', shape: 'liva', maxSpeed: 542, accel: 680, turnRate: 3.52, grip: 4.9, driftGrip: 0.78, durability: 1.54, mass: 1.25, len: 45, wid: 24, color: '#1c9ad6', accent: '#ffffff', engine: { kind: 'thin', cyl: 3, idle: 950, red: 7200, gears: 5, gain: 0.95 } },
    { id: 'bozkir', paints: [{ name: 'Kanyon Turuncusu', color: '#e8701a', finish: 'matte', accent: '#23272e' }, { name: 'Orman Yeşili', color: '#2f6b4f', finish: 'metal' }, { name: 'Kum Beji', color: '#c9b48a', finish: 'matte' }, { name: 'Çift Ton Gri-Siyah', color: '#7a838d', finish: 'metal', roof: '#0b0d11' }], finish: 'matte', name: 'Bozkır 4x4', cost: 2000, desc: 'Her yerde gider, hiç durmaz', shape: 'bozkir', maxSpeed: 558, accel: 700, turnRate: 3.6, grip: 5, driftGrip: 0.74, durability: 1.62, mass: 1.5, len: 52, wid: 27, color: '#e8701a', accent: '#23272e', engine: { kind: 'v8', cyl: 8, idle: 620, red: 5800, gears: 5, gain: 1.15 } },
  ],

  damage: {
    minImpact: 90, // Bunun altındaki darbeler hasar vermez
    perSpeed: 0.072, // Hız birimi başına hasar: 430 hızla kafa kafaya ~24
    grazeScale: 0.2, // Duvar boyunca sürtmede hasar ve sarsıntı payı
    wallScale: 0.5, // Dar sokaklarda duvar darbesi: bina teması oyunu tek başına bitirmesin
    maxSingleHit: 34, // Tek darbe en fazla bu kadar: anlık ölüm yok
    earlyGraceUntil: 45, // Bu saniyeye kadar hasar azaltılır
    earlyGraceMul: 0.48,
    hitCooldown: 0.28, // Aynı temasın üst üste saymaması için
    hitStop: 0.055, // Sert darbede oyun bir an durur: çarpışma hissi
    hitStopMin: 9,
    autoReverseAfter: 0.7, // Duvara saplanınca kendiliğinden geri çıkar
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
    ufoCount: [[225, 1], [260, 2], [320, 3], [420, 4]], // [saniye, aynı anda en çok]
    roverCount: [[225, 2], [250, 4], [300, 6], [420, 9]],
    spawnEvery: 4.5,
    ufo: { hp: 240, mass: 9, speed: 1.06, accel: 760, turnRate: 6, grip: 20, driftGrip: 20, len: 74, wid: 74, ram: 0, smart: 1, siren: 'ufo' },
    rover: { hp: 110, mass: 1.7, speed: 1.02, accel: 860, turnRate: 4.6, grip: 13, driftGrip: 9, len: 46, wid: 28, ram: 0.75, smart: 1, siren: 'zap' },
    beamRange: 105, // Işın dairesi
    beamDps: 6, // Işın altında saniyede hasar
    beamPull: 300, // Oyuncuyu merkeze çekme
    beamSlow: 0.55, // Işın altında hız kaybı (saniyede oran)
  },

  // Oyuncu aracının altındaki ışık: NPC'lerden ayrılır
  playerGlow: { alpha: 0.34, scale: 1.5 },

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
  // voice: bağırma sesi, road: yolda gider, dodge: asla çarpılmaz, safe: araç değmez ve kenara kaçar, fx: özel dağılma
  peds: {
    looks: 36, // Saç, kıyafet, ten, aksesuar birleşimi: yarısı erkek, yarısı kadın
    idleChance: 0.34,
    curbShare: 0.55, // Ana yol kenarı kaldırımında yürüyenlerin oranı // Dükkân önünde duran, sohbet eden yaya oranı
    max: 50, spawnEvery: 0.09, waiterEvery: 0.7, despawn: 1300,
    walkSpeed: 26, runSpeed: 82, fearDist: 130, hitSpeed: 45,
    launch: 190, launchUp: 330, gravity: 900, downTime: 2.2,
    density: [0.12, 0, 1, 1, 0, 0.55, 0.15, 0.3, 0.1, 0.8, 0],
    kinds: {
      man: { weight: 5, speed: 1, voice: 'man' },
      woman: { weight: 5, speed: 1, voice: 'woman' },
      child: { weight: 2.6, speed: 1.4, voice: 'child', safe: true },
      elder: { weight: 2.2, speed: 0.6, voice: 'old', safe: true },
      simitci: { weight: 1.3, speed: 0.8, voice: 'simit', fx: 'simit', words: ['SİMİTLERİM!', 'SİMİİİT!', 'TEPSİM!'] },
      stroller: { weight: 1, speed: 0.8, voice: 'mom', safe: true },
      wheelchair: { weight: 0.7, speed: 0.75, voice: 'wheel', safe: true },
      bike: { weight: 1.5, speed: 3, voice: 'bike', words: ['ZİLİM BOZUK!', 'YOLDAN!'] },
      courier: { weight: 1, speed: 5.4, voice: 'courier', road: true, words: ['PAKET GİTTİ!', 'SİPARİŞ!', 'OHA!'] },
      cayci: { weight: 1.1, speed: 1, voice: 'cayci', fx: 'tea', words: ['ÇAYLAR!', 'BARDAKLAR!', 'TAZE DEMLEMİŞTİM!'] },
      esnaf: { weight: 1.5, speed: 0.9, voice: 'man', words: ['DÜKKÂNIM!', 'HOOP!', 'YAVAŞ OĞLUM!'] },
      student: { weight: 2, speed: 1.2, voice: 'teen', safe: true },
      tourist: { weight: 1, speed: 0.7, voice: 'tourist', words: ['OH NO!', 'MAMMA MIA!', 'WOW!'] },
      jogger: { weight: 1, speed: 3, voice: 'man', words: ['NEFESİM!', 'KOŞTUM YA!'] },
      guard: { weight: 0.7, speed: 0.6, voice: 'man', words: ['DUR ORADA!', 'GİRİŞ YOK!'] },
      teyze: { weight: 2, speed: 0.65, voice: 'grandma', safe: true },
      hawker: { weight: 0.9, speed: 0.7, voice: 'man', fx: 'simit', words: ['TEZGÂHIM!', 'MALLAR!'] },
      cat: { weight: 1.7, speed: 1.3, voice: 'cat', dodge: true },
    },
    words: {
      man: ['YANDIM!', 'OHA!', 'HOOP!', 'NOLUYOR YA!'],
      woman: ['AMAN!', 'İMDAT!', 'EYVAH!', 'YAPMA!'],
      teen: ['OHA!', 'ABİ YA!'],
      tourist: ['HELP!'],
      cat: ['MİYAV!'],
    },
  },

  // Sivil Türk trafiği: hepsi oyuncu araçlarından yavaş. Ana yollarda sağdan akar
  npc: {
    max: 22, spawnEvery: 0.4, despawn: 1700, laneOffset: 30, turnChance: 0.2,
    hitScale: 0.42, maxHit: 12,
    panicDist: 300, panicSpeed: 300, panicTime: 2.4, panicLane: 44, panicBoost: 1.3,
    // Boyalar: metalik, parlak, mat sırayla atanır. Modeller özgün
    finishes: ['metal', 'gloss', 'matte'],
    types: {
      klasik: { weight: 2.6, shape: 'atmaca', model: 'atmaca', len: 46, wid: 23, mass: 1.2, cruise: 195, turnRate: 2.4, grip: 7, horn: 'car', colors: ['#d9d4c7', '#8a1f1f', '#3e7cb1', '#2f6b4f', '#e0a020'] },
      efe: { weight: 1.5, shape: 'efe', len: 47, wid: 24, mass: 1.25, cruise: 175, turnRate: 2.3, grip: 7, horn: 'old', colors: ['#3e8ad0', '#e8e4d8', '#b5352a', '#3a7a55'] },
      cinar: { weight: 0.9, shape: 'cinar', len: 47, wid: 23, mass: 1.15, cruise: 165, turnRate: 2.3, grip: 7, horn: 'old', colors: ['#e8782a', '#e0c060', '#7a3b9c'] },
      elektra: { weight: 1, shape: 'elektra', len: 48, wid: 25, mass: 1.4, cruise: 215, turnRate: 2.5, grip: 7, horn: 'car', colors: ['#3f4a55', '#e8e8e8', '#14506b', '#a01c30'] },
      taxi: { weight: 2.4, shape: 'marmara', model: 'marmara', len: 48, wid: 24, mass: 1.25, cruise: 225, turnRate: 2.6, grip: 7, horn: 'taxi', colors: ['#f7c600'] },
      bavar: { weight: 1.6, shape: 'bavar', len: 49, wid: 25, mass: 1.35, cruise: 225, turnRate: 2.6, grip: 7, horn: 'car', colors: ['#14233f', '#e9edf1', '#1a1c20', '#2b6fd6', '#7d8894'] },
      aurum: { weight: 1.5, shape: 'aurum', len: 49, wid: 25, mass: 1.35, cruise: 225, turnRate: 2.6, grip: 7, horn: 'car', colors: ['#c2c8cf', '#23262c', '#7c1f2b', '#1f6e5a'] },
      stella: { weight: 1.5, shape: 'stella', len: 51, wid: 25, mass: 1.45, cruise: 210, turnRate: 2.4, grip: 7, horn: 'old', colors: ['#111317', '#d8dde3', '#34495e', '#6d6358'] },
      volta: { weight: 1.7, shape: 'volta', len: 43, wid: 24, mass: 1.15, cruise: 205, turnRate: 2.7, grip: 7, horn: 'car', colors: ['#d62839', '#f4f4f4', '#2e3a4a', '#1e88a8', '#ffd23f'] },
      pusula: { weight: 1.3, shape: 'pusula', len: 46, wid: 24, mass: 1.2, cruise: 200, turnRate: 2.6, grip: 7, horn: 'car', colors: ['#2b5fa8', '#e5e7ea', '#e8703a', '#3a3f47'] },
      dalga: { weight: 1.3, shape: 'dalga', len: 46, wid: 24, mass: 1.2, cruise: 200, turnRate: 2.6, grip: 7, horn: 'car', colors: ['#4bb5a9', '#d9dde2', '#a01c30', '#222630'] },
      lale: { weight: 1.3, shape: 'lale', len: 47, wid: 24, mass: 1.2, cruise: 200, turnRate: 2.5, grip: 7, horn: 'car', colors: ['#f2f2f2', '#b0272f', '#3e6a95', '#5b5f66'] },
      vadi: { weight: 1.3, shape: 'vadi', len: 47, wid: 24, mass: 1.2, cruise: 190, turnRate: 2.5, grip: 7, horn: 'car', colors: ['#eae6dc', '#8e9299', '#4a6a8a', '#7a2f2f'] },
      pickup: { weight: 1.2, shape: 'kamyonet', len: 52, wid: 26, mass: 1.9, cruise: 185, turnRate: 2.2, grip: 7, horn: 'truck', colors: ['#e8e8e8', '#3e6a4f', '#b5352a', '#3e6a95'] },
      motosiklet: { weight: 1.1, shape: 'moto', model: 'moto', len: 34, wid: 14, mass: 0.5, cruise: 225, turnRate: 3, grip: 8, horn: 'car', colors: ['#d62839', '#1e88a8', '#23262c', '#e8c547'] },
      liva: { weight: 1.2, shape: 'liva', len: 42, wid: 24, mass: 1.1, cruise: 205, turnRate: 2.7, grip: 7, horn: 'car', colors: ['#1c9ad6', '#ff6a13', '#e6e8ea', '#d3162b'] },
      bozkir: { weight: 1.1, shape: 'bozkir', len: 48, wid: 26, mass: 1.5, cruise: 195, turnRate: 2.4, grip: 7, horn: 'truck', colors: ['#e8701a', '#2f6b4f', '#c9b48a'] },
      granit: { weight: 0.9, shape: 'granit', len: 49, wid: 26, mass: 1.45, cruise: 205, turnRate: 2.5, grip: 7, horn: 'car', colors: ['#1f3a68', '#a7aeb7', '#e8551e'] },
      marmara: { weight: 1.5, shape: 'marmara', len: 48, wid: 24, mass: 1.25, cruise: 205, turnRate: 2.5, grip: 7, horn: 'car', colors: ['#f2f2f2', '#c1121f', '#3a3f47', '#1565c0'] },
      minibus: { weight: 1.6, model: 'minibus', len: 64, wid: 28, mass: 3, cruise: 190, turnRate: 2, grip: 8, horn: 'dolmus', colors: ['#f4f6f8'] },
      bus: { weight: 1.1, len: 96, wid: 30, mass: 7, cruise: 150, turnRate: 1.7, grip: 8, horn: 'bus', colors: ['#2a7fc1', '#2c9e8f', '#e8732a'] },
      truck: { weight: 0.8, accent: '#2a6db0', len: 108, wid: 32, mass: 8, cruise: 155, turnRate: 1.6, grip: 8, horn: 'truck', colors: ['#d9534f', '#3e7cb1', '#e8833a', '#2f7a4f'] },
    },
  },

  // Otoban trafiği: hafif kinematik araçlar, fizik maliyeti yok
  highwayTraffic: { count: 70, speed: [290, 400], truckSpeed: [240, 290], spawnEvery: 0.025, near: 1300, range: 1250, safeGap: 34, brake: 620, accel: 240, hitScale: 0.5, maxHit: 14, mix: { car: 66, taxi: 10, minibus: 9, bus: 6, truck: 9 }, hornDist: 170 },

  // Trafik ışığı süreleri (saniye)
  traffic: { green: 6, yellow: 1.2, allRed: 0.8, stopLine: 94, brake: 520, hornAfter: 2.5, hornRate: 0.5 },

  // Tabela adları. Tüm adlar uydurmadır
  signs: {
    bigshops: ['Merkez Çarşı İş Hanı', 'Merkez İş Merkezi', 'Kristal Plaza', 'Boğaz Tower', 'Anadolu Plaza', 'Sultan Rezidans', 'Lale Rezidans', 'Marmara Residence', 'Mavi Kule', 'Atlas Tower'],
    hotels: ['Grand Otel', 'Otel Boğaz', 'Park Hotel', 'Sahil Palas Oteli', 'Otel Saray', 'Mavi Otel'],
    shops: ['Usta Döner', 'İskender Sarayı', 'Karadeniz Pide', 'Urfa Lahmacun', 'Adana Kebapçısı', 'Nöbetçi Eczane', 'Ekmek Fırını', 'Bayan Kuaförü', 'Erkek Berberi', 'Köşe Büfe', 'Köşe Bayii', 'Nane Döner', 'Soslu Döner', 'Eczane', 'Fırın', 'Dönerci', 'İskenderci', 'Pideci', 'Lahmacun', 'Kebapçı', 'Büfe', 'Çay Ocağı', 'Kuaför', 'Tost Evi', 'Bakkal', 'Kahveci', 'Çınar Kafe', 'Berber', 'Lokanta', 'Börekçi', 'Kasap', 'Manav', 'Züccaciye', 'Kırtasiye', 'Emlakçı', 'Terzi', 'Tuhafiye', 'Ciğerci', 'Tatlıcı', 'Çiğköfte', 'Tamirci', 'Oto Yıkama', 'Usta Dönerci', 'Hacı Usta Pide', 'Kardeşler Bakkal', 'Büfe 7/24', 'Mahalle Çay Ocağı', 'Öz Urfa Kebap', 'Çınar Kafe'],
    chains: { 'Pazarcık Market': '#3f8f5b', Ucuzlar: '#7b3fa0', 'Sepet Market': '#1f9e9e', 'Yıldız Mağazaları': '#c23b6b', 'Dörtyol Market': '#6a7f2a', 'Teknoloji Durağı': '#2b3a67', 'Yapı Dünyası': '#8a5a2b', 'Köşe Bakkal': '#b5651d' },
    banks: { 'Yıldız Bankası': '#3b3f8f', 'Anadolu Tasarruf': '#8a6d1f', 'Bereket Bankası': '#6b8e23', 'Güven Kredi': '#5b2a86', 'Marmara Yatırım': '#0f6e84' },
    sites: ['Yeşil Tepe Sitesi', 'Boğaz Evleri', 'Mavi Konak Sitesi', 'Çamlık Sitesi', 'Güneş Sitesi', 'Lale Evleri', 'Marmara Konutları', 'Park Evleri'],
    cafes: ['Melodi Kafe', 'Akustik Kafe', 'Sahne Kafe', 'Çınaraltı Çay Bahçesi', 'Bahçe Çay Evi', 'Çay Bahçesi', 'Demir Spor Salonu', 'Kondisyon Spor Salonu'],
    cafeColors: ['#c9773b', '#3f8f6b', '#8a5fb0', '#d1a03c'],
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

  perf: { maxParticles: 380, maxSkids: 900, maxDecals: 24, maxDpr: 1.75, bakeScale: 0.72, bakePool: 9, bakeBudget: 3, slowFrameMs: 21 },
};

// Hız çarpanlarını uygula: yukarıdaki sayılar temel değerdir, ayar speedScale üzerinden yapılır
{
  const S = CONFIG.speedScale;
  for (const c of CONFIG.cars) c.maxSpeed = Math.round(c.maxSpeed * S.player);
  for (const t of Object.values(CONFIG.npc.types)) t.cruise = Math.round(t.cruise * S.npc);
  const H = CONFIG.highwayTraffic;
  H.speed = H.speed.map((v) => Math.round(v * S.highway));
  H.truckSpeed = H.truckSpeed.map((v) => Math.round(v * S.highway));
  CONFIG.npc.panicSpeed = Math.round(CONFIG.npc.panicSpeed * S.player);
}

// Yıldız seviyesi: başlangıçta 1, her eşikte artar
export const MAX_STARS = 4;
