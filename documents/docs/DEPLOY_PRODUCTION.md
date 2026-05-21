# LanceFlow — Production deployment (DEV-005)

Gated production deploys: GitHub Environment **production** (required reviewers) → Neon migrate → Vercel → `/api/health`.

**Workflow:** `.github/workflows/deploy-production.yml`

---

## 1. Triggers

| Trigger | When |
|---------|------|
| **Git tag** | Push tag `v*` (e.g. `v0.1.0`) after release merge to `main` |
| **Manual** | Actions → **Deploy Production** → Run workflow → ref `main` or tag |

Release flow: PR `staging` → `main` → tag `v0.x.y` → workflow runs (with approval).

---

## 2. GitHub Environment `production`

**Repo → Settings → Environments → New environment → `production`**

1. **Required reviewers** — add CTO / second approver (cannot self-approve if you are the pusher).
2. **Environment secrets:**

| Secret | Value |
|--------|--------|
| `DATABASE_URL` | Neon **production** connection string |
| `VERCEL_TOKEN` | Vercel API token (team access) |
| `VERCEL_ORG_ID` | Team ID (`team_...`) |
| `VERCEL_PROJECT_ID` | Production Vercel project ID (`prj_...`) |
| `PRODUCTION_URL` | Stable URL, e.g. `https://your-prod.vercel.app` (no trailing slash) |

Use a **separate** Vercel project for production (recommended):

- Root Directory: `apps/web`
- **Production Branch:** `main`
- Node.js: **22.x**

---

## 3. First production release

```bash
# After staging → main PR is merged
git checkout main && git pull
git tag v0.1.0
git push origin v0.1.0
```

Approve the **production** environment when GitHub prompts during the workflow.

---

## 4. Verify

```bash
curl https://YOUR-PRODUCTION-URL/api/health
```

Update [PROJECT_STATUS.md](./PROJECT_STATUS.md) with the production URL.

---

## 5. Rollback runbook

### Application (Vercel)

1. Vercel → production project → **Deployments**.
2. Find last known-good deployment → **⋯** → **Promote to Production** (or **Instant Rollback**).
3. Re-run health check on `PRODUCTION_URL/api/health`.

### Database (Neon)

1. **Before each production migrate:** create a Neon branch or backup snapshot.
2. If a bad migration shipped:
   - Restore from Neon backup / point-in-time restore, **or**
   - Apply a forward-fix migration on a hotfix branch and redeploy.
3. Do not run `prisma migrate reset` on production without CTO approval.

### Git / release

1. Revert the release commit on `main` via PR if needed.
2. Tag rollback release `v0.1.1` only after fix is on `main`.

### Hotfix without full release

Actions → **Deploy Production** → Run workflow → `git_ref`: `main` (or hotfix branch) after approval.

---

## 6. Troubleshooting

| Issue | Fix |
|-------|-----|
| Workflow waits forever | Approve **production** environment in Actions run |
| Vercel CLI outdated | Workflow uses `vercel@48.2.0` |
| Wrong app URL | Set `PRODUCTION_URL`; use separate prod Vercel project |
| Migrate fails | Check production `DATABASE_URL`; confirm backup taken |

---

*DEV-005 — May 2026*
