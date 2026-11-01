// Koddan üretilen çizimler: lüks araba, polis çeşitleri, sivil araçlar, yayalar, güçler, binalar.
// Tüm araçlar burun +x yönünde çizilir.
import { BUILD } from './config.js';
import { paintTr } from './cars.js';

export function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function shade(hex, k) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v) => Math.max(0, Math.min(255, Math.round(k < 0 ? v * (1 + k) : v + (255 - v) * k)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

function wheel(g, x, y, w, h) {
  g.fillStyle = '#0f0f13';
  rr(g, x - w / 2, y - h / 2, w, h, 1.6);
  g.fill();
  g.fillStyle = '#c9d2dc'; // Jant
  rr(g, x - w * 0.3, y - h * 0.26, w * 0.6, h * 0.52, 1);
  g.fill();
  g.fillStyle = '#6d7782';
  g.fillRect(x - 0.5, y - h * 0.26, 1, h * 0.52);
  g.fillRect(x - w * 0.18, y - h * 0.26, 1, h * 0.52);
  g.fillRect(x + w * 0.16, y - h * 0.26, 1, h * 0.52);
}

// Alçak, aerodinamik lüks spor araba
export function paintLux(g, len, wid, body, accent) {
  const L = len / 2;
  const H = wid / 2;
  for (const [x, y] of [[L * 0.56, -H], [L * 0.56, H], [-L * 0.56, -H - 0.4], [-L * 0.56, H + 0.4]]) wheel(g, x, y, 11, 5.4);

  // Gövde: burun sivri, beller içe kavisli, kalça geniş
  const outline = () => {
    g.beginPath();
    g.moveTo(L, -H * 0.42);
    g.quadraticCurveTo(L + 0.6, 0, L, H * 0.42);
    g.bezierCurveTo(L * 0.84, H * 0.92, L * 0.5, H * 1.02, L * 0.3, H * 0.94);
    g.bezierCurveTo(L * 0.05, H * 0.82, -L * 0.2, H * 0.84, -L * 0.42, H);
    g.bezierCurveTo(-L * 0.74, H * 1.08, -L * 0.98, H * 0.92, -L, H * 0.6);
    g.lineTo(-L, -H * 0.6);
    g.bezierCurveTo(-L * 0.98, -H * 0.92, -L * 0.74, -H * 1.08, -L * 0.42, -H);
    g.bezierCurveTo(-L * 0.2, -H * 0.84, L * 0.05, -H * 0.82, L * 0.3, -H * 0.94);
    g.bezierCurveTo(L * 0.5, -H * 1.02, L * 0.84, -H * 0.92, L, -H * 0.42);
    g.closePath();
  };
  const paint = g.createLinearGradient(0, -H, 0, H);
  paint.addColorStop(0, shade(body, 0.42));
  paint.addColorStop(0.3, body);
  paint.addColorStop(0.72, shade(body, -0.12));
  paint.addColorStop(1, shade(body, -0.5));
  outline();
  g.fillStyle = paint;
  g.fill();
  g.strokeStyle = 'rgba(0,0,0,.6)';
  g.lineWidth = 0.7;
  g.stroke();

  // Kaput hatları ve hava girişleri
  g.strokeStyle = 'rgba(0,0,0,.28)';
  g.lineWidth = 0.6;
  g.beginPath();
  g.moveTo(L * 0.92, -H * 0.42); g.quadraticCurveTo(L * 0.6, -H * 0.62, L * 0.36, -H * 0.58);
  g.moveTo(L * 0.92, H * 0.42); g.quadraticCurveTo(L * 0.6, H * 0.62, L * 0.36, H * 0.58);
  g.stroke();
  g.fillStyle = 'rgba(0,0,0,.5)';
  rr(g, L * 0.56, -H * 0.3, L * 0.16, H * 0.2, 0.6); g.fill();
  rr(g, L * 0.56, H * 0.1, L * 0.16, H * 0.2, 0.6); g.fill();
  // Yarış şeritleri
  g.fillStyle = accent;
  g.globalAlpha = 0.9;
  g.fillRect(-L * 0.96, -H * 0.2, L * 0.34, H * 0.12);
  g.fillRect(-L * 0.96, H * 0.08, L * 0.34, H * 0.12);
  g.fillRect(L * 0.34, -H * 0.2, L * 0.6, H * 0.12);
  g.fillRect(L * 0.34, H * 0.08, L * 0.6, H * 0.12);
  g.globalAlpha = 1;

  // Kabin: damla biçimli cam
  const glass = g.createLinearGradient(L * 0.34, 0, -L * 0.5, 0);
  glass.addColorStop(0, '#9fdcff');
  glass.addColorStop(0.28, '#27425c');
  glass.addColorStop(1, '#101c2a');
  g.fillStyle = glass;
  g.beginPath();
  g.moveTo(L * 0.36, -H * 0.62);
  g.quadraticCurveTo(L * 0.46, 0, L * 0.36, H * 0.62);
  g.lineTo(-L * 0.3, H * 0.66);
  g.quadraticCurveTo(-L * 0.62, H * 0.34, -L * 0.62, 0);
  g.quadraticCurveTo(-L * 0.62, -H * 0.34, -L * 0.3, -H * 0.66);
  g.closePath();
  g.fill();
  // Tavan ve yan cam ayrımı
  g.fillStyle = paint;
  rr(g, -L * 0.34, -H * 0.42, L * 0.46, H * 0.84, 3);
  g.fill();
  g.fillStyle = 'rgba(255,255,255,.34)'; // Parlak boya yansıması
  rr(g, -L * 0.28, -H * 0.34, L * 0.34, H * 0.18, 1.5);
  g.fill();
  g.fillRect(L * 0.4, -H * 0.66, L * 0.4, 0.9);
  // Aynalar
  g.fillStyle = shade(body, -0.25);
  g.fillRect(L * 0.24, -H - 1.6, 3.2, 2.4);
  g.fillRect(L * 0.24, H - 0.8, 3.2, 2.4);
  // Farlar (LED)
  g.fillStyle = '#eaf6ff';
  g.beginPath(); g.moveTo(L - 0.4, -H * 0.42); g.lineTo(L * 0.8, -H * 0.8); g.lineTo(L * 0.72, -H * 0.66); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(L - 0.4, H * 0.42); g.lineTo(L * 0.8, H * 0.8); g.lineTo(L * 0.72, H * 0.66); g.closePath(); g.fill();
  // Spoyler ve stop çizgisi
  g.fillStyle = 'rgba(10,10,14,.92)';
  rr(g, -L * 0.9, -H * 0.86, 2.4, H * 1.72, 1);
  g.fill();
  g.fillStyle = '#ff1f2d';
  g.fillRect(-L - 0.2, -H * 0.62, 1.6, H * 1.24);
  g.fillStyle = '#ffa0a0';
  g.fillRect(-L - 0.2, -H * 0.62, 1.6, 1.6);
  g.fillRect(-L - 0.2, H * 0.62 - 1.6, 1.6, 1.6);
  // Egzozlar
  g.fillStyle = '#b6bcc4';
  g.fillRect(-L - 1.2, -H * 0.3, 1.2, 1.8);
  g.fillRect(-L - 1.2, H * 0.3 - 1.8, 1.2, 1.8);
}

// Düz gövdeli araba (park etmiş, sivil, polis tabanı)
export function paintCar(g, len, wid, body, accent, style = 'plain') {
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
  if (style === 'sport') {
    g.fillStyle = accent;
    g.fillRect(-L + 2, -2.4, len - 4, 1.8);
    g.fillRect(-L + 2, 0.6, len - 4, 1.8);
  }
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
  g.fillStyle = '#fff7c2';
  g.fillRect(L - 2.5, -H + 2.5, 2.5, 4.5);
  g.fillRect(L - 2.5, H - 7, 2.5, 4.5);
  g.fillStyle = '#ff2b2b';
  g.fillRect(-L, -H + 2.5, 2, 4.5);
  g.fillRect(-L, H - 7, 2, 4.5);
}

function lightBar(g, x, H) {
  g.fillStyle = '#ff2a3c';
  rr(g, x, -H + 2, 5, H - 2, 1.5);
  g.fill();
  g.fillStyle = '#2a66ff';
  rr(g, x, 0, 5, H - 2, 1.5);
  g.fill();
}

export function paintPolice(g, spec, advanced) {
  const L = spec.len / 2;
  const H = spec.wid / 2;
  paintCar(g, spec.len, spec.wid, advanced ? '#20242f' : '#f5f7fb', '#fff');
  g.fillStyle = advanced ? '#4d7cff' : '#2356c7';
  g.fillRect(-L * 0.42, -H, L * 0.44, 3.5);
  g.fillRect(-L * 0.42, H - 3.5, L * 0.44, 3.5);
  g.fillRect(L * 0.62, -H + 2, L * 0.3, spec.wid - 4);
  lightBar(g, -L * 0.28, H);
}

// Hızlı polis: alçak spor gövde, koyu mavi
export function paintPoliceFast(g, spec) {
  paintLux(g, spec.len, spec.wid, '#123a8c', '#ffffff');
  const H = spec.wid / 2;
  lightBar(g, -spec.len * 0.12, H * 0.8);
}

export function paintMoto(g, spec) {
  const L = spec.len / 2;
  g.fillStyle = '#111';
  rr(g, L * 0.42, -1.8, 9, 3.6, 1.5); g.fill();
  rr(g, -L - 0.5, -2, 10, 4, 1.5); g.fill();
  g.fillStyle = '#f5f7fb';
  rr(g, -L * 0.6, -3.6, L * 1.3, 7.2, 3); g.fill();
  g.fillStyle = '#2356c7';
  g.fillRect(-L * 0.1, -3.6, L * 0.3, 7.2);
  g.strokeStyle = '#bfc6cf';
  g.lineWidth = 1.5;
  g.beginPath(); g.moveTo(L * 0.5, -5.6); g.lineTo(L * 0.5, 5.6); g.stroke();
  // Sürücü
  g.fillStyle = '#1b2436';
  g.beginPath(); g.ellipse(-1, 0, 5.2, 6, 0, 0, 7); g.fill();
  g.fillStyle = '#f2f4f8';
  g.beginPath(); g.arc(2, 0, 3.6, 0, 7); g.fill();
  g.fillStyle = '#22354f';
  g.fillRect(3.4, -2.2, 1.6, 4.4);
  g.fillStyle = '#ff2a3c'; g.fillRect(-L + 2, -3.6, 3, 3.4);
  g.fillStyle = '#2a66ff'; g.fillRect(-L + 2, 0.2, 3, 3.4);
}

export function paintSwat(g, spec) {
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
  g.fillRect(L - 2, -H, 3, spec.wid);
  g.fillStyle = '#ff2a3c';
  g.fillRect(4, -H + 3, 5, H - 3);
  g.fillStyle = '#2a66ff';
  g.fillRect(4, 0, 5, H - 3);
}

export function paintTankHull(g, spec) {
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

export function paintTurret(g) {
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

// --- Sivil araçlar ---
export function paintNpc(g, kind, spec, color, finish) {
  const L = spec.len / 2;
  const H = spec.wid / 2;
  if (spec.shape) {
    paintTr(g, spec.len, spec.wid, color, '#101216', spec.shape, finish);
    if (kind === 'taxi') {
      // Dama şerit ve tepe lambası
      for (let x = -L + 4; x < L - 6; x += 5) {
        g.fillStyle = Math.round(x / 5) % 2 ? '#111' : '#fff';
        g.fillRect(x, -H + 0.6, 2.5, 1.6);
        g.fillRect(x, H - 2.2, 2.5, 1.6);
      }
      g.fillStyle = '#1b1b1f';
      rr(g, -5, -6, 8, 12, 1); g.fill();
      g.fillStyle = '#ffe14d';
      g.font = 'bold 4px sans-serif';
      g.textAlign = 'center';
      g.textBaseline = 'middle';
      g.save(); g.rotate(1.57); g.fillText('TAKSİ', 0, 1); g.restore();
    }
  } else if (kind === 'minibus') {
    g.fillStyle = '#121216';
    for (const x of [L * 0.6, -L * 0.6]) { g.fillRect(x - 6, -H - 1, 12, 3); g.fillRect(x - 6, H - 2, 12, 3); }
    g.fillStyle = color;
    rr(g, -L, -H, spec.len, spec.wid, 6); g.fill();
    g.fillStyle = '#2878b5';
    g.fillRect(-L + 2, -H, spec.len - 12, 3);
    g.fillRect(-L + 2, H - 3, spec.len - 12, 3);
    g.fillStyle = '#24384c';
    rr(g, L - 13, -H + 3, 7, spec.wid - 6, 2); g.fill();
    g.fillStyle = 'rgba(0,0,0,.14)';
    rr(g, -L + 5, -H + 5, spec.len - 22, spec.wid - 10, 2); g.fill();
    g.fillStyle = '#ffffff';
    g.font = 'bold 6.5px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('DOLMUŞ', -6, 0.5);
    g.fillStyle = '#fff7c2';
    g.fillRect(L - 2, -H + 3, 2, 4); g.fillRect(L - 2, H - 7, 2, 4);
  } else if (kind === 'bus') {
    g.fillStyle = '#121216';
    for (const x of [L * 0.6, -L * 0.6]) { g.fillRect(x - 7, -H - 1, 14, 3); g.fillRect(x - 7, H - 2, 14, 3); }
    g.fillStyle = color;
    rr(g, -L, -H, spec.len, spec.wid, 5); g.fill();
    g.fillStyle = 'rgba(255,255,255,.24)';
    g.fillRect(-L + 4, -H + 3, spec.len - 12, 3);
    g.fillStyle = '#24384c';
    rr(g, L - 9, -H + 3, 6, spec.wid - 6, 2); g.fill();
    g.fillStyle = 'rgba(0,0,0,.2)';
    for (let x = -L + 10; x < L - 18; x += 20) { rr(g, x, -H + 6, 11, 3, 1); g.fill(); rr(g, x, H - 9, 11, 3, 1); g.fill(); }
    g.fillStyle = '#ffffff';
    g.font = 'bold 8px sans-serif';
    g.textAlign = 'center';
    g.textBaseline = 'middle';
    g.fillText('BELEDİYE', -6, 0.6);
    g.fillStyle = '#fff7c2';
    g.fillRect(L - 2, -H + 3, 2, 4); g.fillRect(L - 2, H - 7, 2, 4);
  } else {
    // Kamyon: kabin + römork
    g.fillStyle = '#121216';
    for (const x of [L * 0.74, L * 0.1, -L * 0.7]) { g.fillRect(x - 7, -H - 1, 14, 3); g.fillRect(x - 7, H - 2, 14, 3); }
    g.fillStyle = '#d7dbe1';
    rr(g, -L, -H, spec.len * 0.72, spec.wid, 3); g.fill();
    g.fillStyle = 'rgba(0,0,0,.08)';
    for (let x = -L + 8; x < -L + spec.len * 0.7; x += 9) g.fillRect(x, -H, 2, spec.wid);
    g.fillStyle = color;
    g.fillRect(-L + 6, -H + 5, spec.len * 0.58, 4);
    g.fillStyle = color;
    rr(g, L - spec.len * 0.24, -H + 1, spec.len * 0.24, spec.wid - 2, 5); g.fill();
    g.fillStyle = '#24384c';
    rr(g, L - 10, -H + 4, 6, spec.wid - 8, 2); g.fill();
    g.fillStyle = '#fff7c2';
    g.fillRect(L - 2, -H + 3, 2, 4); g.fillRect(L - 2, H - 7, 2, 4);
  }
}

// --- Yaya: üstten küçük insan. step: adım evresi ---
export function paintPed(g, shirt, skin, hair, step) {
  const s = step ? 1 : -1;
  g.fillStyle = '#2b3140';
  g.beginPath(); g.ellipse(2.6 * s, -1.9, 1.9, 1.2, 0, 0, 7); g.fill();
  g.beginPath(); g.ellipse(-2.6 * s, 1.9, 1.9, 1.2, 0, 0, 7); g.fill();
  g.fillStyle = shirt;
  g.beginPath(); g.ellipse(0, 0, 2.5, 4.3, 0, 0, 7); g.fill();
  g.fillStyle = skin;
  g.beginPath(); g.arc(-1.5 * s, -4.1, 1, 0, 7); g.fill();
  g.beginPath(); g.arc(1.5 * s, 4.1, 1, 0, 7); g.fill();
  g.beginPath(); g.arc(0, 0, 2.3, 0, 7); g.fill();
  g.fillStyle = hair;
  g.beginPath(); g.arc(-0.5, 0, 2.2, 1.57, 4.71); g.fill();
}

// --- Güç simgeleri ---
export const POWER_LOOK = {
  blast: { color: '#ff7a1a', name: 'Patlama' },
  ghost: { color: '#a07bff', name: 'Görünmezlik' },
  heal: { color: '#2fd872', name: 'Can' },
  giant: { color: '#ffd23f', name: 'Dev mod' },
};

export function paintPower(g, kind) {
  const col = POWER_LOOK[kind].color;
  g.fillStyle = 'rgba(0,0,0,.28)';
  g.beginPath(); g.arc(2, 3, 15, 0, 7); g.fill();
  g.fillStyle = col;
  g.beginPath(); g.arc(0, 0, 15, 0, 7); g.fill();
  g.strokeStyle = '#fff';
  g.lineWidth = 2.4;
  g.stroke();
  g.fillStyle = '#fff';
  g.strokeStyle = '#fff';
  if (kind === 'blast') {
    // Bomba
    g.fillStyle = '#1b1b22';
    g.beginPath(); g.arc(-1, 2, 7.6, 0, 7); g.fill();
    g.strokeStyle = '#1b1b22';
    g.lineWidth = 2.2;
    g.beginPath(); g.moveTo(3, -3); g.quadraticCurveTo(6, -9, 9, -7); g.stroke();
    g.fillStyle = '#fff36b';
    g.beginPath(); g.arc(9.4, -7.4, 2.5, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,.5)';
    g.beginPath(); g.arc(-3.5, -0.5, 2, 0, 7); g.fill();
  } else if (kind === 'ghost') {
    // Hayalet
    g.beginPath();
    g.moveTo(-8, 9);
    g.lineTo(-8, -1);
    g.arc(0, -1, 8, Math.PI, 0);
    g.lineTo(8, 9);
    g.lineTo(5, 6.4); g.lineTo(2.6, 9); g.lineTo(0, 6.4); g.lineTo(-2.6, 9); g.lineTo(-5, 6.4);
    g.closePath();
    g.fill();
    g.fillStyle = '#4a2fb0';
    g.beginPath(); g.arc(-3, -1.6, 1.9, 0, 7); g.arc(3, -1.6, 1.9, 0, 7); g.fill();
  } else if (kind === 'heal') {
    // Artı
    rr(g, -3.4, -9, 6.8, 18, 1.5); g.fill();
    rr(g, -9, -3.4, 18, 6.8, 1.5); g.fill();
  } else {
    // Dev mod: büyüyen ok
    g.fillStyle = '#5a3c00';
    g.beginPath();
    g.moveTo(0, -10); g.lineTo(8.6, -0.5); g.lineTo(3.6, -0.5); g.lineTo(3.6, 9.4);
    g.lineTo(-3.6, 9.4); g.lineTo(-3.6, -0.5); g.lineTo(-8.6, -0.5);
    g.closePath();
    g.fill();
  }
}

// --- Biyoma özel bina ve kuleler ---
export const TALL_STYLES = new Set([BUILD.TOWER_GLASS, BUILD.TOWER_ROUND, BUILD.TOWER_STEP, BUILD.LIGHTHOUSE, BUILD.FIRETOWER, BUILD.SILO, BUILD.WINDMILL, BUILD.WATERTOWER]);

function roofWindows(g, x, y, w, h, gap, color) {
  g.fillStyle = color;
  for (let py = y; py < y + h - 2; py += gap) {
    for (let px = x; px < x + w - 2; px += gap) g.fillRect(px, py, gap - 3, gap - 3);
  }
}

export function paintSpecial(g, r) {
  const { x, y, w, h, color, seed } = r;
  const cx = x + w / 2;
  const cy = y + h / 2;
  const d = Math.min(w, h) / 2;
  const S = BUILD;
  switch (r.style) {
    case S.TOWER_GLASS: {
      const gl = g.createLinearGradient(x, y, x + w, y + h);
      gl.addColorStop(0, shade(color, 0.45));
      gl.addColorStop(0.5, color);
      gl.addColorStop(1, shade(color, -0.4));
      g.fillStyle = shade(color, -0.55);
      rr(g, x, y, w, h, 3); g.fill();
      g.fillStyle = gl;
      rr(g, x, y, w, h - 14, 3); g.fill();
      g.strokeStyle = 'rgba(255,255,255,.3)';
      g.lineWidth = 1;
      for (let px = x + 10; px < x + w; px += 12) { g.beginPath(); g.moveTo(px, y + 2); g.lineTo(px, y + h - 16); g.stroke(); }
      for (let py = y + 10; py < y + h - 16; py += 12) { g.beginPath(); g.moveTo(x + 2, py); g.lineTo(x + w - 2, py); g.stroke(); }
      g.fillStyle = 'rgba(255,255,255,.2)';
      g.beginPath(); g.moveTo(x, y); g.lineTo(x + w * 0.6, y); g.lineTo(x, y + (h - 14) * 0.6); g.closePath(); g.fill();
      break;
    }
    case S.TOWER_ROUND: {
      g.fillStyle = shade(color, -0.5);
      g.beginPath(); g.arc(cx, cy + 7, d, 0, 7); g.fill();
      g.fillStyle = color;
      g.beginPath(); g.arc(cx, cy, d, 0, 7); g.fill();
      for (let i = 1; i <= 3; i++) {
        g.strokeStyle = `rgba(255,255,255,${0.32 - i * 0.05})`;
        g.lineWidth = 2;
        g.beginPath(); g.arc(cx, cy, (d * i) / 4, 0, 7); g.stroke();
      }
      g.fillStyle = '#e8f3ff';
      g.beginPath(); g.arc(cx, cy, d * 0.16, 0, 7); g.fill();
      break;
    }
    case S.TOWER_STEP: {
      // Kademeli gökdelen ve anten
      g.fillStyle = shade(color, -0.5);
      rr(g, x, y, w, h, 3); g.fill();
      const steps = 3;
      for (let i = 0; i < steps; i++) {
        const m = i * Math.min(w, h) * 0.13;
        g.fillStyle = shade(color, i * 0.14 - 0.08);
        rr(g, x + m, y + m, w - m * 2, h - 12 - m * 2, 3); g.fill();
        roofWindows(g, x + m + 3, y + m + 3, w - m * 2 - 6, 4, 6, 'rgba(210,235,255,.5)');
      }
      g.strokeStyle = '#f2f2f2';
      g.lineWidth = 2;
      g.beginPath(); g.moveTo(cx - 8, cy - 12); g.lineTo(cx + 8, cy + 4); g.moveTo(cx + 8, cy - 12); g.lineTo(cx - 8, cy + 4); g.stroke();
      g.fillStyle = '#ff3b3b';
      g.beginPath(); g.arc(cx, cy - 4, 3, 0, 7); g.fill();
      break;
    }
    case S.HUT: {
      // Çizgili plaj kulübesi
      g.fillStyle = '#b08a55';
      g.fillRect(x, y + h - 9, w, 9);
      for (let i = 0; i < w; i += 12) {
        g.fillStyle = i % 24 ? '#fff4dc' : color;
        g.fillRect(x + i, y, Math.min(12, w - i), h - 9);
      }
      g.fillStyle = 'rgba(0,0,0,.12)';
      g.fillRect(x, y + (h - 9) / 2, w, (h - 9) / 2);
      break;
    }
    case S.LIFEGUARD: {
      g.fillStyle = '#d9c29a';
      g.fillRect(x + 4, y + 4, w - 8, h - 8);
      g.fillStyle = '#e8352e';
      rr(g, x, y, w, h - 10, 4); g.fill();
      g.fillStyle = '#fff';
      g.fillRect(cx - 3, y + 6, 6, h - 22);
      g.fillRect(x + 8, cy - 8, w - 16, 6);
      break;
    }
    case S.LIGHTHOUSE: {
      g.fillStyle = '#c4c8cc';
      g.beginPath(); g.arc(cx, cy, d, 0, 7); g.fill();
      for (let i = 4; i > 0; i--) {
        g.fillStyle = i % 2 ? '#e8352e' : '#fff';
        g.beginPath(); g.arc(cx, cy, (d * 0.84 * i) / 4, 0, 7); g.fill();
      }
      g.fillStyle = '#ffe98a';
      g.beginPath(); g.arc(cx, cy, d * 0.18, 0, 7); g.fill();
      break;
    }
    case S.CABIN: {
      g.fillStyle = '#5a3a22';
      rr(g, x, y, w, h, 3); g.fill();
      g.fillStyle = '#7d5230';
      rr(g, x, y, w, h - 8, 3); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.25)';
      g.lineWidth = 2;
      for (let py = y + 7; py < y + h - 10; py += 8) { g.beginPath(); g.moveTo(x + 2, py); g.lineTo(x + w - 2, py); g.stroke(); }
      g.fillStyle = 'rgba(255,255,255,.18)';
      g.fillRect(x + 3, cy - 5, w - 6, 2.5);
      g.fillStyle = '#6b6f76';
      g.fillRect(x + w * 0.7, y + 8, 11, 11);
      break;
    }
    case S.FIRETOWER: {
      g.strokeStyle = '#6a4a2c';
      g.lineWidth = 3;
      g.strokeRect(x + 6, y + 6, w - 12, h - 12);
      g.beginPath(); g.moveTo(x + 6, y + 6); g.lineTo(x + w - 6, y + h - 6); g.moveTo(x + w - 6, y + 6); g.lineTo(x + 6, y + h - 6); g.stroke();
      g.fillStyle = '#8a6a3f';
      rr(g, cx - d * 0.58, cy - d * 0.58, d * 1.16, d * 1.16, 3); g.fill();
      g.fillStyle = '#b5352a';
      g.beginPath(); g.moveTo(cx, cy - d * 0.72); g.lineTo(cx + d * 0.72, cy); g.lineTo(cx, cy + d * 0.72); g.lineTo(cx - d * 0.72, cy); g.closePath(); g.fill();
      break;
    }
    case S.ADOBE: {
      g.fillStyle = shade(color, -0.3);
      rr(g, x, y, w, h, 8); g.fill();
      g.fillStyle = color;
      rr(g, x, y, w, h - 8, 8); g.fill();
      g.strokeStyle = 'rgba(120,70,30,.3)';
      g.lineWidth = 2;
      rr(g, x + 6, y + 6, w - 12, h - 20, 5); g.stroke();
      if (seed % 2) {
        g.fillStyle = shade(color, 0.3);
        g.beginPath(); g.arc(cx, cy - 4, d * 0.42, 0, 7); g.fill();
      }
      break;
    }
    case S.MESA: {
      // Kaya platosu: katmanlı
      g.fillStyle = '#8c4f2d';
      rr(g, x, y, w, h, 14); g.fill();
      g.fillStyle = '#b36a3c';
      rr(g, x + 3, y + 2, w - 6, h - 12, 13); g.fill();
      g.fillStyle = '#cf8a54';
      rr(g, x + 14, y + 10, w - 28, h - 30, 10); g.fill();
      g.fillStyle = '#e3a874';
      rr(g, x + 28, y + 20, Math.max(8, w - 56), Math.max(8, h - 52), 8); g.fill();
      break;
    }
    case S.BARN: {
      g.fillStyle = '#7a2018';
      rr(g, x, y, w, h, 3); g.fill();
      g.fillStyle = '#b5352a';
      rr(g, x, y, w, h - 9, 3); g.fill();
      g.fillStyle = 'rgba(0,0,0,.16)';
      g.fillRect(x, y, w, (h - 9) / 2);
      g.fillStyle = '#f3ead8';
      g.fillRect(x, y + (h - 9) / 2 - 2, w, 4);
      g.strokeStyle = '#f3ead8';
      g.lineWidth = 2.5;
      g.strokeRect(cx - 10, y + h - 9, 20, 8);
      break;
    }
    case S.SILO: {
      g.fillStyle = '#88909a';
      g.beginPath(); g.arc(cx, cy + 5, d, 0, 7); g.fill();
      g.fillStyle = '#c3cad2';
      g.beginPath(); g.arc(cx, cy, d, 0, 7); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.2)';
      g.lineWidth = 1.5;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * 6.283;
        g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * d, cy + Math.sin(a) * d); g.stroke();
      }
      g.fillStyle = '#eef2f6';
      g.beginPath(); g.arc(cx, cy, 5, 0, 7); g.fill();
      break;
    }
    case S.WINDMILL: {
      g.fillStyle = '#d9d2c2';
      g.beginPath(); g.arc(cx, cy, d * 0.62, 0, 7); g.fill();
      g.fillStyle = '#8b5a33';
      g.beginPath(); g.arc(cx, cy, d * 0.4, 0, 7); g.fill();
      g.strokeStyle = '#f7f1e3';
      g.lineWidth = 6;
      const a0 = (seed % 90) * 0.0174;
      for (let i = 0; i < 4; i++) {
        const a = a0 + (i * Math.PI) / 2;
        g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * d * 1.02, cy + Math.sin(a) * d * 1.02); g.stroke();
      }
      g.fillStyle = '#3f2a18';
      g.beginPath(); g.arc(cx, cy, 5, 0, 7); g.fill();
      break;
    }
    case S.WATERTOWER: {
      g.strokeStyle = '#6e4e33';
      g.lineWidth = 3;
      g.strokeRect(x + 7, y + 7, w - 14, h - 14);
      g.fillStyle = '#9cc6d8';
      g.beginPath(); g.arc(cx, cy, d * 0.74, 0, 7); g.fill();
      g.fillStyle = '#c8e3ee';
      g.beginPath(); g.arc(cx - 3, cy - 3, d * 0.44, 0, 7); g.fill();
      break;
    }
    case S.APARTMENT: {
      // Apartman: düz çatı, merdiven kulesi, balkonlu cephe
      const wall = 12;
      g.fillStyle = shade(color, -0.44);
      rr(g, x, y, w, h, 3); g.fill();
      g.fillStyle = 'rgba(205,235,255,.75)';
      for (let px = x + 6; px < x + w - 7; px += 12) g.fillRect(px, y + h - wall + 2, 7, 4);
      // Balkon çamaşırı
      const cols = ['#f4f6f8', '#e8533f', '#3e7cb1', '#f2c14e'];
      for (let px = x + 6; px < x + w - 8; px += 8) {
        if ((seed + px) % 3 === 0) { g.fillStyle = cols[(seed + px) % 4]; g.fillRect(px, y + h - wall + 6, 5, 5); }
      }
      g.fillStyle = shade(color, 0.42);
      rr(g, x, y, w, h - wall, 3); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.16)';
      g.lineWidth = 2;
      g.strokeRect(x + 3, y + 3, w - 6, h - wall - 6);
      g.fillStyle = shade(color, 0.15);
      g.fillRect(x + w * 0.62, y + 6, 15, 13);
      g.fillStyle = 'rgba(0,0,0,.2)';
      g.fillRect(x + w * 0.62, y + 16, 15, 3);
      break;
    }
    case S.MARKET: {
      // Gross market: geniş çatı, çizgili tente
      g.fillStyle = '#c9ced4';
      rr(g, x, y, w, h, 3); g.fill();
      g.fillStyle = '#dfe3e7';
      rr(g, x + 2, y + 2, w - 4, h - 24, 3); g.fill();
      g.strokeStyle = 'rgba(0,0,0,.08)';
      g.lineWidth = 2;
      for (let px = x + 12; px < x + w - 6; px += 16) { g.beginPath(); g.moveTo(px, y + 4); g.lineTo(px, y + h - 26); g.stroke(); }
      for (let i = 0; i * 12 < w; i++) {
        g.fillStyle = i % 2 ? '#ffffff' : color;
        g.fillRect(x + i * 12, y + h - 24, Math.min(12, w - i * 12), 7);
      }
      g.fillStyle = color;
      g.fillRect(x, y + h - 17, w, 17);
      break;
    }
    case S.SISTEM: {
      // Haritanın tek turuncu binası
      g.fillStyle = '#b84f00';
      rr(g, x, y, w, h, 5); g.fill();
      g.fillStyle = '#ff7a00';
      rr(g, x, y, w, h - 16, 5); g.fill();
      g.fillStyle = '#ffa24a';
      rr(g, x + 14, y + 14, w - 28, h - 44, 4); g.fill();
      g.fillStyle = '#ff7a00';
      rr(g, x + 34, y + 34, w - 68, h - 84, 3); g.fill();
      g.fillStyle = 'rgba(255,255,255,.75)';
      for (let px = x + 12; px < x + w - 14; px += 20) g.fillRect(px, y + h - 12, 12, 7);
      g.strokeStyle = '#fff';
      g.lineWidth = 3;
      g.beginPath(); g.moveTo(cx, y + 10); g.lineTo(cx, cy); g.stroke();
      g.fillStyle = '#e30a17';
      g.fillRect(cx, y + 10, 26, 16);
      g.fillStyle = '#fff';
      g.beginPath(); g.arc(cx + 10, y + 18, 5, 0, 7); g.fill();
      g.fillStyle = '#e30a17';
      g.beginPath(); g.arc(cx + 12, y + 18, 4, 0, 7); g.fill();
      break;
    }
    case S.BAZAAR: {
      // Üstü kapalı pazar: çizgili branda
      g.fillStyle = '#7b7f85';
      g.fillRect(x, y, w, h);
      for (let i = 0; i * 26 < w; i++) {
        g.fillStyle = i % 2 ? '#f6efe0' : color;
        g.fillRect(x + i * 26, y, Math.min(26, w - i * 26), h - 8);
      }
      g.fillStyle = 'rgba(0,0,0,.14)';
      g.fillRect(x, y + (h - 8) / 2, w, (h - 8) / 2);
      g.fillStyle = 'rgba(255,255,255,.35)';
      g.fillRect(x, y + (h - 8) / 2 - 1.5, w, 3);
      break;
    }
    default: {
      // Benzin istasyonu
      g.fillStyle = '#efefef';
      rr(g, x, y, w, h - 6, 3); g.fill();
      g.fillStyle = '#e8352e';
      g.fillRect(x, y, w, 8);
      g.fillRect(x, y + h - 14, w, 8);
      g.fillStyle = '#5c6066';
      for (let i = 0; i < 3; i++) g.fillRect(x + (w * (i + 0.5)) / 3 - 4, cy - 6, 8, 12);
    }
  }
}

// Çatı detayları: uydu çanakları ve termosifon
export function roofClutter(g, r) {
  const n = 1 + (r.seed % 3);
  const wall = 12;
  for (let i = 0; i < n; i++) {
    const px = r.x + 10 + ((r.seed * (i + 2) * 17) % Math.max(1, r.w - 22));
    const py = r.y + 9 + ((r.seed * (i + 4) * 23) % Math.max(1, r.h - wall - 24));
    g.fillStyle = 'rgba(0,0,0,.22)';
    g.beginPath(); g.ellipse(px + 2, py + 2, 5.5, 5, 0, 0, 7); g.fill();
    g.fillStyle = '#eceff2';
    g.beginPath(); g.ellipse(px, py, 5.5, 5, -0.6, 0, 7); g.fill();
    g.fillStyle = '#b8bfc7';
    g.beginPath(); g.ellipse(px, py, 3, 2.7, -0.6, 0, 7); g.fill();
    g.strokeStyle = '#6d7782';
    g.lineWidth = 1;
    g.beginPath(); g.moveTo(px, py); g.lineTo(px + 4, py - 4); g.stroke();
  }
  if (r.seed % 2 === 0 && r.w > 60) {
    const px = r.x + r.w - 26;
    g.fillStyle = '#1f3f77';
    g.fillRect(px, r.y + 8, 15, 9);
    g.fillStyle = '#d7dde2';
    g.fillRect(px, r.y + 6, 15, 3);
  }
}

// Tabelalar önbelleğe alınır: bina çizimi telefonda ucuz kalsın
const signCache = new Map();
export function signCanvas(text, color) {
  const key = text + color;
  let c = signCache.get(key);
  if (c) return c;
  c = document.createElement('canvas');
  const g0 = c.getContext('2d');
  g0.font = '800 30px Nunito, sans-serif';
  const w = Math.ceil(g0.measureText(text).width) + 30;
  c.width = w;
  c.height = 46;
  const g = c.getContext('2d');
  g.fillStyle = color;
  rr(g, 1, 1, w - 2, 44, 7);
  g.fill();
  g.lineWidth = 3;
  g.strokeStyle = '#fff';
  g.stroke();
  g.fillStyle = '#fff';
  g.font = '800 30px Nunito, sans-serif';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(text, w / 2, 24);
  signCache.set(key, c);
  return c;
}

export function paintLight(g, st) {
  g.fillStyle = 'rgba(0,0,0,.25)';
  rr(g, -4, -10, 10, 23, 2); g.fill();
  g.fillStyle = '#20232a';
  rr(g, -5, -12, 10, 23, 2); g.fill();
  g.fillStyle = st === 'r' ? '#ff3030' : '#4a1414';
  g.beginPath(); g.arc(0, -7.5, 3, 0, 7); g.fill();
  g.fillStyle = st === 'y' ? '#ffc21f' : '#4a3a12';
  g.beginPath(); g.arc(0, -0.5, 3, 0, 7); g.fill();
  g.fillStyle = st === 'g' ? '#2fe36a' : '#124a22';
  g.beginPath(); g.arc(0, 6.5, 3, 0, 7); g.fill();
}

export function paintSimit(g) {
  g.strokeStyle = '#b5742a';
  g.lineWidth = 4.2;
  g.beginPath(); g.arc(0, 0, 4.6, 0, 7); g.stroke();
  g.strokeStyle = '#e0ad62';
  g.lineWidth = 1.4;
  g.beginPath(); g.arc(-0.5, -0.5, 4.6, 0, 7); g.stroke();
}

// Sokak insanları: 34 birimlik çizim, baş +x yönüne bakar
export function paintPedKind(g, kind, step) {
  g.scale(1.1, 1.1);
  const person = (shirt, skin, hair) => paintPed(g, shirt, skin, hair, step);
  switch (kind) {
    case 'woman':
      person('#c45fbd', '#f0c8a0', '#c45fbd');
      g.fillStyle = '#d07ac9'; // Başörtüsü
      g.beginPath(); g.arc(0, 0, 2.8, 0, 7); g.fill();
      break;
    case 'child':
      g.save(); g.scale(0.72, 0.72);
      person('#ffb400', '#f0c8a0', '#3b2a1e');
      g.restore();
      g.fillStyle = '#2ec4b6';
      g.beginPath(); g.arc(-3, 0, 2.2, 0, 7); g.fill(); // Sırt çantası
      break;
    case 'elder':
      person('#6b5a4a', '#e0a878', '#e8e8e8');
      g.strokeStyle = '#7a4e2c'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(1, 4.2); g.lineTo(6.5, 5.5); g.stroke(); // Baston
      break;
    case 'simitci':
      person('#3e7cb1', '#e0a878', '#3b2a1e');
      g.fillStyle = '#c9a050';
      g.beginPath(); g.ellipse(0, 0, 6.4, 6.4, 0, 0, 7); g.fill(); // Başta tepsi
      g.strokeStyle = '#a8651f'; g.lineWidth = 1.5;
      for (const [x, y] of [[-3, -2], [2, -3], [3, 2], [-2, 3]]) { g.beginPath(); g.arc(x, y, 1.6, 0, 7); g.stroke(); }
      break;
    case 'stroller':
      person('#4f9d69', '#f0c8a0', '#6b4a2b');
      g.fillStyle = '#e8533f';
      rr(g, 6, -4, 10, 8, 3); g.fill(); // Bebek arabası
      g.fillStyle = '#f7b5a9';
      rr(g, 11, -4, 5, 8, 2.5); g.fill();
      g.fillStyle = '#222';
      for (const [x, y] of [[7, -5], [7, 4], [14, -5], [14, 4]]) { g.beginPath(); g.arc(x, y, 1.1, 0, 7); g.fill(); }
      break;
    case 'wheelchair':
      g.fillStyle = '#1e2228';
      g.fillRect(-3, -6.4, 7, 2); g.fillRect(-3, 4.4, 7, 2); // Büyük tekerler
      g.fillStyle = '#7a8796';
      rr(g, -4, -4.4, 8, 8.8, 1.5); g.fill();
      person('#5c6b7a', '#e0a878', '#dfe3e8');
      break;
    case 'bike':
      g.fillStyle = '#16181d';
      g.fillRect(-10, -0.8, 7, 1.6); g.fillRect(4, -0.8, 7, 1.6); // Tekerler
      g.fillStyle = '#2a9df4';
      g.fillRect(-5, -1, 10, 2);
      g.strokeStyle = '#c9d2dc'; g.lineWidth = 1;
      g.beginPath(); g.moveTo(5, -3.4); g.lineTo(5, 3.4); g.stroke();
      person('#f2c14e', '#e0a878', '#2b2b33');
      break;
    case 'courier':
      g.fillStyle = '#14161a';
      g.fillRect(-11, -1, 8, 2); g.fillRect(5, -1, 8, 2);
      g.fillStyle = '#d9281e';
      rr(g, -6, -3, 13, 6, 2); g.fill();
      g.fillStyle = '#ff7a1a';
      rr(g, -13, -5, 9, 10, 1.5); g.fill(); // Paket kutusu
      g.fillStyle = '#fff'; g.fillRect(-13, -1, 9, 1.5);
      g.fillStyle = '#20252f';
      g.beginPath(); g.arc(1, 0, 3.4, 0, 7); g.fill();
      g.fillStyle = '#ff7a1a';
      g.beginPath(); g.arc(1.6, 0, 2.3, 0, 7); g.fill();
      break;
    case 'cayci':
      person('#f4f6f8', '#e0a878', '#3b2a1e');
      g.strokeStyle = '#c0c6cc'; g.lineWidth = 1.2;
      g.beginPath(); g.arc(4.6, 0, 4.4, 0, 7); g.stroke(); // Askılı tepsi
      g.fillStyle = '#b5481f';
      for (const [x, y] of [[3.2, -1.6], [6, -1.6], [4.6, 1.6]]) { g.beginPath(); g.arc(x, y, 1.2, 0, 7); g.fill(); }
      break;
    case 'student':
      person('#2a4d8f', '#f0c8a0', '#2b2b33');
      g.fillStyle = '#e8533f'; rr(g, -5.6, -3, 3.4, 6, 1.2); g.fill();
      break;
    case 'tourist':
      person('#f7a8c4', '#f0d0b0', '#d9c48a');
      g.fillStyle = '#e8d9a8'; g.beginPath(); g.arc(0, 0, 3.4, 0, 7); g.fill(); // Hasır şapka
      g.fillStyle = '#1b1b1f'; g.fillRect(2.4, -2, 2.4, 1.8);
      break;
    case 'jogger':
      person('#21d4a8', '#d9a06a', '#16131a');
      g.fillStyle = '#ff2a6d'; g.fillRect(-0.6, -2.4, 1.2, 4.8); // Saç bandı
      break;
    case 'guard':
      person('#11131a', '#e0a878', '#11131a');
      g.fillStyle = '#e8c547'; g.fillRect(-1, 2.2, 2, 1.4);
      break;
    case 'teyze':
      person('#7a4a6a', '#e0a878', '#7a4a6a');
      g.fillStyle = '#c7a24a'; g.beginPath(); g.arc(0, 0, 2.8, 0, 7); g.fill(); // Çiçekli başörtü
      g.fillStyle = '#6b4a2b'; rr(g, 1, 4, 4, 3, 1); g.fill(); // Pazar çantası
      break;
    case 'hawker':
      person('#b5482f', '#d9a06a', '#3b2a1e');
      g.fillStyle = '#e8d9a8'; rr(g, 3, -5, 7, 10, 1); g.fill();
      g.fillStyle = '#ff9d1a'; g.beginPath(); g.arc(6, -2, 1.3, 0, 7); g.arc(6, 2, 1.3, 0, 7); g.fill();
      break;
    case 'esnaf':
      person('#ececec', '#e0a878', '#16131a');
      g.fillStyle = '#7a4e2c';
      g.fillRect(-1.2, -3, 2.4, 6); // Önlük
      break;
    default: {
      // Sokak kedisi
      g.fillStyle = '#e8903a';
      g.beginPath(); g.ellipse(-1, 0, 4.8, 2.6, 0, 0, 7); g.fill();
      g.strokeStyle = '#e8903a'; g.lineWidth = 1.6;
      g.beginPath(); g.moveTo(-5, 0); g.quadraticCurveTo(-8, step ? 3 : -3, -10, step ? 1 : -1); g.stroke();
      g.beginPath(); g.arc(4, 0, 2.6, 0, 7); g.fill();
      g.fillStyle = '#e8903a';
      g.beginPath(); g.moveTo(3.6, -2); g.lineTo(6, -3.2); g.lineTo(5.6, -0.8); g.fill();
      g.beginPath(); g.moveTo(3.6, 2); g.lineTo(6, 3.2); g.lineTo(5.6, 0.8); g.fill();
      g.fillStyle = '#fff';
      g.fillRect(-3, -0.8, 3, 1.6);
    }
  }
}
