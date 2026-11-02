// BAŞLA geçişi zaman çizelgesi (ms). Toplam 2 saniyenin altında kalır.
export const PHASE = {
  press: 130, // Düğme çöker, bip
  away: 880, // Kapak küçülüp solar, arkasından yol görünür
  fall: 520, // Küçük araba yola düşer; kapak solmadan başlar
  settle: 400, // Çarpma, sarsıntı, gerçek boya dönüş
};
export const FALL_AT = PHASE.press + PHASE.away - 180;
export const TOTAL = FALL_AT + PHASE.fall + PHASE.settle;

// t ms: düşüşün başından itibaren. drop: 1 gökte, 0 yolda; size: araç oranı
export function dropCurve(t) {
  if (t < 0) return { drop: 1, size: 0.22, shadow: 0.1 };
  if (t < PHASE.fall) {
    const u = t / PHASE.fall;
    return { drop: 1 - u * u, size: 0.22 + 0.4 * u * u, shadow: 0.1 + 0.8 * u };
  }
  const u = Math.min(1, (t - PHASE.fall) / PHASE.settle);
  // Yere değince şişer, sonra gerçek boyuna oturur
  const v = u - 1;
  const back = 1 + 2.4 * v * v * v + 1.4 * v * v;
  return { drop: 0, size: 0.62 + 0.38 * back, shadow: 1 };
}
