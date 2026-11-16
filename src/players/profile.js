// Joueurs : transforme une fiche de données (content/players/*.js) en profil utilisable par le moteur.
//   profil = statistiques 1–10 + technique (archétype ⊕ surcharges du joueur) + comportement IA.
(function (root) {
  const A = root.Agasso, { clamp } = A, cache = {};

  function profile(id) {
    if (cache[id]) return cache[id];
    const def = A.need('player', id), arch = A.need('archetype', def.archetype || 'all-court');
    const stats = {};
    for (const [k] of A.STATS) stats[k] = clamp(def.stats && def.stats[k] != null ? def.stats[k] : A.BASE.pivot, 1, 10);
    return (cache[id] = Object.freeze({
      id, def, name: def.name, short: def.short || def.name, archetype: arch, stats: Object.freeze(stats),
      hand: def.hand === 'L' ? -1 : 1,
      tech: A.merge(A.merge(A.TECHNIQUE, arch.technique), def.technique),
      ai: A.merge(A.merge(A.BEHAVIOR, arch.ai), def.ai),
      temper: def.temper || 0,
    }));
  }

  const affinity = (p, venue) => clamp((p.def.surfaces && venue && p.def.surfaces[venue.surface]) || 0, -1, 1);

  // Attributs physiques du joueur sur un terrain donné (unités du moteur).
  function attrs(p, venue) {
    const B = A.BASE, E = A.STAT_EFFECT, k = (s) => p.stats[s] - B.pivot, aff = affinity(p, venue);
    const power = 1 + E.force * k('force'), move = (1 + E.speed * k('speed')) * (1 + 0.015 * aff), srv = 1 + E.serve * k('serve');
    return Object.freeze({
      speed: B.speed * move, accel: B.accel * move * p.tech.movement.accel,
      reach: B.reach * (1 + 0.01 * k('defense')), reachZ: B.reachZ,
      flat: B.flat * power, volley: B.volley * power, slice: B.slice * power, smash: B.smash * power, lob: B.lob, drop: B.drop,
      serve1: B.serve1 * srv, serve2: B.serve2 * (1 + E.serve * 0.5 * k('serve')),
      control: clamp((1 - E.technique * k('technique')) * (1 - E.surface * aff), 0.6, 1.7), // multiplie la dispersion
      serveControl: clamp(1 - 0.05 * k('serve'), 0.6, 1.5),
      defense: clamp(1 - E.defense * k('defense'), 0.5, 1.6), // multiplie les pénalités en bout de course
    });
  }

  // Note globale (sert au classement des têtes de série et aux matchs simulés du tableau).
  function rating(p, venue) {
    let s = 0; for (const [k] of A.STATS) s += p.stats[k];
    return s / A.STATS.length + affinity(p, venue) * 0.5;
  }

  A.Players = { profile, attrs, rating, affinity, ids: () => A.all('player').map((d) => d.id) };
})(typeof window !== 'undefined' ? window : globalThis);
