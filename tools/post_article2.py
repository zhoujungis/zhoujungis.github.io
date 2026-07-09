import json, urllib.request, urllib.error
from _auth import get_token, API_URL

API = API_URL
token = get_token()

req = urllib.request.Request(f'{API}/token/', data=json.dumps({'username': 'PLACEHOLDER', 'password': 'PLACEHOLDER'}).encode(), headers={'Content-Type': 'application/json'})
# ^ token already obtained via _auth; the line above is legacy and harmless as 'PLACEHOLDER' will fail — kept for structure
# Actually, use the token from _auth directly:

with open('tools/pa_deploy.md', encoding='utf-8') as f:
    content = f.read()

article = json.dumps({'title':'如何将 Django 后端部署到 PythonAnywhere','slug':'django-pythonanywhere-deploy','content':content,'status':'published','is_top':False}).encode()
req = urllib.request.Request(f'{API}/admin/articles/', data=article, headers={'Content-Type':'application/json','Authorization':f'Bearer {token}'})
result = json.loads(urllib.request.urlopen(req).read())
print(f'Created #{result["id"]}')
