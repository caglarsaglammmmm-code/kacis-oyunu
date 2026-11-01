// Menüler ve oyun içi gösterge. HUD yalnızca değer değişince DOM'a yazar.
import { CONFIG, MAX_STARS } from './config.js';
import { carSprite } from './render.js';
import { paintPower, POWER_LOOK } from './art.js';

const $ = (id) => document.getElementById(id);

export function formatTime(t) {
  const s = Math.floor(t);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

const SCREENS = ['menu', 'garage', 'settings', 'howto', 'over', 'pause'];

export class UI {
  constructor(storage, actions) {
    this.storage = storage;
    this.actions = actions; // play, resume, toMenu, sound, vibrate
    this.last = { time: '', score: '', coins: '', stage: -1, stars: -1, combo: '' };
    this.devTaps = 0;
    this.bind();
    this.buildStars();
    this.buildPowers();
    this.syncSettings();
    this.refreshMenu();
  }

  bind() {
    const a = this.actions;
    const click = (id, fn) => $(id).addEventListener('click', () => { a.tap(); fn(); });
    click('btn-play', () => a.play());
    click('btn-garage', () => { this.gi = undefined; this.renderGarage(); this.show('garage'); a.stage('garage'); });
    click('btn-garage2', () => { this.gi = undefined; this.renderGarage(); this.show('garage'); a.stage('garage'); });
    click('car-prev', () => this.stepCar(-1));
    click('car-next', () => this.stepCar(1));
    click('btn-settings', () => { this.show('settings'); a.stage(null); });
    click('btn-howto', () => { this.show('howto'); a.stage(null); });
    for (const b of document.querySelectorAll('[data-back]')) {
      b.addEventListener('click', () => { a.tap(); this.refreshMenu(); this.show(b.dataset.back); a.stage(b.dataset.back); a.carChanged(); });
    }
    click('btn-retry', () => a.play());
    click('btn-over-menu', () => a.toMenu());
    click('btn-pause', () => a.pause());
    click('btn-resume', () => a.resume());
    click('btn-pause-menu', () => a.toMenu());
    // Duraklat tuşu sürüş girdisi sayılmasın
    $('btn-pause').addEventListener('pointerdown', (e) => e.stopPropagation());

    const d = this.storage.data;
    $('set-sound').addEventListener('change', (e) => { d.settings.sound = e.target.checked; this.storage.save(); a.applySettings(); });
    $('set-ambient').addEventListener('change', (e) => { d.settings.ambient = e.target.checked; this.storage.save(); a.applySettings(); });
    $('set-vibrate').addEventListener('change', (e) => { d.settings.vibrate = e.target.checked; this.storage.save(); a.applySettings(); });
    $('dev-god').addEventListener('change', (e) => { d.dev.god = e.target.checked; this.storage.save(); });
    $('dev-start').addEventListener('change', (e) => { d.dev.startTime = Number(e.target.value); this.storage.save(); });
    // Gizli geliştirici bölümü: sürüm yazısına 7 kez dokun
    $('version').textContent = `Sürüm ${CONFIG.version}`;
    $('version').addEventListener('click', () => {
      if (++this.devTaps >= 7) $('dev-panel').hidden = false;
    });
  }

  syncSettings() {
    const d = this.storage.data;
    $('set-sound').checked = d.settings.sound;
    $('set-vibrate').checked = d.settings.vibrate;
    $('set-ambient').checked = d.settings.ambient;
    $('dev-god').checked = d.dev.god;
    $('dev-start').value = String(d.dev.startTime);
  }

  show(name) {
    for (const s of SCREENS) $(s).hidden = s !== name;
  }

  hideAll() {
    this.show('');
  }

  setHud(on) {
    $('hud').hidden = !on;
  }

  refreshMenu() {
    const d = this.storage.data;
    $('menu-coins').textContent = d.coins;
    $('menu-best').textContent = d.bestScore ? `En iyi: ${d.bestScore.toLocaleString('tr-TR')} puan · ${formatTime(d.bestTime)}` : 'İlk kaçışın seni bekliyor';
    const car = this.storage.selectedCar();
    $('menu-car-name').textContent = car.name;
    $('menu-car-paint').textContent = (car.paints[this.storage.paintIndex(car.id)] || car.paints[0]).name;
  }

  splash(done) {
    const el = $('splash');
    el.hidden = false;
    el.classList.add('play');
    setTimeout(() => {
      el.hidden = true;
      done();
    }, 3000);
  }

  buildStars() {
    const box = $('hud-stars');
    box.textContent = '';
    for (let i = 0; i < MAX_STARS; i++) {
      const s = document.createElement('span');
      s.textContent = '★';
      box.appendChild(s);
    }
  }

  setApkButton(show, url) {
    const a = $('btn-apk');
    a.href = url;
    a.hidden = !show;
  }

  // Güç simgesi küçük tuval olarak: HUD ve Nasıl Oynanır aynı çizimi kullanır
  powerCanvas(kind, size) {
    const c = document.createElement('canvas');
    c.width = size * 2;
    c.height = size * 2;
    c.className = 'pw-icon';
    const g = c.getContext('2d');
    g.setTransform((size * 2) / 36, 0, 0, (size * 2) / 36, size, size);
    paintPower(g, kind);
    return c;
  }

  buildPowers() {
    this.pw = {};
    const box = $('hud-powers');
    for (const kind of ['ghost', 'giant']) {
      const el = document.createElement('div');
      el.className = 'pw';
      el.hidden = true;
      el.style.setProperty('--c', POWER_LOOK[kind].color);
      const t = document.createElement('b');
      const bar = document.createElement('i');
      const fill = document.createElement('u');
      bar.appendChild(fill);
      el.append(this.powerCanvas(kind, 15), t, bar);
      box.appendChild(el);
      this.pw[kind] = { el, t, fill, last: '' };
    }
    const list = $('howto-powers');
    const info = { blast: 'Yakındaki bütün arabalar patlar', ghost: `${CONFIG.powers.duration} sn polis seni göremez`, heal: 'Hasarı onarır, ateşi söndürür', giant: `${CONFIG.powers.duration} sn devleşirsin, hasar almazsın` };
    for (const kind of Object.keys(info)) {
      const row = document.createElement('div');
      const name = document.createElement('b');
      name.textContent = POWER_LOOK[kind].name;
      const d = document.createElement('span');
      d.textContent = info[kind];
      const text = document.createElement('p');
      text.append(name, d);
      row.append(this.powerCanvas(kind, 20), text);
      list.appendChild(row);
    }
  }

  toast(text, color) {
    const el = $('toast');
    el.textContent = text;
    el.style.color = color;
    el.classList.remove('run');
    void el.offsetWidth;
    el.classList.add('run');
  }

  powerToast(kind) {
    this.toast(POWER_LOOK[kind].name, POWER_LOOK[kind].color);
  }

  alert(stage) {
    const text = CONFIG.difficulty.alerts[[0, CONFIG.difficulty.swatAt, CONFIG.difficulty.advancedAt, CONFIG.difficulty.tanksAt][stage]];
    const el = $('alert');
    el.textContent = text;
    el.classList.remove('run');
    void el.offsetWidth; // Animasyonu baştan başlat
    el.classList.add('run');
  }

  showHint(on) {
    $('hint').hidden = !on;
  }

  resetHud() {
    this.last = { time: '', score: '', coins: '', stage: -1, stars: -1, combo: '' };
    $('alert').classList.remove('run');
  }

  hud(g) {
    const l = this.last;
    const time = formatTime(g.time);
    if (time !== l.time) { l.time = time; $('hud-time').textContent = time; }
    const score = Math.floor(g.score).toLocaleString('tr-TR');
    if (score !== l.score) { l.score = score; $('hud-score').textContent = score; }
    if (g.coins !== l.coins) { l.coins = g.coins; $('hud-coins').textContent = g.coins; }
    const health = Math.max(0, Math.round(100 - g.damage));
    if (health !== l.health) {
      l.health = health;
      const bar = $('hud-health').firstElementChild;
      bar.style.width = `${health}%`;
      bar.style.background = health > 45 ? 'linear-gradient(90deg,#16c172,#7dffb0)' : health > 20 ? 'linear-gradient(90deg,#ff9d00,#ffd23f)' : 'linear-gradient(90deg,#ff2a3c,#ff7a5a)';
      $('hud-hp').textContent = health;
    }
    const stage = g.stage;
    if (stage !== l.stage) {
      l.stage = stage;
      $('hud-car').dataset.stage = stage;
    }
    const stars = g.diff.stars;
    if (stars !== l.stars) {
      l.stars = stars;
      const list = $('hud-stars').children;
      for (let i = 0; i < list.length; i++) list[i].classList.toggle('on', i < stars);
    }
    this.powerChip('ghost', g.ghostT);
    this.powerChip('giant', g.giantT);
    const combo = g.combo >= 1.25 ? `x${g.combo.toFixed(1).replace('.', ',')}` : '';
    if (combo !== l.combo) { l.combo = combo; $('hud-combo').textContent = combo; }
  }

  powerChip(kind, left) {
    const p = this.pw[kind];
    const text = left > 0 ? String(Math.ceil(left)) : '';
    if (text === p.last) return;
    p.last = text;
    p.el.hidden = left <= 0;
    p.t.textContent = text;
    p.fill.style.width = `${Math.round((left / CONFIG.powers.duration) * 100)}%`;
  }

  over(result, record) {
    const d = this.storage.data;
    $('over-title').textContent = record.newScore ? 'YENİ REKOR!' : 'YAKALANDIN!';
    $('over-title').classList.toggle('record', record.newScore);
    $('over-score').textContent = result.score.toLocaleString('tr-TR');
    $('over-time').textContent = formatTime(result.time);
    $('over-coins').textContent = `+${result.coins}`;
    $('over-kills').textContent = result.kills;
    $('over-broken').textContent = result.broken;
    $('over-near').textContent = result.nearMisses;
    $('over-drift').textContent = `${result.driftTime.toFixed(1).replace('.', ',')} sn`;
    $('over-best').textContent = `En iyi skor: ${d.bestScore.toLocaleString('tr-TR')} · En uzun süre: ${formatTime(d.bestTime)}`;
    this.show('over');
    // Hâlâ basılı parmak yanlışlıkla düğmeye basmasın
    const btns = $('over-actions');
    btns.classList.add('wait');
    setTimeout(() => btns.classList.remove('wait'), 700);
  }

  renderGarage() {
    const d = this.storage.data;
    const cars = CONFIG.cars;
    $('garage-coins').textContent = d.coins;
    if (this.gi === undefined) this.gi = Math.max(0, cars.findIndex((c) => c.id === d.selected));
    const car = cars[this.gi];
    const owned = d.owned.includes(car.id);
    const selected = d.selected === car.id;
    const paintI = owned ? this.storage.paintIndex(car.id) : (this.gp || 0);
    this.actions.previewCar(car, paintI);
    const swatch = $('garage-paints');
    swatch.textContent = '';
    car.paints.forEach((p, i) => {
      const b = document.createElement('button');
      b.className = `swatch ${p.finish}${i === paintI ? ' on' : ''}`;
      b.style.setProperty('--c', p.color);
      b.style.setProperty('--r', p.roof || p.color);
      b.title = p.name;
      b.setAttribute('aria-label', p.name);
      b.addEventListener('click', () => {
        this.actions.tap();
        this.gp = i;
        if (owned) { this.storage.setPaint(car.id, i); this.actions.carChanged(); }
        this.renderGarage();
      });
      swatch.appendChild(b);
    });
    $('garage-paint-name').textContent = `${car.paints[paintI].name} · ${{ gloss: 'Parlak', metal: 'Metalik', matte: 'Mat', pearl: 'İnci' }[car.paints[paintI].finish]}${car.paints[paintI].roof ? ' · Çift ton' : ''}`;
    $('garage-name').textContent = car.name;
    $('garage-desc').textContent = car.desc;

    const stats = $('garage-stats');
    stats.textContent = '';
    const top = cars[cars.length - 1];
    const base = cars[0];
    const stat = (label, value, text) => {
      const row = document.createElement('div');
      row.className = 'stat';
      const t = document.createElement('span');
      t.textContent = label;
      const bar = document.createElement('i');
      const fill = document.createElement('b');
      fill.style.width = `${Math.round(25 + value * 75)}%`;
      bar.appendChild(fill);
      const n = document.createElement('em');
      n.textContent = text;
      row.append(t, bar, n);
      stats.appendChild(row);
    };
    const norm = (v, a, b) => (v - a) / (b - a);
    stat('Hız', norm(car.maxSpeed, base.maxSpeed, top.maxSpeed), String(Math.round(car.maxSpeed / 3)));
    stat('Kayma', norm(base.driftGrip / car.driftGrip, 1, base.driftGrip / top.driftGrip), String(Math.round((base.driftGrip / car.driftGrip) * 100)));
    stat('Dayanıklılık', norm(car.durability, base.durability, top.durability), String(Math.round(car.durability * 100)));

    const act = $('garage-action');
    act.classList.toggle('buy', !owned);
    if (selected) { act.textContent = 'Seçili'; act.disabled = true; }
    else if (owned) { act.textContent = 'Seç'; act.disabled = false; }
    else {
      act.textContent = d.coins >= car.cost ? `Satın al · ${car.cost}` : `${car.cost} coin`;
      act.disabled = d.coins < car.cost;
    }
    act.onclick = () => {
      this.actions.tap();
      if (owned) this.storage.select(car.id);
      else if (this.storage.buy(car.id)) this.actions.purchased();
      this.actions.carChanged();
      this.renderGarage();
    };

    const list = $('garage-list');
    list.textContent = '';
    cars.forEach((c, i) => {
      const b = document.createElement('button');
      const has = d.owned.includes(c.id);
      b.className = `thumb${i === this.gi ? ' on' : ''}${has ? '' : ' locked'}${d.selected === c.id ? ' selected' : ''}`;
      const art = carSprite(c, this.storage.paintIndex(c.id));
      art.className = 'car-art';
      const label = document.createElement('span');
      label.textContent = has ? c.name : `${c.cost}`;
      b.append(art, label);
      b.addEventListener('click', () => { this.actions.tap(); this.gi = i; this.gp = 0; this.renderGarage(); });
      list.appendChild(b);
    });
    const on = list.children[this.gi];
    if (on && on.scrollIntoView) on.scrollIntoView({ inline: 'center', block: 'nearest' });
  }

  stepCar(dir) {
    const n = CONFIG.cars.length;
    this.gi = (this.gi + dir + n) % n;
    this.gp = 0;
    this.renderGarage();
  }

  // Atlas geç yüklenirse garaj küçük resimleri yenilenir
  atlasLoaded() {
    if (!$('garage').hidden) this.renderGarage();
  }
}
