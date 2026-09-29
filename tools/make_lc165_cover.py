# -*- coding: utf-8 -*-
"""
make_lc165_cover.py — 【LC 165】比较版本号 的封面。

构图：中央两行修订号格子逐列比较（第 2 列剥前导零、第 3 列 "3" < "10" 分出胜负），
下面两张卡片：漂亮事实（先长度后字典序）/ 三个边界。

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


def cell(x, y, cw, ch, fill, stroke, t, tcol):
    d.rounded_rectangle((x, y, x + cw, y + ch), radius=7, fill=fill, outline=stroke, width=2)
    if t:
        d.text((x + cw / 2, y + ch / 2), t, font=code_mid, fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "比较版本号：先归一化，再逐列比", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [("剥前导零 + 缺失补零 —— 剥完之后「比数值」就变成了「先比长度、等长比字典序」", tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 165", card_title, GREEN),
                   ('  "1.02.3" vs "1.2.10" → -1 · 忽略前导零 · 缺失修订号视为 0', tiny_font, MUTED)])

# ── 中央：逐列比较 ──────────────────────────────────────────────────────────
CW, CH, GAP = 74, 52, 10
COLS = 3
ROW_W = COLS * CW + (COLS - 1) * GAP
LEFT = (W - ROW_W) / 2
colX = [int(LEFT + i * (CW + GAP)) for i in range(COLS)]
colC = [x + CW / 2 for x in colX]

# 列号
for i in range(COLS):
    d.text((colC[i], 176), str(i), font=font("consola.ttf", 12), fill=DIM, anchor="mm")

# v1 行：1 | 02 | 3（第 3 列裁决橙边）
cell(colX[0], 192, CW, CH, WHITE, BORDER, "1", INK)
cell(colX[1], 192, CW, CH, GOLD_FILL, GOLD, "02", INK)
cell(colX[2], 192, CW, CH, WHITE, ORANGE, "3", ORANGE)
d.text((LEFT - 22, 218), "v1", font=mini_font, fill=MUTED, anchor="rm")

# 剥零标注（第 2 列下）
mixed(colC[1], 262, [('"02" → 2', tiny_font, ORANGE)])

# v2 行：1 | 2 | 10
cell(colX[0], 280, CW, CH, WHITE, BORDER, "1", INK)
cell(colX[1], 280, CW, CH, GOLD_FILL, GOLD, "2", INK)
cell(colX[2], 280, CW, CH, WHITE, ORANGE, "10", ORANGE)
d.text((LEFT - 22, 306), "v2", font=mini_font, fill=MUTED, anchor="rm")

mixed(W / 2, 352, [("第 1 列相等 · 第 2 列剥前导零后相等 · 第 3 列比长度：1 位 < 2 位 → 返回 -1（字符序里 '3' > '1'，数值序不然）", tiny_font, MUTED)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 388
CARD_H = 134
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


bottom_card(LEFT_X, GREEN, "漂亮的事实", [
    [("剥完前导零没有前导零 —— ", tiny_font, INK), ("位数多的一定大", tiny_font, ORANGE)],
    [("先比长度，等长再比字典序：", tiny_font, INK), ("全程不转数字", tiny_font, ORANGE)],
    [("免疫超长修订号的 parseInt 精度陷阱", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "三个边界", [
    [('"1.2" vs "1.10"', code_small, ORANGE), ("  数值 2 < 10", tiny_font, INK)],
    [('"1.0" vs "1.0.0"', code_small, ORANGE), ("  缺失补零 → 相等", tiny_font, INK)],
    [('"000"', code_small, ORANGE), (" 剥零要留一位 → ", tiny_font, INK), ('"0"', code_small, GREEN)],
])

d.text((W / 2, H - 16), "同族：LC 415 字符串相加（负数变体比绝对值同款：先长度后字典序） · 原地双指针可省 split",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-165-cover.png", "photos/lc-165-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
