import urllib.request, json

API = 'https://zhoujun123.pythonanywhere.com/api'

# Step 1: Login
req = urllib.request.Request(
    f'{API}/token/',
    data=json.dumps({'username': 'zhoujun', 'password': 'admin'}).encode(),
    headers={'Content-Type': 'application/json'}
)
token = json.loads(urllib.request.urlopen(req).read())['access']
print(f'Token OK: {token[:20]}...')

# Step 2: Create article
article = {
    'title': '关于我和这个博客',
    'slug': 'about-blog',
    'content': '\n'.join([
        '### 关于我',
        '',
        '我是 Zhou Jun，一名热爱技术与科学的学生。',
        '',
        '我喜欢旅行和摄影。虽然是一个编程新手，但我希望能和大家多多交流，一起进步！',
        '',
        '### 关于这个博客',
        '',
        '博客采用 Vue 3 + Django 前后端分离架构，前端部署在 GitHub Pages，后端部署在 PythonAnywhere。',
        '',
        '通过这个博客，我希望分享我的学习心得和生活点滴，期待和大家交流讨论。',
        '',
        '### 我的研究方向',
        '',
        '主要从事遥感与地理信息系统相关工作，包括遥感图像分类、空间分析、WebGIS 系统等，涉及深度学习、系统开发等相关知识。',
        '',
        '希望能有志同道合的同学一起交流，共同进步！',
        '',
        '### 技术栈',
        '',
        '- 前端: Vue 3 + Vite + Vue Router + Pinia + Axios + Vditor + SCSS',
        '- 后端: Django + Django REST Framework + SimpleJWT + SQLite',
        '- 部署: GitHub Pages + PythonAnywhere',
        '',
        '### 联系方式',
        '',
        'GitHub: [github.com/zhoujungis](https://github.com/zhoujungis)',
        '',
        '欢迎来我的 GitHub 逛逛！',
    ]),
    'status': 'published',
    'is_top': True,
}

req2 = urllib.request.Request(
    f'{API}/admin/articles/',
    data=json.dumps(article).encode(),
    headers={
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {token}',
    }
)
result = json.loads(urllib.request.urlopen(req2).read())
print(f'Article created: id={result["id"]}, title={result["title"]}')
print('Done!')
