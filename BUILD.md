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
│   ├── faq.html                FAQs
│   ├── inquiry.html            Inquiry form (uses body-close-form.html)
│   ├── testimonials.html       Testimonials
│   └── policies.html           Policies
└── services/
    ├── full-planning.html
    ├── day-of-coordinating.html
    ├── mobile-bartending.html
    ├── catering.html
    ├── catering-staffing.html
    └── mobile-food-cart.html
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
1. Create a source file in `src/pages/` (or `src/services/` for service pages)
2. Add the front matter comments (`TITLE`, `DESC`)
3. If the page needs a canonical URL or sitemap entry, it will be handled automatically
4. Run `./build.sh`

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
