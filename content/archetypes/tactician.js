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
