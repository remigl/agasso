// Archétype de jeu : comportement IA + technique de base. Un joueur le référence et peut le surcharger.
Agasso.define('archetype', {
  id: 'all-court',
  order: 0,
  label: 'Polyvalent',
  desc: 'À l\'aise partout : construit du fond, finit au filet quand l\'occasion se présente.',
  ai: { netRush: 0.1, slice: 0.12, aggression: 0.7 },
  technique: {},
});
