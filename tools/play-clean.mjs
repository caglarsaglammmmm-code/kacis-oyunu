// Play Store paketinde gerçek isim kalmadığını kanıtlar.
// İsim tablosunun gerçek sütunundaki her ad ve eski ad listesi (name-scan) verilen klasörlerde aranır.
// Klasör verilmezse Play sürümü geçici bir klasöre derlenip o taranır. Bulgu varsa çıkış kodu 1.
//   node tools/play-clean.mjs [klasör ...]
// Ayrıca --kontrol: arkadaş sürümünde gerçek adların gerçekten bulunduğunu da gösterir.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { gercekAdlar } from '../names/tablo.mjs';
import { buildWeb } from './flavor.mjs';

const words = gercekAdlar();
// Tek başına sözlük kelimesi olan adlar kelime sınırıyla aranır (ör. "ŞOK", "BİM")
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const RE = new RegExp(`(?<![\\p{L}\\p{N}])(${words.map(esc).join('|')})(?![\\p{L}\\p{N}])`, 'gu');
const extra = ['sistem koleji', 'akkanat', 'migros', 'penci', 'zorn', 'pencizorn', 'kackacabilirsen', 'togg', 'tofaş', 'gündoğdu', 'ted konya', 'kulesite'];
const RE2 = new RegExp(`(?<![\\p{L}\\p{N}])(${extra.map(esc).join('|')})(?![\\p{L}\\p{N}])`, 'giu');

function scan(dir) {
  const hits = [];
  let files = 0;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) { walk(f); continue; }
      if (!/\.(js|mjs|html|css|json|xml|txt|md|svg)$/i.test(e.name)) continue;
      files++;
      const text = fs.readFileSync(f, 'utf8');
      for (const re of [RE, RE2]) for (const m of text.matchAll(re)) hits.push(`${path.relative(dir, f)}: ${m[0]}`);
    }
  };
  walk(dir);
  return { hits, files };
}

const dirs = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!dirs.length) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'play-'));
  await buildWeb('play', tmp, { pages: true });
  dirs.push(tmp);
}
let total = 0;
for (const d of dirs) {
  const { hits, files } = scan(d);
  total += hits.length;
  console.log(`${d}: ${files} dosya, ${words.length + extra.length} gerçek ad arandı, bulgu ${hits.length}`);
  for (const h of hits.slice(0, 30)) console.log('  ', h);
}
if (process.argv.includes('--kontrol')) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ark-'));
  await buildWeb('arkadas', tmp, { pages: true });
  const { hits } = scan(tmp);
  console.log(`kontrol: arkadaş sürümünde ${hits.length} gerçek ad bulundu (sıfırdan büyük olmalı)`);
  if (!hits.length) total++;
}
process.exit(total ? 1 : 0);
