# Drift Lab

Mobil öncelikli, Türkiye sokaklarını andıran bir şehirde geçen kuşbakışı polis kaçış ve drift oyunu. Saf HTML, CSS, JavaScript ve Canvas; çerçeve ve derleme adımı yok. Yatay ve dikey ekranda oynanır, çevrimdışı çalışır. Tüm görseller ve sesler koddan üretilir; oyundaki araç, mağaza, banka ve mekân adlarının tamamı kurgudur.

**Oyna:** https://caglarsaglammmmm-code.github.io/kacis-oyunu/drift-lab/

**Android APK indir:** https://github.com/caglarsaglammmmm-code/kacis-oyunu/releases/download/driftlab-v7.0.0/DriftLab.apk

**Gizlilik politikası:** https://caglarsaglammmmm-code.github.io/kacis-oyunu/drift-lab/privacy.html

## Oyunda neler var

- **Biyomlar:** şehir, sahil, orman, çöl, kırsal. Zemin, nesne ve bina biyoma göre değişir.
- **Özel güçler:** Patlama, Görünmezlik, Can, Dev mod.
- **Garaj:** Atmaca ile başlarsın; coinlerle motosiklet, Granit SUV, Elektra X1, Şimşek, Çınar A, Efe 131, Marmara S, Liva ve Bozkır 4x4 açılır.
- **Polisler:** normal, hızlı, motosiklet, SWAT, gelişmiş, tank; 225. saniyeden sonra uzaylılar.
- **Gece-gündüz:** sokak lambaları, pencereler, tabelalar ve araç farları gece yanar.
- **Şehir:** tabelalı dükkânlar, marketler, çay ocakları, müzikli kafeler, çay bahçeleri, spor salonları, kapalı pazar, kediler, trafik ışıkları, dolmuş, taksi ve şehir otobüsü. Haritada tek bir turuncu Mandalina Koleji vardır.

## İçerik kuralları

- Çocuk, yaşlı, öğrenci, bebek arabalı ve tekerlekli sandalyeli yayalara araç değmez; kenara çekilirler.
- Yetişkin yaya teması çizgi film tarzındadır, kan veya yaralanma yoktur.
- Cami çarpılamaz ve hiçbir şeyle yıkılamaz.

## Kontroller

| Girdi | Sonuç |
|---|---|
| Sağ yarıya basılı tut (veya sağ ok / D) | Sağa döner, hızlıysa drift atar |
| Sol yarıya basılı tut (veya sol ok / A) | Sola döner, hızlıysa drift atar |
| İkisine birden bas | Durur, geri gider |

Araba kendi gider. Direksiyonu sonuna kadar kırınca hız keser, bırakınca kayarak toparlar.

## Açma

- **Çift tıklama:** `index.html`. `js/` altında değişiklik yaparsanız `npm run bundle` çalıştırın; `npm test` kopya eskiyse hata verir.
- **Yerel sunucu:** `npm run serve`, sonra `http://localhost:8080`.

## Android

Gereksinim: JDK 21 ve Android SDK 36. `JAVA_HOME` ve `ANDROID_HOME` tanımlı değilse `%LOCALAPPDATA%\Android\jdk-21` ve `%LOCALAPPDATA%\Android\Sdk` kullanılır.

```
npm install
npm run android:build
```

Sonuç: `dist/DriftLab.apk` ve `dist/DriftLab.aab`. Uygulama kimliği `com.driftlab.game`. İmza anahtarı depoda değildir; yolu ve parolası `~/.driftlab/keystore.properties` dosyasından okunur. Anahtar kaybolursa mağazadaki sürüm güncellenemez, yedekleyin.

Yeni sürümde `android/app/build.gradle` içindeki `versionCode` değerini artırın.

## Mağaza dosyaları

`store/` klasöründe Türkçe ve İngilizce mağaza metinleri ile Play Veri güvenliği formu yanıtları vardır. Gizlilik politikası `privacy.html`.

## Ayarlar ve test kısayolları

Tüm denge değerleri tek dosyada: `js/config.js`. Tüm araç hızları tek yerden, `speedScale` ile ayarlanır. Değiştirince `npm run bundle` çalıştırın.

- **Başlangıç süresi:** `config.js` içinde `dev.startTime` veya adres çubuğunda `?t=280`.
- **Ölümsüzlük:** `dev.godMode` veya `?god=1`.

## Komutlar

| Komut | İş |
|---|---|
| `npm test` | Birim testleri |
| `npm run e2e` | Sunucu açıkken Edge'de uçtan uca deneme |
| `node tools/balance.mjs 40 0` | Botlarla denge ölçümü |
| `node tools/turnbot.mjs 40 150` | Dönüş botu: sokak dönüşü, kavşak, U dönüşü ve çıkmaz sokak dener |
| `node tools/name-scan.mjs` | Eski isim taraması |
| `npm run icons` | Simge ve açılış görsellerini yeniden üretir |

Dosyalar değişince `sw.js` içindeki `CACHE` sürümünü artırın.

Fontlar SIL Open Font License ile dağıtılır; lisanslar `fonts/` içindedir.
