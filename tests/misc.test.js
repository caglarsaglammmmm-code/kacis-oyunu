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
  const d = sanitize({ coins: -5, bestScore: 'x', owned: ['yok', 'motor', 'motor', 'pars'], selected: 'duster', settings: { sound: false } });
  assert.equal(d.coins, 0);
  assert.equal(d.bestScore, 0);
  assert.deepEqual(d.owned, ['dogan', 'motor']);
  assert.equal(d.selected, 'dogan');
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

test('başlangıç aracı Tofaş Doğan; sırayla pahalılaşır, hızlanır, kayar, dayanır', () => {
  const cars = CONFIG.cars;
  assert.equal(cars[0].id, 'dogan');
  assert.equal(cars[0].cost, 0);
  assert.deepEqual(cars.map((c) => c.id), ['dogan', 'motor', 'grandland', 'tog', 'sahin', 'anadol', 'murat', 'egea', 'clio', 'duster']);
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

test('oyun adı her yerde Penci Zorn', () => {
  assert.equal(CONFIG.name, 'Penci Zorn');
  assert.ok(fs.readFileSync('index.html', 'utf8').includes('<title>Penci Zorn</title>'));
  assert.equal(JSON.parse(fs.readFileSync('manifest.json', 'utf8')).name, 'Penci Zorn');
  assert.equal(JSON.parse(fs.readFileSync('capacitor.config.json', 'utf8')).appName, 'Penci Zorn');
  assert.ok(fs.readFileSync('android/app/src/main/res/values/strings.xml', 'utf8').includes('Penci Zorn'));
  assert.ok(CONFIG.apkUrl.endsWith('/PenciZorn.apk'));
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
  for (const f of fs.readdirSync('js')) if (f !== 'app.file.js') assert.ok(list.includes(`js/${f}`), f);
});

test('açılış yazısı tam olarak istenen metin', () => {
  const html = fs.readFileSync('index.html', 'utf8');
  assert.ok(html.includes('Çağlar Sağlam bu oyuna şaplağını vurdu'));
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
