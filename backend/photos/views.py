from rest_framework import viewsets

from .models import Photo
from .serializers import PhotoSerializer


class PhotoViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
