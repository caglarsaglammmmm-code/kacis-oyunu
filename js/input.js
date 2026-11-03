// Üç dokunmatik kontrol tek yerde. Klavye her modda aynı çalışır.
// zones: sağ yarı = sağa, sol yarı = sola, ikisi birden = geri (eski sistem, aynen).
// wheel: sağ altta direksiyon, parmağın merkeze göre açısını izler.
// stick: sol yarıda basılan yerde beliren görünmez joystick.
// DOM'a dokunmaz: görünüm controls.js'tedir, burası birim testle sınanır.
import { CONFIG } from './config.js';
import { CheatCode } from './cheat.js';

export const CONTROLS = ['zones', 'wheel', 'stick'];
export const WHEEL_MAX = (130 * Math.PI) / 180; // Tam kilit açısı
const WHEEL_RETURN = 11; // Bırakınca ortaya dönüş hızı
const WHEEL_HOLE = 0.16; // Merkeze bu orandan yakın parmakta açı kararsızdır
const WHEEL_DEAD = 0.03;
const STICK_R = 54; // Joystick yarıçapı, px
const STICK_DEAD = 8; // Bu kadar kayma titreme sayılır, px
const STICK_SMOOTH = 24;
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
    this.wheelA = 0; // Direksiyon açısı, radyan
    this.wheelPrev = 0;
    this.stickId = null;
    this.stick = { on: false, x: 0, y: 0, dx: 0, dy: 0 };
    this.axis = 0; // Yumuşatılmış analog direksiyon
    this.revHeld = false;
    this.bounds = { l: 0, t: 0, r: 1, b: 1 }; // Joystick halkası bunun dışına taşmaz
    this.code = new CheatCode();
    this.onCode = null;
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
      if (this.wheelId === null) this.wheelA *= Math.exp(-WHEEL_RETURN * dt);
      if (Math.abs(this.wheelA) < 0.004) this.wheelA = this.wheelId === null ? 0 : this.wheelA;
      const v = this.wheelA / WHEEL_MAX;
      this.axis = Math.abs(v) < WHEEL_DEAD ? 0 : v;
    } else if (this.mode === 'stick') {
      const s = this.stick;
      const m = Math.abs(s.dx);
      const target = !s.on || m <= STICK_DEAD ? 0 : Math.sign(s.dx) * Math.min(1, (m - STICK_DEAD) / (STICK_R - STICK_DEAD));
      this.axis += (target - this.axis) * (1 - Math.exp(-STICK_SMOOTH * dt));
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
    this.wheelId = null;
    this.wheelA = 0;
    this.stickId = null;
    this.stick.on = false;
    this.stick.dx = 0;
    this.stick.dy = 0;
    this.axis = 0;
    this.revHeld = false;
    this.code.reset();
    this.heldT = 0;
    this.axisReady = true;
  }

  sideOf(x) {
    return x < this.width / 2 ? 'L' : 'R';
  }

  key(code, down) {
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
      if (!w.r || dx * dx + dy * dy > w.r * w.r * 1.2) return false; // Dışarıdaki dokunuş direksiyonu etkilemez
      this.wheelId = id;
      this.wheelPrev = Math.atan2(dy, dx);
      return true;
    }
    if (this.stickId !== null || x >= this.width / 2) return false;
    const b = this.bounds;
    const room = STICK_R + 8;
    const s = this.stick;
    this.stickId = id;
    s.on = true;
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
      if (dx * dx + dy * dy < w.r * w.r * WHEEL_HOLE * WHEEL_HOLE) return;
      const a = Math.atan2(dy, dx);
      this.wheelA = Math.max(-WHEEL_MAX, Math.min(WHEEL_MAX, this.wheelA + wrap(a - this.wheelPrev)));
      this.wheelPrev = a;
    } else if (id === this.stickId) {
      const s = this.stick;
      s.dx = Math.max(-STICK_R, Math.min(STICK_R, x - s.x));
      s.dy = Math.max(-STICK_R, Math.min(STICK_R, y - s.y));
    }
  }

  up(id) {
    this.touches.delete(id);
    if (id === this.wheelId) this.wheelId = null;
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
    win.addEventListener('keydown', (e) => { if (!e.repeat && this.key(e.code, true)) e.preventDefault(); });
    win.addEventListener('keyup', (e) => { this.key(e.code, false); });
    win.addEventListener('blur', () => this.clear());
    win.addEventListener('pagehide', () => this.clear());
    if (win.document) win.document.addEventListener('visibilitychange', () => { if (win.document.hidden) this.clear(); });
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}
