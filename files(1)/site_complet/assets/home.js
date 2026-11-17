/* Accueil : menu « standard réseau » — terminal, raccourcis clavier, étiquette curseur */
(function () {
  var routes = [
    { keys: ['1', 'about', 'aboutme', 'moi'], href: 'aboutme.html', name: 'about' },
    { keys: ['2', 'profil', 'profile', 'pro'], href: 'profil.html', name: 'profil' },
    { keys: ['3', 'experience', 'exp', 'stage', 'internship'], href: 'experience.html', name: 'experience' },
    { keys: ['4', 'realisations', 'projets', 'projects', 'sae'], href: 'realisations.html', name: 'realisations' },
    { keys: ['5', 'parcours', 'path', 'background'], href: 'parcours.html', name: 'parcours' },
    { keys: ['6', 'bilan', 'but1', 'review'], href: 'bilanbut1.html', name: 'bilan' },
    { keys: ['7', 'mentions', 'legal'], href: 'mentionslegales.html', name: 'mentions' }
  ];

  var CV_URL = 'CV_Remi_GAUTIER.pdf';
  var LINKEDIN_URL = 'https://www.linkedin.com/in/remi-gautier-6856bb354';
  var EMAIL = 'remsgautier31@gmail.com';

  function curLang() { return document.documentElement.lang === 'en' ? 'en' : 'fr'; }
  function L(fr, en) { return curLang() === 'en' ? en : fr; }
  function pick(list) { return list[Math.floor(Math.random() * list.length)]; }

  var input = document.getElementById('cmd');
  var out = document.getElementById('cmd-out');
  var links = Array.prototype.slice.call(document.querySelectorAll('.switch a'));
  var started = Date.now();
  var timers = [];
  var hist = [], histIdx = 0;

  /* ---------- Sortie ---------- */
  function stopTimers() { timers.forEach(clearTimeout); timers = []; }

  function say(msg, kind) {
    out.textContent = msg;
    out.className = 'term__out' + (kind ? ' is-' + kind : '');
    out.scrollTop = 0;
  }

  // Affiche des lignes une par une (effet « terminal »)
  function play(lines, step, kind) {
    say('', kind);
    lines.forEach(function (line, i) {
      timers.push(setTimeout(function () {
        out.textContent += (i ? '\n' : '') + line;
        out.scrollTop = out.scrollHeight;
      }, i * step));
    });
  }

  /* ---------- Navigation ---------- */
  function find(word) {
    for (var i = 0; i < routes.length; i++) {
      if (routes[i].keys.indexOf(word) !== -1) return { route: routes[i], index: i };
    }
    return null;
  }

  function go(hit) {
    links.forEach(function (l) { l.classList.remove('is-active'); });
    var link = links[hit.index];
    if (link) link.classList.add('is-active');
    say(L('> connexion à /', '> connecting to /') + hit.route.name + ' … ok', 'ok');
    var dest = link ? link.getAttribute('href') : hit.route.href;
    setTimeout(function () { location.href = dest; }, 380);
  }

  /* ---------- Effet « Matrix » ---------- */
  var mx = null;
  function stopMatrix() {
    if (!mx) return;
    clearInterval(mx.timer);
    var cv = mx.cv;
    cv.style.opacity = '0';
    setTimeout(function () { if (cv.parentNode) cv.parentNode.removeChild(cv); }, 700);
    mx = null;
  }
  function matrix(ms) {
    if (mx) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var cv = document.createElement('canvas');
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:90;pointer-events:none;opacity:1;transition:opacity .6s';
    document.body.appendChild(cv);
    var w = cv.width = window.innerWidth, h = cv.height = window.innerHeight;
    var ctx = cv.getContext('2d');
    var size = 16, cols = Math.floor(w / size), drops = [], i;
    for (i = 0; i < cols; i++) drops[i] = Math.random() * -40;
    var color = (getComputedStyle(document.documentElement).getPropertyValue('--phos') || '').trim() || '#c4ff3a';
    var chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ{}<>/=+*#';
    ctx.font = size + 'px monospace';
    var timer = setInterval(function () {
      ctx.fillStyle = 'rgba(0,0,0,.09)';
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = color;
      for (var c = 0; c < cols; c++) {
        ctx.fillText(chars.charAt(Math.floor(Math.random() * chars.length)), c * size, drops[c] * size);
        if (drops[c] * size > h && Math.random() > .975) drops[c] = 0;
        drops[c]++;
      }
    }, 50);
    mx = { cv: cv, timer: timer };
    timers.push(setTimeout(stopMatrix, ms || 6000));
  }

  /* ---------- Commandes ---------- */
  var C = {};      // nom -> fonction(args, raw)
  var shown = [];  // commandes visibles (aide + Tab)
  function def(names, fn, visible) {
    names.forEach(function (n, i) { C[n] = fn; if (visible && i === 0) shown.push(n); });
  }

  // --- Aide
  def(['help', 'aide', '?', 'man'], function () {
    say(L(
      'navigation  about · profil · experience · realisations · parcours · bilan · mentions\n' +
      '            (ou cd <page>, ou les touches 1–7)\n' +
      'infos       whoami · skills · tools · projets · formation · contact · neofetch · banner\n' +
      'actions     cv · linkedin · theme [light|dark|zelda] · lang [fr|en]\n' +
      'système     ls · pwd · date · uptime · history · echo · clear\n' +
      'fun         ping <hôte> · nmap · fortune · cowsay <texte> · matrix\n' +
      '\n↑ ↓ historique · Tab complète · Ctrl+L efface\n' +
      '… et quelques commandes secrètes. À toi de les trouver ;)',
      'navigation  about · profile · experience · projects · background · review · legal\n' +
      '            (or cd <page>, or keys 1–7)\n' +
      'info        whoami · skills · tools · projects · education · contact · neofetch · banner\n' +
      'actions     cv · linkedin · theme [light|dark|zelda] · lang [fr|en]\n' +
      'system      ls · pwd · date · uptime · history · echo · clear\n' +
      'fun         ping <host> · nmap · fortune · cowsay <text> · matrix\n' +
      '\n↑ ↓ history · Tab completes · Ctrl+L clears\n' +
      '… and a few secret commands. Find them yourself ;)'
    ));
  }, true);

  // --- Infos
  def(['whoami'], function () {
    say(L('rémi gautier — étudiant BUT R&T, futur expert cybersécurité', 'rémi gautier — BUT R&T student, future cybersecurity expert'), 'ok');
  }, true);

  def(['skills', 'competences', 'compétences'], function () {
    say(L(
      'réseaux    VLAN, routage, firewall (Panorama), Wireshark, Packet Tracer\n' +
      'info       HTML, CSS, C, Bash, machines virtuelles\n' +
      'télécoms   mesures électriques, téléphonie IP\n' +
      'langues    anglais B1 · espagnol A2',
      'networks   VLAN, routing, firewall (Panorama), Wireshark, Packet Tracer\n' +
      'computing  HTML, CSS, C, Bash, virtual machines\n' +
      'telecoms   electrical measurements, IP telephony\n' +
      'languages  English B1 · Spanish A2'
    ));
  }, true);

  def(['tools', 'outils'], function () {
    say('Prisma Browser · Prisma Access · Panorama · Cortex · Wireshark · Packet Tracer · MQTT · Cisco CCNA');
  }, true);

  def(['contact', 'mail', 'email'], function () {
    say(L('email    ', 'email    ') + EMAIL + '\n' + 'linkedin  ' + L('tape « linkedin » pour ouvrir mon profil', 'type “linkedin” to open my profile'), 'ok');
  }, true);

  def(['neofetch', 'fetch'], function () {
    var th = document.documentElement.getAttribute('data-theme') || 'dark';
    var thLabel = th === 'light' ? L('clair', 'light') : th === 'cyber' ? 'cyberpunk' : th === 'zelda' ? 'Hyrule (Sheikah)' : L('sombre', 'dark');
    var s = Math.round((Date.now() - started) / 1000);
    say(
      ' ┌──────┐   rémi@portfolio\n' +
      ' │  RG  │   ────────────────\n' +
      ' └──────┘   OS      ePortfolio (HTML · CSS · JS)\n' +
      '            Host    IUT de Blagnac\n' +
      '            Shell   rg-sh 1.0\n' +
      '            Uptime  ' + s + ' s\n' +
      '            ' + L('Thème   ', 'Theme   ') + thLabel + '\n' +
      '            ' + L('Cible   ', 'Goal    ') + L('expert en cybersécurité', 'cybersecurity expert'),
      'ok'
    );
  }, true);


  // --- Infos supplémentaires
  def(['projets', 'projects'], function () {
    say(L(
      '1. Site web (SAé 14)           gautier.atwebpages.com/SAe14\n' +
      '2. Réseau d’entreprise        configuration et administration\n' +
      '3. Capteurs & MQTT            récupération et analyse de données\n' +
      '4. Stage Agence de l’eau      Prisma Browser (sécurité du navigateur)',
      '1. Website (SAé 14)            gautier.atwebpages.com/SAe14\n' +
      '2. Corporate network           configuration and administration\n' +
      '3. Sensors & MQTT              collecting and analysing data\n' +
      '4. Agence de l’eau internship  Prisma Browser (browser security)'
    ));
  }, true);

  def(['formation', 'education', 'edu'], function () {
    say(L(
      '2024 – en cours   BUT Réseaux & Télécommunications — IUT de Blagnac\n' +
      '2025              Certifications Cisco, CCNA\n' +
      '2024              Baccalauréat général — mention assez bien',
      '2024 – ongoing    BUT Networks & Telecommunications — IUT de Blagnac\n' +
      '2025              Cisco certifications, CCNA\n' +
      '2024              General baccalaureate — “assez bien” honours'
    ));
  }, true);

  def(['banner', 'logo'], function () {
    say(
      '██████╗  ██████╗\n' +
      '██╔══██╗██╔════╝\n' +
      '██████╔╝██║  ███╗   ePortfolio\n' +
      '██╔══██╗██║   ██║   ' + L('réseaux · télécoms · cybersécurité', 'networks · telecoms · cybersecurity') + '\n' +
      '██║  ██║╚██████╔╝\n' +
      '╚═╝  ╚═╝ ╚═════╝',
      'ok'
    );
  }, true);

  // --- Actions
  def(['cv'], function () {
    say(L('ouverture du CV (PDF)…', 'opening resume (PDF)…'), 'ok');
    window.open(CV_URL, '_blank', 'noopener');
  }, true);

  def(['linkedin'], function () {
    say(L('ouverture de LinkedIn…', 'opening LinkedIn…'), 'ok');
    window.open(LINKEDIN_URL, '_blank', 'noopener');
  }, true);

  def(['theme', 'thème'], function (args) {
    if ((args[0] || '').toLowerCase() === 'secret') return secretTheme();
    if (/^(zelda|hyrule|sheikah|botw|totk)$/.test((args[0] || '').toLowerCase())) return zeldaTheme();
    var btns = document.querySelectorAll('.theme-switch button');
    if (btns.length < 2) return say(L('thème indisponible', 'theme unavailable'), 'error');
    var light = document.documentElement.getAttribute('data-theme') === 'light';
    var a = (args[0] || '').toLowerCase(), want;
    if (!a) want = light ? 'dark' : (/^(cyber|zelda)$/.test(document.documentElement.getAttribute('data-theme')) ? 'dark' : 'light');
    else if (/^(light|clair|jour|day)$/.test(a)) want = 'light';
    else if (/^(dark|sombre|nuit|night)$/.test(a)) want = 'dark';
    else return say(L('usage : theme [light|dark|zelda]', 'usage: theme [light|dark|zelda]'), 'error');
    btns[want === 'light' ? 1 : 0].click();
    say(want === 'light' ? L('thème clair activé', 'light theme on') : L('thème sombre activé', 'dark theme on'), 'ok');
  }, true);

  def(['lang', 'langue', 'language'], function (args) {
    var sel = document.getElementById('language-select');
    var a = (args[0] || '').toLowerCase();
    if (!sel || !/^(fr|en)$/.test(a)) return say('usage : lang [fr|en]', 'error');
    sel.value = a;
    sel.dispatchEvent(new Event('change'));
    say(a === 'fr' ? 'langue : français' : 'language: English', 'ok');
  }, true);

  def(['clear', 'cls'], function () { stopTimers(); say(''); }, true);

  // --- Système
  def(['ls', 'dir'], function (args) {
    var all = args.join(' ').indexOf('a') !== -1 && /^-/.test(args[0] || '');
    var list = routes.map(function (r) { return '/' + r.name; }).join('   ');
    say(all ? '.   ..   .secret   ' + list : list);
  }, true);

  def(['pwd'], function () { say('/home/remi/portfolio'); }, true);

  def(['date', 'time'], function () {
    var s;
    try {
      s = new Date().toLocaleString(curLang() === 'en' ? 'en-GB' : 'fr-FR', { timeZone: 'Europe/Paris', dateStyle: 'full', timeStyle: 'medium' });
    } catch (e) { s = new Date().toString(); }
    say(s + '  (Toulouse)');
  }, true);

  def(['uptime'], function () {
    var s = Math.round((Date.now() - started) / 1000), m = Math.floor(s / 60);
    say(L('session ouverte depuis ', 'session open for ') + (m ? m + ' min ' : '') + (s % 60) + ' s');
  }, true);

  def(['history', 'historique'], function () {
    if (!hist.length) return say(L('historique vide', 'history is empty'));
    say(hist.map(function (h, i) { return ('  ' + (i + 1)).slice(-4) + '  ' + h; }).join('\n'));
  }, true);

  def(['echo'], function (args, raw) { say(raw || ''); }, true);

  // --- Fun (visibles)
  def(['ping'], function (args) {
    var host = args[0];
    if (!host) return say(L('usage : ping <hôte>', 'usage: ping <host>'), 'error');
    var sum = 0, i;
    for (i = 0; i < host.length; i++) sum += host.charCodeAt(i);
    var ip = /^\d{1,3}(\.\d{1,3}){3}$/.test(host) ? host : '203.0.113.' + (sum % 253 + 1);
    var lines = [L('PING ', 'PING ') + host + ' (' + ip + ') : 56 octets'];
    for (i = 0; i < 4; i++) lines.push('64 octets de ' + ip + ' : icmp_seq=' + i + ' ttl=64 temps=' + (9 + Math.random() * 26).toFixed(1) + ' ms');
    lines.push(L('4 paquets transmis, 4 reçus, 0 % de perte', '4 packets sent, 4 received, 0% loss'));
    play(lines, 450);
  }, true);

  def(['nmap', 'scan'], function () {
    play([
      L('Starting nmap sur rémi.gautier …', 'Starting nmap on rémi.gautier …'),
      'PORT       STATE     SERVICE',
      '22/tcp     filtered  ssh      ' + L('← bien essayé', '← nice try'),
      '80/tcp     open      http',
      '443/tcp    open      https',
      '1337/tcp   open      elite    ' + L('← tu as l’œil', '← sharp eye'),
      '3389/tcp   closed    rdp',
      L('Scan terminé : 1 hôte, 0 vulnérabilité (merci Panorama)', 'Scan done: 1 host, 0 vulnerabilities (thanks Panorama)')
    ], 380);
  }, true);

  var FORTUNES = [
    ['Le maillon faible n’est presque jamais le firewall.', 'The weakest link is almost never the firewall.'],
    ['Un mot de passe, c’est comme une brosse à dents : on n’en prête pas.', 'A password is like a toothbrush: you don’t share it.'],
    ['Le cloud, c’est juste l’ordinateur de quelqu’un d’autre.', 'The cloud is just someone else’s computer.'],
    ['Sauvegarde aujourd’hui, pleure moins demain.', 'Back up today, cry less tomorrow.'],
    ['Le réseau ne tombe jamais en panne… sauf le vendredi à 17 h 59.', 'The network never goes down… except Friday at 5:59 pm.'],
    ['MFA : parce que « azerty123 » ne protège personne.', 'MFA: because “qwerty123” protects nobody.'],
    ['Ça marche sur ma machine.', 'It works on my machine.']
  ];
  def(['fortune'], function () { var f = pick(FORTUNES); say(L(f[0], f[1])); }, true);

  def(['cowsay'], function (args, raw) {
    var t = (raw || L('Meuh', 'Moo')).slice(0, 40);
    var bar = new Array(t.length + 3).join('_'), bar2 = new Array(t.length + 3).join('-');
    say(
      ' ' + bar + '\n< ' + t + ' >\n ' + bar2 + '\n' +
      '        \\   ^__^\n' +
      '         \\  (oo)\\_______\n' +
      '            (__)\\       )\\/\\\n' +
      '                ||----w |\n' +
      '                ||     ||'
    );
  }, true);

  def(['matrix'], function () {
    say(L('Suis le lapin blanc… (Échap pour arrêter)', 'Follow the white rabbit… (Esc to stop)'), 'ok');
    matrix(6000);
  }, true);

  // --- Navigation par mot (cd / open / goto)
  function nav(args) {
    var t = (args[0] || '').toLowerCase().replace(/^\/+/, '');
    if (!t || t === '~' || t === '..' || t === '.') return say(L('tu es déjà à l’accueil (/)', 'you are already home (/)'));
    var hit = find(t);
    if (hit) return go(hit);
    say(L('cd : ', 'cd: ') + t + L(' : dossier introuvable', ': no such directory'), 'error');
  }
  def(['cd', 'open', 'goto'], nav, false);

  /* ---------- Commandes cachées ---------- */

  // --- Thème « Hyrule » (Zelda), déclenché par « theme zelda »
  function zeldaTheme() {
    var root = document.documentElement;
    if (!window.rgSetTheme) return say(L('accès refusé', 'access denied'), 'error');
    if (root.getAttribute('data-theme') === 'zelda') {
      window.rgSetTheme('dark');
      return say(L('> Pierre Sheikah rangée. Retour au monde réel.', '> Sheikah Slate stowed. Back to the real world.'), 'ok');
    }
    play([
      '> equip --item "' + L('Pierre Sheikah', 'Sheikah Slate') + '"',
      '[ OK ] ' + L('synchronisation avec les sanctuaires…', 'syncing with the shrines…'),
      '[ OK ] ' + L('chargement de la carte d’Hyrule', 'loading the Hyrule map'),
      '[ OK ] ' + L('la Triforce est en place', 'the Triforce is in place'),
      L('Il est dangereux d’y aller seul ! (retape « theme zelda » pour revenir)', 'It’s dangerous to go alone! (type “theme zelda” again to go back)')
    ], 420, 'ok');
    timers.push(setTimeout(function () {
      if (window.rgZelda) window.rgZelda.enter(); else window.rgSetTheme('zelda');
    }, 4 * 420));
  }

  // --- Style Cyberpunk, déclenché par « theme secret » (absent de help et de Tab)
  function secretTheme() {
    var root = document.documentElement;
    if (!window.rgSetTheme) return say(L('accès refusé', 'access denied'), 'error');
    if (root.getAttribute('data-theme') === 'cyber') {
      window.rgSetTheme('dark');
      return say(L('> déconnexion de Night City… retour au réel.', '> jacking out of Night City… back to reality.'), 'ok');
    }
    play([
      '> sudo access --level=netrunner',
      '[ OK ] ' + L('contournement de la glace (ICE)…', 'bypassing ICE…'),
      '[ OK ] ' + L('injection du style : CYBERPUNK', 'injecting style: CYBERPUNK'),
      '[ !! ] ' + L('interface instable — bugs visuels attendus', 'interface unstable — expect visual glitches'),
      L('WAKE UP, SAMURAI. (retape « theme secret » pour revenir)', 'WAKE UP, SAMURAI. (type “theme secret” again to go back)')
    ], 480, 'ok');
    timers.push(setTimeout(function () {
      root.classList.add('cy-boot');
      window.rgSetTheme('cyber');
      setTimeout(function () { root.classList.remove('cy-boot'); }, 900);
    }, 4 * 480));
  }
  def(['sudo'], function (args) {
    if (!args.length) return say('usage : sudo <commande>', 'error');
    if (args[0] === 'rm' && /-\w*r\w*f|-\w*f\w*r/.test(args.join(' '))) {
      return play([
        'rm: suppression de /home /etc /var …',
        L('████████░░░░░░░░ 50 %', '████████░░░░░░░░ 50%'),
        L('Panorama a bloqué la requête.', 'Panorama blocked the request.'),
        L('Restauration depuis la sauvegarde… tout va bien 😌', 'Restoring from backup… all good 😌')
      ], 600, 'error');
    }
    say(L('rémi n’est pas dans le fichier sudoers. Cet incident sera signalé.\n(promis, personne ne lira)', 'rémi is not in the sudoers file. This incident will be reported.\n(promise, nobody will read it)'), 'error');
  });

  def(['rm'], function (args) {
    if (/-\w*r\w*f|-\w*f\w*r/.test(args.join(' ')) && /\//.test(args.join(' '))) {
      return say(L('rm : opération refusée — un étudiant en cybersécurité veille 🛡️', 'rm: operation refused — a cybersecurity student is watching 🛡️'), 'error');
    }
    say(L('rm : site en lecture seule', 'rm: read-only site'), 'error');
  });

  def(['vim', 'vi'], function () {
    say(L('Bienvenue dans vim. Il n’y a pas de sortie.\n(essaie :q!)', 'Welcome to vim. There is no way out.\n(try :q!)'));
  });
  def([':q', ':q!', ':wq', ':x', ':wq!'], function () {
    say(L('Tu t’es échappé de vim. Respect.', 'You escaped vim. Respect.'), 'ok');
  });
  def(['nano'], function () { say(L('nano : trop facile. Tu veux vraiment quitter ? Ctrl+X, évidemment.', 'nano: too easy. Ctrl+X, obviously.')); });
  def(['emacs'], function () { say(L('emacs : un excellent système d’exploitation, il lui manque juste un bon éditeur.', 'emacs: an excellent operating system, it just lacks a good editor.')); });

  def(['exit', 'quit', 'logout'], function () {
    say(L('Impossible de quitter : tu viens d’arriver ! Essaie « cv » ou « linkedin ».', 'Can’t exit: you just arrived! Try “cv” or “linkedin”.'));
  });

  def(['hello', 'hi', 'hey', 'bonjour', 'salut', 'coucou'], function () {
    say(pick([
      L('Salut ! Content de te voir ici.', 'Hi! Glad to see you here.'),
      'Hello, world !',
      L('Bonjour ! Tape « help » pour explorer.', 'Hello! Type “help” to explore.')
    ]), 'ok');
  });

  def(['coffee', 'cafe', 'café', 'tea', 'the', 'thé'], function () {
    say('    ( (\n     ) )\n  ........\n  |      |]\n  \\      /\n   `----\'\n\nHTTP 418 — ' + L('Je suis une théière.', 'I’m a teapot.'));
  });

  def(['japan', 'japon', 'nihon'], function () {
    say(L('Mon rêve : aller au Japon 🇯🇵\n行きたい！ (ikitai !)', 'My dream: going to Japan 🇯🇵\n行きたい！ (ikitai!)'), 'ok');
  });

  def(['overwatch', 'ow'], function () {
    say(L('Le payload n’avance pas. Quelqu’un a un support ?\n(spoiler : personne ne veut jouer support)', 'The payload isn’t moving. Anyone got a support?\n(spoiler: nobody wants to play support)'));
  });

  def(['chess', 'echecs', 'échecs'], function () {
    play(['1. e4  e5', '2. Cf3  Cc6', '3. Fb5 …', L('La partie est en cours : à toi de jouer.', 'The game is on: your move.')], 600);
  });

  def(['drums', 'batterie', 'drum'], function () {
    play(['🥁  boum', '🥁  tchak', '🥁  boum boum', '🥁  tchak', L('🤘 Merci, on se retrouve au prochain concert !', '🤘 Thank you, see you at the next gig!')], 380);
  });

  def(['tennis'], function () {
    play(['🎾  15-0', '🎾  30-0', '🎾  40-0', L('Jeu, set et match !', 'Game, set and match!')], 450, 'ok');
  });

  def(['42'], function () { say(L('La réponse à la grande question sur la vie, l’univers et le reste.', 'The answer to the ultimate question of life, the universe and everything.'), 'ok'); });

  def(['ssh'], function () {
    say(L('ssh : connexion refusée. Cette porte ne s’ouvre pas si facilement… (je me forme à la cybersécurité, après tout)', 'ssh: connection refused. This door doesn’t open that easily… (I’m training in cybersecurity, after all)'), 'error');
  });

  def(['hack', 'hacker'], function () {
    play([
      '[*] ' + L('Scan des ports…', 'Scanning ports…'),
      '[*] ' + L('Contournement du firewall…', 'Bypassing the firewall…'),
      '[*] ' + L('Injection du payload…', 'Injecting the payload…'),
      '[!] ' + L('Panorama a détecté l’intrusion. Accès refusé. Bien essayé 😉', 'Panorama detected the intrusion. Access denied. Nice try 😉')
    ], 650, 'error');
  });

  def(['sl'], function () { say(L('Tu voulais dire « ls » ? 🚂 tchou-tchou !', 'Did you mean “ls”? 🚂 choo-choo!')); });

  def(['cat'], function (args) {
    if (!args.length) return say(' /\\_/\\\n( o.o )  ' + L('miaou', 'meow') + '\n > ^ <');
    if (args[0] === '.secret') return say(L('Commandes secrètes découvertes :', 'Secret commands found:') + '\n\n' +
      'sudo\n' +
      'sudo rm -rf /\n' +
      'rm -rf /\n' +
      'vim, vi  (:q!, :q, :wq, :x)\n' +
      'nano, emacs\n' +
      'ssh\n' +
      'hack, hacker\n' +
      'sl\n' +
      'exit, quit, logout\n' +
      'reboot, restart\n' +
      'cat', 'ok');
    say('cat: ' + args[0] + L(' : aucun fichier ou dossier de ce type', ': no such file or directory'), 'error');
  });


  // --- « 67 » : l'écran fait le yo-yo comme sur internet
  def(['67', '6-7', 'six-seven', 'sixseven'], function () {
    play(['6…', '7 !', '🙌 SIX SEVEN 🙌'], 420, 'ok');
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var root = document.documentElement;
    root.classList.add('rg-67');
    setTimeout(function () { root.classList.remove('rg-67'); }, 5000);
  });

  // --- « zelda » : l'ocarina (phrase de la Berceuse de Zelda, synthétisée)
  var zPlaying = false, zCtx = null, zAudio = null, zStop = null;
  function zelda() {
    if (zPlaying) {
      if (zStop) zStop();
      return say(L('musique coupée', 'music stopped'), 'ok');
    }
    var tri =
      '      /\\\n' +
      '     /__\\\n' +
      '    /\\  /\\\n' +
      '   /__\\/__\\\n\n';
    // Notes de l'ocarina : ◀ = Si4, ▲ = Ré5, ▶ = La4
    var phrase = [
      { f: 493.88, d: 1.3, s: '◀' }, { f: 587.33, d: 0.7, s: '▲' }, { f: 440.0, d: 2.1, s: '▶' },
      { f: 493.88, d: 1.3, s: '◀' }, { f: 587.33, d: 0.7, s: '▲' }, { f: 440.0, d: 2.6, s: '▶' }
    ];
    var seq = phrase.concat(phrase, phrase); // ~26 s
    var total = seq.reduce(function (a, n) { return a + n.d; }, 0);

    function showProgress() {
      say(tri + '♪ ' + L('Berceuse de Zelda — Ocarina of Time', 'Zelda’s Lullaby — Ocarina of Time') + '\n', 'ok');
      var t = 0, acc = '';
      seq.forEach(function (n, idx) {
        timers.push(setTimeout(function () {
          acc += n.s + ' ' + (idx % 6 === 5 ? '\n' : '');
          out.textContent = tri + '♪ ' + L('Berceuse de Zelda — Ocarina of Time', 'Zelda’s Lullaby — Ocarina of Time') + '\n' + acc;
          out.scrollTop = out.scrollHeight;
        }, t * 1000));
        t += n.d;
      });
      timers.push(setTimeout(function () {
        out.textContent += '\n' + L('Hey ! Écoute !  (retape « zelda » pour rejouer)', 'Hey! Listen!  (type “zelda” to play again)');
      }, total * 1000));
    }

    function synth() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return say(L('audio non supporté par ce navigateur', 'audio not supported by this browser'), 'error');
      zCtx = zCtx || new AC();
      if (zCtx.state === 'suspended') zCtx.resume();
      var ctx = zCtx, t0 = ctx.currentTime + 0.1;
      var master = ctx.createGain(); master.gain.value = 0.55;
      var echo = ctx.createDelay(); echo.delayTime.value = 0.32;
      var fb = ctx.createGain(); fb.gain.value = 0.32;
      var wet = ctx.createGain(); wet.gain.value = 0.35;
      master.connect(ctx.destination);
      master.connect(echo); echo.connect(fb); fb.connect(echo); echo.connect(wet); wet.connect(ctx.destination);
      var nodes = [], t = t0;
      seq.forEach(function (n) {
        var o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), g2 = ctx.createGain();
        var lfo = ctx.createOscillator(), lg = ctx.createGain();
        o.type = 'sine'; o.frequency.value = n.f;
        o2.type = 'triangle'; o2.frequency.value = n.f * 2; g2.gain.value = 0.06;
        lfo.frequency.value = 5.2; lg.gain.value = n.f * 0.005;
        lfo.connect(lg); lg.connect(o.frequency);
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.4, t + 0.07);
        g.gain.setValueAtTime(0.36, t + n.d - 0.2);
        g.gain.linearRampToValueAtTime(0, t + n.d - 0.02);
        o.connect(g); o2.connect(g2); g2.connect(g); g.connect(master);
        [o, o2, lfo].forEach(function (x) { x.start(t); x.stop(t + n.d); nodes.push(x); });
        t += n.d;
      });
      // nappe ambiante (Ré3 + La3) sous la mélodie
      [146.83, 220.0].forEach(function (f) {
        var p = ctx.createOscillator(), pg = ctx.createGain();
        p.type = 'triangle'; p.frequency.value = f;
        pg.gain.setValueAtTime(0, t0);
        pg.gain.linearRampToValueAtTime(0.05, t0 + 2);
        pg.gain.setValueAtTime(0.05, t - 2.5);
        pg.gain.linearRampToValueAtTime(0, t);
        p.connect(pg); pg.connect(master);
        p.start(t0); p.stop(t); nodes.push(p);
      });
      zPlaying = true;
      zStop = function () {
        nodes.forEach(function (x) { try { x.stop(); } catch (e) {} });
        try { master.disconnect(); } catch (e) {}
        zPlaying = false; zStop = null;
      };
      setTimeout(function () { if (zPlaying && zStop) zStop(); }, (total + 1.5) * 1000);
      showProgress();
    }

    // Si un fichier assets/zelda.mp3 est présent, il est joué en entier à la place de la version synthétisée.
    var failed = false;
    function fallback() { if (failed) return; failed = true; zAudio = null; synth(); }
    try {
      zAudio = new Audio('assets/zelda.mp3');
      zAudio.addEventListener('error', fallback);
      zAudio.addEventListener('ended', function () { zPlaying = false; zStop = null; });
      var p = zAudio.play();
      if (p && p.then) p.then(function () {
        if (failed) return;
        zPlaying = true;
        zStop = function () { zAudio.pause(); zPlaying = false; zStop = null; };
        say(tri + '♪ The Legend of Zelda — Ocarina of Time', 'ok');
      }).catch(fallback);
    } catch (e) { fallback(); }
  }
  def(['zelda', 'ocarina', 'triforce', 'hyrule'], zelda);

  def(['reboot', 'restart'], function () {
    say(L('Redémarrage…', 'Rebooting…'), 'ok');
    setTimeout(function () { location.reload(); }, 900);
  });

  /* ---------- Exécution ---------- */
  function suggest(name) {
    var all = shown.concat(routes.map(function (r) { return r.name; }));
    return all.filter(function (n) { return n.indexOf(name) === 0 || (name.length > 2 && name.indexOf(n) === 0); }).slice(0, 4);
  }

  function run(raw) {
    raw = raw.trim();
    if (!raw) return;
    stopTimers();
    if (hist[hist.length - 1] !== raw) hist.push(raw);
    histIdx = hist.length;

    var parts = raw.split(/\s+/);
    var name = parts[0].toLowerCase();
    var args = parts.slice(1);
    var rest = raw.slice(parts[0].length).trim();

    if (Object.prototype.hasOwnProperty.call(C, name)) return C[name](args, rest);

    var bare = name.replace(/^\/+/, '');
    var hit = find(bare);
    if (hit) return go(hit);

    var sug = suggest(name);
    say(L('commande introuvable : « ', 'command not found: « ') + raw + ' »' +
      (sug.length ? L(' — tu voulais dire : ', ' — did you mean: ') + sug.join(', ') + ' ?' : L(' — tape help', ' — type help')), 'error');
  }

  /* ---------- Clavier dans le terminal ---------- */
  function complete() {
    var v = input.value;
    if (!v || /\s/.test(v)) return;
    var names = shown.concat(routes.map(function (r) { return r.name; }));
    var m = names.filter(function (n) { return n.indexOf(v.toLowerCase()) === 0; });
    if (m.length === 1) input.value = m[0] + ' ';
    else if (m.length > 1) say(m.join('   '));
  }

  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); run(input.value); input.value = ''; }
      else if (e.key === 'Tab') { e.preventDefault(); complete(); }
      else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (histIdx > 0) { histIdx--; input.value = hist[histIdx]; }
        setTimeout(function () { input.setSelectionRange(input.value.length, input.value.length); }, 0);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (histIdx < hist.length - 1) { histIdx++; input.value = hist[histIdx]; }
        else { histIdx = hist.length; input.value = ''; }
      } else if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) { e.preventDefault(); stopTimers(); say(''); }
      else if (e.key === 'Escape') { stopMatrix(); }
    });
  }

  /* ---------- Raccourcis 1–7 + Konami ---------- */
  var KONAMI = ['arrowup', 'arrowup', 'arrowdown', 'arrowdown', 'arrowleft', 'arrowright', 'arrowleft', 'arrowright', 'b', 'a'];
  var kpos = 0;

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') stopMatrix();
    if (e.target === input || e.metaKey || e.ctrlKey || e.altKey) return;

    var k = e.key.toLowerCase();
    if (k === KONAMI[kpos]) {
      kpos++;
      if (kpos === KONAMI.length) {
        kpos = 0;
        say(L('↑↑↓↓←→←→BA — KONAMI CODE ✓  +30 vies. Tu es un vrai.', '↑↑↓↓←→←→BA — KONAMI CODE ✓  +30 lives. You’re the real deal.'), 'ok');
        matrix(7000);
        return;
      }
    } else {
      kpos = (k === KONAMI[0]) ? 1 : 0;
    }

    if (e.key === '/') { e.preventDefault(); input && input.focus(); return; }
    var hit = find(e.key);
    if (hit && /^[1-7]$/.test(e.key)) go(hit);
  });

  /* ---------- Horloge locale (Toulouse) ---------- */
  var clock = document.getElementById('clock');
  function tick() {
    if (!clock) return;
    clock.textContent = new Date().toLocaleTimeString('fr-FR', { timeZone: 'Europe/Paris', hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Étiquette qui suit le curseur ---------- */
  var tag = document.querySelector('.cursor-tag');
  if (tag && window.matchMedia('(hover: hover)').matches) {
    var x = 0, y = 0, tx = 0, ty = 0, raf = null;
    function loop() {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      tag.style.transform = 'translate(' + (x + 18) + 'px,' + (y + 18) + 'px)';
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(loop) : null;
    }
    document.addEventListener('mousemove', function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    links.forEach(function (l) {
      l.addEventListener('mouseenter', function () { tag.textContent = l.getAttribute('data-tag'); tag.classList.add('is-on'); });
      l.addEventListener('mouseleave', function () { tag.classList.remove('is-on'); });
    });
  }
})();
