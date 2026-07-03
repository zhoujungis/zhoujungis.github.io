from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import admin_views

router = DefaultRouter()
router.register(r"friends", admin_views.FriendLinkAdminViewSet, basename="admin-friendlink")

urlpatterns = [
    path("", include(router.urls)),
]
