#!/usr/bin/env python
"""把 article/<slug>.md 渲染成前端可 import 的模块，用于本地预览。

为什么要有这个脚本
──────────────────
文章真正的渲染发生在后端（`articles/models.py` 的 `Article.save()`）：
    Python-Markdown（fenced_code / codehilite / tables / extra / toc）
      → bleach 白名单清洗
      → 存进 `html_content`

前端拿到的是**清洗后**的 HTML。所以如果本地预览自己拿别的库渲染，看到的
东西和线上不是一回事 —— 公式会不会被 `<em>` 污染、`<div class="algo-viz">`
的 class 会不会被 bleach 吃掉，这些只有在真实管线上才看得见。

这个脚本把后端那条链**原样复制**过来，产出 `frontend/src/preview/<slug>-article.js`，
再由 `frontend/preview-algo.html` 交给真实的 `MarkdownView.vue` 渲染。

用法
────
    backend/venv/Scripts/python.exe tools/render_algo_article.py article/lc-206-reverse-linked-list.md

退出码非 0 表示渲染结果不符合预期（比如占位符被清洗掉了）。
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

import bleach
import markdown

ROOT = Path(__file__).resolve().parent.parent

# ── 与 backend/articles/models.py 保持逐字一致 ────────────────────────────────
MARKDOWN_EXTENSIONS = ["fenced_code", "codehilite", "tables", "extra", "toc"]

ALLOWED_TAGS = bleach.sanitizer.ALLOWED_TAGS | {
    "h1", "h2", "h3", "h4", "h5", "h6",
    "img", "pre", "code", "span", "div",
    "table", "thead", "tbody", "tr", "th", "td",
    "hr", "br", "sup", "sub",
    "figure", "figcaption",
}

ALLOWED_ATTRIBUTES = {
    **bleach.sanitizer.ALLOWED_ATTRIBUTES,
    "img": list(set(["src", "alt", "title", "loading", "decoding"])
                | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("img", []))),
    "a": list(set(["href", "title", "rel", "target"])
              | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("a", []))),
    "code": list(set(["class"])
                 | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("code", []))),
    "pre": list(set(["class"])
                | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("pre", []))),
    "span": list(set(["class"])
                 | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("span", []))),
    "div": list(set(["class"])
                | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("div", []))),
    "th": list(set(["align"])
               | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("th", []))),
    "td": list(set(["align"])
               | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("td", []))),
}


def render(raw_html: str) -> str:
    """清洗 + 外链加固，顺序和 models.py 一样。"""
    cleaned = bleach.clean(
        raw_html,
        tags=ALLOWED_TAGS,
        attributes=ALLOWED_ATTRIBUTES,
        protocols=["http", "https", "mailto"],
        strip=True,
    )
    return re.sub(
        r'<a ([^>]*?)href="(https?://[^"]+)"',
        r'<a \1href="\2" rel="noopener noreferrer" target="_blank"',
        cleaned,
    )


def reading_time_minutes(content: str) -> int:
    """与 backend/articles/serializers.py 的 reading_time_minutes 一致。"""
    chinese = len(re.findall(r"[一-鿿㐀-䶿]", content or ""))
    english = len(re.findall(r"[a-zA-Z]+", content or ""))
    return max(1, (chinese + english) // 250 + 1)


def make_excerpt(html_content: str, fallback_text: str = "", word_limit: int = 50) -> str:
    """与 backend/articles/models.py 的 make_excerpt 一致。"""
    from html import unescape

    text = html_content or ""
    text = re.sub(r"<pre\b[^>]*>.*?</pre>", " ", text, flags=re.DOTALL)
    text = re.sub(r"<(style|script)\b[^>]*>.*?</\1>", " ", text, flags=re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    text = unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    if not text:
        text = re.sub(r"\s+", " ", fallback_text or "").strip()
    words = text.split()
    return " ".join(words[:word_limit]) if len(words) > word_limit else text


def split_frontmatter(source: str) -> tuple[dict, str]:
    if not source.startswith("---"):
        return {}, source
    end = source.find("\n---", 3)
    if end == -1:
        return {}, source
    block = source[3:end].strip("\n")
    body = source[end + 4:].lstrip("\n")
    meta: dict = {}
    for line in block.splitlines():
        if not line.strip() or line.lstrip().startswith("#"):
            continue
        key, _, value = line.partition(":")
        key = key.strip()
        value = value.strip()
        if not key:
            continue
        if value.startswith("[") and value.endswith("]"):
            meta[key] = [
                item.strip().strip('"').strip("'")
                for item in value[1:-1].split(",")
                if item.strip()
            ]
        elif value in ("null", "~", ""):
            meta[key] = None
        else:
            meta[key] = value.strip('"').strip("'")
    return meta, body


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: render_algo_article.py article/<slug>.md [--out <path>]")
        return 2

    md_path = Path(sys.argv[1])
    if not md_path.is_absolute():
        md_path = ROOT / md_path
    if not md_path.exists():
        print(f"!! 找不到 {md_path}")
        return 2

    source = md_path.read_text(encoding="utf-8")
    meta, body = split_frontmatter(source)
    slug = meta.get("slug") or md_path.stem

    md = markdown.Markdown(extensions=MARKDOWN_EXTENSIONS)
    raw_html = md.convert(body)
    html = render(raw_html)

    # ── 体检 ────────────────────────────────────────────────────────────────
    problems: list[str] = []

    # 1. 动画占位符必须活下来（bleach 的 div 只保留 class）
    viz_count = len(re.findall(r'class="[^"]*\balgo-viz--', html))
    if viz_count == 0:
        problems.append("动画占位符 .algo-viz--* 在清洗后消失了 —— bleach 把 class 吃掉了？")

    # 2. 代码块里不该出现 <em>/<strong>（Python-Markdown 的强调语法会啃代码）
    code_pollution = 0
    for block in re.findall(r"<pre\b[^>]*>.*?</pre>", html, flags=re.DOTALL):
        code_pollution += len(re.findall(r"</?(?:em|strong)\b", block))
    if code_pollution:
        problems.append(f"代码块里出现 {code_pollution} 处 <em>/<strong> —— 强调语法污染了代码")

    # 3. 不该有未配对的 ** 或裸露的 HTML 注释
    if re.search(r"\*\*", html):
        problems.append("渲染结果里还有裸露的 ** —— 有粗体没配对")

    # 4. 空链接 / 危险协议
    if re.search(r'href="(?:javascript|data):', html):
        problems.append("出现了 javascript:/data: 协议链接")

    # ── 报告 ────────────────────────────────────────────────────────────────
    reading = reading_time_minutes(body)
    excerpt = make_excerpt(html, body)

    print(f"文章    : {meta.get('title') or md_path.stem}")
    print(f"slug    : {slug}")
    print(f"状态    : {meta.get('status')}")
    print(f"正文    : {len(body)} 字符 / {len(body.splitlines())} 行")
    print(f"渲染后  : {len(html)} 字符")
    print(f"阅读时长: {reading} 分钟（后端同一公式）")
    print(f"动画占位: {viz_count} 个")
    print(f"标题标签: h1={len(re.findall(r'<h1', html))} h2={len(re.findall(r'<h2', html))} "
          f"h3={len(re.findall(r'<h3', html))}")
    print(f"代码块  : pre={len(re.findall(r'<pre', html))} 表格={len(re.findall(r'<table', html))}")
    print(f"摘要    : {excerpt[:110]}{'…' if len(excerpt) > 110 else ''}")

    out_path = None
    if "--out" in sys.argv:
        out_path = Path(sys.argv[sys.argv.index("--out") + 1])
    if out_path is None:
        out_path = ROOT / "frontend" / "src" / "preview" / f"{slug}-article.js"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "slug": slug,
        "title": meta.get("title") or "",
        "html": html,
        "readingTime": reading,
        "excerpt": excerpt,
    }
    # 用 JSON 而不是模板字符串：正文里有反引号和 ${}，模板字符串会被它们咬到。
    out_path.write_text(
        "// 本文件由 tools/render_algo_article.py 生成，请勿手改。\n"
        "// 内容 = 后端 Python-Markdown + bleach 清洗后的 html_content。\n"
        f"export default {json.dumps(payload, ensure_ascii=False, indent=0)}\n",
        encoding="utf-8",
    )
    print(f"预览模块: {out_path.relative_to(ROOT)}")

    if problems:
        print("\n!! 发现问题：")
        for p in problems:
            print(f"   - {p}")
        return 1

    print("\nOK —— 渲染结果符合预期。")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
