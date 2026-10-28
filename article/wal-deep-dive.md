---
title: "先写日志，再写数据：WAL 原理与源码细读"
slug: wal-deep-dive
cover_image: /photos/wal-cover.png
date: 2026-10-28
tags: ["数据库", "存储引擎", "后端"]
---

> 适用读者：想知道「崩溃恢复」这四个字在源码里到底长什么形状的后端工程师；正在自己写存储引擎、消息队列或嵌入式数据库的人；被 WAL、fsync、checkpoint、group commit 这些词轮番轰炸过、但没读过任何实现的人
> 结论先行：WAL 不是一个功能，而是四条很小的约定——**只追加、逐条校验、读到第一个坏帧就停、先记账再动数据**。本文不写一行自造代码，全部证据来自 SQLite `src/wal.c` 与 LevelDB / RocksDB 的 log 层源码：32 字节文件头 + 24 字节页帧头、7 字节物理记录头 + 32 KB 块、两种校验和算法、salt 防回卷、先 WAL 后 memtable 的写序铁律、组提交、`synchronous` 三档的真义、checkpoint 四模式、恢复四模式。读完你能对着这些常量和函数名，把一个最小但正确的 WAL 在纸上画出来
> 阅读时间：约 50 分钟 | 难度：进阶 | 收获：两套真实 WAL 格式的逐字源码拆解 + 一条完整的崩溃恢复证据链 + 一份自研 WAL 设计清单

**目录**

- 前言：崩溃为什么恰好落在「改了一半」
- 先立契约：WAL 只承诺四件事
- 格式一：SQLite 的页帧——32 字节头与 24 字节帧头
- 格式二：LevelDB 的物理记录——7 字节头与 32 KB 块
- 校验和：两种算法，同一个「覆盖到哪」的问题
- 恢复：读到第一个坏帧就停
- salt：让回卷后的旧帧自动失效
- 提交点：一个字段决定事务的原子性
- 写序铁律：先 WAL，后 memtable
- 组提交：一次同步摊给一批写入
- fsync 语义：`synchronous` 三档在 WAL 下的真义
- checkpoint：日志不能无限长
- 恢复模式：损坏发生时你要哪种世界线
- 读端可见性：快照上界是怎么来的
- WAL 是门通用手艺：MANIFEST 与 NanoDB 的 JSON Lines
- 自研 WAL 设计清单
- 结语

## 前言：崩溃为什么恰好落在「改了一半」

所有存储系统都面对同一个凶案现场：你正要把一批字节写进数据文件，写到一半，断电了。

没有 WAL 的世界里，数据文件是**就地更新**的。一页索引刚写进新指针、指向的那页数据还没写；或者数据页的前 4 KB 是新版本、后 4 KB 还是旧版本——撕裂页（torn page）就此诞生。重启之后，文件系统给你的是一个**物理上合法、逻辑上自相矛盾**的文件：校验和对不上，或者更糟，指针指向一个从未存在过的偏移。

WAL（Write-Ahead Logging，预写日志）的全部思想可以用一句话说完：**在动数据文件之前，先把「打算怎么动」追加写进另一个只进不退的文件；崩溃之后，按日志把数据文件重放到一个一致状态。**

这看起来只是「换个顺序」，但把这句话变成工程，需要回答一连串非常具体的问题：

- 「追加」的记录长什么样，怎么知道一条记录是完整的？
- 写到一半崩溃，恢复程序怎么区分「完整记录」和「垃圾字节」？
- 日志写重了、写循环了、被复用了，旧内容冒充新内容怎么办？
- 「先写日志再动数据」中的「先」，在代码里的确切位置在哪？
- fsync 到底在哪个时刻必须发生，不发生会丢什么？
- 日志不能无限增长，把内容搬回数据文件的时机和姿势是什么？
- 崩溃留下的日志尾巴已经损坏，是拒绝启动、还是尽量抢救？

SQLite 和 LevelDB / RocksDB 对这些问题给出了两套独立演化出来的答案。它们的文件格式完全不同，但把源码摊开之后你会发现，**背后的四条约定一条不差**。这篇文章就按这四条约定组织：先看两套格式，再看校验、恢复、salt、提交点、写序、组提交、同步语义、checkpoint、恢复模式、读端可见性——最后归纳成一份设计清单。

## 先立契约：WAL 只承诺四件事

先把手洗干净，再看案发现场。一个正确的 WAL，无论实现是谁，都必须做到这四件事：

| 约定 | 要解决的事故 | 在 SQLite | 在 LevelDB / RocksDB |
|---|---|---|---|
| 1. 只追加（append-only） | 就地改写日志 = 制造撕裂 | 帧顺序写到文件尾，checkpoint 后从头覆写并换盐 | `log::Writer` 顺序 `Append`，块尾不足填零换块 |
| 2. 逐条自带校验 | 撕裂页、位翻转、半条记录 | 32 位双通道滚动校验和（链式，前帧校验和做初值） | CRC32C，覆盖 type + payload |
| 3. 遇坏即停 | 垃圾字节被当成数据回放 | `walDecodeFrame` 返回 0 即 `break`，`mxFrame` 停在最后提交帧 | `ReadRecord` 返回 false 即结束，半条逻辑记录直接丢弃 |
| 4. 先记账再动数据 | 内存里的「已提交」在断电后无凭据 | `walFrames` 先写帧再标记可见 | `AddRecord` →（可选 `Sync`）→ `InsertInto` |

四条里最反直觉的是第 3 条的措辞：**遇坏即停，而不是遇坏即修**。恢复程序永远不猜测、不扫描、不尝试从坏字节后面「重新同步」——它只承认从文件开头连续通过校验的那一段。损坏点之后的所有字节，无论看起来多像数据，一律当作不存在。这个保守选择是后面一切正确性的地基，源码里你会看到它被重复实现了三遍。

还有一对概念先立好，全文都要用：

- **物理日志**：记录「哪一页变成了什么内容」。SQLite 的 WAL 记录的是完整页镜像，恢复 = 把页原样抄回数据文件。
- **逻辑日志**：记录「做了什么操作」。LevelDB / RocksDB 的 WAL 记录的是 WriteBatch（插入 / 删除了哪些键值），恢复 = 重新执行一遍这些操作。

两种路线对格式、校验、恢复的影响贯穿全文，边读边对照。

## 格式一：SQLite 的页帧——32 字节头与 24 字节帧头

SQLite 的 WAL 文件由一个 32 字节的文件头和一串「帧」组成，每帧 = 24 字节帧头 + 一个完整的数据库页。`wal.c` 开头的注释把文件头布局钉死了：

```c
**     0: Magic number.  0x377f0682 or 0x377f0683
**     4: File format version.  Currently 3007000
**     8: Database page size.  Example: 1024
**    12: Checkpoint sequence number
**    16: Salt-1, random integer incremented with each checkpoint
**    20: Salt-2, a different random integer changing with each ckpt
**    24: Checksum-1 (first part of checksum for first 24 bytes of header).
**    28: Checksum-2 (second part of checksum for first 24 bytes of header).
```

注意这个头自身的最后 4 个字节是**前 24 字节的校验和**——头也被校验，坏头 = 整个文件作废。写头的代码在 `walFrames()`：

```c
    sqlite3Put4byte(&aWalHdr[0], (WAL_MAGIC | SQLITE_BIGENDIAN));
    sqlite3Put4byte(&aWalHdr[4], WAL_MAX_VERSION);
    sqlite3Put4byte(&aWalHdr[8], szPage);
    sqlite3Put4byte(&aWalHdr[12], pWal->nCkpt);
    if( pWal->nCkpt==0 ) sqlite3_randomness(8, pWal->hdr.aSalt);
    memcpy(&aWalHdr[16], pWal->hdr.aSalt, 8);
    walChecksumBytes(1, aWalHdr, WAL_HDRSIZE-2*4, 0, aCksum);
    sqlite3Put4byte(&aWalHdr[24], aCksum[0]);
    sqlite3Put4byte(&aWalHdr[28], aCksum[1]);
```

`WAL_MAGIC` 的最低位借给了字节序：`0x377f0682` 表示校验和按本机字节序计算，置 1 变成 `0x377f0683` 表示大端——一个 magic 位同时完成了「这是不是一个 WAL」和「用什么字节序读它」两件事。恢复时的头校验（`walIndexRecover`）对任何一项不满足都是同一个动作 `goto finished`，即放弃整个文件：

```c
    magic = sqlite3Get4byte(&aBuf[0]);
    szPage = sqlite3Get4byte(&aBuf[8]);
    if( (magic&0xFFFFFFFE)!=WAL_MAGIC
     || szPage&(szPage-1)
     || szPage>SQLITE_MAX_PAGE_SIZE
     || szPage<512
    ){
      goto finished;
    }
    pWal->hdr.bigEndCksum = (u8)(magic&0x00000001);
    pWal->szPage = szPage;
    pWal->nCkpt = sqlite3Get4byte(&aBuf[12]);
    memcpy(&pWal->hdr.aSalt, &aBuf[16], 8);

    /* Verify that the WAL header checksum is correct */
    walChecksumBytes(pWal->hdr.bigEndCksum==SQLITE_BIGENDIAN,
        aBuf, WAL_HDRSIZE-2*4, 0, pWal->hdr.aFrameCksum
    );
    if( pWal->hdr.aFrameCksum[0]!=sqlite3Get4byte(&aBuf[24])
     || pWal->hdr.aFrameCksum[1]!=sqlite3Get4byte(&aBuf[28])
    ){
      goto finished;
    }
```

页大小校验那行 `szPage&(szPage-1)` 是「是否 2 的幂」的位运算惯用写法——WAL 里页大小同时是帧的定长步长，不是 2 的幂就没法用偏移公式 `WAL_HDRSIZE + (iFrame-1)*(szPage+WAL_FRAME_HDRSIZE)` 定位任意帧。

帧头的布局同样是注释先行：

```c
**     0: Page number.
**     4: For commit records, the size of the database image in pages
**        after the commit. For all other records, zero.
**     8: Salt-1 (copied from the wal-header)
**    12: Salt-2 (copied from the wal-header)
**    16: Checksum-1.
**    20: Checksum-2.
```

组帧的代码 `walEncodeFrame` 展示了校验和是怎么「链」起来的：

```c
  assert( WAL_FRAME_HDRSIZE==24 );
  sqlite3Put4byte(&aFrame[0], iPage);
  sqlite3Put4byte(&aFrame[4], nTruncate);
  if( pWal->iReCksum==0 ){
    memcpy(&aFrame[8], pWal->hdr.aSalt, 8);

    nativeCksum = (pWal->hdr.bigEndCksum==SQLITE_BIGENDIAN);
    walChecksumBytes(nativeCksum, aFrame, 8, aCksum, aCksum);
    walChecksumBytes(nativeCksum, aData, pWal->szPage, aCksum, aCksum);

    sqlite3Put4byte(&aFrame[16], aCksum[0]);
    sqlite3Put4byte(&aFrame[20], aCksum[1]);
  }else{
    memset(&aFrame[8], 0, 16);
  }
```

关键在于调用约定：`walChecksumBytes` 的入参里，`aCksum` **既是输入也是输出**——校验和以前一帧的校验和为初值，先累加帧头前 8 字节（页号 + 提交标志 + 盐），再累加整整一页数据。于是每一帧的校验和都把前面所有帧的历史压了进去：**链条上任何一帧被改，后面每一帧的校验和都会失配**。

落盘顺序也在 `walWriteOneFrame` 里写死了——先头后体：

```c
  walEncodeFrame(p->pWal, pPage->pgno, nTruncate, pData, aFrame);
  rc = walWriteToLog(p, aFrame, sizeof(aFrame), iOffset);
  if( rc ) return rc;
  /* Write the page data */
  rc = walWriteToLog(p, pData, p->szPage, iOffset+sizeof(aFrame));
```

先写 24 字节头、再写页体，意味着崩溃最可能留下的形态是「头完整、体撕裂」——而校验和恰恰覆盖页体，体撕裂必被发现。设计和事故现场是对得上的。

## 格式二：LevelDB 的物理记录——7 字节头与 32 KB 块

LevelDB 的 log 层走的是另一条路：不认识页，只认识「一条条记录」，并把它们切成 32 KB 的块存储。`db/log_format.h` 定义了全部格式：

```cpp
enum RecordType {
  // Zero is reserved for preallocated files
  kZeroType = 0,

  kFullType = 1,

  // For fragments
  kFirstType = 2,
  kMiddleType = 3,
  kLastType = 4
};
static const int kMaxRecordType = kLastType;

static const int kBlockSize = 32768;

// Header is checksum (4 bytes), length (2 bytes), type (1 byte).
static const int kHeaderSize = 4 + 2 + 1;
```

一条物理记录 = 7 字节头 + payload。四种 type 的存在是因为一个逻辑记录可能超过块的剩余空间，必须**跨块分片**：放得下就是 `kFullType`，放不下就拆成 `kFirstType` + 若干 `kMiddleType` + `kLastType`。写端的头编码在 `log_writer.cc`：

```cpp
  // Format the header
  char buf[kHeaderSize];
  buf[4] = static_cast<char>(length & 0xff);
  buf[5] = static_cast<char>(length >> 8);
  buf[6] = static_cast<char>(t);

  // Compute the crc of the record type and the payload.
  uint32_t crc = crc32c::Extend(type_crc_[t], ptr, length);
  crc = crc32c::Mask(crc);  // Adjust for storage
  EncodeFixed32(buf, crc);
```

`type_crc_[t]` 是启动时预计算的「type 字节的 CRC 种子」（`InitTypeCrc` 里 `crc32c::Value(&t, 1)`），`Extend` 把 payload 的 CRC 接在种子上——于是**一个 CRC 同时覆盖 type 和数据**。`Mask` 是 CRC32C 的存储掩码（异或固定魔数），防止全零数据算出全零校验和这种「看起来合法」的退化情况。

块尾剩余不足 7 字节时无法容纳头，`AddRecord` 直接填零换块——这也解释了为什么恢复端必须容忍「预分配文件尾部的零字节」：零是**结构上必然出现**的填充，不是损坏。

RocksDB 沿用了同一套骨架，只是多了一种回收块头（额外 4 字节 log number，并把 log number 也纳入 CRC，用 `Crc32cCombine` 把两段 CRC 拼起来）：

```cpp
constexpr unsigned int kBlockSize = 32768;

// Header is checksum (4 bytes), length (2 bytes), type (1 byte)
constexpr int kHeaderSize = 4 + 2 + 1;

// Recyclable header is checksum (4 bytes), length (2 bytes), type (1 byte),
// log number (4 bytes).
constexpr int kRecyclableHeaderSize = 4 + 2 + 1 + 4;
```

到这里两套格式的骨架都齐了，可以回答第一个问题：**「怎么知道一条记录是完整的？」** SQLite 答：帧头 + 页体的链式校验和对得上。LevelDB 答：7 字节头里的 CRC 对得上，且分片重组拼得出 `kLastType` 的收尾。两套答案都把「完整」定义成了**可计算的谓词**，而不是「读起来像」。

## 校验和：两种算法，同一个「覆盖到哪」的问题

SQLite 用的不是现成的 CRC，而是一对 32 位滚动累加器。`walChecksumBytes` 的核心循环朴素到只剩五行：

```c
  }else{
    do {
      s1 += *aData++ + s2;
      s2 += *aData++ + s1;
    }while( aData<aEnd );
  }
  assert( aData==aEnd );

  aOut[0] = s1;
  aOut[1] = s2;
```

`s1`、`s2` 都是 `u32`，C 标准规定无符号溢出按模 2³² 回绕——「上限」这件事由类型系统免费提供。文件头注释解释了它的数学性质：

```
**   for i from 0 to n-1 step 2:
**     s0 += x[i] + s1;
**     s1 += x[i+1] + s0;
**   endfor
**
** Note that s0 and s1 are both weighted checksums using fibonacci weights
** in reverse order (the largest fibonacci weight occurs on the first element
** of the sequence being summed.)  The s1 value spans all 32-bit
** terms of the sequence whereas s0 omits the final term.
```

每个字节都被乘上一个斐波那契权重参与最终结果，且**越早的字节权重越大**（倒序斐波那契权重）。这个性质对 WAL 至关重要：靠后的帧校验和依赖前面每一帧的初值，任何一处改动都会沿链条传播到末尾——改动藏不住。性能上，热路径还展开了 8 路（64 字节一循环），说明这段代码是真跑在每帧路径上的。

LevelDB 用标准 CRC32C，但有一个容易被忽略的细节：**length 字段不进校验和**。读端 `log_reader.cc` 的验证逻辑把覆盖范围写得很清楚：

```cpp
    // Check crc
    if (checksum_) {
      uint32_t expected_crc = crc32c::Unmask(DecodeFixed32(header));
      uint32_t actual_crc = crc32c::Value(header + 6, 1 + length);
      if (actual_crc != expected_crc) {
        // Drop the rest of the buffer since "length" itself may have
        // been corrupted and if we trust it, we could find some
        // fragment of a real log record that just happens to look
        // like a valid log record.
        size_t drop_size = buffer_.size();
        buffer_.clear();
        ReportCorruption(drop_size, "checksum mismatch");
        return kBadRecord;
      }
    }
```

`header + 6` 是 type 字节，往后再数 `1 + length`——校验覆盖 type + payload，**跳过了偏移 4~5 的 length**。length 一旦被翻转，按错误长度切出来的 CRC 必然对不上，所以损坏仍会被发现；但注释揭示了真正的防御对象：**不信任 length 之后，就绝不拿它去找「下一个看起来合法的记录」**。发现坏 CRC 的处置是 `buffer_.clear()` 丢弃整个缓冲——宁可多丢，不可错认。这正是「遇坏即停」在字节级的执行方式。

## 恢复：读到第一个坏帧就停

SQLite 恢复的主循环在 `walIndexRecover`，逐帧推进，坏帧即断：

```c
      for(iFrame=iFirst; iFrame<=iLast; iFrame++){
        i64 iOffset = walFrameOffset(iFrame, szPage);
        u32 pgno;                 /* Database page number for frame */
        u32 nTruncate;            /* dbsize field from frame header */

        /* Read and decode the next log frame. */
        rc = sqlite3OsRead(pWal->pWalFd, aFrame, szFrame, iOffset);
        if( rc!=SQLITE_OK ) break;
        isValid = walDecodeFrame(pWal, &pgno, &nTruncate, aData, aFrame);
        if( !isValid ) break;
        rc = walIndexAppend(pWal, iFrame, pgno);
        if( NEVER(rc!=SQLITE_OK) ) break;

        /* If nTruncate is non-zero, this is a commit record. */
        if( nTruncate ){
          pWal->hdr.mxFrame = iFrame;
          pWal->hdr.nPage = nTruncate;
          ...
        }
      }
```

坏帧的判定在 `walDecodeFrame`，三道检查缺一不可——先对盐，再对校验和：

```c
  if( memcmp(&pWal->hdr.aSalt, &aFrame[8], 8)!=0 ){
    return 0;
  }
  ...
  walChecksumBytes(nativeCksum, aFrame, 8, aCksum, aCksum);
  walChecksumBytes(nativeCksum, aData, pWal->szPage, aCksum, aCksum);
  if( aCksum[0]!=sqlite3Get4byte(&aFrame[16])
   || aCksum[1]!=sqlite3Get4byte(&aFrame[20])
  ){
    /* Checksum failed. */
    return 0;
  }
```

`!isValid` 直接 `break`，循环之后 `if( iFrame<=iLast ) break;` 让外层也停下。**回放范围因此永远是「从开头到最后一个连续通过校验的帧」**，崩溃时写了一半的尾帧自然出局。

LevelDB 的恢复循环在 `db_impl.cc` 的 `RecoverLogFile`，同样朴素：

```cpp
  while (reader.ReadRecord(&record, &scratch) && status.ok()) {
    if (record.size() < 12) {
      reporter.Corruption(record.size(),
                          Status::Corruption("log record too small"));
      continue;
    }
    WriteBatchInternal::SetContents(&batch, record);
    ...
    status = WriteBatchInternal::InsertInto(&batch, mem);
```

而「坏 CRC 之后为什么不去找下一个记录」这个问题，在它上方十行的注释里给出了正面回答：

```cpp
  // We intentionally make log::Reader do checksumming even if
  // paranoid_checks==false so that corruptions cause entire commits
  // to be skipped instead of propagating bad information (like overly
  // large sequence numbers).
  log::Reader reader(file, &reporter, true /*checksum*/, 0 /*initial_offset*/);
```

**即使 `paranoid_checks=false` 也强制开校验**——因为「跳过整个提交」远好于「回放出一半提交」。一个坏批次如果被部分采纳，超前的 sequence 号会污染后续所有写入的排序。

分片重组的原子性由 `ReadRecord` 的状态机保证，EOF 时的处置尤其能体现取舍：

```cpp
      case kEof:
        if (in_fragmented_record) {
          // This can be caused by the writer dying immediately after
          // writing a physical record but before completing the next; don't
          // treat it as a corruption, just ignore the entire logical record.
          scratch->clear();
        }
        return false;
```

崩溃点落在一条逻辑记录的两个分片之间是**正常事故**，不算损坏：`scratch->clear()` 把拼了一半的记录整体丢掉，返回 false 结束恢复。分片机制在这里顺手提供了原子性——**只有拼出 `kLastType` 的记录才会被交付，半条记录在结构上就不可能进入 memtable**。

## salt：让回卷后的旧帧自动失效

只追加的文件总会遇到「追到头了」的一天：WAL 回卷覆写，或 checkpoint 后从头开始。危险在于，如果只是简单地从偏移 0 重新写，新帧覆盖旧帧的过程中一旦崩溃，文件里会留下**新帧和旧帧的混合体**——它们校验和都合法（各自的链是自洽的），恢复程序无法分辨谁是这一轮的。

SQLite 的解法是给每一轮一个身份：**salt**。帧头偏移 8 处复制写入时刻的文件头盐，恢复时先比盐再算校验和（上一节 `walDecodeFrame` 的第一道检查就是它）。换盐的时机写在 `wal.c` 的注释里：

```
** After each checkpoint, the salt-1 value is incremented and the salt-2
** value is randomized.  This prevents old and new frames in the WAL from
** being considered valid at the same time and being checkpointing together
** following a crash.
```

换盐的动作在 `walRestartHdr`，同时把可见帧上界清零：

```c
static void walRestartHdr(Wal *pWal, u32 salt1){
  volatile WalCkptInfo *pInfo = walCkptInfo(pWal);
  int i;                          /* Loop counter */
  u32 *aSalt = pWal->hdr.aSalt;   /* Big-endian salt values */
  pWal->nCkpt++;
  pWal->hdr.mxFrame = 0;
  sqlite3Put4byte((u8*)&aSalt[0], 1 + sqlite3Get4byte((u8*)&aSalt[0]));
  memcpy(&pWal->hdr.aSalt[1], &salt1, 4);
  walIndexWriteHdr(pWal);
  AtomicStore(&pInfo->nBackfill, 0);
  ...
}
```

`salt1` 自增 1、`salt2` 换成 `sqlite3_randomness` 出来的随机数。覆写区里那些「上一轮的帧」帧头里存的是旧盐，`memcmp` 立刻判负——**旧帧不是被删除的，是被判无效的**。这层保险的成本只有每帧 8 字节的 memcpy 和恢复时一次 memcmp，却把「日志回卷 + 中途崩溃」这个最阴险的场景整个关进了笼子。

一个细节值得注意：`walRestartHdr` 只有在拿得到读槽锁（没有活跃读者）时才会被调用——换盐会让所有读者的旧快照失效，所以必须等它们退出。**正确性机制和并发控制在这里是同一把锁。**

## 提交点：一个字段决定事务的原子性

多页事务意味着一个事务对应多帧。崩溃可能落在事务中间，恢复怎么知道「这个事务算不算数」？

答案藏在帧头偏移 4 的 `nTruncate` 字段：**普通帧为 0，只有提交帧写入提交后的数据库大小**。回放循环里那行注释 `/* If nTruncate is non-zero, this is a commit record. */` 是全部机关所在：

```c
        /* If nTruncate is non-zero, this is a commit record. */
        if( nTruncate ){
          pWal->hdr.mxFrame = iFrame;
          pWal->hdr.nPage = nTruncate;
```

`mxFrame`（可见帧上界）只在遇到提交帧时推进。崩溃如果发生在提交帧之前，恢复会读完那些 `nTruncate == 0` 的孤儿帧，但 `mxFrame` 停在上一个提交点——**未提交的尾巴在逻辑上不存在**。原子性不是靠「回滚」实现的，是靠「上界不动」实现的。

LevelDB 的提交点是另一副面孔：WriteBatch 的 12 字节头。`db/write_batch.cc` 的布局注释：

```cpp
// WriteBatch::rep_ :=
//    sequence: fixed64
//    count: fixed32
//    data: record[count]
// record :=
//    kTypeValue varstring varstring         |
//    kTypeDeletion varstring
```

```cpp
// WriteBatch header has an 8-byte sequence number followed by a 4-byte count.
static const size_t kHeader = 12;
```

`sequence` 是这批操作的第一个序号，`count` 是操作数。写之前 `SetSequence` 把全局序号接上，重放时 `Iterate` 逐条按序号递增插入，收尾校验 `found != Count` 报 `"WriteBatch has wrong count"`。**一个批次 = 日志里的一条逻辑记录**，配合上一节的分片原子性，批次要么整体进入 memtable，要么整体不进。

两条路线殊途同归：原子性的边界都是「日志里的一条记录的结束」，区别只是 SQLite 用一个专用字段（提交帧的 `nTruncate`）标记，LevelDB 用记录自身的完整性（count 与实际条数一致）承载。

## 写序铁律：先 WAL，后 memtable

「先写日志再动数据」中的「先」，在源码里是两行相邻的语句。LevelDB `db_impl.cc` 的写路径，注释和代码一起说完了这件事：

```cpp
    // Add to log and apply to memtable.  We can release the lock
    // during this phase since &w is currently responsible for logging
    // and protects against concurrent loggers and concurrent writes
    // into mem_.
    {
      mutex_.Unlock();
      status = log_->AddRecord(WriteBatchInternal::Contents(write_batch));
      bool sync_error = false;
      if (status.ok() && options.sync) {
        status = logfile_->Sync();
        if (!status.ok()) {
          sync_error = true;
        }
      }
      if (status.ok()) {
        status = WriteBatchInternal::InsertInto(write_batch, mem_);
      }
      mutex_.Lock();
```

逐行读：`AddRecord`（写 WAL）→ 可选 `Sync`（fsync）→ `InsertInto`（进 memtable）。**每一步都以 `status.ok()` 为闸门**：WAL 写失败就不进内存，同步失败也不进内存。反过来（先改内存再写日志）在单机崩溃下是不可辩护的——内存里的「已提交」断电即蒸发，日志却还没落地，等于向用户承诺了不存在的持久性。

RocksDB 在多写线程下保持了同样的顺序，并把「先 WAL 后 memtable」写进了回调语义——它的写路径在 `db/db_impl/db_impl_write.cc`：

```cpp
    // PreReleaseCallback is called after WAL write and before memtable write
```

```cpp
    if (status.ok()) {
      PERF_TIMER_FOR_WAIT_GUARD(write_memtable_time);
      ...
        w.status = WriteBatchInternal::InsertInto(
            write_group, current_sequence, column_family_memtables_.get(),
            ...
```

而 WAL 写入的实际落点是 `WriteToWAL` 里的 `log_writer->AddRecord(...)`，由 `WriteGroupToWAL` 统一调度。顺序在两代实现里没有动过，因为它就是 WAL 的定义本身。

SQLite 是物理路线，等价物是「帧先落盘，帧序号（`mxFrame`）后可见」——`walFrames` 先 `walWriteToLog` 把帧写完，最后才 `walIndexWriteHdr` 推进头里的 `mxFrame`。**日志文件里的字节先于共享内存里的头存在**，读者永远看不到「指向不存在帧」的头。

## 组提交：一次同步摊给一批写入

fsync 是 WAL 的主要成本来源：每次提交都同步，盘就变成串行设备。组提交（group commit）的思路是让一个写线程替排队的所有人一次写完。LevelDB 用一个 `writers_` 队列实现：

```cpp
  writers_.push_back(&w);
  while (!w.done && &w != writers_.front()) {
    w.cv.Wait();
  }
```

队头醒来后把后面排队的写请求**合并成一个批次**再落盘：

```cpp
  if (status.ok() && updates != nullptr) {  // nullptr batch is for compactions
    WriteBatch* write_batch = BuildBatchGroup(&last_writer);
    WriteBatchInternal::SetSequence(write_batch, last_sequence + 1);
    last_sequence += WriteBatchInternal::Count(write_batch);
```

`BuildBatchGroup` 把 `writers_` 里合适的请求拼进同一个 `WriteBatch`（并受字节上限约束，避免饿死小写入）——合并之后，N 个提交共享一次 `AddRecord` 和一次 `Sync`，而 `SetSequence` + `last_sequence += Count` 保证它们在日志里拿到连续的序号。**组提交不改变日志的语义单位（每个请求仍是自己的批次），只改变 I/O 的聚合粒度。**

RocksDB 把同一个模式显式命名为 leader / follower，注释把意图说得很直白：

```cpp
  // else we are the leader of the write batch group
  assert(w.state == WriteThread::STATE_GROUP_LEADER);
  Status status;
  // Once reaches this point, the current writer "w" will try to do its write
  // job.  It may also pick up some of the remaining writers in the "writers_"
  // when it finds suitable, and finish them in the same write batch.
  // This is how a write job could be done by the other writer.
```

```cpp
        PERF_TIMER_GUARD(write_wal_time);
        io_s = WriteGroupToWAL(write_group, wal_context.writer, wal_used,
                               wal_context.need_wal_sync,
                               wal_context.need_wal_dir_sync, last_sequence + 1,
                               *wal_context.wal_file_number_size);
```

leader 一次 `WriteGroupToWAL` 覆盖整组，然后整组共享一次 `InsertInto`。同步的时机（`need_wal_sync`）由 `WriteOptions::sync` 在组内取并——**组里只要有一个请求要求同步，整组就得同步**，这是组提交的公平性代价，也是它能把 N 次 fsync 压成 1 次的全部原因。

## fsync 语义：`synchronous` 三档在 WAL 下的真义

「什么时候必须 fsync」是 WAL 最容易讲糊涂的问题。SQLite 把它做成了可配置项，并在源码里留下了完整的推导链。

先看三档的取值（`sqlite.h.in`）：

```c
#define SQLITE_SYNC_NORMAL        0x00002
#define SQLITE_SYNC_FULL          0x00003
#define SQLITE_SYNC_DATAONLY      0x00010
```

关键设计在 `wal.h` 的两个掩码宏——**一个 `PRAGMA` 值被拆成两份**，分别用于提交路径和 checkpoint 路径：

```c
#define WAL_SYNC_FLAGS(X)   ((X)&0x03)
#define CKPT_SYNC_FLAGS(X)  (((X)>>2)&0x03)
```

拼装逻辑在 `pager.c` 的 `sqlite3PagerSetFlags`：

```c
  if( pPager->noSync ){
    pPager->syncFlags = 0;
  }else if( pgFlags & PAGER_FULLFSYNC ){
    pPager->syncFlags = SQLITE_SYNC_FULL;
  }else{
    pPager->syncFlags = SQLITE_SYNC_NORMAL;
  }
  pPager->walSyncFlags = (pPager->syncFlags<<2);
  if( pPager->fullSync ){
    pPager->walSyncFlags |= pPager->syncFlags;
  }
```

`walSyncFlags = syncFlags<<2` 把基础同步档放到高位（checkpoint 用），**低位默认是 0**；只有 `fullSync`（即 `synchronous=FULL`）才把低位补上。而提交路径恰好只看低位：

```
  ** Padding and syncing only occur if this set of frames complete a
  ** transaction and if PRAGMA synchronous=FULL.  If synchronous==NORMAL
  ** or synchronous==OFF, then no padding or syncing are needed.
```

```c
  if( isCommit && WAL_SYNC_FLAGS(sync_flags)!=0 ){
```

三段代码拼出完整结论：

| 配置 | 提交时（WAL 尾部 fsync） | checkpoint 时（数据文件 fsync） |
|---|---|---|
| `OFF` | 不同步 | 不同步 |
| `NORMAL` | **不同步** | 同步 |
| `FULL` | 同步 | 同步 |

`NORMAL` 为什么敢不在提交时同步？因为 WAL 模式下提交只往日志**追加**字节，不改数据文件；崩溃最多丢日志尾部——而日志尾部本来就允许丢（遇坏即停），数据文件则由 checkpoint 的同步兜底。`wal.c` 里那段著名注释把好处点破了：

```
** All I/O barrier operations (a.k.a fsyncs) occur in this routine when
** SQLite is in WAL-mode in synchronous=NORMAL.  That means that if
** checkpoints are always run by a background thread or background
** process, foreground threads will never block on a lengthy fsync call.
```

**同步从提交路径挪到了 checkpoint 路径**，前台线程不再被 fsync 卡住，代价是进程崩溃可能丢掉最后几笔提交（但数据库永远是一致的）。`FULL` 则每笔提交都过一道 I/O 屏障——丢的只是未提交数据，一行都不会少。三档的本质不是「安全级别」，而是**「你愿意在哪个环节赌多大的丢失窗口」**。

## checkpoint：日志不能无限长

WAL 只追加，数据文件原地不动——总得有人把日志内容搬回数据文件，这就是 checkpoint。搬完之后日志何去何从，构成了四种模式。先看枚举定义（`sqlite.h.in`，注意不在 `wal.h`）：

```c
#define SQLITE_CHECKPOINT_NOOP    -1  /* Do no work at all */
#define SQLITE_CHECKPOINT_PASSIVE  0  /* Do as much as possible w/o blocking */
#define SQLITE_CHECKPOINT_FULL     1  /* Wait for writers, then checkpoint */
#define SQLITE_CHECKPOINT_RESTART  2  /* Like FULL but wait for readers */
#define SQLITE_CHECKPOINT_TRUNCATE 3  /* Like RESTART but also truncate WAL */
```

四档是严格递进的：`PASSIVE` 不等任何人、能回填多少算多少；`FULL` 抢写锁、等写入者让路，回填不完返回 BUSY；`RESTART` 再等读者退出，好让日志**从头复用**（配合换盐）；`TRUNCATE` 在此基础上把日志文件截成 0 字节。模式差异的代码在 `walCheckpoint`：

```c
  if( rc==SQLITE_OK && eMode!=SQLITE_CHECKPOINT_PASSIVE ){
    assert( pWal->writeLock );
    if( pInfo->nBackfill<pWal->hdr.mxFrame ){
      rc = SQLITE_BUSY;
    }else if( eMode>=SQLITE_CHECKPOINT_RESTART ){
      u32 salt1;
      sqlite3_randomness(4, &salt1);
      assert( pInfo->nBackfill==pWal->hdr.mxFrame );
      rc = walBusyLock(pWal, xBusy, pBusyArg, WAL_READ_LOCK(1), WAL_NREADER-1);
      if( rc==SQLITE_OK ){
        if( eMode==SQLITE_CHECKPOINT_TRUNCATE ){
```

`TRUNCATE` 分支的尾部把两件事一起做了——换盐 + 截断：

```c
          walRestartHdr(pWal, salt1);
          rc = sqlite3OsTruncate(pWal->pWalFd, 0);
```

还有一层降级语义藏在 `sqlite3WalCheckpoint`：非 `PASSIVE` 模式要抢写锁，抢不到不报错，而是**降级成 `PASSIVE`** 继续干：

```c
      if( eMode!=SQLITE_CHECKPOINT_PASSIVE ){
        rc = walBusyLock(pWal, xBusy2, pBusyArg, WAL_WRITE_LOCK, 1);
        if( rc==SQLITE_OK ){
          pWal->writeLock = 1;
        }else if( rc==SQLITE_BUSY ){
          eMode2 = SQLITE_CHECKPOINT_PASSIVE;
          xBusy2 = 0;
          rc = SQLITE_OK;
        }
      }
```

checkpoint 本质上是后台维护，做一半总比完全不做强——**「尽力而为 + 明确报告」比「要么全做要么不做」在实践里更有用**。

和上一节的 fsync 表格连起来看，完整的持久化分工是：`NORMAL` 下日志尾部可能丢，但 checkpoint 把已回填的部分 fsync 进数据文件；日志再从 checkpoint 点继续。**数据文件的每一次变更都先于它自己的同步屏障**，这个不变式就是「崩溃后打开永远一致」的全部内容。

## 恢复模式：损坏发生时你要哪种世界线

恢复程序读到坏字节之后该干什么？LevelDB 一路沿用「容忍尾巴损坏」；RocksDB 把这个决策做成了显式的四选一。`include/rocksdb/options.h` 的枚举与注释逐字如下：

```cpp
enum class WALRecoveryMode : char {
  // Original levelDB recovery
  //
  // We tolerate the last record in any log to be incomplete due to a crash
  // while writing it. Zeroed bytes from preallocation are also tolerated in the
  // trailing data of any log.
  //
  // Use case: Applications for which updates, once applied, must not be rolled
  // back even after a crash-recovery. In this recovery mode, RocksDB guarantees
  // this as long as `WritableFile::Append()` writes are durable. In case the
  // user needs the guarantee in more situations (e.g., when
  // `WritableFile::Append()` writes to page cache, but the user desires this
  // guarantee in face of power-loss crash-recovery), RocksDB offers various
  // mechanisms to additionally invoke `WritableFile::Sync()` in order to
  // strengthen the guarantee.
  //
  // This differs from `kPointInTimeRecovery` in that, in case a corruption is
  // detected during recovery, this mode will refuse to open the DB. Whereas,
  // `kPointInTimeRecovery` will stop recovery just before the corruption since
  // that is a valid point-in-time to which to recover.
  kTolerateCorruptedTailRecords = 0x00,
  // Recover from clean shutdown
  // We don't expect to find any corruption in the WAL
  // Use case : This is ideal for unit tests and rare applications that
  // can require high consistency guarantee
  kAbsoluteConsistency = 0x01,
  // Recover to point-in-time consistency (default)
  // We stop the WAL playback on discovering WAL inconsistency
  // Use case : Ideal for systems that have disk controller cache like
  // hard disk, SSD without super capacitor that store related data
  kPointInTimeRecovery = 0x02,
  // Recovery after a disaster
  // We ignore any corruption in the WAL and try to salvage as much data as
  // possible
  // Use case : Ideal for last ditch effort to recover data or systems that
  // operate with low grade unrelated data
  kSkipAnyCorruptedRecords = 0x03,
};
```

四档从「宁可不启动」到「宁可丢数据也要开」排列，默认值是 `kPointInTimeRecovery`。注释里那句 **"that is a valid point-in-time to which to recover"** 是整个 WAL 恢复哲学的浓缩：**坏点之前的日志是一个合法的时间断面，恢复到那里不算丢数据，算守住承诺**。

分叉的执行点在 `db_impl_open.cc` 的 `HandleNonOkStatusOrOldLogRecord`：

```cpp
  if (immutable_db_options_.wal_recovery_mode ==
      WALRecoveryMode::kSkipAnyCorruptedRecords) {
    // We should ignore all errors unconditionally
    return Status::OK();
  } else if (immutable_db_options_.wal_recovery_mode ==
             WALRecoveryMode::kPointInTimeRecovery) {
```

```cpp
  } else {
    assert(immutable_db_options_.wal_recovery_mode ==
               WALRecoveryMode::kTolerateCorruptedTailRecords ||
           immutable_db_options_.wal_recovery_mode ==
           WALRecoveryMode::kAbsoluteConsistency);
    return status;
  }
```

而恢复主循环拿到损坏的方式是把模式直接传给读端：

```cpp
    bool read_record = reader->ReadRecord(
        &record, &scratch, immutable_db_options_.wal_recovery_mode,
        &record_checksum);

    // `reader->ReadRecord` will change `status` through reporter in `reader`
    // when a corruption is encountered
    if (!read_record || !status.ok()) {
      break;
    }
```

**「遇坏即停」是不变的底层事实，四个模式改变的只是停完之后的处置**：拒绝启动（`kAbsoluteConsistency`）、停在坏点前（`kPointInTimeRecovery`）、把尾巴当正常结束（`kTolerateCorruptedTailRecords`）、跳过坏记录继续挖（`kSkipAnyCorruptedRecords`）。底层机制与策略被干净地分成了两层——这是 LevelDB 时代没有的工程成熟度。

## 读端可见性：快照上界是怎么来的

恢复回答「日志里有多少帧是合法的」，读端还要回答「我这个快照该看到哪一帧」。SQLite 把答案存成一个数：`mxFrame`。`walFindFrame` 的开头就是快照的两个边界：

```c
  u32 iRead = 0;                  /* If !=0, WAL frame to return data from */
  u32 iLast = pWal->hdr.mxFrame;  /* Last page in WAL for this reader */
  ...
  if( iLast==0 || (pWal->readLock==0 && pWal->bShmUnreliable==0) ){
    *piRead = 0;
    return SQLITE_OK;
  }
```

`iLast` 是开读事务那一刻从 wal-index 头快照下来的合法帧上界；哈希查找时，候选帧必须同时落在上下界之内才被采纳：

```cpp
      if( iFrame<=iLast
       && iFrame>=pWal->minFrame
       && sLoc.aPgno[(iH-1)&(HASHTABLE_NPAGE-1)]==pgno
      ){
        iRead = iFrame;
      }
```

对同一页号取**最大的合法帧号**——同页多版本，快照边界决定取哪版。`iLast` 的来源正是恢复与校验那一整套机制（盐 + 链式校验和 + 提交帧推进），**读端不需要自己再验一遍完整性，它消费的是恢复端已经证明过的结论**。写端、恢复端、读端三层各司其职，中间只传递一个 `mxFrame`。

## WAL 是门通用手艺：MANIFEST 与 NanoDB 的 JSON Lines

WAL 不属于「数据库」，它属于「任何不能承受就地改写事故的追加式系统」。两个旁证：

**LevelDB 的 MANIFEST 就是同一个 log 格式再就业。** 元数据版本（哪些文件属于当前 SST 集合）的变更日志，用的正是 WAL 那套 `log::Writer`。`version_set.cc` 的 `LogAndApply`：

```cpp
    // Write new record to MANIFEST log
    if (s.ok()) {
      std::string record;
      edit->EncodeTo(&record);
      s = descriptor_log_->AddRecord(record);
      if (s.ok()) {
        s = descriptor_file_->Sync();
      }
```

恢复时对称地用 `log::Reader` 逐条解出来再应用：

```cpp
    log::Reader reader(file, &reporter, true /*checksum*/,
                       0 /*initial_offset*/);
    Slice record;
    std::string scratch;
    while (reader.ReadRecord(&record, &scratch) && s.ok()) {
      VersionEdit edit;
      s = edit.DecodeFrom(record);
```

**「崩溃后元数据不许自相矛盾」和「崩溃后数据不许丢」是同一个问题**，所以 LevelDB 直接复用了同一套格式、校验和恢复代码——一个 log 层服务两类文件，这是最省事也最不会出 bug 的做法。

**SQLite 的 WAL 记录页镜像，LevelDB 记录操作，NanoDB 记录 JSON Lines。** 上一篇《[NanoDB：Go 嵌入式文档数据库](/article/nanodb/)》里，`wal.log` 每行是一条 JSON 记录，恢复时逐行解析、遇到解析不了的行就停。格式从二进制换成了文本，但从 `walDecodeFrame` 到 `ReadRecord` 的那条铁律一字未改：**连续通过校验的前缀才作数**。三套实现，同一条契约——这就是为什么读格式之前要先立契约。

## 自研 WAL 设计清单

把全文的源码证据折叠成一份可执行的清单。动手写之前逐项过一遍，每项后面是它对应的「事故」：

| # | 设计决策 | 事故 | 源码里的榜样 |
|---|---|---|---|
| 1 | 文件头带 magic + 版本 + 自校验 | 拿错文件 / 头被写坏当有效 | SQLite 32 字节头，坏头 `goto finished` |
| 2 | 记录头带长度与校验和，覆盖 type | 撕裂、位翻转被当数据 | LevelDB 7 字节头，CRC 覆盖 type + payload |
| 3 | 校验和链式（前一条作初值） | 中段被改而前后各自自洽 | `walChecksumBytes(native, ..., aCksum, aCksum)` |
| 4 | 恢复遇坏即停，不重新同步找下一帧 | 垃圾字节被回放 | `if( !isValid ) break;` / `buffer_.clear()` |
| 5 | 半条逻辑记录整条丢弃 | 半个事务进入内存 | `kEof` 时 `scratch->clear()` |
| 6 | 专用提交标记（或批次完整性） | 中途崩溃留下半个事务 | `nTruncate != 0` / `count` 校验 |
| 7 | 先写日志，同步成功才改内存与数据文件 | 「已提交」断电蒸发 | `AddRecord` → `Sync` → `InsertInto` |
| 8 | 日志回卷必须换代身份 | 新旧帧混合冒充有效 | `walRestartHdr`：salt1 自增 + salt2 随机 |
| 9 | 同步点显式化并可分档 | 每笔提交都付全价，或从不付账 | `WAL_SYNC_FLAGS` / `CKPT_SYNC_FLAGS` 分工 |
| 10 | checkpoint 尽力而为 + 模式化收尾 | 日志无限长，或收尾卡死业务 | `PASSIVE` 抢不到锁就降级 |
| 11 | 损坏处置做成策略而非硬编码 | 无法按业务风险调平衡 | `WALRecoveryMode` 四模式 |
| 12 | 读端只消费恢复端的结论（单个上界值） | 读端各自验帧，口径漂移 | `mxFrame` 快照 + `walFindFrame` 双边界 |

其中 1~5 是**格式层**（字节怎么摆），6~8 是**语义层**（事务与代际），9~12 是**策略层**（同步、收尾、损坏、读写协作）。常见错误是把 9~11 当成「高级功能」延后处理——恰恰相反，这三行策略决定了你的 WAL 在事故里是「丢几笔」还是「起不来」，必须在第一版就有明确答案，哪怕答案是硬编码的默认值。

## 结语

这篇文章从头到尾没有一行「我写的」代码，但你已经把两套工业级 WAL 的骨架拆开了：SQLite 的 32 + 24 字节页帧和链式滚动校验，LevelDB 的 7 字节头 + 32 KB 块 + CRC32C 分片重组——两套格式天差地别，四条约定却一条不差：

1. **只追加**，回卷就换盐；
2. **逐条校验**，覆盖范围明确到字节；
3. **遇坏即停**，只承认连续合法的前缀；
4. **先记账再动数据**，同步点显式可查。

值得反复咀嚼的是这些设计共同的气质：**不猜**。恢复程序不猜坏字节后面还有什么，读端不猜帧是否有效（它只读 `mxFrame`），checkpoint 不猜锁能不能抢到（抢不到就降级）。所有需要「猜」的地方，都被一个可计算的谓词（校验和、盐、上界）替代了——而一个可计算的谓词，就是所谓「一致性」在源码里的全部形态。

下次再听到「数据库崩溃后不丢数据」，你可以直接报出这些名字：`walIndexRecover`、`walDecodeFrame`、`walRestartHdr`、`WAL_SYNC_FLAGS`、`AddRecord → InsertInto`、`kPointInTimeRecovery`。承诺不神秘，它就是这些 if 语句的总和。
