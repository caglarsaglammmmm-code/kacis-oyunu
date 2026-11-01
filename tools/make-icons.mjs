// Simgeleri koddan üretir (Edge ile çizip PNG alır): npm run icons
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

const EXE = process.env.BROWSER || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const browser = await puppeteer.launch({ executablePath: EXE, headless: 'new' });
const page = await browser.newPage();

async function icon(size, safe, file, round = false, transparent = false) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const data = await page.evaluate((S, safeK, round2, clear) => {
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const g = c.getContext('2d');
    if (round2) { g.beginPath(); g.arc(S / 2, S / 2, S / 2, 0, 7); g.clip(); }
    if (!clear) {
      const bg = g.createLinearGradient(0, 0, S, S);
      bg.addColorStop(0, '#2356c7'); bg.addColorStop(0.5, '#141a33'); bg.addColorStop(1, '#d42a33');
      g.fillStyle = bg;
      g.fillRect(0, 0, S, S);
    }
    g.translate(S / 2, S / 2);
    const k = (S / 200) * safeK;
    g.scale(k, k);
    // Lastik izleri
    g.strokeStyle = 'rgba(255,255,255,.35)';
    g.lineWidth = 7;
    g.lineCap = 'round';
    for (const o of [-13, 13]) { g.beginPath(); g.moveTo(-80 + o, 92); g.quadraticCurveTo(-52 + o, 38, -8 + o, 26); g.stroke(); }
    // Araba
    g.rotate(-0.72);
    g.fillStyle = '#16161c';
    for (const [x, y] of [[34, -42], [34, 30], [-44, -42], [-44, 30]]) g.fillRect(x, y, 24, 12);
    const body = g.createLinearGradient(0, -36, 0, 36);
    body.addColorStop(0, '#ff7a6b'); body.addColorStop(0.5, '#ff3d3d'); body.addColorStop(1, '#b31a22');
    g.fillStyle = body;
    g.beginPath(); g.roundRect(-70, -36, 140, 72, 20); g.fill();
    g.fillStyle = '#ffe14d'; g.fillRect(-66, -7, 132, 5); g.fillRect(-66, 3, 132, 5);
    g.fillStyle = '#20303f';
    g.beginPath(); g.roundRect(4, -26, 34, 52, 8); g.fill();
    g.beginPath(); g.roundRect(-52, -24, 20, 48, 8); g.fill();
    g.fillStyle = '#fff7c2'; g.fillRect(63, -28, 7, 14); g.fillRect(63, 14, 7, 14);
    return c.toDataURL('image/png').split(',')[1];
  }, size, safe, round, transparent);
  fs.writeFileSync(file, Buffer.from(data, 'base64'));
}

await icon(192, 0.9, 'icons/icon-192.png');
await icon(512, 0.9, 'icons/icon-512.png');
await icon(512, 0.62, 'icons/icon-maskable-512.png');
const res = 'android/app/src/main/res';
if (fs.existsSync(res)) {
  const sizes = { mdpi: 48, hdpi: 72, xhdpi: 96, xxhdpi: 144, xxxhdpi: 192 };
  for (const [name, s] of Object.entries(sizes)) {
    await icon(s, 0.9, `${res}/mipmap-${name}/ic_launcher.png`);
    await icon(s, 0.85, `${res}/mipmap-${name}/ic_launcher_round.png`, true);
    await icon(Math.round(s * 2.25), 0.55, `${res}/mipmap-${name}/ic_launcher_foreground.png`, false, true);
  }
}
await browser.close();
