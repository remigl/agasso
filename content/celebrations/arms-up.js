// Célébration : images clés (t de 0 à 1 sur `duration` s). hx/hz = main raquette, ox/oz = main libre, relatives à l'épaule.
Agasso.define('celebration', {
  id: 'arms-up',
  label: 'Bras levés',
  duration: 2.4,
  frames: [
    { t: 0, hx: 0.25, hz: -0.3, ox: 0.2, oz: -0.3 },
    { t: 0.2, hx: 0.2, hz: 0.62, ox: 0.2, oz: 0.62, crouch: 0 },
    { t: 0.8, hx: 0.16, hz: 0.66, ox: 0.16, oz: 0.66, lean: 0.03 },
    { t: 0.95, hx: 0.2, hz: 0.62, ox: 0.2, oz: 0.62, lean: -0.03 },
  ],
});
