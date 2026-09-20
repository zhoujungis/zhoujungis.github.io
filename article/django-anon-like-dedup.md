---
title: "为什么我敢让匿名用户点赞：五层防刷设计"
slug: "django-anon-like-dedup"
category_id: null
tags: ["Django", "后端", "DRF", "安全", "数据库"]
status: "published"
cover_image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80&auto=format&fit=crop"
---

# 为什么我敢让匿名用户点赞：五层防刷设计

> 这篇博客的点赞接口是匿名可调用的：`POST /api/articles/<slug>/like/`，不需要登录。上一篇讲的是"敢渲染"，这一篇讲的是"敢被点"——**把一个写操作开放给全互联网，需要的勇气不比渲染用户输入少**。

如果你觉得"点赞不就是计数器加一吗"，那你可能没想过这几个问题：

> 有人不登录就能刷吗？两个人同时点会丢吗？清一下浏览器就能无限点吗？伪造个请求头就能绕过吗？

这篇文章带你走一遍我的博客点赞从"能点"到"刷不动"的五层设计。代码全部来自后端真实实现（`articles/views.py`、`articles/models.py`），其中两个是踩过坑换来的。

---

## 01 问题：一个点赞按钮，有多少种死法

先把攻击面列出来。一个匿名点赞接口，面临的威胁至少有四种：

1. **无限重放**：写个 `for` 循环发 1 万次请求，`likes_count` 直接上天。
2. **并发丢失**：两个人同时点，`read-modify-write` 互相覆盖，只加了 1 次。
3. **身份伪造**：靠 cookie 或前端 `localStorage` 去重？清一下浏览器状态就满血复活。
4. **请求头伪造**：靠 IP 去重？`X-Forwarded-For` 是客户端随便填的，想换就换。

> **关键认知：点赞防刷不是"加个判断"的问题，而是一个"身份识别 + 并发正确 + 多层限流"的系统问题。**

每一层都只解决一种死法，合起来才叫防线。

---

## 02 第一层：为什么不用 cookie 去重

最直觉的方案是 cookie：点过赞就种个 cookie，下次带 cookie 来就拒绝。但我的博客前后端是分离部署的——前端在 `zhoujungis.github.io`，后端在 `zhoujun123.pythonanywhere.com`，**跨域**。

跨域 cookie 要存住，需要 `SameSite=None; Secure` + 前端 `withCredentials` + 后端 CORS 白名单三处同时配对。任何一处浏览器行为差异（Safari 的 ITP、微信 WebView、无痕模式），cookie 就丢了。丢了会怎样？**用户明明点过赞，换个姿势又能点一次**——去重逻辑形同虚设。

而且 cookie 是存在用户手里的东西。清一下浏览器，身份就重置了。用"用户自己保管的凭证"来做"防用户作弊"的依据，本身就是信任错位。

所以我的选择是（`views.py` 的注释原话）：

```python
"""Increment like count for an article.

H12 (server-side dedup): trust a 24h sliding-window IP+UA table
instead of cookies. Cookies are unreliable across origins / SameSite
rules, so they could be bypassed by clearing browser state.
"""
```

> **核心决策：去重依据必须存在服务端，而不能存在用户手里。**

服务端记什么？一张表：`ArticleLike`。

---

## 03 第二层：服务端去重表（IP + UA + 24 小时滑动窗口）

```python
class ArticleLike(models.Model):
    """H12: server-side like dedup.

    Cross-origin cookie storage is unreliable (different SameSite rules,
    browser quirks). Trust a 24h sliding-window IP+UA dedup table instead.
    Old rows are pruned by a periodic cleanup; unique_together doesn't apply
    because a single client is allowed to like again after 24h.
    """
    article = models.ForeignKey(
        Article, on_delete=models.CASCADE, related_name="like_records",
        verbose_name="文章",
    )
    ip = models.CharField(max_length=64, verbose_name="客户端 IP")
    ua = models.CharField(max_length=255, verbose_name="User-Agent")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="点赞时间")
```

去重逻辑（`like_article`）：

```python
since = timezone.now() - timezone.timedelta(hours=24)
already = ArticleLike.objects.filter(
    article=article, ip=ip, ua=ua, created_at__gte=since
).exists()
if already:
    article.refresh_from_db(fields=["likes_count"])
    return Response({"likes_count": article.likes_count, "liked": True},
                    status=status.HTTP_200_OK)
```

注意三个设计点：

1. **滑动窗口，不是永久去重**。`unique_together` 被刻意弃用了——同一客户端 24 小时后允许再点一次。这是产品取舍：防的是"一分钟刷一万"，不是"这辈子只能点一次"。永久去重会让表无限增长，还会误伤动态 IP 用户。
2. **幂等的返回语义**。重复点赞返回 `200 + liked: true`，新点赞返回 `201 + liked: true`。前端不用区分"报错"和"已经点过"，体验一致——**重复请求不是错误，是已知状态**。
3. **指纹是 IP + UA 组合**。单靠 IP，整个公司出口 IP 算一个人；单靠 UA，全网 Chrome 算一个人。组合起来，误伤和漏防之间取了个平衡。它防不住专业刷量（代理池 + UA 随机化），但**个人博客的威胁模型里，攻击者是"无聊的人"，不是"黑产工作室"**——安全投入要和威胁等级匹配。

---

## 04 真实漏洞：`X-Forwarded-For` 取左边，等于没设防

这一层有个真实踩过的坑：**IP 从哪取**。

博客跑在 PythonAnywhere 后面，真实客户端 IP 藏在 `X-Forwarded-For` 头里。这个头长这样：

```
X-Forwarded-For: client, proxy1, proxy2
```

最左边的 `client` 是**客户端自己声称的**，可以随便填；最右边的 `proxy2` 是**受信任的反向代理追加的**，客户端改不了。

老代码取的是最左边——攻击者只需要在请求头里每次填一个随机 IP，去重表里永远查不到"这个人"，刷多少次都行。等于大门上了锁，但钥匙挂在门上。

修复后的代码（`views.py`）：

```python
# Client fingerprint: trusted-proxy IP (rightmost XFF) + UA.
# Using the leftmost XFF (the older approach) lets clients trivially
# bypass the dedup by setting XFF to a random IP per request. The
# rightmost XFF entry is added by the trusted reverse proxy (PA's
# web frontend) and cannot be spoofed by the client.
xff = request.META.get("HTTP_X_FORWARDED_FOR", "")
if xff:
    ip = xff.split(",")[-1].strip()
else:
    ip = request.META.get("REMOTE_ADDR", "")
```

> **这一条值得单独记住：凡是客户端能直接控制的输入（请求头、cookie、前端传参），都不能当作信任依据。信任只能来自你控制的基础设施追加的信息。**

---

## 05 第三层：并发正确（`F()` + 事务）

去重判断过了，计数加一怎么写？天真写法：

```python
article.likes_count += 1
article.save()
```

这是 `read-modify-write`：读出来、内存里加一、写回去。两个人同时点，读到同一个旧值，各加一，各写回去——**两次点赞只涨了 1**。点赞是低频操作，撞上的概率小，但"概率小"不等于"不会发生"，热门文章刚好是最可能被同时点的。

正确写法（`views.py`）：

```python
with transaction.atomic():
    ArticleLike.objects.create(article=article, ip=ip, ua=ua)
    Article.objects.filter(pk=article.pk).update(likes_count=F("likes_count") + 1)
```

`F("likes_count") + 1` 让加一发生在**数据库内部**（`UPDATE ... SET likes_count = likes_count + 1`），而不是 Python 内存里。数据库的写是串行的，并发来多少个，加的就是多少个，一个都丢不了。

`transaction.atomic()` 保证"记去重行"和"涨计数"要么一起成功、要么一起回滚——不会出现"点了赞但计数没涨"（或反过来）的半吊子状态。

顺带一提，**阅读数也是同样的问题**，同样用 `F()` 解决：

```python
def retrieve(self, request, *args, **kwargs):
    instance = self.get_object()
    # Atomic increment — avoids race condition
    Article.objects.filter(pk=instance.pk).update(views_count=F("views_count") + 1)
    instance.refresh_from_db(fields=["views_count"])
    return super().retrieve(request, *args, **kwargs)
```

> **心法：凡是计数器，一律用数据库原子的 `F()` 表达式，永远不要读出来在内存里加。**

---

## 06 第四层：限流（DRF `AnonRateThrottle`）

去重表挡的是"同一指纹重复点"，但攻击者可以换 IP、换 UA 接着刷。这时候需要**速率层**：不管你是谁，单位时间内的总请求数封顶。

```python
@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([AnonRateThrottle])
def like_article(request, slug):
```

全局配置（`blog_api/settings.py`）：

```python
'DEFAULT_THROTTLE_RATES': {
    'anon': '30/minute',     # 30 requests/min for anonymous users
    'user': '100/minute',    # 100 requests/min for authenticated users
    'comment': '3/minute',   # 3 comments per minute per IP
    'subscribe': '5/hour',   # 5 subscriptions per hour per IP
    'upload': '100/hour',    # 100 image uploads per hour per user
},
```

注意这个限流矩阵是**按操作风险分级的**：点赞 30/分钟（正常人点不出这么快），评论 3/分钟（防 spam），订阅 5/小时（防邮箱轰炸）。**越接近"写放大"和"外部成本"的操作，配额越紧。** 这不是拍脑袋，是每一种滥用都对应真实代价：刷赞污染数据、刷评论污染内容、刷订阅烧 SMTP 配额甚至进黑名单。

限流和去重是互补关系：**去重管"准不准"，限流管"快不快"**。指纹能伪造，但伪造本身需要成本（换代理 IP 要钱要时间），限流把"单位时间的伪造成本"锁死，刷量的经济账就算不过来了。

---

## 07 第五层：表不能无限长（定时清理 + 索引）

去重表每被点一次就多一行。如果从不清，几年下来几十万行，每次点赞都要 `filter(article, ip, ua, created_at__gte)` 扫一遍——越跑越慢。

因为去重窗口只有 24 小时，**超过 48 小时的数据对去重没有任何意义**（24 小时窗口 + 24 小时余量）。所以有一个定时命令（`management/commands/cleanup_article_likes.py`），挂在 PythonAnywhere 上每小时/每天跑：

```python
"""Prune old ArticleLike rows so the dedup table doesn't grow unbounded. ..."""
cutoff = timezone.now() - timedelta(hours=hours)  # default 48h
pks = list(
    ArticleLike.objects.filter(created_at__lt=cutoff)
    .values_list("id", flat=True)[:batch_size]  # default 5000
)
deleted, _ = ArticleLike.objects.filter(id__in=pks).delete()
```

两个细节：

1. **分批删（batch 5000 + 事务）**。一次性 `DELETE` 几十万行会长时间锁表（SQLite 尤其疼），分批 + 小事务把影响摊薄。还顺手兼容了 SQLite 和 Postgres（`DELETE ... LIMIT` 不是所有库都支持，用"先查主键再按主键删"绕开）。
2. **复合索引让去重查询永远走索引**（`models.py`）：

```python
indexes = [
    models.Index(
        fields=["article", "ip", "ua", "created_at"],
        name="articlelike_dedup_idx",
    ),
],
```

索引字段顺序和查询条件顺序对齐（`article → ip → ua → created_at__gte`），去重查询是一次索引范围扫描，不回表扫全表。**表设计、索引设计、清理策略是一件事的三个面**：不去想清理的表，就别建。

---

## 08 纵深防御总结

把整条链路串起来：

```
匿名 POST /api/articles/<slug>/like/
   │
   ▼  ① 速率层：AnonRateThrottle 30/min
限流 ──► 刷得再快也被截断
   │
   ▼  ② 身份层：IP(取XFF最右)+UA 指纹
去重表 ──► 同一指纹 24h 内只算一次
   │
   ▼  ③ 正确层：transaction + F() 原子加一
计数 ──► 并发再高也不丢数
   │
   ▼  ④ 语义层：重复 200 / 新赞 201
幂等 ──► 重复请求不是错误
   │
   ▼  ⑤ 寿命层：48h 定时清理 + 复合索引
存储 ──► 表不 unbounded，查询永远快
```

| 层 | 手段 | 挡住的攻击 |
|---|---|---|
| ① | DRF 限流 30/min | 换指纹硬刷、脚本 flood |
| ② | IP+UA 24h 滑动窗口 | 清浏览器重放、普通重复点 |
| ③ | XFF 取最右可信 IP | 请求头伪造绕过去重 |
| ④ | `F()` + 事务 | 并发丢失、半吊子写 |
| ⑤ | 48h 清理 + 复合索引 | 表膨胀拖慢查询 |

和上一篇 XSS 的防线对照着看， Methodology 是同一套：**不信任客户端、每一层只解决一件事、每一层都假设上一层已失守**。

---

## 延伸：什么时候该上 Redis

诚实地说，IP+UA 表方案有天花板：防不住代理池 + UA 随机化的专业刷量。如果有一天流量大到需要升级，标准答案是 Redis：

| 方案 | 做法 | 适合 |
|---|---|---|
| 当前：DB 去重表 | `filter(...).exists()` + 复合索引 | 日活 < 万，单机 SQLite，零运维 |
| 进阶：Redis 去重 | `SET like:<slug>:<hash> EX 86400 NX`，返回 nil 即重复 | 高频点赞，原子判断 + 自动过期二合一 |
| 计数：Redis INCR | `INCR like:count:<slug>`，定时落库 | 秒杀级并发，DB 写扛不住时 |
| 去重：HyperLogLog | `PFADD` 估算 UV | 只需要"大概多少人赞过"，不要精确名单时 |

**但不要提前优化**。Redis 意味着多一个组件、多一份运维、多一种故障模式（缓存与 DB 不一致）。个人博客的量级下，一张带索引的小表 + 定时清理，又准又稳，够了。**架构选型永远跟着威胁模型和量级走，而不是跟着时髦走。**

---

## 结语

回到开头：**把写操作开放给匿名用户，靠的不是胆子大，而是每一层都知道自己在防什么。**

- 去重依据放服务端（不信 cookie）——信任边界；
- XFF 取最右（不信客户端头）——信任只能来自自己控制的基础设施；
- 计数用 `F()`（不信"概率小"）——并发正确不能靠运气；
- 限流分级（不信"用户都是好人"）——每种滥用都要有成本；
- 表要清理、索引要对齐（不信"以后再说"）——存储设计是功能设计的一部分。

如果你也维护一个允许匿名写入的接口，不妨问自己三个问题：

> 1. 我的"身份"依据存在谁手里？（信任边界）
> 2. 并发和重放时，我的数据还正确吗？（正确性）
> 3. 最坏情况下，表和配额会爆炸吗？（有界性）

想清楚这三个问题，你就离"敢被点"不远了。
