// İSİM TABLOSU: oyundaki her gerçek kurum, okul, marka ve yerin iki karşılığı.
//   gercek  : arkadaşlara verilen sürüm (FLAVOR=arkadas)
//   uydurma : Play Store sürümü (FLAVOR=play, varsayılan)
// Bu dosya oyuna kopyalanmaz. tools/names.mjs seçilen sütunla js/names.js üretir;
// Play Store paketinde yalnızca uydurma sütun bulunur.
// Tarihi ve kamu yapıları (müze, cami, meydan, park) iki sürümde aynıdır ama genel
// ve stilize çizilir: gerçek logo ya da marka kullanılmaz.
// Yeni ad ekleyince: npm run names (js/names.js yenilenir), sonra npm run bundle.

const both = (v) => ({ gercek: v, uydurma: v });

export const TABLO = {
  // Uygulama adı ve ikonu iki sürümde aynıdır
  oyun: both('Drift Lab'),
  // Açılış ekranındaki geliştirici adı: Play Store sürümünde yok, açılış yalnız oyunun adını gösterir.
  // (Ana menünün altındaki yapımcı satırı iki sürümde de durur: js/i18n/*.js menu.maker)
  yapimci: { gercek: 'Çağlar Sağlam', uydurma: '' },
  // Menüdeki APK düğmesi: arkadaş sürümü hep son APK'ya gider, Play sürümünde boş (config kendi adresini kullanır)
  indir: { gercek: 'https://github.com/caglarsaglammmmm-code/kacis-oyunu/releases/latest/download/DriftLab-Arkadas.apk', uydurma: '' },

  // Haritanın en büyük binası
  kolej: {
    ad: { gercek: 'SİSTEM KOLEJİ', uydurma: 'MANDALİNA KOLEJİ' },
    ust: { gercek: 'SİSTEM', uydurma: 'MANDALİNA' },
  },

  // Özel ve devlet okulları
  okullar: {
    fen: { gercek: 'Şerife Akkanat Ortaokulu', uydurma: 'Fen Bilimleri Okulu' },
    kolej2: { gercek: 'TED Konya Koleji', uydurma: 'Bozkır Koleji' },
    kolej3: { gercek: 'Gündoğdu Koleji', uydurma: 'Gün Işığı Koleji' },
  },
  // Mahalle ilkokulunun tabelası
  ilkokul: { gercek: 'Cumhuriyet İlkokulu', uydurma: 'Çınar İlkokulu' },

  // Özel yapı
  kule: { gercek: 'Selçuklu Kulesi', uydurma: 'Bozkır Kulesi' },

  // Tarihi ve kamu yapıları: arkadaş sürümünde gerçek yer adları, Play Store sürümünde genel adlar
  tarihi: {
    muze: { gercek: 'Mevlana Müzesi', uydurma: 'Şehir Müzesi' },
    cami: { gercek: 'Alaaddin Camii', uydurma: 'Tepe Camii' },
    tepe: { gercek: 'Alaaddin Tepesi', uydurma: 'Yeşil Tepe' },
    kongre: { gercek: 'Selçuklu Kongre Merkezi', uydurma: 'Kongre Merkezi' },
    park: { gercek: 'Kültürpark', uydurma: 'Şehir Parkı' },
    meydan: { gercek: 'Zafer Meydanı', uydurma: 'Çınar Meydanı' },
    carsi: { gercek: 'Bedesten Çarşısı', uydurma: 'Eski Çarşı' },
    baglar: { gercek: 'Meram Bağları', uydurma: 'Bağlar Bahçesi' },
    duraklar: { gercek: ['Alaaddin', 'Zafer', 'Mevlana', 'Kültürpark', 'Kongre Merkezi'], uydurma: ['Tepe', 'Çınar', 'Müze', 'Şehir Parkı', 'Kongre Merkezi'] },
    firinlar: { gercek: ['Etli Ekmek Fırını', 'Konya Fırını', 'Fırın Kebabı', 'Etliekmek Salonu', 'Bamya Çorbası'], uydurma: ['Etli Ekmek Fırını', 'Taş Fırın', 'Fırın Kebabı', 'Etliekmek Salonu', 'Bamya Çorbası'] },
  },

  // Şehir ve yemek adı taşıyan dükkânlar (Play Store sürümünde yer adı yok)
  dukkan: {
    saray: { gercek: 'İskender Sarayı', uydurma: 'Kebap Sarayı' },
    pide: { gercek: 'Karadeniz Pide', uydurma: 'Kayık Pide' },
    lahmacun: { gercek: 'Urfa Lahmacun', uydurma: 'Fırın Lahmacun' },
    ocak: { gercek: 'Adana Kebapçısı', uydurma: 'Ocakbaşı Kebapçısı' },
    kebapci: { gercek: 'İskenderci', uydurma: 'Tereyağlı Kebapçı' },
    ozocak: { gercek: 'Öz Urfa Kebap', uydurma: 'Öz Ocakbaşı' },
    // Tabela rengini seçen anahtar kelime (döner/kebap grubu)
    kelime: { gercek: 'iskender', uydurma: 'ocakbaşı' },
  },

  // Yol tabelaları: otoyol köprüsü (sol/sağ) ve kavşak yön levhaları
  yol: {
    sol: { gercek: ['← EDİRNE O-3', '← SARAY O-3', '← GEBZE O-4', '← ÇORLU O-3'], uydurma: ['← LİMAN O-1', '← SAHİL O-1', '← OVA O-2', '← KÖPRÜ O-1'] },
    sag: { gercek: ['ANKARA O-4 →', 'İZMİT O-4 →', 'BOLU O-4 →', 'BURSA O-5 →'], uydurma: ['MERKEZ O-2 →', 'DAĞ O-2 →', 'GÖL O-2 →', 'VADİ O-3 →'] },
    yon: { gercek: ['← KADIKÖY', 'BEŞİKTAŞ →', '↑ TAKSİM', 'ÜSKÜDAR →', '← ŞİŞLİ', 'SARIYER →', '↑ BOĞAZ KÖPRÜSÜ', '← FATİH', 'BAKIRKÖY →'], uydurma: ['← ÇARŞI', 'LİMAN →', '↑ MERKEZ', 'SAHİL →', '← ÇINARLI', 'TEPEBAŞI →', '↑ KÖPRÜ', '← ESKİ ŞEHİR', 'YENİ MAHALLE →'] },
  },

  // Araç adları: kimlik (id) değişmez, yalnızca görünen ad
  arabalar: {
    atmaca: { gercek: 'Tofaş Doğan', uydurma: 'Atmaca' },
    motor: both('Motosiklet'),
    granit: { gercek: 'Opel Grandland', uydurma: 'Granit SUV' },
    elektra: { gercek: 'Togg T10X', uydurma: 'Elektra X1' },
    simsek: { gercek: 'Tofaş Şahin', uydurma: 'Şimşek' },
    cinar: { gercek: 'Anadol A1', uydurma: 'Çınar A' },
    efe: { gercek: 'Murat 131', uydurma: 'Efe 131' },
    marmara: { gercek: 'Fiat Egea', uydurma: 'Marmara S' },
    liva: { gercek: 'Renault Clio', uydurma: 'Liva' },
    bozkir: { gercek: 'Dacia Duster', uydurma: 'Bozkır 4x4' },
    // Yeni arabalar iki sürümde de uydurma adlıdır
    tilki: both('Tilki RS'),
    kartal: both('Kartal 67'),
    volt: both('Volt GT'),
    kuzgun: both('Kuzgun X'),
  },

  // Zincir marketler: kimlik cephe çizimini seçer, ad ve renk tabelaya yazılır
  zincirler: [
    { id: 'pazarcik', ad: { gercek: 'Migros', uydurma: 'Pazarcık Market' }, renk: { gercek: '#ff7a00', uydurma: '#3f8f5b' } },
    { id: 'ucuzlar', ad: { gercek: 'BİM', uydurma: 'Ucuzlar' }, renk: { gercek: '#d0121b', uydurma: '#7b3fa0' } },
    { id: 'sepet', ad: { gercek: 'ŞOK', uydurma: 'Sepet Market' }, renk: { gercek: '#e6a800', uydurma: '#1f9e9e' } },
    { id: 'yildiz', ad: { gercek: 'A101', uydurma: 'Yıldız Mağazaları' }, renk: { gercek: '#0088b0', uydurma: '#c23b6b' } },
    { id: 'dortyol', ad: { gercek: 'CarrefourSA', uydurma: 'Dörtyol Market' }, renk: { gercek: '#0a4ea2', uydurma: '#6a7f2a' } },
    { id: 'teknoloji', ad: { gercek: 'İtopya', uydurma: 'Teknoloji Durağı' }, renk: { gercek: '#ff2a6d', uydurma: '#2b3a67' } },
    { id: 'yapi', ad: { gercek: 'Koçtaş', uydurma: 'Yapı Dünyası' }, renk: { gercek: '#f59300', uydurma: '#8a5a2b' } },
    { id: 'kose', ad: both('Köşe Bakkal'), renk: both('#b5651d') },
  ],

  bankalar: [
    { ad: { gercek: 'Akbank', uydurma: 'Yıldız Bankası' }, renk: { gercek: '#d0121b', uydurma: '#3b3f8f' } },
    { ad: { gercek: 'İş Bankası', uydurma: 'Kumbara Tasarruf' }, renk: { gercek: '#0a4ea2', uydurma: '#8a6d1f' } },
    { ad: { gercek: 'Ziraat Bankası', uydurma: 'Bereket Bankası' }, renk: { gercek: '#c8102e', uydurma: '#6b8e23' } },
    { ad: { gercek: 'Garanti BBVA', uydurma: 'Güven Kredi' }, renk: { gercek: '#0f7a45', uydurma: '#5b2a86' } },
    { ad: { gercek: 'Yapı Kredi', uydurma: 'Liman Yatırım' }, renk: { gercek: '#1b2f6b', uydurma: '#0f6e84' } },
  ],

  siteler: {
    buyuk1: { gercek: 'Natura Park Sitesi', uydurma: 'Yeşilvadi Sitesi' },
    buyuk2: { gercek: 'Doğa Şehir Sitesi', uydurma: 'Mavi Orman Sitesi' },
  },

  // Tek tük dükkân ve yapı adları
  tekil: {
    ishani: { gercek: 'Grand Bazaar İş Hanı', uydurma: 'Merkez Çarşı İş Hanı' },
    otel: { gercek: 'Pera Palas Oteli', uydurma: 'Sahil Palas Oteli' },
    doner: { gercek: 'Maydanoz Döner', uydurma: 'Nane Döner' },
  },

  // İki stadyumun tabelası. Gerçek kulüp amblemi ya da logosu iki sürümde de kullanılmaz
  stadyum: {
    kucuk: { gercek: 'YOZGAT ŞEHİR STADYUMU', uydurma: 'ÇINARLI ŞEHİR STADYUMU' },
    buyuk: { gercek: 'KONYA BÜYÜKŞEHİR STADYUMU', uydurma: 'MAVİ RÜZGAR ARENA' },
  },
  // Stadyum renkleri: Play Store sürümünde hiçbir kulübün renk düzeni kullanılmaz (turkuaz-mercan, mor-lila)
  //   seat: koltuk, trim: çatı kenarı, fan: taraftar, flag: [zemin, şerit] ya da 'anit' (anıtın bayrağı)
  stadRenk: {
    kucuk: {
      gercek: { seat: '#c8102e', trim: '#c8102e', fan: '#2a0b10', flag: 'anit' },
      uydurma: { seat: '#138a8a', trim: '#ff6f59', fan: '#0b2e2e', flag: ['#138a8a', '#ff6f59'] },
    },
    buyuk: {
      gercek: { main: '#16834a', glass: 'rgba(170,230,190,.62)', facade: 'rgba(120,210,150,.55)', glow: 'rgba(60,255,150,.22)', dot: '#5dff9e', edge: 'rgba(80,110,96,.45)', fan: '#0f3a24', flag: ['#16834a', '#ffffff'] },
      uydurma: { main: '#6a3fb5', glass: 'rgba(196,176,240,.62)', facade: 'rgba(170,140,230,.55)', glow: 'rgba(170,120,255,.22)', dot: '#c9a6ff', edge: 'rgba(96,80,120,.45)', fan: '#24124a', flag: ['#6a3fb5', '#ffffff'] },
    },
  },

  // Gizli geçidin ev sahibi: arkadaş sürümünde gerçek kişi, Play Store sürümünde boş (genel karşılama yazısı çıkar)
  misafir: { gercek: 'Ömer Yıldız', uydurma: '' },
};

// Play Store paketinde bulunmaması gereken adlar: tablodaki gerçek sütundan, uydurmadan farklı olanlar
export function gercekAdlar() {
  const out = new Set();
  const walk = (v) => {
    if (!v || typeof v !== 'object') return;
    if ('gercek' in v && 'uydurma' in v) {
      const g = [v.gercek].flat();
      const u = [v.uydurma].flat();
      for (const s of g) if (typeof s === 'string' && !s.startsWith('#') && !u.includes(s)) out.add(s);
      return;
    }
    for (const k of Object.keys(v)) walk(v[k]);
  };
  walk(TABLO);
  return [...out];
}
