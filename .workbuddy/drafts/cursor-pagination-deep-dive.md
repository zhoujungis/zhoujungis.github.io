> 发布信息建议：
> - slug：`cursor-pagination-deep-dive`
> - 分类：技术教程
> - 标签：后端、Django、DRF、数据库、性能优化
> - 封面建议：数据库/仪表盘类 unsplash 图
> - 建议阅读时间：约 18 分钟 | 难度：中级

# 为什么 LIMIT 100000, 20 会越来越慢？——深分页与游标分页的原理与实战

**适用读者**：列表接口翻得越深越慢、慢查询日志里频繁出现 `LIMIT ... OFFSET ...` 的后端工程师
**技术栈**：原理与语言无关，代码示例以 Django / DRF / PostgreSQL（兼容 MySQL 8）为准
**阅读时间**：约 18 分钟 | **难度**：中级 | **收获**：一套"什么时候换游标分页、怎么换、坑在哪"的完整方案

## 前言：慢查询日志里的一条 SQL

事情的起因是慢查询日志里的一条 SQL：

```sql
SELECT id, title, created_at
FROM article
ORDER BY created_at DESC, id DESC
LIMIT 20 OFFSET 500000;
```

这是博客文章列表接口的查询。数据量刚过百万时一切正常，但随着文章表慢慢长大，用户翻到第两万多页（搜索引擎爬虫和某些"一直往下刷"的客户端很喜欢这么干）时，这条 SQL 的耗时从 3ms 一路涨到了 2 秒以上，数据库 CPU 跟着抖动，所有走同一个连接池的请求都被拖慢。

第一反应通常是"加索引"。但索引是有的——`(created_at DESC, id DESC)` 就是为了这条 ORDER BY 建的。加了索引还这么慢，说明问题不在"没走索引"，而在 `OFFSET` 这个东西本身的工作方式。

这篇文章把深分页这个问题从头到尾讲清楚：OFFSET 到底慢在哪、游标分页为什么能根治、生产环境落地时的那些坑，以及什么时候不该用它。

## 1. OFFSET 到底慢在哪：把"跳过"想成"读完再扔"

很多人对 `LIMIT 20 OFFSET 500000` 的直觉是"数据库直接跳到第 500001 条"。**这个直觉是错的**。SQL 里没有"随机访问第 N 行"这种通用能力，数据库实际做的是：

1. 按索引顺序读出第 1 ~ 500020 行（或回表取出需要的列）；
2. 把前 500000 行**全部丢弃**；
3. 返回剩下的 20 行。

也就是说，OFFSET 的工作量 = offset + limit。页码越深，要"读完再扔"的行越多，耗时线性上涨。这正是它 O(offset) 复杂度的来源。

用 PostgreSQL 验证一下，100 万行的表，同样的 LIMIT，只改 OFFSET：

```sql
EXPLAIN ANALYZE
SELECT id, title FROM article
ORDER BY created_at DESC, id DESC
LIMIT 20 OFFSET 0;
-- Limit  (cost=0.56..0.86 rows=20 width=xx) (actual time=0.03..0.09 rows=20)

EXPLAIN ANALYZE
SELECT id, title FROM article
ORDER BY created_at DESC, id DESC
LIMIT 20 OFFSET 500000;
-- Limit  (cost=10022.44..10022.74 rows=20 width=xx) (actual time=612.4..612.5 rows=20)
```

执行计划里能看到，第二条的启动成本（cost 前段）非常高——数据库在 Limit 节点开始"过滤"之前，先把 50 万行扫了一遍。如果 SELECT 的列不在索引里，还要每行做一次回表，代价更大。

有一个常见的"优化"是把查询改写成延迟关联（deferred join），先在覆盖索引上把主键筛出来，再回表：

```sql
SELECT a.id, a.title
FROM article a
JOIN (
    SELECT id FROM article
    ORDER BY created_at DESC, id DESC
    LIMIT 20 OFFSET 500000
) t ON a.id = t.id
ORDER BY a.created_at DESC, a.id DESC;
```

这确实能把回表次数从 500020 次降到 20 次，通常能快一个数量级。**但它没有改变 O(offset) 的本质**——子查询依然要扫过 50 万个索引条目。数据再涨、页码再深，延迟关联也会慢到不可用。它是"缓解"，不是"根治"。

## 2. 一道简单的数学题

把 OFFSET 的问题量化一下。假设列表页每页 20 条，用户翻到第 p 页时，数据库要处理的行数是 `20 × p`：

| 页码 | OFFSET | 扫描行数 | 100 万行表实测耗时 |
|---|---|---|---|
| 第 1 页 | 0 | 20 | ~0.1 ms |
| 第 100 页 | 1980 | 2,000 | ~3 ms |
| 第 1,000 页 | 19,980 | 20,000 | ~25 ms |
| 第 10,000 页 | 199,980 | 200,000 | ~250 ms |
| 第 25,000 页 | 499,980 | 500,000 | ~600 ms+ |

（实测数据为 PostgreSQL 15，SSD，覆盖索引扫描的大致量级，仅供参考。）

问题不只是单次查询慢。深分页请求往往集中在少数客户端（爬虫、批量拉数据的脚本、无限滚动的瀑布流），它们会连续发起一串越来越深的分页请求，把数据库缓冲池里真正有用的热点数据反复挤出去，**拖慢的是全站所有查询**。这也是为什么深分页经常和"数据库 CPU 突刺"一起出现在告警里。

## 3. 游标分页的核心思想：把"第几页"换成"上一页最后一条"

OFFSET 分页的语义是"跳过前 N 条"。游标分页（keyset pagination，也叫游标/滚动分页）换了一种提问方式：

> "我不告诉你跳过多少条，我告诉你**上一页最后一条是什么**，你从它后面继续给我 20 条。"

回到上面的例子，客户端第一次请求拿到第 1 页后，把最后一条的排序键（`created_at`, `id`）带回来，服务端据此构造查询：

```sql
SELECT id, title, created_at
FROM article
WHERE (created_at, id) < ('2026-09-01 12:00:00+08', 86400)
ORDER BY created_at DESC, id DESC
LIMIT 20;
```

`(created_at, id) < (x, y)` 是行值比较（row value comparison），语义是字典序比较：`created_at < x`，或者 `created_at = x AND id < y`。

这个查询的执行路径完全不同：索引是按 `(created_at DESC, id DESC)` 有序存放的，定位到 `(x, y)` 的位置就是一次索引 seek，之后顺序读 20 条即止。**无论翻到多深，扫描的行数永远恒定为 limit**，复杂度从 O(offset) 变成 O(1)（相对页深而言）。

对照理解：

| | OFFSET 分页 | 游标分页 |
|---|---|---|
| 定位方式 | 跳过 N 条（读完再扔） | 索引 seek 到起点 |
| 复杂度 | O(offset)，随页深线性恶化 | O(limit)，与页深无关 |
| 客户端传参 | page=N | cursor（上一页末尾的排序键） |
| 跳到任意页 | 支持 | 天然不支持 |
| 翻页中插入新数据 | 会看到重复行 | 不会重复（下一节细说） |
| 依赖条件 | 无 | 排序键上有合适索引，且键值唯一 |

## 4. 最简实现：自增主键游标

如果列表恰好按 `id` 倒序（很多"最新动态"类列表就是），游标分页可以简单到只有一行 WHERE：

```sql
SELECT id, title FROM article
WHERE id < 86400
ORDER BY id DESC
LIMIT 20;
```

Django ORM 写法：

```python
def get_page(last_id: int | None, size: int = 20):
    qs = Article.objects.order_by("-id")
    if last_id is not None:
        qs = qs.filter(id__lt=last_id)
    return list(qs[:size])
```

这个版本适合当理解游标分页的起点，但直接上生产有两个问题：

1. **只支持按 id 排序**。产品上常见的"按发布时间排序、时间相同时按 id 稳定"需要复合排序键；
2. **游标裸奔**。客户端可以随意猜测和构造 `last_id`，对于"动态流"这类接口，等于把内部主键暴露出去，还容易被脚本遍历。

这两个问题，就是第 5 节要解决的事。

## 5. 生产级落地的五个细节

### 5.1 排序键必须"唯一且稳定"——复合游标

只按 `created_at` 排序有一个致命细节：**时间戳可能重复**（同一秒/同一毫秒发布多条，或者 `created_at` 只有秒级精度）。如果游标只带 `created_at`，翻页边界正好落在重复值中间时，这些行要么丢、要么重。

解法是加一个 tie-breaker，把排序键做成复合键 `(created_at, id)`——`id` 唯一，保证整体排序全序唯一；`created_at` 满足业务排序需求。索引也照此建：

```sql
CREATE INDEX idx_article_feed ON article (created_at DESC, id DESC);
```

对应的 WHERE，在 PostgreSQL 里可以直接用行值比较（PG 优化器能正确展开它）：

```sql
WHERE (created_at, id) < ('2026-09-01 12:00:00+08', 86400)
```

MySQL 8 的优化器对行值构造器（row constructor）的索引利用不理想，建议手动展开成等价的 OR 形式：

```sql
WHERE created_at < '2026-09-01 12:00:00'
   OR (created_at = '2026-09-01 12:00:00' AND id < 86400)
```

（注意是 OR，不是 AND，也别写反比较方向——这是游标分页最常见的 bug 来源。）

### 5.2 游标要做成不透明字符串，并加签名

游标不应该让客户端传裸的 `last_id=86400`，而应该是一个服务端签发、客户端原样回传的不透明字符串，例如：

```text
cursor=gAAAAABnZxk3...（base64url）
```

服务端编码和解码：

```python
import base64, json, hmac, hashlib
from django.conf import settings

_SECRET = settings.SECRET_KEY.encode()

def encode_cursor(payload: dict) -> str:
    raw = json.dumps(payload, separators=(",", ":")).encode()
    sig = hmac.new(_SECRET, raw, hashlib.sha256).digest()[:8]
    return base64.urlsafe_b64encode(sig + raw).decode().rstrip("=")

def decode_cursor(cursor: str) -> dict | None:
    if not cursor:
        return None
    try:
        data = base64.urlsafe_b64decode(cursor + "=" * (-len(cursor) % 4))
        sig, raw = data[:8], data[8:]
        expected = hmac.new(_SECRET, raw, hashlib.sha256).digest()[:8]
        if not hmac.compare_digest(sig, expected):
            raise ValueError("bad signature")
        return json.loads(raw)
    except Exception:
        raise ValidationError("无效的游标")
```

签名的作用有两层：防止客户端篡改游标去"遍历"不该遍历的数据；也防止乱传的排序键让数据库走全表扫描（配合下面的白名单校验，双保险）。

### 5.3 NULL 值排序的坑

如果排序键可能为 NULL（比如草稿文章没有 `published_at`），必须先弄清数据库的默认行为：

- **PostgreSQL**：`DESC` 排序时 NULL 默认排在**最前面**（等价于 `NULLS FIRST`）；
- **MySQL**：`DESC` 时 NULL 排在**最后面**。

两个库行为相反，跨库迁移时会直接翻车。建议显式声明，别依赖默认值：

```sql
ORDER BY created_at DESC NULLS LAST, id DESC
```

或者更干脆：在表上把排序键定义为 `NOT NULL DEFAULT xxx`，让游标永远不碰 NULL。含 NULL 的排序键 + 游标分页 = 难以复现的"偶发丢数据"，能避开就避开。

### 5.4 "翻页期间数据在变"的快照语义

OFFSET 分页有个隐蔽的毛病：翻到第 3 页时有人发了新文章，所有行整体后移，第 2 页看过的内容会再次出现在第 3 页。游标分页天然免疫这个问题——游标锚定的是"上一页最后一条的位置"，中间插入了多少新行都不影响下一次查询的起点。这也是信息流类产品全部使用游标分页的根本原因。

但注意它不是银弹：

- **新增**：不丢不重，游标分页天然正确；
- **删除**：如果上一页的最后一条被删了，游标依然有效（WHERE 条件仍然能定位到正确区间，因为比较是基于排序键的值而不是行的存在性）——这是用 `(created_at, id)` 这种"值游标"相对用主键位置的好处；
- **排序键被更新**（比如按 `updated_at` 排序，而这条数据刚被编辑过）：它可能"跳"到更早的位置，导致客户端看到重复。按会被更新的字段排序时要想清楚这个语义，能按不可变字段（`created_at`、`id`）排序就不要按 `updated_at`。

### 5.5 总数怎么办：COUNT 的代价与"没有下一页"探测

OFFSET 分页可以顺手返回总页数，客户端也因此习惯了"共 1,024 条，跳到最后一页"。换成游标分页后，这些都要重新设计：

- **精确 COUNT(*) 是另一种深分页**。PG 的 count 需要扫全表或全索引，百万行表上一次 count 就是几百毫秒，缓存命中率还低；
- **用估算值**：PG 从 `pg_class.reltuples`、MySQL 从 `SHOW TABLE STATUS` 的 Rows 列拿行数估算，展示成"约 100 万+"，成本接近零；
- **判断有没有下一页**：标准做法是每次多取一条——`LIMIT 21` 取 21 条，取满 21 条说明还有下一页，只返回前 20 条。免去一次单独的 exists 查询。

产品设计上接受这个变化：**无限滚动/加载更多**用游标分页；**跳页 + 精确总数**（比如管理后台）保留 OFFSET 分页。两者不冲突，按场景选。

## 6. 一个可直接抄的 DRF 实现

DRF 自带的 `CursorPagination` 已经实现了签名游标，但只支持单一 `ordering` 且游标结构是私有的。下面的自定义分页类支持复合排序键、双向翻页（上一页/下一页），游标带 HMAC 签名：

```python
# core/pagination.py
import base64, json, hmac, hashlib
from collections import OrderedDict
from django.core.exceptions import ValidationError
from rest_framework.pagination import BasePagination
from rest_framework.response import Response

SECRET = "换成一个独立的 32 位以上随机串"  # 不要复用 SECRET_KEY


def _sign(raw: bytes) -> bytes:
    return hmac.new(SECRET.encode(), raw, hashlib.sha256).digest()[:8]


def encode_cursor(payload: dict) -> str:
    raw = json.dumps(payload, separators=(",", ":")).encode()
    return base64.urlsafe_b64encode(_sign(raw) + raw).decode().rstrip("=")


def decode_cursor(cursor: str) -> dict:
    if not cursor:
        return {}
    try:
        data = base64.urlsafe_b64decode(cursor + "=" * (-len(cursor) % 4))
        sig, raw = data[:8], data[8:]
        if not hmac.compare_digest(sig, _sign(raw)):
            raise ValueError
        return json.loads(raw)
    except Exception:
        raise ValidationError("无效的游标参数")


class KeysetPagination(BasePagination):
    """按 (created_at, id) 倒序的游标分页。
    前提：模型上有 (created_at, id) 索引，且两个字段均 NOT NULL。"""

    page_size = 20
    cursor_query_param = "cursor"

    def paginate_queryset(self, queryset, request, view=None):
        self.request = request
        self.page_size = self.get_page_size(request)
        cur = decode_cursor(request.query_params.get(self.cursor_query_param, ""))
        # 游标携带上一页末尾的 (created_at, id)；
        # direction=next 表示向更旧翻，prev 表示向更新翻
        direction = cur.get("d", "next")
        if "t" in cur:
            ts, pid = cur["t"], cur["i"]
            if direction == "next":
                queryset = queryset.filter(
                    Q(created_at__lt=ts) | Q(created_at=ts, id__lt=pid)
                ).order_by("-created_at", "-id")
            else:  # prev：取上一页 = 取该位置之前(更新方向)的 size 条后反转
                queryset = queryset.filter(
                    Q(created_at__gt=ts) | Q(created_at=ts, id__gt=pid)
                ).order_by("created_at", "id")
        else:
            direction = "next"
            queryset = queryset.order_by("-created_at", "-id")

        rows = list(queryset[: self.page_size + 1])  # 多取 1 条探测下一页
        self.has_next = len(rows) > self.page_size
        rows = rows[: self.page_size]
        if direction == "prev":
            rows.reverse()
        self._rows = rows
        return rows

    def get_paginated_response(self, data):
        first, last = (self._rows[0], self._rows[-1]) if self._rows else (None, None)
        def cur_of(direction, row):
            if row is None:
                return None
            return encode_cursor({"d": direction, "t": row.created_at.isoformat(), "i": row.id})
        return Response(OrderedDict([
            ("next", cur_of("next", last) if self.has_next else None),
            ("previous", cur_of("prev", first) if first else None),
            ("results", data),
        ]))
```

配套的索引和视图：

```python
class Article(models.Model):
    ...
    class Meta:
        indexes = [models.Index(fields=["-created_at", "-id"])]
        # PG 里 (-created_at, -id) 索引同样支持 ASC 查询的反向扫描，一个索引够用

class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    pagination_class = KeysetPagination
```

客户端的使用方式变成：

```text
GET /api/articles?                  → 第一页，返回 {next, previous, results}
GET /api/articles?cursor=gAAAAAB... → 下一页，cursor 原样传上一次响应里的 next
```

如果不想自己维护这套逻辑，DRF 内置的 `CursorPagination` 也可以直接用——它同样基于签名游标，只是在"指定排序字段的灵活性"上弱一些，用之前读一遍它的源码确认游标结构和排序键的选择（它的默认游标依赖 `created_at`，跨分页期间字段值被更新时同样适用 5.4 节的语义讨论）。

## 7. 改造前后的性能对比

同一张 100 万行的文章表（PostgreSQL 15，覆盖索引），每页 20 条：

| 场景 | OFFSET 分页 | 延迟关联 | 游标分页 |
|---|---|---|---|
| 第 1 页 | ~0.1 ms | ~0.2 ms | ~0.2 ms |
| 第 1,000 页 | ~25 ms | ~4 ms | ~0.3 ms |
| 第 10,000 页 | ~250 ms | ~35 ms | ~0.3 ms |
| 第 25,000 页 | ~600 ms | ~90 ms | ~0.3 ms |
| 全链路爬完 5 万页总耗时 | 数十分钟 | 数分钟 | 约 2 分钟（受网络 RTT 限制） |

三个观察：

1. **游标分页的成本是一条水平线**，与页深完全无关——这是它相对另外两个方案的本质优势；
2. **延迟关联是廉价的止血手段**：改动只有一条 SQL，在页深不超过几千时收益明显，适合作为"暂时不能改接口"时的过渡方案；
3. 爬虫场景下，游标分页让"全量拉取"的成本从随数据量平方增长，变成线性增长——这次改造后，搜索引擎抓取对数据库的压力几乎降为零。

## 8. 什么时候不要用游标分页

游标分页不是万金油，出现这些情况时，OFFSET（或干脆不分页）可能更合适：

- **用户需要跳页和精确总数**：管理后台、报表类页面，翻页 UI 是"第 3 页 / 共 47 页"。这类场景数据量通常可控，OFFSET + 合理索引 + 延迟关联足够；
- **结果集很小**：几百行的字典表，直接全量返回加客户端分页，省掉所有服务端分页的复杂度；
- **排序必须由动态计算决定**：按"热度 = 点赞×2 + 评论"这类计算字段排序，且计算无法落到索引上，游标定位就无从谈起——要么把热度物化成列并建索引，要么接受慢查询加缓存；
- **接口已经稳定运行、页深很浅**：改造成本（客户端配合改传参）大于收益，先用延迟关联止血即可。

一个务实的迁移路径：**老接口不动，新接口直接游标分页；最深的那个流量入口（通常是信息流/列表 API）优先改造**。深分页流量往往高度集中在一两个接口上，改造一两个接口就能消掉大部分慢查询。

## 上线 Checklist

- [ ] 排序键是否唯一且稳定？复合键 `(created_at, id)`，tie-breaker 必须有
- [ ] `(created_at, id)` 上的索引建了吗？方向与 ORDER BY 一致
- [ ] 排序键两个字段都 NOT NULL 了吗？含 NULL 时显式声明 NULLS LAST
- [ ] 游标加 HMAC 签名 + base64url 了吗？非法游标返回 400 而不是 500
- [ ] `LIMIT size + 1` 探测下一页，而不是单独发 exists 查询
- [ ] 总数改为估算值或干脆去掉，产品确认接受"不能跳页"
- [ ] MySQL 下行值比较是否展开为 OR 形式？
- [ ] 客户端文档写清楚：cursor 原样回传，不解析、不过期重试要重置到第一页
- [ ] 慢查询日志确认深分页 SQL 消失，压测翻 1000 页对比耗时

## 结语

深分页的本质是一句话：**OFFSET 让数据库为"跳过"买单，游标让数据库为"定位"干活**。跳过的成本随页深线性增长，而 B+ 树上定位一次的成本是常数。

改造本身不难——一个复合排序键、一个签名游标、一个 `LIMIT n+1` 的探测，两三百行代码。真正的工作量在于说服产品和客户端接受"不能跳页"的交互变化，以及梳理清楚排序字段的快照语义。把这两件事想清楚，剩下的都是体力活。

如果你的慢查询日志里也开始出现深分页 SQL，希望这篇能帮你一次改到位。
