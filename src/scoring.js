// Score réel de tennis : points, jeux, sets, tie-break (7 pts, 10 pts au set décisif).
(function (root) {
  const A = (root.Agasso = root.Agasso || {});
  const LABELS = ['0', '15', '30', '40'];

  function createMatch(opts) {
    const o = opts || {};
    return {
      setsToWin: o.setsToWin || 2,
      gamesToSet: o.gamesToSet || 6, // 4 = format express
      server: o.firstServer || 0, // 0 = joueur, 1 = Agasso
      points: [0, 0],
      games: [0, 0],
      setsWon: [0, 0],
      sets: [], // sets terminés : {games:[a,b], tb:[a,b]|null}
      tiebreak: false,
      tbFirstServer: 0,
      over: false,
      winner: -1,
    };
  }

  const isDecidingSet = (m) => m.setsWon[0] + m.setsWon[1] === 2 * m.setsToWin - 2;
  const tbTarget = (m) => (isDecidingSet(m) ? 10 : 7);

  // Côté du service : true = égalité (droite), false = avantage (gauche).
  const isDeuceSide = (m) => (m.points[0] + m.points[1]) % 2 === 0;

  function currentServer(m) {
    if (!m.tiebreak) return m.server;
    const n = m.points[0] + m.points[1];
    return Math.floor((n + 1) / 2) % 2 === 0 ? m.tbFirstServer : 1 - m.tbFirstServer;
  }

  function pointLabels(m) {
    const [a, b] = m.points;
    if (m.tiebreak) return [String(a), String(b)];
    if (a >= 3 && b >= 3) {
      if (a === b) return ['40', '40'];
      return a > b ? ['AV', ''] : ['', 'AV'];
    }
    return [LABELS[a], LABELS[b]];
  }

  function winSet(m, who, tb) {
    m.sets.push({ games: m.games.slice(), tb: tb });
    m.setsWon[who]++;
    m.games = [0, 0];
    if (m.setsWon[who] >= m.setsToWin) {
      m.over = true;
      m.winner = who;
      return ['set', 'match'];
    }
    return ['set'];
  }

  // Attribue un point ; renvoie les événements : 'point' | 'game' | 'set' | 'match' | 'tiebreak'.
  function pointWon(m, who) {
    if (m.over) return [];
    const other = 1 - who;
    m.points[who]++;
    if (m.tiebreak) {
      if (m.points[who] >= tbTarget(m) && m.points[who] - m.points[other] >= 2) {
        const tb = m.points.slice();
        m.points = [0, 0];
        m.games[who]++;
        m.tiebreak = false;
        m.server = 1 - m.tbFirstServer;
        return ['game'].concat(winSet(m, who, tb));
      }
      return ['point'];
    }
    if (m.points[who] >= 4 && m.points[who] - m.points[other] >= 2) {
      m.points = [0, 0];
      m.games[who]++;
      m.server = 1 - m.server;
      const g = m.games;
      if (g[who] >= m.gamesToSet && g[who] - g[other] >= 2) return ['game'].concat(winSet(m, who, null));
      if (g[0] === m.gamesToSet && g[1] === m.gamesToSet) {
        m.tiebreak = true;
        m.tbFirstServer = m.server;
        return ['game', 'tiebreak'];
      }
      return ['game'];
    }
    return ['point'];
  }

  // Balle de jeu / set / match pour `who` ?
  function pointStakes(m, who) {
    const c = JSON.parse(JSON.stringify(m));
    const ev = pointWon(c, who);
    return ev.includes('match') ? 'match' : ev.includes('set') ? 'set' : ev.includes('game') ? 'game' : '';
  }

  const FR = { 0: 'zéro', 15: 'quinze', 30: 'trente', 40: 'quarante' };
  // Annonce de l'arbitre, score du serveur en premier.
  function announce(m, names) {
    const [a, b] = m.points;
    if (m.tiebreak) {
      if (a === b) return a + ' partout';
      return a > b ? a + ' – ' + b + ', ' + names[0] : b + ' – ' + a + ', ' + names[1];
    }
    if (a >= 3 && b >= 3) return a === b ? 'Égalité' : 'Avantage ' + names[a > b ? 0 : 1];
    const s = currentServer(m);
    const ls = LABELS[m.points[s]], lr = LABELS[m.points[1 - s]];
    if (ls === lr) return ls === '0' ? 'Zéro partout' : cap(FR[ls]) + ' A';
    return cap(FR[ls]) + ' – ' + FR[lr];
  }
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  A.Scoring = { createMatch, pointWon, pointLabels, currentServer, isDeuceSide, isDecidingSet, pointStakes, announce };
})(typeof window !== 'undefined' ? window : globalThis);
