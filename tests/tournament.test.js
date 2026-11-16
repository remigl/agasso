const test = require('node:test');
const assert = require('node:assert');
const A = require('../tools/load.js');
const T = A.Tournament;

test('tirage : 16 joueurs distincts, têtes de série 1 et 2 dans des moitiés opposées', () => {
  const st = T.create('roland-garros', 'corinne', A.rngFrom(11));
  const all = st.rounds[0].flatMap((m) => [m.a, m.b]);
  assert.strictEqual(new Set(all).size, 16); assert.ok(all.includes('corinne'));
  const pos = (seed) => all.findIndex((id) => st.seeds[id] === seed);
  assert.ok(pos(1) < 8 !== pos(2) < 8);
  assert.deepStrictEqual(T.seedOrder(8), [1, 8, 4, 5, 2, 7, 3, 6]);
});

test('parcours complet : quatre victoires mènent au titre', () => {
  const rng = A.rngFrom(5), st = T.create('roland-garros', 'remi', rng), seen = [];
  while (st.status === 'active') { const c = T.current(st); seen.push(c.roundName); assert.ok(c.format.setsToWin >= 1); T.report(st, true, '4-2', rng); }
  assert.deepStrictEqual(seen, ['Huitièmes de finale', 'Quarts de finale', 'Demi-finales', 'Finale']);
  assert.strictEqual(st.status, 'champion'); assert.strictEqual(T.champion(st), 'remi');
  assert.deepStrictEqual(st.rounds.map((r) => r.length), [8, 4, 2, 1]);
});

test('défaite : le joueur est éliminé et le tableau se termine sans lui', () => {
  const rng = A.rngFrom(8), st = T.create('wimbledon', 'eric', rng);
  T.report(st, true, '4-1', rng); T.report(st, false, '2-4', rng);
  assert.strictEqual(st.status, 'out'); assert.strictEqual(T.current(st), null);
  assert.ok(T.champion(st) && T.champion(st) !== 'eric');
  for (const r of st.rounds) for (const m of r) assert.ok(m.w === m.a || m.w === m.b);
});

test('l’état du tournoi est sérialisable (sauvegarde) et reprend à l’identique', () => {
  const rng = A.rngFrom(2), st = T.create('roland-garros', 'corinne', rng);
  T.report(st, true, '4-0', rng);
  const copy = JSON.parse(JSON.stringify(st));
  assert.deepStrictEqual(T.current(copy), T.current(st));
});

test('matchs simulés : le mieux noté gagne plus souvent, sans gagner toujours', () => {
  const rng = A.rngFrom(1), venue = A.Venues.get('roland-garros'); let w = 0;
  for (let i = 0; i < 400; i++) if (T.quickSim('nadal', 'eric', venue, A.FORMATS.set1, rng).winner === 'nadal') w++;
  assert.ok(w > 240 && w < 395, 'victoires de Nadal : ' + w + '/400');
});
