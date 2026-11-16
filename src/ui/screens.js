// Interface : construit et met à jour les écrans (DOM). Ne contient aucune règle de jeu ;
// elle affiche des données et renvoie les actions de l'utilisateur à l'application (handlers.act).
(function (root) {
  const A = root.Agasso, $ = (s, el) => (el || document).querySelector(s), $$ = (s, el) => [...(el || document).querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const h = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const btn = (label, act, cls, data) => `<button class="btn ${cls || ''}" data-nav data-act="${act}"${Object.entries(data || {}).map(([k, v]) => ` data-${k}="${esc(v)}"`).join('')}>${esc(label)}</button>`;
  const SCREENS = ['title', 'tournaments', 'select', 'setup', 'bracket', 'options', 'pause', 'celebration'];
  const el = {}, state = { screen: 'title', filter: 'all', picked: null };
  let bannerT = 0, lastChips = '', lastHint = '', lastScore = '';

  function init(handlers) {
    const ui = $('#ui');
    ui.appendChild((el.hud = h('div', 'hud', '<div id="score"></div><div id="chips"></div><div id="banner"><div id="banner-main"></div><div id="banner-sub"></div></div><div id="hint"></div>')));
    for (const s of SCREENS) ui.appendChild((el[s] = h('section', 'screen s-' + s)));
    document.addEventListener('click', (e) => { const b = e.target.closest('[data-act]'); if (b && !b.disabled) handlers.act(b.dataset.act, b.dataset); });
    document.addEventListener('focusin', (e) => { const c = e.target.closest('.pcard'); if (c && state.screen === 'select') fiche(c.dataset.id); });
    document.addEventListener('mouseover', (e) => { const c = e.target.closest('.pcard'); if (c && state.screen === 'select') fiche(c.dataset.id); });
  }

  function show(name) {
    state.screen = name;
    for (const s of SCREENS) el[s].classList.toggle('on', s === name);
    el.hud.classList.toggle('on', name === 'match' || name === 'pause');
    const first = name === 'match' ? null : $('[data-focus]', el[name]) || $('[data-nav]', el[name]);
    if (first) first.focus({ preventScroll: true }); else if (document.activeElement) document.activeElement.blur();
  }

  // Navigation spatiale au clavier / à la manette : va vers l'élément le plus proche dans la direction.
  function navigate(inp) {
    const host = el[state.screen]; if (!host) return;
    const items = $$('[data-nav]', host).filter((e) => e.offsetParent !== null && !e.disabled);
    if (!items.length) return;
    const cur = items.includes(document.activeElement) ? document.activeElement : null;
    if (inp.navX || inp.navY) {
      if (!cur) { items[0].focus(); return true; }
      const r = cur.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      let best = null, bs = Infinity;
      for (const it of items) {
        if (it === cur) continue;
        const q = it.getBoundingClientRect(), dx = q.left + q.width / 2 - cx, dy = q.top + q.height / 2 - cy;
        const along = inp.navX ? dx * inp.navX : dy * inp.navY, across = inp.navX ? Math.abs(dy) : Math.abs(dx);
        if (along <= 4) continue;
        const sc = along + across * 2.5;
        if (sc < bs) { bs = sc; best = it; }
      }
      if (best) { best.focus({ preventScroll: true }); best.scrollIntoView({ block: 'nearest' }); return true; }
    }
    if (inp.hit && cur) cur.click();
    return false;
  }

  function theme(venue) {
    const st = document.documentElement.style, k = venue.look;
    st.setProperty('--accent', k.accent); st.setProperty('--accent-deep', k.accentDeep); st.setProperty('--kick', k.kick); st.setProperty('--surface', k.court);
  }

  // ---------- Écrans ----------
  function title(o) {
    el.title.innerHTML = `<div class="brand"><div class="kicker">${esc(o.kicker)}</div><h1>AGASSO</h1><div class="tagline">Tennis Generation</div></div>
      <nav class="menu">${btn('Mode Tournoi', 'tournaments', 'primary')}${btn('Match amical', 'friendly')}${btn('Options', 'options')}${o.desktop ? btn('Quitter', 'quit') : ''}</nav>
      <div class="legend"><span><b>Flèches / ZQSD</b> déplacement et visée</span><span><b>Espace</b> frappe · service</span><span><b>C</b> lob</span><span><b>V</b> amortie</span><span><b>B</b> slice</span><span><b>Échap</b> pause</span><span><b>Manette</b> A frappe · B lob · X amortie · Y slice</span></div>`;
  }

  function tournaments(o) {
    const cards = A.all('tournament').map((t) => {
      const v = A.Venues.get(t.venue), save = o.save && o.save.tid === t.id && o.save.status === 'active' ? o.save : null;
      return `<div class="tcard" style="--c:${v.look.accent}"><div class="kicker">${esc(v.surfaceLabel)} · ${esc(v.city)}</div><h3>${esc(t.name)}</h3>
        <p>${t.drawSize} joueurs · ${t.rounds.length} tours · élimination directe</p>
        ${save ? btn('Continuer — ' + A.Tournament.roundName(save, save.round), 'tour-continue', 'primary') : ''}${btn(save ? 'Recommencer' : 'Participer', 'tour-new', save ? '' : 'primary', { id: t.id })}</div>`;
    }).join('');
    el.tournaments.innerHTML = `<header><div class="kicker">Mode Tournoi</div><h2>Choisis ton tournoi</h2></header><div class="tcards">${cards}</div><nav class="menu row">${btn('Retour', 'home')}</nav>`;
  }

  const FILTERS = [['all', 'Tous'], ['M', 'Hommes'], ['F', 'Femmes'], ['original', 'Originaux']];
  function select(o) {
    state.sel = o; state.picked = o.selected;
    const ids = A.all('player').filter((d) => d.id !== o.exclude);
    const shown = ids.filter((d) => state.filter === 'all' || d.gender === state.filter || d.group === state.filter);
    if (!shown.some((d) => d.id === state.picked)) state.picked = shown[0].id;
    const venue = o.venue;
    const cards = shown.map((d) => {
      const p = A.Players.profile(d.id);
      return `<button class="pcard${d.id === state.picked ? ' sel' : ''}" data-nav data-act="pick" data-id="${d.id}"${d.id === state.picked ? ' data-focus' : ''}>
        <span class="ct">${esc(d.country || '—')}</span><span class="nm">${esc(d.short || d.name)}</span><span class="ar">${esc(p.archetype.label)}</span><span class="rt">${A.Players.rating(p, venue).toFixed(1)}</span></button>`;
    }).join('');
    el.select.innerHTML = `<header><div class="kicker">${esc(o.kicker)}</div><h2>${esc(o.title)}</h2></header>
      <div class="sel-body"><div class="sel-left"><div class="seg">${FILTERS.map(([k, l]) => `<button data-nav data-act="filter" data-val="${k}" class="${state.filter === k ? 'on' : ''}">${l}</button>`).join('')}</div><div class="grid">${cards}</div></div>
      <aside class="fiche" id="fiche"></aside></div>
      <nav class="menu row">${btn('Retour', 'back')}${btn('Valider', 'confirm', 'primary')}</nav>`;
    fiche(state.picked);
  }
  function setFilter(f) { state.filter = f; select(Object.assign({}, state.sel, { selected: state.picked })); show('select'); }
  function pick(id) { state.picked = id; $$('.pcard', el.select).forEach((c) => c.classList.toggle('sel', c.dataset.id === id)); fiche(id); }

  // Points forts lisibles, déduits de la technique du joueur.
  function strengths(p) {
    const t = p.tech, sc = (x) => (x.pace ? (x.pace - 1) * 2 : 0) + (1 - (x.margin || 1));
    const list = [['Coup droit', sc(t.forehand)], ['Revers', sc(t.backhand)], ['Service', sc(t.serve)], ['Retour', sc(t.return)], ['Volée', sc(t.volley)], ['Smash', sc(t.smash)],
      ['Lob', sc(t.lob)], ['Slice', sc(t.slice) + (t.backhand.spin <= -0.4 ? 0.15 : 0)], ['Amortie', sc(t.drop)], ['Prise de balle tôt', t.early * 0.3], ['Lift', Math.max(0, t.forehand.spin - 0.4) * 0.5]];
    const out = list.filter((x) => x[1] > 0.045).sort((a, b) => b[1] - a[1]).slice(0, 4).map((x) => x[0]);
    out.push(t.backhand.hands === 1 ? 'Revers à une main' : 'Revers à deux mains');
    return out;
  }

  function portrait(cv, id, venue) {
    const c = cv.getContext('2d'), def = A.need('player', id); c.clearRect(0, 0, cv.width, cv.height);
    A.Figure.draw(c, { x: cv.width * 0.5, y: cv.height * 0.97, s: cv.height / 2.05 }, A.Anim.look(def, venue), { fh: def.hand === 'L' ? 1 : -1, hands: { hx: 0.22, hz: -0.42, ox: 0.05, oz: -0.5 }, wide: 0.03 });
  }

  function fiche(id) {
    const host = $('#fiche'); if (!host || host.dataset.id === id) return;
    host.dataset.id = id;
    const p = A.Players.profile(id), d = p.def, venue = state.sel.venue, fem = d.gender === 'F';
    const meta = [d.country, d.hand === 'L' ? (fem ? 'Gauchère' : 'Gaucher') : fem ? 'Droitière' : 'Droitier', d.slams ? d.slams + ' titres du Grand Chelem' : null].filter(Boolean).join(' · ');
    host.innerHTML = `<canvas width="360" height="460"></canvas><div class="f-info"><div class="kicker">${esc(meta)}</div><h3>${esc(d.name)}</h3>
      <div class="arch">${esc(p.archetype.label)}</div><p>${esc(d.style)}</p>
      <div class="stats">${A.STATS.map(([k, l]) => `<div class="st"><span>${l}</span><i><b style="width:${p.stats[k] * 10}%"></b></i><em>${p.stats[k]}</em></div>`).join('')}</div>
      <div class="tags">${strengths(p).map((s) => `<span>${esc(s)}</span>`).join('')}</div></div>`;
    portrait($('canvas', host), id, venue);
  }

  // Fiche d'un terrain : tout vient de sa configuration (content/venues/venues.js).
  function venueInfo(v) {
    const w = v.physics.wind, wind = Math.hypot(w[0], w[1]);
    const rows = [['Surface', v.surfaceLabel], ['Vitesse', v.speed + ' / 10'], ['Rebond', v.bounce + ' / 10'], ['Éclairage', v.lightingLabel], ['Météo', v.weather.label + ' · ' + v.weather.temperature + ' °C' + (wind > 0.05 ? ' · vent ' + wind.toFixed(1) + ' m/s' : '')],
      ['Stade', v.styleLabel + ' · ' + v.capacity.toLocaleString('fr-FR') + ' places'], ['Prestige', '★'.repeat(v.prestige) + '☆'.repeat(5 - v.prestige)]];
    if (v.tournament && A.get('tournament', v.tournament)) rows.push(['Tournoi', A.get('tournament', v.tournament).name]);
    return `<div class="kicker">${esc([v.city, v.country].filter(Boolean).join(' · ') || 'Court générique')}</div><h3>${esc(v.name)}</h3>
      <div class="vrows">${rows.map(([l, x]) => `<div><span>${l}</span><b>${esc(x)}</b></div>`).join('')}</div>${v.conditions ? `<p>${esc(v.conditions)}</p>` : ''}`;
  }

  function setup(o) {
    const side = (id, lab) => { const d = A.need('player', id); return `<div class="vs-side"><canvas width="300" height="380" data-portrait="${id}"></canvas><div class="kicker">${lab}</div><h3>${esc(d.short || d.name)}</h3></div>`; };
    const seg = (act, list, cur) => `<div class="seg">${list.map(([k, l]) => `<button data-nav data-act="${act}" data-val="${k}" class="${k === cur ? 'on' : ''}">${esc(l)}</button>`).join('')}</div>`;
    const all = A.Venues.all();
    const groups = A.VENUE_CATEGORIES.map(([cat, label]) => { const vs = all.filter((v) => v.category === cat); return vs.length ? `<label>${label}</label><div class="vbtns">${vs.map((v) => `<button data-nav data-act="set-venue" data-val="${v.id}" class="${v.id === o.venue.id ? 'on' : ''}"><i style="background:${v.look.court}"></i>${esc(v.name)}</button>`).join('')}</div>` : ''; }).join('');
    el.setup.innerHTML = `<header><div class="kicker">Match amical</div><h2>Avant-match</h2></header>
      <div class="setup-body"><div class="vs">${side(o.player, 'Toi')}<div class="vs-x">VS</div>${side(o.opponent, 'Adversaire')}</div>
        <div class="vlist">${groups}</div><aside class="vinfo">${venueInfo(o.venue)}</aside></div>
      <div class="opts"><div><label>Format</label>${seg('set-format', Object.entries(A.FORMATS).map(([k, f]) => [k, f.label]), o.format)}</div></div>
      <nav class="menu row">${btn('Retour', 'back')}<button class="btn primary" data-nav data-focus data-act="start">Entrer sur le court</button></nav>`;
    $$('[data-portrait]', el.setup).forEach((cv) => portrait(cv, cv.dataset.portrait, o.venue));
  }

  function bracket(st) {
    const def = A.need('tournament', st.tid), venue = A.Venues.get(def.venue), cur = A.Tournament.current(st), nm = (id) => A.need('player', id).short || A.need('player', id).name;
    let cols = '';
    for (let r = 0; r < def.rounds.length; r++) {
      const n = def.drawSize >> (r + 1), ms = st.rounds[r] || Array.from({ length: n }, () => null);
      cols += `<div class="bcol"><div class="bhead">${esc(A.Tournament.roundName(st, r))}</div><div class="bms">${ms.map((m) => {
        if (!m) return '<div class="bm empty"><div>—</div><div>—</div></div>';
        const row = (id, o2) => `<div class="${m.w === id ? 'w' : m.w ? 'l' : ''}${id === st.playerId ? ' me' : ''}"><small>${st.seeds[id]}</small><span>${esc(nm(id))}</span>${m.w === id ? `<em>${esc(m.score)}</em>` : ''}</div>`;
        return `<div class="bm${m.a === st.playerId || m.b === st.playerId ? ' mine' : ''}">${row(m.a)}${row(m.b)}</div>`;
      }).join('')}</div></div>`;
    }
    const champ = A.Tournament.champion(st);
    const status = cur ? `${cur.roundName} · contre ${esc(A.need('player', cur.opponent).name)} · ${esc(cur.format.label)}` : st.status === 'champion' ? 'Tu remportes le tournoi !' : `Éliminé · titre pour ${esc(champ ? A.need('player', champ).name : '—')}`;
    el.bracket.innerHTML = `<header><div class="kicker">${esc(venue.surfaceLabel)} · ${esc(venue.city)} 2026</div><h2>${esc(def.name)}</h2><p class="status">${status}</p></header>
      <div class="bracket">${cols}</div>
      <nav class="menu row">${btn('Menu', 'home')}${cur ? `<button class="btn primary" data-nav data-focus data-act="tour-play">Jouer : ${esc(cur.roundName)}</button>` : btn('Nouveau tournoi', 'tournaments', 'primary')}</nav>`;
  }

  function options() {
    el.options.innerHTML = `<header><div class="kicker">Réglages</div><h2>Options</h2></header><div class="optlist">${A.SETTINGS.map((s) => `<div class="optrow"><label>${esc(s.label)}</label><div class="seg">${A.Settings.optionsOf(s).map(([k, l]) => `<button data-nav data-act="setting" data-key="${s.key}" data-val="${k}" class="${String(A.Settings.get(s.key)) === String(k) ? 'on' : ''}">${esc(l)}</button>`).join('')}</div></div>`).join('')}</div>
      <p class="fine">« Performance » calcule l’image à 60 % puis l’agrandit ; « Ultra » la calcule à 150 % puis la réduit.</p><nav class="menu row">${btn('Retour', 'back', 'primary')}</nav>`;
  }

  function pause() {
    el.pause.innerHTML = `<header><div class="kicker">Match en cours</div><h2>Pause</h2></header><nav class="menu">${btn('Reprendre', 'resume', 'primary')}${btn('Options', 'options')}${btn('Recommencer le match', 'restart')}${btn('Abandonner', 'forfeit')}</nav>`;
  }

  const TROPHY = '<svg class="trophy" viewBox="0 0 120 150" aria-hidden="true"><defs><linearGradient id="tg" x1="0" x2="1"><stop offset="0" stop-color="#8a6a1c"/><stop offset=".45" stop-color="#f6e08a"/><stop offset="1" stop-color="#9a7620"/></linearGradient></defs><path d="M30 12h60v34c0 22-13 38-30 38S30 68 30 46z" fill="url(#tg)"/><path d="M30 20H12c0 24 8 36 22 38M90 20h18c0 24-8 36-22 38" fill="none" stroke="url(#tg)" stroke-width="7"/><rect x="54" y="82" width="12" height="30" fill="url(#tg)"/><rect x="34" y="112" width="52" height="12" rx="3" fill="url(#tg)"/><rect x="24" y="124" width="72" height="16" rx="3" fill="#2a2420"/></svg>';
  // o = { game, kicker, title, lines, buttons:[[label, act, primary]], champion }
  function celebration(o) {
    const g = o.game, n = g.players.map((p) => p.profile.short), s = g.stats;
    const rows = [['Points gagnés', 'points'], ['Aces', 'aces'], ['Coups gagnants', 'winners'], ['Fautes', 'errors'], ['Doubles fautes', 'doubleFaults']];
    el.celebration.innerHTML = `<div class="cele${o.champion ? ' champion' : ''}">${o.champion ? TROPHY : ''}<div class="kicker">${esc(o.kicker)}</div><h2>${esc(o.title)}</h2>
      <div class="final">${g.match.sets.map((x) => `<span>${x.games[0]}<i>–</i>${x.games[1]}${x.tb ? `<sup>${Math.min(x.tb[0], x.tb[1])}</sup>` : ''}</span>`).join('')}</div>
      <p class="sub">${esc(o.sub || '')}</p>
      <table><tr><th>${esc(n[0])}</th><th></th><th>${esc(n[1])}</th></tr>${rows.map(([l, k]) => `<tr><td>${s[0][k]}</td><td>${l}</td><td>${s[1][k]}</td></tr>`).join('')}<tr><td colspan="3">Plus long échange : ${g.longestRally} frappe${g.longestRally > 1 ? 's' : ''}</td></tr></table>
      <nav class="menu row">${o.buttons.map(([l, a, p]) => btn(l, a, p ? 'primary' : '')).join('')}</nav></div>`;
  }

  // ---------- Habillage TV du match ----------
  const hud = {
    score(g, headline) {
      const m = g.match, S = A.Scoring, lab = S.pointLabels(m), srv = S.currentServer(m);
      const html = `<div class="sb-head">${esc(headline)}</div>` + [0, 1].map((i) => {
        const p = g.players[i], sets = m.sets.map((s) => `<span class="st${s.games[i] > s.games[1 - i] ? ' won' : ''}">${s.games[i]}</span>`).join('');
        return `<div class="sb-row"><span class="srv">${srv === i && !m.over ? '●' : ''}</span><span class="ct">${esc(p.def.country || '')}</span><span class="nm">${esc(p.profile.short)}</span>${sets}<span class="gm">${m.games[i]}</span><span class="pt">${lab[i]}</span></div>`;
      }).join('');
      if (html !== lastScore) $('#score').innerHTML = lastScore = html;
    },
    chips(list) { const html = list.map(([t, hot]) => `<div class="chip${hot ? ' hot' : ''}">${esc(t)}</div>`).join(''); if (html !== lastChips) $('#chips').innerHTML = lastChips = html; },
    banner(main, sub, secs) { $('#banner-main').textContent = main; $('#banner-sub').textContent = sub || ''; $('#banner').classList.add('on'); bannerT = secs || 1.6; },
    hint(t) { if (t !== lastHint) $('#hint').textContent = lastHint = t; },
    tick(dt) { if (bannerT > 0 && (bannerT -= dt) <= 0) $('#banner').classList.remove('on'); },
  };

  A.UI = { init, show, navigate, theme, title, tournaments, select, setFilter, pick, setup, bracket, options, pause, celebration, hud, get screen() { return state.screen; }, get picked() { return state.picked; } };
})(typeof window !== 'undefined' ? window : globalThis);
