# -*- coding: utf-8 -*-
"""
make_aidevops_cover.py — 「最新项目」卡片的 aidevops 封面。

960x540 webp，深色终端窗口风格。画面内容全部来自真实运行输出：
  - pip install aidevops 的安装日志（隔离 venv 实跑，逐字截取）
  - aidevops --help 的 Usage / 命令描述（逐字截取）
红线：只用 consola（ASCII 安全）；box-drawing 字符不画，用缩进文本替代。
"""

from PIL import Image, ImageDraw, ImageFont
import os

W, H = 960, 540
BG = (20, 22, 31)
BAR = (30, 33, 46)
TEXT = (214, 218, 228)
DIM = (138, 147, 166)
GREEN = (107, 203, 119)
CYAN = (126, 224, 163)
WHITE = (245, 247, 250)

FONT_DIR = "C:/Windows/Fonts"
mono = ImageFont.truetype(f"{FONT_DIR}/consola.ttf", 15)
mono_b = ImageFont.truetype(f"{FONT_DIR}/consolab.ttf", 15)
bar_font = ImageFont.truetype(f"{FONT_DIR}/msyh.ttc", 12)

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# ── 终端标题栏 ────────────────────────────────────────────────────────────────
BAR_H = 38
d.rounded_rectangle((0, 0, W, H), radius=10, fill=BAR)
d.rectangle((0, BAR_H, W, BAR_H + 1), fill=(48, 52, 68))
for i, c in enumerate(((255, 95, 86), (254, 188, 46), (40, 200, 64))):
    d.ellipse((22 + i * 22, 14, 34 + i * 22, 26), fill=c)
d.text((W / 2, BAR_H / 2), " aidevops — AI DevOps / QA Copilot 终端客户端 ", font=bar_font,
       fill=DIM, anchor="mm")

# ── 内容行 ───────────────────────────────────────────────────────────────────
LINE_H = 23
Y0 = 66
PAD_X = 44

# (类型, 文本)；类型: prompt 命令 / out 普通输出 / ok 成功 / head 小标题 / dim 暗
LINES = [
    ("prompt", "$ pip install aidevops"),
    ("out", "Collecting aidevops"),
    ("out", "  Using cached aidevops-0.2.0-py3-none-any.whl (42 kB)"),
    ("out", "Installing collected packages: aidevops"),
    ("ok", "Successfully installed aidevops-0.2.0"),
    ("blank", ""),
    ("prompt", "$ aidevops --help"),
    ("blank", ""),
    ("head", "Usage: aidevops [OPTIONS] COMMAND [ARGS]..."),
    ("dim", "Terminal client for the AI DevOps / QA Copilot API."),
    ("blank", ""),
    ("head", "Commands (0.2.0):"),
    ("out", "  explain     Walk the correlation chain for a commit."),
    ("out", "  risk        Risk score for a commit."),
    ("out", "  findings    List AI findings."),
    ("out", "  approve     Confirm a proposal and run its executor."),
    ("out", "  tui         Open the interactive terminal dashboard."),
    ("out", "  upgrade     Install the newest release from PyPI."),
]

STYLE = {
    "prompt": (WHITE, mono_b),
    "out": (TEXT, mono),
    "ok": (GREEN, mono_b),
    "head": (WHITE, mono_b),
    "dim": (DIM, mono),
}

y = Y0
for kind, text in LINES:
    if kind != "blank" and text:
        color, f = STYLE[kind]
        if kind == "prompt":
            d.text((PAD_X, y), "$", font=mono_b, fill=CYAN, anchor="lm")
            d.text((PAD_X + 16, y), text[2:], font=f, fill=color, anchor="lm")
        else:
            d.text((PAD_X, y), text, font=f, fill=color, anchor="lm")
    y += LINE_H

# 底部光标 + 来源小注
d.rectangle((PAD_X, y + 2, PAD_X + 9, y + 17), fill=GREEN)
d.text((W - 24, H - 18), "pypi.org/project/aidevops · MIT · Python >= 3.11",
       font=ImageFont.truetype(f"{FONT_DIR}/consola.ttf", 11), fill=DIM, anchor="rm")

out = "projects/aidevops.webp"
img.save(out, "WEBP", quality=90)
print("wrote", out, os.path.getsize(out), "bytes", img.size)
