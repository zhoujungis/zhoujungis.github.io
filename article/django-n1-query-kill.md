---
title: "从 21 条 SQL 到 2 条：三次 N+1 查询围剿实录"
slug: "django-n1-query-kill"
category_id: null
tags: ["Django", "后端", "DRF", "数据库"]
status: "published"
cover_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80&auto=format&fit=crop"
---

# 从 21 条 SQL 到 2 条：三次 N+1 查询围剿实录

> 博客的文章列表页一次查 10 篇文章。你猜后端执行了多少条 SQL？实测答案：**14 条（8 篇文章时），满页 10 篇就是 21 条**。其中只有 1 条是真正必要的。

N+1 是 Django 项目里最常见、最隐蔽的性能杀手：代码看着没问题，数据量小的时候飞快，上线后随数据量线性变慢。它不报错、不抛异常，只是让你的首页越来越慢，而你盯着代码怎么都看不出慢在哪。

这篇文章记录我在这个博客里围剿 N+1 的三次实战，全部有实测数字。最后还有一个诚实章节：**一个至今没修的 N+1**，以及修复方案。

---

## 01 算账：N+1 是什么

先看文章列表的序列化器（`articles/serializers.py`）：

```python
class ArticleListSerializer(serializers.ModelSerializer):
    category = CategoryNestedField(read_only=True)
    tags = TagNestedField(many=True, read_only=True)
```

每篇文章要展示分类名和标签名。ORM 的执行过程是：

1. `SELECT * FROM articles WHERE status='published' LIMIT 10` —— 1 条，查出 10 篇文章；
2. 对每篇文章：`SELECT * FROM categories WHERE id=?` —— 10 条；
3. 对每篇文章：`SELECT * FROM tags ...` —— 10 条。

**1 + 10 + 10 = 21 条。** N 是 10，查询数是 2N+1，这就是"N+1"这个名字的由来。

我在本地 SQLite 上实测（8 篇已发布文章）：

| 写法 | SQL 条数 |
|---|---|
| 直接循环取 `a.category` / `a.tags.all()` | **14 条**（1 + 8 + 5，标签有复用） |
| `select_related("category").prefetch_related("tags")` | **2 条** |

数据量小的时候，14 条 SQL 只要几毫秒，没人察觉。但查询数随文章数线性增长：分页是 10 条一页，评论、RSS、搜索页各自再来一套——**慢不是突然发生的，是每加一篇文章就慢一点，慢到你终于忍不了的那天**。

> **关键认知：N+1 不是"慢查询"问题，而是"查询次数"问题。单条 SQL 再快，也架不住数量随数据线性涨。**

---

## 02 第一杀：分类文章数（5 条 → 1 条）

分类列表页要显示每个分类下有多少篇文章。直觉写法：

```python
data = [(c.name, c.article_set.filter(status="published").count())
        for c in Category.objects.all()]
```

4 个分类 = 1 条查分类 + 4 条 `COUNT` = **5 条 SQL**。分类、标签越多，线性越狠。

修复（`articles/views.py`，注释原话"in a single query instead of N+1"）：

```python
def get_queryset(self):
    # Annotate published article count in a single query instead of N+1
    return Category.objects.annotate(
        article_count=Count(
            "article",
            filter=Q(article__status=Article.Status.PUBLISHED),
        )
    )
```

`annotate + Count + filter` 把计数翻译成一条带 `COUNT ... FILTER (WHERE ...)` 的 SQL：**分类和计数一次查出，永远 1 条**。Tag 列表同理。实测：5 条 → 1 条。

注意 `filter=Q(...)` 这个细节：**只统计已发布的**。草稿、定时、归档的文章不能算进去——计数逻辑必须和列表页的可见性规则一致，否则分类上写着"12 篇"，点进去只有 8 篇。这种"数字对不上"是最伤信任的 bug。

序列化器侧还有一处配合（`serializers.py`）：

```python
class CategorySerializer(serializers.ModelSerializer):
    # Use the queryset annotation when present (CategoryViewSet/TagViewSet
    # annotate it). Fall back to a live count for direct ModelSerializer
    # usage (admin etc.) so the field never silently returns 0.
    article_count = serializers.IntegerField(read_only=True)
```

字段声明为只读的普通整数字段，**数据由 queryset 的注解提供，而不是序列化器自己再查一次**。权责分清：查几次、怎么查，是 queryset 的事；序列化器只负责"呈现已经查好的东西"。这是后面所有优化的总原则。

---

## 03 第二杀：评论列表（serializer 访问什么，就预取什么）

评论接口的序列化器访问了三个关联（`comments/serializers.py` + `views.py`）：

```python
def get_replies(self, obj):
    replies = [r for r in obj.replies.all() if r.is_approved]  # 反向关联
    ...

def get_article_slug(self, obj):
    return obj.article.slug ...   # 外键
def get_article_title(self, obj):
    return obj.article.title ...  # 外键
```

每条评论触发：1 次 `article` 查询 + 1 次 `replies` 查询。20 条评论一页，就是 40 多条 SQL。

修复（`comments/views.py`）：

```python
return Comment.objects.filter(
    article=article, is_approved=True, parent=None
).select_related("article").prefetch_related("replies__article")
```

- `select_related("article")`：外键正向关联，用 `JOIN` 一次带出，不再每条查；
- `prefetch_related("replies__article")`：反向关联 + 回复的文章，用 2 条额外 SQL 一次性装好（注意 `replies__article` 这个双下划线——**回复的 `article` 也要预取**，否则每条回复又查一次文章，N+1 换个地方复活）。

> **心法：优化 N+1 不用猜。打开序列化器，逐行列出它访问了哪些关联（`obj.xxx`），然后在 queryset 里把这些关联全部预取。serializer 访问什么，queryset 就预取什么。**

还有一个连带埋点：`get_replies` 是递归的（回复的回复），注释里写明调用方必须预取，且用 `depth` 上限截断：

```python
depth = self.context.get('depth', 0) if self.context else 0
if depth >= 2:
    return []
```

这防的是另一类灾难：恶意构造父子循环（A 是 B 的父亲，B 又是 A 的父亲）导致无限递归，或者超长串烧出巨大 payload。**N+1 管的是"查询太多"，depth 管的是"递归太深"**——序列化嵌套关联时，两个都要管。

---

## 04 第三杀：RSS 订阅（最容易漏的一处）

RSS（`articles/feeds.py`）是最容易漏掉 N+1 的地方——它不在 DRF 视图里，没有序列化器，是 Django 自带的 feed 框架：

```python
# L8: prefetch category + tags so item_categories() doesn't trigger
...
.select_related("category")
.prefetch_related("tags")
```

feed 的每一项都要输出分类和标签，不预取的话，订阅器每半小时来抓一次，每次几十条 SQL。RSS 平时没人看，但**爬虫和订阅器是最高频的"用户"**，漏掉这里等于把最热的路径留在最慢的状态。

> **教训：N+1 排查要覆盖所有出口——REST 接口、RSS、管理后台、定时任务。只修了 API 不修 feed，等于锁了前门没锁后门。**

---

## 05 诚实章节：一个还没修的 N+1

排查时发现：**文章列表端点（最热的首页）自己还没加预取**。

```python
class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(status=Article.Status.PUBLISHED)
    # ← 没有 select_related / prefetch_related
```

而 `ArticleListSerializer` 恰恰访问了 `category` 和 `tags`（01 节算的就是这笔账）：实测 8 篇文章 14 条 SQL，满页 10 篇就是 21 条。分类页、标签页修了，最热的首页反而漏了——典型的"灯下黑"。

修复方案就两行：

```python
queryset = Article.objects.filter(
    status=Article.Status.PUBLISHED
).select_related("category").prefetch_related("tags")
```

实测：14 条 → **2 条**（1 条文章 + 1 条标签预取，分类被 JOIN 带出），且与 N 无关，加多少文章都是 2 条。

为什么写出来而不是偷偷修掉？因为这就是 N+1 的真实形态：**它不是修一次就绝迹的 bug，而是每次加字段、加接口都会回来的慢性病**。`related_articles`（按标签找相关文章）这种 `SerializerMethodField`，里面又藏着 `obj.tags.all()` + 几次查询——今天修完，明天加个字段又回来。所以需要的不是"修完"，而是"每次都能发现"。

---

## 06 方法论：四步发现 N+1

| 步骤 | 做法 | 说明 |
|---|---|---|
| ① | 列出 serializer 访问的关联 | 逐行找 `obj.xxx` / `xxx.all()` / `MethodField` 里藏的查询 |
| ② | 本地数 SQL | `CaptureQueriesContext` 或 `assertNumQueries`，改前改后各跑一次，数字说话 |
| ③ | 正向用 `select_related`，反向/多对多用 `prefetch` | 前者 JOIN，后者另查两次；双下划线追踪到底（如 `replies__article`） |
| ④ | 覆盖所有出口 | API、RSS、管理后台、定时任务，一个一个过 |

第②步是我最想强调的：**性能优化先有数字，再动手**。本文所有的"5→1""14→2"都是本地实测，不是估算。没有改之前的数字，你根本不知道改完是变快了还是心理作用。

---

## 结语

N+1 的可怕之处不在于难修——修复往往就是一两行 `select_related` / `annotate`。可怕之处在于**隐蔽**：功能全对、测试全过，只是随数据量慢慢变慢，慢到用户先流失，你还不知道问题在哪。

三条检查清单，送给下次写 DRF 接口的自己：

> 1. 我的 serializer 逐行访问了哪些关联？（逐行列出来）
> 2. 改前后各跑一次 SQL 计数，数字降了吗？（用数字说话）
> 3. 除了这个接口，RSS、后台、定时任务里还有同类写法吗？（覆盖所有出口）

以及最诚实的一条：修完记得回头看——**最热的那个接口，往往就是灯下黑的那个**。
