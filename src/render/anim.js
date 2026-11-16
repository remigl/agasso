// Animation : traduit l'état d'un joueur (lu dans le gameplay) en pose pour render/figure.js.
// Le style vient des données du joueur : main dominante, revers à une ou deux mains, préparation,
// style de déplacement, célébration.
(function (root) {
  const A = root.Agasso, { clamp, lerp } = A;
  const STRIDE = { neutral: 1, glide: 0.85, grinder: 1.05, explosive: 1.2, power: 1, forward: 1.05, compact: 0.9 };
  const BACKSWING = { classic: -0.6, loop: -1.05, compact: -0.3 };

  // Tenue : sur un terrain « tout en blanc », la couleur du joueur passe en liseré.
  function look(def, venue) {
    const l = Object.assign({ gender: def.gender, skirt: def.gender === 'F' }, def.look);
    return venue && venue.look.whites ? Object.assign(l, { shirt: '#f8f7f2', shorts: '#f8f7f2', accent: def.look.shirt === '#f5f3ee' ? def.look.accent : def.look.shirt }) : l;
  }

  // Pose interpolée d'une célébration (content/celebrations/*.js) à l'instant t.
  function celebrate(id, t) {
    const c = A.get('celebration', id) || A.all('celebration')[0], fr = c.frames, u = (t / c.duration) % 1;
    let i = fr.length - 1; while (i > 0 && fr[i].t > u) i--;
    const a = fr[i], b = fr[(i + 1) % fr.length], span = ((b.t - a.t + 1) % 1) || 1, k = clamp((u - a.t) / span, 0, 1), e = k * k * (3 - 2 * k);
    const v = (key, d) => lerp(a[key] != null ? a[key] : d, b[key] != null ? b[key] : d, e);
    return { hands: { hx: v('hx', 0.26), hz: v('hz', -0.5), ox: v('ox', 0.06), oz: v('oz', -0.5) }, crouch: v('crouch', 0), jump: v('jump', 0), lean: v('lean', 0) };
  }

  // g = match, pl = joueur, time = horloge du rendu, cele = {winner, t} pendant la célébration.
  function pose(g, pl, time, cele) {
    const base = { away: pl.sgn > 0, fh: pl.sgn * pl.profile.hand };
    if (cele) {
      if (cele.winner === pl.i) return Object.assign(base, celebrate(pl.def.celebration, cele.t), { away: false, fh: pl.profile.hand, noRacket: false });
      return Object.assign(base, { hands: { hx: 0.02, hz: -0.5, ox: 0.02, oz: -0.5 }, lean: 0.03, crouch: 0.02 });
    }
    const t = pl.profile.tech, sp = Math.hypot(pl.vx, pl.vy) / pl.a.speed, serving = (g.phase === 'ready' || g.phase === 'toss') && g.server === pl.i;
    const ready = !pl.swing && !serving && g.phase !== 'over' && g.phase !== 'done';
    const sw = pl.swing;
    return Object.assign(base, {
      run: pl.run, speed: sp > 0.08 ? Math.min(1, sp) : 0, stride: STRIDE[t.movement.style] || 1,
      lean: clamp(-pl.vx * 0.02, -0.14, 0.14),
      crouch: serving ? 0.02 : (ready ? 0.07 + 0.02 * Math.sin((time + pl.i) * 7) : 0.03) + Math.min(1, sp) * 0.04,
      wide: ready ? 0.07 : 0.02, ready: ready && sp < 0.5,
      toss: g.phase === 'toss' && serving,
      swing: sw ? { anim: sw.anim, p: sw.t / 0.42, back: BACKSWING[t.prep], hands: sw.anim === 'bh' ? t.backhand.hands : sw.anim === 'fh' ? t.forehand.hands || 1 : 1 } : null,
    });
  }

  A.Anim = { pose, look, celebrate };
})(typeof window !== 'undefined' ? window : globalThis);
