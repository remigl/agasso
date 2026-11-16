// Célébration : images clés (t de 0 à 1 sur `duration` s). hx/hz = main raquette, ox/oz = main libre, relatives à l'épaule.
Agasso.define('celebration', {
  id: 'fist-pump',
  label: 'Poing serré',
  duration: 1.1,
  frames: [
    { t: 0, hx: 0.3, hz: -0.4, ox: 0.05, oz: -0.1, crouch: 0.12 },
    { t: 0.25, hx: 0.3, hz: -0.3, ox: 0.0, oz: 0.25, crouch: 0.2, lean: 0.05 },
    { t: 0.5, hx: 0.3, hz: -0.4, ox: 0.05, oz: -0.05, crouch: 0.1 },
    { t: 0.75, hx: 0.3, hz: -0.3, ox: 0.0, oz: 0.28, crouch: 0.2, lean: 0.05 },
  ],
});
