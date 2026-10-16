# -*- coding: utf-8 -*-
"""
make_aidevops_arch_cover.py — aidevops 文章的技术架构封面（第二版）。

第一版封面直接用了首页项目卡片那张终端截图，用户指出「封面和下面的重复了」。
这一版换成架构图：需求→代码→测试→Bug→发布五节点汇入服务端三层
（摄取 / 关联 / 风险），右侧终端客户端，底部三张要点卡片。
封面文件名不变（aidevops-cover.png），发布脚本无需改 cover URL。
红线：中英混排逐段绘制（consola 无中文字形，中文一律 msyh）；坐标 int()；
底部小注不超 900px。
"""

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1100, 620
BG = (247, 246, 242)
INK = (31, 42, 36)
MUTED = (101, 113, 104)
BORDER = (195, 201, 194)
GREEN = (63, 107, 87)
GREEN_FILL = (238, 245, 241)
ORANGE = (164, 95, 69)
ORANGE_FILL = (248, 236, 230)
GOLD = (194, 135, 47)
GOLD_FILL = (253, 243, 227)
RED = (179, 69, 47)
RED_FILL = (249, 236, 232)
DIM = (154, 163, 156)
WHITE = (255, 255, 255)

FONT_DIR = "C:/Windows/Fonts"


def font(name, size):
    return ImageFont.truetype(f"{FONT_DIR}/{name}", size)


def auto(text, size, bold=False):
    """含中文用 msyh，纯 ASCII 用 consola（consola 没有中文字形）。"""
    name = "msyhbd.ttc" if bold else "msyh.ttc"
    if all(ord(c) < 0x2E80 for c in text):
        name = "consolab.ttf" if bold else "consola.ttf"
    return font(name, size)


title_font = font("msyhbd.ttc", 30)
tiny_font = font("msyh.ttc", 14)
mini_font = font("msyh.ttf" if False else "msyh.ttc", 13)
card_title = font("msyhbd.ttc", 16)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)


def mixed(cx, cy, parts, anchor="mm"):
    if anchor == "mm":
        total = sum(d.textlength(t, font=f) for t, f, _ in parts)
        x = cx - total / 2
    else:
        x = cx
    for text, f, color in parts:
        d.text((int(x), cy), text, font=f, fill=color, anchor="lm")
        x += d.textlength(text, font=f)


# ── 标题 ─────────────────────────────────────────────────────────────────────
mixed(W / 2, 46, [
    ("AI DevOps / QA Copilot", auto("AI DevOps / QA Copilot", 30, True), INK),
])
mixed(W / 2, 84, [
    ("技术拆解", auto("技术拆解", 16, True), MUTED),
    ("  研发数据关联 · 可解释风险 · AI 确认流", auto("  研发数据关联 · 可解释风险 · AI 确认流", 14), MUTED),
])
mixed(W / 2, 126, [("aidevops", card_title, GREEN),
                   ("  PyPI 0.2.0 · MIT · Python ≥ 3.11 · 终端客户端", tiny_font, MUTED)])

# ── 第一层：五节点链路 ───────────────────────────────────────────────────────
NODES = ["需求", "代码", "测试", "Bug", "发布"]
NODE_W = 148
NODE_H = 46
NODE_GAP = 26
ROW_W = len(NODES) * NODE_W + (len(NODES) - 1) * NODE_GAP
NX = int((W - ROW_W) / 2)
NY = 168
for i, name in enumerate(NODES):
    x = NX + i * (NODE_W + NODE_GAP)
    d.rounded_rectangle((x, NY, x + NODE_W, NY + NODE_H), radius=9, fill=WHITE, outline=GREEN, width=2)
    mixed(x + NODE_W / 2, NY + NODE_H / 2, [(name, font("msyhbd.ttf" if False else "msyhbd.ttc", 16), GREEN)])

# ── 汇聚箭头 ─────────────────────────────────────────────────────────────────
d.text((W / 2, 236), "▼", font=font("msyh.ttc", 18), fill=DIM, anchor="mm")
mixed(W / 2, 260, [("服务端", auto("服务端", 14, True), MUTED),
                   ("  Django + PostgreSQL + Redis + pgvector（后端，不在 PyPI 包里）", tiny_font, MUTED)])

# ── 第二层：服务端三层 + 终端客户端 ───────────────────────────────────────────
BODY_Y = 282
BODY_H = 132
LAYER_W = 316
LAYER_X = [48, 48 + LAYER_W + 16, 48 + (LAYER_W + 16) * 2]
LAYERS = [
    ("摄取层", ["GitHub REST 双游标同步", "Webhook HMAC-SHA256 验签", "delivery_id 幂等 + Celery 兜底"], GREEN),
    ("关联引擎", ["模块归属三级：覆盖规则 > 源根推断 > 兜底", "explain <sha>：需求 / 模块 / 回归候选", "data_gaps：显式区分没数据与没发现"], ORANGE),
    ("风险引擎", ["10 个信号逐条贡献分解", "贡献之和精确等于分数", "权重三级继承：系统 / 组织 / 项目"], GOLD),
]
for (title, lines, accent), lx in zip(LAYERS, LAYER_X):
    d.rounded_rectangle((lx, BODY_Y, lx + LAYER_W, BODY_Y + BODY_H), radius=10,
                        fill=WHITE, outline=accent, width=2)
    d.rounded_rectangle((lx + 14, BODY_Y - 13, lx + 14 + int(d.textlength(title, font=card_title)) + 22, BODY_Y + 11),
                        radius=7, fill=accent)
    d.text((lx + 14 + (int(d.textlength(title, font=card_title)) + 22) / 2, BODY_Y - 1),
           title, font=card_title, fill=WHITE, anchor="mm")
    yy = BODY_Y + 24
    for line in lines:
        mixed(lx + 14, yy, [("· ", auto("· ", 13, True), accent), (line, mini_font, MUTED)], anchor="lm")
        yy += 32

# ── 第三层：AI 与确认流横条 ──────────────────────────────────────────────────
FLOW_Y = BODY_Y + BODY_H + 22
FLOW_H = 66
d.rounded_rectangle((48, FLOW_Y, W - 48, FLOW_Y + FLOW_H), radius=10,
                    fill=ORANGE_FILL, outline=ORANGE, width=2)
STEPS = [
    ("5 个 Agent", GREEN),
    ("13 个只读工具", GOLD),
    ("证据校验：引用必须解析回真实数据", ORANGE),
    ("approve / reject 确认流", RED),
    ("Executor 执行 + AuditLog", GREEN),
]
# 按实测宽度流式排布：固定槽位会让长文字（证据校验…）挤进下一步
step_fonts = [auto(t, 14, True) for t, _ in STEPS]
ARROW_W = 22
total_w = sum(d.textlength(t, font=f) for (t, _), f in zip(STEPS, step_fonts)) \
    + (len(STEPS) - 1) * ARROW_W
fx = 48 + (W - 96 - total_w) / 2
for i, ((text, color), f) in enumerate(zip(STEPS, step_fonts)):
    d.text((int(fx), FLOW_Y + 22), text, font=f, fill=color, anchor="lm")
    fx += d.textlength(text, font=f)
    if i < len(STEPS) - 1:
        d.text((int(fx + ARROW_W / 2), FLOW_Y + 22), "→", font=font("msyhbd.ttc", 15), fill=DIM, anchor="mm")
        fx += ARROW_W
mixed(W / 2, FLOW_Y + 48, [("未确认 = 零写入；多租户：租户 id 只从 URL 取，非成员 404 / 角色不足 403，查询走 scoped_queryset 唯一入口", mini_font, MUTED)])

# ── 底部：终端客户端条 ───────────────────────────────────────────────────────
CLI_Y = FLOW_Y + FLOW_H + 18
CLI_H = 44
d.rounded_rectangle((48, CLI_Y, W - 48, CLI_Y + CLI_H), radius=10, fill=(20, 22, 31))
mixed(72, CLI_Y + CLI_H / 2, [
    ("$", auto("$", 15, True), GREEN),
    (" pipx install aidevops", auto(" pipx install aidevops", 15, True), (230, 234, 240)),
    ("    Typer · Textual · Rich · httpx · Python ≥ 3.11", auto("  · Typer · Textual · Rich · httpx", 13), (150, 158, 168)),
])

d.text((W / 2, 596), "aidevops 只是客户端：HTTP 调用服务端 /api/v1，Git 凭据与模型 Key 存服务端并 Fernet 加密，令牌本地权限 0600",
       font=tiny_font, fill=MUTED, anchor="mm")

for out in ("frontend/public/photos/aidevops-cover.png", "photos/aidevops-cover.png"):
    img.save(out)
    print("wrote", out, os.path.getsize(out), "bytes")
