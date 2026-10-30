from datetime import timedelta
import secrets
from urllib.parse import quote, urlencode

from django.conf import settings
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.signing import BadSignature, SignatureExpired, dumps, loads
from django.core.validators import validate_email
from django.http import HttpResponseRedirect
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView

from . import oauth
from .models import EmailCode, LoginTicket, Profile, SocialAccount
from .services import (
    CODE_RESEND_COOLDOWN,
    MAX_CODE_ATTEMPTS,
    EmailDeliveryError,
    get_or_create_user,
    issue_email_code,
    latest_code,
    login_payload,
    normalize_email,
    user_payload,
)

STATE_SALT = "accounts.oauth.state"
TICKET_TTL = timedelta(minutes=2)


def _safe_next(raw):
    """只允许站内相对路径，杜绝 open redirect。"""
    if not raw or not raw.startswith("/") or raw.startswith("//"):
        return "/"
    return raw


def _redirect(path, params):
    query = urlencode(params, quote_via=quote)
    sep = "&" if "?" in path else "?"
    return HttpResponseRedirect(f"{settings.SITE_URL}{path}{sep}{query}")


class EmailCodeRequestView(APIView):
    """发送 6 位邮箱验证码。"""

    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "email_code"

    def post(self, request):
        email = normalize_email(request.data.get("email"))
        try:
            validate_email(email)
        except DjangoValidationError:
            return Response({"detail": "邮箱格式不正确"}, status=status.HTTP_400_BAD_REQUEST)

        recent = latest_code(email)
        if recent:
            elapsed = (timezone.now() - recent.created_at).total_seconds()
            if elapsed < CODE_RESEND_COOLDOWN.total_seconds():
                wait = max(int(CODE_RESEND_COOLDOWN.total_seconds() - elapsed), 1)
                return Response(
                    {"detail": f"请求过于频繁，请 {wait} 秒后重试", "cooldown": wait},
                    status=status.HTTP_429_TOO_MANY_REQUESTS,
                )

        try:
            issue_email_code(email, ip=request.META.get("REMOTE_ADDR"))
        except EmailDeliveryError:
            return Response(
                {"detail": "验证码发送失败，请稍后重试"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        return Response({"detail": "验证码已发送", "cooldown": 60})


class EmailCodeVerifyView(APIView):
    """校验验证码并签发 JWT；首次登录即注册，无需密码。"""

    permission_classes = [AllowAny]
    throttle_classes = [ScopedRateThrottle]
    throttle_scope = "email_code_verify"

    def post(self, request):
        email = normalize_email(request.data.get("email"))
        code = str(request.data.get("code", "")).strip()
        if not email or not code:
            return Response({"detail": "请填写邮箱和验证码"}, status=status.HTTP_400_BAD_REQUEST)

        record = latest_code(email)
        if not record or record.consumed_at:
            return Response({"detail": "验证码不正确"}, status=status.HTTP_400_BAD_REQUEST)
        if record.is_expired():
            return Response({"detail": "验证码已过期，请重新获取"}, status=status.HTTP_400_BAD_REQUEST)
        if record.attempts >= MAX_CODE_ATTEMPTS:
            return Response(
                {"detail": "尝试次数过多，请重新获取验证码"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if record.code_hash != EmailCode.make_hash(email, code):
            record.attempts += 1
            record.save(update_fields=["attempts"])
            return Response({"detail": "验证码不正确"}, status=status.HTTP_400_BAD_REQUEST)

        record.consumed_at = timezone.now()
        record.save(update_fields=["consumed_at"])

        user = get_or_create_user(email)
        return Response(login_payload(user))


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(user_payload(request.user))

    def patch(self, request):
        nickname = (request.data.get("nickname") or "").strip()
        if not nickname:
            return Response({"detail": "昵称不能为空"}, status=status.HTTP_400_BAD_REQUEST)
        if len(nickname) > 32:
            return Response({"detail": "昵称最多 32 个字符"}, status=status.HTTP_400_BAD_REQUEST)

        profile, _ = Profile.objects.get_or_create(user=request.user)
        profile.nickname = nickname
        profile.save(update_fields=["nickname", "updated_at"])
        return Response(user_payload(request.user))


class OAuthStartView(APIView):
    """返回第三方授权页地址，由前端跳转（不依赖后端 302 + CORS）。"""

    permission_classes = [AllowAny]

    def get(self, request, provider):
        if provider not in oauth.PROVIDERS:
            return Response({"detail": "不支持的登录方式"}, status=status.HTTP_404_NOT_FOUND)
        if not oauth.is_configured(provider):
            return Response(
                {"detail": f"{provider} 登录尚未配置"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        state = dumps(
            {"p": provider, "n": _safe_next(request.query_params.get("next"))},
            salt=STATE_SALT,
        )
        return Response({"url": oauth.authorize_url(provider, state)})


class OAuthCallbackView(APIView):
    """第三方回调：换邮箱 → 建号 → 带一次性 ticket 跳回前端。"""

    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, provider):
        if provider not in oauth.PROVIDERS:
            return _redirect("/", {"login_error": "unsupported"})

        try:
            state = loads(
                request.query_params.get("state", ""),
                salt=STATE_SALT,
                max_age=600,
            )
        except (BadSignature, SignatureExpired):
            return _redirect("/", {"login_error": "state"})

        next_path = _safe_next(state.get("n"))
        if state.get("p") != provider:
            return _redirect(next_path, {"login_error": "state"})

        error = request.query_params.get("error")
        code = request.query_params.get("code", "")
        if error or not code:
            return _redirect(next_path, {"login_error": error or "cancelled"})

        try:
            uid, email, nickname, avatar = oauth.exchange_for_identity(provider, code)
        except oauth.OAuthError as exc:
            return _redirect(next_path, {"login_error": str(exc)[:120]})

        user = get_or_create_user(email, nickname=nickname, avatar_url=avatar)
        account, _ = SocialAccount.objects.get_or_create(
            provider=provider, uid=uid, defaults={"user": user}
        )
        user = account.user

        ticket = secrets.token_urlsafe(24)
        LoginTicket.objects.create(
            ticket=ticket,
            user=user,
            expires_at=timezone.now() + TICKET_TTL,
        )
        return _redirect(next_path, {"login_ticket": ticket})


class OAuthExchangeView(APIView):
    """前端用 ticket 换 JWT，ticket 2 分钟内有效且只能用一次。"""

    permission_classes = [AllowAny]

    def post(self, request):
        ticket = str(request.data.get("ticket", "")).strip()
        if not ticket:
            return Response({"detail": "缺少票据"}, status=status.HTTP_400_BAD_REQUEST)

        record = LoginTicket.objects.filter(ticket=ticket).first()
        if not record or record.consumed_at or record.is_expired():
            return Response(
                {"detail": "票据无效或已过期，请重新登录"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        record.consumed_at = timezone.now()
        record.save(update_fields=["consumed_at"])
        return Response(login_payload(record.user))
