# -*- coding: utf-8 -*-
"""生成 LC 82 文章封面 frontend/public/photos/lc-82-cover.png。

风格对齐 LC 系列：米色底、左上 ALGORITHM 小标、居中标题、下方链路示意。
画面表达本题的本质：1→2→3→3→4→4→5 里的重复段（3 3 和 4 4）整段被划掉，
结果只剩 1→2→5；左侧另有一个 dummy 虚线节点，点出"头节点也可能被删"。
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 570
BG = (244, 242, 236)
INK = (31, 42, 36)
MUTED = (120, 128, 122)
BORDER = (214, 218, 210)
GREEN = (63, 107, 87)
ORANGE = (164, 95, 69)
CUT = (179, 69, 46)

TITLE = "删除重复元素 II"

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
NW, NH, GAP = 72, 54, 30


def node(x, y, label, stroke=BORDER, fill=WHITE, width=2, dashed=False,
         value_color=INK, strike=False):
    """画一个节点；dashed=True 画虚线框（dummy 用）；strike=True 打删除线。"""
    if dashed:
        _dashed_round_rect(x, y, x + NW, y + NH, 12, stroke, width)
    else:
        d.rounded_rectangle((x, y, x + NW, y + NH), radius=12, fill=fill,
                            outline=stroke, width=width)
    d.text((x + NW / 2, y + NH / 2), label, font=node_font, fill=value_color, anchor="mm")
    if strike:
        # 删除线：用两条短横线（一条压字面、一条在下）明确"划掉"，
        # 单条横线太像字体本身的笔画，容易被读成"3"的一部分。
        cx0, cy0 = x + NW / 2, y + NH / 2
        d.line((cx0 - 16, cy0 + 1, cx0 + 16, cy0 + 1), fill=CUT, width=3)
        d.line((cx0 - 13, cy0 - 11, cx0 + 13, cy0 - 11), fill=CUT, width=2)
        d.line((cx0 - 16, cy0 + 13, cx0 + 16, cy0 + 13), fill=CUT, width=2)


def _dashed_round_rect(x1, y1, x2, y2, r, color, width=2, dash=7, gap=5):
    """圆角虚线矩形（PIL 没有原生虚线，自己拼四条边）。"""
    def dashed_line(p1, p2):
        import math
        x1_, y1_, x2_, y2_ = *p1, *p2
        total = math.hypot(x2_ - x1_, y2_ - y1_)
        if total == 0:
            return
        ux, uy = (x2_ - x1_) / total, (y2_ - y1_) / total
        pos = 0.0
        while pos < total:
            seg = min(dash, total - pos)
            d.line((x1_ + ux * pos, y1_ + uy * pos,
                    x1_ + ux * (pos + seg), y1_ + uy * (pos + seg)),
                   fill=color, width=width)
            pos += dash + gap

    # 四条直边（圆角处留空，简化处理，视觉上够用）
    dashed_line((x1 + r, y1), (x2 - r, y1))
    dashed_line((x1 + r, y2), (x2 - r, y2))
    dashed_line((x1, y1 + r), (x1, y2 - r))
    dashed_line((x2, y1 + r), (x2, y2 - r))
    # 四个圆角用弧线补齐
    d.arc((x1, y1, x1 + 2 * r, y1 + 2 * r), 180, 270, fill=color, width=width)
    d.arc((x2 - 2 * r, y1, x2, y1 + 2 * r), 270, 360, fill=color, width=width)
    d.arc((x1, y2 - 2 * r, x1 + 2 * r, y2), 90, 180, fill=color, width=width)
    d.arc((x2 - 2 * r, y2 - 2 * r, x2, y2), 0, 90, fill=color, width=width)


def arrow(x1, y, x2, color=MUTED, width=2):
    d.line((x1, y, x2 - 8, y), fill=color, width=width)
    d.polygon([(x2, y), (x2 - 9, y - 5), (x2 - 9, y + 5)], fill=color)


# ── 上行：原链表，含 dummy 与两段重复 ───────────────────────────────────────
y1 = 252
labels = ["dummy", "1", "2", "3", "3", "4", "4", "5"]
dup_idx = {3, 4, 5, 6}  # 重复段：3 3 和 4 4
row_w = len(labels) * NW + (len(labels) - 1) * GAP
x0 = (W - row_w) / 2


def colx(i):
    return x0 + i * (NW + GAP)


for i, lab in enumerate(labels):
    if i == 0:
        node(colx(i), y1, "dummy", stroke=MUTED, dashed=True, value_color=MUTED)
    elif i in dup_idx:
        node(colx(i), y1, lab, stroke=CUT, fill=(252, 240, 236),
             width=2, value_color=CUT, strike=True)
    else:
        node(colx(i), y1, lab)
    if i < len(labels) - 1:
        arrow(colx(i) + NW + 2, y1 + NH / 2, colx(i + 1) - 2)

# dummy 上方标注：抬高到节点之上，别压到虚线框
d.text((colx(0) + NW / 2, y1 - 44), "dummy = 人造前驱",
       font=small_font, fill=MUTED, anchor="mm")

# 重复段整体框（橙色虚线，罩住 3 3 和 4 4 —— 分两块画）
for (a, b) in [(3, 4), (5, 6)]:
    bx1 = colx(a) - 9
    bx2 = colx(b) + NW + 9
    _dashed_round_rect(bx1, y1 - 9, bx2, y1 + NH + 9, 14, ORANGE, width=3)
# 重复段说明：与 dummy 标注同一条基线
d.text(((colx(3) + colx(6) + NW) / 2, y1 - 44),
       "重复段：整段摘掉，一个不留", font=small_font, fill=ORANGE, anchor="mm")

# ── 下行：结果 1 → 2 → 5 ────────────────────────────────────────────────────
y2 = 430
res = ["1", "2", "5"]
res_w = len(res) * NW + (len(res) - 1) * GAP
rx0 = (W - res_w) / 2


def rcolx(i):
    return rx0 + i * (NW + GAP)


for i, lab in enumerate(res):
    node(rcolx(i), y2, lab, stroke=GREEN, fill=(240, 246, 242), width=3)
    if i < len(res) - 1:
        arrow(rcolx(i) + NW + 2, y2 + NH / 2, rcolx(i + 1) - 2, color=GREEN, width=3)
d.text((rx0 - 22, y2 + NH / 2), "结果", font=small_font, fill=GREEN, anchor="rm")

# 中间一行等式（放在上行框下沿与下行节点之间的空当里）
eq_y = 372
mixed_parts = [
    ("1 2 3 3 4 4 5", mono_font, MUTED),
    ("   ->   ", mono_font, MUTED),
    ("1 2 5", mono_font, GREEN),
]
total = sum(d.textlength(t, font=f) for t, f, _ in mixed_parts)
cx = W / 2 - total / 2
for t, f, c in mixed_parts:
    d.text((cx, eq_y), t, font=f, fill=c, anchor="lm")
    cx += d.textlength(t, font=f)

# 底部小注
d.text((W / 2, H - 26), "dummy 哨兵 · prev 原地等 · prev.next = curr 整段摘掉",
       font=note_font, fill=MUTED, anchor="mm")

out = r"D:\zhoujungis.github.io\frontend\public\photos\lc-82-cover.png"
img.save(out)
print("saved", out)
