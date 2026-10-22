# -*- coding: utf-8 -*-
"""
make_agent_concurrency_cover.py — 【05 Agent 并发：不用 async 运行时怎么并行】封面。

左 = 并发的四个层次：thread::scope / Gate::new(4) / read_capped×2 / incoming()。
右 = 六个数字：4 / 40 / 120 / 500 / 60 / 1。
底部两卡 = 七个可修的缺陷 / 为什么不用 async 的四条理由。

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


def right_mixed(x_right, y, parts):
    widths = [d.textlength(t, font=f) for t, f, _ in parts]
    total = sum(widths)
    x = x_right - total
    assert x >= 0 and x + total <= x_right + 1, f"文字越界: y={int(y)} right={int(x + total)} bound={int(x_right)}"
    checks.append((int(y), int(x), int(total)))
    for (text, f, color), w in zip(parts, widths):
        d.text((int(x), int(y)), text, font=f, fill=color, anchor="lm")
        x += w
    return x


def card(x0, y0, x1, y1, fill, outline, width=2, radius=10):
    d.rounded_rectangle((int(x0), int(y0), int(x1), int(y1)), radius=radius,
                        fill=fill, outline=outline, width=width)


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 44), "Agent 并发：不用 async 运行时怎么并行",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("Agent 工程 05", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("thread::scope + Gate", code_small, ORANGE), (" · ", tiny_font, DIM),
                  ("四个层次", tiny_font, GOLD)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 126, [("并发的四个层次", card_title, GREEN), ("　并发度各不相同", tiny_font, MUTED)])
mixed(805, 126, [("六个数字", card_title, ORANGE), ("　真实取值", tiny_font, MUTED)])

d.line((550, 144, 550, 400), fill=BORDER, width=2)

# ── 左面板：并发的四个层次 ───────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def layer_box(y0, h, code, note, accent, fill):
    card(LX0, y0, LX1, y0 + h, fill, accent, width=2)
    mixed(LX0 + 18, y0 + 16, [(code, code_small, accent)], anchor="lm")
    right_text(LX1 - 18, y0 + 16, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


layer_box(152, 44, "thread::scope", "工具级：调用几个起几个", GREEN, GREEN_FILL)
layer_box(204, 44, "Gate::new(4)", "子代理级：最多 4 个", ORANGE, ORANGE_FILL)
layer_box(256, 44, "read_capped x2", "命令级：两个排空线程", GOLD, GOLD_FILL)
layer_box(308, 44, "incoming()", "进程级：同时 1 个请求", GREEN, WHITE)

mixed(LX0, 372, [("只有子代理有上限", tiny_font, MUTED), ("　·　", tiny_font, DIM),
                 ("工具线程是无界的", tiny_font, ORANGE)], anchor="lm")

# ── 右面板：六个数字 ─────────────────────────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10


def step(y, num, name, note, accent):
    mixed(RX0, y, [(num, code_mid, accent), ("  ", tiny_font, DIM),
                   (name, card_title, INK)], anchor="lm")
    right_mixed(RX1, y, note)
    checks.append((int(y), int(RX0 + 22), int(RX1 - RX0 - 22)))


step(168, "4", "子代理并发", [("Gate 计数门", tiny_font, MUTED)], GREEN)
step(196, "40", "轮次上限", [("max_iterations", code_small, MUTED)], ORANGE)
step(224, "120", "秒命令超时", [("1 - 3600 可调", tiny_font, MUTED)], GOLD)
step(252, "500", "结果预览字符", [("RESULT_PREVIEW", code_small, MUTED)], GREEN)
step(280, "60", "秒 MCP 超时", [("每次调用等待", tiny_font, MUTED)], ORANGE)
step(308, "1", "守护进程并发", [("listener 串行", tiny_font, MUTED)], GOLD)

mixed(RX0, 340, [("四层并发度不同", tiny_font, MUTED), ("　·　", tiny_font, DIM),
                 ("问题从「快不快」变成「对不对」", tiny_font, INK)], anchor="lm")

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


bottom_card(LEFT_X, GREEN, "七个可修的缺陷", [
    [("stderr", code_small, GREEN), ("　从未读走 · 任务永久卡住", tiny_font, MUTED)],
    [("task_output", code_small, ORANGE), ("　锁内阻塞读 · 冻结整表", tiny_font, MUTED)],
    [("allowed_tools", code_small, GOLD), ("　白名单不参与执行检查", tiny_font, MUTED)],
    [("中断 / 状态 / 线程数", tiny_font, INK), ("　各一处", tiny_font, MUTED)],
    [("并发审批", tiny_font, INK), ("　共用一份 ", tiny_font, MUTED), ("stdin", code_small, GOLD)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "为什么不用 async", [
    [("工具全是阻塞调用", tiny_font, INK), ("　fs / 子进程 / ureq", tiny_font, MUTED)],
    [("并发窗口天然有界", tiny_font, INK), ("　一次工具批次", tiny_font, MUTED)],
    [("join 屏障免锁", tiny_font, INK), ("　messages 只读", tiny_font, MUTED)],
    [("编译期强制 Sync", tiny_font, INK), ("　数据竞争编译不过", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "NanoHermes · agent/src/{agent,board,interrupt}.rs · 四层并发 + 七个可修缺陷",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 14 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 126 - 12, "副标题压住面板标题"
assert 144 < 152, "分隔线顶住左卡片"
assert 308 + 44 < 372 - 9, "左卡片压住说明行"
assert 372 + 16 < CARD_Y - 20, "左面板内容压住底部卡片"
assert 340 + 16 < CARD_Y - 20, "右面板内容压住底部卡片"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"
assert 168 + 12 < 196 - 9 and 196 + 12 < 224 - 9 and 224 + 12 < 252 - 9, "右面板前半步骤重叠"
assert 252 + 12 < 280 - 9 and 280 + 12 < 308 - 9 and 308 + 12 < 340 - 9, "右面板后半步骤重叠"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/agent-concurrency-cover.png")
img.save("photos/agent-concurrency-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/agent-concurrency-cover.png", "photos/agent-concurrency-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
