# -*- coding: utf-8 -*-
"""生成 LC 102 文章封面 frontend/public/photos/lc-102-cover.png。

风格对齐 LC 系列：米色底、左上 ALGORITHM 小标、居中标题、下方示意图。
画面表达本题的本质：
  左侧 —— 一棵 [3,9,20,null,null,15,7] 的树，三条虚线层线标出层边界；
  右侧 —— 层序结果的嵌套结构 [[3],[9,20],[15,7]]，每行用括号框住，颜色随层递进；
  底部 —— 一行点出三个变体：103 锯齿 / 199 右视图 / 107 自底向上。
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

TITLE = "二叉树的层序遍历"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

tag_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
title_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 44)
small_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 19)
node_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 26)
note_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 20)
mono_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 21)

# ── 页眉：ALGORITHM 小标 + 标题 ─────────────────────────────────────────────
tag = "ALGORITHM"
tw = d.textlength(tag, font=tag_font)
d.text((88, 56), tag, font=tag_font, fill=MUTED)
d.line((88 + tw + 18, 70, 88 + tw + 78, 70), fill=BORDER, width=2)

tw = d.textlength(TITLE, font=title_font)
d.text(((W - tw) / 2, 88), TITLE, font=title_font, fill=INK)

# ── 左侧：树 ────────────────────────────────────────────────────────────────
NODE_R = 27
LABEL_W = 74


def tree_node(cx, cy, label, stroke=BORDER, fill=WHITE, width=2,
              value_color=INK):
    d.ellipse((cx - NODE_R, cy - NODE_R, cx + NODE_R, cy + NODE_R),
              fill=fill, outline=stroke, width=width)
    d.text((cx, cy), label, font=node_font, fill=value_color, anchor="mm")


# 树的三层，逐层往下。每层中心 x 由"满二叉树槽位"推出来。
ROW_Y = [190, 278, 366]
nodes = {
    "3": (330, ROW_Y[0]),
    "9": (240, ROW_Y[1]),
    "20": (420, ROW_Y[1]),
    "15": (360, ROW_Y[2]),
    "7": (480, ROW_Y[2]),
}
edges = [("3", "9"), ("3", "20"), ("20", "15"), ("20", "7")]
for a, b in edges:
    (x1, y1), (x2, y2) = nodes[a], nodes[b]
    d.line((x1, y1 + NODE_R, x2, y2 - NODE_R), fill=(150, 158, 150), width=2)

# 层线（虚线）+ 左侧"第 n 层"标注，点出"层"这件事。
# 虚线只占最左边一窄条（标签 → 第 1 层节点圆左侧），不穿过任何节点圆。
LINE_X1, LINE_X2 = 96, 206
for i, y in enumerate(ROW_Y):
    x = LINE_X1
    while x < LINE_X2:
        d.line((x, y, min(x + 7, LINE_X2), y), fill=(208, 213, 205), width=1)
        x += 13
    d.text((84, y), f"第 {i} 层", font=small_font, fill=MUTED, anchor="rm")

tree_node(*nodes["3"], "3", stroke=ORANGE, fill=ORANGE_FILL, width=3,
          value_color=ORANGE)
tree_node(*nodes["9"], "9")
tree_node(*nodes["20"], "20")
tree_node(*nodes["15"], "15", stroke=GREEN, fill=GREEN_FILL)
tree_node(*nodes["7"], "7", stroke=GREEN, fill=GREEN_FILL)

d.text((330, ROW_Y[2] + NODE_R + 46), "size = 1 → 2 → 2",
       font=mono_font, fill=ORANGE, anchor="mm")


# ── 右侧：结果嵌套结构 ──────────────────────────────────────────────────────
RX = 700          # 括号左端
LEVELS = [("3",), ("9", "20"), ("15", "7")]
colors = [(ORANGE, ORANGE_FILL), (INK, WHITE), (GREEN, GREEN_FILL)]

d.text((RX - 30, ROW_Y[0]), "返回", font=small_font, fill=MUTED, anchor="rm")

for i, lv in enumerate(LEVELS):
    y = ROW_Y[i]
    seg = "  ".join(lv)
    bar_w = 34
    # 每一层画一个方括号，把该层的值框起来
    bx1 = RX + i * bar_w + 8
    bx2 = bx1 + 26 + len(seg) * 15
    c, cfill = colors[i]
    d.rounded_rectangle((bx1, y - 24, bx2, y + 24), radius=9,
                        fill=cfill, outline=c, width=3 if i else 2)
    d.text(((bx1 + bx2) / 2, y), seg, font=mono_font, fill=c, anchor="mm")

# 最外层的总括号（表示"嵌套列表"）
ox1 = RX - 12
d.line((ox1, ROW_Y[0] - 46, ox1, ROW_Y[-1] + 46), fill=BORDER, width=2)
d.line((ox1, ROW_Y[0] - 46, ox1 + 9, ROW_Y[0] - 46), fill=BORDER, width=2)
d.line((ox1, ROW_Y[-1] + 46, ox1 + 9, ROW_Y[-1] + 46), fill=BORDER, width=2)
d.text((ox1 + 4, ROW_Y[-1] + 82), "[[3], [9,20], [15,7]]",
       font=mono_font, fill=INK, anchor="lm")

# ── 底部小注：三个变体 ──────────────────────────────────────────────────────
d.line((88, H - 92, W - 88, H - 92), fill=BORDER, width=2)
note = "变体连考：103 锯齿形（奇数层反向） · 199 右视图（每层最右） · 107 自底向上"
ntw = d.textlength(note, font=note_font)
d.text(((W - ntw) / 2, H - 56), note, font=note_font, fill=MUTED)

out = r"D:\zhoujungis.github.io\frontend\public\photos\lc-102-cover.png"
img.save(out)
print("saved", out)
