// Ana menü ve garaj sahnesi: Three.js ile dönen gerçek araç, İstanbul silüeti, deniz, hareketli ışıklar.
// Three.js vendor/ klasöründen gelir, internet gerekmez. WebGL yoksa CSS silüeti yedek olarak kalır.
import { buildCar, makeEnv } from './car3d.js';

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

export class Stage {
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
    this.angle = 0.7;
    this.spin = 0.32;
    this.drag = null;
    this.yShift = 0;
    this.fps = { t: 0, n: 0, slow: 0 };
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
      c.addColorStop(0, '#0b0a2a'); c.addColorStop(0.36, '#2b1458'); c.addColorStop(0.6, '#8a2a70'); c.addColorStop(0.78, '#f0603f'); c.addColorStop(0.92, '#ffb45e'); c.addColorStop(1, '#ffd98e');
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
      c.addColorStop(0, 'rgba(255,160,70,.5)'); c.addColorStop(1, 'rgba(255,120,40,0)');
      g.fillStyle = c; g.fillRect(0, 0, w, w);
    });
    const glow = new T.Mesh(new T.PlaneGeometry(10, 10), new T.MeshBasicMaterial({ map: glowT, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
    glow.rotation.x = -Math.PI / 2; glow.position.y = 0.04;
    scene.add(glow);

    // Işıklar
    scene.add(new T.HemisphereLight('#ffc9a0', '#20204a', 0.5));
    const key = new T.DirectionalLight('#ffd9b0', 2.2);
    key.position.set(4, 7, 6);
    scene.add(key);
    const rim = new T.DirectionalLight('#7fb0ff', 1.4);
    rim.position.set(-6, 4, -6);
    scene.add(rim);
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

    this.turn = new T.Group();
    scene.add(this.turn);
  }

  // shape: model, paint: boya
  setCar(shape, paint) {
    const key = `${shape}|${paint.color}|${paint.finish}|${paint.roof || ''}|${paint.accent || ''}`;
    if (key === this.carKey || !this.ok) return;
    this.carKey = key;
    const { T, turn } = this;
    while (turn.children.length) {
      const o = turn.children.pop();
      o.traverse((m) => { if (m.geometry) m.geometry.dispose(); if (m.material) { if (m.material.map) m.material.map.dispose(); m.material.dispose(); } });
    }
    const car = buildCar(T, shape, { ...paint, premium: 1, caliper: '#ff3a2a' });
    const { L } = car.userData;
    const k = 4.6 / Math.max(L, 2.4);
    const pivot = new T.Group();
    car.position.x = -L / 2;
    pivot.add(car);
    pivot.scale.setScalar(shape === 'moto' ? 1.5 : k);
    turn.add(pivot);
    // Yerde yansıma: ters çevrilmiş kopya
    const mirror = pivot.clone();
    mirror.scale.y *= -1;
    mirror.position.y = -0.01;
    turn.add(mirror);
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

    const asp = this.cam.aspect;
    const portrait = asp < 1;
    const garage = this.mode === 'garage';
    // Araç genişliğe sığsın: kamera uzaklığı en boy oranından gelir
    const dist = Math.max(11, 11 / asp) * (garage ? 0.92 : 1);
    const lift = portrait ? (garage ? -2.1 : -0.55) : 0;
    const lateral = !portrait ? (garage ? 2.2 : -1.4) : 0;
    const orbit = Math.sin(t * 0.14) * 0.07;
    const ease = Math.min(1, dt * 3);
    this.cx = this.cx === undefined ? dist : this.cx + (dist - this.cx) * ease;
    this.cl = this.cl === undefined ? lift : this.cl + (lift - this.cl) * ease;
    this.ct = this.ct === undefined ? lateral : this.ct + (lateral - this.ct) * ease;
    this.cam.position.set(Math.sin(orbit) * this.cx + this.ct, 2.5, Math.cos(orbit) * this.cx);
    this.cam.lookAt(this.ct, 1.0 + this.cl, 0);
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
