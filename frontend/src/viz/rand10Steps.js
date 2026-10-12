/**
 * rand10Steps.js — 「用 Rand7() 实现 Rand10()」(LC 470) 的拒绝采样推演状态机。
 *
 * 纯函数，不碰 DOM。渲染层是 rand10.js。
 *
 * ── 本题的灵魂 ────────────────────────────────────────────────────────────
 * 一次 rand7() 只有 7 个等概率状态，凑不出 10 个「平均分」。但**两次独立的
 * rand7()** 有 7 × 7 = 49 个等概率状态（乘积空间）：
 *     v = (a - 1) * 7 + b      → 1..49 均匀
 * 49 里能整整除 10 的最大块是 40 = 4 × 10：**v ≤ 40 就接受**，输出 (v-1) % 10 + 1；
 * **v ≥ 41 就拒绝**（9/49 的概率），整组重掷。每一个输出都恰好对应 4 个状态，
 * 所以条件在「接受」上，10 个输出严格均匀。
 *
 * 期望调用次数：E = 2 × 49/40 = 2.45 次 rand7()（每轮 2 次，接受率 40/49）。
 *
 * 帧设计（默认脚本 6 次尝试、1 次拒绝，输出 [8,3,2,6,10] 前 5 个 + …）：
 *   init —— 空盘面
 *   roll —— 掷出 (a, b)，指向 49 格表里的格子（等定夺）
 *   accept —— v ≤ 40：接受，输出 (v-1) % 10 + 1
 *   reject —— v ≥ 41：拒绝，整组重掷
 *   done —— 汇总输出、调用次数、拒绝次数与期望值
 *
 * ── 帧字段 ────────────────────────────────────────────────────────────────
 *   phase: 'init' | 'roll' | 'accept' | 'reject' | 'done'
 *   desc, from, to, size（49）, acceptLimit（40）, perOutput（4）
 *   a, b: number | null          // 本帧骰子
 *   cellValue: number | null     // (a-1)*from + b
 *   output: number | null        // accept 帧的输出
 *   outputs: number[]            // 已产生的输出序列
 *   calls, rejects, attempts: number
 *   expect: number               // 期望调用次数 2*size/acceptLimit
 *   done: boolean
 *
 * ⚠️ 关键不变量（单测逐帧钉死）：
 *   1. accept 帧必然 cellValue ≤ acceptLimit 且 output === (cellValue-1)%to+1；
 *   2. reject 帧必然 cellValue > acceptLimit；
 *   3. calls === 2 × attempts；attempts === accept 帧数 + reject 帧数；
 *   4. 输出恒在 1..to；每个输出在「全部 49 状态」里的前像数 === perOutput；
 *   5. 统计验证（固定种子）：大样本频数均匀、调用次数均值 ≈ expect。
 */

export const RAND10_DEFAULT_ROLLS = [4, 7, 7, 6, 1, 3, 2, 5, 6, 1, 5, 2]

function normalize(options = {}) {
  const from = Number.isInteger(options.from) && options.from >= 2 ? options.from : 7
  const size = from * from
  const to =
    Number.isInteger(options.to) && options.to >= 2 && options.to <= size ? options.to : 10
  const rawRolls = Array.isArray(options.rolls) ? options.rolls : null
  let rolls = RAND10_DEFAULT_ROLLS
  if (rawRolls && rawRolls.length >= 2) {
    const filtered = rawRolls.filter((v) => Number.isInteger(v) && v >= 1 && v <= from)
    rolls = filtered.length >= 2 ? filtered : RAND10_DEFAULT_ROLLS
  }
  return { from, to, size, rolls: rolls.slice(0, rolls.length - (rolls.length % 2)) }
}

export function buildRand10Steps(options = {}) {
  const { from, to, size, rolls } = normalize(options)
  const acceptLimit = Math.floor(size / to) * to
  const perOutput = acceptLimit / to
  const expect = (2 * size) / acceptLimit

  const steps = []
  const outputs = []
  let calls = 0
  let rejects = 0
  let attempts = 0

  const snap = (phase, desc, extra = {}) => {
    steps.push({
      phase,
      desc,
      from,
      to,
      size,
      acceptLimit,
      perOutput,
      expect,
      a: null,
      b: null,
      cellValue: null,
      output: null,
      outputs: [...outputs],
      calls,
      rejects,
      attempts,
      done: phase === 'done',
      ...extra,
    })
  }

  snap(
    'init',
    `目标：用 \`rand${from}()\` 造出 \`rand${to}()\`。一次只有 ${from} 个等概率状态，` +
      `凑不出 ${to} 份均分 —— 但**两次独立的 \`rand${from}()\`** 有 ${from} × ${from} = ${size} 个` +
      `等概率状态（乘积空间）。取 \`v = (a-1) × ${from} + b\` 得到 1..${size} 的均匀整数；` +
      `${size} 里能整整除 ${to} 的最大块是 ${acceptLimit} = ${perOutput} × ${to} —— ` +
      `**v ≤ ${acceptLimit} 接受、v > ${acceptLimit} 拒绝重掷**（拒绝率 ${size - acceptLimit}/${size}）。`,
  )

  for (let i = 0; i + 1 < rolls.length; i += 2) {
    const a = rolls[i]
    const b = rolls[i + 1]
    const value = (a - 1) * from + b
    attempts += 1
    calls += 2

    snap(
      'roll',
      `第 ${attempts} 次尝试：掷出 \`a = ${a}\`、\`b = ${b}\` → \`v = (${a}-1) × ${from} + ${b} = ${value}\`，` +
        `落在 ${from}×${from} 状态表的第 \`${value}\` 格。${value} 与 ${acceptLimit} 的大小，` +
        `决定这次接受还是拒绝。`,
      { a, b, cellValue: value },
    )

    if (value <= acceptLimit) {
      const output = ((value - 1) % to) + 1
      outputs.push(output)
      snap(
        'accept',
        `\`v = ${value} ≤ ${acceptLimit}\`：**接受**，输出 \`(v-1) % ${to} + 1 = ${output}\`。` +
          `结果均匀的原因：每个输出 1..${to} 恰好对应 ${perOutput} 个状态（${acceptLimit} = ${perOutput} × ${to}），` +
          `所有状态等概率，所以给定「接受」时每个输出的条件概率都是 ${perOutput}/${acceptLimit} = 1/${to}。`,
        { a, b, cellValue: value, output },
      )
    } else {
      rejects += 1
      snap(
        'reject',
        `\`v = ${value} > ${acceptLimit}\`：**拒绝**，这次的两个 rand${from}() 作废，**整组重掷**。` +
          `不要心疼这 ${size - acceptLimit}/${size} 的浪费 —— 拒绝不破坏均匀性：重掷是独立的，` +
          `「第一次落进接受区」的那一轮，条件分布依然是均匀的。`,
        { a, b, cellValue: value },
      )
    }
  }

  snap(
    'done',
    `脚本跑完：输出序列 \`[${outputs.join(', ')}]\`，共调用 ${calls} 次 rand${from}()（${attempts} 轮尝试，` +
      `拒绝 ${rejects} 次）。理论值：每轮 2 次调用、接受率 ${acceptLimit}/${size}，` +
      `**期望调用次数 = 2 × ${size}/${acceptLimit} = ${expect.toFixed(2)} 次**；` +
      `信息论下界是 log(${to}) / log(${from}) ≈ ${(Math.log(to) / Math.log(from)).toFixed(2)} 次 —— ` +
      `拒绝法离它还有距离，进阶写法会把被拒绝状态「回收」进下一轮。`,
  )

  return steps
}
