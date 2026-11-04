// Araç özelleştirme: boya, jant, alt LED. Listeler ve fiyatlar config.js custom bölümündedir.
// DOM'a dokunmaz; garaj, kayıt ve çizim aynı yardımcıları kullanır.
import { CONFIG } from './config.js';

export const CUSTOM = CONFIG.custom;

// sel: arabanın kendi boyası (0-3) ya da satın alınan genel boyanın kimliği
export function paintOf(car, sel) {
  if (typeof sel === 'string') {
    const p = CUSTOM.paints.find((k) => k.id === sel);
    if (p) return { name: p.id, color: p.color, finish: p.finish, accent: car.accent, roof: p.roof, global: true };
  }
  return car.paints[sel] || car.paints[0];
}

export const rimOf = (id) => CUSTOM.rims.find((k) => k.id === id) || CUSTOM.rims[0];
export const ledOf = (id) => CUSTOM.leds.find((k) => k.id === id) || CUSTOM.leds[0];
export const exhaustItem = (id) => CUSTOM.exhausts.find((k) => k.id === id) || CUSTOM.exhausts[0];

const LIST = { paint: 'paints', rim: 'rims', led: 'leds', exhaust: 'exhausts' };
export function itemOf(kind, id) {
  const list = CUSTOM[LIST[kind]];
  return list ? list.find((k) => k.id === id) || null : null;
}

// Arabanın en doygun kendi boyası: oyun içinde yeni boya bu görüntüden yeniden renklendirilir
export function refPaintIndex(car) {
  let best = 0;
  let bs = -1;
  car.paints.forEach((p, i) => {
    const c = p.color;
    const r = parseInt(c.slice(1, 3), 16) / 255; const g = parseInt(c.slice(3, 5), 16) / 255; const b = parseInt(c.slice(5, 7), 16) / 255;
    const mx = Math.max(r, g, b); const mn = Math.min(r, g, b);
    const l = (mx + mn) / 2;
    const s = mx === mn ? 0 : (mx - mn) / (1 - Math.abs(2 * l - 1));
    const score = s * (1 - Math.abs(l - 0.5));
    if (!p.roof && score > bs) { bs = score; best = i; }
  });
  return best;
}
