## 🎯 前言

这篇教程详细讲解如何把 Django REST Framework 后端部署到 PythonAnywhere。

> PythonAnywhere 免费套餐支持 Python Web 应用托管，原生支持 Django，无需服务器运维，非常适合个人项目。

---

## 📋 准备工作

| 项目 | 要求 |
|------|------|
| GitHub 账号 | 存放代码 |
| PythonAnywhere 账号 | 免费版即可，[注册地址](https://www.pythonanywhere.com) |
| Django 项目 | 可以本地运行的完整项目 |
| Git | 代码已经推送到 GitHub |

---

## 🏗️ 整体流程

```
 ╔══════════════╗     ╔══════════════╗     ╔══════════════╗
 ║  本地开发     ║────▶║  GitHub      ║────▶║  Python      ║
 ║  Django 项目  ║     ║  托管代码     ║     ║  Anywhere    ║
 ╚══════════════╝     ╚══════════════╝     ╚══════════════╝
```

---

## 📂 第一步：准备项目

### 1.1 确认项目结构

一个标准的 Django 项目应该类似这样：

```
backend/
├── blog_api/              # Django 项目配置
│   ├── settings.py        # 核心配置文件
│   ├── urls.py            # 主路由
│   └── wsgi.py            # WSGI 入口
├── articles/              # 你的 App
│   ├── models.py
│   ├── views.py
│   └── serializers.py
├── manage.py
├── requirements.txt       # Python 依赖列表
└── venv/                  # 本地虚拟环境
```

### 1.2 生成 requirements.txt

```bash
cd backend
source venv/bin/activate    # Linux/Mac
# venv\Scripts\activate     # Windows

# 冻结当前所有依赖
pip freeze > requirements.txt

# 确认文件内容包含这些关键包
cat requirements.txt | grep -E "django|rest_framework|simplejwt|corsheaders"
```

### 1.3 生产环境配置

修改 `backend/blog_api/settings.py`，让配置从环境变量读取：

```python
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ 从环境变量读取，有默认值保底
SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-dev-key-change-me'
)

DEBUG = os.environ.get('DEBUG', 'True') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')

# ✅ CORS 配置：生产环境指定域名
_cors = os.environ.get('CORS_ALLOWED_ORIGINS', '')
if _cors:
    CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors.split(',') if o.strip()]
    CORS_ALLOW_ALL_ORIGINS = False
else:
    CORS_ALLOW_ALL_ORIGINS = True  # 开发环境允许所有来源

# ✅ 静态文件
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

# ✅ 媒体文件
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

### 1.4 推送代码到 GitHub

```bash
git add backend/
git commit -m "chore: production-ready Django config"
git push origin master
```

---

## 🖥️ 第二步：登录 PythonAnywhere

### 2.1 打开 Bash 控制台

登录 [pythonanywhere.com](https://www.pythonanywhere.com) → **Dashboard** → 点击 **Bash**：

```
┌─────────────────────────────────────────────────────────┐
│                   PythonAnywhere Dashboard               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   [ Files ]  [ Web ]  [ Databases ]  [ Bash ]  [...]    │
│                                                         │
│           点击 Bash 打开命令行终端                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 克隆代码

```bash
# 克隆你的仓库
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO/backend

# 确认文件都在
ls -la
```

---

## 🐍 第三步：创建虚拟环境

### 3.1 创建 venv

```bash
# PythonAnywhere 支持 Python 3.10 / 3.11 / 3.12
python3.12 -m venv venv

# 激活虚拟环境
source venv/bin/activate

# 你会看到命令行前面出现 (venv) 标识
```

### 3.2 安装依赖

```bash
pip install -r requirements.txt
```

> ⚠️ 如果安装失败，检查 `requirements.txt` 是否包含不兼容的包。可以先手动安装核心包：
> ```bash
> pip install django djangorestframework djangorestframework-simplejwt django-cors-headers
> ```

### 3.3 生成生产密钥

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

> 📋 **把这个生成的密钥复制保存好**，下一步要用！

---

## ⚙️ 第四步：创建 Web App

### 4.1 添加 Web App

回到 **Dashboard** → **Web** 标签 → 点击 **Add a new web app**：

```
┌────────────────────────────────────────────────────────┐
│                   Create new web app                    │
├────────────────────────────────────────────────────────┤
│                                                        │
│   ● Choose Manual configuration (not Django/Flask)     │
│                                                [Next]  │
│                                                        │
│   ● Select Python 3.12                        [Next]   │
│                                                        │
└────────────────────────────────────────────────────────┘
```

> ⚠️ **注意**：选 **Manual configuration**，不要选 Django 自动配置！

### 4.2 配置 Web App

创建完成后，你会看到配置页面。依次填写：

```
┌────────────────────────────────────────────────────────┐
│  Source code:                                          │
│  /home/你的用户名/YOUR_REPO/backend                     │
│                                                        │
│  Working directory:                                    │
│  /home/你的用户名/YOUR_REPO/backend                     │
│                                                        │
│  Virtualenv:                                           │
│  /home/你的用户名/YOUR_REPO/backend/venv                │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### 4.3 配置 WSGI 文件

点击蓝色的 **WSGI configuration file** 链接，把内容**全部替换**为：

```python
import os
import sys

# 设置项目路径
path = '/home/YOUR_USERNAME/YOUR_REPO/backend'
if path not in sys.path:
    sys.path.insert(0, path)

# 设置环境变量（把密钥换成第四步生成的！）
os.environ['DJANGO_SETTINGS_MODULE'] = 'blog_api.settings'
os.environ['DJANGO_SECRET_KEY'] = '你的生产密钥'
os.environ['DEBUG'] = 'False'
os.environ['ALLOWED_HOSTS'] = '你的用户名.pythonanywhere.com'
os.environ['CORS_ALLOWED_ORIGINS'] = 'https://你的用户名.github.io'

from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

> ⚠️ **把 `YOUR_USERNAME` 和 `YOUR_REPO` 替换成你自己的值！**

保存后关闭编辑器。

---

## 🗄️ 第五步：初始化数据库

### 5.1 运行迁移

回到 Bash 终端：

```bash
cd ~/YOUR_REPO/backend
source venv/bin/activate

# 运行所有数据库迁移
python manage.py migrate

# 你应该看到类似输出：
# Operations to perform:
#   Apply all migrations: articles, comments, ...
# Running migrations:
#   Applying articles.0001_initial... OK
#   ...
```

### 5.2 创建管理员账号

```bash
python manage.py createsuperuser
```

按提示输入：
```
Username: admin
Email address: your@email.com
Password: ********
Password (again): ********
Superuser created successfully.
```

### 5.3 收集静态文件

```bash
python manage.py collectstatic --noinput

# 输出: 157 static files copied to 'staticfiles'
```

---

## 📁 第六步：配置静态文件映射

回到 **Web** 页面，找到 **Static Files** 区域，添加两行：

| URL | Directory |
|-----|-----------|
| `/static/` | `/home/你的用户名/YOUR_REPO/backend/staticfiles` |
| `/media/` | `/home/你的用户名/YOUR_REPO/backend/media` |

```
┌────────────────────────────────────────────────────────┐
│                   Static Files                          │
├──────────────────┬─────────────────────────────────────┤
│  URL             │  Directory                          │
├──────────────────┼─────────────────────────────────────┤
│  /static/        │  /home/xxx/YOUR_REPO/backend/       │
│                  │  staticfiles                        │
├──────────────────┼─────────────────────────────────────┤
│  /media/         │  /home/xxx/YOUR_REPO/backend/       │
│                  │  media                              │
└──────────────────┴─────────────────────────────────────┘
```

---

## 🚀 第七步：启动！

### 7.1 重载 Web App

回到 **Web** 页面顶部，点击绿色 **Reload** 按钮：

```
┌────────────────────────────────────────────────────────┐
│                   Web App Status                        │
├────────────────────────────────────────────────────────┤
│   ✅ Running        [ Reload ]                         │
│                                                        │
│   Your site: https://YOUR_USERNAME.pythonanywhere.com  │
└────────────────────────────────────────────────────────┘
```

### 7.2 验证 API

打开浏览器访问：

```
https://你的用户名.pythonanywhere.com/api/articles/
```

如果看到 JSON 数据，恭喜部署成功！🎉

---

## ⚠️ 常见问题

### Q1: 打开网站显示 "Something went wrong"

> 查看错误日志：**Web** → **Error log**，根据具体错误排查。

常见原因：
- WSGI 文件路径写错了
- 虚拟环境没装依赖
- 密钥没有设置

### Q2: 数据库迁移报错

> 确认已激活虚拟环境：`source venv/bin/activate`

### Q3: 静态文件 404

> 检查 Static Files 映射配置，URL 和 Directory 要完全匹配。

### Q4: CORS 错误（浏览器控制台）

> 检查 WSGI 文件中的 `CORS_ALLOWED_ORIGINS` 是否包含你的前端域名。

### Q5: 修改代码后不生效

> 每次修改代码后必须点击 **Reload**！

```bash
# 更新代码的标准流程：
cd ~/YOUR_REPO/backend
git pull                      # 拉取最新代码
source venv/bin/activate
pip install -r requirements.txt  # 安装新依赖（如果有）
python manage.py migrate         # 运行新迁移（如果有）
python manage.py collectstatic --noinput
# 然后去 Web 页面点 Reload
```

---

## 📊 部署流程图

```
 本地开发           GitHub          PythonAnywhere      Browser
 ┌──────┐         ┌──────┐         ┌──────────┐       ┌──────┐
 │ 写代码 │──push──▶│ 仓库  │──clone──▶│ Bash 终端 │       │ 访问  │
 └──────┘         └──────┘         └────┬─────┘       └──┬───┘
                                        │                │
                                   ┌────▼─────┐          │
                                   │ venv     │          │
                                   │ pip      │          │
                                   │ migrate  │          │
                                   │ collect  │          │
                                   └────┬─────┘          │
                                        │                │
                                   ┌────▼─────┐    ┌────▼────┐
                                   │ Web App   │───▶│ HTTPS   │
                                   │ WSGI      │    │ 200 OK  │
                                   │ Reload    │    └─────────┘
                                   └──────────┘
```

---

## ✅ 部署检查清单

| 步骤 | 检查项 | 状态 |
|------|--------|------|
| 1 | 代码已推送到 GitHub | ☐ |
| 2 | requirements.txt 包含所有依赖 | ☐ |
| 3 | settings.py 从环境变量读取配置 | ☐ |
| 4 | 代码已 clone 到 PythonAnywhere | ☐ |
| 5 | 虚拟环境已创建并安装依赖 | ☐ |
| 6 | Web App 已创建（Manual + 3.12） | ☐ |
| 7 | WSGI 文件已正确配置 | ☐ |
| 8 | migrate 已执行 | ☐ |
| 9 | createsuperuser 已完成 | ☐ |
| 10 | collectstatic 已执行 | ☐ |
| 11 | Static Files 映射已配置 | ☐ |
| 12 | Reload 后 API 正常返回 | ☐ |

---

## 🔗 参考链接

- [PythonAnywhere 官方文档](https://help.pythonanywhere.com/pages/)
- [Django 部署检查清单](https://docs.djangoproject.com/en/stable/howto/deployment/checklist/)
- [DRF 官方文档](https://www.django-rest-framework.org/)
