// Tüm sesler Web Audio ile üretilir; harici dosya yok.

export class AudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
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
    this.master.gain.value = this.enabled ? 0.8 : 0;
    const comp = ctx.createDynamicsCompressor();
    this.master.connect(comp);
    comp.connect(ctx.destination);

    // Beyaz gürültü tamponu: drift, çarpma, patlama
    const len = ctx.sampleRate * 2;
    this.noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = this.noise.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;

    // Motor: iki testere + alçak geçiren
    this.engGain = ctx.createGain();
    this.engGain.gain.value = 0;
    this.engFilter = ctx.createBiquadFilter();
    this.engFilter.type = 'lowpass';
    this.engFilter.frequency.value = 500;
    this.eng1 = ctx.createOscillator();
    this.eng2 = ctx.createOscillator();
    this.eng1.type = 'sawtooth';
    this.eng2.type = 'square';
    this.eng1.connect(this.engFilter);
    const sub = ctx.createGain();
    sub.gain.value = 0.4;
    this.eng2.connect(sub);
    sub.connect(this.engFilter);
    this.engFilter.connect(this.engGain);
    this.engGain.connect(this.master);
    this.eng1.start();
    this.eng2.start();

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
    this.radioT = 6;
  }

  setEnabled(on) {
    this.enabled = on;
    if (this.master) this.master.gain.setTargetAtTime(on ? 0.8 : 0, this.ctx.currentTime, 0.02);
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
    const k = Math.min(1.1, p.speed / game.carSpec.maxSpeed);
    const on = active && game.state === 'play';
    const base = 52 + 150 * k + (p.drifting ? 34 : 0);
    this.eng1.frequency.setTargetAtTime(base, t, 0.06);
    this.eng2.frequency.setTargetAtTime(base * 1.5, t, 0.06);
    this.engFilter.frequency.setTargetAtTime(300 + 1300 * k, t, 0.08);
    this.engGain.gain.setTargetAtTime(on ? 0.05 + 0.09 * k : 0, t, 0.08);

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
    const setVoice = (name, freq) => {
      const v = this.voices[name];
      const d = S[name];
      if (on && d < 1300) {
        const vol = 1 - d / 1300;
        v.osc.frequency.setTargetAtTime(freq * doppler, t, 0.02);
        v.gain.gain.setTargetAtTime((0.02 + vol * vol * 0.075) * quiet, t, 0.1);
      } else {
        v.gain.gain.setTargetAtTime(0, t, 0.15);
      }
    };
    setVoice('wail', 680 + 760 * (0.5 - 0.5 * Math.cos((sec / 3.6) * 6.283))); // Yavaş uluma
    setVoice('yelp', 760 + 720 * (0.5 + 0.5 * Math.sin(sec * 19))); // Hızlı yelp
    setVoice('hilo', Math.floor(sec / 0.62) % 2 ? 640 : 475); // Ağır araç iki tonlu
    setVoice('chirp', 1300 + 900 * (sec * 9 - Math.floor(sec * 9))); // Motosiklet kesik siren

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

  crash(k) {
    this.burst(0.2 + k * 0.2, 800 + k * 1400, 0.3 + k * 0.5, 'lowpass', 180);
    this.tone(150, 0.14, 0.2 * k + 0.08, 'square', 60);
    if (k > 0.35) {
      if (Math.random() < 0.5) this.metal(k); else this.glass(k);
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

  // Sentez çığlık: testere sesi + iki gırtlak bandı + titreme
  scream(k = 1) {
    const c = this.ctx;
    if (!c || !this.enabled) return;
    const t = c.currentTime;
    const dur = 0.45 + Math.random() * 0.45;
    const base = [300, 390, 520, 640, 780][Math.floor(Math.random() * 5)];
    const o = c.createOscillator();
    o.type = 'sawtooth';
    o.frequency.setValueAtTime(base * 0.9, t);
    o.frequency.exponentialRampToValueAtTime(base * 1.5, t + dur * 0.28);
    o.frequency.exponentialRampToValueAtTime(base * 0.75, t + dur);
    const vib = c.createOscillator();
    vib.frequency.value = 7 + Math.random() * 5;
    const vibGain = c.createGain();
    vibGain.gain.value = base * 0.05;
    vib.connect(vibGain);
    vibGain.connect(o.frequency);
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.16 * k + 0.03, t + 0.04);
    g.gain.setValueAtTime(0.16 * k + 0.03, t + dur * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    for (const [freq, q] of [[850, 7], [1500, 9], [2800, 11]]) {
      const f = c.createBiquadFilter();
      f.type = 'bandpass';
      f.frequency.value = freq * (0.92 + Math.random() * 0.16);
      f.Q.value = q;
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

  horn(big) {
    const f = big ? 196 : 392;
    this.tone(f, 0.34, 0.09, 'square');
    this.tone(f * 1.26, 0.34, 0.08, 'square');
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

  powerEnd() { this.tone(660, 0.18, 0.1, 'triangle', 240); }

  crunch() { this.burst(0.12, 1300, 0.22, 'bandpass', 500); }
  coin() {
    this.tone(1320, 0.07, 0.16, 'square');
    this.tone(1975, 0.14, 0.16, 'square', 0, 0.06);
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
