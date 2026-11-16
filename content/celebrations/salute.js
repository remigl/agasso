// Célébration : images clés (t de 0 à 1 sur `duration` s). hx/hz = main raquette, ox/oz = main libre, relatives à l'épaule.
Agasso.define('celebration', {
  id: 'salute',
  label: 'Salut au public',
  duration: 2.0,
  frames: [
    { t: 0, hx: 0.2, hz: 0.6, ox: 0.2, oz: -0.4, lean: 0.04 },
    { t: 0.5, hx: 0.3, hz: 0.55, ox: 0.2, oz: -0.4, lean: -0.04 },
    { t: 0.99, hx: 0.2, hz: 0.6, ox: 0.2, oz: -0.4, lean: 0.04 },
  ],
});
