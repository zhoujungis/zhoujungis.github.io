from rest_framework import generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle
from django.shortcuts import get_object_or_404

from articles.models import Article
from .models import Comment
from .serializers import CommentSerializer


class CommentPageNumberPagination(PageNumberPagination):
    page_size = 20
    max_page_size = 100
    page_size_query_param = "page_size"


class ArticleCommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]
    # C-S3: actually apply the 'comment' scope (3/min) defined in settings —
    # was previously falling back to the default anon throttle (30/min).
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "comment"
    pagination_class = CommentPageNumberPagination

    def get_queryset(self):
        # Only allow reads on published articles — draft/archived/scheduled
        # content must not leak via comment endpoints.
        article = get_object_or_404(
            Article,
            slug=self.kwargs["article_slug"],
            status=Article.Status.PUBLISHED,
        )
        return Comment.objects.filter(
            article=article, is_approved=True, parent=None
        ).select_related("article").prefetch_related("replies__article")

    def perform_create(self, serializer):
        # Same status guard — don't accept new comments on unpublished articles
        article = get_object_or_404(
            Article,
            slug=self.kwargs["article_slug"],
            status=Article.Status.PUBLISHED,
        )
        parent_id = self.request.data.get("parent")
        parent = None
        if parent_id:
            parent = get_object_or_404(Comment, pk=parent_id, article=article)

        # Honeypot spam check — hidden field only bots fill
        honeypot = self.request.data.get("website", "")
        if honeypot:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"detail": "检测到垃圾评论"})

        serializer.save(article=article, parent=parent, is_approved=False)  # requires admin review
