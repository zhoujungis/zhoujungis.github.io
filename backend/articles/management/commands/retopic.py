"""Collapse the legacy taxonomy into five editorial topics.

The blog grew 9 loosely-defined categories (算法 / 技术教程 / AI编程 / 科技前沿 /
项目实践 / 部署指南 / 个人随笔 / 效率工具 / AI评测) and 174 tags, 141 of which
were used once or twice. Search engines read that as "no editorial focus", and
the long tail made /categories and /tags pages useless to humans too.

This command rewrites the taxonomy in place:

  * five topic categories: 算法题解 leetcode, AI Agent aiagent,
    后端架构 backend, 数据库内核 database, 项目实战 projects
  * one legacy bucket kept out of the topic navigation: 随笔 notes
  * tags used by fewer than ``--tags-min`` articles are unlinked and deleted
  * near-duplicate tags (Hou Duan / 后端, AI 编程 / AI编程) are merged first

Dry-run by default — pass ``--apply`` to write. Idempotent: running it twice
produces the same taxonomy and reports zero changes the second time.
"""

from collections import defaultdict

from django.core.management.base import BaseCommand
from django.db import transaction

from articles.models import Article, Category, Tag

TOPICS = [
    ("算法题解", "leetcode"),
    ("AI Agent", "aiagent"),
    ("后端架构", "backend"),
    ("数据库内核", "database"),
    ("项目实战", "projects"),
]
TOPIC_SLUGS = {slug for _, slug in TOPICS}
# 散文没有专题可归，保留一个不在导航里露出的小分类，避免文章变成「未分类」。
NOTES_SLUG = "notes"
KEEP_SLUGS = TOPIC_SLUGS | {NOTES_SLUG}

# 旧分类 → 新专题（None 表示需要按标题/标签再判断）
LEGACY_MAP = {
    "算法": "leetcode",
    "AI编程": "aiagent",
    "科技前沿": "aiagent",
    "AI评测": "aiagent",
    "效率工具": "aiagent",
    # 部署指南是「从零跑通一个项目」的实录，归项目实战而不是后端架构。
    "部署指南": "projects",
    "技术教程": None,
    "项目实践": None,
    "个人随笔": None,
}

DB_HINTS = (
    "数据库", "存储引擎", "redis", "postgres", "b+树", "btree", "btree",
    "wal", "nanodb", "索引", "事务", "缓存", "sqlite", "mysql", "mongodb",
    "分库", "分表", "持久化", "lsm", "页分裂", "mvcc",
)
AI_HINTS = (
    "agent", "大模型", "llm", "claude", "gpt", "deepseek", "kimi", "minimax",
    "glm", "提示词", "prompt", "mcp", "skills", "推理", "评测", "模型",
    "智能体", "上下文工程",
)

# 合并同义标签：值保留，键删除
TAG_ALIASES = {
    "hou duan": "后端",
    "ai 编程": "AI编程",
    "ai编程": "AI编程",
    "分布式": "分布式系统",
}


def _haystack(article):
    parts = [article.title, article.excerpt or ""]
    parts.extend(tag.name for tag in article.tags.all())
    return " ".join(parts).lower()


def _matches(haystack, hints):
    return any(hint in haystack for hint in hints)


def decide_topic(article):
    """Return the target category slug for one article."""
    category = article.category
    # 已经是目标专题的文章原样保留——否则第二次运行会被下面的关键词规则
    # 重新分流（比如「AI Agent」分类里提到 Redis 的文章会被挪去 database）。
    if category and category.slug in KEEP_SLUGS:
        return category.slug
    category_name = category.name if category else ""
    mapped = LEGACY_MAP.get(category_name, None)
    if mapped:
        return mapped

    haystack = _haystack(article)
    if category_name == "个人随笔":
        return "projects" if _matches(haystack, ("matter", "智能家居", "home")) else NOTES_SLUG
    if category_name == "项目实践":
        if _matches(haystack, DB_HINTS):
            return "database"
        if _matches(haystack, AI_HINTS):
            return "aiagent"
        return "projects"

    # 技术教程（以及未分类/未知分类）：先看技术特征，默认归后端
    if _matches(haystack, DB_HINTS):
        return "database"
    if _matches(haystack, AI_HINTS):
        return "aiagent"
    return "backend"


class Command(BaseCommand):
    help = "把旧分类收敛成 5 个专题，并清理低频标签。"

    def add_arguments(self, parser):
        parser.add_argument("--apply", action="store_true", help="真正写入；缺省只打印计划")
        parser.add_argument("--tags-min", type=int, default=3, help="标签最少使用次数（默认 3）")

    def handle(self, *args, **options):
        apply_changes = options["apply"]
        tags_min = max(1, options["tags_min"])
        prefix = "" if apply_changes else "[dry-run] "

        with transaction.atomic():
            categories = self._sync_topics(apply_changes)
            moves = self._retopics(categories, apply_changes, prefix)
            merged, dropped = self._clean_tags(tags_min, apply_changes, prefix)
            if not apply_changes:
                transaction.set_rollback(True)

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(f"{prefix}完成。"))
        self.stdout.write(f"  分类调整：{moves} 篇")
        self.stdout.write(f"  标签合并：{merged} 个；删除低频标签：{dropped} 个")
        if not apply_changes:
            self.stdout.write(self.style.WARNING("  以上为预演，未写入。确认无误后加 --apply。"))

    def _sync_topics(self, apply_changes):
        """Create/rename the five topic categories; return {name: Category}."""
        categories = {}
        for name, slug in TOPICS + [("随笔", NOTES_SLUG)]:
            if apply_changes:
                category, _ = Category.objects.update_or_create(
                    slug=slug, defaults={"name": name}
                )
            else:
                category = Category.objects.filter(slug=slug).first() or Category(
                    name=name, slug=slug
                )
            categories[slug] = category
        return categories

    def _retopics(self, categories, apply_changes, prefix):
        moves = 0
        planned = defaultdict(int)
        old_categories = list(Category.objects.exclude(slug__in=KEEP_SLUGS))
        for article in Article.objects.select_related("category").prefetch_related("tags"):
            target_slug = decide_topic(article)
            target = categories.get(target_slug)
            planned[target_slug] += 1
            current_slug = article.category.slug if article.category else None
            if current_slug == target_slug:
                continue
            moves += 1
            self.stdout.write(
                f"{prefix}{article.category.name if article.category else '未分类'} → {target.name}"
                f" | {article.title[:48]}"
            )
            if apply_changes:
                article.category = target
                article.save(update_fields=["category"])
        # 旧分类全部清空后删除。注意：预演时 article.save 没有真正执行，
        # 旧分类里仍然挂着全部文章，此时统计残留毫无意义，只会在 --apply
        # 之外误报「保留」，所以只在真正写入时检查。
        if apply_changes:
            for old in old_categories:
                count = Article.objects.filter(category=old).count()
                if count:
                    self.stdout.write(
                        self.style.WARNING(f"保留 {old.name}：仍有 {count} 篇文章指向它")
                    )
                    continue
                old.delete()
        tally = "，".join(
            f"{categories[slug].name} {planned.get(slug, 0)}"
            for slug in [s for _, s in TOPICS] + [NOTES_SLUG]
        )
        self.stdout.write(f"{prefix}落点：{tally}")
        return moves

    def _clean_tags(self, tags_min, apply_changes, prefix):
        merged = 0
        dropped = 0

        # 1) 合并同义标签：把关系搬到保留标签上，再删掉别名
        for alias, canonical_name in TAG_ALIASES.items():
            alias_tag = Tag.objects.filter(name__iexact=alias).first()
            if not alias_tag:
                continue
            canonical, _ = Tag.objects.get_or_create(
                name=canonical_name, defaults={"slug": _slugify(canonical_name)}
            )
            if alias_tag.pk == canonical.pk or alias_tag.name == canonical.name:
                continue
            for article in alias_tag.article_set.all():
                article.tags.add(canonical)
            merged += 1
            self.stdout.write(f"{prefix}合并标签 {alias_tag.name} → {canonical.name}")
            if apply_changes:
                alias_tag.delete()

        # 2) 统计使用次数，低频标签先解绑再删除
        counts = defaultdict(int)
        for article in Article.objects.prefetch_related("tags"):
            for tag in article.tags.all():
                counts[tag.pk] += 1

        for tag in Tag.objects.all():
            if counts.get(tag.pk, 0) >= tags_min:
                continue
            dropped += 1
            self.stdout.write(
                f"{prefix}删除标签 {tag.name}（{counts.get(tag.pk, 0)} 篇，阈值 {tags_min}）"
            )
            if apply_changes:
                tag.article_set.clear()
                tag.delete()

        return merged, dropped


def _slugify(name):
    from django.utils.text import slugify

    base = slugify(name) or "tag"
    candidate = base
    index = 2
    while Tag.objects.filter(slug=candidate).exists():
        candidate = f"{base}-{index}"
        index += 1
    return candidate
