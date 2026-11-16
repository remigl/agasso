Agasso.define('tournament', {
  id: 'wimbledon',
  order: 1,
  name: 'Wimbledon',
  venue: 'wimbledon',
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
