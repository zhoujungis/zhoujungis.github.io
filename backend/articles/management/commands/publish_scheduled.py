"""Publish articles whose scheduled_at has passed.

Replaces the on-every-request UPDATE that previously lived in
``ArticleViewSet.get_queryset`` — running UPDATE on every read caused
write-amplification on hot endpoints (home page, category, tag, search).

Schedule this command on PythonAnywhere:

    python manage.py publish_scheduled

Run hourly (or every 5 minutes if you want tighter scheduling granularity).

Important: must use .save() per article (not .update()) so that the
post_save signal fires and notify_subscribers_on_publish can mail the
new-article notification. .update() bypasses signals.
"""
from django.core.management.base import BaseCommand
from django.utils import timezone

from articles.models import Article


class Command(BaseCommand):
    help = "Publish scheduled articles whose `scheduled_at` is in the past."

    def handle(self, *args, **options):
        now = timezone.now()
        due = Article.objects.filter(
            status=Article.Status.SCHEDULED,
            scheduled_at__lte=now,
        )
        published = 0
        for article in due:
            article.status = Article.Status.PUBLISHED
            article.save()  # triggers post_save → notify_subscribers_on_publish
            published += 1

        if published:
            self.stdout.write(
                self.style.SUCCESS(f"Published {published} scheduled article(s).")
            )
        else:
            self.stdout.write("No scheduled articles due for publication.")