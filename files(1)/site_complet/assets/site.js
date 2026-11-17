/* Rémi Gautier — ePortfolio : scripts partagés */
(function () {
  // Menu mobile
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.topnav');
  function label() {
    var open = nav.classList.contains('is-open');
    var en = document.documentElement.lang === 'en';
    toggle.textContent = open ? (en ? 'Close' : 'Fermer') : 'Menu';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      label();
    });
    document.addEventListener('langchange', label);
  }


  // Thème : sombre (défaut) · clair — mémorisé d'une page à l'autre
  var THEMES = [
    { id: 'dark',  fr: 'Sombre', en: 'Dark',  icon: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>' },
    { id: 'light', fr: 'Clair',  en: 'Light', icon: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/>' }
  ];
  var current = document.documentElement.getAttribute('data-theme') || 'dark';
  var group = document.createElement('div');
  group.className = 'theme-switch';
  group.setAttribute('role', 'group');
  var buttons = THEMES.map(function (t) {
    var b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true">' + t.icon + '</svg>';
    b.addEventListener('click', function () { setTheme(t.id, true); });
    group.appendChild(b);
    return b;
  });
  function labels() {
    var en = document.documentElement.lang === 'en';
    group.setAttribute('aria-label', en ? 'Theme' : 'Thème');
    THEMES.forEach(function (t, i) {
      var name = en ? t.en : t.fr;
      buttons[i].setAttribute('aria-label', name);
      buttons[i].title = name;
    });
  }
  function setTheme(id, save) {
    current = id;
    if (id === 'dark') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', id);
    THEMES.forEach(function (t, i) { buttons[i].setAttribute('aria-pressed', String(t.id === id)); });
    if (save) {
      try { localStorage.setItem('rg_theme', id); } catch (e) {}
      try {
        var parts = (window.name || '').split('&').filter(function (p) { return p && p.indexOf('rg_theme=') !== 0; });
        parts.push('rg_theme=' + id);
        window.name = parts.join('&');
      } catch (e) {}
    }
    document.dispatchEvent(new Event('themechange'));
    syncGlitch();
  }

  // Cyberpunk : petits « bugs » aléatoires sur le texte (désactivés hors thème cyber)
  var glitchTimer = null;
  var GL = '▓▒░█▌▐╳#@$%&01<>/';
  function glitchOnce() {
    var els = document.querySelectorAll('h1, h2, .switch__label, .brand, .chip, .page-hero__lead, .big, .quote');
    if (!els.length) return;
    var el = els[Math.floor(Math.random() * els.length)];
    var r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), nodes = [], n;
    while ((n = w.nextNode())) { if (n.data.trim().length > 2) nodes.push(n); }
    if (!nodes.length) return;
    var node = nodes[Math.floor(Math.random() * nodes.length)], orig = node.data, bad = '', i;
    for (i = 0; i < orig.length; i++) {
      bad += (orig.charAt(i) !== ' ' && Math.random() < 0.35) ? GL.charAt(Math.floor(Math.random() * GL.length)) : orig.charAt(i);
    }
    node.data = bad;
    setTimeout(function () { if (node.data === bad) node.data = orig; }, 110 + Math.random() * 160);
  }
  function glitchLoop() {
    glitchOnce();
    glitchTimer = setTimeout(glitchLoop, 1400 + Math.random() * 2800);
  }
  function syncGlitch() {
    var on = current === 'cyber' && !(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    if (on && !glitchTimer) glitchTimer = setTimeout(glitchLoop, 1800);
    if (!on && glitchTimer) { clearTimeout(glitchTimer); glitchTimer = null; }
  }
  window.rgSetTheme = function (id) { setTheme(id, true); };

  var langSel = document.getElementById('language-select');
  if (langSel && langSel.parentNode) langSel.parentNode.insertBefore(group, langSel);
  setTheme(current, false);
  labels();
  document.addEventListener('langchange', labels);

  // Apparitions au défilement
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

})();
