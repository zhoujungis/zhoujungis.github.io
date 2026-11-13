"""Publish the LSM vs B+Tree and crash-recovery deep dives.

Usage:
    backend/venv/Scripts/python.exe tools/publish_lsm_crash_articles.py --dry-run
    backend/venv/Scripts/python.exe tools/publish_lsm_crash_articles.py

Idempotent by slug: an existing article is updated instead of duplicated.
Sources:
    backend/articles/drafts/lsm-vs-btree-amplification.md
    backend/articles/drafts/crash-recovery-redo-undo.md
"""

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

import yaml

from _auth import API_URL, get_token

API = API_URL
ROOT = Path(__file__).resolve().parent.parent
DRAFTS = ROOT / "backend" / "articles" / "drafts"

ARTICLES = [
    {
        "file": DRAFTS / "lsm-vs-btree-amplification.md",
        "slug": "lsm-vs-btree-amplification",
        "cover": "https://blog.zhoujun.dev/photos/btree-cover.png",
        "tags": [
            {"slug": "database", "name": "数据库"},
            {"slug": "storage-engine", "name": "存储引擎"},
            {"slug": "sqlite", "name": "SQLite"},
            {"slug": "performance", "name": "性能优化"},
            {"slug": "lsm-tree", "name": "LSM-Tree"},
            {"slug": "rocksdb", "name": "RocksDB"},
            {"slug": "btree", "name": "B+树"},
        ],
    },
    {
        "file": DRAFTS / "crash-recovery-redo-undo.md",
        "slug": "crash-recovery-redo-undo",
        "cover": "https://blog.zhoujun.dev/photos/wal-cover.png",
        "tags": [
            {"slug": "database", "name": "数据库"},
            {"slug": "storage-engine", "name": "存储引擎"},
            {"slug": "wal", "name": "WAL"},
            {"slug": "innodb", "name": "InnoDB"},
            {"slug": "mysql", "name": "MySQL"},
            {"slug": "crash-recovery", "name": "崩溃恢复"},
            {"slug": "doublewrite", "name": "双写缓冲"},
        ],
    },
]

CATEGORY_SLUG = "database"
TOKEN = None


def api(method, path, data=None):
    request = urllib.request.Request(f"{API}{path}", method=method)
    request.add_header("Content-Type", "application/json")
    request.add_header("Authorization", f"Bearer {TOKEN}")
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
        print(f"{method} {path} -> HTTP {error.code}: {detail[:800]}", file=sys.stderr)
        return None
    except urllib.error.URLError as error:
        print(f"{method} {path} -> connection error: {error}", file=sys.stderr)
        return None


def paginated(path):
    data = api("GET", path)
    if isinstance(data, dict) and "results" in data:
        items = list(data["results"])
        url = data.get("next")
        while url:
            request = urllib.request.Request(url, method="GET")
            request.add_header("Authorization", f"Bearer {TOKEN}")
            with urllib.request.urlopen(request, timeout=60) as response:
                page = json.loads(response.read())
            items.extend(page.get("results", []))
            url = page.get("next")
        return items
    return data or []


def split_frontmatter(path):
    raw = path.read_text(encoding="utf-8")
    match = re.match(r"^---\n(.*?)\n---\n(.*)$", raw, re.S)
    if not match:
        raise SystemExit(f"No frontmatter in {path}")
    meta = yaml.safe_load(match.group(1))
    return meta, match.group(2).strip()


def category_id():
    for item in paginated("/categories/"):
        if item.get("slug") == CATEGORY_SLUG:
            print(f"category {CATEGORY_SLUG}: id={item['id']}")
            return item["id"]
    created = api("POST", "/admin/categories/", {"slug": CATEGORY_SLUG, "name": "数据库内核"})
    if not created:
        raise SystemExit("Could not resolve the database category")
    return created["id"]


def tag_ids(tags, cache):
    created_any = False
    ids = []
    for tag in tags:
        if tag["slug"] in cache["by_slug"]:
            ids.append(cache["by_slug"][tag["slug"]])
            continue
        if tag["name"] in cache["by_name"]:
            ids.append(cache["by_name"][tag["name"]])
            continue
        created = api("POST", "/admin/tags/", tag)
        if not created:
            raise SystemExit(f"Could not create tag {tag}")
        ids.append(created["id"])
        cache["by_slug"][tag["slug"]] = created["id"]
        cache["by_name"][tag["name"]] = created["id"]
        print(f"tag {tag['slug']}: created id={created['id']}")
        created_any = True
    if not created_any:
        print("tags: reused existing ids")
    return ids


def publish(article, cat_id, tag_cache, existing, dry_run):
    meta, content = split_frontmatter(article["file"])
    title = meta["title"]
    payload = {
        "title": title,
        "slug": article["slug"],
        "content": content,
        "status": "published",
        "is_top": False,
        "cover_image": article["cover"],
        "category_id": cat_id,
        "tags_ids": [] if dry_run else tag_ids(article["tags"], tag_cache),
    }
    print(f"\n== {article['slug']}")
    print(f"   title: {title}")
    print(f"   chars: {len(content)}")

    current = existing.get(article["slug"])
    if dry_run:
        print(f"   dry-run: would {'update id=' + str(current['id']) if current else 'create'}")
        return
    if current:
        result = api("PUT", f"/admin/articles/{current['id']}/", payload)
        action = f"updated id={current['id']}"
    else:
        result = api("POST", "/admin/articles/", payload)
        action = "created"
    if not result:
        raise SystemExit(f"Publish failed for {article['slug']}")
    print(f"   {action}")

    detail = api("GET", f"/articles/{article['slug']}/")
    if not detail:
        raise SystemExit(f"Could not read back {article['slug']}")
    print(
        "   verified: status=%s reading_time=%s html=%s category=%s tags=%s"
        % (
            detail.get("status"),
            detail.get("reading_time"),
            len(detail.get("html_content") or ""),
            (detail.get("category") or {}).get("slug"),
            ",".join(t["slug"] for t in detail.get("tags", [])),
        )
    )
    if detail.get("status") != "published":
        raise SystemExit("Article is not published")
    if len(detail.get("html_content") or "") < 5000:
        raise SystemExit("Rendered HTML looks too short")


def main():
    global TOKEN
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    TOKEN = get_token()
    cat_id = category_id()

    existing = {item["slug"]: item for item in paginated("/admin/articles/")}
    print(f"existing articles: {len(existing)}")
    tags = paginated("/tags/")
    tag_cache = {
        "by_slug": {item["slug"]: item["id"] for item in tags},
        "by_name": {item["name"]: item["id"] for item in tags},
    }
    for article in ARTICLES:
        publish(article, cat_id, tag_cache, existing, args.dry_run)


if __name__ == "__main__":
    main()
