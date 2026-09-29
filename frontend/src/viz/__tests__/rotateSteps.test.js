import { describe, expect, it } from 'vitest'

import { buildRotateSteps } from '../rotateSteps.js'

/** 切片参考解（先取模、特判 k=0）。 */
function refSlice(nums, k) {
  const n = nums.length
  if (n === 0) return []
  const kk = ((k % n) + n) % n
  if (kk === 0) return [...nums]
  return [...nums.slice(n - kk), ...nums.slice(0, n - kk)]
}

/** 逐位搬运参考解（完全独立的一条路）。 */
function refShift(nums, k) {
  const arr = [...nums]
  const n = arr.length
  if (n === 0) return []
  const kk = ((k % n) + n) % n
  for (let step = 0; step < kk; step += 1) {
    const last = arr[n - 1]
    for (let i = n - 1; i > 0; i -= 1) arr[i] = arr[i - 1]
    arr[0] = last
  }
  return arr
}

const CASES = [
  { nums: [1, 2, 3, 4, 5, 6, 7], k: 3 },
  { nums: [-1, -100, 3, 99], k: 2 },
  { nums: [1, 2], k: 5 },
  { nums: [1], k: 0 },
  { nums: [1], k: 100 },
  { nums: [1, 2, 3], k: 0 },
  { nums: [1, 2, 3], k: 3 },
  { nums: [1, 2, 3, 4], k: 1 },
  { nums: [1, 2, 3, 4, 5, 6], k: 2 },
  { nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], k: 4 },
]

function final(nums, k) {
  return buildRotateSteps({ nums, k }).at(-1)
}

describe('答案与两个独立参考解交叉验证', () => {
  it.each(CASES.map((c, i) => [JSON.stringify(c.nums), c.k, i]))(
    'case %d: %s k=%s',
    (_, __, i) => {
      const { nums, k } = CASES[i]
      const want = refSlice(nums, k)
      expect(final(nums, k).arr).toEqual(want)
      expect(refShift(nums, k)).toEqual(want)
    },
  )

  it('官方例：[1,2,3,4,5,6,7] k=3 → [5,6,7,1,2,3,4]', () => {
    expect(final([1, 2, 3, 4, 5, 6, 7], 3).arr).toEqual([5, 6, 7, 1, 2, 3, 4])
  })

  it('k 取模：k=5 配 n=2 等价于 k=1；k=100 配单元素 = 不变', () => {
    expect(final([1, 2], 5).arr).toEqual([2, 1])
    expect(final([1], 100).arr).toEqual([1])
  })
})

describe('语言坑：Python 切片法的 k=0 陷阱', () => {
  it('k % n === 0 时数组不变（nums[-0:] 是整个数组的坑由取模 + 特判规避）', () => {
    expect(final([1, 2, 3], 0).arr).toEqual([1, 2, 3])
    expect(final([1, 2, 3], 3).arr).toEqual([1, 2, 3])
    expect(final([1], 0).arr).toEqual([1])
  })
})

describe('帧内自洽（三次翻转的每一步）', () => {
  it('交换帧：i/j 落在 flipRange 内且 i < j', () => {
    for (const { nums, k } of CASES) {
      for (const s of buildRotateSteps({ nums, k })) {
        if (s.phase !== 'flip' || s.i === null) continue
        expect(s.i).toBeGreaterThanOrEqual(s.flipRange[0])
        expect(s.j).toBeLessThanOrEqual(s.flipRange[1])
        expect(s.i).toBeLessThan(s.j)
      }
    }
  })

  it('每帧 swap 后：i/j 两格的值确实互换，其余位置不变', () => {
    const steps = buildRotateSteps({ nums: [1, 2, 3, 4, 5, 6, 7], k: 3 })
    for (let x = 1; x < steps.length - 1; x += 1) {
      const prev = steps[x - 1]
      const cur = steps[x]
      if (cur.phase !== 'flip' || cur.i === null) continue
      for (let idx = 0; idx < cur.n; idx += 1) {
        const expected =
          idx === cur.i ? prev.arr[cur.j] : idx === cur.j ? prev.arr[cur.i] : prev.arr[idx]
        expect(cur.arr[idx]).toBe(expected)
      }
    }
  })

  it('三次翻转的区间依次是 [0,n-1] / [0,k-1] / [k,n-1]', () => {
    const steps = buildRotateSteps({ nums: [1, 2, 3, 4, 5, 6, 7], k: 3 })
    const ranges = new Map()
    for (const s of steps) {
      if (s.round > 0 && s.flipRange) ranges.set(s.round, s.flipRange)
    }
    expect(ranges.get(1)).toEqual([0, 6])
    expect(ranges.get(2)).toEqual([0, 2])
    expect(ranges.get(3)).toEqual([3, 6])
  })

  it('done 帧保留真实值且带全渲染字段（arr / round / roundName）', () => {
    const done = final([1, 2, 3, 4, 5, 6, 7], 3)
    expect(done.arr).toEqual([5, 6, 7, 1, 2, 3, 4])
    expect(done.round).toBe(3)
    expect(done.roundName).toBe('完成')
    expect(done.k).toBe(3)
  })
})

describe('边界与保护', () => {
  it('不修改调用方传进来的数组', () => {
    const src = [1, 2, 3, 4, 5, 6, 7]
    buildRotateSteps({ nums: src, k: 3 })
    expect(src).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it('空输入：单帧 done', () => {
    const steps = buildRotateSteps({ nums: [], k: 3 })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
  })

  it('主例：8 帧（init + 6 交换 + done）', () => {
    const steps = buildRotateSteps({ nums: [1, 2, 3, 4, 5, 6, 7], k: 3 })
    expect(steps).toHaveLength(8)
    expect(steps.filter((s) => s.phase === 'flip' && s.i !== null)).toHaveLength(6)
  })
})
