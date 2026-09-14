"""Reproduce the transaction/concurrency benchmarks for the article.

Companion to ``article/django-transaction-atomic-on-commit.md``.

Usage:
    python tools/bench_transaction.py
    python tools/bench_transaction.py --threads 4 --increments 50

Works on a *copy* of ``backend/db.sqlite3`` in the system temp dir; the real
database is never touched, and the subscriber-notification signal is
disconnected so no mail is ever sent.
"""

import argparse
import shutil
import statistics
import sys
import tempfile
import threading
import time
from pathlib import Path

BACKEND = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(BACKEND))

SCRATCH = Path(tempfile.gettempdir()) / "bench_transaction.sqlite"
shutil.copy(BACKEND / "db.sqlite3", SCRATCH)

import os  # noqa: E402

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "blog_api.settings")
os.environ.setdefault("DJANGO_SECRET_KEY", "bench-transaction-local-only")

import django  # noqa: E402

django.setup()

from django.conf import settings  # noqa: E402

settings.DATABASES["default"]["NAME"] = str(SCRATCH)

from django.db import IntegrityError, connections, transaction  # noqa: E402
from django.db.models import F  # noqa: E402
from django.db.models.signals import post_save  # noqa: E402

from articles.models import Article  # noqa: E402
from articles.signals import notify_subscribers_on_publish  # noqa: E402

# Never send mail during experiments.
post_save.disconnect(notify_subscribers_on_publish, sender=Article)


def banner(text):
    print("\n" + "=" * 72 + f"\n{text}\n" + "=" * 72)


def close_conn():
    connections.close_all()


def env_info():
    banner("E0 环境与后端能力")
    db = settings.DATABASES["default"]
    print(f"  ENGINE                : {db['ENGINE']}")
    print(f"  ATOMIC_REQUESTS       : {db.get('ATOMIC_REQUESTS', '(未配置, 默认 False)')}")
    print(f"  CONN_MAX_AGE          : {db.get('CONN_MAX_AGE', '(未配置, 默认 0)')}")
    print(f"  has_select_for_update : {connections['default'].features.has_select_for_update}")
    print(f"  Django {django.get_version()} / Python {sys.version.split()[0]}")


# ── E1: lost update ────────────────────────────────────────────────────────
def _worker(mode, n, pk, errors, lock):
    try:
        for _ in range(n):
            if mode == "A":  # 读-改-写，autocommit
                a = Article.objects.get(pk=pk)
                a.views_count = a.views_count + 1
                a.save(update_fields=["views_count"])
            elif mode == "B":  # 读-改-写，套 transaction.atomic
                with transaction.atomic():
                    a = Article.objects.get(pk=pk)
                    a.views_count = a.views_count + 1
                    a.save(update_fields=["views_count"])
            elif mode == "C":  # F() 表达式，单条 UPDATE
                Article.objects.filter(pk=pk).update(views_count=F("views_count") + 1)
            elif mode == "D":  # atomic + select_for_update
                with transaction.atomic():
                    a = Article.objects.select_for_update().get(pk=pk)
                    a.views_count = a.views_count + 1
                    a.save(update_fields=["views_count"])
    except Exception as exc:  # noqa: BLE001 - we want to report whatever happens
        with lock:
            errors.append(f"{type(exc).__name__}: {exc}")
    finally:
        close_conn()


def run_mode(mode, threads, increments, pk):
    Article.objects.filter(pk=pk).update(views_count=0)
    errors = []
    lock = threading.Lock()
    t0 = time.perf_counter()
    workers = [
        threading.Thread(target=_worker, args=(mode, increments, pk, errors, lock))
        for _ in range(threads)
    ]
    for w in workers:
        w.start()
    for w in workers:
        w.join()
    elapsed = (time.perf_counter() - t0) * 1000
    final = Article.objects.get(pk=pk).views_count
    return final, elapsed, errors


def e1(threads, increments, pk):
    banner(f"E1 丢失更新：{threads} 线程 × {increments} 次自增（期望 {threads * increments}）")
    labels = {
        "A": "A 读-改-写（autocommit）",
        "B": "B 读-改-写 + transaction.atomic()",
        "C": "C F() 表达式（单条 UPDATE）",
        "D": "D atomic + select_for_update()",
    }
    for mode in ("A", "B", "C", "D"):
        final, elapsed, errors = run_mode(mode, threads, increments, pk)
        expected = threads * increments
        lost = expected - final
        print(f"\n--- {labels[mode]}")
        print(f"    最终值 {final:6d} / 期望 {expected:6d}  | 丢失 {lost:6d} "
              f"({lost / expected * 100:5.1f}%)  | {elapsed:8.1f} ms")
        for err in errors[:2]:
            print(f"    异常: {err}")
        if errors:
            print(f"    （共 {len(errors)} 个线程抛异常）")


# ── E2: save() vs update() ─────────────────────────────────────────────────
def e2(runs=20):
    banner("E2 只改一个计数器的代价：save() vs update()")
    # 挑正文最长的一篇，让 markdown 渲染 + bleach 的成本显形
    target = max(Article.objects.all(), key=lambda a: len(a.content or ""))
    print(f"  样本: pk={target.pk} 《{target.title[:24]}》 正文 {len(target.content)} 字符")

    times_save, times_update = [], []
    for _ in range(runs):
        a = Article.objects.get(pk=target.pk)
        t0 = time.perf_counter()
        a.save(update_fields=["views_count"])
        times_save.append((time.perf_counter() - t0) * 1000)

        t0 = time.perf_counter()
        Article.objects.filter(pk=target.pk).update(views_count=F("views_count") + 1)
        times_update.append((time.perf_counter() - t0) * 1000)

    ms = statistics.median(times_save)
    mu = statistics.median(times_update)
    print(f"  a.save(update_fields=['views_count'])  : {ms:8.2f} ms")
    print(f"  .update(views_count=F()+1)             : {mu:8.2f} ms")
    print(f"  倍差                                   : {ms / mu:8.1f}×")
    print("  （save() 无条件跑 markdown 渲染 + bleach 清洗，与 update_fields 无关）")


# ── E3: on_commit vs 副作用 ─────────────────────────────────────────────────
def e3(pk):
    banner("E3 事务回滚时，副作用到底有没有发生")
    log = []

    def side_effect(sender, instance, **kwargs):
        log.append("post_save: 邮件已发出")

    post_save.connect(side_effect, sender=Article, dispatch_uid="bench-side-effect")
    try:
        # 场景 1：save 之后主动抛异常 → 事务回滚
        log.clear()
        try:
            with transaction.atomic():
                a = Article.objects.get(pk=pk)
                a.title = a.title  # touch
                a.save(update_fields=["title"])
                transaction.on_commit(lambda: log.append("on_commit: 邮件已发出"))
                raise RuntimeError("业务校验失败，回滚")
        except RuntimeError as exc:
            print(f"  场景1 捕获异常: {exc}")
        print(f"  场景1 回滚后记录: {log or '（空）'}")

        # 场景 2：正常提交
        log.clear()
        with transaction.atomic():
            a = Article.objects.get(pk=pk)
            a.save(update_fields=["title"])
            transaction.on_commit(lambda: log.append("on_commit: 邮件已发出"))
        print(f"  场景2 提交后记录: {log}")
    finally:
        post_save.disconnect(dispatch_uid="bench-side-effect")


# ── E4: atomic 嵌套与 TransactionManagementError ───────────────────────────
def e4(pk):
    banner("E4 在 atomic 内部捕获异常后，还能不能继续查库")
    base_slug = Article.objects.get(pk=pk).slug

    # 场景 1（经典错误）：try 写在 atomic 内部，捕获 IntegrityError 后继续查库
    with transaction.atomic():
        try:
            Article.objects.create(title="dup", slug=base_slug, content="x")
        except IntegrityError as exc:
            print(f"  场景1 捕获 IntegrityError: {str(exc)[:60]}")
        try:
            n = Article.objects.count()
            print(f"  场景1 捕获后继续查询: OK，共 {n} 篇")
        except Exception as exc:  # noqa: BLE001
            print(f"  场景1 捕获后继续查询: {type(exc).__name__}")
            print(f"      {str(exc)[:120]}")

    # 场景 2（正确）：内层再套一个 atomic（savepoint），只回滚这一段
    with transaction.atomic():
        try:
            with transaction.atomic():
                Article.objects.create(title="dup", slug=base_slug, content="x")
        except IntegrityError as exc:
            print(f"  场景2 内层 atomic 捕获 IntegrityError: {str(exc)[:60]}")
        try:
            n = Article.objects.count()
            print(f"  场景2 捕获后继续查询: OK，共 {n} 篇")
        except Exception as exc:  # noqa: BLE001
            print(f"  场景2 捕获后继续查询: {type(exc).__name__}: {str(exc)[:120]}")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--threads", type=int, default=8)
    parser.add_argument("--increments", type=int, default=50)
    args = parser.parse_args()

    pk = Article.objects.first().pk
    print(f"scratch db: {SCRATCH}")
    print(f"target row: Article pk={pk}")

    try:
        env_info()
        e1(args.threads, args.increments, pk)
        e2()
        e3(pk)
        e4(pk)
    finally:
        close_conn()
        SCRATCH.unlink(missing_ok=True)
        print("\ndone.")


if __name__ == "__main__":
    main()
