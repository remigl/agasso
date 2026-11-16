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
