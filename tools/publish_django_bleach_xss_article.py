"""Publish the Django + bleach XSS defense article to the blog backend.

Usage:
    python tools/publish_django_bleach_xss_article.py

Idempotent by slug: an existing article is updated instead of duplicating.
Credentials are read by ``tools._auth`` from the environment or ``tools/.env``.

The source Markdown lives at ``article/django-bleach-xss-defense.md`` (it was
validated against the backend's real render+sanitize pipeline via
``tools/verify_xss_defense.py`` before publishing — ALL_PASS).
"""

import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
SOURCE = Path(__file__).resolve().parent.parent / "article" / "django-bleach-xss-defense.md"

ARTICLE_TITLE = "为什么我敢渲染用户的 Markdown：一条 XSS 防线"
ARTICLE_SLUG = "django-bleach-xss-defense"
ARTICLE_EXCERPT = (
    "从受控渲染、bleach 三层白名单（标签/属性/协议）、外链加固到从消毒 HTML 提取摘要，"
    "用真实踩过的 data: 协议绕过与摘要 HTML 泄漏两个漏洞，串起一条完整的 XSS 纵深防线。"
)

CATEGORY = {"name": "技术教程", "slug": "tech", "description": "技术教程"}

TAGS = [
    {"slug": "django", "name": "Django"},
    {"slug": "backend", "name": "后端"},
    {"slug": "security", "name": "安全"},
    {"slug": "xss", "name": "XSS"},
    {"slug": "markdown", "name": "Markdown"},
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
    print(f"Live URL: https://zhoujungis.github.io/article/{ARTICLE_SLUG}/")


if __name__ == "__main__":
    main()