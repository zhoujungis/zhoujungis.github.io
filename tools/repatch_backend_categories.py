"""把误归到「数据库内核」的工程/安全类文章改回「后端架构」。

用法::

    python tools/repatch_backend_categories.py            # 预演，只打印
    python tools/repatch_backend_categories.py --apply    # 真正写入线上 API

分类 id 从线上 /categories/ 按 slug 解析，不写死数字。
"""

import argparse
import json
import sys
import urllib.error
import urllib.request

from _auth import API_URL, get_token

# 需要搬回「后端架构」的文章 slug（原文都在「数据库内核」下）
# 判据：讲的是应用侧工程/安全/交付，而不是存储引擎与查询本身。
MOVE_SLUGS = [
    "django-bleach-xss-defense",
    "django-anon-like-dedup",
    "django-comment-system-guide",
    "django-transaction-atomic-on-commit",
    "django-n1-query-kill",
    "django-subscribe-mass-mail",
    "mq-reliable-delivery-deep-dive",
    "api-idempotency-deep-dive",
    "drf-pagination-cache-throttle",
    "resilience-timeout-retry-circuit-breaker-deep-dive",
    "blog-tech-stack",
]

TARGET_SLUG = "backend"


def get(url, token=None):
    req = urllib.request.Request(url)
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    return json.loads(urllib.request.urlopen(req).read())


def fetch_all(path, token=None):
    out, url = [], f"{API_URL}{path}"
    while url:
        data = get(url, token)
        if isinstance(data, list):
            out.extend(data)
            break
        out.extend(data.get("results", []))
        url = data.get("next")
    return out


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()

    token = get_token()
    cats = fetch_all("/categories/", token)
    by_slug = {c["slug"]: c for c in cats}
    target = by_slug.get(TARGET_SLUG)
    if not target:
        print(f"找不到分类 slug={TARGET_SLUG}，现有：{sorted(by_slug)}")
        return 1

    articles = fetch_all("/articles/?page_size=200", token)
    index = {a["slug"]: a for a in articles}

    print(f"目标分类：{target['name']} (id={target['id']})")
    print(f"线上文章 {len(articles)} 篇，待搬 {len(MOVE_SLUGS)} 篇\n")

    moved = 0
    for slug in MOVE_SLUGS:
        art = index.get(slug)
        if not art:
            print(f"  跳过 {slug}：线上找不到")
            continue
        cur = (art.get("category") or {})
        cur_name, cur_id = cur.get("name", "未分类"), cur.get("id")
        if cur_id == target["id"]:
            print(f"  已是后端架构  {art['title'][:34]}")
            continue
        print(f"  {cur_name} → 后端架构  {art['title'][:34]}  ({slug})")
        if not args.apply:
            continue
        data = json.dumps({"category_id": target["id"]}).encode()
        req = urllib.request.Request(
            f"{API_URL}/admin/articles/{art['id']}/",
            data=data,
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}",
            },
            method="PATCH",
        )
        try:
            res = json.loads(urllib.request.urlopen(req).read())
            got = (res.get("category") or {}).get("name", "?")
            print(f"     ok → {got}")
            moved += 1
        except urllib.error.HTTPError as exc:
            print(f"     {exc.code} {exc.read().decode()[:120]}")

    if args.apply:
        print(f"\n完成，移动 {moved} 篇。")
    else:
        print("\n以上为预演，加 --apply 写入。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
