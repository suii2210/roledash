# RoleDash - Full-Stack Role-Based Auth Demo

RoleDash is a minimal Express + MongoDB backend paired with a Next.js (App Router) frontend that implements signup/login with role selection, protected dashboards, and JWT authentication. It is designed to showcase full-stack integration and can be deployed on AWS EC2 for both backend and frontend (you can still adapt the instructions for other providers if needed).

## Features
- Role-aware signup & login with bcrypt password hashing and JWT issuance.
- Protected dashboard route that greets the authenticated user with their role (`User` or `Admin`).
- Native MongoDB driver targeting MongoDB Atlas (free tier ready).
- Next.js + Tailwind UI with react-hook-form + Zod validation, client-side session storage, and logout handling.
- Environment templates plus deployment notes focused on AWS EC2.

## Project Structure
```
.
|-- backend/           # Express API + MongoDB driver
|-- frontend/          # Next.js 15 App Router client
|-- .env.example       # Root-level env template (frontend + backend)
`-- README.md
```

## Requirements
- Node.js 20+
- npm 10+
- MongoDB database (MongoDB Atlas free tier recommended)

## Setup
1. Copy `.env.example` to `.env` at the repo root (or manage envs per app as noted below) and fill in real values.
2. Install dependencies in both workspaces:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

### Backend (`backend/`)
1. Duplicate `backend/.env` (already populated with placeholders) and add your MongoDB Atlas connection values:
   ```ini
   DATABASE_URL="mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/DB_NAME?retryWrites=true&w=majority"
   MONGODB_DB="DB_NAME"
   JWT_SECRET="super-secret-string"
   PORT=4000
   CLIENT_URL="http://localhost:3000"
   ```
2. Start the API:
   ```bash
   npm run dev
   ```
   The server listens on `http://localhost:4000`.

### Frontend (`frontend/`)
1. Create `frontend/.env.local` with:
   ```ini
   NEXT_PUBLIC_API_URL="http://localhost:4000"
   ```
2. Launch the dev server:
   ```bash
   npm run dev
   ```
   The app is available at `http://localhost:3000`.

## API Overview
| Method | Endpoint     | Description                    |
|--------|--------------|--------------------------------|
| POST   | `/auth/signup` | Creates a user with role (User/Admin); returns `{ user, token }`. |
| POST   | `/auth/login`  | Authenticates and returns `{ user, token }`. |
| GET    | `/auth/me`     | Requires `Authorization: Bearer <token>`; returns `{ user }`. |

Passwords are hashed with `bcrypt`, tokens expire after 24h, and routes require `JWT_SECRET`. The MongoDB driver persists users directly to Atlas, and the server ensures the unique email index exists at startup.

## Deployment Notes
Production URLs
- Backend API: `https://api.roledash.suii.dev`
- Frontend app: `https://roledash.suii.dev`

1. **Backend (AWS EC2)**
   - Provision an EC2 instance (Node.js 20+, npm 10+) and deploy the `backend/` directory as a service (PM2/systemd/docker all work).
   - Set env vars: `DATABASE_URL`, `MONGODB_DB`, `JWT_SECRET`, `PORT`, and `CLIENT_URL`. In production, set `CLIENT_URL=https://roledash.suii.dev`.
   - No migration step is required; the API automatically ensures indexes such as the unique email constraint when it boots.

2. Frontend (AWS EC2)
   - On the same (or another) EC2 host install Node.js 20+, clone/pull the repo, then inside `frontend/` run `npm install`, `npm run build`, and serve with `npm run start` (or a process manager like PM2). Use Nginx/ALB to handle HTTPS and proxy traffic to port 3000.
   - Set `NEXT_PUBLIC_API_URL=https://api.roledash.suii.dev` before building so the compiled client targets the correct backend.

3. Update this README with the deployed URLs once both services are live.

## Development Tips
- **Linting:** `cd frontend && npm run lint`
- **Hot reload:** `npm run dev` in each workspace.

## Next Steps / Enhancements
- Add CRUD widgets scoped per user or admin.
- Extend dashboards with role-specific cards or analytics.
- Add integration tests (Jest / React Testing Library) and API tests (Vitest/Supertest).
"# roledash" 
