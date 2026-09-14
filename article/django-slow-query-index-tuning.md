---
title: "索引建了，为什么排序还是没用上？——Django 慢查询与索引实战（100 万行实测）"
slug: "django-slow-query-index-tuning"
category_id: null
tags: ["Django", "后端", "数据库", "性能优化"]
status: "published"
cover_image: "https://zhoujungis.github.io/photos/django-slow-query-index-cover.svg"
---

# 索引建了，为什么排序还是没用上？——Django 慢查询与索引实战（100 万行实测）

> 承接上一篇《从 21 条 SQL 到 2 条：三次 N+1 查询围剿实录》。N+1 修完了，列表页只剩 2 条 SQL——但**条数少，不等于快**。
> 技术栈：Django 6.0.6 + SQLite 3.50.4（与本站线上同栈）；原理对 MySQL 8 / PostgreSQL 同样成立，文中会标注差异。
> 阅读时间：约 45 分钟（超详细版） | 难度：中高级 | 收获：一套"看执行计划 → 定位索引 → 用数字验证"的慢查询排查法

## 前言：N+1 修完之后，账单才刚开始

上一篇的结尾，我把文章列表页从 21 条 SQL 压到了 2 条。当时我以为这个接口的性能问题已经结束了。

后来我做了一件更较真的事：**把本地数据从 9 篇灌到 100 万篇**，然后跑了一遍线上那条一模一样的 SQL。结果是这样的：

| 方案 | 执行计划 | 首页 `LIMIT 10` 耗时（中位数） |
|---|---|---|
| 不建任何索引 | `SCAN` + `TEMP B-TREE` | 395.92 ms |
| **线上现在的索引** | `SEARCH` + `TEMP B-TREE` | **476.50 ms** |
| 多补一列 `is_top` | `SEARCH` + `TEMP B-TREE FOR LAST TERM` | 690.80 ms |
| 方向也对齐 | `SEARCH` | **0.18 ms** |

三件事，每一件都反直觉：

1. **建了索引，反而比不建更慢**（476 ms vs 396 ms）。这个索引对这条 SQL 来说，约等于不存在。
2. **多补一列，更慢了**（691 ms）。"半个索引"比没有索引更糟——它给了优化器一个"我好像能帮上忙"的假象。
3. **把方向写对，快了约 2600 倍**（0.18 ms）。

差距的根源不是"有没有索引"，而是：**索引的物理有序性，能不能对得上 SQL 要求的顺序。**

而这一切，在只有 9 篇文章的博客上，你永远看不出来。这才是慢查询最阴的地方。

---

**目录**

- 先分清两笔账：查询次数 ≠ 单条查询成本
- 认识执行计划：四种关键字读懂慢在哪
- 现场：博客真实的索引，和它真实的执行计划
- 实验一：造 100 万行，把 2600 倍差距压出来
- 原理：为什么"方向不对"就等于没索引
- 修复：改一行 models.py，附迁移与验证
- 实验二：10 种写法，哪种让索引当场失效
- 第二个慢查询：深翻页 OFFSET 900000
- COUNT(*) 也是慢查询
- 索引不是越多越好：写放大与选择性
- 方法论：五步定位慢查询
- 上线 Checklist
- 结语

---

## 1. 先分清两笔账：查询次数 ≠ 单条查询成本

上一篇解决的是**次数**问题：一个请求发几条 SQL。这篇解决的是**成本**问题：一条 SQL 要花多久。

| 维度 | 症状 | 典型元凶 | 修复手段 |
|---|---|---|---|
| 查询次数 | 条数随数据量线性增长 | N+1 | `select_related` / `prefetch_related` / `annotate` |
| 单条成本 | 条数不变，但每条越来越慢 | 全表扫描、排序、临时表 | 索引、改写 SQL、分页策略 |

一个请求发 2 条 SQL，每条各扫 90 万行——**总成本是 2 × 476 ms ≈ 1 秒**。次数优化做到了满分，用户体感依然是"这站好卡"。

所以排查顺序应该是：

1. 先看条数（贵得离谱的 N+1 优先干掉，收益最大）；
2. 再看每条 SQL 的执行计划（这一步决定上限）；
3. 最后看单条 SQL 内部的算法（是否可用索引、是否排序、是否临时表）。

**两笔账都要算，只算一笔就会得出"我已经优化过了"的错觉。**

---

## 2. 认识执行计划：四种关键字读懂慢在哪

在 MySQL 里你敲 `EXPLAIN`，在 SQLite 里你敲 `EXPLAIN QUERY PLAN`。输出的关键字不多，但每一个都对应一种真实的代价。

| 关键字 | 含义 | 代价 | 危险等级 |
|---|---|---|---|
| `SCAN table` | 全表扫描 | O(全表行数) | 🔴 高 |
| `SEARCH table USING INDEX (col=?)` | 用索引定位到具体行 | O(命中行数) | 🟢 低 |
| `SEARCH ... USING COVERING INDEX` | 索引里就有全部需要的列，**不回表** | O(命中行数)，更省 | 🟢 更低 |
| `SCAN ... USING COVERING INDEX` | 扫整个索引而不是整张表 | O(全表行数)，但行更窄 | 🟡 中（是"扫"不是"查"） |
| `USE TEMP B-TREE FOR ORDER BY` | **必须额外排序** | O(n log n) | 🔴 高 |
| `USE TEMP B-TREE FOR LAST TERM OF ORDER BY` | 排序条件只满足了一部分 | O(n log n) 的一部分 | 🟠 中高 |
| `USE TEMP B-TREE FOR GROUP BY` | 分组也要临时表 | O(n log n) | 🟠 中高 |

一句话记住：

> **`SEARCH` 是查，`SCAN` 是翻；出现 `TEMP B-TREE` 说明索引没帮你把顺序也管住。**

`SCAN` 不一定是灾难（小表、或者只取很少列时很快），但出现在一个"每次请求都要跑"的热路径上，就是定时炸弹。而 `TEMP B-TREE FOR ORDER BY` 基本等同于告诉你：**你的索引只被用了一半。**

### 2.1 在 Django 里怎么拿到执行计划

Django 的 ORM 不会把执行计划吐给你，但你可以把 ORM 生成的 SQL 抠出来，再喂给数据库：

```python
# tools/explain.py —— 把任意 queryset 的执行计划打出来
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "blog_api.settings")
django.setup()

from django.db import connection


def explain(qs, verbose=True):
    """返回 queryset 的执行计划（SQLite 用 EXPLAIN QUERY PLAN）。"""
    sql, params = qs.query.sql_with_params()
    if verbose:
        print(sql)
    with connection.cursor() as cur:
        # MySQL 8 用 "EXPLAIN"，8.0.18+ 可用 "EXPLAIN ANALYZE"
        # PostgreSQL 用 "EXPLAIN (ANALYZE, BUFFERS)"
        cur.execute("EXPLAIN QUERY PLAN " + sql, params)
        return [row[-1] for row in cur.fetchall()]


if __name__ == "__main__":
    from articles.models import Article

    qs = Article.objects.filter(status=Article.Status.PUBLISHED)
    for line in explain(qs):
        print("   ", line)
```

跑一下，输出是：

```
SELECT "articles_article"."id", ... FROM "articles_article"
WHERE "articles_article"."status" = ? ORDER BY "articles_article"."is_top" DESC,
"articles_article"."created_at" DESC

    SEARCH articles_article USING INDEX articles_status_created_idx (status=?)
    USE TEMP B-TREE FOR ORDER BY
```

**注意最后那行。** 索引用上了（`SEARCH`），但排序没管住（`TEMP B-TREE`）——这就是本文要解剖的那根刺。

### 2.2 顺手把"每条 SQL 花了多久"也打出来

上一篇我们用 `CaptureQueriesContext` 数条数，其实它连每条 SQL 的耗时一起给了：

```python
from django.db import connection
from django.test.utils import CaptureQueriesContext
from articles.models import Article

with CaptureQueriesContext(connection) as ctx:
    list(Article.objects.filter(status=Article.Status.PUBLISHED)[:10])

print(f"共 {len(ctx.captured_queries)} 条 SQL")
for q in ctx.captured_queries:
    print(f'{float(q["time"]) * 1000:8.2f} ms | {q["sql"][:110]}')
```

**条数 + 单条耗时，才是完整的性能画像。** 只有条数，你会漏掉"2 条 SQL 各花半秒"这种更常见的线上事故。

---

## 3. 现场：博客真实的索引，和它真实的执行计划

先看博客线上真实的模型定义（`backend/articles/models.py`）：

```python
class Article(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "草稿"
        PUBLISHED = "published", "已发布"
        ARCHIVED = "archived", "已归档"
        SCHEDULED = "scheduled", "定时发布"

    title = models.CharField(max_length=200, verbose_name="标题")
    slug = models.SlugField(max_length=200, unique=True, verbose_name="Slug")
    # ... 省略若干字段 ...
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.DRAFT)
    is_top = models.BooleanField(default=False, verbose_name="置顶")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        verbose_name = "文章"
        ordering = ["-is_top", "-created_at"]        # ← 排序：先置顶，再按时间倒序
        indexes = [
            models.Index(                            # ← 索引：status + created_at
                fields=["status", "-created_at"],
                name="articles_status_created_idx",
            ),
            models.Index(fields=["scheduled_at"], name="articles_scheduled_idx"),
        ]
```

请把这两行并排看：

```python
ordering = ["-is_top", "-created_at"]                                  # 排序：is_top, created_at
indexes  = [Index(fields=["status", "-created_at"])]                   # 索引：status, created_at
```

**排序要两列，索引只有其中一列。** 少的那一列是 `is_top`。

在真实的 `db.sqlite3`（9 篇文章）上跑执行计划：

```
SEARCH articles_article USING INDEX articles_status_created_idx (status=?)
USE TEMP B-TREE FOR ORDER BY
```

对比一下"把 `is_top` 从排序里去掉"的同一个查询：

```
SEARCH articles_article USING INDEX articles_status_created_idx (status=?)
```

**`TEMP B-TREE` 消失了。**

同一个索引，同一个表，只因为排序条件少了 `is_top` 这一列，一个要额外排序、一个不要。这就是全部秘密。

> **但 9 篇文章的时候，两种写法都是 0.0x 毫秒，你完全察觉不到。** 一个索引是否有效，和数据量无关；一个索引失效带来的痛，和数据量强相关。这是本文最想让你带走的一句话。

---

## 4. 实验一：造 100 万行，把 2600 倍差距压出来

线上那 9 篇文章不可能复现问题，所以我在本地按同样的表结构造数据：

```python
ROWS = 1_000_000
# 90% published，10% draft；is_top 只有极少数为 1（和真实博客一样）
for i in range(ROWS):
    status = "published" if (i % 10) != 0 else "draft"
    is_top = 1 if i in (7, 42, 1337, 99999, 500000) else 0
    created_at = base + i * 37 秒
```

环境与口径：

- SQLite 3.50.4 / 100 万行 / 其中已发布 90 万行 / 库文件 63 MB
- 每条 SQL 跑 7 次取**中位数**（单次取最小值容易骗自己，中位数更接近稳定表现）
- 每换一次索引都 `DROP` 掉其他索引，保证对照组干净

### 4.1 四组对照

被测试的 SQL 就是列表页那条：

```sql
SELECT id, title FROM articles_article
WHERE status = 'published'
ORDER BY is_top DESC, created_at DESC
LIMIT 10;
```

| # | 索引 | 执行计划 | 中位数 | 对比基准 |
|---|---|---|---|---|
| S0 | 无 | `SCAN` + `TEMP B-TREE` | 395.92 ms | 1× |
| S1 | `(status, created_at DESC)` ← **线上现状** | `SEARCH` + `TEMP B-TREE` | 476.50 ms | 0.83×（更慢） |
| S2 | `(status, is_top, created_at DESC)` | `SEARCH` + `TEMP B-TREE FOR LAST TERM` | 690.80 ms | 0.57×（更慢） |
| S3 | `(status, is_top DESC, created_at DESC)` | `SEARCH` | **0.18 ms** | **2200×（相对 S0）** |

### 4.2 逐条解读

**S0（无索引）395.92 ms** —— `SCAN` 扫 100 万行，`TEMP B-TREE` 再排 100 万行。教科书式的灾难。

**S1（线上索引）476.50 ms** —— 这是最扎心的一格。索引**确实被用上了**（`SEARCH ... (status=?)`，从 100 万行过滤到 90 万行），但排序照样要做。而且它比 S0 还慢了 20%，原因有两个：

1. 走索引是 90 万次索引项访问 + 90 万次回表（要取 `title` 和 `is_top`），而 `SCAN` 是 100 万次**顺序**读表——顺序读比随机读便宜；
2. 省下的 10% 过滤成本（100 万 → 90 万），远远抵不过多绕的这一层。

结论只有一句：**这个索引对这条 SQL 的贡献约等于 0。**

**S2（补了 `is_top`，但方向是升序）690.80 ms** —— 最反直觉的一格：加了列反而更慢。

因为 `(status, is_top, created_at DESC)` 里 `is_top` 是**升序**，而 SQL 要 `is_top DESC`。SQLite 只能反向扫索引拿到 `is_top` 的倒序——但一反向，`created_at` 也跟着变成升序了，于是排序的第二项又对不上。优化器只好退而求其次，提示 `TEMP B-TREE FOR LAST TERM OF ORDER BY`：**对最后一个排序项再排一次**。

而 `is_top` 里 99.9995% 都是 0，那个"最后一组"就是几乎全部 90 万行。等于绕了一圈，还是排了 90 万行，还多付了索引访问的成本。

> **教训：半个索引比没有索引更糟。** 它让优化器以为自己能帮上忙，于是选了更绕的路，最后什么都没省。

**S3（方向也对齐）0.18 ms** —— `(status, is_top DESC, created_at DESC)`，索引的物理顺序和 SQL 要求的顺序**逐项一致**。SQLite 定位到 `status='published'` 的第一条，顺着索引往下读 10 条就够——`LIMIT 10` 终于生效了。**476.50 → 0.18，约 2600 倍。**

### 4.3 顺手把深翻页也测了

同一批数据，同一个查询，只改 `OFFSET`：

| 方案 | `OFFSET 900000` 中位数 |
|---|---|
| S1 旧索引 | 1131.62 ms |
| S3 新索引 | 109.72 ms |

新索引把深翻页压到了 1/10，但 **110 ms 依然是慢查询**——因为 `OFFSET` 的本质是"先数过 90 万行，再全部丢掉"。第 8 节单独讲这个。

---

## 5. 原理：为什么"方向不对"就等于没索引

很多人对索引的心智模型是"加速查找"。这个模型**只对了一半**——索引的另一半价值是**提供有序性**。

### 5.1 索引就是一本按顺序排好的电话簿

把 `(status, is_top DESC, created_at DESC)` 这个索引想成一本电话簿：

```
published | is_top=1 | 2026-09-11 16:55   ← 第 1 条
published | is_top=1 | 2026-09-09 16:45
published | is_top=1 | 2026-09-04 11:23
published | is_top=0 | 2026-09-11 16:56
published | is_top=0 | 2026-09-11 16:55
published | is_top=0 | 2026-09-10 10:12
...
```

它的物理顺序是：**先按 status 分组，组内先按 is_top 倒序，再按 created_at 倒序。**

而 SQL 要的顺序是 `is_top DESC, created_at DESC`——**和这本电话簿的翻页方向完全一致**。所以数据库只要翻到 `published` 那一段的第一页，读 10 行就交差。

现在看线上那个索引 `(status, created_at DESC)`，电话簿变成：

```
published | 2026-09-11 16:56   ← 第 1 条
published | 2026-09-11 16:55
published | 2026-09-10 10:12
...
```

它按时间排好了，但**`is_top` 根本不在里面**。而 SQL 要求"先按 is_top 排"，数据库只能：把所有 `published` 的行全捞出来（90 万行），补上每行的 `is_top`，再自己排一遍。**这就是 `TEMP B-TREE FOR ORDER BY`。**

### 5.2 三条硬规则

从上面的电话簿模型可以直接推出三条规则，记住它们，90% 的索引问题就不用猜了：

> **规则一：等值条件列在前，排序列在后。**
> `WHERE status = 'published' ORDER BY ...` → 索引必须以 `status` 开头。反过来 `(created_at, status)` 就只能当覆盖索引用，定位不了。
>
> **规则二：索引列顺序必须覆盖 `ORDER BY` 的列顺序（从第一项开始）。**
> `ORDER BY is_top DESC, created_at DESC` 需要索引里有 `is_top` 且紧接 `created_at`。少一个、错一个位置，都要额外排序。
>
> **规则三：每一列的升降方向必须逐项对齐。**
> `is_top DESC` 就要索引里 `is_top` 也是 `DESC`。这是最容易被忽略、也最致命的一条——**规则二满足而规则三不满足，就会得到 S2 那种"更慢"的结果。**

### 5.3 各家数据库的差异（别踩版本坑）

| 数据库 | 降序索引支持 | 排序没走索引时的提示 |
|---|---|---|
| SQLite | 3.3.0+ 支持 `DESC` | `USE TEMP B-TREE FOR ORDER BY` |
| MySQL | **8.0 才真正支持降序索引**；5.7 及以前 `DESC` 关键字被静默忽略，只建升序索引 | `Using filesort` |
| PostgreSQL | 支持；但只能整体反向扫描，**混合方向（一升一降）必须建方向匹配的索引** | `Sort` / `Incremental Sort` |

**MySQL 5.7 的用户特别注意**：你在 5.7 上写 `Index(fields=["status", "-is_top", "-created_at"])`，Django 生成的 DDL 里带着 `DESC`，但 MySQL 5.7 会**当作升序索引建**，`SHOW CREATE TABLE` 里也看不到 `DESC`。迁移到 8.0 之后行为才改变。升级数据库版本时，执行计划是会变的——这类"升级后突然变慢"的事故，源头常常就在这里。

---

## 6. 修复：改一行 models.py，附迁移与验证

### 6.1 改法

```python
class Article(models.Model):
    # ... 字段不变 ...

    class Meta:
        verbose_name = "文章"
        verbose_name_plural = "文章"
        ordering = ["-is_top", "-created_at"]
        indexes = [
            # 与 ordering 逐项对齐：等值列 status 在前，随后是 is_top DESC、created_at DESC
            models.Index(
                fields=["status", "-is_top", "-created_at"],
                name="articles_status_top_created_idx",
            ),
            models.Index(fields=["scheduled_at"], name="articles_scheduled_idx"),
        ]
```

关键就一处：`fields=["status", "-created_at"]` → `fields=["status", "-is_top", "-created_at"]`。

Django 会把 `-is_top` 翻译成 DDL 里的 `"is_top" DESC`：

```sql
CREATE INDEX "articles_status_top_created_idx"
ON "articles_article" ("status", "is_top" DESC, "created_at" DESC);
```

然后：

```bash
python manage.py makemigrations articles
python manage.py migrate
```

### 6.2 验证（我在 `db.sqlite3` 的副本上实测）

```
[改动前]
    SEARCH articles_article USING INDEX articles_status_created_idx (status=?)
    USE TEMP B-TREE FOR ORDER BY          ← 排序靠自己

[改动后]
    SEARCH articles_article USING INDEX articles_status_top_created_idx (status=?)
                                          ← 没有 TEMP B-TREE 了
```

**`TEMP B-TREE` 消失，就是"改对了"的唯一硬指标。** 不要靠感觉，也不要只看耗时——9 篇文章的数据量下，耗时永远看不出差别。

### 6.3 三个容易翻车的细节

**细节一：索引列顺序不能反。** `(is_top, created_at, status)` 或 `(is_top, status, created_at)` 都无效——`status` 是等值条件，必须在最左。**等值列在前**是铁律。

**细节二：旧索引要不要删？** `articles_status_created_idx` 并非完全没用，它还能服务"不带 `is_top` 的排序"（比如归档页 `ORDER BY created_at DESC`）。判断方法很简单：

```bash
# 把所有可能用到它的查询捞出来，看还有没有"只按 created_at 排序"的
grep -rn "order_by" backend/articles/ backend/comments/
```

如果没有这种查询，留着它只是纯粹的写放大（每写一篇文章，多维护一棵 B+ 树），删掉。如果有，就两个都留。

**细节三：大表加索引要小心锁。** 100 万行的表上直接 `CREATE INDEX` 可能锁住写入几十秒：

| 数据库 | 在线加索引 |
|---|---|
| MySQL | `ALTER TABLE ... ADD INDEX ..., ALGORITHM=INPLACE, LOCK=NONE`（8.0 默认就支持在线 DDL） |
| PostgreSQL | `CREATE INDEX CONCURRENTLY idx_name ON ...` |
| SQLite | 建索引会短暂锁库（PythonAnywhere 上的 SQLite 本来就是单写，影响有限） |

---

## 7. 实验二：10 种写法，哪种让索引当场失效

上面的实验只改索引，SQL 不动。但**更常见的事故是索引没变，SQL 被改坏了**。同一个 100 万行表（128 MB，索引 `(status, created_at DESC)` + `(title)`），我测了 10 种写法：

| # | 写法 | 执行计划 | 中位数 | 判定 |
|---|---|---|---|---|
| A | `WHERE status='published' ORDER BY created_at DESC` | `SEARCH USING INDEX` | **0.33 ms** | ✅ 基线 |
| B | `WHERE substr(status,1,9)='published' ...` | `SCAN` + `TEMP B-TREE` | **1015.49 ms** | ❌ 函数包裹，**3000 倍** |
| C | `WHERE status LIKE 'published%' ...` | `SCAN` + `TEMP B-TREE` | **936.83 ms** | ❌ LIKE 没能走索引 |
| D | `WHERE title LIKE '%article 19999%'` | `SCAN USING COVERING INDEX` | 25.38 ms | ⚠️ 全扫，但覆盖索引救了它 |
| E | `WHERE status != 'draft' ...` | `SCAN` + `TEMP B-TREE` | **948.18 ms** | ❌ 不等值 |
| F | `WHERE status='published' OR status='scheduled' ...` | `SEARCH USING INDEX` + `TEMP B-TREE` | 0.38 ms | 🟡 索引用上了，排序没用上 |
| G | `SELECT status, created_at WHERE status='published'` | `SEARCH USING COVERING INDEX` | 0.30 ms | ✅ 覆盖索引 |
| H | `SELECT id, title WHERE status='published'` | `SEARCH USING INDEX` | 0.23 ms | ✅ 回表，但 `LIMIT 10` 让它无所谓 |
| I | `WHERE created_at > '2025-06-01'`（跳过最左列） | `SCAN USING COVERING INDEX` | **216.15 ms** | ❌ 违反最左前缀 |
| J | `WHERE status='published' AND created_at > '2025-06-01'` | `SEARCH ... (status=? AND created_at>?)` | **0.28 ms** | ✅ **770 倍差距** |

### 7.1 三个最有价值的发现

**① 函数包裹是最贵的错误（B，3000 倍）。**

```python
# ❌ 索引失效：索引里存的是 status 的原值，不是 substr(status,1,9)
Article.objects.extra(where=["substr(status,1,9)='published'"])   # 千万别这么写

# ✅ 索引有效
Article.objects.filter(status="published")
```

原理：索引存的是**列的原值**。一旦你给列套上函数（`substr`、`date()`、`lower()`、`UPPER()`、`CAST()`），数据库就没法用索引里的有序值去定位了，只能逐行算函数值再比——**索引瞬间变成摆设**。

Django 里最常见的三个"隐形函数包裹"：

```python
# ❌ 日期函数
Article.objects.filter(created_at__date="2026-09-11")
# ✅ 用范围表达同一天
Article.objects.filter(created_at__gte="2026-09-11", created_at__lt="2026-09-12")

# ❌ 大小写转换
Article.objects.filter(title__lower__contains="django")
# ✅ 让数据库层用不区分大小写的排序规则，或存一份规范化字段

# ❌ 类型转换
Article.objects.filter(views_count__contains="12")
# ✅ 用数字字段比较
Article.objects.filter(views_count__gte=120)
```

`created_at__date=` 是最隐蔽的一个——它读起来人畜无害，实际上生成的是 `django_datetime_cast_date(...)`，索引直接报废。

**② `LIKE 'published%'` 居然也失效了（C，936 ms）。**

这一条反直觉到值得单独说。前缀通配（`'abc%'`）**理论上**是可以走索引的，但 SQLite 默认的 `LIKE` 对 ASCII 是**不区分大小写**的，而索引是区分大小写的 `BINARY` 排序——两者语义不匹配，于是优化器放弃索引。

想在 SQLite 里让 `LIKE 'prefix%'` 走索引，需要 `PRAGMA case_sensitive_like=ON`（或给列加 `COLLATE NOCASE`）。**而更根本的建议是：能用 `=` 就别用 `LIKE`。** 等值查询走索引没有任何歧义。

MySQL 的规则不同：`LIKE 'abc%'` 在默认排序规则下可以走索引，但 `LIKE '%abc'` 和 `LIKE '%abc%'` 一定不行。

**③ 前缀通配 `LIKE '%xxx%'` 是最没救的（D）。**

左侧有通配符 = 没有起点 = 索引无法定位，只能全扫。D 组之所以只有 25 ms（而不是 900 ms），是因为它命中了 `COVERING INDEX`——只扫 `title` 这一个索引文件（行窄），不用读整张表。

> **这就是"覆盖索引"的实战价值：同样都是 `SCAN`，扫索引比扫表便宜 10~40 倍。** 如果某个字段查询频繁又只需要少数几列，一个覆盖索引能把最坏情况显著变好。

### 7.2 `OR` 不是不能优化（F）

很多人背过"`OR` 会导致索引失效"，但 SQLite 3.9+ 有 OR 优化（对每个分支各走一次索引再合并）。F 组实测 0.38 ms，索引**确实用上了**，只是排序还得自己来（`TEMP B-TREE`）。

MySQL 同理：`OR` 在 5.0+ 也能通过 index merge 用索引，但 **index merge 的代价常常被低估**，而且一旦有一个分支用不上索引，整个查询就退化成全扫。**能改写成 `IN` 或 `UNION ALL` 就改写。**

### 7.3 最左前缀：770 倍的差距只差一个条件（I vs J）

I 和 J 的差别只有一处：**有没有带上最左列 `status`**。

```python
# ❌ 跳过最左列 → SCAN USING COVERING INDEX，216.15 ms
Article.objects.filter(created_at__gt="2025-06-01")

# ✅ 带上最左列 → SEARCH (status=? AND created_at>?)，0.28 ms
Article.objects.filter(status="published", created_at__gt="2025-06-01")
```

原因：索引 `(status, created_at)` 的物理顺序是"先 status 再 created_at"。不给 `status`，就没法在索引里定位起点，只能从头扫到尾（虽然扫的是索引，快一点，但还是全扫）。

> **最左前缀的准确表述：索引可以从最左列开始被连续使用；一旦某个中间列缺失，它右边的列就无法用于定位。**
>
> 另外注意"**范围条件会截断后续列**"：索引 `(a, b, c)` 遇到 `WHERE a=1 AND b>10 AND c=2`，`c` 就用不上索引定位了（`b` 是范围，后面断了）。所以列顺序要按"等值 → 范围 → 排序"来排。

---

## 8. 第二个慢查询：深翻页 OFFSET 900000

回到 4.3 的数字：新索引把深翻页从 1131 ms 压到 110 ms。**但 110 ms 依然是慢查询。**

因为 `OFFSET` 的语义决定了它必须"先数过去，再丢掉"：

```sql
SELECT id, title FROM articles_article
WHERE status = 'published'
ORDER BY is_top DESC, created_at DESC
LIMIT 10 OFFSET 900000;    -- 数据库必须定位并跳过前 90 万行
```

无论索引多完美，`OFFSET 900000` 都要先走过 90 万行。**这是 O(offset) 的固有成本，索引救不了。**

### 8.1 解法：游标分页（keyset pagination）

思路是**不用"第几页"，用"上一页最后一行的位置"**：

```sql
-- 第一页
SELECT id, title, is_top, created_at FROM articles_article
WHERE status = 'published'
ORDER BY is_top DESC, created_at DESC
LIMIT 10;

-- 下一页：把上一页最后一行记作游标 (last_is_top, last_created_at)
SELECT id, title, is_top, created_at FROM articles_article
WHERE status = 'published'
  AND (is_top, created_at) < (?, ?)      -- SQLite 3.15+ / PostgreSQL 支持行值比较
ORDER BY is_top DESC, created_at DESC
LIMIT 10;
```

索引直接定位到游标位置，往后读 10 行。**无论第几页，都是 0.2 ms 量级。** MySQL 8 需要用 `(is_top < ?) OR (is_top = ? AND created_at < ?)` 的展开写法（`ROW(...) < ROW(...)` 在 MySQL 里不能走索引）。

DRF 自带 `CursorPagination`：

```python
# blog_api/settings.py
REST_FRAMEWORK = {
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.CursorPagination",
    "PAGE_SIZE": 10,
}

# articles/views.py
from rest_framework.pagination import CursorPagination

class ArticleCursorPagination(CursorPagination):
    page_size = 10
    ordering = "-created_at"        # 必须是唯一且不变的字段
```

### 8.2 一个诚实的坑：置顶和游标分页天然冲突

`CursorPagination.ordering` **只支持单个字段**，而且要求这个字段**唯一且不变**——因为它把该字段的值当作游标。而我们的列表是 `ORDER BY is_top DESC, created_at DESC`，两个问题：

1. 组合排序，游标分页不支持；
2. `is_top` **会被编辑**（置顶/取消置顶）。一旦某篇文章的 `is_top` 变了，游标就失效——用户翻页时可能看到重复或漏掉的文章。

务实的折中方案：**把置顶文章单独查一次，列表主体用 `created_at` 游标分页。**

```python
# 置顶文章最多几篇，一次查完，不走分页
top_articles = Article.objects.filter(
    status=Article.Status.PUBLISHED, is_top=True
).order_by("-created_at")

# 列表主体：游标分页，游标字段用不可变的 created_at
class ArticleCursorPagination(CursorPagination):
    page_size = 10
    ordering = "-created_at"
```

**为什么不在列表里"合并"两批？** 因为那样分页游标就跨了两个数据集，边界会出错。分成"置顶区 + 分页区"两块渲染，前端也更好做（置顶区本来就是特殊样式）。

> 顺便说一句：**游标分页的代价是失去"跳转到第 N 页"的能力**。如果产品需求是"显示 1/50 页"的页码条，那就得接受 `OFFSET`，转而用第 9 节的办法把 `COUNT` 的成本降下来。**这是一个产品决策，不是纯技术决策。**

---

## 9. COUNT(*) 也是慢查询

DRF 的 `PageNumberPagination` 每页都会执行一次 `COUNT(*)` 来算总数。在 90 万行已发布数据上实测：

```
SELECT count(*) FROM articles_article WHERE status='published'
→ SEARCH articles_article USING COVERING INDEX idx_status_created (status=?)
→ 88.05 ms
```

**88 ms，只为渲染一个"共 128 篇 / 第 1 页"的页码条。**

注意它的执行计划是 `COVERING INDEX`——SQLite 不用读表，只数索引项。这是最好的情况了，但它依然是 O(n)：**要数 90 万个索引项。**

### 9.1 四种应对

| 方案 | 做法 | 适用 |
|---|---|---|
| ① 缓存总数 | `cache.get_or_set("article_count", ...)`，TTL 60s | 最省事，绝大多数博客/内容站够用 |
| ② 不显示总数 | 前端只显示"上一页/下一页" | 配合游标分页，成本直接归零 |
| ③ 用估算值 | MySQL `EXPLAIN` 的 `rows` 列、PG 的 `pg_class.reltuples` | 显示"约 100 篇"，不要求精确 |
| ④ 物化计数 | 单独一张统计表，写入时 `+1` | 计数极频繁且要求精确时 |

本站用的是 ①+② 的组合：列表页不显示精确总数，分类页的文章数用 `annotate(Count(...))` 一次查出（见上一篇）。

### 9.2 一个容易忽略的点：`COUNT(*)` 和 `COUNT(id)` 一样慢

InnoDB 里 `COUNT(*)` 和 `COUNT(id)` 都要选一个最小的可用索引来数，性能差别很小；**真正快的是 `COUNT(1)` 吗？也不是**——它们本质都是"数行数"，没有捷径。**唯一真正的捷径是不数。**

> MySQL 里 `COUNT(*)` 用二级索引比用主键索引快，因为二级索引更小——这是唯一可做的优化：**确保有一个窄的、包含 WHERE 列的索引**。本文的 `(status, is_top DESC, created_at DESC)` 恰好就是这样一个索引。

---

## 10. 索引不是越多越好：写放大与选择性

到这里很容易产生一个冲动："那我给每个字段都建索引不就行了？"

**不行。** 索引的代价有三层：

### 10.1 写放大

每建一个索引，就要多维护一棵 B+ 树：

| 操作 | 1 个索引 | 5 个索引 |
|---|---|---|
| `INSERT` | 写表 + 写 1 棵树 | 写表 + 写 5 棵树 |
| `UPDATE status` | 更新表 + 更新 1 棵树 | 更新表 + 更新 5 棵树 |
| `DELETE` | 删表行 + 删 1 棵树 | 删表行 + 删 5 棵树 |

博客这种读多写少的场景，5 个索引无所谓。但如果是"每秒写入上千条"的业务表，每个多余索引都在实打实地拖慢写入、并占用缓冲池。

### 10.2 选择性（区分度）

**区分度 = 不同值的个数 / 总行数。** 区分度越低，索引越没用。

| 字段 | 不同值 | 100 万行中的区分度 | 建索引有用吗 |
|---|---|---|---|
| `slug` | ~100 万 | ≈ 1.0 | ✅ 极有用（本身就唯一） |
| `created_at` | ~100 万 | ≈ 1.0 | ✅ 有用 |
| `status` | 4 | 0.000004 | ❌ 单独建索引几乎无用 |
| `is_top` | 2 | 0.000002 | ❌ 单独建索引完全无用 |

看我们的索引 `(status, is_top DESC, created_at DESC)`：前两列区分度极低，**整个索引的价值 99.9% 来自最后一列 `created_at`**。前两列的作用不是"过滤"，而是**让索引的物理顺序和 `ORDER BY` 对齐**——这正是本文的主题。

> **所以判断一个索引该不该建，要问两个问题：**
> 1. 它的**最左列**能过滤掉多少行？（选择性）
> 2. 它的**列顺序**能对齐哪个 `ORDER BY`？（有序性）
>
> 两个都答不上来的索引，就是在白付写放大。

### 10.3 存储

63 MB 的表，三个索引加起来让库文件涨到 128 MB。生产环境里索引占用超过数据本身是常态，磁盘和备份成本都要算进去。

### 10.4 怎么找出"没用的索引"

```sql
-- PostgreSQL：直接查索引使用次数
SELECT indexrelname, idx_scan, idx_tup_read
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

MySQL 没有这么直接的视图（`sys.schema_unused_indexes` 需要 performance_schema 开启）。最土也最可靠的办法是：**把所有 `order_by` / `filter` 列出来，逐个和现有索引做匹配，找不到主人的索引就是候选删除对象。**

---

## 11. 方法论：五步定位慢查询

把本文所有动作整理成一套可复用的流程：

| 步骤 | 动作 | 工具 / 命令 |
|---|---|---|
| ① **先量** | 找出最慢的接口和 SQL，别猜 | Django Debug Toolbar、django-silk、Sentry Performance、MySQL slow log + `pt-query-digest` |
| ② **拆账** | 分清是"条数多"还是"单条慢" | `CaptureQueriesContext` 同时给出条数和每条耗时 |
| ③ **看计划** | 拿执行计划，找 `SCAN` / `TEMP B-TREE` | `EXPLAIN QUERY PLAN`（SQLite）/ `EXPLAIN`（MySQL）/ `EXPLAIN ANALYZE`（PG、MySQL 8.0.18+） |
| ④ **改索引或改 SQL** | 优先对齐 `ORDER BY`；其次消除函数包裹、前缀通配、跳过最左列 | 改 `Meta.indexes` + `makemigrations`，或改 queryset |
| ⑤ **用数字验证** | 改前改后各跑一次执行计划和耗时，**必须看到 `TEMP B-TREE` 消失或 `SCAN` 变 `SEARCH`** | 同上，另加 `assertNumQueries` 防回归 |

### 11.1 第 ⑤ 步值得单独立规矩

**性能优化最大的敌人是"感觉快了"。** 本文所有数字都是本地实测，因为：

- 9 篇文章的数据量下，0.18 ms 和 476 ms 都是 0.0x ms，你的眼睛分不出；
- 数据量小的时候，`SCAN` 甚至可能比 `SEARCH` 快（顺序读 vs 随机读）——**你凭体感优化，可能是在优化反方向**。

所以定一条硬规矩：

> **任何性能改动，必须能回答两个问题：改之前的数字是多少？改之后的数字是多少？**
> 答不上来，就不是优化，是改代码。

### 11.2 别忘了回归测试

索引是会被"改回去"的——某天有人给列表页加个新排序，`ORDER BY is_top DESC, created_at DESC, views_count DESC`，你的索引又废了。用断言把性能要求钉在测试里：

```python
# articles/tests/test_query_plan.py
from django.db import connection
from django.test import TestCase
from articles.models import Article


class QueryPlanTests(TestCase):
    """列表页的 SQL 不允许出现全表扫描或额外排序。"""

    def test_list_query_uses_index_without_sort(self):
        qs = Article.objects.filter(status=Article.Status.PUBLISHED)
        sql, params = qs.query.sql_with_params()
        with connection.cursor() as cur:
            cur.execute("EXPLAIN QUERY PLAN " + sql, params)
            plan = " | ".join(row[-1] for row in cur.fetchall())

        self.assertNotIn("TEMP B-TREE", plan, f"排序没走索引，执行计划：{plan}")
        self.assertNotIn("SCAN articles_article", plan, f"发生全表扫描：{plan}")
```

**把执行计划写成测试断言**——这是本文最想推荐的一个实践。它把"性能"从"上线后才发现的问题"变成"提交时就被拦住的问题"。

---

## 12. 上线 Checklist

改索引/改慢查询之前，逐条过一遍：

- [ ] 用 `EXPLAIN` 确认了**改之前的执行计划**，并且记下了数字（耗时 + 扫描行数）
- [ ] 索引列顺序是"**等值列 → 范围列 → 排序列**"
- [ ] `ORDER BY` 的**每一列和方向**都在索引里逐项对齐（含 `DESC`）
- [ ] SQL 里没有**函数包裹**索引列（`__date`、`__lower`、`CAST` 都是重灾区）
- [ ] 没有左侧通配的 `LIKE '%...%'`
- [ ] 没有**跳过最左列**的查询
- [ ] `LIMIT` 配合 `ORDER BY` 时，**排序也必须走索引**（否则 `LIMIT` 只能省传输、不能省计算）
- [ ] 深翻页改用**游标分页**，或明确接受 `OFFSET` 的 O(n) 成本
- [ ] 分页总数有**缓存或估算**，不是每页都 `COUNT(*)`
- [ ] 大表加索引用了**在线 DDL**（MySQL `LOCK=NONE` / PG `CONCURRENTLY`）
- [ ] 改完后 `EXPLAIN` 里 **`TEMP B-TREE` 消失**、`SCAN` 变 `SEARCH`
- [ ] 补了一条**执行计划断言测试**，防止未来被改回去
- [ ] 检查了旧索引还有没有主人，没有就删掉（减少写放大）

---

## 13. 结语

回头看这次的发现，其实只有一句话：

> **索引的价值有两半——一半是"加速查找"，一半是"提供有序性"。大多数人只用了前一半。**

线上那个 `(status, created_at DESC)` 索引，用上了前一半：它把 100 万行过滤到 90 万行，看起来"索引生效了"。但它没用上后一半：`ORDER BY is_top DESC` 那一列不在索引里，于是数据库只能老老实实排 90 万行。

而 `TEMP B-TREE FOR ORDER BY` 这个提示，SQLite 一直都明明白白写在那里。**只是从来没人去看执行计划。**

### 三条带走的清单

> 1. **`ORDER BY` 的每一列和方向，都要在索引里逐项对齐。** 少一列、错一个 `DESC`，就等于没索引——甚至更慢（S2 的 691 ms）。
> 2. **数据量小的时候，索引失效是看不见的。** 想验证索引，就要造数据；想看执行计划，就要 `EXPLAIN`。**别用体感优化数据库。**
> 3. **把执行计划写成测试断言。** 性能不是一次性任务，是每次加字段、加排序、加接口都会回来的慢性病。

上一篇我写"最热的那个接口，往往就是灯下黑的那个"。这一篇的补充是：**灯下黑的地方，不报错、不变红、测试全绿——它只是随着你的数据，一点一点变慢。**

而发现它只需要一行命令。去看执行计划吧。

---

### 附：本文实验脚本

如果你想把本文的数字在自己机器上复现：

```bash
# 1. 看真实执行计划（只读，不改数据；需要 Django，用 backend 的虚拟环境跑）
cd backend && ./venv/bin/python ../tools/explain.py
# Windows 用户：cd backend && ./venv/Scripts/python.exe ../tools/explain.py

# 2. 造 100 万行，跑四组索引对照（纯标准库，不依赖 Django）
python tools/bench_index_order_by.py
python tools/bench_index_order_by.py --rows 200000 --runs 3    # 想快点跑
```

`tools/explain.py` 会直接把有问题的执行计划标出来，比如：

```
=== 文章列表页（模型默认 ordering：-is_top, -created_at） ===
PLAN:
  SEARCH articles_article USING INDEX articles_status_created_idx (status=?)
  USE TEMP B-TREE FOR ORDER BY
  >>> 警告：排序/分组没走索引（TEMP B-TREE）

=== 对照：去掉 is_top 的排序 ===
PLAN:
  SEARCH articles_article USING INDEX articles_status_created_idx (status=?)
```

环境口径：SQLite 3.50.4 / Django 6.0.6 / Python 3.13 / 每条 SQL 7 次取中位数。
两个脚本都在系统临时目录里建临时库，跑完自动删除，**不会碰 `backend/db.sqlite3`**。
