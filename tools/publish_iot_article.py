"""
Publish IoT future article to the blog backend.

Usage:
    python tools/publish_iot_article.py
"""

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
CONTENT_FILE = Path(__file__).parent / "iot_article_content.md"

ARTICLE_TITLE = "万物互联的下一个十年：IoT 行业的未来图景"
ARTICLE_SLUG = "iot-future-next-decade"
ARTICLE_EXCERPT = (
    "2025 年全球 IoT 连接设备突破 200 亿台，市场规模超 5,470 亿美元。"
    "下一个十年，AIoT、边缘计算、数字孪生、5G/6G 等技术将汇聚爆发，"
    "把 IoT 从'远程控制'推向'自主决策'。"
    "本文从市场全景、技术演进、应用场景、挑战隐忧、未来预测五个维度，绘制 IoT 行业的下一个十年图景。"
)
COVER_IMAGE = "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop"

# Category: create if missing
CATEGORY = {"name": "科技前沿", "slug": "tech-frontier", "description": "前沿技术与未来趋势观察"}

# Tags: (slug, name) — ID is resolved after creation / lookup
TAGS = [
    {"slug": "iot",         "name": "IoT"},          # may already exist
    {"slug": "aiot",        "name": "AIoT"},
    {"slug": "edge-compute", "name": "边缘计算"},
    {"slug": "digital-twin", "name": "数字孪生"},
    {"slug": "smart-city",  "name": "智慧城市"},
    {"slug": "smart-home",  "name": "智能家居"},       # may already exist
    {"slug": "future-trends", "name": "未来趋势"},
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
