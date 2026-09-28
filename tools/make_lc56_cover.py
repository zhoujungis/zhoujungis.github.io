# -*- coding: utf-8 -*-
"""
make_lc56_cover.py — 【LC 56】合并区间 的封面。

构图：数轴上两行条 —— 上行是排序后的输入（[1,3] [2,6] [8,10] [15,18]），
下行是合并结果（[1,6] [8,10] [15,18]），[1,6] 比 [1,3] 和 [2,6] 罩得更宽，
一眼讲清"延伸"。底部两张卡片：扫描规则 vs 复杂度。

红线（SKILL）：中英混排逐段绘制；标签只用 ASCII；坐标/宽度转 int。
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


def bar(x1, x2, y, h, fill, stroke, sw=2, label=None, label_color=INK, label_inside=True):
    """区间条：x1..x2 是数轴坐标像素。"""
    x1, x2, y, h = int(x1), int(x2), int(y), int(h)
    d.rounded_rectangle((x1, y, x2, y + h), radius=9, fill=fill, outline=stroke, width=max(1, int(sw)))
    if label:
        if label_inside:
            d.text(((x1 + x2) / 2, y + h / 2), label, font=code_small, fill=label_color, anchor="mm")
        else:
            d.text((x1 - 14, y + h / 2), label, font=code_small, fill=label_color, anchor="rm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "合并区间：先排序，再线性扫描", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [("排序把「可能重叠的对」压缩成「只和当前合并区间比一次」", tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 56", card_title, GREEN), ("  [[1,3],[2,6],[8,10],[15,18]]  →  [[1,6],[8,10],[15,18]]", tiny_font, MUTED)])

# ── 数轴 ─────────────────────────────────────────────────────────────────────
PLOT_L, PLOT_R = 220, 940
VMAX = 18.0


def xof(v):
    return PLOT_L + (v / VMAX) * (PLOT_R - PLOT_L)


AX_Y = 180
d.line((PLOT_L, AX_Y, PLOT_R, AX_Y), fill=BORDER, width=2)
for v in range(0, 19, 2):
    x = xof(v)
    d.line((x, AX_Y - 5, x, AX_Y + 5), fill=BORDER, width=1)
    d.text((x, AX_Y + 18), str(v), font=font("consola.ttf", 12), fill=DIM, anchor="mm")

# ── 上行：排序后的输入（四条白条，错行摆放）─────────────────────────────────
ROW_Y = [236, 292, 348, 404]
INPUT = [(1, 3, "1-3"), (2, 6, "2-6"), (8, 10, "8-10"), (15, 18, "15-18")]
mixed(PLOT_L - 96, ROW_Y[0] + 12, [("排序后", mini_font, MUTED)])
for (s, e, lab), y in zip(INPUT, ROW_Y):
    bar(xof(s), xof(e), y, 26, WHITE, BORDER, 1.5, label=lab)

# 括注：前两条会合并（放在 2-6 条右侧的空白处）
d.text((xof(6) + 16, ROW_Y[1] + 13), "重叠 → 合并", font=tiny_font, fill=ORANGE, anchor="lm")

# ── 下行：合并结果 ───────────────────────────────────────────────────────────
RES_Y = 404
mixed(PLOT_L - 96, RES_Y + 12, [("合并后", mini_font, GREEN)])
bar(xof(1), xof(6), RES_Y, 26, GREEN_FILL, GREEN, 2.5, label="1-6", label_color=GREEN)
bar(xof(8), xof(10), RES_Y, 26, GREEN_FILL, GREEN, 2.5, label="8-10", label_color=GREEN)
bar(xof(15), xof(18), RES_Y, 26, GREEN_FILL, GREEN, 2.5, label="15-18", label_color=GREEN)

mixed(PLOT_L + (PLOT_R - PLOT_L) / 2, 466,
      [("end 取 ", tiny_font, MUTED), ("max(3, 6)", code_small, GREEN),
       (" —— 延伸不覆盖，整体被罩住的区间也要保住", tiny_font, MUTED)])

# ── 底部：两张对照卡片 ──────────────────────────────────────────────────────
CARD_Y = 500
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
        y += 26


bottom_card(LEFT_X, GREEN, "扫描规则", [
    [("start <= curEnd ", code_small, GREEN), ("→ 延伸（", tiny_font, INK), ("max", code_small, GREEN), (" 保底）", tiny_font, INK)],
    [("否则收段、新开 —— 端点相触也算重叠", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "复杂度", [
    [("O(n log n) ", code_small, INK), ("时间 · 瓶颈全在排序", tiny_font, INK)],
    [("扫描 O(n)：每区间只比当前合并区间一次", mini_font, MUTED)],
])

d.text((W / 2, H - 16), "同族变体：57 插入区间（免排序） · 435 无重叠区间 · 452 气球（按右端点贪心） · 986 交集（双指针）",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-56-cover.png", "photos/lc-56-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
