// Üretilmiş dosya, elle düzenlemeyin. Kaynak: js/*.js (npm run bundle)
(function () {
'use strict';
// --- names.js ---
// Üretilmiş dosya, elle düzenlemeyin. Kaynak: names/tablo.mjs (npm run names)
// Sürüm: play
const FLAVOR = 'play';
const NAMES = {
 "oyun": "Drift Lab",
 "indir": "",
 "kolej": {
  "ad": "MANDALİNA KOLEJİ",
  "ust": "MANDALİNA"
 },
 "okullar": {
  "serife": "Anadolu Fen Okulu",
  "ted": "Bozkır Koleji",
  "gundogdu": "Gün Işığı Koleji"
 },
 "kule": "Bozkır Kulesi",
 "konya": {
  "mevlana": "Mevlana Müzesi",
  "alaaddin": "Alaaddin Camii",
  "tepe": "Alaaddin Tepesi",
  "kongre": "Selçuklu Kongre Merkezi",
  "kulturpark": "Kültürpark",
  "zafer": "Zafer Meydanı",
  "bedesten": "Bedesten Çarşısı",
  "meram": "Meram Bağları",
  "duraklar": [
   "Alaaddin",
   "Zafer",
   "Mevlana",
   "Kültürpark",
   "Kongre Merkezi"
  ],
  "firinlar": [
   "Etli Ekmek Fırını",
   "Konya Fırını",
   "Fırın Kebabı",
   "Etliekmek Salonu",
   "Bamya Çorbası"
  ]
 },
 "arabalar": {
  "atmaca": "Atmaca",
  "motor": "Motosiklet",
  "granit": "Granit SUV",
  "elektra": "Elektra X1",
  "simsek": "Şimşek",
  "cinar": "Çınar A",
  "efe": "Efe 131",
  "marmara": "Marmara S",
  "liva": "Liva",
  "bozkir": "Bozkır 4x4"
 },
 "zincirler": [
  {
   "id": "pazarcik",
   "ad": "Pazarcık Market",
   "renk": "#3f8f5b"
  },
  {
   "id": "ucuzlar",
   "ad": "Ucuzlar",
   "renk": "#7b3fa0"
  },
  {
   "id": "sepet",
   "ad": "Sepet Market",
   "renk": "#1f9e9e"
  },
  {
   "id": "yildiz",
   "ad": "Yıldız Mağazaları",
   "renk": "#c23b6b"
  },
  {
   "id": "dortyol",
   "ad": "Dörtyol Market",
   "renk": "#6a7f2a"
  },
  {
   "id": "teknoloji",
   "ad": "Teknoloji Durağı",
   "renk": "#2b3a67"
  },
  {
   "id": "yapi",
   "ad": "Yapı Dünyası",
   "renk": "#8a5a2b"
  },
  {
   "id": "kose",
   "ad": "Köşe Bakkal",
   "renk": "#b5651d"
  }
 ],
 "bankalar": [
  {
   "ad": "Yıldız Bankası",
   "renk": "#3b3f8f"
  },
  {
   "ad": "Anadolu Tasarruf",
   "renk": "#8a6d1f"
  },
  {
   "ad": "Bereket Bankası",
   "renk": "#6b8e23"
  },
  {
   "ad": "Güven Kredi",
   "renk": "#5b2a86"
  },
  {
   "ad": "Marmara Yatırım",
   "renk": "#0f6e84"
  }
 ],
 "siteler": {
  "buyuk1": "Yeşilvadi Sitesi",
  "buyuk2": "Mavi Orman Sitesi"
 },
 "tekil": {
  "ishani": "Merkez Çarşı İş Hanı",
  "otel": "Sahil Palas Oteli",
  "doner": "Nane Döner"
 }
};

// --- config.js ---
// Oyunun TÜM ayarları burada. Denge değiştirmek için yalnızca bu dosyayı düzenleyin,
// ardından `npm run bundle` çalıştırın (file:// kopyası için).


const GROUND = { GRASS: 0, ROAD: 1, WALK: 2, PLAZA: 3, WATER: 4, SAND: 5, DIRT: 6, SHALLOW: 7, FIELD: 8, ALLEY: 9, TRACK: 10 };

// Bina stilleri. 0-6 şehir çatıları, sonrası js/art.js içinde özel çizilir
const BUILD = {
  TOWER_GLASS: 7, TOWER_ROUND: 8, TOWER_STEP: 9, HUT: 10, LIFEGUARD: 11, LIGHTHOUSE: 12, CABIN: 13,
  FIRETOWER: 14, ADOBE: 15, MESA: 16, BARN: 17, SILO: 18, WINDMILL: 19, WATERTOWER: 20, GAS: 21,
  APARTMENT: 22, MARKET: 23, KOLEJ: 24, BAZAAR: 25, CHAIN: 26, BANK: 27, RESIDENCE: 28, OFFICE: 29, HOTEL: 30,
  HOSPITAL: 31, SCHOOL: 32, MOSQUE: 33, STADIUM: 34, SITE_BLOCK: 35, GECEKONDU: 36, VILLA: 37, ISHANI: 38, SHOPROW: 39, CAFE: 40, SHOP: 41, SKYSCRAPER: 42, RUIN: 43, SITEWORK: 44, FACTORY: 45,
  // Özel yerler (js/landmarks.js çizer)
  SERVIS: 46, MUZE: 47, SELCUK_CAMI: 48, KONGRE: 49, KULE: 50, AVM: 51, BEDESTEN: 52, BAGEVI: 53, OZEL_OKUL: 54, ANIT: 55,
};

const CONFIG = {
  name: NAMES.oyun,
  version: '15.0.0',
  // Arkadaş sürümünün indirme adresi isim tablosundadır; Play sürümü kendi sürümünün APK'sını gösterir
  apkUrl: NAMES.indir || 'https://github.com/caglarsaglammmmm-code/kacis-oyunu/releases/download/driftlab-v15.0.0/DriftLab-PlayStore.apk',

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
    sistemRing: [4, 9], // Kolej: başlangıçtan bu kadar chunk uzakta
    // Tek seferlik özel yerler: her biri kendi chunk'ında, başlangıçtan ring kadar uzakta, birbirinden ayrı.
    // Adlar isim tablosundadır (names/tablo.mjs)
    landmarks: [
      { id: 'mevlana', ring: [2, 5] }, { id: 'alaaddin', ring: [3, 6] }, { id: 'zafer', ring: [2, 6] },
      { id: 'serife', ring: [2, 5] }, { id: 'bedesten', ring: [3, 7] }, { id: 'kongre', ring: [4, 8] },
      { id: 'kule', ring: [4, 8] }, { id: 'kulturpark', ring: [4, 9] }, { id: 'ted', ring: [5, 10] },
      { id: 'gundogdu', ring: [5, 10] }, { id: 'meram', ring: [6, 11] },
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
    { id: 'atmaca', paints: [{ name: 'Mahalle Beji', color: '#d9d4c7', finish: 'gloss' }, { name: 'Şarap Kırmızı', color: '#8e1b24', finish: 'metal' }, { name: 'Mat Asker Yeşili', color: '#4d5a3a', finish: 'matte' }, { name: 'Çift Ton Krem-Bordo', color: '#e6dcc2', finish: 'gloss', roof: '#6d1620' }], finish: 'gloss', name: NAMES.arabalar.atmaca, cost: 0, desc: 'Her mahallenin emektarı', shape: 'atmaca', maxSpeed: 432, accel: 520, turnRate: 3.2, grip: 4.5, driftGrip: 1.15, durability: 1, mass: 1, len: 48, wid: 24, color: '#d9d4c7', accent: '#8a1f1f', engine: { kind: 'old', cyl: 4, idle: 800, red: 5000, gears: 4, gain: 1 } },
    { id: 'motor', paints: [{ name: 'Yarış Kırmızı', color: '#e8352e', finish: 'gloss', accent: '#ffe14d' }, { name: 'Elektrik Mavi', color: '#0a7cff', finish: 'metal', accent: '#ffffff' }, { name: 'Mat Siyah', color: '#1b1d22', finish: 'matte', accent: '#ff7a00' }, { name: 'İnci Beyaz', color: '#f2f4f7', finish: 'pearl', accent: '#e8352e' }], finish: 'gloss', name: NAMES.arabalar.motor, cost: 100, desc: 'Dar sokakların kralı', shape: 'moto', maxSpeed: 445, accel: 610, turnRate: 3.3, grip: 4.5, driftGrip: 1.1, durability: 1.05, mass: 0.9, len: 36, wid: 16, color: '#e8352e', accent: '#ffe14d', engine: { kind: 'moto', cyl: 4, idle: 1500, red: 12500, gears: 6, gain: 0.8 } },
    { id: 'granit', paints: [{ name: 'Gece Mavisi', color: '#1f3a68', finish: 'metal' }, { name: 'Kor Turuncu', color: '#e8551e', finish: 'metal' }, { name: 'Mat Gümüş', color: '#a7aeb7', finish: 'matte' }, { name: 'İnci Beyaz', color: '#f2f4f7', finish: 'pearl' }], finish: 'metal', name: NAMES.arabalar.granit, cost: 200, desc: 'Yüksek ve güvenli SUV', shape: 'granit', maxSpeed: 458, accel: 540, turnRate: 3.24, grip: 4.6, driftGrip: 1.05, durability: 1.12, mass: 1.15, len: 52, wid: 27, color: '#3b4a5c', accent: '#d7dde5', engine: { kind: 'diesel', cyl: 4, idle: 750, red: 4300, gears: 6, gain: 1 } },
    { id: 'elektra', paints: [{ name: 'Anadolu Kırmızı', color: '#b3122a', finish: 'metal' }, { name: 'Fırtına Grisi', color: '#4a5560', finish: 'metal' }, { name: 'Mat Toprak', color: '#8a6a4a', finish: 'matte' }, { name: 'Buz Mavisi', color: '#bcd9e6', finish: 'pearl' }], finish: 'metal', name: NAMES.arabalar.elektra, cost: 320, desc: 'Sessiz, güçlü, elektrikli', shape: 'elektra', maxSpeed: 472, accel: 680, turnRate: 3.28, grip: 4.6, driftGrip: 1, durability: 1.18, mass: 1.2, len: 50, wid: 26, color: '#b3122a', accent: '#111418', engine: { kind: 'ev', cyl: 6, idle: 0, red: 24000, gears: 1, gain: 0.7 } },
    { id: 'simsek', paints: [{ name: 'Mat Siyah Sarı Şerit', color: '#111318', finish: 'matte', accent: '#ffd23f' }, { name: 'Ateş Turuncu', color: '#ff5a12', finish: 'gloss', accent: '#111318' }, { name: 'Neon Yeşil', color: '#39d353', finish: 'gloss', accent: '#111318' }, { name: 'Mor Metalik', color: '#6a2bd9', finish: 'metal', accent: '#21d4fd' }], finish: 'matte', name: NAMES.arabalar.simsek, cost: 480, desc: 'Abartılı spoyler, tam tuning', shape: 'simsek', maxSpeed: 486, accel: 590, turnRate: 3.32, grip: 4.7, driftGrip: 0.95, durability: 1.24, mass: 1.1, len: 48, wid: 24, color: '#111318', accent: '#ffd23f', engine: { kind: 'turbo', cyl: 4, idle: 950, red: 7400, gears: 5, gain: 1 } },
    { id: 'cinar', paints: [{ name: 'Efsane Turuncu', color: '#e8782a', finish: 'gloss', accent: '#f6efe0' }, { name: 'Bebek Mavisi', color: '#7ec6e8', finish: 'gloss', accent: '#f6efe0' }, { name: 'Çift Ton Krem-Vişne', color: '#ead9b0', finish: 'gloss', roof: '#8a1f2f' }, { name: 'Mat Zeytin', color: '#6b6b3a', finish: 'matte', accent: '#f6efe0' }], finish: 'gloss', name: NAMES.arabalar.cinar, cost: 680, desc: 'Klasik efsane', shape: 'cinar', maxSpeed: 500, accel: 600, turnRate: 3.36, grip: 4.7, driftGrip: 0.9, durability: 1.3, mass: 1.15, len: 50, wid: 24, color: '#e8782a', accent: '#f6efe0', engine: { kind: 'old', cyl: 3, idle: 700, red: 4600, gears: 4, gain: 1.05 } },
    { id: 'efe', paints: [{ name: 'Boğaz Mavisi', color: '#2f6fb0', finish: 'gloss' }, { name: 'Haki', color: '#75805a', finish: 'matte' }, { name: 'Gümüş', color: '#b9c1ca', finish: 'metal' }, { name: 'Çift Ton Bej-Kahve', color: '#dcc9a4', finish: 'gloss', roof: '#5c3a22' }], finish: 'gloss', name: NAMES.arabalar.efe, cost: 920, desc: 'Çelik gibi, babadan kalma', shape: 'efe', maxSpeed: 514, accel: 610, turnRate: 3.4, grip: 4.8, driftGrip: 0.86, durability: 1.38, mass: 1.25, len: 50, wid: 25, color: '#2f6fb0', accent: '#eef1f5', engine: { kind: 'old', cyl: 6, idle: 650, red: 5200, gears: 4, gain: 1 } },
    { id: 'marmara', paints: [{ name: 'Kar Beyaz', color: '#f2f2f2', finish: 'gloss' }, { name: 'Volkan Kırmızı', color: '#c1121f', finish: 'metal' }, { name: 'Mat Antrasit', color: '#3a3f47', finish: 'matte' }, { name: 'Çift Ton Mavi-Siyah', color: '#1565c0', finish: 'metal', roof: '#0b0d11' }], finish: 'metal', name: NAMES.arabalar.marmara, cost: 1200, desc: 'Sade sedan, sürprizli', shape: 'marmara', maxSpeed: 528, accel: 640, turnRate: 3.45, grip: 4.8, driftGrip: 0.82, durability: 1.46, mass: 1.25, len: 50, wid: 25, color: '#f2f2f2', accent: '#1f2933', engine: { kind: 'inline', cyl: 4, idle: 800, red: 6400, gears: 5, gain: 1 } },
    { id: 'liva', paints: [{ name: 'Okyanus Mavi', color: '#1c9ad6', finish: 'metal', accent: '#ffffff' }, { name: 'Alev Turuncu', color: '#ff6a13', finish: 'metal' }, { name: 'Mat Beyaz', color: '#e6e8ea', finish: 'matte' }, { name: 'Çift Ton Kırmızı-Siyah', color: '#d3162b', finish: 'gloss', roof: '#0b0d11' }], finish: 'metal', name: NAMES.arabalar.liva, cost: 1550, desc: 'Küçük, çevik, uçan hatchback', shape: 'liva', maxSpeed: 542, accel: 680, turnRate: 3.52, grip: 4.9, driftGrip: 0.78, durability: 1.54, mass: 1.25, len: 45, wid: 24, color: '#1c9ad6', accent: '#ffffff', engine: { kind: 'thin', cyl: 3, idle: 950, red: 7200, gears: 5, gain: 0.95 } },
    { id: 'bozkir', paints: [{ name: 'Kanyon Turuncusu', color: '#e8701a', finish: 'matte', accent: '#23272e' }, { name: 'Orman Yeşili', color: '#2f6b4f', finish: 'metal' }, { name: 'Kum Beji', color: '#c9b48a', finish: 'matte' }, { name: 'Çift Ton Gri-Siyah', color: '#7a838d', finish: 'metal', roof: '#0b0d11' }], finish: 'matte', name: NAMES.arabalar.bozkir, cost: 2000, desc: 'Her yerde gider, hiç durmaz', shape: 'bozkir', maxSpeed: 558, accel: 700, turnRate: 3.6, grip: 5, driftGrip: 0.74, durability: 1.62, mass: 1.5, len: 52, wid: 27, color: '#e8701a', accent: '#23272e', engine: { kind: 'v8', cyl: 8, idle: 620, red: 5800, gears: 5, gain: 1.15 } },
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
    aliensAt: 225, // 200-250 sn arası: uzaylı işgali başlar. Oyun burada gerçekten zorlaşır
    firstSpawnAt: 5,
    // [saniye, değer] noktaları arasında doğrusal artar, yani her saniye biraz zorlaşır.
    // Polis sayısı, hızı ve davranışları aşağıdaki pursuit bölümündedir
    hpCurve: [[0, 1], [50, 1], [200, 1.9], [280, 2.3], [600, 3.5]],
    powerCurve: [[0, 0.65], [30, 0.8], [50, 0.9], [200, 1.25], [280, 1.4], [600, 1.8]],
    maxActive: 24, // Mutlak üst sınır (barikat ve tank dahil). Cihaz sınırı quality.js ve pursuit.phoneCap
    swatShare: [[50, 0.15], [200, 0.3], [280, 0.25]],
    motoFrom: 15,
    motoShare: [[15, 0.12], [50, 0.2], [280, 0.18]],
    fastFrom: 25,
    fastShare: [[25, 0.12], [50, 0.2], [200, 0.22]],
    advancedShare: [[200, 0.3], [280, 0.5]],
    tankCount: [[280, 1], [340, 2], [420, 3], [600, 4]],
    tankInterval: 22,
  },

  // ZORLUK EĞRİSİ: polis baskısının tüm ayarları burada. [saniye, değer] noktaları arası doğrusaldır.
  // Saniye = oyun süresi + heat (arananlık). Tek düğmeyle ayar: countMul sayı, speedMul hız.
  pursuit: {
    countMul: 1, // 0.7 kolay, 1 normal, 1.3 zor
    speedMul: 1,
    policeCurve: [[0, 1], [15, 2], [30, 3], [60, 7], [120, 12], [180, 16], [240, 20], [300, 24]],
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
    closeCurve: [[0, 2], [120, 3], [240, 4], [360, 5]],
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
  for (const c of CONFIG.cars) c.maxSpeed = Math.round(c.maxSpeed * S.player);
  for (const t of Object.values(CONFIG.npc.types)) t.cruise = Math.round(t.cruise * S.npc);
  const H = CONFIG.highwayTraffic;
  H.speed = H.speed.map((v) => Math.round(v * S.highway));
  H.truckSpeed = H.truckSpeed.map((v) => Math.round(v * S.highway));
  CONFIG.npc.panicSpeed = Math.round(CONFIG.npc.panicSpeed * S.player);
}

// Yıldız seviyesi: başlangıçta 1, her eşikte artar
const MAX_STARS = 4;

// --- i18n/tr.js ---
// Türkçe. Anahtarlar bütün dillerde aynıdır; {ad} biçimindeki yerlere değer konur.
const TR = {
  start: 'BAŞLA',
  splash: '{name} tarafından geliştirildi',
  menu: {
    garage: 'Araba Seç', settings: 'Ayarlar', howto: 'Nasıl?', apk: 'APK İndir',
    best: 'En iyi: {score} puan · {time}', first: 'İlk kaçışın seni bekliyor',
    maker: 'Çağlar Sağlam tarafından yapıldı', exit: 'Çıkmak için tekrar bas',
  },
  aria: {
    game: 'Oyun alanı', health: 'Sağlık', pause: 'Duraklat', wanted: 'Arananlık', damage: 'Hasar', reverse: 'Geri vites',
    mute: 'Sesi aç veya kapat', back: 'Geri', prev: 'Önceki', next: 'Sonraki', start: 'Başla',
  },
  garage: {
    finish: { gloss: 'Parlak', metal: 'Metalik', matte: 'Mat', pearl: 'İnci' }, twoTone: 'Çift ton',
    title: 'Garaj', selected: 'Seçili', select: 'Seç', buy: 'Satın al · {cost}', need: '{cost} coin',
    speed: 'Hız', accel: 'İvme', grip: 'Yol tutuş', durability: 'Dayanıklılık',
  },
  settings: {
    title: 'Ayarlar', sound: 'Ses', volume: 'Ses düzeyi', ambient: 'Sokak ambiyansı', vibrate: 'Titreşim',
    control: 'Kontrol', zones: 'Sağ / Sol', wheel: 'Direksiyon', stick: 'Joystick',
    quality: 'Grafik kalitesi', auto: 'Otomatik', high: 'Yüksek', low: 'Düşük',
    language: 'Dil / Language', privacy: 'Gizlilik Politikası', version: 'Sürüm {v}',
  },
  dev: {
    title: 'Geliştirici', god: 'Ölümsüzlük', start: 'Başlangıç süresi',
    t0: '0 sn', t45: '45 sn (SWAT öncesi)', t195: '195 sn (takviye öncesi)', t275: '275 sn (tank öncesi)', t280: '280 sn (tanklar)',
  },
  howto: {
    title: 'Nasıl Oynanır',
    rightH: 'Sağ yarıya bas', rightP: 'Sağa döner, drift atar',
    leftH: 'Sol yarıya bas', leftP: 'Sola döner, drift atar',
    bothH: 'İkisine birden bas', bothP: 'Durur ve geri gider',
    tips: [
      'Araba kendi gider. Sen yalnızca yön verirsin.',
      "Ayarlar'dan kontrolü seç: Sağ / Sol, Direksiyon ya da Joystick.",
      'Duvarlar hasar verir: duman, kıvılcım, ateş, patlama.',
      'Şehirden çık: sahil, orman, çöl ve kırsal seni bekliyor.',
      'Polise kıl payı yaklaşmak ve drift atmak combo çarpanını büyütür.',
      'Polisleri duvara bindir ya da çarparak devir.',
      'Kırmızı daire görürsen hemen çık: tank ateşi geliyor!',
    ],
  },
  power: {
    blast: 'Patlama', ghost: 'Görünmezlik', heal: 'Can', giant: 'Dev mod',
    blastInfo: 'Yakındaki bütün arabalar patlar', ghostInfo: '{n} sn polis seni göremez',
    healInfo: 'Hasarı onarır, ateşi söndürür', giantInfo: '{n} sn devleşirsin, hasar almazsın',
    healFloat: 'CAN +', ghostFloat: 'GÖRÜNMEZ', giantFloat: 'DEV MOD',
  },
  pause: { title: 'Duraklatıldı', resume: 'Devam et', menu: 'Ana menü' },
  over: {
    caught: 'YAKALANDIN!', sunk: 'BATTIN!', record: 'YENİ REKOR!',
    score: 'Skor', time: 'Süre', coins: 'Coin', kills: 'Devrilen polis', broken: 'Kırılan nesne', near: 'Yakın kaçış', drift: 'Drift',
    seconds: '{n} sn', best: 'En iyi skor: {score} · En uzun süre: {time}', retry: 'Tekrar dene', menu: 'Ana menü',
  },
  hint: {
    zones: ['Sola bas', 'sola drift', 'İkisine bas', 'geri vites', 'Sağa bas', 'sağa drift'],
    wheel: ['GERİ tut', 'geri vites', 'Direksiyon', 'sağ altta', 'Çevir', 'sağa sola döner'],
    stick: ['Sol yarı', 'bas ve kaydır', 'Joystick', 'parmağının altında', 'GERİ tut', 'geri vites'],
    rev: 'GERİ',
  },
  alert: { swat: 'SWAT geliyor!', heavy: 'Ağır takviye!', tanks: 'TANKLAR!', aliens: 'UZAYLILAR GELDİ!' },
  cheat: { on: 'Aferin, hile kodunu buldun la!', off: 'Hile kapatıldı', badge: 'HİLE AÇIK' },
  cars: {
    atmaca: { desc: 'Her mahallenin emektarı', paints: ['Mahalle Beji', 'Şarap Kırmızı', 'Mat Asker Yeşili', 'Çift Ton Krem-Bordo'] },
    motor: { desc: 'Dar sokakların kralı', paints: ['Yarış Kırmızı', 'Elektrik Mavi', 'Mat Siyah', 'İnci Beyaz'] },
    granit: { desc: 'Yüksek ve güvenli SUV', paints: ['Gece Mavisi', 'Kor Turuncu', 'Mat Gümüş', 'İnci Beyaz'] },
    elektra: { desc: 'Sessiz, güçlü, elektrikli', paints: ['Anadolu Kırmızı', 'Fırtına Grisi', 'Mat Toprak', 'Buz Mavisi'] },
    simsek: { desc: 'Abartılı spoyler, tam tuning', paints: ['Mat Siyah Sarı Şerit', 'Ateş Turuncu', 'Neon Yeşil', 'Mor Metalik'] },
    cinar: { desc: 'Klasik efsane', paints: ['Efsane Turuncu', 'Bebek Mavisi', 'Çift Ton Krem-Vişne', 'Mat Zeytin'] },
    efe: { desc: 'Çelik gibi, babadan kalma', paints: ['Boğaz Mavisi', 'Haki', 'Gümüş', 'Çift Ton Bej-Kahve'] },
    marmara: { desc: 'Sade sedan, sürprizli', paints: ['Kar Beyaz', 'Volkan Kırmızı', 'Mat Antrasit', 'Çift Ton Mavi-Siyah'] },
    liva: { desc: 'Küçük, çevik, uçan hatchback', paints: ['Okyanus Mavi', 'Alev Turuncu', 'Mat Beyaz', 'Çift Ton Kırmızı-Siyah'] },
    bozkir: { desc: 'Her yerde gider, hiç durmaz', paints: ['Kanyon Turuncusu', 'Orman Yeşili', 'Kum Beji', 'Çift Ton Gri-Siyah'] },
  },
};

// --- i18n/en.js ---
// English
const EN = {
  start: 'START',
  splash: 'Developed by {name}',
  menu: {
    garage: 'Cars', settings: 'Settings', howto: 'How to play', apk: 'Get APK',
    best: 'Best: {score} pts · {time}', first: 'Your first getaway awaits',
    maker: 'Made by Çağlar Sağlam', exit: 'Press again to exit',
  },
  aria: {
    game: 'Game area', health: 'Health', pause: 'Pause', wanted: 'Wanted level', damage: 'Damage', reverse: 'Reverse',
    mute: 'Toggle sound', back: 'Back', prev: 'Previous', next: 'Next', start: 'Start',
  },
  garage: {
    finish: { gloss: 'Gloss', metal: 'Metallic', matte: 'Matte', pearl: 'Pearl' }, twoTone: 'Two-tone',
    title: 'Garage', selected: 'Selected', select: 'Select', buy: 'Buy · {cost}', need: '{cost} coins',
    speed: 'Speed', accel: 'Acceleration', grip: 'Grip', durability: 'Durability',
  },
  settings: {
    title: 'Settings', sound: 'Sound', volume: 'Volume', ambient: 'Street ambience', vibrate: 'Vibration',
    control: 'Controls', zones: 'Left / Right', wheel: 'Wheel', stick: 'Joystick',
    quality: 'Graphics', auto: 'Auto', high: 'High', low: 'Low',
    language: 'Language', privacy: 'Privacy Policy', version: 'Version {v}',
  },
  dev: {
    title: 'Developer', god: 'Invincible', start: 'Start time',
    t0: '0 s', t45: '45 s (before SWAT)', t195: '195 s (before backup)', t275: '275 s (before tanks)', t280: '280 s (tanks)',
  },
  howto: {
    title: 'How to Play',
    rightH: 'Tap the right half', rightP: 'Turns right and drifts',
    leftH: 'Tap the left half', leftP: 'Turns left and drifts',
    bothH: 'Tap both at once', bothP: 'Brakes and reverses',
    tips: [
      'Your car drives itself. You just steer.',
      'Pick your controls in Settings: Left / Right, Wheel or Joystick.',
      'Walls hurt: smoke, sparks, fire, then boom.',
      'Leave the city: beaches, forests, deserts and countryside await.',
      'Close calls with the police and long drifts grow your combo.',
      'Make the police crash into walls, or ram them off the road.',
      'See a red circle? Get out fast: tank fire incoming!',
    ],
  },
  power: {
    blast: 'Blast', ghost: 'Ghost', heal: 'Repair', giant: 'Giant',
    blastInfo: 'Blows up every car nearby', ghostInfo: 'The police can’t see you for {n} s',
    healInfo: 'Fixes damage and puts out fire', giantInfo: 'Grow huge for {n} s and take no damage',
    healFloat: 'REPAIR +', ghostFloat: 'GHOST', giantFloat: 'GIANT',
  },
  pause: { title: 'Paused', resume: 'Resume', menu: 'Main menu' },
  over: {
    caught: 'BUSTED!', sunk: 'SUNK!', record: 'NEW RECORD!',
    score: 'Score', time: 'Time', coins: 'Coins', kills: 'Police wrecked', broken: 'Objects smashed', near: 'Close calls', drift: 'Drift',
    seconds: '{n} s', best: 'Best score: {score} · Longest run: {time}', retry: 'Try again', menu: 'Main menu',
  },
  hint: {
    zones: ['Tap left', 'drift left', 'Tap both', 'reverse', 'Tap right', 'drift right'],
    wheel: ['Hold REV', 'reverse', 'Wheel', 'bottom right', 'Turn it', 'steer left or right'],
    stick: ['Left half', 'press and slide', 'Joystick', 'appears under your thumb', 'Hold REV', 'reverse'],
    rev: 'REV',
  },
  alert: { swat: 'SWAT incoming!', heavy: 'Heavy backup!', tanks: 'TANKS!', aliens: 'ALIENS HAVE LANDED!' },
  cheat: { on: 'Well, look at you! You found the cheat code!', off: 'Cheat off', badge: 'CHEAT ON' },
  cars: {
    atmaca: { desc: 'Every neighborhood’s old faithful', paints: ['Neighborhood Beige', 'Wine Red', 'Matte Army Green', 'Two-Tone Cream/Burgundy'] },
    motor: { desc: 'King of the narrow streets', paints: ['Racing Red', 'Electric Blue', 'Matte Black', 'Pearl White'] },
    granit: { desc: 'Tall and safe SUV', paints: ['Midnight Blue', 'Ember Orange', 'Matte Silver', 'Pearl White'] },
    elektra: { desc: 'Quiet, strong, electric', paints: ['Anatolian Red', 'Storm Gray', 'Matte Earth', 'Ice Blue'] },
    simsek: { desc: 'Huge spoiler, fully tuned', paints: ['Matte Black, Yellow Stripe', 'Fire Orange', 'Neon Green', 'Metallic Purple'] },
    cinar: { desc: 'A classic legend', paints: ['Legend Orange', 'Baby Blue', 'Two-Tone Cream/Cherry', 'Matte Olive'] },
    efe: { desc: 'Tough as steel, handed down from Dad', paints: ['Bosphorus Blue', 'Khaki', 'Silver', 'Two-Tone Beige/Brown'] },
    marmara: { desc: 'Plain sedan, full of surprises', paints: ['Snow White', 'Volcano Red', 'Matte Anthracite', 'Two-Tone Blue/Black'] },
    liva: { desc: 'Small, nimble, flying hatchback', paints: ['Ocean Blue', 'Flame Orange', 'Matte White', 'Two-Tone Red/Black'] },
    bozkir: { desc: 'Goes anywhere, never stops', paints: ['Canyon Orange', 'Forest Green', 'Sand Beige', 'Two-Tone Gray/Black'] },
  },
};

// --- i18n/ja.js ---
// 日本語
const JA = {
  start: 'スタート',
  splash: '開発：{name}',
  menu: {
    garage: '車を選ぶ', settings: '設定', howto: '遊び方', apk: 'APKを入手',
    best: 'ベスト：{score}点 · {time}', first: '最初の逃走が待っている',
    maker: '制作：Çağlar Sağlam', exit: 'もう一度押すと終了',
  },
  aria: {
    game: 'ゲーム画面', health: '耐久力', pause: '一時停止', wanted: '手配レベル', damage: 'ダメージ', reverse: 'バック',
    mute: 'サウンドのオン／オフ', back: '戻る', prev: '前へ', next: '次へ', start: 'スタート',
  },
  garage: {
    finish: { gloss: '光沢', metal: 'メタリック', matte: 'マット', pearl: 'パール' }, twoTone: '2トーン',
    title: 'ガレージ', selected: '選択中', select: '選ぶ', buy: '購入 · {cost}', need: '{cost}コイン',
    speed: '最高速', accel: '加速', grip: 'グリップ', durability: '耐久',
  },
  settings: {
    title: '設定', sound: 'サウンド', volume: '音量', ambient: '街の環境音', vibrate: '振動',
    control: '操作', zones: '左右タップ', wheel: 'ハンドル', stick: 'スティック',
    quality: '画質', auto: '自動', high: '高', low: '低',
    language: '言語 / Language', privacy: 'プライバシーポリシー', version: 'バージョン {v}',
  },
  dev: {
    title: '開発者', god: '無敵', start: '開始時間',
    t0: '0秒', t45: '45秒（SWAT前）', t195: '195秒（増援前）', t275: '275秒（戦車前）', t280: '280秒（戦車）',
  },
  howto: {
    title: '遊び方',
    rightH: '右半分をタップ', rightP: '右に曲がってドリフト',
    leftH: '左半分をタップ', leftP: '左に曲がってドリフト',
    bothH: '両方を同時にタップ', bothP: '止まってバック',
    tips: [
      '車は自動で走る。君はハンドルを切るだけ。',
      '操作は設定で選べる：左右タップ、ハンドル、スティック。',
      '壁にぶつかるとダメージ：煙、火花、炎、そして爆発。',
      '街を抜け出せ。海辺、森、砂漠、田舎が待っている。',
      '警察すれすれの回避とドリフトでコンボ倍率アップ。',
      '警察を壁に激突させるか、体当たりで倒そう。',
      '赤い円が見えたらすぐ逃げろ。戦車の砲撃が来る！',
    ],
  },
  power: {
    blast: '爆発', ghost: 'ゴースト', heal: '修理', giant: '巨大化',
    blastInfo: '周りの車をまとめて吹き飛ばす', ghostInfo: '{n}秒間、警察に見つからない',
    healInfo: 'ダメージを直して火を消す', giantInfo: '{n}秒間巨大化、ダメージを受けない',
    healFloat: '修理 +', ghostFloat: 'ゴースト', giantFloat: '巨大化',
  },
  pause: { title: '一時停止', resume: '再開', menu: 'メインメニュー' },
  over: {
    caught: '捕まった！', sunk: '沈没！', record: '新記録！',
    score: 'スコア', time: 'タイム', coins: 'コイン', kills: '倒した警察', broken: '壊した物', near: 'ニアミス', drift: 'ドリフト',
    seconds: '{n}秒', best: 'ベストスコア：{score} · 最長記録：{time}', retry: 'もう一度', menu: 'メインメニュー',
  },
  hint: {
    zones: ['左をタップ', '左へドリフト', '両方タップ', 'バック', '右をタップ', '右へドリフト'],
    wheel: ['「バック」長押し', 'バック', 'ハンドル', '右下にある', '回す', '左右に曲がる'],
    stick: ['左半分', '押してスライド', 'スティック', '指の下に出る', '「バック」長押し', 'バック'],
    rev: 'バック',
  },
  alert: { swat: 'SWAT出動！', heavy: '重装増援！', tanks: '戦車だ！', aliens: 'エイリアン襲来！' },
  cheat: { on: 'やるじゃん！隠しコマンドを見つけたね！', off: 'チート解除', badge: 'チートON' },
  cars: {
    atmaca: { desc: 'どの街にもいるベテラン', paints: ['下町ベージュ', 'ワインレッド', 'マット・アーミーグリーン', '2トーン クリーム／ボルドー'] },
    motor: { desc: '狭い路地の王様', paints: ['レーシングレッド', 'エレクトリックブルー', 'マットブラック', 'パールホワイト'] },
    granit: { desc: '背が高く安心なSUV', paints: ['ミッドナイトブルー', 'エンバーオレンジ', 'マットシルバー', 'パールホワイト'] },
    elektra: { desc: '静かでパワフルなEV', paints: ['アナトリアンレッド', 'ストームグレー', 'マット・アース', 'アイスブルー'] },
    simsek: { desc: '巨大スポイラーのフルチューン', paints: ['マットブラック＋イエローライン', 'ファイアオレンジ', 'ネオングリーン', 'メタリックパープル'] },
    cinar: { desc: '伝説のクラシック', paints: ['レジェンドオレンジ', 'ベビーブルー', '2トーン クリーム／チェリー', 'マット・オリーブ'] },
    efe: { desc: '鋼のように頑丈、父譲りの一台', paints: ['ボスポラスブルー', 'カーキ', 'シルバー', '2トーン ベージュ／ブラウン'] },
    marmara: { desc: '地味なセダン、でも侮れない', paints: ['スノーホワイト', 'ボルケーノレッド', 'マット・アンスラサイト', '2トーン ブルー／ブラック'] },
    liva: { desc: '小さく軽快な空飛ぶハッチバック', paints: ['オーシャンブルー', 'フレイムオレンジ', 'マットホワイト', '2トーン レッド／ブラック'] },
    bozkir: { desc: 'どこでも走り、決して止まらない', paints: ['キャニオンオレンジ', 'フォレストグリーン', 'サンドベージュ', '2トーン グレー／ブラック'] },
  },
};

// --- i18n/zh.js ---
// 简体中文
const ZH = {
  start: '开始',
  splash: '开发者：{name}',
  menu: {
    garage: '选车', settings: '设置', howto: '玩法', apk: '下载 APK',
    best: '最佳：{score} 分 · {time}', first: '你的第一次逃亡正等着你',
    maker: '制作：Çağlar Sağlam', exit: '再按一次退出',
  },
  aria: {
    game: '游戏区域', health: '耐久', pause: '暂停', wanted: '通缉等级', damage: '损伤', reverse: '倒车',
    mute: '开关声音', back: '返回', prev: '上一辆', next: '下一辆', start: '开始',
  },
  garage: {
    finish: { gloss: '亮面', metal: '金属漆', matte: '哑光', pearl: '珠光' }, twoTone: '双色',
    title: '车库', selected: '已选', select: '选择', buy: '购买 · {cost}', need: '{cost} 金币',
    speed: '速度', accel: '加速', grip: '抓地力', durability: '耐久',
  },
  settings: {
    title: '设置', sound: '声音', volume: '音量', ambient: '街道环境音', vibrate: '振动',
    control: '操控', zones: '左右点击', wheel: '方向盘', stick: '摇杆',
    quality: '画质', auto: '自动', high: '高', low: '低',
    language: '语言 / Language', privacy: '隐私政策', version: '版本 {v}',
  },
  dev: {
    title: '开发者', god: '无敌', start: '开始时间',
    t0: '0 秒', t45: '45 秒（SWAT 前）', t195: '195 秒（增援前）', t275: '275 秒（坦克前）', t280: '280 秒（坦克）',
  },
  howto: {
    title: '玩法说明',
    rightH: '点击右半屏', rightP: '向右转并漂移',
    leftH: '点击左半屏', leftP: '向左转并漂移',
    bothH: '同时点击两侧', bothP: '刹车并倒车',
    tips: [
      '车会自己往前开，你只需要控制方向。',
      '在设置中选择操控方式：左右点击、方向盘或摇杆。',
      '撞墙会受损：冒烟、火花、起火，最后爆炸。',
      '冲出城市：海滩、森林、沙漠和乡村等着你。',
      '与警察擦身而过和漂移都能提高连击倍数。',
      '让警车撞上墙，或者直接把它们撞翻。',
      '看到红圈就赶紧跑：坦克炮火来了！',
    ],
  },
  power: {
    blast: '爆破', ghost: '隐身', heal: '修复', giant: '巨大化',
    blastInfo: '附近所有车辆全部爆炸', ghostInfo: '{n} 秒内警察看不见你',
    healInfo: '修复损伤并扑灭火焰', giantInfo: '{n} 秒内变得巨大，不受伤害',
    healFloat: '修复 +', ghostFloat: '隐身', giantFloat: '巨大化',
  },
  pause: { title: '已暂停', resume: '继续', menu: '主菜单' },
  over: {
    caught: '被抓了！', sunk: '沉没了！', record: '新纪录！',
    score: '得分', time: '时间', coins: '金币', kills: '击毁警车', broken: '撞毁物品', near: '惊险闪避', drift: '漂移',
    seconds: '{n} 秒', best: '最高分：{score} · 最长时间：{time}', retry: '再来一次', menu: '主菜单',
  },
  hint: {
    zones: ['点左侧', '向左漂移', '同时点两侧', '倒车', '点右侧', '向右漂移'],
    wheel: ['按住“倒车”', '倒车', '方向盘', '在右下角', '转动', '左右转向'],
    stick: ['左半屏', '按住滑动', '摇杆', '出现在手指下', '按住“倒车”', '倒车'],
    rev: '倒车',
  },
  alert: { swat: 'SWAT 来了！', heavy: '重型增援！', tanks: '坦克来了！', aliens: '外星人入侵！' },
  cheat: { on: '可以啊，你找到作弊码了！', off: '作弊已关闭', badge: '作弊已开启' },
  cars: {
    atmaca: { desc: '每条街坊的老伙计', paints: ['街坊米色', '酒红', '哑光军绿', '双色 奶白/酒红'] },
    motor: { desc: '窄巷之王', paints: ['赛道红', '电光蓝', '哑光黑', '珍珠白'] },
    granit: { desc: '高大安全的 SUV', paints: ['午夜蓝', '炭火橙', '哑光银', '珍珠白'] },
    elektra: { desc: '安静、强劲、纯电', paints: ['安纳托利亚红', '风暴灰', '哑光土色', '冰川蓝'] },
    simsek: { desc: '夸张尾翼，全套改装', paints: ['哑光黑配黄条', '烈焰橙', '霓虹绿', '金属紫'] },
    cinar: { desc: '经典传奇', paints: ['传奇橙', '宝宝蓝', '双色 奶白/樱桃红', '哑光橄榄'] },
    efe: { desc: '钢铁般结实，父辈传下来的', paints: ['海峡蓝', '卡其', '银色', '双色 米色/棕色'] },
    marmara: { desc: '朴素轿车，暗藏惊喜', paints: ['雪白', '火山红', '哑光炭灰', '双色 蓝/黑'] },
    liva: { desc: '小巧灵活，会飞的两厢车', paints: ['海洋蓝', '火焰橙', '哑光白', '双色 红/黑'] },
    bozkir: { desc: '哪里都能去，从不停下', paints: ['峡谷橙', '森林绿', '沙米色', '双色 灰/黑'] },
  },
};

// --- i18n/es.js ---
// Español
const ES = {
  start: 'JUGAR',
  splash: 'Desarrollado por {name}',
  menu: {
    garage: 'Coches', settings: 'Ajustes', howto: 'Cómo jugar', apk: 'Bajar APK',
    best: 'Mejor: {score} pts · {time}', first: 'Tu primera huida te espera',
    maker: 'Hecho por Çağlar Sağlam', exit: 'Pulsa otra vez para salir',
  },
  aria: {
    game: 'Zona de juego', health: 'Salud', pause: 'Pausa', wanted: 'Nivel de búsqueda', damage: 'Daño', reverse: 'Marcha atrás',
    mute: 'Activar o silenciar sonido', back: 'Atrás', prev: 'Anterior', next: 'Siguiente', start: 'Jugar',
  },
  garage: {
    finish: { gloss: 'Brillante', metal: 'Metalizado', matte: 'Mate', pearl: 'Perla' }, twoTone: 'Bicolor',
    title: 'Garaje', selected: 'Elegido', select: 'Elegir', buy: 'Comprar · {cost}', need: '{cost} monedas',
    speed: 'Velocidad', accel: 'Aceleración', grip: 'Agarre', durability: 'Resistencia',
  },
  settings: {
    title: 'Ajustes', sound: 'Sonido', volume: 'Volumen', ambient: 'Ambiente urbano', vibrate: 'Vibración',
    control: 'Controles', zones: 'Izq. / Der.', wheel: 'Volante', stick: 'Joystick',
    quality: 'Gráficos', auto: 'Auto', high: 'Alta', low: 'Baja',
    language: 'Idioma / Language', privacy: 'Política de privacidad', version: 'Versión {v}',
  },
  dev: {
    title: 'Desarrollador', god: 'Invencible', start: 'Tiempo inicial',
    t0: '0 s', t45: '45 s (antes del SWAT)', t195: '195 s (antes de refuerzos)', t275: '275 s (antes de tanques)', t280: '280 s (tanques)',
  },
  howto: {
    title: 'Cómo jugar',
    rightH: 'Toca la mitad derecha', rightP: 'Gira a la derecha y derrapa',
    leftH: 'Toca la mitad izquierda', leftP: 'Gira a la izquierda y derrapa',
    bothH: 'Toca ambas a la vez', bothP: 'Frena y da marcha atrás',
    tips: [
      'El coche avanza solo. Tú solo diriges.',
      'Elige los controles en Ajustes: Izq. / Der., Volante o Joystick.',
      'Los muros hacen daño: humo, chispas, fuego y… ¡bum!',
      'Sal de la ciudad: te esperan playas, bosques, desiertos y campo.',
      'Esquivar a la policía por los pelos y derrapar sube tu combo.',
      'Haz que la policía se estrelle contra los muros o embístela.',
      '¿Ves un círculo rojo? ¡Sal ya: viene fuego de tanque!',
    ],
  },
  power: {
    blast: 'Explosión', ghost: 'Invisible', heal: 'Reparar', giant: 'Gigante',
    blastInfo: 'Hace explotar todos los coches cercanos', ghostInfo: 'La policía no te ve durante {n} s',
    healInfo: 'Repara el daño y apaga el fuego', giantInfo: 'Te vuelves gigante {n} s y no recibes daño',
    healFloat: 'REPARADO +', ghostFloat: 'INVISIBLE', giantFloat: 'GIGANTE',
  },
  pause: { title: 'En pausa', resume: 'Continuar', menu: 'Menú principal' },
  over: {
    caught: '¡TE PILLARON!', sunk: '¡HUNDIDO!', record: '¡NUEVO RÉCORD!',
    score: 'Puntos', time: 'Tiempo', coins: 'Monedas', kills: 'Policías derribados', broken: 'Objetos rotos', near: 'Por los pelos', drift: 'Derrape',
    seconds: '{n} s', best: 'Mejor puntuación: {score} · Mayor tiempo: {time}', retry: 'Reintentar', menu: 'Menú principal',
  },
  hint: {
    zones: ['Toca izq.', 'derrapa a la izq.', 'Toca ambos', 'marcha atrás', 'Toca der.', 'derrapa a la der.'],
    wheel: ['Mantén ATRÁS', 'marcha atrás', 'Volante', 'abajo a la derecha', 'Gíralo', 'gira a izq. o der.'],
    stick: ['Mitad izq.', 'pulsa y desliza', 'Joystick', 'aparece bajo tu dedo', 'Mantén ATRÁS', 'marcha atrás'],
    rev: 'ATRÁS',
  },
  alert: { swat: '¡Llega el SWAT!', heavy: '¡Refuerzos pesados!', tanks: '¡TANQUES!', aliens: '¡HAN LLEGADO LOS ALIENS!' },
  cheat: { on: '¡Toma ya! ¡Has encontrado el truco secreto!', off: 'Truco desactivado', badge: 'TRUCO ACTIVO' },
  cars: {
    atmaca: { desc: 'El veterano de todos los barrios', paints: ['Beige de barrio', 'Rojo vino', 'Verde militar mate', 'Bicolor crema/burdeos'] },
    motor: { desc: 'El rey de las calles estrechas', paints: ['Rojo carreras', 'Azul eléctrico', 'Negro mate', 'Blanco perla'] },
    granit: { desc: 'SUV alto y seguro', paints: ['Azul medianoche', 'Naranja brasa', 'Plata mate', 'Blanco perla'] },
    elektra: { desc: 'Silencioso, potente, eléctrico', paints: ['Rojo Anatolia', 'Gris tormenta', 'Tierra mate', 'Azul hielo'] },
    simsek: { desc: 'Alerón exagerado, tuning total', paints: ['Negro mate, franja amarilla', 'Naranja fuego', 'Verde neón', 'Morado metalizado'] },
    cinar: { desc: 'Una leyenda clásica', paints: ['Naranja leyenda', 'Azul bebé', 'Bicolor crema/cereza', 'Oliva mate'] },
    efe: { desc: 'Duro como el acero, herencia de papá', paints: ['Azul Bósforo', 'Caqui', 'Plata', 'Bicolor beige/marrón'] },
    marmara: { desc: 'Sedán sencillo, lleno de sorpresas', paints: ['Blanco nieve', 'Rojo volcán', 'Antracita mate', 'Bicolor azul/negro'] },
    liva: { desc: 'Compacto, ágil y volador', paints: ['Azul océano', 'Naranja llama', 'Blanco mate', 'Bicolor rojo/negro'] },
    bozkir: { desc: 'Va a todas partes y nunca para', paints: ['Naranja cañón', 'Verde bosque', 'Beige arena', 'Bicolor gris/negro'] },
  },
};

// --- i18n/de.js ---
// Deutsch
const DE = {
  start: 'START',
  splash: 'Entwickelt von {name}',
  menu: {
    garage: 'Autos', settings: 'Optionen', howto: 'Anleitung', apk: 'APK laden',
    best: 'Bestwert: {score} Pkt. · {time}', first: 'Deine erste Flucht wartet',
    maker: 'Gemacht von Çağlar Sağlam', exit: 'Zum Beenden erneut drücken',
  },
  aria: {
    game: 'Spielfeld', health: 'Zustand', pause: 'Pause', wanted: 'Fahndungsstufe', damage: 'Schaden', reverse: 'Rückwärtsgang',
    mute: 'Ton an oder aus', back: 'Zurück', prev: 'Vorheriges', next: 'Nächstes', start: 'Start',
  },
  garage: {
    finish: { gloss: 'Glanz', metal: 'Metallic', matte: 'Matt', pearl: 'Perleffekt' }, twoTone: 'Zweifarbig',
    title: 'Garage', selected: 'Gewählt', select: 'Wählen', buy: 'Kaufen · {cost}', need: '{cost} Münzen',
    speed: 'Tempo', accel: 'Beschleunigung', grip: 'Grip', durability: 'Haltbarkeit',
  },
  settings: {
    title: 'Einstellungen', sound: 'Ton', volume: 'Lautstärke', ambient: 'Straßenkulisse', vibrate: 'Vibration',
    control: 'Steuerung', zones: 'Links / Rechts', wheel: 'Lenkrad', stick: 'Joystick',
    quality: 'Grafik', auto: 'Auto', high: 'Hoch', low: 'Niedrig',
    language: 'Sprache / Language', privacy: 'Datenschutz', version: 'Version {v}',
  },
  dev: {
    title: 'Entwickler', god: 'Unbesiegbar', start: 'Startzeit',
    t0: '0 s', t45: '45 s (vor SWAT)', t195: '195 s (vor Verstärkung)', t275: '275 s (vor Panzern)', t280: '280 s (Panzer)',
  },
  howto: {
    title: 'So wird gespielt',
    rightH: 'Rechte Hälfte drücken', rightP: 'Lenkt nach rechts und driftet',
    leftH: 'Linke Hälfte drücken', leftP: 'Lenkt nach links und driftet',
    bothH: 'Beide gleichzeitig drücken', bothP: 'Bremst und fährt rückwärts',
    tips: [
      'Dein Auto fährt von selbst. Du lenkst nur.',
      'Wähle die Steuerung in den Einstellungen: Links / Rechts, Lenkrad oder Joystick.',
      'Wände schaden: Rauch, Funken, Feuer – und dann knallt’s.',
      'Raus aus der Stadt: Strand, Wald, Wüste und Land warten.',
      'Knappe Manöver an der Polizei vorbei und Drifts erhöhen deine Combo.',
      'Lass die Polizei gegen Wände krachen oder ramme sie von der Straße.',
      'Roter Kreis? Sofort weg da: Panzerbeschuss!',
    ],
  },
  power: {
    blast: 'Explosion', ghost: 'Tarnung', heal: 'Reparatur', giant: 'Riese',
    blastInfo: 'Sprengt alle Autos in der Nähe', ghostInfo: 'Die Polizei sieht dich {n} s lang nicht',
    healInfo: 'Repariert Schäden und löscht Feuer', giantInfo: '{n} s lang riesig und unverwundbar',
    healFloat: 'REPARIERT +', ghostFloat: 'GETARNT', giantFloat: 'RIESE',
  },
  pause: { title: 'Pausiert', resume: 'Weiter', menu: 'Hauptmenü' },
  over: {
    caught: 'ERWISCHT!', sunk: 'VERSENKT!', record: 'NEUER REKORD!',
    score: 'Punkte', time: 'Zeit', coins: 'Münzen', kills: 'Polizei erledigt', broken: 'Zerstörte Objekte', near: 'Knappe Manöver', drift: 'Drift',
    seconds: '{n} s', best: 'Bestwert: {score} · Längste Fahrt: {time}', retry: 'Nochmal', menu: 'Hauptmenü',
  },
  hint: {
    zones: ['Links drücken', 'Drift links', 'Beide drücken', 'Rückwärts', 'Rechts drücken', 'Drift rechts'],
    wheel: ['RÜCK halten', 'Rückwärts', 'Lenkrad', 'unten rechts', 'Drehen', 'lenkt links oder rechts'],
    stick: ['Linke Hälfte', 'drücken und ziehen', 'Joystick', 'erscheint unter dem Daumen', 'RÜCK halten', 'Rückwärts'],
    rev: 'RÜCK',
  },
  alert: { swat: 'SWAT im Anmarsch!', heavy: 'Schwere Verstärkung!', tanks: 'PANZER!', aliens: 'DIE ALIENS SIND GELANDET!' },
  cheat: { on: 'Na sieh mal einer an – du hast den Cheatcode gefunden!', off: 'Cheat aus', badge: 'CHEAT AN' },
  cars: {
    atmaca: { desc: 'Der treue Klassiker jeder Nachbarschaft', paints: ['Kiez-Beige', 'Weinrot', 'Mattes Armeegrün', 'Zweifarbig Creme/Bordeaux'] },
    motor: { desc: 'König der engen Gassen', paints: ['Rennrot', 'Elektroblau', 'Mattschwarz', 'Perlweiß'] },
    granit: { desc: 'Hoher, sicherer SUV', paints: ['Mitternachtsblau', 'Glutorange', 'Mattsilber', 'Perlweiß'] },
    elektra: { desc: 'Leise, stark, elektrisch', paints: ['Anatolienrot', 'Sturmgrau', 'Mattes Erdbraun', 'Eisblau'] },
    simsek: { desc: 'Riesiger Spoiler, voll getunt', paints: ['Mattschwarz mit Gelbstreifen', 'Feuerorange', 'Neongrün', 'Lila Metallic'] },
    cinar: { desc: 'Eine klassische Legende', paints: ['Legendenorange', 'Babyblau', 'Zweifarbig Creme/Kirsche', 'Matte Olive'] },
    efe: { desc: 'Stahlhart, von Papa geerbt', paints: ['Bosporusblau', 'Khaki', 'Silber', 'Zweifarbig Beige/Braun'] },
    marmara: { desc: 'Schlichte Limousine voller Überraschungen', paints: ['Schneeweiß', 'Vulkanrot', 'Mattes Anthrazit', 'Zweifarbig Blau/Schwarz'] },
    liva: { desc: 'Kleiner, wendiger Flitzer', paints: ['Ozeanblau', 'Flammenorange', 'Mattweiß', 'Zweifarbig Rot/Schwarz'] },
    bozkir: { desc: 'Fährt überall, hält nie an', paints: ['Canyonorange', 'Waldgrün', 'Sandbeige', 'Zweifarbig Grau/Schwarz'] },
  },
};

// --- i18n/index.js ---
// Dil sistemi. Bütün arayüz metinleri js/i18n/<dil>.js dosyalarındadır, kodda sabit metin yoktur.
// DOM'a dokunmaz (ui.js uygular); birim testle sınanır.
// Adlar tek dosyalık pakette çakışmasın diye öneklidir (tools/bundle-file.mjs).

const LANG_PACKS = { tr: TR, en: EN, ja: JA, zh: ZH, es: ES, de: DE };
// Seçim listesinde her dil kendi adıyla görünür
const LANGS = { tr: 'Türkçe', en: 'English', ja: '日本語', zh: '简体中文', es: 'Español', de: 'Deutsch' };
// Geliştirici adı her dilde aynı kalır, çevrilmez
const DEVELOPER = 'Çağlar Sağlam';
const LOCALES = { tr: 'tr-TR', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN', es: 'es-ES', de: 'de-DE' };

const langState = { code: 'tr', pack: TR, listeners: [], numbers: new Map() };

// Tarayıcı ya da telefon dili: desteklenen ilk dil, yoksa İngilizce
function detectLang(list) {
  for (const l of list || []) {
    const k = String(l).toLowerCase().split(/[-_]/)[0];
    if (LANG_PACKS[k]) return k;
  }
  return 'en';
}

function setLang(code) {
  const next = LANG_PACKS[code] ? code : 'en';
  if (next === langState.code) return next;
  langState.code = next;
  langState.pack = LANG_PACKS[next];
  for (const f of langState.listeners) f(next);
  return next;
}

const getLang = () => langState.code;
const onLang = (f) => langState.listeners.push(f);

function langFind(p, key) {
  let v = p;
  for (const part of key.split('.')) {
    if (v == null) return undefined;
    v = v[part];
  }
  return v;
}

// tx('over.best', { score: 10 }). Eksik anahtar İngilizceye, o da yoksa Türkçeye düşer
function tx(key, params) {
  let s = langFind(langState.pack, key);
  if (s === undefined) s = langFind(EN, key);
  if (s === undefined) s = langFind(TR, key);
  if (s === undefined) return key;
  if (typeof s !== 'string' || !params) return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined ? String(params[k]) : m));
}

// Sayı biçimi dile göre: 1.234 / 1,234 / 1 234
function txNum(n, digits = 0) {
  const key = `${langState.code}:${digits}`;
  let f = langState.numbers.get(key);
  if (!f) {
    f = new Intl.NumberFormat(LOCALES[langState.code], { minimumFractionDigits: digits, maximumFractionDigits: digits });
    langState.numbers.set(key, f);
  }
  return f.format(n);
}

// Test ve denetim için: bir dilin bütün anahtarları
function langKeys(code) {
  const out = [];
  const walk = (o, pre) => {
    for (const [k, v] of Object.entries(o)) {
      const key = pre ? `${pre}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, key);
      else out.push(key);
    }
  };
  walk(LANG_PACKS[code], '');
  return out;
}

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
  const agile = 1 - Math.max(0, Math.min(1, (speed - P.agileFrom) / (P.agileTo - P.agileFrom)));

  // 1) Boyuna: motor, fren, geri vites
  // Sonuna kadar kırılan direksiyon gazı keser ve hızı viraj hızına indirir: dar sokağa fren basmadan girilir
  const cornering = throttle > 0 && vF > 0 && Math.abs(c.steer) > P.cornerSteer;
  if (cornering) {
    if (vF > P.cornerSpeed) vF = Math.max(P.cornerSpeed, vF - P.cornerBrake * dt);
    else vF += spec.accel * 0.35 * (1 - vF / P.cornerSpeed) * dt;
  } else if (throttle > 0) {
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
  // Duvara dayalı duran araç da burnunu yavaşça çevirebilir: direksiyon kırılıysa kilitlenmez
  const speedFactor = Math.max(throttle !== 0 ? P.pivot : 0, Math.min(1, speed / P.lowTurnSpeed)) * (1 - 0.1 * Math.min(1, speed / spec.maxSpeed));
  const yawTarget = c.steer * spec.turnRate * (1 + P.agileTurn * agile) * speedFactor * dir;
  c.w += (yawTarget - c.w) * (1 - Math.exp(-(P.yawResponse + P.agileYaw * agile) * dt));

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
  b.graze = false;
  if (vn >= 0) return 0;
  const speed = Math.hypot(b.vx, b.vy) || 1;
  const graze = -vn / speed < P.slideRatio;
  b.graze = graze;
  const e = graze ? 0 : P.wallBounce;
  b.vx -= (1 + e) * vn * nx;
  b.vy -= (1 + e) * vn * ny;
  const keep = 1 - (graze ? P.slideFriction : P.wallFriction);
  b.vx *= keep;
  b.vy *= keep;
  if (graze) {
    // Sürtme: sekme yok, burun duvar boyunca döner ve araç takılmadan devam eder
    const heading = Math.atan2(b.vy, b.vx);
    b.a += wrapAngle(heading - b.a) * P.slideAlign * Math.max(0, Math.min(1, (speed - 90) / 120));
    return -vn;
  }
  // Burun duvardan uzağa, teğete doğru döner
  const fx = Math.cos(b.a);
  const fy = Math.sin(b.a);
  b.w += (fx * ny - fy * nx) * vn * 0.008;
  return -vn;
}

// Açık bina köşesi: dik köşe yerine yay. rect.corners bitleri 1 KB, 2 KD, 4 GB, 8 GD.
// circleRect temas bulduktan sonra çağrılır; köşe bölgesindeyse derinliği ve normali yayla düzeltir.
function roundCorner(cx, cy, r, rect, out, depth) {
  const R = rect.radius;
  const west = cx < rect.x + R;
  const east = cx > rect.x + rect.w - R;
  const north = cy < rect.y + R;
  const south = cy > rect.y + rect.h - R;
  if (!(west || east) || !(north || south)) return depth;
  const bit = (north ? (west ? 1 : 2) : (west ? 4 : 8));
  if (!(rect.corners & bit)) return depth;
  const ox = west ? rect.x + R : rect.x + rect.w - R;
  const oy = north ? rect.y + R : rect.y + rect.h - R;
  const dx = cx - ox;
  const dy = cy - oy;
  const d = Math.hypot(dx, dy);
  if (d >= r + R) return -1;
  if (d < 1e-6) return depth;
  out.nx = dx / d;
  out.ny = dy / d;
  return r + R - d;
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
  CHAIRS: 21, UNCLES: 22, SIMITCART: 23, STALL: 24, LAUNDRY: 25, QUEUE: 26, DONER: 27, PROMO: 28, DANCER: 29,
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
  { r: 14, brk: 20, drag: 0.04, dmg: 0, coin: false, chip: '#5c6b7a', safe: true }, // Yaşlı amcaların masası: araç değmez
  { r: 13, brk: 30, drag: 0.05, dmg: 0.3, coin: true, chip: '#d9a441', snd: 'simit' },
  { r: 15, brk: 25, drag: 0.05, dmg: 0.3, coin: true, chip: '#5bb04a', snd: 'chairs' },
  { r: 0, brk: 0, drag: 0, dmg: 0, coin: false, chip: '#fff', pass: true },
  { r: 15, brk: 20, drag: 0.04, dmg: 0, coin: false, chip: '#2a1f3a', safe: true },
  { r: 0, brk: 0, drag: 0, dmg: 0, coin: false, chip: '#fff', pass: true }, // Döner şişi, vitrinde
  { r: 0, brk: 0, drag: 0, dmg: 0, coin: false, chip: '#fff', pass: true }, // İndirim afişi
  { r: 0, brk: 0, drag: 0, dmg: 0, coin: false, chip: '#fff', pass: true }, // Şişme balon
];

const POWER_KINDS = ['blast', 'ghost', 'heal', 'giant'];
const isPower = (kind) => kind >= PROP.POWER_BLAST && kind <= PROP.POWER_GIANT;
const powerName = (kind) => POWER_KINDS[kind - PROP.POWER_BLAST];
const HW = W.highway;
// Otoban satırı: bu chunk sırasını doğudan batıya kesen bant
const isHighwayRow = (cy) => ((cy - HW.offset) % HW.every + HW.every) % HW.every === 0;
const HIGHWAY = { top: HW.y0 * TILE, mid: (HW.y0 + HW.half + 0.5) * TILE, bottom: (HW.y0 + HW.half * 2 + 1) * TILE };
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
    pads: [], padCount: 0, road: 0, alley: 0, paths: [], hw: false, talls: [], fires: [], balc: [],
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
    this.kolej = null;
    this.marks = null;
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
    this.kolej = null;
    this.marks = null;
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

  // Oyuncunun çevresini yükle, uzaktakileri sil. Kare başına en fazla 1 chunk üretir.
  update(px, py) {
    const pcx = Math.floor(px / CHUNK);
    const pcy = Math.floor(py / CHUNK);
    this.frame++;
    let budget = 1; // Kare başına en fazla bir chunk üretilir
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

  // Bu noktada korunan yapı var mı (cami)
  sacredAt(x, y) {
    const tx = Math.floor(x / TILE); const ty = Math.floor(y / TILE);
    const cx = Math.floor(tx / CT); const cy = Math.floor(ty / CT);
    const c = this.chunk(cx, cy);
    const id = c.rectAt[(ty - cy * CT) * CT + (tx - cx * CT)];
    return id > 0 && c.rects[id - 1].sacred;
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
        let depth = circleRect(x, y, r, rect.x, rect.y, rect.w, rect.h, this.tmp);
        if (depth > 0 && rect.corners) depth = roundCorner(x, y, r, rect, this.tmp, depth);
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
    if (!rect.alive || rect.sacred) return;
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
    c.paths.length = 0;
    c.talls.length = 0;
    c.fires.length = 0;
    c.balc.length = 0;
    c.hw = isHighwayRow(cy);
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
    const mark = this.landmarkAt(cx, cy);
    const big = this.bigSiteAt(cx, cy);
    this.biomeAt(cx, cy, biomeOut);
    seedRng(cx, cy, this.seed);
    c.biome = biomeOut.biome;
    c.road = rint(0, 2); // Yol tonu: koyu asfalt, gri asfalt, açık beton
    c.alley = rint(0, 1);
    const home = Math.abs(cx) <= 1 && Math.abs(cy) <= 1;
    let t = home ? 'mahalle' : 'city';
    if (cx === sis.cx && cy === sis.cy) {
      t = 'kolej';
    } else if (mark) {
      t = mark;
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
    else if (t === 'keyif') this.fillDense(c, 'keyif', null);
    else if (t === 'site') this.fillSite(c, SITE_NAMES[rint(0, SITE_NAMES.length - 1)], PASTELS[rint(0, PASTELS.length - 1)], rint(0, 1), true);
    else if (t === 'bigsite') this.fillSite(c, big.name, big.color, big.layout, c.cx === big.cx && c.cy === big.cy);
    else if (t === 'cami') this.fillDense(c, 'mahalle', { style: BUILD.MOSQUE, w: 12, h: 12, color: '#c7cdd3', pad: 'courtyard', sign: '' });
    else if (t === 'stadyum') this.fillDense(c, 'mahalle', { style: BUILD.STADIUM, w: 18, h: 16, color: '#58606b', sign: '' });
    else if (t === 'hastane') this.fillDense(c, 'mahalle', { style: BUILD.HOSPITAL, w: 13, h: 10, color: '#f1f5f8', pad: 'ambulance', sign: 'Şehir Hastanesi' });
    else if (t === 'okul') this.fillDense(c, 'mahalle', { style: BUILD.SCHOOL, w: 12, h: 6, color: '#e8cf9a', pad: 'yard', sign: 'Cumhuriyet İlkokulu' });
    else if (t === 'spor') this.fillDense(c, 'mahalle', { sport: true });
    else if (t === 'golet') this.fillDense(c, 'mahalle', { pond: true });
    else if (t === 'insaat' || t === 'harabe' || t === 'sanayi') this.fillZone(c, t);
    else if (t === 'donel') this.fillRoundabout(c);
    else if (t === 'viraj') this.fillCurvy(c);
    else if (t === 'pazar') this.fillPazar(c);
    else if (t === 'kolej') this.fillSistem(c);
    else if (LANDMARKS.has(t)) this.fillLandmark(c, t);
    else if (t === 'sea') this.fillSea(c);
    else if (t === 'beach') this.fillBeach(c);
    else if (t === 'forest') this.fillForest(c);
    else if (t === 'desert') this.fillDesert(c);
    else if (t === 'rural') this.fillRural(c);
    else if (t === 'park') this.fillPark(c);
    else if (t === 'lake') this.fillLake(c);
    else if (t === 'industrial') this.fillIndustrial(c);
    else this.fillPlaza(c);

    if (c.hw) this.carveHighway(c);
    this.arterialDetails(c);
    this.fitStreets(c);
    this.dressShops(c);
    this.finishCost(c);
    c.baseProps = c.propCount;
    this.collectTalls(c);
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
    // Kayıt yeniden kullanılır: önceki binanın tabela görüntüsü kalmasın (render.js rectSign önbelleği)
    r.signImg = null;
    r.landmark = ''; r.signArt = ''; r.roofSignH = 0; r.noRoofSign = false; r.variant = '';
    r.sign = ''; r.signColor = ''; r.brand = ''; r.neon = false; r.deep = false; r.signSize = 1; r.block = 0; r.tall = 0; r.fire = false; r.corners = 0; r.radius = 0; r.sacred = false;
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
    // Özel yapı büyük blok ister: sokak sayısı azalır
    const big = mark && (mark.sport || mark.style === BUILD.STADIUM);
    this.cutAlleys(c, true, mark ? (big ? 1 : 2) : P.alleys[0], P.wide, xsBuf);
    this.cutAlleys(c, false, mark ? 1 : P.alleys[1], P.wide, ysBuf);
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

  // Boş kaldırım karolarını parsellere böler: kıvrımlı yolun çevresi gibi düzensiz alanlar için
  fillGreedy(c, maxB, y0 = ART, y1 = CT) {
    const free = (x, y) => {
      if (x >= CT || y >= y1) return false;
      const i = y * CT + x;
      if (c.rectAt[i] || c.ground[i] !== GROUND.WALK) return false;
      for (const [rx, ry] of RESERVED) if (rx === x && ry === y) return false;
      return true;
    };
    for (let y = y0; y < y1; y++) {
      for (let x = ART; x < CT; x++) {
        if (!free(x, y)) continue;
        const mw = rint(2, maxB); const mh = rint(2, maxB);
        let w = 1;
        while (w < mw && free(x + w, y)) w++;
        let h = 1;
        for (; h < mh; h++) {
          let ok = true;
          for (let k = 0; k < w; k++) if (!free(x + k, y + h)) { ok = false; break; }
          if (!ok) break;
        }
        this.building2(c, x, y, x + w, y + h); // Tek karo da dolar: kapalı cep kalmasın
      }
    }
  }

  // Yol izi: yumuşak eğriyle karolar açılır, çizim tarafı aynı eğriyi çizer
  carve(c, pts, rad, ring) {
    const r2 = rad * rad;
    const stamp = (px, py) => {
      for (let y = Math.floor(py - rad); y <= Math.ceil(py + rad); y++) {
        for (let x = Math.floor(px - rad); x <= Math.ceil(px + rad); x++) {
          if (x < ART || y < ART || x >= CT || y >= CT) continue;
          const dx = x + 0.5 - px; const dy = y + 0.5 - py;
          if (dx * dx + dy * dy <= r2 && c.ground[y * CT + x] === GROUND.WALK) c.ground[y * CT + x] = GROUND.TRACK;
        }
      }
    };
    const dense = sampleCurve(pts, ring);
    for (let i = 0; i < dense.length; i += 2) stamp(dense[i], dense[i + 1]);
    c.paths.push({ pts: dense, w: rad * 2 * 0.8, ring: !!ring });
  }

  // Kıvrımlı yol, U dönüşü ya da Y ayrımı; çevresi yine parsellere bölünür
  fillCurvy(c) {
    const P = W.profiles.mahalle;
    this.P = P; this.profile = 'mahalle';
    this.setGround(c, ART, ART, CT, CT, GROUND.WALK);
    const kind = rint(0, 2);
    const v = rint(0, 3);
    // Virajın yanında düz sokaklar da olsun
    this.addStreet(c, true, rint(11, 13) + v, 2, GROUND.ROAD);
    this.addStreet(c, true, rint(23, 26), 1, GROUND.ALLEY);
    if (kind === 0) { // S virajı
      const a = rint(7, 11); const b = rint(21, 26);
      this.carve(c, [[ART, a], [11, a], [16, (a + b) / 2], [21, b], [CT, b]], 1.5);
      this.carve(c, [[v + 7, ART], [v + 7, 13]], 1);
      this.carve(c, [[26 - v, b], [26 - v, CT]], 1);
    } else if (kind === 1) { // U dönüşü: iki paralel yol yarım daireyle birleşir
      const y0 = rint(7, 9); const y1 = y0 + 10;
      this.carve(c, [[ART, y0], [22, y0], [28, y0 + 1], [29.5, (y0 + y1) / 2], [28, y1 - 1], [22, y1], [ART, y1]], 1.5);
      this.carve(c, [[ART, y1 + 7], [CT, y1 + 7]], 1.4);
      this.carve(c, [[14, y0], [14, ART]], 1);
    } else { // Y ayrımı: tek yol ikiye ayrılır
      const m = rint(14, 18);
      this.carve(c, [[ART, m], [13, m], [20, m - 3], [CT, rint(6, 8)]], 1.5);
      this.carve(c, [[13, m], [20, m + 3], [CT, rint(25, 28)]], 1.5);
      this.carve(c, [[8, m], [8, CT]], 1);
    }
    this.fillGreedy(c, P.maxB);
    this.alleyLife(c);
  }

  // Dönel kavşak: dört kol, ortada ada
  fillRoundabout(c) {
    const P = W.profiles.mahalle;
    this.P = P; this.profile = 'mahalle';
    this.setGround(c, ART, ART, CT, CT, GROUND.WALK);
    const m = rint(15, 19);
    this.addStreet(c, true, m - 1, 2, GROUND.ROAD);
    this.addStreet(c, false, m - 1, 2, GROUND.ROAD);
    const n = 28;
    const ring = [];
    for (let i = 0; i <= n; i++) { const a = (i / n) * 6.2832; ring.push([m + Math.cos(a) * 5.2, m + Math.sin(a) * 5.2]); }
    this.carve(c, ring, 1.9, true);
    this.setGround(c, m - 3, m - 3, m + 3, m + 3, GROUND.GRASS);
    const r = this.addRect(c, 'island', m - 3, m - 3, m + 3, m + 3, 18, 0, '#6fae3e');
    r.cx = c.x + m * TILE; r.cy = c.y + m * TILE;
    const r2 = rint(5, 8);
    for (let k = 0; k < 2; k++) { const a = rint(5, 26); const horizontal = k === 0; if (Math.abs(a - m) < 9) continue; this.addStreet(c, !horizontal, a, 2, GROUND.ROAD); }
    void r2;
    this.fillGreedy(c, P.maxB);
    this.alleyLife(c);
  }

  // Otoban bandı: içindeki her şey kalkar, kuzeye ve güneye şerit, ortada beton bariyer
  carveHighway(c) {
    const y0 = HW.y0; const y1 = HW.y0 + HW.half * 2 + 1;
    const top = c.y + y0 * TILE; const bot = c.y + y1 * TILE;
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (r.kind === 'gone' || r.y + r.h <= top || r.y >= bot) continue;
      for (let k = 0; k < CELLS; k++) if (c.rectAt[k] === i + 1) c.rectAt[k] = 0;
      r.kind = 'gone'; r.w = 0; r.h = 0; r.sign = '';
    }
    for (let j = 0; j < c.padCount; j++) {
      const p = c.pads[j];
      if (p.ty < y1 && p.ty + p.h > y0) { p.w = 0; p.h = 0; }
    }
    let n = 0;
    for (let i = 0; i < c.propCount; i++) {
      const p = c.props[i];
      if (p.y >= top - 30 && p.y <= bot + 30) continue;
      if (n !== i) { const t = c.props[n]; c.props[n] = p; c.props[i] = t; }
      n++;
    }
    c.propCount = n;
    this.setGround(c, ART, y0, CT, y1, GROUND.ROAD);
    this.setGround(c, ART, y0 + HW.half, CT, y0 + HW.half + 1, GROUND.PLAZA);
    const b = this.addRect(c, 'barrier', ART, y0 + HW.half, CT, y0 + HW.half + 1, 0, 0, '#c9ccd0');
    b.y += 15; b.h = 10;
    if (c.biome === 'city' && c.template !== 'site' && c.template !== 'bigsite') {
      this.P = W.profiles.mahalle; this.profile = 'mahalle';
      this.fillGreedy(c, 5, Math.max(ART, y0 - 6), Math.min(CT, y1 + 6));
    }
  }

  // n ara sokak: kenardan kenara, iki ucu da ana yola bağlanır
  cutAlleys(c, vertical, n, wide, out) {
    out.length = 0;
    out.push(ART);
    const span = CT - ART;
    for (let i = 1; i <= n; i++) {
      const w = chance(wide) ? 2 : 1;
      const p = ART + Math.round((span * i) / (n + 1)) + rint(-1, 1);
      // İki karo sokak gerçek yol, bir karo dar ara sokak
      this.addStreet(c, vertical, p, w, w >= 2 ? GROUND.ROAD : GROUND.ALLEY);
      out.push(p, p + w);
    }
    out.push(CT);
  }

  packBlock(c, x0, y0, x1, y1) {
    const P = this.P;
    const w = x1 - x0;
    const h = y1 - y0;
    // Çıkmaz sokak: bloğun kenarından içeri bir karo, ucunda araç dönsün diye üç karo genişliğinde cep var
    if (w >= 9 && h >= 7 && chance(P.stub)) {
      const sx = x0 + rint(3, w - 4);
      const len = Math.max(3, rint(3, h - 3));
      const by = y0 + len - 2; // Cebin üst kenarı
      this.setGround(c, sx, y0, sx + 1, y0 + len, GROUND.ALLEY);
      this.setGround(c, sx - 1, by, sx + 2, y0 + len, GROUND.ALLEY);
      this.split2(c, x0, y0, sx - 1, y1, P.maxB);
      this.split2(c, sx + 2, y0, x1, y1, P.maxB);
      this.split2(c, sx - 1, y0, sx, by, P.maxB);
      this.split2(c, sx + 1, y0, sx + 2, by, P.maxB);
      this.split2(c, sx - 1, y0 + len, sx + 2, y1, P.maxB);
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
    p.kind = kind; p.tx = tx; p.ty = ty; p.w = w; p.h = h; p.text = '';
    return p;
  }

  // Bloğa özel yapı: cami, hastane, okul, stadyum, spor sahaları ya da gölet. Artan yer yine dolar
  markBlock(c, m, x0, y0, x1, y1) {
    const bw = x1 - x0;
    const bh = y1 - y0;
    if (m.sport) {
      const fw = Math.min(bw - 6, 12); const fh = Math.min(bh - 2, 9);
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
    r.sacred = m.style === BUILD.MOSQUE; // Saygı: hiçbir şey yıkamaz
    if (m.sign) { r.sign = m.sign; r.signColor = m.style === BUILD.HOSPITAL ? '#d0121b' : '#23422f'; r.signSize = 3; }
    if (padH > 0) {
      this.setGround(c, x0, y0 + h, x0 + w, y0 + h + padH, GROUND.PLAZA);
      this.addPad(c, m.pad, x0, y0 + h, w, padH);
    }
    this.split2(c, x0 + w, y0, x1, y1, this.P.maxB);
    this.split2(c, x0, y0 + h + padH, x0 + w, y1, this.P.maxB);
  }

  // Küçük bölgeler: inşaat alanı, harabe mahalle, eski sanayi
  fillZone(c, kind) {
    this.fillDense(c, kind, null);
    for (let i = ART * CT; i < CELLS; i++) if (c.ground[i] === GROUND.WALK && i % CT >= ART) c.ground[i] = GROUND.DIRT;
    const G = [GROUND.DIRT, GROUND.ALLEY];
    if (kind === 'insaat') { this.scatter(c, PROP.CONE, 14, G); this.scatter(c, PROP.BARRIER, 8, G); this.scatter(c, PROP.CRATE, 7, G); }
    else if (kind === 'harabe') { this.scatter(c, PROP.CRATE, 8, G); this.scatter(c, PROP.BARREL, 8, G); }
    else { this.scatter(c, PROP.BARREL, 12, G); this.scatter(c, PROP.CRATE, 10, G); }
  }

  building2(c, x0, y0, x1, y1) {
    const w = x1 - x0;
    const h = y1 - y0;
    const area = w * h;
    const P = this.P;
    const ins = chance(P.detached) ? 6 : 1; // Çoğu bitişik, bazıları ayrık
    const pz = this.profile;
    if (pz === 'insaat' || pz === 'harabe' || pz === 'sanayi' || (pz !== 'gecekondu' && area >= 6 && chance(W.ruin + W.work))) {
      let style = pz === 'sanayi' ? BUILD.FACTORY : pz === 'harabe' ? BUILD.RUIN : pz === 'insaat' ? BUILD.SITEWORK : chance(W.ruin / (W.ruin + W.work)) ? BUILD.RUIN : BUILD.SITEWORK;
      if (pz === 'harabe' && chance(0.22)) style = BUILD.GECEKONDU;
      if (pz === 'insaat' && chance(0.2)) style = BUILD.RUIN;
      const r = this.addRect(c, 'building', x0, y0, x1, y1, ins, style, '#8a8378');
      if (style === BUILD.RUIN && chance(W.ruinFire)) r.fire = true;
      return;
    }
    const SG = CONFIG.signs;
    const pick = (o) => o[rint(0, o.length - 1)];
    const keys = (o) => Object.keys(o);
    const add = (style, color, sign, signColor, size) => {
      const r = this.addRect(c, 'building', x0, y0, x1, y1, ins, style, color);
      if (style === BUILD.APARTMENT && chance(W.fire)) r.fire = true;
      if (sign) { r.sign = sign; r.signColor = signColor || pick(SG.colors); r.signSize = size ?? rint(0, 2); }
      return r;
    };
    const pf = this.profile;
    if (pf === 'gecekondu') {
      if (area >= 9) { add(BUILD.APARTMENT, ROOFS[rint(0, ROOFS.length - 1)], chance(0.4) ? pick(SG.shops) : ''); return; }
      add(BUILD.GECEKONDU, '#b08a5a', chance(0.12) ? pick(SG.shops) : '', '', 0);
      return;
    }
    if (pf === 'keyif') {
      if (area >= 6 && chance(0.7)) {
        const color = pick(SG.cafeColors);
        add(BUILD.CAFE, color, pick(SG.cafes), color, rint(1, 3));
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
      r.brand = SG.chainIds[brand];
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
    let blockNo = 0;
    for (const [x, y] of blocks) {
      const r = this.place(c, 'building', q(x), q(y), bw, bh, BUILD.SITE_BLOCK, color);
      if (r) r.block = (blockNo++) + (c.cx & 1) * 8 + (c.cy & 1) * 4;
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
          const sis = this.kolej;
          const clash = this.sites.some((o) => Math.abs(o.cx - ax) < 3 && Math.abs(o.cy - ay) < 3) || (Math.abs(sis.cx - ax) < 3 && Math.abs(sis.cy - ay) < 3)
            || this.landmarkList().some((o) => o.cx - ax >= -1 && o.cx - ax <= 2 && o.cy - ay >= -1 && o.cy - ay <= 2);
          if (out.biome === 'city' && !clash && !isHighwayRow(ay) && !isHighwayRow(ay + 1) && Math.max(Math.abs(ax), Math.abs(ay)) > 3) {
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
    if (!l) { l = { kind: 0, x: 0, y: 0, w: 0, h: 0, rect: null, at: 0 }; c.lights[c.lightCount] = l; }
    c.lightCount++;
    l.kind = kind; l.x = x; l.y = y; l.w = w; l.h = h; l.rect = rect;
  }

  // Yüksek binalar ve yangınlar: çizim tarafı yalnızca bu listelere bakar
  collectTalls(c) {
    const S = BUILD;
    const T = W.tall;
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (r.kind !== 'building') continue;
      if (r.landmark && W.landmarkHeight[r.landmark]) {
        r.tall = W.landmarkHeight[r.landmark];
        c.talls.push(r);
        continue;
      }
      const tower = r.style === S.SKYSCRAPER || r.style === S.RESIDENCE || r.style === S.OFFICE || (r.style >= S.TOWER_GLASS && r.style <= S.TOWER_STEP);
      const plain = r.style === S.APARTMENT || r.style === S.HOTEL || r.style === S.ISHANI || r.style === S.SITE_BLOCK;
      // Tohumdan türetilir: rastgele sayı dizisini bozmaz
      const h = ((r.seed * 2654435761) >>> 0) / 4294967296;
      if ((tower || (plain && h < T.share)) && c.talls.length < T.maxPerChunk) {
        r.tall = T.height[0] + (T.height[1] - T.height[0]) * (tower ? 0.5 + 0.5 * h : (h / T.share) * 0.6);
        if (r.style === S.SKYSCRAPER) r.tall = T.height[1];
        c.talls.push(r);
      }
      if (r.fire) c.fires.push(r);
      if (r.style === S.APARTMENT || r.style === S.SITE_BLOCK) c.balc.push(r);
    }
  }

  // Gece ışıkları: 0 sokak lambası, 1 pencere, 2 neon, 3 tabela
  collectLights(c) {
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (r.kind !== 'building' || r.style === BUILD.MESA) continue;
      if (r.style !== BUILD.STADIUM) {
        // Her pencere kendi sırasında yanar: at, gecenin hangi anında yanacağı
        const n = Math.max(1, Math.min(6, Math.floor((r.w - 6) / 16)));
        const cw = (r.w - 6) / n;
        for (let k = 0; k < n; k++) {
          this.addLight(c, 1, r.x + 3 + k * cw, r.y + r.h - 12, cw - 3, 11, r);
          c.lights[c.lightCount - 1].at = 0.08 + (((r.seed * 31 + k * 97) * 2654435761 >>> 0) / 4294967296) * 0.74;
        }
      }
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

  // Haritanın tek Kolej Koleji chunk'ı: tohuma bağlı, başlangıca yakın bir şehir bölgesinde
  sistemChunk() {
    if (this.kolej) return this.kolej;
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
      if (out.biome === 'city' && !isHighwayRow(cy) && Math.max(Math.abs(cx), Math.abs(cy)) > 1) found = { cx, cy };
    }
    this.kolej = found || { cx: a, cy: a };
    return this.kolej;
  }

  // Kolej kampüsü: haritanın en geniş ve en yüksek binası, bahçe, çit, servisler, spor sahaları
  fillSistem(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.GRASS);
    const r = this.addRect(c, 'building', 6, 6, 28, 15, 3, BUILD.KOLEJ, '#ff7a00');
    r.landmark = 'kolej'; r.sign = NAMES.kolej.ad; r.signColor = '#ff7a00'; r.signArt = 'kolej'; r.signSize = 3; r.roofSignH = 120;
    this.setGround(c, 6, 15, 28, 18, GROUND.PLAZA); // Ön avlu
    this.setGround(c, 15, 18, 20, CT, GROUND.PLAZA); // Kapıya giden yol
    this.setGround(c, ART, 18, 15, 20, GROUND.PLAZA);
    this.addPad(c, 'stairs', 14, 15, 6, 1);
    this.addPad(c, 'flag', 20, 16, 2, 2);
    this.setGround(c, 5, 21, 13, 26, GROUND.PLAZA);
    this.addPad(c, 'basket', 5, 21, 8, 5);
    this.setGround(c, 5, 26, 14, 31, GROUND.PLAZA);
    this.addPad(c, 'foot', 5, 26, 9, 5);
    this.setGround(c, 21, 19, 31, 26, GROUND.PLAZA);
    this.addPad(c, 'parking', 21, 19, 10, 7);
    for (const bx of [22, 25, 28]) this.addRect(c, 'building', bx, 20, bx + 2, 24, 5, BUILD.SERVIS, '#f5b800');
    this.fence(c, [[15, 20]], [[18, 20]], '#24262b');
    this.scatter(c, PROP.TREE, 46, [GROUND.GRASS]);
    this.scatter(c, PROP.BUSH, 16, [GROUND.GRASS]);
    for (let k = 19; k < 30; k += 3) { this.addProp(c, PROP.BENCH, c.x + 14.6 * TILE, c.y + (k + 0.5) * TILE, Math.PI / 2); this.addProp(c, PROP.BENCH, c.x + 20.4 * TILE, c.y + (k + 0.5) * TILE, Math.PI / 2); }
  }

  // Çevre çiti: güneyde ve batıda verilen karo aralıklarında kapı boşluğu bırakır
  fence(c, southGaps, westGaps, color) {
    const thin = (r, side) => {
      if (side === 'n') r.h = 6;
      else if (side === 's') { r.y += r.h - 6; r.h = 6; }
      else if (side === 'w') r.w = 6;
      else { r.x += r.w - 6; r.w = 6; }
    };
    const run = (side, from, to, gaps) => {
      let a = from;
      for (const [g0, g1] of [...gaps, [to, to]]) {
        if (g0 > a) {
          let r;
          if (side === 'n') r = this.addRect(c, 'wall', a, ART, g0, ART + 1, 0, 0, color);
          else if (side === 's') r = this.addRect(c, 'wall', a, CT - 1, g0, CT, 0, 0, color);
          else if (side === 'w') r = this.addRect(c, 'wall', ART, a, ART + 1, g0, 0, 0, color);
          else r = this.addRect(c, 'wall', CT - 1, a, CT, g0, 0, 0, color);
          thin(r, side);
        }
        a = g1;
      }
    };
    run('n', ART, CT, []);
    run('s', ART, CT, southGaps);
    run('w', ART + 1, CT - 1, westGaps);
    run('e', ART + 1, CT - 1, []);
  }

  // Özel yerlerin chunk'ları: tohuma bağlı, kolejden, büyük sitelerden ve birbirinden ayrı
  landmarkList() {
    if (this.marks) return this.marks;
    this.marks = [];
    const sis = this.sistemChunk();
    const out = { biome: '', sea: false };
    W.landmarks.forEach((m, n) => {
      const [a, b] = m.ring;
      for (let i = 0; i < 600; i++) {
        seedRng(i, 131 + n, this.seed ^ 0x5a5a);
        const r = a + rnd() * (b - a + i * 0.01);
        const t = rnd() * 6.283;
        const x = Math.round(Math.cos(t) * r);
        const y = Math.round(Math.sin(t) * r);
        if (Math.max(Math.abs(x), Math.abs(y)) <= 1 || isHighwayRow(y)) continue;
        if (Math.abs(sis.cx - x) < 2 && Math.abs(sis.cy - y) < 2) continue;
        if (this.marks.some((o) => Math.abs(o.cx - x) < 2 && Math.abs(o.cy - y) < 2)) continue;
        this.biomeAt(x, y, out);
        if (out.biome !== 'city' && !(m.id === 'meram' && (out.biome === 'rural' || out.biome === 'forest'))) continue;
        this.marks.push({ id: m.id, cx: x, cy: y });
        break;
      }
    });
    return this.marks;
  }

  landmarkAt(cx, cy) {
    for (const m of this.landmarkList()) if (m.cx === cx && m.cy === cy) return m.id;
    return null;
  }

  // Tramvay rayı kuzeydeki ana yolda, durak adıyla
  tram(c, stop) {
    const p = this.addPad(c, 'tram', 0, 0, CT, ART);
    p.text = stop;
  }

  sign(r, text, color, size = 2) {
    r.sign = text; r.signColor = color; r.signSize = size;
    return r;
  }

  fillLandmark(c, id) {
    const K = NAMES.konya;
    const D = K.duraklar;
    const B = BUILD;
    if (id === 'mevlana') {
      this.setGround(c, ART, ART, CT, CT, GROUND.PLAZA);
      this.sign(this.addRect(c, 'building', 7, 6, 27, 16, 3, B.MUZE, '#dcccaa'), K.mevlana, '#0b7f69', 2);
      this.setGround(c, 6, 18, 14, 28, GROUND.GRASS);
      this.addPad(c, 'gul', 6, 18, 8, 10);
      this.setGround(c, 21, 18, 29, 28, GROUND.GRASS);
      this.addPad(c, 'gul', 21, 18, 8, 10);
      this.addRect(c, 'water', 16, 20, 19, 23, 10, 2, '#3aa7e8'); // Şadırvan
      this.addPad(c, 'yildiz', 14, 24, 7, 6);
      this.scatter(c, PROP.TREE, 14, [GROUND.GRASS]);
      for (let k = 7; k < 28; k += 4) this.addProp(c, PROP.BENCH, c.x + (k + 0.5) * TILE, c.y + 17.3 * TILE);
      this.tram(c, D[2]);
    } else if (id === 'alaaddin') {
      this.setGround(c, ART, ART, CT, CT, GROUND.GRASS);
      this.addPad(c, 'hill', 7, 7, 21, 21);
      // Tepenin çevresinde yürüyüş halkası ve çay bahçeleri
      for (let y = ART; y < CT; y++) for (let x = ART; x < CT; x++) {
        const d = Math.hypot(x + 0.5 - 17.5, y + 0.5 - 17.5);
        if (d > 11.2 && d < 12.6) c.ground[y * CT + x] = GROUND.PLAZA;
      }
      this.sign(this.addRect(c, 'building', 13, 12, 23, 19, 3, B.SELCUK_CAMI, '#c9b99a'), K.alaaddin, '#4a7870', 2);
      this.sign(this.addRect(c, 'building', 26, 26, 29, 29, 4, B.ANIT, '#b5523b'), K.tepe, '#2f6b4f', 1).variant = 'kosk';
      this.scatter(c, PROP.TREE, 40, [GROUND.GRASS]);
      this.scatter(c, PROP.UMBRELLA, 10, [GROUND.PLAZA]);
      this.scatter(c, PROP.CHAIRS, 8, [GROUND.PLAZA]);
      this.tram(c, D[0]);
    } else if (id === 'zafer') {
      this.setGround(c, ART, ART, CT, CT, GROUND.PLAZA);
      this.addPad(c, 'yildiz', 9, 9, 17, 17);
      this.sign(this.addRect(c, 'building', 15, 15, 20, 20, 2, B.ANIT, '#b9ad98'), K.zafer, '#a8323a', 1);
      for (const [x, y] of [[6, 6], [27, 6], [6, 27], [27, 27]]) this.addRect(c, 'water', x, y, x + 2, y + 2, 10, 2, '#3aa7e8');
      // Güney kenarında Konya fırınları
      K.firinlar.slice(0, 4).forEach((n, i) => this.sign(this.addRect(c, 'building', 5 + i * 6, 28, 10 + i * 6, 31, 3, B.SHOP, '#a8733f'), n, '#c8261e', 1));
      this.scatter(c, PROP.BENCH, 12, [GROUND.PLAZA]);
      this.scatter(c, PROP.SIMITCART, 3, [GROUND.PLAZA]);
      this.scatter(c, PROP.UNCLES, 4, [GROUND.PLAZA]);
      this.tram(c, D[1]);
    } else if (id === 'bedesten') {
      this.setGround(c, ART, ART, CT, CT, GROUND.PLAZA);
      this.sign(this.addRect(c, 'building', 5, 6, 30, 10, 3, B.BEDESTEN, '#c6b28c'), K.bedesten, '#7a2a18', 2);
      this.addRect(c, 'building', 5, 13, 30, 17, 3, B.BEDESTEN, '#c6b28c');
      this.addRect(c, 'building', 5, 20, 30, 24, 3, B.BEDESTEN, '#c6b28c');
      K.firinlar.forEach((n, i) => this.sign(this.addRect(c, 'building', 5 + i * 5, 27, 9 + i * 5, 31, 3, B.SHOP, '#a8733f'), n, '#c8261e', 1));
      this.scatter(c, PROP.STALL, 14, [GROUND.PLAZA]);
      this.scatter(c, PROP.UNCLES, 3, [GROUND.PLAZA]);
    } else if (id === 'kongre') {
      this.setGround(c, ART, ART, CT, CT, GROUND.PLAZA);
      this.sign(this.addRect(c, 'building', 5, 6, 30, 17, 3, B.KONGRE, '#1c7a8c'), K.kongre, '#1c4f6a', 2);
      this.addRect(c, 'water', 14, 20, 21, 24, 8, 2, '#3aa7e8');
      this.addPad(c, 'yildiz', 6, 19, 7, 7);
      this.addPad(c, 'yildiz', 22, 19, 7, 7);
      this.addPad(c, 'parking', 5, 27, 26, 4);
      for (let k = 7; k < 29; k += 3) this.addProp(c, PROP.BENCH, c.x + (k + 0.5) * TILE, c.y + 25.5 * TILE);
      this.tram(c, D[4]);
    } else if (id === 'kule') {
      this.setGround(c, ART, ART, CT, CT, GROUND.PLAZA);
      const t = this.sign(this.addRect(c, 'building', 13, 6, 18, 11, 2, B.KULE, '#1d3550'), NAMES.kule, '#1b3a5a', 2);
      t.landmark = 'kule'; t.noRoofSign = true; // Kulenin adı cephede, sivri çatıda yazı olmaz
      this.addRect(c, 'building', 6, 13, 29, 22, 3, B.AVM, '#aab3bb');
      this.addPad(c, 'parking', 5, 24, 26, 6);
      this.scatter(c, PROP.BENCH, 6, [GROUND.PLAZA]);
    } else if (id === 'kulturpark') {
      this.setGround(c, ART, ART, CT, CT, GROUND.GRASS);
      this.setGround(c, 16, ART, 19, CT, GROUND.PLAZA);
      this.setGround(c, ART, 16, CT, 19, GROUND.PLAZA);
      this.addRect(c, 'water', 6, 6, 13, 12, 6, 0, '#3aa7e8'); // Havuz: araba düşmez
      this.setGround(c, 21, 20, 30, 28, GROUND.PLAZA);
      this.addPad(c, 'amfi', 21, 20, 9, 8);
      this.sign(this.addRect(c, 'building', 16, 16, 19, 19, 4, B.ANIT, '#b5523b'), K.kulturpark, '#2f6b4f', 1).variant = 'kosk';
      this.scatter(c, PROP.TREE, 50, [GROUND.GRASS]);
      this.scatter(c, PROP.BENCH, 14, [GROUND.GRASS, GROUND.PLAZA]);
      this.tram(c, D[3]);
    } else if (id === 'meram') {
      this.setGround(c, ART, ART, CT, CT, GROUND.DIRT);
      this.addPad(c, 'bag', 4, 4, 13, 12);
      this.addPad(c, 'bag', 19, 18, 12, 12);
      this.setGround(c, ART, 16, CT, 18, GROUND.ALLEY);
      for (const [x, y] of [[19, 6], [24, 10], [6, 20], [11, 25]]) {
        this.addRect(c, 'building', x, y, x + 3, y + 3, 5, B.BAGEVI, '#f0e6d2');
      }
      this.sign(this.addRect(c, 'building', 26, 4, 30, 7, 5, B.BAGEVI, '#f0e6d2'), K.meram, '#5c3a22', 1);
      this.scatter(c, PROP.TREE, 34, [GROUND.DIRT]);
      this.scatter(c, PROP.BUSH, 12, [GROUND.DIRT]);
    } else {
      // Okullar: ad isim tablosunda, renkler uydurma ve genel
      const look = { serife: ['#efe2c0', '#c8261e'], ted: ['#f2f2f2', '#c1121f'], gundogdu: ['#ffe08a', '#1f3a68'] }[id];
      this.setGround(c, ART, ART, CT, CT, GROUND.GRASS);
      const r = this.sign(this.addRect(c, 'building', 7, 6, 27, 14, 3, B.OZEL_OKUL, look[0]), NAMES.okullar[id], look[1], 3);
      r.signColor = look[1];
      this.setGround(c, 7, 14, 27, 19, GROUND.PLAZA);
      this.addPad(c, 'yard', 7, 15, 10, 4);
      this.setGround(c, 15, 19, 20, CT, GROUND.PLAZA);
      this.setGround(c, 5, 21, 13, 27, GROUND.PLAZA);
      this.addPad(c, 'basket', 5, 21, 8, 6);
      this.setGround(c, 22, 21, 30, 27, GROUND.PLAZA);
      this.addRect(c, 'building', 23, 22, 25, 26, 5, B.SERVIS, '#f5b800');
      this.addRect(c, 'building', 26, 22, 28, 26, 5, B.SERVIS, '#f5b800');
      this.fence(c, [[15, 20]], [], '#3a3d44');
      this.scatter(c, PROP.TREE, 30, [GROUND.GRASS]);
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

  // Binaların sokağa bakan cepheleri geri çekilir ve açık köşeleri yuvarlanır. Karo yerleşimi değişmez,
  // yalnızca çizilen ve çarpılan dikdörtgen küçülür. Rastgele sayı kullanmaz, tohumu etkilemez
  fitStreets(c) {
    const { setback, cornerRadius } = W.street;
    const solid = (x, y) => x >= 0 && y >= 0 && x < CT && y < CT && c.rectAt[y * CT + x] !== 0;
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (r.kind !== 'building') continue;
      const x0 = Math.floor((r.x - c.x) / TILE);
      const y0 = Math.floor((r.y - c.y) / TILE);
      const x1 = Math.ceil((r.x + r.w - c.x) / TILE);
      const y1 = Math.ceil((r.y + r.h - c.y) / TILE);
      let w = false; let e = false; let n = false; let s = false;
      for (let y = y0; y < y1; y++) { if (!solid(x0 - 1, y)) w = true; if (!solid(x1, y)) e = true; }
      for (let x = x0; x < x1; x++) { if (!solid(x, y0 - 1)) n = true; if (!solid(x, y1)) s = true; }
      const left = c.x + x0 * TILE + (w ? setback : 1);
      const top = c.y + y0 * TILE + (n ? setback : 1);
      const right = c.x + x1 * TILE - (e ? setback : 1);
      const bottom = c.y + y1 * TILE - (s ? setback : 1);
      // Mevcut payı küçültmez: ayrık binalar yerinde kalır
      const nx0 = Math.max(r.x, left); const ny0 = Math.max(r.y, top);
      const nx1 = Math.min(r.x + r.w, right); const ny1 = Math.min(r.y + r.h, bottom);
      if (nx1 - nx0 >= 20 && ny1 - ny0 >= 20) { r.x = nx0; r.y = ny0; r.w = nx1 - nx0; r.h = ny1 - ny0; }
      // Köşe açık sayılır: iki yanı ve çaprazı boşsa. Bitişik binanın dikişinde çentik oluşmasın
      let m = 0;
      if (!solid(x0 - 1, y0) && !solid(x0, y0 - 1) && !solid(x0 - 1, y0 - 1)) m |= 1;
      if (!solid(x1, y0) && !solid(x1 - 1, y0 - 1) && !solid(x1, y0 - 1)) m |= 2;
      if (!solid(x0 - 1, y1 - 1) && !solid(x0, y1) && !solid(x0 - 1, y1)) m |= 4;
      if (!solid(x1, y1 - 1) && !solid(x1 - 1, y1) && !solid(x1, y1)) m |= 8;
      r.corners = m;
      r.radius = Math.min(cornerRadius, r.w * 0.5, r.h * 0.5);
    }
  }

  // Dükkân önleri: rastgele değil, bina tohumundan: aynı yerde hep aynı afiş. Yalnızca sokağa bakan cephelerde
  dressShops(c) {
    const F = CONFIG.signs.front;
    const promos = CONFIG.signs.promos.length;
    const S = BUILD;
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (r.kind !== 'building' || !r.sign || r.w < 50) continue;
      if (r.style !== S.SHOP && r.style !== S.SHOPROW && r.style !== S.CHAIN && r.style !== S.MARKET && r.style !== S.CAFE) continue;
      const south = Math.ceil((r.y + r.h - c.y) / TILE);
      const tx = Math.floor((r.x + r.w / 2 - c.x) / TILE);
      if (south >= CT || c.rectAt[south * CT + tx] !== 0 || c.ground[south * CT + tx] === GROUND.WATER) continue;
      const h1 = ((r.seed * 2654435761) >>> 0) / 4294967296;
      const h2 = ((r.seed * 40503 + 7919) >>> 0) % 1000 / 1000;
      const y = r.y + r.h;
      const doner = /döner/i.test(r.sign);
      if (doner) this.addProp(c, PROP.DONER, r.x + r.w * 0.26, y - 7);
      if (doner || h1 < F.promo) this.addProp(c, PROP.PROMO, r.x + r.w * 0.72, y + 1).v = Math.floor(h1 * 997) % promos;
      if (h2 < (doner ? F.donerDancer : F.dancer)) this.addProp(c, PROP.DANCER, r.x + (h2 < 0.05 ? r.w - 7 : 7), y + 2).v = Math.floor(h2 * 991) % 3;
    }
  }

  finishCost(c) {
    const COST = [3, 1, 2, 1, 0, 3, 2, 3, 3, 1, 1];
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
const LANDMARKS = new Set(CONFIG.world.landmarks.map((m) => m.id));
const PASTELS = ['#7fa8c9', '#c9a27f', '#a0a8b8', '#8fb59a', '#c98f8f', '#b0a080', '#9a8fc0'];
const RESERVED = [[CT - 1, ART], [ART, CT - 1], [ART, ART]];
const xsBuf = [];
const ysBuf = [];

// Köşeli noktalardan yumuşak eğri: düz dizi [x, y, x, y...] döner
function sampleCurve(pts, ring) {
  const out = [];
  const n = pts.length;
  if (ring || n < 3) {
    for (let i = 0; i < n - 1; i++) {
      const steps = ring ? 3 : Math.ceil(Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) * 2);
      for (let k = 0; k < steps; k++) { const t = k / steps; out.push(pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t); }
    }
    out.push(pts[n - 1][0], pts[n - 1][1]);
    return out;
  }
  // Catmull-Rom
  for (let i = 0; i < n - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)]; const p1 = pts[i]; const p2 = pts[i + 1]; const p3 = pts[Math.min(n - 1, i + 2)];
    const steps = Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) * 2);
    for (let k = 0; k < steps; k++) {
      const t = k / steps; const t2 = t * t; const t3 = t2 * t;
      for (let d = 0; d < 2; d++) out.push(0.5 * (2 * p1[d] + (p2[d] - p0[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (3 * p1[d] - p0[d] - 3 * p2[d] + p3[d]) * t3));
    }
  }
  out.push(pts[n - 1][0], pts[n - 1][1]);
  return out;
}

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
    this.density = 1; // Kalite ayarı: 1 hepsi, 0.5 yarısı üretilir
    this.colors = ['#888888'];

    // Lastik izleri aurum tampon: x1,y1,x2,y2,yaş
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
    if (this.density < 1 && Math.random() > this.density) return;
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
    for (let i = 0; i < this.waves.length; i++) {
      const w = this.waves[i];
      if (!w.alive) continue;
      w.t += dt * 2.4;
      w.r = w.max * (1 - (1 - w.t) * (1 - w.t));
      if (w.t >= 1) w.alive = false;
    }
    for (let i = 0; i < this.floats.length; i++) {
      const f = this.floats[i];
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
const CHASE = CONFIG.pursuit;

// En yakın k sesi işaretler: siren sesleri üst üste binip bozulmasın
function loudest(dists, k, mask) {
  mask.fill(0);
  for (let n = 0; n < k; n++) {
    let best = -1;
    let d = 1e8;
    for (let i = 0; i < dists.length; i++) if (!mask[i] && dists[i] < d) { d = dists[i]; best = i; }
    if (best < 0) break;
    mask[best] = 1;
  }
  return mask;
}

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
    // İki yandan sırayla gelir, erken safhada bulunduğu yandan
    const side = g.time >= CHASE.pincerFrom ? cop.side : (dx * -fy + dy * fx) > 0 ? -1 : 1;
    const gap = dist < 90 ? 14 : 44;
    const back = cop.type === 'advanced' ? -22 : 8;
    target.x = p.x + p.vx * 0.32 + fx * back - fy * side * gap;
    target.y = p.y + p.vy * 0.32 + fy * back + fx * side * gap;
  }

  // Önden gelen ve yol kapatan: oyuncunun gidiş çizgisindeki bir noktaya gider
  let brake = false;
  if ((cop.role === 'interceptor' || cop.role === 'blocker') && g.ghostT <= 0) {
    cop.roleT -= dt;
    const sp = Math.max(1, p.speed);
    const hx = p.vx / sp;
    const hy = p.vy / sp;
    const ahead = -(dx * hx + dy * hy);
    if (ahead < 60 || cop.roleT <= 0 || p.speed < 60) {
      cop.role = 'chaser';
    } else if (cop.role === 'blocker' && ahead < CHASE.blockDist && g.roadWidthAt(cop.x, cop.y, hx, hy) >= CHASE.blockMinRoad) {
      cop.state = 'block';
      cop.blockT = CHASE.blockTime;
      cop.blockA = Math.atan2(hy, hx) + Math.PI / 2;
    } else {
      const off = cop.role === 'interceptor' ? cop.side * CHASE.interceptOffset : 0;
      const k = Math.min(ahead * 0.6, CHASE.interceptAhead);
      target.x = p.x + hx * k - hy * off;
      target.y = p.y + hy * k + hx * off;
      brake = cop.role === 'interceptor' && ahead < CHASE.interceptBrake;
    }
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
  if (brake) throttle = Math.min(throttle, 0.35);
  if (cop.hold) throttle = dist < 150 ? -1 : cop.speed > 70 ? -0.5 : 0; // Sıra bekler: oyuncunun çevresi tamamen kapanmaz

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
  const sacred = g.world.sacredAt(cop.x + Math.cos(cop.a) * 110, cop.y + Math.sin(cop.a) * 110);
  if ((ahead === GROUND.WATER || sacred) && g.flowReady) g.flow.sample(cop.x, cop.y, target, 6);
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
  if (cop.state === 'block') {
    // Yolun ortasında durup enine döner, oyuncu yaklaşınca ya da süre dolunca kovalamaya geçer
    cop.blockT -= dt;
    cop.ctlS = Math.max(-1, Math.min(1, wrapAngle(cop.blockA - cop.a) * 2));
    cop.ctlT = cop.speed > 60 ? -1 : 0;
    const d = Math.hypot(g.player.x - cop.x, g.player.y - cop.y);
    if (d < CONFIG.barricade.wakeDist || cop.blockT <= 0 || g.ghostT > 0) { cop.state = 'chase'; cop.role = 'chaser'; }
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
const HT = CONFIG.highwayTraffic;
const HWC = CONFIG.world.highway;
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
const HW_CARS = ['klasik', 'efe', 'elektra', 'bavar', 'aurum', 'stella', 'volta', 'pusula', 'dalga', 'lale', 'vadi', 'pickup', 'liva', 'bozkir', 'granit', 'marmara'];
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
      b.alive = false; b.kind = 'klasik'; b.spec = null; b.state = 'drive'; b.color = 0; b.t = 0;
      b.dir = 0; b.line = 0; b.lastCross = 1e9; b.hornT = 0; b.ctlS = 0; b.ctlT = 1; b.breaker = true;
      b.panicT = 0; b.waitT = 0;
      b.drive = { maxSpeed: 0, accel: 0, turnRate: 0, grip: 0, driftGrip: 0 };
      this.npcs.push(b);
    }
    // Otoban: hafif araç havuzu
    this.hw = [];
    for (let i = 0; i < HT.count; i++) this.hw.push({ alive: false, x: 0, y: 0, a: 0, vx: 0, vy: 0, speed: 0, cruise: 0, dir: 1, lane: 0, row: 0, kind: 'taxi', color: 0, spec: null, len: 0, wid: 0, mass: 1, hitT: 0, hornT: 0 });
    this.hwT = 0;
    this.hwCount = 0;
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
    for (const h of this.hw) h.alive = false;
    this.hwCount = 0;
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
    this.updateHighway(dt, g);
  }

  // --- Otoban trafiği ---
  spawnHighway(g) {
    const p = g.player;
    const cy = Math.floor(p.y / CHUNK);
    let row = null;
    for (const k of [cy, cy - 1, cy + 1]) if (isHighwayRow(k)) row = k;
    if (row === null) return;
    const mid = row * CHUNK + HIGHWAY.mid;
    if (Math.abs(p.y - mid) > HT.near) return;
    const h = this.hw.find((k) => !k.alive);
    if (!h) return;
    const dir = Math.random() < 0.5 ? 1 : -1;
    const lane = Math.floor(Math.random() * HWC.lanes);
    const laneW = (HWC.half * TILE - 24) / HWC.lanes;
    const y = mid + dir * (HIGHWAY.mid - HIGHWAY.top - 12 - laneW * (lane + 0.5));
    const R = g.viewRadius() + 60 + Math.random() * 480;
    const x = p.x + (Math.random() < 0.5 ? -R : R);
    if (g.onScreen(x, y, 90)) return;
    for (const o of this.hw) if (o.alive && o.y === y && Math.abs(o.x - x) < 110) return;
    const m = HT.mix;
    let r = Math.random() * (m.car + m.taxi + m.minibus + m.bus + m.truck);
    let kind;
    if ((r -= m.taxi) < 0) kind = 'taxi';
    else if ((r -= m.minibus) < 0) kind = 'minibus';
    else if ((r -= m.bus) < 0) kind = 'bus';
    else if ((r -= m.truck) < 0) kind = 'truck';
    else kind = HW_CARS[Math.floor(Math.random() * HW_CARS.length)];
    const spec = NP.types[kind];
    const heavy = kind === 'truck' || kind === 'bus';
    const [a, b] = heavy ? HT.truckSpeed : HT.speed;
    h.alive = true; h.x = x; h.y = y; h.dir = dir; h.lane = lane; h.row = row;
    h.kind = kind; h.spec = spec; h.color = Math.floor(Math.random() * spec.colors.length);
    h.len = spec.len; h.wid = spec.wid; h.mass = spec.mass;
    h.a = dir > 0 ? 0 : Math.PI;
    // İç şerit daha hızlı akar
    h.cruise = a + (b - a) * ((HWC.lanes - lane) / HWC.lanes) * (0.8 + Math.random() * 0.2);
    h.speed = h.cruise; h.hitT = 0; h.hornT = 0;
    h.vx = dir * h.speed; h.vy = 0;
  }

  updateHighway(dt, g) {
    this.hwT -= dt;
    if (this.hwT <= 0) {
      this.hwT = HT.spawnEvery;
      if (this.hwCount < HT.count * this.limit) this.spawnHighway(g);
    }
    const p = g.player;
    const hw = this.hw;
    const tick = g.tickCount;
    let n = 0;
    for (let i = 0; i < hw.length; i++) {
      const h = hw[i];
      if (!h.alive) continue;
      n++;
      if (Math.abs(h.x - p.x) > HT.range || Math.abs(h.y - p.y) > HT.range) { h.alive = false; continue; }
      // Öndeki aracı sırayla kontrol eder: her kare hepsi değil
      if ((tick + i) % 5 === 0) {
        let gap = 1e9; let lead = 0;
        for (let j = 0; j < hw.length; j++) {
          const o = hw[j];
          if (!o.alive || o.y !== h.y || j === i) continue;
          const d = (o.x - h.x) * h.dir;
          if (d > 0 && d < gap) { gap = d; lead = o.speed; }
        }
        const pd = (p.x - h.x) * h.dir;
        if (Math.abs(p.y - h.y) < 26 && pd > 0 && pd < gap) {
          gap = pd; lead = Math.max(0, (p.vx || 0) * h.dir);
          if (pd < HT.hornDist && h.hornT <= 0 && g.state === 'play') { h.hornT = 3; g.emit('horn', h.spec.horn); }
        }
        h.limit = gap < (h.len + 40) / 2 + HT.safeGap + h.speed * 0.28 ? lead : 1e9;
      }
      if (h.hornT > 0) h.hornT -= dt;
      const want = h.hitT > 0 ? 0 : Math.min(h.cruise, h.limit ?? 1e9);
      if (h.hitT > 0) h.hitT -= dt;
      h.speed += Math.max(-HT.brake * dt, Math.min(HT.accel * dt, want - h.speed));
      if (h.speed < 0) h.speed = 0;
      h.vx = h.dir * h.speed;
      h.x += h.vx * dt;
      const dx = h.x - p.x;
      const dy = h.y - p.y;
      const reach = (h.len + p.len) * 0.62;
      if (g.state === 'play' && !g.cheat && dx * dx + dy * dy < reach * reach) {
        const y = h.y;
        const rv = g.collideCars(p, h);
        h.y = y; h.vy = 0;
        if (rv > 30) {
          h.hitT = 2.5;
          g.fx.sparks((h.x + p.x) / 2, (h.y + p.y) / 2, 8);
          g.npcHits++;
          g.playerImpact(rv + 30, HT.hitScale * Math.min(2, Math.sqrt(h.mass)), true, HT.maxHit);
        }
      }
      if ((tick + i) % 3 === 0 && h.y > p.y - 1000 && h.y < p.y + 1000) {
        for (const c of g.cops) {
          if (c.flying) continue;
          const ax = c.x - h.x; const ay = c.y - h.y;
          const r2 = (c.len + h.len) * 0.55;
          if (ax * ax + ay * ay > r2 * r2) continue;
          const y = h.y;
          const rv = g.collideCars(c, h);
          h.y = y; h.vy = 0;
          if (rv > 50) { c.hp -= rv * 0.04; h.hitT = 2; }
        }
      }
    }
    this.hwCount = n;
  }

  // --- Yayalar ---
  pickKind() {
    if (this.g.daylight.k > 0.5 && Math.random() < 0.22) return 'cat'; // Gece sokak kedilerin
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
    if (PD.kinds[kind].road || PD.kinds[kind].dodge || PD.kinds[kind].safe) kind = 'man'; // Korunanlar yola inmez
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
    const cops = g.cops;
    for (let i = 0; i < cops.length; i++) {
      const c = cops[i];
      if (Math.abs(c.x - p.x) < 60 && Math.abs(c.y - p.y) < 60 && this.checkHit(p, c, false)) return;
    }
    const npcs = this.npcs;
    for (let i = 0; i < npcs.length; i++) {
      const n = npcs[i];
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
    if (isPlayer && this.g.cheat) return false;
    const r = b.len * 0.44 + 7;
    const dx = p.x - b.x;
    const dy = p.y - b.y;
    if (dx * dx + dy * dy >= r * r) return false;
    const speed = Math.hypot(b.vx, b.vy);
    // Çocuk, yaşlı, bebek arabası ve tekerlekli sandalye: araç asla değmez, kenara çekilirler
    if (p.info.safe) {
      const d = Math.hypot(dx, dy) || 1;
      p.x += (dx / d) * 34;
      p.y += (dy / d) * 34;
      p.a = Math.atan2(dy, dx);
      p.state = PED_RUN;
      p.turnT = 1.4;
      return false;
    }
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
      if (!p.alive || p.state === PED_FLY || p.info.dodge || p.info.safe) continue;
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
    // Dikey ana yol otoban bandına araç bırakmaz
    if (!horizontal) {
      const row = Math.floor(y / CHUNK);
      const ly = y - row * CHUNK;
      if (isHighwayRow(row) && ly > HIGHWAY.top - 60) return;
    }
    for (const o of this.npcs) if (o.alive && Math.hypot(o.x - x, o.y - y) < 180) return;

    let r = Math.random() * npcWeight;
    let kind = 'klasik';
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
      // Otobana inen kol yok: dikey trafik bandın önünde döner
      const hwAhead = !horizontal && (forward ? isHighwayRow(k) : isHighwayRow(k - 1));
      if (hwAhead || Math.random() < NP.turnChance) {
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
      const rv = g.cheat ? 0 : g.collideCars(p, n);
      if (rv > 30) this.hitNpc(n, rv, true);
    }
    // Polislerle çarpışma
    for (let i = 0; i < g.cops.length; i++) {
      const c = g.cops[i];
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
      for (let i = 0; i < g.cops.length; i++) {
        const c = g.cops[i];
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
    const npcs = this.npcs;
    for (let i = 0; i < npcs.length; i++) {
      const o = npcs[i];
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
const PU = CONFIG.pursuit;
const WT = CONFIG.water;
const tmpSirens = new Float32Array(CONFIG.sirens.length);
const byDist = (a, b) => a.pd - b.pd;

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

// Süreye göre zorluk: eğriler doğrusal olduğu için her saniye biraz artar.
// heat: arananlık. Yalnız polis baskısını öne alır, aşama ve uzaylı eşikleri süreye bağlıdır
function difficultyAt(t, out = {}, heat = 0) {
  const h = t + (t >= PU.heat.from ? heat : 0);
  out.stage = t >= D.tanksAt ? 3 : t >= D.advancedAt ? 2 : t >= D.swatAt ? 1 : 0;
  out.stars = Math.min(MAX_STARS, 1 + out.stage);
  out.maxPolice = Math.min(D.maxActive, Math.round(interp(PU.policeCurve, h) * PU.countMul));
  out.spawnInterval = interp(PU.spawnCurve, h) / PU.countMul;
  out.speedMul = interp(PU.speedCurve, h) * PU.speedMul;
  out.closeMax = Math.round(interp(PU.closeCurve, h));
  out.interceptShare = interp(PU.interceptShare, h);
  out.blockShare = interp(PU.blockShare, h);
  out.hpMul = interp(D.hpCurve, t);
  out.power = interp(D.powerCurve, t);
  out.aggression = interp(PU.aggressionCurve, h);
  out.flankerShare = interp(PU.flankerShare, h);
  out.swatShare = t >= D.swatAt ? interp(D.swatShare, t) : 0;
  out.advancedShare = t >= D.advancedAt ? interp(D.advancedShare, t) : 0;
  out.motoShare = t >= D.motoFrom ? interp(D.motoShare, t) : 0;
  out.fastShare = t >= D.fastFrom ? interp(D.fastShare, t) : 0;
  out.tanks = t >= D.tanksAt ? Math.round(interp(D.tankCount, t)) : 0;
  out.barricadeEvery = t >= BAR.from ? interp(PU.barricadeCurve, h) : Infinity;
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
  k = k * k * k * (k * (k * 6 - 15) + 10);
  // Gün doğumu gün batımından daha hafif: göz almayan sıcak turuncu
  const warm = Math.sin(Math.min(1, k * 1.1) * Math.PI) * (p >= Y.dawnFrom || p < Y.duskFrom ? 0.65 : 1);
  out.k = k;
  out.a = +(k * Y.darkness + warm * 0.1).toFixed(3);
  out.r = Math.round(10 + warm * 150);
  out.g = Math.round(14 + warm * 62);
  out.b = Math.round(46 - warm * 16);
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
  b.side = 1; b.roleT = 0; b.blockT = 0; b.blockA = 0; b.hold = false; b.far = false; b.pd = 0;
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
    for (let i = 0; i < D.maxActive; i++) this.copPool.push(makeCop()); // Oyun sırasında bellek ayrılmaz
    this.copLimit = D.maxActive;
    this.nearCops = [];
    this.flankSide = 1;
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
    this.heat = 0;
    this.recycleT = 0;
    this.cheat = false; // Kaydedilmez, her koşu kapalı başlar
    this.cheatUsed = false;
    this.phasing = false;
    this.exitOn = false;
    this.exitX = 0;
    this.exitY = 0;
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

  start(carSpec, { startTime = CONFIG.dev.startTime, god = CONFIG.dev.godMode, seed = (Math.random() * 1e9) | 0, keepWorld = false } = {}) {
    this.carSpec = carSpec;
    this.god = god;
    if (!keepWorld) this.world.reset(seed);
    this.resetRun(startTime);
    this.dayT = 0;
    dayState(0, this.daylight);
    resetBody(this.player, 100, 300, Math.PI / 2, carSpec);
    this.player.vy = 120;
    this.player.vx = 0;
    this.state = 'play';
    this.drop = null;
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

  // Geçiş: araç gökte bekler. Dünya hazır, zaman akmaz, kamera iniş noktasına kilitlidir
  holdForDrop() {
    this.state = 'drop';
    this.drop = { y: 1, size: 0.22, shadow: 0.1 };
    const p = this.player;
    this.cam.y = p.y;
    this.cam.lvy = 0;
    this.cam.zoom = CONFIG.camera.dropZoom;
    p.speed = 0;
  }

  // Yere değdiği an: iz, toz, sarsıntı
  landDrop() {
    const p = this.player;
    this.cam.shake = 15;
    this.fx.wave(this.player.x, this.player.y, 90);
    this.fx.sparks(this.player.x, this.player.y + this.player.wid * 0.5, 22);
    const c = Math.cos(p.a); const n = Math.sin(p.a);
    const ww = p.wid * 0.46; const back = p.len * 0.34;
    for (const sg of [-1, 1]) {
      const rx = p.x - c * back - n * ww * sg; const ry = p.y - n * back + c * ww * sg;
      const fx2 = p.x + c * back - n * ww * sg; const fy2 = p.y + n * back + c * ww * sg;
      // Dalgalı kısa frenle izi: düşüş yönünde
      this.fx.addSkid(rx, ry - 62, rx + 2 * sg, ry - 6);
      this.fx.addSkid(fx2, fy2 - 52, fx2 - 2 * sg, fy2 - 6);
      this.fx.addSkid(rx + 2 * sg, ry - 6, rx, ry + 8);
      this.fx.addSkid(fx2 - 2 * sg, fy2 - 6, fx2, fy2 + 8);
    }
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * 6.283;
      const sp = 70 + (i % 5) * 44;
      this.fx.spawn(i % 2 ? FX.DUST : FX.SMOKE, p.x + Math.cos(a) * p.len * 0.45, p.y + Math.sin(a) * p.wid * 0.7, Math.cos(a) * sp, Math.sin(a) * sp * 0.75, 0.55 + (i % 4) * 0.1, 14 + (i % 3) * 8);
    }
  }

  // Düşüş bitti: araç yolda hareketlenir
  releaseDrop() {
    this.drop = null;
    this.state = 'play';
    this.player.vy = 120;
    this.player.speed = 120;
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
    if (this.state === 'drop') { this.world.update(this.player.x, this.player.y); this.player.vy = 0; }
    else if (this.state === 'attract') this.tickAttract(dt);
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
    if (this.heat > 0) this.heat = Math.max(0, this.heat - PU.heat.decay * dt);
    difficultyAt(this.time, this.diff, this.heat);
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
    const noclip = this.cheat || this.exitOn;
    const surf = CONFIG.surfaces[this.cheat ? GROUND.ROAD : g]; // Hile: hiçbir zemin yavaşlatmaz
    // Duvara saplanınca kendiliğinden geri çıkar: tek parmakla oyun kilitlenmesin
    if (this.autoRevT > 0) {
      this.autoRevT -= dt;
      reverse = true;
    } else if (p.speed < 40 && !reverse && !noclip) {
      this.stuckT += dt;
      if (this.stuckT > DMG.autoReverseAfter) {
        this.stuckT = 0;
        this.autoRevT = DMG.autoReverseTime;
      }
    } else {
      this.stuckT = 0;
    }
    stepCar(p, steer, reverse ? -1 : 1, this.carSpec, surf, dt);
    p.gas = reverse ? 0 : Math.abs(p.steer) > CONFIG.physics.cornerSteer ? 0.45 : 1; // Motor sesi gazı buradan okur
    if (this.hitCd > 0) this.hitCd -= dt;

    // Derin suya düştü: ölümsüzlükte duvar gibi davranır, testler ve geliştirici için
    if (g === GROUND.WATER && !this.god && !noclip && this.world.circleHit(p.x, p.y, WT.deepProbe, hit) && isDeep(hit.rect)) {
      this.startSink();
      return;
    }

    if (noclip) {
      this.phasing = this.world.circleHit(p.x, p.y, p.wid * 0.6, hit);
      if (this.exitOn) this.stepExit(dt);
    } else {
      this.phasing = false;
      const impact = this.collideWorld(p, true);
      if (impact > 0) this.playerImpact(impact, DMG.wallScale, false);
    }
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

  // --- Gizli hile ---
  toggleCheat() {
    if (this.state !== 'play') return false;
    this.cheat = !this.cheat;
    if (this.cheat) {
      this.cheatUsed = true;
      this.exitOn = false;
    } else if (this.world.circleHit(this.player.x, this.player.y, this.player.wid * 0.8, hit)) {
      this.findExit();
    } else {
      this.phasing = false;
    }
    this.emit('cheat', this.cheat ? 1 : 0);
    return this.cheat;
  }

  // Hile bina içinde kapanırsa araç en yakın boş yere süzülür: duvara saplanmaz
  findExit() {
    const p = this.player;
    const r = p.wid * 0.8;
    for (let d = TILE; d < TILE * 40; d += TILE / 2) {
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * 6.283;
        const x = p.x + Math.cos(a) * d;
        const y = p.y + Math.sin(a) * d;
        if (this.world.circleHit(x, y, r, hit) || this.world.groundAt(x, y) === GROUND.WATER) continue;
        this.exitOn = true;
        this.exitX = x;
        this.exitY = y;
        return;
      }
    }
  }

  stepExit(dt) {
    const p = this.player;
    const k = 1 - Math.exp(-9 * dt);
    p.x += (this.exitX - p.x) * k;
    p.y += (this.exitY - p.y) * k;
    p.vx *= 0.8;
    p.vy *= 0.8;
    if (Math.hypot(this.exitX - p.x, this.exitY - p.y) < 5) { this.exitOn = false; this.phasing = false; }
  }

  addHeat(v) {
    if (!this.cheat) this.heat = Math.min(PU.heat.max, this.heat + v);
  }

  playerImpact(impact, mul, fromCop, cap = DMG.maxSingleHit) {
    if (this.cheat) return 0;
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
    if (this.god || this.giantT > 0 || this.cheat) return;
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
        if (!this.god && this.giantT <= 0 && !this.cheat) this.damage += DMG.burnRate * dt;
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

    if (this.damage >= DMG.stages[3] && !this.cheat) this.explodePlayer();
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
    // Hile kullanılan koşu kazandırmaz, rekor saymaz
    const earned = this.cheatUsed ? 0 : this.coins + Math.floor(this.runTime / SC.coinPerSeconds) + this.kills * SC.coinPerKill + Math.floor(this.nearMisses / SC.coinPerNearMisses);
    this.result = {
      score: Math.floor(this.score),
      time: this.time,
      coins: earned,
      kills: this.kills,
      broken: this.broken,
      driftTime: this.driftTime,
      nearMisses: this.nearMisses,
      cause: this.cause,
      cheated: this.cheatUsed,
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
      if (b.crusher && !isWaterRect(rect) && !rect.sacred) {
        this.crushRect(hit.chunk, rect);
        continue;
      }
      if (isPlayer && !this.god && isDeep(rect)) continue; // Oyuncu suya girer, batış ayrı karar verilir
      b.x += hit.nx * hit.depth;
      b.y += hit.ny * hit.depth;
      let impact = bounceOff(b, hit.nx, hit.ny);
      if (b.graze) impact *= DMG.grazeScale; // Sürtme sayılır: hasar ve sarsıntı çok az
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
          if (info.pass || (isPlayer && (this.cheat || this.exitOn))) continue;
          const rr = info.r + R;
          const d2 = dx * dx + dy * dy;
          if (d2 >= rr * rr) continue;
          const speed = Math.hypot(b.vx, b.vy);
          if (!info.safe && (speed >= info.brk || b.crusher || b.breaker || (isPlayer && this.giantT > 0))) {
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
    this.addHeat(PU.heat.prop);
    this.addScore(SC.prop, pr.x, pr.y);
    if (info.dmg > 0) this.hurt(info.dmg / this.carSpec.durability);
    this.emit('break', info.drag);
    if (info.snd) {
      this.emit(info.snd);
      if (pr.kind === PROP.SIMITCART) this.fx.burst(FX.SIMIT, pr.x, pr.y, 10, 210, 1.2, 7);
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
    resetBody(c, x, y, a, spec);
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
    // Uzaylılar kendi hızındadır. Polis zamanla hızlanır ama oyuncuyu geçemez
    const ratio = spec.speed < 1 ? Math.min(Math.max(spec.speed, PU.speedRatioMax), spec.speed * d.speedMul) : spec.speed;
    c.drive.maxSpeed = this.carSpec.maxSpeed * ratio * CONFIG.speedScale.police;
    c.drive.accel = spec.accel;
    c.drive.turnRate = spec.turnRate;
    c.drive.grip = spec.grip;
    c.drive.driftGrip = spec.driftGrip;
    c.maxHp = spec.hp * d.hpMul;
    c.hp = c.maxHp;
    c.power = d.power;
    c.ctlS = 0; c.ctlT = 1; c.stuckT = 0; c.reverseT = 0; c.reverses = 0;
    c.los = false; c.hitCd = 0; c.nearCd = 0; c.wakeT = 0;
    this.flankSide = -this.flankSide;
    c.side = this.flankSide; c.roleT = PU.roleTime; c.blockT = 0; c.hold = false; c.far = false;
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
    this.addHeat(PU.heat.kill);
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
    if (this.tickCount % PU.holdEvery === 0) this.assignHolds();

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
      // Uzak ve görünmeyen polis seyrek hesaplanır: adım büyür, sonuç aynı yola çıkar
      c.far = dist > PU.farDist && !c.flying && !this.onScreen(c.x, c.y, 200);
      if (c.far && (this.tickCount + c.id) % PU.farStep !== 0) {
        if (playing) {
          if (dist < nearest) nearest = dist;
          if (c.sirenId >= 0 && dist < sirens[c.sirenId]) sirens[c.sirenId] = dist;
        }
        continue;
      }
      const cdt = c.far ? dt * PU.farStep : dt;
      driveCop(c, this, cdt);
      if (c.hitCd > 0) c.hitCd -= cdt;
      if (c.nearCd > 0) c.nearCd -= cdt;
      c.fxT += cdt;

      if (c.flying) {
        this.updateUfo(c, dt, playing);
      } else if (c.state === 'barricade') {
        c.staticBody = true;
      } else {
        c.staticBody = false;
        const surf = CONFIG.surfaces[world.groundAt(c.x, c.y)];
        stepCar(c, c.ctlS, c.ctlT, c.drive, surf, cdt);
        const impact = this.collideWorld(c, false);
        if (impact > AI.wallMinImpact) {
          c.hp -= (impact - AI.wallMinImpact) * AI.wallDamage * (40 / Math.max(40, c.spec.hp * 0.5));
          c.hurtFlash = 0.3;
        }
        // Nesne taraması ekran çevresinde ve kare atlayarak: telefonda yük azalır
        if (!c.far && (this.tickCount + c.id) % 3 === 0 && this.onScreen(c.x, c.y, 160)) this.collideProps(c, false);
      }

      if (c.hurtFlash > 0) c.hurtFlash -= dt;
      if (c.hp < c.maxHp * 0.5 && Math.random() < 0.25 && this.onScreen(c.x, c.y, 60)) {
        this.fx.spawn(c.hp < c.maxHp * 0.25 ? FX.DARK : FX.SMOKE, c.x, c.y, c.vx * 0.2, c.vy * 0.2, 0.7, 11);
      }
      if (c.hp <= 0) { this.destroyCop(i, false); continue; }

      if (playing) {
        // Oyuncu ile çarpışma
        // Hilede polis görünür ve kovalar ama değemez
        if (!c.flying && dist < (c.len + p.len) * 0.75 && this.ghostT <= 0 && !this.cheat) {
          const rv = this.collideCars(p, c);
          if (rv > 1) this.copContact(c, rv, i);
          if (i >= this.cops.length || this.cops[i] !== c) continue;
        }
        // Yakın kaçış
        if (this.ghostT <= 0 && !this.cheat && c.nearCd <= 0 && c.hitCd <= 0 && dist < SC.nearMissDist + c.wid * 0.5 && c.state === 'chase') {
          const rvx = p.vx - c.vx;
          const rvy = p.vy - c.vy;
          const rel = Math.hypot(rvx, rvy);
          if (rel > SC.nearMissSpeed && dist > (c.wid + p.wid) * 0.55 && rvx * -dx + rvy * -dy > 0) {
            c.nearCd = 2.5;
            this.nearMisses++;
            this.addHeat(PU.heat.nearMiss);
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
        if (a.flying || b.flying || (a.far && b.far)) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const r = (a.len + b.len) * 0.6;
        if (dx * dx + dy * dy < r * r) this.collideCars(a, b);
      }
    }
    this.sirenDist = nearest;
    this.sirenClosing = closing;
  }

  // Adalet: oyuncunun çevresine aynı anda sınırlı polis girer, önü tamamen kapanmaz. Fazlası gaz keser
  assignHolds() {
    const p = this.player;
    const near = this.nearCops;
    near.length = 0;
    const fx = Math.cos(p.a);
    const fy = Math.sin(p.a);
    for (const c of this.cops) {
      c.hold = false;
      if (c.flying || c.type === 'tank' || c.state === 'barricade') continue;
      c.pd = Math.hypot(c.x - p.x, c.y - p.y);
      if (c.pd < PU.closeR) near.push(c);
    }
    near.sort(byDist);
    for (let i = this.diff.closeMax; i < near.length; i++) near[i].hold = true;
    let front = 0;
    for (const c of this.cops) {
      if (c.flying || c.type === 'tank' || c.state === 'barricade' || c.pd >= PU.frontR) continue;
      if ((c.x - p.x) * fx + (c.y - p.y) * fy < 0) continue;
      front++;
      if (front > PU.frontMax) c.hold = true;
    }
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
    c.beam = playing && this.ghostT <= 0 && !this.cheat && bd < AL.beamRange ? 1 : 0;
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
  countRole(role) {
    let n = 0;
    for (const c of this.cops) if (c.role === role) n++;
    return n;
  }

  pickRole(r) {
    const d = this.diff;
    let s = d.interceptShare;
    if (r < s) return this.countRole('interceptor') < PU.maxInterceptors ? 'interceptor' : 'chaser';
    s += d.blockShare;
    if (r < s) return this.countRole('blocker') < PU.maxBlockers ? 'blocker' : 'chaser';
    s += d.flankerShare;
    return r < s ? 'flanker' : 'chaser';
  }

  // Ekran dışındaki en uzak sıradan polisi havuza alır. Yenisi oyuncunun önünde doğar
  dropFarthest(minDist = 0) {
    const p = this.player;
    let best = -1;
    let far = minDist;
    for (let i = 0; i < this.cops.length; i++) {
      const c = this.cops[i];
      if (c.type === 'tank' || c.flying || this.onScreen(c.x, c.y, 120)) continue;
      const d = Math.hypot(c.x - p.x, c.y - p.y);
      if (d > far) { far = d; best = i; }
    }
    if (best < 0) return false;
    this.removeCop(best);
    return true;
  }

  // Özel araçlar için yer açar: sınır aşılmaz
  makeRoom(n) {
    while (this.cops.length + n > this.copLimit) if (!this.dropFarthest()) return false;
    return true;
  }

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
  findSpawn(out, minR, maxR, bias, spreadBy = 2.2) {
    const p = this.player;
    const heading = Math.atan2(p.vy, p.vx);
    for (let i = 0; i < 16; i++) {
      const spread = bias ? (Math.random() - 0.5) * spreadBy : Math.random() * 6.283;
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
    const cap = Math.min(d.maxPolice, this.copLimit);
    this.recycleT -= dt;
    if (this.recycleT <= 0) {
      this.recycleT = PU.recycleEvery;
      if (this.cops.length > this.copLimit) this.dropFarthest();
      else if (this.cops.length >= cap) this.dropFarthest(PU.recycleDist);
    }
    const active = this.cops.length;
    if (this.spawnT <= 0 && active < cap) {
      const min = this.viewRadius() + AI.viewMargin;
      const role = this.pickRole(Math.random());
      const ahead = role === 'interceptor' || role === 'blocker';
      if (this.findSpawn(spawnPt, min, min + AI.spawnExtra, ahead || Math.random() < 0.5, ahead ? PU.aheadSpread : 2.2)) {
        const type = this.pickType(Math.random());
        this.spawnCop(type, role, spawnPt.x, spawnPt.y, Math.atan2(p.y - spawnPt.y, p.x - spawnPt.x));
        this.spawnT = d.spawnInterval;
      } else {
        this.spawnT = 0.25;
      }
    }

    if (d.ufos > 0) {
      this.alienT -= dt;
      if (this.alienT <= 0) {
        this.alienT = AL.spawnEvery;
        const min = this.viewRadius() + 160;
        const heading = Math.atan2(p.vy, p.vx) + (Math.random() - 0.5) * 2.6;
        if (this.countType('ufo') < Math.min(d.ufos, Math.ceil(this.copLimit * 0.2)) && this.makeRoom(1)) {
          // Daire binaya takılmaz, önünden gelir
          this.spawnCop('ufo', 'chaser', p.x + Math.cos(heading) * min, p.y + Math.sin(heading) * min, 0);
        }
        if (this.countType('rover') < Math.min(d.rovers, Math.ceil(this.copLimit * 0.4)) && this.makeRoom(1) && this.findSpawn(spawnPt, min, min + 300, true)) {
          this.spawnCop('rover', Math.random() < 0.5 ? 'flanker' : 'chaser', spawnPt.x, spawnPt.y, Math.atan2(p.y - spawnPt.y, p.x - spawnPt.x));
        }
      }
    }

    if (d.tanks > 0) {
      this.tankT -= dt;
      if (this.tankT <= 0 && this.countType('tank') < Math.min(d.tanks, Math.ceil(this.copLimit * 0.15)) && this.makeRoom(1)) {
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

  // Gidiş yönüne dik yol genişliği; yol ekseni gidiş yönündedir
  roadWidthAt(px, py, hx, hy) {
    const world = this.world;
    const horizontal = Math.abs(hx) > Math.abs(hy);
    const cxd = horizontal ? 0 : 1;
    const cyd = horizontal ? 1 : 0;
    const road = (x, y) => world.groundAt(x, y) === GROUND.ROAD && !world.blockedAt(x, y);
    if (!road(px, py)) return 0;
    let a = 0;
    while (a < 7 && road(px - cxd * (a + 1) * 20, py - cyd * (a + 1) * 20)) a++;
    let b = 0;
    while (b < 7 && road(px + cxd * (b + 1) * 20, py + cyd * (b + 1) * 20)) b++;
    return (a + b) * 20 + 20;
  }

  // Oyuncunun önündeki yolu tespit eder, yan yana arabalarla kapatır, boşluk bırakır
  placeBarricade() {
    const p = this.player;
    if (p.speed < 120 || !this.makeRoom(3)) return false;
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
      if (s.used || this.cheat) continue;
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
      if (this.state === 'play' && d < TK.radius && !this.cheat) {
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
      if (this.world.costAtTile(tx, ty) === 0 && this.world.circleHit(s.x, s.y, 8, hit) && !isWaterRect(hit.rect) && !hit.rect.sacred) {
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
      this.fx.float(p.x, p.y - 34, tx('power.healFloat'), '#2fd872');
    } else if (name === 'ghost') {
      this.ghostT = PW.duration;
      this.fx.float(p.x, p.y - 34, tx('power.ghostFloat'), '#a07bff');
    } else if (name === 'giant') {
      this.giantT = PW.duration;
      this.setGiant(true);
      this.fx.float(p.x, p.y - 34, tx('power.giantFloat'), '#ffd23f');
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
    const z = this.drop ? V.dropZoom : (1 - V.zoomOut * speedK) * (this.giantT > 0 ? 0.82 : 1);
    c.zoom += (z - c.zoom) * (1 - Math.exp(-(this.drop ? 40 : V.zoomRate) * dt));
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
  // Adlar dil dosyasında: power.blast, power.ghost ...
  blast: { color: '#ff7a1a' },
  ghost: { color: '#a07bff' },
  heal: { color: '#2fd872' },
  giant: { color: '#ffd23f' },
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
    case S.KOLEJ: {
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
// Tabela türü adından anlaşılır; her türün kendi fontu ve zemini vardır
const SIGN_STYLES = {
  corp: [['500 30px Oswald, sans-serif', 'corp'], ['800 30px Nunito, sans-serif', 'corp']],
  vivid: [['400 34px Anton, Impact, sans-serif', 'vivid'], ['400 32px Righteous, sans-serif', 'vivid']],
  led: [['400 34px "Tilt Neon", sans-serif', 'led'], ['400 32px Monoton, sans-serif', 'led']],
  wood: [['400 30px Pacifico, cursive', 'wood'], ['400 34px Lobster, cursive', 'wood']],
  lux: [['italic 400 30px Playfair, Georgia, serif', 'brass']],
  box: [['400 30px Bungee, sans-serif', 'box'], ['800 30px Nunito, sans-serif', 'box']],
};
function signKind(text) {
  if (/bank|kredi|tasarruf|yatırım|hastane|ilkokul|kolej/i.test(text)) return 'corp';
  if (/teknoloji|oyun|piksel|bilgisayar|telefon/i.test(text)) return 'led';
  if (/market|bakkal|manav|gross|mağaza|ucuzlar|büfe|bayii|dünyası/i.test(text)) return 'vivid';
  if (/döner|kebap|pide|lahmacun|iskender|ciğer|börek|lokanta|kafe|çay|kahve|tost|tatlı|fırın|ocağı|köfte/i.test(text)) return 'wood';
  if (/otel|hotel|rezidans|residence|palas|sitesi/i.test(text)) return 'lux';
  return 'box';
}

function signCanvas(text, color, seed = 0) {
  const list = SIGN_STYLES[signKind(text)];
  const v = seed % list.length;
  const key = text + color + v;
  let c = signCache.get(key);
  if (c) return c;
  if (signCache.size > 400) signCache.clear();
  const [font, kind] = list[v];
  const shown = kind === 'vivid' || font.includes('Bungee') ? text.toLocaleUpperCase('tr') : text;
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
  if (kind === 'corp') {
    g.fillStyle = color; g.fillRect(1, 5, w - 2, 46);
    g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(1, 5, w - 2, 3);
    g.fillStyle = '#fff'; g.fillText(shown, w / 2, cy + 1);
  } else if (kind === 'vivid') {
    g.fillStyle = color; rr(g, 2, 3, w - 4, 50, 9); g.fill();
    g.save(); g.globalAlpha = 0.16; g.fillStyle = '#fff';
    for (let px = -40; px < w; px += 26) { g.beginPath(); g.moveTo(px, 53); g.lineTo(px + 12, 53); g.lineTo(px + 44, 3); g.lineTo(px + 32, 3); g.fill(); }
    g.restore();
    g.lineWidth = 3; g.strokeStyle = '#ffd23f'; rr(g, 2, 3, w - 4, 50, 9); g.stroke();
    g.lineWidth = 6; g.lineJoin = 'round'; g.strokeStyle = '#1a1420'; g.strokeText(shown, w / 2, cy);
    g.fillStyle = '#ffe14d'; g.fillText(shown, w / 2, cy);
  } else if (kind === 'led') {
    g.fillStyle = '#07080e'; rr(g, 2, 4, w - 4, 48, 5); g.fill();
    g.fillStyle = 'rgba(255,255,255,.05)';
    for (let py = 7; py < 50; py += 4) for (let px = 5; px < w - 4; px += 4) g.fillRect(px, py, 1.6, 1.6);
    const glow = shade(color, 0.55);
    g.lineWidth = 2; g.strokeStyle = glow; rr(g, 3, 5, w - 6, 46, 5); g.stroke();
    g.shadowColor = glow; g.shadowBlur = 16;
    g.fillStyle = glow; g.fillText(shown, w / 2, cy); g.fillText(shown, w / 2, cy);
    g.shadowBlur = 0;
    g.fillStyle = 'rgba(255,255,255,.6)'; g.fillText(shown, w / 2, cy);
  } else if (kind === 'wood') {
    g.fillStyle = '#6f4522'; rr(g, 2, 3, w - 4, 50, 6); g.fill();
    for (let py = 3; py < 52; py += 12) {
      g.fillStyle = py % 2 ? '#7c4f28' : '#855730'; g.fillRect(4, py + 1, w - 8, 11);
      g.fillStyle = 'rgba(30,14,4,.35)'; g.fillRect(4, py, w - 8, 1.2);
    }
    g.fillStyle = '#2a1608';
    for (const [px, py] of [[9, 9], [w - 9, 9], [9, 47], [w - 9, 47]]) { g.beginPath(); g.arc(px, py, 2, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(30,14,4,.8)'; g.fillText(shown, w / 2 + 1.5, cy + 1.5);
    g.fillStyle = '#ffeec8'; g.fillText(shown, w / 2, cy);
  } else if (kind === 'box') {
    g.fillStyle = '#20242c'; rr(g, 1, 3, w - 2, 50, 4); g.fill();
    g.fillStyle = '#fbfbf4'; rr(g, 4, 6, w - 8, 44, 2); g.fill();
    g.fillStyle = color; g.fillRect(4, 44, w - 8, 6);
    g.fillStyle = shade(color, -0.15); g.fillText(shown, w / 2, cy - 2);
  } else if (kind === 'panel') {
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

// --- Dükkân önü ---
function paintDoner(g, f) {
  g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-7, 9, 14, 3);
  g.fillStyle = '#8b939c'; g.fillRect(-1, -12, 2, 23);
  g.fillStyle = '#4a4f55'; g.fillRect(-6, 8, 12, 3);
  // Koni et: bantlar kare kare kayar, dönüyormuş gibi görünür
  g.beginPath(); g.moveTo(-6.5, -9); g.lineTo(6.5, -9); g.lineTo(3.8, 7); g.lineTo(-3.8, 7); g.closePath();
  g.save(); g.clip();
  g.fillStyle = '#8c4f22'; g.fillRect(-8, -10, 16, 18);
  for (let i = 0; i < 6; i++) {
    const x = -9 + ((i * 3.6 + f * 0.9) % 18);
    g.fillStyle = i % 2 ? '#b8722f' : '#6f3a18';
    g.fillRect(x, -10, 1.8, 18);
  }
  g.fillStyle = 'rgba(255,190,110,.32)'; g.fillRect(-2, -10, 3, 18);
  g.restore();
  g.fillStyle = '#d6dbe1'; g.fillRect(-7, -11, 14, 2);
}

function paintPromo(g, text, i) {
  const bg = ['#e8352e', '#ffd23f', '#16a34a', '#7b3fa0', '#ff6a13', '#0a84d6', '#e11d74', '#111827'][i % 8];
  const fg = i % 8 === 1 ? '#7a1408' : '#ffffff';
  g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(-19, 10, 40, 3);
  g.fillStyle = '#3c4148'; g.fillRect(-17, 7, 2, 6); g.fillRect(15, 7, 2, 6);
  g.fillStyle = bg; rr(g, -21, -11, 42, 20, 2); g.fill();
  g.lineWidth = 1.2; g.strokeStyle = 'rgba(255,255,255,.85)'; g.setLineDash([3, 2]); rr(g, -19.5, -9.5, 39, 17, 1.5); g.stroke(); g.setLineDash([]);
  g.fillStyle = fg;
  g.font = '400 8px Anton, Impact, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 0, -1, 37);
}

// Şişme hava dansçısı: gövde dalgalanır, kollar savrulur. Yerde üfleyici
function paintDancer(g, col, f) {
  const ph = (f / 6) * Math.PI * 2;
  g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(0, 33, 9, 3, 0, 0, 7); g.fill();
  g.fillStyle = '#2f343c'; g.fillRect(-6, 27, 12, 6);
  const pts = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    pts.push([Math.sin(ph + t * 4) * (1 + t * 7), 28 - t * 52]);
  }
  g.strokeStyle = col; g.lineWidth = 8.5; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); pts.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x, y)); g.stroke();
  g.strokeStyle = shade(col, 0.3); g.lineWidth = 2.5;
  g.beginPath(); pts.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x - 1.6, y)); g.stroke();
  const [sx, sy] = pts[6];
  g.strokeStyle = col; g.lineWidth = 4;
  for (const s of [-1, 1]) {
    const a = ph * (s > 0 ? 1 : -1) + s * 0.6;
    const ex = sx + s * (9 + 5 * Math.cos(a));
    const ey = sy - 7 + 9 * Math.sin(a);
    g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(sx + s * 8, sy - 5, ex, ey); g.lineTo(ex + s * 7 * Math.cos(a + ph), ey - 7); g.stroke();
  }
  const [hx, hy] = pts[8];
  g.fillStyle = shade(col, 0.15); g.beginPath(); g.arc(hx, hy - 4, 6.2, 0, 7); g.fill();
  g.fillStyle = '#fff'; for (const s of [-1, 1]) { g.beginPath(); g.arc(hx + s * 2.4, hy - 5, 1.9, 0, 7); g.fill(); }
  g.fillStyle = '#141414'; for (const s of [-1, 1]) { g.beginPath(); g.arc(hx + s * 2.4, hy - 5, 0.9, 0, 7); g.fill(); }
  g.strokeStyle = '#141414'; g.lineWidth = 1; g.beginPath(); g.arc(hx, hy - 3.4, 2.8, 0.3, 2.84); g.stroke();
  g.strokeStyle = '#111'; g.lineWidth = 1.2; for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(hx + i * 2, hy - 9.5); g.lineTo(hx + i * 2.6, hy - 13 - (i & 1)); g.stroke(); }
}

// --- Balkon hayatı: gövde, baş, eylem, önünde korkuluk ---
function paintBalcony(g, act, f, shirt) {
  const skin = '#e0a878';
  g.fillStyle = 'rgba(30,40,55,.75)'; g.fillRect(-9, -11, 18, 21); // Balkon gölgesi
  g.fillStyle = shirt; g.beginPath(); g.roundRect(-3.5, -3, 7, 9, 2); g.fill();
  g.fillStyle = skin; g.beginPath(); g.arc(0, -6, 2.8, 0, 7); g.fill();
  g.fillStyle = '#3b2a1e'; g.beginPath(); g.arc(0, -7, 2.9, 3.14, 0); g.fill();
  g.strokeStyle = skin; g.lineWidth = 1.5; g.lineCap = 'round';
  if (act === 'tea') {
    const up = f ? -5 : -1;
    g.beginPath(); g.moveTo(3, -1); g.lineTo(5, up + 2); g.stroke();
    g.fillStyle = '#f4ead2'; g.fillRect(4.4, up - 1, 2.4, 3);
    g.fillStyle = '#b5482f'; g.fillRect(4.6, up - 1, 2, 1);
  } else if (act === 'wave') {
    g.beginPath(); g.moveTo(3, -2); g.lineTo(f ? 7 : 4, -8); g.stroke();
    g.beginPath(); g.arc(f ? 7 : 4, -9, 1.1, 0, 7); g.fillStyle = skin; g.fill();
  } else if (act === 'water') {
    g.beginPath(); g.moveTo(3, -1); g.lineTo(6, 0); g.stroke();
    g.fillStyle = '#3f8f5b'; g.fillRect(5, -1.5, 4, 3);
    g.fillStyle = '#9fd8ff'; for (let i = 0; i < 3; i++) g.fillRect(8.4, 1.5 + ((i * 2 + f * 2) % 6), 0.9, 1.3);
    g.fillStyle = '#b5482f'; g.fillRect(4.5, 5, 5, 2.4);
    g.fillStyle = '#e8533f'; g.beginPath(); g.arc(7, 4.4, 1.6, 0, 7); g.fill();
  } else {
    g.strokeStyle = '#dfe4ea'; g.lineWidth = 0.7; g.beginPath(); g.moveTo(-9, -9); g.lineTo(9, -9); g.stroke();
    g.strokeStyle = skin; g.lineWidth = 1.5; g.beginPath(); g.moveTo(3, -2); g.lineTo(5, f ? -9 : -7); g.stroke();
    g.fillStyle = '#f4f6f8'; g.fillRect(4, f ? -9 : -8.6, 4, 6);
  }
  g.fillStyle = 'rgba(245,247,250,.95)'; g.fillRect(-10, 4, 20, 1.3);
  g.fillStyle = 'rgba(245,247,250,.75)'; for (let x = -9.4; x < 10; x += 2.6) g.fillRect(x, 4, 0.7, 6);
  g.fillStyle = 'rgba(200,205,212,.95)'; g.fillRect(-10, 9.6, 20, 1);
}

function paintWashing(g, f) {
  g.strokeStyle = '#dfe4ea'; g.lineWidth = 0.7;
  g.beginPath(); g.moveTo(-14, -6); g.quadraticCurveTo(0, -3.8, 14, -6); g.stroke();
  const cols = ['#f4f6f8', '#e8533f', '#3e7cb1', '#f2c14e', '#7a5ea8'];
  const sway = [-1.3, 0, 1.3][f];
  for (let i = 0; i < 4; i++) {
    const x = -12 + i * 6.2;
    g.fillStyle = cols[i];
    g.beginPath(); g.moveTo(x, -5); g.lineTo(x + 4.6, -5); g.lineTo(x + 4.6 + sway * (1 + i * 0.1), 4); g.lineTo(x + sway * (1 + i * 0.1), 4); g.closePath(); g.fill();
  }
}

function paintMoon(g) {
  const gr = g.createRadialGradient(0, 0, 8, 0, 0, 22);
  gr.addColorStop(0, 'rgba(255,245,210,.5)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
  g.fillStyle = gr; g.fillRect(-22, -22, 44, 44);
  g.fillStyle = '#fff4d0'; g.beginPath(); g.arc(0, 0, 10, 0, 7); g.fill();
  g.globalCompositeOperation = 'destination-out';
  g.beginPath(); g.arc(4.5, -2.5, 8.6, 0, 7); g.fill();
  g.globalCompositeOperation = 'source-over';
}

function paintStars(g, seed) {
  let s = seed;
  const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 34; i++) {
    g.fillStyle = r() < 0.2 ? '#ffe9b0' : '#ffffff';
    const q = 0.7 + r() * 1;
    g.fillRect(-160 + r() * 320, -45 + r() * r() * 90, q, q);
  }
}

// --- landmarks.js ---
// Özel yerler: kolej, Konya yapıları, okullar. Kodla çizilir, gerçek logo ya da marka kullanılmaz.
// Zemin çizimleri chunk önbelleğine bir kez işlenir. Yüksek yapıların (kolej, kule) duvar, çatı ve
// gece pencere dokuları ilk görüldüğünde bir kez üretilir, sonra yalnızca kopyalanır.

const S = BUILD;
const TAU = Math.PI * 2;

function mk(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function text(g, s, x, y, size, color, weight = 900, font = 'Nunito, sans-serif') {
  g.font = `${weight} ${size}px ${font}`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = color;
  g.fillText(s, x, y);
}

// Selçuklu yıldızı: iç içe iki kare, sekiz köşe
function star8(g, x, y, R, fill, stroke) {
  g.beginPath();
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * TAU - Math.PI / 2;
    const q = i % 2 ? R * 0.62 : R;
    g[i ? 'lineTo' : 'moveTo'](x + Math.cos(a) * q, y + Math.sin(a) * q);
  }
  g.closePath();
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.stroke(); }
}

// Kubbe: kurşun gri ya da firuze, yumuşak ışık
function dome(g, x, y, R, base = '#8d98a3') {
  const gr = g.createRadialGradient(x - R * 0.35, y - R * 0.4, R * 0.1, x, y, R);
  gr.addColorStop(0, shade(base, 0.45)); gr.addColorStop(0.7, base); gr.addColorStop(1, shade(base, -0.35));
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, R, 0, TAU); g.fill();
  g.strokeStyle = shade(base, -0.45); g.lineWidth = 1; g.stroke();
  g.fillStyle = '#d9b44a'; g.beginPath(); g.arc(x, y, Math.max(1.4, R * 0.12), 0, TAU); g.fill();
}

// Taç kapı: taş çerçeve, mukarnas sıraları, ortada geçit
function portal(g, cx, y, w, h, stone = '#cbb894') {
  g.fillStyle = shade(stone, -0.25); g.fillRect(cx - w / 2 - 3, y - 3, w + 6, h + 6);
  g.fillStyle = stone; g.fillRect(cx - w / 2, y, w, h);
  g.fillStyle = shade(stone, -0.18);
  for (let row = 0; row < 3; row++) {
    const n = 5 - row;
    for (let i = 0; i < n; i++) {
      const px = cx - w * 0.32 + (i + 0.5) * (w * 0.64 / n);
      g.beginPath(); g.arc(px, y + 4 + row * 4.5, 2.4, Math.PI, 0); g.fill();
    }
  }
  g.fillStyle = '#4a3a2a'; rr(g, cx - w * 0.18, y + h * 0.45, w * 0.36, h * 0.55, w * 0.18); g.fill();
  star8(g, cx, y + h * 0.3, Math.min(5, w * 0.12), '#e9d9b0', null);
}

// --- Zemin çizimleri (düz yapılar) ---

// Okul servisi: sarı, üstten görünüm
function servis(g, r) {
  const v = r.h >= r.w;
  const L = v ? r.h : r.w; const W = v ? r.w : r.h;
  g.save();
  g.translate(r.x + r.w / 2, r.y + r.h / 2);
  if (!v) g.rotate(-Math.PI / 2);
  g.fillStyle = 'rgba(0,0,0,.25)'; rr(g, -W / 2 + 3, -L / 2 + 4, W, L, 7); g.fill();
  g.fillStyle = '#f5b800'; rr(g, -W / 2, -L / 2, W, L, 7); g.fill();
  g.fillStyle = '#ffd23f'; rr(g, -W / 2 + 4, -L / 2 + 16, W - 8, L - 26, 4); g.fill();
  g.fillStyle = '#20242b'; rr(g, -W / 2 + 3, -L / 2 + 3, W - 6, 10, 3); g.fill();
  g.fillStyle = '#2b3038';
  for (let k = -L / 2 + 22; k < L / 2 - 12; k += 14) { g.fillRect(-W / 2, k, 3, 9); g.fillRect(W / 2 - 3, k, 3, 9); }
  g.fillStyle = '#f4f6f8'; g.fillRect(-W / 2 + 6, -L / 2 + 30, W - 12, 3);
  g.save(); g.rotate(Math.PI / 2);
  text(g, 'OKUL TAŞITI', 0, 0, Math.min(9, W * 0.32), '#1b1d22');
  g.restore();
  g.fillStyle = '#e8352e'; g.fillRect(-W / 2 + 4, L / 2 - 4, 6, 3); g.fillRect(W / 2 - 10, L / 2 - 4, 6, 3);
  g.restore();
}

// Müze: taş külliye, kurşun kubbeler ve yeşil konik kubbe (stilize)
function muze(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = '#b6a585'; rr(g, x, y, w, h, 6); g.fill();
  g.fillStyle = '#dcccaa'; rr(g, x + 5, y + 5, w - 10, h - 14, 5); g.fill();
  // Avlu revakları
  g.fillStyle = '#cdbb96';
  for (let px = x + 14; px < x + w * 0.6; px += 22) { g.beginPath(); g.arc(px, y + h - 16, 8, Math.PI, 0); g.fill(); }
  // Küçük kubbeler
  for (let i = 0; i < 6; i++) {
    const px = x + w * 0.1 + (i % 3) * w * 0.17;
    const py = y + h * (i < 3 ? 0.28 : 0.6);
    dome(g, px, py, Math.min(w, h) * 0.1);
  }
  // Yeşil kubbe: dilimli koni, tepede alem
  const cx = x + w * 0.76; const cy = y + h * 0.4; const R = Math.min(w, h) * 0.3;
  g.fillStyle = 'rgba(20,30,40,.3)'; g.beginPath(); g.ellipse(cx + R * 0.5, cy + R * 0.7, R * 1.1, R * 0.8, 0.4, 0, TAU); g.fill();
  g.fillStyle = '#e8dcc0'; g.beginPath(); g.arc(cx, cy, R * 1.12, 0, TAU); g.fill();
  const n = 16;
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * TAU; const a1 = ((i + 1) / n) * TAU;
    g.fillStyle = i % 2 ? '#13a183' : '#0b7f69';
    g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R, a0, a1); g.closePath(); g.fill();
  }
  const hi = g.createRadialGradient(cx - R * 0.4, cy - R * 0.45, 1, cx, cy, R);
  hi.addColorStop(0, 'rgba(255,255,255,.55)'); hi.addColorStop(0.5, 'rgba(255,255,255,.08)'); hi.addColorStop(1, 'rgba(0,0,0,.25)');
  g.fillStyle = hi; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
  g.fillStyle = '#e2bd4c'; g.beginPath(); g.arc(cx, cy, R * 0.12, 0, TAU); g.fill();
  // Minare
  const mx = x + w - 12; const my = y + 12;
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(mx, my, 34, 4);
  g.fillStyle = '#e6dcc8'; g.beginPath(); g.arc(mx, my, 6, 0, TAU); g.fill();
  g.fillStyle = '#1aa58a'; g.beginPath(); g.arc(mx, my, 3.6, 0, TAU); g.fill();
  portal(g, x + w * 0.32, y + h - 26, 40, 26);
}

// Selçuklu camisi (tepe üstünde): taş gövde, düz ahşap çatı çizgileri, piramit külahlı türbe
function selcukCami(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = '#a8977a'; rr(g, x, y, w, h, 5); g.fill();
  g.fillStyle = '#c9b99a'; rr(g, x + 4, y + 4, w - 8, h - 12, 4); g.fill();
  g.strokeStyle = 'rgba(90,70,50,.35)'; g.lineWidth = 1;
  for (let px = x + 10; px < x + w - 8; px += 9) { g.beginPath(); g.moveTo(px, y + 8); g.lineTo(px, y + h * 0.6); g.stroke(); }
  dome(g, x + w * 0.62, y + h * 0.32, Math.min(w, h) * 0.16, '#8a96a2');
  // Türbe: sekizgen, külah
  const tx = x + w * 0.2; const ty = y + h * 0.3; const R = Math.min(w, h) * 0.16;
  g.fillStyle = '#d8cbb0'; g.beginPath();
  for (let i = 0; i < 8; i++) { const a = (i / 8) * TAU + 0.39; g[i ? 'lineTo' : 'moveTo'](tx + Math.cos(a) * R * 1.15, ty + Math.sin(a) * R * 1.15); }
  g.closePath(); g.fill();
  for (let i = 0; i < 8; i++) {
    const a0 = (i / 8) * TAU + 0.39; const a1 = ((i + 1) / 8) * TAU + 0.39;
    g.fillStyle = i % 2 ? '#5e8f86' : '#4a7870';
    g.beginPath(); g.moveTo(tx, ty); g.lineTo(tx + Math.cos(a0) * R, ty + Math.sin(a0) * R); g.lineTo(tx + Math.cos(a1) * R, ty + Math.sin(a1) * R); g.closePath(); g.fill();
  }
  const mx = x + w - 10; const my = y + h * 0.7;
  g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(mx, my, 30, 4);
  g.fillStyle = '#b8a27c'; g.beginPath(); g.arc(mx, my, 5.5, 0, TAU); g.fill();
  portal(g, x + w * 0.45, y + h - 24, 34, 22, '#c4ae86');
}

// Kongre merkezi: cam kenar, Selçuklu yıldızlı çatı deseni
function kongre(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = '#244a60'; rr(g, x, y, w, h, 10); g.fill();
  g.fillStyle = '#7fc4dc'; rr(g, x + 4, y + 4, w - 8, h - 8, 8); g.fill();
  g.fillStyle = '#1c7a8c'; rr(g, x + 12, y + 12, w - 24, h - 30, 6); g.fill();
  g.save(); rr(g, x + 12, y + 12, w - 24, h - 30, 6); g.clip();
  g.lineWidth = 1.2;
  for (let py = y + 24; py < y + h; py += 26) {
    for (let px = x + 24 + ((py / 26) % 2) * 13; px < x + w; px += 26) star8(g, px, py, 10, 'rgba(255,255,255,.18)', 'rgba(240,210,120,.75)');
  }
  g.restore();
  g.fillStyle = '#e9edf0'; g.fillRect(x + w * 0.3, y + h - 18, w * 0.4, 14);
  g.fillStyle = '#1d2a33'; for (let px = x + w * 0.32; px < x + w * 0.68; px += 12) g.fillRect(px, y + h - 15, 8, 9);
}

// Alışveriş merkezi podyumu: tavan pencereleri, çatı makineleri
function avm(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = '#6f7780'; rr(g, x, y, w, h, 6); g.fill();
  g.fillStyle = '#aab3bb'; rr(g, x + 4, y + 4, w - 8, h - 14, 5); g.fill();
  g.fillStyle = '#7ec6e8';
  for (let px = x + 20; px < x + w - 30; px += 46) { rr(g, px, y + h * 0.3, 28, h * 0.32, 4); g.fill(); }
  g.fillStyle = '#e4e7ea'; for (let px = x + 14; px < x + w - 14; px += 34) g.fillRect(px, y + 10, 14, 9);
  g.fillStyle = '#d0121b'; g.fillRect(x + w * 0.4, y + h - 12, w * 0.2, 8);
}

// Bedesten: uzun taş sıra, üstünde dizi dizi küçük kubbe
function bedesten(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = '#9d8a6c'; rr(g, x, y, w, h, 4); g.fill();
  g.fillStyle = '#c6b28c'; rr(g, x + 3, y + 3, w - 6, h - 12, 3); g.fill();
  const R = Math.min(h * 0.28, 14);
  for (let px = x + R + 6; px < x + w - R; px += R * 2.3) dome(g, px, y + h * 0.42, R, '#8f9aa4');
  g.fillStyle = '#4e3b2a';
  for (let px = x + 10; px < x + w - 10; px += 22) { g.beginPath(); g.arc(px + 6, y + h - 3, 6, Math.PI, 0); g.fill(); }
}

// Bağ evi: kiremit çatı, baca, asma çardak
function bagevi(g, r) {
  const { x, y, w, h } = r;
  g.fillStyle = 'rgba(0,0,0,.2)'; g.fillRect(x + 4, y + 5, w, h);
  g.fillStyle = '#f0e6d2'; g.fillRect(x, y, w, h);
  g.fillStyle = '#b5523b'; g.fillRect(x, y, w, h * 0.5);
  g.fillStyle = '#9c4430'; g.fillRect(x, y + h * 0.5, w, h * 0.32);
  g.fillStyle = '#7a3526'; g.fillRect(x, y + h * 0.48, w, 3);
  g.fillStyle = '#8c8c8c'; g.fillRect(x + w * 0.72, y + 4, 7, 7);
  g.fillStyle = '#6b4a2a'; g.fillRect(x - 10, y + h * 0.5, 10, 2); g.fillRect(x - 10, y + h - 2, 10, 2);
  g.fillStyle = '#4f9a3a'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x - 6 + (k % 2) * 4, y + h * 0.55 + k * 6, 4, 0, TAU); g.fill(); }
}

// Okul ve kolejler: renk paleti binada (r.color gövde, r.signColor vurgu)
function ozelOkul(g, r) {
  const { x, y, w, h } = r;
  const body = r.color; const acc = r.signColor || '#1d6fb8';
  g.fillStyle = shade(body, -0.35); rr(g, x, y, w, h, 6); g.fill();
  g.fillStyle = body; rr(g, x + 4, y + 4, w - 8, h - 16, 5); g.fill();
  // İç avlu
  g.fillStyle = shade(body, 0.25); rr(g, x + w * 0.35, y + h * 0.22, w * 0.3, h * 0.38, 4); g.fill();
  g.fillStyle = '#5da33e'; g.beginPath(); g.arc(x + w * 0.5, y + h * 0.41, Math.min(w, h) * 0.08, 0, TAU); g.fill();
  // Vurgu çizgileri ve güneş panelleri
  g.fillStyle = acc; g.fillRect(x + 4, y + 4, w - 8, 6); g.fillRect(x + 4, y + h - 22, w - 8, 6);
  g.fillStyle = '#26303a';
  for (let px = x + 12; px < x + w * 0.3; px += 14) g.fillRect(px, y + 16, 10, 16);
  for (let px = x + w * 0.7; px < x + w - 12; px += 14) g.fillRect(px, y + 16, 10, 16);
  // Giriş saçağı
  g.fillStyle = '#f4f6f8'; g.fillRect(x + w / 2 - 30, y + h - 14, 60, 12);
  g.fillStyle = acc; g.fillRect(x + w / 2 - 30, y + h - 14, 60, 3);
}

// Anıt ve köşk: taş kaide, sekiz köşeli yıldız, uzun gölge
function anit(g, r) {
  const { x, y, w, h } = r;
  const cx = x + w / 2; const cy = y + h / 2; const R = Math.min(w, h) / 2;
  if (r.variant === 'kosk') {
    g.fillStyle = '#7a5a3a'; rr(g, x, y, w, h, 8); g.fill();
    g.fillStyle = '#b5523b'; rr(g, x + 3, y + 3, w - 6, h - 6, 6); g.fill();
    g.strokeStyle = '#8c3e2c'; g.lineWidth = 2;
    g.beginPath(); g.moveTo(x + 3, y + 3); g.lineTo(x + w - 3, y + h - 3); g.moveTo(x + w - 3, y + 3); g.lineTo(x + 3, y + h - 3); g.stroke();
    return;
  }
  g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(cx + R * 0.8, cy + R * 0.6, R * 1.2, R * 0.5, 0.5, 0, TAU); g.fill();
  g.fillStyle = '#b9ad98'; g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.fill();
  g.fillStyle = '#d8cfbd'; g.beginPath(); g.arc(cx, cy, R * 0.78, 0, TAU); g.fill();
  star8(g, cx, cy, R * 0.6, '#c9a24a', '#8a6d1f');
  g.fillStyle = '#f2eee6'; g.beginPath(); g.arc(cx, cy, R * 0.18, 0, TAU); g.fill();
}

function paintLandmark(g, r) {
  switch (r.style) {
    case S.SERVIS: servis(g, r); return true;
    case S.MUZE: muze(g, r); return true;
    case S.SELCUK_CAMI: selcukCami(g, r); return true;
    case S.KONGRE: kongre(g, r); return true;
    case S.AVM: avm(g, r); return true;
    case S.BEDESTEN: bedesten(g, r); return true;
    case S.BAGEVI: bagevi(g, r); return true;
    case S.OZEL_OKUL: ozelOkul(g, r); return true;
    case S.ANIT: anit(g, r); return true;
    case S.KULE: g.fillStyle = '#1d3550'; g.fillRect(r.x, r.y, r.w, r.h); return true;
    default: return false;
  }
}

// --- Açık alanlar (pad) ---
function paintPad(g, p, x, y, w, h) {
  switch (p.kind) {
    case 'stairs': {
      // Geniş giriş merdiveni ve turuncu korkuluk
      for (let k = 0; k < 6; k++) { g.fillStyle = k % 2 ? '#e9ecef' : '#d3d8dd'; g.fillRect(x, y + (k * h) / 6, w, h / 6 + 0.5); }
      g.fillStyle = '#ff7a00'; g.fillRect(x, y, 4, h); g.fillRect(x + w - 4, y, 4, h); g.fillRect(x + w / 2 - 2, y, 4, h);
      return true;
    }
    case 'flag': {
      const fx = x + w / 2; const fy = y + h / 2;
      g.fillStyle = '#c9ced4'; g.beginPath(); g.arc(fx, fy, 9, 0, TAU); g.fill();
      g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(fx, fy, 46, 3);
      g.fillStyle = '#f2f4f6'; g.beginPath(); g.arc(fx, fy, 3.5, 0, TAU); g.fill();
      g.fillStyle = '#e30a17'; g.fillRect(fx + 4, fy - 20, 40, 24);
      g.fillStyle = '#fff'; g.beginPath(); g.arc(fx + 18, fy - 8, 7, 0, TAU); g.fill();
      g.fillStyle = '#e30a17'; g.beginPath(); g.arc(fx + 20, fy - 8, 5.8, 0, TAU); g.fill();
      star8(g, fx + 29, fy - 8, 3.4, '#fff', null);
      return true;
    }
    case 'tram': {
      // Tramvay: yolun ortasında iki ray, durak peronu, sundurma ve durak adı
      const vertical = h > w;
      const mid = vertical ? x + w / 2 : y + h / 2;
      g.fillStyle = 'rgba(60,62,66,.55)';
      if (vertical) g.fillRect(mid - 18, y, 36, h); else g.fillRect(x, mid - 18, w, 36);
      g.fillStyle = '#b8bec5';
      for (const o of [-13, -7, 7, 13]) { if (vertical) g.fillRect(mid + o - 1, y, 2, h); else g.fillRect(x, mid + o - 1, w, 2); }
      g.fillStyle = 'rgba(90,70,50,.6)';
      for (let k = 0; k < (vertical ? h : w); k += 14) { if (vertical) g.fillRect(mid - 16, y + k, 32, 3); else g.fillRect(x + k, mid - 16, 3, 32); }
      if (p.text) {
        const px = vertical ? mid + 22 : x + w * 0.3; const py = vertical ? y + h * 0.3 : mid + 22;
        const pw = vertical ? 16 : 150; const ph = vertical ? 150 : 16;
        g.fillStyle = '#c9ced4'; g.fillRect(px, py, pw, ph);
        g.fillStyle = '#ffd23f'; if (vertical) g.fillRect(px, py, 3, ph); else g.fillRect(px, py, pw, 3);
        g.fillStyle = '#2b6fd6'; if (vertical) g.fillRect(px + 6, py + ph * 0.3, 9, ph * 0.4); else g.fillRect(px + pw * 0.3, py + 6, pw * 0.4, 9);
        g.fillStyle = '#1b2a4a'; rr(g, px + (vertical ? 18 : pw * 0.05), py + (vertical ? 4 : 18), vertical ? 70 : 70, 14, 3); g.fill();
        text(g, p.text, px + (vertical ? 53 : pw * 0.05 + 35), py + (vertical ? 11 : 25), 8, '#ffffff', 800);
      }
      return true;
    }
    case 'hill': {
      // Tepe: üst üste yeşil halkalar, ışık sol üstten
      const cx = x + w / 2; const cy = y + h / 2; const R = Math.min(w, h) / 2;
      for (let k = 0; k < 6; k++) {
        const q = R * (1 - k * 0.14);
        g.fillStyle = shade('#5f9f45', 0.06 * k);
        g.beginPath(); g.ellipse(cx - k * 3, cy - k * 4, q, q * 0.96, 0, 0, TAU); g.fill();
      }
      g.strokeStyle = 'rgba(40,80,30,.35)'; g.lineWidth = 1.2;
      for (let k = 1; k < 6; k++) { g.beginPath(); g.ellipse(cx - k * 3, cy - k * 4, R * (1 - k * 0.14), R * (1 - k * 0.14) * 0.96, 0, 0, TAU); g.stroke(); }
      return true;
    }
    case 'amfi': {
      const cx = x + w / 2; const cy = y + h * 0.15; const R = Math.min(w, h * 1.6) * 0.5;
      for (let k = 0; k < 7; k++) { g.fillStyle = k % 2 ? '#d8cfbd' : '#c4b9a3'; g.beginPath(); g.arc(cx, cy, R * (1 - k * 0.11), 0, Math.PI); g.fill(); }
      g.fillStyle = '#8a5a3a'; g.fillRect(cx - R * 0.32, cy - 12, R * 0.64, 14);
      return true;
    }
    case 'yildiz': {
      // Meydan taşı: büyük Selçuklu yıldızı, çevresinde küçükleri
      g.fillStyle = '#d9d2c4'; g.fillRect(x, y, w, h);
      g.lineWidth = 1.5;
      const R = Math.min(w, h) * 0.32;
      star8(g, x + w / 2, y + h / 2, R, '#c9b48a', '#8f7a52');
      star8(g, x + w / 2, y + h / 2, R * 0.55, '#a8323a', '#7a2028');
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * TAU;
        star8(g, x + w / 2 + Math.cos(a) * R * 1.35, y + h / 2 + Math.sin(a) * R * 1.35, R * 0.18, '#b8a37a', '#8f7a52');
      }
      return true;
    }
    case 'bag': {
      // Bağ: toprak üstünde asma sıraları
      g.fillStyle = '#b89463'; g.fillRect(x, y, w, h);
      for (let k = 8; k < h; k += 16) {
        g.fillStyle = '#8a6a42'; g.fillRect(x + 4, y + k + 4, w - 8, 2);
        g.fillStyle = '#5c9a3c';
        for (let px = x + 8; px < x + w - 8; px += 11) { g.beginPath(); g.arc(px, y + k + 3, 4.2, 0, TAU); g.fill(); }
      }
      return true;
    }
    case 'gul': {
      // Gül bahçesi: yuvarlak tarhlar
      g.fillStyle = '#5c9a3c'; g.fillRect(x, y, w, h);
      for (let py = y + 14; py < y + h - 8; py += 26) {
        for (let px = x + 14; px < x + w - 8; px += 26) {
          g.fillStyle = '#3f7d2f'; g.beginPath(); g.arc(px, py, 10, 0, TAU); g.fill();
          for (let k = 0; k < 5; k++) { g.fillStyle = k % 2 ? '#e8395a' : '#ff8fb0'; g.beginPath(); g.arc(px + Math.cos(k * 1.26) * 5, py + Math.sin(k * 1.26) * 5, 2.4, 0, TAU); g.fill(); }
        }
      }
      return true;
    }
    default: return false;
  }
}

// --- Tabela ---
// Kolej tabelası: siyah zemin, turuncu çerçeve, beyaz ve turuncu harfler
function landmarkSign(r) {
  if (r.signArt !== 'kolej') return null;
  const words = r.sign.split(' ');
  const last = words.pop();
  const first = words.join(' ');
  const H = 96;
  const c0 = mk(8, 8).getContext('2d');
  c0.font = `400 ${H * 0.62}px Bungee, Nunito, sans-serif`;
  const w1 = c0.measureText(`${first} `).width;
  const w2 = c0.measureText(last).width;
  const W = Math.ceil(w1 + w2 + H * 0.8);
  const c = mk(W, H);
  const g = c.getContext('2d');
  g.fillStyle = '#121316'; rr(g, 0, 0, W, H, 18); g.fill();
  g.strokeStyle = '#ff7a00'; g.lineWidth = 7; rr(g, 6, 6, W - 12, H - 12, 13); g.stroke();
  g.font = `400 ${H * 0.62}px Bungee, Nunito, sans-serif`;
  g.textBaseline = 'middle';
  g.textAlign = 'left';
  const x0 = H * 0.4;
  g.fillStyle = '#ffffff'; g.fillText(`${first} `, x0, H * 0.54);
  g.fillStyle = '#ff7a00'; g.fillText(last, x0 + w1, H * 0.54);
  return c;
}

// --- Yüksek yapılar: duvar, çatı ve gece pencereleri ---
// Duvar dokusu yüksekliği 192: alt kenar zemin, üst kenar çatı (render.js drawTalls ile aynı)
const H0 = 192;

function wallKolej(len, lit, front) {
  const c = mk(len, H0);
  const g = c.getContext('2d');
  const floors = 7;
  const fh = (H0 - 26) / floors;
  if (!lit) {
    g.fillStyle = '#ff7a00'; g.fillRect(0, 0, len, H0);
    g.fillStyle = '#16171a'; g.fillRect(0, 0, len, 9);
    g.fillStyle = '#ff9a3c'; for (let px = 6; px < len; px += 18) g.fillRect(px, 3, 6, 3);
  }
  for (let f = 0; f < floors; f++) {
    const y = 12 + f * fh;
    if (!lit) { g.fillStyle = '#f7f7f5'; g.fillRect(0, y + fh - 4, len, 4); }
    for (let px = 6, col = 0; px < len - 10; px += 22, col++) {
      if (front && f >= floors - 2 && Math.abs(px + 8 - len / 2) < 46) continue; // Giriş holü
      if (!lit) {
        if (col % 4 === 0) { g.fillStyle = '#f7f7f5'; g.fillRect(px - 3, y, 3, fh - 4); }
        g.fillStyle = '#1e2127'; g.fillRect(px, y + 3, 16, fh - 10);
        g.fillStyle = 'rgba(140,190,230,.35)'; g.fillRect(px, y + 3, 6, fh - 10);
      } else {
        const on = ((f * 131 + col * 71 + len) % 10) < 7;
        if (!on) continue;
        g.fillStyle = (f + col) % 5 === 0 ? '#bfe4ff' : '#ffe2a0';
        g.fillRect(px, y + 3, 16, fh - 10);
      }
    }
  }
  if (front) {
    // Büyük giriş: beyaz sütunlar, cam kapılar, siyah saçak
    const ex = len / 2; const top = 12 + (floors - 2) * fh;
    if (!lit) {
      g.fillStyle = '#16171a'; g.fillRect(ex - 50, top, 100, 7);
      g.fillStyle = '#2a3440'; g.fillRect(ex - 44, top + 7, 88, H0 - top - 7);
      g.fillStyle = '#f7f7f5'; for (let k = -44; k <= 40; k += 21) g.fillRect(ex + k, top + 7, 5, H0 - top - 7);
    } else {
      g.fillStyle = '#ffe7b0'; g.fillRect(ex - 39, top + 9, 78, H0 - top - 9);
    }
  }
  return c;
}

function roofKolej(w, h) {
  const c = mk(w, h);
  const g = c.getContext('2d');
  g.fillStyle = '#16171a'; g.fillRect(0, 0, w, h);
  g.fillStyle = '#ff8a1f'; g.fillRect(8, 8, w - 16, h - 16);
  g.fillStyle = '#ffffff'; g.fillRect(8, 8, w - 16, 5); g.fillRect(8, h - 13, w - 16, 5);
  // Güneş panelleri
  g.fillStyle = '#23324a';
  for (let py = 22; py < h - 30; py += 18) for (let px = 20; px < w * 0.3; px += 26) { g.fillRect(px, py, 22, 13); }
  g.strokeStyle = 'rgba(160,200,240,.5)'; g.lineWidth = 1;
  for (let py = 22; py < h - 30; py += 18) for (let px = 20; px < w * 0.3; px += 26) { g.strokeRect(px + 0.5, py + 0.5, 21, 12); }
  // Çatı bahçesi
  g.fillStyle = '#5da33e'; rr(g, w * 0.72, 20, w * 0.24, h - 44, 10); g.fill();
  for (let k = 0; k < 7; k++) { g.fillStyle = k % 2 ? '#3f7d2f' : '#7fbf4e'; g.beginPath(); g.arc(w * 0.75 + (k % 4) * w * 0.05, 34 + Math.floor(k / 4) * (h * 0.3), 9, 0, TAU); g.fill(); }
  // Renkli su depoları ve klimalar
  [['#e8352e', 0.36], ['#2b6fd6', 0.42], ['#ffd23f', 0.48], ['#39c47a', 0.54]].forEach(([col, k]) => { g.fillStyle = col; g.beginPath(); g.arc(w * k, h - 30, 8, 0, TAU); g.fill(); g.fillStyle = 'rgba(255,255,255,.4)'; g.beginPath(); g.arc(w * k - 2, h - 32, 3, 0, TAU); g.fill(); });
  g.fillStyle = '#e4e7ea'; for (let px = w * 0.6; px < w * 0.7; px += 14) g.fillRect(px, 24, 10, 8);
  return c;
}

function wallKule(len, lit) {
  const c = mk(len, H0);
  const g = c.getContext('2d');
  if (!lit) {
    const gr = g.createLinearGradient(0, 0, len, 0);
    gr.addColorStop(0, '#20456a'); gr.addColorStop(0.5, '#3f78a6'); gr.addColorStop(1, '#1b3a5a');
    g.fillStyle = gr; g.fillRect(0, 0, len, H0);
    g.fillStyle = 'rgba(255,255,255,.18)'; for (let py = 14; py < H0; py += 4.4) g.fillRect(0, py, len, 1);
    g.fillStyle = '#c9d2db'; for (let px = 4; px < len; px += 16) g.fillRect(px, 0, 2, H0);
    g.fillStyle = '#dfe6ec'; g.fillRect(0, 0, len, 12);
  } else {
    for (let py = 16; py < H0 - 4; py += 4.4) {
      for (let px = 6; px < len - 6; px += 16) {
        if (((py * 7 + px * 3) | 0) % 9 > 3) continue;
        g.fillStyle = ((px + py) | 0) % 3 ? '#fff1c8' : '#cfe8ff';
        g.fillRect(px, py, 12, 2.6);
      }
    }
  }
  return c;
}

function roofKule(w, h) {
  const c = mk(w, h);
  const g = c.getContext('2d');
  // Sivri tepe: dört yüzlü piramit, ortada anten
  const cx = w / 2; const cy = h / 2;
  const faces = [['#cfd8e0', [0, 0, w, 0]], ['#9fb0bf', [w, 0, w, h]], ['#7d8fa0', [w, h, 0, h]], ['#b6c4d0', [0, h, 0, 0]]];
  for (const [col, [ax, ay, bx, by]] of faces) { g.fillStyle = col; g.beginPath(); g.moveTo(cx, cy); g.lineTo(ax, ay); g.lineTo(bx, by); g.closePath(); g.fill(); }
  g.strokeStyle = 'rgba(30,50,70,.45)'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(0, 0); g.lineTo(w, h); g.moveTo(w, 0); g.lineTo(0, h); g.stroke();
  g.fillStyle = '#e8352e'; g.beginPath(); g.arc(cx, cy, Math.max(3, w * 0.05), 0, TAU); g.fill();
  return c;
}

const ART_CACHE = new Map();
// r.landmark: 'kolej' | 'kule'. Doku boyu binanın kendi oranına göre, bir kez üretilir
function tallArt(r) {
  const key = `${r.landmark}:${Math.round(r.w)}x${Math.round(r.h)}`;
  let a = ART_CACHE.get(key);
  if (a) return a;
  const lenN = Math.min(1024, Math.max(96, Math.round(r.w * 0.6)));
  const lenE = Math.min(1024, Math.max(96, Math.round(r.h * 0.6)));
  const rot = (src) => {
    const c = mk(H0, src.width);
    const g = c.getContext('2d');
    g.translate(H0 / 2, src.width / 2); g.rotate(Math.PI / 2); g.drawImage(src, -src.width / 2, -H0 / 2);
    return c;
  };
  if (r.landmark === 'kolej') {
    a = {
      n: wallKolej(lenN, false, true), e: rot(wallKolej(lenE, false, false)),
      litN: wallKolej(lenN, true, true), litE: rot(wallKolej(lenE, true, false)),
      roof: roofKolej(Math.round(r.w * 0.6), Math.round(r.h * 0.6)),
    };
  } else if (r.landmark === 'kule') {
    a = {
      n: wallKule(lenN, false), e: rot(wallKule(lenE, false)),
      litN: wallKule(lenN, true), litE: rot(wallKule(lenE, true)),
      roof: roofKule(128, 128), beacon: true,
    };
  } else {
    return null;
  }
  ART_CACHE.set(key, a);
  return a;
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

// Drift Lab rozeti: küçük altıgen
function emblem(g, x) {
  g.save();
  g.translate(x, 0);
  g.strokeStyle = '#eef2f6';
  g.lineWidth = 0.6;
  g.beginPath();
  for (let i = 0; i < 6; i++) { const a = (i * Math.PI) / 3; g[i ? 'lineTo' : 'moveTo'](Math.cos(a) * 2, Math.sin(a) * 2); }
  g.closePath();
  g.stroke();
  g.restore();
}

// --- Oyuncu modelleri ---
function atmaca(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.56, H - 0.6, 9, 4, '#9aa3ad');
// Klasik sedan
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

function simsek(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.56, H - 0.2, 10, 5, '#e8c547');
  hull(g, [[L, H * 0.8], [L - 2, H * 0.97], [-L + 2, H * 0.97], [-L, H * 0.82]]);
  fillHull(g, coat(g, H, c, fin));
// Tuning sedan
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

function efe(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H - 0.8, 9, 4, '#dfe4e9');
// Köşeli 70ler sedanı
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

function cinar(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.62, -L * 0.56, H - 0.8, 9, 4, '#c9ced4');
// Yuvarlak klasik
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

function marmara(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.56, H - 0.2, 10, 4.6, '#d7dde4');
// Modern aile sedanı
  smooth(g, [[L, 0], [L, H * 0.58], [L * 0.78, H * 0.96], [0, H], [-L * 0.8, H * 0.96], [-L, H * 0.7], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.34, -L * 0.6, H * 0.8, H * 0.7, L * 0.08, -L * 0.36, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#23272e'; g.fillRect(L - 1.4, -H * 0.36, 1.4, H * 0.72);
  emblem(g, L - 3.6);
  g.fillStyle = '#e8fbff';
  hull(g, [[L - 0.4, H * 0.42], [L * 0.8, H * 0.86]]); g.fill();
  lamps(g, -L, [H * 0.66], 2.6, H * 0.5, '#e01c2b');
  g.fillStyle = '#c9ced4'; g.fillRect(-L * 0.9, -H * 0.3, 0.8, H * 0.6);
  mirrors(g, L * 0.3, H * 0.96, shade(c, -0.2));
}

function liva(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.62, -L * 0.58, H - 0.2, 10, 4.8, '#e7eaee');
// Şehir hatchbacki
  smooth(g, [[L, 0], [L, H * 0.6], [L * 0.72, H * 1.0], [0, H * 0.9], [-L * 0.68, H * 1.02], [-L, H * 0.74], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.3, -L * 0.82, H * 0.76, H * 0.66, L * 0.06, -L * 0.68, H * 0.6, '#14171c');
  g.strokeStyle = '#eefaff'; g.lineWidth = 1.3;
  for (const s of [-1, 1]) { g.beginPath(); g.arc(L * 0.82, s * H * 0.7, 3.2, s > 0 ? 0.2 : -2.6, s > 0 ? 2.6 : -0.2); g.stroke(); }
  emblem(g, L - 3.4);
  g.fillStyle = '#e01c2b';
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(-L * 0.78, s * H * 0.94); g.lineTo(-L, s * H * 0.66); g.lineTo(-L, s * H * 0.34); g.lineTo(-L + 2.6, s * H * 0.56); g.closePath(); g.fill(); }
  mirrors(g, L * 0.28, H * 0.9, a);
}

function suv(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.58, H + 0.2, 12, 5.4, '#3a3f47');
  // Kompakt SUV, çift tonlu tavan, ince far, geniş siyah ızgara
  smooth(g, [[L, 0], [L, H * 0.76], [L * 0.86, H], [-L * 0.82, H], [-L, H * 0.8], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.3, -L * 0.8, H * 0.8, H * 0.74, L * 0.12, -L * 0.68, H * 0.66, '#101317');
  g.fillStyle = '#c6ccd4'; g.fillRect(-L * 0.66, -H * 0.76, L * 0.76, 1.1); g.fillRect(-L * 0.66, H * 0.76 - 1.1, L * 0.76, 1.1);
  g.fillStyle = '#0c0e12'; g.fillRect(L - 2.6, -H * 0.8, 2.6, H * 1.6);
  g.fillStyle = '#e8fbff'; g.fillRect(L - 2, -H * 0.82, 1.6, H * 0.34); g.fillRect(L - 2, H * 0.48, 1.6, H * 0.34);
  emblem(g, L - 1.4);
  lamps(g, -L, [H * 0.7], 1.6, H * 0.4, '#e01c2b');
  g.fillStyle = '#23272e'; g.fillRect(-L, -H * 0.42, 1.2, H * 0.84);
  mirrors(g, L * 0.26, H * 0.98, '#101317');
}

function bozkir(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.58, H + 0.6, 13, 6, '#20242a');
// Arazi aracı
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

function elektra(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.62, -L * 0.62, H + 0.1, 12, 5.2, '#a7b0ba');
// Elektrikli crossover
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

// --- NPC modelleri: özgün tasarımlar ---
function bavar(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H, 10, 4.6, '#b6bdc5');
  smooth(g, [[L, 0], [L, H * 0.74], [L * 0.8, H], [-L * 0.8, H * 0.98], [-L, H * 0.76], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.2, -L * 0.6, H * 0.8, H * 0.72, 0, -L * 0.42, H * 0.6, coat(g, H, c, fin));
  // Alçak tek parça ağız, ince far
  g.fillStyle = '#0d0f12';
  rr(g, L - 1.8, -H * 0.5, 1.6, H, 0.6); g.fill();
  emblem(g, L * 0.74);
  lamps(g, L - 3.4, [H * 0.72], 3, H * 0.28, '#eafcff');
  lamps(g, -L, [H * 0.68], 2.2, H * 0.44, '#d8132a');
  mirrors(g, L * 0.16, H * 0.96, shade(c, -0.3));
}

function aurum(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.58, H, 10, 4.6, '#d6dbe1');
  smooth(g, [[L, 0], [L, H * 0.8], [L * 0.86, H], [-L * 0.86, H], [-L, H * 0.8], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.28, -L * 0.66, H * 0.8, H * 0.7, L * 0.04, -L * 0.46, H * 0.6, coat(g, H, c, fin));
  // Üstte ince şerit, altta ağ panel, çift stop
  g.fillStyle = '#c4cad2'; g.fillRect(L - 2.6, -H * 0.5, 0.8, H);
  g.fillStyle = '#0d0f12'; g.fillRect(L - 1.6, -H * 0.5, 1.6, H);
  emblem(g, L - 3.6);
  g.fillStyle = '#eafcff';
  hull(g, [[L - 0.4, H * 0.58], [L * 0.8, H * 0.92]]); g.fill();
  g.fillStyle = '#d8132a'; g.fillRect(-L, -H * 0.84, 1.4, H * 1.68);
  mirrors(g, L * 0.22, H * 0.98, shade(c, -0.3));
}

function stella(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.62, -L * 0.6, H, 10, 4.6, '#e2e6ea');
  smooth(g, [[L + 0.4, 0], [L, H * 0.7], [L * 0.76, H], [-L * 0.76, H], [-L, H * 0.72], [-L - 0.4, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.16, -L * 0.62, H * 0.8, H * 0.72, -L * 0.04, -L * 0.46, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#c9ced4'; g.fillRect(L - 2, -H * 0.4, 2.2, H * 0.8);
  g.strokeStyle = '#0d0f12'; g.lineWidth = 0.5;
  for (const y of [-H * 0.22, 0, H * 0.22]) { g.beginPath(); g.moveTo(L - 2, y); g.lineTo(L, y); g.stroke(); }
  emblem(g, L * 0.82);
  lamps(g, L - 3.6, [H * 0.68], 3.2, H * 0.3, '#eafcff');
  lamps(g, -L, [H * 0.66], 2, H * 0.5, '#c81425');
  g.fillStyle = '#dfe4e9'; g.fillRect(-L * 0.8, -H * 0.36, 0.8, H * 0.72);
  mirrors(g, L * 0.12, H * 0.96, shade(c, -0.3));
}

function volta(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.6, H, 10, 4.6, '#c0c7cf');
  smooth(g, [[L, 0], [L, H * 0.78], [L * 0.8, H], [-L * 0.8, H], [-L, H * 0.84], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.26, -L * 0.86, H * 0.78, H * 0.72, L * 0.04, -L * 0.7, H * 0.62, coat(g, H, c, fin));
  g.fillStyle = '#0d0f12'; g.fillRect(L - 1.4, -H * 0.5, 1.4, H);
  emblem(g, L - 3);
  lamps(g, L - 2.6, [H * 0.72], 2.6, H * 0.26, '#eafcff');
  lamps(g, -L, [H * 0.72], 1.8, H * 0.34, '#d8132a');
  mirrors(g, L * 0.22, H * 0.96, shade(c, -0.3));
}

function pusula(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H, 10, 4.6, '#aeb6bf');
  smooth(g, [[L, 0], [L, H * 0.5], [L * 0.76, H * 0.98], [-L * 0.74, H], [-L, H * 0.8], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.32, -L * 0.8, H * 0.78, H * 0.68, L * 0.06, -L * 0.64, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#0d0f12'; g.fillRect(L - 2.2, -H * 0.5, 2.2, H);
  emblem(g, L - 3.6);
  g.fillStyle = '#eafcff'; hull(g, [[L - 0.4, H * 0.5], [L * 0.76, H * 0.9]]); g.fill();
  g.fillStyle = '#d8132a'; g.fillRect(-L, -H * 0.76, 1.6, H * 0.5); g.fillRect(-L, H * 0.26, 1.6, H * 0.5);
  mirrors(g, L * 0.26, H * 0.96, shade(c, -0.3));
}

function dalga(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H, 10, 4.6, '#c7ced6');
  smooth(g, [[L + 0.5, 0], [L, H * 0.62], [L * 0.8, H], [-L * 0.8, H], [-L, H * 0.68], [-L - 0.5, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.3, -L * 0.62, H * 0.8, H * 0.72, L * 0.06, -L * 0.42, H * 0.62, coat(g, H, c, fin));
  g.fillStyle = '#0d0f12'; rr(g, L - 2.6, -H * 0.5, 2.8, H, 1); g.fill();
  g.strokeStyle = '#8a929b'; g.lineWidth = 0.4;
  for (let y = -H * 0.4; y < H * 0.45; y += 1.6) { g.beginPath(); g.moveTo(L - 2.4, y); g.lineTo(L, y); g.stroke(); }
  emblem(g, L - 3.8);
  g.fillStyle = '#eafcff'; g.fillRect(L * 0.76, -H * 0.9, L * 0.22, 1.1); g.fillRect(L * 0.76, H * 0.9 - 1.1, L * 0.22, 1.1);
  g.fillStyle = '#d8132a'; g.fillRect(-L, -H * 0.78, 1.2, H * 1.56);
  mirrors(g, L * 0.26, H * 0.96, shade(c, -0.3));
}

function lale(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.6, -L * 0.58, H, 10, 4.6, '#bcc4cc');
  smooth(g, [[L, 0], [L, H * 0.66], [L * 0.76, H * 0.98], [-L * 0.8, H], [-L, H * 0.7], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.28, -L * 0.6, H * 0.78, H * 0.7, L * 0.04, -L * 0.42, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#16181c'; g.fillRect(L - 1.6, -H * 0.42, 1.6, H * 0.84);
  emblem(g, L - 3.2);
  lamps(g, L - 3, [H * 0.7], 2.8, H * 0.3, '#eafcff');
  lamps(g, -L, [H * 0.68], 2.2, H * 0.42, '#d8132a');
  mirrors(g, L * 0.24, H * 0.96, shade(c, -0.3));
}

function vadi(g, l, w, c, a, fin) {
  const L = l / 2; const H = w / 2;
  tyres(g, L * 0.58, -L * 0.58, H, 9.6, 4.4, '#a9b2bb');
  smooth(g, [[L, 0], [L, H * 0.74], [L * 0.84, H * 0.96], [-L * 0.84, H * 0.96], [-L, H * 0.74], [-L, 0]]);
  fillHull(g, coat(g, H, c, fin));
  cabin(g, L * 0.26, -L * 0.54, H * 0.78, H * 0.72, L * 0.04, -L * 0.36, H * 0.6, coat(g, H, c, fin));
  g.fillStyle = '#c9ced4'; g.fillRect(L - 1.4, -H * 0.3, 1.4, H * 0.6);
  emblem(g, L - 3);
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
  atmaca, motor: moto, moto, simsek, efe, cinar, marmara, liva, suv, granit: suv, bozkir, elektra,
  bavar, aurum, stella, volta, pusula, dalga, lale, vadi, kamyonet,
};

const MODEL_NAMES = Object.keys(MODELS);

function paintTr(g, len, wid, body, accent, shape, finish = 'gloss') {
  MODELS[shape](g, len, wid, body, accent, finish);
}

// Garaj için yandan profil: tanınmayı asıl bu sağlar.
// body: gövde hattı, glass: cam, w: tekerlek konumları (0-1), h: göreli yükseklik
const SIDE = {
  atmaca: { body: [[0, 62], [3, 50], [30, 46], [39, 18], [68, 18], [80, 44], [100, 48], [100, 64]], glass: [[37, 44], [44, 23], [57, 23], [57, 44]], glass2: [[60, 44], [60, 23], [67, 23], [76, 44]], w: [20, 79] },
  motor: null,
  granit: { body: [[0, 60], [2, 44], [24, 34], [36, 12], [82, 10], [96, 30], [100, 38], [100, 66]], glass: [[35, 34], [44, 17], [60, 17], [60, 34]], glass2: [[63, 34], [63, 17], [80, 15], [90, 32]], w: [20, 80], tall: 1 },
  elektra: { body: [[0, 62], [1, 46], [18, 36], [36, 10], [80, 10], [98, 30], [100, 42], [100, 66]], glass: [[30, 35], [42, 14], [62, 14], [62, 35]], glass2: [[65, 35], [65, 14], [79, 14], [92, 32]], w: [18, 82], tall: 1 },
  simsek: { body: [[0, 62], [3, 50], [30, 46], [40, 19], [66, 19], [78, 42], [100, 46], [100, 64]], glass: [[38, 44], [45, 24], [57, 24], [57, 44]], glass2: [[60, 44], [60, 24], [66, 24], [74, 44]], w: [20, 79], wing: 1 },
  cinar: { body: [[0, 60], [2, 50], [36, 44], [46, 22], [66, 22], [84, 44], [100, 46], [100, 62]], glass: [[44, 42], [50, 26], [60, 26], [60, 42]], glass2: [[63, 42], [63, 26], [68, 26], [78, 42]], w: [20, 81] },
  efe: { body: [[0, 64], [1, 48], [29, 45], [37, 16], [69, 16], [79, 43], [100, 46], [100, 66]], glass: [[35, 43], [41, 21], [56, 21], [56, 43]], glass2: [[59, 43], [59, 21], [67, 21], [75, 43]], w: [20, 79] },
  marmara: { body: [[0, 60], [2, 46], [26, 40], [40, 15], [70, 15], [86, 38], [100, 40], [100, 64]], glass: [[36, 38], [45, 19], [57, 19], [57, 38]], glass2: [[60, 38], [60, 19], [69, 19], [80, 38]], w: [20, 80] },
  liva: { body: [[0, 60], [2, 44], [24, 37], [40, 12], [78, 13], [97, 36], [100, 42], [100, 64]], glass: [[34, 36], [45, 16], [60, 16], [60, 36]], glass2: [[63, 36], [63, 16], [77, 17], [90, 34]], w: [20, 80] },
  bozkir: { body: [[0, 60], [1, 40], [22, 34], [33, 10], [85, 9], [98, 30], [100, 38], [100, 62]], glass: [[31, 33], [39, 15], [57, 15], [57, 33]], glass2: [[60, 33], [60, 15], [83, 14], [92, 32]], w: [19, 81], tall: 1, rails: 1, clad: 1 },
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
  g.fillStyle = spec.shape === 'elektra' ? '#e4fbff' : '#fff5c4';
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
  // Site bloğu: sitenin rengi ortak, kat sayısı, çatı ve balkon düzeni bloktan bloğa değişir
  const { x, y, w, h, seed: s } = r;
  const c = r.color;
  const floors = 6 + (s % 7);
  const wall = Math.min(h * 0.46, floors * 7);
  g.fillStyle = shade(c, -0.34); g.fillRect(x, y + h - wall, w, wall);
  const bal = s % 3;
  for (let j = 0; j < floors; j++) {
    const py = y + h - wall + 2 + j * 7;
    for (let px = x + 4; px < x + w - 8; px += 10 + (s % 3)) {
      g.fillStyle = (s + px + j * 3) % 7 === 0 ? '#ffe9a8' : 'rgba(195,230,255,.9)';
      g.fillRect(px, py, bal === 1 ? 7 : 5, 4);
      if (bal !== 2 && (px + j) % 2 === 0) { g.fillStyle = 'rgba(255,255,255,.75)'; g.fillRect(px - 1, py + 4, 8, 1.2); }
    }
  }
  const rh = h - wall;
  g.fillStyle = shade(c, 0.3 - (s % 4) * 0.08); rr(g, x, y, w, rh, 3); g.fill();
  g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2; g.strokeRect(x + 3, y + 3, w - 6, rh - 6);
  const t = s % 4;
  if (t === 0) { g.fillStyle = '#1f3f77'; for (let py = y + 9; py < y + rh - 12; py += 11) for (let px = x + 9; px < x + w - 18; px += 15) g.fillRect(px, py, 12, 8); }
  else if (t === 1) { g.fillStyle = '#7fb56a'; rr(g, x + 9, y + 9, w - 18, rh - 18, 6); g.fill(); g.fillStyle = '#4f9a3a'; for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(x + 18 + i * 13, y + 18 + (i % 2) * 9, 4.5, 0, 7); g.fill(); } }
  else if (t === 2) { g.fillStyle = shade(c, -0.1); g.fillRect(x + w * 0.2, y + rh * 0.25, w * 0.6, rh * 0.5); g.fillStyle = '#d7dde2'; g.fillRect(x + w * 0.3, y + rh * 0.4, 14, 10); }
  else { g.fillStyle = '#b5482f'; g.fillRect(x + 6, y + 6, w - 12, rh - 12); g.fillStyle = 'rgba(0,0,0,.16)'; g.fillRect(x + 6, y + rh / 2, w - 12, rh / 2 - 6); }
  g.fillStyle = 'rgba(0,0,0,.55)'; g.beginPath(); g.arc(x + w / 2, y + rh / 2, 11, 0, 7); g.fill();
  label(g, String.fromCharCode(65 + (r.block || 0)), x + w / 2, y + rh / 2 + 1, 15, '#fff');
}

// Sokak keyfi: müzikli kafe, çay bahçesi ya da spor salonu. Çatıdan ne olduğu anlaşılır
function cafe(g, r) {
  const { x, y, w, h } = r;
  const gym = r.sign.includes('Spor');
  const tea = r.sign.includes('Çay');
  g.fillStyle = gym ? '#39424e' : tea ? '#6f9a5a' : '#e9d9bf'; rr(g, x, y, w, h, 4); g.fill();
  g.fillStyle = 'rgba(0,0,0,.12)'; g.fillRect(x + 3, y + h - 22, w - 6, 4);
  g.strokeStyle = r.color; g.lineWidth = 3; rr(g, x + 5, y + 5, w - 10, h - 30, 3); g.stroke();
  const cx = x + w / 2; const cy = y + (h - 26) / 2;
  if (gym) {
    g.fillStyle = '#d7dde2'; g.fillRect(cx - 18, cy - 2, 36, 4);
    for (const s of [-1, 1]) { g.fillRect(cx + s * 18 - 3, cy - 9, 6, 18); g.fillRect(cx + s * 12 - 2, cy - 7, 4, 14); }
  } else if (tea) {
    for (const [dx, dy] of [[-16, -6], [14, -8], [0, 8]]) { g.fillStyle = '#f4ead2'; g.beginPath(); g.arc(cx + dx, cy + dy, 7, 0, 7); g.fill(); g.fillStyle = '#b5482f'; g.beginPath(); g.arc(cx + dx, cy + dy, 2.5, 0, 7); g.fill(); }
  } else {
    g.fillStyle = '#6a3f28';
    g.beginPath(); g.ellipse(cx - 9, cy + 8, 6, 4.5, -0.3, 0, 7); g.ellipse(cx + 9, cy + 5, 6, 4.5, -0.3, 0, 7); g.fill();
    g.fillRect(cx - 4, cy - 12, 2.5, 20); g.fillRect(cx + 14, cy - 15, 2.5, 20); g.fillRect(cx - 4, cy - 15, 20.5, 4);
  }
  g.fillStyle = r.color;
  for (let px = x + 2; px < x + w - 6; px += 10) g.fillRect(px, y + h - 18, 5, 8);
  g.fillStyle = '#d7dde2'; g.fillRect(x + 3, y + h - 18, w - 6, 1.5);
}

// Her zincirin kendi cephesi: renk, biçim, tente ve otopark
const CHAINS = {
  // Tenteli küçük market: çizgili sundurma
  pazarcik: (g, r) => { box(g, r, '#3f8f5b', '#f4ead2'); for (let px = r.x; px < r.x + r.w; px += 16) { g.fillStyle = (px - r.x) % 32 ? '#f4ead2' : '#3f8f5b'; g.fillRect(px, r.y + r.h - 22, 16, 7); } },
  // İndirim marketi: büyük yıldız çatı yaması
  ucuzlar: (g, r) => { box(g, r, '#7b3fa0', '#ffd23f'); g.fillStyle = '#ffd23f'; g.beginPath(); for (let i = 0; i < 10; i++) { const a = -1.57 + i * 0.628; const q = i % 2 ? 9 : 20; g[i ? 'lineTo' : 'moveTo'](r.x + r.w * 0.78 + Math.cos(a) * q, r.y + 24 + Math.sin(a) * q); } g.closePath(); g.fill(); },
  sepet: (g, r) => { box(g, r, '#1f9e9e', '#e9f6f4'); g.strokeStyle = '#e9f6f4'; g.lineWidth = 3; g.strokeRect(r.x + r.w * 0.7, r.y + 16, 26, 14); g.beginPath(); g.arc(r.x + r.w * 0.7 + 13, r.y + 16, 11, 3.14, 0); g.stroke(); },
  yildiz: (g, r) => { box(g, r, '#c23b6b', '#fff0d8'); g.fillStyle = '#fff0d8'; for (const k of [0.2, 0.5, 0.8]) { g.beginPath(); g.arc(r.x + r.w * k, r.y + 18, 5, 0, 7); g.fill(); } },
  dortyol: (g, r) => { box(g, r, '#6a7f2a', '#f7f3e3'); g.fillStyle = '#f7f3e3'; g.fillRect(r.x + r.w * 0.5 - 2, r.y + 8, 4, r.h - 34); g.fillRect(r.x + 8, r.y + (r.h - 26) * 0.5, r.w - 16, 4); },
  teknoloji: (g, r) => {
    box(g, r, '#2b3a67', '#b7f34a');
    g.strokeStyle = '#b7f34a'; g.lineWidth = 2;
    for (let px = r.x + 14; px < r.x + r.w - 16; px += 22) { g.beginPath(); g.arc(px, r.y + 16, 5, 0, 7); g.stroke(); }
  },
  yapi: (g, r) => {
    box(g, r, '#8a5a2b', '#f2e6d0');
    g.fillStyle = '#6f8f55'; g.fillRect(r.x + r.w * 0.7, r.y, r.w * 0.3, r.h - 18); // Bahçe bölümü
    g.fillStyle = 'rgba(255,255,255,.25)';
    for (let px = r.x + r.w * 0.7; px < r.x + r.w; px += 12) g.fillRect(px, r.y, 2, r.h - 18);
  },
  kose: (g, r) => { box(g, r, '#b5651d', '#fff4d8'); stripe(g, r, '#fff4d8', '#b5651d'); },
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

function kolej(g, r) {
  // Haritanın en büyük binası: turuncu, beyaz, siyah
  const { x, y, w, h } = r;
  g.fillStyle = '#17181b'; rr(g, x, y, w, h, 6); g.fill();
  g.fillStyle = '#ff7a00'; rr(g, x, y, w, h - 40, 6); g.fill();
  g.fillStyle = '#ffffff'; g.fillRect(x + 22, y + 22, w - 44, h - 84);
  g.fillStyle = '#ff7a00'; g.fillRect(x + 44, y + 44, w - 88, h - 128);
  g.fillStyle = '#17181b'; g.fillRect(x, y + (h - 40) / 2 - 3, 22, 6); g.fillRect(x + w - 22, y + (h - 40) / 2 - 3, 22, 6);
  // Yazı: turuncu üstüne beyaz, siyah gölgeli
  const size = Math.floor(w / 11);
  const cx = x + w / 2; const cy = y + (h - 40) / 2;
  g.font = `900 ${size}px Bungee, Nunito, sans-serif`;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillStyle = '#17181b';
  const [top, ...rest] = NAMES.kolej.ad.split(' ');
  const bottom = rest.join(' ');
  g.fillText(top, cx + 4, cy - size * 0.55 + 4);
  g.fillText(bottom, cx + 4, cy + size * 0.55 + 4);
  g.fillStyle = '#ffffff';
  g.fillText(top, cx, cy - size * 0.55);
  g.fillText(bottom, cx, cy + size * 0.55);
  // Cephe: beyaz sütunlar, siyah camlar, turuncu giriş
  for (let px = x + 10; px < x + w - 12; px += 24) {
    g.fillStyle = '#ffffff'; g.fillRect(px, y + h - 38, 6, 38);
    g.fillStyle = '#23262b'; g.fillRect(px + 6, y + h - 36, 16, 12);
    g.fillStyle = '#ff9a3c'; g.fillRect(px + 6, y + h - 20, 16, 12);
  }
  g.fillStyle = '#ff7a00'; g.fillRect(x + w / 2 - 58, y + h - 40, 116, 40);
  label(g, NAMES.kolej.ad, x + w / 2, y + h - 22, 8.5, '#ffffff', 900);
}


// --- v5: tek tek kimlikli binalar ---
const SHOP_LOOK = [
  [/döner|dönerci|kebap|iskender|ciğer|çiğköfte/i, { wall: '#7a2a18', awn: ['#c8261e', '#ffd23f'], fx: 'spit' }],
  [/pide|lahmacun|börek|fırın|ekmek/i, { wall: '#a8733f', awn: ['#d97706', '#fff4d8'], fx: 'oven' }],
  [/eczane/i, { wall: '#f4f6f4', awn: ['#d0121b', '#ffffff'], fx: 'cross' }],
  [/kuaför|berber/i, { wall: '#2d3a55', awn: ['#1d6fb8', '#ffffff'], fx: 'pole' }],
  [/çay|kahve|kafe|tost/i, { wall: '#5a3a24', awn: ['#178a4d', '#f4e7c8'], fx: 'tables' }],
  [/büfe|bayii|bakkal|market/i, { wall: '#30536e', awn: ['#ffd23f', '#1d6fb8'], fx: 'crates' }],
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

// Cephe süsleri: tohumdan seçilir, hiçbir bina aynı düzende olmaz
function facadeBits(g, r) {
  if (r.h < 56 || r.w < 44) return;
  const s = r.seed;
  const y = r.y + r.h - Math.min(r.h * 0.34, 34);
  const step = 15 + (s % 9);
  let k = s % 11;
  for (let px = r.x + 6; px < r.x + r.w - 14; px += step) {
    k = (k * 7 + 3) % 11;
    const py = y + (k % 3) * 8;
    if (k < 3) { // Çamaşır
      g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 0.7; g.beginPath(); g.moveTo(px, py); g.lineTo(px + 12, py); g.stroke();
      for (let i = 0; i < 3; i++) { g.fillStyle = ['#f4f6f8', '#e8533f', '#3e7cb1', '#f2c14e', '#d94f9c'][(s + i + k) % 5]; g.fillRect(px + 1 + i * 4, py, 3, 4 + (i % 2) * 2); }
    } else if (k < 5) { // Klima
      g.fillStyle = '#dfe3e8'; g.fillRect(px, py, 9, 6); g.fillStyle = '#6d7680'; g.beginPath(); g.arc(px + 4.5, py + 3, 2, 0, 7); g.fill();
    } else if (k < 7) { // Çiçekli balkon
      g.fillStyle = '#8a5a3a'; g.fillRect(px, py + 3, 12, 2.4);
      for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? '#4f9a3a' : ['#ff5a8a', '#ffd23f', '#e8352e'][(s + k) % 3]; g.beginPath(); g.arc(px + 1.6 + i * 3, py + 2, 1.7, 0, 7); g.fill(); }
    } else if (k < 9) { // Tente
      for (let i = 0; i < 4; i++) { g.fillStyle = i % 2 ? '#fff' : ['#c8261e', '#1d6fb8', '#178a4d'][s % 3]; g.fillRect(px + i * 3, py, 3, 4); }
    } else { // Uydu çanağı
      g.fillStyle = '#eceff2'; g.beginPath(); g.ellipse(px + 4, py + 3, 4, 3.4, 0.5, 0, 7); g.fill();
      g.strokeStyle = '#7d8590'; g.lineWidth = 0.8; g.beginPath(); g.moveTo(px + 4, py + 3); g.lineTo(px + 7, py + 7); g.stroke();
    }
  }
}

// Harabe: çöken çatı, kırık duvar, çatlaklar, moloz
function ruin(g, r) {
  const { x, y, w, h, seed: s } = r;
  g.fillStyle = '#8b8378'; g.fillRect(x, y, w, h);
  g.fillStyle = '#2a2622'; // İç boşluk
  g.beginPath();
  // Delik her harabede farklı yerde ve boyda
  const hx = 0.1 + ((s % 7) / 7) * 0.34; const hw = 0.34 + ((s % 5) / 5) * 0.36;
  const hy = 0.12 + ((s % 3) / 3) * 0.3; const hh = 0.3 + ((s % 4) / 4) * 0.34;
  g.moveTo(x + w * hx, y + h * hy);
  for (let i = 0; i <= 7; i++) { const t = i / 7; g.lineTo(x + w * (hx + hw * t), y + h * (hy + (((s * (i + 3)) % 13) / 13) * 0.2)); }
  for (let i = 7; i >= 0; i--) { const t = i / 7; g.lineTo(x + w * (hx + hw * t), y + h * (hy + hh + (((s * (i + 7)) % 11) / 11) * 0.2)); }
  g.closePath(); g.fill();
  g.strokeStyle = '#5b544b'; g.lineWidth = 1.2;
  for (let i = 0; i < 7; i++) {
    let px = x + ((s * (i + 2) * 37) % 100) / 100 * w; let py = y + ((s * (i + 5) * 53) % 100) / 100 * h;
    g.beginPath(); g.moveTo(px, py);
    for (let k = 0; k < 4; k++) { px += ((s + k * 17 + i) % 19) - 9; py += ((s + k * 23 + i) % 17) - 6; g.lineTo(px, py); }
    g.stroke();
  }
  // Duvar kalıntısı ve kırık kenar
  g.fillStyle = '#a79c8d';
  for (let px = x; px < x + w; px += 11) { const hh = 4 + ((s + px) % 13); g.fillRect(px, y, 8, hh); g.fillRect(px, y + h - hh, 8, hh); }
  for (let i = 0; i < 16; i++) {
    g.fillStyle = ['#786a56', '#9b8a72', '#b5482f', '#5e564b'][(s + i) % 4];
    const u = ((s * (i + 3) * 41) % 97) / 97; const v = ((s * (i + 9) * 59) % 89) / 89;
    g.beginPath(); g.moveTo(x + u * w, y + v * h); g.lineTo(x + u * w + 9, y + v * h + 2); g.lineTo(x + u * w + 4, y + v * h + 8); g.closePath(); g.fill();
  }
  // Açıkta kalan kiriş
  g.strokeStyle = '#3f3a33'; g.lineWidth = 3; g.beginPath(); g.moveTo(x + w * 0.2, y + h * 0.3); g.lineTo(x + w * 0.74, y + h * 0.62); g.stroke();
}

// İnşaat: iskele, açık kat döşemesi, kum yığını, iş makinesi, vinç, bariyer
function sitework(g, r) {
  const { x, y, w, h, seed: s } = r;
  g.fillStyle = '#b79c6c'; g.fillRect(x, y, w, h);
  const bw = w * 0.66; const bh = h * 0.62;
  g.fillStyle = '#b7bbbf'; g.fillRect(x + 6, y + 6, bw, bh);
  g.fillStyle = '#8d9196'; for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) g.fillRect(x + 10 + (i * bw) / 4, y + 10 + (j * bh) / 3, 5, 5);
  g.strokeStyle = '#c4c9ce'; g.lineWidth = 1;
  for (let px = x + 2; px < x + bw + 12; px += 9) { g.beginPath(); g.moveTo(px, y + 2); g.lineTo(px, y + bh + 11); g.stroke(); }
  for (let py = y + 2; py < y + bh + 12; py += 9) { g.beginPath(); g.moveTo(x + 2, py); g.lineTo(x + bw + 11, py); g.stroke(); }
  g.strokeStyle = 'rgba(30,110,60,.55)'; g.lineWidth = 2.5; g.strokeRect(x + 2, y + 2, bw + 9, bh + 9);
  // Kum yığını
  const sx = x + w * 0.84; const sy = y + h * 0.28;
  const gr = g.createRadialGradient(sx - 3, sy - 3, 2, sx, sy, 17);
  gr.addColorStop(0, '#f0d9a0'); gr.addColorStop(1, '#c9a860');
  g.fillStyle = gr; g.beginPath(); g.arc(sx, sy, 15, 0, 7); g.fill();
  // İş makinesi
  const mx = x + w * 0.22 + (s % 30); const my = y + h - 22;
  g.fillStyle = '#23262b'; g.fillRect(mx - 2, my + 9, 30, 4); g.fillRect(mx - 2, my - 2, 30, 4);
  g.fillStyle = '#ffb020'; g.fillRect(mx, my, 26, 11);
  g.fillStyle = '#23303a'; g.fillRect(mx + 15, my + 2, 8, 7);
  g.strokeStyle = '#e8a010'; g.lineWidth = 3.4; g.beginPath(); g.moveTo(mx + 3, my + 5); g.lineTo(mx - 18, my - 10); g.lineTo(mx - 28, my + 2); g.stroke();
  // Vinç: kol şantiyeyi aşar
  const cx = x + w * 0.72; const cy = y + h * 0.7; const a = ((s % 8) / 8) * 6.283;
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 5; g.beginPath(); g.moveTo(cx + 8, cy + 10); g.lineTo(cx + 8 + Math.cos(a) * 80, cy + 10 + Math.sin(a) * 80); g.stroke();
  g.strokeStyle = '#ffd23f'; g.lineWidth = 4.5; g.beginPath(); g.moveTo(cx - Math.cos(a) * 20, cy - Math.sin(a) * 20); g.lineTo(cx + Math.cos(a) * 80, cy + Math.sin(a) * 80); g.stroke();
  g.strokeStyle = '#a87a10'; g.lineWidth = 1; for (let k = -2; k < 8; k++) { const q = k * 10; g.beginPath(); g.moveTo(cx + Math.cos(a) * q - Math.sin(a) * 2, cy + Math.sin(a) * q + Math.cos(a) * 2); g.lineTo(cx + Math.cos(a) * (q + 8) + Math.sin(a) * 2, cy + Math.sin(a) * (q + 8) - Math.cos(a) * 2); g.stroke(); }
  g.fillStyle = '#d0121b'; g.fillRect(cx - 5, cy - 5, 10, 10);
  // Bariyer
  for (let px = x; px < x + w - 6; px += 16) { g.fillStyle = (px - x) % 32 ? '#fff' : '#e8352e'; g.fillRect(px, y + h - 5, 16, 5); }
}

// Eski sanayi: testere dişi paslı çatı, baca, boru, sarnıç
function factory(g, r) {
  const { x, y, w, h, seed: s } = r;
  const rust = ['#8a5a3a', '#7a6650', '#6d6a60', '#94603f'][s % 4];
  const wall = Math.min(26, h * 0.3);
  g.fillStyle = '#5a5148'; g.fillRect(x, y + h - wall, w, wall);
  g.fillStyle = 'rgba(150,190,200,.45)'; for (let px = x + 5; px < x + w - 12; px += 15) g.fillRect(px, y + h - wall + 4, 11, 10);
  const rh = h - wall;
  const n = Math.max(2, Math.floor(rh / 20));
  for (let i = 0; i < n; i++) {
    const py = y + (i * rh) / n; const ph = rh / n;
    const gr = g.createLinearGradient(0, py, 0, py + ph);
    gr.addColorStop(0, shade(rust, 0.3)); gr.addColorStop(0.6, rust); gr.addColorStop(1, shade(rust, -0.45));
    g.fillStyle = gr; g.fillRect(x, py, w, ph);
    g.fillStyle = 'rgba(170,215,230,.5)'; g.fillRect(x + 4, py + ph - 4, w - 8, 3);
  }
  for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(50,25,10,.3)'; g.fillRect(x + ((s * (i + 3) * 31) % 100) / 100 * w, y + ((s * (i + 7) * 43) % 100) / 100 * rh, 10, 5); }
  // Bacalar
  const m = 1 + (s % 3);
  for (let i = 0; i < m; i++) {
    const cx = x + w * (0.2 + i * 0.3); const cy = y + rh * 0.3;
    g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.moveTo(cx - 5, cy); g.lineTo(cx + 44, cy + 54); g.lineTo(cx + 50, cy + 48); g.lineTo(cx + 5, cy - 3); g.closePath(); g.fill();
    g.fillStyle = '#a8553a'; g.beginPath(); g.arc(cx, cy, 9, 0, 7); g.fill();
    g.fillStyle = '#e8e4d8'; g.beginPath(); g.arc(cx, cy, 6.6, 0, 7); g.fill();
    g.fillStyle = '#1b1a18'; g.beginPath(); g.arc(cx, cy, 4.6, 0, 7); g.fill();
  }
  g.strokeStyle = '#5f6972'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 8, y + rh * 0.76); g.lineTo(x + w - 8, y + rh * 0.76); g.stroke();
}

function paintBuilding2(g, r) {
  const S = BUILD;
  switch (r.style) {
    case S.APARTMENT: apartment2(g, r); break;
    case S.KOLEJ: kolej(g, r); break;
    case S.CHAIN: (CHAINS[r.brand] || CHAINS.pazarcik)(g, r); break;
    case S.BANK: bank2(g, r); break;
    case S.RUIN: ruin(g, r); return true;
    case S.SITEWORK: sitework(g, r); return true;
    case S.FACTORY: factory(g, r); return true;
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
    case S.CAFE: cafe(g, r); break;
    default: return paintLandmark(g, r);
  }
  if (r.style === S.APARTMENT || r.style === S.SITE_BLOCK || r.style === S.RESIDENCE || r.style === S.HOTEL || r.style === S.ISHANI || r.style === S.SHOPROW) facadeBits(g, r);
  return true;
}

// Gölge boyu: bina yüksekliğine göre
function shadowOf(r) {
  const S = BUILD;
  if (r.tall) return 1.4 + r.tall * 16;
  switch (r.style) {
    case S.SKYSCRAPER: return 4.6;
    case S.RESIDENCE: case S.OFFICE: return 3.2;
    case S.HOTEL: case S.KOLEJ: case S.HOSPITAL: return 2;
    case S.SITE_BLOCK: return 1.5 + (r.seed % 3) * 0.3;
    case S.APARTMENT: return 0.9 + (r.seed % 4) * 0.3;
    case S.GECEKONDU: case S.VILLA: case S.SHOP: return 0.45;
    case S.STADIUM: return 1;
    case S.MUZE: case S.OZEL_OKUL: return 2.2;
    case S.ANIT: return 2.6;
    case S.SELCUK_CAMI: case S.KONGRE: return 1.8;
    case S.AVM: return 1.5;
    case S.BEDESTEN: return 1.2;
    case S.SERVIS: return 0.8;
    case S.BAGEVI: return 0.6;
    default: return 1;
  }
}

const NIGHT_LIGHTS = CONFIG.day;

// --- carsheet.js ---
// Üretilmiş dosya: node tools/bake-cars.mjs
const CAR_SHEET = {"w":2048,"h":1675,"cells":{"p:atmaca:0":[0,0,288,144],"p:atmaca:1":[290,0,288,144],"p:atmaca:2":[580,0,288,144],"p:atmaca:3":[870,0,288,144],"p:motor:0":[1160,0,288,162],"p:motor:1":[1450,0,288,162],"p:motor:2":[1740,0,288,162],"p:motor:3":[0,164,288,162],"p:granit:0":[290,164,288,144],"p:granit:1":[580,164,288,144],"p:granit:2":[870,164,288,144],"p:granit:3":[1160,164,288,144],"p:elektra:0":[1450,164,288,144],"p:elektra:1":[1740,164,288,144],"p:elektra:2":[0,328,288,144],"p:elektra:3":[290,328,288,144],"p:simsek:0":[580,328,288,144],"p:simsek:1":[870,328,288,144],"p:simsek:2":[1160,328,288,144],"p:simsek:3":[1450,328,288,144],"p:cinar:0":[1740,328,288,144],"p:cinar:1":[0,474,288,144],"p:cinar:2":[290,474,288,144],"p:cinar:3":[580,474,288,144],"p:efe:0":[870,474,288,144],"p:efe:1":[1160,474,288,144],"p:efe:2":[1450,474,288,144],"p:efe:3":[1740,474,288,144],"p:marmara:0":[0,620,288,144],"p:marmara:1":[290,620,288,144],"p:marmara:2":[580,620,288,144],"p:marmara:3":[870,620,288,144],"p:liva:0":[1160,620,288,144],"p:liva:1":[1450,620,288,144],"p:liva:2":[1740,620,288,144],"p:liva:3":[0,766,288,144],"p:bozkir:0":[290,766,288,144],"p:bozkir:1":[580,766,288,144],"p:bozkir:2":[870,766,288,144],"p:bozkir:3":[1160,766,288,144],"npc:klasik:0":[1450,766,168,84],"npc:klasik:1":[1620,766,168,84],"npc:klasik:2":[1790,766,168,84],"npc:klasik:3":[0,912,168,84],"npc:klasik:4":[170,912,168,84],"npc:efe:0":[340,912,168,84],"npc:efe:1":[510,912,168,84],"npc:efe:2":[680,912,168,84],"npc:efe:3":[850,912,168,84],"npc:cinar:0":[1020,912,168,84],"npc:cinar:1":[1190,912,168,84],"npc:cinar:2":[1360,912,168,84],"npc:elektra:0":[1530,912,168,84],"npc:elektra:1":[1700,912,168,84],"npc:elektra:2":[1870,912,168,84],"npc:elektra:3":[0,998,168,84],"npc:taxi:0":[170,998,168,84],"npc:bavar:0":[340,998,168,84],"npc:bavar:1":[510,998,168,84],"npc:bavar:2":[680,998,168,84],"npc:bavar:3":[850,998,168,84],"npc:bavar:4":[1020,998,168,84],"npc:aurum:0":[1190,998,168,84],"npc:aurum:1":[1360,998,168,84],"npc:aurum:2":[1530,998,168,84],"npc:aurum:3":[1700,998,168,84],"npc:stella:0":[1870,998,168,84],"npc:stella:1":[0,1084,168,84],"npc:stella:2":[170,1084,168,84],"npc:stella:3":[340,1084,168,84],"npc:volta:0":[510,1084,168,84],"npc:volta:1":[680,1084,168,84],"npc:volta:2":[850,1084,168,84],"npc:volta:3":[1020,1084,168,84],"npc:volta:4":[1190,1084,168,84],"npc:pusula:0":[1360,1084,168,84],"npc:pusula:1":[1530,1084,168,84],"npc:pusula:2":[1700,1084,168,84],"npc:pusula:3":[1870,1084,168,84],"npc:dalga:0":[0,1170,168,84],"npc:dalga:1":[170,1170,168,84],"npc:dalga:2":[340,1170,168,84],"npc:dalga:3":[510,1170,168,84],"npc:lale:0":[680,1170,168,84],"npc:lale:1":[850,1170,168,84],"npc:lale:2":[1020,1170,168,84],"npc:lale:3":[1190,1170,168,84],"npc:vadi:0":[1360,1170,168,84],"npc:vadi:1":[1530,1170,168,84],"npc:vadi:2":[1700,1170,168,84],"npc:vadi:3":[1870,1170,168,84],"npc:pickup:0":[0,1256,168,84],"npc:pickup:1":[170,1256,168,84],"npc:pickup:2":[340,1256,168,84],"npc:pickup:3":[510,1256,168,84],"npc:motosiklet:0":[680,1256,168,84],"npc:motosiklet:1":[850,1256,168,84],"npc:motosiklet:2":[1020,1256,168,84],"npc:motosiklet:3":[1190,1256,168,84],"npc:liva:0":[1360,1256,168,84],"npc:liva:1":[1530,1256,168,84],"npc:liva:2":[1700,1256,168,84],"npc:liva:3":[1870,1256,168,84],"npc:bozkir:0":[0,1342,168,84],"npc:bozkir:1":[170,1342,168,84],"npc:bozkir:2":[340,1342,168,84],"npc:granit:0":[510,1342,168,84],"npc:granit:1":[680,1342,168,84],"npc:granit:2":[850,1342,168,84],"npc:marmara:0":[1020,1342,168,84],"npc:marmara:1":[1190,1342,168,84],"npc:marmara:2":[1360,1342,168,84],"npc:marmara:3":[1530,1342,168,84],"npc:minibus:0":[1700,1342,300,108],"npc:bus:0":[0,1452,300,108],"npc:bus:1":[302,1452,300,108],"npc:bus:2":[604,1452,300,108],"npc:truck:0":[906,1452,300,108],"npc:truck:1":[1208,1452,300,108],"npc:truck:2":[1510,1452,300,108],"npc:truck:3":[0,1562,300,108],"cop:car":[302,1562,200,100],"cop:fast":[504,1562,200,100],"cop:advanced":[706,1562,200,100],"cop:swat":[908,1562,200,88],"cop:moto":[1110,1562,200,113]}};

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
  const ready = () => { ATLAS.img = img; ATLAS.ready = true; if (done) done(); };
  // Görsel, ilk çizimde değil burada çözülür: oyun sırasında takılma yapmaz
  img.onload = () => { if (img.decode) img.decode().then(ready, ready); else ready(); };
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
  const g = c.getContext('2d');
  // Çift kontur: koyu dış hale açık yolda, ince açık hat koyu yolda aracı ayırır
  const q = w / 96;
  g.shadowColor = 'rgba(0,0,0,.95)'; g.shadowBlur = 3.6 * q;
  g.drawImage(ATLAS.img, x, y, w, h, 0, 0, w, h);
  g.drawImage(ATLAS.img, x, y, w, h, 0, 0, w, h);
  g.shadowColor = 'rgba(255,255,255,.9)'; g.shadowBlur = 1.2 * q;
  g.drawImage(ATLAS.img, x, y, w, h, 0, 0, w, h);
  g.shadowColor = 'transparent'; g.shadowBlur = 0;
  g.drawImage(ATLAS.img, x, y, w, h, 0, 0, w, h);
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
    car: ['marmara', { color: '#f2f4f7', finish: 'gloss', band: '#1c4fb0', roof: '#f2f4f7', police: 1, text: 'POLİS', textColor: '#1c4fb0' }],
    fast: ['bavar', { color: '#16305f', finish: 'metal', police: 1, band: '#ffffff', text: 'POLİS' }],
    advanced: ['elektra', { color: '#14161b', finish: 'metal', police: 1, band: '#ff2a3c' }],
    swat: ['minibus', { color: '#23272e', finish: 'matte', police: 1, band: '#ffd23f', text: 'ÖZEL HAREKAT' }],
    moto: ['moto', { color: '#1c4fb0', finish: 'gloss', accent: '#ffffff' }],
  };
  for (const k of Object.keys(cops)) list.push({ key: `cop:${k}`, model: cops[k][0], px: 200, ar: k === 'swat' ? 0.44 : k === 'moto' ? 0.56 : 0.5, paint: cops[k][1] });
  return list;
}

// --- carmodels.js ---
// Araç tanımları: tamamı özgün, tanıdık gövde tiplerinde. features tasarım notudur.
// Ölçüler metredir. s: burundan kuyruğa 0-1 konum. deck: kaput/omuz/bagaj hattı, roof: tavan hattı, plan: üstten yarı genişlik oranı.
// Tüm araçlar aynı özgün Drift Lab rozetini taşır.

const LED = '#eafcff';
const AMB = '#ff9a1f';
const RED = '#e0142a';
const BLK = '#0c0e12';
const CRM = '#d9dfe6';
const GRY = '#2a2e35';

// d: fascia çizim yardımcısı. Koordinat metre: y sola/sağa merkezden, z yerden yukarı
const CAR_MODELS = {
  atmaca: {
    name: 'Atmaca', L: 4.378, W: 1.683, H: 1.421, wb: 2.49, fo: 0.8, r: 0.29, sill: 0.2, crown: 0.03, tumble: 0.85, bowF: 0.03, bowR: 0.03, rim: 'hub',
    features: ['Üç kutulu klasik mahalle sedanı', 'Yumuşak köşeli ayrık farlar', 'Gövde renginde panel, üç ince yarık', 'Dik cam, geniş yan pencere', 'Üç parçalı ince stop'],
    plan: [[0, 0.93], [0.03, 0.98], [0.5, 1], [0.97, 0.98], [1, 0.94]],
    deck: [[0, 0.721], [0.025, 0.793], [0.3, 0.886], [0.36, 0.906], [0.78, 0.927], [0.97, 0.896], [1, 0.783]],
    roof: [[0.325, 0.886], [0.455, 1.401], [0.715, 1.421], [0.815, 0.958], [0.835, 0.927]],
    win: [[0.4, 0.545], [0.56, 0.74]], seams: [0.345, 0.55, 0.76], handles: [0.53, 0.735], hood: 0.3, trunk: 0.82,
    bumper: { c: GRY, z: 0.44, h: 0.12, d: 0.08 },
    top: [{ s0: 0.002, s1: 0.03, a: 0.52, b: 0.93, c: LED, glow: 1 }, { s0: 0.975, s1: 0.999, a: 0.34, b: 0.93, c: RED, glow: 1 }],
    front(d) {
      d.round(0, 0.68, 0.62, 0.14, BLK, 0.04);
      for (const z of [0.64, 0.68, 0.72]) d.box(0, z, 0.56, 0.012, '#8d95a0');
      d.both(0.58, 0.69, 0.3, 0.13, LED, 0.05); d.both(0.74, 0.54, 0.1, 0.05, AMB, 0.02);
      d.emblem(0, 0.68, 'lab');
    },
    rear(d) {
      for (const y of [0.38, 0.54, 0.7]) { d.box(y, 0.74, 0.14, 0.09, RED, 0.02); d.box(-y, 0.74, 0.14, 0.09, RED, 0.02); }
      d.box(0, 0.58, 0.46, 0.13, '#f0f2f4', 0.01); d.text('ATMACA', 0.17, 0.82);
    },
  },
  simsek: {
    name: 'Şimşek', L: 4.315, W: 1.683, H: 1.346, wb: 2.49, fo: 0.8, r: 0.31, sill: 0.15, crown: 0.03, tumble: 0.85, bowF: 0.03, bowR: 0.03, rim: 'five',
    features: ['Alçak sokak tuning sedan', 'Ok ucu desenli ön panel', 'Yüksek bagaj spoyleri, kaputta çift şerit', 'Yan etek, kalın egzoz', 'Kararmış cam, geniş jant'],
    plan: [[0, 0.93], [0.03, 0.98], [0.5, 1], [0.97, 0.98], [1, 0.94]],
    deck: [[0, 0.653], [0.025, 0.723], [0.3, 0.812], [0.36, 0.832], [0.78, 0.851], [0.97, 0.822], [1, 0.713]],
    roof: [[0.32, 0.812], [0.45, 1.307], [0.71, 1.327], [0.81, 0.881], [0.83, 0.851]],
    win: [[0.4, 0.545], [0.56, 0.74]], seams: [0.345, 0.55, 0.76], handles: [0.53, 0.735], hood: 0.3, trunk: 0.82, darkGlass: 1,
    wing: { s: 0.965, z: 1.12, span: 1.6, chord: 0.3 }, skirt: 1, exhaust: 1,
    bumper: { c: BLK, z: 0.38, h: 0.15, d: 0.1 },
    stripes: [{ s0: 0, s1: 1, a: 0.12, b: 0.3 }],
    top: [{ s0: 0.002, s1: 0.03, a: 0.5, b: 0.93, c: LED, glow: 1 }, { s0: 0.975, s1: 0.999, a: 0.34, b: 0.93, c: RED, glow: 1 }],
    front(d) {
      d.round(0, 0.62, 1.1, 0.2, BLK, 0.05);
      for (let y = -0.42; y <= 0.42; y += 0.14) d.polyLine([[y - 0.05, 0.68], [y + 0.03, 0.62], [y - 0.05, 0.56]], '#ffd23f', 0.016);
      d.both(0.64, 0.68, 0.26, 0.09, '#fff8d8', 0.04);
      d.box(0, 0.36, 0.8, 0.1, '#050608', 0.02);
      d.emblem(0, 0.76, 'lab');
    },
    rear(d) { d.both(0.6, 0.7, 0.4, 0.1, RED, 0.03); d.box(0, 0.7, 0.62, 0.15, BLK); d.text('ŞİMŞEK', 0.15, 0.7, '#ffd23f'); d.both(0.52, 0.3, 0.1, 0.1, '#7d858f', 0.05); },
  },
  efe: {
    name: 'Efe 131', L: 4.388, W: 1.666, H: 1.428, wb: 2.49, fo: 0.78, r: 0.28, sill: 0.22, crown: 0.02, tumble: 0.88, bowF: 0.0, bowR: 0.0, rim: 'steel',
    features: ['1970ler ruhunda köşeli aile sedanı', 'Tek yuvarlak far, ağ desenli geniş panel', 'Parlak krom tamponlar', 'İnce direkler, büyük camlar', 'Uzun bagaj, yatay stoplar'],
    plan: [[0, 0.95], [0.012, 0.99], [0.5, 1], [0.988, 0.99], [1, 0.96]],
    deck: [[0, 0.755], [0.015, 0.836], [0.3, 0.898], [0.36, 0.918], [0.78, 0.938], [0.985, 0.918], [1, 0.816]],
    roof: [[0.335, 0.898], [0.445, 1.408], [0.725, 1.428], [0.805, 0.969], [0.825, 0.938]],
    win: [[0.395, 0.54], [0.555, 0.745]], seams: [0.345, 0.545, 0.76], handles: [0.525, 0.735], hood: 0.31, trunk: 0.81, roofStrip: 1,
    bumper: { c: CRM, z: 0.48, h: 0.1, d: 0.09 },
    top: [{ s0: 0, s1: 0.016, a: 0.2, b: 0.92, c: BLK }, { s0: 0.984, s1: 1, a: 0.5, b: 0.93, c: RED, glow: 1 }],
    front(d) {
      d.box(0, 0.7, 1.46, 0.2, BLK, 0.02);
      for (let y = -0.4; y <= 0.4; y += 0.08) for (let z = 0.64; z <= 0.76; z += 0.06) d.diamond(y, z, 0.018, '#7b828c');
      for (const s of [-1, 1]) { d.circ(s * 0.6, 0.7, 0.115, CRM); d.circ(s * 0.6, 0.7, 0.095, '#fff8d8'); }
      d.both(0.62, 0.53, 0.14, 0.05, AMB, 0.01);
      d.emblem(0, 0.7, 'lab');
    },
    rear(d) { d.both(0.58, 0.76, 0.42, 0.13, RED, 0.02); d.both(0.74, 0.76, 0.12, 0.13, AMB); d.box(0, 0.62, 0.44, 0.13, '#f0f2f4', 0.01); d.text('EFE', 0.13, 0.84, CRM); },
  },
  cinar: {
    name: 'Çınar A', L: 4.368, W: 1.658, H: 1.43, wb: 2.47, fo: 0.72, r: 0.3, sill: 0.2, crown: 0.07, tumble: 0.78, bowF: 0.2, bowR: 0.16, rim: 'steel', smooth: 7,
    features: ['Yuvarlak hatlı 60lar klasiği', 'İki kapı, kubbe tavan', 'Dikey ince çubuklu kalkan panel', 'Krom tampon, küçük stoplar', 'Kısa kabin, uzun kaput'],
    plan: [[0, 0.72], [0.03, 0.88], [0.12, 0.97], [0.3, 1], [0.7, 0.98], [0.92, 0.92], [1, 0.76]],
    deck: [[0, 0.68], [0.04, 0.78], [0.2, 0.86], [0.42, 0.88], [0.7, 0.86], [0.92, 0.8], [1, 0.68]],
    roof: [[0.42, 0.88], [0.52, 1.36], [0.64, 1.42], [0.74, 1.36], [0.9, 0.9], [0.94, 0.82]],
    win: [[0.48, 0.66], [0.675, 0.77]], seams: [0.43, 0.68], handles: [0.65], hood: 0.36, trunk: 0.86, sideStripe: 0.7,
    bumper: { c: CRM, z: 0.46, h: 0.09, d: 0.09 },
    top: [{ s0: 0.01, s1: 0.06, a: 0.42, b: 0.82, c: '#fff8d8', glow: 1 }, { s0: 0.96, s1: 0.995, a: 0.4, b: 0.76, c: RED, glow: 1 }],
    front(d) {
      d.poly([[-0.34, 0.76], [0.34, 0.76], [0.26, 0.54], [-0.26, 0.54]], BLK);
      for (let y = -0.24; y <= 0.24; y += 0.08) d.box(y, 0.65, 0.014, 0.18, CRM);
      for (const s of [-1, 1]) { d.circ(s * 0.58, 0.68, 0.12, CRM); d.circ(s * 0.58, 0.68, 0.1, '#fff8d8'); d.circ(s * 0.4, 0.62, 0.035, AMB); }
      d.emblem(0, 0.8, 'lab');
    },
    rear(d) { d.both(0.5, 0.72, 0.2, 0.09, RED, 0.04); d.both(0.5, 0.6, 0.12, 0.05, AMB, 0.02); d.box(0, 0.6, 0.4, 0.12, '#f0f2f4', 0.01); },
  },
  elektra: {
    name: 'Elektra X1', L: 4.508, W: 1.852, H: 1.63, wb: 2.89, fo: 0.8, r: 0.38, sill: 0.3, crown: 0.05, tumble: 0.8, bowF: 0.14, bowR: 0.1, rim: 'turbine', smooth: 5,
    features: ['Elektrikli kompakt crossover', 'Kapalı ön panel, ok desenli yüzey', 'İkiye bölünmüş ince gündüz farı', 'Kısa çıkıntılar, uzun aks', 'Köşeli çift arka ışık, turbin jant'],
    plan: [[0, 0.82], [0.03, 0.93], [0.1, 0.98], [0.5, 1], [0.9, 0.98], [0.98, 0.92], [1, 0.84]],
    deck: [[0, 0.698], [0.03, 0.873], [0.2, 1.028], [0.3, 1.086], [0.8, 1.145], [0.95, 1.067], [1, 0.854]],
    roof: [[0.19, 1.028], [0.37, 1.571], [0.55, 1.63], [0.86, 1.533], [0.955, 1.125], [0.97, 1.067]],
    win: [[0.33, 0.56], [0.57, 0.8]], seams: [0.27, 0.56, 0.8], handles: [], hood: 0.22, trunk: 0.94, roofBlack: 1, chromeBelt: 1, clad: 0.48,
    top: [{ s0: 0.012, s1: 0.042, a: 0, b: 0.92, c: LED, glow: 1 }, { s0: 0.955, s1: 0.985, a: 0, b: 0.92, c: RED, glow: 1 }],
    front(d) {
      d.round(0, 0.68, 1.42, 0.34, '#161b22', 0.08);
      for (let y = -0.56; y <= 0.56; y += 0.16) d.polyLine([[y - 0.06, 0.6], [y, 0.68], [y + 0.06, 0.6]], '#3f6d7a', 0.012);
      d.both(0.56, 0.84, 0.44, 0.035, LED, 0.015); d.both(0.76, 0.76, 0.05, 0.11, LED, 0.015);
      d.box(0, 0.38, 0.9, 0.1, '#10141a', 0.03);
      d.emblem(0, 0.76, 'lab');
    },
    rear(d) { d.both(0.66, 1.0, 0.36, 0.05, RED, 0.02); d.both(0.82, 0.92, 0.05, 0.14, RED, 0.02); d.box(0, 0.82, 1.2, 0.2, '#10141a', 0.03); d.text('X1', 0.14, 0.82, '#dfe6ee'); d.box(0, 0.38, 1.2, 0.12, '#10141a', 0.03); },
  },
  marmara: {
    name: 'Marmara S', L: 4.439, W: 1.772, H: 1.53, wb: 2.64, fo: 0.87, r: 0.32, sill: 0.2, crown: 0.05, tumble: 0.8, bowF: 0.16, bowR: 0.08, rim: 'multi', smooth: 4,
    features: ['Yüksek bagajlı modern aile sedanı', 'Dikdörtgen ağ panel, köşeli far', 'Kısa kaput, kavisli tavan', 'Geniş yan ayna', 'İnce L stoplar, bagajda düz bant'],
    plan: [[0, 0.76], [0.03, 0.9], [0.12, 0.98], [0.5, 1], [0.9, 0.98], [0.99, 0.88], [1, 0.84]],
    deck: [[0, 0.632], [0.03, 0.796], [0.24, 0.979], [0.3, 1.02], [0.72, 1.081], [0.93, 1.081], [0.99, 1.02], [1, 0.836]],
    roof: [[0.23, 0.979], [0.41, 1.469], [0.55, 1.53], [0.71, 1.469], [0.86, 1.102], [0.88, 1.081]],
    win: [[0.37, 0.56], [0.57, 0.77]], seams: [0.27, 0.565, 0.78], handles: [0.54, 0.75], hood: 0.27, trunk: 0.88,
    top: [{ s0: 0.035, s1: 0.085, a: 0.48, b: 0.9, b1: 0.97, a1: 0.8, c: LED, glow: 1 }, { s0: 0.93, s1: 0.99, a: 0.42, b: 0.92, c: RED, glow: 1 }],
    front(d) {
      d.round(0, 0.62, 0.86, 0.22, BLK, 0.03);
      for (let y = -0.36; y <= 0.36; y += 0.09) for (let z = 0.55; z <= 0.69; z += 0.07) d.diamond(y, z, 0.022, '#59616b');
      d.both(0.64, 0.74, 0.3, 0.09, LED, 0.02);
      d.box(0, 0.32, 1.1, 0.12, BLK, 0.03);
      d.emblem(0, 0.8, 'lab');
    },
    rear(d) { d.both(0.66, 0.94, 0.34, 0.07, RED, 0.02); d.both(0.8, 0.88, 0.06, 0.12, RED, 0.02); d.box(0, 0.92, 0.7, 0.03, BLK); d.box(0, 0.76, 0.5, 0.13, '#f0f2f4', 0.01); d.text('MARMARA', 0.12, 0.84, CRM); },
  },
  liva: {
    name: 'Liva', L: 4.01, W: 1.764, H: 1.483, wb: 2.58, fo: 0.82, r: 0.33, sill: 0.2, crown: 0.07, tumble: 0.76, bowF: 0.2, bowR: 0.08, rim: 'five', smooth: 6,
    features: ['Kısa şehir hatchbacki', 'Yuvarlak halka gündüz farı', 'Küçük bal peteği ağız', 'Yüksek tavan, kısa kuyruk', 'Dikey çubuk stoplar'],
    plan: [[0, 0.72], [0.04, 0.9], [0.14, 0.98], [0.32, 0.96], [0.72, 1], [0.92, 0.96], [1, 0.82]],
    deck: [[0, 0.639], [0.04, 0.824], [0.22, 0.968], [0.3, 1.009], [0.75, 1.051], [0.95, 1.051], [1, 0.742]],
    roof: [[0.215, 0.968], [0.395, 1.421], [0.535, 1.483], [0.835, 1.432], [0.96, 1.112], [0.975, 1.051]],
    win: [[0.36, 0.56], [0.57, 0.78]], seams: [0.27, 0.565, 0.8], handles: [0.54], hood: 0.27, trunk: 0.95, hoodRibs: 1,
    top: [{ s0: 0.045, s1: 0.1, a: 0.56, b: 0.9, c: LED, glow: 1 }, { s0: 0.93, s1: 0.995, a: 0.55, b: 0.93, c: RED, glow: 1 }],
    front(d) {
      d.round(0, 0.56, 0.6, 0.14, BLK, 0.05);
      for (const s of [-1, 1]) { d.circ(s * 0.62, 0.72, 0.13, '#141a20'); d.ring(s * 0.62, 0.72, 0.09, LED); }
      d.box(0, 0.32, 1.1, 0.13, BLK, 0.04);
      d.emblem(0, 0.72, 'lab');
    },
    rear(d) { d.both(0.68, 0.9, 0.1, 0.3, RED, 0.03); d.box(0, 0.5, 1.2, 0.13, BLK, 0.03); d.box(0, 0.68, 0.46, 0.12, '#f0f2f4', 0.01); d.text('LIVA', 0.14, 0.86); },
  },
  granit: {
    name: 'Granit SUV', L: 4.57, W: 1.841, H: 1.642, wb: 2.68, fo: 0.9, r: 0.36, sill: 0.25, crown: 0.05, tumble: 0.8, bowF: 0.14, bowR: 0.08, rim: 'multi', smooth: 5,
    features: ['Kompakt aile SUVsi', 'İki katlı far, ortada kalın yatay bant', 'Çift tonlu tavan, tavan rayı', 'Kalın çamurluk kaplaması', 'Yatay kare stoplar'],
    plan: [[0, 0.8], [0.03, 0.92], [0.12, 0.98], [0.5, 1], [0.92, 0.98], [1, 0.84]],
    deck: [[0, 0.734], [0.03, 0.918], [0.24, 1.081], [0.3, 1.122], [0.8, 1.142], [0.96, 1.122], [1, 0.857]],
    roof: [[0.25, 1.081], [0.41, 1.591], [0.61, 1.642], [0.87, 1.571], [0.975, 1.183], [0.99, 1.122]],
    win: [[0.36, 0.56], [0.57, 0.82]], seams: [0.27, 0.565, 0.82], handles: [0.54, 0.79], hood: 0.27, trunk: 0.95, roofBlack: 1, rails: 1, clad: 0.46,
    top: [{ s0: 0, s1: 0.1, a: 0, b: 0.94, c: '#0d1014' }, { s0: 0.02, s1: 0.07, a: 0.56, b: 0.94, c: LED, glow: 1 }, { s0: 0.96, s1: 0.99, a: 0.4, b: 0.92, c: RED, glow: 1 }],
    front(d) {
      d.both(0.62, 0.9, 0.34, 0.05, LED, 0.02); d.both(0.62, 0.72, 0.26, 0.12, LED, 0.04);
      d.box(0, 0.8, 0.78, 0.16, '#20252c', 0.04); d.box(0, 0.8, 0.72, 0.03, '#8f97a2');
      d.box(0, 0.42, 1.3, 0.16, '#14181e', 0.03);
      d.emblem(0, 0.92, 'lab');
    },
    rear(d) { d.both(0.62, 0.98, 0.34, 0.12, RED, 0.03); d.box(0, 0.98, 0.72, 0.05, '#20252c'); d.box(0, 0.42, 1.2, 0.14, '#14181e', 0.03); d.text('GRANİT', 0.13, 0.8, CRM); },
  },
  bozkir: {
    name: 'Bozkır 4x4', L: 4.427, W: 1.8, H: 1.656, wb: 2.67, fo: 0.84, r: 0.37, sill: 0.34, crown: 0.03, tumble: 0.86, bowF: 0.08, bowR: 0.03, rim: 'hub',
    features: ['Kutu gibi arazi aracı', 'Yuvarlak köşeli büyük far, ağ panel', 'Kalın çamurluk kaplaması', 'Ön ve arka koruma plakası', 'Dikey üçlü stoplar, tavan barları'],
    plan: [[0, 0.84], [0.025, 0.95], [0.1, 0.99], [0.5, 1], [0.95, 0.99], [1, 0.9]],
    deck: [[0, 0.804], [0.03, 0.96], [0.26, 1.078], [0.32, 1.107], [0.82, 1.127], [0.975, 1.098], [1, 0.902]],
    roof: [[0.28, 1.078], [0.42, 1.588], [0.61, 1.627], [0.87, 1.588], [0.975, 1.156], [0.985, 1.107]],
    win: [[0.375, 0.57], [0.58, 0.77], [0.78, 0.89]], seams: [0.29, 0.575, 0.8], handles: [0.555, 0.775], hood: 0.29, trunk: 0.97, rails: 1, clad: 0.6, roofColor: 0,
    top: [{ s0: 0.01, s1: 0.05, a: 0.56, b: 0.94, c: LED, glow: 1 }, { s0: 0.97, s1: 0.995, a: 0.56, b: 0.94, c: RED, glow: 1 }, { s0: 0, s1: 0.014, a: 0, b: 0.5, c: '#b8bec6' }],
    front(d) {
      d.round(0, 0.92, 0.76, 0.24, BLK, 0.04);
      for (let y = -0.3; y <= 0.3; y += 0.1) d.box(y, 0.92, 0.04, 0.16, '#59616b', 0.01);
      for (const s of [-1, 1]) { d.circ(s * 0.66, 0.92, 0.13, '#141a20'); d.circ(s * 0.66, 0.92, 0.095, LED); }
      d.box(0, 0.44, 1.5, 0.22, '#23272e', 0.03); d.box(0, 0.38, 0.9, 0.1, '#c2c8cf', 0.02);
      d.emblem(0, 1.08, 'lab');
    },
    rear(d) { for (const z of [0.9, 1.02, 1.14]) d.both(0.72, z, 0.16, 0.09, RED, 0.01); d.box(0, 0.74, 0.46, 0.13, '#f0f2f4', 0.01); d.box(0, 0.42, 1.5, 0.24, '#23272e', 0.03); d.box(0, 0.38, 0.84, 0.1, '#c2c8cf', 0.02); d.text('BOZKIR', 0.14, 1.0, CRM); },
  },
  bavar: {
    name: 'Bavar sedan', L: 4.804, W: 1.812, H: 1.44, wb: 2.85, fo: 0.79, r: 0.33, sill: 0.17, crown: 0.05, tumble: 0.77, bowF: 0.15, bowR: 0.1, rim: 'star', smooth: 4,
    features: ['Uzun kaputlu sportif sedan', 'Alçak tek parça geniş ağız', 'İnce keskin far', 'Akıcı tavan', 'Yatay ince stoplar'],
    plan: [[0, 0.78], [0.03, 0.92], [0.12, 0.98], [0.5, 1], [0.93, 0.98], [1, 0.86]],
    deck: [[0, 0.58], [0.03, 0.74], [0.3, 0.92], [0.4, 0.96], [0.82, 1], [0.97, 0.99], [1, 0.76]],
    roof: [[0.35, 0.94], [0.5, 1.38], [0.63, 1.44], [0.79, 1.38], [0.91, 1.02], [0.93, 1]],
    win: [[0.44, 0.61], [0.62, 0.8]], seams: [0.33, 0.6, 0.8], handles: [0.57, 0.77], hood: 0.33, trunk: 0.89,
    top: [{ s0: 0.035, s1: 0.085, a: 0.5, b: 0.92, c: LED, glow: 1 }, { s0: 0.955, s1: 0.99, a: 0.45, b: 0.92, c: RED, glow: 1 }, { s0: 0.0, s1: 0.035, a: 0.03, b: 0.3, c: BLK }],
    front(d) {
      d.round(0, 0.46, 1.16, 0.18, BLK, 0.06);
      for (let z = 0.4; z <= 0.52; z += 0.04) d.box(0, z, 1.06, 0.012, '#6a727c');
      d.polyB([[0.34, 0.74], [0.84, 0.76], [0.82, 0.68], [0.38, 0.68]], LED);
      d.emblem(0, 0.68, 'lab');
    },
    rear(d) { d.both(0.6, 0.9, 0.5, 0.06, RED, 0.02); d.box(0, 0.72, 0.5, 0.13, '#f0f2f4', 0.01); d.box(0, 0.32, 1.2, 0.12, BLK, 0.03); d.both(0.5, 0.3, 0.1, 0.08, '#8c949e', 0.04); },
  },
  aurum: {
    name: 'Aurum sedan', L: 4.665, W: 1.84, H: 1.459, wb: 2.82, fo: 0.9, r: 0.33, sill: 0.17, crown: 0.04, tumble: 0.78, bowF: 0.12, bowR: 0.08, rim: 'multi', smooth: 4,
    features: ['Düz omuz çizgili ağır sedan', 'Üstte ince şerit, altta geniş ağ panel', 'Köşeli far', 'Düz bagaj kapağı', 'Çift çubuk stop'],
    plan: [[0, 0.8], [0.025, 0.93], [0.1, 0.99], [0.5, 1], [0.95, 0.99], [1, 0.88]],
    deck: [[0, 0.612], [0.03, 0.775], [0.26, 0.949], [0.34, 0.989], [0.82, 1.051], [0.975, 1.051], [1, 0.816]],
    roof: [[0.25, 0.949], [0.41, 1.408], [0.49, 1.459], [0.69, 1.459], [0.79, 1.346], [0.87, 1.071], [0.885, 1.051]],
    win: [[0.38, 0.57], [0.58, 0.77]], seams: [0.3, 0.58, 0.79], handles: [0.55, 0.75], hood: 0.3, trunk: 0.885,
    top: [{ s0: 0.03, s1: 0.09, a: 0.46, b: 0.94, c: LED, glow: 1 }, { s0: 0.965, s1: 0.992, a: 0, b: 0.93, c: RED, glow: 1 }, { s0: 0, s1: 0.03, a: 0.05, b: 0.42, c: BLK }],
    front(d) {
      d.box(0, 0.74, 0.86, 0.035, CRM, 0.01);
      d.round(0, 0.5, 1.0, 0.24, BLK, 0.03);
      for (let y = -0.42; y <= 0.42; y += 0.12) d.box(y, 0.5, 0.02, 0.2, '#4a515a');
      d.both(0.66, 0.72, 0.32, 0.1, LED, 0.02);
      d.emblem(0, 0.66, 'lab');
    },
    rear(d) { d.both(0.6, 0.96, 0.46, 0.04, RED, 0.01); d.both(0.6, 0.88, 0.46, 0.04, RED, 0.01); d.box(0, 0.74, 0.5, 0.13, '#f0f2f4', 0.01); d.box(0, 0.34, 1.3, 0.1, BLK, 0.03); },
  },
  stella: {
    name: 'Stella sedan', L: 4.69, W: 1.784, H: 1.479, wb: 2.84, fo: 0.81, r: 0.33, sill: 0.17, crown: 0.06, tumble: 0.76, bowF: 0.18, bowR: 0.12, rim: 'five', smooth: 6,
    features: ['Yumuşak kavisli konfor sedanı', 'Dalga çizgili alçak panel', 'Kısa oval far', 'Yuvarlak bagaj', 'Yuvarlak köşeli stop'],
    plan: [[0, 0.76], [0.03, 0.9], [0.12, 0.98], [0.5, 1], [0.92, 0.97], [1, 0.82]],
    deck: [[0, 0.612], [0.03, 0.775], [0.28, 0.949], [0.38, 0.989], [0.8, 1.04], [0.96, 1.02], [1, 0.796]],
    roof: [[0.28, 0.949], [0.42, 1.387], [0.54, 1.479], [0.66, 1.469], [0.78, 1.346], [0.9, 1.061], [0.92, 1.04]],
    win: [[0.4, 0.59], [0.6, 0.79]], seams: [0.31, 0.6, 0.8], handles: [0.57, 0.77], hood: 0.31, trunk: 0.9,
    top: [{ s0: 0.04, s1: 0.11, a: 0.5, b: 0.86, b1: 0.95, a1: 0.8, c: LED, glow: 1 }, { s0: 0.95, s1: 0.99, a: 0.45, b: 0.9, c: RED, glow: 1 }, { s0: 0, s1: 0.035, a: 0.03, b: 0.4, c: CRM }],
    front(d) {
      d.round(0, 0.56, 0.9, 0.2, '#14171c', 0.08);
      for (const z of [0.52, 0.58]) d.polyLine([[-0.36, z], [-0.18, z + 0.03], [0, z], [0.18, z + 0.03], [0.36, z]], CRM, 0.014);
      d.both(0.66, 0.74, 0.3, 0.1, LED, 0.05);
      d.box(0, 0.3, 1.2, 0.11, BLK, 0.03);
      d.emblem(0, 0.72, 'lab');
    },
    rear(d) { d.both(0.62, 0.9, 0.42, 0.1, RED, 0.05); d.box(0, 0.72, 0.5, 0.13, '#f0f2f4', 0.01); },
  },
  volta: {
    name: 'Volta hatchback', L: 4.194, W: 1.808, H: 1.479, wb: 2.62, fo: 0.87, r: 0.32, sill: 0.17, crown: 0.04, tumble: 0.8, bowF: 0.1, bowR: 0.05, rim: 'multi', smooth: 3,
    features: ['Aile hatchbacki', 'Kısa kare ağ panel', 'Ayrık köşeli far', 'Kısa kuyruk, dik arka cam', 'Köşeli çift stop'],
    plan: [[0, 0.82], [0.025, 0.94], [0.1, 0.99], [0.5, 1], [0.94, 0.99], [1, 0.9]],
    deck: [[0, 0.632], [0.03, 0.816], [0.26, 0.989], [0.32, 1.02], [0.8, 1.061], [0.97, 1.071], [1, 0.836]],
    roof: [[0.25, 0.989], [0.4, 1.428], [0.57, 1.479], [0.86, 1.428], [0.955, 1.122], [0.97, 1.071]],
    win: [[0.38, 0.58], [0.59, 0.72]], seams: [0.3, 0.585, 0.8], handles: [0.56, 0.72], hood: 0.3, trunk: 0.96,
    top: [{ s0: 0.025, s1: 0.08, a: 0.48, b: 0.94, c: LED, glow: 1 }, { s0: 0.96, s1: 0.992, a: 0.5, b: 0.94, c: RED, glow: 1 }],
    front(d) {
      d.round(0, 0.62, 0.7, 0.16, BLK, 0.03);
      for (let y = -0.28; y <= 0.28; y += 0.07) d.box(y, 0.62, 0.012, 0.13, '#59616b');
      d.both(0.6, 0.72, 0.28, 0.11, LED, 0.03);
      d.box(0, 0.38, 1.1, 0.15, BLK, 0.03);
      d.emblem(0, 0.78, 'lab');
    },
    rear(d) { d.both(0.66, 0.98, 0.26, 0.12, RED, 0.03); d.both(0.66, 0.86, 0.26, 0.05, AMB, 0.02); d.box(0, 0.74, 0.46, 0.12, '#f0f2f4', 0.01); d.box(0, 0.34, 1.2, 0.1, BLK, 0.03); },
  },
  pusula: {
    name: 'Pusula hatchback', L: 4.468, W: 1.812, H: 1.455, wb: 2.7, fo: 0.87, r: 0.33, sill: 0.17, crown: 0.05, tumble: 0.78, bowF: 0.14, bowR: 0.08, rim: 'five', smooth: 5,
    features: ['Eğik tavanlı hatchback', 'Üçgen yan girişli alt panel', 'Dar yukarı bakan far', 'Çatı spoyleri', 'Bir bütün yatay stop'],
    plan: [[0, 0.76], [0.03, 0.9], [0.12, 0.98], [0.5, 1], [0.93, 0.98], [1, 0.84]],
    deck: [[0, 0.614], [0.03, 0.812], [0.24, 0.96], [0.3, 0.99], [0.8, 1.049], [0.965, 1.049], [1, 0.792]],
    roof: [[0.25, 0.96], [0.42, 1.406], [0.57, 1.455], [0.86, 1.376], [0.97, 1.089], [0.985, 1.049]],
    win: [[0.37, 0.57], [0.58, 0.75]], seams: [0.29, 0.575, 0.79], handles: [0.55, 0.74], hood: 0.29, trunk: 0.955, roofSpoiler: 1,
    top: [{ s0: 0.035, s1: 0.085, a: 0.5, b: 0.9, b1: 0.97, a1: 0.84, c: LED, glow: 1 }, { s0: 0.955, s1: 0.992, a: 0.52, b: 0.92, c: RED, glow: 1 }],
    front(d) {
      d.round(0, 0.46, 0.72, 0.18, BLK, 0.04);
      d.both(0.72, 0.44, 0.14, 0.12, '#14181e', 0.02);
      d.polyB([[0.46, 0.78], [0.86, 0.84], [0.84, 0.76], [0.5, 0.72]], LED);
      d.emblem(0, 0.7, 'lab');
    },
    rear(d) { d.box(0, 1.0, 1.3, 0.09, RED, 0.03); d.box(0, 0.74, 0.46, 0.12, '#f0f2f4', 0.01); d.box(0, 0.34, 1.3, 0.12, BLK, 0.03); },
  },
  dalga: {
    name: 'Dalga sedan', L: 4.59, W: 1.8, H: 1.421, wb: 2.67, fo: 0.87, r: 0.32, sill: 0.17, crown: 0.05, tumble: 0.78, bowF: 0.15, bowR: 0.08, rim: 'turbine', smooth: 5,
    features: ['Alçak akıcı sedan', 'Yatay çift bant panel', 'Yuvarlak uçlu far', 'C direğine akan tavan', 'Ortası ayrık stop'],
    plan: [[0, 0.8], [0.03, 0.92], [0.12, 0.98], [0.5, 1], [0.93, 0.98], [1, 0.86]],
    deck: [[0, 0.588], [0.03, 0.784], [0.26, 0.931], [0.34, 0.96], [0.8, 1.019], [0.97, 1.009], [1, 0.784]],
    roof: [[0.27, 0.931], [0.44, 1.362], [0.57, 1.421], [0.73, 1.343], [0.89, 1.039], [0.91, 1.019]],
    win: [[0.38, 0.56], [0.57, 0.77]], seams: [0.3, 0.57, 0.79], handles: [0.54, 0.74], hood: 0.3, trunk: 0.89,
    top: [{ s0: 0.035, s1: 0.085, a: 0.52, b: 0.93, c: LED, glow: 1 }, { s0: 0.965, s1: 0.992, a: 0, b: 0.92, c: RED, glow: 1 }],
    front(d) {
      d.round(0, 0.6, 1.0, 0.1, BLK, 0.04); d.round(0, 0.44, 0.8, 0.1, BLK, 0.04);
      d.both(0.68, 0.76, 0.3, 0.07, LED, 0.03);
      d.emblem(0, 0.6, 'lab');
    },
    rear(d) { d.both(0.56, 0.96, 0.54, 0.05, RED, 0.02); d.box(0, 0.74, 0.46, 0.12, '#f0f2f4', 0.01); d.box(0, 0.34, 1.3, 0.1, BLK, 0.03); },
  },
  lale: {
    name: 'Lale sedan', L: 4.537, W: 1.792, H: 1.489, wb: 2.71, fo: 0.9, r: 0.32, sill: 0.17, crown: 0.05, tumble: 0.78, bowF: 0.16, bowR: 0.09, rim: 'five', smooth: 5,
    features: ['Bombeli omuzlu aile sedanı', 'İnce üst çizgi, küçük orta ağ', 'Köşesi kesik far', 'Yüksek kısa bagaj', 'Uzun yatay stop'],
    plan: [[0, 0.76], [0.03, 0.9], [0.12, 0.98], [0.5, 1], [0.93, 0.98], [1, 0.85]],
    deck: [[0, 0.612], [0.03, 0.816], [0.26, 0.979], [0.32, 1.02], [0.78, 1.071], [0.965, 1.071], [1, 0.816]],
    roof: [[0.25, 0.979], [0.41, 1.428], [0.55, 1.489], [0.71, 1.428], [0.86, 1.091], [0.88, 1.071]],
    win: [[0.38, 0.56], [0.57, 0.76]], seams: [0.29, 0.57, 0.78], handles: [0.54, 0.74], hood: 0.29, trunk: 0.885,
    top: [{ s0: 0.035, s1: 0.085, a: 0.5, b: 0.91, c: LED, glow: 1 }, { s0: 0.95, s1: 0.99, a: 0.44, b: 0.92, c: RED, glow: 1 }],
    front(d) {
      d.box(0, 0.72, 0.8, 0.02, CRM, 0.01);
      d.round(0, 0.6, 0.5, 0.14, BLK, 0.03);
      d.polyB([[0.44, 0.78], [0.84, 0.76], [0.82, 0.66], [0.52, 0.66]], LED);
      d.box(0, 0.34, 1.2, 0.12, BLK, 0.03);
      d.emblem(0, 0.6, 'lab');
    },
    rear(d) { d.both(0.58, 0.96, 0.5, 0.08, RED, 0.02); d.box(0, 0.74, 0.5, 0.13, '#f0f2f4', 0.01); },
  },
  vadi: {
    name: 'Vadi sedan', L: 4.651, W: 1.765, H: 1.49, wb: 2.6, fo: 0.92, r: 0.3, sill: 0.19, crown: 0.05, tumble: 0.8, bowF: 0.14, bowR: 0.08, rim: 'steel', smooth: 4,
    features: ['Dar yüksek sade sedan', 'Damla olmayan yuvarlak köşeli far', 'Üç yatay ince yarık', 'Uzun arka çıkıntı', 'Kare yüksek stop'],
    plan: [[0, 0.76], [0.03, 0.9], [0.12, 0.98], [0.5, 1], [0.93, 0.98], [1, 0.86]],
    deck: [[0, 0.62], [0.03, 0.8], [0.27, 0.96], [0.33, 1], [0.75, 1.04], [0.97, 1.03], [1, 0.82]],
    roof: [[0.28, 0.96], [0.44, 1.42], [0.57, 1.49], [0.72, 1.42], [0.86, 1.06], [0.88, 1.04]],
    win: [[0.39, 0.56], [0.57, 0.75]], seams: [0.3, 0.57, 0.77], handles: [0.54, 0.73], hood: 0.3, trunk: 0.865,
    top: [{ s0: 0.035, s1: 0.085, a: 0.5, b: 0.9, c: '#fff5c4', glow: 1 }, { s0: 0.95, s1: 0.99, a: 0.5, b: 0.94, c: RED, glow: 1 }],
    front(d) {
      d.both(0.6, 0.72, 0.34, 0.12, '#fff5c4', 0.05);
      for (const z of [0.66, 0.7, 0.74]) d.box(0, z, 0.56, 0.015, BLK);
      d.box(0, 0.36, 1.0, 0.1, BLK, 0.03);
      d.emblem(0, 0.8, 'lab');
    },
    rear(d) { d.both(0.64, 0.96, 0.26, 0.16, RED, 0.04); d.box(0, 0.74, 0.46, 0.12, '#f0f2f4', 0.01); },
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
      d.emblem(0, 0.94, 'lab', 0.1);
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
    front(d) { d.box(0, 0.92, 1.1, 0.2, BLK, 0.03); d.both(0.74, 0.98, 0.34, 0.24, LED, 0.03); d.box(0, 0.52, 1.7, 0.2, '#30353c', 0.03); d.emblem(0, 0.92, 'lab'); },
    rear(d) { d.both(0.86, 1.3, 0.12, 0.5, RED, 0.02); d.box(0, 1.8, 1.4, 0.7, '#0f1a22', 0.03); d.box(0, 1.4, 0.012, 1.8, '#5a6068'); },
  },
  bus: {
    name: 'Şehir otobüsü', L: 12, W: 2.55, H: 3.1, wb: 5.9, fo: 2.7, r: 0.5, sill: 0.34, crown: 0.05, tumble: 0.94, bowF: 0.12, bowR: 0.05, rim: 'steel', tall: 1, flatFront: 1,
    features: ['12 metre alçak tabanlı şehir otobüsü', 'Tek parça dev ön cam, üstte hat göstergesi', 'Üç çift kapı, uzun bant camlar', 'Tavanda klima kutuları', 'Şehir hattı renkleri, numara panosu'],
    plan: [[0, 0.93], [0.012, 0.99], [0.03, 1], [1, 0.97]],
    deck: [[0, 0.72], [0.015, 1.1], [0.05, 1.18], [0.98, 1.2], [1, 1.0]],
    roof: [[0.008, 1.1], [0.024, 2.9], [0.05, 3.08], [0.975, 3.08], [1, 1.2]],
    win: [[0.04, 0.07], [0.12, 0.3], [0.31, 0.46], [0.53, 0.7], [0.71, 0.86], [0.87, 0.96]], seams: [0.07, 0.12, 0.46, 0.53, 0.86], handles: [], hood: 2, trunk: 2,
    band: { z: 0.92, h: 0.16, c: '#ffffff' }, roofPods: 2, doors: [[0.07, 0.12], [0.46, 0.53]],
    top: [{ s0: 0.008, s1: 0.025, a: 0.5, b: 0.94, c: LED, glow: 1 }, { s0: 0.99, s1: 0.999, a: 0.7, b: 0.94, c: RED, glow: 1 }],
    front(d) { d.box(0, 3.02, 1.8, 0.2, '#101214', 0.02); d.text('12 MERKEZ', 0.15, 3.02, '#ffa726'); d.both(0.95, 0.7, 0.34, 0.14, LED, 0.03); d.box(0, 0.4, 2.2, 0.2, '#30353c', 0.03); },
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
    front(d) { d.box(0, 1.3, 1.6, 0.5, BLK, 0.03); for (let z = 1.1; z < 1.52; z += 0.08) d.box(0, z, 1.56, 0.03, '#59616b'); d.both(1.0, 0.9, 0.3, 0.2, LED, 0.04); d.box(0, 0.74, 2.3, 0.3, '#30353c', 0.03); d.emblem(0, 1.3, 'lab', 0.12); },
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
    // Drift Lab rozeti: altıgen içinde deney şişesi çizgisi
    emblem(y, z, kind, r = 0.055) {
      const q = r * k;
      g.save(); g.translate(X(y), Y(z)); g.strokeStyle = '#eef2f6'; g.lineWidth = q * 0.2; g.lineJoin = 'round';
      g.beginPath();
      for (let i = 0; i < 6; i++) { const a = 0.5236 + (i * Math.PI) / 3; g[i ? 'lineTo' : 'moveTo'](Math.cos(a) * q * 1.15, Math.sin(a) * q * 1.15); }
      g.closePath(); g.stroke();
      g.beginPath(); g.moveTo(-q * 0.2, -q * 0.6); g.lineTo(-q * 0.2, -q * 0.1); g.lineTo(-q * 0.55, q * 0.5); g.lineTo(q * 0.55, q * 0.5); g.lineTo(q * 0.2, -q * 0.1); g.lineTo(q * 0.2, -q * 0.6); g.stroke();
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
  g.strokeStyle = '#26282d'; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 113, 0, 7); g.stroke();
  const rimC = premium ? '#eef2f6' : '#b9c2cc';
  const deep = g.createRadialGradient(0, 0, 20, 0, 0, 96);
  deep.addColorStop(0, '#34383f'); deep.addColorStop(1, '#0e1014');
  g.fillStyle = deep; g.beginPath(); g.arc(0, 0, 96, 0, 7); g.fill();
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
  g.fillStyle = '#9aa3ad';
  for (let i = 0; i < 5; i++) { const a = (i / 5) * 6.283 + 0.3; g.beginPath(); g.arc(Math.cos(a) * 20, Math.sin(a) * 20, 3.4, 0, 7); g.fill(); }
  g.strokeStyle = premium ? '#ffffff' : '#dfe4e9'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 99, 0, 7); g.stroke();
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

function addBox(THREE, group, sx, sy, sz, x, y, z, mat) {
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
  addBox(THREE, group, L * 0.92, 0.1, W * 0.86, L / 2, sill + 0.02, 0, darkMat);

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
      addBox(THREE, group, d, h, halfW(0) * 2 * 1.02, -0.01 + (m.bowF || 0) * 0.5, z, 0, bm);
      for (const sg of [1, -1]) addBox(THREE, group, 0.3, h, 0.05, 0.14 + (m.bowF || 0) * 0.5, z, sg * halfW(0.05) * 0.99, bm);
    }
    addBox(THREE, group, d, h, halfW(1) * 2 * 1.02, L + 0.01 - (m.bowR || 0) * 0.5, z, 0, bm);
    for (const sg of [1, -1]) addBox(THREE, group, 0.3, h, 0.05, L - 0.14 - (m.bowR || 0) * 0.5, z, sg * halfW(0.95) * 0.99, bm);
  }
  if (m.wing) {
    const w = m.wing;
    const am = new THREE.MeshPhysicalMaterial({ color: accent, ...FINISH.gloss });
    addBox(THREE, group, w.chord, 0.05, w.span, w.s * L - 0.03, w.z, 0, am);
    for (const sg of [1, -1]) {
      addBox(THREE, group, w.chord * 0.9, 0.15, 0.04, w.s * L - 0.03, w.z + 0.04, sg * (w.span / 2), am);
      addBox(THREE, group, 0.1, w.z - deckF(w.s), 0.05, w.s * L - 0.03, (w.z + deckF(w.s)) / 2, sg * 0.46, plastic);
    }
  }
  if (m.rails) {
    const a = (m.win[0][0] + 0.09) * L;
    const b = (m.win[m.win.length - 1][1] - 0.03) * L;
    for (const sg of [1, -1]) addBox(THREE, group, b - a, 0.04, 0.05, (a + b) / 2, roofF((a + b) / 2 / L) + 0.05, sg * (W / 2) * m.tumble * 0.86, chromeMat);
  }
  if (m.roofSpoiler) addBox(THREE, group, 0.34, 0.05, W * 0.74, (m.roof[m.roof.length - 2][0] - 0.1) * L, roofF(m.roof[m.roof.length - 2][0] - 0.1) + 0.02, 0, plastic);
  if (paint.premium && paint.sprite) {
    const roofA = m.win[0][0] + 0.06; const roofB = m.win[m.win.length - 1][1] - 0.08;
    if (!m.roofBlack && !paint.roof) patch(roofA + 0.03, roofA + 0.16, 0, 0.52, 0, 0.52, '#0b1016', 0);
    patch(0.08, Math.max(0.1, m.hood - 0.03), 0.56, 0.62, 0.5, 0.56, '#' + new THREE.Color(paint.color).lerp(new THREE.Color('#ffffff'), 0.5).getHexString(), 0);
    patch(roofB - 0.14, roofB, 0.6, 0.66, 0.6, 0.66, '#' + new THREE.Color(paint.color).lerp(new THREE.Color('#ffffff'), 0.35).getHexString(), 0);
  }
  if (m.chromeBelt || paint.premium) {
    const a = m.win[0][0]; const bd = m.win[m.win.length - 1][1];
    for (let i = 0; i < 20; i++) {
      const s = a + ((bd - a) * (i + 0.5)) / 20;
      for (const sg of [1, -1]) addBox(THREE, group, ((bd - a) * L) / 20 + 0.02, 0.025, 0.02, s * L, deckF(s) + 0.05, sg * (beltY(s) + 0.012), chromeMat);
    }
  }
  if (m.roofPods) for (const k of [0.3, 0.62]) addBox(THREE, group, 2.2, 0.26, W * 0.62, k * L, H + 0.06, 0, new THREE.MeshStandardMaterial({ color: '#dfe3e7', roughness: 0.5 }));
  if (m.wind) { const w = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.42, W * 0.86), new THREE.MeshStandardMaterial({ color: paint.accent || '#dfe3e7', roughness: 0.4 })); w.position.set(0.18 * L, roofF(0.12) + 0.26, 0); w.rotation.z = 0.2; group.add(w); }
  if (m.cargo) {
    const q = m.cargo;
    const tarp = new THREE.MeshStandardMaterial({ map: tarpTexture(THREE, paint.accent || '#2a6db0', 'NAKLİYAT'), roughness: 0.7 });
    const x0 = q.s0 * L; const x1 = q.s1 * L;
    addBox(THREE, group, x1 - x0, q.z1 - q.z0, W * 0.98, (x0 + x1) / 2, (q.z0 + q.z1) / 2, 0, tarp);
    addBox(THREE, group, x1 - x0, 0.14, W, (x0 + x1) / 2, q.z0 - 0.04, 0, plastic);
    for (const s of [0.74]) for (const sg of [1, -1]) addWheel(THREE, group, s * L, sg * (wy - tw - 0.04), m.r, tw, tex, tyreMat);
  }
  if (m.doors) {
    for (const [a, b] of m.doors) for (const sg of [1, -1]) addBox(THREE, group, (b - a) * L, 2.2, 0.03, ((a + b) / 2) * L, 1.6, sg * (W / 2 + 0.002), glassMat);
  }
  const sign = paint.sign || (m.roofSign && m.roofSign);
  if (sign) {
    const t = fascia(THREE, 1.4, 0.3, (d) => { d.box(0, 0.15, 1.4, 0.3, sign.c || '#ffd23f'); d.text(sign.text, 0.26, 0.14, '#111'); }, 256);
    const mat = new THREE.MeshStandardMaterial({ map: t, emissive: '#555', emissiveMap: t, roughness: 0.4 });
    addBox(THREE, group, 0.34, 0.2, 0.74, 0.52 * L, roofF(0.52) + 0.14, 0, mat);
  }
  if (paint.police) {
    const bar = roofF(0.52) + 0.1;
    addBox(THREE, group, 0.26, 0.09, 1.1, 0.5 * L, bar, 0, plastic);
    for (const [sg, c] of [[1, '#ff2030'], [-1, '#2060ff']]) addBox(THREE, group, 0.24, 0.1, 0.42, 0.5 * L, bar + 0.02, sg * 0.3, new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 1 }));
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
      const u = rear ? 0.5 - y / Wc : 0.5 + y / Wc;
      const v = z / H;
      vert(panel, `${i}_${j}`, xb, y, z, u, v);
    }
    if (i) { const a = (i - 1) * 2; if (rear) quad(panel, a, a + 2, a + 3, a + 1); else quad(panel, a, a + 1, a + 3, a + 2); }
  }
  const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.04, roughness: 0.32, metalness: 0.15, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.16 });
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
  const ao = g.createLinearGradient(0, Y(belt * 0.62), 0, Y(0.1));
  ao.addColorStop(0, 'rgba(0,0,0,0)'); ao.addColorStop(1, 'rgba(0,0,0,.42)');
  g.fillStyle = ao; g.fillRect(0, Y(belt * 0.62), 1024, 256);
  // Omuz kırımı: üstü aydınlık, altı gölge
  g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(0, Y(belt - 0.1), 1024, 5);
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
  const tyre = (x) => { const t = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.055, 12, 30), dark); t.position.set(x, 0.325, 0); g.add(t); for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.03, 0.03), chrome); sp.position.set(x, 0.325, 0); sp.rotation.z = (i / 5) * Math.PI; g.add(sp); } const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12), chrome); hub.rotation.x = Math.PI / 2; hub.position.set(x, 0.325, 0); g.add(hub); };
  tyre(0.32); tyre(1.78);
  ell(0.3, 0.13, 0.13, 0.86, 0.9, 0, pm); // Depo
  ell(0.24, 0.14, 0.11, 0.38, 0.88, 0, pm); // Kaporta
  const shield = ell(0.04, 0.16, 0.09, 0.24, 1.04, 0, new THREE.MeshPhysicalMaterial({ color: '#10161d', metalness: 0.4, roughness: 0.08, clearcoat: 1 })); shield.rotation.z = 0.5;
  ell(0.42, 0.06, 0.09, 0.82, 0.68, 0, acc); // Kaporta altı
  for (const [a, b, c2, d] of [[0.45, 0.8, 1.2, 0.8], [0.45, 0.72, 1.2, 0.52], [0.9, 0.5, 1.5, 0.84]]) { const fr = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, Math.hypot(c2 - a, d - b), 6), chrome); fr.position.set((a + c2) / 2, (b + d) / 2, 0); fr.rotation.z = Math.atan2(d - b, c2 - a) - Math.PI / 2; g.add(fr); }
  ell(0.4, 0.09, 0.13, 1.34, 0.86, 0, dark); // Sele
  const tail = ell(0.3, 0.07, 0.1, 1.68, 0.96, 0, pm); tail.rotation.z = -0.3;
  ell(0.2, 0.14, 0.11, 0.95, 0.5, 0, dark); // Motor
  ell(0.26, 0.05, 0.05, 1.5, 0.48, 0.17, chrome); // Egzoz
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.74, 8), chrome); bar.rotation.x = Math.PI / 2; bar.position.set(0.5, 1.06, 0); g.add(bar);
  const fork = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.78, 8), chrome); fork.rotation.z = -0.3; fork.position.set(0.4, 0.72, 0); g.add(fork);
  for (const s of [1, -1]) ell(0.04, 0.03, 0.06, 0.48, 1.16, s * 0.3, dark);
  ell(0.06, 0.05, 0.06, 0.08, 0.86, 0, new THREE.MeshStandardMaterial({ color: '#fff6c9', emissive: '#fff6c9', emissiveIntensity: 1 }));
  ell(0.03, 0.03, 0.08, 1.96, 0.98, 0, new THREE.MeshStandardMaterial({ color: '#ff2733', emissive: '#ff2733', emissiveIntensity: 1 }));
  // Sürücü
  const suit = new THREE.MeshStandardMaterial({ color: '#1b1e24', roughness: 0.6 });
  const torso = ell(0.13, 0.28, 0.15, 1.06, 1.16, 0, suit); torso.rotation.z = 0.95;
  ell(0.115, 0.115, 0.115, 0.78, 1.36, 0, pm);
  ell(0.06, 0.06, 0.09, 0.69, 1.36, 0, new THREE.MeshStandardMaterial({ color: '#0a0f14', metalness: 0.8, roughness: 0.1 }));
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
    this.angle = 0.62;
    this.spin = 0.2;
    this.drag = null;
    this.yShift = 0;
    this.fps = { t: 0, n: 0, slow: 0 };
    this.pull = 0; // 0 normal, 1 araba tamamen uzakta
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
      c.addColorStop(0, '#07051f'); c.addColorStop(0.42, '#190a48'); c.addColorStop(0.68, '#5a1272'); c.addColorStop(0.84, '#d11a86'); c.addColorStop(0.94, '#ff5a9a'); c.addColorStop(1, '#ffa07a');
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
      c.addColorStop(0, 'rgba(255,160,70,.16)'); c.addColorStop(1, 'rgba(255,120,40,0)');
      g.fillStyle = c; g.fillRect(0, 0, w, w);
    });
    const glow = new T.Mesh(new T.PlaneGeometry(10, 10), new T.MeshBasicMaterial({ map: glowT, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
    glow.rotation.x = -Math.PI / 2; glow.position.y = 0.04;
    scene.add(glow);

    // Işıklar
    scene.add(new T.HemisphereLight('#ffc9a0', '#20204a', 0.5));
    const key = new T.DirectionalLight('#ffe6f4', 2.2);
    key.position.set(4, 7, 6);
    scene.add(key);
    const rim = new T.DirectionalLight('#21e6ff', 3.4);
    rim.position.set(-6, 4, -6);
    scene.add(rim);
    const rim2 = new T.DirectionalLight('#ff2fa0', 2.8);
    rim2.position.set(7, 2, -3);
    scene.add(rim2);
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

    // Drift izi: zeminde arka tekerlekten kıvrılan iki neon yay
    const skidT = tex(T, 1024, 1024, (g, w, h) => {
      g.clearRect(0, 0, w, h);
      g.lineCap = 'round';
      for (const [o, c] of [[0, '#21e6ff'], [58, '#ff2fa0']]) {
        for (const [lw, a] of [[30, 0.18], [9, 0.95]]) {
          g.strokeStyle = c; g.globalAlpha = a; g.lineWidth = lw;
          g.beginPath(); g.moveTo(60, 860 + o); g.bezierCurveTo(250, 980 + o, 540, 900 + o, 640, 590 + o * 0.5); g.stroke();
        }
      }
    });
    this.skid = new T.Mesh(new T.PlaneGeometry(15, 15), new T.MeshBasicMaterial({ map: skidT, transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0.9 }));
    this.skid.rotation.x = -Math.PI / 2;
    this.skid.position.set(-1.6, 0.035, 0.6);
    scene.add(this.skid);

    // Yanal duman: arka tekerlekten süzülen küçük bulutlar
    const puffT = tex(T, 128, 128, (g, w) => {
      const c = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      c.addColorStop(0, 'rgba(255,255,255,.55)'); c.addColorStop(0.5, 'rgba(255,255,255,.18)'); c.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = c; g.fillRect(0, 0, w, w);
    });
    this.puffs = [];
    for (let i = 0; i < 14; i++) {
      const sp = new T.Sprite(new T.SpriteMaterial({ map: puffT, color: ['#ff6ac0', '#6fe9ff', '#f2f4ff'][i % 3], transparent: true, depthWrite: false, opacity: 0 }));
      scene.add(sp);
      this.puffs.push({ sp, life: i / 14 });
    }

    // Temas gölgesi ve neon taban ışığı
    const blob = (inner, outer) => tex(T, 256, 256, (g, w) => {
      const c = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      c.addColorStop(0, inner); c.addColorStop(0.55, inner); c.addColorStop(1, outer);
      g.fillStyle = c; g.fillRect(0, 0, w, w);
    });
    const shadow = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: blob('rgba(0,0,0,.92)', 'rgba(0,0,0,0)'), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.045; shadow.scale.set(6.2, 3.3, 1);
    this.neonA = new T.Mesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: blob('rgba(255,255,255,.75)', 'rgba(255,255,255,0)'), transparent: true, blending: T.AdditiveBlending, depthWrite: false, color: '#21d4fd' }));
    this.neonA.rotation.x = -Math.PI / 2; this.neonA.position.y = 0.05; this.neonA.scale.set(7.2, 3.9, 1);
    this.shadow = shadow;
    this.turn = new T.Group();
    scene.add(this.turn);
    this.turn.add(this.neonA, shadow);
    this.body = new T.Group();
    this.turn.add(this.body);
    this.flareMap = tex(T, 128, 128, (g, w) => {
      const c = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
      c.addColorStop(0, 'rgba(255,255,255,1)'); c.addColorStop(0.18, 'rgba(225,245,255,.75)'); c.addColorStop(1, 'rgba(160,210,255,0)');
      g.fillStyle = c; g.fillRect(0, 0, w, w);
    });
  }

  // shape: model, paint: boya
  setCar(shape, paint) {
    const key = `${shape}|${paint.color}|${paint.finish}|${paint.roof || ''}|${paint.accent || ''}`;
    if (key === this.carKey || !this.ok) return;
    this.carKey = key;
    const { T, body: turn } = this;
    while (turn.children.length) {
      const o = turn.children.pop();
      o.traverse((m) => { if (m.geometry) m.geometry.dispose(); if (m.material) { if (m.material.map) m.material.map.dispose(); m.material.dispose(); } });
    }
    const car = buildCar(T, shape, { ...paint, premium: 1, caliper: '#ff3a2a' });
    const { L, W } = car.userData;
    const k = 4.6 / Math.max(L, 2.4);
    const pivot = new T.Group();
    car.position.x = -L / 2;
    pivot.add(car);
    // Yanan farlar: burun tarafında parlayan iki nokta
    if (shape !== 'moto') {
      for (const s of [-1, 1]) {
        const f = new T.Sprite(new T.SpriteMaterial({ map: this.flareMap, color: '#eaf6ff', transparent: true, blending: T.AdditiveBlending, depthWrite: false, opacity: 0.7 }));
        f.position.set(-L / 2 - 0.02, 0.72, s * W * 0.36);
        f.scale.setScalar(0.4);
        f.userData.flare = true;
        pivot.add(f);
      }
    }
    pivot.scale.setScalar(shape === 'moto' ? 1.5 : k);
    turn.add(pivot);
    // Yerde yansıma: ters çevrilmiş kopya
    const mirror = pivot.clone();
    mirror.traverse((o) => { if (o.userData.flare) o.visible = false; });
    mirror.scale.y *= -1;
    mirror.position.y = -0.01;
    turn.add(mirror);
  }

  // Seçili aracın rengine yakın neon: çok koyu boyada camgöbeği kalır
  setGlow(color) {
    if (!this.ok) return;
    const c = new this.T.Color(color);
    const hsl = {};
    c.getHSL(hsl);
    if (hsl.s < 0.25 || hsl.l < 0.16) this.neonHue = 0.52;
    else this.neonHue = hsl.h;
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
    // Hafif süspansiyon sallanması ve nabız gibi neon
    this.body.position.y = 0.016 * Math.sin(t * 1.7);
    this.body.rotation.x = 0.006 * Math.sin(t * 1.3);
    this.body.rotation.z = 0.005 * Math.sin(t * 1.1 + 1);
    this.neonA.material.opacity = 0.8 + 0.2 * Math.sin(t * 2.4);
    this.neonA.material.color.setHSL(((this.neonHue ?? 0.52) + 0.04 * Math.sin(t * 0.5) + 1) % 1, 0.95, 0.58);

    const asp = this.cam.aspect;
    const portrait = asp < 1;
    const garage = this.mode === 'garage';
    // Araç genişliğe sığsın: kamera uzaklığı en boy oranından gelir
    const dist = Math.max(11, 11 / asp) * (garage ? 0.92 : 1);
    // Dikeyde dev başlığın altında, yatayda sol alttaki boşlukta durur
    const lift = portrait ? (garage ? -1.75 : 0.1) : (garage ? 0 : 1.25);
    const lateral = !portrait ? (garage ? 2.2 : 2.7) : 0;
    const orbit = Math.sin(t * 0.14) * 0.07;
    const ease = Math.min(1, dt * 3);
    this.cx = this.cx === undefined ? dist : this.cx + (dist - this.cx) * ease;
    this.cl = this.cl === undefined ? lift : this.cl + (lift - this.cl) * ease;
    this.ct = this.ct === undefined ? lateral : this.ct + (lateral - this.ct) * ease;
    // Geçiş: kamera hızla geri çekilip yükselir, araç noktaya dönüşür
    const P = this.pull;
    const back = 1 + P * P * 0.5;
    this.cam.position.set(Math.sin(orbit) * this.cx * back + this.ct, 2.5 + P * P * 1.2, Math.cos(orbit) * this.cx * back);
    this.cam.lookAt(this.ct, 1.0 + this.cl, 0);
    // Araç kadrajda noktaya iner; zemindeki iz ve duman onunla söner
    this.turn.scale.setScalar(Math.max(0.04, 1 - P * 0.96));
    this.skid.material.opacity = 0.9 * (1 - P);
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
    // Duman: dünya koordinatında sola süzülür, seçili açıya bağlı kalmaz
    for (const f of this.puffs) {
      f.life += dt * 0.42;
      if (f.life >= 1) f.life -= 1;
      const u = f.life;
      f.sp.position.set(-1.9 - u * 4.8, 0.3 + u * 1.5, 1 - u * 1.8 + Math.sin(f.life * 17) * 0.3);
      f.sp.scale.setScalar(0.7 + u * 3.3);
      f.sp.material.opacity = Math.min(1, u * 7) * (1 - u) * 0.62 * (1 - this.pull);
    }

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

// Her tabela rengine özel yumuşak ışık: önbellekli
const haloCache = new Map();
function signHalo(color) {
  let c = haloCache.get(color);
  if (c) return c;
  c = document.createElement('canvas');
  c.width = 64; c.height = 64;
  const g = c.getContext('2d');
  const gr = g.createRadialGradient(32, 32, 2, 32, 32, 32);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,.4)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = shade(color, 0.4); g.fillRect(0, 0, 64, 64);
  haloCache.set(color, c);
  return c;
}

// Tabela görüntüsü binada saklanır: her karede anahtar metni üretilmez
function rectSign(r) {
  return r.signImg || (r.signImg = landmarkSign(r) || signCanvas(r.sign, r.signColor, r.seed));
}

// Tabela boyutu: 0 minicik, 1 normal, 2 büyük, 3 dev çatı yazısı
const signOut = { x: 0, y: 0, w: 0, h: 0 };
const CHUNK_FIT = (CHUNK + 0.6) / CHUNK; // Zemin parçaları ek yeri kapansın diye bu kadar büyük çizilir

// Yüksek binada tabela çatının ortasındadır: gündüz, gece ve ışıltı aynı kutuyu kullanır
function roofSignBox(r, img) {
  const w = Math.min((r.tX1 - r.tX0) * 0.92, (img.width / img.height) * (r.roofSignH || 38));
  const h = (w / img.width) * img.height;
  signOut.w = w;
  signOut.h = h;
  signOut.x = (r.tX0 + r.tX1) / 2 - w / 2;
  signOut.y = (r.tY0 + r.tY1) / 2 - h / 2;
  return signOut;
}

// Özel yapının güney cephesindeki dev tabela: duvar kameraya bakınca görünür, duvarla birlikte uzar
function facadeSignBox(r, img, camY) {
  const y1 = r.y + r.h;
  if (camY <= y1) return null;
  const t = 0.56;
  const wy = y1 + (r.tY1 - y1) * t;
  const xa = r.x + (r.tX0 - r.x) * t;
  const xb = r.x + r.w + (r.tX1 - r.x - r.w) * t;
  const wallH = y1 - r.tY1;
  let w = (xb - xa) * (r.landmark === 'kule' ? 0.86 : 0.6);
  let h = (w * img.height) / img.width;
  if (h > wallH * 0.3) { h = wallH * 0.3; w = (h * img.width) / img.height; }
  if (h < 5) return null;
  signOut.w = w; signOut.h = h;
  signOut.x = (xa + xb) / 2 - w / 2;
  signOut.y = wy - h / 2;
  return signOut;
}

// Alçak binada tabela zemin parçasına işlenmiştir: gece katmanı aynı ölçeğe oturur, çift görünmez
function groundSignBox(r, img, c) {
  const b = signBox(r, img);
  b.x = c.x + (b.x - c.x) * CHUNK_FIT;
  b.y = c.y + (b.y - c.y) * CHUNK_FIT;
  b.w *= CHUNK_FIT;
  b.h *= CHUNK_FIT;
  return b;
}
function signBox(r, img) {
  const size = r.signSize ?? 1;
  const hTarget = [18, 24, 32, 46][size] ?? 24;
  const maxW = size === 3 ? r.w * 0.94 : r.w - 6;
  // Dar binada tabela sığacak kadar küçülür, cepheden taşmaz
  const fit = Math.min(hTarget, Math.max(10, r.h - 9));
  const w = Math.min(maxW, (img.width / img.height) * fit);
  const h = (w / img.width) * img.height;
  signOut.w = w;
  signOut.h = h;
  signOut.x = r.x + (r.w - w) / 2;
  // Dev yazı çatının ortasında, öteki tabelalar cephede
  signOut.y = size === 3 ? r.y + 8 : r.y + r.h - h - 7;
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
    this.lod = { slices: 6, balcony: 1, night: 2, speedLines: true, fireSmoke: true };
    this.tallList = [];
    this.syncBakes = 0; // Görünür parça hazır değilse kare beklemiştir: ölçüm için
    this.queue = []; // Sprite işleri kare bütçesiyle yapılır
    this.makeSprites();
  }

  // Atlas yüklenince polis ve park etmiş araçlar 3B modellerden gelir
  // Tek karede donmasın diye işler kuyruğa girer; stepQueue kare başına birkaç ms harcar
  useAtlas() {
    const P = CONFIG.police;
    const s = this.sprites;
    const q = this.queue;
    this.playerId = '';
    s.npc = {};
    for (const k of ['car', 'fast', 'advanced', 'swat', 'moto']) {
      q.push(() => { const img = sheetSprite(`cop:${k}`, P[k].len); if (img) s[k] = img; });
    }
    let first = true;
    for (const [k, n] of [['marmara', 4], ['liva', 4], ['klasik', 5], ['volta', 5], ['pusula', 4], ['lale', 4], ['vadi', 4], ['bavar', 5], ['dalga', 4], ['efe', 4]]) {
      for (let i = 0; i < n; i++) {
        q.push(() => {
          const img = sheetSprite(`npc:${k}:${i}`, 44);
          if (!img) return;
          if (first) { s.parked = []; first = false; }
          s.parked.push(img);
        });
      }
    }
    // Trafik araçları ilk görüldüğünde üretilmez: oyun ortasında takılma yapıyordu
    for (const k of Object.keys(CONFIG.npc.types)) {
      const t = CONFIG.npc.types[k];
      t.colors.forEach((_, i) => q.push(() => {
        const key = `${k}${i}`;
        if (s.npc[key]) return;
        const img = sheetSprite(`npc:${k}:${i}`, t.len);
        if (img) s.npc[key] = img;
      }));
    }
  }

  stepQueue(ms) {
    if (!this.queue.length) return;
    const t0 = performance.now();
    while (this.queue.length) {
      this.queue.shift()();
      if (performance.now() - t0 >= ms) break;
    }
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
    if (this.job && this.job.c === c) this.job = null;
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
    // Üç yol tonu: ince doku farkıyla, araçlar net ayrılsın
    const tone = (col) => mk((g, v) => {
      g.fillStyle = col; g.fillRect(0, 0, T, T);
      noise(g, 22, 'rgba(255,255,255,.035)', 'rgba(0,0,0,.05)', 2);
      if (v === 1) { g.fillStyle = 'rgba(0,0,0,.05)'; g.fillRect(6, 10, 22, 12); }
      if (v === 3) { g.fillStyle = 'rgba(255,255,255,.03)'; g.fillRect(14, 4, 20, 26); }
    });
    const RT = CONFIG.world.roadTones;
    this.roads = RT.map(tone);
    this.roads[2] = mk((g, v) => {
      g.fillStyle = RT[2]; g.fillRect(0, 0, T, T);
      noise(g, 14, 'rgba(255,255,255,.04)', 'rgba(0,0,0,.05)', 2);
      g.fillStyle = 'rgba(40,40,40,.16)'; g.fillRect(0, 0, T, 1); g.fillRect(0, 0, 1, T);
      if (v === 2) { g.fillStyle = 'rgba(0,0,0,.03)'; g.fillRect(0, 0, T, T); }
    });
    this.alleys = [this.roads[1], tone('#70747a')];
  }

  // Yüksek bina dokuları: duvarda pencere, balkon, çamaşır, klima, çanak, çiçek. Çatılar ayrı
  makeTallArt() {
    const W0 = 96; const H0 = 192;
    const tones = [['#6f93b5', '#c8e4f4'], ['#c9c0ae', '#9fd2ee'], ['#d8b890', '#a8d4e8'], ['#7fb0a8', '#d0f0ea'], ['#b5705a', '#ffe2b0'], ['#e4e6e8', '#8fc0dc'], ['#858b93', '#c4d8e4'], ['#3d4a5c', '#8fd0f4']];
    this.walls = [];
    tones.forEach(([wall, glass], t) => {
      for (let d = 0; d < 3; d++) {
        const c = makeCanvas(W0, H0);
        const g = c.getContext('2d');
        g.fillStyle = wall; g.fillRect(0, 0, W0, H0);
        const glassy = t === 0 || t === 7;
        for (let row = 0; row < 11; row++) {
          const y = 4 + row * 17;
          g.fillStyle = 'rgba(0,0,0,.14)'; g.fillRect(0, y + 13, W0, 2);
          for (let col = 0; col < 5; col++) {
            const x = 3 + col * 19;
            const h = (row * 31 + col * 17 + t * 7 + d * 13) % 23;
            g.fillStyle = h % 6 === 0 ? '#ffe9a8' : glass;
            g.fillRect(x, y, glassy ? 17 : 13, glassy ? 13 : 10);
            if (glassy) continue;
            if (d === 1 && h % 4 === 0) { // Balkon, çamaşır
              g.fillStyle = 'rgba(255,255,255,.8)'; g.fillRect(x - 1, y + 10, 15, 2);
              for (let k = 0; k < 3; k++) { g.fillStyle = ['#f4f6f8', '#e8533f', '#3e7cb1', '#f2c14e'][(h + k) % 4]; g.fillRect(x + 1 + k * 4, y + 3, 3, 7); }
            } else if (d === 2 && h % 5 === 0) { // Klima
              g.fillStyle = '#e6e9ec'; g.fillRect(x + 1, y + 7, 10, 6); g.fillStyle = '#7d8590'; g.beginPath(); g.arc(x + 6, y + 10, 2, 0, 7); g.fill();
            } else if (h % 7 === 1) { // Çiçek
              g.fillStyle = '#8a5a3a'; g.fillRect(x - 1, y + 10, 15, 2.4);
              for (let k = 0; k < 5; k++) { g.fillStyle = k % 2 ? '#4f9a3a' : '#ff5a8a'; g.beginPath(); g.arc(x + k * 3, y + 9, 2, 0, 7); g.fill(); }
            } else if (h % 9 === 2) { // Uydu çanağı
              g.fillStyle = '#f0f2f4'; g.beginPath(); g.ellipse(x + 11, y + 9, 4, 3, 0.5, 0, 7); g.fill();
            }
          }
        }
        // Yan kenar için döndürülmüş kopya
        const rot = makeCanvas(H0, W0);
        const q = rot.getContext('2d');
        q.translate(H0 / 2, W0 / 2); q.rotate(Math.PI / 2); q.drawImage(c, -W0 / 2, -H0 / 2);
        this.walls.push({ n: c, e: rot });
      }
    });
    this.roofs = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => {
      const c = makeCanvas(128, 128);
      const g = c.getContext('2d');
      const base = ['#c5c9cc', '#8fa6b8', '#b0a690', '#d8d4cc', '#7a8a96', '#a8b8a8', '#b09a8a', '#c0c8d0'][k];
      g.fillStyle = base; g.fillRect(0, 0, 128, 128);
      g.strokeStyle = 'rgba(0,0,0,.28)'; g.lineWidth = 5; g.strokeRect(3, 3, 122, 122);
      g.fillStyle = 'rgba(255,255,255,.16)'; g.fillRect(8, 8, 112, 7);
      if (k % 3 === 0) { g.fillStyle = '#3d444e'; g.beginPath(); g.arc(64, 64, 34, 0, 7); g.fill(); g.strokeStyle = '#ffd23f'; g.lineWidth = 4; g.stroke(); g.fillStyle = '#fff'; g.font = '900 38px sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('H', 64, 66); }
      else if (k % 3 === 1) { g.fillStyle = '#1f3f77'; for (let y = 18; y < 104; y += 19) for (let x = 18; x < 100; x += 25) g.fillRect(x, y, 21, 15); }
      else { g.fillStyle = '#7fb56a'; g.fillRect(20, 20, 60, 50); g.fillStyle = '#4f9a3a'; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(30 + i * 11, 34 + (i % 2) * 18, 8, 0, 7); g.fill(); } g.fillStyle = '#57c1f0'; g.fillRect(88, 62, 26, 44); }
      for (let i = 0; i < 3; i++) { const x = 16 + ((k + 1) * (i + 2) * 23) % 90; const y = 88 + (i * 11) % 24; g.fillStyle = '#dfe3e8'; g.fillRect(x, y, 15, 11); g.fillStyle = '#6d7680'; g.beginPath(); g.arc(x + 7, y + 5, 3.4, 0, 7); g.fill(); }
      g.fillStyle = '#eceff2'; g.beginPath(); g.ellipse(106, 22, 8, 7, 0.5, 0, 7); g.fill();
      return c;
    });
    // Yangın: üç kare alev, tek kare duman
    this.flames = [0, 1, 2].map((v) => sprite(44, 60, (g) => {
      for (const [r, col] of [[1, '#ff3a10'], [0.72, '#ff9a1a'], [0.42, '#ffe98a']]) {
        g.fillStyle = col;
        g.beginPath(); g.moveTo(-17 * r, 24);
        g.quadraticCurveTo(-21 * r, 2, -9 * r + v, -6 * r);
        g.quadraticCurveTo(-10 * r, -18 * r, 0 + v * 2 - 2, -28 * r);
        g.quadraticCurveTo(10 * r, -15 * r, 9 * r, -4 * r);
        g.quadraticCurveTo(21 * r, 4, 17 * r, 24);
        g.closePath(); g.fill();
      }
    }));
  }

  // Kameraya göre yukarı uzanan binalar: taban sabit, çatı kameradan dışa kayar ve büyür
  // Görünen yüksek binalar uzaktan yakına sıralanır: yakın olan uzak olanı örter.
  // Çatı izdüşümü binada saklanır, tabela ve ışıltı buradan okur
  collectTalls(game, c0x, c1x, c0y, c1y) {
    const cam = game.cam;
    const cx = cam.x; const cy = cam.y;
    const mx = cam.halfW + 120; const my = cam.halfH + 120;
    const list = this.tallList;
    let n = 0;
    for (let gy = c0y - 1; gy <= c1y + 1; gy++) {
      for (let gx = c0x - 1; gx <= c1x + 1; gx++) {
        const c = game.world.chunks.get((gx + 32768) * 65536 + (gy + 32768));
        if (!c) continue;
        for (let ti = 0; ti < c.talls.length; ti++) {
          const r = c.talls[ti];
          if (!r.alive || r.x + r.w < cx - mx || r.x > cx + mx || r.y + r.h < cy - my || r.y > cy + my) continue;
          const k = r.tall;
          r.tX0 = r.x + (r.x - cx) * k; r.tX1 = r.x + r.w + (r.x + r.w - cx) * k;
          r.tY0 = r.y + (r.y - cy) * k; r.tY1 = r.y + r.h + (r.y + r.h - cy) * k;
          const dx = cx < r.x ? r.x - cx : cx > r.x + r.w ? cx - r.x - r.w : 0;
          const dy = cy < r.y ? r.y - cy : cy > r.y + r.h ? cy - r.y - r.h : 0;
          r.tDist = dx * dx + dy * dy;
          list[n++] = r;
        }
      }
    }
    list.length = n;
    for (let i = 1; i < n; i++) {
      const r = list[i];
      let j = i - 1;
      while (j >= 0 && list[j].tDist < r.tDist) { list[j + 1] = list[j]; j--; }
      list[j + 1] = r;
    }
    for (let i = 0; i < n; i++) list[i].tSeq = i;
  }

  drawTalls(game, c0x, c1x, c0y, c1y) {
    const ctx = this.ctx;
    const cam = game.cam;
    const cx = cam.x; const cy = cam.y;
    const N = this.lod.slices;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    this.collectTalls(game, c0x, c1x, c0y, c1y);
    const list = this.tallList;
    for (let ti = 0; ti < list.length; ti++) {
      const r = list[ti];
      const x0 = r.x; const x1 = r.x + r.w; const y0 = r.y; const y1 = r.y + r.h;
      const X0 = r.tX0; const X1 = r.tX1; const Y0 = r.tY0; const Y1 = r.tY1;
      // Özel yapı (kolej, kule) kendi duvar ve çatı dokusunu getirir
      const art = r.landmark ? tallArt(r) : null;
      const tex = art || this.walls[r.seed % this.walls.length];
      ctx.globalAlpha = 1;
      this.tallWalls(r, tex, art, cx, cy, N, true);
      ctx.drawImage(art ? art.roof : this.roofs[(r.seed >> 2) % this.roofs.length], X0, Y0, X1 - X0, Y1 - Y0);
      if (r.sign && !r.noRoofSign) {
        const img = rectSign(r);
        const b = roofSignBox(r, img);
        ctx.drawImage(img, b.x, b.y, b.w, b.h);
      }
      if (r.sign && r.landmark) {
        const img = rectSign(r);
        const b = facadeSignBox(r, img, cy);
        if (b) ctx.drawImage(img, b.x, b.y, b.w, b.h);
      }
    }
  }

  // Yüksek binanın kameraya bakan duvarları. tex: { n, e } dokusu. shadeIt: gölge katmanı (gündüz)
  tallWalls(r, tex, art, cx, cy, N, shadeIt) {
    const ctx = this.ctx;
    const x0 = r.x; const x1 = r.x + r.w; const y0 = r.y; const y1 = r.y + r.h;
    const X0 = r.tX0; const X1 = r.tX1; const Y0 = r.tY0; const Y1 = r.tY1;
    const nW = art ? tex.n.width : Math.min(96, r.w);
    const eH = art ? tex.e.height : Math.min(96, r.h);
    // Güney ve kuzey duvarları
    if (cy > y1 || cy < y0) {
      const fromY = cy > y1 ? y1 : y0; const toY = cy > y1 ? Y1 : Y0;
      for (let t = 0; t < N; t++) {
        const a = t / N; const b = (t + 1) / N;
        const xa = x0 + (X0 - x0) * b; const xb = x1 + (X1 - x1) * b;
        const ya = fromY + (toY - fromY) * a; const yb = fromY + (toY - fromY) * b;
        ctx.drawImage(tex.n, 0, 192 * (1 - b), nW, 192 / N, xa, Math.min(ya, yb) - 0.4, xb - xa, Math.abs(yb - ya) + 0.8);
      }
      if (shadeIt && cy < y0) { ctx.fillStyle = 'rgba(0,0,20,.28)'; ctx.fillRect(Math.min(x0, X0), Y0, Math.max(x1, X1) - Math.min(x0, X0), y0 - Y0); }
    }
    // Doğu ve batı duvarları
    if (cx > x1 || cx < x0) {
      const fromX = cx > x1 ? x1 : x0; const toX = cx > x1 ? X1 : X0;
      for (let t = 0; t < N; t++) {
        const a = t / N; const b = (t + 1) / N;
        const ya = y0 + (Y0 - y0) * b; const yb = y1 + (Y1 - y1) * b;
        const xa = fromX + (toX - fromX) * a; const xc = fromX + (toX - fromX) * b;
        ctx.drawImage(tex.e, 192 * (1 - b), 0, 192 / N, eH, Math.min(xa, xc) - 0.4, ya, Math.abs(xc - xa) + 0.8, yb - ya);
      }
      if (shadeIt) {
        ctx.fillStyle = 'rgba(0,0,20,.16)';
        ctx.beginPath(); ctx.moveTo(fromX, y0); ctx.lineTo(toX, Y0); ctx.lineTo(toX, Y1); ctx.lineTo(fromX, y1); ctx.closePath(); ctx.fill();
      }
    }
  }

  // Balkon hayatı: yalnızca oyuncu yakınındaki apartmanlarda, sınırlı sayıda. Geceleri içeri girerler
  drawBalconies(game, now, c0x, c1x, c0y, c1y, tall) {
    const B = CONFIG.balcony;
    const night = game.daylight.k;
    const maxDrawn = Math.round(B.maxDrawn * this.lod.balcony);
    if (night > 0.75 || maxDrawn <= 0) return;
    const ctx = this.ctx;
    const sp = this.sprites;
    const p = game.player;
    const cam = game.cam;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    ctx.globalAlpha = 1 - night / 0.75;
    let drawn = 0;
    const R2 = B.range * B.range;
    const swing = Math.floor(now / 260);
    for (let cy = c0y; cy <= c1y && drawn < maxDrawn; cy++) {
      for (let cx = c0x; cx <= c1x && drawn < maxDrawn; cx++) {
        const c = game.world.chunks.get((cx + 32768) * 65536 + (cy + 32768));
        if (!c) continue;
        for (let bi = 0; bi < c.balc.length; bi++) {
          const r = c.balc[bi];
          if (!r.alive || drawn >= maxDrawn || (r.tall > 0) !== tall) continue;
          const mx = r.x + r.w / 2; const my = r.y + r.h;
          const dx = mx - p.x; const dy = my - p.y;
          if (dx * dx + dy * dy > R2) continue;
          // Yüksek binada güney duvarı kameraya bakıyorsa duvara, değilse cepheye yerleşir
          const k = r.tall;
          if (k && cam.y <= my) continue;
          const slots = 1 + (r.seed % 3);
          for (let i = 0; i < slots; i++) {
            const h = ((r.seed * (i + 3) * 2654435761) >>> 0) / 4294967296;
            const u = 0.14 + ((i + h * 0.7) / slots) * 0.74;
            const b = k ? 0.3 + ((r.seed >> (i + 1)) % 5) * 0.11 : 0;
            const x0 = r.x + r.w * u;
            const fx = k ? x0 + (x0 - cam.x) * k * b : x0;
            const fy = k ? my + (my - cam.y) * k * b : my - 7;
            const q = 1 + (k ? k * b : 0);
            if (h < 0.34) {
              ctx.drawImage(sp.washing[(swing + i + (r.seed & 3)) % 3], fx - 15 * q, fy - 15 * q, 30 * q, 18 * q);
            } else {
              const act = sp.balcony[Math.floor(h * 97) % 4];
              ctx.drawImage(act[Math.floor(now / 480 + h * 7) & 1], fx - 10 * q, fy - 21 * q, 20 * q, 24 * q);
            }
            drawn++;
          }
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  // Yangın: en fazla birkaç alev karesi, parçacık harcamaz
  drawFires(game, now, c0x, c1x, c0y, c1y) {
    const ctx = this.ctx;
    const sp = this.sprites;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    const fr = Math.floor(now / 110);
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = game.world.chunk(cx, cy);
        for (const r of c.fires) {
          if (!r.alive) continue;
          for (let i = 0; i < 3; i++) {
            const x = r.x + r.w * (0.22 + i * 0.28);
            const y = r.y + r.h * (0.3 + ((r.seed + i * 3) % 4) * 0.13);
            for (let k = 0; this.lod.fireSmoke && k < 2; k++) {
              const t = ((now * 0.00035 + k * 0.5 + i * 0.3) % 1);
              ctx.globalAlpha = 0.5 * (1 - t);
              const R = 18 + t * 46;
              ctx.drawImage(sp.dark, x + t * 26 - R, y - 26 - t * 100 - R, R * 2, R * 2);
            }
            ctx.globalAlpha = 1;
            const img = this.flames[(fr + i) % 3];
            const q = 0.9 + 0.12 * Math.sin(now * 0.012 + i);
            ctx.drawImage(img, x - 22 * q, y - 42 * q, 44 * q, 60 * q);
          }
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  makeSprites() {
    const P = CONFIG.police;
    const s = this.sprites;
    this.makePatterns();
    this.makeTallArt();
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
    // Dükkân önü: döner şişi, afişler, üç renk şişme balon
    s.doner = [0, 1, 2, 3].map((f) => sprite(18, 24, (g) => paintDoner(g, f)));
    s.promos = CONFIG.signs.promos.map((t, i) => sprite(44, 26, (g) => paintPromo(g, t, i)));
    s.dancers = ['#e8352e', '#ffd23f', '#21a9e0'].map((c) => [0, 1, 2, 3, 4, 5].map((f) => sprite(46, 78, (g) => paintDancer(g, c, f))));
    // Balkon: çay içen, el sallayan, çiçek sulayan, çamaşır asan ve sallanan çamaşır
    s.balcony = ['tea', 'wave', 'water', 'hang'].map((a) => [0, 1].map((f) => sprite(20, 24, (g) => paintBalcony(g, a, f, SHIRT[(a.length * 3 + f * 0) % SHIRT.length]))));
    s.washing = [0, 1, 2].map((f) => sprite(30, 18, (g) => paintWashing(g, f)));
    // Gökyüzü: yıldızlar iki kümede, sırayla parıldar
    s.moon = sprite(44, 44, paintMoon);
    s.stars = [11, 37].map((seed) => sprite(320, 90, (g) => paintStars(g, seed)));
    s.tail = glow(32, [[0, 'rgba(255,50,40,.85)'], [0.5, 'rgba(255,30,30,.3)'], [1, 'rgba(255,20,20,0)']]);
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

  // Chunk çizimi dilimlere bölünür: tek karede donma olmasın
  startJob(c) {
    if (!c.canvas) {
      c.canvas = this.getBakeCanvas();
      this.baked.push(c);
    }
    this.job = { c, phase: 0, i: 0 };
  }

  // Bir birim iş yapar; bitince true döner
  jobUnit() {
    const j = this.job;
    const c = j.c;
    const g = c.canvas.getContext('2d');
    const k = PF.bakeScale;
    g.setTransform(k, 0, 0, k, -c.x * k, -c.y * k);
    if (j.phase === 0) { this.bakeGround(g, c); j.phase = 1; return false; }
    if (j.phase === 1) {
      for (let i = 0; i < c.rectCount; i++) if (!c.rects[i].alive) this.bakeRubble(g, c.rects[i]);
      for (let i = 0; i < c.rectCount; i++) {
        const r = c.rects[i];
        if (r.alive && r.kind === 'water') this.bakeWater(g, r);
      }
      for (let i = 0; i < c.rectCount; i++) {
        const r = c.rects[i];
        if (r.alive && r.kind === 'building') {
          const k2 = r.tall ? shadowOf(r) : TALL_STYLES.has(r.style) ? 2.4 : shadowOf(r);
          g.fillStyle = 'rgba(0,10,30,.26)';
          rr(g, r.x + 12 * k2, r.y + 15 * k2, r.w, r.h, 5);
          g.fill();
        }
      }
      j.phase = 2;
      return false;
    }
    while (j.i < c.rectCount) {
      const r = c.rects[j.i++];
      if (!r.alive) continue;
      if (r.kind === 'building') { this.bakeBuilding(g, r); return false; }
      if (r.kind === 'wall') this.bakeWall(g, r);
    }
    c.dirty = false;
    this.job = null;
    return true;
  }

  // Görünen chunk hazır değilse beklenmez: işi hemen bitirir
  bake(c) {
    if (!this.job || this.job.c !== c) this.startJob(c);
    while (!this.jobUnit());
  }

  // Kare başına bütçe kadar arka plan çizimi
  stepJob(ms) {
    const t0 = performance.now();
    while (this.job) {
      this.job.c.lastSeen = this.frameId;
      this.jobUnit();
      if (performance.now() - t0 >= ms) break;
    }
  }

  bakeGround(g, c) {
    // Biyoma göre palet. Su karosu kıyı rengindedir; yuvarlak gölet köşelerinde mavi taşmasın
    const pal = BIOME_COLORS[c.biome];
    const urban = c.biome === 'city';
    const sea = c.template === 'sea';
    const shore = sea ? '#1f8fd6' : c.template === 'lake' ? pal.sand : c.template === 'plaza' ? '#e5d7bf' : pal.grass;
    const colors = [pal.grass, pal.road, '#cdd2d6', '#e5d7bf', shore, pal.sand, pal.dirt, '#5fd3e6', '#c9ae4c', '#70747a', '#cdd2d6'];
    const roads = this.roads[urban ? c.road : 1];
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
    const open = (t) => t !== GROUND.ROAD && t !== GROUND.ALLEY && t !== GROUND.TRACK;
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
    this.bakePaths(g, c);
    if (c.hw) this.bakeHighway(g, c);
  }

  // Kıvrımlı yollar, U dönüşü, Y ayrımı ve dönel kavşak: yumuşak eğri olarak çizilir
  bakePaths(g, c) {
    if (!c.paths.length) return;
    const tones = CONFIG.world.roadTones;
    const col = tones[c.road];
    const stroke = (p) => {
      g.beginPath();
      for (let i = 0; i < p.pts.length; i += 2) {
        const x = c.x + p.pts[i] * TILE; const y = c.y + p.pts[i + 1] * TILE;
        if (i) g.lineTo(x, y); else g.moveTo(x, y);
      }
      if (p.ring) g.closePath();
    };
    g.lineCap = 'round'; g.lineJoin = 'round';
    for (const p of c.paths) { stroke(p); g.strokeStyle = '#eef1f4'; g.lineWidth = p.w * TILE + 8; g.stroke(); }
    for (const p of c.paths) { stroke(p); g.strokeStyle = col; g.lineWidth = p.w * TILE; g.stroke(); }
    const light = c.road === 2;
    g.strokeStyle = light ? '#6d7076' : '#ffd23f'; g.lineWidth = 3; g.setLineDash([22, 18]);
    for (const p of c.paths) { stroke(p); g.stroke(); }
    g.setLineDash([]);
    for (let i = 0; i < c.rectCount; i++) {
      const r = c.rects[i];
      if (r.kind !== 'island') continue;
      const R0 = r.w / 2 + 6;
      g.fillStyle = '#eef1f4'; g.beginPath(); g.arc(r.cx, r.cy, R0 + 5, 0, 7); g.fill();
      g.fillStyle = '#6fae3e'; g.beginPath(); g.arc(r.cx, r.cy, R0, 0, 7); g.fill();
      g.fillStyle = '#4f9a3a'; for (let k = 0; k < 8; k++) { const a = (k / 8) * 6.283; g.beginPath(); g.arc(r.cx + Math.cos(a) * R0 * 0.68, r.cy + Math.sin(a) * R0 * 0.68, 11, 0, 7); g.fill(); }
      g.fillStyle = '#e30a17'; g.beginPath(); g.arc(r.cx, r.cy, 13, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.beginPath(); g.arc(r.cx, r.cy, 5, 0, 7); g.fill();
      g.fillStyle = 'rgba(255,255,255,.8)';
      for (let k = 0; k < 4; k++) { const a = (k / 4) * 6.283 + 0.4; const q = R0 + 66; g.save(); g.translate(r.cx + Math.cos(a) * q, r.cy + Math.sin(a) * q); g.rotate(a + 1.57); g.fillRect(-12, -2, 16, 4); g.beginPath(); g.moveTo(4, -7); g.lineTo(15, 0); g.lineTo(4, 7); g.closePath(); g.fill(); g.restore(); }
    }
  }

  // Otoban: asfalt, şerit, emniyet şeridi, beton bariyer, yeşil tabela köprüsü
  bakeHighway(g, c) {
    const H = CONFIG.world.highway;
    const top = c.y + H.y0 * TILE; const bot = top + (H.half * 2 + 1) * TILE;
    const x0 = c.x + ART_W; const x1 = c.x + CHUNK;
    g.fillStyle = CONFIG.world.roadTones[0]; g.fillRect(x0, top, x1 - x0, bot - top);
    const side = H.half * TILE;
    const laneW = (side - 24) / H.lanes;
    g.fillStyle = '#fff'; g.fillRect(x0, top + 6, x1 - x0, 4); g.fillRect(x0, bot - 10, x1 - x0, 4);
    g.fillStyle = '#ffd23f'; g.fillRect(x0, top + side - 8, x1 - x0, 3); g.fillRect(x0, bot - side + 5, x1 - x0, 3);
    g.fillStyle = 'rgba(255,255,255,.85)';
    for (let k = 1; k < H.lanes; k++) {
      for (let x = x0 + 16; x < x1; x += 58) {
        g.fillRect(x, top + 12 + k * laneW, 32, 3);
        g.fillRect(x, bot - 12 - k * laneW, 32, 3);
      }
    }
    // Beton bariyer
    const by = top + side + 15;
    g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(x0, by + 4, x1 - x0, 12);
    g.fillStyle = '#d4d7da'; g.fillRect(x0, by, x1 - x0, 10);
    g.fillStyle = '#9ea2a6'; for (let x = x0; x < x1; x += 40) g.fillRect(x, by, 2, 10);
    g.fillStyle = '#fff'; g.fillRect(x0, by + 3, x1 - x0, 2);
    // Tabela köprüsü
    const gx = c.x + CHUNK * 0.62;
    g.fillStyle = 'rgba(0,0,0,.25)'; g.fillRect(gx + 8, top + 8, 10, bot - top);
    g.fillStyle = '#7e8690'; g.fillRect(gx, top - 6, 7, bot - top + 12);
    const pan = (y, t) => {
      g.font = '900 15px Nunito, sans-serif';
      const w = g.measureText(t).width + 18;
      g.fillStyle = '#0d6b3c'; g.fillRect(gx - w / 2 + 3, y - 15, w, 30);
      g.strokeStyle = '#fff'; g.lineWidth = 1.5; g.strokeRect(gx - w / 2 + 6, y - 12, w - 6, 24);
      g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, gx + 3, y + 1);
    };
    const h = (Math.imul(c.cx, 73856093) >>> 0) % 4;
    pan(top + side * 0.5, ['← EDİRNE O-3', '← SARAY O-3', '← GEBZE O-4', '← ÇORLU O-3'][h]);
    pan(bot - side * 0.5, ['ANKARA O-4 →', 'İZMİT O-4 →', 'BOLU O-4 →', 'BURSA O-5 →'][h]);
    // Hız tabelası
    for (const [y, t] of [[top + 2, '120'], [bot - 2, '120']]) {
      g.fillStyle = '#fff'; g.beginPath(); g.arc(c.x + CHUNK * 0.3, y, 11, 0, 7); g.fill();
      g.strokeStyle = '#d0121b'; g.lineWidth = 3; g.stroke();
      g.fillStyle = '#111'; g.font = '900 10px Nunito, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(t, c.x + CHUNK * 0.3, y + 1);
    }
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
      if (s.ground !== GROUND.ALLEY && s.ground !== GROUND.ROAD) continue;
      const at = (s.pos + s.width / 2) * TILE;
      // Geniş sokakta kesik orta çizgi
      if (s.width >= 2) {
        g.fillStyle = c.road === 2 ? '#6d7076' : 'rgba(255,255,255,.75)';
        for (let d = ART_W + 40; d < CHUNK - 30; d += 46) {
          if (s.vertical) g.fillRect(c.x + at - 1.5, c.y + d, 3, 24);
          else g.fillRect(c.x + d, c.y + at - 1.5, 24, 3);
        }
      }
      const sign = i % 2 ? round('#2a6fd6', '#fff', '⇧') : tri('Y');
      if (s.vertical) post(c.x + at + 13, c.y + ART_W - 5, sign);
      else post(c.x + ART_W - 5, c.y + at + 13, sign);
    }
    // Yaya geçitleri ara sokak ağızlarında
    g.fillStyle = 'rgba(255,255,255,.82)';
    for (let i = 0; i < c.streetCount; i++) {
      const s = c.streets[i];
      if (s.ground !== GROUND.ALLEY && s.ground !== GROUND.ROAD) continue;
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
      if (p.w <= 0 || p.h <= 0) continue; // Otoban bandında kalan saha iptal edilmiştir
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
      } else {
        paintPad(g, p, x, y, w, h); // Özel yerlerin alanları: merdiven, bayrak, tramvay, tepe, bağ
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
    if (!r.sign || r.tall > 0) return; // Yüksek binanın tabelası çatıda, her karede çizilir
    const img = rectSign(r);
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

    ctx.setTransform(s, 0, 0, s, ox, oy);

    // Zemin temizlenmez: sarsıntıda da kadraj parçalarla tam örtülür
    const c0x = Math.floor((vx0 - 30) / CHUNK);
    const c1x = Math.floor((vx1 + 30) / CHUNK);
    const c0y = Math.floor((vy0 - 30) / CHUNK);
    const c1y = Math.floor((vy1 + 30) / CHUNK);
    this.frameId = (this.frameId || 0) + 1;
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = world.chunk(cx, cy);
        c.lastSeen = this.frameId;
        if (!c.canvas || c.dirty) { this.syncBakes++; this.bake(c); }
        ctx.drawImage(c.canvas, c.x, c.y, CHUNK + 0.6, CHUNK + 0.6);
      }
    }
    // Görünmeden önce hazırla: kaydırmada takılma olmasın (karede en fazla 1)
    // Telefonda takılma olmasın diye dört karede bir
    if (game.state === 'play' || game.state === 'drop') {
      if (!this.job) this.prebake(game, c0x, c1x, c0y, c1y);
      this.stepJob(PF.bakeBudget);
    }
    this.stepQueue(2);

    this.drawDecals(game, vx0, vx1, vy0, vy1);
    this.drawSkids(game, vx0, vx1, vy0, vy1);
    this.drawSpikes(game);
    this.drawShots(game, now);
    this.drawProps(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now, false);
    this.drawPeds(game, vx0, vx1, vy0, vy1, false);
    this.drawNpcs(game, vx0, vx1, vy0, vy1);
    this.drawHighway(game, vx0, vx1, vy0, vy1);
    this.drawCops(game, now, vx0, vx1, vy0, vy1);
    if (game.state !== 'dying' && game.state !== 'over') this.drawPlayer(game);
    this.drawProps(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now, true);
    this.drawPeds(game, vx0, vx1, vy0, vy1, true);
    this.drawLights(game, c0x, c1x, c0y, c1y);
    this.drawFires(game, now, c0x, c1x, c0y, c1y);
    this.drawBalconies(game, now, c0x, c1x, c0y, c1y, false); // Alçak binalar yüksek binaların altında kalır
    this.drawTalls(game, c0x, c1x, c0y, c1y);
    this.drawBalconies(game, now, c0x, c1x, c0y, c1y, true);
    this.drawUfos(game, now, vx0, vx1, vy0, vy1);
    this.drawParticles(game, vx0, vx1, vy0, vy1);
    this.drawNight(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now);
    this.drawPhasing(game);
    this.drawSirens(game, now, vx0, vx1, vy0, vy1);
    this.drawWaves(game);
    this.drawFloats(game);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalAlpha = 1;
    this.drawSpeedLines(game, now);
    this.drawOverlay(game, now);
  }

  // Görünecek parçaları karede en çok birer birer hazırlar: geçişte ekran donmaz
  warm(game, k = 1, ms = 0) {
    const t0 = performance.now();
    this.stepQueue(ms || 3);
    const cam = game.cam;
    const hw = cam.halfW * k + 30; const hh = cam.halfH * k + 30;
    const c0x = Math.floor((cam.x - hw) / CHUNK); const c1x = Math.floor((cam.x + hw) / CHUNK);
    const c0y = Math.floor((cam.y - hh) / CHUNK); const c1y = Math.floor((cam.y + hh) / CHUNK);
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = game.world.chunk(cx, cy);
        c.lastSeen = this.frameId || 0;
        for (let i = 0; i < c.talls.length; i++) if (c.talls[i].sign) rectSign(c.talls[i]);
        if (!c.canvas || c.dirty) {
          this.bake(c);
          if (performance.now() - t0 >= ms) return false;
        }
      }
    }
    return true;
  }

  prebake(game, c0x, c1x, c0y, c1y) {
    const p = game.player;
    const dx = Math.sign(p.vx);
    const dy = Math.sign(p.vy);
    const cx = dx > 0 ? c1x + 1 : dx < 0 ? c0x - 1 : c0x;
    const cy = dy > 0 ? c1y + 1 : dy < 0 ? c0y - 1 : c0y;
    for (let y = c0y; y <= c1y; y++) {
      const c = game.world.chunk(cx, y);
      if (!c.canvas || c.dirty) { c.lastSeen = this.frameId; this.startJob(c); return; }
    }
    for (let x = c0x; x <= c1x; x++) {
      const c = game.world.chunk(x, cy);
      if (!c.canvas || c.dirty) { c.lastSeen = this.frameId; this.startJob(c); return; }
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
          const isTall = pr.kind === PROP.QUEUE || pr.kind === PROP.DANCER || pr.kind === PROP.TREE || pr.kind === PROP.PALM || pr.kind === PROP.PINE || pr.kind === PROP.LAUNDRY;
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
          if (pr.kind === PROP.DONER) {
            ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
            ctx.drawImage(sp.doner[Math.floor(now / 130 + pr.x) & 3], pr.x - 9, pr.y - 20, 18, 24);
            continue;
          }
          if (pr.kind === PROP.PROMO) {
            ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
            ctx.drawImage(sp.promos[pr.v || 0], pr.x - 22, pr.y - 20, 44, 26);
            continue;
          }
          if (pr.kind === PROP.DANCER) {
            ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
            ctx.drawImage(sp.dancers[pr.v || 0][Math.abs(Math.floor(now / 105 + pr.x * 0.1)) % 6], pr.x - 23, pr.y - 72, 46, 78);
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
        for (let i = 0; i < c.streetCount; i++) {
          const s = c.streets[i];
          if (s.width < 2) continue;
          const at = (s.pos + s.width) * TILE + 6;
          if (s.vertical) ctx.drawImage(ns, c.x + at, c.y + ART_W - 34, 10, 22);
          else ctx.drawImage(ew, c.x + ART_W - 18, c.y + at, 10, 22);
        }
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
            if (!l.rect.alive || (l.rect.seed + i) % 4 === 0 || night <= l.at) continue; // Bazı evlerde ışık kapalı
            if (l.rect.tall > 0 && game.cam.y <= l.rect.y + l.rect.h) continue; // Bu açıda cephe görünmez, ışık çatıya binmesin
            ctx.globalAlpha = Math.min(1, (night - l.at) / 0.16) * 0.85; // Her pencere kendi sırasında yanar
            ctx.drawImage(sp.win, l.x, l.y, l.w, l.h);
          } else if (l.kind === 2) {
            if (!l.rect.alive) continue;
            ctx.globalAlpha = night * (0.65 + 0.3 * Math.sin(now * 0.006 + l.x));
            ctx.drawImage(sp.neons[l.rect.seed % sp.neons.length], l.x - 50, l.y - 50, l.w + 100, l.h + 100);
          }
        }
      }
    }
    // Tabelalar gece aydınlık kalır. Alçak binalarınki zemindeki yerinde, yüksek binalarınki çatıda
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = game.world.chunk(cx, cy);
        for (let i = 0; i < c.lightCount; i++) {
          const l = c.lights[i];
          if (l.kind < 2 || !l.rect.alive || l.rect.tall > 0 || l.x + l.w < x0 || l.x > x1 || l.y + l.h < y0 || l.y > y1 + 40) continue;
          const img = rectSign(l.rect);
          this.litSign(l.rect, img, groundSignBox(l.rect, img, c), night, now, 0, true);
        }
      }
    }
    const talls = this.tallList;
    const cam = game.cam;
    for (let i = 0; i < talls.length; i++) {
      const r = talls[i];
      if (r.tX1 < x0 || r.tX0 > x1 || r.tY1 < y0 || r.tY0 > y1) continue;
      if (r.landmark) this.litLandmark(r, night, now, i + 1, cam);
      if (!r.sign) continue;
      const img = rectSign(r);
      if (!r.noRoofSign) this.litSign(r, img, roofSignBox(r, img), night, now, i + 1, cam.y > r.y + r.h);
      if (r.landmark) {
        const b = facadeSignBox(r, img, cam.y);
        if (b) this.litSign(r, img, { x: b.x, y: b.y, w: b.w, h: b.h }, night, now, i + 1, false);
      }
    }
    // Araç farları
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = night;
    const beam = sp.beam;
    const bw = beam.width / SPR;
    const bh = beam.height / SPR;
    const head = (b) => {
      if (b.x < x0 - 120 || b.x > x1 + 120 || b.y < y0 - 120 || b.y > y1 + 120) return;
      this.place(b.x + Math.cos(b.a) * b.len * 0.46, b.y + Math.sin(b.a) * b.len * 0.46, b.a);
      ctx.drawImage(beam, -bw / 2, -bh / 2, bw, bh);
      // Stop lambası ve farın asfalttaki parıltısı
      ctx.globalAlpha = night * 0.7;
      ctx.drawImage(sp.tail, -b.len * 0.92 - 14, -14, 28, 28);
      ctx.globalAlpha = night * 0.32;
      ctx.drawImage(sp.lamp, 40, -44, 110, 88);
      ctx.globalAlpha = night;
    };
    if (game.state === 'play') head(game.player);
    for (let i = 0; i < game.cops.length; i++) { const c = game.cops[i]; if (c.type !== 'tank' && !c.flying) head(c); }
    for (let i = 0; i < game.crowd.npcs.length; i++) { const n = game.crowd.npcs[i]; if (n.alive && n.state === 'drive') head(n); }
    for (let i = 0; i < game.crowd.hw.length; i++) { const n = game.crowd.hw[i]; if (n.alive) head(n); }
    ctx.globalCompositeOperation = 'source-over';
    // Gök: üst kenarda ay ve sırayla parıldayan yıldızlar
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    if (night > 0.3 && this.lod.night > 0) {
      const a = (night - 0.3) / 0.7;
      const W = this.w;
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 2; i++) {
        ctx.globalAlpha = a * (0.45 + 0.4 * Math.sin(now * 0.0016 + i * 2.4));
        ctx.drawImage(sp.stars[i], 0, 0, W, 104);
      }
      ctx.globalAlpha = a * 0.95;
      ctx.drawImage(sp.moon, W * 0.62, 12, 44, 44);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.globalAlpha = 1;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  // Tek tabelanın gece hâli: yazı, tam arkasında ışıltı, yola düşen yansıma.
  // from: tallList içinde bu tabelayı örtebilecek ilk bina. Örtenlerin izdüşümü kırpılır
  litSign(r, img, b, night, now, from, reflect) {
    const ctx = this.ctx;
    const x = b.x; const y = b.y; const w = b.w; const h = b.h;
    const bottom = reflect ? Math.max(y + h + 22, r.y + r.h + 38) : y + h + 22;
    const clipped = this.clipOccluders(x - 26, y - 22, w + 52, bottom - y + 22, from);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = night * 0.9;
    ctx.drawImage(img, x, y, w, h);
    if (this.lod.night > 0) {
      const halo = signHalo(r.signColor);
      const flick = signKind(r.sign) === 'led' ? 0.82 + 0.18 * Math.sin(now * 0.02 + r.seed) : 1;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = night * 0.6 * flick;
      ctx.drawImage(img, x, y, w, h);
      ctx.globalAlpha = night * 0.5 * flick;
      ctx.drawImage(halo, x - 26, y - 22, w + 52, h + 44);
      if (reflect && this.lod.night >= 2) {
        ctx.globalAlpha = night * 0.3;
        ctx.drawImage(halo, r.x - 6, r.y + r.h - 2, r.w + 12, 40);
      }
    }
    if (clipped) ctx.restore();
  }

  // Özel yapının gece pencereleri ve kulenin ikaz lambası. Öndeki binalar kırpar
  litLandmark(r, night, now, from, cam) {
    const art = tallArt(r);
    if (!art) return;
    const ctx = this.ctx;
    const minX = Math.min(r.x, r.tX0); const maxX = Math.max(r.x + r.w, r.tX1);
    const minY = Math.min(r.y, r.tY0); const maxY = Math.max(r.y + r.h, r.tY1);
    const clipped = this.clipOccluders(minX, minY, maxX - minX, maxY - minY, from);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = Math.min(1, night * 1.1);
    this.tallWalls(r, { n: art.litN, e: art.litE }, art, cam.x, cam.y, this.lod.slices, false);
    if (art.beacon) {
      const on = Math.floor(now / 700) % 2 === 0;
      const bx = (r.tX0 + r.tX1) / 2; const by = (r.tY0 + r.tY1) / 2;
      ctx.globalAlpha = night * (on ? 0.95 : 0.25);
      ctx.drawImage(this.sprites.red, bx - 40, by - 40, 80, 80);
    }
    ctx.globalCompositeOperation = 'source-over';
    if (clipped) ctx.restore();
  }

  // Kutunun üstüne binen yüksek bina gövdelerini (taban ve çatının dış zarfı) çizim alanından çıkarır
  clipOccluders(x, y, w, h, from) {
    const ctx = this.ctx;
    const list = this.tallList;
    let clipped = false;
    for (let i = from; i < list.length; i++) {
      const r = list[i];
      const x0 = r.x; const x1 = r.x + r.w; const y0 = r.y; const y1 = r.y + r.h;
      const minX = Math.min(x0, r.tX0); const maxX = Math.max(x1, r.tX1);
      const minY = Math.min(y0, r.tY0); const maxY = Math.max(y1, r.tY1);
      if (maxX <= x || minX >= x + w || maxY <= y || minY >= y + h) continue;
      if (!clipped) { ctx.save(); clipped = true; }
      ctx.beginPath();
      ctx.rect(x - 400, y - 400, w + 800, h + 800);
      const top = r.tY0 < y0; const bot = r.tY1 > y1; const left = r.tX0 < x0; const right = r.tX1 > x1;
      ctx.moveTo(top ? r.tX0 : x0, minY);
      ctx.lineTo(top ? r.tX1 : x1, minY);
      ctx.lineTo(maxX, right ? r.tY0 : y0);
      ctx.lineTo(maxX, right ? r.tY1 : y1);
      ctx.lineTo(bot ? r.tX1 : x1, maxY);
      ctx.lineTo(bot ? r.tX0 : x0, maxY);
      ctx.lineTo(minX, left ? r.tY1 : y1);
      ctx.lineTo(minX, left ? r.tY0 : y0);
      ctx.closePath();
      ctx.clip('evenodd');
    }
    return clipped;
  }

  // Hilede bina içinden geçen araç kaybolmaz: en üstte yarı saydam görünür
  drawPhasing(game) {
    if (!game.phasing || game.state !== 'play') return;
    const ctx = this.ctx;
    const p = game.player;
    const img = this.playerSprite;
    const k = p.len / game.carSpec.len;
    const w = (img.wu || img.width / SPR) * k;
    const h = (img.hu || img.height / SPR) * k;
    this.place(p.x, p.y, p.a);
    ctx.globalAlpha = 0.72;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
    ctx.globalAlpha = 1;
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawHighway(game, x0, x1, y0, y1) {
    const sp = this.sprites.npc;
    const list = game.crowd.hw;
    for (const h of list) {
      if (!h.alive || h.x < x0 - 80 || h.x > x1 + 80 || h.y < y0 - 60 || h.y > y1 + 60) continue;
      const key = `${h.kind}${h.color}`;
      let img = sp[key];
      if (!img) {
        img = sheetSprite(`npc:${h.kind}:${h.color}`, h.spec.len);
        if (!img) continue;
        sp[key] = img;
      }
      this.drawBody(img, h);
    }
    this.ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
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
    ctx.globalAlpha = 0.42;
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
    if (game.drop) {
      // Düşen araç: yerde büyüyen gölge, ekranın üstünden inen gövde
      const D = game.drop;
      const fall = D.y * (game.cam.halfH + 120);
      const q = k * D.size;
      this.place(p.x, p.y, p.a);
      ctx.globalAlpha = 0.55 * D.shadow;
      const sw = p.len * (0.7 + 0.5 * D.y) * D.size; const sh = p.wid * (0.8 + 0.5 * D.y) * D.size;
      ctx.drawImage(this.sprites.dark, -sw * 0.75, -sh * 0.75, sw * 1.5, sh * 1.5);
      ctx.globalAlpha = 1;
      if (D.y > 0.02) {
        ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
        const tail = 70 + 230 * D.y;
        const tw = p.wid * D.size * 1.05;
        const tg = ctx.createLinearGradient(0, p.y - fall - tail, 0, p.y - fall);
        tg.addColorStop(0, 'rgba(33,230,255,0)'); tg.addColorStop(1, 'rgba(210,250,255,.8)');
        ctx.fillStyle = tg;
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath(); ctx.moveTo(p.x - tw * 0.2, p.y - fall - tail); ctx.lineTo(p.x + tw * 0.2, p.y - fall - tail); ctx.lineTo(p.x + tw / 2, p.y - fall); ctx.lineTo(p.x - tw / 2, p.y - fall); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }
      this.place(p.x, p.y - fall, p.a);
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = CONFIG.playerGlow.alpha;
      const gw = p.len * CONFIG.playerGlow.scale * D.size; const gh = p.wid * CONFIG.playerGlow.scale * 1.3 * D.size;
      ctx.drawImage(this.sprites.auras[3], -gw / 2, -gh / 2, gw, gh);
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      const w = (this.playerSprite.wu || this.playerSprite.width / SPR) * q;
      const h = (this.playerSprite.hu || this.playerSprite.height / SPR) * q;
      ctx.drawImage(this.playerSprite, -w / 2, -h / 2, w, h);
      ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
      return;
    }
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
    // Oyuncu aracının altında boya rengine yakın ışık
    const PG = CONFIG.playerGlow;
    this.place(p.x, p.y, p.a);
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = PG.alpha * (game.ghostT > 0 ? 0.5 : 1);
    const gw = p.len * PG.scale; const gh = p.wid * PG.scale * 1.3;
    ctx.drawImage(this.sprites.auras[3], -gw / 2, -gh / 2, gw, gh);
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = game.ghostT > 0 ? 0.5 : 1;
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
    if (k <= 0 || game.state !== 'play' || !this.lod.speedLines) return;
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


// --- cheat.js ---
// Basış sırası denetleyicisi. Girişten bağımsızdır: dokunuş, tuş ve eksen aynı yola gelir.
// DOM'a dokunmaz, birim testle sınanır.

const C = CONFIG.cheat;

class CheatCode {
  constructor() {
    this.i = 0;
    this.t = 0;
  }

  reset() {
    this.i = 0;
  }

  // dir: 'L' ya da 'R', now: saniye. Sıra tamamlanınca true döner
  press(dir, now) {
    // Sınır dahil değildir: tam 2 sn de geçersizdir. Adım toplamındaki kayan nokta payı yutulur
    if (this.i > 0 && now - this.t >= C.gap - 1e-6) this.i = 0;
    if (dir === C.sequence[this.i]) this.i++;
    else this.i = dir === C.sequence[0] ? 1 : 0;
    this.t = now;
    if (this.i < C.sequence.length) return false;
    this.i = 0;
    return true;
  }
}

// --- input.js ---
// Üç dokunmatik kontrol tek yerde. Klavye her modda aynı çalışır.
// zones: sağ yarı = sağa, sol yarı = sola, ikisi birden = geri (eski sistem, aynen).
// wheel: sağ altta direksiyon, parmağın merkeze göre açısını izler.
// stick: sol yarıda basılan yerde beliren görünmez joystick.
// DOM'a dokunmaz: görünüm controls.js'tedir, burası birim testle sınanır.

const CONTROLS = ['zones', 'wheel', 'stick'];
const WHEEL_MAX = (130 * Math.PI) / 180; // Tam kilit açısı
const WHEEL_RETURN = 11; // Bırakınca ortaya dönüş hızı
const WHEEL_HOLE = 0.16; // Merkeze bu orandan yakın parmakta açı kararsızdır
const WHEEL_DEAD = 0.03;
const STICK_R = 54; // Joystick yarıçapı, px
const STICK_DEAD = 8; // Bu kadar kayma titreme sayılır, px
const STICK_SMOOTH = 24;
const CH = CONFIG.cheat;

const wrap = (a) => {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
};

class Input {
  constructor() {
    this.mode = 'zones';
    this.touches = new Map(); // pointerId -> 'L' | 'R'
    this.keyL = false;
    this.keyR = false;
    this.width = 1;
    this.last = 'R'; // Son basılan yön: iki parmak kısa süre çakışınca bu kazanır
    this.bothT = 0;
    this.wheel = { cx: 0, cy: 0, r: 0 }; // Görünüm yerleşimden sonra doldurur
    this.wheelId = null;
    this.wheelA = 0; // Direksiyon açısı, radyan
    this.wheelPrev = 0;
    this.stickId = null;
    this.stick = { on: false, x: 0, y: 0, dx: 0, dy: 0 };
    this.axis = 0; // Yumuşatılmış analog direksiyon
    this.revHeld = false;
    this.bounds = { l: 0, t: 0, r: 1, b: 1 }; // Joystick halkası bunun dışına taşmaz
    this.code = new CheatCode();
    this.onCode = null;
    this.clock = 0; // Yalnız oyun adımlarında akar: duraklatma sayılmaz
    this.heldT = 0;
    this.axisReady = true;
  }

  setMode(mode) {
    this.clear();
    this.mode = CONTROLS.includes(mode) ? mode : 'zones';
  }

  // Her fizik adımında çağrılır
  tick(dt) {
    this.bothT = this.left && this.right ? this.bothT + dt : 0;
    if (this.mode === 'wheel') {
      if (this.wheelId === null) this.wheelA *= Math.exp(-WHEEL_RETURN * dt);
      if (Math.abs(this.wheelA) < 0.004) this.wheelA = this.wheelId === null ? 0 : this.wheelA;
      const v = this.wheelA / WHEEL_MAX;
      this.axis = Math.abs(v) < WHEEL_DEAD ? 0 : v;
    } else if (this.mode === 'stick') {
      const s = this.stick;
      const m = Math.abs(s.dx);
      const target = !s.on || m <= STICK_DEAD ? 0 : Math.sign(s.dx) * Math.min(1, (m - STICK_DEAD) / (STICK_R - STICK_DEAD));
      this.axis += (target - this.axis) * (1 - Math.exp(-STICK_SMOOTH * dt));
      if (Math.abs(this.axis) < 0.005) this.axis = 0;
    }
    this.watchCode(dt);
  }

  // Direksiyon ve joystick: eşiği aşan kısa hareket bir basıştır, sonraki için merkeze dönmek gerekir.
  // Uzun tutuş normal sürüştür, sırayı bozar
  watchCode(dt) {
    this.clock += dt;
    const a = this.axis;
    const abs = Math.abs(a);
    if (abs < CH.axisBack) this.axisReady = true;
    else if (this.axisReady && abs >= (this.mode === 'wheel' ? CH.wheelOn : CH.stickOn)) {
      this.axisReady = false;
      this.tap(a < 0 ? 'L' : 'R');
    }
    this.heldT = this.left || this.right || abs >= CH.axisBack ? this.heldT + dt : 0;
    if (this.heldT > CH.maxHold) this.code.reset();
  }

  tap(dir) {
    if (this.code.press(dir, this.clock) && this.onCode) this.onCode();
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
    return this.revHeld || this.bothT >= CONFIG.input.bothDelay;
  }

  get steer() {
    const l = this.left;
    const r = this.right;
    if (!l && !r) return this.axis;
    if (l && r) return this.reverse ? 0 : this.last === 'R' ? 1 : -1;
    return r ? 1 : -1;
  }

  press(id, side) {
    this.touches.set(id, side);
    this.last = side;
    this.tap(side);
  }

  release(id) {
    this.touches.delete(id);
  }

  // Tüm parmaklar ve tuşlar bırakılır: takılı kalan yön olmaz
  clear() {
    this.touches.clear();
    this.keyL = false;
    this.keyR = false;
    this.bothT = 0;
    this.wheelId = null;
    this.wheelA = 0;
    this.stickId = null;
    this.stick.on = false;
    this.stick.dx = 0;
    this.stick.dy = 0;
    this.axis = 0;
    this.revHeld = false;
    this.code.reset();
    this.heldT = 0;
    this.axisReady = true;
  }

  sideOf(x) {
    return x < this.width / 2 ? 'L' : 'R';
  }

  key(code, down) {
    if (code === 'ArrowLeft' || code === 'KeyA') { this.keyL = down; if (down) { this.last = 'L'; this.tap('L'); } return true; }
    if (code === 'ArrowRight' || code === 'KeyD') { this.keyR = down; if (down) { this.last = 'R'; this.tap('R'); } return true; }
    return false;
  }

  // Parmak kendi rolünü basıldığı anda alır. true dönerse bu parmak kontrolü kullanıyor.
  down(id, x, y) {
    if (this.mode === 'zones') { this.press(id, this.sideOf(x)); return true; }
    if (this.mode === 'wheel') {
      if (this.wheelId !== null) return false;
      const w = this.wheel;
      const dx = x - w.cx; const dy = y - w.cy;
      if (!w.r || dx * dx + dy * dy > w.r * w.r * 1.2) return false; // Dışarıdaki dokunuş direksiyonu etkilemez
      this.wheelId = id;
      this.wheelPrev = Math.atan2(dy, dx);
      return true;
    }
    if (this.stickId !== null || x >= this.width / 2) return false;
    const b = this.bounds;
    const room = STICK_R + 8;
    const s = this.stick;
    this.stickId = id;
    s.on = true;
    s.x = Math.max(b.l + room, Math.min(b.r - room, x));
    s.y = Math.max(b.t + room, Math.min(b.b - room, y));
    s.dx = 0;
    s.dy = 0;
    return true;
  }

  move(id, x, y) {
    if (this.mode === 'zones') {
      if (this.touches.has(id)) this.touches.set(id, this.sideOf(x));
      return;
    }
    if (id === this.wheelId) {
      const w = this.wheel;
      const dx = x - w.cx; const dy = y - w.cy;
      if (dx * dx + dy * dy < w.r * w.r * WHEEL_HOLE * WHEEL_HOLE) return;
      const a = Math.atan2(dy, dx);
      this.wheelA = Math.max(-WHEEL_MAX, Math.min(WHEEL_MAX, this.wheelA + wrap(a - this.wheelPrev)));
      this.wheelPrev = a;
    } else if (id === this.stickId) {
      const s = this.stick;
      s.dx = Math.max(-STICK_R, Math.min(STICK_R, x - s.x));
      s.dy = Math.max(-STICK_R, Math.min(STICK_R, y - s.y));
    }
  }

  up(id) {
    this.touches.delete(id);
    if (id === this.wheelId) this.wheelId = null;
    if (id === this.stickId) {
      this.stickId = null;
      this.stick.on = false;
      this.stick.dx = 0;
      this.stick.dy = 0;
    }
  }

  // Dokunma yüzeyine bağlanır. Duraklat gibi düğmeler kendi olaylarını alır, buraya gelmez.
  attach(el, win = window) {
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault();
      if (!this.down(e.pointerId, e.clientX, e.clientY)) return;
      try { el.setPointerCapture(e.pointerId); } catch { /* bazı tarayıcılar reddeder */ }
    });
    el.addEventListener('pointermove', (e) => {
      // Bırakma olayı kaçtıysa parmak kalkmış demektir: fare için buttons 0 olur
      if (e.pointerType === 'mouse' && e.buttons === 0) { this.up(e.pointerId); return; }
      this.move(e.pointerId, e.clientX, e.clientY);
    });
    const end = (e) => this.up(e.pointerId);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('lostpointercapture', end);
    win.addEventListener('pointerup', end);
    win.addEventListener('pointercancel', end);
    win.addEventListener('keydown', (e) => { if (!e.repeat && this.key(e.code, true)) e.preventDefault(); });
    win.addEventListener('keyup', (e) => { this.key(e.code, false); });
    win.addEventListener('blur', () => this.clear());
    win.addEventListener('pagehide', () => this.clear());
    if (win.document) win.document.addEventListener('visibilitychange', () => { if (win.document.hidden) this.clear(); });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}

// --- controls.js ---
// Dokunmatik kontrollerin görünümü. Yalnız dönüşüm yazar, değer değişmedikçe DOM'a dokunmaz.
const $c = (id) => document.getElementById(id);

class ControlView {
  constructor(input) {
    this.input = input;
    this.wheel = $c('ctl-wheel');
    this.rim = $c('ctl-rim');
    this.stick = $c('ctl-stick');
    this.knob = $c('ctl-knob');
    this.rev = $c('ctl-rev');
    this.hud = $c('hud');
    this.needLayout = true;
    this.lastA = null;
    this.lastK = '';
    this.lastOn = null;
    const set = (on, e) => {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      input.revHeld = on;
      this.rev.classList.toggle('down', on);
    };
    this.rev.style.touchAction = 'none';
    this.rev.addEventListener('pointerdown', (e) => {
      try { this.rev.setPointerCapture(e.pointerId); } catch { /* reddedebilir */ }
      set(true, e);
    });
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) this.rev.addEventListener(ev, () => set(false));
  }

  // Mod değişince eskisi tamamen kapanır
  setMode(mode) {
    this.wheel.hidden = mode !== 'wheel';
    this.stick.hidden = mode !== 'stick';
    this.rev.hidden = mode === 'zones';
    this.rev.dataset.side = mode === 'wheel' ? 'left' : 'right';
    this.rev.classList.remove('down');
    this.stick.classList.remove('on');
    this.lastOn = null;
    this.lastA = null;
    this.needLayout = true;
  }

  // Güvenli alan ve boyut CSS'te; gerçek yer buradan okunur
  layout() {
    const inp = this.input;
    const vw = window.innerWidth; const vh = window.innerHeight;
    inp.width = vw;
    const pad = this.hud.getBoundingClientRect();
    inp.bounds = { l: 0, t: 0, r: vw, b: vh };
    if (pad.width) {
      const cs = getComputedStyle(this.hud);
      inp.bounds = { l: parseFloat(cs.getPropertyValue('--ctl-l')) || 0, t: 0, r: vw - (parseFloat(cs.getPropertyValue('--ctl-r')) || 0), b: vh - (parseFloat(cs.getPropertyValue('--ctl-b')) || 0) };
    }
    if (!this.wheel.hidden) {
      const r = this.wheel.getBoundingClientRect();
      inp.wheel.cx = r.left + r.width / 2;
      inp.wheel.cy = r.top + r.height / 2;
      inp.wheel.r = r.width / 2;
    }
    this.needLayout = false;
  }

  // Her kare çağrılır
  update() {
    if (this.hud.hidden) { this.needLayout = true; return; }
    if (this.needLayout) this.layout();
    const inp = this.input;
    if (inp.mode === 'wheel') {
      const a = Math.round(inp.wheelA * 200) / 200;
      if (a !== this.lastA) {
        this.lastA = a;
        this.rim.style.transform = `rotate(${a}rad)`;
      }
    } else if (inp.mode === 'stick') {
      const s = inp.stick;
      if (s.on !== this.lastOn) {
        this.lastOn = s.on;
        this.stick.classList.toggle('on', s.on);
      }
      if (s.on) {
        const k = `${s.x},${s.y},${Math.round(s.dx)},${Math.round(s.dy * 0.4)}`;
        if (k !== this.lastK) {
          this.lastK = k;
          this.stick.style.transform = `translate(${s.x}px,${s.y}px)`;
          this.knob.style.transform = `translate(${Math.round(s.dx)}px,${Math.round(s.dy * 0.4)}px)`;
        }
      }
    }
  }
}

// --- storage.js ---
// En yüksek skor, coin, arabalar ve ayarlar localStorage'da.

const KEY = 'drift-lab-v1';

function defaultSave() {
  return {
    bestScore: 0,
    bestTime: 0,
    coins: 0,
    owned: [CONFIG.cars[0].id],
    selected: CONFIG.cars[0].id,
    settings: { sound: true, vibrate: true, ambient: true, volume: 80, quality: 'auto', qLevel: -1, control: 'zones', lang: '' },
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
    if (Number.isFinite(data.settings.volume)) d.settings.volume = Math.max(0, Math.min(100, data.settings.volume));
    if (['auto', 'high', 'low'].includes(data.settings.quality)) d.settings.quality = data.settings.quality;
    if (Number.isInteger(data.settings.qLevel) && data.settings.qLevel >= -1 && data.settings.qLevel <= 3) d.settings.qLevel = data.settings.qLevel;
    if (['zones', 'wheel', 'stick'].includes(data.settings.control)) d.settings.control = data.settings.control;
    if (['tr', 'en', 'ja', 'zh', 'es', 'de'].includes(data.settings.lang)) d.settings.lang = data.settings.lang;
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

// Motor karakterleri. harm: ana sesin harmonikleri, sub: yarım perde gövde, high: çift perde vızıltı,
// air: emiş gürültüsü, rough: tırtıl derinliği, roughRate: tırtılın ateşleme frekansına oranı, lp: süzgeç alt ve üst sınırı
const ENGINE_KINDS = {
  v8: { harm: [1, 0.85, 0.6, 0.42, 0.26, 0.14], sub: 0.75, high: 0.1, air: 0.05, rough: 0.2, roughRate: 0.25, lp: [260, 1500] },
  thin: { harm: [0.55, 1, 0.7, 0.5, 0.42, 0.3], sub: 0.08, high: 0.34, air: 0.03, rough: 0.05, roughRate: 0.33, lp: [620, 3800] },
  inline: { harm: [1, 0.7, 0.42, 0.26, 0.14], sub: 0.3, high: 0.16, air: 0.05, rough: 0.07, roughRate: 0.5, lp: [420, 2500] },
  old: { harm: [1, 0.95, 0.75, 0.55, 0.3], sub: 0.5, high: 0.08, air: 0.09, rough: 0.62, roughRate: 0.25, lp: [240, 1150] },
  turbo: { harm: [0.9, 0.8, 0.6, 0.5, 0.35, 0.25], sub: 0.4, high: 0.26, air: 0.16, rough: 0.1, roughRate: 0.5, lp: [420, 3000] },
  diesel: { harm: [1, 0.9, 0.8, 0.6, 0.4], sub: 0.6, high: 0.06, air: 0.1, rough: 0.34, roughRate: 0.5, lp: [210, 850] },
  moto: { harm: [0.7, 1, 0.85, 0.6, 0.5, 0.4], sub: 0.14, high: 0.3, air: 0.06, rough: 0.12, roughRate: 0.25, lp: [700, 4600] },
  ev: { harm: [1, 0, 0.14, 0, 0.05], sub: 0, high: 0.44, air: 0, rough: 0, roughRate: 0, lp: [1800, 6500] },
};

// Hız oranından devir ve vites: vites büyüdükçe devir düşer, tepe devre ulaşınca sıradaki vitese atar
function engineRpm(e, k) {
  const n = e.gears;
  const speed = Math.max(0, Math.min(1.1, k));
  if (n === 1) return { rpm: e.idle + (e.red - e.idle) * Math.min(1, speed), gear: 0 };
  const g = Math.min(n - 1, Math.floor(speed * n));
  const within = Math.min(1, speed * n - g);
  const low = g === 0 ? e.idle : e.red * 0.6;
  return { rpm: low + (e.red - low) * within, gear: g };
}

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ambientOn = true;
    this.ambT = 2;
    this.engine = CONFIG.cars[0].engine;
    this.volume = 0.8;
    this.nightK = 0;
    this.pv = null;
    this.gear = 0;
    this.shiftT = 0;
    this.coinStreak = 0;
    this.coinAt = 0;
    this.master = null;
    this.running = false;
  }

  // Tarayıcılar sesi yalnızca kullanıcı dokunuşundan sonra başlatır
  // Gürültü örnekleri önceden hazırlanır: ilk dokunuşta ana iş parçacığı beklemez
  prepare() {
    if (this.noiseData) return;
    const d = new Float32Array(96000);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    this.noiseData = d;
  }

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
    this.master.gain.value = this.enabled ? this.volume : 0;
    const comp = ctx.createDynamicsCompressor();
    this.master.connect(comp);
    comp.connect(ctx.destination);

    // Beyaz gürültü tamponu: drift, çarpma, patlama
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    this.prepare();
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i += this.noiseData.length) d.set(this.noiseData.subarray(0, Math.min(this.noiseData.length, len - i)), i);

    // Motor: ateşleme sesi, yarım perde gövde, çift perde vızıltı ve emiş gürültüsü. Hepsi tırtıl kazancından geçer
    this.engGain = ctx.createGain();
    this.engGain.gain.value = 0;
    this.engFilter = ctx.createBiquadFilter();
    this.engFilter.type = 'lowpass';
    this.engFilter.frequency.value = 500;
    this.engRough = ctx.createGain();
    this.engRough.gain.value = 1;
    this.engFilter.connect(this.engRough);
    this.engRough.connect(this.engGain);
    this.engGain.connect(this.master);
    const layer = (type) => {
      const o = ctx.createOscillator();
      o.type = type;
      const g = ctx.createGain();
      o.connect(g);
      g.connect(this.engFilter);
      o.start();
      return { o, g };
    };
    this.eng1 = layer('sawtooth');
    this.eng2 = layer('sawtooth');
    this.eng3 = layer('square');
    const air = ctx.createBufferSource();
    air.buffer = this.noise;
    air.loop = true;
    this.engAirF = ctx.createBiquadFilter();
    this.engAirF.type = 'bandpass';
    this.engAirF.Q.value = 1.2;
    this.engAir = ctx.createGain();
    this.engAir.gain.value = 0;
    air.connect(this.engAirF);
    this.engAirF.connect(this.engAir);
    this.engAir.connect(this.engGain);
    air.start();
    this.lfo = ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfoGain = ctx.createGain();
    this.lfoGain.gain.value = 0;
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.engRough.gain);
    this.lfo.start();
    this.waves = {};

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
    this.sirenMask = new Uint8Array(CONFIG.sirens.length);
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
    const K = ENGINE_KINDS[e.kind] || ENGINE_KINDS.inline;
    this.kind = K;
    if (!this.waves[e.kind]) {
      const real = new Float32Array(K.harm.length + 1);
      const imag = new Float32Array(K.harm.length + 1);
      K.harm.forEach((v, i) => { imag[i + 1] = v; });
      this.waves[e.kind] = this.ctx.createPeriodicWave(real, imag);
    }
    this.eng1.o.setPeriodicWave(this.waves[e.kind]);
    const t = this.ctx.currentTime;
    this.eng2.g.gain.setTargetAtTime(K.sub, t, 0.02);
    this.eng3.g.gain.setTargetAtTime(K.high, t, 0.02);
    this.lfoGain.gain.setTargetAtTime(K.rough * 0.5, t, 0.02);
    this.engAir.gain.setTargetAtTime(K.air, t, 0.02);
  }

  // Motor ön izlemesi: rev gazlama, start kontak ve çalışma
  preview(e, mode = 'rev') {
    if (!this.ctx || !this.enabled) return;
    this.setEngine(e);
    this.pv = { mode, at: this.ctx.currentTime, len: mode === 'start' ? 1.5 : 1.25 };
    if (mode === 'start') {
      // Marş dişlisi: hızlı tekrar eden kısa vuruşlar
      if (e.kind !== 'ev') for (let i = 0; i < 6; i++) this.tone(120 + i * 8, 0.05, 0.05, 'square', 70, i * 0.055);
      else this.tone(500, 0.4, 0.04, 'sine', 1800);
    }
  }

  // BAŞLA: iki kısa 8-bit nota
  press() {
    if (!this.ctx || !this.enabled) return;
    this.tone(620, 0.07, 0.09, 'sine', 470);
    this.tone(930, 0.08, 0.045, 'triangle', 0, 0.015);
  }

  // Yola iniş: gövde vuruşu, lastik cıyaklaması
  landing() {
    if (!this.ctx || !this.enabled) return;
    this.tone(95, 0.3, 0.42, 'sine', 34);
    this.burst(0.18, 700, 0.3, 'lowpass');
    this.tone(1120, 0.26, 0.05, 'sawtooth', 780, 0.02);
    this.burst(0.3, 2100, 0.1, 'bandpass', 1200);
  }

  // Ön izleme eğrisi: 0-1 arası ilerlemeden hız oranı ve gaz
  previewState(pv, now) {
    const u = (now - pv.at) / pv.len;
    if (u >= 1) return null;
    if (pv.mode === 'start') {
      if (u < 0.22) return { k: 0, gas: 0, vol: 0 };
      const v = (u - 0.22) / 0.78;
      return { k: 0.28 * Math.sin(Math.min(1, v * 1.8) * Math.PI) + 0.05, gas: v < 0.5 ? 1 : 0.4, vol: Math.min(1, v * 6) * (1 - v * v) };
    }
    return { k: 0.62 * Math.sin(u * Math.PI), gas: u < 0.55 ? 1 : 0.2, vol: Math.min(1, u * 8) * Math.min(1, (1 - u) * 5) };
  }

  setAmbient(on) {
    this.ambientOn = on;
    if (this.ambGain) this.ambGain.gain.setTargetAtTime(on ? 0.035 : 0, this.ctx.currentTime, 0.2);
  }

  setVolume(v) {
    this.volume = v;
    if (this.master) this.master.gain.setTargetAtTime(this.enabled ? v : 0, this.ctx.currentTime, 0.02);
  }

  setEnabled(on) {
    this.enabled = on;
    if (this.master) this.master.gain.setTargetAtTime(on ? this.volume : 0, this.ctx.currentTime, 0.02);
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
    // Saniyede 30 kez yeter: yumuşatma ses iş parçacığında sürer, kare başına onlarca olay yazılmaz
    if (now - (this.upAt || 0) < 30) return;
    this.upAt = now;
    const t = c.currentTime;
    const p = game.player;
    const on = active && game.state === 'play';
    this.nightK = game.daylight ? game.daylight.k : 0;
    let k = Math.min(1.1, p.speed / game.carSpec.maxSpeed);
    let gas = on ? (p.gas ?? 1) : 0;
    let vol = on ? 1 : 0;
    // Ön izleme oyundan bağımsız çalar. Oyun başlayınca yerini gerçek sürüşe bırakır
    if (this.pv) {
      const s = this.previewState(this.pv, t);
      if (s && !(on && this.pv.mode !== 'start')) { k = s.k; gas = s.gas; vol = Math.max(vol * 0.6, s.vol); }
      if (!s) { this.pv = null; if (this.engine !== game.carSpec.engine) this.setEngine(game.carSpec.engine); }
    }
    const e = this.engine;
    const K = this.kind;
    // Kayarken tekerlek boşa döner: devir fırlar
    const spin = on && p.drifting ? 0.09 : 0;
    const state = engineRpm(e, k + spin);
    if (state.gear !== this.gear) {
      if (state.gear > this.gear) this.shiftT = t + 0.09; // Vites atarken gaz bir an kesilir
      this.gear = state.gear;
    }
    const cut = t < this.shiftT ? 0.45 : 1;
    const rpm = state.rpm * (gas < 0.2 ? 0.86 : 1);
    const f0 = Math.max(18, (rpm / 60) * (e.cyl / 2));
    const ratio = Math.min(1, rpm / e.red);
    const glide = t < this.shiftT ? 0.03 : 0.07;
    this.eng1.o.frequency.setTargetAtTime(f0, t, glide);
    this.eng2.o.frequency.setTargetAtTime(f0 / 2, t, glide);
    this.eng3.o.frequency.setTargetAtTime(f0 * 2, t, glide);
    this.lfo.frequency.setTargetAtTime(Math.max(4, f0 * K.roughRate), t, 0.08);
    this.engAirF.frequency.setTargetAtTime(500 + 1900 * ratio, t, 0.08);
    this.engFilter.frequency.setTargetAtTime(K.lp[0] + (K.lp[1] - K.lp[0]) * ratio * (0.35 + 0.65 * gas), t, 0.07);
    this.engGain.gain.setTargetAtTime(vol * (0.05 + 0.05 * ratio + 0.05 * gas) * e.gain * cut, t, 0.05);

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
    const mask = loudest(S, CONFIG.pursuit.maxSirens, this.sirenMask);
    const setVoice = (name, freq, gate = 1) => {
      const v = this.voices[name];
      const d = S[CONFIG.sirens.indexOf(name)];
      if (on && d < 1300 && gate && mask[CONFIG.sirens.indexOf(name)]) {
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
  // Gece: uzaktan havlayan köpek ve cırcır böceği
  nightSound() {
    if (Math.random() < 0.55) {
      const n = 2 + Math.floor(Math.random() * 3);
      const f = 330 + Math.random() * 160;
      for (let i = 0; i < n; i++) { this.tone(f, 0.11, 0.022, 'sawtooth', f * 0.62, i * 0.24); this.tone(f * 1.5, 0.08, 0.008, 'square', f, i * 0.24); }
    } else {
      for (let i = 0; i < 8; i++) this.tone(4300, 0.035, 0.007, 'sine', 0, i * 0.075);
    }
  }

  streetSound() {
    if (this.nightK > 0.6 && Math.random() < 0.6) { this.nightSound(); return; }
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

  // Gizli ödül: yükselen dört nota, kapanışta iki inen nota
  cheat(on) {
    const notes = on ? [523, 659, 784, 1047] : [659, 440];
    notes.forEach((f, i) => this.tone(f, 0.16, 0.2, 'triangle', f * 1.01, i * 0.09));
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

// --- pixelcars.js ---
// Garaj arabaları: yandan görünüş, kod ile piksel piksel çizilir. Marka rozeti yoktur.
// Her araç 120x48 mantıksal tuval, CSS ile keskin büyütülür.
const PXC_W = 120;
const PXC_H = 48;

// x0-x1 boy, deck bagaj, hood kaput, roof tavan yüksekliği; cr-rr-rf-cf kabin noktaları; w teker
const PX_SHAPES = {
  atmaca: { x0: 8, x1: 112, deck: 22, hood: 23, roof: 10, cr: 26, rr: 36, rf: 66, cf: 80, sill: 36, w: [30, 90], r: 8 },
  granit: { x0: 10, x1: 110, deck: 15, hood: 20, roof: 7, cr: 13, rr: 17, rf: 68, cf: 82, sill: 34, w: [31, 89], r: 9 },
  elektra: { x0: 9, x1: 111, deck: 19, hood: 23, roof: 9, cr: 18, rr: 32, rf: 64, cf: 84, sill: 35, w: [31, 90], r: 9 },
  simsek: { x0: 10, x1: 112, deck: 21, hood: 25, roof: 13, cr: 22, rr: 38, rf: 62, cf: 82, sill: 37, w: [31, 91], r: 8, wing: 1 },
  cinar: { x0: 14, x1: 106, deck: 23, hood: 23, roof: 11, cr: 30, rr: 40, rf: 64, cf: 76, sill: 36, w: [33, 87], r: 7 },
  efe: { x0: 8, x1: 112, deck: 22, hood: 22, roof: 11, cr: 30, rr: 38, rf: 68, cf: 78, sill: 36, w: [30, 90], r: 8 },
  marmara: { x0: 9, x1: 111, deck: 21, hood: 23, roof: 11, cr: 24, rr: 38, rf: 66, cf: 82, sill: 36, w: [31, 90], r: 8 },
  liva: { x0: 16, x1: 106, deck: 16, hood: 23, roof: 9, cr: 18, rr: 24, rf: 62, cf: 78, sill: 36, w: [33, 87], r: 8, wing: 2 },
  bozkir: { x0: 10, x1: 110, deck: 14, hood: 18, roof: 6, cr: 12, rr: 15, rf: 66, cf: 74, sill: 32, w: [31, 89], r: 10, rack: 1 },
};

const pxHex = (c) => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
const pxCss = (r, g, b) => `rgb(${r | 0},${b === undefined ? g : g | 0},${(b ?? g) | 0})`;
const pxTone = (c, k) => { const [r, g, b] = pxHex(c); return k >= 0 ? pxCss(r + (255 - r) * k, g + (255 - g) * k, b + (255 - b) * k) : pxCss(r * (1 + k), g * (1 + k), b * (1 + k)); };

function pxInside(poly, x, y) {
  let on = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [ax, ay] = poly[i]; const [bx, by] = poly[j];
    if ((ay > y) !== (by > y) && x < ((bx - ax) * (y - ay)) / (by - ay) + ax) on = !on;
  }
  return on;
}

function pxWheel(g, x, y, r, hub) {
  const plot = (rad, col) => {
    g.fillStyle = col;
    for (let py = -rad; py <= rad; py++) {
      for (let px = -rad; px <= rad; px++) if (px * px + py * py <= rad * rad + 1) g.fillRect(x + px, y + py, 1, 1);
    }
  };
  plot(r + 1, '#05050a');
  plot(r, '#15151d');
  plot(r - 3, '#a8b4c8');
  plot(r - 4, '#39415a');
  g.fillStyle = '#e6eef8';
  for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) for (let k = 1; k <= r - 4; k++) g.fillRect(x + dx * k, y + dy * k, 1, 1);
  g.fillStyle = hub;
  g.fillRect(x - 1, y - 1, 2, 2);
}

function pxMoto(g, paint) {
  const c = paint.color; const a = paint.accent || '#ffd23f';
  pxWheel(g, 30, 37, 9, a);
  pxWheel(g, 92, 37, 9, a);
  const rect = (x, y, w, h, col) => { g.fillStyle = col; g.fillRect(x, y, w, h); };
  rect(32, 30, 56, 3, '#39415a');
  rect(46, 19, 34, 12, c);
  rect(46, 19, 34, 2, pxTone(c, 0.45));
  rect(46, 29, 34, 2, pxTone(c, -0.4));
  rect(28, 16, 24, 5, '#14141c');
  rect(18, 18, 14, 3, pxTone(c, -0.2));
  rect(78, 12, 12, 4, c);
  rect(88, 15, 4, 20, '#a8b4c8');
  rect(84, 8, 10, 2, '#14141c');
  rect(90, 17, 6, 4, '#fff7c8');
  rect(16, 19, 3, 3, '#ff2346');
  rect(34, 33, 22, 2, '#d6dde8');
}

function pxDrawCar(g, car, paint) {
  // Yerde neon
  for (let x = 12; x < 108; x++) {
    g.fillStyle = (x + 1) % 4 ? '#ff2fa0' : '#21e6ff';
    g.fillRect(x, 45, 1, 1);
    if (x % 2 === 0 && x > 20 && x < 100) { g.fillStyle = '#7a1a7a'; g.fillRect(x, 46, 1, 1); }
  }
  if (car.shape === 'moto') { pxMoto(g, paint); return; }
  const S = PX_SHAPES[car.shape] || PX_SHAPES.atmaca;
  const body = [[S.x0, S.sill], [S.x0, S.deck + 3], [S.x0 + 3, S.deck], [S.cr, S.deck], [S.rr, S.roof], [S.rf, S.roof], [S.cf, S.hood], [S.x1 - 8, S.hood + 2], [S.x1, S.hood + 6], [S.x1, S.sill]];
  const belt = Math.max(S.deck, S.hood) + 1;
  const c = paint.color;
  const roof = paint.roof || c;
  const accent = paint.accent || car.accent || '#ffffff';
  for (let y = 0; y < PXC_H; y++) {
    for (let x = 0; x < PXC_W; x++) {
      if (!pxInside(body, x + 0.5, y + 0.5)) continue;
      const edge = !pxInside(body, x - 0.5, y + 0.5) || !pxInside(body, x + 1.5, y + 0.5) || !pxInside(body, x + 0.5, y - 0.5) || !pxInside(body, x + 0.5, y + 1.5);
      let col;
      if (edge) col = '#0a0814';
      else if (y < belt) col = pxTone(roof, y < S.roof + 2 ? 0.34 : 0.1);
      else if (y < belt + 2) col = pxTone(c, 0.5);
      else if (y < S.sill - 5) col = pxTone(c, 0);
      else if (y < S.sill - 2) col = pxTone(c, -0.35);
      else col = pxTone(c, -0.62);
      g.fillStyle = col;
      g.fillRect(x, y, 1, 1);
    }
  }
  // Camlar
  const glass = [[S.rr + 2, S.roof + 2], [S.rf - 1, S.roof + 2], [S.cf - 3, belt - 1], [S.cr + 5, belt - 1]];
  const mid = Math.round((S.rr + S.rf) / 2) + 2;
  for (let y = S.roof; y < belt; y++) {
    for (let x = S.cr; x < S.cf; x++) {
      if (!pxInside(glass, x + 0.5, y + 0.5)) continue;
      const u = (y - S.roof) / (belt - S.roof);
      g.fillStyle = x === mid || x === mid + 1 ? '#0a0814' : (x + y) % 11 < 2 ? '#d8fbff' : u < 0.5 ? '#21e6ff' : '#2a4ea8';
      g.fillRect(x, y, 1, 1);
    }
  }
  // Şerit, kapı, kol
  g.fillStyle = accent;
  g.fillRect(S.x0 + 3, belt + 5, S.x1 - S.x0 - 6, 1);
  g.fillStyle = '#0a0814';
  g.fillRect(mid, belt, 1, S.sill - belt - 2);
  g.fillRect(mid + 3, belt + 2, 3, 1);
  // Farlar
  g.fillStyle = '#fff7c8'; g.fillRect(S.x1 - 5, S.hood + 6, 5, 3);
  g.fillStyle = 'rgba(255,240,180,.35)'; g.fillRect(S.x1, S.hood + 5, 7, 5);
  g.fillStyle = '#ff2346'; g.fillRect(S.x0, S.deck + 4, 3, 4);
  if (S.wing) {
    g.fillStyle = '#0a0814';
    const y0 = S.wing === 1 ? S.deck - 8 : S.deck - 2;
    g.fillRect(S.x0 - 3, y0, 22, 3);
    g.fillRect(S.x0 + 5, y0 + 3, 2, S.deck - y0 - 3);
    g.fillRect(S.x0 + 14, y0 + 3, 2, S.deck - y0 - 3);
    g.fillStyle = accent; g.fillRect(S.x0 - 3, y0, 22, 1);
  }
  if (S.rack) {
    g.fillStyle = '#0a0814';
    g.fillRect(S.rr + 2, S.roof - 3, S.rf - S.rr - 4, 2);
    for (let x = S.rr + 4; x < S.rf - 4; x += 12) g.fillRect(x, S.roof - 2, 2, 3);
  }
  // Tavanda neon yansıma
  g.fillStyle = '#21e6ff'; g.fillRect(S.rr + 1, S.roof, 12, 1);
  g.fillStyle = '#ff6ac0'; g.fillRect(S.rf - 10, S.roof, 9, 1);
  pxWheel(g, S.w[0], S.sill + 1, S.r, accent);
  pxWheel(g, S.w[1], S.sill + 1, S.r, accent);
}

const pxCache = new Map();
function pixelCar(car, paintIdx = 0) {
  const paint = car.paints[paintIdx] || car.paints[0];
  const key = `${car.id}:${paintIdx}`;
  if (pxCache.has(key)) return pxCache.get(key);
  const c = document.createElement('canvas');
  c.width = PXC_W; c.height = PXC_H;
  const g = c.getContext('2d');
  g.imageSmoothingEnabled = false;
  pxDrawCar(g, car, { ...paint, accent: paint.accent });
  pxCache.set(key, c);
  return c;
}

// Hazır görüntüyü verilen tuvale kopyalar: aynı görsel birden çok yerde kullanılabilir
function paintPixelCar(target, car, paintIdx = 0) {
  const src = pixelCar(car, paintIdx);
  target.width = PXC_W; target.height = PXC_H;
  const g = target.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(src, 0, 0);
}

// --- pixelmenu.js ---
// Ana ekran: kapak görseli tek mantıksal tuvalde canlanır. Duman, yıldız ve COVER_Kıvılcım tam piksel ızgarasındadır.
const COVER_SIZE = 364; // Kapağın mantıksal çözünürlüğü
const COVER_FPS = 16; // DüşüCOVER_K tempo piksel hissi verir, pil harcamaz
const COVER_K = COVER_SIZE / 1092;
const PUFF_TONES = ['#cdbcd8', '#a993c4', '#7f6ca2', '#58487c'];
const COVER_STARS = [[315, 45], [912, 20], [918, 205], [120, 22], [214, 60], [688, 18], [860, 118], [500, 26], [952, 92], [612, 40], [65, 95], [234, 130]];
const COVER_SPARKS = [[425, 690], [585, 706], [735, 800], [920, 745]];

// Köşeli COVER_KüçüCOVER_K bulut: yuvarlak COVER_Kümelerden, 3 tonlu
function coverPuff(seed, r) {
  const size = r * 2 + 4;
  const c = document.createElement('canvas');
  c.width = size; c.height = size;
  const g = c.getContext('2d');
  let s = seed;
  const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  const blobs = [];
  for (let i = 0; i < 7; i++) blobs.push([size / 2 + (rnd() - 0.5) * r * 1.2, size / 2 + (rnd() - 0.4) * r * 0.9, r * (0.38 + rnd() * 0.3)]);
  for (let tone = 3; tone >= 0; tone--) {
    g.fillStyle = PUFF_TONES[tone];
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        for (const [bx, by, br] of blobs) {
          const dy = y - by + (3 - tone) * 1.6; const dx = x - bx + (3 - tone) * 0.6;
          const rr = br - (3 - tone) * 0.9;
          if (rr > 0 && dx * dx + dy * dy < rr * rr) { g.fillRect(x, y, 1, 1); break; }
        }
      }
    }
  }
  return c;
}

class PixelMenu {
  constructor(canvas) {
    this.c = canvas;
    this.g = canvas.getContext('2d');
    this.g.imageSmoothingEnabled = false;
    this.img = new Image();
    this.img.src = 'assets/ui/cover.png';
    this.ready = false;
    this.img.onload = () => { this.ready = true; this.layout(); };
    this.on = false;
    this.acc = 0;
    this.t = 0;
    this.sparks = [];
    this.top = 0; // Üste eklenen göCOVER_K sırası
    this.clouds = [];
    const spots = [[8, 288, 30, 5], [52, 318, 24, 3], [112, 345, 28, -4], [330, 292, 22, -3], [300, 335, 30, 4], [28, 238, 20, 4], [188, 340, 24, 3]];
    spots.forEach(([x, y, r, drift], i) => this.clouds.push({ x, y, r, drift, ph: i * 1.7, s: coverPuff(1234 + i * 97, r) }));
    for (let i = 0; i < 20; i++) this.sparks.push({ x: 0, y: 0, vx: 0, vy: 0, life: 0, hot: 0 });
  }

  // Yerleşim: yazı ve araba hep görünür, ölçek tam sayı katına oturtulur
  layout() {
    const vw = window.innerWidth; const vh = window.innerHeight;
    const dpr = window.devicePixelRatio || 1;
    const wide = vw > vh * 1.15;
    const snap = (css) => Math.max(1, Math.round((css * dpr) / COVER_SIZE)) * COVER_SIZE / dpr;
    const c = this.c;
    if (wide) {
      const S = snap(vh);
      const scale = S / COVER_SIZE;
      const rows = Math.max(0, Math.ceil((vh - S) / scale));
      document.documentElement.style.setProperty('--cover-w', `${S}px`);
      this.setCanvas(rows, S, scale, 0, 0);
    } else {
      const panel = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--px-panel')) || 214;
      const area = vh - panel;
      const S = snap(vw / 0.66);
      const scale = S / COVER_SIZE;
      const rows = Math.max(0, Math.ceil((area - S) / scale));
      // Yazının sol ucu ile rüzgârlıCOVER_K aynı kadraja girer
      const left = -Math.min(S - vw, Math.max(0, S * 0.232 - Math.max(0, (vw - S * 0.66) / 2)));
      this.setCanvas(rows, S, scale, left, 0);
    }
    c.dataset.ready = '1';
    this.draw();
  }

  setCanvas(rows, S, scale, left, top) {
    const c = this.c;
    this.top = rows;
    c.width = COVER_SIZE; c.height = COVER_SIZE + rows;
    c.style.width = `${S}px`;
    c.style.height = `${(COVER_SIZE + rows) * scale}px`;
    c.style.left = `${left}px`;
    c.style.top = `${top}px`;
    this.g.imageSmoothingEnabled = false;
  }

  // Geçiş için hazır bulanık kopya: küçük kopya büyütülünce yumuşar, her karede filtre hesaplanmaz
  snapshot() {
    const b = document.getElementById('cover-blur');
    const { c } = this;
    const k = 5;
    b.width = Math.ceil(c.width / k);
    b.height = Math.ceil(c.height / k);
    const g = b.getContext('2d');
    g.imageSmoothingEnabled = true;
    g.imageSmoothingQuality = 'high';
    g.drawImage(c, 0, 0, b.width, b.height);
    b.style.width = c.style.width;
    b.style.height = c.style.height;
    b.style.left = c.style.left;
    b.style.top = c.style.top;
  }

  start() { this.on = true; this.layout(); }

  stop() { this.on = false; }

  frame(dt) {
    if (!this.on || !this.ready) return;
    this.acc += dt;
    if (this.acc < 1 / COVER_FPS) return;
    const step = this.acc;
    this.acc = 0;
    this.t += step;
    this.update(step);
    this.draw();
  }

  update(dt) {
    for (const s of this.sparks) {
      if (s.life > 0) {
        s.life -= dt; s.x += s.vx * dt; s.y += s.vy * dt; s.vy += 150 * dt;
      } else if (Math.random() < 0.34) {
        const [x, y] = COVER_SPARKS[Math.floor(Math.random() * COVER_SPARKS.length)];
        s.x = x * COVER_K; s.y = y * COVER_K;
        s.vx = -14 - Math.random() * 42; s.vy = -24 + Math.random() * 36;
        s.life = 0.25 + Math.random() * 0.5;
        s.hot = Math.random();
      }
    }
  }

  draw() {
    if (!this.ready) return;
    const { g, img, t } = this;
    const dy = this.top;
    if (dy) {
      // Eklenen göCOVER_K: yalnız en üstteki boş sıralar ileri geri yansır, yazıya ulaşmaz
      for (let y = 0; y < dy; y++) {
        const m = y % 16 < 8 ? y % 16 : 15 - (y % 16);
        g.drawImage(img, 0, m, COVER_SIZE, 1, 0, dy - y - 1, COVER_SIZE, 1);
      }
    }
    g.drawImage(img, 0, dy);
    for (let i = 0; i < COVER_STARS.length; i++) {
      const [sx, sy] = COVER_STARS[i];
      const b = Math.sin(t * (1.3 + (i % 5) * 0.55) + i * 2.1);
      if (b < 0) continue;
      const x = Math.round(sx * COVER_K); const y = Math.round(sy * COVER_K) + dy;
      g.fillStyle = b > 0.7 ? '#ffffff' : '#a9c4ff';
      g.fillRect(x, y, 1, 1);
      if (b > 0.7) { g.fillStyle = 'rgba(200,220,255,.75)'; g.fillRect(x - 1, y, 3, 1); g.fillRect(x, y - 1, 1, 3); }
    }
    // Far yanıp sönmesi
    if (Math.sin(t * 9) > 0.1) {
      g.fillStyle = 'rgba(255,250,200,.85)';
      g.fillRect(137, 229 + dy, 7, 2);
      g.fillRect(183, 234 + dy, 8, 2);
    }
    for (const f of this.clouds) {
      const x = Math.round(f.x + Math.sin(t * 0.22 + f.ph) * f.drift * 2.4 + ((t * f.drift * 0.5) % 18) - 9);
      const y = Math.round(f.y + Math.sin(t * 0.34 + f.ph) * 2) + dy;
      g.drawImage(f.s, x - f.r, y - f.r);
    }
    for (const s of this.sparks) {
      if (s.life <= 0) continue;
      g.fillStyle = s.hot > 0.6 ? '#fff4a8' : s.hot > 0.25 ? '#ffb02e' : '#ff6a1f';
      g.fillRect(Math.round(s.x), Math.round(s.y) + dy, 1, 1);
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

// Uzun yazı kutusuna sığmazsa yazı küçülür (özellikle Almanca); tek satırlık metinler
const FIT = '.start-txt, .tile span, .menu .btn, .panel .btn, .seg button, .screen header h2, #over-title, .car-tag b, .car-tag small, #ctl-rev, .summary span, .big-score span, #hint b, #hint span, .toggle > span, .volume > span, .seg-row > span, #cheat-badge, #garage-action';
function fitOne(el) {
  el.style.fontSize = '';
  if (!el.offsetParent || !el.clientWidth) return;
  const base = parseFloat(getComputedStyle(el).fontSize);
  const min = Math.max(9, Math.round(base * 0.55));
  let s = base;
  while (s > min && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 2)) {
    s -= 1;
    el.style.fontSize = `${s}px`;
  }
}

const SPLASH_MS = 800;
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
    this.applyLang();
    // Piksel yazı tipi geç yüklenir: yüklenince yazılar yeniden sığdırılır
    if (document.fonts) {
      document.fonts.addEventListener('loadingdone', () => this.fit());
      document.fonts.ready.then(() => this.fit());
    }
  }

  bind() {
    const a = this.actions;
    const click = (id, fn) => $(id).addEventListener('click', () => { a.tap(); fn(); });
    click('btn-play', () => a.start());
    // Bütün menü düğmeleri aynı dokunuşu verir: yumuşak ses, kısa titreşim. Oyun içi düğmeler hariç
    document.addEventListener('pointerdown', (e) => {
      const b = e.target.closest && e.target.closest('.screen button, .screen a.btn, .screen .toggle');
      if (!b || b.disabled) return;
      a.press();
      // :active dokunmatikte her zaman oluşmaz. Çok kısa dokunuşta da çöküş görünsün
      b.classList.add('down');
      const at = performance.now();
      const up = () => {
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        setTimeout(() => b.classList.remove('down'), Math.max(0, 90 - (performance.now() - at)));
      };
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    }, true);
    click('btn-mute', () => { const d2 = this.storage.data; d2.settings.sound = !d2.settings.sound; this.storage.save(); this.syncSettings(); a.applySettings(); });
    click('btn-garage', () => { this.gi = undefined; this.renderGarage(); this.show('garage'); });
    click('btn-garage2', () => { this.gi = undefined; this.renderGarage(); this.show('garage'); });
    click('car-prev', () => { this.stepCar(-1); a.preview(CONFIG.cars[this.gi]); });
    click('car-next', () => { this.stepCar(1); a.preview(CONFIG.cars[this.gi]); });
    click('btn-settings', () => { this.show('settings'); });
    click('btn-howto', () => { this.show('howto'); });
    for (const b of document.querySelectorAll('[data-back]')) {
      b.addEventListener('click', () => { a.tap(); this.refreshMenu(); this.show(b.dataset.back); a.carChanged(); a.menuShown(); });
    }
    click('btn-retry', () => a.play());
    click('btn-over-menu', () => a.toMenu());
    click('btn-pause', () => a.pause());
    click('btn-resume', () => a.resume());
    click('btn-pause-menu', () => a.toMenu());
    // Duraklat tuşu sürüş girdisi sayılmasın. Başka parmak basılıyken tarayıcı click üretmez: bırakma yeterli
    $('btn-pause').addEventListener('pointerdown', (e) => e.stopPropagation());
    $('btn-pause').addEventListener('pointerup', (e) => { e.stopPropagation(); a.tap(); a.pause(); });

    const d = this.storage.data;
    for (const seg of document.querySelectorAll('.seg')) {
      seg.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        a.tap();
        d.settings[seg.dataset.set] = b.dataset.v;
        this.storage.save();
        this.syncSettings();
        a.applySettings();
      });
    }
    $('set-sound').addEventListener('change', (e) => { d.settings.sound = e.target.checked; this.storage.save(); a.applySettings(); });
    $('set-volume').addEventListener('input', (e) => { d.settings.volume = Number(e.target.value); this.storage.save(); a.applySettings(); });
    $('set-ambient').addEventListener('change', (e) => { d.settings.ambient = e.target.checked; this.storage.save(); a.applySettings(); });
    $('set-vibrate').addEventListener('change', (e) => { d.settings.vibrate = e.target.checked; this.storage.save(); a.applySettings(); });
    $('dev-god').addEventListener('change', (e) => { d.dev.god = e.target.checked; this.storage.save(); });
    $('dev-start').addEventListener('change', (e) => { d.dev.startTime = Number(e.target.value); this.storage.save(); });
    // Gizli geliştirici bölümü: sürüm yazısına 7 kez dokun
    $('version').addEventListener('click', () => {
      if (++this.devTaps >= 7) $('dev-panel').hidden = false;
    });
  }

  syncSettings() {
    const d = this.storage.data;
    $('set-sound').checked = d.settings.sound;
    $('set-volume').value = String(d.settings.volume);
    this.syncMute();
    $('set-vibrate').checked = d.settings.vibrate;
    $('set-ambient').checked = d.settings.ambient;
    for (const seg of document.querySelectorAll('.seg')) {
      for (const b of seg.children) {
        const on = d.settings[seg.dataset.set] === b.dataset.v;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
    }
    $('dev-god').checked = d.dev.god;
    $('dev-start').value = String(d.dev.startTime);
  }

  syncMute() {
    $('btn-mute').classList.toggle('muted', !this.storage.data.settings.sound);
  }

  intro() {
    $('maker').textContent = tx('menu.maker');
  }

  show(name) {
    for (const s of SCREENS) $(s).hidden = s !== name;
    if (name) this.fit($(name));
  }

  // Görünen ekrandaki yazılar kutularına sığdırılır
  fit(root = document) {
    for (const el of root.querySelectorAll(FIT)) fitOne(el);
  }

  // Dil değişince oyun yeniden başlamadan bütün yazılar yenilenir
  applyLang() {
    const code = getLang();
    // Sayı biçimleri menüdeyken kurulur: oyunun ilk karesinde kurulum takılma yapmasın
    txNum(0); txNum(0, 1);
    document.documentElement.lang = code === 'zh' ? 'zh-CN' : code;
    for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = tx(el.dataset.i18n);
    for (const el of document.querySelectorAll('[data-i18n-label]')) el.setAttribute('aria-label', tx(`aria.${el.dataset.i18nLabel}`));
    // BAŞLA: harfler sırayla beyaz ve turuncu
    const st = $('start-txt');
    st.textContent = '';
    for (const ch of tx('start')) { const i = document.createElement('i'); i.textContent = ch; st.appendChild(i); }
    $('version').textContent = tx('settings.version', { v: CONFIG.version });
    const tips = $('howto-tips');
    tips.textContent = '';
    for (const line of tx('howto.tips')) { const li = document.createElement('li'); li.textContent = line; tips.appendChild(li); }
    for (const b of document.querySelectorAll('.seg[data-set=lang] button')) b.textContent = LANGS[b.dataset.v];
    $('cheat-badge').textContent = tx('cheat.badge');
    $('ctl-rev').textContent = tx('hint.rev');
    this.buildHowtoPowers();
    this.refreshMenu();
    this.intro();
    if (!$('garage').hidden) this.renderGarage();
    if (!$('hint').hidden) this.showHint(true);
    if (!$('over').hidden && this.lastResult) this.over(...this.lastResult);
    this.last.score = '';
    this.last.combo = '';
    this.fit();
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
    $('menu-best').textContent = d.bestScore ? tx('menu.best', { score: txNum(d.bestScore), time: formatTime(d.bestTime) }) : tx('menu.first');
    const car = this.storage.selectedCar();
    $('menu-car-name').textContent = car.name;
    $('menu-car-paint').textContent = this.paintName(car, this.storage.paintIndex(car.id));
    if (!$('menu').hidden) this.fit($('menu'));
  }

  paintName(car, i) {
    const names = tx(`cars.${car.id}.paints`);
    return (Array.isArray(names) && names[i]) || (car.paints[i] || car.paints[0]).name;
  }

  // Açılış: koyu zeminde geliştirici yazısı, yumuşak belirip kaybolur (0,8 sn). Oyun arkada yüklenir
  splash(done) {
    const el = $('splash');
    $('splash-text').textContent = tx('splash', { name: DEVELOPER });
    el.hidden = false;
    el.classList.add('play');
    setTimeout(() => {
      el.hidden = true;
      done();
    }, SPLASH_MS);
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
  }

  buildHowtoPowers() {
    const list = $('howto-powers');
    list.textContent = '';
    const n = CONFIG.powers.duration;
    for (const kind of ['blast', 'ghost', 'heal', 'giant']) {
      const row = document.createElement('div');
      const name = document.createElement('b');
      name.textContent = tx(`power.${kind}`);
      const d = document.createElement('span');
      d.textContent = tx(`power.${kind}Info`, { n });
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
    this.toast(tx(`power.${kind}`), POWER_LOOK[kind].color);
  }

  alert(stage) {
    const text = tx(`alert.${['', 'swat', 'heavy', 'tanks'][stage] || 'tanks'}`);
    const el = $('alert');
    el.textContent = text;
    el.classList.remove('run');
    void el.offsetWidth; // Animasyonu baştan başlat
    el.classList.add('run');
  }

  cheatMessage(on) {
    const el = $('cheat-msg');
    el.firstElementChild.textContent = tx(on ? 'cheat.on' : 'cheat.off');
    el.classList.remove('run');
    void el.offsetWidth;
    el.classList.add('run');
  }

  alienAlert() {
    const el = $('alert');
    el.textContent = tx('alert.aliens');
    el.classList.remove('run');
    void el.offsetWidth;
    el.classList.add('run');
  }

  showHint(on) {
    if (on) {
      const m = this.storage.data.settings.control;
      const T = tx(`hint.${['zones', 'wheel', 'stick'].includes(m) ? m : 'zones'}`);
      ['hint-l', 'hint-ls', 'hint-m', 'hint-ms', 'hint-r', 'hint-rs'].forEach((id, i) => { $(id).textContent = T[i]; });
    }
    $('hint').hidden = !on;
    $('hint').classList.toggle('up', this.storage.data.settings.control !== 'zones');
  }

  resetHud() {
    this.last = { time: '', score: '', coins: '', stage: -1, stars: -1, combo: '' };
    $('alert').classList.remove('run');
  }

  hud(g) {
    const l = this.last;
    const time = formatTime(g.time);
    if (time !== l.time) { l.time = time; $('hud-time').textContent = time; }
    const score = Math.floor(g.score);
    if (score !== l.score) { l.score = score; $('hud-score').textContent = txNum(score); }
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
    const combo = g.combo >= 1.25 ? `x${txNum(g.combo, 1)}` : '';
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
    $('over-title').textContent = tx(record.newScore ? 'over.record' : result.cause === 'water' ? 'over.sunk' : 'over.caught');
    $('over-title').classList.toggle('record', record.newScore);
    $('over-score').textContent = txNum(result.score);
    $('over-time').textContent = formatTime(result.time);
    $('over-coins').textContent = `+${result.coins}`;
    $('over-kills').textContent = result.kills;
    $('over-broken').textContent = result.broken;
    $('over-near').textContent = result.nearMisses;
    $('over-drift').textContent = tx('over.seconds', { n: txNum(result.driftTime, 1) });
    $('over-best').textContent = tx('over.best', { score: txNum(d.bestScore), time: formatTime(d.bestTime) });
    this.lastResult = [result, record];
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
    paintPixelCar($('px-car'), car, paintI);
    const swatch = $('garage-paints');
    swatch.textContent = '';
    car.paints.forEach((p, i) => {
      const b = document.createElement('button');
      b.className = `swatch ${p.finish}${i === paintI ? ' on' : ''}`;
      b.style.setProperty('--c', p.color);
      b.style.setProperty('--r', p.roof || p.color);
      b.title = this.paintName(car, i);
      b.setAttribute('aria-label', b.title);
      b.addEventListener('click', () => {
        this.actions.tap();
        this.gp = i;
        if (owned) { this.storage.setPaint(car.id, i); this.actions.carChanged(); }
        this.renderGarage();
      });
      swatch.appendChild(b);
    });
    const pt = car.paints[paintI];
    $('garage-paint-name').textContent = `${this.paintName(car, paintI)} · ${tx(`garage.finish.${pt.finish}`)}${pt.roof ? ` · ${tx('garage.twoTone')}` : ''}`;
    $('garage-name').textContent = car.name;
    $('garage-desc').textContent = tx(`cars.${car.id}.desc`);

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
      fill.style.setProperty('--w', `${Math.round(25 + value * 75)}%`);
      bar.appendChild(fill);
      const n = document.createElement('em');
      n.textContent = text;
      row.append(t, bar, n);
      stats.appendChild(row);
    };
    const norm = (v, a, b) => (v - a) / (b - a);
    const range = (key) => { const v = cars.map((c) => c[key]); return [Math.min(...v), Math.max(...v)]; };
    stat(tx('garage.speed'), norm(car.maxSpeed, base.maxSpeed, top.maxSpeed), String(Math.round(car.maxSpeed / 3)));
    stat(tx('garage.accel'), norm(car.accel, ...range('accel')), String(Math.round(car.accel / 7)));
    stat(tx('garage.grip'), norm(car.grip, ...range('grip')), String(Math.round(car.grip * 20)));
    stat(tx('garage.durability'), norm(car.durability, base.durability, top.durability), String(Math.round(car.durability * 100)));

    const act = $('garage-action');
    act.classList.toggle('buy', !owned);
    if (selected) { act.textContent = tx('garage.selected'); act.disabled = true; }
    else if (owned) { act.textContent = tx('garage.select'); act.disabled = false; }
    else {
      act.textContent = tx(d.coins >= car.cost ? 'garage.buy' : 'garage.need', { cost: txNum(car.cost) });
      act.disabled = d.coins < car.cost;
    }
    act.onclick = () => {
      this.actions.tap();
      if (owned) { this.storage.select(car.id); this.actions.preview(car); }
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
      const art = document.createElement('canvas');
      paintPixelCar(art, c, this.storage.paintIndex(c.id));
      art.className = 'car-art';
      const label = document.createElement('span');
      label.textContent = has ? c.name : `${c.cost}`;
      b.append(art, label);
      b.addEventListener('click', () => { this.actions.tap(); this.gi = i; this.gp = 0; this.renderGarage(); this.actions.preview(c); });
      list.appendChild(b);
    });
    const on = list.children[this.gi];
    if (on) list.scrollLeft = on.offsetLeft - list.clientWidth / 2 + on.offsetWidth / 2;
    if (!$('garage').hidden) this.fit($('garage'));
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

// --- transition.js ---
// BAŞLA geçişi zaman çizelgesi (ms). Toplam 2 saniyenin altında kalır.
const PHASE = {
  press: 100, // Düğme çöker, bip
  away: 1000, // Ana ekran bulanıklaşıp solar, arkasından yol görünür
  fall: 520, // Küçük araba yola düşer; kapak solmadan başlar
  settle: 400, // Çarpma, sarsıntı, gerçek boya dönüş
};
const FALL_AT = PHASE.press + PHASE.away - 180;
const TOTAL = FALL_AT + PHASE.fall + PHASE.settle;

// t ms: düşüşün başından itibaren. drop: 1 gökte, 0 yolda; size: araç oranı
function dropCurve(t) {
  if (t < 0) return { drop: 1, size: 0.22, shadow: 0.1 };
  if (t < PHASE.fall) {
    const u = t / PHASE.fall;
    return { drop: 1 - u * u, size: 0.22 + 0.4 * u * u, shadow: 0.1 + 0.8 * u };
  }
  const u = Math.min(1, (t - PHASE.fall) / PHASE.settle);
  // Yere değince şişer, sonra gerçek boyuna oturur
  const v = u - 1;
  const back = 1 + 2.4 * v * v * v + 1.4 * v * v;
  return { drop: 0, size: 0.62 + 0.38 * back, shadow: 1 };
}

// --- quality.js ---
// Grafik kalitesi: Otomatik modda FPS'e göre seviye değişir. Çizim yükünü ve aynı anda aktif polis
// sınırını (cops) ayarlar. Tarayıcıya bağlı değildir, birim testle sınanır.
// dpr: çözünürlük üst sınırı, pixels: tuval piksel bütçesi (tablet), particles: parçacık oranı,
// crowd: kalabalık oranı, slices: bina duvar dilimi, balcony: balkon oranı, night: 2 tam gece ışıkları,
// 1 yansımasız, 0 yalnız temel ışık; speedLines, fireSmoke: küçük süsler.
const LEVELS = [
  { name: 'yuksek', cops: 24, dpr: 1.75, pixels: 2600000, particles: 1, crowd: 1, slices: 6, balcony: 1, night: 2, speedLines: true, fireSmoke: true },
  { name: 'orta', cops: 18, dpr: 1.5, pixels: 1600000, particles: 0.75, crowd: 1, slices: 5, balcony: 0.7, night: 2, speedLines: true, fireSmoke: true },
  { name: 'dusuk', cops: 12, dpr: 1.25, pixels: 1100000, particles: 0.5, crowd: 0.8, slices: 4, balcony: 0.4, night: 1, speedLines: false, fireSmoke: false },
  { name: 'en-dusuk', cops: 8, dpr: 1, pixels: 700000, particles: 0.3, crowd: 0.6, slices: 3, balcony: 0, night: 0, speedLines: false, fireSmoke: false },
];

const QUALITY_MODES = ['auto', 'high', 'low'];
const MIN_FPS = 45; // Bunun altında kalite düşer
const UP_FPS = 56; // Bu kadar rahatken kalite yükselmeyi dener
const MAX_HOLD = 60; // Yükselme denemeleri arasındaki en uzun bekleme, sn

// Cihaz bilgisinden başlangıç tahmini: kasarak başlamak yerine güvenli tarafta başlar
function guessLevel(cores = 0, memoryGb = 0) {
  if ((cores && cores <= 4) || (memoryGb && memoryGb <= 3)) return 2;
  if ((cores && cores <= 6) || (memoryGb && memoryGb <= 4)) return 1;
  return 0;
}

class Quality {
  constructor(mode = 'auto', start = 0) {
    this.level = Math.max(0, Math.min(LEVELS.length - 1, start | 0));
    this.setMode(mode);
    this.reset();
    this.hold = 8;
  }

  get settings() { return LEVELS[this.level]; }

  setMode(mode) {
    this.mode = QUALITY_MODES.includes(mode) ? mode : 'auto';
    if (this.mode === 'high') this.level = 0;
    if (this.mode === 'low') this.level = LEVELS.length - 1;
  }

  // Ölçüm penceresi baştan başlar: duraklatma, sahne değişimi. Hızlı uyum ilk saniyelerde geçerli
  reset(fast = 3) {
    this.sum = 0;
    this.n = 0;
    this.goodT = 0;
    this.wait = 0;
    this.fastT = fast;
  }

  // Kare süresi (ms) girer. Seviye değiştiyse true döner.
  note(ms) {
    if (this.mode !== 'auto' || ms <= 0 || ms > 400) return false; // Çok uzun boşluk arka plandır
    const sec = ms / 1000;
    this.fastT -= sec;
    this.wait -= sec;
    this.sum += ms;
    this.n++;
    const fast = this.fastT > 0;
    if (this.sum < (fast ? 350 : 750)) return false;
    const fps = (1000 * this.n) / this.sum;
    const span = this.sum / 1000;
    this.sum = 0;
    this.n = 0;
    if (fps < MIN_FPS) {
      this.goodT = 0;
      if (this.wait > 0 || this.level >= LEVELS.length - 1) return false;
      // Ağır kasmada tek adım yetmez
      this.level = Math.min(LEVELS.length - 1, this.level + (fps < 30 ? 2 : 1));
      this.wait = fast ? 0.35 : 1.2;
      this.hold = Math.min(MAX_HOLD, this.hold * 2); // Yükseltme tutmadı: sonraki deneme daha geç
      return true;
    }
    this.goodT = fps >= UP_FPS ? this.goodT + span : 0;
    if (this.goodT >= this.hold && this.level > 0) {
      this.level--;
      this.goodT = 0;
      this.wait = 1.2;
      return true;
    }
    return false;
  }
}

// --- main.js ---
// Giriş noktası: döngü, boyutlandırma, olayların ses ve titreşime bağlanması.

const STEP = 1 / 60;
const canvas = document.getElementById('game');
const storage = new Storage();
// Dil: kayıtlıysa o, değilse cihazın dili (desteklenmiyorsa İngilizce)
setLang(storage.data.settings.lang || detectLang(navigator.languages || [navigator.language]));
const game = new Game();
const renderer = new Renderer(canvas);
const input = new Input();
const controls = new ControlView(input);
const audio = new AudioEngine();
game.world.onRelease = (c) => renderer.releaseChunk(c);
game.carSpec = storage.selectedCar();
game.paint = storage.paintIndex(game.carSpec.id);

const cover = new PixelMenu(document.getElementById('cover'));
const curtain = document.getElementById('curtain');
const menuEl = document.getElementById('menu');
const cheatBadge = document.getElementById('cheat-badge');
input.onCode = () => { if (game.state === 'play' && !paused) game.toggleCheat(); };
const params = new URLSearchParams(location.search);
let paused = false;
let accumulator = 0;
let last = 0;
let hudT = 0;
let hintT = 0;
const perf = { frames: new Float32Array(20000), work: new Float32Array(20000), i: 0, count: 0, changes: 0 };
const startLevel = storage.data.settings.qLevel >= 0 ? storage.data.settings.qLevel : guessLevel(navigator.hardwareConcurrency, navigator.deviceMemory);
const quality = new Quality(storage.data.settings.quality, startLevel);
let warming = false; // Perde kapalı: görünür dünya parça parça hazırlanıyor
let pausedDrawn = false;

function vibrate(ms) {
  if (storage.data.settings.vibrate && navigator.vibrate) {
    try { navigator.vibrate(ms); } catch { /* desteklenmiyor */ }
  }
}

function applySettings() {
  const lang = storage.data.settings.lang || detectLang(navigator.languages || [navigator.language]);
  if (lang !== getLang()) { setLang(lang); ui.applyLang(); }
  audio.setEnabled(storage.data.settings.sound);
  audio.setVolume(storage.data.settings.volume / 100);
  ui.syncMute();
  audio.setAmbient(storage.data.settings.ambient);
  if (input.mode !== storage.data.settings.control) {
    input.setMode(storage.data.settings.control);
    controls.setMode(input.mode);
    ui.showHint(!document.getElementById('hint').hidden);
  }
  if (quality.mode !== storage.data.settings.quality) {
    quality.setMode(storage.data.settings.quality);
    quality.reset();
    applyQuality();
  }
}

// Tuval yalnız gerçekten değişince yeniden kurulur: kurulum bir karelik iştir
function fitCanvas(w, h) {
  const q = quality.settings;
  const dpr = Math.max(1, Math.min(q.dpr, window.devicePixelRatio || 1, Math.sqrt(q.pixels / (w * h))));
  if (renderer.w !== w || renderer.h !== h || Math.abs(renderer.dpr - dpr) > 0.01) renderer.resize(w, h, dpr);
}

function applyQuality() {
  const q = quality.settings;
  renderer.lod = q;
  game.copLimit = Math.min(q.cops, navigator.maxTouchPoints > 0 ? CONFIG.pursuit.phoneCap : q.cops);
  game.fx.density = q.particles;
  game.crowd.limit = q.crowd;
  fitCanvas(window.innerWidth, window.innerHeight);
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  fitCanvas(w, h);
  game.view.w = w;
  game.view.h = h;
  input.width = w;
  controls.needLayout = true;
  ui.fit();
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
  const ready = menuWorld && warmDone;
  game.start(storage.selectedCar(), { startTime, god, keepWorld: menuWorld });
  menuWorld = false;
  cover.stop();
  // Dünya hazır değilse siyah perde arkasında kurulur: ilk kare donmaz
  if (!ready) { warming = true; curtain.classList.add('on'); }
  quality.reset();
  audio.setEngine(storage.selectedCar().engine);
  perf.i = 0;
  perf.count = 0;
  hintT = storage.data.tutorial ? 0 : 5;
  ui.showHint(hintT > 0);
  if (hintT > 0) { storage.data.tutorial = true; storage.save(); }
  keepAwake(true);
}

// BAŞLA: ana ekran bulanıklaşıp solar, küçük araba gökten yola iner, oyun kesintisiz başlar.
// Otomatik testler ve hareket azaltma tercihinde doğrudan başlar.
let film = null;
function start() {
  if (film) return;
  const quick = (navigator.webdriver && !params.has('fx')) || matchMedia('(prefers-reduced-motion: reduce)').matches;
  audio.unlock();
  if (quick) { play(); return; }
  film = { t0: performance.now(), left: false, landed: false, released: false, ready: false };
}

// Dünya, menünün arkasında kurulur: 3B sahne örtüyken parça parça hazırlanır, ekran donmaz
function prepareWorld() {
  const d = storage.data.dev;
  const startTime = params.has('t') ? Number(params.get('t')) : (d.startTime || CONFIG.dev.startTime);
  const god = params.get('god') === '1' || d.god || CONFIG.dev.godMode;
  game.paint = storage.paintIndex(storage.selectedCar().id);
  game.start(storage.selectedCar(), { startTime, god, keepWorld: menuWorld });
  menuWorld = false;
  game.holdForDrop();
  input.clear();
}

// Menü beklerken bir sonraki koşunun haritası sessizce hazırlanır. BAŞLA'ya basınca iş kalmaz.
let menuWorld = false;
let warmT = 0;
let warmDone = false;
function prewarmWorld() {
  if (game.state !== 'attract' || film) return;
  game.start(storage.selectedCar(), { startTime: 0, god: false });
  game.holdForDrop();
  game.updateCamera(1 / 60);
  game.state = 'attract';
  game.drop = null;
  menuWorld = true;
  warmDone = false;
}

function stepFilm(now) {
  const f = film;
  const t = now - f.t0;
  // Ses kurulumu dokunuş görevinde yapılır; dünya bir sonraki karede: ikisi tek uzun göreve yığılmaz
  if (!f.ready) {
    f.ready = true;
    prepareWorld();
    quality.reset();
    return;
  }
  // Ana ekran yerinde bulanıklaşıp solar: küçülmez, kaymaz. Hazır katman kullanılır, arkasında yol çizilir
  if (!f.left && t >= PHASE.press) {
    f.left = true;
    cover.snapshot();
    document.getElementById('menu').classList.add('leaving');
    cover.stop();
    keepAwake(true);
  }
  if (!f.cleared && t >= PHASE.press + PHASE.away) {
    f.cleared = true;
    ui.hideAll();
    document.getElementById('menu').classList.remove('leaving');
    ui.resetHud();
  }
  const c = dropCurve(t - FALL_AT);
  if (game.drop) { game.drop.y = c.drop; game.drop.size = c.size; game.drop.shadow = c.shadow; }
  if (!f.landed && t >= FALL_AT + PHASE.fall) {
    f.landed = true;
    game.landDrop();
    audio.landing();
    audio.preview(storage.selectedCar().engine, 'start');
    vibrate([40, 30, 25]);
    ui.setHud(true);
  }
  if (!f.released && t >= TOTAL - 90) {
    f.released = true;
    game.releaseDrop();
    audio.setEngine(storage.selectedCar().engine);
    perf.i = 0;
    perf.count = 0;
    hintT = storage.data.tutorial ? 0 : 5;
    ui.showHint(hintT > 0);
    if (hintT > 0) { storage.data.tutorial = true; storage.save(); }
  }
  if (t >= TOTAL) film = null;
}

function toMenu() {
  paused = false;
  ui.setHud(false);
  ui.showHint(false);
  game.carSpec = storage.selectedCar();
  game.startAttract();
  cheatBadge.hidden = true;
  ui.refreshMenu();
  ui.show('menu');
  ui.intro();
  cover.start();
  keepAwake(false);
  menuWorld = false;
  warmDone = false;
  setTimeout(prewarmWorld, 350); // Kapak ilk karesini çizsin
}

function pause() {
  if (game.state !== 'play' || paused) return;
  paused = true;
  pausedDrawn = false;
  input.clear();
  audio.suspend();
  rememberQuality();
  ui.show('pause');
}

function resume() {
  paused = false;
  audio.resume();
  ui.hideAll();
  last = 0;
  quality.reset(0);
}

// Öğrenilen seviye sonraki açılışta kasmadan başlamayı sağlar
function rememberQuality() {
  const s = storage.data.settings;
  if (quality.mode === 'auto' && s.qLevel !== quality.level) { s.qLevel = quality.level; storage.save(); }
}

const ui = new UI(storage, {
  tap() { audio.unlock(); },
  play, start, toMenu, pause, resume, applySettings,
  press() { audio.unlock(); audio.press(); vibrate(16); },
  preview(car) { audio.unlock(); audio.preview(car.engine, 'rev'); },
  carChanged() { game.carSpec = storage.selectedCar(); game.paint = storage.paintIndex(game.carSpec.id); },
  menuShown() { cover.start(); },
  menuHidden() { cover.stop(); },
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
    case 'cheat': audio.cheat(v); ui.cheatMessage(v); vibrate(v ? [30, 30, 30, 30, 60] : 40); break;
    case 'copdown': audio.explosion(0.55 * v); vibrate(40); break;
    case 'explosion': audio.explosion(1); vibrate([120, 40, 220]); break;
    case 'tankfire': audio.tankFire(); vibrate(30); break;
    case 'tankhit': audio.explosion(0.5 + 0.4 * v); vibrate(70); break;
    case 'alert': audio.alert(); ui.alert(v); vibrate([60, 40, 60]); break;
    case 'gameover': {
      rememberQuality();
      const record = game.result.cheated ? { newScore: false, newTime: false } : storage.recordRun(game.result);
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
  const raw = now - last;
  // Ekran yenilemesine oturtulur: 16,6 ms ile 16,7 ms farkı bir adım atlatıp titreme yapmasın
  let elapsed = Math.min(0.1, raw / 1000);
  if (Math.abs(elapsed - STEP) < 0.003) elapsed = STEP;
  else if (Math.abs(elapsed - STEP / 2) < 0.0015) elapsed = STEP / 2;
  last = now;
  const t0 = performance.now();
  if (!menuEl.hidden) cover.frame(elapsed);

  let steps = 0;
  if (!paused) {
    accumulator += elapsed;
    // Menü kendi sahnesini çizer: arkada oyun dönmez, pil harcanmaz
    while (game.state !== 'attract' && !warming && accumulator >= STEP && steps < 5) {
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
  // Menü beklerken dünya parça parça hazırlanır; geçişin ilk karesi hazır parçalarla çizilir
  if (warming) {
    accumulator = 0;
    if (renderer.warm(game, 1, 10)) { warming = false; curtain.classList.remove('on'); quality.reset(); last = 0; }
  } else if (game.state === 'attract') {
    if (menuWorld && !warmDone && ++warmT % 3 === 0) warmDone = renderer.warm(game, 2, 6);
    else renderer.stepQueue(3);
  } else if (film && !film.left) {
    renderer.warm(game, 2, 6); // Kapak henüz tam örtüyor: çizmek boşa, hazırlık sürer
  } else if (paused ? !pausedDrawn : (steps > 0 || game.state !== 'play')) {
    renderer.draw(game, now); // Durum değişmediyse aynı kare yeniden çizilmez
    if (paused) pausedDrawn = true;
  }
  if (film) stepFilm(now);
  audio.update(game, !paused, now);
  controls.update();

  hudT -= elapsed;
  if (hudT <= 0 && game.state === 'play') {
    hudT = 0.1;
    ui.hud(game);
    if (cheatBadge.hidden === game.cheat) cheatBadge.hidden = !game.cheat;
  }

  // Kare süresi ölçümü ve otomatik kalite
  const i = perf.i;
  perf.frames[i] = elapsed * 1000;
  perf.work[i] = performance.now() - t0;
  perf.i = (i + 1) % perf.frames.length;
  perf.count++;
  // Koşunun ilk iki karesi dünya hazırlığıdır, cihaz yavaşlığı sayılmaz
  if (!paused && !warming && !document.hidden && ((game.state === 'play' && game.runTime > 0.6) || (film && film.left)) && quality.note(raw)) {
    perf.changes++;
    applyQuality();
  }
}

// Geri tuşu: oyundan çıkarmaz. Sırayla duraklatır, menüye döner; menüde iki kez basınca çıkar.
let lastBack = 0;
function handleBack() {
  const visible = (id) => !document.getElementById(id).hidden;
  if (visible('splash') || film) return false;
  if (game.state === 'play' || game.state === 'dying' || game.state === 'sinking') {
    if (paused) resume(); else pause();
    return false;
  }
  if (visible('over')) { toMenu(); return false; }
  if (visible('menu')) {
    const t = performance.now();
    if (t - lastBack < 2000) return true;
    lastBack = t;
    ui.toast(tx('menu.exit'), '#ffffff');
    return false;
  }
  ui.refreshMenu();
  ui.show('menu');
  cover.start();
  return false;
}
globalThis.__gameBack = handleBack;

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
  controls.setMode(input.mode);
  applySettings();
  audio.prepare();
  applyQuality();
  if (document.fonts) {
    for (const f of ['800 30px Nunito', '400 30px Bungee', '400 30px Pacifico', '400 30px Anton', '400 30px Righteous', '400 30px Lobster', '400 30px "Tilt Neon"', '400 30px Monoton', '500 30px Oswald', 'italic 400 30px Playfair', '400 16px "Press Start"', '400 16px Pixelify', '700 16px Pixelify']) document.fonts.load(f, 'ÇŞĞİçşğı').catch(() => {});
  }
  resize();
  window.addEventListener('resize', () => { resize(); cover.layout(); });
  window.addEventListener('orientationchange', () => { resize(); cover.layout(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      rememberQuality();
      if (game.state === 'play') pause();
      else audio.suspend();
    } else if (game.state !== 'play' || !paused) {
      audio.resume();
    }
  });

  game.startAttract();
  requestAnimationFrame(frame);
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
globalThis.__drift = { game, input, perf, storage, renderer, ui, play, pause, resume, cfg: CONFIG, cover, quality, LEVELS, controls, audio };

boot();

})();
