import { describe, expect, it } from 'vitest'

import { buildDigitOneSteps } from '../digitOneSteps.js'

/** 独立参考解：字符串暴力，把 1..n 每个数转成字符串数 '1'。 */
function brute(n) {
  let c = 0
  for (let x = 1; x <= n; x += 1) c += String(x).split('').filter((ch) => ch === '1').length
  return c
}

/** 独立参考解 2：从最高位往下扫，用字符串下标而不是 higher/cur/lower。 */
function altFormula(n) {
  const s = String(n)
  let total = 0
  for (let i = 0; i < s.length; i += 1) {
    const weight = 10 ** (s.length - 1 - i)
    const cur = Number(s[i])
    const left = i === 0 ? 0 : Number(s.slice(0, i))
    const right = i === s.length - 1 ? 0 : Number(s.slice(i + 1))
    if (cur === 0) total += left * weight
    else if (cur === 1) total += left * weight + right + 1
    else total += (left + 1) * weight
  }
  return total
}

const last = (n) => {
  const s = buildDigitOneSteps({ n })
  return s[s.length - 1]
}

describe('1~n 中 1 的个数 · 主例与官方样例', () => {
  it('主例 n=1304 → 766，四个数位 131/130/200/305', () => {
    const f = last(1304)
    expect(f.total).toBe(766)
    expect(f.positions.map((p) => p.contribution)).toEqual([131, 130, 200, 305])
    expect(f.positions.map((p) => p.branch)).toEqual(['many', 'zero', 'many', 'one'])
  })

  it('官方样例 n=13 → 6（个位 2 + 十位 4）', () => {
    const f = last(13)
    expect(f.total).toBe(6)
    expect(f.positions.map((p) => p.contribution)).toEqual([2, 4])
    expect(f.positions.map((p) => p.branch)).toEqual(['many', 'one'])
  })

  it('主例 10 帧：init + 4 个数位各 2 帧 + done', () => {
    const steps = buildDigitOneSteps({ n: 1304 })
    expect(steps.length).toBe(10)
    expect(steps[0].phase).toBe('init')
    expect(steps[9].phase).toBe('done')
    expect(steps[1].phase).toBe('split')
    expect(steps[2].phase).toBe('contribute')
    // 帧序：个位 → 十位 → 百位 → 千位（posIndex 0 = 个位）
    expect(steps.slice(1, 9).filter((s) => s.phase === 'contribute').map((s) => s.posIndex)).toEqual([0, 1, 2, 3])
  })

  it('三个分支在主例里全部出现过', () => {
    const f = last(1304)
    const branches = new Set(f.positions.map((p) => p.branch))
    expect(branches.has('zero')).toBe(true)
    expect(branches.has('one')).toBe(true)
    expect(branches.has('many')).toBe(true)
  })
})

describe('1~n 中 1 的个数 · 与两个独立参考解交叉验证', () => {
  it('n = 0..400 暴力解与独立逐位公式全部一致', () => {
    for (let n = 0; n <= 400; n += 1) {
      expect(altFormula(n), `altFormula(${n})`).toBe(brute(n))
      expect(last(n).total, `stateMachine(${n})`).toBe(brute(n))
    }
  })

  it('n = 10 的幂附近（循环条件 weight <= n 的雷区）', () => {
    for (const n of [9, 10, 11, 99, 100, 101, 999, 1000, 1001, 9999]) {
      expect(last(n).total, `n=${n}`).toBe(brute(n))
    }
  })

  it('闭式：10^k - 1 的答案是 k × 10^(k-1)', () => {
    for (let k = 1; k <= 5; k += 1) {
      expect(last(10 ** k - 1).total).toBe(k * 10 ** (k - 1))
    }
  })
})

describe('1~n 中 1 的个数 · 帧级不变量', () => {
  it('total 恒等于已处理数位贡献之和；贡献公式与分支一致', () => {
    for (const n of [13, 47, 99, 100, 101, 999, 1000, 1304, 1234, 99999]) {
      const steps = buildDigitOneSteps({ n })
      let running = 0
      steps.forEach((s, i) => {
        if (s.phase === 'contribute') {
          const expectC =
            s.cur === 0
              ? s.higher * s.weight
              : s.cur === 1
                ? s.higher * s.weight + s.lower + 1
                : (s.higher + 1) * s.weight
          expect(s.contribution, `n=${n} frame ${i} contribution`).toBe(expectC)
          running += s.contribution
        }
        expect(s.total, `n=${n} frame ${i} total`).toBe(running)
      })
    }
  })

  it('三件套恒等式：higher × 10w + cur × w + lower === n', () => {
    for (const n of [13, 100, 1304, 60606]) {
      for (const s of buildDigitOneSteps({ n })) {
        if (s.weight === 0) continue // init / done 帧没有当前数位
        expect(s.higher * s.weight * 10 + s.cur * s.weight + s.lower).toBe(n)
      }
    }
  })

  it('数位下标从个位开始，权重是 10 的幂，共 numDigits 轮', () => {
    const steps = buildDigitOneSteps({ n: 1304 })
    const contrib = steps.filter((s) => s.phase === 'contribute')
    expect(contrib.map((s) => s.weight)).toEqual([1, 10, 100, 1000])
    expect(contrib.map((s) => s.posIndex)).toEqual([0, 1, 2, 3])
    expect(contrib[0].posName).toBe('个位')
    expect(contrib[3].posName).toBe('千位')
  })

  it('done 帧语义干净（坑 J）：没有当前数位，但 total 是真值', () => {
    const f = last(1304)
    expect(f.posIndex).toBe(-1)
    expect(f.weight).toBe(0)
    expect(f.branch).toBe(null)
    expect(f.contribution).toBe(null)
    expect(f.total).toBe(766)
    expect(f.done).toBe(true)
  })
})

describe('1~n 中 1 的个数 · 边界与回退', () => {
  it('n = 0 → 0，且仍然有 init + done 两帧', () => {
    const steps = buildDigitOneSteps({ n: 0 })
    expect(steps.length).toBe(2)
    expect(steps[1].total).toBe(0)
    expect(steps[1].positions).toEqual([])
  })

  it('单位数：n=1 → 1，n=9 → 1', () => {
    expect(last(1).total).toBe(1)
    expect(last(9).total).toBe(1)
  })

  it('非法输入回退默认值 1304', () => {
    for (const bad of [undefined, -5, 3.5, 'x', NaN, 1e12]) {
      expect(buildDigitOneSteps({ n: bad })[0].n).toBe(1304)
    }
  })

  it('默认参数就是主例 1304', () => {
    expect(buildDigitOneSteps()[0].n).toBe(1304)
  })
})

describe('1~n 中 1 的个数 · 官方样例掩盖的 bug 回归', () => {
  // 三个在 n=13 上完全隐身的错误实现（详见文章第九节）：
  //   1) 循环写成 weight < n：n 是 10 的幂时漏掉最高位
  //   2) cur=0 当成 (higher+1)×weight：样例里 cur 从不为 0，分支不执行
  //   3) cur=0 直接贡献 0：同上
  // 三者都能过 n=13，本组用例钉住它们。
  const wrongLoopLt = (n) => {
    let total = 0
    let weight = 1
    while (weight < n) {
      const higher = Math.floor(n / (weight * 10))
      const cur = Math.floor(n / weight) % 10
      const lower = n % weight
      total +=
        cur === 0 ? higher * weight : cur === 1 ? higher * weight + lower + 1 : (higher + 1) * weight
      weight *= 10
    }
    return total
  }

  it('反例 1：weight < n 在 n=13 上碰巧正确，n=10 立刻错', () => {
    expect(wrongLoopLt(13)).toBe(6) // 官方样例抓不到
    expect(wrongLoopLt(10)).toBe(1) // 正确是 2
    expect(last(10).total).toBe(2)
    expect(wrongLoopLt(100)).toBe(20)
    expect(last(100).total).toBe(21)
    expect(wrongLoopLt(1000)).toBe(300)
    expect(last(1000).total).toBe(301)
  })

  it('反例 2：cur=0 多给一整块，在 n=13 上碰巧正确，n=10 立刻错', () => {
    // 直接验证正确实现：n=10 的十位 cur=1 贡献 1、个位 cur=0 贡献 1
    const f = last(10)
    expect(f.positions.map((p) => [p.cur, p.branch, p.contribution])).toEqual([
      [0, 'zero', 1],
      [1, 'one', 1],
    ])
    expect(f.total).toBe(2)
  })

  it('反例 3：cur=0 漏贡献，同样只在非 10 幂上隐身', () => {
    // n=101：百位 cur=1 贡献 2、十位 cur=0 贡献 10、个位 cur=1 贡献 11
    const f = last(101)
    expect(f.positions.map((p) => [p.cur, p.branch, p.contribution])).toEqual([
      [1, 'one', 11],
      [0, 'zero', 10],
      [1, 'one', 2],
    ])
    expect(f.total).toBe(23)
  })
})
