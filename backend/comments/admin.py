from django.contrib import admin

from .models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ["name", "article", "is_approved", "created_at"]
    list_filter = ["is_approved", "article"]
    search_fields = ["name", "email", "content"]
    date_hierarchy = "created_at"
