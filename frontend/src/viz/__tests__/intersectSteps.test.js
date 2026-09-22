import { describe, expect, it } from 'vitest'
import {
  buildIntersectSteps,
  findAnswer,
  sharedLengthOf,
  simulateCrossing,
  uniqueLengthsOf,
} from '../intersectSteps'

// 演示结构（和 state machine 的默认值、文章正文逐字一致）：
//   pool 下标: 0=1  1=2  2=3  3=4  4=5  5=6  6=7
//   A = 1 → 2 → 3 → 4 → 5     独有段 a=3，公共段 c=2
//   B = 6 → 7 → 4 → 5         独有段 b=2，公共段 c=2
const POOL = [1, 2, 3, 4, 5, 6, 7]
const PATH_A = [0, 1, 2, 3, 4]
const PATH_B = [5, 6, 3, 4]

/** 把某个游标当前所在的 pool 下标解出来（渲染层也是这么干的）。 */
function slotOf(step, which) {
  const on = which === 'A' ? step.onA : step.onB
  const i = which === 'A' ? step.iA : step.iB
  const path = on === 'A' ? PATH_A : PATH_B
  return i >= path.length ? null : path[i]
}

const DEMO = () => buildIntersectSteps({ pool: POOL, pathA: PATH_A, pathB: PATH_B })

describe('intersectSteps — 相交判定', () => {
  it('findAnswer 找到共享后缀的第一个节点', () => {
    expect(findAnswer(PATH_A, PATH_B)).toBe(3)
    expect(findAnswer([0, 1, 2], [3, 4])).toBe(null)
    expect(findAnswer([0, 1], [0, 1])).toBe(0)
  })

  it('两个值相同的节点不算相交（必须是同一个节点）', () => {
    // A = 1 → 4，B = 2 → 4，两个 4 是不同节点（pool 下标 3 / 1）
    expect(findAnswer([0, 3], [2, 1])).toBe(null)
  })

  it('只共享一个节点也算相交', () => {
    expect(findAnswer([0, 1, 2], [3, 5, 2])).toBe(2)
  })

  it('a / b / c 分别是两条独有段和公共段的长度', () => {
    expect(uniqueLengthsOf(PATH_A, PATH_B)).toEqual({ a: 3, b: 2, c: 2 })
    expect(sharedLengthOf(PATH_A, PATH_B)).toBe(2)
    expect(uniqueLengthsOf(PATH_A, [3, 4])).toEqual({ a: 3, b: 0, c: 2 })
  })
})

describe('intersectSteps — 双指针往返', () => {
  it('相交时两条游标各走 a + b + c 步，同时落在公共段第一个节点上', () => {
    const { meet, walked, jumpsA, jumpsB } = simulateCrossing(PATH_A, PATH_B)
    expect(meet).toBe(3)
    expect(walked).toBe(3 + 2 + 2) // a + b + c = 7
    expect(jumpsA).toBe(1)
    expect(jumpsB).toBe(1)
  })

  it('不相交时两条游标同时走到 ∅，各换头一次', () => {
    const { meet, walked, jumpsA, jumpsB } = simulateCrossing([0, 1, 2], [3, 4])
    expect(meet).toBe(null)
    expect(walked).toBe(5) // a + b = 3 + 2，两个独有段走完就同时出界
    expect(jumpsA).toBe(1)
    expect(jumpsB).toBe(1)
  })

  it('状态机的结论和 simulateCrossing 一致', () => {
    const last = DEMO().at(-1)
    expect(last.meet).toBe(3)
    expect(last.answer).toBe(3)
    expect(last.done).toBe(true)
    expect(last.phase).toBe('found')
  })
})

describe('intersectSteps — 帧结构', () => {
  it('相交：帧序列 init → walk×4 → jump → walk → jump → walk×2 → found', () => {
    const steps = DEMO()
    expect(steps.map((s) => s.phase)).toEqual([
      'init', 'walk', 'walk', 'walk', 'walk',
      'jump', 'walk', 'jump', 'walk', 'walk', 'found',
    ])
  })

  it('只有最后一帧 done，且每帧的 equal 与游标落点一致', () => {
    const steps = DEMO()
    expect(steps.filter((s) => s.done)).toHaveLength(1)
    for (const s of steps) {
      const a = slotOf(s, 'A')
      const b = slotOf(s, 'B')
      expect(s.equal).toBe(a !== null && b !== null && a === b)
    }
  })

  it('走的过程中两个游标始终处在不同节点，走到最后一格才重合', () => {
    const steps = DEMO()
    const found = steps.at(-1)
    // 最后一个 walk 帧刚好把两个游标推进公共段的第一个节点上，所以它 equal=true
    const walks = steps.filter((s) => s.phase === 'walk')
    for (const s of walks.slice(0, -1)) expect(s.equal).toBe(false)
    expect(walks.at(-1).equal).toBe(true)
    expect(found.equal).toBe(true)
    expect(slotOf(found, 'A')).toBe(3)
    expect(slotOf(found, 'B')).toBe(3)
  })

  it('每一帧最多只有一个游标在换头', () => {
    for (const s of DEMO()) {
      expect(Number(s.jumpsA) + Number(s.jumpsB)).toBeLessThanOrEqual(1)
    }
  })

  it('换头帧带 fromA / fromB，且指向另一条链的第一个节点', () => {
    const jumps = DEMO().filter((s) => s.phase === 'jump')
    expect(jumps).toHaveLength(2)
    // 第一次换头是 pB：它从 B 的尾节点（pool 4 = 值 5）换到 A 的头
    expect(jumps[0].jumpsB).toBe(true)
    expect(jumps[0].fromB).toBe(PATH_B.at(-1))
    expect(slotOf(jumps[0], 'B')).toBe(PATH_A[0])
    // 第二次是 pA：从 A 的尾节点换到 B 的头
    expect(jumps[1].jumpsA).toBe(true)
    expect(jumps[1].fromA).toBe(PATH_A.at(-1))
    expect(slotOf(jumps[1], 'A')).toBe(PATH_B[0])
  })
})

describe('intersectSteps — 边界', () => {
  it('不相交：帧序列以 none 收尾，done 为 true，meet 为 null', () => {
    const steps = buildIntersectSteps({ pool: [1, 2, 3, 4, 5], pathA: [0, 1, 2], pathB: [3, 4] })
    expect(steps.at(-1).phase).toBe('none')
    expect(steps.at(-1).done).toBe(true)
    expect(steps.at(-1).meet).toBe(null)
    expect(steps.at(-1).answer).toBe(null)
  })

  it('两个头节点就是同一个节点：一帧直接找到', () => {
    const steps = buildIntersectSteps({ pool: [1, 2], pathA: [0, 1], pathB: [0, 1] })
    expect(steps.at(-1).phase).toBe('found')
    expect(steps.at(-1).meet).toBe(0)
    expect(steps.at(-1).done).toBe(true)
  })

  it('一条链整段是另一条的后缀（某条独有段为 0）', () => {
    const steps = buildIntersectSteps({ pool: [1, 2, 3], pathA: [0, 1, 2], pathB: [1, 2] })
    expect(steps.at(-1).meet).toBe(1)
    expect(uniqueLengthsOf([0, 1, 2], [1, 2])).toEqual({ a: 1, b: 0, c: 2 })
  })

  it('空链表：一帧返回 null', () => {
    const steps = buildIntersectSteps({ pool: [1], pathA: [], pathB: [0] })
    expect(steps).toHaveLength(1)
    expect(steps[0].phase).toBe('none')
    expect(steps[0].answer).toBe(null)
    expect(steps[0].done).toBe(true)
  })

  it('完全不共享但值有重复：仍然判 null', () => {
    // pool: 0=5  1=6  2=5  3=6  —— A 和 B 的值一模一样，节点却完全不同
    const steps = buildIntersectSteps({ pool: [5, 6, 5, 6], pathA: [0, 1], pathB: [2, 3] })
    expect(steps.at(-1).meet).toBe(null)
    expect(steps.at(-1).phase).toBe('none')
  })
})

describe('intersectSteps — 不变量', () => {
  it('换头次数恒定：每个游标最多换一次（相交与不相交都是）', () => {
    for (const [pa, pb] of [
      [PATH_A, PATH_B],
      [[0, 1, 2], [3, 4]],
      [[0, 1, 2], [1, 2]],
      [[0], [1]],
    ]) {
      const steps = buildIntersectSteps({ pool: [1, 2, 3, 4, 5, 6, 7], pathA: pa, pathB: pb })
      const ja = steps.filter((s) => s.jumpsA).length
      const jb = steps.filter((s) => s.jumpsB).length
      expect(ja).toBeLessThanOrEqual(1)
      expect(jb).toBeLessThanOrEqual(1)
    }
  })

  it('每帧的 (on, i) 都在合法范围内', () => {
    for (const s of DEMO()) {
      for (const which of ['A', 'B']) {
        const on = which === 'A' ? s.onA : s.onB
        const i = which === 'A' ? s.iA : s.iB
        const path = on === 'A' ? PATH_A : PATH_B
        expect(['A', 'B']).toContain(on)
        expect(i).toBeGreaterThanOrEqual(0)
        expect(i).toBeLessThanOrEqual(path.length)
      }
    }
  })

  it('每帧都有非空描述', () => {
    for (const s of DEMO()) {
      expect(typeof s.desc).toBe('string')
      expect(s.desc.length).toBeGreaterThan(10)
    }
  })

  it('游标走过的总步数相等（都是 a + b + c），所以才会同时到达', () => {
    const last = DEMO().at(-1)
    // pA 走完 A 全程（PATH_A.length 步）后换到 B，又在 B 上走了 last.iA 步
    const totalA = PATH_A.length + last.iA
    // pB 走完 B 全程（PATH_B.length 步）后换到 A，又在 A 上走了 last.iB 步
    const totalB = PATH_B.length + last.iB
    expect(totalA).toBe(totalB)
    expect(totalA).toBe(3 + 2 + 2) // a + b + c = 7
  })
})
