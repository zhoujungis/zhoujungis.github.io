"""发布三篇新文章：静态化实录、SQLite 提交实测、构建耗时解剖。

    python tools/publish_build_perf_articles.py --dry-run
    python tools/publish_build_perf_articles.py                 # 需封面已上线
    python tools/publish_build_perf_articles.py --skip-cover-check

按 slug 幂等：已存在则更新。

封面走站内 /photos/，与正文一起随构建上线；若先发布后部署，用
--skip-cover-check 跳过线上可达性检查，部署后再人工核对。
"""

import argparse
import json
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

ROOT = Path(__file__).resolve().parent.parent
API = API_URL

ARTICLES = [
    {
        "slug": "english-site-without-js",
        "title": "从 3 秒到毫秒首屏：英文站去 JS 化",
        "excerpt": (
            "首屏 6 个请求、220.1 KB JS（gzip 78.3 KB）；改成一个静态壳后只剩 HTML + CSS + "
            "792 字节内联脚本，2 个请求、12.9 KB gzip，JS 解析从 3.4 ms 降到 0.01 ms。"
            "一次把 SPA 首屏链路整段删掉的改造记录，附构建产物的可复算账本。"
        ),
        "cover": "https://blog.zhoujun.dev/photos/english-site-without-js-cover.png",
        "category": {"name": "项目实战", "slug": "projects"},
        "tags": [
            {"slug": "performance", "name": "性能优化"},
            {"slug": "static-site", "name": "静态站点"},
            {"slug": "frontend-architecture", "name": "前端架构"},
            {"slug": "build", "name": "构建"},
        ],
        "figures": ["220.1 KB", "78.3 KB", "12.9 KB", "3.4 ms", "0.01 ms", "792"],
    },
    {
        "slug": "sqlite-group-commit",
        "title": "一次 fsync 摊薄 1000 行：SQLite 提交实测",
        "excerpt": (
            "本机 fsync 中位数 1.996 ms：逐行提交只有 148 rows/s，1000 行一批 123,829 rows/s，"
            "整批一个事务 552,811 rows/s。2 万行逐条提交外推 136 秒，整批实测 0.036 秒——"
            "量化 group commit 到底在省什么，以及什么时候不能批量。"
        ),
        "cover": "https://blog.zhoujun.dev/photos/sqlite-group-commit-cover.png",
        "category": {"name": "数据库内核", "slug": "database"},
        "tags": [
            {"slug": "database", "name": "数据库"},
            {"slug": "sqlite", "name": "SQLite"},
            {"slug": "wal", "name": "WAL"},
            {"slug": "performance", "name": "性能优化"},
        ],
        "figures": ["1.996 ms", "148 rows/s", "123,829 rows/s", "552,811 rows/s", "6.82 ms", "3,734"],
    },
    {
        "slug": "build-time-image-cache",
        "title": "构建 4 分钟，3 分半在压 94 张图",
        "excerpt": (
            "一次完整构建 191.3 秒，其中 181.9 秒在重压 94 张从没变过的封面。把缓存放出 dist"
            "（否则被 emptyOutDir 删掉）之后，图片阶段 181.9 s → 0.1 s，完整构建 191.3 s → 21.0 s。"
            "一份把构建阶段拆开计时、再消灭重复劳动的方法。"
        ),
        "cover": "https://blog.zhoujun.dev/photos/build-time-image-cache-cover.png",
        "category": {"name": "后端架构", "slug": "backend"},
        "tags": [
            {"slug": "build", "name": "构建"},
            {"slug": "engineering-efficiency", "name": "工程效率"},
            {"slug": "performance", "name": "性能优化"},
            {"slug": "ci", "name": "CI"},
        ],
        "figures": ["191.3 s", "21.0 s", "181.9 s", "0.1 s", "1.94 s", "94"],
    },
]


def api(method, path, data=None):
    req = urllib.request.Request(f"{API}{path}", method=method)
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {get_token()}")
    if data is not None:
        req.data = json.dumps(data, ensure_ascii=False).encode("utf-8")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read()
            if not body or resp.status == 204:
                return None
            return json.loads(body)
    except urllib.error.HTTPError as exc:
        print(f"{method} {path} -> HTTP {exc.code}: {exc.read().decode()[:300]}", file=sys.stderr)
        return None
    except urllib.error.URLError as exc:
        print(f"{method} {path} -> {exc}", file=sys.stderr)
        return None


def paginated(path):
    data = api("GET", path)
    if isinstance(data, dict) and "results" in data:
        items = list(data["results"])
        url = data.get("next")
        while url:
            req = urllib.request.Request(url, method="GET")
            req.add_header("Authorization", f"Bearer {get_token()}")
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = json.loads(resp.read())
            items.extend(data.get("results", []))
            url = data.get("next")
        return items
    return data or []


def cover_ok(url):
    for method in ("GET", "HEAD"):
        req = urllib.request.Request(url, method=method)
        if method == "GET":
            req.add_header("Range", "bytes=0-2048")
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                if 200 <= resp.status < 300:
                    return True
        except Exception as exc:  # noqa: BLE001 - 检查失败就是不可达
            print(f"    cover {method} failed: {exc}", file=sys.stderr)
    return False


def category_id(spec):
    for item in paginated("/categories/"):
        if item.get("slug") == spec["slug"]:
            return item["id"]
    created = api("POST", "/admin/categories/", {**spec, "description": spec["name"]})
    return (created or {}).get("id")


def tag_ids(tags):
    existing = paginated("/tags/")
    by_slug = {t["slug"]: t["id"] for t in existing}
    by_name = {t["name"]: t["id"] for t in existing}
    ids = []
    for tag in tags:
        if tag["slug"] in by_slug:
            ids.append(by_slug[tag["slug"]])
        elif tag["name"] in by_name:
            ids.append(by_name[tag["name"]])
        else:
            created = api("POST", "/admin/tags/", tag)
            if created:
                ids.append(created["id"])
    return ids


def check(content, figures):
    bad = re.findall(r"^- \d+\.", content, flags=re.M)
    if bad:
        raise SystemExit(f"TOC 编号 bug：{len(bad)} 处 `- <数字>.`")
    missing = [f for f in figures if f not in content]
    if missing:
        raise SystemExit(f"正文缺少数值：{missing}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--skip-cover-check", action="store_true")
    parser.add_argument("--only", help="只发某一篇（slug）")
    args = parser.parse_args()

    for spec in ARTICLES:
        if args.only and spec["slug"] != args.only:
            continue
        src = ROOT / "article" / f"{spec['slug']}.md"
        if not src.exists():
            raise SystemExit(f"缺少源文件：{src}")
        content = re.sub(r"^---\n.*?\n---\n", "", src.read_text(encoding="utf-8"), flags=re.S).strip()
        print(f"\n== {spec['slug']} ({len(content)} chars)")
        check(content, spec["figures"])

        if not args.skip_cover_check and not cover_ok(spec["cover"]):
            raise SystemExit(f"封面不可达：{spec['cover']}（部署后用 --skip-cover-check 或在部署后重跑）")

        if args.dry_run:
            print("   dry-run：本地校验通过，未调用 API")
            continue

        cid = category_id(spec["category"])
        tids = tag_ids(spec["tags"])
        payload = {
            "title": spec["title"],
            "content": content,
            "excerpt": spec["excerpt"],
            "cover_image": spec["cover"],
            "status": "published",
            "is_top": False,
            "tags_ids": tids,
        }
        if cid:
            payload["category_id"] = cid

        existing = api("GET", f"/articles/{spec['slug']}/")
        if existing:
            result = api("PUT", f"/admin/articles/{existing['id']}/", payload)
            action = "updated"
        else:
            payload["slug"] = spec["slug"]
            result = api("POST", "/admin/articles/", payload)
            action = "created"
        if not result:
            raise SystemExit(f"{spec['slug']} 发布失败")
        print(f"   {action}: id={result.get('id')} cat={(result.get('category') or {}).get('name')}")

    print("\n完成。")


if __name__ == "__main__":
    main()
