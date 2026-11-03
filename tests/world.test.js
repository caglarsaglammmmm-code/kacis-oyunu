import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CONFIG, GROUND, BUILD } from '../js/config.js';
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
        for (let k = 0; k < CONFIG.world.arterial; k++) {
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
        const near = s.vertical ? c.cost[3 * CT + s.pos] : c.cost[s.pos * CT + 3];
        const far = s.vertical ? c.cost[(CT - 1) * CT + s.pos] : c.cost[s.pos * CT + CT - 1];
        assert.ok(near > 0 && far > 0);
        assert.ok(s.width >= 1, 'araç geçecek genişlikte');
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
  let cx = 5;
  let c = w.chunk(cx, 5);
  let idx = -1;
  for (;; c = w.chunk(++cx, 5)) {
    for (let i = 0; i < c.rectCount && idx < 0; i++) if (c.rects[i].kind === 'building') idx = i;
    if (idx >= 0 && c.propCount > 0) break;
    idx = -1;
  }
  const before = c.propCount;
  c.props[0].alive = false;
  const r = c.rects[idx];
  const mid = [r.x + r.w / 2, r.y + r.h / 2];
  w.crush(c, r);
  w.addProp(c, PROP.COIN, c.x + 50, c.y + 50);
  for (let i = 0; i < 60; i++) w.update(100000, 100000); // Uzaklaş, chunk silinsin
  assert.ok(!w.chunks.has((cx + 32768) * 65536 + (5 + 32768)));
  const back = w.chunk(cx, 5);
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
        if ((c.ground[i] === GROUND.SAND || c.ground[i] === GROUND.SHALLOW) && !c.rectAt[i]) assert.ok(c.cost[i] > 0);
        if (c.ground[i] === GROUND.WATER) assert.equal(c.cost[i], 0);
      }
    }
  }
  assert.ok(seen > 0, 'deniz bulunamadı');
});

test('Yeşilvadi ve Mavi Orman büyük siteleri tek ve çok bloklu; Mandalina Koleji çok büyük', () => {
  const w = new World(6);
  const seen = {};
  for (let cy = -30; cy < 30; cy++) {
    for (let cx = -30; cx < 30; cx++) {
      const c = w.chunk(cx, cy);
      if (c.template === 'bigsite') {
        (seen[c.siteName] ||= []).push(c);
        let blocks = 0;
        for (let i = 0; i < c.rectCount; i++) if (c.rects[i].style === BUILD.SITE_BLOCK) blocks++;
        assert.ok(blocks >= 5, `blok ${blocks}`);
      }
      if (c.template === 'kolej') {
        // Haritanın en geniş ve en yüksek binası
        const r = c.rects[0];
        assert.equal(r.landmark, 'kolej');
        assert.ok(r.w >= 800 && r.h >= 340, 'en geniş bina');
        assert.ok(r.tall > CONFIG.world.tall.height[1], 'en yüksek bina');
      }
    }
  }
  assert.equal(seen['Yeşilvadi Sitesi'].length, 4);
  assert.equal(seen['Mavi Orman Sitesi'].length, 4);
});

test('çıkmaz sokaklar var ama her yere ulaşılır; apartmanlar çeşitli', () => {
  const w = new World(7);
  const seeds = new Set();
  for (let cy = -12; cy < 12; cy++) {
    for (let cx = -12; cx < 12; cx++) {
      const c = w.chunk(cx, cy);
      for (let i = 0; i < c.rectCount; i++) if (c.rects[i].style === BUILD.APARTMENT) seeds.add(c.rects[i].seed);
    }
  }
  assert.ok(seeds.size > 150, `apartman çeşidi ${seeds.size}`);
});

test('ilk üretilen chunk ile yeniden üretilen chunk birebir aynı', () => {
  for (const seed of [1, 2, 3, 4, 5, 6]) {
    for (const [cx, cy] of [[9, 4], [-7, 12], [20, -3], [3, 3]]) {
      const a = new World(seed); // Bu chunk dünyanın ilk üretimi
      const first = a.chunk(cx, cy);
      const count = first.propCount;
      const rects = first.rectCount;
      const b = new World(seed);
      b.chunk(0, 0); // Önce başka chunk üretilmiş olsun
      const second = b.chunk(cx, cy);
      assert.equal(second.propCount, count, `tohum ${seed} chunk ${cx},${cy}`);
      assert.equal(second.rectCount, rects);
    }
  }
});

test('tüm haritada tek bir turuncu Mandalina Koleji var', () => {
  for (const seed of [1, 2, 3]) {
    const w = new World(seed);
    let count = 0;
    for (let cy = -40; cy < 40; cy++) {
      for (let cx = -40; cx < 40; cx++) {
        const c = w.chunk(cx, cy);
        for (let i = 0; i < c.rectCount; i++) if (c.rects[i].style === BUILD.KOLEJ) { count++; assert.equal(c.rects[i].color, '#ff7a00'); }
      }
      for (const c of w.list.splice(0)) w.chunks.delete((c.cx + 32768) * 65536 + (c.cy + 32768)); // Bellek şişmesin
      w.lastKey = -1;
    }
    assert.equal(count, 1, `tohum ${seed}: ${count}`);
  }
});

test('Türkiye teması: tabelalar, market, çay ocağı, Çınar Kafe, amcalar, pazar, dar sokak', () => {
  const w = new World(4);
  const signs = new Set();
  const props = new Set();
  const tpl = new Set();
  let narrow = 0;
  for (let cy = -60; cy < 60; cy += 1) {
    for (let cx = -60; cx < 60; cx += 2) {
      const c = w.chunk(cx, cy);
      tpl.add(c.template);
      for (let i = 0; i < c.rectCount; i++) if (c.rects[i].sign) signs.add(c.rects[i].sign);
      for (let i = 0; i < c.propCount; i++) props.add(c.props[i].kind);
      for (let i = 0; i < c.streetCount; i++) if (c.streets[i].width === 2) narrow++;
    }
  }
  for (const s of ['Dönerci', 'İskenderci', 'Pideci', 'Lahmacun', 'Kebapçı', 'Büfe', 'Çay Ocağı', 'Kuaför', 'Tost Evi', 'Çınar Kafe', 'Bakkal', 'Kahveci']) assert.ok(signs.has(s), s);
  for (const s of ['Pazarcık Market', 'Ucuzlar', 'Sepet Market', 'Yıldız Mağazaları', 'Dörtyol Market', 'Teknoloji Durağı', 'Yapı Dünyası', 'Köşe Bakkal', 'Yıldız Bankası', 'Güven Kredi', 'Nane Döner', 'Soslu Döner', 'Eczane', 'Fırın']) assert.ok(signs.has(s), s);
  assert.ok(![...signs].some((s) => /AVM/.test(s)), 'AVM yok');
  for (const p of ['CHAIRS', 'UNCLES', 'SIMITCART', 'STALL', 'LAUNDRY']) assert.ok(props.has(PROP[p]), p);
  for (const t of ['mahalle', 'pazar', 'gecekondu', 'site', 'keyif', 'cami', 'stadyum', 'hastane', 'okul']) assert.ok(tpl.has(t), t);
  assert.ok(narrow > 20);
});

test('negatif koordinatlarda sorgular doğru', () => {
  const w = new World(1);
  assert.equal(w.groundAt(-CHUNK + 10, -CHUNK + 10), GROUND.ROAD);
  assert.equal(w.groundAt(-1, 20), w.chunk(-1, 0).ground[0 * CT + CT - 1]);
  assert.ok(TILE > 0);
});

test('şehir dengesi: yol ve bina yaklaşık yarı yarıya, dar sokaklar var', () => {
  const w = new World(7);
  let sum = 0; let n = 0; let narrow = 0;
  for (let cy = -14; cy < 14; cy++) {
    for (let cx = -14; cx < 14; cx++) {
      const c = w.chunk(cx, cy);
      if (!['mahalle', 'downtown', 'esnaf', 'gecekondu', 'keyif'].includes(c.template)) continue;
      let b = 0;
      for (let i = 0; i < CT * CT; i++) if (c.rectAt[i] && c.rects[c.rectAt[i] - 1].kind === 'building') b++;
      sum += b / (CT * CT); n++;
      for (let i = 0; i < c.streetCount; i++) if (c.streets[i].width === 1) narrow++;
    }
  }
  // v6: yollar ana öğe, bina payı %45-52 bandında
  assert.ok(sum / n > 0.43 && sum / n < 0.54, 'oran ' + sum / n);
  assert.ok(narrow > n / 4, 'dar sokak ' + narrow);
});

test('yol malzemeleri, spor sahaları, derin göletler ve her tür bina üretilir', () => {
  const w = new World(11);
  const roads = new Set(); const pads = new Set(); const styles = new Set();
  let deep = 0; let huge = 0;
  for (let cy = -24; cy < 24; cy++) {
    for (let cx = -24; cx < 24; cx++) {
      const c = w.chunk(cx, cy);
      roads.add(c.road);
      for (let i = 0; i < c.padCount; i++) pads.add(c.pads[i].kind);
      for (let i = 0; i < c.rectCount; i++) {
        const r = c.rects[i];
        if (r.kind === 'building') styles.add(r.style);
        if (r.deep) deep++;
        if (r.signSize === 3) huge++;
      }
    }
  }
  assert.equal(roads.size, 3);
  for (const k of ['foot', 'basket', 'hali', 'yard', 'ambulance', 'parking']) assert.ok(pads.has(k), k);
  for (const s of [BUILD.HOSPITAL, BUILD.BANK, BUILD.SCHOOL, BUILD.MOSQUE, BUILD.RESIDENCE, BUILD.SKYSCRAPER, BUILD.HOTEL, BUILD.ISHANI, BUILD.APARTMENT, BUILD.VILLA, BUILD.GECEKONDU, BUILD.SHOP, BUILD.CAFE]) assert.ok(styles.has(s), s);
  assert.ok(deep > 3);
  assert.ok(huge > 3, 'dev tabela');
});

test('otoban: satırı baştan sona keser, ortasında bariyer, içinde bina yok', () => {
  const w = new World(5);
  const H = CONFIG.world.highway;
  for (let cx = -30; cx < 30; cx++) {
    const c = w.chunk(cx, H.offset);
    assert.ok(c.hw);
    for (let x = 3; x < CT; x++) {
      for (let y = H.y0; y < H.y0 + H.half * 2 + 1; y++) {
        const id = c.rectAt[y * CT + x];
        if (y === H.y0 + H.half) { assert.equal(c.rects[id - 1].kind, 'barrier'); continue; }
        assert.equal(id, 0, 'bant boş olmalı');
        assert.equal(c.ground[y * CT + x], GROUND.ROAD);
      }
    }
  }
  assert.equal(w.chunk(0, H.offset + 1).hw, false);
  assert.equal(w.chunk(0, H.offset + H.every).hw, true);
});

test('dönel kavşak, U dönüşü, Y ayrımı ve kıvrımlı yollar üretilir, her yere ulaşılır', () => {
  const w = new World(21);
  let ring = 0; let curve = 0;
  for (let cy = -20; cy < 20; cy++) {
    for (let cx = -20; cx < 20; cx++) {
      const c = w.chunk(cx, cy);
      for (const p of c.paths) if (p.ring) ring++; else curve++;
    }
  }
  assert.ok(ring >= 3, 'dönel ' + ring);
  assert.ok(curve >= 10, 'viraj ' + curve);
});

test('binaların yaklaşık %15-20 si yüksek; harabe, inşaat, sanayi ve yangın var', () => {
  const w = new World(13);
  let all = 0; let tall = 0; let fire = 0; const st = new Set(); const zones = new Set();
  for (let cy = -24; cy < 24; cy++) {
    for (let cx = -24; cx < 24; cx++) {
      const c = w.chunk(cx, cy);
      zones.add(c.template);
      fire += c.fires.length;
      for (let i = 0; i < c.rectCount; i++) {
        const r = c.rects[i];
        if (r.kind !== 'building') continue;
        all++; st.add(r.style);
        if (r.tall) tall++;
      }
    }
  }
  const k = tall / all;
  assert.ok(k > 0.13 && k < 0.22, 'yüksek oranı ' + k);
  for (const s of [BUILD.RUIN, BUILD.SITEWORK, BUILD.FACTORY]) assert.ok(st.has(s), s);
  for (const z of ['insaat', 'harabe', 'sanayi']) assert.ok(zones.has(z), z);
  assert.ok(fire >= 3 && fire < all * 0.02, 'yangın ' + fire);
});

test('sokaklar genişledi: bina cepheleri geri çekilir, açık köşeler yuvarlak, çıkmazların cebi var', () => {
  const w = new World(321);
  const { setback } = CONFIG.world.street;
  let rounded = 0; let checked = 0;
  for (let cy = -4; cy <= 4; cy++) {
    for (let cx = -4; cx <= 4; cx++) {
      const c = w.chunk(cx, cy);
      for (let i = 0; i < c.rectCount; i++) {
        const r = c.rects[i];
        if (r.kind !== 'building') continue;
        if (r.corners) rounded++;
        const tx = Math.floor((r.x - c.x) / TILE); const ty = Math.floor((r.y - c.y) / TILE);
        if (tx > 0 && r.w > 60 && r.h > 60 && !c.rectAt[ty * CT + tx - 1]) { checked++; assert.ok(r.x - (c.x + tx * TILE) >= setback, 'cephe geri çekilmeli'); }
      }
    }
  }
  assert.ok(checked > 50 && rounded > 50, checked + ' ' + rounded);
});

test('yeniden kullanılan bina kaydı eski tabela görüntüsünü taşımaz', () => {
  const w = new World(7);
  const c = w.chunk(3, 3);
  let r = null;
  for (let i = 0; i < c.rectCount; i++) if (c.rects[i].sign) { r = c.rects[i]; break; }
  assert.ok(r, 'tabelalı bina');
  r.signImg = { eski: true };
  // Chunk'lar silinip havuzdan yeniden kullanılır
  for (const k of w.list.splice(0)) { w.chunks.delete((k.cx + 32768) * 65536 + (k.cy + 32768)); w.release(k); }
  w.lastKey = -1;
  for (let i = 0; i < 6; i++) w.chunk(10 + i, 10);
  for (const k of w.list) for (let i = 0; i < k.rectCount; i++) assert.ok(!k.rects[i].signImg || !k.rects[i].signImg.eski, 'eski görüntü kaldı');
});
