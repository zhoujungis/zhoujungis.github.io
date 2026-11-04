"""Publish the eight backend deep-dive articles.

Usage:
    backend/venv/Scripts/python.exe tools/publish_backend_articles.py --dry-run --skip-cover-check
    backend/venv/Scripts/python.exe tools/publish_backend_articles.py

Idempotent by slug: an existing article is updated instead of duplicated.
Covers must be deployed before the real run; use --skip-cover-check only for
local dry-runs.
"""

import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

API = API_URL
ROOT = Path(__file__).resolve().parent.parent

CATEGORY = {"name": "后端架构", "slug": "backend", "description": "后端架构"}

TAG_DEFS = {
    "backend-dev": "后端",
    "architecture": "架构设计",
    "distributed": "分布式事务",
    "messaging": "消息队列",
    "observability": "可观测性",
    "performance": "性能优化",
    "database": "数据库",
    "deployment": "部署",
    "kubernetes": "Kubernetes",
    "reliability": "可靠性",
    "networking": "网络",
    "load-balancing": "负载均衡",
    "high-availability": "高可用",
    "realtime": "实时通信",
    "storage": "对象存储",
    "security": "安全",
    "django": "Django",
    "search": "搜索",
}

ARTICLES = [
    {
        "slug": "distributed-transaction-outbox-saga-tcc",
        "title": "分布式事务：本地消息表、Outbox、Saga 与 TCC 的边界",
        "excerpt": (
            "本地事务提交成功、消息却没发出去，是分布式一致性的经典缺口。"
            "本文拆解本地消息表与 Transactional Outbox 的同库同事务写法、"
            "relay 与 CDC 两条投递路径、Saga 的补偿边界和 TCC 的三个经典异常，"
            "并给出选型表与可观测指标。"
        ),
        "cover": "https://zhoujungis.github.io/photos/distributed-transaction-outbox-saga-tcc-cover.png",
        "tags": ["backend-dev", "distributed", "messaging", "architecture"],
        "figures": [
            "Transactional Outbox", "SKIP LOCKED", "Debezium", "Saga", "TCC",
            "空回滚", "防悬挂", "2PC", "至少一次", "幂等",
        ],
    },
    {
        "slug": "database-connection-pool-deep-dive",
        "title": "数据库连接池：为什么 100 个连接比 20 个更慢",
        "excerpt": (
            "连接池不是越大越好，它是数据库前面的限流阀。本文用 Little's Law "
            "算并发需求，讲清 Django、PostgreSQL、MySQL 与 HikariCP 的配置边界，"
            "以及连接泄漏、陈旧连接和 pgbouncer 事务模式的坑。"
        ),
        "cover": "https://zhoujungis.github.io/photos/database-connection-pool-deep-dive-cover.png",
        "tags": ["backend-dev", "database", "performance", "django"],
        "figures": [
            "Little's Law", "CONN_MAX_AGE", "pgbouncer", "transaction",
            "HikariCP", "max_connections", "wait_timeout", "thread_cache_size",
            "leakDetectionThreshold", "SELECT 1",
        ],
    },
    {
        "slug": "metrics-and-distributed-tracing",
        "title": "指标与链路追踪：从 RED 到 OpenTelemetry",
        "excerpt": (
            "日志记录事件，指标记录趋势，追踪记录一次请求的路径。本文从 RED/USE "
            "与 P95/P99 讲到 OpenTelemetry 的 trace/span、W3C traceparent 传播、"
            "head/tail 采样，以及指标、trace、日志如何串成一条排查链路。"
        ),
        "cover": "https://zhoujungis.github.io/photos/metrics-and-distributed-tracing-cover.png",
        "tags": ["backend-dev", "observability", "performance", "architecture"],
        "figures": [
            "RED", "USE", "Histogram", "traceparent", "OpenTelemetry", "OTLP",
            "tail sampling", "P99", "span", "exemplar",
        ],
    },
    {
        "slug": "graceful-shutdown-in-practice",
        "title": "优雅停机：别在 SIGTERM 那一刻丢掉请求",
        "excerpt": (
            "发版时的 502 尖刺、消费者中途退出、定时任务双跑，往往不是业务 bug，"
            "而是停机顺序错了。本文讲清 SIGTERM、K8s preStop、"
            "Gunicorn/uvicorn 的连接 draining、Celery 的 warm shutdown 与任务幂等。"
        ),
        "cover": "https://zhoujungis.github.io/photos/graceful-shutdown-in-practice-cover.png",
        "tags": ["backend-dev", "deployment", "kubernetes", "reliability"],
        "figures": [
            "SIGTERM", "SIGKILL", "preStop", "terminationGracePeriodSeconds",
            "graceful_timeout", "acks_late", "warm shutdown", "readinessProbe",
            "PID 1",
        ],
    },
    {
        "slug": "load-balancing-algorithms-in-practice",
        "title": "负载均衡：轮询、最少连接与一致性哈希的代价",
        "excerpt": (
            "轮询假设每台机器成本相同，最少连接假设当前连接数能代表压力，"
            "一致性哈希假设热点可以被切分。本文拆解这些假设失效时会发生什么，"
            "以及健康检查、粘性会话、重试预算和 Nginx 配置。"
        ),
        "cover": "https://zhoujungis.github.io/photos/load-balancing-algorithms-in-practice-cover.png",
        "tags": ["backend-dev", "networking", "load-balancing", "high-availability"],
        "figures": [
            "轮询", "最少连接", "一致性哈希", "虚拟节点",
            "max_fails", "fail_timeout", "keepalive", "retry budget",
        ],
    },
    {
        "slug": "websocket-production-deep-dive",
        "title": "WebSocket 上生产：心跳、重连与水平扩展",
        "excerpt": (
            "本地能连、上线 60 秒断一次，通常是代理与心跳的问题；扩容后消息收不到，"
            "通常是连接没有共享。本文讲清 RFC 6455 握手、应用层心跳、"
            "指数退避重连、Redis 广播与背压。"
        ),
        "cover": "https://zhoujungis.github.io/photos/websocket-production-deep-dive-cover.png",
        "tags": ["backend-dev", "realtime", "networking", "architecture"],
        "figures": [
            "Upgrade", "Sec-WebSocket-Key", "101", "ping", "pong",
            "指数退避", "Redis", "Origin", "背压", "proxy_read_timeout",
        ],
    },
    {
        "slug": "file-upload-production-deep-dive",
        "title": "文件上传：分片、断点续传与直传对象存储",
        "excerpt": (
            "让应用服务器代理文件字节，是上传超时和内存打爆的常见根因。"
            "本文讲预签名直传、S3 multipart 分片与断点续传、ETag 与 MD5 的差异、"
            "路径穿越与解压炸弹，以及 Django 的上传上限。"
        ),
        "cover": "https://zhoujungis.github.io/photos/file-upload-production-deep-dive-cover.png",
        "tags": ["backend-dev", "storage", "security", "architecture"],
        "figures": [
            "预签名", "multipart", "UploadPart", "Complete", "ETag",
            "Content-MD5", "magic bytes", "SSRF", "upload_to",
            "FILE_UPLOAD_MAX_MEMORY_SIZE",
        ],
    },
    {
        "slug": "search-inverted-index-to-engine",
        "title": "搜索：从倒排索引到 PostgreSQL、Elasticsearch 选型",
        "excerpt": (
            "LIKE '%关键词%' 在百万行表上越来越慢，加了索引也没用。"
            "本文从倒排索引、分词与 BM25 讲到 PostgreSQL tsvector、"
            "Elasticsearch 与 Meilisearch 的选型，以及索引同步的三种方式。"
        ),
        "cover": "https://zhoujungis.github.io/photos/search-inverted-index-to-engine-cover.png",
        "tags": ["backend-dev", "search", "database", "architecture"],
        "figures": [
            "倒排索引", "postings", "BM25", "tsvector", "tsquery", "GIN",
            "search_after", "Meilisearch", "CDC", "分词",
        ],
    },
]

MARKDOWN_EXTENSIONS = ["fenced_code", "codehilite", "tables", "extra", "toc"]
VIZ_PLACEHOLDER_CLASSES = []


def strip_frontmatter(md: str) -> str:
    return re.sub(r"^---\n.*?\n---\n", "", md, flags=re.S).strip()


def api(method, path, data=None, retries=4):
    request = urllib.request.Request(f"{API}{path}", method=method)
    request.add_header("Content-Type", "application/json")
    request.add_header("Authorization", f"Bearer {get_token()}")
    if data is not None:
        request.data = json.dumps(data, ensure_ascii=False).encode("utf-8")
    for attempt in range(1, retries + 1):
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
        except (urllib.error.URLError, TimeoutError) as error:
            print(f"{method} {path} -> transient ({attempt}/{retries}): {error}", file=sys.stderr)
            if attempt == retries:
                return None
    return None


def paginated(path):
    data = api("GET", path)
    if isinstance(data, dict) and "results" in data:
        items = list(data["results"])
        url = data.get("next")
        while url:
            request = urllib.request.Request(url, method="GET")
            request.add_header("Authorization", f"Bearer {get_token()}")
            with urllib.request.urlopen(request, timeout=60) as response:
                data = json.loads(response.read())
            items.extend(data.get("results", []))
            url = data.get("next")
        return items
    return data or []


def cover_is_live(url):
    for method in ("HEAD", "GET"):
        request = urllib.request.Request(url, method=method)
        if method == "GET":
            request.add_header("Range", "bytes=0-2048")
        try:
            with urllib.request.urlopen(request, timeout=30) as response:
                if 200 <= response.status < 300:
                    return True
        except (urllib.error.HTTPError, urllib.error.URLError) as error:
            print(f"  cover check ({method}) failed: {error}", file=sys.stderr)
    return False


def category_id():
    for item in paginated("/categories/"):
        if item.get("slug") == CATEGORY["slug"]:
            print(f"  category {CATEGORY['name']}: reused id={item['id']}")
            return item["id"]
    created = api("POST", "/admin/categories/", CATEGORY)
    if created:
        print(f"  category {CATEGORY['name']}: created id={created['id']}")
        return created["id"]
    return None


class TagResolver:
    def __init__(self):
        self.items = paginated("/tags/")
        self.by_slug = {item["slug"]: item["id"] for item in self.items}
        self.by_name = {item["name"]: item["id"] for item in self.items}

    def ids(self, slugs):
        result = []
        for slug in slugs:
            if slug in self.by_slug:
                result.append(self.by_slug[slug])
                continue
            name = TAG_DEFS[slug]
            if name in self.by_name:
                self.by_slug[slug] = self.by_name[name]
                result.append(self.by_name[name])
                continue
            created = api("POST", "/admin/tags/", {"slug": slug, "name": name})
            if created:
                self.by_slug[slug] = created["id"]
                self.by_name[name] = created["id"]
                result.append(created["id"])
                print(f"  tag {name}: created id={created['id']}")
        return result


def _reexec_with_markdown():
    try:
        import markdown  # noqa: F401
        return False
    except ImportError:
        pass
    candidates = [
        ROOT / "backend" / "venv" / "Scripts" / "python.exe",
        ROOT / "backend" / "venv" / "bin" / "python",
    ]
    for candidate in candidates:
        if not candidate.exists():
            continue
        if Path(sys.executable).resolve() == candidate.resolve():
            break
        probe = subprocess.run([str(candidate), "-c", "import markdown"], capture_output=True)
        if probe.returncode == 0:
            print(f"  guards: re-running under {candidate.name}")
            os.execv(str(candidate), [str(candidate), *sys.argv])
    raise SystemExit(
        "Refusing to publish: no interpreter with `markdown` found, so the "
        "placeholder / code-block guards cannot run."
    )


def check_toc(content):
    bad = re.findall(r"^- \d+\.", content, flags=re.M)
    if bad:
        raise SystemExit(f"TOC bug detected: {len(bad)} list item(s) start with `- <number>`.")
    toc_block = re.search(r"\*\*目录\*\*\n(.*?)\n\n", content, flags=re.S)
    if not toc_block:
        raise SystemExit("TOC block `**目录**` not found.")
    toc = [
        line[2:].strip()
        for line in toc_block.group(1).splitlines()
        if line.startswith("- ")
    ]
    h2 = [line[3:].strip() for line in content.splitlines() if line.startswith("## ")]
    if toc != h2:
        raise SystemExit(
            "TOC / H2 mismatch:\n"
            f"  TOC ({len(toc)}): {toc}\n"
            f"  H2  ({len(h2)}): {h2}"
        )
    print(f"  TOC check: OK ({len(toc)} entries match H2 headings)")


def check_viz(content):
    import bleach
    import markdown

    html = markdown.Markdown(extensions=MARKDOWN_EXTENSIONS).convert(content)
    cleaned = bleach.clean(
        html,
        tags=bleach.sanitizer.ALLOWED_TAGS
        | {
            "h1", "h2", "h3", "h4", "h5", "h6",
            "img", "pre", "code", "span", "div",
            "table", "thead", "tbody", "tr", "th", "td",
            "hr", "br", "sup", "sub",
            "figure", "figcaption",
        },
        attributes={
            **bleach.sanitizer.ALLOWED_ATTRIBUTES,
            "div": ["class"],
            "span": ["class"],
            "code": ["class"],
            "pre": ["class"],
        },
        protocols=["http", "https", "mailto"],
        strip=True,
    )
    missing = [c for c in VIZ_PLACEHOLDER_CLASSES if c not in cleaned]
    if missing:
        raise SystemExit(f"Animation placeholder(s) DID NOT survive: {missing}")

    polluted = 0
    for block in re.findall(r"<pre\b[^>]*>.*?</pre>", cleaned, flags=re.DOTALL):
        polluted += len(re.findall(r"</?(?:em|strong)\b", block))
    if polluted:
        raise SystemExit(f"Code blocks contain {polluted} <em>/<strong> tag(s).")

    prose = re.sub(r"<pre\b[^>]*>.*?</pre>", "", cleaned, flags=re.DOTALL)
    prose = re.sub(r"<code\b[^>]*>.*?</code>", "", prose, flags=re.DOTALL)
    if re.search(r"\*\*", prose):
        raise SystemExit("Rendered HTML still contains a bare `**`.")
    print(f"  viz check: OK ({len(re.findall(r'<pre', cleaned))} code blocks clean)")


def check_numbers(content, figures):
    missing = [e for e in figures if e not in content]
    if missing:
        raise SystemExit(f"Number check failed — not found in text: {missing}")
    print(f"  number check: OK ({len(figures)} expected figures present)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--slug", action="append", default=None,
                        help="limit to one or more slugs")
    parser.add_argument("--skip-cover-check", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    _reexec_with_markdown()

    selected = [a for a in ARTICLES if not args.slug or a["slug"] in args.slug]
    if not selected:
        raise SystemExit("No article matched --slug.")

    prepared = []
    for article in selected:
        source = ROOT / "article" / f"{article['slug']}.md"
        if not source.exists():
            raise SystemExit(f"Source Markdown not found: {source}")
        content = strip_frontmatter(source.read_text(encoding="utf-8"))
        print(f"\n=== {article['slug']} ===")
        print(f"Source: {source.name} ({len(content)} chars)")
        chinese = len(re.findall(r"[一-鿿㐀-䶿]", content))
        english = len(re.findall(r"[a-zA-Z]+", content))
        print(f"Reading time (backend formula): {max(1, (chinese + english) // 250 + 1)} min")
        check_toc(content)
        check_viz(content)
        check_numbers(content, article["figures"])
        print(f"Cover: {article['cover']}")
        if not args.skip_cover_check and not cover_is_live(article["cover"]):
            raise SystemExit(
                f"Cover URL is not reachable — refusing to publish {article['slug']}.\n"
                "  Deploy the PNG first, then re-run this script (idempotent by slug)."
            )
        prepared.append((article, content))

    if args.dry_run:
        print("\n--dry-run: local checks passed, no API calls made.")
        for article, _ in prepared:
            print(f"Would publish: {article['slug']} ({article['title']})")
        return

    category = category_id()
    tags = TagResolver()
    for article, content in prepared:
        tag_ids = tags.ids(article["tags"])
        if not tag_ids:
            raise SystemExit(f"No tags resolved for {article['slug']}; aborting.")

        payload = {
            "title": article["title"],
            "content": content,
            "excerpt": article["excerpt"],
            "cover_image": article["cover"],
            "status": "published",
            "is_top": False,
            "tags_ids": tag_ids,
        }
        if category is not None:
            payload["category_id"] = category

        existing = api("GET", f"/articles/{article['slug']}/")
        if existing:
            result = api("PUT", f"/admin/articles/{existing['id']}/", payload)
            action = "updated"
        else:
            result = api("POST", "/admin/articles/", {**payload, "slug": article["slug"]})
            action = "created"

        if not result:
            raise SystemExit(f"Article API request failed for {article['slug']}.")
        print(f"Article {action}: {result.get('id')} {result.get('slug', article['slug'])}")
        print(f"Live URL: https://blog.zhoujun.dev/article/{article['slug']}/")


if __name__ == "__main__":
    main()
