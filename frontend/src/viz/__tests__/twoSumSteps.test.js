import { describe, expect, it } from 'vitest'
import { buildTwoSumSteps } from '../twoSumSteps'

// 演示例（和状态机默认值、文章正文逐字一致）：
//   nums = [2, 7, 11, 15], target = 9  →  [0, 1]
const DEMO_NUMS = [2, 7, 11, 15]
const DEMO_TARGET = 9

const final = (nums, target, opts = {}) =>
  buildTwoSumSteps({ nums, target, ...opts }).at(-1)

/** 独立参考解：暴力枚举（i < j，天然保证不重复用同一元素）。 */
function refBrute(nums, target) {
  for (let i = 0; i < nums.length; i += 1) {
    for (let j = i + 1; j < nums.length; j += 1) {
      if (nums[i] + nums[j] === target) return [i, j]
    }
  }
  return null
}

/** 「先存再查」的错误写法 —— 当 target === 2 * x 时返回 [i, i]。 */
function buggyStoreFirst(nums, target) {
  const seen = {}
  for (let i = 0; i < nums.length; i += 1) {
    const x = nums[i]
    seen[x] = i // ❌ 先把自己放进去
    const need = target - x
    if (Object.prototype.hasOwnProperty.call(seen, need)) return [seen[need], i]
  }
  return null
}

/** 一个合法解判定：两个下标不同、都在范围内、值之和等于 target。 */
function isLegalAnswer(nums, target, ans) {
  return (
    Array.isArray(ans) &&
    ans.length === 2 &&
    ans[0] !== ans[1] &&
    ans[0] >= 0 &&
    ans[1] < nums.length &&
    nums[ans[0]] + nums[ans[1]] === target
  )
}

const CASES = [
  { nums: [2, 7, 11, 15], target: 9, want: [0, 1] },
  { nums: [3, 2, 4], target: 6, want: [1, 2] },
  { nums: [3, 3], target: 6, want: [0, 1] },
  { nums: [-1, -2, -3, -4, -5], target: -8, want: [2, 4] },
  { nums: [0, 4, 3, 0], target: 0, want: [0, 3] },
  { nums: [0, 0], target: 0, want: [0, 1] },
  { nums: [1, 2], target: 3, want: [0, 1] },
  { nums: [-3, 4, 3, 90], target: 0, want: [0, 2] },
  { nums: [2, 5, 5, 11], target: 10, want: [1, 2] },
  { nums: [1, 3, 4, 2], target: 6, want: [2, 3] },
  { nums: [-10, -1, -18, -19], target: -19, want: [1, 2] },
  { nums: [5, 75, 25], target: 100, want: [1, 2] },
  { nums: [3, 2, 3], target: 6, want: [0, 2] },
  { nums: [1, 1, 1, 1, 1, 1, 1], target: 2, want: [0, 1] },
  { nums: [0, 1, 2, 3, 4, 5], target: 9, want: [4, 5] },
]

describe('twoSumSteps — 主流程（LC 1 官方例）', () => {
  it('答案是 [0, 1]', () => {
    const last = final(DEMO_NUMS, DEMO_TARGET)
    expect(last.phase).toBe('done')
    expect(last.done).toBe(true)
    expect(last.answer).toEqual([0, 1])
  })

  it('6 帧：init + (miss + put) + hit + verify + done', () => {
    const phases = buildTwoSumSteps({ nums: DEMO_NUMS, target: DEMO_TARGET }).map((s) => s.phase)
    expect(phases).toEqual(['init', 'miss', 'put', 'hit', 'verify', 'done'])
  })

  it('第一帧是 init、还没开始遍历', () => {
    const first = buildTwoSumSteps({ nums: DEMO_NUMS, target: DEMO_TARGET })[0]
    expect(first.phase).toBe('init')
    expect(first.i).toBe(-1)
    expect(first.seen).toEqual({})
    expect(first.answer).toBeNull()
  })

  it('miss 帧：需要 target - x，且此时表里还没有它', () => {
    const steps = buildTwoSumSteps({ nums: DEMO_NUMS, target: DEMO_TARGET })
    const miss = steps.find((s) => s.phase === 'miss')
    expect(miss.i).toBe(0)
    expect(miss.x).toBe(2)
    expect(miss.need).toBe(7)
    expect(miss.hitIdx).toBeNull()
    expect(miss.seen).toEqual({}) // 查表发生在登记之前 —— 表还是空的
  })

  it('put 帧：把当前元素登记进表', () => {
    const steps = buildTwoSumSteps({ nums: DEMO_NUMS, target: DEMO_TARGET })
    const put = steps.find((s) => s.phase === 'put')
    expect(put.i).toBe(0)
    expect(put.x).toBe(2)
    expect(put.seen).toEqual({ 2: 0 })
  })

  it('hit 帧：命中位置在下标 0，且 0 < i = 1', () => {
    const steps = buildTwoSumSteps({ nums: DEMO_NUMS, target: DEMO_TARGET })
    const hit = steps.find((s) => s.phase === 'hit')
    expect(hit.i).toBe(1)
    expect(hit.x).toBe(7)
    expect(hit.need).toBe(2)
    expect(hit.hitIdx).toBe(0)
    expect(hit.answer).toEqual([0, 1])
  })

  it('前 3 步之后表的演化是对的：{} → {} → {2:0}', () => {
    const steps = buildTwoSumSteps({ nums: DEMO_NUMS, target: DEMO_TARGET })
    expect(steps[0].seen).toEqual({})
    expect(steps[1].seen).toEqual({}) // miss 帧：还没登记
    expect(steps[2].seen).toEqual({ '2': 0 }) // put 帧：登记完成
  })
})

describe('twoSumSteps — 核心不变量：命中位置一定在当前元素左边', () => {
  it('hit 帧的 hitIdx 恒小于 i（这就是"同一元素不能重复使用"的保证）', () => {
    // ⚠️ 这条直接钉住"先查再存"：查表发生在登记自己之前，
    // 所以表里只可能有 i 左边的元素，命中的下标必然 < i。
    // 如果状态机写成"先存再查"，i === hitIdx 的情况就会出现，这条立刻挂。
    for (const { nums, target } of CASES) {
      for (const s of buildTwoSumSteps({ nums, target })) {
        if (s.phase !== 'hit') continue
        expect(s.hitIdx).toBeLessThan(s.i)
      }
    }
  })

  it('answer 的两个下标一定不同', () => {
    for (const { nums, target } of CASES) {
      const ans = final(nums, target).answer
      expect(ans[0]).not.toBe(ans[1])
    }
  })

  it('answer 的命中下标就是较靠左的那个', () => {
    for (const { nums, target } of CASES) {
      const ans = final(nums, target).answer
      expect(ans[0]).toBeLessThan(ans[1])
    }
  })

  it('answer 一定是合法解（值之和 = target，下标准确）', () => {
    for (const { nums, target } of CASES) {
      expect(isLegalAnswer(nums, target, final(nums, target).answer)).toBe(true)
    }
  })
})

describe('twoSumSteps — 哈希表的维护', () => {
  it('put 帧执行后，表里一定有当前元素', () => {
    for (const { nums, target } of CASES) {
      const steps = buildTwoSumSteps({ nums, target })
      for (const s of steps) {
        if (s.phase !== 'put') continue
        expect(s.seen[s.x]).toBe(s.i)
      }
    }
  })

  it('miss 帧时，表里一定没有 need（否则就不该叫 miss）', () => {
    for (const { nums, target } of CASES) {
      for (const s of buildTwoSumSteps({ nums, target })) {
        if (s.phase !== 'miss') continue
        expect(Object.prototype.hasOwnProperty.call(s.seen, s.need)).toBe(false)
      }
    }
  })

  it('hit 帧时，need 一定在表里，且指向 hitIdx', () => {
    for (const { nums, target } of CASES) {
      for (const s of buildTwoSumSteps({ nums, target })) {
        if (s.phase !== 'hit') continue
        expect(s.seen[s.need]).toBe(s.hitIdx)
      }
    }
  })

  it('init / miss / put 帧里，表的键集合 = 已登记元素去重后的集合', () => {
    // ⚠️ 这个断言**只能覆盖"逐帧推进"的三种帧**，不能覆盖 hit / verify / done ——
    // 因为题目允许"命中就早退"，此时后面的元素根本没被登记，
    // 表自然不等于"前 i+1 个元素的集合"。这是**提前返回**带来的口径问题，
    // 不是状态机写错了（LC 102 也踩过类似的"统计口径"坑）。
    for (const { nums, target } of CASES) {
      for (const s of buildTwoSumSteps({ nums, target })) {
        if (!['init', 'miss', 'put'].includes(s.phase)) continue
        const processed =
          s.phase === 'init'
            ? []
            : s.phase === 'miss'
              ? nums.slice(0, s.i) // miss 帧还没登记自己
              : nums.slice(0, s.i + 1) // put 帧登记完成
        expect(new Set(Object.keys(s.seen))).toEqual(new Set(processed.map(String)))
      }
    }
  })

  it('hit / verify / done 帧的表，等于"命中之前已登记的那部分"', () => {
    for (const { nums, target } of CASES) {
      const steps = buildTwoSumSteps({ nums, target })
      const hitIdx = steps.findIndex((s) => s.phase === 'hit')
      if (hitIdx < 0) continue
      const hitStep = steps[hitIdx]
      // 到命中为止，只有 0..i-1 被登记过
      const registered = nums.slice(0, hitStep.i)
      for (const s of steps.slice(hitIdx)) {
        const keys = new Set(Object.keys(s.seen))
        // 表里的键必须是"命中前登记过的那些"，一个不多一个不少
        expect(keys.size).toBeLessThanOrEqual(new Set(registered.map(String)).size)
        for (const k of keys) expect(registered.map(String)).toContain(k)
      }
    }
  })

  it('表里的下标都 <= 当前 i', () => {
    for (const { nums, target } of CASES) {
      for (const s of buildTwoSumSteps({ nums, target })) {
        for (const v of Object.values(s.seen)) {
          expect(v).toBeLessThanOrEqual(s.i)
        }
      }
    }
  })

  it('已登记的值一定等于它在数组里那个下标的元素值', () => {
    for (const { nums, target } of CASES) {
      for (const s of buildTwoSumSteps({ nums, target })) {
        for (const [k, v] of Object.entries(s.seen)) {
          expect(nums[v]).toBe(Number(k))
        }
      }
    }
  })
})

describe('twoSumSteps — 答案的确定与稳定性', () => {
  it('answer 一旦非空就不再变化', () => {
    for (const { nums, target } of CASES) {
      const steps = buildTwoSumSteps({ nums, target })
      const withAns = steps.filter((s) => s.answer !== null)
      expect(withAns.length).toBeGreaterThan(0)
      const first = withAns[0].answer
      for (const s of withAns) expect(s.answer).toEqual(first)
    }
  })

  it('answer 只在 hit 帧被写入', () => {
    for (const { nums, target } of CASES) {
      const steps = buildTwoSumSteps({ nums, target })
      const firstWithAns = steps.findIndex((s) => s.answer !== null)
      expect(steps[firstWithAns].phase).toBe('hit')
    }
  })

  it('hit 帧之后不再有 miss / put 帧（找到就早退了）', () => {
    // "只存在一个有效答案"这个前提，决定了可以命中即返回
    for (const { nums, target } of CASES) {
      const steps = buildTwoSumSteps({ nums, target })
      const hitIdx = steps.findIndex((s) => s.phase === 'hit')
      if (hitIdx < 0) continue
      const after = steps.slice(hitIdx + 1)
      expect(after.some((s) => s.phase === 'miss' || s.phase === 'put')).toBe(false)
    }
  })

  it('每组的最终答案与暴力参考解完全一致', () => {
    for (const { nums, target, want } of CASES) {
      const got = final(nums, target).answer
      const ref = refBrute(nums, target)
      expect(got).toEqual(ref)
      expect(got).toEqual(want)
    }
  })
})

describe('twoSumSteps — 回归：「先存再查」会匹配到自己 ⚠️', () => {
  // ⚠️ 一组回归测试。把 `seen[x] = i` 挪到查表之前，当 target === 2 * x 时
  // 查到的就是**自己**，返回 [i, i] —— 同一个元素用了两次。
  it('"[3,3] + 6" 的错误写法返回 [0,0]（用了同一个元素）', () => {
    expect(buggyStoreFirst([3, 3], 6)).toEqual([0, 0])
    expect(final([3, 3], 6).answer).toEqual([0, 1]) // 正确的是 [0, 1]
  })

  it('触发条件是 target === 2 * x —— 列一组会错的输入', () => {
    const BAD = [
      { nums: [3, 3], target: 6 },
      { nums: [1, 2, 3, 3], target: 6 },
      { nums: [2, 2, 3], target: 4 },
      { nums: [0, 0], target: 0 },
      { nums: [5, 5], target: 10 },
    ]
    for (const { nums, target } of BAD) {
      const buggy = buggyStoreFirst(nums, target)
      // 错误写法的两个下标相同 —— 这就是"同一元素用了两次"
      expect(buggy[0]).toBe(buggy[1])
      // 而正确实现永远给出两个不同下标
      const good = final(nums, target).answer
      expect(good[0]).not.toBe(good[1])
      expect(isLegalAnswer(nums, target, good)).toBe(true)
    }
  })

  it('⚠️ 官方例 "[2,7,11,15] + 9" 恰好掩盖了这个 bug', () => {
    // 这题官方给的第一个样例，错误写法**照样通过** ——
    // 因为它凑不出 target === 2 * x（9 的一半是 4.5，不在数组里）。
    expect(buggyStoreFirst(DEMO_NUMS, DEMO_TARGET)).toEqual([0, 1])
    expect(refBrute(DEMO_NUMS, DEMO_TARGET)).toEqual([0, 1])
    // 所以这题不能靠"跑通官方样例"来验证 —— 必须构造 target === 2 * x 的用例
  })

  it('但另一组官方样例 "[3,2,4] + 6" 会把它打回原形', () => {
    // 官方第二个样例里 x = 3 正好是 target 的一半 → 错误写法返回 [0, 0]
    expect(buggyStoreFirst([3, 2, 4], 6)).toEqual([0, 0])
    expect(refBrute([3, 2, 4], 6)).toEqual([1, 2])
    expect(final([3, 2, 4], 6).answer).toEqual([1, 2])
  })

  it('错误写法在两个下标相同时，本身就不是合法解', () => {
    for (const { nums, target } of [
      { nums: [3, 3], target: 6 },
      { nums: [0, 0], target: 0 },
    ]) {
      const buggy = buggyStoreFirst(nums, target)
      expect(isLegalAnswer(nums, target, buggy)).toBe(false)
    }
  })
})

describe('twoSumSteps — 边界情况', () => {
  it('空数组只有一帧 done、没有答案', () => {
    const steps = buildTwoSumSteps({ nums: [], target: 0 })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('done')
    expect(steps[0].answer).toBeNull()
  })

  it('空数组不会被默认值顶掉（守卫用的是 Array.isArray）', () => {
    // 若写成 options.nums || [2,7,11,15]，空数组会被换成默认数组
    expect(buildTwoSumSteps({ nums: [], target: 0 }).at(-1).answer).toBeNull()
  })

  it('单元素数组：凑不出两个数，跑完不给答案', () => {
    const steps = buildTwoSumSteps({ nums: [5], target: 5 })
    expect(steps.at(-1).answer).toBeNull()
    expect(steps.at(-1).phase).toBe('done')
  })

  it('两元素就有解', () => {
    expect(final([1, 2], 3).answer).toEqual([0, 1])
  })

  it('负数与零都能正常处理', () => {
    expect(final([-1, -2, -3, -4, -5], -8).answer).toEqual([2, 4])
    expect(final([0, 4, 3, 0], 0).answer).toEqual([0, 3])
    expect(final([-3, 4, 3, 90], 0).answer).toEqual([0, 2])
  })

  it('目标值是 0 且数组里有 0 时正常（0 不是"假值"）', () => {
    expect(final([0, 0], 0).answer).toEqual([0, 1])
    // ⚠️ 这里只能用**唯一解**的输入：[0,1,2,4] 配 target=4 只有 0+4 一对。
    // 最初写成 [0,1,2,3] 配 target=3 —— 那有 0+3 和 1+2 两组解，
    // 题目保证"只有一个答案"的前提被破坏了，断言必然错（不是状态机的问题）。
    expect(final([0, 1, 2, 4], 4).answer).toEqual([0, 3])
    expect(final([0, 1, 2, 4], 4).answer[0]).toBe(0) // 0 被当成真值正常参与
  })

  it('答案出现在末尾时也能找到', () => {
    expect(final([1, 3, 4, 2], 6).answer).toEqual([2, 3])
    expect(final([0, 1, 2, 3, 4, 5], 9).answer).toEqual([4, 5])
  })

  it('大量重复值', () => {
    expect(final([1, 1, 1, 1, 1, 1, 1], 2).answer).toEqual([0, 1])
    expect(final([2, 5, 5, 11], 10).answer).toEqual([1, 2])
  })

  it('较长数组也能找到（200 个元素的等差数列）', () => {
    // nums = [0, 1, 2, ..., 199]，target = 397
    // 唯一解是 198 + 199：i = 198 时 need = 199（表里还没有）→ 登记；
    // i = 199 时 need = 198（表里下标 198）→ 命中，返回 [198, 199]。
    //
    // ⚠️ 这里刻意**不用 1000 个元素**：状态机每一帧都要深拷贝一次 `seen`
    //（逐帧快照的固有代价），n 大时整体会退化成 O(n²) —— 1000 个元素会产出
    // 2002 帧、每帧复制近千个键，单跑要十几秒、在全量串跑时直接超时。
    // **演示用的输入规模（n ≤ 20）完全不受影响**，只是别拿它去跑压力测试。
    const nums = Array.from({ length: 200 }, (_, i) => i)
    const ans = final(nums, 397).answer
    expect(ans).toEqual([198, 199])
    expect(isLegalAnswer(nums, 397, ans)).toBe(true)
    // 帧数 = init + 199 轮 (miss + put) + hit + verify + done
    expect(buildTwoSumSteps({ nums, target: 397 })).toHaveLength(1 + 199 * 2 + 3)
  })

  it('maxSteps 截断不会死循环', () => {
    // maxSteps = 2 时循环只跑 i = 0 和 i = 1 两轮：
    // init + (miss + put) + hit + verify + done = 6 帧。
    const steps = buildTwoSumSteps({ nums: DEMO_NUMS, target: DEMO_TARGET, maxSteps: 2 })
    expect(steps).toHaveLength(6)
    expect(steps.at(-1).phase).toBe('done')
    // 截断得更狠时也不能崩，且一定以 done 收尾
    const tiny = buildTwoSumSteps({ nums: DEMO_NUMS, target: DEMO_TARGET, maxSteps: 0 })
    expect(tiny.at(-1).phase).toBe('done')
    expect(tiny.length).toBeLessThan(steps.length)
  })
})

describe('twoSumSteps — 帧结构', () => {
  it('每帧都有必需字段', () => {
    for (const s of buildTwoSumSteps({ nums: DEMO_NUMS, target: DEMO_TARGET })) {
      expect(s).toHaveProperty('phase')
      expect(s).toHaveProperty('desc')
      expect(typeof s.desc).toBe('string')
      expect(s.desc.length).toBeGreaterThan(0)
      expect(typeof s.i).toBe('number')
      expect(s).toHaveProperty('seen')
      expect(typeof s.done).toBe('boolean')
    }
  })

  it('最后一帧一定是 done', () => {
    for (const { nums, target } of CASES) {
      const last = buildTwoSumSteps({ nums, target }).at(-1)
      expect(last.phase).toBe('done')
      expect(last.done).toBe(true)
    }
  })

  it('phase 只出现在允许的集合里', () => {
    const ALLOWED = new Set(['init', 'miss', 'put', 'hit', 'verify', 'done'])
    for (const { nums, target } of CASES) {
      for (const s of buildTwoSumSteps({ nums, target })) {
        expect(ALLOWED.has(s.phase)).toBe(true)
      }
    }
  })

  it('desc 里的 ** 成对出现（markdown 安全）', () => {
    for (const { nums, target } of CASES) {
      for (const s of buildTwoSumSteps({ nums, target })) {
        expect(((s.desc.match(/\*\*/g) || []).length) % 2).toBe(0)
      }
    }
  })

  it('i 只增不减（每个元素最多处理一次）', () => {
    for (const { nums, target } of CASES) {
      let prev = -1
      for (const s of buildTwoSumSteps({ nums, target })) {
        if (s.phase === 'done') continue
        expect(s.i).toBeGreaterThanOrEqual(prev)
        prev = s.i
      }
    }
  })

  it('seen 的条目数单调不减', () => {
    for (const { nums, target } of CASES) {
      let prev = 0
      for (const s of buildTwoSumSteps({ nums, target })) {
        const c = Object.keys(s.seen).length
        expect(c).toBeGreaterThanOrEqual(prev)
        prev = c
      }
    }
  })

  it('合法输入下首尾帧结构一致（空数组例外：只有一帧 done）', () => {
    for (const { nums, target } of CASES) {
      const steps = buildTwoSumSteps({ nums, target })
      expect(steps[0].phase).toBe('init')
      expect(steps.at(-1).phase).toBe('done')
    }
    const empty = buildTwoSumSteps({ nums: [], target: 0 })
    expect(empty).toHaveLength(1)
    expect(empty[0].phase).toBe('done')
  })
})
