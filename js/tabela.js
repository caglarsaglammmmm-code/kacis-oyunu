// Haritadaki tabelaların dili: oyun dili Türkçe ise Türkçe, Türkçe dışındaki BÜTÜN dillerde İngilizce.
// Dünya (world.js) tabelaya hep Türkçe yazıyı koyar; çizim anında tabelaText() çevirir (render.js, buildings.js,
// landmarks.js, stadium.js). Dil değişince çizilmiş zemin ve tabela görüntüleri yeniden üretilir (render.js draw).
// Sürüme göre değişen adların İngilizcesi isim tablosundadır (names/tablo.mjs ingilizce -> NAMES.ingilizce);
// burada iki sürümde ortak genel adlar durur. Tabloda olmayan yazı olduğu gibi kalır (testler eksik bırakmaz).
// Bağımlılığı yalnız dil durumu ve isim tablosudur; birim testle sınanır.
import { NAMES } from './names.js';
import { getLang } from './i18n/index.js';

export const TABELA_EN = {
  // Dükkânlar
  Bakkal: 'Grocery', 'Kardeşler Bakkal': 'Brothers Grocery', 'Köşe Bakkal': 'Corner Grocery',
  Büfe: 'Kiosk', 'Büfe 7/24': 'Kiosk 24/7', 'Köşe Büfe': 'Corner Kiosk', 'Köşe Bayii': 'Corner Newsstand',
  Berber: 'Barber', 'Erkek Berberi': "Men's Barber", Kuaför: 'Hairdresser', 'Bayan Kuaförü': "Ladies' Hairdresser",
  Eczane: 'Pharmacy', 'Nöbetçi Eczane': 'On-Duty Pharmacy',
  Fırın: 'Bakery', 'Ekmek Fırını': 'Bread Bakery', 'Etli Ekmek Fırını': 'Flatbread Bakery', 'Etliekmek Salonu': 'Flatbread House',
  'Fırın Kebabı': 'Oven Kebab', 'Bamya Çorbası': 'Okra Soup',
  Dönerci: 'Doner Shop', 'Usta Döner': 'Master Doner', 'Usta Dönerci': 'Master Doner Shop', 'Soslu Döner': 'Saucy Doner',
  Kebapçı: 'Kebab House', Pideci: 'Pide House', 'Hacı Usta Pide': "Master's Pide", Lahmacun: 'Lahmacun',
  Ciğerci: 'Liver Kebab', Çiğköfte: 'Raw Meatballs', Börekçi: 'Pastry Shop', Tatlıcı: 'Dessert Shop', 'Tost Evi': 'Toast House',
  Lokanta: 'Restaurant', Kahveci: 'Coffee House', 'Çay Ocağı': 'Tea Stall', 'Mahalle Çay Ocağı': 'Neighborhood Tea Stall',
  Kasap: 'Butcher', Manav: 'Greengrocer', Züccaciye: 'Crockery Store', Kırtasiye: 'Stationery', Emlakçı: 'Real Estate',
  Terzi: 'Tailor', Tuhafiye: 'Haberdashery', Tamirci: 'Repair Shop', 'Oto Yıkama': 'Car Wash', Telefoncu: 'Phone Shop',
  'Bit Bilgisayar': 'Bit Computers', 'Piksel Oyun Salonu': 'Pixel Arcade',
  // Kafe, çay bahçesi, spor salonu
  'Çınar Kafe': 'Plane Tree Cafe', 'Melodi Kafe': 'Melody Cafe', 'Akustik Kafe': 'Acoustic Cafe', 'Sahne Kafe': 'Stage Cafe',
  'Çınaraltı Çay Bahçesi': 'Plane Tree Tea Garden', 'Bahçe Çay Evi': 'Garden Tea House', 'Çay Bahçesi': 'Tea Garden',
  'Demir Spor Salonu': 'Iron Gym', 'Kondisyon Spor Salonu': 'Fitness Gym',
  // Marketler
  'Ucuzluk Market': 'Bargain Market', 'Bereket Gross': 'Bounty Wholesale', 'Komşu Market': 'Neighbor Market',
  'Anadolu Gross': 'Anatolia Wholesale', 'Kervan Gross': 'Caravan Wholesale', 'Hesaplı Market': 'Thrifty Market',
  'Doyuran Gross': 'Hearty Wholesale', 'Tasarruf Market': 'Savings Market',
  // Plaza, iş merkezi, otel
  'Merkez İş Merkezi': 'Central Business Center', 'Kristal Plaza': 'Crystal Plaza', 'Boğaz Tower': 'Strait Tower',
  'Anadolu Plaza': 'Anatolia Plaza', 'Sultan Rezidans': 'Sultan Residence', 'Lale Rezidans': 'Tulip Residence',
  'Marmara Residence': 'Marmara Residence', 'Mavi Kule': 'Blue Tower', 'Atlas Tower': 'Atlas Tower',
  'Grand Otel': 'Grand Hotel', 'Otel Boğaz': 'Hotel Strait', 'Park Hotel': 'Park Hotel', 'Otel Saray': 'Hotel Palace', 'Mavi Otel': 'Blue Hotel',
  // Siteler
  'Yeşil Tepe Sitesi': 'Green Hill Residence', 'Boğaz Evleri': 'Strait Homes', 'Mavi Konak Sitesi': 'Blue Mansion Residence',
  'Çamlık Sitesi': 'Pine Grove Residence', 'Güneş Sitesi': 'Sun Residence', 'Lale Evleri': 'Tulip Homes',
  'Marmara Konutları': 'Marmara Homes', 'Park Evleri': 'Park Homes',
  // Kamu yapıları
  'Şehir Hastanesi': 'City Hospital',
  // Bina üstüne çizilen küçük yazılar
  'OKUL TAŞITI': 'SCHOOL BUS', 'İŞ HANI': 'BUSINESS CENTER', ACİL: 'EMERGENCY', AMBULANS: 'AMBULANCE', DUR: 'STOP',
  // Dükkân önü afişleri
  '%30 İNDİRİM': '30% OFF', 'BUGÜNE ÖZEL': 'TODAY ONLY', '%50 İNDİRİM': '50% OFF', '2 AL 1 ÖDE': 'BUY 2 PAY 1',
  KAMPANYA: 'SPECIAL DEAL', 'FIRSAT!': 'BARGAIN!', 'YENİ AÇILDI': 'NEW OPENING', 'SON GÜN': 'LAST DAY',
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
