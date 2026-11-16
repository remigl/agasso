// Dessin d'un athlète : proportions humaines (≈ 7,5 têtes), membres fuselés et articulés, volumes ombrés,
// tenue et coiffure issues des données du joueur (look). Aucune logique de jeu ici.
(function (root) {
  const A = root.Agasso, { clamp, lerp } = A;
  const SHADE = 'rgba(8,10,30,.2)', WHITE = '#f6f4ee';

  // Articulation à deux segments : renvoie le coude / genou entre a et b.
  function joint(ax, ay, bx, by, l1, l2, bend) {
    const dx = bx - ax, dy = by - ay, d = Math.min(Math.hypot(dx, dy), l1 + l2 - 0.001) || 0.001;
    const a = Math.acos(clamp((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)), base = Math.atan2(dy, dx) + a * bend;
    return [ax + Math.cos(base) * l1, ay + Math.sin(base) * l1];
  }

  // o = {x, y, s} : pieds à l'écran, s = pixels par mètre. pose : voir render/anim.js.
  function draw(c, o, look, pose) {
    const fh = pose.fh || 1, mv = pose.speed || 0, ph = pose.run || 0, away = !!pose.away, fem = look.gender === 'F';
    const bulk = look.bulk || 1, k = (look.height || 1.82) / 1.82, detail = o.s * k > 95;
    c.save(); c.translate(o.x, o.y - (pose.jump || 0) * o.s); c.scale(o.s * k, -o.s * k); c.lineCap = 'round'; c.lineJoin = 'round';
    if (pose.lean) c.rotate(pose.lean);

    // Membre fuselé : largeur wa en a, wb en b, avec une bande d'ombre côté opposé au soleil.
    const limb = (ax, ay, bx, by, wa, wb, col, flat) => {
      const dx = bx - ax, dy = by - ay, l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
      c.fillStyle = col; c.beginPath();
      c.moveTo(ax + nx * wa / 2, ay + ny * wa / 2); c.lineTo(bx + nx * wb / 2, by + ny * wb / 2); c.lineTo(bx - nx * wb / 2, by - ny * wb / 2); c.lineTo(ax - nx * wa / 2, ay - ny * wa / 2); c.closePath(); c.fill();
      c.beginPath(); c.arc(ax, ay, wa / 2, 0, 7); c.arc(bx, by, wb / 2, 0, 7); c.fill();
      if (flat) return;
      const sgn = nx < 0 ? 1 : -1; // ombre du côté gauche de l'écran
      c.strokeStyle = SHADE; c.lineWidth = Math.min(wa, wb) * 0.38; c.beginPath();
      c.moveTo(ax + sgn * nx * wa * 0.27, ay + sgn * ny * wa * 0.27); c.lineTo(bx + sgn * nx * wb * 0.27, by + sgn * ny * wb * 0.27); c.stroke();
    };
    const seg = (ax, ay, bx, by, w, col) => { c.strokeStyle = col; c.lineWidth = w; c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx, by); c.stroke(); };

    const crouch = pose.crouch || 0, stride = (pose.stride || 1) * mv;
    const hipY = 0.93 - crouch + mv * Math.abs(Math.sin(ph)) * 0.035, shY = hipY + 0.5, headY = shY + 0.225;
    const SW = (fem ? 0.185 : 0.215) * bulk, HW = fem ? 0.155 : 0.145, WW = (fem ? 0.125 : 0.15) * bulk;

    // --- Jambes ---
    if (!pose.seated) {
      for (const s of [-1, 1]) {
        const p2 = ph + (s > 0 ? 0 : Math.PI);
        const fx = s * (0.1 + (pose.wide || 0) + crouch * 0.12) + stride * Math.sin(p2) * 0.3, fy = stride * Math.max(0, Math.cos(p2)) * 0.16;
        const hx = s * 0.085, kn = joint(hx, hipY, fx, fy + 0.08, 0.46, 0.44, s * 0.4); // genou surtout vers l'avant : vu de face, la jambe raccourcit
        limb(hx, hipY, kn[0], kn[1], 0.19 * bulk, 0.125, look.skin); limb(kn[0], kn[1], fx, fy + 0.09, 0.125, 0.078, look.skin);
        limb(fx, fy + 0.17, fx, fy + 0.09, 0.08, 0.075, WHITE, true);
        c.fillStyle = WHITE; c.beginPath(); c.ellipse(fx + s * 0.015, fy + 0.04, 0.115, 0.05, 0, 0, 7); c.fill();
        seg(fx - 0.09, fy + 0.008, fx + 0.12, fy + 0.008, 0.016, '#2a2c33');
        if (!look.skirt) limb(hx, hipY + 0.02, lerp(hx, kn[0], 0.56), lerp(hipY, kn[1], 0.56), 0.215 * bulk, 0.185 * bulk, look.shorts);
      }
    }
    c.fillStyle = look.shorts; c.beginPath();
    if (look.skirt) { c.moveTo(-WW, hipY + 0.16); c.lineTo(WW, hipY + 0.16); c.lineTo(HW + 0.12, hipY - 0.2); c.quadraticCurveTo(0, hipY - 0.25, -HW - 0.12, hipY - 0.2); }
    else { c.moveTo(-WW, hipY + 0.14); c.lineTo(WW, hipY + 0.14); c.lineTo(HW + 0.04, hipY - 0.04); c.lineTo(-HW - 0.04, hipY - 0.04); }
    c.closePath(); c.fill();

    // --- Bras : positions des mains relatives aux épaules ---
    let hx = 0.26, hz = -0.5, dx = 0.35, dz = 0.94, ox = 0.06, oz = -0.52 + mv * 0.07 * Math.sin(ph), two = false;
    const sw = pose.swing;
    if (pose.hands) { hx = pose.hands.hx; hz = pose.hands.hz; ox = pose.hands.ox; oz = pose.hands.oz; dx = 0.15; dz = 1; }
    else if (sw) {
      const p = clamp(sw.p, 0, 1), e = p * p * (3 - 2 * p), a = lerp(sw.back != null ? sw.back : -0.6, 2.8, e);
      if (sw.anim === 'oh') { hx = 0.2 - 0.42 * e; hz = 0.6 * Math.cos(e * 2.5); dx = 0.2 - 0.8 * e; dz = Math.cos(e * 2.8); ox = 0.02; oz = 0.42 - 0.9 * e; }
      else {
        const m = sw.anim === 'bh' ? -1 : 1;
        hx = m * 0.56 * Math.cos(a) + (m < 0 ? 0.08 : 0); hz = -0.22 + 0.34 * Math.sin(a * 0.8); dx = m * Math.cos(a); dz = 0.28 + 0.42 * Math.sin(a);
        two = sw.hands === 2; if (!two) { ox = m > 0 ? 0.2 : 0.3; oz = m > 0 ? -0.22 : -0.3 - 0.2 * e; }
      }
    } else if (pose.toss) { hx = 0.34; hz = 0.06; dx = 0.2; dz = 0.95; ox = -0.05; oz = 0.56; }
    else if (pose.ready) { hx = -0.12; hz = -0.36; dx = -0.45; dz = 0.9; two = true; }
    const dl = Math.hypot(dx, dz) || 1; dx /= dl; dz /= dl;
    const sY = shY - 0.035, SX = fh * SW, HX = SX + fh * hx, HY = sY + hz;
    const arm = (side, ex, ey) => {
      const sx = side * SW, el = joint(sx, sY, ex, ey, 0.29, 0.27, side * 0.75);
      limb(sx, sY, el[0], el[1], 0.112 * bulk, 0.086, look.skin); limb(el[0], el[1], ex, ey, 0.084, 0.062, look.skin);
      if (!look.sleeveless) limb(sx, sY, lerp(sx, el[0], 0.5), lerp(sY, el[1], 0.5), 0.13 * bulk, 0.115 * bulk, look.shirt);
      if (side === fh) seg(lerp(el[0], ex, 0.8), lerp(el[1], ey, 0.8), lerp(el[0], ex, 0.9), lerp(el[1], ey, 0.9), 0.07, look.accent);
      c.fillStyle = look.skin; c.beginPath(); c.arc(ex, ey, 0.045, 0, 7); c.fill();
    };
    const OX = two ? HX - fh * dx * 0.09 : -SX - fh * ox, OY = two ? HY - dz * 0.09 : sY + oz;
    if (!two) arm(-fh, OX, OY);

    // --- Torse ---
    c.fillStyle = look.shirt; c.beginPath();
    c.moveTo(-SW - 0.02, shY - 0.03); c.quadraticCurveTo(0, shY + 0.07, SW + 0.02, shY - 0.03);
    c.quadraticCurveTo(SW + 0.01, hipY + 0.3, WW + 0.01, hipY + 0.1); c.lineTo(-WW - 0.01, hipY + 0.1); c.quadraticCurveTo(-SW - 0.01, hipY + 0.3, -SW - 0.02, shY - 0.03);
    c.fill();
    const gr = c.createLinearGradient(-SW, 0, SW, 0); gr.addColorStop(0, 'rgba(8,10,34,.34)'); gr.addColorStop(0.5, 'rgba(8,10,34,.04)'); gr.addColorStop(1, 'rgba(255,255,255,.1)');
    c.fillStyle = gr; c.fill();
    c.strokeStyle = 'rgba(0,0,0,.1)'; c.lineWidth = 0.012; c.beginPath(); c.moveTo(-SW * 0.5, shY - 0.14); c.quadraticCurveTo(-0.02, hipY + 0.3, -WW * 0.6, hipY + 0.14); c.stroke();
    seg(-SW + 0.01, shY - 0.12, -WW, hipY + 0.14, 0.022, look.accent); seg(SW - 0.01, shY - 0.12, WW, hipY + 0.14, 0.022, look.accent);

    // --- Cou et tête ---
    limb(0, shY + 0.02, 0, headY - 0.08, 0.1, 0.085, look.skin);
    if (!away) { c.fillStyle = look.accent; c.beginPath(); c.moveTo(-0.07, shY + 0.045); c.lineTo(0, shY - 0.04); c.lineTo(0.07, shY + 0.045); c.lineTo(0.05, shY + 0.06); c.lineTo(0, shY); c.lineTo(-0.05, shY + 0.06); c.fill(); }
    const rx = 0.092, ry = 0.115, hs = look.hairStyle || 'short';
    if (hs === 'long' || hs === 'curly' || hs === 'mop' || hs === 'medium') { // masse de cheveux derrière la tête
      const big = hs === 'long' ? 1 : hs === 'curly' ? 0.75 : 0.45;
      c.fillStyle = look.hair; c.beginPath();
      if (away) c.ellipse(0, headY - 0.03 * big, rx * (1.12 + 0.12 * big), ry * (1.05 + 0.35 * big), 0, 0, 7);
      else c.ellipse(0, headY + 0.03, rx * (1.14 + 0.1 * big), ry * (0.98 + 0.08 * big), 0, 0, 7); // de face : volume au-dessus et sur les côtés
      c.fill();
      if (!away && hs === 'long') for (const s of [-1, 1]) limb(s * rx * 1.05, headY + 0.02, s * rx * 1.22, headY - 0.17, 0.06, 0.035, look.hair, true);
    }
    c.fillStyle = look.skin; c.beginPath(); c.ellipse(0, headY, rx, ry, 0, 0, 7); c.fill();
    c.beginPath(); c.ellipse(-rx, headY - 0.01, 0.018, 0.03, 0, 0, 7); c.ellipse(rx, headY - 0.01, 0.018, 0.03, 0, 0, 7); c.fill();
    c.fillStyle = SHADE; c.beginPath(); c.ellipse(-rx * 0.45, headY, rx * 0.55, ry, 0, 0, 7); c.fill();
    if (away) { if (hs !== 'bald') { c.fillStyle = look.hair; c.beginPath(); c.ellipse(0, headY + 0.012, rx * 1.06, ry * 1.04, 0, 0, 7); c.fill(); } }
    else {
      if (hs !== 'bald') { c.fillStyle = look.hair; c.beginPath(); c.ellipse(0, headY + 0.035, rx * 1.07, ry * 0.86, 0, Math.PI * 0.02, Math.PI * 0.98); c.fill(); }
      if (detail) { // visage générique, visible seulement de près (fiches, célébration)
        c.fillStyle = '#fbfbf8'; c.beginPath(); c.ellipse(-0.036, headY + 0.008, 0.017, 0.009, 0, 0, 7); c.ellipse(0.036, headY + 0.008, 0.017, 0.009, 0, 0, 7); c.fill();
        c.fillStyle = '#2b2118'; c.beginPath(); c.arc(-0.036, headY + 0.008, 0.008, 0, 7); c.arc(0.036, headY + 0.008, 0.008, 0, 7); c.fill();
        seg(-0.055, headY + 0.03, -0.018, headY + 0.027, 0.008, look.hair); seg(0.018, headY + 0.027, 0.055, headY + 0.03, 0.008, look.hair);
        seg(0.004, headY + 0.005, 0.008, headY - 0.032, 0.006, 'rgba(60,30,20,.35)'); seg(-0.028, headY - 0.062, 0.028, headY - 0.062, 0.009, 'rgba(120,45,40,.7)');
        if (look.glasses) { c.strokeStyle = '#3a3a40'; c.lineWidth = 0.007; c.beginPath(); c.arc(-0.036, headY + 0.008, 0.026, 0, 7); c.moveTo(0.062, headY + 0.008); c.arc(0.036, headY + 0.008, 0.026, 0, 7); c.stroke(); }
      } else { c.fillStyle = 'rgba(30,18,12,.4)'; c.fillRect(-0.06, headY - 0.002, 0.045, 0.016); c.fillRect(0.015, headY - 0.002, 0.045, 0.016); }
    }
    const sway = mv * Math.sin(ph) * 0.1;
    if (hs === 'ponytail') {
      if (away) { c.strokeStyle = look.hair; c.lineWidth = 0.07; c.beginPath(); c.moveTo(0, headY + 0.03); c.quadraticCurveTo(sway * 0.6, headY - 0.16, sway, headY - 0.33); c.stroke(); }
      else { c.strokeStyle = look.hair; c.lineWidth = 0.05; c.beginPath(); c.moveTo(rx * 0.7, headY + 0.07); c.quadraticCurveTo(rx * 1.5 + sway, headY - 0.05, rx * 1.2 + sway, headY - 0.22); c.stroke(); }
    } else if (hs === 'bun') { c.fillStyle = look.hair; c.beginPath(); c.arc(0, headY + ry * (away ? 0.75 : 1.0), 0.055, 0, 7); c.fill(); }
    if (look.cap || look.visor) {
      c.fillStyle = WHITE;
      if (look.cap) { c.beginPath(); c.ellipse(0, headY + 0.04, rx * 1.1, ry * 0.82, 0, 0, Math.PI); c.fill(); }
      if (!away) { c.beginPath(); c.ellipse(0, headY + 0.042, rx * 1.3, 0.028, 0, 0, 7); c.fill(); } else seg(-rx, headY + 0.045, rx, headY + 0.045, 0.03, WHITE);
    }
    if (look.headband) seg(-rx * 0.98, headY + 0.055, rx * 0.98, headY + 0.055, 0.036, look.accent === look.hair ? WHITE : look.accent);

    // --- Raquette puis bras raquette ---
    if (!pose.noRacket && !pose.seated) {
      const rdx = fh * dx, ang = Math.atan2(dz, rdx), cx2 = HX + rdx * 0.51, cy2 = HY + dz * 0.51;
      seg(HX - rdx * 0.06, HY - dz * 0.06, HX + rdx * 0.33, HY + dz * 0.33, 0.032, '#15171c');
      c.fillStyle = 'rgba(255,255,255,.16)'; c.strokeStyle = '#ecece6'; c.lineWidth = 0.026;
      c.beginPath(); c.ellipse(cx2, cy2, 0.2, 0.14, ang, 0, 7); c.fill(); c.stroke();
      c.save(); c.translate(cx2, cy2); c.rotate(ang); c.strokeStyle = 'rgba(255,255,255,.42)'; c.lineWidth = 0.008; c.beginPath();
      for (const q of [-0.12, -0.06, 0, 0.06, 0.12]) { c.moveTo(q, -0.12); c.lineTo(q, 0.12); c.moveTo(-0.18, q * 0.8); c.lineTo(0.18, q * 0.8); }
      c.stroke(); c.restore();
    }
    if (two) arm(-fh, OX, OY);
    arm(fh, HX, HY);
    c.restore();
  }

  A.Figure = { draw };
})(typeof window !== 'undefined' ? window : globalThis);
