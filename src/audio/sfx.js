// Bruitages synthétisés + voix de l'arbitre.
(function (root) {
  const A = root.Agasso, E = A.AudioEngine;
  let loop = null, loopGain = null, voiceOn = true, frVoice = null, crowd = 1; // crowd = niveau du public, donné par le terrain

  A.Sfx = {
    hit(p) { p = p || 0.6; E.burst({ dur: 0.07, freq: 1500 + p * 900, q: 0.8, gain: 0.5 + p * 0.5 }); E.tone({ f0: 210, f1: 80, dur: 0.09, gain: 0.5 + p * 0.4 }); },
    bounce(v) { const p = Math.min(1, v / 9); E.tone({ f0: 150, f1: 60, dur: 0.08, gain: 0.25 + p * 0.35 }); E.burst({ dur: 0.05, type: 'lowpass', freq: 700, q: 0.5, gain: 0.12 + p * 0.15 }); },
    net() { E.burst({ dur: 0.2, type: 'lowpass', freq: 500, gain: 0.5 }); E.tone({ f0: 90, f1: 50, dur: 0.15, gain: 0.3 }); },
    swing() { E.burst({ dur: 0.09, freq: 900, q: 2.5, gain: 0.08 }); },
    ui() { E.tone({ f0: 620, f1: 820, dur: 0.05, gain: 0.12, wave: 'triangle' }); },
    call() { E.tone({ f0: 520, f1: 500, dur: 0.16, gain: 0.2, wave: 'square' }); E.tone({ f0: 390, f1: 380, dur: 0.22, gain: 0.2, wave: 'square', delay: 0.18 }); },
    ooh() { E.tone({ f0: 190, f1: 150, dur: 0.7, gain: 0.07, wave: 'sawtooth' }); E.tone({ f0: 240, f1: 185, dur: 0.7, gain: 0.05, wave: 'sawtooth' }); E.burst({ dur: 0.8, freq: 500, q: 0.6, gain: 0.07 }); },
    // Applaudissements : souffle de foule + claquements épars.
    cheer(level) {
      const ac = E.ctx; if (!ac) return;
      const l = Math.min(1.6, (level || 1) * (0.45 + 0.55 * crowd)), t = ac.currentTime, src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
      src.buffer = E.noise; src.loop = true; f.type = 'bandpass'; f.frequency.value = 1100; f.Q.value = 0.4;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16 * l * crowd, t + 0.25);
      g.gain.setValueAtTime(0.16 * l * crowd, t + 0.9 * l); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2 + 1.6 * l);
      src.connect(f); f.connect(g); g.connect(E.bus('sfx')); src.start(t); src.stop(t + 3 + 2 * l);
      for (let i = 0; i < 70 * l * crowd; i++) E.burst({ dur: 0.018, type: 'highpass', freq: 1400 + Math.random() * 1500, q: 0.5, gain: 0.05 + Math.random() * 0.07, delay: 0.1 + Math.random() * (1.4 + l) });
    },
    ambience(on) {
      const ac = E.ctx; if (!ac) return;
      if (on && !loop) {
        const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
        src.buffer = E.noise; src.loop = true; f.type = 'lowpass'; f.frequency.value = 420; g.gain.value = 0.035 * crowd;
        src.connect(f); f.connect(g); g.connect(E.bus('sfx')); src.start(); loop = src; loopGain = g;
      } else if (!on && loop) { loop.stop(); loop = null; }
    },
    setCrowd(level) { crowd = level; if (loopGain) loopGain.gain.value = 0.035 * crowd; },
    setVoice(on) { voiceOn = on; if (!on && window.speechSynthesis) speechSynthesis.cancel(); },
    // Annonce de l'arbitre (synthèse vocale française si disponible).
    say(text) {
      if (!voiceOn || !E.volume('sfx') || !window.speechSynthesis) return;
      try {
        if (!frVoice) frVoice = speechSynthesis.getVoices().find((v) => /^fr/i.test(v.lang)) || null;
        const u = new SpeechSynthesisUtterance(text.replace(/–/g, ','));
        u.lang = 'fr-FR'; if (frVoice) u.voice = frVoice; u.rate = 1.05; u.volume = Math.min(1, E.volume('sfx'));
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      } catch (e) { /* voix indisponible : on continue sans */ }
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
