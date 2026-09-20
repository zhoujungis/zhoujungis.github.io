# 列表接口从 800ms 到 80ms：分页、缓存与限流

> 适用栈：Django 6.0 + DRF 3.17 + SQLite + PythonAnywhere（免费版无 Redis）
> 代码来源：真实博客后端 `backend/blog_api/settings.py`、`backend/articles/views.py`，全部可运行
> 阅读时间：约 25 分钟 | 难度：初中级 | 收获：一套可直接抄上线的 DRF 性能模板

## 前言：一次把博客打挂的联调

去年有一次前端联调，我把 `ArticlePagination` 写成这样：

```python
class ArticlePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 1000  # 当时觉得“灵活点没坏处”
```

前端同学随手试了下 `GET /api/articles/?page_size=500`，结果：

- 后端 SQLite 扫 500 篇 `content`（Markdown 大字段，平均 15KB/篇）+ 序列化 7.5MB JSON，耗时 **860ms**；
- PythonAnywhere 免费版 CPU 当场被吃满，后续请求排队超时；
- 前端拿到 7.5MB 后 Vue 直接卡 3 秒，用户以为网站挂了。

那次之后我把 DRF 的三件套彻底重做了一遍：**分页封顶 + 列表瘦身 + 缓存 + 分级限流**，列表接口稳定在 **60~100ms**，首页第一页命中缓存时 **10ms 出头**。

这篇文章就是那次重做的完整记录。每一件都讲四层：**为什么需要 → DRF 源码怎么实现的 → 我的真实代码 → 踩过的坑**。你可以直接抄走最后一章的完整模板。

**目录**

- 全景：三件套在请求链路中的位置
- 分页篇：不只是“能翻页”
- 缓存篇：PA 无 Redis 也能快 10 倍
- 限流篇：读和写必须分开限
- 组合篇：一个 ViewSet 的最终形态 + 压测总表
- 上线 Checklist + 高频 FAQ

---

## 1. 全景：三件套在请求链路中的位置

一个 `GET /api/articles/?page=2&page_size=10` 进来后，在 DRF 里依次经过：

```
请求 → Throttle（限流：让不让进？429 直接打回）
     → Filter/Search（过滤搜索）
     → Pagination（分页：切哪一段？）
     → Serializer（序列化：返回哪些字段？）
     → Cache（缓存：下次同样请求直接返回？）
     → DB（实在躲不过才查库）
```

三件套的分工一句话：

| 组件 | 解决的问题 | 不解决什么 |
|------|-----------|-----------|
| 分页 Pagination | 一次拿多少，防止大结果集拖垮 DB 和前端 | 不减少查询次数（N+1 另算） |
| 缓存 Cache | 同样请求别重复查库，读多写少接口的救星 | 不防刷，缓存也被打爆就是雪崩 |
| 限流 Throttle | 恶意刷、爬虫、误循环调用，把坏流量挡在门外 | 不提升正常请求的响应速度 |

这是我博客最终的 `REST_FRAMEWORK` 配置（`backend/blog_api/settings.py` 实拍，可直接抄）：

```python
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10,
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '30/minute',     # 匿名读接口：30次/分
        'user': '100/minute',    # 登录读接口：100次/分
        'comment': '3/minute',   # 评论：3次/分，防刷核心
        'subscribe': '5/hour',   # 订阅：5次/小时
        'upload': '100/hour',    # 上传：100次/小时/用户
    },
    'DEFAULT_RENDERER_CLASSES': (
        'rest_framework.renderers.JSONRenderer',
    ),  # 生产只留 JSON，关掉 Browsable API：省渲染开销 + 减少字段泄露
}
```

外加缓存（PA 免费版无 Redis，用内存缓存）：

```python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "blog-cache",
        "TIMEOUT": 300,
        "OPTIONS": {"MAX_ENTRIES": 1000},
    }
}
```

下面逐件拆开讲透。

---

## 2. 分页篇：不只是“能翻页”

### 2.1 为什么必须自定义 Pagination？全局 PAGE_SIZE 不够吗？

DRF 全局 `PAGE_SIZE = 10` 只解决“默认切多少”，没解决三个真实问题：

1. **前端可调 `page_size`，后不管封顶**：`?page_size=10000` 直接全表扫描；
2. **不同接口需求不同**：文章列表要分页，分类/标签只有十几条，分页反而增加前端负担；
3. **搜索 + 大字段**：`?search=xxx` 本来就慢，再允许大 `page_size` 就是雪上加霜。

所以我的原则：**全局给默认值，每个 ViewSet 配自己的分页类**。文章要分页且封顶，分类标签直接关分页：

```python
# backend/articles/views.py
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets

class ArticlePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50  # 血泪值：从 1000 改下来的，见 2.3
    page_size_query_description = "每页条数，默认10，最大50"

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Article.objects.filter(status=Article.Status.PUBLISHED)
    lookup_field = 'slug'
    pagination_class = ArticlePagination
    # ...

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    pagination_class = None  # 十几条数据，直接返回数组，前端省一次解析

class TagViewSet(viewsets.ReadOnlyModelViewSet):
    pagination_class = None
```

`pagination_class = None` 时 DRF 直接返回 `[...] `数组而不是 `{count, next, previous, results}` 包裹，前端 `v-for` 直接用，对小字典表特别友好。

### 2.2 DRF 分页源码：三行看懂执行顺序

`PageNumberPagination.paginate_queryset()` 核心就三步（`rest_framework/pagination.py` 精简）：

```python
def paginate_queryset(self, queryset, request, view=None):
    page_size = self.get_page_size(request)  # 1. 定每页多少：?page_size= or 默认
    if not page_size:
        return None
    paginator = self.django_paginator_class(queryset, page_size)  # 2. Django Paginator 切片
    page_number = request.query_params.get(self.page_query_param, 1)
    try:
        self.page = paginator.page(page_number)  # 3. 取第 N 页，超页抛 404
    except InvalidPage:
        raise NotFound("Invalid page.")
    return list(self.page)
```

关键在 `get_page_size()`：

```python
def get_page_size(self, request):
    if self.page_size_query_param:
        try:
            return _positive_int(
                request.query_params[self.page_size_query_param],
                strict=True,
                cutoff=self.max_page_size  # 超过 max 直接截断，不报错
            )
        except (KeyError, ValueError):
            pass
    return self.page_size
```

两个细节很多人不知道：

- 超过 `max_page_size` **不会报错，而是静默截断**到最大值。所以 `?page_size=500` 在 `max=50` 时实际只返回 50 条 —— 这是保护，不是 bug。
- 传 `?page_size=abc` 或负数时回落到默认 `page_size`，不会 500。

### 2.3 三种分页深度对比：博客到底选哪个？

| 类型 | 参数 | SQL 行为 | 优点 | 缺点 | 用在哪 |
|------|------|---------|------|------|--------|
| PageNumber | `?page=3&page_size=10` | `LIMIT 10 OFFSET 20` | 可跳页，SEO 友好，后台最爱 | 深翻页慢（OFFSET 10000 仍要扫），数据新增时跳页重复/漏 | 文章列表、管理后台，**博客首选** |
| LimitOffset | `?limit=10&offset=20` | `LIMIT 10 OFFSET 20` | 移动端无限滚动灵活 | 无总页数概念，前端要自己算 | App feed 流 |
| Cursor | `?cursor=xxx` | `WHERE id > xxx LIMIT 10` | 深翻页也快，无重复/漏，适合高频写入 | 只能上/下一页，不能跳页，排序字段必须唯一且稳定 | 评论流、点赞流、私信 |

Cursor 举例（评论按时间倒序，`created` 可能重复，必须加 `id` 兜底保证唯一）：

```python
from rest_framework.pagination import CursorPagination

class CommentPagination(CursorPagination):
    page_size = 20
    ordering = "-created_at,-id"  # 双字段保证 cursor 稳定
```

博客 99% 用 `PageNumberPagination` 就够了。文章几百上千篇时 OFFSET 深度不是问题；等你到十万篇那天，再把评论流切成 Cursor 也不迟。

### 2.4 事故复盘：max_page_size=1000 是怎么打挂我的

当时 `ArticleListSerializer` 还没瘦身，`content` 也在列表里。实测（本地 SQLite，120 篇文章，`content` 平均 15KB）：

| 请求 | SQL 时间 | 序列化+传输 | 前端渲染 | 总体 |
|------|---------|------------|---------|------|
| `?page_size=10`（瘦身后） | 22ms | 18ms / 60KB | 流畅 | ~60ms |
| `?page_size=50`（瘦身后） | 45ms | 40ms / 280KB | 正常 | ~100ms |
| `?page_size=500`（含 content，未瘦身） | 310ms | 550ms / 7.5MB | 卡 3s | 860ms+ |

修复是两行，不是一行：

```python
# 1. 封顶从 1000 降到 50
max_page_size = 50
```

```python
# 2. 列表和详情用不同的 Serializer（见 2.5）
def get_serializer_class(self):
    if self.action == "retrieve":
        return ArticleDetailSerializer
    return ArticleListSerializer
```

铁律：**`max_page_size` 按最坏情况算**。公式：`max_page_size × 单条 list 大小 < 500KB`。我的 list 单条约 5KB（title+excerpt+cover+计数），50 条 ≈ 250KB，安全。

### 2.5 列表瘦身 + 详情加料：最被低估的优化

很多教程只讲分页不讲 Serializer，这是错的。分页切的是“多少条”，Serializer 决定的是“每条多大”。两个 Serializer 对比：

```python
# backend/articles/serializers.py（示意，字段按你实际模型调整）
class ArticleListSerializer(serializers.ModelSerializer):
    category = serializers.SlugRelatedField(slug_field="slug", read_only=True)
    class Meta:
        model = Article
        fields = ["slug", "title", "excerpt", "cover_image",
                  "views_count", "likes_count", "created_at", "category"]
        # 注意：没有 content！没有正文！

class ArticleDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        fields = ["slug", "title", "content", "cover_image",
                  "views_count", "likes_count", "created_at",
                  "category", "tags"]
```

效果：列表单条从 ~15KB 降到 ~5KB（在 50 条/页时就是 750KB → 250KB 的差距）。配合 `only()`（见 2.6）连 DB 层面都不查 `content`：

```python
queryset = (
    Article.objects.filter(status=Article.Status.PUBLISHED)
    .only("id", "slug", "title", "excerpt", "cover_image",
          "views_count", "likes_count", "created_at", "category")
)
```

但 `only()` 有个坑：访问未列出的字段会触发额外查询。所以 `retrieve` 详情接口必须用另一个 queryset（或不用 `only`），否则详情页反而 N+1。我的做法是 `get_queryset()` 按 action 区分：

```python
def get_queryset(self):
    base = Article.objects.filter(status=Article.Status.PUBLISHED)
    if self.action == "list":
        return base.select_related("category").prefetch_related("tags").only(
            "id", "slug", "title", "excerpt", "cover_image",
            "views_count", "likes_count", "created_at", "category",
        )
    return base.select_related("category").prefetch_related("tags")
```

### 2.6 分页必须配合 N+1 优化，否则页越小越慢

分页只减少“条数”，不减少“每条触发的 SQL”。如果列表每条都查一次分类、一次标签，10 条就是 1 + 10 + 10 = 21 条 SQL（这正是我上一篇《从 21 条 SQL 到 2 条》里实测的数字）。

标准解法两行：

```python
queryset = (
    Article.objects.filter(status=Article.Status.PUBLISHED)
    .select_related("category")    # ForeignKey：一句 JOIN 搞定
    .prefetch_related("tags")      # ManyToMany：两次查询搞定
)
```

验证方法（任意 View 里临时加）：

```python
from django.db import connection
print(len(connection.queries))  # 列表页应 ≤ 3 条：1 articles + 1 tags + 1 count
```

`count` 是分页自带的 `SELECT COUNT(*)`，翻页必然有一次，这是正常的，别去“优化”掉它。

### 2.7 前端配套：分页组件 + page_size 透传

后端封顶后，前端也要配合。Vue 3 组合式 + Element Plus / 原生都行，核心是三件事：

```vue
<!-- frontend/src/components/ArticleList.vue（示意） -->
<script setup>
import { ref, watch } from 'vue'
import api from '@/utils/api'

const page = ref(1)
const pageSize = ref(10)  // 别超过后端 max_page_size，否则被静默截断还困惑
const total = ref(0)
const articles = ref([])

async function fetchArticles() {
  const { data } = await api.get('/articles/', {
    params: { page: page.value, page_size: pageSize.value }
  })
  // PageNumberPagination 返回包裹结构
  articles.value = data.results
  total.value = data.count
}
watch([page, pageSize], fetchArticles, { immediate: true })
</script>

<template>
  <div v-for="a in articles" :key="a.slug">{{ a.title }}</div>
  <!-- 分页器：total 是 count，不是页数 -->
  <el-pagination
    v-model:current-page="page"
    v-model:page-size="pageSize"
    :page-sizes="[10, 20, 50]"
    :total="total"
    layout="prev, pager, next, sizes"
  />
</template>
```

注意：`page-sizes` 的最大值必须 ≤ 后端 `max_page_size`，否则选 100 实际只回 50，前端 `total/pageSize` 算页数会错位。

### 2.8 分页 5 个常见坑

1. **分类/标签也分页**：十几条数据包一层 `{results}`，前端多写一层解析，纯折腾，直接 `pagination_class = None`。
2. **`max_page_size` 设 1000**：等于没设，见 2.4 事故。
3. **搜索接口不限 `page_size`**：`?search=a` 匹配几百篇 + 大 `page_size`，慢上加慢。搜索强制小页：单独给 `SearchPagination(max_page_size=20)`。
4. **深翻页 `?page=9999` 500**：DRF 会抛 `NotFound("Invalid page.")` 返回 404，这是对的。前端页码别瞎传，用 `count` 算最大页。
5. **排序不稳定导致跳页重复**：按 `created_at` 排序但同一秒多篇，翻页会重复/漏。排序加 `,id` 兜底：`ordering = ["-created_at", "-id"]`。

---

## 3. 缓存篇：PA 无 Redis 也能快 10 倍

### 3.1 Django 缓存框架：业务代码不用关心后端是谁

Django 的 `cache` API 是统一的，换 Redis 还是内存，只改 `settings.CACHES` 一处：

```python
from django.core.cache import cache
cache.get("key")              # 取
cache.set("key", value, 300)  # 存，300秒过期
cache.delete("key")           # 删
cache.get_or_set("key", default_fn, 300)  # 取不到就调函数存
```

这是选型的最大底气：**先用免费的跑起来，上量再换 Redis，业务代码零改动**。

### 3.2 四种缓存后端对比（PA 视角）

| 后端 | 配置难度 | 多 worker 共享？ | 重启丢失？ | 适合 |
|------|---------|-----------------|-----------|------|
| LocMemCache（内存） | 零配置 | 否（每个 worker 各一份） | 是 | PA 免费版起步，博客首选 |
| DatabaseCache（数据库表） | 需 `createcachetable` | 是 | 否 | 多 worker 又买不起 Redis 时 |
| FileBasedCache（文件） | 需目录权限 | 是（同机） | 否 | PA 也可用，但 IO 不如内存 |
| Redis | 需单独服务 + `django-redis` | 是 | 否 | VPS/付费版、上量后 |

PA 免费版没有 Redis 服务，直接 `LocMemCache`：

```python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.locmem.LocMemCache",
        "LOCATION": "blog-cache",
        "TIMEOUT": 300,
        "OPTIONS": {"MAX_ENTRIES": 1000},
    }
}
```

以后迁 Redis 只改这一段：

```python
# pip install django-redis
CACHES = {
    "default": {
        "BACKEND": "django_redis.cache.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379/1",
        "OPTIONS": {"CLIENT_CLASS": "django_redis.client.DefaultClient"},
    }
}
```

### 3.3 决策矩阵：哪些接口值得缓存？

按“读多写少 + 计算贵”排序，只缓存前三类，别全量加：

| 接口 | 读/写比 | 缓存时长 | 失效时机 |
|------|--------|---------|---------|
| 分类/标签列表 | 1000:1 | 1 小时 | 分类/标签增删改时删 key |
| 文章详情 | 100:1 | 5 分钟 | 文章更新时删 key |
| 文章列表第一页（无搜索） | 50:1 | 2 分钟 | 新文章发布时删 key |
| 搜索结果 | 5:1 | 不缓存 | 组合太多，缓存命中率低还占内存 |
| 点赞/评论/订阅（写接口） | 写多 | 永不缓存 | 缓存写接口是 bug |

### 3.4 文章详情：@cache_page 一行搞定 + 原理

```python
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    @method_decorator(cache_page(60 * 5))  # 整页缓存 5 分钟，key 含 URL+query
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
```

`cache_page` 原理：按完整 URL（含 querystring）做 key，命中直接返回上次的 `Response.content`，连 View 都不进。等价手写：

```python
key = f"page:{request.get_full_path()}"
data = cache.get(key)
if data is None:
    response = super().retrieve(...)
    cache.set(key, response.data, 300)
```

### 3.5 分类/标签：手动低阶缓存 + 信号失效

`cache_page` 按 URL 缓存，对分类这种“整表只有一个版本”的数据，用手动 key 更可控：

```python
from django.core.cache import cache
from rest_framework.response import Response

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    pagination_class = None

    def list(self, request, *args, **kwargs):
        data = cache.get("api:categories:v1")
        if data is None:
            qs = Category.objects.annotate(
                article_count=Count(
                    "article",
                    filter=Q(article__status=Article.Status.PUBLISHED),
                )
            )
            data = CategorySerializer(qs, many=True).data
            cache.set("api:categories:v1", data, 3600)
        return Response(data)
```

失效放在 signals（`articles/signals.py`）：

```python
from django.core.cache import cache
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Category, Tag, Article

@receiver([post_save, post_delete], sender=Category)
def clear_category_cache(**kwargs):
    cache.delete("api:categories:v1")

@receiver([post_save, post_delete], sender=Tag)
def clear_tag_cache(**kwargs):
    cache.delete("api:tags:v1")

@receiver([post_save, post_delete], sender=Article)
def clear_article_list_cache(**kwargs):
    # 文章增删改只清列表第一页，详情页靠 cache_page 自然过期
    cache.delete("api:articles:page1")
    # 也可以按 slug 精确清：cache.delete(f"api:article:{instance.slug}")
```

key 里加 `v1` 是版本号技巧：大改版时把 `v1` 改 `v2`，旧缓存自然废弃，比逐个删靠谱。

### 3.6 终极矛盾：浏览量自增 vs 详情缓存，怎么选？

我的 `retrieve` 原来每次都 `views_count + 1`：

```python
def retrieve(self, request, *args, **kwargs):
    instance = self.get_object()
    Article.objects.filter(pk=instance.pk).update(views_count=F("views_count") + 1)
    instance.refresh_from_db(fields=["views_count"])
    return super().retrieve(request, *args, **kwargs)
```

加了 `cache_page` 后，缓存命中时 View 不执行，浏览量就不涨了。三种解法：

| 方案 | 做法 | 精度 | 复杂度 |
|------|------|------|--------|
| A. 详情不缓存 | 只缓存列表，详情每次查库 | 精确 | 最低 |
| B. 缓存 + 浏览量容忍延迟（我用的） | 详情缓存 5 分钟，浏览量 5 分钟延迟 | 近似 | 低 |
| C. 缓存 + 异步埋点 | 详情缓存，前端另调 `POST /articles/<slug>/view/` 单独 +1（可限流） | 精确 | 中 |

C 的埋点接口示例：

```python
@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([AnonRateThrottle])
def track_view(request, slug):
    Article.objects.filter(slug=slug).update(views_count=F("views_count") + 1)
    return Response({"ok": True})
```

小博客选 B，大流量选 C。别为了精确浏览量放弃缓存，因小失大。

### 3.7 缓存三兄弟：穿透、击穿、雪崩

- **穿透**：查不存在的 slug（如 `/articles/xxx-not-exist/`），每次都打到 DB。解法：空结果也缓存 60 秒（`cache.set(key, None, 60)`），或布隆过滤器（小博客用前者就够）。
- **击穿**：热点 key（如首页第一页）刚好过期，瞬间几十个请求全打到 DB。解法：逻辑过期（缓存里存 `expire_at`，过期后第一个请求异步重建，其他仍返回旧值）或 `cache.get_or_set` 加短锁。小博客把过期时间打散（120s/150s/180s 别对齐）即可。
- **雪崩**：重启/批量过期导致所有 key 同时失效。解法：过期时间加随机抖动：`timeout = 300 + random.randint(0, 60)`。

### 3.8 PA 大坑：LocMemCache 多 worker 不共享

PythonAnywhere 生产是多 worker（多进程），`LocMemCache` 是**进程内内存**，每个 worker 各一份。这意味着：

- A worker 清了缓存，B worker 还有旧数据，最多延迟一个缓存周期（2~5 分钟）；
- 对博客可接受（分类晚 5 分钟更新没人发现）；
- 对库存/秒杀不可接受（但博客也没有）。

真介意就换 `DatabaseCache`（多 worker 共享，PA 免费版也可用）：

```bash
python manage.py createcachetable  # 建一张 cache 表
```

```python
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.db.DatabaseCache",
        "LOCATION": "blog_cache_table",
    }
}
```

### 3.9 实测数据（本地 SQLite，120 篇文章）

用 `django-debug-toolbar` 看 SQL，或最土的 `time curl`：

| 接口 | 优化前 | 分页+瘦身后 | 再加缓存（命中） | 总提升 |
|------|--------|------------|-----------------|--------|
| `GET /api/categories/` | 45ms / 3 SQL | 45ms / 1 SQL（annotate） | 3ms / 0 SQL | 15x |
| `GET /api/articles/` 第一页 | 820ms / 21 SQL | 85ms / 3 SQL | 12ms / 0 SQL | 68x |
| `GET /api/articles/<slug>/` | 90ms / 4 SQL | 60ms / 3 SQL | 8ms / 0 SQL | 11x |

第二列到第三列的功臣是上一篇的 N+1 优化（`select_related/prefetch_related`），第三列到第四列是本文的缓存。两篇连起来看效果最完整。

---

## 4. 限流篇：读和写必须分开限

### 4.1 全局限流只是底线，防不住业务 abuse

```python
'anon': '30/minute',
'user': '100/minute',
```

这能挡住“把列表接口当压测打”，但挡不住：1 分钟刷 30 条垃圾评论、1 小时试 30 个订阅邮箱、1 分钟给某篇文章点 30 个赞。**读接口和写接口的“正常频率”差两个数量级，必须分级**。

我的分级表：

| scope | 阈值 | 覆盖接口 | 设计理由 |
|-------|------|---------|---------|
| anon | 30/min | 所有读接口默认 | 正常刷文章 1 分钟点不了 30 页，爬虫会被 429 |
| user | 100/min | 登录读接口 | 登录用户放宽，前端预加载/联想搜索不误伤 |
| comment | 3/min | 评论发表 | 正常人打字+思考 > 20 秒，脚本直接 429 |
| subscribe | 5/hour | 订阅 | 正常用户点一次，拿字典试邮箱的直接封一小时 |
| upload | 100/hour | 图片上传（需登录） | 防烧存储，匿名直接不让传 |

### 4.2 DRF 限流源码：请求进来先过哪一关？

`APIView.initial()` 里（`rest_framework/views.py`）：

```python
def initial(self, request, *args, **kwargs):
    self.check_throttles(request)  # 限流在权限/业务逻辑之前，不通过直接 429
    # ... 然后才是 check_permissions, check_content_negotiation
```

`SimpleRateThrottle.allow_request()` 核心是滑动窗口计数（`rest_framework/throttling.py` 精简）：

```python
def allow_request(self, request, view):
    self.key = self.get_cache_key(request, view)  # key = scope + ident(IP/用户)
    history = self.cache.get(self.key, [])
    now = self.timer()
    # 扔掉窗口外的记录
    while history and history[-1] <= now - self.duration:
        history.pop()
    if len(history) >= self.num_requests:
        return self.throttle_failure()  # 超了 → 429
    return self.throttle_success()      # 没超 → 记录本次时间戳
```

`get_cache_key()` 默认按 IP（匿名）或 user_id（登录）。这意味着**限流计数也存在缓存里** —— 用 `LocMemCache` 时多 worker 各算各的，实际阈值会被放大 N 倍（2 worker ≈ 60/min）。小博客无所谓，大流量必须换共享缓存（Redis/DB）。

### 4.3 四种限流器怎么选？

```python
# 1. AnonRateThrottle：按 IP，匿名用户。点赞这种允许匿名的写接口直接用它。
from rest_framework.throttling import AnonRateThrottle

# 2. UserRateThrottle：按 user_id，登录用户。读接口默认档。
from rest_framework.throttling import UserRateThrottle

# 3. ScopedRateThrottle：按 view.throttle_scope，一个 View 一档，最灵活。
from rest_framework.throttling import ScopedRateThrottle
class CommentViewSet(viewsets.ModelViewSet):
    throttle_scope = "comment"  # 对应 settings 里 'comment': '3/minute'
    throttle_classes = [ScopedRateThrottle]

# 4. 自定义 scope（我博客用的）：语义最清晰，推荐。
class SubscribeThrottle(AnonRateThrottle):
    scope = "subscribe"
```

我用第 4 种，函数视图一行搞定：

```python
# backend/articles/views.py
class SubscribeThrottle(AnonRateThrottle):
    scope = "subscribe"

@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([SubscribeThrottle])
def subscribe_newsletter(request):
    # ...

@api_view(["POST"])
@permission_classes([AllowAny])
@throttle_classes([AnonRateThrottle])  # 点赞走 anon 档
def like_article(request, slug):
    # IP+UA 24小时去重 + F() 原子计数（详见点赞防刷那篇）
    # ...
```

评论（`backend/comments/views.py` 同理）：

```python
class CommentThrottle(AnonRateThrottle):
    scope = "comment"

class CommentViewSet(viewsets.ModelViewSet):
    throttle_classes = [CommentThrottle]
    # ...
```

### 4.4 真实大坑：XFF 取 IP 取错，限流形同虚设

PA 生产在 Nginx 反代后面，`REMOTE_ADDR` 是代理 IP，所有用户看起来是同一个 IP —— 不特殊处理的话，要么全被限，要么全不限。

DRF 取 IP 看 `get_ident()`：优先 `X-Forwarded-For`，没有才用 `REMOTE_ADDR`。而 `XFF` 格式是 `client, proxy1, proxy2`，**最左边是客户端声称的（可伪造），最右边是可信代理追加的（最可信）**。

错误写法（很多博客都这么写）：

```python
ip = request.META.get("HTTP_X_FORWARDED_FOR", "").split(",")[0].strip()
# 左边第一个！攻击者 curl -H "X-Forwarded-For: 1.2.3.4" 随便换 IP，
# 限流和点赞去重全部绕过。
```

正确写法（我博客现在用的）：

```python
xff = request.META.get("HTTP_X_FORWARDED_FOR", "")
if xff:
    ip = xff.split(",")[-1].strip()  # 最右边：PA 前端追加的出口，可信
else:
    ip = request.META.get("REMOTE_ADDR", "")
ip = (ip or "")[:64]
```

复现伪造（本地试）：

```bash
# 正常请求
curl -X POST http://127.0.0.1:8000/api/articles/hello/like/
# 伪造 XFF，每次换 IP，错误写法下可无限点赞
curl -H "X-Forwarded-For: 9.9.9.$RANDOM" -X POST http://127.0.0.1:8000/api/articles/hello/like/
```

**铁律：限流 key 的 IP 取法必须和业务去重 key 的 IP 取法一致**，否则限流和去重各说各话，形同虚设。

### 4.5 前端：429 不是报错，是正常流程

DRF 429 响应头带 `Retry-After`（秒）。前端 axios 拦截器统一处理：读接口静默重试一次，写接口友好提示：

```js
// frontend/src/utils/api.js
import axios from 'axios'

const api = axios.create({
  baseURL: 'https://zhoujun123.pythonanywhere.com/api/',
  timeout: 10000,
})

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const { response, config } = err
    if (response?.status === 429 && !config._retried) {
      config._retried = true
      // 读接口：按 Retry-After 等一下重试一次
      if (config.method === 'get') {
        const wait = Number(response.headers['retry-after'] || 5)
        await new Promise((r) => setTimeout(r, wait * 1000))
        return api.request(config)
      }
      // 写接口：点赞/评论/订阅被限，给人话而不是报错
      const action = config.url.includes('subscribe') ? '订阅'
        : config.url.includes('comment') ? '评论'
        : '点赞'
      alert(`${action}太频繁啦，稍后再试～`)
    }
    return Promise.reject(err)
  }
)

export default api
```

再配个按钮级防抖（点赞连点是 429 最大来源）：

```vue
<script setup>
import { ref } from 'vue'
const liking = ref(false)
async function like(slug) {
  if (liking.value) return
  liking.value = true
  try { await api.post(`/articles/${slug}/like/`) }
  finally { setTimeout(() => (liking.value = false), 1500) }
}
</script>
```

### 4.6 压测 + 监控：阈值不是拍脑袋定的

本地压测（`ab` 或 `locust`，PA 免费版别在生产压）：

```bash
# 匿名 35 次/分打列表，第 31 次起应 429
for i in $(seq 1 35); do curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/api/articles/; done
# 评论 1 分钟刷 5 次，第 4 次起应 429
for i in 1 2 3 4 5; do curl -s -X POST http://127.0.0.1:8000/api/comments/ -H "Content-Type: application/json" -d '{"content":"test"}'; echo; done
```

Django 日志里把 429 单独记（`settings.py`）：

```python
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "loggers": {
        "django.request": {"handlers": ["console"], "level": "WARNING"},
    },
}
```

上线后看一周 429 比例调阈值：正常用户 429 率 > 1% 说明太严，评论垃圾 > 0 说明太松。我的 `comment 3/min` 就是从 10/min 收紧下来的 —— 10/min 时一晚上 40 条广告。

---

## 5. 组合篇：一个 ViewSet 的最终形态 + 总压测表

把分页、N+1、缓存、限流（全局）叠在一起：

```python
# backend/articles/views.py（最终形态，精简注释版）
from django.db.models import Count, F, Q
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import viewsets, filters

class ArticlePagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 50

class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    lookup_field = "slug"
    pagination_class = ArticlePagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = {"category__slug": ["exact"], "tags__slug": ["exact"]}
    search_fields = ["title", "content"]

    def get_queryset(self):
        base = Article.objects.filter(status=Article.Status.PUBLISHED)
        if self.action == "list":
            return (
                base.select_related("category")
                .prefetch_related("tags")
                .only("id", "slug", "title", "excerpt", "cover_image",
                      "views_count", "likes_count", "created_at", "category")
                .order_by("-created_at", "-id")
            )
        return base.select_related("category").prefetch_related("tags")

    def get_serializer_class(self):
        return ArticleDetailSerializer if self.action == "retrieve" else ArticleListSerializer

    @method_decorator(cache_page(120))  # 列表整页 2 分钟
    def list(self, request, *args, **kwargs):
        # 搜索请求穿透缓存（组合太多不值得）
        if request.query_params.get("search"):
            return super().list(request, *args, **kwargs)
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(300))  # 详情 5 分钟，浏览量容忍延迟
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)
```

总压测（120 篇，SQLite，本地）：

| 阶段 | 列表第一页 | 分类 | 详情 | 说明 |
|------|-----------|------|------|------|
| 初始（无分页封顶+无瘦身+N+1） | 820ms / 21 SQL | 45ms / N+1 | 90ms | `page_size=500` 直接去世 |
| + 分页封顶50 + 瘦身 + N+1 | 85ms / 3 SQL | 20ms / 1 SQL | 60ms / 3 SQL | 上一篇 + 本篇分页的功劳 |
| + 缓存命中 | 12ms / 0 SQL | 3ms / 0 SQL | 8ms / 0 SQL | 本篇缓存的功劳 |
| + 限流（压测 100 并发脚本） | 正常用户无感，脚本 429 | 同左 | 同左 | 限流不提速，但保命 |

---

## 6. 上线 Checklist（15 项，直接抄）

**分页（5）**

- [ ] 每个 ViewSet 有独立分页类，`max_page_size ≤ 50`
- [ ] 列表 Serializer 不含 `content/body` 大字段
- [ ] 小字典表（分类/标签）`pagination_class = None`
- [ ] 排序字段加唯一兜底：`ordering = ["-created_at", "-id"]`
- [ ] 前端 `page-sizes` 最大值 ≤ 后端 `max_page_size`

**缓存（5）**

- [ ] `CACHES` 已配（PA 先 LocMem，上量换 Redis，只改一处）
- [ ] 分类/标签/详情/首页第一页已加缓存，搜索/写接口没加
- [ ] 增删改信号里 `cache.delete` 对应 key，key 带版本号 `v1`
- [ ] 过期时间打散 + 抖动，避免雪崩对齐
- [ ] 详情缓存与浏览量方案已定（B 容忍延迟 or C 异步埋点）

**限流（5）**

- [ ] 读（anon/user）和写（comment/subscribe/upload）分档
- [ ] 生产只留 `JSONRenderer`，关 Browsable API
- [ ] XFF 取最右边 IP，限流 key 与去重 key 一致
- [ ] 前端 429：GET 重试一次，写操作友好提示 + 按钮防抖
- [ ] 本地压测验证 429 生效，上线后看一周日志调阈值

### 高频 FAQ（评论区 Top 8）

**Q1：PAGE_SIZE 设多少？10 还是 20？**
A：PC 列表 10，移动端无限滚动 15~20。核心看首屏渲染时间，不是后端 Make it bigger。

**Q2：max_page_size 50 会不会被前端骂？**
A：把 `page_size=50` 的 250KB 和 `=500` 的 7.5MB 摆出来，没人骂你。真要导出全量，走单独的导出接口 + 异步任务，别走列表。

**Q3：LocMemCache 重启就丢，要不要紧？**
A：缓存丢了只是变慢，不丢数据。PA 免费版每天会回收，刚回收后几分钟慢一点，可接受。

**Q4：缓存和 JWT 登录冲突吗？**
A：列表/详情是公开读接口，不按用户缓存，没冲突。千万别缓存 `/me`、`/admin/*` 这种按用户的接口。

**Q5：限流把正常用户误伤了怎么办？**
A：先看是不是前端循环调用（最常见），再看阈值。`anon 30/min` 对人足够，对脚本不够 —— 这正是我们想要的。

**Q6：评论 3/min 会不会太严？**
A：正常人连发 3 条评论 within 1 分钟的概率极低。真有（比如作者自己回评论），登录后走 `user 100/min` 档放宽，或给作者白名单。

**Q7：要不要给爬虫/搜索引擎放行？**
A：搜索引擎按 `User-Agent` 识别成本高，小博客不需要。真被 429 的是恶意爬虫，放行它干嘛。

**Q8：SQLite 撑得住吗？要不要直接上 Postgres？**
A：读多写少 + 三件套后，SQLite 撑几千日活没问题。写多（评论/点赞高频）或要上 Postgres 全文检索时再迁，见下一篇预告。

---

## 结语

分页解决“一次拿多少”，缓存解决“多久查一次库”，限流解决“坏人刷怎么办”。三件套没有银弹，真正的功夫在阈值：**先保守上线（10/50、2~5 分钟、3/min），再看日志和 429 慢慢调**。我的所有值都是被真实流量打过才定下来的，直接抄不会错太多。

下一篇预告：**《从 SQLite 到 PostgreSQL：Django 生产数据库迁移避坑》** —— 当文章过万、评论并发上来，SQLite 写锁会成为下一个瓶颈。到时讲 `pgloader` 迁移、PA 上配 Postgres、JSONB 存标签、全文检索替代 `icontains`，敬请期待。

> 完整代码：`backend/blog_api/settings.py`、`backend/articles/views.py`、`backend/articles/serializers.py`
> 觉得有用欢迎点赞 + 订阅，评论区聊聊你的 `max_page_size` 和 throttle 阈值是多少～
