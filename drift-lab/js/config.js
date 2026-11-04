// Oyunun TÜM ayarları burada. Denge değiştirmek için yalnızca bu dosyayı düzenleyin,
// ardından `npm run bundle` çalıştırın (file:// kopyası için).

import { NAMES } from './names.js';

export const GROUND = { GRASS: 0, ROAD: 1, WALK: 2, PLAZA: 3, WATER: 4, SAND: 5, DIRT: 6, SHALLOW: 7, FIELD: 8, ALLEY: 9, TRACK: 10 };

// Bina stilleri. 0-6 şehir çatıları, sonrası js/art.js içinde özel çizilir
export const BUILD = {
  TOWER_GLASS: 7, TOWER_ROUND: 8, TOWER_STEP: 9, HUT: 10, LIFEGUARD: 11, LIGHTHOUSE: 12, CABIN: 13,
  FIRETOWER: 14, ADOBE: 15, MESA: 16, BARN: 17, SILO: 18, WINDMILL: 19, WATERTOWER: 20, GAS: 21,
  APARTMENT: 22, MARKET: 23, KOLEJ: 24, BAZAAR: 25, CHAIN: 26, BANK: 27, RESIDENCE: 28, OFFICE: 29, HOTEL: 30,
  HOSPITAL: 31, SCHOOL: 32, MOSQUE: 33, STADIUM: 34, SITE_BLOCK: 35, GECEKONDU: 36, VILLA: 37, ISHANI: 38, SHOPROW: 39, CAFE: 40, SHOP: 41, SKYSCRAPER: 42, RUIN: 43, SITEWORK: 44, FACTORY: 45,
  // Özel yerler (js/landmarks.js çizer)
  SERVIS: 46, MUZE: 47, SELCUK_CAMI: 48, KONGRE: 49, KULE: 50, AVM: 51, BEDESTEN: 52, BAGEVI: 53, OZEL_OKUL: 54, ANIT: 55,
};

export const CONFIG = {
  name: NAMES.oyun,
  version: '23.0.0',
  // Arkadaş sürümünün indirme adresi isim tablosundadır; Play sürümü kendi sürümünün APK'sını gösterir
  apkUrl: NAMES.indir || 'https://github.com/caglarsaglammmmm-code/kacis-oyunu/releases/download/driftlab-v23.0.0/DriftLab-PlayStore.apk',

  // TEK HIZ DÜĞMESİ. Tüm son hızlar açılışta bu çarpanlarla ölçeklenir (dosyanın sonuna bakın).
  // player: oyuncu araçları. npc: sokak trafiği. highway: otoban trafiği.
  // police: polis zaten oyuncu hızına oranlıdır, yani player ile birlikte yavaşlar; bu ek çarpandır.
  speedScale: { player: 0.88, npc: 0.88, highway: 0.88, police: 1 },

  // Geliştirici kısayolları. Adres çubuğundan da verilebilir: ?t=280&god=1
  dev: {
    startTime: 0, // Oyun bu saniyeden başlar (ör. 225 = uzaylılar, 300 = tanklar, 380 = meteor)
    godMode: false, // Ölümsüzlük. Ayarlarda sürüm yazısına 7 kez dokununca da açılır
  },

  input: {
    bothDelay: 0.09, // Baş parmak geçişi geri vites sanılmasın: ikisine bu kadar basılı kalınca geri
    // DİREKSİYON: parmağın açısı basıldığı andan itibaren AÇI FARKI olarak birikir (±180° sınırında sıçramaz).
    // maxDeg: tam kilit (±), hole: merkeze bu orandan yakın parmak yok sayılır (açı kararsız), grab: direksiyonu
    // tutma alanı (yarıçap katı), jump: tek olayda bundan büyük açı farkı hata sayılır (derece), smooth: görünüm
    // ve değer yumuşatması (1/sn), returnRate: bırakınca ortaya yaylı dönüş (1/sn), dead: ölü bölge (oran)
    wheel: { maxDeg: 135, hole: 0.16, grab: 1.1, jump: 75, smooth: 28, returnRate: 9, dead: 0.03 },
    // JOYSTICK: basılan nokta merkezdir. r yarıçap (px), dead ölü bölge (px), smooth yumuşatma (1/sn)
    stick: { r: 54, dead: 8, smooth: 24 },
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
    sistemRing: [4, 9], // Kolej: başlangıçtan bu kadar chunk uzakta
    // Tek seferlik özel yerler: her biri kendi chunk'ında, başlangıçtan ring kadar uzakta, birbirinden ayrı.
    // Adlar isim tablosundadır (names/tablo.mjs)
    landmarks: [
      { id: 'mevlana', ring: [2, 5] }, { id: 'alaaddin', ring: [3, 6] }, { id: 'zafer', ring: [2, 6] },
      { id: 'serife', ring: [2, 5] }, { id: 'bedesten', ring: [3, 7] }, { id: 'kongre', ring: [4, 8] },
      { id: 'kule', ring: [4, 8] }, { id: 'kulturpark', ring: [4, 9] }, { id: 'ted', ring: [5, 10] },
      { id: 'gundogdu', ring: [5, 10] }, { id: 'meram', ring: [6, 11] },
      { id: 'anit', ring: [2, 4] }, // Cumhuriyet Meydanı ve anıt (CONFIG.memorial, js/memorial.js)
      // İki stadyum (CONFIG.stadiums, js/stadium.js). apart: diğerinden en az bu kadar chunk uzakta
      { id: 'yozgat', ring: [3, 6] }, { id: 'konyastad', ring: [6, 10], apart: ['yozgat', 5] },
      { id: 'gecit', ring: [11, 14] }, // Ücra köşedeki terk edilmiş depo alanı (CONFIG.secret)
    ],
    // Yüksek özel yapıların yükseklik payı (sıradan binalar en çok tall.height[1])
    landmarkHeight: { kolej: 0.46, kule: 0.95 },
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
    roadTones: ['#3f4249', '#5b5f66', '#a4a7a9'],
    bigSites: [
      { name: NAMES.siteler.buyuk1, color: '#7fa86b', ring: [5, 11], layout: 0 },
      { name: NAMES.siteler.buyuk2, color: '#c98a5a', ring: [8, 15], layout: 1 },
    ],
  },

  camera: {
    dropZoom: 1.75, // BAŞLA geçişinde iniş yakın çekimi
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
    { id: 'atmaca', paints: [{ name: 'Mahalle Beji', color: '#d9d4c7', finish: 'gloss' }, { name: 'Şarap Kırmızı', color: '#8e1b24', finish: 'metal' }, { name: 'Mat Asker Yeşili', color: '#4d5a3a', finish: 'matte' }, { name: 'Çift Ton Krem-Bordo', color: '#e6dcc2', finish: 'gloss', roof: '#6d1620' }], finish: 'gloss', name: NAMES.arabalar.atmaca, cost: 0, desc: 'Her mahallenin emektarı', shape: 'atmaca', maxSpeed: 432, accel: 520, turnRate: 3.2, grip: 4.5, driftGrip: 1.15, durability: 1, mass: 1, len: 48, wid: 24, color: '#d9d4c7', accent: '#8a1f1f', engine: { kind: 'old', cyl: 4, idle: 800, red: 5000, gears: 4, gain: 1 }, egzozPatlamaSansi: 0.05 },
    { id: 'motor', paints: [{ name: 'Yarış Kırmızı', color: '#e8352e', finish: 'gloss', accent: '#ffe14d' }, { name: 'Elektrik Mavi', color: '#0a7cff', finish: 'metal', accent: '#ffffff' }, { name: 'Mat Siyah', color: '#1b1d22', finish: 'matte', accent: '#ff7a00' }, { name: 'İnci Beyaz', color: '#f2f4f7', finish: 'pearl', accent: '#e8352e' }], finish: 'gloss', name: NAMES.arabalar.motor, cost: 100, desc: 'Dar sokakların kralı', shape: 'moto', maxSpeed: 445, accel: 610, turnRate: 3.3, grip: 4.5, driftGrip: 1.1, durability: 1.05, mass: 0.9, len: 36, wid: 16, color: '#e8352e', accent: '#ffe14d', engine: { kind: 'moto', cyl: 4, idle: 1500, red: 12500, gears: 6, gain: 0.8 }, egzozPatlamaSansi: 0.35 },
    { id: 'granit', paints: [{ name: 'Gece Mavisi', color: '#1f3a68', finish: 'metal' }, { name: 'Kor Turuncu', color: '#e8551e', finish: 'metal' }, { name: 'Mat Gümüş', color: '#a7aeb7', finish: 'matte' }, { name: 'İnci Beyaz', color: '#f2f4f7', finish: 'pearl' }], finish: 'metal', name: NAMES.arabalar.granit, cost: 200, desc: 'Yüksek ve güvenli SUV', shape: 'granit', maxSpeed: 458, accel: 540, turnRate: 3.24, grip: 4.6, driftGrip: 1.05, durability: 1.12, mass: 1.15, len: 52, wid: 27, color: '#3b4a5c', accent: '#d7dde5', engine: { kind: 'diesel', cyl: 4, idle: 750, red: 4300, gears: 6, gain: 1 }, egzozPatlamaSansi: 0.04 },
    { id: 'elektra', paints: [{ name: 'Anadolu Kırmızı', color: '#b3122a', finish: 'metal' }, { name: 'Fırtına Grisi', color: '#4a5560', finish: 'metal' }, { name: 'Mat Toprak', color: '#8a6a4a', finish: 'matte' }, { name: 'Buz Mavisi', color: '#bcd9e6', finish: 'pearl' }], finish: 'metal', name: NAMES.arabalar.elektra, cost: 320, desc: 'Sessiz, güçlü, elektrikli', shape: 'elektra', maxSpeed: 472, accel: 680, turnRate: 3.28, grip: 4.6, driftGrip: 1, durability: 1.18, mass: 1.2, len: 50, wid: 26, color: '#b3122a', accent: '#111418', engine: { kind: 'ev', cyl: 6, idle: 0, red: 24000, gears: 1, gain: 0.7 }, egzozPatlamaSansi: 0 },
    { id: 'simsek', paints: [{ name: 'Mat Siyah Sarı Şerit', color: '#111318', finish: 'matte', accent: '#ffd23f' }, { name: 'Ateş Turuncu', color: '#ff5a12', finish: 'gloss', accent: '#111318' }, { name: 'Neon Yeşil', color: '#39d353', finish: 'gloss', accent: '#111318' }, { name: 'Mor Metalik', color: '#6a2bd9', finish: 'metal', accent: '#21d4fd' }], finish: 'matte', name: NAMES.arabalar.simsek, cost: 480, desc: 'Abartılı spoyler, tam tuning', shape: 'simsek', maxSpeed: 486, accel: 590, turnRate: 3.32, grip: 4.7, driftGrip: 0.95, durability: 1.24, mass: 1.1, len: 48, wid: 24, color: '#111318', accent: '#ffd23f', engine: { kind: 'turbo', cyl: 4, idle: 950, red: 7400, gears: 5, gain: 1 }, egzozPatlamaSansi: 0.6 },
    { id: 'cinar', paints: [{ name: 'Efsane Turuncu', color: '#e8782a', finish: 'gloss', accent: '#f6efe0' }, { name: 'Bebek Mavisi', color: '#7ec6e8', finish: 'gloss', accent: '#f6efe0' }, { name: 'Çift Ton Krem-Vişne', color: '#ead9b0', finish: 'gloss', roof: '#8a1f2f' }, { name: 'Mat Zeytin', color: '#6b6b3a', finish: 'matte', accent: '#f6efe0' }], finish: 'gloss', name: NAMES.arabalar.cinar, cost: 680, desc: 'Klasik efsane', shape: 'cinar', maxSpeed: 500, accel: 600, turnRate: 3.36, grip: 4.7, driftGrip: 0.9, durability: 1.3, mass: 1.15, len: 50, wid: 24, color: '#e8782a', accent: '#f6efe0', engine: { kind: 'old', cyl: 3, idle: 700, red: 4600, gears: 4, gain: 1.05 }, egzozPatlamaSansi: 0.08 },
    { id: 'efe', paints: [{ name: 'Boğaz Mavisi', color: '#2f6fb0', finish: 'gloss' }, { name: 'Haki', color: '#75805a', finish: 'matte' }, { name: 'Gümüş', color: '#b9c1ca', finish: 'metal' }, { name: 'Çift Ton Bej-Kahve', color: '#dcc9a4', finish: 'gloss', roof: '#5c3a22' }], finish: 'gloss', name: NAMES.arabalar.efe, cost: 920, desc: 'Çelik gibi, babadan kalma', shape: 'efe', maxSpeed: 514, accel: 610, turnRate: 3.4, grip: 4.8, driftGrip: 0.86, durability: 1.38, mass: 1.25, len: 50, wid: 25, color: '#2f6fb0', accent: '#eef1f5', engine: { kind: 'old', cyl: 6, idle: 650, red: 5200, gears: 4, gain: 1 }, egzozPatlamaSansi: 0.12 },
    { id: 'marmara', paints: [{ name: 'Kar Beyaz', color: '#f2f2f2', finish: 'gloss' }, { name: 'Volkan Kırmızı', color: '#c1121f', finish: 'metal' }, { name: 'Mat Antrasit', color: '#3a3f47', finish: 'matte' }, { name: 'Çift Ton Mavi-Siyah', color: '#1565c0', finish: 'metal', roof: '#0b0d11' }], finish: 'metal', name: NAMES.arabalar.marmara, cost: 1200, desc: 'Sade sedan, sürprizli', shape: 'marmara', maxSpeed: 528, accel: 640, turnRate: 3.45, grip: 4.8, driftGrip: 0.82, durability: 1.46, mass: 1.25, len: 50, wid: 25, color: '#f2f2f2', accent: '#1f2933', engine: { kind: 'inline', cyl: 4, idle: 800, red: 6400, gears: 5, gain: 1 }, egzozPatlamaSansi: 0.2 },
    { id: 'liva', paints: [{ name: 'Okyanus Mavi', color: '#1c9ad6', finish: 'metal', accent: '#ffffff' }, { name: 'Alev Turuncu', color: '#ff6a13', finish: 'metal' }, { name: 'Mat Beyaz', color: '#e6e8ea', finish: 'matte' }, { name: 'Çift Ton Kırmızı-Siyah', color: '#d3162b', finish: 'gloss', roof: '#0b0d11' }], finish: 'metal', name: NAMES.arabalar.liva, cost: 1550, desc: 'Küçük, çevik, uçan hatchback', shape: 'liva', maxSpeed: 542, accel: 680, turnRate: 3.52, grip: 4.9, driftGrip: 0.78, durability: 1.54, mass: 1.25, len: 45, wid: 24, color: '#1c9ad6', accent: '#ffffff', engine: { kind: 'thin', cyl: 3, idle: 950, red: 7200, gears: 5, gain: 0.95 }, egzozPatlamaSansi: 0.3 },
    { id: 'bozkir', paints: [{ name: 'Kanyon Turuncusu', color: '#e8701a', finish: 'matte', accent: '#23272e' }, { name: 'Orman Yeşili', color: '#2f6b4f', finish: 'metal' }, { name: 'Kum Beji', color: '#c9b48a', finish: 'matte' }, { name: 'Çift Ton Gri-Siyah', color: '#7a838d', finish: 'metal', roof: '#0b0d11' }], finish: 'matte', name: NAMES.arabalar.bozkir, cost: 2000, desc: 'Her yerde gider, hiç durmaz', shape: 'bozkir', maxSpeed: 558, accel: 700, turnRate: 3.6, grip: 5, driftGrip: 0.74, durability: 1.62, mass: 1.5, len: 52, wid: 27, color: '#e8701a', accent: '#23272e', engine: { kind: 'v8', cyl: 8, idle: 620, red: 5800, gears: 5, gain: 1.15 }, egzozPatlamaSansi: 0.35 },
    { id: 'tilki', paints: [{ name: 'Tilki Turuncusu', color: '#ff6a1a', finish: 'gloss', accent: '#111318' }, { name: 'Gece Siyahı', color: '#111318', finish: 'gloss', accent: '#ff6a1a' }, { name: 'Mat Gri', color: '#5a6068', finish: 'matte', accent: '#ffd23f' }, { name: 'Buz Beyazı', color: '#eef3f8', finish: 'pearl', accent: '#2b6fd6' }], finish: 'gloss', name: NAMES.arabalar.tilki, cost: 2400, desc: 'Hafif, oynak drift coupe', shape: 'tilki', maxSpeed: 572, accel: 720, turnRate: 3.72, grip: 5.0, driftGrip: 0.68, durability: 1.66, mass: 1.05, len: 46, wid: 24, color: '#ff6a1a', accent: '#111318', engine: { kind: 'turbo', cyl: 4, idle: 1000, red: 8200, gears: 6, gain: 1.05 }, egzozPatlamaSansi: 0.55 },
    { id: 'kartal', paints: [{ name: 'Yarış Mavisi', color: '#1f5fbf', finish: 'gloss', accent: '#f4f6f8' }, { name: 'Kan Kırmızı', color: '#a3121f', finish: 'gloss', accent: '#f4f6f8' }, { name: 'Mat Siyah', color: '#16181c', finish: 'matte', accent: '#ffd23f' }, { name: 'Çift Ton Krem-Yeşil', color: '#e8dcbc', finish: 'gloss', roof: '#2f5a3a' }], finish: 'gloss', name: NAMES.arabalar.kartal, cost: 3200, desc: 'Uzun kaput, gürleyen V8', shape: 'kartal', maxSpeed: 586, accel: 760, turnRate: 3.6, grip: 5.05, driftGrip: 0.66, durability: 1.74, mass: 1.35, len: 52, wid: 26, color: '#1f5fbf', accent: '#f4f6f8', engine: { kind: 'v8', cyl: 8, idle: 560, red: 5400, gears: 4, gain: 1.25 }, egzozPatlamaSansi: 0.6 },
    { id: 'volt', paints: [{ name: 'Plazma Mavi', color: '#1fb8e8', finish: 'metal', accent: '#0c0e12' }, { name: 'Grafit', color: '#2e333b', finish: 'metal', accent: '#1fb8e8' }, { name: 'Mat Beyaz', color: '#e6e8ea', finish: 'matte', accent: '#1fb8e8' }, { name: 'Aurora Mor', color: '#6a3cd9', finish: 'pearl', accent: '#9fe8ff' }], finish: 'metal', name: NAMES.arabalar.volt, cost: 4500, desc: 'Sessiz ama çok hızlı elektrikli GT', shape: 'volt', maxSpeed: 600, accel: 860, turnRate: 3.78, grip: 5.15, driftGrip: 0.63, durability: 1.82, mass: 1.4, len: 52, wid: 26, color: '#1fb8e8', accent: '#0c0e12', engine: { kind: 'ev', cyl: 8, idle: 0, red: 26000, gears: 1, gain: 0.85 }, egzozPatlamaSansi: 0 },
    { id: 'kuzgun', paints: [{ name: 'Kuzgun Siyahı', color: '#0e0f14', finish: 'gloss', accent: '#ff2f6a' }, { name: 'Neon Kırmızı', color: '#e01a3c', finish: 'gloss', accent: '#0e0f14' }, { name: 'Mat Titanyum', color: '#7a828c', finish: 'matte', accent: '#21e6ff' }, { name: 'Çift Ton Beyaz-Siyah', color: '#f2f4f7', finish: 'pearl', roof: '#0e0f14' }], finish: 'gloss', name: NAMES.arabalar.kuzgun, cost: 60000, desc: '360° taramalı silahlı süper araba', shape: 'kuzgun', weapon: true, maxSpeed: 620, accel: 900, turnRate: 3.86, grip: 5.25, driftGrip: 0.6, durability: 1.95, mass: 1.3, len: 50, wid: 27, color: '#0e0f14', accent: '#ff2f6a', engine: { kind: 'super', cyl: 10, idle: 1100, red: 9200, gears: 7, gain: 1.15 }, egzozPatlamaSansi: 0.5 },
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

  // AŞAMA SIRASI: polis -> SWAT (swatAt) -> ağır takviye (advancedAt) -> uzaylılar (aliensAt) -> tanklar (tanksAt) -> meteor (meteor.at)
  difficulty: {
    swatAt: 50,
    advancedAt: 200,
    tanksAt: 300,
    aliensAt: 225, // Uzaylı arabaları gelir (CONFIG.aliens)
    firstSpawnAt: 5,
    // [saniye, değer] noktaları arasında doğrusal artar, yani her saniye biraz zorlaşır.
    // Polis sayısı, hızı ve davranışları aşağıdaki pursuit bölümündedir
    hpCurve: [[0, 1], [50, 1], [200, 1.9], [280, 2.3], [600, 3.5]],
    powerCurve: [[0, 0.65], [30, 0.8], [50, 0.9], [200, 1.25], [300, 1.32], [600, 1.55]], // Geç aşamada yumuşak: tank ve meteor zaten zorlaştırır
    maxActive: 24, // Mutlak üst sınır (barikat ve tank dahil). Cihaz sınırı quality.js ve pursuit.phoneCap
    swatShare: [[50, 0.15], [200, 0.3], [280, 0.25]],
    motoFrom: 15,
    motoShare: [[15, 0.12], [50, 0.2], [280, 0.18]],
    fastFrom: 25,
    fastShare: [[25, 0.12], [50, 0.2], [200, 0.22]],
    advancedShare: [[200, 0.3], [280, 0.5]],
    tankCount: [[300, 1], [380, 2], [500, 3]], // Aynı anda en çok tank: yavaş ama çok güçlü, kaçılabilir
    tankInterval: 26,
  },

  // ZORLUK EĞRİSİ: polis baskısının tüm ayarları burada. [saniye, değer] noktaları arası doğrusaldır.
  // Saniye = oyun süresi + heat (arananlık). Tek düğmeyle ayar: countMul sayı, speedMul hız.
  pursuit: {
    countMul: 1, // 0.7 kolay, 1 normal, 1.3 zor
    speedMul: 1,
    policeCurve: [[0, 1], [15, 2], [30, 3], [60, 7], [120, 12], [180, 16], [240, 20], [300, 24], [380, 20]], // Meteor aşamasında baskıyı meteorlar kurar
    spawnCurve: [[0, 6], [30, 4.5], [60, 2.8], [120, 1.8], [200, 1.2], [280, 0.9], [420, 0.7]],
    speedCurve: [[0, 0.93], [60, 0.97], [120, 1], [240, 1.04], [360, 1.07]],
    speedRatioMax: 0.97, // Polis son hızı oyuncu hızının bu oranını geçemez: düz yolda kaçılır
    aggressionCurve: [[0, 0.3], [50, 0.5], [200, 0.85], [280, 1], [600, 1.2]],
    flankerShare: [[0, 0], [30, 0.1], [60, 0.22], [120, 0.3], [200, 0.36]],
    interceptShare: [[45, 0], [60, 0.12], [200, 0.2]], // Önden gelen
    blockShare: [[90, 0], [120, 0.1], [240, 0.16]], // Yolu kapatan
    barricadeCurve: [[38, 22], [120, 16], [200, 12], [280, 9]],
    // Arananlık: oyuncunun yaptıkları süreye saniye olarak eklenir, durulunca söner
    heat: { kill: 5, nearMiss: 1, prop: 0.2, max: 60, decay: 0.3, from: 45 }, // from: bu saniyeden önce etkisiz, başlangıç kolay kalır
    // Adalet: oyuncunun çevresine aynı anda bu kadar polis girer, fazlası geride bekler
    closeCurve: [[0, 2], [120, 3], [240, 4]],
    closeR: 260,
    frontMax: 2, // Önünde aynı anda en çok bu kadar polis yaklaşır
    frontR: 360,
    holdEvery: 15, // Kaç adımda bir yeniden bakılır
    maxInterceptors: 2,
    maxBlockers: 1,
    pincerFrom: 60, // Bu saniyeden sonra kıskaç iki yandan sırayla gelir
    aheadSpread: 0.9, // Önden doğma açısı
    interceptAhead: 420,
    interceptBrake: 190, // Karşılaşmaya bu kala yavaşlar: oyuncu kaçacak yer görür
    interceptOffset: 44, // Tam burnuna değil, yanına gelir
    blockDist: 520,
    blockMinRoad: 120, // Bundan dar yol kapatılmaz: geçiş boşluğu kalsın
    blockTime: 5,
    roleTime: 9, // Görevini yapamayan normal kovalamaya döner
    // Performans. Üst sınır: masaüstünde kalite seviyesi (quality.js cops), dokunmatikte ayrıca phoneCap
    phoneCap: 12,
    farDist: 850, // Bu uzaklıkta ve ekran dışındaki polis hafif hesaplanır
    farStep: 3, // Uzak polis kaç adımda bir hesaplanır
    recycleDist: 1300, // Sınır doluyken bundan uzak, ekran dışı polis alınıp önde yeniden doğar
    recycleEvery: 1.2,
    maxSirens: 3, // Aynı anda çalan siren sesi, en yakınlar
  },

  // Gizli sıra. gap: her basış bir öncekinden bu süreden KISA sürede yapılmalı; gap ve üstü sırayı
  // baştan başlatır (1,9 sn geçerli, 2,0 sn geçersiz). maxHold: bunu aşan basılı tutma normal sürüş sayılır
  // ve sırayı bozar. wheelOn, stickOn: eksen eşiği, axisBack: yeniden saymak için merkeze dönüş eşiği
  cheat: {
    sequence: ['L', 'L', 'R', 'R', 'L', 'R', 'L', 'R', 'L', 'L', 'R', 'R'], // 12 basış; eski 8'li kod açmaz
    gap: 2,
    maxHold: 0.45, // Kod girişi kısa dokunuşlarla yapılır; sürüşteki basılı tutmalar sırayı bozar
    wheelOn: 0.45,
    stickOn: 0.6,
    axisBack: 0.2,
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
  sirens: ['wail', 'yelp', 'hilo', 'chirp', 'euro', 'rumble', 'horn', 'bip', 'pulse', 'warble', 'warp', 'zap'],

  // UZAYLI ARABALARI (çizgi film tarzı, uydurma). Güç sırası: polis < SWAT < uzaylı < tank (hp, ram, mass).
  // Hepsi oyuncudan YAVAŞTIR (speed < 1, pursuit.speedRatioMax ile de sınırlı): düz yolda kaçılır.
  // intro: "UZAYLILAR GELDİ!" yazısının süresi, shield: geçişte oyuncunun hasar almadığı süre (sn).
  // Geçişte wave kadar uzaylı ekran kenarına (edge: ekran yarı boyutuna oran) her yönden aynı anda ışınlanır; hiçbiri
  // oyuncuya safeR'den yakın doğmaz (ilk saniyelerde yetişemez). wake: belirdikten sonra yerinde bekleme (ışınlanma).
  // cap: aynı anda en çok uzaylı [saniye, sayı]; phoneCap / desktopCap cihaz tavanı. spawnEvery: eksilen yenisi
  aliens: {
    intro: 3, shield: 3, wave: 6, safeR: 420, edge: 0.95, wake: 1.2,
    cap: [[225, 6], [270, 7], [300, 5], [380, 4]], phoneCap: 8, desktopCap: 10, // Tanklar gelince işgal seyrelir
    spawnEvery: 3.2,
    types: {
      dart: { weight: 1.2, hp: 180, mass: 1.8, speed: 0.95, accel: 700, turnRate: 3.9, grip: 11, driftGrip: 6, len: 50, wid: 26, ram: 1.1, smart: 0.9, siren: 'zap', glow: '#39ff9c', body: '#5a3d9a' },
      blob: { weight: 1, hp: 230, mass: 2.6, speed: 0.9, accel: 620, turnRate: 3.3, grip: 10, driftGrip: 6, len: 54, wid: 34, ram: 1.3, smart: 0.85, siren: 'warp', glow: '#ff4fd8', body: '#1f8a6a' },
      crab: { weight: 0.7, hp: 320, mass: 3.8, speed: 0.85, accel: 520, turnRate: 2.7, grip: 10, driftGrip: 7, len: 62, wid: 40, ram: 1.55, smart: 0.75, siren: 'warp', glow: '#ffd23f', body: '#7a2a52' },
    },
  },

  // Oyuncu aracının altındaki ışık: NPC'lerden ayrılır
  playerGlow: { alpha: 0.34, scale: 1.5 },

  // Derin su: sahil, göl, gölet. Sığ suya girilir, derine düşen araç batar
  water: { sinkTime: 2.3, bubbleEvery: 0.06, shrink: 0.5, spin: 1.5, deepProbe: 6 },
  // POLİS, SWAT, UZAYLI, TANK VE TRAFİK DE SUYA DÜŞER. Yapay zekâ suyu engel bilir; ancak suya speed'den hızlı dalan,
  // ya da itilmiş (oyuncu çarpması, patlama, basınç dalgası: pushTime sn) ve pushSpeed'den hızlı giden araç düşer.
  // sink: batma süresi (tank tankSink), drift: batarken hız kaybı (1/sn), bubbles: kabarcık aralığı (yalnız ekrandaysa)
  vehWater: { speed: 230, pushSpeed: 50, pushTime: 0.9, sink: 2, tankSink: 3.6, drift: 2.4, bubbles: 0.09, shrink: 0.55 },

  policeAI: {
    despawnDist: 1900,
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

  // YOL KAPATMA: DUZ_GIDIS_SURESI sn aralıksız düz giden (direksiyon straightSteer altında, dönüş hızı straightYaw altında,
  // hız minSpeed üstünde) oyuncunun önü, yolun tüm genişliğini kaplayan polis arabalarıyla kapanır; geçilemez.
  // Önce uyarı (warn sn), sonra araçlar lead sn ileride (minDist-maxDist arası) belirir. Oyuncu ile barikat arasında
  // en az bir yan yol (side karo açık) yoksa kurulmaz, sonra yeniden denenir (retry). Oyuncu dönüp uzaklaşınca
  // (leaveAngle radyan, leaveDist) ya da life sn sonra dağılır. spacing: araç aralığı, maxCars: en çok araç,
  // cooldown: iki barikat arası, from: en erken saniye, meteorClear: bu yakında meteor varken kurulmaz
  roadblock: { DUZ_GIDIS_SURESI: 8, straightSteer: 0.22, straightYaw: 0.35, minSpeed: 140, from: 20, lead: 3.6, warn: 1, minDist: 650, maxDist: 1900, spacing: 40, maxCars: 11, side: 3, life: 18, leaveAngle: 1.2, leaveDist: 450, cooldown: 12, meteorClear: 900, retry: 0.5 },

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
    earnMul: 1.3, // Koşu sonu kazancı (toplanan, süre, devrilen polis, yakın kaçış) bu kadar artar; fiyatlar aynı
  },

  coin: { magnet: 56, dropChance: 0.3 },

  // HAVA DURUMU: her koşu başında seçilir (ayar: random ya da sabit). grip: lastik tutuşu çarpanı (oyuncu),
  // copShare: polisler etkinin bu kadarını hisseder (adil kalsın), fade: geçiş süresi (sn),
  // particles: en yüksek kalitede ekrandaki yağmur çizgisi / kar tanesi sayısı (kalite düştükçe azalır)
  weather: {
    types: ['sunny', 'rain', 'snow', 'fog', 'ice'],
    weights: { sunny: 40, rain: 22, snow: 14, fog: 12, ice: 12 },
    grip: { sunny: 1, rain: 0.86, snow: 0.8, fog: 1, ice: 0.35 },
    speed: { sunny: 1, rain: 1, snow: 0.97, fog: 1, ice: 0.98 },
    copShare: 0.5,
    fade: 3,
    particles: { rain: 170, snow: 150 },
    fogAlpha: 0.08, // Sis yalnız ekran kenarlarında; orta açık kalır (renkler solmaz)
    // RENK KORUMA: dünyaya genel örtü en fazla %8-10. fogFlat: sisin tüm ekrana düz katkısı, rainTint: ıslak zemin koyuluğu,
    // iceTint: buzlu yol mavi tonu. Kar ve buz zemini beyazlatmaz; yalnız üst yüzeylere işlenir (CONFIG.snow)
    fogFlat: 0.025, rainTint: 0.06, iceTint: 0.02,
    // Yağan kar katmanları: share pay, size boyut (px), alpha, fall düşüş hızı, sway salınım
    flakes: [
      { share: 0.45, size: [1, 1.6], alpha: 0.34, fall: 38, sway: 10 },
      { share: 0.35, size: [1.8, 2.8], alpha: 0.52, fall: 64, sway: 18 },
      { share: 0.2, size: [3.4, 5.2], alpha: 0.74, fall: 96, sway: 26 },
    ],
    wind: 14, // Karın yana kayması (px/sn)
  },

  // KAR (yalnız kar havasında): çatı karı oyun süresince kalınlaşır. start: başlangıç kalınlığı (0-1), grow: tam kalınlığa
  // kadar saniye, steps: kalınlık adımı (her adımda çatılar arka planda yeniden işlenir), edge: çatı kenar payı,
  // gap: kar yığınları arası çatı rengi boşluğu, bare: boş kalan (rüzgârın süpürdüğü) hücre oranı, alpha: kar opaklığı,
  // cacheScale: yüksek bina önbelleği ölçeği, near: ayrıntı uzaklığı
  snow: { start: 0.35, grow: 150, steps: 4, edge: 5, gap: 14, bare: 0.3, alpha: 0.93, cacheScale: 0.8, near: 1100, cache: 90 },
  // BUZ SARKITLARI (buzlu havada): len uzunluk, width genişlik, gap gruplar arası boşluk, glints bina başına parıltı,
  // drip damlama hızı, near: canlı parıltı ve damla bu uzaklıkta, maxFx: karede en çok parıltı/damla
  icicles: { len: [7, 22], width: [3, 5.2], gap: [3, 14], glints: 4, drip: 1.6, near: 900, maxFx: 32 },

  // ÖZELLEŞTİRME: satın alınan öğe kalıcıdır ve bütün arabalarda ücretsiz seçilir; seçim araba başına kaydedilir.
  // Fiyatı 0 olan öğe baştan açıktır. finish: gloss parlak, metal metalik, matte mat, pearl inci
  custom: {
    paints: [
      { id: 'gece', color: '#0d0f14', finish: 'gloss', price: 30 }, { id: 'gumus', color: '#c0c6ce', finish: 'metal', price: 30 },
      { id: 'kiraz', color: '#c8102e', finish: 'gloss', price: 30 }, { id: 'okyanus', color: '#1565c0', finish: 'metal', price: 50 },
      { id: 'zumrut', color: '#0f8a5f', finish: 'metal', price: 50 }, { id: 'limon', color: '#f4d80c', finish: 'gloss', price: 50 },
      { id: 'mandalina', color: '#ff7a00', finish: 'gloss', price: 50 }, { id: 'lavanta', color: '#9b7fd6', finish: 'matte', price: 50 },
      { id: 'pembe', color: '#f49ac1', finish: 'gloss', price: 50 }, { id: 'haki', color: '#6b6f4a', finish: 'matte', price: 80 },
      { id: 'fume', color: '#4a4f57', finish: 'matte', price: 80 }, { id: 'bakir', color: '#b8683a', finish: 'metal', price: 80 },
      { id: 'lacivert', color: '#1a2a5a', finish: 'metal', price: 80 }, { id: 'neonyesil', color: '#39ff14', finish: 'gloss', price: 120 },
      { id: 'neonpembe', color: '#ff2fa0', finish: 'gloss', price: 120 }, { id: 'mor', color: '#7a2cff', finish: 'metal', price: 120 },
      { id: 'inci', color: '#f2efe8', finish: 'pearl', price: 120 }, { id: 'altin', color: '#d4a017', finish: 'metal', price: 200 },
      { id: 'krom', color: '#dfe6ee', finish: 'metal', price: 250 }, { id: 'lav', color: '#ff3b1f', finish: 'pearl', price: 200 },
    ],
    rims: [
      { id: 'std', price: 0 }, { id: 'yildiz', price: 60 }, { id: 'cok', price: 90 }, { id: 'spor', price: 120 },
      { id: 'derin', price: 150 }, { id: 'turbin', price: 180 }, { id: 'karbon', price: 200 }, { id: 'altin', price: 250 },
    ],
    // fx: static sabit, breathe nefes alır, rainbow gökkuşağı
    leds: [
      { id: 'yok', price: 0, color: '', fx: 'static' }, { id: 'mavi', price: 100, color: '#21d4fd', fx: 'static' },
      { id: 'pembe', price: 100, color: '#ff2fa0', fx: 'static' }, { id: 'mor', price: 120, color: '#9b5cff', fx: 'static' },
      { id: 'yesil', price: 120, color: '#39ff7a', fx: 'static' }, { id: 'beyaz', price: 140, color: '#eef6ff', fx: 'static' },
      { id: 'kirmizi', price: 160, color: '#ff2a3c', fx: 'breathe' }, { id: 'buz', price: 160, color: '#9fe8ff', fx: 'breathe' },
      { id: 'altin', price: 180, color: '#ffc93c', fx: 'breathe' }, { id: 'gokkusagi', price: 300, color: '#ff2fa0', fx: 'rainbow' },
    ],
    ledAlpha: 0.5, ledNight: 0.45, // Gündüz ve gece ek parlaklığı
    // EGZOZ SESİ: her biri EGZOZ_FIYATI para, Standart ücretsiz. Çarpanlar motor sesine uygulanır (js/audio.js):
    // pitch perde, sub alt bas, rough egzoz vuruşu ("bam bam"), bright tiz pay, lp süzgeç açıklığı, gain ses, drive bozulma,
    // pops egzoz patlaması şansı katı, turbo turbo ıslığı ve boşalma, tip garajdaki egzoz ucu (pixelcars.js)
    EGZOZ_FIYATI: 1000,
    exhausts: [
      { id: 'std', price: 0, pitch: 1, sub: 1, rough: 1, bright: 1, lp: 1, gain: 1, drive: 1, pops: 1, turbo: 0, tip: 'std', color: '#9aa3ad' },
      { id: 'v8', price: 1000, pitch: 0.82, sub: 1.55, rough: 1.7, bright: 0.85, lp: 0.85, gain: 1.22, drive: 1.35, pops: 1.3, turbo: 0, tip: 'dual', color: '#d7dde5' },
      { id: 'patlamali', price: 1000, pitch: 0.95, sub: 1.2, rough: 1.4, bright: 1.1, lp: 1.05, gain: 1.12, drive: 1.5, pops: 4, turbo: 0, tip: 'flame', color: '#ff7a1a' },
      { id: 'turbo', price: 1000, pitch: 1.06, sub: 0.95, rough: 0.8, bright: 1.25, lp: 1.25, gain: 1.08, drive: 1.1, pops: 1, turbo: 1, tip: 'big', color: '#7fd9ff' },
      { id: 'spor', price: 1000, pitch: 1.25, sub: 0.7, rough: 0.9, bright: 1.7, lp: 1.55, gain: 1.05, drive: 1.25, pops: 1.6, turbo: 0, tip: 'quad', color: '#ffd23f' },
      { id: 'derin', price: 1000, pitch: 0.7, sub: 1.9, rough: 1.25, bright: 0.65, lp: 0.7, gain: 1.28, drive: 1.2, pops: 0.8, turbo: 0, tip: 'wide', color: '#4a4f57' },
    ],
  },

  // 360° OTOMATİK TARAMALI SİLAH (weapon: true olan araçlar: 42-66 arabası ve gizli motosiklet; js/gun.js ortak).
  // Araç hangi yöne bakarsa baksın EKRANDA GÖRÜNEN düşmanlara ateş eder; ekran dışına ateş etmez. Düğme yok, cephane sınırsız.
  // rate: saniyede mermi (5-10 arası). damage: her merminin sabit hasarı. hp: oyunun başındaki silah canı (tür başına).
  // Gereken mermi = tavan(hp / damage): polis 22, hızlı polis 22, motor 20, gelişmiş 30, SWAT 55, uzaylı 75/80/88, tank 120.
  // Yeni çıkanların canı zamanla artar (copHpGrowth), yani bu sayılar en azdır.
  // speed: mermi hızı, life: ömür (sn), inset: hedefin ekran kenarından bu kadar içeride olması gerekir,
  // maxBullets: havuz, maxTracers: aynı anda çizilen iz, hitR: isabet payı.
  // Hedef: önce tehlikeli ve yakın olana ama bekleyen her hedefin önceliği zamanla artar (wait), takılıp kalmaz
  weapon: {
    rate: 7, damage: 10, speed: 1500, life: 0.75, inset: 8, maxBullets: 24, maxTracers: 18, hitR: 10, spread: 0.035,
    hp: { car: 220, fast: 220, moto: 200, advanced: 300, swat: 550, dart: 750, blob: 800, crab: 880, tank: 1200 },
    danger: { car: 1, fast: 1.1, moto: 0.9, advanced: 1.3, swat: 1.5, dart: 1.7, blob: 1.8, crab: 1.9, tank: 2.2 },
    wait: 3.2, near: 900, maxSparks: 3,
  },

  // ZAMANLA ARTAN POLİS CANI (silah canı, bütün arabalarda). Yeni çıkan polisin canı = hp * min(max, perMin ^ dakika).
  // Sahadaki polisler değişmez. %12 / dk: 2. dk 1,25x, 5. dk 1,76x, ~9,7. dk'dan sonra 3x tavan
  copHpGrowth: { perMin: 1.12, max: 3 },

  // iPhone/iPad ana ekrana ekle rehberi: delay menü açıldıktan sonra kartın görünme gecikmesi (sn), key kayıt anahtarı
  a2hs: { delay: 1.2, key: 'drift-lab-a2hs' },
  // Cumhuriyet Meydanı anıtı (js/memorial.js). Korunan bölüm (rect) herkese katı engeldir; oyuncu girmeye çalışırsa araba patlar.
  // rect: chunk içindeki karo sınırı [x0, y0, x1, y1]. Uzaklıklar korunan bölümün kenarından dünya birimiyle
  memorial: {
    rect: [9, 5, 26, 24],
    warnDist: 170, warnReset: 330, // "Anıt alanı" uyarısı, yeniden uyarı için uzaklaşma
    readDist: 560, readClose: 760, // Okuma kartı açılır / kapanır
    penalty: 30, // Para cezası (0'ın altına inmez)
    explosion: 115, explosionShift: 70, // Patlama yarıçapı; ateş topu anıttan dışarı bu kadar kayar
    scroll: { delay: 2.4, speed: 16 }, // Kartta bekleme (sn) ve kayma hızı (px/sn)
    // Önbellekli çizim: yakında yüksek çözünürlük, uzakta sade. Ölçek: dünya birimi başına piksel
    art: { hiScale: 1.6, loScale: 0.5, hiNear: 2000, hiFree: 3600, loFree: 5200, hiMinPx: 0.9 },
    flag: { slices: 9, wave: 2.4, amp: 0.09 },
  },

  // KORUNAN ALANLAR: meteor, tank mermisi, silah mermisi, barikat ve doğma bu kutuların (margin kadar genişletilmiş)
  // içine giremez. Anıt (memorial.rect), gizli geçit (secret.ramp) ve iki stadyum (stadiums.*.rect)
  protect: { memorial: 320, secret: 360, stadium: 170, bullet: 0 },

  // METEOR YAĞMURU (tanklardan sonra). Her dalganın ASIL meteoru oyuncuyu hedef alır: çarpma anında arabanın olacağı
  // nokta tahmin edilir (konum + hız x (warn + fall)), yol üzerinde tutulur ve kilitlenir (sonra takip etmez).
  // Hız değişimi ya da dönüşle kaçılabilir. Dalgadaki diğerleri çevreye düşen meteorlardır (onlar da zarar verir).
  // warn: nişanın görünmesinden düşüşün başlamasına kadar (ASLA 3'ün altına inmez), fall: gökten düşüş süresi.
  // radius: çarpma dairesi (nişan bu kadar), minR: asıl nişan oyuncuya en az bu uzaklıkta (tam üstünde doğmaz),
  // maxLead: hızlı araçta nişan en çok bu kadar ileride, road: tahmini nokta bu yarıçapta yola çekilir.
  // every / perWave: dalga aralığı ve sayısı (zamanla artar), max: aynı anda en çok meteor.
  // randMin / randMax: çevre meteorlarının oyuncuya uzaklığı. quake / quakeShake: çarpmada kamera sarsıntısı süresi ve gücü,
  // flash: beyaz parlama süresi, trail: düşerken saniyede duman/alev parçası, blink: son bu kadar saniyede hızlı yanıp söner
  meteor: {
    at: 380, warn: 3, fall: 0.7, radius: 64,
    every: [[380, 4.6], [460, 3.6], [560, 2.8], [700, 2.1]],
    perWave: [[380, 1], [450, 2], [540, 3], [680, 4]],
    max: 7, minR: 170, maxLead: 1500, road: 80, randMin: 260, randMax: 760,
    tankDamage: 450, shake: 12, quake: 1.5, quakeShake: 9, flash: 0.18, sparks: 16, dust: 12, crater: 52, debris: 14,
    trail: 40, blink: 1,
  },

  // MOTOR SESİ (bütün araçlar): pitch taban frekans katı (düşük = ağır), sub alt bas katmanı, drive yumuşak bozulma,
  // rough egzoz vuruşu derinliği, gain toplam ses, shift vites vuruşu, maxVoices aynı anda en çok kısa ses,
  // limiter çıkış sınırlayıcı (bozulma olmasın): threshold dB, ratio, attack/release sn, ceiling son kazanç
  sound: { pitch: 0.74, sub: 0.55, drive: 1.6, rough: 0.16, gain: 1.45, shift: 0.32, maxVoices: 26, popGap: 0.08, popFlame: 0.7,
    limiter: { threshold: -12, knee: 6, ratio: 14, attack: 0.002, release: 0.22, ceiling: 0.9 } },

  // GİZLİ GEÇİT: ücra köşedeki (landmark 'gecit') terk edilmiş depo alanının güneydoğu köşesinde rampa.
  // ramp: chunk içindeki karo kutusu [x0, y0, x1, y1]. Girince bodrum sahnesi (scene sn), sonra oyuna dönülür.
  // minSpeed: rampaya bu hızla girilince tetiklenir, shield: dönüşte hasar almama süresi
  // GIZLI_YAZI_SURESI: karşılama yazısının ekranda kalma süresi (sn, 5-10 arası), oyunu engellemez
  secret: { ramp: [27, 27, 30, 30], scene: 3.2, slide: 0.9, minSpeed: 30, shield: 3, GIZLI_YAZI_SURESI: 7 },

  // İKİ STADYUM (js/stadium.js çizer). rect: chunk içindeki karo kutusu. Yıkılmaz, katı, polis ve trafik dolanır.
  // Adlar isim tablosunda (NAMES.stadyum). art: önbellekli çizim ölçekleri, fans: taraftar siluetleri bu yakında
  stadiums: {
    yozgat: { rect: [11, 9, 23, 20], cap: 15000 },
    konya: { rect: [6, 6, 28, 26], cap: 42000 },
    art: { hiScale: 1.25, loScale: 0.32, hiNear: 1900, hiFree: 3600, loFree: 6000 },
    fans: 900, flagWave: 2.2,
  },

  // GİZLİ MOTOSİKLET: satılmaz, galeride, dükkânda ve kod bölümünde görünmez. Yalnız gizli geçidi bulan oyuncunun
  // garajında belirir (storage.secret). Silahı 42-66 arabasıyla aynıdır (weapon: true, js/gun.js)
  secretCar: { id: 'golge', secret: true, weapon: true, paints: [{ name: 'Gece Nöbeti', color: '#111321', finish: 'gloss', accent: '#21e6ff' }, { name: 'Neon Pembe', color: '#1a0f1f', finish: 'gloss', accent: '#ff2fa0' }, { name: 'Zehir Yeşili', color: '#0f1a14', finish: 'matte', accent: '#39ff7a' }, { name: 'Gümüş Hayalet', color: '#c9d1dc', finish: 'metal', accent: '#7a2cff' }], finish: 'gloss', name: 'Gölge R', cost: 0, desc: 'Gizli geçidin hediyesi', shape: 'golge', maxSpeed: 650, accel: 1000, turnRate: 4.1, grip: 5.4, driftGrip: 0.9, durability: 1.5, mass: 0.8, len: 38, wid: 16, color: '#111321', accent: '#21e6ff', engine: { kind: 'beast', cyl: 2, idle: 950, red: 11500, gears: 6, gain: 1.75 }, egzozPatlamaSansi: 0.85 },

  // Gizli kodlar: yazılan metin büyük harfe çevrilir, harf ve rakam dışı her şey atılır ("42-66", "42 66" = "4266").
  // Yeni kod eklemek için satır eklenir. car: açılan araba
  codes: [{ code: '4266', car: 'kuzgun' }],

  // KIL PAYI KAÇIŞ: polis çok yakından geçip çarpmadan atlatılınca anında para.
  // distMul: yakınlık eşiği (araç gövdeleri arasındaki boşluk, oyuncu genişliğinin katı),
  // exitMul: mesafe bu kat açılınca kaçış sayılır, minSpeed: oyuncunun en düşük hızı,
  // cooldown: aynı polisten tekrar ödül için bekleme (sn), globalGap: iki ödül arası en kısa süre,
  // maxClose: bundan uzun yakında kalmak sıkışmadır (ödül yok), minTravel: yakında geçerken alınan en kısa yol,
  // comboEvery / comboBonus / comboWindow: art arda kaçışlarda her N'de bir küçük ek
  escape: { distMul: 1.5, exitMul: 1.35, minSpeed: 220, min: 5, max: 10, cooldown: 3, globalGap: 0.5, maxClose: 1.6, minTravel: 70, comboEvery: 3, comboBonus: 2, comboWindow: 8 },

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
    bigshops: [NAMES.tekil.ishani, 'Merkez İş Merkezi', 'Kristal Plaza', 'Boğaz Tower', 'Anadolu Plaza', 'Sultan Rezidans', 'Lale Rezidans', 'Marmara Residence', 'Mavi Kule', 'Atlas Tower'],
    hotels: ['Grand Otel', 'Otel Boğaz', 'Park Hotel', NAMES.tekil.otel, 'Otel Saray', 'Mavi Otel'],
    shops: [...NAMES.konya.firinlar, 'Usta Döner', 'İskender Sarayı', 'Karadeniz Pide', 'Urfa Lahmacun', 'Adana Kebapçısı', 'Nöbetçi Eczane', 'Ekmek Fırını', 'Bayan Kuaförü', 'Erkek Berberi', 'Köşe Büfe', 'Köşe Bayii', 'Piksel Oyun Salonu', 'Bit Bilgisayar', 'Telefoncu', NAMES.tekil.doner, 'Soslu Döner', 'Eczane', 'Fırın', 'Dönerci', 'İskenderci', 'Pideci', 'Lahmacun', 'Kebapçı', 'Büfe', 'Çay Ocağı', 'Kuaför', 'Tost Evi', 'Bakkal', 'Kahveci', 'Çınar Kafe', 'Berber', 'Lokanta', 'Börekçi', 'Kasap', 'Manav', 'Züccaciye', 'Kırtasiye', 'Emlakçı', 'Terzi', 'Tuhafiye', 'Ciğerci', 'Tatlıcı', 'Çiğköfte', 'Tamirci', 'Oto Yıkama', 'Usta Dönerci', 'Hacı Usta Pide', 'Kardeşler Bakkal', 'Büfe 7/24', 'Mahalle Çay Ocağı', 'Öz Urfa Kebap', 'Çınar Kafe'],
    chains: Object.fromEntries(NAMES.zincirler.map((c) => [c.ad, c.renk])),
    chainIds: Object.fromEntries(NAMES.zincirler.map((c) => [c.ad, c.id])),
    banks: Object.fromEntries(NAMES.bankalar.map((b) => [b.ad, b.renk])),
    sites: ['Yeşil Tepe Sitesi', 'Boğaz Evleri', 'Mavi Konak Sitesi', 'Çamlık Sitesi', 'Güneş Sitesi', 'Lale Evleri', 'Marmara Konutları', 'Park Evleri'],
    // Dükkân önü: indirim yazıları ve görülme olasılıkları
    promos: ['%30 İNDİRİM', 'BUGÜNE ÖZEL', '%50 İNDİRİM', '2 AL 1 ÖDE', 'KAMPANYA', 'FIRSAT!', 'YENİ AÇILDI', 'SON GÜN'],
    front: { promo: 0.34, dancer: 0.12, donerDancer: 0.6 },
    cafes: ['Melodi Kafe', 'Akustik Kafe', 'Sahne Kafe', 'Çınaraltı Çay Bahçesi', 'Bahçe Çay Evi', 'Çay Bahçesi', 'Demir Spor Salonu', 'Kondisyon Spor Salonu'],
    cafeColors: ['#c9773b', '#3f8f6b', '#8a5fb0', '#d1a03c'],
    neon: ['#ff2a6d', '#21d4fd', '#b967ff', '#05ffa1', '#fffb96'],
    markets: ['Ucuzluk Market', 'Bereket Gross', 'Komşu Market', 'Anadolu Gross', 'Yıldız Gross', 'Hesaplı Market', 'Doyuran Gross', 'Tasarruf Market'],
    colors: ['#c8261e', '#1d6fb8', '#178a4d', '#d97706', '#6d28a8', '#0f766e', '#be185d', '#1f2937'],
  },

  // Gece-gündüz: tek döngü süresi (saniye). start: başlangıç evresi (0 gündüz, 0.55 gece başı)
  day: { length: 170, start: 0.08, duskFrom: 0.38, nightFrom: 0.56, dawnFrom: 0.82, darkness: 0.62 },

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

  // Balkon canlılığı: yalnızca oyuncunun bu yakınındaki binalarda çizilir
  balcony: { range: 560, maxDrawn: 26 },

  perf: { maxParticles: 380, maxSkids: 900, maxDecals: 24, bakeScale: 0.72, bakePool: 9, bakeBudget: 3 },
};

// Hız çarpanlarını uygula: yukarıdaki sayılar temel değerdir, ayar speedScale üzerinden yapılır
{
  const S = CONFIG.speedScale;
  for (const c of [...CONFIG.cars, CONFIG.secretCar]) c.maxSpeed = Math.round(c.maxSpeed * S.player);
  for (const t of Object.values(CONFIG.npc.types)) t.cruise = Math.round(t.cruise * S.npc);
  const H = CONFIG.highwayTraffic;
  H.speed = H.speed.map((v) => Math.round(v * S.highway));
  H.truckSpeed = H.truckSpeed.map((v) => Math.round(v * S.highway));
  CONFIG.npc.panicSpeed = Math.round(CONFIG.npc.panicSpeed * S.player);
}

// Yıldız seviyesi: başlangıçta 1, her eşikte artar
export const MAX_STARS = 4;

// Araç bul: satılık arabalar ve gizli motosiklet
export function carById(id) {
  return CONFIG.cars.find((c) => c.id === id) || (CONFIG.secretCar.id === id ? CONFIG.secretCar : null);
}
