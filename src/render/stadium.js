// Décor fixe (ciel, arrière-plan, tribunes, public, sol, murs, lignes, officiels), peint une fois par
// terrain et par taille d'écran. Entièrement piloté par les données du terrain :
//   venue.look (couleurs, aspect du court) · venue.stadium (gradins, toit, décor) · venue.lighting (heure, ombres, ciel)
// Un nouveau terrain n'exige aucun code ici.
(function (root) {
  const A = root.Agasso, { COURT, lerp } = A;
  const SHIRTS = ['#e9e4d8', '#e9e4d8', '#d8cfbb', '#cfd6dc', '#3b5876', '#8f4a44', '#cdb873', '#3c3c44', '#7c98b0', '#b98a70', '#66785a', '#c9a3ac', '#f2efe8', '#2f3338'];
  const SKINS = ['#e8c4a4', '#dcb08c', '#cf9f78', '#a9764f', '#7d543a'];
  const HAIRS = ['#3b2a20', '#1d1d1f', '#6d4426', '#b8985a', '#8f8f8f', '#d8d4cc'];

  // Peint le décor dans le contexte c (déjà transformé) pour la vue v. Renvoie { fans, led }.
  function paint(c, v, venue, M) {
    const W = v.W, H = v.H, rnd = A.rngFrom(2026), co = COURT, k = venue.look, st = venue.stadium, li = venue.lighting, fans = [];
    const sun = li.sun || [0, 0.14], night = li.time === 'night' || li.time === 'indoor';
    let led = null;
    c.lineCap = 'butt';

    // --- Ciel (ou plafond de salle) ---
    const hz = v.P(0, -400, 0).y;
    const sky = c.createLinearGradient(0, -M, 0, hz + 40); sky.addColorStop(0, k.sky[0]); sky.addColorStop(1, k.sky[1]);
    c.fillStyle = sky; c.fillRect(-M, -M, W + 2 * M, H + 2 * M);
    if (st.indoor) { // rampes d'éclairage au plafond
      for (let r = 0; r < 4; r++) for (let x = -M; x < W + M; x += 46) { c.fillStyle = `rgba(255,250,230,${0.5 + rnd() * 0.4})`; c.fillRect(x + r * 9, hz * (0.12 + r * 0.2) - M * 0.3, 20, 3); }
    } else {
      if (li.stars) for (let i = 0; i < 90; i++) { c.fillStyle = `rgba(255,255,255,${0.2 + rnd() * 0.6})`; c.fillRect(rnd() * (W + 2 * M) - M, -M + rnd() * (hz + M), 1.3, 1.3); }
      for (let i = 0; i < li.clouds; i++) {
        const x = rnd() * (W + 2 * M) - M, y = -M + rnd() * (hz * 0.8 + M), w = 70 + rnd() * 110;
        for (let j = 0; j < 5; j++) { c.fillStyle = `rgba(255,255,255,${0.28 + rnd() * 0.3})`; c.beginPath(); c.ellipse(x + (rnd() - 0.5) * w, y + (rnd() - 0.5) * 12, w * (0.3 + rnd() * 0.4), 9 + rnd() * 12, 0, 0, 7); c.fill(); }
      }
      // Arrière-plan derrière les tribunes
      const bd = st.backdrop;
      if (bd === 'sea') { const g = c.createLinearGradient(0, hz - 6, 0, hz + 70); g.addColorStop(0, '#2f6f9f'); g.addColorStop(1, '#5aa3c9'); c.fillStyle = g; c.fillRect(-M, hz - 6, W + 2 * M, 80); }
      else if (bd === 'hills') { c.fillStyle = '#8a7a6a'; c.beginPath(); c.moveTo(-M, hz + 40); for (let x = -M; x <= W + M; x += 60) c.lineTo(x, hz - 18 - rnd() * 46); c.lineTo(W + M, hz + 40); c.fill(); }
      else if (bd === 'city') for (let x = -M; x < W + M; ) { const w = 18 + rnd() * 40, h = 20 + rnd() * 80; c.fillStyle = night ? '#141a2a' : `rgba(${110 + rnd() * 30},${125 + rnd() * 30},${145 + rnd() * 30},.9)`; c.fillRect(x, hz + 30 - h, w, h + 20); if (night) for (let n = 0; n < 6; n++) { c.fillStyle = 'rgba(255,220,140,.7)'; c.fillRect(x + 3 + rnd() * (w - 6), hz + 30 - h + 4 + rnd() * (h - 8), 2, 2); } x += w + 3; }
      else if (bd === 'trees') for (let x = -M; x < W + M; x += 26) { c.fillStyle = `rgb(${30 + rnd() * 20},${70 + rnd() * 35},${35 + rnd() * 20})`; c.beginPath(); c.ellipse(x, hz + 6 - rnd() * 14, 26 + rnd() * 16, 30 + rnd() * 22, 0, 0, 7); c.fill(); }
    }

    const X = 11, YB = -19, YF = 27, WALL = 1.6;
    const person = (x, y, z) => {
      const p = v.P(x, y, z), r = Math.max(1.1, p.s * 0.17);
      c.fillStyle = SHIRTS[(rnd() * SHIRTS.length) | 0]; c.beginPath(); c.roundRect(p.x - r * 1.1, p.y - r * 0.75, r * 2.2, r * 2.1, r * 0.6); c.fill();
      c.fillStyle = 'rgba(10,14,30,.22)'; c.fillRect(p.x - r * 1.1, p.y - r * 0.2, r * 0.9, r * 1.5);
      c.fillStyle = SKINS[(rnd() * SKINS.length) | 0]; c.beginPath(); c.ellipse(p.x, p.y - r * 1.4, r * 0.62, r * 0.76, 0, 0, 7); c.fill();
      const q = rnd();
      if (q < 0.22 && !night) { c.fillStyle = q < 0.15 ? '#eadfc2' : '#f4f2ec'; c.beginPath(); c.ellipse(p.x, p.y - r * 1.72, r * 0.72, r * 0.42, 0, Math.PI, 0); c.fill(); c.fillRect(p.x - r * 1.05, p.y - r * 1.78, r * 2.1, r * 0.2); }
      else if (q < 0.85) { c.fillStyle = HAIRS[(rnd() * HAIRS.length) | 0]; c.beginPath(); c.ellipse(p.x, p.y - r * 1.62, r * 0.66, r * 0.56, 0, Math.PI, 0); c.fill(); }
      if (rnd() < 0.22) fans.push({ x: p.x, y: p.y - r * 1.4, r });
    };
    const rowD = (r) => 0.7 + r * 0.74, rowZ = (r) => WALL + 0.5 + r * 0.52;

    // --- Tribune du fond : un ou deux niveaux, bandeau lumineux, toit ---
    const BX = X + 9, R2 = st.rowsBack, R1 = st.upperAt > 0 && st.upperAt < R2 ? st.upperAt : -1;
    const bd2 = (r) => rowD(r) + (R1 >= 0 && r >= R1 ? 1.2 : 0), bz = (r) => rowZ(r) + (R1 >= 0 && r >= R1 ? 1.5 : 0);
    v.poly(c, [[-BX, YB, WALL], [BX, YB, WALL], [BX + R2 * 0.25, YB - bd2(R2), bz(R2)], [-BX - R2 * 0.25, YB - bd2(R2), bz(R2)]], k.seat);
    for (let r = 0; r < R2; r++) {
      if (r === R1) continue;
      const wdt = BX + r * 0.25;
      v.line(c, [-wdt, YB - bd2(r) + 0.35, bz(r) - 0.42], [wdt, YB - bd2(r) + 0.35, bz(r) - 0.42], 'rgba(0,0,0,.3)', 0.1);
      for (let x = -wdt; x <= wdt; x += 0.56) {
        if (Math.abs((Math.abs(x) % 7.2) - 3.6) < 0.34) { const p = v.P(x, YB - bd2(r), bz(r) - 0.35); c.fillStyle = 'rgba(200,200,190,.4)'; c.fillRect(p.x - p.s * 0.22, p.y - p.s * 0.1, p.s * 0.44, p.s * 0.5); }
        else if (rnd() < st.fill) person(x + (rnd() - 0.5) * 0.14, YB - bd2(r), bz(r));
      }
    }
    const ty = YB - bd2(R2), tz = bz(R2);
    if (R1 >= 0) {
      const fy = YB - bd2(R1) + 0.5, fz0 = bz(R1 - 1) + 0.25, fz1 = bz(R1) - 0.2;
      v.poly(c, [[-BX - 3, fy, fz0], [BX + 3, fy, fz0], [BX + 3, fy, fz1], [-BX - 3, fy, fz1]], k.wall);
      const a0 = v.P(-5.2, fy, fz0), a1 = v.P(5.2, fy, fz1);
      led = { x: a0.x, y: a1.y, w: a1.x - a0.x, h: a0.y - a1.y };
      c.fillStyle = '#071019'; c.fillRect(led.x, led.y, led.w, led.h);
    }
    if (st.roof) {
      v.path(c, [[-BX - 6, ty, tz], [BX + 6, ty, tz], [BX + 3, YB - bd2(R2 - 8), bz(R2 - 8)], [-BX - 3, YB - bd2(R2 - 8), bz(R2 - 8)]]); c.fillStyle = 'rgba(8,14,28,.45)'; c.fill();
      v.poly(c, [[-BX - 8, ty - 1, tz + 2.2], [BX + 8, ty - 1, tz + 2.2], [BX + 8, ty + 9, tz + 3.4], [-BX - 8, ty + 9, tz + 3.4]], '#39454d');
      v.poly(c, [[-BX - 8, ty + 9, tz + 3.4], [BX + 8, ty + 9, tz + 3.4], [BX + 8, ty + 9, tz + 4.3], [-BX - 8, ty + 9, tz + 4.3]], k.roof);
    } else v.poly(c, [[-BX - R2 * 0.25, ty, tz], [BX + R2 * 0.25, ty, tz], [BX + R2 * 0.25, ty, tz + 1.1], [-BX - R2 * 0.25, ty, tz + 1.1]], k.wallDark);

    // --- Tribunes latérales ---
    const RS = st.rowsSide;
    for (const sg of [-1, 1]) {
      const tx = sg * (X + rowD(RS)), tz2 = rowZ(RS);
      v.poly(c, [[sg * X, YB, WALL], [sg * X, YF, WALL], [tx, YF, tz2], [tx, YB, tz2]], k.seat);
      const pts = [];
      for (let r = 0; r < RS; r++) for (let y = YB + 0.3; y <= 23; y += 0.6) {
        const aisle = Math.abs((((y - YB) % 7.6) + 7.6) % 7.6 - 3.8) < 0.36;
        if (aisle || rnd() < st.fill) pts.push([sg * (X + rowD(r)), y + (aisle ? 0 : (rnd() - 0.5) * 0.14), rowZ(r), aisle]);
      }
      pts.sort((a, b) => a[1] - b[1] || a[2] - b[2]);
      for (const p of pts) {
        if (p[3]) { const q = v.P(p[0], p[1], p[2] - 0.35); c.fillStyle = 'rgba(200,200,190,.4)'; c.fillRect(q.x - q.s * 0.3, q.y - q.s * 0.1, q.s * 0.6, q.s * 0.45); }
        else person(p[0], p[1], p[2]);
      }
      v.poly(c, [[tx, YB, tz2], [tx, YF, tz2], [tx, YF, tz2 + 1.1], [tx, YB, tz2 + 1.1]], k.wallDark);
      if (st.flags) for (let y = YB + 2, i = 0; y < 22; y += 4.5, i++) {
        v.line(c, [tx, y, tz2 + 1.1], [tx, y, tz2 + 4.3], '#dfe3e6', 0.09);
        v.poly(c, [[tx, y, tz2 + 4.3], [tx, y + 1.5, tz2 + 3.95], [tx, y, tz2 + 3.5]], i % 2 ? k.accent : '#f4f2ec');
      }
      if (li.sun) { // tribune de droite à contre-jour, tribune de gauche au soleil
        v.path(c, [[sg * X, YB, WALL], [sg * X, YF, WALL], [tx, YF, tz2 + 1.1], [tx, YB, tz2 + 1.1]]);
        c.fillStyle = sg > 0 ? 'rgba(8,14,34,.36)' : 'rgba(255,236,200,.06)'; c.fill();
      }
    }
    // Atmosphère : voile de jour, pénombre des tribunes le soir et en salle, halos des projecteurs
    const hazeY = v.P(0, YB, WALL).y;
    if (!night) { const hg = c.createLinearGradient(0, -M, 0, hazeY); hg.addColorStop(0, 'rgba(196,212,226,.3)'); hg.addColorStop(1, 'rgba(196,212,226,.06)'); c.fillStyle = hg; c.fillRect(-M, -M, W + 2 * M, hazeY + M); }
    if (li.dim > 0) { c.fillStyle = `rgba(5,7,18,${li.dim})`; c.fillRect(-M, -M, W + 2 * M, H + 2 * M); }
    if (li.floodlights) for (const fx of [-BX - 2, -BX * 0.4, BX * 0.4, BX + 2]) {
      const p = v.P(fx, ty + (st.roof ? 8.6 : 0), tz + (st.roof ? 3.4 : 3.2)), r = Math.max(18, p.s * 3.2), g = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, 'rgba(255,252,235,.95)'); g.addColorStop(0.15, 'rgba(255,250,225,.45)'); g.addColorStop(1, 'rgba(255,250,225,0)');
      c.fillStyle = g; c.beginPath(); c.arc(p.x, p.y, r, 0, 7); c.fill();
    }

    // --- Sol : abords, court, texture selon le grain de la surface ---
    const ground = [[-X, YB, 0], [X, YB, 0], [X, YF, 0], [-X, YF, 0]];
    v.poly(c, ground, k.apron || k.court);
    c.save(); v.path(c, ground); c.clip();
    if (k.apron) v.poly(c, [[-7.3, -15.6, 0], [7.3, -15.6, 0], [7.3, 15.6, 0], [-7.3, 15.6, 0]], k.court);
    if (k.stripes && k.courtLight) { let i = 0; for (let x = -X; x < X; x += 1.03, i++) if (i % 2) v.poly(c, [[x, YB, 0], [x + 1.03, YB, 0], [x + 1.03, YF, 0], [x, YF, 0]], k.courtLight); }
    if (k.grain === 'grass') {
      for (let n = 0; n < 5000; n++) { const p = v.P((rnd() * 2 - 1) * X, lerp(YB, 20, rnd()), 0); c.fillStyle = rnd() < 0.5 ? 'rgba(210,235,160,.14)' : 'rgba(20,60,15,.16)'; c.fillRect(p.x, p.y, Math.max(1, p.s * 0.02), Math.max(1.5, p.s * 0.06)); }
      if (k.wear) for (const sy of [-1, 1]) { v.blot(c, 0, sy * 12.3, 4.6, 1.5, k.wear, 0.6); v.blot(c, -2.3, sy * 12.1, 2.4, 1.1, k.wear, 0.4); v.blot(c, 2.3, sy * 12.1, 2.4, 1.1, k.wear, 0.4); v.blot(c, 0, sy * 6.2, 1.6, 0.9, k.wear, 0.3); }
    } else if (k.grain === 'clay') { // marbrures, traces de passage, traînées du filet de balayage, grain
      for (let n = 0; n < 110; n++) v.blot(c, (rnd() * 2 - 1) * X, lerp(YB, 21, rnd()), 1.2 + rnd() * 3.2, 0.8 + rnd() * 2, rnd() < 0.5 ? '255,196,150' : '96,36,10', 0.075);
      if (k.wear) for (const sy of [-1, 1]) { v.blot(c, 0, sy * 12.5, 5.2, 1.7, k.wear, 0.24); v.blot(c, 0, sy * 6, 3.5, 2, k.wear, 0.1); }
      c.strokeStyle = 'rgba(255,215,180,.05)'; c.lineWidth = 1;
      for (let n = 0; n < 60; n++) { const y0 = lerp(YB, 19, rnd()), p = v.P(-X, y0, 0), q = v.P(X, y0 + (rnd() - 0.5) * 0.6, 0); c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke(); }
      for (let n = 0; n < 6500; n++) { const p = v.P((rnd() * 2 - 1) * X, lerp(YB, 20, rnd()), 0); c.fillStyle = rnd() < 0.5 ? 'rgba(255,214,176,.13)' : 'rgba(84,30,8,.15)'; c.fillRect(p.x, p.y, Math.max(1, p.s * 0.045), Math.max(1, p.s * 0.02)); }
    } else { // dur : résine lisse, grain très fin, léger reflet
      for (let n = 0; n < 2600; n++) { const p = v.P((rnd() * 2 - 1) * X, lerp(YB, 20, rnd()), 0); c.fillStyle = rnd() < 0.5 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,20,.06)'; c.fillRect(p.x, p.y, Math.max(1, p.s * 0.04), 1); }
      const p0 = v.P(0, YB, 0), p1 = v.P(0, 14, 0), sh = c.createLinearGradient(0, p0.y, 0, p1.y); sh.addColorStop(0, 'rgba(255,255,255,.14)'); sh.addColorStop(0.5, 'rgba(255,255,255,0)');
      c.fillStyle = sh; c.fillRect(-M, -M, W + 2 * M, H + 2 * M);
    }
    // Lumière sur le court : halo, puis grande ombre de tribune si le soleil est bas
    const g = c.createRadialGradient(W * 0.45, H * 0.5, H * 0.1, W * 0.47, H * 0.55, H);
    g.addColorStop(0, `rgba(${li.glow},${night ? 0.2 : 0.17})`); g.addColorStop(1, `rgba(18,10,30,${night ? 0.5 : 0.24})`);
    c.fillStyle = g; c.fillRect(-M, -M, W + 2 * M, H + 2 * M);
    if (li.standShadow) {
      v.poly(c, [[X, YB, 0], [5.1, YB, 0], [7.6, YF, 0], [X, YF, 0]], 'rgba(10,14,46,.3)');
      v.poly(c, [[5.1, YB, 0], [4.7, YB, 0], [7.2, YF, 0], [7.6, YF, 0]], 'rgba(10,14,46,.12)');
    }
    c.restore();

    // --- Murs, bâches, jardinières ---
    v.poly(c, [[-X, YB, 0], [X, YB, 0], [X, YB, WALL], [-X, YB, WALL]], k.wall);
    for (const sg of [-1, 1]) v.poly(c, [[sg * X, YB, 0], [sg * X, YF, 0], [sg * X, YF, WALL], [sg * X, YB, WALL]], sg > 0 ? k.wallDark : k.wall);
    if (k.trim) {
      v.poly(c, [[-X, YB, WALL], [X, YB, WALL], [X, YB, WALL + 0.22], [-X, YB, WALL + 0.22]], k.trim);
      for (const sg of [-1, 1]) v.poly(c, [[sg * X, YB, WALL], [sg * X, YF, WALL], [sg * X, YF, WALL + 0.22], [sg * X, YB, WALL + 0.22]], k.trim);
      if (st.flowers) for (let n = 0; n < 500; n++) { const side = rnd() < 0.4, p = side ? v.P((rnd() < 0.5 ? -1 : 1) * X, lerp(YB, 20, rnd()), WALL + 0.1 + rnd() * 0.16) : v.P((rnd() * 2 - 1) * X, YB, WALL + 0.1 + rnd() * 0.16); c.fillStyle = rnd() < 0.5 ? 'rgba(255,255,255,.45)' : 'rgba(40,110,50,.7)'; c.fillRect(p.x, p.y, Math.max(1.2, p.s * 0.07), Math.max(1.2, p.s * 0.07)); }
    }
    const txt = st.wallText || [venue.city, venue.name, venue.surfaceLabel], wp = v.P(0, YB, WALL * 0.5);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#efe9dc';
    c.font = `700 ${wp.s * 0.78}px ${A.FONT}`;
    const tw = c.measureText(txt[1].toUpperCase()).width, maxW = wp.s * 7.4;
    if (tw > maxW) c.font = `700 ${(wp.s * 0.78 * maxW) / tw}px ${A.FONT}`;
    c.fillText(txt[1].toUpperCase(), wp.x, wp.y);
    c.font = `600 ${wp.s * 0.44}px ${A.FONT}`;
    for (const sx of [-8.7, 8.7]) { const q = v.P(sx, YB, WALL * 0.5); c.fillText(String(sx < 0 ? txt[0] : txt[2]).toUpperCase(), q.x, q.y); }
    for (let y = YB + 4; y < 18; y += 7) for (const sg of [-1, 1]) v.poly(c, [[sg * X, y, 0.3], [sg * X, y + 4.6, 0.3], [sg * X, y + 4.6, 1.3], [sg * X, y, 1.3]], 'rgba(243,237,224,.12)');
    const wg = c.createLinearGradient(0, v.P(0, YB, WALL).y, 0, v.P(0, YB, 0).y); wg.addColorStop(0, 'rgba(0,0,0,0)'); wg.addColorStop(1, 'rgba(0,0,0,.22)');
    v.path(c, [[-X, YB, 0], [X, YB, 0], [X, YB, WALL], [-X, YB, WALL]]); c.fillStyle = wg; c.fill();

    // --- Lignes, ombre du filet ---
    const L = (a, b) => v.line(c, a, b, k.lines, 0.055);
    const hw = co.halfW, hl = co.halfL, sv = co.service;
    L([-hw, -hl], [hw, -hl]); L([-hw, hl], [hw, hl]); L([-hw, -hl], [-hw, hl]); L([hw, -hl], [hw, hl]);
    L([-hw, -sv], [hw, -sv]); L([-hw, sv], [hw, sv]); L([0, -sv], [0, sv]); L([0, -hl], [0, -hl + 0.25]); L([0, hl], [0, hl - 0.25]);
    v.poly(c, [[-co.postX, 0, 0], [co.postX, 0, 0], [co.postX + sun[0], sun[1], 0], [-co.postX + sun[0], sun[1], 0]], `rgba(20,10,30,${li.shadow * 0.8})`);

    // --- Officiels, ramasseurs, bancs, parasols, chaise d'arbitre ---
    const staff = { gender: 'M', shirt: '#22364f', shorts: '#d9d2c0', accent: '#d9d2c0', skin: '#dcb08c', hair: '#333', hairStyle: 'short', cap: !st.indoor };
    const kid = { gender: 'M', shirt: k.accentDeep, shorts: '#1b2430', accent: '#f4f2ec', skin: '#cf9f78', hair: '#2b2018', hairStyle: 'short', height: 1.55 };
    const still = { hands: { hx: 0.03, hz: -0.5, ox: 0.03, oz: -0.5 }, noRacket: true };
    const stand = (x, y, look, pose) => {
      const p = v.P(x, y, 0), h = v.P(x + sun[0] * 1.6, y + sun[1] * 1.6, 0);
      c.strokeStyle = `rgba(25,10,20,${li.shadow * 0.8})`; c.lineWidth = p.s * 0.36; c.lineCap = 'round'; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(h.x, h.y); c.stroke();
      A.Figure.draw(c, p, look, pose);
    };
    for (const jx of [-9.6, 9.6]) stand(jx, YB + 0.9, staff, Object.assign({ fh: 1 }, still));
    for (const jx of [-5.3, 5.3]) stand(jx, YB + 0.7, kid, Object.assign({ fh: 1 }, still));
    const ux = -6.5;
    if (st.benches) for (const by of [-3.4, 3.4]) {
      const b0 = v.P(ux - 1.1, by, 0), pc = v.P(ux - 1.1, by, 2.5);
      v.blot(c, ux - 1.9, by + 0.5, 1.7, 1.2, '20,10,30', 0.34);
      v.poly(c, [[ux - 1.6, by - 0.9, 0.45], [ux - 0.7, by - 0.9, 0.45], [ux - 0.7, by + 0.9, 0.45], [ux - 1.6, by + 0.9, 0.45]], '#dfd9c9');
      v.poly(c, [[ux - 0.7, by - 0.9, 0], [ux - 0.7, by + 0.9, 0], [ux - 0.7, by + 0.9, 0.45], [ux - 0.7, by - 0.9, 0.45]], '#b3ac99');
      if (!st.indoor && !night) { // parasols : seulement dehors et de jour
        v.line(c, [ux - 1.1, by, 0], [ux - 1.1, by, 2.5], '#cfcfcf', 0.06);
        c.fillStyle = k.parasol; c.beginPath(); c.ellipse(pc.x, pc.y, pc.s * 1.45, pc.s * 0.5, 0, 0, 7); c.fill();
        c.fillStyle = 'rgba(0,0,0,.16)'; c.beginPath(); c.ellipse(pc.x, pc.y + pc.s * 0.1, pc.s * 1.45, pc.s * 0.4, 0, 0, Math.PI); c.fill();
      }
      c.fillStyle = k.accent; c.fillRect(b0.x + b0.s * 0.55, b0.y - b0.s * 0.62, b0.s * 0.5, b0.s * 0.3);
    }
    for (const kx of [-co.postX - 1.0, co.postX + 1.0]) stand(kx, 0.5, kid, Object.assign({ away: true, fh: 1, crouch: 0.4, wide: 0.05 }, still));
    for (const [dx2, dy2, col] of [[-0.4, -0.3, '#c6bfad'], [0.4, -0.3, '#c6bfad'], [-0.4, 0.3, '#ebe6d9'], [0.4, 0.3, '#ebe6d9']]) v.line(c, [ux + dx2, dy2, 0], [ux + dx2 * 0.6, dy2 * 0.4, 1.9], col, 0.07);
    for (const zz of [0.6, 1.2]) v.line(c, [ux - 0.34, 0.25, zz], [ux + 0.34, 0.25, zz], '#ebe6d9', 0.05);
    v.poly(c, [[ux - 0.42, 0.25, 1.9], [ux + 0.42, 0.25, 1.9], [ux + 0.42, -0.25, 1.9], [ux - 0.42, -0.25, 1.9]], k.wall);
    const up = v.P(ux, 0, 1.9);
    A.Figure.draw(c, { x: up.x, y: up.y + up.s * 0.86, s: up.s }, { gender: 'M', shirt: '#f1ede3', shorts: '#16222b', accent: k.accent, skin: '#dcb08c', hair: '#555', hairStyle: 'short', cap: !st.indoor }, { fh: 1, seated: true, hands: { hx: -0.03, hz: -0.4, ox: -0.03, oz: -0.4 } });
    return { fans, led };
  }

  A.Stadium = { paint };
})(typeof window !== 'undefined' ? window : globalThis);
