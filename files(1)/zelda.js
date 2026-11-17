/* Thème « Hyrule » — décor, particules, HUD, sons.
   Tout est construit uniquement quand <html data-theme="zelda"> et retiré proprement sinon.
   Exposé : window.rgZelda.enter()  → cinématique « objet obtenu » puis bascule (appelé par « theme zelda »). */
(function () {
  var root = document.documentElement, body = document.body;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var on = false, nodes = [], undo = [], raf = 0, music = null;

  function T(fr, en) { return root.lang === 'en' ? en : fr; }
  function mk(tag, id, cls, html) {
    var e = document.createElement(tag);
    if (id) e.id = id;
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    body.appendChild(e); nodes.push(e); return e;
  }
  function listen(target, type, fn, opt) { target.addEventListener(type, fn, opt); undo.push(function () { target.removeEventListener(type, fn, opt); }); }

  /* ---------- Icônes ---------- */
  var OCARINA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.500 13.500c0-4 4.500-8 9.500-8 5.500 0 9.500 3 9.500 6.500s-3.500 6.500-8.500 6.500c-4 0-6.500-2-8.500-2-1.200 0-2-1-2-3z"/><circle cx="10" cy="11" r="1.300" fill="#06161b"/><circle cx="14" cy="11" r="1.300" fill="#06161b"/><circle cx="12" cy="14.500" r="1.300" fill="#06161b"/><circle cx="16.500" cy="14" r="1.100" fill="#06161b"/></svg>';

  /* ---------- Sons (synthèse, aucun fichier) ---------- */
  var ac = null;
  function ctx() {
    if (!ac) { var A = window.AudioContext || window.webkitAudioContext; if (A) ac = new A(); }
    if (ac && ac.state === 'suspended') ac.resume();
    return ac;
  }
  function tone(f, t0, d, type, vol) {
    var c = ctx(); if (!c) return;
    var o = c.createOscillator(), g = c.createGain(), t = c.currentTime + t0;
    o.type = type || 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol || .1, t + .015); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + d + .05);
  }
  var SFX = {
    item: function () { [392, 494, 587, 784, 988, 1175].forEach(function (f, i) { tone(f, i * .13, .6, 'sine', .09); tone(f * 2, i * .13, .3, 'triangle', .03); }); }
  };

  /* ---------- Dialogue ---------- */
  var dTimer, dType;
  function say(title, text, ms) {
    var d = document.getElementById('zl-dialog'); if (!d) return;
    clearTimeout(dTimer); clearInterval(dType);
    d.innerHTML = '<b></b><span></span>';
    d.firstChild.textContent = title;
    var span = d.lastChild, i = 0;
    d.classList.add('is-on');
    if (reduce) span.textContent = text;
    else dType = setInterval(function () { span.textContent = text.slice(0, ++i); if (i >= text.length) clearInterval(dType); }, 26);
    dTimer = setTimeout(function () { d.classList.remove('is-on'); }, ms || text.length * 26 + 2800);
  }

  /* ---------- Décor ---------- */
  function seeded(s) { return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function forest(r, base, min, max, step) {
    var d = 'M0 500V' + base;
    for (var x = -20; x < 1640; x += step) d += 'L' + (x + step / 2) + ' ' + (base - (min + r() * (max - min))).toFixed(0) + 'L' + (x + step) + ' ' + (base + 8);
    return d + 'V500Z';
  }
  function sceneHTML() {
    var r = seeded(7), i, stars = '';
    for (i = 0; i < 70; i++) {
      var s = r() < .15 ? 3 : 2;
      stars += '<i style="left:' + (r() * 100).toFixed(1) + '%;top:' + (r() * 62).toFixed(1) + '%;width:' + s + 'px;height:' + s + 'px;animation-delay:-' + (r() * 4).toFixed(1) + 's;animation-duration:' + (2.6 + r() * 3).toFixed(1) + 's"></i>';
    }
    var castle =
      '<g fill="#0a2e35"><rect x="1040" y="300" width="220" height="44"/><rect x="1130" y="196" width="40" height="148"/><path d="M1124 196L1150 140 1176 196z"/>' +
      '<rect x="1084" y="246" width="30" height="98"/><path d="M1080 246L1099 208 1118 246z"/><rect x="1186" y="236" width="30" height="108"/><path d="M1182 236L1201 196 1220 236z"/>' +
      '<rect x="1046" y="262" width="22" height="82"/><path d="M1042 262L1057 232 1072 262z"/><rect x="1232" y="268" width="22" height="76"/><path d="M1228 268L1243 238 1258 268z"/></g>' +
      '<g fill="#f0cf7a" opacity=".85"><rect x="1146" y="220" width="5" height="9"/><rect x="1096" y="266" width="4" height="8"/><rect x="1198" y="258" width="4" height="8"/><rect x="1055" y="284" width="3" height="7"/><rect x="1241" y="288" width="3" height="7"/></g>';
    var svg = function (inner) { return '<svg viewBox="0 0 1600 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + inner + '</svg>'; };
    var eye =
      '<svg class="zl-eye" viewBox="0 0 200 200" fill="none" stroke="#6cecff" stroke-width="1.4" aria-hidden="true">' +
      '<g class="zl-spin"><circle cx="100" cy="100" r="96"/><circle cx="100" cy="100" r="90" stroke-dasharray="2 6"/></g>' +
      '<g class="zl-spin zl-rev"><circle cx="100" cy="100" r="74" stroke-dasharray="14 5 3 5"/><path d="M100 20v12M100 168v12M20 100h12M168 100h12" stroke-width="2"/></g>' +
      '<path d="M36 100Q100 48 164 100Q100 152 36 100Z"/><circle cx="100" cy="100" r="17"/><circle cx="100" cy="100" r="6" fill="#6cecff"/>' +
      '<path d="M100 118v38M91 156h18M70 62Q100 40 130 62"/></svg>';
    return '<div class="zl-stars">' + stars + '</div><div class="zl-rays"></div><div class="zl-moon"></div>' + eye +
      '<div class="zl-tri" style="top:30vh;left:4vw"></div><div class="zl-tri" style="top:64vh;right:5vw;animation-delay:-3s"></div><div class="zl-tri" style="top:16vh;right:31vw;animation-delay:-5s;transform:scale(.7)"></div>' +
      '<div class="zl-l zl-l1">' + svg('<path fill="#0d3d46" d="M0 500V320L110 270 190 310 300 215 390 285 470 245 600 335 720 262 820 318 930 230 1030 322 1150 338 1270 320 1370 262 1480 312 1600 255V500Z"/>' + castle) + '</div>' +
      '<div class="zl-mist"></div>' +
      '<div class="zl-l zl-l2">' + svg('<path fill="#082830" d="M0 500V400Q180 330 380 385T760 360T1140 395T1600 350V500Z"/>') + '</div>' +
      '<div class="zl-mist b"></div>' +
      '<div class="zl-l zl-l3">' + svg('<path fill="#041419" d="' + forest(seeded(11), 440, 28, 92, 38) + '"/>') + '</div>';
  }

  /* ---------- Particules : lucioles, traînée, étincelles, étoiles filantes ---------- */
  function sprite(r, g, b) {
    var c = document.createElement('canvas'); c.width = c.height = 64;
    var x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.18, 'rgba(' + r + ',' + g + ',' + b + ',.9)');
    gr.addColorStop(.5, 'rgba(' + r + ',' + g + ',' + b + ',.25)'); gr.addColorStop(1, 'rgba(' + r + ',' + g + ',' + b + ',0)');
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return c;
  }
  function fx() {
    var cv = mk('canvas', 'zl-fx'), c = cv.getContext('2d'), W = 0, H = 0, dpr = 1;
    function size() {
      dpr = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + 'px'; cv.style.height = H + 'px'; c.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    size(); listen(window, 'resize', size);
    var SP = [sprite(255, 224, 130), sprite(120, 240, 255), sprite(190, 255, 170)];
    var ff = [], sp = [], i, n = W < 700 ? 16 : 38, star = null, nextStar = performance.now() + 3500;
    for (i = 0; i < n; i++) ff.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .25, vy: -.08 - Math.random() * .3, s: 10 + Math.random() * 22, ph: Math.random() * 6.28, k: Math.random() < .65 ? 0 : (Math.random() < .6 ? 1 : 2) });
    function burst(x, y, m) {
      for (var j = 0; j < m; j++) { var a = Math.random() * 6.283, v = .6 + Math.random() * 2.6; sp.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - .4, l: 0, m: 34 + Math.random() * 30, s: 8 + Math.random() * 12, k: j % 2 ? 0 : 1 }); }
    }
    listen(window, 'pointerdown', function (e) { burst(e.clientX, e.clientY, 14); });
    var lx = -99, ly = -99;
    listen(window, 'pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var dx = e.clientX - lx, dy = e.clientY - ly; if (dx * dx + dy * dy < 160) return;
      lx = e.clientX; ly = e.clientY;
      sp.push({ x: lx, y: ly, vx: (Math.random() - .5) * .6, vy: .2 + Math.random() * .5, l: 0, m: 26 + Math.random() * 16, s: 8 + Math.random() * 9, k: Math.random() < .6 ? 0 : 1 });
    });
    function frame(t) {
      if (!on) return;
      raf = requestAnimationFrame(frame);
      c.clearRect(0, 0, W, H); c.globalCompositeOperation = 'lighter';
      for (var j = 0; j < ff.length; j++) {
        var f = ff[j];
        f.x += f.vx + Math.sin(t * .0006 + f.ph) * .3; f.y += f.vy;
        if (f.y < -30) { f.y = H + 30; f.x = Math.random() * W; }
        c.globalAlpha = .3 + .7 * (Math.sin(t * .002 + f.ph) * .5 + .5);
        c.drawImage(SP[f.k], f.x - f.s / 2, f.y - f.s / 2, f.s, f.s);
      }
      for (j = sp.length - 1; j >= 0; j--) {
        var p = sp[j]; p.l++;
        if (p.l > p.m) { sp.splice(j, 1); continue; }
        p.x += p.vx; p.y += p.vy; p.vy += .03;
        c.globalAlpha = 1 - p.l / p.m;
        c.drawImage(SP[p.k], p.x - p.s / 2, p.y - p.s / 2, p.s, p.s);
      }
      if (!star && t > nextStar) star = { x: Math.random() * W * .8, y: Math.random() * H * .3, vx: 10 + Math.random() * 4, vy: 4 + Math.random() * 2, l: 0 };
      if (star) {
        var g = c.createLinearGradient(star.x, star.y, star.x - star.vx * 7, star.y - star.vy * 7);
        g.addColorStop(0, 'rgba(255,255,255,.95)'); g.addColorStop(1, 'rgba(255,255,255,0)');
        c.globalAlpha = 1 - star.l / 44; c.strokeStyle = g; c.lineWidth = 2;
        c.beginPath(); c.moveTo(star.x, star.y); c.lineTo(star.x - star.vx * 7, star.y - star.vy * 7); c.stroke();
        star.x += star.vx; star.y += star.vy;
        if (++star.l > 44) { star = null; nextStar = t + 8000 + Math.random() * 8000; }
      }
      c.globalAlpha = 1;
    }
    raf = requestAnimationFrame(frame);
  }

  /* ---------- Musique (assets/zelda.mp3) ---------- */
  function setMusic(want) {
    var btn = document.getElementById('zl-snd');
    if (want) {
      if (!music) { music = new Audio('assets/zelda.mp3'); music.loop = true; music.volume = .35; music.addEventListener('error', function () { setMusic(false); say('Ocarina', T('Fichier assets/zelda.mp3 introuvable.', 'File assets/zelda.mp3 not found.')); }); }
      var p = music.play(); if (p && p.catch) p.catch(function () { if (btn) { btn.classList.remove('is-on'); btn.setAttribute('aria-pressed', 'false'); } });
    } else if (music) music.pause();
    if (btn) { btn.classList.toggle('is-on', !!want); btn.setAttribute('aria-pressed', String(!!want)); }
    try { localStorage.setItem('rg_zmusic', want ? '1' : '0'); } catch (e) {}
  }

  /* ---------- Construction / démontage ---------- */
  function labels() {
    var q = function (id, a, v) { var e = document.getElementById(id); if (e) e.setAttribute(a, v); };
    q('zl-snd', 'aria-label', T('Musique d’Hyrule', 'Hyrule music')); q('zl-snd', 'title', T('Musique d’Hyrule', 'Hyrule music'));
  }

  function build() {
    on = true;
    var sc = mk('div', 'zl-scene', '', sceneHTML()); sc.setAttribute('aria-hidden', 'true'); if (document.querySelector('.home')) sc.className = 'is-home';
    var layers = Array.prototype.slice.call(sc.querySelectorAll('.zl-l'));
    mk('div', 'zl-frame', '', '<i class="a"></i><i class="b"></i><i class="c"></i><i class="d"></i>').setAttribute('aria-hidden', 'true');
    var prog = mk('div', 'zl-prog'); prog.setAttribute('aria-hidden', 'true');

    mk('button', 'zl-snd', '', OCARINA).setAttribute('type', 'button');
    mk('div', 'zl-dialog').setAttribute('role', 'status');
    labels();

    document.getElementById('zl-snd').addEventListener('click', function () { setMusic(!(music && !music.paused)); });

    // musique mémorisée : reprend au premier geste (les navigateurs bloquent l’autoplay)
    var wantMusic = false; try { wantMusic = localStorage.getItem('rg_zmusic') === '1'; } catch (e) {}
    if (wantMusic) {
      var resume = function () { setMusic(true); window.removeEventListener('pointerdown', resume); window.removeEventListener('keydown', resume); };
      listen(window, 'pointerdown', resume); listen(window, 'keydown', resume);
    }

    // défilement : barre dorée + parallaxe
    var tick = false;
    function onScroll() {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        tick = false;
        var s = window.scrollY || 0, mx = root.scrollHeight - innerHeight;
        prog.style.transform = 'scaleX(' + (mx > 0 ? Math.min(1, s / mx) : 0) + ')';
        if (!reduce) layers.forEach(function (l, i) { l.style.transform = 'translate3d(0,' + (-Math.min(s * [.02, .045, .08][i], 100)).toFixed(1) + 'px,0)'; });
      });
    }
    listen(window, 'scroll', onScroll, { passive: true }); onScroll();

    if (!reduce) fx();
  }

  function teardown() {
    on = false; cancelAnimationFrame(raf);
    nodes.forEach(function (n) { if (n.parentNode) n.parentNode.removeChild(n); }); nodes = [];
    undo.forEach(function (f) { f(); }); undo = [];
    clearTimeout(dTimer); clearInterval(dType);
    if (music) music.pause();
  }

  function sync() {
    var z = root.getAttribute('data-theme') === 'zelda';
    if (z && !on) build(); else if (!z && on) teardown();
  }
  document.addEventListener('themechange', sync);
  document.addEventListener('langchange', function () { if (on) labels(); });
  sync();

  /* ---------- Cinématique d’activation ---------- */
  window.rgZelda = {
    enter: function () {
      var done = function () {
        say(T('Objet obtenu', 'Item get'), T('Vous avez obtenu le Thème d’Hyrule ! Il est dangereux d’y aller seul… prenez ce portfolio !', 'You got the Hyrule Theme! It’s dangerous to go alone… take this portfolio!'), 6500);
      };
      SFX.item();
      if (reduce) { window.rgSetTheme('zelda'); return done(); }
      var f = document.createElement('div');
      f.id = 'zl-flash'; f.innerHTML = '<i class="zl-fr"></i><i class="zl-ft"></i>'; body.appendChild(f);
      setTimeout(function () { window.rgSetTheme('zelda'); }, 850);
      setTimeout(function () { if (f.parentNode) f.parentNode.removeChild(f); done(); }, 1900);
    }
  };
})();
