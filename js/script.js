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

  /* ---------- Team carousel ---------- */
  var track = document.querySelector('.team-track');
  var dotsWrap = document.querySelector('.carousel-dots');
  if (track && dotsWrap) {
    var cards = track.children.length;
    var perView = window.innerWidth <= 720 ? 1 : window.innerWidth <= 1080 ? 2 : 4;
    var pages = Math.max(1, cards - perView + 1);
    var current = 0;

    function renderDots() {
      dotsWrap.innerHTML = '';
      for (var i = 0; i < pages; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.setAttribute('aria-label', 'Csoport ' + (i + 1));
        if (i === current) dot.classList.add('active');
        (function (idx) {
          dot.addEventListener('click', function () { goTo(idx); });
        })(i);
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(idx) {
      current = idx;
      var cardWidth = track.children[0].getBoundingClientRect().width;
      var gap = 24;
      track.style.transform = 'translateX(-' + (idx * (cardWidth + gap)) + 'px)';
      dotsWrap.querySelectorAll('button').forEach(function (d, i) {
        d.classList.toggle('active', i === current);
      });
    }

    function recalc() {
      perView = window.innerWidth <= 720 ? 1 : window.innerWidth <= 1080 ? 2 : 4;
      pages = Math.max(1, cards - perView + 1);
      current = Math.min(current, pages - 1);
      renderDots();
      goTo(current);
    }

    renderDots();
    window.addEventListener('resize', recalc);
  }

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
