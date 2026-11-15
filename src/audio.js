// Sons 100 % synthétisés (Web Audio) : frappes, rebonds, filet, public, arbitre vocal.
(function (root) {
  const A = (root.Agasso = root.Agasso || {});
  let ac = null, master = null, noise = null, amb = null, frVoice = null;
  const S = { enabled: true, voice: true };

  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ac = new AC();
    master = ac.createGain(); master.gain.value = S.enabled ? 0.9 : 0; master.connect(ac.destination);
    noise = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function burst(dur, type, freq, q, gain, when) {
    if (!ac) return;
    const t = ac.currentTime + (when || 0), src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    src.buffer = noise; src.loop = true; f.type = type; f.frequency.value = freq; f.Q.value = q;
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(f); f.connect(g); g.connect(master); src.start(t, Math.random()); src.stop(t + dur + 0.02);
  }
  function tone(f0, f1, dur, gain, type, when) {
    if (!ac) return;
    const t = ac.currentTime + (when || 0), o = ac.createOscillator(), g = ac.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + 0.02);
  }

  const api = {
    init,
    setEnabled(on) { S.enabled = on; if (master) master.gain.value = on ? 0.9 : 0; if (!on && window.speechSynthesis) speechSynthesis.cancel(); },
    setVoice(on) { S.voice = on; },
    hit(power) { const p = power || 0.6; burst(0.07, 'bandpass', 1500 + p * 900, 0.8, 0.5 + p * 0.5); tone(210, 80, 0.09, 0.5 + p * 0.4); },
    bounce(v) { const p = Math.min(1, v / 9); tone(150, 60, 0.08, 0.25 + p * 0.35); burst(0.05, 'lowpass', 700, 0.5, 0.12 + p * 0.15); },
    net() { burst(0.2, 'lowpass', 500, 0.7, 0.5); tone(90, 50, 0.15, 0.3); },
    swing() { burst(0.09, 'bandpass', 900, 2.5, 0.08); },
    ui() { tone(680, 880, 0.06, 0.18, 'triangle'); },
    call() { tone(520, 500, 0.16, 0.22, 'square'); tone(390, 380, 0.22, 0.22, 'square', 0.18); },
    // Applaudissements : souffle de foule + claquements épars.
    cheer(level) {
      if (!ac) return;
      const l = Math.min(1.4, level || 1), t = ac.currentTime, src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
      src.buffer = noise; src.loop = true; f.type = 'bandpass'; f.frequency.value = 1100; f.Q.value = 0.4;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.16 * l, t + 0.25);
      g.gain.setValueAtTime(0.16 * l, t + 0.9 * l); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2 + 1.6 * l);
      src.connect(f); f.connect(g); g.connect(master); src.start(t); src.stop(t + 3 + 2 * l);
      for (let i = 0; i < 70 * l; i++) burst(0.018, 'highpass', 1400 + Math.random() * 1500, 0.5, 0.05 + Math.random() * 0.07, 0.1 + Math.random() * (1.4 + l));
    },
    ooh() { if (!ac) return; tone(190, 150, 0.7, 0.07, 'sawtooth'); tone(240, 185, 0.7, 0.05, 'sawtooth'); burst(0.8, 'bandpass', 500, 0.6, 0.07); },
    ambience(on) {
      if (!ac) return;
      if (on && !amb) {
        const src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
        src.buffer = noise; src.loop = true; f.type = 'lowpass'; f.frequency.value = 420; g.gain.value = 0.035;
        src.connect(f); f.connect(g); g.connect(master); src.start(); amb = src;
      } else if (!on && amb) { amb.stop(); amb = null; }
    },
    // Annonce de l'arbitre (synthèse vocale française si disponible).
    say(text) {
      if (!S.enabled || !S.voice || !window.speechSynthesis) return;
      try {
        if (!frVoice) frVoice = speechSynthesis.getVoices().find((v) => /^fr/i.test(v.lang)) || null;
        const u = new SpeechSynthesisUtterance(text.replace(/–/g, ','));
        u.lang = 'fr-FR'; if (frVoice) u.voice = frVoice; u.rate = 1.05; u.volume = 0.9;
        speechSynthesis.cancel(); speechSynthesis.speak(u);
      } catch (e) { /* voix indisponible : on continue sans */ }
    },
  };
  A.Audio = api;
})(typeof window !== 'undefined' ? window : globalThis);
