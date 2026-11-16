// Décor fixe (ciel, tribunes, public, sol, murs, lignes, officiels), peint une fois par terrain et par
// taille d'écran. Entièrement piloté par venue.look : un nouveau terrain n'exige aucun code ici.
(function (root) {
  const A = root.Agasso, { COURT, lerp } = A;
  const SHIRTS = ['#e9e4d8', '#e9e4d8', '#d8cfbb', '#cfd6dc', '#3b5876', '#8f4a44', '#cdb873', '#3c3c44', '#7c98b0', '#b98a70', '#66785a', '#c9a3ac', '#f2efe8', '#2f3338'];
  const SKINS = ['#e8c4a4', '#dcb08c', '#cf9f78', '#a9764f', '#7d543a'];
  const HAIRS = ['#3b2a20', '#1d1d1f', '#6d4426', '#b8985a', '#8f8f8f', '#d8d4cc'];

  // Peint le décor dans le contexte c (déjà transformé) pour la vue v. Renvoie { fans, led }.
  function paint(c, v, venue, M) {
    const W = v.W, H = v.H, rnd = A.rngFrom(2026), co = COURT, k = venue.look, SUN = A.SUN, fans = [];
    c.lineCap = 'butt';
    // Ciel
    const hz = v.P(0, -400, 0).y;
    const sky = c.createLinearGradient(0, -M, 0, hz + 40); sky.addColorStop(0, k.sky[0]); sky.addColorStop(1, k.sky[1]);
    c.fillStyle = sky; c.fillRect(-M, -M, W + 2 * M, H + 2 * M);
    for (let i = 0; i < 7; i++) {
      const x = rnd() * (W + 2 * M) - M, y = -M + rnd() * (hz * 0.8 + M), w = 70 + rnd() * 110;
      for (let j = 0; j < 5; j++) { c.fillStyle = `rgba(255,255,255,${0.3 + rnd() * 0.3})`; c.beginPath(); c.ellipse(x + (rnd() - 0.5) * w, y + (rnd() - 0.5) * 12, w * (0.3 + rnd() * 0.4), 9 + rnd() * 12, 0, 0, 7); c.fill(); }
    }

    const X = 11, YB = -19, YF = 27, WALL = 1.6;
    const person = (x, y, z) => {
      const p = v.P(x, y, z), r = Math.max(1.1, p.s * 0.17);
      c.fillStyle = SHIRTS[(rnd() * SHIRTS.length) | 0]; c.beginPath(); c.roundRect(p.x - r * 1.1, p.y - r * 0.75, r * 2.2, r * 2.1, r * 0.6); c.fill();
      c.fillStyle = 'rgba(10,14,30,.22)'; c.fillRect(p.x - r * 1.1, p.y - r * 0.2, r * 0.9, r * 1.5);
      c.fillStyle = SKINS[(rnd() * SKINS.length) | 0]; c.beginPath(); c.ellipse(p.x, p.y - r * 1.4, r * 0.62, r * 0.76, 0, 0, 7); c.fill();
      const q = rnd();
      if (q < 0.22) { c.fillStyle = q < 0.15 ? '#eadfc2' : '#f4f2ec'; c.beginPath(); c.ellipse(p.x, p.y - r * 1.72, r * 0.72, r * 0.42, 0, Math.PI, 0); c.fill(); c.fillRect(p.x - r * 1.05, p.y - r * 1.78, r * 2.1, r * 0.2); }
      else if (q < 0.85) { c.fillStyle = HAIRS[(rnd() * HAIRS.length) | 0]; c.beginPath(); c.ellipse(p.x, p.y - r * 1.62, r * 0.66, r * 0.56, 0, Math.PI, 0); c.fill(); }
      if (rnd() < 0.22) fans.push({ x: p.x, y: p.y - r * 1.4, r });
    };
    const rowD = (r) => 0.7 + r * 0.74, rowZ = (r) => WALL + 0.5 + r * 0.52;

    // --- Tribune du fond : deux niveaux, bandeau lumineux, toit ---
    const BX = X + 9, R1 = 12, R2 = 24;
    const bd = (r) => rowD(r) + (r >= R1 ? 1.2 : 0), bz = (r) => rowZ(r) + (r >= R1 ? 1.5 : 0);
    v.poly(c, [[-BX, YB, WALL], [BX, YB, WALL], [BX + 6, YB - bd(R2), bz(R2)], [-BX - 6, YB - bd(R2), bz(R2)]], k.seat);
    for (let r = 0; r < R2; r++) {
      if (r === R1) continue;
      const wdt = BX + r * 0.25;
      v.line(c, [-wdt, YB - bd(r) + 0.35, bz(r) - 0.42], [wdt, YB - bd(r) + 0.35, bz(r) - 0.42], 'rgba(0,0,0,.3)', 0.1);
      for (let x = -wdt; x <= wdt; x += 0.56) {
        if (Math.abs((Math.abs(x) % 7.2) - 3.6) < 0.34) { const p = v.P(x, YB - bd(r), bz(r) - 0.35); c.fillStyle = 'rgba(200,200,190,.4)'; c.fillRect(p.x - p.s * 0.22, p.y - p.s * 0.1, p.s * 0.44, p.s * 0.5); }
        else if (rnd() < 0.95) person(x + (rnd() - 0.5) * 0.14, YB - bd(r), bz(r));
      }
    }
    const fy = YB - bd(R1) + 0.5, fz0 = bz(R1 - 1) + 0.25, fz1 = bz(R1) - 0.2;
    v.poly(c, [[-BX - 3, fy, fz0], [BX + 3, fy, fz0], [BX + 3, fy, fz1], [-BX - 3, fy, fz1]], k.wall);
    const a0 = v.P(-5.2, fy, fz0), a1 = v.P(5.2, fy, fz1), led = { x: a0.x, y: a1.y, w: a1.x - a0.x, h: a0.y - a1.y };
    c.fillStyle = '#071019'; c.fillRect(led.x, led.y, led.w, led.h);
    c.fillStyle = '#f3ede0'; c.textAlign = 'center'; c.textBaseline = 'middle';
    const fp = v.P(0, fy, (fz0 + fz1) / 2); c.font = `700 ${fp.s * 0.62}px ${A.FONT}`;
    c.fillText(venue.city.toUpperCase(), v.P(-11, fy, 0).x, fp.y); c.fillText('2026', v.P(11, fy, 0).x, fp.y);
    const ty = YB - bd(R2), tz = bz(R2);
    v.path(c, [[-BX - 6, ty, tz], [BX + 6, ty, tz], [BX + 3, YB - bd(R1 + 4), bz(R1 + 4)], [-BX - 3, YB - bd(R1 + 4), bz(R1 + 4)]]); c.fillStyle = 'rgba(8,14,28,.45)'; c.fill();
    v.poly(c, [[-BX - 8, ty - 1, tz + 2.2], [BX + 8, ty - 1, tz + 2.2], [BX + 8, ty + 9, tz + 3.4], [-BX - 8, ty + 9, tz + 3.4]], '#39454d');
    v.poly(c, [[-BX - 8, ty + 9, tz + 3.4], [BX + 8, ty + 9, tz + 3.4], [BX + 8, ty + 9, tz + 4.3], [-BX - 8, ty + 9, tz + 4.3]], k.roof);
    for (let x = -BX - 6; x <= BX + 6; x += 3) { const p = v.P(x, ty + 8.6, tz + 3.3); c.fillStyle = '#fffbe6'; c.fillRect(p.x - p.s * 0.5, p.y - p.s * 0.12, p.s, p.s * 0.24); }

    // --- Tribunes latérales ---
    const RS = 20;
    for (const sg of [-1, 1]) {
      const tx = sg * (X + rowD(RS)), tz2 = rowZ(RS);
      v.poly(c, [[sg * X, YB, WALL], [sg * X, YF, WALL], [tx, YF, tz2], [tx, YB, tz2]], k.seat);
      const pts = [];
      for (let r = 0; r < RS; r++) for (let y = YB + 0.3; y <= 23; y += 0.6) {
        const aisle = Math.abs((((y - YB) % 7.6) + 7.6) % 7.6 - 3.8) < 0.36;
        if (aisle || rnd() < 0.95) pts.push([sg * (X + rowD(r)), y + (aisle ? 0 : (rnd() - 0.5) * 0.14), rowZ(r), aisle]);
      }
      pts.sort((a, b) => a[1] - b[1] || a[2] - b[2]);
      for (const p of pts) {
        if (p[3]) { const q = v.P(p[0], p[1], p[2] - 0.35); c.fillStyle = 'rgba(200,200,190,.4)'; c.fillRect(q.x - q.s * 0.3, q.y - q.s * 0.1, q.s * 0.6, q.s * 0.45); }
        else person(p[0], p[1], p[2]);
      }
      v.poly(c, [[tx, YB, tz2], [tx, YF, tz2], [tx, YF, tz2 + 1.1], [tx, YB, tz2 + 1.1]], k.wallDark);
      for (let y = YB + 2, i = 0; y < 22; y += 4.5, i++) {
        v.line(c, [tx, y, tz2 + 1.1], [tx, y, tz2 + 4.3], '#dfe3e6', 0.09);
        v.poly(c, [[tx, y, tz2 + 4.3], [tx, y + 1.5, tz2 + 3.95], [tx, y, tz2 + 3.5]], i % 2 ? k.accent : '#f4f2ec');
      }
      // Tribune de droite à contre-jour, tribune de gauche au soleil
      v.path(c, [[sg * X, YB, WALL], [sg * X, YF, WALL], [tx, YF, tz2 + 1.1], [tx, YB, tz2 + 1.1]]);
      c.fillStyle = sg > 0 ? 'rgba(8,14,34,.36)' : 'rgba(255,236,200,.06)'; c.fill();
    }
    // Voile atmosphérique sur la tribune du fond
    const hazeY = v.P(0, YB, WALL).y; const hg = c.createLinearGradient(0, -M, 0, hazeY); hg.addColorStop(0, 'rgba(196,212,226,.3)'); hg.addColorStop(1, 'rgba(196,212,226,.06)');
    c.fillStyle = hg; c.fillRect(-M, -M, W + 2 * M, hazeY + M);

    // --- Sol ---
    const ground = [[-X, YB, 0], [X, YB, 0], [X, YF, 0], [-X, YF, 0]];
    v.poly(c, ground, k.court);
    c.save(); v.path(c, ground); c.clip();
    if (k.stripes) { // gazon tondu en bandes
      let i = 0;
      for (let x = -X; x < X; x += 1.03, i++) if (i % 2) v.poly(c, [[x, YB, 0], [x + 1.03, YB, 0], [x + 1.03, YF, 0], [x, YF, 0]], k.courtLight);
      for (let n = 0; n < 5000; n++) { const p = v.P((rnd() * 2 - 1) * X, lerp(YB, 20, rnd()), 0); c.fillStyle = rnd() < 0.5 ? 'rgba(210,235,160,.14)' : 'rgba(20,60,15,.16)'; c.fillRect(p.x, p.y, Math.max(1, p.s * 0.02), Math.max(1.5, p.s * 0.06)); }
      for (const sy of [-1, 1]) { v.blot(c, 0, sy * 12.3, 4.6, 1.5, k.wear, 0.6); v.blot(c, -2.3, sy * 12.1, 2.4, 1.1, k.wear, 0.4); v.blot(c, 2.3, sy * 12.1, 2.4, 1.1, k.wear, 0.4); v.blot(c, 0, sy * 6.2, 1.6, 0.9, k.wear, 0.3); }
    } else { // terre battue : marbrures, traces de passage, grain
      for (let n = 0; n < 110; n++) v.blot(c, (rnd() * 2 - 1) * X, lerp(YB, 21, rnd()), 1.2 + rnd() * 3.2, 0.8 + rnd() * 2, rnd() < 0.5 ? '255,196,150' : '96,36,10', 0.075);
      for (const sy of [-1, 1]) { v.blot(c, 0, sy * 12.5, 5.2, 1.7, k.wear, 0.24); v.blot(c, 0, sy * 6, 3.5, 2, k.wear, 0.1); }
      c.strokeStyle = 'rgba(255,215,180,.05)'; c.lineWidth = 1; // traînées du filet de balayage
      for (let n = 0; n < 60; n++) { const y0 = lerp(YB, 19, rnd()), p = v.P(-X, y0, 0), q = v.P(X, y0 + (rnd() - 0.5) * 0.6, 0); c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke(); }
      for (let n = 0; n < 6500; n++) { const p = v.P((rnd() * 2 - 1) * X, lerp(YB, 20, rnd()), 0); c.fillStyle = rnd() < 0.5 ? 'rgba(255,214,176,.13)' : 'rgba(84,30,8,.15)'; c.fillRect(p.x, p.y, Math.max(1, p.s * 0.045), Math.max(1, p.s * 0.02)); }
    }
    // Lumière : soleil rasant de l'arrière droit, grande ombre de la tribune sur le côté droit
    const g = c.createRadialGradient(W * 0.4, H * 0.5, H * 0.1, W * 0.45, H * 0.55, H);
    g.addColorStop(0, 'rgba(255,232,188,.17)'); g.addColorStop(1, 'rgba(18,10,30,.24)');
    c.fillStyle = g; c.fillRect(-M, -M, W + 2 * M, H + 2 * M);
    v.poly(c, [[X, YB, 0], [5.1, YB, 0], [7.6, YF, 0], [X, YF, 0]], 'rgba(10,14,46,.3)');
    v.poly(c, [[5.1, YB, 0], [4.7, YB, 0], [7.2, YF, 0], [7.6, YF, 0]], 'rgba(10,14,46,.12)');
    c.restore();

    // --- Murs, bâches, jardinières ---
    v.poly(c, [[-X, YB, 0], [X, YB, 0], [X, YB, WALL], [-X, YB, WALL]], k.wall);
    for (const sg of [-1, 1]) v.poly(c, [[sg * X, YB, 0], [sg * X, YF, 0], [sg * X, YF, WALL], [sg * X, YB, WALL]], sg > 0 ? k.wallDark : k.wall);
    v.poly(c, [[-X, YB, WALL], [X, YB, WALL], [X, YB, WALL + 0.22], [-X, YB, WALL + 0.22]], k.trim);
    for (const sg of [-1, 1]) v.poly(c, [[sg * X, YB, WALL], [sg * X, YF, WALL], [sg * X, YF, WALL + 0.22], [sg * X, YB, WALL + 0.22]], k.trim);
    for (let n = 0; n < 500; n++) { const side = rnd() < 0.4, p = side ? v.P((rnd() < 0.5 ? -1 : 1) * X, lerp(YB, 20, rnd()), WALL + 0.1 + rnd() * 0.16) : v.P((rnd() * 2 - 1) * X, YB, WALL + 0.1 + rnd() * 0.16); c.fillStyle = rnd() < 0.5 ? 'rgba(255,255,255,.45)' : 'rgba(40,110,50,.7)'; c.fillRect(p.x, p.y, Math.max(1.2, p.s * 0.07), Math.max(1.2, p.s * 0.07)); }
    const wp = v.P(0, YB, WALL * 0.5);
    c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#efe9dc';
    c.font = `700 ${wp.s * 0.78}px ${A.FONT}`; c.fillText(venue.name.toUpperCase(), wp.x, wp.y);
    c.font = `600 ${wp.s * 0.46}px ${A.FONT}`;
    for (const sx of [-7.4, 7.4]) { const q = v.P(sx, YB, WALL * 0.5); c.fillText((sx < 0 ? venue.city : venue.surfaceLabel).toUpperCase(), q.x, q.y); }
    for (let y = YB + 4; y < 18; y += 7) for (const sg of [-1, 1]) v.poly(c, [[sg * X, y, 0.3], [sg * X, y + 4.6, 0.3], [sg * X, y + 4.6, 1.3], [sg * X, y, 1.3]], 'rgba(243,237,224,.12)');
    const wg = c.createLinearGradient(0, v.P(0, YB, WALL).y, 0, v.P(0, YB, 0).y); wg.addColorStop(0, 'rgba(0,0,0,0)'); wg.addColorStop(1, 'rgba(0,0,0,.22)');
    v.path(c, [[-X, YB, 0], [X, YB, 0], [X, YB, WALL], [-X, YB, WALL]]); c.fillStyle = wg; c.fill();

    // --- Lignes, ombre du filet ---
    const L = (a, b) => v.line(c, a, b, 'rgba(250,250,244,.94)', 0.055);
    const hw = co.halfW, hl = co.halfL, sv = co.service;
    L([-hw, -hl], [hw, -hl]); L([-hw, hl], [hw, hl]); L([-hw, -hl], [-hw, hl]); L([hw, -hl], [hw, hl]);
    L([-hw, -sv], [hw, -sv]); L([-hw, sv], [hw, sv]); L([0, -sv], [0, sv]); L([0, -hl], [0, -hl + 0.25]); L([0, hl], [0, hl - 0.25]);
    v.poly(c, [[-co.postX, 0, 0], [co.postX, 0, 0], [co.postX + SUN.x, SUN.y, 0], [-co.postX + SUN.x, SUN.y, 0]], 'rgba(20,10,30,.22)');

    // --- Officiels, ramasseurs, bancs, parasols, chaise d'arbitre ---
    const staff = { gender: 'M', shirt: '#22364f', shorts: '#d9d2c0', accent: '#d9d2c0', skin: '#dcb08c', hair: '#333', hairStyle: 'short', cap: true };
    const kid = { gender: 'M', shirt: k.accentDeep, shorts: '#1b2430', accent: '#f4f2ec', skin: '#cf9f78', hair: '#2b2018', hairStyle: 'short', height: 1.55 };
    const still = { hands: { hx: 0.03, hz: -0.5, ox: 0.03, oz: -0.5 }, noRacket: true };
    const stand = (x, y, look, pose) => {
      const p = v.P(x, y, 0), h = v.P(x + SUN.x * 1.6, y + SUN.y * 1.6, 0);
      c.strokeStyle = 'rgba(25,10,20,.22)'; c.lineWidth = p.s * 0.36; c.lineCap = 'round'; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(h.x, h.y); c.stroke();
      A.Figure.draw(c, p, look, pose);
    };
    for (const jx of [-9.6, 9.6]) stand(jx, YB + 0.9, staff, Object.assign({ fh: 1 }, still));
    for (const jx of [-5.3, 5.3]) stand(jx, YB + 0.7, kid, Object.assign({ fh: 1 }, still));
    const ux = -6.5;
    for (const by of [-3.4, 3.4]) {
      const b0 = v.P(ux - 1.1, by, 0), pc = v.P(ux - 1.1, by, 2.5);
      v.blot(c, ux - 1.9, by + 0.5, 1.7, 1.2, '20,10,30', 0.34);
      v.poly(c, [[ux - 1.6, by - 0.9, 0.45], [ux - 0.7, by - 0.9, 0.45], [ux - 0.7, by + 0.9, 0.45], [ux - 1.6, by + 0.9, 0.45]], '#dfd9c9');
      v.poly(c, [[ux - 0.7, by - 0.9, 0], [ux - 0.7, by + 0.9, 0], [ux - 0.7, by + 0.9, 0.45], [ux - 0.7, by - 0.9, 0.45]], '#b3ac99');
      v.line(c, [ux - 1.1, by, 0], [ux - 1.1, by, 2.5], '#cfcfcf', 0.06);
      c.fillStyle = k.parasol; c.beginPath(); c.ellipse(pc.x, pc.y, pc.s * 1.45, pc.s * 0.5, 0, 0, 7); c.fill();
      c.fillStyle = 'rgba(0,0,0,.16)'; c.beginPath(); c.ellipse(pc.x, pc.y + pc.s * 0.1, pc.s * 1.45, pc.s * 0.4, 0, 0, Math.PI); c.fill();
      c.fillStyle = k.accent; c.fillRect(b0.x + b0.s * 0.55, b0.y - b0.s * 0.62, b0.s * 0.5, b0.s * 0.3);
    }
    for (const kx of [-co.postX - 1.0, co.postX + 1.0]) stand(kx, 0.5, kid, Object.assign({ away: true, fh: 1, crouch: 0.4, wide: 0.05 }, still));
    for (const [dx2, dy2, col] of [[-0.4, -0.3, '#c6bfad'], [0.4, -0.3, '#c6bfad'], [-0.4, 0.3, '#ebe6d9'], [0.4, 0.3, '#ebe6d9']]) v.line(c, [ux + dx2, dy2, 0], [ux + dx2 * 0.6, dy2 * 0.4, 1.9], col, 0.07);
    for (const zz of [0.6, 1.2]) v.line(c, [ux - 0.34, 0.25, zz], [ux + 0.34, 0.25, zz], '#ebe6d9', 0.05);
    v.poly(c, [[ux - 0.42, 0.25, 1.9], [ux + 0.42, 0.25, 1.9], [ux + 0.42, -0.25, 1.9], [ux - 0.42, -0.25, 1.9]], k.wall);
    const up = v.P(ux, 0, 1.9);
    A.Figure.draw(c, { x: up.x, y: up.y + up.s * 0.86, s: up.s }, { gender: 'M', shirt: '#f1ede3', shorts: '#16222b', accent: k.accent, skin: '#dcb08c', hair: '#555', hairStyle: 'short', cap: true }, { fh: 1, seated: true, hands: { hx: -0.03, hz: -0.4, ox: -0.03, oz: -0.4 } });
    return { fans, led };
  }

  A.Stadium = { paint };
})(typeof window !== 'undefined' ? window : globalThis);
