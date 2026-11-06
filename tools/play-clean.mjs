// Play Store paketinde gerçek marka, kişi, kurum ve yer adı kalmadığını kanıtlar.
// Aranan: isim tablosunun gerçek sütunu (names/tablo.mjs) + aşağıdaki geniş yasaklı liste (markalar, kişiler,
// kurumlar, kulüpler, şehir ve semtler, anıt metni). Büyük/küçük harf ve Türkçe I/ı farkı gözetmeden, kelime sınırıyla.
//   node tools/play-clean.mjs [klasör ...]          klasör yoksa Play web sürümü geçici klasöre derlenip taranır
//   node tools/play-clean.mjs --apk dist/X.apk      APK/AAB açılır: içindeki metin dosyaları ve ikili dosyalar (dex, arsc) taranır
//   --kontrol: arkadaş sürümünde gerçek adların gerçekten bulunduğunu da gösterir (tarayıcının çalıştığının kanıtı)
// Bulgu varsa çıkış kodu 1.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { gercekAdlar } from '../names/tablo.mjs';
import { buildWeb } from './flavor.mjs';

// Gerçek adlar: marka, kişi, kurum, kulüp, stadyum, şehir/semt, anıt metni. Genel sözlük kelimeleri (yıldız, kredi,
// bereket, Anadolu, Marmara gibi bölge adları, "Türk") listede yoktur: bunlar tek bir kuruluşun adı değildir.
export const YASAKLI = [
  // Kişiler ve anıt
  'atatürk', 'ataturk', 'mustafa kemal', 'gazi mustafa', 'gençliğe hitabe', 'hitabe', 'ne mutlu türküm', 'ey türk gençliği', 'ömer yıldız', 'şerife akkanat', 'akkanat',
  // Okul ve kurumlar
  'sistem koleji', 'ted konya', 'ted koleji', 'gündoğdu', 'selçuklu', 'selçuk arena', 'büyükşehir', 'belediyesi',
  // Kulüp ve stadyumlar
  'yozgatspor', 'konyaspor', 'bozokspor', 'bozok', 'galatasaray', 'fenerbahçe', 'beşiktaş', 'trabzonspor', 'başakşehir', 'ankaragücü',
  // Şehirler, semtler, tarihi yerler
  'konya', 'yozgat', 'istanbul', 'ankara', 'izmir', 'bursa', 'edirne', 'izmit', 'gebze', 'çorlu', 'bolu', 'adana', 'urfa', 'antep', 'kadıköy', 'taksim', 'üsküdar', 'şişli', 'sarıyer', 'fatih', 'bakırköy', 'karadeniz', 'mevlana', 'alaaddin', 'kültürpark', 'meram', 'bedesten',
  // Market, mağaza, banka
  'migros', 'bim', 'şok', 'a101', 'carrefour', 'carrefoursa', 'itopya', 'koçtaş', 'teknosa', 'boyner', 'lcw', 'koton', 'defacto', 'ikea',
  'akbank', 'iş bankası', 'ziraat', 'garanti', 'yapı kredi', 'vakıfbank', 'halkbank', 'anadolubank', 'denizbank',
  // Araç, lastik, yakıt
  'tofaş', 'togg', 'fiat', 'egea', 'renault', 'clio', 'dacia', 'duster', 'opel', 'grandland', 'anadol', 'murat 131', 'bmw', 'mercedes', 'audi', 'volkswagen', 'toyota', 'honda', 'hyundai', 'ford', 'peugeot', 'nissan',
  'michelin', 'pirelli', 'bridgestone', 'goodyear', 'lassa', 'petlas', 'shell', 'opet', 'petrol ofisi', 'aytemiz',
  // Telefon, içecek, yiyecek, yemek zinciri
  'turkcell', 'vodafone', 'türk telekom', 'coca-cola', 'coca cola', 'pepsi', 'fanta', 'ülker', 'starbucks', 'mcdonald', 'burger king', 'kfc', 'domino', 'iskender', 'maydanoz',
  // Diğer gerçek ad ve eski oyun adları
  'pera palas', 'grand bazaar', 'natura park', 'doğa şehir', 'penci', 'zorn', 'pencizorn', 'kackacabilirsen', 'kaç kaçabilirsen',
];

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Türkçe küçük harf: İ->i, I->ı. Kaynaktaki ASCII "I" için ayrıca standart küçük harf de denenir
const low = (s) => s.toLocaleLowerCase('tr');
const fold = (s) => s.replace(/ı/g, 'i').replace(/i̇/g, 'i');
function matcher(words) {
  const list = [...new Set(words.map((w) => fold(low(w))))].filter(Boolean);
  return new RegExp(`(?<![\\p{L}\\p{N}_])(${list.map(esc).join('|')})(?![\\p{L}\\p{N}_])`, 'gu');
}
const words = [...gercekAdlar(), ...YASAKLI];
const RE = matcher(words);
const TEXT = /\.(js|mjs|html|css|json|xml|txt|md|svg|webmanifest|properties)$/i;
const MEDIA = /\.(png|jpe?g|webp|gif|mp3|ogg|wav|m4a|woff2?|ttf|otf)$/i;

// Yapımcı adı yalnız ana menünün altındaki yapımcı satırında (i18n menu.maker) bulunabilir (kullanıcı isteği)
// Kural: adın hemen önünde, aynı tırnak içinde "maker:" anahtarı olmalı (ör. maker: 'Made by …' ya da maker:"制作：…")
const MAKER_OK = (t, i) => /maker\s*:\s*['"`][^'"`\n]{0,30}$/.test(t.slice(Math.max(0, i - 60), i));
// GitHub hesap adı: Android paketinde hiç olmamalı (web sürümü zaten bu hesabın Pages adresinde barınır)
const ACCOUNT = /caglarsaglam/g;

function scanText(text, pkg) {
  const out = [];
  for (const t of [fold(low(text)), fold(text.toLowerCase())]) {
    for (const m of t.matchAll(RE)) if (!(/sağlam|saglam/.test(m[0]) && MAKER_OK(t, m.index))) out.push(m[0]);
    if (pkg) for (const m of t.matchAll(ACCOUNT)) out.push('GitHub hesap adı');
  }
  return out;
}

export function scan(dir, pkg = false) {
  const hits = [];
  const media = [];
  const libNotes = [];
  let files = 0;
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      const rel = path.relative(dir, f).replaceAll('\\', '/');
      if (e.isDirectory()) { walk(f); continue; }
      if (/ataturk|atatürk/i.test(rel)) hits.push(`${rel}: dosya adı`);
      if (MEDIA.test(e.name)) media.push(rel);
      files++;
      // Metin dosyaları UTF-8, ikili dosyalar (dex, arsc, .so) latin1 olarak okunur: içlerindeki ASCII/UTF-8 adlar da yakalanır
      const buf = fs.readFileSync(f);
      let text;
      let lib = 0;
      if (TEXT.test(e.name)) text = buf.toString('utf8');
      else if (MEDIA.test(e.name)) text = '';
      else {
        // İkili dosya: yalnız okunur metin parçaları (en az 6 karakter, "strings" gibi). AndroidX'in internet adresi
        // tanıma kalıbındaki IANA alan adı uzantıları listesi (".bmw", ".toyota" ...) oyun içeriği değildir, ayrı sayılır
        const runs = buf.toString('latin1').match(/[\x20-\x7e]{6,}/g) || [];
        const keep = [];
        for (const r of runs) { if ((r.match(/\|/g) || []).length >= 20) lib++; else keep.push(r); }
        text = keep.join('\n');
      }
      for (const w of new Set(scanText(text, pkg))) hits.push(`${rel}: ${w}`);
      if (lib) libNotes.push(`${rel}: ${lib} kütüphane alan adı listesi parçası atlandı (AndroidX PatternsCompat, IANA alan adları)`);
    }
  };
  walk(dir);
  return { hits, files, media, libNotes };
}

function unpack(file) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'pkg-'));
  // Windows tar (bsdtar) ve Git Bash tar zip açabilir
  const sysTar = process.platform === 'win32' ? path.join(process.env.SystemRoot || 'C:\\Windows', 'System32', 'tar.exe') : 'tar';
  execFileSync(fs.existsSync(sysTar) ? sysTar : 'tar', ['-xf', path.resolve(file), '-C', tmp], { stdio: 'ignore' });
  return tmp;
}

const args = process.argv.slice(2);
const dirs = [];
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--apk' || args[i] === '--aab') dirs.push({ dir: unpack(args[++i]), label: args[i], pkg: true });
  else if (!args[i].startsWith('--')) dirs.push({ dir: args[i], label: args[i] });
}
if (!dirs.length) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'play-'));
  await buildWeb('play', tmp, { pages: true });
  dirs.push({ dir: tmp, label: 'Play web derlemesi' });
}
let total = 0;
for (const { dir, label, pkg } of dirs) {
  const { hits, files, media, libNotes } = scan(dir, pkg);
  for (const n of libNotes) console.log("   not:", n);
  total += hits.length;
  console.log(`${label}: ${files} dosya, ${words.length} yasaklı ad arandı, bulgu ${hits.length}`);
  for (const h of hits.slice(0, 40)) console.log('  ', h);
  if (args.includes('--media')) console.log('  görsel/ses/yazı tipi:', media.join(', '));
}
if (args.includes('--kontrol')) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'ark-'));
  await buildWeb('arkadas', tmp, { pages: true });
  const { hits } = scan(tmp);
  console.log(`kontrol: arkadaş sürümünde ${hits.length} gerçek ad bulundu (sıfırdan büyük olmalı)`);
  if (!hits.length) total++;
}
process.exit(total ? 1 : 0);
