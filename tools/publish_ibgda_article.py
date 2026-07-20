"""
Publish IBGDA / WAIC 2026 article to the blog backend.

Usage:
    python tools/publish_ibgda_article.py
"""

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
CONTENT_FILE = Path(__file__).parent / "ibgda_article_content.md"

ARTICLE_TITLE = "不靠英伟达网卡，国产 GPU 直通方案实测出炉：吞吐飙升、延迟砍半"
ARTICLE_SLUG = "ibgda-domestic-gpu-rdma-demo-waic2026"
ARTICLE_EXCERPT = (
    "WAIC 2026 上，奇异摩尔首次亮相即交出五份硬核成绩单。"
    "其中与壁仞联合展示的国产 GPU 直通国产 RDMA 网卡 IBGDA Demo，"
    "实测 All-to-All 延迟压降 44%、吞吐量提升 240%——"
    "这是国产算力首次以可验证方式对标英伟达 ConnectX 的关键一步。"
)
COVER_IMAGE = "https://zhoujungis.github.io/photos/waic-cover.svg"

CATEGORY = {"name": "科技前沿", "slug": "tech-frontier", "description": "前沿技术与未来趋势观察"}

TAGS = [
    {"slug": "ai-compute",       "name": "AI 算力"},
    {"slug": "waic",             "name": "WAIC"},
    {"slug": "ibgda",            "name": "IBGDA"},
    {"slug": "rdma",             "name": "RDMA"},
    {"slug": "domestic-gpu",     "name": "国产 GPU"},
    {"slug": "cpo",              "name": "CPO"},
    {"slug": "super-node",       "name": "超节点"},
    {"slug": "interconnect",     "name": "互联"},
]


def api(method: str, path: str, data=None, *, _token: str = None):
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
        print("\n[article] creating new article")
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
            print(f"  -> created, id={result['id']}, slug={result['slug']}")
        else:
            print("  !! create failed")
            sys.exit(1)

    print("\n=== Done ===")
    print(f"Live URL: https://zhoujungis.github.io/article/{ARTICLE_SLUG}")


if __name__ == "__main__":
    main()