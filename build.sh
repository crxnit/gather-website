#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# build.sh — Assembles a complete, deployable site in publish/.
#
# Every run wipes publish/ and rebuilds it from scratch:
#   - Copies css/, js/, and images/ into publish/
#   - Assembles all HTML pages from src/ partials and page sources
#
# Usage:
#   ./build.sh        Build the full site
#   ./build.sh --clean    Alias for the above (always a clean build)
#
# See BUILD.md for full documentation.
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PARTIALS="$SCRIPT_DIR/src/_partials"
OUT_DIR="$SCRIPT_DIR/publish"
BUILD_TS="$(date +%s)"

# ── Reset publish/ ────────────────────────────────────────────────────────────

echo "Building site..."
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR/services"

# ── Copy static assets ────────────────────────────────────────────────────────

cp -r "$SCRIPT_DIR/css"    "$OUT_DIR/"
cp -r "$SCRIPT_DIR/js"     "$OUT_DIR/"
cp -r "$SCRIPT_DIR/images" "$OUT_DIR/"

# ── Build function ────────────────────────────────────────────────────────────

build_page() {
  local src="$1"
  local dest="$2"
  local path_prefix="$3"

  # Extract front matter from HTML comments
  local title desc
  title="$(grep '^<!-- TITLE: ' "$src" | sed 's/^<!-- TITLE: \(.*\) -->$/\1/')"
  desc="$(grep '^<!-- DESC: ' "$src" | sed 's/^<!-- DESC: \(.*\) -->$/\1/')"

  # Compute canonical URL from dest path
  local rel_path canonical_url
  rel_path="${dest#$OUT_DIR}"
  if [ "$rel_path" = "/index.html" ]; then
    canonical_url="https://gathercateringandevents.com/"
  else
    canonical_url="https://gathercateringandevents.com${rel_path}"
  fi

  # Extract body content (everything except front matter comments, strip leading blank lines)
  local body
  body="$(grep -v '^<!-- TITLE: \|^<!-- DESC: \|^<!-- SCRIPTS: ' "$src" | sed '/./,$!d')"

  # Choose closing partial based on SCRIPTS marker
  local close="$PARTIALS/body-close.html"
  if grep -q '^<!-- SCRIPTS: form -->' "$src"; then
    close="$PARTIALS/body-close-form.html"
  fi

  # Assemble the page
  {
    cat "$PARTIALS/head-top.html"
    printf '  <title>%s</title>\n' "$title"
    printf '  <meta name="description" content="%s">\n' "$desc"
    printf '  <meta property="og:type" content="website">\n'
    printf '  <meta property="og:site_name" content="Gather Catering and Events">\n'
    printf '  <meta property="og:title" content="%s">\n' "$title"
    printf '  <meta property="og:description" content="%s">\n' "$desc"
    printf '  <meta property="og:image" content="https://gathercateringandevents.com/images/GATHER.jpg">\n'
    printf '  <meta property="og:url" content="%s">\n' "$canonical_url"
    printf '  <link rel="canonical" href="%s">\n' "$canonical_url"
    sed -e "s|{{PATH}}|${path_prefix}|g" -e "s|{{BUILD}}|${BUILD_TS}|g" "$PARTIALS/head-bottom.html"
    sed "s|{{PATH}}|${path_prefix}|g" "$PARTIALS/body-open.html"
    printf '%s\n' "$body"
    sed -e "s|{{PATH}}|${path_prefix}|g" -e "s|{{BUILD}}|${BUILD_TS}|g" "$close"
  } > "$dest"

  echo "  $dest"
}

# ── Build all pages ───────────────────────────────────────────────────────────

# Root-level pages (assets co-located in publish/, no prefix needed)
for src in "$SCRIPT_DIR"/src/pages/*.html; do
  name="$(basename "$src")"
  build_page "$src" "$OUT_DIR/$name" ""
done

# Service pages (../ prefix to reach assets in publish/)
for src in "$SCRIPT_DIR"/src/services/*.html; do
  name="$(basename "$src")"
  build_page "$src" "$OUT_DIR/services/$name" "../"
done

# ── Generate sitemap.xml ──────────────────────────────────────────────────────

TODAY="$(date +%Y-%m-%d)"
{
  printf '<?xml version="1.0" encoding="UTF-8"?>\n'
  printf '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  printf '  <url><loc>https://gathercateringandevents.com/</loc><lastmod>%s</lastmod><priority>1.0</priority></url>\n' "$TODAY"
  for page in about faq inquiry policies testimonials; do
    printf '  <url><loc>https://gathercateringandevents.com/%s.html</loc><lastmod>%s</lastmod><priority>0.8</priority></url>\n' "$page" "$TODAY"
  done
  for service in catering-staffing catering day-of-coordinating full-planning mobile-bartending mobile-food-cart; do
    printf '  <url><loc>https://gathercateringandevents.com/services/%s.html</loc><lastmod>%s</lastmod><priority>0.9</priority></url>\n' "$service" "$TODAY"
  done
  printf '</urlset>\n'
} > "$OUT_DIR/sitemap.xml"
echo "  $OUT_DIR/sitemap.xml"

# ── Copy robots.txt ───────────────────────────────────────────────────────────

cp "$SCRIPT_DIR/robots.txt" "$OUT_DIR/robots.txt"
echo "  $OUT_DIR/robots.txt"

echo "Done. Built $(ls "$SCRIPT_DIR"/src/pages/*.html "$SCRIPT_DIR"/src/services/*.html 2>/dev/null | wc -l | tr -d ' ') pages."
