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
    boundY: 15.5,
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
    eric: mk('eric', 'Eric', { shirt: '#2f7df6', shorts: '#f4f1ea', skin: '#e8b48c', hair: '#3b2a20', style: 'short' }),
    remi: mk('remi', 'Remi', { shirt: '#18b37a', shorts: '#16222b', skin: '#eac09a', hair: '#7a4a25', style: 'cap' }),
    corinne: mk('corinne', 'Corinne', { shirt: '#b455e0', shorts: '#f4f1ea', skin: '#f0c7a6', hair: '#c98a2b', style: 'ponytail' }),
    agasso: mk('agasso', 'Agasso', { shirt: '#e63946', shorts: '#15151a', skin: '#dfa67e', hair: '#1d1d1f', style: 'headband' }),
  });
  A.SELECTABLE = Object.freeze(['eric', 'remi', 'corinne']);

  // La difficulté ne touche QUE le « cerveau » de l'IA (réaction, lucidité), jamais les stats.
  A.DIFFICULTY = Object.freeze({
    facile: { label: 'Facile', reaction: 0.42, smart: 0.4, sloppy: 0.75, serveJitter: 0.13, lapse: 0.13 },
    normal: { label: 'Normal', reaction: 0.3, smart: 0.65, sloppy: 0.42, serveJitter: 0.09, lapse: 0.08 },
    difficile: { label: 'Difficile', reaction: 0.17, smart: 0.9, sloppy: 0.15, serveJitter: 0.05, lapse: 0.03 },
  });

  A.G = 9.81;
  A.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  A.lerp = (a, b, t) => a + (b - a) * t;
})(typeof window !== 'undefined' ? window : globalThis);
