from django.contrib import admin

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


@admin.register(Subscriber)
class SubscriberAdmin(admin.ModelAdmin):
    list_display = ["email", "is_active", "subscribed_at"]
    list_filter = ["is_active"]
    search_fields = ["email"]
    date_hierarchy = "subscribed_at"
    actions = ["deactivate_subscribers"]

    @admin.action(description="停用选中的订阅者")
    def deactivate_subscribers(self, request, queryset):
        queryset.update(is_active=False)
