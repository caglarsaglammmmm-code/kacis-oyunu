// İsim tablosundan (names/tablo.mjs) seçilen sürümün js/names.js dosyasını üretir.
//   node tools/names.mjs            -> js/names.js (Play Store, uydurma)
//   node tools/names.mjs arkadas OUT -> OUT dosyasına gerçek isimli sürüm
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const FLAVORS = { play: 'uydurma', arkadas: 'gercek' };

export async function namesSource(flavor = 'play') {
  const column = FLAVORS[flavor];
  if (!column) throw new Error(`Bilinmeyen sürüm: ${flavor}`);
  const { TABLO } = await import(`${pathToFileURL(path.join(root, 'names', 'tablo.mjs')).href}?t=${Date.now()}`);
  const pick = (v) => {
    if (Array.isArray(v)) return v.map(pick);
    if (!v || typeof v !== 'object') return v;
    if ('gercek' in v && 'uydurma' in v) return v[column];
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, pick(x)]));
  };
  const data = pick(TABLO);
  return `// Üretilmiş dosya, elle düzenlemeyin. Kaynak: names/tablo.mjs (npm run names)\n`
    + `// Sürüm: ${flavor}\n`
    + `export const FLAVOR = '${flavor}';\n`
    + `export const NAMES = ${JSON.stringify(data, null, 1)};\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const flavor = process.argv[2] || 'play';
  const out = process.argv[3] || path.join(root, 'js', 'names.js');
  fs.writeFileSync(out, await namesSource(flavor));
  console.log(`${flavor} -> ${out}`);
}
