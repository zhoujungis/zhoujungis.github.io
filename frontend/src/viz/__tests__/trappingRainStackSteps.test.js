import { describe, expect, it } from 'vitest'
import { buildTrappingRainStackSteps } from '../trappingRainStackSteps.js'

const DEMO = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] // 官方例 1 → 6

const final = (height, options = {}) => buildTrappingRainStackSteps({ height, ...options }).at(-1)

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
  [4, 2, 0, 3, 2, 5],
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

describe('buildTrappingRainStackSteps — 答案正确性', () => {
  it('官方例 1 → 6（和双指针解法一致 —— 它们只是切法不同）', () => {
    expect(final(DEMO).total).toBe(6)
  })

  it('官方例 2 → 9', () => {
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
})

describe('栈的性质', () => {
  it('任何一帧的栈内高度都单调递减', () => {
    for (const height of INPUTS) {
      for (const s of buildTrappingRainStackSteps({ height })) {
        for (let k = 1; k < s.stack.length; k += 1) {
          expect(height[s.stack[k]]).toBeLessThanOrEqual(height[s.stack[k - 1]])
        }
      }
    }
  })

  it('每个下标恰好入栈一次，且按 0..n-1 的顺序入栈', () => {
    for (const height of INPUTS) {
      if (height.length < 3) continue
      const pushed = buildTrappingRainStackSteps({ height })
        .filter((s) => s.phase === 'push')
        .map((s) => s.i)
      expect(pushed).toEqual([...Array(height.length).keys()])
    }
  })

  it('push 帧的栈一定包含当前下标 i（且在栈顶）', () => {
    for (const height of INPUTS) {
      for (const s of buildTrappingRainStackSteps({ height })) {
        if (s.phase !== 'push') continue
        expect(s.stack.at(-1)).toBe(s.i)
      }
    }
  })
})

describe('settle 帧：一次结算一层的公式', () => {
  it('width = 右边界 - 左边界 - 1', () => {
    for (const height of INPUTS) {
      for (const s of buildTrappingRainStackSteps({ height })) {
        if (s.phase !== 'settle' || s.leftBound === null) continue
        expect(s.width).toBe(s.rightBound - s.leftBound - 1)
      }
    }
  })

  it('level = min(左边界高, 右边界高)，layerH = level - 槽底高（木桶原理）', () => {
    for (const height of INPUTS) {
      for (const s of buildTrappingRainStackSteps({ height })) {
        if (s.phase !== 'settle' || s.leftBound === null) continue
        expect(s.level).toBe(Math.min(height[s.leftBound], height[s.rightBound]))
        expect(s.layerH).toBe(s.level - height[s.bottom])
      }
    }
  })

  it('gained = width × layerH，且逐格分配之和与它一致', () => {
    for (const height of INPUTS) {
      const steps = buildTrappingRainStackSteps({ height })
      for (let k = 1; k < steps.length; k += 1) {
        const s = steps[k]
        if (s.phase !== 'settle' || s.leftBound === null) continue
        expect(s.gained).toBe(s.width * s.layerH)
        // 逐格水量的增量之和 == 本帧 gained
        const delta = s.water.reduce((acc, v, idx) => acc + v - steps[k - 1].water[idx], 0)
        expect(delta).toBe(s.gained)
      }
    }
  })

  it('"栈空弹出"的 settle 帧：gained = 0，leftBound 为 null', () => {
    for (const height of INPUTS) {
      for (const s of buildTrappingRainStackSteps({ height })) {
        if (s.phase !== 'settle' || s.leftBound !== null) continue
        expect(s.gained).toBe(0)
        expect(s.bottom).not.toBeNull()
      }
    }
  })

  it('total 单调不减，且 done 帧的 total === sum(water)', () => {
    for (const height of INPUTS) {
      const steps = buildTrappingRainStackSteps({ height })
      for (let k = 1; k < steps.length; k += 1) {
        expect(steps[k].total).toBeGreaterThanOrEqual(steps[k - 1].total)
      }
      const last = steps.at(-1)
      expect(last.total).toBe(last.water.reduce((a, b) => a + b, 0))
    }
  })
})

describe('官方例的关键帧：下标 5 的水是分两次加上的', () => {
  it('i=6 时加 1 层，i=7 时再加 1 层 —— "按层累加"最硬的证据', () => {
    const steps = buildTrappingRainStackSteps({ height: DEMO })
    // 直接盯 water[5] 这一格：它在整个推演里恰好变化两次，
    // 且都发生在"包含下标 5 的凹槽"被结算的那一帧。
    // （i=7 有两次结算：第一次 layerH=0 没加水，第二次才真的把 water[5] 顶到 2。）
    const changes = []
    for (let k = 1; k < steps.length; k += 1) {
      if (steps[k].water[5] !== steps[k - 1].water[5]) {
        changes.push({ i: steps[k].i, from: steps[k - 1].water[5], to: steps[k].water[5] })
      }
    }
    expect(changes).toEqual([
      { i: 6, from: 0, to: 1 },
      { i: 7, from: 1, to: 2 },
    ])
    expect(final(DEMO).water[5]).toBe(2)
  })
})

describe('边界情况', () => {
  it('空数组：只有一帧 done，答案 0', () => {
    const steps = buildTrappingRainStackSteps({ height: [] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].total).toBe(0)
  })

  it('1 根 / 2 根柱子：只有一帧 done', () => {
    for (const height of [[1], [1, 2]]) {
      const steps = buildTrappingRainStackSteps({ height })
      expect(steps).toHaveLength(1)
      expect(steps[0].total).toBe(0)
    }
  })

  it('合法输入首帧 init、末帧 done', () => {
    for (const height of INPUTS) {
      if (height.length < 3) continue
      const steps = buildTrappingRainStackSteps({ height })
      expect(steps[0].phase).toBe('init')
      expect(steps.at(-1).phase).toBe('done')
    }
  })

  it('每帧的 desc 都是非空字符串', () => {
    for (const height of INPUTS) {
      for (const s of buildTrappingRainStackSteps({ height })) {
        expect(typeof s.desc).toBe('string')
        expect(s.desc.length).toBeGreaterThan(10)
      }
    }
  })

  it('不修改调用方传进来的数组', () => {
    const input = [...DEMO]
    buildTrappingRainStackSteps({ height: input })
    expect(input).toEqual(DEMO)
  })

  it('依赖默认参数时不崩，且默认例就是官方例 1', () => {
    const steps = buildTrappingRainStackSteps()
    expect(steps[0].height).toEqual(DEMO)
    expect(steps.at(-1).total).toBe(6)
  })
})

describe('maxSteps 保护', () => {
  it('截断时依然以 done 收尾', () => {
    const steps = buildTrappingRainStackSteps({ height: DEMO, maxSteps: 5 })
    expect(steps.at(-1).phase).toBe('done')
    expect(steps.length).toBeLessThan(buildTrappingRainStackSteps({ height: DEMO }).length)
  })

  it('maxSteps = 0 时只剩 init 和 done', () => {
    const steps = buildTrappingRainStackSteps({ height: DEMO, maxSteps: 0 })
    expect(steps.map((s) => s.phase)).toEqual(['init', 'done'])
    expect(steps[1].total).toBe(0)
  })
})
