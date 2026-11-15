// Rendu 2.5D sur canvas : caméra en perspective derrière le joueur, stade pré-rendu par tournoi
// (terre battue de Roland-Garros, gazon de Wimbledon), joueurs articulés, lumière et ombres portées,
// caméra qui accompagne le jeu, particules.
(function (root) {
  const A = (root.Agasso = root.Agasso || {});
  const { COURT, clamp, lerp } = A;
  const SHIRTS = ['#f4efe6', '#f4efe6', '#e9dcc3', '#dfe7ee', '#2f5d8a', '#b8433a', '#f2d16b', '#3c3c44', '#7fa6c9', '#d98c6a', '#6c8f5b', '#e8a7b8'];
  const SKINS = ['#f0c9a8', '#e6b792', '#d9a47c', '#b97f58', '#8a5a3c'];
  const SUN = { x: -0.55, y: 0.3 }; // déplacement de l'ombre au sol par mètre de hauteur
  const FONT = 'system-ui, "Segoe UI", sans-serif';

  function seeded(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

  // Articulation à deux segments : renvoie le coude / genou entre a et b.
  function joint(ax, ay, bx, by, l1, l2, bend) {
    const dx = bx - ax, dy = by - ay, d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.001) || 0.001;
    const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)), base = Math.atan2(dy, dx) + a * bend;
    return [ax + Math.cos(base) * l1, ay + Math.sin(base) * l1];
  }

  // Dessine un personnage. o = {x, y, s} : pieds à l'écran, s = pixels par mètre.
  // pose = {away, fh, run, speed, lean, ready, t, swing:{anim,p}, toss, still, seated, crouch}
  function figure(c, o, look, pose) {
    const fh = pose.fh || 1, mv = pose.speed || 0, ph = pose.run || 0, t = pose.t || 0, away = !!pose.away;
    const seg = (ax, ay, bx, by, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); };
    c.save(); c.translate(o.x, o.y); c.scale(o.s, -o.s); c.lineCap = 'round'; c.lineJoin = 'round';
    if (pose.lean) c.rotate(pose.lean);
    const crouch = pose.crouch != null ? pose.crouch : pose.still || pose.seated ? 0 : (pose.ready ? 0.08 + 0.025 * Math.sin(t * 7) : 0.03) + mv * 0.05;
    const hipY = 0.9 - crouch + mv * Math.abs(Math.sin(ph)) * 0.05, shY = hipY + 0.54, headY = shY + 0.26;

    // Jambes
    if (!pose.seated) {
      for (const k of [-1, 1]) {
        const p2 = ph + (k > 0 ? 0 : Math.PI);
        const fx = k * (0.13 + (pose.ready ? 0.07 : 0) + crouch * 0.25) + mv * Math.sin(p2) * 0.26, fy = mv * Math.max(0, Math.cos(p2)) * 0.15;
        const hx = k * 0.1, kn = joint(hx, hipY, fx, fy + 0.07, 0.42, 0.42, k * 0.9);
        seg(hx, hipY, kn[0], kn[1], 0.15, look.skin); seg(kn[0], kn[1], fx, fy + 0.09, 0.11, look.skin);
        seg(fx, fy + 0.2, fx, fy + 0.1, 0.105, '#fbfbf6');
        c.fillStyle = '#fbfbf6'; c.beginPath(); c.ellipse(fx + k * 0.02, fy + 0.045, 0.125, 0.06, 0, 0, 7); c.fill();
        seg(fx - 0.06, fy + 0.03, fx + 0.1, fy + 0.03, 0.02, look.accent);
        if (!look.skirt) seg(hx, hipY, lerp(hx, kn[0], 0.6), lerp(hipY, kn[1], 0.6), 0.2, look.shorts);
      }
    }
    c.fillStyle = look.shorts; c.beginPath();
    if (look.skirt) { c.moveTo(-0.2, hipY + 0.12); c.lineTo(0.2, hipY + 0.12); c.lineTo(0.32, hipY - 0.2); c.lineTo(-0.32, hipY - 0.2); }
    else c.roundRect(-0.21, hipY - 0.07, 0.42, 0.2, 0.05);
    c.fill();

    // Main raquette (hx, hz) et direction de la raquette (dx, dz) relatives à l'épaule ; main libre (ox, oz).
    let hx = 0.34, hz = -0.42, dx = 0.5, dz = 0.85, ox = 0.1, oz = -0.46 + mv * 0.08 * Math.sin(ph), two = false;
    const sw = pose.swing;
    if (sw) {
      const p = clamp(sw.p, 0, 1), e = p * p * (3 - 2 * p), a = lerp(-0.6, 2.8, e);
      if (sw.anim === 'oh') { hx = 0.2 - 0.42 * e; hz = 0.62 * Math.cos(e * 2.5); dx = 0.2 - 0.8 * e; dz = Math.cos(e * 2.8); ox = 0.05; oz = 0.45 - 0.9 * e; }
      else if (sw.anim === 'bh') { hx = -0.58 * Math.cos(a) + 0.08; hz = -0.2 + 0.34 * Math.sin(a * 0.8); dx = -Math.cos(a); dz = 0.3 + 0.4 * Math.sin(a); two = true; }
      else { hx = 0.58 * Math.cos(a); hz = -0.2 + 0.34 * Math.sin(a * 0.8); dx = Math.cos(a); dz = 0.3 + 0.4 * Math.sin(a); ox = 0.18; oz = -0.25; }
    } else if (pose.toss) { hx = 0.36; hz = 0.08; dx = 0.2; dz = 0.95; ox = -0.04; oz = 0.56; }
    else if (pose.still) { hx = 0.06; hz = -0.52; ox = 0.06; oz = -0.52; }
    else if (pose.seated) { hx = -0.03; hz = -0.4; ox = -0.03; oz = -0.4; }
    const dl = Math.hypot(dx, dz) || 1; dx /= dl; dz /= dl;
    const sY = shY - 0.04, SX = fh * 0.25, HX = SX + fh * hx, HY = sY + hz;
    const arm = (side, ex, ey) => {
      const sx = side * 0.25, el = joint(sx, sY, ex, ey, 0.275, 0.275, side * 0.8);
      seg(sx, sY, el[0], el[1], 0.1, look.skin); seg(el[0], el[1], ex, ey, 0.085, look.skin);
      seg(sx, sY, lerp(sx, el[0], 0.45), lerp(sY, el[1], 0.45), 0.135, look.shirt);
      c.fillStyle = look.skin; c.beginPath(); c.arc(ex, ey, 0.055, 0, 7); c.fill();
    };
    // Revers à deux mains : la main libre rejoint le manche.
    const OX = two ? HX - fh * dx * 0.08 : -SX - fh * ox, OY = two ? HY - dz * 0.08 : sY + oz;
    if (!two) arm(-fh, OX, OY);

    // Torse
    c.fillStyle = look.shirt; c.beginPath();
    c.moveTo(-0.26, shY - 0.02); c.quadraticCurveTo(0, shY + 0.07, 0.26, shY - 0.02); c.quadraticCurveTo(0.25, hipY + 0.3, 0.2, hipY + 0.05); c.lineTo(-0.2, hipY + 0.05); c.quadraticCurveTo(-0.25, hipY + 0.3, -0.26, shY - 0.02);
    c.fill();
    const gr = c.createLinearGradient(-0.26, 0, 0.26, 0); gr.addColorStop(0, 'rgba(10,14,40,.3)'); gr.addColorStop(0.55, 'rgba(10,14,40,0)'); gr.addColorStop(1, 'rgba(255,255,255,.12)');
    c.fillStyle = gr; c.fill();
    seg(-0.215, shY - 0.1, -0.185, hipY + 0.1, 0.03, look.accent); seg(0.215, shY - 0.1, 0.185, hipY + 0.1, 0.03, look.accent);
    // Cou et tête
    seg(0, shY, 0, headY - 0.1, 0.1, look.skin);
    if (!away) { c.fillStyle = look.accent; c.beginPath(); c.moveTo(-0.08, shY + 0.03); c.lineTo(0, shY - 0.07); c.lineTo(0.08, shY + 0.03); c.fill(); }
    const hr = 0.135;
    c.fillStyle = look.skin; c.beginPath(); c.arc(0, headY, hr, 0, 7); c.fill();
    c.beginPath(); c.arc(-hr, headY - 0.01, 0.03, 0, 7); c.arc(hr, headY - 0.01, 0.03, 0, 7); c.fill();
    c.fillStyle = look.hair;
    if (away) { c.beginPath(); c.arc(0, headY + 0.012, hr * 1.05, 0, 7); c.fill(); }
    else {
      c.beginPath(); c.arc(0, headY + 0.02, hr * 1.06, Math.PI * 0.04, Math.PI * 0.96); c.fill();
      c.fillStyle = '#20222a'; c.beginPath(); c.arc(-0.05, headY + 0.005, 0.016, 0, 7); c.arc(0.05, headY + 0.005, 0.016, 0, 7); c.fill();
      seg(-0.03, headY - 0.065, 0.03, headY - 0.065, 0.012, 'rgba(120,50,40,.8)');
    }
    if (look.style === 'ponytail') {
      const s2 = mv * Math.sin(ph) * 0.12;
      if (away) { c.strokeStyle = look.hair; c.lineWidth = 0.1; c.beginPath(); c.moveTo(0, headY + 0.02); c.quadraticCurveTo(s2 * 0.6, headY - 0.2, s2, headY - 0.36); c.stroke(); seg(-0.01, headY - 0.03, 0.01, headY - 0.03, 0.1, look.accent); }
      else { seg(-hr, headY + 0.03, -hr * 1.08, headY - 0.17, 0.07, look.hair); seg(hr, headY + 0.03, hr * 1.08, headY - 0.17, 0.07, look.hair); }
    } else if (look.style === 'cap') {
      c.fillStyle = '#fbfbf6'; c.beginPath(); c.arc(0, headY + 0.025, hr * 1.1, 0, Math.PI); c.fill();
      if (!away) { c.beginPath(); c.ellipse(0, headY + 0.03, hr * 1.25, 0.035, 0, 0, 7); c.fill(); }
      seg(-hr, headY + 0.035, hr, headY + 0.035, 0.02, look.accent);
    } else if (look.style === 'headband') seg(-hr, headY + 0.055, hr, headY + 0.055, 0.05, look.accent);

    // Raquette puis bras
    if (!pose.still && !pose.seated) {
      const rx = fh * dx, ang = Math.atan2(dz, rx), cx2 = HX + rx * 0.53, cy2 = HY + dz * 0.53;
      seg(HX - rx * 0.05, HY - dz * 0.05, HX + rx * 0.32, HY + dz * 0.32, 0.045, '#1c1f26');
      c.fillStyle = 'rgba(255,255,255,.2)'; c.strokeStyle = '#f7f7f2'; c.lineWidth = 0.04;
      c.beginPath(); c.ellipse(cx2, cy2, 0.215, 0.155, ang, 0, 7); c.fill(); c.stroke();
      c.save(); c.translate(cx2, cy2); c.rotate(ang); c.strokeStyle = 'rgba(255,255,255,.5)'; c.lineWidth = 0.012; c.beginPath();
      for (const q of [-0.1, 0, 0.1]) { c.moveTo(q, -0.14); c.lineTo(q, 0.14); c.moveTo(-0.19, q * 0.9); c.lineTo(0.19, q * 0.9); }
      c.stroke(); c.restore();
    }
    if (two) arm(-fh, OX, OY);
    arm(fh, HX, HY);
    c.restore();
  }

  class Renderer {
    constructor(canvas) {
      this.cv = canvas; this.ctx = canvas.getContext('2d');
      this.bg = document.createElement('canvas');
      this.venue = A.VENUES.rg;
      this.marks = []; this.parts = []; this.pops = []; this.trail = [];
      this.shake = 0; this.cheer = 0; this.fans = []; this.time = 0;
      this.cam = { x: 0, y: 0, z: 1 };
      this.resize();
    }

    setVenue(id) { const v = A.VENUES[id] || A.VENUES.rg; if (v !== this.venue) { this.venue = v; this.clearMarks(); this.paintBackground(); } }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = this.cv.clientWidth || 1280, h = this.cv.clientHeight || 720;
      this.W = w; this.H = h; this.dpr = dpr; this.M = Math.round(w * 0.05);
      this.cv.width = Math.round(w * dpr); this.cv.height = Math.round(h * dpr);
      this.bg.width = Math.round((w + 2 * this.M) * dpr); this.bg.height = Math.round((h + 2 * this.M) * dpr);
      this.f = Math.min(w * 0.9, h * 1.6);
      this.cx = w / 2; this.cy = h * 0.5 - this.f * 0.02;
      const C = (this.C = [0, 26.5, 8.2]), T = [0, -2.5, 0.9];
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
    path(c, pts) { c.beginPath(); pts.forEach((p, i) => { const q = this.P(p[0], p[1], p[2] || 0); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); }); c.closePath(); }
    poly(c, pts, fill, stroke, lw) {
      this.path(c, pts);
      if (fill) { c.fillStyle = fill; c.fill(); }
      if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw || 1; c.stroke(); }
    }
    line(c, a, b, col, wMeters) {
      const p = this.P(a[0], a[1], a[2] || 0), q = this.P(b[0], b[1], b[2] || 0);
      c.strokeStyle = col; c.lineWidth = Math.max(1.3, wMeters * (p.s + q.s) * 0.5);
      c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke();
    }
    // Tache douce au sol (dégradé radial aplati par la perspective).
    blot(c, x, y, rx, ry, col, a) {
      const p = this.P(x, y, 0), q = this.P(x, y + ry, 0), k = Math.max(0.05, Math.abs(q.y - p.y) / (rx * p.s));
      c.save(); c.translate(p.x, p.y); c.scale(1, k);
      const g = c.createRadialGradient(0, 0, 0, 0, 0, rx * p.s); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`);
      c.fillStyle = g; c.beginPath(); c.arc(0, 0, rx * p.s, 0, 7); c.fill(); c.restore();
    }

    paintBackground() {
      const c = this.bg.getContext('2d'), W = this.W, H = this.H, M = this.M, rnd = seeded(2026), co = COURT, v = this.venue;
      c.setTransform(this.dpr, 0, 0, this.dpr, M * this.dpr, M * this.dpr);
      c.lineCap = 'butt';
      // Ciel et nuages
      const hz = this.P(0, -400, 0).y;
      const sky = c.createLinearGradient(0, -M, 0, hz + 40); sky.addColorStop(0, v.sky[0]); sky.addColorStop(1, v.sky[1]);
      c.fillStyle = sky; c.fillRect(-M, -M, W + 2 * M, H + 2 * M);
      for (let i = 0; i < (v.id === 'wim' ? 9 : 5); i++) {
        const x = rnd() * (W + 2 * M) - M, y = -M + rnd() * (hz * 0.8 + M), w = 70 + rnd() * 110;
        for (let j = 0; j < 5; j++) { c.fillStyle = `rgba(255,255,255,${0.35 + rnd() * 0.3})`; c.beginPath(); c.ellipse(x + (rnd() - 0.5) * w, y + (rnd() - 0.5) * 12, w * (0.3 + rnd() * 0.4), 9 + rnd() * 12, 0, 0, 7); c.fill(); }
      }

      const X = 11, YB = -19, YF = 27, WALL = 1.6;
      this.fans = [];
      const person = (x, y, z) => {
        const p = this.P(x, y, z), r = Math.max(1.3, p.s * 0.19);
        c.fillStyle = SHIRTS[(rnd() * SHIRTS.length) | 0]; c.beginPath(); c.roundRect(p.x - r * 1.05, p.y - r * 0.7, r * 2.1, r * 2, r * 0.5); c.fill();
        c.fillStyle = SKINS[(rnd() * SKINS.length) | 0]; c.beginPath(); c.arc(p.x, p.y - r * 1.35, r * 0.78, 0, 7); c.fill();
        const k = rnd();
        if (k < 0.24) { c.fillStyle = k < 0.17 ? '#f1e6c8' : '#fbfbf6'; c.beginPath(); c.arc(p.x, p.y - r * 1.55, r * 0.8, Math.PI, 0); c.fill(); c.fillRect(p.x - r * 1.15, p.y - r * 1.62, r * 2.3, r * 0.26); }
        else if (k < 0.6) { c.fillStyle = ['#3b2a20', '#1d1d1f', '#7a4a25', '#c9a15a', '#9a9a9a'][(rnd() * 5) | 0]; c.beginPath(); c.arc(p.x, p.y - r * 1.45, r * 0.8, Math.PI, 0); c.fill(); }
        if (rnd() < 0.22) this.fans.push({ x: p.x, y: p.y - r * 1.35, r });
      };
      const rowD = (r) => 0.7 + r * 0.74, rowZ = (r) => WALL + 0.5 + r * 0.52;

      // --- Tribune du fond : deux niveaux, bandeau lumineux, toit ---
      const BX = X + 9, R1 = 12, R2 = 24, GAP = 1.5;
      const bd = (r) => rowD(r) + (r >= R1 ? 1.2 : 0), bz = (r) => rowZ(r) + (r >= R1 ? GAP : 0);
      this.poly(c, [[-BX, YB, WALL], [BX, YB, WALL], [BX + 6, YB - bd(R2), bz(R2)], [-BX - 6, YB - bd(R2), bz(R2)]], v.seat);
      for (let r = 0; r < R2; r++) {
        if (r === R1) continue;
        const wdt = BX + r * 0.25;
        this.line(c, [-wdt, YB - bd(r) + 0.35, bz(r) - 0.42], [wdt, YB - bd(r) + 0.35, bz(r) - 0.42], 'rgba(0,0,0,.28)', 0.1);
        for (let x = -wdt; x <= wdt; x += 0.6) {
          const aisle = Math.abs((Math.abs(x) % 7.2) - 3.6) < 0.34;
          if (aisle) { const p = this.P(x, YB - bd(r), bz(r) - 0.35); c.fillStyle = 'rgba(235,235,225,.5)'; c.fillRect(p.x - p.s * 0.22, p.y - p.s * 0.1, p.s * 0.44, p.s * 0.5); }
          else if (rnd() < 0.93) person(x + (rnd() - 0.5) * 0.14, YB - bd(r), bz(r));
        }
      }
      const fy = YB - bd(R1) + 0.5, fz0 = bz(R1 - 1) + 0.25, fz1 = bz(R1) - 0.2;
      this.poly(c, [[-BX - 3, fy, fz0], [BX + 3, fy, fz0], [BX + 3, fy, fz1], [-BX - 3, fy, fz1]], v.wall);
      const a0 = this.P(-5.2, fy, fz0), a1 = this.P(5.2, fy, fz1);
      this.led = { x: a0.x, y: a1.y, w: a1.x - a0.x, h: a0.y - a1.y };
      c.fillStyle = '#071019'; c.fillRect(this.led.x, this.led.y, this.led.w, this.led.h);
      c.fillStyle = '#f3ede0'; c.textAlign = 'center'; c.textBaseline = 'middle';
      const fp = this.P(0, fy, (fz0 + fz1) / 2); c.font = `700 ${fp.s * 0.62}px ${FONT}`;
      c.fillText(v.city.toUpperCase(), this.P(-11, fy, 0).x, fp.y); c.fillText('2026', this.P(11, fy, 0).x, fp.y);
      // Ombre du toit sur le haut de la tribune, puis le toit lui-même
      const ty = YB - bd(R2), tz = bz(R2);
      this.path(c, [[-BX - 6, ty, tz], [BX + 6, ty, tz], [BX + 3, YB - bd(R1 + 4), bz(R1 + 4)], [-BX - 3, YB - bd(R1 + 4), bz(R1 + 4)]]);
      c.fillStyle = 'rgba(8,14,28,.42)'; c.fill();
      this.poly(c, [[-BX - 8, ty - 1, tz + 2.2], [BX + 8, ty - 1, tz + 2.2], [BX + 8, ty + 9, tz + 3.4], [-BX - 8, ty + 9, tz + 3.4]], '#39454d');
      this.poly(c, [[-BX - 8, ty + 9, tz + 3.4], [BX + 8, ty + 9, tz + 3.4], [BX + 8, ty + 9, tz + 4.3], [-BX - 8, ty + 9, tz + 4.3]], v.roof);
      for (let x = -BX - 6; x <= BX + 6; x += 3) { const p = this.P(x, ty + 8.6, tz + 3.3); c.fillStyle = '#fffbe6'; c.fillRect(p.x - p.s * 0.5, p.y - p.s * 0.12, p.s, p.s * 0.24); }
      for (let x = -BX - 4; x <= BX + 4; x += 6.5) this.line(c, [x, ty, tz], [x, ty + 4, tz + 2.7], '#2a3238', 0.22);

      // --- Tribunes latérales ---
      const RS = 19;
      for (const sg of [-1, 1]) {
        this.poly(c, [[sg * X, YB, WALL], [sg * X, YF, WALL], [sg * (X + rowD(RS)), YF, rowZ(RS)], [sg * (X + rowD(RS)), YB, rowZ(RS)]], v.seat);
        const pts = [];
        for (let r = 0; r < RS; r++) for (let y = YB + 0.3; y <= 21; y += 0.66) {
          const aisle = Math.abs((((y - YB) % 7.6) + 7.6) % 7.6 - 3.8) < 0.36;
          if (aisle || rnd() < 0.93) pts.push([sg * (X + rowD(r)), y + (aisle ? 0 : (rnd() - 0.5) * 0.14), rowZ(r), aisle]);
        }
        pts.sort((a, b) => a[1] - b[1] || a[2] - b[2]);
        for (const p of pts) {
          if (p[3]) { const q = this.P(p[0], p[1], p[2] - 0.35); c.fillStyle = 'rgba(235,235,225,.5)'; c.fillRect(q.x - q.s * 0.3, q.y - q.s * 0.1, q.s * 0.6, q.s * 0.45); }
          else person(p[0], p[1], p[2]);
        }
        const tx = sg * (X + rowD(RS)), tz2 = rowZ(RS);
        this.poly(c, [[tx, YB, tz2], [tx, YF, tz2], [tx, YF, tz2 + 1.1], [tx, YB, tz2 + 1.1]], v.wallDark);
        for (let y = YB + 2, i = 0; y < 22; y += 4.5, i++) { // mâts et fanions
          this.line(c, [tx, y, tz2 + 1.1], [tx, y, tz2 + 4.3], '#dfe3e6', 0.09);
          this.poly(c, [[tx, y, tz2 + 4.3], [tx, y + 1.5, tz2 + 3.95], [tx, y, tz2 + 3.5]], i % 2 ? v.accent : '#fbfbf6');
        }
        if (sg > 0) { this.path(c, [[sg * X, YB, WALL], [sg * X, YF, WALL], [tx, YF, tz2 + 1.1], [tx, YB, tz2 + 1.1]]); c.fillStyle = 'rgba(8,14,34,.3)'; c.fill(); }
      }

      // --- Sol ---
      const ground = [[-X, YB, 0], [X, YB, 0], [X, YF, 0], [-X, YF, 0]];
      this.poly(c, ground, v.court);
      c.save(); this.path(c, ground); c.clip();
      if (v.id === 'wim') {
        let i = 0;
        for (let x = -X; x < X; x += 1.03, i++) if (i % 2) this.poly(c, [[x, YB, 0], [x + 1.03, YB, 0], [x + 1.03, YF, 0], [x, YF, 0]], v.courtLight);
        for (let k = 0; k < 4200; k++) { const p = this.P((rnd() * 2 - 1) * X, lerp(YB, 19, rnd()), 0); c.fillStyle = rnd() < 0.5 ? 'rgba(210,235,160,.16)' : 'rgba(20,60,15,.16)'; c.fillRect(p.x, p.y, Math.max(1, p.s * 0.02), Math.max(1.5, p.s * 0.06)); }
        for (const sy of [-1, 1]) { // gazon usé derrière les lignes de fond et au carré de service
          this.blot(c, 0, sy * 12.3, 4.6, 1.5, '176,150,92', 0.6); this.blot(c, -2.3, sy * 12.1, 2.4, 1.1, '160,138,84', 0.4); this.blot(c, 2.3, sy * 12.1, 2.4, 1.1, '160,138,84', 0.4);
          this.blot(c, 0, sy * 6.2, 1.6, 0.9, '170,150,95', 0.3);
        }
      } else {
        for (let k = 0; k < 70; k++) this.blot(c, (rnd() * 2 - 1) * X, lerp(YB, 20, rnd()), 1.5 + rnd() * 3, 1 + rnd() * 2, rnd() < 0.5 ? '255,200,160' : '110,40,10', 0.07);
        for (const sy of [-1, 1]) { this.blot(c, 0, sy * 12.4, 5, 1.6, '255,205,170', 0.2); this.blot(c, 0, sy * 6, 3.5, 2, '255,205,170', 0.1); }
        for (let k = 0; k < 4200; k++) { const p = this.P((rnd() * 2 - 1) * X, lerp(YB, 19, rnd()), 0); c.fillStyle = rnd() < 0.5 ? 'rgba(255,210,170,.15)' : 'rgba(95,35,10,.15)'; c.fillRect(p.x, p.y, Math.max(1, p.s * 0.05), Math.max(1, p.s * 0.02)); }
      }
      // Lumière : halo chaud au centre, ombre de la tribune sur le côté droit du court
      const g = c.createRadialGradient(W * 0.42, H * 0.5, H * 0.1, W * 0.45, H * 0.55, H);
      g.addColorStop(0, 'rgba(255,235,190,.16)'); g.addColorStop(1, 'rgba(20,10,30,.2)');
      c.fillStyle = g; c.fillRect(-M, -M, W + 2 * M, H + 2 * M);
      this.poly(c, [[X, YB, 0], [4.9, YB, 0], [7.4, YF, 0], [X, YF, 0]], 'rgba(12,16,48,.26)');
      c.restore();

      // --- Murs, bâches, fleurs ---
      this.poly(c, [[-X, YB, 0], [X, YB, 0], [X, YB, WALL], [-X, YB, WALL]], v.wall);
      for (const sg of [-1, 1]) this.poly(c, [[sg * X, YB, 0], [sg * X, YF, 0], [sg * X, YF, WALL], [sg * X, YB, WALL]], sg > 0 ? v.wallDark : v.wall);
      this.poly(c, [[-X, YB, WALL], [X, YB, WALL], [X, YB, WALL + 0.22], [-X, YB, WALL + 0.22]], v.trim);
      for (const sg of [-1, 1]) this.poly(c, [[sg * X, YB, WALL], [sg * X, YF, WALL], [sg * X, YF, WALL + 0.22], [sg * X, YB, WALL + 0.22]], v.trim);
      for (let k = 0; k < 500; k++) { const side = rnd() < 0.4, p = side ? this.P((rnd() < 0.5 ? -1 : 1) * X, lerp(YB, 20, rnd()), WALL + 0.1 + rnd() * 0.16) : this.P((rnd() * 2 - 1) * X, YB, WALL + 0.1 + rnd() * 0.16); c.fillStyle = rnd() < 0.5 ? 'rgba(255,255,255,.55)' : 'rgba(40,110,50,.7)'; c.fillRect(p.x, p.y, Math.max(1.2, p.s * 0.07), Math.max(1.2, p.s * 0.07)); }
      const wp = this.P(0, YB, WALL * 0.5);
      c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#f3ede0';
      c.font = `800 ${wp.s * 0.8}px ${FONT}`; c.fillText(v.name.toUpperCase(), wp.x, wp.y);
      c.font = `700 ${wp.s * 0.46}px ${FONT}`;
      for (const sx of [-7.4, 7.4]) { const q = this.P(sx, YB, WALL * 0.5); c.fillText(sx < 0 ? v.city.toUpperCase() : v.surface.toUpperCase(), q.x, q.y); }
      for (let y = YB + 4; y < 18; y += 7) for (const sg of [-1, 1]) this.poly(c, [[sg * X, y, 0.3], [sg * X, y + 4.6, 0.3], [sg * X, y + 4.6, 1.3], [sg * X, y, 1.3]], 'rgba(243,237,224,.14)');

      // --- Lignes ---
      const L = (a, b) => this.line(c, a, b, 'rgba(255,255,252,.95)', 0.06);
      const hw = co.halfW, hl = co.halfL, sv = co.service;
      L([-hw, -hl], [hw, -hl]); L([-hw, hl], [hw, hl]); L([-hw, -hl], [-hw, hl]); L([hw, -hl], [hw, hl]);
      L([-hw, -sv], [hw, -sv]); L([-hw, sv], [hw, sv]); L([0, -sv], [0, sv]);
      L([0, -hl], [0, -hl + 0.25]); L([0, hl], [0, hl - 0.25]);
      // Ombre du filet
      this.poly(c, [[-co.postX, 0, 0], [co.postX, 0, 0], [co.postX + SUN.x, SUN.y, 0], [-co.postX + SUN.x, SUN.y, 0]], 'rgba(20,10,30,.2)');

      // --- Officiels, ramasseurs, bancs, parasols ---
      const staff = { shirt: v.id === 'wim' ? '#274a8a' : '#1d3a5f', shorts: '#e9e2d0', accent: '#e9e2d0', skin: '#e6b792', hair: '#333', style: 'cap' };
      const kid = { shirt: v.id === 'wim' ? '#4b2a7a' : '#d4572e', shorts: '#1b2430', accent: '#fbfbf6', skin: '#dba77e', hair: '#2b2018', style: 'short' };
      const stand = (x, y, look, pose) => { const p = this.P(x, y, 0), h = this.P(x + SUN.x * 1.6, y + SUN.y * 1.6, 0); c.strokeStyle = 'rgba(25,10,20,.24)'; c.lineWidth = p.s * 0.4; c.lineCap = 'round'; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(h.x, h.y); c.stroke(); figure(c, p, look, pose); };
      for (const jx of [-9.6, 9.6]) stand(jx, YB + 0.9, staff, { away: false, fh: 1, still: true });
      for (const jx of [-5.3, 5.3]) stand(jx, YB + 0.7, kid, { away: false, fh: 1, still: true });
      const ux = -6.5;
      for (const by of [-3.4, 3.4]) {
        const b0 = this.P(ux - 1.1, by, 0), pc = this.P(ux - 1.1, by, 2.5);
        this.blot(c, ux - 1.9, by + 0.5, 1.7, 1.2, '20,10,30', 0.32);
        this.poly(c, [[ux - 1.6, by - 0.9, 0.45], [ux - 0.7, by - 0.9, 0.45], [ux - 0.7, by + 0.9, 0.45], [ux - 1.6, by + 0.9, 0.45]], '#e8e2d2');
        this.poly(c, [[ux - 0.7, by - 0.9, 0], [ux - 0.7, by + 0.9, 0], [ux - 0.7, by + 0.9, 0.45], [ux - 0.7, by - 0.9, 0.45]], '#bdb6a3');
        this.line(c, [ux - 1.1, by, 0], [ux - 1.1, by, 2.5], '#d8d8d8', 0.06);
        c.fillStyle = v.parasol; c.beginPath(); c.ellipse(pc.x, pc.y, pc.s * 1.45, pc.s * 0.5, 0, 0, 7); c.fill();
        c.fillStyle = 'rgba(0,0,0,.14)'; c.beginPath(); c.ellipse(pc.x, pc.y + pc.s * 0.1, pc.s * 1.45, pc.s * 0.4, 0, 0, Math.PI); c.fill();
        c.fillStyle = v.accent; c.fillRect(b0.x + b0.s * 0.55, b0.y - b0.s * 0.62, b0.s * 0.5, b0.s * 0.3);
      }
      for (const kx of [-co.postX - 1.0, co.postX + 1.0]) stand(kx, 0.5, kid, { away: true, fh: 1, still: true, crouch: 0.42 });
      // Chaise d'arbitre
      for (const [dx2, dy2, col] of [[-0.4, -0.3, '#cfc8b6'], [0.4, -0.3, '#cfc8b6'], [-0.4, 0.3, '#f1ecdf'], [0.4, 0.3, '#f1ecdf']]) this.line(c, [ux + dx2, dy2, 0], [ux + dx2 * 0.6, dy2 * 0.4, 1.9], col, 0.07);
      for (const zz of [0.6, 1.2]) this.line(c, [ux - 0.34, 0.25, zz], [ux + 0.34, 0.25, zz], '#f1ecdf', 0.05);
      this.poly(c, [[ux - 0.42, 0.25, 1.9], [ux + 0.42, 0.25, 1.9], [ux + 0.42, -0.25, 1.9], [ux - 0.42, -0.25, 1.9]], v.wall);
      const up = this.P(ux, 0, 1.9);
      figure(c, { x: up.x, y: up.y + up.s * 0.82, s: up.s }, { shirt: '#f4efe6', shorts: '#16222b', accent: v.accent, skin: '#e6b792', hair: '#555', style: 'cap' }, { away: false, fh: 1, seated: true });
    }

    onEvent(e) {
      const v = this.venue;
      if (e.type === 'bounce' && e.v > 1.2) {
        if (v.mark) { this.marks.push({ x: e.x, y: e.y, a: 0.2 + Math.min(0.25, e.v * 0.03) }); if (this.marks.length > 90) this.marks.shift(); }
        const n = e.line ? 12 : v.id === 'wim' ? 3 : 8, col = e.line ? '255,255,255' : v.dust;
        for (let i = 0; i < n; i++) this.parts.push({ x: e.x, y: e.y, z: 0.05, vx: (Math.random() - 0.5) * 2.6, vy: (Math.random() - 0.5) * 2.6, vz: 0.8 + Math.random() * 1.8, t: 0, life: 0.45 + Math.random() * 0.35, col });
      } else if (e.type === 'hit') {
        this.pops.push({ x: e.x, y: e.y, z: e.z, t: 0, ring: true, big: e.kind === 'smash' });
        if (e.kind === 'smash') { this.shake = 0.35; this.pop('SMASH !', e.x, e.y, e.z + 0.8, '#ffd23f'); }
        else if (e.by === 0 && e.q > 0.92) this.pop('PARFAIT', e.x, e.y, e.z + 0.8, '#b9f5c8');
      } else if (e.type === 'serve' && e.q > 0.85) this.shake = 0.15;
    }
    pop(text, x, y, z, col) { this.pops.push({ text, x, y, z, t: 0, col }); }
    clearMarks() { this.marks.length = 0; this.parts.length = 0; }

    // Tenue : à Wimbledon tout le monde joue en blanc, la couleur du joueur passe en liseré.
    lookFor(def) {
      const l = def.look;
      return this.venue.whites ? Object.assign({}, l, { shirt: '#fbfbf6', shorts: '#fbfbf6', accent: l.shirt }) : l;
    }

    draw(g, dt, human) {
      const c = this.ctx, W = this.W, H = this.H, M = this.M, b = g.ball, d = this.dpr, cam = this.cam;
      this.time += dt;
      this.shake = Math.max(0, this.shake - dt); this.cheer = Math.max(0, this.cheer - dt * 0.45);
      // Caméra : léger suivi de la balle, zoom sur le serveur et sur le vainqueur du point.
      let fx = this.P(b.x, b.y, 0), tz = 1.025, k = 0.07;
      if (g.phase === 'ready' || g.phase === 'toss') { const s = g.players[g.server]; fx = this.P(s.x, s.y, 1); tz = g.phase === 'toss' ? 1.07 : 1.04; k = 0.1; }
      else if (g.phase === 'over' && g.last && g.phaseT > 0.25) { const w = g.players[g.last.winner]; fx = this.P(w.x, w.y, 1); tz = 1.08; k = 0.16; }
      const e = 1 - Math.exp(-dt * 3);
      cam.x += ((fx.x - W / 2) * k - cam.x) * e; cam.y += (clamp((fx.y - H / 2) * k, -M * 0.6, M * 0.6) - cam.y) * e; cam.z += (tz - cam.z) * e;
      const sk = this.shake * 20, ox = (Math.random() - 0.5) * sk, oy = (Math.random() - 0.5) * sk;
      c.setTransform(d * cam.z, 0, 0, d * cam.z, d * (W / 2 - cam.z * (W / 2 + cam.x) + ox), d * (H / 2 - cam.z * (H / 2 + cam.y) + oy));
      c.drawImage(this.bg, -M, -M, W + 2 * M, H + 2 * M);

      // Bandeau lumineux : score en direct
      if (this.led && this.led.h > 5) {
        const m = g.match, n = g.players.map((p) => p.def.name.toUpperCase()), L = this.led;
        c.font = `700 ${L.h * 0.56}px ${FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffd98a';
        c.fillText(`${n[0]}  ${m.games[0]} – ${m.games[1]}  ${n[1]}`, L.x + L.w / 2, L.y + L.h / 2 + 1);
      }
      // Public : bras levés et flashs
      if (this.cheer > 0.02 && this.fans.length) {
        const n = Math.floor(this.fans.length * Math.min(1, this.cheer) * 0.5);
        c.fillStyle = 'rgba(250,235,215,.9)';
        for (let i = 0; i < n; i++) { const f = this.fans[(Math.random() * this.fans.length) | 0]; c.fillRect(f.x - f.r * 1.5, f.y - f.r * 2.2, f.r * 0.6, f.r * 1.8); c.fillRect(f.x + f.r * 0.9, f.y - f.r * 2.2, f.r * 0.6, f.r * 1.8); }
        c.fillStyle = '#fff';
        for (let i = 0; i < 4 * this.cheer; i++) { const f = this.fans[(Math.random() * this.fans.length) | 0], r = f.r * (2 + Math.random() * 2.5); c.beginPath(); c.moveTo(f.x - r, f.y); c.lineTo(f.x, f.y - r * 0.25); c.lineTo(f.x + r, f.y); c.lineTo(f.x, f.y + r * 0.25); c.closePath(); c.fill(); c.beginPath(); c.moveTo(f.x, f.y - r); c.lineTo(f.x + r * 0.25, f.y); c.lineTo(f.x, f.y + r); c.lineTo(f.x - r * 0.25, f.y); c.closePath(); c.fill(); }
      }
      // Traces de balle sur la terre
      if (this.venue.mark) for (const m of this.marks) { const p = this.P(m.x, m.y, 0); c.fillStyle = `rgba(${this.venue.mark},${m.a})`; c.beginPath(); c.ellipse(p.x, p.y, p.s * 0.14, p.s * 0.05, 0, 0, 7); c.fill(); }
      // Repère de chute
      if (b.live && b.bounces === 0 && b.lastHitter !== human && human >= 0) {
        const L = g.landing(), p = this.P(L.x, L.y, 0), r = p.s * (0.35 + Math.min(1, L.t) * 0.9);
        c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 2; c.beginPath(); c.ellipse(p.x, p.y, r, r * 0.36, 0, 0, 7); c.stroke();
        c.fillStyle = 'rgba(255,255,255,.2)'; c.beginPath(); c.ellipse(p.x, p.y, p.s * 0.35, p.s * 0.125, 0, 0, 7); c.fill();
      }
      // Ombres portées (soleil) : joueurs et balle
      c.lineCap = 'round';
      for (const pl of g.players) {
        const p = this.P(pl.x, pl.y, 0), h = this.P(pl.x + SUN.x * 1.75, pl.y + SUN.y * 1.75, 0);
        c.strokeStyle = 'rgba(25,10,20,.27)'; c.lineWidth = p.s * 0.42; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(h.x, h.y); c.stroke();
      }
      { const p = this.P(b.x + SUN.x * b.z * 0.5, b.y + SUN.y * b.z * 0.5, 0); c.fillStyle = 'rgba(25,10,20,.42)'; c.beginPath(); c.ellipse(p.x, p.y, p.s * 0.13, p.s * 0.05, 0, 0, 7); c.fill(); }

      if (!b.held) { this.trail.push({ x: b.x, y: b.y, z: b.z }); if (this.trail.length > 9) this.trail.shift(); } else this.trail.length = 0;

      const ents = g.players.map((pl) => ({ y: pl.y, d: () => this.drawPlayer(c, g, pl) }));
      ents.push({ y: 0, d: () => this.drawNet(c) });
      ents.push({ y: b.y + (b.y > 0 ? 0.01 : -0.01), d: () => this.drawBall(c, b) });
      ents.sort((a, z) => a.y - z.y).forEach((en) => en.d());

      // Particules : terre, craie, brins d'herbe
      for (const p of this.parts) {
        p.t += dt; p.vz -= 6 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z = Math.max(0, p.z + p.vz * dt);
        const q = this.P(p.x, p.y, p.z), a = Math.max(0, 1 - p.t / p.life), r = q.s * 0.07 * (1 + p.t * 2.6);
        const gr = c.createRadialGradient(q.x, q.y, 0, q.x, q.y, r); gr.addColorStop(0, `rgba(${p.col},${0.75 * a})`); gr.addColorStop(1, `rgba(${p.col},0)`);
        c.fillStyle = gr; c.beginPath(); c.arc(q.x, q.y, r, 0, 7); c.fill();
      }
      this.parts = this.parts.filter((p) => p.t < p.life);
      // Impacts et textes flottants
      c.textAlign = 'center'; c.textBaseline = 'middle';
      for (const p of this.pops) {
        p.t += dt; const q = this.P(p.x, p.y, p.z);
        if (p.ring) {
          const a = 1 - p.t / 0.22;
          if (a > 0) {
            const r0 = q.s * (0.12 + p.t * 1.2), r1 = q.s * (0.3 + p.t * (p.big ? 5 : 3));
            c.strokeStyle = `rgba(255,255,240,${a})`; c.lineWidth = p.big ? 3.5 : 2.2; c.beginPath();
            for (let i = 0; i < 8; i++) { const an = i * 0.785 + 0.3; c.moveTo(q.x + Math.cos(an) * r0, q.y + Math.sin(an) * r0); c.lineTo(q.x + Math.cos(an) * r1, q.y + Math.sin(an) * r1); }
            c.stroke();
          }
        } else { const a = clamp(1.2 - p.t, 0, 1); c.font = `900 italic ${Math.max(16, q.s * 0.44)}px ${FONT}`; c.lineWidth = 4; c.strokeStyle = `rgba(0,0,0,${0.55 * a})`; c.fillStyle = p.col; c.globalAlpha = a; c.strokeText(p.text, q.x, q.y - p.t * 40); c.fillText(p.text, q.x, q.y - p.t * 40); c.globalAlpha = 1; }
      }
      this.pops = this.pops.filter((p) => p.t < (p.ring ? 0.22 : 1.2));

      // Jauge de service
      if (g.phase === 'toss' && g.server === human) {
        const pl = g.players[human], o = this.P(pl.x, pl.y, 0), gx = o.x + o.s * 1.15, gh = o.s * 2.2, gy = o.y - o.s * 0.2, w = 14;
        c.fillStyle = 'rgba(8,20,16,.75)'; c.beginPath(); c.roundRect(gx - 4, gy - gh - 4, w + 8, gh + 8, 9); c.fill();
        const zone = (t0, t1, col) => { c.fillStyle = col; c.fillRect(gx, gy - gh * (t1 / 1.3), w, gh * ((t1 - t0) / 1.3)); };
        zone(0.25, 1.05, '#d9534f'); zone(0.45, 0.85, '#f2c14e'); zone(0.57, 0.73, '#4cd07d');
        const ty = gy - gh * clamp(g.tossT / 1.3, 0, 1);
        c.fillStyle = '#fff'; c.fillRect(gx - 7, ty - 2.5, w + 14, 5);
      }
    }

    drawPlayer(c, g, pl) {
      const o = this.P(pl.x, pl.y, 0), sp = Math.hypot(pl.vx, pl.vy) / pl.stats.speed;
      const serving = (g.phase === 'ready' || g.phase === 'toss') && g.server === pl.i;
      figure(c, o, this.lookFor(pl.def), {
        away: pl.sgn > 0, fh: pl.sgn, run: pl.run, speed: sp > 0.08 ? Math.min(1, sp) : 0, lean: clamp(-pl.vx * 0.022, -0.16, 0.16),
        ready: g.phase === 'rally' || (!serving && g.phase !== 'over'), t: this.time + pl.i,
        swing: pl.swing ? { anim: pl.swing.anim, p: pl.swing.t / 0.42 } : null, toss: g.phase === 'toss' && serving,
      });
    }

    drawBall(c, b) {
      const n = this.trail.length;
      c.lineCap = 'round';
      for (let i = 1; i < n; i++) {
        const p = this.P(this.trail[i - 1].x, this.trail[i - 1].y, this.trail[i - 1].z), q = this.P(this.trail[i].x, this.trail[i].y, this.trail[i].z);
        c.strokeStyle = `rgba(236,255,120,${(i / n) * 0.5})`; c.lineWidth = q.s * 0.17 * (i / n);
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke();
      }
      const p = this.P(b.x, b.y, b.z), r = Math.max(3.2, p.s * 0.105);
      const gl = c.createRadialGradient(p.x, p.y, r * 0.5, p.x, p.y, r * 2.4); gl.addColorStop(0, 'rgba(240,255,140,.35)'); gl.addColorStop(1, 'rgba(240,255,140,0)');
      c.fillStyle = gl; c.beginPath(); c.arc(p.x, p.y, r * 2.4, 0, 7); c.fill();
      const gr = c.createRadialGradient(p.x - r * 0.35, p.y - r * 0.35, r * 0.1, p.x, p.y, r);
      gr.addColorStop(0, '#fbffb0'); gr.addColorStop(0.7, '#d4ee2a'); gr.addColorStop(1, '#a9c614');
      c.fillStyle = gr; c.beginPath(); c.arc(p.x, p.y, r, 0, 7); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = Math.max(0.8, r * 0.16); c.beginPath(); c.arc(p.x - r * 0.9, p.y, r, -0.7, 0.7); c.stroke();
    }

    drawNet(c) {
      const px = COURT.postX, h = A.netHeightAt, top = [], N = 26;
      for (let i = 0; i <= N; i++) { const x = lerp(-px, px, i / N); top.push([x, 0, h(x)]); }
      this.poly(c, top.concat([[px, 0, 0], [-px, 0, 0]]), 'rgba(12,16,20,.34)');
      c.strokeStyle = 'rgba(10,14,18,.5)'; c.lineWidth = 1; c.lineCap = 'butt'; c.beginPath();
      for (let x = -px; x <= px + 0.01; x += 0.2) { const a = this.P(x, 0, 0), q = this.P(x, 0, h(x)); c.moveTo(a.x, a.y); c.lineTo(q.x, q.y); }
      for (const fz of [0.14, 0.28, 0.42, 0.56, 0.7, 0.84]) top.forEach((t, i) => { const q = this.P(t[0], 0, t[2] * fz); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); });
      c.stroke();
      c.strokeStyle = '#fdfdf8'; c.lineWidth = Math.max(3, this.P(0, 0, 1).s * 0.08); c.beginPath();
      top.forEach((t, i) => { const q = this.P(t[0], t[1], t[2]); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); }); c.stroke();
      this.line(c, [0, 0, 0], [0, 0, 0.914], '#fdfdf8', 0.05);
      for (const sg of [-1, 1]) { this.line(c, [sg * px, 0, 0], [sg * px, 0, 1.1], this.venue.wallDark, 0.11); const q = this.P(sg * px, 0, 1.1); c.fillStyle = '#e9e4d6'; c.beginPath(); c.arc(q.x, q.y, q.s * 0.07, 0, 7); c.fill(); }
    }
  }

  Renderer.figure = figure;
  A.Renderer = Renderer;
})(typeof window !== 'undefined' ? window : globalThis);
