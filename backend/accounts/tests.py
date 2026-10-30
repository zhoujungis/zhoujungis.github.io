import os
from datetime import timedelta
from unittest.mock import patch

from django.core.cache import cache
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from .models import EmailCode, LoginTicket, Profile


class EmailCodeLoginTests(APITestCase):
    def setUp(self):
        cache.clear()  # 限流计数器按 IP 计数，逐个用例清零避免互相干扰

    def _request_code(self, email="reader@example.com"):
        with patch("accounts.services._deliver_code") as deliver:
            resp = self.client.post("/api/auth/email/request/", {"email": email})
        return resp, (deliver.call_args.args[1] if deliver.call_args else None)

    def test_request_code_stores_hash_and_sends_mail(self):
        resp, code = self._request_code("Reader@Example.com")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(code), 6)
        record = EmailCode.objects.get()
        self.assertEqual(record.email, "reader@example.com")
        self.assertNotIn(code, record.code_hash)
        self.assertEqual(len(record.code_hash), 64)

    def test_request_code_rejects_bad_email(self):
        resp = self.client.post("/api/auth/email/request/", {"email": "not-an-email"})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_request_code_enforces_cooldown(self):
        self._request_code()
        resp = self.client.post("/api/auth/email/request/", {"email": "reader@example.com"})
        self.assertEqual(resp.status_code, status.HTTP_429_TOO_MANY_REQUESTS)

    def test_request_code_rolls_back_when_delivery_fails(self):
        with patch("accounts.services._deliver_code", side_effect=RuntimeError("boom")):
            resp = self.client.post(
                "/api/auth/email/request/", {"email": "reader@example.com"}
            )
        self.assertEqual(resp.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)
        self.assertEqual(EmailCode.objects.count(), 0)

    def test_verify_creates_user_and_returns_tokens(self):
        _, code = self._request_code()
        resp = self.client.post(
            "/api/auth/email/verify/", {"email": "reader@example.com", "code": code}
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)
        self.assertIn("refresh", resp.data)
        self.assertEqual(resp.data["user"]["nickname"], "reader")
        self.assertTrue(Profile.objects.filter(user__email="reader@example.com").exists())

    def test_verify_wrong_code_burns_an_attempt(self):
        _, _code = self._request_code()
        resp = self.client.post(
            "/api/auth/email/verify/", {"email": "reader@example.com", "code": "000000"}
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(EmailCode.objects.get().attempts, 1)

    def test_verify_rejects_expired_code(self):
        _, code = self._request_code()
        EmailCode.objects.update(expires_at=timezone.now() - timedelta(seconds=1))
        resp = self.client.post(
            "/api/auth/email/verify/", {"email": "reader@example.com", "code": code}
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_blocks_after_max_attempts(self):
        _, code = self._request_code()
        EmailCode.objects.update(attempts=5)
        resp = self.client.post(
            "/api/auth/email/verify/", {"email": "reader@example.com", "code": code}
        )
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_verify_consumes_code_once(self):
        _, code = self._request_code()
        payload = {"email": "reader@example.com", "code": code}
        self.assertEqual(self.client.post("/api/auth/email/verify/", payload).status_code, 200)
        self.assertEqual(
            self.client.post("/api/auth/email/verify/", payload).status_code,
            status.HTTP_400_BAD_REQUEST,
        )


class MeViewTests(APITestCase):
    def setUp(self):
        from django.contrib.auth.models import User

        self.user = User.objects.create_user(username="reader", email="reader@example.com")

    def test_requires_authentication(self):
        self.assertEqual(self.client.get("/api/auth/me/").status_code, 401)

    def test_returns_profile_payload(self):
        self.client.force_authenticate(self.user)
        resp = self.client.get("/api/auth/me/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["nickname"], "reader")

    def test_update_nickname(self):
        self.client.force_authenticate(self.user)
        resp = self.client.patch("/api/auth/me/", {"nickname": "小周"})
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["nickname"], "小周")

    def test_rejects_blank_nickname(self):
        self.client.force_authenticate(self.user)
        resp = self.client.patch("/api/auth/me/", {"nickname": "   "})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)


class OAuthFlowTests(APITestCase):
    def setUp(self):
        cache.clear()

    def test_start_unconfigured_returns_503(self):
        with patch.dict(os.environ, {}, clear=False):
            os.environ.pop("GITHUB_CLIENT_ID", None)
            os.environ.pop("GITHUB_CLIENT_SECRET", None)
            resp = self.client.get("/api/auth/oauth/github/start/")
        self.assertEqual(resp.status_code, status.HTTP_503_SERVICE_UNAVAILABLE)

    def test_start_configured_returns_authorize_url(self):
        env = {"GITHUB_CLIENT_ID": "cid", "GITHUB_CLIENT_SECRET": "secret"}
        with patch.dict(os.environ, env):
            resp = self.client.get("/api/auth/oauth/github/start/?next=/article/foo")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("github.com/login/oauth/authorize", resp.data["url"])
        self.assertIn("client_id=cid", resp.data["url"])

    def test_callback_rejects_tampered_state(self):
        resp = self.client.get("/api/auth/oauth/github/callback/?code=x&state=bad")
        self.assertEqual(resp.status_code, 302)
        self.assertIn("login_error=state", resp["Location"])

    def test_callback_issues_one_time_ticket(self):
        from accounts.views import STATE_SALT
        from django.core.signing import dumps

        state = dumps({"p": "github", "n": "/article/foo"}, salt=STATE_SALT)
        with patch(
            "accounts.views.oauth.exchange_for_identity",
            return_value=("42", "reader@example.com", "Reader", ""),
        ):
            resp = self.client.get(
                "/api/auth/oauth/github/callback/", {"code": "abc", "state": state}
            )
        self.assertEqual(resp.status_code, 302)
        self.assertIn("login_ticket=", resp["Location"])

        ticket = LoginTicket.objects.get()
        exchange = self.client.post("/api/auth/oauth/exchange/", {"ticket": ticket.ticket})
        self.assertEqual(exchange.status_code, status.HTTP_200_OK)
        self.assertIn("access", exchange.data)
        # 票据只能用一次
        replay = self.client.post("/api/auth/oauth/exchange/", {"ticket": ticket.ticket})
        self.assertEqual(replay.status_code, status.HTTP_400_BAD_REQUEST)

    def test_exchange_rejects_expired_ticket(self):
        from django.contrib.auth.models import User

        user = User.objects.create_user(username="reader", email="reader@example.com")
        LoginTicket.objects.create(
            ticket="expired-ticket",
            user=user,
            expires_at=timezone.now() - timedelta(seconds=1),
        )
        resp = self.client.post("/api/auth/oauth/exchange/", {"ticket": "expired-ticket"})
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
