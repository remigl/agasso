// Entrées clavier + manette, fusionnées dans une seule structure.
(function (root) {
  const A = (root.Agasso = root.Agasso || {});
  const down = new Set(), edges = new Set();
  const MAP = {
    up: ['ArrowUp', 'KeyW'], down: ['ArrowDown', 'KeyS'], left: ['ArrowLeft', 'KeyA'], right: ['ArrowRight', 'KeyD'],
    hit: ['Space', 'KeyJ', 'KeyX'], lob: ['KeyK', 'KeyC'], drop: ['KeyL', 'KeyV'],
    pause: ['Escape', 'KeyP'], ok: ['Enter', 'NumpadEnter'],
  };
  const GAME_KEYS = new Set([].concat(...Object.values(MAP)));
  let padPrev = {}, lastDevice = 'clavier';

  function attach() {
    window.addEventListener('keydown', (e) => {
      if (GAME_KEYS.has(e.code) && e.code !== 'Enter' && e.code !== 'NumpadEnter') e.preventDefault();
      if (!e.repeat) { down.add(e.code); edges.add(e.code); lastDevice = 'clavier'; }
    });
    window.addEventListener('keyup', (e) => down.delete(e.code));
    window.addEventListener('blur', () => down.clear());
  }
  const held = (n) => MAP[n].some((c) => down.has(c));
  const pressed = (n) => MAP[n].some((c) => edges.has(c));

  // À appeler une fois par image. Les champs *Edge ne sont vrais que l'image de l'appui.
  function poll() {
    const o = { mx: 0, my: 0, hit: false, lob: false, drop: false, pause: false, ok: false, navX: 0, navY: 0, analog: false };
    o.mx = (held('right') ? 1 : 0) - (held('left') ? 1 : 0);
    o.my = (held('down') ? 1 : 0) - (held('up') ? 1 : 0);
    o.hit = pressed('hit'); o.lob = pressed('lob'); o.drop = pressed('drop'); o.pause = pressed('pause'); // Entrée active nativement le bouton focalisé
    o.navX = (pressed('right') ? 1 : 0) - (pressed('left') ? 1 : 0);
    o.navY = (pressed('down') ? 1 : 0) - (pressed('up') ? 1 : 0);
    edges.clear();

    const pads = navigator.getGamepads ? navigator.getGamepads() : [];
    for (const gp of pads) {
      if (!gp || !gp.connected) continue;
      const B = (i) => !!(gp.buttons[i] && gp.buttons[i].pressed);
      const now = { a: B(0), b: B(1), x: B(2), y: B(3), start: B(9), u: B(12), d: B(13), l: B(14), r: B(15) };
      let ax = gp.axes[0] || 0, ay = gp.axes[1] || 0;
      if (Math.hypot(ax, ay) < 0.22) ax = ay = 0;
      now.sl = ax < -0.6; now.sr = ax > 0.6; now.su = ay < -0.6; now.sd = ay > 0.6;
      const edge = (k) => now[k] && !padPrev[k];
      if (ax || ay) { o.mx = ax; o.my = ay; o.analog = true; lastDevice = 'manette'; }
      if (now.l || now.r || now.u || now.d) { o.mx = (now.r ? 1 : 0) - (now.l ? 1 : 0); o.my = (now.d ? 1 : 0) - (now.u ? 1 : 0); }
      if (edge('a')) { o.hit = true; o.ok = true; lastDevice = 'manette'; }
      if (edge('b') || edge('y')) o.lob = true;
      if (edge('x')) o.drop = true;
      if (edge('start')) o.pause = true;
      o.navX += (edge('r') || edge('sr') ? 1 : 0) - (edge('l') || edge('sl') ? 1 : 0);
      o.navY += (edge('d') || edge('sd') ? 1 : 0) - (edge('u') || edge('su') ? 1 : 0);
      padPrev = now;
      break;
    }
    return o;
  }

  A.Input = { attach, poll, device: () => lastDevice };
})(typeof window !== 'undefined' ? window : globalThis);
