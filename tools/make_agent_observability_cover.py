# -*- coding: utf-8 -*-
"""
make_agent_observability_cover.py — 【08 Agent 观测：给每个轮次记一本账】封面。

左 = 一笔账的四个字段：who / what / how_much / when。
右 = 三类错账（漏账 / 串账 / 糊涂账）+ 三处不进账的内部调用。
底部两卡 = 漏账的三处 / 七处可加固。

红线：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文与特殊符号（→ · 「」 交给中文字体）；几何自检；双份落盘。
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

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []
BOUND = W - 20

# Consolas 没有中文字形，也没有 U+3000 全角空格 —— 落进代码字体段就会渲染成方框。
CODE_FONTS = (code_small, code_mid)


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


def right_mixed(x_right, y, parts):
    assert_ascii(parts)
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    total = sum(widths)
    x = x_right - total
    assert x >= 0 and x + total <= x_right + 1, f"文字越界: y={int(y)} right={int(x + total)} bound={int(x_right)}"
    checks.append((int(y), int(x), int(total)))
    for (text, f, color), w in zip(parts, widths):
        d.text((int(x), int(y)), text, font=f, fill=color, anchor="lm")
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
d.text((W / 2, 44), "Agent 观测：给每个轮次记一本账",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("Agent 工程 08", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("UsageTotals", code_small, ORANGE), (" + ", tiny_font, ORANGE),
                  ("UiEvent::Usage", code_small, ORANGE), (" · ", tiny_font, DIM),
                  ("漏账 / 串账 / 糊涂账", tiny_font, GOLD)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 126, [("一笔账的四个字段", card_title, GREEN), ("　账本是表", tiny_font, MUTED)])
mixed(805, 126, [("三类错账", card_title, ORANGE), ("　日志答不出来", tiny_font, MUTED)])

d.line((550, 144, 550, 400), fill=BORDER, width=2)

# ── 左面板：四个字段 ─────────────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def field_box(y0, h, code, note, accent, fill):
    card(LX0, y0, LX1, y0 + h, fill, accent, width=2)
    mixed(LX0 + 18, y0 + h / 2, [(code, code_mid, accent)], anchor="lm")
    right_text(LX1 - 18, y0 + h / 2, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


field_box(168, 38, "who", "主代理 / agent-7 / 压缩 / 提炼", GREEN, GREEN_FILL)
field_box(214, 38, "what", "模型请求 / 工具 / 钩子", ORANGE, ORANGE_FILL)
field_box(260, 38, "how_much", "token / 请求数 / 毫秒", GOLD, GOLD_FILL)
field_box(306, 38, "when", "turn_id + 墙钟时间", GREEN, WHITE)

mixed(LX0, 372, [("只有 ", tiny_font, MUTED), ("who", code_small, INK),
                 (" 与 ", tiny_font, MUTED), ("how_much", code_small, INK),
                 (" 有字段，其余全缺", tiny_font, MUTED)], anchor="lm")

# ── 右面板：三类错账 + 三处不进账 ────────────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10


def wrong(y, num, name, note, accent):
    mixed(RX0, y, [(num, code_mid, accent), ("  ", tiny_font, DIM),
                   (name, card_title, INK)], anchor="lm")
    right_mixed(RX1, y, note)
    checks.append((int(y), int(RX0 + 22), int(RX1 - RX0 - 22)))


wrong(176, "1", "漏账", [("花了但没记", tiny_font, MUTED)], ORANGE)
wrong(214, "2", "串账", [("记到别人头上", tiny_font, MUTED)], GOLD)
wrong(252, "3", "糊涂账", [("记了口径不清", tiny_font, MUTED)], GREEN)

card(RX0, 282, RX1, 392, WHITE, ORANGE, width=2)
mixed(RX0 + 16, 304, [("三处内部调用不进账", card_title, ORANGE),
                      ("　都直接调 ", tiny_font, MUTED), ("llm::chat", code_small, INK)],
      anchor="lm")
for i, (code, note) in enumerate([
    ("summarize", "压缩：一次几万 token 的大请求"),
    ("distill", "提炼：每轮收尾的隐藏请求"),
    ("subagent", "委派：每个最多 40 轮"),
]):
    y = 336 + i * 22
    mixed(RX0 + 28, y, [(code, code_small, GOLD)], anchor="lm")
    right_text(RX1 - 20, y, note, tiny_font, MUTED)
checks.append((282, RX0, RX1 - RX0))

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


bottom_card(LEFT_X, GREEN, "账本该有的样子", [
    [("Usage", code_small, ORANGE), ("　cached 用 ", tiny_font, MUTED),
     ("Option<u64>", code_small, ORANGE), ("　区分未知与 0", tiny_font, MUTED)],
    [("Who", code_small, GOLD), ("　枚举：主 / 子 / 压缩 / 提炼", tiny_font, MUTED)],
    [("record", code_small, GREEN), ("　只追加，失败也留行", tiny_font, MUTED)],
    [("父账 = 自身 + 子账之和", tiny_font, INK), ("　可加性", tiny_font, MUTED)],
    [("会话文件带 meta", tiny_font, INK), ("　重启不清零", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "七处可加固", [
    [("记账移到 ", tiny_font, MUTED), ("?", code_small, INK), (" 之前　失败也有行", tiny_font, MUTED)],
    [("Usage", code_small, ORANGE), ("　加 cached / reasoning", tiny_font, MUTED)],
    [("subagent", code_small, GOLD), ("　返回 Delegation 结构", tiny_font, MUTED)],
    [("done", code_small, GREEN), (" 与 ", tiny_font, MUTED), ("error", code_small, GREEN),
     ("　都带 total_usage", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "NanoHermes · agent/src/{llm,agent,ui}.rs · 三个标量 + 五类错账",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 14 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 126 - 12, "副标题压住面板标题"
assert 144 < 168, "分隔线顶住左卡片"
assert 168 + 38 < 214 - 4 and 214 + 38 < 260 - 4 and 260 + 38 < 306 - 4, "左面板字段框重叠"
assert 306 + 38 < 372 - 9, "左卡片压住说明行"
assert 372 + 16 < CARD_Y - 20, "左面板内容压住底部卡片"
assert 282 + 110 < CARD_Y - 20, "右面板内容压住底部卡片"
assert 176 + 14 < 214 - 10 and 214 + 14 < 252 - 10 and 252 + 14 < 282 - 8, "右面板错账行重叠"
assert 336 + 2 * 22 + 10 < 392, "右面板调用列表越出卡片"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/agent-observability-cover.png")
img.save("photos/agent-observability-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/agent-observability-cover.png", "photos/agent-observability-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
