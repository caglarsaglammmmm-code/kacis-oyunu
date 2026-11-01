// Tek parmak kontrol: sağ yarı = sağa drift, sol yarı = sola drift, ikisi birden = geri.
// Klavye: sol/sağ ok veya A/D, ikisi birden = geri.

export class Input {
  constructor() {
    this.touches = new Map(); // pointerId -> 'L' | 'R'
    this.keyL = false;
    this.keyR = false;
    this.width = 1;
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
    return this.left && this.right;
  }

  get steer() {
    const l = this.left;
    const r = this.right;
    if (l === r) return 0;
    return r ? 1 : -1;
  }

  press(id, side) {
    this.touches.set(id, side);
  }

  release(id) {
    this.touches.delete(id);
  }

  clear() {
    this.touches.clear();
    this.keyL = false;
    this.keyR = false;
  }

  sideOf(x) {
    return x < this.width / 2 ? 'L' : 'R';
  }

  key(code, down) {
    if (code === 'ArrowLeft' || code === 'KeyA') { this.keyL = down; return true; }
    if (code === 'ArrowRight' || code === 'KeyD') { this.keyR = down; return true; }
    return false;
  }

  // Dokunma yüzeyine bağlanır. Parmak yarı değiştirirse yön de değişir.
  attach(el, win = window) {
    el.addEventListener('pointerdown', (e) => {
      if (e.button > 0) return;
      e.preventDefault();
      try { el.setPointerCapture(e.pointerId); } catch { /* bazı tarayıcılar reddeder */ }
      this.press(e.pointerId, this.sideOf(e.clientX));
    });
    el.addEventListener('pointermove', (e) => {
      if (this.touches.has(e.pointerId)) this.touches.set(e.pointerId, this.sideOf(e.clientX));
    });
    const end = (e) => this.release(e.pointerId);
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('lostpointercapture', end);
    win.addEventListener('keydown', (e) => { if (!e.repeat && this.key(e.code, true)) e.preventDefault(); });
    win.addEventListener('keyup', (e) => { this.key(e.code, false); });
    win.addEventListener('blur', () => this.clear());
    el.addEventListener('contextmenu', (e) => e.preventDefault());
  }
}
