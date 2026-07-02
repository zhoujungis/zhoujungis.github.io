from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import admin_views

router = DefaultRouter()
router.register(r"articles", admin_views.ArticleAdminViewSet, basename="admin-article")

urlpatterns = [
    path("", include(router.urls)),
    path("upload/", admin_views.upload_image, name="admin-upload"),
]
