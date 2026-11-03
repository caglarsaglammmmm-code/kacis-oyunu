// Çevrimdışı oyun için önbellek. Dosya değişince CACHE sürümünü artırın.
const CACHE = 'drift-lab-v13';
const ASSETS = [
  './',
  'index.html',
  'privacy.html',
  'manifest.json',
  'css/style.css',
  'js/config.js',
  'js/cheat.js',
  'js/controls.js',
  'js/physics.js',
  'js/quality.js',
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
  'assets/cars.webp',
  'js/cars.js',
  'js/buildings.js',
  'js/game.js',
  'js/render.js',
  'js/input.js',
  'js/storage.js',
  'js/audio.js',
  'js/ui.js',
  'js/pixelcars.js',
  'js/pixelmenu.js',
  'js/transition.js',
  'js/main.js',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-192.png',
  'icons/icon-maskable-512.png',
  'icons/favicon-32.png',
  'assets/ui/cover.png',
  'assets/ui/btn-basla.png',
  'assets/ui/frame.png',
  'assets/ui/garage-bg.png',
  'assets/ui/hazard.png',
  'assets/ui/plate.png',
  'fonts/press-start-2p-latin-400-normal.woff2',
  'fonts/press-start-2p-latin-ext-400-normal.woff2',
  'fonts/pixelify-sans-latin-400-normal.woff2',
  'fonts/pixelify-sans-latin-ext-400-normal.woff2',
  'fonts/pixelify-sans-latin-700-normal.woff2',
  'fonts/pixelify-sans-latin-ext-700-normal.woff2',
  'fonts/anton-latin-400-normal.woff2',
  'fonts/anton-latin-ext-400-normal.woff2',
  'fonts/lobster-latin-400-normal.woff2',
  'fonts/lobster-latin-ext-400-normal.woff2',
  'fonts/monoton-latin-400-normal.woff2',
  'fonts/monoton-latin-ext-400-normal.woff2',
  'fonts/oswald-latin-500-normal.woff2',
  'fonts/oswald-latin-ext-500-normal.woff2',
  'fonts/pacifico-latin-400-normal.woff2',
  'fonts/pacifico-latin-ext-400-normal.woff2',
  'fonts/righteous-latin-400-normal.woff2',
  'fonts/righteous-latin-ext-400-normal.woff2',
  'fonts/tilt-neon-latin-400-normal.woff2',
  'fonts/tilt-neon-latin-ext-400-normal.woff2',
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
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k.startsWith('drift-lab-')).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((hit) => hit || fetch(event.request)),
  );
});
