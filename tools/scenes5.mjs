// v5 sahne kontrolü: istenen şablona ışınlanır, ekran görüntüsü alır.
import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'], protocolTimeout: 180000 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const go = (tpl, ox, oy, night) => {
  const g = globalThis.__drift.game; const w = g.world;
  for (const k of g.cops) k.x += 1e5;
  for (let r = 2; r < 60; r++) for (let cy = -r; cy <= r; cy++) for (let cx = -r; cx <= r; cx++) {
    if (Math.max(Math.abs(cx), Math.abs(cy)) !== r) continue;
    const c = w.chunk(cx, cy);
    if (c.template !== tpl) continue;
    const p = g.player;
    p.x = c.x + 60; p.y = c.y + 300; p.vx = 0; p.vy = 0; p.a = 1.57; g.god = true;
    g.cam.x = c.x + ox; g.cam.y = c.y + oy; g.cam.lvx = 0; g.cam.lvy = 0;
    p.x = c.x + ox; p.y = c.y + oy;
    if (night) g.dayT = 95;
    return tpl;
  }
  return 'yok';
};
async function scene(name, w, h, setup, wait = 900) {
  const page = await b.newPage();
  page.on('pageerror', (e) => console.log('HATA', name, e.message));
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:8080/?god=1', { timeout: 0 });
  await page.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 30000 });
  await page.evaluate(() => document.getElementById('btn-play').click());
  await sleep(500);
  const r = await page.evaluate(setup);
  await sleep(wait);
  await page.screenshot({ path: `e2e-out/s-${name}.png` });
  console.log(name, r === undefined ? '' : r);
  await page.close();
}
const zoom = (tpl, ox, oy, night = false) => `(${go.toString()})('${tpl}', ${ox}, ${oy}, ${night})`;
for (const [n, t, x, y, nt] of [['spor', 'spor', 400, 400], ['cami', 'cami', 400, 400], ['hastane', 'hastane', 400, 400], ['okul', 'okul', 400, 400], ['site', 'site', 640, 640], ['gece', 'gece', 500, 500, true], ['kolej', 'kolej', 640, 640], ['sahil', 'sea', 300, 300], ['golet', 'golet', 300, 300], ['downtown', 'downtown', 500, 500]]) await scene(n, 500, 700, zoom(t, x, y, !!nt));
const at = (style, pad) => `(()=>{const g=__drift.game;for(const k of g.cops)k.x+=1e5;const p=g.player;g.god=true;for(let r=1;r<70;r++)for(let cy=-r;cy<=r;cy++)for(let cx=-r;cx<=r;cx++){if(Math.max(Math.abs(cx),Math.abs(cy))!==r)continue;const c=g.world.chunk(cx,cy);for(let i=0;i<c.padCount;i++){if(c.pads[i].kind==='${pad}'){p.x=c.x+(c.pads[i].tx+c.pads[i].w/2)*40;p.y=c.y+(c.pads[i].ty+c.pads[i].h/2)*40;p.vx=p.vy=0;g.cam.x=p.x;g.cam.y=p.y;return 'ok'}}for(let i=0;i<c.rectCount;i++){if(c.rects[i].style===${style}){const q=c.rects[i];p.x=q.x+q.w/2;p.y=q.y+q.h+16;p.vx=p.vy=0;g.cam.x=q.x+q.w/2;g.cam.y=q.y+q.h/2;return 'ok'}}}return 'yok'})()`;
await scene('camiU', 500, 700, at(33, 'x'));
await scene('futbol', 500, 700, at(-1, 'foot'));
await scene('basket', 500, 700, at(-1, 'basket'));
await scene('okulU', 500, 700, at(-1, 'yard'));
await scene('stad', 500, 700, at(34, 'x'));
await scene('site2', 500, 700, at(35, 'x'));
await scene('kule', 500, 700, at(42, 'x'));
await scene('banka', 500, 700, at(27, 'x'));
await scene('batis', 500, 700, `(()=>{const g=__drift.game;g.god=false;for(const k of g.cops)k.x+=1e5;for(let r=2;r<60;r++)for(let cy=-r;cy<=r;cy++)for(let cx=-r;cx<=r;cx++){const c=g.world.chunk(cx,cy);if(c.template!=='sea')continue;for(let i=0;i<c.rectCount;i++){const q=c.rects[i];if(q.kind==='sea'&&q.w>200){const p=g.player;p.x=q.x+q.w/2;p.y=q.y+20;p.vx=120;p.vy=0;g.cam.x=p.x;g.cam.y=p.y;return g.state}}}})()`, 1100);
await scene('uzayli', 500, 700, `(()=>{const g=__drift.game;g.time=240;g.diff.ufos=2;const p=g.player;const u=g.spawnCop('ufo','chaser',p.x+40,p.y+60,0);g.spawnCop('ufo','chaser',p.x+200,p.y+260,0);g.spawnCop('rover','chaser',p.x+20,p.y-170,1.57);g.spawnCop('rover','chaser',p.x-20,p.y+210,-1.57);g.spawnCop('car','chaser',p.x+30,p.y+120,-1.57);})()`, 450);
await b.close();
