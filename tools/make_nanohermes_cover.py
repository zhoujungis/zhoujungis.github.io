# -*- coding: utf-8 -*-
"""
make_nanohermes_cover.py — 【NanoHermes 拆解】的封面。

构图：沿用站点封面骨架（左右两面板 + 中间分隔线 + 底部两卡）。
左 = 同一套 agent 的三种形态卡片（CLI / 桌面 / daemon）+ 依赖与 release profile 两行说明。
右 = 一个用户轮次的流程：run() → 检索记忆 → complete() / execute() → 并发工具 → compact()。
下面两张卡片：三条约束纲领 / 四套机制。

红线（站点 SKILL）：中英混排逐段绘制；不用 anchor="rm"；坐标/宽度 int()；
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

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

checks = []
# 当前绘制区域的右边界；mixed/right_text 会断言文字不越界（触到卡片描边会很难看）。
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
d.text((W / 2, 44), "NanoHermes：不养 async 运行时的 Rust 编码 Agent",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("阻塞 HTTP", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("三个依赖 crate", tiny_font, ORANGE), (" · ", tiny_font, DIM),
                  ("一切输出有上限", tiny_font, GOLD),
                  ("　——　同一套 agent 的三种形态", tiny_font, MUTED)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 128, [("三种形态", card_title, GREEN), ("　一个 agent crate", tiny_font, MUTED)])
mixed(805, 128, [("一个用户轮次", card_title, ORANGE), ("　Agent::run", tiny_font, MUTED)])

# ── 分隔线 ───────────────────────────────────────────────────────────────────
d.line((550, 146, 550, 334), fill=BORDER, width=2)

# ── 左面板：三种形态卡片 ──────────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def form_card(y0, name, host, accent):
    h = 46
    card(LX0, y0, LX1, y0 + h, WHITE, accent, width=2)
    d.text((int(LX0 + 20), int(y0 + h / 2)), name, font=code_small,
           fill=INK, anchor="lm")
    right_text(LX1 - 20, y0 + h / 2, host, tiny_font, accent)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


form_card(158, "agent", "CLI / REPL / stdin", GREEN)
form_card(212, "NanoHermes", "Tauri 桌面四栏", ORANGE)
form_card(266, "agent --daemon", "HTTP 服务 / systemd", GOLD)

mixed(LX0, 334, [("依赖只有三个：", tiny_font, MUTED),
                 ("serde_json", code_small, GREEN),
                 (" · ", tiny_font, DIM),
                 ("ureq", code_small, GREEN),
                 (" · ", tiny_font, DIM),
                 ("base64", code_small, GREEN)], anchor="lm")
mixed(LX0, 356, [("release：", tiny_font, MUTED),
                 ("opt-level=z · lto · strip · panic=abort", code_small, GREEN)],
      anchor="lm")

# ── 右面板：一个用户轮次 ─────────────────────────────────────────────────────
RX0, RX1 = 570, 1040
MIDX = 805
GAPX = 18
BOUND = RX1 - 10

card(RX0, 158, RX1, 200, GREEN_FILL, GREEN, width=2)
mixed((RX0 + RX1) / 2, 179, [("Agent::run(content)", code_small, GREEN),
                             ("　检索记忆 · 换注入块", tiny_font, MUTED)])

mixed(RX0, 214, [("每轮重检索、按标记整体替换，不随轮次累积", tiny_font, MUTED)],
      anchor="lm")

card(RX0, 236, MIDX - GAPX, 300, WHITE, ORANGE, width=2)
mixed((RX0 + MIDX - GAPX) / 2, 256, [("complete()", code_small, ORANGE)])
mixed((RX0 + MIDX - GAPX) / 2, 280, [("一次模型往返", tiny_font, MUTED),
                                     ("　流式", tiny_font, DIM)])

card(MIDX + GAPX, 236, RX1, 300, WHITE, ORANGE, width=2)
mixed((MIDX + GAPX + RX1) / 2, 256, [("execute()", code_small, ORANGE)])
mixed((MIDX + GAPX + RX1) / 2, 280, [("19 内置工具", tiny_font, MUTED),
                                     ("　MCP 分发", tiny_font, DIM)])

mixed(RX0, 318, [("多 ", tiny_font, MUTED),
                 ("tool_calls", code_small, INK),
                 (" → 线程并发 → 按序 ", tiny_font, MUTED),
                 ("zip", code_small, INK)], anchor="lm")

mixed(RX0, 342, [("compact()", code_small, INK),
                 (" 12 万字符 · 留最近 10 条 → 摘要", tiny_font, MUTED)],
      anchor="lm")

# ── 底部卡片 ─────────────────────────────────────────────────────────────────
CARD_Y = 404
CARD_H = 176
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
    y = CARD_Y + 44
    for parts in lines:
        mixed(x + 24, y, parts, anchor="lm")
        y += 40


bottom_card(LEFT_X, GREEN, "约束纲领", [
    [("没有 ", tiny_font, INK), ("async", code_small, GREEN),
     (" 运行时　", tiny_font, INK), ("阻塞 ureq + 作用域线程", tiny_font, MUTED)],
    [("依赖只有三个　", tiny_font, INK), ("serde_json · ureq · base64", code_small, GREEN)],
    [("不依赖 ", tiny_font, INK), ("libc", code_small, GOLD),
     ("　", tiny_font, INK), ("裸系统调用 shim 自己写", tiny_font, MUTED)],
    [("输出全部有上限　", tiny_font, INK), ("工具 20 KB · 命令每路 256 KB", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "四套机制", [
    [("长期记忆　", tiny_font, INK), ("BM25 + 中文二元切分，零嵌入服务", tiny_font, MUTED)],
    [("安全　", tiny_font, INK), ("Landlock 沙箱 + 三级审批", tiny_font, MUTED)],
    [("可扩展　", tiny_font, INK), ("MCP 双传输 · Skills · 子代理", tiny_font, MUTED)],
    [("中断　", tiny_font, INK), ("Ctrl-C 标志位 · /undo 回退", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "仓库 NanoHermes · Rust 2021 · opt-level=z · lto · strip · panic=abort · 前端 React 19 + Vite",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 14 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 128 - 12, "副标题压住面板标题"
assert 146 < 158, "分隔线顶住左卡片"
assert 266 + 46 < 334 - 9, "左卡片压住说明行"
assert 356 + 16 < CARD_Y - 20, "左面板内容压住底部卡片"
assert 342 + 16 < CARD_Y - 20, "右面板内容压住底部卡片"
assert RX1 - RX0 == CARD_W, "右面板宽度与卡片不一致（视觉不齐）"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/nanohermes-cover.png")
img.save("photos/nanohermes-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/nanohermes-cover.png", "photos/nanohermes-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
