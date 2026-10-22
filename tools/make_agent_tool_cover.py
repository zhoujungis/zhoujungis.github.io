# -*- coding: utf-8 -*-
"""
make_agent_tool_cover.py — 【04 Agent 工具设计：为什么输出都要有上限】封面。

左 = 三层契约 + 权限闸门：build_tools / specs() / dispatch / check_tool。
右 = 封顶的四个层次：枚举前过滤 → 读取时限制 → 产出后裁剪 → 出口兜底。
底部两卡 = 十三个上限里的五个 / 三种截断语义 + 一处真实缺陷。

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
d.text((W / 2, 44), "Agent 工具设计：为什么输出都要有上限",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("Agent 工程 04", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("24 个工具 · 三层契约", tiny_font, ORANGE), (" · ", tiny_font, DIM),
                  ("clamp(s, 20_000)", code_small, GOLD)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 126, [("三层契约", card_title, GREEN), ("　拓扑 · 形状 · 预算", tiny_font, MUTED)])
mixed(805, 126, [("四层封顶", card_title, ORANGE), ("　顺序不能乱", tiny_font, MUTED)])

d.line((550, 144, 550, 400), fill=BORDER, width=2)

# ── 左面板：三层契约 ─────────────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def layer_box(y0, h, code, note, accent, fill):
    card(LX0, y0, LX1, y0 + h, fill, accent, width=2)
    mixed(LX0 + 18, y0 + 16, [(code, code_small, accent)], anchor="lm")
    right_text(LX1 - 18, y0 + 16, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


layer_box(152, 44, "build_tools", "拓扑：21 内置 + 条件性 + MCP", GREEN, GREEN_FILL)
layer_box(204, 44, "specs()", "形状：name/description/schema", ORANGE, ORANGE_FILL)
layer_box(256, 44, "dispatch", "预算：内部上限 + 出口兜底", GOLD, GOLD_FILL)
layer_box(308, 44, "check_tool", "权限：模式封禁 + 审批确认", GREEN, WHITE)

mixed(LX0, 372, [("前两层错了立刻报错", tiny_font, MUTED), ("　·　", tiny_font, DIM),
                 ("预算错了只悄悄截断", tiny_font, ORANGE)], anchor="lm")

# ── 右面板：四层封顶 ─────────────────────────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10


def step(y, num, name, note, accent):
    mixed(RX0, y, [(num, code_mid, accent), ("  ", tiny_font, DIM),
                   (name, card_title, INK)], anchor="lm")
    right_mixed(RX1, y, note)
    checks.append((int(y), int(RX0 + 22), int(RX1 - RX0 - 22)))


step(176, "1", "枚举前过滤", [("grep ", code_small, MUTED), ("跳过 1 MB 以上文件", tiny_font, MUTED)], GREEN)
step(214, "2", "读取时限制", [("read_capped ", code_small, MUTED), ("只留 256 KB", tiny_font, MUTED)], ORANGE)
step(252, "3", "产出后裁剪", [("clip ", code_small, MUTED), ("每行 240 字符", tiny_font, MUTED)], GOLD)
step(290, "4", "出口兜底", [("clamp ", code_small, MUTED), ("收到 20,000 字节", tiny_font, MUTED)], GREEN)

mixed(RX0, 340, [("四层缺一层", tiny_font, MUTED), ("　·　", tiny_font, DIM),
                 ("就有对应的资源问题", tiny_font, INK)], anchor="lm")

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


bottom_card(LEFT_X, GREEN, "五个上限 · 共十三个", [
    [("4 MB", code_small, GREEN), ("　read_file 准入门", tiny_font, MUTED)],
    [("2 MB", code_small, ORANGE), ("　web_fetch 响应体", tiny_font, MUTED)],
    [("512 KB", code_small, GOLD), ("　后台任务累计输出", tiny_font, MUTED)],
    [("256 KB", code_small, GREEN), ("　前台命令每个流", tiny_font, MUTED)],
    [("20,000", code_small, ORANGE), ("　出口 clamp 兜底字节", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "三种截断语义", [
    [("拒绝", tiny_font, INK), ("　返回 Err，模型换策略", tiny_font, MUTED)],
    [("截断加标注", tiny_font, INK), ("　clamp · clip · 捕获上限", tiny_font, MUTED)],
    [("静默丢弃", tiny_font, INK), ("　最危险：被当成没有匹配", tiny_font, ORANGE)],
    [("后台 ", tiny_font, MUTED), ("stderr", code_small, GOLD), ("　从未读走 · 会永久阻塞", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "NanoHermes · agent/src/tools/* · 三层契约 + 十三个输出上限",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 14 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 126 - 12, "副标题压住面板标题"
assert 144 < 152, "分隔线顶住左卡片"
assert 308 + 44 < 372 - 9, "左卡片压住说明行"
assert 372 + 16 < CARD_Y - 20, "左面板内容压住底部卡片"
assert 340 + 16 < CARD_Y - 20, "右面板内容压住底部卡片"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"
assert 176 + 10 < 214 - 10 and 214 + 10 < 252 - 10 and 252 + 10 < 290 - 10, "右面板步骤重叠"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/agent-tool-cover.png")
img.save("photos/agent-tool-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/agent-tool-cover.png", "photos/agent-tool-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
