/**
 * lfuCacheSteps.js — 「LFU 缓存」(LC 460) 的推演状态机（LRU 的追问对照）。
 *
 * 纯函数，不碰 DOM。渲染层是 lfuCache.js。
 *
 * ── 与 LRU 的本质区别 ─────────────────────────────────────────────────────
 * LRU 只看「最近有没有用」（时间维度），LFU 看「一共用了多少次」（频率维度）：
 *   - get / put 命中 → 该节点的 freq += 1（**LFU 里 get 会改结构！**）；
 *   - 容量满 → 淘汰 **freq 最小** 的节点；freq 相同时，淘汰其中**最久未使用**的
 *     （频率维度 + 时间维度兜底，这就是「LFU 的 tie-break」）。
 * 真实现场里 LFU 还需要「频率桶 + minFreq 指针」才能做到 O(1)；
 * 这里的状态机用扫描找最小值（语义等价，便于逐帧展示）。
 *
 * 帧设计（默认 capacity = 2，同一串操作会给出与 LRU 不同的淘汰结果）：
 *   init / get-hit / get-miss / put-update / evict / put-insert / done
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   nodes: { id, key, value, freq }[]  // 展示顺序：freq 升序（并列按最久未使用在前）
 *   minFreq: number | null             // 当前最小频率（淘汰目标）
 *   cur / evicted / result / results / opText / done
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. size ≤ capacity、key 不重复、freq ≥ 1；
 *   2. get-hit / put-update 后 cur 的 freq === 上一帧 + 1；
 *   3. evict 的受害者 freq === 淘汰前的最小 freq；并列时取最久未使用；
 *   4. done.results === 独立参考解；与 LRU 在默认用例上给出**不同**的淘汰结果。
 */

const DEFAULT_CAPACITY = 2
const DEFAULT_OPS = [
  ['put', 1, 1],
  ['put', 2, 2],
  ['get', 2],
  ['get', 2],
  ['get', 1],
  ['put', 3, 3],
  ['get', 1],
  ['get', 2],
  ['get', 3],
]

/** 供测试与渲染层复用的默认用例。 */
export const LFU_DEFAULT_CAPACITY = DEFAULT_CAPACITY
export const LFU_DEFAULT_OPS = DEFAULT_OPS

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

export function buildLfuCacheSteps(options = {}) {
  const { capacity, ops } = normalize(options)

  let nextId = 1
  let clock = 0
  const nodes = new Map() // key -> { id, key, value, freq, stamp }
  const results = []
  const steps = []

  const displayNodes = () =>
    [...nodes.values()]
      .sort((a, b) => (a.freq - b.freq) || (a.stamp - b.stamp))
      .map((n) => ({ id: n.id, key: n.key, value: n.value, freq: n.freq }))
  const minFreqOf = () => {
    let min = null
    for (const n of nodes.values()) min = min === null ? n.freq : Math.min(min, n.freq)
    return min
  }

  const snap = (phase, desc, opText, extra = {}) => {
    steps.push({
      phase,
      desc,
      capacity,
      nodes: displayNodes(),
      minFreq: minFreqOf(),
      opText,
      cur: null,
      evicted: null,
      result: null,
      results: [...results],
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `LFU = **按使用频率淘汰**：每个节点记一个 \`freq\`（被 get / put 命中一次就 +1），` +
      `容量满时淘汰 \`freq\` **最小**的节点；**freq 并列时淘汰其中「最久未使用」的**` +
      `（频率维度 + 时间维度兜底）。和 LRU 对着看：下面这串操作会让两台机器` +
      `**淘汰不同的 key**。容量 = ${capacity}。`,
    `LFUCache(${capacity})`,
  )

  for (const op of ops) {
    if (op[0] === 'get') {
      const key = op[1]
      const node = nodes.get(key)
      if (node) {
        const before = node.freq
        node.freq += 1
        node.stamp = ++clock
        results.push(node.value)
        snap(
          'get-hit',
          `\`get(${key})\` 命中：返回 \`${node.value}\`，并把它的频率从 \`${before}\` 提到 \`${node.freq}\`。` +
            `**注意：LFU 里的 get 会改结构** —— 频率变了，淘汰的优先级也跟着变（LRU 的 get 只动顺序、不改“权重”）。`,
          `get(${key}) → ${node.value}（freq ${before} → ${node.freq}）`,
          { cur: node.id, result: node.value },
        )
      } else {
        results.push(-1)
        snap(
          'get-miss',
          `\`get(${key})\` 未命中，返回 \`-1\`。**未命中不改变任何节点的频率**。`,
          `get(${key}) → -1`,
          { result: -1 },
        )
      }
    } else {
      const [, key, value] = op
      const node = nodes.get(key)
      if (node) {
        const before = node.freq
        node.value = value
        node.freq += 1
        node.stamp = ++clock
        snap(
          'put-update',
          `\`put(${key}, ${value})\`：已存在 → 改值，并把频率从 \`${before}\` 提到 \`${node.freq}\`。` +
            `（LRU 是「移到队首」，LFU 是「升一档频率」——同样算一次使用，但记的东西不同。）`,
          `put(${key}, ${value})：改值 + freq ${before} → ${node.freq}`,
          { cur: node.id },
        )
      } else {
        if (nodes.size === capacity) {
          let victim = null
          for (const n of nodes.values()) {
            if (
              victim === null ||
              n.freq < victim.freq ||
              (n.freq === victim.freq && n.stamp < victim.stamp)
            ) {
              victim = n
            }
          }
          const victimFreq = victim.freq
          nodes.delete(victim.key)
          snap(
            'evict',
            `\`put(${key}, ${value})\`：容量已满 → 淘汰 \`freq\` **最小**的节点：` +
              `\`(${victim.key}, ${victim.value})\`，freq = \`${victimFreq}\`` +
              `（并列时才是「最久未使用」的 tie-break）。**不是淘汰最久未用的那个** —— ` +
              `这就是 LFU 和 LRU 的分岔点。`,
            `淘汰 freq 最小的 (${victim.key}, ${victim.value})，freq = ${victimFreq}`,
            { evicted: { id: victim.id, key: victim.key, value: victim.value, freq: victimFreq } },
          )
        }
        const fresh = { id: nextId, key, value, freq: 1, stamp: ++clock }
        nextId += 1
        nodes.set(key, fresh)
        snap(
          'put-insert',
          `插入新节点 \`(${key}, ${value})\`，**freq 从 1 起**（新来的还没被用过）。` +
            `当前各节点频率：${displayNodes().map((n) => `\`${n.key}:${n.freq}\``).join('、')}，` +
            `minFreq = \`${minFreqOf()}\`。`,
          `put(${key}, ${value})：新节点 freq = 1`,
          { cur: fresh.id },
        )
      }
    }
  }

  snap(
    'done',
    `推演结束，get 返回值 = \`[${results.join(', ')}]\`。` +
      `对照记忆：LRU 淘汰「最久未用」，LFU 淘汰「用得最少」（并列再比谁更久没用）；` +
      `代价是 LFU 的 get 要更新频率、结构更重 —— 面试里这两题连问，考的就是你知不知道它们差在哪。`,
    `完成：get 返回值 = [${results.join(', ')}]`,
  )

  return steps
}
