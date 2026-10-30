from django.contrib import admin

from .models import EmailCode, LoginTicket, Profile, SocialAccount


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "nickname", "created_at"]
    search_fields = ["user__email", "user__username", "nickname"]


@admin.register(SocialAccount)
class SocialAccountAdmin(admin.ModelAdmin):
    list_display = ["provider", "uid", "user", "created_at"]
    list_filter = ["provider"]


@admin.register(EmailCode)
class EmailCodeAdmin(admin.ModelAdmin):
    list_display = ["email", "created_at", "expires_at", "attempts", "consumed_at"]
    search_fields = ["email"]


@admin.register(LoginTicket)
class LoginTicketAdmin(admin.ModelAdmin):
    list_display = ["user", "created_at", "expires_at", "consumed_at"]
