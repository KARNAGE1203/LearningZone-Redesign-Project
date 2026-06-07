# Learning Zone Redesign Project

A modern redesign of the Learning Zone platform with a full-stack architecture.

## Overview

- **Backend:** Node.js + TypeScript, Prisma ORM, authentication, course and user management.
- **Frontend:** Vite + React + TypeScript, Tailwind CSS, page-based learning experience.

## Repository Structure

- `backend/` — server code, Prisma schema, routes, and middleware.
- `frontend/` — React app with pages for login, dashboard, courses, and course materials.

## Getting Started

1. Install dependencies
   - `cd backend && npm install`
   - `cd frontend && npm install`
2. Configure environment variables for the backend (database URL, auth secrets).
3. Run the backend and frontend in development mode.

### Local development

- Start the backend: `cd backend && npm run dev`
- Start the frontend: `cd frontend && npm run dev`
- Login with demo credentials: `P2936821` / `IamStudent123`

### Production deployment

The frontend is static and needs a separately hosted backend.

1. Deploy the backend to a server or cloud host (Render, Railway, Fly, Heroku, etc.).
2. Add the backend URL to the frontend using `VITE_API_BASE_URL`.
3. In Netlify, set `VITE_API_BASE_URL` to `https://your-backend.example.com/api`.
4. Ensure the backend CORS allows your Netlify site origin.

## Notes

This repository is named **Learning Zone Redesign Project**.

## License

This project is available under the terms of the repository license.
