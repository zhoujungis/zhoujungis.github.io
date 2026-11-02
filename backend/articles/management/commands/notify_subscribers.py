"""给订阅者补发文章通知。

默认只处理「已发布但 notification_sent=False」的文章；``--force`` 可以
对已经标记为已发送的文章重发（例如确认之前的邮件通道没配好）。
"""
from django.core.management.base import BaseCommand

from articles.models import Article
from articles.signals import send_new_article_notification


class Command(BaseCommand):
    help = "Send new-article notification emails to active subscribers."

    def add_arguments(self, parser):
        parser.add_argument(
            "--slug",
            action="append",
            default=[],
            help="只处理指定 slug（可重复传多次）",
        )
        parser.add_argument(
            "--all",
            action="store_true",
            help="处理所有已发布文章（默认只看 notification_sent=False 的）",
        )
        parser.add_argument(
            "--force",
            action="store_true",
            help="忽略 notification_sent，强制重发",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="只列出将要发送的文章，不发邮件",
        )

    def handle(self, *args, **options):
        qs = Article.objects.filter(status=Article.Status.PUBLISHED)
        if options["slug"]:
            qs = qs.filter(slug__in=options["slug"])
        elif not options["all"]:
            qs = qs.filter(notification_sent=False)

        targets = list(qs.order_by("id"))
        if not targets:
            self.stdout.write("没有需要发送通知的文章。")
            return

        if options["dry_run"]:
            for article in targets:
                self.stdout.write(f"[dry-run] {article.slug}: {article.title}")
            return

        total = 0
        for article in targets:
            try:
                sent = send_new_article_notification(article, force=options["force"])
            except Exception as exc:  # noqa: BLE001 — 一篇文章失败不影响其余
                self.stderr.write(
                    self.style.ERROR(f"{article.slug}: 发送失败 — {exc}")
                )
                continue
            total += sent
            self.stdout.write(
                self.style.SUCCESS(f"{article.slug}: 已发送 {sent} 封")
            )

        self.stdout.write(self.style.SUCCESS(f"完成，共 {total} 封。"))
