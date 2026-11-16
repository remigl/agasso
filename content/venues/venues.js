// TOUS LES TERRAINS DU JEU. Ajouter un terrain = ajouter une entrée ici, rien d'autre.
//
// Minimum : { id, name, surface }. Tout le reste a une valeur par défaut (surface, style de stade, éclairage).
// Champs disponibles :
//   name, city, country, flag          identité
//   category                           'grand-slam' | 'iconic' | 'extra' (regroupement dans le menu)
//   surface                            id d'une surface de surfaces.js : clay | grass | hard | indoor_hard
//   speed, bounce                      1–10, remplacent ceux de la surface (vitesse et hauteur du rebond)
//   physics { pace, traction, rest, keep }   réglages fins de gameplay propres au terrain
//   weather { label, temperature, wind: [x, y] en m/s }   météo ; le vent dévie la balle
//   conditions                         texte libre (altitude, humidité…)
//   lighting                           id d'un éclairage de presets.js : day | overcast | dusk | night | indoor
//   light { … }                        surcharges de cet éclairage (soleil, ombres, ciel, nuages…)
//   style                              id d'un style de stade : arena | stadium | club | indoor | hall
//   stadium { … }                      surcharges de ce style (rangées, toit, décor, backdrop, wallText…)
//   capacity                           spectateurs : règle aussi le volume du public
//   ambience { crowd }                 niveau sonore du public (0–1,2) si l'on veut l'imposer
//   look { court, apron, wall, seat, accent, … }   couleurs et aspect ; whites: true = tenues blanches
//   prestige                           1–5
//   tournament                         id du tournoi associé (content/tournaments)
//   camera { pos, look, fw, fh, cy }   surcharges de la caméra pour ce terrain
//   model, skybox                      réservés à un futur rendu 3D (non utilisés par le rendu actuel)
(function () {
  const venue = (def) => Agasso.define('venue', def);
  // Habillages partagés par plusieurs terrains
  const RG = { wall: '#0d4a37', wallDark: '#093527', trim: '#c9553d', seat: '#2b5a4c', parasol: '#f1ece2', accent: '#d9663a', accentDeep: '#a8431c', kick: '#ffd9c2' };
  const WIM = { whites: true, wall: '#143c2b', wallDark: '#0c2a1e', trim: '#6f47a8', seat: '#1f4b37', parasol: '#1d5a3c', accent: '#6f47a8', accentDeep: '#45246e', kick: '#e2d3f7' };
  const USO = { court: '#2c5d9c', apron: '#3f7f58', wall: '#1b2f55', wallDark: '#12203c', seat: '#27364f', accent: '#2f6fd0', accentDeep: '#1b3f85', kick: '#cfe0ff' };
  const AO = { court: '#2a6fb5', apron: '#5aa0d8', wall: '#123a6b', wallDark: '#0b2748', seat: '#1f3c5c', accent: '#1f8fd6', accentDeep: '#0f5a90', kick: '#cfeaff' };

  // ---------- Grands Chelems ----------
  venue({ id: 'roland-garros', order: 0, category: 'grand-slam', name: 'Roland-Garros', city: 'Paris', country: 'FRA', flag: '🇫🇷', surface: 'clay', style: 'arena', lighting: 'day',
    capacity: 15000, prestige: 5, tournament: 'roland-garros', weather: { label: 'Ensoleillé', temperature: 24, wind: [0, 0] }, look: RG, skybox: 'paris-day', model: null });
  venue({ id: 'wimbledon', order: 1, category: 'grand-slam', name: 'Wimbledon', city: 'Londres', country: 'GBR', flag: '🇬🇧', surface: 'grass', style: 'arena', lighting: 'day',
    capacity: 15000, prestige: 5, tournament: 'wimbledon', weather: { label: 'Éclaircies', temperature: 20, wind: [0.4, 0] }, light: { clouds: 10 }, look: WIM, skybox: 'london-day', model: null });
  venue({ id: 'us-open', order: 2, category: 'grand-slam', name: 'US Open', city: 'New York', country: 'USA', flag: '🇺🇸', surface: 'hard', speed: 6, style: 'arena', lighting: 'day',
    capacity: 23000, prestige: 5, tournament: 'us-open', weather: { label: 'Chaud et humide', temperature: 29, wind: [0.5, 0] }, look: USO, skybox: 'new-york-day', model: null });
  venue({ id: 'australian-open', order: 3, category: 'grand-slam', name: 'Australian Open', city: 'Melbourne', country: 'AUS', flag: '🇦🇺', surface: 'hard', style: 'arena', lighting: 'day',
    capacity: 15000, prestige: 5, tournament: 'australian-open', weather: { label: 'Forte chaleur', temperature: 35, wind: [0, 0] }, conditions: 'Chaleur : balle un peu plus vive', physics: { pace: 1.015 }, look: AO, skybox: 'melbourne-day', model: null });

  // ---------- Terrains historiques / emblématiques ----------
  venue({ id: 'arthur-ashe', order: 10, category: 'iconic', name: 'Arthur Ashe Stadium', city: 'New York', country: 'USA', flag: '🇺🇸', surface: 'hard', speed: 6, style: 'arena', lighting: 'night',
    capacity: 23771, prestige: 5, tournament: 'us-open', weather: { label: 'Nuit douce', temperature: 23, wind: [0, 0] }, conditions: 'Session de nuit', look: USO });
  venue({ id: 'philippe-chatrier', order: 11, category: 'iconic', name: 'Court Philippe-Chatrier', city: 'Paris', country: 'FRA', flag: '🇫🇷', surface: 'clay', style: 'arena', lighting: 'dusk',
    capacity: 15225, prestige: 5, tournament: 'roland-garros', weather: { label: 'Fin de journée', temperature: 21, wind: [0, 0] }, look: RG });
  venue({ id: 'suzanne-lenglen', order: 12, category: 'iconic', name: 'Court Suzanne-Lenglen', city: 'Paris', country: 'FRA', flag: '🇫🇷', surface: 'clay', style: 'stadium', lighting: 'day',
    capacity: 10068, prestige: 4, tournament: 'roland-garros', weather: { label: 'Ensoleillé', temperature: 23, wind: [0.3, 0] }, look: RG });
  venue({ id: 'centre-court', order: 13, category: 'iconic', name: 'Centre Court Wimbledon', city: 'Londres', country: 'GBR', flag: '🇬🇧', surface: 'grass', style: 'arena', lighting: 'overcast',
    capacity: 14979, prestige: 5, tournament: 'wimbledon', weather: { label: 'Couvert', temperature: 18, wind: [0.3, 0] }, look: WIM });
  venue({ id: 'rod-laver', order: 14, category: 'iconic', name: 'Rod Laver Arena', city: 'Melbourne', country: 'AUS', flag: '🇦🇺', surface: 'hard', style: 'arena', lighting: 'night',
    capacity: 14820, prestige: 5, tournament: 'australian-open', weather: { label: 'Nuit chaude', temperature: 27, wind: [0, 0] }, conditions: 'Session de nuit', look: AO });
  venue({ id: 'foro-italico', order: 15, category: 'iconic', name: 'Foro Italico', city: 'Rome', country: 'ITA', flag: '🇮🇹', surface: 'clay', style: 'stadium', lighting: 'day',
    capacity: 10500, prestige: 4, weather: { label: 'Ensoleillé', temperature: 26, wind: [0, 0] }, stadium: { backdrop: 'trees' },
    look: { wall: '#2d4a3a', wallDark: '#1e3327', trim: null, seat: '#b9b2a0', accent: '#1f7a4d', accentDeep: '#135233', kick: '#d6f0e0' } });
  venue({ id: 'monte-carlo', order: 16, category: 'iconic', name: 'Monte-Carlo Country Club', city: 'Monte-Carlo', country: 'MCO', flag: '🇲🇨', surface: 'clay', style: 'stadium', lighting: 'day',
    capacity: 10200, prestige: 4, weather: { label: 'Brise marine', temperature: 20, wind: [0.8, 0] }, stadium: { backdrop: 'sea', rowsBack: 9 },
    look: { wall: '#1d5a84', wallDark: '#123f5e', trim: '#f1ece2', seat: '#2f5f7f', accent: '#c8372d', accentDeep: '#8f231c', kick: '#ffd6d1' } });
  venue({ id: 'caja-magica', order: 17, category: 'iconic', name: 'Caja Mágica', city: 'Madrid', country: 'ESP', flag: '🇪🇸', surface: 'clay', speed: 4.5, style: 'arena', lighting: 'day',
    capacity: 12442, prestige: 4, weather: { label: 'Sec', temperature: 25, wind: [0, 0] }, conditions: 'Altitude 650 m : balle plus rapide', physics: { pace: 1.03 },
    look: { wall: '#2b2f36', wallDark: '#1c1f24', trim: null, seat: '#3a3f48', accent: '#e0a020', accentDeep: '#a87410', kick: '#ffe9b8' } });
  venue({ id: 'indian-wells', order: 18, category: 'iconic', name: 'Indian Wells', city: 'Californie', country: 'USA', flag: '🇺🇸', surface: 'hard', speed: 4.5, bounce: 9, style: 'arena', lighting: 'day',
    capacity: 16100, prestige: 4, weather: { label: 'Sec et venteux', temperature: 30, wind: [1.6, 0.3] }, conditions: 'Désert : rebond haut, vent', stadium: { backdrop: 'hills', roof: false, upperAt: 0, rowsBack: 18 }, light: { clouds: 1 },
    look: { court: '#5a3f8f', apron: '#3f7d57', wall: '#2a2444', wallDark: '#1c1830', seat: '#3a3552', accent: '#7a55c0', accentDeep: '#4d3285', kick: '#e3d6ff' } });
  venue({ id: 'miami', order: 19, category: 'iconic', name: 'Miami Open', city: 'Miami', country: 'USA', flag: '🇺🇸', surface: 'hard', speed: 5, style: 'stadium', lighting: 'day',
    capacity: 13800, prestige: 4, weather: { label: 'Humide', temperature: 28, wind: [0.7, 0] }, stadium: { backdrop: 'city' },
    look: { court: '#2b5fa8', apron: '#2f8f8a', wall: '#0f4a55', wallDark: '#0a333b', seat: '#205a64', accent: '#16a3a0', accentDeep: '#0c6b69', kick: '#c9f5f2' } });
  venue({ id: 'cincinnati', order: 20, category: 'iconic', name: 'Cincinnati', city: 'Cincinnati', country: 'USA', flag: '🇺🇸', surface: 'hard', speed: 6.5, style: 'stadium', lighting: 'day',
    capacity: 11400, prestige: 3, weather: { label: 'Chaud', temperature: 30, wind: [0.3, 0] },
    look: { court: '#2d5aa0', apron: '#27447a', wall: '#1d2f52', wallDark: '#131f38', seat: '#2c3d5c', accent: '#3b7be0', accentDeep: '#234f9a', kick: '#d3e2ff' } });
  venue({ id: 'shanghai', order: 21, category: 'iconic', name: 'Shanghai', city: 'Shanghai', country: 'CHN', flag: '🇨🇳', surface: 'hard', speed: 6.5, style: 'arena', lighting: 'dusk',
    capacity: 15000, prestige: 3, weather: { label: 'Doux', temperature: 22, wind: [0, 0] },
    look: { court: '#3b4fa0', apron: '#3f7d57', wall: '#2a2f5a', wallDark: '#1b1f3d', seat: '#3a3f66', accent: '#c8372d', accentDeep: '#8f231c', kick: '#ffd6d1' } });
  venue({ id: 'tokyo', order: 22, category: 'iconic', name: 'Tokyo', city: 'Tokyo', country: 'JPN', flag: '🇯🇵', surface: 'hard', speed: 6, style: 'stadium', lighting: 'day',
    capacity: 10000, prestige: 3, weather: { label: 'Clair', temperature: 23, wind: [0.2, 0] }, stadium: { backdrop: 'city' },
    look: { court: '#2f6aa8', apron: '#4a8f5a', wall: '#1f2a3a', wallDark: '#141c28', seat: '#33404f', accent: '#d1423c', accentDeep: '#93281f', kick: '#ffd9d6' } });
  venue({ id: 'paris-bercy', order: 23, category: 'iconic', name: 'Paris-Bercy', city: 'Paris', country: 'FRA', flag: '🇫🇷', surface: 'indoor_hard', speed: 7.5, style: 'indoor', lighting: 'indoor',
    capacity: 15500, prestige: 4, weather: { label: 'Salle', temperature: 21, wind: [0, 0] }, conditions: 'Indoor : aucun vent, rebond régulier',
    look: { court: '#2e3f6e', apron: '#1f2630', wall: '#15181e', wallDark: '#0d0f13', seat: '#262b36', accent: '#3b82f6', accentDeep: '#1f56b8', kick: '#d3e4ff' } });

  // ---------- Terrains supplémentaires ----------
  venue({ id: 'indoor-court', order: 30, category: 'extra', name: 'Court indoor', surface: 'indoor_hard', style: 'hall', lighting: 'indoor', capacity: 800, prestige: 1, weather: { label: 'Salle', temperature: 20, wind: [0, 0] },
    look: { wall: '#1c2028', wallDark: '#12151b', seat: '#2a303b', accent: '#3aa0a0', accentDeep: '#226a6a', kick: '#cdf2f2' } });
  venue({ id: 'outdoor-hard', order: 31, category: 'extra', name: 'Court outdoor', surface: 'hard', style: 'club', lighting: 'day', capacity: 600, prestige: 1, weather: { label: 'Clair', temperature: 22, wind: [0.6, 0] },
    look: { wall: '#24402f', wallDark: '#182c20', seat: '#3a4a40', accent: '#3b7be0', accentDeep: '#234f9a', kick: '#d3e2ff' } });
  venue({ id: 'night-hard', order: 32, category: 'extra', name: 'Court de nuit (dur)', surface: 'hard', style: 'stadium', lighting: 'night', capacity: 3000, prestige: 2, weather: { label: 'Nuit claire', temperature: 19, wind: [0, 0] }, stadium: { backdrop: null },
    look: { wall: '#1b2740', wallDark: '#111a2c', seat: '#263249', accent: '#3b7be0', accentDeep: '#234f9a', kick: '#d3e2ff' } });
  venue({ id: 'night-clay', order: 33, category: 'extra', name: 'Court de nuit (terre battue)', surface: 'clay', style: 'stadium', lighting: 'night', capacity: 3000, prestige: 2, weather: { label: 'Nuit fraîche', temperature: 16, wind: [0, 0] }, conditions: 'Terre fraîche : rebond un peu plus bas', bounce: 9, stadium: { backdrop: null },
    look: { wall: '#123a2d', wallDark: '#0b271e', seat: '#24493d', accent: '#d9663a', accentDeep: '#a8431c', kick: '#ffd9c2' } });
  venue({ id: 'small-clay', order: 34, category: 'extra', name: 'Petit court extérieur (terre battue)', surface: 'clay', style: 'club', lighting: 'day', capacity: 400, prestige: 1, weather: { label: 'Ensoleillé', temperature: 23, wind: [0.5, 0] },
    look: { wall: '#1f4a35', wallDark: '#143224', seat: '#3a5a48', accent: '#d9663a', accentDeep: '#a8431c', kick: '#ffd9c2' } });
  venue({ id: 'small-grass', order: 35, category: 'extra', name: 'Petit court extérieur (gazon)', surface: 'grass', style: 'club', lighting: 'day', capacity: 400, prestige: 1, weather: { label: 'Éclaircies', temperature: 19, wind: [0.7, 0] }, light: { clouds: 9 },
    look: { wall: '#1a3d2a', wallDark: '#11281b', seat: '#2f4d3a', accent: '#3f9a5a', accentDeep: '#27683b', kick: '#d6f5df' } });
})();
