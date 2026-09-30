# -*- coding: utf-8 -*-
"""
make_lc139_cover.py — 【LC 139】单词拆分 的封面。

构图：左右两个面板，中间分隔线（沿用 lc704/lc322 封面骨架）。
左 = 填表：dp[0..13] = T F F F F T F F T F F F F T，
      第 5、8 格绿框（三次命中：apple / apple|pen），第 13 格金框（答案 true）。
右 = 回溯切分：s 的 13 个字符格，按 apple | pen | apple 分成三组绿框，
      下面挂三个词标签。
下面两张卡片：dp 定义与转移 / 同族与分工。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文（∞、∈ 等符号也交给中文字体）；几何自检。
"""

import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 620
BG = (247, 246, 242)
INK = (31, 42, 36)
MUTED = (101, 113, 104)
BORDER = (195, 201, 194)
GREEN = (63, 107, 87)
GREEN_FILL = (238, 245, 241)
ORANGE = (164, 95, 69)
GOLD = (194, 135, 47)
GOLD_FILL = (253, 243, 227)
DIM = (154, 163, 156)
PAST = (238, 240, 236)
WHITE = (255, 255, 255)
DASH = (216, 221, 214)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 31)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
row_label = font("msyhbd.ttc", 14)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 18)
code_tiny = font("consola.ttf", 11)
sym_mid = font("msyh.ttc", 20)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []


def mixed(cx, cy, parts, anchor="mm"):
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    checks.append((int(cy), sum(widths)))
    if anchor == "mm":
        x = cx - sum(widths) / 2
    else:
        x = cx
    for (text, f, color), _w in zip(parts, widths):
        d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
        x += _w


def cell(x, y, cw, ch, fill, stroke, t, tcol, sub=None, subcol=None, width=2, tfont=None):
    d.rounded_rectangle((int(x), int(y), int(x + cw), int(y + ch)), radius=6,
                        fill=fill, outline=stroke, width=width)
    tf = tfont or (sym_mid if t == "∞" else code_mid)
    if sub is not None:
        d.text((int(x + cw / 2), int(y + ch / 2 - 7)), t, font=tf, fill=tcol, anchor="mm")
        d.text((int(x + cw / 2), int(y + ch - 10)), sub, font=code_tiny,
               fill=subcol or DIM, anchor="mm")
    elif t:
        d.text((int(x + cw / 2), int(y + ch / 2)), t, font=tf, fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 46), "单词拆分：dp 只答「能不能」，回溯把表读成切分",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 86, [("dp[i] = s 的前 i 个字符能否拼出；dp[0] = true、其余 false，"
                   "dp[i] = OR( dp[j] && s[j:i] ∈ dict )", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(280, 128, [("填表  i: 1 → 13", card_title, GREEN), ("　枚举「最后一个词」", tiny_font, MUTED)])
mixed(820, 128, [("回溯  pos: 13 → 0", card_title, ORANGE), ("　把 dp 表读成切分", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 154, 550, 306), fill=BORDER, width=2)

CELL_Y = 182
CELL_H = 42

# ── 左面板：dp 布尔行 ────────────────────────────────────────────────────────
CW, GAP = 30, 4
DP = [True, False, False, False, False, True, False, False,
      True, False, False, False, False, True]
N = len(DP)
total1 = N * CW + (N - 1) * GAP
x1 = 280 - total1 / 2

d.text((280, 162), "dp[0..13]：绿色 = 三次命中，金色 = 答案格",
       font=row_label, fill=MUTED, anchor="mm")

for i in range(N):
    fill, stroke, tcol, w = WHITE, BORDER, INK, 2
    if i == 13:
        fill, stroke, tcol, w = GOLD_FILL, GOLD, GOLD, 3
    elif i in (5, 8):
        fill, stroke, tcol, w = GREEN_FILL, GREEN, GREEN, 3
    elif not DP[i]:
        fill, stroke, tcol, w = PAST, DASH, DIM, 2
    cell(x1 + i * (CW + GAP), CELL_Y, CW, CELL_H, fill, stroke,
         "T" if DP[i] else "F", tcol, sub=str(i), subcol=MUTED, width=w)

mixed(280, 272, [("dp[13] = true　→　", tiny_font, MUTED), ("apple | pen | apple", code_mid, GREEN)])
mixed(280, 300, [("「apple」用了两次 → 这是完全背包", tiny_font, INK)])

# ── 右面板：字符行 + 三组词框 ────────────────────────────────────────────────
S = "applepenapple"
CW2, GAP2 = 30, 4
ch_x0 = 820 - (len(S) * CW2 + (len(S) - 1) * GAP2) / 2
GROUPS = [(0, 5, "apple"), (5, 8, "pen"), (8, 13, "apple")]

d.text((820, 162), "s 的 13 个字符：按 apple | pen | apple 分组",
       font=row_label, fill=MUTED, anchor="mm")

for lo, hi, word in GROUPS:
    gx = ch_x0 + lo * (CW2 + GAP2)
    gw = (hi - lo) * CW2 + (hi - lo - 1) * GAP2
    d.rounded_rectangle((int(gx), CELL_Y, int(gx + gw), int(CELL_Y + CELL_H)),
                        radius=6, fill=GREEN_FILL, outline=GREEN, width=3)
    for k in range(lo, hi):
        ccx = ch_x0 + k * (CW2 + GAP2) + CW2 / 2
        d.text((int(ccx), int(CELL_Y + CELL_H / 2)), S[k], font=code_mid,
               fill=GREEN, anchor="mm")
        if k < hi - 1:
            lx = int(ch_x0 + (k + 1) * (CW2 + GAP2) - GAP2 / 2)
            d.line((lx, CELL_Y + 8, lx, CELL_Y + CELL_H - 8), fill=BORDER, width=1)
    d.text((int(gx + gw / 2), CELL_Y + CELL_H + 16), f'"{word}"',
           font=code_tiny, fill=GREEN, anchor="mm")

mixed(820, 272, [("13 → 8 → 5 → 0　→　", tiny_font, MUTED), ("apple | pen | apple", code_mid, GREEN)])
mixed(820, 300, [("沿 dp 表从右往左走，不需额外的 cut 表", tiny_font, INK)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 336
CARD_H = 176
CARD_W = 470
GAPX = 40
LEFT_X = (W - CARD_W * 2 - GAPX) / 2


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((int(x), CARD_Y, int(x + CARD_W), CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
                        radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    y = CARD_Y + 44
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 40


bottom_card(LEFT_X, GREEN, "dp 定义与转移", [
    [("定义：", tiny_font, INK), ("dp[i]", code_small, GREEN), (" = 前 i 个字符能否拼出", tiny_font, MUTED)],
    [("底座：", tiny_font, INK), ("dp[0] = true", code_small, GREEN), ("（空串拼得出）", tiny_font, MUTED)],
    [("转移：", tiny_font, INK), ("OR( dp[j] && s[j:i] ", code_small, GREEN), ("∈", tiny_font, GREEN),
     (" dict )", code_small, GREEN)],
    [("剪枝：", tiny_font, INK), ("j ", code_small, ORANGE), ("∈", tiny_font, ORANGE),
     (" [i - maxLen, i - 1]", code_small, ORANGE)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "同族与分工", [
    [("322 / 279：", tiny_font, INK), ("OR → min", code_small, ORANGE), ("（最少件数）", tiny_font, MUTED)],
    [("518：", tiny_font, INK), ("OR → +", code_small, ORANGE), ("（方案数，外层词）", tiny_font, MUTED)],
    [("140：", tiny_font, INK), ("DFS", code_small, GREEN), (" 枚举所有 ", tiny_font, GREEN),
     ("j", code_small, GREEN), ("（列出全部切分）", tiny_font, MUTED)],
    [("416 / 494：每件一次 → 内层逆序", tiny_font, GREEN)],
])

d.text((W / 2, H - 16),
       "同族：LC 322 零钱兑换 · LC 279 完全平方数 · LC 518 零钱兑换 II · LC 377 组合总和 IV · LC 140 单词拆分 II · LC 416 分割等和子集",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert total1 < 520, "dp 行超面板宽"
tw_title = d.textlength("单词拆分：dp 只答「能不能」，回溯把表读成切分", font=title_font)
assert tw_title < W - 60, f"标题过宽 {tw_title}"
for cy, wsum in checks:
    if cy >= CARD_Y:
        assert wsum < CARD_W - 48, f"卡片行过宽 y={cy}: {wsum}"
    elif cy in (86, 272, 300):
        assert wsum < W - 80, f"横排过宽 y={cy}: {wsum}"
assert CELL_Y + CELL_H < 272 - 16, "格子行压住结论行"
assert CELL_Y + CELL_H + 16 + 8 < 272 - 12, "词标签压住结论行"
assert 300 + 10 < CARD_Y - 14, "结论行压住卡片徽标"
assert 162 + 12 < CELL_Y, "行标签压住格子行"
assert CARD_Y + CARD_H < H - 32, "底部卡片与 family 行重叠"
print("SELF-CHECK OK:", f"dp_row={int(total1)} title={int(tw_title)}")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
for out in ("frontend/public/photos/lc-139-cover.png", "photos/lc-139-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
