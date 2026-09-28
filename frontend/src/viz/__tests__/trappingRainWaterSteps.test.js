import { describe, expect, it } from 'vitest'
import { buildTrappingRainWaterSteps } from '../trappingRainWaterSteps.js'

const DEMO = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] // 官方例 1 → 6

const final = (height, options = {}) => buildTrappingRainWaterSteps({ height, ...options }).at(-1)

/** 独立参考解：按定义暴力算 —— 每个位置左右各扫一遍取 min。 */
function brute(height) {
  const n = height.length
  const water = new Array(n).fill(0)
  let total = 0
  for (let i = 0; i < n; i += 1) {
    let lm = 0
    let rm = 0
    for (let j = 0; j <= i; j += 1) lm = Math.max(lm, height[j])
    for (let j = i; j < n; j += 1) rm = Math.max(rm, height[j])
    water[i] = Math.max(0, Math.min(lm, rm) - height[i])
    total += water[i]
  }
  return { total, water }
}

const INPUTS = [
  DEMO,
  [4, 2, 0, 3, 2, 5], // 官方例 2 → 9
  [],
  [1],
  [1, 2],
  [2, 0, 2],
  [3, 0, 0, 2],
  [2, 0, 0, 3],
  [5, 4, 1, 2],
  [5, 0, 1],
  [1, 0, 5],
  [0, 0, 0, 0],
  [4, 4, 4, 4],
  [1, 2, 3, 4, 5],
  [5, 4, 3, 2, 1],
  [0, 1, 2, 0, 3],
  [7, 0, 0, 3],
  [0, 7, 0, 3],
  [3, 2, 1, 0, 4],
  [4, 0, 0, 0, 3],
  [1, 0, 2, 0, 3],
  [10, 0, 5, 0, 1],
  [2, 0, 2, 0, 2],
  [6, 0, 0, 0, 0, 0, 6],
]

describe('buildTrappingRainWaterSteps — 答案正确性', () => {
  it('官方例 1 [0,1,0,2,1,0,1,3,2,1,2,1] → 6（⚠️ 不是 9，9 是官方例 2 的答案）', () => {
    expect(final(DEMO).total).toBe(6)
  })

  it('官方例 2 [4,2,0,3,2,5] → 9', () => {
    expect(final([4, 2, 0, 3, 2, 5]).total).toBe(9)
  })

  it('每一组输入的总水量和逐格水量都与暴力参考解一致', () => {
    for (const height of INPUTS) {
      const got = final(height)
      const bf = brute(height)
      expect(got.total).toBe(bf.total)
      expect(got.water).toEqual(bf.water)
    }
  })

  it('对称的谷 [2,0,2] → 2；不对称的谷 [5,0,1] → 1（短板在右边）', () => {
    expect(final([2, 0, 2]).total).toBe(2)
    expect(final([5, 0, 1]).total).toBe(1)
  })

  it('[3,0,0,2] → 4（短板在右边 2，不是左边的 3）', () => {
    // 每格水 = min(左最高, 右最高) - 自身 = min(3,2) - 0 = 2，两格共 4
    expect(final([3, 0, 0, 2]).total).toBe(4)
    expect(final([3, 0, 0, 2]).water).toEqual([0, 2, 2, 0])
  })
})

describe('边界情况', () => {
  it('空数组：只有一帧 done，答案 0', () => {
    const steps = buildTrappingRainWaterSteps({ height: [] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].total).toBe(0)
  })

  it('1 根 / 2 根柱子：围不出凹槽，答案 0', () => {
    for (const height of [[1], [1, 2], [5, 5]]) {
      const steps = buildTrappingRainWaterSteps({ height })
      expect(steps).toHaveLength(1)
      expect(steps[0].total).toBe(0)
    }
  })

  it('全平 / 全升 / 全降：都接不住水', () => {
    for (const height of [[4, 4, 4, 4], [1, 2, 3, 4, 5], [5, 4, 3, 2, 1]]) {
      expect(final(height).total).toBe(0)
    }
  })

  it('依赖默认参数时不崩，且默认例就是官方例 1', () => {
    const steps = buildTrappingRainWaterSteps()
    expect(steps[0].height).toEqual(DEMO)
    expect(steps.at(-1).total).toBe(6)
  })

  it('合法输入（n >= 3）首帧 init、末帧 done', () => {
    for (const height of INPUTS) {
      if (height.length < 3) continue
      const steps = buildTrappingRainWaterSteps({ height })
      expect(steps[0].phase).toBe('init')
      expect(steps.at(-1).phase).toBe('done')
      expect(steps.at(-1).done).toBe(true)
    }
  })
})

describe('不变量（每一帧都要成立）', () => {
  it('l 单调不减、r 单调不增（两根指针只往中间走）', () => {
    for (const height of INPUTS) {
      const steps = buildTrappingRainWaterSteps({ height })
      for (let k = 1; k < steps.length; k += 1) {
        expect(steps[k].l).toBeGreaterThanOrEqual(steps[k - 1].l)
        expect(steps[k].r).toBeLessThanOrEqual(steps[k - 1].r)
      }
    }
  })

  it('leftMax / rightMax 单调不减（历史最大值只增）', () => {
    for (const height of INPUTS) {
      const steps = buildTrappingRainWaterSteps({ height })
      for (let k = 1; k < steps.length; k += 1) {
        expect(steps[k].leftMax).toBeGreaterThanOrEqual(steps[k - 1].leftMax)
        expect(steps[k].rightMax).toBeGreaterThanOrEqual(steps[k - 1].rightMax)
      }
    }
  })

  it('total 单调不减（水只越接越多）', () => {
    for (const height of INPUTS) {
      const steps = buildTrappingRainWaterSteps({ height })
      for (let k = 1; k < steps.length; k += 1) {
        expect(steps[k].total).toBeGreaterThanOrEqual(steps[k - 1].total)
      }
    }
  })

  it('推进帧里 l < r；done 帧保留指针相遇的真实值（仅 n >= 3）', () => {
    for (const height of INPUTS) {
      for (const s of buildTrappingRainWaterSteps({ height })) {
        if (s.phase === 'init') continue
        if (s.phase === 'done') {
          // ⚠️ 只有 n >= 3 时指针才会真正"相遇"；n < 3 的输入只有一帧 done，
          // 指针保持初始值（空数组时 r = -1），不能套"相遇"的断言。
          if (height.length >= 3) expect(s.l).toBe(s.r)
          continue
        }
        expect(s.l).toBeLessThan(s.r)
      }
    }
  })

  it('settle 帧的 gained = 新 leftMax/rightMax - 该格高度（新高时恰好为 0）', () => {
    for (const height of INPUTS) {
      const steps = buildTrappingRainWaterSteps({ height })
      for (let k = 1; k < steps.length; k += 1) {
        const s = steps[k]
        if (s.phase === 'settle-l') {
          expect(s.leftMax).toBe(Math.max(steps[k - 1].leftMax, height[s.idx]))
          expect(s.gained).toBe(s.leftMax - height[s.idx])
          expect(s.gained).toBeGreaterThanOrEqual(0)
        } else if (s.phase === 'settle-r') {
          expect(s.rightMax).toBe(Math.max(steps[k - 1].rightMax, height[s.idx]))
          expect(s.gained).toBe(s.rightMax - height[s.idx])
          expect(s.gained).toBeGreaterThanOrEqual(0)
        }
      }
    }
  })

  it('每帧 water[k] 的值都不超过理论水位差，且 total === sum(water)', () => {
    for (const height of INPUTS) {
      const bf = brute(height)
      for (const s of buildTrappingRainWaterSteps({ height })) {
        let sum = 0
        for (let k = 0; k < height.length; k += 1) {
          expect(s.water[k]).toBeLessThanOrEqual(bf.water[k])
          sum += s.water[k]
        }
        expect(sum).toBe(s.total)
      }
    }
  })

  it('结算的侧别与判据一致：height[l] < height[r] 结算 l，否则结算 r', () => {
    for (const height of INPUTS) {
      const steps = buildTrappingRainWaterSteps({ height })
      for (const s of steps) {
        if (s.phase === 'settle-l') {
          expect(height[s.l]).toBeLessThan(height[s.r])
          expect(s.idx).toBe(s.l)
        } else if (s.phase === 'settle-r') {
          expect(height[s.l]).toBeGreaterThanOrEqual(height[s.r])
          expect(s.idx).toBe(s.r)
        }
      }
    }
  })

  it('每帧的 desc 都是非空字符串', () => {
    for (const height of INPUTS) {
      for (const s of buildTrappingRainWaterSteps({ height })) {
        expect(typeof s.desc).toBe('string')
        expect(s.desc.length).toBeGreaterThan(10)
      }
    }
  })

  it('不修改调用方传进来的数组', () => {
    const input = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
    const copy = [...input]
    buildTrappingRainWaterSteps({ height: input })
    expect(input).toEqual(copy)
  })
})

describe('maxSteps 保护', () => {
  it('截断时依然以 done 收尾；帧数上限 = init + maxSteps + done', () => {
    const steps = buildTrappingRainWaterSteps({ height: DEMO, maxSteps: 5 })
    expect(steps.at(-1).phase).toBe('done')
    expect(steps.length).toBeLessThanOrEqual(5 + 2)
    expect(steps.length).toBeLessThan(buildTrappingRainWaterSteps({ height: DEMO }).length)
  })

  it('maxSteps = 0 时只剩 init 和 done', () => {
    const steps = buildTrappingRainWaterSteps({ height: DEMO, maxSteps: 0 })
    expect(steps.map((s) => s.phase)).toEqual(['init', 'done'])
    expect(steps[1].total).toBe(0)
  })
})
