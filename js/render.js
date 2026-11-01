// Canvas çizimi. Sprite'lar açılışta koddan üretilir; sadece ekrandaki nesneler çizilir.
import { CONFIG, GROUND } from './config.js';
import { CHUNK, CT, TILE, PROP } from './world.js';
import { FX } from './effects.js';

const PF = CONFIG.perf;
const SPR = 3; // Sprite ölçeği: arabalar yakın çekimde de keskin kalsın
const ART_W = CONFIG.world.arterial * TILE;

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = Math.ceil(w);
  c.height = Math.ceil(h);
  return c;
}

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

// --- Araba çizimleri: burun +x yönünde ---
export function paintCar(g, len, wid, body, accent, style = 'sport') {
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

  // Boylamasına şerit
  g.fillStyle = accent;
  if (style === 'sport') {
    g.fillRect(-L + 2, -2.4, len - 4, 1.8);
    g.fillRect(-L + 2, 0.6, len - 4, 1.8);
  }
  // Ön ve arka cam, tavan
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
  // Farlar ve stoplar
  g.fillStyle = '#fff7c2';
  g.fillRect(L - 2.5, -H + 2.5, 2.5, 4.5);
  g.fillRect(L - 2.5, H - 7, 2.5, 4.5);
  g.fillStyle = '#ff2b2b';
  g.fillRect(-L, -H + 2.5, 2, 4.5);
  g.fillRect(-L, H - 7, 2, 4.5);
}

function paintPolice(g, spec, advanced) {
  const L = spec.len / 2;
  const H = spec.wid / 2;
  paintCar(g, spec.len, spec.wid, advanced ? '#20242f' : '#f5f7fb', advanced ? '#4d7cff' : '#2356c7', 'plain');
  g.fillStyle = advanced ? '#4d7cff' : '#2356c7';
  g.fillRect(-L * 0.42, -H, L * 0.44, 3.5);
  g.fillRect(-L * 0.42, H - 3.5, L * 0.44, 3.5);
  g.fillRect(L * 0.62, -H + 2, L * 0.3, spec.wid - 4);
  // Tepe lambası
  g.fillStyle = '#ff2a3c';
  rr(g, -L * 0.28, -H + 2, 5, wid2(H), 1.5);
  g.fill();
  g.fillStyle = '#2a66ff';
  rr(g, -L * 0.28, 0, 5, wid2(H), 1.5);
  g.fill();
}
const wid2 = (H) => H - 2;

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
  g.fillRect(L - 2, -H, 3, spec.wid); // tampon
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

export function carSprite(spec) {
  return sprite(spec.len + 8, spec.wid + 8, (g) => paintCar(g, spec.len, spec.wid, spec.color, spec.accent, 'sport'));
}

export class Renderer {
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

  makeSprites() {
    const P = CONFIG.police;
    const s = this.sprites;
    s.car = sprite(P.car.len + 8, P.car.wid + 8, (g) => paintPolice(g, P.car, false));
    s.advanced = sprite(P.advanced.len + 8, P.advanced.wid + 8, (g) => paintPolice(g, P.advanced, true));
    s.swat = sprite(P.swat.len + 8, P.swat.wid + 8, (g) => paintSwat(g, P.swat));
    s.tank = sprite(P.tank.len + 8, P.tank.wid + 8, (g) => paintTankHull(g, P.tank));
    s.turret = sprite(150, 50, paintTurret);
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
    s.head = glow(128, [[0, 'rgba(255,245,200,.35)'], [1, 'rgba(255,245,200,0)']]);

    const prop = (w, h, paint) => sprite(w, h, paint);
    s.props = [];
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
    s.parked = ['#6a7aa0', '#b0504a', '#d6c56b', '#59a58c', '#dddddd'].map((col) => sprite(54, 32, (g) => paintCar(g, 44, 24, col, col, 'plain')));
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
      if (r.alive && r.kind === 'building') { g.fillStyle = 'rgba(0,10,30,.26)'; rr(g, r.x + 12, r.y + 15, r.w, r.h, 5); g.fill(); }
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
    // Su karosu altta kıyı rengindedir; yuvarlak gölet köşelerinde mavi taşmasın
    const shore = c.template === 'lake' ? '#f2dfa4' : c.template === 'plaza' ? '#e5d7bf' : '#6cc24a';
    const colors = ['#6cc24a', '#585f6b', '#cdd2d6', '#e5d7bf', shore, '#f2dfa4', '#b79c6c'];
    for (let y = 0; y < CT; y++) {
      for (let x = 0; x < CT; x++) {
        const t = c.ground[y * CT + x];
        g.fillStyle = colors[t];
        const px = c.x + x * TILE;
        const py = c.y + y * TILE;
        g.fillRect(px, py, TILE + 1, TILE + 1);
        const h = ((x * 73856093) ^ (y * 19349663) ^ (c.cx * 83492791) ^ (c.cy * 49979693)) >>> 0;
        if (t === GROUND.GRASS) {
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
        } else if (t === GROUND.ROAD && (h & 7) === 0) {
          g.fillStyle = 'rgba(0,0,0,.06)';
          g.fillRect(px + (h >>> 8) % 24, py + (h >>> 14) % 24, 14, 10);
        }
      }
    }
    // Kaldırım kenarları
    g.fillStyle = 'rgba(245,247,250,.85)';
    for (let y = 0; y < CT; y++) {
      for (let x = 0; x < CT; x++) {
        if (c.ground[y * CT + x] !== GROUND.ROAD) continue;
        const px = c.x + x * TILE;
        const py = c.y + y * TILE;
        if (x < CT - 1 && c.ground[y * CT + x + 1] !== GROUND.ROAD) g.fillRect(px + TILE - 2, py, 3, TILE);
        if (y < CT - 1 && c.ground[(y + 1) * CT + x] !== GROUND.ROAD) g.fillRect(px, py + TILE - 2, TILE, 3);
        if (x > 0 && c.ground[y * CT + x - 1] !== GROUND.ROAD) g.fillRect(px - 1, py, 3, TILE);
        if (y > 0 && c.ground[(y - 1) * CT + x] !== GROUND.ROAD) g.fillRect(px, py - 1, TILE, 3);
      }
    }
    // Sınırda: komşu chunk'ın ana yoluna bakan kenar
    for (let i = ART_W / TILE; i < CT; i++) {
      if (c.ground[i * CT + CT - 1] !== GROUND.ROAD) g.fillRect(c.x + CHUNK - 2, c.y + i * TILE, 2, TILE);
      if (c.ground[(CT - 1) * CT + i] !== GROUND.ROAD) g.fillRect(c.x + i * TILE, c.y + CHUNK - 2, TILE, 2);
    }

    // Ana yol çizgileri: sarı orta şerit, beyaz yaya geçidi
    const mid = ART_W / 2;
    g.fillStyle = '#ffd23f';
    for (let d = ART_W + 30; d < CHUNK - 30; d += 56) {
      g.fillRect(c.x + mid - 2, c.y + d, 4, 30);
      g.fillRect(c.x + d, c.y + mid - 2, 30, 4);
    }
    g.fillStyle = 'rgba(255,255,255,.8)';
    for (let i = 8; i < ART_W - 8; i += 18) {
      g.fillRect(c.x + i, c.y + ART_W + 4, 9, 18);
      g.fillRect(c.x + ART_W + 4, c.y + i, 18, 9);
      g.fillRect(c.x + i, c.y - 22, 9, 18);
      g.fillRect(c.x - 22, c.y + i, 18, 9);
    }
    // İç sokak kesik çizgileri
    g.fillStyle = 'rgba(255,255,255,.65)';
    for (let i = 0; i < c.streetCount; i++) {
      const s = c.streets[i];
      const m = (s.pos + s.width / 2) * TILE;
      for (let d = ART_W + 26; d < CHUNK - 30; d += 50) {
        if (s.vertical) {
          if (c.ground[Math.floor(d / TILE) * CT + s.pos - 1] !== GROUND.ROAD) g.fillRect(c.x + m - 1.5, c.y + d, 3, 24);
        } else if (c.ground[(s.pos - 1) * CT + Math.floor(d / TILE)] !== GROUND.ROAD) {
          g.fillRect(c.x + d, c.y + m - 1.5, 24, 3);
        }
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
    if (game.state === 'play') this.prebake(game, c0x, c1x, c0y, c1y);

    this.drawDecals(game, vx0, vx1, vy0, vy1);
    this.drawSkids(game, vx0, vx1, vy0, vy1);
    this.drawSpikes(game);
    this.drawShots(game, now);
    this.drawProps(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now, false);
    this.drawCops(game, now, vx0, vx1, vy0, vy1);
    if (game.state !== 'dying' && game.state !== 'over') this.drawPlayer(game);
    this.drawProps(game, c0x, c1x, c0y, c1y, vx0, vx1, vy0, vy1, now, true);
    this.drawParticles(game, vx0, vx1, vy0, vy1);
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
          const isTall = pr.kind === PROP.TREE;
          if (isTall !== tall) continue;
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
          const w = img.width / SPR;
          const h = img.height / SPR;
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

  drawBody(img, b, shadowScale = 1) {
    const ctx = this.ctx;
    const sp = this.sprites.shadow;
    ctx.globalAlpha = 0.28;
    this.place(b.x + 5 * shadowScale, b.y + 7 * shadowScale, b.a);
    const sw = (b.len + 6);
    const sh = (b.wid + 4);
    ctx.drawImage(sp, -sw / 2, -sh / 2, sw, sh);
    ctx.globalAlpha = 1;
    this.place(b.x, b.y, b.a);
    const w = img.width / SPR;
    const h = img.height / SPR;
    ctx.drawImage(img, -w / 2, -h / 2, w, h);
  }

  drawPlayer(game) {
    const ctx = this.ctx;
    const p = game.player;
    if (this.playerId !== game.carSpec.id) {
      this.playerId = game.carSpec.id;
      this.playerSprite = carSprite(game.carSpec);
    }
    // Far ışığı
    const fx = Math.cos(p.a);
    const fy = Math.sin(p.a);
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
    ctx.globalAlpha = 0.6;
    ctx.drawImage(this.sprites.head, p.x + fx * 60 - 50, p.y + fy * 60 - 50, 100, 100);
    ctx.globalAlpha = 1;
    this.drawBody(this.playerSprite, p);
    if (game.stage >= 2) {
      ctx.globalAlpha = game.stage >= 3 ? 0.42 : 0.22;
      ctx.drawImage(this.sprites.dark, -p.len * 0.2, -p.wid * 0.9, p.len, p.wid * 1.8);
      ctx.globalAlpha = 1;
    }
    ctx.setTransform(this.s, 0, 0, this.s, this.ox, this.oy);
  }

  drawCops(game, now, x0, x1, y0, y1) {
    const ctx = this.ctx;
    const sp = this.sprites;
    for (const c of game.cops) {
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
      if (c.type === 'tank') continue;
      if (c.x < x0 - 90 || c.x > x1 + 90 || c.y < y0 - 90 || c.y > y1 + 90) continue;
      const on = Math.floor(now / 130 + c.id) % 2 === 0;
      const side = c.wid * 0.5;
      const nx = -Math.sin(c.a) * side;
      const ny = Math.cos(c.a) * side;
      const R = c.type === 'swat' ? 66 : 54;
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

