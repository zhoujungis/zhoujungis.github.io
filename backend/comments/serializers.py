from rest_framework import serializers

from .models import Comment


class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = [
            "id",
            "article",
            "parent",
            "author_name",
            "author_email",
            "content",
            "is_approved",
            "created_at",
            "replies",
        ]
        read_only_fields = ["article", "is_approved", "created_at"]
        extra_kwargs = {
            # author_email only accepted on write, never exposed in responses
            "author_email": {"write_only": True},
        }

    def get_replies(self, obj):
        replies = obj.replies.filter(is_approved=True)
        if replies.exists():
            return CommentSerializer(replies, many=True, context=self.context).data
        return []
