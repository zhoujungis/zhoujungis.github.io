"""Signal handlers for the comments app.

- ``notify_new_comment``: emails the site admin when a new comment
  is submitted and needs review.
"""

import logging
from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.conf import settings

from .models import Comment

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Comment)
def notify_new_comment(sender, instance, created, **kwargs):
    """Email the administrator when a new comment is created."""
    if not created:
        return

    blog_url = getattr(settings, "SITE_URL", "https://zhoujungis.github.io")
    article_url = f"{blog_url}/article/{instance.article.slug}/"

    body = (
        f"文章：{instance.article.title}\n"
        f"作者：{instance.author_name}\n"
        f"邮箱：{instance.author_email}\n"
        f"内容：\n{instance.content[:500]}\n\n"
        f"查看：{article_url}\n"
        f"审核：{blog_url}/admin/comments\n"
    )

    try:
        send_mail(
            subject=f"\U0001F4AC 新评论待审核 — {instance.article.title}",
            message=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[settings.DEFAULT_FROM_EMAIL],
            fail_silently=True,
        )
    except Exception as exc:
        logger.warning("Failed to send comment notification: %s", exc)
