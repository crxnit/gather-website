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
    { label: 'Catering Staffing', href: 'services/catering-staffing.html' },
    { label: 'Mobile Food Cart', href: 'services/mobile-food-cart.html' }
  ];

  const PAGE_LINKS = [
    { label: 'About Us', href: 'about.html' },
    { label: 'Testimonials', href: 'testimonials.html' },
    { label: 'FAQs', href: 'faq.html' },
    { label: 'Policies', href: 'policies.html' },
    { label: 'Terms of Use', href: 'terms-of-use.html' },
    { label: 'Privacy Policy', href: 'privacy-policy.html' }
  ];

  // Single source of truth for testimonials — rendered on index.html and testimonials.html.
  var TESTIMONIALS = [
    {
      quote: 'Gather made our corporate holiday party an absolute hit. The food was incredible, the staff was professional, and everything ran like clockwork. We\u2019ve already booked them for next year!',
      author: 'Sarah M.',
      event: 'Corporate Holiday Party'
    },
    {
      quote: 'We hired Gather for day-of coordination and it was the best decision we made. They handled every detail with such grace and allowed us to truly enjoy our wedding day without any stress.',
      author: 'James &amp; Emily R.',
      event: 'Wedding Reception'
    },
    {
      quote: 'The mobile bartending service was a huge hit at our fundraiser. The custom cocktail menu was creative and delicious, and the bartenders were engaging and professional. Highly recommend!',
      author: 'Michael T.',
      event: 'Charity Fundraiser Gala'
    },
    {
      quote: 'From the very first meeting to the last guest leaving, Gather\u2019s full planning service exceeded our expectations. They understood our vision perfectly and brought it to life beautifully.',
      author: 'Amanda &amp; David L.',
      event: 'Anniversary Celebration'
    }
  ];

  // Expose shared data so other scripts (e.g. form.js) can access it.
  window.GATHER_SITE = { SERVICE_LINKS: SERVICE_LINKS };

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
        '<a target="_blank" rel="noopener noreferrer" href="https://www.theknot.com/marketplace/redirect-2101040?utm_source=vendor_website&utm_medium=banner&utm_term=87bd69e8-b22e-41de-bda9-54f66256cf42&utm_campaign=vendor_badge_assets"><img alt="Review us on The Knot" src="https://d13ns7kbjmbjip.cloudfront.net/For_Your_Website/TK-badge_ReviewUs.png" width="190"></a>' +
        '<a target="_blank" rel="noopener noreferrer" href="https://www.weddingwire.com/biz/gather-from-dawn-to-dusk/4e3cac205c612625.html" title="Find us on WeddingWire"><img alt="Find us on WeddingWire" src="https://www.weddingwire.com/images/sellos/partner--pp2223242.png" srcset="https://www.weddingwire.com/images/sellos/partner--pp2223242.png 1x, https://www.weddingwire.com/images/sellos/partner--pp2223242.png?largeImg=true 2x"></a>' +
      '</div>' +
      '<div class="footer-contact">' +
        '<a href="mailto:info@gathercateringandevents.com">info@gathercateringandevents.com</a>' +
      '</div>' +
      '<div class="footer-copyright">' +
        '&copy; ' + new Date().getFullYear() + ' Gather Catering and Events. All rights reserved.' +
      '</div>' +
    '</div>';
  }

  /** Render testimonial cards into a #testimonial-cards placeholder. */
  function injectTestimonials() {
    var container = document.getElementById('testimonial-cards');
    if (!container) return;
    var showAll = container.hasAttribute('data-show-all');
    var items = showAll ? TESTIMONIALS : TESTIMONIALS.filter(function (_, i) { return i !== 2; });
    container.innerHTML = items.map(function (t) {
      var stars = showAll ? '' :
        '<div class="testimonial-card__stars" aria-label="5 out of 5 stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>';
      return '<div class="card testimonial-card reveal reveal--slide-up">' +
        stars +
        '<p class="testimonial-card__quote">' + t.quote + '</p>' +
        '<p class="testimonial-card__author">' + t.author + '</p>' +
        '<p class="testimonial-card__event">' + t.event + '</p>' +
        '</div>';
    }).join('');
  }

  /** Render CTA sections from [data-cta] placeholder elements. */
  function injectCTAs() {
    document.querySelectorAll('[data-cta]').forEach(function (el) {
      var heading = el.getAttribute('data-heading');
      var desc = el.getAttribute('data-description');
      var btnText = el.getAttribute('data-button-text') || 'Request a Quote';
      var btnStyle = el.getAttribute('data-button-style') || 'btn--primary';
      var inner = '<h2>' + heading + '</h2>' +
        '<p>' + desc + '</p>' +
        '<a href="' + url('inquiry.html') + '" class="btn ' + btnStyle + ' btn--lg">' + btnText + '</a>';
      var node;
      if (el.hasAttribute('data-cta-inline')) {
        // Service detail pages: render as a div inside the existing container.
        node = document.createElement('div');
        node.className = 'service-detail__cta reveal reveal--fade';
      } else {
        // Standalone pages: render as a full section with container.
        node = document.createElement('section');
        node.className = 'section section--cta text-center reveal reveal--fade';
        inner = '<div class="container">' + inner + '</div>';
      }
      node.innerHTML = inner;
      el.replaceWith(node);
    });
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

    injectTestimonials();
    injectCTAs();

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
