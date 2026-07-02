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
            "content",
            "is_approved",
            "created_at",
            "replies",
        ]
        read_only_fields = ["is_approved", "created_at"]

    def get_replies(self, obj):
        replies = obj.replies.filter(is_approved=True)
        if replies.exists():
            return CommentSerializer(replies, many=True, context=self.context).data
        return []
