// v21: meteor yağmuru, gizli geçit ve motosiklet, iki stadyum, korunan alanlar
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { CONFIG, carById } from '../js/config.js';
import { Game } from '../js/game.js';
import { Storage, sanitize } from '../js/storage.js';
import { meteorRate } from '../js/meteor.js';
import { TILE } from '../js/world.js';
import { ENGINE_KINDS } from '../js/audio.js';

const dt = 1 / 60;
const MET = CONFIG.meteor;
const car = CONFIG.cars[0];
function game(opts = {}) {
  const g = new Game(1);
  g.view.w = 1280; g.view.h = 720;
  g.start(car, { seed: 99, startTime: 0, god: false, ...opts });
  return g;
}
function mem() {
  const m = new Map();
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, v) };
}
// Oyuncuyu sabit tutup oyunu ilerletir
const hold = (g, sec, x, y) => { for (let t = 0; t < sec; t += dt) { if (x !== undefined) { g.player.x = x; g.player.y = y; } g.player.vx = 0; g.player.vy = 0; g.tick(dt, 0, false); } };

// --- UZAYLI GEÇİŞİ: kök sebep testi (UFO ışını kaçılmazdı, uzaylılar oyuncudan hızlıydı, önünde doğuyorlardı) ---
test('uzaylı geçişinde makul sürüş yapan bot ilk 5 saniyede ölmez (8 tohum)', async () => {
  const { runStage } = await import('../tools/stage-bot.mjs');
  const T = CONFIG.difficulty.aliensAt;
  for (let i = 0; i < 8; i++) {
    const r = runStage(i, T - 0.5, 5.5, { warm: 12, cops: 12 });
    assert.ok(r.survived, `tohum ${i}: ${r.time.toFixed(1)} sn, ${r.cause}`);
  }
});

// --- METEOR ---
test('meteor tanklardan sonra başlar; uyarı tam 3 sn önce; sıklık artar, uyarı süresi hiç kısalmaz; tavan var', () => {
  assert.ok(MET.at > CONFIG.difficulty.tanksAt, 'tanklardan sonra');
  assert.ok(MET.warn >= 3, 'uyarı en az 3 sn');
  const a = meteorRate(MET.at); const b = meteorRate(MET.at + 150); const c = meteorRate(MET.at + 400);
  assert.ok(b.every < a.every && c.every < b.every, 'dalgalar sıklaşır');
  assert.ok(b.perWave > a.perWave && c.perWave >= b.perWave, 'dalga büyür');
  assert.ok(c.perWave <= MET.max && MET.max <= 8, 'üst sınır');
  const g = game({ startTime: MET.at - 0.5, god: true });
  const ev = [];
  g.onEvent = (n) => ev.push([n, g.time]);
  hold(g, 1.5);
  assert.ok(ev.some(([n]) => n === 'meteors'), 'aşama yazısı olayı');
  const w = ev.find(([n]) => n === 'meteorwarn');
  assert.ok(w, 'uyarı çıktı');
  const m = g.meteors.list.find((k) => k.alive);
  const warnAt = w[1];
  let hitAt = null;
  g.onEvent = (n) => { if (n === 'meteorhit' && hitAt === null) hitAt = g.time; };
  while (m.alive) { g.player.vx = 0; g.player.vy = 0; g.tick(dt, 0, false); }
  assert.ok(Math.abs(hitAt - warnAt - MET.warn - MET.fall) <= dt * 1.5, `uyarıdan çarpmaya ${(hitAt - warnAt).toFixed(3)} sn`);
});

test('meteor: dairedeki oyuncu ölür, dışarıdaki zarar görmez; polis, uzaylı ve trafik etkilenir, tank ağır hasar alır', () => {
  // İçeride
  const g = game({ startTime: MET.at + 1, god: false });
  const m = g.meteors.list[0];
  Object.assign(m, { alive: true, x: g.player.x + 40, y: g.player.y, t: MET.warn + MET.fall - dt / 2 });
  g.tick(dt, 0, false);
  assert.equal(g.state, 'dying');
  assert.equal(g.cause, 'meteor');
  // Dışarıda (kenarın hemen dışı)
  const h = game({ startTime: MET.at + 1, god: false });
  h.damage = 0;
  const n = h.meteors.list[0];
  Object.assign(n, { alive: true, x: h.player.x + MET.radius + 30, y: h.player.y, t: MET.warn + MET.fall - dt / 2 });
  const cop = h.spawnCop('car', 'chaser', n.x + 20, n.y + 10, 0);
  const alien = h.spawnCop('blob', 'chaser', n.x - 10, n.y - 30, 0);
  const tank = h.spawnCop('tank', 'chaser', n.x + 30, n.y - 40, 0);
  const tankHp = tank.hp;
  h.tick(dt, 0, false);
  assert.equal(h.state, 'play', 'dışarıdaki ölmez');
  assert.equal(h.damage, 0, 'dışarıdaki zarar görmez');
  assert.ok(!h.cops.includes(cop) && !h.cops.includes(alien), 'polis ve uzaylı patladı');
  assert.ok(!h.cops.includes(tank) || tank.hp < tankHp - 300, 'tank ağır hasar');
  // Hile ve ölümsüzlükte ölüm yok
  const k = game({ startTime: MET.at + 1, god: false });
  k.toggleCheat();
  Object.assign(k.meteors.list[0], { alive: true, x: k.player.x, y: k.player.y, t: MET.warn + MET.fall - dt / 2 });
  k.tick(dt, 0, false);
  assert.equal(k.state, 'play', 'hile açıkken ölmez');
});

test('meteor çarptığı yerdeki binayı yıkar; anıta, gizli geçide ve stadyumlara hiç düşmez, oyuncunun hemen altına doğmaz', () => {
  const g = game({ startTime: MET.at + 1, god: true });
  // Bina yıkımı
  let rect = null; let ch = null;
  for (let cx = 1; !rect && cx < 6; cx++) {
    const c = g.world.chunk(cx, 1);
    for (let i = 0; i < c.rectCount; i++) { const r = c.rects[i]; if (r.kind === 'building' && !r.sacred && r.alive) { rect = r; ch = c; break; } }
  }
  const m = g.meteors.list[0];
  Object.assign(m, { alive: true, x: rect.x + rect.w / 2, y: rect.y + rect.h / 2, t: MET.warn + MET.fall - dt / 2 });
  g.player.x = m.x + 1500; g.player.y = m.y;
  g.tick(dt, 0, false);
  assert.equal(rect.alive, false, 'bina yıkıldı');
  assert.ok(ch);
  // Hedef seçimi: korunan alanların yanında yüzlerce deneme
  let placed = 0;
  for (const z of g.world.zones()) {
    for (let i = 0; i < 300; i++) {
      g.player.x = z.x - 150 + Math.random() * (z.w + 300);
      g.player.y = z.y - 150 + Math.random() * (z.h + 300);
      g.player.vx = (Math.random() - 0.5) * 600; g.player.vy = (Math.random() - 0.5) * 600;
      const mt = g.meteors.list[1];
      mt.alive = false;
      if (!g.meteors.place(g, mt)) continue;
      placed++;
      for (const k of g.world.zones()) {
        const dx = Math.max(k.x - mt.x, 0, mt.x - k.x - k.w); const dy = Math.max(k.y - mt.y, 0, mt.y - k.y - k.h);
        assert.ok(Math.hypot(dx, dy) > MET.radius, `${k.kind} alanına düşmez`);
      }
      assert.ok(Math.hypot(mt.x - g.player.x, mt.y - g.player.y) >= MET.minR, 'oyuncunun altına doğmaz');
    }
  }
  assert.ok(placed > 200, `yer bulundu ${placed}`);
  // Korunan yapı meteorla yıkılmaz
  const st = g.world.zone('stadium');
  assert.equal(g.crushCircle(st.x + st.w / 2, st.y + st.h / 2, 400, 50), 0, 'stadyum yıkılmaz');
});

// --- GİZLİ GEÇİT VE MOTOSİKLET ---
test('gizli geçit çok uzakta, ücra köşede; rampaya girince bodrum sahnesi, kalıcı motosiklet, dönüşte koruma', () => {
  const g = game({ god: true });
  const z = g.world.zone('secret');
  assert.ok(z, 'geçit var');
  const d = Math.hypot(z.x, z.y) / (CONFIG.world.tile * CONFIG.world.chunkTiles);
  assert.ok(d >= 9, `çok uzak: ${d.toFixed(1)} chunk`);
  // Rampa chunk'ın güneydoğu köşesinde ve 3x3 karodan küçük
  assert.ok(z.w <= 3 * TILE && z.h <= 3 * TILE);
  const ev = [];
  g.onEvent = (n) => ev.push(n);
  g.player.x = z.x + z.w / 2; g.player.y = z.y + z.h / 2; g.player.speed = 120; g.player.vx = 120; g.player.vy = 0;
  g.world.update(g.player.x, g.player.y);
  assert.ok(g.checkSecret(), 'girince tetiklenir');
  assert.equal(g.state, 'secret');
  assert.ok(ev.includes('secret'));
  const t0 = g.time;
  let n = 0;
  while (g.state === 'secret' && n++ < 600) g.tick(dt, 0, false);
  assert.equal(g.state, 'play', 'sahne bitince oyuna dönülür');
  assert.equal(g.time, t0, 'sahnede süre durur');
  assert.ok(Math.abs(n * dt - CONFIG.secret.scene) < 0.05, `sahne ${(n * dt).toFixed(2)} sn`);
  assert.ok(ev.includes('secretexit'));
  assert.ok(g.shieldT > 0, 'dönüşte kısa koruma');
  assert.ok(!(g.player.x >= z.x && g.player.x <= z.x + z.w && g.player.y >= z.y && g.player.y <= z.y + z.h), 'rampanın dışında');
  assert.ok(CONFIG.secret.scene >= 2 && CONFIG.secret.scene <= 3.5, 'kısa sahne (2-3 sn)');
});

test('motosiklet: satılmaz, kodla açılmaz, bulmayanda hiçbir listede yok; bulunca kalıcı ve seçilebilir', () => {
  const S = CONFIG.secretCar;
  assert.ok(!CONFIG.cars.some((c) => c.id === S.id), 'satış listesinde yok');
  assert.ok(!CONFIG.codes.some((c) => c.car === S.id), 'kod yok');
  const b = mem();
  const s = new Storage(b);
  assert.ok(!s.garageCars().some((c) => c.id === S.id), 'bulmayan oyuncuda garajda yok');
  assert.equal(s.buy(S.id), false, 'satın alınamaz');
  assert.equal(s.select(S.id), false, 'seçilemez');
  // Elle kayda yazılsa da geçit bulunmadıysa geçersiz
  const fake = sanitize({ owned: ['atmaca', S.id], selected: S.id });
  assert.ok(!fake.owned.includes(S.id) && fake.selected !== S.id, 'sahte kayıt kabul edilmez');
  assert.equal(s.unlockSecret(), true, 'ilk bulma');
  assert.equal(s.unlockSecret(), false, 'ikinci kez yeni değil');
  assert.ok(s.data.owned.includes(S.id));
  assert.ok(s.select(S.id), 'seçilebilir');
  const again = new Storage(b);
  assert.ok(again.data.secret && again.data.owned.includes(S.id), 'kalıcı');
  assert.equal(again.selectedCar().id, S.id);
  assert.ok(again.garageCars().some((c) => c.id === S.id), 'garajda');
  assert.equal(carById(S.id), S);
});

test('motosiklet: dar, çevik, hızlı; motor sesi çok güçlü ve farklı (derin, patlamalı)', () => {
  const S = CONFIG.secretCar;
  const others = CONFIG.cars;
  assert.ok(S.wid < Math.min(...others.filter((c) => c.shape !== 'moto').map((c) => c.wid)), 'dar');
  assert.ok(S.accel > Math.max(...others.map((c) => c.accel)), 'en yüksek ivme');
  assert.ok(S.maxSpeed > Math.max(...others.map((c) => c.maxSpeed)), 'en yüksek hız');
  assert.ok(S.turnRate > Math.max(...others.map((c) => c.turnRate)), 'çevik');
  const K = ENGINE_KINDS[S.engine.kind];
  assert.ok(K && K.pops, 'gaz bırakınca patlama');
  assert.ok(!others.some((c) => c.engine.kind === S.engine.kind), 'başka araçta yok');
  assert.ok(K.sub >= Math.max(...Object.values(ENGINE_KINDS).filter((k) => k !== K).map((k) => k.sub)), 'en derin gövde');
  assert.ok(S.engine.gain > Math.max(...others.map((c) => c.engine.gain)), 'en gür');
});

test('Play sürümünde gerçek kişi adı yok; arkadaş sürümü misafir yazısını ad ile gösterir', async () => {
  const play = fs.readFileSync('js/names.js', 'utf8');
  assert.ok(!play.includes('Ömer Yıldız'), 'Play isim dosyasında yok');
  for (const f of fs.readdirSync('js').filter((n) => n.endsWith('.js') && n !== 'app.file.js')) {
    assert.ok(!fs.readFileSync(`js/${f}`, 'utf8').includes('Ömer Yıldız'), `${f} içinde gerçek ad yok`);
  }
  const { namesSource } = await import('../tools/names.mjs');
  assert.ok((await namesSource('arkadas')).includes('Ömer Yıldız'), 'arkadaş sürümünde ad var');
  const { tx, setLang } = await import('../js/i18n/index.js');
  setLang('tr');
  assert.equal(tx('secret.guest', { name: 'Ömer Yıldız' }), "Artık Ömer Yıldız'ın da misafirisiniz");
  assert.equal(tx('secret.found'), 'Gizli bölümü buldun! Hoş geldin');
});

// --- STADYUMLAR ---
test('iki stadyum: ayrı ve uzak bölgelerde, Konya ~3 kat büyük, katı ve yıkılmaz; tank ezemez', () => {
  const g = game({ god: true });
  const st = g.world.zones().filter((z) => z.kind === 'stadium');
  assert.equal(st.length, 2);
  const [a, b] = st.sort((p, q) => p.w * p.h - q.w * q.h);
  const ratio = (b.w * b.h) / (a.w * a.h);
  assert.ok(ratio > 2.5 && ratio < 3.6, `Konya / Yozgat alan oranı ${ratio.toFixed(2)}`);
  const C = CONFIG.world.tile * CONFIG.world.chunkTiles;
  assert.ok(Math.hypot(a.x - b.x, a.y - b.y) / C >= 4.5, 'birbirinden uzak');
  // Konya yerleriyle çakışmaz: her biri kendi chunk'ında
  const marks = g.world.landmarkList();
  for (const id of ['yozgat', 'konyastad', 'gecit']) {
    const m = marks.find((k) => k.id === id);
    assert.ok(m, id);
    for (const o of marks) if (o !== m) assert.ok(Math.max(Math.abs(o.cx - m.cx), Math.abs(o.cy - m.cy)) >= 2, `${id} ile ${o.id} ayrı`);
  }
  for (const z of st) {
    const cx = Math.floor((z.x + 5) / C); const cy = Math.floor((z.y + 5) / C);
    const ch = g.world.chunk(cx, cy);
    const r = ch.rects.slice(0, ch.rectCount).find((k) => k.kind === 'stadium');
    assert.ok(r && r.sacred, 'katı ve korunan');
    assert.ok(g.world.blockedAt(z.x + z.w / 2, z.y + z.h / 2), 'içi geçilmez (yol bulma engel sayar)');
    // Tank ezemez
    const t = g.spawnCop('tank', 'chaser', z.x - 60, z.y + z.h / 2, 0);
    t.vx = 400; t.vy = 0;
    for (let i = 0; i < 30; i++) { t.x += 8; g.collideWorld(t, false); }
    assert.ok(r.alive, 'tank stadyumu yıkmadı');
    // Araba çarpar, çevresinde sürülür
    const p = g.player;
    p.x = z.x - 30; p.y = z.y + z.h / 2; p.a = 0; p.vx = 300; p.vy = 0;
    g.collideWorld(p, false);
    assert.ok(p.x < z.x, 'arabayı durdurur');
    assert.ok(!g.world.blockedAt(z.x - 30, z.y + z.h / 2), 'çevresi sürülebilir');
  }
});

test('stadyum adları isim tablosundan: Play sürümünde gerçek ad yok, arkadaş sürümünde gerçek ad', async () => {
  const { NAMES } = await import('../js/names.js');
  assert.equal(NAMES.stadyum.yozgat, 'BOZOK ŞEHİR STADYUMU');
  assert.equal(NAMES.stadyum.konya, 'SELÇUK ARENA');
  const { namesSource } = await import('../tools/names.mjs');
  const ark = await namesSource('arkadas');
  assert.ok(ark.includes('YOZGAT ŞEHİR STADYUMU') && ark.includes('KONYA BÜYÜKŞEHİR STADYUMU'));
  const src = fs.readFileSync('js/stadium.js', 'utf8');
  assert.ok(!/YOZGAT ŞEHİR|KONYA BÜYÜKŞEHİR/.test(src), 'çizim kodunda sabit gerçek ad yok');
});

test('korunan alanlar: barikat, tank mermisi ve doğma gizli geçidin önünü kapatmaz', () => {
  const g = game({ startTime: CONFIG.difficulty.tanksAt + 5, god: true });
  const z = g.world.zone('secret');
  g.player.x = z.x - 200; g.player.y = z.y - 200;
  assert.equal(g.pickRole(0.01), 'chaser', 'geçit yakınında yol kesen yok');
  // Tank mermisi hedefi geçitteyse atış yapılmaz
  const t = g.spawnCop('tank', 'chaser', z.x - 400, z.y, 0);
  t.fireT = 0;
  g.player.x = z.x + z.w / 2; g.player.y = z.y + z.h / 2; g.player.vx = 0; g.player.vy = 0;
  g.tankFire(t, 300, dt);
  assert.ok(!g.shots.some((s) => s.alive && g.world.protectedAt(s.x, s.y, 0, false)), 'geçide top düşmez');
});
