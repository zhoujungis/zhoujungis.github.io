import json
import urllib.request
from _auth import API_URL

url = f"{API_URL}/articles/?page_size=200"
counts = {}
total = 0
while url:
    data = json.loads(urllib.request.urlopen(url).read())
    if isinstance(data, list):
        items, url = data, None
    else:
        items, url = data.get("results", []), data.get("next")
    for a in items:
        name = (a.get("category") or {}).get("name", "未分类")
        counts[name] = counts.get(name, 0) + 1
        total += 1

for name, n in sorted(counts.items(), key=lambda kv: -kv[1]):
    print(f"{name:8s} {n}")
print("total", total)
