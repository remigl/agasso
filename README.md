# Agasso Tennis Generation

Jeu de tennis pour Windows : 24 joueurs aux styles distincts, mode Tournoi, match amical, deux terrains
(Roland-Garros sur terre battue, Wimbledon sur gazon).

## Jouer

Télécharge `AgassoTennis-portable.exe` (rien à installer) ou `AgassoTennis-setup.exe` depuis la page
**Releases** du dépôt, release « Dernière version jouable ». Ils sont refabriqués par GitHub Actions à chaque push sur `main`.

| Action | Clavier | Manette |
| --- | --- | --- |
| Se déplacer / viser | Flèches ou ZQSD | Stick gauche / croix |
| Frappe (coup droit, revers, volée, smash) · service | Espace (J, X) | A |
| Lob · service lifté | C (K) | B |
| Amortie | V (L) | X |
| Slice | B (M) | Y |
| Pause / retour | Échap (P) | Start |
| Plein écran | F11 | — |

La direction tenue au moment de la frappe donne la visée (gauche/droite, haut = long, bas = court).
Bien placé et à l'arrêt, la frappe est précise ; en bout de course, elle peut sortir.

## Ajouter du contenu : un fichier, zéro code

Tout le contenu vit dans `content/`, un fichier par élément. Le moteur le découvre tout seul
(`npm start`, `npm test` et `npm run dist` régénèrent `content/_bundle.js`).

| Je veux ajouter… | Je crée… | Modèle à copier |
| --- | --- | --- |
| un joueur | `content/players/<id>.js` | `content/players/federer.js` |
| un style de jeu | `content/archetypes/<id>.js` | `content/archetypes/serve-volley.js` |
| un terrain | `content/venues/<id>.js` | `content/venues/wimbledon.js` |
| un tournoi | `content/tournaments/<id>.js` | `content/tournaments/roland-garros.js` |
| une musique | `content/music/<id>.js` | `content/music/menu-anthem.js` |
| une célébration | `content/celebrations/<id>.js` | `content/celebrations/leap.js` |

Un joueur complet tient en quelques lignes :

```js
Agasso.define('player', {
  id: 'serena', name: 'Serena Williams', short: 'S. Williams', gender: 'F', hand: 'R', country: 'USA',
  stats: { force: 10, speed: 9, technique: 10, mental: 10, serve: 10, defense: 9 }, // sur 10
  slams: 23,                       // informatif
  archetype: 'power-baseliner',    // style de base (IA + technique)
  style: 'Puissance exceptionnelle, service, agressivité.',
  technique: { serve: { pace: 1.08, margin: 0.78 } }, // surcharges facultatives de l'archétype
  celebration: 'fist-pump',
  look: { skin: '#5e3b26', hair: '#1a1210', hairStyle: 'bun', shirt: '#d63a6a', shorts: '#16181d', accent: '#f2f0ea', height: 1.75, bulk: 1.15 },
});
```

- **Statistiques (1–10)** : leur poids est réglé dans `src/config/game.js` (`STAT_EFFECT`) et reste volontairement modéré.
- **Signature** : `technique` (vitesse `pace`, effet `spin` de −1 slice à +1 lift, précision `margin` par coup, prise de balle tôt, revers à une ou deux mains, préparation, déplacement) et `ai` (agressivité, prise de risque, montées au filet, service-volée, lob, amortie, slice, placement). Les valeurs par défaut sont dans `src/config/game.js`, celles des styles dans `content/archetypes/`.
- **Musique** : pour remplacer une piste par un fichier, renseigner `file: 'assets/music/mon-morceau.mp3'` dans sa fiche. Les pistes fournies sont des compositions originales jouées par un synthétiseur intégré.
- **Terrain** : `physics` (rebond) est lu par le gameplay, `look` (couleurs, bandes de gazon, traces) uniquement par le rendu.

## Architecture

```
content/            données : joueurs, archétypes, terrains, tournois, musiques, célébrations
src/core/           registre de contenu (Agasso.define / get / all), utilitaires
src/config/         réglages du moteur : court, attributs de base, poids des stats, difficulté, formats
src/gameplay/       scoring · physics (balle, rebond) · shots (résolution des coups) · match (un match)
src/players/        fiche de données → profil (stats, technique, comportement) → attributs physiques
src/ai/             cerveau générique, paramétré par le profil et la difficulté
src/tournament/     tableau à élimination directe : tirage, têtes de série, progression, matchs simulés
src/audio/          engine (bus, synthèse) · sfx (bruitages, arbitre) · music (fichier ou partition)
src/render/         view (caméras) · figure · anim · stadium · vfx · renderer   ← tout le visuel est ici
src/ui/             écrans (DOM) et feuille de style
src/app/            réglages, entrées clavier/manette, déroulé de l'application
tools/              build-content · load (moteur dans Node) · simulate (équilibrage)
tests/              score, moteur, contenu, tournoi
```

Règle de dépendance : `gameplay`, `players`, `ai` et `tournament` n'importent ni rendu, ni son, ni interface.
Le rendu et le son ne font que lire l'état du match et ses événements : on peut refaire toute l'apparence
(`src/render/`, `src/ui/`) sans toucher à la logique.

## Développement

```
npm install        # Electron + electron-builder
npm start          # lance le jeu
npm test           # 23 tests, sans dépendance
npm run simulate -- nadal federer 20 roland-garros   # duel IA contre IA
npm run simulate -- --ligue wimbledon                # tout le monde contre tout le monde
npm run dist       # fabrique les .exe Windows dans dist/
```

Les options du jeu (difficulté, caméra TV ou bord de court, qualité de rendu avec upscaling ou
suréchantillonnage, volumes) sont décrites par un schéma dans `src/app/settings.js`.
