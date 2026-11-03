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
export function pixelCar(car, paintIdx = 0) {
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
export function paintPixelCar(target, car, paintIdx = 0) {
  const src = pixelCar(car, paintIdx);
  target.width = PXC_W; target.height = PXC_H;
  const g = target.getContext('2d');
  g.imageSmoothingEnabled = false;
  g.drawImage(src, 0, 0);
}
