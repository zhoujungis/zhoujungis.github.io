"""修坏链 + 给正文补「同族题 / 同链路」内链。

两件事：

1. ``REPAIRS``：修正正文里写错的站内链接（slug 已经不存在，点击会 404）。
2. ``TARGETS``：给还没有任何正文内链的文章，在结尾追加一句带链接的承接语。
   目标按主题成组挑选（题解按同族题型，后端/数据库按幂等、事务、缓存、限流、
   部署等链路），每篇只加 1–2 条，避免堆砌。

与 ``seolinks`` 相同的安全约束：
- 只改 ``content``，不动 slug / 标题 / URL 结构；
- 追加的句子已存在就跳过，重复执行幂等；
- 目标文章不存在（未发布/已删除）就跳过并打印，不猜；
- 保存时临时断开 post_save 通知信号，内容修订不群发邮件。

默认预演，``--apply`` 才写入。
"""

from django.core.management.base import BaseCommand
from django.db.models.signals import post_save

from articles.models import Article
from articles.signals import notify_subscribers_on_publish

# 正文里写错、指向不存在 slug 的站内链接 → 正确地址。
REPAIRS = [
    ("/article/lc-215-quickselect/", "/article/lc-215-kth-largest-element/"),
    ("/article/lc-347-bucket-topk/", "/article/lc-347-top-k-frequent-elements/"),
]

# 只覆盖「正文里还没有任何站内链接」的文章；已经有内链的不再重复追加。
# 值为 1–2 个目标 slug，按同一主题成组。
TARGETS = {
    # ── 题解：同族题型 ───────────────────────────────────────────
    "kmp-next-array": ["lc-5-longest-palindromic-substring", "lc-415-add-strings"],
    "lc-1-two-sum": ["lc-15-3sum", "lc-347-top-k-frequent-elements"],
    "lc-102-binary-tree-level-order-traversal": [
        "lc-104-226-max-depth-and-invert-binary-tree",
        "lc-994-rotting-oranges",
    ],
    "lc-104-226-max-depth-and-invert-binary-tree": [
        "lc-102-binary-tree-level-order-traversal",
        "lc-236-lowest-common-ancestor-of-a-binary-tree",
    ],
    "lc-121-122-best-time-to-buy-and-sell-stock": [
        "lc-53-maximum-subarray",
        "lc-1262-greatest-sum-divisible-by-three",
    ],
    "lc-124-binary-tree-maximum-path-sum": [
        "lc-236-lowest-common-ancestor-of-a-binary-tree",
        "lc-104-226-max-depth-and-invert-binary-tree",
    ],
    "lc-1262-greatest-sum-divisible-by-three": [
        "lc-322-coin-change",
        "lc-121-122-best-time-to-buy-and-sell-stock",
    ],
    "lc-139-word-break": ["lc-322-coin-change", "lc-72-edit-distance"],
    "lc-141-142-linked-list-cycle": [
        "lc-160-intersection-of-two-linked-lists",
        "lc-234-palindrome-linked-list",
    ],
    "lc-143-reorder-list": [
        "lc-206-reverse-linked-list",
        "lc-141-142-linked-list-cycle",
    ],
    "lc-146-lru-cache": [
        "lc-206-reverse-linked-list",
        "lc-155-232-min-stack-and-queue-via-stacks",
    ],
    "lc-15-3sum": ["lc-1-two-sum", "lc-42-trapping-rain-water"],
    "lc-155-232-min-stack-and-queue-via-stacks": [
        "lc-20-valid-parentheses",
        "lc-224-772-basic-calculator",
    ],
    "lc-160-intersection-of-two-linked-lists": [
        "lc-141-142-linked-list-cycle",
        "lc-143-reorder-list",
    ],
    "lc-165-compare-version-numbers": ["lc-415-add-strings", "lc-93-restore-ip-addresses"],
    "lc-19-remove-nth-from-end": [
        "lc-141-142-linked-list-cycle",
        "lc-206-reverse-linked-list",
    ],
    "lc-1928-min-cost": ["lc-322-coin-change", "lc-1262-greatest-sum-divisible-by-three"],
    "lc-20-valid-parentheses": [
        "lc-155-232-min-stack-and-queue-via-stacks",
        "lc-224-772-basic-calculator",
    ],
    "lc-200-number-of-islands": ["lc-994-rotting-oranges", "lc-207-course-schedule"],
    "lc-206-reverse-linked-list": [
        "lc-21-merge-two-sorted-lists",
        "lc-234-palindrome-linked-list",
    ],
    "lc-207-course-schedule": ["lc-200-number-of-islands", "lc-994-rotting-oranges"],
    "lc-21-merge-two-sorted-lists": [
        "lc-23-merge-k-sorted-lists",
        "lc-206-reverse-linked-list",
    ],
    "lc-224-772-basic-calculator": [
        "lc-20-valid-parentheses",
        "lc-155-232-min-stack-and-queue-via-stacks",
    ],
    "lc-23-merge-k-sorted-lists": ["lc-21-merge-two-sorted-lists", "lc-215-kth-largest-element"],
    "lc-233-number-of-digit-one": [
        "lc-470-implement-rand10-using-rand7",
        "lc-61-poker-straight",
    ],
    "lc-234-palindrome-linked-list": [
        "lc-206-reverse-linked-list",
        "lc-143-reorder-list",
    ],
    "lc-236-lowest-common-ancestor-of-a-binary-tree": [
        "lc-124-binary-tree-maximum-path-sum",
        "lc-104-226-max-depth-and-invert-binary-tree",
    ],
    "lc-239-sliding-window-maximum": [
        "lc-3-longest-substring-without-repeating-characters",
        "lc-155-232-min-stack-and-queue-via-stacks",
    ],
    "lc-3-longest-substring-without-repeating-characters": [
        "lc-239-sliding-window-maximum",
        "lc-56-merge-intervals",
    ],
    "lc-300-longest-increasing-subsequence": ["lc-72-edit-distance", "lc-322-coin-change"],
    "lc-322-coin-change": ["lc-139-word-break", "lc-70-climbing-stairs"],
    "lc-415-add-strings": ["lc-165-compare-version-numbers", "lc-93-restore-ip-addresses"],
    "lc-42-trapping-rain-water": ["lc-15-3sum", "lc-56-merge-intervals"],
    "lc-470-implement-rand10-using-rand7": ["lc-233-number-of-digit-one", "nim-stone-games"],
    "lc-5-longest-palindromic-substring": ["lc-72-edit-distance", "lc-lcs-one-mismatch"],
    "lc-53-maximum-subarray": ["lc-121-122-best-time-to-buy-and-sell-stock", "lc-300-longest-increasing-subsequence"],
    "lc-61-poker-straight": ["nim-stone-games", "lc-470-implement-rand10-using-rand7"],
    "lc-704-69-binary-search-and-sqrt": ["lc-33-153-rotated-binary-search", "lc-215-kth-largest-element"],
    "lc-82-remove-duplicates-from-sorted-list-ii": [
        "lc-19-remove-nth-from-end",
        "lc-21-merge-two-sorted-lists",
    ],
    "lc-93-restore-ip-addresses": ["lc-139-word-break", "lc-415-add-strings"],
    "lc-994-rotting-oranges": ["lc-200-number-of-islands", "lc-102-binary-tree-level-order-traversal"],
    "lc-bitmap-sort-dedup": ["lc-347-top-k-frequent-elements", "lc-215-kth-largest-element"],
    "lc-lcs-one-mismatch": ["lc-72-edit-distance", "lc-5-longest-palindromic-substring"],
    "nim-stone-games": ["lc-470-implement-rand10-using-rand7", "lc-61-poker-straight"],
    "spiral-matrix-fill": ["lc-189-rotate-array", "lc-56-merge-intervals"],
    # ── 后端：网关、版本、部署、限流、灰度、日志 ───────────────────
    "api-gateway-deep-dive": ["api-versioning-deep-dive", "rate-limit-algorithms-deep-dive"],
    "api-versioning-deep-dive": ["api-gateway-deep-dive", "api-idempotency-deep-dive"],
    "cloud-deployment-guide-cn-vs-global": [
        "django-pythonanywhere-deploy",
        "vue-github-pages-deploy",
    ],
    "django-jwt-dual-token-auth": [
        "django-comment-system-guide",
        "django-anon-like-dedup",
    ],
    "django-pythonanywhere-deploy": [
        "cloud-deployment-guide-cn-vs-global",
        "vue-github-pages-deploy",
    ],
    "feature-flag-progressive-delivery": [
        "rate-limit-algorithms-deep-dive",
        "resilience-timeout-retry-circuit-breaker-deep-dive",
    ],
    "rate-limit-algorithms-deep-dive": [
        "resilience-timeout-retry-circuit-breaker-deep-dive",
        "api-gateway-deep-dive",
    ],
    "structured-logging-tracing-deep-dive": [
        "resilience-timeout-retry-circuit-breaker-deep-dive",
        "django-slow-query-index-tuning",
    ],
    "vue-github-pages-deploy": [
        "cloud-deployment-guide-cn-vs-global",
        "django-pythonanywhere-deploy",
    ],
    # ── 数据库：幂等、事务、缓存、分页、索引、存储 ─────────────────
    "blog-tech-stack": ["test-manage-system-vue-django", "django-pythonanywhere-deploy"],
    "btree-page-split": ["nanodb", "distributed-id-deep-dive"],
    "cursor-pagination-deep-dive": [
        "drf-pagination-cache-throttle",
        "django-slow-query-index-tuning",
    ],
    "distributed-id-deep-dive": ["btree-page-split", "redis-distributed-lock-deep-dive"],
    "django-anon-like-dedup": ["api-idempotency-deep-dive", "django-comment-system-guide"],
    "django-bleach-xss-defense": ["django-comment-system-guide", "django-anon-like-dedup"],
    "django-comment-system-guide": ["django-anon-like-dedup", "django-bleach-xss-defense"],
    "django-n1-query-kill": [
        "django-slow-query-index-tuning",
        "django-zero-downtime-migration",
    ],
    "django-slow-query-index-tuning": [
        "django-n1-query-kill",
        "cursor-pagination-deep-dive",
    ],
    "django-subscribe-mass-mail": [
        "mq-reliable-delivery-deep-dive",
        "django-transaction-atomic-on-commit",
    ],
    "django-transaction-atomic-on-commit": [
        "django-zero-downtime-migration",
        "api-idempotency-deep-dive",
    ],
    "drf-pagination-cache-throttle": [
        "cursor-pagination-deep-dive",
        "cache-consistency-deep-dive",
    ],
    "halo-music-square-architecture": [
        "test-manage-system-vue-django",
        "blog-tech-stack",
    ],
    "mq-reliable-delivery-deep-dive": [
        "django-subscribe-mass-mail",
        "resilience-timeout-retry-circuit-breaker-deep-dive",
    ],
    "nanodb": ["wal-deep-dive", "btree-page-split"],
    "redis-distributed-lock-deep-dive": [
        "api-idempotency-deep-dive",
        "cache-consistency-deep-dive",
    ],
    "test-manage-system-vue-django": [
        "blog-tech-stack",
        "halo-music-square-architecture",
    ],
}

ENDING = "下一篇见。"


def build_note(category_slug, titles):
    lead = "同族题延伸：" if category_slug == "leetcode" else "同一条链路上还可以接着读："
    links = "、".join(f"[《{title}》](/article/{slug}/)" for slug, title in titles)
    return f"{lead}{links}。"


def insert_note(content, note):
    """插在「下一篇见。」之前；没有这句就追加到文末。"""
    if ENDING in content:
        return content.replace(ENDING, f"{note}\n\n{ENDING}", 1)
    return content.rstrip() + f"\n\n{note}\n"


def apply_repairs(content):
    repaired = []
    for old, new in REPAIRS:
        if old in content:
            content = content.replace(old, new)
            repaired.append((old, new))
    return content, repaired


class Command(BaseCommand):
    help = "修正站内坏链，并给还没有正文内链的文章追加同族题/同链路链接（默认预演）"

    def add_arguments(self, parser):
        parser.add_argument("--apply", action="store_true", help="真正写入；缺省只打印计划")

    def handle(self, *args, **options):
        apply_changes = options["apply"]
        prefix = "" if apply_changes else "[dry-run] "
        touched = 0
        added = 0
        skipped = []

        post_save.disconnect(notify_subscribers_on_publish, sender=Article)
        try:
            for article in Article.objects.select_related("category").all():
                category = article.category.slug if article.category else "-"
                content, repaired = apply_repairs(article.content)
                note = None

                targets = TARGETS.get(article.slug)
                if targets:
                    title_map = dict(
                        Article.objects.filter(slug__in=targets).values_list("slug", "title")
                    )
                    resolved = [(slug, title_map[slug]) for slug in targets if slug in title_map]
                    missing = [slug for slug in targets if slug not in title_map]
                    if missing:
                        skipped.append((article.slug, f"目标不存在：{', '.join(missing)}"))
                    if resolved:
                        candidate = build_note(category, resolved)
                        if candidate in content:
                            skipped.append((article.slug, "承接语已存在"))
                        else:
                            note = candidate

                if not repaired and note is None:
                    continue

                touched += 1
                self.stdout.write(f"{prefix}{article.slug}")
                for old, new in repaired:
                    self.stdout.write(f"    fix  {old} -> {new}")
                if note:
                    content = insert_note(content, note)
                    added += 1
                    self.stdout.write(f"    + {note}")

                if apply_changes:
                    article.content = content
                    article.save()

            if skipped:
                self.stdout.write("")
                self.stdout.write("跳过：")
                for slug, reason in skipped:
                    self.stdout.write(f"  - {slug}: {reason}")

            self.stdout.write("")
            self.stdout.write(
                f"{prefix}文章 {touched} 篇，追加内链段 {added} 条"
                f"（{'已写入' if apply_changes else '可写入'}）。"
            )
            if not apply_changes:
                self.stdout.write("预演结束；确认无误后加 --apply 写入。")
        finally:
            post_save.connect(notify_subscribers_on_publish, sender=Article)
