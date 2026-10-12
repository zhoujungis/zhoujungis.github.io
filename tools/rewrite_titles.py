"""Shorten over-long article titles to fit the 20-point budget.

Scoring rule (agreed with the author):
    1 Chinese character = 1 point
    1 English word      = 0.5 point
    1 numeric token     = 0.5 point
    punctuation / spaces = 0

Any title scoring more than 20 points is rewritten. The mapping below is the
reviewed, approved set of replacements — do not edit it without re-running
``--check`` to confirm every new title still fits.

The live backend is the single source of truth for titles (``frontend/scripts/
prerender.mjs`` fetches the API at build time), so a title change has to land
in three places:

    1. ``article/<slug>.md``            — frontmatter ``title:`` + body ``# H1``
    2. ``tools/publish_<x>_article.py`` — ``ARTICLE_TITLE`` constant
    3. the live API                     — ``PATCH /admin/articles/<id>/``

Usage::

    python tools/rewrite_titles.py --check           # report only (default)
    python tools/rewrite_titles.py --apply-local     # rewrite repo files
    python tools/rewrite_titles.py --apply-remote    # PATCH the live API
    python tools/rewrite_titles.py --apply-local --apply-remote

Credentials are read by ``tools._auth`` from the environment or ``tools/.env``.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

from _auth import api_request

ROOT = Path(__file__).resolve().parent.parent
ARTICLE_DIR = ROOT / "article"
TOOLS_DIR = ROOT / "tools"

# ── Approved replacements: slug -> new title ─────────────────────────────
NEW_TITLES: dict[str, str] = {
    "distributed-id-deep-dive": "分布式 ID 实测：页分裂、回拨 1 万次、号段扛 20 万",
    "feature-flag-progressive-delivery": "灰度到 20%，一半用户功能消失了——特性开关实战",
    "rate-limit-algorithms-deep-dive": "限流算法实测：固定窗口 2 倍溢出、令牌桶突刺",
    "api-idempotency-deep-dive": "用户只是双击了一下，订单多了 7 条——接口幂等",
    "resilience-timeout-retry-circuit-breaker-deep-dive": (
        "下游只抖 3 秒，我的服务被拖死——超时与熔断实战"
    ),
    "cache-trio-deep-dive": "300 个并发只该打 1 次库：穿透、击穿与雪崩",
    "cache-consistency-deep-dive": "先删缓存还是先删库？——缓存一致性实战",
    "django-anon-like-dedup": "为什么我敢让匿名用户点赞：五层防刷设计",
    "django-transaction-atomic-on-commit": "事务回滚了，邮件照样发出去——Django 事务深水区",
    "django-slow-query-index-tuning": "索引建了，为什么排序还是没用上？——慢查询实战",
    "django-zero-downtime-migration": "上线那一刻，数据库在重建整张表——零停机迁移",
    "happy-games-24-games-zero-framework-guide": "快乐小游戏：24 款零框架小游戏的全栈实践",
    "ibgda-domestic-gpu-rdma-demo-waic2026": "不靠英伟达网卡：国产 GPU 直通方案实测",
    "mq-reliable-delivery-deep-dive": "消息凭空消失排查记：MQ 可靠投递实测",
    "cloud-deployment-guide-cn-vs-global": "国内外云部署全攻略：国内云、海外 VPS 怎么选",
    "cursor-pagination-deep-dive": (
        "为什么 LIMIT 100000, 20 会越来越慢？——深分页与游标分页"
    ),
    "gpt-6-astra-release-2026": "GPT-6 Astra 发布：开发者需要知道的八件事",
    "django-comment-system-guide": "敢让匿名用户评论的底气：七层防线实战",
    "django-bleach-xss-defense": "为什么我敢渲染用户的 Markdown：一条 XSS 防线",
    "2026-chinese-ai-models-comparison": (
        "2026 国产大模型终极对决：GLM、DeepSeek 等八强横评"
    ),
    "django-subscribe-mass-mail": "别让一个坏邮箱毒死整批群发：三次加固",
    "api-gateway-deep-dive": "API 网关实战：认证、限流与路由的统一入口",
    "drf-pagination-cache-throttle": "列表接口从 800ms 到 80ms：分页、缓存与限流",
    "how-to-choose-ai-coding-tools": "AI 编程工具怎么选？主流工具全面对比与选型",
    "halo-music-square-architecture": "Halo 音乐广场技术拆解：多音源在线音乐应用",
    "redis-distributed-lock-deep-dive": "Redis 分布式锁：一次讲透正确姿势与失效边界",
    "django-jwt-dual-token-auth": "登录态 1 小时就掉？Django + Vue 双 Token 认证实战",
    # ── LC 系列精简体（2026-10-12）：全部从 20.5~30 分压到 ≤ 18.5 分 ──
    "lc-1-two-sum": "【LC 1】两数之和：先查再存，反了就匹配自己",
    "lc-3-longest-substring-without-repeating-characters": "【LC 3】无重复字符的最长子串：窗口里才算重复",
    "lc-15-3sum": "【LC 15】三数之和：难点是两处去重，不是双指针",
    "lc-19-remove-nth-from-end": "【LC 19】删除链表倒数第 N 个：快指针先出发",
    "lc-20-valid-parentheses": "【LC 20】有效的括号：栈是被结构逼出来的",
    "lc-33-153-rotated-binary-search": "【LC 33/153】旋转排序数组：同一断崖，比法相反",
    "lc-42-trapping-rain-water": "【LC 42】接雨水：四种解法，同一个问题",
    "lc-53-maximum-subarray": "【LC 53】最大子数组和：带上前面，是赚还是亏",
    "lc-56-merge-intervals": "【LC 56】合并区间：排序把重叠压成只比当前",
    "lc-72-edit-distance": "【LC 72】编辑距离：前缀对前缀，与滚动数组",
    "lc-82-remove-duplicates-from-sorted-list-ii": "【LC 82】删除重复元素 II：为什么必须有 dummy",
    "lc-93-restore-ip-addresses": "【LC 93】复原 IP 地址：分段回溯，剪枝分两层",
    "lc-102-binary-tree-level-order-traversal": "【LC 102】二叉树的层序遍历：为什么先存队列长度",
    "lc-104-226-max-depth-and-invert-binary-tree": "【LC 104/226】最大深度 & 翻转二叉树：各藏一颗钉子",
    "lc-121-122-best-time-to-buy-and-sell-stock": "【LC 121/122】买卖股票 I & II：等低点与吃上坡",
    "lc-124-binary-tree-maximum-path-sum": "【LC 124】二叉树最大路径和：返回值只选一条",
    "lc-1262-greatest-sum-divisible-by-three": "【LC 1262】可被三整除的最大和：贪心与滚动 dp",
    "lc-139-word-break": "【LC 139】单词拆分：布尔 dp 与切分回溯",
    "lc-143-reorder-list": "【LC 143】重排链表：一题拆三题，中间那道刷过",
    "lc-146-lru-cache": "【LC 146】LRU 缓存：手写哈希表与双向链表",
    "lc-155-232-min-stack-and-queue-via-stacks": "【LC 155/232】最小栈 & 用栈实现队列：记历史与再翻一次",
    "lc-165-compare-version-numbers": "【LC 165】比较版本号：归一化后逐列比",
    "lc-200-number-of-islands": "【LC 200】岛屿数量：一次染色与防爆栈替代",
    "lc-215-kth-largest-element": "【LC 215】第 K 个最大元素：快速选择只答排名",
    "lc-224-772-basic-calculator": "【LC 224/772】基本计算器：一个来一个结，一个等优先级",
    "lc-234-palindrome-linked-list": "【LC 234】回文链表：翻后半段，比是否相同",
    "lc-236-lowest-common-ancestor-of-a-binary-tree": "【LC 236】二叉树的最近公共祖先：命中即返回",
    "lc-239-sliding-window-maximum": "【LC 239】滑动窗口最大值：单调队列只留候选",
    "lc-300-longest-increasing-subsequence": "【LC 300】最长递增子序列：加锚，再压到 O(n log n)",
    "lc-322-coin-change": "【LC 322】零钱兑换：正序完全背包，逆序变 -1",
    "lc-415-add-strings": "【LC 415】字符串相加：把竖式翻译成代码",
    "lc-470-implement-rand10-using-rand7": "【LC 470】用 Rand7() 实现 Rand10()：拒绝采样 2.45 次",
    "lc-704-69-binary-search-and-sqrt": "【LC 704/69】二分查找 & 平方根：命中返回 vs 还向右",
}

BUDGET = 20.0

TOKEN_RE = re.compile(
    r"[\u4e00-\u9fff]"          # one Chinese character
    r"|[A-Za-z][A-Za-z0-9+.#\-]*"  # one English/tech word
    r"|\d[\d.,]*%?"             # one numeric token
)


def score(title: str) -> float:
    """Return the title's cost in the author's point system."""
    total = 0.0
    for match in TOKEN_RE.finditer(title):
        token = match.group(0)
        total += 1.0 if "\u4e00" <= token[0] <= "\u9fff" else 0.5
    return total


def _slug_to_source() -> dict[str, Path]:
    mapping: dict[str, Path] = {}
    for path in sorted(TOOLS_DIR.glob("publish_*.py")):
        match = re.search(r'ARTICLE_SLUG\s*=\s*["\']([^"\']+)', path.read_text("utf-8"))
        if match:
            mapping[match.group(1)] = path
    return mapping


def check() -> int:
    """Print every replacement with its before/after score. Returns fail count."""
    live = live_titles()
    if not live:
        print("warning: could not read the live title list; old scores unavailable\n")
    failures = 0
    print(f"{'old':>5} -> {'new':>4}   new title")
    for slug, new_title in NEW_TITLES.items():
        on_live = slug in live
        old = live.get(slug, "<not on live site>")
        old_score = score(old) if on_live else float("nan")
        new_score = score(new_title)
        flag = "OK" if new_score <= BUDGET else "FAIL"
        if new_score > BUDGET:
            failures += 1
        print(f"{old_score:>5} -> {new_score:>4} {flag}  {new_title}")
    print(f"\n{len(NEW_TITLES)} titles checked, {failures} over budget.")
    return failures


def live_titles() -> dict[str, str]:
    """Fetch slug -> title for every published article."""
    payload = api_request("GET", "/articles/?page_size=200")
    items = payload.get("results", []) if isinstance(payload, dict) else (payload or [])
    return {item["slug"]: item["title"] for item in items}


def update_markdown(slug: str, new_title: str) -> str:
    """Rewrite frontmatter ``title:`` and the first ``# H1`` of a source file.

    The ``title:`` substitution is scoped to the leading YAML block so a body
    line that happens to start with ``title:`` is never touched.
    """
    path = ARTICLE_DIR / f"{slug}.md"
    if not path.exists():
        return "no md source"
    text = path.read_text("utf-8")
    before = text

    frontmatter = re.match(r"^---\n(.*?\n)---\n", text, re.S)
    n_fm = 0
    if frontmatter:
        block = frontmatter.group(1)
        new_block, n_fm = re.subn(
            r'^title:.*$',
            f'title: "{new_title}"',
            block,
            count=1,
            flags=re.M,
        )
        if n_fm:
            text = text[: frontmatter.start(1)] + new_block + text[frontmatter.end(1) :]

    text, n_h1 = re.subn(r"^#\s+.*$", f"# {new_title}", text, count=1, flags=re.M)

    if text == before:
        return "unchanged"
    path.write_text(text, "utf-8")
    return f"frontmatter={n_fm} h1={n_h1}"


def update_publish_script(slug: str, new_title: str) -> str:
    """Rewrite the ``ARTICLE_TITLE`` constant in the article's publish script."""
    path = _slug_to_source().get(slug)
    if path is None:
        return "no publish script"
    text = path.read_text("utf-8")
    pattern = re.compile(
        r'(ARTICLE_TITLE\s*=\s*)(?:\((?:[^()]|\([^()]*\))*\)|"[^"]*"|\'[^\']*\')',
        re.S,
    )
    if not pattern.search(text):
        return "ARTICLE_TITLE not found"
    replacement = f'ARTICLE_TITLE = "{new_title}"'
    new_text, count = pattern.subn(replacement, text, count=1)
    if new_text == text:
        return "unchanged"
    path.write_text(new_text, "utf-8")
    return f"rewritten ({count})"


def apply_local() -> None:
    """Update repo-side sources: article markdown + publish scripts."""
    for slug, new_title in NEW_TITLES.items():
        md = update_markdown(slug, new_title)
        py = update_publish_script(slug, new_title)
        print(f"  {slug:<50} md: {md:<22} py: {py}")


def apply_remote() -> None:
    """PATCH the live API so each article's title matches the new value."""
    payload = api_request("GET", "/articles/?page_size=200")
    items = payload.get("results", []) if isinstance(payload, dict) else (payload or [])
    by_slug = {item["slug"]: item for item in items}

    ok = skipped = failed = 0
    for slug, new_title in NEW_TITLES.items():
        article = by_slug.get(slug)
        if article is None:
            print(f"  SKIP {slug}: not found on the live site")
            skipped += 1
            continue
        if article["title"] == new_title:
            print(f"  SKIP {slug}: already up to date")
            skipped += 1
            continue
        result = api_request("PATCH", f"/admin/articles/{article['id']}/", {"title": new_title})
        if result is None:
            print(f"  FAIL {slug} (id={article['id']})")
            failed += 1
        else:
            print(f"  OK   {slug} (id={article['id']}) -> {result.get('title')}")
            ok += 1
    print(f"\nremote: {ok} updated, {skipped} skipped, {failed} failed.")


def verify_local() -> int:
    """Check repo-side sources actually carry the new titles. Returns fail count."""
    scripts = _slug_to_source()
    failures = 0
    for slug, new_title in NEW_TITLES.items():
        notes = []
        ok = True
        path = ARTICLE_DIR / f"{slug}.md"
        if not path.exists():
            notes.append("md: none")
        else:
            text = path.read_text("utf-8")
            frontmatter = re.match(r"^---\n(.*?\n)---\n", text, re.S)
            # A source file without a YAML block is fine — only the H1 matters.
            fm_ok = frontmatter is None or bool(
                re.search(
                    r"^title:\s*" + re.escape(json.dumps(new_title, ensure_ascii=False)),
                    frontmatter.group(1),
                    re.M,
                )
            )
            h1 = re.search(r"^#\s+(.*)$", text, re.M)
            h1_ok = bool(h1 and h1.group(1).strip() == new_title)
            notes.append(f"md: frontmatter={fm_ok} h1={h1_ok}")
            if not (fm_ok and h1_ok):
                ok = False

        script = scripts.get(slug)
        if script is None:
            notes.append("py: none")
        else:
            src = script.read_text("utf-8")
            match = re.search(r'^ARTICLE_TITLE\s*=\s*"(.*)"\s*$', src, re.M)
            py_ok = bool(match and match.group(1) == new_title)
            notes.append(f"py: {py_ok}")
            if not py_ok:
                ok = False

        if not ok:
            failures += 1
        print(f"  {'OK  ' if ok else 'FAIL'} {slug:<50} {' | '.join(notes)}")
    print(f"\n{failures} mismatches.")
    return failures


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="report only (default)")
    parser.add_argument("--verify", action="store_true", help="verify repo files")
    parser.add_argument("--apply-local", action="store_true", help="rewrite repo files")
    parser.add_argument("--apply-remote", action="store_true", help="PATCH the live API")
    args = parser.parse_args()

    if args.verify:
        sys.exit(1 if verify_local() else 0)

    if not (args.apply_local or args.apply_remote):
        failures = check()
        sys.exit(1 if failures else 0)

    if args.apply_local:
        print("── local: article/*.md + tools/publish_*.py ──")
        apply_local()
    if args.apply_remote:
        print("── remote: live API ──")
        apply_remote()


if __name__ == "__main__":
    main()
