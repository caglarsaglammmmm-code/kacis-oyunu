// En yüksek skor, coin, arabalar ve ayarlar localStorage'da.
import { CONFIG, carById } from './config.js';
import { itemOf } from './custom.js';

const KEY = 'drift-lab-v1';

// Ayrı ses grupları (0-100). Ana ses düzeyi (volume) hepsinin üstündedir
export const SOUND_GROUPS = ['music', 'sfx', 'engine', 'police', 'traffic', 'gun'];
const defaultVols = () => Object.fromEntries(SOUND_GROUPS.map((k) => [k, 100]));
// Kod metni: büyük/küçük harf, boşluk, tire ve diğer işaretler fark etmez ("  dante " = "DANTE")
export const normCode = (text) => String(text || '').toUpperCase().replace(/[^0-9A-Z]/g, '');

// v24.2: beş kollu jantın kimliği 'bes' oldu. Eski kayıttaki bilinmeyen jant kimliği o janttır (başka jant
// kimliği hiç değişmedi); satın alınmış jant kaybolmasın diye 'bes' sayılır
const rimId = (id) => (typeof id !== 'string' || itemOf('rim', id) ? id : 'bes');

export function defaultSave() {
  return {
    bestScore: 0,
    bestTime: 0,
    coins: 0,
    owned: [CONFIG.cars[0].id],
    selected: CONFIG.cars[0].id,
    settings: { sound: true, vibrate: true, ambient: true, volume: 80, vols: defaultVols(), quality: 'auto', qLevel: -1, control: 'zones', lang: '', weather: 'random' },
    dev: { god: false, startTime: 0 },
    tutorial: false,
    paints: {},
    custom: {}, // araba -> { rim, led, exhaust }
    unlocked: { paints: [], rims: [], leds: [], exhausts: [] }, // satın alınan özelleştirmeler
    secret: false, // Gizli geçit bulundu: gizli motosiklet garajda
    usedCodes: [], // Kullanılmış para / süre kodları: her biri bir kayıtta bir kez
    berserk: 0, // Berserk kodunun kalan süresi (sn): uygulama açıkken her ekranda azalır (tickBerserk)
    guns: [], // Satın alınan silahlar
    gun: '', // Takılı silah (boş: yok)
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
    if (data.settings.vols && typeof data.settings.vols === 'object') {
      for (const k of SOUND_GROUPS) {
        const v = data.settings.vols[k];
        if (Number.isFinite(v)) d.settings.vols[k] = Math.max(0, Math.min(100, Math.round(v)));
      }
    }
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
  if (Array.isArray(data.usedCodes)) d.usedCodes = [...new Set(data.usedCodes.map(normCode).filter((c) => CONFIG.codes.some((k) => k.code === c)))];
  d.berserk = Math.min(CONFIG.berserk.seconds, num(data.berserk));
  if (Array.isArray(data.guns)) d.guns = [...new Set(data.guns.filter((id) => CONFIG.guns.some((g) => g.id === id)))];
  if (d.guns.includes(data.gun)) d.gun = data.gun;
  if (data.paints && typeof data.paints === 'object') {
    for (const c of [...CONFIG.cars, CONFIG.secretCar]) {
      const i = data.paints[c.id];
      if (Number.isInteger(i) && i >= 0 && i < c.paints.length) d.paints[c.id] = i;
    }
  }
  if (data.unlocked && typeof data.unlocked === 'object') {
    for (const [kind, key] of [['paint', 'paints'], ['rim', 'rims'], ['led', 'leds'], ['exhaust', 'exhausts']]) {
      const list = Array.isArray(data.unlocked[key]) ? data.unlocked[key].map((id) => (kind === 'rim' ? rimId(id) : id)) : [];
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
      const rim = rimId(v.rim);
      d.custom[c.id] = { rim: ok('rim', 'rims', rim) ? rim : 'std', led: ok('led', 'leds', v.led) ? v.led : 'yok', exhaust: ok('exhaust', 'exhausts', v.exhaust) ? v.exhaust : 'std' };
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

  // Gizli kod. Araba kodu: 'ok' açıldı, 'owned' zaten sende. Para kodu: 'coins'. Berserk: 'berserk'.
  // Para ve süre kodları bir kayıtta bir kez: ikincisinde 'used'. Yanlış kod: 'invalid'
  redeem(text) {
    const code = normCode(text);
    const entry = code && CONFIG.codes.find((k) => k.code === code);
    if (!entry) return 'invalid';
    const d = this.data;
    if (entry.car) {
      if (d.owned.includes(entry.car)) return 'owned';
      d.owned.push(entry.car);
      this.save();
      return 'ok';
    }
    if (d.usedCodes.includes(code)) return 'used';
    d.usedCodes.push(code);
    let r = 'ok';
    if (entry.coins) { d.coins += entry.coins; r = 'coins'; }
    if (entry.berserk) { d.berserk = Math.min(CONFIG.berserk.seconds, d.berserk + entry.berserk); r = 'berserk'; }
    this.save();
    return r;
  }

  // Berserk kalan süresini ayarlar (test ve geliştirici)
  setBerserk(sec, save = true) {
    this.data.berserk = Math.max(0, Math.min(CONFIG.berserk.seconds, Number(sec) || 0));
    this.bzUnsaved = 0;
    if (save) this.save();
  }

  // Berserk saati: main.js uygulama açık ve görünürken her karede çağırır (ekran fark etmez).
  // dt en çok maxStep sayılır. saveEvery saniyede bir ve süre bitince kaydedilir. Kalan süreyi döndürür
  tickBerserk(dt) {
    const d = this.data;
    if (!(d.berserk > 0)) return 0;
    const step = Math.max(0, Math.min(CONFIG.berserk.maxStep, Number(dt) || 0));
    d.berserk = Math.max(0, d.berserk - step);
    this.bzUnsaved = (this.bzUnsaved || 0) + step;
    if (d.berserk === 0 || this.bzUnsaved >= CONFIG.berserk.saveEvery) { this.bzUnsaved = 0; this.save(); }
    return d.berserk;
  }

  // --- Silahlar: 'ok' alındı (ve takıldı), 'owned' zaten var, 'poor' para yetmiyor, 'invalid' yok ---
  ownsGun(id) {
    return this.data.guns.includes(id);
  }

  buyGun(id) {
    const g = CONFIG.guns.find((k) => k.id === id);
    if (!g) return 'invalid';
    const d = this.data;
    if (d.guns.includes(id)) return 'owned';
    if (d.coins < g.price) return 'poor';
    d.coins -= g.price;
    d.guns.push(id);
    d.gun = id;
    this.save();
    return 'ok';
  }

  // Satın alınmış silahı takar; boş kimlik silahı çıkarır
  equipGun(id) {
    if (id && !this.ownsGun(id)) return false;
    this.data.gun = id || '';
    this.save();
    return true;
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
