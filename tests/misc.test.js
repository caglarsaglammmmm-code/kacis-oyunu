import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CONFIG } from '../js/config.js';
import { Input } from '../js/input.js';
import { Storage, sanitize, defaultSave } from '../js/storage.js';
import { Effects, FX } from '../js/effects.js';
import { buildBundle } from '../tools/bundle-file.mjs';

function mem() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}

test('dokunma: sağ, sol, ikisi', () => {
  const i = new Input();
  i.width = 400;
  assert.equal(i.steer, 0);
  i.press(1, i.sideOf(350));
  assert.equal(i.steer, 1);
  assert.equal(i.reverse, false);
  i.press(2, i.sideOf(50));
  assert.equal(i.reverse, false, 'parmak geçişi geri vites sayılmaz');
  assert.equal(i.steer, -1, 'son basılan yön kazanır');
  i.tick(0.2);
  assert.equal(i.steer, 0);
  assert.equal(i.reverse, true);
  i.release(1);
  i.tick(0.02);
  assert.equal(i.steer, -1);
  i.release(2);
  i.tick(0.02);
  assert.equal(i.steer, 0);
  assert.equal(i.reverse, false);
});

test('klavye: ok ve A/D, ikisi birden geri', () => {
  const i = new Input();
  assert.ok(i.key('ArrowLeft', true));
  assert.equal(i.steer, -1);
  assert.ok(i.key('KeyD', true));
  i.tick(0.2);
  assert.equal(i.reverse, true);
  i.clear();
  assert.equal(i.reverse, false);
  assert.equal(i.key('Space', true), false);
});

test('kayıt: yükle, yaz, rekor, coin', () => {
  const b = mem();
  const s = new Storage(b);
  const r = s.recordRun({ score: 500, time: 60, coins: 40 });
  assert.deepEqual(r, { newScore: true, newTime: true });
  const r2 = s.recordRun({ score: 100, time: 90, coins: 1 });
  assert.deepEqual(r2, { newScore: false, newTime: true });
  const again = new Storage(b);
  assert.equal(again.data.bestScore, 500);
  assert.equal(again.data.bestTime, 90);
  assert.equal(again.data.coins, 41);
});

test('kayıt: satın alma ve seçim kuralları', () => {
  const s = new Storage(mem());
  assert.equal(s.buy('motor'), false, 'coin yetmez');
  s.data.coins = 150;
  assert.equal(s.select('motor'), false, 'sahip değil');
  assert.equal(s.buy('motor'), true);
  assert.equal(s.data.coins, 50);
  assert.equal(s.selectedCar().id, 'motor');
  assert.equal(s.buy('motor'), false, 'iki kez alınmaz');
  assert.equal(s.buy('yok'), false);
});

test('kayıt: bozuk veri güvenli', () => {
  assert.deepEqual(sanitize(null), defaultSave());
  const d = sanitize({ coins: -5, bestScore: 'x', owned: ['yok', 'motor', 'motor', 'pars'], selected: 'bozkir', settings: { sound: false } });
  assert.equal(d.coins, 0);
  assert.equal(d.bestScore, 0);
  assert.deepEqual(d.owned, ['atmaca', 'motor']);
  assert.equal(d.selected, 'atmaca');
  assert.equal(d.settings.sound, false);
  const b = { getItem: () => '{bozuk', setItem() { throw new Error('dolu'); } };
  const s = new Storage(b);
  s.save();
  assert.equal(s.data.coins, 0);
});

test('efekt havuzu taşmaz, süresi biteni temizler', () => {
  const e = new Effects();
  for (let i = 0; i < 5000; i++) e.spawn(FX.SMOKE, 0, 0, 1, 1, 0.2, 4);
  assert.equal(e.liveCount(), CONFIG.perf.maxParticles);
  for (let i = 0; i < 20; i++) e.update(1 / 60);
  assert.equal(e.liveCount(), 0);
  for (let i = 0; i < 5000; i++) e.addSkid(0, 0, 1, 1);
  assert.ok(e.skidCursor < e.skidMax);
});

test('başlangıç aracı Atmaca; sırayla pahalılaşır, hızlanır, kayar, dayanır', () => {
  const cars = CONFIG.cars;
  assert.equal(cars[0].id, 'atmaca');
  assert.equal(cars[0].cost, 0);
  assert.deepEqual(cars.map((c) => c.id), ['atmaca', 'motor', 'granit', 'elektra', 'simsek', 'cinar', 'efe', 'marmara', 'liva', 'bozkir']);
  for (let i = 1; i < cars.length; i++) {
    assert.ok(cars[i].cost > cars[i - 1].cost, 'fiyat');
    assert.ok(cars[i].maxSpeed > cars[i - 1].maxSpeed, 'hız');
    assert.ok(cars[i].driftGrip < cars[i - 1].driftGrip, 'kayma');
    assert.ok(cars[i].durability > cars[i - 1].durability, 'dayanıklılık');
    assert.ok(cars[i].engine, 'motor sesi');
  }
  assert.equal(new Set(cars.map((c) => c.shape)).size, cars.length, 'her aracın şekli ayrı');
  for (const c of cars) assert.ok(['gloss', 'metal', 'matte'].includes(c.finish), 'boya türü');
  assert.equal(new Set(cars.map((c) => c.color)).size, cars.length, 'her aracın rengi ayrı');
});

test('oyun adı her yerde Drift Lab', () => {
  assert.equal(CONFIG.name, 'Drift Lab');
  assert.ok(fs.readFileSync('index.html', 'utf8').includes('<title>Drift Lab</title>'));
  assert.equal(JSON.parse(fs.readFileSync('manifest.json', 'utf8')).name, 'Drift Lab');
  const cap = JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8'));
  assert.equal(cap.appName, 'Drift Lab');
  assert.equal(cap.appId, 'com.driftlab.game');
  assert.ok(fs.readFileSync('android/app/src/main/res/values/strings.xml', 'utf8').includes('Drift Lab'));
  assert.ok(CONFIG.apkUrl.endsWith('/DriftLab-PlayStore.apk'));
});

test('iki sürümün uygulama adı ve ikonu aynı', async () => {
  const { buildWeb } = await import('../tools/flavor.mjs');
  const os = await import('node:os');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const out = {};
  for (const f of ['play', 'arkadas']) out[f] = await buildWeb(f, fs.mkdtempSync(path.join(os.tmpdir(), `ad-${f}-`)), { pages: true });
  const read = (f, p) => fs.readFileSync(path.join(out[f], p));
  const hash = (b) => crypto.createHash('sha256').update(b).digest('hex');
  assert.equal(read('play', 'manifest.json').toString(), read('arkadas', 'manifest.json').toString());
  for (const f of ['play', 'arkadas']) assert.ok(read(f, 'index.html').toString().includes('<title>Drift Lab</title>'), f);
  for (const ic of fs.readdirSync('icons')) assert.equal(hash(read('play', `icons/${ic}`)), hash(read('arkadas', `icons/${ic}`)), ic);
  // Android: arkadaş sürümünün kendi ikon kaynağı yok, ana ikonlar kullanılır; ad Drift Lab
  const flav = 'android/app/src/arkadas/res';
  const files = fs.readdirSync(flav, { recursive: true }).map(String);
  assert.ok(!files.some((n) => /mipmap|drawable|ic_launcher/.test(n)), files.join(','));
  const xml = fs.readFileSync(`${flav}/values/strings.xml`, 'utf8');
  assert.ok(xml.includes('<string name="app_name">Drift Lab</string>') && xml.includes('<string name="title_activity_main">Drift Lab</string>'));
});

test('js/app.file.js güncel (değilse: npm run bundle)', () => {
  const n = (t) => t.replace(/\r\n/g, '\n');
  assert.equal(n(fs.readFileSync('js/app.file.js', 'utf8')), n(buildBundle()));
});

test('sw.js önbellek listesi eksiksiz', () => {
  const sw = fs.readFileSync('sw.js', 'utf8');
  const list = sw.match(/const ASSETS = \[([\s\S]*?)\];/)[1].match(/'[^']+'/g).map((i) => i.slice(1, -1));
  for (const f of list) if (f !== './') assert.ok(fs.existsSync(f), f);
  for (const f of fs.readdirSync('fonts').filter((n) => n.endsWith('.woff2'))) assert.ok(list.includes(`fonts/${f}`), f);
  for (const f of fs.readdirSync('js')) if (f !== 'app.file.js' && f !== 'i18n') assert.ok(list.includes(`js/${f}`), f);
  for (const f of fs.readdirSync('js/i18n')) assert.ok(list.includes(`js/i18n/${f}`), f);
});

test('açılış yazısı tam olarak istenen metin', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  // Açılışta oyun adı yok: geliştirici yazısı dil sisteminden gelir
  assert.ok(html.includes('<div id="splash" hidden><p id="splash-text"></p></div>'));
  assert.ok(!/<div id="splash"[^>]*>[^<]*<p[^>]*>[^<]*Drift Lab/.test(html));
});

test('tek dosyalık paket geçerli JavaScript (modüller arası ad çakışması yok)', () => {
  assert.doesNotThrow(() => new Function(buildBundle()));
});

test('tek dosyalık pakette üst düzey ad çakışması yok', () => {
  const mods = fs.readFileSync('tools/bundle-file.mjs', 'utf8').match(/const MODULES = \[([^\]]+)\]/)[1].match(/'[^']+'/g).map((m) => m.slice(1, -1));
  const seen = new Map();
  for (const m of mods) {
    const s = fs.readFileSync(`js/${m}.js`, 'utf8');
    for (const r of s.matchAll(/^(?:export )?(?:async )?(?:function|const|let|class) ([A-Za-z_$][\w$]*)/gm)) {
      assert.ok(!seen.has(r[1]), `${r[1]}: ${seen.get(r[1])} ve ${m}`);
      seen.set(r[1], m);
    }
  }
});

test('motor: devir hızla artar, vites atınca düşer, her aracın sesi ayrı, elektrikli vites atmaz', async () => {
  const { engineRpm, ENGINE_KINDS } = await import('../js/audio.js');
  const e = CONFIG.cars[0].engine;
  assert.ok(engineRpm(e, 0.2).rpm > engineRpm(e, 0.05).rpm);
  const justBefore = engineRpm(e, 1 / e.gears - 0.01);
  const justAfter = engineRpm(e, 1 / e.gears + 0.01);
  assert.equal(justAfter.gear, justBefore.gear + 1);
  assert.ok(justAfter.rpm < justBefore.rpm * 0.8, 'vites devri düşürür');
  const ev = CONFIG.cars.find((c) => c.engine.kind === 'ev').engine;
  assert.equal(engineRpm(ev, 0.9).gear, 0);
  assert.equal(new Set(CONFIG.cars.map((c) => JSON.stringify(c.engine))).size, CONFIG.cars.length);
  for (const c of CONFIG.cars) assert.ok(ENGINE_KINDS[c.engine.kind], c.id);
  assert.ok(new Set(CONFIG.cars.map((c) => c.engine.kind)).size >= 6);
});

test('kalite: FPS düşünce iner, rahatlayınca bekleyip yükselir, sabit modda değişmez', async () => {
  const { Quality, LEVELS, guessLevel } = await import('../js/quality.js');
  const feed = (q, ms, secs) => { let ch = 0; for (let t = 0; t < secs * 1000; t += ms) if (q.note(ms)) ch++; return ch; };
  const q = new Quality('auto', 0);
  feed(q, 25, 3); // 40 FPS
  assert.ok(q.level > 0, 'düşük FPS seviyeyi indirmeli');
  const down = q.level;
  feed(q, 16.7, 3);
  assert.equal(q.level, down, 'hemen geri çıkmamalı: gidip gelme olmasın');
  feed(q, 16.7, 70);
  assert.ok(q.level < down, 'uzun süre rahatsa yükselmeli');
  const fixed = new Quality('high', 0);
  feed(fixed, 50, 5);
  assert.equal(fixed.level, 0);
  const low = new Quality('low', 0);
  assert.equal(low.level, LEVELS.length - 1);
  assert.equal(new Quality('auto', 99).level, LEVELS.length - 1);
  const pause = new Quality('auto', 0);
  assert.equal(pause.note(5000), false, 'arka plan boşluğu sayılmaz');
  assert.equal(guessLevel(4, 8), 2);
  assert.equal(guessLevel(8, 4), 1);
  assert.equal(guessLevel(8, 8), 0);
  assert.equal(guessLevel(0, 0), 0);
});

test('kontrol: üç mod sola/sağa çalışır, bırakınca düzelir, dış dokunuş etkilemez', async () => {
  const { Input, WHEEL_MAX } = await import('../js/input.js');
  const run = (i, n = 40) => { for (let k = 0; k < n; k++) i.tick(1 / 60); };
  const a = new Input();
  a.width = 400;
  a.down(1, 50, 100); assert.equal(a.steer, -1);
  a.move(1, 300, 100); assert.equal(a.steer, 1, 'parmak yarı değiştirince yön değişir');
  a.up(1); assert.equal(a.steer, 0);

  const w = new Input();
  w.setMode('wheel');
  w.width = 400;
  w.wheel = { cx: 300, cy: 700, r: 70 };
  assert.equal(w.down(9, 50, 100), false, 'direksiyon dışı dokunuş alınmaz');
  assert.equal(w.steer, 0);
  assert.equal(w.down(1, 300, 650), true);
  assert.equal(w.down(2, 310, 650), false, 'ikinci parmak alınmaz');
  w.move(1, 350, 700); // Saat yönünde 90 derece
  run(w, 1);
  assert.ok(Math.abs(w.wheelA - Math.PI / 2) < 0.02);
  assert.ok(Math.abs(w.steer - (Math.PI / 2) / WHEEL_MAX) < 0.02, 'açı ile orantılı');
  for (const [x, y] of [[300, 750], [250, 700], [300, 650], [350, 700]]) w.move(1, x, y);
  assert.equal(w.wheelA, WHEEL_MAX, 'tam kilitten öteye gitmez');
  w.up(2);
  assert.equal(w.wheelId, 1, 'başka parmak kalkınca direksiyon bırakılmaz');
  w.up(1);
  run(w, 90);
  assert.equal(w.steer, 0, 'bırakınca ortaya döner');

  const s = new Input();
  s.setMode('stick');
  s.width = 400;
  s.bounds = { l: 0, t: 0, r: 400, b: 800 };
  assert.equal(s.down(1, 300, 400), false, 'sağ yarıda açılmaz');
  assert.equal(s.down(1, 100, 400), true);
  s.move(1, 105, 400); run(s);
  assert.equal(s.steer, 0, 'ölü bölge');
  s.move(1, 190, 400); run(s);
  assert.ok(s.steer > 0.95);
  s.move(1, 10, 400); run(s);
  assert.ok(s.steer < -0.95);
  s.up(1); run(s);
  assert.equal(s.steer, 0);
  s.down(1, 2, 2);
  assert.ok(s.stick.x >= 54 && s.stick.y >= 54, 'halka ekrana taşmaz');
  s.setMode('wheel');
  assert.equal(s.stick.on, false, 'mod değişince eskisi kapanır');
  assert.equal(s.stickId, null);
  s.revHeld = true; s.clear();
  assert.equal(s.reverse, false);
  s.key('ArrowLeft', true);
  assert.equal(s.steer, -1, 'klavye her modda çalışır');
});

test('ayarlar: kontrol ve kalite kaydedilir, geçersiz değer varsayılana döner', async () => {
  const { sanitize, defaultSave } = await import('../js/storage.js');
  assert.equal(defaultSave().settings.control, 'zones');
  assert.equal(sanitize({ settings: { control: 'wheel', quality: 'low', qLevel: 2 } }).settings.control, 'wheel');
  const bad = sanitize({ settings: { control: 'x', quality: 9, qLevel: 44 } });
  assert.equal(bad.settings.control, 'zones');
  assert.equal(bad.settings.quality, 'auto');
  assert.equal(bad.settings.qLevel, -1);
});
