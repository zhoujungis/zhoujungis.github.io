"""Update article with clean README content."""
import urllib.request, json, re

API = 'https://zhoujun123.pythonanywhere.com/api'

# Login
req = urllib.request.Request(f'{API}/token/', data=json.dumps({'username': 'zhoujun', 'password': 'admin'}).encode(), headers={'Content-Type': 'application/json'})
token = json.loads(urllib.request.urlopen(req).read())['access']

# Read README
with open('README.md', encoding='utf-8') as f:
    content = f.read()

# Remove first # heading line (up to first ##)
content = re.sub(r'^# .*?\n(?=##)', '', content, flags=re.DOTALL).strip()

# Delete old article
for aid in [3]:
    req = urllib.request.Request(f'{API}/admin/articles/{aid}/', method='DELETE', headers={'Authorization': f'Bearer {token}'})
    try: urllib.request.urlopen(req); print(f'Deleted {aid}')
    except: pass

# Create
article = {'title': '欢迎来到我的博客', 'slug': 'welcome', 'content': content, 'status': 'published', 'is_top': True}
req = urllib.request.Request(f'{API}/admin/articles/', data=json.dumps(article).encode(), headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {token}'})
result = json.loads(urllib.request.urlopen(req).read())
print(f'Created article {result["id"]}: {result["title"]}')
