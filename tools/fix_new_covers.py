"""One-off: replace abstract covers on the 3 new backend articles with concrete ones.

Usage:
    python tools/fix_new_covers.py
"""
import json
import urllib.request
import urllib.error

from _auth import API_URL, get_token

Q = "?w=1200&q=80&auto=format&fit=crop"
BASE = "https://images.unsplash.com/"

# slug -> (unsplash photo id, note)
COVERS = {
    "drf-pagination-cache-throttle": (
        "photo-1551434678-e076c223a692",
        "DRF: two devs pairing at screens (was duplicate of deploy article)",
    ),
    "django-jwt-dual-token-auth": (
        "photo-1550751827-4bd374c3f58b",
        "JWT: padlock on circuit board",
    ),
    "django-comment-system-guide": (
        "photo-1543269865-cbf427effbad",
        "comments: people discussing around a laptop",
    ),
}

token = get_token()


def api(method, path, data=None):
    req = urllib.request.Request(f"{API_URL}{path}", method=method)
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {token}")
    if data is not None:
        req.data = json.dumps(data).encode("utf-8")
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            body = resp.read()
            return json.loads(body) if body else None
    except urllib.error.HTTPError as exc:
        print(f"ERR {method} {path}: {exc.code} {exc.read().decode()[:200]}")
        return None


for slug, (photo, note) in COVERS.items():
    art = api("GET", f"/articles/{slug}/")
    if not art:
        continue
    url = f"{BASE}{photo}{Q}"
    res = api("PATCH", f"/admin/articles/{art['id']}/", {"cover_image": url})
    if res:
        print(f"OK {slug} (id={art['id']}): {note}\n   -> {url}")
