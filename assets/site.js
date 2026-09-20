(function(){
  "use strict";

  /* ---------- MOBILE MENU (present on every page) ---------- */
  var menu = document.getElementById('menu');
  var burger = document.getElementById('burger');

  if (menu && burger) {
    var setMenu = function(next){
      menu.classList.toggle('is-open', next);
      burger.classList.toggle('is-active', next);
      document.body.classList.toggle('menu-open', next);
      burger.setAttribute('aria-expanded', next ? 'true' : 'false');
      burger.setAttribute('aria-label', next ? 'Close menu' : 'Open menu');
    };

    burger.addEventListener('click', function(){ setMenu(!menu.classList.contains('is-open')); });
    menu.addEventListener('click', function(e){
      if (e.target.closest('a')) setMenu(false);
    });
    window.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && menu.classList.contains('is-open')) setMenu(false);
    });
    window.addEventListener('resize', function(){
      if (menu.classList.contains('is-open') && window.innerWidth > 900) setMenu(false);
    });
  }

  /* ---------- HERO VIDEO (landing page only) ---------- */
  var video = document.getElementById('heroVideo');

  if (video) {
    var showVideo = function(){ video.classList.add('is-ready'); };

    if (video.readyState >= 3) showVideo();
    else video.addEventListener('loadeddata', showVideo, { once:true });

    var kick = function(){
      var p = video.play();
      if (p && p.catch) p.catch(function(){});
    };
    kick();
    window.addEventListener('touchstart', kick, { once:true, passive:true });
    window.addEventListener('click', kick, { once:true });
  }

  /* ---------- SCROLL REVEAL ---------- */
  var targets = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    targets.forEach(function(el){ el.classList.add('in'); });
    return;
  }

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold:.12, rootMargin:'0px 0px -6% 0px' });

  targets.forEach(function(el){ io.observe(el); });

  /* safety net: anything already inside the viewport must never stay hidden */
  window.addEventListener('load', function(){
    targets.forEach(function(el){
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('in');
    });
  });
})();
