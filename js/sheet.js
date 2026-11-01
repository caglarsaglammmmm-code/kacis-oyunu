// 3B modellerden üretilmiş araç atlası. Atlas yüklenemezse çizim kodlu yedek sprite'lar kullanılır.
import { CAR_SHEET } from './carsheet.js';

export const FRAME_L = 1.08; // Kare, aracın boyundan bu kadar geniş
export const FRAME_W = 1.5;
export const FATTEN = 1.14; // Üstten görünümde dar kalmasın diye genişlik büyütülür
export const DRAW_LEN = 1.1; // Çizilen boy, çarpışma boyuna oranla

const ATLAS = { img: null, ready: false };

export function loadAtlas(done) {
  if (typeof Image === 'undefined') return;
  const img = new Image();
  img.onload = () => { ATLAS.img = img; ATLAS.ready = true; if (done) done(); };
  img.onerror = () => { ATLAS.ready = false; if (done) done(); };
  img.src = 'assets/cars.webp';
}

export const atlasReady = () => ATLAS.ready;

// Atlas hücresini ayrı tuvale keser. wu/hu: dünya birimi çizim boyutu
export function sheetSprite(key, len) {
  const cell = CAR_SHEET.cells[key];
  if (!ATLAS.ready || !cell) return null;
  const [x, y, w, h] = cell;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  c.getContext('2d').drawImage(ATLAS.img, x, y, w, h, 0, 0, w, h);
  c.wu = len * DRAW_LEN * FRAME_L;
  c.hu = (c.wu * h) / w;
  return c;
}

// Üretilecek sprite listesi: oyuncu boyaları, sivil trafik ve polis
export function spriteList(cfg) {
  const list = [];
  for (const c of cfg.cars) {
    c.paints.forEach((p, i) => list.push({
      key: `p:${c.id}:${i}`, model: c.shape, px: 288, ar: c.shape === 'moto' ? 0.56 : 0.5,
      paint: { ...p, accent: p.accent || c.accent, premium: 1, rim: c.rim, caliper: '#ff3a2a', mirror: 'black' },
    }));
  }
  const fin = cfg.npc.finishes;
  for (const k of Object.keys(cfg.npc.types)) {
    const t = cfg.npc.types[k];
    const big = t.len > 60;
    t.colors.forEach((color, i) => list.push({
      key: `npc:${k}:${i}`, model: t.model || k, px: big ? 300 : 168, ar: big ? 0.36 : 0.5,
      paint: { color, finish: fin[i % 3], accent: t.accent || t.colors[(i + 1) % t.colors.length], sign: k === 'taxi' ? { text: 'TAKSİ', c: '#ffd23f' } : null },
    }));
  }
  const cops = {
    car: ['egea', { color: '#f2f4f7', finish: 'gloss', band: '#1c4fb0', roof: '#f2f4f7', police: 1, text: 'POLİS', textColor: '#1c4fb0' }],
    fast: ['bavyera', { color: '#16305f', finish: 'metal', police: 1, band: '#ffffff', text: 'POLİS' }],
    advanced: ['tog', { color: '#14161b', finish: 'metal', police: 1, band: '#ff2a3c' }],
    swat: ['minibus', { color: '#23272e', finish: 'matte', police: 1, band: '#ffd23f', text: 'ÖZEL HAREKAT' }],
    moto: ['moto', { color: '#1c4fb0', finish: 'gloss', accent: '#ffffff' }],
  };
  for (const k of Object.keys(cops)) list.push({ key: `cop:${k}`, model: cops[k][0], px: 200, ar: k === 'swat' ? 0.44 : k === 'moto' ? 0.56 : 0.5, paint: cops[k][1] });
  return list;
}
