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
# M9: rsync --delete ensures removed chunks/files actually go away from the
# repo root, otherwise old hashed assets accumulate forever.
rsync -a --delete --exclude='.git' --exclude='.gitignore' --exclude='README.md' \
      --exclude='backend' --exclude='frontend' --exclude='tools' --exclude='docs' \
      --exclude='.claude' --exclude='_articles.json' --exclude='_*.json' \
      dist/ ../

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
