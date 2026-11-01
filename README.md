# Kaç Kaçabilirsen

Mobil öncelikli, kuşbakışı polis kaçış ve drift oyunu. Saf HTML, CSS, JavaScript ve Canvas; çerçeve ve derleme adımı yok. Yatay ve dikey ekranda oynanır, çevrimdışı çalışır. Tüm görseller ve sesler koddan üretilir.

**Oyna:** https://caglarsaglammmmm-code.github.io/kacis-oyunu/

## Kontroller

| Girdi | Sonuç |
|---|---|
| Sağ yarıya basılı tut (veya sağ ok / D) | Sağa döner, drift atar |
| Sol yarıya basılı tut (veya sol ok / A) | Sola döner, drift atar |
| İkisine birden bas | Durur, geri gider |

Araba kendi gider. Bırakınca kayarak toparlar.

## Açma

- **Çift tıklama:** `index.html`. Tarayıcılar `file://` üzerinde ES modül yüklemediği için `js/app.file.js` kopyası kullanılır. `js/` altında değişiklik yaparsanız `npm run bundle` çalıştırın; `npm test` kopya eskiyse hata verir.
- **Yerel sunucu:** `npm run serve`, sonra `http://localhost:8080`. Aynı Wi-Fi'daki telefon için ekranda yazan adresi açın.
- **Telefona kurma (PWA):** yukarıdaki adresi açın. Android Chrome: menü > *Ana ekrana ekle*. iPhone Safari: Paylaş > *Ana Ekrana Ekle*. İlk açılıştan sonra internetsiz çalışır.

## Android APK

Gereksinim: JDK 21 ve Android SDK 36. `JAVA_HOME` ve `ANDROID_HOME` tanımlı değilse `%LOCALAPPDATA%\Android\jdk-21` ve `%LOCALAPPDATA%\Android\Sdk` kullanılır.

```
npm install
npm run android:build
```

Sonuç: `dist/KacKacabilirsen-debug.apk`. Debug imzalıdır: telefona kurulur, Google Play'e yüklenemez. Dosyayı telefona atıp açın ve bilinmeyen kaynaktan yükleme iznini verin. `dist/` depoya alınmaz, bu komutla üretilir.

## Ayarlar ve test kısayolları

Tüm denge değerleri tek dosyada: `js/config.js` (zaman eşikleri, polis gücü ve sayısı, hasar, arabalar, skor). Değiştirince `npm run bundle` çalıştırın.

- **Başlangıç süresi:** `config.js` içinde `dev.startTime` veya adres çubuğunda `?t=280`.
- **Ölümsüzlük:** `dev.godMode` veya `?god=1`. Ayrıca Ayarlar ekranında sürüm yazısına 7 kez dokununca gizli geliştirici bölümü açılır.

Örnek: `http://localhost:8080/?t=280&god=1` tanklarla başlar.

## Komutlar

| Komut | İş |
|---|---|
| `npm test` | Birim testleri |
| `npm run e2e` | Sunucu açıkken Edge'de uçtan uca deneme (dokunma, ekranlar, çevrimdışı, kare süresi). `E2E_SECONDS`, `E2E_THROTTLE` |
| `node tools/balance.mjs 40 0` | Botlarla denge ölçümü. İkinci sayı başlangıç saniyesi |
| `npm run icons` | Simgeleri yeniden üretir |

Dosyalar değişince `sw.js` içindeki `CACHE` sürümünü artırın, yoksa telefonlar eski kopyayı kullanır.

## Yapı

```
js/config.js   tüm ayarlar            js/police.js   polis yapay zekâsı, akış alanı, barikat
js/physics.js  araba fiziği, drift    js/render.js   Canvas çizimi, sprite üretimi
js/world.js    sonsuz şehir üretimi   js/input.js    dokunma ve klavye
js/game.js     oyun mantığı           js/audio.js    Web Audio sesleri
js/effects.js  parçacık havuzları     js/storage.js  localStorage kaydı
js/ui.js       menüler ve gösterge    js/main.js     döngü ve bağlantılar
```

Fontlar (Bungee, Nunito, Playfair Display) SIL Open Font License ile dağıtılır; lisanslar `fonts/` içindedir.
