# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Website for **Gather Catering and Events** — a catering and event services business.

- Domains: gathercateringandevents.com (preferred), gathercafeandevents.com
- Contact email: info@gathercateringandevents.com
- Requirements doc: `gatherwebsite-requirements.txt`

## Architecture

| Layer | Technology |
|-------|------------|
| Frontend | Plain HTML/CSS/JS — no framework, no build step |
| Email/Forms | Google Apps Script → Google Workspace (info@gathercateringandevents.com) |
| Hosting | Self-hosted Linux containers: Traefik (SSL + reverse proxy) → Nginx (static files) |
| Backend | None initially; FastAPI container available if future features need it |

### Form Submission Flow
1. User fills out inquiry form on the website
2. Client-side JS POSTs form data to a deployed Google Apps Script web app URL
3. Apps Script parses the data and sends email via Google Workspace to info@gathercateringandevents.com
4. Optionally logs submissions to a Google Sheet

### Deployment
- Static HTML/CSS/JS files are served directly by Nginx. No build step — edit and deploy.
- Repository: `github.com/crxnit/gather-website` (public, HTTPS clone)
- Server preview directory: `gather-preview`
- Browser caching is disabled via meta tags on all pages (for active development)

## Design System

### Fonts
| Font | Usage |
|------|-------|
| Abril Fatface | "GATHER" brand wordmark |
| Lucida Calligraphy | "From Dawn to Dusk" tagline |
| Source Sans Pro | Main website font, "Catering and Event Services" |
| Poppins | Business card info |

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Midnight Blue | #2C3E50 | Background |
| Noodles | #F9E3B4 | Title text, link highlight |
| Light Steel Blue | #C9D6EA | General text |
| Rosewood/Muted Rose | #7F515F | Links |

## Homepage Layout

Inspired by [togetherandco.com](https://togetherandco.com). Sections in order:

1. **Full-width hero** (`hero-full`) — compact (35–45vh) background image (`display-table-closeup.jpg`) with dark gradient overlay, centered logo, tagline, heading, and description (no CTA button)
2. **Services grid** — 5 service cards (image + title + description + "Learn More" link) in a centered flexbox layout (1→2→3 columns)
3. **Testimonials** (`section--alt`) — 3 testimonial cards with star ratings in a 3-column grid, plus "Read More Reviews" link
4. **CTA** — centered heading + "Request a Quote" button

## Site Structure

### Service Pages (each with its own dedicated page, linked from homepage with image + brief description)
- Full Planning
- "Day Of" Coordinating
- Mobile Bartending
- Catering
- Catering Staffing

### Other Pages
- About Us
- Photo Gallery (future version)
- Testimonials
- FAQs / Common Questions (future version — launch without)
- Policies

### Dynamic Functionality
- **Inquiry Form**: Generic (not wedding-focused), with service checkboxes, write-in budget field, open commentary field. Submits via email to info@gathercateringandevents.com. Reference: gather.jjocapps.com
- **External Links**: The Knot and Wedding Wire icons linking to their profiles

### CSS Architecture
| File | Purpose |
|------|---------|
| `css/reset.css` | CSS reset |
| `css/variables.css` | Design tokens (colors, fonts, spacing, etc.) |
| `css/base.css` | Typography, global styles, scroll-reveal animations |
| `css/layout.css` | Container, header, nav, grid utilities, footer |
| `css/components.css` | Buttons, cards, forms, testimonial cards |
| `css/pages.css` | Page-specific styles (hero variants, service detail, about, inquiry) |

### JS Architecture
| File | Purpose |
|------|---------|
| `js/components.js` | Injects shared header/footer HTML, highlights active nav link |
| `js/nav.js` | Hamburger menu toggle, services dropdown |
| `js/scroll-reveal.js` | IntersectionObserver-based reveal animations |

### Future Versions
- Social media links
- FAQs page
- Photo Gallery
- Pop-ups
