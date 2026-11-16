// Préréglages réutilisables par les terrains : style de stade et éclairage.
// Un terrain les référence (`style: 'arena'`, `lighting: 'night'`) et peut en surcharger chaque champ.

// --- Styles de stade ---
//   rowsBack / rowsSide : rangées de gradins ; upperAt : rangée où commence le second niveau (0 = aucun)
//   fill : taux de remplissage du public ; backdrop : 'trees' | 'sea' | 'city' | 'hills' | null
Agasso.define('stadium', { id: 'arena', label: 'Grand stade', rowsBack: 24, upperAt: 12, rowsSide: 20, roof: true, indoor: false, fill: 0.95, flags: true, benches: true, flowers: true, backdrop: null, camera: null });
Agasso.define('stadium', { id: 'stadium', label: 'Stade', rowsBack: 15, upperAt: 0, rowsSide: 13, roof: false, indoor: false, fill: 0.9, flags: true, benches: true, flowers: true, backdrop: 'city', camera: null });
Agasso.define('stadium', { id: 'club', label: 'Court de club', rowsBack: 4, upperAt: 0, rowsSide: 3, roof: false, indoor: false, fill: 0.6, flags: false, benches: true, flowers: false, backdrop: 'trees', camera: null });
Agasso.define('stadium', { id: 'indoor', label: 'Salle', rowsBack: 22, upperAt: 11, rowsSide: 18, roof: false, indoor: true, fill: 0.95, flags: false, benches: true, flowers: false, backdrop: null, camera: null });
Agasso.define('stadium', { id: 'hall', label: 'Petite salle', rowsBack: 6, upperAt: 0, rowsSide: 5, roof: false, indoor: true, fill: 0.7, flags: false, benches: true, flowers: false, backdrop: null, camera: null });

// --- Éclairages ---
//   sun : décalage de l'ombre au sol par mètre de hauteur (null = pas de soleil) ; shadow : opacité des ombres
//   standShadow : grande ombre de tribune sur le court ; floodlights : projecteurs (ombres multiples)
//   dim : assombrissement des tribunes ; sky / clouds / stars : ciel ; glow : teinte de la lumière sur le court
Agasso.define('lighting', { id: 'day', label: 'Jour', time: 'day', sun: [-0.55, 0.3], shadow: 0.27, standShadow: true, floodlights: false, dim: 0, sky: null, clouds: 6, stars: false, glow: '255,232,188' });
Agasso.define('lighting', { id: 'overcast', label: 'Couvert', time: 'day', sun: null, shadow: 0.16, standShadow: false, floodlights: false, dim: 0.08, sky: ['#8f9aa5', '#cfd5da'], clouds: 14, stars: false, glow: '225,230,235' });
Agasso.define('lighting', { id: 'dusk', label: 'Fin de journée', time: 'dusk', sun: [-1.15, 0.45], shadow: 0.3, standShadow: true, floodlights: true, dim: 0.14, sky: ['#3f5f9a', '#f2b27a'], clouds: 4, stars: false, glow: '255,200,140' });
Agasso.define('lighting', { id: 'night', label: 'Nuit', time: 'night', sun: null, shadow: 0.11, standShadow: false, floodlights: true, dim: 0.56, sky: ['#050814', '#1a2340'], clouds: 0, stars: true, glow: '230,238,255' });
Agasso.define('lighting', { id: 'indoor', label: 'Salle', time: 'indoor', sun: null, shadow: 0.11, standShadow: false, floodlights: true, dim: 0.5, sky: ['#090b10', '#1b2029'], clouds: 0, stars: false, glow: '235,240,255' });
