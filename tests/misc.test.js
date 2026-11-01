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
  assert.equal(i.steer, 0);
  assert.equal(i.reverse, true);
  i.release(1);
  assert.equal(i.steer, -1);
  i.release(2);
  assert.equal(i.steer, 0);
  assert.equal(i.reverse, false);
});

test('klavye: ok ve A/D, ikisi birden geri', () => {
  const i = new Input();
  assert.ok(i.key('ArrowLeft', true));
  assert.equal(i.steer, -1);
  assert.ok(i.key('KeyD', true));
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
  assert.equal(s.buy('pars'), false, 'coin yetmez');
  s.data.coins = 200;
  assert.equal(s.select('pars'), false, 'sahip değil');
  assert.equal(s.buy('pars'), true);
  assert.equal(s.data.coins, 50);
  assert.equal(s.selectedCar().id, 'pars');
  assert.equal(s.buy('pars'), false, 'iki kez alınmaz');
  assert.equal(s.buy('yok'), false);
});

test('kayıt: bozuk veri güvenli', () => {
  assert.deepEqual(sanitize(null), defaultSave());
  const d = sanitize({ coins: -5, bestScore: 'x', owned: ['yok', 'pars', 'pars'], selected: 'kaplan', settings: { sound: false } });
  assert.equal(d.coins, 0);
  assert.equal(d.bestScore, 0);
  assert.deepEqual(d.owned, ['serce', 'pars']);
  assert.equal(d.selected, 'serce');
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
