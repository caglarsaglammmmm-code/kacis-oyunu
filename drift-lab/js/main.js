// Giriş noktası: döngü, boyutlandırma, olayların ses ve titreşime bağlanması.
import { CONFIG } from './config.js';
import { Game } from './game.js';
import { Renderer } from './render.js';
import { Input } from './input.js';
import { AudioEngine } from './audio.js';
import { Storage } from './storage.js';
import { UI } from './ui.js';
import { PixelMenu } from './pixelmenu.js';
import { loadAtlas } from './sheet.js';
import { PHASE, FALL_AT, TOTAL, dropCurve } from './transition.js';

const STEP = 1 / 60;
const canvas = document.getElementById('game');
const storage = new Storage();
const game = new Game();
const renderer = new Renderer(canvas);
const input = new Input();
const audio = new AudioEngine();
game.world.onRelease = (c) => renderer.releaseChunk(c);
game.carSpec = storage.selectedCar();
game.paint = storage.paintIndex(game.carSpec.id);

const cover = new PixelMenu(document.getElementById('cover'));
const menuEl = document.getElementById('menu');
const params = new URLSearchParams(location.search);
let paused = false;
let accumulator = 0;
let last = 0;
let hudT = 0;
let hintT = 0;
let dprCap = CONFIG.perf.maxDpr;
const perf = { frames: new Float32Array(20000), work: new Float32Array(20000), i: 0, count: 0, dprDrops: 0 };

function vibrate(ms) {
  if (storage.data.settings.vibrate && navigator.vibrate) {
    try { navigator.vibrate(ms); } catch { /* desteklenmiyor */ }
  }
}

function applySettings() {
  audio.setEnabled(storage.data.settings.sound);
  audio.setVolume(storage.data.settings.volume / 100);
  ui.syncMute();
  audio.setAmbient(storage.data.settings.ambient);
}

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = Math.min(dprCap, window.devicePixelRatio || 1);
  renderer.resize(w, h, dpr);
  game.view.w = w;
  game.view.h = h;
  input.width = w;
  game.updateCamera(1);
}

function play() {
  audio.unlock();
  const d = storage.data.dev;
  const qt = Number(params.get('t'));
  const startTime = params.has('t') ? qt : (d.startTime || CONFIG.dev.startTime);
  const god = params.get('god') === '1' || d.god || CONFIG.dev.godMode;
  paused = false;
  input.clear();
  ui.hideAll();
  ui.resetHud();
  ui.setHud(true);
  game.paint = storage.paintIndex(storage.selectedCar().id);
  game.start(storage.selectedCar(), { startTime, god });
  cover.stop();
  audio.setEngine(storage.selectedCar().engine);
  perf.i = 0;
  perf.count = 0;
  hintT = storage.data.tutorial ? 0 : 5;
  ui.showHint(hintT > 0);
  if (hintT > 0) { storage.data.tutorial = true; storage.save(); }
  keepAwake(true);
}

// BAŞLA: araba küçülür, kadraj bulanır, küçük araba gökten yola düşer, oyun kesintisiz başlar.
// Otomatik testler ve hareket azaltma tercihinde doğrudan başlar.
let film = null;
function start() {
  if (film) return;
  const quick = (navigator.webdriver && !params.has('fx')) || matchMedia('(prefers-reduced-motion: reduce)').matches;
  audio.unlock();
  if (quick) { play(); return; }
  film = { t0: performance.now(), left: false, landed: false, released: false };
  prepareWorld();
}

// Dünya, menünün arkasında kurulur: 3B sahne örtüyken parça parça hazırlanır, ekran donmaz
function prepareWorld() {
  const d = storage.data.dev;
  const startTime = params.has('t') ? Number(params.get('t')) : (d.startTime || CONFIG.dev.startTime);
  const god = params.get('god') === '1' || d.god || CONFIG.dev.godMode;
  game.paint = storage.paintIndex(storage.selectedCar().id);
  game.start(storage.selectedCar(), { startTime, god, keepWorld: menuWorld });
  menuWorld = false;
  game.holdForDrop();
  input.clear();
}

// Menü beklerken bir sonraki koşunun haritası sessizce hazırlanır. BAŞLA'ya basınca iş kalmaz.
let menuWorld = false;
let warmT = 0;
let warmDone = false;
function prewarmWorld() {
  if (game.state !== 'attract' || film) return;
  game.start(storage.selectedCar(), { startTime: 0, god: false });
  game.holdForDrop();
  game.updateCamera(1 / 60);
  game.state = 'attract';
  game.drop = null;
  menuWorld = true;
  warmDone = false;
}

function stepFilm(now) {
  const f = film;
  const t = now - f.t0;
  // Kapak CSS ile küçülüp solar: yalnız dönüşüm, kare bütçesi harcamaz; arkasında yol çizilir
  if (!f.left && t >= PHASE.press) {
    f.left = true;
    document.getElementById('menu').classList.add('leaving');
    cover.stop();
    keepAwake(true);
  }
  if (!f.cleared && t >= PHASE.press + PHASE.away) {
    f.cleared = true;
    ui.hideAll();
    document.getElementById('menu').classList.remove('leaving');
    ui.resetHud();
  }
  const c = dropCurve(t - FALL_AT);
  if (game.drop) { game.drop.y = c.drop; game.drop.size = c.size; game.drop.shadow = c.shadow; }
  if (!f.landed && t >= FALL_AT + PHASE.fall) {
    f.landed = true;
    game.landDrop();
    audio.landing();
    audio.preview(storage.selectedCar().engine, 'start');
    vibrate([40, 30, 25]);
    ui.setHud(true);
  }
  if (!f.released && t >= TOTAL - 90) {
    f.released = true;
    game.releaseDrop();
    audio.setEngine(storage.selectedCar().engine);
    perf.i = 0;
    perf.count = 0;
    hintT = storage.data.tutorial ? 0 : 5;
    ui.showHint(hintT > 0);
    if (hintT > 0) { storage.data.tutorial = true; storage.save(); }
  }
  if (t >= TOTAL) film = null;
}

function toMenu() {
  paused = false;
  ui.setHud(false);
  ui.showHint(false);
  game.carSpec = storage.selectedCar();
  game.startAttract();
  ui.refreshMenu();
  ui.show('menu');
  ui.intro();
  cover.start();
  keepAwake(false);
  menuWorld = false;
  warmDone = false;
  setTimeout(prewarmWorld, 1300); // Giriş animasyonu bitsin
}

function pause() {
  if (game.state !== 'play' || paused) return;
  paused = true;
  input.clear();
  audio.suspend();
  ui.show('pause');
}

function resume() {
  paused = false;
  audio.resume();
  ui.hideAll();
  last = 0;
}

const ui = new UI(storage, {
  tap() { audio.unlock(); },
  play, start, toMenu, pause, resume, applySettings,
  press() { audio.unlock(); audio.press(); vibrate(16); },
  preview(car) { audio.unlock(); audio.preview(car.engine, 'rev'); },
  carChanged() { game.carSpec = storage.selectedCar(); game.paint = storage.paintIndex(game.carSpec.id); },
  menuShown() { cover.start(); },
  menuHidden() { cover.stop(); },
  purchased() { audio.purchase(); vibrate([30, 30, 60]); },
});

let wakeLock = null;
async function keepAwake(on) {
  try {
    if (on && navigator.wakeLock && !wakeLock) {
      wakeLock = await navigator.wakeLock.request('screen');
      wakeLock.addEventListener('release', () => { wakeLock = null; });
    } else if (!on && wakeLock) {
      await wakeLock.release();
    }
  } catch { /* Pil tasarrufunda reddedilebilir */ }
}

game.onEvent = (name, v) => {
  switch (name) {
    case 'crash': audio.crash(v); vibrate(Math.round(18 + v * 40)); break;
    case 'scream': audio.scream(v, game.lastVoice); break;
    case 'simit': audio.simit(); break;
    case 'tea': audio.tea(); break;
    case 'chairs': audio.chairs(); break;
    case 'uncles': break;
    case 'thud': audio.thud(); vibrate(15); break;
    case 'horn': audio.horn(v); break;
    case 'power': audio.power(v); ui.powerToast(v); vibrate(35); break;
    case 'powerend': audio.powerEnd(); break;
    case 'break': audio.crunch(); break;
    case 'crush': audio.crunch(); vibrate(25); break;
    case 'coin': audio.coin(); break;
    case 'nearmiss': audio.nearMiss(); break;
    case 'splash': audio.splash(); break;
    case 'sink': audio.sink(); vibrate([80, 60, 200]); break;
    case 'aliens': audio.alert(); ui.alienAlert(); vibrate([100, 50, 100, 50, 200]); break;
    case 'spike': audio.spike(); vibrate(60); break;
    case 'copdown': audio.explosion(0.55 * v); vibrate(40); break;
    case 'explosion': audio.explosion(1); vibrate([120, 40, 220]); break;
    case 'tankfire': audio.tankFire(); vibrate(30); break;
    case 'tankhit': audio.explosion(0.5 + 0.4 * v); vibrate(70); break;
    case 'alert': audio.alert(); ui.alert(v); vibrate([60, 40, 60]); break;
    case 'gameover': {
      const record = storage.recordRun(game.result);
      ui.setHud(false);
      ui.over(game.result, record);
      keepAwake(false);
      break;
    }
    default:
  }
};

function frame(now) {
  requestAnimationFrame(frame);
  if (!last) last = now;
  const elapsed = Math.min(0.1, (now - last) / 1000);
  last = now;
  const t0 = performance.now();
  if (!menuEl.hidden) cover.frame(elapsed);

  if (!paused) {
    accumulator += elapsed;
    let steps = 0;
    // Menü kendi sahnesini çizer: arkada oyun dönmez, pil harcanmaz
    while (game.state !== 'attract' && accumulator >= STEP && steps < 5) {
      input.tick(STEP);
      game.tick(STEP, input.steer, input.reverse);
      accumulator -= STEP;
      steps++;
    }
    if (steps === 5 || game.state === 'attract') accumulator = 0;
    if (hintT > 0) {
      hintT -= elapsed;
      if (hintT <= 0) ui.showHint(false);
    }
  }
  // Menü beklerken dünya parça parça hazırlanır; geçişin ilk karesi hazır parçalarla çizilir
  if (menuWorld && !warmDone && game.state === 'attract' && ++warmT % 5 === 0) warmDone = renderer.warm(game, 2);
  else if (game.state !== 'attract') renderer.draw(game, now);
  if (film) stepFilm(now);
  audio.update(game, !paused, now);

  hudT -= elapsed;
  if (hudT <= 0 && game.state === 'play') {
    hudT = 0.1;
    ui.hud(game);
  }

  // Kare süresi ölçümü ve uyarlanabilir çözünürlük
  const i = perf.i;
  perf.frames[i] = elapsed * 1000;
  perf.work[i] = performance.now() - t0;
  perf.i = (i + 1) % perf.frames.length;
  perf.count++;
  if (perf.count % 120 === 0 && perf.count >= 120 && game.state === 'play') {
    let sum = 0;
    for (let k = 1; k <= 120; k++) sum += perf.frames[(perf.i - k + perf.frames.length) % perf.frames.length];
    if (sum / 120 > CONFIG.perf.slowFrameMs) {
      // Önce çözünürlük, sonra kalabalık azalır
      if (dprCap > 1) {
        dprCap = Math.max(1, dprCap - 0.25);
        perf.dprDrops++;
        resize();
      } else if (game.crowd.limit > 0.4) {
        game.crowd.limit -= 0.2;
        perf.dprDrops++;
      }
    }
  }
}

// Geri tuşu: oyundan çıkarmaz. Sırayla duraklatır, menüye döner; menüde iki kez basınca çıkar.
let lastBack = 0;
function handleBack() {
  const visible = (id) => !document.getElementById(id).hidden;
  if (visible('splash') || film) return false;
  if (game.state === 'play' || game.state === 'dying' || game.state === 'sinking') {
    if (paused) resume(); else pause();
    return false;
  }
  if (visible('over')) { toMenu(); return false; }
  if (visible('menu')) {
    const t = performance.now();
    if (t - lastBack < 2000) return true;
    lastBack = t;
    ui.toast('Çıkmak için tekrar bas', '#ffffff');
    return false;
  }
  ui.refreshMenu();
  ui.show('menu');
  cover.start();
  return false;
}
globalThis.__gameBack = handleBack;

function boot() {
  const native = !!(globalThis.Capacitor && globalThis.Capacitor.isNativePlatform && globalThis.Capacitor.isNativePlatform());
  ui.setApkButton(!native, CONFIG.apkUrl);
  // Telefona kurulu web sürümünde de geri tuşu oyunu kapatmasın
  if (!native && location.protocol !== 'file:') {
    history.pushState({ kacis: 1 }, '');
    window.addEventListener('popstate', () => {
      if (handleBack()) history.back();
      else history.pushState({ kacis: 1 }, '');
    });
  }
  input.attach(canvas);
  applySettings();
  if (document.fonts) {
    for (const f of ['800 30px Nunito', '400 30px Bungee', '400 30px Pacifico', '400 30px Anton', '400 30px Righteous', '400 30px Lobster', '400 30px "Tilt Neon"', '400 30px Monoton', '500 30px Oswald', 'italic 400 30px Playfair', '400 16px "Press Start"', '400 16px Pixelify', '700 16px Pixelify']) document.fonts.load(f, 'ÇŞĞİçşğı').catch(() => {});
  }
  resize();
  window.addEventListener('resize', () => { resize(); cover.layout(); });
  window.addEventListener('orientationchange', () => { resize(); cover.layout(); });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (game.state === 'play') pause();
      else audio.suspend();
    } else if (game.state !== 'play' || !paused) {
      audio.resume();
    }
  });

  game.startAttract();
  requestAnimationFrame(frame);
  loadAtlas(() => { renderer.useAtlas(); ui.atlasLoaded(); });
  ui.splash(() => { toMenu(); });

  if ('serviceWorker' in navigator && !native && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    const hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.register('sw.js').catch(() => {});
    // Yeni sürüm gelince menüdeyken yenile, oyun sırasında bölme
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (hadController && game.state !== 'play') location.reload();
    });
  }
}

// Test ve geliştirici erişimi
globalThis.__drift = { game, input, perf, storage, renderer, ui, play, pause, resume, cfg: CONFIG, cover };

boot();
