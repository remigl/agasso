// Tournoi à élimination directe : tirage, têtes de série, progression, matchs simulés des autres joueurs.
// Logique pure (pas de DOM) ; l'état est un simple objet sérialisable, donc sauvegardable tel quel.
(function (root) {
  const A = root.Agasso;

  function seedOrder(n) { let o = [1, 2]; while (o.length < n) { const m = o.length * 2 + 1, nx = []; for (const s of o) nx.push(s, m - s); o = nx; } return o; }

  // Nouveau tournoi pour `playerId`. Renvoie l'état initial.
  function create(tid, playerId, rng) {
    const def = A.need('tournament', tid), venue = A.Venues.get(def.venue), r = rng || Math.random;
    const pool = (def.field === 'all' ? A.Players.ids() : def.field.slice()).filter((id) => id !== playerId);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const field = [playerId].concat(pool.slice(0, def.drawSize - 1));
    const rate = (id) => A.Players.rating(A.Players.profile(id), venue);
    const ranked = field.slice().sort((a, b) => rate(b) - rate(a) || a.localeCompare(b));
    const seeds = {}; ranked.forEach((id, i) => (seeds[id] = i + 1));
    const order = seedOrder(def.drawSize), first = [];
    for (let i = 0; i < order.length; i += 2) first.push({ a: ranked[order[i] - 1], b: ranked[order[i + 1] - 1], w: null, score: '' });
    return { tid, playerId, round: 0, status: 'active', rounds: [first], seeds };
  }

  const defOf = (st) => A.need('tournament', st.tid);
  const formatOf = (st, r) => A.FORMATS[(defOf(st).rounds[r] || {}).format] || A.FORMATS.express;
  const roundName = (st, r) => (defOf(st).rounds[r] || {}).name || 'Tour ' + (r + 1);

  // Prochain match du joueur : { match, round, roundName, format, opponent } ou null si le tournoi est fini pour lui.
  function current(st) {
    if (st.status !== 'active') return null;
    const match = st.rounds[st.round].find((m) => m.a === st.playerId || m.b === st.playerId);
    return { match, round: st.round, roundName: roundName(st, st.round), format: formatOf(st, st.round), opponent: match.a === st.playerId ? match.b : match.a, isFinal: st.rounds[st.round].length === 1 };
  }

  // Match entre deux joueurs non humains : tiré selon l'écart de niveau sur cette surface.
  function quickSim(a, b, venue, fmt, rng) {
    const ra = A.Players.rating(A.Players.profile(a), venue), rb = A.Players.rating(A.Players.profile(b), venue);
    const p = 1 / (1 + Math.pow(10, (rb - ra) / 2.2)), wA = rng() < p, g = fmt.gamesToSet, sets = [];
    let sw = 0, sl = 0;
    while (sw < fmt.setsToWin) {
      const lost = sl < fmt.setsToWin - 1 && rng() < 0.28; // le vaincu prend parfois un set
      const k = rng(), los = k < 0.15 ? g : k < 0.3 ? g - 1 : Math.floor(rng() * (g - 1)), win = los >= g - 1 ? g + 1 : g;
      const s = lost ? [los, win] : [win, los];
      sets.push(wA ? s[0] + '-' + s[1] : s[1] + '-' + s[0]);
      if (lost) sl++; else sw++;
    }
    return { winner: wA ? a : b, score: sets.join(' ') };
  }

  function advance(st, rng) {
    const def = defOf(st), venue = A.Venues.get(def.venue), round = st.rounds[st.round];
    for (const m of round) if (!m.w) { const q = quickSim(m.a, m.b, venue, formatOf(st, st.round), rng); m.w = q.winner; m.score = q.score; }
    if (round.length === 1) return false;
    const next = [];
    for (let i = 0; i < round.length; i += 2) next.push({ a: round[i].w, b: round[i + 1].w, w: null, score: '' });
    st.rounds.push(next); st.round++;
    return true;
  }

  // Enregistre le résultat du match du joueur, simule les autres rencontres du tour et avance le tableau.
  function report(st, playerWon, score, rng) {
    const r = rng || Math.random, cur = current(st);
    if (!cur) return st;
    cur.match.w = playerWon ? st.playerId : cur.opponent; cur.match.score = score || '';
    if (!playerWon) { st.status = 'out'; while (advance(st, r)); return st; } // le tournoi continue sans lui
    if (!advance(st, r)) st.status = 'champion';
    return st;
  }

  const champion = (st) => { const f = st.rounds[st.rounds.length - 1]; return f.length === 1 ? f[0].w : null; };

  A.Tournament = { create, current, report, quickSim, roundName, formatOf, champion, seedOrder };
})(typeof window !== 'undefined' ? window : globalThis);
