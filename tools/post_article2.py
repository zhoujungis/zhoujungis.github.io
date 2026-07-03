import json, urllib.request, urllib.error
API = 'https://zhoujun123.pythonanywhere.com/api'

req = urllib.request.Request(f'{API}/token/', data=json.dumps({'username':'zhoujun','password':'admin'}).encode(), headers={'Content-Type':'application/json'})
token = json.loads(urllib.request.urlopen(req).read())['access']

with open('tools/pa_deploy.md', encoding='utf-8') as f:
    content = f.read()

article = json.dumps({'title':'如何将 Django 后端部署到 PythonAnywhere','slug':'django-pythonanywhere-deploy','content':content,'status':'published','is_top':False}).encode()
req = urllib.request.Request(f'{API}/admin/articles/', data=article, headers={'Content-Type':'application/json','Authorization':f'Bearer {token}'})
result = json.loads(urllib.request.urlopen(req).read())
print(f'Created #{result["id"]}')
