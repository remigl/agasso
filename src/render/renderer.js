// Chef d'orchestre du rendu : assemble décor, joueurs, balle, filet, effets, et pilote la caméra.
// Ne fait que LIRE l'état du match. Options : { camera: 'tv'|'court', scale: 0.6…1.5 }.
(function (root) {
  const A = root.Agasso, { COURT, clamp, lerp } = A, SUN = A.SUN;

  class Renderer {
    constructor(canvas, opts) {
      this.cv = canvas; this.ctx = canvas.getContext('2d');
      this.bg = document.createElement('canvas');
      this.view = new A.View(); this.vfx = new A.Vfx();
      this.venue = A.all('venue')[0];
      this.opts = Object.assign({ camera: 'tv', scale: 1 }, opts);
      this.trail = []; this.cheer = 0; this.fans = []; this.time = 0; this.cam = { x: 0, y: 0, z: 1 }; this.dustT = 0;
      this.resize();
    }

    configure(opts) { Object.assign(this.opts, opts); this.resize(); }
    setVenue(id) { const v = A.get('venue', id) || this.venue; if (v !== this.venue) { this.venue = v; this.vfx.clear(); this.paint(); } }

    resize() {
      const w = this.cv.clientWidth || 1280, h = this.cv.clientHeight || 720;
      // Résolution interne = taille affichée × densité d'écran × échelle de rendu (upscaling ou suréchantillonnage).
      this.px = Math.min(window.devicePixelRatio || 1, 2) * this.opts.scale;
      this.W = w; this.H = h; this.M = Math.round(w * 0.05);
      this.cv.width = Math.round(w * this.px); this.cv.height = Math.round(h * this.px);
      this.bg.width = Math.round((w + 2 * this.M) * this.px); this.bg.height = Math.round((h + 2 * this.M) * this.px);
      this.view.setup(w, h, this.opts.camera);
      this.paint();
    }

    paint() {
      const c = this.bg.getContext('2d'), M = this.M;
      c.setTransform(this.px, 0, 0, this.px, M * this.px, M * this.px);
      const r = A.Stadium.paint(c, this.view, this.venue, M);
      this.fans = r.fans; this.led = r.led;
    }

    onEvent(e) {
      this.vfx.onEvent(e, this.venue);
      if (e.type === 'hit' && e.kind === 'smash') this.vfx.pop('SMASH', e.x, e.y, e.z + 0.8, '#ffe08a');
    }

    // ui = { human: index du joueur humain ou −1, celebration: {winner, t} | null }
    draw(g, dt, ui) {
      const c = this.ctx, v = this.view, W = this.W, H = this.H, M = this.M, b = g.ball, cam = this.cam, vfx = this.vfx, cele = ui.celebration;
      this.time += dt; this.cheer = Math.max(0, this.cheer - dt * 0.45);
      c.imageSmoothingQuality = 'high';
      // Caméra : suit la balle, se resserre sur le serveur, le vainqueur du point, puis sur la célébration.
      let fx = v.P(b.x, b.y, 0), tz = 1.03, k = 0.08, rate = 3;
      if (cele) { const w = g.players[cele.winner]; fx = v.P(w.x, w.y, 1.0); tz = clamp((0.44 * H) / (1.85 * fx.s), 1.4, 2.7); fx = { x: fx.x + (W * 0.16) / tz, y: fx.y }; k = 1; rate = 1.3; }
      else if (g.phase === 'ready' || g.phase === 'toss') { const s = g.players[g.server]; fx = v.P(s.x, s.y, 1); tz = g.phase === 'toss' ? 1.08 : 1.05; k = 0.1; }
      else if (g.phase === 'over' && g.last && g.phaseT > 0.25) { const w = g.players[g.last.winner]; fx = v.P(w.x, w.y, 1); tz = 1.1; k = 0.18; }
      const e = 1 - Math.exp(-dt * rate);
      cam.z += (tz - cam.z) * e;
      const mx = M + (W / 2) * (1 - 1 / cam.z), my = M + (H / 2) * (1 - 1 / cam.z);
      cam.x += (clamp((fx.x - W / 2) * k, -mx, mx) - cam.x) * e; cam.y += (clamp((fx.y - H / 2) * k, -my, my) - cam.y) * e;
      cam.x = clamp(cam.x, -mx, mx); cam.y = clamp(cam.y, -my, my);
      const sk = vfx.shake * 16, ox = (Math.random() - 0.5) * sk, oy = (Math.random() - 0.5) * sk, d = this.px;
      c.setTransform(d * cam.z, 0, 0, d * cam.z, d * (W / 2 - cam.z * (W / 2 + cam.x) + ox), d * (H / 2 - cam.z * (H / 2 + cam.y) + oy));
      c.drawImage(this.bg, -M, -M, W + 2 * M, H + 2 * M);

      if (this.led && this.led.h > 6) {
        const m = g.match, n = g.players.map((p) => p.profile.short.toUpperCase()), L = this.led;
        c.font = `700 ${L.h * 0.56}px ${A.FONT}`; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#ffd98a';
        c.fillText(`${n[0]}  ${m.games[0]} – ${m.games[1]}  ${n[1]}`, L.x + L.w / 2, L.y + L.h / 2 + 1);
      }
      // Public : bras levés et flashs d'appareils photo
      if (this.cheer > 0.02 && this.fans.length) {
        const n = Math.floor(this.fans.length * Math.min(1, this.cheer) * 0.5);
        c.fillStyle = 'rgba(236,222,204,.85)';
        for (let i = 0; i < n; i++) { const f = this.fans[(Math.random() * this.fans.length) | 0]; c.fillRect(f.x - f.r * 1.5, f.y - f.r * 2.1, f.r * 0.55, f.r * 1.7); c.fillRect(f.x + f.r * 0.95, f.y - f.r * 2.1, f.r * 0.55, f.r * 1.7); }
        for (let i = 0; i < 3 * this.cheer; i++) { const f = this.fans[(Math.random() * this.fans.length) | 0], r = f.r * (3 + Math.random() * 4), gl = c.createRadialGradient(f.x, f.y, 0, f.x, f.y, r); gl.addColorStop(0, 'rgba(255,255,255,.95)'); gl.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = gl; c.beginPath(); c.arc(f.x, f.y, r, 0, 7); c.fill(); }
      }
      vfx.drawGround(c, v, this.venue);
      // Repère de chute (aide de jeu, pour le joueur humain uniquement)
      if (b.live && b.bounces === 0 && ui.human >= 0 && b.lastHitter !== ui.human) {
        const L = g.landing(), p = v.P(L.x, L.y, 0), r = p.s * (0.35 + Math.min(1, L.t) * 0.9);
        c.strokeStyle = 'rgba(255,255,255,.7)'; c.lineWidth = 1.6; c.beginPath(); c.ellipse(p.x, p.y, r, r * 0.36, 0, 0, 7); c.stroke();
        c.fillStyle = 'rgba(255,255,255,.16)'; c.beginPath(); c.ellipse(p.x, p.y, p.s * 0.35, p.s * 0.125, 0, 0, 7); c.fill();
      }
      // Ombres portées : contact au sol + silhouette allongée par le soleil
      c.lineCap = 'round';
      for (const pl of g.players) {
        const p = v.P(pl.x, pl.y, 0), h = v.P(pl.x + SUN.x * 1.75, pl.y + SUN.y * 1.75, 0);
        c.strokeStyle = 'rgba(22,10,24,.2)'; c.lineWidth = p.s * 0.44; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(h.x, h.y); c.stroke();
        c.strokeStyle = 'rgba(22,10,24,.14)'; c.lineWidth = p.s * 0.3; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(lerp(p.x, h.x, 0.6), lerp(p.y, h.y, 0.6)); c.stroke();
        c.fillStyle = 'rgba(22,10,24,.3)'; c.beginPath(); c.ellipse(p.x, p.y, p.s * 0.3, p.s * 0.09, 0, 0, 7); c.fill();
      }
      { const p = v.P(b.x + SUN.x * b.z * 0.5, b.y + SUN.y * b.z * 0.5, 0); c.fillStyle = 'rgba(22,10,24,.4)'; c.beginPath(); c.ellipse(p.x, p.y, p.s * 0.12, p.s * 0.045, 0, 0, 7); c.fill(); }
      // Poussière sous les appuis rapides (terre battue)
      if (this.venue.look.mark && (this.dustT += dt) > 0.07) { this.dustT = 0; for (const pl of g.players) if (Math.hypot(pl.vx, pl.vy) > pl.a.speed * 0.8) vfx.scuff(pl.x, pl.y, this.venue.look.dust); }

      if (!b.held) { this.trail.push({ x: b.x, y: b.y, z: b.z }); if (this.trail.length > 6) this.trail.shift(); } else this.trail.length = 0;
      const ents = g.players.map((pl) => ({ y: pl.y, d: () => A.Figure.draw(c, v.P(pl.x, pl.y, 0), A.Anim.look(pl.def, this.venue), A.Anim.pose(g, pl, this.time, cele)) }));
      ents.push({ y: 0, d: () => this.drawNet(c) });
      if (!cele) ents.push({ y: b.y + (b.y > 0 ? 0.01 : -0.01), d: () => this.drawBall(c, b) });
      ents.sort((a, z) => a.y - z.y).forEach((en) => en.d());
      vfx.drawAir(c, v, dt);

      // Jauge de service
      if (g.phase === 'toss' && g.server === ui.human) {
        const pl = g.players[ui.human], o = v.P(pl.x, pl.y, 0), gx = o.x + o.s * 1.2, gh = o.s * 2.1, gy = o.y - o.s * 0.2, w = 10;
        c.fillStyle = 'rgba(8,10,12,.78)'; c.fillRect(gx - 3, gy - gh - 3, w + 6, gh + 6);
        const zone = (t0, t1, col) => { c.fillStyle = col; c.fillRect(gx, gy - gh * (t1 / 1.3), w, gh * ((t1 - t0) / 1.3)); };
        zone(0.25, 1.05, '#8f3b38'); zone(0.45, 0.85, '#c9a243'); zone(0.57, 0.73, '#4fbf7a');
        c.fillStyle = '#fff'; c.fillRect(gx - 6, gy - gh * clamp(g.tossT / 1.3, 0, 1) - 2, w + 12, 4);
      }
      // Couche écran : confettis
      c.setTransform(d, 0, 0, d, 0, 0);
      vfx.drawScreen(c, W, H, dt);
    }

    drawBall(c, b) {
      const v = this.view, n = this.trail.length;
      c.lineCap = 'round';
      for (let i = 1; i < n; i++) { // flou de mouvement
        const p = v.P(this.trail[i - 1].x, this.trail[i - 1].y, this.trail[i - 1].z), q = v.P(this.trail[i].x, this.trail[i].y, this.trail[i].z);
        c.strokeStyle = `rgba(226,240,120,${(i / n) * 0.34})`; c.lineWidth = q.s * 0.15 * (i / n);
        c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(q.x, q.y); c.stroke();
      }
      const p = v.P(b.x, b.y, b.z), r = Math.max(2.8, p.s * 0.085);
      const gr = c.createRadialGradient(p.x + r * 0.35, p.y - r * 0.4, r * 0.1, p.x, p.y, r);
      gr.addColorStop(0, '#f4fb9c'); gr.addColorStop(0.65, '#cfe433'); gr.addColorStop(1, '#8fa51a');
      c.fillStyle = gr; c.beginPath(); c.arc(p.x, p.y, r, 0, 7); c.fill();
      c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = Math.max(0.7, r * 0.14); c.beginPath(); c.arc(p.x - r * 0.9, p.y, r, -0.7, 0.7); c.stroke();
    }

    drawNet(c) {
      const v = this.view, px = COURT.postX, h = A.Physics.netHeightAt, top = [], N = 26;
      for (let i = 0; i <= N; i++) { const x = lerp(-px, px, i / N); top.push([x, 0, h(x)]); }
      v.poly(c, top.concat([[px, 0, 0], [-px, 0, 0]]), 'rgba(10,12,16,.3)');
      c.strokeStyle = 'rgba(8,10,14,.5)'; c.lineWidth = 0.8; c.lineCap = 'butt'; c.beginPath();
      for (let x = -px; x <= px + 0.01; x += 0.16) { const a = v.P(x, 0, 0), q = v.P(x, 0, h(x)); c.moveTo(a.x, a.y); c.lineTo(q.x, q.y); }
      for (const fz of [0.12, 0.25, 0.37, 0.5, 0.62, 0.75, 0.87]) top.forEach((t, i) => { const q = v.P(t[0], 0, t[2] * fz); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); });
      c.stroke();
      c.strokeStyle = '#f7f7f1'; c.lineWidth = Math.max(2.4, v.P(0, 0, 1).s * 0.07); c.beginPath();
      top.forEach((t, i) => { const q = v.P(t[0], t[1], t[2]); i ? c.lineTo(q.x, q.y) : c.moveTo(q.x, q.y); }); c.stroke();
      v.line(c, [0, 0, 0], [0, 0, 0.914], '#f7f7f1', 0.05);
      for (const sg of [-1, 1]) v.line(c, [sg * px, 0, 0], [sg * px, 0, 1.1], this.venue.look.wallDark, 0.1);
    }
  }

  A.Renderer = Renderer;
})(typeof window !== 'undefined' ? window : globalThis);
