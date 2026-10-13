# -*- coding: utf-8 -*-
"""
make_kthlarge_cover.py — 【重复元素找第 K 大】的封面。

构图：中央同一组输入 + 两套口径的答案（16 vs 8）+ size-k 最小堆示意；
底部两张卡片（口径 / 异常处理）。
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
DIM = (154, 163, 156)
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
code_mid = font("consola.ttf", 22)
code_big = font("consola.ttf", 30)

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
d.text((W / 2, 50), "重复元素找第 10 大：答案能差一倍", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [
    ("size-k", code_small, MUTED),
    (" 最小堆，堆顶就是「当前第 ", tiny_font, MUTED),
    ("k", code_small, MUTED),
    (" 大」", tiny_font, MUTED),
    ("  时间 ", tiny_font, MUTED),
    ("O(n log k)", code_small, MUTED),
    ("、空间 ", tiny_font, MUTED),
    ("O(k)", code_small, MUTED),
])

mixed(W / 2, 138, [("数组", card_title, GREEN),
                   ("  同族：LC 215 第 K 个最大元素 · LC 347 前 K 高频 · 数据流中位数", tiny_font, MUTED)])

# ── 上方：输入数组条 ─────────────────────────────────────────────────────────
NUMS = [23, 7, 45, 12, 45, 8, 33, 12, 19, 5, 45, 27, 12, 9, 33, 16, 41, 3]
CW, CH, GAP = 42, 44, 8
ROW_W = len(NUMS) * CW + (len(NUMS) - 1) * GAP
LEFT = int((W - ROW_W) / 2)
TOP = 178
for i, v in enumerate(NUMS):
    x = LEFT + i * (CW + GAP)
    # 最终进堆的 10 个最大值（不去重口径）
    top10 = sorted(NUMS, reverse=True)[:10]
    inheap = v in top10
    if inheap:
        d.rounded_rectangle((int(x), TOP, int(x + CW), TOP + CH), radius=7,
                            fill=GREEN_FILL, outline=GREEN, width=2)
        col = GREEN
    else:
        d.rounded_rectangle((int(x), TOP, int(x + CW), TOP + CH), radius=7,
                            fill=DIM_FILL, outline=DIM, width=2)
        col = DIM
    d.text((int(x + CW / 2), TOP + CH / 2), str(v), font=font("consola.ttf", 18),
           fill=col, anchor="mm")
d.text((LEFT - 14, TOP + CH / 2), "输入", font=mini_font, fill=MUTED, anchor="rm")

mixed(W / 2, TOP + CH + 26, [
    ("n = 18，k = 10 —— 绿底是最终进堆的 10 个值，灰底是被丢掉的 2 个", tiny_font, MUTED),
])

# ── 中部：两套口径 ───────────────────────────────────────────────────────────
CY = 292
d.rounded_rectangle((150, CY, 545, CY + 108), radius=12, fill=GREEN_FILL, outline=GREEN, width=2)
mixed(347, CY + 26, [
    ("不去重口径", mini_font, MUTED), ("  降序第 10 个（下标 9）", tiny_font, MUTED),
])
mixed(347, CY + 70, [("16", code_big, GREEN)])
mixed(347, CY + 96, [("45,45,45,41,33,33,27,23,19,", code_small, MUTED), ("16", code_small, GREEN)])

d.rounded_rectangle((555, CY, 950, CY + 108), radius=12, fill=GOLD_FILL, outline=GOLD, width=2)
mixed(752, CY + 26, [
    ("去重口径", mini_font, MUTED), ("  distinct 值里第 10 个", tiny_font, MUTED),
])
mixed(752, CY + 70, [("8", code_big, GOLD)])
mixed(752, CY + 96, [("45,41,33,27,23,19,16,12,9,", code_small, MUTED), ("8", code_small, GOLD)])

# 中间 VS
mixed(550, CY + 54, [("VS", code_small, ORANGE)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 452
CARD_H = 116
CARD_W = 470
GAPX = 40
LEFT_X = int((W - CARD_W * 2 - GAPX) / 2)


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    yy = CARD_Y + 30
    for parts in lines:
        mixed(x + 24, yy, parts, anchor="lm")
        yy += 28


bottom_card(LEFT_X, GREEN, "先问口径再写码", [
    [("官方样例 [3,2,1,5,6,4] 两种口径都返回 5", tiny_font, INK)],
    [("根本区分不出来 —— 必须自己造带重复的用例", mini_font, MUTED)],
    [("去重口径还要判 distinct 够不够 k 个", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "异常要分开报", [
    [("N < k / k <= 0 / null / NaN 各自抛异常", tiny_font, INK)],
    [("不要静默返回第 N 大或 0 —— 比崩溃危险", mini_font, MUTED)],
    [("无解时用 Integer 返回 null，别用魔法值", mini_font, MUTED)],
])

d.text((W / 2, H - 14), "同族：LC 215 · LC 347 · 数据流中位数（双堆） · 快速选择平均 O(n)",
       font=tiny_font, fill=MUTED, anchor="mm")

for out in ("frontend/public/photos/kth-largest-cover.png", "photos/kth-largest-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
