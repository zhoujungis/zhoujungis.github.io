import { describe, expect, it } from 'vitest'

import { buildRotatedSearchSteps } from '../rotatedSearchSteps.js'

/** 线性参考：indexOf（-1 表示不存在）。 */
function refSearch(nums, target) {
  return nums.indexOf(target)
}

const CASES = [
  { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 },
  { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 },
  { nums: [4, 5, 6, 7, 0, 1, 2], target: 4 },
  { nums: [4, 5, 6, 7, 0, 1, 2], target: 2 },
  { nums: [1], target: 1 },
  { nums: [1], target: 0 },
  { nums: [3, 1], target: 1 },
  { nums: [3, 1], target: 3 },
  { nums: [1, 3], target: 3 },
  { nums: [5, 6, 7, 0, 1, 2, 4], target: 5 },
  { nums: [1, 2, 3, 4, 5], target: 3 },
]

function final(nums, target) {
  return buildRotatedSearchSteps({ nums, target }).at(-1)
}

describe('答案与线性参考解交叉验证', () => {
  it.each(CASES.map((c, i) => [JSON.stringify(c.nums), c.target, i]))(
    'case %d: %s t=%s',
    (_, __, i) => {
      const { nums, target } = CASES[i]
      expect(final(nums, target).foundIdx).toBe(refSearch(nums, target))
    },
  )

  it('官方例：target=0 → 下标 4；target=3 → -1', () => {
    expect(final([4, 5, 6, 7, 0, 1, 2], 0).foundIdx).toBe(4)
    expect(final([4, 5, 6, 7, 0, 1, 2], 3).foundIdx).toBe(-1)
  })
})

describe('有序半判断与值域判断（每帧的决策依据）', () => {
  it('left 有序 ⇔ nums[l] <= nums[mid]（帧 l = 收缩前 l0，正是判断依据）', () => {
    for (const { nums, target } of CASES) {
      for (const s of buildRotatedSearchSteps({ nums, target })) {
        if (s.ordered === 'left') expect(nums[s.l]).toBeLessThanOrEqual(s.midVal)
        if (s.ordered === 'right') expect(nums[s.l]).toBeGreaterThan(s.midVal)
      }
    }
  })

  it('进哪半与值域判断一致（left 半开区间 / right 半开区间，边界一开一闭）', () => {
    for (const { nums, target } of CASES) {
      for (const s of buildRotatedSearchSteps({ nums, target })) {
        if (!s.range) continue
        const inLeft = target >= s.range[0] && target < s.range[1]
        const inRight = target > s.range[0] && target <= s.range[1]
        if (s.ordered === 'left') {
          if (s.phase === 'goLeft' || (s.live && s.live[1] === s.mid - 1)) expect(inLeft).toBe(true)
          if (s.live && s.live[0] === s.mid + 1) expect(inLeft).toBe(false)
        } else if (s.ordered === 'right') {
          if (s.live && s.live[0] === s.mid + 1) expect(inRight).toBe(true)
          if (s.live && s.live[1] === s.mid - 1) expect(inRight).toBe(false)
        }
      }
    }
  })

  it('存活区间单调收缩，且 target（若存在）始终在存活区内（未 done 时）', () => {
    for (const { nums, target } of CASES) {
      const realIdx = refSearch(nums, target)
      let prevSize = Infinity
      for (const s of buildRotatedSearchSteps({ nums, target })) {
        const live = s.live ?? (s.l !== null ? [s.l, s.r] : null)
        if (!live) continue
        const size = live[1] - live[0] + 1
        expect(size).toBeLessThanOrEqual(prevSize)
        prevSize = size
        if (realIdx >= 0 && !s.done) {
          expect(realIdx).toBeGreaterThanOrEqual(live[0])
          expect(realIdx).toBeLessThanOrEqual(live[1])
        }
      }
    }
  })
})

describe('边界与保护', () => {
  it('不修改调用方传进来的数组', () => {
    const src = [4, 5, 6, 7, 0, 1, 2]
    buildRotatedSearchSteps({ nums: src, target: 0 })
    expect(src).toEqual([4, 5, 6, 7, 0, 1, 2])
  })

  it('空输入：单帧 done，foundIdx = -1', () => {
    const steps = buildRotatedSearchSteps({ nums: [], target: 5 })
    expect(steps).toHaveLength(1)
    expect(steps[0].foundIdx).toBe(-1)
  })

  it('主例（target=0 命中）4 probe + done；target 落在断崖两侧都能命中', () => {
    expect(buildRotatedSearchSteps({ nums: [4, 5, 6, 7, 0, 1, 2], target: 0 })).toHaveLength(5)
    // target=2 在第二段末端（值域右端点，闭区间边界）
    expect(final([4, 5, 6, 7, 0, 1, 2], 2).foundIdx).toBe(6)
    // target=4 是第一段左端点（值域左端点，闭区间边界）
    expect(final([4, 5, 6, 7, 0, 1, 2], 4).foundIdx).toBe(0)
  })
})
