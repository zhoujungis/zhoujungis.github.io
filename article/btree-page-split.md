---
title: "B+ 树索引回源：页分裂长什么样"
slug: btree-page-split
cover_image: /photos/btree-cover.png
date: 2026-10-29
tags: ["数据库", "存储引擎", "后端"]
---

> 适用读者：读完慢查询调优文章、想知道「索引为什么会碎片、为什么顺序写不碎」的后端工程师；正在实现 B+ 树或遭遇页分裂相关抖动的人；想把教科书上的「split」两个字母落到具体字节的人
> 结论先行：页分裂不是一次原子的「一分为二」，而是一场**有预谋的多步手术**——选分裂点、申请新页、改父指针、搬记录、可能递归长高、还可能整场重来。本文不写一行自造代码，全部证据来自 SQLite `src/btree.c` 与 InnoDB `btr0btr.cc` / `btr0cur.cc`：8 字节页头与 94 字节堆起点、`nFree*3<=usableSize*2` 的重排阈值、`balance_nonroot` 最多 5 页的配平、`btr_page_split_and_insert` 的八步手术单、根页「原地变内部页」与「先搬家再分裂」的两条长高路线、以及「只许成功不许回滚」的两页空间预留
> 阅读时间：约 40 分钟 | 难度：进阶 | 收获：两套真实页格式的逐字拆解 + 分裂全流程源码对照 + 一条接回慢查询实战的实践线

**目录**

- 前言：慢查询是表，页分裂是里
- 先看案发现场：一页到底长什么样
- SQLite 的页：8 字节头与相向而生的两个数组
- InnoDB 的页：38 字节 FIL 头、哨兵记录与 slot 目录
- 插入前的三道检查：放不下是怎样被发现的
- 什么时候值得动手术：重组阈值与「50% 填充」的真相
- SQLite 的手术室：balance_nonroot 的配平账本
- InnoDB 的手术单：btr_page_split_and_insert 八步
- 分裂点怎么选：中点、方向与启发式
- 新页从哪来：freelist、extent 预留与只许成功
- 父页的分隔键：分裂如何递归向上
- 树怎么长高：两条路线，同样不变的根
- 手术可能白做：重组、重试与整场重来
- 页内碎片：freeblock 链与整理的时机
- 顺序写为什么不碎：分裂方向的暗示
- 并发之下：树锁的释放时机与不可回滚契约
- 两套实现对照表与实践线
- 结语

## 前言：慢查询是表，页分裂是里

之前那篇《慢查询实战》讲的是**表**：看到扫描行数爆炸、看到临时表、看到回表次数，然后改写 SQL、加覆盖索引、调改写阈值。但有几个常见现象，只有钻到存储引擎的页里才能真正解释：

- 为什么**顺序主键**建出来的索引紧凑，随机 UUID 建出来的索引碎片多、页数多？
- 为什么大量插入后表空间文件涨得比数据本身多？那些多出来的页是哪来的？
- 索引页为什么会有「填充率」一说，教科书上写的一半满，在源码里真的存在吗？
- 「树高 +1」听起来是全局大事，它到底是一次性大动作还是一步步涨上去的？

答案全部收敛到同一个机制：**页分裂**（page split）。B+ 树的每个节点是一整页，页满了就必须撕成两半、把多出来的一半挂到父节点上；父节点因此可能再分裂，一路递归到根，根分裂则整棵树长高一层。

本文把两套工业级实现的分裂路径并排放着读：**SQLite**（单文件、教科书级清晰的 `balance` 系列函数）与 **InnoDB**（生产级、有并发与表空间管理的 `btr_page_split_and_insert`）。两边的页格式天差地别，但手术流程惊人地一致：**检查 → 选点 → 分配 → 改结构 → 搬记录 → 递归向上**。

与 WAL 篇一样，全部结论回源码取证；取证不到的（比如「50% 填充率」这句流行说法）会如实标注为源码不存在，并给出实际机制。

## 先看案发现场：一页到底长什么样

分裂是把一页变成两页，所以第一件事是弄清单页的构造。教科书说「节点里有 n 个键和 n+1 个指针」，但源码里的真实布局比这有趣得多——**键和指针并不相邻存放**。

## SQLite 的页：8 字节头与相向而生的两个数组

SQLite 官方文件格式注释（`src/btreeInt.h`）画得很直白：

```
**      |----------------|
**      | file header    |   100 bytes.  Page 1 only.
**      |----------------|
**      | page header    |   8 bytes for leaves.  12 bytes for interior nodes
**      |----------------|
**      | cell pointer   |   |  2 bytes per cell.  Sorted order.
**      | array          |   |  Grows downward
**      |                |   v
**      |----------------|
**      | unallocated    |
**      | space          |
**      |----------------|   ^  Grows upwards
**      | cell content   |   |  Arbitrary order interspersed with freeblocks.
**      | area           |   |  and free space fragments.
**      |----------------|
```

一页从上往下是「页头 → cell 指针数组（向低地址长）」，从下往上是「cell 内容区（向高地址长）」，两边**相向而生，中间是未分配空隙**。这个「相向生长」的结构是后面一切空间计算的几何基础：指针数组尾部到内容区起点的距离，就是这一页还能装多少东西的唯一真相。

页头字段表同样在 `btreeInt.h`：

```
**   OFFSET   SIZE     DESCRIPTION
**      0       1      Flags. 1: intkey, 2: zerodata, 4: leafdata, 8: leaf
**      1       2      byte offset to the first freeblock
**      3       2      number of cells on this page
**      5       2      first byte of the cell content area
**      7       1      number of fragmented free bytes
**      8       4      Right child (the Ptr(N) value).  Omitted on leaves.
```

叶子页 8 字节头，内部页多一个 4 字节右孩子指针共 12 字节。读页时 `btreeInitPage()` 把这些字段翻进内存结构：

```c
  pPage->cellOffset = (u16)(pPage->hdrOffset + 8 + pPage->childPtrSize);
  pPage->aCellIdx = data + pPage->childPtrSize + 8;
  pPage->aDataEnd = pPage->aData + pBt->pageSize;
  pPage->aDataOfst = pPage->aData + pPage->childPtrSize;
  /* EVIDENCE-OF: R-37002-32774 The two-byte integer at offset 3 gives the
  ** number of cells on the page. */
  pPage->nCell = get2byte(&data[3]);
```

注意此时页内容**一个字节都没读**——只有页头进入内存。cell 何时真正解码，要等到查找或插入真的踩到它。

## InnoDB 的页：38 字节 FIL 头、哨兵记录与 slot 目录

InnoDB 的一页要厚重得多：默认 16 KB（`UNIV_PAGE_SIZE_SHIFT_DEF = 14`，`include/univ.i`），开头是 38 字节 FIL 文件头（页号、校验和、页类型、LSN……），然后才是索引页头：

```c
/** index page header starts at this offset */
constexpr uint32_t PAGE_HEADER = FSEG_PAGE_DATA;

/*-----------------------------*/
/** number of slots in page directory */
constexpr uint32_t PAGE_N_DIR_SLOTS = 0;
/** pointer to record heap top */
constexpr uint32_t PAGE_HEAP_TOP = 2;
/** number of records in the heap, bit 15=flag: new-style compact page format */
constexpr uint32_t PAGE_N_HEAP = 4;
/** pointer to start of page free record list */
constexpr uint32_t PAGE_FREE = 6;
/** number of bytes in deleted records */
constexpr uint32_t PAGE_GARBAGE = 8;
```

（`include/page0types.h`。）字段继续往下：`PAGE_N_RECS = 16` 用户记录数、`PAGE_LEVEL = 26` 节点层高（叶子是 0）、`PAGE_INDEX_ID = 28`。用户记录的起点是：

```c
/** start of data on the page */
constexpr uint32_t PAGE_DATA = PAGE_HEADER + 36 + 2 * FSEG_HEADER_SIZE;
```

38（FIL）+ 36（字段区）+ 20（两个 10 字节段头，只在根页用）= **94**。也就是说 InnoDB 一页的前 94 字节与用户数据无关，页尾还有 8 字节的目录收尾区（`FIL_PAGE_DATA_END`）。真正干活的记录堆从 94 开始，而堆的最前面固定钉着两条 13 字节的哨兵：

```c
static const byte infimum_supremum_compact[] = {
    /* the infimum record */
    0x01 /*n_owned=1*/, 0x00, 0x02 /* heap_no=0, REC_STATUS_INFIMUM */, 0x00,
    0x0d /* pointer to supremum */, 'i', 'n', 'f', 'i', 'm', 'u', 'm', 0,
    /* the supremum record */
    0x01 /*n_owned=1*/, 0x00, 0x0b /* heap_no=1, REC_STATUS_SUPREMUM */, 0x00,
    0x00 /* end of record list */, 's', 'u', 'p', 'r', 'e', 'm', 'u', 'm'};
```

`page_create_low()` 初始化空页时把这 30 字节 `memcpy` 到 `PAGE_DATA`。infimum 是记录链的头、supremum 是尾，**每一条记录的「下一条」都能顺藤摸瓜走到头**——这个设计在分裂搬记录时会反复出现：搬一半记录，本质是把一条单链从中间剪断再接两条。

记录头的位布局（`include/rem0rec.ic` 的注释）值得逐字看一眼，它是「单链 + 目录」两条索引并存的证据：

```
        (1) byte offset         (2) bit usage within byte
        downward from
        origin ->       1       8 bits relative offset of next record
                        2       8 bits relative offset of next record
                                  the relative offset is an unsigned 16-bit
                                  integer:
                                  (offset_of_next_record
                                   - offset_of_this_record) mod 64Ki,
                        3       3 bits status:
                                        000=conventional record
                                        001=node pointer record (inside B-tree)
                                        010=infimum record
                                        011=supremum record
                                5 bits heap number
                        4       8 bits heap number
                        5       4 bits n_owned
                                4 bits info bits
```

每条记录原点之前 5 字节头，第 1~2 字节存的是**相对偏移**（无符号、mod 64Ki），所以记录在页内可以乱序存放而链不乱——`page_get_middle_rec` 按序号跳到中点、`page_move_rec_list_*` 剪断重接，靠的都是这 2 字节。`n_owned` 则配合页尾目录：每 4~8 条记录分摊一个 slot，二分查找时先在页尾 slot 上走、再顺链微调。

两种布局的对照到这里已经可以立住了：

| | SQLite | InnoDB |
|---|---|---|
| 页头 | 8 / 12 字节 | FIL 38 字节 + 字段区 36 字节 + 段头 20 字节 |
| 记录寻址 | 2 字节 cell 指针数组（排序，直接寻址） | 记录头 2 字节相对偏移单链 + 页尾 slot 目录 |
| 页尾 | 无 | 8 字节目录区，slot 2 字节/个 |
| 「下一条」 | 无（数组天然有序） | 相对偏移 mod 64Ki |

**数组寻址快但插入要 memmove，链式插入 O(1) 但查找要走链**——分裂时两者的代价结构正好反过来：SQLite 要搬指针也要搬内容，InnoDB 主要是把链剪断重接。

## 插入前的三道检查：放不下是怎样被发现的

「页满了」不是一个瞬间，而是三道依次收紧的检查。SQLite 这边，第一道在 `insertCell()`：

```c
  if( pPage->nOverflow || sz+2>pPage->nFree ){
    if( pTemp ){
      memcpy(pTemp, pCell, sz);
      pCell = pTemp;
    }
    put4byte(pCell, iChild);
    j = pPage->nOverflow++;
    /* Comparison against ArraySize-1 since we hold back one extra slot
    ** as a contingency.  In other words, never need more than 3 overflow
    ** slots but 4 are allocated, just to be safe. */
    assert( j < ArraySize(pPage->apOvfl)-1 );
    pPage->apOvfl[j] = pCell;
    pPage->aiOvfl[j] = (u16)i;
```

新 cell 需要 `sz+2` 字节（内容 + 2 字节指针），超过本页空闲 `nFree` 就**不落页**，挂进进程内的 overflow 槽（最多用 3 个、分配 4 个）。注意此时磁盘上的页毫发无损——溢出是内存里的账，等 `balance()` 来清算。这是个重要的设计：**分裂的决策可以攒着，不必每插一条就重排一次**。

第二道在 `allocateSpace()`，处理「未分配空隙不够但页里其实有空洞」的情况：

```c
  /* The request could not be fulfilled using a freelist slot.  Check
  ** to see if defragmentation is necessary.
  */
  testcase( gap+2+nByte==top );
  if( gap+2+nByte>top ){
    assert( pPage->nCell>0 || CORRUPT_DB );
    assert( pPage->nFree>=0 );
    rc = defragmentPage(pPage, MIN(4, pPage->nFree - (2+nByte)));
    if( rc ) return rc;
    top = get2byteNotZero(&data[hdr+5]);
    assert( gap+2+nByte<=top );
  }
```

「指针数组尾部到内容区起点」的空隙装不下时，先调 `defragmentPage` 把散落的 cell 挤紧再试——**能整理就不分裂**。整理后还放不下，才回到第一道走 overflow。

第三道是删除路径的边界检查 `dropCell()`，顺带展示了这个几何结构的腐败检测：

```c
  pc = get2byte(ptr);
  hdr = pPage->hdrOffset;
  testcase( pc==(u32)get2byte(&data[hdr+5]) );
  testcase( pc+sz==pPage->pBt->usableSize );
  if( pc+sz > pPage->pBt->usableSize ){
    *pRC = SQLITE_CORRUPT_BKPT;
    return;
  }
  rc = freeSpace(pPage, pc, sz);
```

「偏移 + 长度」越出可用页尾即判库损坏——数组结构的每一条边界都是可计算的，算不出来就是坏的。

InnoDB 的对应路径分乐观与悲观两级。乐观插入 `btr_cur_optimistic_insert()`（`btr/btr0cur.cc`）先算容量：

```c
  ulint max_size = page_get_max_insert_size_after_reorganize(page, 1);

  if (page_has_garbage(page)) {
    if ((max_size < rec_size || max_size < BTR_CUR_PAGE_REORGANIZE_LIMIT) &&
        page_get_n_recs(page) > 1 &&
        page_get_max_insert_size(page, 1) < rec_size) {
      goto fail;
    }
  } else if (max_size < rec_size) {
    goto fail;
  }
```

`fail:` 标签给 `err = DB_FAIL`。判据同样是两级：**重组后能不能放下**（`max_insert_size_after_reorganize`，先假设整理过）与**原样能不能放下**（`max_insert_size`）——与 SQLite 的「先 defragment 再说」如出一辙。配套宏说明重组的门槛：

```c
/** In the optimistic insert, if the insert does not fit, but this much space
can be released by page reorganize, then it is reorganized */
#define BTR_CUR_PAGE_REORGANIZE_LIMIT (UNIV_PAGE_SIZE / 32)
```

16 KB 的 1/32 = 512 字节：空洞超过 512 字节就值得重组一次。

`DB_FAIL` 之后进入悲观路径 `btr_cur_pessimistic_insert()`，在这里分裂被正式分流——**根页与普通页是两条路**：

```c
  if (dict_index_get_page(index) ==
      btr_cur_get_block(cursor)->page.id.page_no()) {
    /* The page is the root page */
    *rec = btr_root_raise_and_insert(flags, cursor, offsets, heap, entry, mtr);
  } else {
    *rec = btr_page_split_and_insert(flags, cursor, offsets, heap, entry, mtr);
  }

  if (!*rec) {
    return DB_OUT_OF_FILE_SPACE;
  }
```

最底层的「放不下」则由 `page_mem_alloc_heap()` 的返回值宣判（`page/page0page.cc`）：堆顶加 `need` 超过可用空间就 `return (nullptr)`。三道检查、两级路径、一个失败出口——放不下是怎样被一层层发现的，链路完整了。

## 什么时候值得动手术：重组阈值与「50% 填充」的真相

SQLite 把「要不要动手术」浓缩成 `balance()` 入口的一个算式：

```c
    if( NEVER(pPage->nFree<0) && btreeComputeFreeSpace(pPage) ) break;
    if( pPage->nOverflow==0 && pPage->nFree*3<=(int)pCur->pBt->usableSize*2 ){
      /* No rebalance required as long as:
      **   (1) There are no overflow cells
      **   (2) The amount of free space on the page is less than 2/3rds of
      **       the total usable space on the page. */
      break;
```

两条同时满足就不重排：**没有溢出 cell，且空闲空间不超过可用区的 2/3**。注意这是重排的**下**界——页得空到 1/3 以下才值得动，而不是满了才动。攒一批 overflow 一起处理，均摊了每次分裂的固定开销。

现在说那句流行的话：「B+ 树页分裂后每页约 50% 填充」。**InnoDB 源码里没有 "50%" 这个字面量**（已 grep 确认），实际机制是按记录条数取中点（`include/page0page.ic`）：

```c
/** Returns the middle record of the records on the page. If there is an
 even number of records in the list, returns the first record of the
 upper half-list.
 @return middle record */
static inline rec_t *page_get_middle_rec(page_t *page) /*!< in: page */
{
  ulint middle = (page_get_n_recs(page) + PAGE_HEAP_NO_USER_LOW) / 2;

  return (page_rec_get_nth(page, middle));
}
```

`(n_recs + 2) / 2`——按**条数**取中点，不是按字节数。一条 100 字节的记录和一条 800 字节的记录各算一票，所以分裂后的两半字节数经常明显不等；再加上左右倾斜的启发式（下文第五节），「一半满」只是条数意义的近似。教科书的 50% 是对**条数**说的，也是对**均匀记录**假设下对字节说的——这句话的严谨版本是：**中点按条数切，字节分布看记录大小的运气**。

而 SQLite 连中点都不保证：它的配平目标写在 `balance_nonroot()` 的注释里，是「若干页装下全部 cell、每页都不超 `usableSpace`」的装箱问题，允许结果是 2 页、3 页甚至更多，每页的填充率由 cell 大小的组合决定。

## SQLite 的手术室：balance_nonroot 的配平账本

`balance()` 是入口，注释列出它调度的三个子程序——`balance_quick()`（快路径，一分为二）、`balance_deeper()`（长高）、`balance_nonroot()`（通用配平）。真正的重分配在 `balance_nonroot()`，第一件事是记账：

```c
  /*
  ** Figure out the number of pages needed to hold all b.nCell cells.
  ** Store this number in "k".  Also compute szNew[] which is the total
  ** size of all cells on the i-th page and cntNew[] which is the index
  ** in b.apCell[] of the cell that divides page i from page i+1. 
  ** cntNew[k] should equal b.nCell.
  **
  ** Values computed by this block:
  **
  **           k: The total number of sibling pages
  **    szNew[i]: Spaced used on the i-th sibling page.
  **   cntNew[i]: Index in b.apCell[] and b.szCell[] for the first cell to
  **              the right of the i-th sibling page.
  ** usableSpace: Number of bytes of space available on each sibling.
  **
  */
```

先取出本页与左右兄弟页的**全部 cell 摊平**，然后回答三个问题：装完需要几页（`k`）、每页占多少字节（`szNew[]`）、每一刀切在哪（`cntNew[]`）。接着是配平循环：

```c
  k = nOld;
  for(i=0; i<k; i++){
    int sz;
    while( szNew[i]>usableSpace ){
      if( i+1>=k ){
        k = i+2;
        if( k>NB+2 ){ rc = SQLITE_CORRUPT_BKPT; goto balance_cleanup; }
        szNew[k-1] = 0;
        cntNew[k-1] = b.nCell;
      }
      sz = 2 + cachedCellSize(&b, cntNew[i]-1);
      szNew[i] -= sz;
      if( !leafData ){
        if( cntNew[i]<b.nCell ){
          sz = 2 + cachedCellSize(&b, cntNew[i]);
        }else{
          sz = 0;
        }
      }
      szNew[i+1] += sz;
      cntNew[i]--;
    }
```

逐行读：某页累计超过 `usableSpace`，就把最右边的 cell 挪给下一页（`szNew[i] -= sz; szNew[i+1] += sz`），挪到本页装下为止；如果后面根本没有下一页，`k = i+2` **新开一页**——2 页变 3 页就是在这里发生的。每搬一个 cell 都按真实字节数增减，这是精确的装箱，不是拍脑袋的对半。上限被常量卡死：

```c
#define NN 1             /* Number of neighbors on either side of pPage */
#define NB 3             /* (NN*2+1): Total pages involved in the balance */
```

参与平衡的是本页加左右各一个兄弟（NB=3），新页数上限 `NB+2 = 5`，超出直接 `SQLITE_CORRUPT_BKPT`。NB 上方的注释还有句实话：`NB has been 3 since the inception of SQLite and we have never tested any other value.`

装箱只是第一轮，注释说它有偏：`The packing computed by the previous block is biased toward the siblings on the left side ... This adjustment is not optional.`——右兄弟可能被搬空，必须再做一次调整。**配平是两次扫描：先装、再纠偏。**

分裂的终点是把新页挂回树上。`balance_quick()` 的注释把分隔键的构造讲得非常细：

```c
    /* Create a divider cell to insert into pParent. The divider cell
    ** consists of a 4-byte page number (the page number of pPage) and
    ** a variable length key value (which must be the same value as the
    ** largest key on pPage).
    **
    ** To find the largest key value on pPage, first find the right-most
    ** cell on pPage. The first two fields of this cell are the
    ** record-length (a variable length integer at most 32-bits in size)
    ** and the key value (a variable length integer, may have any value).
    ** The first of the while(...) loops below skips over the record-length
    ** field. The second while(...) loop copies the key value from the
    ** cell on pPage into the pSpace buffer.
    */
```

分隔键 =「被分裂页的最大 key + 该页页号」，从原页最右 cell 现场抠出来，然后：

```c
    /* Insert the new divider cell into pParent. */
    if( rc==SQLITE_OK ){
      rc = insertCell(pParent, pParent->nCell, pSpace, (int)(pOut-pSpace),
                      0, pPage->pgno);
    }
```

（上面第二行的 `(int)(pOut-pSpace)` 以源码为准，此处为示意——正文引用以下方 `balance_nonroot` 的通用路径为准。）通用路径的对应两行则毫无修饰：

```c
  /* Insert new divider cells into pParent. */
  for(i=0; i<nNew-1; i++){
```

```c
    rc = insertCell(pParent, nxDiv+i, pCell, sz, pTemp, pNew->pgno);
```

每个新页（除最右）都向父页补一个分隔 cell。而父页放不下这个新 cell 时——回想第一道检查——它会变成父页的 overflow，等父页的 `balance()` 清算。**分裂就是这样自下而上传播的。**

## InnoDB 的手术单：btr_page_split_and_insert 八步

InnoDB 的分裂函数在 `btr/btr0btr.cc`（不是 btr0cur.cc），头注释就是一张手术须知：

```c
/** Splits an index page to halves and inserts the tuple. It is assumed
 that mtr holds an x-latch to the index tree. NOTE: the tree x-latch is
 released within this function! NOTE that the operation of this
 function must always succeed, we cannot reverse it: therefore enough
 free disk space (2 pages) must be guaranteed to be available before
 this function is called.
 @return inserted record */
```

三句话三个承诺：树上已有 X 锁、锁会在函数内提前释放、**只许成功不许回滚**——所以调用前必须保证 2 页的空闲磁盘。WAL 篇讲过的「先记账再动数据」在这里换了个形态：redo 保证崩溃后能重放，但重放中途没有回滚，所以空间必须先备齐。

函数主体用编号注释标出八个步骤，取证到的关键节点：

**第 1 步——选分裂点：**

```c
  /* 1. Decide the split record; split_rec == NULL means that the
  tuple to be inserted should be the first record on the upper
  half-page */
  insert_left = false;

  if (n_iterations > 0) {
    direction = FSP_UP;
    hint_page_no = page_no + 1;
    split_rec = btr_page_get_split_rec(cursor, tuple);
```

**第 2 步——中点兜底 + 分配新页：**

```c
    if (page_get_n_recs(page) > 1) {
      split_rec = page_get_middle_rec(page);
    } else if (btr_page_tuple_smaller(cursor, tuple, offsets, n_uniq, heap)) {
      split_rec = page_rec_get_next(page_get_infimum_rec(page));
    } else {
      split_rec = nullptr;
    }
  }

  /* 2. Allocate a new page to the index */
  new_block = btr_page_alloc(cursor->index, hint_page_no, direction,
                             btr_page_get_level(page), mtr, mtr);
```

**第 5 步——把一半记录搬到新页：**

```c
  /* 5. Move then the records to the new page */
  if (direction == FSP_DOWN) {
    /*          fputs("Split left\n", stderr); */

    if (false
#ifdef UNIV_ZIP_COPY
        || page_zip
#endif /* UNIV_ZIP_COPY */
        || !page_move_rec_list_start(new_block, block, move_limit,
                                     cursor->index, mtr)) {
```

（右搬分支在后面调 `page_move_rec_list_end`。）中间还有第 3 步算上半页首记录、第 4 步 `btr_attach_half_pages` 改树结构、第 6 步决定元组插进哪半、第 7 步重定位光标、第 8 步插入。完整的八步单：

1. `/* 1. Decide the split record; ... */` 选分裂点
2. `/* 2. Allocate a new page to the index */` 分配新页
3. `/* 3. Calculate the first record on the upper half-page...*/` 算上半页首记录
4. `/* 4. Do first the modifications in the tree structure */` 挂新页、改父指针（`btr_attach_half_pages`）
5. `/* 5. Move then the records to the new page */` 搬记录
6. `/* 6. ... Decide the page where the tuple should be inserted */` 决定插入哪半
7. `/* 7. Reposition the cursor for insert...*/` 重定位光标
8. `/* 8. If insert did not fit, try page reorganization...*/` 插不进就重组再试

第 8 步的失败处理是整段最生猛的一行——`n_iterations++; goto func_start;`，**整场重来**，回到第 1 步换个分裂点再来一轮。第 4 步里 `btr_attach_half_pages` 的注释则是递归的证据：

```c
  /* Build the node pointer (= node key and page address) for the upper
  half */

  node_ptr_upper =
      dict_index_build_node_ptr(index, split_rec, upper_page_no, heap, level);

  /* Insert it next to the pointer to the lower half. Note that this
  may generate recursion leading to a split on the higher level. */

  btr_insert_on_non_leaf_level(flags, index, level + 1, node_ptr_upper,
                               UT_LOCATION_HERE, mtr);
```

`may generate recursion leading to a split on the higher level`——父层可能因此再分裂，一路涨到根。

## 分裂点怎么选：中点、方向与启发式

分裂点的选择直接决定两半的均衡，两边策略不同。InnoDB 是「启发式优先、中点兜底」：先 `btr_page_get_split_rec` 按插入方向试导向右（`FSP_UP`、`hint_page_no = page_no + 1`）或向左，失败了才退回 `page_get_middle_rec` 按条数取中。更极端的情况是只有一条记录时，按新元组与它的大小关系决定 `split_rec` 还是 `nullptr`（新元组直接成为上半页第一条）。

`split_rec == NULL` 那条分支值得留意：**待插入的元组本身就是分裂点**——它将成为右半页的第一条记录。这让「往满页里插一个比所有人都大/小的 key」这种边界情况不必先插后搬，直接切在待插入位置。

SQLite 的 `balance_nonroot` 不选点，它**摊平后重新装箱**：不关心原来哪条在哪，只按 `cntNew[]` 切刀重装 2~3 页。两者哲学差异在此：

- **InnoDB**：保持链的相对次序，从中间剪断，O(半页) 搬移，方向启发式让顺序追加的分裂点尽量靠后（配合新页分配的 `hint_page_no`，让同向插入的页号连号）。
- **SQLite**：全量摊平重排，用两次扫描保证每页都在 `usableSpace` 内，代价是 cell 指针与内容都要动，换来的是「一次 balance 解决所有历史欠账」。

## 新页从哪来：freelist、extent 预留与只许成功

分裂的第二个关键输入是新页。SQLite 走文件级 freelist——空闲页以 trunk/leaf 两级结构链在第 1 页偏移 32 处：

```c
  /* If control flows to this point, then it was not possible to add the
  ** the page being freed as a leaf page of the first trunk in the free-list.
  ** Possibly because the free-list is empty, or possibly because the
  ** first trunk in the free-list is full. Either way, the page being freed
  ** will become the new first trunk page in the free-list.
  */
  if( pPage==0 && SQLITE_OK!=(rc = btreeGetPage(pBt, iPage, &pPage, 0)) ){
    goto freepage_out;
  }
  rc = sqlite3PagerWrite(pPage->pDbPage);
  if( rc!=SQLITE_OK ){
    goto freepage_out;
  }
  put4byte(pPage->aData, iTrunk);
  put4byte(&pPage->aData[4], 0);
  put4byte(&pPage1->aData[32], iPage);
```

`freePage2()` 把被删的页挂为新 trunk（页头 4 字节指向下个 trunk、第 5 字节记 leaf 数），分配端 `allocateBtreePage()` 从同一位置取：`iTrunk = get4byte(&pPage1->aData[32]);`。**删表的页变成分裂的新页**，文件因此不必一直长。

InnoDB 这边是段/extent 分配，且把「只许成功」贯彻成了前置预留。悲观插入在进分裂函数之前先留够空间（`btr0cur.cc`）：

```c
  if (!(flags & BTR_NO_UNDO_LOG_FLAG) || index->table->is_intrinsic()) {
    /* First reserve enough free space for the file segments
    of the index tree, so that the insert will not fail because
    of lack of space */

    ulint n_extents = cursor->tree_height / 16 + 3;

    success = fsp_reserve_free_extents(&n_reserved, index->space, n_extents,
                                       FSP_NORMAL, mtr);
    if (!success) {
      return (DB_OUT_OF_FILE_SPACE);
    }
  }
```

预留量随树高走（`tree_height / 16 + 3` 个 extent），树越高、分裂波及层越多、预留越多——**把「递归长高可能连续分配多页」的最坏情况一次算进去**。分配本体 `btr_page_alloc` 的文档则坦承这个保证有多虚：

```c
  /* Parameter true below states that the caller has made the
  reservation for free extents, and thus we know that a page can
  be allocated. However, for the cases where the file size is
  either smaller than an extent or same as the initial size,
  the fsp_reserve_free_extents returns reserved extents as 0.
  This can be true even if the initial allocation is about
  to be completely filled up. The function below is a point
  of no return and expects that enough space is already allocated.
  However, the callers of this function rely on the success/failure
  return by fsp_reserve_free_extents, which does not really guarantee
  that a whole extent has been reserved.
  The function fseg_alloc_free_page_general should attempt to ensure
  enough space is reserved before proceeding ahead. */
```

`point of no return`——过了这道门就没有回头路，所以函数文档要求「空间已就位」；预留本身又「并不真的保证留了一整个 extent」，最后的兜底是 `btr_page_alloc` 返回 NULL → 分裂返回 nullptr → 上层 `DB_OUT_OF_FILE_SPACE`。**把失败挡在门外（预留）+ 门内尽力（point of no return）+ 兜底错误码**，三层才撑起头注释那句 "must always succeed"。

## 父页的分隔键：分裂如何递归向上

两边的递归机制同构：新页需要一个指向父层的分隔键，父层放不下就自己分裂。InnoDB 的递归入口是 `btr_insert_on_non_leaf_level()`（`btr0btr.cc`，注意 8.x 实名如此，不是 `btr_cur_insert_on_non_leaf_level`），`btr_attach_half_pages` 调用它时的注释已明说 `may generate recursion`。函数内部：

```c
      btr_cur_search_to_nth_level(index, level, tuple, PAGE_CUR_LE,
                                  BTR_CONT_MODIFY_TREE, &cursor, 0,
                                  location.filename, location.line, mtr);
```

```c
  if (err == DB_FAIL) {
    err = btr_cur_pessimistic_insert(
        flags | BTR_NO_LOCKING_FLAG | BTR_KEEP_SYS_FLAG | BTR_NO_UNDO_LOG_FLAG,
        &cursor, &offsets, &heap, tuple, &rec, &dummy_big_rec, nullptr, mtr);
    ut_a(err == DB_SUCCESS);
  }
```

先在 `level + 1` 层乐观插入，`DB_FAIL` 转悲观（悲观就可能又走到分裂），`ut_a(err == DB_SUCCESS)` 断言必须成功——而 `BTR_NO_LOCKING_FLAG | BTR_NO_UNDO_LOG_FLAG` 表明这层递归是在已经持有树锁、已在外层记过账的语境下做的，**锁与日志的边界是外层定的，递归层只管结构**。

SQLite 的对应就是 `insertCell(pParent, ...)` 那行——父页放不下自然变 overflow，外层 do-loop 再对父页调 `balance()`。传播的驱动力不同（InnoDB 显式递归、SQLite 靠 overflow 攒账 + 循环），但方向一致：**分裂永远从叶子往上冒泡，根是最后一个让步的**。

冒泡的另一面是锁范围：InnoDB 在叶子分裂、且新元组确定能放下时会提前放树锁：

```c
  /* If the split is made on the leaf level and the insert will fit
  on the appropriate half-page, we may release the tree x-latch.
  We can then move the records after releasing the tree latch,
  thus reducing the tree latch contention. */
```

```c
    mtr->memo_release(dict_index_get_lock(cursor->index),
                      MTR_MEMO_X_LOCK | MTR_MEMO_SX_LOCK);
```

**搬记录（慢活）排在放锁之后**——树锁只覆盖结构修改，不覆盖数据搬移，把锁的持有窗口压到最短。这是教科书的「先锁结构再放锁」手法在分裂里的具体形态。

## 树怎么长高：两条路线，同样不变的根

根页分裂是分裂的极端形态。两边都遵守同一条不变式：**根页号永远不变**（文件头/meta 里记的地址不能动），变的是根页的内容与角色。

SQLite 走 `balance_deeper()`——**原地长高**。`balance()` 的根页分支：

```c
    }else if( (iPage = pCur->iPage)==0 ){
      if( pPage->nOverflow && (rc = anotherValidCursor(pCur))==SQLITE_OK ){
        /* The root page of the b-tree is overfull. In this case call the
        ** balance_deeper() function to create a new child for the root-page
        ** and copy the current contents of the root-page to it. The
        ** next iteration of the do-loop will balance the child page.
        */
        assert( balance_deeper_called==0 );
        VVA_ONLY( balance_deeper_called++ );
        rc = balance_deeper(pPage, &pCur->apPage[1]);
```

`balance_deeper()` 分配新页、把根的内容整体搬下去：

```c
  /* Make pRoot, the root page of the b-tree, writable. Allocate a new
  ** page that will become the new right-child of pPage. Copy the contents
  ** of the node stored on pRoot into the new child page.
  */
  rc = sqlite3PagerWrite(pRoot->pDbPage);
  if( rc==SQLITE_OK ){
    rc = allocateBtreePage(pBt,&pChild,&pgnoChild,pRoot->pgno,0);
    copyNodeContent(pRoot, pChild, &rc);
```

然后根页清零、只留一个右孩子指针：

```c
  /* Zero the contents of pRoot. Then install pChild as the right-child. */
  zeroPage(pRoot, pChild->aData[0] & ~PTF_LEAF);
  put4byte(&pRoot->aData[pRoot->hdrOffset+8], pgnoChild);
```

注意 `&pRoot->aData[pRoot->hdrOffset+8]`——内部页头偏移 8 的右孩子字段。根页从「装满数据的叶子」变成「只有一个孩子的内部页」，下一轮 do-loop 再平衡那个孩子。**SQLite 文件里没有存储树高的字段**（取证确认），高度是「根往下数到叶子」现场数出来的。

InnoDB 走 `btr_root_raise_and_insert()`——**先搬家、再分裂**，头注释把流程一句话说完：

```c
/** Makes tree one level higher by splitting the root, and inserts
 the tuple. It is assumed that mtr contains an x-latch on the tree.
 NOTE that the operation of this function must always succeed,
 we cannot reverse it: therefore enough free disk space must be
 guaranteed to be available before this function is called.
 @return inserted record */
```

```c
  /* Allocate a new page to the tree. Root splitting is done by first
  moving the root records to the new page, emptying the root, putting
  a node pointer to the new page, and then splitting the new page. */

  level = btr_page_get_level(root);

  new_block = btr_page_alloc(index, 0, FSP_NO_DIR, level, mtr, mtr);

  /* New page could not be allocated */
  if (!new_block) {
    return nullptr;
  }
```

```c
  /* Rebuild the root page to get free space */
  btr_page_empty(root_block, root_page_zip, index, level + 1, mtr);
```

```c
  /* Split the child and insert tuple */
  if (dict_index_is_spatial(index)) {
    /* Split rtree page and insert tuple */
    return (
        rtr_page_split_and_insert(flags, cursor, offsets, heap, tuple, mtr));
  } else {
    return (
        btr_page_split_and_insert(flags, cursor, offsets, heap, tuple, mtr));
  }
```

三步：根的全部记录复制到新页 → `btr_page_empty` 把根清空并以 `level + 1` 重建（根成了只含一个 node pointer 的上层页）→ 对**新页**执行常规分裂。树高在搜索时记进游标（`btr0cur.cc`）：

```c
  if (UNIV_UNLIKELY(height == ULINT_UNDEFINED)) {
    /* We are in the root node */

    height = btr_page_get_level(page);
    root_height = height;
    cursor->tree_height = root_height + 1;
```

`cursor->tree_height = root_height + 1`——这是 8.x 树高的唯一权威来源（旧版的 `dict_index_get_height` 已不存在，取证确认 grep 零命中）。

两条路线的对照很干净：

| | SQLite `balance_deeper` | InnoDB `btr_root_raise_and_insert` |
|---|---|---|
| 新页 | `allocateBtreePage`，根内容 `copyNodeContent` 搬下 | `btr_page_alloc`，根记录搬走后 `btr_page_empty` |
| 根页变化 | 清零 + 1 个右孩子指针 | `level + 1` 重建，1 个 node pointer |
| 随后 | 下一轮 do-loop 平衡孩子 | 立即对新页 `btr_page_split_and_insert` |
| 根页号 | 不变 | 不变 |
| 失败语义 | 按 rc 逐级向上传 | 只许成功（前置 2 页预留），NULL → `DB_OUT_OF_FILE_SPACE` |

**长高不是全局重写，只是根页的角色转换**：树高 +1 的物理代价是一次页面复制 + 一条父指针。也正因为便宜，「树高 3 层存亿级数据」才成立——每长一层，fanout 就乘一次页容量。

## 手术可能白做：重组、重试与整场重来

页分裂不是一锤子买卖，源码里三处「白做之后怎么办」的设计才是工程味所在。

**SQLite：先整理再分裂，分裂后还有下一轮。** 第二道检查里 `defragmentPage` 抢在分裂前面；`balance()` 本身是 do-loop，溢出清了但条件仍不满足就再走一轮；`balance_quick` 失败则退回 `balance_nonroot` 全量配平。整理的语义写在函数头：

```c
/*
** Defragment the page given. This routine reorganizes cells within the
** page so that there are no free-blocks on the free-block list.
**
** Parameter nMaxFrag is the maximum amount of fragmented space that may be
** present in the page after this routine returns.
**
** EVIDENCE-OF: R-44582-60138 SQLite may from time to time reorganize a
** b-tree page so that there are no freeblocks or fragment bytes, all
** unused bytes are contained in the unallocated space region, and all
** cells are packed tightly at the end of the page.
*/
```

**InnoDB：第 8 步失败就整场重来。** 手术单的最后一步：`If insert did not fit, try page reorganization...`，重组也放不下就 `n_iterations++; goto func_start;` 回到第 1 步。第二轮的第 1 步代码正好接上——`if (n_iterations > 0)` 走 `btr_page_get_split_rec` 的另一侧启发式。**重来的成本是有的（新页已经分配），但换来分裂点的第二次机会**；`n_iterations` 也是 `btr_page_get_split_rec` 向右倾向的开关，追加场景第二轮几乎必然成功。

**递归层的断言。** `btr_insert_on_non_leaf_level` 里 `ut_a(err == DB_SUCCESS)`——递归路径不接受失败，因为外层已承诺"只许成功"。这份自信的来源正是上一节的 `n_extents = tree_height / 16 + 3` 预留：**承诺不靠运气，靠进门之前把门后的路都买下来**。

## 页内碎片：freeblock 链与整理的时机

分裂讲的是页**之间**的再分配，页**内部**的空洞是另一半故事。SQLite 的空闲总量计算把两种空洞分开记账：

```c
  /* Compute the total free space on the page
  ** EVIDENCE-OF: R-23588-34450 The two-byte integer at offset 1 gives the
  ** start of the first freeblock on the page, or is zero if there are no
  ** freeblocks. */
  pc = get2byte(&data[hdr+1]);
  nFree = data[hdr+7] + top;  /* Init nFree to non-freeblock free space */
```

页空闲 = 未分配空隙（内容区起点 `top`）+ 碎片字节数（offset 7）+ 沿 offset 1 的 freeblock 链逐块累加。freeblock 的结构与合并规则在 `freeSpace()` 的注释与代码：

```c
/*
** Return a section of the pPage->aData to the freelist.
** The first byte of the new free block is pPage->aData[iStart]
** and the size of the block is iSize bytes.
**
** Adjacent freeblocks are coalesced.
**
** Even though the freeblock list was checked by btreeComputeFreeSpace(),
** that routine will not detect overlap between cells or freeblocks.  Nor
** does it detect cells or freeblocks that encroach into the reserved bytes
** at the end of the page.  So do additional corruption checks inside this
** routine and return SQLITE_CORRUPT if any problems are found.
*/
```

```c
  if( iStart<=x ){
    /* The new freeblock is at the beginning of the cell content area,
    ** so just extend the cell content area rather than create another
    ** freelist entry */
    if( iStart<x ) return SQLITE_CORRUPT_PAGE(pPage);
    if( iPtr!=hdr+1 ) return SQLITE_CORRUPT_PAGE(pPage);
    put2byte(&data[hdr+1], iFreeBlk);
    put2byte(&data[hdr+5], iEnd);
  }else{
    /* Insert the new freeblock into the freelist */
    put2byte(&data[iPtr], iStart);
    put2byte(&data[iStart], iFreeBlk);
    assert( iSize>=0 && iSize<=0xffff );
    put2byte(&data[iStart+2], (u16)iSize);
  }
```

三个细节：空洞贴着内容区前沿就直接把起点外扩、不占链表槽位；按偏移升序插入、相邻自动合并；≤3 字节的碎屑不入链，只累加进 offset 7 的 fragment 计数。**「删掉一条记录」在页内留下的坑有三种归宿**——并入空隙、进链、计碎片——而整理（`defragmentPage`）把三者全部折回空隙，cell 紧贴页尾重排。

InnoDB 的对应物是 `PAGE_FREE`（空闲记录链头）与 `PAGE_GARBAGE`（删除记录字节数），加上重组门槛 `BTR_CUR_PAGE_REORGANIZE_LIMIT = UNIV_PAGE_SIZE / 32`。**两套实现都把「空洞的字数」单独存进页头**——这是判断何时重组的原料：`page_has_garbage` + `max_insert_size_after_reorganize` 的组合，等价于 SQLite 的 `nFree` + `defragmentPage`。

这也直接回答前言的两个现象：**随机 UUID 主键**的插入点随机落在任意页，每次删除/更新都在不同页上留 freeblock，页页有洞、频繁重组与分裂，文件自然碎；**顺序主键**的插入集中在最右叶子，旧页洞少、新页连号（`hint_page_no = page_no + 1` 与 freelist/extent 的顺序分配），填充率高。

## 顺序写为什么不碎：分裂方向的暗示

把散落的证据串成一条实践线：

1. InnoDB 分裂第 1 步的 `if (n_iterations > 0) { direction = FSP_UP; hint_page_no = page_no + 1; ... }`——重试时明确向上、页号 +1 的方向暗示；
2. `btr_page_alloc(cursor->index, hint_page_no, direction, ...)` 把暗示传给段分配器，让新页尽量跟在原页后面；
3. 中点分裂让「顺序追加」的分裂模式稳定复现：每次都在右半页尾部追加、满了一刀切、新的右半又在页尾——**页与页首尾相接，几乎不产生页内碎片**；
4. SQLite 的 `balance` 虽无方向概念，但 do-loop 攒账 + 2/3 阈值同样让顺序插入「攒够了才动一次，动一次就装到 `usableSpace` 为止」。

反过来，随机主键让每次插入落在任意页，第 3 步的稳定复现被打破：页页都差一口、页页都触发整理或分裂，而 NB=3 的窗口（本页 + 左右兄弟）在随机写下拿不到「同向攒出来」的邻居。**慢查询文章里「用自增/时间戳做主键、避免随机 UUID 索引」这条建议，在这里的源头就是方向暗示与中点分裂的相互作用。**

## 并发之下：树锁的释放时机与不可回滚契约

分裂期间其他会话看到什么？InnoDB 的证据链：入口断言要求树 X/SX 锁已持有、页已 X fix 进 mtr：

```c
  ut_ad(mtr_memo_contains_flagged(mtr, dict_index_get_lock(cursor->index),
                                  MTR_MEMO_X_LOCK | MTR_MEMO_SX_LOCK) ||
        cursor->index->table->is_intrinsic());
  ...
  ut_ad(
      mtr_is_block_fix(mtr, block, MTR_MEMO_PAGE_X_FIX, cursor->index->table));
```

锁模式枚举（`btr0btr.h`）里普通读者是 `BTR_SEARCH_LEAF = RW_S_LATCH`，普通写者 `BTR_MODIFY_LEAF = RW_X_LATCH`，而动结构的是 `BTR_MODIFY_TREE = 33` / `BTR_CONT_MODIFY_TREE = 34`——**读叶子、改叶子、改树是三个独立档位**，只有分裂/长高才升到改树档。配合前文的提前 `memo_release`：

- 第 1~4 步（选点、分配、挂树）持树锁；
- 确认新页装得下后**先放树锁**，再搬记录；
- 搬记录期间别的会话可以进树，只被新旧两页的页锁挡住。

再叠上 WAL 篇的结论——页修改经 redo log 落盘、只许成功不许回滚——整幅图景是：**结构变更小窗口持树锁，数据搬移只持页锁，崩溃由 redo 保证重放完整，空间由前置预留保证不失败**。四件事各管一段，谁也不越界。

SQLite 是单写者模型（库级写锁），没有这套并发戏法，换来的是 `balance()` 可以随意摊平重排、`anotherValidCursor` 只需检查游标有效性。**复杂度守恒：并发的账在锁上，正确的账在回滚上，SQLite 把两笔都记在了别处（写锁 + 事务日志）。**

## 两套实现对照表与实践线

全文的机制可以压成一张表：

| 环节 | SQLite | InnoDB |
|---|---|---|
| 页头 | 8/12 字节，5 个字段 | FIL 38 + 字段 36 + 段头 20 = 94 字节起 |
| 放不下的第一信号 | `sz+2 > nFree` → overflow 槽（内存账） | `max_size < rec_size` → `DB_FAIL` |
| 能整理就不分裂 | `defragmentPage` + `gap+2+nByte>top` | `after_reorganize` + 512 字节重组门槛 |
| 动手术的门槛 | 无 overflow 且 `nFree*3 > usableSize*2`（空过 1/3） | 悲观插入（乐观两级都失败） |
| 分裂点 | 不选点，摊平重装箱 | 启发式方向 + `page_get_middle_rec` 条数中点 |
| 新页 | freelist（第 1 页偏移 32 的 trunk 链） | 段分配 + `tree_height/16+3` extent 预留 |
| 分裂函数 | `balance_nonroot`（NB=3，新页 ≤5） | `btr_page_split_and_insert`（八步，可 `goto` 重来） |
| 父层传播 | `insertCell(parent)` → overflow → 上层 balance | `btr_insert_on_non_leaf_level` 显式递归 |
| 长高 | `balance_deeper` 原地变内部页 | `btr_root_raise_and_insert` 搬家再分裂 |
| 失败语义 | rc 逐级传播 | 只许成功，`ut_a(DB_SUCCESS)` + `DB_OUT_OF_FILE_SPACE` 兜底 |
| 树高存储 | 无字段，现场数 | `PAGE_LEVEL` 页内字段 + `cursor->tree_height` |

接回实践线，页分裂视角给出的判断顺序：

1. **主键形态先看**——顺序追加命中方向暗示与稳定中点分裂，随机 key 打散这两者（上文实践线第 1~4 条）；
2. **看页填充率而非行数**——`INFORMATION_SCHEMA.INNODB_TABLES` 的页数/行数比，或 SQLite `PRAGMA page_count` 与 freelist（`PRAGMA freelist_count`）的差值，对应 `PAGE_GARBAGE` 与 freeblock 链；
3. **负载尾部留重组空间**——两边的重组门槛（`nFree` 超 1/3、空洞超 512 字节）说明周期性整理本来就设计在路径里，不必为偶发重组报警；
4. **树高是免费的**——长高 = 一次根页复制 + 一条父指针，3 层与 4 层的读代价差一次页访问；真正贵的是分裂**频度**（每次一个 mtr + 一次段分配 + 可能的锁放大），不是树高本身。

## 结语

教科书把页分裂画成一个箭头分成两个，源码里它是一张八步手术单：选点要启发式、分配要预支、搬链要剪断重接、父层要递归、根页要搬家、插不进要整场重来、空间要在进门之前买足。这些步骤没有一步是多余的——每一步都对着一种具体的事故：分裂点选偏了、表空间满了、锁持太久、崩溃落在搬一半、父页也满了。

两套实现的对照再次印证了 WAL 篇那句话的镜像：**格式是随便定的，契约是不能动的**。cell 指针数组还是相对偏移链、8 字节头还是 94 字节头，两边随便选；但「先检查再整理、整理不行再分裂、分裂必须给父层一个分隔键、长高必须保住根页号、失败必须有明确出口」——一条不差。

下次在慢查询文章里写下「换成顺序主键」时，你可以指到具体的地方：InnoDB 分裂第 1 步那行 `hint_page_no = page_no + 1`。它就是「索引不碎」这四个字在源码里的全部形态。
