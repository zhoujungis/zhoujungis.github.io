# -*- coding: utf-8 -*-
"""
make_agent_context_cover.py — 【02 Agent 上下文：留什么，丢什么】封面。

左 = 窗口的四段预算：system+AGENTS.md / memory block / recent 10 / 旧历史摘要。
右 = 压缩前 → 压缩后的两段条形：旧历史被 300 词摘要替换，最近 10 条原样保留。
底部两卡 = 该留的五类信息 / 该丢的四类内容。

红线：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文与符号（→ · ≤ 「」 交给中文字体）；几何自检；双份落盘。
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
number_font = font("consola.ttf", 26)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []
BOUND = W - 20


def mixed(cx, cy, parts, anchor="mm"):
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
    w = d.textlength(text, font=f)
    d.text((int(x_right - w), int(y)), text, font=f, fill=color, anchor="lm")
    checks.append((int(y), int(x_right - w), int(w)))


def card(x0, y0, x1, y1, fill, outline, width=2, radius=10):
    d.rounded_rectangle((int(x0), int(y0), int(x1), int(y1)), radius=radius,
                        fill=fill, outline=outline, width=width)


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 44), "Agent 上下文：留什么，丢什么",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("Agent 工程 02", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("窗口是稀缺资源", tiny_font, ORANGE), (" · ", tiny_font, DIM),
                  ("CONTEXT_CHAR_BUDGET = 120_000", code_small, GOLD)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 126, [("窗口里装了什么", card_title, GREEN), ("　四层预算", tiny_font, MUTED)])
mixed(805, 126, [("压缩怎么切", card_title, ORANGE), ("　先摘要，再留最近 10 条", tiny_font, MUTED)])

d.line((550, 144, 550, 392), fill=BORDER, width=2)

# ── 左面板：四段预算 ─────────────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def budget_box(y0, h, code, note, accent, fill):
    card(LX0, y0, LX1, y0 + h, fill, accent, width=2)
    mixed(LX0 + 18, y0 + 16, [(code, code_small, accent)], anchor="lm")
    right_text(LX1 - 18, y0 + 16, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


budget_box(152, 42, "system + AGENTS.md", "≤ 20,000 字符", GREEN, GREEN_FILL)
budget_box(200, 40, "memory block", "≤ 2,400 字符 · 4 条", GOLD, GOLD_FILL)

card(LX0, 246, LX1, 318, ORANGE_FILL, ORANGE, width=2)
d.text((int(LX0 + 18), int(262)), "10", font=number_font, fill=ORANGE, anchor="lm")
checks.append((262, int(LX0 + 18), int(d.textlength("10", font=number_font))))
mixed(LX0 + 62, 256, [("recent messages", code_small, INK)], anchor="lm")
mixed(LX0 + 62, 278, [("原样保留，保证最近一次工具往返", tiny_font, MUTED)], anchor="lm")

budget_box(324, 48, "older messages", "→ 300 词摘要", GREEN, WHITE)

mixed(LX0, 382, [("4 MB", code_small, GREEN), (" 拒读  →  ", tiny_font, MUTED),
                 ("20k", code_small, ORANGE), (" 截断  →  ", tiny_font, MUTED),
                 ("2.4k", code_small, GOLD), (" 注入  →  ", tiny_font, MUTED),
                 ("120k", code_small, GREEN), (" 压缩", tiny_font, MUTED)], anchor="lm")

# ── 右面板：压缩前 → 压缩后 ──────────────────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10


def bar(x0, y0, x1, y1, fill, outline, label_parts):
    card(x0, y0, x1, y1, fill, outline, width=2, radius=7)
    mixed(x0 + 12, (y0 + y1) / 2, label_parts, anchor="lm")
    checks.append((int(y0), int(x0), int(x1 - x0)))


mixed(RX0, 158, [("压缩前", tiny_font, MUTED)], anchor="lm")
bar(RX0, 170, RX1, 198, ORANGE_FILL, ORANGE,
    [("旧历史 ", tiny_font, MUTED), ("1 .. n-10", code_small, ORANGE),
     ("　＋　最近 10 条", tiny_font, MUTED)])

mixed(RX0, 218, [("summarize", code_small, GREEN), ("　一次非流式、无工具的模型请求", tiny_font, MUTED)], anchor="lm")
d.line((RX0 + 18, 238, RX0 + 18, 256), fill=GREEN, width=3)
d.polygon([(RX0 + 12, 256), (RX0 + 24, 256), (RX0 + 18, 264)], fill=GREEN)

mixed(RX0, 282, [("压缩后", tiny_font, MUTED)], anchor="lm")
bar(RX0, 294, RX1, 322, GREEN_FILL, GREEN,
    [("system", code_small, GREEN), (" + ", tiny_font, DIM),
     ("summary", code_small, ORANGE), (" + ", tiny_font, DIM),
     ("最近 10 条", tiny_font, MUTED)])

mixed(RX0, 344, [("切点规则：", tiny_font, MUTED), ("while role == \"tool\" { start += 1 }", code_small, INK)], anchor="lm")
mixed(RX0, 364, [("摘要 ≤ 300 词　·　保留目标 / 决策 / 路径 / 当前状态", tiny_font, MUTED)], anchor="lm")

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


bottom_card(LEFT_X, GREEN, "该留的五类信息", [
    [("目标与约束", tiny_font, INK), ("　要什么、不许做什么、验收标准", tiny_font, MUTED)],
    [("关键决策", tiny_font, INK), ("　选了什么，否决了什么，为什么", tiny_font, MUTED)],
    [("改动路径", tiny_font, INK), ("　改过哪些文件，新增了哪些文件", tiny_font, MUTED)],
    [("失败尝试", tiny_font, INK), ("　哪条路走不通，报了什么错", tiny_font, MUTED)],
    [("当前状态", tiny_font, INK), ("　做到哪一步，下一步做什么", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "该丢的四类内容", [
    [("重复寒暄", tiny_font, INK), ("　「好的」「收到」「继续」不含决策", tiny_font, MUTED)],
    [("完整文件内容", tiny_font, INK), ("　磁盘上有，需要时再读", tiny_font, MUTED)],
    [("成功命令长输出", tiny_font, INK), ("　退出码 0 时通常只是过程", tiny_font, MUTED)],
    [("已摘要中间步骤", tiny_font, INK), ("　摘要已保留结论，细节可丢", tiny_font, MUTED)],
    [("截断必须留痕", tiny_font, ORANGE), ("　静默截断比不截断更危险", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "NanoHermes · agent/src/agent.rs · compact_with / summarize_messages · 120_000 字符预算",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 14 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 126 - 12, "副标题压住面板标题"
assert 144 < 152, "分隔线顶住左卡片"
assert 324 + 48 < 386 - 9, "左卡片压住预算说明行"
assert 382 + 16 < CARD_Y - 20, "左面板内容压住底部卡片"
assert 364 + 16 < CARD_Y - 20, "右面板内容压住底部卡片"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/agent-context-cover.png")
img.save("photos/agent-context-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/agent-context-cover.png", "photos/agent-context-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
