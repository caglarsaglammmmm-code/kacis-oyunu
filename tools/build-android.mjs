// İki sürümü üretir: npm run android:build [play|arkadas]
//   play    : uydurma isimler, yükleme anahtarıyla imzalı dist/DriftLab-PlayStore.aab (+ .apk)
//   arkadas : gerçek isimler, eski kurulumların üstüne güncellenen debug imzalı dist/DriftLab-Arkadas.apk
// İkisinin de uygulama adı ve ikonu aynıdır: Drift Lab
// JAVA_HOME ve ANDROID_HOME tanımlı değilse %LOCALAPPDATA%\\Android altındaki JDK 21 ve SDK kullanılır.
// İmza: DRIFTLAB_KEYSTORE ve DRIFTLAB_STORE_PASSWORD ortam değişkenleri ya da depo dışındaki
// ~/.driftlab/keystore.properties. Anahtar yoksa APK ve AAB imzasız çıkar, mağazaya yüklenmez.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const android = path.join(process.env.LOCALAPPDATA ?? '', 'Android');
const env = {
  ...process.env,
  JAVA_HOME: process.env.JAVA_HOME || path.join(android, 'jdk-21'),
  ANDROID_HOME: process.env.ANDROID_HOME || path.join(android, 'Sdk'),
};
const props = path.join(os.homedir(), '.driftlab', 'keystore.properties');
if (!env.DRIFTLAB_KEYSTORE && fs.existsSync(props)) {
  for (const line of fs.readFileSync(props, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^(\w+)=(.*)$/);
    if (m) env[m[1]] = m[2];
  }
}
if (!env.DRIFTLAB_KEYSTORE) console.warn('UYARI: imza anahtarı yok, çıktı imzasız olacak');
const run = (cmd, args, cwd = root) => execFileSync(cmd, args, { cwd, env, stdio: 'inherit', shell: process.platform === 'win32' });

fs.writeFileSync(path.join(root, 'android', 'local.properties'), `sdk.dir=${env.ANDROID_HOME.replaceAll('\\', '/')}\n`);
const project = path.join(root, 'android');
const gradle = path.join(project, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew');
fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const want = process.argv.slice(2).filter((a) => !a.startsWith('-'));
const flavors = want.length ? want : ['play', 'arkadas'];
for (const flavor of flavors) {
  // Web dosyaları sürüme göre hazırlanır; Capacitor ortak klasöre kopyalar, sonra o sürüm derlenir
  run('node', ['tools/prepare-www.mjs'], root);
  execFileSync('node', ['tools/prepare-www.mjs'], { cwd: root, env: { ...env, FLAVOR: flavor }, stdio: 'inherit', shell: process.platform === 'win32' });
  run('npx', ['cap', 'sync', 'android']);
  if (flavor === 'play') {
    // cap sync www'yi yeniden okur: Play sürümü
    run(gradle, ['assemblePlayRelease', 'bundlePlayRelease', '--no-daemon'], project);
    const apk = path.join(root, 'dist', 'DriftLab-PlayStore.apk');
    const aab = path.join(root, 'dist', 'DriftLab-PlayStore.aab');
    fs.copyFileSync(path.join(root, 'android/app/build/outputs/apk/play/release/app-play-release.apk'), apk);
    fs.copyFileSync(path.join(root, 'android/app/build/outputs/bundle/playRelease/app-play-release.aab'), aab);
    console.log(`Play APK: ${apk}\nPlay AAB: ${aab}`);
  } else {
    // Arkadaş sürümü önceki APK'lar gibi bu bilgisayarın debug anahtarıyla imzalanır: telefondaki oyun silinmeden güncellenir
    run(gradle, ['assembleArkadasDebug', '--no-daemon'], project);
    const apk = path.join(root, 'dist', 'DriftLab-Arkadas.apk');
    fs.copyFileSync(path.join(root, 'android/app/build/outputs/apk/arkadas/debug/app-arkadas-debug.apk'), apk);
    console.log(`Arkadaş APK: ${apk}`);
  }
}
