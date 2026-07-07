from rest_framework import serializers

from .models import Article, Category, Tag


class CategorySerializer(serializers.ModelSerializer):
    article_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "article_count"]

    def get_article_count(self, obj):
        return obj.article_set.filter(status=Article.Status.PUBLISHED).count()


class TagSerializer(serializers.ModelSerializer):
    article_count = serializers.SerializerMethodField()

    class Meta:
        model = Tag
        fields = ["id", "name", "slug", "article_count"]


    def get_article_count(self, obj):
        return obj.article_set.filter(status=Article.Status.PUBLISHED).count()


class CategoryNestedField(serializers.RelatedField):
    def to_representation(self, value):
        return {"id": value.id, "name": value.name, "slug": value.slug}


class TagNestedField(serializers.RelatedField):
    def to_representation(self, value):
        return {"id": value.id, "name": value.name, "slug": value.slug}


class ArticleListSerializer(serializers.ModelSerializer):
    category = CategoryNestedField(read_only=True)
    tags = TagNestedField(many=True, read_only=True)
    reading_time = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "cover_image",
            "category",
            "tags",
            "status",
            "is_top",
            "views_count",
            "reading_time",
            "created_at",
            "updated_at",
        ]

    def get_reading_time(self, obj):
        import re
        text = obj.content or ""
        chinese = len(re.findall(r"[一-鿿㐀-䶿]", text))
        english = len(re.findall(r"[a-zA-Z]+", text))
        return max(1, (chinese + english) // 250 + 1)


class ArticleDetailSerializer(serializers.ModelSerializer):
    category = CategoryNestedField(read_only=True)
    tags = TagNestedField(many=True, read_only=True)
    prev_article = serializers.SerializerMethodField()
    next_article = serializers.SerializerMethodField()

    class Meta:
        model = Article
        fields = [
            "id",
            "title",
            "slug",
            "content",
            "html_content",
            "excerpt",
            "cover_image",
            "category",
            "tags",
            "status",
            "is_top",
            "views_count",
            "created_at",
            "updated_at",
            "prev_article",
            "next_article",
        ]

    def get_prev_article(self, obj):
        prev = (
            Article.objects.filter(
                status=Article.Status.PUBLISHED, created_at__lt=obj.created_at
            )
            .order_by("-created_at")
            .first()
        )
        if prev:
            return {"id": prev.id, "title": prev.title, "slug": prev.slug}
        return None

    def get_next_article(self, obj):
        next_ = (
            Article.objects.filter(
                status=Article.Status.PUBLISHED, created_at__gt=obj.created_at
            )
            .order_by("created_at")
            .first()
        )
        if next_:
            return {"id": next_.id, "title": next_.title, "slug": next_.slug}
        return None
