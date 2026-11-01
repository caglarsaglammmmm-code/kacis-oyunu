// Zorla sahne görüntüleri: tank atışı, barikat, ateş, SWAT
import puppeteer from 'puppeteer-core';
const EXE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const b = await puppeteer.launch({ executablePath: EXE, headless: 'new' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const OUT = process.env.E2E_OUT || 'e2e-out';
async function scene(name, w, h, q, setup, wait = 700) {
  const page = await b.newPage();
  page.on('pageerror', (e) => console.log('HATA', name, e.message));
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await page.goto(`http://localhost:8080/${q}`);
  await page.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 8000 });
  await page.click('#btn-play');
  await sleep(1200);
  await page.evaluate(setup);
  await sleep(wait);
  await page.screenshot({ path: `${OUT}/z-${name}.png` });
  await page.close();
}
const toBiome = (biome, template) => {
  const g = globalThis.__kacis.game; const w = g.world; const out = {};
  for (let r = 3; r < 90; r++) for (let cy = -r; cy <= r; cy += 2) for (let cx = -r; cx <= r; cx += 2) {
    w.biomeAt(cx, cy, out);
    if (out.biome !== biome || (template === 'sea') !== out.sea) continue;
    const c = w.chunk(cx, cy);
    if (template && c.template !== template) continue;
    const p = g.player;
    p.x = c.x + 100; p.y = c.y + 500; p.vx = 0; p.vy = 0; p.a = 0; g.cam.x = c.x + 340; g.cam.y = c.y + 620;
    for (const k of g.cops) k.x += 1e5;
    return `${biome}`;
  }
};
for (const [b, tpl] of [['city', 'mahalle'], ['city', 'downtown'], ['city', 'site'], ['city', 'gecekondu'], ['city', 'cami'], ['city', 'gece'], ['city', 'stadyum']]) {
  await scene(`${b}-${tpl || ''}`, 390, 844, '?god=1&x=' + b, `(${toBiome.toString()})('${b}', ${tpl ? `'${tpl}'` : 'undefined'})`, 1800);
}
await scene('guc', 390, 844, '?t=100&god=1', () => {
  const g = globalThis.__kacis.game; const p = g.player;
  g.takePower('giant', p.x, p.y); g.takePower('ghost', p.x, p.y);
  for (const [i, k] of [17, 18, 19, 20].entries()) g.world.addPower(p.x + 40 + i * 60, p.y + 260, k);
  g.spawnCop('moto', 'chaser', p.x - 60, p.y + 120, 1);
  g.spawnCop('fast', 'chaser', p.x + 60, p.y + 200, 1);
}, 500);
await scene('kalabalik', 844, 390, '?t=60&god=1', () => {
  const g = globalThis.__kacis.game; const p = g.player;
  const peds = g.crowd.peds; const K = Object.keys(globalThis.__kacis.cfg.peds.kinds); for (let i = 0; i < K.length; i++) { g.crowd.setupPed(peds[i], K[i], p.x - 90 + i * 24, p.y - 60 - (i % 2) * 22, 0); peds[i].turnT = 9; }
  g.crowd.setupPed(peds[20], 'simitci', p.x + 40, p.y + 30, 0); g.crowd.launch(peds[20], p, false);
  const kinds = ['taxi', 'minibus', 'bus', 'murat']; let n = 0;
  for (const o of g.crowd.npcs) { if (n >= 4) break; g.crowd.npcT = 1e9; g.crowd.spawnNpc(); }
  for (const o of g.crowd.npcs) if (o.alive) { o.kind = kinds[n % 4]; o.color = 0; o.spec = globalThis.__kacis.cfg.npc.types[o.kind]; o.len = o.spec.len; o.wid = o.spec.wid; o.x = p.x - 280 + n * 150; o.y = p.y + 170; o.vx = 0; o.vy = 0; o.a = 0; o.drive.maxSpeed = 1; n++; }
}, 280);
await scene('sistem', 844, 390, '?god=1', () => {
  const g = globalThis.__kacis.game; const s = g.world.sistemChunk(); const c = g.world.chunk(s.cx, s.cy); const p = g.player;
  p.x = c.x + 580; p.y = c.y + 900; p.a = 0; p.vx = 0; p.vy = 0; g.cam.x = p.x; g.cam.y = p.y - 280;
  for (const k of g.cops) k.x += 1e5;
}, 700);
await scene('gece', 390, 844, '?god=1', () => {
  const g = globalThis.__kacis.game; g.dayT = 100; g.tickCount = 11;
}, 1500);
await scene('tank', 390, 844, '?t=285&god=1', () => {
  const g = globalThis.__kacis.game; const p = g.player;
  const c = g.spawnCop('tank', 'chaser', p.x + 60, p.y + 300, -1.57);
  c.turret = -1.4; c.fireT = 0.1;
  g.spawnCop('swat', 'chaser', p.x - 60, p.y + 180, -1.57);
}, 400);
await b.close();
