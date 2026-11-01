// Sonsuz şehir. Her chunk yalnızca kendi koordinatından ve tohumdan üretilir.
// Bağlantı garantisi: her chunk'ın batı ve kuzey kenarı kesintisiz ana yoldur; iç sokaklar
// kenardan kenara uzanır, yani iki ucu da ana yola bağlıdır. Çıkmaz sokak oluşmaz.
import { CONFIG, GROUND } from './config.js';
import { circleRect } from './physics.js';

const W = CONFIG.world;
export const TILE = W.tile;
export const CT = W.chunkTiles;
export const CHUNK = TILE * CT;
const CELLS = CT * CT;
const ART = W.arterial;

export const PROP = {
  TREE: 0, FENCE: 1, CRATE: 2, BARREL: 3, CONE: 4, BARRIER: 5, PARKED: 6, HYDRANT: 7, BENCH: 8, COIN: 9, BUSH: 10,
};

// r: çarpışma yarıçapı, brk: kırılması için gereken hız, drag: arabanın kaybettiği hız payı,
// dmg: oyuncuya hasar, coin: coin düşürür mü
export const PROP_INFO = [
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
];

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
    template: 'city', dirty: true, canvas: null, lastSeen: 0,
  };
}

export class World {
  constructor(seed = 12345) {
    this.seed = seed | 0;
    this.chunks = new Map();
    this.free = [];
    this.onRelease = null; // Çizim tarafı önbelleği geri alır
    this.frame = 0;
    this.lastChunk = null;
    this.lastKey = -1;
    this.list = []; // Yüklü chunk'ların tahsissiz dolaşımı için
  }

  reset(seed) {
    for (const c of this.chunks.values()) this.release(c);
    this.chunks.clear();
    this.list.length = 0;
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

    const home = Math.abs(cx) <= 1 && Math.abs(cy) <= 1;
    const t = home ? 'city' : pickTemplate();
    c.template = t;
    if (t === 'city') this.fillCity(c);
    else if (t === 'suburb') this.fillSuburb(c);
    else if (t === 'park') this.fillPark(c);
    else if (t === 'lake') this.fillLake(c);
    else if (t === 'industrial') this.fillIndustrial(c);
    else this.fillPlaza(c);

    this.arterialDetails(c);
    this.finishCost(c);
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

  addStreet(c, vertical, pos, width) {
    let s = c.streets[c.streetCount];
    if (!s) { s = { vertical: false, pos: 0, width: 0 }; c.streets[c.streetCount] = s; }
    c.streetCount++;
    s.vertical = vertical; s.pos = pos; s.width = width;
    if (vertical) this.setGround(c, pos, ART, pos + width, CT, GROUND.ROAD);
    else this.setGround(c, ART, pos, CT, pos + width, GROUND.ROAD);
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

  // Ana yol üstü: kenarda park, yol çalışması, coin sıraları
  arterialDetails(c) {
    const edgeFar = ART * TILE - 15;
    for (let k = ART + 1; k < CT - 1; k += 2) {
      // Dikey ana yolun doğu kenarı
      if (chance(0.16) && c.ground[k * CT + ART] !== GROUND.ROAD && c.ground[(k + 1) * CT + ART] !== GROUND.ROAD && c.ground[(k - 1) * CT + ART] !== GROUND.ROAD) {
        this.addProp(c, PROP.PARKED, c.x + edgeFar, c.y + (k + 0.5) * TILE, Math.PI / 2);
      }
      if (chance(0.16) && c.ground[ART * CT + k] !== GROUND.ROAD && c.ground[ART * CT + k + 1] !== GROUND.ROAD && c.ground[ART * CT + k - 1] !== GROUND.ROAD) {
        this.addProp(c, PROP.PARKED, c.x + (k + 0.5) * TILE, c.y + edgeFar, 0);
      }
    }
    // Yol çalışması: yolun yarısından azını kaplar, her zaman boşluk kalır
    if (chance(0.3)) {
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
  }

  finishCost(c) {
    const COST = [3, 1, 2, 1, 0, 3, 2];
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

const xsBuf = [];
const ysBuf = [];

function pickTemplate() {
  const t = W.templates;
  let sum = 0;
  for (const k in t) sum += t[k];
  let r = rnd() * sum;
  for (const k in t) {
    r -= t[k];
    if (r < 0) return k;
  }
  return 'city';
}
