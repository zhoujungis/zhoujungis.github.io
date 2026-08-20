"""Publish the 2026-08-18 AI subscription comparison article.

Usage:
    python tools/publish_ai_subscription_comparison_2026.py
"""

import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token


API = API_URL
CONTENT_FILE = Path(__file__).parent / "ai_subscription_comparison_2026-08-18.md"
ARTICLE_TITLE = "国内大模型集体涨价？普通用户该何去何从"
ARTICLE_SLUG = "ai-subscription-price-comparison-2026"
ARTICLE_EXCERPT = (
    "DeepSeek 调价后，GLM、Kimi、MiniMax、OpenCode、ChatGPT 和 Claude Opus 的订阅与用量怎么比？"
    "本文按 2026 年 8 月 18 日公开价格、额度和独立编程测试，给普通用户一份可执行的选择清单。"
)
COVER_IMAGE = "https://zhoujungis.github.io/photos/ai-subscription-price-2026-08-18.png"

CATEGORY = {
    "name": "科技前沿",
    "slug": "tech-frontier",
    "description": "前沿技术与未来趋势观察",
}

TAGS = [
    {"slug": "llm", "name": "大模型"},
    {"slug": "deepseek", "name": "DeepSeek"},
    {"slug": "glm", "name": "智谱 GLM"},
    {"slug": "kimi", "name": "Kimi"},
    {"slug": "minimax", "name": "MiniMax"},
    {"slug": "chatgpt", "name": "ChatGPT"},
    {"slug": "claude", "name": "Claude"},
    {"slug": "ai-tools", "name": "AI 工具"},
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
        if exc.code == 404 and method == "GET" and path.startswith("/articles/"):
            return None
        raise RuntimeError(f"{method} {path} -> HTTP {exc.code}: {body[:500]}") from exc


def find_or_create_category() -> int | None:
    categories = api("GET", "/categories/") or []
    for category in categories:
        if category["slug"] == CATEGORY["slug"]:
            return category["id"]
    result = api("POST", "/admin/categories/", CATEGORY)
    return result["id"] if result else None


def find_or_create_tags() -> list[int]:
    existing = {tag["slug"]: tag["id"] for tag in (api("GET", "/tags/") or [])}
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
    category_id = find_or_create_category()
    tag_ids = find_or_create_tags()
    if not tag_ids:
        raise RuntimeError("No article tags could be resolved")

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
        raise RuntimeError(f"Article {action} request returned no result")
    print(f"Article {action}: id={result['id']}, slug={result['slug']}")
    print(f"Live URL: https://zhoujungis.github.io/article/{ARTICLE_SLUG}")


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError, KeyError, ValueError) as exc:
        print(f"Publish failed: {exc}", file=sys.stderr)
        sys.exit(1)
