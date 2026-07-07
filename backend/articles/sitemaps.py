from django.contrib.sitemaps import Sitemap
from django.urls import reverse

from .models import Article


class BlogSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return Article.objects.filter(status=Article.Status.PUBLISHED).order_by("-created_at")

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f"/article/{obj.slug}/"


class StaticViewSitemap(Sitemap):
    """Static pages sitemap."""
    changefreq = "monthly"
    priority = 0.5

    def items(self):
        return ["Home", "Categories", "Tags", "Archives", "About", "FriendLinks", "PhotoWall"]

    def location(self, item):
        routes = {
            "Home": "/",
            "Categories": "/categories",
            "Tags": "/tags",
            "Archives": "/archives",
            "About": "/about",
            "FriendLinks": "/friends",
            "PhotoWall": "/photos",
        }
        return routes.get(item, "/")
