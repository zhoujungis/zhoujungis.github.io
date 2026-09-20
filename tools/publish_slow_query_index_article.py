"""Publish the slow-query / index-tuning article to the blog backend.

Usage:
    python tools/publish_slow_query_index_article.py
    python tools/publish_slow_query_index_article.py --cover <url>   # 临时换封面
    python tools/publish_slow_query_index_article.py --skip-cover-check

Idempotent by slug: an existing article is updated instead of duplicated.
Credentials are read by ``tools._auth`` from the environment or ``tools/.env``.

Source Markdown: ``article/django-slow-query-index-tuning.md``.

Tags are resolved by slug first, then by name, so this script reuses the
existing ``django`` / ``backend-dev`` / ``database`` tags instead of creating
near-duplicate ones.

The cover is checked with a HEAD request before publishing: a 404 cover shows
up as a broken banner on the article page (``ArticleDetail.vue`` has no
``@error`` fallback), so failing loudly here is better than shipping it.
"""

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
SOURCE = (
    Path(__file__).resolve().parent.parent
    / "article"
    / "django-slow-query-index-tuning.md"
)

ARTICLE_TITLE = "索引建了，为什么排序还是没用上？——慢查询实战"
ARTICLE_SLUG = "django-slow-query-index-tuning"
ARTICLE_EXCERPT = (
    "N+1 修完了，列表页只剩 2 条 SQL，为什么还是慢？造 100 万行实测发现："
    "线上那个索引建了等于没建，加列反而更慢；把 ORDER BY 的方向对齐，快 2600 倍。"
    "一篇讲透索引有序性、最左前缀与慢查询排查法的深度长文。"
)
# Self-hosted SVG cover, committed to the repo root (served by GitHub Pages).
# Must be pushed before this script will publish it — see the HEAD check below.
ARTICLE_COVER = "https://zhoujungis.github.io/photos/django-slow-query-index-cover.svg"

CATEGORY = {"name": "技术教程", "slug": "tech", "description": "技术教程"}

TAGS = [
    {"slug": "django", "name": "Django"},
    {"slug": "backend-dev", "name": "后端"},
    {"slug": "database", "name": "数据库"},
    {"slug": "performance", "name": "性能优化"},
]


def strip_frontmatter(md: str) -> str:
    """Remove a leading YAML frontmatter block if present."""
    return re.sub(r"^---\n.*?\n---\n", "", md, flags=re.S).strip()


def api(method: str, path: str, data=None):
    request = urllib.request.Request(f"{API}{path}", method=method)
    request.add_header("Content-Type", "application/json")
    request.add_header("Authorization", f"Bearer {get_token()}")
    if data is not None:
        request.data = json.dumps(data, ensure_ascii=False).encode("utf-8")
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            body = response.read()
            if not body or response.status == 204:
                return None
            return json.loads(body)
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        print(f"{method} {path} -> HTTP {error.code}: {detail[:500]}", file=sys.stderr)
        return None
    except urllib.error.URLError as error:
        print(f"{method} {path} -> connection error: {error}", file=sys.stderr)
        return None


def paginated(path: str) -> list:
    """Return every item of a possibly paginated list endpoint."""
    data = api("GET", path)
    if isinstance(data, dict) and "results" in data:
        items = list(data["results"])
        url = data.get("next")
        while url:
            request = urllib.request.Request(url, method="GET")
            request.add_header("Authorization", f"Bearer {get_token()}")
            with urllib.request.urlopen(request, timeout=60) as response:
                data = json.loads(response.read())
            items.extend(data.get("results", []))
            url = data.get("next")
        return items
    return data or []


def cover_is_live(url: str) -> bool:
    """HEAD the cover URL. Returns True only on a 2xx response."""
    request = urllib.request.Request(url, method="HEAD")
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return 200 <= response.status < 300
    except (urllib.error.HTTPError, urllib.error.URLError) as error:
        print(f"  cover check failed: {error}", file=sys.stderr)
        return False


def category_id() -> int | None:
    for item in paginated("/categories/"):
        if item.get("slug") == CATEGORY["slug"]:
            return item["id"]
    created = api("POST", "/admin/categories/", CATEGORY)
    return created.get("id") if created else None


def tag_ids() -> list[int]:
    """Resolve tags by slug, then by name, then create."""
    existing = paginated("/tags/")
    by_slug = {item["slug"]: item["id"] for item in existing}
    by_name = {item["name"]: item["id"] for item in existing}

    ids = []
    for tag in TAGS:
        if tag["slug"] in by_slug:
            ids.append(by_slug[tag["slug"]])
            print(f"  tag {tag['name']}: reused slug {tag['slug']} (id={by_slug[tag['slug']]})")
            continue
        if tag["name"] in by_name:
            ids.append(by_name[tag["name"]])
            print(f"  tag {tag['name']}: reused name -> id={by_name[tag['name']]}")
            continue
        created = api("POST", "/admin/tags/", tag)
        if created:
            ids.append(created["id"])
            print(f"  tag {tag['name']}: created id={created['id']}")
    return ids


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--cover", default=ARTICLE_COVER, help="override cover_image URL")
    parser.add_argument("--skip-cover-check", action="store_true")
    args = parser.parse_args()

    if not SOURCE.exists():
        raise SystemExit(f"Source Markdown not found: {SOURCE}")
    content = strip_frontmatter(SOURCE.read_text(encoding="utf-8"))
    print(f"Source: {SOURCE.name} ({len(content)} chars)")

    print(f"Cover: {args.cover}")
    if not args.skip_cover_check and not cover_is_live(args.cover):
        raise SystemExit(
            "Cover URL is not reachable — refusing to publish.\n"
            "  If it is a repo-hosted asset, commit and push it first.\n"
            "  Use --skip-cover-check to override."
        )

    category = category_id()
    tags = tag_ids()
    if not tags:
        raise SystemExit("No article tags could be resolved; aborting.")

    payload = {
        "title": ARTICLE_TITLE,
        "content": content,
        "excerpt": ARTICLE_EXCERPT,
        "cover_image": args.cover,
        "status": "published",
        "is_top": False,
        "tags_ids": tags,
    }
    if category is not None:
        payload["category_id"] = category

    existing = api("GET", f"/articles/{ARTICLE_SLUG}/")
    if existing:
        result = api("PUT", f"/admin/articles/{existing['id']}/", payload)
        action = "updated"
    else:
        payload["slug"] = ARTICLE_SLUG
        result = api("POST", "/admin/articles/", payload)
        action = "created"

    if not result:
        raise SystemExit("Article API request failed.")
    print(f"Article {action}: {result.get('id')} {result.get('slug', ARTICLE_SLUG)}")
    print(f"Cover: {result.get('cover_image')}")
    print(f"Live URL: https://zhoujungis.github.io/article/{ARTICLE_SLUG}/")


if __name__ == "__main__":
    main()
