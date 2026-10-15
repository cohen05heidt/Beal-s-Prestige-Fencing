#!/usr/bin/env bash
# Build the production copy of the site into dist/ and, with --push, publish it to the
# `deploy` branch, which Hostinger's Git deployment pulls into public_html.
#
#   bash tools/build-deploy.sh          # build and check only
#   bash tools/build-deploy.sh --push   # build, check, and publish
#
# The main branch stays the GitHub Pages client preview (noindex, sample reviews shown).
# The deploy branch is the live site: indexable, canonical URL, no preview-only content.
set -euo pipefail

ORIGIN="https://bealsprestigefence.com"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DIST="$ROOT/dist"
fail() { echo "BUILD FAILED: $*" >&2; exit 1; }

rm -rf "$DIST"
mkdir -p "$DIST/api"
cp -r "$ROOT/assets" "$DIST/"
cp "$ROOT/.htaccess" "$DIST/"
cp "$ROOT/api/quote.php" "$ROOT/api/config.example.php" "$ROOT/api/.htaccess" "$DIST/api/"
sed "s#__ORIGIN__#$ORIGIN#g" "$ROOT/robots.txt" > "$DIST/robots.txt"
sed -e "s#__ORIGIN__#$ORIGIN#g" -e "s#__LASTMOD__#$(date +%F)#" "$ROOT/sitemap.xml" > "$DIST/sitemap.xml"

# index.html: drop the preview-only noindex, add canonical + og:url, make share images absolute
sed -e '/PREVIEW ONLY/d' \
    -e 's#^  <meta name="robots" content="noindex, nofollow">$#  <link rel="canonical" href="__ORIGIN__/">\n  <meta property="og:url" content="__ORIGIN__/">#' \
    -e 's#content="assets/img/og-card.jpg"#content="__ORIGIN__/assets/img/og-card.jpg"#' \
    -e 's#"image": "assets/img/og-card.jpg",#"url": "__ORIGIN__/",\n    "image": "__ORIGIN__/assets/img/og-card.jpg",#' \
    -e 's#"logo": "assets/img/logo.jpg",#"logo": "__ORIGIN__/assets/img/logo.jpg",#' \
    "$ROOT/index.html" | sed "s#__ORIGIN__#$ORIGIN#g" > "$DIST/index.html"

# Guards: the build must not ship preview leftovers, placeholders or secrets
grep -q 'noindex' "$DIST/index.html" && fail "noindex survived in index.html"
grep -rq '__ORIGIN__\|__LASTMOD__' "$DIST" && fail "a placeholder survived"
grep -q "<link rel=\"canonical\" href=\"$ORIGIN/\">" "$DIST/index.html" || fail "canonical link missing"
grep -q "\"url\": \"$ORIGIN/\"" "$DIST/index.html" || fail "JSON-LD url missing"
[ -e "$DIST/api/config.php" ] && fail "config.php must never be in the build"
grep -q 'Your Property.' "$DIST/index.html" || fail "page content missing"

echo "Built $DIST ($(find "$DIST" -type f | wc -l | tr -d ' ') files, $(du -sh "$DIST" | cut -f1))"

if [ "${1:-}" = "--push" ]; then
  REMOTE="$(git -C "$ROOT" remote get-url origin)"
  NAME="$(git -C "$ROOT" config user.name)"
  EMAIL="$(git -C "$ROOT" config user.email)"
  TMP="$(mktemp -d)"
  cp -r "$DIST/." "$TMP/"
  cd "$TMP"
  git init -q -b deploy
  printf 'api/config.php\n' > .gitignore
  git add -A
  git -c user.name="$NAME" -c user.email="$EMAIL" commit -q -m "Built site from main $(git -C "$ROOT" rev-parse --short HEAD)"
  git remote add origin "$REMOTE"
  git push -q --force origin deploy:deploy
  echo "Published to the deploy branch of $REMOTE"
  rm -rf "$TMP"
fi
