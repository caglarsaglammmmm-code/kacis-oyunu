// Anıt içeriği: ARKADAŞ sürümü (gerçek). Play Store paketine girmez.
// tools/flavor.mjs ve tools/serve.mjs (FLAVOR=arkadas) bu dosyayı js/memorial-data.js yerine koyar.
// Play Store sürümünün kurgusal karşılığı: js/memorial-data.js
// Fotoğraflar kırpılmaz ve değiştirilmez. Gençliğe Hitabe, "Ne mutlu Türküm diyene!" ve imza çevrilmez.
export const MEM_REAL = true;

// Fotoğraflar: gorseller/ataturk/ (kaynak: kullanıcının verdiği dört fotoğraf, kırpılmadan)
export const MEM_IMAGES = [1, 2, 3, 4].map((n) => `gorseller/ataturk/ataturk-${n}.jpeg`);

export const MEM_TITLE = 'Gençliğe Hitabe';
export const MEM_YEAR = '1927';
export const MEM_TEXT = [
  'Ey Türk gençliği! Birinci vazifen, Türk istiklalini, Türk cumhuriyetini, ilelebet muhafaza ve müdafaa etmektir.',
  'Mevcudiyetinin ve istikbalinin yegâne temeli budur. Bu temel, senin en kıymetli hazinendir. İstikbalde dahi, seni bu hazineden mahrum etmek isteyecek dahilî ve haricî bedhahların olacaktır. Bir gün, istiklal ve cumhuriyeti müdafaa mecburiyetine düşersen, vazifeye atılmak için içinde bulunacağın vaziyetin imkân ve şeraitini düşünmeyeceksin! Bu imkân ve şerait, çok namüsait bir mahiyette tezahür edebilir. İstiklal ve cumhuriyetine kastedecek düşmanlar, bütün dünyada emsali görülmemiş bir galibiyetin mümessili olabilirler. Cebren ve hile ile aziz vatanın bütün kaleleri zaptedilmiş, bütün tersanelerine girilmiş, bütün orduları dağıtılmış ve memleketin her köşesi bilfiil işgal edilmiş olabilir. Bütün bu şeraitten daha elîm ve daha vahim olmak üzere, memleketin dahilinde iktidara sahip olanlar gaflet ve dalâlet ve hattâ hıyanet içinde bulunabilirler. Hattâ bu iktidar sahipleri şahsî menfaatlerini, müstevlilerin siyasî emelleriyle tevhit edebilirler. Millet, fakr u zaruret içinde harap ve bîtap düşmüş olabilir.',
  'Ey Türk istikbalinin evlâdı! İşte, bu ahval ve şerait içinde dahi vazifen, Türk istiklal ve cumhuriyetini kurtarmaktır! Muhtaç olduğun kudret, damarlarındaki asil kanda mevcuttur!',
].join('\n');
export const MEM_MOTTO = 'Ne mutlu Türküm diyene!';
export const MEM_SIGNATURE = 'Gazi Mustafa Kemal Atatürk';

const MEMD_TAU = Math.PI * 2;

// Türk bayrağı: 3:2, beyaz ay ve yıldız (resmî orana göre, 1200 x 800 tasarım alanında)
export function paintMemFlag(g, w, h, mirror = false) {
  g.save();
  if (mirror) { g.translate(w, 0); g.scale(-1, 1); }
  g.scale(w / 1200, h / 800);
  g.fillStyle = '#e30a17';
  g.fillRect(0, 0, 1200, 800);
  g.fillStyle = '#fff';
  g.beginPath(); g.arc(425, 400, 200, 0, MEMD_TAU); g.fill();
  g.fillStyle = '#e30a17';
  g.beginPath(); g.arc(475, 400, 160, 0, MEMD_TAU); g.fill();
  g.fillStyle = '#fff';
  g.beginPath();
  const pts = [[583.334, 400], [764.235, 458.779], [652.431, 304.894], [652.431, 495.106], [764.235, 341.221]];
  pts.forEach(([x, y], i) => g[i ? 'lineTo' : 'moveTo'](x, y));
  g.closePath(); g.fill();
  g.restore();
}

// Gerçek sürümde çerçevelerde fotoğraf var: heykel çizimi yok
export const paintMemStatue = null;
// Levhada yazı var: amblem çizilmez
export const paintMemEmblem = null;
