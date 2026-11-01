// İmzalı APK ve AAB üretir: npm run android:build
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

run('node', ['tools/prepare-www.mjs']);
run('npx', ['cap', 'sync', 'android']);
fs.writeFileSync(path.join(root, 'android', 'local.properties'), `sdk.dir=${env.ANDROID_HOME.replaceAll('\\', '/')}\n`);
const project = path.join(root, 'android');
run(path.join(project, process.platform === 'win32' ? 'gradlew.bat' : 'gradlew'), ['assembleRelease', 'bundleRelease', '--no-daemon'], project);

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
const apk = path.join(root, 'dist', 'DriftLab.apk');
const aab = path.join(root, 'dist', 'DriftLab.aab');
fs.copyFileSync(path.join(root, 'android/app/build/outputs/apk/release/app-release.apk'), apk);
fs.copyFileSync(path.join(root, 'android/app/build/outputs/bundle/release/app-release.aab'), aab);
console.log(`APK: ${apk}\nAAB: ${aab}`);
