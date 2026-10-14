/**
 * pokerStraightSteps.js — 「扑克牌顺子」(LC 61 / 剑指 61) 的状态机：排序 + 数王补洞。
 *
 * 题目：5 张牌，牌面 1~13，判断是不是顺子（连续 5 张）。
 * 追问：含大小王（0 可当任意牌）的版本 —— 本状态机直接讲含王版，
 * 无王版是「王 = 0 张」的特例。
 *
 * 算法（剑指标准解）：
 *   1. 排序，大小王（0）自然浮到最前；
 *   2. 数王：zeros 张王 = zeros 次「任意填」机会；
 *   3. 非王牌从左往右逐对检查相邻差 gap：
 *        gap = 0 → 有重复，王救不了重复，直接 false；
 *        gap = 1 → 天然连续，不消耗王；
 *        gap > 1 → 中间缺 gap - 1 个数，要拿王补；
 *   4. 需要的洞 <= 王数 → true，否则 false。
 *
 * 为什么「重复」必须单独查：顺子是 5 个互不相同的数，
 * 王能填「缺失的数」，但填不了「已经出现过的数」。
 *
 * 帧序列：init + sort + jokers + 每个相邻非王对 1 帧（gap）+ done。
 * done 帧不复写语义字段（坑 J）：result 是真实判定，指针类字段保持最后一拍的值。
 *
 * 通用坑：A / V / X。
 */

const DEFAULT_CARDS = [3, 0, 7, 5, 4] // 乱序输入，排序后 [0,3,4,5,7]

export function cardName(c) {
  if (c === 0) return '王'
  if (c === 11) return 'J'
  if (c === 12) return 'Q'
  if (c === 13) return 'K'
  return String(c)
}

function isLegalCards(cards) {
  return (
    Array.isArray(cards) &&
    cards.length === 5 &&
    cards.every((c) => Number.isInteger(c) && c >= 0 && c <= 13)
  )
}

export function judgeStraight(cards) {
  /** 与状态机同源的判定函数（单测里与独立参考解交叉验证用）。 */
  const s = [...cards].sort((a, b) => a - b)
  const zeros = s.filter((c) => c === 0).length
  const rest = s.filter((c) => c !== 0)
  if (new Set(rest).size !== rest.length) {
    return { result: false, failReason: 'dup', zeros, rest, need: 0 }
  }
  let need = 0
  for (let i = 0; i < rest.length - 1; i += 1) {
    need += Math.max(0, rest[i + 1] - rest[i] - 1)
  }
  return { result: zeros >= need, failReason: zeros >= need ? null : 'gap', zeros, rest, need }
}

export function buildPokerStraightSteps(options = {}) {
  // 演示规模就是 5 张：输入非法（长度不对 / 越界 / 非整数）回退默认值。
  const input = isLegalCards(options.cards) ? options.cards.slice() : DEFAULT_CARDS.slice()

  const sorted = [...input].sort((a, b) => a - b)
  const zeros = sorted.filter((c) => c === 0).length
  const rest = sorted.filter((c) => c !== 0)

  const steps = []
  const pairs = []
  for (let i = 0; i < rest.length - 1; i += 1) {
    pairs.push({ index: i, a: rest[i], b: rest[i + 1], gap: rest[i + 1] - rest[i] })
  }

  // 运行中的状态
  let remaining = zeros
  let need = 0
  let failReason = null
  let stopped = false
  const checked = [] // 已处理完的相邻对记录
  // 当前已接上的连续段（实时进 snap，失败时也能看到接上的前缀）
  let segStart = rest.length > 0 ? rest[0] : 0
  let segFilled = rest.length > 0 ? [{ value: rest[0], byJoker: false }] : []

  const currentSegment = () =>
    segFilled.length > 0
      ? {
          from: segStart,
          to: segFilled[segFilled.length - 1].value,
          filled: segFilled.map((f) => ({ ...f })),
        }
      : null

  const snap = (phase, extra) => {
    steps.push({
      phase,
      input,
      sorted,
      zeros,
      rest,
      pairCount: pairs.length,
      pairIndex: checked.length > 0 ? checked[checked.length - 1].index : -1,
      gap: checked.length > 0 ? checked[checked.length - 1].gap : 0,
      need,
      remaining,
      failReason,
      result: null, // 只有 done 帧给结论（坑 J：中间帧不下判定）
      checked: checked.map((p) => ({ ...p })),
      segment: currentSegment(),
      done: phase === 'done',
      desc: '',
      ...extra,
    })
  }

  snap('init', {
    desc:
      `手里 5 张牌：${input.map(cardName).join('、')}。规则：牌面 1~13，` +
      `5 张连续算顺子；大小王（0）可以当任意牌。先排序，让王浮到最前、` +
      `牌按大小排好 —— 顺子的判断就变成「相邻两张差多少、王够不够补」一件事。`,
  })

  snap('sort', {
    desc: `排序后：${sorted.map(cardName).join('、')}。王排在开头，非王牌 ${rest.length} 张升序排列。` +
      (rest.length > 0
        ? `接下来只看非王牌之间相邻的差。`
        : `全是王，任意 5 张都是顺子。`),
  })

  if (zeros > 0) {
    snap('jokers', {
      desc: `数一下王：${zeros} 张。每张王就是一次「任意填」的机会 —— ` +
        `后面每发现一个断档，就填一张王进去。王用完还不够，就不是顺子。`,
    })
  } else {
    snap('jokers', {
      desc: `没有王。5 张非王牌必须严丝合缝地连续，任何断档都补不上。`,
    })
  }

  for (const pair of pairs) {
    if (stopped) break
    const gap = pair.gap
    if (gap === 0) {
      failReason = 'dup'
      stopped = true
      checked.push({ ...pair, kind: 'dup', consumed: 0 })
      snap('gap', {
        desc: `${pair.a} 和 ${pair.b} 一样大 —— 非王牌里有重复。` +
          `顺子要求 5 个互不相同的数，王能填「缺的数」，填不了「已有的数」，` +
          `重复无解，直接判定不是顺子。`,
      })
      break
    }
    if (gap === 1) {
      checked.push({ ...pair, kind: 'tight', consumed: 0 })
      segFilled.push({ value: pair.b, byJoker: false })
      snap('gap', {
        desc: `${pair.a} 到 ${pair.b} 差 1，天然连续，不用王。当前已接上 ${segFilled.map((f) => cardName(f.value)).join('-')}。`,
      })
      continue
    }
    const holes = gap - 1
    if (remaining >= holes) {
      remaining -= holes
      need += holes
      checked.push({ ...pair, kind: 'filled', consumed: holes })
      for (let v = pair.a + 1; v < pair.b; v += 1) {
        segFilled.push({ value: v, byJoker: true })
      }
      segFilled.push({ value: pair.b, byJoker: false })
      snap('gap', {
        desc: `${pair.a} 到 ${pair.b} 差了 ${gap}，中间缺 ${holes} 个数（${Array.from({ length: holes }, (_, k) => pair.a + 1 + k).map(cardName).join('、')}）。` +
          `拿 ${holes} 张王补上，王还剩 ${remaining} 张。当前已接上 ${segFilled.map((f) => cardName(f.value)).join('-')}。`,
      })
      continue
    }
    // 王不够
    failReason = 'gap'
    stopped = true
    need += holes
    checked.push({ ...pair, kind: 'short', consumed: holes })
    snap('gap', {
      desc: `${pair.a} 到 ${pair.b} 差了 ${gap}，中间缺 ${holes} 个数，但王只剩 ${remaining} 张 —— ` +
        `补不上这个断档，判定不是顺子。`,
    })
    break
  }

  const verdict = failReason ? false : need <= zeros
  snap('done', {
    result: verdict,
    failReason: verdict ? null : failReason,
    desc: verdict
      ? `${rest.length} 张非王牌全部接上，一共需要补 ${need} 个洞，${zeros} 张王刚好够用` +
        (remaining > 0 ? `（还剩 ${remaining} 张王没用完）` : `（一张不剩，正好用完）`) +
        `。拼出来是 ${segFilled.map((f) => cardName(f.value)).join('-')} —— 连续 5 张，是顺子。`
      : failReason === 'dup'
        ? `非王牌里有重复，王救不了 —— 不是顺子。`
        : `断档太多、王不够补 —— 不是顺子。`,
  })

  return steps
}
