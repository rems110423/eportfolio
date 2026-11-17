/* Bascule FR / EN — commune à toutes les pages.
   Le français est le texte présent dans le HTML ; l'anglais vient de PAGE_I18N (par page) + COMMON (menu, pied de page). */
(function () {
  var COMMON = {
    nav_home: '<span>00</span>Home',
    nav_about: '<span>01</span>About me',
    nav_pro: '<span>02</span>Pro profile',
    nav_exp: '<span>03</span>Experience',
    nav_real: '<span>04</span>Projects',
    nav_path: '<span>05</span>Background',
    nav_bilan: '<span>06</span>Year 1 review',
    nav_legal: '<span>07</span>Legal',
    footer_copy: '© Rémi Gautier — 3<sup>rd</sup>-year BUT R&amp;T student'
  };
  var page = (window.PAGE_I18N && window.PAGE_I18N.en) || {};
  var en = {}, k;
  for (k in COMMON) en[k] = COMMON[k];
  for (k in page) en[k] = page[k];

  var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-key]'));
  var phs = Array.prototype.slice.call(document.querySelectorAll('[data-key-ph]'));
  var frTitle = document.title;
  nodes.forEach(function (el) { el._fr = el.innerHTML; });
  phs.forEach(function (el) { el._frPh = el.getAttribute('placeholder'); });

  var sel = document.getElementById('language-select');

  function apply(lang) {
    var isEn = lang === 'en';
    nodes.forEach(function (el) {
      var v = en[el.getAttribute('data-key')];
      el.innerHTML = (isEn && v !== undefined) ? v : el._fr;
    });
    phs.forEach(function (el) {
      var v = en[el.getAttribute('data-key-ph')];
      el.setAttribute('placeholder', (isEn && v !== undefined) ? v : el._frPh);
    });
    document.title = (isEn && en._title) ? en._title : frTitle;
    document.documentElement.lang = isEn ? 'en' : 'fr';
    if (sel) sel.value = isEn ? 'en' : 'fr';
    var code = isEn ? 'en' : 'fr';
    try { localStorage.setItem('rg_lang', code); } catch (e) {}
    try {
      var parts = (window.name || '').split('&').filter(function (p) { return p && p.indexOf('rg_lang=') !== 0; });
      parts.push('rg_lang=' + code);
      window.name = parts.join('&');
    } catch (e) {}
    tagLinks(code);
    document.dispatchEvent(new Event('langchange'));
  }

  // La langue suit le visiteur de page en page : ?lang= dans les liens internes,
  // en plus de localStorage et window.name (utiles si l'un des deux est bloqué).
  function tagLinks(code) {
    var theme = document.documentElement.getAttribute('data-theme') || 'dark';
    Array.prototype.slice.call(document.querySelectorAll('a[href]')).forEach(function (a) {
      var h = a.getAttribute('href');
      if (!/^[\w-]+\.html(\?[^#]*)?(#.*)?$/.test(h)) return;
      var hash = '', i = h.indexOf('#');
      if (i !== -1) { hash = h.slice(i); h = h.slice(0, i); }
      h = h.replace(/\?.*$/, '');
      a.setAttribute('href', h + '?lang=' + code + '&theme=' + theme + hash);
    });
  }

  function initialLang() {
    var m = /[?&]lang=(fr|en)\b/.exec(location.search);
    if (m) return m[1];
    try { var v = localStorage.getItem('rg_lang'); if (v === 'fr' || v === 'en') return v; } catch (e) {}
    var w = /(?:^|&)rg_lang=(fr|en)(?:&|$)/.exec(window.name || '');
    return w ? w[1] : 'fr';
  }

  var saved = initialLang();
  if (sel) sel.addEventListener('change', function () { apply(sel.value); });
  apply(saved);
  document.addEventListener('themechange', function () { tagLinks(document.documentElement.lang === 'en' ? 'en' : 'fr'); });
})();
