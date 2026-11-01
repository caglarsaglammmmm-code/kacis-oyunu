// Araç tanımından gerçek üç boyutlu model üretir. Menü, garaj ve sprite üretim aracı aynı kodu kullanır.
// x burun yönü değil: model önce (s, y, z) uzayında kurulur; dünya ekseni X uzunluk, Y yükseklik, Z yan.
import { CAR_MODELS } from './carmodels.js';

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
    emblem(y, z, kind, r = 0.055) {
      const cx = X(y); const cy = Y(z); const q = r * k;
      g.save(); g.translate(cx, cy); g.strokeStyle = '#eef2f6'; g.fillStyle = '#eef2f6'; g.lineWidth = q * 0.2;
      if (kind === 'rings3') { for (let i = -1; i <= 1; i++) { g.beginPath(); g.arc(i * q * 1.1, 0, q * 0.8, 0, 7); g.stroke(); } }
      else if (kind === 'star3') { g.beginPath(); g.arc(0, 0, q, 0, 7); g.stroke(); for (let i = 0; i < 3; i++) { const a = -1.57 + (i * 6.283) / 3; g.beginPath(); g.moveTo(Math.cos(a + 2) * q * 0.12, Math.sin(a + 2) * q * 0.12); g.lineTo(Math.cos(a) * q, Math.sin(a) * q); g.lineTo(Math.cos(a - 2) * q * 0.12, Math.sin(a - 2) * q * 0.12); g.fill(); } }
      else if (kind === 'propeller') { g.beginPath(); g.arc(0, 0, q, 0, 7); g.stroke(); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, q * 0.8, -1.57, 0); g.closePath(); g.fill(); g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, q * 0.8, 1.57, 3.14); g.closePath(); g.fill(); }
      else if (kind === 'rhomb') { g.beginPath(); g.moveTo(0, -q * 1.2); g.lineTo(q * 0.8, 0); g.lineTo(0, q * 1.2); g.lineTo(-q * 0.8, 0); g.closePath(); g.stroke(); }
      else if (kind === 'oval') { g.beginPath(); g.ellipse(0, 0, q * 1.3, q * 0.8, 0, 0, 7); g.stroke(); }
      else if (kind === 'bolt') { g.beginPath(); g.arc(0, 0, q, 0, 7); g.stroke(); g.beginPath(); g.moveTo(-q * 0.9, q * 0.1); g.lineTo(q * 0.9, -q * 0.1); g.stroke(); }
      else if (kind === 'tulip') { g.beginPath(); g.moveTo(0, q * 0.9); g.quadraticCurveTo(-q * 1.2, q * 0.1, -q * 0.7, -q); g.lineTo(0, -q * 0.3); g.lineTo(q * 0.7, -q); g.quadraticCurveTo(q * 1.2, q * 0.1, 0, q * 0.9); g.stroke(); }
      else if (kind === 'vw2') { g.beginPath(); g.arc(0, 0, q, 0, 7); g.stroke(); g.beginPath(); g.moveTo(-q * 0.6, -q * 0.3); g.lineTo(0, q * 0.5); g.lineTo(q * 0.6, -q * 0.3); g.stroke(); }
      else if (kind === 'link') { g.beginPath(); g.moveTo(-q, -q * 0.4); g.lineTo(0, q * 0.4); g.lineTo(q, -q * 0.4); g.stroke(); }
      else if (kind === 'shield') { g.beginPath(); g.moveTo(-q, -q); g.lineTo(q, -q); g.lineTo(q * 0.8, q * 0.4); g.lineTo(0, q); g.lineTo(-q * 0.8, q * 0.4); g.closePath(); g.stroke(); }
      else { g.fillRect(-q, -q * 0.5, q * 2, q * 0.28); g.fillRect(-q, q * 0.2, q * 2, q * 0.28); }
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
  const rimC = premium ? '#eef2f6' : '#b9c2cc';
  g.fillStyle = '#20242a'; g.beginPath(); g.arc(0, 0, 96, 0, 7); g.fill();
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
export function buildCar(THREE, id, paint) {
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
  if (m.hoodStar) { const st = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.02, 0.09, 6), chromeMat); st.position.set(0.05, deckF(0.02) + 0.09, 0); group.add(st); }
  if (m.chromeBelt) {
    const a = 0.3; const bd = 0.8;
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
  const mat = new THREE.MeshStandardMaterial({ map: tex, transparent: true, alphaTest: 0.04, roughness: 0.32, metalness: 0.15, emissive: '#ffffff', emissiveMap: tex, emissiveIntensity: 0.35 });
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
  ell(0.16, 0.05, 0.13, 0.22, 0.98, 0, acc);
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
export function makeEnv(THREE, renderer, warm = true, panels = true) {
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

export { CAR_MODELS };
