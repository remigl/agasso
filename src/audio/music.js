// Musique : joue une piste déclarée dans content/music/*.js.
//   - `file` : chemin d'un fichier audio (mp3/ogg) → lu tel quel, en boucle si `loop`.
//   - sinon `parts` : partition jouée par le petit synthétiseur intégré.
// Remplacer une musique = changer `file` dans sa fiche, sans toucher au code.
(function (root) {
  const A = root.Agasso, E = A.AudioEngine;
  const SEMI = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
  let cur = null;

  const freq = (name) => { const m = /^([A-G])([#b]?)(\d)$/.exec(name); return m ? 440 * Math.pow(2, (SEMI[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (+m[3] + 1) * 12 - 69) / 12) : 0; };

  // « A4 - - D5 . » → événements {step, freqs, len}. Un jeton par double croche ; '-' prolonge, '.' silence.
  function parse(seq) {
    const tok = (Array.isArray(seq) ? seq.join(' ') : seq).split(/\s+/).filter(Boolean), ev = [];
    tok.forEach((t, i) => {
      if (t === '-') { if (ev.length && ev[ev.length - 1].open) ev[ev.length - 1].len++; return; }
      if (ev.length) ev[ev.length - 1].open = false;
      if (t !== '.') ev.push({ step: i, len: 1, open: true, freqs: t === 'x' ? [0] : t.split('+').map(freq) });
    });
    return { ev, steps: tok.length };
  }

  const VOICES = {
    lead(ac, out, f, t, d, g) { for (const det of [-7, 7]) { const o = ac.createOscillator(), fl = ac.createBiquadFilter(), a = ac.createGain(); o.type = 'sawtooth'; o.frequency.value = f; o.detune.value = det; fl.type = 'lowpass'; fl.frequency.setValueAtTime(3200, t); fl.frequency.exponentialRampToValueAtTime(1200, t + d); a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(g * 0.5, t + 0.02); a.gain.setValueAtTime(g * 0.4, t + d * 0.7); a.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.12); o.connect(fl); fl.connect(a); a.connect(out); o.start(t); o.stop(t + d + 0.15); } },
    bass(ac, out, f, t, d, g) { const o = ac.createOscillator(), fl = ac.createBiquadFilter(), a = ac.createGain(); o.type = 'sawtooth'; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = 420; a.gain.setValueAtTime(g, t); a.gain.exponentialRampToValueAtTime(0.0001, t + d * 0.95); o.connect(fl); fl.connect(a); a.connect(out); o.start(t); o.stop(t + d + 0.05); },
    pad(ac, out, f, t, d, g) { const o = ac.createOscillator(), fl = ac.createBiquadFilter(), a = ac.createGain(); o.type = 'sawtooth'; o.frequency.value = f; fl.type = 'lowpass'; fl.frequency.value = 1100; a.gain.setValueAtTime(0.0001, t); a.gain.linearRampToValueAtTime(g * 0.5, t + 0.15); a.gain.setValueAtTime(g * 0.5, t + d - 0.1); a.gain.linearRampToValueAtTime(0.0001, t + d + 0.25); o.connect(fl); fl.connect(a); a.connect(out); o.start(t); o.stop(t + d + 0.3); },
    kick(ac, out, f, t, d, g) { E.tone({ at: t, f0: 150, f1: 42, dur: 0.16, gain: g, bus: 'music' }); },
    snare(ac, out, f, t, d, g) { E.burst({ at: t, dur: 0.16, type: 'highpass', freq: 1400, gain: g, bus: 'music' }); E.tone({ at: t, f0: 210, f1: 150, dur: 0.08, gain: g * 0.5, bus: 'music' }); },
    hat(ac, out, f, t, d, g) { E.burst({ at: t, dur: 0.035, type: 'highpass', freq: 7000, gain: g, bus: 'music' }); },
  };

  function stop(fade) {
    if (!cur) return;
    const c = cur; cur = null;
    clearInterval(c.timer);
    if (c.el) { const el = c.el, v0 = el.volume, t0 = performance.now(), ms = (fade == null ? 0.6 : fade) * 1000; const id = setInterval(() => { const k = 1 - (performance.now() - t0) / ms; if (k <= 0) { el.pause(); clearInterval(id); } else el.volume = v0 * k; }, 40); }
    if (c.out) { const ac = E.ctx; c.out.gain.setTargetAtTime(0.0001, ac.currentTime, (fade == null ? 0.6 : fade) / 4); setTimeout(() => c.out.disconnect(), 1500); }
  }

  function synth(def) {
    const ac = E.init(); if (!ac) return;
    const out = ac.createGain(); out.gain.value = def.gain || 0.6; out.connect(E.bus('music'));
    const parts = Object.entries(def.parts).map(([name, p]) => Object.assign({ voice: VOICES[p.voice || name] || VOICES.lead, gain: p.gain || 0.3 }, parse(p.seq)));
    const total = Math.max(...parts.map((p) => p.steps)), sp = 60 / def.bpm / 4;
    const me = (cur = { id: def.id, out, step: 0, next: ac.currentTime + 0.08 });
    me.timer = setInterval(() => {
      if (cur !== me) return;
      while (me.next < ac.currentTime + 0.25) {
        if (me.step >= total) { if (def.loop === false) { clearInterval(me.timer); return; } me.step = 0; }
        for (const p of parts) for (const e of p.ev) if (e.step === me.step % p.steps) for (const f of e.freqs) p.voice(ac, out, f, me.next, e.len * sp, p.gain);
        me.step++; me.next += sp;
      }
    }, 60);
  }

  function play(id) {
    const def = A.get('music', id);
    if (!def || (cur && cur.id === id)) return;
    stop(0.4);
    if (!def.file) return synth(def);
    const el = new Audio(def.file); el.loop = def.loop !== false; el.volume = Math.min(1, E.volume('music'));
    cur = { id, el };
    el.addEventListener('error', () => { if (cur && cur.el === el) { cur = null; synth(def); } }); // fichier absent : partition de secours
    el.play().catch(() => {});
  }

  A.Music = { play, stop, parse, freq, current: () => (cur ? cur.id : null), setVolume(v) { E.setVolume('music', v); if (cur && cur.el) cur.el.volume = Math.min(1, v); } };
})(typeof window !== 'undefined' ? window : globalThis);
