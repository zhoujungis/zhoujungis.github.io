---
title: "InnoDB 锁的边界：Next-Key 与间隙锁"
slug: innodb-next-key-gap-lock-deep-dive
cover_image: /photos/innodb-lock-cover.png
date: 2026-11-02
tags: ["数据库", "存储引擎", "后端"]
---

> 适用读者：被「为什么我只更新了一行，插入却卡住了」折磨过的后端工程师；写过 `SELECT ... FOR UPDATE`、却说不清它到底锁了哪段索引的人；准备把隔离级别从 RR 调到 RC、但想知道自己放弃了什么的人
> 结论先行：InnoDB 锁的不是「行」，而是**索引记录以及记录之间的缝**。记录锁锁住一条索引记录，间隙锁锁住这条记录前面的开区间，Next-Key 把两者合成一把锁；插入意向锁则是一种只与间隙锁冲突的「排队声明」。本文不写一行自造代码，全部证据来自 MySQL 8.0 的 `lock0lock.h`、`lock0lock.cc`、`lock0wait.cc` 与 `row0sel.cc`：4 位模式 + 4 个标志位的锁编码、四行冲突规则、唯一索引等值查询为什么只剩记录锁、范围查询如何把行变成缝、隐式锁怎样在冲突发生时才现形、锁队列为什么不是先来先得、死锁检测怎样找环与挑选受害者，最后落到一张 id = 1 / 5 / 10 / 15 的锁地图
> 阅读时间：约 50 分钟 | 难度：进阶 | 收获：一套能对着 `performance_schema.data_locks` 读懂 InnoDB 锁的坐标系统 + 一条从 SQL 到 `LOCK_ORDINARY` 的完整证据链 + 一份排查锁等待与死锁的清单

**目录**

- 前言：一条 UPDATE 锁住了什么
- 页、记录与 heap_no：锁的最小坐标
- 锁的编码：4 位模式与 4 个标志位
- 三种锁语汇：记录锁、间隙锁、Next-Key
- 快照读与当前读：不是所有读都会加锁
- 唯一索引等值查询：为什么只剩记录锁
- 非唯一索引：两棵索引，两种锁
- 范围查询：锁型选择的三态
- 找不到行也要加锁：防幻读的那一手
- 插入意向锁：只与间隙锁冲突
- 冲突判定：四行代码里的优先级
- 隐式锁：没加锁，为什么别人还是得等
- 锁队列：不是先来先得
- RC 为什么没有间隙锁
- 死锁：找环、验环、选受害者
- 一张表的锁地图
- 常见误区与排查清单
- 结语：锁的边界

## 前言：一条 UPDATE 锁住了什么

先摆一张最小的表。它只有三个列：主键 `id`、普通索引 `k`、以及一个不被索引的 `v`。

```sql
CREATE TABLE t (
  id INT PRIMARY KEY,
  k INT NOT NULL,
  v VARCHAR(32),
  KEY idx_k (k)
) ENGINE=InnoDB;

INSERT INTO t (id, k, v) VALUES
  (1, 10, 'a'),
  (5, 20, 'b'),
  (10, 30, 'c'),
  (15, 40, 'd');
```

现在开会话 A 和会话 B。

```sql
-- 会话 A
BEGIN;
UPDATE t SET v = 'x' WHERE k = 20;

-- 会话 B
INSERT INTO t (id, k, v) VALUES (7, 20, 'b2');
```

B 会卡住。很多人的第一反应是：A 只改了 `id = 5` 这一行，B 要插入的是 `id = 7`，两者不是同一行，为什么会冲突？

因为 A 锁住的不是「`id = 5` 这一行」，而是 `idx_k` 上的一段索引区间。`k = 20` 命中了二级索引记录 `(20, 5)`，A 在它上面加了 Next-Key 锁；扫描继续走到下一条 `(30, 10)` 时，发现不再是 `k = 20`，于是又在 `(30, 10)` 前面补了一把间隙锁。B 要插入的 `(20, 7)` 正好落在这段缝里，于是它发出的插入意向锁与 A 的间隙锁冲突，只能排队。

这条链路上有三个容易被忽略的事实：

- 锁的地址是**索引记录**，不是主键行；同一行在聚簇索引和二级索引里是两个不同的锁坐标。
- 「找不到行」不等于「不加锁」；范围扫描停在第一条不匹配的记录上时，InnoDB 往往会在它前面加间隙锁，防止未来有行插进来。
- 普通 `SELECT` 走 MVCC，不加锁；只有当前读（`FOR UPDATE`、`FOR SHARE`、`UPDATE`、`DELETE`）才进入这篇文章讨论的锁系统。

后面的章节会把这条链拆开。先回顾前两篇：[WAL 篇](/article/wal-deep-dive/)讲的是「日志如何保证崩溃后能重放」，[B+ 树篇](/article/btree-page-split/)讲的是「页分裂如何改变索引的物理形状」。这一篇讲的是第三种边界：**当多个事务同时想动同一段索引时，InnoDB 用什么坐标、什么规则、什么顺序决定谁先走。**

## 页、记录与 heap_no：锁的最小坐标

InnoDB 的锁挂在页上，而不是挂在表上。一个页里有一条记录链，链头是 infimum，链尾是 supremum，用户记录夹在中间。源码把这三个位置编成了 heap_no：

```cpp
/** Page infimum */
constexpr ulint PAGE_HEAP_NO_INFIMUM = 0;
/** Page supremum */
constexpr ulint PAGE_HEAP_NO_SUPREMUM = 1;

/** First user record in creation (insertion) order, not necessarily collation
order; this record may have been deleted */
constexpr ulint PAGE_HEAP_NO_USER_LOW = 2;
```

这段来自 `storage/innobase/include/page0types.h`。它解释了为什么 `SHOW ENGINE INNODB STATUS` 和 `performance_schema.data_locks` 里会出现 `heap no 2`、`heap no 3` 这样的编号：**heap_no 是页内槽位，不是主键，也不是行号**。用户记录从 2 开始，因为 0 和 1 被两个哨兵占了。

锁对象 `lock_t` 也不是「一条记录一个对象」。一个记录锁对象属于某一页，内部带一个位图；位图的第 n 位表示这个锁是否覆盖 heap_no 为 n 的记录。源码里能看到这些操作：

- `lock_rec_get_n_bits(lock)`：这个锁对象覆盖到多少个 heap_no；
- `lock_rec_get_nth_bit(lock, heap_no)`：某条记录是否被覆盖；
- `lock_rec_set_nth_bit(lock, heap_no)`：把某条记录加进这个锁对象；
- `lock_rec_reset_nth_bit(lock, heap_no)`：把某条记录从锁对象里去掉。

这解释了一个常见误解：Next-Key 锁在语义上确实是「记录锁 + 间隙锁」，但在内存里经常只是一个 `lock_t` 加一张位图，而不是两个独立的锁对象。`lock0lock.cc` 里有一句很直白的注释：

```cpp
  /* A very common type of lock in InnoDB is "Next Key Lock", which is almost
  equivalent to two locks: Record Lock and GAP Lock separately.
  Thus, in case we need to wait, we check if we already own a Record Lock,
  and if we do, we only need the GAP Lock.
  We don't do the opposite thing (of checking for GAP Lock, and only requesting
  Record Lock), because if Next Key Lock has to wait, then it is because of a
  conflict with someone who locked the record, as locks on gaps are compatible
  with each other, so even if we have a GAP Lock, narrowing the requested mode
  to Record Lock will not make the conflict go away.

  In current implementation locks on supremum are treated like GAP Locks,
  in particular they never have to wait for anything (unless they are Insert
  Intention locks, but we've ruled that out with asserts before getting here),
  so there is no gain in using the above "lock splitting" heuristic for locks on
  supremum, and reasoning becomes a bit simpler without this special case. */
```

这里还有一个哨兵特例。supremum 是页尾的虚拟记录，指向「无限远」。所有落在 supremum 上的锁都自动按间隙锁处理，源码干脆把 `LOCK_GAP` 和 `LOCK_REC_NOT_GAP` 位清掉：

```cpp
  /* If rec is the supremum record, then we can reset the gap bit, as
  all locks on the supremum are automatically of the gap type, and we
  try to avoid unnecessary memory consumption of a new record lock
  struct for a gap type lock */

  if (heap_no == PAGE_HEAP_NO_SUPREMUM) {
    ut_ad(!(type_mode & LOCK_REC_NOT_GAP));

    /* There should never be LOCK_REC_NOT_GAP on a supremum
    record, but let us play safe */

    type_mode &= ~(LOCK_GAP | LOCK_REC_NOT_GAP);
  }
```

所以「锁住最后一条记录之后的无限区间」并不需要真的造一条记录，只要在 supremum 的 heap_no 上置一位。页分裂、记录移动时，锁系统也要跟着搬这些位；否则锁会指向一个已经不存在的槽位。这部分不是本文重点，但它解释了为什么锁结构总是绑在 `(space, page_no, heap_no)` 这个三元组上。

## 锁的编码：4 位模式与 4 个标志位

InnoDB 把锁的模式和类型塞进同一个 `type_mode` 整数。低 4 位是模式（共享、排他、意向锁等），高 4 位是类型（表锁或记录锁），再往上是标志位。`lock0lock.h` 里的定义是：

```cpp
/** mask used to extract mode from the  type_mode field in a lock */
constexpr uint32_t LOCK_MODE_MASK = 0xF;
/** Lock types */
/** table lock */
constexpr uint32_t LOCK_TABLE = 16;
/** record lock */
constexpr uint32_t LOCK_REC = 32;
/** mask used to extract lock type from the type_mode field in a lock */
constexpr uint32_t LOCK_TYPE_MASK = 0xF0UL;
static_assert((LOCK_MODE_MASK & LOCK_TYPE_MASK) == 0,
              "LOCK_MODE_MASK & LOCK_TYPE_MASK");

/** Waiting lock flag; when set, it  means that the lock has not yet been
 granted, it is just waiting for its  turn in the wait queue */
constexpr uint32_t LOCK_WAIT = 256;
/* Precise modes */
/** this flag denotes an ordinary next-key lock in contrast to LOCK_GAP or
 LOCK_REC_NOT_GAP */
constexpr uint32_t LOCK_ORDINARY = 0;
/** when this bit is set, it means that the lock holds only on the gap before
  the record; for instance, an x-lock on the gap does not give permission to
  modify the record on which the bit is set; locks of this type are created
  when records are removed from the index chain of records */
constexpr uint32_t LOCK_GAP = 512;
/** this bit means that the lock is only on the index record and does NOT
   block inserts to the gap before the index record; this is used in the case
   when we retrieve a record with a unique key, and is also used in locking
   plain SELECTs (not part of UPDATE or DELETE) when the user has set the READ
   COMMITTED isolation level */
constexpr uint32_t LOCK_REC_NOT_GAP = 1024;
/** this bit is set when we place a waiting gap type record lock request in
   order to let an insert of an index record to wait until there are no
   conflicting locks by other transactions on the gap; note that this flag
   remains set when the waiting lock is granted, or if the lock is inherited to
   a neighboring record */
constexpr uint32_t LOCK_INSERT_INTENTION = 2048;
```

把它读成一张表会更清楚：

| 位 | 值 | 含义 |
|---|---|---|
| `LOCK_GAP` | 512 | 只锁记录前面的开区间，不锁记录本身 |
| `LOCK_REC_NOT_GAP` | 1024 | 只锁记录本身，不锁前面的缝，也不阻止插入 |
| `LOCK_INSERT_INTENTION` | 2048 | 插入前发出的等待型间隙请求 |
| `LOCK_ORDINARY` | 0 | 没有上面两个「精确模式」位，就是普通 Next-Key |

`LOCK_ORDINARY` 的值是 0，这一点很重要：Next-Key 不是「新增的一种位」，而是「没有把 gap 和 record 拆开」的默认形态。一个锁要么只锁缝（`LOCK_GAP`），要么只锁记录（`LOCK_REC_NOT_GAP`），要么两者都锁（`LOCK_ORDINARY`）。`LOCK_WAIT` 则不是锁型，而是状态位：表示这个请求还没被授予，正在等待队列里。

## 三种锁语汇：记录锁、间隙锁、Next-Key

先把三个词落到区间上。假设索引里相邻的两条记录是 `r_prev` 和 `r`，主键或索引键严格递增。

- **记录锁（Record Lock）**：锁住 `r` 这条索引记录本身。它不锁 `r` 前面的缝，所以别人仍然可以在 `r_prev` 和 `r` 之间插入新记录，只要不碰 `r`。
- **间隙锁（Gap Lock）**：锁住 `(r_prev, r)` 这个开区间。它不锁 `r`，也不锁 `r_prev`；它只阻止别人往这条缝里插入。多个事务可以同时持有同一段缝的间隙锁，因为间隙锁之间不冲突。
- **Next-Key Lock**：锁住 `(r_prev, r]`，也就是「`r` 前面的缝 + `r` 本身」。它是 RR 隔离级别下范围扫描的默认形态。

用一句不那么严谨但很好记的话说：**记录锁是钉子，间隙锁是缝，Next-Key 是「钉子连带它前面的缝」。**

这里必须强调「缝」的两端是索引顺序上的邻居，不是主键数值上的邻居。二级索引 `idx_k` 的记录是 `(k, id)` 的组合：`(20, 5)` 和 `(30, 10)` 之间不仅有 `k = 20` 到 `k = 30` 的缝，还包含「`k = 20` 且 `id > 5`」的位置。所以 B 插入 `(20, 7)` 时，它落进的是 `(20, 5)` 和 `(30, 10)` 之间，而不是「`id = 5` 和 `id = 10` 之间」。

间隙锁还有一个反直觉的性质：**它不阻止读，也不阻止别人加间隙锁**。`lock0lock.cc` 的冲突规则里有一句注释，直接说明了原因：

```cpp
  if ((lock_is_on_supremum || (type_mode & LOCK_GAP)) &&
      !(type_mode & LOCK_INSERT_INTENTION)) {
    /* Gap type locks without LOCK_INSERT_INTENTION flag
    do not need to wait for anything. This is because
    different users can have conflicting lock types
    on gaps. */

    return Conflict::NO_CONFLICT;
  }
```

「different users can have conflicting lock types on gaps」这句话的意思是：间隙锁的语义是「先占住这个位置，防止插入」，而不是「独占这段区间」。两个事务都可以声明「我要防止这段缝被插入」，它们的目标相同，所以不需要互相等待。

## 快照读与当前读：不是所有读都会加锁

在进入具体 SQL 之前，先要分清两类读。否则你会把「读到了旧版本」误认为「读没有加锁所以没冲突」。

- **快照读（consistent read）**：普通 `SELECT`，在 RR 下用事务开始时的 ReadView，在 RC 下用语句开始时的 ReadView。它读的是 MVCC 版本链，不加记录锁，也不加间隙锁。源码里对应的锁类型是 `LOCK_NONE`。
- **当前读（locking read）**：`SELECT ... FOR UPDATE`、`SELECT ... FOR SHARE`、`UPDATE`、`DELETE`。它要读最新版本，并对读到的索引记录加锁。

`row0sel.cc` 在决定锁型之前有一道门：

```cpp
  if (prebuilt->select_lock_type != LOCK_NONE) {
    auto row_to_range_relation = row_compare_row_to_range(
```

只有 `select_lock_type` 不是 `LOCK_NONE`，才进入 `row_compare_row_to_range` 和后面的锁型选择。快照读连这道门都不进，所以它不会在 `performance_schema.data_locks` 里留下记录。

这也解释了一个常见现象：会话 A 开着事务改了行但没提交，会话 B 的普通 `SELECT` 仍然能读到旧值，而且不会被 A 阻塞；但 B 一旦改成 `SELECT ... FOR UPDATE`，就会等待。不是锁突然出现了，而是 B 从 MVCC 读切换到了当前读，开始参与锁竞争。

`UPDATE` 和 `DELETE` 也是当前读的一种。它们先定位到索引记录，拿到锁，再决定是否修改。这个「先读后改」的顺序意味着：**更新一条不存在的行，也可能在它本该出现的位置上加一把间隙锁。**

## 唯一索引等值查询：为什么只剩记录锁

先看最常见的场景：`WHERE id = 5`，`id` 是主键，值存在。很多人背过一句结论「唯一索引等值查询只加记录锁」，但源码里的条件比这句话细。

`row0sel.cc` 的 `row_compare_row_to_range` 在一开始就把「不需要锁缝」的情况列了出来：

```cpp
  if (!set_also_gap_locks || trx->skip_gap_locks() ||
      (unique_search && !rec_get_deleted_flag(rec, comp)) ||
      dict_index_is_spatial(index) ||
      (index == clust_index && mode == PAGE_CUR_GE && direction == 0 &&
       dtuple_get_n_fields_cmp(search_tuple) ==
           dict_index_get_n_unique(index) &&
       0 == cmp_dtuple_rec(search_tuple, rec, index, offsets))) {
    row_to_range_relation.gap_can_intersect_range = false;
    return (row_to_range_relation);
  }
```

条件可以拆成四类：

1. `!set_also_gap_locks`：调用方明确说「这次不要锁缝」，比如 RC 下的普通锁定读。
2. `trx->skip_gap_locks()`：事务隔离级别本身就不要间隙锁，RC / RU 属于这一类。
3. `unique_search && !rec_get_deleted_flag(rec, comp)`：这是一次唯一搜索，而且命中的记录没有被删除标记。
4. 聚簇索引上做 `>=` 搜索且恰好命中唯一键：下界本身是精确值，缝里的插入不可能落进范围。

命中第 3 条时，`gap_can_intersect_range` 被置为 false。接下来锁型选择只有两种可能：

```cpp
  ulint lock_type;
  if (row_to_range_relation.row_can_be_in_range) {
    if (row_to_range_relation.gap_can_intersect_range) {
      lock_type = LOCK_ORDINARY;
    } else {
      lock_type = LOCK_REC_NOT_GAP;
    }
  } else {
    if (row_to_range_relation.gap_can_intersect_range) {
      lock_type = LOCK_GAP;
    } else {
      err = DB_RECORD_NOT_FOUND;
      goto normal_return;
    }
  }
```

行在范围内、缝不可能与范围相交 → `LOCK_REC_NOT_GAP`。这就是「唯一索引等值命中只加记录锁」的源码出处。

为什么可以省掉缝？因为唯一索引上不可能再出现第二个 `id = 5`。别人往 `(1, 5)` 或 `(5, 10)` 里插入 `6`、`7`，都不会让 `WHERE id = 5` 多出一行；如果插入 `5`，唯一约束检查本身会锁住那条记录并报冲突。所以查询 `id = 5` 只需要钉住 `5` 这条记录，不需要占住它前面的缝。

但有两个例外必须记住。

**例外一：命中记录被删除标记了。** 条件里的 `!rec_get_deleted_flag(rec, comp)` 不成立，`gap_can_intersect_range` 保持 true，锁型会变成 `LOCK_ORDINARY`。删除标记的记录仍然在索引链上，唯一性判断和回滚都要更保守，此时 InnoDB 不肯只钉记录。

**例外二：等值查询没有命中。** 扫描会停在第一条大于目标值的记录上，走的是另一条分支：

```cpp
    if (0 != cmp_dtuple_rec(search_tuple, rec, index, offsets)) {
      if (set_also_gap_locks && !trx->skip_gap_locks() &&
          prebuilt->select_lock_type != LOCK_NONE &&
          !dict_index_is_spatial(index)) {
        err = sel_set_rec_lock(pcur, rec, index, offsets, prebuilt->select_mode,
                               prebuilt->select_lock_type, LOCK_GAP, thr, &mtr);
```

`WHERE id = 7` 找不到行，扫描落到 `id = 10`，InnoDB 会在 `10` 前面加一把 `LOCK_GAP`。所以「不存在的行」不是没有锁，而是锁在「它将来会出现的位置」上。插入 `7`、`8`、`9` 都会撞上这把缝锁。

还有一个容易被忽略的分支：`WHERE id >= 5` 恰好命中 `id = 5`。源码注释解释得很清楚：

```cpp
  /* If we are doing a 'greater or equal than a primary key
  value' search from a clustered index, and we find a record
  that has that exact primary key value, then there is no need
  to lock the gap before the record, because no insert in the
  gap can be in our search range. That is, no phantom row can
  appear that way.

  An example: if col1 is the primary key, the search is WHERE
  col1 >= 100, and we find a record where col1 = 100, then no
  need to lock the gap before that record. */
```

下界是 5，缝 `(1, 5)` 里的任何插入都小于 5，不可能落进 `id >= 5` 的范围，所以 `5` 前面的缝可以不锁。注意这里省掉的是「下界前面的缝」，不是「上界后面的缝」；范围另一端的缝仍然要处理。

## 非唯一索引：两棵索引，两种锁

把查询换成 `WHERE k = 20`，`k` 上有普通二级索引。情况立刻变复杂，因为 `k` 不唯一，`(20, 5)` 后面还可能插入 `(20, 7)`。

二级索引上的扫描会先锁二级索引记录。对于 `k = 20` 这种非唯一等值查询，`unique_search` 为 false，`row_compare_row_to_range` 不会走「不锁缝」的快速分支，于是命中的 `(20, 5)` 拿到 `LOCK_ORDINARY`，也就是 Next-Key。扫描继续走到 `(30, 10)` 时，`ROW_SEL_EXACT` 发现值不匹配，走上面那段「不匹配就补 `LOCK_GAP`」的逻辑，在 `(30, 10)` 前面再补一把缝锁。

接下来是回表。二级索引只给出主键 `5`，InnoDB 还要去聚簇索引取整行。回表时的条件已经是「主键等于 5」，这是一个唯一条件，所以聚簇索引记录只需要记录锁：

```cpp
  if (prebuilt->select_lock_type != LOCK_NONE) {
    /* Try to place a lock on the index record; we are searching
    the clust rec with a unique condition, hence
    we set a LOCK_REC_NOT_GAP type lock */

    err = lock_clust_rec_read_check_and_lock(
        lock_duration_t::REGULAR, prebuilt->clust_pcur->get_block(), clust_rec,
        clust_index, *offsets, prebuilt->select_mode,
        static_cast<lock_mode>(prebuilt->select_lock_type), LOCK_REC_NOT_GAP,
        thr);
```

这段注释是整篇文章最该记住的几句话之一：**二级索引扫描加 Next-Key，回表聚簇索引加 `LOCK_REC_NOT_GAP`。** 两棵索引，两种锁型。

这带来几个实践后果：

- 如果你只更新 `v`（不在任何索引里），InnoDB 仍然要扫 `idx_k` 来定位行，因此仍然会在二级索引上加 Next-Key 和缝锁。不要以为「更新的是非索引列，所以只锁聚簇索引」。
- 如果查询是覆盖索引（`SELECT id, k FROM t WHERE k = 20`），不需要回表，就不会产生聚簇索引锁。锁的 footprint 会小很多。
- 如果更新的是索引列，旧的二级索引记录要被删除标记，新的二级索引记录要插入，锁的范围会进一步扩大，死锁概率也上升。

还有一点：二级索引记录本身包含主键后缀，所以 `(20, 5)` 和 `(20, 7)` 在索引里是有序的两个不同记录。Next-Key 锁住 `(20, 5)`，并不意味着 `(20, 7)` 这条记录本身被锁；它锁的是「`(20, 5)` 前面到上一条记录之间的缝」，以及「`(20, 5)` 这条记录」。`(20, 7)` 能不能插进来，取决于它落在哪段缝里，以及那段缝有没有被别的间隙锁占住。

## 范围查询：锁型选择的三态

范围查询是 Next-Key 和间隙锁的主场。InnoDB 不按「SQL 写法」猜锁型，而是按扫描过程中每条记录与范围的相对位置来选。`row_compare_row_to_range` 返回两个布尔值，名字很朴素：

- `row_can_be_in_range`：这条记录**可能**在范围内；false 表示确定不在。
- `gap_can_intersect_range`：这条记录前面的缝**可能**与范围相交；false 表示确定不相交。

两个布尔值组合出四种情况，对应四种动作：

| `row_can_be_in_range` | `gap_can_intersect_range` | 锁型 | 含义 |
|---|---|---|---|
| true | true | `LOCK_ORDINARY` | 记录可能在范围内，缝也可能相交：Next-Key 全锁 |
| true | false | `LOCK_REC_NOT_GAP` | 记录在范围内，但缝不可能相交：只钉记录 |
| false | true | `LOCK_GAP` | 记录确定不在范围内，但缝可能相交：只锁缝 |
| false | false | 不加锁，返回 `DB_RECORD_NOT_FOUND` | 记录和缝都与范围无关：扫描结束 |

源码里就是这段分支：

```cpp
  ulint lock_type;
  if (row_to_range_relation.row_can_be_in_range) {
    if (row_to_range_relation.gap_can_intersect_range) {
      lock_type = LOCK_ORDINARY;
    } else {
      lock_type = LOCK_REC_NOT_GAP;
    }
  } else {
    if (row_to_range_relation.gap_can_intersect_range) {
      lock_type = LOCK_GAP;
    } else {
      err = DB_RECORD_NOT_FOUND;
      goto normal_return;
    }
  }
```

这段代码解释了为什么同一条 SQL 在边界上会得到不同锁型。以 `id` 为主键、记录为 `1 / 5 / 10 / 15` 为例：

- `WHERE id BETWEEN 5 AND 10`：扫描从 `5` 开始。`5` 是精确下界，缝 `(1, 5)` 不可能与范围相交，所以 `5` 只拿 `LOCK_REC_NOT_GAP`；`10` 在范围内，缝 `(5, 10)` 可能相交，拿 `LOCK_ORDINARY`；到了 `15`，记录确定不在范围内，但缝 `(10, 15)` 可能相交，拿 `LOCK_GAP`。
- `WHERE id > 10`：`15` 在范围内，缝 `(10, 15)` 也与范围相交，拿 `LOCK_ORDINARY`；再往后到 supremum，拿一把指向无限远的缝锁。
- `WHERE id < 5`：`1` 在范围内，缝 `(-∞, 1)` 也与范围相交，拿 `LOCK_ORDINARY`；`5` 确定不在范围内，缝 `(1, 5)` 仍可能相交，拿 `LOCK_GAP`。

注意这里的「可能」是保守估计，不是精确几何。源码在注释里承认这套启发式只处理「最常见、最好推理」的情况，尤其是聚簇索引上按自然顺序向前的范围扫描；遇到降序、二级索引重复键、`HANDLER` 接口等场景，它会退回默认值 true，宁可多锁也不漏锁。这也是为什么「同样的 WHERE，锁的数量有时比你想的多」：不是 InnoDB 算错了，而是它选择了保守。

## 找不到行也要加锁：防幻读的那一手

把上一节的逻辑单独拎出来，因为它是最容易造成「灵异插入阻塞」的一节。

在 RR 下，`SELECT ... FOR UPDATE WHERE id = 7` 找不到行。扫描落到 `id = 10`，`row_can_be_in_range` 为 false，`gap_can_intersect_range` 为 true，锁型是 `LOCK_GAP`。这把锁不加在 `7` 上（`7` 不存在），也不加在 `10` 的记录本身上，而是加在 `10` 前面的缝 `(5, 10)` 上。效果是：任何想插入 `6`、`7`、`8`、`9` 的事务都会在这里排队。

这就是「防幻读」。如果没有这把缝锁，事务 A 先查 `id = 7` 得到空结果，事务 B 随后插入 `7` 并提交，事务 A 再查一次就多出一行——同一个事务里两次相同的查询看到不同结果，破坏了可重复读。间隙锁的作用不是锁住「现在存在的行」，而是锁住「未来可能出现的位置」。

反过来说，RC 下没有这把锁。`skip_gap_locks()` 为 true，`set_also_gap_locks` 被置为 false，`LOCK_GAP` 分支不会执行。事务 A 查 `id = 7` 得到空结果，B 可以插入 `7`，A 再查就能看到新行。这不是 bug，而是 RC 的语义：**每条语句看到最新的已提交快照，幻读是允许的。**

所以，「为什么插入被一个不存在的行挡住了」的标准答案是三件事：

1. 当前隔离级别是 RR 或 SERIALIZABLE，不是 RC；
2. 有一个事务对目标位置做了当前读（`FOR UPDATE`、`FOR SHARE`、`UPDATE`、`DELETE`）；
3. 那个事务在目标位置的后继记录上留了一把间隙锁。

排查时先查隔离级别，再查 `performance_schema.data_locks` 里的 `LOCK_MODE = X,GAP` 或 `X`（Next-Key），最后看 `LOCK_DATA` 指向哪条后继记录。顺序不要反。

## 插入意向锁：只与间隙锁冲突

插入一条记录时，InnoDB 不会先给新记录加一把显式锁，而是先检查「我要落进去的那段缝」有没有被别人占住。检查点在 `lock0lock.cc` 的 `lock_rec_insert_check_and_lock`：

```cpp
    if (!lock_rec_has_any(lock_sys->rec_hash, block->get_page_id(), heap_no)) {
      *inherit = false;
    } else {
      *inherit = true;

      /* If another transaction has an explicit lock request which locks
      the gap, waiting or granted, on the successor, the insert has to wait.

      An exception is the case where the lock by the another transaction
      is a gap type lock which it placed to wait for its turn to insert. We
      do not consider that kind of a lock conflicting with our insert. This
      eliminates an unnecessary deadlock which resulted when 2 transactions
      had to wait for their insert. Both had waiting gap type lock requests
      on the successor, which produced an unnecessary deadlock. */

      const ulint type_mode = LOCK_X | LOCK_GAP | LOCK_INSERT_INTENTION;

      const auto conflicting =
          lock_rec_other_has_conflicting(type_mode, block, heap_no, trx);

      /* LOCK_INSERT_INTENTION locks can not be allowed to bypass waiting locks,
      because they allow insertion of a record which splits the gap which would
      lead to duplication of the waiting lock, violating the constraint that
      each transaction can wait for at most one lock at any given time */
      ut_a(!conflicting.bypassed);

      if (conflicting.wait_for != nullptr) {
        RecLock rec_lock(thr, index, block, heap_no, type_mode);

        trx_mutex_enter(trx);

        err = rec_lock.add_to_waitq(conflicting.wait_for);

        trx_mutex_exit(trx);
      }
    }
```

这段代码里有四个要点。

**第一，插入意向锁是加在后继记录上的。** 变量 `heap_no` 来自 `page_rec_get_heap_no(next_rec)`，也就是「新记录要插到谁前面」的那条后继记录。锁对象指向后继记录的 heap_no，语义却是「我要占用它前面的缝」。这解释了为什么 `data_locks` 里一条插入意向锁的 `LOCK_DATA` 常常显示的是后继记录的值，而不是你正在插入的值。

**第二，插入意向锁只与间隙锁冲突。** 它本身带 `LOCK_GAP` 位，所以会等待别人已经持有的 `LOCK_GAP` 或 `LOCK_ORDINARY`；但它不会被记录锁（`LOCK_REC_NOT_GAP`）挡住，也不会被另一个插入意向锁挡住。两个事务同时往同一段缝里插入，插入意向锁之间是兼容的；真正让它们排队的是缝上已有的间隙锁。

**第三，插入意向锁不能绕过等待中的锁。** 注释说得很清楚：如果允许绕过，插入会「split the gap」，把等待中的锁复制成两份，违反「一个事务最多只有一个等待锁」的约束。所以插入意向锁虽然地位特殊，仍然要老老实实排队。

**第四，插入可能继承后继记录的间隙锁。** 函数签名里的 `bool *inherit` 就是为此准备的。如果后继记录上有间隙锁，新插入的记录可能继承这些锁位，避免缝被切开后锁语义丢失。这就是为什么「插入一条记录」有时会让锁的覆盖范围变大，而不是变小。

典型的插入死锁就发生在这里。事务 A 和 B 都往同一段缝里插入：A 先拿到自己的插入意向锁（但还没有提交），B 也拿到自己的插入意向锁，两者兼容；随后 A 再插入另一条相邻记录，需要等待 B 已经持有的某把缝锁，B 也要等待 A，环就形成了。插入意向锁本身不制造这个环，**是「先占缝、再插入、还要再占另一段缝」的顺序**制造了它。

## 冲突判定：四行代码里的优先级

锁请求要不要等待，最终落到 `lock0lock.cc` 的冲突判定 `locksys::rec_lock_check_conflict`（由 `lock_rec_other_has_conflicting` 调用）。前面已经看过前两条规则，完整的一组是：

```cpp
  if ((lock_is_on_supremum || (type_mode & LOCK_GAP)) &&
      !(type_mode & LOCK_INSERT_INTENTION)) {
    /* Gap type locks without LOCK_INSERT_INTENTION flag
    do not need to wait for anything. This is because
    different users can have conflicting lock types
    on gaps. */

    return Conflict::NO_CONFLICT;
  }

  if (!(type_mode & LOCK_INSERT_INTENTION) && lock_rec_get_gap(lock2)) {
    /* Record lock (LOCK_ORDINARY or LOCK_REC_NOT_GAP
    does not need to wait for a gap type lock */

    return Conflict::NO_CONFLICT;
  }

  if ((type_mode & LOCK_GAP) && lock_rec_get_rec_not_gap(lock2)) {
    /* Lock on gap does not need to wait for
    a LOCK_REC_NOT_GAP type lock */

    return Conflict::NO_CONFLICT;
  }

  if (lock_rec_get_insert_intention(lock2)) {
    /* No lock request needs to wait for an insert
    intention lock to be removed. This is ok since our
    rules allow conflicting locks on gaps. This eliminates
    a spurious deadlock caused by a next-key lock waiting
    for an insert intention lock; when the insert
    intention lock was granted, the insert deadlocked on
    the waiting next-key lock.

    Also, insert intention locks do not disturb each
    other. */

    return Conflict::NO_CONFLICT;
  }
```

按顺序读：

1. **缝隙请求（非插入意向）不等待任何东西。** 包括 supremum 上的锁。别人拿记录锁也好，拿 Next-Key 也好，缝隙请求都不需要等，因为缝上的锁可以共存。
2. **记录请求不等缝隙锁。** 不管是 `LOCK_ORDINARY` 还是 `LOCK_REC_NOT_GAP`，都不会被纯 `LOCK_GAP` 挡住。记录请求关心的是记录本身，缝隙锁不锁记录。
3. **缝隙请求不等 `LOCK_REC_NOT_GAP`。** `LOCK_REC_NOT_GAP` 明确承诺「不阻止插入」，所以缝请求没理由等它。
4. **没有请求需要等插入意向锁。** 插入意向锁是「等待型」的缝请求，不是已授予的独占锁；等它没有意义，而且会造成伪死锁。

把锁型两两组合，可以得到一张更直观的矩阵：

| 请求 \ 已持有 | `LOCK_GAP` | `LOCK_REC_NOT_GAP` | `LOCK_ORDINARY` | `LOCK_INSERT_INTENTION` |
|---|---|---|---|---|
| `LOCK_GAP` | 兼容 | 兼容 | 兼容（缝部分） | 兼容 |
| `LOCK_REC_NOT_GAP` | 兼容 | 看 S/X | 看 S/X | 兼容 |
| `LOCK_ORDINARY` | 兼容 | 看 S/X | 看 S/X | 兼容 |
| `LOCK_INSERT_INTENTION` | **等待** | 兼容 | **等待** | 兼容 |

「看 S/X」表示回到锁模式兼容性：共享锁与共享锁兼容，排他与任何排他/共享冲突。注意 `LOCK_ORDINARY` 与 `LOCK_GAP` 的那一格是「兼容」——因为纯缝锁不锁记录，Next-Key 的记录部分不受影响；但如果 Next-Key 的缝部分与缝锁重叠，两者仍然可以共存，因为缝锁之间不冲突。

这张表里最容易记错的是最后一行：**插入意向锁只等待缝锁和 Next-Key，不等待记录锁，也不等待另一个插入意向锁。** 一旦你记住这一点，大多数「插入为什么卡住」的问题都能定位到「谁持有了目标缝上的 gap / next-key」。

还有一个特殊通道：高优先级事务。源码在模式兼容性之后、缝隙规则之前有一小段：

```cpp
  const bool is_hp = trx_is_high_priority(trx);
  /* If our trx is High Priority and the existing lock is WAITING and not
      high priority, then we can ignore it. */
  if (is_hp && lock2->is_waiting() && !trx_is_high_priority(lock2->trx)) {
    return Conflict::NO_CONFLICT;
  }
```

这是 Group Replication 相关的高优先级机制，普通业务事务一般碰不到。知道它存在即可，不要把它当成日常调优手段。

## 隐式锁：没加锁，为什么别人还是得等

前面说插入不先给新记录加显式锁，那为什么别的事务来读或改这条记录时会等？答案是**隐式锁**。

InnoDB 的行里有两个隐藏列：`DB_TRX_ID` 记录最后修改它的事务 ID，`DB_ROLL_PTR` 指向 undo 记录。源码的类型定义很朴素：

```cpp
/** Transaction identifier (DB_TRX_ID, DATA_TRX_ID) */
typedef ib_id_t trx_id_t;
/** Rollback pointer (DB_ROLL_PTR, DATA_ROLL_PTR) */
typedef ib_id_t roll_ptr_t;
```

当一个事务改了行但还没提交时，它不一定为每一行都建一个 `lock_t`。它只在行头留下自己的 `DB_TRX_ID`。另一个事务碰到这行时，会先读这个 ID，判断「改它的事务是否还活着」；如果还活着，就替对方补一把显式锁，然后自己再排队。入口是 `lock_rec_convert_impl_to_expl`：

```cpp
  if (index->is_clustered()) {
    trx_id_t trx_id;

    trx_id = lock_clust_rec_some_has_impl(rec, index, offsets);

    trx = trx_rw_is_active(trx_id, true);
  } else {
    ut_ad(!dict_index_is_online_ddl(index));

    trx = lock_sec_rec_some_has_impl(rec, index, offsets);
    if (trx) {
      DEBUG_SYNC_C("lock_rec_convert_impl_to_expl_will_validate");
      ut_ad(!lock_rec_other_trx_holds_expl(LOCK_S | LOCK_REC_NOT_GAP, trx, rec,
                                           block));
    }
  }

  if (trx != nullptr) {
    ulint heap_no = page_rec_get_heap_no(rec);

    ut_ad(trx_is_referenced(trx));

    /* If the transaction is still active and has no
    explicit x-lock set on the record, set one for it.
    trx cannot be committed until the ref count is zero. */

    lock_rec_convert_impl_to_expl_for_trx(block, rec, index, offsets, trx,
                                          heap_no);
  }
```

聚簇索引直接从记录里读 `DB_TRX_ID`；二级索引则先看页级的 `PAGE_MAX_TRX_ID`，再逐条检查。若事务还活跃，`lock_rec_convert_impl_to_expl_for_trx` 会给它补一把 `LOCK_REC | LOCK_X | LOCK_REC_NOT_GAP` 的显式锁；然后当前事务继续走正常的冲突判定，该等就等。`UPDATE` 路径也一样：`lock_clust_rec_modify_check_and_lock` 先调用 `lock_rec_convert_impl_to_expl` 兑现隐式锁，再申请 `LOCK_X | LOCK_REC_NOT_GAP`。

这套设计的意义是「按需付费」：如果一条新插入的行从头到尾没人碰，就不需要为它分配锁对象；只有发生竞争时，隐式锁才变成显式锁。它解释了另一个常见现象：`data_locks` 里一开始看不到某行的锁，等另一个事务来访问时，锁突然出现了。不是锁系统撒谎，而是隐式锁刚刚被「兑现」。

隐式锁有一个重要限制：**它只等价于 `LOCK_REC_NOT_GAP`，不含缝。** 所以插入本身不会因为隐式锁而阻止别人在相邻位置插入；阻止插入的仍然是显式的间隙锁 / Next-Key。把这两件事分开，才能理解「插入意向锁 + 隐式锁」的组合：插入意向锁负责在插入前占缝，隐式锁负责在插入后标记「这行归我改」。

## 锁队列：不是先来先得

锁等待队列在每一页上维护。`lock0lock.h` 的文档注释把结构写得很清楚：

```
  -# Granted locks are added at the HEAD of the queue.
  -# Waiting locks are added at the TAIL of the queue.
```

已授予的锁从 HEAD 进，等待的锁从 TAIL 进。新请求到来时，会扫描整个队列（包括已授予和等待中的锁），找到一个冲突者，然后把请求挂到 TAIL。这里有一个重要的防饿死设计：**新请求也会与等待中的锁比较**，不能因为「前面没有已授予的冲突锁」就直接插队。否则一个源源不断的共享锁流可以让一个等待中的排他锁永远等不到。

真正授予时，顺序不是队列的物理顺序。`lock_rec_grant` 会把等待者按 CATS 权重排序：

```cpp
  /* We want high schedule weight to be in front, and break ties by position */
  std::stable_sort(low_priority_heavier.begin(), low_priority_heavier.end(),
                   [](const LockDescriptorEx &a, const LockDescriptorEx &b) {
                     return (a.first > b.first);
                   });
  for (const auto &descriptor : low_priority_heavier) {
    waiting.push_back(descriptor.second);
  }
  waiting.insert(waiting.end(), low_priority_light.begin(),
                 low_priority_light.end());
```

排序后逐个用 `lock_rec_has_to_wait_for_granted` 检查候选是否仍与已授予锁冲突；没有冲突才 `lock_grant`，并把它移到 granted 组的前端。

CATS 的全称是 Contention-Aware Transaction Scheduling。它给每个等待事务算一个 `schedule_weight`，大致是「这个事务（传递地）挡住了多少个事务」。权重高的先授予，因为它一旦放行，能让更多事务继续跑。高优先级事务（Group Replication）还会被无条件排在前面。

所以三个结论：

- **锁队列不是 FIFO。** 先到的不一定先拿到；一个挡住很多人的大事务可能后来居上。
- **等待队列的物理顺序只是排队顺序，不是授予顺序。** `data_lock_waits` 里看到的等待关系，需要结合权重理解。
- **每个事务最多只有一个等待锁。** 这是 InnoDB 的一条硬约束（`lock0lock.h` 的注释里反复出现），也是等待图「每个节点最多一条出边」的基础。没有这条约束，死锁检测会复杂得多。

## RC 为什么没有间隙锁

把隔离级别切到 RC，锁的面貌会变一大半。原因在 `trx0trx.h` 的一个小函数：

```cpp
  bool skip_gap_locks() const {
    switch (isolation_level) {
      case READ_UNCOMMITTED:
      case READ_COMMITTED:
        return (true);
      case REPEATABLE_READ:
      case SERIALIZABLE:
        return (false);
    }
    ut_d(ut_error);
    ut_o(return (false));
  }
```

`READ_UNCOMMITTED` 和 `READ_COMMITTED` 返回 true，`REPEATABLE_READ` 和 `SERIALIZABLE` 返回 false。RC 下，普通锁定读会把 `set_also_gap_locks` 置为 false：

```cpp
  if (prebuilt->table->skip_gap_locks() ||
      (trx->skip_gap_locks() && prebuilt->select_lock_type != LOCK_NONE &&
       trx->mysql_thd != nullptr && thd_is_query_block(trx->mysql_thd))) {
    /* It is a plain locking SELECT and the isolation
    level is low: do not lock gaps */

    /* Reads on DD tables dont require gap-locks as serializability
    between different DDL statements is achieved using
    metadata locks */
    set_also_gap_locks = false;
  }
```

这段条件很值得逐字读：它只对「普通锁定 SELECT」且 `select_lock_type != LOCK_NONE` 的查询生效。`LOCK_NONE` 的快照读本来就不加锁，轮不到这里；DD 表（数据字典表）另有 metadata lock 保证串行化，也不需要间隙锁。

RC 放弃间隙锁，换来的是更少的等待和更少的死锁；代价是**范围扫描不再防幻读**。一条 `SELECT ... WHERE k BETWEEN 10 AND 30 FOR UPDATE` 在 RC 下不会阻止别人往这段范围里插入，下一次查询就可能看到新行。这不是实现缺陷，而是隔离级别定义的一部分。

RC 还有一项相关优化：**semi-consistent read**。`trx0trx.h` 里有两个相关函数：

```cpp
  bool allow_semi_consistent() const { return (skip_gap_locks()); }
  /** Checks if this transaction releases locks on non matching records due to
  low isolation level.
  @return true iff in this transaction's isolation level locks on records which
               do not match the WHERE clause are released */
  bool releases_non_matching_rows() const { return skip_gap_locks(); }
```

在 RC 下，`UPDATE` 扫描时可以释放「读了但不匹配 WHERE」的记录锁，从而缩小锁的覆盖范围。它读的是最新已提交版本，可能看到比事务快照更新的数据；如果一行在扫描和更新之间被别的事务改了，InnoDB 会重新读。这个优化让 RC 的 UPDATE 更不容易被不相关的行拖住，但也意味着「先读后写」的假设要更小心。

RC 下仍然有记录锁。`UPDATE` 改到的行、唯一约束检查碰到的记录、外键检查碰到的记录，都会加 `LOCK_REC_NOT_GAP` 或相应的模式锁。**「RC 没有间隙锁」不等于「RC 没有锁」**，只是没有缝锁。这一点在排查时经常被混淆。

## 死锁：找环、验环、选受害者

死锁检测的输入是一张等待图（wait-for graph）。因为每个事务最多只有一个等待锁，图中每个节点最多只有一条出边：事务 T 等待事务 U，边就是 `T -> U`。这种图很特殊，找环可以用染色 DFS：从每个未访问节点出发，沿着唯一出边走；如果走回当前染色，就发现候选环；如果走到之前染色的区域，说明这条路径汇入已处理部分，停止。

源码里的核心循环很短：

```cpp
      if (colors[id] == 0) {
        /* This node was never visited yet */
        colors[id] = current_color;
        continue;
      }
      /* This node was already visited:
      - either it has current_color which means we've visited it during current
        DFS descend, which means we have found a cycle, which we need to verify,
      - or, it has a color used in a previous DFS which means that current DFS
        path merges into an already processed portion of wait-for graph, so we
        can stop now */
      if (colors[id] == current_color) {
        /* found a candidate cycle! */
        lock_wait_extract_cycle_ids(cycle_ids, id, outgoing);
        if (lock_wait_check_candidate_cycle(cycle_ids, infos, new_weights)) {
          MONITOR_INC(MONITOR_DEADLOCK);
        } else {
          MONITOR_INC(MONITOR_DEADLOCK_FALSE_POSITIVES);
        }
      }
      break;
```

注意「候选环」四个字。找到环还不够，还要验证环上的事务此刻是否真的还在等待。因为等待信息是快照，期间可能有事务被唤醒、超时、或者槽位被复用。`lock_wait_check_candidate_cycle` 会检查两件事：槽位的 `reservation_no` 是否仍是快照里的值（防止 ABA），以及 `trx->lock.wait_lock` 是否仍非空。源码注释把这两个检查写得很明白：

```cpp
    const auto slot = lock_wait_get_slot_if_still_reserved(infos, id);
    if (!slot) {
      return false;
    }
```

和

```cpp
    if (trx->lock.wait_lock == nullptr) {
      /* trx is on its way to being woken up, so this cycle is a false positive.
      As this particular cycle will resolve itself, we ignore it. */
      return false;
    }
```

验证通过后，`lock_wait_choose_victim` 选一个受害者回滚。选择规则不是「随机挑一个」，而是先按一个特殊顺序遍历环，再比较事务权重：

```cpp
    if (trx_weight_ge(chosen_victim, trx)) {
      /* The joining transaction is 'smaller',
      choose it as the victim and roll it back. */
      chosen_victim = trx;
    }
```

`trx_weight_ge` 比较的是事务权重（大致是持有的锁数量、修改的行数等）。如果当前候选不比新事务小，就换成新事务——也就是**优先回滚较小的事务**，因为回滚代价更低。平局时，遍历顺序从「环上最近加入的等待者」的下一个开始，绕一圈，最近加入者最后被比较；由于 `>=` 会替换，平局最终落到最近加入者身上。这是「偏向牺牲新来者」的工程选择。

除了死锁，还有锁等待超时。`innodb_lock_wait_timeout` 的默认值是 50 秒：

```cpp
static MYSQL_THDVAR_ULONG(lock_wait_timeout, PLUGIN_VAR_RQCMDARG,
                          "Timeout in seconds an InnoDB transaction may wait "
                          "for a lock before being rolled back. Values above "
                          "100000000 disable the timeout.",
                          nullptr, nullptr, 50, 1, 1024 * 1024 * 1024, 0);
```

超时后默认只回滚当前语句，不回滚整个事务。`innodb_rollback_on_timeout` 的默认值是 false：

```cpp
static MYSQL_SYSVAR_BOOL(rollback_on_timeout, innobase_rollback_on_timeout,
                         PLUGIN_VAR_OPCMDARG | PLUGIN_VAR_READONLY,
                         "Roll back the complete transaction on lock wait "
                         "timeout, for 4.x compatibility (disabled by default)",
                         nullptr, nullptr, false);
```

这两个错误码在应用层要分开处理：

- 死锁：`HA_ERR_LOCK_DEADLOCK`，对应 MySQL 错误 1213，整个事务被回滚，必须从头重试。
- 超时：`HA_ERR_LOCK_WAIT_TIMEOUT`，对应 MySQL 错误 1205，默认只回滚语句，事务还在，但前面语句的修改仍在事务里。应用如果只重试当前语句，可能在一个已经部分完成的事务上继续操作；正确做法通常是回滚整个事务再重试，除非你明确知道自己在做什么。

`innodb_deadlock_detect` 默认开启；如果关掉，InnoDB 就只靠超时来解开环，等待时间会变成 50 秒级别。生产环境不要轻易关。

死锁的根因通常不是「InnoDB 选错了受害者」，而是**加锁顺序不一致**。两条最实用的修法是：

1. 让所有事务按同一个顺序访问行/索引区间，比如先按主键排序再更新。
2. 缩短事务，把不必要的工作移出事务；对范围大的 `FOR UPDATE` 改用更精确的条件或唯一索引。

## 一张表的锁地图

回到开头的表：`id = 1 / 5 / 10 / 15`，`k = 10 / 20 / 30 / 40`。下面把几种典型语句在 RR 下的锁落点画成一张表。这里写的是「主要锁」，实际还会叠加表级意向锁（`IS` / `IX`），以及回表、唯一约束检查带来的锁；表中省略这些，只保留记录锁、间隙锁、Next-Key。

| 语句（RR） | 聚簇索引上的锁 | 二级索引 `idx_k` 上的锁 | 典型阻塞 |
|---|---|---|---|
| `UPDATE t SET v='x' WHERE id = 5` | `id=5`：`X,REC_NOT_GAP` | 无（`v` 不在索引里，但扫描仍可能经过二级索引，取决于优化器选的主键路径） | 不阻塞 `id=6..9` 的插入 |
| `UPDATE t SET v='x' WHERE id BETWEEN 5 AND 10` | `id=5`：`X,REC_NOT_GAP`；`id=10`：`X`（Next-Key）；`id=15`：`X,GAP` | 无（走主键范围） | 插入 `id=6..9` 或 `id=11..14` 会等 |
| `SELECT ... WHERE id = 7 FOR UPDATE` | `id=10`：`X,GAP` | 无 | 插入 `id=6..9` 会等 |
| `UPDATE t SET v='x' WHERE k = 20` | `id=5`：`X,REC_NOT_GAP`（回表） | `(20,5)`：`X`（Next-Key）；`(30,10)` 前：`X,GAP` | 插入 `(20,7)`、`k=21..29` 会等 |
| `UPDATE t SET v='x' WHERE k BETWEEN 10 AND 30` | `id=5/10/15`：`X,REC_NOT_GAP`（逐行回表） | `(10,5)`：`X,REC_NOT_GAP`（精确下界）；`(20,5)`：`X`；`(30,10)`：`X`；`(40,15)` 前：`X,GAP` | 插入 `k=11..39` 的多个位置会等 |

这张表要配合 `performance_schema.data_locks` 读。MySQL 8.0 里，`LOCK_MODE` 的字符串和源码位标志大致对应：

| `LOCK_MODE` | 对应源码 | 含义 |
|---|---|---|
| `X,REC_NOT_GAP` | `LOCK_X \| LOCK_REC_NOT_GAP` | 只锁记录，不锁缝 |
| `X,GAP` | `LOCK_X \| LOCK_GAP` | 只锁缝 |
| `X` | `LOCK_X \| LOCK_ORDINARY` | Next-Key，记录 + 缝 |
| `X,INSERT_INTENTION` | `LOCK_X \| LOCK_GAP \| LOCK_INSERT_INTENTION` | 插入意向锁 |
| `S` / `S,REC_NOT_GAP` / `S,GAP` | 对应的共享模式 | 共享版 |

`LOCK_DATA` 则告诉你锁落在哪条索引记录上。如果它显示 `supremum pseudo-record`，说明锁的是最后一条记录之后的无限区间。一个很实用的读法是：

- 先看 `INDEX_NAME`：锁在 `PRIMARY` 还是 `idx_k`；
- 再看 `LOCK_MODE`：是记录、缝，还是 Next-Key；
- 最后看 `LOCK_DATA`：缝的右端是哪条记录。缝的左端由索引里的前一条记录决定，通常不需要单独查。

把这三列读出来，开头那个「A 只改了一行，B 为什么插入不了」的问题就不需要猜了：`idx_k` 上有一条 `(30,10)` 的 `X,GAP`，B 的 `(20,7)` 正好落在它前面。

## 常见误区与排查清单

先列误区，每一条都能在上面的源码里找到反例。

- **「锁是锁行」**：锁的是索引记录。同一行在聚簇索引和每个二级索引里都有独立的锁坐标；更新非索引列也可能在二级索引上加锁。
- **「唯一索引等值查询一定只加记录锁」**：命中且未删除标记才是；没命中会在后继记录前加间隙锁，删除标记的记录也可能退化成 Next-Key。
- **「间隙锁之间会冲突」**：不会。缝锁可以共存；真正冲突的是插入意向锁与缝锁。
- **「插入意向锁之间会冲突」**：不会。它们互相兼容，冲突来自别人已经持有的缝锁。
- **「Next-Key 是两个锁对象」**：语义上是两段，内存里常常是一个 `lock_t` 加位图；等待时还可能拆成「已有记录锁，只补缝锁」。
- **「RC 没有锁」**：RC 没有间隙锁，但记录锁、唯一约束检查、外键检查的锁都还在。
- **「锁等待超时只回滚语句，所以事务没事」**：事务还在，前面语句的修改也还在；多数场景应该回滚整个事务再重试。
- **「死锁是随机挑一个回滚」**：受害者按权重选，优先回滚较小的事务；平局偏向最近加入等待环的事务。
- **「快照读看到旧值是因为没加锁」**：是因为 MVCC 的 ReadView，不是锁的缺席。

再给一份排查清单。遇到锁等待或死锁，按顺序做，不要跳步。

1. **确认隔离级别。** `SELECT @@transaction_isolation;`。RR 有缝锁，RC 没有；这一条决定了你该不该继续找 `X,GAP`。
2. **确认语句是不是当前读。** 普通 `SELECT` 不参与锁竞争；`FOR UPDATE`、`FOR SHARE`、`UPDATE`、`DELETE` 才参与。
3. **看 `performance_schema.data_locks`。** 关注 `ENGINE_TRANSACTION_ID`、`INDEX_NAME`、`LOCK_TYPE`、`LOCK_MODE`、`LOCK_DATA`；先找 `X,GAP` 和 `X`，再找 `X,REC_NOT_GAP`。
4. **看 `performance_schema.data_lock_waits`。** 它把「谁等谁」连成边；配合 `data_locks` 可以还原等待图。
5. **看 `SHOW ENGINE INNODB STATUS`。** `TRANSACTIONS` 段列出等待中的事务和持有锁；`LATEST DETECTED DEADLOCK` 段给出最近一次环、SQL、锁模式，是最省时间的证据。
6. **看执行计划。** `EXPLAIN` 确认走的是哪个索引、扫描多少行。走错索引会让锁的区间比你以为的大；没有索引则可能锁住大量记录，甚至退化成表级效果。
7. **统一加锁顺序。** 多条更新按主键排序；批量任务分批提交；避免在长事务里做用户交互或网络调用。
8. **缩小当前读的范围。** 能唯一等值就不要范围；能覆盖索引就不要回表；能 RC 且业务允许幻读，就用 RC 换并发。

最后补一句排查口径：**先问「哪个索引」，再问「哪段区间」，最后问「哪个隔离级别」。** 顺序反过来，就会陷入「我明明只改了一行」的直觉里。

## 结语：锁的边界

InnoDB 的锁系统可以用三句话收束。

**第一句：锁的地址是索引，不是行。** 一条 SQL 锁住的是某个索引上的一条记录、一段缝，或者两者。二级索引和聚簇索引是两套地址；回表是两次加锁。理解这一点，「我只改了一行」和「为什么插不进去」就不再矛盾。

**第二句：锁的形状由隔离级别和访问路径共同决定。** RR 用 Next-Key 和间隙锁防幻读；RC 跳过缝锁，用 MVCC 的最新快照换并发。唯一等值命中只钉记录，唯一等值落空锁后继的缝，范围扫描按「记录是否在范围内 / 缝是否与范围相交」两两组合选锁型。没有一条规则是拍脑袋定的，全部落在 `row_compare_row_to_range` 的三态里。

**第三句：锁的竞争由队列和等待图收尾。** 锁队列不是 FIFO，CATS 权重会让「挡住更多人」的事务先走；死锁检测用染色 DFS 找环，再验证环上的事务是否真的还在等，最后按权重挑一个较小的受害者。超时和死锁是两种不同的失败：一个默认只回滚语句，一个回滚整个事务。

Next-Key 不是一把更大的锁，而是把记录和它前面的缝一起记账；间隙锁不是锁住空行，而是锁住「未来可能出现的行」的位置。理解了这两个比喻，再看 `data_locks` 里的 `X,GAP` 和 `X`，你看到的就不再是一堆神秘的字符串，而是一张索引上的地图：哪里是钉子，哪里是缝，谁站在缝里，谁在等谁让开。

如果说 [WAL 篇](/article/wal-deep-dive/)讲的是「时间上的边界」——提交之前与崩溃之后；[B+ 树篇](/article/btree-page-split/)讲的是「空间上的边界」——页满之后与新页之前；那么这一篇讲的是「并发上的边界」——一个事务的锁，究竟延伸到了哪条索引记录、哪段缝、哪一个未来。
