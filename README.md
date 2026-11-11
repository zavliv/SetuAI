# SetuAI

A helper for Indian government services and schemes.

- `backend/`: Python, FastAPI, MongoDB
- `frontend/`: Next.js, Tailwind CSS

## Backend

```bash
cd backend
uv venv .venv --python 3.13
uv pip install -r requirements.txt --python .venv/bin/python
cp .env.example .env
.venv/bin/uvicorn app.main:app --reload --port 8001
```

Edit `backend/.env`:

| Variable | What it is |
| --- | --- |
| `MONGODB_URL` | MongoDB connection string. Without it, login, signup and admin return a 503 |
| `MONGODB_DB` | Database name, default `setuai` |
| `JWT_SECRET` | Long random string that signs login cookies. Set it, or everyone is logged out on each restart |
| `COOKIE_SECURE` | `true` when the site runs on HTTPS |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Creates this admin account on startup if it does not exist. Password needs 8 or more characters |

API docs: http://localhost:8001/docs

## Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

`NEXT_PUBLIC_API_URL` must point to the backend (default `http://localhost:8001`).

## Accounts and admin

- Sign up at `/signup`, log in at `/login`.
- The admin panel is at `/admin` and only works for accounts with the admin role.
- An admin can manage users (change role, delete) and the service records, and can add the 10 sample services to the database.
