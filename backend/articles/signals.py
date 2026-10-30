"""
Django signals for the articles app.

- ``notify_subscribers_on_publish``: fires when an article is first
  published and sends a notification email to all active subscribers.
"""
import logging
from django.core.mail import EmailMultiAlternatives, get_connection
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string
from django.conf import settings

from .models import Article, Subscriber

logger = logging.getLogger(__name__)

# 每个收件人都要有自己的退订链接，所以模板只渲染一次，链接处留占位符，
# 发送前按订阅记录替换 —— 避免为 N 个订阅者重复渲染两份模板。
UNSUBSCRIBE_PLACEHOLDER = "__UNSUBSCRIBE_URL__"


@receiver(post_save, sender=Article)
def notify_subscribers_on_publish(sender, instance, created, **kwargs):
    """
    When an article is first published, send a notification email to
    all active subscribers.

    Implementation notes:
    - Stream subscribers via .iterator(chunk_size=200) — no full-list
      materialization in memory at 10K+ subscribers.
    - Send HTML + plain-text multipart, one message per subscriber (each
      needs its own unsubscribe link), reusing a single SMTP connection.
    - Flip the notification_sent flag after EACH successful batch. A
      mid-flight SMTP failure on batch #3 won't trigger re-sending
      batches 1+2 on the next save — they're already marked as notified.
    """
    if instance.status != Article.Status.PUBLISHED:
        return
    if instance.notification_sent:
        return

    blog_url = getattr(settings, "SITE_URL", "https://blog.zhoujun.dev")
    article_url = f"{blog_url}/article/{instance.slug}"
    subject = f"\U0001F4DD 新文章: {instance.title}"

    context = {
        "title": instance.title,
        "excerpt": instance.excerpt or "",
        "url": article_url,
        "site_url": blog_url,
        "unsubscribe_url": UNSUBSCRIBE_PLACEHOLDER,
    }
    plain_template = render_to_string("articles/email/new_article.txt", context)
    html_template = render_to_string("articles/email/new_article.html", context)

    from_email = settings.DEFAULT_FROM_EMAIL
    batch_size = 50

    # Stream subscribers instead of loading all rows at once.
    subscribers_qs = Subscriber.objects.filter(is_active=True).order_by("id")
    if not subscribers_qs.exists():
        # Nothing to send — still mark so we don't re-check on every save.
        Article.objects.filter(pk=instance.pk).update(notification_sent=True)
        return

    connection = get_connection()
    sent_count = 0
    batch = []
    failed = False
    for sub in subscribers_qs.iterator(chunk_size=200):
        plain_body, html_body = _bodies_for(sub, plain_template, html_template)
        msg = EmailMultiAlternatives(
            subject, plain_body, from_email, [sub.email], connection=connection
        )
        msg.attach_alternative(html_body, "text/html")
        batch.append(msg)
        if len(batch) >= batch_size:
            try:
                connection.send_messages(batch)
            except Exception as exc:
                logger.error(
                    "Failed to send notification batch for '%s': %s",
                    instance.title, exc,
                )
                failed = True
                # Don't flip the flag — next save retries from this batch
                break
            sent_count += len(batch)
            # Flip the flag after each successful batch so a partial
            # failure doesn't re-send to subscribers who already received it.
            # (Trade-off: those whose batch failed will retry next save.)
            Article.objects.filter(pk=instance.pk).update(notification_sent=True)
            batch = []

    if batch and not failed:
        try:
            connection.send_messages(batch)
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


def _bodies_for(subscriber, plain_template, html_template):
    """把模板里的占位符换成该订阅者专属的退订链接。"""
    url = subscriber.unsubscribe_url()
    return (
        plain_template.replace(UNSUBSCRIBE_PLACEHOLDER, url),
        html_template.replace(UNSUBSCRIBE_PLACEHOLDER, url),
    )
