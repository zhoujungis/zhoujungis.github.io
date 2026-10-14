import { describe, expect, it } from 'vitest'

import { buildPokerStraightBugSteps, bugJokerPairs, bugLe5, bugNoDup } from '../pokerStraightBugSteps.js'
import { cardName, judgeStraight } from '../pokerStraightSteps.js'

const SAMPLES = [
  [1, 2, 3, 4, 5],
  [0, 0, 1, 2, 5],
]

const withGroup = () => buildPokerStraightBugSteps().filter((s) => s.group)

describe('bug 对照 · 帧序列', () => {
  it('8 帧：init + 三组各 2 帧（hand/verdict）+ done', () => {
    const steps = buildPokerStraightBugSteps()
    expect(steps.map((s) => (s.groupIndex >= 0 ? `${s.phase}#${s.groupIndex}` : s.phase))).toEqual([
      'init',
      'hand#0',
      'verdict#0',
      'hand#1',
      'verdict#1',
      'hand#2',
      'verdict#2',
      'done',
    ])
  })

  it('三组反例的元数据：正解全 false、错法全 true、样例全失声', () => {
    const groups = withGroup().filter((s) => s.phase === 'verdict').map((s) => s.group)
    expect(groups.length).toBe(3)
    for (const g of groups) {
      expect(g.correct, g.cards.join(',')).toBe(false)
      expect(g.bugVerdict, g.cards.join(',')).toBe(true)
      expect(g.silent, g.cards.join(',')).toBe(true)
    }
    expect(groups.map((g) => g.cards)).toEqual([
      [1, 2, 2, 3, 4],
      [1, 2, 3, 4, 6],
      [0, 0, 1, 2, 6],
    ])
  })

  it('hand 帧与 verdict 帧携带同一份牌面数据', () => {
    for (const s of buildPokerStraightBugSteps()) {
      if (!s.group) continue
      expect(s.group.sorted).toEqual([...s.group.cards].sort((a, b) => a - b))
      expect(s.group.correct).toBe(judgeStraight(s.group.cards).result)
      expect(s.group.bugVerdict).toBe(
        s.group.key === 'no-dup'
          ? bugNoDup(s.group.cards)
          : s.group.key === 'le5'
            ? bugLe5(s.group.cards)
            : bugJokerPairs(s.group.cards),
      )
    }
  })

  it('joker-pairs 组的 pairGaps = [-1,0,0,3]（负 gap 是洞被抵掉的原因）', () => {
    const g = withGroup().find((s) => s.group.key === 'joker-pairs').group
    expect(g.pairGaps).toEqual([-1, 0, 0, 3])
  })
})

describe('bug 对照 · 可执行判据', () => {
  it('三个错法在两组官方样例上全部失声', () => {
    for (const s of SAMPLES) {
      expect(judgeStraight(s).result).toBe(true)
      expect(bugNoDup(s)).toBe(true)
      expect(bugLe5(s)).toBe(true)
      expect(bugJokerPairs(s)).toBe(true)
    }
  })

  it('三个错法在各自反例上全部错判 true', () => {
    expect(bugNoDup([1, 2, 2, 3, 4])).toBe(true)
    expect(bugLe5([1, 2, 3, 4, 6])).toBe(true)
    expect(bugJokerPairs([0, 0, 1, 2, 6])).toBe(true)
  })

  it('三个错法在跨度足够的 false 输入上不误伤', () => {
    // 注意 [2,2,2,2,2] 这类「全同」不在此列：不判重的错法看跨度 0 照样放行，
    // 那是比 [1,2,2,3,4] 更明显的误伤。这里只断言「跨度足够大时三个错法都能拦住」。
    for (const cards of [[1, 3, 5, 7, 9], [0, 0, 0, 1, 13], [1, 2, 3, 8, 9]]) {
      expect(judgeStraight(cards).result, cards.join(',')).toBe(false)
      expect(bugNoDup(cards), cards.join(',')).toBe(false)
      expect(bugLe5(cards), cards.join(',')).toBe(false)
      expect(bugJokerPairs(cards), cards.join(',')).toBe(false)
    }
  })
})

describe('bug 对照 · 牌名', () => {
  it('cardName 覆盖王与 J/Q/K', () => {
    expect([0, 11, 12, 13].map(cardName)).toEqual(['王', 'J', 'Q', 'K'])
  })
})
