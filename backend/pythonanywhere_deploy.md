# PythonAnywhere Deployment Guide

Deploy the Django REST API backend for ZhouJun's Blog to PythonAnywhere.

---

## 1. Upload Code

### Option A: Clone from GitHub (recommended)

1. Open a PythonAnywhere **Bash console**.
2. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
   cd YOUR_REPO/backend
   ```

### Option B: Upload via web interface

1. Go to **Dashboard > Files**.
2. Upload all backend files into a directory (e.g. `/home/yourusername/blog/backend`).

---

## 2. Set Up Virtual Environment

In the PythonAnywhere Bash console:

```bash
# Navigate to your backend directory
cd ~/YOUR_REPO/backend

# Create a virtual environment (use the same Python version as your project)
python3.12 -m venv venv

# Activate it
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

> Make sure the Python version matches your local environment. PythonAnywhere currently supports Python 3.10, 3.11, and 3.12.

---

## 3. Configure WSGI File

PythonAnywhere uses a WSGI file to serve your Django app.

1. Go to **Dashboard > Web > Web app** (or create a new web app with Manual Configuration).
2. Find the **WSGI configuration file** section — click the link to edit `/var/www/yourusername_pythonanywhere_com_wsgi.py`.
3. Replace the contents with:

```python
import os
import sys

# Add your project directory to the Python path
path = '/home/yourusername/YOUR_REPO/backend'
if path not in sys.path:
    sys.path.append(path)

# Set the Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'blog_api.settings'

# Option A: Use the project's own wsgi.py
from django.core.wsgi import get_wsgi_application
application = get_wsgi_application()
```

Replace:
- `yourusername` — your PythonAnywhere username
- `YOUR_REPO` — your repository name

---

## 4. Configure Environment Variables

In your Django `settings.py`, **or** via PythonAnywhere's **Web > Environment variables** section, set:

```
DEBUG=False
ALLOWED_HOSTS=yourusername.pythonanywhere.com
CORS_ALLOWED_ORIGINS=https://yourusername.github.io
DJANGO_SECRET_KEY=your-production-secret-key
```

> **Important**: Generate a new `SECRET_KEY` for production. You can generate one by running:
> ```python
> from django.core.management.utils import get_random_secret_key
> print(get_random_secret_key())
> ```

Update `settings.py` to read from environment variables:

```python
import os

DEBUG = os.environ.get('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '*').split(',')

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', 'fallback-dev-key')

CORS_ALLOWED_ORIGINS = os.environ.get('CORS_ALLOWED_ORIGINS', '').split(',')
if not CORS_ALLOWED_ORIGINS or CORS_ALLOWED_ORIGINS == ['']:
    CORS_ALLOW_ALL_ORIGINS = True
else:
    CORS_ALLOW_ALL_ORIGINS = False
```

---

## 5. Configure Static and Media Files

### Static files

In `settings.py`, add:

```python
STATIC_ROOT = BASE_DIR / 'staticfiles'
STATIC_URL = 'static/'
```

Then run:

```bash
python manage.py collectstatic
```

On PythonAnywhere, configure the static files mapping in **Web > Static Files**:

| URL | Directory |
|-----|-----------|
| `/static/` | `/home/yourusername/YOUR_REPO/backend/staticfiles` |

### Media files

In `settings.py` (already configured):

```python
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'
```

On PythonAnywhere, configure the media files mapping in **Web > Static Files**:

| URL | Directory |
|-----|-----------|
| `/media/` | `/home/yourusername/YOUR_REPO/backend/media` |

---

## 6. Run Migrations

In the PythonAnywhere Bash console:

```bash
cd ~/YOUR_REPO/backend
source venv/bin/activate
python manage.py migrate
```

---

## 7. Create Superuser

```bash
cd ~/YOUR_REPO/backend
source venv/bin/activate
python manage.py createsuperuser
```

Follow the prompts to set up your admin username, email, and password.

---

## 8. Reload the Web App

After making any changes, go to **Dashboard > Web** and click the **Reload** button for your web app.

---

## 9. CORS Configuration

Make sure your GitHub Pages domain is included in `CORS_ALLOWED_ORIGINS`:

```python
# Example for settings.py
CORS_ALLOWED_ORIGINS = [
    'https://yourusername.github.io',
    'http://localhost:5173',  # For local development
]
```

> If you use a custom domain, add it here as well.

---

## Troubleshooting

- **500 Internal Server Error**: Check the server error log at **Web > Error log**.
- **Static files not loading**: Verify the static files mapping paths and run `collectstatic`.
- **CORS errors in browser**: Verify the `CORS_ALLOWED_ORIGINS` setting includes your frontend domain.
- **Module not found**: Make sure your virtual environment is activated and all dependencies are installed.
- **Database errors**: Run `python manage.py migrate` to apply all pending migrations.
