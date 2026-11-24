/* =====================================================================
   remake.js : mini film final (canvas) qui repasse les 24 pochettes
   window.Remake.poster(canvas, days, total, max)  -> image fixe de départ
   window.Remake.run(canvas, days, total, max, {record, speed})
   ===================================================================== */
(function () {
  'use strict';
  const W = 720, INTRO = 3200, PER = 1500, GRID = 3400, SCORE = 5000;
  const SERIF = "'Playfair Display', Georgia, serif", SANS = "'DM Sans', system-ui, sans-serif";
  const GOLD = '#d6b77a', GOLD2 = '#f0dca9';
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  let running = null;

  function loadImages(days) {
    return Promise.all(days.map(d => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = d.img; })));
  }
  function bg(ctx) {
    const g = ctx.createRadialGradient(W / 2, -60, 40, W / 2, W / 2, W * .8);
    g.addColorStop(0, '#304839'); g.addColorStop(.5, '#192820'); g.addColorStop(1, '#0b130f');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, W);
  }
  function center(ctx, txt, y, font, color, alpha) {
    ctx.globalAlpha = alpha == null ? 1 : alpha; ctx.fillStyle = color; ctx.font = font; ctx.textAlign = 'center'; ctx.fillText(txt, W / 2, y); ctx.globalAlpha = 1;
  }
  function spaced(ctx, txt, x, y, sp) { // texte avec espacement de lettres
    ctx.textAlign = 'left'; let w = 0; for (const c of txt) w += ctx.measureText(c).width + sp; w -= sp;
    let cx = x - w / 2; for (const c of txt) { ctx.fillText(c, cx, y); cx += ctx.measureText(c).width + sp; }
  }
  function vinyl(ctx, cx, cy, r, label, rot) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fillStyle = '#0e0e0e'; ctx.fill();
    ctx.strokeStyle = '#ffffff10'; ctx.lineWidth = 1;
    for (let k = r * .38; k < r; k += 5) { ctx.beginPath(); ctx.arc(0, 0, k, 0, 7); ctx.stroke(); }
    ctx.fillStyle = '#ffffff12'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r, -.5, -.1); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, r * .32, 0, 7); ctx.fillStyle = '#c6a96d'; ctx.fill();
    ctx.fillStyle = '#263127'; ctx.font = '700 ' + (r * .2) + 'px ' + SANS; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, 0, 0);
    ctx.beginPath(); ctx.arc(0, 0, 4, 0, 7); ctx.fillStyle = '#0e0e0e'; ctx.fill();
    ctx.restore(); ctx.textBaseline = 'alphabetic';
  }

  function drawIntro(ctx, t) {
    bg(ctx);
    vinyl(ctx, W / 2, W / 2 - 40, 150 + Math.sin(t / 700) * 4, '♪', t / 900);
    const title = "Calendrier de l'Avent musical", n = Math.floor(clamp(t - 500, 0, 1e5) / 55);
    center(ctx, title.slice(0, n), W / 2 + 190, 'italic 500 34px ' + SERIF, GOLD2);
    center(ctx, '24 JOURS · 24 POCHETTES', W / 2 + 232, '700 14px ' + SANS, GOLD, clamp((t - 1800) / 600, 0, 1));
  }
  function drawCover(ctx, imgs, days, i, u) {
    const img = imgs[i], d = days[i];
    bg(ctx);
    if (img) { // fond : pochette agrandie assombrie (flou si disponible)
      ctx.save(); if ('filter' in ctx) ctx.filter = 'blur(22px)';
      const z = 1.5 + u * .08; ctx.drawImage(img, W / 2 - W * z / 2, W / 2 - W * z / 2, W * z, W * z); ctx.restore();
      ctx.fillStyle = 'rgba(8,16,12,.68)'; ctx.fillRect(0, 0, W, W);
    }
    const e = ease(clamp(u * 1.6, 0, 1)), size = 400 * (1 + .07 * u);
    const cx = W / 2 - 60 * e, cy = 300;
    vinyl(ctx, cx + 120 * e + 60, cy, 190 * .93, 'J' + d.day, u * 3 + i);   // disque qui sort de la pochette
    ctx.save(); ctx.translate(cx, cy); ctx.rotate((-3 + 3 * e) * Math.PI / 180);
    ctx.shadowColor = 'rgba(0,0,0,.6)'; ctx.shadowBlur = 40; ctx.shadowOffsetY = 18;
    ctx.fillStyle = '#000'; ctx.fillRect(-size / 2, -size / 2, size, size); ctx.shadowColor = 'transparent';
    if (img) ctx.drawImage(img, -size / 2, -size / 2, size, size);
    ctx.restore();
    const a = clamp((u - .2) / .3, 0, 1), dy = (1 - ease(a)) * 16;
    ctx.fillStyle = GOLD; ctx.font = '700 15px ' + SANS; ctx.globalAlpha = a;
    spaced(ctx, 'JOUR ' + String(d.day).padStart(2, '0'), W / 2, 560 + dy, 5);
    ctx.fillStyle = '#f6f1e7'; ctx.font = 'italic 500 30px ' + SERIF; ctx.textAlign = 'center'; ctx.fillText(d.album, W / 2, 604 + dy, W - 60);
    ctx.fillStyle = GOLD2; ctx.font = '500 18px ' + SANS; ctx.fillText(d.artist + ' · ' + d.year, W / 2, 636 + dy, W - 60);
    ctx.globalAlpha = 1;
    for (let k = 0; k < days.length; k++) { // frise de progression
      ctx.fillStyle = k <= i ? GOLD : 'rgba(255,255,255,.14)'; ctx.fillRect(40 + k * ((W - 80) / days.length), 690, (W - 80) / days.length - 3, 4);
    }
    if (u < .12) { ctx.fillStyle = 'rgba(255,255,255,' + (.5 * (1 - u / .12)) + ')'; ctx.fillRect(0, 0, W, W); }
  }
  function drawGrid(ctx, imgs, u) {
    bg(ctx);
    const cols = 6, rows = 4, gap = 8, cell = (W - 80 - gap * (cols - 1)) / cols, shown = u * 28;
    center(ctx, 'Les 24 pochettes', 74, 'italic 500 34px ' + SERIF, GOLD2);
    for (let k = 0; k < 24; k++) {
      const a = clamp(shown - k, 0, 1); if (!a) continue;
      const x = 40 + (k % cols) * (cell + gap), y = 120 + Math.floor(k / cols) * (cell + gap) * 1;
      ctx.globalAlpha = a; if (imgs[k]) ctx.drawImage(imgs[k], x, y + (1 - a) * 14, cell, cell); ctx.globalAlpha = 1;
    }
  }
  function drawScore(ctx, imgs, u, total, max) {
    bg(ctx);
    ctx.globalAlpha = .12; for (let k = 0; k < 24; k++) if (imgs[k]) ctx.drawImage(imgs[k], (k % 6) * 120, Math.floor(k / 6) * 120 + 120, 120, 120); ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(8,16,12,.55)'; ctx.fillRect(0, 0, W, W);
    const n = Math.round(total * ease(clamp(u / .6, 0, 1)));
    center(ctx, 'TON SCORE FINAL', 220, '700 16px ' + SANS, GOLD, clamp(u / .15, 0, 1));
    center(ctx, String(n), 390, '500 150px ' + SERIF, GOLD2);
    center(ctx, '/ ' + max + ' points', 440, '500 24px ' + SANS, '#aab7ac');
    center(ctx, 'Merci d\'avoir joué', 540, 'italic 500 34px ' + SERIF, '#f6f1e7', clamp((u - .6) / .25, 0, 1));
    center(ctx, 'Joyeux Noël ✦', 590, '500 22px ' + SANS, GOLD, clamp((u - .75) / .2, 0, 1));
  }

  async function poster(canvas, days, total, max) {
    const ctx = canvas.getContext('2d'); const imgs = await loadImages(days);
    drawGrid(ctx, imgs, 1);
  }
  async function run(canvas, days, total, max, opts) {
    opts = opts || {}; if (running) running.stop();
    const ctx = canvas.getContext('2d'), imgs = await loadImages(days), speed = opts.speed || 1;
    const TOTAL = INTRO + days.length * PER + GRID + SCORE;
    let rec = null, chunks = [], stopped = false, t0 = null;
    if (opts.record && canvas.captureStream && window.MediaRecorder) {
      const mt = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'].find(t => MediaRecorder.isTypeSupported(t));
      rec = new MediaRecorder(canvas.captureStream(30), mt ? { mimeType: mt } : undefined);
      rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      rec.onstop = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(chunks, { type: 'video/webm' })); a.download = 'avent-musical-remake.webm'; a.click(); };
      rec.start();
    } else if (opts.record) { alert("L'enregistrement n'est pas pris en charge par ce navigateur. Essaie avec Chrome ou Firefox."); }
    return new Promise(resolve => {
      function frame(ts) {
        if (stopped) return;
        if (t0 === null) t0 = ts; const t = (ts - t0) * speed;
        if (t < INTRO) drawIntro(ctx, t);
        else if (t < INTRO + days.length * PER) { const k = Math.floor((t - INTRO) / PER); drawCover(ctx, imgs, days, k, ((t - INTRO) % PER) / PER); }
        else if (t < INTRO + days.length * PER + GRID) drawGrid(ctx, imgs, (t - INTRO - days.length * PER) / GRID);
        else if (t < TOTAL) drawScore(ctx, imgs, (t - INTRO - days.length * PER - GRID) / SCORE, total, max);
        else { drawScore(ctx, imgs, 1, total, max); finish(); return; }
        requestAnimationFrame(frame);
      }
      function finish() { stopped = true; if (rec && rec.state !== 'inactive') rec.stop(); running = null; resolve(); }
      running = { stop() { stopped = true; if (rec && rec.state !== 'inactive') { rec.onstop = null; rec.stop(); } } };
      requestAnimationFrame(frame);
    });
  }
  window.Remake = { poster: poster, run: run };
})();
