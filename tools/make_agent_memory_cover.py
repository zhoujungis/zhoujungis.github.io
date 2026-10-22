# -*- coding: utf-8 -*-
"""
make_agent_memory_cover.py — 【03 Agent 记忆：不接向量库也能长期记忆】封面。

左 = 写入的两条路径：自动提炼 / 主动保存 → 归一化去重 → memory.json。
右 = 读取的四步：tokenize → BM25 → top 4 → render_block(≤2400) → 注入块。
底部两卡 = 四类记忆与淘汰顺位 / 四个上限。

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
d.text((W / 2, 44), "Agent 记忆：不接向量库也能长期记忆",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("Agent 工程 03", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("一个 JSON 文件 + 本地 BM25", tiny_font, ORANGE), (" · ", tiny_font, DIM),
                  ("MAX_ENTRIES = 500", code_small, GOLD)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 126, [("写：两条路径", card_title, GREEN), ("　自动 + 主动", tiny_font, MUTED)])
mixed(805, 126, [("读：四步检索", card_title, ORANGE), ("　4 条 · 2,400 字符", tiny_font, MUTED)])

d.line((550, 144, 550, 400), fill=BORDER, width=2)

# ── 左面板：写入链路 ─────────────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def write_box(y0, h, code, note, accent, fill):
    card(LX0, y0, LX1, y0 + h, fill, accent, width=2)
    mixed(LX0 + 18, y0 + 16, [(code, code_small, accent)], anchor="lm")
    right_text(LX1 - 18, y0 + 16, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


write_box(152, 44, "auto distill", "轮次结束 · 1 次模型调用", GREEN, GREEN_FILL)
write_box(204, 44, "memory_save", "模型主动写入", ORANGE, ORANGE_FILL)
write_box(256, 44, "normalize + dedupe", "12 字节包含判定", GOLD, GOLD_FILL)
write_box(308, 44, "memory.json", "≤ 500 条 · 每条 400 字", GREEN, WHITE)

mixed(LX0, 372, [("同一文件", tiny_font, MUTED), ("　·　", tiny_font, DIM),
                 ("无服务", tiny_font, MUTED), ("　·　", tiny_font, DIM),
                 ("无 ", tiny_font, MUTED), ("embedding", code_small, GREEN)], anchor="lm")

# ── 右面板：读取链路 ─────────────────────────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10


def step(y, num, name, note, accent):
    mixed(RX0, y, [(num, code_mid, accent), ("  ", tiny_font, DIM),
                   (name, code_small, INK)], anchor="lm")
    right_text(RX1, y, note, tiny_font, MUTED)
    checks.append((int(y), int(RX0 + 22), int(RX1 - RX0 - 22)))


step(176, "1", "tokenize", "ASCII 词 + CJK 二元", GREEN)
step(214, "2", "search (BM25)", "k1 = 1.2 · b = 0.75", ORANGE)
step(252, "3", "top_k = 4", "零分过滤", GOLD)
step(290, "4", "render_block", "≤ 2,400 字符", GREEN)

mixed(RX0, 340, [("=== Long-term memory ... ===", code_small, INK)], anchor="lm")
mixed(RX0, 364, [("整体替换", tiny_font, MUTED), ("　·　", tiny_font, DIM),
                 ("不随轮次累加", tiny_font, MUTED)], anchor="lm")

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


bottom_card(LEFT_X, GREEN, "四类记忆 · 淘汰顺位", [
    [("偏好", tiny_font, INK), ("　顺位 0 · 最后淘汰", tiny_font, MUTED)],
    [("纠正", tiny_font, INK), ("　顺位 1", tiny_font, MUTED)],
    [("经验", tiny_font, INK), ("　顺位 2", tiny_font, MUTED)],
    [("事实", tiny_font, INK), ("　顺位 3 · 最先淘汰", tiny_font, MUTED)],
    [("数字越大", tiny_font, ORANGE), ("　越先被丢（实现按 ts 取了最新）", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "四个上限", [
    [("500", code_small, ORANGE), (" 条 · MAX_ENTRIES", tiny_font, MUTED)],
    [("400", code_small, GREEN), (" 字 · MAX_TEXT", tiny_font, MUTED)],
    [("4", code_small, GOLD), (" 条/轮 · INJECT_TOP_K", tiny_font, MUTED)],
    [("2,400", code_small, ORANGE), (" 字符/轮 · INJECT_CHAR_BUDGET", tiny_font, MUTED)],
    [("6000", code_small, GREEN), (" 字符摘录 · 每条截 1200", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "NanoHermes · agent/src/memory.rs · BM25 + CJK bigram · 无向量库",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 14 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 126 - 12, "副标题压住面板标题"
assert 144 < 152, "分隔线顶住左卡片"
assert 308 + 44 < 372 - 9, "左卡片压住说明行"
assert 372 + 16 < CARD_Y - 20, "左面板内容压住底部卡片"
assert 364 + 16 < CARD_Y - 20, "右面板内容压住底部卡片"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"
assert 176 + 10 < 214 - 10 and 214 + 10 < 252 - 10 and 252 + 10 < 290 - 10, "右面板步骤重叠"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/agent-memory-cover.png")
img.save("photos/agent-memory-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/agent-memory-cover.png", "photos/agent-memory-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
