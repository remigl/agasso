// Moteur audio : contexte Web Audio, bus de volume (effets, musique), briques de synthèse.
(function (root) {
  const A = root.Agasso;
  let ac = null, noise = null;
  const bus = {}, vol = { sfx: 0.9, music: 0.55 };

  function init() {
    if (ac) { if (ac.state === 'suspended') ac.resume(); return ac; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ac = new AC();
    for (const k of Object.keys(vol)) { bus[k] = ac.createGain(); bus[k].gain.value = vol[k]; bus[k].connect(ac.destination); }
    noise = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
    const d = noise.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return ac;
  }
  function setVolume(name, v) { vol[name] = v; if (bus[name]) bus[name].gain.value = v; }

  // Souffle filtré (frappes, public, caisse claire…).
  function burst(o) {
    if (!ac) return;
    const t = o.at != null ? o.at : ac.currentTime + (o.delay || 0), src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
    src.buffer = noise; src.loop = true; f.type = o.type || 'bandpass'; f.frequency.value = o.freq; f.Q.value = o.q || 0.7;
    g.gain.setValueAtTime(o.gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    src.connect(f); f.connect(g); g.connect(bus[o.bus || 'sfx']); src.start(t, Math.random()); src.stop(t + o.dur + 0.02);
  }
  // Note à hauteur glissante (impacts, percussions, bips).
  function tone(o) {
    if (!ac) return;
    const t = o.at != null ? o.at : ac.currentTime + (o.delay || 0), osc = ac.createOscillator(), g = ac.createGain();
    osc.type = o.wave || 'sine'; osc.frequency.setValueAtTime(o.f0, t); osc.frequency.exponentialRampToValueAtTime(o.f1 || o.f0, t + o.dur);
    g.gain.setValueAtTime(o.gain, t); g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
    osc.connect(g); g.connect(bus[o.bus || 'sfx']); osc.start(t); osc.stop(t + o.dur + 0.02);
  }

  A.AudioEngine = { init, setVolume, burst, tone, get ctx() { return ac; }, bus: (n) => bus[n], get noise() { return noise; }, volume: (n) => vol[n] };
})(typeof window !== 'undefined' ? window : globalThis);
