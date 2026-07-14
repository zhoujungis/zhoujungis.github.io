from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import admin_views

router = DefaultRouter()
router.register(r"photos", admin_views.PhotoAdminViewSet, basename="admin-photo")

urlpatterns = [
    path("", include(router.urls)),
]
