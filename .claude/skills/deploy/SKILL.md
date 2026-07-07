---
name: deploy
description: Use when making changes to this blog project that need deployment — frontend (GitHub Pages), backend (PythonAnywhere), or writing/publishing articles. Triggers on: "deploy", "publish", "发布", "部署", "上线", "write article", "写文章".
---

# Blog Deploy & Publish Workflow

This blog uses: **Vue 3 frontend** → GitHub Pages | **Django backend** → PythonAnywhere (zhoujun123)

## Quick Reference

| Change type | Deploy command |
|-------------|---------------|
| Frontend only (UI, pages, styles) | `cd frontend && bash deploy.sh` |
| Backend only (API, models, admin) | Push code → PythonAnywhere web reload |
| New article | Admin panel or CLI script → no deploy needed |
| Both frontend + backend | Deploy frontend first, then backend |

## 1. Writing & Publishing Articles

Articles live in the backend database. Publishing does NOT require frontend/backend redeploy.

**Via admin panel (recommended):**
- Go to `https://zhoujungis.github.io/admin/editor` (or `/admin/dashboard`)
- Write in Markdown, set slug/title/category/tags/status
- Set status to "published" to make it live

**Via CLI scripts:**
- `tools/create_article.py` — create articles programmatically via API
- `tools/post_article.py`, `tools/post_article2.py` — post article content
- `tools/update_article.py` — update existing articles
- Scripts talk to `https://zhoujun123.pythonanywhere.com/api/` directly

## 2. Frontend Deploy (GitHub Pages)

After ANY frontend code change (Vue components, styles, router, dependencies):

```bash
cd frontend && bash deploy.sh
```

This single command: builds → copies dist/* to repo root → commits → pushes to origin/master. GitHub Pages serves from repo root. Wait 1-2 minutes for CDN propagation, then hard-refresh (Ctrl+Shift+R).

**Common frontend changes that need deploy:**
- New pages, components, routes
- Style/theme changes
- New npm dependencies (run `npm install` first)
- Nav/footer/layout changes

## 3. Backend Deploy (PythonAnywhere)

After backend code changes (models, views, serializers, settings, new dependencies):

**Step 1: Push code to GitHub**
```bash
git add -A && git commit -m "backend: <description>" && git push origin master
```

**Step 2: PythonAnywhere web console**
1. Open [pythonanywhere.com](https://www.pythonanywhere.com) → **Consoles** → **Bash**
2. Run:
```bash
cd ~/zhoujungis.github.io/backend
git pull origin master
source venv/bin/activate
pip install -r requirements.txt   # if new deps
python manage.py migrate           # if new models
python manage.py collectstatic --noinput
```
3. Go to **Web** tab → click green **Reload** button

**If no model/settings/dependency changes** (e.g. only view logic): just `git pull` + **Reload**.

## 4. Project Structure

```
├── frontend/           # Vue 3 — deployed to GitHub Pages
│   ├── src/pages/      # Page components
│   ├── src/components/ # Shared components
│   ├── src/router/     # Routes
│   ├── deploy.sh       # Build + deploy script
│   └── package.json
├── backend/            # Django — deployed to PythonAnywhere
│   ├── blog_api/       # Django settings
│   ├── articles/       # Article model + API
│   └── manage.py
└── tools/              # CLI article management scripts
```

## Important Notes

- Frontend API calls go to `https://zhoujun123.pythonanywhere.com/api/`
- Backend serves from `zhoujun123.pythonanywhere.com`
- GitHub Pages URL: `https://zhoujungis.github.io`
- PythonAnywhere username: `zhoujun123`
- GitHub Pages serves from repo root (master branch), NOT from `frontend/dist/`
