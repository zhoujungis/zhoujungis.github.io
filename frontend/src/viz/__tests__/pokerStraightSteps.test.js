import { describe, expect, it } from 'vitest'

import { buildPokerStraightSteps, cardName, judgeStraight } from '../pokerStraightSteps.js'

/** 独立参考解：排序 + 数王补洞（与被测实现同思路但独立书写）。 */
function refJudge(cards) {
  const s = [...cards].sort((a, b) => a - b)
  const zeros = s.filter((c) => c === 0).length
  const rest = s.filter((c) => c !== 0)
  if (new Set(rest).size !== rest.length) return false
  let need = 0
  for (let i = 0; i < rest.length - 1; i += 1) need += Math.max(0, rest[i + 1] - rest[i] - 1)
  return zeros >= need
}

/** 独立暴力解：枚举每张王的所有填法（1~13，王之间也可重复但顺子内必须互异），
 *  任一种成顺子即可。与 judgeStraight 思路完全不同。 */
function bruteJudge(cards) {
  const zeros = cards.filter((c) => c === 0).length
  const rest = cards.filter((c) => c !== 0)
  const fill = (k, chosen) => {
    if (k === zeros) {
      const all = [...rest, ...chosen]
      if (new Set(all).size !== 5) return false
      const s = all.sort((a, b) => a - b)
      return s.every((v, i) => i === 0 || v - s[i - 1] === 1)
    }
    for (let v = 1; v <= 13; v += 1) {
      if (fill(k + 1, [...chosen, v])) return true
    }
    return false
  }
  return fill(0, [])
}

const last = (cards) => {
  const s = buildPokerStraightSteps({ cards })
  return s[s.length - 1]
}

describe('扑克牌顺子 · 主例 [3,0,7,5,4]', () => {
  it('7 帧：init / sort / jokers / gap×3 / done', () => {
    const steps = buildPokerStraightSteps({ cards: [3, 0, 7, 5, 4] })
    expect(steps.map((s) => s.phase)).toEqual(['init', 'sort', 'jokers', 'gap', 'gap', 'gap', 'done'])
  })

  it('一王补一个洞，正好用完：need=1、remaining=0、结果 true', () => {
    const f = last([3, 0, 7, 5, 4])
    expect(f.result).toBe(true)
    expect(f.zeros).toBe(1)
    expect(f.need).toBe(1)
    expect(f.remaining).toBe(0)
    expect(f.failReason).toBe(null)
    expect(f.segment.filled.map((x) => x.value)).toEqual([3, 4, 5, 6, 7])
    expect(f.segment.filled.filter((x) => x.byJoker).map((x) => x.value)).toEqual([6])
  })

  it('连续段逐帧增长：3 → 3-4 → 3-4-5 → 3-4-5-王6-7', () => {
    const steps = buildPokerStraightSteps({ cards: [3, 0, 7, 5, 4] })
    const seen = steps
      .filter((s) => s.segment)
      .map((s) => s.segment.filled.map((x) => (x.byJoker ? `王${x.value}` : x.value)).join('-'))
    expect(seen[seen.length - 1]).toBe('3-4-5-王6-7')
    expect(seen).toContain('3')
    expect(seen).toContain('3-4')
    expect(seen).toContain('3-4-5')
  })

  it('三个相邻对：前两个差 1 不耗王，第三个差 2 耗 1 张', () => {
    const steps = buildPokerStraightSteps({ cards: [3, 0, 7, 5, 4] })
    const gaps = steps.filter((s) => s.phase === 'gap')
    expect(gaps.map((g) => g.checked[g.checked.length - 1].kind)).toEqual(['tight', 'tight', 'filled'])
    expect(gaps.map((g) => g.checked[g.checked.length - 1].gap)).toEqual([1, 1, 2])
    expect(gaps.map((g) => g.remaining)).toEqual([1, 1, 0])
  })
})

describe('扑克牌顺子 · 判定函数与双参考解交叉', () => {
  const CASES = [
    [[1, 2, 3, 4, 5], true],
    [[9, 10, 11, 12, 13], true],
    [[1, 2, 3, 4, 6], false],
    [[1, 2, 2, 3, 4], false],
    [[13, 1, 2, 3, 4], false],
    [[0, 0, 1, 2, 5], true],
    [[0, 0, 1, 2, 3], true],
    [[0, 0, 0, 0, 0], true],
    [[0, 1, 2, 3, 4], true],
    [[0, 1, 2, 4, 6], false],
    [[0, 0, 1, 2, 13], false],
    [[0, 0, 2, 2, 5], false],
    [[0, 3, 4, 5, 7], true],
    [[0, 9, 10, 11, 12], true],
    [[0, 0, 9, 10, 12], true],
    [[0, 0, 1, 2, 6], false],
    [[0, 0, 0, 1, 13], false],
    [[5, 4, 3, 2, 1], true],
  ]

  it('18 个典型用例逐一命中', () => {
    for (const [cards, want] of CASES) {
      expect(judgeStraight(cards).result, JSON.stringify(cards)).toBe(want)
    }
  })

  it('与参考解全量对拍：0~13 五张可重组合 8568 组', () => {
    let total = 0
    const rec = (cur, start) => {
      if (cur.length === 5) {
        total += 1
        expect(judgeStraight(cur).result, JSON.stringify(cur)).toBe(refJudge(cur))
        return
      }
      for (let v = start; v <= 13; v += 1) rec([...cur, v], v)
    }
    rec([], 0)
    expect(total).toBe(8568)
  })

  it('与暴力解对拍：枚举王的填法（含王组合抽样 400 组）', () => {
    let tested = 0
    const rec = (cur, start) => {
      if (cur.length === 5) {
        // 只抽样带王的组合（无王组合太密集，留给全量对拍）
        if (cur.includes(0) && tested < 400) {
          expect(judgeStraight(cur).result, JSON.stringify(cur)).toBe(bruteJudge(cur))
          tested += 1
        }
        return
      }
      for (let v = start; v <= 13; v += 1) rec([...cur, v], v)
    }
    rec([], 0)
    expect(tested).toBe(400)
  })
})

describe('扑克牌顺子 · 帧级不变量', () => {
  const INPUTS = [
    [3, 0, 7, 5, 4],
    [1, 2, 3, 4, 5],
    [0, 0, 1, 2, 5],
    [1, 2, 2, 3, 4],
    [0, 0, 1, 2, 6],
    [0, 0, 0, 0, 0],
    [0, 1, 2, 4, 6],
    [13, 12, 11, 10, 9],
  ]

  it('只有 done 帧给结论；done 结论与 judgeStraight 一致', () => {
    for (const cards of INPUTS) {
      const steps = buildPokerStraightSteps({ cards })
      for (const s of steps) {
        if (s.phase === 'done') expect(s.result).toBe(judgeStraight(cards).result)
        else expect(s.result).toBe(null)
      }
    }
  })

  it('need 恒等于已消耗洞数；成功时 remaining = zeros - need', () => {
    for (const cards of INPUTS) {
      for (const s of buildPokerStraightSteps({ cards })) {
        const consumed = s.checked.reduce((acc, c) => acc + (c.consumed || 0), 0)
        expect(s.need).toBe(consumed)
        if (s.failReason === null) expect(s.remaining).toBe(s.zeros - consumed)
      }
    }
  })

  it('checked 的长度驱动 pairIndex（最后一对即当前对）', () => {
    for (const cards of INPUTS) {
      for (const s of buildPokerStraightSteps({ cards })) {
        expect(s.pairIndex).toBe(s.checked.length > 0 ? s.checked[s.checked.length - 1].index : -1)
      }
    }
  })

  it('失败帧必停在失败那一对，且 failReason 非空', () => {
    const dupSteps = buildPokerStraightSteps({ cards: [1, 2, 2, 3, 4] })
    const dupLast = dupSteps[dupSteps.length - 1]
    expect(dupLast.phase).toBe('done')
    expect(dupLast.result).toBe(false)
    expect(dupLast.failReason).toBe('dup')
    expect(dupLast.checked[dupLast.checked.length - 1].kind).toBe('dup')

    const shortSteps = buildPokerStraightSteps({ cards: [0, 1, 2, 4, 6] })
    const shortLast = shortSteps[shortSteps.length - 1]
    expect(shortLast.result).toBe(false)
    expect(shortLast.failReason).toBe('gap')
    // 王按从左到右顺序补洞：2→4 的洞先补掉，到 4→6 才耗尽
    expect(shortLast.checked.map((c) => c.kind)).toEqual(['tight', 'filled', 'short'])
    expect(shortLast.need).toBe(2)
    expect(shortLast.remaining).toBe(0)
    expect(shortLast.segment.filled.filter((f) => f.byJoker).map((f) => f.value)).toEqual([3])
  })
})

describe('扑克牌顺子 · 边界与非法输入', () => {
  it('全王：没有非王牌也判 true（任意 5 张）', () => {
    const steps = buildPokerStraightSteps({ cards: [0, 0, 0, 0, 0] })
    expect(steps[steps.length - 1].result).toBe(true)
    expect(steps[steps.length - 1].rest).toEqual([])
  })

  it('无王差一个数：false，且不消耗任何东西', () => {
    const f = last([1, 2, 3, 4, 6])
    expect(f.result).toBe(false)
    expect(f.need).toBe(1)
    expect(f.zeros).toBe(0)
  })

  it('非法输入回退默认牌 [3,0,7,5,4]', () => {
    const def = buildPokerStraightSteps({})
    expect(def[0].input).toEqual([3, 0, 7, 5, 4])
    for (const bad of [[1, 2, 3], [1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 14], [0, 1, 2, 3, -1], [0, 1, 2, 3, 4.5], null, 'x', 42]) {
      const steps = buildPokerStraightSteps({ cards: bad })
      expect(steps[0].input, JSON.stringify(bad)).toEqual([3, 0, 7, 5, 4])
    }
  })

  it('cardName：0→王，11→J，12→Q，13→K，其余原样', () => {
    expect([0, 1, 10, 11, 12, 13].map(cardName)).toEqual(['王', '1', '10', 'J', 'Q', 'K'])
  })
})

describe('扑克牌顺子 · 三个官方样例抓不住的 bug（可执行证明）', () => {
  // 与 bug 动画状态机同款的可执行判据
  const bugNoDup = (cards) => {
    const rest = cards.filter((c) => c !== 0)
    return rest.length === 0 || Math.max(...rest) - Math.min(...rest) < 5
  }
  const bugLe5 = (cards) => {
    const rest = cards.filter((c) => c !== 0)
    return rest.length === 0 || Math.max(...rest) - Math.min(...rest) <= 5
  }
  const bugJokerPairs = (cards) => {
    const s = [...cards].sort((a, b) => a - b)
    const zeros = s.filter((c) => c === 0).length
    let gap = 0
    for (let i = 1; i < s.length; i += 1) gap += s[i] - s[i - 1] - 1
    return gap <= zeros
  }

  const SAMPLES = [
    [1, 2, 3, 4, 5],
    [0, 0, 1, 2, 5],
  ]

  it('两个官方样例在三个错法下全部返回 true（失声）', () => {
    for (const s of SAMPLES) {
      expect(judgeStraight(s).result).toBe(true)
      expect(bugNoDup(s)).toBe(true)
      expect(bugLe5(s)).toBe(true)
      expect(bugJokerPairs(s)).toBe(true)
    }
  })

  it('最小反例：[1,2,2,3,4] 不判重错判 true', () => {
    expect(judgeStraight([1, 2, 2, 3, 4]).result).toBe(false)
    expect(bugNoDup([1, 2, 2, 3, 4])).toBe(true)
  })

  it('最小反例：[1,2,3,4,6] 判据 ≤5 错判 true', () => {
    expect(judgeStraight([1, 2, 3, 4, 6]).result).toBe(false)
    expect(bugLe5([1, 2, 3, 4, 6])).toBe(true)
  })

  it('最小反例：[0,0,1,2,6] 王算相邻对错判 true', () => {
    expect(judgeStraight([0, 0, 1, 2, 6]).result).toBe(false)
    expect(bugJokerPairs([0, 0, 1, 2, 6])).toBe(true)
  })

  it('[0,0,1,2,6] 的负 gap 账：0-0 对贡献 -1，抵掉一个洞', () => {
    const s = [0, 0, 1, 2, 6]
    const gaps = s.slice(1).map((c, i) => c - s[i] - 1)
    expect(gaps).toEqual([-1, 0, 0, 3])
    expect(gaps.reduce((a, b) => a + b, 0)).toBe(2) // 账上只有 2，实际需要 3
  })
})
