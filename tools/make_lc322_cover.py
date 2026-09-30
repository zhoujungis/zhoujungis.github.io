# -*- coding: utf-8 -*-
"""
make_lc322_cover.py — 【LC 322】零钱兑换 的封面。

构图：左右两个面板，中间分隔线（沿用 lc704/lc121 封面骨架）。
左 = 正序（完全背包）：dp[0..11] = [0,1,1,2,2,1,2,2,3,3,2,3]，
      第 10 格绿框（来源）、第 11 格金框（答案 3），下面 "dp[11] = 3 → 5+5+1"。
右 = 逆序（0-1 背包）：同位置数组大部分是 ∞，第 11 格灰框，
      下面 "dp[11] = ∞ → -1"。
下面两张卡片：正序 = 完全背包 / 逆序 = 0-1 背包。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文（∞、≡ 等符号也交给中文字体）；几何自检。
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
d.text((W / 2, 46), "零钱兑换：dp 正序推进，逆序把答案变成 -1",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 86, [("dp[x] = 凑出金额 x 的最少硬币枚数；dp[0]=0、其余 ∞，dp[x] = min(dp[x-c] + 1)",
                   tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(280, 128, [("正序 1 → 11", card_title, GREEN), ("　完全背包（硬币可复用）", tiny_font, MUTED)])
mixed(820, 128, [("逆序 11 → 1", card_title, ORANGE), ("　0-1 背包（每枚最多一次）", tiny_font, MUTED)])

CW, CH, GAP = 34, 48, 4
CELL_Y = 182
N = 12

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 154, 550, 318), fill=BORDER, width=2)


def draw_row(cx, vals, gold_idx, green_idx, dead_idx):
    total = N * CW + (N - 1) * GAP
    x0 = cx - total / 2
    for i in range(N):
        t = "∞" if vals[i] is None else str(vals[i])
        fill, stroke, tcol, w = WHITE, BORDER, INK, 2
        if i in gold_idx:
            fill, stroke, tcol, w = GOLD_FILL, GOLD, GOLD, 3
        elif i in green_idx:
            fill, stroke, tcol, w = GREEN_FILL, GREEN, GREEN, 3
        elif i in dead_idx:
            fill, stroke, tcol, w = PAST, DASH, DIM, 2
        cell(x0 + i * (CW + GAP), CELL_Y, CW, CH, fill, stroke, t, tcol,
             sub=str(i), subcol=MUTED, width=w)
    return total, x0


ASC = [0, 1, 1, 2, 2, 1, 2, 2, 3, 3, 2, 3]
DESC = [0, 1, 1, 2, None, 1, 2, 2, 3, None, None, None]

total1, x1 = draw_row(280, ASC, gold_idx={11}, green_idx={10}, dead_idx=set())
total2, x2 = draw_row(820, DESC, gold_idx=set(), green_idx=set(), dead_idx={11})

d.text((280, 162), "本轮从左往右刷：来源格是本轮新值", font=row_label, fill=MUTED, anchor="mm")
d.text((820, 162), "本轮从右往左刷：来源格是上一轮旧值", font=row_label, fill=MUTED, anchor="mm")

mixed(280, 254, [("dp[11] = dp[10] + 1 = 2 + 1 = ", tiny_font, MUTED),
                 ("3", code_mid, GREEN), ("　→　5 + 5 + 1", tiny_font, GREEN)])
mixed(820, 254, [("dp[11] = ", tiny_font, MUTED), ("∞", sym_mid, ORANGE),
                 ("　→　", tiny_font, MUTED), ("-1", code_mid, ORANGE),
                 ("（1+2+5 = 8 < 11）", mini_font, MUTED)])

mixed(280, 288, [("正序：能再叠一枚同一硬币", tiny_font, INK)])
mixed(820, 288, [("逆序：每枚硬币被锁成一次", tiny_font, INK)])

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


bottom_card(LEFT_X, GREEN, "正序 · 完全背包（322 正解）", [
    [("定义：", tiny_font, INK), ("dp[x]", code_small, GREEN), (" = 凑出 x 的最少枚数", tiny_font, MUTED)],
    [("转移：", tiny_font, INK), ("dp[x] = min(dp[x-c] + 1)", code_small, GREEN)],
    [("关键：", tiny_font, INK), ("a: 1 → 11", code_small, ORANGE),
     ("（来源是本轮新值）", tiny_font, MUTED)],
    [("贪心反例：", tiny_font, INK), ("[1,3,4]", code_small, ORANGE),
     (" 凑 6 → 2（3+3）", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "逆序 · 0-1 背包（换了题意）", [
    [("同一行代码，", tiny_font, INK), ("a: 11 → 1", code_small, ORANGE)],
    [("读到的 ", tiny_font, MUTED), ("dp[a-c]", code_small, ORANGE), (" 是上一轮的旧值", tiny_font, MUTED)],
    [("等价于每枚硬币最多用一次", tiny_font, INK)],
    [("每件一次的题（416 / 494）才用逆序", tiny_font, GREEN)],
])

d.text((W / 2, H - 16), "同族：LC 279 完全平方数 · LC 518 组合数 II · LC 377 组合总和 IV · LC 416 分割等和子集",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert total1 < 520 and total2 < 520, "格子行超面板宽"
tw_title = d.textlength("零钱兑换：dp 正序推进，逆序把答案变成 -1", font=title_font)
assert tw_title < W - 60, f"标题过宽 {tw_title}"
for cy, wsum in checks:
    if cy >= CARD_Y:
        assert wsum < CARD_W - 48, f"卡片行过宽 y={cy}: {wsum}"
    elif cy in (86, 254, 288):
        assert wsum < W - 80, f"横排过宽 y={cy}: {wsum}"
assert CELL_Y + CH < 254 - 16, "格子行压住结论行"
assert 162 + 12 < CELL_Y, "行标签压住格子行"
assert CARD_Y + CARD_H < H - 32, "底部卡片与 family 行重叠"
print("SELF-CHECK OK:", f"left={int(total1)} right={int(total2)} title={int(tw_title)}")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
for out in ("frontend/public/photos/lc-322-cover.png", "photos/lc-322-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
