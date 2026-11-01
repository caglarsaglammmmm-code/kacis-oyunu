import { test } from 'node:test';
import assert from 'node:assert/strict';
import { GROUND } from '../js/config.js';
import { World, TILE, CT, CHUNK, PROP } from '../js/world.js';

test('aynı tohum aynı chunk, başka tohum başka chunk üretir', () => {
  const a = new World(7).chunk(12, -5);
  const b = new World(7).chunk(12, -5);
  assert.deepEqual([...a.ground], [...b.ground]);
  assert.equal(a.propCount, b.propCount);
  const worlds = [8, 9, 10, 11].map((s) => new World(s).chunk(12, -5));
  assert.ok(worlds.some((c) => c.ground.some((g, i) => g !== a.ground[i])));
});

test('ana yollar kesintisiz ve hiçbir yol karosu engelli değil (200 chunk)', () => {
  const w = new World(3);
  for (let cy = -50; cy < 50; cy += 7) {
    for (let cx = -50; cx < 50; cx += 5) {
      const c = w.chunk(cx, cy);
      for (let i = 0; i < CT; i++) {
        for (let k = 0; k < 5; k++) {
          assert.equal(c.ground[k * CT + i], GROUND.ROAD);
          assert.equal(c.ground[i * CT + k], GROUND.ROAD);
        }
      }
      for (let i = 0; i < CT * CT; i++) {
        if (c.ground[i] === GROUND.ROAD) assert.ok(c.cost[i] > 0, `chunk ${cx},${cy} karo ${i}`);
      }
    }
  }
});

test('çıkmaz yok: 9x9 chunk içindeki her geçilebilir karo merkezden ulaşılabilir', () => {
  for (const seed of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
    const w = new World(seed);
    const n = 13 * CT;
    const cost = new Uint8Array(n * n);
    const ox = (seed * 9 - 6) * CT; // Farklı biyomlara denk gelsin
    w.fillCost(cost, ox, ox, n);
    const seen = new Uint8Array(n * n);
    const stack = [2 * n + 2];
    seen[stack[0]] = 1;
    while (stack.length) {
      const i = stack.pop();
      const x = i % n;
      const y = (i - x) / n;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= n || ny >= n) continue;
        const j = ny * n + nx;
        if (!seen[j] && cost[j]) { seen[j] = 1; stack.push(j); }
      }
    }
    let lost = 0;
    let total = 0;
    for (let i = 0; i < n * n; i++) {
      if (cost[i]) { total++; if (!seen[i]) lost++; }
    }
    assert.equal(lost, 0, `tohum ${seed}: ${lost}/${total} karo kopuk`);
  }
});

test('her sokak yol parçası iki uçlu: iç sokak ana yola bağlanır', () => {
  const w = new World(5);
  let streets = 0;
  for (let cy = -10; cy < 10; cy++) {
    for (let cx = -10; cx < 10; cx++) {
      const c = w.chunk(cx, cy);
      for (let i = 0; i < c.streetCount; i++) {
        const s = c.streets[i];
        streets++;
        const near = s.vertical ? c.cost[5 * CT + s.pos] : c.cost[s.pos * CT + 5];
        const far = s.vertical ? c.cost[(CT - 1) * CT + s.pos] : c.cost[s.pos * CT + CT - 1];
        assert.ok(near > 0 && far > 0);
        assert.ok(s.width >= 3, 'araç geçecek genişlikte');
      }
    }
  }
  assert.ok(streets > 100);
});

test('tüm çeşitler üretilir: bina, duvar, su, ağaç, çit, park araba, bariyer, kutu', () => {
  const w = new World(11);
  const rects = new Set();
  const props = new Set();
  const templates = new Set();
  const biomes = new Set();
  for (let cy = -90; cy < 90; cy += 3) {
    for (let cx = -90; cx < 90; cx += 3) {
      const c = w.chunk(cx, cy);
      biomes.add(c.biome);
      templates.add(c.template);
      for (let i = 0; i < c.rectCount; i++) rects.add(c.rects[i].kind);
      for (let i = 0; i < c.propCount; i++) props.add(c.props[i].kind);
    }
  }
  for (const r of ['building', 'wall', 'water']) assert.ok(rects.has(r), r);
  for (const p of ['TREE', 'FENCE', 'CRATE', 'BARREL', 'CONE', 'BARRIER', 'PARKED', 'COIN']) assert.ok(props.has(PROP[p]), p);
  assert.ok(templates.size >= 11, [...templates].join());
  for (const b of ['city', 'beach', 'forest', 'desert', 'rural']) assert.ok(biomes.has(b), b);
  assert.ok(rects.has('sea'));
  for (const p of ['PALM', 'UMBRELLA', 'PINE', 'ROCK', 'CACTUS', 'HAY', 'POWER_BLAST', 'POWER_GHOST', 'POWER_HEAL', 'POWER_GIANT']) assert.ok(props.has(PROP[p]), p);
});

test('güncelleme uzak chunkları siler, sayı sınırlı kalır', () => {
  const w = new World(1);
  for (let i = 0; i < 4000; i++) w.update(i * 30, i * 12);
  assert.ok(w.chunks.size <= 100, `chunk sayısı ${w.chunks.size}`);
  assert.equal(w.list.length, w.chunks.size);
  assert.ok(w.free.length < 100, 'havuz sınırlı');
});

test('binaya çarpma ve ezme', () => {
  const w = new World(2);
  let c;
  let r;
  for (let i = 0; !r; i++) {
    c = w.chunk(i, 3);
    for (let k = 0; k < c.rectCount; k++) if (c.rects[k].kind === 'building') r = c.rects[k];
  }
  const out = {};
  assert.ok(w.circleHit(r.x + 5, r.y + 5, 12, out));
  assert.equal(out.rect, r);
  w.crush(c, r);
  assert.ok(!w.circleHit(r.x + r.w / 2, r.y + r.h / 2, 12, out) || out.rect !== r);
  assert.ok(!w.blockedAt(r.x + r.w / 2, r.y + r.h / 2));
  assert.ok(c.dirty);
});

test('silinen chunk geri gelince kırılan, toplanan ve yıkılan aynı kalır', () => {
  const w = new World(9);
  const c = w.chunk(5, 5);
  const before = c.propCount;
  c.props[0].alive = false;
  let idx = -1;
  for (let i = 0; i < c.rectCount; i++) if (c.rects[i].kind === 'building') { idx = i; break; }
  const r = c.rects[idx];
  const mid = [r.x + r.w / 2, r.y + r.h / 2];
  w.crush(c, r);
  w.addProp(c, PROP.COIN, c.x + 50, c.y + 50);
  for (let i = 0; i < 60; i++) w.update(100000, 100000); // Uzaklaş, chunk silinsin
  assert.ok(!w.chunks.has((5 + 32768) * 65536 + (5 + 32768)));
  const back = w.chunk(5, 5);
  assert.equal(back.props[0].alive, false);
  assert.equal(back.rects[idx].alive, false);
  assert.ok(!w.blockedAt(mid[0], mid[1]));
  assert.equal(back.propCount, before + 1, 'düşen coin duruyor');
  assert.equal(back.props[back.propCount - 1].kind, PROP.COIN);
});

test('sahile gidilebilir: kum ve sığ suya araba girer, derin deniz kapalı', () => {
  const w = new World(3);
  let seen = 0;
  for (let cy = -60; cy < 60 && seen < 3; cy++) {
    for (let cx = -60; cx < 60 && seen < 3; cx++) {
      const c = w.chunk(cx, cy);
      if (c.template !== 'sea') continue;
      seen++;
      for (let i = 0; i < CT * CT; i++) {
        if (c.ground[i] === GROUND.SAND || c.ground[i] === GROUND.SHALLOW) assert.ok(c.cost[i] > 0);
        if (c.ground[i] === GROUND.WATER) assert.equal(c.cost[i], 0);
      }
    }
  }
  assert.ok(seen > 0, 'deniz bulunamadı');
});

test('negatif koordinatlarda sorgular doğru', () => {
  const w = new World(1);
  assert.equal(w.groundAt(-CHUNK + 10, -CHUNK + 10), GROUND.ROAD);
  assert.equal(w.groundAt(-1, 20), w.chunk(-1, 0).ground[0 * CT + CT - 1]);
  assert.ok(TILE > 0);
});
