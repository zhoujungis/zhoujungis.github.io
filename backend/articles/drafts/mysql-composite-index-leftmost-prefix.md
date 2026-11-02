---
title: MySQL 联合索引最左前缀：为什么 (a,b) 查不了 b
slug: mysql-composite-index-leftmost-prefix
category: database
tags: [MySQL, 索引, 数据库, 性能优化]
status: draft
description: 联合索引不是把两列拼在一起，而是按 (a,b) 的顺序建了一棵 B+ 树。本文从 B+ 树的排序规则解释最左前缀、范围查询之后为什么失效、以及联合索引的列顺序该怎么排。
---

> 结论先行：`INDEX(a, b)` 是按「先 a 后 b」排序的一棵 B+ 树，不是按 a 和 b 各建一棵。想让 b 起作用，必须先能定位 a——这就是最左前缀。它不是优化器的限制，是 B+ 树的物理结构决定的。

## 联合索引长什么样

```sql
CREATE TABLE events (
    id      BIGINT PRIMARY KEY AUTO_INCREMENT,
    uid     BIGINT NOT NULL,
    kind    TINYINT NOT NULL,
    ts      DATETIME NOT NULL,
    payload JSON,
    KEY idx_uid_kind_ts (uid, kind, ts)
) ENGINE=InnoDB;
```

`idx_uid_kind_ts` 的叶子顺序大致是：

```
(uid=1, kind=1, ts=10:00) → (uid=1, kind=1, ts=10:05) → (uid=1, kind=2, ts=09:00)
→ (uid=2, kind=1, ts=08:00) → ...
```

排序规则是**字典序**：先比 `uid`，`uid` 相同再比 `kind`，`kind` 相同再比 `ts`。

于是：

- 给定 `uid`，这一段记录是连续的 → 能快速定位；
- 只给 `kind`，记录散落在所有 `uid` 段里 → 没法用这棵树定位；
- 给 `uid` 和 `ts`、跳过 `kind` → `ts` 只在每个 `kind` 段内有序，全局无序 → 也不能用来定位。

## 能用到索引的写法

```sql
-- 全都能用：等值等值等值
WHERE uid = 1 AND kind = 2 AND ts = '2026-01-01 10:00:00'

-- 能用前两列；ts 还能用于过滤（ICP），但不能用于定位
WHERE uid = 1 AND kind = 2

-- 只能用到 uid；kind 和 ts 退化成回表后的过滤
WHERE uid = 1

-- 只有 uid 能用于定位（a=… 和 b=… 顺序无关，优化器会调整）
WHERE uid = 1 AND ts = '2026-01-01 10:00:00'
```

最后一条常被误解：`WHERE uid = 1 AND ts = ...` 能用到 `uid`，但 `ts` 不行，因为 `kind` 断了。它可能显示 `Using index condition`，那是把 `ts` 条件下推到索引层做过滤，减少了回表次数，但**依然要扫 `uid=1` 的全部记录**。

## 范围查询之后，后面的列就「降级」了

```sql
WHERE uid = 1 AND kind > 1 AND ts = '2026-01-01 10:00:00'
```

`kind > 1` 是范围条件。范围扫描的输出在 `ts` 维度上不再全局有序，所以 `ts` 不能继续用于索引定位。它最多作为索引条件下推的过滤条件。**规律：等值列在前，范围列放最后。**

如果业务里 `ts` 的等值查询很常见，可以考虑 `(uid, ts, kind)` 而不是 `(uid, kind, ts)`——列顺序应按「等值查询频率 + 区分度」排，不是按建表字段顺序。

## 联合索引与排序

`ORDER BY` 也想蹭索引：

```sql
-- 能用索引顺序，免 filesort
SELECT * FROM events WHERE uid = 1 ORDER BY kind, ts;

-- 不行：跳过了 kind
SELECT * FROM events WHERE uid = 1 ORDER BY ts;

-- 不行：方向相反，除非 MySQL 8 的降序索引
SELECT * FROM events WHERE uid = 1 ORDER BY kind ASC, ts DESC;
```

`ORDER BY` 的列必须和索引列顺序一致，且方向一致（MySQL 8 支持 `DESC` 索引，但建索引时要显式写 `kind DESC`）。另外，如果 `WHERE` 里对 `uid` 是范围查询，`ORDER BY kind` 也用不上——范围扫描后 `kind` 不再全局有序。

## 列顺序怎么排

一个实用的决策顺序：

1. **等值查询的列放最前**，尤其是选择性高、几乎每个查询都带的列（比如 `uid`、`tenant_id`）；
2. **范围查询列放最后**（`ts`、`amount > ?`）；
3. **排序/分组列**如果稳定，放在等值列之后、范围列之前，可以直接免 filesort；
4. **覆盖索引**：把 `SELECT` 里高频出现的少量列追加到末尾，换取 `Using index`。

不要为每个查询建一条索引。索引不是免费的：每个二级索引都是一棵额外的 B+ 树，写入时要维护，页分裂时也要跟着搬。索引越多，写入越慢、buffer pool 越紧张。先用 `EXPLAIN` 找出真正的慢查询，再针对它建。

## 三个常见误区

**误区一：`(a, b)` 建了，查 `b` 也能用。**
不能。要么建 `(b, a)`，要么单独建 `(b)`。MySQL 8.0 有 Index Skip Scan，但只在特定条件下生效，别把它当成常规方案。

**误区二：把区分度最高的列放最左一定最好。**
区分度只影响「能筛掉多少行」，但如果不满足最左前缀，再高的区分度也用不上。正确顺序是先满足查询形态，再在同等条件下优先高区分度。

**误区三：在索引列上做运算或函数。**
`WHERE DATE(ts) = '2026-01-01'`、`WHERE uid + 1 = 2` 都会让索引失效。改成范围查询：`ts >= '2026-01-01' AND ts < '2026-01-02'`。

## 用 EXPLAIN 验证，而不是猜

```sql
EXPLAIN SELECT id FROM events
WHERE uid = 1 AND kind = 2 AND ts >= '2026-01-01';
```

重点看三处：

- `key`：实际用了哪条索引，`NULL` 就是没用到；
- `key_len`：用了索引的哪几列，联合索引越靠左的列越多，值越大；
- `Extra`：`Using index` 表示覆盖，`Using index condition` 表示条件下推，`Using filesort` 表示排序没蹭上索引。

`key_len` 的具体估算、`type` 从 `ALL` 到 `ref` 的含义，见 [MySQL EXPLAIN 执行计划：从 ALL 到 ref 怎么看](https://blog.zhoujun.dev/article/mysql-explain-type-all-ref-range/)。

## 小结

- 联合索引是一棵按列顺序排序的树，最左前缀由物理顺序决定；
- 范围列之后的列不能用于定位；
- 列顺序 = 等值列 → 排序列 → 范围列 → 覆盖列；
- 用 `key_len` 和 `Extra` 验证，别靠感觉。

---

**相关阅读**

- [MySQL 聚簇索引与二级索引：回表到底贵在哪](https://blog.zhoujun.dev/article/mysql-clustered-index-vs-secondary-index/)
- [B+ 树索引回源：页分裂长什么样](https://blog.zhoujun.dev/article/btree-page-split/)
- [MySQL EXPLAIN 执行计划：从 ALL 到 ref 怎么看](https://blog.zhoujun.dev/article/mysql-explain-type-all-ref-range/)
- [数据库专题](https://blog.zhoujun.dev/topics/database/)
