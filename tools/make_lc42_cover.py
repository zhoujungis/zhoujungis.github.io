# -*- coding: utf-8 -*-
"""生成 LC 42 文章封面 frontend/public/photos/lc-42-cover.png。

风格对齐 LC 系列：米色底、左上 ALGORITHM 小标、居中标题、下方示意图。
这张图讲三件事：

  左半 —— 柱状图 + 蓝色水面（官方例的真实形状）+ 左右指针 + 答案 6。
        这是接雨水最有辨识度的图，一眼看懂题目在干什么。

  右半 —— 两张卡片对照本题的两种核心切法：
        绿卡「双指针 · 竖着切」—— 一次算完一整列，O(1) 空间；
        橙卡「单调栈 · 横着切」—— 找到凹槽就结算一层，同一格的水分几次到账。

  底部 —— 一行点出三维版的推广：LC 407 = 所有路径瓶颈取 min = 多源 Dijkstra。

⚠️ 中英混排必须逐段绘制：Consolas 没有中文字形，中文注释要用 msyh。
"""
import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 720
BG = (244, 242, 236)
INK = (31, 42, 36)
MUTED = (120, 128, 122)
BORDER = (214, 218, 210)
GREEN = (63, 107, 87)
ORANGE = (164, 95, 69)
GOLD = (194, 135, 47)
COOL = (74, 95, 138)
WATER = (127, 168, 201)
WATER_LINE = (74, 127, 168)
WHITE = (255, 255, 255)
GREEN_FILL = (240, 246, 242)
ORANGE_FILL = (252, 243, 238)
HOT = (164, 95, 69)
HOT_FILL = (252, 243, 238)

TITLE = "接雨水 · 一道题的四种面孔"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

tag_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
title_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 40)
note_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 19)
tiny_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 16)
card_title = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 20)
cell_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
pin_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 15)
code_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 15)
code_small = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 14)
ans_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 26)

# ── 页眉 ───────────────────────────────────────────────────────────────────
tag = "ALGORITHM"
tw = d.textlength(tag, font=tag_font)
d.text((88, 52), tag, font=tag_font, fill=MUTED)
d.line((88 + tw + 18, 66, 88 + tw + 78, 66), fill=BORDER, width=2)

tw = d.textlength(TITLE, font=title_font)
d.text(((W - tw) / 2, 84), TITLE, font=title_font, fill=INK)

# ══════════════════════════════════════════════════════════════════════════
# 左半：柱状图 + 水面 + 左右指针
# ══════════════════════════════════════════════════════════════════════════
ARR = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]
WATER_ARR = [0, 0, 1, 0, 1, 2, 1, 0, 0, 1, 0, 0]
PL, PR = 0, 11
BAR_W, BAR_GAP = 38, 4
BASE_Y = 450
UNIT = 80
CHART_LEFT = 60

chart_w = len(ARR) * BAR_W + (len(ARR) - 1) * BAR_GAP
cell_cx = lambda k: CHART_LEFT + k * (BAR_W + BAR_GAP) + BAR_W / 2


def pin(cx, y, label, fill):
    pw = d.textlength(label, font=pin_font) + 22
    d.rounded_rectangle((cx - pw / 2, y, cx + pw / 2, y + 24), radius=6, fill=fill)
    d.text((cx, y + 12), label, font=pin_font, fill=WHITE, anchor="mm")


# 柱子 + 水
for k, v in enumerate(ARR):
    x = CHART_LEFT + k * (BAR_W + BAR_GAP)
    h_px = v * UNIT
    top = BASE_Y - h_px
    if h_px > 0:
        d.rounded_rectangle((x, top, x + BAR_W, BASE_Y), radius=4,
                            fill=(239, 236, 228), outline=BORDER, width=2)
    # 水画在柱子头顶
    wh = WATER_ARR[k]
    if wh > 0:
        wtop = BASE_Y - (v + wh) * UNIT
        d.rounded_rectangle((x, wtop, x + BAR_W, top), radius=3,
                            fill=WATER, outline=WATER_LINE, width=1)
    d.text((x + BAR_W / 2, BASE_Y - 14), str(v), font=ImageFont.truetype(
        r"C:\Windows\Fonts\consola.ttf", 14), fill=INK, anchor="mm")

# 地面
d.line((CHART_LEFT - 12, BASE_Y, CHART_LEFT + chart_w + 12, BASE_Y), fill=(154, 163, 156), width=2)

# 指针
pin(cell_cx(PL), BASE_Y + 16, "L=0", GREEN)
pin(cell_cx(PR), BASE_Y + 46, "R=11", COOL)

# 答案行
mix_ans = [("接住 ", ans_font, INK), ("6", ans_font, GOLD), (" 单位雨水", ans_font, INK)]
ax = CHART_LEFT
for text, font, color in mix_ans:
    d.text((ax, 550), text, font=font, fill=color, anchor="lm")
    ax += d.textlength(text, font=font)
d.text((ax + 24, 550), "官方例 1 · 官方例 2 的答案是 9", font=tiny_font, fill=MUTED, anchor="lm")

# ══════════════════════════════════════════════════════════════════════════
# 右半：两种切法的对照卡片
# ══════════════════════════════════════════════════════════════════════════
CARD_X = 640
CARD_W = 400
CARD1_Y = 168
CARD2_Y = 412
CARD_H = 226

CODE_TOP_DY = 58
CODE_LINE_H = 21
RULE_DY = 128
NOTE_TOP_DY = 146
NOTE_LINE_H = 21


def code_card(cy, accent, accent_fill, badge, lines, notes):
    d.rounded_rectangle((CARD_X, cy, CARD_X + CARD_W, cy + CARD_H), radius=12,
                        fill=accent_fill, outline=accent, width=2)
    bw = d.textlength(badge, font=card_title) + 34
    d.rounded_rectangle((CARD_X + 16, cy + 14, CARD_X + 16 + bw, cy + 40), radius=7, fill=accent)
    d.text((CARD_X + 16 + bw / 2, cy + 27), badge, font=card_title, fill=WHITE, anchor="mm")

    y = cy + CODE_TOP_DY
    for parts in lines:
        cx = CARD_X + 22
        for text, font, color in parts:
            d.text((cx, y), text, font=font, fill=color, anchor="lm")
            cx += d.textlength(text, font=font)
        y += CODE_LINE_H

    d.line((CARD_X + 22, cy + RULE_DY, CARD_X + CARD_W - 22, cy + RULE_DY), fill=BORDER, width=1)

    y = cy + NOTE_TOP_DY
    for text, color in notes:
        d.text((CARD_X + 22, y), text, font=tiny_font, fill=color, anchor="lm")
        y += NOTE_LINE_H


# 卡 1：双指针 · 竖着切
code_card(
    CARD1_Y, GREEN, GREEN_FILL, "双指针 · 竖着切",
    [
        [("if height[l] < height[r]:", code_small, INK)],
        [("    结算较矮的那一端", tiny_font, GREEN)],
        [("l、r 从两端往中间夹", tiny_font, MUTED)],
    ],
    [
        ("一次算完一整列的水", MUTED),
        ("O(n) 时间 · O(1) 空间 —— 最优解", GREEN),
        ("谁矮结算谁：矮的一侧答案已确定", GREEN),
    ],
)

# 卡 2：单调栈 · 横着切
code_card(
    CARD2_Y, ORANGE, ORANGE_FILL, "单调栈 · 横着切",
    [
        [
            ("while h[i] > h[", code_small, INK),
            ("栈顶", tiny_font, INK),
            ("]:", code_small, INK),
        ],
        [("    结算一层凹槽", tiny_font, ORANGE)],
        [("栈内高度保持递减", tiny_font, MUTED)],
    ],
    [
        ("找到一个凹槽就填满一层", MUTED),
        ("O(n) 时间 · O(n) 空间", ORANGE),
        ("同一格的水会分几次到账", ORANGE),
    ],
)

# ── 底部小注：三维版 ────────────────────────────────────────────────────────
d.line((88, H - 62, W - 88, H - 62), fill=BORDER, width=2)
note = "进阶 LC 407（三维版）：水位 = 到边界所有路径瓶颈的最小值 = 最小瓶颈路径 = 多源 Dijkstra"
ntw = d.textlength(note, font=note_font)
d.text(((W - ntw) / 2, H - 42), note, font=note_font, fill=MUTED)

for out in (
    r"D:\zhoujungis.github.io\frontend\public\photos\lc-42-cover.png",
    r"D:\zhoujungis.github.io\photos\lc-42-cover.png",
):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("saved", out)
