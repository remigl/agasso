// FICHIER GÉNÉRÉ par tools/build-content.js — ne pas modifier à la main.

// --- archetypes/aggressive-returner.js
// Archétype de jeu : comportement IA + technique de base. Un joueur le référence et peut le surcharger.
Agasso.define('archetype', {
  id: 'aggressive-returner',
  order: 4,
  label: 'Relanceur agressif',
  desc: 'Prend la balle tôt, retourne dans les pieds, met une pression constante.',
  ai: { aggression: 0.8, risk: 0.5, netRush: 0.06, depth: 0.6, returnDepth: 0.4 },
  technique: {
    forehand: { pace: 1.02, margin: 0.95 },
    backhand: { pace: 1.02, margin: 0.92 },
    return: { pace: 1.08, margin: 0.8 },
    early: 0.7,
    movement: { style: 'compact' },
    prep: 'compact',
  },
});

// --- archetypes/all-court.js
// Archétype de jeu : comportement IA + technique de base. Un joueur le référence et peut le surcharger.
Agasso.define('archetype', {
  id: 'all-court',
  order: 0,
  label: 'Polyvalent',
  desc: 'À l\'aise partout : construit du fond, finit au filet quand l\'occasion se présente.',
  ai: { netRush: 0.1, slice: 0.12, aggression: 0.7 },
  technique: {},
});

// --- archetypes/baseline-defender.js
// Archétype de jeu : comportement IA + technique de base. Un joueur le référence et peut le surcharger.
Agasso.define('archetype', {
  id: 'baseline-defender',
  order: 1,
  label: 'Défenseur de fond de court',
  desc: 'Ramène tout, attend la faute, lobe et contre.',
  ai: { aggression: 0.45, risk: 0.25, netRush: 0.0, lob: 0.5, drop: 0.06, depth: 1.5, returnDepth: 1.6 },
  technique: {
    forehand: { pace: 0.96, spin: 0.45, margin: 0.93 },
    backhand: { pace: 0.95, spin: 0.35, margin: 0.93 },
    lob: { margin: 0.75 },
    movement: { accel: 1.05, style: 'grinder' },
  },
});

// --- archetypes/power-baseliner.js
// Archétype de jeu : comportement IA + technique de base. Un joueur le référence et peut le surcharger.
Agasso.define('archetype', {
  id: 'power-baseliner',
  order: 3,
  label: 'Cogneur de fond de court',
  desc: 'Dicte l\'échange à coups de frappes lourdes des deux côtés.',
  ai: { aggression: 0.8, risk: 0.5, netRush: 0.05, drop: 0.05, depth: 0.7 },
  technique: {
    forehand: { pace: 1.05, spin: 0.25, margin: 0.98 },
    backhand: { pace: 1.03, spin: 0.15, margin: 0.98 },
    serve: { pace: 1.03 },
    movement: { style: 'power' },
  },
});

// --- archetypes/power-server.js
// Archétype de jeu : comportement IA + technique de base. Un joueur le référence et peut le surcharger.
Agasso.define('archetype', {
  id: 'power-server',
  order: 6,
  label: 'Serveur-attaquant',
  desc: 'Service canon, première frappe lourde, finit vite au filet.',
  ai: { aggression: 0.8, risk: 0.48, netRush: 0.12, serveVolley: 0.4, depth: 0.7 },
  technique: {
    serve: { pace: 1.07, margin: 0.95 },
    forehand: { pace: 1.05, margin: 1.0 },
    volley: { margin: 0.85 },
    smash: { pace: 1.08 },
    movement: { accel: 1.05, style: 'explosive' },
  },
});

// --- archetypes/serve-volley.js
// Archétype de jeu : comportement IA + technique de base. Un joueur le référence et peut le surcharger.
Agasso.define('archetype', {
  id: 'serve-volley',
  order: 5,
  label: 'Serveur-volleyeur',
  desc: 'Sert et monte : écourte les points au filet.',
  ai: { aggression: 0.7, risk: 0.5, netRush: 0.18, serveVolley: 0.5, slice: 0.3, lob: 0.3, depth: 0.5 },
  technique: {
    serve: { pace: 1.03, margin: 0.9 },
    volley: { pace: 1.05, margin: 0.85 },
    smash: { pace: 1.05, margin: 0.85 },
    backhand: { hands: 1, spin: -0.2 },
    slice: { margin: 0.85 },
    movement: { style: 'forward' },
  },
});

// --- archetypes/tactician.js
// Archétype de jeu : comportement IA + technique de base. Un joueur le référence et peut le surcharger.
Agasso.define('archetype', {
  id: 'tactician',
  order: 7,
  label: 'Tacticienne',
  desc: 'Anticipe, varie les effets et les zones, fait jouer le coup de trop.',
  ai: { aggression: 0.75, risk: 0.5, netRush: 0.15, drop: 0.25, slice: 0.2, lob: 0.6, depth: 0.6 },
  technique: {
    forehand: { pace: 0.97, margin: 0.96 },
    backhand: { pace: 0.97, margin: 0.96 },
    drop: { margin: 0.7 },
    lob: { margin: 0.75 },
    slice: { margin: 0.8 },
    early: 0.4,
    movement: { style: 'glide' },
  },
});

// --- archetypes/topspin-grinder.js
// Archétype de jeu : comportement IA + technique de base. Un joueur le référence et peut le surcharger.
Agasso.define('archetype', {
  id: 'topspin-grinder',
  order: 2,
  label: 'Lifteur infatigable',
  desc: 'Lift très lourd qui repousse l\'adversaire, défense énorme, intensité constante.',
  ai: { aggression: 0.72, risk: 0.45, netRush: 0.02, lob: 0.4, depth: 1.2, returnDepth: 1.6 },
  technique: {
    forehand: { pace: 1.03, spin: 0.9, margin: 0.86 },
    backhand: { pace: 0.98, spin: 0.5, margin: 0.9 },
    serve: { spin: 0.5, margin: 0.9 },
    movement: { accel: 1.08, style: 'explosive' },
    prep: 'loop',
  },
});

// --- celebrations/arms-up.js
// Célébration : images clés (t de 0 à 1 sur `duration` s). hx/hz = main raquette, ox/oz = main libre, relatives à l'épaule.
Agasso.define('celebration', {
  id: 'arms-up',
  label: 'Bras levés',
  duration: 2.4,
  frames: [
    { t: 0, hx: 0.25, hz: -0.3, ox: 0.2, oz: -0.3 },
    { t: 0.2, hx: 0.2, hz: 0.62, ox: 0.2, oz: 0.62, crouch: 0 },
    { t: 0.8, hx: 0.16, hz: 0.66, ox: 0.16, oz: 0.66, lean: 0.03 },
    { t: 0.95, hx: 0.2, hz: 0.62, ox: 0.2, oz: 0.62, lean: -0.03 },
  ],
});

// --- celebrations/fist-pump.js
// Célébration : images clés (t de 0 à 1 sur `duration` s). hx/hz = main raquette, ox/oz = main libre, relatives à l'épaule.
Agasso.define('celebration', {
  id: 'fist-pump',
  label: 'Poing serré',
  duration: 1.1,
  frames: [
    { t: 0, hx: 0.3, hz: -0.4, ox: 0.05, oz: -0.1, crouch: 0.12 },
    { t: 0.25, hx: 0.3, hz: -0.3, ox: 0.0, oz: 0.25, crouch: 0.2, lean: 0.05 },
    { t: 0.5, hx: 0.3, hz: -0.4, ox: 0.05, oz: -0.05, crouch: 0.1 },
    { t: 0.75, hx: 0.3, hz: -0.3, ox: 0.0, oz: 0.28, crouch: 0.2, lean: 0.05 },
  ],
});

// --- celebrations/kneel.js
// Célébration : images clés (t de 0 à 1 sur `duration` s). hx/hz = main raquette, ox/oz = main libre, relatives à l'épaule.
Agasso.define('celebration', {
  id: 'kneel',
  label: 'À genoux',
  duration: 3.0,
  frames: [
    { t: 0, hx: 0.25, hz: -0.3, ox: 0.2, oz: -0.3, crouch: 0.05 },
    { t: 0.15, hx: 0.2, hz: 0.55, ox: 0.2, oz: 0.55, crouch: 0.5 },
    { t: 0.9, hx: 0.14, hz: 0.62, ox: 0.14, oz: 0.62, crouch: 0.52 },
  ],
});

// --- celebrations/leap.js
// Célébration : images clés (t de 0 à 1 sur `duration` s). hx/hz = main raquette, ox/oz = main libre, relatives à l'épaule.
Agasso.define('celebration', {
  id: 'leap',
  label: 'Saut de joie',
  duration: 0.9,
  frames: [
    { t: 0, hx: 0.3, hz: -0.3, ox: 0.25, oz: -0.3, crouch: 0.25, jump: 0 },
    { t: 0.35, hx: 0.22, hz: 0.6, ox: 0.05, oz: 0.5, crouch: 0, jump: 0.45 },
    { t: 0.7, hx: 0.3, hz: 0.1, ox: 0.2, oz: 0.0, crouch: 0.22, jump: 0 },
  ],
});

// --- celebrations/salute.js
// Célébration : images clés (t de 0 à 1 sur `duration` s). hx/hz = main raquette, ox/oz = main libre, relatives à l'épaule.
Agasso.define('celebration', {
  id: 'salute',
  label: 'Salut au public',
  duration: 2.0,
  frames: [
    { t: 0, hx: 0.2, hz: 0.6, ox: 0.2, oz: -0.4, lean: 0.04 },
    { t: 0.5, hx: 0.3, hz: 0.55, ox: 0.2, oz: -0.4, lean: -0.04 },
    { t: 0.99, hx: 0.2, hz: 0.6, ox: 0.2, oz: -0.4, lean: 0.04 },
  ],
});

// --- music/menu-anthem.js
// Musique des menus : composition originale, hymne synthé de stade façon rock d'aréna des années 80.
// Pour utiliser un vrai fichier audio à la place : file: 'assets/music/mon-morceau.mp3' (les `parts` servent alors de secours).
Agasso.define('music', {
  id: 'menu-anthem',
  name: "Coup d'envoi",
  role: 'menu',
  file: null,
  bpm: 118,
  loop: true,
  gain: 0.6,
  // Un jeton par double croche : note (A4, F#5, accord C3+E3+G3), '-' prolonge, '.' silence, 'x' percussion.
  parts: {
    lead: { voice: 'lead', gain: 0.26, seq: [
        'A4 - - D5 - - F5 - E5 - D5 - A4 - - -',
        'Bb4 - - D5 - - F5 - G5 - F5 - D5 - - -',
        'C5 - - E5 - - G5 - A5 - G5 - E5 - - -',
        'E5 - - - C5 - - - A4 - - - - - . .',
        'A4 - - D5 - - F5 - A5 - - - G5 - F5 -',
        'G5 - - F5 - - D5 - Bb4 - - - - - . .',
        'C5 - - E5 - - G5 - C6 - - - Bb5 - A5 -',
        'A5 - - - - - - - D5 - - - - - . .',
      ] },
    bass: { voice: 'bass', gain: 0.3, seq: [
        'D2 . D2 . D2 . D2 . D2 . D2 . D2 . D2 .',
        'Bb1 . Bb1 . Bb1 . Bb1 . Bb1 . Bb1 . Bb1 . Bb1 .',
        'C2 . C2 . C2 . C2 . C2 . C2 . C2 . C2 .',
        'A1 . A1 . A1 . A1 . A1 . A1 . A1 . A1 .',
        'D2 . D2 . D2 . D2 . D2 . D2 . D2 . D2 .',
        'Bb1 . Bb1 . Bb1 . Bb1 . Bb1 . Bb1 . Bb1 . Bb1 .',
        'C2 . C2 . C2 . C2 . C2 . C2 . C2 . C2 .',
        'D2 . D2 . D2 . D2 . D2 . D2 . D2 . D2 .',
      ] },
    pad: { voice: 'pad', gain: 0.1, seq: [
        'D3+F3+A3 - - - - - - - - - - - - - - -',
        'Bb2+D3+F3 - - - - - - - - - - - - - - -',
        'C3+E3+G3 - - - - - - - - - - - - - - -',
        'A2+C3+E3 - - - - - - - - - - - - - - -',
        'D3+F3+A3 - - - - - - - - - - - - - - -',
        'Bb2+D3+F3 - - - - - - - - - - - - - - -',
        'C3+E3+G3 - - - - - - - - - - - - - - -',
        'D3+F3+A3 - - - - - - - - - - - - - - -',
      ] },
    kick: { voice: 'kick', gain: 0.6, seq: 'x . . . . . . . x . . . . . x .' },
    snare: { voice: 'snare', gain: 0.3, seq: '. . . . x . . . . . . . x . . .' },
    hat: { voice: 'hat', gain: 0.1, seq: 'x . x . x . x . x . x . x . x .' },
  },
});

// --- music/victory-anthem.js
// Musique de victoire : composition originale, hymne pop-rock triomphal à tempo moyen.
// Pour utiliser un vrai fichier audio à la place : file: 'assets/music/mon-morceau.mp3' (les `parts` servent alors de secours).
Agasso.define('music', {
  id: 'victory-anthem',
  name: "Sacre",
  role: 'victory',
  file: null,
  bpm: 100,
  loop: true,
  gain: 0.6,
  // Un jeton par double croche : note (A4, F#5, accord C3+E3+G3), '-' prolonge, '.' silence, 'x' percussion.
  parts: {
    lead: { voice: 'lead', gain: 0.26, seq: [
        'B4 - - - D5 - - - G5 - - - - - D5 -',
        'A5 - - - F#5 - - - D5 - - - - - . .',
        'G5 - - - E5 - - - B4 - - - E5 - G5 -',
        'G5 - - - E5 - - - C5 - - - - - . .',
        'B4 - - - D5 - - - G5 - - - B5 - - -',
        'A5 - - - - - F#5 - D5 - - - A5 - - -',
        'G5 - - - E5 - - - C5 - - - E5 - G5 -',
        'G5 - - - - - - - - - - - - - . .',
      ] },
    bass: { voice: 'bass', gain: 0.3, seq: [
        'G1 . G1 . G1 . G1 . G1 . G1 . G1 . G1 .',
        'D2 . D2 . D2 . D2 . D2 . D2 . D2 . D2 .',
        'E2 . E2 . E2 . E2 . E2 . E2 . E2 . E2 .',
        'C2 . C2 . C2 . C2 . C2 . C2 . C2 . C2 .',
        'G1 . G1 . G1 . G1 . G1 . G1 . G1 . G1 .',
        'D2 . D2 . D2 . D2 . D2 . D2 . D2 . D2 .',
        'C2 . C2 . C2 . C2 . C2 . C2 . C2 . C2 .',
        'G1 . G1 . G1 . G1 . G1 . G1 . G1 . G1 .',
      ] },
    pad: { voice: 'pad', gain: 0.1, seq: [
        'G3+B3+D4 - - - - - - - - - - - - - - -',
        'F#3+A3+D4 - - - - - - - - - - - - - - -',
        'E3+G3+B3 - - - - - - - - - - - - - - -',
        'E3+G3+C4 - - - - - - - - - - - - - - -',
        'G3+B3+D4 - - - - - - - - - - - - - - -',
        'F#3+A3+D4 - - - - - - - - - - - - - - -',
        'E3+G3+C4 - - - - - - - - - - - - - - -',
        'G3+B3+D4 - - - - - - - - - - - - - - -',
      ] },
    kick: { voice: 'kick', gain: 0.6, seq: 'x . . . . . x . x . . . . . . .' },
    snare: { voice: 'snare', gain: 0.3, seq: '. . . . x . . . . . . . x . . .' },
    hat: { voice: 'hat', gain: 0.1, seq: 'x . x . x . x . x . x . x . x .' },
  },
});

// --- players/agassi.js
Agasso.define('player', {
  id: 'agassi',
  name: 'Andre Agassi',
  order: 4,
  short: 'Agassi',
  group: 'legend',
  gender: 'M',
  hand: 'R',
  country: 'USA',
  stats: { force: 9, speed: 9, technique: 10, mental: 9, serve: 9, defense: 9 },
  slams: 8,
  archetype: 'aggressive-returner',
  style: 'Retour exceptionnel, frappe très tôt, jeu de fond agressif.',
  technique: { early: 0.9, return: { pace: 1.1, margin: 0.75 } },
  celebration: 'salute',
  look: {
    skin: '#e3b28d',
    hair: '#2a1d14',
    hairStyle: 'bald',
    shirt: '#2b2f3a',
    shorts: '#16181d',
    accent: '#e9c23c',
    height: 1.8,
    bulk: 1.02,
  },
});

// --- players/agasso.js
Agasso.define('player', {
  id: 'agasso',
  name: 'Agasso',
  order: 23,
  short: 'Agasso',
  group: 'original',
  gender: 'M',
  hand: 'R',
  country: '',
  stats: { force: 8, speed: 8, technique: 8, mental: 8, serve: 8, defense: 8 },
  slams: 0,
  archetype: 'all-court',
  style: 'Personnage original du jeu : statistiques équilibrées, tout dépend de toi.',
  celebration: 'salute',
  look: {
    skin: '#c98f67',
    hair: '#1d1d1f',
    hairStyle: 'short',
    shirt: '#e63946',
    shorts: '#15151a',
    accent: '#ffd23f',
    height: 1.83,
    bulk: 1.0,
    headband: true,
  },
});

// --- players/becker.js
Agasso.define('player', {
  id: 'becker',
  name: 'Boris Becker',
  order: 6,
  short: 'Becker',
  group: 'legend',
  gender: 'M',
  hand: 'R',
  country: 'GER',
  stats: { force: 10, speed: 9, technique: 9, mental: 9, serve: 10, defense: 8 },
  slams: 6,
  archetype: 'power-server',
  style: 'Service surpuissant, explosivité, attaque permanente.',
  surfaces: { grass: 0.6, clay: -0.3 },
  celebration: 'leap',
  look: {
    skin: '#f0c9a8',
    hair: '#c77a3a',
    hairStyle: 'short',
    shirt: '#f5f3ee',
    shorts: '#f5f3ee',
    accent: '#27508f',
    height: 1.9,
    bulk: 1.08,
  },
});

// --- players/borg.js
Agasso.define('player', {
  id: 'borg',
  name: 'Björn Borg',
  order: 0,
  short: 'Borg',
  group: 'legend',
  gender: 'M',
  hand: 'R',
  country: 'SWE',
  stats: { force: 9, speed: 9, technique: 9, mental: 10, serve: 8, defense: 10 },
  slams: 11,
  archetype: 'baseline-defender',
  style: 'Défense exceptionnelle, calme olympien, fond de court.',
  technique: { forehand: { spin: 0.6 }, backhand: { spin: 0.5 } },
  surfaces: { clay: 0.6, grass: 0.5 },
  celebration: 'kneel',
  look: {
    skin: '#e3b28d',
    hair: '#c9a35a',
    hairStyle: 'long',
    shirt: '#f5f3ee',
    shorts: '#f5f3ee',
    accent: '#c8372d',
    height: 1.8,
    bulk: 0.95,
    headband: true,
  },
});

// --- players/connors.js
Agasso.define('player', {
  id: 'connors',
  name: 'Jimmy Connors',
  order: 2,
  short: 'Connors',
  group: 'legend',
  gender: 'M',
  hand: 'L',
  country: 'USA',
  stats: { force: 9, speed: 9, technique: 9, mental: 10, serve: 8, defense: 9 },
  slams: 8,
  archetype: 'aggressive-returner',
  style: 'Agressif, retour exceptionnel, pression constante.',
  technique: { return: { pace: 1.1, margin: 0.75 }, backhand: { spin: 0, hands: 2 }, forehand: { spin: 0 } },
  celebration: 'fist-pump',
  look: {
    skin: '#e3b28d',
    hair: '#4a3020',
    hairStyle: 'mop',
    shirt: '#e8e4da',
    shorts: '#f5f3ee',
    accent: '#2a4f8f',
    height: 1.78,
    bulk: 1.0,
  },
});

// --- players/corinne.js
Agasso.define('player', {
  id: 'corinne',
  name: 'Corinne',
  order: 22,
  short: 'Corinne',
  group: 'original',
  gender: 'F',
  hand: 'R',
  country: '',
  stats: { force: 8, speed: 8, technique: 8, mental: 8, serve: 8, defense: 8 },
  slams: 0,
  archetype: 'all-court',
  style: 'Personnage original du jeu : statistiques équilibrées, tout dépend de toi.',
  celebration: 'leap',
  look: {
    skin: '#f0c9a8',
    hair: '#c98a2b',
    hairStyle: 'ponytail',
    shirt: '#b455e0',
    shorts: '#f4f1ea',
    accent: '#ffd23f',
    height: 1.72,
    bulk: 0.95,
  },
});

// --- players/edberg.js
Agasso.define('player', {
  id: 'edberg',
  name: 'Stefan Edberg',
  order: 7,
  short: 'Edberg',
  group: 'legend',
  gender: 'M',
  hand: 'R',
  country: 'SWE',
  stats: { force: 8, speed: 9, technique: 10, mental: 9, serve: 9, defense: 8 },
  slams: 6,
  archetype: 'serve-volley',
  style: 'Service-volée, toucher, déplacement vers l\'avant.',
  technique: { volley: { margin: 0.65 }, serve: { pace: 0.98, spin: 0.6, margin: 0.8 } },
  surfaces: { grass: 0.5 },
  celebration: 'arms-up',
  look: {
    skin: '#f0c9a8',
    hair: '#d0b06a',
    hairStyle: 'short',
    shirt: '#f5f3ee',
    shorts: '#f5f3ee',
    accent: '#3a6ea5',
    height: 1.88,
    bulk: 0.92,
  },
});

// --- players/eric.js
Agasso.define('player', {
  id: 'eric',
  name: 'Eric',
  order: 20,
  short: 'Eric',
  group: 'original',
  gender: 'M',
  hand: 'R',
  country: '',
  stats: { force: 8, speed: 8, technique: 8, mental: 8, serve: 8, defense: 8 },
  slams: 0,
  archetype: 'all-court',
  style: 'Personnage original du jeu : statistiques équilibrées, tout dépend de toi.',
  celebration: 'fist-pump',
  look: {
    skin: '#e3b28d',
    hair: '#3b2a20',
    hairStyle: 'short',
    shirt: '#2f7df6',
    shorts: '#f4f1ea',
    accent: '#0f3f9c',
    height: 1.83,
    bulk: 1.0,
  },
});

// --- players/evert.js
Agasso.define('player', {
  id: 'evert',
  name: 'Chris Evert',
  order: 11,
  short: 'Evert',
  group: 'legend',
  gender: 'F',
  hand: 'R',
  country: 'USA',
  stats: { force: 8, speed: 8, technique: 10, mental: 10, serve: 7, defense: 10 },
  slams: 18,
  archetype: 'baseline-defender',
  style: 'Régularité, précision, défense, fond du court.',
  technique: { backhand: { margin: 0.75, hands: 2 }, forehand: { margin: 0.8, spin: 0.2 } },
  surfaces: { clay: 0.7 },
  celebration: 'salute',
  look: {
    skin: '#f0c9a8',
    hair: '#d9b56a',
    hairStyle: 'ponytail',
    shirt: '#f5f3ee',
    shorts: '#f5f3ee',
    accent: '#d78aa6',
    height: 1.68,
    bulk: 0.9,
  },
});

// --- players/federer.js
Agasso.define('player', {
  id: 'federer',
  name: 'Roger Federer',
  order: 8,
  short: 'Federer',
  group: 'legend',
  gender: 'M',
  hand: 'R',
  country: 'SUI',
  stats: { force: 9, speed: 9, technique: 10, mental: 10, serve: 9, defense: 9 },
  slams: 20,
  archetype: 'all-court',
  style: 'Polyvalent : coup droit, slice, variation, déplacement fluide.',
  technique: {
    forehand: { pace: 1.07, spin: 0.4, margin: 0.85 },
    backhand: { hands: 1, spin: 0.2 },
    slice: { margin: 0.7 },
    serve: { margin: 0.8 },
    movement: { style: 'glide' },
  },
  ai: { slice: 0.3, netRush: 0.18, aggression: 0.75 },
  surfaces: { grass: 0.6 },
  celebration: 'arms-up',
  look: {
    skin: '#e3b28d',
    hair: '#3a2a1c',
    hairStyle: 'medium',
    shirt: '#f2f0ea',
    shorts: '#f2f0ea',
    accent: '#8a1f2b',
    height: 1.85,
    bulk: 0.98,
    headband: true,
  },
});

// --- players/graf.js
Agasso.define('player', {
  id: 'graf',
  name: 'Steffi Graf',
  order: 13,
  short: 'Graf',
  group: 'legend',
  gender: 'F',
  hand: 'R',
  country: 'GER',
  stats: { force: 10, speed: 10, technique: 10, mental: 10, serve: 10, defense: 9 },
  slams: 22,
  archetype: 'power-baseliner',
  style: 'Coup droit dévastateur, vitesse, attaque ; revers slicé.',
  technique: {
    forehand: { pace: 1.1, margin: 0.9 },
    backhand: { hands: 1, spin: -0.7, pace: 0.95, margin: 0.8 },
    slice: { margin: 0.7 },
  },
  ai: { slice: 0.2 },
  celebration: 'arms-up',
  look: {
    skin: '#f0c9a8',
    hair: '#d9b56a',
    hairStyle: 'ponytail',
    shirt: '#f5f3ee',
    shorts: '#f5f3ee',
    accent: '#2b5fb3',
    height: 1.76,
    bulk: 0.95,
  },
});

// --- players/hingis.js
Agasso.define('player', {
  id: 'hingis',
  name: 'Martina Hingis',
  order: 17,
  short: 'Hingis',
  group: 'legend',
  gender: 'F',
  hand: 'R',
  country: 'SUI',
  stats: { force: 7, speed: 9, technique: 10, mental: 10, serve: 8, defense: 9 },
  slams: 5,
  archetype: 'tactician',
  style: 'Intelligence tactique, anticipation, variation.',
  celebration: 'salute',
  look: {
    skin: '#f0c9a8',
    hair: '#8a5a2c',
    hairStyle: 'ponytail',
    shirt: '#f2f0ea',
    shorts: '#f2f0ea',
    accent: '#3aa0a0',
    height: 1.7,
    bulk: 0.9,
  },
});

// --- players/king.js
Agasso.define('player', {
  id: 'king',
  name: 'Billie Jean King',
  order: 10,
  short: 'King',
  group: 'legend',
  gender: 'F',
  hand: 'R',
  country: 'USA',
  stats: { force: 8, speed: 9, technique: 10, mental: 10, serve: 8, defense: 9 },
  slams: 12,
  archetype: 'serve-volley',
  style: 'Polyvalente, service-volée, intelligence tactique.',
  ai: { serveVolley: 0.55, netRush: 0.25, drop: 0.2 },
  celebration: 'arms-up',
  look: {
    skin: '#f0c9a8',
    hair: '#4a3424',
    hairStyle: 'short',
    shirt: '#f5f3ee',
    shorts: '#f5f3ee',
    accent: '#2f6bb0',
    height: 1.64,
    bulk: 0.95,
    glasses: true,
  },
});

// --- players/lendl.js
Agasso.define('player', {
  id: 'lendl',
  name: 'Ivan Lendl',
  order: 3,
  short: 'Lendl',
  group: 'legend',
  gender: 'M',
  hand: 'R',
  country: 'CZE',
  stats: { force: 10, speed: 8, technique: 9, mental: 10, serve: 10, defense: 8 },
  slams: 8,
  archetype: 'power-baseliner',
  style: 'Puissance du fond du court, service lourd, discipline de fer.',
  technique: { forehand: { pace: 1.07, spin: 0.4 }, backhand: { hands: 1 } },
  celebration: 'arms-up',
  look: {
    skin: '#f0c9a8',
    hair: '#3b2a20',
    hairStyle: 'short',
    shirt: '#f2f0ea',
    shorts: '#1d2733',
    accent: '#b8322c',
    height: 1.88,
    bulk: 1.0,
  },
});

// --- players/mcenroe.js
Agasso.define('player', {
  id: 'mcenroe',
  name: 'John McEnroe',
  order: 1,
  short: 'McEnroe',
  group: 'legend',
  gender: 'M',
  hand: 'L',
  country: 'USA',
  stats: { force: 8, speed: 8, technique: 10, mental: 7, serve: 8, defense: 8 },
  slams: 7,
  archetype: 'serve-volley',
  style: 'Gaucher, service-volée, toucher exceptionnel, tempérament explosif.',
  technique: { volley: { margin: 0.65 }, drop: { margin: 0.7 } },
  ai: { drop: 0.25 },
  surfaces: { grass: 0.5, clay: -0.3 },
  temper: 1.0,
  celebration: 'fist-pump',
  look: {
    skin: '#f0c9a8',
    hair: '#5a3a22',
    hairStyle: 'curly',
    shirt: '#f5f3ee',
    shorts: '#23324d',
    accent: '#c8372d',
    height: 1.8,
    bulk: 0.92,
    headband: true,
  },
});

// --- players/nadal.js
Agasso.define('player', {
  id: 'nadal',
  name: 'Rafael Nadal',
  order: 9,
  short: 'Nadal',
  group: 'legend',
  gender: 'M',
  hand: 'L',
  country: 'ESP',
  stats: { force: 10, speed: 10, technique: 9, mental: 10, serve: 9, defense: 10 },
  slams: 22,
  archetype: 'topspin-grinder',
  style: 'Énorme défense, lift, puissance, intensité, spécialiste de la terre battue.',
  technique: { forehand: { spin: 1.0, pace: 1.03 } },
  surfaces: { clay: 1.0 },
  celebration: 'kneel',
  look: {
    skin: '#c98f67',
    hair: '#2a1d14',
    hairStyle: 'long',
    shirt: '#e8742c',
    shorts: '#f2f0ea',
    accent: '#f2f0ea',
    height: 1.85,
    bulk: 1.1,
    headband: true,
    sleeveless: true,
  },
});

// --- players/navratilova.js
Agasso.define('player', {
  id: 'navratilova',
  name: 'Martina Navrátilová',
  order: 12,
  short: 'Navrátilová',
  group: 'legend',
  gender: 'F',
  hand: 'L',
  country: 'USA',
  stats: { force: 10, speed: 10, technique: 10, mental: 10, serve: 10, defense: 9 },
  slams: 18,
  archetype: 'serve-volley',
  style: 'Gauchère, service-volée, puissance, agressivité.',
  technique: { volley: { margin: 0.65 } },
  surfaces: { grass: 0.7 },
  celebration: 'leap',
  look: {
    skin: '#f0c9a8',
    hair: '#c9a35a',
    hairStyle: 'short',
    shirt: '#f5f3ee',
    shorts: '#f5f3ee',
    accent: '#2f8f6b',
    height: 1.73,
    bulk: 1.05,
    glasses: true,
  },
});

// --- players/remi.js
Agasso.define('player', {
  id: 'remi',
  name: 'Remi',
  order: 21,
  short: 'Remi',
  group: 'original',
  gender: 'M',
  hand: 'R',
  country: '',
  stats: { force: 8, speed: 8, technique: 8, mental: 8, serve: 8, defense: 8 },
  slams: 0,
  archetype: 'all-court',
  style: 'Personnage original du jeu : statistiques équilibrées, tout dépend de toi.',
  celebration: 'arms-up',
  look: {
    skin: '#e3b28d',
    hair: '#7a4a25',
    hairStyle: 'short',
    shirt: '#18b37a',
    shorts: '#16222b',
    accent: '#f4f1ea',
    height: 1.82,
    bulk: 1.0,
    cap: true,
  },
});

// --- players/sabatini.js
Agasso.define('player', {
  id: 'sabatini',
  name: 'Gabriela Sabatini',
  order: 15,
  short: 'Sabatini',
  group: 'legend',
  gender: 'F',
  hand: 'R',
  country: 'ARG',
  stats: { force: 9, speed: 9, technique: 10, mental: 9, serve: 8, defense: 9 },
  slams: 1,
  archetype: 'all-court',
  style: 'Élégante, polyvalente, variation.',
  technique: { forehand: { spin: 0.5 }, backhand: { hands: 1, spin: 0.3 } },
  ai: { slice: 0.2, netRush: 0.15 },
  celebration: 'salute',
  look: {
    skin: '#e3b28d',
    hair: '#2a1d14',
    hairStyle: 'long',
    shirt: '#f2f0ea',
    shorts: '#f2f0ea',
    accent: '#6bb0d9',
    height: 1.75,
    bulk: 0.98,
  },
});

// --- players/sampras.js
Agasso.define('player', {
  id: 'sampras',
  name: 'Pete Sampras',
  order: 5,
  short: 'Sampras',
  group: 'legend',
  gender: 'M',
  hand: 'R',
  country: 'USA',
  stats: { force: 9, speed: 8, technique: 9, mental: 10, serve: 10, defense: 8 },
  slams: 14,
  archetype: 'serve-volley',
  style: 'Service exceptionnel, service-volée, sang-froid dans les moments clés.',
  technique: { serve: { pace: 1.07, margin: 0.78 }, smash: { pace: 1.12, margin: 0.75 }, forehand: { pace: 1.04 } },
  surfaces: { grass: 0.7, clay: -0.5 },
  celebration: 'fist-pump',
  look: {
    skin: '#c98f67',
    hair: '#1f1712',
    hairStyle: 'curly',
    shirt: '#f5f3ee',
    shorts: '#f5f3ee',
    accent: '#27415f',
    height: 1.85,
    bulk: 1.0,
  },
});

// --- players/sanchez.js
Agasso.define('player', {
  id: 'sanchez',
  name: 'Arantxa Sánchez Vicario',
  order: 16,
  short: 'Sánchez',
  group: 'legend',
  gender: 'F',
  hand: 'R',
  country: 'ESP',
  stats: { force: 8, speed: 10, technique: 9, mental: 10, serve: 7, defense: 10 },
  slams: 4,
  archetype: 'baseline-defender',
  style: 'Défense, endurance, récupération exceptionnelle.',
  ai: { lob: 0.65 },
  surfaces: { clay: 0.6 },
  celebration: 'leap',
  look: {
    skin: '#e3b28d',
    hair: '#3a2416',
    hairStyle: 'ponytail',
    shirt: '#f2f0ea',
    shorts: '#f2f0ea',
    accent: '#c8372d',
    height: 1.69,
    bulk: 0.98,
    visor: true,
  },
});

// --- players/seles.js
Agasso.define('player', {
  id: 'seles',
  name: 'Monica Seles',
  order: 14,
  short: 'Seles',
  group: 'legend',
  gender: 'F',
  hand: 'L',
  country: 'USA',
  stats: { force: 10, speed: 9, technique: 9, mental: 9, serve: 9, defense: 9 },
  slams: 9,
  archetype: 'power-baseliner',
  style: 'Frappe très tôt, puissance à deux mains des deux côtés.',
  technique: { early: 0.85, forehand: { hands: 2 }, backhand: { hands: 2 } },
  celebration: 'fist-pump',
  look: {
    skin: '#f0c9a8',
    hair: '#8a5a2c',
    hairStyle: 'ponytail',
    shirt: '#f2f0ea',
    shorts: '#f2f0ea',
    accent: '#d9a62b',
    height: 1.79,
    bulk: 1.0,
  },
});

// --- players/serena.js
Agasso.define('player', {
  id: 'serena',
  name: 'Serena Williams',
  order: 18,
  short: 'S. Williams',
  group: 'legend',
  gender: 'F',
  hand: 'R',
  country: 'USA',
  stats: { force: 10, speed: 9, technique: 10, mental: 10, serve: 10, defense: 9 },
  slams: 23,
  archetype: 'power-baseliner',
  style: 'Puissance exceptionnelle, service, agressivité.',
  technique: { serve: { pace: 1.08, margin: 0.78 } },
  celebration: 'fist-pump',
  look: {
    skin: '#5e3b26',
    hair: '#1a1210',
    hairStyle: 'bun',
    shirt: '#d63a6a',
    shorts: '#16181d',
    accent: '#f2f0ea',
    height: 1.75,
    bulk: 1.15,
  },
});

// --- players/venus.js
Agasso.define('player', {
  id: 'venus',
  name: 'Venus Williams',
  order: 19,
  short: 'V. Williams',
  group: 'legend',
  gender: 'F',
  hand: 'R',
  country: 'USA',
  stats: { force: 10, speed: 9, technique: 9, mental: 10, serve: 10, defense: 8 },
  slams: 7,
  archetype: 'power-baseliner',
  style: 'Puissance, service, attaque.',
  technique: { serve: { pace: 1.07 } },
  ai: { netRush: 0.2 },
  surfaces: { grass: 0.6 },
  celebration: 'arms-up',
  look: {
    skin: '#5e3b26',
    hair: '#1a1210',
    hairStyle: 'bun',
    shirt: '#f2f0ea',
    shorts: '#f2f0ea',
    accent: '#7a4bb5',
    height: 1.85,
    bulk: 1.0,
    visor: true,
  },
});

// --- tournaments/australian-open.js
Agasso.define('tournament', {
  id: 'australian-open',
  order: 3,
  name: 'Australian Open',
  venue: 'australian-open',
  drawSize: 16,
  field: 'all',
  rounds: [
    { name: 'Huitièmes de finale', format: 'express' },
    { name: 'Quarts de finale', format: 'express' },
    { name: 'Demi-finales', format: 'set1' },
    { name: 'Finale', format: 'set1' },
  ],
  trophy: 'Trophée du vainqueur',
});

// --- tournaments/roland-garros.js
// Tournoi : tableau à élimination directe. `field` = 'all' ou une liste d'ids de joueurs ; un format par tour.
Agasso.define('tournament', {
  id: 'roland-garros',
  order: 0,
  name: 'Roland-Garros',
  venue: 'roland-garros',
  drawSize: 16,
  field: 'all',
  rounds: [
    { name: 'Huitièmes de finale', format: 'express' },
    { name: 'Quarts de finale', format: 'express' },
    { name: 'Demi-finales', format: 'set1' },
    { name: 'Finale', format: 'set1' },
  ],
  trophy: 'Coupe du vainqueur',
});

// --- tournaments/us-open.js
Agasso.define('tournament', {
  id: 'us-open',
  order: 2,
  name: 'US Open',
  venue: 'us-open',
  drawSize: 16,
  field: 'all',
  rounds: [
    { name: 'Huitièmes de finale', format: 'express' },
    { name: 'Quarts de finale', format: 'express' },
    { name: 'Demi-finales', format: 'set1' },
    { name: 'Finale', format: 'set1' },
  ],
  trophy: 'Trophée du vainqueur',
});

// --- tournaments/wimbledon.js
Agasso.define('tournament', {
  id: 'wimbledon',
  order: 1,
  name: 'Wimbledon',
  venue: 'wimbledon',
  drawSize: 16,
  field: 'all',
  rounds: [
    { name: 'Huitièmes de finale', format: 'express' },
    { name: 'Quarts de finale', format: 'express' },
    { name: 'Demi-finales', format: 'set1' },
    { name: 'Finale', format: 'set1' },
  ],
  trophy: 'Trophée du vainqueur',
});

// --- venues/presets.js
// Préréglages réutilisables par les terrains : style de stade et éclairage.
// Un terrain les référence (`style: 'arena'`, `lighting: 'night'`) et peut en surcharger chaque champ.

// --- Styles de stade ---
//   rowsBack / rowsSide : rangées de gradins ; upperAt : rangée où commence le second niveau (0 = aucun)
//   fill : taux de remplissage du public ; backdrop : 'trees' | 'sea' | 'city' | 'hills' | null
Agasso.define('stadium', { id: 'arena', label: 'Grand stade', rowsBack: 24, upperAt: 12, rowsSide: 20, roof: true, indoor: false, fill: 0.95, flags: true, benches: true, flowers: true, backdrop: null, camera: null });
Agasso.define('stadium', { id: 'stadium', label: 'Stade', rowsBack: 15, upperAt: 0, rowsSide: 13, roof: false, indoor: false, fill: 0.9, flags: true, benches: true, flowers: true, backdrop: 'city', camera: null });
Agasso.define('stadium', { id: 'club', label: 'Court de club', rowsBack: 4, upperAt: 0, rowsSide: 3, roof: false, indoor: false, fill: 0.6, flags: false, benches: true, flowers: false, backdrop: 'trees', camera: null });
Agasso.define('stadium', { id: 'indoor', label: 'Salle', rowsBack: 22, upperAt: 11, rowsSide: 18, roof: false, indoor: true, fill: 0.95, flags: false, benches: true, flowers: false, backdrop: null, camera: null });
Agasso.define('stadium', { id: 'hall', label: 'Petite salle', rowsBack: 6, upperAt: 0, rowsSide: 5, roof: false, indoor: true, fill: 0.7, flags: false, benches: true, flowers: false, backdrop: null, camera: null });

// --- Éclairages ---
//   sun : décalage de l'ombre au sol par mètre de hauteur (null = pas de soleil) ; shadow : opacité des ombres
//   standShadow : grande ombre de tribune sur le court ; floodlights : projecteurs (ombres multiples)
//   dim : assombrissement des tribunes ; sky / clouds / stars : ciel ; glow : teinte de la lumière sur le court
Agasso.define('lighting', { id: 'day', label: 'Jour', time: 'day', sun: [-0.55, 0.3], shadow: 0.27, standShadow: true, floodlights: false, dim: 0, sky: null, clouds: 6, stars: false, glow: '255,232,188' });
Agasso.define('lighting', { id: 'overcast', label: 'Couvert', time: 'day', sun: null, shadow: 0.16, standShadow: false, floodlights: false, dim: 0.08, sky: ['#8f9aa5', '#cfd5da'], clouds: 14, stars: false, glow: '225,230,235' });
Agasso.define('lighting', { id: 'dusk', label: 'Fin de journée', time: 'dusk', sun: [-1.15, 0.45], shadow: 0.3, standShadow: true, floodlights: true, dim: 0.14, sky: ['#3f5f9a', '#f2b27a'], clouds: 4, stars: false, glow: '255,200,140' });
Agasso.define('lighting', { id: 'night', label: 'Nuit', time: 'night', sun: null, shadow: 0.11, standShadow: false, floodlights: true, dim: 0.56, sky: ['#050814', '#1a2340'], clouds: 0, stars: true, glow: '230,238,255' });
Agasso.define('lighting', { id: 'indoor', label: 'Salle', time: 'indoor', sun: null, shadow: 0.11, standShadow: false, floodlights: true, dim: 0.5, sky: ['#090b10', '#1b2029'], clouds: 0, stars: false, glow: '235,240,255' });

// --- venues/surfaces.js
// Surfaces génériques. Un terrain choisit sa surface par son id ; le moteur ne connaît que ces données.
//   speed  (1–10) : vitesse conservée au rebond — 1 = très lent, 10 = très rapide
//   bounce (1–10) : hauteur du rebond — 1 = très bas, 10 = très haut
//   physics.traction : accroche des appuis (1 = normale, moins = on glisse)
//   physics.pace     : vitesse de balle dans l'air (1 = normale)
//   family : sert à l'affinité des joueurs (`surfaces: { clay: 1 }` dans leur fiche)
//   look   : aspect par défaut du court (le terrain peut tout surcharger)
Agasso.define('surface', {
  id: 'clay', label: 'Terre battue', family: 'clay', speed: 3, bounce: 10, physics: { traction: 0.9 },
  look: { court: '#c2603a', courtLight: '#d1744b', apron: null, grain: 'clay', stripes: false, dust: '214,146,104', mark: '112,46,18', wear: '255,205,170' },
});
Agasso.define('surface', {
  id: 'grass', label: 'Gazon', family: 'grass', speed: 7.5, bounce: 5, physics: { traction: 0.95 },
  look: { court: '#4b8a3a', courtLight: '#589646', apron: null, grain: 'grass', stripes: true, dust: '214,226,170', mark: null, wear: '176,150,92' },
});
Agasso.define('surface', {
  id: 'hard', label: 'Dur', family: 'hard', speed: 5.5, bounce: 8, physics: { traction: 1 },
  look: { court: '#2f5f9e', courtLight: null, apron: '#3f7d57', grain: 'hard', stripes: false, dust: null, mark: null, wear: null },
});
Agasso.define('surface', {
  id: 'indoor_hard', label: 'Dur indoor', family: 'hard', speed: 7, bounce: 7, physics: { traction: 1 },
  look: { court: '#34507f', courtLight: null, apron: '#2a3442', grain: 'hard', stripes: false, dust: null, mark: null, wear: null },
});

// --- venues/venues.js
// TOUS LES TERRAINS DU JEU. Ajouter un terrain = ajouter une entrée ici, rien d'autre.
//
// Minimum : { id, name, surface }. Tout le reste a une valeur par défaut (surface, style de stade, éclairage).
// Champs disponibles :
//   name, city, country, flag          identité
//   category                           'grand-slam' | 'iconic' | 'extra' (regroupement dans le menu)
//   surface                            id d'une surface de surfaces.js : clay | grass | hard | indoor_hard
//   speed, bounce                      1–10, remplacent ceux de la surface (vitesse et hauteur du rebond)
//   physics { pace, traction, rest, keep }   réglages fins de gameplay propres au terrain
//   weather { label, temperature, wind: [x, y] en m/s }   météo ; le vent dévie la balle
//   conditions                         texte libre (altitude, humidité…)
//   lighting                           id d'un éclairage de presets.js : day | overcast | dusk | night | indoor
//   light { … }                        surcharges de cet éclairage (soleil, ombres, ciel, nuages…)
//   style                              id d'un style de stade : arena | stadium | club | indoor | hall
//   stadium { … }                      surcharges de ce style (rangées, toit, décor, backdrop, wallText…)
//   capacity                           spectateurs : règle aussi le volume du public
//   ambience { crowd }                 niveau sonore du public (0–1,2) si l'on veut l'imposer
//   look { court, apron, wall, seat, accent, … }   couleurs et aspect ; whites: true = tenues blanches
//   prestige                           1–5
//   tournament                         id du tournoi associé (content/tournaments)
//   camera { pos, look, fw, fh, cy }   surcharges de la caméra pour ce terrain
//   model, skybox                      réservés à un futur rendu 3D (non utilisés par le rendu actuel)
(function () {
  const venue = (def) => Agasso.define('venue', def);
  // Habillages partagés par plusieurs terrains
  const RG = { wall: '#0d4a37', wallDark: '#093527', trim: '#c9553d', seat: '#2b5a4c', parasol: '#f1ece2', accent: '#d9663a', accentDeep: '#a8431c', kick: '#ffd9c2' };
  const WIM = { whites: true, wall: '#143c2b', wallDark: '#0c2a1e', trim: '#6f47a8', seat: '#1f4b37', parasol: '#1d5a3c', accent: '#6f47a8', accentDeep: '#45246e', kick: '#e2d3f7' };
  const USO = { court: '#2c5d9c', apron: '#3f7f58', wall: '#1b2f55', wallDark: '#12203c', seat: '#27364f', accent: '#2f6fd0', accentDeep: '#1b3f85', kick: '#cfe0ff' };
  const AO = { court: '#2a6fb5', apron: '#5aa0d8', wall: '#123a6b', wallDark: '#0b2748', seat: '#1f3c5c', accent: '#1f8fd6', accentDeep: '#0f5a90', kick: '#cfeaff' };

  // ---------- Grands Chelems ----------
  venue({ id: 'roland-garros', order: 0, category: 'grand-slam', name: 'Roland-Garros', city: 'Paris', country: 'FRA', flag: '🇫🇷', surface: 'clay', style: 'arena', lighting: 'day',
    capacity: 15000, prestige: 5, tournament: 'roland-garros', weather: { label: 'Ensoleillé', temperature: 24, wind: [0, 0] }, look: RG, skybox: 'paris-day', model: null });
  venue({ id: 'wimbledon', order: 1, category: 'grand-slam', name: 'Wimbledon', city: 'Londres', country: 'GBR', flag: '🇬🇧', surface: 'grass', style: 'arena', lighting: 'day',
    capacity: 15000, prestige: 5, tournament: 'wimbledon', weather: { label: 'Éclaircies', temperature: 20, wind: [0.4, 0] }, light: { clouds: 10 }, look: WIM, skybox: 'london-day', model: null });
  venue({ id: 'us-open', order: 2, category: 'grand-slam', name: 'US Open', city: 'New York', country: 'USA', flag: '🇺🇸', surface: 'hard', speed: 6, style: 'arena', lighting: 'day',
    capacity: 23000, prestige: 5, tournament: 'us-open', weather: { label: 'Chaud et humide', temperature: 29, wind: [0.5, 0] }, look: USO, skybox: 'new-york-day', model: null });
  venue({ id: 'australian-open', order: 3, category: 'grand-slam', name: 'Australian Open', city: 'Melbourne', country: 'AUS', flag: '🇦🇺', surface: 'hard', style: 'arena', lighting: 'day',
    capacity: 15000, prestige: 5, tournament: 'australian-open', weather: { label: 'Forte chaleur', temperature: 35, wind: [0, 0] }, conditions: 'Chaleur : balle un peu plus vive', physics: { pace: 1.015 }, look: AO, skybox: 'melbourne-day', model: null });

  // ---------- Terrains historiques / emblématiques ----------
  venue({ id: 'arthur-ashe', order: 10, category: 'iconic', name: 'Arthur Ashe Stadium', city: 'New York', country: 'USA', flag: '🇺🇸', surface: 'hard', speed: 6, style: 'arena', lighting: 'night',
    capacity: 23771, prestige: 5, tournament: 'us-open', weather: { label: 'Nuit douce', temperature: 23, wind: [0, 0] }, conditions: 'Session de nuit', look: USO });
  venue({ id: 'philippe-chatrier', order: 11, category: 'iconic', name: 'Court Philippe-Chatrier', city: 'Paris', country: 'FRA', flag: '🇫🇷', surface: 'clay', style: 'arena', lighting: 'dusk',
    capacity: 15225, prestige: 5, tournament: 'roland-garros', weather: { label: 'Fin de journée', temperature: 21, wind: [0, 0] }, look: RG });
  venue({ id: 'suzanne-lenglen', order: 12, category: 'iconic', name: 'Court Suzanne-Lenglen', city: 'Paris', country: 'FRA', flag: '🇫🇷', surface: 'clay', style: 'stadium', lighting: 'day',
    capacity: 10068, prestige: 4, tournament: 'roland-garros', weather: { label: 'Ensoleillé', temperature: 23, wind: [0.3, 0] }, look: RG });
  venue({ id: 'centre-court', order: 13, category: 'iconic', name: 'Centre Court Wimbledon', city: 'Londres', country: 'GBR', flag: '🇬🇧', surface: 'grass', style: 'arena', lighting: 'overcast',
    capacity: 14979, prestige: 5, tournament: 'wimbledon', weather: { label: 'Couvert', temperature: 18, wind: [0.3, 0] }, look: WIM });
  venue({ id: 'rod-laver', order: 14, category: 'iconic', name: 'Rod Laver Arena', city: 'Melbourne', country: 'AUS', flag: '🇦🇺', surface: 'hard', style: 'arena', lighting: 'night',
    capacity: 14820, prestige: 5, tournament: 'australian-open', weather: { label: 'Nuit chaude', temperature: 27, wind: [0, 0] }, conditions: 'Session de nuit', look: AO });
  venue({ id: 'foro-italico', order: 15, category: 'iconic', name: 'Foro Italico', city: 'Rome', country: 'ITA', flag: '🇮🇹', surface: 'clay', style: 'stadium', lighting: 'day',
    capacity: 10500, prestige: 4, weather: { label: 'Ensoleillé', temperature: 26, wind: [0, 0] }, stadium: { backdrop: 'trees' },
    look: { wall: '#2d4a3a', wallDark: '#1e3327', trim: null, seat: '#b9b2a0', accent: '#1f7a4d', accentDeep: '#135233', kick: '#d6f0e0' } });
  venue({ id: 'monte-carlo', order: 16, category: 'iconic', name: 'Monte-Carlo Country Club', city: 'Monte-Carlo', country: 'MCO', flag: '🇲🇨', surface: 'clay', style: 'stadium', lighting: 'day',
    capacity: 10200, prestige: 4, weather: { label: 'Brise marine', temperature: 20, wind: [0.8, 0] }, stadium: { backdrop: 'sea', rowsBack: 9 },
    look: { wall: '#1d5a84', wallDark: '#123f5e', trim: '#f1ece2', seat: '#2f5f7f', accent: '#c8372d', accentDeep: '#8f231c', kick: '#ffd6d1' } });
  venue({ id: 'caja-magica', order: 17, category: 'iconic', name: 'Caja Mágica', city: 'Madrid', country: 'ESP', flag: '🇪🇸', surface: 'clay', speed: 4.5, style: 'arena', lighting: 'day',
    capacity: 12442, prestige: 4, weather: { label: 'Sec', temperature: 25, wind: [0, 0] }, conditions: 'Altitude 650 m : balle plus rapide', physics: { pace: 1.03 },
    look: { wall: '#2b2f36', wallDark: '#1c1f24', trim: null, seat: '#3a3f48', accent: '#e0a020', accentDeep: '#a87410', kick: '#ffe9b8' } });
  venue({ id: 'indian-wells', order: 18, category: 'iconic', name: 'Indian Wells', city: 'Californie', country: 'USA', flag: '🇺🇸', surface: 'hard', speed: 4.5, bounce: 9, style: 'arena', lighting: 'day',
    capacity: 16100, prestige: 4, weather: { label: 'Sec et venteux', temperature: 30, wind: [1.6, 0.3] }, conditions: 'Désert : rebond haut, vent', stadium: { backdrop: 'hills', roof: false, upperAt: 0, rowsBack: 18 }, light: { clouds: 1 },
    look: { court: '#5a3f8f', apron: '#3f7d57', wall: '#2a2444', wallDark: '#1c1830', seat: '#3a3552', accent: '#7a55c0', accentDeep: '#4d3285', kick: '#e3d6ff' } });
  venue({ id: 'miami', order: 19, category: 'iconic', name: 'Miami Open', city: 'Miami', country: 'USA', flag: '🇺🇸', surface: 'hard', speed: 5, style: 'stadium', lighting: 'day',
    capacity: 13800, prestige: 4, weather: { label: 'Humide', temperature: 28, wind: [0.7, 0] }, stadium: { backdrop: 'city' },
    look: { court: '#2b5fa8', apron: '#2f8f8a', wall: '#0f4a55', wallDark: '#0a333b', seat: '#205a64', accent: '#16a3a0', accentDeep: '#0c6b69', kick: '#c9f5f2' } });
  venue({ id: 'cincinnati', order: 20, category: 'iconic', name: 'Cincinnati', city: 'Cincinnati', country: 'USA', flag: '🇺🇸', surface: 'hard', speed: 6.5, style: 'stadium', lighting: 'day',
    capacity: 11400, prestige: 3, weather: { label: 'Chaud', temperature: 30, wind: [0.3, 0] },
    look: { court: '#2d5aa0', apron: '#27447a', wall: '#1d2f52', wallDark: '#131f38', seat: '#2c3d5c', accent: '#3b7be0', accentDeep: '#234f9a', kick: '#d3e2ff' } });
  venue({ id: 'shanghai', order: 21, category: 'iconic', name: 'Shanghai', city: 'Shanghai', country: 'CHN', flag: '🇨🇳', surface: 'hard', speed: 6.5, style: 'arena', lighting: 'dusk',
    capacity: 15000, prestige: 3, weather: { label: 'Doux', temperature: 22, wind: [0, 0] },
    look: { court: '#3b4fa0', apron: '#3f7d57', wall: '#2a2f5a', wallDark: '#1b1f3d', seat: '#3a3f66', accent: '#c8372d', accentDeep: '#8f231c', kick: '#ffd6d1' } });
  venue({ id: 'tokyo', order: 22, category: 'iconic', name: 'Tokyo', city: 'Tokyo', country: 'JPN', flag: '🇯🇵', surface: 'hard', speed: 6, style: 'stadium', lighting: 'day',
    capacity: 10000, prestige: 3, weather: { label: 'Clair', temperature: 23, wind: [0.2, 0] }, stadium: { backdrop: 'city' },
    look: { court: '#2f6aa8', apron: '#4a8f5a', wall: '#1f2a3a', wallDark: '#141c28', seat: '#33404f', accent: '#d1423c', accentDeep: '#93281f', kick: '#ffd9d6' } });
  venue({ id: 'paris-bercy', order: 23, category: 'iconic', name: 'Paris-Bercy', city: 'Paris', country: 'FRA', flag: '🇫🇷', surface: 'indoor_hard', speed: 7.5, style: 'indoor', lighting: 'indoor',
    capacity: 15500, prestige: 4, weather: { label: 'Salle', temperature: 21, wind: [0, 0] }, conditions: 'Indoor : aucun vent, rebond régulier',
    look: { court: '#2e3f6e', apron: '#1f2630', wall: '#15181e', wallDark: '#0d0f13', seat: '#262b36', accent: '#3b82f6', accentDeep: '#1f56b8', kick: '#d3e4ff' } });

  // ---------- Terrains supplémentaires ----------
  venue({ id: 'indoor-court', order: 30, category: 'extra', name: 'Court indoor', surface: 'indoor_hard', style: 'hall', lighting: 'indoor', capacity: 800, prestige: 1, weather: { label: 'Salle', temperature: 20, wind: [0, 0] },
    look: { wall: '#1c2028', wallDark: '#12151b', seat: '#2a303b', accent: '#3aa0a0', accentDeep: '#226a6a', kick: '#cdf2f2' } });
  venue({ id: 'outdoor-hard', order: 31, category: 'extra', name: 'Court outdoor', surface: 'hard', style: 'club', lighting: 'day', capacity: 600, prestige: 1, weather: { label: 'Clair', temperature: 22, wind: [0.6, 0] },
    look: { wall: '#24402f', wallDark: '#182c20', seat: '#3a4a40', accent: '#3b7be0', accentDeep: '#234f9a', kick: '#d3e2ff' } });
  venue({ id: 'night-hard', order: 32, category: 'extra', name: 'Court de nuit (dur)', surface: 'hard', style: 'stadium', lighting: 'night', capacity: 3000, prestige: 2, weather: { label: 'Nuit claire', temperature: 19, wind: [0, 0] }, stadium: { backdrop: null },
    look: { wall: '#1b2740', wallDark: '#111a2c', seat: '#263249', accent: '#3b7be0', accentDeep: '#234f9a', kick: '#d3e2ff' } });
  venue({ id: 'night-clay', order: 33, category: 'extra', name: 'Court de nuit (terre battue)', surface: 'clay', style: 'stadium', lighting: 'night', capacity: 3000, prestige: 2, weather: { label: 'Nuit fraîche', temperature: 16, wind: [0, 0] }, conditions: 'Terre fraîche : rebond un peu plus bas', bounce: 9, stadium: { backdrop: null },
    look: { wall: '#123a2d', wallDark: '#0b271e', seat: '#24493d', accent: '#d9663a', accentDeep: '#a8431c', kick: '#ffd9c2' } });
  venue({ id: 'small-clay', order: 34, category: 'extra', name: 'Petit court extérieur (terre battue)', surface: 'clay', style: 'club', lighting: 'day', capacity: 400, prestige: 1, weather: { label: 'Ensoleillé', temperature: 23, wind: [0.5, 0] },
    look: { wall: '#1f4a35', wallDark: '#143224', seat: '#3a5a48', accent: '#d9663a', accentDeep: '#a8431c', kick: '#ffd9c2' } });
  venue({ id: 'small-grass', order: 35, category: 'extra', name: 'Petit court extérieur (gazon)', surface: 'grass', style: 'club', lighting: 'day', capacity: 400, prestige: 1, weather: { label: 'Éclaircies', temperature: 19, wind: [0.7, 0] }, light: { clouds: 9 },
    look: { wall: '#1a3d2a', wallDark: '#11281b', seat: '#2f4d3a', accent: '#3f9a5a', accentDeep: '#27683b', kick: '#d6f5df' } });
})();
