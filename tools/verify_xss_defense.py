# -*- coding: utf-8 -*-
"""Verify Article.save()'s render+sanitize pipeline against a battery of XSS payloads.

Run: cd backend && venv/Scripts/python.exe ../tools/verify_xss_defense.py
"""
import os
import re
import sys
from pathlib import Path

# Allow running from either repo root or backend/: find backend/ near this file.
_BACKEND = Path(__file__).resolve().parent.parent / 'backend'
if _BACKEND.exists() and str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'blog_api.settings')
os.environ.setdefault('DJANGO_SECRET_KEY', 'django-insecure-verify-only')

import django

django.setup()

import bleach
import markdown
from articles.models import make_excerpt

MD_EXTENSIONS = ["fenced_code", "codehilite", "tables", "extra", "toc"]


def render_and_sanitize(content: str) -> str:
    md = markdown.Markdown(extensions=MD_EXTENSIONS)
    raw = md.convert(content)
    clean = bleach.clean(
        raw,
        tags=bleach.sanitizer.ALLOWED_TAGS
        | {
            "h1", "h2", "h3", "h4", "h5", "h6",
            "img", "pre", "code", "span", "div",
            "table", "thead", "tbody", "tr", "th", "td",
            "hr", "br", "sup", "sub",
            "figure", "figcaption",
        },
        attributes={
            **bleach.sanitizer.ALLOWED_ATTRIBUTES,
            "img": list(set(["src", "alt", "title", "loading", "decoding"]) | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("img", []))),
            "a": list(set(["href", "title", "rel", "target"]) | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("a", []))),
            "code": list(set(["class"]) | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("code", []))),
            "pre": list(set(["class"]) | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("pre", []))),
            "span": list(set(["class"]) | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("span", []))),
            "div": list(set(["class"]) | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("div", []))),
            "th": list(set(["align"]) | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("th", []))),
            "td": list(set(["align"]) | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("td", []))),
        },
        protocols=["http", "https", "mailto"],
        strip=True,
    )
    # external link hardening (mirrors Article.save)
    clean = re.sub(
        r'<a ([^>]*?)href="(https?://[^"]+)"',
        r'<a \1href="\2" rel="noopener noreferrer" target="_blank"',
        clean,
    )
    return clean


def danger_score(h: str) -> int:
    """Count executable constructs that survived as *live tag markup*.

    bleach HTML-escapes code-block content (&lt;script&gt;), which is inert
    display text. Only constructs inside actual "<...>" tag markup can run
    in a browser, so we score only the concatenation of tag fragments and
    ignore all other text.
    """
    tags_markup = "".join(re.findall(r'<[^>]*>', h))
    s = 0
    for pat in (r'<script', r'<svg', r'<iframe', r'<object', r'<embed', r'on\w+\s*=', r'javascript:', r'data:text/html'):
        if re.search(pat, tags_markup, re.I):
            s += 1
    return s


PAYLOADS = {
    "script tag":            '<script>alert(1)</script>',
    "img onerror":           '<img src=x onerror="alert(1)">',
    "javascript href":       '[x](javascript:alert(1))',
    "data protocol":         '<a href="data:text/html,<script>alert(1)</script>">x</a>',
    "svg onload":            '<svg onload="alert(1)"></svg>',
    "iframe":                '<iframe src="https://evil.example"></iframe>',
    "style/script in block": 'hello <style>body{display:none}</style><script>alert(2)</script>',
    "event attr on div":     '<div onclick="alert(1)">text</div>',
    "table colspan (keep)":  '<table><tr><td colspan="2">ok</td></tr></table>',
    "code highlight class":  '```python\nprint("hi")\n```',
}

EXCERPTS = [
    ("svg in excerpt", "text <svg onload=alert(1)></svg> more"),
    ("autolink", "see <https://e.com/p> here"),
    ("code block", "before <pre>a b c</pre> after"),
]


def main() -> None:
    print("=== Sanitized output + danger score ===")
    all_ok = True
    for name, payload in PAYLOADS.items():
        out = render_and_sanitize(payload)
        d = danger_score(out)
        if d:
            all_ok = False
        print(f"[{'OK ' if d == 0 else '!! LEAK'}] {name:30s} danger={d}")
        if d:
            print(f"        IN : {payload!r}")
            print(f"        OUT: {out!r}")

    print("\n=== Excerpt extraction ===")
    ex_ok = True
    for name, payload in EXCERPTS:
        out = render_and_sanitize(payload)
        ex = make_excerpt(out, fallback_text=payload, word_limit=50)
        d = danger_score(ex)
        if d:
            ex_ok = False
        print(f"[{'OK ' if d == 0 else '!! LEAK'}] {name:22s} danger={d} excerpt={ex!r}")

    article_md = open(r'D:\zhoujungis.github.io\article\django-bleach-xss-defense.md', encoding='utf-8').read()
    article_md = re.sub(r'^---\n.*?\n---\n', '', article_md, flags=re.S)
    full = render_and_sanitize(article_md)
    d = danger_score(full)
    print(f"\n=== Full article ({len(full)} chars html) danger={d} ===")
    if d:
        for m in re.finditer(r'(<script|on\w+\s*=|javascript:|data:text/html|<svg|<iframe)', full, re.I):
            print("  leak at", full[max(0, m.start() - 80):m.end() + 80])
            break

    print("ALL_PASS" if (all_ok and ex_ok and d == 0) else "FAILURES_PRESENT")


if __name__ == "__main__":
    main()