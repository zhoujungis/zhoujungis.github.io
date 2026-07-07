from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"articles", views.ArticleViewSet, basename="article")
router.register(r"categories", views.CategoryViewSet, basename="category")
router.register(r"tags", views.TagViewSet, basename="tag")

urlpatterns = [
    path("", include(router.urls)),
    path("articles/<slug:slug>/like/", views.like_article, name="article-like"),
    path("subscribe/", views.subscribe_newsletter, name="newsletter-subscribe"),
]
