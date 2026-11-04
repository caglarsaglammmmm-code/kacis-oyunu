// Menüler ve oyun içi gösterge. HUD yalnızca değer değişince DOM'a yazar.
import { paintPixelCar, animatePixelCar, rimIcon } from './pixelcars.js';
import { CUSTOM, paintOf, itemOf } from './custom.js';
import { CONFIG, MAX_STARS } from './config.js';
import { paintPower, POWER_LOOK } from './art.js';
import { tx, txNum, getLang, LANGS, DEVELOPER } from './i18n/index.js';

const $ = (id) => document.getElementById(id);
// Araç adı: gizli motosikletin adı dil dosyasında, diğerleri isim tablosunda
const carLabel = (car) => (car.secret ? tx('cars.golge.name') : car.name);

export function formatTime(t) {
  const s = Math.floor(t);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

// Uzun yazı kutusuna sığmazsa yazı küçülür (özellikle Almanca); tek satırlık metinler
const FIT = '.start-txt, .tile span, .menu .btn, .panel .btn, .seg button, .screen header h2, #over-title, .car-tag b, .car-tag small, #ctl-rev, .summary span, .big-score span, #hint b, #hint span, .toggle > span, .volume > span, .seg-row > span, #cheat-badge, #garage-action';
function fitOne(el) {
  el.style.fontSize = '';
  if (!el.offsetParent || !el.clientWidth) return;
  const base = parseFloat(getComputedStyle(el).fontSize);
  const min = Math.max(9, Math.round(base * 0.55));
  let s = base;
  while (s > min && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 2)) {
    s -= 1;
    el.style.fontSize = `${s}px`;
  }
}

const SPLASH_MS = 800;
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
    this.applyLang();
    // Piksel yazı tipi geç yüklenir: yüklenince yazılar yeniden sığdırılır
    if (document.fonts) {
      document.fonts.addEventListener('loadingdone', () => this.fit());
      document.fonts.ready.then(() => this.fit());
    }
  }

  bind() {
    const a = this.actions;
    const click = (id, fn) => $(id).addEventListener('click', () => { a.tap(); fn(); });
    click('btn-play', () => a.start());
    // Bütün menü düğmeleri aynı dokunuşu verir: yumuşak ses, kısa titreşim. Oyun içi düğmeler hariç
    document.addEventListener('pointerdown', (e) => {
      const b = e.target.closest && e.target.closest('.screen button, .screen a.btn, .screen .toggle');
      if (!b || b.disabled) return;
      a.press();
      // :active dokunmatikte her zaman oluşmaz. Çok kısa dokunuşta da çöküş görünsün
      b.classList.add('down');
      const at = performance.now();
      const up = () => {
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', up);
        setTimeout(() => b.classList.remove('down'), Math.max(0, 90 - (performance.now() - at)));
      };
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', up);
    }, true);
    click('btn-mute', () => { const d2 = this.storage.data; d2.settings.sound = !d2.settings.sound; this.storage.save(); this.syncSettings(); a.applySettings(); });
    click('btn-garage', () => { this.gi = undefined; this.renderGarage(); this.show('garage'); });
    click('btn-garage2', () => { this.gi = undefined; this.renderGarage(); this.show('garage'); });
    click('car-prev', () => { this.stepCar(-1); a.preview(this.storage.garageCars()[this.gi]); });
    click('car-next', () => { this.stepCar(1); a.preview(this.storage.garageCars()[this.gi]); });
    click('btn-settings', () => { this.show('settings'); });
    click('btn-howto', () => { this.show('howto'); });
    for (const b of document.querySelectorAll('[data-back]')) {
      b.addEventListener('click', () => { a.tap(); this.refreshMenu(); this.show(b.dataset.back); a.carChanged(); a.menuShown(); });
    }
    click('btn-retry', () => a.play());
    click('btn-over-menu', () => a.toMenu());
    click('btn-pause', () => a.pause());
    click('btn-resume', () => a.resume());
    click('btn-pause-menu', () => a.toMenu());
    // Duraklat tuşu sürüş girdisi sayılmasın. Başka parmak basılıyken tarayıcı click üretmez: bırakma yeterli
    $('btn-pause').addEventListener('pointerdown', (e) => e.stopPropagation());
    $('btn-pause').addEventListener('pointerup', (e) => { e.stopPropagation(); a.tap(); a.pause(); });

    const d = this.storage.data;
    for (const seg of document.querySelectorAll('.seg')) {
      seg.addEventListener('click', (e) => {
        const b = e.target.closest('button');
        if (!b) return;
        a.tap();
        d.settings[seg.dataset.set] = b.dataset.v;
        this.storage.save();
        this.syncSettings();
        a.applySettings();
      });
    }
    $('set-sound').addEventListener('change', (e) => { d.settings.sound = e.target.checked; this.storage.save(); a.applySettings(); });
    $('set-volume').addEventListener('input', (e) => { d.settings.volume = Number(e.target.value); this.storage.save(); a.applySettings(); });
    $('set-ambient').addEventListener('change', (e) => { d.settings.ambient = e.target.checked; this.storage.save(); a.applySettings(); });
    $('set-vibrate').addEventListener('change', (e) => { d.settings.vibrate = e.target.checked; this.storage.save(); a.applySettings(); });
    $('dev-god').addEventListener('change', (e) => { d.dev.god = e.target.checked; this.storage.save(); });
    $('dev-start').addEventListener('change', (e) => { d.dev.startTime = Number(e.target.value); this.storage.save(); });
    // Kod gir: metin büyük harfe çevrilir, tire ve boşluk atılır (storage.redeem)
    const applyCode = () => {
      const box = $('code-input');
      const msg = $('code-msg');
      const raw = box.value.trim();
      const r = raw ? this.storage.redeem(raw) : 'empty';
      const unlocked = CONFIG.codes.find((k) => k.code === raw.toUpperCase().replace(/[^0-9A-Z]/g, ''));
      const car = unlocked && CONFIG.cars.find((c) => c.id === unlocked.car);
      msg.textContent = tx(`code.${r}`, { car: car ? car.name : '' });
      msg.className = `code-msg ${r === 'ok' ? 'ok' : 'err'}`;
      if (r === 'ok') { box.value = ''; this.refreshMenu(); a.purchased(); }
      this.fit($('settings'));
    };
    $('code-apply').addEventListener('click', () => { a.tap(); applyCode(); });
    $('code-input').addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); applyCode(); } });
    // Gizli geliştirici bölümü: sürüm yazısına 7 kez dokun
    $('version').addEventListener('click', () => {
      if (++this.devTaps >= 7) $('dev-panel').hidden = false;
    });
  }

  syncSettings() {
    const d = this.storage.data;
    $('set-sound').checked = d.settings.sound;
    $('set-volume').value = String(d.settings.volume);
    this.syncMute();
    $('set-vibrate').checked = d.settings.vibrate;
    $('set-ambient').checked = d.settings.ambient;
    for (const seg of document.querySelectorAll('.seg')) {
      for (const b of seg.children) {
        const on = d.settings[seg.dataset.set] === b.dataset.v;
        b.classList.toggle('on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      }
    }
    $('dev-god').checked = d.dev.god;
    $('dev-start').value = String(d.dev.startTime);
  }

  syncMute() {
    $('btn-mute').classList.toggle('muted', !this.storage.data.settings.sound);
  }

  intro() {
    $('maker').textContent = tx('menu.maker');
  }

  show(name) {
    for (const s of SCREENS) $(s).hidden = s !== name;
    if (name) this.fit($(name));
  }

  // Görünen ekrandaki yazılar kutularına sığdırılır
  fit(root = document) {
    for (const el of root.querySelectorAll(FIT)) fitOne(el);
  }

  // Dil değişince oyun yeniden başlamadan bütün yazılar yenilenir
  applyLang() {
    const code = getLang();
    // Sayı biçimleri menüdeyken kurulur: oyunun ilk karesinde kurulum takılma yapmasın
    txNum(0); txNum(0, 1);
    document.documentElement.lang = code === 'zh' ? 'zh-CN' : code;
    for (const el of document.querySelectorAll('[data-i18n]')) el.textContent = tx(el.dataset.i18n);
    for (const el of document.querySelectorAll('[data-i18n-label]')) el.setAttribute('aria-label', tx(`aria.${el.dataset.i18nLabel}`));
    // BAŞLA: harfler sırayla beyaz ve turuncu
    const st = $('start-txt');
    st.textContent = '';
    for (const ch of tx('start')) { const i = document.createElement('i'); i.textContent = ch; st.appendChild(i); }
    $('version').textContent = tx('settings.version', { v: CONFIG.version });
    const tips = $('howto-tips');
    tips.textContent = '';
    for (const line of tx('howto.tips')) { const li = document.createElement('li'); li.textContent = line; tips.appendChild(li); }
    for (const b of document.querySelectorAll('.seg[data-set=lang] button')) b.textContent = LANGS[b.dataset.v];
    $('cheat-badge').textContent = tx('cheat.badge');
    $('ctl-rev').textContent = tx('hint.rev');
    this.buildHowtoPowers();
    this.refreshMenu();
    this.intro();
    if (!$('garage').hidden) this.renderGarage();
    if (!$('hint').hidden) this.showHint(true);
    if (!$('over').hidden && this.lastResult) this.over(...this.lastResult);
    this.last.score = '';
    this.last.combo = '';
    this.fit();
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
    $('menu-best').textContent = d.bestScore ? tx('menu.best', { score: txNum(d.bestScore), time: formatTime(d.bestTime) }) : tx('menu.first');
    const car = this.storage.selectedCar();
    $('menu-car-name').textContent = carLabel(car);
    $('menu-car-paint').textContent = this.paintName(car, this.storage.paintIndex(car.id));
    if (!$('menu').hidden) this.fit($('menu'));
  }

  paintName(car, i) {
    if (typeof i === 'string') return tx(`custom.paints.${i}`);
    const names = tx(`cars.${car.id}.paints`);
    return (Array.isArray(names) && names[i]) || (car.paints[i] || car.paints[0]).name;
  }

  // Açılış: koyu zeminde geliştirici yazısı, yumuşak belirip kaybolur (0,8 sn). Oyun arkada yüklenir
  splash(done) {
    const el = $('splash');
    $('splash-text').textContent = tx('splash', { name: DEVELOPER });
    el.hidden = false;
    el.classList.add('play');
    setTimeout(() => {
      el.hidden = true;
      done();
    }, SPLASH_MS);
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
  }

  buildHowtoPowers() {
    const list = $('howto-powers');
    list.textContent = '';
    const n = CONFIG.powers.duration;
    for (const kind of ['blast', 'ghost', 'heal', 'giant']) {
      const row = document.createElement('div');
      const name = document.createElement('b');
      name.textContent = tx(`power.${kind}`);
      const d = document.createElement('span');
      d.textContent = tx(`power.${kind}Info`, { n });
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
    this.toast(tx(`power.${kind}`), POWER_LOOK[kind].color);
  }

  alert(stage) {
    const text = tx(`alert.${['', 'swat', 'heavy', 'tanks'][stage] || 'tanks'}`);
    const el = $('alert');
    el.textContent = text;
    el.classList.remove('run', 'long');
    void el.offsetWidth; // Animasyonu baştan başlat
    el.classList.add('run');
  }

  // Kıl payı bildirimi: üst üste binmez, art arda gelenler tek bildirimde toplanır
  escapeToast({ amount, bonus }) {
    const el = $('escape-msg');
    const now = performance.now();
    const merge = now - (this.escAt || -1e9) < 1100;
    this.escTotal = (merge ? this.escTotal : 0) + amount + bonus;
    this.escBonus = (merge ? this.escBonus : 0) + bonus;
    this.escAt = now;
    el.firstElementChild.textContent = tx('escape.toast', { n: this.escTotal });
    el.lastElementChild.textContent = this.escBonus ? tx('escape.combo', { n: this.escBonus }) : '';
    el.classList.remove('run');
    void el.offsetWidth;
    el.classList.add('run');
  }

  cheatMessage(on) {
    const el = $('cheat-msg');
    el.firstElementChild.textContent = tx(on ? 'cheat.on' : 'cheat.off');
    el.classList.remove('run');
    void el.offsetWidth;
    el.classList.add('run');
  }

  // Anıta saygısızlık: büyük kırmızı yazı, ardından normal oyun bitti ekranı
  memorialFail(n) {
    const el = $('memorial-msg');
    el.firstElementChild.textContent = tx('memorial.penalty', { n });
    el.lastElementChild.textContent = tx('memorial.disrespect');
    el.classList.remove('run');
    void el.offsetWidth;
    el.classList.add('run');
  }

  // Uzaylı geçişi: büyük okunaklı yazı tam CONFIG.aliens.intro saniye görünür, sonra kaybolur
  alienAlert() {
    const el = $('alert');
    el.textContent = tx('alert.aliens');
    el.style.setProperty('--alert-t', `${CONFIG.aliens.intro}s`);
    el.classList.remove('run');
    el.classList.add('long');
    void el.offsetWidth;
    el.classList.add('run');
  }

  // Meteor aşaması: büyük yazı ve kısa uyarı (kırmızı halkadan çık)
  meteorAlert() {
    const el = $('alert');
    el.textContent = tx('alert.meteors');
    el.style.setProperty('--alert-t', `${CONFIG.aliens.intro}s`);
    el.classList.remove('run');
    el.classList.add('long');
    void el.offsetWidth;
    el.classList.add('run');
    setTimeout(() => this.toast(tx('meteor.warn'), '#ffd23f'), 1200);
  }

  showHint(on) {
    if (on) {
      const m = this.storage.data.settings.control;
      const T = tx(`hint.${['zones', 'wheel', 'stick'].includes(m) ? m : 'zones'}`);
      ['hint-l', 'hint-ls', 'hint-m', 'hint-ms', 'hint-r', 'hint-rs'].forEach((id, i) => { $(id).textContent = T[i]; });
    }
    $('hint').hidden = !on;
    $('hint').classList.toggle('up', this.storage.data.settings.control !== 'zones');
  }

  resetHud() {
    this.last = { time: '', score: '', coins: '', stage: -1, stars: -1, combo: '' };
    $('alert').classList.remove('run');
  }

  hud(g) {
    const l = this.last;
    const time = formatTime(g.time);
    if (time !== l.time) { l.time = time; $('hud-time').textContent = time; }
    const score = Math.floor(g.score);
    if (score !== l.score) { l.score = score; $('hud-score').textContent = txNum(score); }
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
    const combo = g.combo >= 1.25 ? `x${txNum(g.combo, 1)}` : '';
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
    const memorial = result.cause === 'memorial';
    $('memorial-msg').classList.remove('run'); // Oyun bitti ekranı açılınca ceza yazısı kalkar
    $('over-title').textContent = tx(memorial ? 'memorial.over' : record.newScore ? 'over.record' : result.cause === 'water' ? 'over.sunk' : result.cause === 'meteor' ? 'over.meteor' : 'over.caught');
    $('over-title').classList.toggle('record', record.newScore && !memorial);
    $('over-title').classList.toggle('memorial', memorial);
    $('over-score').textContent = txNum(result.score);
    $('over-time').textContent = formatTime(result.time);
    // Anıt cezası: düşülen para eksiyle gösterilir (hiç para yoksa 0)
    $('over-coins').textContent = memorial ? `-${record.penalty || 0}` : `+${result.coins}`;
    $('over-coins').classList.toggle('minus', memorial);
    $('over-kills').textContent = result.kills;
    $('over-broken').textContent = result.broken;
    $('over-near').textContent = result.nearMisses;
    $('over-drift').textContent = tx('over.seconds', { n: txNum(result.driftTime, 1) });
    $('over-best').textContent = tx('over.best', { score: txNum(d.bestScore), time: formatTime(d.bestTime) });
    this.lastResult = [result, record];
    this.show('over');
    // Hâlâ basılı parmak yanlışlıkla düğmeye basmasın
    const btns = $('over-actions');
    btns.classList.add('wait');
    setTimeout(() => btns.classList.remove('wait'), 700);
  }

  renderGarage() {
    const d = this.storage.data;
    const cars = this.storage.garageCars();
    $('garage-coins').textContent = d.coins;
    if (this.gi === undefined) this.gi = Math.max(0, cars.findIndex((c) => c.id === d.selected));
    const car = cars[this.gi];
    const owned = d.owned.includes(car.id);
    const selected = d.selected === car.id;
    const paintI = owned ? this.storage.paintIndex(car.id) : (this.gp || 0);
    this.drawPreview(car, paintI);
    const swatch = $('garage-paints');
    swatch.textContent = '';
    car.paints.forEach((p, i) => {
      const b = document.createElement('button');
      b.className = `swatch ${p.finish}${i === paintI && !(this.prev && this.prev.kind === 'paint') ? ' on' : ''}`;
      b.style.setProperty('--c', p.color);
      b.style.setProperty('--r', p.roof || p.color);
      b.title = this.paintName(car, i);
      b.setAttribute('aria-label', b.title);
      b.addEventListener('click', () => {
        this.actions.tap();
        this.gp = i;
        this.prev = null;
        if (owned) { this.storage.setPaint(car.id, i); this.actions.carChanged(); }
        this.renderGarage();
      });
      swatch.appendChild(b);
    });
    const pt = paintOf(car, paintI);
    $('garage-paint-name').textContent = `${this.paintName(car, paintI)} · ${tx(`garage.finish.${pt.finish}`)}${pt.roof ? ` · ${tx('garage.twoTone')}` : ''}`;
    $('garage-name').textContent = carLabel(car);
    $('garage-desc').textContent = tx(`cars.${car.id}.desc`);

    const stats = $('garage-stats');
    stats.textContent = '';
    const top = CONFIG.cars[CONFIG.cars.length - 1]; // Ölçek satılık arabalara göre
    const base = CONFIG.cars[0];
    const stat = (label, value, text) => {
      const row = document.createElement('div');
      row.className = 'stat';
      const t = document.createElement('span');
      t.textContent = label;
      const bar = document.createElement('i');
      const fill = document.createElement('b');
      fill.style.setProperty('--w', `${Math.round(25 + value * 75)}%`);
      bar.appendChild(fill);
      const n = document.createElement('em');
      n.textContent = text;
      row.append(t, bar, n);
      stats.appendChild(row);
    };
    const norm = (v, a, b) => Math.min(1.08, (v - a) / (b - a));
    const range = (key) => { const v = CONFIG.cars.map((c) => c[key]); return [Math.min(...v), Math.max(...v)]; };
    stat(tx('garage.speed'), norm(car.maxSpeed, base.maxSpeed, top.maxSpeed), String(Math.round(car.maxSpeed / 3)));
    stat(tx('garage.accel'), norm(car.accel, ...range('accel')), String(Math.round(car.accel / 7)));
    stat(tx('garage.grip'), norm(car.grip, ...range('grip')), String(Math.round(car.grip * 20)));
    stat(tx('garage.durability'), norm(car.durability, base.durability, top.durability), String(Math.round(car.durability * 100)));

    const act = $('garage-action');
    act.classList.toggle('buy', !owned);
    if (selected) { act.textContent = tx('garage.selected'); act.disabled = true; }
    else if (owned) { act.textContent = tx('garage.select'); act.disabled = false; }
    else {
      act.textContent = tx(d.coins >= car.cost ? 'garage.buy' : 'garage.need', { cost: txNum(car.cost) });
      act.disabled = d.coins < car.cost;
    }
    act.onclick = () => {
      this.actions.tap();
      if (owned) { this.storage.select(car.id); this.actions.preview(car); }
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
      const art = document.createElement('canvas');
      paintPixelCar(art, c, this.storage.paintIndex(c.id));
      art.className = 'car-art';
      const label = document.createElement('span');
      label.textContent = has ? carLabel(c) : `${c.cost}`;
      b.append(art, label);
      b.addEventListener('click', () => { this.actions.tap(); this.gi = i; this.gp = 0; this.renderGarage(); this.actions.preview(c); });
      list.appendChild(b);
    });
    const on = list.children[this.gi];
    if (on) list.scrollLeft = on.offsetLeft - list.clientWidth / 2 + on.offsetWidth / 2;
    this.renderCustom(car, owned);
    if (!$('garage').hidden) this.fit($('garage'));
  }

  // Garaj önizlemesi: kayıtlı görünüş, varsa denenen öğe üstüne. Jantlar döner
  previewLook(car, paintI) {
    const look = this.storage.look(car.id);
    look.paint = paintI;
    const p = this.prev;
    if (p) look[p.kind] = p.id;
    return look;
  }

  drawPreview(car, paintI) {
    this.pvCar = car;
    this.pvPaint = paintI;
    const look = this.previewLook(car, paintI);
    animatePixelCar($('px-car'), car, look.paint, look, this.pvAng || 0, (performance.now() / 1000) % 1000);
    if (this.pvLoop) return;
    // Yalnız garaj açıkken, saniyede 15 kare
    let last = 0;
    const loop = (now) => {
      if ($('garage').hidden) { this.pvLoop = 0; return; }
      this.pvLoop = requestAnimationFrame(loop);
      if (now - last < 66) return;
      last = now;
      this.pvAng = ((this.pvAng || 0) + 0.45) % (Math.PI * 2);
      const lk = this.previewLook(this.pvCar, this.pvPaint);
      animatePixelCar($('px-car'), this.pvCar, lk.paint, lk, this.pvAng, now / 1000);
    };
    this.pvLoop = requestAnimationFrame(loop);
  }

  // Özelleştirme: Boya, Jant, Alt LED. Kilitli öğe önce denenir, sonra onayla satın alınır
  renderCustom(car, owned) {
    const box = $('garage-custom');
    const grid = $('custom-grid');
    const buy = $('custom-buy');
    const tab = this.tab || 'paint';
    for (const b of box.querySelectorAll('.custom-tabs button')) {
      b.classList.toggle('on', b.dataset.tab === tab);
      b.onclick = () => { this.actions.tap(); this.tab = b.dataset.tab; this.prev = null; this.confirm = false; this.renderGarage(); };
    }
    grid.textContent = '';
    if (!owned) {
      box.classList.add('off');
      buy.hidden = true;
      $('custom-name').textContent = '';
      $('custom-msg').textContent = tx('custom.ownFirst');
      return;
    }
    box.classList.remove('off');
    const d = this.storage.data;
    const look = this.storage.look(car.id);
    const items = tab === 'paint' ? CUSTOM.paints : tab === 'rim' ? CUSTOM.rims : CUSTOM.leds;
    const current = look[tab];
    const p = this.prev && this.prev.kind === tab ? this.prev.id : null;
    for (const it of items) {
      const b = document.createElement('button');
      const has = this.storage.owns(tab, it.id);
      b.className = `chip ${tab}${it.id === (p || current) ? ' on' : ''}${has ? '' : ' locked'}`;
      b.setAttribute('aria-label', tx(`custom.${tab}s.${it.id}`));
      if (tab === 'paint') { b.classList.add(it.finish); b.style.setProperty('--c', it.color); }
      else if (tab === 'rim') b.appendChild(rimIcon(it.id));
      else { b.style.setProperty('--c', it.color || 'transparent'); if (it.fx !== 'static') b.classList.add(it.fx); if (!it.color) b.classList.add('none'); }
      if (!has) { const tag = document.createElement('em'); tag.textContent = txNum(it.price); b.appendChild(tag); }
      b.addEventListener('click', () => {
        this.actions.tap();
        this.confirm = false;
        if (has) { this.prev = null; this.storage.setLook(car.id, tab, it.id); this.actions.carChanged(); $('custom-msg').textContent = ''; }
        else this.prev = { kind: tab, id: it.id };
        this.renderGarage();
      });
      grid.appendChild(b);
    }
    // Seçilen ya da denenen öğenin adı ve satın alma düğmesi
    const sel = p || current;
    $('custom-name').textContent = tab === 'paint' && typeof sel === 'number' ? this.paintName(car, sel) : tx(`custom.${tab}s.${sel}`);
    if (p) {
      const it = itemOf(tab, p);
      const enough = d.coins >= it.price;
      buy.hidden = false;
      buy.disabled = !enough;
      buy.classList.toggle('confirm', !!this.confirm);
      buy.textContent = !enough ? tx('custom.poor') : tx(this.confirm ? 'custom.confirm' : 'custom.buy', { cost: txNum(it.price) });
      buy.onclick = () => {
        this.actions.tap();
        if (!this.confirm) { this.confirm = true; this.renderGarage(); return; }
        const r = this.storage.buyItem(tab, p);
        this.confirm = false;
        if (r === 'ok') {
          this.storage.setLook(car.id, tab, p);
          this.prev = null;
          this.actions.purchased();
          this.actions.carChanged();
          this.renderGarage();
          $('custom-msg').textContent = tx('custom.bought');
        } else {
          $('custom-msg').textContent = tx(r === 'poor' ? 'custom.poor' : 'custom.use');
          this.renderGarage();
        }
      };
    } else {
      buy.hidden = true;
    }
  }

  stepCar(dir) {
    const n = this.storage.garageCars().length;
    this.gi = (this.gi + dir + n) % n;
    this.gp = 0;
    this.prev = null;
    this.confirm = false;
    $('custom-msg').textContent = '';
    this.renderGarage();
  }

  // Atlas geç yüklenirse garaj küçük resimleri yenilenir
  atlasLoaded() {
    if (!$('garage').hidden) this.renderGarage();
  }
}
