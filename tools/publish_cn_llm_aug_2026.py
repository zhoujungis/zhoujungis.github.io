"""
Publish "August 2026 Chinese LLM releases preview" article to the blog backend.

Usage:
    python tools/publish_cn_llm_aug_2026.py
"""

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
CONTENT_FILE = Path(__file__).parent / "cn_llm_august_2026_content.md"

ARTICLE_TITLE = "八月攻势：2026 年 8 月国产大模型发布前瞻"
ARTICLE_SLUG = "chinese-llm-august-2026-releases-preview"
ARTICLE_EXCERPT = (
    "DeepSeek V4-Pro 正式版被多方信号指向 8 月 3 日，智谱 GLM-5.3、MiniMax M3Pro 被券商列为重要催化；"
    "参数竞赛重回 2 万亿时代，OpenRouter 调用量前五全是国产模型——"
    "本文盘点 2026 年 8 月最值得期待的国产大模型发布与背后的行业趋势。"
)
COVER_IMAGE = "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&q=80&auto=format&fit=crop"

CATEGORY = {"name": "科技前沿", "slug": "tech-frontier", "description": "前沿技术与未来趋势观察"}

TAGS = [
    {"slug": "llm",             "name": "大模型"},
    {"slug": "deepseek",        "name": "DeepSeek"},
    {"slug": "glm",             "name": "智谱 GLM"},
    {"slug": "minimax",         "name": "MiniMax"},
    {"slug": "kimi",            "name": "Kimi"},
    {"slug": "ai-trends",       "name": "AI 趋势"},
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
                print(f"  .. HTTP {exc.code} on {method} {path}, retry {attempt}/{_retries} in {wait}s")
                time.sleep(wait)
                _CACHED_TOKEN = None
                continue
            body = exc.read().decode("utf-8", errors="replace")
            print(f"  !! {method} {path} -> {exc.code}: {body[:300]}")
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
