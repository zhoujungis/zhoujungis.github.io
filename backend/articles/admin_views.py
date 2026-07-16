import os
import uuid

from django.conf import settings
from django.core.files.storage import default_storage
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from .models import Article, Category, Tag
from .serializers import CategorySerializer, CategoryNestedField, TagSerializer, TagNestedField


class ArticleAdminSerializer(serializers.ModelSerializer):
    category = CategoryNestedField(read_only=True)
    tags = TagNestedField(many=True, read_only=True)
    slug = serializers.SlugField(required=False, allow_blank=True)
    category_id = serializers.IntegerField(
        required=False, allow_null=True, write_only=True
    )
    tags_ids = serializers.ListField(
        child=serializers.IntegerField(), required=False, write_only=True
    )

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "content",
            "cover_image",
            "status",
            "is_top",
            "category",
            "tags",
            "category_id",
            "tags_ids",
            "html_content",
            "excerpt",
            "views_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "html_content",
            "excerpt",
            "views_count",
            "created_at",
            "updated_at",
        ]

    def validate_category_id(self, value):
        if value is not None and not Category.objects.filter(id=value).exists():
            raise serializers.ValidationError("Category not found")
        return value

    def create(self, validated_data):
        tags_ids = validated_data.pop("tags_ids", [])
        category_id = validated_data.pop("category_id", None)
        if category_id is not None:
            validated_data["category"] = Category.objects.get(id=category_id)
        article = Article.objects.create(**validated_data)
        if tags_ids:
            article.tags.set(Tag.objects.filter(id__in=tags_ids))
        return article

    def update(self, instance, validated_data):
        tags_ids = validated_data.pop("tags_ids", None)

        if "category_id" in validated_data:
            category_id = validated_data.pop("category_id")
            if category_id is not None:
                validated_data["category"] = Category.objects.get(id=category_id)
            else:
                validated_data["category"] = None

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if tags_ids is not None:
            instance.tags.set(Tag.objects.filter(id__in=tags_ids))
        return instance


class ArticleAdminViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleAdminSerializer
    permission_classes = [IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status", "is_top"]


class CategoryAdminViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminUser]


class TagAdminViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [IsAdminUser]


# Map allowed MIME → extension. SVG intentionally excluded (XSS risk).
_ALLOWED_IMAGE_MIMES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
}
_MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB


class _UploadThrottle(ScopedRateThrottle):
    scope = "upload"


def _sniff_image_mime(data: bytes) -> str | None:
    """Detect real MIME from file header bytes. No external deps.

    Returns the canonical MIME type (e.g. 'image/png') or None.
    Trusts the byte signature, not the user-supplied extension or Content-Type.
    """
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if data[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return None


@api_view(["POST"])
@permission_classes([IsAdminUser])
@throttle_classes([_UploadThrottle])
def upload_image(request):
    """Upload an image and return its URL.

    Security:
      * Trusts byte signature (not extension or Content-Type) — defeats SVG/script polyglots.
      * SVG is never accepted (XSS surface).
      * Hard size limit (10 MB) prevents DoS via disk fill.
      * Filename rewritten to UUID — no user-controlled path component.
      * Throttled to 100 uploads/hour per authenticated user.
    """
    file = request.FILES.get("file") or request.FILES.get("image")
    if not file:
        return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

    if file.size > _MAX_UPLOAD_BYTES:
        return Response(
            {"error": f"File too large (max {_MAX_UPLOAD_BYTES // (1024*1024)} MB)"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Read first 16 bytes (enough for all four supported signatures) to sniff.
    head = file.read(16)
    file.seek(0)
    mime = _sniff_image_mime(head)
    if mime is None:
        return Response(
            {"error": "Unsupported file type — only JPEG, PNG, GIF, WEBP are accepted"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    ext = _ALLOWED_IMAGE_MIMES[mime]
    filename = f"uploads/{uuid.uuid4().hex}{ext}"
    saved_path = default_storage.save(filename, file)
    file_url = request.build_absolute_uri(settings.MEDIA_URL + saved_path)

    return Response({"url": file_url}, status=status.HTTP_201_CREATED)
