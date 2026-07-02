from django.contrib import admin

from .models import Article, Category, Tag


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
        "created_at",
    ]
    list_filter = ["status", "is_top", "category", "tags"]
    search_fields = ["title", "content"]
    prepopulated_fields = {"slug": ["title"]}
    readonly_fields = ["html_content", "excerpt", "views_count"]
    date_hierarchy = "created_at"
