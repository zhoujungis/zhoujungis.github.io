from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
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


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(status=Article.Status.PUBLISHED)
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
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

    def get_queryset(self):
        qs = super().get_queryset()
        # Auto-publish any scheduled articles whose time has come
        from django.db.models import Q

        now = timezone.now()
        scheduled = Article.objects.filter(
            Q(status=Article.Status.SCHEDULED) | Q(status=Article.Status.DRAFT),
            scheduled_at__lte=now,
        )
        for article in scheduled:
            article.status = Article.Status.PUBLISHED
            article.save(update_fields=["status"])
        return qs

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views_count += 1
        instance.save(update_fields=["views_count"])
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
    article.likes_count += 1
    article.save(update_fields=["likes_count"])
    resp = Response({"likes_count": article.likes_count}, status=status.HTTP_200_OK)
    resp.set_cookie(cookie_key, "1", max_age=86400 * 365, httponly=True, samesite="Lax")
    return resp


# ── Newsletter Subscription ────────────────────────────────────

class SubscribeThrottle(AnonRateThrottle):
    rate = "3/hour"


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
