"""Django signals for the articles app.

- ``notify_subscribers_on_publish``: fires when an article is first
  published and sends a notification email to all active subscribers.

投递通道：优先走 Resend HTTP API（与登录验证码同一通道），没有
``RESEND_API_KEY`` 时退回 Django 邮件后端。生产环境若两者都没配，
Django 默认的 console backend 会把邮件打印到服务器日志里、却让发送
看起来「成功」——这里显式报错，让 notification_sent 保持 False，
下一次保存可以重试，而不是静默丢信。
"""
import logging
import os

import requests
from django.conf import settings
from django.core.mail import EmailMultiAlternatives, get_connection
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.template.loader import render_to_string

from .models import Article, Subscriber

logger = logging.getLogger(__name__)

# 每个收件人都要有自己的退订链接，所以模板只渲染一次，链接处留占位符，
# 发送前按订阅记录替换 —— 避免为 N 个订阅者重复渲染两份模板。
UNSUBSCRIBE_PLACEHOLDER = "__UNSUBSCRIBE_URL__"

RESEND_ENDPOINT = "https://api.resend.com/emails"
RESEND_BATCH_ENDPOINT = "https://api.resend.com/emails/batch"
RESEND_BATCH_LIMIT = 100
SMTP_BATCH_SIZE = 50

# RFC 2606 保留域名：Resend 直接 422 拒收（还用 example.com 当收件人会让
# 整批一起失败）。库里的冒烟测试订阅者就落在这里，直接跳过，别让它拖累真人。
RESERVED_EMAIL_DOMAINS = {"example.com", "example.org", "example.net", "test", "invalid", "localhost"}
RESERVED_EMAIL_SUFFIXES = (".test", ".invalid", ".localhost", ".example")


class NotificationDeliveryError(Exception):
    """没有可用的邮件通道，或供应商拒绝了这一批邮件。"""


@receiver(post_save, sender=Article)
def notify_subscribers_on_publish(sender, instance, created, **kwargs):
    """Article 首次发布时给所有活跃订阅者发通知。

    force 重发走 ``manage.py notify_subscribers --force``，不经过信号。
    """
    if instance.status != Article.Status.PUBLISHED:
        return
    if instance.notification_sent:
        return

    try:
        sent_count = send_new_article_notification(instance)
    except Exception as exc:  # noqa: BLE001 — 信号里不能把请求打挂
        logger.error(
            "Failed to send new-article notification for '%s': %s",
            instance.title,
            exc,
        )
        return

    if sent_count:
        logger.info(
            "Sent new-article notification for '%s' to %d subscribers.",
            instance.title,
            sent_count,
        )


def send_new_article_notification(article, force=False):
    """给活跃订阅者群发一篇文章的通知，返回成功发送的数量。

    失败时抛出 ``NotificationDeliveryError``（或底层异常），并且不会把
    ``notification_sent`` 置为 True —— 宁可下次重试，也不静默丢信。
    """
    if article.status != Article.Status.PUBLISHED:
        return 0
    if article.notification_sent and not force:
        return 0

    subscribers_qs = Subscriber.objects.filter(is_active=True).order_by("id")
    if not subscribers_qs.exists():
        # Nothing to send — still mark so we don't re-check on every save.
        Article.objects.filter(pk=article.pk).update(notification_sent=True)
        return 0

    blog_url = getattr(settings, "SITE_URL", "https://blog.zhoujun.dev")
    article_url = f"{blog_url}/article/{article.slug}"
    subject = f"\U0001F4DD 新文章: {article.title}"

    context = {
        "title": article.title,
        "excerpt": article.excerpt or "",
        "url": article_url,
        "site_url": blog_url,
        "unsubscribe_url": UNSUBSCRIBE_PLACEHOLDER,
    }
    plain_template = render_to_string("articles/email/new_article.txt", context)
    html_template = render_to_string("articles/email/new_article.html", context)

    api_key = os.environ.get("RESEND_API_KEY", "")
    connection = get_connection()
    from_email, resend_from = _sender_addresses()

    is_console_backend = "console" in connection.__class__.__module__
    if not api_key and is_console_backend and not settings.DEBUG:
        raise NotificationDeliveryError(
            "未配置邮件发送通道：请在 PythonAnywhere 的环境变量里设置 "
            "RESEND_API_KEY（推荐），或 EMAIL_HOST_USER / EMAIL_HOST_PASSWORD。"
            "当前 Django 用的是 console backend，邮件只会写进服务器日志。"
        )

    sent_count = 0
    skipped = []
    batch = []
    batch_limit = RESEND_BATCH_LIMIT if api_key else SMTP_BATCH_SIZE

    # Stream subscribers instead of loading all rows at once.
    for sub in subscribers_qs.iterator(chunk_size=200):
        if not _is_deliverable(sub.email):
            skipped.append(sub.email)
            continue

        plain_body, html_body = _bodies_for(sub, plain_template, html_template)
        if api_key:
            batch.append(
                {
                    "from": resend_from,
                    "to": [sub.email],
                    "subject": subject,
                    "text": plain_body,
                    "html": html_body,
                }
            )
        else:
            msg = EmailMultiAlternatives(
                subject, plain_body, from_email, [sub.email], connection=connection
            )
            msg.attach_alternative(html_body, "text/html")
            batch.append(msg)

        if len(batch) >= batch_limit:
            sent_count += _flush_batch(article, batch, api_key, connection)
            batch = []

    if batch:
        sent_count += _flush_batch(article, batch, api_key, connection)

    if skipped:
        logger.warning(
            "Skipped %d reserved/test subscriber address(es): %s",
            len(skipped),
            ", ".join(skipped),
        )

    if not sent_count:
        # 没有可投递的收件人（没有订阅者，或全是保留域名假地址）：
        # 标记已处理，免得每次保存都重新检查一遍。
        Article.objects.filter(pk=article.pk).update(notification_sent=True)

    return sent_count


def _sender_addresses():
    """返回 Django 后端的发件人、Resend 的发件人（带显示名）。"""
    bare_from = settings.DEFAULT_FROM_EMAIL or "no-reply@zhoujun.dev"
    django_from = settings.DEFAULT_FROM_EMAIL_NAMED or bare_from

    resend_from = os.environ.get("RESEND_FROM") or bare_from
    if "<" not in resend_from:
        resend_from = f"{settings.EMAIL_SENDER_NAME} <{resend_from}>"
    return django_from, resend_from


def _is_deliverable(email):
    """Resend 会 422 拒收 example.com 一类保留域名，提前跳过。"""
    domain = (email or "").rsplit("@", 1)[-1].strip().lower().rstrip(".")
    if not domain:
        return False
    if domain in RESERVED_EMAIL_DOMAINS:
        return False
    return not domain.endswith(RESERVED_EMAIL_SUFFIXES)


def _flush_batch(article, batch, api_key, connection):
    """发送一批，返回成功投递的封数；成功后立刻落 notification_sent。"""
    if api_key:
        resp = requests.post(
            RESEND_BATCH_ENDPOINT,
            json=batch,
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=20,
        )
        if resp.status_code >= 400:
            if resp.status_code >= 500:
                raise NotificationDeliveryError(
                    f"resend batch {resp.status_code}: {resp.text[:200]}"
                )
            # 一批里只要有一个地址被供应商拒收，整批都会 4xx。拆开逐封发，
            # 只丢掉被拒的那几封，别让真人跟着一起收不到。
            sent = _send_one_by_one(article, batch, api_key, resp)
        else:
            sent = len(batch)
    else:
        connection.send_messages(batch)
        sent = len(batch)

    if sent:
        Article.objects.filter(pk=article.pk).update(notification_sent=True)
    return sent


def _send_one_by_one(article, batch, api_key, batch_error):
    sent = 0
    last_error = batch_error
    for message in batch:
        resp = requests.post(
            RESEND_ENDPOINT,
            json=message,
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=20,
        )
        if resp.status_code >= 400:
            last_error = resp
            logger.warning(
                "Resend rejected %s: %s %s",
                message.get("to"),
                resp.status_code,
                resp.text[:120],
            )
            continue
        sent += 1

    if not sent:
        raise NotificationDeliveryError(
            f"resend {last_error.status_code}: {last_error.text[:200]}"
        )
    return sent


def _bodies_for(subscriber, plain_template, html_template):
    """把模板里的占位符换成该订阅者专属的退订链接。"""
    url = subscriber.unsubscribe_url()
    return (
        plain_template.replace(UNSUBSCRIBE_PLACEHOLDER, url),
        html_template.replace(UNSUBSCRIBE_PLACEHOLDER, url),
    )
