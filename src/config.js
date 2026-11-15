// Constantes partagées : terrain, statistiques, joueurs.
(function (root) {
  const A = (root.Agasso = root.Agasso || {});

  // Dimensions réelles d'un court de simple (mètres). x = largeur, y = longueur, z = hauteur.
  A.COURT = Object.freeze({
    halfW: 4.115, // demi-largeur simple
    halfL: 11.885, // demi-longueur
    service: 6.4, // distance filet -> ligne de service
    netH: 0.95,
    postX: 5.03,
    boundX: 9.5, // limites de déplacement des joueurs
    boundY: 15,
  });

  // Statistiques UNIQUES : les 4 joueurs pointent vers le même objet figé.
  // Seul le gameplay (placement, timing, choix de coup) fait la différence.
  // Dispersion des frappes : rMin (frappe parfaite) -> rMax (frappe ratée), pénalité en course.
  A.TUNE = Object.freeze({ rMin: 1.0, rMax: 2.3, runPen: 0.45 });
  A.STATS = Object.freeze({
    speed: 5.8, // m/s
    accel: 55, // m/s²
    reach: 2.1, // allonge horizontale (m)
    reachZ: 3.3, // hauteur max de frappe (m)
    flat: 34, // vitesse des coups à plat (m/s)
    volley: 27,
    lob: 11,
    drop: 13,
    smash: 38,
    serve1: 40,
    serve2: 31,
  });

  const mk = (id, name, look) => Object.freeze({ id, name, stats: A.STATS, look: Object.freeze(look) });
  A.PLAYERS = Object.freeze({
    eric: mk('eric', 'Eric', { shirt: '#2f7df6', shorts: '#f4f1ea', accent: '#0f3f9c', skin: '#e8b48c', hair: '#3b2a20', style: 'short' }),
    remi: mk('remi', 'Remi', { shirt: '#18b37a', shorts: '#16222b', accent: '#f4f1ea', skin: '#eac09a', hair: '#7a4a25', style: 'cap' }),
    corinne: mk('corinne', 'Corinne', { shirt: '#b455e0', shorts: '#f4f1ea', accent: '#ffd23f', skin: '#f0c7a6', hair: '#c98a2b', style: 'ponytail', skirt: true }),
    agasso: mk('agasso', 'Agasso', { shirt: '#e63946', shorts: '#15151a', accent: '#ffd23f', skin: '#dfa67e', hair: '#1d1d1f', style: 'headband' }),
  });
  A.SELECTABLE = Object.freeze(['eric', 'remi', 'corinne']);

  // La difficulté ne touche QUE le « cerveau » de l'IA (réaction, lucidité), jamais les stats.
  A.DIFFICULTY = Object.freeze({
    facile: { label: 'Facile', reaction: 0.42, smart: 0.4, sloppy: 0.75, serveJitter: 0.13, lapse: 0.13 },
    normal: { label: 'Normal', reaction: 0.3, smart: 0.65, sloppy: 0.42, serveJitter: 0.09, lapse: 0.08 },
    difficile: { label: 'Difficile', reaction: 0.17, smart: 0.9, sloppy: 0.15, serveJitter: 0.05, lapse: 0.03 },
  });

  // Tournois : la surface change le rebond (pour les deux joueurs à l'identique) et tout le décor.
  //   rest = hauteur de rebond conservée, keep = vitesse horizontale conservée.
  A.VENUES = Object.freeze({
    rg: Object.freeze({
      id: 'rg', name: 'Roland-Garros', city: 'Paris', surface: 'Terre battue', rest: 0.74, keep: 0.76, whites: false,
      court: '#c9643b', courtDark: '#b5552d', courtLight: '#d97a4f', wall: '#0d4a37', wallDark: '#093527', trim: '#e2553a',
      seat: '#2b5a4c', dust: '226,150,105', mark: '120,48,18', sky: ['#4f9fe0', '#cfe6f5'], parasol: '#f4efe6', roof: '#e9ecef',
      accent: '#e2703a', accentDeep: '#b4481c', kick: '#ffd9c2',
    }),
    wim: Object.freeze({
      id: 'wim', name: 'Wimbledon', city: 'Londres', surface: 'Gazon', rest: 0.64, keep: 0.85, whites: true,
      court: '#4d8f3b', courtDark: '#427f32', courtLight: '#5c9c47', wall: '#143c2b', wallDark: '#0c2a1e', trim: '#7a4bb5',
      seat: '#1f4b37', dust: '214,226,170', mark: null, sky: ['#6fa9d8', '#e3ecf1'], parasol: '#1d5a3c', roof: '#dfe5e2',
      accent: '#7a4bb5', accentDeep: '#45246e', kick: '#e2d3f7',
    }),
  });

  A.G = 9.81;
  A.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  A.lerp = (a, b, t) => a + (b - a) * t;
})(typeof window !== 'undefined' ? window : globalThis);
