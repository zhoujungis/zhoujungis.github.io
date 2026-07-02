# ZhouJun's Blog

[![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev/)
[![Django](https://img.shields.io/badge/Django-6.0-092E20?logo=django)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.17-A30000?logo=django)](https://www.django-rest-framework.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A personal blog built with **Vue 3** frontend and **Django REST Framework** backend. Features include article management, Markdown editing with Vditor, comment system, photo gallery, friend links, Live2D widget, and a full admin dashboard.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                  GitHub Pages                    │
│         (Static hosting via repo root)           │
│  ┌───────────────────────────────────────────┐  │
│  │         Vue 3 + Vite Frontend             │  │
│  │  (SPA with Vue Router, Pinia, Axios)       │  │
│  └──────────────────────┬────────────────────┘  │
│                         │ REST API               │
│                         │ (JSON over HTTP)       │
│  ┌──────────────────────▼────────────────────┐  │
│  │       PythonAnywhere (or local)           │  │
│  │   Django REST Framework Backend           │  │
│  │   (JWT auth, SQLite/PostgreSQL, etc.)     │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

| Layer    | Technology                        | Hosting           |
|----------|-----------------------------------|-------------------|
| Frontend | Vue 3, Vite, Vue Router, Pinia    | GitHub Pages      |
| Backend  | Django 6.0, DRF, SimpleJWT, SQLite | PythonAnywhere    |
| Admin    | Django Admin + custom Vue pages   | PythonAnywhere    |

---

## Getting Started

### Prerequisites

- Node.js >= 18
- Python >= 3.10
- Git

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The dev server starts at `http://localhost:5173`.

### Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate   # Linux/macOS
# venv\Scripts\activate    # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Create a superuser (admin)
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

The API server starts at `http://localhost:8000`.

### Environment Variables

Copy or set the following environment variables as needed:

| Variable               | Default                        | Description                      |
|------------------------|--------------------------------|----------------------------------|
| `VITE_API_BASE_URL`    | `http://localhost:8000/api/`  | Frontend API base URL (`.env`)   |
| `DEBUG`                | `True`                         | Django debug mode                |
| `ALLOWED_HOSTS`        | `*`                            | Django allowed hosts             |
| `DJANGO_SECRET_KEY`    | (dev key in settings.py)       | Django secret key (production)   |
| `CORS_ALLOWED_ORIGINS` | (all allowed in dev)           | CORS origins for production      |

For the frontend, create `frontend/.env`:

```
VITE_API_BASE_URL=http://localhost:8000/api/
```

---

## Deployment

### Frontend — GitHub Pages

1. Update `VITE_API_BASE_URL` in `frontend/.env` to point to your production API.
2. Run the deployment script:

```bash
cd frontend
bash deploy.sh
```

This builds the app and pushes the output to the repository root (where GitHub Pages serves from).

### Backend — PythonAnywhere

See [backend/pythonanywhere_deploy.md](backend/pythonanywhere_deploy.md) for detailed instructions.

Quick steps:

1. Upload code to PythonAnywhere (git clone or file upload).
2. Create a virtual environment and install dependencies.
3. Configure the WSGI file to point to your Django app.
4. Set environment variables (`DEBUG=False`, `ALLOWED_HOSTS`, etc.).
5. Run `migrate` and `collectstatic`.
6. Create a superuser.
7. Reload the web app.

### CORS Configuration

Add your GitHub Pages domain to Django's `CORS_ALLOWED_ORIGINS`:

```python
CORS_ALLOWED_ORIGINS = [
    'https://yourusername.github.io',
    'http://localhost:5173',
]
```

---

## Tech Stack

| Category     | Technology                                                    |
|-------------|---------------------------------------------------------------|
| Frontend    | Vue 3, Vue Router, Pinia, Axios, Vditor, Highlight.js, SCSS   |
| Backend     | Django 6.0, Django REST Framework, SimpleJWT, django-filter   |
| Build       | Vite 8                                                        |
| Database    | SQLite (dev), MySQL/PostgreSQL (production via PythonAnywhere)|
| Hosting     | GitHub Pages (frontend), PythonAnywhere (backend)             |
| Live2D      | Live2D Cubism widget for character display                   |

---

## Project Structure

```
/
├── frontend/           # Vue 3 SPA
│   ├── src/
│   │   ├── api/        # API client (Axios)
│   │   ├── components/ # Reusable Vue components
│   │   ├── pages/      # Route pages
│   │   │   └── admin/  # Admin dashboard pages
│   │   ├── App.vue
│   │   └── main.js
│   ├── public/
│   ├── index.html
│   ├── vite.config.js
│   └── deploy.sh       # GitHub Pages deploy script
├── backend/            # Django REST API
│   ├── blog_api/       # Django project config
│   ├── articles/       # Article app
│   ├── comments/       # Comment app
│   ├── photos/         # Photo gallery app
│   ├── friends/        # Friend links app
│   ├── accounts/       # User accounts
│   ├── manage.py
│   └── requirements.txt
├── docs/               # Additional docs
├── live2dw/            # Live2D widget assets
├── public-live2d/      # Live2D source assets
└── README.md
```

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
