#!/usr/bin/env python3
"""CLI tool for managing blog articles.

Commands:
  new     - Create a new markdown article template with YAML frontmatter
  login   - Authenticate and store JWT token locally
  publish - Publish a markdown file to the server
  list    - List articles from the server
  sync    - Batch sync a directory of markdown files
"""

import argparse
import getpass
import os
import re
import sys
import textwrap
from pathlib import Path

import frontmatter
import requests
import yaml

# ── Token / file paths ───────────────────────────────────────────────────────

TOKEN_FILE = Path.home() / ".blog_token"
REFRESH_TOKEN_FILE = Path.home() / ".blog_token_refresh"
ARTICLES_DIR = Path.cwd() / "articles"


# ── Helpers ──────────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    """Generate a URL-friendly slug from arbitrary text.

    Strips non-ASCII characters and collapses whitespace/dashes.
    """
    text = text.lower().strip()
    # Keep only ASCII letters, digits, spaces and hyphens
    text = re.sub(r"[^a-z0-9\s-]", "", text, flags=re.ASCII)
    text = re.sub(r"[-\s]+", "-", text)
    return text.strip("-")


def _read_token(path: Path) -> str | None:
    return path.read_text(encoding="utf-8").strip() if path.exists() else None


def _write_token(path: Path, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(value, encoding="utf-8")


def _remove_token(path: Path) -> None:
    if path.exists():
        path.unlink()


def get_token() -> str | None:
    return _read_token(TOKEN_FILE)


def get_refresh_token() -> str | None:
    return _read_token(REFRESH_TOKEN_FILE)


def save_token(access: str, refresh: str | None = None) -> None:
    _write_token(TOKEN_FILE, access)
    if refresh:
        _write_token(REFRESH_TOKEN_FILE, refresh)


def clear_tokens() -> None:
    _remove_token(TOKEN_FILE)
    _remove_token(REFRESH_TOKEN_FILE)


def _auth_headers() -> dict:
    token = get_token()
    return {"Authorization": f"Bearer {token}"} if token else {}


def _try_refresh(api_url: str) -> bool:
    """Attempt to refresh the access token using the stored refresh token."""
    refresh_token = get_refresh_token()
    if not refresh_token:
        return False
    try:
        resp = requests.post(
            f"{api_url.rstrip('/')}/token/refresh/",
            json={"refresh": refresh_token},
            timeout=15,
        )
        if resp.status_code == 200:
            save_token(resp.json()["access"])
            return True
    except requests.RequestException:
        pass
    clear_tokens()
    return False


def authenticated_request(method: str, url: str, api_url: str, **kwargs) -> requests.Response:
    """HTTP request with Bearer auth and automatic token refresh on 401."""
    headers = kwargs.pop("headers", {})
    headers.update(_auth_headers())
    response = requests.request(method, url, headers=headers, **kwargs)
    if response.status_code == 401 and _try_refresh(api_url):
        headers.update(_auth_headers())
        response = requests.request(method, url, headers=headers, **kwargs)
    return response


def fetch_all(url: str, api_url: str | None = None, params: dict | None = None) -> list[dict]:
    """Walk paginated results and return all items.

    ``params`` are included in the first request only (paginated
    ``next`` URLs already encode any filters applied by the server).
    """
    items: list[dict] = []
    next_url: str | None = url
    first = True
    while next_url:
        if api_url:
            resp = authenticated_request(
                "GET", next_url, api_url,
                params=params if first else None,
                timeout=30,
            )
        else:
            resp = requests.get(next_url, params=params if first else None, timeout=30)
        first = False
        if resp.status_code != 200:
            break
        data = resp.json()
        if isinstance(data, dict) and "results" in data:
            items.extend(data["results"])
            next_url = data.get("next")
        elif isinstance(data, list):
            items.extend(data)
            break
        else:
            items.append(data)
            break
    return items


def _check_authenticated(api_url: str) -> None:
    if not get_token():
        print("Error: Not authenticated. Please run 'login' first.", file=sys.stderr)
        sys.exit(1)


def _parse_md(path: Path) -> tuple[dict, str]:
    """Load a markdown file and return (metadata: dict, body: str)."""
    with open(path, "r", encoding="utf-8") as fh:
        post = frontmatter.load(fh)
    return dict(post.metadata), post.content


def _build_payload(meta: dict, body: str, fallback_title: str) -> dict:
    """Build the JSON body for an article create/update request."""
    title = meta.get("title", fallback_title)
    slug = meta.get("slug", slugify(title))
    payload = {
        "title": title,
        "slug": slug,
        "content": body,
        "status": meta.get("status", "draft"),
        "is_top": meta.get("is_top", False),
        "cover_image": meta.get("cover_image", ""),
    }
    if meta.get("category_id") is not None:
        payload["category_id"] = meta["category_id"]
    if meta.get("tags_ids"):
        payload["tags_ids"] = meta["tags_ids"]
    return payload


# ── Commands ─────────────────────────────────────────────────────────────────

def cmd_new(args: argparse.Namespace) -> None:
    """Create a new markdown article template and save locally."""
    from datetime import datetime

    title = args.title
    slug = slugify(title)
    if not slug:
        slug = f"article-{datetime.now():%Y%m%d%H%M%S}"
    ARTICLES_DIR.mkdir(parents=True, exist_ok=True)
    filepath = ARTICLES_DIR / f"{slug}.md"

    if filepath.exists():
        print(f"Error: File already exists: {filepath}", file=sys.stderr)
        sys.exit(1)

    meta = {
        "title": title,
        "slug": slug,
        "category_id": None,
        "tags": [],
        "status": "draft",
        "is_top": False,
        "cover_image": "",
    }

    frontmatter_yaml = yaml.dump(
        meta, allow_unicode=True, default_flow_style=False, sort_keys=False
    ).strip()
    content = f"---\n{frontmatter_yaml}\n---\n\nStart writing here...\n"

    filepath.write_text(content, encoding="utf-8")
    print(f"Created: {filepath}")


def cmd_login(args: argparse.Namespace) -> None:
    """Authenticate against the JWT endpoint and store tokens."""
    api_url = args.api_url.rstrip("/")
    username = input("Username: ")
    password = getpass.getpass("Password: ")

    try:
        resp = requests.post(
            f"{api_url}/token/",
            json={"username": username, "password": password},
            timeout=15,
        )
    except requests.ConnectionError as exc:
        print(f"Connection failed: {exc}", file=sys.stderr)
        sys.exit(1)
    except requests.Timeout:
        print("Request timed out.", file=sys.stderr)
        sys.exit(1)

    if resp.status_code == 200:
        data = resp.json()
        save_token(data["access"], data.get("refresh"))
        print("Login successful. Token saved.")
    else:
        detail = resp.json() if resp.content else resp.text
        print(f"Login failed: {detail}", file=sys.stderr)
        sys.exit(1)


def cmd_publish(args: argparse.Namespace) -> None:
    """Publish (create) a single markdown file on the server."""
    api_url = args.api_url.rstrip("/")
    filepath = Path(args.file)

    if not filepath.exists():
        print(f"Error: File not found: {filepath}", file=sys.stderr)
        sys.exit(1)

    _check_authenticated(api_url)

    meta, body = _parse_md(filepath)
    payload = _build_payload(meta, body, filepath.stem)

    try:
        resp = authenticated_request(
            "POST", f"{api_url}/admin/articles/", api_url, json=payload, timeout=30
        )
    except requests.RequestException as exc:
        print(f"Request failed: {exc}", file=sys.stderr)
        sys.exit(1)

    if resp.status_code in (200, 201):
        article = resp.json()
        slug = article.get("slug", "")
        base_url = re.sub(r"/api/?$", "", api_url)
        print(f"Published: {article['title']} (ID: {article['id']})")
        print(f"URL: {base_url}/articles/{slug}/")
    else:
        detail = resp.json() if resp.content else resp.text
        print(f"Publish failed: {detail}", file=sys.stderr)
        sys.exit(1)


def cmd_list(args: argparse.Namespace) -> None:
    """List articles from the server.

    Uses the admin endpoint (authenticated) when a token is available,
    otherwise falls back to the public read-only endpoint.
    """
    api_url = args.api_url.rstrip("/")
    token = get_token()
    params = {}
    if args.status:
        params["status"] = args.status

    # Determine endpoint and fetch strategy
    if token:
        url = f"{api_url}/admin/articles/"
        articles = fetch_all(url, api_url=api_url)
        # Admin endpoint does not support server-side status filter
        if args.status and articles:
            articles = [a for a in articles if a.get("status") == args.status]
    else:
        url = f"{api_url}/articles/"
        articles = fetch_all(url, params=params)  # server-side status filter

    if not articles:
        print("No articles found.")
        return

    header = f"{'Title':<40} {'Status':<12} {'Date':<20} {'Views':<8}"
    print(header)
    print("-" * len(header))
    for a in articles:
        display_title = a.get("title", "")
        if len(display_title) > 38:
            display_title = display_title[:37] + ".."
        status = a.get("status", "")
        created = (a.get("created_at") or "")[:10]
        views = a.get("views_count", 0)
        print(f"{display_title:<40} {status:<12} {created:<20} {views:<8}")


def cmd_sync(args: argparse.Namespace) -> None:
    """Batch-sync a directory of markdown files with the server.

    Creates new articles and updates existing ones identified by slug.
    """
    api_url = args.api_url.rstrip("/")
    directory = Path(args.directory)

    if not directory.is_dir():
        print(f"Error: Directory not found: {directory}", file=sys.stderr)
        sys.exit(1)

    _check_authenticated(api_url)

    # Fetch all existing articles
    admin_url = f"{api_url}/admin/articles/"
    existing_list = fetch_all(admin_url, api_url=api_url)
    existing_by_slug: dict[str, dict] = {a["slug"]: a for a in existing_list}

    # Collect markdown files
    md_files = sorted(directory.glob("*.md"))
    if not md_files:
        print("No .md files found in the directory.")
        return

    new_count = 0
    updated_count = 0
    skipped_count = 0

    for filepath in md_files:
        meta, body = _parse_md(filepath)
        slug = meta.get("slug", slugify(meta.get("title", filepath.stem)))
        payload = _build_payload(meta, body, filepath.stem)

        if slug in existing_by_slug:
            # Update
            article_id = existing_by_slug[slug]["id"]
            try:
                resp = authenticated_request(
                    "PUT", f"{admin_url}{article_id}/", api_url, json=payload, timeout=30
                )
            except requests.RequestException as exc:
                print(f"  Network error updating {slug}: {exc}", file=sys.stderr)
                skipped_count += 1
                continue

            if resp.status_code in (200, 201):
                updated_count += 1
                print(f"  Updated: {slug}")
            else:
                skipped_count += 1
                detail = resp.json() if resp.content else resp.text
                print(f"  Error updating {slug}: {detail}", file=sys.stderr)
        else:
            # Create
            try:
                resp = authenticated_request(
                    "POST", admin_url, api_url, json=payload, timeout=30
                )
            except requests.RequestException as exc:
                print(f"  Network error creating {slug}: {exc}", file=sys.stderr)
                skipped_count += 1
                continue

            if resp.status_code in (200, 201):
                new_count += 1
                print(f"  Created: {slug}")
            else:
                skipped_count += 1
                detail = resp.json() if resp.content else resp.text
                print(f"  Error creating {slug}: {detail}", file=sys.stderr)

    total = len(md_files)
    processed = new_count + updated_count
    print(
        f"\nSummary: {new_count} new, {updated_count} updated, "
        f"{total - processed} skipped (out of {total} total)"
    )


# ── CLI entry point ──────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        prog="article_cli",
        description="Blog article management CLI tool",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=textwrap.dedent("""\
            Examples:
              python article_cli.py new "My New Article"
              python article_cli.py login --api-url https://example.com/api
              python article_cli.py publish article.md --api-url https://example.com/api
              python article_cli.py list --api-url https://example.com/api
              python article_cli.py sync ./articles --api-url https://example.com/api
        """),
    )

    sub = parser.add_subparsers(dest="command", title="commands", metavar="")

    # -- new --
    p = sub.add_parser("new", help="Create a new markdown article template")
    p.add_argument("title", help="Article title")
    p.set_defaults(func=cmd_new)

    # -- login --
    p = sub.add_parser("login", help="Authenticate and store JWT token")
    p.add_argument("--api-url", required=True,
                   help="API base URL (e.g., https://example.com/api)")
    p.set_defaults(func=cmd_login)

    # -- publish --
    p = sub.add_parser("publish", help="Publish a markdown file to the server")
    p.add_argument("file", help="Path to markdown file")
    p.add_argument("--api-url", required=True, help="API base URL")
    p.set_defaults(func=cmd_publish)

    # -- list --
    p = sub.add_parser("list", help="List articles on the server")
    p.add_argument("--api-url", required=True, help="API base URL")
    p.add_argument("--status", choices=["draft", "published", "archived"],
                   help="Filter by article status")
    p.set_defaults(func=cmd_list)

    # -- sync --
    p = sub.add_parser("sync", help="Batch sync a directory of markdown files to the server")
    p.add_argument("directory", help="Directory containing .md files")
    p.add_argument("--api-url", required=True, help="API base URL")
    p.set_defaults(func=cmd_sync)

    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        sys.exit(1)

    args.func(args)


if __name__ == "__main__":
    main()
