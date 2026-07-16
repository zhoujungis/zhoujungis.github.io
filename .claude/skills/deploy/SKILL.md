---
name: deploy
description: Use when making changes to this blog project that need deployment — frontend (GitHub Pages), backend (PythonAnywhere), or writing/publishing articles. Triggers on: "deploy", "publish", "发布", "部署", "上线", "write article", "写文章".
---

# Blog Deploy & Publish Workflow

This blog uses: **Vue 3 frontend** → GitHub Pages | **Django backend** → PythonAnywhere (zhoujun123)

## Quick Reference

| Change type | Deploy command |
|-------------|---------------|
| Frontend only | 1. `git push` source → 2. `cd frontend && bash deploy.sh` |
| Backend only | 1. `git push` source → 2. PythonAnywhere `git pull` + Reload |
| **Backend model change** | **Local `makemigrations` → commit → push → PA `migrate` → Reload** (see §3a) |
| New article | Admin panel or CLI script → no deploy needed |
| Add photo to photo wall | Drop image in `frontend/public/photos/` + edit `PhotoWall.vue` → deploy frontend |
| Both frontend + backend | Push source once → deploy frontend → deploy backend |

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

## 1b. Adding Photos to the Photo Wall

Photo-wall images are hosted **inside the site itself** (GitHub Pages), NOT on the
PythonAnywhere backend. This is deliberate: PA's `/media/` static serving is not
configured, so images uploaded to the backend `Photo` model 404. Host photos in the
frontend instead — it always works and needs no PA step.

**Steps:**
1. Copy the image into `frontend/public/photos/` with an **ASCII filename**
   (no spaces or Chinese chars — GitHub Pages/PA both 404 on unicode paths):
   ```bash
   cp "/path/to/My Photo 照片.png" frontend/public/photos/my-photo.png
   ```
2. Add an entry to the `localPhotos` array in
   `frontend/src/pages/PhotoWall.vue` (path is site-root-relative):
   ```js
   const localPhotos = [
     { id: 'tibet-2026', image: '/photos/tibet-2026.png' },
     { id: 'my-photo',  image: '/photos/my-photo.png' },  // optional: title: '标题'
   ]
   ```
   `title` is optional — omit it for no caption (no hover/lightbox text).
3. Deploy the frontend (see section 2): `git push` source → `cd frontend && bash deploy.sh`.
4. Verify: `curl -o /dev/null -w "%{http_code}" https://zhoujungis.github.io/photos/my-photo.png`
   should return `200`. Hard-refresh (Ctrl+Shift+R) to clear the service-worker cache.

> **Backend `Photo` model / `/api/admin/photos/` also exists** (authenticated multipart
> upload, `tools/upload_photo.py`) and `PhotoWall.vue` merges backend photos with
> `localPhotos`. But it only renders if PA serves `/media/` — currently it does not, so
> prefer the local approach above.

## 2. Frontend Deploy (GitHub Pages)

After ANY frontend code change, deploy is a TWO-STEP process:

**Step 1: Push source code to GitHub**
```bash
git add -A
git commit -m "<description>"
git push origin master
```

**Step 2: Build and deploy**
```bash
cd frontend && bash deploy.sh
```

`deploy.sh` does: builds → copies dist/* to repo root → commits deploy → pushes to origin/master.

> **Why two steps?** `deploy.sh` only pushes the built output (dist/*). Source code changes must be pushed separately first, or they stay local and won't be on GitHub.

Wait 1-2 minutes for CDN propagation, then hard-refresh (Ctrl+Shift+R).

**Common frontend changes that need deploy:**
- New pages, components, routes
- Style/theme changes
- New npm dependencies (run `npm install` first)
- Nav/footer/layout changes

## 3. Backend Deploy (PythonAnywhere)

**Step 1: Push source code to GitHub** (same as frontend Step 1)
```bash
git add -A && git commit -m "backend: <description>" && git push origin master
```

**Step 2: PythonAnywhere 网页控制台**
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

### 3a. Backend Model Changes — Read This Before Adding Any Model ⚠️

Editing `models.py` to add a model or field is a **two-commit process**. Forgetting step 1 has caused 500 errors on production (e.g. `ArticleLike` model added without migration → every like request hit "no such table").

**Full workflow for any `models.py` change:**

1. **Local** — generate the migration file:
   ```bash
   cd backend
   export DJANGO_SECRET_KEY='django-insecure-temp'   # bypass prod-only check
   python manage.py makemigrations <app>
   ```
2. **Commit BOTH** `models.py` AND the new `migrations/000X_*.py` file:
   ```bash
   git add backend/<app>/models.py backend/<app>/migrations/
   git commit -m "feat(<app>): <description>"
   git push origin master
   ```
3. **PythonAnywhere** — apply the migration:
   ```bash
   cd ~/zhoujungis.github.io/backend
   git pull origin master
   source venv/bin/activate
   python manage.py migrate            # ← applies the new 000X
   # Web tab → Reload
   ```

**Sanity check after Reload:** hit any endpoint that touches the new model and confirm a 2xx, not 500. If 500 with "no such table" → the migration file wasn't committed or wasn't pulled.

**If you only changed a field on an existing model**, `makemigrations` still produces a migration — the same workflow applies. Django will not auto-detect your edit.

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
