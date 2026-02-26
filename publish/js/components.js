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
    { label: 'Policies', href: 'policies.html' }
  ];

  // Single source of truth for testimonials — rendered on index.html and testimonials.html.
  var TESTIMONIALS = [
    {
      quote: 'Josh and Liz were fantastic\u2014communication was smooth, responsive, and reassuring throughout the entire process. They provided an amazing catering experience for me this fall. The food was delicious and a huge hit with our group, and their attention to detail made everything run perfectly. You can tell they truly care about delivering a top-notch experience. Highly recommend!',
      author: 'Amanda S.',
      rating: 5.0
    },
    {
      quote: 'Josh and Liz provided exemplary personalized event support in June 2025 for a 175 person annual mix and mingle. Our guests expect friendly service, delicious fare and we appreciated their punctual arrival, organized \u2018back of house\u2019 prep station and thorough clean-up once they finished. Our non-profit team noticed a difference having their top-notch team oversee all of the set-up/food prep/presentation/refill/clean-up versus other years when our board team tried to manage various parts of the mingie event. With Gather, patrons and organizers alike will be able to enjoy the event fully, start to finish. I highly recommend the Gather team for any event, large or small, to help plan, organize and execute a memorable event experience. We will be recommending Gather within our circles and beyond. Gather now and enjoy!',
      author: 'Deb P.',
      rating: 5.0
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
        ' <a href="' + url('terms-of-use.html') + '">Terms of Use</a>' +
        ' | <a href="' + url('privacy-policy.html') + '">Privacy Policy</a>' +
      '</div>' +
    '</div>';
  }

  /** Render testimonial cards into a #testimonial-cards placeholder. */
  function injectTestimonials() {
    var container = document.getElementById('testimonial-cards');
    if (!container) return;
    var showAll = container.hasAttribute('data-show-all');
    container.innerHTML = TESTIMONIALS.map(function (t) {
      var fullStars = Math.round(t.rating || 5);
      var starHtml = '';
      for (var i = 0; i < fullStars; i++) starHtml += '&#9733;';
      var stars = showAll ? '' :
        '<div class="testimonial-card__stars" aria-label="' + fullStars + ' out of 5 stars">' + starHtml + '</div>';
      var quoteText = t.quote;
      if (!showAll && quoteText.length > 250) {
        var truncated = quoteText.substring(0, 250);
        var lastSpace = truncated.lastIndexOf(' ');
        if (lastSpace > 0) truncated = truncated.substring(0, lastSpace);
        quoteText = truncated + '&#8230; <a href="' + url('testimonials.html') + '" class="testimonial-card__read-more">Read more</a>';
      }
      return '<div class="card testimonial-card reveal reveal--slide-up">' +
        stars +
        '<p class="testimonial-card__quote">' + quoteText + '</p>' +
        '<p class="testimonial-card__author">' + t.author + '</p>' +
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
