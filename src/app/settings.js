// Réglages utilisateur : décrits par un schéma (l'écran Options est généré à partir de lui) et sauvegardés.
(function (root) {
  const A = root.Agasso;

  A.SETTINGS = [
    { key: 'difficulty', label: 'Difficulté', options: Object.entries(A.DIFFICULTY).map(([k, d]) => [k, d.label]), def: 'normal' },
    { key: 'camera', label: 'Caméra', options: () => Object.entries(A.CAMERAS).map(([k, c]) => [k, c.label]), def: 'tv' },
    { key: 'quality', label: 'Qualité de rendu', options: [['perf', 'Performance (upscaling)'], ['balanced', 'Équilibré'], ['native', 'Natif'], ['ultra', 'Ultra (suréchantillonné)']], def: 'native' },
    { key: 'music', label: 'Musique', options: [['0', 'Coupée'], ['0.3', 'Douce'], ['0.55', 'Normale'], ['0.85', 'Forte']], def: '0.55' },
    { key: 'sfx', label: 'Effets sonores', options: [['0', 'Coupés'], ['0.5', 'Doux'], ['0.9', 'Normaux']], def: '0.9' },
    { key: 'voice', label: 'Voix de l’arbitre', options: [['on', 'Activée'], ['off', 'Coupée']], def: 'on' },
  ];
  // Échelle de rendu interne par niveau de qualité (< 1 : image calculée plus petite puis agrandie).
  A.RENDER_SCALE = { perf: 0.6, balanced: 0.8, native: 1, ultra: 1.5 };

  const KEY = 'agasso-v2-';
  const Store = {
    get(name, fallback) { try { const v = JSON.parse(localStorage.getItem(KEY + name)); return v == null ? fallback : v; } catch (e) { return fallback; } },
    set(name, value) { try { if (value == null) localStorage.removeItem(KEY + name); else localStorage.setItem(KEY + name, JSON.stringify(value)); } catch (e) { /* stockage indisponible */ } },
  };

  const values = Object.assign(Object.fromEntries(A.SETTINGS.map((s) => [s.key, s.def])), Store.get('settings', {}));
  A.Store = Store;
  A.Settings = {
    get: (k) => values[k],
    set(k, v) { values[k] = v; Store.set('settings', values); },
    optionsOf: (s) => (typeof s.options === 'function' ? s.options() : s.options),
  };
})(typeof window !== 'undefined' ? window : globalThis);
