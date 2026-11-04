// Oyun mantığı. DOM'a dokunmaz; tarayıcısız test edilebilir.
import { CONFIG, GROUND, MAX_STARS } from './config.js';
import { makeBody, resetBody, stepCar, bounceOff } from './physics.js';
import { World, PROP, PROP_INFO, TILE, CHUNK, isWaterRect, isDeep, isPower, powerName, POWER_KINDS } from './world.js';
import { Effects, FX } from './effects.js';
import { FlowField, driveCop, planBarricade, newPlan } from './police.js';
import { Crowd } from './crowd.js';
import { tx } from './i18n/index.js';

const D = CONFIG.difficulty;
const DMG = CONFIG.damage;
const AI = CONFIG.policeAI;
const SC = CONFIG.score;
const BAR = CONFIG.barricade;
const TK = CONFIG.tank;
const PW = CONFIG.powers;
const AL = CONFIG.aliens;
const PU = CONFIG.pursuit;
const ESC = CONFIG.escape;
const WPN = CONFIG.weapon;
const HPG = CONFIG.copHpGrowth;
// Oyun dakikasına göre yeni polisin silah canı katı: üstel artış, tavanlı
export function copHpMul(time) { return Math.min(HPG.max, HPG.perMin ** (Math.max(0, time) / 60)); }
const WX = CONFIG.weather;
const MEM = CONFIG.memorial;

// Hava: random ise ağırlıklı seçim, değilse ayardaki tür
export function pickWeather(setting, rnd = Math.random) {
  if (WX.types.includes(setting)) return setting;
  const total = WX.types.reduce((a, k) => a + WX.weights[k], 0);
  let r = rnd() * total;
  for (const k of WX.types) { r -= WX.weights[k]; if (r < 0) return k; }
  return 'sunny';
}
const WT = CONFIG.water;
const tmpSirens = new Float32Array(CONFIG.sirens.length);
const byDist = (a, b) => a.pd - b.pd;

export function interp(curve, t) {
  if (t <= curve[0][0]) return curve[0][1];
  for (let i = 1; i < curve.length; i++) {
    if (t <= curve[i][0]) {
      const [t0, v0] = curve[i - 1];
      const [t1, v1] = curve[i];
      return v0 + (v1 - v0) * ((t - t0) / (t1 - t0));
    }
  }
  return curve[curve.length - 1][1];
}

// Süreye göre zorluk: eğriler doğrusal olduğu için her saniye biraz artar.
// heat: arananlık. Yalnız polis baskısını öne alır, aşama ve uzaylı eşikleri süreye bağlıdır
export function difficultyAt(t, out = {}, heat = 0) {
  const h = t + (t >= PU.heat.from ? heat : 0);
  out.stage = t >= D.tanksAt ? 3 : t >= D.advancedAt ? 2 : t >= D.swatAt ? 1 : 0;
  out.stars = Math.min(MAX_STARS, 1 + out.stage);
  out.maxPolice = Math.min(D.maxActive, Math.round(interp(PU.policeCurve, h) * PU.countMul));
  out.spawnInterval = interp(PU.spawnCurve, h) / PU.countMul;
  out.speedMul = interp(PU.speedCurve, h) * PU.speedMul;
  out.closeMax = Math.round(interp(PU.closeCurve, h));
  out.interceptShare = interp(PU.interceptShare, h);
  out.blockShare = interp(PU.blockShare, h);
  out.hpMul = interp(D.hpCurve, t);
  out.power = interp(D.powerCurve, t);
  out.aggression = interp(PU.aggressionCurve, h);
  out.flankerShare = interp(PU.flankerShare, h);
  out.swatShare = t >= D.swatAt ? interp(D.swatShare, t) : 0;
  out.advancedShare = t >= D.advancedAt ? interp(D.advancedShare, t) : 0;
  out.motoShare = t >= D.motoFrom ? interp(D.motoShare, t) : 0;
  out.fastShare = t >= D.fastFrom ? interp(D.fastShare, t) : 0;
  out.tanks = t >= D.tanksAt ? Math.round(interp(D.tankCount, t)) : 0;
  out.barricadeEvery = t >= BAR.from ? interp(PU.barricadeCurve, h) : Infinity;
  out.ufos = t >= D.aliensAt ? Math.round(interp(AL.ufoCount, t)) : 0;
  out.rovers = t >= D.aliensAt ? Math.round(interp(AL.roverCount, t)) : 0;
  return out;
}

// Gece-gündüz: k gece oranı, r/g/b/a ekran rengi. Gündüz boş, alacakaranlık turuncu, gece lacivert
export function dayState(t, out = {}) {
  const Y = CONFIG.day;
  const p = ((t / Y.length + Y.start) % 1 + 1) % 1;
  let k = 0;
  if (p >= Y.duskFrom && p < Y.nightFrom) k = (p - Y.duskFrom) / (Y.nightFrom - Y.duskFrom);
  else if (p >= Y.nightFrom && p < Y.dawnFrom) k = 1;
  else if (p >= Y.dawnFrom) k = 1 - (p - Y.dawnFrom) / (1 - Y.dawnFrom);
  k = k * k * k * (k * (k * 6 - 15) + 10);
  // Gün doğumu gün batımından daha hafif: göz almayan sıcak turuncu
  const warm = Math.sin(Math.min(1, k * 1.1) * Math.PI) * (p >= Y.dawnFrom || p < Y.duskFrom ? 0.65 : 1);
  out.k = k;
  out.a = +(k * Y.darkness + warm * 0.1).toFixed(3);
  out.r = Math.round(10 + warm * 150);
  out.g = Math.round(14 + warm * 62);
  out.b = Math.round(46 - warm * 16);
  return out;
}

export function damageStage(d) {
  const s = DMG.stages;
  return d >= s[3] ? 4 : d >= s[2] ? 3 : d >= s[1] ? 2 : d >= s[0] ? 1 : 0;
}

// Hıza ve araca bağlı çarpma hasarı
export function impactDamage(impact, durability, mul, time) {
  if (impact <= DMG.minImpact) return 0;
  const grace = time < DMG.earlyGraceUntil ? DMG.earlyGraceMul : 1;
  return Math.min(DMG.maxSingleHit, ((impact - DMG.minImpact) * DMG.perSpeed * mul * grace) / durability);
}

function makeCop() {
  const b = makeBody();
  b.id = 0; b.type = 'car'; b.spec = null; b.role = 'chaser'; b.state = 'chase';
  b.drive = { maxSpeed: 0, accel: 0, turnRate: 0, grip: 0, driftGrip: 0 };
  b.hp = 0; b.maxHp = 0; b.power = 1;
  b.ctlS = 0; b.ctlT = 1; b.stuckT = 0; b.reverseT = 0; b.reverses = 0;
  b.los = false; b.hitCd = 0; b.nearCd = 0; b.wakeT = 0;
  b.turret = 0; b.fireT = 0; b.fxT = 0; b.hurtFlash = 0;
  b.wanderT = 0; b.wx = 0; b.wy = 0;
  b.side = 1; b.roleT = 0; b.blockT = 0; b.blockA = 0; b.hold = false; b.far = false; b.pd = 0;
  b.mhp = 100; b.byWeapon = false;
  b.escIn = false; b.escHit = false; b.escHitAt = -99; b.escEnterT = 0; b.escAt = -99; b.escX = 0; b.escY = 0;
  return b;
}

const hit = { nx: 0, ny: 0, depth: 0, rect: null, chunk: null };
const spawnPt = { x: 0, y: 0 };
const plan = newPlan();

export class Game {
  constructor(seed = (Math.random() * 1e9) | 0) {
    this.world = new World(seed);
    this.fx = new Effects();
    this.crowd = new Crowd(this);
    this.dayT = 0;
    this.daylight = dayState(0);
    this.sirens = tmpSirens;
    this.flow = new FlowField();
    this.player = makeBody();
    this.cops = [];
    this.copPool = [];
    for (let i = 0; i < D.maxActive; i++) this.copPool.push(makeCop()); // Oyun sırasında bellek ayrılmaz
    this.copLimit = D.maxActive;
    this.nearCops = [];
    this.flankSide = 1;
    this.shots = [];
    for (let i = 0; i < 8; i++) this.shots.push({ x: 0, y: 0, t: 0, alive: false });
    // Güdümlü mermi havuzu: oyun sırasında bellek ayrılmaz. tx/ty kısa iz
    this.missiles = [];
    for (let i = 0; i < WPN.maxMissiles; i++) this.missiles.push({ alive: false, x: 0, y: 0, vx: 0, vy: 0, t: 0, target: null, tx: new Float32Array(6), ty: new Float32Array(6), ti: 0 });
    this.weapon = null;
    // Hava: tür, yoğunluk (0-1, yumuşak geçiş) ve zemin tutuşları (oyuncu, polis). Bellek ayrılmaz
    this.weather = 'sunny';
    this.weatherSetting = 'random';
    this.wk = 0;
    this.weatherSaid = false;
    this.surfP = CONFIG.surfaces.map((s) => ({ ...s }));
    this.surfC = CONFIG.surfaces.map((s) => ({ ...s }));
    this.spikes = [];
    for (let i = 0; i < 6; i++) this.spikes.push({ x: 0, y: 0, a: 0, len: 0, alive: false, used: false });
    this.diff = difficultyAt(0);
    this.state = 'idle';
    this.carSpec = CONFIG.cars[0];
    this.view = { w: 390, h: 844 };
    this.cam = { x: 0, y: 0, zoom: 1, shake: 0, sx: 0, sy: 0, kx: 0, ky: 0, lvx: 0, lvy: 0, scale: 1, halfW: 200, halfH: 400 };
    this.onEvent = null;
    this.god = false;
    this.tickCount = 0;
    this.nextId = 1;
    this.resetRun(0);
    this.updateCamera(1);
  }

  emit(name, value = 0) {
    if (this.onEvent) this.onEvent(name, value);
  }

  resetRun(startTime) {
    this.time = startTime;
    this.runTime = 0;
    this.score = 0;
    this.coins = 0;
    this.kills = 0;
    this.broken = 0;
    this.driftTime = 0;
    this.nearMisses = 0;
    this.pedHits = 0;
    this.npcHits = 0;
    this.ghostT = 0;
    this.giantT = 0;
    this.heat = 0;
    this.recycleT = 0;
    this.escapes = 0; // Kıl payı kaçış sayısı ve kazandırdığı para
    this.escCoins = 0;
    this.escCombo = 0;
    this.escLastT = -99;
    this.cheat = false; // Kaydedilmez, her koşu kapalı başlar
    this.penalty = 0; // Anıta saygısızlık cezası (para)
    this.mem = { warned: false, reading: false, dismissed: false, dist: Infinity };
    this.cheatUsed = false;
    this.phasing = false;
    this.exitOn = false;
    this.exitX = 0;
    this.exitY = 0;
    this.powerT = 12;
    this.powersTaken = 0;
    this.combo = 1;
    this.comboT = 0;
    this.damage = 0;
    this.stage = 0;
    this.burning = false;
    this.burnT = 0;
    this.hitCd = 0;
    this.stopT = 0;
    this.stuckT = 0;
    this.autoRevT = 0;
    this.sinceHit = 0;
    this.smokeT = 0;
    this.dyingT = 0;
    this.hitFlash = 0;
    this.spawnT = 0;
    this.barricadeT = 12;
    this.tankT = 2;
    this.flowT = 0;
    this.flowReady = false;
    this.warnT = 0;
    this.fireShake = 0;
    this.sirenDist = 1e9;
    this.sirenClosing = 0;
    this.alienT = 0;
    this.aliensOn = startTime >= D.aliensAt;
    this.sinkT = 0;
    this.bubbleT = 0;
    this.cause = '';
    while (this.cops.length) this.copPool.push(this.cops.pop());
    for (const s of this.shots) s.alive = false;
    for (const m of this.missiles) m.alive = false;
    this.weapon = null;
    for (const s of this.spikes) s.alive = false;
    this.fx.clear();
    this.crowd.clear();
    difficultyAt(this.time, this.diff);
    this.lastStage = this.diff.stage;
    this.result = null;
  }

  start(carSpec, { startTime = CONFIG.dev.startTime, god = CONFIG.dev.godMode, seed = (Math.random() * 1e9) | 0, keepWorld = false, weather = 'sunny' } = {}) {
    this.carSpec = carSpec;
    // Menüde hazırlanan dünya aynı havayla kullanılır: çizilmiş zemin yeniden işlenmez
    if (!keepWorld || this.weatherSetting !== weather) this.weather = pickWeather(weather);
    this.weatherSetting = weather;
    this.wk = 0;
    this.weatherSaid = false;
    this.applyWeather();
    this.god = god;
    if (!keepWorld) this.world.reset(seed);
    this.resetRun(startTime);
    this.weapon = carSpec.weapon ? { cd: 0, lock: null, shots: 0 } : null;
    this.dayT = 0;
    dayState(0, this.daylight);
    resetBody(this.player, 100, 300, Math.PI / 2, carSpec);
    this.player.vy = 120;
    this.player.vx = 0;
    this.state = 'play';
    this.drop = null;
    this.cam.x = this.player.x;
    this.cam.y = this.player.y;
    this.cam.zoom = 1;
    this.cam.shake = 0;
    this.cam.lvx = 0;
    this.cam.lvy = 0;
  }

  // Menü arkası: ana yolda giden bir kaçış sahnesi
  startAttract() {
    this.state = 'attract';
    this.world.reset(4242);
    this.resetRun(0);
    this.god = true;
    resetBody(this.player, 0, 100, 0, this.carSpec);
    this.player.vx = 300;
    for (let i = 0; i < 2; i++) {
      const c = this.spawnCop('car', 'chaser', -170 - i * 90, 62 + i * 76, 0);
      c.vx = 300;
    }
    this.cam.x = 0;
    this.cam.y = 100;
  }

  // Geçiş: araç gökte bekler. Dünya hazır, zaman akmaz, kamera iniş noktasına kilitlidir
  holdForDrop() {
    this.state = 'drop';
    this.drop = { y: 1, size: 0.22, shadow: 0.1 };
    const p = this.player;
    this.cam.y = p.y;
    this.cam.lvy = 0;
    this.cam.zoom = CONFIG.camera.dropZoom;
    p.speed = 0;
  }

  // Yere değdiği an: iz, toz, sarsıntı
  landDrop() {
    const p = this.player;
    this.cam.shake = 15;
    this.fx.wave(this.player.x, this.player.y, 90);
    this.fx.sparks(this.player.x, this.player.y + this.player.wid * 0.5, 22);
    const c = Math.cos(p.a); const n = Math.sin(p.a);
    const ww = p.wid * 0.46; const back = p.len * 0.34;
    for (const sg of [-1, 1]) {
      const rx = p.x - c * back - n * ww * sg; const ry = p.y - n * back + c * ww * sg;
      const fx2 = p.x + c * back - n * ww * sg; const fy2 = p.y + n * back + c * ww * sg;
      // Dalgalı kısa frenle izi: düşüş yönünde
      this.fx.addSkid(rx, ry - 62, rx + 2 * sg, ry - 6);
      this.fx.addSkid(fx2, fy2 - 52, fx2 - 2 * sg, fy2 - 6);
      this.fx.addSkid(rx + 2 * sg, ry - 6, rx, ry + 8);
      this.fx.addSkid(fx2 - 2 * sg, fy2 - 6, fx2, fy2 + 8);
    }
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * 6.283;
      const sp = 70 + (i % 5) * 44;
      this.fx.spawn(i % 2 ? FX.DUST : FX.SMOKE, p.x + Math.cos(a) * p.len * 0.45, p.y + Math.sin(a) * p.wid * 0.7, Math.cos(a) * sp, Math.sin(a) * sp * 0.75, 0.55 + (i % 4) * 0.1, 14 + (i % 3) * 8);
    }
  }

  // Düşüş bitti: araç yolda hareketlenir
  releaseDrop() {
    this.drop = null;
    this.state = 'play';
    this.player.vy = 120;
    this.player.speed = 120;
  }

  stopToIdle() {
    this.state = 'idle';
  }

  // --- Ana adım ---
  tick(dt, steer, reverse) {
    this.tickCount++;
    if (this.state === 'play') {
      this.dayT += dt;
      if (this.tickCount % 12 === 0) dayState(this.dayT, this.daylight);
    }
    // Sert darbede kısa duraksama: çarpışma hissi
    if (this.stopT > 0) {
      this.stopT -= dt;
      this.fx.update(dt);
      this.updateCamera(dt);
      return;
    }
    if (this.state === 'drop') { this.world.update(this.player.x, this.player.y); this.player.vy = 0; }
    else if (this.state === 'attract') this.tickAttract(dt);
    else if (this.state === 'play') this.tickPlay(dt, steer, reverse);
    else if (this.state === 'dying') this.tickDying(dt);
    else if (this.state === 'sinking') this.tickSinking(dt);
    this.fx.update(dt);
    this.updateCamera(dt);
  }

  tickAttract(dt) {
    const p = this.player;
    p.x += p.vx * dt;
    p.speed = 300;
    for (const c of this.cops) { c.x += c.vx * dt; c.fxT += dt; }
    this.world.update(p.x, p.y);
    this.crowd.update(dt);
  }

  tickPlay(dt, steer, reverse) {
    this.time += dt;
    this.runTime += dt;
    if (this.wk < 1) { this.wk = Math.min(1, this.wk + dt / WX.fade); this.applyWeather(); }
    if (!this.weatherSaid) { this.weatherSaid = true; this.emit('weather', this.weather); }
    if (this.heat > 0) this.heat = Math.max(0, this.heat - PU.heat.decay * dt);
    difficultyAt(this.time, this.diff, this.heat);
    this.world.update(this.player.x, this.player.y);

    if (this.diff.stage !== this.lastStage) {
      if (this.diff.stage > this.lastStage) {
        this.warnT = 2.4;
        this.emit('alert', this.diff.stage);
      }
      this.lastStage = this.diff.stage;
    }
    if (!this.aliensOn && this.time >= D.aliensAt) {
      this.aliensOn = true;
      this.warnT = 3;
      this.emit('aliens');
    }

    this.updatePlayer(dt, steer, reverse);
    if (this.state !== 'play') return;
    this.updateMemorial();
    this.updateFlow(dt);
    this.updateCops(dt);
    if (this.weapon) this.updateWeapon(dt);
    this.crowd.update(dt);
    this.director(dt);
    this.updatePowers(dt);
    this.updateShots(dt);
    this.updateSpikes();
    this.updateScore(dt);
    this.updateDamage(dt);
    if (this.warnT > 0) this.warnT -= dt;
    if (this.hitFlash > 0) this.hitFlash -= dt * 3;
  }

  tickDying(dt) {
    this.dyingT -= dt;
    this.world.update(this.player.x, this.player.y);
    const p = this.player;
    p.vx *= 1 - 2 * dt;
    p.vy *= 1 - 2 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (Math.random() < 0.3) this.fx.burst(FX.DARK, p.x, p.y, 1, 40, 1, 15);
    this.updateCops(dt * 0.5);
    this.crowd.update(dt);
    this.updateShots(dt);
    if (this.hitFlash > 0) this.hitFlash -= dt * 3;
    if (this.dyingT <= 0) this.finish();
  }

  // Suya düşen araç: çizgi film batışı. Sıçrama, kabarcık, dalga halkaları, sonra skor ekranı
  startSink() {
    const p = this.player;
    this.state = 'sinking';
    this.sinkT = WT.sinkTime;
    this.cause = 'water';
    this.fx.burst(FX.WATER, p.x, p.y, 34, 340, 0.9, 13);
    this.fx.wave(p.x, p.y, 150);
    this.cam.shake = Math.max(this.cam.shake, 9);
    this.emit('sink');
  }

  tickSinking(dt) {
    this.sinkT -= dt;
    const p = this.player;
    p.vx *= 1 - 2.6 * dt;
    p.vy *= 1 - 2.6 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.a += WT.spin * dt;
    this.bubbleT -= dt;
    if (this.bubbleT <= 0) {
      this.bubbleT = WT.bubbleEvery;
      this.fx.spawn(FX.WATER, p.x + (Math.random() - 0.5) * p.len, p.y + (Math.random() - 0.5) * p.len, 0, -26 - Math.random() * 40, 0.8, 4 + Math.random() * 6);
      if (Math.random() < 0.09) this.fx.wave(p.x, p.y, 60 + Math.random() * 70);
    }
    this.world.update(p.x, p.y);
    this.updateCops(dt * 0.5);
    this.crowd.update(dt);
    if (this.sinkT <= 0) this.finish();
  }

  sinkProgress() {
    return this.state === 'sinking' ? 1 - this.sinkT / WT.sinkTime : 0;
  }

  // --- Oyuncu ---
  updatePlayer(dt, steer, reverse) {
    const p = this.player;
    const g = this.world.groundAt(p.x, p.y);
    const noclip = this.cheat || this.exitOn;
    const surf = this.cheat ? CONFIG.surfaces[GROUND.ROAD] : this.surfP[g]; // Hile: hiçbir zemin yavaşlatmaz
    // Duvara saplanınca kendiliğinden geri çıkar: tek parmakla oyun kilitlenmesin
    if (this.autoRevT > 0) {
      this.autoRevT -= dt;
      reverse = true;
    } else if (p.speed < 40 && !reverse && !noclip) {
      this.stuckT += dt;
      if (this.stuckT > DMG.autoReverseAfter) {
        this.stuckT = 0;
        this.autoRevT = DMG.autoReverseTime;
      }
    } else {
      this.stuckT = 0;
    }
    stepCar(p, steer, reverse ? -1 : 1, this.carSpec, surf, dt);
    p.gas = reverse ? 0 : Math.abs(p.steer) > CONFIG.physics.cornerSteer ? 0.45 : 1; // Motor sesi gazı buradan okur
    if (this.hitCd > 0) this.hitCd -= dt;

    // Derin suya düştü: ölümsüzlükte duvar gibi davranır, testler ve geliştirici için
    if (g === GROUND.WATER && !this.god && !noclip && this.world.circleHit(p.x, p.y, WT.deepProbe, hit) && isDeep(hit.rect)) {
      this.startSink();
      return;
    }

    if (noclip) {
      // Hile açıkken de anıt alanı katı engeldir: içeri girilmez, ceza ve patlama olmaz
      if (this.world.memorialHit(p.x, p.y, p.len * 0.5, hit)) {
        p.x += hit.nx * hit.depth;
        p.y += hit.ny * hit.depth;
        bounceOff(p, hit.nx, hit.ny);
      }
      this.phasing = this.world.circleHit(p.x, p.y, p.wid * 0.6, hit);
      if (this.exitOn) this.stepExit(dt);
    } else {
      this.phasing = false;
      const impact = this.collideWorld(p, true);
      if (impact > 0) this.playerImpact(impact, DMG.wallScale, false);
    }
    this.collideProps(p, true);
    this.driftEffects(dt, g);

    if (this.hitFlash > 0 && Math.random() < 0.02) this.fx.sparks(p.x, p.y, 2);
    // Sığ suda sıçrama, kumda toz
    if (p.speed > 130 && Math.random() < 0.4) {
      if (g === GROUND.SHALLOW) this.fx.spawn(FX.WATER, p.x, p.y, -p.vx * 0.15 + (Math.random() - 0.5) * 90, -p.vy * 0.15 + (Math.random() - 0.5) * 90, 0.5, 9);
      else if (g === GROUND.SAND || g === GROUND.DIRT) this.fx.spawn(FX.DUST, p.x, p.y, p.vx * 0.1, p.vy * 0.1, 0.6, 11);
    }
  }

  driftEffects(dt, ground) {
    const p = this.player;
    if (!p.drifting) { p.lastRearValid = false; return; }
    const ca = Math.cos(p.a);
    const sa = Math.sin(p.a);
    const back = -p.len * 0.34;
    const side = p.wid * 0.42;
    const rlx = p.x + ca * back + sa * side;
    const rly = p.y + sa * back - ca * side;
    const rrx = p.x + ca * back - sa * side;
    const rry = p.y + sa * back + ca * side;
    const paved = ground === GROUND.ROAD || ground === GROUND.PLAZA || ground === GROUND.WALK;
    if (p.lastRearValid && paved) {
      this.fx.addSkid(p.lrx, p.lry, rlx, rly);
      this.fx.addSkid(p.rrx, p.rry, rrx, rry);
    }
    p.lrx = rlx; p.lry = rly; p.rrx = rrx; p.rry = rry;
    p.lastRearValid = true;
    this.smokeT -= dt;
    if (this.smokeT <= 0) {
      this.smokeT = 0.035;
      const kind = paved ? FX.SMOKE : ground === GROUND.WATER ? FX.WATER : FX.DUST;
      const px = Math.random() < 0.5 ? rlx : rrx;
      const py = px === rlx ? rly : rry;
      this.fx.spawn(kind, px, py, p.vx * 0.12 + (Math.random() - 0.5) * 30, p.vy * 0.12 + (Math.random() - 0.5) * 30, 0.55 + Math.random() * 0.35, 9 + Math.random() * 7);
    }
  }

  // --- Gizli hile ---
  toggleCheat() {
    if (this.state !== 'play') return false;
    this.cheat = !this.cheat;
    if (this.cheat) {
      this.cheatUsed = true;
      this.exitOn = false;
    } else if (this.world.circleHit(this.player.x, this.player.y, this.player.wid * 0.8, hit)) {
      this.findExit();
    } else {
      this.phasing = false;
    }
    this.emit('cheat', this.cheat ? 1 : 0);
    return this.cheat;
  }

  // Hile bina içinde kapanırsa araç en yakın boş yere süzülür: duvara saplanmaz
  findExit() {
    const p = this.player;
    const r = p.wid * 0.8;
    for (let d = TILE; d < TILE * 40; d += TILE / 2) {
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * 6.283;
        const x = p.x + Math.cos(a) * d;
        const y = p.y + Math.sin(a) * d;
        if (this.world.circleHit(x, y, r, hit) || this.world.groundAt(x, y) === GROUND.WATER) continue;
        this.exitOn = true;
        this.exitX = x;
        this.exitY = y;
        return;
      }
    }
  }

  stepExit(dt) {
    const p = this.player;
    const k = 1 - Math.exp(-9 * dt);
    p.x += (this.exitX - p.x) * k;
    p.y += (this.exitY - p.y) * k;
    p.vx *= 0.8;
    p.vy *= 0.8;
    if (Math.hypot(this.exitX - p.x, this.exitY - p.y) < 5) { this.exitOn = false; this.phasing = false; }
  }

  addHeat(v) {
    if (!this.cheat) this.heat = Math.min(PU.heat.max, this.heat + v);
  }

  playerImpact(impact, mul, fromCop, cap = DMG.maxSingleHit) {
    if (this.cheat) return 0;
    const dmg = Math.min(cap, impactDamage(impact, this.carSpec.durability, mul, this.time));
    if (dmg <= 0) return 0;
    this.emit('crash', Math.min(1, impact / 380));
    if (this.hitCd > 0 && !fromCop) return 0;
    this.hitCd = DMG.hitCooldown;
    this.hurt(dmg);
    const p = this.player;
    this.fx.sparks(p.x, p.y, 8 + Math.round(dmg));
    this.cam.shake = Math.min(14, this.cam.shake + dmg * 0.5);
    this.hitFlash = Math.min(1, dmg / 25);
    if (dmg >= DMG.hitStopMin) this.stopT = DMG.hitStop;
    // Kamera darbenin yönüne itilir
    const sp = p.speed || 1;
    this.cam.kx = (p.vx / sp) * CONFIG.camera.kick * Math.min(1, dmg / 20);
    this.cam.ky = (p.vy / sp) * CONFIG.camera.kick * Math.min(1, dmg / 20);
    return dmg;
  }

  hurt(amount) {
    if (this.god || this.giantT > 0 || this.cheat) return;
    this.damage = Math.min(DMG.stages[3], this.damage + amount);
    if (amount >= 2) this.sinceHit = 0;
    if (this.burning) this.burnT = DMG.burnTime;
  }

  updateDamage(dt) {
    const s = damageStage(this.damage);
    if (s >= 3) {
      if (!this.burning) {
        this.burning = true;
        this.burnT = DMG.burnTime;
        this.emit('fire');
      }
      this.burnT -= dt;
      if (this.burnT > 0) {
        if (!this.god && this.giantT <= 0 && !this.cheat) this.damage += DMG.burnRate * dt;
      } else {
        this.damage = Math.max(DMG.regenFloor, this.damage - DMG.regenRate * dt);
      }
    } else if (this.burning) {
      this.burning = false;
    } else if (this.burnT < 0 && this.damage > DMG.regenFloor) {
      // Ateş söndükten sonra kurtarma alt sınırına kadar çok yavaş iner
      this.damage = Math.max(DMG.regenFloor, this.damage - DMG.regenRate * dt);
    }
    this.sinceHit += dt;
    if (this.sinceHit > DMG.idleRegenAfter && this.damage < DMG.regenFloor && this.damage > DMG.idleRegenFloor) {
      this.damage = Math.max(DMG.idleRegenFloor, this.damage - DMG.idleRegenRate * dt);
    }
    this.stage = damageStage(this.damage);

    // Hasar efektleri
    const p = this.player;
    this.damageFxT = (this.damageFxT || 0) - dt;
    if (this.stage >= 1 && this.damageFxT <= 0) {
      this.damageFxT = this.stage === 1 ? 0.14 : this.stage === 2 ? 0.05 : 0.03;
      const hx = p.x + Math.cos(p.a) * p.len * 0.3;
      const hy = p.y + Math.sin(p.a) * p.len * 0.3;
      if (this.stage === 1) this.fx.spawn(FX.SMOKE, hx, hy, p.vx * 0.2, p.vy * 0.2, 0.7, 9);
      if (this.stage >= 2) this.fx.spawn(FX.DARK, hx, hy, p.vx * 0.3, p.vy * 0.3, 0.9, 13);
      if (this.stage === 2 && Math.random() < 0.3) this.fx.sparks(hx, hy, 1);
      if (this.stage >= 3) this.fx.spawn(FX.FIRE, hx + (Math.random() - 0.5) * 12, hy + (Math.random() - 0.5) * 12, p.vx * 0.5, p.vy * 0.5, 0.36, 8);
    }

    if (this.damage >= DMG.stages[3] && !this.cheat) this.explodePlayer();
  }

  explodePlayer() {
    if (this.state !== 'play') return;
    this.cause = 'wreck';
    const p = this.player;
    this.state = 'dying';
    this.dyingT = DMG.dyingTime;
    this.stage = 4;
    this.fx.explosion(p.x, p.y, 110);
    this.fx.debris(p.x, p.y, this.carSpec.color, 18, 340);
    this.fx.debris(p.x, p.y, '#2b2b33', 12, 280);
    this.cam.shake = 26;
    this.hitFlash = 1;
    this.emit('explosion', 1);
  }

  // Anıta saygısızlık: çizgi film tarzı büyük ateş topu ve duman, oyun hemen biter, para cezası
  // nx, ny: korunan bölümden dışarı yön. Ateş topu anıtın üstüne taşmasın diye o yöne kaydırılır
  memorialFail(nx = 0, ny = 1) {
    if (this.state !== 'play') return;
    this.cause = 'memorial';
    this.penalty = MEM.penalty;
    const p = this.player;
    p.vx = 0; p.vy = 0; p.speed = 0;
    this.state = 'dying';
    this.dyingT = DMG.dyingTime * 1.4;
    this.stage = 4;
    const ex = p.x + nx * MEM.explosionShift;
    const ey = p.y + ny * MEM.explosionShift;
    this.fx.explosion(ex, ey, MEM.explosion);
    this.fx.burst(FX.DARK, ex, ey, 16, 90, 1.6, 26);
    this.fx.debris(p.x, p.y, this.carSpec.color, 14, 260);
    this.cam.shake = 22;
    this.hitFlash = 1;
    this.closeMemorialCard();
    this.emit('explosion', 1);
    this.emit('memorialfail', MEM.penalty);
  }

  // Anıt uyarısı ve okuma kartı: yalnızca uzaklık hesaplanır, kart DOM tarafında
  updateMemorial() {
    const p = this.player;
    const m = this.mem;
    const d = this.world.memorialDist(p.x, p.y);
    m.dist = d;
    if (!m.warned && d < MEM.warnDist) { m.warned = true; this.emit('memorialwarn'); } else if (m.warned && d > MEM.warnReset) m.warned = false;
    if (m.dismissed && d > MEM.readClose) m.dismissed = false;
    const want = !m.dismissed && (d < MEM.readDist || (m.reading && d <= MEM.readClose));
    if (want !== m.reading) { m.reading = want; this.emit('memorialread', want ? 1 : 0); }
  }

  // Kart dokununca kapanır; uzaklaşıp yeniden yaklaşınca tekrar açılır
  dismissMemorialCard() {
    this.mem.dismissed = true;
    this.closeMemorialCard();
  }

  closeMemorialCard() {
    if (this.mem.reading) { this.mem.reading = false; this.emit('memorialread', 0); }
  }

  finish() {
    this.state = 'over';
    if (this.giantT > 0) this.setGiant(false);
    // Hile kullanılan koşu kazandırmaz, rekor saymaz
    // Kıl payı paraları ayrıca eklenir; geri kalan kazanç earnMul ile yumuşatılır
    const base = this.coins - this.escCoins + Math.floor(this.runTime / SC.coinPerSeconds) + this.kills * SC.coinPerKill + Math.floor(this.nearMisses / SC.coinPerNearMisses);
    const memorial = this.cause === 'memorial';
    const earned = this.cheatUsed || memorial ? 0 : Math.round(base * SC.earnMul) + this.escCoins;
    this.result = {
      score: Math.floor(this.score),
      time: this.time,
      coins: earned,
      kills: this.kills,
      broken: this.broken,
      driftTime: this.driftTime,
      nearMisses: this.nearMisses,
      cause: this.cause,
      cheated: this.cheatUsed,
      penalty: memorial ? this.penalty : 0, // Kalıcı paradan düşülür (storage, 0'ın altına inmez)
    };
    this.emit('gameover');
  }

  // --- Çarpışma ---
  collideWorld(b, isPlayer) {
    let best = 0;
    const off = b.len * 0.27;
    const r = b.wid * 0.5;
    for (let i = 0; i < 2; i++) {
      const sign = i === 0 ? 1 : -1;
      const cx = b.x + Math.cos(b.a) * off * sign;
      const cy = b.y + Math.sin(b.a) * off * sign;
      if (!this.world.circleHit(cx, cy, r, hit)) continue;
      const rect = hit.rect;
      // Anıt alanına girmeye çalışan oyuncu: araba patlar, ceza. Ölümsüzlükte (geliştirici) yalnızca duvar
      if (rect.memorial && isPlayer && !this.god && this.state === 'play') {
        this.memorialFail(hit.nx, hit.ny);
        return 0;
      }
      if (b.crusher && !isWaterRect(rect) && !rect.sacred) {
        this.crushRect(hit.chunk, rect);
        continue;
      }
      if (isPlayer && !this.god && isDeep(rect)) continue; // Oyuncu suya girer, batış ayrı karar verilir
      b.x += hit.nx * hit.depth;
      b.y += hit.ny * hit.depth;
      let impact = bounceOff(b, hit.nx, hit.ny);
      if (b.graze) impact *= DMG.grazeScale; // Sürtme sayılır: hasar ve sarsıntı çok az
      if (impact > best) best = impact;
      if (impact > 60) {
        const px = cx - hit.nx * r;
        const py = cy - hit.ny * r;
        if (isWaterRect(rect)) {
          this.fx.burst(FX.WATER, px, py, 8, 170, 0.5, 8);
          if (isPlayer) this.emit('splash');
        } else {
          this.fx.sparks(px, py, Math.round(impact / 40), hit.nx, hit.ny);
        }
      }
    }
    return best;
  }

  crushRect(chunk, rect) {
    const cx = rect.x + rect.w / 2;
    const cy = rect.y + rect.h / 2;
    this.fx.debris(cx, cy, rect.color || '#999', 14, 260);
    this.fx.burst(FX.DUST, cx, cy, 14, 120, 1.1, 26);
    this.cam.shake = Math.min(10, this.cam.shake + 3);
    this.world.crush(chunk, rect);
    this.emit('crush');
  }

  collideProps(b, isPlayer) {
    const world = this.world;
    const reach = 60;
    const c0x = Math.floor((b.x - reach) / CHUNK);
    const c1x = Math.floor((b.x + reach) / CHUNK);
    const c0y = Math.floor((b.y - reach) / CHUNK);
    const c1y = Math.floor((b.y + reach) / CHUNK);
    const R = b.len * 0.42;
    for (let cy = c0y; cy <= c1y; cy++) {
      for (let cx = c0x; cx <= c1x; cx++) {
        const c = world.chunk(cx, cy);
        for (let i = 0; i < c.propCount; i++) {
          const pr = c.props[i];
          if (!pr.alive) continue;
          const dx = pr.x - b.x;
          const dy = pr.y - b.y;
          if (dx > 90 || dx < -90 || dy > 90 || dy < -90) continue;
          if (isPower(pr.kind)) {
            if (isPlayer && dx * dx + dy * dy < (40 + R) * (40 + R)) {
              pr.alive = false;
              this.takePower(powerName(pr.kind), pr.x, pr.y);
            }
            continue;
          }
          if (pr.kind === PROP.COIN) {
            if (!isPlayer) continue;
            const m = CONFIG.coin.magnet;
            if (dx * dx + dy * dy < m * m) {
              pr.alive = false;
              this.coins++;
              this.fx.burst(FX.GLINT, pr.x, pr.y, 6, 110, 0.4, 5);
              this.emit('coin');
            }
            continue;
          }
          const info = PROP_INFO[pr.kind];
          if (info.pass || (isPlayer && (this.cheat || this.exitOn))) continue;
          const rr = info.r + R;
          const d2 = dx * dx + dy * dy;
          if (d2 >= rr * rr) continue;
          const speed = Math.hypot(b.vx, b.vy);
          if (!info.safe && (speed >= info.brk || b.crusher || b.breaker || (isPlayer && this.giantT > 0))) {
            this.breakProp(b, pr, info, isPlayer);
          } else {
            // Yavaş temas: katı engel gibi it
            const d = Math.sqrt(d2) || 1;
            const nx = -dx / d;
            const ny = -dy / d;
            b.x += nx * (rr - d);
            b.y += ny * (rr - d);
            bounceOff(b, nx, ny);
          }
        }
      }
    }
  }

  breakProp(b, pr, info, isPlayer) {
    pr.alive = false;
    const keep = 1 - info.drag / (b.mass || 1);
    b.vx *= keep;
    b.vy *= keep;
    this.fx.debris(pr.x, pr.y, info.chip, pr.kind === PROP.PARKED ? 16 : 8);
    if (pr.kind === PROP.PARKED) this.fx.sparks(pr.x, pr.y, 10);
    if (!isPlayer) return;
    this.broken++;
    this.addHeat(PU.heat.prop);
    this.addScore(SC.prop, pr.x, pr.y);
    if (info.dmg > 0) this.hurt(info.dmg / this.carSpec.durability);
    this.emit('break', info.drag);
    if (info.snd) {
      this.emit(info.snd);
      if (pr.kind === PROP.SIMITCART) this.fx.burst(FX.SIMIT, pr.x, pr.y, 10, 210, 1.2, 7);
    }
    if (info.coin && Math.random() < CONFIG.coin.dropChance) {
      this.world.dropCoin(pr.x + (Math.random() - 0.5) * 30, pr.y + (Math.random() - 0.5) * 30);
    }
  }

  // Araba-araba: 2x2 daire içinden en derin çift
  collideCars(a, b) {
    const ao = a.len * 0.27;
    const bo = b.len * 0.27;
    const ar = a.wid * 0.5;
    const br = b.wid * 0.5;
    const acx = Math.cos(a.a) * ao;
    const acy = Math.sin(a.a) * ao;
    const bcx = Math.cos(b.a) * bo;
    const bcy = Math.sin(b.a) * bo;
    let bestD = 0;
    let nx = 0;
    let ny = 0;
    const sum = ar + br;
    for (let i = -1; i <= 1; i += 2) {
      for (let j = -1; j <= 1; j += 2) {
        const dx = b.x + bcx * j - (a.x + acx * i);
        const dy = b.y + bcy * j - (a.y + acy * i);
        const d2 = dx * dx + dy * dy;
        if (d2 >= sum * sum) continue;
        const d = Math.sqrt(d2) || 0.01;
        const pen = sum - d;
        if (pen > bestD) { bestD = pen; nx = dx / d; ny = dy / d; }
      }
    }
    if (bestD <= 0) return 0;
    const ma = a.staticBody ? 1e6 : a.mass;
    const mb = b.staticBody ? 1e6 : b.mass;
    const ia = 1 / ma;
    const ib = 1 / mb;
    const k = bestD / (ia + ib);
    a.x -= nx * k * ia;
    a.y -= ny * k * ia;
    b.x += nx * k * ib;
    b.y += ny * k * ib;
    const rv = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
    if (rv >= 0) return 0.001;
    const j = (-(1 + 0.25) * rv) / (ia + ib);
    a.vx -= j * nx * ia;
    a.vy -= j * ny * ia;
    b.vx += j * nx * ib;
    b.vy += j * ny * ib;
    return -rv;
  }

  // --- Polis ---
  spawnCop(type, role, x, y, a) {
    const spec = CONFIG.police[type] || AL[type];
    const c = this.copPool.pop() || makeCop();
    const d = this.diff;
    resetBody(c, x, y, a, spec);
    c.id = this.nextId++;
    c.type = type;
    c.spec = spec;
    c.role = role;
    c.state = 'chase';
    c.crusher = type === 'tank';
    c.flying = type === 'ufo';
    c.beam = 0;
    c.sirenId = spec.siren ? this.pickSiren(spec.siren) : -1;
    c.wanderT = 0;
    c.staticBody = false;
    // Polis son hızı her zaman oyuncu arabasına oranlıdır, yani hep biraz yavaştır
    // Uzaylılar kendi hızındadır. Polis zamanla hızlanır ama oyuncuyu geçemez
    const ratio = spec.speed < 1 ? Math.min(Math.max(spec.speed, PU.speedRatioMax), spec.speed * d.speedMul) : spec.speed;
    c.drive.maxSpeed = this.carSpec.maxSpeed * ratio * CONFIG.speedScale.police;
    c.drive.accel = spec.accel;
    c.drive.turnRate = spec.turnRate;
    c.drive.grip = spec.grip;
    c.drive.driftGrip = spec.driftGrip;
    c.maxHp = spec.hp * d.hpMul;
    c.hp = c.maxHp;
    c.power = d.power;
    c.ctlS = 0; c.ctlT = 1; c.stuckT = 0; c.reverseT = 0; c.reverses = 0;
    c.los = false; c.hitCd = 0; c.nearCd = 0; c.wakeT = 0;
    this.flankSide = -this.flankSide;
    c.side = this.flankSide; c.roleT = PU.roleTime; c.blockT = 0; c.hold = false; c.far = false;
    c.mhpMax = (WPN.hp[type] || WPN.hp.car) * copHpMul(this.time); c.mhp = c.mhpMax; c.byWeapon = false;
    c.escIn = false; c.escHit = false; c.escHitAt = -99; c.escEnterT = 0; c.escAt = -99;
    c.turret = a; c.fireT = TK.fireEvery * 0.6; c.fxT = Math.random() * 3; c.hurtFlash = 0;
    // Hiçbir araç anıt alanında doğmaz (uçanlar dahil)
    if (this.world.memorialHit(c.x, c.y, c.len * 0.6 + 20, hit)) { c.x += hit.nx * hit.depth; c.y += hit.ny * hit.depth; }
    this.cops.push(c);
    return c;
  }

  // En az kullanılan siren: aynı anda gelen polisler farklı duyulur.
  // Eşitlikte önce araç tipinin sireni, sonra rastgele biri
  pickSiren(pref) {
    const n = CONFIG.sirens.length;
    const use = new Array(n).fill(0);
    for (const c of this.cops) if (c.sirenId >= 0) use[c.sirenId]++;
    const p = CONFIG.sirens.indexOf(pref);
    if (pref === 'ufo' || pref === 'zap') return p; // Uzaylıların sesi kendine özgü
    const police = n - 2;
    let min = 1e9;
    for (let i = 0; i < police; i++) if (use[i] < min) min = use[i];
    if (use[p] === min) return p;
    const free = [];
    for (let i = 0; i < police; i++) if (use[i] === min) free.push(i);
    return free[Math.floor(Math.random() * free.length)];
  }

  removeCop(i) {
    const c = this.cops[i];
    this.cops[i] = this.cops[this.cops.length - 1];
    this.cops.pop();
    this.copPool.push(c);
  }

  destroyCop(i, byPlayer) {
    const c = this.cops[i];
    const size = c.type === 'tank' ? 120 : c.type === 'swat' ? 70 : c.type === 'ufo' ? 110 : 52;
    this.fx.explosion(c.x, c.y, size);
    this.fx.debris(c.x, c.y, c.type === 'tank' ? '#5d6b3a' : c.type === 'ufo' || c.type === 'rover' ? '#39ff9c' : '#2f4c8a', 12, 280);
    this.fx.debris(c.x, c.y, '#f4f4f4', 6, 240);
    this.kills++;
    this.addHeat(PU.heat.kill);
    this.addScore(SC.kill * (c.type === 'tank' ? 8 : c.type === 'ufo' ? 6 : c.type === 'rover' ? 3 : c.type === 'swat' ? 2 : 1), c.x, c.y, byPlayer ? SC.comboKillStep : 0);
    if (Math.random() < 0.6) this.world.dropCoin(c.x, c.y);
    const near = Math.hypot(c.x - this.player.x, c.y - this.player.y) < 500;
    this.emit('copdown', near ? 1 : 0.4);
    if (near) this.cam.shake = Math.min(12, this.cam.shake + 5);
    this.removeCop(i);
  }

  updateFlow(dt) {
    this.flowT -= dt;
    if (this.flowT <= 0) {
      this.flowT = AI.flowInterval;
      this.flow.compute(this.world, this.player.x, this.player.y);
      this.flowReady = true;
    }
  }

  viewRadius() {
    return Math.hypot(this.cam.halfW, this.cam.halfH);
  }

  onScreen(x, y, m) {
    const c = this.cam;
    return Math.abs(x - c.x) < c.halfW + m && Math.abs(y - c.y) < c.halfH + m;
  }

  updateCops(dt) {
    const p = this.player;
    const world = this.world;
    let nearest = 1e9;
    let closing = 0;
    const sirens = this.sirens;
    sirens.fill(1e9);
    const playing = this.state === 'play';
    if (this.tickCount % PU.holdEvery === 0) this.assignHolds();

    for (let i = this.cops.length - 1; i >= 0; i--) {
      const c = this.cops[i];
      const dx = p.x - c.x;
      const dy = p.y - c.y;
      const dist = Math.hypot(dx, dy);

      // Çok uzaktaki silinir, yöneten yakında yenisini doğurur
      if (dist > AI.despawnDist && !this.onScreen(c.x, c.y, 80)) {
        this.removeCop(i);
        continue;
      }
      // Uzak ve görünmeyen polis seyrek hesaplanır: adım büyür, sonuç aynı yola çıkar
      c.far = dist > PU.farDist && !c.flying && !this.onScreen(c.x, c.y, 200);
      if (c.far && (this.tickCount + c.id) % PU.farStep !== 0) {
        if (playing) {
          if (dist < nearest) nearest = dist;
          if (c.sirenId >= 0 && dist < sirens[c.sirenId]) sirens[c.sirenId] = dist;
        }
        continue;
      }
      const cdt = c.far ? dt * PU.farStep : dt;
      driveCop(c, this, cdt);
      if (c.hitCd > 0) c.hitCd -= cdt;
      if (c.nearCd > 0) c.nearCd -= cdt;
      c.fxT += cdt;

      if (c.flying) {
        this.updateUfo(c, dt, playing);
      } else if (c.state === 'barricade') {
        c.staticBody = true;
      } else {
        c.staticBody = false;
        const surf = this.surfC[world.groundAt(c.x, c.y)];
        stepCar(c, c.ctlS, c.ctlT, c.drive, surf, cdt);
        const impact = this.collideWorld(c, false);
        if (impact > AI.wallMinImpact) {
          c.hp -= (impact - AI.wallMinImpact) * AI.wallDamage * (40 / Math.max(40, c.spec.hp * 0.5));
          c.hurtFlash = 0.3;
        }
        // Nesne taraması ekran çevresinde ve kare atlayarak: telefonda yük azalır
        if (!c.far && (this.tickCount + c.id) % 3 === 0 && this.onScreen(c.x, c.y, 160)) this.collideProps(c, false);
      }

      if (c.hurtFlash > 0) c.hurtFlash -= dt;
      if (c.hp < c.maxHp * 0.5 && Math.random() < 0.25 && this.onScreen(c.x, c.y, 60)) {
        this.fx.spawn(c.hp < c.maxHp * 0.25 ? FX.DARK : FX.SMOKE, c.x, c.y, c.vx * 0.2, c.vy * 0.2, 0.7, 11);
      }
      if (c.hp <= 0) { this.destroyCop(i, c.byWeapon); continue; }

      if (playing) {
        // Oyuncu ile çarpışma
        // Hilede polis görünür ve kovalar ama değemez
        if (!c.flying && dist < (c.len + p.len) * 0.75 && this.ghostT <= 0 && !this.cheat) {
          const rv = this.collideCars(p, c);
          if (rv > 0) c.escHitAt = this.runTime; // Değdi: bu geçiş kıl payı sayılmaz
          if (rv > 1) this.copContact(c, rv, i);
          if (i >= this.cops.length || this.cops[i] !== c) continue;
        }
        // Yakın kaçış
        if (this.ghostT <= 0 && !this.cheat && c.nearCd <= 0 && c.hitCd <= 0 && dist < SC.nearMissDist + c.wid * 0.5 && c.state === 'chase') {
          const rvx = p.vx - c.vx;
          const rvy = p.vy - c.vy;
          const rel = Math.hypot(rvx, rvy);
          if (rel > SC.nearMissSpeed && dist > (c.wid + p.wid) * 0.55 && rvx * -dx + rvy * -dy > 0) {
            c.nearCd = 2.5;
            this.nearMisses++;
            this.addHeat(PU.heat.nearMiss);
            this.addScore(SC.nearMiss, p.x, p.y - 30, SC.comboNearStep, '#7af6ff');
            this.emit('nearmiss');
          }
        }
        if (!c.flying) this.checkEscape(c, dist);
        if (dist < nearest) {
          nearest = dist;
          closing = (dx * (c.vx - p.vx) + dy * (c.vy - p.vy)) / (dist || 1);
        }
        if (c.sirenId >= 0 && dist < sirens[c.sirenId]) sirens[c.sirenId] = dist;
        if (c.type === 'tank' && this.ghostT <= 0) this.tankFire(c, dist, dt);
      }
    }

    // Polisler birbirinin içinden geçmez
    const cops = this.cops;
    for (let i = 0; i < cops.length; i++) {
      for (let j = i + 1; j < cops.length; j++) {
        const a = cops[i];
        const b = cops[j];
        if (a.flying || b.flying || (a.far && b.far)) continue;
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const r = (a.len + b.len) * 0.6;
        if (dx * dx + dy * dy < r * r) this.collideCars(a, b);
      }
    }
    this.sirenDist = nearest;
    this.sirenClosing = closing;
  }

  // Zemin tutuşu havaya göre, yoğunlukla yumuşakça. Polis etkinin yarısını hisseder
  applyWeather() {
    const g = WX.grip[this.weather] ?? 1;
    const v = WX.speed[this.weather] ?? 1;
    const k = this.wk;
    for (let i = 0; i < CONFIG.surfaces.length; i++) {
      const s = CONFIG.surfaces[i];
      const gp = 1 - (1 - g) * k; const vp = 1 - (1 - v) * k;
      this.surfP[i].grip = s.grip * gp; this.surfP[i].speed = s.speed * vp;
      this.surfC[i].grip = s.grip * (1 - (1 - gp) * WX.copShare); this.surfC[i].speed = s.speed * (1 - (1 - vp) * WX.copShare);
    }
  }

  // --- Güdümlü enerji topu ---
  // Atış: bekleme süresi dolmuşsa burundan çıkar, varsa kilitli polisi izler. Cephane sınırsız. true: atıldı
  fire() {
    const w = this.weapon;
    if (!w || this.state !== 'play' || w.cd > 0) return false;
    const m = this.missiles.find((k) => !k.alive);
    if (!m) return false;
    const p = this.player;
    const ca = Math.cos(p.a); const sa = Math.sin(p.a);
    m.alive = true; m.t = 0; m.ti = 0;
    m.x = p.x + ca * p.len * 0.55; m.y = p.y + sa * p.len * 0.55;
    m.vx = ca * WPN.speed + p.vx * 0.3; m.vy = sa * WPN.speed + p.vy * 0.3;
    m.target = w.lock;
    for (let i = 0; i < m.tx.length; i++) { m.tx[i] = m.x; m.ty[i] = m.y; }
    w.shots++;
    w.cd += WPN.fireEvery; // Taşan süre korunur: atışlar eşit aralıklı
    if (w.cd <= 0) w.cd = WPN.fireEvery;
    this.emit('fire');
    return true;
  }

  // Önündeki konide en yakın polis: hedef işareti bunun üstünde
  findLock() {
    const p = this.player;
    const ca = Math.cos(p.a); const sa = Math.sin(p.a);
    const cosCone = Math.cos(WPN.cone);
    let best = null;
    let bd = WPN.range;
    for (const c of this.cops) {
      const dx = c.x - p.x; const dy = c.y - p.y;
      const d = Math.hypot(dx, dy);
      if (d >= bd || d < 1) continue;
      if ((dx * ca + dy * sa) / d < cosCone) continue;
      best = c; bd = d;
    }
    return best;
  }

  updateWeapon(dt) {
    const w = this.weapon;
    if (w.cd > 0) w.cd -= dt;
    // Hazırken her kare hedef aranır: hedef çıkınca hemen atılır. Beklerken seyrek aranır
    if (w.cd <= 0 || this.tickCount % WPN.lockEvery === 0) w.lock = this.findLock();
    else if (w.lock && !this.cops.includes(w.lock)) w.lock = null;
    if (w.cd <= 0) {
      if (w.lock && this.state === 'play') this.fire();
      else w.cd = Math.max(w.cd, -dt); // Hedef yokken beklenen süre birikmez
    }
    for (const m of this.missiles) if (m.alive) this.stepMissile(m, dt);
  }

  stepMissile(m, dt) {
    m.t += dt;
    if (m.target && !this.cops.includes(m.target)) m.target = null; // Hedef yok olduysa düz gider
    if (m.target) {
      const want = Math.atan2(m.target.y - m.y, m.target.x - m.x);
      const now = Math.atan2(m.vy, m.vx);
      let diff = want - now;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      const a = now + Math.max(-WPN.turn * dt, Math.min(WPN.turn * dt, diff));
      const sp = Math.hypot(m.vx, m.vy);
      m.vx = Math.cos(a) * sp; m.vy = Math.sin(a) * sp;
    }
    m.x += m.vx * dt; m.y += m.vy * dt;
    m.ti = (m.ti + 1) % m.tx.length; m.tx[m.ti] = m.x; m.ty[m.ti] = m.y;
    // Duvara, binaya çarpınca ya da ömrü bitince söner
    if (m.t > WPN.life || this.world.blockedAt(m.x, m.y)) {
      m.alive = false;
      this.fx.burst(FX.GLINT, m.x, m.y, 6, 90, 0.3, 6);
      return;
    }
    const r2 = WPN.hitR * WPN.hitR;
    for (const c of this.cops) {
      const dx = c.x - m.x; const dy = c.y - m.y;
      const rr = WPN.hitR + c.wid * 0.5;
      if (dx * dx + dy * dy > Math.max(r2, rr * rr)) continue;
      m.alive = false;
      this.hitCop(c, m.x, m.y);
      return;
    }
  }

  // Her isabet sabit hasar (zırhlıda azaltılmış). Gereken isabet = can / hasar
  hitCop(c, x, y) {
    const full = c.mhpMax || WPN.hp[c.type] || WPN.hp.car;
    const dmg = WPN.damage * (WPN.armor[c.type] ?? 1);
    c.mhp -= dmg;
    c.hp = Math.min(c.hp - (c.maxHp * dmg) / full, (c.maxHp * c.mhp) / full);
    if (c.mhp <= 0) { c.hp = -1; c.byWeapon = true; }
    c.hurtFlash = 0.35;
    this.fx.burst(FX.GLINT, x, y, 10, 160, 0.35, 7);
    this.fx.burst(FX.SMOKE, x, y, 4, 60, 0.7, 12);
    this.emit('missilehit', c.mhp <= 0 ? 1 : 0.5);
  }

  // Kıl payı kaçış: polis yakın bölgeye girer, değmeden çıkarsa ödül. Ödül çıkış anında verilir
  checkEscape(c, dist) {
    const p = this.player;
    const zone = p.wid * ESC.distMul + (p.len + p.wid + c.len + c.wid) / 4;
    if (!c.escIn) {
      if (dist < zone && this.escapeEligible(c)) {
        c.escIn = true; c.escHit = false; c.escEnterT = this.runTime; c.escX = p.x; c.escY = p.y;
      }
      return 0;
    }
    if (dist < zone * ESC.exitMul) {
      if (this.runTime - c.escEnterT > ESC.maxClose) c.escHit = true; // Yanında uzun kaldı: sıkışma ya da dönüp durma
      return 0;
    }
    c.escIn = false;
    // Girişten hemen önceki temas da sayılır: çarpışma aynı karede bölgeye girişten önce işlenir
    if (c.escHit || c.escHitAt >= c.escEnterT - 0.1 || !this.escapeEligible(c)) return 0;
    if (this.runTime - c.escAt < ESC.cooldown || this.runTime - this.escLastT < ESC.globalGap) return 0;
    if (Math.hypot(p.x - c.escX, p.y - c.escY) < ESC.minTravel) return 0;
    return this.rewardEscape(c);
  }

  // Yalnız polis gerçekten kovalarken, oyuncu hızla ileri giderken; hile ve görünmezlikte yok
  escapeEligible(c) {
    const p = this.player;
    if (this.state !== 'play' || this.cheat || this.ghostT > 0 || c.flying) return false;
    if (c.state !== 'chase' && c.state !== 'block' && c.state !== 'barricade') return false;
    return p.speed >= ESC.minSpeed && p.forward > 0 && this.autoRevT <= 0;
  }

  rewardEscape(c) {
    const amount = ESC.min + Math.floor(Math.random() * (ESC.max - ESC.min + 1));
    this.escCombo = this.runTime - this.escLastT <= ESC.comboWindow ? this.escCombo + 1 : 1;
    const bonus = this.escCombo % ESC.comboEvery === 0 ? ESC.comboBonus : 0;
    const total = amount + bonus;
    this.coins += total;
    this.escCoins += total;
    this.escapes++;
    this.escLastT = this.runTime;
    c.escAt = this.runTime;
    this.emit('escape', { amount, bonus });
    return total;
  }

  // Adalet: oyuncunun çevresine aynı anda sınırlı polis girer, önü tamamen kapanmaz. Fazlası gaz keser
  assignHolds() {
    const p = this.player;
    const near = this.nearCops;
    near.length = 0;
    const fx = Math.cos(p.a);
    const fy = Math.sin(p.a);
    for (const c of this.cops) {
      c.hold = false;
      if (c.flying || c.type === 'tank' || c.state === 'barricade') continue;
      c.pd = Math.hypot(c.x - p.x, c.y - p.y);
      if (c.pd < PU.closeR) near.push(c);
    }
    near.sort(byDist);
    for (let i = this.diff.closeMax; i < near.length; i++) near[i].hold = true;
    let front = 0;
    for (const c of this.cops) {
      if (c.flying || c.type === 'tank' || c.state === 'barricade' || c.pd >= PU.frontR) continue;
      if ((c.x - p.x) * fx + (c.y - p.y) * fy < 0) continue;
      front++;
      if (front > PU.frontMax) c.hold = true;
    }
  }

  copContact(c, rv) {
    const p = this.player;
    if (c.hitCd > 0) return;
    c.hitCd = 0.5;
    const spec = c.spec;
    if (this.giantT > 0) {
      // Dev mod: polisi ezer, hasar almaz
      c.hp -= c.type === 'tank' ? PW.giantCrushTank : 1e6;
      this.fx.sparks(c.x, c.y, 14);
      this.cam.shake = Math.min(12, this.cam.shake + 4);
      return;
    }
    const mul = spec.ram * c.power * Math.min(2, Math.sqrt(spec.mass / this.carSpec.mass));
    this.playerImpact(rv + 40, mul * DMG.copScale, true, DMG.maxCopHit * spec.ram * c.power);
    // Oyuncu ne kadar ağır ve hızlıysa polise o kadar vurur. Ağır araçlara az işler.
    const force = (rv * AI.ramDamage * this.carSpec.mass) / Math.max(1, spec.mass * 0.75);
    c.hp -= force;
    c.hurtFlash = 0.3;
    this.fx.sparks((p.x + c.x) / 2, (p.y + c.y) / 2, 10);
    // PIT: gelişmiş kıstırıcı yandan vurursa oyuncunun kuyruğu savrulur
    if (c.role === 'flanker' && c.type === 'advanced') {
      const fx = Math.cos(p.a);
      const fy = Math.sin(p.a);
      const side = (c.x - p.x) * -fy + (c.y - p.y) * fx;
      p.w += (side > 0 ? -1 : 1) * AI.pitYaw;
      p.grip *= 0.5;
    }
  }

  // Uçan daire: binaların üstünden düz gelir, üstüne çıkınca ışınla çeker ve hasar verir
  updateUfo(c, dt, playing) {
    const p = this.player;
    const dx = p.x + p.vx * 0.35 - c.x;
    const dy = p.y + p.vy * 0.35 - c.y;
    const d = Math.hypot(dx, dy) || 1;
    const top = c.drive.maxSpeed;
    const slow = this.ghostT > 0 ? 0.25 : 1;
    const want = Math.min(top, d * 3.2) * slow;
    const k = 1 - Math.exp(-3.4 * dt);
    c.vx += ((dx / d) * want - c.vx) * k;
    c.vy += ((dy / d) * want - c.vy) * k;
    c.x += c.vx * dt;
    c.y += c.vy * dt;
    // Uçan araçlar anıt alanının üstünden geçmez
    if (this.world.memorialHit(c.x, c.y, c.len * 0.6 + 20, hit)) {
      c.x += hit.nx * hit.depth; c.y += hit.ny * hit.depth;
      const vn = c.vx * hit.nx + c.vy * hit.ny;
      if (vn < 0) { c.vx -= vn * hit.nx; c.vy -= vn * hit.ny; }
    }
    c.a += dt * 2;
    const bx = p.x - c.x;
    const by = p.y - c.y;
    const bd = Math.hypot(bx, by);
    c.beam = playing && this.ghostT <= 0 && !this.cheat && bd < AL.beamRange ? 1 : 0;
    if (c.beam) {
      p.vx -= (bx / (bd + 1)) * AL.beamPull * dt;
      p.vy -= (by / (bd + 1)) * AL.beamPull * dt;
      const keep = 1 - AL.beamSlow * dt;
      p.vx *= keep;
      p.vy *= keep;
      this.hurt((AL.beamDps * dt) / this.carSpec.durability);
      this.sinceHit = 0;
      this.hitFlash = Math.max(this.hitFlash, 0.25);
      if (Math.random() < 0.3) this.fx.spawn(FX.GLINT, p.x + (Math.random() - 0.5) * 60, p.y + (Math.random() - 0.5) * 60, 0, 0, 0.4, 5);
    }
  }

  // --- Yönetmen: doğma, barikat, tank ---
  countRole(role) {
    let n = 0;
    for (const c of this.cops) if (c.role === role) n++;
    return n;
  }

  pickRole(r) {
    const d = this.diff;
    let s = d.interceptShare;
    if (r < s) return this.countRole('interceptor') < PU.maxInterceptors ? 'interceptor' : 'chaser';
    s += d.blockShare;
    if (r < s) return this.countRole('blocker') < PU.maxBlockers ? 'blocker' : 'chaser';
    s += d.flankerShare;
    return r < s ? 'flanker' : 'chaser';
  }

  // Ekran dışındaki en uzak sıradan polisi havuza alır. Yenisi oyuncunun önünde doğar
  dropFarthest(minDist = 0) {
    const p = this.player;
    let best = -1;
    let far = minDist;
    for (let i = 0; i < this.cops.length; i++) {
      const c = this.cops[i];
      if (c.type === 'tank' || c.flying || this.onScreen(c.x, c.y, 120)) continue;
      const d = Math.hypot(c.x - p.x, c.y - p.y);
      if (d > far) { far = d; best = i; }
    }
    if (best < 0) return false;
    this.removeCop(best);
    return true;
  }

  // Özel araçlar için yer açar: sınır aşılmaz
  makeRoom(n) {
    while (this.cops.length + n > this.copLimit) if (!this.dropFarthest()) return false;
    return true;
  }

  countType(type) {
    let n = 0;
    for (const c of this.cops) if (c.type === type) n++;
    return n;
  }

  pickType(r) {
    const d = this.diff;
    let s = d.advancedShare;
    if (r < s) return 'advanced';
    s += d.swatShare;
    if (r < s) return 'swat';
    s += d.fastShare;
    if (r < s) return 'fast';
    s += d.motoShare;
    if (r < s) return 'moto';
    return 'car';
  }

  // Ekran dışı yol karosu bulur; akış alanında ulaşılabilir olmalı
  findSpawn(out, minR, maxR, bias, spreadBy = 2.2) {
    const p = this.player;
    const heading = Math.atan2(p.vy, p.vx);
    for (let i = 0; i < 16; i++) {
      const spread = bias ? (Math.random() - 0.5) * spreadBy : Math.random() * 6.283;
      const a = bias ? heading + spread : spread;
      const r = minR + Math.random() * (maxR - minR);
      const x = p.x + Math.cos(a) * r;
      const y = p.y + Math.sin(a) * r;
      if (this.world.groundAt(x, y) !== GROUND.ROAD) continue;
      const tx = (Math.floor(x / TILE) + 0.5) * TILE;
      const ty = (Math.floor(y / TILE) + 0.5) * TILE;
      if (this.world.blockedAt(tx, ty)) continue;
      if (this.onScreen(tx, ty, 70)) continue;
      out.x = tx;
      out.y = ty;
      return true;
    }
    return false;
  }

  director(dt) {
    const d = this.diff;
    const p = this.player;
    if (this.runTime < Math.min(D.firstSpawnAt, this.time < D.swatAt ? D.firstSpawnAt : 2)) return;
    this.spawnT -= dt;
    // Oyuncu çok açılırsa kovalama kopmasın
    if (this.sirenDist > AI.catchUpDist && this.spawnT > 0.6) this.spawnT = 0.6;
    const cap = Math.min(d.maxPolice, this.copLimit);
    this.recycleT -= dt;
    if (this.recycleT <= 0) {
      this.recycleT = PU.recycleEvery;
      if (this.cops.length > this.copLimit) this.dropFarthest();
      else if (this.cops.length >= cap) this.dropFarthest(PU.recycleDist);
    }
    const active = this.cops.length;
    if (this.spawnT <= 0 && active < cap) {
      const min = this.viewRadius() + AI.viewMargin;
      const role = this.pickRole(Math.random());
      const ahead = role === 'interceptor' || role === 'blocker';
      if (this.findSpawn(spawnPt, min, min + AI.spawnExtra, ahead || Math.random() < 0.5, ahead ? PU.aheadSpread : 2.2)) {
        const type = this.pickType(Math.random());
        this.spawnCop(type, role, spawnPt.x, spawnPt.y, Math.atan2(p.y - spawnPt.y, p.x - spawnPt.x));
        this.spawnT = d.spawnInterval;
      } else {
        this.spawnT = 0.25;
      }
    }

    if (d.ufos > 0) {
      this.alienT -= dt;
      if (this.alienT <= 0) {
        this.alienT = AL.spawnEvery;
        const min = this.viewRadius() + 160;
        const heading = Math.atan2(p.vy, p.vx) + (Math.random() - 0.5) * 2.6;
        if (this.countType('ufo') < Math.min(d.ufos, Math.ceil(this.copLimit * 0.2)) && this.makeRoom(1)) {
          // Daire binaya takılmaz, önünden gelir
          this.spawnCop('ufo', 'chaser', p.x + Math.cos(heading) * min, p.y + Math.sin(heading) * min, 0);
        }
        if (this.countType('rover') < Math.min(d.rovers, Math.ceil(this.copLimit * 0.4)) && this.makeRoom(1) && this.findSpawn(spawnPt, min, min + 300, true)) {
          this.spawnCop('rover', Math.random() < 0.5 ? 'flanker' : 'chaser', spawnPt.x, spawnPt.y, Math.atan2(p.y - spawnPt.y, p.x - spawnPt.x));
        }
      }
    }

    if (d.tanks > 0) {
      this.tankT -= dt;
      if (this.tankT <= 0 && this.countType('tank') < Math.min(d.tanks, Math.ceil(this.copLimit * 0.15)) && this.makeRoom(1)) {
        const min = this.viewRadius() + 200;
        if (this.findSpawn(spawnPt, min, min + 500, true)) {
          this.spawnCop('tank', 'chaser', spawnPt.x, spawnPt.y, Math.atan2(p.y - spawnPt.y, p.x - spawnPt.x));
          this.tankT = D.tankInterval;
          this.emit('tankspawn');
        } else {
          this.tankT = 0.5;
        }
      }
    }

    if (d.barricadeEvery < Infinity && this.ghostT <= 0) {
      this.barricadeT -= dt;
      if (this.barricadeT <= 0) {
        this.barricadeT = this.placeBarricade() ? d.barricadeEvery : 1.5;
      }
    }
  }

  // Gidiş yönüne dik yol genişliği; yol ekseni gidiş yönündedir
  roadWidthAt(px, py, hx, hy) {
    const world = this.world;
    const horizontal = Math.abs(hx) > Math.abs(hy);
    const cxd = horizontal ? 0 : 1;
    const cyd = horizontal ? 1 : 0;
    const road = (x, y) => world.groundAt(x, y) === GROUND.ROAD && !world.blockedAt(x, y);
    if (!road(px, py)) return 0;
    let a = 0;
    while (a < 7 && road(px - cxd * (a + 1) * 20, py - cyd * (a + 1) * 20)) a++;
    let b = 0;
    while (b < 7 && road(px + cxd * (b + 1) * 20, py + cyd * (b + 1) * 20)) b++;
    return (a + b) * 20 + 20;
  }

  // Oyuncunun önündeki yolu tespit eder, yan yana arabalarla kapatır, boşluk bırakır
  placeBarricade() {
    const p = this.player;
    if (p.speed < 120 || !this.makeRoom(3)) return false;
    const dist = this.viewRadius() + BAR.distAhead;
    const hx = p.vx / p.speed;
    const hy = p.vy / p.speed;
    const px = p.x + hx * dist;
    const py = p.y + hy * dist;
    const world = this.world;
    if (world.groundAt(px, py) !== GROUND.ROAD) return false;

    // Yol ekseni gidiş yönündedir; enine tarayıp kenarları bul
    const horizontal = Math.abs(hx) > Math.abs(hy);
    const cxd = horizontal ? 0 : 1;
    const cyd = horizontal ? 1 : 0;
    const road = (x, y) => world.groundAt(x, y) === GROUND.ROAD && !world.blockedAt(x, y);
    const stepMax = 7;
    let a = 0;
    while (a < stepMax && road(px - cxd * (a + 1) * 20, py - cyd * (a + 1) * 20)) a++;
    let b = 0;
    while (b < stepMax && road(px + cxd * (b + 1) * 20, py + cyd * (b + 1) * 20)) b++;
    const roadW = (a + b) * 20 + 20;
    const ox = px - cxd * (a * 20 + 10);
    const oy = py - cyd * (a * 20 + 10);

    const wantSpike = this.time >= BAR.spikeFrom && Math.random() < BAR.spikeChance;
    planBarricade(roadW, BAR.minGap, 46, wantSpike, Math.random, plan);
    if (plan.count === 0) return false;

    const crossAngle = Math.atan2(cyd, cxd);
    for (let i = 0; i < plan.count; i++) {
      const s = plan.slots[i];
      const c = this.spawnCop('car', 'chaser', ox + cxd * s, oy + cyd * s, crossAngle);
      c.state = 'barricade';
      c.staticBody = true;
      c.wakeT = BAR.wakeTime;
    }
    if (plan.spikeTo > plan.spikeFrom) {
      const s = this.spikes.find((k) => !k.alive);
      if (s) {
        const mid = (plan.spikeFrom + plan.spikeTo) / 2;
        s.alive = true; s.used = false;
        s.x = ox + cxd * mid; s.y = oy + cyd * mid;
        s.a = crossAngle; s.len = plan.spikeTo - plan.spikeFrom;
      }
    }
    this.emit('barricade');
    return true;
  }

  updateSpikes() {
    const p = this.player;
    for (const s of this.spikes) {
      if (!s.alive) continue;
      const dx = p.x - s.x;
      const dy = p.y - s.y;
      if (dx * dx + dy * dy > 2800 * 2800) { s.alive = false; continue; }
      if (s.used || this.cheat) continue;
      const along = dx * Math.cos(s.a) + dy * Math.sin(s.a);
      const across = -dx * Math.sin(s.a) + dy * Math.cos(s.a);
      if (Math.abs(along) < s.len / 2 + p.wid * 0.4 && Math.abs(across) < 16 + p.len * 0.3) {
        s.used = true;
        p.flat = BAR.flatTime;
        this.hurt(BAR.spikeDamage / this.carSpec.durability);
        this.fx.sparks(s.x, s.y, 10);
        this.emit('spike');
      }
    }
  }

  tankFire(c, dist, dt) {
    c.fireT -= dt;
    if (c.fireT > 0 || dist > TK.range) return;
    const s = this.shots.find((k) => !k.alive);
    if (!s) return;
    const p = this.player;
    c.fireT = TK.fireEvery;
    s.alive = true;
    s.t = 0;
    s.x = p.x + p.vx * TK.lead;
    s.y = p.y + p.vy * TK.lead;
    // Top mermisi anıt alanına düşmez: hedef korunan bölümün dışına kayar
    if (this.world.memorialHit(s.x, s.y, TK.radius * 0.7, hit)) { s.x += hit.nx * hit.depth; s.y += hit.ny * hit.depth; }
    const mx = c.x + Math.cos(c.turret) * 62;
    const my = c.y + Math.sin(c.turret) * 62;
    this.fx.burst(FX.FIRE, mx, my, 8, 100, 0.25, 14);
    this.fx.burst(FX.DARK, mx, my, 5, 60, 0.7, 16);
    this.emit('tankfire');
  }

  updateShots(dt) {
    for (const s of this.shots) {
      if (!s.alive) continue;
      s.t += dt;
      if (s.t < TK.warnTime) continue;
      s.alive = false;
      this.fx.explosion(s.x, s.y, 90);
      this.emit('tankhit', Math.min(1, 700 / (Math.hypot(s.x - this.player.x, s.y - this.player.y) + 200)));
      this.cam.shake = Math.min(16, this.cam.shake + 8);
      const p = this.player;
      const d = Math.hypot(p.x - s.x, p.y - s.y);
      if (this.state === 'play' && d < TK.radius && !this.cheat) {
        const amount = (TK.damage * (1 - (0.5 * d) / TK.radius)) / this.carSpec.durability;
        this.hurt(amount);
        this.hitFlash = 1;
        const k = 260 / (d + 40);
        p.vx += ((p.x - s.x) / (d + 1)) * k * 40;
        p.vy += ((p.y - s.y) / (d + 1)) * k * 40;
      }
      for (let i = this.cops.length - 1; i >= 0; i--) {
        const c = this.cops[i];
        if (c.type === 'tank') continue;
        if (Math.hypot(c.x - s.x, c.y - s.y) < TK.radius) c.hp -= 60;
      }
      // Düştüğü bina yıkılır
      const tx = Math.floor(s.x / TILE);
      const ty = Math.floor(s.y / TILE);
      if (this.world.costAtTile(tx, ty) === 0 && this.world.circleHit(s.x, s.y, 8, hit) && !isWaterRect(hit.rect) && !hit.rect.sacred) {
        this.crushRect(hit.chunk, hit.rect);
      }
    }
  }

  // --- Özel güçler ---
  updatePowers(dt) {
    if (this.ghostT > 0) {
      this.ghostT -= dt;
      if (this.ghostT <= 0) { this.ghostT = 0; this.emit('powerend'); }
    }
    if (this.giantT > 0) {
      this.giantT -= dt;
      if (this.giantT <= 0) { this.giantT = 0; this.setGiant(false); this.emit('powerend'); }
    }
    this.powerT -= dt;
    if (this.powerT <= 0) {
      const min = this.viewRadius() * 0.9;
      if (this.findSpawn(spawnPt, min, min + 500, true)) {
        const w = PW.weights;
        let r = Math.random() * (w.blast + w.ghost + w.heal + w.giant);
        let i = 0;
        for (const k of POWER_KINDS) {
          r -= w[k];
          if (r < 0) break;
          i++;
        }
        this.world.addPower(spawnPt.x, spawnPt.y, PROP.POWER_BLAST + Math.min(3, i));
        this.powerT = PW.spawnEvery;
      } else {
        this.powerT = 1;
      }
    }
  }

  takePower(name, x, y) {
    this.powersTaken++;
    const p = this.player;
    this.fx.burst(FX.GLINT, x, y, 16, 220, 0.6, 7);
    this.fx.wave(x, y, 120);
    this.emit('power', name);
    if (name === 'blast') this.blast();
    else if (name === 'heal') {
      this.damage = Math.max(0, this.damage - PW.healAmount);
      this.burning = false;
      this.burnT = 0;
      this.sinceHit = 0;
      this.fx.float(p.x, p.y - 34, tx('power.healFloat'), '#2fd872');
    } else if (name === 'ghost') {
      this.ghostT = PW.duration;
      this.fx.float(p.x, p.y - 34, tx('power.ghostFloat'), '#a07bff');
    } else if (name === 'giant') {
      this.giantT = PW.duration;
      this.setGiant(true);
      this.fx.float(p.x, p.y - 34, tx('power.giantFloat'), '#ffd23f');
    }
  }

  setGiant(on) {
    const p = this.player;
    const s = this.carSpec;
    const k = on ? PW.giantScale : 1;
    p.len = s.len * k;
    p.wid = s.wid * k;
    p.mass = s.mass * (on ? PW.giantMass : 1);
  }

  // Patlama: çevredeki tüm polis ve sivil araçlar patlar; tank ağır hasar alır
  blast() {
    const p = this.player;
    const R = PW.blastRadius;
    this.fx.explosion(p.x, p.y, 150);
    this.fx.wave(p.x, p.y, R);
    this.emit('explosion', 0.9);
    for (let i = this.cops.length - 1; i >= 0; i--) {
      const c = this.cops[i];
      if (Math.hypot(c.x - p.x, c.y - p.y) > R) continue;
      if (c.type === 'tank') {
        c.hp -= PW.blastTankDamage;
        c.hurtFlash = 0.5;
        if (c.hp > 0) continue;
      }
      this.destroyCop(i, true);
    }
    this.crowd.blast(p.x, p.y, R);
  }

  // --- Skor ---
  addScore(base, x, y, comboStep = 0, color = '#ffe14d') {
    const amount = Math.round(base * this.combo);
    this.score += amount;
    if (comboStep > 0) this.bumpCombo(comboStep);
    if (x !== undefined && base >= 50) this.fx.float(x, y - 20, `+${amount}`, color);
  }

  bumpCombo(step) {
    this.combo = Math.min(SC.comboMax, this.combo + step);
    this.comboT = SC.comboTime;
  }

  updateScore(dt) {
    this.score += SC.perSecond * dt;
    const p = this.player;
    if (p.drifting) {
      this.driftTime += dt;
      this.score += SC.driftPerSecond * this.combo * dt;
      this.bumpCombo(SC.comboDriftStep * dt);
    }
    if (this.comboT > 0) {
      this.comboT -= dt;
      if (this.comboT <= 0) this.combo = 1;
    }
  }

  // --- Kamera ---
  updateCamera(dt) {
    const c = this.cam;
    const p = this.player;
    const V = CONFIG.camera;
    const top = this.carSpec.maxSpeed;
    const speedK = Math.min(1, p.speed / top);
    const z = this.drop ? V.dropZoom : (1 - V.zoomOut * speedK) * (this.giantT > 0 ? 0.82 : 1);
    c.zoom += (z - c.zoom) * (1 - Math.exp(-(this.drop ? 40 : V.zoomRate) * dt));
    const base = Math.sqrt(this.view.w * this.view.h) / V.viewArea;
    c.scale = base * c.zoom;
    c.halfW = this.view.w / 2 / c.scale;
    c.halfH = this.view.h / 2 / c.scale;
    // Bakış yönü yumuşatılır: drift sırasında kamera sallanmaz
    const ls = 1 - Math.exp(-V.lookSmooth * dt);
    c.lvx += (p.vx - c.lvx) * ls;
    c.lvy += (p.vy - c.lvy) * ls;
    const tx = p.x + c.lvx * V.lookAhead;
    // Menüde araba üst tarafta, düğmelerin arkasında kalmasın
    const ty = p.y + c.lvy * V.lookAhead + (this.state === 'attract' ? c.halfH * 0.6 : 0);
    const k = 1 - Math.exp(-(V.follow + (V.followFast - V.follow) * speedK) * dt);
    c.x += (tx - c.x) * k;
    c.y += (ty - c.y) * k;
    c.kx *= Math.exp(-9 * dt);
    c.ky *= Math.exp(-9 * dt);
    if (c.shake > 0.05) {
      c.sx = (Math.random() - 0.5) * c.shake * 2 + c.kx;
      c.sy = (Math.random() - 0.5) * c.shake * 2 + c.ky;
      c.shake *= Math.exp(-V.shakeDecay * dt);
    } else {
      c.sx = c.kx;
      c.sy = c.ky;
      c.shake = 0;
    }
  }
}


