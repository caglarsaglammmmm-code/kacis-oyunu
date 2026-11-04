// Gizli geçit sahnesi (DOM): ekran kararır, kısa bir yeraltı garajı görünür (loş titreyen lambalar, borular, beton),
// spot ışığının altında hediye motosiklet ve karşılama yazısı. Süre CONFIG.secret.scene, oyunu game.js sürdürür.
import { CONFIG } from './config.js';
import { pixelCar } from './pixelcars.js';

const SCN = CONFIG.secret;

export class SecretScene {
  constructor(el, msg = null) {
    this.el = el;
    this.msg = msg; // Karşılama yazısı: sahneden ayrı, GIZLI_YAZI_SURESI saniye
    this.canvas = el ? el.querySelector('canvas') : null;
    this.raf = 0;
    this.t0 = 0;
    this.open = false;
  }

  play(title, gift, first) {
    if (!this.el) return;
    this.el.classList.toggle('first', !!first);
    this.showText(title, gift);
    this.el.hidden = false;
    this.el.style.setProperty('--scene', `${SCN.scene}s`);
    this.el.style.setProperty('--slide', `${SCN.slide}s`);
    this.el.classList.remove('run');
    void this.el.offsetWidth;
    this.el.classList.add('run');
    this.open = true;
    this.t0 = performance.now();
    const loop = (now) => {
      if (!this.open) return;
      this.raf = requestAnimationFrame(loop);
      this.draw((now - this.t0) / 1000);
    };
    cancelAnimationFrame(this.raf);
    this.raf = requestAnimationFrame(loop);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.hide(), (SCN.scene + 0.4) * 1000);
  }

  // Yazı oyuna dönüldükten sonra da ekranda kalır (5-10 sn), sonra yumuşakça kaybolur
  showText(title, gift) {
    const m = this.msg;
    if (!m) return;
    const t = Math.max(5, Math.min(10, SCN.GIZLI_YAZI_SURESI));
    m.querySelector('b').textContent = title;
    m.querySelector('small').textContent = gift;
    m.style.setProperty('--msg-t', `${t}s`);
    m.classList.remove('run');
    void m.offsetWidth;
    m.classList.add('run');
    clearTimeout(this.msgTimer);
    this.msgTimer = setTimeout(() => m.classList.remove('run'), (t + 0.2) * 1000);
  }

  hide() {
    if (!this.el) return;
    this.open = false;
    cancelAnimationFrame(this.raf);
    this.el.classList.remove('run');
    this.el.hidden = true;
  }

  draw(t) {
    const c = this.canvas;
    if (!c) return;
    const W = Math.min(960, window.innerWidth); const H = Math.min(720, window.innerHeight);
    if (c.width !== W || c.height !== H) { c.width = W; c.height = H; }
    const g = c.getContext('2d');
    const hz = H * 0.58; // Ufuk: zemin başlangıcı
    // Beton duvar
    const wall = g.createLinearGradient(0, 0, 0, hz);
    wall.addColorStop(0, '#15171b'); wall.addColorStop(1, '#2b2e33');
    g.fillStyle = wall; g.fillRect(0, 0, W, hz);
    g.strokeStyle = 'rgba(255,255,255,.04)'; g.lineWidth = 1;
    for (let y = 30; y < hz; y += 34) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
    for (let x = (t * 0) % 90; x < W; x += 90) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, hz); g.stroke(); }
    // Zemin: perspektif çizgileri, ıslak parlaklık
    const floor = g.createLinearGradient(0, hz, 0, H);
    floor.addColorStop(0, '#1d1f23'); floor.addColorStop(1, '#0b0c0e');
    g.fillStyle = floor; g.fillRect(0, hz, W, H - hz);
    g.strokeStyle = 'rgba(255,214,90,.18)'; g.lineWidth = 2;
    for (let k = -6; k <= 6; k++) { g.beginPath(); g.moveTo(W / 2 + k * 30, hz); g.lineTo(W / 2 + k * 190, H); g.stroke(); }
    // Kolonlar
    for (const u of [0.12, 0.88]) {
      const x = W * u;
      g.fillStyle = '#24272c'; g.fillRect(x - 26, 0, 52, hz + 30);
      g.fillStyle = 'rgba(255,214,90,.5)'; for (let y = hz - 40; y < hz + 30; y += 16) g.fillRect(x - 26, y, 52, 7);
    }
    // Tavanda borular
    for (const [y, r, col] of [[26, 9, '#5a5f66'], [48, 6, '#7a4a2e'], [64, 5, '#3f5a6b']]) {
      const pg = g.createLinearGradient(0, y - r, 0, y + r);
      pg.addColorStop(0, col); pg.addColorStop(0.4, '#c9ced4'); pg.addColorStop(1, '#1a1c20');
      g.fillStyle = pg; g.fillRect(0, y - r, W, r * 2);
      g.fillStyle = 'rgba(0,0,0,.5)'; for (let x = 60; x < W; x += 180) g.fillRect(x, y - r - 2, 8, r * 2 + 4);
    }
    // Titreyen loş lambalar ve ışık konileri
    for (const [i, u] of [0.3, 0.5, 0.7].entries()) {
      const x = W * u;
      const on = 0.55 + 0.45 * Math.abs(Math.sin(t * (7 + i * 3.1) + i)) * (Math.sin(t * 23 + i * 5) > -0.85 ? 1 : 0.2);
      g.fillStyle = '#e8e2c8'; g.fillRect(x - 14, 72, 28, 5);
      const cone = g.createLinearGradient(0, 77, 0, H);
      cone.addColorStop(0, `rgba(255,236,170,${0.32 * on})`); cone.addColorStop(1, 'rgba(255,236,170,0)');
      g.fillStyle = cone;
      g.beginPath(); g.moveTo(x - 12, 77); g.lineTo(x + 12, 77); g.lineTo(x + 150, H); g.lineTo(x - 150, H); g.closePath(); g.fill();
    }
    // Spot ışığı altında motosiklet: piksel görüntü büyütülür, jantlar döner
    const spot = g.createRadialGradient(W / 2, H * 0.8, 10, W / 2, H * 0.8, W * 0.36);
    spot.addColorStop(0, 'rgba(33,230,255,.35)'); spot.addColorStop(1, 'rgba(33,230,255,0)');
    g.fillStyle = spot; g.fillRect(0, hz, W, H - hz);
    const bike = pixelCar(CONFIG.secretCar, 0, { rim: 'turbin', led: 'mavi' });
    const bw = Math.min(W * 0.62, 520); const bh = (bw * bike.height) / bike.width;
    const appear = Math.min(1, Math.max(0, (t - SCN.slide) / 0.6));
    g.globalAlpha = appear;
    g.imageSmoothingEnabled = false;
    g.drawImage(bike, W / 2 - bw / 2, H * 0.86 - bh, bw, bh);
    g.globalAlpha = 1;
  }
}
