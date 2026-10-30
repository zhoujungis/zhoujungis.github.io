import hashlib

from django.conf import settings
from django.db import models
from django.utils import timezone


class EmailCode(models.Model):
    """一次性邮箱登录验证码。

    只存 sha256 摘要：数据库泄露也拿不到正在流通的验证码。
    """

    email = models.EmailField(db_index=True, verbose_name="邮箱")
    code_hash = models.CharField(max_length=64, verbose_name="验证码哈希")
    expires_at = models.DateTimeField(verbose_name="过期时间")
    attempts = models.PositiveSmallIntegerField(default=0, verbose_name="已尝试次数")
    consumed_at = models.DateTimeField(null=True, blank=True, verbose_name="使用时间")
    ip = models.GenericIPAddressField(null=True, blank=True, verbose_name="请求 IP")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "邮箱验证码"
        verbose_name_plural = "邮箱验证码"
        ordering = ["-created_at"]
        indexes = [models.Index(fields=["email", "-created_at"])]

    @staticmethod
    def make_hash(email, code):
        return hashlib.sha256(f"{email.lower()}:{code}".encode()).hexdigest()

    def is_expired(self):
        return timezone.now() >= self.expires_at


class Profile(models.Model):
    """读者资料。与 Django 自带 User 一对一，不动内置字段。"""

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
        verbose_name="用户",
    )
    nickname = models.CharField(max_length=64, blank=True, verbose_name="昵称")
    avatar_url = models.URLField(blank=True, verbose_name="头像")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        verbose_name = "读者资料"
        verbose_name_plural = "读者资料"

    def __str__(self):
        return self.display_name

    @property
    def display_name(self):
        # 昵称优先；否则取邮箱 @ 前缀，保证评论区永远有可读的名字。
        if self.nickname:
            return self.nickname
        email = self.user.email or ""
        return email.split("@")[0] or f"读者{self.user_id}"


class SocialAccount(models.Model):
    """第三方登录绑定。provider + uid 唯一，一个 User 可绑多个 provider。"""

    class Provider(models.TextChoices):
        GOOGLE = "google", "Google"
        GITHUB = "github", "GitHub"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="social_accounts",
        verbose_name="用户",
    )
    provider = models.CharField(max_length=16, choices=Provider.choices, verbose_name="平台")
    uid = models.CharField(max_length=64, verbose_name="平台用户 ID")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "第三方账号"
        verbose_name_plural = "第三方账号"
        constraints = [
            models.UniqueConstraint(fields=["provider", "uid"], name="uniq_social_provider_uid"),
        ]

    def __str__(self):
        return f"{self.provider}:{self.uid}"


class LoginTicket(models.Model):
    """OAuth 回调后一次性换取 JWT 的短票据。

    避免把 access/refresh 直接拼在跳转 URL 上（会被 Referer、浏览器历史记录带走）。
    """

    ticket = models.CharField(max_length=64, unique=True, verbose_name="票据")
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="login_tickets",
        verbose_name="用户",
    )
    expires_at = models.DateTimeField(verbose_name="过期时间")
    consumed_at = models.DateTimeField(null=True, blank=True, verbose_name="使用时间")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "登录票据"
        verbose_name_plural = "登录票据"
        ordering = ["-created_at"]

    def is_expired(self):
        return timezone.now() >= self.expires_at
