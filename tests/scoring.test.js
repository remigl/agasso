const test = require('node:test');
const assert = require('node:assert');
require('../tools/load.js');
const S = globalThis.Agasso.Scoring;
const win = (m, who, n) => { let ev = []; for (let i = 0; i < n; i++) ev = S.pointWon(m, who); return ev; };

test('un jeu : 15, 30, 40, jeu — et le service change de camp', () => {
  const m = S.createMatch();
  S.pointWon(m, 0); assert.deepStrictEqual(S.pointLabels(m), ['15', '0']);
  S.pointWon(m, 0); S.pointWon(m, 0); assert.deepStrictEqual(S.pointLabels(m), ['40', '0']);
  assert.deepStrictEqual(S.pointWon(m, 0), ['game']);
  assert.deepStrictEqual(m.games, [1, 0]);
  assert.strictEqual(m.server, 1);
});

test('égalité et avantage', () => {
  const m = S.createMatch();
  win(m, 0, 3); win(m, 1, 3);
  assert.deepStrictEqual(S.pointLabels(m), ['40', '40']);
  assert.strictEqual(S.announce(m, ['Remi', 'Agasso']), 'Égalité');
  S.pointWon(m, 1); assert.deepStrictEqual(S.pointLabels(m), ['', 'AV']);
  S.pointWon(m, 0); assert.deepStrictEqual(S.pointLabels(m), ['40', '40']);
  win(m, 0, 2); assert.deepStrictEqual(m.games, [1, 0]);
});

test('set 6-4, puis match au meilleur des 3 sets', () => {
  const m = S.createMatch({ setsToWin: 2 });
  for (let g = 0; g < 4; g++) win(m, 1, 4);
  for (let g = 0; g < 5; g++) win(m, 0, 4);
  assert.deepStrictEqual(win(m, 0, 4), ['game', 'set']);
  assert.deepStrictEqual(m.sets[0].games, [6, 4]);
  for (let g = 0; g < 5; g++) win(m, 0, 4);
  assert.deepStrictEqual(win(m, 0, 4), ['game', 'set', 'match']);
  assert.strictEqual(m.over, true); assert.strictEqual(m.winner, 0);
  assert.deepStrictEqual(S.pointWon(m, 1), []);
});

test('tie-break à 6-6 : 7 points, 2 d’écart, rotation du service', () => {
  const m = S.createMatch({ setsToWin: 2 });
  for (let g = 0; g < 5; g++) { win(m, 0, 4); win(m, 1, 4); }
  win(m, 0, 4);
  assert.deepStrictEqual(win(m, 1, 4), ['game', 'tiebreak']);
  assert.strictEqual(m.tiebreak, true);
  const first = m.tbFirstServer, order = [];
  for (let i = 0; i < 6; i++) { order.push(S.currentServer(m)); S.pointWon(m, i % 2); }
  assert.deepStrictEqual(order, [first, 1 - first, 1 - first, first, first, 1 - first]);
  win(m, 0, 3); // 6-3
  assert.strictEqual(S.pointStakes(m, 0), 'set');
  assert.deepStrictEqual(S.pointWon(m, 0), ['game', 'set']);
  assert.deepStrictEqual(m.sets[0], { games: [7, 6], tb: [7, 3] });
  assert.strictEqual(m.server, 1 - first);
});

test('super tie-break à 10 points au set décisif', () => {
  const m = S.createMatch({ setsToWin: 1 });
  for (let g = 0; g < 6; g++) { win(m, 0, 4); win(m, 1, 4); }
  assert.strictEqual(m.tiebreak, true);
  win(m, 0, 9); assert.strictEqual(m.over, false);
  assert.deepStrictEqual(S.pointWon(m, 0), ['game', 'set', 'match']);
});

test('format express : set en 4 jeux', () => {
  const m = S.createMatch({ setsToWin: 1, gamesToSet: 4 });
  for (let g = 0; g < 3; g++) win(m, 0, 4);
  assert.deepStrictEqual(win(m, 0, 4), ['game', 'set', 'match']);
});

test('annonces de l’arbitre : score du serveur en premier', () => {
  const m = S.createMatch({ firstServer: 1 });
  S.pointWon(m, 0);
  assert.strictEqual(S.announce(m, ['Remi', 'Agasso']), 'Zéro – quinze');
  S.pointWon(m, 1);
  assert.strictEqual(S.announce(m, ['Remi', 'Agasso']), 'Quinze A');
});
