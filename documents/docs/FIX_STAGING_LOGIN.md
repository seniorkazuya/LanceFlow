# Fix guide — staging login & DATABASE_URL

**Staging app:** https://lance-flow-web.vercel.app  
**Sign-in:** https://lance-flow-web.vercel.app/auth/signin  
**Diagnostics:** https://lance-flow-web.vercel.app/api/diagnostics/auth  

> Do **not** use `/api/auth/setup` — NextAuth returns `"Bad request."` on that path. Use **`/api/diagnostics/auth`** instead.

---

## 1. Check diagnostics (30 seconds)

Open in the browser:

```
https://lance-flow-web.vercel.app/api/diagnostics/auth
```

You want:

```json
{
  "ready": true,
  "checks": {
    "devAuthEmail": true,
    "devAuthPassword": true,
    "authSecret": true,
    "authUrl": "https://lance-flow-web.vercel.app",
    "databaseUrl": true
  }
}
```

If any `checks` value is `false`, fix that variable on Vercel (step 2), then redeploy (step 4).

`expectedLogin.email` shows the **only** email Vercel accepts (usually `ops@lanceflow.test`).

---

## 2. Vercel environment variables (exact checklist)

**Vercel** → project **lance-flow-web** → **Settings** → **Environment Variables**

For **each** variable: enable **Production** and **Preview** (your screenshot already shows both — good).

| Variable | What to put |
|----------|-------------|
| `DATABASE_URL` | Neon **pooled** connection string to database `lanceflow` (see step 3) |
| `AUTH_SECRET` | Long random string (32+ chars). Same value you use locally is fine. |
| `AUTH_URL` | `https://lance-flow-web.vercel.app` — **no** trailing slash, **not** `http://localhost:3000` |
| `DEV_AUTH_EMAIL` | `ops@lanceflow.test` |
| `DEV_AUTH_PASSWORD` | Your password — type in Vercel UI **without** surrounding `"` quotes |

**Common mistakes**

- `AUTH_URL` still set to `http://localhost:3000` → sign-in/cookies break on staging.
- Password only in local `.env` but different on Vercel → always fails on staging.
- Variables only on **Development** tab → not used; need **Production + Preview**.
- Extra newline when pasting password → fixed in app (trim); still re-save password once.

---

## 3. DATABASE_URL (Neon)

Use the **pooled** host (`-pooler` in hostname) and database name **`lanceflow`**:

```text
postgresql://USER:PASSWORD@ep-xxxx-pooler.region.aws.neon.tech/lanceflow?sslmode=require
```

**Recommended for Vercel:** omit `channel_binding=require` (can cause connection issues on some runtimes). If login/DB still fails, use only:

```text
?sslmode=require
```

**After changing `DATABASE_URL` on Vercel:**

1. Save variables.
2. Run migrations (step 4) so tables exist in the `lanceflow` database.
3. Confirm health: https://lance-flow-web.vercel.app/api/health → `"database":"ok"`.

**GitHub `staging` environment** must use the **same** `DATABASE_URL` secret (for Deploy Staging migrate job).  
Repo → **Settings** → **Environments** → **staging** → `DATABASE_URL` = same Neon URL as Vercel.

---

## 4. Redeploy (if Vercel “Redeploy” failed)

Use **GitHub Actions** (reliable for this repo):

1. https://github.com/seniorkazuya/LanceFlow/actions/workflows/deploy-staging.yml  
2. **Run workflow** → branch **`staging`** → Run.  
3. Wait until **migrate**, **deploy**, and **health** are green (~2–3 min).

Or merge any PR into `staging` (also triggers deploy).

**Changing env vars alone is not enough** — you must **redeploy** so serverless functions load the new values.

---

## 5. Sign in

1. https://lance-flow-web.vercel.app/auth/signin  
2. Email: value from `/api/diagnostics/auth` → `expectedLogin.email` (e.g. `ops@lanceflow.test`)  
3. Password: **exactly** `DEV_AUTH_PASSWORD` on Vercel (not only local `.env`)  
4. Hard refresh if needed: **Ctrl+Shift+R**

Success → redirect to `/dashboard` with sidebar and logo.

---

## 6. Still failing?

| Check | Action |
|-------|--------|
| `/api/diagnostics/auth` → `ready: false` | Fix missing vars, redeploy |
| `authUrl` shows localhost | Set `AUTH_URL` to `https://lance-flow-web.vercel.app`, redeploy |
| `/api/health` → `database: error` | Fix `DATABASE_URL`, align GitHub staging secret, run Deploy Staging |
| `ready: true` but sign-in fails | Re-enter `DEV_AUTH_PASSWORD` on Vercel (retype, no quotes), redeploy |
| Works on localhost only | Copy **all** auth vars from `.env` to Vercel Production + Preview |

---

## 7. Security — rotate Neon password

If you pasted `DATABASE_URL` in chat or tickets, **rotate the Neon role password** in [Neon Console](https://console.neon.tech), then update:

- Vercel `DATABASE_URL`
- GitHub **staging** environment `DATABASE_URL`
- Local `.env` (never commit)

---

## Quick reference

| URL | Purpose |
|-----|---------|
| `/` | Landing page |
| `/auth/signin` | Login |
| `/dashboard` | App (after login) |
| `/api/health` | DB + app health |
| `/api/diagnostics/auth` | Auth env checklist (safe, no secrets) |

See also: [STAGING_DEMO.md](./STAGING_DEMO.md), [DEPLOY_STAGING.md](./DEPLOY_STAGING.md), [AUTH.md](./AUTH.md).
