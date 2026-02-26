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
| `src/pages/` | Source files for root-level pages (index, about, inquiry, testimonials, policies, terms-of-use, privacy-policy) |
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
2. Client-side JS POSTs JSON to `https://gathercateringandevents.com/api/submit`
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
All served images use `<picture>` elements with WebP `<source>` and JPEG `<img>` fallback. Three size variants exist per image (`images/sm/`, `images/md/`, `images/lg/`) selected via `srcset`. Large images are capped at 1400px wide, compressed as progressive JPEG at quality 82, and converted to WebP at quality 82.

| Directory | Purpose |
|-----------|---------|
| `images/sm/` | Small (400px wide) — mobile |
| `images/md/` | Medium (612–800px wide) — tablet / service cards |
| `images/lg/` | Large (1400px wide) — desktop / hero |
| `images/*/originals/` | Pre-optimization JPEG backups (not served) |
| `images/originals/` | Full-resolution source images (not served) |

To re-optimize or add images: place source in `images/originals/`, create sized JPEGs in `sm/md/lg/`, then generate `.webp` alongside each `.jpg` using Pillow (quality 82, method 6). The `build.sh` copies the entire `images/` directory into `publish/`.

### Deployment
- **Go API**: Docker container — `docker build -t gather-api ./api && docker run -d --name gather-api -p 8000:8000 gather-api`. See `api/DEPLOY.md` for full instructions including Traefik integration.
- Static HTML is generated by `build.sh` and served by Nginx
- Repository: `github.com/crxnit/gather-website` (public, HTTPS clone)
- Server preview directory: `gather-preview`
- Browser caching is disabled via meta tags and Nginx headers (for active development)

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
- Terms of Use
- Privacy Policy

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
- **Footer**: Fully centered layout with two vendor badges (The Knot, WeddingWire); Terms of Use and Privacy Policy links appear inline next to the copyright notice (not in the main nav or footer link grid)
- **Caching**: Aggressively disabled for development — Nginx disables ETags, If-Modified-Since, and Last-Modified; sends `no-cache, no-store, must-revalidate` on all HTML/CSS/JS; `build.sh` appends `?v=TIMESTAMP` to every CSS/JS reference for cache-busting (see `deploy/nginx.conf`)

### Future Versions
- Social media links
- FAQs page
- Photo Gallery
- Pop-ups
