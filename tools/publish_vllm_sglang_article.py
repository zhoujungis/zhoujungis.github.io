"""
Publish LLM inference framework comparison article to the blog backend.

Usage:
    python tools/publish_vllm_sglang_article.py
"""

import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
CONTENT_FILE = Path(__file__).parent / "vllm_sglang_article_content.md"

ARTICLE_TITLE = "从 vLLM 到 SGLang：LLM 推理框架的终极内卷"
ARTICLE_SLUG = "vllm-vs-sglang-llm-inference-framework-war"
ARTICLE_EXCERPT = (
    "PagedAttention、RadixAttention、Continuous Batching、FP8、投机解码——"
    "本文把 vLLM、SGLang、TensorRT-LLM、TGI、LMDeploy 放在同一张桌子上，"
    "看清它们各自押注的是什么，又在'内卷'什么；并给出按场景的选型建议。"
)
COVER_IMAGE = "https://images.unsplash.com/photo-1620712943543-bcc967d681bf?w=1600&q=80&auto=format&fit=crop"

CATEGORY = {"name": "科技前沿", "slug": "tech-frontier", "description": "前沿技术与未来趋势观察"}

TAGS = [
    {"slug": "llm-inference",     "name": "LLM 推理"},
    {"slug": "vllm",              "name": "vLLM"},
    {"slug": "sglang",            "name": "SGLang"},
    {"slug": "paged-attention",   "name": "PagedAttention"},
    {"slug": "radix-attention",   "name": "RadixAttention"},
    {"slug": "tensorrt-llm",      "name": "TensorRT-LLM"},
    {"slug": "speculative-decoding", "name": "投机解码"},
    {"slug": "fp8",               "name": "FP8"},
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
            # 500/502/503/504 → treat as transient and retry; other 4xx → bail
            if exc.code in (500, 502, 503, 504):
                last_err = exc
                wait = min(2 ** attempt, 20)
                body = exc.read().decode("utf-8", errors="replace")
                print(f"  .. HTTP {exc.code} on {method} {path}, retry {attempt}/{_retries} in {wait}s")
                time.sleep(wait)
                _CACHED_TOKEN = None  # force fresh token
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