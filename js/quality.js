// Grafik kalitesi: Otomatik modda FPS'e göre seviye değişir. Çizim yükünü ve aynı anda aktif polis
// sınırını (cops) ayarlar. Tarayıcıya bağlı değildir, birim testle sınanır.
// dpr: çözünürlük üst sınırı, pixels: tuval piksel bütçesi (tablet), particles: parçacık oranı,
// crowd: kalabalık oranı, slices: bina duvar dilimi, balcony: balkon oranı, night: 2 tam gece ışıkları,
// 1 yansımasız, 0 yalnız temel ışık; speedLines, fireSmoke: küçük süsler.
export const LEVELS = [
  { name: 'yuksek', cops: 24, dpr: 1.75, pixels: 2600000, particles: 1, crowd: 1, slices: 6, balcony: 1, night: 2, speedLines: true, fireSmoke: true },
  { name: 'orta', cops: 18, dpr: 1.5, pixels: 1600000, particles: 0.75, crowd: 1, slices: 5, balcony: 0.7, night: 2, speedLines: true, fireSmoke: true },
  { name: 'dusuk', cops: 12, dpr: 1.25, pixels: 1100000, particles: 0.5, crowd: 0.8, slices: 4, balcony: 0.4, night: 1, speedLines: false, fireSmoke: false },
  { name: 'en-dusuk', cops: 8, dpr: 1, pixels: 700000, particles: 0.3, crowd: 0.6, slices: 3, balcony: 0, night: 0, speedLines: false, fireSmoke: false },
];

export const QUALITY_MODES = ['auto', 'high', 'low'];
const MIN_FPS = 45; // Bunun altında kalite düşer
const UP_FPS = 56; // Bu kadar rahatken kalite yükselmeyi dener
const MAX_HOLD = 60; // Yükselme denemeleri arasındaki en uzun bekleme, sn

// Cihaz bilgisinden başlangıç tahmini: kasarak başlamak yerine güvenli tarafta başlar
export function guessLevel(cores = 0, memoryGb = 0) {
  if ((cores && cores <= 4) || (memoryGb && memoryGb <= 3)) return 2;
  if ((cores && cores <= 6) || (memoryGb && memoryGb <= 4)) return 1;
  return 0;
}

export class Quality {
  constructor(mode = 'auto', start = 0) {
    this.level = Math.max(0, Math.min(LEVELS.length - 1, start | 0));
    this.setMode(mode);
    this.reset();
    this.hold = 8;
  }

  get settings() { return LEVELS[this.level]; }

  setMode(mode) {
    this.mode = QUALITY_MODES.includes(mode) ? mode : 'auto';
    if (this.mode === 'high') this.level = 0;
    if (this.mode === 'low') this.level = LEVELS.length - 1;
  }

  // Ölçüm penceresi baştan başlar: duraklatma, sahne değişimi. Hızlı uyum ilk saniyelerde geçerli
  reset(fast = 3) {
    this.sum = 0;
    this.n = 0;
    this.goodT = 0;
    this.wait = 0;
    this.fastT = fast;
  }

  // Kare süresi (ms) girer. Seviye değiştiyse true döner.
  note(ms) {
    if (this.mode !== 'auto' || ms <= 0 || ms > 400) return false; // Çok uzun boşluk arka plandır
    const sec = ms / 1000;
    this.fastT -= sec;
    this.wait -= sec;
    this.sum += ms;
    this.n++;
    const fast = this.fastT > 0;
    if (this.sum < (fast ? 350 : 750)) return false;
    const fps = (1000 * this.n) / this.sum;
    const span = this.sum / 1000;
    this.sum = 0;
    this.n = 0;
    if (fps < MIN_FPS) {
      this.goodT = 0;
      if (this.wait > 0 || this.level >= LEVELS.length - 1) return false;
      // Ağır kasmada tek adım yetmez
      this.level = Math.min(LEVELS.length - 1, this.level + (fps < 30 ? 2 : 1));
      this.wait = fast ? 0.35 : 1.2;
      this.hold = Math.min(MAX_HOLD, this.hold * 2); // Yükseltme tutmadı: sonraki deneme daha geç
      return true;
    }
    this.goodT = fps >= UP_FPS ? this.goodT + span : 0;
    if (this.goodT >= this.hold && this.level > 0) {
      this.level--;
      this.goodT = 0;
      this.wait = 1.2;
      return true;
    }
    return false;
  }
}
