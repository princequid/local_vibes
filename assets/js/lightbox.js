/**
 * Local Vibes Restaurant - Gallery lightbox
 */

(function () {
  'use strict';

  var overlay = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  var closeBtn = document.getElementById('lightbox-close');
  var items = document.querySelectorAll('.gallery-item');
  if (!overlay || !img) return;

  function open(src) {
    img.src = src;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function close() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  items.forEach(function (item) {
    item.addEventListener('click', function () {
      var src = item.getAttribute('data-src');
      if (src) open(src);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) close();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) close();
  });
})();
