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
    all active subscribers. Uses the ``notification_sent`` flag on the
    model to avoid duplicate sends across multiple saves.
    """
    if instance.status != Article.Status.PUBLISHED:
        return

    if instance.notification_sent:
        return

    subscribers = Subscriber.objects.filter(is_active=True)
    if not subscribers.exists():
        # Mark as sent even with zero subscribers so we don't keep
        # checking on every save — the flag gets flipped once.
        Article.objects.filter(pk=instance.pk).update(notification_sent=True)
        return

    blog_url = getattr(settings, "SITE_URL", "https://zhoujungis.github.io")
    article_url = f"{blog_url}/article/{instance.slug}"

    plain_body = render_to_string("articles/email/new_article.txt", {
        "title": instance.title,
        "excerpt": instance.excerpt or "",
        "url": article_url,
        "site_url": blog_url,
    })
    # HTML body is rendered but send_mass_mail only uses the plain-text
    # part — switch to EmailMultiAlternatives if you want both.
    # html_body = render_to_string("articles/email/new_article.html", { ... })

    subject = f"\U0001F4DD 新文章: {instance.title}"

    messages = [
        (subject, plain_body, settings.DEFAULT_FROM_EMAIL, [sub.email])
        for sub in subscribers
    ]

    try:
        batch_size = 50
        for i in range(0, len(messages), batch_size):
            batch = messages[i:i + batch_size]
            send_mass_mail(batch, fail_silently=False)

        logger.info(
            "Sent new-article notification for '%s' to %d subscribers.",
            instance.title, len(messages),
        )
    except Exception as exc:
        logger.error(
            "Failed to send notifications for '%s': %s",
            instance.title, exc,
        )
        return  # don't flip the flag on failure — retry next save

    # Persist the flag so subsequent saves don't re-fire
    Article.objects.filter(pk=instance.pk).update(notification_sent=True)
