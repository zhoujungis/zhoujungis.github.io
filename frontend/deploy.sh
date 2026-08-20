#!/bin/bash
set -e

# frontend/deploy.sh — Build Vue 3 frontend and deploy to GitHub Pages
#
# Usage: cd frontend && bash deploy.sh
#
# This script:
#   1. Builds the Vue 3 app with Vite
#   2. Copies dist/ output to the repository root (where GitHub Pages serves from)
#   3. Copies Live2D assets if they exist
#   4. Commits and pushes to origin/master

cd "$(dirname "$0")"

echo "==> Building frontend..."
npm run build

echo "==> Cleaning stale build artifacts in repo root..."
# M9: prune hashed asset files that the new build no longer references,
# otherwise old chunks accumulate in repo root forever. rsync isn't on
# GitHub for Windows by default — fall back to a targeted rm + cp.
ROOT="$(cd .. && pwd)"
# Remove only the output files Vite produces. Keep repo-root content intact
# (README, .gitignore, backend/, frontend/, tools/, docs/, .claude/, etc.).
rm -f  "$ROOT"/index.html \
       "$ROOT"/favicon.svg \
       "$ROOT"/manifest.json \
       "$ROOT"/sw.js \
       "$ROOT"/404.html
rm -rf "$ROOT/assets"
rm -rf "$ROOT/photos"
rm -rf "$ROOT/icons.svg" 2>/dev/null || true
cp -r dist/. "$ROOT/"

# P5: the old "copy public-live2d → live2dw" step produced a redundant third
# copy of the L2Dwidget library that nothing referenced (leftover from a hexo
# setup). The site loads Live2D from /live2d/, which ships from
# frontend/public/live2d/ via the Vite build — one copy is enough.

cd ..

echo "==> Committing and pushing..."
git add -A
git commit -m "deploy: update site $(date +%Y-%m-%d_%H:%M)" || echo "No changes to commit"
git push origin master

echo "==> Deployed to GitHub Pages!"
