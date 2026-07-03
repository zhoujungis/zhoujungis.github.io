from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import admin_views

router = DefaultRouter()
router.register(r"articles", admin_views.ArticleAdminViewSet, basename="admin-article")
router.register(r"categories", admin_views.CategoryAdminViewSet, basename="admin-category")
router.register(r"tags", admin_views.TagAdminViewSet, basename="admin-tag")

urlpatterns = [
    path("", include(router.urls)),
    path("upload/", admin_views.upload_image, name="admin-upload"),
]
