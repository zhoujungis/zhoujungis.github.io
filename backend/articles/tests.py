import tempfile

from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import TestCase, override_settings
from rest_framework import status
from rest_framework.test import APIClient

from .models import Article, Category, Tag


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
