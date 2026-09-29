# -*- coding: utf-8 -*-
"""
make_lc33_cover.py — 【LC 33 / 153】旋转数组二分 合并篇的封面。

构图：柱状图画出 [4,5,6,7,0,1,2] 的两段上升 + 断崖，金环标最小值；
下面两张卡片给两题判据的对照（比较对象正好相反）。

红线（SKILL）：中英混排逐段绘制；标签只用 ASCII；坐标/宽度 int()。
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


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "旋转数组二分：断崖在哪边，答案就在哪边", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [("两段各自上升的折线 + 一道断崖 —— 33 和 153 的比较对象正好相反", tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 153", card_title, GREEN), ("  官方例 [4,5,6,7,0,1,2] · 最小值站在断崖右侧那段的起点", tiny_font, MUTED)])

# ── 柱状图 ───────────────────────────────────────────────────────────────────
NUMS = [4, 5, 6, 7, 0, 1, 2]
CW, GAP = 76, 14
ROW_W = len(NUMS) * CW + (len(NUMS) - 1) * GAP
LX = (W - ROW_W) / 2
BASE = 380
MAXH = 170

for i, v in enumerate(NUMS):
    x = int(LX + i * (CW + GAP))
    h = int(v / 7 * MAXH)
    y = BASE - h
    if v == 0:
        h = 30  # 高度太小时画一条矮柱（保证可见）
    # 断崖右侧（第二段）淡金底
    fill = GOLD_FILL if i >= 4 else WHITE
    stroke = GOLD if i == 4 else BORDER
    d.rounded_rectangle((x, y, x + CW, BASE), radius=7, fill=fill, outline=stroke, width=2)
    d.text((x + CW / 2, y + 16), str(v), font=code_small, fill=GOLD if i == 4 else INK, anchor="mm")
    d.text((x + CW / 2, BASE + 16), str(i), font=font("consola.ttf", 12), fill=DIM, anchor="mm")

# 断崖标注
cliff_x1 = LX + 3 * (CW + GAP) + CW
cliff_x2 = LX + 4 * (CW + GAP)
d.text(((cliff_x1 + cliff_x2) / 2, BASE - MAXH - 34), "断崖", font=pin_font, fill=ORANGE, anchor="mm")
d.line((cliff_x1 + 4, BASE - MAXH - 20, cliff_x1 + 4, BASE), fill=ORANGE, width=2)
d.line((cliff_x2 - 4, BASE - 36, cliff_x2 - 4, BASE), fill=ORANGE, width=2)

# 最小值金环
min_cx = LX + 4 * (CW + GAP) + CW / 2
d.ellipse((min_cx - 24, BASE - 36, min_cx + 24, BASE + 12), outline=GOLD, width=3)
d.text((min_cx, BASE + 40), "min = 0（下标 4）", font=pin_font, fill=GOLD, anchor="mm")

mixed(W / 2, 448,
      [("mid 和谁比，就知道 mid 在断崖哪边 —— 两道题各选了一个比较对象，", tiny_font, MUTED),
       ("正好相反", tiny_font, ORANGE)])

# ── 底部：两张判据卡片 ──────────────────────────────────────────────────────
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
    y = CARD_Y + 34
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 27


bottom_card(LEFT_X, GREEN, "LC 153 最小值", [
    [("nums[mid] > nums[right]", code_small, GREEN), (" → 在第一段", tiny_font, INK)],
    [("收缩 r = mid（mid 可能就是答案，不能丢）", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "LC 33 搜索", [
    [("nums[left] <= nums[mid]", code_small, ORANGE), (" → 左半有序", tiny_font, INK)],
    [("查有序半的值域定方向 · 等号是单元素区间的保证", mini_font, MUTED)],
])

d.text((W / 2, H - 16), "重复元素版 81 / 154：相等时唯一安全的动作是退一格（l += 1 / r -= 1），最坏退化 O(n)",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-33-cover.png", "photos/lc-33-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
