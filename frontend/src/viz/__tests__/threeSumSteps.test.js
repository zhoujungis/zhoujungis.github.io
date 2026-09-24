import { describe, expect, it } from 'vitest'
import { buildThreeSumSteps } from '../threeSumSteps.js'

const DEMO = [-1, 0, 1, 2, -1, -4]

/** 跑完整条推演，取最后一帧。 */
const final = (nums, options = {}) => buildThreeSumSteps({ nums, ...options }).at(-1)

/** 规范化：每组内部升序，组间按字典序排序 —— 用于和参考解比对。 */
function canon(triples) {
  return triples
    .map((t) => [...t].sort((a, b) => a - b))
    .sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2])
}

/**
 * 独立参考解：暴力三重循环 + set 去重。
 * 故意写得跟状态机毫无关系 —— 只用"枚举所有组合"这个最朴素的定义。
 */
function brute(nums) {
  const n = nums.length
  const set = new Set()
  for (let i = 0; i < n; i += 1)
    for (let j = i + 1; j < n; j += 1)
      for (let k = j + 1; k < n; k += 1)
        if (nums[i] + nums[j] + nums[k] === 0) {
          set.add(JSON.stringify([nums[i], nums[j], nums[k]].sort((a, b) => a - b)))
        }
  return canon([...set].map((s) => JSON.parse(s)))
}

/** 所有输入都用同一套规则验一遍。 */
const INPUTS = [
  DEMO,
  [0, 0, 0],
  [0, 0, 0, 0],
  [0, 1, 1],
  [1, 2, 3],
  [],
  [1],
  [1, 2],
  [-2, 0, 0, 2, 2],
  [-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6],
  [-1, -1, 2],
  [-2, 0, 1, 1, 2],
  [-1, 0, 1],
  [3, 0, -2, -1, 1, 2],
  [-1, -1, -1, 2, 2],
  [1, 1, -2],
  [-2, -1, 0, 1, 2, 3],
  [0, 0, 0, 1, -1, 2, -2],
  [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
  [4, -7, 1, 2, -4, 6, -1, 5],
  [10, 2, 1, -1, 0, 3],
]

describe('buildThreeSumSteps — 答案正确性', () => {
  it('官方例 [-1,0,1,2,-1,-4] → [[-1,-1,2],[-1,0,1]]', () => {
    expect(canon(final(DEMO).results)).toEqual([
      [-1, -1, 2],
      [-1, 0, 1],
    ])
  })

  it('每一组输入都与暴力参考解一致', () => {
    for (const nums of INPUTS) {
      expect(canon(final(nums).results)).toEqual(brute(nums))
    }
  })

  it('[0,0,0] → 只有一组 [0,0,0]', () => {
    expect(final([0, 0, 0]).results).toEqual([[0, 0, 0]])
  })

  it('[1,2,3] → 空结果（全正数）', () => {
    expect(final([1, 2, 3]).results).toEqual([])
  })
})

describe('去重：本题唯一真正的难点', () => {
  it('[0,0,0,0] → 只输出一组 [0,0,0]（外层 i 去重生效）', () => {
    // 若没有 `if i > 0 and nums[i] == nums[i-1]: continue`，
    // i = 1、i = 2 会各再产出一次 [0,0,0]，答案变成三组。
    expect(final([0, 0, 0, 0]).results).toEqual([[0, 0, 0]])
  })

  it('[-2,0,0,2,2] → 只输出一组 [-2,0,2]（命中后双指针去重生效）', () => {
    // 排序后 [-2,0,0,2,2]。i=0 命中时 l=1, r=4；
    // 若没有命中后的 `while ... nums[l] == nums[l+1]` 去重，
    // l 会走到 2、r 会走到 3，再产出一次一模一样的 [-2,0,2]。
    expect(final([-2, 0, 0, 2, 2]).results).toEqual([[-2, 0, 2]])
  })

  it('[-1,-1,2] → 只输出一组（外层 i 去重挡住第二个 -1）', () => {
    expect(final([-1, -1, 2]).results).toEqual([[-1, -1, 2]])
  })

  it('一个满是重复值的数组，结果依然无重复', () => {
    const nums = [-4, -2, -2, -2, 0, 1, 2, 2, 2, 3, 3, 4, 4, 6, 6]
    const got = canon(final(nums).results)
    expect(got).toEqual(brute(nums))
    // 再去掉参考解，直接查"有没有重复组"
    const keys = final(nums).results.map((t) => JSON.stringify(t))
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('skip-i 帧的触发条件精确：i > 0 且 arr[i] === arr[i-1]', () => {
    for (const nums of INPUTS) {
      const steps = buildThreeSumSteps({ nums })
      const arr = steps[0].arr
      for (const s of steps) {
        if (s.phase !== 'skip-i') continue
        expect(s.i).toBeGreaterThan(0)
        expect(arr[s.i]).toBe(arr[s.i - 1])
      }
    }
  })

  it('不该跳过的时候一次都没跳（i=0 永不被 skip-i）', () => {
    for (const nums of INPUTS) {
      for (const s of buildThreeSumSteps({ nums })) {
        if (s.phase === 'skip-i') expect(s.i).not.toBe(0)
      }
    }
  })

  it('每个 i 值最多被"正式开始"一次（pick-i 的 i 不重复）', () => {
    for (const nums of INPUTS) {
      const starts = buildThreeSumSteps({ nums })
        .filter((s) => s.phase === 'pick-i')
        .map((s) => s.i)
      expect(new Set(starts).size).toBe(starts.length)
    }
  })
})

describe('排序', () => {
  it('用数值比较，不是 JS 默认的字符串比较', () => {
    // ⚠️ 不写比较函数时 [10, 2, 1, -1, 0, 3].sort() 会得到 [-1, 0, 1, 10, 2, 3]
    expect(final([10, 2, 1, -1, 0, 3]).arr).toEqual([-1, 0, 1, 2, 3, 10])
    // 负数最容易暴露：字符串序里 '-4' < '-1'，但数值上 -4 更小
    expect(final(DEMO).arr).toEqual([-4, -1, -1, 0, 1, 2])
  })

  it('不修改调用方传进来的数组', () => {
    const input = [-1, 0, 1, 2, -1, -4]
    const copy = [...input]
    buildThreeSumSteps({ nums: input })
    expect(input).toEqual(copy)
  })

  it('每帧都带排序后的数组（渲染层的坐标系）', () => {
    const steps = buildThreeSumSteps({ nums: DEMO })
    for (const s of steps) expect(s.arr).toEqual([-4, -1, -1, 0, 1, 2])
  })

  it('original 保留原始顺序，供 init 帧讲"排序前后"', () => {
    expect(final(DEMO).original).toEqual(DEMO)
    expect(final(DEMO).arr).not.toEqual(DEMO)
  })
})

describe('边界情况', () => {
  it('空数组：只有一帧 done', () => {
    const steps = buildThreeSumSteps({ nums: [] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].results).toEqual([])
    expect(steps[0].done).toBe(true)
  })

  it('单元素 / 两元素：凑不出三元组，也只有一帧 done', () => {
    for (const nums of [[1], [1, 2], [-1, 0]]) {
      const steps = buildThreeSumSteps({ nums })
      expect(steps).toHaveLength(1)
      expect(steps[0].phase).toBe('done')
      expect(steps[0].results).toEqual([])
    }
  })

  it('正好三个数且命中', () => {
    const steps = buildThreeSumSteps({ nums: [0, 0, 0] })
    expect(steps.map((s) => s.phase)).toEqual(['init', 'pick-i', 'hit', 'dedup', 'done'])
  })

  it('全正数：[1,2,3] 在 i=0 就被剪枝掉', () => {
    const steps = buildThreeSumSteps({ nums: [1, 2, 3] })
    expect(steps.map((s) => s.phase)).toEqual(['init', 'prune', 'done'])
    const prune = steps.find((s) => s.phase === 'prune')
    expect(prune.i).toBe(0)
    expect(steps[0].arr[prune.i]).toBeGreaterThan(0)
  })

  it('prune 只在 arr[i] > 0 时出现', () => {
    for (const nums of INPUTS) {
      const steps = buildThreeSumSteps({ nums })
      const arr = steps[0].arr
      for (const s of steps) {
        if (s.phase !== 'prune') continue
        expect(arr[s.i]).toBeGreaterThan(0)
      }
    }
  })

  it('合法输入（n >= 3）首帧 init、末帧 done', () => {
    for (const nums of INPUTS) {
      if (nums.length < 3) continue
      const steps = buildThreeSumSteps({ nums })
      expect(steps[0].phase).toBe('init')
      expect(steps.at(-1).phase).toBe('done')
      expect(steps.at(-1).done).toBe(true)
    }
  })

  it('依赖默认参数时不崩，且默认例就是官方例', () => {
    const steps = buildThreeSumSteps()
    expect(steps[0].arr).toEqual([-4, -1, -1, 0, 1, 2])
    expect(canon(steps.at(-1).results)).toEqual([
      [-1, -1, 2],
      [-1, 0, 1],
    ])
  })
})

describe('不变量（每一帧都要成立）', () => {
  it('结果的每组三数之和都是 0', () => {
    for (const nums of INPUTS) {
      for (const s of buildThreeSumSteps({ nums })) {
        for (const t of s.results) expect(t[0] + t[1] + t[2]).toBe(0)
      }
    }
  })

  it('结果里的每个值都能在数组里各找到一次（同一元素不重复使用）', () => {
    for (const nums of INPUTS) {
      const arr = [...nums].sort((a, b) => a - b)
      for (const s of buildThreeSumSteps({ nums })) {
        for (const t of s.results) {
          const pool = [...arr]
          for (const v of t) {
            const p = pool.indexOf(v)
            expect(p).toBeGreaterThanOrEqual(0)
            pool.splice(p, 1)
          }
        }
      }
    }
  })

  it('results 只增不减，且 hit 帧的三元组一定已经进了 results', () => {
    for (const nums of INPUTS) {
      const steps = buildThreeSumSteps({ nums })
      for (let k = 1; k < steps.length; k += 1) {
        expect(steps[k].results.length).toBeGreaterThanOrEqual(steps[k - 1].results.length)
      }
      for (const s of steps) {
        if (!s.hit) continue
        expect(s.results.some((t) => JSON.stringify(t) === JSON.stringify(s.hit))).toBe(true)
      }
    }
  })

  it('结果里没有重复组', () => {
    for (const nums of INPUTS) {
      for (const s of buildThreeSumSteps({ nums })) {
        const keys = s.results.map((t) => JSON.stringify(t))
        expect(new Set(keys).size).toBe(keys.length)
      }
    }
  })

  it('sum 自洽：sum === arr[i] + arr[sumL] + arr[sumR]', () => {
    for (const nums of INPUTS) {
      const steps = buildThreeSumSteps({ nums })
      const arr = steps[0].arr
      for (const s of steps) {
        if (s.sum === null) continue
        expect(s.sum).toBe(arr[s.i] + arr[s.sumL] + arr[s.sumR])
      }
    }
  })

  it('squeeze 帧的移动方向与 sum 的符号一致', () => {
    for (const nums of INPUTS) {
      for (const s of buildThreeSumSteps({ nums })) {
        if (s.phase !== 'squeeze') continue
        if (s.sum < 0) {
          expect(s.lFrom).not.toBeNull() // 和太小 → 只有 l 动
          expect(s.rFrom).toBeNull()
        } else if (s.sum > 0) {
          expect(s.rFrom).not.toBeNull() // 和太大 → 只有 r 动
          expect(s.lFrom).toBeNull()
        } else {
          throw new Error('squeeze 帧不该出现 sum === 0')
        }
      }
    }
  })

  it('hit 帧不移动指针（sumL / sumR 就是当帧的 l / r）', () => {
    for (const nums of INPUTS) {
      for (const s of buildThreeSumSteps({ nums })) {
        if (s.phase !== 'hit') continue
        expect(s.sumL).toBe(s.l)
        expect(s.sumR).toBe(s.r)
        expect(s.lFrom).toBeNull()
        expect(s.rFrom).toBeNull()
        expect(s.sum).toBe(0)
      }
    }
  })

  it('dedup 帧一定把两个指针各向内推进了至少一格', () => {
    for (const nums of INPUTS) {
      for (const s of buildThreeSumSteps({ nums })) {
        if (s.phase !== 'dedup') continue
        expect(s.lFrom).not.toBeNull()
        expect(s.rFrom).not.toBeNull()
        expect(s.l).toBeGreaterThan(s.lFrom)
        expect(s.r).toBeLessThan(s.rFrom)
      }
    }
  })

  it('dedupL / dedupR 的区间确实是同一段相同值', () => {
    for (const nums of INPUTS) {
      const steps = buildThreeSumSteps({ nums })
      const arr = steps[0].arr
      for (const s of steps) {
        if (s.phase !== 'dedup') continue
        if (s.dedupL) {
          expect(s.dedupL.from).toBe(s.lFrom)
          for (let k = s.dedupL.from; k <= s.dedupL.to; k += 1) {
            expect(arr[k]).toBe(arr[s.dedupL.from])
          }
        }
        if (s.dedupR) {
          expect(s.dedupR.to).toBe(s.rFrom)
          for (let k = s.dedupR.from; k <= s.dedupR.to; k += 1) {
            expect(arr[k]).toBe(arr[s.dedupR.to])
          }
        }
      }
    }
  })

  it('外层 i 单调不减', () => {
    for (const nums of INPUTS) {
      const steps = buildThreeSumSteps({ nums })
      for (let k = 1; k < steps.length; k += 1) {
        expect(steps[k].i).toBeGreaterThanOrEqual(steps[k - 1].i)
      }
    }
  })

  it('内层每轮里，l 只增、r 只减（双指针单调性）', () => {
    for (const nums of INPUTS) {
      const steps = buildThreeSumSteps({ nums })
      let prev = null
      for (const s of steps) {
        if (s.phase === 'pick-i') {
          prev = { i: s.i, l: s.l, r: s.r }
          continue
        }
        if (s.phase === 'squeeze' || s.phase === 'hit' || s.phase === 'dedup') {
          if (prev && prev.i === s.i) {
            expect(s.l).toBeGreaterThanOrEqual(prev.l)
            expect(s.r).toBeLessThanOrEqual(prev.r)
            prev = { i: s.i, l: s.l, r: s.r }
          }
        }
      }
    }
  })

  it('每帧的 l / r 要么未开始（-1），要么在合法范围内', () => {
    for (const nums of INPUTS) {
      const steps = buildThreeSumSteps({ nums })
      const n = steps[0].arr.length
      for (const s of steps) {
        for (const v of [s.l, s.r]) {
          if (v === -1) continue
          expect(v).toBeGreaterThanOrEqual(0)
          expect(v).toBeLessThanOrEqual(n)
        }
      }
    }
  })

  it('命中帧的 l / r 一定满足 l < r（命中时两个指针不可能重合）', () => {
    for (const nums of INPUTS) {
      for (const s of buildThreeSumSteps({ nums })) {
        if (s.phase !== 'hit') continue
        expect(s.l).toBeLessThan(s.r)
      }
    }
  })

  it('非空结果时，最后一帧的 results 与参考解完全一致', () => {
    for (const nums of INPUTS) {
      expect(canon(buildThreeSumSteps({ nums }).at(-1).results)).toEqual(brute(nums))
    }
  })

  it('每帧的 desc 都是非空字符串', () => {
    for (const nums of INPUTS) {
      for (const s of buildThreeSumSteps({ nums })) {
        expect(typeof s.desc).toBe('string')
        expect(s.desc.length).toBeGreaterThan(10)
      }
    }
  })
})

describe('maxSteps 保护', () => {
  it('截断时依然以 done 收尾，不会死循环', () => {
    // ⚠️ maxSteps 限制的是**主循环的迭代次数**，不是总帧数 ——
    // 帧数上限是 `init + maxSteps + done = maxSteps + 2`。
    // （初版断言 <= 4 就是这么算错的。）
    const steps = buildThreeSumSteps({ nums: DEMO, maxSteps: 3 })
    expect(steps.at(-1).phase).toBe('done')
    expect(steps.at(-1).done).toBe(true)
    expect(steps.length).toBeLessThanOrEqual(3 + 2)
    expect(steps.length).toBeLessThan(buildThreeSumSteps({ nums: DEMO }).length)
  })

  it('maxSteps = 0 时只剩 init 和 done，也不崩', () => {
    const steps = buildThreeSumSteps({ nums: DEMO, maxSteps: 0 })
    expect(steps).toHaveLength(2)
    expect(steps.map((s) => s.phase)).toEqual(['init', 'done'])
    expect(steps[1].results).toEqual([])
  })
})
