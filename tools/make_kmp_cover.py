# -*- coding: utf-8 -*-
"""
make_kmp_cover.py — 【KMP】求 next 数组 的封面。

构图：左右两个面板，中间分隔线（沿用 lc1928/lc139 封面骨架）。
左 = 前缀表推演：p 行与 next 行各 7 格；p[0..2] 与 p[4..6] 同为 "aba"
     两段染绿，next[0] = 0 与 next[6] = 3 描金；两行之间一条虚线示意
     「j 回退读的是 next[j-1]」。
右 = 匹配现场：text = "abababacaba" 的 11 格，命中窗口 4..10 描金；
     p 行按 j 滑动对齐到 text[4] 正下方，整条描金；下面两行讲账本。
下面两张卡片：next 的两种定义 / 同族与分工。

红线（SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文与符号（→ 交给中文字体）；几何自检。
"""

import os

from PIL import Image, ImageDraw, ImageFont

W, H = 1100, 620
BG = (247, 246, 242)
INK = (31, 42, 36)
MUTED = (101, 113, 104)
BORDER = (195, 201, 194)
GREEN = (63, 107, 87)
GREEN_FILL = (238, 245, 241)
ORANGE = (164, 95, 69)
ORANGE_FILL = (246, 230, 224)
GOLD = (194, 135, 47)
GOLD_FILL = (253, 243, 227)
DIM = (154, 163, 156)
WHITE = (255, 255, 255)
DASH = (216, 221, 214)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 30)
tiny_font = font("msyh.ttc", 15)
card_title = font("msyhbd.ttc", 17)
row_label = font("msyhbd.ttc", 14)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 19)
sym_small = font("msyh.ttc", 16)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []


def mixed(cx, cy, parts, anchor="mm"):
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    total = sum(widths)
    x = cx - total / 2 if anchor == "mm" else cx
    checks.append((int(cy), int(x), int(total)))
    for (text, f, color), w in zip(parts, widths):
        d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
        x += w
    return x


def right_text(x_right, y, text, f, color):
    w = d.textlength(text, font=f)
    d.text((int(x_right - w), int(y)), text, font=f, fill=color, anchor="lm")
    checks.append((int(y), int(x_right - w), int(w)))


CELL_KINDS = {
    "val": (WHITE, BORDER, INK, 2),
    "win": (GREEN_FILL, GREEN, GREEN, 2),
    "base": (GOLD_FILL, GOLD, GOLD, 3),
    "hit": (GOLD_FILL, GOLD, GOLD, 3),
}


def cell(x, y, cw, ch, value, kind, tfont):
    fill, stroke, tcol, width = CELL_KINDS[kind]
    d.rounded_rectangle((int(x), int(y), int(x + cw), int(y + ch)), radius=6,
                        fill=fill, outline=stroke, width=width)
    d.text((int(x + cw / 2), int(y + ch / 2)), str(value), font=tfont,
           fill=tcol, anchor="mm")


def dashed(p0, p1, color=ORANGE, dash=7, gap=5, width=2):
    """PIL 没有虚线，按步长手工画。"""
    x0, y0 = p0
    x1, y1 = p1
    total = max(1.0, ((x1 - x0) ** 2 + (y1 - y0) ** 2) ** 0.5)
    step = dash + gap
    n = int(total // step) + 1
    for i in range(n):
        t0 = min(1.0, i * step / total)
        t1 = min(1.0, (i * step + dash) / total)
        d.line((x0 + (x1 - x0) * t0, y0 + (y1 - y0) * t0,
                x0 + (x1 - x0) * t1, y0 + (y1 - y0) * t1), fill=color, width=width)


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 46), "KMP 求 next 数组：自己跟自己的最长相等前后缀",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 86, [("next[i] = p[0..i] 的最长相等真前后缀长度；", tiny_font, MUTED),
                  ("next[0] = 0", code_small, GOLD),
                  (" 是定义，不是算出来的", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(275, 128, [("前缀表  p = \"abacaba\"", card_title, GREEN), ("　自己跟自己匹配", tiny_font, MUTED)])
mixed(825, 128, [("匹配现场  text = \"abababacaba\"", card_title, ORANGE), ("　i 永不回头", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 148, 550, 336), fill=BORDER, width=2)

LCX, RCX = 275, 825

# ── 左面板：p 行 + next 行 ───────────────────────────────────────────────────
P_CW, P_GAP = 46, 6
P_N = 7
p_row_w = P_N * P_CW + (P_N - 1) * P_GAP
p_x0 = LCX - p_row_w / 2
p_cent = lambda k: p_x0 + k * (P_CW + P_GAP) + P_CW / 2

P_IDX_Y = 156
P_Y, P_H = 162, 32
N_Y, N_H = 224, 32

for k in range(P_N):
    d.text((int(p_cent(k)), P_IDX_Y), str(k), font=row_label, fill=DIM, anchor="mm")

P_CHARS = "abacaba"
for k, ch in enumerate(P_CHARS):
    # 前缀 p[0..2] 与后缀 p[4..6] 都是 "aba" → 两段染绿，中间的 'c' 留白
    kind = "win" if k <= 2 or k >= 4 else "val"
    cell(p_x0 + k * (P_CW + P_GAP), P_Y, P_CW, P_H, ch, kind, code_mid)

d.text((int(p_x0 - 12), P_Y + P_H / 2), "p", font=row_label, fill=DIM, anchor="rm")

N_VALUES = [0, 0, 1, 0, 1, 2, 3]
for k, val in enumerate(N_VALUES):
    if k == 0:
        kind = "base"          # next[0] = 0 是定义
    elif k == P_N - 1:
        kind = "hit"           # next[6] = 3 是最长边界
    else:
        kind = "win"
    cell(p_x0 + k * (P_CW + P_GAP), N_Y, P_CW, N_H, val, kind, code_small)

d.text((int(p_x0 - 12), N_Y + N_H / 2), "next", font=row_label, fill=DIM, anchor="rm")

# 回退示意：j 从 p[1] 退到 next[0]
dashed((p_cent(1), P_Y + P_H), (p_cent(0), N_Y))
d.text((int(p_cent(1) + 14), (P_Y + P_H + N_Y) / 2),
       "j = next[j-1]", font=sym_small, fill=ORANGE, anchor="lm")

mixed(p_x0, 286, [("绿：", tiny_font, GREEN),
                  ("p[0..2]", code_small, GREEN),
                  (" 与 ", tiny_font, MUTED),
                  ("p[4..6]", code_small, GREEN),
                  (" 都是 \"aba\"，长度 3 → ", tiny_font, MUTED),
                  ("next[6] = 3", code_small, GOLD)], anchor="lm")
mixed(p_x0, 312, [("回退读的是 ", tiny_font, MUTED),
                  ("next[j-1]", code_small, ORANGE),
                  ("，不是 ", tiny_font, MUTED),
                  ("next[j]", code_small, ORANGE),
                  ("（差一格就整体错位）", tiny_font, MUTED)], anchor="lm")

# ── 右面板：text 行 + 对齐的 p 行 ────────────────────────────────────────────
T_CW, T_GAP = 38, 4
T_M = 11
t_row_w = T_M * T_CW + (T_M - 1) * T_GAP
t_x0 = RCX - t_row_w / 2
t_cent = lambda k: t_x0 + k * (T_CW + T_GAP) + T_CW / 2
t_step = T_CW + T_GAP

T_IDX_Y = 156
T_Y, T_H = 162, 32
PT_Y, PT_H = 214, 32
PT_IDX_Y = 258

for k in range(T_M):
    d.text((int(t_cent(k)), T_IDX_Y), str(k), font=row_label, fill=DIM, anchor="mm")

TEXT = "abababacaba"
FOUND_FROM = 4
PT_N = 7
for k, ch in enumerate(TEXT):
    kind = "hit" if k >= FOUND_FROM else "val"
    cell(t_x0 + k * t_step, T_Y, T_CW, T_H, ch, kind, code_mid)

d.text((int(t_x0 - 12), T_Y + T_H / 2), "text", font=row_label, fill=DIM, anchor="rm")

pt_x0 = t_x0 + FOUND_FROM * t_step
pt_cent = lambda k: pt_x0 + k * t_step + T_CW / 2
for k, ch in enumerate(P_CHARS):
    cell(pt_x0 + k * t_step, PT_Y, T_CW, PT_H, ch, "hit", code_mid)
    d.text((int(pt_cent(k)), PT_IDX_Y), str(k), font=row_label, fill=GOLD, anchor="mm")

d.text((int(t_x0 - 12), PT_Y + PT_H / 2), "p", font=row_label, fill=DIM, anchor="rm")

mixed(t_x0, 286, [("命中：", tiny_font, INK),
                  ("j == n", code_small, GOLD),
                  (" → 起点 ", tiny_font, MUTED),
                  ("index = i - n + 1 = 10 - 7 + 1 = 4", code_small, GOLD)], anchor="lm")
mixed(t_x0, 312, [("KMP 比较 ", tiny_font, MUTED), ("13", code_small, GREEN),
                  (" 次  vs  暴力比较 ", tiny_font, MUTED), ("17", code_small, ORANGE),
                  (" 次（s = 0/1/2/3 各从头重比）", tiny_font, MUTED)], anchor="lm")

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 404
CARD_H = 176
CARD_W = 470
GAPX = 40
LEFT_X = (W - CARD_W * 2 - GAPX) / 2


def bottom_card(x, accent, badge, lines):
    d.rounded_rectangle((int(x), int(CARD_Y), int(x + CARD_W), int(CARD_Y + CARD_H)), radius=12,
                        fill=WHITE, outline=accent, width=2)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
                        radius=7, fill=accent)
    d.text((x + 16 + tw / 2, CARD_Y - 1), badge, font=card_title, fill=WHITE, anchor="mm")
    y = CARD_Y + 44
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 40


bottom_card(LEFT_X, GREEN, "next 的两种定义", [
    [("前缀函数 A：", tiny_font, INK), ("next[i] = p[0..i] 的最长相等真前后缀", tiny_font, MUTED)],
    [("本文答案：", tiny_font, INK), ("next[0] = 0", code_small, GREEN),
     (" → ", tiny_font, MUTED), ("[0,0,1,0,1,2,3]", code_small, GREEN)],
    [("严蔚敏版 B：", tiny_font, INK), ("next[0] = -1", code_small, ORANGE),
     (" → ", tiny_font, MUTED), ("[-1,0,0,1,0,1,2]", code_small, ORANGE)],
    [("关系：", tiny_font, INK), ("B = [-1] + A[0..n-2]", code_small, GOLD),
     ("（整体右移一格）", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX, ORANGE, "同族与分工", [
    [("28：", tiny_font, INK), ("strStr()", code_small, ORANGE),
     ("（就用这张 next 扫一遍）", tiny_font, MUTED)],
    [("459：", tiny_font, INK), ("n % (n - next[n-1]) == 0", code_small, ORANGE),
     ("（周期判据）", tiny_font, MUTED)],
    [("214：", tiny_font, INK), ("s + '#' + reverse(s)", code_small, ORANGE),
     (" 求 next（回文前缀）", tiny_font, MUTED)],
    [("1392 / 686：", tiny_font, INK), ("next[n-1]", code_small, ORANGE),
     ("（最长快乐前缀 / 叠加匹配）", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "同族：LC 28 找出字符串中第一个匹配项的下标 · LC 459 重复的子字符串 · "
       "LC 214 最短回文串 · LC 1392 最长快乐前缀 · LC 686 重复叠加字符串匹配",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
tw_title = d.textlength("KMP 求 next 数组：自己跟自己的最长相等前后缀", font=title_font)
assert tw_title < W - 60, f"标题过宽 {int(tw_title)}"
assert p_row_w < 470, f"p/next 表过宽 {int(p_row_w)}"
assert t_x0 > 560, f"text 行侵入左面板 x={int(t_x0)}"
assert t_x0 + t_row_w < W - 20, f"text 行越界 {int(t_x0 + t_row_w)}"
assert pt_x0 + PT_N * t_step < W - 20, f"p 行越界 {int(pt_x0 + PT_N * t_step)}"
assert 128 + 12 < P_IDX_Y, "面板标题压住左表下标"
assert P_Y + P_H < N_Y - 10, "p 行与 next 行挨得太近"
assert T_Y + T_H < PT_Y - 10, "text 行与 p 行挨得太近"
assert PT_IDX_Y + 8 < 286 - 8, "p 行下标压住结论行"
assert 312 + 10 < CARD_Y - 14, "结论行压住卡片徽标"
assert CARD_Y + CARD_H < H - 32, "底部卡片与 family 行重叠"
family = d.textlength(
    "同族：LC 28 找出字符串中第一个匹配项的下标 · LC 459 重复的子字符串 · "
    "LC 214 最短回文串 · LC 1392 最长快乐前缀 · LC 686 重复叠加字符串匹配",
    font=tiny_font)
assert family < W - 40, f"family 行过宽 {int(family)}"
for cy, x0, wsum in checks:
    if cy >= CARD_Y:
        assert wsum < CARD_W - 48, f"卡片行过宽 y={cy}: {int(wsum)}"
    else:
        assert x0 >= 0 and x0 + wsum < W - 12, f"横排越界 y={cy}: x={x0} w={int(wsum)}"
print("SELF-CHECK OK:", f"title={int(tw_title)} p_row={int(p_row_w)} t_row={int(t_row_w)} "
                        f"family={int(family)}")

# ── 双份落盘 ─────────────────────────────────────────────────────────────────
for out in ("frontend/public/photos/kmp-cover.png", "photos/kmp-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
