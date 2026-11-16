// Musique des menus : composition originale, hymne synthé de stade façon rock d'aréna des années 80.
// Pour utiliser un vrai fichier audio à la place : file: 'assets/music/mon-morceau.mp3' (les `parts` servent alors de secours).
Agasso.define('music', {
  id: 'menu-anthem',
  name: "Coup d'envoi",
  role: 'menu',
  file: null,
  bpm: 118,
  loop: true,
  gain: 0.6,
  // Un jeton par double croche : note (A4, F#5, accord C3+E3+G3), '-' prolonge, '.' silence, 'x' percussion.
  parts: {
    lead: { voice: 'lead', gain: 0.26, seq: [
        'A4 - - D5 - - F5 - E5 - D5 - A4 - - -',
        'Bb4 - - D5 - - F5 - G5 - F5 - D5 - - -',
        'C5 - - E5 - - G5 - A5 - G5 - E5 - - -',
        'E5 - - - C5 - - - A4 - - - - - . .',
        'A4 - - D5 - - F5 - A5 - - - G5 - F5 -',
        'G5 - - F5 - - D5 - Bb4 - - - - - . .',
        'C5 - - E5 - - G5 - C6 - - - Bb5 - A5 -',
        'A5 - - - - - - - D5 - - - - - . .',
      ] },
    bass: { voice: 'bass', gain: 0.3, seq: [
        'D2 . D2 . D2 . D2 . D2 . D2 . D2 . D2 .',
        'Bb1 . Bb1 . Bb1 . Bb1 . Bb1 . Bb1 . Bb1 . Bb1 .',
        'C2 . C2 . C2 . C2 . C2 . C2 . C2 . C2 .',
        'A1 . A1 . A1 . A1 . A1 . A1 . A1 . A1 .',
        'D2 . D2 . D2 . D2 . D2 . D2 . D2 . D2 .',
        'Bb1 . Bb1 . Bb1 . Bb1 . Bb1 . Bb1 . Bb1 . Bb1 .',
        'C2 . C2 . C2 . C2 . C2 . C2 . C2 . C2 .',
        'D2 . D2 . D2 . D2 . D2 . D2 . D2 . D2 .',
      ] },
    pad: { voice: 'pad', gain: 0.1, seq: [
        'D3+F3+A3 - - - - - - - - - - - - - - -',
        'Bb2+D3+F3 - - - - - - - - - - - - - - -',
        'C3+E3+G3 - - - - - - - - - - - - - - -',
        'A2+C3+E3 - - - - - - - - - - - - - - -',
        'D3+F3+A3 - - - - - - - - - - - - - - -',
        'Bb2+D3+F3 - - - - - - - - - - - - - - -',
        'C3+E3+G3 - - - - - - - - - - - - - - -',
        'D3+F3+A3 - - - - - - - - - - - - - - -',
      ] },
    kick: { voice: 'kick', gain: 0.6, seq: 'x . . . . . . . x . . . . . x .' },
    snare: { voice: 'snare', gain: 0.3, seq: '. . . . x . . . . . . . x . . .' },
    hat: { voice: 'hat', gain: 0.1, seq: 'x . x . x . x . x . x . x . x .' },
  },
});
