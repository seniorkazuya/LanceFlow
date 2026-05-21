# LanceFlow — Observability (DEV-007)

## Health endpoint

`GET /api/health` returns:

```json
{
  "status": "ok",
  "version": "a1d07f5",
  "timestamp": "2026-05-21T12:00:00.000Z",
  "checks": {
    "database": "ok",
    "redis": "skipped"
  }
}
```

| `checks.*` | Meaning |
|------------|---------|
| `ok` | Connected |
| `skipped` | `DATABASE_URL` / `REDIS_URL` not set |
| `error` | URL set but connection failed |

HTTP **503** when `status` is `degraded` (any check is `error`).

## Structured API logs

API routes log one JSON line per request via `@lanceflow/config` (`logApiEvent` / `withApiLogging`). No Authorization or cookie values in logs.

## Sentry (optional)

| Variable | Where |
|----------|--------|
| `SENTRY_DSN` | Server / edge |
| `NEXT_PUBLIC_SENTRY_DSN` | Browser (same DSN value) |
| `SENTRY_ORG`, `SENTRY_PROJECT` | Optional — source map upload |

Add to GitHub Environment secrets (`staging`, `production`) and Vercel project env vars. Omit DSN to disable Sentry (zero cost).

---

*DEV-007 — May 2026*
