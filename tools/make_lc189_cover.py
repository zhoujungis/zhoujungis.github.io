# -*- coding: utf-8 -*-
"""
make_lc189_cover.py — 【LC 189】轮转数组 的封面。

构图：两行数组讲三次翻转 —— 上行整体翻转后 [7,6,5,4,3,2,1]（两段就位、内部全反），
下行最终结果 [5,6,7,1,2,3,4]（前 k 段与后段各自翻回）。下面一张卡片给三轮清单。

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


def row(x0, y, values, cw=62, ch=50, gap=8, colors=None, texts=None):
    """画一行格子，返回每格中心 x。"""
    centers = []
    for i, v in enumerate(values):
        x = int(x0 + i * (cw + gap))
        fill, stroke, tcol = (colors or {}).get(i, (WHITE, BORDER, INK))
        d.rounded_rectangle((x, y, x + cw, y + ch), radius=7, fill=fill, outline=stroke, width=2)
        t = (texts or {}).get(i, str(v))
        d.text((x + cw / 2, y + ch / 2), t, font=code_small, fill=tcol, anchor="mm")
        centers.append(x + cw / 2)
    return centers


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "三次翻转：反转是自己的逆运算", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [("整体翻转让两段就位（内部全反），再各自翻回 —— 位置与顺序分开还原", tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 189", card_title, GREEN),
                   ("  [1,2,3,4,5,6,7] 向右轮转 k=3 → [5,6,7,1,2,3,4] · 要求 O(1) 空间", tiny_font, MUTED)])

# ── 上行：整体翻转后 ────────────────────────────────────────────────────────
CW, CH, GAP = 62, 50, 8
ROW_W = 7 * CW + 6 * GAP
X0 = (W - ROW_W) / 2

centers1 = row(X0, 186, [7, 6, 5, 4, 3, 2, 1],
               colors={i: (GOLD_FILL, GOLD, GOLD) for i in (0, 1, 2)})
d.text(((centers1[0] + centers1[2]) / 2, 186 - 18), "前 k 段（反着）", font=tiny_font,
       fill=ORANGE, anchor="mm")
d.text(((centers1[3] + centers1[6]) / 2, 186 - 18), "后 n-k 段（反着）", font=tiny_font,
       fill=ORANGE, anchor="mm")
mixed(W / 2, 260, [("两段已经就位 —— 但每段内部顺序是反的", tiny_font, MUTED)])

# ── 下行：各自翻回 ──────────────────────────────────────────────────────────
centers2 = row(X0, 300, [5, 6, 7, 1, 2, 3, 4],
               colors={0: (GREEN_FILL, GREEN, GREEN), 1: (GREEN_FILL, GREEN, GREEN),
                       2: (GREEN_FILL, GREEN, GREEN), 3: (GREEN_FILL, GREEN, GREEN),
                       4: (GREEN_FILL, GREEN, GREEN), 5: (GREEN_FILL, GREEN, GREEN),
                       6: (GREEN_FILL, GREEN, GREEN)})
mixed(W / 2, 374,
      [("② 翻转前 k 个：[7,6,5] → [5,6,7]　·　③ 翻转后 n-k 个：[4,3,2,1] → [1,2,3,4]", tiny_font, GREEN)])
mixed(W / 2, 398,
      [("反转两次 = 恒等 —— 位置交换与顺序恢复正好拆成两次独立的反转", tiny_font, MUTED)])

# ── 底部卡片 ────────────────────────────────────────────────────────────────
CARD_Y = 436
CARD_H = 122
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


bottom_card(LEFT_X, GREEN, "三轮清单", [
    [("1 reverse(0, n-1)  2 reverse(0, k-1)", code_small, INK)],
    [("3 reverse(k, n-1)", code_small, INK)],
    [("全程原地交换 · O(n) 时间 · O(1) 空间", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "两个坑", [
    [("k %= n", code_small, ORANGE), (" 先取模（k 可能大于 n）", tiny_font, INK)],
    [("Python 切片法 nums[-0:] 是整个数组，k=0 会炸", mini_font, MUTED)],
])

d.text((W / 2, H - 16), "同族：LC 151 翻转单词（同款三次翻转） · 环状替换（gcd 数圈，难写不推荐） · 61 旋转链表（成环再断）",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-189-cover.png", "photos/lc-189-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
