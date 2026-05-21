# @lanceflow/auth

Authentication helpers for LanceFlow (CORE-002). Session provider wiring lives in `apps/web`; this package owns credential validation and user upsert on sign-in.

## Exports

- `resolveDevAuthConfig` / `validateDevCredentials` — dev/staging credentials provider
- `findOrCreateUserForSignIn` — upsert `User` after successful auth
- `SessionUser` — typed session payload for API routes and server components

## Environment

See root `.env.example`: `AUTH_SECRET`, `DEV_AUTH_EMAIL`, `DEV_AUTH_PASSWORD`.
