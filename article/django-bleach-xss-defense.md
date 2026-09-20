---
title: "为什么我敢渲染用户的 Markdown：一条 XSS 防线"
slug: "django-bleach-xss-defense"
category_id: null
tags: ["Django", "后端", "安全", "XSS", "Markdown"]
status: "published"
cover_image: ""
---

# 为什么我敢渲染用户的 Markdown：一条 XSS 防线

> 这篇博客的后端是 Django + DRF，前端是 Vue 3。文章以 Markdown 存储在数据库里，读接口返回渲染好的 `html_content` 让前端直接展示。也就是说——**用户的 Markdown 会被我执行成 HTML**。

如果你以前只写过后台管理系统、或者只是把 Markdown 渲染当作"读个库、拼个串"的琐事，那你可能没意识到这句话意味着什么：

> 渲染用户输入，就是在执行用户代码。

这篇文章不讲虚的。我会带你走一遍我的博客从"敢渲染"到"真的安全"的完整防线，包括两段真实的攻防迭代故事——它们都写在我博客后端 `articles/models.py` 的注释里，每一个都是踩过坑换来的。

---

## 01 问题：渲染用户输入，为什么危险

先建立一个直觉。

你在数据库里存了一段文本：

```
### 你好，世界
```

前端拿到它，扔给一个 Markdown 渲染器，变成：

```html
<h3>你好，世界</h3>
```

看起来人畜无害。但如果这段文本来自**任何不可信的输入源**——比如：用户评论、用户提交的笔记、甚至"管理员粘贴进来的外部文章"——那么"渲染"这个动作，本质上就是**把你执行的权限交给了输入**。

因为 Markdown 可以写出这些东西：

```markdown
<img src=x onerror="alert(document.cookie)">
```

```markdown
[点我](javascript:alert(1))
```

```markdown
<a href="data:text/html,<script>alert(1)</script>">点我</a>
```

```markdown
<svg><a xlink:href="javascript:alert(1)"><text>点击我</text></a></svg>
```

在浏览器里，`<img onerror>` 只要图片加载失败就会执行；`javascript:` 协议点击即触发；`data:` 协议在部分浏览器里能直接携带可执行 HTML；`<svg>` 里能藏 `xlink:href` 的脚本跳转。这还只是冰山一角——`<iframe>`、`<style>`、`<object>`、`<video poster>`、`<math>`、表单伪造……攻击面多到你根本列不完。

> **关键认知：XSS 不是一个"过滤脏东西"的问题，而是一个"明确信任边界"的问题。**

你不能靠"我过滤了几个危险标签"来保证安全，因为黑名单永远是追着攻击者跑的。正确的做法是反着来：**我只允许我知道是安全的这一小撮东西，其他一律不要。** 这就是"白名单"思想。

---

## 02 第一层：Markdown → HTML 的受控渲染

我的博客文章模型长这样（`articles/models.py`，节选）：

```python
class Article(models.Model):
    content = models.TextField(verbose_name="内容 (Markdown)")
    html_content = models.TextField(blank=True, editable=False, verbose_name="HTML 内容")

    def save(self, *args, **kwargs):
        # 渲染 Markdown 为 HTML
        md = markdown.Markdown(
            extensions=[
                "fenced_code",
                "codehilite",
                "tables",
                "extra",
                "toc",
            ]
        )
        raw_html = md.convert(self.content)
        ...
```

注意几个细节：

1. **扩展是显式列出的**。`fenced_code`（围栏代码块）、`toc`（目录）、`codehilite`（代码高亮）、`tables`、`extra`（Markdown 扩展集）。没有用"加载所有扩展"，而是精确控制渲染器会产生哪些 HTML 结构——**渲染器不产出的标签，攻击者就无法借它的手产生**。
2. **这里产出的是 `raw_html`**。它现在还是"脏"的——`markdown` 库只负责把 Markdown 语法转成 HTML，**它完全不关心安全性**。`javascript:` 链接它会原样保留，`<img onerror>` 也会原样保留（因为 Markdown 允许原生 HTML 透传）。
3. **`html_content` 是 `editable=False`**。这个字段只能由 `save()` 自动生成，不能手动填——从入口上保证"数据库里存的 HTML 永远是我们渲染消毒过的，而不是谁手动塞进去的"。

所以渲染这步本身不是防线，它是**给下一层白名单消毒提供输入**。真正的安全逻辑在下面。

---

## 03 第二层：bleach 白名单消毒

核心防线在这（`articles/models.py`）：

```python
# 消毒：去掉 <script>、事件属性、javascript: URI 等
# 白名单对齐 markdown + codehilite + toc 实际会产出的结构。
self.html_content = bleach.clean(
    raw_html,
    tags=bleach.sanitizer.ALLOWED_TAGS
    | {
        "h1", "h2", "h3", "h4", "h5", "h6",
        "img", "pre", "code", "span", "div",
        "table", "thead", "tbody", "tr", "th", "td",
        "hr", "br", "sup", "sub",
        "figure", "figcaption",
    },
    attributes={
        **bleach.sanitizer.ALLOWED_ATTRIBUTES,
        "img": list(set(["src", "alt", "title", "loading", "decoding"])
                     | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("img", []))),
        "a": list(set(["href", "title", "rel", "target"])
                  | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("a", []))),
        "code": list(set(["class"])
                     | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("code", []))),
        ...
    },
    protocols=["http", "https", "mailto"],
    strip=True,
)
```

`bleach` 是 Mozilla 出品的 HTML 消毒库，OWASP 推荐的 Python 方案。这短短一个调用，做了**三层白名单**：

**① 标签白名单**

`bleach.sanitizer.ALLOWED_TAGS` 已经包含了 `a, abbr, acronym, b, blockquote, code, em, i, li, ol, strong, ul` 这些基础标签。我用 `|` 并集扩展出文章渲染需要的：`h1~h6`、`img`、`pre`、`table` 系、`figure`、`div` 等。

不在白名单里的标签——`<script>`、`<iframe>`、`<object>`、`<embed>`、`<style>`、`<svg>`、`<math>`、`<form>`、`<input>`……——**全部被干掉**。`strip=True` 的意思是：不光去掉标签本身，连标签里的内容也一起拿掉（而不是保留文本）。比如：

```
<img src=x onerror="alert(1)">
```

会被直接整段删除，而不是变成文本 `alert(1)` 残留在页面上。

**② 属性白名单**

标签允许了，但标签上的**属性**也要白名单。`<img>` 只允许 `src alt title loading decoding`；`<a>` 只允许 `href title rel target`；`<code>/<pre>/<span>/<div>` 只允许 `class`（高亮样式用）。**所有事件属性 `on*` 都不在白名单里**，所以：

```html
<img src="https://example.com/a.png" onerror="alert(1)">
```

会被洗成：

```html
<img src="https://example.com/a.png">
```

注意这里有个**很容易踩的坑**：如果直接写 `attributes={"img": ["src", "alt"]}`，会**覆盖掉 `bleach` 的默认属性**，导致 `colspan`/`rowspan` 这类表格属性被误杀。所以代码里用了 `list(set([...]) | set(bleach.sanitizer.ALLOWED_ATTRIBUTES.get("img", [])))`——**先并集再赋值，合并而不是覆盖**。这是把默认白名单当"基础包"、把自己的需求当"增量"的正确姿势。

**③ 协议白名单**

`protocols=["http", "https", "mailto"]` 是第三道闸。就算 `<a href>` 通过了标签和属性检查，`href` 里的 **协议** 还要过审：

```markdown
[点我](javascript:alert(1))
```

渲染成 `<a href="javascript:alert(1)">` 后，`bleach` 发现 `javascript:` 不在协议白名单里，**直接把这个链接的 `href` 抹掉**（留下无 href 的 `<a>` 文本）。

到这里，三层白名单已经把"能出现在 HTML 里的东西"锁死在已知安全的集合里了。

---

## 04 真实漏洞 ①：`data:` 协议绕过

你以为这就够了吗？不够。这就是我们博客踩过的第一个真实坑。

最开始的版本里，`protocols` 是这样写的：

```python
protocols=["http", "https", "mailto", "data"]
```

我当时觉得 `data:` 协议有点用——比如"内联小图片"（`data:image/png;base64,...`）。于是白名单里放了 `data`。

**结果是一个真实的攻击路径：**

```html
<a href="data:text/html,<script>alert(document.cookie)</script>">点我</a>
```

`bleach` 检查协议时发现 `data:` 在白名单里，放行。`href` 是合法的、`<a>` 是合法的、属性是合法的——**三层全过**。但用户在浏览器里点这个链接，部分浏览器（尤其 Safari 和 WebView）会**直接把它当 HTML 页面渲染**，里面的 `<script>` 照常执行。攻击者只需要骗用户点一下。

这就是白名单思路的软肋：**你每多放开一个"看起来有用"的协议/标签/属性，就多一个被绕过的面**。而 XSS 的可怕之处在于——**只需要一个口子，就能执行任意脚本**。

后来我们删掉了 `data`。代码注释里留着这段复盘（`models.py`）：

```python
# C-S2: protocols drop 'data' globally — it was letting
#   <a href="data:text/html,<script>...</script>"> through, which Safari /
#   WebViews still execute. Inline base64 images aren't used here
#   (covers are URLField elsewhere), so the loss is acceptable.
```

这里有个工程取舍的学问：**放弃 `data:` 意味着失去"内联 base64 图片"的能力**。但因为博客封面的 URL 本来就走 `URLField`、走 `http(s)`，`data:` 方案根本用不上——**用不上的功能，就是纯风险，没有任何收益**。安全领域有个原则：**攻击面越小越好，凡是没在用的能力，默认就是漏洞**。

> 这一条教训值得单独记住：**白名单里每多一个条目，都要问自己——"这个真的需要吗？"**

---

## 05 第三层：外部链接加固

XSS 不只是脚本执行。还有一种被低估的攻击面叫 **`window.opener` 钓鱼**。

当页面用 `target="_blank"` 打开一个新标签页时，新页面通过 `window.opener` 能拿到**旧页面的 window 对象引用**。如果新页面是攻击者控制的，它可以：

```javascript
// 在新页面里偷偷做
window.opener.location = "https://evil.com/phishing";
```

把你博客的页面**静默跳转到钓鱼站**。这是老浏览器默认行为，很多人不知道。

所以消毒之后，我们对所有**外部链接**做了最后一道加固（`models.py`）：

```python
# 强制外部链接安全打开
self.html_content = re.sub(
    r'<a ([^>]*?)href="(https?://[^"]+)"',
    r'<a \1href="\2" rel="noopener noreferrer" target="_blank"',
    self.html_content,
)
```

用正则给每一个 `http(s)` 外链强制加上 `rel="noopener noreferrer" target="_blank"`：

- `noopener` —— 新页面拿不到 `window.opener`，**断掉反向钓鱼**；
- `noreferrer` —— 不泄露来源 Referrer；
- `target="_blank"` —— 外链新窗口打开，用户不丢当前页面。

注意这个正则只匹配 `http(s)` 外链，**站内相对链接（`/article/...`）不会被加 `target="_blank"`**——因为站内链接不需要新窗口。

---

## 06 真实漏洞 ②：摘要里的 HTML 泄漏

第二个坑，出在**文章列表页的摘要**上。

博客首页的卡片会显示每篇文章的摘要（`excerpt`）。老代码是这样生成摘要的：

```python
# 老方案：从原始 Markdown 里剥语法
text = re.sub(r'[#>*`-]', '', content)  # 大概这种思路
```

这个思路的问题是：**你在用正则"猜"Markdown 的结构，而 Markdown 允许内联 HTML**。于是两个漏洞来了：

**漏洞 A：内联 `<svg>` 漏进摘要**

一篇文章的正文里如果有：

```markdown
<svg onload=alert(1)></svg>
```

老摘要代码剥掉 Markdown 语法符号后，**`<svg onload=alert(1)>` 作为"文本"原样保留**，然后被拼进卡片渲染。卡片区域照样执行了 XSS。

**漏洞 B：`<https://...>` 自动链接泄漏**

Markdown 有个特性：裸 URL 会自动变成链接。老摘要用正则剥语法时，**`<https://...>` 的尖括号和内容一起被当成"文本"留着**，显示成 `<https://example.com>` 这种带括号的乱码，甚至可能被浏览器解析成标签。

修复后的方案（`models.py` 的 `make_excerpt`）**换了思路——不再从 Markdown 源剥，而是从"已经消毒过的 HTML"里提取纯文本**：

```python
def make_excerpt(html_content, fallback_text="", word_limit=50):
    text = html_content or ""
    # 先去掉代码块——源码对摘要来说是噪音
    text = re.sub(r"<pre\b[^>]*>.*?</pre>", " ", text, flags=re.DOTALL)
    # 再去掉 style/script 内容（连同标签一起）
    text = re.sub(r"<(style|script)\b[^>]*>.*?</\1>", " ", text, flags=re.DOTALL)
    # 剥掉所有剩余标签，只留人类可读文本
    text = re.sub(r"<[^>]+>", " ", text)
    text = unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    ...
```

关键洞察在这里：

> **摘要不再从"不可信的 Markdown"生成，而是从"已经过 bleach 消毒的 `html_content`"生成。**

因为 `html_content` 是防线①的产物——所有 `<svg>`、`<script>`、事件属性已经**在这一层被彻底清干净**。摘要提取时"剥标签"操作的是**已知安全的 HTML**，就算正则不完美，漏出来的也最多是无害的文本，**不会重新引入可执行的代码**。

这其实就是纵深防御的体现：**同一份数据，在流水线的不同环节被反复清洗，每一层都假设上一层有漏洞。**

---

## 07 纵深防御总结

把整条链路串起来看：

```
用户 Markdown
   │
   ▼  ① 受控渲染（固定扩展，不产出额外标签）
markdown.Markdown
   │
   ▼  ② 三层白名单（标签 / 属性 / 协议）
bleach.clean(...)  ──► 删除 <script>/<svg>/事件属性/javascript:/data:
   │
   ▼  ③ 外链加固（rel=noopener noreferrer target=_blank）
re.sub(...)
   │
   ▼  ④ 摘要从消毒后的 HTML 提取
make_excerpt(html_content)
   │
   ▼
html_content + excerpt   →  存储 / 接口 / 前端渲染
```

每一层各挡什么：

| 层 | 手段 | 挡住的攻击 |
|---|---|---|
| ① | 显式 Markdown 扩展 | 从源头减少 HTML 结构的"野生产物" |
| ② | bleach 标签/属性/协议三层白名单 | `<script>`、事件属性、`javascript:`、`data:`、`<svg>` 等 |
| ③ | 外链 `noopener noreferrer` | `window.opener` 反向钓鱼、Referrer 泄露 |
| ④ | 摘要从消毒后 HTML 提取 | 摘要区域二次 XSS、Markdown 语法泄漏 |

**为什么不能只依赖一层？**

因为每一层都有各自的盲区：

- **只靠渲染器**：Markdown 库不负责安全，`javascript:` 原样放行；
- **只靠 bleach**：白名单再严，也管不住"新页面通过 `window.opener` 操控旧页面"这种浏览器机制层面的问题；
- **只靠正则**：正则剥 HTML 永远有边缘情况，`<https://...>` 就是活例子。

纵深防御的核心信念是：**"我一定会有漏洞"这个前提来设计，而不是"我很安全"这个假设来安心。** 每一层都当上一层已经失守，把攻击面一层层收窄。

---

## 延伸：如果你用的不是 Django

`bleach` 是 OWASP 认可的白名单消毒方案，但它不是唯一的选择。顺着同样的"白名单"思路，其他语言也有对应物：

| 语言 | 推荐库 | 说明 |
|---|---|---|
| Python | `bleach` | 本文主角，Mozilla 出品 |
| Python | `nh3`（绑定 Rust ammonia） | 更快，同样白名单思路 |
| Java | `OWASP Java HTML Sanitizer` | OWASP 官方 |
| Node.js | `sanitize-html` / `DOMPurify`(前端) | 生态成熟 |
| Go | `bluemonday` | 标准白名单库 |
| Ruby | `rails-html-sanitizer` | Rails 内置 |

**核心心法**（不管什么语言都一样）：

1. **永远白名单，永远别黑名单**。黑名单 = 追着攻击者跑；白名单 = 你定义安全边界。
2. **三层都要管**：标签、属性、协议。只过滤标签是不够的，`<img onerror>` 需要属性层，`javascript:` 需要协议层。
3. **渲染和消毒是两回事**。渲染器（markdown → HTML）别管安全，消毒器（bleach）别管渲染，各司其职，在管线里串起来。
4. **内容输出前再做一次摘要清洗**。同一个数据源，多清洗一次不亏。
5. **用不上的能力就是风险**。`data:` 协议、内联 base64、`target=_blank` 裸奔……不用就删。
6. **写清注释**。你的防御逻辑、你踩过的坑、你为什么放弃某个能力——这些是留给未来的自己（和团队）最值钱的文档。

---

## 结语

回到开头那句话：**渲染用户输入，就是在执行用户代码。**

"敢渲染"不是胆子大，而是**把每一道防线都设计到位之后的底气**。我的博客后端 `articles/models.py` 里那段 `save()` 方法，从受控渲染、bleach 三层白名单、外链加固、到从消毒 HTML 提取摘要——这条链路不是一天写成的，是两个真实漏洞（`data:` 绕过、摘要泄漏）换来的。

写这篇的目的，不是让你照抄代码，而是希望你带走一个判断框架：

> **下次你遇到"要不要渲染用户输入"的问题，先问自己三个问题：**
> 1. 我信任这个输入吗？（信任边界）
> 2. 如果我错了，最坏会发生什么？（纵深防御）
> 3. 我允许的东西，真的都需要吗？（攻击面最小化）

想清楚这三个问题，你就离"敢渲染"不远了。
