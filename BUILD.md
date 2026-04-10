# Build System

This project uses a shell script to assemble HTML pages from shared partials and per-page source files. This eliminates duplicated boilerplate (`<head>` tags, CSS links, script includes) across all 12 pages.

## Quick Start

```bash
# Build for production (default)
./build.sh

# Build for staging
BASE_URL=https://preview.gathercateringandevents.com ./build.sh

# Clean generated files and rebuild
./build.sh --clean
```

## How It Works

Each HTML page served by Nginx is **generated** by `build.sh` from two inputs:

1. **Partials** (`src/_partials/`) — shared HTML fragments (head, body open/close, scripts)
2. **Page sources** (`src/pages/` and `src/services/`) — unique content per page

The build script concatenates partials around each page's content and writes the final HTML to `publish/` (where Nginx expects it). It also generates `sitemap.xml` and `robots.txt`.

## Directory Layout

```
src/
├── _partials/
│   ├── head-top.html           Doctype through viewport meta tag
│   ├── head-bottom.html        Favicon, Google Fonts, 6 CSS links, LocalBusiness JSON-LD
│   ├── body-open.html          <body>, header placeholder, <main>
│   ├── body-close.html         </main>, footer, 3 shared scripts
│   └── body-close-form.html    Same as above + config.js and form.js
├── pages/
│   ├── index.html              Homepage
│   ├── about.html              About Us
│   ├── 404.html                Custom 404 error page
│   ├── faq.html                FAQs (temporarily skipped by build)
│   ├── inquiry.html            Inquiry form (uses body-close-form.html)
│   ├── testimonials.html       Testimonials
│   └── policies.html           Policies (temporarily skipped by build)
├── services/
│   ├── full-planning.html
│   ├── day-of-coordinating.html
│   ├── mobile-bartending.html
│   ├── catering.html
│   ├── catering-staffing.html
│   └── mobile-food-cart.html
└── menus/
    ├── individual-meal.html
    ├── breakfast.html
    ├── lunch.html
    ├── small-bites.html
    ├── breakfast-cart.html
    ├── mac-cart.html
    ├── smash-burger-cart.html
    └── print/                  Standalone print-optimized HTML files (not built by build.sh)
        ├── individual-meal-print.html
        ├── breakfast-print.html
        ├── lunch-print.html
        ├── small-bites-print.html
        ├── breakfast-cart-print.html
        ├── mac-cart-print.html
        └── smash-burger-cart-print.html

gather-menus/
└── pdfs/                       Source PDFs committed to the repo
    ├── individual-meal-menu.pdf
    ├── breakfast-menu.pdf
    ├── lunch-menu.pdf
    ├── small-bites.pdf
    ├── breakfast-cart.pdf
    ├── mac-cart.pdf
    └── smash-burger-cart.pdf
```

## Source File Format

Each source file starts with HTML comment front matter, followed by the page's unique body content:

```html
<!-- TITLE: Page Title | Gather Catering and Events -->
<!-- DESC: Meta description for search engines. -->

    <section class="...">
      ...page content...
    </section>
```

### Extra Scripts

To include additional scripts (currently only `inquiry.html`), add a `SCRIPTS` marker:

```html
<!-- SCRIPTS: form -->
```

This causes the build to use `body-close-form.html` instead of `body-close.html`, which adds `config.js` and `form.js` after the standard three scripts.

## Placeholders

The build system replaces three placeholders at build time:

| Placeholder | Replaced with | Used in |
|-------------|---------------|---------|
| `{{PATH}}` | `""` for root pages, `"../"` for service pages | Partials — resolves relative paths to CSS/JS/images |
| `{{BUILD}}` | Unix timestamp at build time | CSS `<link>` tags — cache-busting |
| `{{BASE_URL}}` | Value of `$BASE_URL` env variable | OG tags, canonical tags, JSON-LD, sitemap, robots.txt |

### BASE_URL

All absolute URL references (OG tags, canonical tags, JSON-LD structured data, sitemap entries, robots.txt sitemap pointer) are driven by a single `BASE_URL` variable. It defaults to the production domain but can be overridden at build time:

```bash
# Production (default)
./build.sh
# → https://gathercateringandevents.com/...

# Staging
BASE_URL=https://preview.gathercateringandevents.com ./build.sh
# → https://preview.gathercateringandevents.com/...
```

Use `{{BASE_URL}}` in any source file or partial where an absolute URL is needed — it will be substituted correctly for whichever environment you're building for.

## Path Handling

Partials use `{{PATH}}` as a placeholder for relative path prefixes:

- **Root pages** (`src/pages/`): `{{PATH}}` is replaced with an empty string → `css/reset.css`
- **Service pages** (`src/services/`): `{{PATH}}` is replaced with `../` → `../css/reset.css`

## Making Changes

### To edit page content
Edit the source file in `src/pages/` or `src/services/`, then run `./build.sh`.

### To add a new CSS file
Add the `<link>` tag to `src/_partials/head-bottom.html`, then run `./build.sh`. All 12 pages will include it.

### To add a new page
1. Create a source file in `src/pages/` (or `src/services/` for service pages, `src/menus/` for menu pages)
2. Add the front matter comments (`TITLE`, `DESC`)
3. If the page needs a canonical URL or sitemap entry, it will be handled automatically
4. Run `./build.sh`

### To update a menu PDF
The PDF download links on menu pages point to `publish/menus/pdfs/`. The source PDFs live in `gather-menus/pdfs/` and are copied into `publish/` by `build.sh`.

To regenerate a PDF after editing a print HTML file:
1. Edit the corresponding file in `src/menus/print/`
2. Serve the project locally (so Google Fonts loads): `python3 -m http.server 8989`
3. Generate the PDF with Chrome headless:
   ```bash
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
     --headless=new --disable-gpu --no-sandbox \
     --print-to-pdf="$(pwd)/gather-menus/pdfs/MENU-NAME.pdf" \
     --print-to-pdf-no-header \
     "http://localhost:8989/src/menus/print/MENU-NAME-print.html"
   ```
4. Kill the HTTP server (`kill $(lsof -ti :8989)`)
5. Run `./build.sh` — this copies the new PDF to `publish/menus/pdfs/`
6. Commit `gather-menus/pdfs/MENU-NAME.pdf` along with the HTML changes

**PDF filenames and their source print files:**

| PDF (`gather-menus/pdfs/`) | Print HTML (`src/menus/print/`) |
|---|---|
| `individual-meal-menu.pdf` | `individual-meal-print.html` |
| `breakfast-menu.pdf` | `breakfast-print.html` |
| `lunch-menu.pdf` | `lunch-print.html` |
| `small-bites.pdf` | `small-bites-print.html` |
| `breakfast-cart.pdf` | `breakfast-cart-print.html` |
| `mac-cart.pdf` | `mac-cart-print.html` |
| `smash-burger-cart.pdf` | `smash-burger-cart-print.html` |

### To add a new script to all pages
Add the `<script>` tag to `src/_partials/body-close.html` (and `body-close-form.html` if it should also appear on the inquiry page).

## Reference Snapshot

The `html-v1/` directory contains a snapshot of all HTML pages as they existed before the build system was introduced. This serves as a permanent reference for comparison.

## Auto-Rebuild During Development

For automatic rebuilds when source files change, use `fswatch` or `entr`:

```bash
# Using entr (brew install entr)
find src/ -name '*.html' | entr ./build.sh

# Using fswatch (brew install fswatch)
fswatch -o src/ | xargs -n1 ./build.sh
```

---

## Deploying to the Server

The site is served by Nginx from `publish/`. After pulling new changes on the server, always run `./build.sh` to regenerate the output — **do not copy `publish/` directly from the repo**, as `build.sh` injects cache-busting timestamps that must be generated fresh on each deploy.

### Deploy steps

```bash
# 1. Pull latest changes
git pull origin main

# 2. Rebuild output (timestamps regenerated, PDFs copied in)
./build.sh

# 3. Copy publish/ to the Nginx web root (adjust path as needed)
rsync -a --delete publish/ /var/www/gather-website/
# OR if Nginx already points at publish/:
#   nothing extra needed — build.sh writes directly to publish/

# 4. Reload Nginx (optional — only needed if nginx.conf changed)
nginx -s reload
```

### What build.sh does on deploy
- Assembles all HTML pages from `src/` partials + page sources into `publish/`
- Injects a fresh Unix timestamp into every CSS/JS URL for cache-busting
- Copies `images/`, `css/`, `js/` into `publish/`
- Copies PDF downloads from `gather-menus/pdfs/` → `publish/menus/pdfs/`
- Generates `publish/sitemap.xml` and `publish/robots.txt`

### Config file (required — not in repo)
`js/config.js` is gitignored (it contains deployment-specific values). It must exist at `publish/js/config.js` on the server. See `api/DEPLOY.md` for details.

### Nginx config
Reference config is at `deploy/nginx.conf`. It disables browser caching for HTML/CSS/JS during active development — adjust `Cache-Control` headers when ready for production caching.
