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
        # Caller is expected to have prefetched `replies` (and ideally
        # `replies__replies`) on the queryset. We use the cached manager so
        # this method doesn't trigger per-row queries.
        replies = [r for r in obj.replies.all() if r.is_approved]
        # Cap depth to one level of replies — the original implementation
        # was unbounded recursion (CommentSerializer nested in itself),
        # which is both an N+1 hazard and a potential infinite-loop bug if
        # someone ever introduced a cycle (parent points to itself).
        return CommentSerializer(replies, many=True, context=self.context).data

    def get_article_slug(self, obj):
        return obj.article.slug if obj.article_id else None

    def get_article_title(self, obj):
        return obj.article.title if obj.article_id else None
