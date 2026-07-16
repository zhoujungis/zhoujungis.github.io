import re
import uuid

import bleach
import markdown
from django.db import models
from django.utils import timezone
from django.utils.text import slugify


class AutoSlugMixin:
    """Mixin that auto-generates slug from name on save."""
    slug_source_field = "name"

    def save(self, *args, **kwargs):
        if not self.slug:
            source = getattr(self, self.slug_source_field)
            self.slug = slugify(source)
        super().save(*args, **kwargs)


class Category(AutoSlugMixin, models.Model):
    name = models.CharField(max_length=64, unique=True, verbose_name="分类名称")
    slug = models.SlugField(max_length=64, unique=True, verbose_name="Slug")
    description = models.TextField(blank=True, verbose_name="描述")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "分类"
        verbose_name_plural = "分类"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Tag(AutoSlugMixin, models.Model):
    name = models.CharField(max_length=32, unique=True, verbose_name="标签名称")
    slug = models.SlugField(max_length=32, unique=True, verbose_name="Slug")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "标签"
        verbose_name_plural = "标签"
        ordering = ["name"]

    def __str__(self):
        return self.name


class Article(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "草稿"
        PUBLISHED = "published", "已发布"
        ARCHIVED = "archived", "已归档"
        SCHEDULED = "scheduled", "定时发布"

    title = models.CharField(max_length=200, verbose_name="标题")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    content = models.TextField(verbose_name="内容 (Markdown)")
    html_content = models.TextField(blank=True, editable=False, verbose_name="HTML 内容")
    excerpt = models.TextField(blank=True, editable=False, verbose_name="摘要")
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="分类"
    )
    tags = models.ManyToManyField(Tag, blank=True, verbose_name="标签")
    status = models.CharField(
        max_length=16,
        choices=Status.choices,
        default=Status.DRAFT,
        verbose_name="状态",
    )
    is_top = models.BooleanField(default=False, verbose_name="置顶")
    views_count = models.PositiveIntegerField(default=0, editable=False, verbose_name="阅读数")
    likes_count = models.PositiveIntegerField(default=0, editable=False, verbose_name="点赞数")
    cover_image = models.URLField(blank=True, verbose_name="cover image")
    scheduled_at = models.DateTimeField(null=True, blank=True, verbose_name="定时发布时间")
    notification_sent = models.BooleanField(default=False, verbose_name="已发送通知")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        verbose_name = "文章"
        verbose_name_plural = "文章"
        ordering = ["-is_top", "-created_at"]
        indexes = [
            models.Index(fields=["status", "-created_at"], name="articles_status_created_idx"),
            models.Index(fields=["scheduled_at"], name="articles_scheduled_idx"),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            # Auto-generate slug with collision retry: 中文标题 slugify 后经常冲突
            base = slugify(self.title) or "post"
            slug = base
            i = 2
            qs = Article.objects.filter(slug=slug)
            if self.pk:
                qs = qs.exclude(pk=self.pk)
            while qs.exists():
                slug = f"{base}-{i}"
                i += 1
                qs = Article.objects.filter(slug=slug)
                if self.pk:
                    qs = qs.exclude(pk=self.pk)
                if i > 999:  # sanity bound
                    slug = f"{base}-{uuid.uuid4().hex[:6]}"
                    break
            self.slug = slug
        # Render markdown to HTML
        md = markdown.Markdown(
            extensions=[
                "fenced_code",
                "codehilite",
                "tables",
                "extra",
                "toc",
            ]
        )
        raw_html = md.convert(self.content)
        # Sanitize: strip <script>, event attributes, javascript: URIs etc.
        # Allowlist matches what markdown + codehilite + toc actually produce.
        # C-S2: protocols drop 'data' globally — it was letting
        #   <a href="data:text/html,<script>..."> through, which Safari /
        #   WebViews still execute. Inline base64 images aren't used here
        #   (covers are URLField elsewhere), so the loss is acceptable.
        self.html_content = bleach.clean(
            raw_html,
            tags=bleach.sanitizer.ALLOWED_TAGS
            | {
                "h1", "h2", "h3", "h4", "h5", "h6",
                "img", "pre", "code", "span", "div",
                "table", "thead", "tbody", "tr", "th", "td",
                "hr", "br", "sup", "sub",
                "figure", "figcaption",
            },
            attributes={
                **bleach.sanitizer.ALLOWED_ATTRIBUTES,
                # Merge with bleach defaults (don't clobber colspan/rowspan)
                "img": list(set(["src", "alt", "title", "loading", "decoding"])
                           | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("img", []))),
                "a": list(set(["href", "title", "rel", "target"])
                           | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("a", []))),
                "code": list(set(["class"])
                             | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("code", []))),
                "pre": list(set(["class"])
                            | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("pre", []))),
                "span": list(set(["class"])
                             | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("span", []))),
                "div": list(set(["class"])
                            | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("div", []))),
                "th": list(set(["align"])
                           | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("th", []))),
                "td": list(set(["align"])
                           | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("td", []))),
            },
            protocols=["http", "https", "mailto"],
            strip=True,
        )
        # Force external links to open safely
        self.html_content = re.sub(
            r'<a ([^>]*?)href="(https?://[^"]+)"',
            r'<a \1href="\2" rel="noopener noreferrer" target="_blank"',
            self.html_content,
        )
        # Auto-generate excerpt: first 50 words, strip Markdown syntax
        plain_text = self.content
        # Remove markdown image and link syntax for cleaner excerpt
        plain_text = re.sub(r"!\[.*?\]\(.*?\)", "", plain_text)
        plain_text = re.sub(r"\[([^\]]*)\]\(.*?\)", r"\1", plain_text)
        plain_text = re.sub(r"[#*>`~\-\+_\[\]()]", "", plain_text)
        plain_text = plain_text.replace("\n", " ").strip()
        words = plain_text.split()
        self.excerpt = " ".join(words[:50]) if len(words) > 50 else plain_text

        # Auto-publish scheduled articles whose time has come
        if self.status == self.Status.SCHEDULED and self.scheduled_at and self.scheduled_at <= timezone.now():
            self.status = self.Status.PUBLISHED

        super().save(*args, **kwargs)


class Subscriber(models.Model):
    """Email newsletter subscriber."""
    email = models.EmailField(unique=True, verbose_name="邮箱")
    is_active = models.BooleanField(default=True, verbose_name="是否活跃")
    subscribed_at = models.DateTimeField(auto_now_add=True, verbose_name="订阅时间")

    class Meta:
        verbose_name = "订阅者"
        verbose_name_plural = "订阅者"
        ordering = ["-subscribed_at"]

    def __str__(self):
        return self.email


class ArticleLike(models.Model):
    """H12: server-side like dedup.

    Cross-origin cookie storage is unreliable (different SameSite rules,
    browser quirks). Trust a 24h sliding-window IP+UA dedup table instead.
    Old rows are pruned by a periodic cleanup; unique_together doesn't apply
    because a single client is allowed to like again after 24h.
    """
    article = models.ForeignKey(
        Article, on_delete=models.CASCADE, related_name="like_records",
        verbose_name="文章",
    )
    ip = models.CharField(max_length=64, verbose_name="客户端 IP")
    ua = models.CharField(max_length=255, verbose_name="User-Agent")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="点赞时间")

    class Meta:
        verbose_name = "点赞记录"
        verbose_name_plural = "点赞记录"
        indexes = [
            models.Index(
                fields=["article", "ip", "ua", "created_at"],
                name="articlelike_dedup_idx",
            ),
        ]

    def __str__(self):
        return f"{self.article_id} ← {self.ip}"
