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

echo "==> Copying build output to repo root..."
cp -r dist/* ../

# Copy live2d files if they exist
if [ -d "../public-live2d" ]; then
  echo "==> Copying Live2D assets..."
  cp -r ../public-live2d/* ../live2dw/ 2>/dev/null || true
fi

cd ..

echo "==> Committing and pushing..."
git add -A
git commit -m "deploy: update site $(date +%Y-%m-%d_%H:%M)" || echo "No changes to commit"
git push origin master

echo "==> Deployed to GitHub Pages!"
