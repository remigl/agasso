// Vue : caméra en perspective (préréglages), projection monde → écran et primitives de dessin projetées.
// Tout ce qui est visuel passe par ici ; le gameplay n'en sait rien.
(function (root) {
  const A = root.Agasso;

  // Préréglages de caméra : position, point visé, focale (en fraction de la largeur / hauteur), centre vertical.
  A.CAMERAS = {
    tv: { label: 'TV (plongeante)', pos: [0, 33, 14], look: [0, -3, 0], fw: 1.11, fh: 1.97, cy: -0.065 },
    court: { label: 'Bord de court', pos: [0, 26.5, 8.2], look: [0, -2.5, 0.9], fw: 0.9, fh: 1.6, cy: -0.02 },
  };

  class View {
    setup(w, h, preset, override) {
      const cam = Object.assign({}, A.CAMERAS[preset] || A.CAMERAS.tv, override), C = (this.C = cam.pos), T = cam.look;
      this.W = w; this.H = h;
      this.f = Math.min(w * cam.fw, h * cam.fh); this.cx = w / 2; this.cy = h * 0.5 + this.f * cam.cy;
      let F = [T[0] - C[0], T[1] - C[1], T[2] - C[2]]; const l = Math.hypot(...F); F = F.map((v) => v / l);
      const R = [-F[1], F[0], 0], rl = Math.hypot(...R); this.R = R.map((v) => v / rl); this.F = F;
      const r = this.R; this.U = [F[1] * r[2] - F[2] * r[1], F[2] * r[0] - F[0] * r[2], F[0] * r[1] - F[1] * r[0]];
    }
    // Monde (x, y, z) → écran {x, y, s} ; s = pixels par mètre à cette profondeur.
    P(x, y, z) {
      const C = this.C, dx = x - C[0], dy = y - C[1], dz = (z || 0) - C[2], F = this.F, R = this.R, U = this.U;
      const zc = Math.max(0.5, dx * F[0] + dy * F[1] + dz * F[2]), s = this.f / zc;
      return { x: this.cx + (dx * R[0] + dy * R[1]) * s, y: this.cy - (dx * U[0] + dy * U[1] + dz * U[2]) * s, s };
    }
    path(c, pts) { c.beginPath(); pts.forEach((p, i) => { const q = this.P(p[0], p[1], p[2] || 0); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); }); c.closePath(); }
    poly(c, pts, fill) { this.path(c, pts); c.fillStyle = fill; c.fill(); }
    line(c, a, b, col, wMeters) {
      const p = this.P(a[0], a[1], a[2] || 0), q = this.P(b[0], b[1], b[2] || 0);
      c.strokeStyle = col; c.lineWidth = Math.max(1.2, wMeters * (p.s + q.s) * 0.5);
      c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke();
    }
    // Tache douce au sol (dégradé radial aplati par la perspective).
    blot(c, x, y, rx, ry, col, a) {
      const p = this.P(x, y, 0), q = this.P(x, y + ry, 0), k = Math.max(0.05, Math.abs(q.y - p.y) / (rx * p.s));
      c.save(); c.translate(p.x, p.y); c.scale(1, k);
      const g = c.createRadialGradient(0, 0, 0, 0, 0, rx * p.s); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, rx * p.s, 0, 7); c.fill(); c.restore();
    }
  }

  A.View = View;
  A.FONT = 'Bahnschrift, "DIN Alternate", "Roboto Condensed", "Arial Narrow", system-ui, sans-serif';
})(typeof window !== 'undefined' ? window : globalThis);
