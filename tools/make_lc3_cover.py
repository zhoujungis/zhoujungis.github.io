# -*- coding: utf-8 -*-
"""生成 LC 3 文章封面 frontend/public/photos/lc-3-cover.png。

风格对齐 LC 系列：米色底、左上 ALGORITHM 小标、居中标题、下方示意图。
画面表达本题的本质 —— 「判据不是'字符出现过'，而是'它还在窗口里'」：

  上半 —— 演示串 "abcabcbb" 的字符格子行，窗口 [1, 3] 用绿色标出（这正好是
          走到下标 3 的 'a' 之后、"left 从 0 跳到 1"那一刻的窗口），
          格子下方标 L / R 和窗口内容 "bca"；下标的 0（旧的 'a'）单独画一个
          小标记，提示"它已经在窗口外了"。

  下半 —— 两个并排的判据卡片：
          左（橙）错的写法 if ch in last → 旧位置在窗口外时 left 会倒退；
          右（绿）对的写法 if ch in last and last[ch] >= left → left 只右移。

  底部 —— 一行点出变体：340 至多 K 个不同字符 · 424 替换后最长重复
          · 76 最小覆盖子串 · 209 长度最小的子数组。
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
ORANGE_FILL = (252, 243, 238)
DIM_FILL = (240, 240, 237)
DIM = (196, 200, 194)

TITLE = "无重复字符的最长子串"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

tag_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
title_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 40)
note_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 20)
tiny_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 16)
mini_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 15)
code_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 16)
code_small = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 15)
cell_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
pin_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 14)

# ── 页眉 ───────────────────────────────────────────────────────────────────
tag = "ALGORITHM"
tw = d.textlength(tag, font=tag_font)
d.text((88, 52), tag, font=tag_font, fill=MUTED)
d.line((88 + tw + 18, 66, 88 + tw + 78, 66), fill=BORDER, width=2)

tw = d.textlength(TITLE, font=title_font)
d.text(((W - tw) / 2, 84), TITLE, font=title_font, fill=INK)


def mix(cx, cy, parts):
    """parts: [(text, font, color), ...] —— 按段选字体，中英混排不断字。"""
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    total = sum(widths)
    x = cx - total / 2
    for (t, f, c), w in zip(parts, widths):
        d.text((x, cy), t, font=f, fill=c, anchor="lm")
        x += w


# ══════════════════════════════════════════════════════════════════════════
# 上半：字符格子行 + 窗口
# ══════════════════════════════════════════════════════════════════════════
S = "abcabcbb"
CELL_W = 52
CELL_GAP = 6
CELL_H = 48
STR_Y = 156
STR_W = len(S) * CELL_W + (len(S) - 1) * CELL_GAP
STR_LEFT = (W - STR_W) / 2

WIN_L, WIN_R = 1, 3          # 窗口 [1,3] = "bca"
OLD_IDX = 0                  # 旧的 'a' 位置，已经在窗口外

for i, ch in enumerate(S):
    x = STR_LEFT + i * (CELL_W + CELL_GAP)
    in_win = WIN_L <= i <= WIN_R
    is_cur = i == WIN_R
    if is_cur:
        fill, stroke, tc = ORANGE_FILL, ORANGE, ORANGE
    elif in_win:
        fill, stroke, tc = GREEN_FILL, GREEN, INK
    else:
        fill, stroke, tc = DIM_FILL, DIM, DIM
    d.rounded_rectangle((x, STR_Y, x + CELL_W, STR_Y + CELL_H), radius=7,
                        fill=fill, outline=stroke, width=2 if in_win or is_cur else 1)
    d.text((x + CELL_W / 2, STR_Y + CELL_H / 2), ch, font=cell_font, fill=tc, anchor="mm")

# 下标
for i in range(len(S)):
    x = STR_LEFT + i * (CELL_W + CELL_GAP) + CELL_W / 2
    col = GOLD if i == OLD_IDX else (MUTED if WIN_L <= i <= WIN_R else DIM)
    d.text((x, STR_Y + CELL_H + 15), str(i), font=pin_font, fill=col, anchor="mm")

# 窗口色带
bar_y = STR_Y + CELL_H + 32
bx1 = STR_LEFT + WIN_L * (CELL_W + CELL_GAP)
bx2 = STR_LEFT + WIN_R * (CELL_W + CELL_GAP) + CELL_W
d.rounded_rectangle((bx1, bar_y, bx2, bar_y + 8), radius=4, fill=GREEN_FILL, outline=GREEN, width=1)

# L / R 标签
d.text((bx1 + CELL_W / 2, bar_y + 24), f"L={WIN_L}", font=pin_font, fill=ORANGE, anchor="mm")
d.text((bx2 - CELL_W / 2, bar_y + 24), f"R={WIN_R}", font=pin_font, fill=GREEN, anchor="mm")
mix(W / 2 + 120, bar_y + 24,
    [("窗口 ", mini_font, MUTED), (f"[{WIN_L},{WIN_R}] = \"bca\"", code_small, INK)])

# 旧的 'a' 提示：下标 0 已经在窗口外了
ox = STR_LEFT + OLD_IDX * (CELL_W + CELL_GAP) + CELL_W / 2
d.text((ox, bar_y + 48), "旧位置已在窗口外", font=mini_font, fill=GOLD, anchor="mm")

# ══════════════════════════════════════════════════════════════════════════
# 下半：两个判据卡片
# ══════════════════════════════════════════════════════════════════════════
CARD_Y = 312
CARD_H = 114
CARD_W = 442
GAPX = 44
LEFT_X = (W - (CARD_W * 2 + GAPX)) / 2
RIGHT_X = LEFT_X + CARD_W + GAPX


def judge_card(x, accent, accent_fill, badge, lines, note):
    d.rounded_rectangle((x, CARD_Y, x + CARD_W, CARD_Y + CARD_H), radius=10,
                        fill=accent_fill, outline=accent, width=2)
    # 角标
    d.rounded_rectangle((x + 14, CARD_Y + 12, x + 14 + 58, CARD_Y + 34), radius=6,
                        fill=accent)
    d.text((x + 14 + 29, CARD_Y + 23), badge, font=mini_font, fill=WHITE, anchor="mm")
    y = CARD_Y + 48
    for ln, is_hl in lines:
        d.text((x + 18, y), ln, font=code_small, fill=accent if is_hl else INK, anchor="lm")
        y += 22
    # ⚠️ 说明行要留够和上一行的间距：初版 CARD_H=96 时说明落在 +80，
    # 而代码第二行在 +71（文字高约 16），两行直接叠住。
    d.text((x + 18, CARD_Y + CARD_H - 20), note, font=mini_font, fill=MUTED, anchor="lm")


judge_card(
    LEFT_X, ORANGE, ORANGE_FILL, "错的写法",
    [("if ch in last:", False), ("    left = last[ch] + 1", True)],
    "旧位置已在窗口外时，left 会倒退 → \"abba\" 错答 3",
)
judge_card(
    RIGHT_X, GREEN, GREEN_FILL, "对的写法",
    [("if ch in last and last[ch] >= left:", False), ("    left = last[ch] + 1", True)],
    "只跳过「还在窗口里」的重复 → left 只往右移",
)

# ── 底部小注：变体 ──────────────────────────────────────────────────────────
d.line((88, H - 88, W - 88, H - 88), fill=BORDER, width=2)
note = "变体连考：340 至多 K 个不同字符 · 424 替换后最长重复 · 76 最小覆盖子串 · 209 长度最小的子数组"
ntw = d.textlength(note, font=note_font)
d.text(((W - ntw) / 2, H - 54), note, font=note_font, fill=MUTED)

import os
for out in (
    r"D:\zhoujungis.github.io\frontend\public\photos\lc-3-cover.png",
    r"D:\zhoujungis.github.io\photos\lc-3-cover.png",
):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("saved", out)
