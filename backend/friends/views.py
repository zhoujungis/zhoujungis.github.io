from rest_framework import viewsets

from .models import FriendLink
from .serializers import FriendLinkSerializer


class FriendLinkViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FriendLink.objects.filter(is_active=True)
    serializer_class = FriendLinkSerializer
    pagination_class = None
