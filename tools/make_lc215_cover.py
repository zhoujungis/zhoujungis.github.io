# -*- coding: utf-8 -*-
"""
make_lc215_cover.py — 【LC 215】数组中的第 K 个最大元素 的封面。

构图：两行数组展示快速选择的两轮分区 —— 第 1 轮枢轴 4 落在下标 3（未达目标位，
左边全部淘汰），第 2 轮枢轴 5 正好落在目标位 n-k=4，答案 5。
底部两张卡片给快速选择 vs 小根堆的四维对照。

红线（SKILL）：中英混排逐段绘制（Consolas 无中文字形）；标签只用 ASCII；
卡片内按段累加行高；小注长度上限约 900px。
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 640
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
DIM_FILL = (240, 239, 234)
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 34)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 17)
code_font = font("consola.ttf", 16)
pin_font = font("msyhbd.ttc", 14)

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


def cell(x, y, w, h, text, fill, stroke, text_color, sw=1.5):
    x, y, w, h = int(x), int(y), int(w), int(h)
    d.rounded_rectangle((x, y, x + w, y + h), radius=7, fill=fill, outline=stroke, width=max(1, int(sw)))
    d.text((x + w / 2, y + h / 2), text, font=code_small, fill=text_color, anchor="mm")


def tag(cx, cy, text, fill):
    tw = int(d.textlength(text, font=pin_font)) + 20
    d.rounded_rectangle((cx - tw / 2, cy - 12, cx + tw / 2, cy + 12), radius=6, fill=fill)
    d.text((cx, cy), text, font=pin_font, fill=WHITE, anchor="mm")


def tri_down(cx, top, fill):
    d.polygon([(cx - 7, top), (cx + 7, top), (cx, top + 11)], fill=fill)


def tri_up(cx, bottom, fill):
    d.polygon([(cx - 7, bottom), (cx + 7, bottom), (cx, bottom - 11)], fill=fill)


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "快速选择：位置即排名", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [("第 k 大 = 升序第 n-k 位 · 分区后枢轴的落点就是它的排名", tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 215", card_title, GREEN), ("  官方例 [3,2,1,5,6,4]  k=2 · 目标位 n-k = 4", tiny_font, MUTED)])

# ── 两行数组：两轮分区 ──────────────────────────────────────────────────────
CW, CH, GAP = 62, 52, 8
ROW_W = 6 * CW + 5 * GAP
LX = (W - ROW_W) / 2

# 第 1 轮 place 后：[3,2,1,4,6,5]，枢轴 4 在下标 3
ROW1 = [("3", DIM_FILL), ("2", DIM_FILL), ("1", DIM_FILL), ("4", GOLD_FILL), ("6", WHITE), ("5", WHITE)]
CY1 = 196
tag(LX + 3 * (CW + GAP) + CW / 2, CY1 - 30, "pivot=4", GOLD)
tri_down(LX + 3 * (CW + GAP) + CW / 2, CY1 - 18, GOLD)
for i, (t, fill) in enumerate(ROW1):
    x = LX + i * (CW + GAP)
    stroke = GOLD if i == 3 else (DIM if i < 3 else BORDER)
    cell(x, CY1, CW, CH, t, fill, stroke, DIM if i < 3 else INK)
mixed(W / 2, CY1 + CH + 24,
      [("第 1 轮：枢轴 4 落在下标 3 < 目标位 4 —— ", tiny_font, MUTED),
       ("左边 4 个全部淘汰", tiny_font, GREEN)])

# 第 2 轮 place 后：[3,2,1,4,5,6]，枢轴 5 在下标 4 == 目标位
ROW2 = [("3", DIM_FILL), ("2", DIM_FILL), ("1", DIM_FILL), ("4", DIM_FILL), ("5", GOLD_FILL), ("6", DIM_FILL)]
CY2 = 326
tag(LX + 4 * (CW + GAP) + CW / 2, CY2 - 30, "pivot=5", GOLD)
tri_down(LX + 4 * (CW + GAP) + CW / 2, CY2 - 18, GOLD)
for i, (t, fill) in enumerate(ROW2):
    x = LX + i * (CW + GAP)
    if i == 4:
        stroke, tcol = GOLD, GOLD
    elif i != 3:
        stroke, tcol = DIM, DIM
    else:
        stroke, tcol = BORDER, DIM
    cell(x, CY2, CW, CH, t, GOLD_FILL if i == 4 else DIM_FILL, stroke, tcol)

# 目标位箭头（第二行下方，指向下标 4）
tx = LX + 4 * (CW + GAP) + CW / 2
d.text((tx, CY2 + CH + 26), "目标位 4", font=pin_font, fill=GOLD, anchor="mm")
d.line((tx, CY2 + CH + 6, tx, CY2 + CH + 12), fill=GOLD, width=2)
tri_up(tx, CY2 + CH + 6, GOLD)

mixed(W / 2, CY2 + CH + 56,
      [("第 2 轮：枢轴 5 正好落在下标 4 —— ", tiny_font, MUTED),
       ("答案 5，结束", tiny_font, GOLD)])

# ── 底部：两张对照卡片 ──────────────────────────────────────────────────────
CARD_Y = 462
CARD_H = 108
CARD_W = 470
GAPX = 40
LEFT_X = (W - CARD_W * 2 - GAPX) / 2


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    y = CARD_Y + 36
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 28


bottom_card(LEFT_X, GREEN, "快速选择", [
    [("平均 ", tiny_font, INK), ("O(n) / O(1) ", code_small, INK), ("空间", tiny_font, INK)],
    [("要随机化 · 会改原数组 · 不能流式", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "小根堆", [
    [("O(n log k) ", code_small, INK), ("空间 ", tiny_font, INK), ("O(k)", code_small, INK)],
    [("流式友好 · 不改原数组 · 无最坏情况", mini_font, MUTED)],
])

d.text((W / 2, H - 18), "海量数据 10 亿找前 100 大：内存装不下全量时，容量 k 的小根堆流式扫一遍即可",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-215-cover.png", "photos/lc-215-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
