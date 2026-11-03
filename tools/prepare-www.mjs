// Capacitor için oyunun yalnızca çalışma dosyalarını www/ altına kopyalar.
// Sürüm FLAVOR ortam değişkeniyle seçilir: play (varsayılan) ya da arkadas.
// sw.js ve manifest alınmaz: APK dosyaları zaten içinde taşır. app.file.js de
// yalnızca file:// açılışı içindir.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildWeb } from './flavor.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const flavor = process.env.FLAVOR || 'play';
await buildWeb(flavor, path.join(root, 'www'));
console.log(`www hazır: ${flavor}`);
