/**
 * Local Vibes Restaurant - Scroll reveal & parallax
 */

(function () {
  'use strict';

  function initReveal() {
    var reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!reveals.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
    );

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initParallax() {
    var hero = document.getElementById('hero');
    var parallaxBottom = document.getElementById('hero-parallax-bottom');
    if (!hero || !parallaxBottom) return;

    function onMove(e) {
      var x = (e.clientX - window.innerWidth / 2) / 80;
      var y = (e.clientY - window.innerHeight / 2) / 80;
      parallaxBottom.style.transform = 'translate(-50%, ' + (y * 2) + 'px)';
    }

    hero.addEventListener('mousemove', onMove, { passive: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initReveal();
      initParallax();
    });
  } else {
    initReveal();
    initParallax();
  }
})();
