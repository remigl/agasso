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
