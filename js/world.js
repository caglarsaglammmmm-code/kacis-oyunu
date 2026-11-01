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
const HW = W.highway;
// Otoban satırı: bu chunk sırasını doğudan batıya kesen bant
export const isHighwayRow = (cy) => ((cy - HW.offset) % HW.every + HW.every) % HW.every === 0;
export const HIGHWAY = { top: HW.y0 * TILE, mid: (HW.y0 + HW.half + 0.5) * TILE, bottom: (HW.y0 + HW.half * 2 + 1) * TILE };
export const isWaterRect = (rect) => rect.kind === 'water' || rect.kind === 'sea';
// Havuz ve şadırvan duvar gibidir; göl, gölet ve denize araba düşer
export const isDeep = (rect) => rect.kind === 'sea' || (rect.kind === 'water' && rect.deep);

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
    pads: [], padCount: 0, road: 0, alley: 0, paths: [], hw: false,
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
    c.paths.length = 0;
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
    const big = this.bigSiteAt(cx, cy);
    this.biomeAt(cx, cy, biomeOut);
    seedRng(cx, cy, this.seed);
    c.biome = biomeOut.biome;
    c.road = rint(0, 2); // Yol tonu: koyu asfalt, gri asfalt, açık beton
    c.alley = rint(0, 1);
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
    else if (t === 'donel') this.fillRoundabout(c);
    else if (t === 'viraj') this.fillCurvy(c);
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

    if (c.hw) this.carveHighway(c);
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
    r.sign = ''; r.signColor = ''; r.brand = ''; r.neon = false; r.deep = false; r.signSize = 1; r.block = 0;
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
          const sis = this.sistem;
          const clash = this.sites.some((o) => Math.abs(o.cx - ax) < 3 && Math.abs(o.cy - ay) < 3) || (Math.abs(sis.cx - ax) < 3 && Math.abs(sis.cy - ay) < 3);
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
      if (out.biome === 'city' && !isHighwayRow(cy) && Math.max(Math.abs(cx), Math.abs(cy)) > 1) found = { cx, cy };
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
