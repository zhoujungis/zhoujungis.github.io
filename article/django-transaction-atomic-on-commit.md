---
title: "事务回滚了，邮件照样发出去——Django 事务深水区：atomic、on_commit 与 F() 表达式（含并发实测）"
slug: "django-transaction-atomic-on-commit"
category_id: null
tags: ["Django", "后端", "数据库", "性能优化"]
status: "published"
cover_image: "https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=1200&q=80&auto=format&fit=crop"
---

# 事务回滚了，邮件照样发出去——Django 事务深水区：atomic、on_commit 与 F() 表达式（含并发实测）

> 承接《Redis 分布式锁》与《索引建了，为什么排序还是没用上》两篇，"并发三件套"的最后一篇。
> 技术栈：Django 6.0.6 + SQLite 3.50.4（与本站同栈），MySQL 8 / PostgreSQL 差异处会单独标注。
> 阅读时间：约 30 分钟 | 难度：中高级 | 收获：能把"事务、并发、副作用"三件事一次性想明白，并写出经得起并发的代码

## 前言：一场邮件事故

写这篇之前，我重新读了一遍站上的代码，在 `backend/articles/signals.py` 里看到这样一段（为了行文有删节）：

```python
@receiver(post_save, sender=Article)
def notify_subscribers_on_publish(sender, instance, created, **kwargs):
    if instance.status != Article.Status.PUBLISHED:
        return
    if instance.notification_sent:
        return

    # ... 准备 subject、plain_body ...

    for sub in subscribers_qs.iterator(chunk_size=200):
        batch.append((subject, plain_body, from_email, [sub.email]))
        if len(batch) >= batch_size:           # 一批 50 封
            send_mass_mail(batch, ...)         # 同步 SMTP，阻塞
            Article.objects.filter(pk=instance.pk).update(notification_sent=True)
```

它做了一件正确的事——用 `notification_sent` 字段做幂等开关——但同时做了两件**结构性有问题**的事：

1. **在 `post_save` 信号里同步群发邮件。** 一封邮件几百毫秒，一批 50 封，订阅者上千时这次 `save()` 要把 HTTP 请求拖住几十秒。信号是同步执行的，没人拦得住。
2. **`post_save` 在事务还没提交时就跑了。** 如果外面有 `transaction.atomic()`、或者 `ATOMIC_REQUESTS=True` 把请求包在事务里、然后 `save()` 之后业务校验抛异常导致回滚——邮件已经发出去了，`notification_sent` 的 `update` 跟着回滚变回 False，下次再 `save()` 又发一遍。

第二点尤其要命：**事务回滚只回滚数据库，不会回滚已发出的 HTTP 请求和邮件。**

这两件事的修法都是同一个东西：**`transaction.on_commit`**。但在我把修法写出来之前，先把"事务"这件事真正搞懂——因为 Django 里关于事务的误解，比 Redis 分布式锁那篇里讲过的还要多。

**目录**

- 先看清你站上的事务边界：`ATOMIC_REQUESTS`、`CONN_MAX_AGE`、`autocommit`
- 实验一：丢失更新——8 线程并发自增，87.5% 的更新无声无息地没了
- 实验二：只改一个计数器，`save()` 比 `update()` 慢 14.7 倍
- 实验三：事务回滚时，`post_save` 里发出去的邮件收不回来
- 实验四：在 `atomic` 里捕获异常，继续查库——`TransactionManagementError`
- `transaction.on_commit` 的完整用法与三个坑
- 三条事务心智模型，看完就能避开 90% 的坑
- SQLite / MySQL / PostgreSQL 的事务差异表
- 上线 Checklist
- 结语

---

## 1. 先看清你站上的事务边界

跑一个小脚本（[本文附录的 `tools/bench_transaction.py`](#附本文实验脚本)）就能把"你这套 Django 的事务底层到底是按什么方式工作的"摸得一清二楚。在做本站（`backend/db.sqlite3` + Django 6.0.6 + Python 3.13）上的实测时，第一个输出是：

```
ENGINE                : django.db.backends.sqlite3
ATOMIC_REQUESTS       : False
CONN_MAX_AGE          : 0
has_select_for_update : False
```

四行里藏着四个事实，每一件都可能影响你接下来写的代码：

### 1.1 `ATOMIC_REQUESTS = False`（默认）

Django 默认**不会**把每个 HTTP 请求自动包在一个事务里。一个视图方法里的 `save()`、连带的 `update()`，各自都是独立的小事务（甚至在 SQLite 上是 autocommit、每条 SQL 独立提交）。

意味着：

```python
def grant_points(user_id, delta):
    User.objects.filter(pk=user_id).update(points=F("points") + delta)  # 事务 #1
    PointLog.objects.create(user_id=user_id, delta=delta)              # 事务 #2
```

这两行是**两个独立事务**。中间如果崩了，会留下"加了积分但没记账"的脏数据。要么你自己 `with transaction.atomic():` 包起来，要么在 `DATABASES` 里把 `ATOMIC_REQUESTS` 设为 `True`（Django 会把整个请求包成一个事务，回滚等价于整个请求没发生过）。

> **`ATOMIC_REQUESTS=True` 是开还是关？** 这是一个工程权衡，不是绝对的好坏。开了，请求粒度的"全有或全无"自动就有了，但所有视图都得按"可能随时被回滚"来写，关掉非必要的写入。关了，自己写 `atomic` 更灵活但每个 `save()` 都得想清楚。本站是**关**，因为视图里要做一些不能包进事务的事——比如发通知、调第三方 API——这些事天然不能在事务里。

### 1.2 `CONN_MAX_AGE = 0`（默认）

连接最大存活时间。`0` 表示每次请求都关掉数据库连接，下次重新开。对 SQLite 这种嵌入式数据库几乎无所谓（建立连接就是 open 一个文件，几十微秒）。但对 MySQL/PostgreSQL，开连接的 TCP 握手 + 鉴权可能要 10-100ms——并发量起来之后这是隐形瓶颈。

生产里 MySQL/PG 一般会设：

```python
DATABASES["default"].update({
    "CONN_MAX_AGE": 60,           # 60 秒内的连接复用
    "CONN_HEALTH_CHECKS": True,   # Django 4.1+：复用前先 SELECT 1
})
```

本站是 SQLite + PythonAnywhere，每次请求关连接也没人盯着，所以保持默认。要切到 MySQL/PG 时记得改这一行。

### 1.3 `has_select_for_update = False`

这个布尔值 Django 是从数据库能力探测出来的。SQLite 不支持行级 `SELECT ... FOR UPDATE`（SQLite 是库级写锁，根本没有"行锁"这个概念），所以 Django 把这个值设成 `False`。后果是：**你写 `.select_for_update()` 不会报错，Django 直接忽略它。**

```python
with transaction.atomic():
    a = Article.objects.select_for_update().get(pk=1)   # 在 SQLite 上 = 不加锁
    a.views_count += 1
    a.save()
```

你以为"加了行锁，别的并发拿不到"，事实上锁根本没存在。这一节稍后会用实验证明。

### 1.4 autocommit 与隐式事务

Django 默认 `autocommit=True`：每条 ORM 操作自己提交。要进入"事务模式"，得显式 `with transaction.atomic():`。

这对新手很反直觉：你以为 `save()` 是事务，事实上一条 `save()` 在 SQLite 上可能是十几条独立提交的 SQL（`save()` 触发的信号、`update()` 的 cascade、m2m 表的写入……）。**"`save()` 是一条 SQL"这个心智模型是错的。**

---

## 2. 实验一：丢失更新——8 线程并发自增，87.5% 的更新无声无息地没了

### 2.1 场景与代码

最经典的并发竞态：一篇文章被多个请求同时访问，每个请求里：

```python
a = Article.objects.get(pk=1)        # SELECT
a.views_count = a.views_count + 1    # Python 自增
a.save(update_fields=["views_count"])  # UPDATE
```

直觉上应该没问题——`views_count` 是整数，`+1` 谁不会？**但它在并发下是错的**，因为两步之间会插进别人的写。

我在本地跑了四种写法，每种用 **8 个线程 × 50 次自增 = 400 次期望期望**期望，期望最终 `views_count = 400`。结果：

| 写法 | 最终值 | 丢失 | 耗时 |
|---|---|---|---|
| A 读-改-写（autocommit） | 50 | **350（87.5%）** | 4819 ms |
| B 读-改-写 + `transaction.atomic()` | 50 | **350（87.5%）** | 571 ms |
| C `F()` 表达式（单条 UPDATE） | **400** | **0** | 3302 ms |
| D `atomic` + `select_for_update()` | 50 | **350（87.5%）** | 573 ms |

注意 B 和 D 跑得比 A 快——但不是因为它们"更好"，是因为 **7/8 线程直接 `OperationalError: database is locked` 退出了**。剩下的 1 个线程做完 50 次写完，线程结束留下 50。

### 2.2 逐行解读

**A 读-改-写（autocommit），87.5% 丢失：这是最危险的一种——它不报错。** 它的工作原理是：

```
T1: SELECT views_count -> 5
T2: SELECT views_count -> 5
T1: UPDATE views_count SET = 6
T2: UPDATE views_count SET = 6   -- 覆盖了 T1 的 +1，丢了 1
```

两个线程读到的旧值都是 5，各加 1 得到 6，写回 6。**净增 1 而不是 2。** 400 次自增下来，只有 ~50 次真的落库了（因为锁竞争让大多数并发根本没机会写，纯 Python 端的 "race window" 缩小了）。生产环境里——SQLite 不算、MySQL 上可能更糟——这种 bug 没有任何日志、监控、报错，就是数字不对。

**B 套上 `transaction.atomic()`，你以为能解决：** `with transaction.atomic():` 在 PostgreSQL/MySQL 的默认隔离级别（READ COMMITTED）下，**仍然救不了丢失更新**。原因是隔离级别只管"读到的是不是已提交的数据"，不管"读完之后到写之前别人改了没有"。你读 5、别人读 5、你写 6、别人写 6——两次写都是 READ COMMITTED 之后做的，都是合法的；数据库根本不觉得哪里不对。

**B 加上 SQLite 的库级写锁副作用：8 个写线程挤 SQLite，7 个 `OperationalError: database is locked`，1 个做完了留下 50。** 响亮地失败比静默地丢好，但仍然是错的，而且生产换 MySQL/PG 后连这点"响亮失败"都没有。

**C `F()` 表达式，唯一正确答案：** Django 的 `.update(views_count=F("views_count") + 1)` 被翻译成一条 `UPDATE articles_article SET views_count = views_count + 1 WHERE id = ?`。**这是一条 SQL，数据库自己在 UPDATE 里算新值，不读不取、不给并发留窗口。** 400 次自增，最终值就是 400，没有丢失一格。

本站的 `articles/views.py:56` 已经做对了：

```python
Article.objects.filter(pk=instance.pk).update(views_count=F("views_count") + 1)
```

> **心法一：能用 `.update(F() + 1)` 就别 `get() + 改 + save()`。** 一条 SQL，原子性、并发安全、性能都好。

**D `atomic` + `select_for_update()`，在 SQLite 上完全等于 B。** 输出上证明了这一点——同样的最终值 50、同样的耗时、同样的 7 个 `database is locked`。原因就是 1.3 节说的：`has_select_for_update = False`，Django 直接把 `.select_for_update()` 忽略，没有 `FOR UPDATE` 子句，没有行锁。**这是 SQLite 用户的常见错觉：我写了锁了所以并发安全——没有。**

要在 SQLite 上防止丢失更新，唯一可靠的做法还是 `F()` 表达式——或者迁移到支持行锁的 MySQL/PostgreSQL，然后用真正的 `SELECT ... FOR UPDATE` + `atomic`。

### 2.3 那 `atomic` 到底有什么用？

它管的不是"防丢失更新"，它管的是**多步操作的原子性**：

```python
def transfer_money(from_id, to_id, amount):
    with transaction.atomic():
        Account.objects.filter(pk=from_id).update(balance=F("balance") - amount)
        Account.objects.filter(pk=to_id).update(balance=F("balance") + amount)
        TransferLog.objects.create(...)
```

这三条 SQL 在 `atomic` 块内，要么一起成功、要么一起回滚——中间任何一条失败（比如余额不足的 CHECK 约束），前面已经做的扣款会自动撤销。**这是事务的本职工作：把"多步操作"变成"一步"。**

而单步 `update(F()+1)`——它本身已经是原子的（一条 SQL），不需要 `atomic` 包。

### 2.4 SQLite 上多线程写入还能这么救

虽然 SQLite 不能 `select_for_update`，但它有别的招让你不那么容易翻车：

```python
# settings.py
DATABASES["default"].update({
    "OPTIONS": {
        "timeout": 20,        # 默认 5 秒；长一点的写入不会立刻炸
        "init_command": "PRAGMA journal_mode=WAL;",
        # WAL 让读不阻塞写、写不阻塞读，单写串行化还在
    },
})
```

**WAL + 合理 timeout** 让 SQLite 在低并发下不至于一脚踢出 `database is locked`。但本质的并发上限还是**单写串行化**——要正经高并发，还得 MySQL/PG。

---

## 3. 实验二：只改一个计数器，`save()` 比 `update()` 慢 14.7 倍

我之前一直以为"改一个字段用 `update_fields` 很快"，实测把脸打肿了。在本站正文最长的一篇（pk=12，正文 19,692 字符）上：

| 写法 | 耗时（中位数 20 次） |
|---|---|
| `a.save(update_fields=["views_count"])` | **109.04 ms** |
| `.update(views_count=F("views_count") + 1)` | **7.40 ms** |
| 倍差 | **14.7×** |

为什么 `update_fields=["views_count"]` 也要 100ms？因为 `Article.save()` 是被**自定义重写**过的（`models.py` 第 125 行起）：

```python
def save(self, *args, **kwargs):
    if not self.slug:
        # 自动生成 slug 的重试循环
        ...
    md = markdown.Markdown(extensions=[...])
    raw_html = md.convert(self.content)
    self.html_content = bleach.clean(raw_html, tags=..., attributes=..., protocols=...)
    # ... 重新计算 excerpt ...
    super().save(*args, **kwargs)
```

`update_fields` 只影响 `super().save()` 写哪些列——**改不了 `save()` 方法本身已经执行过的代码**。每次 `save()` 都会重新跑一遍：

1. `markdown.Markdown().convert(self.content)` —— 全文 Markdown 解析
2. `bleach.clean(raw_html, ...)` —— HTML 清洗
3. 自动 excerpt 重算

一个 19 KB 的正文，这一套下来就是 100ms 量级。**只改一个计数器，也要全文重渲染。**

而 `.update(views_count=F()+1)` 是直接的 `UPDATE` 语句，没有 save() 钩子，毫秒级返回。

> **心法二：`save()` 不是免费的。** 自定义的 `save()` 里塞了什么逻辑，决定了"改一个字段"的真实代价。计数器、布尔标记、排序位置这些小改动，一律 `.update(fields=F()+1)`；只有真正要触发渲染、信号、cascade 的写，才走 `save()`。
>
> 顺便：`ATOMIC_REQUESTS=True` + `save()` 里跑 markdown 解析，会让每个 POST 请求都包在事务里等 100ms+ 渲染完——这个延迟对前端是真实的体感。把它改成异步（Celery）或在 `save()` 里加 `if self._state.adding is False and not getattr(self, "_render_required", True): return` 的短路判断，是另一种思路。

---

## 4. 实验三：事务回滚时，`post_save` 里发出去的邮件收不回来

这是这一篇最值得修的 bug——因为它**不是性能问题，是正确性问题**。

### 4.1 实验脚本

```python
log = []

def side_effect(sender, instance, **kwargs):
    log.append("post_save: 邮件已发出")

post_save.connect(side_effect, sender=Article)

# 场景 1：事务里抛异常，主动回滚
try:
    with transaction.atomic():
        a = Article.objects.get(pk=1)
        a.save(update_fields=["title"])
        transaction.on_commit(lambda: log.append("on_commit: 邮件已发出"))
        raise RuntimeError("业务校验失败，回滚")
except RuntimeError:
    pass
print(log)
# >>> ['post_save: 邮件已发出']    ← 邮件已发出，事务已回滚

# 场景 2：事务正常提交
log.clear()
with transaction.atomic():
    a = Article.objects.get(pk=1)
    a.save(update_fields=["title"])
    transaction.on_commit(lambda: log.append("on_commit: 邮件已发出"))
print(log)
# >>> ['post_save: 邮件已发出', 'on_commit: 邮件已发出']
```

### 4.2 解读

- **场景 1**：事务回滚了，`log` 里只剩 `post_save`。**`on_commit` 那一行根本没执行。**
- **场景 2**：事务提交了，两个都执行。

`post_save` 信号是在 `Article.save()` 里 `super().save(*args, **kwargs)` 之前的最后一行（`models.py:209`）触发的——Django 的代码路径是：`save()` 写库 → `post_save` 信号 → 函数返回。这个顺序**早于**外层 `atomic` 块的 `COMMIT`。所以：

```
process_request → with atomic(): BEGIN → a.save() → INSERT/UPDATE → post_save 信号
                → （如果这里抛异常，atomic 块 ROLLBACK）
                → （事务边界外）on_commit 队列：空
```

`post_save` 在 ROLLBACK 之前就跑了——而 SMTP 也跑了。**回滚的只是数据库，不是邮件。**

回到前言那段 `notify_subscribers_on_publish`：它不仅阻塞请求（性能问题），还**在事务回滚之后变成"该发的没发对、不该发的发了"**（正确性问题）—— 因为 `notification_sent` 的 `update` 是 POST `post_save` 内触发的，跟着 `save` 一起在事务里；事务一回滚，`notification_sent` 变回 False，但邮件已经被发出去了。下次重新 `save` 同一个文章，又发一遍。

### 4.3 修法：`transaction.on_commit`

```python
@receiver(post_save, sender=Article)
def notify_subscribers_on_publish(sender, instance, created, **kwargs):
    if instance.status != Article.Status.PUBLISHED:
        return
    if instance.notification_sent:
        return

    blog_url = getattr(settings, "SITE_URL", "https://zhoujungis.github.io")
    article_url = f"{blog_url}/article/{instance.slug}"
    subject = f"\U0001F4DD 新文章: {instance.title}"
    plain_body = render_to_string("articles/email/new_article.txt", {...})

    from_email = settings.DEFAULT_FROM_EMAIL
    batch_size = 50
    subscribers_qs = Subscriber.objects.filter(is_active=True).order_by("id")

    def send_all_batches():
        """只有事务提交后才会被调用的闭包。"""
        if not subscribers_qs.exists():
            Article.objects.filter(pk=instance.pk).update(notification_sent=True)
            return
        sent_count = 0
        batch = []
        failed = False
        for sub in subscribers_qs.iterator(chunk_size=200):
            batch.append((subject, plain_body, from_email, [sub.email]))
            if len(batch) >= batch_size:
                try:
                    send_mass_mail(batch, fail_silently=False)
                except Exception as exc:
                    logger.error("Failed to send batch: %s", exc)
                    failed = True
                    break
                sent_count += len(batch)
                Article.objects.filter(pk=instance.pk).update(notification_sent=True)
                batch = []
        if batch and not failed:
            try:
                send_mass_mail(batch, fail_silently=False)
                sent_count += len(batch)
                Article.objects.filter(pk=instance.pk).update(notification_sent=True)
            except Exception as exc:
                logger.error("Failed to send final batch: %s", exc)
        if sent_count and not failed:
            logger.info("Sent notification to %d subscribers.", sent_count)

    # 关键：把真正发信的逻辑推迟到事务提交之后
    transaction.on_commit(send_all_batches)
```

三个收益：

1. **不回滚就重复发：** 事务回滚 → `on_commit` 不跑 → 没邮件，下次 `save` 重试还能再发。
2. **请求不被 SMTP 拖住：** `post_save` 现在只注册了一个回调，立刻返回；HTTP 请求响应照常；真正的发信在 `COMMIT` 之后异步发生（如果你想更异步，可以塞 `threading.Thread` 或者 Celery task，但 `on_commit` 已经把"事务提交前不能做"这条边界划清楚了）。
3. **信号跑在事务里、副作用跑在事务外**，边界清晰。

> **心法三：所有"业务上不想被回滚"的副作用（邮件、推送、扣非事务资源、调第三方 API），都走 `transaction.on_commit`。** 信号只用来做"事务内可见的准备"，比如改标记位、记审计日志。

### 4.4 `on_commit` 还有一个隐性好处

它让你**少写一套"提交失败回滚"的补偿逻辑**。把副作用塞进 `post_save` 里，事务回滚后这些事已经发生了，你不得不写补偿（"如果回滚了，撤回刚才那封邮件"——你撤不回啊）。把副作用塞进 `on_commit` 里，"事务成功"是执行的**前提条件**，回滚就什么也没发生——天然不需要补偿。

---

## 5. 实验四：在 `atomic` 里捕获异常，继续查库——`TransactionManagementError`

`transaction.atomic()` 的语义：进入时 `BEGIN`，退出时如果正常退出就 `COMMIT`，如果块内有异常就 `ROLLBACK`。但**已经处于"broken transaction"状态的连接，不能再发新查询**。

### 5.1 经典错误写法

```python
with transaction.atomic():
    try:
        Article.objects.create(title="dup", slug=base_slug, content="x")
    except IntegrityError:
        pass                              # ← 想"跳过这一条，继续后面的"
    # 后面想做点别的：
    n = Article.objects.count()           # 💥 TransactionManagementError
```

实测输出：

```
场景1 捕获 IntegrityError: UNIQUE constraint failed: articles_article.slug
场景1 捕获后继续查询: TransactionManagementError
    An error occurred in the current transaction. You can't execute queries until the
    end of the 'atomic' block.
```

Django 的设计是**保守的**：事务里出了错（即使你 catch 了），连接状态已经被污染——再发查询很可能给你错误的结果。所以它直接禁止你继续查。

### 5.2 正确写法：内层 atomic（savepoint）

```python
with transaction.atomic():                                # 外层
    try:
        with transaction.atomic():                        # 内层 = savepoint
            Article.objects.create(title="dup", slug=base_slug, content="x")
    except IntegrityError:
        pass
    n = Article.objects.count()                           # ✅ OK, 共 9 篇
```

内层 `atomic` 在支持 savepoint 的数据库（SQLite、PostgreSQL、MySQL）上会创建一个 savepoint；内层失败只回滚到 savepoint，不影响外层事务。

实测在 SQLite 上：
```
场景2 内层 atomic 捕获 IntegrityError: UNIQUE constraint failed: articles_article.slug
场景2 捕获后继续查询: OK，共 9 篇
```

### 5.3 两种写法的代价

内层 atomic = 多一次 `SAVEPOINT` / `RELEASE` / `ROLLBACK TO`。SQLite 上这点开销几乎为零；PostgreSQL 上每次 savepoint 也只要几十微秒。**但它换来的是"出错不影响后面"的健壮性。**

> **心法四：在 `atomic` 里做可能失败的操作，用嵌套 atomic 包成 savepoint，不要直接 try/except。** 嵌套的层数多少无所谓——Django 实现 savepoint 就是嵌套 atomic。

---

## 6. `transaction.on_commit` 的完整用法与三个坑

把 `on_commit` 拆开看：

```python
transaction.on_commit(func, *, using=None, robust=False)
```

- `func` 不带参数；它捕获不到 `instance`，要捕获的话自己用闭包（像 4.3 节那样）。
- `using` 默认 `default`，多数据库时指定。
- `robust=False`（默认）——如果 `func` 自己抛异常，Django 会把错误**原样抛出**，打断 `COMMIT` 后的代码。生产里建议 `robust=True`：异常被吞掉、记日志，`COMMIT` 流程不被一个邮件发送失败拖垮。

### 6.1 三个坑

**坑一：在没有事务的代码里调用 `on_commit`。** 没有 `with transaction.atomic():` 包着，Django 内部把它当"立即执行"——所谓 `autocommit` 下的隐式事务。所以独立函数里写 `on_commit(func)` 等价于 `func()`。很多人用 `on_commit` 以为"一定会在事务提交后跑"，其实**没有事务就没有"提交后"**。

**坑二：`on_commit` 在 `TestCase` 里不执行。** Django 的 `TestCase` 把每个测试包在事务里**并回滚**，根本不会 `COMMIT`，`on_commit` 自然不会触发。**这是单元测试里"为什么我的邮件没发出去"的第一名原因。**

修法：要么用 `TransactionTestCase`（不走测试事务），要么用 `django.test.testcases.TestCase.captureOnCommitCallbacks` 来收集回调、断言调用次数/参数，要么直接手动调一下那个回调。

```python
from django.test import TestCase

class NotifyOnPublishTest(TestCase):
    def test_email_callback_registered(self):
        with self.captureOnCommitCallbacks(execute=True) as callbacks:
            article = Article.objects.create(
                title="t", slug="t", content="x", status=Article.Status.PUBLISHED
            )
        self.assertEqual(len(callbacks), 1)   # 提交一次，回调注册一次
```

**坑三：`on_commit` 的执行顺序 = 注册顺序。** 如果一个事务里先后注册了 A、B、C，回调就是 A→B→C。**别假设 Django 帮你并行/调度。** 真正的"并发放邮件"请走 Celery。

### 6.2 进阶用法：HTTP 响应里触发异步任务

```python
from django.db import transaction
from django.http import JsonResponse

@api_view(["POST"])
def create_order(request):
    with transaction.atomic():
        order = Order.objects.create(user=request.user, ...)
        transaction.on_commit(lambda: send_confirmation_email.delay(order.id))
    return JsonResponse({"id": order.id})
```

`send_confirmation_email.delay(...)` 是 Celery 任务的注册——`delay()` 通常是同步入队（写 Redis），所以塞进 `on_commit` 里几乎是零开销。如果你用 `delay()` 直接发邮件（不依赖 broker），那就不需要 `on_commit`；但通常你应该走 Celery，而 Celery 入队可以放进事务——万一事务回滚，Celery 任务也不该发出去。

---

## 7. 三条事务心智模型，看完就能避开 90% 的坑

把上面所有实验和代码揉成三条能写在手边的心智模型：

> **第一条：能用 `.update(F()+k)` 就别 `get() + 改 + save()`。** 一条 SQL，原子的，并发安全。计数器、布尔位、排序、增量统计——一律 `update(F())`。**只改一个字段，不代表 save() 的成本小**——`save()` 自定义逻辑有多少，每次调用都得付。

> **第二条：`atomic` 管的是多步原子性，不防丢失更新。** 读已提交的隔离级别下，"读出来改完写回去"这套动作在 `atomic` 里也是会丢的。**真正防丢失的是 SQL 层面的原子操作**（`F()`、单条 `UPDATE ... WHERE`、或数据库的行锁 `SELECT FOR UPDATE`）。

> **第三条：事务边界外的副作用不能回滚。** 邮件、推送、调 API、扣外部资源——要么走 `on_commit`（事务成功才执行），要么走 Celery + `on_commit`（异步 + 事务后入队）。**信号里写副作用是反模式**，哪怕你只写了 `print("邮件发了")`。

这三条记不住全部也行，但如果你能记得"**改 → `update(F())`；原子性 → `atomic`；副作用 → `on_commit`**"，生产里 90% 的并发和事务事故都能避开。

---

## 8. SQLite / MySQL / PostgreSQL 的事务差异表

| 维度 | SQLite（本站） | MySQL 8.0+ (InnoDB) | PostgreSQL 15+ |
|---|---|---|---|
| 默认隔离级别 | Serializable | REPEATABLE READ | READ COMMITTED |
| `ATOMIC_REQUESTS` 默认 | False | False | False |
| `select_for_update` | ❌ 静默忽略 | ✅ `FOR UPDATE` | ✅ `FOR UPDATE` |
| `select_for_update(skip_locked=)` | ❌ | ✅ | ✅ |
| `nowait` | ❌ | ✅ | ✅ |
| 写锁粒度 | **库级**（一写全堵） | 行级 | 行级 |
| 并发写上限 | 1（队列化） | 数千行锁 | 数千行锁 |
| `on_commit` | ✅ | ✅ | ✅ |
| `savepoint` | ✅ | ✅ | ✅ |
| 一个并发写典型失败 | `OperationalError: database is locked` | 锁等待超时（`innodb_lock_wait_timeout`） | 锁等待超时 |
| 多线程 Django 注意事项 | `OPTIONS.timeout=20` + WAL，否则动不动 SQLITE_BUSY | `CONN_MAX_AGE=60` | `CONN_MAX_AGE=60` |

最关键的一行：**"本站跑 SQLite 没事" ≠ "生产也行"。** 在 SQLite 上 8 线程并发写还能凑合（虽然 7 个会抛 locked），到 MySQL/PG 上同等规模会更快，但你必须假设并发写会真实发生——所以**所有写了"读 → 算 → 写"模式代码，都得用 `F()` 或行锁过一遍**。

迁移到 MySQL/PG 时，**立刻把 `select_for_update` 用上**——它不再是空操作；同时把 `OPTIONS.timeout` 删掉、加上 `CONN_MAX_AGE=60`。

---

## 9. 上线 Checklist

### 9.1 代码层

- [ ] 任何"读出来改完写回去"的逻辑，要么换成 `.update(F()+k)`，要么显式开事务 + `select_for_update`（确认 `has_select_for_update=True`）
- [ ] `save()` 里不要塞与本字段无关的逻辑；如果塞了，确认它是必须的，并加注释说明代价
- [ ] `post_save` / `post_delete` 信号里不要同步调外部副作用（邮件 / 推送 / HTTP），改用 `transaction.on_commit`
- [ ] 邮件、推送、调第三方 API 全部走 `on_commit` 或 Celery + `on_commit`
- [ ] `transaction.on_commit(func, robust=True)` 给非关键副作用加上，避免一个邮件发送失败打断 COMMIT 后面的代码

### 9.2 测试层

- [ ] `TestCase` 写完检查 `on_commit` 回调是否注册：使用 `captureOnCommitCallbacks(execute=True)`
- [ ] 并发竞态测试用 `TransactionTestCase`（不走测试事务）+ 线程池
- [ ] 任何"读 → 算 → 写"逻辑都加：1000 次并发执行，断言最终值 = 期望值

### 9.3 配置层

- [ ] SQLite 加 WAL：`DATABASES.OPTIONS.init_command = "PRAGMA journal_mode=WAL;"`
- [ ] SQLite 写延迟：`DATABASES.OPTIONS.timeout = 20`
- [ ] MySQL/PG 加 `CONN_MAX_AGE=60`、`CONN_HEALTH_CHECKS=True`
- [ ] `ATOMIC_REQUESTS` 决策：要做"全有或全无"就开；要做不能回滚的副作用就关
- [ ] 监控：`SELECT ... FOR UPDATE` 的等待时长、事务回滚率（MySQL `information_schema.innodb_trx`，PG `pg_stat_activity`）

---

## 10. 结语

如果说 Redis 分布式锁那篇讲的是"进程之间的互斥"、索引/慢查询那篇讲的是"查询的代价"，那这一篇讲的是**"操作的边界"**——什么事必须绑在一起、什么事必须分开、什么绝对不能放进同一段代码里。

读完这篇你只需要记住三件事：

>1. 改数据：`F()` 表达式。
>2. 多步原子：`atomic` 块。
>3. 副作用：`on_commit`。

这三件事对应 Django 事务的三个面——**原子性**、**一致性**、**持久性的副作用**。再复杂的事务场景，也不过是这三件事的不同组合。

至于前前言里那个真实的 `signals.py` 邮件 bug——如果你也写了类似代码，**今天**就把它改成 `on_commit`。花十分钟，避开一次"用户收到两封新文章邮件"的投诉。

---

### 附：本文实验脚本

```bash
# 复现全部实验：1.4 万行正文的 worst-case save/update 对比、8 线程并发、on_commit 行为、TransactionManagementError
cd backend
DJANGO_SECRET_KEY=dev-only python ../tools/bench_transaction.py
python ../tools/bench_transaction.py --threads 4 --increments 25    # 跑快点

# 跑在你的真实模型上也会复制同名 Article 行；如果不想表，参数 --pk 改一下
```

环境口径：Django 6.0.6 / SQLite 3.50.4 / Python 3.13；8 线程 × 50 次自增取中位数。
脚本会**自动复制 `db.sqlite3` 到系统临时目录**，跑完自动删除，不会触碰你的真实数据库；订阅者通知信号也会自动断开，所以**不会有任何邮件被发出去**。