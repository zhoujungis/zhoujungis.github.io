# -*- coding: utf-8 -*-
"""生成 LC 236 文章封面 frontend/public/photos/lc-236-cover.png。

风格对齐 LC 系列：米色底、左上 ALGORITHM 小标、居中标题、下方示意图。
画面表达本题的本质：
  左侧 —— 演示树 [3,5,1,6,2,0,8,null,null,7,4]，p=6 与 q=4 用橙色角标标出，
          答案 5 用绿色实心 + 外环突出（它就是"分叉点"）；
  右侧 —— 三条向上冒的返回值箭头，点出"返回值是信使，最终汇合在 5"；
  底部 —— 一行点出变体：235 BST / 1650 带父指针 / 1676 多目标 / 1123 最深叶。
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

TITLE = "二叉树的最近公共祖先"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

tag_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
title_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 44)
small_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 19)
node_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 22)
note_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 20)
mono_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 21)
tiny_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 17)

# ── 页眉：ALGORITHM 小标 + 标题 ─────────────────────────────────────────────
tag = "ALGORITHM"
tw = d.textlength(tag, font=tag_font)
d.text((88, 56), tag, font=tag_font, fill=MUTED)
d.line((88 + tw + 18, 70, 88 + tw + 78, 70), fill=BORDER, width=2)

tw = d.textlength(TITLE, font=title_font)
d.text(((W - tw) / 2, 88), TITLE, font=title_font, fill=INK)

# ── 左侧：演示树 ────────────────────────────────────────────────────────────
NODE_R = 25

TREE_CX = 350
ROW_Y = [186, 266, 346, 424]
# 满二叉树槽位法：maxDepth=3 → 第 d 层的槽宽 = 72 * 2^(3-d)，中心 = (col+0.5)*槽宽
def sx(col, depth):
    unit = 68 * (2 ** (3 - depth))
    return TREE_CX - 68 * 4 + (col + 0.5) * unit

nodes = {
    "3": (sx(0, 0), ROW_Y[0]),
    "5": (sx(0, 1), ROW_Y[1]),
    "1": (sx(1, 1), ROW_Y[1]),
    "6": (sx(0, 2), ROW_Y[2]),
    "2": (sx(1, 2), ROW_Y[2]),
    "0": (sx(2, 2), ROW_Y[2]),
    "8": (sx(3, 2), ROW_Y[2]),
    "7": (sx(1, 3), ROW_Y[3]),
    "4": (sx(2, 3), ROW_Y[3]),
}
edges = [
    ("3", "5"), ("3", "1"),
    ("5", "6"), ("5", "2"), ("1", "0"), ("1", "8"),
    ("2", "7"), ("2", "4"),
]
# 只画"活"的边（递归真的走过的那几条）用深色，其余浅色
LIVE = {("3", "5"), ("5", "6"), ("5", "2"), ("2", "7"), ("2", "4"), ("3", "1")}
for a, b in edges:
    (x1, y1), (x2, y2) = nodes[a], nodes[b]
    color = (150, 158, 150) if (a, b) in LIVE else (208, 213, 205)
    d.line((x1, y1 + NODE_R, x2, y2 - NODE_R), fill=color, width=2)


def tree_node(cx, cy, label, stroke=BORDER, fill=WHITE, width=2,
              value_color=INK, ring=False):
    if ring:
        d.ellipse((cx - NODE_R - 8, cy - NODE_R - 8,
                   cx + NODE_R + 8, cy + NODE_R + 8),
                  outline=ORANGE, width=3)
    d.ellipse((cx - NODE_R, cy - NODE_R, cx + NODE_R, cy + NODE_R),
              fill=fill, outline=stroke, width=width)
    d.text((cx, cy), label, font=node_font, fill=value_color, anchor="mm")


# 3 与 1 是"白跑"的子树（浅灰虚线风格 → 这里用浅描边模拟）
tree_node(*nodes["3"], "3", stroke=(178, 186, 178), fill=WHITE)
tree_node(*nodes["1"], "1", stroke=(178, 186, 178), fill=WHITE)
tree_node(*nodes["0"], "0", stroke=(200, 206, 198), fill=WHITE)
tree_node(*nodes["8"], "8", stroke=(200, 206, 198), fill=WHITE)
tree_node(*nodes["7"], "7", stroke=(200, 206, 198), fill=WHITE)
# 有返回值的节点：绿色实心
for k in ("6", "2", "4"):
    tree_node(*nodes[k], k, stroke=GREEN, fill=GREEN_FILL)
# 答案 5：绿色 + 橙色外环
tree_node(*nodes["5"], "5", stroke=GREEN, fill=GREEN_FILL, width=3, ring=True)

# p / q 角标
d.text((nodes["6"][0], nodes["6"][1] + NODE_R + 18), "p", font=note_font,
       fill=ORANGE, anchor="mm")
d.text((nodes["4"][0], nodes["4"][1] + NODE_R + 18), "q", font=note_font,
       fill=ORANGE, anchor="mm")
# 答案标注
d.text((nodes["5"][0], nodes["5"][1] - NODE_R - 26), "答案 5", font=tiny_font,
       fill=ORANGE, anchor="mm")

# ── 右侧：返回值向上冒泡 ────────────────────────────────────────────────────
RX = 700
rows = [
    ("4  →  q 的标记", MUTED),
    ("2  不是分叉点，如实上报", MUTED),
    ("5  左右都非空 → 命中答案", ORANGE),
    ("3  只有一个非空，继续往上冒", MUTED),
]
top = ROW_Y[0] - 26
for i, (text, color) in enumerate(rows):
    y = top + i * 52
    d.text((RX, y), text, font=tiny_font, fill=color, anchor="lm")
# 一条向上的箭头，串起"汇报方向"
ax = RX - 26
d.line([(ax, top + 3 * 52), (ax, top)], fill=ORANGE, width=2)
d.polygon([(ax - 6, top + 10), (ax + 6, top + 10), (ax, top - 2)], fill=ORANGE)
d.text((ax - 12, top + 26), "返回值向上冒", font=tiny_font, fill=MUTED, anchor="rm")

# ── 底部小注：变体 ──────────────────────────────────────────────────────────
d.line((88, H - 92, W - 88, H - 92), fill=BORDER, width=2)
note = "变体连考：235 BST（O(h) 前序下钻） · 1650 带父指针（两链求交点） · 1676 多目标 · 1123 最深叶"
ntw = d.textlength(note, font=note_font)
d.text(((W - ntw) / 2, H - 56), note, font=note_font, fill=MUTED)

out = r"D:\zhoujungis.github.io\frontend\public\photos\lc-236-cover.png"
img.save(out)
print("saved", out)
