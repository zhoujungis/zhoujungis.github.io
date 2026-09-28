# -*- coding: utf-8 -*-
"""
make_lc347_cover.py — 【LC 347】前 K 个高频元素 的封面。

构图：频率卡片（1x3 2x2 3x1）+ 桶行（f=0..6，收集指针在 f=3）——
桶排序的灵魂一帧：频率是多少，值就进下标多少的桶，从高频往低频收满 k 个停。
底部两张卡片给桶排序 vs 小根堆的对照。

红线（SKILL）：中英混排逐段绘制；标签只用 ASCII；小注长度上限约 900px。
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


def tag(cx, cy, text, fill):
    tw = int(d.textlength(text, font=pin_font)) + 20
    d.rounded_rectangle((cx - tw / 2, cy - 12, cx + tw / 2, cy + 12), radius=6, fill=fill)
    d.text((cx, cy), text, font=pin_font, fill=WHITE, anchor="mm")


def tri_down(cx, top, fill):
    d.polygon([(cx - 7, top), (cx + 7, top), (cx, top + 11)], fill=fill)


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "桶排序：频率是天然的桶下标", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [("频率天然落在 [1, n] —— 用它当下标，排序免费 · 总计 O(n)", tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 347", card_title, ORANGE), ("  官方例 [1,1,1,2,2,3]  k=2", tiny_font, MUTED)])

# ── 频率卡片 ─────────────────────────────────────────────────────────────────
FCW, FCH = 92, 46
FREQS = [("1 x 3", GOLD), ("2 x 2", GOLD), ("3 x 1", GOLD)]
FTOTAL = len(FREQS) * FCW + (len(FREQS) - 1) * 14
FX = (W - FTOTAL) / 2
FY = 182
for i, (t, color) in enumerate(FREQS):
    x = FX + i * (FCW + 14)
    d.rounded_rectangle((x, FY, x + FCW, FY + FCH), radius=8, fill=GOLD_FILL, outline=color, width=2)
    d.text((x + FCW / 2, FY + FCH / 2), t, font=code_font, fill=GOLD, anchor="mm")
mixed(W / 2, FY + FCH + 24, [("哈希计数一遍 O(n) —— 每个值出现几次，数出来", tiny_font, MUTED)])

# ── 桶行 ─────────────────────────────────────────────────────────────────────
BW, BH, BGAP = 52, 62, 8
COUNT = 7
ROW_W = COUNT * BW + (COUNT - 1) * BGAP
BX = (W - ROW_W) / 2
BY = 300

for f in range(COUNT):
    x = int(BX + f * (BW + BGAP))
    BW_ = int(BW)
    items = {3: "1", 2: "2", 1: "3"}.get(f, "")
    if f in (2, 3):
        fill, stroke, tcol, sw = GREEN_FILL, GREEN, GREEN, 2
    elif items:
        fill, stroke, tcol, sw = WHITE, BORDER, INK, 1.5
    else:
        fill, stroke, tcol, sw = DIM_FILL, BORDER, DIM, 1
    d.rounded_rectangle((x, BY, x + BW_, BY + int(BH)), radius=7, fill=fill, outline=stroke, width=max(1, int(sw)))
    d.text((x + BW_ / 2, BY + 15), f"f={f}", font=font("consola.ttf", 11.5), fill=MUTED, anchor="mm")
    d.text((x + BW_ / 2, BY + 40), items, font=code_small, fill=tcol, anchor="mm")

# 收集指针（指向 f=3）
cx3 = BX + 3 * (BW + BGAP) + BW / 2
tag(cx3, BY - 24, "f=3", ORANGE)
tri_down(cx3, BY - 12, ORANGE)

# 收集说明
mixed(W / 2, BY + BH + 28,
      [("从高频往低频收，收满 k 个停 —— ", tiny_font, MUTED),
       ("答案 [1, 2]", tiny_font, ORANGE)])

# ── 底部：两张对照卡片 ──────────────────────────────────────────────────────
CARD_Y = 476
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


bottom_card(LEFT_X, GREEN, "桶排序", [
    [("O(n) ", code_small, INK), ("空间 ", tiny_font, INK), ("O(n)", code_small, INK)],
    [("前提：键是小整数范围（频率天然满足）", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "小根堆", [
    [("O(n log k) ", code_small, INK), ("空间 ", tiny_font, INK), ("O(k)", code_small, INK)],
    [("键任意可比较 · 流式友好 · 内存最省", mini_font, MUTED)],
])

d.text((W / 2, H - 18), "腾讯海量变体：去重表装不下内存时，哈希分桶（同元素必落同桶）→ 局部 TopK → 归并",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-347-cover.png", "photos/lc-347-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
