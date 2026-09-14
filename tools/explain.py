"""Print the SQL and execution plan of a Django queryset.

Usage:
    cd backend
    DJANGO_SECRET_KEY=dev-only python ../tools/explain.py

    # 或者带参数指定要分析的 queryset
    DJANGO_SECRET_KEY=dev-only python ../tools/explain.py article-list

Read-only: it never writes to the database. ``EXPLAIN QUERY PLAN`` only asks
the query planner what it *would* do.

Notes on other databases:
    MySQL 8      -> "EXPLAIN " + sql              (8.0.18+ 可用 EXPLAIN ANALYZE)
    PostgreSQL   -> "EXPLAIN (ANALYZE, BUFFERS) " + sql

Companion to article/django-slow-query-index-tuning.md.
"""

import os
import sys
from pathlib import Path

# Allow running from the repo root or from backend/.
BACKEND = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "blog_api.settings")
os.environ.setdefault("DJANGO_SECRET_KEY", "explain-script-local-only")

import django  # noqa: E402

django.setup()

from django.db import connection  # noqa: E402


def explain(qs, label="", verbose=True):
    """Return the execution plan of ``qs`` as a list of plan lines."""
    sql, params = qs.query.sql_with_params()
    if verbose:
        print(f"\n=== {label or 'queryset'} ===")
        print("SQL:")
        print("  " + sql.replace(", ", ",\n  "))
        print("PARAMS:", params)
        print("PLAN:")
    with connection.cursor() as cur:
        cur.execute("EXPLAIN QUERY PLAN " + sql, params)
        plan = [row[-1] for row in cur.fetchall()]
    for line in plan:
        print("  " + line)
    return plan


def check(qs, label):
    """Explain a queryset and flag the two classic problems."""
    plan = explain(qs, label)
    joined = " | ".join(plan)
    if "TEMP B-TREE" in joined:
        print("  >>> 警告：排序/分组没走索引（TEMP B-TREE）")
    if "SCAN articles_article" in joined:
        print("  >>> 警告：发生全表扫描")
    return plan


def main():
    from articles.models import Article, Category
    from django.db.models import Count, Q

    published = Article.objects.filter(status=Article.Status.PUBLISHED)

    check(published, "文章列表页（模型默认 ordering：-is_top, -created_at）")
    check(published.order_by("-created_at"), "对照：去掉 is_top 的排序")
    check(published.order_by("-views_count"), "对照：按阅读数排序（无索引列）")
    check(
        published.filter(created_at__date="2026-09-11"),
        "对照：created_at__date 函数包裹",
    )
    check(
        published.filter(title__icontains="django"),
        "对照：icontains 前缀通配",
    )
    check(
        Article.objects.filter(created_at__gt="2026-01-01"),
        "对照：跳过最左列 status",
    )
    check(
        Category.objects.annotate(
            article_count=Count(
                "article", filter=Q(article__status=Article.Status.PUBLISHED)
            )
        ),
        "分类页：文章数注解",
    )
    explain(
        Article.objects.filter(status=Article.Status.PUBLISHED).only("id"),
        "分页 COUNT(*) 等价查询",
    )
    print(
        f"\n数据库: {connection.vendor} {connection.Database.sqlite_version if connection.vendor == 'sqlite' else ''}"
        f" | Django {django.get_version()}"
    )


if __name__ == "__main__":
    main()
