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
