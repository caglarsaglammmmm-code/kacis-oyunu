// İki sürümün web dosyalarını hazırlar. Aynı kod, farklı isim tablosu sütunu ve kimlik.
//   play    : Drift Lab, Play Store, uydurma isimler (varsayılan)
//   arkadas : arkadaşlara APK ve Pages kökü, gerçek isimler. Uygulama adı ve ikonu Play ile aynı: Drift Lab
// node tools/flavor.mjs <play|arkadas> <çıktı klasörü> [--pages]
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { namesSource } from './names.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'https://github.com/caglarsaglammmmm-code/kacis-oyunu/releases';

export const FLAVOR_INFO = {
  play: { app: 'Drift Lab', cache: 'drift-lab', apk: 'DriftLab-PlayStore.apk' },
  // Önbellek adı eski kurulumlar için korunur, görünen ad Drift Lab
  arkadas: { app: 'Drift Lab', cache: 'penci-zorn', apk: 'DriftLab-Arkadas.apk', apkUrl: `${REPO}/latest/download/DriftLab-Arkadas.apk` },
};

export async function buildWeb(flavor, out, { pages = false } = {}) {
  const info = FLAVOR_INFO[flavor];
  if (!info) throw new Error(`Bilinmeyen sürüm: ${flavor}`);
  fs.rmSync(out, { recursive: true, force: true });
  for (const entry of ['index.html', 'privacy.html', 'css', 'fonts', 'icons', 'js', 'assets']) {
    fs.cpSync(path.join(root, entry), path.join(out, entry), {
      recursive: true,
      filter: (source) => !source.endsWith('app.file.js') && !source.endsWith('.txt'),
    });
  }
  fs.writeFileSync(path.join(out, 'js', 'names.js'), await namesSource(flavor));
  let html = fs.readFileSync(path.join(out, 'index.html'), 'utf8');
  if (flavor !== 'play') {
    html = html.replace(/href="https:\/\/github\.com\/[^"]*\.apk"/, `href="${info.apkUrl}"`);
  }
  if (pages) {
    const sw = fs.readFileSync(path.join(root, 'sw.js'), 'utf8').replace(/'drift-lab-v/, `'${info.cache}-v`);
    fs.writeFileSync(path.join(out, 'sw.js'), sw);
    // Ad ve ikonlar iki sürümde aynı manifestten gelir
    fs.copyFileSync(path.join(root, 'manifest.json'), path.join(out, 'manifest.json'));
  } else {
    // APK dosyaları içinde taşır: manifest ve service worker gerekmez
    html = html.replace(/<link rel="manifest"[^>]*>\r?\n/, '');
  }
  fs.writeFileSync(path.join(out, 'index.html'), html);
  return out;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [flavor = 'play', out = path.join(root, 'www')] = process.argv.slice(2).filter((a) => !a.startsWith('--'));
  await buildWeb(flavor, path.resolve(out), { pages: process.argv.includes('--pages') });
  console.log(`${flavor} -> ${out}`);
}
