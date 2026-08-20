"""Add friend links to the backend via the admin API (idempotent)."""

import sys
from _auth import API_URL, api_request

LINKS = [
    {
        "name": "Happy Games",
        "url": "https://happy-games.pages.dev/",
        "logo": "",
        "description": "休闲小游戏合集",
        "is_active": True,
        "sort_order": 3,
    },
    {
        "name": "Halo Music",
        "url": "https://halo-music.pages.dev/",
        "logo": "",
        "description": "在线音乐欣赏",
        "is_active": True,
        "sort_order": 4,
    },
    {
        "name": "Routewise",
        "url": "https://routewise-ai.pages.dev/",
        "logo": "",
        "description": "AI 旅行路线规划",
        "is_active": True,
        "sort_order": 5,
    },
    {
        "name": "Block World 3D",
        "url": "https://block-world-3d.pages.dev/",
        "logo": "",
        "description": "3D 方块世界沙盒",
        "is_active": True,
        "sort_order": 6,
    },
]


def main() -> int:
    existing = api_request("GET", "/admin/friends/") or []
    existing = existing.get("results", existing) if isinstance(existing, dict) else existing
    existing_urls = {f.get("url") for f in existing}

    ok, added = True, 0
    for link in LINKS:
        if link["url"] in existing_urls:
            print(f"skip (exists): {link['name']} {link['url']}", flush=True)
            continue
        result = api_request("POST", "/admin/friends/", link)
        if result is None:
            ok = False
            print(f"FAILED: {link['name']} {link['url']}", flush=True)
        else:
            added += 1
            print(f"added [{result.get('id')}]: {link['name']} {link['url']}", flush=True)

    print(f"done: {added} added", flush=True)
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
