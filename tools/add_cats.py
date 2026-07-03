import json, urllib.request
API='https://zhoujun123.pythonanywhere.com/api'

req=urllib.request.Request(f'{API}/token/', data=b'{"username":"zhoujun","password":"admin"}', headers={'Content-Type':'application/json'})
t=json.loads(urllib.request.urlopen(req).read())['access']

def api(method, path, data=None):
    url=f'{API}{path}'
    req=urllib.request.Request(url, method=method)
    req.add_header('Content-Type','application/json')
    req.add_header('Authorization',f'Bearer {t}')
    if data is not None:
        req.data=json.dumps(data).encode()
    resp=urllib.request.urlopen(req)
    if method=='DELETE': return
    return json.loads(resp.read())

# Create categories
cats={'tech':'技术教程','deploy':'部署指南','personal':'个人随笔'}
cat_ids={}
for s,n in cats.items():
    r=api('POST','/admin/categories/',{'name':n,'slug':s})
    cat_ids[s]=r['id']
    print(f'Category: {r["id"]} {n}')

# Create tags
tags={'vue':'Vue.js','django':'Django','github':'GitHub','pa':'PythonAnywhere','ai':'AI','gis':'GIS','deploy':'部署'}
tag_ids={}
for s,n in tags.items():
    r=api('POST','/admin/tags/',{'name':n,'slug':s})
    tag_ids[s]=r['id']
    print(f'Tag: {r["id"]} {n}')

# Get articles and assign categories
articles=api('GET','/articles/')
for a in articles['results']:
    aid=a['id']
    if '欢迎' in a['title']:
        api('PUT',f'/admin/articles/{aid}/',{'title':a['title'],'category_id':cat_ids['personal']})
        print(f'Article {aid} -> personal')
    elif 'Vue' in a['title'] or 'GitHub' in a['title']:
        api('PUT',f'/admin/articles/{aid}/',{'title':a['title'],'category_id':cat_ids['deploy']})
        print(f'Article {aid} -> deploy')
    elif 'Django' in a['title'] or 'PythonAnywhere' in a['title']:
        api('PUT',f'/admin/articles/{aid}/',{'title':a['title'],'category_id':cat_ids['deploy']})
        print(f'Article {aid} -> deploy')

print('Done!')
