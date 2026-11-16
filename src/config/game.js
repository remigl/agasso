// Configuration du moteur : dimensions, réglages d'équilibrage, formats, difficulté.
// Aucun contenu ici (joueurs, terrains… vivent dans content/).
(function (root) {
  const A = root.Agasso;

  // Court de simple (mètres). x = largeur, y = longueur, z = hauteur.
  A.COURT = Object.freeze({ halfW: 4.115, halfL: 11.885, service: 6.4, postX: 5.03, boundX: 9.5, boundY: 15 });
  A.G = 9.81;

  // Attributs physiques d'un joueur dont toutes les statistiques valent `pivot` (8/10).
  A.BASE = Object.freeze({
    pivot: 8,
    speed: 5.8, accel: 55, reach: 2.1, reachZ: 3.3,
    flat: 34, volley: 24, slice: 27, lob: 11, drop: 13, smash: 38, serve1: 40, serve2: 31,
  });

  // Effet d'un point de statistique (1–10) au-dessus ou en dessous du pivot.
  // Volontairement modéré : le placement, le timing et la situation du point restent décisifs.
  A.STAT_EFFECT = Object.freeze({
    force: 0.008, // vitesse de balle des frappes
    speed: 0.007, // vitesse de déplacement et accélération
    technique: 0.013, // réduction de la dispersion
    serve: 0.01, // vitesse et précision du service
    defense: 0.02, // frappes en bout de course moins pénalisées
    mental: 0.03, // dispersion sur les points importants, résistance à l'agacement
    surface: 0.04, // affinité avec la surface (−1…+1)
  });

  // Dispersion des frappes : rMin (frappe parfaite) → rMax (frappe ratée), pénalités.
  //   signature = poids des techniques individuelles (0 = tous identiques, 1 = valeurs brutes des fiches).
  A.TUNE = Object.freeze({ rMin: 1.0, rMax: 2.3, runPen: 0.45, stretchPen: 0.55, timingPen: 0.25, signature: 0.4 });

  A.STATS = Object.freeze([
    ['force', 'Force'], ['speed', 'Rapidité'], ['technique', 'Technique'],
    ['mental', 'Mental'], ['serve', 'Service'], ['defense', 'Défense'],
  ]);

  // Technique par défaut : les archétypes puis les joueurs la surchargent (fusion profonde).
  //   pace = vitesse de balle, spin = effet (−1 slice … +1 lift), margin = dispersion (plus petit = plus précis).
  A.TECHNIQUE = Object.freeze({
    forehand: { pace: 1, spin: 0, margin: 1 },
    backhand: { pace: 1, spin: 0, margin: 1, hands: 2 },
    serve: { pace: 1, spin: 0, margin: 1 },
    return: { pace: 1, margin: 1 },
    volley: { pace: 1, margin: 1 },
    smash: { pace: 1, margin: 1 },
    lob: { margin: 1 },
    slice: { pace: 1, margin: 1 },
    drop: { margin: 1 },
    early: 0, // 0…1 : prend la balle tôt (bonus de vitesse en demi-volée montante)
    movement: { accel: 1, style: 'neutral' },
    prep: 'classic',
  });

  // Comportement IA par défaut (0…1), surchargé de la même façon.
  A.BEHAVIOR = Object.freeze({
    aggression: 0.6, // vise le côté ouvert plutôt que le centre
    risk: 0.5, // vise près des lignes
    netRush: 0.03, // monte au filet après une bonne frappe
    serveVolley: 0, // suit son service au filet
    lob: 0.5, // lobe un adversaire au filet
    drop: 0.12, // amortie quand l'adversaire est loin
    slice: 0.08, // varie en slice
    depth: 0.9, // position d'attente derrière la ligne de fond (m)
    returnDepth: 0.8, // position de retour derrière la ligne de fond (m)
  });

  // La difficulté ne touche que le « cerveau » de l'IA, jamais les statistiques.
  A.DIFFICULTY = Object.freeze({
    facile: { label: 'Facile', reaction: 0.42, smart: 0.4, sloppy: 0.75, serveJitter: 0.13, lapse: 0.13 },
    normal: { label: 'Normal', reaction: 0.3, smart: 0.65, sloppy: 0.42, serveJitter: 0.09, lapse: 0.08 },
    difficile: { label: 'Difficile', reaction: 0.17, smart: 0.9, sloppy: 0.15, serveJitter: 0.05, lapse: 0.03 },
  });

  A.FORMATS = Object.freeze({
    express: { label: 'Express (4 jeux)', setsToWin: 1, gamesToSet: 4 },
    set1: { label: '1 set', setsToWin: 1, gamesToSet: 6 },
    bo3: { label: '3 sets', setsToWin: 2, gamesToSet: 6 },
    bo5: { label: '5 sets', setsToWin: 3, gamesToSet: 6 },
  });
})(typeof window !== 'undefined' ? window : globalThis);
