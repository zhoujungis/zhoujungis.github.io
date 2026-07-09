from django.contrib.sitemaps import Sitemap

from .models import Article

FRONTEND_DOMAIN = "zhoujungis.github.io"


class BaseSitemap(Sitemap):
    protocol = "https"

    def get_urls(self, page=1, site=None, protocol=None):
        # Ensure the correct domain is used regardless of Site configuration
        from django.contrib.sites.models import Site

        if site is None:
            site = Site(domain=FRONTEND_DOMAIN, name="ZhouJun's Blog")
        return super().get_urls(page=page, site=site, protocol=self.protocol)


class BlogSitemap(BaseSitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return Article.objects.filter(status=Article.Status.PUBLISHED).order_by("-created_at")

    def lastmod(self, obj):
        return obj.updated_at

    def location(self, obj):
        return f"/article/{obj.slug}/"


class StaticViewSitemap(BaseSitemap):
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
