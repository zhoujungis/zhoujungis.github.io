/**
 * lruCacheSteps.js — 「LRU 缓存」(LC 146) 的推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 lruCache.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * O(1) 的 get / put = **哈希表（key → 节点）+ 双向链表（按使用顺序排列）**：
 *   - 哈希表负责「按 key 一步找到节点」；
 *   - 双向链表负责「维护最近使用顺序」并让「移到队首 / 淘汰队尾」都是 O(1)。
 * 队首 = 最近使用（MRU），队尾 = 最久未使用（LRU）—— 容量满时淘汰队尾。
 *
 * 帧设计（默认 capacity = 2，题面标准用例）：
 *   init       —— 空表，头尾哨兵
 *   get-hit    —— 命中：拿到值，节点移到队首
 *   get-miss   —— 未命中：返回 -1，结构不动
 *   put-update —— key 已存在：改值 + 移到队首（注意：这也算「使用」）
 *   evict      —— 容量满：淘汰队尾（最久未使用），从链表和哈希表同时删除
 *   put-insert —— 新节点插到队首
 *   done       —— 汇总所有 get 的返回值
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'get-hit' | 'get-miss' | 'put-update' | 'evict' | 'put-insert' | 'done'
 *   desc: string
 *   capacity: number
 *   order: { id, key, value }[]   // 链表快照，index 0 = 队首（MRU）
 *   mapEntries: { key, id }[]     // 哈希表快照（key → 节点 id）
 *   opText: string                // 本帧对应的操作与结果
 *   cur: number | null            // 本帧主角节点 id
 *   evicted: { id, key, value } | null
 *   result: number | null         // 本帧 get 的返回值
 *   results: number[]             // 截至本帧的所有 get 返回值
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. 任意帧 order.length ≤ capacity，且 order 里 key 互不相同；
 *   2. 哈希表键集合 === 链表 key 集合（同步增删）；
 *   3. get-hit / put-update 后 cur 节点在队首；get-miss 不改变结构；
 *   4. evict 帧：被淘汰节点不在 order 也不在 map，长度恰好 capacity−1；
 *   5. done.results === 独立参考解（时间戳法）。
 */

const DEFAULT_CAPACITY = 2
const DEFAULT_OPS = [
  ['put', 1, 1],
  ['put', 2, 2],
  ['get', 1],
  ['put', 3, 3],
  ['get', 2],
  ['put', 4, 4],
  ['get', 1],
  ['get', 3],
  ['get', 4],
]

/** 供测试与渲染层复用的默认用例。 */
export const LRU_DEFAULT_CAPACITY = DEFAULT_CAPACITY
export const LRU_DEFAULT_OPS = DEFAULT_OPS

function normalize(options = {}) {
  const rawCap = Number.isInteger(options.capacity) ? options.capacity : DEFAULT_CAPACITY
  const capacity = rawCap >= 1 ? rawCap : DEFAULT_CAPACITY
  const rawOps = Array.isArray(options.ops) ? options.ops : DEFAULT_OPS
  const ops = rawOps.filter(
    (op) =>
      Array.isArray(op) &&
      (op[0] === 'get'
        ? op.length >= 2 && Number.isInteger(op[1])
        : op[0] === 'put' && op.length >= 3 && Number.isInteger(op[1]) && Number.isInteger(op[2])),
  )
  return { capacity, ops }
}

export function buildLruCacheSteps(options = {}) {
  const { capacity, ops } = normalize(options)

  let nextId = 1
  const order = [] // index 0 = 队首（最近使用）
  const map = new Map() // key -> node 对象（同一个引用也存在于 order 里）
  const results = []

  const steps = []
  const snapOrder = () => order.map((n) => ({ id: n.id, key: n.key, value: n.value }))
  const snapMap = () => [...map.keys()].map((k) => ({ key: k, id: map.get(k).id }))

  const snap = (phase, desc, opText, extra = {}) => {
    steps.push({
      phase,
      desc,
      capacity,
      order: snapOrder(),
      mapEntries: snapMap(),
      opText,
      cur: null,
      evicted: null,
      result: null,
      results: [...results],
      done: phase === 'done',
      ...extra,
    })
  }

  const moveToFront = (node) => {
    const idx = order.indexOf(node)
    order.splice(idx, 1)
    order.unshift(node)
  }

  snap(
    'init',
    `LRU = **哈希表 + 双向链表**：哈希表按 key 一步找到节点（O(1) 定位），` +
      `双向链表按「最近使用」排序 —— **队首 = 最近使用**，**队尾 = 最久未使用**，` +
      `容量满就淘汰队尾。两条结构同步增删，保证 get / put 都是 O(1)。` +
      `容量 = ${capacity}，全部操作逐帧推演。`,
    `LRUCache(${capacity})`,
  )

  for (const op of ops) {
    if (op[0] === 'get') {
      const key = op[1]
      if (map.has(key)) {
        const node = map.get(key)
        moveToFront(node)
        results.push(node.value)
        snap(
          'get-hit',
          `\`get(${key})\` **命中**：哈希表一步找到节点（第 ${node.id} 号），返回 \`${node.value}\`；` +
            `把它**移到队首**（刚刚被使用过）。这一步只动了链表指针，哈希表不动。`,
          `get(${key}) → ${node.value}`,
          { cur: node.id, result: node.value },
        )
      } else {
        results.push(-1)
        snap(
          'get-miss',
          `\`get(${key})\` **未命中**：哈希表里没有这个 key，返回 \`-1\`；链表、哈希表都原样不动。`,
          `get(${key}) → -1`,
          { result: -1 },
        )
      }
    } else {
      const [, key, value] = op
      if (map.has(key)) {
        const node = map.get(key)
        node.value = value
        moveToFront(node)
        snap(
          'put-update',
          `\`put(${key}, ${value})\`：key **已存在** → 改值 + **移到队首**。` +
            `注意：**put 已存在的 key 也算一次使用** —— 漏掉这一步是本题最常见的错误。`,
          `put(${key}, ${value})：已存在 → 改值并移到队首`,
          { cur: node.id },
        )
      } else {
        if (order.length === capacity) {
          const victim = order[order.length - 1]
          map.delete(victim.key)
          order.pop()
          snap(
            'evict',
            `\`put(${key}, ${value})\`：容量已满 → 先**淘汰队尾** —— 第 ${victim.id} 号节点 ` +
              `\`(${victim.key}, ${victim.value})\` 是最久未使用的。链表中摘掉它，**哈希表同步删除**，` +
              `两处都要删干净，漏一个就是幽灵节点。`,
            `淘汰队尾 (${victim.key}, ${victim.value})`,
            { evicted: { id: victim.id, key: victim.key, value: victim.value } },
          )
        }
        const node = { id: nextId, key, value }
        nextId += 1
        map.set(key, node)
        order.unshift(node)
        snap(
          'put-insert',
          `\`put(${key}, ${value})\`：新 key → 建一个新节点**插到队首**（它刚刚被使用），` +
            `哈希表登记 \`${key} → 第 ${node.id} 号节点\`。现在链表（头 → 尾）：` +
            `\`${order.map((n) => `(${n.key}, ${n.value})`).join(' → ')}\`。`,
          `put(${key}, ${value})：新节点插到队首`,
          { cur: node.id },
        )
      }
    }
  }

  snap(
    'done',
    `推演结束。所有 get 的返回值（按顺序）：\`[${results.join(', ')}]\` —— ` +
      `每次「命中」都返回哈希表里节点存的值（值跟着节点走，改值不搬家）；` +
      `「未命中」固定 -1；淘汰只发生在 put 新 key 且容量已满时，且永远淘汰**队尾**。`,
    `完成：get 返回值 = [${results.join(', ')}]`,
  )

  return steps
}
