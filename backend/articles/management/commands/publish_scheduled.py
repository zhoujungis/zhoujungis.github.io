"""Publish articles whose scheduled_at has passed.

Replaces the on-every-request UPDATE that previously lived in
``ArticleViewSet.get_queryset`` — running UPDATE on every read caused
write-amplification on hot endpoints (home page, category, tag, search).

Schedule this command on PythonAnywhere:

    python manage.py publish_scheduled

Run hourly (or every 5 minutes if you want tighter scheduling granularity).
"""
from django.core.management.base import BaseCommand
from django.utils import timezone

from articles.models import Article


class Command(BaseCommand):
    help = "Publish scheduled articles whose `scheduled_at` is in the past."

    def handle(self, *args, **options):
        now = timezone.now()
        updated = Article.objects.filter(
            status=Article.Status.SCHEDULED,
            scheduled_at__lte=now,
        ).update(status=Article.Status.PUBLISHED)

        if updated:
            self.stdout.write(
                self.style.SUCCESS(f"Published {updated} scheduled article(s).")
            )
        else:
            self.stdout.write("No scheduled articles due for publication.")