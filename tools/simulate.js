// Équilibrage : fait jouer des matchs IA contre IA et affiche les statistiques.
// usage : node tools/simulate.js [matchs] [diffJoueur] [diffAgasso] [rg|wim]
require('../src/config.js'); require('../src/scoring.js'); require('../src/sim.js'); require('../src/ai.js');
const A = globalThis.Agasso;

function rngFrom(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }

function playMatch(seed, d0, d1, setsToWin, venue) {
  const rng = rngFrom(seed);
  const g = new A.Game({ playerId: 'remi', setsToWin: setsToWin || 1, rng, firstServer: seed % 2, venue });
  const ais = [new A.AI(0, d0, rng), new A.AI(1, d1, rng)];
  let steps = 0, rallies = [];
  while (g.phase !== 'done' && steps < 120 * 60 * 90) {
    g.step([ais[0].think(g, A.DT), ais[1].think(g, A.DT)]);
    for (const e of g.events) if (e.type === 'point') rallies.push(e.rally);
    g.events.length = 0; steps++;
  }
  return { g, steps, rallies };
}

if (require.main === module) {
  const n = +process.argv[2] || 40, d0 = process.argv[3] || 'normal', d1 = process.argv[4] || 'normal', venue = process.argv[5] || 'rg';
  let wins = [0, 0], tot = { aces: 0, doubleFaults: 0, winners: 0, errors: 0, points: 0 }, rl = [], dur = 0, unfinished = 0;
  for (let i = 0; i < n; i++) {
    const { g, steps, rallies } = playMatch(1000 + i * 7919, d0, d1, 1, venue);
    if (g.phase !== 'done') { unfinished++; continue; }
    wins[g.match.winner]++; dur += steps / 120; rl.push(...rallies);
    for (const s of g.stats) for (const k in tot) tot[k] += s[k];
  }
  const avg = rl.reduce((a, b) => a + b, 0) / rl.length;
  console.log(`[${venue}] ${d0} vs ${d1} — victoires [joueur, agasso] = ${wins}, inachevés = ${unfinished}`);
  console.log(`durée moyenne d'un set : ${(dur / n / 60).toFixed(1)} min, échange moyen : ${avg.toFixed(1)} frappes, max ${Math.max(...rl)}`);
  console.log('répartition des points :', Object.fromEntries(Object.entries(tot).map(([k, v]) => [k, k === 'points' ? v : (100 * v / tot.points).toFixed(1) + '%'])));
}
module.exports = { playMatch, rngFrom };
