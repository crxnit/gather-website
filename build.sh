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

echo "Done. Built $(ls "$SCRIPT_DIR"/src/pages/*.html "$SCRIPT_DIR"/src/services/*.html 2>/dev/null | wc -l | tr -d ' ') pages."
