# Drift Lab (Play Store) varlık ve lisans listesi

Play Store paketine (com.driftlab.game) giren her görsel, ses, yazı tipi ve kod parçasının kaynağı.
Kontrol: `node tools/play-clean.mjs --media` paketteki tüm medya dosyalarını listeler.

## Görseller

| Dosya | Kaynak | Lisans |
|---|---|---|
| gorseller/drift-lab-cover.png (DRIFT LAB kapak görseli), gorseller/start-button.png (sarı-siyah START düğmesi) | Kullanıcının verdiği iki kaynak görsel (Masaüstü\ai oyun görsel klasörü, 2 Kasım 2026). Hangi araçla üretildiği ve kullanım koşulları **kullanıcı tarafından teyit edilmeli** | Kullanıcıya göre proje sahibine ait (teyit bekliyor) |
| assets/ui/*.png (BAŞLA düğmesi, kapak, çerçeve, garaj arka planı, plaka, uyarı şeridi) | Yukarıdaki iki kaynak görselden `tools/make-pixel-assets.mjs` ve `tools/make-start-button.mjs` ile türetildi | Kaynak görsellere bağlı |
| icons/*.png, gorseller/play-store/icon-512.png ve feature-1024x500.png | Kapak görselinden `tools/make-pixel-assets.mjs`, `tools/apple-icon.mjs` ile türetildi | Kaynak görsellere bağlı |
| assets/cars.webp (araç sprite sayfası) | Projede kodla üretildi: `tools/bake-cars.mjs` (`js/cars.js`, `js/pixelcars.js` çizimleri) | Proje sahibine ait |
| Harita, binalar, tabelalar, araçlar, anıt heykeli, stadyumlar, efektler | Oyun içinde Canvas ile çizilir (`js/*.js`), dosya yok | Proje sahibine ait |

Play Store paketinde fotoğraf yoktur. Kullanıcının verdiği dört anıt fotoğrafı yalnız arkadaş sürümüne girer (tools/flavor.mjs).

## Sesler ve müzik

Ses dosyası yoktur. Motor, egzoz, siren, patlama ve arayüz sesleri oyun içinde WebAudio ile üretilir (`js/audio.js`).

## Yazı tipleri (hepsi SIL Open Font License 1.1, lisans metni `fonts/OFL-*.txt`, Play paketinde de taşınır)

| Yazı tipi | Telif | Paket |
|---|---|---|
| Anton | The Anton Project Authors | @fontsource/anton |
| Bungee | The Bungee Project Authors | Google Fonts |
| Lobster | The Lobster Project Authors | @fontsource/lobster |
| Monoton | Vernon Adams | @fontsource/monoton |
| Nunito | The Nunito Project Authors | Google Fonts |
| Oswald | The Oswald Project Authors | @fontsource/oswald |
| Pacifico | The Pacifico Project Authors | @fontsource/pacifico |
| Pixelify Sans | The Pixelify Sans Project Authors | @fontsource/pixelify-sans |
| Playfair Display | The Playfair Display Project Authors | Google Fonts |
| Press Start 2P | The Press Start 2P Project Authors | @fontsource/press-start-2p |
| Righteous | Brian J. Bonislawsky (Astigmatic) | @fontsource/righteous |
| Tilt Neon | The Tilt Project Authors | @fontsource/tilt-neon |

## Kod

| Bileşen | Lisans |
|---|---|
| Oyun kodu (`js/`, `css/`, `index.html`) | Proje sahibine ait |
| Capacitor (Android kabuğu, @capacitor/android ve @capacitor/core) | MIT |
| AndroidX kütüphaneleri | Apache 2.0 |

`vendor/three.min.js` (MIT) oyun paketine girmez; menü CSS ile çizilir.

## Lisansı belirsiz kalan

- Kapak ve START düğmesi kaynak görselleri (yukarıda): kullanıcının verdiği yapay zekâ görselleri; üretildikleri aracın ticari kullanım koşulları teyit edilmeli. Kapaktaki pembe araba logosuz ve adsızdır, ama 1990lar Japon drift coupe tarzındadır; gerçek bir modele benzerlik riski düşük olsa da tamamen sıfır değildir.
