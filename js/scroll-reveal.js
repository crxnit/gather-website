/**
 * Scroll-triggered reveal animations using IntersectionObserver.
 * Add class "reveal" (+ optional modifier like "reveal--slide-up") to any
 * element. When it scrolls into view, "is-visible" is added and the CSS
 * transition plays. Each element is observed only once.
 *
 * Respects prefers-reduced-motion — animations are skipped entirely.
 */

(function () {
  'use strict';

  function showAll() {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.addEventListener('DOMContentLoaded', showAll);
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -30px 0px'
  });

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  });
})();
