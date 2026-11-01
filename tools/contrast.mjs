// Araç-yol kontrastı: her sprite her yol tonunda çizilir, gövde ve kenar parlaklık farkı ölçülür.
import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new' });
const p = await b.newPage();
p.on('pageerror', (e) => console.log('HATA', e.message));
await p.goto('http://localhost:8080/?god=1', { timeout: 0 });
await p.waitForFunction(() => globalThis.__drift && __drift.renderer.sprites.parked.length > 6, { timeout: 30000 });
const r = await p.evaluate(async () => {
  const { sheetSprite } = await import('/js/sheet.js');
  const { CAR_SHEET } = await import('/js/carsheet.js');
  const tones = __drift.cfg.world.roadTones;
  const lum = (d, i) => { const f = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(d[i]) + 0.7152 * f(d[i + 1]) + 0.0722 * f(d[i + 2]); };
  const star = (y) => (y > 0.008856 ? Math.cbrt(y) * 116 - 16 : y * 903.3);
  const out = [];
  for (const key of Object.keys(CAR_SHEET.cells)) {
    const s = sheetSprite(key, 48);
    const w = s.width; const h = s.height;
    const base = s.getContext('2d').getImageData(0, 0, w, h).data;
    for (let t = 0; t < tones.length; t++) {
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d', { willReadFrequently: true });
      g.fillStyle = tones[t]; g.fillRect(0, 0, w, h); g.drawImage(s, 0, 0);
      const d = g.getImageData(0, 0, w, h).data;
      const road = star(lum(d, 0));
      // Kenar bandı: sprite alfası kısmi olan pikseller; en güçlü %20'lik farkların ortalaması gözün gördüğü sınırdır
      const diffs = []; let body = 0; let n = 0;
      for (let i = 0; i < d.length; i += 4) {
        const a = base[i + 3];
        if (a > 240) { body += star(lum(d, i)); n++; }
        else if (a > 20) diffs.push(Math.abs(star(lum(d, i)) - road));
      }
      diffs.sort((x, y) => y - x);
      const top = diffs.slice(0, Math.max(1, diffs.length >> 2));
      out.push({ key, tone: t, body: Math.abs(body / n - road), edge: top.reduce((x, y) => x + y, 0) / top.length });
    }
  }
  return out;
});
await b.close();
const worst = (f) => [...r].sort((a, c) => a[f] - c[f]).slice(0, 5).map((o) => `${o.key}@${o.tone}:${o[f].toFixed(0)}`).join(' ');
console.log('olcum', r.length, '| en dusuk govde farki', worst('body'));
console.log('en dusuk kenar farki', worst('edge'));
for (let t = 0; t < 3; t++) { const q = r.filter((o) => o.tone === t); console.log('ton', t, 'ort kenar', (q.reduce((a, o) => a + o.edge, 0) / q.length).toFixed(1), 'min kenar', Math.min(...q.map((o) => o.edge)).toFixed(1)); }
