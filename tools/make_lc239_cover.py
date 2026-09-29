# -*- coding: utf-8 -*-
"""
make_lc239_cover.py — 【LC 239】滑动窗口最大值 的封面。

构图：中央数组行 + 滑动窗口色带 + 下行单调队列（值递减，front=max）
+ 答案行。下面两张卡片：被支配即永久淘汰 / 两个独立动作。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()。
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
BAND = (232, 220, 196)
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 34)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 20)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)


def mixed(cx, cy, parts, anchor="mm"):
    if anchor == "mm":
        total = sum(d.textlength(t, font=f) for t, f, _ in parts)
        x = cx - total / 2
    else:
        x = cx
    for text, f, color in parts:
        d.text((x, cy), text, font=f, fill=color, anchor="lm")
        x += d.textlength(text, font=f)


def cell(x, y, cw, ch, fill, stroke, t, tcol, sub=None, subcol=None):
    d.rounded_rectangle((x, y, x + cw, y + ch), radius=7, fill=fill, outline=stroke, width=2)
    if sub is not None:
        d.text((x + cw / 2, y + ch / 2 - 7), t, font=code_mid, fill=tcol, anchor="mm")
        d.text((x + cw / 2, y + ch - 12), sub, font=font("consola.ttf", 11), fill=subcol or DIM, anchor="mm")
    elif t:
        d.text((x + cw / 2, y + ch / 2), t, font=code_mid, fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "滑动窗口最大值：只留还有机会的候选", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [("被支配（右边来了不小于它的元素）即永久淘汰 —— 队列按值递减，队首恒为最大", tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 239", card_title, GREEN),
                   ("  [1,3,-1,-3,5,3,6,7], k=3 → [3,3,5,5,6,7] · 要求线性时间", tiny_font, MUTED)])

# ── 中央数组行 + 窗口色带 ────────────────────────────────────────────────────
CW, CH, GAP = 52, 50, 10
NUMS = [1, 3, -1, -3, 5, 3, 6, 7]
COLS = len(NUMS)
ROW_W = COLS * CW + (COLS - 1) * GAP
LEFT = (W - ROW_W) / 2
colX = [int(LEFT + i * (CW + GAP)) for i in range(COLS)]
colC = [x + CW / 2 for x in colX]

# 窗口色带（窗口 [3,5]，值 -3,5,3，最大 5）
BAND_A, BAND_B = 3, 5
bx1 = colX[BAND_A] - 4
bx2 = colX[BAND_B] + CW + 4
d.rounded_rectangle((bx1, 176, bx2, 186), radius=5, fill=BAND)
d.text((bx1 + 4, 181), "L", font=font("consola.ttf", 12), fill=MUTED, anchor="lm")
d.text((bx2 - 4, 181), "R", font=font("consola.ttf", 12), fill=MUTED, anchor="rm")

# 数组行（窗口内淡金，当前 i=5 橙框）
for i, t in enumerate(NUMS):
    if i == 5:
        cell(colX[i], 194, CW, CH, WHITE, ORANGE, str(t), ORANGE)
    elif BAND_A <= i <= BAND_B:
        cell(colX[i], 194, CW, CH, GOLD_FILL, BORDER, str(t), INK)
    else:
        cell(colX[i], 194, CW, CH, WHITE, BORDER, str(t), INK)
d.text((LEFT - 16, 219), "nums", font=mini_font, fill=MUTED, anchor="rm")

# ── 队列行（值递减：5, 3；front = max）──────────────────────────────────────
DEQ = [(5, 4), (3, 5)]
DLEFT = (W - (2 * CW + GAP)) / 2
for t, (v, idx) in enumerate(DEQ):
    x = int(DLEFT + t * (CW + GAP))
    if t == 0:
        cell(x, 258, CW, CH, GREEN_FILL, GREEN, str(v), GREEN, sub=f"#{idx}")
    else:
        cell(x, 258, CW, CH, GOLD_FILL, BORDER, str(v), INK, sub=f"#{idx}")
d.text((DLEFT - 16, 283), "deque", font=mini_font, fill=MUTED, anchor="rm")
d.text((DLEFT + CW / 2, 318), "front (max)", font=font("consola.ttf", 12), fill=GREEN, anchor="mm")

# ── 答案行 ───────────────────────────────────────────────────────────────────
ANS = [3, 3, 5]
AW = 3 * CW + 2 * GAP
ALEFT = (W - AW) / 2
for t, v in enumerate(ANS):
    x = int(ALEFT + t * (CW + GAP))
    if t == len(ANS) - 1:
        cell(x, 338, CW, 44, GOLD_FILL, GOLD, str(v), GOLD)
    else:
        cell(x, 338, CW, 44, GREEN_FILL, GREEN, str(v), GREEN)
d.text((ALEFT - 16, 360), "ans", font=mini_font, fill=MUTED, anchor="rm")

mixed(W / 2, 394, [('i=5 时队列 [5, 3]：5 支配了 -3、-1（永久淘汰）；队首 5 就是当前窗最大 —— 均摊 O(1)', tiny_font, MUTED)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 424
CARD_H = 148
CARD_W = 470
GAPX = 40
LEFT_X = (W - CARD_W * 2 - GAPX) / 2


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    y = CARD_Y + 34
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 30


bottom_card(LEFT_X, GREEN, "被支配 = 永久淘汰", [
    [("右边来了 ", tiny_font, INK), ("不小于它", tiny_font, ORANGE), (" 的元素：", tiny_font, INK)],
    [("更大、又更晚出窗 —— 永远轮不到", tiny_font, INK)],
    [("每个元素至多入队/出队一次 → 均摊 O(1)", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "两个独立动作", [
    [("队尾淘汰（单调性）看", tiny_font, INK), (" <= x", code_small, ORANGE)],
    [("队首淘汰（出窗）看", tiny_font, INK), (" < L", code_small, ORANGE)],
    [("队列存下标 —— 存值判不了出窗", mini_font, MUTED)],
])

d.text((W / 2, H - 16), "同族：LC 862（单调递增队列+前缀和） · LC 1438（最大最小双队列） · 堆惰性删除 O(n log n) · 块状 DP O(n)",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-239-cover.png", "photos/lc-239-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
