from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAdminUser

from .models import Photo


class PhotoAdminSerializer(serializers.ModelSerializer):
    # Title is optional so photos can be captionless (no overlay shown on the wall).
    title = serializers.CharField(
        required=False, allow_blank=True, default="", max_length=200
    )

    class Meta:
        model = Photo
        fields = ["id", "title", "image", "description", "uploaded_at"]
        read_only_fields = ["uploaded_at"]


class PhotoAdminViewSet(viewsets.ModelViewSet):
    """Authenticated CRUD for photo-wall images (multipart upload)."""

    queryset = Photo.objects.all()
    serializer_class = PhotoAdminSerializer
    permission_classes = [IsAdminUser]
