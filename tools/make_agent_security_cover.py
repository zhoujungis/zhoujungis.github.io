# -*- coding: utf-8 -*-
"""
make_agent_security_cover.py — 【06 Agent 安全：让它跑命令而不失控】封面。

左 = 五道闸门（按调用顺序）：build_tools / check_tool / PreToolUse /
     needs_approval / Landlock。
右 = 四个逃逸面：绝对路径 / .. 穿越 / 符号链接 / 网络。
底部两卡 = 七个单步场景全通过 / 七处可加固。

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


def right_text(x_right, y, text, f, color):
    assert_ascii([(text, f, color)])
    w = d.textlength(text, font=f)
    d.text((int(x_right - w), int(y)), text, font=f, fill=color, anchor="lm")
    checks.append((int(y), int(x_right - w), int(w)))


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


def card(x0, y0, x1, y1, fill, outline, width=2, radius=10):
    d.rounded_rectangle((int(x0), int(y0), int(x1), int(y1)), radius=radius,
                        fill=fill, outline=outline, width=width)


# ── 标题 ─────────────────────────────────────────────────────────────────────
d.text((W / 2, 44), "Agent 安全：让它跑命令而不失控",
       font=title_font, fill=INK, anchor="mm")
mixed(W / 2, 84, [("Agent 工程 06", tiny_font, GREEN), (" · ", tiny_font, DIM),
                  ("check_tool + hooks", code_small, ORANGE), (" + ", tiny_font, ORANGE),
                  ("审批", tiny_font, ORANGE), (" + ", tiny_font, ORANGE),
                  ("Landlock", code_small, ORANGE), (" · ", tiny_font, DIM),
                  ("五道闸门", tiny_font, GOLD)])

# ── 面板标题 ─────────────────────────────────────────────────────────────────
mixed(302, 126, [("五道闸门", card_title, GREEN), ("　按调用顺序", tiny_font, MUTED)])
mixed(805, 126, [("四个逃逸面", card_title, ORANGE), ("　子进程有、内置没有", tiny_font, MUTED)])

d.line((550, 144, 550, 400), fill=BORDER, width=2)

# ── 左面板：五道闸门 ─────────────────────────────────────────────────────────
LX0, LX1 = 76, 528
BOUND = LX1 - 10


def gate_box(y0, h, code, note, accent, fill):
    card(LX0, y0, LX1, y0 + h, fill, accent, width=2)
    mixed(LX0 + 18, y0 + 17, [(code, code_small, accent)], anchor="lm")
    right_text(LX1 - 18, y0 + 17, note, tiny_font, MUTED)
    checks.append((int(y0), int(LX0), int(LX1 - LX0)))


gate_box(150, 34, "build_tools", "工具清单", GREEN, GREEN_FILL)
gate_box(192, 34, "check_tool", "模式 + 黑白名单", ORANGE, ORANGE_FILL)
gate_box(234, 34, "PreToolUse", "用户钩子可否决", GOLD, GOLD_FILL)
gate_box(276, 34, "needs_approval", "危险命令问人", GREEN, WHITE)
gate_box(318, 34, "Landlock", "只限子进程", ORANGE, ORANGE_FILL)

mixed(LX0, 372, [("每道都能被绕", tiny_font, MUTED), ("　·　", tiny_font, DIM),
                 ("叠起来才成立", tiny_font, INK)], anchor="lm")

# ── 右面板：四个逃逸面 ───────────────────────────────────────────────────────
RX0, RX1 = 570, 1040
BOUND = RX1 - 10


def step(y, num, name, note, accent):
    mixed(RX0, y, [(num, code_mid, accent), ("  ", tiny_font, DIM),
                   (name, card_title, INK)], anchor="lm")
    right_mixed(RX1, y, note)
    checks.append((int(y), int(RX0 + 22), int(RX1 - RX0 - 22)))


step(176, "1", "绝对路径", [("沙箱限写 · 内置直通", tiny_font, MUTED)], GREEN)
step(214, "2", ".. 穿越", [("内核按真实路径判定", tiny_font, MUTED)], ORANGE)
step(252, "3", "符号链接", [("内核解析 · fs::write 跟随", tiny_font, MUTED)], GOLD)
step(290, "4", "网络", [("handled_access_net = 0", code_small, MUTED)], GREEN)

mixed(RX0, 340, [("沙箱只装在子进程上", tiny_font, MUTED), ("　·　", tiny_font, DIM),
                 ("内置文件工具完全够不着", tiny_font, ORANGE)], anchor="lm")

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


bottom_card(LEFT_X, GREEN, "七个场景，全部单步通过", [
    [("read_file", code_small, GREEN), ("　读走 ", tiny_font, MUTED), ("~/.ssh/id_rsa", code_small, MUTED)],
    [("write_file", code_small, ORANGE), ("　写 ", tiny_font, MUTED), ("~/.bashrc", code_small, MUTED)],
    [(".. 穿越", tiny_font, INK), ("　", tiny_font, DIM), ("../../../../etc/passwd", code_small, MUTED)],
    [("sort -o", code_small, GOLD), ("　假只读：白名单里能写盘", tiny_font, MUTED)],
    [("LD_PRELOAD", code_small, GREEN), ("　前置赋值不被检查", tiny_font, MUTED)],
])
bottom_card(LEFT_X + CARD_W + GAPX_CARD, ORANGE, "七处可加固", [
    [("resolve", code_small, GREEN), ("　加越界检查，挡住前三个", tiny_font, MUTED)],
    [("白名单加参数判定", tiny_font, INK), ("　-o / -r / -s", tiny_font, MUTED)],
    [("拒绝前置环境变量", tiny_font, INK), ("　LD_PRELOAD 那一行", tiny_font, MUTED)],
    [("auto_approve", code_small, GOLD), ("　默认改 false", tiny_font, MUTED)],
])

d.text((W / 2, H - 16),
       "NanoHermes · agent/src/{sandbox,config,hooks}.rs · 五道闸门 + 四个逃逸面",
       font=tiny_font, fill=MUTED, anchor="mm")

# ── 几何自检 ─────────────────────────────────────────────────────────────────
assert 44 + 14 < 84 - 9, "标题压住副标题"
assert 84 + 9 < 126 - 12, "副标题压住面板标题"
assert 144 < 150, "分隔线顶住左卡片"
assert 150 + 34 < 192 - 4 and 192 + 34 < 234 - 4, "左面板前半闸门重叠"
assert 234 + 34 < 276 - 4 and 276 + 34 < 318 - 4, "左面板后半闸门重叠"
assert 318 + 34 < 372 - 9, "左卡片压住说明行"
assert 372 + 16 < CARD_Y - 20, "左面板内容压住底部卡片"
assert 340 + 16 < CARD_Y - 20, "右面板内容压住底部卡片"
assert CARD_Y + CARD_H + 10 < H - 20, "底部卡片压住页脚"
assert 176 + 14 < 214 - 10 and 214 + 14 < 252 - 10 and 252 + 14 < 290 - 10, "右面板步骤重叠"

for cy, x, w in checks:
    assert x >= 0 and x + w <= W, f"横向越界: y={cy} x={x} w={w}"
    assert x + w <= 1044 or x >= 60, f"越出面板: y={cy} x={x} w={w}"

img.save("frontend/public/photos/agent-security-cover.png")
img.save("photos/agent-security-cover.png")
print(f"SELF-CHECK OK: W={W} H={H} cards_y={CARD_Y} panel_lx={LX0}-{LX1} panel_rx={RX0}-{RX1}")
for out in ("frontend/public/photos/agent-security-cover.png", "photos/agent-security-cover.png"):
    print(f"  wrote {out} ({os.path.getsize(out)} bytes)")
