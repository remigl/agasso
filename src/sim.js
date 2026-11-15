// Simulation pure (sans DOM) : déplacements, physique de balle, coups, service, arbitrage.
// Les deux joueurs sont pilotés par la même structure d'entrée : humain et IA jouent avec
// strictement les mêmes règles et les mêmes statistiques.
(function (root) {
  const A = (root.Agasso = root.Agasso || {});
  const { COURT, G, clamp, lerp } = A;
  const S = A.Scoring;
  const DT = 1 / 120;
  const EMPTY = Object.freeze({ mx: 0, my: 0, hit: false, lob: false, drop: false, aimX: 0, aimDepth: 0 });

  const netHeightAt = (x) => 0.914 + 0.156 * Math.min(1, Math.abs(x) / COURT.postX);

  class Game {
    constructor(opts) {
      const o = opts || {};
      this.rng = o.rng || Math.random;
      this.ids = [o.playerId || 'remi', 'agasso'];
      this.players = this.ids.map((id, i) => ({
        i, id, def: A.PLAYERS[id], stats: A.PLAYERS[id].stats,
        sgn: i === 0 ? 1 : -1, x: 0, y: 0, vx: 0, vy: 0,
        swing: null, run: 0, inp: EMPTY, face: 1,
      }));
      this.match = S.createMatch({ setsToWin: o.setsToWin || 2, gamesToSet: o.gamesToSet || 6, firstServer: o.firstServer || 0 });
      this.ball = { x: 0, y: 0, z: 1, vx: 0, vy: 0, vz: 0, live: false, held: true, bounces: 0, lastHitter: -1, hitId: 0, inServe: false, netHit: false };
      this.stats = [0, 1].map(() => ({ points: 0, aces: 0, doubleFaults: 0, winners: 0, errors: 0 }));
      this.events = [];
      this.time = 0;
      this.rally = 0;
      this.longestRally = 0;
      this.serveNo = 1;
      this.last = null;
      this.setupServe();
    }

    emit(type, data) { this.events.push(Object.assign({ type }, data || {})); }
    tri() { return this.rng() + this.rng() - 1; }

    setupServe() {
      const m = this.match, c = COURT;
      const srv = S.currentServer(m), deuce = S.isDeuceSide(m);
      const P = this.players[srv], R = this.players[1 - srv];
      const sx = P.sgn * (deuce ? 1 : -1) * 1.4;
      P.x = sx; P.y = P.sgn * (c.halfL + 0.45);
      this.boxSign = -Math.sign(sx);
      R.x = this.boxSign * 3.2; R.y = R.sgn * (c.halfL + 0.8);
      for (const p of this.players) { p.vx = p.vy = 0; p.swing = null; }
      const b = this.ball;
      b.live = false; b.held = true; b.vx = b.vy = b.vz = 0; b.bounces = 0; b.inServe = false; b.netHit = false; b.lastHitter = -1;
      this.server = srv;
      this.phase = 'ready'; this.phaseT = 0; this.tossT = 0; this.rally = 0;
      this.holdBall();
      this.emit('ready', { server: srv, serveNo: this.serveNo });
    }

    holdBall() {
      const P = this.players[this.server], b = this.ball;
      b.x = P.x - P.sgn * 0.3; b.y = P.y - P.sgn * 0.25; b.z = 1.15;
    }

    // Un pas fixe de simulation. inputs = [entréeJoueur, entréeAgasso].
    step(inputs) {
      const dt = DT;
      this.time += dt; this.phaseT += dt;
      for (const p of this.players) {
        p.inp = this.phase === 'over' || this.phase === 'done' ? EMPTY : inputs[p.i] || EMPTY;
        this.movePlayer(p, dt);
      }
      if (this.phase === 'ready') this.stepReady();
      else if (this.phase === 'toss') this.stepToss(dt);
      else if (this.phase === 'rally') for (const p of this.players) this.stepSwing(p, dt);
      if (!this.ball.held) this.stepBall(dt);
      if (this.phase === 'over' && this.phaseT > this.overDelay) {
        if (this.match.over) { this.phase = 'done'; this.emit('match', { winner: this.match.winner }); }
        else this.setupServe();
      }
      for (const p of this.players) if (p.swing && this.phase !== 'rally') { p.swing.t += dt; if (p.swing.t > 0.42) p.swing = null; }
    }

    movePlayer(p, dt) {
      const c = COURT, st = p.stats, serving = (this.phase === 'ready' || this.phase === 'toss') && p.i === this.server;
      let mx = p.inp.mx, my = p.inp.my;
      if (serving) { my = 0; if (this.phase === 'toss') mx = 0; }
      const len = Math.hypot(mx, my);
      if (len > 1) { mx /= len; my /= len; }
      const f = p.swing ? 0.45 : 1;
      const tvx = mx * st.speed * f, tvy = my * st.speed * f;
      const dvx = tvx - p.vx, dvy = tvy - p.vy, dv = Math.hypot(dvx, dvy), maxDv = st.accel * dt;
      if (dv <= maxDv) { p.vx = tvx; p.vy = tvy; } else { p.vx += (dvx / dv) * maxDv; p.vy += (dvy / dv) * maxDv; }
      p.x += p.vx * dt; p.y += p.vy * dt;
      if (serving) {
        const s = Math.sign(-this.boxSign);
        p.x = s * clamp(p.x * s, 0.3, 3.9);
      } else {
        p.x = clamp(p.x, -c.boundX, c.boundX);
        p.y = p.sgn * clamp(p.y * p.sgn, 0.7, c.boundY);
      }
      const sp = Math.hypot(p.vx, p.vy);
      p.run += sp * dt * 2.4;
      if (Math.abs(p.vx) > 0.5) p.face = Math.sign(p.vx);
    }

    stepReady() {
      const P = this.players[this.server];
      this.holdBall();
      if (this.phaseT > 0.5 && (P.inp.hit || P.inp.lob)) {
        this.phase = 'toss'; this.tossT = 0; this.phaseT = 0;
        this.emit('toss', { server: this.server });
      }
    }

    stepToss(dt) {
      const P = this.players[this.server], b = this.ball, t = (this.tossT += dt);
      b.x = P.x; b.y = P.y - P.sgn * 0.3; b.z = 1.25 + 6.4 * t - 4.9 * t * t;
      if (t > 0.15 && (P.inp.hit || P.inp.lob)) this.doServe(P, P.inp.lob ? 'spin' : 'flat');
      else if (t > 1.3) { this.phase = 'ready'; this.phaseT = 0.3; }
    }

    // Qualité du service : 1 au sommet du lancer (t = 0,65 s), 0 à ±0,4 s.
    static serveQuality(t) { return 1 - clamp(Math.abs(t - 0.65) / 0.4, 0, 1); }

    doServe(P, kind) {
      const b = this.ball, st = P.stats, q = Game.serveQuality(this.tossT), flat = kind === 'flat';
      const speed = flat ? st.serve1 * (0.86 + 0.14 * q) : st.serve2;
      const r = flat ? lerp(2.3, 0.4, q) : lerp(1.6, 0.25, q);
      const tx = this.boxSign * 2.06 + clamp(P.inp.aimX, -1, 1) * 1.4 + this.tri() * r * 0.8;
      const ty = -P.sgn * ((flat ? 5.2 : 4.7) + this.tri() * r);
      b.held = false; b.live = true; b.inServe = true; b.lastHitter = P.i; b.bounces = 0; b.netHit = false; b.hitId++;
      this.launch(tx, ty, speed, q > 0.3 ? 1.03 : 0);
      this.phase = 'rally'; this.phaseT = 0; this.rally = 0;
      P.swing = { kind: 'serve', anim: 'oh', t: 0.12, done: true, prevD: 0 };
      this.emit('serve', { by: P.i, speed: Math.hypot(b.vx, b.vy), q, kind, serveNo: this.serveNo });
    }

    // Lance la balle vers (tx, ty) à vitesse horizontale donnée ; `clear` = hauteur mini au filet (0 = aucune garantie).
    launch(tx, ty, speed, clear) {
      const b = this.ball, dx = tx - b.x, dy = ty - b.y;
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

    canReach(p) {
      const b = this.ball;
      if (!b.live || b.lastHitter === p.i) return Infinity;
      if (b.y * p.sgn < -0.5) return Infinity;
      if (b.inServe && b.bounces === 0) return Infinity;
      if (b.z > p.stats.reachZ) return Infinity;
      const d = Math.hypot(b.x - p.x, b.y - p.y);
      return d <= p.stats.reach ? d : Infinity;
    }

    stepSwing(p, dt) {
      const inp = p.inp, sw = p.swing;
      if ((inp.hit || inp.lob || inp.drop) && (!sw || sw.t > 0.34)) {
        const kind = inp.lob ? 'lob' : inp.drop ? 'drop' : 'flat';
        p.swing = { kind, anim: this.sideAnim(p), t: 0, done: false, prevD: Infinity };
        this.emit('swing', { by: p.i });
        return;
      }
      if (!sw) return;
      sw.t += dt;
      if (!sw.done && sw.t >= 0.03 && sw.t <= 0.3) {
        const d = this.canReach(p);
        if (d < Infinity) {
          if (d > sw.prevD || d < 1.1 || sw.t > 0.27) this.doShot(p, sw, d);
          else sw.prevD = d;
        }
      }
      if (sw.t > 0.42) p.swing = null;
    }

    sideAnim(p) { return (this.ball.x - p.x) * p.sgn >= 0 ? 'fh' : 'bh'; }

    doShot(p, sw, d) {
      const b = this.ball, st = p.stats, inp = p.inp;
      const smash = b.z > 2.3 && sw.kind === 'flat';
      const volley = b.bounces === 0 && !smash;
      const sp = Math.hypot(p.vx, p.vy) / st.speed;
      const q = clamp(1 - 0.55 * clamp((d - 1.1) / 1.0, 0, 1) - 0.25 * clamp(Math.abs(sw.t - 0.12) / 0.18, 0, 1) - A.TUNE.runPen * clamp(sp, 0, 1), 0, 1);
      const ax = clamp(inp.aimX, -1, 1), ad = clamp(inp.aimDepth, -1, 1);
      let depth, speed, wide = 3.7, rf = 1, kind = sw.kind;
      if (smash) { kind = 'smash'; depth = 7.6 + ad * 2; speed = st.smash; rf = 0.8; }
      else if (kind === 'lob') { depth = 10.1 + ad * 0.7; speed = st.lob; wide = 2.7; rf = 0.85; }
      else if (kind === 'drop') { depth = 2.6 + (ad + 1) * 0.5; speed = st.drop; wide = 3.0; rf = 0.9; }
      else if (volley) { kind = 'volley'; depth = 7.6 + ad * 2.5; speed = st.volley; }
      else { depth = 8.6 + ad * 2.8; speed = st.flat; }
      const r = lerp(A.TUNE.rMax, A.TUNE.rMin, q) * rf;
      const tx = ax * wide + this.tri() * r;
      const ty = -p.sgn * (depth + this.tri() * r);
      sw.done = true; sw.anim = smash ? 'oh' : this.sideAnim(p);
      const clear = kind === 'lob' ? 2.5 : q < 0.25 && this.rng() < 0.5 ? 0 : 1.15;
      b.lastHitter = p.i; b.bounces = 0; b.inServe = false; b.netHit = false; b.hitId++;
      this.launch(tx, ty, speed, clear);
      this.rally++;
      this.emit('hit', { by: p.i, kind, q, x: b.x, y: b.y, z: b.z, anim: sw.anim });
    }

    stepBall(dt) {
      const b = this.ball, c = COURT, py = b.y;
      b.vz -= G * dt;
      b.x += b.vx * dt; b.y += b.vy * dt; b.z += b.vz * dt;
      if (py * b.y <= 0 && py !== b.y && Math.abs(b.x) < c.postX && b.z < netHeightAt(b.x)) {
        b.y = (py >= 0 ? 1 : -1) * 0.06; b.vy *= -0.12; b.vx *= 0.3; b.vz *= 0.3; b.netHit = true;
        this.emit('net', { x: b.x, z: b.z });
      }
      if (b.z <= 0 && b.vz < 0) {
        b.z = 0;
        this.emit('bounce', { x: b.x, y: b.y, v: Math.abs(b.vz), live: b.live });
        if (b.live) this.onBounce();
        b.vz = -b.vz * 0.74; b.vx *= 0.76; b.vy *= 0.76;
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
          const ok = across && inX && Math.abs(b.y) <= c.service + tol && b.x * this.boxSign >= -tol;
          if (!ok) this.fault(b.netHit || !across ? 'net' : 'out');
        } else if (!(across && inX && Math.abs(b.y) <= c.halfL + tol)) {
          this.endPoint(opp, b.netHit || !across ? 'net' : 'out');
        }
      } else if (b.bounces === 2) {
        this.endPoint(hitter, b.inServe ? 'ace' : 'winner');
      }
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
      else if (reason === 'double') st[l].doubleFaults++;
      else st[l].errors++;
      this.longestRally = Math.max(this.longestRally, this.rally);
      const ev = S.pointWon(this.match, w);
      this.serveNo = 1;
      this.phase = 'over'; this.phaseT = 0; this.overDelay = ev.includes('game') ? 2.3 : 1.6;
      this.last = { winner: w, reason, ev };
      this.emit('point', { winner: w, reason, ev, rally: this.rally });
    }

    // Point de chute prévu de la balle en vol (pour le repère au sol et l'IA).
    landing() {
      const b = this.ball, t = (b.vz + Math.sqrt(b.vz * b.vz + 2 * G * Math.max(0, b.z))) / G;
      return { x: b.x + b.vx * t, y: b.y + b.vy * t, t };
    }
  }

  A.Game = Game;
  A.DT = DT;
  A.EMPTY_INPUT = EMPTY;
  A.netHeightAt = netHeightAt;
})(typeof window !== 'undefined' ? window : globalThis);
