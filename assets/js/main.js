/**
 * Local Vibes Restaurant - Main JS
 * Component loader, dark mode, scroll progress, mobile menu, scroll-to-top
 */

(function () {
  'use strict';

  function initComponents() {
    initMobileMenu();
    initDarkMode();
    initStickyHeader();
    initScrollProgress();
    initScrollToTop();
    initFooterYear();
    setActiveNavLink();
  }

  function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      const open = menu.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', !open);
      btn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
    });
  }

  function initDarkMode() {
    const toggle = document.getElementById('dark-mode-toggle');
    if (!toggle) return;
    const darkIcon = toggle.querySelector('.dark-icon');
    const lightIcon = toggle.querySelector('.light-icon');
    const saved = localStorage.getItem('local-vibes-dark');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saved === 'true' || (!saved && prefersDark)) {
      document.documentElement.classList.add('dark');
      if (darkIcon) darkIcon.classList.remove('hidden');
      if (lightIcon) lightIcon.classList.add('hidden');
    }
    toggle.addEventListener('click', function () {
      document.documentElement.classList.toggle('dark');
      const isDark = document.documentElement.classList.contains('dark');
      localStorage.setItem('local-vibes-dark', isDark ? 'true' : 'false');
      if (darkIcon) darkIcon.classList.toggle('hidden', !isDark);
      if (lightIcon) lightIcon.classList.toggle('hidden', isDark);
    });
  }

  function initScrollProgress() {
    const bar = document.getElementById('scroll-progress-bar');
    if (!bar) return;
    function update() {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.transform = `scaleX(${p / 100})`;
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initStickyHeader() {
    var header = document.getElementById('main-header');
    if (!header) return;
    function update() {
      if (window.scrollY > 20) {
        header.classList.add('shadow-lg', 'shadow-black/20');
      } else {
        header.classList.remove('shadow-lg', 'shadow-black/20');
      }
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  function initScrollToTop() {
    const btn = document.getElementById('scroll-to-top');
    if (!btn) return;
    function toggle() {
      btn.classList.toggle('opacity-100', window.scrollY > 400);
      btn.classList.toggle('pointer-events-auto', window.scrollY > 400);
      btn.classList.toggle('opacity-0', window.scrollY <= 400);
      btn.classList.toggle('pointer-events-none', window.scrollY <= 400);
    }
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function initFooterYear() {
    const el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  function setActiveNavLink() {
    const current = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('nav a[href]').forEach(function (a) {
      const href = a.getAttribute('href') || '';
      if (href === current || (current === '' && href === 'index.html')) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }

  // Run when DOM ready (navbar/footer are inlined in each page)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }
})();
