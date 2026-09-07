"""
Publish Happy Games article to the blog backend.

Usage:
    python tools/publish_happy_games_article.py
"""

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
CONTENT_FILE = Path(__file__).parent / "happy_games_article_content.md"

ARTICLE_TITLE = "快乐小游戏 Happy Games：24 款零框架小游戏的全栈实践与一键部署指南"
ARTICLE_SLUG = "happy-games-24-games-zero-framework-guide"
ARTICLE_EXCERPT = (
    "纯 HTML/CSS/JS 零框架、零构建、自包含游戏设计，集成 GNU Go WASM、Alpha-Beta 剪枝、"
    "多人联机与 AI 流式叙事，基于 Cloudflare Pages + D1 + Functions 的完整全栈实践——"
    "从架构拆解到本地开发再到线上部署，一文讲透 24 款小游戏背后的工程思考。"
)
COVER_IMAGE = "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1600&q=80&auto=format&fit=crop"

CATEGORY = {"name": "项目实践", "slug": "project-practice", "description": "真实项目的全栈实践与复盘"}

TAGS = [
    {"slug": "happy-games", "name": "Happy Games"},
    {"slug": "cloudflare-pages", "name": "Cloudflare Pages"},
    {"slug": "cloudflare-d1", "name": "Cloudflare D1"},
    {"slug": "cloudflare-workers", "name": "Cloudflare Functions"},
    {"slug": "wasm", "name": "WebAssembly"},
    {"slug": "game-dev", "name": "游戏开发"},
    {"slug": "frontend-dev", "name": "前端开发"},
    {"slug": "fullstack", "name": "全栈开发"},
    {"slug": "zero-framework", "name": "零框架"},
    {"slug": "project-practice-tag", "name": "项目实践"},
]

_CACHED_TOKEN = None

def _fetch_token(retries: int = 6) -> str:
    global _CACHED_TOKEN
    if _CACHED_TOKEN:
        return _CACHED_TOKEN
    last_err = None
    for attempt in range(1, retries + 1):
        try:
            _CACHED_TOKEN = get_token()
            return _CACHED_TOKEN
        except Exception as exc:
            last_err = exc
            wait = min(2 ** attempt, 20)
            print(f"  .. token fetch error ({exc.__class__.__name__}) retry {attempt}/{retries} in {wait}s")
            time.sleep(wait)
    raise RuntimeError(f"Could not obtain auth token after {retries} retries: {last_err}")

def api(method: str, path: str, data=None, *, _retries: int = 6):
    url = f"{API}{path}"
    last_err = None
    for attempt in range(1, _retries + 1):
        token = _fetch_token()
        req = urllib.request.Request(url, method=method)
        req.add_header("Content-Type", "application/json")
        req.add_header("Authorization", f"Bearer {token}")
        if data is not None:
            req.data = json.dumps(data).encode("utf-8")
        try:
            resp = urllib.request.urlopen(req, timeout=60)
            body = resp.read()
            if resp.status == 204 or not body:
                return None
            return json.loads(body)
        except urllib.error.HTTPError as exc:
            if exc.code in (500, 502, 503, 504):
                last_err = exc
                wait = min(2 ** attempt, 20)
                body = exc.read().decode("utf-8", errors="replace")
                print(f"  .. HTTP {exc.code} on {method} {path}, retry {attempt}/{_retries} in {wait}s: {body[:200]}")
                time.sleep(wait)
                _CACHED_TOKEN = None
                continue
            # 404 for GET is expected (not found), don't treat as error
            if exc.code == 404:
                return None
            body = exc.read().decode("utf-8", errors="replace")
            print(f"  !! {method} {path} -> {exc.code}: {body[:500]}")
            return None
        except (urllib.error.URLError, OSError) as exc:
            last_err = exc
            wait = min(2 ** attempt, 20)
            print(f"  .. transient error ({exc.__class__.__name__}) on {method} {path}, retry {attempt}/{_retries} in {wait}s")
            time.sleep(wait)
            _CACHED_TOKEN = None
            continue
    print(f"  !! {method} {path} gave up after {_retries} retries: {last_err}")
    return None

def find_or_create_category() -> int | None:
    print(f"[category] looking for '{CATEGORY['name']}' ({CATEGORY['slug']})")
    cats = api("GET", "/categories/") or []
    for c in cats:
        if c["slug"] == CATEGORY["slug"]:
            print(f"  -> exists, id={c['id']}")
            return c["id"]
    result = api("POST", "/admin/categories/", CATEGORY)
    if result:
        print(f"  -> created, id={result['id']}")
        return result["id"]
    print("  !! category create failed, will try without category")
    return None

def find_or_create_tags() -> list[int]:
    ids: list[int] = []
    existing_list = api("GET", "/tags/") or []
    existing = {t["slug"]: t["id"] for t in existing_list}
    print(f"[tags] existing count: {len(existing)}")
    for tag in TAGS:
        slug = tag["slug"]
        if slug in existing:
            print(f"  [tag] '{tag['name']}' exists, id={existing[slug]}")
            ids.append(existing[slug])
            continue
        result = api("POST", "/admin/tags/", tag)
        if result:
            print(f"  [tag] '{tag['name']}' created, id={result['id']}")
            ids.append(result["id"])
        else:
            print(f"  [tag] FAILED to create '{tag['name']}' ({slug})")
    return ids

def main():
    print(f"=== Publishing: {ARTICLE_TITLE} ===\n")
    print(f"API: {API}")
    print(f"Content file: {CONTENT_FILE}")

    # 1. Resolve category
    category_id = find_or_create_category()

    # 2. Resolve tags
    tag_ids = find_or_create_tags()
    if not tag_ids:
        print("No tags resolved — aborting.")
        sys.exit(1)

    # 3. Read content
    if not CONTENT_FILE.exists():
        print(f"Content file not found: {CONTENT_FILE}")
        sys.exit(1)
    content = CONTENT_FILE.read_text(encoding="utf-8")
    print(f"\n[content] {len(content)} chars from {CONTENT_FILE.name}")

    # 4. Check if slug already exists
    existing = api("GET", f"/articles/{ARTICLE_SLUG}/")
    if existing and isinstance(existing, dict) and existing.get("id"):
        print(f"\n[article] slug '{ARTICLE_SLUG}' already exists (id={existing['id']}). Updating.")
        payload = {
            "title": ARTICLE_TITLE,
            "content": content,
            "excerpt": ARTICLE_EXCERPT,
            "status": "published",
            "cover_image": COVER_IMAGE,
        }
        if category_id is not None:
            payload["category_id"] = category_id
        if tag_ids:
            payload["tags_ids"] = tag_ids
        result = api("PUT", f"/admin/articles/{existing['id']}/", payload)
        if result:
            print(f"  -> updated, id={result['id']}")
        else:
            print("  !! update failed")
            sys.exit(1)
    else:
        print(f"\n[article] creating new article (slug: {ARTICLE_SLUG})")
        payload = {
            "title": ARTICLE_TITLE,
            "slug": ARTICLE_SLUG,
            "content": content,
            "excerpt": ARTICLE_EXCERPT,
            "status": "published",
            "cover_image": COVER_IMAGE,
            "is_top": False,
        }
        if category_id is not None:
            payload["category_id"] = category_id
        if tag_ids:
            payload["tags_ids"] = tag_ids
        result = api("POST", "/admin/articles/", payload)
        if result:
            print(f"  -> created, id={result['id']}, slug={result.get('slug')}")
        else:
            print("  !! create failed")
            sys.exit(1)

    print("\n=== Done ===")
    print(f"Live URL: https://zhoujungis.github.io/article/{ARTICLE_SLUG}")
    print(f"API URL: {API}/articles/{ARTICLE_SLUG}/")

if __name__ == "__main__":
    main()
