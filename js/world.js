// Sonsuz şehir. Her chunk yalnızca kendi koordinatından ve tohumdan üretilir.
// Bağlantı garantisi: her chunk'ın batı ve kuzey kenarı kesintisiz ana yoldur; iç sokaklar
// kenardan kenara uzanır, yani iki ucu da ana yola bağlıdır. Çıkmaz sokak oluşmaz.
import { CONFIG, GROUND, BUILD } from './config.js';
import { circleRect } from './physics.js';

const W = CONFIG.world;
export const TILE = W.tile;
export const CT = W.chunkTiles;
export const CHUNK = TILE * CT;
const CELLS = CT * CT;
const ART = W.arterial;

export const PROP = {
  TREE: 0, FENCE: 1, CRATE: 2, BARREL: 3, CONE: 4, BARRIER: 5, PARKED: 6, HYDRANT: 7, BENCH: 8, COIN: 9, BUSH: 10,
  PALM: 11, UMBRELLA: 12, PINE: 13, ROCK: 14, CACTUS: 15, HAY: 16, POWER_BLAST: 17, POWER_GHOST: 18, POWER_HEAL: 19, POWER_GIANT: 20,
  CHAIRS: 21, UNCLES: 22, SIMITCART: 23, STALL: 24, LAUNDRY: 25, QUEUE: 26,
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

export const POWER_KINDS = ['blast', 'ghost', 'heal', 'giant'];
export const isPower = (kind) => kind >= PROP.POWER_BLAST && kind <= PROP.POWER_GIANT;
export const powerName = (kind) => POWER_KINDS[kind - PROP.POWER_BLAST];
export const isWaterRect = (rect) => rect.kind === 'water' || rect.kind === 'sea';

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
    lights: [], lightCount: 0, siteName: '',
  };
}

export class World {
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
    if (t === 'city' || t === 'downtown') this.fillCity(c);
    else if (t === 'mahalle') this.fillMahalle(c);
    else if (t === 'gecekondu') this.fillGecekondu(c);
    else if (t === 'site') this.fillSite(c, SITE_NAMES[rint(0, SITE_NAMES.length - 1)], PASTELS[rint(0, PASTELS.length - 1)], rint(0, 1), true);
    else if (t === 'bigsite') this.fillSite(c, big.name, big.color, big.layout, c.cx === big.cx && c.cy === big.cy);
    else if (t === 'gece') this.fillGece(c);
    else if (t === 'cami') this.fillLandmark(c, BUILD.MOSQUE, 11, 11, '#c7cdd3', GROUND.PLAZA, '');
    else if (t === 'stadyum') this.fillLandmark(c, BUILD.STADIUM, 16, 16, '#58606b', GROUND.WALK, '');
    else if (t === 'hastane') this.fillLandmark(c, BUILD.HOSPITAL, 13, 11, '#f1f5f8', GROUND.PLAZA, 'Devlet Hastanesi');
    else if (t === 'okul') this.fillLandmark(c, BUILD.SCHOOL, 13, 10, '#e8cf9a', GROUND.DIRT, 'Atatürk İlkokulu');
    else if (t === 'pazar') this.fillPazar(c);
    else if (t === 'sistem') this.fillSistem(c);
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
    r.sign = ''; r.signColor = ''; r.brand = ''; r.neon = false;
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
    // Ara sokak bir ya da iki karo: dar ve hissedilir
    const gap = through && len >= 7 && chance(0.62) ? rint(1, 2) : 0;
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
    if (area >= 9 && chance(downtown ? 0.75 : 0.1)) {
      this.addRect(c, 'building', x0, y0, x1, y1, 3, rint(BUILD.TOWER_GLASS, BUILD.TOWER_STEP), TOWER_COLORS[rint(0, TOWER_COLORS.length - 1)]);
      return;
    }
    const SG = CONFIG.signs;
    const W2 = x1 - x0;
    const pick = (o) => Object.keys(o)[rint(0, Object.keys(o).length - 1)];
    // Zincir market, gross market ve banka: her biri kendi cephesiyle
    if (area >= 12 && chance(0.34)) {
      const brand = pick(SG.chains);
      const r = this.addRect(c, 'building', x0, y0, x1, y1, 3, BUILD.CHAIN, SG.chains[brand]);
      r.brand = brand; r.sign = brand; r.signColor = SG.chains[brand];
      return;
    }
    if (area >= 12 && chance(0.1)) {
      const r = this.addRect(c, 'building', x0, y0, x1, y1, 3, BUILD.MARKET, SG.colors[rint(0, SG.colors.length - 1)]);
      r.sign = SG.markets[rint(0, SG.markets.length - 1)];
      r.signColor = r.color;
      return;
    }
    if (area >= 6 && chance(0.2)) {
      const name = pick(SG.banks);
      const r = this.addRect(c, 'building', x0, y0, x1, y1, 3, BUILD.BANK, '#d7dbdf');
      r.sign = name; r.signColor = SG.banks[name];
      return;
    }
    if (downtown && area >= 6) {
      const k = rint(0, 3);
      const style = [BUILD.RESIDENCE, BUILD.OFFICE, BUILD.HOTEL, BUILD.ISHANI][k];
      const r = this.addRect(c, 'building', x0, y0, x1, y1, 3, style, '#8aa0b8');
      if (k === 2) { r.sign = ['Grand Otel', 'Otel Boğaz', 'Park Hotel'][rint(0, 2)]; r.signColor = '#7a5a1c'; }
      return;
    }
    if (W2 >= 3 && chance(0.2)) {
      const r = this.addRect(c, 'building', x0, y0, x1, y1, 3, BUILD.SHOPROW, '#c8c0b0');
      r.sign = SG.shops[rint(0, SG.shops.length - 1)];
      r.signColor = SG.colors[rint(0, SG.colors.length - 1)];
      return;
    }
    if (chance(0.06)) { this.addRect(c, 'building', x0, y0, x1, y1, 3, BUILD.ISHANI, '#b0b4b8'); return; }
    if (area <= 9 && chance(0.2)) { this.addRect(c, 'building', x0, y0, x1, y1, 4, BUILD.VILLA, '#efe6d4'); return; }
    const apt = chance(0.72);
    const style = apt ? BUILD.APARTMENT : area >= 30 ? rint(0, 4) : rint(0, 3);
    const r = this.addRect(c, 'building', x0, y0, x1, y1, 3, style, ROOFS[rint(0, ROOFS.length - 1)]);
    if (chance(0.7)) {
      r.sign = SG.shops[rint(0, SG.shops.length - 1)];
      r.signColor = SG.colors[rint(0, SG.colors.length - 1)];
    }
  }

  sidewalkTrees(c, x0, y0, x1, y1) {
    for (let x = x0 + 1; x < x1 - 1; x += 2) {
      if (chance(0.3)) this.addProp(c, this.streetProp(), c.x + (x + 0.5) * TILE, c.y + y0 * TILE + 13);
      if (chance(0.3)) this.addProp(c, this.streetProp(), c.x + (x + 0.5) * TILE, c.y + y1 * TILE - 13);
    }
    for (let y = y0 + 1; y < y1 - 1; y += 2) {
      if (chance(0.25)) this.addProp(c, PROP.TREE, c.x + x0 * TILE + 13, c.y + (y + 0.5) * TILE);
      if (chance(0.25)) this.addProp(c, PROP.TREE, c.x + x1 * TILE - 13, c.y + (y + 0.5) * TILE);
    }
  }

  // Kaldırım hayatı: ağaç, plastik masa, amcalar, simit arabası
  streetProp() {
    const k = rnd();
    if (k < 0.38) return PROP.TREE;
    if (k < 0.6) return PROP.CHAIRS;
    if (k < 0.76) return PROP.UNCLES;
    if (k < 0.9) return PROP.SIMITCART;
    return PROP.HYDRANT;
  }

  // Dar mahalle: 2 karo genişlikte sokaklar, ip ip çamaşır, sıkışık apartmanlar
  fillMahalle(c) {
    const cut = (vertical, out) => {
      out.length = 0;
      out.push(ART);
      const n = rint(2, 3);
      let at = ART + rint(5, 6);
      for (let i = 0; i < n && at + 2 < CT - 4; i++) {
        this.addStreet(c, vertical, at, 2);
        out.push(at, at + 2);
        at += 2 + rint(5, 6);
      }
      out.push(CT);
    };
    cut(true, xsBuf);
    cut(false, ysBuf);
    let stubs = rint(1, 2);
    for (let j = 0; j < ysBuf.length; j += 2) {
      for (let i = 0; i < xsBuf.length; i += 2) {
        const [a, b, d, e] = [xsBuf[i], ysBuf[j], xsBuf[i + 1], ysBuf[j + 1]];
        if (stubs > 0 && d - a >= 7 && e - b >= 6 && chance(0.6)) {
          stubs--;
          this.deadEndLot(c, a, b, d, e);
        } else {
          this.cityLot(c, a, b, d, e);
        }
      }
    }
    // Sokağın üstünden geçen çamaşır ipleri
    for (let i = 0; i < c.streetCount; i++) {
      const s = c.streets[i];
      for (let k = ART + rint(2, 5); k < CT - 1; k += rint(6, 10)) {
        const m = (s.pos + s.width / 2) * TILE;
        const at = (k + 0.5) * TILE;
        if (s.vertical) this.addProp(c, PROP.LAUNDRY, c.x + m, c.y + at, 0);
        else this.addProp(c, PROP.LAUNDRY, c.x + at, c.y + m, Math.PI / 2);
      }
    }
  }

  // Çıkmaz sokak: kısa, ucu dönüş cepli; binalar iki yanında
  deadEndLot(c, x0, y0, x1, y1) {
    this.setGround(c, x0, y0, x1, y1, GROUND.WALK);
    const sx = (x0 + x1) >> 1;
    const end = y1 - 2;
    this.setGround(c, sx - 1, y0, sx + 1, end - 1, GROUND.ROAD);
    this.setGround(c, sx - 2, end - 2, sx + 2, end, GROUND.ROAD);
    this.lotY0 = -1; this.lotX0 = -1; // Yanlardaki parsellerde ara sokak açılmaz
    this.split(c, x0 + 1, y0 + 1, sx - 2, y1 - 1, 4);
    this.split(c, sx + 2, y0 + 1, x1 - 1, y1 - 1, 4);
  }

  // Gecekondu mahallesi: düzensiz, sıkışık, patika yollu
  fillGecekondu(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.DIRT);
    for (let i = 0; i < 46; i++) {
      this.place(c, 'building', rint(6, 21), rint(6, 21), rint(1, 2), rint(1, 2), BUILD.GECEKONDU, '#b08a5a', 2);
    }
    this.scatter(c, PROP.CRATE, 8, [GROUND.DIRT]);
    this.scatter(c, PROP.BARREL, 6, [GROUND.DIRT]);
    this.scatter(c, PROP.UNCLES, 4, [GROUND.DIRT]);
    this.scatter(c, PROP.BUSH, 6, [GROUND.DIRT]);
  }

  // Site: çok bloklu, ortası havuz ve yeşil alan, kenarda otopark. layout mimariyi değiştirir
  fillSite(c, name, color, layout, withSign) {
    this.setGround(c, ART, ART, CT, CT, GROUND.GRASS);
    this.setGround(c, ART, ART, CT, ART + 1, GROUND.WALK);
    this.setGround(c, ART, CT - 1, CT, CT, GROUND.WALK);
    this.setGround(c, ART, ART, ART + 1, CT, GROUND.WALK);
    this.setGround(c, CT - 1, ART, CT, CT, GROUND.WALK);
    c.siteName = name;
    // Ortada havuz
    const px = 12; const py = 12;
    this.setGround(c, px, py, px + 5, py + 5, GROUND.WATER);
    this.addRect(c, 'water', px, py, px + 5, py + 5, 5, 0, '#57c1f0');
    const blocks = layout === 0
      ? [[6, 6], [12, 6], [18, 6], [6, 12], [18, 12], [6, 18], [12, 18], [18, 18]]
      : [[7, 6], [15, 6], [6, 11], [18, 11], [7, 18], [15, 18]];
    const bw = layout === 0 ? 4 : 5;
    const bh = layout === 0 ? 4 : 4;
    for (const [x, y] of blocks) {
      const r = this.place(c, 'building', x, y, bw, bh, BUILD.SITE_BLOCK, color);
      if (r && withSign && !c.siteSigned) { r.sign = name; r.signColor = '#23422f'; c.siteSigned = true; }
    }
    c.siteSigned = false;
    this.scatter(c, PROP.TREE, 26, [GROUND.GRASS]);
    this.scatter(c, PROP.BENCH, 8, [GROUND.GRASS]);
    this.scatter(c, PROP.BUSH, 12, [GROUND.GRASS]);
    // Otopark sırası
    for (let k = 7; k < CT - 2; k += 2) this.addProp(c, PROP.PARKED, c.x + (k + 0.5) * TILE, c.y + (ART + 0.5) * TILE, Math.PI / 2);
  }

  // Gece hayatı: neon tabelalı mekânlar, kapıda güvenlik ve bekleyen kalabalık
  fillGece(c) {
    this.cutStreets(c, 1, chance(0.5), xsBuf);
    this.setGround(c, ART, ART, CT, CT, GROUND.WALK);
    for (let i = 0; i < c.streetCount; i++) {
      const s = c.streets[i];
      if (s.vertical) this.setGround(c, s.pos, ART, s.pos + s.width, CT, GROUND.ROAD);
      else this.setGround(c, ART, s.pos, CT, s.pos + s.width, GROUND.ROAD);
    }
    const SG = CONFIG.signs;
    for (let i = 0; i < 30; i++) {
      const r = this.place(c, 'building', rint(6, 18), rint(6, 18), rint(3, 5), 3, BUILD.CLUB, SG.neon[rint(0, SG.neon.length - 1)]);
      if (r) {
        r.sign = SG.clubs[rint(0, SG.clubs.length - 1)];
        r.signColor = '#1b1426';
        r.neon = true;
        const p = this.addProp(c, PROP.QUEUE, r.x + r.w / 2, r.y + r.h + 22);
        p.rot = 0;
      }
    }
    this.scatter(c, PROP.CHAIRS, 4, [GROUND.WALK]);
  }

  fillLandmark(c, style, w, h, color, ground, sign) {
    this.setGround(c, ART, ART, CT, CT, ground);
    const x = 5 + ((19 - w) >> 1);
    const y = 5 + ((19 - h) >> 1);
    const r = this.addRect(c, 'building', x, y, x + w, y + h, 3, style, color);
    if (sign) { r.sign = sign; r.signColor = '#23422f'; }
    this.scatter(c, PROP.TREE, 12, [ground]);
    this.scatter(c, PROP.BENCH, 6, [ground]);
    this.scatter(c, PROP.SIMITCART, 2, [ground]);
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
        this.addLight(c, 0, c.x + ART * TILE + 7, c.y + (k + 0.5) * TILE, 0, 0, null);
        this.addLight(c, 0, c.x + (k + 0.5) * TILE, c.y + ART * TILE + 7, 0, 0, null);
      }
    }
  }

  // Üstü kapalı pazar yeri ve çevresindeki tezgâhlar
  fillPazar(c) {
    this.setGround(c, ART, ART, CT, CT, GROUND.PLAZA);
    this.addRect(c, 'building', 9, 9, 20, 13, 3, BUILD.BAZAAR, '#d9281e');
    this.addRect(c, 'building', 9, 16, 20, 20, 3, BUILD.BAZAAR, '#1d6fb8');
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
    this.addRect(c, 'building', 6, 6, 23, 22, 3, BUILD.SISTEM, '#ff7a00');
    for (let k = 7; k < 22; k += 3) this.addProp(c, PROP.BENCH, c.x + (k + 0.5) * TILE, c.y + 22.6 * TILE);
    this.scatter(c, PROP.SIMITCART, 3, [GROUND.PLAZA]);
  }

  // Yol kenarına park etmiş arabalar; kavşak ağızlarına konmaz
  parkedAlongStreets(c, p) {
    for (let i = 0; i < c.streetCount; i++) {
      const s = c.streets[i];
      if (s.width < 3) continue; // Dar sokak park almaz
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
    for (let i = 0; i < saved.props.length && i < c.propCount; i++) if (saved.props[i]) c.props[i].alive = false;
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
const SITE_NAMES = CONFIG.signs.sites;
const PASTELS = ['#7fa8c9', '#c9a27f', '#a0a8b8', '#8fb59a', '#c98f8f', '#b0a080', '#9a8fc0'];
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
