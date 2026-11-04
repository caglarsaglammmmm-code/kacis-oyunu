// Eski isim taraması: gerçek marka, kurum, model ve eski oyun adları kaynakta ve paketlerde kalmış mı?
// Kullanım: node tools/name-scan.mjs [ek klasör ...]   Bulgu varsa çıkış kodu 1 olur.
import fs from 'node:fs';
import path from 'node:path';

const OLD = [
  'tofa[sş]', 'do[gğ]an', '[sş]ahin', 'T10X', 'anadol', 'murat', 'egea', 'fiat', 'renault', 'clio', 'dacia', 'duster', 'opel', 'grandland', 'tog', 'togg',
  'bmw', 'audi', 'mercedes', 'benz', 'volkswagen', 'bavyera', 'megane', 'linea', 'hyundai', 'toyota', 'honda', 'kia', 'nissan', 'peugeot',
  'migros', 'b[iİ]m', '[sşŞ]ok', 'a101', 'carrefour(sa)?', 'ko[cç]ta[sş]', '[iİ]topya', 'czn', 'burak',
  'akbank', '[iİ][sş] bankas[ıi]', 'ziraat', 'garanti', 'yap[ıi] kredi',
  'nevada', 'sistem koleji?', 'natura', 'do[gğ]a [sş]ehir', 'penci', 'zorn', 'pencizorn', 'kackacabilirsen', 'ka[cç] ka[cç]abilirsen',
  'maydanoz', 'pera palas', 'grand bazaar', 'hac[ıi] baba', 'pavyon', 'gece kul[uü]b[uü]', 'neon bar', 'nargile', 'tekel', 'atat[uü]rk',
  'coca.?cola', 'pepsi', 'fanta', 'shell', 'opet', 'petrol ofisi', 'turkcell', 'vodafone', 't[uü]rk telekom', 'lcw', 'koton', 'defacto',
  'galatasaray', 'fenerbah[cç]e', 'be[sş]ikta[sş]', 'trabzonspor', 'trt', 'ibb', 'nike', 'adidas', 'ikea', 'starbucks', 'mcdonald', 'burger king', 'kfc', 'dominos', 'teknosa', 'boyner',
];
const RE = new RegExp(`(?<![\\p{L}\\p{N}_])(${OLD.join('|')})(?![\\p{L}\\p{N}_])`, 'giu');
// Bu dosyalar eski adları bilerek taşır ya da üçüncü taraf koddur
const SKIP = new Set(['tools/name-scan.mjs', 'tools/build-android.mjs', 'tools/play-clean.mjs', 'tools/flavor.mjs', 'android/app/build.gradle', 'android/app/src/main/assets/capacitor.config.json',
  // Atatürk anıtı: Gençliğe Hitabe ve imza bilerek her iki sürümde de yer alır (kullanıcı isteği)
  'js/memorial.js', 'js/app.file.js', 'sw.js', 'tools/memorial-test.mjs', 'tests/memorial.test.js']);
// names, flavors ve android/app/src/arkadas: gerçek isimli sürümün kaynağı, Play paketine girmez
const SKIP_DIR = /(^|\/)(names|flavors|arkadas|node_modules|\.git|\.gradle|build|e2e-out|vendor|fonts|dist|gradle|www|capacitor-cordova-android-plugins|public)(\/|$)/;
const TEXT = /\.(js|mjs|html|css|json|md|xml|gradle|properties|java|txt|pro|svg)$/i;
// Sahiplerinden gelen genel kelimeler: "Sistem" gibi sözlük sözcükleri değil, yalnızca eski ad olanlar listede
const ALLOW_LINE = /(capacitor|getcapacitor|androidx)/i;

const roots = ['.', ...process.argv.slice(2)];
const hits = [];
let scanned = 0;
function walk(dir, rootLabel) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const f = path.join(dir, e.name);
    const rel = path.relative('.', f).replaceAll('\\', '/');
    if (e.isDirectory()) { if (!SKIP_DIR.test(rel) || rootLabel !== '.') walk(f, rootLabel); continue; }
    if (!TEXT.test(e.name) || SKIP.has(rel) || e.name === 'package-lock.json') continue;
    const stat = fs.statSync(f);
    if (stat.size > 3e6) continue;
    scanned++;
    fs.readFileSync(f, 'utf8').split(/\r?\n/).forEach((line, i) => {
      if (ALLOW_LINE.test(line)) return;
      for (const m of line.matchAll(RE)) hits.push(`${rel}:${i + 1}  ${m[0]}`);
    });
  }
}
for (const r of roots) walk(r, r);
console.log(`${scanned} dosya, ${OLD.length} eski ad kalıbı tarandı. Bulgu: ${hits.length}`);
for (const h of hits.slice(0, 60)) console.log(' ', h);
process.exit(hits.length ? 1 : 0);
