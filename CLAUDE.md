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
| Email/Forms | Go (`api/main.go`) → SMTP relay (`smtp-relay.gmail.com:25`, IP-authenticated) |
| Hosting | Self-hosted Linux containers: Traefik (SSL + reverse proxy) → Nginx (static) + Go API |
| Backend | Go — `api/main.go`; build with `go build -o gather-api .`, run `./gather-api` (listens on :8000) |

### Form Submission Flow
1. User fills out inquiry form on the website
2. Client-side JS POSTs JSON to `https://gathercateringandevents.com/api/submit`
3. FastAPI sends two emails via SMTP relay (from `web-inquiry@gathercateringandevents.com`):
   - **Confirmation** to the submitter — reply-to `catering@gathercateringandevents.com`
   - **Notification** to `catering@gathercateringandevents.com` with full lead details

### Deployment
- Static HTML/CSS/JS files are served directly by Nginx. No build step — edit and deploy.
- Repository: `github.com/crxnit/gather-website` (public, HTTPS clone)
- Server preview directory: `gather-preview`
- Browser caching is disabled via meta tags on all pages (for active development)

## Design System

### Fonts
| Font | Usage |
|------|-------|
| Abril Fatface | "GATHER" brand wordmark, hero heading |
| Poppins | Tagline ("From Dawn to Dusk"), navigation, buttons, business card info |
| Source Sans Pro | Main website body font |

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
2. **Services grid** — 6 service cards (image + title + description + "Learn More" link) in a centered flexbox layout (1→2→3 columns)
3. **Testimonials** (`section--alt`) — 3 testimonial cards with star ratings in a 3-column grid, plus "Read More Reviews" link
4. **CTA** — centered heading + "Request a Quote" button

## Site Structure

### Service Pages (each with its own dedicated page, linked from homepage with image + brief description)
- Full Planning
- "Day Of" Coordinating
- Mobile Bartending
- Catering
- Catering Staffing
- Mobile Food Cart *(Coming Soon — pricing card shows "Coming Soon"; image has a semi-transparent overlay with "Coming Soon" text in brand style)*

### Other Pages
- About Us
- Photo Gallery (future version)
- Testimonials
- FAQs / Common Questions (future version — launch without)
- Policies

### Dynamic Functionality
- **Inquiry Form**: Generic (not wedding-focused), with service checkboxes, write-in budget field, open commentary field. Sends confirmation to submitter and notification to catering@gathercateringandevents.com. Reference: gather.jjocapps.com
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

### Layout Notes
- **Header**: GATHER wordmark only (no logo image), centered with nav links
- **Hero section**: Compact full-width hero with background image (left-focused), logo, heading, and description. No CTA button.
- **Service cards**: Centered flexbox grid — incomplete last row is centered
- **Service detail pages**: All headings and body text centered; bullet lists centered as a block
- **Footer**: Fully centered layout with two vendor badges (The Knot, WeddingWire)
- **Caching**: All HTML pages include no-cache meta tags for development

### Future Versions
- Social media links
- FAQs page
- Photo Gallery
- Pop-ups
