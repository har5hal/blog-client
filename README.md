# Blog platform — frontend

A simple Next.js (App Router, TypeScript) frontend for the Blog Platform API.
Plain CSS, plain `useState`/`useEffect`, one auth context. No UI/form/state
libraries. The backend is a separate project; this app only depends on its
documented API contract (see `API.md`).

## How to run

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env.local` and set `API_URL` to the backend's URL
   (default `http://localhost:5000`). The backend must be running.
3. Start the dev server:
   ```
   npm run dev
   ```
4. Open the UI at http://localhost:3000.

## Other scripts

- `npm run build` — production build.
- `npm run lint` — ESLint.
- `npm run build:walkthrough` — regenerates `docs/ui-walkthrough.html`, the
  interactive code walkthrough for presenting this project to a reviewer.

## Project layout

- `app/` — pages (home, login, register, post detail/new/edit).
- `components/` — shared UI pieces (Navbar, PostForm, RequireAuth).
- `context/AuthContext.tsx` — the one place that tracks who is logged in.
- `lib/` — the `api()` fetch helper, shared types, and small post helpers.
- `next.config.ts` — rewrites `/api/*` to the backend, so the browser never
  calls the backend directly (avoids CORS).
- `docs/ui-walkthrough.html` — open this file directly in a browser; it is
  self-contained and needs no server.
