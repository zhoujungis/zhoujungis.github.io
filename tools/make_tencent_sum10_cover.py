# -*- coding: utf-8 -*-
"""
make_tencent_sum10_cover.py — 【腾讯面经】相邻和为 10 消除 的封面。

构图：左右两个面板，中间分隔线（沿用既有骨架）。
左 = 输入 55128921 的格子（消掉的画虚线、幸存的绿框）+ 最终栈 [2, 1]；
右 = 补数配对表（1↔9 … 5↔5，5 配自己用金色）+ 两条消法路线的终点对照；
下面两张卡片：骨架 / 易错点与验证。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
中文一律 CJK 字体；避免 msyh 缺字形的 ⇒/⇔ 等符号；几何自检。
"""

import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 620
BG = (247, 246, 242)
INK = (31, 42, 36)
MUTED = (101, 113, 104)
BORDER = (195, 201, 194)
GREEN = (63, 107, 87)
GREEN_FILL = (231, 242, 234)
ORANGE = (164, 95, 69)
GOLD = (194, 135, 47)
GOLD_FILL = (253, 243, 227)
GONE_FILL = (240, 238, 233)
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 29)
tiny_font = font("msyh.ttc", 15)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 15)
code_cell = font("consola.ttf", 13)
code_chip = font("consola.ttf", 14)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []


def mixed(cx, cy, parts, anchor="mm"):
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    checks.append((int(cy), sum(widths)))
    x = cx - sum(widths) / 2 if anchor == "mm" else cx
    for (text, f, color), _w in zip(parts, widths):
        d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
        x += _w


def dashed_rect(x, y, w, h, color, dash=5, gap=4):
    """虚线框（PIL 没有 dash 选项，自己画四边）。"""
    x, y, w, h = int(x), int(y), int(w), int(h)
    for i in range(x, x + w, dash + gap):
        d.line((i, y, min(i + dash, x + w), y), fill=color, width=1)
        d.line((i, y + h, min(i + dash, x + w), y + h), fill=color, width=1)
    for j in range(y, y + h, dash + gap):
        d.line((x, j, x, min(j + dash, y + h)), fill=color, width=1)
        d.line((x + w, j, x + w, min(j + dash, y + h)), fill=color, width=1)


# ── 标题 ─────────────────────────────────────────────────────────────────────
TITLE = "相邻和为 10 消除：栈模拟与唯一性"
d.text((W / 2, 44), TITLE, font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("腾讯面经高频（2025.11–2026.4 至少 4 篇）", tiny_font, MUTED),
                  ("　·　", tiny_font, MUTED),
                  ("补数配对 d 与 10-d，5 配自己", tiny_font, MUTED),
                  ("　·　", tiny_font, MUTED),
                  ("一遍扫描 O(n)", tiny_font, GREEN)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(290, 122, [("输入 55128921", card_title, GREEN), ("　栈模拟一遍扫完", tiny_font, MUTED)])
mixed(810, 122, [("结果唯一", card_title, ORANGE), ("　消除顺序无关", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 148, 550, 360), fill=BORDER, width=2)

# ── 左：输入串格子 + 最终栈 ──────────────────────────────────────────────────
SRC = "55128921"
SURVIVE = {6, 7}          # 消掉 5+5、2+8、1+9 之后剩下的下标
CELL, GAP = 28, 4
CHIP_W = len(SRC) * CELL + (len(SRC) - 1) * GAP
CHIP_X0 = 290 - CHIP_W / 2
CHIP_Y0 = 166
for k, ch in enumerate(SRC):
    x = CHIP_X0 + k * (CELL + GAP)
    alive = k in SURVIVE
    fill = GREEN_FILL if alive else GONE_FILL
    outline = GREEN if alive else BORDER
    width = 3 if alive else 1
    if alive:
        d.rounded_rectangle((int(x), int(CHIP_Y0), int(x + CELL), int(CHIP_Y0 + CELL)), radius=4,
                            fill=fill, outline=outline, width=width)
    else:
        dashed_rect(x, CHIP_Y0, CELL, CELL, BORDER)
    d.text((int(x + CELL / 2), int(CHIP_Y0 + CELL / 2)), ch, font=code_chip,
           fill=GREEN if alive else MUTED, anchor="mm")

mixed(290, 226, [("消掉 3 对：", tiny_font, MUTED),
                 ("5+5", code_mid, ORANGE), ("、", tiny_font, ORANGE),
                 ("2+8", code_mid, ORANGE), ("、", tiny_font, ORANGE),
                 ("1+9", code_mid, ORANGE),
                 ("　→　剩 ", tiny_font, MUTED), ("21", code_small, GREEN)])

# 最终栈：底 2、顶 1
STACK_CX = 258
STACK_TOP = 258
for t, (val, tag) in enumerate([("2", "#6 底"), ("1", "#7 顶")]):
    y = STACK_TOP + (1 - t) * (CELL + 6)
    d.rounded_rectangle((int(STACK_CX - CELL / 2), int(y), int(STACK_CX + CELL / 2), int(y + CELL)),
                        radius=4, fill=GREEN_FILL if t == 1 else WHITE,
                        outline=GREEN if t == 1 else BORDER, width=3 if t == 1 else 1)
    d.text((int(STACK_CX), int(y + CELL / 2 - 3)), val, font=code_chip,
           fill=GREEN if t == 1 else INK, anchor="mm")
    d.text((int(STACK_CX), int(y + CELL - 7)), tag, font=code_cell, fill=MUTED, anchor="mm")

mixed(322, 292, [("栈（底 → 顶）= ", tiny_font, MUTED), ("[2, 1]", code_mid, INK)], anchor="lm")
mixed(322, 322, [("栈 = 当前串约化后的形态", tiny_font, GREEN)], anchor="lm")

# ── 右：补数配对表 ───────────────────────────────────────────────────────────
CW, CH = 34, 30
PAIR_W = 9 * CW + 8 * 4
PX0 = 810 - PAIR_W / 2
for i in range(9):
    x = PX0 + i * (CW + 4)
    is_five = i == 4
    for row, (val, yy) in enumerate(((str(i + 1), 166), (str(9 - i), 204))):
        fill = GOLD_FILL if is_five else WHITE
        outline = GOLD if is_five else BORDER
        d.rounded_rectangle((int(x), int(yy), int(x + CW), int(yy + CH)), radius=5,
                            fill=fill, outline=outline, width=3 if is_five else 1)
        d.text((int(x + CW / 2), int(yy + CH / 2)), val, font=code_chip,
               fill=GOLD if is_five else INK, anchor="mm")

mixed(810, 250, [("每个数字只有一个补数", tiny_font, INK), ("　·　", tiny_font, MUTED),
                 ("5 配自己", tiny_font, GOLD), ("　→　每个数字只有一条出路", tiny_font, MUTED)])
mixed(810, 284, [("A 消最左：191191 → 1191 → ", tiny_font, MUTED), ("11", code_mid, GREEN)])
mixed(810, 312, [("B 消最右：191191 → 1911 → ", tiny_font, MUTED), ("11", code_mid, GREEN)])
mixed(810, 344, [("终点相同 → 结果唯一（终止 + 临界对 a b a）", tiny_font, ORANGE)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 396
CARD_H = 172
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
    y = CARD_Y + 42
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 33


bottom_card(LEFT_X, GREEN, "骨架", [
    [("1~9 的补数唯一：", tiny_font, INK), ("1+9  2+8  3+7  4+6  5+5", code_small, INK)],
    [("栈顶 + 当前 == 10 → 一起消失（弹出）", tiny_font, INK)],
    [("否则入栈；栈 = 当前串约化后的形态", tiny_font, INK)],
    [("结果唯一 → ", tiny_font, MUTED), ("最短剩余长度就是这个长度", tiny_font, GREEN)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "易错点与验证", [
    [("漏掉 5+5（补数是自己）/ 栈空就取栈顶", tiny_font, ORANGE)],
    [("只数相邻对，漏掉「接上来的」：1289 应全消", tiny_font, ORANGE)],
    [("每轮重扫 O(n²)：n=8000 实测慢 2000 倍", tiny_font, ORANGE)],
    [("验证：穷举 66430 串 + 三序同果 2000 串", tiny_font, GREEN)],
])

FOOTER = "同族栈题：LC 1047 相邻相同消除 · LC 1209 相邻相同消除 II · LC 2696 消 AB/CD · LC 735 行星碰撞"
d.text((W / 2, H - 16), FOOTER, font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
tw_title = d.textlength(TITLE, font=title_font)
assert tw_title < W - 60, f"标题过宽 {tw_title}"
assert CHIP_X0 > 40 and CHIP_X0 + CHIP_W < 540, "左侧格子越界"
assert CHIP_Y0 + CELL + 22 < 226, "格子压住结论行"
assert STACK_TOP + CELL < 322 - 12, "栈格压住说明行"
assert PX0 > 552 and PX0 + PAIR_W < 1060, "右侧配对表越界"
assert 166 + CH < 204, "配对表两行重叠"
assert 344 + 12 < CARD_Y - 14, "右侧结论行压住卡片徽标"
assert 360 + 12 < CARD_Y - 14, "分隔线压住卡片徽标"
for cy, wsum in checks:
    if cy >= CARD_Y:
        assert wsum < CARD_W - 48, f"卡片行过宽 y={cy}: {wsum}"
    elif cy == 84:
        assert wsum < W - 80, f"副标题过宽 y={cy}: {wsum}"
    elif cy >= 148 and cy < 360:
        assert wsum < 470, f"面板行过宽 y={cy}: {wsum}"
assert CARD_Y + CARD_H < H - 30, "底部卡片与 family 行重叠"
assert d.textlength(FOOTER, font=tiny_font) < W - 40, "family 行过宽"
print("SELF-CHECK OK:", f"title={int(tw_title)}")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
for out in ("frontend/public/photos/tencent-eliminate-sum10-cover.png",
            "photos/tencent-eliminate-sum10-cover.png"):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
