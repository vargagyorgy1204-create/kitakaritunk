document.addEventListener('DOMContentLoaded', function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Mobile menu ---------- */
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileNav.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileNav.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- "Hogyan takarítunk?" room tabs + photo hotspots ---------- */
  var ROOMS = {
    konyha: {
      label: 'Konyha',
      img: 'images/room-kitchen.jpg',
      alt: 'Konyha takarítás közben',
      hotspots: [
        { x: 28, y: 32, caption: 'Páraelszívó eleje, szekrényfrontok letörlése' },
        { x: 52, y: 62, caption: 'Munkalap fertőtlenítése, tűzhely tisztítása' },
        { x: 78, y: 45, caption: 'Edények elmosogatása, szemét kivitele' }
      ]
    },
    szobak: {
      label: 'Szobák',
      img: 'images/room-bedroom.jpg',
      alt: 'Hálószoba takarítás közben',
      hotspots: [
        { x: 26, y: 28, caption: 'Üvegfelületek, tükrök tisztítása' },
        { x: 50, y: 68, caption: 'Könnyű tárgyak és alattuk lévő felület, porszívózás/felmosás az ágy alatt' },
        { x: 74, y: 42, caption: 'Ágy megvetése, felületek rendbetétele, padló porszívózása/felmosása' }
      ]
    },
    furdoszoba: {
      label: 'Fürdőszoba',
      img: 'images/room-bathroom.jpg',
      alt: 'Fürdőszoba takarítás közben',
      hotspots: [
        { x: 30, y: 58, caption: 'WC fertőtlenítése, csaptelepek fényesítése' },
        { x: 58, y: 30, caption: 'Padló porszívózása, felmosása; kád tisztítása' },
        { x: 80, y: 62, caption: 'Vízkő eltávolítása, mosdókagyló tisztítása' }
      ]
    },
    bejarat: {
      label: 'Bejárat / Előszoba',
      img: 'images/placeholder-entry.svg',
      alt: 'Bejárat / Előszoba takarítás közben',
      hotspots: [
        { x: 25, y: 35, caption: 'Bejárati ajtó és tok letörlése' },
        { x: 55, y: 60, caption: 'Cipők elrendezése, cipőtartó polc letörlése' },
        { x: 80, y: 40, caption: 'Padló porszívózása, felmosása' }
      ]
    }
  };

  var roomTabs = document.querySelectorAll('.room-tab');
  var roomImage = document.getElementById('roomImage');
  var roomHotspots = document.getElementById('roomHotspots');

  function renderHotspots(room) {
    if (!roomHotspots) return;
    roomHotspots.innerHTML = '';
    room.hotspots.forEach(function (spot) {
      var wrap = document.createElement('div');
      wrap.className = 'hotspot-wrap';
      if (spot.x >= 70) wrap.classList.add('align-right');
      else if (spot.x <= 22) wrap.classList.add('align-left');
      if (spot.y <= 22) wrap.classList.add('tip-below');
      wrap.style.left = spot.x + '%';
      wrap.style.top = spot.y + '%';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hotspot-btn';
      btn.setAttribute('aria-label', spot.caption);
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = '+';

      var tip = document.createElement('div');
      tip.className = 'hotspot-tip';
      tip.textContent = spot.caption;

      btn.addEventListener('click', function () {
        var isOpen = wrap.classList.contains('open');
        // Close any other open hotspot first
        roomHotspots.querySelectorAll('.hotspot-wrap.open').forEach(function (openWrap) {
          openWrap.classList.remove('open');
          openWrap.querySelector('.hotspot-btn').textContent = '+';
          openWrap.querySelector('.hotspot-btn').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          wrap.classList.add('open');
          btn.textContent = '×';
          btn.setAttribute('aria-expanded', 'true');
        }
      });

      wrap.appendChild(btn);
      wrap.appendChild(tip);
      roomHotspots.appendChild(wrap);
    });
  }

  if (roomTabs.length && roomImage) {
    roomTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var key = tab.getAttribute('data-room');
        var room = ROOMS[key];
        if (!room) return;
        roomTabs.forEach(function (t) {
          var active = t === tab;
          t.classList.toggle('active', active);
          t.setAttribute('aria-selected', active ? 'true' : 'false');
        });
        roomImage.src = room.img;
        roomImage.alt = room.alt;
        renderHotspots(room);
      });
    });
    // Initial render for the default active tab
    renderHotspots(ROOMS.konyha);
  }

  /* ---------- Scroll-reveal (IntersectionObserver) ----------
     Variants (data-reveal): up/fade (headings, text), curtain (section
     titles), rise (feature/process/price/team/review cards, auto-
     staggered below), image (large photos), pop (badges/pills). */
  var revealEls = document.querySelectorAll('[data-reveal]');

  // Auto-stagger card grids: index within each shared parent, capped so a
  // grid with many items never leaves the last card waiting too long.
  function capStaggerByParent(selector, delayStep, maxDelay) {
    var counts = new Map();
    document.querySelectorAll(selector).forEach(function (el) {
      var parent = el.parentElement;
      var i = counts.get(parent) || 0;
      counts.set(parent, i + 1);
      if (el.hasAttribute('data-delay')) return; // explicit delay wins
      el.setAttribute('data-delay', String(Math.min(i * delayStep, maxDelay)));
    });
  }
  capStaggerByParent('[data-reveal="rise"]', 90, 360);

  // Badges/pills tagged "pop" land shortly after the nearest revealing
  // ancestor so they feel like they arrive once their card has landed.
  document.querySelectorAll('[data-reveal="pop"]').forEach(function (el) {
    if (el.hasAttribute('data-delay')) return;
    var host = el.closest('[data-reveal="rise"], [data-reveal="image"], [data-reveal="up"]');
    var base = host ? parseInt(host.getAttribute('data-delay') || '0', 10) : 0;
    el.setAttribute('data-delay', String(base + 350));
  });

  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = el.getAttribute('data-delay') || 0;
          setTimeout(function () {
            el.classList.add('is-visible');
            el.addEventListener('transitionend', function clear() {
              el.style.willChange = 'auto';
              el.removeEventListener('transitionend', clear);
            });
          }, reduceMotion ? 0 : parseInt(delay, 10));
          io.unobserve(el);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- Otthon / Iroda pill toggle (all instances stay in sync) ---------- */
  var modePills = document.querySelectorAll('.toggle-pill:not(.pricing-toggle) .pill-btn');
  modePills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var mode = btn.getAttribute('data-mode');
      document.querySelectorAll('.toggle-pill:not(.pricing-toggle) .pill-btn').forEach(function (b) {
        var active = b.getAttribute('data-mode') === mode;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    });
  });

  /* ---------- Pricing toggle (Előfizetéssel / Egyszeri) ---------- */
  var billingPills = document.querySelectorAll('.pricing-toggle .pill-btn');
  var priceEls = document.querySelectorAll('.price-card .price');
  billingPills.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var billing = btn.getAttribute('data-billing');
      billingPills.forEach(function (b) { b.classList.toggle('active', b === btn); });
      priceEls.forEach(function (el) {
        var value = billing === 'subscription' ? el.getAttribute('data-subscription') : el.getAttribute('data-onetime');
        if (value) el.textContent = value;
      });
    });
  });

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
    var panel = trigger.nextElementSibling;
    trigger.addEventListener('click', function () {
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.accordion-trigger').forEach(function (t) {
        t.setAttribute('aria-expanded', 'false');
        t.nextElementSibling.style.maxHeight = null;
        t.nextElementSibling.classList.remove('is-open');
      });
      if (!isOpen) {
        trigger.setAttribute('aria-expanded', 'true');
        panel.classList.add('is-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Team tiles (2x2 grid, click-to-expand bio) ---------- */
  document.querySelectorAll('.team-tile').forEach(function (tile) {
    var toggle = tile.querySelector('.team-tile-toggle');
    tile.addEventListener('click', function () {
      var isOpen = tile.classList.contains('is-expanded');
      document.querySelectorAll('.team-tile.is-expanded').forEach(function (open) {
        if (open !== tile) {
          open.classList.remove('is-expanded');
          open.setAttribute('aria-expanded', 'false');
          open.querySelector('.team-tile-toggle').textContent = '+';
        }
      });
      tile.classList.toggle('is-expanded', !isOpen);
      tile.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
      if (toggle) toggle.textContent = !isOpen ? '×' : '+';
    });
  });

  /* ---------- Animated stat counter ---------- */
  var counterEl = document.querySelector('.counter');
  if (counterEl) {
    var target = parseInt(counterEl.getAttribute('data-target'), 10) || 0;
    var animated = false;

    function animateCounter() {
      if (animated) return;
      animated = true;
      if (reduceMotion) {
        counterEl.textContent = target.toLocaleString('hu-HU');
        return;
      }
      var start = 0;
      var duration = 1400;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var value = Math.floor(progress * target);
        counterEl.textContent = value.toLocaleString('hu-HU');
        if (progress < 1) requestAnimationFrame(step);
        else counterEl.textContent = target.toLocaleString('hu-HU');
      }
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter();
            observer.disconnect();
          }
        });
      }, { threshold: 0.4 });
      observer.observe(counterEl);
    } else {
      animateCounter();
    }
  }

  /* ---------- Header CTA scroll target ---------- */
  document.querySelectorAll('.cta-btn').forEach(function (btn) {
    if (!btn.closest('.price-card') && btn.type === 'button' && !btn.getAttribute('data-bound')) {
      btn.addEventListener('click', function () {
        var pricing = document.getElementById('arak');
        if (pricing) pricing.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    }
  });
});

/* ---------- Sticky floating CTA badge (.fab-cta) ----------
   Self-contained: hidden while the hero is in view, appears once the
   user scrolls past it, and then stays visible for the rest of the
   page — matching the reference site's floating badge, which stays
   pinned continuously once it first appears. (An earlier version also
   hid the badge while the pricing section was in view, but the short
   gap between hero and pricing made that trigger almost immediately,
   producing a jarring appear→disappear→reappear flicker.)

   Uses getBoundingClientRect() on scroll/resize (rAF-throttled) rather
   than IntersectionObserver: a boundary case where a section's edge
   lands exactly at the viewport edge (e.g. after scrollIntoView) can
   fail to re-fire an IO callback in some browsers, leaving the badge
   stuck. Reading the rects directly has no such edge case. */
(function () {
  var fab = document.querySelector('.fab-cta');
  var hero = document.querySelector('.hero');
  if (!fab || !hero) return;

  var ticking = false;

  function update() {
    ticking = false;
    var pastHero = hero.getBoundingClientRect().bottom < 4;
    fab.classList.toggle('fab-cta--visible', pastHero);
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();
})();
