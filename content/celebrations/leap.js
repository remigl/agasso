// Célébration : images clés (t de 0 à 1 sur `duration` s). hx/hz = main raquette, ox/oz = main libre, relatives à l'épaule.
Agasso.define('celebration', {
  id: 'leap',
  label: 'Saut de joie',
  duration: 0.9,
  frames: [
    { t: 0, hx: 0.3, hz: -0.3, ox: 0.25, oz: -0.3, crouch: 0.25, jump: 0 },
    { t: 0.35, hx: 0.22, hz: 0.6, ox: 0.05, oz: 0.5, crouch: 0, jump: 0.45 },
    { t: 0.7, hx: 0.3, hz: 0.1, ox: 0.2, oz: 0.0, crouch: 0.22, jump: 0 },
  ],
});
