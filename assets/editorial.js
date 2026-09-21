/* ================================================================
   MA ZHONGYU — EDITORIAL PORTFOLIO  ·  interaction layer
   No dependencies. Null-guarded so every page can share it.
================================================================ */
(function () {
  'use strict';
  var html = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. smooth scroll for in-page anchors ---------- */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href');
    if (!id || id === '#' || id.length < 2) return;
    var t = document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });

  /* ---------- 2. fixed nav: hide on scroll-down, reveal on up ---------- */
  var nav = document.querySelector('.nav');
  if (nav) {
    var last = window.pageYOffset, ticking = false;
    var onScroll = function () {
      var y = window.pageYOffset;
      if (y > 140 && y > last + 6) nav.classList.add('is-hidden');
      else if (y < last - 6 || y < 140) nav.classList.remove('is-hidden');
      last = y;
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
    }, { passive: true });
  }

  /* ---------- 3. drawer (mobile menu) ---------- */
  var burger = document.getElementById('burger');
  var drawer = document.getElementById('drawer');
  if (burger && drawer) {
    var setDrawer = function (open) {
      drawer.classList.toggle('is-open', open);
      burger.classList.toggle('is-on', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('is-locked', open);
    };
    burger.addEventListener('click', function () {
      setDrawer(!drawer.classList.contains('is-open'));
    });
    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setDrawer(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setDrawer(false);
    });
  }

  /* ---------- 4. scroll reveal ----------
     The CSS that hides .rv elements is scoped to html.reveal-ready, and that
     class is added only after the observers are live. If this script never
     executes (or throws), nothing is hidden and the page stays readable. */
  var revealSel = '.rv,.rv-mask,.rv-line,.rv-media';
  var revealEls = document.querySelectorAll(revealSel);
  if (revealEls.length) {
    if (reduced || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    } else {
      try {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
          });
        }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
        revealEls.forEach(function (el) { io.observe(el); });
        /* observers are registered — now it is safe to arm the hiding rules */
        html.classList.add('reveal-ready');

        /* safety net 1: anything already inside the viewport at load */
        var sweep = function () {
          revealEls.forEach(function (el) {
            if (el.classList.contains('in')) return;
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight * 0.94 && r.bottom > 0) el.classList.add('in');
          });
        };
        window.addEventListener('load', sweep);
        window.setTimeout(sweep, 1200);

        /* safety net 2: a cheap geometry sweep on scroll. When the observer
           is delivering this is a no-op; if it ever stops delivering, the
           page still reveals itself as the reader scrolls. */
        var sweepTick = false, left = revealEls.length;
        var onSweep = function () {
          if (sweepTick) return;
          sweepTick = true;
          window.requestAnimationFrame(function () {
            sweepTick = false;
            sweep();
            left = 0;
            revealEls.forEach(function (el) { if (!el.classList.contains('in')) left++; });
            if (left === 0) window.removeEventListener('scroll', onSweep);
          });
        };
        window.addEventListener('scroll', onSweep, { passive: true });
      } catch (e) {
        html.classList.remove('reveal-ready');
        revealEls.forEach(function (el) { el.classList.add('in'); });
      }
    }
  }

  /* ---------- 5. subtle parallax on [data-par] ---------- */
  var parEls = [].slice.call(document.querySelectorAll('[data-par]'));
  if (parEls.length && !reduced) {
    var parTick = false;
    var parRun = function () {
      var vh = window.innerHeight;
      parEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -vh * 0.4 || r.top > vh * 1.4) return;
        var speed = parseFloat(el.getAttribute('data-par')) || 0.08;
        var mid = r.top + r.height / 2 - vh / 2;
        el.style.transform = 'translate3d(0,' + (-mid * speed).toFixed(2) + 'px,0)';
      });
      parTick = false;
    };
    window.addEventListener('scroll', function () {
      if (!parTick) { parTick = true; window.requestAnimationFrame(parRun); }
    }, { passive: true });
    window.addEventListener('resize', parRun, { passive: true });
    parRun();
  }

  /* ---------- 6. hero: fade / drift the title on scroll-out ---------- */
  var heroTitle = document.querySelector('[data-hero-out]');
  if (heroTitle && !reduced) {
    var hTick = false;
    window.addEventListener('scroll', function () {
      if (hTick) return;
      hTick = true;
      window.requestAnimationFrame(function () {
        var y = window.pageYOffset;
        var p = Math.min(y / (window.innerHeight * 0.85), 1);
        heroTitle.style.transform = 'translate3d(0,' + (p * -60).toFixed(1) + 'px,0)';
        heroTitle.style.opacity = String(1 - p * 1.05 > 0 ? 1 - p * 1.05 : 0);
        hTick = false;
      });
    }, { passive: true });
  }

  /* ---------- 7. inline film player ---------- */
  document.querySelectorAll('.vg video,.film video').forEach(function (v) {
    v.addEventListener('play', function () {
      var box = v.closest('.film');
      if (box) box.classList.add('is-playing');
      /* only one video at a time keeps the page light */
      document.querySelectorAll('video').forEach(function (o) {
        if (o !== v && !o.paused) o.pause();
      });
    });
    v.addEventListener('pause', function () {
      var box = v.closest('.film');
      if (box) box.classList.remove('is-playing');
    });
  });

  /* ---------- 8. custom cursor (pointer:fine only) ---------- */
  var fine = window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var cur = document.getElementById('cur');
  if (cur && fine && !reduced) {
    var dot = cur.querySelector('.cur__dot');
    var label = cur.querySelector('.cur__label');
    var tx = window.innerWidth / 2, ty = window.innerHeight / 2, cx = tx, cy = ty, shown = false;

    var move = function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; cx = tx; cy = ty; document.body.classList.add('has-cursor'); }
    };
    document.addEventListener('mousemove', move, { passive: true });
    document.addEventListener('mouseleave', function () {
      document.body.classList.remove('has-cursor'); shown = false;
    });

    var loop = function () {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      cur.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0) translate(-50%,-50%)';
      window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);

    var KIND = {
      view: 'View', play: 'Play', open: 'Open', link: 'Open', index: 'Index'
    };
    document.addEventListener('mouseover', function (e) {
      var t = e.target.closest && e.target.closest('[data-cursor],a,button');
      if (!t) { cur.className = 'cur'; return; }
      var kind = t.getAttribute && t.getAttribute('data-cursor');
      if (!kind) {
        if (t.tagName === 'VIDEO') kind = 'play';
        else if (t.tagName === 'A' || t.tagName === 'BUTTON') kind = 'link';
      }
      if (!kind || !KIND[kind]) { cur.className = 'cur'; return; }
      cur.className = 'cur is-' + (kind === 'link' ? 'link' : kind);
      if (label) label.textContent = KIND[kind];
    }, true);
  }

  /* ---------- 9. page transition on internal navigation ---------- */
  var trans = document.getElementById('trans');
  if (trans && !reduced) {
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (!href || a.target === '_blank' || a.hasAttribute('download')) return;
      if (href.charAt(0) === '#' || /^(mailto|tel|https?:)/i.test(href)) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      if (a.host && a.host !== window.location.host) return;
      e.preventDefault();
      trans.classList.add('is-on');
      window.setTimeout(function () { window.location.href = href; }, 480);
    });

    /* coming back via bfcache: clear the veil */
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) trans.classList.remove('is-on');
    });
  }

  /* ---------- 10. mark current nav item ---------- */
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('[data-nav]').forEach(function (a) {
    var t = (a.getAttribute('href') || '').toLowerCase();
    if (t === here) a.setAttribute('aria-current', 'true');
  });
})();
