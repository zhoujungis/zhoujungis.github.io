from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.shortcuts import get_object_or_404

from articles.models import Article
from .models import Comment
from .serializers import CommentSerializer


class ArticleCommentList(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        article = get_object_or_404(Article, slug=self.kwargs["article_slug"])
        return Comment.objects.filter(
            article=article, is_approved=True, parent=None
        )

    def perform_create(self, serializer):
        article = get_object_or_404(Article, slug=self.kwargs["article_slug"])
        parent_id = self.request.data.get("parent")
        parent = None
        if parent_id:
            parent = get_object_or_404(Comment, pk=parent_id, article=article)
        # Auto-approve comments; switch to is_approved=False + moderation
        # if spam becomes a problem.
        serializer.save(article=article, parent=parent, is_approved=True)
