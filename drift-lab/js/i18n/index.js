// Dil sistemi. Bütün arayüz metinleri js/i18n/<dil>.js dosyalarındadır, kodda sabit metin yoktur.
// DOM'a dokunmaz (ui.js uygular); birim testle sınanır.
// Adlar tek dosyalık pakette çakışmasın diye öneklidir (tools/bundle-file.mjs).
import TR from './tr.js';
import EN from './en.js';
import JA from './ja.js';
import ZH from './zh.js';
import ES from './es.js';
import DE from './de.js';

export const LANG_PACKS = { tr: TR, en: EN, ja: JA, zh: ZH, es: ES, de: DE };
// Seçim listesinde her dil kendi adıyla görünür
export const LANGS = { tr: 'Türkçe', en: 'English', ja: '日本語', zh: '简体中文', es: 'Español', de: 'Deutsch' };
// Geliştirici adı her dilde aynı kalır, çevrilmez
export const DEVELOPER = 'Çağlar Sağlam';
export const LOCALES = { tr: 'tr-TR', en: 'en-US', ja: 'ja-JP', zh: 'zh-CN', es: 'es-ES', de: 'de-DE' };

const langState = { code: 'tr', pack: TR, listeners: [], numbers: new Map() };

// Tarayıcı ya da telefon dili: desteklenen ilk dil, yoksa İngilizce
export function detectLang(list) {
  for (const l of list || []) {
    const k = String(l).toLowerCase().split(/[-_]/)[0];
    if (LANG_PACKS[k]) return k;
  }
  return 'en';
}

export function setLang(code) {
  const next = LANG_PACKS[code] ? code : 'en';
  if (next === langState.code) return next;
  langState.code = next;
  langState.pack = LANG_PACKS[next];
  for (const f of langState.listeners) f(next);
  return next;
}

export const getLang = () => langState.code;
export const onLang = (f) => langState.listeners.push(f);

function langFind(p, key) {
  let v = p;
  for (const part of key.split('.')) {
    if (v == null) return undefined;
    v = v[part];
  }
  return v;
}

// tx('over.best', { score: 10 }). Eksik anahtar İngilizceye, o da yoksa Türkçeye düşer
export function tx(key, params) {
  let s = langFind(langState.pack, key);
  if (s === undefined) s = langFind(EN, key);
  if (s === undefined) s = langFind(TR, key);
  if (s === undefined) return key;
  if (typeof s !== 'string' || !params) return s;
  return s.replace(/\{(\w+)\}/g, (m, k) => (params[k] !== undefined ? String(params[k]) : m));
}

// Sayı biçimi dile göre: 1.234 / 1,234 / 1 234
export function txNum(n, digits = 0) {
  const key = `${langState.code}:${digits}`;
  let f = langState.numbers.get(key);
  if (!f) {
    f = new Intl.NumberFormat(LOCALES[langState.code], { minimumFractionDigits: digits, maximumFractionDigits: digits });
    langState.numbers.set(key, f);
  }
  return f.format(n);
}

// Test ve denetim için: bir dilin bütün anahtarları
export function langKeys(code) {
  const out = [];
  const walk = (o, pre) => {
    for (const [k, v] of Object.entries(o)) {
      const key = pre ? `${pre}.${k}` : k;
      if (v && typeof v === 'object' && !Array.isArray(v)) walk(v, key);
      else out.push(key);
    }
  };
  walk(LANG_PACKS[code], '');
  return out;
}
