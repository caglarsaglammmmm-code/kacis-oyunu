// Tüm sesler Web Audio ile üretilir; harici dosya yok.
import { CONFIG } from './config.js';

// Motor karakterleri. harm: ana sesin harmonikleri, sub: yarım perde gövde, high: çift perde vızıltı,
// air: emiş gürültüsü, rough: tırtıl derinliği, roughRate: tırtılın ateşleme frekansına oranı, lp: süzgeç alt ve üst sınırı
export const ENGINE_KINDS = {
  v8: { harm: [1, 0.85, 0.6, 0.42, 0.26, 0.14], sub: 0.75, high: 0.1, air: 0.05, rough: 0.2, roughRate: 0.25, lp: [260, 1500] },
  thin: { harm: [0.55, 1, 0.7, 0.5, 0.42, 0.3], sub: 0.08, high: 0.34, air: 0.03, rough: 0.05, roughRate: 0.33, lp: [620, 3800] },
  inline: { harm: [1, 0.7, 0.42, 0.26, 0.14], sub: 0.3, high: 0.16, air: 0.05, rough: 0.07, roughRate: 0.5, lp: [420, 2500] },
  old: { harm: [1, 0.95, 0.75, 0.55, 0.3], sub: 0.5, high: 0.08, air: 0.09, rough: 0.62, roughRate: 0.25, lp: [240, 1150] },
  turbo: { harm: [0.9, 0.8, 0.6, 0.5, 0.35, 0.25], sub: 0.4, high: 0.26, air: 0.16, rough: 0.1, roughRate: 0.5, lp: [420, 3000] },
  diesel: { harm: [1, 0.9, 0.8, 0.6, 0.4], sub: 0.6, high: 0.06, air: 0.1, rough: 0.34, roughRate: 0.5, lp: [210, 850] },
  moto: { harm: [0.7, 1, 0.85, 0.6, 0.5, 0.4], sub: 0.14, high: 0.3, air: 0.06, rough: 0.12, roughRate: 0.25, lp: [700, 4600] },
  ev: { harm: [1, 0, 0.14, 0, 0.05], sub: 0, high: 0.44, air: 0, rough: 0, roughRate: 0, lp: [1800, 6500] },
};

// Hız oranından devir ve vites: vites büyüdükçe devir düşer, tepe devre ulaşınca sıradaki vitese atar
export function engineRpm(e, k) {
  const n = e.gears;
  const speed = Math.max(0, Math.min(1.1, k));
  if (n === 1) return { rpm: e.idle + (e.red - e.idle) * Math.min(1, speed), gear: 0 };
  const g = Math.min(n - 1, Math.floor(speed * n));
  const within = Math.min(1, speed * n - g);
  const low = g === 0 ? e.idle : e.red * 0.6;
  return { rpm: low + (e.red - low) * within, gear: g };
}

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.ambientOn = true;
    this.ambT = 2;
    this.engine = CONFIG.cars[0].engine;
    this.volume = 0.8;
    this.nightK = 0;
    this.pv = null;
    this.gear = 0;
    this.shiftT = 0;
    this.coinStreak = 0;
    this.coinAt = 0;
    this.master = null;
    this.running = false;
  }

  // Tarayıcılar sesi yalnızca kullanıcı dokunuşundan sonra başlatır
  unlock() {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return;
    }
    const AC = globalThis.AudioContext || globalThis.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = this.enabled ? this.volume : 0;
    const comp = ctx.createDynamicsCompressor();
    this.master.connect(comp);
    comp.connect(ctx.destination);

    // Beyaz gürültü tamponu: drift, çarpma, patlama
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    // Motor: ateşleme sesi, yarım perde gövde, çift perde vızıltı ve emiş gürültüsü. Hepsi tırtıl kazancından geçer
    this.engGain = ctx.createGain();
    this.engGain.gain.value = 0;
    this.engFilter = ctx.createBiquadFilter();
    this.engFilter.type = 'lowpass';
    this.engFilter.frequency.value = 500;
    this.engRough = ctx.createGain();
    this.engRough.gain.value = 1;
    this.engFilter.connect(this.engRough);
    this.engRough.connect(this.engGain);
    this.engGain.connect(this.master);
    const layer = (type) => {
      const o = ctx.createOscillator();
      o.type = type;
      const g = ctx.createGain();
      o.connect(g);
      g.connect(this.engFilter);
      o.start();
      return { o, g };
    };
    this.eng1 = layer('sawtooth');
    this.eng2 = layer('sawtooth');
    this.eng3 = layer('square');
    const air = ctx.createBufferSource();
    air.buffer = this.noise;
    air.loop = true;
    this.engAirF = ctx.createBiquadFilter();
    this.engAirF.type = 'bandpass';
    this.engAirF.Q.value = 1.2;
    this.engAir = ctx.createGain();
    this.engAir.gain.value = 0;
    air.connect(this.engAirF);
    this.engAirF.connect(this.engAir);
    this.engAir.connect(this.engGain);
    air.start();
    this.lfo = ctx.createOscillator();
    this.lfo.type = 'sine';
    this.lfoGain = ctx.createGain();
    this.lfoGain.gain.value = 0;
    this.lfo.connect(this.lfoGain);
    this.lfoGain.connect(this.engRough.gain);
    this.lfo.start();
    this.waves = {};

    // Drift cızırtısı: bant geçiren gürültü
    const nsrc = ctx.createBufferSource();
    nsrc.buffer = this.noise;
    nsrc.loop = true;
    this.driftFilter = ctx.createBiquadFilter();
    this.driftFilter.type = 'bandpass';
    this.driftFilter.frequency.value = 1900;
    this.driftFilter.Q.value = 2.4;
    this.driftGain = ctx.createGain();
    this.driftGain.gain.value = 0;
    nsrc.connect(this.driftFilter);
    this.driftFilter.connect(this.driftGain);
    this.driftGain.connect(this.master);
    nsrc.start();

    // Sokak uğultusu: çok kısık alçak gürültü
    const ambSrc = ctx.createBufferSource();
    ambSrc.buffer = this.noise;
    ambSrc.loop = true;
    const ambF = ctx.createBiquadFilter();
    ambF.type = 'lowpass';
    ambF.frequency.value = 420;
    this.ambGain = ctx.createGain();
    this.ambGain.gain.value = this.ambientOn ? 0.035 : 0;
    ambSrc.connect(ambF);
    ambF.connect(this.ambGain);
    this.ambGain.connect(this.master);
    ambSrc.start();
    this.setEngine(this.engine);

    // Lastik ciyaklaması: dar bant testere
    this.tyreOsc = ctx.createOscillator();
    this.tyreOsc.type = 'sawtooth';
    const tyreF = ctx.createBiquadFilter();
    tyreF.type = 'bandpass';
    tyreF.frequency.value = 1700;
    tyreF.Q.value = 9;
    this.tyreGain = ctx.createGain();
    this.tyreGain.gain.value = 0;
    this.tyreOsc.connect(tyreF);
    tyreF.connect(this.tyreGain);
    this.tyreGain.connect(this.master);
    this.tyreOsc.start();

    // Dört farklı siren: her tür en yakın aracına göre ayrı çalar
    // Perde yaklaşma hızına göre kayar (Doppler hissi)
    this.voices = {};
    const makeVoice = (name, type, center) => {
      const osc = ctx.createOscillator();
      osc.type = type;
      const f = ctx.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = center;
      f.Q.value = 0.8;
      const gain = ctx.createGain();
      gain.gain.value = 0;
      osc.connect(f);
      f.connect(gain);
      gain.connect(this.master);
      osc.start();
      this.voices[name] = { osc, gain };
    };
    makeVoice('wail', 'triangle', 1100);
    makeVoice('yelp', 'sawtooth', 1200);
    makeVoice('hilo', 'square', 620);
    makeVoice('chirp', 'triangle', 1900);
    makeVoice('euro', 'square', 760);
    makeVoice('rumble', 'sawtooth', 300);
    makeVoice('horn', 'sawtooth', 480);
    makeVoice('bip', 'square', 1700);
    makeVoice('pulse', 'sawtooth', 900);
    makeVoice('warble', 'triangle', 1400);
    makeVoice('ufo', 'sine', 1300);
    makeVoice('zap', 'sawtooth', 2100);
    this.radioT = 6;
  }

  setEngine(e) {
    this.engine = e;
    if (!this.eng1) return;
    const K = ENGINE_KINDS[e.kind] || ENGINE_KINDS.inline;
    this.kind = K;
    if (!this.waves[e.kind]) {
      const real = new Float32Array(K.harm.length + 1);
      const imag = new Float32Array(K.harm.length + 1);
      K.harm.forEach((v, i) => { imag[i + 1] = v; });
      this.waves[e.kind] = this.ctx.createPeriodicWave(real, imag);
    }
    this.eng1.o.setPeriodicWave(this.waves[e.kind]);
    const t = this.ctx.currentTime;
    this.eng2.g.gain.setTargetAtTime(K.sub, t, 0.02);
    this.eng3.g.gain.setTargetAtTime(K.high, t, 0.02);
    this.lfoGain.gain.setTargetAtTime(K.rough * 0.5, t, 0.02);
    this.engAir.gain.setTargetAtTime(K.air, t, 0.02);
  }

  // Motor ön izlemesi: rev gazlama, start kontak ve çalışma
  preview(e, mode = 'rev') {
    if (!this.ctx || !this.enabled) return;
    this.setEngine(e);
    this.pv = { mode, at: this.ctx.currentTime, len: mode === 'start' ? 1.5 : 1.25 };
    if (mode === 'start') {
      // Marş dişlisi: hızlı tekrar eden kısa vuruşlar
      if (e.kind !== 'ev') for (let i = 0; i < 6; i++) this.tone(120 + i * 8, 0.05, 0.05, 'square', 70, i * 0.055);
      else this.tone(500, 0.4, 0.04, 'sine', 1800);
    }
  }

  // Ön izleme eğrisi: 0-1 arası ilerlemeden hız oranı ve gaz
  previewState(pv, now) {
    const u = (now - pv.at) / pv.len;
    if (u >= 1) return null;
    if (pv.mode === 'start') {
      if (u < 0.22) return { k: 0, gas: 0, vol: 0 };
      const v = (u - 0.22) / 0.78;
      return { k: 0.28 * Math.sin(Math.min(1, v * 1.8) * Math.PI) + 0.05, gas: v < 0.5 ? 1 : 0.4, vol: Math.min(1, v * 6) * (1 - v * v) };
    }
    return { k: 0.62 * Math.sin(u * Math.PI), gas: u < 0.55 ? 1 : 0.2, vol: Math.min(1, u * 8) * Math.min(1, (1 - u) * 5) };
  }

  setAmbient(on) {
    this.ambientOn = on;
    if (this.ambGain) this.ambGain.gain.setTargetAtTime(on ? 0.035 : 0, this.ctx.currentTime, 0.2);
  }

  setVolume(v) {
    this.volume = v;
    if (this.master) this.master.gain.setTargetAtTime(this.enabled ? v : 0, this.ctx.currentTime, 0.02);
  }

  setEnabled(on) {
    this.enabled = on;
    if (this.master) this.master.gain.setTargetAtTime(on ? this.volume : 0, this.ctx.currentTime, 0.02);
  }

  suspend() {
    if (this.ctx && this.ctx.state === 'running') this.ctx.suspend();
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
  }

  // Her karede: motor, drift ve siren döngüleri
  update(game, active, now) {
    const c = this.ctx;
    if (!c) return;
    const t = c.currentTime;
    const p = game.player;
    const on = active && game.state === 'play';
    this.nightK = game.daylight ? game.daylight.k : 0;
    let k = Math.min(1.1, p.speed / game.carSpec.maxSpeed);
    let gas = on ? (p.gas ?? 1) : 0;
    let vol = on ? 1 : 0;
    // Ön izleme oyundan bağımsız çalar. Oyun başlayınca yerini gerçek sürüşe bırakır
    if (this.pv) {
      const s = this.previewState(this.pv, t);
      if (s && !(on && this.pv.mode !== 'start')) { k = s.k; gas = s.gas; vol = Math.max(vol * 0.6, s.vol); }
      if (!s) { this.pv = null; if (this.engine !== game.carSpec.engine) this.setEngine(game.carSpec.engine); }
    }
    const e = this.engine;
    const K = this.kind;
    // Kayarken tekerlek boşa döner: devir fırlar
    const spin = on && p.drifting ? 0.09 : 0;
    const state = engineRpm(e, k + spin);
    if (state.gear !== this.gear) {
      if (state.gear > this.gear) this.shiftT = t + 0.09; // Vites atarken gaz bir an kesilir
      this.gear = state.gear;
    }
    const cut = t < this.shiftT ? 0.45 : 1;
    const rpm = state.rpm * (gas < 0.2 ? 0.86 : 1);
    const f0 = Math.max(18, (rpm / 60) * (e.cyl / 2));
    const ratio = Math.min(1, rpm / e.red);
    const glide = t < this.shiftT ? 0.03 : 0.07;
    this.eng1.o.frequency.setTargetAtTime(f0, t, glide);
    this.eng2.o.frequency.setTargetAtTime(f0 / 2, t, glide);
    this.eng3.o.frequency.setTargetAtTime(f0 * 2, t, glide);
    this.lfo.frequency.setTargetAtTime(Math.max(4, f0 * K.roughRate), t, 0.08);
    this.engAirF.frequency.setTargetAtTime(500 + 1900 * ratio, t, 0.08);
    this.engFilter.frequency.setTargetAtTime(K.lp[0] + (K.lp[1] - K.lp[0]) * ratio * (0.35 + 0.65 * gas), t, 0.07);
    this.engGain.gain.setTargetAtTime(vol * (0.05 + 0.05 * ratio + 0.05 * gas) * e.gain * cut, t, 0.05);

    // Ara sıra sokak sesleri
    if (this.ambientOn && this.enabled) {
      this.ambT -= Math.min(0.05, (now - (this.ambNow || now)) / 1000);
      this.ambNow = now;
      if (this.ambT <= 0) {
        this.ambT = 2.5 + Math.random() * 6;
        this.streetSound();
      }
    }

    const slip = on && p.drifting ? Math.min(1, p.slip / 240) : 0;
    this.driftGain.gain.setTargetAtTime(slip * 0.26, t, 0.05);
    this.driftFilter.frequency.setTargetAtTime(1500 + 900 * slip, t, 0.05);

    this.tyreOsc.frequency.setTargetAtTime(760 + 500 * slip + 60 * Math.sin(now * 0.03), t, 0.03);
    this.tyreGain.gain.setTargetAtTime(slip > 0.35 ? (slip - 0.35) * 0.16 : 0, t, 0.04);

    // Yaklaşıyorsa perde yükselir, uzaklaşıyorsa düşer
    const doppler = 1 + Math.max(-0.14, Math.min(0.14, game.sirenClosing / 1800));
    const sec = now / 1000;
    const S = game.sirens;
    const quiet = game.ghostT > 0 ? 0.35 : 1;
    const setVoice = (name, freq, gate = 1) => {
      const v = this.voices[name];
      const d = S[CONFIG.sirens.indexOf(name)];
      if (on && d < 1300 && gate) {
        const vol = 1 - d / 1300;
        v.osc.frequency.setTargetAtTime(freq * doppler, t, 0.02);
        v.gain.gain.setTargetAtTime((0.018 + vol * vol * 0.062) * quiet, t, 0.04);
      } else {
        v.gain.gain.setTargetAtTime(0, t, gate ? 0.15 : 0.02);
      }
    };
    setVoice('wail', 680 + 760 * (0.5 - 0.5 * Math.cos((sec / 3.6) * 6.283))); // Yavaş uluma
    setVoice('yelp', 760 + 720 * (0.5 + 0.5 * Math.sin(sec * 19))); // Hızlı yelp
    setVoice('hilo', Math.floor(sec / 0.62) % 2 ? 640 : 475); // Ağır araç iki tonlu
    setVoice('chirp', 1300 + 900 * (sec * 9 - Math.floor(sec * 9))); // Motosiklet kesik siren
    setVoice('euro', Math.floor(sec / 0.42) % 2 ? 580 : 435); // Hızlı iki ton
    setVoice('rumble', 170 + 130 * Math.abs(Math.sin(sec * 2.2))); // Tok gürültü
    setVoice('horn', 330, Math.floor(sec * 2.6) % 3 === 0 ? 1 : 0); // Hava kornası
    setVoice('bip', 1760, Math.floor(sec * 7) % 4 === 0 ? 1 : 0); // Megafon bip
    setVoice('pulse', 900, Math.floor(sec * 12) % 2 ? 1 : 0); // Kesik nabız
    setVoice('warble', 1050 + 340 * Math.sin(sec * 36), Math.floor(sec * 1.6) % 2 ? 1 : 0); // Titrek çift ton
    setVoice('ufo', 880 + 620 * Math.sin(sec * 5.4) * Math.sin(sec * 0.9)); // Bilim kurgu teremin
    setVoice('zap', 2600 - 2100 * (sec * 3 - Math.floor(sec * 3))); // Lazer süpürmesi

    // Ara sıra polis telsizi ve megafon
    if (on && game.sirenDist < 1000) {
      this.radioT -= Math.min(0.05, (now - (this.lastNow || now)) / 1000);
      if (this.radioT <= 0) {
        this.radioT = 6 + Math.random() * 8;
        if (Math.random() < 0.5) this.radio(); else this.megaphone();
      }
    }
    this.lastNow = now;
  }

  burst(duration, freq, gain, type = 'lowpass', sweepTo = 0) {
    const c = this.ctx;
    if (!c || !this.enabled) return;
    const t = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = this.noise;
    src.loop = true;
    src.loopEnd = 1.9;
    src.playbackRate.value = 0.7 + Math.random() * 0.5;
    const f = c.createBiquadFilter();
    f.type = type;
    f.frequency.setValueAtTime(freq, t);
    if (sweepTo) f.frequency.exponentialRampToValueAtTime(sweepTo, t + duration);
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + duration);
    src.connect(f);
    f.connect(g);
    g.connect(this.master);
    src.start(t, Math.random());
    src.stop(t + duration + 0.02);
  }

  tone(freq, duration, gain, type = 'sine', slideTo = 0, delay = 0) {
    const c = this.ctx;
    if (!c || !this.enabled) return;
    const t = c.currentTime + delay;
    const o = c.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + duration);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + duration + 0.02);
  }

  // Suya düşüş: gümbürtü, sıçrama ve yükselen kabarcıklar
  sink() {
    this.splash();
    this.tone(95, 0.5, 0.3, 'sine', 45);
    this.burst(0.8, 1600, 0.4, 'lowpass', 180);
    for (let i = 0; i < 16; i++) {
      const f = 240 + Math.random() * 520;
      this.tone(f, 0.09, 0.05, 'sine', f * 2.1, 0.25 + i * 0.1);
    }
  }

  crash(k) {
    const r = Math.random();
    this.burst(0.2 + k * 0.2, 700 + k * (r < 0.5 ? 1000 : 1900), 0.3 + k * 0.5, 'lowpass', 160);
    this.tone(120 + r * 90, 0.14, 0.2 * k + 0.08, 'square', 55);
    if (k > 0.3) {
      if (r < 0.4) this.metal(k);
      else if (r < 0.7) this.glass(k);
      else this.tone(90, 0.3, 0.2 * k, 'sawtooth', 40); // Gövde gümbürtüsü
    }
  }

  // Sac ezilmesi: uyumsuz kısa tonlar
  metal(k) {
    for (const f of [317, 523, 871, 1307]) this.tone(f * (0.9 + Math.random() * 0.2), 0.16 + k * 0.1, 0.07 + k * 0.05, 'square', f * 0.6);
  }

  // Cam kırılması: tiz parçalar
  glass(k) {
    this.burst(0.22, 5200, 0.3 * k + 0.08, 'highpass');
    for (let i = 0; i < 5; i++) this.tone(2600 + Math.random() * 3200, 0.1, 0.05, 'sine', 0, i * 0.03);
  }

  // Ortam: kuş, uzak korna, çay kaşığı, uzaktan seslenen satıcı
  // Gece: uzaktan havlayan köpek ve cırcır böceği
  nightSound() {
    if (Math.random() < 0.55) {
      const n = 2 + Math.floor(Math.random() * 3);
      const f = 330 + Math.random() * 160;
      for (let i = 0; i < n; i++) { this.tone(f, 0.11, 0.022, 'sawtooth', f * 0.62, i * 0.24); this.tone(f * 1.5, 0.08, 0.008, 'square', f, i * 0.24); }
    } else {
      for (let i = 0; i < 8; i++) this.tone(4300, 0.035, 0.007, 'sine', 0, i * 0.075);
    }
  }

  streetSound() {
    if (this.nightK > 0.6 && Math.random() < 0.6) { this.nightSound(); return; }
    const r = Math.random();
    if (r < 0.34) {
      // Kuş cıvıltısı
      const f = 2600 + Math.random() * 1400;
      for (let i = 0; i < 3; i++) this.tone(f, 0.08, 0.018, 'sine', f * 1.3, i * 0.13);
    } else if (r < 0.58) {
      // Uzak korna
      this.tone(380, 0.28, 0.018, 'square');
      this.tone(478, 0.28, 0.015, 'square');
    } else if (r < 0.8) {
      // Bardakta çay kaşığı
      for (let i = 0; i < 3; i++) this.tone(3400 + Math.random() * 500, 0.05, 0.025, 'sine', 0, i * 0.11);
    } else {
      // Satıcı sesi: iki uzun hece
      this.tone(240, 0.4, 0.02, 'sawtooth', 300);
      this.tone(300, 0.6, 0.02, 'sawtooth', 210, 0.42);
    }
  }

  // Sentez bağırma: testere sesi, gırtlak bantları, titreme. Sesler kişiye göre değişir
  scream(k = 1, voice = 'man') {
    const c = this.ctx;
    if (!c || !this.enabled) return;
    if (voice === 'cat') { this.meow(k); return; }
    const t = c.currentTime;
    const P = {
      man: { pitch: [170, 210, 250], form: [650, 1150, 2400], rise: 1.3, vib: 0.03, dur: 0.5 },
      woman: { pitch: [380, 460, 560], form: [900, 1700, 3000], rise: 1.5, vib: 0.04, dur: 0.6 },
      child: { pitch: [620, 740, 860], form: [1100, 2100, 3500], rise: 1.6, vib: 0.05, dur: 0.45 },
      old: { pitch: [150, 180, 215], form: [550, 1000, 2100], rise: 1.15, vib: 0.1, dur: 0.75 },
      teen: { pitch: [260, 320, 400], form: [800, 1500, 2700], rise: 1.8, vib: 0.05, dur: 0.4 },
      grandma: { pitch: [290, 340, 390], form: [780, 1350, 2500], rise: 1.2, vib: 0.14, dur: 0.8 },
      tourist: { pitch: [230, 300, 480], form: [700, 1800, 2900], rise: 1.05, vib: 0.02, dur: 0.55 },
      simit: { pitch: [195, 235], form: [600, 1400, 2300], rise: 1.7, vib: 0.08, dur: 0.85 }, // Uzun satıcı nidası
      mom: { pitch: [420, 500], form: [950, 1500, 3200], rise: 1.9, vib: 0.06, dur: 0.5 },
      wheel: { pitch: [135, 160], form: [500, 900, 1900], rise: 1.1, vib: 0.16, dur: 0.9 },
      bike: { pitch: [300, 350], form: [850, 1600, 2600], rise: 1.35, vib: 0.02, dur: 0.3 },
      courier: { pitch: [225, 275], form: [720, 1300, 2300], rise: 2, vib: 0.01, dur: 0.28 },
      cayci: { pitch: [190, 240], form: [640, 1050, 2100], rise: 1.45, vib: 0.12, dur: 0.65 },
    }[voice] || { pitch: [200], form: [700, 1200, 2400], rise: 1.3, vib: 0.03, dur: 0.5 };
    const dur = P.dur + Math.random() * 0.25;
    const base = P.pitch[Math.floor(Math.random() * P.pitch.length)];
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(base * 0.9, t);
    o.frequency.exponentialRampToValueAtTime(base * P.rise, t + dur * 0.28);
    o.frequency.exponentialRampToValueAtTime(base * 0.75, t + dur);
    const vib = c.createOscillator();
    vib.frequency.value = 7 + Math.random() * 5;
    const vibGain = c.createGain();
    vibGain.gain.value = base * P.vib;
    vib.connect(vibGain);
    vibGain.connect(o.frequency);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16 * k + 0.03, t + 0.04);
    g.gain.setValueAtTime(0.16 * k + 0.03, t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    for (let i = 0; i < 3; i++) {
      const f = c.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = P.form[i] * (0.92 + Math.random() * 0.16);
      f.Q.value = 7 + i * 2;
      o.connect(f);
      f.connect(g);
    }
    g.connect(this.master);
    o.start(t);
    vib.start(t);
    o.stop(t + dur + 0.02);
    vib.stop(t + dur + 0.02);
  }

  thud() {
    this.tone(120, 0.12, 0.3, 'sine', 55);
    this.burst(0.07, 900, 0.16, 'lowpass');
  }

  meow(k) {
    this.tone(620, 0.16, 0.1 * k + 0.04, 'triangle', 980);
    this.tone(980, 0.24, 0.1 * k + 0.04, 'triangle', 520, 0.15);
  }

  // Araca göre korna: dolmuşun melodili kornası dahil
  horn(kind = 'car') {
    const T = {
      car: [[392, 494, 0.3]],
      old: [[300, 340, 0.4]],
      taxi: [[440, 554, 0.12], [440, 554, 0.12, 0.17], [440, 554, 0.28, 0.34]],
      bus: [[185, 233, 0.6]],
      truck: [[131, 165, 0.8]],
      dolmus: [[523, 659, 0.13], [587, 740, 0.13, 0.16], [659, 831, 0.13, 0.32], [784, 988, 0.26, 0.48]],
    }[kind] || [[392, 494, 0.3]];
    for (const [a, b, d, at = 0] of T) {
      this.tone(a, d, 0.07, 'square', 0, at);
      this.tone(b, d, 0.06, 'square', 0, at);
    }
  }

  // Simit dağılması: hafif tıkırtılar
  simit() {
    for (let i = 0; i < 7; i++) this.tone(420 + Math.random() * 500, 0.05, 0.08, 'triangle', 200, i * 0.035);
    this.burst(0.18, 1400, 0.1, 'bandpass');
  }

  // Çay bardakları kırılır
  tea() {
    this.glass(0.8);
    for (let i = 0; i < 4; i++) this.tone(3000 + Math.random() * 1500, 0.08, 0.05, 'sine', 0, 0.05 + i * 0.05);
  }

  // Plastik masa sandalye
  chairs() {
    for (let i = 0; i < 4; i++) this.tone(170 + Math.random() * 140, 0.07, 0.14, 'square', 90, i * 0.05);
    this.burst(0.14, 1800, 0.14, 'bandpass');
  }

  // Telsiz: cızırtı ve kısa konuşma darbeleri
  radio() {
    this.tone(1750, 0.06, 0.05, 'square');
    for (let i = 0; i < 6; i++) {
      this.burst(0.05 + Math.random() * 0.08, 900 + Math.random() * 900, 0.09, 'bandpass');
    }
    this.tone(1320, 0.07, 0.05, 'square', 0, 0.75);
  }

  // Megafon: heceli dalgalı ses
  megaphone() {
    for (let i = 0; i < 3; i++) {
      const f = 170 + Math.random() * 80;
      this.tone(f, 0.17, 0.11, 'sawtooth', f * 0.72, i * 0.21);
    }
    this.burst(0.65, 1200, 0.05, 'bandpass');
  }

  power(name) {
    const seq = { blast: [220, 330, 495], ghost: [880, 660, 990, 740], heal: [523, 659, 784, 1047], giant: [130, 196, 262, 392] }[name];
    seq.forEach((f, i) => this.tone(f, 0.2, 0.17, name === 'giant' ? 'sawtooth' : 'triangle', 0, i * 0.08));
  }

  // Satın alma: kasa zili
  purchase() {
    [784, 988, 1175, 1568].forEach((f, i) => this.tone(f, 0.16, 0.18, 'triangle', 0, i * 0.07));
    this.burst(0.25, 5000, 0.07, 'highpass');
  }

  powerEnd() { this.tone(660, 0.18, 0.1, 'triangle', 240); }

  crunch() { this.burst(0.12, 1300, 0.22, 'bandpass', 500); }
  // Coin: üst üste toplayınca perde yükselir
  coin() {
    const c = this.ctx;
    if (!c) return;
    const t = c.currentTime;
    this.coinStreak = t - this.coinAt < 0.7 ? Math.min(8, this.coinStreak + 1) : 0;
    this.coinAt = t;
    const k = 2 ** (this.coinStreak / 12);
    this.tone(1320 * k, 0.07, 0.15, 'square');
    this.tone(1975 * k, 0.14, 0.15, 'square', 0, 0.06);
  }

  nearMiss() { this.tone(500, 0.22, 0.14, 'sawtooth', 1500); }
  explosion(k = 1) {
    this.burst(1.3 * k, 1300, 1.1 * k, 'lowpass', 45);
    this.tone(110, 0.9 * k, 0.6 * k, 'sine', 28);
  }

  tankFire() {
    this.burst(0.55, 700, 0.8, 'lowpass', 70);
    this.tone(90, 0.4, 0.5, 'sine', 40);
  }

  splash() { this.burst(0.4, 2400, 0.3, 'highpass', 600); }
  spike() { this.tone(900, 0.5, 0.14, 'sawtooth', 100); this.burst(0.3, 3200, 0.3, 'highpass'); }

  // Eşik uyarısı: kısa yükselen siren
  alert() {
    for (let i = 0; i < 3; i++) {
      this.tone(520, 0.34, 0.2, 'sawtooth', 1250, i * 0.36);
    }
  }
}
