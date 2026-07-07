from django.contrib.sitemaps import Sitemap

from .models import Article

FRONTEND_DOMAIN = "zhoujungis.github.io"


class BaseSitemap(Sitemap):
    protocol = "https"

    def get_urls(self, page=1, site=None, protocol=None):
        # Override to always use the GitHub Pages domain
        return super().get_urls(page=page, site=site, protocol=self.protocol)

    def _urls(self, page, protocol, domain):
        # Force the correct domain instead of site.domain
        return super()._urls(page, protocol, FRONTEND_DOMAIN)


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
