import json, urllib.request, urllib.error

API = 'https://zhoujun123.pythonanywhere.com/api'
UN, PW = 'zhoujun', 'admin'

def api(method, path, data=None):
    url = f'{API}{path}'
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    if data is not None:
        req.data = json.dumps(data).encode()
    if '/token/' not in path:
        tr = urllib.request.Request(f'{API}/token/',
            data=json.dumps({'username': UN, 'password': PW}).encode(),
            headers={'Content-Type': 'application/json'})
        token = json.loads(urllib.request.urlopen(tr).read())['access']
        req.add_header('Authorization', f'Bearer {token}')
    try:
        resp = urllib.request.urlopen(req)
        if method == 'DELETE': return True
        return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f'{method} {path} -> {e.code}: {body[:150]}')
        return None

# Delete ALL existing articles
articles = api('GET', '/articles/')
if articles:
    for a in articles.get('results', []):
        api('DELETE', f'/admin/articles/{a["id"]}/')
        print(f'Deleted #{a["id"]}')

# Create
with open('tools/article_content.md', encoding='utf-8') as f:
    content = f.read()

article = {'title': '欢迎来到我的博客', 'slug': 'welcome', 'content': content, 'status': 'published', 'is_top': True}
result = api('POST', '/admin/articles/', article)
if result:
    print(f'Created #{result["id"]} - OK')
else:
    print('FAILED')
