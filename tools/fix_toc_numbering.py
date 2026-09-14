"""Strip the bogus `N. ` numbering from TOC list items, locally and on the server.

Bug: markdown written as

    - 1. 全景：一条评论的生死之旅
    - 2. 模型：自关联 + 审核开关

is parsed as <ul><li><ol><li>. Every inner <ol> restarts at 1, so the rendered
table of contents shows "1." for every entry. The fix is a flat `- ` list; the
renderer already numbers/stylises it.

The pattern is safe to rewrite because it only ever appears in one contiguous
block immediately after a `**目录**` heading and before the following `---`.

Usage:
    python tools/fix_toc_numbering.py --dry-run
    python tools/fix_toc_numbering.py
"""

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

SLUGS = [
    "django-comment-system-guide",
    "django-jwt-dual-token-auth",
    "drf-pagination-cache-throttle",
    "redis-distributed-lock-deep-dive",
]

ARTICLE_DIR = Path(__file__).resolve().parent.parent / "article"
BAD_LINE = re.compile(r"^- \d+\. ", re.M)


def fix_text(text):
    """Remove `N. ` from TOC list items. Returns (new_text, count)."""
    lines = text.split("\n")
    hits = [i for i, line in enumerate(lines) if BAD_LINE.match(line)]
    if not hits:
        return text, 0
    if hits != list(range(hits[0], hits[-1] + 1)):
        raise ValueError(
            f"`- N.` lines are not contiguous ({hits}) — refusing to rewrite blind."
        )
    # Safety: must sit between a `**目录**` heading and the next `---`.
    before = "\n".join(lines[: hits[0]])
    after = "\n".join(lines[hits[-1] + 1 :])
    if "**目录**" not in before:
        raise ValueError("`- N.` block is not preceded by a `**目录**` heading.")
    if not after.lstrip().startswith("---"):
        raise ValueError("`- N.` block is not followed by a `---` separator.")
    for i in hits:
        lines[i] = BAD_LINE.sub("- ", lines[i], count=1)
    return "\n".join(lines), len(hits)


def api(method, path, data=None):
    request = urllib.request.Request(f"{API_URL}{path}", method=method)
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
        print(f"  {method} {path} -> HTTP {error.code}: {detail[:300]}", file=sys.stderr)
        return None
    except urllib.error.URLError as error:
        print(f"  {method} {path} -> {error}", file=sys.stderr)
        return None


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    for slug in SLUGS:
        print(f"\n=== {slug} ===")

        # 1. local markdown source
        path = ARTICLE_DIR / f"{slug}.md"
        if path.exists():
            original = path.read_text(encoding="utf-8")
            fixed, count = fix_text(original)
            if count:
                if args.dry_run:
                    print(f"  local : would fix {count} TOC line(s)")
                else:
                    path.write_text(fixed, encoding="utf-8")
                    print(f"  local : fixed {count} TOC line(s)")
            else:
                print("  local : already clean")
        else:
            print("  local : (no markdown source)")

        # 2. published article
        article = api("GET", f"/articles/{slug}/")
        if not article:
            print("  server: NOT FOUND")
            continue
        content = article.get("content", "")
        fixed, count = fix_text(content)
        if not count:
            print("  server: already clean")
            continue
        if args.dry_run:
            print(f"  server: would fix {count} TOC line(s) (id={article['id']})")
            continue
        result = api("PATCH", f"/admin/articles/{article['id']}/", {"content": fixed})
        if result is None:
            print(f"  server: UPDATE FAILED (id={article['id']})")
            continue
        verify = api("GET", f"/articles/{slug}/")
        remaining = len(BAD_LINE.findall(verify.get("content", "")))
        status = "OK" if remaining == 0 else f"STILL {remaining} LEFT"
        print(f"  server: fixed {count} TOC line(s) (id={article['id']}) -> {status}")


if __name__ == "__main__":
    main()
