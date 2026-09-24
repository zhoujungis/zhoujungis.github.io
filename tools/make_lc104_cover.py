# -*- coding: utf-8 -*-
"""生成 LC 104 + LC 226 合并篇的文章封面 frontend/public/photos/lc-104-cover.png。

风格对齐 LC 系列：米色底、左上 ALGORITHM 小标、居中标题、下方示意图。
一张图同时表现两道题 —— 因为它们是「树递归的两种模式」：

  左侧（104 最大深度）—— 演示树 [3,9,20,null,null,15,7]，
        每个节点上方挂绿色 `h=` 高度标签，展示"高度从叶子一层层往上冒"；
        根下面标出 1 + max(1, 2) = 3 这个计算式。

  右侧（226 翻转二叉树）—— 官方例 [4,2,7,1,3,6,9] 的"翻前 → 翻后"两棵小树，
        中间一个橙色双向箭头，直观表达"整棵树照了镜子"。

  底部 —— 一行点出变体：111 最小深度（空子树不是叶子）· 110 平衡 · 101 对称 · 951 等价翻转。
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 570
BG = (244, 242, 236)
INK = (31, 42, 36)
MUTED = (120, 128, 122)
BORDER = (214, 218, 210)
GREEN = (63, 107, 87)
ORANGE = (164, 95, 69)
WHITE = (255, 255, 255)
GREEN_FILL = (240, 246, 242)
ORANGE_FILL = (252, 243, 238)
DIM = (185, 185, 179)

TITLE = "二叉树的最大深度 · 翻转二叉树"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

tag_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
title_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 40)
note_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 20)
label_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 19)
tiny_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 16)
mono_small = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 15)

# ── 页眉：ALGORITHM 小标 + 标题 ─────────────────────────────────────────────
tag = "ALGORITHM"
tw = d.textlength(tag, font=tag_font)
d.text((88, 52), tag, font=tag_font, fill=MUTED)
d.line((88 + tw + 18, 66, 88 + tw + 78, 66), fill=BORDER, width=2)

tw = d.textlength(TITLE, font=title_font)
d.text(((W - tw) / 2, 84), TITLE, font=title_font, fill=INK)

# ── 中间竖分隔线 ───────────────────────────────────────────────────────────
d.line((550, 168, 550, 440), fill=BORDER, width=2)


def mix(cx, cy, parts, anchor="mm"):
    """parts: [(text, font, color, is_mono), ...] —— 按段选字体，混排不断字。"""
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    total = sum(widths)
    x = cx - total / 2 if anchor == "mm" else cx
    for (t, f, c), w in zip(parts, widths):
        d.text((x, cy), t, font=f, fill=c, anchor="lm")
        x += w


# ══════════════════════════════════════════════════════════════════════════
# 左侧：LC 104 —— 高度从叶子往上冒
# ══════════════════════════════════════════════════════════════════════════
NODE_R = 21
LX_CX = 300
LEAF_STEP_L = 46                      # 树宽 = 4 * 46 = 184
ROW_L = [240, 316, 392]
L_LEFT = LX_CX - 2 * LEAF_STEP_L


def lx(col, depth):
    unit = LEAF_STEP_L * (2 ** (2 - depth))
    return L_LEFT + (col + 0.5) * unit


nodes104 = {
    "3": (lx(0, 0), ROW_L[0]),
    "9": (lx(0, 1), ROW_L[1]),
    "20": (lx(1, 1), ROW_L[1]),
    "15": (lx(2, 2), ROW_L[2]),
    "7": (lx(3, 2), ROW_L[2]),
}
edges104 = [("3", "9"), ("3", "20"), ("20", "15"), ("20", "7")]
for a, b in edges104:
    (x1, y1), (x2, y2) = nodes104[a], nodes104[b]
    d.line((x1, y1 + NODE_R, x2, y2 - NODE_R), fill=(150, 158, 150), width=2)

HEIGHTS = {"3": "h=3", "9": "h=1", "20": "h=2", "15": "h=1", "7": "h=1"}
for key, (cx, cy) in nodes104.items():
    d.ellipse((cx - NODE_R, cy - NODE_R, cx + NODE_R, cy + NODE_R),
              fill=GREEN_FILL, outline=GREEN, width=2)
    d.text((cx, cy), key, font=mono_small, fill=INK, anchor="mm")
    # 高度标签：贴在节点正上方
    txt = HEIGHTS[key]
    bw = d.textlength(txt, font=mono_small) + 14
    by = cy - NODE_R - 27
    d.rounded_rectangle((cx - bw / 2, by, cx + bw / 2, by + 20), radius=6,
                        fill=BG, outline=GREEN, width=1)
    d.text((cx, by + 10), txt, font=mono_small, fill=GREEN, anchor="mm")

# 左区标题 + 计算式
mix(300, 176, [("LC 104", label_font, GREEN), ("  最大深度", tiny_font, MUTED)])
mix(300, 434, [("1 + max(1, 2) = ", mono_small, MUTED), ("3", mono_small, GREEN)])
d.text((300, 460), "高度从叶子一层层往上冒", font=tiny_font, fill=MUTED, anchor="mm")

# ══════════════════════════════════════════════════════════════════════════
# 右侧：LC 226 —— 翻前 → 翻后
# ══════════════════════════════════════════════════════════════════════════
# 叶子层相邻间距 = STEP_R，节点直径 = 2 * R_NODE_R，必须 STEP_R > 2 * R_NODE_R，
# 否则最下面一层四个节点会挤成一团（初版 27 配半径 14 正好相切）。
R_NODE_R = 12
STEP_R = 32
ROW_R = [288, 344, 400]
A_CX = 700
B_CX = 1000
A_LEFT = A_CX - 2 * STEP_R
B_LEFT = B_CX - 2 * STEP_R


def rx(col, depth, left):
    unit = STEP_R * (2 ** (2 - depth))
    return left + (col + 0.5) * unit


BEFORE = {
    "4": (0, 0), "2": (0, 1), "7": (1, 1),
    "1": (0, 2), "3": (1, 2), "6": (2, 2), "9": (3, 2),
}
AFTER = {
    "4": (0, 0), "7": (0, 1), "2": (1, 1),
    "9": (0, 2), "6": (1, 2), "3": (2, 2), "1": (3, 2),
}
BEFORE_EDGES = [("4", "2"), ("4", "7"), ("2", "1"), ("2", "3"), ("7", "6"), ("7", "9")]
AFTER_EDGES = [("4", "7"), ("4", "2"), ("7", "9"), ("7", "6"), ("2", "3"), ("2", "1")]


def draw_tree(mapping, edges, left, accent, accent_edges=()):
    pos = {k: (rx(c, dep, left), ROW_R[dep]) for k, (c, dep) in mapping.items()}
    for a, b in edges:
        (x1, y1), (x2, y2) = pos[a], pos[b]
        col = accent if (a, b) in accent_edges else (150, 158, 150)
        d.line((x1, y1 + R_NODE_R, x2, y2 - R_NODE_R), fill=col, width=2)
    for k, (cx, cy) in pos.items():
        d.ellipse((cx - R_NODE_R, cy - R_NODE_R, cx + R_NODE_R, cy + R_NODE_R),
                  fill=WHITE, outline=(160, 168, 160), width=2)
        d.text((cx, cy), k, font=mono_small, fill=INK, anchor="mm")
    return pos


draw_tree(BEFORE, BEFORE_EDGES, A_LEFT, (180, 180, 174))
after_pos = draw_tree(AFTER, AFTER_EDGES, B_LEFT, ORANGE)

# 翻后的树：强调"位置换了"—— 给 7 / 2 和 9 / 1 描橙色边
for k in ("7", "9", "1"):
    cx, cy = after_pos[k]
    d.ellipse((cx - R_NODE_R, cy - R_NODE_R, cx + R_NODE_R, cy + R_NODE_R),
              fill=ORANGE_FILL, outline=ORANGE, width=2)
    d.text((cx, cy), k, font=mono_small, fill=INK, anchor="mm")

# 双向箭头
AY = 288
ax1, ax2 = 856, 952
d.line((ax1, AY, ax2, AY), fill=ORANGE, width=3)
d.polygon([(ax2 - 12, AY - 7), (ax2 - 12, AY + 7), (ax2, AY)], fill=ORANGE)
d.polygon([(ax1 + 12, AY - 7), (ax1 + 12, AY + 7), (ax1, AY)], fill=ORANGE)
d.text(((ax1 + ax2) / 2, AY - 22), "翻转", font=tiny_font, fill=ORANGE, anchor="mm")

mix(700, 240, [("LC 226", label_font, ORANGE), ("  翻转二叉树", tiny_font, MUTED)])
d.text((A_CX, 432), "翻前", font=tiny_font, fill=MUTED, anchor="mm")
d.text((B_CX, 432), "翻后", font=tiny_font, fill=ORANGE, anchor="mm")

# ── 底部小注：变体 ──────────────────────────────────────────────────────────
d.line((88, H - 88, W - 88, H - 88), fill=BORDER, width=2)
note = "变体连考：111 最小深度（空子树不是叶子） · 110 平衡二叉树 · 101 对称二叉树 · 951 等价翻转"
ntw = d.textlength(note, font=note_font)
d.text(((W - ntw) / 2, H - 54), note, font=note_font, fill=MUTED)

import os
for out in (
    r"D:\zhoujungis.github.io\frontend\public\photos\lc-104-cover.png",
    r"D:\zhoujungis.github.io\photos\lc-104-cover.png",
):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("saved", out)
