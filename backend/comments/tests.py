from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from articles.models import Article, Category, Tag
from comments.models import Comment


class CommentAdminAPITestCase(APITestCase):
    """Test comment moderation and stats admin endpoints."""

    def setUp(self):
        # Admin user with staff privileges
        self.admin_user = User.objects.create_superuser(
            username="admin", email="admin@test.com", password="admin123"
        )
        # Regular user without staff
        self.regular_user = User.objects.create_user(
            username="user", email="user@test.com", password="admin123"
        )

        # Article dependencies
        self.category = Category.objects.create(name="Tech", slug="tech")
        self.tag1 = Tag.objects.create(name="django", slug="django")
        self.tag2 = Tag.objects.create(name="python", slug="python")

        # Published article
        self.article = Article.objects.create(
            title="Test Article",
            slug="test-article",
            content="Some test content here.",
            category=self.category,
            status=Article.Status.PUBLISHED,
        )
        self.article.tags.add(self.tag1, self.tag2)

        # Comments — one approved, two pending
        self.approved_comment = Comment.objects.create(
            article=self.article,
            author_name="Alice",
            author_email="alice@example.com",
            content="Great article!",
            is_approved=True,
        )
        self.pending_1 = Comment.objects.create(
            article=self.article,
            author_name="Bob",
            author_email="bob@example.com",
            content="Nice post.",
            is_approved=False,
        )
        self.pending_2 = Comment.objects.create(
            article=self.article,
            author_name="Charlie",
            author_email="charlie@example.com",
            content="Thanks for sharing.",
            is_approved=False,
        )

        # Authenticate as admin
        self._auth_as(self.admin_user)

    def _auth_as(self, user, password="admin123"):
        """Obtain a JWT for *user* and attach it to subsequent requests."""
        resp = self.client.post(
            "/api/token/",
            {"username": user.username, "password": password},
        )
        self.token = resp.data.get("access", "")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

    # ------------------------------------------------------------------
    # GET /api/admin/comments/pending/
    # ------------------------------------------------------------------

    def test_pending_comments_lists_unapproved_only(self):
        resp = self.client.get("/api/admin/comments/pending/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        # Results are paginated, check next result count
        if isinstance(resp.data, list):
            ids = [c["id"] for c in resp.data]
        else:
            ids = [c["id"] for c in resp.data.get("results", resp.data)]
        self.assertIn(self.pending_1.id, ids)
        self.assertIn(self.pending_2.id, ids)
        self.assertNotIn(self.approved_comment.id, ids)

    def test_pending_comments_requires_authentication(self):
        self.client.credentials()  # drop token
        resp = self.client.get("/api/admin/comments/pending/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_pending_comments_requires_staff(self):
        self._auth_as(self.regular_user)
        resp = self.client.get("/api/admin/comments/pending/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    # ------------------------------------------------------------------
    # PUT /api/admin/comments/<id>/approve/
    # ------------------------------------------------------------------

    def test_approve_comment(self):
        c = self.pending_1
        self.assertFalse(Comment.objects.get(id=c.id).is_approved)

        resp = self.client.put(f"/api/admin/comments/{c.id}/approve/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue(Comment.objects.get(id=c.id).is_approved)

    def test_approve_comment_requires_authentication(self):
        self.client.credentials()
        resp = self.client.put(f"/api/admin/comments/{self.pending_1.id}/approve/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_approve_comment_requires_staff(self):
        self._auth_as(self.regular_user)
        resp = self.client.put(f"/api/admin/comments/{self.pending_1.id}/approve/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_approve_nonexistent_comment_returns_404(self):
        resp = self.client.put("/api/admin/comments/99999/approve/")
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    # ------------------------------------------------------------------
    # DELETE /api/admin/comments/<id>/
    # ------------------------------------------------------------------

    def test_delete_comment(self):
        cid = self.pending_1.id
        resp = self.client.delete(f"/api/admin/comments/{cid}/")
        self.assertEqual(resp.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Comment.objects.filter(id=cid).exists())

    def test_delete_comment_requires_authentication(self):
        self.client.credentials()
        resp = self.client.delete(f"/api/admin/comments/{self.pending_1.id}/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_comment_requires_staff(self):
        self._auth_as(self.regular_user)
        resp = self.client.delete(f"/api/admin/comments/{self.pending_1.id}/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete_nonexistent_comment_returns_404(self):
        resp = self.client.delete("/api/admin/comments/99999/")
        self.assertEqual(resp.status_code, status.HTTP_404_NOT_FOUND)

    # ------------------------------------------------------------------
    # GET /api/admin/stats/
    # ------------------------------------------------------------------

    def test_stats_returns_correct_counts(self):
        resp = self.client.get("/api/admin/stats/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        expected = {
            "total_articles": 1,
            "total_views": 0,          # default views_count=0
            "total_comments": 3,       # 2 pending + 1 approved
            "categories_count": 1,
            "tags_count": 2,
        }
        for key, val in expected.items():
            self.assertEqual(resp.data[key], val, msg=f"Mismatch for {key}")

    def test_stats_includes_view_count(self):
        # Simulate some views
        self.article.views_count = 42
        self.article.save(update_fields=["views_count"])
        resp = self.client.get("/api/admin/stats/")
        self.assertEqual(resp.data["total_views"], 42)

    def test_stats_requires_authentication(self):
        self.client.credentials()
        resp = self.client.get("/api/admin/stats/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_stats_requires_staff(self):
        self._auth_as(self.regular_user)
        resp = self.client.get("/api/admin/stats/")
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)
