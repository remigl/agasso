const test = require('node:test');
const assert = require('node:assert');
const { playMatch, rngFrom } = require('../tools/simulate.js');
const A = globalThis.Agasso;

test('les 4 joueurs partagent exactement les mêmes statistiques', () => {
  const ids = Object.keys(A.PLAYERS);
  assert.deepStrictEqual(ids.sort(), ['agasso', 'corinne', 'eric', 'remi']);
  for (const id of ids) assert.strictEqual(A.PLAYERS[id].stats, A.STATS);
  assert.ok(Object.isFrozen(A.STATS));
  assert.deepStrictEqual(A.SELECTABLE.slice().sort(), ['corinne', 'eric', 'remi']);
});

test('la difficulté ne modifie que le cerveau de l’IA, pas les stats', () => {
  for (const d of Object.values(A.DIFFICULTY)) for (const k of Object.keys(d)) assert.ok(!(k in A.STATS), k);
});

test('mise en jeu : serveur à droite, receveur en diagonale', () => {
  const g = new A.Game({ playerId: 'eric' });
  assert.strictEqual(g.phase, 'ready'); assert.strictEqual(g.server, 0);
  assert.ok(g.players[0].x > 0 && g.players[0].y > A.COURT.halfL);
  assert.ok(g.players[1].x < 0 && g.players[1].y < -A.COURT.halfL);
  assert.strictEqual(g.boxSign, -1);
});

test('un service bien dosé retombe dans le bon carré', () => {
  let good = 0;
  for (let s = 1; s <= 40; s++) {
    const g = new A.Game({ rng: rngFrom(s) });
    const press = { mx: 0, my: 0, hit: true, lob: false, drop: false, aimX: 0, aimDepth: 0 };
    for (let i = 0; i < 70; i++) g.step([A.EMPTY_INPUT, A.EMPTY_INPUT]);
    g.step([press, A.EMPTY_INPUT]); assert.strictEqual(g.phase, 'toss');
    while (g.tossT < 0.65) g.step([A.EMPTY_INPUT, A.EMPTY_INPUT]);
    g.step([press, A.EMPTY_INPUT]); assert.strictEqual(g.phase, 'rally');
    const L = g.landing();
    if (L.x < 0 && L.x > -A.COURT.halfW && L.y < 0 && L.y > -A.COURT.service) good++;
  }
  assert.ok(good >= 36, 'services bons : ' + good + '/40');
});

test('lancer non frappé : la balle est rattrapée, sans faute', () => {
  const g = new A.Game({ rng: rngFrom(3) });
  const press = { mx: 0, my: 0, hit: true, lob: false, drop: false, aimX: 0, aimDepth: 0 };
  for (let i = 0; i < 70; i++) g.step([A.EMPTY_INPUT, A.EMPTY_INPUT]);
  g.step([press, A.EMPTY_INPUT]);
  for (let i = 0; i < 200; i++) g.step([A.EMPTY_INPUT, A.EMPTY_INPUT]);
  assert.strictEqual(g.phase, 'ready'); assert.strictEqual(g.serveNo, 1);
});

test('un match IA contre IA se termine avec un score cohérent', () => {
  const { g, rallies } = playMatch(4242, 'normal', 'normal', 1);
  assert.strictEqual(g.phase, 'done');
  const s = g.match.sets[0].games, w = g.match.winner;
  assert.ok(s[w] >= 6 && s[w] > s[1 - w]);
  assert.strictEqual(g.stats[0].points + g.stats[1].points, rallies.length);
  assert.ok(rallies.some((r) => r >= 4), 'il y a de vrais échanges');
});

test('IA équilibrée : à niveau égal aucun camp n’est favorisé, et la difficulté compte', () => {
  let even = [0, 0], hard = 0;
  for (let i = 0; i < 16; i++) even[playMatch(100 + i * 31, 'normal', 'normal', 1).g.match.winner]++;
  for (let i = 0; i < 6; i++) hard += playMatch(500 + i * 17, 'facile', 'difficile', 1).g.match.winner;
  assert.ok(even[0] >= 3 && even[1] >= 3, 'normal vs normal : ' + even);
  assert.ok(hard >= 5, 'difficile bat facile : ' + hard + '/6');
});

test('deux tournois : mêmes stats, mais le gazon rebondit plus bas et plus vite que la terre', () => {
  const { rg, wim } = A.VENUES;
  assert.ok(wim.rest < rg.rest && wim.keep > rg.keep);
  const drop = (venue) => {
    const g = new A.Game({ venue, rng: rngFrom(1) }), b = g.ball;
    Object.assign(b, { held: false, live: false, x: 0, y: 5, z: 2, vx: 0, vy: 10, vz: 0 });
    while (b.vz <= 0) g.stepBall(A.DT);
    return { vy: b.vy, vz: b.vz };
  };
  const clay = drop('rg'), grass = drop('wim');
  assert.ok(grass.vy > clay.vy && grass.vz < clay.vz);
  for (const id of ['rg', 'wim']) assert.strictEqual(new A.Game({ venue: id }).players[1].stats, A.STATS);
});

test('un match IA contre IA va au bout à Wimbledon', () => {
  const { g } = playMatch(777, 'normal', 'normal', 1, 'wim');
  assert.strictEqual(g.phase, 'done'); assert.strictEqual(g.venue.id, 'wim');
});
