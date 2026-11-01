// BAŞLA geçişi: hız çizgileriyle yakınlaşma, beyaz parlama, sonra oyuna dairesel açılış. Tek tuval, DOM yükü yok.
const RUSH = 720; // Çizgilerin hızlandığı süre (ms)
const IRIS = 520; // Dairesel açılış süresi (ms)

export function warp(canvas, midpoint, done) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = Math.min(1.5, window.devicePixelRatio || 1);
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.hidden = false;
  const g = canvas.getContext('2d');
  g.scale(dpr, dpr);
  const R = Math.hypot(w, h) * 0.56;
  const cx = w / 2;
  const cy = h * 0.46;
  const lines = [];
  for (let i = 0; i < 90; i++) {
    lines.push({ a: Math.random() * 6.283, r: 0.1 + Math.random() * 0.9, sp: 0.6 + Math.random() * 1.2, w: 0.8 + Math.random() * 2.6, hot: Math.random() < 0.3 });
  }
  const t0 = performance.now();
  let swapped = false;
  const step = (now) => {
    const t = now - t0;
    g.clearRect(0, 0, w, h);
    if (t < RUSH) {
      const k = t / RUSH;
      const e = k * k;
      g.fillStyle = `rgba(4,6,16,${e * 0.82})`;
      g.fillRect(0, 0, w, h);
      g.lineCap = 'round';
      for (const l of lines) {
        const head = ((l.r + e * l.sp * 2.4) % 1) * R * (0.5 + e);
        const len = 30 + e * R * 0.62 * l.sp;
        const ca = Math.cos(l.a); const sa = Math.sin(l.a);
        g.strokeStyle = l.hot ? 'rgba(125,255,207,.9)' : 'rgba(255,255,255,.85)';
        g.globalAlpha = Math.min(1, k * 2.2);
        g.lineWidth = l.w * (1 + e * 2);
        g.beginPath();
        g.moveTo(cx + ca * head, cy + sa * head);
        g.lineTo(cx + ca * (head + len), cy + sa * (head + len));
        g.stroke();
      }
      g.globalAlpha = 1;
      if (k > 0.7) {
        g.fillStyle = `rgba(255,255,255,${(k - 0.7) / 0.3})`;
        g.fillRect(0, 0, w, h);
      }
      requestAnimationFrame(step);
      return;
    }
    if (!swapped) {
      swapped = true;
      midpoint();
    }
    const k = Math.min(1, (t - RUSH) / IRIS);
    const e = 1 - (1 - k) * (1 - k) * (1 - k);
    g.fillStyle = '#04060f';
    g.fillRect(0, 0, w, h);
    g.globalCompositeOperation = 'destination-out';
    g.beginPath();
    g.arc(cx, h / 2, e * R * 1.05, 0, 6.283);
    g.fill();
    g.globalCompositeOperation = 'source-over';
    // Açılan dairenin neon kenarı
    g.strokeStyle = `rgba(125,255,207,${1 - k})`;
    g.lineWidth = 6;
    g.beginPath();
    g.arc(cx, h / 2, e * R * 1.05, 0, 6.283);
    g.stroke();
    if (k < 1) { requestAnimationFrame(step); return; }
    canvas.hidden = true;
    if (done) done();
  };
  requestAnimationFrame(step);
}
