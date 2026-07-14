"""
Fix IoT article: wrap each inline SVG in a <div> so Python-Markdown treats it
as a block-level HTML element (otherwise newlines inside <svg> get converted
to <br /> and the SVG is broken into <p>...</p> fragments).

Re-renders markdown by re-saving the article through the API.
"""

import json
import re
import sys
import urllib.request
import urllib.error

from _auth import API_URL, get_token

API = API_URL
SLUG = "iot-future-next-decade"

# Match each <svg ...>...</svg> block (non-greedy). The DOTALL flag makes
# "." match newlines so multi-line SVGs are captured.
SVG_PATTERN = re.compile(r"<svg\b.*?</svg>", re.DOTALL)


def api(method: str, path: str, data=None):
    url = f"{API}{path}"
    req = urllib.request.Request(url, method=method)
    req.add_header("Content-Type", "application/json")
    req.add_header("Authorization", f"Bearer {get_token()}")
    if data is not None:
        req.data = json.dumps(data).encode("utf-8")
    try:
        resp = urllib.request.urlopen(req)
        body = resp.read()
        if resp.status == 204 or not body:
            return None
        return json.loads(body)
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        print(f"  !! {method} {path} -> {exc.code}: {body[:300]}")
        return None


def fix_svg_blocks(content: str) -> str:
    """Wrap each <svg>...</svg> in <div>...</div> so markdown keeps it as a
    block-level HTML element instead of breaking it across <p>/<br />."""
    def wrap(match):
        svg = match.group(0)
        return f"<div>\n\n{svg}\n\n</div>"
    return SVG_PATTERN.sub(wrap, content)


def main():
    print(f"=== Fixing SVG wrapping in: {SLUG} ===\n")

    # 1. Fetch current article
    article = api("GET", f"/articles/{SLUG}/")
    if not article:
        print(f"!! could not fetch {SLUG}")
        sys.exit(1)
    article_id = article["id"]
    original_content = article["content"]
    svg_count_before = len(SVG_PATTERN.findall(original_content))
    print(f"[fetched] id={article_id}, content={len(original_content):,} chars, SVG blocks={svg_count_before}")

    # 2. Apply fix
    fixed_content = fix_svg_blocks(original_content)
    div_count = fixed_content.count("<div>\n\n<svg")
    print(f"[fixed] wrapped {div_count} SVG block(s) in <div>")

    if div_count == 0:
        print("Nothing to fix — aborting.")
        return

    # 3. Save back via PUT — re-renders markdown on the server side
    payload = {
        "title": article["title"],
        "content": fixed_content,
        "status": article["status"],
        "cover_image": article.get("cover_image", ""),
    }
    if article.get("category"):
        payload["category_id"] = article["category"]["id"]
    payload["tags_ids"] = [t["id"] for t in article.get("tags", [])]

    result = api("PUT", f"/admin/articles/{article_id}/", payload)
    if not result:
        print("!! update failed")
        sys.exit(1)
    print(f"[updated] id={result['id']}, slug={result['slug']}")

    # 4. Verify by fetching fresh HTML
    fresh = api("GET", f"/articles/{SLUG}/")
    if fresh:
        html = fresh["html_content"]
        # Count properly nested SVGs in the rendered HTML
        # Should have <div><svg>...</svg></div> with no <br /> inside
        nested = re.findall(r"<div>\s*<svg.*?</svg>\s*</div>", html, re.DOTALL)
        br_in_svg = re.findall(r"<svg[^>]*>.*?<br\s*/?>", html, re.DOTALL)
        print(f"\n[verify] {len(nested)} SVG block(s) wrapped in <div> in rendered HTML")
        print(f"[verify] {len(br_in_svg)} broken <br /> inside SVG (should be 0)")


if __name__ == "__main__":
    main()
