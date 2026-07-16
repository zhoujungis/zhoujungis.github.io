"""Prune old ArticleLike rows so the dedup table doesn't grow unbounded.

The model docstring promises "Old rows are pruned by a periodic cleanup";
this is that command. We keep 48 hours of dedup records (24h dedup
window + 24h grace) so the index stays small and the dedup query
stays fast.

Schedule this on PythonAnywhere alongside publish_scheduled:

    python manage.py cleanup_article_likes

Hourly is fine — even a daily run keeps the table bounded.
"""
from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from articles.models import ArticleLike


class Command(BaseCommand):
    help = "Delete ArticleLike rows older than 48 hours."

    def add_arguments(self, parser):
        parser.add_argument(
            "--hours",
            type=int,
            default=48,
            help="Delete rows older than this many hours (default: 48).",
        )
        parser.add_argument(
            "--batch",
            type=int,
            default=5000,
            help="Delete in chunks of this size to keep the transaction small (default: 5000).",
        )

    def handle(self, *args, **options):
        hours = options["hours"]
        batch_size = options["batch"]
        cutoff = timezone.now() - timedelta(hours=hours)

        total_deleted = 0
        while True:
            with transaction.atomic():
                # Subquery + DELETE … LIMIT for SQLite / Postgres compatibility
                pks = list(
                    ArticleLike.objects.filter(created_at__lt=cutoff)
                    .values_list("id", flat=True)[:batch_size]
                )
                if not pks:
                    break
                deleted, _ = ArticleLike.objects.filter(id__in=pks).delete()
                total_deleted += deleted
            if len(pks) < batch_size:
                break

        if total_deleted:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Pruned {total_deleted} ArticleLike row(s) older than {hours}h."
                )
            )
        else:
            self.stdout.write("No ArticleLike rows to prune.")