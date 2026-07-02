from rest_framework import viewsets, filters
from django_filters.rest_framework import DjangoFilterBackend

from .models import Article, Category, Tag
from .serializers import (
    ArticleListSerializer,
    ArticleDetailSerializer,
    CategorySerializer,
    TagSerializer,
)


class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(status=Article.Status.PUBLISHED)
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
