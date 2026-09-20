"""Publish GPT-6 Astra release article.

Usage:
    python tools/publish_gpt6_astra_article.py
"""

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
CONTENT_FILE = Path(__file__).parent / "gpt6_astra_article_content.md"
ARTICLE_TITLE = "GPT-6 Astra 发布：开发者需要知道的八件事"
ARTICLE_SLUG = "gpt-6-astra-release-2026"
ARTICLE_EXCERPT = (
    "OpenAI 9 月 3 日发布 GPT-6 Astra，Greg Brockman 单方面宣布“欢迎来到 AGI 时代”。"
    "本文梳理最强电脑操作、100% ExploitBench、99.9% ARC-AGI-3、FrontierMath 97.6%、"
    "922K 上下文与 $10/$50 定价、Zero Data Retention 等八项开发者必读变化，并给出选型与落地建议。"
)
COVER_IMAGE = "https://images.ctfassets.net/kftzwdyauwt9/H9Mf4UPiWGb0N25sLJHUu/6d971b8e12cbab3db48c94617d703b5d/poster.webp?w=1920&q=80&fm=webp"

CATEGORY = {
    "name": "科技前沿",
    "slug": "tech-frontier",
    "description": "前沿技术与未来趋势观察",
}

TAGS = [
    {"slug": "gpt-6", "name": "GPT-6"},
    {"slug": "openai", "name": "OpenAI"},
    {"slug": "astra", "name": "Astra"},
    {"slug": "agi", "name": "AGI"},
    {"slug": "llm", "name": "大模型"},
    {"slug": "ai-safety", "name": "AI 安全"},
    {"slug": "coding", "name": "AI 编程"},
    {"slug": "computer-use", "name": "Computer Use"},
]


def api(method: str, path: str, data=None):
    token = get_token()
    request = urllib.request.Request(f"{API}{path}", method=method)
    request.add_header("Content-Type", "application/json")
    request.add_header("Authorization", f"Bearer {token}")
    if data is not None:
        request.data = json.dumps(data, ensure_ascii=False).encode("utf-8")
    try:
        response = urllib.request.urlopen(request, timeout=60)
        body = response.read()
        if response.status == 204 or not body:
            return None
        return json.loads(body)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        if exc.code == 404 and method == "GET":
            return None
        raise RuntimeError(f"{method} {path} -> HTTP {exc.code}: {body[:600]}") from exc


def find_or_create_category() -> int | None:
    categories = api("GET", "/categories/") or []
    for cat in categories:
        if cat["slug"] == CATEGORY["slug"]:
            return cat["id"]
    result = api("POST", "/admin/categories/", CATEGORY)
    return result["id"] if result else None


def find_or_create_tags() -> list[int]:
    existing = {t["slug"]: t["id"] for t in (api("GET", "/tags/") or [])}
    ids: list[int] = []
    for tag in TAGS:
        if tag["slug"] in existing:
            ids.append(existing[tag["slug"]])
            continue
        result = api("POST", "/admin/tags/", tag)
        if result:
            ids.append(result["id"])
    return ids


def main() -> None:
    if not CONTENT_FILE.exists():
        raise RuntimeError(f"Content file not found: {CONTENT_FILE}")
    category_id = find_or_create_category()
    tag_ids = find_or_create_tags()
    if not tag_ids:
        raise RuntimeError("No tags resolved")

    content = CONTENT_FILE.read_text(encoding="utf-8")
    payload = {
        "title": ARTICLE_TITLE,
        "content": content,
        "excerpt": ARTICLE_EXCERPT,
        "status": "published",
        "cover_image": COVER_IMAGE,
        "is_top": False,
        "tags_ids": tag_ids,
    }
    if category_id is not None:
        payload["category_id"] = category_id

    existing = api("GET", f"/articles/{ARTICLE_SLUG}/")
    if existing:
        result = api("PUT", f"/admin/articles/{existing['id']}/", payload)
        action = "updated"
    else:
        payload["slug"] = ARTICLE_SLUG
        result = api("POST", "/admin/articles/", payload)
        action = "created"

    if not result:
        raise RuntimeError(f"Article {action} returned no result")
    print(f"Article {action}: id={result['id']}, slug={result['slug']}")
    print(f"Live URL: https://zhoujungis.github.io/article/{ARTICLE_SLUG}")
    print(f"API URL: {API}/articles/{ARTICLE_SLUG}/")


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError, KeyError, ValueError) as exc:
        print(f"Publish failed: {exc}", file=sys.stderr)
        sys.exit(1)
