/**
 * Shared header and footer injection.
 * Each page includes <header id="site-header"></header>
 * and <footer id="site-footer"></footer> as placeholders.
 */

(function () {
  'use strict';

  // Determine path prefix based on page location relative to site root.
  // Pages in subdirectories (e.g. /services/) need '../' to reach root assets.
  const pathSegments = window.location.pathname.replace(/\/[^/]*\.html$/, '').split('/').filter(Boolean);
  const prefix = pathSegments.length > 0 && window.location.pathname.includes('/services/') ? '../' : '';

  /** Helper: prepend the path prefix to a relative path. */
  function url(path) {
    return prefix + path;
  }

  // Single source of truth for navigation links — used by both header and footer.
  const SERVICE_LINKS = [
    { label: 'Full Planning', href: 'services/full-planning.html' },
    { label: 'Day-Of Coordinating', href: 'services/day-of-coordinating.html' },
    { label: 'Mobile Bartending', href: 'services/mobile-bartending.html' },
    { label: 'Catering', href: 'services/catering.html' },
    { label: 'Catering Staffing', href: 'services/catering-staffing.html' }
  ];

  const PAGE_LINKS = [
    { label: 'About Us', href: 'about.html' },
    { label: 'Testimonials', href: 'testimonials.html' },
    { label: 'Policies', href: 'policies.html' }
  ];

  function buildServiceDropdownItems() {
    return SERVICE_LINKS.map(function (link) {
      return '<li><a href="' + url(link.href) + '">' + link.label + '</a></li>';
    }).join('\n              ');
  }

  function buildFooterLinks() {
    return SERVICE_LINKS.concat(PAGE_LINKS).map(function (link) {
      return '<a href="' + url(link.href) + '">' + link.label + '</a>';
    }).join('\n        ');
  }

  function getHeaderHTML() {
    return '<div class="header-inner">' +
      '<a href="' + url('index.html') + '" class="header-logo" aria-label="Gather Home">' +
        '<img src="' + url('images/logos/sm/Gather.png') + '" alt="Gather Logo" width="50" height="50">' +
        '<span class="brand-wordmark">GATHER</span>' +
      '</a>' +
      '<button class="hamburger" aria-label="Toggle menu" aria-expanded="false">' +
        '<span></span><span></span><span></span>' +
      '</button>' +
      '<nav class="main-nav" aria-label="Main navigation">' +
        '<ul class="nav-list">' +
          '<li><a href="' + url('index.html') + '">Home</a></li>' +
          '<li class="nav-dropdown">' +
            '<button class="nav-dropdown-toggle" aria-expanded="false">' +
              'Services <span class="arrow" aria-hidden="true">&#9660;</span>' +
            '</button>' +
            '<ul class="nav-dropdown-menu">' +
              buildServiceDropdownItems() +
            '</ul>' +
          '</li>' +
          PAGE_LINKS.map(function (link) {
            return '<li><a href="' + url(link.href) + '">' + link.label + '</a></li>';
          }).join('') +
          '<li><a href="' + url('inquiry.html') + '" class="btn btn--primary nav-cta">Get a Quote</a></li>' +
        '</ul>' +
      '</nav>' +
    '</div>';
  }

  function getFooterHTML() {
    return '<div class="footer-inner">' +
      '<div class="footer-brand">' +
        '<div class="brand-wordmark">GATHER</div>' +
        '<div class="brand-tagline">From Dawn to Dusk</div>' +
      '</div>' +
      '<nav class="footer-links" aria-label="Footer navigation">' +
        buildFooterLinks() +
      '</nav>' +
      '<div class="footer-external">' +
        '<a href="https://www.theknot.com/marketplace/gather-from-dawn-to-dusk-cincinnati-oh-2101040" target="_blank" rel="noopener noreferrer">The Knot</a>' +
        '<a href="https://www.weddingwire.com/biz/gather-from-dawn-to-dusk/4e3cac205c612625.html" target="_blank" rel="noopener noreferrer">Wedding Wire</a>' +
      '</div>' +
      '<div class="footer-badges" id="footer-badges">' +
        '<a target="_blank" rel="noopener noreferrer" href="https://www.theknot.com/marketplace/redirect-2101040?utm_source=vendor_website&utm_medium=banner&utm_term=87bd69e8-b22e-41de-bda9-54f66256cf42&utm_campaign=vendor_badge_assets"><img alt="As Seen on The Knot" src="https://d13ns7kbjmbjip.cloudfront.net/For_Your_Website/TK-badge_AsSeen.png" width="190"></a>' +
        '<a target="_blank" rel="noopener noreferrer" href="https://www.theknot.com/marketplace/redirect-2101040?utm_source=vendor_website&utm_medium=banner&utm_term=87bd69e8-b22e-41de-bda9-54f66256cf42&utm_campaign=vendor_badge_assets"><img alt="Review us on The Knot" src="https://d13ns7kbjmbjip.cloudfront.net/For_Your_Website/TK-badge_ReviewUs.png" width="190"></a>' +
        '<a target="_blank" rel="noopener noreferrer" href="https://www.theknot.com/marketplace/redirect-2101040?utm_source=vendor_website&utm_medium=banner&utm_term=87bd69e8-b22e-41de-bda9-54f66256cf42&utm_campaign=vendor_badge_assets"><img alt="Couples love us! See our reviews on The Knot." src="https://d13ns7kbjmbjip.cloudfront.net/For_Your_Website/TK-badge_ReadReviews.png" width="190"></a>' +
        '<a target="_blank" rel="noopener noreferrer" href="https://www.weddingwire.com" title="Find us on WeddingWire"><img alt="Find us on WeddingWire" src="https://www.weddingwire.com/images/sellos/partner--pp2223242.png" srcset="https://www.weddingwire.com/images/sellos/partner--pp2223242.png 1x, https://www.weddingwire.com/images/sellos/partner--pp2223242.png?largeImg=true 2x"></a>' +
      '</div>' +
      '<div class="footer-contact">' +
        '<a href="mailto:info@gathercateringandevents.com">info@gathercateringandevents.com</a>' +
      '</div>' +
      '<div class="footer-copyright">' +
        '&copy; ' + new Date().getFullYear() + ' Gather Catering and Events. All rights reserved.' +
      '</div>' +
    '</div>';
  }

  // Inject on DOM ready
  document.addEventListener('DOMContentLoaded', function () {
    const header = document.getElementById('site-header');
    const footer = document.getElementById('site-footer');

    if (header) {
      header.classList.add('site-header');
      header.innerHTML = getHeaderHTML();
    }

    if (footer) {
      footer.classList.add('site-footer');
      footer.innerHTML = getFooterHTML();
    }

    // Highlight active nav link.
    // Normalize currentPath to just the filename (or path from root) for reliable matching.
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-list a, .nav-dropdown-menu a').forEach(function (link) {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      // Strip prefix to get the canonical path, then check if currentPath ends with it
      const canonical = href.replace(/^(\.\.\/)+/, '');
      if (canonical && currentPath.indexOf(canonical) !== -1) {
        link.classList.add('active');
      }
    });
  });
})();
