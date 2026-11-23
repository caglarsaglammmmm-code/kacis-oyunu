// Haritadaki tabelaların dili: oyun dili Türkçe ise Türkçe, Türkçe dışındaki BÜTÜN dillerde İngilizce.
// Dünya (world.js) tabelaya hep Türkçe yazıyı koyar; çizim anında tabelaText() çevirir (render.js, buildings.js,
// landmarks.js, stadium.js). Dil değişince çizilmiş zemin ve tabela görüntüleri yeniden üretilir (render.js draw).
// Sürüme göre değişen adların İngilizcesi isim tablosundadır (names/tablo.mjs ingilizce -> NAMES.ingilizce);
// burada iki sürümde ortak genel adlar durur. Tabloda olmayan yazı olduğu gibi kalır (testler eksik bırakmaz).
// Bağımlılığı yalnız dil durumu ve isim tablosudur; birim testle sınanır.
import { NAMES } from './names.js';
import { getLang } from './i18n/index.js';

export const TABELA_EN = {
  // Dükkânlar: İngilizce konuşan birinin gerçekte kullandığı adlar (kelimesi kelimesine değil)
  Bakkal: 'Grocery Store', 'Kardeşler Bakkal': 'Brothers Grocery', 'Köşe Bakkal': 'Corner Store',
  Büfe: 'Snack Kiosk', 'Büfe 7/24': '24/7 Snack Kiosk', 'Köşe Büfe': 'Corner Kiosk', 'Köşe Bayii': 'Corner Newsstand',
  Berber: 'Barbershop', 'Erkek Berberi': "Men's Barbershop", Kuaför: 'Hair Salon', 'Bayan Kuaförü': "Women's Hair Salon",
  Eczane: 'Pharmacy', 'Nöbetçi Eczane': '24-Hour Pharmacy',
  Fırın: 'Bakery', 'Ekmek Fırını': 'Bakery', 'Etli Ekmek Fırını': 'Flatbread Bakery', 'Etliekmek Salonu': 'Flatbread House',
  'Fırın Kebabı': 'Oven-Roasted Kebab', 'Bamya Çorbası': 'Okra Soup House',
  Dönerci: 'Doner Kebab Shop', 'Usta Döner': "Master's Doner", 'Usta Dönerci': "Master's Doner Kebab", 'Soslu Döner': 'Saucy Doner',
  Kebapçı: 'Kebab Shop', Pideci: 'Pide Bakery', 'Hacı Usta Pide': "Master's Pide", Lahmacun: 'Turkish Pizza',
  Ciğerci: 'Liver Kebab Shop', Çiğköfte: 'Kofte Wraps', Börekçi: 'Pastry Shop', Tatlıcı: 'Dessert Shop', 'Tost Evi': 'Sandwich Shop',
  Lokanta: 'Diner', Kahveci: 'Coffee House', 'Çay Ocağı': 'Tea Stand', 'Mahalle Çay Ocağı': 'Neighborhood Tea Stand',
  Kasap: 'Butcher Shop', Manav: 'Greengrocer', Züccaciye: 'Housewares Store', Kırtasiye: 'Stationery Store', Emlakçı: 'Real Estate Agency',
  Terzi: 'Tailor', Tuhafiye: 'Sewing Supplies', Tamirci: 'Auto Repair', 'Oto Yıkama': 'Car Wash', Telefoncu: 'Phone Store',
  'Bit Bilgisayar': 'Bit Computers', 'Piksel Oyun Salonu': 'Pixel Arcade',
  // Kafe, çay bahçesi, spor salonu
  'Çınar Kafe': 'Plane Tree Cafe', 'Melodi Kafe': 'Melody Cafe', 'Akustik Kafe': 'Acoustic Cafe', 'Sahne Kafe': 'Stage Cafe',
  'Çınaraltı Çay Bahçesi': 'Plane Tree Tea Garden', 'Bahçe Çay Evi': 'Garden Tea House', 'Çay Bahçesi': 'Tea Garden',
  'Demir Spor Salonu': 'Iron Gym', 'Kondisyon Spor Salonu': 'Fitness Center',
  // Marketler
  'Ucuzluk Market': 'Bargain Market', 'Bereket Gross': 'Bounty Wholesale', 'Komşu Market': 'Neighborhood Market',
  'Anadolu Gross': 'Anatolia Wholesale', 'Kervan Gross': 'Caravan Wholesale', 'Hesaplı Market': 'Thrifty Market',
  'Doyuran Gross': 'Hearty Wholesale', 'Tasarruf Market': 'Savings Market',
  // Plaza, iş merkezi, otel
  'Merkez İş Merkezi': 'Central Business Center', 'Kristal Plaza': 'Crystal Plaza', 'Boğaz Tower': 'Strait Tower',
  'Anadolu Plaza': 'Anatolia Plaza', 'Sultan Rezidans': 'Sultan Residences', 'Lale Rezidans': 'Tulip Residences',
  'Marmara Residence': 'Marmara Residences', 'Mavi Kule': 'Blue Tower', 'Atlas Tower': 'Atlas Tower',
  'Grand Otel': 'Grand Hotel', 'Otel Boğaz': 'Strait Hotel', 'Park Hotel': 'Park Hotel', 'Otel Saray': 'Palace Hotel', 'Mavi Otel': 'Blue Hotel',
  // Siteler
  'Yeşil Tepe Sitesi': 'Green Hill Residences', 'Boğaz Evleri': 'Strait Homes', 'Mavi Konak Sitesi': 'Blue Mansion Residences',
  'Çamlık Sitesi': 'Pine Grove Residences', 'Güneş Sitesi': 'Sunshine Residences', 'Lale Evleri': 'Tulip Homes',
  'Marmara Konutları': 'Marmara Homes', 'Park Evleri': 'Park Homes',
  // Kamu yapıları
  'Şehir Hastanesi': 'City Hospital',
  // Bina, yol ve zemine çizilen küçük yazılar
  'OKUL TAŞITI': 'SCHOOL BUS', 'İŞ HANI': 'OFFICE BUILDING', ACİL: 'EMERGENCY', AMBULANS: 'AMBULANCE', DUR: 'STOP',
  // Dükkân önü afişleri
  '%30 İNDİRİM': '30% OFF', 'BUGÜNE ÖZEL': 'TODAY ONLY', '%50 İNDİRİM': '50% OFF', '2 AL 1 ÖDE': 'BUY 2, GET 1 FREE',
  KAMPANYA: 'SALE', 'FIRSAT!': 'GREAT DEAL!', 'YENİ AÇILDI': 'NOW OPEN', 'SON GÜN': 'LAST DAY',
  // Araç üstü yazılar (araç atlası assets/cars-en.webp ve yedek çizimler)
  TAKSİ: 'TAXI', DOLMUŞ: 'SHUTTLE', BELEDİYE: 'CITY BUS', NAKLİYAT: 'FREIGHT', POLİS: 'POLICE', 'ÖZEL HAREKAT': 'SWAT',
  '12 MERKEZ': '12 DOWNTOWN', PİKAP: 'PICKUP',
  // Yayaların çarpılınca bağırdığı sözler (dünyada yüzen yazı)
  'SİMİTLERİM!': 'MY BAGELS!', 'SİMİİİT!': 'BAGELS!', 'TEPSİM!': 'MY TRAY!', 'ZİLİM BOZUK!': 'MY BELL IS BROKEN!', 'YOLDAN!': 'OUT OF THE WAY!',
  'PAKET GİTTİ!': 'THERE GOES THE PACKAGE!', 'SİPARİŞ!': 'MY DELIVERY!', 'OHA!': 'WHOA!', 'ÇAYLAR!': 'THE TEA!', 'BARDAKLAR!': 'THE GLASSES!',
  'TAZE DEMLEMİŞTİM!': 'I JUST BREWED THAT!', 'DÜKKÂNIM!': 'MY SHOP!', 'HOOP!': 'HEY!', 'YAVAŞ OĞLUM!': 'SLOW DOWN, KID!',
  'NEFESİM!': "I'M OUT OF BREATH!", 'KOŞTUM YA!': 'I WAS JOGGING!', 'DUR ORADA!': 'STOP RIGHT THERE!', 'GİRİŞ YOK!': 'NO ENTRY!',
  'TEZGÂHIM!': 'MY STALL!', 'MALLAR!': 'MY GOODS!', 'YANDIM!': "I'M DONE FOR!", 'NOLUYOR YA!': "WHAT'S GOING ON?!", 'AMAN!': 'OH DEAR!',
  'İMDAT!': 'HELP!', 'EYVAH!': 'OH NO!', 'YAPMA!': "DON'T!", 'ABİ YA!': 'COME ON, MAN!', 'MİYAV!': 'MEOW!',
};

// Türkçe dışında İngilizce mi yazılacak
export const tabelaEnglish = () => getLang() !== 'tr';

// Tabelanın o anki dildeki yazısı
export function tabelaText(tr) {
  if (!tr || !tabelaEnglish()) return tr;
  const en = (NAMES.ingilizce && NAMES.ingilizce[tr]) || TABELA_EN[tr];
  return en === undefined ? tr : en;
}

// Dilden bağımsız İngilizce karşılık (önceden çizilen İngilizce afişler için)
tabelaText.en = (tr) => {
  const en = (NAMES.ingilizce && NAMES.ingilizce[tr]) || TABELA_EN[tr];
  return en === undefined ? tr : en;
};

// Türkçe tabela yazısının İngilizce karşılığı var mı (test ve araçlar için)
export const tabelaKnown = (tr) => Boolean((NAMES.ingilizce && NAMES.ingilizce[tr]) || TABELA_EN[tr]);
