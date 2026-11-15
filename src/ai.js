// Cerveau d'Agasso : produit les mêmes entrées qu'un humain (déplacement, visée, boutons).
// Aucun bonus physique : il anticipe la trajectoire, se place, choisit un coup.
(function (root) {
  const A = (root.Agasso = root.Agasso || {});
  const { COURT, G, clamp } = A;

  class AI {
    constructor(index, difficulty, rng) {
      this.i = index;
      this.d = A.DIFFICULTY[difficulty] || A.DIFFICULTY.normal;
      this.rng = rng || Math.random;
      this.seen = -1; this.wait = 0; this.off = 0; this.serve = null; this.shot = null;
    }
    tri() { return this.rng() + this.rng() - 1; }

    think(g, dt) {
      const me = g.players[this.i], opp = g.players[1 - this.i], b = g.ball, r = this.rng;
      const inp = { mx: 0, my: 0, hit: false, lob: false, drop: false, aimX: 0, aimDepth: 0 };

      if ((g.phase === 'ready' || g.phase === 'toss') && g.server === this.i) {
        if (!this.serve) {
          const spots = [-1, -0.1, 1];
          this.serve = { delay: 0.8 + r() * 0.5, aim: spots[Math.floor(r() * 3)], at: 0.65 + this.tri() * this.d.serveJitter * 2.2 };
        }
        inp.aimX = this.serve.aim;
        const press = g.phase === 'ready' ? g.phaseT > this.serve.delay : g.tossT >= this.serve.at;
        if (press) { if (g.serveNo === 1) inp.hit = true; else inp.lob = true; }
        return inp;
      }
      this.serve = null;
      if (g.phase !== 'rally') return inp;

      const incoming = b.live && b.lastHitter !== this.i;
      let tx, ty;
      if (incoming) {
        if (b.hitId !== this.seen) {
          this.seen = b.hitId; this.wait = this.d.reaction; this.off = this.tri() * this.d.sloppy; this.shot = null;
        }
        this.wait -= dt;
        if (this.wait > 0) return inp;
        const c = this.intercept(g, me);
        tx = c.x + (me.x < c.x ? -0.7 : 0.7) * (c.volley ? 0.6 : 1) + this.off;
        ty = c.y + me.sgn * 0.15;
        const d = Math.hypot(b.x - me.x, b.y - me.y);
        const ok = b.bounces >= 1 || (!b.inServe && (c.volley || b.z > 2.3));
        if (ok && d < 1.95 && b.z < me.stats.reachZ && b.y * me.sgn > -0.3) {
          if (!this.shot) { this.shot = this.choose(me, opp, d); this.pressAt = g.time + r() * this.d.sloppy * 0.14 + (r() < this.d.lapse ? 0.1 + r() * 0.12 : 0); }
          const s = g.time < this.pressAt ? null : this.shot;
          if (s) {
            inp.aimX = s.aimX; inp.aimDepth = s.aimDepth;
            inp.hit = s.kind === 'flat'; inp.lob = s.kind === 'lob'; inp.drop = s.kind === 'drop';
          }
        }
      } else {
        tx = clamp(b.x * 0.12, -1, 1); ty = me.sgn * (COURT.halfL + 0.9);
      }
      ty = me.sgn * Math.max(0.9, ty * me.sgn);
      const dx = tx - me.x, dy = ty - me.y, dist = Math.hypot(dx, dy);
      if (dist > 0.12) { const k = Math.min(1, dist / 0.5); inp.mx = (dx / dist) * k; inp.my = (dy / dist) * k; }
      return inp;
    }

    choose(me, opp, d) {
      const r = this.rng, smart = r() < this.d.smart;
      let aimX = smart ? (opp.x > 0.4 ? -1 : opp.x < -0.4 ? 1 : r() < 0.5 ? -1 : 1) * (0.75 + 0.25 * r()) : r() * 2 - 1;
      let aimDepth = smart ? 0.2 + 0.8 * r() : r() * 2 - 1;
      let kind = 'flat';
      const oppNet = Math.abs(opp.y) < 5.5;
      if (oppNet && r() < 0.5) kind = 'lob';
      else if (Math.abs(me.y) < 8 && Math.abs(opp.y) > 12.3 && r() < 0.18) kind = 'drop';
      return { kind, aimX, aimDepth };
    }

    // Où la balle sera-t-elle frappable ? (volée si l'on est au filet, sinon après le rebond)
    intercept(g, me) {
      const b = g.ball;
      if (b.bounces === 0) {
        const L = g.landing();
        if (Math.abs(me.y) < 5.5 && !b.inServe && Math.abs(b.vy) > 1) {
          const tc = (me.y - b.y) / b.vy;
          if (tc > 0 && tc < L.t) {
            const z = b.z + b.vz * tc - 0.5 * G * tc * tc;
            if (z < 3.0) return { x: b.x + b.vx * tc, y: me.y, volley: true };
          }
        }
        return this.best(me, L.x, L.y, 0, 0.74 * Math.abs(b.vz - G * L.t), b.vx * 0.76, b.vy * 0.76, L.t);
      }
      return this.best(me, b.x, b.y, b.z, b.vz, b.vx, b.vy, 0);
    }

    // Parcourt l'arc de la balle et retient le point de frappe le plus confortable encore atteignable.
    best(me, x, y, z, vz, vx, vy, t0) {
      const apex = z + (vz > 0 ? (vz * vz) / (2 * G) : 0), zc = Math.min(1.0, apex * 0.8);
      const disc = vz * vz + 2 * G * (z - zc);
      const tEnd = disc < 0 ? Math.max(0.05, vz / G) : (vz + Math.sqrt(disc)) / G;
      let pick = null, bestSlack = -Infinity;
      for (let k = 8; k >= 1; k--) {
        const tau = (tEnd * k) / 8, h = z + vz * tau - 0.5 * G * tau * tau;
        if (h > me.stats.reachZ - 0.4) continue;
        const px = x + vx * tau, py = y + vy * tau;
        if (Math.abs(py) > COURT.boundY - 0.5) continue;
        const slack = t0 + tau - Math.max(0, Math.hypot(px - me.x, py - me.y) - 1.2) / me.stats.speed;
        if (slack > 0.12) return { x: px, y: py };
        if (slack > bestSlack) { bestSlack = slack; pick = { x: px, y: py }; }
      }
      return pick || { x: x + vx * tEnd, y: y + vy * tEnd };
    }
  }

  A.AI = AI;
})(typeof window !== 'undefined' ? window : globalThis);
