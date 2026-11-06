// İki sürümün web dosyalarını hazırlar. Aynı kod, farklı isim tablosu sütunu ve kimlik.
//   play    : Drift Lab, Play Store, uydurma isimler (varsayılan)
//   arkadas : arkadaşlara APK ve Pages kökü, gerçek isimler. Uygulama adı ve ikonu Play ile aynı: Drift Lab
// node tools/flavor.mjs <play|arkadas> <çıktı klasörü> [--pages]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { namesSource } from './names.mjs';
import { transformSync } from 'esbuild';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'https://github.com/caglarsaglammmmm-code/kacis-oyunu/releases';

export const FLAVOR_INFO = {
  play: { app: 'Drift Lab', cache: 'drift-lab', apk: 'DriftLab-PlayStore.apk' },
  // Önbellek adı eski kurulumlar için korunur, görünen ad Drift Lab
  arkadas: { app: 'Drift Lab', cache: 'penci-zorn', apk: 'DriftLab-Arkadas.apk', apkUrl: `${REPO}/latest/download/DriftLab-Arkadas.apk` },
};

// Play Store paketi: kaynak yorumları (geliştirme notları) çıkarılır. Kod aynı kalır, yalnız boşluk ve yorum silinir
function stripComments(dir) {
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) { walk(f); continue; }
      const ext = path.extname(e.name);
      if (ext !== '.js' && ext !== '.css' && ext !== '.html') continue;
      const src = fs.readFileSync(f, 'utf8');
      let outSrc;
      if (ext === '.html') outSrc = src.replace(/<!--[\s\S]*?-->/g, '');
      else outSrc = transformSync(src, { loader: ext.slice(1), minifyWhitespace: true, legalComments: 'none', charset: 'utf8', ...(ext === '.js' ? { format: path.basename(f) === 'sw.js' ? undefined : 'esm', target: 'es2022' } : {}) }).code;
      fs.writeFileSync(f, outSrc);
    }
  };
  walk(dir);
}

export async function buildWeb(flavor, out, { pages = false } = {}) {
  const info = FLAVOR_INFO[flavor];
  if (!info) throw new Error(`Bilinmeyen sürüm: ${flavor}`);
  fs.rmSync(out, { recursive: true, force: true });
  // Anıt fotoğrafları yalnız arkadaş sürümüne girer. Play Store sürümünde gerçek kişi fotoğrafı yoktur
  const entries = ['index.html', 'privacy.html', 'css', 'fonts', 'icons', 'js', 'assets'];
  if (flavor === 'arkadas') entries.push('gorseller/ataturk');
  for (const entry of entries) {
    fs.cpSync(path.join(root, entry), path.join(out, entry), {
      recursive: true,
      // Play Store paketinde yazı tiplerinin OFL lisans metinleri de taşınır (fonts/OFL-*.txt)
      filter: (source) => !source.endsWith('app.file.js') && (!source.endsWith('.txt') || (flavor === 'play' && /[\\/]fonts[\\/]OFL-[^\\/]+\.txt$/.test(source))),
    });
  }
  fs.writeFileSync(path.join(out, 'js', 'names.js'), await namesSource(flavor));
  // Anıt içeriği: arkadaş sürümünde gerçek (names/anit-gercek.js), Play Store sürümünde kurgusal (js/memorial-data.js)
  if (flavor === 'arkadas') fs.copyFileSync(path.join(root, 'names', 'anit-gercek.js'), path.join(out, 'js', 'memorial-data.js'));
  let html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
  if (flavor !== 'play') {
    html = html.replace(/href="https:\/\/github\.com\/[^"]*\.apk"/, `href="${info.apkUrl}"`);
  }
  if (pages) {
    let sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8').replace(/'drift-lab-v/, `'${info.cache}-v`);
    if (flavor !== 'arkadas') sw = sw.replace(/^ *'gorseller\/ataturk\/[^']*',\r?\n/gm, '');
    fs.writeFileSync(path.join(out, 'sw.js'), sw);
    // Ad ve ikonlar iki sürümde aynı manifestten gelir
    fs.copyFileSync(path.join(root, 'manifest.json'), path.join(out, 'manifest.json'));
  } else {
    // APK dosyaları içinde taşır: manifest ve service worker gerekmez
    html = html.replace(/<link rel="manifest"[^>]*>\r?\n/, '');
    if (flavor === 'play') {
      // Play Store paketi (AAB/APK): uygulamada APK indirme düğmesi gizlidir; paket dışı indirme bağlantısı
      // ve GitHub hesap adresi pakete girmez (Play politikası: güncelleme yalnız Play üzerinden)
      html = html.replace(/href="https:\/\/github\.com\/[^"]*\.apk"/, 'href="#"');
      const cfgFile = path.join(out, 'js', 'config.js');
      const cfg = fs.readFileSync(cfgFile, 'utf8');
      const cfg2 = cfg.replace(/'https:\/\/github\.com\/[^']*\.apk'/, "''");
      if (cfg2 === cfg) throw new Error('config.js: APK adresi bulunamadı');
      fs.writeFileSync(cfgFile, cfg2);
      const pv = path.join(out, 'privacy.html');
      fs.writeFileSync(pv, fs.readFileSync(pv, 'utf8').replace(/<a href="https:\/\/github\.com\/[^"]*">([^<]*)<\/a>/g, '$1'));
    }
  }
  fs.writeFileSync(path.join(out, 'index.html'), html);
  if (flavor === 'play') stripComments(out);
  return out;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [flavor = 'play', out = path.join(root, 'www')] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  await buildWeb(flavor, path.resolve(out), { pages: process.argv.includes('--pages') });
  console.log(`${flavor} -> ${out}`);
}
