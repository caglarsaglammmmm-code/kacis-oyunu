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
// Her yaya kıyafet, ten, saç ve aksesuarla ayrışır. acc: 0 yok, 1 şapka, 2 başörtüsü, 3 sırt çantası, 4 omuz çantası, 5 uzun saç, 6 kel
export function paintPed(g, shirt, skin, hair, step, acc = 0) {
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
  if (acc === 2) { g.beginPath(); g.arc(0, 0, 2.7, 0, 7); g.fill(); g.fillStyle = shade(hair, 0.25); g.fillRect(-3, -0.6, 1.4, 1.2); }
  else if (acc === 5) { g.beginPath(); g.arc(-0.9, 0, 2.7, 1.2, 5.1); g.fill(); }
  else if (acc !== 6) { g.beginPath(); g.arc(-0.5, 0, 2.2, 1.57, 4.71); g.fill(); }
  if (acc === 1) { g.fillStyle = shade(shirt, -0.3); g.beginPath(); g.arc(0, 0, 2.4, 0, 7); g.fill(); g.fillRect(1.6, -1.6, 2.4, 3.2); }
  if (acc === 3) { g.fillStyle = '#39414d'; g.fillRect(-4.2, -2.2, 2.2, 4.4); }
  if (acc === 4) { g.fillStyle = '#7a4e2a'; g.fillRect(-1.5, 3.8, 3.4, 2.4); }
}

// Uçan daire: üstten yuvarlak gövde, cam kubbe, dönen ışıklar, içinde yeşil pilot
export function paintUfo(g, spec) {
  const R = spec.len / 2;
  const grd = g.createRadialGradient(-R * 0.3, -R * 0.3, 2, 0, 0, R);
  grd.addColorStop(0, '#d9e4ec'); grd.addColorStop(0.55, '#7f93a6'); grd.addColorStop(1, '#3b4757');
  g.fillStyle = grd; g.beginPath(); g.arc(0, 0, R, 0, 7); g.fill();
  g.strokeStyle = '#1c2530'; g.lineWidth = 1.4; g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.35)'; g.lineWidth = 1; g.beginPath(); g.arc(0, 0, R * 0.74, 0, 7); g.stroke();
  for (let i = 0; i < 10; i++) { const a = (i / 10) * 6.283; g.fillStyle = i % 2 ? '#39ff9c' : '#ffe14d'; g.beginPath(); g.arc(Math.cos(a) * R * 0.86, Math.sin(a) * R * 0.86, 3.2, 0, 7); g.fill(); }
  const dome = g.createRadialGradient(-5, -6, 1, 0, 0, R * 0.46);
  dome.addColorStop(0, '#d8fff0'); dome.addColorStop(1, '#2fb88a');
  g.fillStyle = dome; g.beginPath(); g.arc(0, 0, R * 0.46, 0, 7); g.fill();
  g.fillStyle = '#4de08a'; g.beginPath(); g.ellipse(0, 0, 8, 10, 0, 0, 7); g.fill();
  g.fillStyle = '#10151c'; g.beginPath(); g.ellipse(-3, -2.4, 2.1, 3.2, 0.4, 0, 7); g.ellipse(3, -2.4, 2.1, 3.2, -0.4, 0, 7); g.fill();
}

// Uzaylı aracı: yerden yüksek, parlak yeşil çizgili, sivri burunlu
export function paintRover(g, spec) {
  const L = spec.len / 2; const H = spec.wid / 2;
  g.fillStyle = 'rgba(57,255,156,.28)'; rr(g, -L - 4, -H - 4, spec.len + 8, spec.wid + 8, 12); g.fill();
  const c = g.createLinearGradient(0, -H, 0, H);
  c.addColorStop(0, '#5a3d9a'); c.addColorStop(0.5, '#2c1d58'); c.addColorStop(1, '#170e33');
  g.fillStyle = c;
  g.beginPath(); g.moveTo(L + 3, 0); g.quadraticCurveTo(L * 0.4, -H * 1.2, -L * 0.6, -H); g.lineTo(-L, -H * 0.5); g.lineTo(-L, H * 0.5); g.lineTo(-L * 0.6, H); g.quadraticCurveTo(L * 0.4, H * 1.2, L + 3, 0); g.closePath(); g.fill();
  g.strokeStyle = '#39ff9c'; g.lineWidth = 1.6; g.stroke();
  g.fillStyle = '#a0ffd8'; g.beginPath(); g.ellipse(L * 0.1, 0, L * 0.34, H * 0.46, 0, 0, 7); g.fill();
  g.fillStyle = '#39ff9c'; g.fillRect(-L * 0.8, -H * 0.72, L * 0.7, 1.6); g.fillRect(-L * 0.8, H * 0.72 - 1.6, L * 0.7, 1.6);
  g.fillStyle = '#ff2ad4'; g.beginPath(); g.arc(-L, -H * 0.4, 2.2, 0, 7); g.arc(-L, H * 0.4, 2.2, 0, 7); g.fill();
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
    case S.KOLEJ: {
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
// Tabela türü adından anlaşılır; her türün kendi fontu ve zemini vardır
const SIGN_STYLES = {
  corp: [['500 30px Oswald, sans-serif', 'corp'], ['800 30px Nunito, sans-serif', 'corp']],
  vivid: [['400 34px Anton, Impact, sans-serif', 'vivid'], ['400 32px Righteous, sans-serif', 'vivid']],
  led: [['400 34px "Tilt Neon", sans-serif', 'led'], ['400 32px Monoton, sans-serif', 'led']],
  wood: [['400 30px Pacifico, cursive', 'wood'], ['400 34px Lobster, cursive', 'wood']],
  lux: [['italic 400 30px Playfair, Georgia, serif', 'brass']],
  box: [['400 30px Bungee, sans-serif', 'box'], ['800 30px Nunito, sans-serif', 'box']],
};
export function signKind(text) {
  if (/bank|kredi|tasarruf|yatırım|hastane|ilkokul|kolej/i.test(text)) return 'corp';
  if (/teknoloji|oyun|piksel|bilgisayar|telefon/i.test(text)) return 'led';
  if (/market|bakkal|manav|gross|mağaza|ucuzlar|büfe|bayii|dünyası/i.test(text)) return 'vivid';
  if (/döner|kebap|pide|lahmacun|iskender|ciğer|börek|lokanta|kafe|çay|kahve|tost|tatlı|fırın|ocağı|köfte/i.test(text)) return 'wood';
  if (/otel|hotel|rezidans|residence|palas|sitesi/i.test(text)) return 'lux';
  return 'box';
}

export function signCanvas(text, color, seed = 0) {
  const list = SIGN_STYLES[signKind(text)];
  const v = seed % list.length;
  const key = text + color + v;
  let c = signCache.get(key);
  if (c) return c;
  if (signCache.size > 400) signCache.clear();
  const [font, kind] = list[v];
  const shown = kind === 'vivid' || font.includes('Bungee') ? text.toLocaleUpperCase('tr') : text;
  c = document.createElement('canvas');
  const g0 = c.getContext('2d');
  g0.font = font;
  const w = Math.ceil(g0.measureText(shown).width) + 34;
  c.width = w;
  c.height = 56;
  const g = c.getContext('2d');
  g.font = font;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  const cy = 29;
  if (kind === 'corp') {
    g.fillStyle = color; g.fillRect(1, 5, w - 2, 46);
    g.fillStyle = 'rgba(255,255,255,.9)'; g.fillRect(1, 5, w - 2, 3);
    g.fillStyle = '#fff'; g.fillText(shown, w / 2, cy + 1);
  } else if (kind === 'vivid') {
    g.fillStyle = color; rr(g, 2, 3, w - 4, 50, 9); g.fill();
    g.save(); g.globalAlpha = 0.16; g.fillStyle = '#fff';
    for (let px = -40; px < w; px += 26) { g.beginPath(); g.moveTo(px, 53); g.lineTo(px + 12, 53); g.lineTo(px + 44, 3); g.lineTo(px + 32, 3); g.fill(); }
    g.restore();
    g.lineWidth = 3; g.strokeStyle = '#ffd23f'; rr(g, 2, 3, w - 4, 50, 9); g.stroke();
    g.lineWidth = 6; g.lineJoin = 'round'; g.strokeStyle = '#1a1420'; g.strokeText(shown, w / 2, cy);
    g.fillStyle = '#ffe14d'; g.fillText(shown, w / 2, cy);
  } else if (kind === 'led') {
    g.fillStyle = '#07080e'; rr(g, 2, 4, w - 4, 48, 5); g.fill();
    g.fillStyle = 'rgba(255,255,255,.05)';
    for (let py = 7; py < 50; py += 4) for (let px = 5; px < w - 4; px += 4) g.fillRect(px, py, 1.6, 1.6);
    const glow = shade(color, 0.55);
    g.lineWidth = 2; g.strokeStyle = glow; rr(g, 3, 5, w - 6, 46, 5); g.stroke();
    g.shadowColor = glow; g.shadowBlur = 16;
    g.fillStyle = glow; g.fillText(shown, w / 2, cy); g.fillText(shown, w / 2, cy);
    g.shadowBlur = 0;
    g.fillStyle = 'rgba(255,255,255,.6)'; g.fillText(shown, w / 2, cy);
  } else if (kind === 'wood') {
    g.fillStyle = '#6f4522'; rr(g, 2, 3, w - 4, 50, 6); g.fill();
    for (let py = 3; py < 52; py += 12) {
      g.fillStyle = py % 2 ? '#7c4f28' : '#855730'; g.fillRect(4, py + 1, w - 8, 11);
      g.fillStyle = 'rgba(30,14,4,.35)'; g.fillRect(4, py, w - 8, 1.2);
    }
    g.fillStyle = '#2a1608';
    for (const [px, py] of [[9, 9], [w - 9, 9], [9, 47], [w - 9, 47]]) { g.beginPath(); g.arc(px, py, 2, 0, 7); g.fill(); }
    g.fillStyle = 'rgba(30,14,4,.8)'; g.fillText(shown, w / 2 + 1.5, cy + 1.5);
    g.fillStyle = '#ffeec8'; g.fillText(shown, w / 2, cy);
  } else if (kind === 'box') {
    g.fillStyle = '#20242c'; rr(g, 1, 3, w - 2, 50, 4); g.fill();
    g.fillStyle = '#fbfbf4'; rr(g, 4, 6, w - 8, 44, 2); g.fill();
    g.fillStyle = color; g.fillRect(4, 44, w - 8, 6);
    g.fillStyle = shade(color, -0.15); g.fillText(shown, w / 2, cy - 2);
  } else if (kind === 'panel') {
    g.fillStyle = color; rr(g, 2, 4, w - 4, 48, 7); g.fill();
    g.lineWidth = 3; g.strokeStyle = '#fff'; g.stroke();
    g.fillStyle = '#fff'; g.fillText(shown, w / 2, cy);
  } else if (kind === 'dark') {
    g.fillStyle = '#14161c'; g.fillRect(1, 6, w - 2, 44);
    g.fillStyle = color; g.fillRect(1, 44, w - 2, 6);
    g.fillStyle = '#f4f6f8'; g.fillText(shown, w / 2, cy - 2);
  } else if (kind === 'bare') {
    g.lineWidth = 7; g.lineJoin = 'round'; g.strokeStyle = 'rgba(10,12,20,.85)'; g.strokeText(shown, w / 2, cy);
    g.fillStyle = shade(color, 0.32); g.fillText(shown, w / 2, cy);
  } else if (kind === 'board') {
    g.fillStyle = '#f4ead2'; rr(g, 2, 4, w - 4, 48, 14); g.fill();
    g.lineWidth = 2.5; g.strokeStyle = color; g.stroke();
    g.fillStyle = color; g.fillText(shown, w / 2, cy - 1);
  } else if (kind === 'neon') {
    g.fillStyle = '#0d0a18'; rr(g, 2, 4, w - 4, 48, 6); g.fill();
    const glow = shade(color, 0.5);
    g.shadowColor = glow; g.shadowBlur = 14;
    g.fillStyle = glow; g.fillText(shown, w / 2, cy);
    g.fillText(shown, w / 2, cy);
    g.shadowBlur = 0;
    g.fillStyle = '#ffffff'; g.globalAlpha = 0.55; g.fillText(shown, w / 2, cy); g.globalAlpha = 1;
  } else if (kind === 'two') {
    g.fillStyle = color; g.fillRect(1, 4, w * 0.5, 48);
    g.fillStyle = '#fff4d8'; g.fillRect(w * 0.5, 4, w * 0.5 - 1, 48);
    g.fillStyle = '#16181c'; g.fillText(shown, w / 2 + 1.5, cy + 1.5);
    g.fillStyle = '#ffd23f'; g.fillText(shown, w / 2, cy);
  } else {
    const gr = g.createLinearGradient(0, 4, 0, 52);
    gr.addColorStop(0, '#e8c97a'); gr.addColorStop(1, '#a5792c');
    g.fillStyle = gr; rr(g, 2, 6, w - 4, 44, 2); g.fill();
    g.fillStyle = '#2b1d08'; g.fillText(shown, w / 2, cy);
  }
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

// --- Dükkân önü ---
export function paintDoner(g, f) {
  g.fillStyle = 'rgba(0,0,0,.3)'; g.fillRect(-7, 9, 14, 3);
  g.fillStyle = '#8b939c'; g.fillRect(-1, -12, 2, 23);
  g.fillStyle = '#4a4f55'; g.fillRect(-6, 8, 12, 3);
  // Koni et: bantlar kare kare kayar, dönüyormuş gibi görünür
  g.beginPath(); g.moveTo(-6.5, -9); g.lineTo(6.5, -9); g.lineTo(3.8, 7); g.lineTo(-3.8, 7); g.closePath();
  g.save(); g.clip();
  g.fillStyle = '#8c4f22'; g.fillRect(-8, -10, 16, 18);
  for (let i = 0; i < 6; i++) {
    const x = -9 + ((i * 3.6 + f * 0.9) % 18);
    g.fillStyle = i % 2 ? '#b8722f' : '#6f3a18';
    g.fillRect(x, -10, 1.8, 18);
  }
  g.fillStyle = 'rgba(255,190,110,.32)'; g.fillRect(-2, -10, 3, 18);
  g.restore();
  g.fillStyle = '#d6dbe1'; g.fillRect(-7, -11, 14, 2);
}

export function paintPromo(g, text, i) {
  const bg = ['#e8352e', '#ffd23f', '#16a34a', '#7b3fa0', '#ff6a13', '#0a84d6', '#e11d74', '#111827'][i % 8];
  const fg = i % 8 === 1 ? '#7a1408' : '#ffffff';
  g.fillStyle = 'rgba(0,0,0,.28)'; g.fillRect(-19, 10, 40, 3);
  g.fillStyle = '#3c4148'; g.fillRect(-17, 7, 2, 6); g.fillRect(15, 7, 2, 6);
  g.fillStyle = bg; rr(g, -21, -11, 42, 20, 2); g.fill();
  g.lineWidth = 1.2; g.strokeStyle = 'rgba(255,255,255,.85)'; g.setLineDash([3, 2]); rr(g, -19.5, -9.5, 39, 17, 1.5); g.stroke(); g.setLineDash([]);
  g.fillStyle = fg;
  g.font = '400 8px Anton, Impact, sans-serif';
  g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText(text, 0, -1, 37);
}

// Şişme hava dansçısı: gövde dalgalanır, kollar savrulur. Yerde üfleyici
export function paintDancer(g, col, f) {
  const ph = (f / 6) * Math.PI * 2;
  g.fillStyle = 'rgba(0,0,0,.28)'; g.beginPath(); g.ellipse(0, 33, 9, 3, 0, 0, 7); g.fill();
  g.fillStyle = '#2f343c'; g.fillRect(-6, 27, 12, 6);
  const pts = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    pts.push([Math.sin(ph + t * 4) * (1 + t * 7), 28 - t * 52]);
  }
  g.strokeStyle = col; g.lineWidth = 8.5; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); pts.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x, y)); g.stroke();
  g.strokeStyle = shade(col, 0.3); g.lineWidth = 2.5;
  g.beginPath(); pts.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x - 1.6, y)); g.stroke();
  const [sx, sy] = pts[6];
  g.strokeStyle = col; g.lineWidth = 4;
  for (const s of [-1, 1]) {
    const a = ph * (s > 0 ? 1 : -1) + s * 0.6;
    const ex = sx + s * (9 + 5 * Math.cos(a));
    const ey = sy - 7 + 9 * Math.sin(a);
    g.beginPath(); g.moveTo(sx, sy); g.quadraticCurveTo(sx + s * 8, sy - 5, ex, ey); g.lineTo(ex + s * 7 * Math.cos(a + ph), ey - 7); g.stroke();
  }
  const [hx, hy] = pts[8];
  g.fillStyle = shade(col, 0.15); g.beginPath(); g.arc(hx, hy - 4, 6.2, 0, 7); g.fill();
  g.fillStyle = '#fff'; for (const s of [-1, 1]) { g.beginPath(); g.arc(hx + s * 2.4, hy - 5, 1.9, 0, 7); g.fill(); }
  g.fillStyle = '#141414'; for (const s of [-1, 1]) { g.beginPath(); g.arc(hx + s * 2.4, hy - 5, 0.9, 0, 7); g.fill(); }
  g.strokeStyle = '#141414'; g.lineWidth = 1; g.beginPath(); g.arc(hx, hy - 3.4, 2.8, 0.3, 2.84); g.stroke();
  g.strokeStyle = '#111'; g.lineWidth = 1.2; for (let i = -2; i <= 2; i++) { g.beginPath(); g.moveTo(hx + i * 2, hy - 9.5); g.lineTo(hx + i * 2.6, hy - 13 - (i & 1)); g.stroke(); }
}

// --- Balkon hayatı: gövde, baş, eylem, önünde korkuluk ---
export function paintBalcony(g, act, f, shirt) {
  const skin = '#e0a878';
  g.fillStyle = 'rgba(30,40,55,.75)'; g.fillRect(-9, -11, 18, 21); // Balkon gölgesi
  g.fillStyle = shirt; g.beginPath(); g.roundRect(-3.5, -3, 7, 9, 2); g.fill();
  g.fillStyle = skin; g.beginPath(); g.arc(0, -6, 2.8, 0, 7); g.fill();
  g.fillStyle = '#3b2a1e'; g.beginPath(); g.arc(0, -7, 2.9, 3.14, 0); g.fill();
  g.strokeStyle = skin; g.lineWidth = 1.5; g.lineCap = 'round';
  if (act === 'tea') {
    const up = f ? -5 : -1;
    g.beginPath(); g.moveTo(3, -1); g.lineTo(5, up + 2); g.stroke();
    g.fillStyle = '#f4ead2'; g.fillRect(4.4, up - 1, 2.4, 3);
    g.fillStyle = '#b5482f'; g.fillRect(4.6, up - 1, 2, 1);
  } else if (act === 'wave') {
    g.beginPath(); g.moveTo(3, -2); g.lineTo(f ? 7 : 4, -8); g.stroke();
    g.beginPath(); g.arc(f ? 7 : 4, -9, 1.1, 0, 7); g.fillStyle = skin; g.fill();
  } else if (act === 'water') {
    g.beginPath(); g.moveTo(3, -1); g.lineTo(6, 0); g.stroke();
    g.fillStyle = '#3f8f5b'; g.fillRect(5, -1.5, 4, 3);
    g.fillStyle = '#9fd8ff'; for (let i = 0; i < 3; i++) g.fillRect(8.4, 1.5 + ((i * 2 + f * 2) % 6), 0.9, 1.3);
    g.fillStyle = '#b5482f'; g.fillRect(4.5, 5, 5, 2.4);
    g.fillStyle = '#e8533f'; g.beginPath(); g.arc(7, 4.4, 1.6, 0, 7); g.fill();
  } else {
    g.strokeStyle = '#dfe4ea'; g.lineWidth = 0.7; g.beginPath(); g.moveTo(-9, -9); g.lineTo(9, -9); g.stroke();
    g.strokeStyle = skin; g.lineWidth = 1.5; g.beginPath(); g.moveTo(3, -2); g.lineTo(5, f ? -9 : -7); g.stroke();
    g.fillStyle = '#f4f6f8'; g.fillRect(4, f ? -9 : -8.6, 4, 6);
  }
  g.fillStyle = 'rgba(245,247,250,.95)'; g.fillRect(-10, 4, 20, 1.3);
  g.fillStyle = 'rgba(245,247,250,.75)'; for (let x = -9.4; x < 10; x += 2.6) g.fillRect(x, 4, 0.7, 6);
  g.fillStyle = 'rgba(200,205,212,.95)'; g.fillRect(-10, 9.6, 20, 1);
}

export function paintWashing(g, f) {
  g.strokeStyle = '#dfe4ea'; g.lineWidth = 0.7;
  g.beginPath(); g.moveTo(-14, -6); g.quadraticCurveTo(0, -3.8, 14, -6); g.stroke();
  const cols = ['#f4f6f8', '#e8533f', '#3e7cb1', '#f2c14e', '#7a5ea8'];
  const sway = [-1.3, 0, 1.3][f];
  for (let i = 0; i < 4; i++) {
    const x = -12 + i * 6.2;
    g.fillStyle = cols[i];
    g.beginPath(); g.moveTo(x, -5); g.lineTo(x + 4.6, -5); g.lineTo(x + 4.6 + sway * (1 + i * 0.1), 4); g.lineTo(x + sway * (1 + i * 0.1), 4); g.closePath(); g.fill();
  }
}

export function paintMoon(g) {
  const gr = g.createRadialGradient(0, 0, 8, 0, 0, 22);
  gr.addColorStop(0, 'rgba(255,245,210,.5)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
  g.fillStyle = gr; g.fillRect(-22, -22, 44, 44);
  g.fillStyle = '#fff4d0'; g.beginPath(); g.arc(0, 0, 10, 0, 7); g.fill();
  g.globalCompositeOperation = 'destination-out';
  g.beginPath(); g.arc(4.5, -2.5, 8.6, 0, 7); g.fill();
  g.globalCompositeOperation = 'source-over';
}

export function paintStars(g, seed) {
  let s = seed;
  const r = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = 0; i < 34; i++) {
    g.fillStyle = r() < 0.2 ? '#ffe9b0' : '#ffffff';
    const q = 0.7 + r() * 1;
    g.fillRect(-160 + r() * 320, -45 + r() * r() * 90, q, q);
  }
}
