// Équilibrage : fait jouer des matchs IA contre IA et affiche les statistiques.
// usage : node tools/simulate.js <joueurA> <joueurB> [matchs] [terrain] [difficulté]
//         node tools/simulate.js --ligue [terrain]     (tout le monde contre tout le monde)
const A = require('./load.js');

function playMatch(seed, opts) {
  const o = opts || {}, rng = A.rngFrom(seed), diff = o.difficulty || ['normal', 'normal'];
  const g = new A.Game({ players: o.players || ['remi', 'agasso'], setsToWin: o.setsToWin || 1, gamesToSet: o.gamesToSet || 6, rng, firstServer: seed % 2, venue: o.venue });
  const ais = [new A.AI(0, diff[0], rng), new A.AI(1, diff[1], rng)], rallies = [];
  let steps = 0;
  while (g.phase !== 'done' && steps < 120 * 60 * 90) {
    g.step([ais[0].think(g, A.DT), ais[1].think(g, A.DT)]);
    for (const e of g.events) if (e.type === 'point') rallies.push(e.rally);
    g.events.length = 0; steps++;
  }
  return { g, steps, rallies };
}

function series(a, b, n, venue, difficulty) {
  const wins = [0, 0], rl = []; let dur = 0;
  for (let i = 0; i < n; i++) {
    const { g, steps, rallies } = playMatch(1000 + i * 7919, { players: [a, b], venue, difficulty: [difficulty, difficulty] });
    if (g.phase === 'done') wins[g.match.winner]++;
    dur += steps / 120; rl.push(...rallies);
  }
  return { wins, avgRally: rl.reduce((x, y) => x + y, 0) / rl.length, minutes: dur / n / 60 };
}

if (require.main === module) {
  const arg = process.argv.slice(2);
  if (arg[0] === '--ligue') {
    const ids = A.Players.ids(), venue = arg[1] || 'roland-garros', n = +arg[2] || 2, score = Object.fromEntries(ids.map((i) => [i, 0]));
    for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) { const s = series(ids[i], ids[j], n, venue, 'normal'); score[ids[i]] += s.wins[0]; score[ids[j]] += s.wins[1]; }
    const tot = (ids.length - 1) * n;
    console.log(`Ligue sur ${venue} (${n} set(s) par duel) :`);
    for (const [id, w] of Object.entries(score).sort((x, y) => y[1] - x[1])) console.log(`  ${id.padEnd(12)} ${String(Math.round((100 * w) / tot)).padStart(3)} %  (note ${A.Players.rating(A.Players.profile(id), A.Venues.get(venue)).toFixed(1)})`);
  } else {
    const [a = 'remi', b = 'agasso', n = 20, venue = 'roland-garros', d = 'normal'] = arg, s = series(a, b, +n, venue, d);
    console.log(`[${venue}] ${a} ${s.wins[0]} – ${s.wins[1]} ${b} · échange moyen ${s.avgRally.toFixed(1)} frappes · ${s.minutes.toFixed(1)} min/set`);
  }
}
module.exports = { playMatch, series };
