import os
import uuid

from django.core.exceptions import ValidationError
from rest_framework import serializers, viewsets
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAdminUser

from .models import Photo


# H-S3: mirror the byte-sniffing whitelist from articles.upload_image so a
# compromised admin account can't drop a malicious SVG / polyglot onto the
# photo wall. Whitelist is JPEG / PNG / GIF / WEBP only.
_ALLOWED_IMAGE_MIMES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
}
_MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB


def _sniff_image_mime(data: bytes) -> str | None:
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "image/png"
    if data[:3] == b"\xff\xd8\xff":
        return "image/jpeg"
    if data[:6] in (b"GIF87a", b"GIF89a"):
        return "image/gif"
    if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
        return "image/webp"
    return None


class PhotoAdminSerializer(serializers.ModelSerializer):
    # Title is optional so photos can be captionless (no overlay shown on the wall).
    title = serializers.CharField(
        required=False, allow_blank=True, default="", max_length=200
    )

    class Meta:
        model = Photo
        fields = ["id", "title", "image", "description", "uploaded_at"]
        read_only_fields = ["uploaded_at"]

    def validate_image(self, value):
        # value is an InMemoryUploadedFile / TemporaryUploadedFile
        if value.size > _MAX_UPLOAD_BYTES:
            raise ValidationError(f"File too large (max {_MAX_UPLOAD_BYTES // (1024*1024)} MB)")
        head = value.read(16)
        value.seek(0)
        mime = _sniff_image_mime(head)
        if mime is None:
            raise ValidationError(
                "Unsupported file type — only JPEG, PNG, GIF, WEBP are accepted"
            )
        return value


class PhotoAdminViewSet(viewsets.ModelViewSet):
    """Authenticated CRUD for photo-wall images (multipart upload)."""

    queryset = Photo.objects.all()
    serializer_class = PhotoAdminSerializer
    permission_classes = [IsAdminUser]
    parser_classes = [MultiPartParser]
