// Gizlilik politikası tek kaynaktan: store/gizlilik/index.html (GitHub Pages'te ayrı, sabit adres: /gizlilik/)
// Oyunun içindeki privacy.html aynı metinden, "Oyuna dön" bağlantısıyla üretilir: node tools/privacy.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = fs.readFileSync(path.join(root, 'store', 'gizlilik', 'index.html'), 'utf8');
const out = src
  .replace('<!--BACK-->', '<a class="back" href="index.html">← Oyuna dön / Back to game</a><br>')
  .replace('<!--SCRIPT-->', "<script>window.__gameBack = () => { location.href = 'index.html'; return false; };</script>");
fs.writeFileSync(path.join(root, 'privacy.html'), out);
console.log('privacy.html güncellendi');
