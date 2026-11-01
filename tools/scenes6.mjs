// v6 sahne kontrolü: node tools/scenes6.mjs ad...
import puppeteer from 'puppeteer-core';
const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: 'new', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'], protocolTimeout: 180000 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const find = (test, off) => `(()=>{const g=__kacis.game;for(const k of g.cops)k.x+=1e5;g.god=true;const p=g.player;for(let r=1;r<70;r++)for(let cy=-r;cy<=r;cy++)for(let cx=-r;cx<=r;cx++){if(Math.max(Math.abs(cx),Math.abs(cy))!==r)continue;const c=g.world.chunk(cx,cy);if(!(${test}))continue;p.x=c.x+${off[0]};p.y=c.y+${off[1]};p.vx=p.vy=0;p.a=0;g.cam.x=p.x;g.cam.y=p.y;g.cam.lvx=g.cam.lvy=0;return 'ok'}return 'yok'})()`;
const S = {
  otoban: [find('c.hw&&c.biome==="city"', [700, 520]), 3500],
  donel: [find('c.template==="donel"', [640, 640]), 700],
  viraj: [find('c.template==="viraj"', [640, 640]), 700],
  viraj2: [find('c.template==="viraj"&&c.cx%2', [640, 400]), 700],
  mahalle: [find('c.template==="mahalle"', [640, 640]), 700],
  insaat: [find('c.template==="insaat"', [640, 640]), 700],
  harabe: [find('c.template==="harabe"', [640, 640]), 700],
  sanayi: [find('c.template==="sanayi"', [640, 640]), 700],
  downtown: [find('c.template==="downtown"', [640, 640]), 700],
  yangin: [find('c.fires&&c.fires.length', [640, 640]), 900],
};
for (const n of process.argv.slice(2)) {
  const page = await b.newPage();
  page.on('pageerror', (e) => console.log('HATA', n, e.message));
  await page.setViewport({ width: 500, height: 700, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:8080/?god=1', { timeout: 0 });
  await page.waitForFunction(() => !document.getElementById('menu').hidden, { timeout: 30000 });
  await page.evaluate(() => document.getElementById('btn-play').click());
  await sleep(500);
  console.log(n, await page.evaluate(S[n][0]));
  await sleep(S[n][1]);
  await page.screenshot({ path: `e2e-out/s-${n}.png` });
  await page.close();
}
await b.close();
