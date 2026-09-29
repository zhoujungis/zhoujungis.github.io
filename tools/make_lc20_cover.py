# -*- coding: utf-8 -*-
"""
make_lc20_cover.py — 【LC 20】有效的括号 的封面。

构图：中央字符行 "{ [ ( ) ] }"，下行栈格三层（top 标记）+ popped 格，
配对弧线连接 () 对。下面两张卡片：三种失败模式 / 三个易错点。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()。
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
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 34)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 17)
code_big = font("consola.ttf", 22)

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


def cell(x, y, cw, ch, fill, stroke, t, tcol):
    d.rounded_rectangle((x, y, x + cw, y + ch), radius=7, fill=fill, outline=stroke, width=2)
    if t:
        d.text((x + cw / 2, y + ch / 2), t, font=code_big, fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 50), "有效的括号：栈是被结构逼出来的", font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 90, [("最内层尚未闭合的左括号必须最先被闭合 —— 后开先闭，天然 LIFO", tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(W / 2, 138, [("LC 20", card_title, GREEN),
                   ('  "{[()]}" → true · "(]" / "([)]" / "(()" → false', tiny_font, MUTED)])

# ── 中央：字符串行 + 栈行 ────────────────────────────────────────────────────
CW, CH, GAP = 52, 50, 10
S = "{[()]}"
COLS = len(S)
ROW_W = COLS * CW + (COLS - 1) * GAP
LEFT = (W - ROW_W) / 2
colX = [int(LEFT + i * (CW + GAP)) for i in range(COLS)]
colC = [x + CW / 2 for x in colX]

# 字符串行（全部绿 = 有效终态）
for i, t in enumerate(S):
    cell(colX[i], 192, CW, CH, GREEN_FILL, GREEN, t, GREEN)
d.text((LEFT - 16, 217), "s", font=mini_font, fill=MUTED, anchor="rm")

# 配对弧线（() 一对、[] 一对、{} 一对）—— 三层在字符行上方错开
def arc(x1, x2, y, color):
    d.line((x1, y, x1, y - 6), fill=color, width=2)
    d.line((x2, y, x2, y - 6), fill=color, width=2)
    d.line((x1, y - 6, x2, y - 6), fill=color, width=2)

arc(colC[2], colC[3], 184, ORANGE)
arc(colC[1], colC[4], 172, GREEN)
arc(colC[0], colC[5], 160, GOLD)

# 栈行（终态：空，画空格虚线）
for i in range(COLS):
    x = int(LEFT + i * (CW + GAP))
    for k in range(3):
        xx = x + k * 5
        if xx > x + CW - 2:
            break
        d.line((xx, 262, xx, 265), fill=DIM, width=2)
        d.line((xx, 304, xx, 307), fill=DIM, width=2)
d.text((LEFT - 16, 283), "stack", font=mini_font, fill=MUTED, anchor="rm")
mixed((LEFT + W / 2) / 2 + 60, 283, [("终态：栈恰好为空", mini_font, GREEN)])

# 中间说明
mixed(W / 2, 330, [('遇左括号 push（记下我在等什么）· 遇右括号问栈顶 —— 三处检查对应三种失败模式', tiny_font, MUTED)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 368
CARD_H = 148
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
        y += 30


bottom_card(LEFT_X, GREEN, "三种失败模式", [
    [("一 类型不匹配：", tiny_font, INK), ('"(]"', code_small, ORANGE)],
    [("二 右括号没人接：", tiny_font, INK), ('"())"', code_small, ORANGE), ("（栈已空）", tiny_font, INK)],
    [("三 左括号没闭合：", tiny_font, INK), ('"(()"', code_small, ORANGE), ("（扫完栈非空）", tiny_font, INK)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "三个易错点", [
    [("栈空检查必须在 pop 之前", tiny_font, INK)],
    [("计数器查不了顺序：", tiny_font, INK), ('"([)]"', code_small, ORANGE), (" 数量全对也错", tiny_font, INK)],
    [("空串 ", tiny_font, INK), ('""', code_small, GREEN), (" 有效 —— 循环不进栈为空", tiny_font, INK)],
])

d.text((W / 2, H - 16), "同族：LC 22 括号生成（计数器当简化栈） · LC 32 最长有效括号（栈存下标） · LC 921 最少添加（计数版）",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-20-cover.png", "photos/lc-20-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
