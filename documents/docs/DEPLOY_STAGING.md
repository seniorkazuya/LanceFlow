# LanceFlow — Staging deployment (DEV-004)

One-time setup so **push to `staging`** runs migrations and deploys to Vercel.

**Workflow:** `.github/workflows/deploy-staging.yml`

---

## 1. Neon (PostgreSQL staging)

1. Create a project at [neon.tech](https://neon.tech) (free tier is fine).
2. Create database `lanceflow` (or use default).
3. Copy the **connection string** (pooled recommended for serverless):
   ```
   postgresql://user:pass@host/lanceflow?sslmode=require
   ```

---

## 2. Vercel (Next.js hosting)

1. [vercel.com](https://vercel.com) → **Add New Project** → Import `seniorkazuya/LanceFlow`.
2. **Framework:** Next.js  
3. **Root Directory:** `apps/web`  
4. Enable **Include source files outside of the Root Directory** (monorepo).
5. **Production Branch:** set to `staging` (so staging branch = preview/production for this project).
6. Environment variables in Vercel (Preview + Production for staging project):
   - `DATABASE_URL` = same Neon URL (optional for build; required at runtime for future stories)

7. Get IDs for GitHub Actions:
   - [Account tokens](https://vercel.com/account/tokens) → create token → `VERCEL_TOKEN`
   - Project **Settings → General** → **Project ID** → `VERCEL_PROJECT_ID`
   - Team/Account **Settings** → **Team ID** (or user ID for hobby) → `VERCEL_ORG_ID`

---

## 3. GitHub Environment `staging`

**Repo → Settings → Environments → New environment → `staging`**

Add **Environment secrets**:

| Secret | Value |
|--------|--------|
| `DATABASE_URL` | Neon connection string |
| `VERCEL_TOKEN` | Vercel API token |
| `VERCEL_ORG_ID` | Team or user ID |
| `VERCEL_PROJECT_ID` | Vercel project ID |
| `STAGING_URL` | Stable URL after first deploy, e.g. `https://lanceflow-xxx.vercel.app` (no trailing slash) |

`STAGING_URL` is used for post-deploy health checks. After the first successful deploy, copy the Vercel URL here.

Optional: add **Environment protection rules** (required reviewers) if you want gated deploys.

---

## 4. First deploy

**Option A — Merge to staging (automatic)**

Merge a PR into `staging`. Workflows run:

1. **CI** — lint, typecheck, test, build  
2. **Deploy Staging** — migrate → Vercel deploy → `/api/health` check  

**Option B — Manual**

Actions → **Deploy Staging** → **Run workflow** → branch `staging`

---

## 5. Verify

```bash
curl https://YOUR-STAGING-URL/api/health
```

Expected:

```json
{"status":"ok","version":"0.0.1-dev","timestamp":"..."}
```

Update [PROJECT_STATUS.md](./PROJECT_STATUS.md) with the staging URL for clients.

---

## 6. Troubleshooting

| Issue | Fix |
|-------|-----|
| Migrate fails | Check `DATABASE_URL` in GitHub `staging` secrets; Neon IP allowlist / SSL |
| Vercel pull fails | Verify `VERCEL_*` secrets; link repo to Vercel project |
| Health check timeout | Set `STAGING_URL` secret; wait for cold start; re-run workflow |
| Build fails on Vercel | Confirm Root Directory = `apps/web`; see `apps/web/vercel.json` |

---

*DEV-004 — May 2026*
