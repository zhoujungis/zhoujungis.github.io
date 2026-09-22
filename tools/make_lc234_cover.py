# -*- coding: utf-8 -*-
"""生成 LC 234 文章封面 frontend/public/photos/lc-234-cover.png。

风格对齐 LC 系列：米色底、左上 ALGORITHM 小标、居中标题、下方链路示意。
画面表达回文的本质：1→2→2→1 拆成上下两行对齐（后半段反转），逐列相等。
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 570
BG = (244, 242, 236)
INK = (31, 42, 36)
MUTED = (120, 128, 122)
BORDER = (214, 218, 210)
GREEN = (63, 107, 87)

TITLE = "回文链表"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

tag_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
title_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 44)
small_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 19)
node_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 26)
note_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 20)

tag = "ALGORITHM"
tw = d.textlength(tag, font=tag_font)
d.text((88, 62), tag, font=tag_font, fill=MUTED)
d.line((88 + tw + 18, 76, 88 + tw + 78, 76), fill=BORDER, width=2)

tw = d.textlength(TITLE, font=title_font)
d.text(((W - tw) / 2, 100), TITLE, font=title_font, fill=INK)

WHITE, GRAY = (255, 255, 255), BORDER
NW, NH, GAP = 74, 54, 58


def draw_arrow_line(x1, y, x2, color, width=2):
    d.line((x1, y, x2 - 8, y), fill=color, width=width)
    d.polygon([(x2, y), (x2 - 9, y - 5), (x2 - 9, y + 5)], fill=color)


# ── 上行：原链 1→2→2→1 ──────────────────────────────────────────────────────
y1 = 224
row_w = 4 * NW + 3 * GAP
x0 = (W - row_w) / 2
for i, label in enumerate(["1", "2", "2", "1"]):
    x = x0 + i * (NW + GAP)
    d.rounded_rectangle((x, y1, x + NW, y1 + NH), radius=12, fill=WHITE, outline=GRAY, width=2)
    d.text((x + NW / 2, y1 + NH / 2), label, font=node_font, fill=INK, anchor="mm")
    if i < 3:
        draw_arrow_line(x + NW + 4, y1 + NH / 2, x + NW + GAP, MUTED)
d.text((W / 2, y1 - 26), "原链表", font=small_font, fill=MUTED, anchor="mm")

# ── 下方：前半段 / 后半段反转后，逐列对齐，右侧打 ✓ ─────────────────────────
half_labels = ["1", "2"]
half_w = 2 * NW + GAP
hx0 = (W - half_w) / 2 + 60  # 右移一点，左侧留给行标签
y2, y3 = 358, 458

rows = [(y2, WHITE, GRAY, "前半段"), (y3, (240, 246, 242), GREEN, "后半段反转后")]
for ys, fill, stroke, row_label in rows:
    for i, label in enumerate(half_labels):
        x = hx0 + i * (NW + GAP)
        d.rounded_rectangle((x, ys, x + NW, ys + NH), radius=12, fill=fill, outline=stroke, width=2)
        d.text((x + NW / 2, ys + NH / 2), label, font=node_font, fill=INK, anchor="mm")
        if i < len(half_labels) - 1:
            draw_arrow_line(x + NW + 4, ys + NH / 2, x + NW + GAP, GREEN)
    d.text((hx0 - 18, ys + NH / 2), row_label, font=small_font, fill=MUTED, anchor="rm")


def draw_check(cx, cy):
    """画一个实心圆 + 线段对勾（不依赖字体里的 ✓ 字形）。"""
    r = 15
    d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=GREEN)
    d.line((cx - 6, cy + 1, cx - 1, cy + 6), fill=(255, 255, 255), width=3)
    d.line((cx - 1, cy + 6, cx + 7, cy - 5), fill=(255, 255, 255), width=3)


for i in range(2):
    cx = hx0 + i * (NW + GAP) + NW / 2
    cy = (y2 + y3 + NH) / 2
    d.line((cx, y2 + NH + 6, cx, cy - 22), fill=GREEN, width=2)
    d.line((cx, cy + 22, cx, y3 - 6), fill=GREEN, width=2)
    draw_check(cx, cy)

# 中间的变换箭头：原链 → 拆开对齐
ax = W / 2
ay1, ay2 = y1 + NH + 16, y2 - 44
d.line((ax, ay1, ax, ay2 - 10), fill=MUTED, width=3)
d.polygon([(ax, ay2), (ax - 8, ay2 - 12), (ax + 8, ay2 - 12)], fill=MUTED)
d.text((ax + 16, (ay1 + ay2) / 2), "后半段反转过来，应该跟前半段一模一样",
       font=ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 18), fill=MUTED, anchor="lm")

# 底部小注
d.text((W / 2, H - 26), "找中点 · 反转后半段 · 逐对比较", font=note_font, fill=MUTED, anchor="mm")

out = r"D:\zhoujungis.github.io\frontend\public\photos\lc-234-cover.png"
img.save(out)
print("saved", out)
