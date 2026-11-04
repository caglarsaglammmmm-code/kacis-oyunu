// iPhone/iPad "Ana Ekrana Ekle" rehberi. Yalnız iOS'ta Safari veya Chrome ile açılıp henüz ana ekrandan
// (standalone) açılmamışsa ana menüde küçük bir kart gösterir. Android'de, APK içinde ve ana ekrandan açılınca görünmez.
// "Tamam" bu açılış için gizler, "Bir daha gösterme" kalıcıdır (localStorage, erişilemezse sessizce geçer).
import { CONFIG } from './config.js';
import { tx } from './i18n/index.js';

const A2 = CONFIG.a2hs;

// iPhone/iPad/iPod mu (iPadOS masaüstü kimliği dahil). APK orada kurulamaz: indirme düğmesi gizlenir
export function isIOS(nav) {
  const ua = (nav && nav.userAgent) || '';
  return /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && ((nav && nav.maxTouchPoints) || 0) > 1);
}

// null: gösterme. Aksi halde { browser, share }: share = Paylaş düğmesinin yeri ('bottom' | 'top')
export function a2hsPlatform(nav, win) {
  const ua = (nav && nav.userAgent) || '';
  const ipadDesktop = /Macintosh/.test(ua) && (nav.maxTouchPoints || 0) > 1; // iPadOS masaüstü kimliğiyle gelir
  if (!isIOS(nav)) return null;
  const mm = (q) => { try { return !!(win.matchMedia && win.matchMedia(q).matches); } catch { return false; } };
  if (nav.standalone === true || mm('(display-mode: standalone)') || mm('(display-mode: fullscreen)')) return null;
  try { if (win.Capacitor && win.Capacitor.isNativePlatform && win.Capacitor.isNativePlatform()) return null; } catch { /* yok */ }
  const chrome = /CriOS\//.test(ua);
  const safari = !chrome && /Safari\//.test(ua) && !/FxiOS|EdgiOS|OPiOS|GSA\/|FBAN|FBAV|Instagram|Line\//.test(ua);
  if (!chrome && !safari) return null; // Uygulama içi tarayıcılar ana ekrana ekleyemez
  const ipad = /iPad/.test(ua) || ipadDesktop;
  // iPhone Safari'de Paylaş alttaki çubukta; iPad Safari ve iOS Chrome'da üstte
  return { browser: chrome ? 'chrome' : 'safari', share: chrome || ipad ? 'top' : 'bottom' };
}

function readNever() {
  try { return globalThis.localStorage.getItem(A2.key) === 'never'; } catch { return false; }
}
function writeNever() {
  try { globalThis.localStorage.setItem(A2.key, 'never'); } catch { /* özel sekme: yalnız bu açılış */ }
}

export function initA2hs(onTap) {
  const el = typeof document !== 'undefined' && document.getElementById('a2hs');
  if (!el) return null;
  const plat = a2hsPlatform(globalThis.navigator || {}, globalThis);
  if (!plat || readNever()) return null;
  el.dataset.share = plat.share;
  const s1 = el.querySelector('[data-a2hs-step1]');
  s1.dataset.i18n = plat.share === 'top' ? 'a2hs.s1Top' : 'a2hs.s1Bottom';
  for (const t of el.querySelectorAll('[data-i18n]')) t.textContent = tx(t.dataset.i18n);
  const hide = (never) => {
    if (onTap) onTap();
    el.hidden = true;
    if (never) writeNever();
  };
  const bind = (id, never) => {
    const b = document.getElementById(id);
    b.addEventListener('click', (e) => { e.stopPropagation(); hide(never); });
    b.addEventListener('pointerdown', (e) => e.stopPropagation());
  };
  bind('a2hs-ok', false);
  bind('a2hs-never', true);
  setTimeout(() => { el.hidden = false; }, A2.delay * 1000);
  return plat;
}
