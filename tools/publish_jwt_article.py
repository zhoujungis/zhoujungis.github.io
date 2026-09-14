"""Publish the JWT dual-token auth article to the blog backend.

Usage:
    python tools/publish_jwt_article.py

Idempotent by slug: an existing article is updated instead of duplicating.
Credentials are read by ``tools._auth`` from the environment or ``tools/.env``.

Source Markdown: ``article/django-jwt-dual-token-auth.md``.
"""

import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
SOURCE = Path(__file__).resolve().parent.parent / "article" / "django-jwt-dual-token-auth.md"

ARTICLE_TITLE = "登录态 1 小时就掉？Django + Vue 双 Token 认证实战：续期、防掉线、防 XSS"
ARTICLE_SLUG = "django-jwt-dual-token-auth"
ARTICLE_EXCERPT = (
    "Access 60分钟+Refresh 1天的双 Token 全链路：SimpleJWT 配置、"
    "Pinia 登录态、Axios 单飞行自动续期、路由守卫防掉线与黑名单真注销。"
)
ARTICLE_COVER = (
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c"
    "?w=1200&q=80&auto=format&fit=crop"
)

CATEGORY = {"name": "技术教程", "slug": "tech", "description": "技术教程"}

TAGS = [
    {"slug": "django", "name": "Django"},
    {"slug": "backend", "name": "后端"},
    {"slug": "drf", "name": "DRF"},
    {"slug": "security", "name": "安全"},
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
    if not SOURCE.exists():
        raise SystemExit(f"Source Markdown not found: {SOURCE}")
    content = strip_frontmatter(SOURCE.read_text(encoding="utf-8"))

    category = category_id()
    tags = tag_ids()
    if not tags:
        raise SystemExit("No article tags could be resolved; aborting.")

    payload = {
        "title": ARTICLE_TITLE,
        "content": content,
        "excerpt": ARTICLE_EXCERPT,
        "cover_image": ARTICLE_COVER,
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
