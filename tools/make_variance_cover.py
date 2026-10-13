# -*- coding: utf-8 -*-
"""
make_variance_cover.py — 【序列切分方差和最大】的封面。

构图：左侧主例柱状图（两段均值线 + 最优切点），右侧切点表（最优行高亮）；
底部两张卡片（反直觉结论 / O(1) 方差公式）。
红线：中英混排逐段绘制；坐标 int()；底部小注不超 900px。
"""

from PIL import Image, ImageDraw, ImageFont
import os

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
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 34)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 16)
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
        d.text((int(x), cy), text, font=f, fill=color, anchor="lm")
        x += d.textlength(text, font=f)


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "序列切分：让各段方差之和最大", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [
    ("dp[i][j] = max_{k} dp[k][j-1] + var(k+1..i)", code_small, MUTED),
    ("  切成恰好 k 段", tiny_font, MUTED),
])

mixed(W / 2, 138, [("动态规划", card_title, GREEN),
                   ("  [2,8,3,9,4,7] · k = 2 -> 14.6875（切点 2）", tiny_font, MUTED)])

# ── 左侧：主例柱状图 + 均值线 + 切点 ────────────────────────────────────────
SEQ = [2, 8, 3, 9, 4, 7]
CUT = 2
BASE = 300
CH_TOP = 190
MAXV = 9.0
SCALE = 86.0 / MAXV
BW, BGAP = 42, 16
LEFT = 78
meanL = sum(SEQ[:CUT]) / CUT
meanR = sum(SEQ[CUT:]) / (len(SEQ) - CUT)


def bar_y(v):
    return BASE - v * SCALE


for i, v in enumerate(SEQ):
    x = LEFT + i * (BW + BGAP)
    col = GREEN if i < CUT else ORANGE
    d.rounded_rectangle((int(x), int(bar_y(v)), int(x + BW), BASE), radius=3, fill=col)
    d.text((int(x + BW / 2), int(bar_y(v)) - 14), str(v), font=font("consola.ttf", 13),
           fill=INK, anchor="mm")
d.line((LEFT - 14, BASE, LEFT + 6 * BW + 5 * BGAP + 14, BASE), fill=BORDER, width=2)

# 两段均值线
cut_x = LEFT + CUT * (BW + BGAP) - BGAP / 2
d.line((LEFT - 10, bar_y(meanL), cut_x, bar_y(meanL)), fill=GREEN, width=2)
d.line((cut_x, bar_y(meanR), LEFT + 6 * BW + 5 * BGAP + 10, bar_y(meanR)), fill=ORANGE, width=2)
# 均值标签锚在「矮柱」正上方（高柱会挡住标签），并抬高 20px 避开柱顶
mixed(LEFT + BW / 2, bar_y(meanL) - 20, [("左段均值 5.00", mini_font, GREEN)])
mixed(LEFT + 5 * (BW + BGAP) + BW / 2, bar_y(meanR) - 24, [("右段均值 5.75", mini_font, ORANGE)])
# 切点虚线（自拼）
xx = cut_x
for yy in range(CH_TOP - 10, BASE, 9):
    d.line((xx, yy, xx, yy + 5), fill=GOLD, width=2)
mixed(cut_x, CH_TOP - 26, [("切点 2", mini_font, GOLD)])

mixed(LEFT + (6 * BW + 5 * BGAP) / 2 + 60, 350, [
    ("切成两段（14.69）比不切（6.92）更大", tiny_font, MUTED),
])
mixed(LEFT + (6 * BW + 5 * BGAP) / 2 + 60, 376, [
    ("两段均值把原本互相抵消的偏离放大了", tiny_font, MUTED),
])

# ── 右侧：切点表 ─────────────────────────────────────────────────────────────
RX = 620
d.text((RX + 200, 172), "5 个切点逐一扫描", font=mini_font, fill=INK, anchor="mm")

ROWS = [
    ("1", "0.00", "5.32", "5.32", False),
    ("2", "9.00", "5.69", "14.69", True),
    ("3", "6.89", "4.22", "11.11", False),
    ("4", "9.25", "2.25", "11.50", False),
    ("5", "7.76", "0.00", "7.76", False),
]
y = 196
d.text((RX + 40, y), "切点", font=mini_font, fill=MUTED, anchor="mm")
d.text((RX + 118, y), "左段方差", font=mini_font, fill=MUTED, anchor="mm")
d.text((RX + 210, y), "右段方差", font=mini_font, fill=MUTED, anchor="mm")
d.text((RX + 300, y), "合计", font=mini_font, fill=MUTED, anchor="mm")
y += 20
d.line((RX, y, RX + 360, y), fill=BORDER, width=1)
y += 14
for cut, vl, vr, total, best in ROWS:
    if best:
        d.rounded_rectangle((RX - 12, y - 12, RX + 360, y + 14), radius=6,
                            fill=GOLD_FILL, outline=GOLD, width=2)
    col = GOLD if best else INK
    f = code_small if best else font("consola.ttf", 15)
    d.text((RX + 40, y), cut, font=f, fill=col, anchor="mm")
    d.text((RX + 118, y), vl, font=f, fill=col, anchor="mm")
    d.text((RX + 210, y), vr, font=f, fill=col, anchor="mm")
    d.text((RX + 300, y), total, font=f, fill=col, anchor="mm")
    y += 30

mixed(RX + 180, 372, [
    ("局部最大（切点 4 左段 9.25）不等于全局最优", tiny_font, MUTED),
])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 404
CARD_H = 152
CARD_W = 470
GAPX = 40
LEFT_X = int((W - CARD_W * 2 - GAPX) / 2)


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    yy = CARD_Y + 36
    for parts in lines:
        mixed(x + 24, yy, parts, anchor="lm")
        yy += 32


bottom_card(LEFT_X, GREEN, "反直觉：切分让方差和变大", [
    [("k = 1 全序列方差 ", tiny_font, INK), ("6.92", code_small, MUTED)],
    [("k = 2 最优 ", tiny_font, INK), ("14.69", code_small, GREEN),
     ("（[2,8] 9.00 + [3,9,4,7] 5.69）", tiny_font, INK)],
    [("恒等式：SS_total = SS_within + SS_between", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "O(1) 段方差靠前缀和", [
    [("S1", code_small, INK), (" 一阶前缀和 / ", tiny_font, INK), ("S2", code_small, INK),
     (" 二阶前缀和", tiny_font, INK)],
    [("var = ", code_small, INK), ("E[x^2] - E[x]^2", code_small, ORANGE), ("，两次数组访问", tiny_font, INK)],
    [("复杂度 O(n^2 k)；贪心不可行", mini_font, MUTED)],
])

d.text((W / 2, H - 16), "同族：最小化版（分箱/图像分割/K-均值） · 段长约束 · 分治 DP 与斜率优化 · 单点段方差为 0",
       font=tiny_font, fill=MUTED, anchor="mm")

for out in ("frontend/public/photos/partition-variance-dp-cover.png", "photos/partition-variance-dp-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
