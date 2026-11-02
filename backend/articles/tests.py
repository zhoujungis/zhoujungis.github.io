import tempfile
from io import StringIO
from urllib.parse import urlparse

from django.contrib.auth.models import User
from django.core import mail
from django.core.cache import cache
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.management import call_command
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from .models import Article, Category, Subscriber, Tag


class ArticleAdminAPITestCase(TestCase):
    """Test suite for the admin article CRUD API."""

    @classmethod
    def setUpTestData(cls):
        cls.admin_user = User.objects.create_superuser(
            username="admin", email="admin@test.com", password="admin123"
        )
        cls.normal_user = User.objects.create_user(
            username="user", email="user@test.com", password="user123"
        )
        cls.category = Category.objects.create(name="Test Category", slug="test-category")
        cls.tag1 = Tag.objects.create(name="tag1", slug="tag1")
        cls.tag2 = Tag.objects.create(name="tag2", slug="tag2")

    def setUp(self):
        self.client = APIClient()
        self.article_data = {
            "title": "Test Article",
            "slug": "test-article",
            "content": "# Hello\n\nThis is **markdown** content.",
            "status": "draft",
            "is_top": False,
            "category_id": self.category.id,
            "tags_ids": [self.tag1.id, self.tag2.id],
        }

    def _get_token(self, username="admin", password="admin123"):
        resp = self.client.post(
            "/api/token/", {"username": username, "password": password}, format="json"
        )
        return resp.data["access"]

    def _auth_client(self, username="admin", password="admin123"):
        token = self._get_token(username, password)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")

    # --- Authentication tests ---

    def test_unauthenticated_create_fails(self):
        resp = self.client.post("/api/admin/articles/", self.article_data, format="json")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_update_fails(self):
        resp = self.client.put(
            "/api/admin/articles/999/", self.article_data, format="json"
        )
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_unauthenticated_delete_fails(self):
        resp = self.client.delete("/api/admin/articles/999/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    # --- CRUD tests ---

    def test_create_article(self):
        self._auth_client()
        resp = self.client.post("/api/admin/articles/", self.article_data, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["title"], "Test Article")
        self.assertEqual(resp.data["slug"], "test-article")
        self.assertEqual(resp.data["status"], "draft")
        # html_content should be auto-rendered
        self.assertIn("<h1>", resp.data["html_content"])
        self.assertIn("<strong>markdown</strong>", resp.data["html_content"])
        # category and tags should be set
        self.assertEqual(resp.data["category"]["id"], self.category.id)
        self.assertEqual(len(resp.data["tags"]), 2)

    def test_create_article_slug_auto(self):
        self._auth_client()
        data = self.article_data.copy()
        data.pop("slug")
        resp = self.client.post("/api/admin/articles/", data, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertEqual(resp.data["slug"], "test-article")

    def test_list_articles(self):
        Article.objects.create(title="A1", slug="a1", content="c1")
        Article.objects.create(title="A2", slug="a2", content="c2")
        self._auth_client()
        resp = self.client.get("/api/admin/articles/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("results", resp.data)
        self.assertEqual(len(resp.data["results"]), 2)

    def test_retrieve_article(self):
        article = Article.objects.create(title="Detail", slug="detail", content="Content")
        self._auth_client()
        resp = self.client.get(f"/api/admin/articles/{article.id}/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["title"], "Detail")

    def test_update_article_partial(self):
        self._auth_client()
        created = self.client.post("/api/admin/articles/", self.article_data, format="json")
        article_id = created.data["id"]

        update_data = {"title": "Updated Title", "status": "published"}
        resp = self.client.patch(
            f"/api/admin/articles/{article_id}/", update_data, format="json"
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["title"], "Updated Title")
        self.assertEqual(resp.data["status"], "published")
        # html_content should still be rendered
        self.assertIn("<h1>", resp.data["html_content"])

    def test_put_update_article(self):
        self._auth_client()
        created = self.client.post("/api/admin/articles/", self.article_data, format="json")
        article_id = created.data["id"]

        full_data = {
            "title": "Full Update",
            "slug": "full-update",
            "content": "Updated *content*",
            "status": "published",
            "is_top": True,
            "cover_image": "",
            "category_id": None,
            "tags_ids": [],
        }
        resp = self.client.put(
            f"/api/admin/articles/{article_id}/", full_data, format="json"
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["title"], "Full Update")
        self.assertEqual(resp.data["is_top"], True)
        self.assertIsNone(resp.data["category"])
        self.assertEqual(len(resp.data["tags"]), 0)

    def test_delete_article(self):
        self._auth_client()
        created = self.client.post("/api/admin/articles/", self.article_data, format="json")
        article_id = created.data["id"]

        resp = self.client.delete(f"/api/admin/articles/{article_id}/")
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Article.objects.filter(id=article_id).exists())

    # --- Image upload tests ---

    @override_settings(MEDIA_ROOT=tempfile.mkdtemp())
    def test_upload_image(self):
        self._auth_client()
        upload_file = SimpleUploadedFile(
            "test.png", b"fake-png-content", content_type="image/png"
        )
        resp = self.client.post(
            "/api/admin/upload/",
            {"file": upload_file},
            format="multipart",
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertIn("url", resp.data)
        self.assertTrue(resp.data["url"].endswith(".png"))

    def test_upload_no_file(self):
        self._auth_client()
        resp = self.client.post("/api/admin/upload/", {}, format="multipart")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_normal_user_can_access(self):
        """Non-admin authenticated users should also be able to access admin API."""
        self._auth_client(username="user", password="user123")
        resp = self.client.get("/api/admin/articles/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)


@override_settings(EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend")
class NewsletterTests(TestCase):
    """订阅接口、账号绑定、一键退订与发布群发。"""

    @classmethod
    def setUpTestData(cls):
        cls.user = User.objects.create_user(
            username="reader", email="reader@test.com", password="reader123"
        )

    def setUp(self):
        self.client = APIClient()
        # 限流按 IP 计数，且 LocMem 缓存在整个进程里共享；不清零会挤占
        # 其他用例的匿名额度，导致它们在 /api/token/ 上被 429 → 后续 401。
        cache.clear()

    def _auth_client(self):
        resp = self.client.post(
            "/api/token/",
            {"username": "reader", "password": "reader123"},
            format="json",
        )
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {resp.data['access']}")

    # --- 订阅 ---

    def test_anonymous_subscribe_creates_record(self):
        resp = self.client.post(
            "/api/subscribe/", {"email": "anon@test.com"}, format="json"
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        sub = Subscriber.objects.get(email="anon@test.com")
        self.assertTrue(sub.is_active)
        self.assertIsNone(sub.user)

    def test_authenticated_subscribe_uses_account_email(self):
        """登录后订阅以账号邮箱为准，提交的 email 被忽略，并绑定账号。"""
        self._auth_client()
        resp = self.client.post(
            "/api/subscribe/", {"email": "someone@else.com"}, format="json"
        )
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertFalse(Subscriber.objects.filter(email="someone@else.com").exists())
        sub = Subscriber.objects.get(email="reader@test.com")
        self.assertEqual(sub.user_id, self.user.pk)

    def test_subscribe_links_existing_anonymous_record(self):
        Subscriber.objects.create(email="reader@test.com", is_active=False)
        self._auth_client()
        resp = self.client.post("/api/subscribe/", {}, format="json")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        sub = Subscriber.objects.get(email="reader@test.com")
        self.assertTrue(sub.is_active)
        self.assertEqual(sub.user_id, self.user.pk)

    def test_status_requires_login(self):
        resp = self.client.get("/api/subscribe/status/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_status_reflects_subscription(self):
        self._auth_client()
        resp = self.client.get("/api/subscribe/status/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(resp.data["subscribed"])
        self.assertEqual(resp.data["email"], "reader@test.com")

        Subscriber.objects.create(email="reader@test.com")
        resp = self.client.get("/api/subscribe/status/")
        self.assertTrue(resp.data["subscribed"])

    def test_toggle_subscription(self):
        self._auth_client()
        resp = self.client.post("/api/subscribe/toggle/")
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)
        self.assertTrue(resp.data["subscribed"])

        resp = self.client.post("/api/subscribe/toggle/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertFalse(resp.data["subscribed"])
        self.assertFalse(Subscriber.objects.get(email="reader@test.com").is_active)

    # --- 一键退订 ---

    def _unsubscribe_path(self, sub):
        return urlparse(sub.unsubscribe_url()).path

    def test_unsubscribe_get_only_confirms(self):
        sub = Subscriber.objects.create(email="bye@test.com")
        resp = self.client.get(self._unsubscribe_path(sub))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertContains(resp, "确认退订")
        # GET 不能直接停用 —— 邮件网关会预取链接
        sub.refresh_from_db()
        self.assertTrue(sub.is_active)

    def test_unsubscribe_post_deactivates(self):
        sub = Subscriber.objects.create(email="bye@test.com")
        resp = self.client.post(self._unsubscribe_path(sub))
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertContains(resp, "已退订")
        sub.refresh_from_db()
        self.assertFalse(sub.is_active)

    def test_unsubscribe_invalid_token(self):
        resp = self.client.get("/api/unsubscribe/not-a-token/")
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertContains(resp, "链接无效", status_code=400)

    # --- 发布通知 ---

    def test_publish_sends_multipart_with_per_recipient_unsubscribe_link(self):
        from django.core import mail

        Subscriber.objects.create(email="s1@test.com")
        Subscriber.objects.create(email="s2@test.com")
        Subscriber.objects.create(email="gone@test.com", is_active=False)

        Article.objects.create(
            title="Fresh Post",
            slug="fresh-post",
            content="hello",
            status=Article.Status.PUBLISHED,
        )

        self.assertEqual(len(mail.outbox), 2)
        recipients = sorted(m.to[0] for m in mail.outbox)
        self.assertEqual(recipients, ["s1@test.com", "s2@test.com"])

        first = mail.outbox[0]
        self.assertTrue(first.alternatives, "HTML 版缺失")
        html_body = first.alternatives[0][0]
        self.assertIn("/api/unsubscribe/", html_body)
        self.assertIn("/api/unsubscribe/", first.body)
        # 每个收件人的退订链接不同（token 里含各自的 pk）
        self.assertNotEqual(
            mail.outbox[0].body.split("退订：")[-1],
            mail.outbox[1].body.split("退订：")[-1],
        )

        article = Article.objects.get(slug="fresh-post")
        self.assertTrue(article.notification_sent)

    def test_draft_does_not_notify(self):
        from django.core import mail

        Subscriber.objects.create(email="s1@test.com")
        Article.objects.create(
            title="Draft", slug="draft-post", content="x", status=Article.Status.DRAFT
        )
        self.assertEqual(len(mail.outbox), 0)


class SeoLinksCommandTests(TestCase):
    """seolinks：只在原句后追加正文内链，不改原句，也不重复群发。"""

    def setUp(self):
        from articles.management.commands.seolinks import LINKS

        self.source, self.anchor, self.target, self.note = LINKS[0]
        Subscriber.objects.create(email="sub@test.com")

    def _create_article(self, content):
        article = Article.objects.create(
            title="Agent 系列",
            slug=self.source,
            content=content,
            status=Article.Status.DRAFT,
        )
        # 模拟一篇早已发布、通知已发过的老文章，避免 create 时触发群发。
        Article.objects.filter(pk=article.pk).update(
            status=Article.Status.PUBLISHED, notification_sent=True
        )
        return Article.objects.get(pk=article.pk)

    def test_dry_run_does_not_touch_content(self):
        article = self._create_article(f"前言\n\n{self.anchor}\n\n后文")
        call_command("seolinks", stdout=StringIO())
        article.refresh_from_db()
        self.assertIn(self.anchor, article.content)
        self.assertNotIn(f"/article/{self.target}/", article.content)

    def test_apply_inserts_markdown_link_and_renders_html(self):
        article = self._create_article(f"前言\n\n{self.anchor}\n\n后文")
        call_command("seolinks", "--apply", stdout=StringIO())
        article.refresh_from_db()
        self.assertIn(f"{self.anchor}{self.note}", article.content)
        self.assertEqual(article.content.count(f"/article/{self.target}/"), 1)
        self.assertIn(f'href="/article/{self.target}/"', article.html_content)
        # 内容修订不该给订阅者再发一次「新文章」邮件。
        self.assertEqual(len(mail.outbox), 0)

    def test_apply_is_idempotent(self):
        article = self._create_article(f"前言\n\n{self.anchor}\n\n后文")
        call_command("seolinks", "--apply", stdout=StringIO())
        call_command("seolinks", "--apply", stdout=StringIO())
        article.refresh_from_db()
        self.assertEqual(article.content.count(f"/article/{self.target}/"), 1)

    def test_ambiguous_anchor_is_skipped(self):
        article = self._create_article(f"{self.anchor}\n\n{self.anchor}")
        call_command("seolinks", "--apply", stdout=StringIO())
        article.refresh_from_db()
        self.assertNotIn(f"/article/{self.target}/", article.content)


class SeoHeadsCommandTests(TestCase):
    """seoheads：每篇只把 2–3 个 H2 改成搜索问句，默认预演。"""

    CONTENT = "\n\n".join(
        [
            "开头",
            "## 一、思路",
            "正文",
            "## 九、复杂度分析",
            "正文",
            "## 十、常见坑",
            "正文",
            "## 十一、边界情况",
            "正文",
            "## 十二、Java 版",
            "结尾",
        ]
    )

    def setUp(self):
        self.category = Category.objects.create(name="LeetCode", slug="leetcode")
        Subscriber.objects.create(email="sub@test.com")

    def _create_article(self, content, slug="two-sum", category=None):
        article = Article.objects.create(
            title="两数之和",
            slug=slug,
            content=content,
            status=Article.Status.DRAFT,
            category=self.category if category is None else category,
        )
        # 模拟一篇早已发布、通知已发过的老文章，避免 create 时触发群发。
        Article.objects.filter(pk=article.pk).update(
            status=Article.Status.PUBLISHED, notification_sent=True
        )
        return Article.objects.get(pk=article.pk)

    def test_dry_run_does_not_touch_content(self):
        article = self._create_article(self.CONTENT)
        call_command("seoheads", stdout=StringIO())
        article.refresh_from_db()
        self.assertEqual(article.content, self.CONTENT)

    def test_apply_rewrites_headings_and_renders_html(self):
        article = self._create_article(self.CONTENT)
        call_command("seoheads", "--apply", stdout=StringIO())
        article.refresh_from_db()
        self.assertIn("## 九、时间复杂度是多少？", article.content)
        self.assertIn("## 十、这道题有哪些常见坑？", article.content)
        # 保存走的是 Article.save()，HTML 要跟着重新渲染。
        self.assertIn("时间复杂度是多少？", article.html_content)
        self.assertIn("<h2", article.html_content)
        self.assertIn("开头", article.html_content)

    def test_apply_respects_three_change_cap(self):
        article = self._create_article(self.CONTENT)
        call_command("seoheads", "--apply", stdout=StringIO())
        article.refresh_from_db()
        # 共有 4 个可改写标题，但每篇最多改 3 个，最后一个保持原样。
        self.assertEqual(article.content.count("## "), 5)
        question_headings = [
            line for line in article.content.splitlines() if line.startswith("## ")
            and line.endswith("？")
        ]
        self.assertEqual(len(question_headings), 3)
        self.assertIn("## 十二、Java 版", article.content)

    def test_apply_is_idempotent(self):
        article = self._create_article(self.CONTENT)
        call_command("seoheads", "--apply", stdout=StringIO())
        call_command("seoheads", "--apply", stdout=StringIO())
        article.refresh_from_db()
        question_headings = [
            line for line in article.content.splitlines() if line.startswith("## ")
            and line.endswith("？")
        ]
        self.assertEqual(len(question_headings), 3)

    def test_apply_does_not_notify_subscribers(self):
        article = self._create_article(self.CONTENT)
        call_command("seoheads", "--apply", stdout=StringIO())
        article.refresh_from_db()
        self.assertTrue(article.notification_sent)
        # 内容修订不该给订阅者再发一次「新文章」邮件。
        self.assertEqual(len(mail.outbox), 0)

    def test_headings_inside_code_fence_are_ignored(self):
        content = "```\n## 九、复杂度分析\n```\n\n## 十、常见坑\n"
        article = self._create_article(content, slug="code-fence")
        call_command("seoheads", "--apply", stdout=StringIO())
        article.refresh_from_db()
        # 代码块里的 `## ` 不是标题，必须原样保留。
        self.assertIn("## 九、复杂度分析", article.content.split("```")[1])
        self.assertNotIn("## 九、时间复杂度是多少？", article.content)


class InlinksCommandTests(TestCase):
    """inlinks：修坏链 + 给零内链文章追加同族题/同链路链接。"""

    def setUp(self):
        self.category = Category.objects.create(name="LeetCode", slug="leetcode")
        Subscriber.objects.create(email="sub@test.com")

    def _create_article(self, slug, content, category=None):
        article = Article.objects.create(
            title=f"标题 {slug}",
            slug=slug,
            content=content,
            status=Article.Status.DRAFT,
            category=self.category if category is None else category,
        )
        Article.objects.filter(pk=article.pk).update(
            status=Article.Status.PUBLISHED, notification_sent=True
        )
        return Article.objects.get(pk=article.pk)

    def test_apply_repairs_broken_internal_link(self):
        article = self._create_article(
            "kth-largest-with-duplicates",
            "参见 /article/lc-215-quickselect/ 与 /article/lc-347-bucket-topk/。",
        )
        call_command("inlinks", "--apply", stdout=StringIO())
        article.refresh_from_db()
        self.assertIn("/article/lc-215-kth-largest-element/", article.content)
        self.assertIn("/article/lc-347-top-k-frequent-elements/", article.content)
        self.assertNotIn("lc-215-quickselect", article.content)
        self.assertNotIn("lc-347-bucket-topk", article.content)
        self.assertEqual(len(mail.outbox), 0)

    def test_apply_appends_note_and_renders_html(self):
        self._create_article("lc-21-merge-two-sorted-lists", "正文。")
        article = self._create_article("lc-206-reverse-linked-list", "正文。\n\n下一篇见。")
        call_command("inlinks", "--apply", stdout=StringIO())
        article.refresh_from_db()
        self.assertIn("同族题延伸：", article.content)
        self.assertIn("/article/lc-21-merge-two-sorted-lists/", article.content)
        # 承接语插在「下一篇见」之前，结尾顺序不变。
        self.assertLess(
            article.content.index("同族题延伸："),
            article.content.index("下一篇见。"),
        )
        self.assertIn("/article/lc-21-merge-two-sorted-lists/", article.html_content)
        self.assertEqual(len(mail.outbox), 0)

    def test_dry_run_does_not_touch_content(self):
        article = self._create_article(
            "kth-largest-with-duplicates", "参见 /article/lc-215-quickselect/。"
        )
        call_command("inlinks", stdout=StringIO())
        article.refresh_from_db()
        self.assertIn("/article/lc-215-quickselect/", article.content)

    def test_apply_is_idempotent(self):
        self._create_article("lc-21-merge-two-sorted-lists", "正文。")
        article = self._create_article("lc-206-reverse-linked-list", "正文。\n\n下一篇见。")
        call_command("inlinks", "--apply", stdout=StringIO())
        call_command("inlinks", "--apply", stdout=StringIO())
        article.refresh_from_db()
        self.assertEqual(article.content.count("同族题延伸："), 1)

    def test_missing_target_is_skipped(self):
        article = self._create_article("lc-206-reverse-linked-list", "正文。\n\n下一篇见。")
        call_command("inlinks", "--apply", stdout=StringIO())
        article.refresh_from_db()
        self.assertEqual(article.content, "正文。\n\n下一篇见。")
