## ✨ 关于我

嘿，你好呀！👋 我是 **Zhou Jun**，一个热爱技术与科学的开发者。

> 喜欢旅行和摄影，对遥感与地理信息系统充满热情。虽然自认还有很多要学，但一直在路上！希望能和大家多多交流 🌸

### 💡 技术兴趣

| 领域 | 具体方向 |
|------|----------|
| 🛰️ **遥感** | 图像分类、变化检测、大模型应用 |
| 🗺️ **GIS** | 空间分析、地图可视化、WebGIS |
| 🤖 **AI** | 大语言模型、多模态模型、智能体 |
| 💻 **开发** | Python、JavaScript、Django、Vue |

---

## 📝 关于这个博客

### 🏗️ 技术架构

这个博客采用**前后端分离**的现代架构设计：

```
 ╔═══════════════╗       ╔════════════════════╗
 ║   🌐 浏览器    ║──────▶║  GitHub Pages      ║
 ║               ║       ║  Vue 3 前端 (SPA)  ║
 ╚═══════════════╝       ╚════════╤═══════════╝
        │                         │
        │ REST API                 │ JSON
        │                         │
        ▼                         ▼
 ╔═══════════════╗       ╔════════════════════╗
 ║  PythonAnywhere║◀──────║  管理后台 (Vue)    ║
 ║  Django 后端   ║       ║  Markdown 编辑    ║
 ╚═══════════════╝       ╚════════════════════╝
```

### 🛠️ 技术栈详解

**前端**
- **Vue 3** — 渐进式 JavaScript 框架，Composition API
- **Vite** — 新一代前端构建工具，极速热更新
- **Vue Router** — SPA 路由管理
- **Pinia** — 轻量级状态管理
- **Axios** — HTTP 客户端，JWT 认证拦截
- **Vditor** — Markdown 所见即所得编辑器
- **SCSS** — CSS 预处理器，主题变量系统

**后端**
- **Django 5.x** — Python Web 框架
- **Django REST Framework** — RESTful API 构建
- **SimpleJWT** — JSON Web Token 认证
- **SQLite** — 轻量级数据库
- **django-filter** — 查询过滤支持

### 🚀 本地运行

```bash
# 克隆项目
git clone https://github.com/zhoujungis/zhoujungis.github.io.git
cd zhoujungis.github.io

# 启动前端 (需要 Node.js >= 18)
cd frontend && npm install && npm run dev
# 访问 http://localhost:5173

# 启动后端 (新终端, 需要 Python >= 3.10)
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
# API 运行在 http://localhost:8000
```

### 📦 部署方案

| 服务 | 平台 | 说明 |
|------|------|------|
| 前端 | **GitHub Pages** | 免费、自动 HTTPS、全球 CDN |
| 后端 | **PythonAnywhere** | 免费套餐、Django 原生支持 |
| 数据库 | **SQLite** | 零配置、适合个人博客 |

---

## 🔬 研究方向

### 🛰️ 遥感图像智能分析

> 利用大模型与 AI 技术对遥感影像进行自动化分析和信息提取。

主要工作包括：

- **图像分类** — 使用视觉大模型、多模态大模型对遥感场景进行智能分类
- **语义分割** — 基于大模型的像素级地物识别与边界提取
- **变化检测** — 多时相遥感影像对比分析

### 🗺️ WebGIS 系统开发

> 将地理信息分析能力搬到浏览器端。

技术栈：

- **前端地图库** — Leaflet、Mapbox GL JS、OpenLayers
- **后端服务** — GeoServer、PostGIS
- **数据格式** — GeoJSON、GeoTIFF、WMS/WFS

### 🤖 大模型应用

> 探索大模型与 AI Agent 在地理信息科学中的创新应用。

```python
# 使用 LangChain 构建遥感数据分析智能体
from langchain.llms import OpenAI
from langchain.agents import Tool, AgentExecutor

# 定义遥感数据分析工具
def analyze_rs_image(image_path: str) -> str:
    """分析遥感影像并返回分类结果"""
    # 调用视觉大模型 API 进行图像分析
    return "分类结果: 水体 30%, 植被 45%, 建筑 25%"

tools = [
    Tool(name="遥感图像分析", func=analyze_rs_image,
         description="分析遥感影像，识别地物类型")
]

agent = AgentExecutor.from_agent_and_tools(
    agent=YourAgent(llm=OpenAI(model="gpt-4o")),
    tools=tools
)

# 智能体自动分析遥感数据
result = agent.run("请分析这张遥感影像的地物分布")
print(result)
```

---

## 📬 联系我

> 🌐 **GitHub:** [github.com/zhoujungis](https://github.com/zhoujungis)

欢迎来我的 GitHub 逛逛，一起交流技术！

---

<p align="center">🌸 感谢你的来访，祝你今天愉快 🌸</p>
