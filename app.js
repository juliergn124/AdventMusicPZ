/* =====================================================================
   app.js : logique du calendrier de l'Avent musical
   - 4 questions par jour (album, artiste, titre, année bonus)
   - 10 essais par question, indice (-1 point), possibilité de passer
   - extrait Spotify après la question 4
   - points mémorisés dans le navigateur, total au jour 24 + remake vidéo
   - mode test : ajouter ?test=1 à l'adresse du site
   ===================================================================== */
(function () {
  'use strict';
  const C = window.CONFIG, DAYS = window.ANSWERS;
  const TEST = new URLSearchParams(location.search).has('test');
  const KEY = (TEST ? 'avent-musical-test-' : 'avent-musical-') + C.year;
  const QIDS = ['album', 'artist', 'title', 'year'];
  const MAX_DAY = C.pointsPerQuestion * QIDS.length;
  const MAX_TOTAL = MAX_DAY * C.totalDays;
  const QUESTIONS = {
    album:  { kicker: 'QUESTION 1 / 4', title: "Quel est cet album ?", note: "Regarde bien la pochette : les textes sont brouillés, mais la forme des mots peut t'aider.", label: "Nom de l'album", ph: "", bonus: false },
    artist: { kicker: 'QUESTION 2 / 4', title: "Trouve l'artiste", note: "Qui se cache derrière cet album ? Un groupe ou un nom d'artiste.", label: "Nom de l'artiste ou du groupe", ph: "", bonus: false },
    title:  { kicker: 'QUESTION 3 / 4', title: "Donne un titre de l'album", note: "N'importe quelle chanson de cet album est acceptée.", label: "Titre d'une chanson de l'album", ph: "", bonus: false },
    year:   { kicker: 'QUESTION BONUS', title: "Trouve l'année", note: "En quelle année cet album est-il sorti ?", label: "Année de sortie", ph: "", bonus: true }
  };

  /* ---------- Outils ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));

  // Normalisation : minuscules, sans accents, sans ponctuation/espaces, sans article initial
  function norm(s) {
    s = String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/&/g, ' and ').replace(/[’‘`´']/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
    s = s.replace(/^(the|le|la|les|an|a) /, '');
    return s.replace(/ /g, '');
  }
  function lev(a, b) {
    const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    for (let i = 1; i <= m; i++) {
      const cur = [i];
      for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[n];
  }
  const tolerance = len => len <= 4 ? 0 : len <= 8 ? 1 : len <= 14 ? 2 : 3;

  function answersFor(d, qid) {
    if (qid === 'album') return [d.album].concat(d.albumAlt || []);
    if (qid === 'artist') return [d.artist].concat(d.artists || []);
    if (qid === 'title') return d.titles;
    return [d.year];
  }
  function isCorrect(d, qid, guess) {
    const g = norm(guess); if (!g) return false;
    if (qid === 'year') return g === norm(d.year);
    return answersFor(d, qid).some(a => {
      const k = norm(a); if (!k) return false;
      if (g === k) return true;
      const t = tolerance(k.length);
      return t > 0 && Math.abs(g.length - k.length) <= t && lev(g, k) <= t;
    });
  }
  const pattern = txt => String(txt).split(' ').map(w => w.length ? w[0] + '·'.repeat(Math.max(0, w.length - 1)) : w).join('  ');
  function hintFor(d, qid) {
    if (qid === 'album') return `L'album s'écrit : <b>${esc(pattern(d.album))}</b>`;
    if (qid === 'artist') return `L'artiste s'écrit : <b>${esc(pattern(d.artist))}</b>`;
    if (qid === 'title') { const t = d.titles[0]; return `L'album compte ${d.titles.length} titres. L'un d'eux s'écrit : <b>${esc(pattern(t))}</b>`; }
    const y = +d.year, dec = Math.floor(y / 10) * 10;
    return `L'album est sorti entre <b>${dec}</b> et <b>${dec + 9}</b>.`;
  }
  function answerText(d, qid) {
    if (qid === 'album') return d.album;
    if (qid === 'artist') return d.artist;
    if (qid === 'year') return d.year;
    return d.titles.slice(0, 4).join(' · ');
  }

  /* ---------- État (mémorisé dans le navigateur) ---------- */
  let state = (function () { try { return JSON.parse(localStorage.getItem(KEY)) || { days: {} }; } catch (e) { return { days: {} }; } })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };
  function qs(day, qid) {
    const D = state.days[day] = state.days[day] || {};
    return D[qid] = D[qid] || { tries: 0, hint: false, status: null, points: 0, wrong: [] };
  }
  const dayDone = day => QIDS.every(q => qs(day, q).status);
  const dayPoints = day => QIDS.reduce((s, q) => s + qs(day, q).points, 0);
  const totalPoints = () => DAYS.reduce((s, d) => s + dayPoints(d.day), 0);
  const doneCount = () => DAYS.filter(d => dayDone(d.day)).length;
  const nextQ = day => QIDS.find(q => !qs(day, q).status);
  function unlocked(day) {
    if (TEST) return true;
    return new Date() >= new Date(C.year, C.month - 1, day, 0, 0, 0);
  }
  const unlockDateLabel = day => new Date(C.year, C.month - 1, day).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });

  /* ---------- Vue ---------- */
  const view = { day: 1, stage: 'ask', last: null };

  function pickStartDay() {
    const open = DAYS.filter(d => unlocked(d.day));
    if (!open.length) return 1;
    const todo = open.find(d => !dayDone(d.day));
    return (todo || open[open.length - 1]).day;
  }
  function goDay(day) {
    view.day = day; view.last = null;
    view.stage = (unlocked(day) && !dayDone(day)) ? 'ask' : 'summary';
    render();
    const g = $('#game'); if (g && g.scrollIntoView) g.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- Spotify ---------- */
  let spotifyAPI = null;
  function loadSpotify() {
    if (window.__spLoading) return; window.__spLoading = true;
    window.onSpotifyIframeApiReady = api => { spotifyAPI = api; };
    const s = document.createElement('script'); s.src = 'https://open.spotify.com/embed/iframe-api/v1'; s.async = true;
    s.onerror = () => {}; document.head.appendChild(s);
  }
  function mountPlayer(host, url) {
    if (!host) return;
    const m = String(url).match(/track\/([A-Za-z0-9]+)/); host.innerHTML = '';
    if (!m) return;
    if (spotifyAPI) {
      try {
        const el = document.createElement('div'); host.appendChild(el);
        spotifyAPI.createController(el, { uri: 'spotify:track:' + m[1], width: '100%', height: 152 }, ctrl => {
          ctrl.addListener('ready', () => { try { ctrl.play(); } catch (e) {} });
        });
        return;
      } catch (e) { host.innerHTML = ''; }
    }
    host.innerHTML = '<iframe src="https://open.spotify.com/embed/track/' + m[1] + '?utm_source=generator" height="152" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy" title="Extrait Spotify"></iframe>';
  }

  /* ---------- Rendu ---------- */
  function topline(d) {
    return `<div class="game-topline"><span class="day-pill"><span class="tiny-star">✦</span> JOUR ${d.day} / ${C.totalDays}</span><span class="status">Points : ${totalPoints()}</span></div>`;
  }
  function musicBlock(d) {
    return `<p class="music-instruction">🎧 Écoute un extrait de l'album</p>
      <div class="spotify-player" id="player"></div>
      <p class="spotify-fallback"><a href="${esc(d.spotify)}" target="_blank" rel="noopener">Ouvrir dans Spotify</a></p>
      <p class="music-duration">Si la musique ne démarre pas toute seule, appuie sur ▶ (extrait de 30 s, ou titre complet si tu es connecté à Spotify).</p>`;
  }

  function renderGame() {
    const g = $('#game'), d = DAYS[view.day - 1];
    if (!unlocked(d.day)) {
      g.innerHTML = topline(d) + `<div class="locked-msg"><div class="big">🔒</div><h2>Patience…</h2>
        <p class="question-note">La case du jour ${d.day} s'ouvre le <b>${unlockDateLabel(d.day)}</b>.</p></div>`;
      return;
    }
    if (view.stage === 'ask') {
      const qid = nextQ(d.day);
      if (!qid) { view.stage = 'summary'; return renderGame(); }
      const q = QUESTIONS[qid], st = qs(d.day, qid), left = C.attempts - st.tries;
      g.innerHTML = topline(d) +
        `<div class="cover-frame"><img src="${esc(d.img)}" alt="Pochette à deviner du jour ${d.day}"></div>
        <p class="question-kicker">${q.kicker}${q.bonus ? ' · +' + C.pointsPerQuestion + ' pts' : ''}</p>
        <h2>${q.title}</h2>
        <p class="question-note">${q.note}</p>
        <form id="form" autocomplete="off">
          <label for="answer">${q.label}</label>
          <input id="answer" name="answer" type="text" inputmode="${qid === 'year' ? 'numeric' : 'text'}" placeholder="" autocapitalize="off" spellcheck="false">
          <button type="submit">Valider <span class="button-arrow">→</span></button>
        </form>
        <p class="feedback" id="feedback"></p>
        <p class="attempts" id="attempts">Essais restants : <b>${left}</b> / ${C.attempts}</p>
        <p class="tried" id="tried">${st.wrong.length ? 'Déjà essayé : ' + st.wrong.map(esc).join(' · ') : ''}</p>
        <div class="hint-box" id="hintBox" ${st.hint ? '' : 'hidden'}>${st.hint ? hintFor(d, qid) : ''}</div>
        <div class="btn-row">
          <button type="button" class="secondary" id="hintBtn">INDICES (−${C.hintPenalty} point)</button>
          <button type="button" class="secondary" id="skipBtn">Passer (0 point)</button>
        </div>
        <div class="card-bottom-note"><span>${C.pointsPerQuestion} POINTS MAX</span><span>${C.attempts} ESSAIS</span></div>`;
      $('#form').addEventListener('submit', e => { e.preventDefault(); submit(d, qid); });
      $('#hintBtn').addEventListener('click', () => useHint(d, qid));
      $('#skipBtn').addEventListener('click', () => resolve(d, qid, 'skipped'));
      const inp = $('#answer'); if (inp && !('ontouchstart' in window)) inp.focus();
      return;
    }
    if (view.stage === 'reveal') {
      const qid = view.last, st = qs(d.day, qid), q = QUESTIONS[qid];
      const badge = st.status === 'correct'
        ? `<span class="points-badge good">✓ Bonne réponse · +${st.points} point${st.points > 1 ? 's' : ''}</span>`
        : st.status === 'skipped'
          ? `<span class="points-badge skip">Question passée · 0 point</span>`
          : `<span class="points-badge bad">Plus d'essais · 0 point</span>`;
      const more = qid === 'title' ? `<p class="accepted">Titres de l'album : ${d.titles.map(esc).join(', ')}</p>` : '';
      const nextLabel = nextQ(d.day) ? 'Question suivante' : 'Voir le résumé du jour';
      g.innerHTML = topline(d) +
        `<div class="cover-frame"><img src="${esc(d.img)}" alt="Pochette du jour ${d.day}"></div>
        <div class="music-reveal">
          <p class="music-kicker">LA RÉPONSE · ${q.title.toUpperCase()}</p>
          <h3>${esc(qid === 'title' ? d.titles[0] + ' (entre autres)' : answerText(d, qid))}</h3>
          ${nextQ(d.day) ? '' : `<p class="reveal-artist">${esc(d.artist)} — ${esc(d.album)} (${esc(d.year)})</p>`}
          ${badge}${more}
          ${nextQ(d.day) ? '' : musicBlock(d)}
        </div>
        <button type="button" id="nextBtn">${nextLabel} <span class="button-arrow">→</span></button>`;
      if (!nextQ(d.day)) mountPlayer($('#player'), d.spotify);
      $('#nextBtn').addEventListener('click', () => { view.stage = nextQ(d.day) ? 'ask' : 'summary'; render(); });
      return;
    }
    // résumé du jour
    const rows = QIDS.map(q => {
      const st = qs(d.day, q), lab = { album: 'Album', artist: 'Artiste', title: 'Titre', year: 'Année (bonus)' }[q];
      const res = st.status === 'correct' ? '✓ +' + st.points : st.status === 'skipped' ? 'passée' : st.status === 'failed' ? '✗ 0' : '—';
      return `<div><span>${lab} : ${esc(answerText(d, q === 'title' ? 'title' : q).split(' · ')[0])}</span><span>${res}</span></div>`;
    }).join('');
    const nd = DAYS[d.day] , hasNext = nd && unlocked(nd.day);
    g.innerHTML = topline(d) +
      `<div class="cover-frame"><img src="${esc(d.img)}" alt="Pochette du jour ${d.day}"></div>
      <div class="music-reveal">
        <p class="music-kicker">RÉSUMÉ DU JOUR ${d.day}</p>
        <h3>${esc(d.album)}</h3>
        <p class="reveal-artist">${esc(d.artist)} · ${esc(d.year)}</p>
        <span class="points-badge good">${dayPoints(d.day)} / ${MAX_DAY} points aujourd'hui</span>
        <div class="recap">${rows}</div>
        ${view.last === null ? musicBlock(d) : ''}
      </div>
      ${hasNext ? `<button type="button" id="nextDay">Jour ${nd.day} <span class="button-arrow">→</span></button>`
        : `<p class="question-note">${d.day < C.totalDays ? 'Rendez-vous demain pour la prochaine pochette !' : 'Tu as terminé le calendrier ! 🎄'}</p>`}`;
    if (view.last === null) mountPlayer($('#player'), d.spotify);
    const nb = $('#nextDay'); if (nb) nb.addEventListener('click', () => goDay(nd.day));
  }

  function submit(d, qid) {
    const inp = $('#answer'), val = inp.value.trim(), fb = $('#feedback');
    if (!val) { fb.className = 'feedback bad'; fb.textContent = 'Écris une réponse ou clique sur « Passer ».'; return; }
    const st = qs(d.day, qid);
    if (isCorrect(d, qid, val)) { return resolve(d, qid, 'correct'); }
    st.tries++; st.wrong.push(val); save();
    if (st.tries >= C.attempts) return resolve(d, qid, 'failed');
    fb.className = 'feedback bad'; fb.textContent = 'Pas tout à fait… essaie encore !';
    $('#attempts').innerHTML = `Essais restants : <b>${C.attempts - st.tries}</b> / ${C.attempts}`;
    $('#tried').textContent = 'Déjà essayé : ' + st.wrong.join(' · ');
    inp.value = ''; inp.focus();
  }
  function useHint(d, qid) {
    const st = qs(d.day, qid); st.hint = true; save();
    const box = $('#hintBox'); box.hidden = false; box.innerHTML = hintFor(d, qid);
    $('#hintBtn').textContent = 'Indice affiché (−' + C.hintPenalty + ' point)';
  }
  function resolve(d, qid, status) {
    const st = qs(d.day, qid);
    st.status = status;
    st.points = status === 'correct' ? Math.max(0, C.pointsPerQuestion - (st.hint ? C.hintPenalty : 0)) : 0;
    save(); view.last = qid; view.stage = 'reveal'; render();
  }

  function renderGrid() {
    const grid = $('#dayGrid'); grid.innerHTML = '';
    DAYS.forEach(d => {
      const a = document.createElement('a'); a.href = '#'; a.textContent = d.day;
      a.className = 'day' + (dayDone(d.day) ? ' done' : '') + (view.day === d.day ? ' current' : '') + (unlocked(d.day) ? '' : ' locked');
      a.setAttribute('aria-label', 'Jour ' + d.day);
      a.addEventListener('click', e => { e.preventDefault(); if (unlocked(d.day)) goDay(d.day); });
      grid.appendChild(a);
    });
    const n = doneCount();
    $('#count').textContent = n + ' / ' + C.totalDays;
    $('#progressBar').style.width = (n / C.totalDays * 100) + '%';
    $('#progressSubtitle').textContent = TEST ? 'Mode test : toutes les cases sont ouvertes.' : n === C.totalDays ? 'Calendrier terminé !' : 'Une nouvelle pochette chaque jour à minuit.';
  }

  /* ---------- Finale ---------- */
  function finaleMessage(t) {
    const r = t / MAX_TOTAL;
    if (r >= .9) return "Oreille absolue ! Tu connais tes classiques sur le bout des doigts.";
    if (r >= .7) return "Superbe score, un vrai passionné de musique.";
    if (r >= .45) return "Belle performance, avec quelques belles découvertes à la clé.";
    return "Merci d'avoir joué ! Il reste plein de pépites à (re)découvrir.";
  }
  function renderFinale() {
    const f = $('#finale');
    const show = dayDone(C.totalDays) || (TEST && doneCount() === C.totalDays);
    if (!show) { f.hidden = true; return; }
    const t = totalPoints();
    f.hidden = false;
    f.innerHTML = `<p class="eyebrow">FIN DU CALENDRIER</p><h2>Ton score final</h2>
      <div class="total">${t}<small> / ${MAX_TOTAL}</small></div>
      <p class="finale-msg">${finaleMessage(t)}</p>
      <div class="remake-wrap"><canvas id="remake" width="720" height="720" aria-label="Remake vidéo des 24 pochettes"></canvas>
        <div class="btn-row"><button type="button" id="playRemake">▶ Lancer le remake</button><button type="button" class="secondary" id="recRemake">Enregistrer la vidéo</button></div>
        <p class="tried">Le remake passe en revue les 24 pochettes. « Enregistrer » crée un fichier vidéo .webm à télécharger.</p></div>`;
    const cv = $('#remake'); window.Remake.poster(cv, DAYS, t, MAX_TOTAL);
    $('#playRemake').addEventListener('click', () => window.Remake.run(cv, DAYS, t, MAX_TOTAL, {}));
    $('#recRemake').addEventListener('click', () => window.Remake.run(cv, DAYS, t, MAX_TOTAL, { record: true }));
  }

  /* ---------- Panneau de test ---------- */
  function renderTest() {
    const p = $('#testPanel'); if (!TEST) { p.hidden = true; return; }
    p.hidden = false;
    const d = DAYS[view.day - 1], qid = nextQ(d.day);
    const expected = qid ? answerText(d, qid).split(' · ')[0] : '—';
    p.innerHTML = `<h3>🧪 Mode test</h3>
      <p>Ton vrai calendrier n'est pas touché : le mode test a sa propre sauvegarde. Retire <code>?test=1</code> de l'adresse pour jouer pour de vrai.</p>
      <p>Réponse attendue à la question en cours : <b>${esc(expected)}</b></p>
      <label for="tday">Aller au jour</label>
      <select id="tday">${DAYS.map(x => `<option value="${x.day}" ${x.day === view.day ? 'selected' : ''}>Jour ${x.day} — ${esc(x.album)}</option>`).join('')}</select>
      <div class="btn-row">
        <button type="button" id="tFill">Simuler tout le jeu</button>
        <button type="button" id="tReset">Tout remettre à zéro</button>
      </div>`;
    $('#tday').addEventListener('change', e => goDay(+e.target.value));
    $('#tReset').addEventListener('click', () => { state = { days: {} }; save(); view.day = 1; view.stage = 'ask'; render(); });
    $('#tFill').addEventListener('click', () => {
      DAYS.forEach(x => QIDS.forEach(q => { const s = qs(x.day, q); const ok = Math.random() < .7; s.status = ok ? 'correct' : 'failed'; s.points = ok ? C.pointsPerQuestion : 0; }));
      save(); view.day = C.totalDays; view.stage = 'summary'; render();
    });
  }

  function render() { renderGame(); renderGrid(); renderFinale(); renderTest(); }

  loadSpotify();
  view.day = pickStartDay();
  view.stage = (unlocked(view.day) && !dayDone(view.day)) ? 'ask' : 'summary';
  render();
})();
