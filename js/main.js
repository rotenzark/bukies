/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'bukies',
    whatsapp: { number: '', message: '', ids: [] },
    /* orari: non li conosciamo (li pubblicano su Instagram, locale per locale): nessuna tabella, nessuno stato */
    hours: { 0: [], 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1080,
    EN: {
      "m.salta": "Skip to content",
      "m.top": "Bukies: back to the top",
      "m.nav": "Sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.menu": "The menu",
      "n.stazioni": "Our places",
      "n.storia": "Our story",
      "n.recensioni": "Reviews",
      "n.milano": "Milan, Via Lecco 7",
      "t.milano": "Milan",
      "t.menu": "Menu",
      "t.locali": "Places",
      "t.indicazioni": "Directions",
      "h.linea": "The Bukies line",
      "h.verso": "New York → Milan",
      "f.prossima": "Stop",
      "f.ny": "where Piero and Jana met",
      "f.aversa": "the first Bukies",
      "f.milano": "Via Lecco 7 · from 5 October",
      "f.didascalia": "Our line starts in New York, and now it has one more stop.",
      "f.modi": "How to look at the line",
      "f.b0": "The map",
      "f.b1": "The departures board",
      "h.titolo": "Real American smashburgers and cookies",
      "h.frase": "Three burgers, a special that changes almost every month and soft New York cookies. Six places: five in Campania and now Milan.",
      "h.cta1": "Milan, Via Lecco 7",
      "h.cta2": "The menu",
      "a.xxl": "The XXL smash cut in half and held in a hand: two layers of smash patties with melted cheddar and sauce.",
      "h.fxxl": "The XXL, cut in half",
      "av.1": "Now in Milan too",
      "av.4": "From 5 October",
      "mi.occhio": "New stop",
      "mi.titolo": "Milan, Via Lecco 7",
      "mi.frase": "Our first place outside Campania: in Porta Venezia, the Chelsea of Milan.",
      "mi.testo": "It opens on Monday 5 October 2026. The smash, the cookies and the Bukie sauce, just like in our other five places. Before opening, we announced Milan from Times Square, in New York, on the billboard next to this text.",
      "w.dove": "Where",
      "w.quando": "Since",
      "w.quandov": "Monday 5 October 2026",
      "w.orari": "Hours",
      "w.orariv": "we post them on Instagram:",
      "a.cartellone": "The Bukies billboard in Times Square: a smashburger, the words Bukies x Milan and Piero Armenti’s signature.",
      "mi.fcartellone": "Times Square, New York: “Bukies x Milan”",
      "a.maglietta": "A black T-shirt reading Make Porta Venezia great again, with the Bukies logo.",
      "mi.fmaglia": "The T-shirt for the opening",
      "w.mappa1": "Map: Bukies, Via Antonio Gramsci 62, Aversa",
      "w.mappa2": "Map: Bukies, Corso Europa 462, Villaricca",
      "w.mappa3": "Map: Bukies, Via Giuseppe Mazzini 30, Pomigliano d’Arco",
      "w.mappa4": "Map: Bukies, Via Gian Lorenzo Bernini 39, Naples",
      "w.mappa5": "Map: Bukies, Via Torrione 28, Salerno",
      "w.mappa6": "Map: Bukies, Via Lecco 7, Milan",
      "c.occhio": "What we do",
      "c.titolo": "Three ingredients are enough to conquer the world",
      "c.intro": "We don’t want an endless menu. We’d rather make a few things and make them really well. Be the best.",
      "c.v1": "American recipes",
      "c.v1t": "We start from real American recipes, the ones we got to know and tried in the United States, and we make them with the care of Italian quality.",
      "c.v2": "The handmade bun",
      "c.v2t": "The bread is not a detail: soft just enough, made to go with the smash without covering its flavour.",
      "c.v3": "The right meat",
      "c.v3t": "Our own recipe, with the right share of fat, chosen breeds, cuts and processing. Fresh, delivered every day: a crust outside, juicy inside.",
      "c.v4": "The Bukie sauce",
      "c.v4t": "A well-kept secret. And the bacon, crispy and very American.",
      "c.v5": "Chicken from the thigh",
      "c.v5t": "It stays much more tender and juicy: crunchy breading outside, soft and tasty chicken inside.",
      "c.v6": "New York cookies",
      "c.v6t": "Big, rich, soft and chewy inside, made with a real New York recipe.",
      "a.salsa": "Sauce poured over fried chicken tenders, in a white cup with the Bukies logo.",
      "c.fsalsa": "The sauce, poured over the tenders",
      "me.occhio": "The menu",
      "me.titolo": "Three lines, a special, the cookies",
      "me.intro": "There are only three burgers on our menu, but every detail is designed to make that taste unique and recognisable.",
      "me.s": "Smashburger",
      "me.st": "In four sizes, from a minimum of two to a maximum of five smash patties: from the Smashburger M, our first love, to the XXL.",
      "me.sdim": "The four sizes",
      "me.patties": "smash patties",
      "me.c": "The Chicken Burger",
      "me.ct": "The fried chicken burger: fried chicken thigh, bacon, lettuce, tomato and sweet chili sauce.",
      "me.v": "Vegan",
      "me.vt": "The vegan version of our burger.",
      "me.xocchio": "The special",
      "me.x": "It changes almost every month",
      "me.xt": "So there is always something new. Sometimes you choose it: with “Decidete i limited di Bukies” you suggest specials in the comments, we try them and the most voted ones make it onto the menu. The current one is on Instagram.",
      "me.visti": "A few burgers that have been on our trays:",
      "a.ultra": "The Ultra Cheeseburger: potato bun, double smash with cheddar and white cheese, a Nashville mozzarella stick and sauce.",
      "me.ultra": "Double smash with cheddar and white cheese, Nashville mozzarella stick and buttermilk ranch sauce.",
      "a.nypizza": "The NY Pizza Smash: potato bun, double smash with white cheese, marinara sauce and pepperoni.",
      "me.nypizza": "Handmade potato bun, double smash with white cheese, marinara sauce and pepperoni.",
      "a.bos": "The BOS, Butter Onion Smash, held with two hands: the onion under the melted cheese.",
      "me.bos": "A few ingredients for one of the best smashburgers ever.",
      "me.a": "Starters",
      "me.ribs": "Pork ribs",
      "me.vertigo": "Vertigo fries, cheddar and bacon",
      "me.fries": "Sweet and classic fries",
      "a.vertigo": "Spiral vertigo fries in a white cup.",
      "a.alette": "Glazed chicken wings in a white bucket.",
      "a.cookie": "A dark chocolate cookie held in two hands, above the trays of cookies on Bukies paper.",
      "me.kocchio": "The sweet part",
      "me.k": "The cookies",
      "me.kt": "Soft and chewy, made with a real New York recipe. Our cookies are inspired by the best cookie shops in New York: big, rich, soft inside and with that over-the-top American taste we were looking for.",
      "me.kduo": "Our favourite move, for over a year now: breaking them in two.",
      "a.cookieduo": "A dark cookie broken in two, between the fingers.",
      "s.occhio": "The stations",
      "s.titolo": "Six places, one line",
      "s.intro": "We keep the opening hours of every place updated on Instagram:",
      "s.aversa": "The first Bukies.",
      "s.villaricca": "In the province of Naples.",
      "s.pomigliano": "In the province of Naples.",
      "s.vomero": "In the Vomero district.",
      "s.salerno": "Opened in July 2026.",
      "s.nuova": "New",
      "s.milano": "Porta Venezia, from 5 October 2026.",
      "s.vai": "The map is further up, with Milan",
      "st.occhio": "Who we are",
      "st.titolo": "Piero Armenti and Jana",
      "st.grande": "“We have to make smashburgers the way they used to be made… and bring them to Italy.”",
      "a.carta": "The paper we wrap our burgers in, printed with the Bukies logo.",
      "st.fcarta": "Our paper, with the logo",
      "st.p1": "Jana and Piero Armenti first met ten years ago in New York.",
      "st.p2": "Jana was just a tourist, looking for the authentic flavours of America, while Piero had long been exploring every corner of Manhattan, discovering the unmissable tastes of the Big Apple.",
      "st.p3": "For both of them New York was a great school of taste, the perfect place to train the palate to real American flavours.",
      "st.p4": "Then life went on, and we lost touch.",
      "st.p5": "But in 2024 a beautiful idea was born: “We have to make smashburgers the way they used to be made… and bring them to Italy.”",
      "st.p6": "We were at a friend’s wedding and, by the end of the evening, the project was already crystal clear in our heads. And not only that: we decided to add American cookies too, the kind that delight your taste buds with every bite.",
      "st.p7": "A winning pair: smashburgers and cookies.",
      "st.p8": "With one clear ambition: to bring the real American taste all over Italy.",
      "r.occhio": "Reviews",
      "r.titolo": "Who has already boarded",
      "r.voto": "on Google, 1,548 reviews for Bukies Aversa",
      "r.g25": "Google, Aversa, 2025",
      "r.g26": "Google, Aversa, 2026",
      "r.nota": "From the Google reviews of Bukies Aversa, as they were written (in Italian); […] where we shortened them.",
      "r.tutte": "All the reviews on Google",
      "f2.frase": "Real American smashburgers and cookies.",
      "f2.iva": "VAT no. 10774041213",
      "f2.cred": "Demo website made by",
      "f2.fonti": "texts from the Bukies website and Instagram captions, photos from their Instagram (cropped), rating and reviews from the Google listing of Bukies Aversa (October 2026).",
      "f2.su": "Back to top"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */
  /* ══════════ FIRMA: la linea Bukies, da New York a Milano ══════════
     Stato finale = l'HTML statico (tutte le fermate accese, il tabellone su Milano). L'attesa è in CSS (.firma-attesa,
     messa nel <head> e tolta dopo 2,5 s se il codice non arriva). Due modi: «La mappa» (il treno B corre e accende le
     fermate) e «Il tabellone» (il cartello gira le destinazioni a palette, una fermata alla volta). Reduced-motion: tutto
     subito. Guardia: se a 1,5 s la corsa non è partita, si mostra la linea finita. */
  (function () {
    var fig = document.getElementById('linea-firma');
    if (!fig) return;
    var stops = Array.prototype.slice.call(fig.querySelectorAll('.fermata'));
    var dest = document.getElementById('tabDest');
    var leggi = document.getElementById('lineaLeggi');
    var bottoni = Array.prototype.slice.call(fig.querySelectorAll('.linea__modi button'));
    var NOMI = ['New York', 'Aversa', 'Villaricca', "Pomigliano d'Arco", 'Napoli · Vomero', 'Salerno', 'Milano · Via Lecco 7'];
    var FINE = NOMI[NOMI.length - 1];
    var N = stops.length - 1;
    var tl = null, timers = [], partita = false;
    var LETTERE = 'ABCDEFGHILMNOPRSTUVZ';

    function pulisci() {
      if (tl) { tl.kill(); tl = null; }
      timers.forEach(clearTimeout); timers = [];
    }
    function setP(p) { fig.style.setProperty('--p', String(p)); }
    function finale() {
      pulisci();
      setP(1);
      stops.forEach(function (s) { s.classList.add('accesa'); s.classList.remove('ora'); });
      fig.classList.remove('in-corsa');
      dest.textContent = FINE;
      root.classList.remove('firma-attesa');
    }
    function spegni() {
      stops.forEach(function (s, i) { s.classList.toggle('accesa', i === 0); s.classList.remove('ora'); });
    }
    function inizio() {
      partita = true;
      try { clearTimeout(window.__attesaLinea); } catch (e) {}
      pulisci(); spegni(); setP(0);
      fig.classList.add('in-corsa');
      root.classList.remove('firma-attesa');
      dest.textContent = NOMI[0];
    }
    /* il tabellone a palette: le lettere girano e si fermano da sinistra */
    function sfoglia(testo, durata, fatto) {
      var passi = 9, i = 0;
      (function giro() {
        i++;
        if (i >= passi) { dest.textContent = testo; if (fatto) fatto(); return; }
        var quante = Math.floor(testo.length * i / passi), s = testo.slice(0, quante);
        for (var j = quante; j < testo.length; j++) s += /[\s·']/.test(testo[j]) ? testo[j] : LETTERE[(Math.random() * LETTERE.length) | 0];
        dest.textContent = s;
        timers.push(setTimeout(giro, durata / passi));
      })();
    }
    function corsaMappa() {
      inizio();
      var stato = { p: 0 };
      tl = gsap.timeline({ onComplete: finale });
      for (var k = 1; k <= N; k++) {
        (function (k) {
          tl.to(stato, { p: k / N, duration: 0.5, ease: 'power2.inOut', onUpdate: function () { setP(stato.p); } });
          tl.call(function () { stops[k].classList.add('accesa'); dest.textContent = NOMI[k]; });
          tl.to({}, { duration: k === N ? 0.25 : 0.12 });
        })(k);
      }
    }
    function corsaTabellone() {
      inizio();
      var k = 0;
      (function prossima() {
        stops.forEach(function (s) { s.classList.remove('ora'); });
        stops[k].classList.add('accesa', 'ora');
        setP(k / N);
        sfoglia(NOMI[k], 380, function () {
          k++;
          timers.push(setTimeout(k <= N ? prossima : finale, k <= N ? 200 : 700));
        });
      })();
    }
    function corri(modo) {
      if (reducedMotion || typeof gsap === 'undefined') { finale(); return; }
      if (modo === 1) corsaTabellone(); else corsaMappa();
    }
    bottoni.forEach(function (b) {
      b.addEventListener('click', function () {
        var modo = parseInt(b.getAttribute('data-modo'), 10) || 0;
        fig.setAttribute('data-modo', String(modo));
        bottoni.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        corri(modo);
        if (leggi) leggi.textContent = NOMI.join(', ') + '.';
      });
    });
    /* partenza: subito se la linea è a schermo, altrimenti quando ci arriva */
    if (reducedMotion || typeof gsap === 'undefined') {
      finale();
    } else if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (voci) {
        voci.forEach(function (v) {
          if (v.isIntersecting && !partita) corri(0);
          /* uscita dallo schermo a metà corsa (es. un link a #stazioni appena aperta la pagina): la linea si chiude finita */
          else if (!v.isIntersecting && fig.classList.contains('in-corsa')) finale();
        });
      }, { threshold: 0.25 });
      io.observe(fig);
      setTimeout(function () {
        var r = fig.getBoundingClientRect();
        if (!partita || r.bottom < 0 || r.top > window.innerHeight) finale();
      }, 1500);
    } else {
      corri(0);
    }
  })();
})();
