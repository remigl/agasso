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
