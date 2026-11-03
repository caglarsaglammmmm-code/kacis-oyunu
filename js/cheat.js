// Basış sırası denetleyicisi. Girişten bağımsızdır: dokunuş, tuş ve eksen aynı yola gelir.
// DOM'a dokunmaz, birim testle sınanır.
import { CONFIG } from './config.js';

const C = CONFIG.cheat;

export class CheatCode {
  constructor() {
    this.i = 0;
    this.t = 0;
  }

  reset() {
    this.i = 0;
  }

  // dir: 'L' ya da 'R', now: saniye. Sıra tamamlanınca true döner
  press(dir, now) {
    if (this.i > 0 && now - this.t > C.gap) this.i = 0;
    if (dir === C.sequence[this.i]) this.i++;
    else this.i = dir === C.sequence[0] ? 1 : 0;
    this.t = now;
    if (this.i < C.sequence.length) return false;
    this.i = 0;
    return true;
  }
}
