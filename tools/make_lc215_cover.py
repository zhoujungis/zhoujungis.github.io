# -*- coding: utf-8 -*-
"""
make_lc215_cover.py — 【LC 215 / 347】TopK 双题的封面。

一张图讲清合并篇的骨架：LC 215 在值轴上选「一个位置」（快速选择，枢轴归位即排名），
LC 347 在频率轴上收「一段前缀」（桶排序，频率即桶下标）。

红线（SKILL）：
- 中英混排逐段绘制：Consolas 无中文字形，中文一律 msyh；
- 底部小注长度上限约 900px，超了精简文字而不是缩字号；
- 卡片内按段累加行高；
- 标签只用 ASCII。
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 700
BG = (247, 246, 242)
INK = (31, 42, 36)
MUTED = (101, 113, 104)
BORDER = (195, 201, 194)
GREEN = (63, 107, 87)
GREEN_FILL = (238, 245, 241)
ORANGE = (164, 95, 69)
ORANGE_FILL = (250, 237, 232)
GOLD = (194, 135, 47)
GOLD_FILL = (253, 243, 227)
DIM = (154, 163, 156)
DIM_FILL = (240, 239, 234)
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 34)
sub_font = font("msyh.ttc", 19)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 17)
code_font = font("consola.ttf", 16)
pin_font = font("msyhbd.ttc", 14)

d = ImageDraw.Draw(Image.new("RGB", (W, H), BG))
img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)


def mixed(cx, cy, parts, anchor="mm"):
    """中英混排：parts = [(text, font, color), ...]，按段累加宽度。"""
    if anchor == "mm":
        total = sum(d.textlength(t, font=f) for t, f, _ in parts)
        x = cx - total / 2
    else:
        x = cx
    for text, f, color in parts:
        d.text((x, cy), text, font=f, fill=color, anchor="lm")
        x += d.textlength(text, font=f)


def cell(x, y, w, h, text, fill, stroke, text_color, sw=1.5, dashed=False, fs=17):
    x, y, w, h = int(x), int(y), int(w), int(h)
    d.rounded_rectangle((x, y, x + w, y + h), radius=7, fill=fill, outline=stroke, width=max(1, int(sw)))
    f = code_small if fs >= 16 else font("consola.ttf", fs)
    d.text((x + w / 2, y + h / 2), text, font=f, fill=text_color, anchor="mm")


def tag(cx, cy, text, fill, text_color=WHITE, w=None):
    tw = w or (int(d.textlength(text, font=pin_font)) + 20)
    d.rounded_rectangle((cx - tw / 2, cy - 12, cx + tw / 2, cy + 12), radius=6, fill=fill)
    d.text((cx, cy), text, font=pin_font, fill=text_color, anchor="mm")


def tri_down(cx, top, fill):
    d.polygon([(cx - 7, top), (cx + 7, top), (cx, top + 11)], fill=fill)


def tri_up(cx, bottom, fill):
    d.polygon([(cx - 7, bottom), (cx + 7, bottom), (cx, bottom - 11)], fill=fill)


# ── 顶部标题 ─────────────────────────────────────────────────────────────────
d.text((W / 2, 52), "TopK 双题：位置 vs 桶", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 92, [("LC 215 快速选择：分区后位置即排名　·　", tiny_font, MUTED),
                  ("LC 347 桶排序：频率即下标", tiny_font, MUTED)])

# ── 左半：LC 215 快速选择 ────────────────────────────────────────────────────
# 数组 [3,2,1,4,6,5]（分区后），枢轴 4 落在下标 3，目标位 4 在右边
NODES = [("3", DIM_FILL), ("2", DIM_FILL), ("1", DIM_FILL), ("4", GOLD_FILL), ("6", WHITE), ("5", WHITE)]
CW, CH, GAP = 56, 50, 7
ROW_W = 6 * CW + 5 * GAP
LX = (W / 2 - 24) / 2 - ROW_W / 2 + 60
CY = 248

mixed(W / 4 + 40, 150, [("LC 215", card_title, GREEN), ("  第 2 大 · 目标位 4", tiny_font, MUTED)])

for i, (t, fill) in enumerate(NODES):
    x = LX + i * (CW + GAP)
    stroke = GOLD if i == 3 else (DIM if i < 3 else BORDER)
    dash = i < 3
    cell(x, CY, CW, CH, t, fill, stroke, DIM if i < 3 else INK, dashed=dash)

# 枢轴标签
tag(LX + 3 * (CW + GAP) + CW / 2, CY - 30, "pivot=4", GOLD)
tri_down(LX + 3 * (CW + GAP) + CW / 2, CY - 18, GOLD)

# 目标位箭头（指向下标 4）
tx = LX + 4 * (CW + GAP) + CW / 2
d.text((tx, CY + CH + 24), "目标位 4", font=pin_font, fill=GOLD, anchor="mm")
d.line((tx, CY + CH + 6, tx, CY + CH + 12), fill=GOLD, width=2)
tri_up(tx, CY + CH + 6, GOLD)

mixed(W / 4 + 40, CY + CH + 58,
      [("分区一次 = 确定一个的最终排名", tiny_font, MUTED)])
mixed(W / 4 + 40, CY + CH + 86,
      [("答案在右边 → 左边 4 个全部淘汰", tiny_font, GREEN)])

# 分隔虚线
for yy in range(150, 560, 9):
    d.line((W / 2 - 20, yy, W / 2 - 8, yy), fill=BORDER, width=2)

# ── 右半：LC 347 桶排序 ─────────────────────────────────────────────────────
RX = W / 2 + 60
mixed(RX + ROW_W / 2 - 20, 150, [("LC 347", card_title, ORANGE), ("  前 2 高频", tiny_font, MUTED)])

# 频率卡片
mixed(RX + 60, 196, [("计数：", tiny_font, MUTED),
                     ("1x3", code_font, ORANGE), ("  ", code_font, MUTED),
                     ("2x2", code_font, ORANGE), ("  ", code_font, MUTED),
                     ("3x1", code_font, ORANGE)])

# 桶行：下标 0..6，桶 3 里有 1，桶 2 里有 2，桶 1 里有 3
BW, BH, BGAP = 46, 56, 5
BROW_W = 7 * BW + 6 * BGAP
BX = RX + (ROW_W - BROW_W) / 2 - 20
BY = 248

for f in range(7):
    x = BX + f * (BW + BGAP)
    items = {3: "1", 2: "2", 1: "3"}.get(f, "")
    if f in (2, 3):
        fill, stroke, tcol, sw = GREEN_FILL, GREEN, GREEN, 2
    elif items:
        fill, stroke, tcol, sw = WHITE, BORDER, INK, 1.5
    else:
        fill, stroke, tcol, sw = DIM_FILL, BORDER, DIM, 1
    cell(x, BY, BW, BH, items, fill, stroke, tcol, sw=sw, fs=15)
    d.text((x + BW / 2, BY + 13), f"f={f}", font=font("consola.ttf", 11.5), fill=MUTED, anchor="mm")

# 收集指针（指向 f=3）
cx3 = BX + 3 * (BW + BGAP) + BW / 2
tag(cx3, BY - 24, "f=3", ORANGE)
tri_down(cx3, BY - 12, ORANGE)
d.text((BX + BROW_W / 2, BY + BH + 22), "从高频往低频收，收满 k 个停", font=pin_font, fill=ORANGE, anchor="mm")

mixed(RX + ROW_W / 2 - 20, BY + BH + 52,
      [("频率天然在 [1, n] —— 用它当桶下标", tiny_font, MUTED)])
mixed(RX + ROW_W / 2 - 20, BY + BH + 78,
      [("一次比较都不用做，总计 O(n)", tiny_font, ORANGE)])

# ── 底部：两条解法线的对照 ───────────────────────────────────────────────────
CARD_Y = 560
CARD_H = 96
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
        y += 27


bottom_card(LEFT_X, GREEN, "快速选择", [
    [("平均 ", tiny_font, INK), ("O(n) / O(1) ", code_small, INK), ("空间", tiny_font, INK)],
    [("流式不行 · 会改原数组 · 要随机化", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "小根堆 / 桶", [
    [("堆 ", tiny_font, INK), ("O(n log k) ", code_small, INK), ("空间 ", tiny_font, INK), ("O(k)", code_small, INK)],
    [("键是小整数范围 → 桶排序 ", mini_font, MUTED), ("O(n)", code_small, MUTED)],
])

d.text((W / 2, H - 18), "海量数据 TopK：内存装不下时，堆流式扫一遍；连去重都装不下时，哈希分桶分治",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-215-cover.png", "photos/lc-215-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
