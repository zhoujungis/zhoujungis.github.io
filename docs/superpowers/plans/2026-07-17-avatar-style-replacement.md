# Avatar Style & Image Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the landscape-photo avatar (`PIC.png`) with a DiceBear `notionists` SVG illustration and strip the decorative circle border + neon glow from both avatar instances, keeping only the circular crop.

**Architecture:** Single-file, deterministic avatar replacement. One SVG file (`PIC.svg`) serves as the new identity image; two Vue components (`About.vue`, `SidePanel.vue`) reference it directly and shed the framed-border CSS. No new dependencies, no utility deletions (the `imageSource` helper stays — `PhotoWall.vue` still uses it).

**Tech Stack:** Vue 3 (Composition API, `<script setup>`), SCSS, Vite, DiceBear 9.x (download-once), GitHub Pages (deploy via existing `frontend/deploy.sh`).

## Global Constraints

- Avatar source: `https://api.dicebear.com/9.x/notionists/svg?seed=zhoujun` — deterministic, must not change seed mid-implementation.
- File format: SVG only (no PNG/AVIF/WebP fallback).
- Shape: `border-radius: 50%` (circular crop preserved).
- Decoration to remove: border, box-shadow, background — none of them remain.
- Both avatar instances (About 160×160, SidePanel 80×80) must use the same `PIC.svg` and identical CSS treatment.
- Do NOT touch `frontend/src/assets/hero.png` (still referenced by `compress-images.mjs`).
- Do NOT delete `frontend/src/utils/imageSource.js` — `PhotoWall.vue` and `imageSource.test.js` still use it.
- One commit per task.

---

## File Structure

| Path | Responsibility | Action |
|---|---|---|
| `PIC.svg` | Avatar identity, repo-root mirror | Create |
| `frontend/public/PIC.svg` | Avatar identity, served by Vite | Create |
| `PIC.png`, `PIC.avif`, `PIC.webp` | Old landscape avatar | Delete |
| `frontend/public/PIC.png` | Old landscape avatar (public mirror) | Delete |
| `frontend/src/pages/About.vue` | About page with avatar | Modify |
| `frontend/src/components/SidePanel.vue` | Sidebar with avatar | Modify |

---

### Task 1: Generate and save new avatar SVG

**Files:**
- Create: `PIC.svg`
- Create: `frontend/public/PIC.svg`

**Interfaces:**
- Consumes: DiceBear CDN URL `https://api.dicebear.com/9.x/notionists/svg?seed=zhoujun`
- Produces: A static SVG file referenced by `<img src="/PIC.svg">` in both `About.vue` and `SidePanel.vue`

- [ ] **Step 1: Download the SVG from DiceBear**

Run from project root (Git Bash):
```bash
curl -sS -o PIC.svg "https://api.dicebear.com/9.x/notionists/svg?seed=zhoujun"
```

Expected: No output, exit code 0.

- [ ] **Step 2: Verify the SVG downloaded correctly**

```bash
head -c 200 PIC.svg
ls -la PIC.svg
```

Expected: First line begins with `<svg xmlns="http://www.w3.org/2000/svg"`, file size roughly 8-12 KB.

- [ ] **Step 3: Mirror to frontend/public**

```bash
cp PIC.svg frontend/public/PIC.svg
ls -la frontend/public/PIC.svg
```

Expected: `frontend/public/PIC.svg` exists, same size as root `PIC.svg`.

- [ ] **Step 4: Commit**

```bash
git add PIC.svg frontend/public/PIC.svg
git commit -m "feat(avatar): add DiceBear notionists SVG avatar (seed=zhoujun)"
```

---

### Task 2: Remove old avatar image files

**Files:**
- Delete: `PIC.png`
- Delete: `PIC.avif`
- Delete: `PIC.webp`
- Delete: `frontend/public/PIC.png`

**Interfaces:**
- Consumes: nothing
- Produces: repo contains only `PIC.svg` as avatar; no stale landscape photo at any URL

- [ ] **Step 1: Delete old avatar files**

```bash
rm -v PIC.png PIC.avif PIC.webp frontend/public/PIC.png
```

Expected: 4 files removed, each line shows the deleted filename.

- [ ] **Step 2: Confirm no PIC.{png,avif,webp} remain**

```bash
find . -maxdepth 4 -name 'PIC.png' -o -name 'PIC.avif' -o -name 'PIC.webp' 2>/dev/null
```

Expected: No output (empty result).

- [ ] **Step 3: Verify only PIC.svg remains**

```bash
find . -maxdepth 4 -name 'PIC.svg'
```

Expected: 2 lines — `./PIC.svg` and `./frontend/public/PIC.svg`.

- [ ] **Step 4: Commit**

```bash
git add -A PIC.png PIC.avif PIC.webp frontend/public/PIC.png
git commit -m "chore(avatar): remove old landscape avatar image files"
```

---

### Task 3: Modify About.vue — strip framed-circle styling, use PIC.svg

**Files:**
- Modify: `frontend/src/pages/About.vue`
  - Template lines 5-29
  - Style lines 130-154
  - `<script setup>` lines 80-95 (remove imageSource import)

**Interfaces:**
- Consumes: `/PIC.svg` (created in Task 1)
- Produces: Avatar block — circular crop, no border/glow, single `<img>` to SVG

- [ ] **Step 1: Replace the avatar template block**

In `frontend/src/pages/About.vue`, replace lines 5-29:

```vue
        <div class="profile-avatar">
          <div class="avatar">
            <img src="/PIC.svg" alt="Zhou Jun" class="avatar-image" />
          </div>
        </div>
```

(The 8-space indent matches the existing surrounding template.)

- [ ] **Step 2: Replace `.profile-avatar`, `.avatar-circle`, `.avatar-image` style block**

In `frontend/src/pages/About.vue`, replace lines 130-154:

```scss
.profile-avatar {
  text-align: center;
  margin-bottom: 20px;
}

.avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  margin: 0 auto;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

Note: removed `.avatar-circle` (its `background`, `border`, `box-shadow` were the "圈圈" decoration).

- [ ] **Step 3: Remove the `getPictureSources` import**

In `frontend/src/pages/About.vue`, delete line 81:

```js
import { getPictureSources } from '@/utils/imageSource'
```

The remaining imports in `<script setup>` (none in this file beyond that one line) stay as-is. If lines 80-95 now contain only the `skills` and `interests` arrays, that is correct.

- [ ] **Step 4: Verify no leftover references**

```bash
grep -nE 'avatar-circle|getPictureSources|PIC\.png' frontend/src/pages/About.vue
```

Expected: No output.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/pages/About.vue
git commit -m "refactor(about): use PIC.svg, drop framed-circle avatar styling"
```

---

### Task 4: Modify SidePanel.vue — strip framed-circle styling, use PIC.svg

**Files:**
- Modify: `frontend/src/components/SidePanel.vue`
  - Template lines 6-8
  - Style lines 189-201

**Interfaces:**
- Consumes: `/PIC.svg` (created in Task 1)
- Produces: Sidebar mini-avatar — circular crop, no border/glow, single `<img>` to SVG

- [ ] **Step 1: Verify current template lines**

The `<div class="avatar">` block is at lines 6-8:

```vue
        <div class="avatar">
          <img src="/PIC.png" alt="Zhou Jun" class="avatar-image" />
        </div>
```

- [ ] **Step 2: Update the img src**

Change line 7 `src="/PIC.png"` → `src="/PIC.svg"`. Result:

```vue
        <div class="avatar">
          <img src="/PIC.svg" alt="Zhou Jun" class="avatar-image" />
        </div>
```

- [ ] **Step 3: Replace the `.avatar` style block**

In `frontend/src/components/SidePanel.vue`, replace lines 189-201:

```scss
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0 auto 12px;
  overflow: hidden;
}
```

Removed: `border: 2px solid $neon-cyan`, `box-shadow: 0 0 10px rgba($neon-cyan, 0.3), 0 0 20px rgba($neon-cyan, 0.1)`, `background: $bg-secondary`, the `display: flex; align-items: center; justify-content: center;` block (no longer needed — single img fills the box).

- [ ] **Step 4: Verify no leftover decoration**

```bash
grep -nE 'neon-cyan|border:|box-shadow:' frontend/src/components/SidePanel.vue | head -20
```

Expected: `.social-link` still references `$neon-cyan` and `.category-count`/`.tag-item` still use border-radius. The `.avatar` block (lines ~189-201) has no `border`, no `box-shadow`, no `$neon-cyan`. Verify by visual inspection of those lines.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/SidePanel.vue
git commit -m "refactor(side-panel): use PIC.svg, drop framed-circle avatar styling"
```

---

### Task 5: Build and verify dist

**Files:**
- Touch (regenerated): `dist/`, `frontend/dist/`, `assets/PIC*.svg`, root `index.html` asset references

**Interfaces:**
- Consumes: Tasks 1-4 changes
- Produces: A built `dist/` directory that includes `PIC.svg` and bundles with new component code

- [ ] **Step 1: Run the production build**

```bash
cd frontend && npm run build
```

Expected: Build completes with no errors. Output mentions `dist/` and shows file sizes.

- [ ] **Step 2: Verify PIC.svg made it into the public output**

```bash
ls -la ../dist/PIC.svg ../dist/assets/PIC*.svg 2>/dev/null
find ../dist -name 'PIC.svg'
```

Expected: `../dist/PIC.svg` exists (mirror from public).

- [ ] **Step 3: Spot-check that the bundled JS no longer references PIC.png**

```bash
grep -l 'PIC\.png' ../dist/assets/*.js 2>/dev/null
```

Expected: No output.

- [ ] **Step 4: Spot-check that bundled CSS no longer ships the old avatar-circle border**

```bash
grep -l 'avatar-circle\|3px solid.*accent-pink' ../dist/assets/*.css 2>/dev/null
```

Expected: No output (or only matches inside source-map files, which is harmless).

- [ ] **Step 5: No commit needed for build output**

`dist/` is gitignored at the repo root (`.gitignore` line 5). Build artifacts are produced and consumed by `deploy.sh` only — they are never committed directly. The deploy script (Task 6) handles commit + push.

---

### Task 6: Deploy via existing deploy script

**Files:**
- Touch (deploy-pushed): remote `master` branch on `origin`
- The deploy script auto-commits with message `deploy: update site YYYY-MM-DD_HH:MM`, then pushes to `origin/master`. It also prunes stale hashed asset chunks from repo root.

**Interfaces:**
- Consumes: Tasks 1-5 changes (built `dist/` + source edits)
- Produces: Updated live site at https://zhoujungis.github.io

- [ ] **Step 1: Run the deploy script**

```bash
cd frontend
./deploy.sh
```

The script:
1. Runs `npm run build`
2. Prunes stale hashed chunks (and the explicitly-named files: `index.html`, `favicon.svg`, `manifest.json`, `sw.js`, `404.html`, `assets/`, `photos/`, `icons.svg`) from repo root
3. Copies fresh `dist/.` to repo root — this brings `dist/PIC.svg` to repo root, overwriting nothing because old PIC files were already deleted in Task 2
4. Commits as `deploy: update site YYYY-MM-DD_HH:MM` and pushes to `origin/master`

**Important:** This script does **not** remove old `PIC.png`/`PIC.avif`/`PIC.webp` from repo root — they will linger as orphans in subsequent deploys. Task 2 deleted them from git tracking, so after the deploy commit they are gone for good.

- [ ] **Step 2: Confirm push succeeded**

```bash
git log --oneline -3 origin/master
```

Expected: Newest commit message starts with `deploy: update site` and a current timestamp.

- [ ] **Step 3: Live verification**

Open `https://zhoujungis.github.io/about` in a browser:
- Avatar is a Notion-style illustration (not the mountain/lake photo).
- Shape is circular.
- No pink border around the avatar.
- No pink glow.

Open `https://zhoujungis.github.io/`:
- Sidebar mini-avatar uses the same illustration.
- No cyan border or cyan glow around it.

Expected: Both pages pass visual inspection.

- [ ] **Step 4: Verify the served SVG URL**

```bash
curl -sI "https://zhoujungis.github.io/PIC.svg" | head -5
```

Expected: HTTP 200, `Content-Type: image/svg+xml`, file size ~10KB.

```bash
curl -sI "https://zhoujungis.github.io/PIC.png" | head -2
```

Expected: HTTP 404 (the old PNG should no longer be served).

---

## Self-Review

**1. Spec coverage:**
- "去掉头像的装饰性圆框" → Tasks 3 & 4 strip `border`, `box-shadow`, `background` ✓
- "保留头像本身的圆形裁剪" → Tasks 3 & 4 keep `border-radius: 50%` ✓
- "替换头像图片" → Task 1 generates `PIC.svg`, Task 2 cleans up old files ✓
- "About 页面和侧边栏的两处头像视觉风格完全一致" → Both reference `/PIC.svg`, both apply identical CSS (just different `width/height`) ✓
- "DiceBear notionists, seed=zhoujun" → Task 1 uses exact URL ✓

**2. Placeholder scan:** No "TBD"/"TODO"/"similar to Task N" — each task has concrete commands and code blocks.

**3. Type consistency:** All references to `PIC.svg` (lowercase extension), `/PIC.svg` (with leading slash for absolute public URL), `<img src="/PIC.svg">` — consistent across Tasks 3 & 4.