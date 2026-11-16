Agasso.define('tournament', {
  id: 'australian-open',
  order: 3,
  name: 'Australian Open',
  venue: 'australian-open',
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
