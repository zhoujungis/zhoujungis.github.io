from django.contrib import admin

from .models import Photo


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ["title", "uploaded_at"]
    search_fields = ["title", "description"]
    date_hierarchy = "uploaded_at"
