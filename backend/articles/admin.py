from django.contrib import admin, messages

from .models import Article, Category, Tag, Subscriber


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]
    prepopulated_fields = {"slug": ["name"]}


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]
    prepopulated_fields = {"slug": ["name"]}


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "status",
        "category",
        "is_top",
        "views_count",
        "notification_sent",
        "created_at",
    ]
    list_filter = ["status", "is_top", "category", "tags", "notification_sent"]
    search_fields = ["title", "content"]
    prepopulated_fields = {"slug": ["title"]}
    readonly_fields = ["html_content", "excerpt", "views_count", "notification_sent"]
    date_hierarchy = "created_at"
    actions = ["resend_notifications"]

    @admin.action(description="重新发送订阅通知（忽略已发送标记）")
    def resend_notifications(self, request, queryset):
        from .signals import send_new_article_notification

        total = 0
        failed = 0
        for article in queryset.filter(status=Article.Status.PUBLISHED):
            try:
                sent = send_new_article_notification(article, force=True)
            except Exception as exc:  # noqa: BLE001 — 一篇失败不影响其余
                failed += 1
                self.message_user(
                    request,
                    f"{article.slug}: 发送失败 — {exc}",
                    level=messages.ERROR,
                )
                continue
            total += sent
            self.message_user(request, f"{article.slug}: 已发送 {sent} 封")
        self.message_user(request, f"完成：共 {total} 封，失败 {failed} 篇")


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ["email", "user", "is_active", "subscribed_at"]
    list_filter = ["is_active"]
    search_fields = ["email"]
    date_hierarchy = "subscribed_at"
    actions = ["deactivate_subscribers"]

    @admin.action(description="停用选中的订阅者")
    def deactivate_subscribers(self, request, queryset):
        queryset.update(is_active=False)
