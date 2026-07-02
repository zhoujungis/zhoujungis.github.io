import os
import uuid

from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework import serializers, status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Article, Category, Tag


class CategoryNestedField(serializers.RelatedField):
    def to_representation(self, value):
        return {"id": value.id, "name": value.name, "slug": value.slug}


class TagNestedField(serializers.RelatedField):
    def to_representation(self, value):
        return {"id": value.id, "name": value.name, "slug": value.slug}


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
    permission_classes = [IsAuthenticated]


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def upload_image(request):
    """Upload an image file and return its URL."""
    if "file" not in request.FILES:
        return Response({"error": "No file provided"}, status=status.HTTP_400_BAD_REQUEST)

    file = request.FILES["file"]

    # Validate file type
    ext = os.path.splitext(file.name)[1].lower()
    allowed_extensions = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"}
    if ext not in allowed_extensions:
        return Response(
            {"error": f"Unsupported file type: {ext}"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Generate unique filename and save
    filename = f"uploads/{uuid.uuid4().hex}{ext}"
    saved_path = default_storage.save(filename, file)
    file_url = request.build_absolute_uri(settings.MEDIA_URL + saved_path)

    return Response({"url": file_url}, status=status.HTTP_201_CREATED)
