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

// --- venues/roland-garros.js
// Terrain : `physics` est lu par le gameplay, `look` uniquement par le rendu.
Agasso.define('venue', {
  id: 'roland-garros',
  order: 0,
  name: 'Roland-Garros',
  city: 'Paris',
  surface: 'clay',
  surfaceLabel: 'Terre battue',
  physics: { rest: 0.74, keep: 0.76 },
  look: {
    whites: false,
    court: '#c2603a',
    courtDark: '#ad5230',
    courtLight: '#d1744b',
    wall: '#0d4a37',
    wallDark: '#093527',
    trim: '#c9553d',
    seat: '#2b5a4c',
    dust: '214,146,104',
    mark: '112,46,18',
    sky: ['#5f9fd6', '#cfe2ee'],
    parasol: '#f1ece2',
    roof: '#e4e7e9',
    stripes: false,
    wear: '255,205,170',
    accent: '#d9663a',
    accentDeep: '#a8431c',
    kick: '#ffd9c2',
  },
});

// --- venues/wimbledon.js
Agasso.define('venue', {
  id: 'wimbledon',
  order: 1,
  name: 'Wimbledon',
  city: 'Londres',
  surface: 'grass',
  surfaceLabel: 'Gazon',
  physics: { rest: 0.64, keep: 0.85 },
  look: {
    whites: true,
    court: '#4b8a3a',
    courtDark: '#417a32',
    courtLight: '#589646',
    wall: '#143c2b',
    wallDark: '#0c2a1e',
    trim: '#6f47a8',
    seat: '#1f4b37',
    dust: '214,226,170',
    mark: null,
    sky: ['#7aaad2', '#e1e9ee'],
    parasol: '#1d5a3c',
    roof: '#dce2df',
    stripes: true,
    wear: '176,150,92',
    accent: '#6f47a8',
    accentDeep: '#45246e',
    kick: '#e2d3f7',
  },
});
