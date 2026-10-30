from django.conf import settings
from django.core.signing import BadSignature, loads
from django.db import transaction
from django.db.models import Count, F, Q
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from rest_framework import viewsets, filters, status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle, UserRateThrottle
from django_filters.rest_framework import DjangoFilterBackend

from .models import Article, ArticleLike, Category, Tag, Subscriber, UNSUBSCRIBE_SALT
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


class SubscribeUserThrottle(UserRateThrottle):
    scope = "subscribe"


def _clean_email(value):
    """小写 + 去空白；格式校验交给 Django 的 validate_email。"""
    return (value or "").strip().lower()


@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([SubscribeThrottle])
def subscribe_newsletter(request):
    """Subscribe an email address to the newsletter.

    已登录时邮箱取账号邮箱（即已验证邮箱），提交的 email 被忽略 ——
    前端登录后不再让用户重复输入，订阅记录同时绑定到该账号。
    """
    from django.core.validators import validate_email
    from django.core.exceptions import ValidationError as DjangoValidationError

    user = request.user if request.user.is_authenticated else None
    email = _clean_email(user.email) if user else _clean_email(request.data.get("email"))
    if not email:
        return Response({"error": "请输入有效的邮箱地址"}, status=status.HTTP_400_BAD_REQUEST)
    # Real email validation — the old `if "@" in email` check accepted
    # "a@b" / "@" / "x@" and let bad addresses poison send_mass_mail(),
    # which then fails the entire batch on the first bounce.
    try:
        validate_email(email)
    except DjangoValidationError:
        return Response({"error": "请输入有效的邮箱地址"}, status=status.HTTP_400_BAD_REQUEST)

    sub, created = Subscriber.objects.get_or_create(
        email=email, defaults={"user": user}
    )
    if not created:
        fields = []
        # L6: re-subscribing a previously unsubscribed user flips them back to active
        if not sub.is_active:
            sub.is_active = True
            fields.append("is_active")
        # 匿名订阅过的邮箱，登录后再订阅一次就补上账号关联
        if user and sub.user_id != user.pk:
            sub.user = user
            fields.append("user")
        if fields:
            sub.save(update_fields=fields)
        if not fields:
            return Response({"detail": "该邮箱已订阅"}, status=status.HTTP_200_OK)
    return Response({"detail": "订阅成功！"}, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def subscription_status(request):
    """当前登录账号是否在订阅列表里。"""
    email = _clean_email(request.user.email)
    sub = Subscriber.objects.filter(email=email).first() if email else None
    return Response({"subscribed": bool(sub and sub.is_active), "email": email})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@throttle_classes([SubscribeUserThrottle])
def toggle_subscription(request):
    """用户菜单里的订阅开关：已订阅则退订，未订阅则订阅。"""
    email = _clean_email(request.user.email)
    if not email:
        return Response({"detail": "账号没有绑定邮箱"}, status=status.HTTP_400_BAD_REQUEST)

    sub, created = Subscriber.objects.get_or_create(
        email=email, defaults={"user": request.user, "is_active": True}
    )
    if created:
        return Response({"subscribed": True}, status=status.HTTP_201_CREATED)

    fields = []
    if sub.user_id != request.user.pk:
        sub.user = request.user
        fields.append("user")
    sub.is_active = not sub.is_active
    fields.append("is_active")
    sub.save(update_fields=fields)
    return Response({"subscribed": sub.is_active})


@require_http_methods(["GET", "POST"])
def unsubscribe_newsletter(request, token):
    """邮件里的一键退订落地页。

    GET 先展示确认页、POST 才真正停用 —— 邮件客户端和网关会预取链接，
    如果 GET 直接退订，很多人会在根本没打开邮件的情况下被静默退订。
    """

    def page(state, code=200, email=""):
        context = {"state": state, "email": email, "site_url": settings.SITE_URL}
        return render(request, "articles/unsubscribe.html", context, status=code)

    try:
        payload = loads(token, salt=UNSUBSCRIBE_SALT)
    except BadSignature:
        return page("invalid", 400)

    sub = Subscriber.objects.filter(
        pk=payload.get("pk"), email=payload.get("email")
    ).first()
    if not sub:
        return page("invalid", 404)

    if request.method == "POST":
        if sub.is_active:
            sub.is_active = False
            sub.save(update_fields=["is_active"])
        return page("done", email=sub.email)

    return page("confirm", email=sub.email)
