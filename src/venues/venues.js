// Terrains : transforme une entrée de content/venues/venues.js en configuration complète.
//   terrain = valeurs par défaut ⊕ surface ⊕ style de stade ⊕ éclairage ⊕ surcharges du terrain
// Le gameplay lit `physics` et `family` ; le rendu lit `look`, `stadium`, `lighting`, `camera` ; le son lit `crowd`.
// Aucun terrain n'est connu du code : tout vient des données.
(function (root) {
  const A = root.Agasso, { clamp, merge } = A, cache = {};

  const DEFAULTS = {
    city: '', country: '', flag: '', category: 'extra', style: 'stadium', lighting: 'day', capacity: 1500, prestige: 1,
    tournament: null, conditions: '', model: null, skybox: null, camera: null,
    weather: { label: 'Temps clair', temperature: 22, wind: [0, 0] },
    look: { whites: false, wall: '#1f3a2e', wallDark: '#14271f', trim: null, seat: '#2f3b44', parasol: '#ebe6da', roof: '#e2e5e7', lines: 'rgba(250,250,244,.94)', sky: ['#5f9fd6', '#cfe2ee'], accent: '#3b7be0', accentDeep: '#234f9a', kick: '#d3e2ff' },
  };
  A.VENUE_CATEGORIES = [['grand-slam', 'Grands Chelems'], ['iconic', 'Terrains emblématiques'], ['extra', 'Autres courts']];

  // Échelles 1–10 → coefficients de rebond du moteur.
  const keepOf = (speed) => 0.70 + 0.02 * speed, restOf = (bounce) => 0.54 + 0.02 * bounce;

  function get(id) {
    if (cache[id]) return cache[id];
    const raw = A.need('venue', id), s = A.need('surface', raw.surface);
    const v = merge(DEFAULTS, raw), style = A.need('stadium', v.style), light = A.need('lighting', v.lighting);
    const stadium = merge(style, raw.stadium), lighting = merge(light, raw.light);
    const speed = raw.speed != null ? raw.speed : s.speed, bounce = raw.bounce != null ? raw.bounce : s.bounce;
    const fill = stadium.fill;
    return (cache[id] = Object.freeze(Object.assign({}, v, {
      surface: s.id, family: s.family || s.id, surfaceLabel: s.label, speed, bounce, stadium, lighting,
      styleLabel: style.label, lightingLabel: light.label,
      // Gameplay : tout ce dont le moteur a besoin, et rien d'autre.
      physics: Object.freeze(merge(merge({ rest: restOf(bounce), keep: keepOf(speed), pace: 1, traction: 1, wind: stadium.indoor ? [0, 0] : v.weather.wind }, s.physics), raw.physics)),
      look: merge(merge(merge(DEFAULTS.look, s.look), lighting.sky ? { sky: lighting.sky } : undefined), raw.look),
      camera: merge(stadium.camera, raw.camera) || null,
      crowd: raw.ambience && raw.ambience.crowd != null ? raw.ambience.crowd : clamp((Math.log10(Math.max(100, v.capacity)) - 1.6) / 2.4, 0.25, 1.2) * fill, // niveau sonore du public
    })));
  }

  A.Venues = { get, all: () => A.all('venue').map((d) => get(d.id)), ids: () => A.all('venue').map((d) => d.id), keepOf, restOf };
})(typeof window !== 'undefined' ? window : globalThis);
