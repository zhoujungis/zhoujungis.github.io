import json, urllib.request
from _auth import get_token, API_URL

API = API_URL
token = get_token()

with open('tools/pa_deploy.md', encoding='utf-8') as f:
    content = f.read()

article = json.dumps({'title':'如何将 Django 后端部署到 PythonAnywhere','slug':'django-pythonanywhere-deploy','content':content,'status':'published','is_top':False}).encode()
req = urllib.request.Request(f'{API}/admin/articles/', data=article, headers={'Content-Type':'application/json','Authorization':f'Bearer {token}'})
result = json.loads(urllib.request.urlopen(req).read())
print(f'Created #{result["id"]}')
