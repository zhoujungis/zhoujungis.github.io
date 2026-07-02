from rest_framework import serializers

from .models import FriendLink


class FriendLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendLink
        fields = ["id", "name", "url", "logo", "description", "is_active", "sort_order"]
