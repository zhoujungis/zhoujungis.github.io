/**
 * mergeKListsSteps.js — 「合并 K 个升序链表」(LeetCode 23) 小顶堆解法的状态机。
 *
 * 纯函数，不碰 DOM（和 linkedListSteps.js / mergeSteps.js 同一套路）。
 * 渲染层（mergeKLists.js）只负责把快照画成 SVG。
 *
 * 一个 step 长这样：
 *   {
 *     phase:   'init' | 'take' | 'done',
 *     desc:    string,             // 中文说明，直接显示给读者
 *     heap:    [{list, i}],        // 堆数组快照，下标 0 是堆顶
 *     cursors: (number|null)[],    // 每条链表当前头下标；null = 该链表已走完
 *     taken:   [{list, i}],        // 已经接到结果链表上的节点，按先后顺序
 *     popped:  {list, i} | null,   // 本步出堆的那个（take 步才有）
 *     pushed:  {list, i} | null,   // 本步入堆的那个；该链表已走完则为 null
 *     moved:   number[],           // 本步堆内发生过换位的下标（供渲染层高亮）
 *     done:    boolean,
 *   }
 *
 * 循环体一共四件事：
 *     ① 堆顶出堆（末位元素补到根 + 下沉）      ② 接到结果尾部
 *     ③ 它所在链表前移一格                    ④ 新头入堆（上浮）
 *
 * 全篇最关键的一点，也是 O(N log K) 里那个 K 的来源：
 * **堆里永远只放 K 个节点 —— 每条链表当前的头部。** 不是全部 N 个。
 *
 * 比较用 (值, 链表序号) 这个二元组，两个作用：
 *   1. 值相同时有确定的先后，推演过程可复现；
 *   2. 不会去比较对象本身（Python 里 ListNode 不可比较，是同一个坑）。
 */

/** 链表序号 → 行标签，和渲染层的 A / B / C / D 对齐。 */
const label = (li) => String.fromCharCode(65 + li)

export function buildMergeKListsSteps(lists) {
  const L = (Array.isArray(lists) ? lists : []).map((l) =>
    Array.isArray(l) ? l.slice() : [],
  )
  const K = L.length
  const steps = []
  const cursors = L.map((l) => (l.length ? 0 : null))
  const taken = []
  const heap = [] // [{list, i}]，按数组序，下标 0 是堆顶

  /** 堆的比较键：(值, 链表序号)。 */
  const less = (a, b) => {
    const va = L[a.list][a.i]
    const vb = L[b.list][b.i]
    if (va !== vb) return va < vb
    return a.list < b.list
  }

  const valueOf = (n) => L[n.list][n.i]

  const snap = (phase, desc, extra = {}) =>
    steps.push({
      phase,
      desc,
      heap: heap.map((h) => ({ ...h })),
      cursors: cursors.slice(),
      taken: taken.map((t) => ({ ...t })),
      popped: null,
      pushed: null,
      moved: [],
      done: false,
      ...extra,
    })

  /** 上浮：把 idx 处的元素沿父链往上换，返回换过的下标（供高亮）。 */
  function siftUp(idx) {
    const moved = []
    while (idx > 0) {
      const parent = (idx - 1) >> 1
      if (!less(heap[idx], heap[parent])) break
      ;[heap[idx], heap[parent]] = [heap[parent], heap[idx]]
      moved.push(idx, parent)
      idx = parent
    }
    return moved
  }

  /** 下沉：把 idx 处的元素和更小的孩子换，返回换过的下标。 */
  function siftDown(idx) {
    const moved = []
    for (;;) {
      const left = 2 * idx + 1
      const right = 2 * idx + 2
      let smallest = idx
      if (left < heap.length && less(heap[left], heap[smallest])) smallest = left
      if (right < heap.length && less(heap[right], heap[smallest])) smallest = right
      if (smallest === idx) break
      ;[heap[idx], heap[smallest]] = [heap[smallest], heap[idx]]
      moved.push(idx, smallest)
      idx = smallest
    }
    return moved
  }

  // ── 建堆：K 个头部依次入堆（逐个 push 是 O(K log K)；heapify 是 O(K)，
  //    但 K ≤ N，在 O(N log K) 里都只是常数因子，不影响量级）───────────────
  let initMoved = []
  for (let li = 0; li < K; li += 1) {
    if (cursors[li] === null) continue
    heap.push({ list: li, i: 0 })
    initMoved = initMoved.concat(siftUp(heap.length - 1))
  }

  const nonEmpty = L.filter((l) => l.length).length
  const totalNodes = L.reduce((sum, l) => sum + l.length, 0)

  if (heap.length === 0) {
    const why =
      K === 0
        ? '`lists` 是个空数组，一条链表都没有，直接返回 ∅。'
        : `${K} 条链表全是空的 —— 堆建起来是空的，直接返回 ∅。`
    snap('init', why, { moved: [], done: true })
    return steps
  }

  snap(
    'init',
    `把 ${nonEmpty} 条链表的**头节点**放进小顶堆：${heap
      .map((n) => `${label(n.list)} 的 ${valueOf(n)}`)
      .join('、')}。注意**只放头部**，每条链表后面那些节点还在原地等 —— ` +
      `堆里现在只有 ${heap.length} 个元素，不是 ${totalNodes} 个。这是 O(N log K) 里那个 K 的来源。`,
    { moved: initMoved },
  )

  // ── 主循环：每轮取走一个节点，一共取 N 轮 ─────────────────────────────────
  while (heap.length) {
    const root = heap[0]
    const moved = []

    // ① 堆顶出堆：末位元素补到根，然后下沉
    const last = heap.pop()
    if (heap.length) {
      heap[0] = last
      moved.push(...siftDown(0))
    }

    // ② 接到结果尾部
    taken.push({ list: root.list, i: root.i })

    // ③ 它所在链表前移一格
    const li = root.list
    cursors[li] = cursors[li] + 1 < L[li].length ? cursors[li] + 1 : null

    // ④ 新头入堆（该链表已走完就不补位）
    let pushed = null
    if (cursors[li] !== null) {
      pushed = { list: li, i: cursors[li] }
      heap.push(pushed)
      moved.push(...siftUp(heap.length - 1))
    }

    const tailText = pushed
      ? `${label(li)} 前移一格，新头 ${valueOf(pushed)} 入堆，堆里还是 ${heap.length} 个元素。`
      : `${label(li)} 已经走完了，不再补位 —— 堆里只剩 ${heap.length} 个元素。`

    snap(
      'take',
      `堆顶是 ${valueOf(root)}（来自 ${label(li)}）。出堆 → 接到结果尾部 → ${tailText}`,
      { popped: { ...root }, pushed: pushed ? { ...pushed } : null, moved },
    )
  }

  const merged = taken.map((t) => valueOf(t)).join(' → ')
  snap(
    'done',
    `堆空了，说明每个节点都被取走且只被取走了一次 —— 一共 ${taken.length} 轮，` +
      `每轮最多两次堆操作（出堆 + 入堆），每次 O(log K)，所以是 O(N log K)。` +
      `结果链表是 ${merged}；开头那个哑结点只是锚点，返回 \`dummy.next\`。`,
    { done: true },
  )

  return steps
}

export default buildMergeKListsSteps
