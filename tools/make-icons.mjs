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
      bg.addColorStop(0, '#102a43'); bg.addColorStop(0.55, '#0d1b2a'); bg.addColorStop(1, '#0b6e5f');
      g.fillStyle = bg;
      g.fillRect(0, 0, S, S);
    }
    g.translate(S / 2, S / 2);
    const k = (S / 200) * safeK;
    g.scale(k, k);
    // Drift izi: şişenin altından kıvrılan çift kesik çizgi
    g.strokeStyle = '#ffd23f';
    g.lineCap = 'round';
    g.lineWidth = 7;
    g.setLineDash([15, 11]);
    for (const o of [0, 19]) { g.beginPath(); g.moveTo(-96 + o, 92); g.bezierCurveTo(-52 + o, 90, -42 + o, 52, -30 + o, 20); g.stroke(); }
    g.setLineDash([]);
    // Deney şişesi
    g.lineJoin = 'round';
    const flask = () => { g.beginPath(); g.moveTo(-18, -78); g.lineTo(-18, -22); g.lineTo(-68, 66); g.quadraticCurveTo(-74, 84, -54, 84); g.lineTo(62, 84); g.quadraticCurveTo(82, 84, 76, 66); g.lineTo(26, -22); g.lineTo(26, -78); };
    g.save(); flask(); g.closePath(); g.clip();
    const liq = g.createLinearGradient(0, 8, 0, 84);
    liq.addColorStop(0, '#7dffcf'); liq.addColorStop(1, '#10b981');
    g.fillStyle = 'rgba(255,255,255,.08)'; g.fillRect(-90, -90, 180, 180);
    g.fillStyle = liq; g.fillRect(-90, 14, 180, 80);
    g.fillStyle = '#eafcff';
    for (const [x, y, r] of [[-22, 56, 8], [16, 44, 6], [38, 66, 5]]) { g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); }
    g.restore();
    g.strokeStyle = '#ffffff'; g.lineWidth = 9;
    flask(); g.stroke();
    g.beginPath(); g.moveTo(-30, -80); g.lineTo(38, -80); g.stroke();
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
// Açılış görselleri: mevcut boyutlarda koyu zemin, ortada simge ve ad
async function splash(file) {
  const b = fs.readFileSync(file);
  const W = b.readUInt32BE(16); const H = b.readUInt32BE(20);
  const data = await page.evaluate((w, h) => {
    const c = document.createElement('canvas');
    c.width = w; c.height = h;
    const g = c.getContext('2d');
    g.fillStyle = '#07070b'; g.fillRect(0, 0, w, h);
    const u = Math.min(w, h) / 10;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `900 ${u * 1.5}px Arial, sans-serif`;
    g.fillStyle = '#ffd23f'; g.fillText('DRIFT', w / 2, h / 2 - u * 0.9);
    g.fillStyle = '#7dffcf'; g.fillText('LAB', w / 2, h / 2 + u * 0.7);
    return c.toDataURL('image/png').split(',')[1];
  }, W, H);
  fs.writeFileSync(file, Buffer.from(data, 'base64'));
}
for (const d of fs.readdirSync(res)) if (d.startsWith('drawable') && fs.existsSync(`${res}/${d}/splash.png`)) await splash(`${res}/${d}/splash.png`);
await browser.close();
