// file:// üzerinde tarayıcılar ES modül yüklemez. Bu araç js/ altındaki modülleri
// js/app.file.js adlı tek klasik betikte birleştirir. js/ altında değişiklik
// yapınca yeniden çalıştırın: npm run bundle
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const MODULES = ['names', 'config', 'i18n/tr', 'i18n/en', 'i18n/ja', 'i18n/zh', 'i18n/es', 'i18n/de', 'i18n/index', 'physics', 'world', 'effects', 'police', 'crowd', 'game', 'art', 'landmarks', 'cars', 'buildings', 'carsheet', 'sheet', 'carmodels', 'car3d', 'menu3d', 'custom', 'render', 'cheat', 'input', 'controls', 'storage', 'audio', 'pixelcars', 'pixelmenu', 'ui', 'transition', 'quality', 'a2hs', 'main'];

export function buildBundle() {
  const parts = MODULES.map((name) => {
    const source = fs.readFileSync(path.join(root, 'js', `${name}.js`), 'utf8');
    const body = source
      .replace(/^import .*;\r?\n/gm, '')
      .replace(/^export \{.*\};?\r?\n/gm, '')
      // Dil dosyası: export default -> const TR = ... (i18n/index.js aynı adla içe aktarır)
      .replace(/^export default /m, `const ${path.basename(name).toUpperCase()} = `)
      .replace(/^export /gm, '');
    return `// --- ${name}.js ---\n${body}`;
  });
  return `// Üretilmiş dosya, elle düzenlemeyin. Kaynak: js/*.js (npm run bundle)\n(function () {\n'use strict';\n${parts.join('\n')}\n})();\n`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  fs.writeFileSync(path.join(root, 'js', 'app.file.js'), buildBundle());
}
