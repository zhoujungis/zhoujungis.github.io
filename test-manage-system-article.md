# 从零搭建测试管理系统：Vue 3 + Django 全栈实战

## 前言

在软件开发中，测试是保证质量的关键环节。但很多团队还在用 Excel 管理测试用例、用微信群同步缺陷——效率低不说，还容易遗漏和出错。

今天要介绍的**测试管理系统（Test Management System）**就是一个专为 QA 团队打造的全栈平台。它用 **Vue 3** 做前端界面，**Django** 做后端服务，覆盖了测试用例管理、测试计划、执行跟踪、缺陷管理、团队协作的完整生命周期。

> 项目地址：[github.com/zhoujungis/test_manage_system](https://github.com/zhoujungis/test_manage_system)

---

## 一、这个系统能做什么？

用一个图来直观理解：

```
                         测试管理系统
 ┌─────────────────────────────────────────────────────────────┐
 │                                                             │
 │  📋 用例管理          📅 测试计划          🔧 执行跟踪       │
 │  ┌──────────┐       ┌──────────┐       ┌──────────┐        │
 │  │ 写用例    │  ──▶  │ 做计划    │  ──▶  │ 跑测试    │        │
 │  │ 导 Excel  │       │ 排顺序    │       │ 记结果    │        │
 │  └──────────┘       └──────────┘       └──────────┘        │
 │                                                    │       │
 │                          ┌─────────────────────────┘       │
 │                          ▼                                  │
 │  🐛 缺陷管理             📊 看板统计          👥 团队协作    │
 │  ┌──────────┐       ┌──────────┐       ┌──────────┐        │
 │  │ 提 Bug   │       │ 数据大盘  │       │ 多角色    │        │
 │  │ 跟踪状态  │       │ 图表分析  │       │ 权限控制  │        │
 │  └──────────┘       └──────────┘       └──────────┘        │
 │                                                             │
 └─────────────────────────────────────────────────────────────┘
```

简单来说：**把测试工作中 Excel 和聊天记录里的东西，全部搬到一个专业的 Web 系统里**——写用例、分任务、测功能、提 Bug、看报表，一站式搞定。

---

## 二、技术栈一览

这个项目采用了当前最主流的全栈方案：

| 层级 | 技术 | 选择理由 |
|------|------|---------|
| **前端框架** | Vue 3 | 响应式数据绑定，组件化开发 |
| **构建工具** | Vite 8+ | 极速冷启动，HMR 热更新 |
| **UI 组件库** | Element Plus | 成熟的桌面端组件，中文本地化好 |
| **状态管理** | Pinia 3 | Vue 3 官方推荐，API 简洁 |
| **路由** | Vue Router 4 | SPA 页面导航 |
| **后端框架** | Django 4.2 | 开箱即用的 ORM、Admin、认证系统 |
| **API** | Django REST Framework | 快速构建 RESTful API |
| **认证** | SimpleJWT | 无状态 JWT 令牌 |
| **数据库** | PostgreSQL | 生产级关系型数据库 |

可以概括为「**Vue 3 + Element Plus** 画皮，**Django + DRF** 撑骨，**JWT + PostgreSQL** 通血脉」。

---

## 三、四种角色，各司其职

系统设计了四个角色，不同角色看到的功能各不相同：

```
┌───────────────────────────────────────────────────────────┐
│  角色权限金字塔                                            │
│                                                           │
│       ┌──────────┐                                        │
│       │  Admin   │  系统管理 + 用户管理 + 权限配置         │
│       │  管理员   │  "我有所有钥匙"                        │
│       └────┬─────┘                                        │
│            │                                              │
│       ┌────▼─────┐                                        │
│       │Developer │  用例库增删改 + 项目参与 + 测试执行      │
│       │  开发     │  "我来维护用例库"                       │
│       └────┬─────┘                                        │
│            │                                              │
│       ┌────▼─────┐                                        │
│       │  Tester  │  项目参与 + 看用例 + 跑测试              │
│       │  测试     │  "我来执行测试"                         │
│       └────┬─────┘                                        │
│            │                                              │
│       ┌────▼─────┐                                        │
│       │  Viewer  │  只能看，不能动                          │
│       │  访客     │  "我就看看"                             │
│       └──────────┘                                        │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

每个权限都是**细粒度**的——同样是"看用例库"，你能看但不能改？你是 Tester。你还能增删改？你是 Developer。每条权限都是独立开关，灵活组合。

### 安全机制

- 📧 仅限 `@glazero.com` 邮箱注册
- 🔑 密码加密存储，登录需要验证码
- ⏱️ Access Token 1小时有效，Refresh Token 8小时自动续期
- 🚦 登录和发验证码接口做了频率限制

---

## 四、十大功能模块详解

### 4.1 用户认证 —— 进门先刷卡

注册流程设计得很严谨：

```
用户输入邮箱 (@glazero.com)
        │
        ▼
  邮箱格式检查 + 域名白名单验证
        │
        ▼
  发送验证码到邮箱
        │
        ▼
  输入验证码 + 设置密码
        │
        ▼
  注册成功 → 分配默认角色
        │
        ▼
  登录 → 获取 JWT Token → 进入系统
```

用户系统采用 Django 内置 `auth.User` + `UserProfile` 扩展的方案：

```python
# accounts/models.py — 实际代码结构
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,
                                related_name='profile')
    role = models.CharField(max_length=20, default='tester',
        choices=[('admin','管理员'),('tester','测试'),
                 ('developer','开发'),('viewer','访客')])
    phone = models.CharField(max_length=20, blank=True)
    can_access_projects = models.BooleanField(default=True)
    can_access_testcase_library = models.BooleanField(default=True)
    can_manage_testcase_library = models.BooleanField(default=True)
    can_access_my_projects = models.BooleanField(default=True)
```

注册时根据角色自动设置默认权限——`ROLE_DEFAULT_PERMISSIONS` 字典定义了 admin/tester/developer/viewer 四种角色各自拥有的功能开关。

### 4.2 项目管理 —— 建立工作空间

每个测试项目包含完整的上下文信息：

```
Project（项目）
├── 基本信息：名称、描述、产品线（摄像头/门铃）
├── 状态：活跃 / 已归档
├── 成员管理
│   ├── Leader（负责人）
│   ├── Tester（测试人员）
│   └── Developer（开发人员）
├── 模块树
│   ├── 📁 视频功能
│   │   ├── 📄 实时预览
│   │   └── 📄 录像回放
│   └── 📁 音频功能
│       └── 📄 双向对讲
└── 任务管理
    ├── 提测轮次
    ├── 优先级
    └── 截止日期
```

这里最巧妙的是**模块树**设计——通过 Django 的 `parent` 自引用外键实现无限层级：

```python
class Module(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', null=True, blank=True,
                               on_delete=models.CASCADE)
    # parent 为 None → 根模块
    # parent 指向其他 Module → 子模块
```

### 4.3 用例管理 —— 测试的灵魂

用例库是整个系统的核心，按产品线（摄像头/门铃）组织：

```
用例结构
┌────────────────────────────────────────────┐
│  标题：验证摄像头夜视模式自动切换           │
│  优先级：P1（高）                           │
│  类型：功能测试                             │
│  状态：已启用                               │
│  前置条件：环境光传感器正常                 │
│  ┌──────────────────────────────────────┐  │
│  │  步骤 1                               │  │
│  │  操作：将摄像头置于黑暗环境             │  │
│  │  预期结果：自动切换到夜视模式           │  │
│  ├──────────────────────────────────────┤  │
│  │  步骤 2                               │  │
│  │  操作：打开手电筒照射镜头               │  │
│  │  预期结果：自动切换回日间模式           │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

批量导入更是实用利器——一条 Django 命令把 Excel 里的用例统统导进来：

```bash
python manage.py import_camera_cases 摄像头用例.xlsx
```

它会自动识别列标题，按工作表名称分组为模块，自动编号步骤。

### 4.4 用例分配与执行 —— 测试跑起来

一条用例怎么变成测试任务？看看这个流程：

```
用例库（Case Library）
    │
    │  分配（Assign）
    ▼
项目 → 任务 → 成员
    │
    │  执行（Execute）
    ▼
┌──────────────────────────────────┐
│  状态：                          │
│  ⬜ 待测试 (pending)             │
│  ✅ 通过 (passed)                │
│  ❌ 失败 (failed)                │
│  ⬛ 不适用 (not_applicable)      │
│  ⬜ 未测 (not_tested)            │
└──────────────────────────────────┘
    │
    │  审批（Approve）
    ▼
  Leader 审核 → 批量通过/驳回
```

每个执行结果都能**上传附件**（最大 15MB），比如截图、日志。Leader 可以**批量审批**，不用一个个点。

### 4.5 测试计划 —— 先规划再执行

测试计划就像"购物车"——从用例库里挑选，排好顺序：

```
Test Plan
├── 名称：摄像头 V2.0 回归测试计划
├── 关联项目：智能摄像头项目
├── 时间范围：2024-01-15 ~ 2024-01-30
├── 状态：草稿 → 活跃 → 已完成
└── 用例清单（可拖拽排序）
    ├── ① 验证设备启动时间
    ├── ② 验证视频流稳定性
    ├── ③ 验证夜视切换功能
    └── ④ 验证移动侦测告警
```

### 4.6 测试执行 —— 开始测！

基于计划创建执行运行（Test Run），系统**自动生成所有待测条目**：

```
执行运行 #42（基于计划"摄像头 V2.0 回归测试"）
状态：运行中
┌──────┬──────────────────────┬────────┬──────────┐
│ 序号 │ 用例名称              │  结果   │ 备注     │
├──────┼──────────────────────┼────────┼──────────┤
│  1   │ 验证设备启动时间       │  ✅    │          │
│  2   │ 验证视频流稳定性       │  ❌    │ 偶发花屏  │
│  3   │ 验证夜视切换功能       │  ⏸️   │ 环境受限  │
│  4   │ 验证移动侦测告警       │  ⬜    │          │
└──────┴──────────────────────┴────────┴──────────┘
进度：1/4 通过 │ 1/4 失败 │ 1/4 阻塞
```

### 4.7 缺陷追踪 —— Bug 的生命周期

执行测试时发现了问题？直接提缺陷：

```
缺陷生命周期
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│   Open   │───▶│In Progress│───▶│ Resolved │───▶│  Closed  │
│   新建    │    │  处理中   │    │  已解决   │    │  已关闭   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
       ▲                              │               │
       └──────────────────────────────┘               │
                 重新打开                              │
```

每条缺陷记录包含：
- **标题 & 描述** — 说什么问题
- **严重程度** — S0（最严重/阻塞）到 S4（轻微/建议）
- **关联项目** — 哪个项目的问题
- **关联测试结果** — 哪次测试发现的
- **指派人** — 谁来修

### 4.8 首页 —— 功能入口

打开系统后看到的首页是一个**功能入口导航页**，根据当前用户的权限展示不同的功能卡片：

```
┌──────────────────────────────────────────────┐
│              测试管理系统                      │
│             选择模块进入对应功能                │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │  📋 测试用例库                        │    │
│  │  按产品线管理摄像头、门铃等通用测试用例  │    │
│  └──────────────────────────────────────┘    │
│  ┌──────────────────────────────────────┐    │
│  │  📁 项目管理                          │    │
│  │  创建项目，管理模块、计划、执行与缺陷    │    │
│  └──────────────────────────────────────┘    │
│  ┌──────────────────────────────────────┐    │
│  │  👤 我的项目                          │    │
│  │  查看参与的项目并执行分配的测试任务     │    │
│  └──────────────────────────────────────┘    │
│  ┌──────────────────────────────────────┐    │
│  │  ⚙️ 权限管理 (仅管理员)               │    │
│  │  配置非管理员用户的功能访问权限         │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

四张卡片分别对应四个核心功能模块，每张卡片有独特的渐变色图标，hover 时有上浮动画效果。不同角色的用户看到的卡片数量不同——普通测试人员看不到"权限管理"，但没有"测试用例库"权限的人就看不到第一张卡片。

### 4.9 数据统计 —— API 层面的数据聚合

除了首页入口，系统在 `dashboard` app 中提供了 **统计数据 API**（`GET /api/dashboard/stats/`），供其他页面或外部工具调用：

- `total_projects`、`total_testcases`、`total_testplans`、`total_testruns` — 四项基本计数
- `results` — 测试结果分布（passed/failed/blocked/skipped/pending）及通过率
- `defects` — 缺陷统计（total/open/resolved）
- `priority_distribution` — 用例优先级分布（P0-P4 各有多少）
- `type_distribution` — 用例类型分布（功能/API/UI/性能）
- `recent_runs` — 最近 5 条执行记录

支持通过 `project_id` 参数按项目过滤。这个 API 使用 Django ORM 的 `aggregate` + 条件 `Count` 在**单次查询**中完成所有统计，性能高效。

### 4.10 管理员后台 —— 掌控全局

Admin 角色的专属功能：

- **用户管理** — 创建/删除/查看用户列表
- **权限配置** — 精细调整每个人的角色和权限开关
- 非 Admin 用户**不能修改自己的权限**（安全性设计）

### 4.10 Excel 批量导入 —— 历史数据迁移利器

```bash
# 一行命令，Excel 变用例
python manage.py import_camera_cases camera_cases.xlsx
```

智能识别：
- 自动检测列标题（支持标准格式和变体）
- 工作表名称 → 模块分组
- 自动编号测试步骤
- 跳过表头行

---

## 五、数据库设计 —— 一张图看清表关系

```
User ──1:1──▶ UserProfile（角色、权限）
  │
  │  (多对多，通过 ProjectMember)
  ▼
Project ──1:N──▶ Module（自引用树形结构）
  │   │
  │   └──1:N──▶ ProjectTask
  │                │
  │                └──1:N──▶ TestCaseAssignment
  │                             │
  │                             └──1:N──▶ AssignmentAttachment
  │
  └──1:N──▶ TestPlan ──1:N──▶ TestPlanCase
                │                 │
                │                 └──(引用 TestCase)
                │
                └──1:N──▶ TestRun ──1:N──▶ TestResult
                                              │
                                              └──1:N──▶ Defect

TestCase ──1:N──▶ TestCaseStep
```

关键设计要点：
- **一对多**关系贯穿始终，结构清晰
- **Module 自引用**实现无限层级树
- **Defect ↔ TestResult** 可选关联，Bug 追溯到测试
- 使用 `select_related` / `prefetch_related` 优化查询性能

---

## 六、前后端分离的代码组织

### 后端：标准 Django 项目结构

```
backend/
├── config/              # 项目配置
│   ├── settings.py      # 数据库、JWT、CORS 等配置
│   └── urls.py          # 总路由
├── apps/                # 业务应用
│   ├── accounts/        # 用户、角色、权限
│   ├── projects/        # 项目管理
│   ├── testcases/       # 用例管理
│   ├── testplans/       # 测试计划
│   ├── testruns/        # 测试执行
│   └── defects/         # 缺陷管理
├── manage.py
└── requirements.txt
```

### 前端：Vue 3 模块化组件

```
frontend/src/
├── api/           # Axios 请求封装（每个模块一个文件）
├── views/         # 页面级组件
│   ├── LoginView.vue
│   ├── HomeView.vue       # 数据看板
│   ├── ProjectListView.vue
│   ├── TestCaseManagementView.vue
│   └── MyTestExecuteView.vue
├── components/    # 可复用组件
├── stores/        # Pinia 状态管理
├── router/        # 路由配置（含导航守卫）
├── composables/   # 组合式函数
└── utils/         # 工具函数
```

### API 设计：RESTful 风格

前后端通过 RESTful API 通信，认证使用 JWT：

```
客户端请求                          Django 后端
    │                                   │
    │  POST /api/auth/login/            │
    │  {"email":"...","password":"..."}  │
    │ ─────────────────────────────────▶│
    │                                   │ 验证密码
    │  {"access":"...","refresh":"..."}  │ 返回 Token
    │ ◀─────────────────────────────────│
    │                                   │
    │  GET /api/testcases/?product_line=camera&page=1
    │  Authorization: Bearer <token>    │
    │ ─────────────────────────────────▶│
    │                                   │ 权限检查
    │  {"count":326,"results":[...]}    │ 数据查询
    │ ◀─────────────────────────────────│
```

统一响应格式：

```json
// 分页响应
{
  "count": 326,
  "next": "http://...api/testcases/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "验证摄像头夜视模式自动切换",
      "priority": "P1",
      "status": "enabled",
      "steps": [...]
    }
  ]
}
```

---

## 七、快速上手

### 环境要求

- Python 3.13+
- Node.js 18+
- PostgreSQL（生产环境）/ SQLite（开发环境）

### 三步启动

**第一步：启动后端**

```bash
git clone https://github.com/zhoujungis/test_manage_system.git
cd test_manage_system/backend

# 配置环境变量
cp .env.example .env
# 编辑 .env：填入数据库连接、SECRET_KEY、邮箱配置

pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser   # 创建管理员
python manage.py runserver 0.0.0.0:8000
```

**第二步：启动前端**

```bash
cd test_manage_system/frontend
npm install
npm run dev
# 浏览器打开 http://localhost:5173
```

**第三步：开始使用**

1. 用管理员账号登录
2. 创建项目 → 添加成员 → 建立模块树
3. 编写用例或导入 Excel
4. 创建测试计划 → 执行测试 → 提交缺陷

---

## 八、项目亮点

| 亮点 | 说明 |
|------|------|
| 🎯 **完整的测试生命周期** | 用例→计划→执行→缺陷，闭环管理 |
| 🔐 **细粒度权限** | 四角色 + 独立权限开关，灵活组合 |
| 📊 **可视化看板** | 项目统计、缺陷趋势、进度一目了然 |
| 📥 **Excel 批量导入** | Django 命令一键导入历史用例 |
| 🌲 **树形模块结构** | 无限层级，完美匹配项目结构 |
| 📎 **附件支持** | 执行结果可上传截图和日志 |
| ✅ **审批工作流** | Leader 审核测试结果，批量操作 |
| 🛡️ **安全设计** | JWT 双 Token、邮箱域名限制、频率限制 |
| 🎨 **Element Plus UI** | 美观的企业级界面，中文友好 |
| 📱 **响应式布局** | 桌面端流畅体验 |

---

## 九、总结

这个测试管理系统展示了一个**全栈 Web 应用的标准实现范式**：

1. **前端**用 Vue 3 + Element Plus 构建交互界面，Pinia 管理状态，Vue Router 处理导航
2. **后端**用 Django + DRF 提供 RESTful API，JWT 做无状态认证
3. **数据层**用 PostgreSQL 保证生产可靠性，Django ORM 简化数据库操作
4. **权限系统**从角色到功能开关的细粒度设计，兼顾安全与灵活性

项目的代码组织清晰、注释完整，非常适合作为学习 Vue 3 + Django 全栈开发的参考项目。无论你是前端想了解后端，还是后端想学习前端，都能从这个项目中学到实用的技术。

> 📂 项目地址：[github.com/zhoujungis/test_manage_system](https://github.com/zhoujungis/test_manage_system)
>
> ⭐ 如果觉得有用，欢迎 Star！

---

*本文基于 test_manage_system 项目的完整需求规格与代码结构撰写，涵盖了系统架构、功能模块、数据库设计、前后端交互等核心内容。*
