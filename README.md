# Recruitment Platform

Multi-tenant recruitment platform for companies to manage recruiters, positions, applicants, and a public job board.

## Tech Stack

Backend:
- Node.js, Hono, TypeScript
- PostgreSQL
- Drizzle ORM
- Zod validation
- JWT auth with httpOnly cookie support
- Vitest unit tests

Frontend:
- Next.js App Router, TypeScript
- Tailwind CSS and shadcn/ui
- TanStack Query
- React Hook Form and Zod
- Vitest and React Testing Library component tests

## Repository Structure

```text
apps/
  backend/
    src/
    drizzle/
    postman/
    .env.example
  frontend/
    src/
    .env.example
docs/
  screenshots/
docker-compose.yml
pnpm-workspace.yaml
```

## Prerequisites

- Node.js compatible with the installed workspace dependencies
- pnpm 9.7.1 via Corepack
- Docker, if using the provided PostgreSQL compose service
- PostgreSQL 17 or compatible

## Environment Variables

Backend example: `apps/backend/.env.example`

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DATABASE
JWT_SECRET=your-secret-at-least-32-characters
FRONTEND_URL=http://localhost:3000
AUTH_COOKIE_NAME=access_token
AUTH_COOKIE_SAME_SITE=Lax
AUTH_COOKIE_MAX_AGE_SECONDS=86400
# Optional. Defaults to true when NODE_ENV=production, false otherwise.
# AUTH_COOKIE_SECURE=true
```

Frontend example: `apps/frontend/.env.example`

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Do not commit local secret files such as `.env` or `.env.local`.

## Setup and Run Order

1. Start database:

```bash
docker compose up -d postgres
```

2. Install dependencies:

```bash
corepack enable
corepack pnpm@9.7.1 install
```

3. Configure backend env:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Set `DATABASE_URL` for local compose:

```env
DATABASE_URL=postgresql://recruitment:recruitment@localhost:5432/recruitment
JWT_SECRET=your-local-secret-at-least-32-characters
FRONTEND_URL=http://localhost:3000
```

4. Run database migration:

```bash
corepack pnpm@9.7.1 --filter backend db:migrate
```

5. Seed database:

```bash
corepack pnpm@9.7.1 --filter backend db:seed
```

6. Run backend:

```bash
corepack pnpm@9.7.1 --filter backend dev
```

Backend runs on `http://localhost:3001`.

7. Configure frontend env:

```bash
cp apps/frontend/.env.example apps/frontend/.env.local
```

8. Run frontend:

```bash
corepack pnpm@9.7.1 --filter frontend dev
```

Frontend runs on `http://localhost:3000`.

## Seed Accounts

All seeded users use password:

```text
Password123!
```

Company A: `PT Maju Jaya`
- ADMIN: `admin.a@example.com`
- RECRUITER: `recruiter.a@example.com`

Company B: `PT Sukses Bersama`
- ADMIN: `admin.b@example.com`
- RECRUITER: `recruiter.b@example.com`

Use Company A and Company B accounts to verify multi-tenancy isolation.

## API Endpoints

Auth:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

`GET /api/auth/me` returns the current authenticated user with company context:

```json
{
  "id": "...",
  "companyId": "...",
  "companyName": "PT Maju Jaya",
  "email": "admin.a@example.com",
  "fullName": "Admin Company A",
  "role": "ADMIN"
}
```

Users:
- `POST /api/users`
- `GET /api/users`
- `GET /api/users/:id`
- `DELETE /api/users/:id`

`POST /api/users` is ADMIN-only and creates a recruiter in the current admin company. The request contract intentionally requires `role: "RECRUITER"` while the server still controls the assigned role.

```json
{
  "email": "recruiter@example.com",
  "password": "Password123!",
  "fullName": "Recruiter Example",
  "role": "RECRUITER"
}
```

Positions:
- `POST /api/positions`
- `GET /api/positions`
- `GET /api/positions/:id`
- `PUT /api/positions/:id`
- `DELETE /api/positions/:id`

Applicants:
- `POST /api/applicants`
- `GET /api/applicants`
- `GET /api/applicants/:id`
- `PATCH /api/applicants/:id/status`
- `PATCH /api/applicants/:id/notes`
- `DELETE /api/applicants/:id`

Public Positions:
- `GET /api/public/positions`
- `GET /api/public/positions/:id`

Postman collection:
- `apps/backend/postman/Recruitment Platform.postman_collection.json`
- `apps/backend/postman/Local.postman_environment.json`

## Authentication Decision

The backend issues JWT access tokens. Browser sessions use an httpOnly cookie set by the backend, and the frontend sends requests with `credentials: "include"`. The backend also accepts Bearer tokens for API clients and Postman.

Trade-off: httpOnly cookies keep the browser token out of JavaScript-accessible storage, while Bearer token support keeps the API convenient to test outside the browser.

## Frontend Routes

Public:
- `/`
- `/jobs/[id]`
- `/jobs/[id]/apply`
- `/login`
- `/register`

Internal:
- `/dashboard`
- `/positions`
- `/positions/new`
- `/positions/[id]`
- `/applicants`
- `/applicants/[id]`
- `/users`

`/users` is visible and usable only for ADMIN users. RECRUITER users are redirected away from the page.

Protected route auth guard behavior:
- `/api/auth/me` returns `200`: render protected content.
- `/api/auth/me` returns `401`: redirect to `/login`.
- `/api/auth/me` network failure or `5xx`: show an error state with Retry, do not redirect to `/login`, and do not render protected content until auth is verified.

## Validation Commands

Frontend:

```bash
cd apps/frontend
npm run lint
npx tsc --noEmit --incremental false
npm run build
npm run test:run
```

Use `--incremental false` if the local `tsconfig.tsbuildinfo` file is locked by the OS.

Backend:

```bash
cd apps/backend
npm run test:run
npm run build
```

## Screenshots

Screenshots captured with seeded data:

### Public Job Board

![Public job board](docs/screenshots/01-job-board.png)

### Public Job Detail

![Public job detail](docs/screenshots/02-job-detail.png)

### Dashboard

![Dashboard](docs/screenshots/03-dashboard.png)

### Positions

![Positions](docs/screenshots/04-positions.png)

### Applicants

![Applicants](docs/screenshots/05-applicants.png)

### Applicant Detail

![Applicant detail](docs/screenshots/06-applicant-detail.png)

## Technical Decisions and Trade-offs

- Frontend server state is managed with TanStack Query; no Redux or Zustand is used.
- JWT is not stored in localStorage.
- Browser authentication uses an httpOnly cookie, while Bearer tokens remain supported for API clients such as Postman.
- Public applications use `resumeUrl` because the backend contract expects a URL rather than file upload.
- Dashboard totals use API pagination metadata. Applicant counts per status use filtered applicant queries and `pagination.total`.
- Position applicant counts use the applicants endpoint filtered by `positionId` and read `pagination.total`.
- Public positions intentionally do not add frontend pagination because the backend public endpoint does not expose pagination.

## Docker Compose Full Stack

Run PostgreSQL, backend, and frontend together:

```bash
docker compose up --build
```

If host ports are already in use, override only the published ports:

```bash
BACKEND_PORT=13001 FRONTEND_PORT=13000 docker compose up --build
```

Services:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:3001`
- PostgreSQL: `localhost:5432`

The backend container waits for PostgreSQL, runs migrations, runs the idempotent seed script, then starts the API. The frontend image is built with `NEXT_PUBLIC_API_URL=http://localhost:3001` because browser requests are made from the host browser to the published backend port.

## Deployment

- Frontend: [Vercel](https://recruitment-platform-frontend-alpha.vercel.app)
- Backend: [Back4App](https://recruitmentplatformapi-5z2aucoz.b4a.run)
- Database: Neon PostgreSQL

> **Note:** The Back4App backend currently uses a temporary URL and may become unavailable after it expires.