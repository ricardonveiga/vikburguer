(function () {
  'use strict';

  document.getElementById('year').textContent = new Date().getFullYear();

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- preloader ---------------- */
  var preloader = document.getElementById('preloader');
  function hidePreloader() {
    preloader.classList.add('is-done');
    setTimeout(function () { preloader.remove(); }, 800);
  }
  window.addEventListener('load', function () {
    setTimeout(hidePreloader, 700);
  });
  setTimeout(hidePreloader, 2600); // safety fallback

  /* ---------------- smooth scroll (Lenis) ---------------- */
  var lenis = null;
  if (!reduceMotion && window.Lenis) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    if (window.gsap && window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMobileNav();
      if (lenis) lenis.scrollTo(target, { offset: -70 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------------- header state ---------------- */
  var header = document.getElementById('siteHeader');
  window.addEventListener('scroll', function () {
    header.classList.toggle('is-scrolled', window.scrollY > 30);
  }, { passive: true });

  /* ---------------- mobile nav ---------------- */
  var navToggle = document.getElementById('navToggle');
  var navMobile = document.getElementById('navMobile');
  function closeMobileNav() {
    navMobile.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  navToggle.addEventListener('click', function () {
    var open = navMobile.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  });
  navMobile.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeMobileNav); });

  /* ---------------- menu tabs overflow hint (mobile) ---------------- */
  var menuTabsEl = document.querySelector('.menu-tabs');
  if (menuTabsEl && !reduceMotion) {
    var nudged = false;
    var maybeNudge = function () {
      if (nudged || menuTabsEl.scrollWidth <= menuTabsEl.clientWidth + 4) return;
      nudged = true;
      menuTabsEl.scrollTo({ left: 56, behavior: 'smooth' });
      setTimeout(function () { menuTabsEl.scrollTo({ left: 0, behavior: 'smooth' }); }, 650);
    };
    if (window.IntersectionObserver) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { setTimeout(maybeNudge, 500); io.disconnect(); } });
      }, { threshold: 0.4 });
      io.observe(menuTabsEl);
    } else {
      setTimeout(maybeNudge, 1500);
    }
  }

  /* ---------------- menu tabs ---------------- */
  var tabs = document.querySelectorAll('.menu-tab');
  var panels = document.querySelectorAll('.menu-panel');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      var cat = tab.getAttribute('data-cat');
      tabs.forEach(function (t) { t.classList.remove('is-active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      panels.forEach(function (p) {
        var match = p.getAttribute('data-panel') === cat;
        p.classList.toggle('is-active', match);
      });
      if (window.gsap) {
        var active = document.querySelector('.menu-panel.is-active .menu-grid');
        gsap.fromTo(active.children, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .55, stagger: .05, ease: 'power2.out' });
      }
    });
  });

  /* ---------------- GSAP scroll animations ---------------- */
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // hero split-text char reveal
    document.querySelectorAll('[data-split]').forEach(function (el) {
      var text = el.textContent;
      el.innerHTML = text.replace(/\S/g, '<span class="char">$&</span>');
    });
    gsap.set('.hero-title .char', { yPercent: 120, opacity: 0 });
    var heroTl = gsap.timeline({ delay: .5 });
    heroTl
      .to('.hero-title .line:first-child .char', { yPercent: 0, opacity: 1, duration: 1, stagger: .025, ease: 'power4.out' })
      .to('.hero-title .line.accent .char', { yPercent: 0, opacity: 1, duration: 1, stagger: .025, ease: 'power4.out' }, '-=.75')
      .to('.hero-eyebrow', { opacity: 1, duration: .6 }, '-=.9')
      .to('.hero-sub', { opacity: 1, y: 0, duration: .8 }, '-=.6')
      .to('.hero-actions', { opacity: 1, y: 0, duration: .8 }, '-=.6');
    gsap.set(['.hero-sub', '.hero-actions'], { y: 20 });

    // hero video subtle continuous zoom
    gsap.to('.hero-video', { scale: 1.16, duration: 18, ease: 'none', repeat: -1, yoyo: true });

    // generic reveal-on-scroll
    gsap.utils.toArray('[data-reveal]').forEach(function (el) {
      if (el.closest('.hero')) return;
      gsap.fromTo(el, { opacity: 0, y: 34 }, {
        opacity: 1, y: 0, duration: .9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    // about parallax image
    gsap.to('.about-media img', {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true }
    });

    // stat count-up
    document.querySelectorAll('.stat-number').forEach(function (el) {
      var raw = el.getAttribute('data-count');
      var end = parseFloat(raw);
      var isDecimal = raw.indexOf('.') !== -1;
      var obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () {
          gsap.to(obj, {
            val: end, duration: 1.6, ease: 'power2.out',
            onUpdate: function () { el.textContent = isDecimal ? obj.val.toFixed(1) : Math.round(obj.val); }
          });
        }
      });
    });

    // menu cards stagger-in per panel on scroll
    document.querySelectorAll('.menu-grid').forEach(function (grid) {
      gsap.fromTo(grid.children, { opacity: 0, y: 30 }, {
        opacity: 1, y: 0, duration: .7, stagger: .06, ease: 'power2.out',
        scrollTrigger: { trigger: grid, start: 'top 88%' }
      });
    });

    // menu card 3D tilt on pointer move (desktop only)
    if (window.matchMedia('(hover: hover)').matches) {
      document.querySelectorAll('.menu-card').forEach(function (card) {
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width - .5;
          var py = (e.clientY - r.top) / r.height - .5;
          gsap.to(card, { rotateY: px * 8, rotateX: py * -8, duration: .4, ease: 'power2.out', transformPerspective: 700 });
        });
        card.addEventListener('mouseleave', function () {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: .6, ease: 'power2.out' });
        });
      });
    }
  }
})();
