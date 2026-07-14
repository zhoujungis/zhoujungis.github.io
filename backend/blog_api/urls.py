from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.sitemaps.views import sitemap
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from articles.feeds import LatestArticlesFeed
from articles.sitemaps import BlogSitemap, StaticViewSitemap

sitemaps = {
    "blog": BlogSitemap,
    "pages": StaticViewSitemap,
}


def sitemap_view(request):
    """Sitemap view — ensures Site exists and sets correct domain."""
    from django.contrib.sites.models import Site

    site, _ = Site.objects.get_or_create(
        id=1,
        defaults={"domain": "zhoujungis.github.io", "name": "ZhouJun's Blog"},
    )
    if site.domain != "zhoujungis.github.io":
        site.domain = "zhoujungis.github.io"
        site.name = "ZhouJun's Blog"
        site.save(update_fields=["domain", "name"])
    return sitemap(request, sitemaps=sitemaps)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include("articles.urls")),
    path("api/admin/", include("articles.admin_urls")),
    path("api/admin/", include("comments.admin_urls")),
    path("api/admin/", include("friends.admin_urls")),
    path("api/admin/", include("photos.admin_urls")),
    path("api/", include("comments.urls")),
    path("api/", include("photos.urls")),
    path("api/", include("friends.urls")),
    path("rss.xml", LatestArticlesFeed(), name="rss-feed"),
    path("sitemap.xml", sitemap_view, name="sitemap"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
