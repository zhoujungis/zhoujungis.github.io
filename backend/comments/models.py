from django.db import models


class Comment(models.Model):
    article = models.ForeignKey(
        "articles.Article",
        on_delete=models.CASCADE,
        related_name="comments",
        verbose_name="所属文章",
    )
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="replies",
        verbose_name="父评论",
    )
    author_name = models.CharField(max_length=64, verbose_name="昵称")
    author_email = models.EmailField(verbose_name="邮箱")
    content = models.TextField(verbose_name="评论内容")
    is_approved = models.BooleanField(default=False, verbose_name="是否通过")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "评论"
        verbose_name_plural = "评论"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.author_name} @ {self.article.title}"
