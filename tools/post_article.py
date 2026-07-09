import json, urllib.request, urllib.error
from _auth import get_token, API_URL

API = API_URL
token = get_token()

def api(method, path, data=None):
    url = f'{API}{path}'
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    if '/token/' not in path:
        req.add_header('Authorization', f'Bearer {token}')
    if data is not None:
        req.data = json.dumps(data).encode()
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
