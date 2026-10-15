# -*- coding: utf-8 -*-
"""
make_bitmap_cover.py — 【海量数据：10 亿整数排序去重（位图）】的封面。

构图：中部 32:1 空间对比（4 GB 原数组 vs 119 MiB 位图，矩形宽度比即压缩比），
下方 2×32 位图阵列示意（几个置位点）+ 底部两张卡片（1-bit / 2-bit）。
红线：中英混排逐段绘制（consola 无中文字形，中文一律 msyh）；坐标 int()；
底部小注不超 900px。
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
ORANGE_FILL = (248, 236, 230)
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
mid_font = font("msyhbd.ttc", 20)

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
d.text((W / 2, 50), "10 亿整数排序去重：一张位图就够了", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [
    ("值域换空间", auto("值域换空间", 16, True), MUTED),
    ("  去重和排序都是白送的副产品", auto("  去重和排序都是白送的副产品", 15), MUTED),
])
mixed(W / 2, 138, [("同族", card_title, GREEN),
                   ("  海量数据 · BitMap · 2-bit 分档 · 布隆过滤器 · 外排", tiny_font, MUTED)])

# ── 中部：32:1 空间对比 ──────────────────────────────────────────────────────
BAR_Y = 178
BAR_H = 74
LEFT_W = 480          # 4 GB 原数组
RIGHT_W = 15          # 119 MiB 位图（480/32 = 15）
LX = 96
d.rounded_rectangle((LX, BAR_Y, LX + LEFT_W, BAR_Y + BAR_H), radius=10,
                    fill=ORANGE_FILL, outline=ORANGE, width=2)
mixed(LX + 20, BAR_Y + 26, [
    ("10^9 个 int32", auto("10^9 个 int32", 18, True), ORANGE),
    ("  原数组", auto("  原数组", 15), MUTED),
])
mixed(LX + 20, BAR_Y + 52, [
    ("4 GB", auto("4 GB", 26, True), ORANGE),
    ("  内存直接出局", auto("  内存直接出局", 15), MUTED),
])

RX = LX + LEFT_W + 90
d.rounded_rectangle((RX, BAR_Y, RX + RIGHT_W, BAR_Y + BAR_H), radius=4,
                    fill=GREEN_FILL, outline=GREEN, width=2)
mixed(RX + RIGHT_W + 16, BAR_Y + 26, [
    ("位图", auto("位图", 18, True), GREEN),
])
mixed(RX + RIGHT_W + 16, BAR_Y + 52, [
    ("119 MiB", auto("119 MiB", 26, True), GREEN),
])

# 中间箭头 + 比值（上下排，都收在间隔里，避开右侧文字）
mid_x = LX + LEFT_W + 45
mixed(mid_x, BAR_Y + BAR_H / 2 - 16, [("→", font("msyhbd.ttc", 20), MUTED)])
mixed(mid_x, BAR_Y + BAR_H / 2 + 12, [("32:1", auto("32:1", 13, True), GOLD)])

# ── 下部：位图阵列示意 ───────────────────────────────────────────────────────
ARR_LABEL_Y = 296
d.text((W / 2, ARR_LABEL_Y), "位图：每个整数只占 1 bit · 按 bit 下标扫描，输出天然有序",
       font=mini_font, fill=MUTED, anchor="mm")

CELL = 26
CGAP = 4
COLS = 32
ROWS = 2
AW = COLS * CELL + (COLS - 1) * CGAP
AX = int((W - AW) / 2)
AY = 316
ON_CELLS = {1: [5, 12, 31], 0: [5, 12, 10, 31]}  # 两个字各自置位的 bit
for r in range(ROWS):
    y = AY + r * (CELL + 10)
    d.text((AX - 10, y + CELL / 2), f"字 {r}", font=mini_font, fill=MUTED, anchor="rm")
    for c in range(COLS):
        x = AX + c * (CELL + CGAP)
        on = c in ON_CELLS[r]
        if on:
            d.rounded_rectangle((x, y, x + CELL, y + CELL), radius=4,
                                fill=GREEN_FILL, outline=GREEN, width=2)
            d.ellipse((x + CELL / 2 - 4, y + CELL / 2 - 4, x + CELL / 2 + 4, y + CELL / 2 + 4),
                      fill=GREEN)
        else:
            d.rounded_rectangle((x, y, x + CELL, y + CELL), radius=4,
                                fill=WHITE, outline=BORDER, width=1)
    # bit 刻度
    for b in (0, 8, 16, 24, 31):
        x = AX + b * (CELL + CGAP) + CELL / 2
        d.text((x, y + CELL + 12), str(b), font=auto(str(b), 10), fill=DIM, anchor="mm")

# 扫描输出 chips
SCAN_Y = 404
mixed(W / 2, SCAN_Y, [
    ("扫描输出：", auto("扫描输出：", 14, True), INK),
    ("5  12  37  42  63", auto("5  12  37  42  63", 15, True), GREEN),
    ("  （值序即下标序）", auto("  （值序即下标序）", 14), MUTED),
])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 444
CARD_H = 108
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
        yy += 27


bottom_card(LEFT_X, GREEN, "1-bit：去重排序白送", [
    [("置位 words[w] |= 1 << b", auto("置位 words[w] |= 1 << b", 15, True), INK)],
    [("重复的再置那一位已是 1，跳过即去重", mini_font, MUTED)],
    [("扫描全位图，下标顺序就是值顺序", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, GOLD, "2-bit：次数分档", [
    [("00 未出现 / 01 一次 / 10 多次", auto("00 未出现 / 01 一次 / 10 多次", 15, True), INK)],
    [("一遍扫完：哪些重复、哪些只出现一次", mini_font, MUTED)],
    [("空间翻倍，换来「次数」这个新维度", mini_font, MUTED)],
])

d.text((W / 2, H - 34), "位图三件套：word = v >> 5 · bit = v & 31 · 置位 |= · 清位 &= ~（波浪号不能丢）",
       font=tiny_font, fill=MUTED, anchor="mm")

for out in ("frontend/public/photos/bitmap-cover.png", "photos/bitmap-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
