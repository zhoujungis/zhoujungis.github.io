import json, urllib.request, urllib.error

API = 'https://zhoujun123.pythonanywhere.com/api'
UN, PW = 'zhoujun', 'admin'

def api(method, path, data=None):
    url = f'{API}{path}'
    req = urllib.request.Request(url, method=method)
    req.add_header('Content-Type', 'application/json')
    if data is not None:
        req.data = json.dumps(data).encode('utf-8')
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
        print(f'{method} {path} -> {e.code}: {body[:250]}')
        return None

# Step 1: List all existing tags
print("=== All existing tags ===")
all_tags = api('GET', '/admin/tags/?limit=100')
tag_by_name = {}
tag_by_slug = {}
if all_tags:
    for t in all_tags.get('results', []):
        tag_by_name[t['name'].lower()] = t
        tag_by_slug[t['slug'].lower()] = t
        print(f"  id={t['id']}: '{t['name']}' (slug={t['slug']})")

# Step 2: Create missing tags (using proper names with English slugs)
needed_tags = [
    ('Vue', 'vuejs'),
    ('Django', 'django-fw'),
    ('前端', 'frontend-dev'),
    ('后端', 'backend-dev'),
    ('GitHub Pages', 'github-pages-deploy'),
    ('PythonAnywhere', 'pa-deploy'),
    ('博客搭建', 'blog-building-dev'),
    ('技术分享', 'tech-sharing-dev'),
]

tag_ids = []
for name, slug in needed_tags:
    key = name.lower()
    if key in tag_by_name:
        tid = tag_by_name[key]['id']
        print(f"OK '{name}' -> id={tid}")
        tag_ids.append(tid)
    elif slug in tag_by_slug:
        tid = tag_by_slug[slug]['id']
        print(f"OK (by slug) '{name}' -> id={tid}")
        tag_ids.append(tid)
    else:
        r = api('POST', '/admin/tags/', {'name': name, 'slug': slug})
        if r:
            print(f"CREATED '{name}' -> id={r['id']}")
            tag_ids.append(r['id'])
            tag_by_name[name.lower()] = r
        else:
            print(f"FAILED: '{name}' (slug={slug})")

# Step 3: Update article with tags_ids
print(f"\n=== Updating article with tag IDs: {tag_ids} ===")
article = api('GET', '/articles/blog-tech-stack/')
if article:
    aid = article['id']
    result = api('PATCH', f'/admin/articles/{aid}/', {'tags_ids': tag_ids})
    if result:
        print(f"PATCH OK! tags={[t['name'] for t in result.get('tags', [])]}")
    else:
        print("PATCH failed, trying PUT...")
        result = api('PUT', f'/admin/articles/{aid}/', {
            'title': article['title'],
            'slug': article['slug'],
            'content': article['content'],
            'status': 'published',
            'is_top': True,
            'tags_ids': tag_ids,
        })
        if result:
            print(f"PUT OK! tags={[t['name'] for t in result.get('tags', [])]}")

# Step 4: Verify
print("\n=== Verification ===")
a = api('GET', '/articles/blog-tech-stack/')
if a:
    print(f"Title: {a['title']}")
    print(f"Status: {a['status']}")
    print(f"is_top: {a.get('is_top')}")
    print(f"Tags ({len(a.get('tags', []))}): {[t['name'] for t in a.get('tags', [])]}")
    print(f"HTML rendered: {len(a.get('html_content', ''))} chars")
    print(f"URL: https://zhoujungis.github.io/article/blog-tech-stack")

print("\nDone!")
