# -*- coding: utf-8 -*-
"""
make_lc121_cover.py — 【LC 121/122】买卖股票的最佳时机 I & II 的封面。

构图：左右两个面板，中间分隔线（沿用 lc704 封面骨架）。
左 = 121：价格行 [7,1,5,3,6,4]，第 1 天绿框（minPrice=1，"min"在下）、
       第 4 天金框（today 卖出，"today"在上），下面动作行 "6-1=5 → best 刷新"。
右 = 122：同价格行，相邻格之间挂差值徽章（-6/-2 灰、+4/+3 绿），
       下面状态行 "greedy = 4+3 = 7 = cash"。
下面两张卡片：121 一次买卖 / 122 无限次。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文（≡、Σ 等符号也交给中文字体）；几何自检。
"""

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
PAST_LINE = (216, 221, 214)
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 31)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 20)
code_tiny = font("consola.ttf", 11)
row_label = font("msyhbd.ttc", 14)

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


def cell(x, y, cw, ch, fill, stroke, t, tcol, sub=None, subcol=None, width=2):
    d.rounded_rectangle((int(x), int(y), int(x + cw), int(y + ch)), radius=7,
                        fill=fill, outline=stroke, width=width)
    if sub is not None:
        d.text((int(x + cw / 2), int(y + ch / 2 - 8)), t, font=code_mid, fill=tcol, anchor="mm")
        d.text((int(x + cw / 2), int(y + ch - 12)), sub, font=code_tiny,
               fill=subcol or DIM, anchor="mm")
    elif t:
        d.text((int(x + cw / 2), int(y + ch / 2)), t, font=code_mid, fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 48), "买卖股票 I & II：一个等历史最低价，一个吃下每段上坡",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 88, [("121：minPrice/best 两个单调变量；122：吃正差 ≡ cash/hold 状态机 —— 追问只改方程",
                   tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(280, 130, [("LC 121 一次买卖", card_title, GREEN),
                 ("  → 5", tiny_font, MUTED)])
mixed(820, 130, [("LC 122 无限次买卖", card_title, ORANGE),
                 ("  → 7", tiny_font, MUTED)])

CW, CH, GAP = 44, 52, 6
CELL_Y = 186
VALS = ["7", "1", "5", "3", "6", "4"]
N = len(VALS)

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 156, 550, 316), fill=BORDER, width=2)

# ── 左面板：121 价格行 ───────────────────────────────────────────────────────
d.text((280, 158), "价格行：min 只下台阶，best 只上坡", font=row_label, fill=MUTED, anchor="mm")
total1 = N * CW + (N - 1) * GAP
x1 = 280 - total1 / 2
for i, v in enumerate(VALS):
    fill, stroke, tcol, w = WHITE, BORDER, INK, 2
    if i == 1:
        fill, stroke, tcol, w = GREEN_FILL, GREEN, GREEN, 3  # 历史最低价
    if i == 4:
        fill, stroke, tcol, w = GOLD_FILL, GOLD, GOLD, 3     # today 卖出
    cell(x1 + i * (CW + GAP), CELL_Y, CW, CH, fill, stroke, v, tcol,
         sub=str(i), subcol=MUTED, width=w)
d.text((int(x1 + 4 * (CW + GAP) + CW / 2), 174), "today", font=code_tiny, fill=GOLD, anchor="mm")
d.text((int(x1 + 1 * (CW + GAP) + CW / 2), 256), "min", font=code_tiny, fill=GREEN, anchor="mm")
mixed(280, 292, [("第 4 天卖：", tiny_font, MUTED), ("6 - 1 = 5 > best 4", code_small, ORANGE),
                 (" → 刷新", tiny_font, INK)])

# ── 右面板：122 差值徽章行 ───────────────────────────────────────────────────
d.text((820, 158), "差值 -6 +4 -2 +3 -2：绿的吃下，灰的跳过", font=row_label, fill=MUTED, anchor="mm")
total2 = N * CW + (N - 1) * GAP
x2 = 820 - total2 / 2
for i, v in enumerate(VALS):
    cell(x2 + i * (CW + GAP), CELL_Y, CW, CH, WHITE, BORDER, v, INK,
         sub=str(i), subcol=MUTED, width=2)
DIFFS = [("-6", False), ("+4", True), ("-2", False), ("+3", True), ("-2", False)]
for k, (txt, up) in enumerate(DIFFS):
    bx = x2 + (k + 1) * (CW + GAP) - GAP / 2
    d.text((int(bx), CELL_Y + CH + 14), txt, font=code_tiny,
           fill=GREEN if up else DIM, anchor="mm")
# 当前日（第 4 天）金框点缀
gx = x2 + 4 * (CW + GAP)
d.rounded_rectangle((int(gx - 3), CELL_Y - 3, int(gx + CW + 3), CELL_Y + CH + 3),
                    radius=9, outline=GOLD, width=3)
mixed(820, 292, [("终态空仓：", tiny_font, MUTED), ("greedy = 4+3 = 7 = cash", code_small, GREEN)])

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
        y += 44


bottom_card(LEFT_X, GREEN, "121：一次买卖", [
    [("两个单调变量：", tiny_font, INK), ("minPrice / best", code_small, GREEN)],
    [("逐天问今天卖：", mini_font, MUTED), ("cand = p - min", code_small, ORANGE),
     ("，best 只上坡", mini_font, INK)],
    [("顺序最大差：", tiny_font, INK), ("[2,4,1]→2", code_small, ORANGE),
     (" 而非极差；跌则 0", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "122：无限次", [
    [("贪心：", tiny_font, INK), ("Σ max(0, diff)", code_small, GREEN),
     (" 所有正差之和", tiny_font, MUTED)],
    [("状态机：", mini_font, INK), ("cash=max(c,h+p)", code_small, ORANGE)],
    [("hold=max(h,c-p)", code_small, GREEN),
     ("；终态取 cash；贪心即 DP", mini_font, INK)],
])

d.text((W / 2, H - 16), "同族：LC 309 冷冻期 · LC 714 手续费 · LC 123 限两笔 · LC 188 限 k 笔 —— 只改转移方程",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert total1 < 500 and total2 < 500, "格子行超面板宽"
tw_title = d.textlength("买卖股票 I & II：一个等历史最低价，一个吃下每段上坡", font=title_font)
assert tw_title < W - 60, f"标题过宽 {tw_title}"
for cy, wsum in checks:
    if cy >= CARD_Y:  # 卡片内文字：限宽 CARD_W - 48
        assert wsum < CARD_W - 48, f"卡片行过宽 y={cy}: {wsum}"
    elif cy in (88, 292):
        assert wsum < W - 80, f"横排过宽 y={cy}: {wsum}"
assert CARD_Y + CARD_H < H - 32, "底部卡片与 family 行重叠"
assert CELL_Y + CH + 22 < 292 - 12, "差值徽章压住说明行"
print("SELF-CHECK OK:", f"left={int(total1)} right={int(total2)} title={int(tw_title)}")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-121-122-cover.png", "photos/lc-121-122-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
