"""账号相关的纯业务逻辑：邮箱规范化、建号、签发令牌、发验证码。"""

import hashlib
import os
import secrets
from datetime import timedelta

import requests
from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken

from .models import EmailCode, Profile

CODE_TTL = timedelta(minutes=10)
CODE_RESEND_COOLDOWN = timedelta(seconds=60)
MAX_CODE_ATTEMPTS = 5
RESEND_ENDPOINT = "https://api.resend.com/emails"


class EmailDeliveryError(Exception):
    """验证码发送失败（供应商不可达 / 拒绝）。"""


def normalize_email(email):
    return (email or "").strip().lower()


def username_for_email(email):
    """内置 User 的 username 上限 150，超长邮箱用哈希后缀收敛。"""
    email = normalize_email(email)
    if len(email) <= 150:
        return email
    digest = hashlib.sha1(email.encode()).hexdigest()[:8]
    return f"{email[:140]}-{digest}"


def get_or_create_user(email, nickname="", avatar_url=""):
    """以已验证邮箱为唯一身份建号；三种登录方式共用同一个 User。"""
    email = normalize_email(email)
    user, created = User.objects.get_or_create(
        username=username_for_email(email),
        defaults={"email": email},
    )
    if not created and not user.email:
        user.email = email
        user.save(update_fields=["email"])

    profile, _ = Profile.objects.get_or_create(user=user)
    changed = False
    if nickname and not profile.nickname:
        profile.nickname = nickname[:64]
        changed = True
    if avatar_url and not profile.avatar_url:
        profile.avatar_url = avatar_url
        changed = True
    if changed:
        profile.save()
    return user


def tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


def user_payload(user):
    try:
        profile = user.profile
    except Profile.DoesNotExist:
        profile = None

    email = user.email or ""
    nickname = profile.nickname if profile and profile.nickname else email.split("@")[0]
    return {
        "id": user.pk,
        "email": email,
        "nickname": nickname or f"读者{user.pk}",
        "avatar_url": profile.avatar_url if profile else "",
        "is_staff": user.is_staff,
    }


def login_payload(user):
    return {**tokens_for_user(user), "user": user_payload(user)}


def latest_code(email):
    return (
        EmailCode.objects.filter(email=normalize_email(email))
        .order_by("-created_at")
        .first()
    )


def issue_email_code(email, ip=None):
    """生成并发送验证码。

    有 RESEND_API_KEY 时走 Resend HTTP API；没有时退回 Django 邮件后端
    （本地开发即 console backend，不阻塞调试）。
    """
    email = normalize_email(email)
    code = f"{secrets.randbelow(1000000):06d}"
    record = EmailCode.objects.create(
        email=email,
        code_hash=EmailCode.make_hash(email, code),
        expires_at=timezone.now() + CODE_TTL,
        ip=ip,
    )
    try:
        _deliver_code(email, code)
    except Exception as exc:  # noqa: BLE001 — 统一收敛成 503，避免泄露供应商细节
        record.delete()
        raise EmailDeliveryError(str(exc)) from exc
    return record


def _deliver_code(email, code):
    context = {
        "code": code,
        "ttl_minutes": int(CODE_TTL.total_seconds() // 60),
        "site_url": settings.SITE_URL,
    }
    text = render_to_string("accounts/email/login_code.txt", context)
    html = render_to_string("accounts/email/login_code.html", context)
    subject = f"【尘世栈帧】登录验证码 {code}"
    from_email = settings.DEFAULT_FROM_EMAIL or "no-reply@zhoujun.dev"

    api_key = os.environ.get("RESEND_API_KEY", "")
    if not api_key:
        msg = EmailMultiAlternatives(subject, text, from_email, [email])
        msg.attach_alternative(html, "text/html")
        msg.send(fail_silently=False)
        return

    payload = {
        "from": os.environ.get("RESEND_FROM", from_email),
        "to": [email],
        "subject": subject,
        "text": text,
        "html": html,
    }
    resp = requests.post(
        RESEND_ENDPOINT,
        json=payload,
        headers={"Authorization": f"Bearer {api_key}"},
        timeout=10,
    )
    if resp.status_code >= 400:
        raise EmailDeliveryError(f"resend {resp.status_code}: {resp.text[:200]}")
