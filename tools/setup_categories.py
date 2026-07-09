import json, urllib.request, urllib.error
from _auth import get_token, API_URL

API = API_URL

def api(method, path, data=None):
    url = f'{API}{path}'
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    token = get_token()
    req.add_header('Authorization', f'Bearer {token}')
    if data is not None:
        req.data = json.dumps(data).encode()
    resp = urllib.request.urlopen(req)
    if method == 'DELETE': return True
    return json.loads(resp.read())

# Create categories
cats = {
    'tech': '技术教程',
    'deploy': '部署指南',
    'personal': '个人随笔',
}
for slug, name in cats.items():
    result = api('POST', '/admin/categories/', {'name': name, 'slug': slug})
    print(f'Category: {result["id"]} {result["name"]}')

# Get article list
articles = api('GET', '/articles/')
article_map = {}
for a in articles['results']:
    article_map[a['title']] = a['id']

# Get category IDs
cat_list = api('GET', '/admin/categories/')
cat_map = {}
for c in cat_list.get('results', cat_list):
    cat_map[c['slug']] = c['id']

print(f'Articles: {article_map}')
print(f'Categories: {cat_map}')

# Assign categories
mapping = {
    '欢迎来到我的博客': 'personal',
    '如何将 Vue 前端部署到 GitHub Pages': 'deploy',
    '如何将 Django 后端部署到 PythonAnywhere': 'deploy',
}

for title, cat_slug in mapping.items():
    if title in article_map and cat_slug in cat_map:
        aid = article_map[title]
        cid = cat_map[cat_slug]
        api('PUT', f'/admin/articles/{aid}/', {'title': title, 'category_id': cid})
        print(f'Updated #{aid} -> {cat_slug}')

print('Done!')
