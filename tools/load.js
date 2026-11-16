// Charge le moteur (sans rendu ni interface) dans Node : tests et simulations.
require('./build-content.js');
for (const f of ['core/core', 'config/game', 'gameplay/scoring', 'gameplay/physics', 'players/profile', 'gameplay/shots', 'gameplay/match', 'ai/ai', 'tournament/bracket'])
  require('../src/' + f + '.js');
require('../content/_bundle.js');
module.exports = globalThis.Agasso;
