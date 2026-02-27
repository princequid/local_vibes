/**
 * Local Vibes - 3D flipbook interactions for menu page.
 * Supports click, swipe, keyboard, and button navigation.
 */

(function () {
  'use strict';

  function initMenuFlipbook() {
    const book = document.getElementById('menu-book');
    const pages = Array.from(document.querySelectorAll('#menu-book .page'));
    const previousButton = document.getElementById('menu-prev');
    const nextButton = document.getElementById('menu-next');
    const pageIndicator = document.getElementById('menu-page-indicator');

    if (!book || !pages.length || !previousButton || !nextButton || !pageIndicator) return;

    let currentStep = 0;
    const maxStep = pages.length;
    let touchStartX = 0;
    let touchCurrentX = 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const flipDurationMs = prefersReducedMotion ? 30 : 840;
    let flipTimer = null;
    let isAnimating = false;

    function updateBookState() {
      pages.forEach(function (page, index) {
        const isFlipped = index < currentStep;
        page.classList.toggle('flipped', isFlipped);

        if (page.classList.contains('turning')) {
          return;
        }

        // Flipped sheets stack on the left; remaining sheets stack on the right.
        if (isFlipped) {
          page.style.zIndex = String(index + 1);
        } else {
          page.style.zIndex = String((pages.length - index) + pages.length);
        }
      });

      previousButton.disabled = currentStep === 0;
      nextButton.disabled = currentStep === maxStep;
      pageIndicator.textContent = 'Page ' + (currentStep + 1) + ' / ' + (maxStep + 1);

      const activePageIndex = Math.min(currentStep, maxStep - 1);
      const activePage = pages[activePageIndex];
      const activeTitle = activePage ? activePage.getAttribute('data-page-title') : 'Menu';
      book.setAttribute('aria-label', 'Restaurant menu flipbook, ' + activeTitle + ' page');
    }

    function clearFlipEffects() {
      if (flipTimer) {
        window.clearTimeout(flipTimer);
        flipTimer = null;
      }
      isAnimating = false;
      book.classList.remove('is-flipping', 'flip-next', 'flip-prev');
      pages.forEach(function (page) {
        page.classList.remove('turning', 'curling');
      });
      updateBookState();
    }

    function beginFlip(direction) {
      if (prefersReducedMotion) return true;
      if (isAnimating) return false;

      const targetPage = direction === 'next' ? pages[currentStep] : pages[currentStep - 1];
      if (!targetPage) return false;

      isAnimating = true;
      book.classList.add('is-flipping');
      book.classList.toggle('flip-next', direction === 'next');
      book.classList.toggle('flip-prev', direction === 'prev');

      // Keep turning sheet above both stacks while animating.
      targetPage.style.zIndex = String((pages.length * 4) + 1);
      targetPage.classList.add('turning', 'curling');

      flipTimer = window.setTimeout(function () {
        clearFlipEffects();
      }, flipDurationMs);

      return true;
    }

    function goNext() {
      if (currentStep < maxStep) {
        if (!beginFlip('next')) return;
        currentStep += 1;
        updateBookState();
      }
    }

    function goPrevious() {
      if (currentStep > 0) {
        if (!beginFlip('prev')) return;
        currentStep -= 1;
        updateBookState();
      }
    }

    function onBookClick(event) {
      const target = event.target;
      if (target.closest('.book-controls')) return;

      const rect = book.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickedRightHalf = clickX > rect.width / 2;

      if (clickedRightHalf) {
        goNext();
      } else {
        goPrevious();
      }
    }

    function onTouchStart(event) {
      touchStartX = event.changedTouches[0].clientX;
      touchCurrentX = touchStartX;
    }

    function onTouchMove(event) {
      touchCurrentX = event.changedTouches[0].clientX;
    }

    function onTouchEnd() {
      const swipeDistance = touchCurrentX - touchStartX;
      const minimumSwipeDistance = 45;

      if (Math.abs(swipeDistance) < minimumSwipeDistance) return;
      if (swipeDistance < 0) {
        goNext();
      } else {
        goPrevious();
      }
    }

    function onKeyDown(event) {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        goNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goPrevious();
      } else if (event.key === 'Home') {
        event.preventDefault();
        clearFlipEffects();
        currentStep = 0;
        updateBookState();
      } else if (event.key === 'End') {
        event.preventDefault();
        clearFlipEffects();
        currentStep = maxStep;
        updateBookState();
      }
    }

    book.addEventListener('click', onBookClick, { passive: true });
    book.addEventListener('touchstart', onTouchStart, { passive: true });
    book.addEventListener('touchmove', onTouchMove, { passive: true });
    book.addEventListener('touchend', onTouchEnd, { passive: true });
    book.addEventListener('keydown', onKeyDown);

    previousButton.addEventListener('click', goPrevious);
    nextButton.addEventListener('click', goNext);

    updateBookState();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMenuFlipbook);
  } else {
    initMenuFlipbook();
  }
})();
