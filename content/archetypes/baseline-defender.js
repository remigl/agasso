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
