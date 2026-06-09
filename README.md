<div align="center">

# LearningZone

**A full-stack university portal redesign**

Built to demonstrate what a modern, student-centric LMS could look like —  
designed and developed as a portfolio project for De Montfort University Dubai.

[![Frontend — Netlify](https://img.shields.io/badge/Frontend-Netlify-00C7B7?logo=netlify&logoColor=white)](#)
[![Backend — Render](https://img.shields.io/badge/Backend-Render-46E3B7?logo=render&logoColor=white)](#)
</div>

---

## Why this project exists

DMU Dubai's existing learning portal works, but it wasn't designed with the student experience in mind. This is a ground-up redesign that prioritises clarity, hierarchy, and accessibility — built to show professors and peers what a better portal could look like, using the same data and workflows but with a completely rethought interface.

---

## Pages

| Page | Description |
|------|-------------|
| **Login** | Student ID (`P` + 7 digits) and password auth. JWT stored in `localStorage`. |
| **Home** | Post-login landing page with course summary, announcements, communities, calendar, and quick actions. |
| **Dashboard** | Course dashboard with student stats, progress, deadlines, announcements, and notifications. |
| **Grades** | Grade overview page with assessment performance, score ring, and feedback details. |
| **Notifications** | Full notification inbox with filters for unread, read, and archived items. |
| **Course Materials** | Week-by-week materials list with slides, labs, and videos plus a video player modal. |
| **Assessments** | Assessment overview with active tasks, date sheet, and past assessment history. |
| **Course Info** | Course details, weighting breakdown, timeline, and instructor contact information. |
| **Resources** | Library links, external study resources, and student support contacts. |

---

## Tech stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 + TypeScript | UI framework |
| Vite 5 | Build tool (pinned — Vite 6 requires Node ≥ 20.19) |
| Tailwind CSS v3 | Utility-first styling |
| lucide-react | Icon library |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js 20 + Express 5 + TypeScript | API server |
| Prisma 5 | ORM (pinned — Prisma 7 requires Node ≥ 20.19) |
| SQLite | Database — auto-seeded on every deploy |
| JWT + bcryptjs | Authentication |

---

## Getting started locally

### Prerequisites

- **Node.js ≥ 20.14.0** — check with `node -v`

### 1 — Clone

```bash
git clone https://github.com/YOUR_USERNAME/learning-zone-redesign.git
cd learning-zone-redesign
```

### 2 — Backend

```bash
cd backend
cp .env.example .env        # fill in JWT_SECRET with any long random string
npm install
npx prisma migrate deploy   # create the SQLite schema
npm run db:seed             # seed the demo student account
npm run dev                 # API running at http://localhost:3001
```

### 3 — Frontend

```bash
cd frontend
npm install
npm run dev                 # app running at http://localhost:5173
```

> The frontend uses `VITE_API_BASE_URL` (defaults to `/api`). In dev, Vite proxies `/api/*` to the backend automatically — no extra config needed.

---

## Environment variables

### Backend — `backend/.env`

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `DATABASE_URL` | SQLite file path (relative to `backend/`) | `file:./dev.db` |
| `PORT` | Server port | `3001` |
| `FRONTEND_URL` | Comma-separated allowed CORS origins | `https://your-app.netlify.app,http://localhost:5173` |
| `JWT_SECRET` | Long random string for signing tokens — **change this** | `openssl rand -hex 64` |

### Frontend — `frontend/.env.local`

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Full backend API URL (leave blank for local `/api` proxy) | `https://learning-zone-api.onrender.com/api` |

---

## Deployment

### Backend → Render

1. Push this repo to GitHub.
2. Go to **render.com → New → Blueprint** and connect your repo.  
   Render detects `render.yaml` at the root and pre-fills the service config.
3. In the Render dashboard set these two env vars manually:
   - `JWT_SECRET` → a long random string (`openssl rand -hex 64`)
   - `FRONTEND_URL` → your Netlify URL (e.g. `https://learning-zone.netlify.app`)
4. Click **Deploy**. Render installs deps, compiles TypeScript, runs migrations, and seeds the DB automatically.
5. Copy your Render service URL (e.g. `https://learning-zone-api.onrender.com`).

> **Free tier note:** Render spins down services after 15 min of inactivity. The first request after a sleep takes ~30 s. Upgrade to a paid plan for always-on.

### Frontend → Netlify

1. In the Netlify dashboard connect your GitHub repo.
2. Configure the build:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/dist`
3. Add an environment variable under **Site settings → Environment variables**:
   - `VITE_API_BASE_URL` = `https://your-render-service.onrender.com/api`
4. **Trigger a redeploy** — Netlify must rebuild so the env var is baked into the JS bundle.

---

## Demo credentials

| Field | Value |
|-------|-------|
| Student ID | `P2936821` |
| Password | `IamStudent123` |

---

## Project structure

```
learning-zone-redesign/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma          # Data model
│   │   ├── migrations/            # Migration history
│   │   ├── seed.ts                # Dev seed (ts-node)
│   │   └── seed.js                # Prod seed (plain Node — no ts-node needed)
│   ├── src/
│   │   ├── index.ts               # Express entry point
│   │   └── routes/
│   │       ├── auth.ts            # POST /api/auth/login
│   │       ├── users.ts
│   │       ├── courses.ts
│   │       └── dashboard.ts
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Grades.tsx
│   │   │   ├── Notifications.tsx
│   │   │   ├── CourseMaterials.tsx
│   │   │   ├── Assessments.tsx
│   │   │   ├── CourseInfo.tsx
│   │   │   └── Resources.tsx
│   │   ├── lib/
│   │   │   ├── api.ts             # Typed fetch wrapper
│   │   │   └── utils.ts
│   │   └── App.tsx                # State-based router
│   └── package.json
├── render.yaml                    # One-click Render deployment blueprint
└── README.md
```

---

## Roadmap

- [ ] Connect My Courses and Dashboard to live API data
- [ ] Assignments submission flow
- [ ] Quizzes module
- [ ] Grade book with trend charts
- [ ] Mobile drawer for Course Materials
- [ ] Dark mode
- [ ] Push notifications for upcoming deadlines

---

## License

MIT
