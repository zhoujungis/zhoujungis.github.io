import markdown
from django.db import models
from django.utils.text import slugify


class Category(models.Model):
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

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Tag(models.Model):
    name = models.CharField(max_length=32, unique=True, verbose_name="标签名称")
    slug = models.SlugField(max_length=32, unique=True, verbose_name="Slug")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "标签"
        verbose_name_plural = "标签"
        ordering = ["name"]

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Article(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "草稿"
        PUBLISHED = "published", "已发布"
        ARCHIVED = "archived", "已归档"

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
    cover_image = models.URLField(blank=True, verbose_name="cover image")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="更新时间")

    class Meta:
        verbose_name = "文章"
        verbose_name_plural = "文章"
        ordering = ["-is_top", "-created_at"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        # Render markdown to HTML
        md = markdown.Markdown(
            extensions=[
                "fenced_code",
                "codehilite",
                "tables",
                "extra",
            ]
        )
        self.html_content = md.convert(self.content)
        # Auto-generate excerpt: first 50 words, strip Markdown syntax
        plain_text = self.content
        # Remove markdown image and link syntax for cleaner excerpt
        import re

        plain_text = re.sub(r"!\[.*?\]\(.*?\)", "", plain_text)
        plain_text = re.sub(r"\[([^\]]*)\]\(.*?\)", r"\1", plain_text)
        plain_text = re.sub(r"[#*>`~\-\+_\[\]()]", "", plain_text)
        plain_text = plain_text.replace("\n", " ").strip()
        words = plain_text.split()
        self.excerpt = " ".join(words[:50]) if len(words) > 50 else plain_text

        super().save(*args, **kwargs)
