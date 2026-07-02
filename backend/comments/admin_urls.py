from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import admin_views

router = DefaultRouter()
router.register(
    r"comments",
    admin_views.CommentAdminViewSet,
    basename="admin-comments",
)

urlpatterns = [
    path("stats/", admin_views.StatsView.as_view(), name="admin-stats"),
    path("", include(router.urls)),
]
