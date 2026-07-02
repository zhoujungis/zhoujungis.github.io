from django.db.models import Sum
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from articles.models import Article, Category, Tag
from .models import Comment
from .serializers import CommentSerializer


class CommentAdminViewSet(
    mixins.DestroyModelMixin,
    viewsets.GenericViewSet,
):
    """Admin viewset for comment moderation.

    Endpoints:
        GET    /api/admin/comments/pending/       - List unapproved comments
        PUT    /api/admin/comments/<id>/approve/  - Approve a comment
        DELETE /api/admin/comments/<id>/          - Delete a comment
    """

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAdminUser]

    @action(detail=False, methods=["get"], url_path="pending")
    def pending(self, request):
        """List all unapproved comments."""
        queryset = self.filter_queryset(self.get_queryset()).filter(is_approved=False)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["put"])
    def approve(self, request, pk=None):
        """Approve a single comment by setting is_approved=True."""
        comment = self.get_object()
        comment.is_approved = True
        comment.save(update_fields=["is_approved"])
        serializer = self.get_serializer(comment)
        return Response(serializer.data)


class StatsView(APIView):
    """Return site-wide aggregate statistics.

    Endpoint:
        GET /api/admin/stats/
    """

    permission_classes = [IsAdminUser]

    def get(self, request):
        total_articles = Article.objects.count()
        total_views = Article.objects.aggregate(total=Sum("views_count"))["total"] or 0
        total_comments = Comment.objects.count()
        categories_count = Category.objects.count()
        tags_count = Tag.objects.count()

        return Response(
            {
                "total_articles": total_articles,
                "total_views": total_views,
                "total_comments": total_comments,
                "categories_count": categories_count,
                "tags_count": tags_count,
            }
        )
