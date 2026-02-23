#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────────────────
# build.sh — Assembles final HTML pages from src/ partials and page sources.
#
# Usage:
#   ./build.sh            Build all pages
#   ./build.sh --clean    Remove generated HTML before rebuilding
#
# See BUILD.md for full documentation.
# ──────────────────────────────────────────────────────────────────────────────
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PARTIALS="$SCRIPT_DIR/src/_partials"

# ── Clean mode ────────────────────────────────────────────────────────────────

if [[ "${1:-}" == "--clean" ]]; then
  echo "Cleaning generated HTML..."
  for f in "$SCRIPT_DIR"/src/pages/*.html; do
    rm -f "$SCRIPT_DIR/$(basename "$f")"
  done
  rm -f "$SCRIPT_DIR"/services/*.html
  echo "Cleaned. Rebuilding..."
fi

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

  # Ensure output directory exists
  mkdir -p "$(dirname "$dest")"

  # Assemble the page
  {
    cat "$PARTIALS/head-top.html"
    printf '  <title>%s</title>\n' "$title"
    printf '  <meta name="description" content="%s">\n' "$desc"
    sed "s|{{PATH}}|${path_prefix}|g" "$PARTIALS/head-bottom.html"
    sed "s|{{PATH}}|${path_prefix}|g" "$PARTIALS/body-open.html"
    printf '%s\n' "$body"
    sed "s|{{PATH}}|${path_prefix}|g" "$close"
  } > "$dest"

  echo "  $dest"
}

# ── Build all pages ───────────────────────────────────────────────────────────

echo "Building site..."

# Root-level pages (no path prefix)
for src in "$SCRIPT_DIR"/src/pages/*.html; do
  name="$(basename "$src")"
  build_page "$src" "$SCRIPT_DIR/$name" ""
done

# Service pages (../ prefix for assets)
for src in "$SCRIPT_DIR"/src/services/*.html; do
  name="$(basename "$src")"
  build_page "$src" "$SCRIPT_DIR/services/$name" "../"
done

echo "Done. Built $(ls "$SCRIPT_DIR"/src/pages/*.html "$SCRIPT_DIR"/src/services/*.html 2>/dev/null | wc -l | tr -d ' ') pages."
