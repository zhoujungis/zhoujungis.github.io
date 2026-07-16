"""
Publish "Agent 之间，有互联网了！" article to the blog backend.

Usage:
    python tools/publish_octo_article.py
"""

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
CONTENT_FILE = Path(__file__).parent / "octo_article_content.md"

ARTICLE_TITLE = "Agent 之间，有互联网了！"
ARTICLE_SLUG = "agent-network-octo"
ARTICLE_EXCERPT = (
    "这一次，联网的不再是电脑，而是一群会干活的 Agent。"
    "明略科技开源发布 Octo，一个让 Bot、Channel、Thread、Matter "
    "和人共同进入同一套协作系统的 Agent 协作网络。"
    "六个核心协作模式、四个端入口，把 AI 从聊天框里拉进了组织流程。"
)
COVER_IMAGE = (
    "https://images.unsplash.com/photo-1677442136019-21780ecad995"
    "?w=1600&q=80&auto=format&fit=crop"
)

# Category: create if missing
CATEGORY = {
    "name": "科技前沿",
    "slug": "tech-frontier",
    "description": "前沿技术与未来趋势观察",
}

# Tags: (slug, name) — resolved via find-or-create
TAGS = [
    {"slug": "agent",            "name": "Agent"},
    {"slug": "multi-agent",      "name": "多 Agent"},
    {"slug": "octo",             "name": "Octo"},
    {"slug": "minglantech",      "name": "明略科技"},
    {"slug": "ai-collaboration", "name": "AI 协作"},
    {"slug": "open-source",      "name": "开源"},
    {"slug": "future-trends",    "name": "未来趋势"},
]


def api(method: str, path: str, data=None, *, _token: str = None):
    """Authenticated API call."""
    url = f"{API}{path}"
    req = urllib.request.Request(url, method=method)
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {_token or get_token()}")
    if data is not None:
        req.data = json.dumps(data).encode("utf-8")
    try:
        resp = urllib.request.urlopen(req)
        body = resp.read()
        if resp.status == 204 or not body:
            return None
        return json.loads(body)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        print(f"  !! {method} {path} -> {exc.code}: {body[:300]}")
        return None


def find_or_create_category() -> int | None:
    print(f"[category] looking for '{CATEGORY['name']}'")
    cats = api("GET", "/categories/") or []
    for c in cats:
        if c["slug"] == CATEGORY["slug"]:
            print(f"  -> exists, id={c['id']}")
            return c["id"]
    result = api("POST", "/admin/categories/", CATEGORY)
    if result:
        print(f"  -> created, id={result['id']}")
        return result["id"]
    return None


def find_or_create_tags() -> list[int]:
    ids: list[int] = []
    existing = {t["slug"]: t["id"] for t in (api("GET", "/tags/") or [])}
    for tag in TAGS:
        slug = tag["slug"]
        if slug in existing:
            print(f"[tag] '{tag['name']}' exists, id={existing[slug]}")
            ids.append(existing[slug])
            continue
        result = api("POST", "/admin/tags/", tag)
        if result:
            print(f"[tag] '{tag['name']}' created, id={result['id']}")
            ids.append(result["id"])
        else:
            print(f"[tag] FAILED to create '{tag['name']}'")
    return ids


def main():
    print(f"=== Publishing: {ARTICLE_TITLE} ===\n")

    # 1. Resolve category
    category_id = find_or_create_category()

    # 2. Resolve tags
    tag_ids = find_or_create_tags()
    if not tag_ids:
        print("No tags resolved — aborting.")
        sys.exit(1)

    # 3. Read content
    content = CONTENT_FILE.read_text(encoding="utf-8")
    print(f"\n[content] {len(content)} chars from {CONTENT_FILE.name}")

    # 4. Check if slug already exists
    existing = api("GET", f"/articles/{ARTICLE_SLUG}/")
    if existing:
        print(f"\n[article] slug '{ARTICLE_SLUG}' already exists (id={existing['id']}). Updating instead of creating.")
        payload = {
            "title": ARTICLE_TITLE,
            "content": content,
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
        print(f"\n[article] creating new article")
        payload = {
            "title": ARTICLE_TITLE,
            "slug": ARTICLE_SLUG,
            "content": content,
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
            print(f"  -> created, id={result['id']}, slug={result['slug']}")
        else:
            print("  !! create failed")
            sys.exit(1)

    print("\n=== Done ===")
    print(f"Live URL: https://zhoujungis.github.io/article/{ARTICLE_SLUG}")


if __name__ == "__main__":
    main()