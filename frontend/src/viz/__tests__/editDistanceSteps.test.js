import { describe, expect, it } from 'vitest'

import { buildEditDistanceSteps } from '../editDistanceSteps.js'

/**
 * 独立参考解：后缀 dp（方向与状态机的前缀 dp 相反）。
 * 拆字符必须用 Array.from —— .length / s[i] 按 UTF-16 码元切，emoji 会被拆成代理项。
 * 这套参考解在 trace 阶段已与「0-1 BFS」三方交叉验证过 413 例。
 */
function refDist(s1, s2) {
  const a = Array.from(s1)
  const b = Array.from(s2)
  const m = a.length
  const n = b.length
  const d = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0))
  for (let i = m; i >= 0; i -= 1) d[i][n] = m - i
  for (let j = n; j >= 0; j -= 1) d[m][j] = n - j
  for (let i = m - 1; i >= 0; i -= 1) {
    for (let j = n - 1; j >= 0; j -= 1) {
      d[i][j] =
        a[i] === b[j]
          ? d[i + 1][j + 1]
          : 1 + Math.min(d[i + 1][j + 1], d[i + 1][j], d[i][j + 1])
    }
  }
  return d[0][0]
}

const answer = (w1, w2) => {
  const s = buildEditDistanceSteps({ word1: w1, word2: w2 })
  return s[s.length - 1].answer
}

describe('LC 72 buildEditDistanceSteps · 答案', () => {
  it('经典样例（这些值是出了名的，直接钉死）', () => {
    expect(answer('horse', 'ros')).toBe(3)
    expect(answer('intention', 'execution')).toBe(5)
    expect(answer('kitten', 'sitting')).toBe(3)
  })

  it('与独立参考解在 200 组随机串上一致', () => {
    const alphabet = ['a', 'b', 'c']
    const rand = (maxLen) => {
      const len = Math.floor(Math.random() * (maxLen + 1))
      let out = ''
      for (let k = 0; k < len; k += 1) {
        out += alphabet[Math.floor(Math.random() * alphabet.length)]
      }
      return out
    }
    for (let t = 0; t < 200; t += 1) {
      const w1 = rand(6)
      const w2 = rand(6)
      expect(answer(w1, w2), `${w1} -> ${w2}`).toBe(refDist(w1, w2))
    }
  })

  it('边界：空串 / 单字符 / 等串', () => {
    expect(answer('', '')).toBe(0)
    expect(answer('', 'abc')).toBe(3)
    expect(answer('abc', '')).toBe(3)
    expect(answer('a', 'a')).toBe(0)
    expect(answer('a', 'b')).toBe(1)
    expect(answer('abc', 'abc')).toBe(0)
  })

  it('emoji 按码点算，不按 UTF-16 码元', () => {
    // 'ab😀c' 是 4 个码点（.length 是 5），删掉 😀 就行
    expect(answer('ab😀c', 'abc')).toBe(1)
    const s = buildEditDistanceSteps({ word1: 'ab😀c', word2: 'abc' })
    expect(s[0].m).toBe(4)
  })
})

describe('LC 72 · 帧结构', () => {
  it('horse/ros：init + 5 行 x (1 列边界 + 3 格) + done = 22 帧', () => {
    const s = buildEditDistanceSteps({ word1: 'horse', word2: 'ros' })
    expect(s.length).toBe(22)
    expect(s[0].phase).toBe('init')
    expect(s[1].phase).toBe('col')
    expect(s[2].phase).toBe('cell')
    expect(s[20].phase).toBe('cell')
    expect(s[21].phase).toBe('done')
  })

  it('帧数公式 = 1 + m*(1+n) + 1，空输入也成立', () => {
    for (const [w1, w2] of [
      ['', ''],
      ['', 'abc'],
      ['abc', ''],
      ['ab', 'ba'],
      ['horse', 'ros'],
    ]) {
      const m = Array.from(w1).length
      const n = Array.from(w2).length
      const s = buildEditDistanceSteps({ word1: w1, word2: w2 })
      if (m > 0 || n > 0) {
        expect(s.length, `${w1}->${w2}`).toBe(1 + m * (1 + n) + 1)
      }
      expect(s[s.length - 1].phase).toBe('done')
    }
  })

  it('每一帧都带 desc，非收尾帧不带 answer', () => {
    const s = buildEditDistanceSteps({})
    for (let k = 0; k < s.length; k += 1) {
      expect(typeof s[k].desc).toBe('string')
      expect(s[k].desc.length).toBeGreaterThan(0)
      if (s[k].phase !== 'done') expect(s[k].answer).toBeNull()
    }
  })

  it('done 帧保留真实语义字段（answer / dp / buf 都是真的）', () => {
    const s = buildEditDistanceSteps({ word1: 'horse', word2: 'ros' })
    const last = s[s.length - 1]
    expect(last.done).toBe(true)
    expect(last.i).toBe(5)
    expect(last.j).toBe(3)
    expect(last.value).toBe(3)
    expect(last.answer).toBe(3)
    expect(last.dp[5][3]).toBe(3)
  })
})

describe('LC 72 · 转移语义', () => {
  it('match 帧：value 就是抄对角，不收钱', () => {
    const s = buildEditDistanceSteps({ word1: 'horse', word2: 'ros' })
    // i=2, j=2 是 'o' 对 'o'
    const f = s.find((x) => x.phase === 'cell' && x.i === 2 && x.j === 2)
    expect(f.match).toBe(true)
    expect(f.op).toBe('match')
    expect(f.charA).toBe('o')
    expect(f.charB).toBe('o')
    expect(f.value).toBe(f.diag)
    expect(f.value).toBe(1)
  })

  it('mismatch 帧：value = 三个邻居的最小值 + 1，op 一定在 ties 里', () => {
    const s = buildEditDistanceSteps({ word1: 'intention', word2: 'execution' })
    for (const f of s) {
      if (f.phase !== 'cell' || f.match) continue
      const low = Math.min(f.diag, f.up, f.left)
      expect(f.value).toBe(low + 1)
      expect(f.ties.length).toBeGreaterThanOrEqual(1)
      expect(f.ties).toContain(f.op)
      expect(f.op).not.toBe('match')
      for (const t of f.ties) {
        const v = t === 'replace' ? f.diag : t === 'delete' ? f.up : f.left
        expect(v).toBe(low)
      }
    }
  })

  it('三向打平：ab -> ba 的最后一格三个方向都是最小（标注互换无害的活教材）', () => {
    const s = buildEditDistanceSteps({ word1: 'ab', word2: 'ba' })
    const f = s.find((x) => x.phase === 'cell' && x.i === 2 && x.j === 2)
    expect(f.ties).toEqual(['replace', 'delete', 'insert'])
    expect(f.value).toBe(2)
    expect(answer('ab', 'ba')).toBe(2)
  })

  it('回归：horse/ros 最后一格的胜者是「删除（上方）」—— 这正是倒扫坑被官方样例掩盖的原因', () => {
    // 内层倒着扫时，上方这一项（buf[j] 写之前就是上一行的值）是唯一没错位的邻居；
    // 官方样例 dp[5][3] 的最小值恰好落在它身上，于是错误实现也能得到 3。
    // 反例：kitten->sitting 得 6（应 3）、abc->abc 得 2（应 0）、a->ba 得 0（应 1）。
    const s = buildEditDistanceSteps({ word1: 'horse', word2: 'ros' })
    const f = s.find((x) => x.phase === 'cell' && x.i === 5 && x.j === 3)
    expect(f.op).toBe('delete')
    expect(f.ties).toEqual(['delete'])
    expect(f.value).toBe(3)
  })
})

describe('LC 72 · 滚动数组（压缩到 O(n) 的正确性）', () => {
  it('cell 帧：saved 永远是对角，buf 里上方/左方都在原位', () => {
    const s = buildEditDistanceSteps({ word1: 'intention', word2: 'execution' })
    for (const f of s) {
      if (f.phase !== 'cell') continue
      const { i, j } = f
      // 对角不在数组里 —— 必须靠 prev
      expect(f.saved).toBe(f.dp[i - 1][j - 1])
      // 上方：写之前 buf[j] 就是上一行的值
      expect(f.bufBefore[j]).toBe(f.dp[i - 1][j])
      // 左方：上一轮刚写进去的
      expect(f.bufBefore[j - 1]).toBe(f.dp[i][j - 1])
      // 本格写完
      expect(f.buf[j]).toBe(f.value)
      // j 之后的格子还没被碰
      for (let q = j + 1; q <= f.n; q += 1) {
        expect(f.buf[q]).toBe(f.dp[i - 1][q])
      }
    }
  })

  it('col 帧：buf[0] 覆盖前先备份，saved = dp[i-1][0]', () => {
    const s = buildEditDistanceSteps({ word1: 'horse', word2: 'ros' })
    for (const f of s) {
      if (f.phase !== 'col') continue
      expect(f.saved).toBe(f.dp[f.i - 1][0])
      expect(f.bufBefore[0]).toBe(f.i - 1)
      expect(f.buf[0]).toBe(f.i)
      expect(f.value).toBe(f.i)
    }
  })

  it('init 帧：buf 的初值就是第 0 行', () => {
    const s = buildEditDistanceSteps({ word1: 'horse', word2: 'ros' })
    expect(s[0].buf).toEqual([0, 1, 2, 3])
    expect(s[0].dp[0]).toEqual([0, 1, 2, 3])
  })

  it('done 帧：buf 收敛到最后一行，答案就在 buf[n]', () => {
    const s = buildEditDistanceSteps({ word1: 'horse', word2: 'ros' })
    const last = s[s.length - 1]
    expect(last.buf).toEqual([5, 4, 4, 3])
    expect(last.buf[3]).toBe(3)
  })

  it('滚动数组与二维表逐帧自洽（n=0 / 长串也成立）', () => {
    for (const [w1, w2] of [
      ['abc', ''],
      ['ab', 'ba'],
      ['horse', 'ros'],
      ['intention', 'execution'],
    ]) {
      const s = buildEditDistanceSteps({ word1: w1, word2: w2 })
      for (const f of s) {
        if (f.phase === 'cell') {
          expect(f.buf[f.j]).toBe(f.dp[f.i][f.j])
        }
      }
    }
  })
})

describe('LC 72 · 主例 dp 表', () => {
  it('horse -> ros 的整张表（trace 阶段已与两个参考解三方核对）', () => {
    const s = buildEditDistanceSteps({ word1: 'horse', word2: 'ros' })
    expect(s[s.length - 1].dp).toEqual([
      [0, 1, 2, 3],
      [1, 1, 2, 3],
      [2, 2, 1, 2],
      [3, 2, 2, 2],
      [4, 3, 3, 2],
      [5, 4, 4, 3],
    ])
  })
})
