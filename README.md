# Penci Zorn

Mobil öncelikli, Türk sokaklarında geçen kuşbakışı polis kaçış ve drift oyunu. Saf HTML, CSS, JavaScript ve Canvas; çerçeve ve derleme adımı yok. Yatay ve dikey ekranda oynanır, çevrimdışı çalışır. Tüm görseller ve sesler koddan üretilir.

**Oyna:** https://caglarsaglammmmm-code.github.io/kacis-oyunu/

**Android APK indir (hep en güncel sürüm):** https://github.com/caglarsaglammmmm-code/kacis-oyunu/releases/latest/download/PenciZorn.apk

## Oyunda neler var

- **Biyomlar:** şehir (gökdelenli merkez dahil), sahil (kum, sığ su, deniz, köprüler), orman, çöl, kırsal. Zemin, nesne ve bina biyoma göre değişir.
- **Özel güçler:** Patlama, Görünmezlik (15 sn), Can, Dev mod (15 sn).
- **Garaj:** Tofaş Doğan ile başlarsın; coinlerle motosiklet, Grandland, TOG, Şahin, Anadol, Murat 131, Egea, Clio ve Duster açılır.
- **Polisler:** normal, hızlı, motosiklet, SWAT, gelişmiş, tank. Sekiz farklı siren var, aynı anda gelen polisler farklı çalar.
- **Gece-gündüz:** sokak lambaları, pencereler, tabelalar, neon mekânlar ve araç farları gece yanar.
- **Türk sokakları:** tabelalı dükkânlar, marketler, çay ocakları, Nevada Kafe, kapalı pazar, kediler, simitçiler, trafik ışıkları, dolmuş, taksi ve belediye otobüsü. Haritada tek bir turuncu Sistem Koleji vardır.

## v4 yenilikleri

Her model için ayrı araç çizimi ve garajda yandan profil, marka havalı özgün NPC araçlar, yeni menü, garaj ve HUD, zincir mağazalar, bankalar, rezidans ve iş merkezleri, cami, stadyum, hastane, okul, gecekondu, çıkmaz sokaklar, pavyonlar, Natura Park ve Doğa Şehir siteleri, çok büyük tek Sistem Koleji. Tabelalardaki mağaza ve banka adları yalnızca yazıdır, gerçek logo kullanılmaz.

## v3 oyun hissi iyileştirmeleri

Coin kazancı yeniden dengelendi, sert darbede kısa duraksama ve kamera itmesi eklendi, kamera drift sırasında daha sakin takip ediyor, duvara saplanan araba kendiliğinden geri çıkıyor, baş parmak geçişi yanlışlıkla geri vites sayılmıyor, oyuncu polisten çok açılınca kovalama kopmuyor.

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

Sonuç: `dist/PenciZorn.apk`. Debug imzalıdır: telefona kurulur, Google Play'e yüklenemez. Telefonda indirip açın ve bilinmeyen kaynaktan yükleme iznini verin.

Yeni sürüm yayınlamak için `android/app/build.gradle` içindeki sürümü artırın, sonra APK'yı bu adla Release'e ekleyin:

```
gh release create vX.Y.Z dist/PenciZorn.apk --title "vX.Y.Z"
```

Dosya adı sabit kaldığı için oyundaki **APK İndir** düğmesi kendiliğinden en güncel sürüme gider.

## Ayarlar ve test kısayolları

Tüm denge değerleri tek dosyada: `js/config.js` (zaman eşikleri, polis gücü ve sayısı, hasar, arabalar, skor). Tüm araç hızları tek yerden, `speedScale` ile ayarlanır. Değiştirince `npm run bundle` çalıştırın.

- **Başlangıç süresi:** `config.js` içinde `dev.startTime` veya adres çubuğunda `?t=280`.
- **Ölümsüzlük:** `dev.godMode` veya `?god=1`. Ayrıca Ayarlar ekranında sürüm yazısına 7 kez dokununca gizli geliştirici bölümü açılır.

Örnek: `http://localhost:8080/?t=280&god=1` tanklarla başlar.

## Komutlar

| Komut | İş |
|---|---|
| `npm test` | Birim testleri |
| `npm run e2e` | Sunucu açıkken Edge'de uçtan uca deneme (dokunma, ekranlar, çevrimdışı, kare süresi). `E2E_SECONDS`, `E2E_THROTTLE` |
| `node tools/balance.mjs 40 0` | Botlarla denge ölçümü. İkinci sayı başlangıç saniyesi |
| `node tools/turnbot.mjs 40 150` | Dönüş botu: sokak dönüşü, kavşak, U dönüşü ve çıkmaz sokak dener, takılanları sayar |
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
js/crowd.js    yayalar, sivil trafik  js/art.js      araba, bina ve güç çizimleri
```

Fontlar (Bungee, Nunito, Playfair Display) SIL Open Font License ile dağıtılır; lisanslar `fonts/` içindedir.
