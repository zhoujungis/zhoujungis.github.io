import { describe, expect, it } from 'vitest'

import { buildQuickSelectSteps } from '../quickSelectSteps.js'

// ── 独立参考解 ──────────────────────────────────────────────────────────────
/** 排序后取升序第 n-k 位。 */
function refBySort(nums, k) {
  const s = [...nums].sort((a, b) => a - b)
  return s[s.length - k]
}

/** 小根堆（容量 k）—— 完全独立的一条路。 */
function refByHeap(nums, k) {
  const heap = []
  const push = (v) => {
    heap.push(v)
    let i = heap.length - 1
    while (i > 0) {
      const p = (i - 1) >> 1
      if (heap[p] <= heap[i]) break
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
        if (l < heap.length && heap[l] < heap[m]) m = l
        if (r < heap.length && heap[r] < heap[m]) m = r
        if (m === i) break
        ;[heap[m], heap[i]] = [heap[i], heap[m]]
        i = m
      }
    }
    return top
  }
  for (const v of nums) {
    push(v)
    if (heap.length > k) pop()
  }
  return heap[0]
}

const DEMO = [3, 2, 1, 5, 6, 4]

const CASES = [
  { nums: [3, 2, 1, 5, 6, 4], k: 2, want: 5 },
  { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4, want: 4 },
  { nums: [1], k: 1, want: 1 },
  { nums: [5, 5, 5, 5], k: 2, want: 5 },
  { nums: [1, 2, 3, 4, 5], k: 1, want: 5 },
  { nums: [1, 2, 3, 4, 5], k: 5, want: 1 },
  { nums: [5, 4, 3, 2, 1], k: 1, want: 5 },
  { nums: [5, 4, 3, 2, 1], k: 5, want: 1 },
  { nums: [-1, -2, -3, -4], k: 2, want: -2 },
  { nums: [2, 1], k: 1, want: 2 },
  { nums: [2, 1], k: 2, want: 1 },
  { nums: [7, 6, 5, 4, 3, 2, 1], k: 4, want: 4 },
  { nums: [3, 3, 3, 1, 1, 2, 2], k: 3, want: 3 },
  { nums: [0, 0, 0, 0], k: 1, want: 0 },
  { nums: [10, -10, 0, 5, -5], k: 3, want: 0 },
  { nums: [1, 3, 2, 3, 4, 3], k: 2, want: 3 },
  { nums: [2, 2, 2, 2, 2, 2], k: 6, want: 2 },
]

function final(nums, k, extra = {}) {
  const steps = buildQuickSelectSteps({ nums, k, ...extra })
  return steps[steps.length - 1]
}

describe('答案与两个独立参考解交叉验证', () => {
  it.each(CASES.map((c) => [JSON.stringify(c.nums), c.k, c.want]))(
    '%s k=%d → %s（状态机 / 排序 / 小根堆 三方一致）',
    (numsJson, k, want) => {
      const nums = JSON.parse(numsJson)
      expect(final(nums, k).found).toBe(want)
      expect(refBySort(nums, k)).toBe(want)
      expect(refByHeap(nums, k)).toBe(want)
    },
  )

  it('random pivot 策略同样得到正确答案', () => {
    for (const { nums, k, want } of CASES) {
      expect(final(nums, k, { pivot: 'random' }).found).toBe(want)
    }
  })
})

describe('语义：第 k 大是「排序后的第 k 个位置」，不是「第 k 个不同的值」', () => {
  it('官方例 2 是这条语义的试金石：[3,2,3,1,2,4,5,5,6] k=4 → 4', () => {
    // 降序 [6,5,5,4,3,3,2,2,1] 第 4 个 = 4；
    // 若按「第 4 个不同值」算是 3 —— 题目要的是前者。
    expect(final([3, 2, 3, 1, 2, 4, 5, 5, 6], 4).found).toBe(4)
    expect(final([3, 2, 3, 1, 2, 4, 5, 5, 6], 4).found).not.toBe(3)
  })

  it('重复值各占各的位置：[5,5,5,5] k=2 → 5', () => {
    expect(final([5, 5, 5, 5], 2).found).toBe(5)
  })
})

describe('索引换算：target = n - k', () => {
  it('每一帧的 target 都恒等于 n - k（写成 k-1 就变成第 k 小了）', () => {
    for (const { nums, k } of CASES) {
      for (const s of buildQuickSelectSteps({ nums, k })) {
        expect(s.target).toBe(s.n - s.k)
      }
    }
  })

  it('主例：n=6, k=2 → target=4', () => {
    expect(buildQuickSelectSteps({ nums: DEMO, k: 2 })[0].target).toBe(4)
  })
})

describe('分区正确性（place / narrow 帧）', () => {
  it('枢轴左侧全 <= pivot，右侧全 > pivot —— 这是"位置即排名"的根据', () => {
    for (const { nums, k } of CASES) {
      for (const s of buildQuickSelectSteps({ nums, k })) {
        if (s.phase !== 'place' && s.phase !== 'narrow') continue
        if (s.pivotIdx === null || s.pivotValue === null) continue
        for (let x = s.left; x < s.pivotIdx; x += 1) {
          expect(s.arr[x]).toBeLessThanOrEqual(s.pivotValue)
        }
        for (let x = s.pivotIdx + 1; x <= s.right; x += 1) {
          expect(s.arr[x]).toBeGreaterThan(s.pivotValue)
        }
      }
    }
  })

  it('place / found 帧：pivotIdx 落在 [left, right] 内（narrow 帧不算 —— 收缩后区间本来就该不含旧枢轴）', () => {
    for (const { nums, k } of CASES) {
      for (const s of buildQuickSelectSteps({ nums, k })) {
        if (s.phase !== 'place' && s.phase !== 'found') continue
        expect(s.pivotIdx).toBeGreaterThanOrEqual(s.left)
        expect(s.pivotIdx).toBeLessThanOrEqual(s.right)
      }
    }
  })

  it('narrow 帧：收缩方向正确（pivotIdx < target 去右边，反之去左边）', () => {
    for (const { nums, k } of CASES) {
      const steps = buildQuickSelectSteps({ nums, k })
      for (let x = 0; x < steps.length - 1; x += 1) {
        const s = steps[x]
        const next = steps[x + 1]
        if (s.phase !== 'narrow') continue
        if (s.pivotIdx < s.target) {
          expect(next.left).toBe(s.pivotIdx + 1)
          expect(next.right).toBe(s.right)
        } else {
          expect(next.right).toBe(s.pivotIdx - 1)
          expect(next.left).toBe(s.left)
        }
      }
    }
  })

  it('搜索区间单调不扩大，且目标位始终留在区间内（未找到时）', () => {
    for (const { nums, k } of CASES) {
      let prevSpan = Infinity
      for (const s of buildQuickSelectSteps({ nums, k })) {
        const span = s.right - s.left + 1
        expect(span).toBeLessThanOrEqual(prevSpan)
        prevSpan = span
        expect(s.left).toBeGreaterThanOrEqual(0)
        expect(s.right).toBeLessThan(s.n)
        if (s.found === null && s.phase !== 'init') {
          expect(s.target).toBeGreaterThanOrEqual(s.left)
          expect(s.target).toBeLessThanOrEqual(s.right)
        }
      }
    }
  })
})

describe('数组完整性', () => {
  it('每一帧的数组都是原数组的一个排列（不丢不增）', () => {
    for (const { nums } of CASES) {
      const sorted0 = [...nums].sort((a, b) => a - b).join(',')
      for (const s of buildQuickSelectSteps({ nums })) {
        expect(
          [...s.arr]
            .sort((a, b) => a - b)
            .join(','),
        ).toBe(sorted0)
      }
    }
  })

  it('不修改调用方传进来的数组', () => {
    const src = [...DEMO]
    buildQuickSelectSteps({ nums: src, k: 2 })
    expect(src).toEqual(DEMO)
  })
})

describe('收尾帧（found / done）', () => {
  it('foundIdx === target，found === 排序数组的第 target 位', () => {
    for (const { nums, k } of CASES) {
      const last = final(nums, k)
      const sorted = [...nums].sort((a, b) => a - b)
      expect(last.foundIdx).toBe(nums.length - k)
      expect(last.found).toBe(sorted[nums.length - k])
    }
  })

  it('done 帧保留语义字段的真实值（foundIdx / left / right 与 found 帧一致）', () => {
    for (const { nums, k } of CASES) {
      const steps = buildQuickSelectSteps({ nums, k })
      const found = steps.find((s) => s.phase === 'found')
      const done = steps[steps.length - 1]
      if (!found) continue
      expect(done.foundIdx).toBe(found.foundIdx)
      expect(done.found).toBe(found.found)
      expect(done.arr).toEqual(found.arr)
    }
  })

  it('主例：2 轮分区、14 帧，答案 5', () => {
    const steps = buildQuickSelectSteps({ nums: DEMO, k: 2 })
    expect(steps).toHaveLength(14)
    expect(steps.filter((s) => s.phase === 'pick')).toHaveLength(2)
    expect(steps.at(-1).found).toBe(5)
  })
})

describe('退化情形（文章要用）', () => {
  it('升序数组 + pivot=last + k=n：每轮只砍 1 个，n=6 要 5 轮 —— O(n²) 的样子', () => {
    const nums = [1, 2, 3, 4, 5, 6]
    const steps = buildQuickSelectSteps({ nums, k: 6 })
    expect(steps.filter((s) => s.phase === 'pick')).toHaveLength(5)
    expect(steps.at(-1).found).toBe(1)
    // 同样输入换 random pivot：2 轮搞定
    const rnd = buildQuickSelectSteps({ nums, k: 6, pivot: 'random' })
    expect(rnd.filter((s) => s.phase === 'pick').length).toBeLessThan(5)
    expect(rnd.at(-1).found).toBe(1)
  })

  it('全相同元素 + k=n 也是每轮砍 1 个（Lomuto 的另一个最坏情况）', () => {
    const nums = [5, 5, 5, 5, 5, 5]
    const steps = buildQuickSelectSteps({ nums, k: 6 })
    expect(steps.filter((s) => s.phase === 'pick')).toHaveLength(5)
    expect(steps.at(-1).found).toBe(5)
  })
})

describe('边界与保护', () => {
  it('k 被 clamp 到 [1, n]：k=0 按 1 算，k 超大按 n 算', () => {
    expect(final(DEMO, 0).found).toBe(6)
    expect(final(DEMO, 100).found).toBe(1)
  })

  it('空数组：单帧 done，found = null', () => {
    const steps = buildQuickSelectSteps({ nums: [], k: 1 })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].found).toBeNull()
  })

  it('maxSteps 截断不会死循环，一定以 done 收尾', () => {
    const steps = buildQuickSelectSteps({ nums: DEMO, k: 2, maxSteps: 2 })
    expect(steps.at(-1).phase).toBe('done')
    expect(steps.length).toBeLessThan(14)
  })
})
