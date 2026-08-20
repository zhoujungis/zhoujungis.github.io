from django.core.management.base import BaseCommand

from articles.models import Article, make_excerpt


class Command(BaseCommand):
    help = (
        "Regenerate article excerpts from rendered HTML. Run after deploying "
        "the make_excerpt() fix so older articles don't keep leaking raw "
        "Markdown/HTML (inline <svg>, <https://...> autolinks) into cards."
    )

    def add_arguments(self, parser):
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print what would change without saving.",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        qs = Article.objects.all().order_by("id")
        changed = 0

        for article in qs:
            new_excerpt = make_excerpt(article.html_content, article.content)
            if new_excerpt == article.excerpt:
                continue
            changed += 1
            if dry_run:
                self.stdout.write(f"[dry-run] would update: {article.slug}")
            else:
                # save(update_fields=["excerpt"]) only persists the excerpt;
                # updated_at and other side effects are left untouched.
                article.excerpt = new_excerpt
                article.save(update_fields=["excerpt"])
                self.stdout.write(f"updated: {article.slug}")

        verb = "would update" if dry_run else "updated"
        self.stdout.write(self.style.SUCCESS(f"Done. {verb} {changed}/{qs.count()} excerpt(s)."))
