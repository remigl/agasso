// Chef d'orchestre : écrans, boucle de jeu, HUD, sons.
(function () {
  const A = window.Agasso, S = A.Scoring, Au = A.Audio;
  const $ = (s) => document.querySelector(s);
  const FORMATS = {
    express: { label: 'Express (4 jeux)', setsToWin: 1, gamesToSet: 4 },
    set1: { label: '1 set', setsToWin: 1, gamesToSet: 6 },
    bo3: { label: '3 sets', setsToWin: 2, gamesToSet: 6 },
    bo5: { label: '5 sets', setsToWin: 3, gamesToSet: 6 },
  };
  const opt = { player: 'remi', diff: 'normal', format: 'express', sound: true, voice: true };
  try { Object.assign(opt, JSON.parse(localStorage.getItem('agasso-options') || '{}')); } catch (e) { /* stockage indisponible */ }
  if (!A.SELECTABLE.includes(opt.player)) opt.player = 'remi';
  if (!A.DIFFICULTY[opt.diff]) opt.diff = 'normal';
  if (!FORMATS[opt.format]) opt.format = 'express';
  const save = () => { try { localStorage.setItem('agasso-options', JSON.stringify(opt)); } catch (e) { /* idem */ } };

  const renderer = new A.Renderer($('#game'));
  let game = null, ais = [null, null], human = -1, screen = 'title', last = 0, acc = 0, bannerT = 0, speedT = 0, serveSpeed = 0, chipsHtml = '', hintText = '';
  if (/Electron/i.test(navigator.userAgent)) document.body.classList.add('is-desktop');

  // ---------- Parties ----------
  function startDemo() { // match IA contre IA en fond de menu
    game = new A.Game({ playerId: opt.player, setsToWin: 3 });
    ais = [new A.AI(0, 'difficile'), new A.AI(1, 'difficile')];
    human = -1; renderer.clearMarks();
  }
  function startMatch() {
    const f = FORMATS[opt.format];
    game = new A.Game({ playerId: opt.player, setsToWin: f.setsToWin, gamesToSet: f.gamesToSet, firstServer: 0 });
    ais = [null, new A.AI(1, opt.diff)];
    human = 0; renderer.clearMarks(); acc = 0;
    Au.init(); Au.setEnabled(opt.sound); Au.setVoice(opt.voice); Au.ambience(true);
    show('match'); updateScore(); banner('ROLAND-GARROS', names()[0] + ' – ' + names()[1], 2.2);
    Au.cheer(1);
  }
  const names = () => game.players.map((p) => p.def.name);

  // ---------- Écrans ----------
  function show(name) {
    screen = name;
    for (const id of ['title', 'select', 'pause', 'end']) $('#' + id).classList.toggle('hidden', id !== name);
    $('#hud').classList.toggle('hidden', !(name === 'match' || name === 'pause'));
    const first = name === 'select' ? $('#btn-start') : document.querySelector('#' + name + ' [data-nav]');
    if (first && name !== 'match') first.focus(); else if (document.activeElement) document.activeElement.blur();
    if (name === 'pause') { $('#btn-sound').textContent = 'Son : ' + (opt.sound ? 'activé' : 'coupé'); $('#btn-voice').textContent = 'Voix de l’arbitre : ' + (opt.voice ? 'activée' : 'coupée'); }
  }

  const actions = {
    play() { Au.init(); Au.setEnabled(opt.sound); show('select'); },
    back() { show('title'); },
    start() { startMatch(); },
    resume() { show('match'); },
    restart() { startMatch(); },
    select() { Au.ambience(false); startDemo(); show('select'); },
    menu() { Au.ambience(false); startDemo(); show('title'); },
    sound() { opt.sound = !opt.sound; Au.setEnabled(opt.sound); save(); show('pause'); $('#btn-sound').focus(); },
    voice() { opt.voice = !opt.voice; Au.setVoice(opt.voice); save(); show('pause'); $('#btn-voice').focus(); },
    fullscreen() { if (document.fullscreenElement) document.exitFullscreen(); else document.documentElement.requestFullscreen().catch(() => {}); },
    quit() { window.close(); },
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-act]');
    if (b && actions[b.dataset.act]) { Au.init(); Au.ui(); actions[b.dataset.act](); }
  });

  function buildSelect() {
    const cards = $('#cards'); cards.innerHTML = '';
    const bars = ['Vitesse', 'Puissance', 'Précision', 'Service'].map((n) => `<div class="bar"><span>${n}</span><i></i></div>`).join('');
    const mk = (id, cpu) => {
      const el = document.createElement(cpu ? 'div' : 'button');
      el.className = 'card' + (cpu ? ' cpu' : ''); if (!cpu) { el.dataset.nav = ''; el.dataset.player = id; }
      el.innerHTML = `<canvas width="300" height="315"></canvas><div class="nm">${A.PLAYERS[id].name}</div>${bars}`;
      const c = el.querySelector('canvas').getContext('2d');
      A.Renderer.prototype.figure.call(null, c, { x: 150, y: 296, s: 150 }, A.PLAYERS[id].look, { away: false, fh: -1 });
      return el;
    };
    for (const id of A.SELECTABLE) cards.appendChild(mk(id, false));
    const vs = document.createElement('div'); vs.className = 'vs'; vs.textContent = 'VS'; cards.appendChild(vs);
    cards.appendChild(mk('agasso', true));
    cards.addEventListener('click', (e) => { const c = e.target.closest('[data-player]'); if (c) { opt.player = c.dataset.player; save(); Au.ui(); refreshSelect(); } });
    const seg = (host, entries, key) => {
      for (const [k, label] of entries) { const b = document.createElement('button'); b.textContent = label; b.dataset.nav = ''; b.dataset.val = k; host.appendChild(b); }
      host.addEventListener('click', (e) => { const b = e.target.closest('[data-val]'); if (b) { opt[key] = b.dataset.val; save(); Au.ui(); refreshSelect(); } });
    };
    seg($('#seg-diff'), Object.entries(A.DIFFICULTY).map(([k, v]) => [k, v.label]), 'diff');
    seg($('#seg-format'), Object.entries(FORMATS).map(([k, v]) => [k, v.label]), 'format');
    refreshSelect();
  }
  function refreshSelect() {
    document.querySelectorAll('[data-player]').forEach((c) => c.classList.toggle('sel', c.dataset.player === opt.player));
    document.querySelectorAll('#seg-diff [data-val]').forEach((b) => b.classList.toggle('on', b.dataset.val === opt.diff));
    document.querySelectorAll('#seg-format [data-val]').forEach((b) => b.classList.toggle('on', b.dataset.val === opt.format));
  }

  // Navigation au clavier / à la manette dans les menus.
  function navigate(inp) {
    const host = $('#' + screen); if (!host) return;
    const items = [...host.querySelectorAll('[data-nav]')].filter((e) => e.offsetParent !== null);
    if (!items.length) return;
    const step = inp.navX + inp.navY;
    let i = items.indexOf(document.activeElement);
    if (step) { i = i < 0 ? 0 : (i + (step > 0 ? 1 : -1) + items.length) % items.length; items[i].focus(); Au.ui(); }
    if (inp.hit && i >= 0) items[i].click();
  }

  // ---------- HUD ----------
  function updateScore() {
    const m = game.match, lab = S.pointLabels(m), srv = S.currentServer(m), n = names();
    $('#score').innerHTML = [0, 1].map((i) => {
      const sets = m.sets.map((s) => `<span class="st${s.games[i] > s.games[1 - i] ? ' won' : ''}">${s.games[i]}</span>`).join('');
      return `<div class="row"><span class="srv">${srv === i && !m.over ? '●' : ''}</span><span class="nm">${n[i]}</span>${sets}<span class="gm">${m.games[i]}</span><span class="pt">${lab[i]}</span></div>`;
    }).join('');
  }
  function chips() {
    const m = game.match, out = [];
    if (m.tiebreak) out.push(['Tie-break', false]);
    if (game.phase === 'ready' || game.phase === 'toss') {
      const srv = game.server, st = [S.pointStakes(m, 0), S.pointStakes(m, 1)];
      const best = st.includes('match') ? 'Balle de match' : st.includes('set') ? 'Balle de set' : st[1 - srv] === 'game' && !m.tiebreak ? 'Balle de break' : '';
      if (best) out.push([best, true]);
      if (game.serveNo === 2) out.push(['2e service', false]);
    }
    if (speedT > 0) out.push([Math.round(serveSpeed) + ' km/h', false]);
    const html = out.map(([t, hot]) => `<div class="chip${hot ? ' hot' : ''}">${t}</div>`).join('');
    if (html !== chipsHtml) $('#chips').innerHTML = chipsHtml = html;
  }
  function banner(main, sub, secs) {
    $('#banner-main').textContent = main; $('#banner-sub').textContent = sub || '';
    $('#banner').classList.add('on'); bannerT = secs || 1.6;
  }
  function hint() {
    let t = '';
    const pad = A.Input.device() === 'manette';
    if (human >= 0 && game.server === human) {
      if (game.phase === 'ready') t = pad ? 'A : lancer la balle  ·  ←/→ : se placer' : 'Espace : lancer la balle  ·  ←/→ : se placer';
      else if (game.phase === 'toss') t = pad ? 'A au sommet : service à plat  ·  B : service sécurisé  ·  ←/→ : viser' : 'Espace au sommet : service à plat  ·  C : service sécurisé  ·  ←/→ : viser';
    }
    if (t !== hintText) $('#hint').textContent = hintText = t;
  }

  const REASON = { ace: 'ACE !', double: 'DOUBLE FAUTE', out: 'OUT !', net: 'FILET !' };
  function onEvent(e) {
    renderer.onEvent(e, game);
    if (human < 0) return; // démo : pas de son ni de HUD
    const n = names();
    switch (e.type) {
      case 'swing': Au.swing(); break;
      case 'hit': Au.hit(e.kind === 'smash' ? 1 : e.kind === 'drop' || e.kind === 'lob' ? 0.3 : 0.65); break;
      case 'serve': Au.hit(0.6 + e.q * 0.4); serveSpeed = e.speed * 3.6 * 1.25; speedT = 2.6; break;
      case 'bounce': if (e.v > 1.2) Au.bounce(e.v); break;
      case 'net': Au.net(); break;
      case 'fault': Au.call(); Au.ooh(); banner(e.why === 'net' ? 'FILET' : 'FAUTE', '2e service', 1.1); Au.say('Faute'); break;
      case 'ready': updateScore(); break;
      case 'point': {
        const who = n[e.winner], m = game.match;
        let sub = S.announce(m, n);
        if (e.ev.includes('match')) sub = 'Jeu, set et match ' + who;
        else if (e.ev.includes('set')) sub = 'Jeu et set ' + who;
        else if (e.ev.includes('tiebreak')) sub = 'Jeu ' + who + ' – tie-break';
        else if (e.ev.includes('game')) sub = 'Jeu ' + who;
        banner(REASON[e.reason] || (e.winner === human ? 'POINT GAGNANT !' : 'POINT ' + who.toUpperCase()), sub, e.ev.includes('game') ? 2.1 : 1.5);
        if (e.reason === 'out' || e.reason === 'net' || e.reason === 'double') { Au.call(); Au.ooh(); }
        const big = e.ev.includes('game') ? 0.4 : 0;
        Au.cheer((e.winner === human ? 0.8 : 0.5) + Math.min(0.5, e.rally / 20) + big);
        renderer.cheer = (e.winner === human ? 1 : 0.6) + big;
        setTimeout(() => Au.say(sub), 450);
        updateScore();
        break;
      }
      case 'match': endScreen(); break;
    }
  }

  function endScreen() {
    const m = game.match, n = names(), won = m.winner === human, s = game.stats;
    $('#end-kicker').textContent = 'Jeu, set et match ' + n[m.winner];
    $('#end-title').textContent = won ? 'Victoire !' : 'Défaite…';
    $('#end-score').textContent = m.sets.map((x) => x.games[0] + '-' + x.games[1] + (x.tb ? '(' + Math.min(x.tb[0], x.tb[1]) + ')' : '')).join('   ');
    const rows = [['Points gagnés', 'points'], ['Aces', 'aces'], ['Coups gagnants', 'winners'], ['Fautes', 'errors'], ['Doubles fautes', 'doubleFaults']];
    $('#end-stats').innerHTML = `<tr><th>${n[0]}</th><th></th><th>${n[1]}</th></tr>` + rows.map(([l, k]) => `<tr><td>${s[0][k]}</td><td>${l}</td><td>${s[1][k]}</td></tr>`).join('') +
      `<tr><td colspan="3">Plus long échange : ${game.longestRally} frappes</td></tr>`;
    Au.cheer(1.4); renderer.cheer = 1.4;
    show('end');
  }

  // ---------- Boucle ----------
  function frame(t) {
    requestAnimationFrame(frame);
    const dt = Math.min(0.1, (t - last) / 1000 || 0); last = t;
    const inp = A.Input.poll();
    if (screen === 'match') { if (inp.pause) { Au.ui(); show('pause'); } }
    else { if (inp.pause && screen === 'pause') show('match'); else if (inp.pause && screen === 'select') show('title'); else navigate(inp); }

    const running = screen === 'match' || screen === 'title' || screen === 'select';
    if (running) {
      acc += dt;
      let first = true;
      while (acc >= A.DT) {
        acc -= A.DT;
        const h = human >= 0 ? {
          mx: inp.mx, my: inp.my, aimX: inp.mx * (inp.analog ? 1 : 0.88), aimDepth: -inp.my,
          hit: first && inp.hit, lob: first && inp.lob, drop: first && inp.drop,
        } : ais[0].think(game, A.DT);
        game.step([h, ais[1].think(game, A.DT)]);
        first = false;
        if (game.events.length) { const evs = game.events.splice(0); evs.forEach(onEvent); }
        if (game.phase === 'done' && human < 0) { startDemo(); break; }
      }
      if (human >= 0) {
        if (bannerT > 0 && (bannerT -= dt) <= 0) $('#banner').classList.remove('on');
        if (speedT > 0) speedT -= dt;
        chips(); hint();
      }
    }
    renderer.draw(game, running ? dt : 0, human);
  }

  window.addEventListener('resize', () => renderer.resize());
  A.Input.attach();
  buildSelect();
  startDemo();
  show('title');
  requestAnimationFrame(frame);
  window.__agasso = { get game() { return game; }, opt }; // pour le débogage et les tests de bout en bout
})();
