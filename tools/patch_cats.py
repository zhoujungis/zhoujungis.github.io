import json, urllib.request
API = 'https://zhoujun123.pythonanywhere.com/api'
req = urllib.request.Request(f'{API}/token/', data=b'{"username":"zhoujun","password":"admin"}', headers={'Content-Type': 'application/json'})
t = json.loads(urllib.request.urlopen(req).read())['access']

mapping = {8: 3, 9: 2, 10: 2}  # article_id -> category_id
for aid, cid in mapping.items():
    data = json.dumps({'category_id': cid}).encode()
    req = urllib.request.Request(f'{API}/admin/articles/{aid}/', data=data, headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {t}'}, method='PATCH')
    try:
        r = json.loads(urllib.request.urlopen(req).read())
        print(f'Article {aid} -> cat {r.get("category", {}).get("name", "?")}')
    except urllib.error.HTTPError as e:
        print(f'Article {aid}: {e.code} {e.read().decode()[:100]}')
print('Done')
