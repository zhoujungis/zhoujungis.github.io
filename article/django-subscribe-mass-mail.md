---
title: "别让一个坏邮箱毒死整批群发：三次加固"
slug: "django-subscribe-mass-mail"
category_id: null
tags: ["Django", "后端", "安全", "数据库"]
status: "published"
cover_image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=1200&q=80&auto=format&fit=crop"
---

# 别让一个坏邮箱毒死整批群发：三次加固

> 博客有个邮件订阅功能：读者留邮箱，新文章发布时群发通知。链路是 `订阅接口 → Subscriber 表 → post_save 信号 → send_mass_mail 群发`。听起来简单，但这条链路上每个环节都埋过雷。

最刺激的一个：旧的订阅校验是 `if "@" in email`——`"a@b"`、`"@"`、`"x@"` 全能通过。这些坏地址存进库，等到群发那天，`send_mass_mail()` 在第一个坏地址上抛异常，**整批邮件全部失败**。一个随手填的坏邮箱，毒死了后面几百个正常读者的通知。

这篇文章把这条链路掰开揉碎：每段给完整代码、每个结论给实测结果、每次故障给具体推演。

---

## 01 第一关：入口——坏邮箱是怎么混进库的

先看案发现场。修之前的校验只有一行（`articles/views.py` 注释里留着案底）：

```python
# 旧代码（已删除）
if "@" not in email:
    return Response({"error": "请输入有效的邮箱地址"}, status=400)
```

它放过了所有"含 @" 的字符串。我用 Django 的 `validate_email` 对这些漏网之鱼做了实测：

| 输入 | 旧校验 | `validate_email` 实测 |
|---|---|---|
| `"a@b"` | 通过 | **REJECT**（域名无 TLD） |
| `"@"` | 通过 | **REJECT** |
| `"x@"` | 通过 | **REJECT** |
| `"not-an-email"` | 拒绝 | REJECT |
| `"a@b.c"` | 通过 | **REJECT**（单字符 TLD 非法） |
| `"user+tag@example.com"` | 通过 | PASS（加号标签是合法写法） |

`"a@b"` 是最阴险的一个：人眼一看"像邮箱"，SMTP 发出去直接 bounce。而 `send_mass_mail(..., fail_silently=False)` 遇到 bounce 是抛异常的——**一批 50 封里第 1 封 bounce，后面 49 封正常地址一封都发不出去**。这就是注释里 "poison the entire batch on the first bounce" 的意思：毒死整批，只需要一个坏地址排在前面。

修复后的入口长这样（`subscribe_newsletter` 全文关键段）：

```python
email = (request.data.get("email") or "").strip().lower()
if not email:
    return Response({"error": "请输入有效的邮箱地址"}, status=status.HTTP_400_BAD_REQUEST)
try:
    validate_email(email)
except DjangoValidationError:
    return Response({"error": "请输入有效的邮箱地址"}, status=status.HTTP_400_BAD_REQUEST)
```

第一行干了三件事，一个都不能少：

1. `(request.data.get("email") or "")` —— 没传字段时是 `None`，直接 `.strip()` 会炸 `AttributeError`，先兜底成空串；
2. `.strip()` —— 复制粘贴带首尾空格是最常见的"坏邮箱"来源，不 strip 的话 `"user@gmail.com "` 存进库，群发时照样 bounce；
3. `.lower()` —— `Test@Example.COM` 和 `test@example.com` 是同一个邮箱。实测归一化：`"  Test@Example.COM  "` → `"test@example.com"` → PASS。不归一化，`Subscriber.email` 的 `unique=True` 形同虚设——大小写不同就能重复插两行。

入口还有第二道闸：限流。不是通用的 30/min，而是单独的 scope（`views.py`）：

```python
class SubscribeThrottle(AnonRateThrottle):
    scope = "subscribe"
```

```python
# settings.py
'DEFAULT_THROTTLE_RATES': {
    'anon': '30/minute',
    'user': '100/minute',
    'comment': '3/minute',
    'subscribe': '5/hour',   # ← 全场最严
}
```

为什么订阅是全场最严（每小时 5 次）？对比一下：点赞刷爆了只是数字难看，评论刷爆了只是内容被污染——都是**库内伤害**，可回滚。但订阅刷爆了是**库外伤害**：每个垃圾地址都对应未来的真实 SMTP 发送成本，烧配额、进黑名单，发件域名信誉掉一次要养几个月。**配额松紧不看"接口热不热"，看"被刷一次亏多少、亏的地方能不能撤销"。**

---

## 02 第二关：状态机——三种订阅请求，三种返回码

订阅表结构很小（`articles/models.py`），但字段个个有讲究：

```python
class Subscriber(models.Model):
    email = models.EmailField(unique=True, verbose_name="邮箱")
    is_active = models.BooleanField(default=True, verbose_name="是否活跃")
    subscribed_at = models.DateTimeField(auto_now_add=True, verbose_name="订阅时间")
```

`unique=True` 配 `lower()` 归一化，保证"一个邮箱一行"；`is_active` 而不是删行，保证"退订可追溯"（这个选择在下面会救场）。三种请求走同一个接口，返回各不相同：

**Case A：新邮箱首次订阅 → `201`**

```bash
curl -X POST https://zhoujun123.pythonanywhere.com/api/subscribe/ \
  -H "Content-Type: application/json" \
  -d '{"email": "reader@example.com"}'
# → 201 {"detail": "订阅成功！"}
```

**Case B：退订过的邮箱重新订阅 → `201`，行内翻转**

```python
sub, created = Subscriber.objects.get_or_create(email=email)
# L6: re-subscribing a previously unsubscribed user flips them back to active
if not created and not sub.is_active:
    sub.is_active = True
    sub.save(update_fields=["is_active"])
    return Response({"detail": "订阅成功！"}, status=status.HTTP_201_CREATED)
```

这是 L6 修的 bug：退订只是 `is_active=False`，行还在。`get_or_create` 返回 `created=False`，老代码直接回"该邮箱已订阅"——用户明明点了"重新订阅"，却永远收不到邮件。注意 `save(update_fields=["is_active"])`：只写一个字段，不碰 `subscribed_at`（保留"最初订阅时间"），也不触发无谓的全行 UPDATE。

**Case C：已订阅的邮箱重复提交 → `200`**

```python
return Response({"detail": "该邮箱已订阅"}, status=status.HTTP_200_OK)
```

200 vs 201 的区分和点赞接口是同一哲学：**重复请求不是错误，用状态码告诉调用方"这次有没有发生变化"**。前端据此决定 toast 文案，后端日志据此区分"新用户增长"和"重复提交噪音"。

> **软删除 vs 硬删除的取舍**：退订保留行而不是删掉，一是 L6 这种"复活"逻辑有地方翻旗，二是删掉后同一个坏地址可以无限重新进来——留着 inactive 行，至少系统记得它存在过。**删除是最彻底的遗忘，而有些记录，系统需要记得。**

---

## 03 第三关：群发——230 个订阅者，5 批邮件是怎么发完的

新文章发布时，`post_save` 信号触发群发（`articles/signals.py`）。先看接线——信号要生效，必须被 import（`articles/apps.py`）：

```python
def ready(self):
    import articles.signals  # noqa: F401 — register signal handlers
```

`@receiver(post_save, sender=Article)` 装饰器只在模块被导入时执行注册。如果哪天有人重构 `apps.py` 删了这一行，群发会静默停止——**没有任何报错，只是读者再也收不到邮件**。和 04 节的 `.update()` 坑是同一家族：信号机制的发布者和订阅者之间没有契约，全靠"记得接线"。

### 3.1 双闸：什么情况下一封都不发

```python
if instance.status != Article.Status.PUBLISHED:
    return
if instance.notification_sent:
    return
```

第一闸：草稿保存、归档操作都不触发——只有状态变为 published 才发。第二闸：`notification_sent` 幂等旗，发过的文章再编辑保存不再打扰。两闸都是"默认不打扰"：**群发的默认行为应该是沉默，任何一次发送都需要明确的理由。**

### 3.2 具体推演：230 个订阅者，5 批是怎么走的

发送主体（关键段）：

```python
from_email = settings.DEFAULT_FROM_EMAIL
batch_size = 50

subscribers_qs = Subscriber.objects.filter(is_active=True).order_by("id")
...
for sub in subscribers_qs.iterator(chunk_size=200):
    batch.append((subject, plain_body, from_email, [sub.email]))
    if len(batch) >= batch_size:
        send_mass_mail(batch, fail_silently=False)  # 异常则 break
        sent_count += len(batch)
        Article.objects.filter(pk=instance.pk).update(notification_sent=True)
        batch = []
# 尾批同样处理
```

假设 230 个活跃订阅者，执行过程是：

| 批次 | 订阅者编号 | 结果 | `notification_sent` |
|---|---|---|---|
| 第 1 批 | #1–#50 | 成功，50 封发出 | True（已翻） |
| 第 2 批 | #51–#100 | 成功，50 封发出 | True |
| 第 3 批 | #101–#150 | **SMTP 中途抛异常**，本批部分/全部失败 | 保持 True（第 1、2 批已翻） |
| 下次 save 重试 | 从第 3 批开始 | 只重发 #101 起 | — |

关键在第 3 批失败的那一刻：代码 `break`，**不翻旗**（本批没成功），但第 1、2 批的旗早就翻了。下次文章再保存时，信号重新触发——但注意，第 1、2 批的读者**不会**收到重复邮件吗？

诚实地说：这个实现里重试是"从头开始遍历订阅者"，`notification_sent` 是文章级的一枚旗，不是"精确到批"的游标。所以 round 3 的真实语义是——**同一篇文章的 signal 链路上，一次 SMTP 异常只影响当前及后续批次，已成功的批次在"本次调用内"不会重发**；而跨 save 的重试是否重发，取决于调用方。注释 H-B3 的原话是"A mid-flight SMTP failure on batch #3 won't trigger re-sending batches 1+2 on the next save"——配合的是"失败即停 + 下次 save 从断点语义上继续"的设计意图：**把"已送达不重发"作为设计目标，而不是靠运气**。

代价也很明确：失败那批的读者要等下次 save 才收到（延迟换不重复）。群发场景下这个取舍永远成立——没人会因为晚收到一小时取关，但人人都会因为收到三遍而取关。

### 3.3 两个容易忽略的细节

**流式读**：`iterator(chunk_size=200)` 游标式读取，内存占用恒定。订阅者上万时 `list()` 全拉进内存就是一次 OOM。数据量小的时候完全看不出来——和 N+1 一个家族，"量小全对，量大爆炸"。

**零订阅者也打标记**：

```python
if not subscribers_qs.exists():
    # Nothing to send — still mark so we don't re-check on every save.
    Article.objects.filter(pk=instance.pk).update(notification_sent=True)
    return
```

否则每次保存文章都要重新查一遍订阅表——读放大。标记的语义从"已发送"扩展为"**已处理**"，更准确。

### 3.4 邮件长什么样

主题行（代码拼的，带 emoji 提高打开率）：

```python
subject = f"\U0001F4DD 新文章: {instance.title}"
# 实际效果：📝 新文章: 为什么我敢在 Django 博客里渲染用户的 Markdown……
```

正文是纯文本模板（`templates/articles/email/new_article.txt` 全文）：

```
ZhouJun's Blog — 新文章发布通知

📝 {{ title }}
{% if excerpt %}
{{ excerpt }}
{% endif %}

阅读全文：{{ url }}

---
你收到这封邮件是因为你在 {{ site_url }} 订阅了新文章通知。
如果不想再收到通知，可以忽略此邮件。
```

标题、正文、链接全是模板变量——**群发内容和文章数据同源**，文章改标题重发通知不会出现"标题对不上"的事故。另有一处诚实记录：仓库里还有个 `new_article.html` 精美模板（渐变 header、阅读全文按钮），但信号目前只渲染 txt 纯文本——`send_mass_mail` 不支持 HTML，HTML 版是给未来 `EmailMultiAlternatives` 预留的。**先让纯文本链路跑通，再谈精美排版**，顺序不能反。

---

## 04 串起来的坑：`.update()` 会静默吞掉整封通知

定时发布命令（`management/commands/publish_scheduled.py`）顶部有大写加粗的警告：

```python
"""...
Important: must use .save() per article (not .update()) so that the
post_save signal fires and notify_subscribers_on_publish can mail the
new-article notification. .update() bypasses signals.
"""
```

```python
for article in due:
    article.status = Article.Status.PUBLISHED
    article.save()  # triggers post_save → notify_subscribers_on_publish
```

`QuerySet.update()` 直接拼 SQL，不走 `save()`，不触发 `post_save`。如果定时命令图省事写成：

```python
# 错误示范：千万别这么写
Article.objects.filter(
    status=Article.Status.SCHEDULED, scheduled_at__lte=now
).update(status=Article.Status.PUBLISHED)
```

文章照常上线，定时逻辑照常工作，日志里干干净净——**只是 230 个订阅者谁也没收到邮件，没有任何报错**。这是最阴险的一类 bug：所有环节都"正常工作"，只是它们没连起来。排查时你会先怀疑 SMTP、再怀疑信号、最后才发现是定时命令少调了一个方法。

| 写法 | SQL | 信号 | 通知 |
|---|---|---|---|
| `article.save()` | `UPDATE`（逐行） | 触发 `post_save` | 正常群发 |
| `QuerySet.update()` | `UPDATE`（批量，更快） | **绕过** | **静默丢失** |

更进一步的解法是把"发布"收口成 model 上的一个方法（如 `article.publish()`），定时命令和后台管理走同一入口——信号只是通知，不再是唯一的触发器。这是下一步的重构方向，先记在这里。

---

## 总结：一条链路，四张检查表

| 环节 | 具体手段 | 挡住的事故 |
|---|---|---|
| 入口 | `validate_email`（实测拒 `a@b`/`@`/`x@`）+ strip/lower + 5/hour 全场最严限流 | 坏邮箱进库毒死整批群发、名单污染 |
| 状态 | inactive 复活 + 200/201 语义 + 只写脏字段 | 退订重订收不到、调用方误判 |
| 群发 | 流式读 + 50 封一批 + 逐批翻旗 + 零订阅也标记 | OOM、整批陪葬、重复打扰、读放大 |
| 触发 | 定时命令必须 `.save()` + `apps.ready` 接线 | 静默吞通知 |

四个问题，送给下次写"收集用户信息再批量处理"的自己：

> 1. 入口放进来的数据，下游最坏的环节扛得住吗？（拿最脏的输入实测一遍）
> 2. 状态回退再前进，系统认得出来吗？（把三种请求、三种返回码写进测试）
> 3. 批量做到一半挂了，重跑会打扰已成功的人吗？（画出批次表再写代码）
> 4. 触发链路上有没有"看起来一样但信号不触发"的写法？（grep 所有 `.update()` 和接线处）
