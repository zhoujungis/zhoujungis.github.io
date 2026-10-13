/**
 * lc877Steps.js — 「石子游戏」(LC 877) 的状态机：偶数堆时先手必胜，靠奇偶位站队。
 *
 * 规则：一排 piles，两人轮流只能从头部或尾部取一整堆，Alex 先手；堆数是偶数。
 * 结论：先手必胜。做法是开局就「站队」—— 取左端则之后只能拿原始下标为偶数的堆，
 * 取右端则只能拿奇数下标的堆。所以开局算一下两个奇偶类的和，取大的那一队，
 * 并且用第一次取哪一端来锁定它。
 *
 * 状态机模拟一局具体的对弈：Lee 按「两端取较大的那堆」贪心打，Alex 锁定奇偶类。
 * 主例 [5,3,4,5]：偶位和 = 5+4 = 9 > 奇位和 = 3+5 = 8 -> Alex 取左端。
 * 对局：Alex 5 -> Lee 5 -> Alex 4 -> Lee 3，总分 9 : 8。
 *
 * 通用坑：A / V / Z。
 */

const DEFAULT_PILES = [5, 3, 4, 5]

function asPiles(value) {
  if (!Array.isArray(value) || value.length === 0) return DEFAULT_PILES.slice()
  const piles = value.map((v) => Number(v))
  const ok = piles.every((v) => Number.isInteger(v) && v > 0)
  return ok ? piles : DEFAULT_PILES.slice()
}

/**
 * 构造帧序列。
 * @param {{ piles?: number[] }} [options]
 */
export function buildLc877Steps(options = {}) {
  const start = asPiles(options.piles)
  const n = start.length
  const steps = []

  let oddSum = 0
  let evenSum = 0
  for (let i = 0; i < n; i += 1) {
    if (i % 2 === 0) evenSum += start[i]
    else oddSum += start[i]
  }
  const target = evenSum >= oddSum ? 'even' : 'odd'
  const firstEnd = target === 'even' ? 'left' : 'right'

  // 对局模拟：Alex 每一步都取「下标奇偶 = 自己那一队」的那一端（窗口两端必一奇一偶）；
  // Lee 按「两端取较大的那堆」贪心打。
  const targetParity = target === 'even' ? 0 : 1
  const moves = []
  let lo = 0
  let hi = n - 1
  let turn = 0 // 0 = Alex
  let alex = 0
  let lee = 0
  while (lo <= hi) {
    let end
    if (turn === 0) {
      end = lo % 2 === targetParity ? 'left' : 'right'
    } else {
      end = lo === hi ? 'left' : start[hi] > start[lo] ? 'right' : 'left'
    }
    const idx = end === 'left' ? lo : hi
    const val = start[idx]
    if (turn === 0) {
      alex += val
      moves.push({ who: 'alex', end, idx, val, alex, lee })
      if (end === 'left') lo += 1
      else hi -= 1
    } else {
      lee += val
      moves.push({ who: 'lee', end, idx, val, alex, lee })
      if (end === 'left') lo += 1
      else hi -= 1
    }
    turn = 1 - turn
  }

  const snap = (phase, extra) => {
    steps.push({
      phase,
      piles: start.slice(),
      n,
      oddSum,
      evenSum,
      target,
      firstEnd,
      moves: [],
      alex: 0,
      lee: 0,
      answer: null,
      done: false,
      desc: '',
      ...extra,
    })
  }

  snap('init', {
    desc:
      `一排 ${n} 堆石子，两人轮流只能从头部或尾部取一整堆，Alex 先手，堆数是偶数。` +
      `问 Alex 有没有必胜策略。答案是必胜，而且不需要算 DP —— 开局站一次队就定了。`,
  })

  snap('parity', {
    desc:
      `按原始下标分两队：偶数位 ${start.filter((_, i) => i % 2 === 0).join(' + ')} = ${evenSum}，` +
      `奇数位 ${start.filter((_, i) => i % 2 === 1).join(' + ')} = ${oddSum}。` +
      `Alex 取左端，之后就只能拿偶数位；取右端就只能拿奇数位 —— 所以取大的那一队（${target === 'even' ? '偶数位' : '奇数位'}），` +
      `第一步取${firstEnd === 'left' ? '左' : '右'}端来锁定。`,
  })

  for (let k = 0; k < moves.length; k += 1) {
    const m = moves[k]
    snap('take', {
      moves: moves.slice(0, k + 1),
      alex: m.alex,
      lee: m.lee,
      desc:
        `${m.who === 'alex' ? 'Alex' : 'Lee'} 从${m.end === 'left' ? '左' : '右'}端取走 ${m.val}` +
        `（原下标 ${m.idx}，${m.idx % 2 === 0 ? '偶数位' : '奇数位'}）。` +
        `比分 Alex ${m.alex} : ${m.lee} Lee。` +
        (m.who === 'lee'
          ? `注意 Lee 不管怎么取，剩下的两端都还是 Alex 锁定那一队的下标。`
          : `这一步把 Alex 锁死在${target === 'even' ? '偶数位' : '奇数位'}这一队。`),
    })
  }

  snap('done', {
    moves: moves.slice(),
    alex: moves[moves.length - 1].alex,
    lee: moves[moves.length - 1].lee,
    answer: true,
    done: true,
    desc:
      `终局 Alex ${alex} : ${lee} Lee —— 先手必胜。关键不在算得准，而在**开局就放弃一半的石子**：` +
      `堆数为偶数时，先手第一次取哪一端，就把自己钉死在一条奇偶带上，` +
      `选和大的那条即可。堆数为奇数时这个 trick 失效，必须老老实实上区间 DP。`,
  })

  return steps
}
