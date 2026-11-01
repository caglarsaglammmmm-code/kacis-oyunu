// Çevrimdışı oyun için önbellek. Dosya değişince CACHE sürümünü artırın.
const CACHE = 'penci-zorn-v5';
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'css/style.css',
  'js/config.js',
  'js/physics.js',
  'js/world.js',
  'js/effects.js',
  'js/police.js',
  'js/crowd.js',
  'js/art.js',
  'js/carsheet.js',
  'js/sheet.js',
  'js/carmodels.js',
  'js/car3d.js',
  'js/menu3d.js',
  'vendor/three.min.js',
  'assets/cars.webp',
  'js/cars.js',
  'js/buildings.js',
  'js/game.js',
  'js/render.js',
  'js/input.js',
  'js/storage.js',
  'js/audio.js',
  'js/ui.js',
  'js/main.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'fonts/bungee-latin-400-normal.woff2',
  'fonts/bungee-latin-ext-400-normal.woff2',
  'fonts/nunito-latin-600-normal.woff2',
  'fonts/nunito-latin-800-normal.woff2',
  'fonts/nunito-latin-ext-600-normal.woff2',
  'fonts/nunito-latin-ext-800-normal.woff2',
  'fonts/playfair-display-latin-400-italic.woff2',
  'fonts/playfair-display-latin-ext-400-italic.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((hit) => hit || fetch(event.request)),
  );
});
