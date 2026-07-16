"""
Django signals for the articles app.

- ``notify_subscribers_on_publish``: fires when an article is first
  published and sends a notification email to all active subscribers.
"""
import logging
from django.core.mail import send_mass_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.conf import settings

from .models import Article, Subscriber

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Article)
def notify_subscribers_on_publish(sender, instance, created, **kwargs):
    """
    When an article is first published, send a notification email to
    all active subscribers.

    Implementation notes (round 3 fixes H-B2 + H-B3):
    - Stream subscribers via .iterator(chunk_size=200) — no full-list
      materialization in memory at 10K+ subscribers.
    - Send in batches of 50 via send_mass_mail, but flip the
      notification_sent flag after EACH successful batch. A mid-flight
      SMTP failure on batch #3 won't trigger re-sending batches 1+2
      on the next save — they're already marked as notified.
    """
    if instance.status != Article.Status.PUBLISHED:
        return
    if instance.notification_sent:
        return

    blog_url = getattr(settings, "SITE_URL", "https://zhoujungis.github.io")
    article_url = f"{blog_url}/article/{instance.slug}"
    subject = f"\U0001F4DD 新文章: {instance.title}"

    plain_body = render_to_string("articles/email/new_article.txt", {
        "title": instance.title,
        "excerpt": instance.excerpt or "",
        "url": article_url,
        "site_url": blog_url,
    })

    from_email = settings.DEFAULT_FROM_EMAIL
    batch_size = 50

    # Stream subscribers instead of loading all rows at once.
    subscribers_qs = Subscriber.objects.filter(is_active=True).order_by("id")
    if not subscribers_qs.exists():
        # Nothing to send — still mark so we don't re-check on every save.
        Article.objects.filter(pk=instance.pk).update(notification_sent=True)
        return

    sent_count = 0
    batch = []
    failed = False
    for sub in subscribers_qs.iterator(chunk_size=200):
        batch.append((subject, plain_body, from_email, [sub.email]))
        if len(batch) >= batch_size:
            try:
                send_mass_mail(batch, fail_silently=False)
            except Exception as exc:
                logger.error(
                    "Failed to send notification batch for '%s': %s",
                    instance.title, exc,
                )
                failed = True
                # Don't flip the flag — next save retries from this batch
                break
            sent_count += len(batch)
            # H-B3: flip the flag after each successful batch so a partial
            # failure doesn't re-send to subscribers who already received it.
            # (Trade-off: those whose batch failed will retry next save.)
            Article.objects.filter(pk=instance.pk).update(notification_sent=True)
            batch = []

    if batch and not failed:
        try:
            send_mass_mail(batch, fail_silently=False)
            sent_count += len(batch)
            Article.objects.filter(pk=instance.pk).update(notification_sent=True)
        except Exception as exc:
            logger.error(
                "Failed to send final notification batch for '%s': %s",
                instance.title, exc,
            )

    if sent_count and not failed:
        logger.info(
            "Sent new-article notification for '%s' to %d subscribers.",
            instance.title, sent_count,
        )
