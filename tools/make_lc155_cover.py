# -*- coding: utf-8 -*-
"""
make_lc155_cover.py — 【LC 155/232】最小栈 & 用栈实现队列 的封面。

构图：左右两个面板，中间分隔线。
左 = 最小栈：main 行 [-2,0,-3] + mins 行 [-2,-3]（顶=全栈最小）。
右 = 双栈队列：in 行 [1,2,3] + out 行 [3,2,1]（顶=队首，绿框）。
下面两张卡片：历史按层存 / 两次反转=正序。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文；无行首标签压格子（标注居中到格子群上方）。
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


title_font = font("msyhbd.ttc", 33)
tiny_font = font("msyh.ttc", 15)
mini_font = font("msyh.ttc", 14)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 20)
row_label = font("msyhbd.ttc", 14)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)


def mixed(cx, cy, parts, anchor="mm"):
    if anchor == "mm":
        total = sum(d.textlength(t, font=f) for t, f, _ in parts)
        x = cx - total / 2
    else:
        x = cx
    for text, f, color in parts:
        d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
        x += d.textlength(text, font=f)


def cell(x, y, cw, ch, fill, stroke, t, tcol, sub=None, subcol=None, width=2):
    d.rounded_rectangle((int(x), int(y), int(x + cw), int(y + ch)), radius=7,
                        fill=fill, outline=stroke, width=width)
    if sub is not None:
        d.text((x + cw / 2, y + ch / 2 - 7), t, font=code_mid, fill=tcol, anchor="mm")
        d.text((x + cw / 2, y + ch - 11), sub, font=font("consola.ttf", 11),
               fill=subcol or DIM, anchor="mm")
    elif t:
        d.text((x + cw / 2, y + ch / 2), t, font=code_mid, fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 48), "最小栈 & 用栈实现队列：一个记住历史，一个再翻一次",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 88, [("辅助栈顶恒为全栈最小 —— pop 后旧答案自动恢复；整摞翻进 out 再倒一次 —— 两次反转 = 正序",
                   tiny_font, MUTED)])

# ── 题目标签（左右面板各一个）────────────────────────────────────────────────
mixed(280, 134, [("LC 155 最小栈", card_title, GREEN),
                 ("  getMin O(1)", tiny_font, MUTED)])
mixed(820, 134, [("LC 232 用栈实现队列", card_title, ORANGE),
                 ("  FIFO", tiny_font, MUTED)])

CW, CH, GAP = 52, 46, 8
CELL_Y1 = 168   # 第一行格子顶
CELL_Y2 = 250   # 第二行格子顶

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 160, 550, 356), fill=BORDER, width=2)

# ── 左面板：main 行 + mins 行 ────────────────────────────────────────────────
MAIN = ["-2", "0", "-3"]
MINS = ["-2", "-3"]


def row_cells(vals, cx, y, marks=None):
    """marks: dict idx -> (fill, stroke, tcol)"""
    total = len(vals) * CW + (len(vals) - 1) * GAP
    x0 = cx - total / 2
    for i, v in enumerate(vals):
        fill, stroke, tcol = WHITE, BORDER, INK
        if marks and i in marks:
            fill, stroke, tcol = marks[i]
        cell(x0 + i * (CW + GAP), y, CW, CH, fill, stroke, v, tcol)
    return x0, total


d.text((280, 156), "main 主栈（底 → 顶）", font=row_label, fill=MUTED, anchor="mm")
row_cells(MAIN, 280, CELL_Y1, marks={2: (GREEN_FILL, GREEN, GREEN)})
d.text((280 + (3 * CW + 2 * GAP) / 2 + 12, CELL_Y1 + CH / 2), "top",
       font=font("consola.ttf", 12), fill=GREEN, anchor="lm")

d.text((280, 238), "mins 辅助栈（每刻的最小值）", font=row_label, fill=MUTED, anchor="mm")
row_cells(MINS, 280, CELL_Y2, marks={1: (GREEN_FILL, GREEN, GREEN)})
d.text((280 + (2 * CW + GAP) / 2 + 12, CELL_Y2 + CH / 2), "getMin",
       font=font("consola.ttf", 12), fill=GREEN, anchor="lm")

mixed(280, 330, [("push(0) 不压辅助栈（", tiny_font, MUTED), ("0 > -2", code_small, ORANGE),
                 ("）；pop 弹 -3 同步弹，", tiny_font, MUTED), ("-2", code_small, GREEN),
                 (" 自动恢复", tiny_font, MUTED)])

# ── 右面板：in 行 + out 行 ───────────────────────────────────────────────────
d.text((820, 156), "in 栈（push 只进这里）", font=row_label, fill=MUTED, anchor="mm")
row_cells(["1", "2", "3"], 820, CELL_Y1)

d.text((820, 238), "out 栈（整摞翻 → 顶 = 队首）", font=row_label, fill=MUTED, anchor="mm")
row_cells(["3", "2", "1"], 820, CELL_Y2, marks={2: (GREEN_FILL, GREEN, GREEN)})
d.text((820 + (3 * CW + 2 * GAP) / 2 + 12, CELL_Y2 + CH / 2), "pop→1",
       font=font("consola.ttf", 12), fill=GREEN, anchor="lm")

mixed(820, 330, [("out 还有存货时 ", tiny_font, MUTED), ("push(4)", code_small, ORANGE),
                 (" 只进 in —— 绝不搬运、绝不插队", tiny_font, MUTED)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 386
CARD_H = 148
CARD_W = 470
GAPX = 40
LEFT_X = (W - CARD_W * 2 - GAPX) / 2


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((int(x), CARD_Y, int(x + CARD_W), CARD_Y + CARD_H), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
                        radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    y = CARD_Y + 34
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 30


bottom_card(LEFT_X, GREEN, "历史按层存", [
    [("getMin 要 ", tiny_font, INK), ("O(1)", code_small, GREEN), ("，pop 后要回到过去", tiny_font, INK)],
    [("辅助栈记「这一刻全栈最小值」", tiny_font, INK)],
    [("判据 ", mini_font, MUTED), ("x <= mins[-1]", code_small, ORANGE), ("（相等也压）", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "两次反转 = 正序", [
    [("进 in 倒一次，整摞翻进 out 再倒一次", tiny_font, INK)],
    [("钉子：", mini_font, MUTED), ("out 空才搬", tiny_font, ORANGE), ("，且必须整摞搬", tiny_font, INK)],
    [("每元素至多搬一次 → 均摊 ", mini_font, MUTED), ("O(1)", code_small, ORANGE)],
])

d.text((W / 2, H - 16), "同族：LC 225 用队列实现栈（push 付账） · LC 716 最大栈（popMax 弹中间） · LC 20 / 239 同一家族",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-155-232-cover.png", "photos/lc-155-232-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
