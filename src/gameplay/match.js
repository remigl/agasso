// Un match : déplacements, service, échanges, arbitrage. Simulation pure (sans DOM ni rendu).
// Les deux joueurs sont pilotés par la même structure d'entrée : humain et IA suivent exactement
// les mêmes règles. Le rendu, le son et l'interface ne font que lire l'état et les événements émis.
(function (root) {
  const A = root.Agasso, { COURT, G, clamp } = A, S = A.Scoring, Ph = A.Physics;
  const DT = 1 / 120;
  const EMPTY = Object.freeze({ mx: 0, my: 0, hit: false, lob: false, drop: false, slice: false, aimX: 0, aimDepth: 0 });

  class Game {
    // opts = { players: [idProche, idLoin], venue, setsToWin, gamesToSet, firstServer, rng }
    constructor(opts) {
      const o = opts || {}, ids = o.players || ['remi', 'agasso'];
      this.rng = o.rng || Math.random;
      this.venue = A.Venues.get(o.venue || A.Venues.ids()[0]); // toutes les caractéristiques du terrain viennent des données
      this.players = ids.map((id, i) => {
        const profile = A.Players.profile(id);
        return { i, id, profile, def: profile.def, a: A.Players.attrs(profile, this.venue), sgn: i === 0 ? 1 : -1, x: 0, y: 0, vx: 0, vy: 0, swing: null, run: 0, inp: EMPTY, tilt: 0 };
      });
      this.match = S.createMatch({ setsToWin: o.setsToWin || 2, gamesToSet: o.gamesToSet || 6, firstServer: o.firstServer || 0 });
      this.ball = { x: 0, y: 0, z: 1, vx: 0, vy: 0, vz: 0, spin: 0, live: false, held: true, bounces: 0, lastHitter: -1, hitId: 0, inServe: false, netHit: false };
      this.stats = [0, 1].map(() => ({ points: 0, aces: 0, doubleFaults: 0, winners: 0, errors: 0 }));
      this.events = [];
      this.time = 0; this.rally = 0; this.longestRally = 0; this.serveNo = 1; this.pressure = 0; this.last = null;
      this.setupServe();
    }

    emit(type, data) { this.events.push(Object.assign({ type }, data || {})); }
    tri() { return this.rng() + this.rng() - 1; }
    landing() { return Ph.landing(this.ball); }
    // Côté de frappe selon la main du joueur : 'fh' coup droit, 'bh' revers.
    sideOf(p) { return (this.ball.x - p.x) * p.sgn * p.profile.hand >= 0 ? 'fh' : 'bh'; }

    setupServe() {
      const m = this.match, c = COURT;
      const srv = S.currentServer(m), deuce = S.isDeuceSide(m);
      const P = this.players[srv], R = this.players[1 - srv];
      const sx = P.sgn * (deuce ? 1 : -1) * 1.4;
      P.x = sx; P.y = P.sgn * (c.halfL + 0.45);
      this.boxSign = -Math.sign(sx);
      R.x = this.boxSign * 3.2; R.y = R.sgn * (c.halfL + 0.8);
      for (const p of this.players) { p.vx = p.vy = 0; p.swing = null; p.tilt *= 0.6; }
      const b = this.ball;
      b.live = false; b.held = true; b.vx = b.vy = b.vz = 0; b.spin = 0; b.bounces = 0; b.inServe = false; b.netHit = false; b.lastHitter = -1;
      // Tension du point : balle de match > balle de set > balle de break.
      const st = [S.pointStakes(m, 0), S.pointStakes(m, 1)];
      this.pressure = st.includes('match') ? 1 : st.includes('set') ? 0.7 : st[1 - srv] === 'game' ? 0.45 : 0;
      this.server = srv; this.phase = 'ready'; this.phaseT = 0; this.tossT = 0; this.rally = 0;
      this.holdBall();
      this.emit('ready', { server: srv, serveNo: this.serveNo });
    }

    holdBall() {
      const P = this.players[this.server], b = this.ball;
      b.x = P.x - P.sgn * P.profile.hand * 0.3; b.y = P.y - P.sgn * 0.25; b.z = 1.15;
    }

    // Un pas fixe de simulation. inputs = [entrée du joueur proche, entrée du joueur éloigné].
    step(inputs) {
      const dt = DT, idle = this.phase === 'over' || this.phase === 'done';
      this.time += dt; this.phaseT += dt;
      for (const p of this.players) { p.inp = idle ? EMPTY : inputs[p.i] || EMPTY; this.movePlayer(p, dt); }
      if (this.phase === 'ready') this.stepReady();
      else if (this.phase === 'toss') this.stepToss(dt);
      else if (this.phase === 'rally') for (const p of this.players) this.stepSwing(p, dt);
      if (!this.ball.held) this.stepBall(dt);
      if (this.phase === 'over' && this.phaseT > this.overDelay) {
        if (this.match.over) { this.phase = 'done'; this.emit('match', { winner: this.match.winner }); }
        else this.setupServe();
      }
      if (this.phase !== 'rally') for (const p of this.players) if (p.swing) { p.swing.t += dt; if (p.swing.t > 0.42) p.swing = null; }
    }

    movePlayer(p, dt) {
      const c = COURT, a = p.a, serving = (this.phase === 'ready' || this.phase === 'toss') && p.i === this.server;
      let mx = p.inp.mx, my = p.inp.my;
      if (serving) { my = 0; if (this.phase === 'toss') mx = 0; }
      const len = Math.hypot(mx, my);
      if (len > 1) { mx /= len; my /= len; }
      const f = p.swing ? 0.45 : 1, tvx = mx * a.speed * f, tvy = my * a.speed * f;
      const dvx = tvx - p.vx, dvy = tvy - p.vy, dv = Math.hypot(dvx, dvy), maxDv = a.accel * dt;
      if (dv <= maxDv) { p.vx = tvx; p.vy = tvy; } else { p.vx += (dvx / dv) * maxDv; p.vy += (dvy / dv) * maxDv; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (serving) { const s = Math.sign(-this.boxSign); p.x = s * clamp(p.x * s, 0.3, 3.9); }
      else { p.x = clamp(p.x, -c.boundX, c.boundX); p.y = p.sgn * clamp(p.y * p.sgn, 0.7, c.boundY); }
      p.run += Math.hypot(p.vx, p.vy) * dt * 2.4;
    }

    stepReady() {
      const P = this.players[this.server];
      this.holdBall();
      if (this.phaseT > 0.5 && (P.inp.hit || P.inp.lob)) { this.phase = 'toss'; this.tossT = 0; this.phaseT = 0; this.emit('toss', { server: this.server }); }
    }

    stepToss(dt) {
      const P = this.players[this.server], b = this.ball, t = (this.tossT += dt);
      b.x = P.x; b.y = P.y - P.sgn * 0.3; b.z = 1.25 + 6.4 * t - 4.9 * t * t;
      if (t > 0.15 && (P.inp.hit || P.inp.lob)) this.doServe(P, P.inp.lob ? 'spin' : 'flat');
      else if (t > 1.3) { this.phase = 'ready'; this.phaseT = 0.3; }
    }

    strike(p, shot) {
      const b = this.ball;
      b.lastHitter = p.i; b.bounces = 0; b.netHit = false; b.hitId++; b.spin = shot.spin;
      Ph.launch(b, shot.tx, shot.ty, shot.speed * this.venue.physics.pace, shot.clear);
    }

    doServe(P, kind) {
      const b = this.ball, shot = A.Shots.serve(this, P, kind, this.tossT);
      b.held = false; b.live = true; b.inServe = true;
      this.strike(P, shot);
      this.phase = 'rally'; this.phaseT = 0; this.rally = 0;
      P.swing = { kind: 'serve', anim: 'oh', t: 0.12, done: true, prevD: 0 };
      this.emit('serve', { by: P.i, speed: Math.hypot(b.vx, b.vy), q: shot.q, kind, serveNo: this.serveNo });
    }

    canReach(p) {
      const b = this.ball;
      if (!b.live || b.lastHitter === p.i || b.y * p.sgn < -0.5 || (b.inServe && b.bounces === 0) || b.z > p.a.reachZ) return Infinity;
      const d = Math.hypot(b.x - p.x, b.y - p.y);
      return d <= p.a.reach ? d : Infinity;
    }

    stepSwing(p, dt) {
      const inp = p.inp, sw = p.swing;
      if ((inp.hit || inp.lob || inp.drop || inp.slice) && (!sw || sw.t > 0.34)) {
        p.swing = { kind: inp.lob ? 'lob' : inp.drop ? 'drop' : inp.slice ? 'slice' : 'flat', anim: this.sideOf(p), t: 0, done: false, prevD: Infinity };
        this.emit('swing', { by: p.i });
        return;
      }
      if (!sw) return;
      sw.t += dt;
      if (!sw.done && sw.t >= 0.03 && sw.t <= 0.3) {
        const d = this.canReach(p);
        if (d < Infinity) { if (d > sw.prevD || d < 1.1 || sw.t > 0.27) this.doShot(p, sw, d); else sw.prevD = d; }
      }
      if (sw.t > 0.42) p.swing = null;
    }

    doShot(p, sw, d) {
      const b = this.ball, shot = A.Shots.rally(this, p, sw, d), at = { x: b.x, y: b.y, z: b.z };
      sw.done = true; sw.anim = shot.kind === 'smash' ? 'oh' : shot.side; sw.kind = shot.kind;
      b.inServe = false;
      this.strike(p, shot);
      this.rally++;
      this.emit('hit', Object.assign({ by: p.i, kind: shot.kind, q: shot.q, anim: sw.anim }, at));
    }

    stepBall(dt) {
      const b = this.ball, c = COURT, py = b.y;
      const wind = this.venue.physics.wind;
      b.vz -= G * dt;
      if (b.z > 0.05) { b.vx += wind[0] * 0.12 * dt; b.vy += wind[1] * 0.12 * dt; } // le vent dévie la balle en vol
      b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt;
      if (py * b.y <= 0 && py !== b.y && Math.abs(b.x) < c.postX && b.z < Ph.netHeightAt(b.x)) {
        b.y = (py >= 0 ? 1 : -1) * 0.06; b.vy *= -0.12; b.vx *= 0.3; b.vz *= 0.3; b.netHit = true; b.spin = 0;
        this.emit('net', { x: b.x, z: b.z });
      }
      if (b.z <= 0 && b.vz < 0) {
        b.z = 0;
        this.emit('bounce', { x: b.x, y: b.y, v: Math.abs(b.vz), live: b.live, line: Ph.onLine(b.x, b.y) });
        if (b.live) this.onBounce();
        const k = Ph.bounce(this.venue, b.spin);
        b.vz = -b.vz * k.rest; b.vx *= k.keep; b.vy *= k.keep; b.spin = 0;
        if (b.vz < 0.7) { b.vz = 0; b.vx *= 0.9; b.vy *= 0.9; }
      }
      if (Math.abs(b.y) > 18.6) { b.y = Math.sign(b.y) * 18.6; b.vy *= -0.3; }
      if (Math.abs(b.x) > 10.6) { b.x = Math.sign(b.x) * 10.6; b.vx *= -0.3; }
    }

    onBounce() {
      const b = this.ball, c = COURT, tol = 0.04;
      b.bounces++;
      const hitter = b.lastHitter, opp = 1 - hitter, sg = this.players[hitter].sgn;
      if (b.bounces === 1) {
        const across = b.y * sg < 0, inX = Math.abs(b.x) <= c.halfW + tol;
        if (b.inServe) {
          if (!(across && inX && Math.abs(b.y) <= c.service + tol && b.x * this.boxSign >= -tol)) this.fault(b.netHit || !across ? 'net' : 'out');
        } else if (!(across && inX && Math.abs(b.y) <= c.halfL + tol)) this.endPoint(opp, b.netHit || !across ? 'net' : 'out');
      } else if (b.bounces === 2) this.endPoint(hitter, b.inServe ? 'ace' : 'winner');
    }

    fault(why) {
      if (this.serveNo === 1) {
        this.serveNo = 2; this.ball.live = false;
        this.phase = 'over'; this.phaseT = 0; this.overDelay = 1.2;
        this.emit('fault', { why, by: this.server });
      } else this.endPoint(1 - this.server, 'double');
    }

    endPoint(w, reason) {
      const st = this.stats, l = 1 - w;
      this.ball.live = false;
      st[w].points++;
      if (reason === 'ace') st[w].aces++;
      else if (reason === 'winner') st[w].winners++;
      else { if (reason === 'double') st[l].doubleFaults++; else st[l].errors++; this.players[l].tilt = Math.min(1, this.players[l].tilt + 0.5); }
      this.longestRally = Math.max(this.longestRally, this.rally);
      const ev = S.pointWon(this.match, w);
      this.serveNo = 1;
      this.phase = 'over'; this.phaseT = 0; this.overDelay = ev.includes('match') ? 2.6 : ev.includes('game') ? 2.3 : 1.6;
      this.last = { winner: w, reason, ev };
      this.emit('point', { winner: w, reason, ev, rally: this.rally });
    }
  }

  A.Game = Game;
  A.DT = DT;
  A.EMPTY_INPUT = EMPTY;
})(typeof window !== 'undefined' ? window : globalThis);
