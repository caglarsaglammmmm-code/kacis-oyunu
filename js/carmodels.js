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
export const CAR_MODELS = {
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
      d.poly([[-0.5, 0.74], [0.5, 0.74], [0.38, 0.52], [-0.38, 0.52]], BLK);
      d.polyLine([[-0.5, 0.74], [0.5, 0.74], [0.38, 0.52], [-0.38, 0.52]], CRM, 0.028);
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
    roof: [[0.34, 0.94], [0.49, 1.38], [0.62, 1.44], [0.78, 1.38], [0.9, 1.02], [0.92, 1.0]],
    win: [[0.44, 0.61], [0.62, 0.8]], seams: [0.33, 0.6, 0.8], handles: [0.57, 0.77], hood: 0.33, trunk: 0.89,
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
    roof: [[0.26, 0.93], [0.42, 1.38], [0.5, 1.43], [0.7, 1.43], [0.8, 1.32], [0.88, 1.05], [0.895, 1.03]],
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
    roof: [[0.28, 0.93], [0.42, 1.36], [0.54, 1.45], [0.66, 1.44], [0.78, 1.32], [0.9, 1.04], [0.92, 1.02]],
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
    win: [[0.38, 0.58], [0.59, 0.72]], seams: [0.3, 0.585, 0.8], handles: [0.56, 0.72], hood: 0.3, trunk: 0.96,
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
