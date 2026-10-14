/**
 * pokerStraightBugSteps.js — 「扑克牌顺子」的 bug 对照状态机。
 *
 * 三个「官方样例抓不住」的错法，全部朝同一个方向错：放得太宽，把不是顺子的
 * 判成顺子。每组给出：牌面、正解判定（false）、bug 判定（true）、bug 为什么
 * 在这组牌上失手。两个 bug 函数都是可执行的 —— 单测里直接跑，证明「错法过
 * 样例、错法挂反例」。
 *
 * 官方样例（LC 61）：[1,2,3,4,5] 与 [0,0,1,2,5]。
 * 三个 bug 在两组样例上全部返回 true（与正解一致），所以样例一声不响；
 * 各自的最小反例：
 *   bug 1 不判重复      [1,2,2,3,4] 非王跨度 3 < 5，看不见两个 2
 *   bug 2 判据 <= 5     [1,2,3,4,6] 跨度 5 无王，≤5 放它过去
 *   bug 3 王算相邻对    [0,0,1,2,6] 0-0 这对产生 -1 的负 gap，抵掉一个洞
 *
 * 帧序列：init + 每组 2 帧（hand 牌面 / verdict 判定对照）+ done，共 8 帧。
 *
 * 通用坑：A / V / X。
 */

import { cardName, judgeStraight } from './pokerStraightSteps.js'

const GROUPS = [
  {
    key: 'no-dup',
    cards: [1, 2, 2, 3, 4],
    bugName: '不判重复',
    bugCode: '只看 max(非王) - min(非王) < 5',
    bugWhy:
      '非王牌跨度只有 3，判据看都不看重复就放行了。顺子是 5 个互不相同的数 —— ' +
      '王能填「缺的数」，填不了「已有的数」，重复出现时再多王也无解。',
  },
  {
    key: 'le5',
    cards: [1, 2, 3, 4, 6],
    bugName: '判据写成 ≤ 5',
    bugCode: 'max(非王) - min(非王) <= 5',
    bugWhy:
      '跨度正好 5，≤ 5 把它放了过去。5 张无王的牌要连续，跨度必须恰好是 4 —— ' +
      '跨度 5 意味着中间差着一个数（这里是 5），没有王来补。',
  },
  {
    key: 'joker-pairs',
    cards: [0, 0, 1, 2, 6],
    bugName: '王也算进相邻对',
    bugCode: 'for i in 1..4: gap += nums[i] - nums[i-1] - 1',
    bugWhy:
      '遍历从下标 1 开始，0 和 0 这对也被算了进去：0 - 0 - 1 = -1。两张王各贡献 ' +
      '-1 的负 gap，把 2 → 6 需要的 3 个洞抵成 1 个，2 张王「刚好够」—— ' +
      '其实 3、4、5 三个数一张王都补不上。',
  },
]

/** 可执行的三个 bug 判据（单测直接跑）。 */
export function bugNoDup(cards) {
  const rest = cards.filter((c) => c !== 0)
  if (rest.length === 0) return true
  return Math.max(...rest) - Math.min(...rest) < 5
}

export function bugLe5(cards) {
  const rest = cards.filter((c) => c !== 0)
  if (rest.length === 0) return true
  return Math.max(...rest) - Math.min(...rest) <= 5
}

export function bugJokerPairs(cards) {
  const s = [...cards].sort((a, b) => a - b)
  const zeros = s.filter((c) => c === 0).length
  let gap = 0
  for (let i = 1; i < s.length; i += 1) {
    gap += s[i] - s[i - 1] - 1
  }
  return gap <= zeros
}

const BUG_FN = { 'no-dup': bugNoDup, le5: bugLe5, 'joker-pairs': bugJokerPairs }

const OFFICIAL_SAMPLES = [
  [1, 2, 3, 4, 5],
  [0, 0, 1, 2, 5],
]

export function buildPokerStraightBugSteps() {
  const steps = []

  const snap = (phase, extra) => {
    steps.push({ phase, groupIndex: -1, group: null, done: phase === 'done', desc: '', ...extra })
  }

  snap('init', {
    desc:
      `官方样例只有两组：[1,2,3,4,5] 和 [0,0,1,2,5]，都返回 true。` +
      `下面三个错法在这两组样例上全部失声，各配一个最小反例 —— ` +
      `注意三个错法的方向一致：把不是顺子的牌放过去。`,
  })

  GROUPS.forEach((group, gi) => {
    const sorted = [...group.cards].sort((a, b) => a - b)
    const zeros = sorted.filter((c) => c === 0).length
    const rest = sorted.filter((c) => c !== 0)
    const span = rest.length > 0 ? Math.max(...rest) - Math.min(...rest) : 0
    const judge = judgeStraight(group.cards)
    const bugFn = BUG_FN[group.key]
    const bugVerdict = bugFn(group.cards)
    const silent = OFFICIAL_SAMPLES.every((s) => bugFn(s) === judgeStraight(s).result)

    snap('hand', {
      groupIndex: gi,
      group: {
        ...group,
        sorted,
        zeros,
        rest,
        span,
        correct: judge.result,
        correctReason: judge.failReason === 'dup' ? '非王牌有重复' : '断档补不上',
        bugVerdict,
        silent,
        pairGaps:
          group.key === 'joker-pairs'
            ? sorted.slice(1).map((c, i) => c - sorted[i] - 1)
            : null,
      },
      desc:
        `第 ${gi + 1} 组：${sorted.map(cardName).join('、')}。` +
        (zeros > 0 ? `王 ${zeros} 张，非王 ${rest.map(cardName).join('、')}（跨度 ${span}）。` : `无王，跨度 ${span}。`) +
        `错法「${group.bugName}」：${group.bugCode}。`,
    })

    snap('verdict', {
      groupIndex: gi,
      group: {
        ...group,
        sorted,
        zeros,
        rest,
        span,
        correct: judge.result,
        correctReason: judge.failReason === 'dup' ? '非王牌有重复' : '断档补不上',
        bugVerdict,
        silent,
        pairGaps:
          group.key === 'joker-pairs'
            ? sorted.slice(1).map((c, i) => c - sorted[i] - 1)
            : null,
      },
      desc:
        `正解：${judge.result ? '是顺子' : `不是顺子（${judge.failReason === 'dup' ? '非王牌有重复' : `需要补 ${judge.need} 个洞，王只有 ${zeros} 张`}）`}。` +
        `错法「${group.bugName}」判成 ${bugVerdict ? '是顺子' : '不是顺子'} —— ${bugVerdict !== judge.result ? '判错了' : '这组碰巧一致'}。` +
        group.bugWhy +
        (silent ? `（两组官方样例在这个错法下都返回 true，抓不住它。）` : ''),
    })
  })

  snap('done', {
    desc:
      `三个错法一个共同点：只盯着「跨度」，忘了顺子还有「不重复」和「王只补缺失」` +
      `两条约束。测顺子题必备的三组反例：[1,2,2,3,4]（重复）、[1,2,3,4,6]（跨 5 无王）、` +
      `[0,0,1,2,6]（王被负 gap 抵掉）。`,
  })

  return steps
}
