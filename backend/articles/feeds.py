from django.contrib.syndication.views import Feed
from django.urls import reverse
from django.utils.feedgenerator import Rss201rev2Feed

from .models import Article


class ExtendedRSSFeed(Rss201rev2Feed):
    """RSS 2.0 feed that includes full content in description."""

    def root_attributes(self):
        attrs = super().root_attributes()
        attrs["xmlns:content"] = "http://purl.org/rss/1.0/modules/content/"
        attrs["xmlns:atom"] = "http://www.w3.org/2005/Atom"
        return attrs

    def add_item_elements(self, handler, item):
        super().add_item_elements(handler, item)
        if "content_encoded" in item:
            handler.addQuickElement("content:encoded", item["content_encoded"])


class LatestArticlesFeed(Feed):
    feed_type = ExtendedRSSFeed
    title = "ZhouJun's Blog"
    link = "/"
    description = "Zhou Jun 的个人博客 — 技术、编程、AI 与科学"

    def items(self):
        # L8: prefetch category + tags so item_categories() doesn't trigger
        # N extra queries per feed item (20 articles × 2 = 40 saved queries).
        return (
            Article.objects.filter(status=Article.Status.PUBLISHED)
            .select_related("category")
            .prefetch_related("tags")
            .order_by("-created_at")[:20]
        )

    def item_title(self, item):
        return item.title

    def item_link(self, item):
        return f"/article/{item.slug}/"

    def item_description(self, item):
        return item.excerpt or ""

    def item_extra_kwargs(self, item):
        return {"content_encoded": item.html_content or item.content}

    def item_pubdate(self, item):
        return item.created_at

    def item_categories(self, item):
        cats = [item.category.name] if item.category else []
        cats += [tag.name for tag in item.tags.all()]
        return cats

    def item_author_name(self, item):
        return "Zhou Jun"
