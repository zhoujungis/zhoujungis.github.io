# -*- coding: utf-8 -*-
"""
make_lc224_cover.py — 【LC 224/772】基本计算器 & 基本计算器 III 的封面。

构图：左右两个面板，中间分隔线。
左 = 224：表达式行 + 上下文栈宽格 {result=3, sign=-1}（金框）。
右 = 772：nums 行 [2,15] + ops 行 [*]（帧 9 闭合括号后），顶=绿框。
下面两张卡片：欠账栈 / 调度场。

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


title_font = font("msyhbd.ttc", 31)
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
        d.text((int(x + cw / 2), int(y + ch / 2)), t, font=code_mid, fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 48), "基本计算器 & 计算器 III：一个来一个结，一个等优先级",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 88, [("224：加减同级 —— 符号 + 外层欠账栈；772：双栈调度场 —— 栈顶优先级 >= 我，先结账",
                   tiny_font, MUTED)])

# ── 题目标签（左右面板各一个）────────────────────────────────────────────────
mixed(280, 134, [("LC 224 基本计算器", card_title, GREEN),
                 ("  只有 + - ( )", tiny_font, MUTED)])
mixed(820, 134, [("LC 772 基本计算器 III", card_title, ORANGE),
                 ("  + - * / ( )", tiny_font, MUTED)])

CW, CH, GAP = 52, 46, 8
CELL_Y1 = 210
CELL_Y2 = 286

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 160, 550, 356), fill=BORDER, width=2)

# ── 左面板：表达式行 + 上下文栈宽格 ──────────────────────────────────────────
d.text((280, 162), "表达式（扫到 ( 时）", font=row_label, fill=MUTED, anchor="mm")
mixed(280, 186, [("1 + 2 ", code_mid, INK), ("-", code_mid, ORANGE),
                 ("(", code_mid, GOLD), ("3 + 4", code_mid, INK),
                 (") - 5", code_mid, INK)])

d.text((280, 232), "括号上下文栈（底 → 顶）", font=row_label, fill=MUTED, anchor="mm")
# 一个宽格：{result=3, sign=-1} 金框（246..292，标签在上、注释在下）
cell(280 - 110, 246, 220, CH, GOLD_FILL, GOLD, "result=3, sign=-1", GOLD, width=3)
d.text((280 + 110 + 12, 246 + CH / 2), "top",
       font=font("consola.ttf", 12), fill=GOLD, anchor="lm")

mixed(280, 330, [("( 压「外层欠账」并重启；) 合并 ", tiny_font, MUTED),
                 ("3 + (-1)*7 = -4", code_small, ORANGE)])

# ── 右面板：nums 行 + ops 行（帧 9 闭合括号后）───────────────────────────────
d.text((820, 162), "闭合 (5+5*2) 后：括号塌缩成一个数", font=row_label, fill=MUTED, anchor="mm")
mixed(820, 186, [("5*2=10", code_small, ORANGE), ("，", tiny_font, MUTED),
                 ("5+10=15", code_small, GREEN)])

d.text((820, 232), "nums 数值栈（底 → 顶）", font=row_label, fill=MUTED, anchor="mm")
vals = ["2", "15"]
total = len(vals) * CW + (len(vals) - 1) * GAP
x0 = 820 - total / 2
for i, v in enumerate(vals):
    fill, stroke, tcol = WHITE, BORDER, INK
    if i == 1:
        fill, stroke, tcol = GREEN_FILL, GREEN, GREEN
    cell(x0 + i * (CW + GAP), CELL_Y2, CW, CH, fill, stroke, v, tcol)
d.text((int(x0 + total + 12), CELL_Y2 + CH / 2), "top",
       font=font("consola.ttf", 12), fill=GREEN, anchor="lm")

d.text((820, 348), "ops 运算符栈（( 是挡板）", font=row_label, fill=MUTED, anchor="mm")
cell(820 - CW / 2, 364, CW, CH, WHITE, BORDER, "*", INK)

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 436
CARD_H = 128
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


bottom_card(LEFT_X, GREEN, "224：欠账栈", [
    [("加减同级左结合 —— ", tiny_font, INK), ("数字来一个结一个", tiny_font, GREEN)],
    [("(: 压 ", mini_font, MUTED), ("{result, sign}", code_small, ORANGE), ("，累加器清零重启", mini_font, MUTED)],
    [("): ", code_small, INK), ("result = ", code_small, INK), ("外层", tiny_font, INK),
     (" + ", code_small, INK), ("外层", tiny_font, INK), ("sign * inner", code_small, INK)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "772：调度场", [
    [("新运算符：栈顶优先级 ", tiny_font, INK), (">=", code_small, ORANGE), (" 我的，先结账", tiny_font, INK)],
    [(">=", code_small, ORANGE), (" 即左结合；", mini_font, MUTED), ("(", code_small, GREEN), (" 压栈当挡板，) 结算到挡板", mini_font, MUTED)],
    [("除法 ", mini_font, MUTED), ("trunc", code_small, ORANGE), (" 向零截断，", mini_font, MUTED), ("floor", code_small, ORANGE), (" 负数是坑", mini_font, MUTED)],
])

d.text((W / 2, H - 16), "同族：LC 227 无括号版 · LC 150 逆波兰（调度场的输出端） · LC 394 字符串解码（同款括号上下文栈）",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-224-772-cover.png", "photos/lc-224-772-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
