# -*- coding: utf-8 -*-
"""
make_lc415_cover.py — 【LC 415】字符串相加 的封面。

构图：中央一张真竖式（进位小 1 + num1/num2 两行 + 横线 + 结果 533），
下面两张卡片：三个实现要点 / 循环条件三连 or。

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
pin_font = font("msyhbd.ttc", 15)

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


def cell(x, y, cw, ch, fill, stroke, t, tcol, dashed=False):
    if dashed:
        for i in range(4):
            d.line((x + i * 5, y, x + i * 5 + 3, y), fill=stroke, width=2)
            d.line((x + i * 5, y + ch, x + i * 5 + 3, y + ch), fill=stroke, width=2)
        for i in range(3):
            yy = y + 5 + i * ((ch - 10) // 2)
            d.line((x, yy, x, yy + 3), fill=stroke, width=2)
            d.line((x + cw, yy, x + cw, yy + 3), fill=stroke, width=2)
    else:
        d.rounded_rectangle((x, y, x + cw, y + ch), radius=7, fill=fill, outline=stroke, width=2)
    if t:
        d.text((x + cw / 2, y + ch / 2), t, font=code_mid, fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "字符串相加：把小学列竖式翻译成代码", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [("不能转整数不是刁难，是排除法 —— 剩下的只有逐位加 + 进位变量", tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 415", card_title, GREEN),
                   ('  "456" + "77" → "533" · 不许 BigInteger、不许整串转整数', tiny_font, MUTED)])

# ── 中央竖式 ─────────────────────────────────────────────────────────────────
CW, CH, GAP = 64, 52, 10
COLS = 3
ROW_W = COLS * CW + (COLS - 1) * GAP
PLUS_W = 46
BLOCK_W = PLUS_W + ROW_W
BX = int((W - BLOCK_W) / 2 + PLUS_W)   # 第一列左缘（+ 号占左侧）
colX = [BX + i * (CW + GAP) for i in range(COLS)]
colC = [x + CW / 2 for x in colX]

# 进位小字（手算写在顶上的小 1）：个位产生的进位给十位、十位产生的进位给百位
d.text((colC[1], 182), "1", font=pin_font, fill=ORANGE, anchor="mm")
d.text((colC[0], 182), "1", font=pin_font, fill=ORANGE, anchor="mm")
mixed((BX - 70) / 2 + 70, 182, [("进位", mini_font, MUTED)])

# num1 行：4 5 6
for i, t in enumerate("456"):
    cell(colX[i], 200, CW, CH, WHITE, BORDER, t, INK)
d.text((BX - 26, 226), "num1", font=mini_font, fill=DIM, anchor="rm")

# num2 行：空缺格（虚线）+ 7 7，行首 +
cell(colX[0], 266, CW, CH, BG, DIM, "", INK, dashed=True)
for i, t in enumerate("77"):
    cell(colX[i + 1], 266, CW, CH, WHITE, BORDER, t, INK)
d.text((BX - 26, 292), "+", font=font("consola.ttf", 24), fill=INK, anchor="mm")

# 横线
d.line((colX[0], 334, colX[2] + CW, 334), fill=INK, width=3)

# 结果行：5 3 3（绿）
for i, t in enumerate("533"):
    cell(colX[i], 348, CW, CH, GREEN_FILL, GREEN, t, GREEN)
mixed(W / 2, 428, [('从个位起：6+7=13 写 3 进 1 · 5+7+1=13 写 3 进 1 · 4+0+1=5（num2 缺百位，补 0）', tiny_font, MUTED)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 452
CARD_H = 116
CARD_W = 470
GAPX = 40
LEFT_X = (W - CARD_W * 2 - GAPX) / 2


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    y = CARD_Y + 32
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 26


bottom_card(LEFT_X, GREEN, "三个实现要点", [
    [("i < 0", code_small, ORANGE), (" 补 0 贡献，列照算不误", tiny_font, INK)],
    [("每列：加 → 写下个位 → 进位带上", tiny_font, INK)],
    [("push + reverse", code_small, ORANGE), (" ，别用 unshift（O(n^2)）", tiny_font, INK)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "循环条件：三连 or", [
    [("while i >= 0 or j >= 0 or carry > 0", code_small, INK)],
    [('漏 carry：', tiny_font, INK), ('"999"+"1"', code_small, ORANGE), (' 得 ', tiny_font, INK), ('"000"', code_small, ORANGE)],
    [('带上 carry 才是 ', tiny_font, INK), ('"1000"', code_small, GREEN), (' —— 溢出会长出一位', tiny_font, MUTED)],
])

d.text((W / 2, H - 16), "同族：LC 67 二进制求和（base 参数化） · LC 2 两数相加（链表头就是低位） · LC 43 大数相乘（乘积落 i+j+1）",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-415-cover.png", "photos/lc-415-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
