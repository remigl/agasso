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
