# -*- coding: utf-8 -*-
"""
make_agent_loop_cover.py — 【01 Agent 的本质：一个两百行的循环】封面。

构图沿用站点封面骨架（左右两面板 + 中间分隔线 + 底部两卡）。
左 = 一个用户轮次的四步流水：user → complete → execute → role=tool。
右 = 循环里的五个默认数字：40 / 120k / 10 / 4 / 20k。
底部两卡 = 四个循环变量 / 三条历史不变量。

红线：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
Consolas 不画中文与符号（→ · 「」 —— 交给中文字体）；几何自检；双份落盘。
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
    """逐段绘制：中文/符号与等宽代码各自用自己的字体。"""
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
d.text((W / 2, 44), "Agent 的本质：一个两百行的循环",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("Agent 工程 01", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("模型 + 工具 + 循环", tiny_font, ORANGE),
                  (" · ", tiny_font, DIM),
                  ("Agent::run 109 ", code_small, GOLD),
                  ("行", tiny_font, GOLD),
                  ("　——　后面的上下文、记忆、并发都挂在这里", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 128, [("一个用户轮次", card_title, GREEN), ("　四步流水", tiny_font, MUTED)])
mixed(805, 128, [("循环里的数字", card_title, ORANGE), ("　默认配置", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 146, 550, 390), fill=BORDER, width=2)

# ── 左面板：四步流水 ─────────────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def step_box(y0, code, note, accent, fill):
    h = 42
    card(LX0, y0, LX1, y0 + h, fill, accent, width=2)
    mixed(LX0 + 20, y0 + h / 2, [(code, code_small, accent)], anchor="lm")
    right_text(LX1 - 20, y0 + h / 2, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


step_box(158, "user(content)", "检索记忆 · 入历史", GREEN, GREEN_FILL)
step_box(214, "complete()", "一次模型往返", ORANGE, WHITE)
step_box(270, "execute()", "权限 · 参数 · 钩子", GOLD, WHITE)
step_box(326, "role=tool", "tool_call_id 配对", GREEN, WHITE)

mixed(LX0, 378, [("没有 ", tiny_font, MUTED), ("tool_calls", code_small, INK),
                 (" → completed = true → 退出循环", tiny_font, MUTED)], anchor="lm")

# ── 右面板：五个默认数字 ─────────────────────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10

rows = [
    ("40", "max_iterations", "模型往返上限，不是工具调用次数", GREEN),
    ("120k", "CONTEXT_CHAR_BUDGET", "上下文字符预算，超了就压缩", ORANGE),
    ("10", "KEEP_RECENT", "压缩时永远保留的最近消息条数", GOLD),
    ("4", "MAX_PARALLEL_SUBAGENTS", "子代理并发门的上限", GREEN),
    ("20k", "max_output", "单个工具结果回灌字符上限", ORANGE),
]

y = 164
for number, name, note, accent in rows:
    d.text((int(RX0 + 6), int(y)), number, font=number_font, fill=accent, anchor="lm")
    checks.append((int(y), int(RX0 + 6), int(d.textlength(number, font=number_font))))
    mixed(RX0 + 78, y - 8, [(name, code_small, INK)], anchor="lm")
    mixed(RX0 + 78, y + 12, [(note, tiny_font, MUTED)], anchor="lm")
    y += 42

mixed(RX0, 378, [("三个出口：", tiny_font, MUTED), ("completed", code_small, GREEN),
                 (" · ", tiny_font, DIM), ("interrupted", code_small, ORANGE),
                 (" · ", tiny_font, DIM), ("max_iterations", code_small, GOLD)], anchor="lm")

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
    yy = CARD_Y + 42
    for parts in lines:
        mixed(x + 24, yy, parts, anchor="lm")
        yy += 30


bottom_card(LEFT_X, GREEN, "四个循环变量", [
    [("completed", code_small, GREEN), ("　模型不再调用工具", tiny_font, MUTED)],
    [("interrupted", code_small, GREEN), ("　Ctrl-C 只在步骤边界生效", tiny_font, MUTED)],
    [("had_tools", code_small, GREEN), ("　决定这一轮是否沉淀记忆", tiny_font, MUTED)],
    [("final_text", code_small, GREEN), ("　每轮覆盖，返回最后一条文本", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "三条历史不变量", [
    [("配对", tiny_font, INK), ("　assistant 的每个调用都有 tool 结果", tiny_font, MUTED)],
    [("锚点", tiny_font, INK), ("　每条结果都带 tool_call_id", tiny_font, MUTED)],
    [("切点", tiny_font, INK), ("　压缩不落在 tool 消息中间", tiny_font, MUTED)],
    [("顺序", tiny_font, INK), ("　并发执行，但结果按请求顺序回填", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "NanoHermes · agent/src/agent.rs · Rust 2021 · 无 async 运行时 · 阻塞 ureq + 作用域线程",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 14 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 128 - 12, "副标题压住面板标题"
assert 146 < 158, "分隔线顶住左卡片"
assert 326 + 42 < 384 - 9, "左卡片压住说明行"
assert 378 + 16 < CARD_Y - 20, "左面板内容压住底部卡片"
assert 364 + 16 < CARD_Y - 20, "右面板内容压住底部卡片"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/agent-loop-cover.png")
img.save("photos/agent-loop-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/agent-loop-cover.png", "photos/agent-loop-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
