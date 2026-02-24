/**
 * Mobile hamburger menu and dropdown toggle.
 */

(function () {
  'use strict';

  /** Close all open dropdown menus. */
  function closeAllDropdowns() {
    document.querySelectorAll('.nav-dropdown.is-open').forEach(function (dd) {
      dd.classList.remove('is-open');
      const toggle = dd.querySelector('.nav-dropdown-toggle');
      if (toggle) toggle.setAttribute('aria-expanded', 'false');
    });
  }

  /** Close the mobile nav overlay. */
  function closeMobileNav() {
    const nav = document.querySelector('.main-nav.is-open');
    if (!nav) return;
    nav.classList.remove('is-open');
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
      hamburger.classList.remove('is-active');
      hamburger.setAttribute('aria-expanded', 'false');
    }
    document.body.style.overflow = '';
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Single delegated click handler for hamburger, dropdown toggle, and click-outside
    document.addEventListener('click', function (e) {
      // Hamburger toggle
      const hamburger = e.target.closest('.hamburger');
      if (hamburger) {
        const nav = document.querySelector('.main-nav');
        if (!nav) return;
        const isOpen = nav.classList.toggle('is-open');
        hamburger.classList.toggle('is-active', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
        return;
      }

      // Services dropdown toggle
      const toggle = e.target.closest('.nav-dropdown-toggle');
      if (toggle) {
        const dropdown = toggle.closest('.nav-dropdown');
        if (!dropdown) return;
        const isOpen = dropdown.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
        return;
      }

      // Click outside — close open dropdowns
      if (!e.target.closest('.nav-dropdown')) {
        closeAllDropdowns();
      }
    });

    // Escape key: close mobile nav and dropdowns
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      closeMobileNav();
      closeAllDropdowns();
    });

    // Clean up mobile nav state when resizing to desktop
    const desktopQuery = window.matchMedia('(min-width: 768px)');
    desktopQuery.addEventListener('change', function (e) {
      if (e.matches) closeMobileNav();
    });
  });
})();
