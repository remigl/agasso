// Rendu 2.5D sur canvas : caméra en perspective derrière le joueur, stade pré-rendu,
// joueurs animés, balle, filet, traces sur la terre battue, particules.
(function (root) {
  const A = (root.Agasso = root.Agasso || {});
  const { COURT, clamp, lerp } = A;
  const CLAY = '#c9643b', CLAY_D = '#b85630', GREEN = '#0d4a37', GREEN_D = '#093527';
  const CROWD = ['#f4efe6', '#e9dcc3', '#d7c9a8', '#2f5d8a', '#b8433a', '#f2d16b', '#3c3c44', '#7fa6c9', '#e8e8ee', '#c98f6b'];

  function seeded(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  class Renderer {
    constructor(canvas) {
      this.cv = canvas; this.ctx = canvas.getContext('2d');
      this.bg = document.createElement('canvas');
      this.marks = []; this.parts = []; this.pops = []; this.trail = [];
      this.shake = 0; this.cheer = 0; this.fans = [];
      this.resize();
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = this.cv.clientWidth || 1280, h = this.cv.clientHeight || 720;
      this.W = w; this.H = h; this.dpr = dpr;
      this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
      this.bg.width = this.cv.width; this.bg.height = this.cv.height;
      // Caméra
      this.f = Math.min(w * 0.95, h * 1.69);
      this.cx = w / 2; this.cy = h * 0.5 - this.f * 0.075;
      const C = (this.C = [0, 25.5, 9.5]), T = [0, -1.5, 0.5];
      let F = [T[0] - C[0], T[1] - C[1], T[2] - C[2]]; const l = Math.hypot(...F); F = F.map((v) => v / l);
      const R = [-F[1], F[0], 0], rl = Math.hypot(...R); this.R = R.map((v) => v / rl);
      this.F = F; const r = this.R;
      this.U = [F[1] * r[2] - F[2] * r[1], F[2] * r[0] - F[0] * r[2], F[0] * r[1] - F[1] * r[0]];
      this.paintBackground();
    }

    // Monde (x, y, z) -> écran {x, y, s} ; s = pixels par mètre à cette profondeur.
    P(x, y, z) {
      const C = this.C, dx = x - C[0], dy = y - C[1], dz = (z || 0) - C[2], F = this.F, R = this.R, U = this.U;
      const zc = Math.max(0.5, dx * F[0] + dy * F[1] + dz * F[2]), s = this.f / zc;
      return { x: this.cx + (dx * R[0] + dy * R[1]) * s, y: this.cy - (dx * U[0] + dy * U[1] + dz * U[2]) * s, s };
    }

    poly(c, pts, fill, stroke, lw) {
      c.beginPath();
      pts.forEach((p, i) => { const q = this.P(p[0], p[1], p[2]); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); });
      c.closePath();
      if (fill) { c.fillStyle = fill; c.fill(); }
      if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 1; c.stroke(); }
    }
    line(c, a, b, col, wMeters) {
      const p = this.P(a[0], a[1], a[2] || 0), q = this.P(b[0], b[1], b[2] || 0);
      c.strokeStyle = col; c.lineWidth = Math.max(1.3, wMeters * (p.s + q.s) * 0.5);
      c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke();
    }

    paintBackground() {
      const c = this.bg.getContext('2d'), W = this.W, H = this.H, rnd = seeded(2026), co = COURT;
      c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      const sky = c.createLinearGradient(0, 0, 0, H * 0.4);
      sky.addColorStop(0, '#6fb2e6'); sky.addColorStop(1, '#d9ecf7');
      c.fillStyle = sky; c.fillRect(0, 0, W, H);
      c.fillStyle = 'rgba(255,255,255,.75)';
      for (let i = 0; i < 5; i++) { const x = rnd() * W, y = rnd() * H * 0.08; c.beginPath(); c.ellipse(x, y, 90 + rnd() * 80, 12 + rnd() * 10, 0, 0, 7); c.fill(); }

      const X = 11, YB = -19, YF = 26, WALL = 1.6;
      this.fans = [];
      const crowd = (pts) => {
        for (const [x, y, z] of pts) {
          const p = this.P(x, y, z), r = Math.max(1.2, p.s * 0.2);
          c.fillStyle = CROWD[Math.floor(rnd() * CROWD.length)];
          c.beginPath(); c.arc(p.x, p.y - r * 1.2, r, 0, 7); c.fill();
          c.fillRect(p.x - r, p.y - r * 0.5, r * 2, r * 1.6);
          if (rnd() < 0.2) this.fans.push({ x: p.x, y: p.y - r * 1.2, r });
        }
      };
      // Tribune du fond + toit
      this.poly(c, [[-X - 9, YB, WALL], [X + 9, YB, WALL], [X + 16, YB - 17, 14], [-X - 16, YB - 17, 14]], '#2a3a44');
      let pts = [];
      for (let r = 0; r < 24; r++) for (let x = -X - 8 - r * 0.25; x <= X + 8 + r * 0.25; x += 0.62) pts.push([x + (rnd() - 0.5) * 0.2, YB - 0.6 - r * 0.68, WALL + 0.5 + r * 0.5]);
      crowd(pts);
      this.poly(c, [[-X - 17, YB - 17, 14], [X + 17, YB - 17, 14], [X + 17, YB - 14, 17.5], [-X - 17, YB - 14, 17.5]], '#e9ecef');
      this.poly(c, [[-X - 17, YB - 14, 17.5], [X + 17, YB - 14, 17.5], [X + 17, YB - 14, 18.3], [-X - 17, YB - 14, 18.3]], '#aab4bc');
      // Tribunes latérales
      for (const sg of [-1, 1]) {
        this.poly(c, [[sg * X, YB, WALL], [sg * X, YF, WALL], [sg * (X + 13), YF, 11], [sg * (X + 13), YB, 11]], '#2f414c');
        pts = [];
        for (let r = 0; r < 17; r++) for (let y = YB + 0.3; y <= 20; y += 0.7) pts.push([sg * (X + 0.6 + r * 0.72), y + (rnd() - 0.5) * 0.2, WALL + 0.5 + r * 0.52]);
        pts.sort((a, b) => a[1] - b[1]);
        crowd(pts);
      }
      // Sol en terre battue
      this.poly(c, [[-X, YB, 0], [X, YB, 0], [X, YF, 0], [-X, YF, 0]], CLAY);
      const g = c.createRadialGradient(W / 2, H * 0.55, H * 0.1, W / 2, H * 0.55, H * 0.9);
      g.addColorStop(0, 'rgba(255,190,140,.16)'); g.addColorStop(1, 'rgba(70,20,0,.22)');
      c.save();
      c.beginPath(); [[-X, YB], [X, YB], [X, YF], [-X, YF]].forEach((p, i) => { const q = this.P(p[0], p[1], 0); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); }); c.clip();
      c.fillStyle = g; c.fillRect(0, 0, W, H);
      for (let i = 0; i < 2600; i++) {
        const p = this.P((rnd() * 2 - 1) * X, lerp(YB, 18, rnd()), 0);
        c.fillStyle = rnd() < 0.5 ? 'rgba(255,205,165,.13)' : 'rgba(95,35,10,.13)';
        c.fillRect(p.x, p.y, Math.max(1, p.s * 0.05), Math.max(1, p.s * 0.02));
      }
      c.restore();
      // Murs verts
      this.poly(c, [[-X, YB, 0], [X, YB, 0], [X, YB, WALL], [-X, YB, WALL]], GREEN);
      for (const sg of [-1, 1]) this.poly(c, [[sg * X, YB, 0], [sg * X, YF, 0], [sg * X, YF, WALL], [sg * X, YB, WALL]], GREEN_D);
      const wp = this.P(0, YB, WALL * 0.5);
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#f3ede0';
      c.font = `800 ${wp.s * 0.78}px system-ui, "Segoe UI", sans-serif`;
      c.fillText('ROLAND-GARROS', wp.x, wp.y);
      c.font = `700 ${wp.s * 0.5}px system-ui, "Segoe UI", sans-serif`;
      for (const sx of [-7.6, 7.6]) { const q = this.P(sx, YB, WALL * 0.5); c.fillText(sx < 0 ? 'PARIS' : '2026', q.x, q.y); }
      // Juges de ligne au fond
      for (const jx of [-9.6, 9.6]) this.figure(c, this.P(jx, YB + 0.8, 0), { shirt: '#1d3a5f', shorts: '#e9e2d0', skin: '#e6b792', hair: '#333', style: 'cap' }, { away: false, fh: 1, still: true });
      // Lignes
      const L = (a, b) => this.line(c, a, b, 'rgba(255,255,255,.93)', 0.06);
      const hw = co.halfW, hl = co.halfL, sv = co.service;
      L([-hw, -hl], [hw, -hl]); L([-hw, hl], [hw, hl]); L([-hw, -hl], [-hw, hl]); L([hw, -hl], [hw, hl]);
      L([-hw, -sv], [hw, -sv]); L([-hw, sv], [hw, sv]); L([0, -sv], [0, sv]);
      L([0, -hl], [0, -hl + 0.25]); L([0, hl], [0, hl - 0.25]);
      // Chaise d'arbitre
      const ux = -6.4;
      this.line(c, [ux - 0.4, 0.3, 0], [ux - 0.25, 0.1, 1.9], '#e8e2d2', 0.07); this.line(c, [ux + 0.4, 0.3, 0], [ux + 0.25, 0.1, 1.9], '#e8e2d2', 0.07);
      this.line(c, [ux - 0.4, -0.3, 0], [ux - 0.25, -0.1, 1.9], '#cfc8b6', 0.07); this.line(c, [ux + 0.4, -0.3, 0], [ux + 0.25, -0.1, 1.9], '#cfc8b6', 0.07);
      this.poly(c, [[ux - 0.4, 0.2, 1.9], [ux + 0.4, 0.2, 1.9], [ux + 0.4, -0.2, 1.9], [ux - 0.4, -0.2, 1.9]], '#0d4a37');
      const up = this.P(ux, 0, 1.9);
      this.figure(c, { x: up.x, y: up.y + up.s * 0.75, s: up.s }, { shirt: '#f1ead9', shorts: '#16222b', skin: '#e6b792', hair: '#555', style: 'cap' }, { away: false, fh: 1, still: true, seated: true });
    }

    // Dessine un personnage. o = {x, y, s} pieds à l'écran ; pose = {away, fh, run, moving, swing:{anim,p}, toss}
    figure(c, o, look, pose) {
      const u = o.s, x = o.x, mv = pose.moving ? 1 : 0, ph = pose.run || 0;
      const bob = mv * Math.abs(Math.sin(ph)) * 0.05 * u, y = o.y - bob;
      const hip = y - 0.86 * u, sh = y - 1.42 * u, fh = pose.fh;
      c.lineCap = 'round'; c.lineJoin = 'round';
      if (!pose.seated) {
        const st = mv * Math.sin(ph) * 0.24 * u;
        for (const k of [-1, 1]) {
          const fx = x + k * 0.11 * u + k * st, fy = o.y - Math.max(0, k * Math.cos(ph)) * mv * 0.1 * u;
          c.strokeStyle = look.skin; c.lineWidth = 0.12 * u;
          c.beginPath(); c.moveTo(x + k * 0.1 * u, hip); c.lineTo(fx, fy - 0.05 * u); c.stroke();
          c.fillStyle = '#fafafa'; c.beginPath(); c.ellipse(fx, fy - 0.03 * u, 0.1 * u, 0.055 * u, 0, 0, 7); c.fill();
        }
      }
      c.fillStyle = look.shorts; c.beginPath(); c.roundRect(x - 0.23 * u, hip - 0.1 * u, 0.46 * u, 0.34 * u, 0.07 * u); c.fill();
      c.fillStyle = look.shirt; c.beginPath(); c.roundRect(x - 0.25 * u, sh - 0.08 * u, 0.5 * u, 0.62 * u, 0.1 * u); c.fill();
      c.fillStyle = 'rgba(0,0,0,.12)'; c.beginPath(); c.roundRect(x - 0.25 * u, sh + 0.3 * u, 0.5 * u, 0.24 * u, 0.1 * u); c.fill();
      // Bras libre
      const arm = (ax, ay, bx, by) => { c.strokeStyle = look.skin; c.lineWidth = 0.1 * u; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); };
      if (pose.toss) arm(x - fh * 0.24 * u, sh, x - fh * 0.2 * u, sh - 0.5 * u);
      else arm(x - fh * 0.24 * u, sh, x - fh * (0.36 + mv * 0.05 * Math.sin(ph)) * u, sh + 0.42 * u);
      // Bras raquette : main (hx, hz) et direction de la raquette (dx, dz), en mètres, z vers le haut.
      let hx = 0.2, hz = -0.36, dx = 0.35, dz = 0.6;
      const sw = pose.swing;
      if (sw) {
        const p = clamp(sw.p, 0, 1), e = p * p * (3 - 2 * p), a = lerp(-0.5, 2.7, e);
        if (sw.anim === 'oh') { hx = 0.18 - 0.36 * e; hz = 0.55 * Math.cos(e * 2.4); dx = 0.2 - 0.7 * e; dz = Math.cos(e * 2.7); }
        else { const m = sw.anim === 'bh' ? -1 : 1; hx = m * 0.55 * Math.cos(a) + (m < 0 ? 0.1 : 0); hz = -0.2 + 0.32 * Math.sin(a * 0.8); dx = m * Math.cos(a); dz = 0.3 + 0.35 * Math.sin(a); }
      } else if (pose.toss) { hx = 0.34; hz = 0.05; dx = 0.25; dz = 0.9; }
      else if (pose.still) { hx = 0.3; hz = -0.42; dx = 0; dz = -1; }
      const dl = Math.hypot(dx, dz) || 1; dx /= dl; dz /= dl;
      const sx = x + fh * 0.24 * u, HX = sx + fh * hx * u, HY = sh - hz * u;
      arm(sx, sh, HX, HY);
      if (!pose.still) {
        const ex = HX + fh * dx * 0.3 * u, ey = HY - dz * 0.3 * u, cx2 = HX + fh * dx * 0.52 * u, cy2 = HY - dz * 0.52 * u;
        c.strokeStyle = '#22252b'; c.lineWidth = 0.05 * u; c.beginPath(); c.moveTo(HX, HY); c.lineTo(ex, ey); c.stroke();
        c.strokeStyle = '#f5f5f5'; c.lineWidth = 0.045 * u; c.fillStyle = 'rgba(255,255,255,.22)';
        c.beginPath(); c.ellipse(cx2, cy2, 0.17 * u, 0.23 * u, Math.atan2(fh * dx, dz), 0, 7); c.fill(); c.stroke();
      }
      // Tête
      const hy = y - 1.68 * u, hr = 0.145 * u;
      c.fillStyle = look.skin; c.beginPath(); c.arc(x, hy, hr, 0, 7); c.fill();
      c.fillStyle = look.hair;
      if (pose.away) { c.beginPath(); c.arc(x, hy - 0.01 * u, hr * 1.04, 0, 7); c.fill(); }
      else {
        c.beginPath(); c.arc(x, hy - 0.02 * u, hr * 1.04, Math.PI * 1.05, Math.PI * 1.95); c.fill();
        c.fillStyle = '#20222a'; c.fillRect(x - 0.065 * u, hy - 0.01 * u, 0.03 * u, 0.03 * u); c.fillRect(x + 0.035 * u, hy - 0.01 * u, 0.03 * u, 0.03 * u);
      }
      if (look.style === 'ponytail') {
        c.strokeStyle = look.hair; c.lineWidth = 0.09 * u; c.beginPath();
        if (pose.away) { c.moveTo(x, hy); c.quadraticCurveTo(x + mv * Math.sin(ph) * 0.1 * u, hy + 0.2 * u, x + mv * Math.sin(ph) * 0.14 * u, hy + 0.36 * u); }
        else { c.moveTo(x - hr, hy - 0.02 * u); c.lineTo(x - hr * 1.05, hy + 0.16 * u); c.moveTo(x + hr, hy - 0.02 * u); c.lineTo(x + hr * 1.05, hy + 0.16 * u); }
        c.stroke();
      } else if (look.style === 'cap') {
        c.fillStyle = '#f6f3ec'; c.beginPath(); c.arc(x, hy - 0.02 * u, hr * 1.08, Math.PI, 0); c.fill();
        if (!pose.away) c.fillRect(x - hr * 1.2, hy - 0.035 * u, hr * 2.4, 0.035 * u);
      } else if (look.style === 'headband') {
        c.strokeStyle = '#f6f3ec'; c.lineWidth = 0.05 * u; c.beginPath(); c.moveTo(x - hr, hy - 0.05 * u); c.lineTo(x + hr, hy - 0.05 * u); c.stroke();
      }
    }

    onEvent(e, g) {
      if (e.type === 'bounce' && e.v > 1.2) {
        this.marks.push({ x: e.x, y: e.y }); if (this.marks.length > 70) this.marks.shift();
        for (let i = 0; i < 7; i++) this.parts.push({ x: e.x, y: e.y, z: 0.05, vx: (Math.random() - 0.5) * 2.4, vy: (Math.random() - 0.5) * 2.4, vz: 0.8 + Math.random() * 1.6, t: 0, life: 0.45 + Math.random() * 0.3 });
      } else if (e.type === 'hit') {
        this.pops.push({ x: e.x, y: e.y, z: e.z, t: 0, ring: true });
        if (e.kind === 'smash') { this.shake = 0.35; this.pop('SMASH !', e.x, e.y, e.z + 0.8, '#ffd23f'); }
        else if (e.by === 0 && e.q > 0.92) this.pop('PARFAIT', e.x, e.y, e.z + 0.8, '#b9f5c8');
      } else if (e.type === 'serve' && e.q > 0.85) this.shake = 0.15;
    }
    pop(text, x, y, z, col) { this.pops.push({ text, x, y, z, t: 0, col }); }
    clearMarks() { this.marks.length = 0; }

    draw(g, dt, human) {
      const c = this.ctx, W = this.W, H = this.H, b = g.ball;
      c.setTransform(1, 0, 0, 1, 0, 0);
      this.shake = Math.max(0, this.shake - dt); this.cheer = Math.max(0, this.cheer - dt * 0.45);
      const k = this.shake * 22 * this.dpr, ox = (Math.random() - 0.5) * k, oy = (Math.random() - 0.5) * k;
      c.drawImage(this.bg, ox - Math.abs(ox), oy - Math.abs(oy), this.cv.width + 2 * Math.abs(ox), this.cv.height + 2 * Math.abs(oy));
      c.setTransform(this.dpr, 0, 0, this.dpr, ox, oy);

      // Public qui s'agite
      if (this.cheer > 0.02) {
        const n = Math.floor(this.fans.length * Math.min(1, this.cheer) * 0.5);
        c.fillStyle = 'rgba(255,255,255,.85)';
        for (let i = 0; i < n; i++) { const f = this.fans[(Math.random() * this.fans.length) | 0]; c.fillRect(f.x - f.r * 1.4, f.y - f.r * 2.6, f.r * 0.7, f.r * 1.6); c.fillRect(f.x + f.r * 0.7, f.y - f.r * 2.6, f.r * 0.7, f.r * 1.6); }
      }
      // Traces de balle sur la terre
      for (const m of this.marks) { const p = this.P(m.x, m.y, 0); c.fillStyle = 'rgba(120,48,18,.38)'; c.beginPath(); c.ellipse(p.x, p.y, p.s * 0.13, p.s * 0.05, 0, 0, 7); c.fill(); }
      // Repère de chute pour le joueur
      if (b.live && b.bounces === 0 && b.lastHitter !== human) {
        const L = g.landing(), p = this.P(L.x, L.y, 0), r = p.s * (0.35 + Math.min(1, L.t) * 0.9);
        c.strokeStyle = 'rgba(255,255,255,.75)'; c.lineWidth = 2; c.beginPath(); c.ellipse(p.x, p.y, r, r * 0.38, 0, 0, 7); c.stroke();
        c.fillStyle = 'rgba(255,255,255,.18)'; c.beginPath(); c.ellipse(p.x, p.y, p.s * 0.35, p.s * 0.13, 0, 0, 7); c.fill();
      }
      // Ombres
      const shadow = (x, y, rx, a) => { const p = this.P(x, y, 0); c.fillStyle = `rgba(40,10,0,${a})`; c.beginPath(); c.ellipse(p.x, p.y, p.s * rx, p.s * rx * 0.36, 0, 0, 7); c.fill(); };
      for (const pl of g.players) shadow(pl.x, pl.y, 0.5, 0.32);
      shadow(b.x, b.y, 0.13, 0.4);

      // Traînée de balle
      if (!b.held) { this.trail.push({ x: b.x, y: b.y, z: b.z }); if (this.trail.length > 7) this.trail.shift(); } else this.trail.length = 0;

      const ents = g.players.map((pl) => ({ y: pl.y, d: () => this.drawPlayer(c, g, pl) }));
      ents.push({ y: 0, d: () => this.drawNet(c) });
      ents.push({ y: b.y + (b.y > 0 ? 0.01 : -0.01), d: () => this.drawBall(c, b) });
      ents.sort((a, z) => a.y - z.y).forEach((e) => e.d());

      // Particules de terre
      for (const p of this.parts) {
        p.t += dt; p.vz -= 6 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z = Math.max(0, p.z + p.vz * dt);
        const q = this.P(p.x, p.y, p.z), a = 1 - p.t / p.life;
        c.fillStyle = `rgba(226,150,105,${0.7 * a})`; c.beginPath(); c.arc(q.x, q.y, q.s * 0.06 * (1 + p.t * 2), 0, 7); c.fill();
      }
      this.parts = this.parts.filter((p) => p.t < p.life);
      // Impacts et textes flottants
      c.textAlign = 'center'; c.textBaseline = 'middle';
      for (const p of this.pops) {
        p.t += dt; const q = this.P(p.x, p.y, p.z);
        if (p.ring) { const a = 1 - p.t / 0.25; if (a > 0) { c.strokeStyle = `rgba(255,255,255,${a})`; c.lineWidth = 3; c.beginPath(); c.arc(q.x, q.y, q.s * (0.15 + p.t * 2.2), 0, 7); c.stroke(); } }
        else { const a = clamp(1.2 - p.t, 0, 1); c.font = `900 ${Math.max(15, q.s * 0.42)}px system-ui, "Segoe UI", sans-serif`; c.lineWidth = 4; c.strokeStyle = `rgba(0,0,0,${0.55 * a})`; c.fillStyle = p.col; c.globalAlpha = a; c.strokeText(p.text, q.x, q.y - p.t * 40); c.fillText(p.text, q.x, q.y - p.t * 40); c.globalAlpha = 1; }
      }
      this.pops = this.pops.filter((p) => p.t < (p.ring ? 0.25 : 1.2));

      // Jauge de service
      if (g.phase === 'toss' && g.server === human) {
        const pl = g.players[human], o = this.P(pl.x, pl.y, 0), gx = o.x + o.s * 1.1, gh = o.s * 2.2, gy = o.y - o.s * 0.2, w = 14;
        c.fillStyle = 'rgba(8,20,16,.7)'; c.beginPath(); c.roundRect(gx - 3, gy - gh - 3, w + 6, gh + 6, 8); c.fill();
        const zone = (t0, t1, col) => { c.fillStyle = col; c.fillRect(gx, gy - gh * (t1 / 1.3), w, gh * ((t1 - t0) / 1.3)); };
        zone(0.25, 1.05, '#d9534f'); zone(0.45, 0.85, '#f2c14e'); zone(0.57, 0.73, '#4cd07d');
        const ty = gy - gh * clamp(g.tossT / 1.3, 0, 1);
        c.fillStyle = '#fff'; c.fillRect(gx - 6, ty - 2, w + 12, 4);
      }
    }

    drawPlayer(c, g, pl) {
      const o = this.P(pl.x, pl.y, 0), sp = Math.hypot(pl.vx, pl.vy);
      const tossing = g.phase === 'toss' && g.server === pl.i;
      this.figure(c, o, pl.def.look, {
        away: pl.sgn > 0, fh: pl.sgn, run: pl.run, moving: sp > 0.6,
        swing: pl.swing ? { anim: pl.swing.anim, p: pl.swing.t / 0.42 } : null, toss: tossing,
      });
    }

    drawBall(c, b) {
      const n = this.trail.length;
      for (let i = 1; i < n; i++) {
        const p = this.P(this.trail[i - 1].x, this.trail[i - 1].y, this.trail[i - 1].z), q = this.P(this.trail[i].x, this.trail[i].y, this.trail[i].z);
        c.strokeStyle = `rgba(232,255,90,${(i / n) * 0.45})`; c.lineWidth = q.s * 0.14 * (i / n); c.lineCap = 'round';
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke();
      }
      const p = this.P(b.x, b.y, b.z), r = Math.max(3, p.s * 0.1);
      const gr = c.createRadialGradient(p.x - r * 0.3, p.y - r * 0.3, r * 0.1, p.x, p.y, r);
      gr.addColorStop(0, '#f6ff9a'); gr.addColorStop(1, '#c6e21a');
      c.fillStyle = gr; c.beginPath(); c.arc(p.x, p.y, r, 0, 7); c.fill();
      c.strokeStyle = 'rgba(60,80,0,.5)'; c.lineWidth = 1; c.stroke();
    }

    drawNet(c) {
      const px = COURT.postX, h = A.netHeightAt, top = [], N = 26;
      for (let i = 0; i <= N; i++) { const x = lerp(-px, px, i / N); top.push([x, 0, h(x)]); }
      this.poly(c, top.concat([[px, 0, 0], [-px, 0, 0]]), 'rgba(15,20,22,.3)');
      c.strokeStyle = 'rgba(15,20,22,.45)'; c.lineWidth = 1; c.beginPath();
      for (let x = -px; x <= px + 0.01; x += 0.25) { const a = this.P(x, 0, 0), q = this.P(x, 0, h(x)); c.moveTo(a.x, a.y); c.lineTo(q.x, q.y); }
      for (const fz of [0.2, 0.4, 0.6, 0.8]) top.forEach((t, i) => { const q = this.P(t[0], 0, t[2] * fz); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); });
      c.stroke();
      c.strokeStyle = '#fbfbf7'; c.lineWidth = Math.max(2.5, this.P(0, 0, 1).s * 0.07); c.lineCap = 'butt'; c.beginPath();
      top.forEach((t, i) => { const q = this.P(t[0], t[1], t[2]); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); }); c.stroke();
      this.line(c, [0, 0, 0], [0, 0, 0.914], '#fbfbf7', 0.05);
      for (const sg of [-1, 1]) this.line(c, [sg * px, 0, 0], [sg * px, 0, 1.1], '#123d2f', 0.1);
    }
  }

  A.Renderer = Renderer;
})(typeof window !== 'undefined' ? window : globalThis);
