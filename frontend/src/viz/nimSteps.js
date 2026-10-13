/**
 * nimSteps.js — 「Nim 博弈」的状态机：一行异或判定先手必胜，以及制胜一手怎么找。
 *
 * 规则：N 堆石子，两人轮流从某一堆里取任意正数个，取到最后一个石子的人胜；
 * 无法操作（所有堆为空）者败。
 *
 * Bouton 定理：先手必胜 当且仅当 所有堆数量的异或不为 0。
 * 制胜一手：取异或结果的最高置位 bit h，找一堆 p 使得 (p >> h) & 1 === 1，
 * 把它改成 p ^ x —— 新局面异或为 0，是必败态，留给后手。
 *
 * 通用坑：A / V / Z（反引号一层）。
 */

const DEFAULT_PILES = [3, 4, 5]

function asPiles(value) {
  if (!Array.isArray(value) || value.length === 0) return DEFAULT_PILES.slice()
  const piles = value.map((v) => Number(v))
  const ok = piles.every((v) => Number.isInteger(v) && v >= 0)
  return ok ? piles : DEFAULT_PILES.slice()
}

function pickMove(piles, x) {
  if (x === 0) return null
  let h = 0
  for (let b = 0; b < 31; b += 1) {
    if ((x >> b) & 1) h = b
  }
  for (let i = 0; i < piles.length; i += 1) {
    if ((piles[i] >> h) & 1) return { idx: i, bit: h, newVal: piles[i] ^ x }
  }
  return null
}

/**
 * 构造帧序列。
 * @param {{ piles?: number[] }} [options]
 */
export function buildNimSteps(options = {}) {
  const piles = asPiles(options.piles)
  const n = piles.length
  const steps = []

  const snap = (phase, extra) => {
    steps.push({
      phase,
      piles: piles.slice(),
      n,
      run: null,
      x: null,
      move: null,
      result: null,
      resultXor: null,
      answer: null,
      done: false,
      desc: '',
      ...extra,
    })
  }

  snap('init', {
    desc:
      `开局 ${n} 堆：(${piles.join(', ')})。轮流从某一堆取任意正数个，拿到最后一个石子的人胜。` +
      `判断先手能不能必胜，靠的不是搜索，是一个数：把所有堆异或起来。`,
  })

  // 逐堆异或累加
  let run = 0
  for (let i = 0; i < n; i += 1) {
    run ^= piles[i]
    snap('xor', {
      i,
      run,
      x: i === n - 1 ? run : null,
      desc:
        `异或第 ${i + 1} 堆：${piles[i]}（二进制 ${piles[i].toString(2).padStart(4, '0')}）` +
        `，累计异或 = ${run}。`,
    })
  }

  const x = run
  if (x === 0) {
    snap('done', {
      x: 0,
      answer: false,
      resultXor: 0,
      done: true,
      desc:
        `异或结果是 0 —— 这是必败态。后手只要每一步都照着镜像走（你动哪堆，他就把那堆改成让异或回到 0），` +
        `先手无论怎么取，异或都会重新变成非 0。所以先手必败。`,
    })
    return steps
  }

  const move = pickMove(piles, x)
  snap('pick', {
    x,
    move,
    desc:
      `异或结果 x = ${x}（二进制 ${x.toString(2)}）。制胜一步的找法：取 x 的最高置位 ` +
      `bit ${move.bit}，找一堆在这一位上为 1 的石子 —— 第 ${move.idx + 1} 堆（${piles[move.idx]}）就是。` +
      `把它改成 ${piles[move.idx]} ^ ${x} = ${move.newVal}。`,
  })

  const after = piles.slice()
  after[move.idx] = move.newVal
  const afterXor = after.reduce((a, b) => a ^ b, 0)
  snap('take', {
    x,
    move,
    result: after,
    resultXor: afterXor,
    desc:
      `从第 ${move.idx + 1} 堆取走 ${piles[move.idx] - move.newVal} 个，剩下 ${move.newVal} 个。` +
      `新局面 (${after.join(', ')}) 的异或 = ${afterXor} —— 必败态交到后手手里。` +
      `这就是「后手怎么走都赢不了」的数学表述。`,
  })

  snap('done', {
    x,
    move,
    result: after,
    resultXor: afterXor,
    answer: true,
    done: true,
    desc:
      `先手必胜。整个论证只有两句话：异或非 0 时存在一步走到异或为 0 的局面；` +
      `而异或为 0 时任何一步都会走到异或非 0。循环归纳，必胜。`,
  })

  return steps
}
