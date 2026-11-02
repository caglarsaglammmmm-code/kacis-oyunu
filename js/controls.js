// Dokunmatik kontrollerin görünümü. Yalnız dönüşüm yazar, değer değişmedikçe DOM'a dokunmaz.
const $c = (id) => document.getElementById(id);

export class ControlView {
  constructor(input) {
    this.input = input;
    this.wheel = $c('ctl-wheel');
    this.rim = $c('ctl-rim');
    this.stick = $c('ctl-stick');
    this.knob = $c('ctl-knob');
    this.rev = $c('ctl-rev');
    this.hud = $c('hud');
    this.needLayout = true;
    this.lastA = null;
    this.lastK = '';
    this.lastOn = null;
    const set = (on, e) => {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      input.revHeld = on;
      this.rev.classList.toggle('down', on);
    };
    this.rev.style.touchAction = 'none';
    this.rev.addEventListener('pointerdown', (e) => {
      try { this.rev.setPointerCapture(e.pointerId); } catch { /* reddedebilir */ }
      set(true, e);
    });
    for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) this.rev.addEventListener(ev, () => set(false));
  }

  // Mod değişince eskisi tamamen kapanır
  setMode(mode) {
    this.wheel.hidden = mode !== 'wheel';
    this.stick.hidden = mode !== 'stick';
    this.rev.hidden = mode === 'zones';
    this.rev.dataset.side = mode === 'wheel' ? 'left' : 'right';
    this.rev.classList.remove('down');
    this.stick.classList.remove('on');
    this.lastOn = null;
    this.lastA = null;
    this.needLayout = true;
  }

  // Güvenli alan ve boyut CSS'te; gerçek yer buradan okunur
  layout() {
    const inp = this.input;
    const vw = window.innerWidth; const vh = window.innerHeight;
    inp.width = vw;
    const pad = this.hud.getBoundingClientRect();
    inp.bounds = { l: 0, t: 0, r: vw, b: vh };
    if (pad.width) {
      const cs = getComputedStyle(this.hud);
      inp.bounds = { l: parseFloat(cs.getPropertyValue('--ctl-l')) || 0, t: 0, r: vw - (parseFloat(cs.getPropertyValue('--ctl-r')) || 0), b: vh - (parseFloat(cs.getPropertyValue('--ctl-b')) || 0) };
    }
    if (!this.wheel.hidden) {
      const r = this.wheel.getBoundingClientRect();
      inp.wheel.cx = r.left + r.width / 2;
      inp.wheel.cy = r.top + r.height / 2;
      inp.wheel.r = r.width / 2;
    }
    this.needLayout = false;
  }

  // Her kare çağrılır
  update() {
    if (this.hud.hidden) { this.needLayout = true; return; }
    if (this.needLayout) this.layout();
    const inp = this.input;
    if (inp.mode === 'wheel') {
      const a = Math.round(inp.wheelA * 200) / 200;
      if (a !== this.lastA) {
        this.lastA = a;
        this.rim.style.transform = `rotate(${a}rad)`;
      }
    } else if (inp.mode === 'stick') {
      const s = inp.stick;
      if (s.on !== this.lastOn) {
        this.lastOn = s.on;
        this.stick.classList.toggle('on', s.on);
      }
      if (s.on) {
        const k = `${s.x},${s.y},${Math.round(s.dx)},${Math.round(s.dy * 0.4)}`;
        if (k !== this.lastK) {
          this.lastK = k;
          this.stick.style.transform = `translate(${s.x}px,${s.y}px)`;
          this.knob.style.transform = `translate(${Math.round(s.dx)}px,${Math.round(s.dy * 0.4)}px)`;
        }
      }
    }
  }
}
