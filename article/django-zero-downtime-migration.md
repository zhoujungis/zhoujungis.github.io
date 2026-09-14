---
title: "上线那一刻，数据库在重建整张表——Django 零停机迁移实战（20 万行实测）"
slug: "django-zero-downtime-migration"
category_id: null
tags: ["Django", "后端", "数据库", "性能优化"]
status: "published"
cover_image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80&auto=format&fit=crop"
---

# 上线那一刻，数据库在重建整张表——Django 零停机迁移实战（20 万行实测）

> 承接《索引建了，为什么排序还是没用上？》《事务回滚了，邮件照样发出去》两篇。上一篇我建议你"给 `(status, is_top DESC, created_at DESC)` 补一条索引"，这一篇讲的就是**那条索引怎么上线**——以及为什么大多数人上线的姿势，会把整张表锁死几十秒。
> 技术栈：Django 6.0.6 + SQLite 3.50.4（与本站线上同栈）；MySQL 8 / PostgreSQL 的对照单独成节。
> 阅读时间：约 40 分钟 | 难度：中高级 | 收获：能提前算出一次 `migrate` 要花多久、锁多久，并且知道哪几种操作可以绕开整表重建

## 前言：一条 `makemigrations` 的代价

上一篇文章的结尾，我给自己留了一个待办：

```python
# backend/articles/models.py  ← 现在的样子（有 bug）
class Article(models.Model):
    class Meta:
        ordering = ["-is_top", "-created_at"]
        indexes = [
            models.Index(fields=["status", "-created_at"], name="articles_status_created_idx"),
        ]
```

`ordering` 是 `["-is_top", "-created_at"]`，索引却是 `["status", "-created_at"]`——**少了 `is_top`，而且方向也不对**。在 100 万行上实测，这条"看起来能用"的索引让首页列表查询慢到了 **476.50 ms**，比不建索引（395.92 ms）还慢；把列和方向全对齐之后是 **0.18 ms**。

修法很简单，改一行：

```python
models.Index(fields=["status", "-is_top", "-created_at"], name="articles_status_top_created_idx"),
```

然后 `makemigrations` + `migrate`。

我本来打算就这么干。但在敲下回车之前，我做了一件更谨慎的事——**先看看这条 migration 到底会翻译成什么 SQL**：

```bash
python manage.py sqlmigrate articles 0007
```

输出让我把手从键盘上拿开了。

因为在这个站上，`makemigrations` 从来不只是"加一条索引"。它会同时发现"模型和数据库对不上"的地方，顺手补一次 `AddField`；而**在 SQLite 上，`AddField` 不是 `ALTER TABLE ADD COLUMN`，是把整张表重建一遍**。

这篇文章要回答的就是这个问题：**一条你以为是"改一行"的 migration，为什么会在上线那一刻把整张表锁死？**

我把整张表的行数灌到 20 万、体积灌到 **789.7 MB**（和本站真实表结构一致，包含 `content` / `html_content` 两个大 TEXT 字段），把每一种 DDL 都跑了一遍。数字比我想的还要难看。

**目录**

- 一、先看清：`sqlmigrate` 把你的 migration 翻译成了什么
- 二、实验一：原始 SQLite 的 `ALTER TABLE ADD COLUMN` 有多快
- 三、实验二：Django 式整表重建——8381 ms，2× 磁盘峰值
- 四、实验三：`CREATE INDEX` 的代价，和它拿的那把写锁
- 五、实验四：DDL 执行期间，写入被挡了多久
- 六、实验五：`DROP COLUMN` 比加列更贵
- 七、体积账：表和索引各占多少（`dbstat` 精确统计）
- 八、读源码：Django 为什么非重建不可
- 九、四种改法，从最省事到最可控
- 十、MySQL 8 / PostgreSQL 的对照表与各自的地雷
- 十一、`lock_timeout`：零停机迁移里最容易被忽略的一行配置
- 十二、Expand / Contract：真正意义上的零停机
- 十三、上线 Checklist
- 结语
- 附录：本文实验脚本

---

## 一、先看清：`sqlmigrate` 把你的 migration 翻译成了什么

`sqlmigrate` 是 Django 里被严重低估的命令。它不连库、不改数据，只把 migration 渲染成 SQL 打印出来。**任何要上线的 migration，都应该先跑一遍这个命令。**

拿本站真实的 migration 链来演示。`0004_article_notification_sent.py` 是一次普通的 `AddField`：

```python
migrations.AddField(
    model_name="article",
    name="notification_sent",
    field=models.BooleanField(default=False),
)
```

看起来很无辜。`sqlmigrate articles 0004` 的输出是这样的：

```sql
BEGIN;
--
-- Add field notification_sent to article
--
CREATE TABLE "new__articles_article" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notification_sent" bool NOT NULL,
    "title" varchar(200) NOT NULL,
    "slug" varchar(200) NOT NULL UNIQUE,
    "content" text NOT NULL,
    "html_content" text NOT NULL,
    "excerpt" text NOT NULL,
    "status" varchar(16) NOT NULL,
    "is_top" bool NOT NULL,
    "views_count" integer unsigned NOT NULL CHECK ("views_count" >= 0),
    "created_at" datetime NOT NULL,
    "updated_at" datetime NOT NULL,
    "category_id" bigint NULL REFERENCES "articles_category" ("id") DEFERRABLE INITIALLY DEFERRED,
    "cover_image" varchar(200) NOT NULL,
    "likes_count" integer unsigned NOT NULL CHECK ("likes_count" >= 0),
    "scheduled_at" datetime NULL
);
INSERT INTO "new__articles_article" ("id", "title", "slug", ... , "scheduled_at", "notification_sent")
SELECT "id", "title", "slug", ... , "scheduled_at", 0 FROM "articles_article";
DROP TABLE "articles_article";
ALTER TABLE "new__articles_article" RENAME TO "articles_article";
CREATE INDEX "articles_article_category_id_633dad2b" ON "articles_article" ("category_id");
COMMIT;
```

**加一个布尔字段，Django 做了四件事：建新表 → 全表拷贝 → 删旧表 → 改名。** 而且是在一个事务里。

对比 `0005_add_indexes.py`，一次 `AddIndex`：

```sql
BEGIN;
--
-- Create index articles_status_created_idx on field(s) status, -created_at of model article
--
CREATE INDEX "articles_status_created_idx" ON "articles_article" ("status", "created_at" DESC);
--
-- Create index articles_scheduled_idx on field(s) scheduled_at of model article
--
CREATE INDEX "articles_scheduled_idx" ON "articles_article" ("scheduled_at");
COMMIT;
```

干净利落，两条 `CREATE INDEX`，不碰数据行。

**所以从这一刻起，你脑子里应该有一条分界线：**

| migration 操作 | SQLite 上的真实 SQL | 是否重建整表 |
|---|---|---|
| `AddIndex` / `RemoveIndex` | `CREATE INDEX` / `DROP INDEX` | 否 |
| `AddField`（可空、无默认值） | `ALTER TABLE ADD COLUMN` | 否 |
| `AddField`（**NOT NULL** / 有默认值） | 建表 + 拷数据 + 删表 + 改名 | **是** |
| `AlterField` | 建表 + 拷数据 + 删表 + 改名 | **是** |
| `RemoveField` | `ALTER TABLE DROP COLUMN`（3.35+）或重建 | 视情况 |
| `RunSQL` | 你写什么就是什么 | 你说了算 |

这张表就是全文的地图。左边是你写的 Python，右边是数据库真正要干的活——**中间隔着一层翻译，而翻译的结果你从来没看过。**

### 1.1 为什么 `sqlmigrate` 必须成为肌肉记忆

因为它能提前告诉你三件事：

1. **会不会重建整表**——看到 `CREATE TABLE "new__..."` 就是重建。
2. **有没有顺带改别的东西**——`makemigrations` 会检测所有模型漂移，你以为只加索引，它可能同时给你补三个 `AlterField`。
3. **能不能在一个事务里跑完**——所有语句都在 `BEGIN;` / `COMMIT;` 之间，意味着**它们要么全成功，要么全回滚**。这听起来是好事，但下面会看到它同时也是坏事。

第二点尤其坑。我原本以为 `makemigrations` 只会生成一条 `AddIndex`，但因为 `models.py` 里索引定义和 `ordering` 不一致，加上之前手改过字段，它实际生成的是一个混合 migration。**先跑 `sqlmigrate`，再决定要不要按下回车。**

---

## 二、实验一：原始 SQLite 的 `ALTER TABLE ADD COLUMN` 有多快

在讲 Django 的 8381 ms 之前，得先知道"标准答案"是多少。

SQLite 从很早就支持 `ALTER TABLE ... ADD COLUMN`，而且它是**纯元数据操作**——只改 `sqlite_schema` 里那行 `CREATE TABLE` 语句，一行数据都不碰。所以理论上它应该和表大小无关。

我在 20 万行（约 50 MB）的表上直接跑原始 SQL，把 SQLite 支持和不支持的形态都试了一遍：

```
sqlite lib version: 3.53.1
  OK   ADD COLUMN nullable (c TEXT)                              7.7 ms
  OK   ADD COLUMN NOT NULL DEFAULT 0 (d INTEGER)                 7.4 ms
  OK   ADD COLUMN NOT NULL DEFAULT '' (e TEXT)                   7.0 ms
  FAIL ADD COLUMN NOT NULL no default (f INTEGER)           OperationalError: Cannot add a NOT NULL column with default value NULL
  FAIL ADD COLUMN non-constant default (g TEXT)             OperationalError: Cannot add a column with non-constant default
  FAIL ADD COLUMN UNIQUE (h TEXT)                           OperationalError: Cannot add a UNIQUE column
  OK   ADD COLUMN CHECK (i INTEGER CHECK(i>=0))                 52.8 ms
  OK   ADD COLUMN REFERENCES (j)                                 7.7 ms
  FAIL ALTER COLUMN / change type (a)                       OperationalError: near "TYPE": syntax error
  OK   ADD CONSTRAINT CHECK (table-level)                       26.3 ms
```

**请重点看第二行。**

```
ADD COLUMN NOT NULL DEFAULT 0   →   7.4 ms   ✅
```

一个 **NOT NULL 带常量默认值** 的列，SQLite 原生支持，耗时 **7.4 ms**，和加一个可空列完全一样。

而 Django 为同样的操作，在同样规模的数据上要花 **8381 ms**（下面实验二）。**差了 1130 倍。**

SQLite 的 `ADD COLUMN` 有三条硬限制，理解了就能理解 Django 为什么要绕路：

1. **不能加 `NOT NULL` 且没有默认值的列。** 因为已有行填不出值——SQLite 拒绝猜。
2. **默认值必须是常量。** `DEFAULT (datetime('now'))` 这种不行，因为常量默认值可以只存在 schema 里，而非恒定默认值必须写进每一行。
3. **不能加 `UNIQUE` 列。** 唯一性需要索引，`ADD COLUMN` 不做这件事。

反过来，`NOT NULL DEFAULT 0` 完全合法：SQLite 会把默认值记在 schema 里，读取旧行时按 schema 补上——**不需要改写任何一行数据。** 这就是 7.4 ms 的来源。

顺带一个反直觉的：`CHECK` 约束是支持的（52.8 ms，略贵是因为要校验存量行）。而 `ALTER COLUMN`（改类型）**根本不支持**，SQLite 没有这个语法——这也是 Django 遇到 `AlterField` 只能重建的原因。

> **一句话总结实验一：** SQLite 本身完全有能力在 7 ms 内加一个 `NOT NULL DEFAULT 0` 的列。接下来要看的，是 Django 为什么偏不这么做。

---

## 三、实验二：Django 式整表重建——8381 ms，2× 磁盘峰值

现在跑 Django 在 SQLite 上遇到 `AddField` 时的真实路径。我把 `sqlmigrate` 打印出的那四步原样执行，在 20 万行 / 789.7 MB 的表上计时：

```
==========================================================================
E2 Django 式整表重建（NOT NULL 列，SQLite 上 AddField 的真实做法）
==========================================================================
  耗时      : 8381.1 ms   ← 全表拷贝 + 全索引重建
  峰值体积  : 1.5 GB（原表 789.7 MB，约 2×）
  期间整张表被独占：读要排队，写要排队
```

三个数字，每个都要命。

### 3.1 8381 ms：时间随表大小线性增长

`INSERT INTO new_... SELECT ... FROM old` 是一次全表扫描 + 全表写入。表越大越慢，**没有上界**。

我这张表是 789.7 MB。你的表可能是 8 GB。那就是 80 秒起步——而且是在一个事务里，全程持锁。

### 3.2 1.5 GB：峰值磁盘是 2×

`CREATE TABLE new` → `INSERT SELECT` → `DROP TABLE old` → `RENAME`。

在 `DROP TABLE` 执行之前，**新旧两张表同时存在**。所以峰值磁盘 = 原表 × 2 + 索引。原表 789.7 MB，峰值 1.5 GB。

这一条在共享主机上会直接变成事故：PythonAnywhere 免费档的磁盘配额是 512 MB。**如果数据库已经 400 MB，这次 migration 会在写到一半时因为磁盘满而失败**——而它在一个事务里，失败会回滚，但磁盘上的临时数据要等 SQLite 自己清理，期间站点可能已经 500 了。

### 3.3 "整张表被独占"

这是最容易被忽略、也最致命的一条。

整个重建过程跑在一个**写事务**里。SQLite 的锁模型是数据库级的（不是行级、不是表级）：一旦开始写，其他连接**不能写**；在回滚日志模式下，**读也要排队**。

意味着在 8381 ms 里：

- 任何一个 `INSERT` / `UPDATE` / `DELETE` 都在等锁；
- 任何一个 `SELECT`（在非 WAL 模式下）也在等锁；
- Django 每个请求的 `save()` 都会卡住，请求超时、连接池耗尽、Web 进程被占满。

**用户看到的不是"慢"，是"站点挂了"。**

> 这就是本文标题的由来：**上线那一刻，数据库在重建整张表。** 而 `git push` 的那个人，看到的只是 `Applying articles.0007... OK`。

---

## 四、实验三：`CREATE INDEX` 的代价，和它拿的那把写锁

回到我最初想做的事——加一条索引。这个操作**不会重建表**，但不代表它免费：

```
==========================================================================
E3 CREATE INDEX（上一篇那条索引）
==========================================================================
  耗时      : 1594.0 ms
  索引体积  : 7.4 MB
```

1594 ms，索引本身 7.4 MB。对 20 万行来说这个代价是合理的——`CREATE INDEX` 要扫全表、排序、写 B+ 树，复杂度是 O(n log n)。

但重点是它**同样需要写事务**。在 SQLite 上，`CREATE INDEX` 期间：

- 写入被阻塞（下面的实验四会量化）；
- 在回滚日志模式下，读取也被阻塞；**在 WAL 模式下，读可以继续**。

所以第一条实用建议来了：

> **如果你的 SQLite 库还在用默认的回滚日志模式，先把 `PRAGMA journal_mode=WAL` 打开。** 它不能让写不阻塞，但能让**读**在 DDL 和长写事务期间继续服务——对一个读多写少的博客来说，这一条就把"整站挂掉"降级成了"发布文章会慢一点"。

WAL 的代价是会产生 `-wal` 和 `-shm` 两个附属文件，且网络文件系统（NFS）上不可靠——但在单机部署上是净收益。

---

## 五、实验四：DDL 执行期间，写入被挡了多久

上面说"被阻塞"，得给个数字。我开了一个后台线程，在 `CREATE INDEX` 进行的同时不停地 `INSERT`，测每次写入的耗时：

```
==========================================================================
E4 DDL 期间，并发写入被阻塞多久
==========================================================================
  基线（无 DDL 竞争）INSERT : 181.1 ms
  DDL 期间 INSERT          : 1324.5 ms  ← 被写锁挡住，等 DDL 做完
  本次 CREATE INDEX 总耗时 : 1456.2 ms
```

基线的 181 ms 是我这个探针脚本里 200 次插入的总时间（脚本用的批处理，所以单次看起来慢，这里只看比例）。关键是比例：

**DDL 期间，写入延迟变成了基线的 7.3 倍**，而且 1324.5 ms 这个数字几乎等于 DDL 的总耗时 1456.2 ms。

这说明什么？说明那条 `INSERT` **不是在"变慢"，是在"等"**——它一直阻塞到 DDL 拿到锁、做完、释放锁，然后才执行。

这个模式有一个非常危险的变体，值得单独讲：

### 5.1 锁队列堆积（lock queue pile-up）

假设 DDL 要跑 10 秒。在这 10 秒内：

- 第 1 秒来了 5 个写请求，全部排队等锁；
- 第 2 秒又来 5 个，继续排；
- ……
- 第 10 秒，队列里堆了 50 个请求。

DDL 结束时，这 50 个请求会**一起**涌向数据库。瞬时并发从 0 跳到 50，SQLite 会开始报 `database is locked`（因为默认 `timeout` 只有 5 秒，排在后面的请求等不到就报错了）。

**所以真正杀死站点的往往不是 DDL 本身，而是 DDL 结束后那一波反压。** 这也是 PostgreSQL 里 `lock_timeout` 存在的理由——后面第十一节会展开。

---

## 六、实验五：`DROP COLUMN` 比加列更贵

顺带测了删除列。SQLite 3.35+ 宣称支持 `ALTER TABLE DROP COLUMN`，所以理论上应该和 `ADD COLUMN` 一样是元数据操作：

```
==========================================================================
E5 ALTER TABLE DROP COLUMN
==========================================================================
  ADD COLUMN   : 1.8 ms
  DROP COLUMN  : 1864.4 ms   ← SQLite 3.35+ 仍然是整表重建
```

**1.8 ms vs 1864.4 ms。**

加列是元数据操作，删列却是整表重建。原因是 `DROP COLUMN` 在 SQLite 内部就是**改写每一条记录**——SQLite 的行是紧凑存储的，去掉一列必须重排所有行。

更糟的是，SQLite 的 `DROP COLUMN` 有一堆限制，触发任何一个都会 fallback 到重建：

- 列上有索引 → 不支持；
- 列是 `PRIMARY KEY` 或 `UNIQUE`；
- 列出现在 `CHECK` / 外键 / 生成列表达式里；
- 列是 `VIEW` 引用的对象。

**所以 `RemoveField` 在 SQLite 上几乎总是整表重建。** 这直接影响第十二节的"Contract 阶段"——删列不能等到最后随便删，得当成一次正式的表重建来规划。

---

## 七、体积账：表和索引各占多少（`dbstat` 精确统计）

"索引占多少空间"这个问题，用文件大小是答不出来的（SQLite 的页是混在一起的）。正确工具是 **`dbstat` 虚拟表**——它逐页报告每个对象占用的字节数：

```sql
SELECT name, SUM(pgsize) AS bytes FROM dbstat GROUP BY name ORDER BY bytes DESC;
```

结果：

```
==========================================================================
E6 体积账：表 vs 索引（dbstat 精确统计）
==========================================================================
  文件大小 : 1.5 GB
  逻辑合计 : 804.3 MB
    articles_article                         783.2 MB   97.4%
    articles_status_top_created_idx            7.4 MB    0.9%
    articles_status_created_probe_idx          7.2 MB    0.9%
    sqlite_autoindex_articles_article_1        4.7 MB    0.6%
    articles_article_category_id_idx           1.8 MB    0.2%
    sqlite_schema                              4.0 KB    0.0%
    sqlite_sequence                            4.0 KB    0.0%
```

（注意"文件大小 1.5 GB"和"逻辑合计 804.3 MB"的差异——这是实验二重建时留下的空闲页，SQLite 不会主动还给操作系统，需要 `VACUUM`。**又是一条运维知识点：重建之后记得 `VACUUM`，否则磁盘白占一倍。**）

这张表最有价值的信息是：**表本体占了 97.4%，索引加起来不到 2%。**

于是两个结论：

**结论一：索引不是空间问题。** 7.4 MB 的索引换 0.18 ms 的查询，这笔账怎么算都划算。上一篇说过"索引有写放大代价"，但那是在说**写性能**，不是在说**空间**。用"占空间"当借口不建索引，是站不住脚的。

**结论二：真正的空间问题在 `content` / `html_content` 两个大 TEXT 字段。** 783 MB 里绝大部分是文章正文和渲染后的 HTML。这解释了两件事：

- 为什么整表重建要 8381 ms——拷贝的就是这 783 MB；
- 为什么**任何**重建都是昂贵的，和加几个字段无关。

> **推论：** 如果正文和渲染 HTML 是瓶颈，那把它们拆到独立的 `article_body` 表里（一对一），能让 `articles_article` 这个"热表"瘦到几十 MB——**之后所有的 migration 都会快一个数量级。** 这是一次性的架构投资，收益是终身的。这也是我接下来要在这个站上做的事。

---

## 八、读源码：Django 为什么非重建不可

现在回答那个最关键的问题：SQLite 明明 7.4 ms 能加一个 `NOT NULL DEFAULT 0` 的列，Django 为什么非要花 8381 ms？

答案在 `django/db/backends/sqlite3/schema.py`，`DatabaseSchemaEditor.add_field`，第 298 行起：

```python
def add_field(self, model, field):
    """Create a field on a model."""
    from django.db.models.expressions import Value

    # Special-case implicit M2M tables.
    if field.many_to_many and field.remote_field.through._meta.auto_created:
        self.create_model(field.remote_field.through)
    elif isinstance(field, CompositePrimaryKey):
        return
    elif (
        # Primary keys and unique fields are not supported in ALTER TABLE
        # ADD COLUMN.
        field.primary_key
        or field.unique
        or not field.null
        # Fields with default values cannot by handled by ALTER TABLE ADD
        # COLUMN statement because DROP DEFAULT is not supported in
        # ALTER TABLE.
        or self.effective_default(field) is not None
        # Fields with non-constant defaults cannot by handled by ALTER
        # TABLE ADD COLUMN statement.
        or (field.has_db_default() and not isinstance(field.db_default, Value))
    ):
        self._remake_table(model, create_field=field)
    else:
        super().add_field(model, field)
```

读懂这个 `or` 链，就理解了整件事。触发重建的条件是**任意一条**成立：

| 条件 | 什么时候触发 | 合理吗 |
|---|---|---|
| `field.primary_key` | 加主键 | 合理 |
| `field.unique` | 加唯一字段 | 合理（SQLite 限制） |
| **`not field.null`** | **字段是 NOT NULL** | ⚠️ 见下 |
| `self.effective_default(field) is not None` | 字段有 Django 层 `default=` | ⚠️ 见下 |
| `field.has_db_default() and not isinstance(field.db_default, Value)` | `db_default` 是表达式而非常量 | 合理 |

**前两条和最后一条都合理。问题出在中间两条。**

### 8.1 `not field.null`：NOT NULL 不等于必须重建

注释里写的理由是"`ADD COLUMN` 不支持 `NOT NULL`"。但这个说法**不完整**——SQLite 不支持的是**没有默认值的** `NOT NULL`。刚才实验一已经证明，`NOT NULL DEFAULT 0` 是 7.4 ms 就能做完的。

Django 之所以一刀切，是因为它要处理**通用情况**：`null=False` 且没有默认值的字段，`ALTER TABLE ADD COLUMN` 确实做不到。于是 Django 选择了保守策略——**只要 `null=False`，就重建**，不去细分"有没有常量默认值"。

代价就是你看到的：**1130 倍的性能差。**

### 8.2 `effective_default(field) is not None`：`default=` 的隐藏成本

这一条更值得警惕。Django 的注释解释了原因：

> Fields with default values cannot by handled by ALTER TABLE ADD COLUMN statement because **DROP DEFAULT is not supported in ALTER TABLE**.

Django 的行为是：加字段时把默认值写进 DDL，加完之后**再 `ALTER TABLE ... ALTER COLUMN ... DROP DEFAULT`** 把默认值去掉（因为 Django 认为默认值应该只在 Python 层，不该留在数据库里）。

但 SQLite **没有 `ALTER COLUMN` 语法**（实验一最后一行证实了）。既然"加完再删默认值"做不到，Django 就退而求其次：**重建整表，且不在 DDL 里写默认值。**

所以：

```python
# 触发重建（因为 default=False → effective_default 不为 None）
models.BooleanField(default=False)

# 也触发重建（因为 null=False）
models.BooleanField()

# 不触发重建 —— 可空、无默认值
models.BooleanField(null=True)
```

**你在模型里加一句 `default=False`，就买到了一次 8381 ms 的整表重建。** 这个代价，`makemigrations` 不会告诉你。

### 8.3 `db_default=Value(0)` 也救不了你

Django 5.0 引入了真正的数据库层默认值 `db_default`，看起来正是为这个场景设计的：

```python
models.PositiveSmallIntegerField(db_default=Value(0))
```

看条件链的最后一环：`field.has_db_default() and not isinstance(field.db_default, Value)`。用 `Value(0)` 时，`isinstance(...)` 为真，这一环**不**触发。

但前面 `not field.null` 那一环**先短路了**。字段是 `null=False`，第一个成立的 `or` 就把控制流送进了 `_remake_table`。

> **结论：在 SQLite 上，`db_default` 无法避免 `AddField` 的整表重建。** 这个判断我是读了源码才敢下的——文档里没写。

---

## 九、四种改法，从最省事到最可控

知道了原因，就能设计绕路方案。按"改动量从小到大"排列。

### 方案 A：把列设计成可空（最省事，但要求你诚实）

如果这个字段真的允许为空，那就写 `null=True`：

```python
class Migration(migrations.Migration):
    dependencies = [("articles", "0006_articlelike")]
    operations = [
        migrations.AddField(
            model_name="article",
            name="reading_minutes",
            field=models.PositiveSmallIntegerField(null=True),
        ),
    ]
```

`null=True` 且无默认值 → 条件链全不成立 → 走 `super().add_field()` → 真正的 `ALTER TABLE ADD COLUMN` → **毫秒级**。

**代价：** 业务上这个字段可能不该为空。如果它逻辑上必填，你就在数据库里留了个谎言——以后每个查询都要处理 `None`。**只在字段确实可空时用。**

### 方案 B：`SeparateDatabaseAndState` + 原始 DDL（推荐）

这是 Django 官方为"数据库操作和状态操作不一致"设计的机制。核心思路：**让 Django 的状态机以为字段是正常加的，但让数据库执行你手写的、便宜的 DDL。**

```python
from django.db import migrations, models

class Migration(migrations.Migration):
    dependencies = [("articles", "0006_articlelike")]

    operations = [
        migrations.SeparateDatabaseAndState(
            # 告诉 Django 的"模型状态"：这个字段存在了
            state_operations=[
                migrations.AddField(
                    model_name="article",
                    name="reading_minutes",
                    field=models.PositiveSmallIntegerField(default=0),
                ),
            ],
            # 告诉数据库：用最便宜的方式真的加上它
            database_operations=[
                migrations.RunSQL(
                    sql=(
                        "ALTER TABLE articles_article "
                        "ADD COLUMN reading_minutes integer unsigned NOT NULL DEFAULT 0"
                    ),
                    reverse_sql=(
                        "ALTER TABLE articles_article DROP COLUMN reading_minutes"
                    ),
                ),
            ],
        ),
    ]
```

同样的操作，从 8381 ms 降到 **7.4 ms**。

**三个必须注意的点：**

1. **`state_operations` 里的字段定义必须和 `models.py` 完全一致。** 否则下次 `makemigrations` 会检测到漂移，又生成一条 `AlterField`——等于绕了一圈回到原点。`default=0` 和 SQL 里的 `DEFAULT 0` 要对得上。
2. **原始 SQL 不可移植。** `integer unsigned` 是 SQLite 方言，MySQL 用 `INT UNSIGNED`，PostgreSQL 用 `integer`。跨库项目要用 `RunPython` 配合 `schema_editor.connection.vendor` 分支。
3. **`RunSQL` 不走 `schema_editor`。** 这意味着它不会处理引号、不会做后端抽象、也不会自动加事务包裹——**你得自己保证 SQL 是对的**。上线前务必在库的副本上跑一遍。

跨库的写法大致是这样：

```python
def add_column(apps, schema_editor):
    vendor = schema_editor.connection.vendor
    ddl = {
        "sqlite": "ALTER TABLE articles_article ADD COLUMN reading_minutes integer unsigned NOT NULL DEFAULT 0",
        "mysql": "ALTER TABLE articles_article ADD COLUMN reading_minutes INT UNSIGNED NOT NULL DEFAULT 0, ALGORITHM=INSTANT",
        "postgresql": "ALTER TABLE articles_article ADD COLUMN reading_minutes smallint NOT NULL DEFAULT 0",
    }[vendor]
    schema_editor.execute(ddl)
```

### 方案 C：接受重建，但选一个没人的时间，并且先演练

如果字段确实必须 `NOT NULL` 且没有合理默认值（比如"必须人工回填的数据"），重建可能避不开。那就把它当成一次**正式变更**：

1. **在库的副本上跑一遍**，计时。用 `cp db.sqlite3 /tmp/probe.sqlite3`，改 `DATABASES` 指向副本，跑 `migrate`。
2. **把实测耗时 × 3 当作预算**（生产环境通常更慢：更多行、更多索引、磁盘更忙）。
3. **先备份。** `sqlite3 db.sqlite3 ".backup /path/to/backup.sqlite3"`——注意用 `.backup` 命令而不是 `cp`，因为 `.backup` 能正确处理正在被写入的库。
4. **维护窗口内执行，并且停掉写入。** 让 Web 进程先停（PythonAnywhere 上就是关掉 Web App），跑完 `migrate`，再 `VACUUM`，再启动。
5. **重建后立刻 `VACUUM`**，把实验二留下的 2× 空闲页还给磁盘。

### 方案 D：从架构上消灭重建（长期投资）

第七节的体积账已经指明了方向：**783 MB 里绝大部分是正文 TEXT。** 把 `content` / `html_content` / `excerpt` 拆到独立的 `article_body` 表：

```python
class ArticleBody(models.Model):
    article = models.OneToOneField(Article, on_delete=models.CASCADE, related_name="body")
    content = models.TextField()
    html_content = models.TextField()
    excerpt = models.TextField()
```

之后 `articles_article` 只剩元数据（标题、slug、状态、时间戳），大概几十 MB。**之后所有的 migration 都会快一个数量级**，因为要拷贝的东西少了一个数量级。

代价是每次取文章正文要多一次 JOIN（或者 `select_related("body")`）。对详情页来说这完全可接受——列表页根本不读正文，反而更快了。

> **这是本文最值得带走的一条：** 与其反复优化 migration，不如让表本身变小。**表的体积是迁移成本的地基。**

---

## 十、MySQL 8 / PostgreSQL 的对照表与各自的地雷

SQLite 是本站的栈，但原理换个库就变。三个库在"加列"这件事上的差异大到必须分开记：

| 操作 | SQLite | MySQL 8.0.12+ | PostgreSQL 11+ |
|---|---|---|---|
| 加可空列 | 元数据，~7 ms | `ALGORITHM=INSTANT`，元数据 | 元数据 |
| 加 `NOT NULL DEFAULT <常量>` | 原生支持，~7 ms；**Django 却重建** | `INSTANT`，元数据 | 元数据（PG 11+ 优化） |
| 加 `NOT NULL` 无默认值 | 不支持 | `INSTANT` + 全表校验 | 需 `CHECK NOT VALID` + `VALIDATE` |
| 加索引 | `CREATE INDEX`，阻塞写 | `ALGORITHM=INPLACE, LOCK=NONE` | `CREATE INDEX CONCURRENTLY` |
| 删列 | 整表重建 | `ALGORITHM=INSTANT` | 元数据（标记删除） |
| 改列类型 | 不支持 | 视情况 `INPLACE` / `COPY` | 视情况 `INPLACE` / 重写 |
| Django 会自动用在线 DDL 吗 | 不适用 | **不会**，需 `RunSQL` | 需显式 `AddIndexConcurrently` |

### 10.1 MySQL：INSTANT 是真香，但 Django 不会替你加

MySQL 8.0.12 起，`ADD COLUMN` 支持 `ALGORITHM=INSTANT`——**纯元数据，秒回**。但 Django 的 MySQL 后端**不会自动带上这个 hint**，你必须在 `RunSQL` 里自己写：

```sql
ALTER TABLE articles_article
  ADD COLUMN reading_minutes INT UNSIGNED NOT NULL DEFAULT 0,
  ALGORITHM=INSTANT;
```

**地雷：`INSTANT` 只在列被加到"表的末尾"时才生效。** 如果你想插到中间（`AFTER created_at`），就退回 `COPY` 算法——整表重建。**所以永远把新列加到最后。**

### 10.2 PostgreSQL：`CONCURRENTLY` 与 `atomic = False`

PostgreSQL 的 `CREATE INDEX CONCURRENTLY` 是真正的在线建索引：不阻塞写。但它有一个硬限制——**不能在事务里运行**。

而 Django 的 migration **默认跑在事务里**。所以你必须：

```python
class Migration(migrations.Migration):
    atomic = False          # ← 关键，否则 CONCURRENTLY 直接报错
    dependencies = [("articles", "0006_articlelike")]
    operations = [
        migrations.RunSQL(
            "CREATE INDEX CONCURRENTLY articles_status_top_created_idx "
            "ON articles_article (status, is_top DESC, created_at DESC)",
            reverse_sql="DROP INDEX CONCURRENTLY articles_status_top_created_idx",
        ),
    ]
```

Django 也提供了开箱即用的封装：

```python
from django.contrib.postgres.operations import AddIndexConcurrently

class Migration(migrations.Migration):
    atomic = False
    operations = [
        AddIndexConcurrently(
            model_name="article",
            index=models.Index(
                fields=["status", "-is_top", "-created_at"],
                name="articles_status_top_created_idx",
            ),
        ),
    ]
```

**地雷：`atomic = False` 意味着这个 migration 失去了原子性。** 如果它在第 3 步失败，前 2 步**不会回滚**。而且 `CREATE INDEX CONCURRENTLY` 失败会留下一个 `INVALID` 状态的索引——它不会被查询使用，但会拖慢写入。**必须手动 `DROP INDEX` 再重试。**

### 10.3 PostgreSQL：`NOT NULL` 的两步法

PG 上加一个 `NOT NULL` 列会全表扫描校验。想零停机就拆成两步：

```sql
-- 第 1 步：加约束但先不校验（瞬间完成，只拿 ACCESS EXCLUSIVE 一小会儿）
ALTER TABLE articles_article
  ADD CONSTRAINT article_reading_minutes_not_null
  CHECK (reading_minutes IS NOT NULL) NOT VALID;

-- 第 2 步：校验（只拿 SHARE UPDATE EXCLUSIVE，不阻塞写）
ALTER TABLE articles_article VALIDATE CONSTRAINT article_reading_minutes_not_null;
```

PG 12+ 还有一个优化：如果存在一个已 `VALIDATE` 的 `CHECK (col IS NOT NULL)` 约束，`SET NOT NULL` 会**跳过全表扫描**。

---

## 十一、`lock_timeout`：零停机迁移里最容易被忽略的一行配置

前面第五节的"锁队列堆积"是 DDL 最阴的杀手。它在 PostgreSQL 上有个专门的解法，只有一行：

```sql
SET lock_timeout = '3s';
```

原理是这样的。在 PostgreSQL 里，`ALTER TABLE` 要拿 `ACCESS EXCLUSIVE` 锁。这个锁**和所有其他锁都冲突**。于是：

1. DDL 请求进入锁队列，等前面的事务释放锁；
2. **而它一旦在队列里，后面所有的 `SELECT` 也全部排在它后面**——因为 PostgreSQL 的锁队列是**严格 FIFO** 的，后到的读不能越过等待中的排他锁。

结果：一个跑了 60 秒的慢查询，能让后面一个 `ALTER TABLE` 排队 60 秒，**而这个 `ALTER TABLE` 又让后面 60 秒内所有的普通查询全部排队**。一个 DDL，把整站拖死。

`lock_timeout = '3s'` 的效果是：DDL 等 3 秒拿不到锁就**自己失败退出**，不再堵住队列。你可以稍后重试。

**这个配置在 SQLite 上对应的是 `PRAGMA busy_timeout`**，但语义不同——SQLite 没有 FIFO 锁队列（它是数据库级锁，更粗暴），`busy_timeout` 只是控制"等不到锁时重试多久"。对 SQLite，更实际的做法是：

```sql
PRAGMA busy_timeout = 10000;   -- 10 秒，给 DDL 留出空间
PRAGMA journal_mode = WAL;     -- 读不被写阻塞
```

在 Django 里给每个连接自动设上，用 `connection_created` 信号：

```python
from django.db.backends.signals import connection_created

@receiver(connection_created)
def set_sqlite_pragmas(sender, connection, **kwargs):
    if connection.vendor != "sqlite":
        return
    with connection.cursor() as cursor:
        cursor.execute("PRAGMA journal_mode=WAL;")
        cursor.execute("PRAGMA busy_timeout=10000;")
        cursor.execute("PRAGMA synchronous=NORMAL;")
```

> **注意 `synchronous=NORMAL`**：WAL 模式下它依然保证崩溃一致性（只是断电可能丢最后一个事务），但对写性能有数量级提升。对博客这种场景，这个取舍是合理的。

---

## 十二、Expand / Contract：真正意义上的零停机

前面讲的都是"怎么让单个 DDL 更快"。但真正的零停机迁移，靠的不是快的 DDL，而是**把一次危险的变更拆成多次安全的变更**。

这套模式叫 **Expand / Contract**（也叫 Parallel Change）。核心约束只有一条：

> **任何时刻，正在运行的代码和正在运行的数据库 schema 必须互相兼容。**

因为部署不是原子的：你 `git push` 之后，新旧代码会**同时**存在一段时间（多个 worker、滚动重启、CDN 缓存）。如果 migration 已经删了列，而老代码还在读它——500。

### 一个真实的例子：给 `Article` 加 `reading_minutes` 并回填

假设要新增一个字段，且**必须 NOT NULL**。分五个发布：

**发布 1（Expand）：加可空列 + 并发建索引**

```python
migrations.SeparateDatabaseAndState(
    state_operations=[migrations.AddField(
        model_name="article", name="reading_minutes",
        field=models.PositiveSmallIntegerField(null=True),
    )],
    database_operations=[migrations.RunSQL(
        "ALTER TABLE articles_article ADD COLUMN reading_minutes integer unsigned NULL",
        reverse_sql="ALTER TABLE articles_article DROP COLUMN reading_minutes",
    )],
)
```

这一阶段老代码完全不受影响——它不知道这个列存在。**毫秒级完成，零锁。**

**发布 2：部署"双写"代码**

```python
# 新代码同时写两边；读还是读旧字段
def save(self, *args, **kwargs):
    if self.reading_minutes is None:
        self.reading_minutes = estimate_reading_minutes(self.content)
    super().save(*args, **kwargs)
```

**发布 3：回填历史数据（分批，不要在 migration 里做）**

```python
# 写成管理命令，分批跑，每批之间 sleep，避免长时间持锁
class Command(BaseCommand):
    def add_arguments(self, parser):
        parser.add_argument("--batch-size", type=int, default=200)

    def handle(self, *args, **options):
        size = options["batch_size"]
        qs = Article.objects.filter(reading_minutes__isnull=True)
        while True:
            batch = list(qs.values_list("pk", "content")[:size])
            if not batch:
                break
            for pk, content in batch:
                Article.objects.filter(pk=pk).update(
                    reading_minutes=estimate_reading_minutes(content)
                )
            self.stdout.write(f"backfilled {len(batch)}")
            time.sleep(0.05)      # 让出锁，别把站堵死
```

**关键：回填不要写成 `RunPython`。** migration 跑在事务里，回填 10 万行就是 10 万行的一个事务——和整表重建一样糟，而且失败要全部重来。**用管理命令，分批提交。**

**发布 4：部署"读新字段"代码**

```python
# 现在读 reading_minutes，双写可以撤掉了
```

**发布 5（Contract）：收紧约束**

```python
migrations.RunSQL(
    "ALTER TABLE articles_article ADD CONSTRAINT ... CHECK (reading_minutes IS NOT NULL) NOT VALID",
    # 然后 VALIDATE CONSTRAINT（PG）；SQLite 上则是一次重建，得挑时间
)
```

如果确定不会再回滚，最后才删旧列——**而且最好再等一个发布周期**。删列是不可逆的。

### 12.1 判断"能不能安全回滚"的简单方法

问自己一个问题：

> **如果我在 migration 之后立刻回滚代码，老代码还能跑吗？**

- 加列（可空）→ 能。老代码忽略新列。✅
- 加索引 → 能。✅
- 删列 → **不能**。老代码会 `no such column`。❌
- 改列类型 → 通常不能。❌
- 加 NOT NULL 约束 → 取决于新代码是否已经保证有值。⚠️

**能安全回滚的操作可以随时上线。不能的，必须走 Expand / Contract。**

---

## 十三、上线 Checklist

我把这一节写成可以贴在显示器上的形式。**任何一次 `migrate` 之前，逐条过一遍。**

**执行前**

- [ ] 跑 `python manage.py sqlmigrate <app> <migration>`，确认有没有 `CREATE TABLE "new__..."`
- [ ] 跑 `python manage.py migrate --plan`，确认这次会应用哪些 migration（可能不止你写的那一个）
- [ ] 在**库的副本**上实测一次，记录耗时
- [ ] 备份：`sqlite3 db.sqlite3 ".backup backup.sqlite3"`（用 `.backup`，不要 `cp`）
- [ ] 算磁盘：库体积 × 2 够不够？不够就先清理
- [ ] 确认 `PRAGMA journal_mode=WAL` 已开启

**执行中**

- [ ] 有重建操作时，先停 Web 进程（PythonAnywhere：关掉 Web App）
- [ ] `migrate` 用 `--no-input`，不要在自动化里等交互
- [ ] 多 worker 环境**只在一个地方跑 `migrate`**，别让每个 worker 启动时各跑一次

**执行后**

- [ ] `VACUUM`，把重建留下的空闲页还给磁盘
- [ ] `python manage.py check --database default`
- [ ] 打开站点，手动验证列表页 / 详情页 / 后台
- [ ] 确认响应时间没有退化（对比 DDL 前的基线）

**长期**

- [ ] 把正文 TEXT 拆到独立表，让热表瘦下来
- [ ] 任何"加 NOT NULL 字段"的需求，先问：能不能可空？能不能走 `SeparateDatabaseAndState`？
- [ ] 把 `sqlmigrate` 写进 CI，让危险的 migration 在合并前就暴露

---

## 结语：`migrate` 是一条 `git push`，但它改的是磁盘上的 783 MB

写这篇之前，我对 migration 的心理模型是"改 schema 的代码"。写完之后，模型变成了：

> **`migrate` 是一条 `git push`，但它改的是磁盘上的 783 MB，而且过程中要独占整张表。**

这个转变的关键，是**把 Python 和 SQL 之间的那层翻译打开看一眼**。`AddField` 看起来是"加个字段"，`sqlmigrate` 告诉你是"重建整张表"。这中间的落差，就是事故的全部空间。

三个数字，是这篇文章想留下的东西：

- **7.4 ms** —— SQLite 原生加一个 `NOT NULL DEFAULT 0` 的列，真实成本
- **8381 ms** —— Django 为同一个操作付出的成本
- **1130×** —— 两者之间的差距，全部来自 `schema.py` 里一个 `or not field.null`

而这三个数字，在只有 9 篇文章的库上，你**永远看不出来**。9 行的表重建一次大概 1 毫秒，`sqlmigrate` 打印出的 `CREATE TABLE new__...` 你也不会多看一眼。

**这才是迁移最阴的地方——它在你的开发机上永远是安全的，只在数据长起来之后的某一次上线，突然变成一次事故。**

上一篇我留下了一个待办：修 `models.py` 里那条索引。现在我知道该怎么修了——不是直接 `makemigrations`，而是先 `sqlmigrate` 看一眼，确认它不会顺带触发一次整表重建；如果会，就拆成 `AddIndex` 和 `SeparateDatabaseAndState` 两步。

**先看 SQL，再按回车。**

---

## 附录：本文实验脚本

| 脚本 | 作用 |
|---|---|
| [`tools/bench_migration.py`](https://github.com/zhoujungis/zhoujungis.github.io/blob/master/tools/bench_migration.py) | 本文全部实测：E1 加列 / E2 整表重建 / E3 建索引 / E4 DDL 阻塞 / E5 删列 / E6 `dbstat` 体积账 |
| [`tools/explain.py`](https://github.com/zhoujungis/zhoujungis.github.io/blob/master/tools/explain.py) | 上一篇的脚本：打印 queryset 的 SQL 与 `EXPLAIN QUERY PLAN` |
| [`tools/bench_transaction.py`](https://github.com/zhoujungis/zhoujungis.github.io/blob/master/tools/bench_transaction.py) | 上一篇的脚本：并发丢失更新 / `save()` vs `update()` / `on_commit` |

复现本文数据：

```bash
# 默认 20 万行 / 约 790 MB，跑完约 30 秒
python tools/bench_migration.py

# 想更快跑完，减少行数（数字会等比例变化）
python tools/bench_migration.py --rows 50000
```

脚本用临时库，**不会碰你的 `db.sqlite3`**。

---

**系列文章**

1. [从 21 条 SQL 到 2 条：三次 N+1 查询围剿实录](/article/django-n1-query-kill/)
2. [索引建了，为什么排序还是没用上？——Django 慢查询与索引实战（100 万行实测）](/article/django-slow-query-index-tuning/)
3. [事务回滚了，邮件照样发出去——Django 事务深水区](/article/django-transaction-atomic-on-commit/)
4. **上线那一刻，数据库在重建整张表——Django 零停机迁移实战（本篇）**
