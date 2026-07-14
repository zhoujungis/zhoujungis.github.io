"""Upload a photo to the photo wall via the authenticated admin API.

Usage:
    python upload_photo.py "C:/path/to/image.png" ["optional title"]

POSTs multipart/form-data to /api/admin/photos/. Creates a Photo record and
stores the file under MEDIA (photos/YYYY/MM/) on the backend.
"""
import mimetypes
import os
import sys
import urllib.request
import urllib.error
import uuid

from _auth import API_URL, get_token


def build_multipart(fields, file_field, filename, file_bytes, content_type):
    """Return (body_bytes, content_type_header) for a multipart/form-data POST."""
    boundary = f"----blogboundary{uuid.uuid4().hex}"
    crlf = b"\r\n"
    parts = []
    for name, value in fields.items():
        parts.append(f"--{boundary}".encode())
        parts.append(f'Content-Disposition: form-data; name="{name}"'.encode())
        parts.append(b"")
        parts.append(str(value).encode("utf-8"))
    parts.append(f"--{boundary}".encode())
    parts.append(
        f'Content-Disposition: form-data; name="{file_field}"; filename="{filename}"'.encode()
    )
    parts.append(f"Content-Type: {content_type}".encode())
    parts.append(b"")
    body = crlf.join(parts) + crlf + file_bytes + crlf + f"--{boundary}--".encode() + crlf
    return body, f"multipart/form-data; boundary={boundary}"


def main():
    if len(sys.argv) < 2:
        print("Usage: python upload_photo.py <image_path> [title]")
        sys.exit(1)

    path = sys.argv[1]
    title = sys.argv[2] if len(sys.argv) > 2 else ""  # empty = no caption

    if not os.path.isfile(path):
        print(f"File not found: {path}")
        sys.exit(1)

    with open(path, "rb") as f:
        file_bytes = f.read()

    filename = os.path.basename(path)
    content_type = mimetypes.guess_type(path)[0] or "application/octet-stream"

    body, ct_header = build_multipart(
        {"title": title, "description": ""},
        "image",
        filename,
        file_bytes,
        content_type,
    )

    token = get_token()
    req = urllib.request.Request(
        f"{API_URL}/admin/photos/",
        data=body,
        method="POST",
        headers={"Content-Type": ct_header, "Authorization": f"Bearer {token}"},
    )
    try:
        import json

        result = json.loads(urllib.request.urlopen(req).read())
        print(f"OK  photo #{result['id']} -> {result.get('image')}")
    except urllib.error.HTTPError as exc:
        print(f"ERR {exc.code}: {exc.read().decode('utf-8', errors='replace')[:400]}")
        sys.exit(1)


if __name__ == "__main__":
    main()
