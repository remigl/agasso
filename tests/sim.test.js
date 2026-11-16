const test = require('node:test');
const assert = require('node:assert');
const A = require('../tools/load.js');
const { playMatch } = require('../tools/simulate.js');
const idle = A.EMPTY_INPUT, press = Object.assign({}, A.EMPTY_INPUT, { hit: true });

test('contenu : chaque fiche joueur est complète et référence un archétype et une célébration existants', () => {
  const ids = A.Players.ids();
  assert.ok(ids.length >= 24);
  for (const id of ids) {
    const p = A.Players.profile(id), d = p.def;
    assert.ok(d.name && d.gender && d.look && d.style, id);
    for (const [k] of A.STATS) assert.ok(p.stats[k] >= 1 && p.stats[k] <= 10, id + '.' + k);
    assert.ok(A.get('archetype', d.archetype), id + ' archétype');
    assert.ok(A.get('celebration', d.celebration), id + ' célébration');
    assert.ok(p.tech.forehand.pace > 0 && p.ai.depth >= 0);
  }
  for (const t of A.all('tournament')) assert.ok(A.get('venue', t.venue) && t.rounds.length === Math.log2(t.drawSize));
  for (const v of A.all('venue')) assert.ok(v.physics.rest > 0 && v.look.court);
  assert.ok(A.all('music').some((m) => m.role === 'menu') && A.all('music').some((m) => m.role === 'victory'));
});

test('les personnages originaux gardent des statistiques identiques entre eux', () => {
  const venue = A.get('venue', 'roland-garros'), ref = JSON.stringify(A.Players.attrs(A.Players.profile('eric'), venue));
  for (const id of ['remi', 'corinne', 'agasso']) assert.strictEqual(JSON.stringify(A.Players.attrs(A.Players.profile(id), venue)), ref);
});

test('statistiques 1–10 : effet réel mais borné sur les attributs', () => {
  const venue = A.get('venue', 'roland-garros'), base = A.Players.attrs(A.Players.profile('eric'), venue);
  const lendl = A.Players.attrs(A.Players.profile('lendl'), venue), sanchez = A.Players.attrs(A.Players.profile('sanchez'), venue);
  assert.ok(lendl.flat > base.flat && lendl.flat < base.flat * 1.08, 'force');
  assert.ok(sanchez.speed > base.speed && sanchez.speed < base.speed * 1.08, 'rapidité');
  assert.ok(sanchez.defense < base.defense && lendl.serve1 > base.serve1);
  const nadal = A.Players.profile('nadal');
  assert.ok(A.Players.attrs(nadal, venue).control < A.Players.attrs(nadal, A.get('venue', 'wimbledon')).control, 'affinité terre battue');
});

test('signature : la technique du joueur change réellement la balle frappée', () => {
  const shot = (id, side) => {
    const g = new A.Game({ players: [id, 'agasso'], rng: A.rngFrom(3) }), p = g.players[0], b = g.ball;
    Object.assign(b, { held: false, live: true, x: p.x + side * p.profile.hand * 0.9, y: p.y, z: 1, vx: 0, vy: 2, vz: 0, bounces: 1, lastHitter: 1, inServe: false });
    g.phase = 'rally';
    return A.Shots.rally(g, p, { kind: 'flat', t: 0.12 }, 0.9);
  };
  assert.ok(shot('nadal', 1).spin > 0.8, 'coup droit lifté');
  assert.strictEqual(shot('graf', -1).kind, 'slice', 'revers naturellement slicé');
  assert.strictEqual(shot('graf', 1).kind, 'flat');
  assert.ok(shot('graf', 1).speed > shot('eric', 1).speed, 'coup droit plus lourd');
  assert.strictEqual(new A.Game({ players: ['mcenroe', 'eric'] }).players[0].profile.hand, -1, 'gaucher');
});

test('mise en jeu : serveur à droite, receveur en diagonale', () => {
  const g = new A.Game({ players: ['eric', 'agasso'] });
  assert.strictEqual(g.phase, 'ready'); assert.strictEqual(g.server, 0);
  assert.ok(g.players[0].x > 0 && g.players[0].y > A.COURT.halfL);
  assert.ok(g.players[1].x < 0 && g.players[1].y < -A.COURT.halfL);
  assert.strictEqual(g.boxSign, -1);
});

test('un service bien dosé retombe dans le bon carré', () => {
  let good = 0;
  for (let s = 1; s <= 40; s++) {
    const g = new A.Game({ players: ['eric', 'agasso'], rng: A.rngFrom(s) });
    for (let i = 0; i < 70; i++) g.step([idle, idle]);
    g.step([press, idle]); assert.strictEqual(g.phase, 'toss');
    while (g.tossT < 0.65) g.step([idle, idle]);
    g.step([press, idle]); assert.strictEqual(g.phase, 'rally');
    const L = g.landing();
    if (L.x < 0 && L.x > -A.COURT.halfW && L.y < 0 && L.y > -A.COURT.service) good++;
  }
  assert.ok(good >= 36, 'services bons : ' + good + '/40');
});

test('lancer non frappé : la balle est rattrapée, sans faute', () => {
  const g = new A.Game({ players: ['eric', 'agasso'], rng: A.rngFrom(3) });
  for (let i = 0; i < 70; i++) g.step([idle, idle]);
  g.step([press, idle]);
  for (let i = 0; i < 200; i++) g.step([idle, idle]);
  assert.strictEqual(g.phase, 'ready'); assert.strictEqual(g.serveNo, 1);
});

test('terrains : le gazon rebondit plus bas et plus vite que la terre ; l’effet module le rebond', () => {
  const rg = A.get('venue', 'roland-garros'), wim = A.get('venue', 'wimbledon');
  assert.ok(wim.physics.rest < rg.physics.rest && wim.physics.keep > rg.physics.keep);
  assert.ok(A.Physics.bounce(rg, 0.9).rest > A.Physics.bounce(rg, 0).rest && A.Physics.bounce(rg, -0.8).rest < A.Physics.bounce(rg, 0).rest);
});

test('un match IA contre IA va au bout, sur chaque terrain, avec un score cohérent', () => {
  for (const venue of ['roland-garros', 'wimbledon']) {
    const { g, rallies } = playMatch(4242, { players: ['federer', 'evert'], venue });
    assert.strictEqual(g.phase, 'done');
    const s = g.match.sets[0].games, w = g.match.winner;
    assert.ok(s[w] >= 6 && s[w] > s[1 - w]);
    assert.strictEqual(g.stats[0].points + g.stats[1].points, rallies.length);
    assert.ok(rallies.some((r) => r >= 4), 'il y a de vrais échanges');
  }
});

test('IA équilibrée : à joueurs identiques aucun camp n’est favorisé, et la difficulté compte', () => {
  const even = [0, 0]; let hard = 0;
  for (let i = 0; i < 16; i++) even[playMatch(100 + i * 31, { players: ['remi', 'agasso'] }).g.match.winner]++;
  for (let i = 0; i < 6; i++) hard += playMatch(500 + i * 17, { players: ['remi', 'agasso'], difficulty: ['facile', 'difficile'] }).g.match.winner;
  assert.ok(even[0] >= 3 && even[1] >= 3, 'normal contre normal : ' + even);
  assert.ok(hard >= 5, 'difficile bat facile : ' + hard + '/6');
});

test('les statistiques ne décident pas tout : un personnage original peut battre une légende', () => {
  let wins = 0;
  for (let i = 0; i < 14; i++) if (playMatch(900 + i * 53, { players: ['eric', 'federer'], gamesToSet: 4 }).g.match.winner === 0) wins++;
  assert.ok(wins >= 1 && wins <= 12, 'victoires d’Eric : ' + wins + '/14');
});
