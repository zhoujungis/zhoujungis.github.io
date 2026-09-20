# 登录态 1 小时就掉？Django + Vue 双 Token 认证实战

> 适用栈：Django 6.0 + djangorestframework-simplejwt 5.5 + Vue 3 + Pinia + Axios
> 代码来源：真实博客 `backend/blog_api/settings.py`、`backend/blog_api/urls.py`、`frontend/src/stores/auth.js`、`frontend/src/api/client.js`、`frontend/src/router/index.js`，全部可运行
> 阅读时间：约 40 分钟（超详细版） | 收获：一套“过期自动续、并发只刷一次、退出清干净、防爆破”的双 Token 模板

## 前言：最烦人的 bug 是“我明明刚登录过”

博客后台刚上线时，我遇到一个玄学 bug：

- 早上登录，进 `/admin/dashboard` 好好的；
- 中午写了篇文章，点保存直接跳回登录页，草稿差点丢了；
- 看 Network：一堆 `401 Unauthorized`，调 `/admin/articles/` 全挂。

原因一句话：**Access Token 1 小时过期了，但前端不会自动续**。用户必须手动重登，体验极差。

修完之后的效果：access 过期后第一次请求自动用 refresh 换新 token 并重试，用户无感；5 个并发请求同时 401 也只刷一次；refresh 也过期了才真正跳登录。这就是本文要讲的 **Access + Refresh 双 Token** 全链路。

**目录**

- 全景：双 Token 在请求链路中的位置
- JWT 原理：三段式与 exp/jti
- 后端：SimpleJWT 配置与权限矩阵
- 前端存储：localStorage / Cookie / 内存三选一
- 登录：access + refresh 落地
- 自动续期：401 拦截 + 单 uçuş…单飞行刷新 + 路由守卫
- 注销与安全缺口：logout 只是前端清除？黑名单升级
- 调试：curl 复现与 8 个大坑
- 上线 Checklist（20 项）+ FAQ（15 问）
- 纵深防御 + 测试用例

---

## 1. 全景：一次后台保存经过了哪些关？

```
登录页 AdminLogin
  → POST /api/token/ {username, password}
  → 后端返回 {access(1h), refresh(1d)} → 存 localStorage

写文章点保存
  → POST /api/admin/articles/ + Header: Bearer <access>
  → 后端 JWTAuthentication 验签 + IsAdminUser 鉴权 → 201

1 小时后 access 过期，再点保存
  → POST /api/admin/articles/ → 401（access 过期）
  → 前端拦截器：POST /api/token/refresh/ {refresh} → 新 access
  → 重试原请求 → 201，用户无感

refresh 也过期（1 天没碰后台）
  → /token/refresh/ 也 401 → 清本地 token → 跳 /admin 登录页
```

两个 token 的分工：

| Token | 有效期（我博客） | 用途 | 泄露后果 |
|-------|-----------------|------|---------|
| access | 60 分钟 | 每次 API 请求都带，短命 | 最多被冒用 1 小时 |
| refresh | 1 天 | 只用来换 access，不碰业务接口 | 可换一整天 access，必须保护 + 可吊销 |

这就是双 Token 的核心思想：**常用钥匙短命（access），备用钥匙长命但少用（refresh）**。单 Token 方案（一个 7 天 token）一旦泄露就是 7 天任意门，双 Token 把 Blast Radius 压到 1 小时。

---

## 2. JWT 原理：三段式，5 分钟看懂

JWT 长这样（用 `.` 分三段）：

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9  .  eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzI1ODI4MDAwLCJ1c2VyX2lkIjoxfQ  .  SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
──────────── header ────────────      ─────────────── payload ────────────────      ───── signature ─────
```

- **header**：`{"alg":"HS256","typ":"JWT"}`，算法声明；
- **payload**：真正的数据，Base64 可解码，**别放密码**。SimpleJWT 默认带 `token_type`、`exp`、`iat`、`jti`、`user_id`；
- **signature**：`HMACSHA256(header + payload, SECRET_KEY)`，后端用 `SECRET_KEY` 验签，篡改 payload 会验签失败。

去 [jwt.io](https://jwt.io) 粘一段 access 进去，能直接看到：

```json
{
  "token_type": "access",
  "exp": 1725828000,
  "iat": 1725824400,
  "jti": "a3f1c9...",
  "user_id": 1
}
```

- `exp`：过期时间戳（秒），前端读它做本地过期判断；
- `iat`：签发时间；
- `jti`：token 唯一 ID，黑名单就靠它；
- `user_id`：认出你是谁。

JWT 是**无状态**的：后端不存 session，靠验签认人。这对 PythonAnywhere 多 worker 特别友好 —— 任意 worker 都能验，不用共享 session。但代价是**签发后无法单方面作废**（除非黑名单，见第 7 章）。

### 2.4 选型：JWT vs Session vs OAuth2，博客为什么选 JWT？

| 方案 | 原理 | 多 worker | 跨域（前后分离） | 吊销 | 适合 |
|------|------|----------|-----------------|------|------|
| Django Session + Cookie | 后端存 sessionid→user，Cookie 传 id | 需共享 session（DB/Redis），PA 多 worker 用 DB session 才行 | Cookie 跨 `github.io`→`pythonanywhere.com` 被 SameSite 卡，需 SameSite=None+Secure | 服务端删 session 即吊销，最方便 | 传统前后不分离、强管控后台 |
| JWT 双 Token（我博客） | 无状态验签，access 短 + refresh 长 | 零共享，任意 worker 可验 | 手动 `Authorization: Bearer` 头，不走 Cookie，跨域零烦恼 | 默认难吊销，需黑名单/rotation（第 7 章） | 前后端分离 + 移动端 + Serverless，首选 |
| OAuth2 / OIDC（GitHub 登录） | 跳第三方授权拿 token | 同 JWT | 同 JWT | 第三方管吊销 | 多用户 + 第三方登录，不想管密码时 |

单人博客 + Vue（github.io）+ Django（pythonanywhere.com）跨双域，Session 的 Cookie 跨站携带是持续的坑（Safari ITP 直接吞第三方 Cookie），JWT 的 Header 模式一次配对终身受益。这就是选型理由：**跨域省心 + 多 worker 免共享 + App 复用同一套**。

SimpleJWT 源码速览（知道三处就够）：`TokenObtainPairView.post()` 校密码 → `RefreshToken.for_user(user)` 同时签 access+refresh；`TokenRefreshView` 验 refresh 的 `token_type==refresh` + `exp` + 黑名单 → 吐新 access；`JWTAuthentication.authenticate()` 从 `Authorization: Bearer xxx` 取 token、`UntypedToken` 验签解出 `user_id`。验签失败/过期统一抛 `InvalidToken` → DRF 转 401。

---

## 3. 后端：SimpleJWT 三处配置

### 3.1 settings：有效期 + 认证入口

```python
# backend/blog_api/settings.py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    # ... 分页限流见 DRF 三件套那篇
}

from datetime import timedelta
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

为什么是 60 分钟 + 1 天？我的调参逻辑：

- access 太短（如 5 分钟）：后台写长文时频繁续期，弱网下容易续失败；
- access 太长（如 7 天）：约等于单 Token，泄露风险大；
- refresh 1 天：博主每天至少看一次后台，1 天不断签；读者是匿名的，根本不需要 refresh。

个人博客推荐 **30~60 分钟 + 1~7 天**，管理后台密集型可 access 15 分钟 + refresh 8 小时（下班即失效）。

### 3.2 urls：两个端点，全站只此两处发 token

```python
# backend/blog_api/urls.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include("articles.urls")),
    path("api/admin/", include("articles.admin_urls")),
    # ...
]
```

- `POST /api/token/ {username, password}` → `{access, refresh}`；
- `POST /api/token/refresh/ {refresh}` → `{access}`（开了 ROTATE 还会带新 refresh，见 7.3）。

### 3.3 权限矩阵：读开放，写只给管理员

```python
# 公开读接口：默认 IsAuthenticatedOrReadOnly，匿名 GET 可过
class ArticleViewSet(viewsets.ReadOnlyModelViewSet):
    # 无 permission_classes，走全局默认：读放行，写（本来也没有）要登录
    ...

# 后台写接口：IsAdminUser，登录还不够，必须 is_staff
class ArticleAdminViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]

# 上传：同样锁死管理员 + 限流 100/hour
@api_view(["POST"])
@permission_classes([IsAdminUser])
def upload_image(request):
    ...
```

效果矩阵：

| 接口 | 匿名 | 登录非管理员 | 管理员 | 过期 access |
|------|------|-------------|--------|------------|
| GET /api/articles/ | 200 | 200 | 200 | 200（公开读不验也放） |
| POST /api/admin/articles/ | 401 | 403 | 201 | 401 → 前端自动续期后重试 |
| POST /api/admin/upload/ | 401 | 403 | 201 | 同上 |

注意 **401 vs 403** 的区别：401 是“你是谁都不知道”（没带/过期 token），前端该续期；403 是“知道你是谁但没权限”，续期也没用，直接提示。这在前端拦截器里是分支依据。

### 3.4 curl 实测：5 条命令走完一生

```bash
# 1. 登录拿双 token
curl -s -X POST https://zhoujun123.pythonanywhere.com/api/token/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"xxxx"}'
# → {"access":"eyJ...","refresh":"eyJ..."}

# 2. 带 access 调后台（把 $A 换成上面的 access）
curl -s https://zhoujun123.pythonanywhere.com/api/admin/stats/ \
  -H "Authorization: Bearer $A" -w "\n%{http_code}\n"

# 3. 不带 token → 401
curl -s -o /dev/null -w "%{http_code}\n" \
  https://zhoujun123.pythonanywhere.com/api/admin/stats/
# → 401

# 4. access 过期后用 refresh 换新（$R 是 refresh）
curl -s -X POST https://zhoujun123.pythonanywhere.com/api/token/refresh/ \
  -H "Content-Type: application/json" -d "{\"refresh\":\"$R\"}"
# → {"access":"eyJ...（新的）"}

# 5. 伪造篡改：把 payload 改一个字符再请求 → 401（验签失败）
```

### 3.5 高危缺口：/token/ 登录接口没有限流，可被爆破

审计我博客时发现的真问题：`REST_FRAMEWORK.DEFAULT_THROTTLE_RATES` 配了 anon/user/comment/subscribe/upload 五档，但 `/api/token/` 和 `/api/token/refresh/` **走的是 SimpleJWT 默认视图，没有配任何 throttle_class**，等于登录接口无限次试密码。单人博客用户名好猜（admin/zhoujun），必须堵。

三行修复（`backend/blog_api/urls.py` 或单独 `accounts/throttles.py`）：

```python
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

class LoginThrottle(AnonRateThrottle):
    scope = "login"  # settings 里加 'login': '5/minute'

class RefreshThrottle(AnonRateThrottle):
    scope = "refresh"  # settings 里加 'refresh': '30/minute'

urlpatterns = [
    path("api/token/", TokenObtainPairView.as_view(throttle_classes=[LoginThrottle])),
    path("api/token/refresh/", TokenRefreshView.as_view(throttle_classes=[RefreshThrottle])),
]
```

```python
# settings.py DEFAULT_THROTTLE_RATES 追加
'login': '5/minute',    # 登录 1 分钟 5 次，正常人够，字典爆破直接 429
'refresh': '30/minute', # 刷新宽一点（多 Tab 并发续期），但也封顶
```

为什么登录只给 5/min？正常人输错 3 次就去找密码了，脚本 1 分钟几百次直接 429 + 日志告警。进阶可上 `django-axes`（失败 5 次锁 IP 30 分钟 + 管理员邮件），小博客先限流就够。**上线前必查：所有吃密码/发 token 的端点都有 throttle**。

前端配合：登录 429/401 不要提示“密码错”（给爆破者确认用户名的信息），统一提示“用户名或密码错误，稍后再试”，登录按钮加 3 秒禁用 + 验证码留作后手。
```

---

## 4. 前端存储：localStorage / Cookie / 内存三选一

这是 JWT 最有争议的一题。先给结论：**我博客选 localStorage + 本地过期预判**，理由下面展开。

| 方案 | XSS 偷走？ | CSRF 影响？ | 刷新页面还在？ | 多 Tab 同步？ | 适合 |
|------|-----------|------------|---------------|--------------|------|
| localStorage | 能（JS 可读） | 无（手动加 Header，不自动带） | 在 | 需监听 storage 事件 | SPA 后台，我博客在用 |
| HttpOnly Cookie（后端 Set-Cookie） | 不能（JS 读不到） | 有（自动带，需 SameSite+Lax/CSRF） | 在 | 自动 | 安全要求高的生产 |
| 内存（Pinia/ref） | 刷新就没，偷都没处偷 | 无 | 刷新丢，需重登 | 不同 Tab 各自为政 | 超高安全但体验差 |

### 4.1 我为什么敢用 localStorage？三层緩解

localStorage 最大的黑点是 XSS 能读。但我博客有三层緩解，风险可控：

1. **内容侧**：文章 Markdown 经 `bleach` 白名单过滤 + CSP，XSS 先被砍一刀（见《Django XSS 防护》那篇）；
2. **权限侧**：偷到 token 也只是博主一个人的后台，读者全是匿名的，无批量用户数据可拖；
3. **有效期侧**：access 只有 60 分钟，偷走也要 1 小时内用掉。

如果你的站有批量用户数据/支付，**直接上 HttpOnly Cookie + SameSite=Lax + CSRF**，别学我。安全永远是 trade-off，不是银弹。

### 4.2 key 命名：别把 token 存成 `jwt` 这种通用名

```js
// frontend/src/stores/auth.js
const TOKEN_KEY = 'token'
const EXPIRY_KEY = 'token_expiry'
const USER_KEY = 'user'
// refresh 存 'refresh_token'
```

通用名容易和别的库撞，也容易被一锅端。`token_expiry` 存的是 `exp*1000`（毫秒），打开 F12 → Application → Local Storage 能直接看到三个 key。

### 4.4 进阶：HttpOnly Cookie 完整迁移指南（收藏备用）

哪天博客加了读者登录/付费，必须从 localStorage 迁走。完整改动四处，后端为主：

```python
# 1. settings.py：允许 Cookie 携带跨站 + CSRF
CORS_ALLOW_CREDENTIALS = True
CORS_ALLOWED_ORIGINS = ["https://zhoujungis.github.io"]  # Cookie 跨站必须精确域名，不能 *
CSRF_COOKIE_SAMESITE = "None"
SESSION_COOKIE_SAMESITE = "None"
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True  # 本地 http 调试改 False，生产 True
```

```python
# 2. backend/accounts/views.py：登录改 Set-Cookie（access 不再回 body）
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse

def cookie_login(request):
    # ... 校验 username/password 通过后 ...
    refresh = RefreshToken.for_user(user)
    resp = JsonResponse({"detail": "ok"})
    resp.set_cookie("access", str(refresh.access_token),
                    httponly=True, secure=True, samesite="None", max_age=3600)
    resp.set_cookie("refresh", str(refresh),
                    httponly=True, secure=True, samesite="None", max_age=86400,
                    path="/api/token/refresh/")  # refresh 只发给刷新端点，最小暴露
    return resp
```

```js
// 3. 前端：axios 全局带 Cookie，不再手动加 Header
const client = axios.create({ baseURL, withCredentials: true });
// 请求拦截器删掉 Authorization，响应 401 照旧走单飞行刷新（Cookie 自动带 refresh）
```

```python
# 4. 后端认证：自定义从 Cookie 读 access（替代默认的 Header 模式）
from rest_framework_simplejwt.authentication import JWTAuthentication
class CookieJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):
        token = request.COOKIES.get("access")
        if not token:
            return None
        validated = self.get_validated_token(token)
        return self.get_user(validated), validated
# REST_FRAMEWORK.DEFAULT_AUTHENTICATION_CLASSES 换成它
```

代价：CSRF 回来了（Cookie 自动带，恶意站可跨站 POST），必须 `SameSite=None; Secure` + Django CSRF 中间件 + 前端 `X-CSRFToken` 头三件套。所以**单人博客继续 localStorage，多用户/支付切 Cookie**，按威胁模型选，不跟风。

---

## 5. 登录：access + refresh 落地 + 本地过期预判

```js
// frontend/src/api/admin.js
import client from './client'
export function login(username, password) {
  return client.post('/token/', { username, password })
}
```

```js
// frontend/src/stores/auth.js（Pinia，精简注释版逻辑全保留）
import { defineStore } from 'pinia'
import { login as apiLogin } from '../api/admin'

function parseJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch { return null }  // 畸形 token 直接当无
}

function getStoredToken() {
  const token = localStorage.getItem('token')
  const expiry = localStorage.getItem('token_expiry')
  if (token && expiry && Date.now() >= parseInt(expiry, 10)) {
    // 本地预判已过期：直接清掉，当没登录，避免拿过期 token 去撞 401
    localStorage.removeItem('token')
    localStorage.removeItem('token_expiry')
    localStorage.removeItem('user')
    return null
  }
  return token || null
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getStoredToken(),
    user: safeParseUser(),  // localStorage user 可能是脏 JSON，try/catch 包住
    isAuthenticated: !!getStoredToken(),
  }),
  actions: {
    async login(username, password) {
      const response = await apiLogin(username, password)
      const { access, refresh } = response.data
      this.token = access
      this.isAuthenticated = true
      localStorage.setItem('token', access)
      if (refresh) localStorage.setItem('refresh_token', refresh)
      const payload = parseJwtPayload(access)
      if (payload?.exp) {
        localStorage.setItem('token_expiry', String(payload.exp * 1000))
      }
    },
    logout() {
      this.token = null
      this.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('token_expiry')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    },
    checkAuth() {
      const token = getStoredToken()
      this.token = token
      this.isAuthenticated = !!token
    },
  },
})
```

两个细节：

- `safeParseUser()` 包 try/catch：localStorage 手改坏了/旧版本残留脏 JSON，不能白屏整个站（真实踩过）；
- `getStoredToken()` 做**本地过期预判**：access 的 `exp` 本地可读，过期了直接当没登录，连 401 都不去撞，省一次往返。

### 5.4 记住我 + 自定义 claims + 改密码即吊销（token_version）

**记住我**：登录页加 checkbox，不勾 refresh 1 天（`REFRESH_TOKEN_LIFETIME` 默认），勾选调单独接口发 7 天 refresh。后端用两个 Serializer 区分即可，前端 `login(username, password, rememberMe)` 透传。后端 Session 时代靠 `SESSION_COOKIE_AGE`，JWT 时代靠签发不同 `lifetime` 的 refresh，各走各的。

**自定义 claims**（把常用字段塞进 access，省一次 `/me`）：

```python
# backend/accounts/serializers.py（新增）
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["is_staff"] = user.is_staff
        token["tv"] = getattr(user, "token_version", 0)  # 吊销版本号，见下
        return token
# urls 里 TokenObtainPairView.as_view(serializer_class=MyTokenSerializer)
```

前端 `parseJwtPayload(access).is_staff` 直接判断菜单显隐，不用再调我是谁。但记住：**payload 可解码，别塞手机号/邮箱**，只塞展示用的非敏感字段。

**改密码即吊销全部（token_version Hastag版，推荐）**：User 表加 `token_version = models.IntegerField(default=0)`；签 token 时塞 `tv`；认证时比对 `payload.tv == user.token_version`，不等则 401。改密码/点“退出其他设备”时 `user.token_version += 1`，历史所有 access+refresh 瞬间全废，比黑名单一张张拉高效得多。黑名单管“单个 token 作废”，`token_version` 管“一键全废”，两者互补。

---

## 6. 自动续期：全文最核心的 60 行

### 6.1 请求拦截器：每次带上 Bearer

```js
// frontend/src/api/client.js
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
```

### 6.2 响应拦截器 + 单飞行刷新：5 个 401 只换一次 token

没做单飞行前，长文保存时 5 个并发请求同时 401，会发 5 次 `/token/refresh/`，后 4 次可能因 ROTATE（见 7.3）用旧 refresh 而失败。修法是**全局一个 Promise 排队**：

```js
// frontend/src/api/client.js（核心，注释精简但逻辑完整）
let refreshInFlight = null

async function refreshAccessToken() {
  if (refreshInFlight) return refreshInFlight  // 已有人在刷，直接排队等

  const refresh = localStorage.getItem('refresh_token')
  if (!refresh) throw new Error('No refresh token')

  refreshInFlight = axios
    .post(`${client.defaults.baseURL}token/refresh/`,
      { refresh },
      { timeout: 15000, _skipRefresh: true })  // 刷 token 自己不触发再刷
    .then((res) => {
      const { access, refresh: newRefresh } = res.data || {}
      if (!access) throw new Error('No access token in refresh response')
      localStorage.setItem('token', access)
      if (newRefresh) localStorage.setItem('refresh_token', newRefresh)
      const payload = JSON.parse(atob(access.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      if (payload?.exp) localStorage.setItem('token_expiry', String(payload.exp * 1000))
      return access
    })
    .finally(() => {
      setTimeout(() => { refreshInFlight = null }, 0)  // 结算后放行下一轮
    })

  return refreshInFlight
}

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status
    const original = error.config || {}
    if (status !== 401) return Promise.reject(error)

    const url = original.url || ''
    if (url.includes('/token/')) return Promise.reject(error)  // 登录/刷新自己 401 不续
    if (original._skipRefresh) return Promise.reject(error)
    if (original._retry) {  // 重试一次还 401：真没救了，清掉跳登录
      clearAuth()
      if (window.location.pathname.startsWith('/admin')) window.location.href = '/admin'
      return Promise.reject(error)
    }

    const wasAuthenticated = !!original.headers?.Authorization
    if (wasAuthenticated && localStorage.getItem('refresh_token')) {
      original._retry = true  // 只重试一次，防死循环
      try {
        const newToken = await refreshAccessToken()
        original.headers.Authorization = `Bearer ${newToken}`
        return client(original)  // 拿新 token 重放原请求
      } catch (refreshErr) {
        clearAuth()
        if ((original.url || '').includes('/admin/')) window.location.href = '/admin'
        return Promise.reject(refreshErr)
      }
    }
    return Promise.reject(error)  // 匿名读接口 401：别清登录态，别跳页
  },
)
```

四道保险缺一不可：

1. `_skipRefresh`：刷新请求自己不触发刷新，否则 401 死递归；
2. `_retry`：只重试一次，refresh 烂了不死循环；
3. `wasAuthenticated`：匿名请求 401 不清登录态（公开读接口偶发 401 不能把后台踢掉）；
4. `url.includes('/token/')`：登录密码错了的 401 不去续，直接报错给用户看。

### 6.3 路由守卫：过期后直接打开后台也不掉线

光有拦截器还不够：access 过期后用户**直接刷新** `/admin/dashboard`，守卫先于任何 API 执行。我的守卫会先试一次 refresh，成了才放行：

```js
// frontend/src/router/index.js
router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) return next()
  const authStore = useAuthStore()
  authStore.checkAuth()  // 本地过期预判
  if (authStore.isAuthenticated) return next()

  // access 没了但 refresh 可能还在：试一次，不行再踢
  try {
    await refreshAccessToken()  // 复用 client.js 的单飞行，不另起一套
    authStore.checkAuth()
    if (authStore.isAuthenticated) return next()
  } catch { /* fall through */ }
  next({ name: 'AdminLogin' })
})
```

早期这里和 client.js 各写了一套刷新逻辑，两边行为分叉出过 bug，现在统一复用 `refreshAccessToken()`，**同一逻辑只留一份**。

### 6.4 多 Tab 同步 + 草稿保护 + AdminLogin 完整代码

**多 Tab 同步**：A 标签页点了退出，B 标签页还显示“已登录”，一点保存才 401。监听 storage 事件即解：

```js
// frontend/src/stores/auth.js（追加，全局一次）
window.addEventListener('storage', (e) => {
  if (e.key === 'token' && !e.newValue) {
    // 别的 Tab 清了 token，本 Tab 跟着退出
    const auth = useAuthStore()
    auth.checkAuth()
    if (!auth.isAuthenticated && window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin'
    }
  }
})
```

**草稿保护**：续期重试“只慢几百毫秒”建立在 refresh 有效的前提下；refresh 也过期时保存还是会挂。编辑器必须本地存草稿兜底：

```js
// ArticleEditor.vue：输入防抖 1s 存 localStorage，发布成功清掉
watch(content, debounce((v) => {
  localStorage.setItem(`draft:${route.params.id || 'new'}`, v)
}, 1000))
// 挂载时读出恢复 + 提示“已恢复 12:30 的草稿”
```

**AdminLogin 完整逻辑**（防爆破版）：

```vue
<script setup>
import { ref } from 'vue'
const cooldown = ref(0)
async function onLogin() {
  if (cooldown.value > 0) return
  try {
    await authStore.login(username.value, password.value)
    router.push({ name: 'AdminDashboard' })
  } catch (e) {
    // 401 和 429 统一文案，不告诉爆破者哪个对了
    error.value = '用户名或密码错误，稍后再试'
    cooldown.value = 3  // 按钮禁用 3 秒，脚本 5/min 限流下效率归零
    const t = setInterval(() => { if (--cooldown.value <= 0) clearInterval(t) }, 1000)
  }
}
</script>
```

---

## 7. 注销与安全缺口：最该看的一章

### 7.1 现状：logout 只是前端删 key

```js
logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  // ...
}
```

这清的是**这台浏览器**。refresh 在 1 天有效期内**依然有效**：别人拷走 refresh，照样能换 access。后端无状态，根本不知道你“退出了”。对单人博客可接受，对多用户站不可接受。

### 7.2 立刻能做的两件事（不改后端）

1. **改密码即吊销全部**：SimpleJWT 的 refresh 里不含密码版本？默认 `TOKEN` 只认 `user_id`，改密码后旧 token 照样能用。缓解：重要操作后提示“已退出其他设备”是不诚实的，别写。真要做看 7.3。
2. **缩短 refresh**：后台常用设备 1 天 Hoch，不常用设备每次登录都是一次风险敞口。公共电脑用完务必点退出 + 清 localStorage（F12 → Application → Clear storage）。

### 7.3 根治：Refresh Rotation + 黑名单（升级方案，直接抄）

```bash
pip install djangorestframework-simplejwt[token-blacklist]
# settings INSTALLED_APPS 加 'rest_framework_simplejwt.token_blacklist'
python manage.py migrate
```

```python
# backend/blog_api/settings.py（升级后）
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    'ROTATE_REFRESH_TOKENS': True,   # 每次刷新都发新 refresh
    'BLACKLIST_AFTER_ROTATION': True,  # 旧 refresh 进黑名单，用过即废
    'AUTH_HEADER_TYPES': ('Bearer',),
}
```

开了之后 `/token/refresh/` 返回 `{access, refresh（新的）}`，旧 refresh 再用直接 401（`Token is blacklisted`）。前端我已经提前写好了兼容（`if (newRefresh) localStorage.setItem(...)`，见 6.2），后端一开即生效，不用改前端。

再加一个真正的注销接口：

```python
# backend/accounts/views.py（新增）
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    refresh = request.data.get("refresh")
    if not refresh:
        return Response({"detail": "refresh required"}, status=400)
    try:
        RefreshToken(refresh).blacklist()  # 进黑名单，此 refresh 彻底作废
    except Exception:
        pass  # 过期/已黑也当成功，前端照常清
    return Response({"detail": "logged out"})
```

```python
# urls.py 加一行
path("api/logout/", logout, name="logout"),
```

前端 `logout()` 改成先调接口再清本地：

```js
async logout() {
  try {
    await client.post('/logout/', { refresh: localStorage.getItem('refresh_token') })
  } catch { /* 后端黑名单失败也不阻塞前端清除 */ }
  finally { /* 原来的 removeItem 四件套 */ }
}
```

这套做完才敢说“退出即吊销”。没做之前，诚实地在管理页写“退出仅清除本机登录态”都比撒谎强。

---

## 8. 调试：复现过期与 8 个大坑

### 8.1 本地 3 分钟复现过期续期

```python
# 临时把 access 调成 1 分钟（只本地！提交前改回）
SIMPLE_JWT = {**SIMPLE_JWT, 'ACCESS_TOKEN_LIFETIME': timedelta(minutes=1)}
```

1. 登录后台，等 70 秒；
2. 点保存 → Network 应看到：`POST /admin/articles/ 401` → `POST /token/refresh/ 200` → `POST /admin/articles/ 201`；
3. 用户侧无感，只慢了几百毫秒。这就是 single-flight + retry 的完整证据链。

### 8.2 8 个坑（按踩中频率排序）

1. **Authorization 头没发出去**：CORS 没放行 `Authorization`。后端 `CORS_ALLOWED_ORIGINS` 精确到 `https://zhoujungis.github.io`，且 axios 手动加 Header（不是 Cookie），与 `CORS_ALLOW_CREDENTIALS` 无关。换域先查 `Access-Control-Allow-Headers`。
2. **Bearer 写成 Token/Basic**：`AUTH_HEADER_TYPES = ('Bearer',)`，`Token xxx` 直接 401。前后统一。
3. **拿 access 去调 /token/refresh/**：refresh 接口要的是 `{refresh}`，传 access 必 401。复制粘贴时看清 key 名。
4. **refresh 复用（开了 ROTATE 后）**：旧 refresh 用过即黑，5 并发同时刷时没 single-flight 的 4 个全挂。见 6.2。
5. **时钟漂移**：`exp` 按后端时间签，`Date.now()` 是前端时间，两边差 5 分钟就会“本地觉得没过期、后端说过期了”或反之。本地预判只做体验优化，**最终以 401 为准**。
6. **PA 强制 HTTPS + Secure Cookie 混用**：如果以后切 HttpOnly Cookie，`SESSION_COOKIE_SECURE=True` 在本地 http 调不通，别怀疑人生，加 `SECURE_SSL_REDIRECT` 例外或本地改 False。
7. **localStorage 脏 JSON 白屏**：`JSON.parse(localStorage.user)` 抛错把 Pinia init 炸了。`safeParseUser()` 包住（我博客真实修过，见第 5 章）。
8. **匿名 401 被当登录失效**：公开读接口偶发 401（如 CSRF 中间件抖动）不能清 token 跳登录。靠 `wasAuthenticated` + `url.includes('/admin/')` 双判断（见 6.2）。

---

## 9. 上线 Checklist（20 项）+ FAQ（15 问）

**后端（9）**

- [ ] `ACCESS 30~60min + REFRESH 1~7天`，生产 `SECRET_KEY` 非默认值
- [ ] `/token/` + `/token/refresh/` 可达，`AUTH_HEADER_TYPES` 前后一致
- [ ] `/token/` 配 `login 5/min`、`refresh 30/min` 限流（3.5，高危）
- [ ] 读 `IsAuthenticatedOrReadOnly`，写 `IsAdminUser`，401/403 语义分清
- [ ] 生产只留 `JSONRenderer`（减少 token 错误信息泄露）
- [ ] 全站 HTTPS + HSTS，CORS 精确域名不开 `*`
- [ ] 进阶：`token_blacklist` + `ROTATE + BLACKLIST_AFTER_ROTATION` + `/logout/` 黑名单接口
- [ ] 进阶：`token_version` 字段，改密码/踢设备一键全废（5.4）
- [ ] 登录失败日志 + 429 告警（爆破早发现）

**前端（11）**

- [ ] 登录存 access + refresh + `token_expiry`（exp*1000）
- [ ] 请求拦截加 `Bearer`（Cookie 模式改 `withCredentials`）
- [ ] 响应拦截 401 单飞行刷新 + `_retry` 只一次 + `_skipRefresh` 防递归
- [ ] `/token/` 401 不续期，匿名 401 不清登录态不跳页
- [ ] 路由守卫过期先 `tryRefresh()` 再踢，别直接踢
- [ ] 退出清四件套（token/expiry/refresh/user），开了黑名单先调 `/logout/`
- [ ] 脏 localStorage 不白屏（try/catch + 日志）
- [ ] 多 Tab `storage` 事件同步登录态（6.4）
- [ ] 编辑器草稿防丢（localStorage draft + 恢复提示）
- [ ] 登录按钮冷却 3 秒 + 统一错误文案（防用户名枚举）
- [ ] 公共电脑退出后手动清 Application 存储

**FAQ（15 问）**

- **Q：access 1 小时，写长文保存时正好过期会丢稿吗？** A：不会。拦截器自动续 + 重放原请求，编辑器等几百毫秒后拿到 201。再加草稿本地存（6.4）双保险。
- **Q：refresh 1 天，出差一周回来？** A：重登一次。trade-off，可按频率调 7 天，或“记住我”双档（5.4）。
- **Q：localStorage 真的不如 Cookie 吗？** A：有用户数据/支付直接 Cookie（4.4）；单人博客 + bleach + CSP + 短 access，localStorage 可接受。看威胁模型。
- **Q：多 Tab 不同步？** A：`storage` 事件监听（6.4），一处退处处退。
- **Q：改密码后旧 token 失效吗？** A：默认不失效。用黑名单逐个废，或 `token_version` 一键全废（5.4/7.3）。
- **Q：JWT vs Session 到底选哪个？** A：前后分离跨域选 JWT（2.4）；同域强管控后台 Session 吊销最爽；第三方登录加 OAuth2。
- **Q：access 里塞 username/is_staff 安全吗？** A：payload 可解码，只塞非敏感展示字段，敏感信息后端查库。
- **Q：refresh 被偷了怎么办？** A：ROTATE 让旧 refresh 用过即废（7.3）+ 短有效期 + `token_version` 一键全废。发现即改密码+版本号+1。
- **Q：登录接口要不要验证码？** A：`5/min` 限流后脚本效率归零，小博客可不上；被针对性打再加（滑块/turnstile），别提前过度设计。
- **Q：时钟漂移导致“本地没过期后端说过期”？** A：本地预判只做体验，最终以 401 + 自动续为准（坑 5）。
- **Q：移动端 App 存哪？** A：Keychain/Keystore（iOS/Android 安全存储），别放 AsyncStorage 明文；续期逻辑同一套。
- **Q：登出后 refresh 还能用 1 天？** A：没黑名单就是这样（7.1）。要真注销上 `/logout/` 黑名单（7.3）。
- **Q：401 和 403 前端怎么分？** A：401→续期；403→提示无权限别续。见权限矩阵（3.3）。
- **Q：CORS 报错但 Postman 通？** A：Postman 不走浏览器 CORS。查 `CORS_ALLOWED_ORIGINS` 精确域名 + `Authorization` 在 Allow-Headers。
- **Q：PA 上 SECRET_KEY 怎么管？** A：`.env` + `DJANGO_SECRET_KEY` 环境变量，绝不进 git（见 settings 注释），丢了全站 token 得重签。

---

## 10. 纵深防御 + 测试：上线前最后两块拼图

### 10.1 纵深防御：JWT 只是其中一层

我博客 `settings.py` 里和认证联动的四层，一眼看全：

```python
SECURE_SSL_REDIRECT = True           # 全站 HTTPS，token 明文传输一生黑
SECURE_HSTS_SECONDS = 31536000       # HSTS，防 SSL 剥离
CORS_ALLOWED_ORIGINS = ["https://zhoujungis.github.io"]  # 精确域名，Cookie 模式必备
CORS_ALLOW_ALL_ORIGINS = False       # 永远别开 *
```

外加内容侧 `bleach` 白名单 + 上传禁 SVG（见 XSS 那篇 + 三件套上传限流），认证侧 `login 5/min`（3.5）。攻击者要偷后台，得连过：HTTPS → 爆破限流 → XSS（bleach）→ 短 access（60min）→ 黑名单/rotation。单点被破不致命，这就是纵深。

### 10.2 测试：5 个后端 + 3 个前端用例，锁死行为

```python
# backend/accounts/tests.py（pytest/django TestCase 均可）
def test_login_ok(api_client, admin_user):
    assert api_client.post("/api/token/", {"username": "a", "password": "p"}).status_code == 200

def test_admin_api_no_token_401(api_client):
    assert api_client.get("/api/admin/stats/").status_code == 401

def test_normal_user_admin_api_403(api_client, normal_user):
    # 401 和 403 分清：登录了但不是管理员 → 403，续期也救不了
    assert api_client.get("/api/admin/stats/").status_code == 403

def test_expired_access_401_and_refresh_ok(api_client):
    # access 过期 → 401；refresh 换新 → 200；旧 access 仍 401
    ...

def test_login_throttled_after_5_fails(api_client):
    for _ in range(6):
        api_client.post("/api/token/", {"username": "a", "password": "wrong"})
    assert api_client.post("/api/token/", {"username": "a", "password": "wrong"}).status_code == 429
```

```js
// frontend/src/__tests__/auth.test.js（已有，在此约束下扩展）
// 1. access 过期只调一次 /token/refresh/（5 并发单飞行）
// 2. /token/ 自己 401 不触发续期（防递归）
// 3. 匿名 GET 401 不清 localStorage、不跳页
```

---

## 结语

双 Token 就三句话：**access 短命冲锋，refresh 长命待命，过期自动续命**。难的从来不是配两个有效期，而是续期时的并发（单飞行）、边界（匿名 401 别踢人）、退出（黑名单才算真退出），再加登录口的爆破限流。把这四处做对，登录态就从“玄学掉线”变成“无感续航”。

下一篇预告：**《从 SQLite 到 PostgreSQL：Django 生产数据库迁移避坑》** —— 当评论点赞并发上来，SQLite 写锁会成为下一个瓶颈。到时讲 `pgloader` 一键迁移、PA 上配 Postgres、JSONB 存标签、全文检索替代 `icontains`，敬请期待。

> 完整代码：`backend/blog_api/settings.py`、`backend/blog_api/urls.py`、`frontend/src/stores/auth.js`、`frontend/src/api/client.js`、`frontend/src/router/index.js`
> 评论区聊聊：你的 access/refresh 设的多长？localStorage 还是 Cookie？为什么？
