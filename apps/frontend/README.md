# Recruitment Platform Frontend

Next.js frontend for the recruitment platform technical test. The app provides the public job board, applicant application flow, and authenticated company dashboard for positions, applicants, and recruiter management.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui
- TanStack Query
- React Hook Form + Zod
- Vitest + React Testing Library

## Environment

Create `apps/frontend/.env.local` from `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Browser auth uses the backend httpOnly cookie session. API requests are sent with `credentials: "include"`; JWTs are not stored in localStorage.

## Routes

Public:
- `/`
- `/jobs/[id]`
- `/jobs/[id]/apply`
- `/login`
- `/register`

Protected:
- `/dashboard`
- `/positions`
- `/positions/new`
- `/positions/[id]`
- `/applicants`
- `/applicants/[id]`
- `/users`

`/users` is ADMIN-only. RECRUITER users do not see the Users menu and are redirected away from `/users`.

## Auth Guard Behavior

Protected routes use `/api/auth/me` as the source of truth:

- `200`: render protected content
- `401`: redirect to `/login`
- network error or `5xx`: show an auth error state with Retry and keep protected content hidden

The Retry action refetches `/api/auth/me`; if the session cookie is still valid and the backend comes back, the protected page renders without requiring a new login.

## Scripts

```bash
npm run dev
npm run lint
npx tsc --noEmit --incremental false
npm run build
npm run test:run
```

Use `--incremental false` for local typecheck if `tsconfig.tsbuildinfo` is locked by the OS.

## Docker

From the repository root:

```bash
docker compose up --build
```

Frontend runs on `http://localhost:3000` by default and calls the backend at `http://localhost:3001`.
