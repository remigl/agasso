// Rassemble tous les fichiers de content/ dans content/_bundle.js (chargé par index.html).
// Lancé automatiquement avant `npm start`, `npm test` et `npm run dist` :
// pour ajouter un joueur, un terrain ou un tournoi, il suffit de déposer un fichier dans content/.
const fs = require('fs'), path = require('path');
const dir = path.join(__dirname, '..', 'content');
let out = '// FICHIER GÉNÉRÉ par tools/build-content.js — ne pas modifier à la main.\n', n = 0;
for (const kind of fs.readdirSync(dir).sort()) {
  const d = path.join(dir, kind);
  if (!fs.statSync(d).isDirectory()) continue;
  for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.js')).sort()) { out += `\n// --- ${kind}/${f}\n` + fs.readFileSync(path.join(d, f), 'utf8'); n++; }
}
const target = path.join(dir, '_bundle.js');
if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== out) fs.writeFileSync(target, out);
if (require.main === module) console.log(`content/_bundle.js : ${n} fichiers`);
