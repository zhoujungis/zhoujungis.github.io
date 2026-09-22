# -*- coding: utf-8 -*-
"""生成 LC 143 文章封面 frontend/public/photos/lc-143-cover.png。

风格对齐 LC 系列：米色底、左上 ALGORITHM 小标、居中标题、下方链路示意。
画面表达重排的本质：1→2→3→4 变成 1→4→2→3，后半段倒着插进缝里。
"""
import math

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 570
BG = (244, 242, 236)
INK = (31, 42, 36)
MUTED = (120, 128, 122)
BORDER = (214, 218, 210)
GREEN = (63, 107, 87)
ORANGE = (164, 95, 69)

TITLE = "重排链表"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

tag_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
title_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 44)

tag = "ALGORITHM"
tw = d.textlength(tag, font=tag_font)
d.text((88, 62), tag, font=tag_font, fill=MUTED)
d.line((88 + tw + 18, 76, 88 + tw + 78, 76), fill=BORDER, width=2)

tw = d.textlength(TITLE, font=title_font)
d.text(((W - tw) / 2, 100), TITLE, font=title_font, fill=INK)


def node_font():
    return ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 26)


# ── 上行：重排前 1→2→3→4 ────────────────────────────────────────────────────
def draw_row(ys, labels, colors, arrow_color=(120, 128, 122), nw=74, nh=54, gap=58):
    row_w = len(labels) * nw + (len(labels) - 1) * gap
    x0 = (W - row_w) / 2
    centers = []
    for i, label in enumerate(labels):
        x = x0 + i * (nw + gap)
        centers.append(x + nw / 2)
        fill, stroke = colors[i]
        d.rounded_rectangle((x, ys, x + nw, ys + nh), radius=12, fill=fill, outline=stroke, width=2)
        f = node_font()
        d.text((x + nw / 2, ys + nh / 2), label, font=f, fill=INK, anchor="mm")
        if i < len(labels) - 1:
            sx = x + nw
            ex = x + nw + gap
            d.line((sx + 4, ys + nh / 2, ex - 8, ys + nh / 2), fill=arrow_color, width=2)
            d.polygon([(ex, ys + nh / 2), (ex - 9, ys + nh / 2 - 5), (ex - 9, ys + nh / 2 + 5)], fill=arrow_color)
    return x0, centers


WHITE, GRAY = (255, 255, 255), BORDER
# 重排前
y1 = 262
labels1 = ["1", "2", "3", "4"]
colors1 = [(WHITE, GRAY)] * 4
draw_row(y1, labels1, colors1)
d.text((W / 2, y1 - 26), "重排前", font=ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 19), fill=MUTED, anchor="mm")

# 重排后：1→4→2→3，4 和 3 用橙色示意「从后半段拽上来的」
y2 = 424
labels2 = ["1", "4", "2", "3"]
lifted_fill = (252, 240, 233)
colors2 = [
    (WHITE, GRAY),
    (lifted_fill, ORANGE),
    (WHITE, GRAY),
    (lifted_fill, ORANGE),
]
draw_row(y2, labels2, colors2, arrow_color=GREEN)
d.text((W / 2, y2 - 26), "重排后", font=ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 19), fill=MUTED, anchor="mm")

# 中间一个向下的粗箭头，示意「变换」
ax = W / 2
ay1, ay2 = y1 + 66, y2 - 48
d.line((ax, ay1, ax, ay2 - 10), fill=MUTED, width=3)
d.polygon([(ax, ay2), (ax - 8, ay2 - 12), (ax + 8, ay2 - 12)], fill=MUTED)
d.text((ax + 16, (ay1 + ay2) / 2), "前半段不变，后半段倒着插进缝里",
       font=ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 18), fill=MUTED, anchor="lm")

# 底部小注
d.text((W / 2, H - 34), "找中点 · 反转后半段 · 交替合并", font=ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 20), fill=MUTED, anchor="mm")

out = r"D:\zhoujungis.github.io\frontend\public\photos\lc-143-cover.png"
img.save(out)
print("saved", out)
