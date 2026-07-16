from rest_framework import serializers

from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()
    article_slug = serializers.SerializerMethodField()
    article_title = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "article",
            "article_slug",
            "article_title",
            "parent",
            "author_name",
            "author_email",
            "content",
            "is_approved",
            "created_at",
            "replies",
        ]
        read_only_fields = [
            "article",
            "article_slug",
            "article_title",
            "is_approved",
            "created_at",
        ]
        extra_kwargs = {
            # author_email only accepted on write, never exposed in responses
            "author_email": {"write_only": True},
        }

    def get_replies(self, obj):
        # Caller is expected to have prefetched `replies` on the queryset.
        # Cap recursion via context['depth'] so:
        #   - deeply nested threads don't blow the call stack
        #   - a malicious parent cycle (A→B→A) can't infinite-loop
        #   - very long threads don't ship as huge payloads
        depth = self.context.get('depth', 0) if self.context else 0
        if depth >= 2:
            return []
        replies = [r for r in obj.replies.all() if r.is_approved]
        return CommentSerializer(
            replies, many=True,
            context={**(self.context or {}), 'depth': depth + 1},
        ).data

    def get_article_slug(self, obj):
        return obj.article.slug if obj.article_id else None

    def get_article_title(self, obj):
        return obj.article.title if obj.article_id else None
