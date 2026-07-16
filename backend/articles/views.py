from django.db import transaction
from django.db.models import Count, F, Q
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from django_filters.rest_framework import DjangoFilterBackend

from .models import Article, ArticleLike, Category, Tag, Subscriber
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
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        # Annotate published article count in a single query instead of N+1
        return Category.objects.annotate(
            article_count=Count(
                "article",
                filter=Q(article__status=Article.Status.PUBLISHED),
            )
        )


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TagSerializer
    pagination_class = None

    def get_queryset(self):
        # Annotate published article count in a single query instead of N+1
        return Tag.objects.annotate(
            article_count=Count(
                "article",
                filter=Q(article__status=Article.Status.PUBLISHED),
            )
        )


# ── Article Likes ──────────────────────────────────────────────

@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([AnonRateThrottle])
def like_article(request, slug):
    """Increment like count for an article.

    H12 (server-side dedup): trust a 24h sliding-window IP+UA table
    instead of cookies. Cookies are unreliable across origins / SameSite
    rules, so they could be bypassed by clearing browser state.
    """
    article = get_object_or_404(Article, slug=slug, status=Article.Status.PUBLISHED)

    # Client fingerprint: trusted-proxy IP (rightmost XFF) + UA.
    # Using the leftmost XFF (the older approach) lets clients trivially
    # bypass the dedup by setting XFF to a random IP per request. The
    # rightmost XFF entry is added by the trusted reverse proxy (PA's
    # web frontend) and cannot be spoofed by the client.
    xff = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if xff:
        ip = xff.split(",")[-1].strip()
    else:
        ip = request.META.get("REMOTE_ADDR", "")
    ip = (ip or "")[:64]
    ua = (request.META.get("HTTP_USER_AGENT", "") or "")[:255]

    since = timezone.now() - timezone.timedelta(hours=24)
    already = ArticleLike.objects.filter(
        article=article, ip=ip, ua=ua, created_at__gte=since
    ).exists()
    if already:
        article.refresh_from_db(fields=["likes_count"])
        return Response({"likes_count": article.likes_count, "liked": True}, status=status.HTTP_200_OK)

    with transaction.atomic():
        ArticleLike.objects.create(article=article, ip=ip, ua=ua)
        Article.objects.filter(pk=article.pk).update(likes_count=F("likes_count") + 1)
    article.refresh_from_db(fields=["likes_count"])
    return Response({"likes_count": article.likes_count, "liked": True}, status=status.HTTP_201_CREATED)


# ── Newsletter Subscription ────────────────────────────────────

class SubscribeThrottle(AnonRateThrottle):
    scope = "subscribe"


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([SubscribeThrottle])
def subscribe_newsletter(request):
    """Subscribe an email address to the newsletter."""
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError as DjangoValidationError

    email = (request.data.get("email") or "").strip().lower()
    if not email:
        return Response({"error": "请输入有效的邮箱地址"}, status=status.HTTP_400_BAD_REQUEST)
    # Real email validation — the old `if "@" in email` check accepted
    # "a@b" / "@" / "x@" and let bad addresses poison send_mass_mail(),
    # which then fails the entire batch on the first bounce.
    try:
        validate_email(email)
    except DjangoValidationError:
        return Response({"error": "请输入有效的邮箱地址"}, status=status.HTTP_400_BAD_REQUEST)

    sub, created = Subscriber.objects.get_or_create(email=email)
    # L6: re-subscribing a previously unsubscribed user flips them back to active
    if not created and not sub.is_active:
        sub.is_active = True
        sub.save(update_fields=["is_active"])
        return Response({"detail": "订阅成功！"}, status=status.HTTP_201_CREATED)
    if created:
        return Response({"detail": "订阅成功！"}, status=status.HTTP_201_CREATED)
    return Response({"detail": "该邮箱已订阅"}, status=status.HTTP_200_OK)
