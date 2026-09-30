# -*- coding: utf-8 -*-
"""
make_lc70_cover.py — 【LC 70】爬楼梯 的封面。

构图：上半 dp 行（n=10，末格金色）+ 右侧溢出阈值表（int32/long/JS Number 三档）；
底部两张卡片（加法原理 / n=80 先爆的是类型）。

红线（SKILL）：中英混排逐段绘制；坐标/宽度 int()；底部小注不超 900px。
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
BAD = (179, 69, 46)
DIM_FILL = (246, 245, 241)
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
code_big = font("consola.ttf", 24)

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


def cell(x, y, cw, ch, fill, stroke, t, tcol, tsize=20, width=2):
    d.rounded_rectangle((int(x), int(y), int(x + cw), int(y + ch)), radius=7,
                        fill=fill, outline=stroke, width=width)
    if t:
        d.text((int(x + cw / 2), int(y + ch / 2)), t, font=font("consola.ttf", tsize),
               fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "爬楼梯：递推人人会写，n=80 呢？", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [
    ("dp[i] = dp[i-1] + dp[i-2]", code_small, MUTED),
    (" —— 最后一步只有「迈 1 阶」「迈 2 阶」两种来路，互斥且完备", tiny_font, MUTED),
])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 70 / LC 509", card_title, GREEN),
                   ("  美团社招追问：n=80，你的 int 早就爆了", tiny_font, MUTED)])

# ── 左侧：dp 行（n=10）──────────────────────────────────────────────────────
DP = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89]
CW, CH, GAP = 44, 48, 6
LEFT = 70
for i, v in enumerate(DP):
    x = LEFT + i * (CW + GAP)
    if i == len(DP) - 1:
        cell(x, 186, CW, CH, GOLD_FILL, GOLD, str(v), GOLD, tsize=19, width=3)
    else:
        cell(x, 186, CW, CH, WHITE, BORDER, str(v), INK, tsize=19)
        d.text((int(x + CW / 2), 250), str(i), font=font("consola.ttf", 11), fill=(154, 163, 156), anchor="mm")

mixed(LEFT + (11 * CW + 10 * GAP) / 2, 292, [
    ("10 阶 89 种 —— 用组合数核一遍：C(10,0)+C(9,1)+C(8,2)+C(7,3)+C(6,4)+C(5,5) = 89", tiny_font, MUTED),
])
mixed(LEFT + (11 * CW + 10 * GAP) / 2, 322, [
    ("朴素递归展开成树（n=6）：25 个节点里 18 个是重复子问题，f(2) 被从头算了 5 次", tiny_font, MUTED),
])
mixed(LEFT + (11 * CW + 10 * GAP) / 2, 352, [
    ("叶子数 = ways(n)：每条根到叶子的路径就是一种走法", tiny_font, MUTED),
])

# ── 右侧：溢出阈值表 ─────────────────────────────────────────────────────────
RX = 680
d.text((RX + 150, 170), "每一阶的走法数 vs 类型宽度", font=mini_font, fill=INK, anchor="mm")

ROWS = [
    ("int32", "上限", "2147483647", "ways(45)", "装得下", "ways(46)", "爆（第 46 阶）"),
    ("long", "上限", "9223372036854775807", "ways(91)", "装得下", "ways(92)", "爆"),
    ("JS Number", "精确整数到", "2^53", "ways(77)", "还精确", "ways(78)", "起丢精度"),
]
y = 204
for name, cn, num, okv, okcn, overv, overcn in ROWS:
    mixed(RX, y, [
        (name, code_small, INK),
        (" " + cn + " ", tiny_font, MUTED),
        (num, code_small, MUTED),
    ], anchor="lm")
    mixed(RX, y + 22, [
        (okv, code_small, GREEN),
        (" " + okcn, tiny_font, GREEN),
        ("   |   ", code_small, BORDER),
        (overv, code_small, BAD),
        (" " + overcn, tiny_font, BAD),
    ], anchor="lm")
    y += 58

mixed(W / 2, 400, [
    ("n = 80 的答案：", tiny_font, MUTED),
    ("ways(80) = 37889062373143906", code_small, ORANGE),
    ("（long 装得下，int 早已爆）", tiny_font, MUTED),
])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 434
CARD_H = 130
CARD_W = 470
GAPX = 40
LEFT_X = int((W - CARD_W * 2 - GAPX) / 2)


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    yy = CARD_Y + 34
    for parts in lines:
        mixed(x + 24, yy, parts, anchor="lm")
        yy += 30


bottom_card(LEFT_X, GREEN, "加法原理：互斥且完备", [
    [("最后一步：从 ", tiny_font, INK), ("i-1", code_small, GREEN),
     (" 迈 1 阶 / 从 ", tiny_font, INK), ("i-2", code_small, ORANGE), (" 迈 2 阶", tiny_font, INK)],
    [("互斥（一步不能既是 1 又是 2）+ 完备（没有第三种）", mini_font, MUTED)],
    [("dp[0] = 1：空方案也是走法，dp[2] 要用它", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "n=80：先爆的是类型", [
    [("增长是乘性的（每阶约 x1.618），位宽是线性的", tiny_font, INK)],
    [("int 在第 46 阶爆，long 撑到第 91 阶", tiny_font, INK)],
    [("再大：BigInteger，或题目改成对 1e9+7 取模", mini_font, MUTED)],
])

d.text((W / 2, H - 16), "同族：LC 509（斐波那契） · LC 746（最小花费爬楼梯） · 一次 1..m 阶 = 前缀和 · 矩阵快速幂 O(log n)",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
for out in ("frontend/public/photos/lc-70-cover.png", "photos/lc-70-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
