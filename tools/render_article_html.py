# -*- coding: utf-8 -*-
"""Render an article's Markdown into the HTML body used by frontend/src/data/en/articles.js.

The English editions are authored separately, but their body should be structurally
identical to the Chinese one (same headings, same code blocks, same tables). This
script converts the Chinese source into the exact HTML shape the EN module stores,
so the English edition can be a faithful translation rather than a re-typesetting.

Usage:
    backend/venv/Scripts/python.exe tools/render_article_html.py article/nanoqa-versioned-quality-loop.md out.html
"""

import sys
from pathlib import Path

import bleach
import markdown

MARKDOWN_EXTENSIONS = ["fenced_code", "codehilite", "tables", "extra", "toc"]

ALLOWED_TAGS = bleach.sanitizer.ALLOWED_TAGS | {
    "h1", "h2", "h3", "h4", "h5", "h6",
    "img", "pre", "code", "span", "div",
    "table", "thead", "tbody", "tr", "th", "td",
    "hr", "br", "sup", "sub", "figure", "figcaption",
}

ALLOWED_ATTRS = {
    **bleach.sanitizer.ALLOWED_ATTRIBUTES,
    "div": ["class"],
    "span": ["class"],
    "code": ["class"],
    "pre": ["class"],
    "a": ["href", "title", "rel", "target"],
}


def render(md: str) -> str:
    html = markdown.Markdown(extensions=MARKDOWN_EXTENSIONS).convert(md)
    html = bleach.clean(
        html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRS,
        protocols=["http", "https", "mailto"],
        strip=True,
    )
    return html


def main():
    src = Path(sys.argv[1])
    dest = Path(sys.argv[2])
    text = src.read_text(encoding="utf-8")
    import re
    text = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.S).strip()
    html = render(text)
    dest.write_text(html, encoding="utf-8")
    blocks = html.count("<pre")
    headings = len(re.findall(r"<h2", html))
    print(f"{src} -> {dest}")
    print(f"  {len(html)} chars, {headings} h2, {blocks} code blocks")


if __name__ == "__main__":
    main()
