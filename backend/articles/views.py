from django.db.models import F
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from django_filters.rest_framework import DjangoFilterBackend

from .models import Article, Category, Tag, Subscriber
from .serializers import (
    ArticleListSerializer,
    ArticleDetailSerializer,
    CategorySerializer,
    TagSerializer,
)


class ArticlePagination(PageNumberPagination):
    """Default page size 10; clients can override via ?page_size=."""
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 1000


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(status=Article.Status.PUBLISHED)
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    pagination_class = ArticlePagination
    filterset_fields = {
        "category__slug": ["exact"],
        "tags__slug": ["exact"],
        "status": ["exact"],
    }
    search_fields = ["title", "content"]

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ArticleDetailSerializer
        return ArticleListSerializer

    # NOTE: scheduled-article publishing used to happen here as a side effect
    # of get_queryset(), which wrote to the DB on every read (home page,
    # category page, tag page, search — all hot). That was a write-amplification
    # bug. It now runs as a periodic management command:
    #     python manage.py publish_scheduled
    # Configure that as an hourly task on PythonAnywhere.

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Atomic increment — avoids race condition
        Article.objects.filter(pk=instance.pk).update(views_count=F("views_count") + 1)
        instance.refresh_from_db(fields=["views_count"])
        return super().retrieve(request, *args, **kwargs)


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = None


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    pagination_class = None


# ── Article Likes ──────────────────────────────────────────────

@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([AnonRateThrottle])
def like_article(request, slug):
    """Increment like count for an article. Simple cookie-based dedup."""
    article = get_object_or_404(Article, slug=slug, status=Article.Status.PUBLISHED)
    cookie_key = f"liked_{article.slug}"
    if request.COOKIES.get(cookie_key):
        return Response({"detail": "已点赞"}, status=status.HTTP_200_OK)
    # Atomic increment — avoids race condition
    Article.objects.filter(pk=article.pk).update(likes_count=F("likes_count") + 1)
    article.refresh_from_db(fields=["likes_count"])
    resp = Response({"likes_count": article.likes_count}, status=status.HTTP_200_OK)
    resp.set_cookie(cookie_key, "1", max_age=86400 * 365, httponly=True, samesite="Lax")
    return resp


# ── Newsletter Subscription ────────────────────────────────────

class SubscribeThrottle(AnonRateThrottle):
    scope = "subscribe"


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([SubscribeThrottle])
def subscribe_newsletter(request):
    """Subscribe an email address to the newsletter."""
    email = request.data.get("email", "").strip().lower()
    if not email or "@" not in email:
        return Response({"error": "请输入有效的邮箱地址"}, status=status.HTTP_400_BAD_REQUEST)
    _, created = Subscriber.objects.get_or_create(email=email)
    if created:
        return Response({"detail": "订阅成功！"}, status=status.HTTP_201_CREATED)
    return Response({"detail": "该邮箱已订阅"}, status=status.HTTP_200_OK)
