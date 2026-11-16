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
