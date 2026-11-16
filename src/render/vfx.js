// Effets visuels : traces au sol, poussière / craie, impacts, textes flottants, confettis.
(function (root) {
  const A = root.Agasso, { clamp } = A;

  class Vfx {
    constructor() { this.marks = []; this.parts = []; this.pops = []; this.confetti = []; this.shake = 0; }
    clear() { this.marks.length = this.parts.length = this.pops.length = this.confetti.length = 0; }

    // Réagit aux événements du gameplay (lecture seule).
    onEvent(e, venue) {
      const k = venue.look;
      if (e.type === 'bounce' && e.v > 1.2) {
        if (k.mark) { this.marks.push({ x: e.x, y: e.y, a: 0.2 + Math.min(0.25, e.v * 0.03) }); if (this.marks.length > 90) this.marks.shift(); }
        const n = e.line ? 12 : k.mark ? 9 : 3, col = e.line ? '255,255,255' : k.dust;
        for (let i = 0; i < n; i++) this.parts.push({ x: e.x, y: e.y, z: 0.05, vx: (Math.random() - 0.5) * 2.6, vy: (Math.random() - 0.5) * 2.6, vz: 0.6 + Math.random() * 1.6, t: 0, life: 0.5 + Math.random() * 0.45, col });
      } else if (e.type === 'hit') {
        this.pops.push({ x: e.x, y: e.y, z: e.z, t: 0, ring: true, big: e.kind === 'smash' });
        if (e.kind === 'smash') this.shake = 0.3;
      } else if (e.type === 'serve' && e.q > 0.85) this.shake = 0.12;
    }
    pop(text, x, y, z, col) { this.pops.push({ text, x, y, z, t: 0, col }); }
    // Poussière soulevée par un appui (glissade sur terre battue).
    scuff(x, y, col) { for (let i = 0; i < 2; i++) this.parts.push({ x: x + (Math.random() - 0.5) * 0.3, y, z: 0.03, vx: (Math.random() - 0.5), vy: (Math.random() - 0.5), vz: 0.3 + Math.random() * 0.5, t: 0, life: 0.5 + Math.random() * 0.3, col }); }
    burstConfetti(W, colors) { for (let i = 0; i < 160; i++) this.confetti.push({ x: Math.random() * W, y: -20 - Math.random() * 300, vx: (Math.random() - 0.5) * 60, vy: 90 + Math.random() * 120, r: Math.random() * 7, w: 5 + Math.random() * 6, col: colors[i % colors.length], t: Math.random() * 6 }); }

    drawGround(c, v, venue) {
      if (!venue.look.mark) return;
      for (const m of this.marks) { const p = v.P(m.x, m.y, 0); c.fillStyle = `rgba(${venue.look.mark},${m.a})`; c.beginPath(); c.ellipse(p.x, p.y, p.s * 0.14, p.s * 0.05, 0, 0, 7); c.fill(); }
    }
    drawAir(c, v, dt) {
      this.shake = Math.max(0, this.shake - dt);
      for (const p of this.parts) {
        p.t += dt; p.vz -= 5 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.z = Math.max(0, p.z + p.vz * dt);
        const q = v.P(p.x, p.y, p.z), a = Math.max(0, 1 - p.t / p.life), r = q.s * 0.08 * (1 + p.t * 3);
        const gr = c.createRadialGradient(q.x, q.y, 0, q.x, q.y, r); gr.addColorStop(0, `rgba(${p.col},${0.6 * a})`); gr.addColorStop(1, `rgba(${p.col},0)`);
        c.fillStyle = gr; c.beginPath(); c.arc(q.x, q.y, r, 0, 7); c.fill();
      }
      this.parts = this.parts.filter((p) => p.t < p.life);
      c.textAlign = 'center'; c.textBaseline = 'middle';
      for (const p of this.pops) {
        p.t += dt; const q = v.P(p.x, p.y, p.z);
        if (p.ring) {
          const a = 1 - p.t / 0.16;
          if (a > 0) { const g = c.createRadialGradient(q.x, q.y, 0, q.x, q.y, q.s * (p.big ? 0.9 : 0.5)); g.addColorStop(0, `rgba(255,255,240,${0.75 * a})`); g.addColorStop(1, 'rgba(255,255,240,0)'); c.fillStyle = g; c.beginPath(); c.arc(q.x, q.y, q.s * (p.big ? 0.9 : 0.5), 0, 7); c.fill(); }
        } else { const a = clamp(1.2 - p.t, 0, 1); c.font = `700 ${Math.max(14, q.s * 0.36)}px ${A.FONT}`; c.lineWidth = 3; c.strokeStyle = `rgba(0,0,0,${0.5 * a})`; c.fillStyle = p.col; c.globalAlpha = a; c.strokeText(p.text, q.x, q.y - p.t * 34); c.fillText(p.text, q.x, q.y - p.t * 34); c.globalAlpha = 1; }
      }
      this.pops = this.pops.filter((p) => p.t < (p.ring ? 0.16 : 1.2));
    }
    // Confettis en espace écran (par-dessus la scène).
    drawScreen(c, W, H, dt) {
      for (const f of this.confetti) {
        f.t += dt; f.y += f.vy * dt; f.x += (f.vx + Math.sin(f.t * 3) * 30) * dt; f.r += dt * 4;
        c.save(); c.translate(f.x, f.y); c.rotate(f.r); c.fillStyle = f.col; c.fillRect(-f.w / 2, -f.w * 0.3 * Math.cos(f.t * 5), f.w, f.w * 0.6 * Math.cos(f.t * 5)); c.restore();
      }
      this.confetti = this.confetti.filter((f) => f.y < H + 30);
    }
  }

  A.Vfx = Vfx;
})(typeof window !== 'undefined' ? window : globalThis);
