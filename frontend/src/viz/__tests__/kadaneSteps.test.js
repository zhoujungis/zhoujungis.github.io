import { describe, expect, it } from 'vitest'
import { buildKadaneSteps } from '../kadaneSteps.js'

const DEMO = [-2, 1, -3, 4, -1, 2, 1, -5, 4] // 官方例 → 6，[4,-1,2,1]

const final = (nums, options = {}) => buildKadaneSteps({ nums, ...options }).at(-1)

/** 独立参考解 1：暴力枚举所有子数组。 */
function bruteBest(nums) {
  const n = nums.length
  let best = -Infinity
  for (let i = 0; i < n; i += 1) {
    let s = 0
    for (let j = i; j < n; j += 1) {
      s += nums[j]
      if (s > best) best = s
    }
  }
  return best
}

/** 独立参考解 2：前缀和（维护最小前缀）版 —— 换个思路再算一遍。 */
function prefixBest(nums) {
  let best = -Infinity
  let minPrefix = 0
  let sum = 0
  for (let i = 0; i < nums.length; i += 1) {
    sum += nums[i]
    best = Math.max(best, sum - minPrefix)
    minPrefix = Math.min(minPrefix, sum)
  }
  return best
}

const INPUTS = [
  DEMO,
  [1],
  [-1],
  [5, 4, -1, 7, 8],
  [1, 2, 3, 4],
  [-5, -4, -3, -2, -1],
  [-2, -1],
  [0],
  [0, 0, 0],
  [-2, 1],
  [1, -2],
  [8, -19, 5, -4, 20],
  [-1, -2, 3, -1, 2],
  [2, -1, 2, 3, 4, -5],
  [1, -1, 1, -1, 1],
  [3, -2, 5, -1],
  [-3, 4, -1, 2, 1, -5, 4],
  [10, -10, 10, -10, 10],
]

describe('buildKadaneSteps — 答案正确性', () => {
  it('官方例 [-2,1,-3,4,-1,2,1,-5,4] → 6，子数组 [4,-1,2,1]', () => {
    const last = final(DEMO)
    expect(last.best).toBe(6)
    expect(last.bestStart).toBe(3)
    expect(last.bestEnd).toBe(6)
    expect(DEMO.slice(3, 7)).toEqual([4, -1, 2, 1])
  })

  it('每一组输入都与两个独立参考解（暴力 / 前缀和）三向一致', () => {
    for (const nums of INPUTS) {
      const got = final(nums).best
      expect(got).toBe(bruteBest(nums))
      expect(got).toBe(prefixBest(nums))
    }
  })

  it('全负数组 [-5,-4,-3,-2,-1] → -1（答案不可能是 0，必须取一个元素）', () => {
    expect(final([-5, -4, -3, -2, -1]).best).toBe(-1)
  })

  it('全正数组 [1,2,3,4] → 10（整段全取）', () => {
    const last = final([1, 2, 3, 4])
    expect(last.best).toBe(10)
    expect(last.bestStart).toBe(0)
    expect(last.bestEnd).toBe(3)
  })
})

describe('返回子数组本身', () => {
  it('最优区间的实和恒等于 best（每一帧都要成立）', () => {
    for (const nums of INPUTS) {
      for (const s of buildKadaneSteps({ nums })) {
        const real = nums.slice(s.bestStart, s.bestEnd + 1).reduce((a, b) => a + b, 0)
        expect(real).toBe(s.best)
      }
    }
  })

  it('当前区间的实和恒等于 cur（每一帧都要成立）', () => {
    for (const nums of INPUTS) {
      for (const s of buildKadaneSteps({ nums })) {
        const real = nums.slice(s.start, s.end + 1).reduce((a, b) => a + b, 0)
        expect(real).toBe(s.cur)
      }
    }
  })

  it('子数组永远非空（start <= end 且 bestStart <= bestEnd）', () => {
    for (const nums of INPUTS) {
      for (const s of buildKadaneSteps({ nums })) {
        expect(s.start).toBeLessThanOrEqual(s.end)
        expect(s.bestStart).toBeLessThanOrEqual(s.bestEnd)
      }
    }
  })

  it('并列最优时返回的区间依然合法（和相等即可）', () => {
    // [1,-1,1,-1,1] 有多个和为 1 的子数组，状态机给哪个都合法
    const last = final([1, -1, 1, -1, 1])
    expect(last.best).toBe(1)
    const real = [1, -1, 1, -1, 1].slice(last.bestStart, last.bestEnd + 1).reduce((a, b) => a + b, 0)
    expect(real).toBe(1)
  })
})

describe('Kadane 的核心规则：cur < 0 重置，否则接上', () => {
  it('restart 帧的上一帧 cur 一定 < 0；extend 帧的上一帧一定 >= 0', () => {
    for (const nums of INPUTS) {
      const steps = buildKadaneSteps({ nums })
      for (let k = 1; k < steps.length; k += 1) {
        const s = steps[k]
        const prev = steps[k - 1]
        if (s.phase === 'restart') expect(prev.cur).toBeLessThan(0)
        if (s.phase === 'extend') expect(prev.cur).toBeGreaterThanOrEqual(0)
      }
    }
  })

  it('restart 帧丢弃的正是上一帧的当前段', () => {
    for (const nums of INPUTS) {
      const steps = buildKadaneSteps({ nums })
      for (let k = 1; k < steps.length; k += 1) {
        const s = steps[k]
        if (s.phase !== 'restart' || !s.dropped) continue
        expect(s.dropped.from).toBe(steps[k - 1].start)
        expect(s.dropped.to).toBe(steps[k - 1].end)
        // 丢弃后新起点就是 i
        expect(s.start).toBe(s.i)
        // cur 重置为 nums[i]
        expect(s.cur).toBe(nums[s.i])
      }
    }
  })

  it('extend 帧 cur = 上一帧 cur + nums[i]', () => {
    for (const nums of INPUTS) {
      const steps = buildKadaneSteps({ nums })
      for (let k = 1; k < steps.length; k += 1) {
        const s = steps[k]
        if (s.phase !== 'extend') continue
        expect(s.cur).toBe(steps[k - 1].cur + nums[s.i])
      }
    }
  })

  it('best 单调不减，且推进帧里 best >= cur', () => {
    for (const nums of INPUTS) {
      const steps = buildKadaneSteps({ nums })
      for (let k = 1; k < steps.length; k += 1) {
        expect(steps[k].best).toBeGreaterThanOrEqual(steps[k - 1].best)
      }
      for (const s of steps) {
        if (s.phase === 'extend' || s.phase === 'restart') {
          expect(s.best).toBeGreaterThanOrEqual(s.cur)
        }
      }
    }
  })

  it('推进帧里 end === i（当前段永远以 i 结尾）', () => {
    for (const nums of INPUTS) {
      for (const s of buildKadaneSteps({ nums })) {
        if (s.phase === 'extend' || s.phase === 'restart') {
          expect(s.end).toBe(s.i)
        }
      }
    }
  })

  it('improved 为 true 的帧，best 刚好被刷新（best === cur）', () => {
    for (const nums of INPUTS) {
      const steps = buildKadaneSteps({ nums })
      for (let k = 1; k < steps.length; k += 1) {
        const s = steps[k]
        if (s.improved) {
          expect(s.best).toBe(s.cur)
          expect(s.best).toBeGreaterThan(steps[k - 1].best)
        } else if (s.phase === 'extend' || s.phase === 'restart') {
          expect(s.best).toBe(steps[k - 1].best)
        }
      }
    }
  })
})

describe('边界情况', () => {
  it('空数组：只有一帧 done', () => {
    const steps = buildKadaneSteps({ nums: [] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
  })

  it('单元素 [1] / [-1]：答案就是那个元素，区间 [0..0]', () => {
    for (const nums of [[1], [-1], [0]]) {
      const steps = buildKadaneSteps({ nums })
      expect(steps).toHaveLength(2) // init + done
      const last = steps.at(-1)
      expect(last.best).toBe(nums[0])
      expect(last.bestStart).toBe(0)
      expect(last.bestEnd).toBe(0)
    }
  })

  it('合法输入（n >= 1）首帧 init、末帧 done', () => {
    for (const nums of INPUTS) {
      const steps = buildKadaneSteps({ nums })
      expect(steps[0].phase).toBe('init')
      expect(steps.at(-1).phase).toBe('done')
      expect(steps.at(-1).done).toBe(true)
    }
  })

  it('每帧的 desc 都是非空字符串', () => {
    for (const nums of INPUTS) {
      for (const s of buildKadaneSteps({ nums })) {
        expect(typeof s.desc).toBe('string')
        expect(s.desc.length).toBeGreaterThan(10)
      }
    }
  })

  it('不修改调用方传进来的数组', () => {
    const input = [...DEMO]
    buildKadaneSteps({ nums: input })
    expect(input).toEqual(DEMO)
  })

  it('依赖默认参数时不崩，且默认例就是官方例', () => {
    const steps = buildKadaneSteps()
    expect(steps[0].nums).toEqual(DEMO)
    expect(steps.at(-1).best).toBe(6)
  })
})

describe('maxSteps 保护', () => {
  it('截断时依然以 done 收尾；帧数上限 = init + maxSteps + done', () => {
    const steps = buildKadaneSteps({ nums: DEMO, maxSteps: 4 })
    expect(steps.at(-1).phase).toBe('done')
    expect(steps.length).toBeLessThanOrEqual(4 + 2)
    expect(steps.length).toBeLessThan(buildKadaneSteps({ nums: DEMO }).length)
  })

  it('maxSteps = 0 时只剩 init 和 done', () => {
    const steps = buildKadaneSteps({ nums: DEMO, maxSteps: 0 })
    expect(steps.map((s) => s.phase)).toEqual(['init', 'done'])
  })
})
