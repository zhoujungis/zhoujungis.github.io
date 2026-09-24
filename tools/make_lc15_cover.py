# -*- coding: utf-8 -*-
"""生成 LC 15 文章封面 frontend/public/photos/lc-15-cover.png。

风格对齐 LC 系列：米色底、左上 ALGORITHM 小标、居中标题、下方示意图。
这张图讲两件事：

  上方 —— 排序后的数组 + 三指针（i 在外层、L / R 在内层），
        停在"命中"的那一刻：(-1) + (-1) + 2 = 0。

  下方 —— 本题的全部难点：**去重只有两处**，而且形态相反：
        左卡（绿）"第一处 · 事前" —— `if nums[i] == nums[i-1]: continue`
              起点重复，整轮跳过；边界陷阱是 `i > 0`。
        右卡（橙）"第二处 · 事后" —— `while nums[l] == nums[l+1]: l += 1`
              命中后才跳，跳完还要各走一步；边界陷阱是 `l < r`。

  底部 —— 一行点出变体：16 / 18 / 259 / 611 / 923。

⚠️ 中英混排必须**逐段绘制**：Consolas 没有中文字形，整行用它会出一排豆腐块 □。
"""
import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 664
BG = (244, 242, 236)
INK = (31, 42, 36)
MUTED = (120, 128, 122)
BORDER = (214, 218, 210)
GREEN = (63, 107, 87)
ORANGE = (164, 95, 69)
GOLD = (194, 135, 47)
COOL = (74, 95, 138)
WHITE = (255, 255, 255)
GREEN_FILL = (240, 246, 242)
ORANGE_FILL = (252, 243, 238)
COOL_FILL = (240, 243, 249)
HOT_FILL = (252, 243, 238)

TITLE = "三数之和 · 两处去重"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

tag_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
title_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 40)
sub_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 19)
note_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 19)
tiny_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 16)
card_title = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 20)
cell_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 22)
pin_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 15)
code_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 15)
code_small = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 14)
sum_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)

# ── 页眉 ───────────────────────────────────────────────────────────────────
tag = "ALGORITHM"
tw = d.textlength(tag, font=tag_font)
d.text((88, 52), tag, font=tag_font, fill=MUTED)
d.line((88 + tw + 18, 66, 88 + tw + 78, 66), fill=BORDER, width=2)

tw = d.textlength(TITLE, font=title_font)
d.text(((W - tw) / 2, 84), TITLE, font=title_font, fill=INK)

sub = "排序 + 固定一个数 + 双指针 —— 骨架十分钟就会，难点全在两处去重"
sw = d.textlength(sub, font=sub_font)
d.text(((W - sw) / 2, 140), sub, font=sub_font, fill=MUTED)

# ══════════════════════════════════════════════════════════════════════════
# 上方：排序后的数组 + 三指针，停在「命中」的那一刻
# ══════════════════════════════════════════════════════════════════════════
ARR = [-4, -1, -1, 0, 1, 2]
PI = 1          # i 锚点
PL = 2          # L
PR = 5          # R
CELL_W, CELL_H, CELL_GAP = 76, 52, 8
CELL_Y = 214

row_w = len(ARR) * CELL_W + (len(ARR) - 1) * CELL_GAP
ROW_LEFT = (W - row_w) / 2
cell_cx = lambda k: ROW_LEFT + k * (CELL_W + CELL_GAP) + CELL_W / 2


def pin(cx, y, label, fill):
    pw = d.textlength(label, font=pin_font) + 22
    d.rounded_rectangle((cx - pw / 2, y, cx + pw / 2, y + 24), radius=6, fill=fill)
    d.text((cx, y + 12), label, font=pin_font, fill=WHITE, anchor="mm")
    return pw


# i 标签 + 朝下的三角
i_top = CELL_Y - 36
pin(cell_cx(PI), i_top, "i=1", ORANGE)
ix = cell_cx(PI)
d.polygon([(ix - 7, i_top + 24), (ix + 7, i_top + 24), (ix, i_top + 34)], fill=ORANGE)

# 格子
for k, v in enumerate(ARR):
    x = ROW_LEFT + k * (CELL_W + CELL_GAP)
    if k == PI:
        fill, line, tcol, wdt = HOT_FILL, ORANGE, ORANGE, 3
    elif k == PL:
        fill, line, tcol, wdt = GREEN_FILL, GREEN, GREEN, 3
    elif k == PR:
        fill, line, tcol, wdt = COOL_FILL, COOL, COOL, 3
    else:
        fill, line, tcol, wdt = WHITE, BORDER, INK, 2
    d.rounded_rectangle((x, CELL_Y, x + CELL_W, CELL_Y + CELL_H), radius=8,
                        fill=fill, outline=line, width=wdt)
    d.text((x + CELL_W / 2, CELL_Y + CELL_H / 2), str(v), font=cell_font,
           fill=tcol, anchor="mm")

# L / R 标签 + 朝上的三角（放同一行 —— 这一帧 L 和 R 相距很远，不会撞）
lr_top = CELL_Y + CELL_H + 12
for idx, label, col in ((PL, "L=2", GREEN), (PR, "R=5", COOL)):
    cx = cell_cx(idx)
    d.polygon([(cx - 7, lr_top - 10), (cx + 7, lr_top - 10), (cx, lr_top - 1)], fill=col)
    pin(cx, lr_top, label, col)

# 当前三数之和
expr = "(-1) + (-1) + 2 = 0"
ew = d.textlength(expr, font=sum_font)
verdict = "命中"
vw = d.textlength(verdict, font=note_font)
total = ew + 34 + vw
sx = (W - total) / 2
sy = CELL_Y + CELL_H + 56
d.text((sx, sy), expr, font=sum_font, fill=INK)
d.text((sx + ew + 34, sy + 1), verdict, font=note_font, fill=GOLD)

# ══════════════════════════════════════════════════════════════════════════
# 下方：两处去重的对照卡片
# ══════════════════════════════════════════════════════════════════════════
# ⚠️ 行高逐段记账：角标 26 + 代码 3 行 × 22 + 分隔线 + 说明 3 行 × 22 + 余量。
CARD_Y = 356
CARD_H = 226
CARD_W = 442
GAPX = 44
LEFT_X = (W - (CARD_W * 2 + GAPX)) / 2
RIGHT_X = LEFT_X + CARD_W + GAPX

CODE_TOP_DY = 62
CODE_LINE_H = 22
RULE_DY = 138
NOTE_TOP_DY = 158
NOTE_LINE_H = 22


def code_card(x, accent, accent_fill, badge, lines, notes):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=12,
                        fill=accent_fill, outline=accent, width=2)
    # 角标宽度按文字自适应 —— 写死会裁字
    bw = d.textlength(badge, font=card_title) + 34
    d.rounded_rectangle((x + 16, CARD_Y + 14, x + 16 + bw, CARD_Y + 40), radius=7, fill=accent)
    d.text((x + 16 + bw / 2, CARD_Y + 27), badge, font=card_title, fill=WHITE, anchor="mm")

    # ⚠️ 代码行必须分段绘制：Consolas 无中文字形，中文注释要用 msyh
    y = CARD_Y + CODE_TOP_DY
    for parts in lines:
        cx = x + 22
        for text, font, color in parts:
            d.text((cx, y), text, font=font, fill=color, anchor="lm")
            cx += d.textlength(text, font=font)
        y += CODE_LINE_H

    d.line((x + 22, CARD_Y + RULE_DY, x + CARD_W - 22, CARD_Y + RULE_DY), fill=BORDER, width=1)

    y = CARD_Y + NOTE_TOP_DY
    for text, color in notes:
        d.text((x + 22, y), text, font=tiny_font, fill=color, anchor="lm")
        y += NOTE_LINE_H


# 左：第一处 · 事前跳过
code_card(
    LEFT_X, GREEN, GREEN_FILL, "第一处 · 事前",
    [
        [
            ("if i > 0 and nums[i] == nums[i - 1]:", code_small, INK),
        ],
        [("    continue", code_small, GREEN)],
        [
            ("# ", code_font, MUTED),
            ("起点重复 → 整轮不进内层", tiny_font, MUTED),
        ],
    ],
    [
        ("挡住「起点重复」：同一个最小数只当一次 i", MUTED),
        ("形态是 continue —— 内层还没跑就知道它没意义", GREEN),
        ("边界陷阱：i > 0（否则 Python 会取到 nums[-1]）", GREEN),
    ],
)

# 右：第二处 · 事后跳过
code_card(
    RIGHT_X, ORANGE, ORANGE_FILL, "第二处 · 事后",
    [
        [
            ("while l < r and nums[l] == nums[l + 1]:", code_small, INK),
        ],
        [("    l += 1", code_small, ORANGE)],
        [
            ("# ", code_font, MUTED),
            ("命中后跳，跳完再各走一步", tiny_font, MUTED),
        ],
    ],
    [
        ("挡住「配对数重复」：同一个值只当一次左指针", MUTED),
        ("形态是 while —— 记下一组之后才知道往哪跳", ORANGE),
        ("边界陷阱：l < r（防越界，也防把 l 推过 r）", ORANGE),
    ],
)

# ── 底部小注：变体 ──────────────────────────────────────────────────────────
d.line((88, H - 62, W - 88, H - 62), fill=BORDER, width=2)
note = "变体连考：16 最接近的三数之和 · 18 四数之和 · 259 较小三数之和 · 611 有效三角形 · 923 计数版"
ntw = d.textlength(note, font=note_font)
d.text(((W - ntw) / 2, H - 42), note, font=note_font, fill=MUTED)

for out in (
    r"D:\zhoujungis.github.io\frontend\public\photos\lc-15-cover.png",
    r"D:\zhoujungis.github.io\photos\lc-15-cover.png",
):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("saved", out)
