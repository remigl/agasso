// Application : déroulé des écrans, boucle de jeu, liaison gameplay ↔ rendu ↔ son ↔ interface.
(function () {
  const A = window.Agasso, S = A.Scoring, UI = A.UI, Sfx = A.Sfx, Set = A.Settings, Store = A.Store, T = A.Tournament;
  const renderer = new A.Renderer(document.querySelector('#game'));
  const desktop = /Electron/i.test(navigator.userAgent);
  const app = { mode: 'amical', step: 'player', player: Store.get('player', 'remi'), opponent: 'agasso', venue: A.Venues.ids()[0], format: 'express', tid: null, tour: Store.get('tournament', null), optionsFrom: 'title' };
  if (!A.get('player', app.player)) app.player = 'remi';
  if (A.get('venue', Store.get('venue', ''))) app.venue = Store.get('venue');
  if (app.tour && !A.get('tournament', app.tour.tid)) app.tour = null;
  let game = null, ais = [null, null], human = -1, cele = null, live = null; // live = paramètres du match en cours
  let last = 0, acc = 0, slowT = 0, speedT = 0, serveSpeed = 0, headline = '', cheerT = 0;

  const venue = () => A.Venues.get(app.venue);
  const music = (role) => { const m = A.all('music').find((x) => x.role === role); if (m && +Set.get('music') > 0) A.Music.play(m.id); else A.Music.stop(); };

  function applySettings() {
    renderer.configure({ camera: Set.get('camera'), scale: A.RENDER_SCALE[Set.get('quality')] || 1 });
    A.AudioEngine.setVolume('sfx', +Set.get('sfx')); A.Music.setVolume(+Set.get('music')); Sfx.setVoice(Set.get('voice') === 'on');
    if (+Set.get('music') === 0) A.Music.stop();
  }
  function setVenue(id) { app.venue = id; renderer.setVenue(id); UI.theme(venue()); Sfx.setCrowd(venue().crowd); }

  // ---------- Parties ----------
  function startDemo() { // match IA contre IA en fond de menu
    const ids = A.Players.ids().sort(() => Math.random() - 0.5);
    game = new A.Game({ players: ids.slice(0, 2), setsToWin: 3, venue: app.venue });
    ais = [new A.AI(0, 'difficile'), new A.AI(1, 'difficile')]; human = -1; cele = null; renderer.vfx.clear();
  }
  function startMatch(o) {
    live = o; setVenue(o.venue);
    game = new A.Game({ players: o.players, setsToWin: o.format.setsToWin, gamesToSet: o.format.gamesToSet, firstServer: 0, venue: o.venue });
    ais = [null, new A.AI(1, Set.get('difficulty'))]; human = 0; cele = null; acc = 0; slowT = 0; headline = o.headline;
    renderer.vfx.clear();
    A.AudioEngine.init(); A.Music.stop(0.8); Sfx.ambience(true); Sfx.cheer(1);
    UI.show('match'); UI.hud.score(game, headline);
    UI.hud.banner(venue().name.toUpperCase(), names().join(' – '), 2.4);
  }
  const names = () => game.players.map((p) => p.profile.short);
  function leaveMatch() { Sfx.ambience(false); startDemo(); music('menu'); }

  // ---------- Écrans ----------
  function goTitle() { if (human >= 0 || cele) leaveMatch(); UI.title({ kicker: venue().name + ' · ' + venue().surfaceLabel + ' · ' + venue().city + ' 2026', desktop }); UI.show('title'); music('menu'); }
  function openSelect() {
    const me = app.step === 'player';
    UI.select({ kicker: app.mode === 'tournoi' ? A.need('tournament', app.tid).name : 'Match amical', title: me ? 'Choisis ton joueur' : 'Choisis ton adversaire', selected: me ? app.player : app.opponent, exclude: me ? null : app.player, venue: venue() });
    UI.show('select');
  }
  function openSetup() { UI.setup({ player: app.player, opponent: app.opponent, venue: venue(), format: app.format }); UI.show('setup'); }
  function openBracket() { if (human >= 0 || cele) leaveMatch(); setVenue(A.need('tournament', app.tour.tid).venue); UI.bracket(app.tour); UI.show('bracket'); }
  function saveTour() { Store.set('tournament', app.tour); }

  const actions = {
    home: goTitle,
    quit() { window.close(); },
    friendly() { if (human >= 0 || cele) leaveMatch(); app.mode = 'amical'; app.step = 'player'; openSelect(); },
    tournaments() { if (human >= 0 || cele) leaveMatch(); UI.tournaments({ save: app.tour }); UI.show('tournaments'); },
    'tour-new'(d) { app.mode = 'tournoi'; app.tid = d.id; app.step = 'player'; setVenue(A.need('tournament', d.id).venue); startDemo(); openSelect(); },
    'tour-continue'() { app.mode = 'tournoi'; openBracket(); },
    'tour-next'() { openBracket(); },
    'tour-play'() {
      const cur = T.current(app.tour), def = A.need('tournament', app.tour.tid);
      startMatch({ players: [app.tour.playerId, cur.opponent], venue: def.venue, format: cur.format, headline: def.name + ' · ' + cur.roundName });
    },
    pick(d) { UI.pick(d.id); },
    filter(d) { UI.setFilter(d.val); },
    confirm() {
      if (app.step === 'player') {
        app.player = UI.picked; Store.set('player', app.player);
        if (app.mode === 'tournoi') { app.tour = T.create(app.tid, app.player); saveTour(); openBracket(); }
        else { app.step = 'opponent'; if (app.opponent === app.player) app.opponent = 'agasso'; openSelect(); }
      } else { app.opponent = UI.picked; openSetup(); }
    },
    back() {
      const s = UI.screen;
      if (s === 'options') return app.optionsFrom === 'pause' ? (UI.pause(), UI.show('pause')) : goTitle();
      if (s === 'setup') { app.step = 'opponent'; return openSelect(); }
      if (s === 'select' && app.step === 'opponent') { app.step = 'player'; return openSelect(); }
      if (s === 'select' && app.mode === 'tournoi') return actions.tournaments();
      if (s === 'pause') return actions.resume();
      goTitle();
    },
    'set-venue'(d) { setVenue(d.val); Store.set('venue', d.val); startDemo(); openSetup(); const b = document.querySelector(`.s-setup [data-act="set-venue"][data-val="${d.val}"]`); if (b) b.focus({ preventScroll: true }); },
    'set-format'(d) { app.format = d.val; openSetup(); },
    start() { startMatch({ players: [app.player, app.opponent], venue: app.venue, format: A.FORMATS[app.format], headline: venue().name + ' · Match amical' }); },
    options() { app.optionsFrom = UI.screen === 'pause' ? 'pause' : 'title'; UI.options(); UI.show('options'); },
    setting(d) {
      Set.set(d.key, d.val); applySettings(); UI.options(); UI.show('options');
      const b = document.querySelector(`.s-options [data-key="${d.key}"][data-val="${d.val}"]`); if (b) b.focus();
      if (app.optionsFrom !== 'pause') music('menu');
    },
    resume() { UI.show('match'); },
    restart() { startMatch(live); },
    forfeit() { if (app.mode === 'tournoi' && human >= 0) { T.report(app.tour, false, 'abandon'); saveTour(); openBracket(); } else goTitle(); },
  };
  function act(name, data) { A.AudioEngine.init(); Sfx.ui(); if (actions[name]) actions[name](data || {}); }

  // ---------- Habillage du match ----------
  function chips() {
    const m = game.match, out = [];
    if (m.tiebreak) out.push(['Tie-break', false]);
    if (game.phase === 'ready' || game.phase === 'toss') {
      const st = [S.pointStakes(m, 0), S.pointStakes(m, 1)];
      const best = st.includes('match') ? 'Balle de match' : st.includes('set') ? 'Balle de set' : st[1 - game.server] === 'game' && !m.tiebreak ? 'Balle de break' : '';
      if (best) out.push([best, true]);
      if (game.serveNo === 2) out.push(['2e service', false]);
    }
    if (speedT > 0) out.push([Math.round(serveSpeed) + ' km/h', false]);
    UI.hud.chips(out);
  }
  function hint() {
    let t = '';
    const pad = A.Input.device() === 'manette';
    if (game.server === human && game.phase === 'ready') t = (pad ? 'A' : 'Espace') + ' : lancer la balle  ·  ←/→ : se placer';
    else if (game.server === human && game.phase === 'toss') t = pad ? 'A au sommet : première balle  ·  B : service lifté  ·  ←/→ : viser' : 'Espace au sommet : première balle  ·  C : service lifté  ·  ←/→ : viser';
    UI.hud.hint(t);
  }

  const REASON = { ace: 'ACE', double: 'DOUBLE FAUTE', out: 'FAUTE', net: 'FILET' };
  function onEvent(e) {
    renderer.onEvent(e);
    if (human < 0) return; // démo : ni son ni habillage
    const n = names();
    switch (e.type) {
      case 'swing': Sfx.swing(); break;
      case 'hit': Sfx.hit(e.kind === 'smash' ? 1 : e.kind === 'drop' || e.kind === 'lob' || e.kind === 'slice' ? 0.35 : 0.65); if (e.by === human && e.q > 0.92) renderer.vfx.pop('PARFAIT', e.x, e.y, e.z + 0.8, '#bfeecb'); break;
      case 'serve': Sfx.hit(0.6 + e.q * 0.4); serveSpeed = e.speed * 3.6 * 1.25; speedT = 2.6; break;
      case 'bounce': if (e.v > 1.2) Sfx.bounce(e.v); break;
      case 'net': Sfx.net(); break;
      case 'fault': Sfx.call(); Sfx.ooh(); UI.hud.banner(e.why === 'net' ? 'FILET' : 'FAUTE', '2e service', 1.1); Sfx.say('Faute'); break;
      case 'ready': UI.hud.score(game, headline); break;
      case 'point': {
        const who = n[e.winner], end = e.ev.includes('match');
        let sub = S.announce(game.match, n);
        if (end) sub = 'Jeu, set et match ' + who;
        else if (e.ev.includes('set')) sub = 'Jeu et set ' + who;
        else if (e.ev.includes('tiebreak')) sub = 'Jeu ' + who + ' – tie-break';
        else if (e.ev.includes('game')) sub = 'Jeu ' + who;
        UI.hud.banner(REASON[e.reason] || 'POINT ' + who.toUpperCase(), sub, e.ev.includes('game') ? 2.1 : 1.5);
        if (e.reason === 'out' || e.reason === 'net' || e.reason === 'double') { Sfx.call(); Sfx.ooh(); }
        const big = end ? 0.8 : e.ev.includes('game') ? 0.4 : 0;
        Sfx.cheer((e.winner === human ? 0.8 : 0.5) + Math.min(0.5, e.rally / 20) + big);
        renderer.cheer = (e.winner === human ? 1 : 0.6) + big;
        setTimeout(() => Sfx.say(sub), 450);
        if (end) slowT = 1.5; // ralenti sur la balle de match
        UI.hud.score(game, headline);
        break;
      }
      case 'match': celebrate(); break;
    }
  }

  // ---------- Fin de match : ralenti, plan sur le vainqueur, public, musique, score ----------
  function celebrate() {
    const m = game.match, w = m.winner, won = w === human, n = names(), k = venue().look;
    const score = m.sets.map((x) => x.games[0] + '-' + x.games[1]).join(' ');
    cele = { winner: w, t: 0 }; cheerT = 0;
    Sfx.ambience(false); music('victory'); Sfx.cheer(1.6); renderer.cheer = 1.6;
    renderer.vfx.burstConfetti(renderer.W, [k.accent, '#f4f2ec', '#e8c65a', k.accentDeep]);
    const o = { game, kicker: 'Jeu, set et match', title: game.players[w].profile.name, sub: '', buttons: [['Menu', 'home'], ['Changer de joueurs', 'friendly'], ['Revanche', 'restart', true]] };
    if (app.mode === 'tournoi') {
      const def = A.need('tournament', app.tour.tid), round = T.roundName(app.tour, app.tour.round);
      T.report(app.tour, won, score); saveTour();
      const next = T.current(app.tour);
      if (app.tour.status === 'champion') { o.champion = true; o.kicker = 'Champion · ' + def.name + ' 2026'; o.sub = def.trophy + ' remise à ' + game.players[w].profile.name; renderer.vfx.burstConfetti(renderer.W, ['#e8c65a', '#f4f2ec', k.accent]); }
      else o.sub = won ? 'Qualifié pour : ' + next.roundName : 'Éliminé en ' + round.toLowerCase();
      o.buttons = [[won && next ? 'Continuer vers ' + next.roundName.toLowerCase() : 'Voir le tableau', 'tour-next', true]];
    } else o.sub = (A.get('celebration', game.players[w].def.celebration) || {}).label || '';
    UI.celebration(o);
    setTimeout(() => { if (cele) UI.show('celebration'); }, 1900);
  }

  // ---------- Boucle ----------
  function frame(t) {
    requestAnimationFrame(frame);
    const real = Math.min(0.1, (t - last) / 1000 || 0); last = t;
    const inp = A.Input.poll(), scr = UI.screen;
    if (scr === 'match') { if (inp.pause && !cele) { Sfx.ui(); UI.pause(); UI.show('pause'); } }
    else if (inp.pause && scr !== 'title' && scr !== 'celebration') act('back');
    else UI.navigate(inp);

    const frozen = UI.screen === 'pause' || (UI.screen === 'options' && app.optionsFrom === 'pause');
    let dt = frozen ? 0 : real;
    if (slowT > 0) { slowT -= real; dt *= 0.3; }
    if (!frozen) {
      acc += dt;
      let first = true;
      while (acc >= A.DT) {
        acc -= A.DT;
        const h = human >= 0 ? { mx: inp.mx, my: inp.my, aimX: inp.mx * (inp.analog ? 1 : 0.88), aimDepth: -inp.my, hit: first && inp.hit, lob: first && inp.lob, drop: first && inp.drop, slice: first && inp.slice } : ais[0].think(game, A.DT);
        game.step([h, ais[1].think(game, A.DT)]);
        first = false;
        if (game.events.length) game.events.splice(0).forEach(onEvent);
        if (game.phase === 'done' && human < 0) { startDemo(); break; }
      }
      if (human >= 0 && !cele) { UI.hud.tick(real); if (speedT > 0) speedT -= real; chips(); hint(); }
      if (cele) { cele.t += real; if ((cheerT += real) > 2.4) { cheerT = 0; Sfx.cheer(1); renderer.cheer = 1.2; } }
    }
    renderer.draw(game, dt, { human, celebration: cele });
  }

  window.addEventListener('resize', () => renderer.resize());
  const wake = () => { A.AudioEngine.init(); if (UI.screen !== 'match' && !cele && !A.Music.current()) music('menu'); };
  window.addEventListener('pointerdown', wake); window.addEventListener('keydown', wake);
  if (desktop) document.body.classList.add('is-desktop');
  A.Input.attach();
  UI.init({ act });
  applySettings(); setVenue(app.venue);
  startDemo(); goTitle();
  if (desktop) wake();
  requestAnimationFrame(frame);
  window.__agasso = { get game() { return game; }, app }; // pour le débogage et les tests de bout en bout
})();
