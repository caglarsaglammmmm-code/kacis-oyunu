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
export const CAR_MODELS = {
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
export const MOTO_FEATURES = ['Sport naked motosiklet, dar uzun gövde', 'Kapalı depo ve kısa kaporta', 'Tek sele, yukarı kalkık kuyruk', 'Geniş gidon ve aynalar', 'Kasklı sürücü'];

// Oyun içi sprite listesi: bake aracı bunları üretir
export const BAKE_NPC = (types) => {
  const list = [];
  for (const kind of Object.keys(types)) {
    const t = types[kind];
    t.colors.forEach((c, i) => list.push({ key: `npc:${kind}:${i}`, model: t.model || kind, color: c, finish: ['metal', 'gloss', 'matte'][i % 3], len: t.len, wid: t.wid, taxi: kind === 'taxi' }));
  }
  return list;
};
