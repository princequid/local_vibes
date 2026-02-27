/**
 * Local Vibes Restaurant - Menu category filter
 */

(function () {
  'use strict';

  var buttons = document.querySelectorAll('.menu-filter');
  var items = document.querySelectorAll('.menu-item');
  var grid = document.getElementById('menu-grid');
  if (!buttons.length || !items.length || !grid) return;

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var filter = btn.getAttribute('data-filter');
      buttons.forEach(function (b) {
        b.classList.remove('bg-orange-500/20', 'text-orange-400', 'border-orange-500/50');
        b.classList.add('glass', 'border-white/10', 'text-white/80');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.remove('glass', 'border-white/10', 'text-white/80');
      btn.classList.add('bg-orange-500/20', 'text-orange-400', 'border-orange-500/50');
      btn.setAttribute('aria-pressed', 'true');

      grid.style.opacity = '0.6';
      setTimeout(function () {
        items.forEach(function (item) {
          var cat = item.getAttribute('data-category');
          var show = filter === 'all' || cat === filter;
          item.style.display = show ? '' : 'none';
          item.style.opacity = show ? '1' : '0';
          item.style.transform = show ? 'scale(1)' : 'scale(0.95)';
        });
        grid.style.opacity = '1';
      }, 150);
    });
  });
})();
