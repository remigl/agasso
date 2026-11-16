// Cerveau générique d'un joueur piloté par l'ordinateur. Il produit les mêmes entrées qu'un humain
// (déplacement, visée, boutons) : aucun bonus physique. Sa personnalité vient entièrement des données :
// profil.ai (archétype ⊕ joueur) pour le style, A.DIFFICULTY pour la lucidité.
(function (root) {
  const A = root.Agasso, { COURT, G, clamp, lerp } = A;

  class AI {
    constructor(index, difficulty, rng) {
      this.i = index;
      this.d = A.DIFFICULTY[difficulty] || A.DIFFICULTY.normal;
      this.rng = rng || Math.random;
      this.seen = -1; this.mine = -1; this.wait = 0; this.off = 0; this.serve = null; this.shot = null; this.atNet = false; this.pressAt = 0;
    }
    tri() { return this.rng() + this.rng() - 1; }

    think(g, dt) {
      const me = g.players[this.i], opp = g.players[1 - this.i], b = g.ball, r = this.rng, beh = me.profile.ai;
      const inp = { mx: 0, my: 0, hit: false, lob: false, drop: false, slice: false, aimX: 0, aimDepth: 0 };
      const serving = g.phase === 'ready' || g.phase === 'toss';
      let tx = null, ty = null;

      if (serving && g.server === this.i) {
        if (!this.serve) this.serve = { delay: 0.8 + r() * 0.5, aim: [-1, -0.1, 1][Math.floor(r() * 3)], at: 0.65 + this.tri() * this.d.serveJitter * 2.2 };
        inp.aimX = this.serve.aim; this.atNet = false;
        if (g.phase === 'ready' ? g.phaseT > this.serve.delay : g.tossT >= this.serve.at) { if (g.serveNo === 1) inp.hit = true; else inp.lob = true; }
        return inp;
      }
      this.serve = null;
      if (serving) { // receveur : se place selon son style de retour
        this.atNet = false; tx = g.boxSign * 3.2; ty = me.sgn * (COURT.halfL + beh.returnDepth);
      } else if (g.phase !== 'rally') return inp;
      else if (b.live && b.lastHitter !== this.i) {
        if (b.hitId !== this.seen) {
          this.seen = b.hitId; this.off = this.tri() * this.d.sloppy; this.shot = null;
          this.wait = this.d.reaction * (b.inServe ? 0.8 : this.atNet ? 0.85 : 1); // au filet, on anticipe
        }
        this.wait -= dt;
        if (this.wait > 0) return inp;
        const c = this.intercept(g, me);
        tx = c.x + (me.x < c.x ? -0.7 : 0.7) * (c.volley ? 0.6 : 1) + this.off;
        ty = c.y + me.sgn * 0.15;
        const d = Math.hypot(b.x - me.x, b.y - me.y);
        const ok = b.bounces >= 1 || (!b.inServe && (c.volley || b.z > 2.3));
        if (ok && d < 1.95 && b.z < me.a.reachZ && b.y * me.sgn > -0.3) {
          if (!this.shot) {
            this.shot = this.choose(me, opp, beh);
            const lapse = this.d.lapse * (1 + 0.12 * (A.BASE.pivot - me.profile.stats.mental));
            this.pressAt = g.time + r() * this.d.sloppy * 0.14 + (r() < lapse ? 0.1 + r() * 0.12 : 0);
          }
          if (g.time >= this.pressAt) { const s = this.shot; inp.aimX = s.aimX; inp.aimDepth = s.aimDepth; inp[s.kind === 'flat' ? 'hit' : s.kind] = true; }
        }
      } else {
        // Ma balle est en route : je me replace, ou je monte au filet selon mon style.
        if (b.hitId !== this.mine && b.lastHitter === this.i) {
          this.mine = b.hitId;
          if (b.inServe) this.atNet = r() < beh.serveVolley;
          else if (!this.atNet) this.atNet = Math.abs(me.y) < 6 || (Math.abs(g.landing().y) > 8.5 && r() < beh.netRush);
        }
        if (this.atNet) { tx = clamp(b.x * 0.45, -2.2, 2.2); ty = me.sgn * 3.1; }
        else { tx = clamp(b.x * 0.12, -1, 1); ty = me.sgn * (COURT.halfL + beh.depth); }
      }
      ty = me.sgn * Math.max(0.9, ty * me.sgn);
      const dx = tx - me.x, dy = ty - me.y, dist = Math.hypot(dx, dy);
      if (dist > 0.12) { const k = Math.min(1, dist / 0.5); inp.mx = (dx / dist) * k; inp.my = (dy / dist) * k; }
      return inp;
    }

    // Choix du coup : zone visée selon l'agressivité et la prise de risque, variation selon le style.
    choose(me, opp, beh) {
      const r = this.rng, smart = r() < this.d.smart, attack = smart && r() < 0.35 + 0.65 * beh.aggression;
      const open = opp.x > 0.4 ? -1 : opp.x < -0.4 ? 1 : r() < 0.5 ? -1 : 1;
      const aimX = attack ? open * lerp(0.7, 1, clamp(beh.risk + (r() - 0.5) * 0.8, 0, 1)) : smart ? open * r() * 0.6 : r() * 2 - 1;
      const aimDepth = smart ? lerp(0.1, 1, clamp(beh.risk * 0.6 + r() * 0.7, 0, 1)) : r() * 2 - 1;
      let kind = 'flat';
      if (Math.abs(opp.y) < 5.5) { // adversaire au filet : lob, ou passing croisé qui plonge dans ses pieds
        if (r() < beh.lob) kind = 'lob';
        else if (smart) return { kind, aimX: open * (0.85 + 0.15 * r()), aimDepth: -0.5 + 0.5 * r() };
      }
      else if (Math.abs(me.y) < 9 && Math.abs(opp.y) > 12.3 && r() < beh.drop * 1.5) kind = 'drop';
      else if (r() < beh.slice) kind = 'slice';
      return { kind, aimX, aimDepth };
    }

    // Où la balle sera-t-elle frappable ? (volée si l'on est au filet, sinon après le rebond)
    intercept(g, me) {
      const b = g.ball;
      if (b.bounces === 0) {
        const L = g.landing();
        if ((this.atNet || Math.abs(me.y) < 5.5) && Math.abs(me.y) < 9 && !b.inServe && Math.abs(b.vy) > 1) {
          const tc = (me.y - b.y) / b.vy;
          if (tc > 0 && tc < L.t) { const z = b.z + b.vz * tc - 0.5 * G * tc * tc; if (z > 0.35 && z < 3.0) return { x: b.x + b.vx * tc, y: me.y, volley: true }; }
        }
        const k = A.Physics.bounce(g.venue, b.spin);
        return this.best(me, L.x, L.y, 0, k.rest * Math.abs(b.vz - G * L.t), b.vx * k.keep, b.vy * k.keep, L.t);
      }
      return this.best(me, b.x, b.y, b.z, b.vz, b.vx, b.vy, 0);
    }

    // Parcourt l'arc de la balle et retient le point de frappe le plus confortable encore atteignable
    // (un peu plus tôt dans l'arc pour les joueurs qui prennent la balle tôt).
    best(me, x, y, z, vz, vx, vy, t0) {
      const apex = z + (vz > 0 ? (vz * vz) / (2 * G) : 0), zc = Math.min(1.0, apex * 0.8);
      const disc = vz * vz + 2 * G * (z - zc);
      const tEnd = disc < 0 ? Math.max(0.05, vz / G) : (vz + Math.sqrt(disc)) / G;
      const early = me.profile.tech.early > 0.5;
      let pick = null, bestSlack = -Infinity;
      for (let n = 0; n < 8; n++) {
        const k = (early ? 6 : 8) - n; if (k < 1) break;
        const tau = (tEnd * k) / 8, h = z + vz * tau - 0.5 * G * tau * tau;
        if (h > me.a.reachZ - 0.4) continue;
        const px = x + vx * tau, py = y + vy * tau;
        if (Math.abs(py) > COURT.boundY - 0.5) continue;
        const slack = t0 + tau - Math.max(0, Math.hypot(px - me.x, py - me.y) - 1.2) / me.a.speed;
        if (slack > 0.12) return { x: px, y: py };
        if (slack > bestSlack) { bestSlack = slack; pick = { x: px, y: py }; }
      }
      return pick || { x: x + vx * tEnd, y: y + vy * tEnd };
    }
  }

  A.AI = AI;
})(typeof window !== 'undefined' ? window : globalThis);
