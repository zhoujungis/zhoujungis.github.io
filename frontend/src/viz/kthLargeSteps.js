/**
 * kthLargeSteps.js — 「重复元素数组找第 K 大」的状态机：size-k 最小堆逐元素扫描。
 *
 * 本题的口径陷阱（文章第一节）：
 *   有重复元素时「第 10 大」有两种解释，答案能差一倍。
 *   - 不去重：降序排序后第 K 个（= 下标 K-1）。主例答案 16。
 *   - 去重：distinct 值降序第 K 个。主例答案 8。
 *   所以 dedupe 是一个必须显式声明的开关，本文两种都实现、都做成动画。
 *
 * 算法：维护一个 size-k 的**最小堆**（堆顶 = 当前第 K 大）。
 *   - 堆没满：直接入堆，然后向上调整（siftUp）
 *   - 堆已满且 v > 堆顶：替换堆顶，向下调整（siftDown）
 *   - 否则：这个数连前 K 大都进不去，直接丢掉
 *   每个元素最多进出堆一次，均摊 O(n log k)；k 固定时就是 O(n)，空间 O(k)。
 *
 * 去重口径：额外维护一个「堆里有哪些值」的集合，
 *   值已在堆里 -> 按重复元素丢弃（否则 v > 堆顶时会把堆换成两个相同的值）。
 *
 * 通用坑：A / V / Z。
 */

const DEFAULT_NUMS = [23, 7, 45, 12, 45, 8, 33, 12, 19, 5, 45, 27, 12, 9, 33, 16, 41, 3]
const DEFAULT_K = 10

function asNums(value) {
  if (!Array.isArray(value) || value.length === 0) return DEFAULT_NUMS.slice()
  const nums = value.map((v) => Number(v))
  const ok = nums.every((v) => Number.isFinite(v)) && nums.length <= 24
  return ok ? nums : DEFAULT_NUMS.slice()
}

/**
 * 构造帧序列：init + N 个元素帧 + done。
 * @param {{ nums?: number[], k?: number, dedupe?: boolean }} [options]
 */
export function buildKthLargeSteps(options = {}) {
  const nums = asNums(options.nums)
  const k = Number.isInteger(options.k) && options.k > 0 && options.k <= nums.length
    ? options.k
    : Math.min(DEFAULT_K, nums.length)
  const dedupe = options.dedupe === true
  const n = nums.length

  const heap = [] // 层序数组，最小堆
  const inHeap = new Set() // 堆里当前有哪些值（去重口径判重用）
  const seenAll = new Set() // 出现过的所有值（算真实 distinct 数）
  const rejected = []
  const steps = []

  let ctx = { idx: -1, val: null, action: null }
  const snap = (phase, extra) => {
    steps.push({
      phase,
      idx: ctx.idx,
      val: ctx.val,
      action: ctx.action,
      heap: heap.slice(),
      siftPath: [],
      rejected: rejected.slice(),
      rejectedCount: rejected.length,
      nums: nums.slice(),
      n,
      k,
      dedupe,
      distinct: seenAll.size,
      // 只有堆满时才谈「第 K 大」；堆没满说明 distinct 值不够，本题无解
      solvable: heap.length === k,
      answer: heap.length === k ? heap[0] : null,
      done: false,
      desc: '',
      ...extra,
    })
  }

  // ---- 最小堆的两个调整，各自记录走过的下标（渲染层用来高亮 sift 路径） ----
  const siftUp = (start) => {
    let i = start
    const path = [i]
    while (i > 0) {
      const p = (i - 1) >> 1
      if (heap[p] <= heap[i]) break
      const t = heap[p]
      heap[p] = heap[i]
      heap[i] = t
      i = p
      path.push(i)
    }
    return path
  }

  const siftDown = (start) => {
    let i = start
    const path = [i]
    for (;;) {
      const l = 2 * i + 1
      const r = l + 1
      let m = i
      if (l < heap.length && heap[l] < heap[m]) m = l
      if (r < heap.length && heap[r] < heap[m]) m = r
      if (m === i) break
      const t = heap[m]
      heap[m] = heap[i]
      heap[i] = t
      i = m
      path.push(i)
    }
    return path
  }

  snap('init', {
    desc:
      `${n} 个元素里找第 ${k} 大${dedupe ? '（去重口径）' : '（不去重口径）'}。` +
      `做法是维护一个只有 ${k} 个位置的最小堆：堆顶永远是「当前第 ${k} 大」。` +
      `比堆顶小的直接丢，比堆顶大的挤掉堆顶再往下调整。`,
  })

  for (let i = 0; i < n; i += 1) {
    const v = nums[i]
    ctx = { idx: i, val: v }
    seenAll.add(v)

    if (dedupe && inHeap.has(v)) {
      ctx.action = 'dup'
      rejected.push(v)
      snap('reject', {
        desc:
          `${v} 已经在堆里了 —— 去重口径下重复值只算一次，直接丢弃。` +
          `这也是为什么去重版要额外记一个「堆里有哪些值」的集合：` +
          `只靠「大于堆顶」判断，会把堆顶换成两个相同的值。`,
      })
      continue
    }

    if (heap.length < k) {
      ctx.action = 'fill'
      heap.push(v)
      inHeap.add(v)
      const path = siftUp(heap.length - 1)
      snap('fill', {
        siftPath: path,
        desc:
          `堆还没满（${heap.length}/${k}），${v} 直接入堆，向上调整到位置 ${path[path.length - 1]}。` +
          `当前堆顶 = ${heap[0]}。`,
      })
      continue
    }

    if (v > heap[0]) {
      ctx.action = 'accept'
      inHeap.delete(heap[0])
      inHeap.add(v)
      const kicked = heap[0]
      heap[0] = v
      const path = siftDown(0)
      snap('accept', {
        siftPath: path,
        desc:
          `${v} > 堆顶 ${kicked} —— 挤掉它，${v} 坐到堆顶后向下调整到位置 ${path[path.length - 1]}。` +
          `新堆顶 = ${heap[0]}（这就是新的第 ${k} 大）。`,
      })
      continue
    }

    ctx.action = 'reject'
    rejected.push(v)
    snap('reject', {
      desc: `${v} <= 堆顶 ${heap[0]} —— 连前 ${k} 大都进不去，直接丢掉，堆不动。`,
    })
  }

  const finalHeap = heap.slice().sort((a, b) => a - b)
  const solvable = heap.length === k
  snap('done', {
    action: null,
    answer: solvable ? heap[0] : null,
    finalHeap,
    desc: solvable
      ? `扫完 ${n} 个元素，堆里留下最大的 ${k} 个${dedupe ? '（去重后）' : ''}：` +
        `(${finalHeap.slice().reverse().join(', ')})。堆顶 ${heap[0]} 就是第 ${k} 大。` +
        (dedupe
          ? `同一组数据按不去重口径算是另一个数 —— 差别全在口径。`
          : `改回去重口径，同一组数据的答案会变小 —— 见第二个动画。`) +
        ` 时间 O(n log ${k})、空间 O(${k})。`
      : `扫完 ${n} 个元素，堆里只有 ${heap.length} 个值，凑不齐 ${k} 个` +
        `${dedupe ? `（全体只有 ${seenAll.size} 个不同值）` : ''} —— 本题无解，应抛异常。`,
  })

  return steps
}
