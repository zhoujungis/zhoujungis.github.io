"""把英文文章注册表里的 date 全部对齐到中文原文的发布日期。

英文条目里的 date 之前是手写的，会漂（甚至写成未来日期）。真相只有一个：
线上 `/articles/<zhSlug>/` 的 `created_at`。本脚本按 zhSlug 抓回来，重写
`frontend/src/data/en/articles.js` 里每个条目紧随其后的 date 字段。

    python tools/sync_en_dates.py --dry-run
    python tools/sync_en_dates.py
"""

import argparse
import json
import re
import sys
import urllib.request
from pathlib import Path

from _auth import API_URL, get_token

ROOT = Path(__file__).resolve().parent.parent
REGISTRY = ROOT / "frontend" / "src" / "data" / "en" / "articles.js"


def get(url, token=None):
    req = urllib.request.Request(url)
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    return json.loads(urllib.request.urlopen(req, timeout=60).read())


def fetch_created():
    token = get_token()
    out = {}
    url = f"{API_URL}/articles/?page_size=200"
    while url:
        data = get(url, token)
        if isinstance(data, list):
            items, url = data, None
        else:
            items, url = data.get("results", []), data.get("next")
        for a in items:
            created = a.get("created_at") or ""
            if created:
                out[a["slug"]] = created[:10]
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    created = fetch_created()
    print(f"线上文章：{len(created)} 篇")

    src = REGISTRY.read_text(encoding="utf-8")
    edits = []
    missing = []
    same = 0

    for m in re.finditer(r"zhSlug: '([^']+)'", src):
        zh = m.group(1)
        date_pos = src.find("date: '", m.end())
        if date_pos == -1:
            continue
        end_quote = src.find("'", date_pos + 7)
        current = src[date_pos + 7:end_quote]
        want = created.get(zh)
        if not want:
            missing.append((zh, current))
            continue
        if current == want:
            same += 1
            continue
        edits.append((date_pos + 7, end_quote, current, want, zh))

    # 从后往前替换，避免位移
    new_src = src
    for start, end, current, want, zh in sorted(edits, reverse=True):
        new_src = new_src[:start] + want + new_src[end:]

    print(f"需要修正：{len(edits)} 条；已一致：{same} 条；查不到中文原文：{len(missing)} 条")
    for start, end, current, want, zh in sorted(edits, key=lambda e: e[4]):
        print(f"  {zh:52s} {current} -> {want}")
    for zh, current in missing:
        print(f"  [missing] {zh} (保留 {current})", file=sys.stderr)

    if args.dry_run:
        print("\n--dry-run：未写入")
        return

    REGISTRY.write_text(new_src, encoding="utf-8")
    print(f"\n已写入 {REGISTRY.name}")


if __name__ == "__main__":
    main()
