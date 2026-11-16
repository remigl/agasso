// Résolution des coups : traduit « tel joueur frappe tel coup dans telle situation » en trajectoire.
// C'est ici que la technique individuelle (content/players + content/archetypes) devient du jeu.
(function (root) {
  const A = root.Agasso, { clamp, lerp } = A;

  // Dispersion liée au mental : points importants et agacement après une faute.
  function nerves(g, p) {
    const m = p.profile.stats.mental, E = A.STAT_EFFECT;
    return Math.max(0.7, 1 + g.pressure * E.mental * (A.BASE.pivot - m) + p.tilt * 0.04 * (10 - m) * (1 + p.profile.temper));
  }

  // Atténue un multiplicateur de fiche (pace, margin) : la signature colore le jeu sans le décider.
  const soft = (m) => 1 + (m - 1) * A.TUNE.signature;

  // Coup en cours d'échange. sw = geste en cours, d = distance joueur–balle au contact.
  function rally(g, p, sw, d) {
    const b = g.ball, a = p.a, t = p.profile.tech, T = A.TUNE, inp = p.inp;
    const side = g.sideOf(p), wing = side === 'fh' ? t.forehand : t.backhand;
    const ax = clamp(inp.aimX, -1, 1), ad = clamp(inp.aimDepth, -1, 1), up = Math.max(0, wing.spin);
    let kind = sw.kind, depth, speed, wide = 3.7, rf = 1, spin = 0, clear = 1.15;
    if (kind === 'flat' && b.z > 2.3) kind = 'smash';
    else if (kind === 'flat' && b.bounces === 0) kind = 'volley';
    else if (kind === 'flat' && wing.spin <= -0.4) kind = 'slice'; // revers naturellement slicé
    switch (kind) {
      case 'smash': depth = 7.6 + ad * 2; speed = a.smash * soft(t.smash.pace) * (b.bounces ? 0.82 : 1); rf = (b.bounces ? 1.1 : 0.8) * soft(t.smash.margin); break; // smash après rebond : moins tranchant
      case 'lob': depth = 10.1 + ad * 0.7; speed = a.lob; wide = 2.7; rf = 0.85 * soft(t.lob.margin); clear = 2.5; spin = 0.3; break;
      case 'drop': depth = 2.6 + (ad + 1) * 0.5; speed = a.drop; wide = 3.0; rf = 1.15 * soft(t.drop.margin); spin = -0.6; break;
      case 'slice': depth = 8.6 + ad * 2.4; speed = a.slice * soft(t.slice.pace); rf = soft(t.slice.margin); spin = -0.8; clear = 1.05; break;
      case 'volley': depth = 7.6 + ad * 2.5; speed = a.volley * soft(t.volley.pace); wide = 3.2; rf = 1.1 * soft(t.volley.margin); spin = -0.1; break;
      default: depth = 8.6 + ad * 2.8; speed = a.flat * soft(wing.pace); rf = soft(wing.margin) * (1 - 0.18 * up); spin = wing.spin; clear = 1.15 + 0.15 * up; // le lift fait plonger la balle dans le court
    }
    if (b.inServe && (kind === 'flat' || kind === 'slice')) { speed *= soft(t.return.pace); rf *= soft(t.return.margin); }
    if (kind === 'flat') speed *= 1 + 0.05 * t.early; // balle prise tôt : moins de temps pour l'adversaire
    const run = Math.hypot(p.vx, p.vy) / a.speed;
    const q = clamp(1 - T.stretchPen * a.defense * clamp((d - 1.1) / 1.0, 0, 1) - T.timingPen * clamp(Math.abs(sw.t - 0.12) / 0.18, 0, 1) - T.runPen * a.defense * clamp(run, 0, 1), 0, 1);
    const r = lerp(T.rMax, T.rMin, q) * rf * a.control * nerves(g, p);
    if (kind !== 'lob' && q < 0.25 && g.rng() < 0.5) clear = 0; // frappe ratée : peut finir dans le filet
    return { kind, side, q, speed, spin, clear, tx: ax * wide + g.tri() * r, ty: -p.sgn * (depth + g.tri() * r) };
  }

  // Service. kind = 'flat' (première puissante) ou 'spin' (sécurité liftée) ; tossT = instant de frappe du lancer.
  function serve(g, p, kind, tossT) {
    const a = p.a, t = p.profile.tech.serve, flat = kind === 'flat';
    const q = 1 - clamp(Math.abs(tossT - 0.65) / 0.4, 0, 1); // 1 au sommet du lancer
    const r = (flat ? lerp(2.3, 0.4, q) : lerp(1.6, 0.25, q)) * soft(t.margin) * a.serveControl * nerves(g, p);
    return {
      kind, q, speed: flat ? a.serve1 * soft(t.pace) * (0.86 + 0.14 * q) : a.serve2, spin: flat ? 0 : clamp(0.4 + t.spin * 0.6, 0, 1),
      clear: q > 0.3 ? 1.03 : 0,
      tx: g.boxSign * 2.06 + clamp(p.inp.aimX, -1, 1) * 1.4 + g.tri() * r * 0.8,
      ty: -p.sgn * ((flat ? 5.2 : 4.7) + g.tri() * r),
    };
  }

  A.Shots = { rally, serve, nerves };
})(typeof window !== 'undefined' ? window : globalThis);
