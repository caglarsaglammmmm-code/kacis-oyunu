// Haritadaki bütün tabela yazılarını toplar (geniş bir alan, birkaç tohum): çeviri tablosunun eksiksizliği için
//   node tools/sign-list.mjs
import { World } from '../js/world.js';
export function collectSigns(seeds = [4, 7], R = 40) {
  const signs = new Set();
  for (const seed of seeds) {
    const w = new World(seed);
    for (let cy = -R; cy < R; cy++) {
      for (let cx = -R; cx < R; cx++) {
        const c = w.chunk(cx, cy);
        for (let i = 0; i < c.rectCount; i++) if (c.rects[i].sign) signs.add(c.rects[i].sign);
        if (c.siteName) signs.add(c.siteName);
      }
      for (const c of w.list.splice(0)) w.chunks.delete((c.cx + 32768) * 65536 + (c.cy + 32768));
      w.lastKey = -1;
    }
  }
  return [...signs].sort();
}
import { fileURLToPath } from 'node:url';
import path from 'node:path';
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) console.log(collectSigns().join('\n'));
