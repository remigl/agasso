// Physique de la balle : trajectoire balistique, filet, rebond selon la surface et l'effet.
(function (root) {
  const A = root.Agasso, { COURT, G } = A;

  const netHeightAt = (x) => 0.914 + 0.156 * Math.min(1, Math.abs(x) / COURT.postX);

  // Coefficients de rebond : surface du terrain modulée par l'effet de la balle (−1 slice … +1 lift).
  function bounce(venue, spin) {
    const s = spin || 0, ph = venue.physics;
    // Le lift gicle vers l'avant et vers le haut ; le slice rase et fuse.
    return { rest: ph.rest * (1 + 0.2 * s), keep: ph.keep * (s > 0 ? 1 + 0.12 * s : 1 - 0.05 * s) };
  }

  // Donne à la balle la vitesse qui l'amène en (tx, ty) ; `clear` = hauteur mini au filet (0 = aucune garantie).
  function launch(b, tx, ty, speed, clear) {
    const dx = tx - b.x, dy = ty - b.y;
    let T = Math.max(0.22, Math.hypot(dx, dy) / speed), vz = 0;
    for (let i = 0; i < 60; i++) {
      vz = (-b.z + 0.5 * G * T * T) / T;
      if (!clear || b.y * ty >= 0) break;
      const tn = -b.y / (dy / T), zn = b.z + vz * tn - 0.5 * G * tn * tn;
      if (zn >= clear + netHeightAt(b.x + (dx / T) * tn) - 0.914) break;
      T *= 1.05;
    }
    b.vx = dx / T; b.vy = dy / T; b.vz = vz;
  }

  // Point de chute prévu d'une balle en vol.
  function landing(b) {
    const t = (b.vz + Math.sqrt(b.vz * b.vz + 2 * G * Math.max(0, b.z))) / G;
    return { x: b.x + b.vx * t, y: b.y + b.vy * t, t };
  }

  // La balle touche-t-elle une ligne ? (pour la craie qui vole)
  function onLine(x, y) {
    const c = COURT, ax = Math.abs(x), ay = Math.abs(y), w = 0.09;
    if (ax > c.halfW + w || ay > c.halfL + w) return false;
    return Math.abs(ax - c.halfW) < w || Math.abs(ay - c.halfL) < w || Math.abs(ay - c.service) < w || (ax < w && ay < c.service);
  }

  A.Physics = { netHeightAt, bounce, launch, landing, onLine };
})(typeof window !== 'undefined' ? window : globalThis);
