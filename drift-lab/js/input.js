// Üç dokunmatik kontrol tek yerde. Klavye her modda aynı çalışır.
// zones: sağ yarı = sağa, sol yarı = sola, ikisi birden = geri (eski sistem, aynen).
// wheel: sağ altta direksiyon, parmağın merkeze göre açısını izler.
// stick: sol yarıda basılan yerde beliren görünmez joystick.
// DOM'a dokunmaz: görünüm controls.js'tedir, burası birim testle sınanır.
import { CONFIG } from './config.js';
import { CheatCode } from './cheat.js';

export const CONTROLS = ['zones', 'wheel', 'stick'];
const WH = CONFIG.input.wheel;
const SK = CONFIG.input.stick;
export const WHEEL_MAX = (WH.maxDeg * Math.PI) / 180; // Tam kilit açısı
const WHEEL_JUMP = (WH.jump * Math.PI) / 180;
export const STICK_R = SK.r;
const CH = CONFIG.cheat;

const wrap = (a) => {
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
};

export class Input {
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
    this.wheelA = 0; // Direksiyon açısı (parmağın biriktirdiği), radyan
    this.wheelS = 0; // Yumuşatılmış açı: değer ve görünüm bundan
    this.wheelPrev = 0;
    this.wheelHole = false; // Parmak merkezde: açı kararsız, çıkınca fark yeniden başlar (sıçrama olmaz)
    this.stickId = null;
    // x, y: halkanın görünen yeri (ekrana sığar). ox, oy: değerin merkezi (parmağın bastığı nokta)
    this.stick = { on: false, x: 0, y: 0, ox: 0, oy: 0, dx: 0, dy: 0 };
    this.axis = 0; // Yumuşatılmış analog direksiyon
    this.revHeld = false;
    this.bounds = { l: 0, t: 0, r: 1, b: 1 }; // Joystick halkası bunun dışına taşmaz
    this.code = new CheatCode();
    this.onCode = null;
    this.onFire = null; // Boşluk: ateş
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
      // Bırakınca yaylı dönüş; tutarken açıya düşük geçiren yumuşatma (titreme yok, kare hızından bağımsız)
      if (this.wheelId === null) {
        this.wheelA *= Math.exp(-WH.returnRate * dt);
        if (Math.abs(this.wheelA) < 0.004) this.wheelA = 0;
      }
      this.wheelS += (this.wheelA - this.wheelS) * (1 - Math.exp(-WH.smooth * dt));
      if (this.wheelId === null && Math.abs(this.wheelS) < 0.004) this.wheelS = 0;
      const v = this.wheelS / WHEEL_MAX;
      this.axis = Math.abs(v) < WH.dead ? 0 : v;
    } else if (this.mode === 'stick') {
      const s = this.stick;
      const m = Math.abs(s.dx);
      const target = !s.on || m <= SK.dead ? 0 : Math.sign(s.dx) * Math.min(1, (m - SK.dead) / (SK.r - SK.dead));
      this.axis += (target - this.axis) * (1 - Math.exp(-SK.smooth * dt));
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
    this.resetPointers();
    this.wheelA = 0;
    this.wheelS = 0;
    this.axis = 0;
    this.revHeld = false;
    this.code.reset();
    this.heldT = 0;
    this.axisReady = true;
  }

  // Direksiyon ve joystick parmağı bırakılır (ekran döndü, yeniden yerleşim): direksiyon yaylı döner
  resetPointers() {
    this.wheelId = null;
    this.wheelHole = false;
    this.stickId = null;
    this.stick.on = false;
    this.stick.dx = 0;
    this.stick.dy = 0;
  }

  sideOf(x) {
    return x < this.width / 2 ? 'L' : 'R';
  }

  key(code, down) {
    // Boşluk yalnız silahlı araba oyundayken ateştir; başka zaman tarayıcıya bırakılır
    if (code === 'Space') return !!this.onFire && this.onFire(down) === true;
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
      if (!w.r || dx * dx + dy * dy > w.r * w.r * WH.grab * WH.grab) return false; // Dışarıdaki dokunuş direksiyonu etkilemez
      this.wheelId = id;
      // Basıldığı andaki açı başlangıçtır: direksiyon olduğu yerden devam eder, parmağın mutlak açısına atlamaz
      this.wheelPrev = Math.atan2(dy, dx);
      this.wheelHole = dx * dx + dy * dy < w.r * w.r * WH.hole * WH.hole;
      return true;
    }
    if (this.stickId !== null || x >= this.width / 2) return false;
    const b = this.bounds;
    const room = SK.r + 8;
    const s = this.stick;
    this.stickId = id;
    s.on = true;
    // Değerin merkezi parmağın bastığı nokta: kenara yakın basınca ilk harekette ani tam dönüş olmaz.
    // Halka yalnız görünüşte ekrana sığacak kadar içeri alınır
    s.ox = x; s.oy = y;
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
      // Merkezde açı kararsız: yok sayılır. Çıkınca fark o andan başlar (eskiden biriken fark tek seferde eklenip sıçrardı)
      if (dx * dx + dy * dy < w.r * w.r * WH.hole * WH.hole) { this.wheelHole = true; return; }
      const a = Math.atan2(dy, dx);
      if (this.wheelHole) { this.wheelHole = false; this.wheelPrev = a; return; }
      const d = wrap(a - this.wheelPrev); // ±180° sınırında doğru fark
      this.wheelPrev = a;
      if (Math.abs(d) > WHEEL_JUMP) return; // Tek olayda büyük atlama: parmak merkezden geçti ya da olay kaçtı
      this.wheelA = Math.max(-WHEEL_MAX, Math.min(WHEEL_MAX, this.wheelA + d));
    } else if (id === this.stickId) {
      const s = this.stick;
      s.dx = Math.max(-SK.r, Math.min(SK.r, x - s.ox));
      s.dy = Math.max(-SK.r, Math.min(SK.r, y - s.oy));
    }
  }

  up(id) {
    this.touches.delete(id);
    if (id === this.wheelId) { this.wheelId = null; this.wheelHole = false; }
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
    // Yazı alanında (kod kutusu) oyun tuşları çalışmaz
    const typing = (e) => e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName);
    win.addEventListener('keydown', (e) => { if (!typing(e) && !e.repeat && this.key(e.code, true)) e.preventDefault(); });
    win.addEventListener('keyup', (e) => { if (!typing(e)) this.key(e.code, false); });
    win.addEventListener('blur', () => this.clear());
    // Ekran döndü: direksiyonun merkezi değişir, tutuş bırakılır (yeniden basınca o andan başlar)
    win.addEventListener('orientationchange', () => this.resetPointers());
    win.addEventListener('pagehide', () => this.clear());
    if (win.document) win.document.addEventListener('visibilitychange', () => { if (win.document.hidden) this.clear(); });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}
