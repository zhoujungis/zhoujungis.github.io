"""Shared authentication helper for admin scripts.

Reads credentials from environment variables or a ``tools/.env`` file.
Usage::

    from _auth import API_URL, get_token

    token = get_token()
    # use token with urllib.request ...

Set these env vars (or create a ``tools/.env``)::

    BLOG_USERNAME=your_username
    BLOG_PASSWORD=your_password
    BLOG_API_URL=https://zhoujun123.pythonanywhere.com/api   # optional
"""

import os
import json
import urllib.request
import urllib.error
from pathlib import Path

# ── Load tools/.env if present ────────────────────────────────────────
_env_path = Path(__file__).parent / ".env"
if _env_path.exists():
    with open(_env_path, "r", encoding="utf-8") as _f:
        for _line in _f:
            _line = _line.strip()
            if not _line or _line.startswith("#") or "=" not in _line:
                continue
            _key, _, _val = _line.partition("=")
            _key, _val = _key.strip(), _val.strip().strip('"').strip("'")
            if _key and _key not in os.environ:
                os.environ[_key] = _val

# ── Configuration ─────────────────────────────────────────────────────
API_URL = os.environ.get("BLOG_API_URL", "https://zhoujun123.pythonanywhere.com/api").rstrip("/")
USERNAME = os.environ.get("BLOG_USERNAME")
PASSWORD = os.environ.get("BLOG_PASSWORD")

# ── Helpers ───────────────────────────────────────────────────────────

def get_token() -> str:
    """Authenticate and return a JWT access token.

    Raises RuntimeError if BLOG_USERNAME/BLOG_PASSWORD are not set.
    """
    if not USERNAME or not PASSWORD:
        raise RuntimeError(
            "Missing credentials. Set BLOG_USERNAME and BLOG_PASSWORD as:\n"
            "  - environment variables, or\n"
            "  - in a tools/.env file:\n"
            "      BLOG_USERNAME=your_username\n"
            "      BLOG_PASSWORD=your_password\n"
            "      BLOG_API_URL=https://zhoujun123.pythonanywhere.com/api  # optional"
        )
    req = urllib.request.Request(
        f"{API_URL}/token/",
        data=json.dumps({"username": USERNAME, "password": PASSWORD}).encode("utf-8"),
        headers={"Content-Type": "application/json"},
    )
    try:
        return json.loads(urllib.request.urlopen(req).read())["access"]
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Login failed ({exc.code}): {body}") from exc
    except urllib.error.URLError as exc:
        raise RuntimeError(f"Connection failed: {exc}") from exc


def api_request(method: str, path: str, data=None):
    """Single API call with automatic authentication.

    Returns parsed JSON, ``True`` for successful DELETE, or ``None`` on error.
    """
    url = f"{API_URL}{path}"
    token = get_token()
    req = urllib.request.Request(url, method=method)
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {token}")
    if data is not None:
        req.data = json.dumps(data).encode("utf-8")

    try:
        resp = urllib.request.urlopen(req)
        if method == "DELETE":
            return True
        return json.loads(resp.read())
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        print(f"{method} {path} -> {exc.code}: {body[:300]}", flush=True)
        return None
    except urllib.error.URLError as exc:
        print(f"{method} {path} -> Connection error: {exc}", flush=True)
        return None
