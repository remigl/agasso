// Célébration : images clés (t de 0 à 1 sur `duration` s). hx/hz = main raquette, ox/oz = main libre, relatives à l'épaule.
Agasso.define('celebration', {
  id: 'kneel',
  label: 'À genoux',
  duration: 3.0,
  frames: [
    { t: 0, hx: 0.25, hz: -0.3, ox: 0.2, oz: -0.3, crouch: 0.05 },
    { t: 0.15, hx: 0.2, hz: 0.55, ox: 0.2, oz: 0.55, crouch: 0.5 },
    { t: 0.9, hx: 0.14, hz: 0.62, ox: 0.14, oz: 0.62, crouch: 0.52 },
  ],
});
