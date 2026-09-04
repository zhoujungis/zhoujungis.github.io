"""Publish the HALO Music technical article to the blog backend.

Usage:
    python tools/publish_halo_music_article.py

The script is idempotent by slug: an existing article is updated instead of
creating a duplicate. Credentials are read by ``tools._auth`` from the
environment or ``tools/.env``.
"""

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token


API = API_URL
CONTENT_FILE = Path(__file__).parent / "halo_music_article_content.md"
ARTICLE_TITLE = "Halo 音乐广场技术拆解：用 Cloudflare 构建多音源在线音乐应用"
ARTICLE_SLUG = "halo-music-square-architecture"
ARTICLE_EXCERPT = (
    "从统一 HALO Track 数据结构出发，拆解 Halo 音乐广场如何用 Cloudflare Pages、"
    "Pages Functions、D1 和 Electron 实现多音源搜索、在线播放、歌词同步、歌单导入"
    "与桌面端复用。"
)
COVER_IMAGE = "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1600&q=80&auto=format&fit=crop"
CATEGORY = {
    "name": "项目实践",
    "slug": "project-practice",
    "description": "个人项目的架构设计、实现细节与复盘",
}
TAGS = [
    {"slug": "halo-music", "name": "HALO Music"},
    {"slug": "cloudflare-pages", "name": "Cloudflare Pages"},
    {"slug": "cloudflare-workers", "name": "Cloudflare Functions"},
    {"slug": "cloudflare-d1", "name": "Cloudflare D1"},
    {"slug": "electron", "name": "Electron"},
    {"slug": "web-audio", "name": "Web Audio"},
    {"slug": "serverless", "name": "Serverless"},
]


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
        print(f"{method} {path} -> HTTP {error.code}: {detail[:300]}", file=sys.stderr)
        return None
    except urllib.error.URLError as error:
        print(f"{method} {path} -> connection error: {error}", file=sys.stderr)
        return None


def category_id() -> int | None:
    for item in api("GET", "/categories/") or []:
        if item.get("slug") == CATEGORY["slug"]:
            return item["id"]
    created = api("POST", "/admin/categories/", CATEGORY)
    return created.get("id") if created else None


def tag_ids() -> list[int]:
    existing = {item["slug"]: item["id"] for item in (api("GET", "/tags/") or [])}
    ids = []
    for tag in TAGS:
        if tag["slug"] in existing:
            ids.append(existing[tag["slug"]])
            continue
        created = api("POST", "/admin/tags/", tag)
        if created:
            ids.append(created["id"])
    return ids


def main() -> None:
    content = CONTENT_FILE.read_text(encoding="utf-8")
    category = category_id()
    tags = tag_ids()
    if not tags:
        raise SystemExit("No article tags could be resolved; aborting.")

    payload = {
        "title": ARTICLE_TITLE,
        "content": content,
        "excerpt": ARTICLE_EXCERPT,
        "status": "published",
        "cover_image": COVER_IMAGE,
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
    print(f"Live URL: https://zhoujungis.github.io/article/{ARTICLE_SLUG}/")


if __name__ == "__main__":
    main()
