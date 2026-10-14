# -*- coding: utf-8 -*-
"""
make_lc61_cover.py — 【5 张牌判断顺子】的封面。

构图：中央主例 [3,王,7,5,4] 排序后逐对检查、王补 6 拼出 3-4-5-6-7；
底部两张卡片（一条判据通吃 / 三个样例抓不住的错法）。
红线：中英混排逐段绘制（consola 无中文字形，中文一律 msyh）；
坐标 int()；底部小注不超 900px。
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
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


def auto(text, size, bold=False):
    """含中文用 msyh，纯 ASCII 用 consola（consola 没有中文字形）。"""
    name = "msyhbd.ttc" if bold else "msyh.ttc"
    if all(ord(c) < 0x2E80 for c in text):
        name = "consolab.ttf" if bold else "consola.ttf"
    return font(name, size)


title_font = font("msyhbd.ttc", 34)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)

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
d.text((W / 2, 50), "5 张牌判断顺子：王只补缺失，补不了重复", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [
    ("排序 · 数王 · 逐对补洞", auto("排序 · 数王 · 逐对补洞", 16, True), MUTED),
    ("  0 当任意牌，常数时间 O(1)", auto("  0 当任意牌，常数时间 O(1)", 15), MUTED),
])
mixed(W / 2, 138, [("同族", card_title, GREEN),
                   ("  剑指 Offer 61 · 官方样例两组 · 三个错法全部漏网", tiny_font, MUTED)])


def playing_card(x, y, w, h, label, accent, fill, sub=None):
    d.rounded_rectangle((int(x), int(y), int(x + w), int(y + h)), radius=9,
                        fill=fill, outline=accent, width=2)
    f = auto(label, 26, True)
    d.text((int(x + w / 2), int(y + (h - 14) / 2)), label, font=f, fill=accent, anchor="mm")
    if sub:
        d.text((int(x + w / 2), int(y + h - 13)), sub, font=mini_font, fill=accent, anchor="mm")


# ── 中部上：排序后的牌面 ─────────────────────────────────────────────────────
d.text((W / 2, 172), "输入 [3, 王, 7, 5, 4] 排序后 —— 王浮到最前，非王牌升序",
       font=mini_font, fill=MUTED, anchor="mm")

CW, CH, GAP = 96, 68, 16
ROW_W = 5 * CW + 4 * GAP
LEFT = int((W - ROW_W) / 2)
TOP = 190
cards = [("王", GOLD, GOLD_FILL, "大小王 · 0"), ("3", INK, WHITE, "牌面 3"),
         ("4", INK, WHITE, "牌面 4"), ("5", INK, WHITE, "牌面 5"), ("7", INK, WHITE, "牌面 7")]
for i, (label, accent, fill, sub) in enumerate(cards):
    playing_card(LEFT + i * (CW + GAP), TOP, CW, CH, label, accent, fill, sub)

# ── 中部下：拼出的顺子 ───────────────────────────────────────────────────────
d.text((W / 2, 292), "逐对检查：3→4 差 1 · 4→5 差 1 · 5→7 差 2 —— 缺的 6 拿王补",
       font=mini_font, fill=MUTED, anchor="mm")

ST = 312
slots = [("3", GREEN, WHITE, None), ("4", GREEN, WHITE, None), ("5", GREEN, WHITE, None),
         ("6", GOLD, GOLD_FILL, "王补"), ("7", GREEN, WHITE, None)]
SW = 96
SLEFT = int((W - (5 * SW + 4 * GAP)) / 2)
for i, (label, accent, fill, sub) in enumerate(slots):
    playing_card(SLEFT + i * (SW + GAP), ST, SW, CH, label, accent, fill, sub)

mixed(W / 2, 408, [
    ("拼出 3-4-5-6-7", auto("拼出 3-4-5-6-7", 20, True), GREEN),
    ("  —— 连续 5 张，是顺子", auto("  —— 连续 5 张，是顺子", 16), MUTED),
])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 440
CARD_H = 112
CARD_W = 470
GAPX = 40
LEFT_X = int((W - CARD_W * 2 - GAPX) / 2)


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((x + 16, CARD_Y - 14, x + 16 + tw, CARD_Y + 12), radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    yy = CARD_Y + 32
    for parts in lines:
        mixed(x + 24, yy, parts, anchor="lm")
        yy += 28


bottom_card(LEFT_X, GREEN, "一条判据通吃", [
    [("非王牌无重复 + 跨度 < 5", auto("非王牌无重复 + 跨度 < 5", 15, True), INK)],
    [("无王时自动收紧成跨度恰好 = 4", mini_font, MUTED)],
    [("王能填缺失的数，填不了重复的数", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "样例抓不住的三个错法", [
    [("[1,2,2,3,4]", auto("[1,2,2,3,4]", 15, True), INK),
     (" 重复 —— 只看跨度照样放行", mini_font, INK)],
    [("[1,2,3,4,6]", auto("[1,2,3,4,6]", 15, True), INK),
     (" 跨 5 无王 —— 判据写成 ≤ 5", mini_font, MUTED)],
    [("[0,0,1,2,6]", auto("[0,0,1,2,6]", 15, True), INK),
     (" 王-王负 gap 把洞抵掉", mini_font, MUTED)],
])

d.text((W / 2, H - 40), "同族：剑指 Offer 61 · 无王顺子仅 9/1287 · 含王 104/2288 · 8568 种组合与暴力解全量对拍",
       font=tiny_font, fill=MUTED, anchor="mm")

for out in ("frontend/public/photos/lc-61-cover.png", "photos/lc-61-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
