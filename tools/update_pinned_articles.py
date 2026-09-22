"""Update the two pinned articles.

1. ``blog-tech-stack`` (id=16) — strip personal identity / account details:
   the "遥感与地理信息系统方向的学生" self-introduction, the PythonAnywhere
   account name ``zhoujun123``, the personal GitHub repo link and the
   "遥感 / GIS" interest line at the end. The blog domain
   (zhoujungis.github.io) is kept — the article is literally about deploying
   this very site, so removing it would make the prose incoherent.

2. ``welcome`` (id=8) — replace the whole body with the new essay
   《代码的世界非黑即白，生活的画布斑驳陆离》 and rename the title to match.
   slug / is_top / category / cover are preserved so existing URLs keep working.

Usage:
    backend/venv/Scripts/python.exe tools/update_pinned_articles.py --dry-run
    backend/venv/Scripts/python.exe tools/update_pinned_articles.py

Both articles are prerendered into static HTML, so a rebuild + deploy is
required afterwards for the changes to show up on the live site.
"""

import argparse
import difflib
import io
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
ROOT = Path(__file__).resolve().parent.parent

TASKS = [
    {
        "id": 16,
        "slug": "blog-tech-stack",
        "source": ROOT / "tools/article-sources/blog-tech-stack.md",
        "title": "博客搭建技术全解析：Vue 3 + Django 前后端分离实战",
        "tags_ids": [2, 39, 41, 40, 42],
        "category_id": None,
        "cover_image": (
            "https://images.unsplash.com/photo-1498050108023-c5249f4df085"
            "?w=1200&q=80&auto=format&fit=crop"
        ),
    },
    {
        "id": 8,
        "slug": "welcome",
        "source": ROOT / "tools/article-sources/welcome.md",
        "title": "代码的世界非黑即白，生活的画布斑驳陆离",
        "tags_ids": [5, 6],
        "category_id": 3,
        "cover_image": (
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643"
            "?w=1200&q=80&auto=format&fit=crop"
        ),
    },
]


def api(method, path, data=None):
    request = urllib.request.Request(f"{API}{path}", method=method)
    request.add_header("Content-Type", "application/json")
    request.add_header("Authorization", f"Bearer {get_token()}")
    if data is not None:
        request.data = json.dumps(data, ensure_ascii=False).encode("utf-8")
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            body = response.read()
            return json.loads(body) if body else None
    except urllib.error.HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        print(f"{method} {path} -> HTTP {error.code}: {detail[:400]}", file=sys.stderr)
        return None
    except urllib.error.URLError as error:
        print(f"{method} {path} -> connection error: {error}", file=sys.stderr)
        return None


def fetch(slug):
    request = urllib.request.Request(f"{API}/articles/{slug}/")
    request.add_header("Authorization", f"Bearer {get_token()}")
    with urllib.request.urlopen(request, timeout=60) as response:
        return json.loads(response.read())


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="只打印将要发生的改动，不调用写接口",
    )
    args = parser.parse_args()

    for task in TASKS:
        source = task["source"]
        if not source.exists():
            raise SystemExit(f"Source Markdown not found: {source}")
        new_content = source.read_text(encoding="utf-8").strip()

        current = fetch(task["slug"])
        old_content = current.get("content", "")
        print(f"\n=== {task['slug']} (id={task['id']}) ===")
        print(f"  title: {current.get('title')}  ->  {task['title']}")
        print(f"  content: {len(old_content)} -> {len(new_content)} chars")
        print(f"  is_top={current.get('is_top')} status={current.get('status')}")

        diff = list(
            difflib.unified_diff(
                old_content.splitlines(),
                new_content.splitlines(),
                lineterm="",
                n=0,
            )
        )
        if diff:
            print(f"  --- diff ({len(diff)} lines) ---")
            for line in diff[:80]:
                prefix = line[:1]
                if prefix in "+-":
                    print("   " + line[:150])
            if len(diff) > 80:
                print(f"   ... ({len(diff) - 80} more diff lines)")

        if args.dry_run:
            continue

        payload = {
            "title": task["title"],
            "content": new_content,
            "status": "published",
            "is_top": True,
            "tags_ids": task["tags_ids"],
            "cover_image": task["cover_image"],
        }
        if task["category_id"] is not None:
            payload["category_id"] = task["category_id"]

        result = api("PUT", f"/admin/articles/{task['id']}/", payload)
        if not result:
            raise SystemExit(f"Update failed for {task['slug']}")
        print(f"  updated -> id={result.get('id')} title={result.get('title')}")
        print(f"  excerpt now: {str(result.get('excerpt'))[:120]}...")

    if args.dry_run:
        print("\n--dry-run: no write calls made.")
    else:
        print("\nDone. Remember: rebuild + deploy to refresh the prerendered pages.")


if __name__ == "__main__":
    main()
