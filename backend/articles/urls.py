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
    path("subscribe/status/", views.subscription_status, name="newsletter-status"),
    path("subscribe/toggle/", views.toggle_subscription, name="newsletter-toggle"),
    # 邮件里的一键退订落地页，链接形如 /api/unsubscribe/<签名 token>/
    path("unsubscribe/<str:token>/", views.unsubscribe_newsletter, name="newsletter-unsubscribe"),
]
