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
  // Menüdeki APK düğmesi: arkadaş sürümü hep son APK'ya gider, Play sürümünde boş (config kendi adresini kullanır)
  indir: { gercek: 'https://github.com/caglarsaglammmmm-code/kacis-oyunu/releases/latest/download/DriftLab-Arkadas.apk', uydurma: '' },

  // Haritanın en büyük binası
  kolej: {
    ad: { gercek: 'SİSTEM KOLEJİ', uydurma: 'MANDALİNA KOLEJİ' },
    ust: { gercek: 'SİSTEM', uydurma: 'MANDALİNA' },
  },

  // Konya: özel ve devlet okulları
  okullar: {
    serife: { gercek: 'Şerife Akkanat Ortaokulu', uydurma: 'Anadolu Fen Okulu' },
    ted: { gercek: 'TED Konya Koleji', uydurma: 'Bozkır Koleji' },
    gundogdu: { gercek: 'Gündoğdu Koleji', uydurma: 'Gün Işığı Koleji' },
  },

  // Konya: özel yapı
  kule: { gercek: 'Selçuklu Kulesi', uydurma: 'Bozkır Kulesi' },

  // Konya: tarihi ve kamu yapıları, iki sürümde aynı
  konya: {
    mevlana: both('Mevlana Müzesi'),
    alaaddin: both('Alaaddin Camii'),
    tepe: both('Alaaddin Tepesi'),
    kongre: both('Selçuklu Kongre Merkezi'),
    kulturpark: both('Kültürpark'),
    zafer: both('Zafer Meydanı'),
    bedesten: both('Bedesten Çarşısı'),
    meram: both('Meram Bağları'),
    duraklar: both(['Alaaddin', 'Zafer', 'Mevlana', 'Kültürpark', 'Kongre Merkezi']),
    firinlar: both(['Etli Ekmek Fırını', 'Konya Fırını', 'Fırın Kebabı', 'Etliekmek Salonu', 'Bamya Çorbası']),
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
    { ad: { gercek: 'İş Bankası', uydurma: 'Anadolu Tasarruf' }, renk: { gercek: '#0a4ea2', uydurma: '#8a6d1f' } },
    { ad: { gercek: 'Ziraat Bankası', uydurma: 'Bereket Bankası' }, renk: { gercek: '#c8102e', uydurma: '#6b8e23' } },
    { ad: { gercek: 'Garanti BBVA', uydurma: 'Güven Kredi' }, renk: { gercek: '#0f7a45', uydurma: '#5b2a86' } },
    { ad: { gercek: 'Yapı Kredi', uydurma: 'Marmara Yatırım' }, renk: { gercek: '#1b2f6b', uydurma: '#0f6e84' } },
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
