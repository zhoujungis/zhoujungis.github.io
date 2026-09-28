import { describe, expect, it } from 'vitest'

import { buildBucketTopKSteps } from '../bucketTopKSteps.js'

// ── 独立参考解 ──────────────────────────────────────────────────────────────
/** 计数 + 排序。 */
function refBySort(nums, k) {
  const freq = new Map()
  for (const v of nums) freq.set(v, (freq.get(v) || 0) + 1)
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map((e) => e[0])
}

/** 小根堆（按频率，容量 k）—— 完全独立的一条路。 */
function refByHeap(nums, k) {
  const freq = new Map()
  for (const v of nums) freq.set(v, (freq.get(v) || 0) + 1)
  const heap = []
  const less = (a, b) => a[1] - b[1]
  const push = (item) => {
    heap.push(item)
    let i = heap.length - 1
    while (i > 0) {
      const p = (i - 1) >> 1
      if (less(heap[p], heap[i]) <= 0) break
      ;[heap[p], heap[i]] = [heap[i], heap[p]]
      i = p
    }
  }
  const pop = () => {
    const top = heap[0]
    const last = heap.pop()
    if (heap.length) {
      heap[0] = last
      let i = 0
      for (;;) {
        const l = 2 * i + 1
        const r = l + 1
        let m = i
        if (l < heap.length && less(heap[l], heap[m]) < 0) m = l
        if (r < heap.length && less(heap[r], heap[m]) < 0) m = r
        if (m === i) break
        ;[heap[m], heap[i]] = [heap[i], heap[m]]
        i = m
      }
    }
    return top
  }
  for (const e of freq.entries()) {
    push(e)
    if (heap.length > k) pop()
  }
  return heap.map((e) => e[0])
}

/** 规范化（题目保证答案唯一，这里按"频率降序、值升序"排列后比较）。 */
function norm(list, nums) {
  const freq = new Map()
  for (const v of nums) freq.set(v, (freq.get(v) || 0) + 1)
  return [...list].sort((a, b) => freq.get(b) - freq.get(a) || a - b).join(',')
}

const CASES = [
  { nums: [1, 1, 1, 2, 2, 3], k: 2 },
  { nums: [1], k: 1 },
  { nums: [4, 4, 4, 6, 6, 2, 2, 2, 7], k: 2 },
  { nums: [5, 5, 5], k: 1 },
  { nums: [1, 2], k: 2 },
  { nums: [3, 3, 3, 3], k: 1 },
  { nums: [-1, -1, 2, 2, 3], k: 2 },
  { nums: [7, 7, 7, 7, 7], k: 1 },
]

function final(nums, k) {
  const steps = buildBucketTopKSteps({ nums, k })
  return steps[steps.length - 1]
}

describe('答案与两个独立参考解交叉验证', () => {
  it.each(CASES.map((c) => [JSON.stringify(c.nums), c.k]))(
    '%s k=%s（状态机 / 计数排序 / 小根堆 三方一致）',
    (numsJson, k) => {
      const nums = JSON.parse(numsJson)
      const want = norm(refBySort(nums, k), nums)
      expect(norm(final(nums, k).ans, nums)).toBe(want)
      expect(norm(refByHeap(nums, k), nums)).toBe(want)
    },
  )

  it('官方例 1：[1,1,1,2,2,3] k=2 → [1, 2]', () => {
    expect(final([1, 1, 1, 2, 2, 3], 2).ans).toEqual([1, 2])
  })

  it('官方例 2：[1] k=1 → [1]', () => {
    expect(final([1], 1).ans).toEqual([1])
  })
})

describe('桶的自洽性（"频率即下标"是本解法的灵魂）', () => {
  it('收集阶段的桶里，每个值的频率必须等于桶下标', () => {
    for (const { nums, k } of CASES) {
      for (const s of buildBucketTopKSteps({ nums, k })) {
        if (s.phase !== 'collect' && s.phase !== 'done') continue
        const total = s.buckets.reduce((m, b) => m + b.length, 0)
        expect(total).toBe(new Set(nums).size)
        s.buckets.forEach((list, f) => {
          for (const v of list) {
            expect(s.freq[v]).toBe(f)
          }
        })
      }
    }
  })

  it('每个 distinct 值恰好进一个桶，freq 计数与暴力重数一致', () => {
    for (const { nums, k } of CASES) {
      const last = final(nums, k)
      for (const v of new Set(nums)) {
        const brute = nums.filter((x) => x === v).length
        expect(last.freq[v]).toBe(brute)
      }
    }
  })
})

describe('收集语义：从高频端往低频端', () => {
  it('任意一帧里 ans 都按频率降序（收集顺序）', () => {
    for (const { nums, k } of CASES) {
      for (const s of buildBucketTopKSteps({ nums, k })) {
        for (let x = 1; x < s.ans.length; x += 1) {
          expect(s.freq[s.ans[x - 1]]).toBeGreaterThanOrEqual(s.freq[s.ans[x]])
        }
      }
    }
  })

  it('ans 无重复、都是出现过的值、collected === ans.length', () => {
    for (const { nums, k } of CASES) {
      for (const s of buildBucketTopKSteps({ nums, k })) {
        expect(new Set(s.ans).size).toBe(s.ans.length)
        for (const v of s.ans) expect(s.freq[v]).toBeDefined()
        expect(s.collected).toBe(s.ans.length)
      }
    }
  })

  it('收满 k 个就停，答案长度恰好 k', () => {
    for (const { nums, k } of CASES) {
      expect(final(nums, k).ans).toHaveLength(k)
    }
  })
})

describe('边界与保护', () => {
  it('k 被 clamp 到 [1, distinct 数]：k 超大时返回全部 distinct 值', () => {
    // nums = [1,1,2,2]，distinct = {1, 2}，k=10 → clamp 后收满 2 个
    const steps = buildBucketTopKSteps({ nums: [1, 1, 2, 2], k: 10 })
    expect(steps.at(-1).ans.sort((a, b) => a - b)).toEqual([1, 2])
  })

  it('空数组：单帧 done，ans 为空', () => {
    const steps = buildBucketTopKSteps({ nums: [], k: 1 })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].ans).toEqual([])
  })

  it('不修改调用方传进来的数组', () => {
    const src = [1, 1, 1, 2, 2, 3]
    buildBucketTopKSteps({ nums: src, k: 2 })
    expect(src).toEqual([1, 1, 1, 2, 2, 3])
  })

  it('主例：13 帧（1 init + 3 count + 3 bucket + 5 collect + 1 done）', () => {
    const steps = buildBucketTopKSteps({ nums: [1, 1, 1, 2, 2, 3], k: 2 })
    expect(steps).toHaveLength(13)
    expect(steps.filter((s) => s.phase === 'count')).toHaveLength(3)
    expect(steps.filter((s) => s.phase === 'bucket')).toHaveLength(3)
    expect(steps.filter((s) => s.phase === 'collect')).toHaveLength(5)
  })
})
