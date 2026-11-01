# Play "Veri güvenliği" formu yanıtları

Kaynak koddaki gözleme dayanır: `js/` içinde `fetch`, `XMLHttpRequest`, `WebSocket`, `sendBeacon`, analiz veya reklam kitaplığı yoktur. Android tarafında Capacitor çekirdeği dışında eklenti yoktur.

| Form sorusu | Yanıt |
|---|---|
| Uygulama gerekli kullanıcı veri türlerinden herhangi birini topluyor veya paylaşıyor mu? | Hayır |
| Toplanan veri | Yok |
| Paylaşılan veri | Yok |
| Hesap oluşturma | Yok, bu yüzden hesap silme bağlantısı gerekmez |
| Reklam kimliği | Kullanılmıyor (Play Console reklam kimliği beyanı: Hayır) |
| Reklam içeriyor mu? | Hayır |

## Oyunun internet ve veri kullanımı

| Yer | Ne yapar | Veri çıkışı |
|---|---|---|
| Yerel depo (`localStorage`, anahtar `drift-lab-v1`) | Skor, coin, araçlar, boyalar, ayarlar | Cihazda kalır |
| Android `INTERNET` izni | Capacitor varsayılanı, WebView için bildirilmiş | Oyun kullanmaz |
| Web sürümü: GitHub Pages | Sayfa dosyalarını sunar | GitHub'ın teknik kayıtları |
| Web sürümü: service worker | Dosyaları tarayıcıda önbelleğe alır | Yok |
| Web menüsü: "APK İndir" düğmesi | GitHub Release bağlantısı. Android uygulamasında gizlidir | Yalnızca kullanıcı tıklarsa |
| Ayarlar: Gizlilik Politikası | Uygulama içi yerel sayfa | Yok |

Yazı tipleri, sesler ve görseller pakete dahildir veya koddan üretilir; dış sunucudan yüklenmez.
