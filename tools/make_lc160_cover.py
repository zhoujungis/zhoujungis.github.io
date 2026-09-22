# -*- coding: utf-8 -*-
"""生成 LC 160 文章封面 frontend/public/photos/lc-160-cover.png。

风格对齐 LC 系列：米色底、左上 ALGORITHM 小标、居中标题、下方链路示意。
画面表达相交链表的本质：A、B 两条链画成 Y 字汇合到同一个节点，
下方标出"两条路一样长"的等式 a + c + b == b + c + a。
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 570
BG = (244, 242, 236)
INK = (31, 42, 36)
MUTED = (120, 128, 122)
BORDER = (214, 218, 210)
GREEN = (63, 107, 87)
ORANGE = (164, 95, 69)

TITLE = "相交链表"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

tag_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
title_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 44)
small_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 19)
node_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 26)
note_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 20)
mono_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 21)

tag = "ALGORITHM"
tw = d.textlength(tag, font=tag_font)
d.text((88, 62), tag, font=tag_font, fill=MUTED)
d.line((88 + tw + 18, 76, 88 + tw + 78, 76), fill=BORDER, width=2)

tw = d.textlength(TITLE, font=title_font)
d.text(((W - tw) / 2, 100), TITLE, font=title_font, fill=INK)

WHITE = (255, 255, 255)
NW, NH, GAP = 76, 54, 56


def node(x, y, label, stroke=BORDER, fill=WHITE, width=2):
    d.rounded_rectangle((x, y, x + NW, y + NH), radius=12, fill=fill, outline=stroke, width=width)
    d.text((x + NW / 2, y + NH / 2), label, font=node_font, fill=INK, anchor="mm")


def arrow(x1, y1, x2, y2, color=MUTED, width=2):
    import math
    ang = math.atan2(y2 - y1, x2 - x1)
    head = 11
    tipx, tipy = x2, y2
    bx, by = x2 - head * math.cos(ang), y2 - head * math.sin(ang)
    d.line((x1, y1, bx, by), fill=color, width=width)
    d.polygon(
        [
            (tipx, tipy),
            (bx - 6 * math.sin(ang), by + 6 * math.cos(ang)),
            (bx + 6 * math.sin(ang), by - 6 * math.cos(ang)),
        ],
        fill=color,
    )


# ── Y 字布局 ────────────────────────────────────────────────────────────────
# A 行在上：1 → 2 → 3 → 4 → 5
# B 行在下：6 → 7 ──┐  然后并到同一个 4 上
yA = 232
yB = 372
rowA = ["1", "2", "3", "4", "5"]
rowB = ["6", "7"]

row_w = len(rowA) * NW + (len(rowA) - 1) * GAP
x0 = (W - row_w) / 2
colx = lambda i: x0 + i * (NW + GAP)

for i, label in enumerate(rowA):
    node(colx(i), yA, label)
    if i < len(rowA) - 1:
        arrow(colx(i) + NW + 4, yA + NH / 2, colx(i + 1) - 2, yA + NH / 2)

# B 的两个独有节点，左对齐到 A 的起点

for i, label in enumerate(rowB):
    node(colx(i), yB, label)
arrow(colx(0) + NW + 4, yB + NH / 2, colx(1) - 2, yB + NH / 2)
# B 的尾巴 7 汇入 A 的 4（跨行曲线）
arrow(
    colx(1) + NW + 4,
    yB + NH / 2,
    colx(3) - 2,
    yA + NH / 2,
    color=ORANGE,
    width=3,
)

# 行标签
d.text((x0 - 20, yA + NH / 2), "A", font=small_font, fill=GREEN, anchor="rm")
d.text((x0 - 20, yB + NH / 2), "B", font=small_font, fill=ORANGE, anchor="rm")

# 相交起始节点 4 高亮（橙色虚线框）
bx = colx(3) - 8
d.rounded_rectangle(
    (bx, yA - 8, bx + NW + 16, yA + NH + 8), radius=14, outline=ORANGE, width=3
)
d.text((colx(3) + NW / 2, yA - 26), "相交起点", font=small_font, fill=ORANGE, anchor="mm")


# ── 底部：两条路一样长 ──────────────────────────────────────────────────────
# 注意：Consolas 没有中文字形，中英混排会渲染成方框。所以中文用 msyh，
# 只有纯 ASCII 的算式片段才用等宽字体 —— 逐段排版。
eq_y = 484
mono = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 21)


def mixed_text(cx, cy, parts):
    """parts = [(text, font, color)]，整体按 cx 居中、cy 为中线。"""
    total = sum(d.textlength(t, font=f) for t, f, _ in parts)
    x = cx - total / 2
    for t, f, c in parts:
        d.text((x, cy), t, font=f, fill=c, anchor="lm")
        x += d.textlength(t, font=f)


CJK = small_font  # msyh 19，有全部中文字形
mixed_text(
    W / 2, eq_y - 22,
    [("pA 的路 = ", CJK, MUTED), ("A独有(a)", CJK, GREEN), (" + ", CJK, MUTED),
     ("公共(c)", CJK, INK), (" + ", CJK, MUTED), ("B独有(b)", CJK, GREEN)],
)
mixed_text(
    W / 2, eq_y + 12,
    [("pB 的路 = ", CJK, MUTED), ("B独有(b)", CJK, GREEN), (" + ", CJK, MUTED),
     ("公共(c)", CJK, INK), (" + ", CJK, MUTED), ("A独有(a)", CJK, GREEN)],
)
mixed_text(
    W / 2, eq_y + 54,
    [("a + b + c", mono, INK), ("  ==  ", mono, MUTED), ("a + b + c", mono, INK),
     ("    必然同时到达 c1", CJK, ORANGE)],
)

out = r"D:\zhoujungis.github.io\frontend\public\photos\lc-160-cover.png"
img.save(out)
print("saved", out)
