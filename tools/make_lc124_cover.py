# -*- coding: utf-8 -*-
"""生成 LC 124 文章封面 frontend/public/photos/lc-124-cover.png。

风格对齐 LC 系列：米色底、左上 ALGORITHM 小标、居中标题、下方示意图。
画面表达本题的本质 —— 「两个量必须分开算」：

  左侧  —— 官方演示树 [-10,9,20,null,null,15,7]；
          最优路径 15 → 20 → 7 用金色粗线 + 金色实心节点强调，
          20 作为"拱顶"额外套一圈外环（它和路径上其他点不一样）；
          根 -10 标成灰色虚线风格（它不在答案路径上，容易被误当成必经点）。
  右侧  —— 把"20 那一帧"的两个量并排写出来：
          through = 20 + 15 + 7 = 42（两条胳膊，更新答案）
          gain    = 20 + max(15,7) = 35（一条胳膊，往上汇报）
          用 42 与 35 的差值直接点出"那个 7 就是没带走的那条胳膊"。
  底部  —— 一行点出变体：543 直径 / 687 最长同值 / 1123 最深叶。
"""
from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 570
BG = (244, 242, 236)
INK = (31, 42, 36)
MUTED = (120, 128, 122)
BORDER = (214, 218, 210)
GREEN = (63, 107, 87)
ORANGE = (164, 95, 69)
GOLD = (194, 135, 47)
WHITE = (255, 255, 255)
GREEN_FILL = (240, 246, 242)
GOLD_FILL = (253, 243, 227)
DIM = (185, 185, 179)

TITLE = "二叉树中的最大路径和"

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

# ── 左侧：演示树 [-10,9,20,null,null,15,7] ──────────────────────────────────
NODE_R = 25

TREE_CX = 330
# 整体下移，给标题和顶层 gain 标签留出空间
ROW_Y = [248, 336, 424]

# 满二叉树槽位法：maxDepth=2 → 第 d 层槽宽 = 76 * 2^(2-d)，中心 = (col+0.5)*槽宽
def sx(col, depth):
    unit = 76 * (2 ** (2 - depth))
    return TREE_CX - 76 * 2 + (col + 0.5) * unit

nodes = {
    "-10": (sx(0, 0), ROW_Y[0]),   # 根
    "9":   (sx(0, 1), ROW_Y[1]),   # 左孩子（叶子）
    "20":  (sx(1, 1), ROW_Y[1]),   # 右孩子（拱顶）
    "15":  (sx(2, 2), ROW_Y[2]),   # 20 的左孩子
    "7":   (sx(3, 2), ROW_Y[2]),   # 20 的右孩子
}
edges = [("-10", "9"), ("-10", "20"), ("20", "15"), ("20", "7")]
# 最优路径上的两条边：20→15、20→7（金色粗线）
ON_PATH = {("20", "15"), ("20", "7")}
for a, b in edges:
    (x1, y1), (x2, y2) = nodes[a], nodes[b]
    if (a, b) in ON_PATH:
        d.line((x1, y1 + NODE_R, x2, y2 - NODE_R), fill=GOLD, width=5)
    else:
        d.line((x1, y1 + NODE_R, x2, y2 - NODE_R), fill=(150, 158, 150), width=2)


def tree_node(cx, cy, label, stroke=BORDER, fill=WHITE, width=2,
              value_color=INK, ring=False):
    if ring:
        d.ellipse((cx - NODE_R - 8, cy - NODE_R - 8,
                   cx + NODE_R + 8, cy + NODE_R + 8),
                  outline=GOLD, width=3)
    d.ellipse((cx - NODE_R, cy - NODE_R, cx + NODE_R, cy + NODE_R),
              fill=fill, outline=stroke, width=width)
    d.text((cx, cy), label, font=node_font, fill=value_color, anchor="mm")


# 根 -10：不在答案路径上，画成浅灰虚描边风格（提示"别以为必须经过根"）
tree_node(*nodes["-10"], "-10", stroke=DIM, fill=WHITE, value_color=MUTED)
tree_node(*nodes["9"], "9", stroke=DIM, fill=WHITE, value_color=MUTED)
# 路径上的 15 / 7：金色细描边
tree_node(*nodes["15"], "15", stroke=GOLD, fill=GOLD_FILL, width=3)
tree_node(*nodes["7"], "7", stroke=GOLD, fill=GOLD_FILL, width=3)
# 拱顶 20：金色 + 外环（它和路径上其它点不同）
tree_node(*nodes["20"], "20", stroke=GOLD, fill=GOLD_FILL, width=4, ring=True)

# 每个节点上方的 gain 贡献值小标签
gains = {"-10": "gain 25", "9": "gain 9", "20": "gain 35", "15": "gain 15", "7": "gain 7"}
for k, txt in gains.items():
    cx, cy = nodes[k]
    bw = d.textlength(txt, font=tiny_font) + 16
    by = cy - NODE_R - 30
    d.rounded_rectangle((cx - bw / 2, by, cx + bw / 2, by + 22), radius=7,
                        fill=(244, 242, 236), outline=BORDER, width=1)
    d.text((cx, by + 11), txt, font=tiny_font, fill=INK, anchor="mm")

# 拱顶标注（放在节点右侧，避免和两个 gain 标签（在节点上方）相撞）
d.text((nodes["20"][0] + NODE_R + 26, nodes["20"][1]), "拱顶",
       font=tiny_font, fill=GOLD, anchor="lm")

# ── 右侧：把「20 那一帧」的两个量并排写出来 ───────────────────────────────
RX = 596
RY = 216

d.text((RX, RY - 40), "20 那一帧，同时算两个量：", font=small_font, fill=INK, anchor="lm")

# ① through —— 两条胳膊，更新答案
box_w = 452
d.rounded_rectangle((RX, RY - 12, RX + box_w, RY + 74), radius=10,
                    fill=(253, 243, 227), outline=GOLD, width=2)
d.text((RX + 16, RY + 10), "① through（两条胳膊）", font=tiny_font, fill=GOLD, anchor="lm")
d.text((RX + 16, RY + 40), "20 + 15 + 7 = 42", font=mono_font, fill=INK, anchor="lm")
d.text((RX + box_w - 16, RY + 40), "→ 更新 best", font=tiny_font, fill=GOLD, anchor="rm")
d.text((RX + 16, RY + 62), "以自己为最高点，到此为止", font=tiny_font, fill=MUTED, anchor="lm")

# ② gain —— 一条胳膊，往上汇报
d.rounded_rectangle((RX, RY + 96, RX + box_w, RY + 182), radius=10,
                    fill=GREEN_FILL, outline=GREEN, width=2)
d.text((RX + 16, RY + 118), "② gain（只能一条胳膊）", font=tiny_font, fill=GREEN, anchor="lm")
d.text((RX + 16, RY + 148), "20 + max(15, 7) = 35", font=mono_font, fill=INK, anchor="lm")
d.text((RX + box_w - 16, RY + 148), "→ 交给父节点", font=tiny_font, fill=GREEN, anchor="rm")
d.text((RX + 16, RY + 170), "父节点还会再拐一次，这里必须留一手",
       font=tiny_font, fill=MUTED, anchor="lm")

# 强调 42 与 35 的差
d.text((RX, RY + 210), "差的 7 = 留下没带走的那条右胳膊", font=tiny_font,
       fill=ORANGE, anchor="lm")

# ── 底部小注：变体 ──────────────────────────────────────────────────────────
d.line((88, H - 92, W - 88, H - 92), fill=BORDER, width=2)
note = "同骨架变体：543 直径（换边数，不需 clamp） · 687 最长同值路径 · 1123 最深叶 LCA"
ntw = d.textlength(note, font=note_font)
d.text(((W - ntw) / 2, H - 56), note, font=note_font, fill=MUTED)

import os
for out in (
    r"D:\zhoujungis.github.io\frontend\public\photos\lc-124-cover.png",
    r"D:\zhoujungis.github.io\photos\lc-124-cover.png",
):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("saved", out)
