"""Google / GitHub OAuth 适配。

只做「授权码 → 已验证邮箱」这一段；拿到邮箱后统一走 accounts.services 建号，
这样三种登录方式落在同一个 User 上。
"""

import os
from urllib.parse import urlencode

import requests

PROVIDERS = {
    "github": {
        "authorize_url": "https://github.com/login/oauth/authorize",
        "token_url": "https://github.com/login/oauth/access_token",
        "scope": "read:user user:email",
    },
    "google": {
        "authorize_url": "https://accounts.google.com/o/oauth2/v2/auth",
        "token_url": "https://oauth2.googleapis.com/token",
        "scope": "openid email profile",
    },
}


class OAuthError(Exception):
    """授权码换取失败 / 邮箱不可信。"""


def is_configured(provider):
    return bool(_client_id(provider) and _client_secret(provider))


def _client_id(provider):
    return os.environ.get(f"{provider.upper()}_CLIENT_ID", "")


def _client_secret(provider):
    return os.environ.get(f"{provider.upper()}_CLIENT_SECRET", "")


def redirect_uri(provider):
    base = os.environ.get("OAUTH_REDIRECT_BASE", "https://zhoujun123.pythonanywhere.com")
    return f"{base.rstrip('/')}/api/auth/oauth/{provider}/callback/"


def authorize_url(provider, state):
    config = PROVIDERS[provider]
    params = {
        "client_id": _client_id(provider),
        "redirect_uri": redirect_uri(provider),
        "scope": config["scope"],
        "state": state,
        "response_type": "code",
    }
    if provider == "google":
        params["access_type"] = "online"
        params["prompt"] = "select_account"
    return f"{config['authorize_url']}?{urlencode(params)}"


def _exchange_code(provider, code):
    config = PROVIDERS[provider]
    data = {
        "client_id": _client_id(provider),
        "client_secret": _client_secret(provider),
        "code": code,
        "redirect_uri": redirect_uri(provider),
        "grant_type": "authorization_code",
    }
    resp = requests.post(
        config["token_url"],
        data=data,
        headers={"Accept": "application/json"},
        timeout=10,
    )
    if resp.status_code >= 400:
        raise OAuthError(f"token exchange failed: {resp.status_code}")
    payload = resp.json()
    token = payload.get("access_token")
    if not token:
        raise OAuthError(payload.get("error_description") or "no access_token")
    return token


def fetch_identity(provider, access_token):
    """返回 (uid, email, nickname, avatar_url)；邮箱必须是平台已验证的。"""
    if provider == "github":
        return _github_identity(access_token)
    if provider == "google":
        return _google_identity(access_token)
    raise OAuthError("unknown provider")


def _github_identity(access_token):
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/vnd.github+json",
    }
    user_resp = requests.get("https://api.github.com/user", headers=headers, timeout=10)
    if user_resp.status_code >= 400:
        raise OAuthError("github user fetch failed")
    user = user_resp.json()

    email = user.get("email") or ""
    emails_resp = requests.get(
        "https://api.github.com/user/emails", headers=headers, timeout=10
    )
    if emails_resp.status_code < 400:
        for item in emails_resp.json():
            if item.get("primary") and item.get("verified"):
                email = item["email"]
                break
        else:
            verified = [i["email"] for i in emails_resp.json() if i.get("verified")]
            if verified:
                email = verified[0]

    if not email:
        raise OAuthError("github email is not verified — 请在 GitHub 设置里公开已验证邮箱")

    return (
        str(user.get("id", "")),
        email.lower(),
        user.get("name") or user.get("login") or "",
        user.get("avatar_url") or "",
    )


def _google_identity(access_token):
    resp = requests.get(
        "https://openidconnect.googleapis.com/v1/userinfo",
        headers={"Authorization": f"Bearer {access_token}"},
        timeout=10,
    )
    if resp.status_code >= 400:
        raise OAuthError("google userinfo fetch failed")
    info = resp.json()
    if not info.get("email_verified") or not info.get("email"):
        raise OAuthError("google email is not verified")
    return (
        str(info.get("sub", "")),
        info["email"].lower(),
        info.get("name") or "",
        info.get("picture") or "",
    )


def exchange_for_identity(provider, code):
    token = _exchange_code(provider, code)
    return fetch_identity(provider, token)
