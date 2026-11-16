// Noyau : espace de noms, utilitaires et registre de contenu.
// Tout le contenu du jeu (joueurs, archétypes, terrains, tournois, musiques, célébrations)
// est déclaré par des fichiers de données via Agasso.define(type, {...}).
(function (root) {
  const A = (root.Agasso = root.Agasso || {});
  A.clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  A.lerp = (a, b, t) => a + (b - a) * t;
  A.rngFrom = (seed) => { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };

  // Fusion profonde sans mutation : les objets sont fusionnés, le reste est remplacé.
  A.merge = function merge(base, over) {
    if (over === undefined) return base;
    const obj = (v) => v && typeof v === 'object' && !Array.isArray(v);
    if (!obj(base) || !obj(over)) return over;
    const out = Object.assign({}, base);
    for (const k of Object.keys(over)) out[k] = merge(base[k], over[k]);
    return out;
  };

  const reg = (A.registry = A.registry || {});
  A.define = (type, def) => {
    if (!def || !def.id) throw new Error('Agasso.define(' + type + ') : il manque un id');
    (reg[type] = reg[type] || {})[def.id] = def;
    return def;
  };
  A.get = (type, id) => (reg[type] || {})[id] || null;
  A.need = (type, id) => { const d = A.get(type, id); if (!d) throw new Error(type + ' inconnu : ' + id); return d; };
  A.all = (type) => Object.values(reg[type] || {}).sort((a, b) => (a.order || 0) - (b.order || 0) || String(a.name || a.id).localeCompare(String(b.name || b.id)));
})(typeof window !== 'undefined' ? window : globalThis);
