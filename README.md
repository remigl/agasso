# Agasso Tennis Generation 2026

Tennis arcade sur terre battue, à Roland-Garros. Choisis **Eric**, **Remi** ou **Corinne** et affronte **Agasso**.
Les quatre joueurs ont exactement les mêmes statistiques : seul le jeu fait la différence.

## Jouer (Windows)

Télécharge `AgassoTennis-portable.exe` (rien à installer) ou `AgassoTennis-setup.exe` (installeur) depuis la
page **Releases** du dépôt, release « Dernière version jouable ». Ces fichiers sont générés automatiquement
par GitHub Actions à chaque push sur `main`.

## Commandes

| Action | Clavier | Manette |
| --- | --- | --- |
| Se déplacer / viser | Flèches ou ZQSD | Stick gauche / croix |
| Frappe (coup droit, revers, volée, smash) · service | Espace (ou J, X) | A |
| Lob · service sécurisé | C (ou K) | B |
| Amortie | V (ou L) | X |
| Pause | Échap (ou P) | Start |
| Plein écran | F11 | — |

- Coup droit ou revers : choisi automatiquement selon le côté où arrive la balle. Balle haute = smash.
- La direction tenue au moment de la frappe donne la visée : gauche/droite pour croiser, haut pour jouer long, bas pour jouer court.
- Plus tu es bien placé et à l'arrêt, plus la frappe est précise. En bout de course, la balle peut sortir.
- Service : Espace lance la balle, Espace à nouveau au sommet du lancer (zone verte de la jauge) pour un service à plat ; C pour un service sécurisé.

## Développement

```
npm install      # Electron + electron-builder
npm start        # lance le jeu dans sa fenêtre
npm test         # tests du score, de la simulation et de l'équilibrage de l'IA (sans dépendance)
npm run simulate # matchs IA contre IA pour régler l'équilibrage
npm run dist     # fabrique les .exe Windows dans dist/
```

Le jeu lui-même est en HTML/Canvas/JavaScript sans dépendance (`index.html` + `src/`) ; Electron ne sert que de fenêtre.

- `src/config.js` — terrain, statistiques communes, joueurs, niveaux de difficulté
- `src/scoring.js` — points, jeux, sets, tie-break (7 points, 10 au set décisif)
- `src/sim.js` — déplacements, physique de la balle, coups, service, arbitrage
- `src/ai.js` — Agasso : il produit les mêmes entrées qu'un joueur humain
- `src/render.js`, `src/audio.js`, `src/input.js`, `src/main.js` — rendu 2.5D, sons synthétisés, clavier/manette, écrans
