/**
 * Local Vibes Restaurant - 3D tilt effect on cards
 * Uses mouse position and CSS transform with perspective
 */

(function () {
  'use strict';

  var tiltCards = document.querySelectorAll('[data-tilt]');
  if (!tiltCards.length) return;

  var tiltAmount = 8;
  var smooth = 0.15;
  var current = {};
  var target = {};

  tiltCards.forEach(function (card) {
    var inner = card.querySelector('.tilt-card-inner');
    if (!inner) inner = card;
    current[card] = { x: 0, y: 0 };
    target[card] = { x: 0, y: 0 };

    card.addEventListener('mouseenter', function () {
      card.classList.add('hover');
    });
    card.addEventListener('mouseleave', function () {
      target[card].x = 0;
      target[card].y = 0;
    });
    card.addEventListener('mousemove', function (e) {
      var rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      target[card].x = -y * tiltAmount;
      target[card].y = x * tiltAmount;
    });
  });

  function animate() {
    tiltCards.forEach(function (card) {
      var c = current[card];
      var t = target[card];
      c.x += (t.x - c.x) * smooth;
      c.y += (t.y - c.y) * smooth;
      var inner = card.querySelector('.tilt-card-inner');
      if (!inner) inner = card;
      inner.style.transform = 'perspective(1000px) rotateX(' + c.x + 'deg) rotateY(' + c.y + 'deg)';
    });
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
})();
