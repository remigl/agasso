// Surfaces génériques. Un terrain choisit sa surface par son id ; le moteur ne connaît que ces données.
//   speed  (1–10) : vitesse conservée au rebond — 1 = très lent, 10 = très rapide
//   bounce (1–10) : hauteur du rebond — 1 = très bas, 10 = très haut
//   physics.traction : accroche des appuis (1 = normale, moins = on glisse)
//   physics.pace     : vitesse de balle dans l'air (1 = normale)
//   family : sert à l'affinité des joueurs (`surfaces: { clay: 1 }` dans leur fiche)
//   look   : aspect par défaut du court (le terrain peut tout surcharger)
Agasso.define('surface', {
  id: 'clay', label: 'Terre battue', family: 'clay', speed: 3, bounce: 10, physics: { traction: 0.9 },
  look: { court: '#c2603a', courtLight: '#d1744b', apron: null, grain: 'clay', stripes: false, dust: '214,146,104', mark: '112,46,18', wear: '255,205,170' },
});
Agasso.define('surface', {
  id: 'grass', label: 'Gazon', family: 'grass', speed: 7.5, bounce: 5, physics: { traction: 0.95 },
  look: { court: '#4b8a3a', courtLight: '#589646', apron: null, grain: 'grass', stripes: true, dust: '214,226,170', mark: null, wear: '176,150,92' },
});
Agasso.define('surface', {
  id: 'hard', label: 'Dur', family: 'hard', speed: 5.5, bounce: 8, physics: { traction: 1 },
  look: { court: '#2f5f9e', courtLight: null, apron: '#3f7d57', grain: 'hard', stripes: false, dust: null, mark: null, wear: null },
});
Agasso.define('surface', {
  id: 'indoor_hard', label: 'Dur indoor', family: 'hard', speed: 7, bounce: 7, physics: { traction: 1 },
  look: { court: '#34507f', courtLight: null, apron: '#2a3442', grain: 'hard', stripes: false, dust: null, mark: null, wear: null },
});
