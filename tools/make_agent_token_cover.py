# -*- coding: utf-8 -*-
"""
make_agent_token_cover.py — 【Token 经济学：同一任务十倍的差价】封面。

左 = 三个杠杆：prefix / compact / turns。
右 = 成本公式 + 二次项 + 三个「叫字符、量字节」的上限。
底部两卡 = 该省 / 不该省 · 调优清单。

红线：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文与特殊符号（Σ ≈ × − ² 交给中文字体）；几何自检；双份落盘。
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

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


title_font = font("msyhbd.ttc", 28)
tiny_font = font("msyh.ttc", 15)
card_title = font("msyhbd.ttc", 17)
code_small = font("consola.ttf", 17)
code_mid = font("consola.ttf", 19)
code_tiny = font("consola.ttf", 14)
formula_font = font("msyh.ttc", 18)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []
BOUND = W - 20

# Consolas 没有中文字形，也没有 Σ / ≈ / × / ² —— 落进代码字体段就会渲染成方框。
CODE_FONTS = (code_small, code_mid, code_tiny)


def assert_ascii(parts):
    for text, f, _ in parts:
        if f in CODE_FONTS:
            bad = [c for c in text if ord(c) > 127]
            assert not bad, f"代码字体段含非 ASCII 字符 {bad}：{text!r}"


def mixed(cx, cy, parts, anchor="mm"):
    assert_ascii(parts)
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    total = sum(widths)
    x = cx - total / 2 if anchor == "mm" else cx
    assert x >= 0 and x + total <= BOUND, f"文字越界: y={int(cy)} right={int(x + total)} bound={BOUND}"
    checks.append((int(cy), int(x), int(total)))
    for (text, f, color), w in zip(parts, widths):
        d.text((int(x), int(cy)), text, font=f, fill=color, anchor="lm")
        x += w
    return x


def right_text(x_right, y, text, f, color):
    assert_ascii([(text, f, color)])
    w = d.textlength(text, font=f)
    d.text((int(x_right - w), int(y)), text, font=f, fill=color, anchor="lm")
    checks.append((int(y), int(x_right - w), int(w)))


def card(x0, y0, x1, y1, fill, outline, width=2, radius=10):
    d.rounded_rectangle((int(x0), int(y0), int(x1), int(y1)), radius=radius,
                        fill=fill, outline=outline, width=width)


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 44), "Token 经济学：同一任务十倍的差价",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("Agent 工程 09", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("cost ≈ 前缀 × 历史 × 轮数", formula_font, ORANGE),
                  (" · ", tiny_font, DIM), ("不换模型也能省", tiny_font, GOLD)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 126, [("三个杠杆", card_title, GREEN), ("　差价来自结构", tiny_font, MUTED)])
mixed(805, 126, [("成本公式", card_title, ORANGE), ("　二次项才是大头", tiny_font, MUTED)])

d.line((550, 144, 550, 400), fill=BORDER, width=2)

# ── 左面板：三个杠杆 ─────────────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def lever(y0, h, code, note, accent, fill):
    card(LX0, y0, LX1, y0 + h, fill, accent, width=2)
    mixed(LX0 + 18, y0 + h / 2, [(code, code_mid, accent)], anchor="lm")
    right_text(LX1 - 18, y0 + h / 2, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


lever(168, 40, "prefix", "system + 工具 + 文档　3–20×", GREEN, GREEN_FILL)
lever(214, 40, "compact", "把 N² 切成几段小 N²　2–5×", ORANGE, ORANGE_FILL)
lever(260, 40, "turns", "每轮重发全部历史　∝ N", GOLD, GOLD_FILL)

mixed(LX0, 326, [("单价是线性因子，", tiny_font, MUTED), ("历史是复利", tiny_font, INK),
                 ("；十倍差价不靠换模型", tiny_font, MUTED)], anchor="lm")
mixed(LX0, 354, [("先量 ", tiny_font, MUTED), ("S / H_t / O_t", code_small, INK),
                 ("，再决定省哪一段", tiny_font, MUTED)], anchor="lm")

# ── 右面板：成本公式 + 三个同名字上限 ───────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10

card(RX0, 160, RX1, 330, WHITE, ORANGE, width=2)
mixed(RX0 + 16, 184, [("一轮请求的成本", card_title, ORANGE),
                      ("　Σ 对每一轮求和", tiny_font, MUTED)], anchor="lm")

mixed(RX0 + 18, 218, [("cost", code_small, ORANGE), (" ≈ Σ [ ", formula_font, INK),
                     ("P_in", formula_font, GREEN), (" × (", formula_font, INK),
                     ("S", formula_font, GOLD), (" + ", formula_font, INK),
                     ("H_t", formula_font, GREEN), (") + ", formula_font, INK),
                     ("P_out", formula_font, GREEN), (" × ", formula_font, INK),
                     ("O_t", formula_font, GREEN), (" ]", formula_font, INK)], anchor="lm")

mixed(RX0 + 18, 252, [("total_in", code_small, GREEN), (" ≈ ", formula_font, INK),
                      ("N", formula_font, GOLD), (" × ", formula_font, INK),
                      ("S", formula_font, GOLD), (" + ", formula_font, INK),
                      ("d", formula_font, GREEN), (" × ", formula_font, INK),
                      ("N(N−1)/2", formula_font, ORANGE)], anchor="lm")

mixed(RX0 + 18, 288, [("第二项是 ", tiny_font, MUTED),
                      ("N²", formula_font, ORANGE),
                      ("：40 轮任务的输入约 ", tiny_font, MUTED),
                      ("1,056,000", code_small, INK)], anchor="lm")
mixed(RX0 + 18, 314, [("前缀全命中时只需 ", tiny_font, MUTED),
                      ("51,000", code_small, GREEN),
                      ("，差 ", tiny_font, MUTED), ("20 倍", tiny_font, ORANGE)], anchor="lm")

card(RX0, 342, RX1, 402, ORANGE_FILL, ORANGE, width=2)
mixed(RX0 + 16, 362, [("三个上限", card_title, ORANGE),
                      ("　名字叫字符，量的是字节", tiny_font, MUTED)], anchor="lm")
mixed(RX0 + 16, 386, [("CONTEXT_CHAR_BUDGET", code_tiny, INK), (" · ", tiny_font, DIM),
                      ("MAX_PROJECT_DOCS", code_tiny, INK), (" · ", tiny_font, DIM),
                      ("max_output", code_tiny, INK)], anchor="lm")

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 420
CARD_H = 160
CARD_W = 470
GAPX_CARD = 40
LEFT_X = (W - CARD_W * 2 - GAPX_CARD) / 2


def bottom_card(x, accent, badge, lines):
    global BOUND
    card(x, CARD_Y, x + CARD_W, CARD_Y + CARD_H, WHITE, accent, width=2, radius=12)
    tw = int(d.textlength(badge, font=card_title)) + 24
    d.rounded_rectangle((int(x + 16), CARD_Y - 14, int(x + 16 + tw), CARD_Y + 12),
                        radius=7, fill=accent)
    d.text((int(x + 16 + tw / 2), CARD_Y - 1), badge, font=card_title,
           fill=WHITE, anchor="mm")
    BOUND = x + CARD_W - 14
    yy = CARD_Y + 38
    for parts in lines:
        mixed(x + 24, yy, parts, anchor="lm")
        yy += 27


bottom_card(LEFT_X, GREEN, "该省 / 不该省", [
    [("system", code_small, ORANGE), ("　提示词不省：最便宜的能力投资", tiny_font, MUTED)],
    [("schema", code_small, ORANGE), ("　工具不省：砍工具等于砍手脚", tiny_font, MUTED)],
    [("history", code_small, GOLD), ("　历史与叙述可省：用状态替代", tiny_font, MUTED)],
    [("memory", code_small, GREEN), ("　2,400 字节 ≈ 省下一整轮", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "调优清单", [
    [("messages[0]", code_small, ORANGE), ("　记忆块移出 → 3–10×", tiny_font, MUTED)],
    [("sort", code_small, GOLD), ("　工具按名字排序：跨会话一致", tiny_font, MUTED)],
    [("cached_tokens", code_small, GREEN), ("　读回来，命中率才可测", tiny_font, MUTED)],
    [("next_offset", code_small, GREEN), ("　截断给出续读：轮数 −36%", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "NanoHermes · agent/src/{agent,prompt,tools}.rs · 三个杠杆 + 五个预算常量",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 14 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 126 - 12, "副标题压住面板标题"
assert 144 < 168, "分隔线顶住左卡片"
assert 168 + 40 < 214 - 4 and 214 + 40 < 260 - 4 and 260 + 40 < 326 - 9, "左面板杠杆框重叠"
assert 326 + 9 < 354 - 8, "左面板两行说明重叠"
assert 354 + 10 < CARD_Y - 20, "左面板说明压住底部卡片"
assert 160 + 20 < 218 - 10 and 218 + 17 < 252 - 10, "右面板公式行重叠"
assert 252 + 17 < 288 - 10 and 288 + 9 < 314 - 6, "右面板算例行重叠"
assert 314 + 9 < 330 - 4, "右面板最后一行越出公式卡"
assert 342 - 8 > 330, "右侧两卡重叠"
assert 386 + 8 < 402 - 4, "右侧上限行越出卡片"
assert 402 + 10 < CARD_Y - 6, "右面板压住底部卡片"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/agent-token-economics-cover.png")
img.save("photos/agent-token-economics-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/agent-token-economics-cover.png",
            "photos/agent-token-economics-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
