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
| Frontend | Plain HTML/CSS/JS — no framework; `build.sh` assembles pages from partials |
| Email/Forms | Go (`api/main.go`) → SMTP relay (`smtp-relay.gmail.com:25`, IP-authenticated) |
| Hosting | Self-hosted Linux containers: Traefik (SSL + reverse proxy) → Nginx (static) + Go API |
| Backend | Go — `api/main.go`; Docker container (see `api/Dockerfile`), listens on :8000 |

### Build System
HTML pages are assembled from shared partials + per-page source files by `build.sh`. See `BUILD.md` for full docs.

| Directory | Purpose |
|-----------|---------|
| `src/_partials/` | Shared HTML fragments (`<head>`, body open/close, scripts) |
| `src/pages/` | Source files for root-level pages (index, about, inquiry, testimonials, terms-of-use, privacy-policy, 404); faq.html and policies.html exist but are temporarily excluded from the build |
| `src/services/` | Source files for the 6 service detail pages |
| `publish/` | Build output — generated HTML pages (root pages + `services/` subdir) |
| `html-v1/` | Pre-build-system HTML snapshot (permanent reference) |

**Workflow:** Edit files in `src/`, run `./build.sh`, generated HTML appears in `publish/`. Source files use comment front matter (`<!-- TITLE: ... -->`, `<!-- DESC: ... -->`). Partials use two placeholders:

| Placeholder | Replaced with | Purpose |
|-------------|---------------|---------|
| `{{PATH}}` | `""` (root) or `"../"` (services) | Relative path prefix for CSS/JS/image references |
| `{{BUILD}}` | Unix timestamp (`date +%s`) | Cache-busting query string appended to all CSS and JS URLs |

Every build produces unique URLs (e.g., `css/base.css?v=1772127832`), forcing browsers to fetch fresh assets.

### Form Submission Flow
1. User fills out inquiry form on the website
2. Client-side JS POSTs JSON to `https://api.gathercateringandevents.com/submit`
3. Go backend validates the request (anti-spam checks, then required fields)
4. Go backend sends two emails via SMTP relay (from `web-inquiry@gathercateringandevents.com`):
   - **Confirmation** to the submitter — reply-to `catering@gathercateringandevents.com`
   - **Notification** to `catering@gathercateringandevents.com` with full lead details

### Anti-Spam Protection
Three zero-friction layers protect the inquiry form from bot submissions:

| Layer | Where | How it works | Rejection |
|-------|-------|-------------|-----------|
| **Honeypot** | Frontend + Go | Hidden `website` field (`.form-hp`, off-screen positioned). Bots fill it; humans don't see it. | Fake 200 success |
| **Time check** | Frontend + Go | JS records page load time, sends `_elapsed` seconds in payload. Rejects if < 3 seconds. | Fake 200 success |
| **Rate limit** | Go only | In-memory IP-based limiter: 5 submissions per IP per hour. IP from `X-Forwarded-For` (Traefik). Background goroutine purges stale entries every 10 min. | Real 429 |

Validation order in `handleSubmit`: decode → rate limit → honeypot → time check → required fields → send emails. Honeypot and time checks return fake success to avoid revealing protection mechanisms.

### CORS Policy
The Go API allows cross-origin requests from both domains and all their subdomains. The `isAllowedOrigin()` function in `api/main.go` matches the `Origin` header against `gathercateringandevents.com` and `gathercafeandevents.com` using domain-suffix matching (e.g., `www.`, `api.`, `preview.` subdomains are all permitted). Nginx does not set CORS headers — static assets are served same-origin.

### SMTP Implementation
The Go API uses `net/textproto` (NOT `net/smtp`) to drive the SMTP conversation. Go's `net/smtp` package hardcodes `EHLO localhost`, which Google's SMTP relay rejects with a 421. Using `net/textproto` lets us send `EHLO gathercateringandevents.com` and control every step of the protocol. See `api/SMTP.md` for full details and debugging history.

### Image Optimization
All served images use `<picture>` elements with WebP `<source>` and JPEG `<img>` fallback. Three size variants exist per image (`images/sm/`, `images/md/`, `images/lg/`) selected via `srcset`. All images are standardized to a **4:3 (2:1.5) aspect ratio** with a maximum width of **1200px**, compressed as progressive JPEG at quality 82, and converted to WebP at quality 82.

| Directory | Purpose |
|-----------|---------|
| `images/sm/` | Small (400×300) — mobile |
| `images/md/` | Medium (800×600) — tablet / service cards |
| `images/lg/` | Large (1200×900) — desktop / hero |
| `images/*/originals/` | Pre-optimization JPEG backups (not served) |
| `images/originals/` | Full-resolution source images (not served) |

Some images have page-specific crops from the same source (e.g., `catering-card.jpg` is a tighter sandwich-focused crop used only on the homepage service card, while `catering.jpg` is used on the catering detail page). Service detail pages may use `object-position` CSS to fine-tune which part of the image is visible within the hero area.

To re-optimize or add images: place source in `images/originals/`, center-crop to 4:3 aspect ratio, create sized JPEGs in `sm/md/lg/`, then generate `.webp` alongside each `.jpg` using Pillow (quality 82, method 6). The `build.sh` copies the entire `images/` directory into `publish/`.

### Deployment
- **Status**: Live at `https://gathercateringandevents.com`
- **Go API**: Docker container (`gather-api`) on the Traefik network, routed via `api.gathercateringandevents.com`. See `api/DEPLOY.md` for build/run instructions.
- **Static site**: `build.sh` generates HTML into `publish/`, served by a shared Nginx container from `/usr/share/nginx/html/gather-final-03-11-2026`
- **Traefik config**: `deploy/traefik-gather.yml` — handles SSL (Let's Encrypt), HSTS, www-stripping, and domain redirects
- **Nginx config**: `deploy/nginx.conf` — site-specific server block in the shared Nginx `conf.d/` directory
- **Repository**: `github.com/crxnit/gather-website` (public, HTTPS clone)
- **Caching**: HTML is no-cache (always fresh); CSS/JS/images use 1-year immutable caching with `?v=TIMESTAMP` cache-busting on every build
- **DNS**: Both domains (`gathercateringandevents.com`, `gathercafeandevents.com`) point to the server; the secondary 301-redirects to the primary
- **SEO**: See `deploy/GOOGLE-SEARCH-CONSOLE.md` for Search Console setup

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
2. **Services grid** — 6 service cards (image + title + description + "Learn More" link) in a centered flexbox layout (1→2→3 columns). Card order: Catering, Mobile Food Cart, Catering Staffing, Mobile Bartending, Day-of Coordinating, Full Planning
3. **Testimonials** (`section--alt`) — 2 real review cards (Amanda S., Deb P.) with star ratings, plus "Read More Reviews" link
4. **CTA** — centered heading + "Request a Quote" button

## Site Structure

### Service Pages (each with its own dedicated page, linked from homepage with image + brief description)
- Catering
- Mobile Food Cart
- Catering Staffing
- Mobile Bartending
- "Day Of" Coordinating
- Full Planning

### Other Pages
- About Us
- Photo Gallery (future version)
- Testimonials
- Terms of Use (footer-only link, not in nav)
- Privacy Policy (footer-only link, not in nav)

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
| `js/components.js` | Injects shared header/footer HTML, testimonials, CTAs; highlights active nav link; exposes `SERVICE_LINKS` via `window.GATHER_SITE` |
| `js/nav.js` | Hamburger menu toggle, services dropdown |
| `js/scroll-reveal.js` | IntersectionObserver-based reveal animations |
| `js/form.js` | Inquiry form validation, service checkbox generation, anti-spam fields (honeypot + elapsed time), submission to Go API |
| `js/config.js` | Deployment-specific config (`.gitignored`) |

### Layout Notes
- **Header**: GATHER wordmark only (no logo image), centered with nav links
- **Hero section**: Compact full-width hero with background image (left-focused), logo, heading, and description. No CTA button.
- **Service cards**: Centered flexbox grid — incomplete last row is centered
- **Service detail pages**: All headings and body text centered; bullet lists centered as a block
- **Footer**: Fully centered layout with two vendor badges (The Knot, WeddingWire); Terms of Use and Privacy Policy links on a separate line below the copyright notice (not in the main nav or footer link grid)
- **Caching**: HTML is no-cache (always serves latest); CSS/JS/images use `immutable` 1-year caching, cache-busted via `?v=TIMESTAMP` appended by `build.sh` on every build (see `deploy/nginx.conf`)

### Future Versions
- Social media links
- FAQs page (source exists at `src/pages/faq.html`, temporarily removed from build/nav/sitemap)
- Policies page (source exists at `src/pages/policies.html`, temporarily removed from build/nav/sitemap)
- Photo Gallery
- Pop-ups
