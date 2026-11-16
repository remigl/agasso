// Musique de victoire : composition originale, hymne pop-rock triomphal à tempo moyen.
// Pour utiliser un vrai fichier audio à la place : file: 'assets/music/mon-morceau.mp3' (les `parts` servent alors de secours).
Agasso.define('music', {
  id: 'victory-anthem',
  name: "Sacre",
  role: 'victory',
  file: null,
  bpm: 100,
  loop: true,
  gain: 0.6,
  // Un jeton par double croche : note (A4, F#5, accord C3+E3+G3), '-' prolonge, '.' silence, 'x' percussion.
  parts: {
    lead: { voice: 'lead', gain: 0.26, seq: [
        'B4 - - - D5 - - - G5 - - - - - D5 -',
        'A5 - - - F#5 - - - D5 - - - - - . .',
        'G5 - - - E5 - - - B4 - - - E5 - G5 -',
        'G5 - - - E5 - - - C5 - - - - - . .',
        'B4 - - - D5 - - - G5 - - - B5 - - -',
        'A5 - - - - - F#5 - D5 - - - A5 - - -',
        'G5 - - - E5 - - - C5 - - - E5 - G5 -',
        'G5 - - - - - - - - - - - - - . .',
      ] },
    bass: { voice: 'bass', gain: 0.3, seq: [
        'G1 . G1 . G1 . G1 . G1 . G1 . G1 . G1 .',
        'D2 . D2 . D2 . D2 . D2 . D2 . D2 . D2 .',
        'E2 . E2 . E2 . E2 . E2 . E2 . E2 . E2 .',
        'C2 . C2 . C2 . C2 . C2 . C2 . C2 . C2 .',
        'G1 . G1 . G1 . G1 . G1 . G1 . G1 . G1 .',
        'D2 . D2 . D2 . D2 . D2 . D2 . D2 . D2 .',
        'C2 . C2 . C2 . C2 . C2 . C2 . C2 . C2 .',
        'G1 . G1 . G1 . G1 . G1 . G1 . G1 . G1 .',
      ] },
    pad: { voice: 'pad', gain: 0.1, seq: [
        'G3+B3+D4 - - - - - - - - - - - - - - -',
        'F#3+A3+D4 - - - - - - - - - - - - - - -',
        'E3+G3+B3 - - - - - - - - - - - - - - -',
        'E3+G3+C4 - - - - - - - - - - - - - - -',
        'G3+B3+D4 - - - - - - - - - - - - - - -',
        'F#3+A3+D4 - - - - - - - - - - - - - - -',
        'E3+G3+C4 - - - - - - - - - - - - - - -',
        'G3+B3+D4 - - - - - - - - - - - - - - -',
      ] },
    kick: { voice: 'kick', gain: 0.6, seq: 'x . . . . . x . x . . . . . . .' },
    snare: { voice: 'snare', gain: 0.3, seq: '. . . . x . . . . . . . x . . .' },
    hat: { voice: 'hat', gain: 0.1, seq: 'x . x . x . x . x . x . x . x .' },
  },
});
