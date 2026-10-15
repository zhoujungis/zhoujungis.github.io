import { describe, expect, it } from 'vitest'

import { buildBitmapSteps } from '../bitmapSteps.js'

/** 独立参考解：set 去重 + 排序。 */
function refDistinct(input) {
  return [...new Set(input)].sort((a, b) => a - b)
}

const last = (input) => {
  const s = buildBitmapSteps(input === undefined ? {} : { input })
  return s[s.length - 1]
}

describe('1-bit 位图 · 主例 [37,12,37,5,63,42]', () => {
  it('14 帧：init + 6 个数各 2 帧（locate/act）+ done', () => {
    const steps = buildBitmapSteps({})
    expect(steps.map((s) => s.phase)).toEqual([
      'init',
      'locate', 'act',
      'locate', 'act',
      'locate', 'act',
      'locate', 'act',
      'locate', 'act',
      'locate', 'act',
      'done',
    ])
  })

  it('6 个输入去重后 5 个，重复的 37 被跳过', () => {
    const f = last()
    expect(f.placed).toEqual([37, 12, 5, 63, 42])
    expect(f.skipped).toEqual([37])
    expect(f.distinct).toEqual([5, 12, 37, 42, 63])
  })

  it('word/bit 三件套：37→(1,5)、63→(1,31)、5→(0,5)、12→(0,12)、42→(1,10)', () => {
    const steps = buildBitmapSteps({})
    const locates = steps.filter((s) => s.phase === 'locate')
    expect(locates.map((s) => [s.value, s.word, s.bit])).toEqual([
      [37, 1, 5],
      [12, 0, 12],
      [37, 1, 5],
      [5, 0, 5],
      [63, 1, 31],
      [42, 1, 10],
    ])
  })

  it('重复数在 locate 帧就标记 already=true，act 帧不置位', () => {
    const steps = buildBitmapSteps({})
    const dupLocate = steps[5] // 第二个 37
    expect(dupLocate.already).toBe(true)
    const dupAct = steps[6]
    expect(dupAct.already).toBe(true)
    expect(dupAct.placed).toEqual([37, 12]) // 没长
    expect(dupAct.skipped).toEqual([37])
  })
})

describe('1-bit 位图 · 帧级不变量', () => {
  const INPUTS = [
    [37, 12, 37, 5, 63, 42],
    [0],
    [63, 63, 63],
    [1, 2, 3, 4, 5, 6, 7, 8],
    [32, 33, 0, 31],
    [5, 5, 5, 5, 5, 5, 5, 5],
  ]

  it('distinct 恒等于 placed 的升序排列', () => {
    for (const input of INPUTS) {
      for (const s of buildBitmapSteps({ input })) {
        expect(s.distinct, JSON.stringify(input)).toEqual([...s.placed].sort((a, b) => a - b))
      }
    }
  })

  it('placed 与 skipped 长度之和 = 已处理的输入个数', () => {
    for (const input of INPUTS) {
      const steps = buildBitmapSteps({ input })
      for (const s of steps) {
        const processed = s.placed.length + s.skipped.length
        const seen = steps.filter((x) => x.phase === 'act' && steps.indexOf(x) <= steps.indexOf(s)).length
        expect(processed, JSON.stringify(input)).toBe(seen)
      }
    }
  })

  it('done 帧的 distinct 与 set 参考解一致', () => {
    for (const input of INPUTS) {
      expect(last(input).distinct, JSON.stringify(input)).toEqual(refDistinct(input))
    }
  })

  it('只有 done 帧 done=true；done 帧 value 归 null（坑 J）', () => {
    for (const input of INPUTS) {
      const steps = buildBitmapSteps({ input })
      for (const s of steps) {
        expect(s.done).toBe(s.phase === 'done')
      }
      expect(last(input).value).toBe(null)
    }
  })
})

describe('1-bit 位图 · 与 set 参考解随机对拍', () => {
  it('3000 组随机输入（长度 1~12，值域 0~63）逐一一致', () => {
    let mismatches = 0
    for (let t = 0; t < 3000; t += 1) {
      const n = 1 + Math.floor(Math.random() * 12)
      const input = Array.from({ length: n }, () => Math.floor(Math.random() * 64))
      if (JSON.stringify(last(input).distinct) !== JSON.stringify(refDistinct(input))) {
        mismatches += 1
      }
    }
    expect(mismatches).toBe(0)
  })
})

describe('1-bit 位图 · 边界与非法输入', () => {
  it('空输入之外的合法输入都正常；全相同输入 distinct 恰 1 个', () => {
    expect(last([63, 63, 63]).distinct).toEqual([63])
    expect(last([0]).distinct).toEqual([0])
  })

  it('非法输入回退默认牌 [37,12,37,5,63,42]', () => {
    const def = buildBitmapSteps({})
    expect(def[0].input).toEqual([37, 12, 37, 5, 63, 42])
    // 空 / 越界 / 非整数 / 非数组 → 回退；合法长数组（长度不限）照单全收
    for (const bad of [[], [64], [-1], [3.5], [1, '2'], null, 'x', 42]) {
      const steps = buildBitmapSteps({ input: bad })
      expect(steps[0].input, JSON.stringify(bad)).toEqual([37, 12, 37, 5, 63, 42])
    }
    const long = buildBitmapSteps({ input: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] })
    expect(long[0].input).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
  })
})

describe('1-bit 位图 · 位运算笔误（可执行证明）', () => {
  /** 把 32 位字当数组，复现 |= 写成 = 的事故。 */
  const makeWords = () => [0, 0]

  const correctAdd = (words, v) => {
    words[v >> 5] |= 1 << (v & 31)
  }
  const bugAssignAdd = (words, v) => {
    words[v >> 5] = 1 << (v & 31) // 错：赋值冲掉整个字
  }
  const correctClear = (words, v) => {
    words[v >> 5] &= ~(1 << (v & 31))
  }
  const bugClear = (words, v) => {
    words[v >> 5] &= 1 << (v & 31) // 错：忘写 ~，& 之后只剩本位
  }

  it('|= 写成 =：先置 0 再置 5，0 被冲掉', () => {
    const ok = makeWords()
    correctAdd(ok, 0)
    correctAdd(ok, 5)
    expect((ok[0] >> 0) & 1).toBe(1)
    expect((ok[0] >> 5) & 1).toBe(1)

    const bug = makeWords()
    correctAdd(bug, 0)
    bugAssignAdd(bug, 5)
    expect((bug[0] >> 0) & 1).toBe(0) // 0 被清
    expect((bug[0] >> 5) & 1).toBe(1)
  })

  it('清位忘写 ~：清 5 会把同字的 0 一起清掉', () => {
    const ok = makeWords()
    correctAdd(ok, 0)
    correctAdd(ok, 5)
    correctClear(ok, 5)
    expect((ok[0] >> 0) & 1).toBe(1) // 0 保住
    expect((ok[0] >> 5) & 1).toBe(0)

    const bug = makeWords()
    correctAdd(bug, 0)
    correctAdd(bug, 5)
    bugClear(bug, 5)
    expect((bug[0] >> 0) & 1).toBe(0) // 0 被误伤
  })

  it('负数不减 min：-3 直接当下标是负的，必须减 min 偏移', () => {
    const min = -5
    expect(-3 - min).toBe(2) // 正确：平移到 [0, 值域)
    expect(-3 < 0).toBe(true) // 不减就是负下标，直接越界
  })
})
