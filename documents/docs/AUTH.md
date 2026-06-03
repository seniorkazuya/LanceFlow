# Authentication (CORE-002)

LanceFlow uses **Auth.js (NextAuth v5)** with a **credentials** provider for dev/staging. Auth helpers live in `packages/core/auth`; `apps/web` wires routes and middleware.

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `AUTH_SECRET` | Yes | Session signing secret (`openssl rand -base64 32`) |
| `AUTH_URL` | Local | App URL for Auth.js callbacks (e.g. `http://localhost:3000`) |
| `DEV_AUTH_EMAIL` | For sign-in | Allowed dev user email |
| `DEV_AUTH_PASSWORD` | For sign-in | Matching password |

Set the same values on **Vercel** (staging project — **Settings → Environment Variables**). GitHub **staging** secrets are for CI/migrations only; they do **not** inject `DEV_AUTH_*` into the running Vercel app unless you also add them in Vercel.

Sign-in compares credentials with **exact** string equality. A password that works in local `.env` will fail on staging if Vercel still has a different `DEV_AUTH_PASSWORD`.

## Routes

| Path | Purpose |
|------|---------|
| `/auth/signin` | Sign-in form |
| `/dashboard` | Protected page (middleware + server check) |
| `/api/auth/*` | Auth.js handlers |
| `/api/me` | Current session JSON (401 if anonymous) |

## Local sign-in

1. Copy `.env.example` → `.env` and set `AUTH_SECRET`, `DEV_AUTH_*`, `DATABASE_URL`.
2. `docker compose up -d` and `pnpm db:migrate:deploy`.
3. `pnpm dev` → http://localhost:3000/auth/signin

On first successful sign-in with `DEV_AUTH_*`, the user is **upserted** into `users` with role `OPS_MANAGER` (RBAC in CORE-003).

## Portal sign-up (clients & developers)

| Path | Account |
|------|---------|
| `/auth/signup` | Choose client or developer |
| `/auth/signup/client` | Client registration → role `CLIENT` |
| `/auth/signup/developer` | Developer registration → role `DEVELOPER` |
| `/auth/signin` | Email + password for all account types |

Registered users authenticate against `users.password_hash` (scrypt). Internal staff can still use `DEV_AUTH_*` when configured.

Requires migration `20260601120000_user_portal_auth` (`account_type`, `password_hash` on `users`).

## Production note

Credentials auth is for **controlled environments** only. Replace or extend with OAuth (Google, etc.) in a later story before broad production launch.
