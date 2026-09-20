(function(){
  "use strict";

  /* ---------- MOBILE MENU ---------- */
  var menu = document.getElementById('menu');
  var burger = document.getElementById('burger');

  function setMenu(next){
    menu.classList.toggle('is-open', next);
    burger.classList.toggle('is-active', next);
    document.body.classList.toggle('menu-open', next);
    burger.setAttribute('aria-expanded', next ? 'true' : 'false');
    burger.setAttribute('aria-label', next ? 'Close menu' : 'Open menu');
  }

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

  /* ---------- HERO VIDEO ---------- */
  var video = document.getElementById('heroVideo');

  function reveal(){ video.classList.add('is-ready'); }
  if (video.readyState >= 3) reveal();
  else video.addEventListener('loadeddata', reveal, { once:true });

  function kick(){
    var p = video.play();
    if (p && p.catch) p.catch(function(){});
  }
  kick();
  window.addEventListener('touchstart', kick, { once:true, passive:true });
  window.addEventListener('click', kick, { once:true });

  /* ---------- SCROLL REVEAL ---------- */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){
      if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold:.12, rootMargin:'0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
})();
