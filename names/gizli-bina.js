// ARKADAŞ SÜRÜMÜ: gizli geçidin görünüşü bir bina. Tepesinde altın tabela, girişi rampadır.
// Bu dosya yalnız arkadaş derlemesine js/secret-look.js adıyla kopyalanır (tools/flavor.mjs, tools/serve.mjs).
// Play sürümündeki js/secret-look.js boştur: bina, tabela ve tabela yazısı Play paketine girmez.
// Yer, mantık ve ödül değişmez: rampa (CONFIG.secret.ramp, karo 27-30) binanın girişidir; içine girince
// eski yeraltı sahnesi, karşılama yazısı ve hediye motosiklet (game.js checkSecret, main.js).
// Bağımlılığı yoktur (js/app.file.js birleştirmesine girmez, tek başına çalışır).

const TABELA = 'YILDIZ';
const FACADE = 46; // Güney cephe bandı (px): sütunlar ve kapı
const DOOR = { cx: 60, w: 44, h: 34 }; // Kapı ortası binanın batı kenarından 60 px: rampanın tam ortası (karo 28.5)

function starPath(g, cx, cy, R, r, rot = -Math.PI / 2) {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = rot + (i * Math.PI) / 5;
    const k = i % 2 ? r : R;
    if (i) g.lineTo(cx + Math.cos(a) * k, cy + Math.sin(a) * k);
    else g.moveTo(cx + Math.cos(a) * k, cy + Math.sin(a) * k);
  }
  g.closePath();
}

function goldFill(g, x0, y0, x1, y1) {
  const gr = g.createLinearGradient(x0, y0, x1, y1);
  gr.addColorStop(0, '#fff1a8'); gr.addColorStop(0.35, '#f5c842'); gr.addColorStop(0.7, '#d49a1c'); gr.addColorStop(1, '#a66f0c');
  return gr;
}

export const SECRET_LOOK = {
  // Binanın yeri: chunk karosu [x0, y0, x1, y1]. Rampanın (27-30) hemen kuzeyinde, güney yüzü rampaya dayanır
  bina: [27, 22, 31, 27],

  // Gövde: chunk görüntüsüne bir kez işlenir (render.js bakeBuilding, buildings.js paintBuilding2)
  paint(g, r) {
    const { x, y, w, h } = r;
    const roofH = h - FACADE;
    // Çatı: altın, kademeli korkuluk, köşelerde küçük kubbeler
    g.fillStyle = '#7a520a'; g.fillRect(x, y, w, roofH);
    g.fillStyle = goldFill(g, x, y, x + w, y + roofH); g.fillRect(x + 3, y + 3, w - 6, roofH - 6);
    g.fillStyle = 'rgba(120,80,10,.35)'; g.fillRect(x + 12, y + 12, w - 24, roofH - 24);
    g.fillStyle = goldFill(g, x + w, y, x, y + roofH); g.fillRect(x + 15, y + 15, w - 30, roofH - 30);
    g.strokeStyle = '#fff3b8'; g.lineWidth = 1.2; g.strokeRect(x + 15.5, y + 15.5, w - 31, roofH - 31);
    g.strokeStyle = 'rgba(110,70,0,.5)'; g.lineWidth = 1;
    for (let k = 1; k < 5; k++) { const yy = y + 15 + ((roofH - 30) * k) / 5; g.beginPath(); g.moveTo(x + 16, yy); g.lineTo(x + w - 16, yy); g.stroke(); }
    for (const [cx, cy] of [[x + 9, y + 9], [x + w - 9, y + 9], [x + 9, y + roofH - 9], [x + w - 9, y + roofH - 9]]) {
      g.fillStyle = '#8a5c08'; g.beginPath(); g.arc(cx, cy, 7.5, 0, 7); g.fill();
      g.fillStyle = goldFill(g, cx - 6, cy - 6, cx + 6, cy + 6); g.beginPath(); g.arc(cx, cy, 6, 0, 7); g.fill();
      g.fillStyle = '#fffbe0'; g.beginPath(); g.arc(cx - 2, cy - 2, 1.8, 0, 7); g.fill();
    }
    // Cephe: krem taş, altın sütunlar, ortada kemerli kapı
    const fy = y + roofH;
    g.fillStyle = '#efe0b8'; g.fillRect(x, fy, w, FACADE);
    g.fillStyle = '#c9a85a'; g.fillRect(x, fy, w, 4);
    g.fillStyle = '#b48a2c'; g.fillRect(x, y + h - 4, w, 4);
    const dx = x + DOOR.cx;
    for (const px of [x + 10, x + 30, dx + DOOR.w / 2 + 12, x + w - 34, x + w - 14]) {
      g.fillStyle = goldFill(g, px - 4, 0, px + 4, 0); g.fillRect(px - 4, fy + 6, 8, FACADE - 10);
      g.fillStyle = '#fff1a8'; g.fillRect(px - 5, fy + 5, 10, 3); g.fillRect(px - 5, y + h - 7, 10, 3);
    }
    // Kapı: içi karanlık, altın çerçeve; zemin rampaya iner
    const top = y + h - DOOR.h;
    g.fillStyle = goldFill(g, dx - DOOR.w / 2 - 4, top, dx + DOOR.w / 2 + 4, y + h);
    g.beginPath(); g.moveTo(dx - DOOR.w / 2 - 4, y + h); g.lineTo(dx - DOOR.w / 2 - 4, top + 10); g.arc(dx, top + 10, DOOR.w / 2 + 4, Math.PI, 0); g.lineTo(dx + DOOR.w / 2 + 4, y + h); g.closePath(); g.fill();
    const inner = g.createLinearGradient(0, top, 0, y + h);
    inner.addColorStop(0, '#0d0904'); inner.addColorStop(1, '#3a2a10');
    g.fillStyle = inner;
    g.beginPath(); g.moveTo(dx - DOOR.w / 2, y + h); g.lineTo(dx - DOOR.w / 2, top + 12); g.arc(dx, top + 12, DOOR.w / 2, Math.PI, 0); g.lineTo(dx + DOOR.w / 2, y + h); g.closePath(); g.fill();
    g.fillStyle = '#ffd34d'; starPath(g, dx, top + 4, 4.5, 2); g.fill();
    return true;
  },

  // Giriş (rampa): kapıdan aşağı uzanan kırmızı halı, altın kenarlar ve iki yanda altın babalar
  paintEntrance(g, x, y, w, h) {
    const cx = x + w / 2;
    g.fillStyle = 'rgba(60,40,10,.18)'; g.fillRect(x, y, w, h);
    g.fillStyle = '#d8b04a'; g.fillRect(cx - 24, y, 48, h);
    const carpet = g.createLinearGradient(0, y, 0, y + h);
    carpet.addColorStop(0, '#5a0c12'); carpet.addColorStop(0.25, '#9c1622'); carpet.addColorStop(1, '#b81d2b');
    g.fillStyle = carpet; g.fillRect(cx - 20, y, 40, h);
    g.fillStyle = 'rgba(255,215,90,.55)';
    for (let k = 0; k < h; k += 14) { g.fillRect(cx - 20, y + k, 3, 7); g.fillRect(cx + 17, y + k, 3, 7); }
    // Kapıya yaklaştıkça kararır: içeri iniş
    const dark = g.createLinearGradient(0, y, 0, y + h * 0.45);
    dark.addColorStop(0, 'rgba(10,6,2,.55)'); dark.addColorStop(1, 'rgba(10,6,2,0)');
    g.fillStyle = dark; g.fillRect(cx - 24, y, 48, h * 0.45);
    for (const bx of [cx - 38, cx + 38]) for (const by of [y + h * 0.3, y + h * 0.75]) {
      g.fillStyle = '#6b4a08'; g.beginPath(); g.arc(bx, by, 6, 0, 7); g.fill();
      g.fillStyle = goldFill(g, bx - 5, by - 5, bx + 5, by + 5); g.beginPath(); g.arc(bx, by, 4.6, 0, 7); g.fill();
    }
  },

  // Tabela: her kare çizilir (yazı tipi yüklenince doğru görünür, parlama nabız gibi atar). Gece daha parlak
  drawSign(ctx, box, now, night) {
    const t = now / 1000;
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
    const pw = 126; const ph = 38;
    const cx = box.x + box.w / 2;
    const py = box.y + box.h - FACADE - ph - 14; // Çatının ön kenarında, cephenin hemen üstünde
    const px = cx - pw / 2;
    ctx.save();
    // Yumuşak altın ışık halesi
    ctx.globalCompositeOperation = 'lighter';
    const R = 110 + pulse * 12;
    const halo = ctx.createRadialGradient(cx, py + ph / 2, 8, cx, py + ph / 2, R);
    halo.addColorStop(0, `rgba(255,210,80,${0.26 + 0.12 * pulse + 0.22 * night})`);
    halo.addColorStop(0.5, `rgba(255,180,40,${0.08 + 0.06 * night})`);
    halo.addColorStop(1, 'rgba(255,170,30,0)');
    ctx.fillStyle = halo;
    ctx.fillRect(cx - R, py + ph / 2 - R, R * 2, R * 2);
    ctx.globalCompositeOperation = 'source-over';
    // Tabela gövdesi: lacivert, kalın altın çerçeve, gölge
    ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fillRect(px + 4, py + 5, pw, ph);
    ctx.fillStyle = goldFill(ctx, px, py, px + pw, py + ph); ctx.fillRect(px - 3, py - 3, pw + 6, ph + 6);
    const plate = ctx.createLinearGradient(0, py, 0, py + ph);
    plate.addColorStop(0, '#1c2350'); plate.addColorStop(1, '#0b0f2a');
    ctx.fillStyle = plate; ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);
    // Yazı: altın, koyu kontur, ışıltı
    ctx.font = '400 25px Bungee, Nunito, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#3a2400';
    ctx.strokeText(TABELA, cx, py + ph / 2 + 1);
    ctx.shadowColor = `rgba(255,205,60,${0.75 + 0.25 * pulse})`;
    ctx.shadowBlur = 8 + 6 * pulse + 6 * night;
    ctx.fillStyle = goldFill(ctx, cx, py + 6, cx, py + ph - 6);
    ctx.fillText(TABELA, cx, py + ph / 2 + 1);
    // Üstte küçük yıldız: hafif döner ve parlar
    const sy = py - 9;
    ctx.shadowBlur = 10 + 8 * pulse;
    ctx.fillStyle = '#ffe066';
    starPath(ctx, cx, sy, 10, 4.2, -Math.PI / 2 + Math.sin(t * 1.3) * 0.12);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2; ctx.strokeStyle = '#6b3f00'; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,240,.9)'; ctx.beginPath(); ctx.arc(cx - 2.5, sy - 2.5, 1.6, 0, 7); ctx.fill();
    ctx.restore();
  },
};
