"""Set cover_image on existing articles that lack one.

Uses the same Unsplash size params as today's article (id 17):
    ?w=1200&q=80&auto=format&fit=crop
Each image is topic-matched to the article.
"""
import json
import urllib.request
import urllib.error

from _auth import API_URL, get_token

Q = "?w=1200&q=80&auto=format&fit=crop"
BASE = "https://images.unsplash.com/"

# article id -> (unsplash photo slug, note)
COVERS = {
    16: ("photo-1498050108023-c5249f4df085", "Vue+Django blog build / code editor"),
    8:  ("photo-1499750310107-5fef28a66643", "welcome / workspace"),
    13: ("photo-1484480974693-6ca0a78fb36b", "productivity / desk"),
    15: ("photo-1620712943543-bcc4688e7485", "LLM benchmark / AI abstract"),
    14: ("photo-1555066931-4365d14bab8c", "AI coding tools / code"),
    12: ("photo-1551288049-bebda4e38f71", "test mgmt system / dashboard"),
    11: ("photo-1558002038-1055907df827", "Matter smart home / IoT"),
    10: ("photo-1558494949-ef010cbdcc31", "Django deploy / servers"),
    9:  ("photo-1451187580459-43490279c0fa", "Vue deploy / network globe"),
}

token = get_token()

for aid, (slug, note) in COVERS.items():
    url = f"{BASE}{slug}{Q}"
    req = urllib.request.Request(
        f"{API_URL}/admin/articles/{aid}/",
        data=json.dumps({"cover_image": url}).encode("utf-8"),
        method="PATCH",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
    )
    try:
        result = json.loads(urllib.request.urlopen(req).read())
        print(f"OK  {aid}: {note}\n    -> {result.get('cover_image')}")
    except urllib.error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        print(f"ERR {aid}: {exc.code} {body[:200]}")
