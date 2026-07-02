from django.contrib import admin

from .models import FriendLink


@admin.register(FriendLink)
class FriendLinkAdmin(admin.ModelAdmin):
    list_display = ["name", "url", "is_active", "sort_order"]
    list_filter = ["is_active"]
    search_fields = ["name", "description"]
