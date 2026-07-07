"""One-time script: re-save all articles to add TOC heading IDs."""
import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "blog_api.settings")
import django
django.setup()
from articles.models import Article

for a in Article.objects.all():
    a.save()
print(f"Done. Re-saved {Article.objects.count()} articles.")
