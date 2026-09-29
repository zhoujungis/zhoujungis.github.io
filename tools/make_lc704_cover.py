# -*- coding: utf-8 -*-
"""
make_lc704_cover.py — 【LC 704/69】二分查找 & x 的平方根 的封面。

构图：左右两个面板，中间分隔线。
左 = 704：有序数组 8 格（窗口 [4,7]，0..3 灰=已排除，mid=3 金框），
       left/right 指针在下、mid 在上。
右 = 69：整数区间 0..8 共 9 格（k²<=8 的真绿、假灰），边界在 2/3 之间，
       ans=2 绿框、mid=4 金框。
下面两张卡片：命中二分 / 边界二分。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文；无行首标签压格子（标注居中到格子群上方）；几何自检。
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
PAST = (238, 240, 236)
PAST_LINE = (216, 221, 214)
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
code_tiny = font("consola.ttf", 11)
row_label = font("msyhbd.ttc", 14)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []


def mixed(cx, cy, parts, anchor="mm"):
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    checks.append((int(cy), sum(widths)))
    if anchor == "mm":
        x = cx - sum(widths) / 2
    else:
        x = cx
    for (text, f, color), _w in zip(parts, widths):
        d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
        x += _w


def cell(x, y, cw, ch, fill, stroke, t, tcol, sub=None, subcol=None, width=2):
    d.rounded_rectangle((int(x), int(y), int(x + cw), int(y + ch)), radius=7,
                        fill=fill, outline=stroke, width=width)
    if sub is not None:
        d.text((int(x + cw / 2), int(y + ch / 2 - 8)), t, font=code_mid, fill=tcol, anchor="mm")
        d.text((int(x + cw / 2), int(y + ch - 12)), sub, font=code_tiny,
               fill=subcol or DIM, anchor="mm")
    elif t:
        d.text((int(x + cw / 2), int(y + ch / 2)), t, font=code_mid, fill=tcol, anchor="mm")


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 48), "二分查找 & x 的平方根：一个命中就返回，一个成立还向右",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 88, [("704：每探砍一半、绝不误伤 —— 区间不变量；69：谓词前真后假 —— 二分找边界",
                   tiny_font, MUTED)])

# ── 题目标签 ─────────────────────────────────────────────────────────────────
mixed(280, 130, [("LC 704 二分查找", card_title, GREEN),
                 ("  target = 9", tiny_font, MUTED)])
mixed(820, 130, [("LC 69 x 的平方根", card_title, ORANGE),
                 ("  x = 8", tiny_font, MUTED)])

CW, CH, GAP = 44, 52, 6
CELL_Y = 186

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 156, 550, 316), fill=BORDER, width=2)

# ── 左面板：704 数组窗口 ─────────────────────────────────────────────────────
d.text((280, 158), "有序数组：窗口 [left, right] 内是嫌疑区", font=row_label, fill=MUTED, anchor="mm")
LEFT_VALS = ["-1", "0", "3", "5", "9", "12", "15", "20"]
n1 = len(LEFT_VALS)
total1 = n1 * CW + (n1 - 1) * GAP
x1 = 280 - total1 / 2
for i, v in enumerate(LEFT_VALS):
    fill, stroke, tcol = WHITE, BORDER, INK
    if i <= 3:
        fill, stroke, tcol = PAST, PAST_LINE, DIM  # 已排除
    if i == 3:
        fill, stroke, tcol = GOLD_FILL, GOLD, GOLD  # 刚检查过的 mid
    cell(x1 + i * (CW + GAP), CELL_Y, CW, CH, fill, stroke, v, tcol,
         sub=str(i), subcol=DIM if i <= 3 else MUTED, width=3 if i == 3 else 2)
d.text((int(x1 + 3 * (CW + GAP) + CW / 2), 174), "mid", font=code_tiny, fill=GOLD, anchor="mm")
d.text((int(x1 + 4 * (CW + GAP) + CW / 2), 256), "left", font=code_tiny, fill=GREEN, anchor="mm")
d.text((int(x1 + 7 * (CW + GAP) + CW / 2), 256), "right", font=code_tiny, fill=ORANGE, anchor="mm")
mixed(280, 292, [("nums[3] = 5 < 9 → ", code_small, INK), ("left = 4", code_small, ORANGE),
                 ("（排除 4 个）", tiny_font, MUTED)])

# ── 右面板：69 谓词格子行 ────────────────────────────────────────────────────
d.text((820, 158), "整数区间 [0, 8]：绿 = 真（k²≤8），灰 = 假", font=row_label, fill=MUTED, anchor="mm")
n2 = 9
total2 = n2 * CW + (n2 - 1) * GAP
x2 = 820 - total2 / 2
for k in range(n2):
    true = k * k <= 8
    fill = GREEN_FILL if true else PAST
    stroke = BORDER
    tcol = INK if true else DIM
    w = 2
    if k == 4:
        fill, stroke, tcol, w = GOLD_FILL, GOLD, GOLD, 3  # 第 1 探 mid
    cell(x2 + k * (CW + GAP), CELL_Y, CW, CH, fill, stroke, str(k), tcol,
         sub=f"{k * k}", subcol=DIM if not true else MUTED, width=w)
# ans=2 绿框（叠画）
ax = x2 + 2 * (CW + GAP)
d.rounded_rectangle((int(ax - 3), CELL_Y - 3, int(ax + CW + 3), CELL_Y + CH + 3),
                    radius=9, outline=GREEN, width=3)
d.text((int(x2 + 4 * (CW + GAP) + CW / 2), 174), "mid", font=code_tiny, fill=GOLD, anchor="mm")
d.text((int(x2 + 2 * (CW + GAP) + CW / 2), 256), "ans", font=code_tiny, fill=GREEN, anchor="mm")
mixed(820, 292, [("边界：", tiny_font, MUTED), ("2²=4≤8<9=3²", code_small, ORANGE),
                 (" → ⌊√8⌋ = 2", tiny_font, INK)])

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 336
CARD_H = 176
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
    y = CARD_Y + 44
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 44


bottom_card(LEFT_X, GREEN, "704：命中二分", [
    [("不变量：答案若在，恒在 ", tiny_font, INK), ("[left, right]", code_small, GREEN)],
    [("命中 ", mini_font, MUTED), ("return mid", code_small, ORANGE),
     ("；区间空 ", mini_font, MUTED), ("(left>right)", code_small, DIM), (" 返回 -1", mini_font, MUTED)],
    [("三铁律：", tiny_font, INK), ("left + ((right-left)>>1)", code_small, GREEN),
     ("  · 收缩±1", mini_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "69：边界二分", [
    [("没有数组：", tiny_font, INK), ("[0, x]", code_small, GREEN),
     (" 就是数组，", tiny_font, INK), ("P(k)=k²≤x", code_small, ORANGE)],
    [("P(mid) 真：记 ", mini_font, INK), ("ans=mid", code_small, GREEN),
     ("，", mini_font, MUTED), ("lo=mid+1", code_small, ORANGE), (" 继续向右", mini_font, INK)],
    [("区间空：", tiny_font, INK), ("ans == hi", code_small, GREEN),
     (" —— 最后一个真", tiny_font, MUTED)],
])

d.text((W / 2, H - 16), "同族：LC 35 插入位置 · LC 34 首末位置 · LC 278/875 答案二分 · LC 153 旋转数组",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert total1 < 500 and total2 < 500, "格子行超面板宽"
tw_title = d.textlength("二分查找 & x 的平方根：一个命中就返回，一个成立还向右", font=title_font)
assert tw_title < W - 60, f"标题过宽 {tw_title}"
for cy, wsum in checks:
    if cy >= CARD_Y:  # 卡片内文字：限宽 CARD_W - 48
        assert wsum < CARD_W - 48, f"卡片行过宽 y={cy}: {wsum}"
    elif cy in (88, 292):
        assert wsum < W - 80, f"横排过宽 y={cy}: {wsum}"
assert CARD_Y + CARD_H < H - 32, "底部卡片与 family 行重叠"
assert CELL_Y + CH + 14 < 292 - 12, "指针标签压住说明行"
print("SELF-CHECK OK:", f"left={int(total1)} right={int(total2)} title={int(tw_title)}")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
import os

for out in ("frontend/public/photos/lc-704-69-cover.png", "photos/lc-704-69-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
