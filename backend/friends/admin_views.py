from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated

from .models import FriendLink


class FriendLinkAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendLink
        fields = ["id", "name", "url", "logo", "description", "is_active", "sort_order"]


class FriendLinkAdminViewSet(viewsets.ModelViewSet):
    queryset = FriendLink.objects.all()
    serializer_class = FriendLinkAdminSerializer
    permission_classes = [IsAuthenticated]
