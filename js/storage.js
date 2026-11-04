// En yüksek skor, coin, arabalar ve ayarlar localStorage'da.
import { CONFIG, carById } from './config.js';
import { itemOf } from './custom.js';

const KEY = 'drift-lab-v1';

export function defaultSave() {
  return {
    bestScore: 0,
    bestTime: 0,
    coins: 0,
    owned: [CONFIG.cars[0].id],
    selected: CONFIG.cars[0].id,
    settings: { sound: true, vibrate: true, ambient: true, volume: 80, quality: 'auto', qLevel: -1, control: 'zones', lang: '', weather: 'random' },
    dev: { god: false, startTime: 0 },
    tutorial: false,
    paints: {},
    custom: {}, // araba -> { rim, led, exhaust }
    unlocked: { paints: [], rims: [], leds: [], exhausts: [] }, // satın alınan özelleştirmeler
    secret: false, // Gizli geçit bulundu: gizli motosiklet garajda
  };
}

// Bozuk ya da eski veriyi güvenli biçimde varsayılana tamamlar
export function sanitize(data) {
  const d = defaultSave();
  if (!data || typeof data !== 'object') return d;
  const num = (v, min = 0) => (Number.isFinite(v) && v >= min ? v : min);
  d.bestScore = num(data.bestScore);
  d.bestTime = num(data.bestTime);
  d.coins = Math.floor(num(data.coins));
  d.secret = data.secret === true;
  if (Array.isArray(data.owned)) {
    // Gizli motosiklet yalnız geçidi bulanda geçerli
    const valid = data.owned.filter((id) => CONFIG.cars.some((c) => c.id === id) || (d.secret && id === CONFIG.secretCar.id));
    d.owned = [...new Set([CONFIG.cars[0].id, ...valid])];
  }
  if (d.secret && !d.owned.includes(CONFIG.secretCar.id)) d.owned.push(CONFIG.secretCar.id);
  if (d.owned.includes(data.selected)) d.selected = data.selected;
  if (data.settings) {
    d.settings.sound = data.settings.sound !== false;
    d.settings.vibrate = data.settings.vibrate !== false;
    d.settings.ambient = data.settings.ambient !== false;
    if (Number.isFinite(data.settings.volume)) d.settings.volume = Math.max(0, Math.min(100, data.settings.volume));
    if (['auto', 'high', 'low'].includes(data.settings.quality)) d.settings.quality = data.settings.quality;
    if (Number.isInteger(data.settings.qLevel) && data.settings.qLevel >= -1 && data.settings.qLevel <= 3) d.settings.qLevel = data.settings.qLevel;
    if (['zones', 'wheel', 'stick'].includes(data.settings.control)) d.settings.control = data.settings.control;
    if (['tr', 'en', 'ja', 'zh', 'es', 'de'].includes(data.settings.lang)) d.settings.lang = data.settings.lang;
    if (['random', ...CONFIG.weather.types].includes(data.settings.weather)) d.settings.weather = data.settings.weather;
  }
  if (data.dev) {
    d.dev.god = data.dev.god === true;
    d.dev.startTime = num(data.dev.startTime);
  }
  d.tutorial = data.tutorial === true;
  if (data.paints && typeof data.paints === 'object') {
    for (const c of [...CONFIG.cars, CONFIG.secretCar]) {
      const i = data.paints[c.id];
      if (Number.isInteger(i) && i >= 0 && i < c.paints.length) d.paints[c.id] = i;
    }
  }
  if (data.unlocked && typeof data.unlocked === 'object') {
    for (const [kind, key] of [['paint', 'paints'], ['rim', 'rims'], ['led', 'leds'], ['exhaust', 'exhausts']]) {
      const list = Array.isArray(data.unlocked[key]) ? data.unlocked[key] : [];
      d.unlocked[key] = [...new Set(list.filter((id) => itemOf(kind, id)))];
    }
  }
  // Genel boya seçimi yalnız satın alınmışsa geçerli
  if (data.paints && typeof data.paints === 'object') {
    for (const c of [...CONFIG.cars, CONFIG.secretCar]) {
      const i = data.paints[c.id];
      if (typeof i === 'string' && d.unlocked.paints.includes(i)) d.paints[c.id] = i;
    }
  }
  if (data.custom && typeof data.custom === 'object') {
    for (const c of [...CONFIG.cars, CONFIG.secretCar]) {
      const v = data.custom[c.id];
      if (!v || typeof v !== 'object') continue;
      const ok = (kind, key, id) => itemOf(kind, id) && (itemOf(kind, id).price === 0 || d.unlocked[key].includes(id));
      d.custom[c.id] = { rim: ok('rim', 'rims', v.rim) ? v.rim : 'std', led: ok('led', 'leds', v.led) ? v.led : 'yok', exhaust: ok('exhaust', 'exhausts', v.exhaust) ? v.exhaust : 'std' };
    }
  }
  return d;
}

export class Storage {
  constructor(backend = null) {
    this.backend = backend;
    this.data = this.load();
  }

  store() {
    if (this.backend) return this.backend;
    try { return globalThis.localStorage; } catch { return null; }
  }

  load() {
    try {
      return sanitize(JSON.parse(this.store().getItem(KEY)));
    } catch {
      return defaultSave();
    }
  }

  save() {
    try {
      this.store().setItem(KEY, JSON.stringify(this.data));
    } catch { /* Gizli sekme ya da dolu depo: oyun yine çalışır */ }
  }

  paintIndex(id) {
    return (this.data.paints && this.data.paints[id]) || 0;
  }

  setPaint(id, i) {
    if (!this.data.paints) this.data.paints = {};
    this.data.paints[id] = i;
    this.save();
  }

  selectedCar() {
    return carById(this.data.selected) || CONFIG.cars[0];
  }

  // Gizli geçit bulundu: motosiklet kalıcı olarak garaja girer. true: ilk kez açıldı
  unlockSecret() {
    const d = this.data;
    const first = !d.secret;
    d.secret = true;
    if (!d.owned.includes(CONFIG.secretCar.id)) d.owned.push(CONFIG.secretCar.id);
    this.save();
    return first;
  }

  // Garajda gezilen araçlar: satılık arabalar; gizli motosiklet yalnız bulunduysa (bulmayanda hiçbir iz yok)
  garageCars() {
    return this.data.secret ? [...CONFIG.cars, CONFIG.secretCar] : CONFIG.cars;
  }

  // Sonucu işler, rekor bilgisini döndürür
  recordRun(result) {
    const d = this.data;
    const newScore = result.score > d.bestScore;
    const newTime = result.time > d.bestTime;
    if (newScore) d.bestScore = result.score;
    if (newTime) d.bestTime = result.time;
    d.coins += result.coins;
    const penalty = this.applyPenalty(result.penalty, false);
    this.save();
    return result.penalty ? { newScore, newTime, penalty } : { newScore, newTime };
  }

  // Para cezası (anıta saygısızlık): kalıcı paradan düşülür, 0'ın altına inmez. Düşülen miktarı döndürür
  applyPenalty(n, save = true) {
    const d = this.data;
    const cut = Math.min(d.coins, Math.max(0, Math.floor(Number(n) || 0)));
    d.coins -= cut;
    if (save && cut) this.save();
    return cut;
  }

  // Gizli kod: 'ok' açıldı, 'owned' zaten sende, 'invalid' geçersiz
  redeem(text) {
    const code = String(text || '').toUpperCase().replace(/[^0-9A-Z]/g, '');
    const entry = code && CONFIG.codes.find((k) => k.code === code);
    if (!entry) return 'invalid';
    const d = this.data;
    if (entry.car) {
      if (d.owned.includes(entry.car)) return 'owned';
      d.owned.push(entry.car);
      this.save();
    }
    return 'ok';
  }

  // Seçili arabanın görünüşü: boya, jant, alt LED
  look(id) {
    const c = this.data.custom[id] || {};
    return { paint: this.paintIndex(id), rim: c.rim || 'std', led: c.led || 'yok', exhaust: c.exhaust || 'std' };
  }

  owns(kind, id) {
    const it = itemOf(kind, id);
    if (!it) return false;
    return it.price === 0 || this.data.unlocked[`${kind}s`].includes(id);
  }

  // 'ok' alındı, 'owned' zaten açık, 'poor' para yetmiyor, 'invalid' yok
  buyItem(kind, id) {
    const it = itemOf(kind, id);
    if (!it) return 'invalid';
    if (this.owns(kind, id)) return 'owned';
    const d = this.data;
    if (d.coins < it.price) return 'poor';
    d.coins -= it.price;
    d.unlocked[`${kind}s`].push(id);
    this.save();
    return 'ok';
  }

  // Seçim kaydedilir; açılmamış öğe seçilemez
  setLook(carId, kind, id) {
    if (kind === 'paint') {
      if (typeof id === 'string' && !this.owns('paint', id)) return false;
      this.setPaint(carId, id);
      return true;
    }
    if (!this.owns(kind, id)) return false;
    const c = this.data.custom[carId] || (this.data.custom[carId] = { rim: 'std', led: 'yok', exhaust: 'std' });
    c[kind] = id;
    this.save();
    return true;
  }

  buy(id) {
    const car = CONFIG.cars.find((c) => c.id === id);
    const d = this.data;
    if (!car || d.owned.includes(id) || d.coins < car.cost) return false;
    d.coins -= car.cost;
    d.owned.push(id);
    d.selected = id;
    this.save();
    return true;
  }

  select(id) {
    if (!this.data.owned.includes(id)) return false;
    this.data.selected = id;
    this.save();
    return true;
  }
}
