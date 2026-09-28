# -*- coding: utf-8 -*-
"""生成 LC 53 文章封面 frontend/public/photos/lc-53-cover.png。

风格对齐 LC 系列。这张图讲三件事：

  左半 —— 官方例的格子行，最优区间 [3..6]（= [4,-1,2,1]）用金色边框 +
        金色横线标出，答案 6。

  右半 —— 两张卡片对照本题的两种解法形态：
        绿卡「Kadane · 一句话」—— cur = max(x, cur + x)，O(n) / O(1)；
        橙卡「分治 · 四元组」—— (l_sum, r_sum, i_sum, m_sum)，可升级为线段树。

  底部 —— 一行点出同族变体：918 环形 / 121 股票 / 152 乘积。

⚠️ 中英混排必须逐段绘制：Consolas 没有中文字形，中文要用 msyh。
"""
import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 680
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
GOLD_FILL = (253, 246, 232)

TITLE = "最大子数组和 · Kadane 的一句话"

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

tag_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 20)
title_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 40)
note_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 19)
tiny_font = ImageFont.truetype(r"C:\Windows\Fonts\msyh.ttc", 16)
card_title = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 20)
cell_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 22)
idx_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 12)
code_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 15)
code_small = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 14)
ans_font = ImageFont.truetype(r"C:\Windows\Fonts\msyhbd.ttc", 26)
formula_font = ImageFont.truetype(r"C:\Windows\Fonts\consola.ttf", 22)

# ── 页眉 ───────────────────────────────────────────────────────────────────
tag = "ALGORITHM"
tw = d.textlength(tag, font=tag_font)
d.text((88, 52), tag, font=tag_font, fill=MUTED)
d.line((88 + tw + 18, 66, 88 + tw + 78, 66), fill=BORDER, width=2)

tw = d.textlength(TITLE, font=title_font)
d.text(((W - tw) / 2, 84), TITLE, font=title_font, fill=INK)

# ══════════════════════════════════════════════════════════════════════════
# 左半：官方例的格子行 + 最优区间 + 答案
# ══════════════════════════════════════════════════════════════════════════
ARR = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
BEST_L, BEST_R = 3, 6                      # [4,-1,2,1] → 6
CELL_W, CELL_H, CELL_GAP = 56, 52, 6
CELL_Y = 270
CHART_LEFT = 64

# 公式行
fx = CHART_LEFT
fy = 175
for text, font, color in [
    ("cur = max(x, cur + x)", formula_font, INK),
    ("   # ", formula_font, MUTED),
    ("带上前面那段，是赚了还是亏了", tiny_font, MUTED),
]:
    d.text((fx, fy), text, font=font, fill=color, anchor="lm")
    fx += d.textlength(text, font=font)

chart_w = len(ARR) * CELL_W + (len(ARR) - 1) * CELL_GAP
cell_cx = lambda k: CHART_LEFT + k * (CELL_W + CELL_GAP) + CELL_W / 2

for k, v in enumerate(ARR):
    x = CHART_LEFT + k * (CELL_W + CELL_GAP)
    in_best = BEST_L <= k <= BEST_R
    d.rounded_rectangle((x, CELL_Y, x + CELL_W, CELL_Y + CELL_H), radius=6,
                        fill=GOLD_FILL if in_best else WHITE,
                        outline=GOLD if in_best else BORDER,
                        width=3 if in_best else 2)
    d.text((x + CELL_W / 2, CELL_Y + CELL_H / 2), str(v), font=cell_font,
           fill=GOLD if in_best else INK, anchor="mm")
    d.text((x + CELL_W / 2, CELL_Y + CELL_H + 16), str(k), font=idx_font, fill=MUTED, anchor="mm")

# 金色横线 + 两端小竖线
line_y = CELL_Y + CELL_H + 34
lx1 = CHART_LEFT + BEST_L * (CELL_W + CELL_GAP)
lx2 = CHART_LEFT + BEST_R * (CELL_W + CELL_GAP) + CELL_W
d.line((lx1, line_y, lx2, line_y), fill=GOLD, width=3)
d.line((lx1, CELL_Y + CELL_H + 28, lx1, line_y), fill=GOLD, width=2)
d.line((lx2, CELL_Y + CELL_H + 28, lx2, line_y), fill=GOLD, width=2)

# 最优标签
d.text(((lx1 + lx2) / 2, line_y + 26), "最优 nums[3..6] = [4, -1, 2, 1]",
       font=tiny_font, fill=GOLD, anchor="mm")

# 答案行
ax = CHART_LEFT
for text, font, color in [
    ("最大子数组和 = ", ans_font, INK), ("6", ans_font, GOLD),
]:
    d.text((ax, 430), text, font=font, fill=color, anchor="lm")
    ax += d.textlength(text, font=font)
d.text((ax + 24, 430), "O(n) 时间 · O(1) 空间", font=tiny_font, fill=MUTED, anchor="lm")

# ══════════════════════════════════════════════════════════════════════════
# 右半：两种解法形态的对照卡片
# ══════════════════════════════════════════════════════════════════════════
CARD_X = 640
CARD_W = 400
CARD1_Y = 168
CARD2_Y = 392
CARD_H = 208

CODE_TOP_DY = 58
CODE_LINE_H = 21
RULE_DY = 112
NOTE_TOP_DY = 130
NOTE_LINE_H = 21


def code_card(cy, accent, accent_fill, badge, lines, notes):
    d.rounded_rectangle((CARD_X, cy, CARD_X + CARD_W, cy + CARD_H), radius=12,
                        fill=accent_fill, outline=accent, width=2)
    bw = d.textlength(badge, font=card_title) + 34
    d.rounded_rectangle((CARD_X + 16, cy + 14, CARD_X + 16 + bw, cy + 40), radius=7, fill=accent)
    d.text((CARD_X + 16 + bw / 2, cy + 27), badge, font=card_title, fill=WHITE, anchor="mm")

    y = cy + CODE_TOP_DY
    for parts in lines:
        cx = CARD_X + 22
        for text, font, color in parts:
            d.text((cx, y), text, font=font, fill=color, anchor="lm")
            cx += d.textlength(text, font=font)
        y += CODE_LINE_H

    d.line((CARD_X + 22, cy + RULE_DY, CARD_X + CARD_W - 22, cy + RULE_DY), fill=BORDER, width=1)

    y = cy + NOTE_TOP_DY
    for text, color in notes:
        d.text((CARD_X + 22, y), text, font=tiny_font, fill=color, anchor="lm")
        y += NOTE_LINE_H


# 卡 1：Kadane · 一句话
code_card(
    CARD1_Y, GREEN, GREEN_FILL, "Kadane · 一句话",
    [
        [("cur = max(x, cur + x)", code_small, INK)],
        [
            ("# ", code_font, MUTED),
            ("前面为负就扔掉重起", tiny_font, GREEN),
        ],
    ],
    [
        ("每个位置只看一次，两次比较", MUTED),
        ("O(n) 时间 · O(1) 空间 —— 理论下界", GREEN),
        ("返回子数组：重置时记 start，刷新时记区间", GREEN),
    ],
)

# 卡 2：分治 · 四元组
code_card(
    CARD2_Y, ORANGE, ORANGE_FILL, "分治 · 四元组",
    [
        [("m_sum = max(", code_small, INK),
         ("L.m, R.m", code_small, ORANGE),
         (",", code_small, INK)],
        [("        L.r + R.l)", code_small, INK)],
    ],
    [
        ("四个量：最大前缀 / 最大后缀 / 总和 / 答案", MUTED),
        ("合并 O(1) × 2n-1 个节点 = O(n)", ORANGE),
        ("可升级为线段树：单点修改 + 区间查询", ORANGE),
    ],
)

# ── 底部小注：同族变体 ──────────────────────────────────────────────────────
d.line((88, H - 58, W - 88, H - 58), fill=BORDER, width=2)
note = "同族变体：LC 918 环形（正反各跑一遍） · LC 121 股票（差价版 Kadane） · LC 152 乘积（最大最小同维护）"
ntw = d.textlength(note, font=note_font)
d.text(((W - ntw) / 2, H - 38), note, font=note_font, fill=MUTED)

for out in (
    r"D:\zhoujungis.github.io\frontend\public\photos\lc-53-cover.png",
    r"D:\zhoujungis.github.io\photos\lc-53-cover.png",
):
    os.makedirs(os.path.dirname(out), exist_ok=True)
    img.save(out)
    print("saved", out)
