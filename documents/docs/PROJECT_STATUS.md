# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-21  
> **Current phase:** M0 — Platform & DevOps ✅ (complete on `staging`; `main` has v0.1.0)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | DEV-008 — Client status automation (in PR) |
| **Just completed** | DEV-007 — Observability ✅ |
| **Next up** | Merge DEV-008 → optional release `staging` → `main` |
| **Branch convention** | `feature/<STORY-ID>-<slug>` → PR → `staging` |

**Client links:** [Staging demo](#staging-demo) · [Production](#production) · [Story board](https://github.com/users/seniorkazuya/projects)

---

## Staging demo

| | |
|--|--|
| **Staging URL** | https://lance-flow-web.vercel.app |
| **Health check** | https://lance-flow-web.vercel.app/api/health |
| **Health details** | `checks.database` / `checks.redis` (`ok` \| `skipped` \| `error`) |
| **Local** | http://localhost:3000 (`docker compose up -d`) |
| **Last deploy** | 2026-05-21 — Deploy Staging ✅ (DEV-007) |

---

## Production

| | |
|--|--|
| **Release** | **v0.1.0** — https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.1.0 |
| **Production URL** | GitHub secret `PRODUCTION_URL` |
| **Last deploy** | 2026-05-21 — Deploy Production ✅ |

---

## Executive summary

M0 platform complete: monorepo, CI, staging + production deploys, Docker local stack, observability baseline. Staging auto-deploys on push to `staging`.

---

## Progress at a glance

| Milestone | Status | Notes |
|-----------|--------|--------|
| M0 — Platform & DevOps | 🟢 Done | DEV-001–007 shipped; DEV-008 polish |
| M1 — Foundation | 🔴 Not started | Auth, RBAC |

---

## Story progress (M0)

| Story | Title | Status |
|-------|-------|--------|
| DEV-001 | Monorepo scaffold | 🟢 Done |
| DEV-002 | GitHub + branch protection | 🟢 Done |
| DEV-003 | CI pipeline | 🟢 Done |
| DEV-004 | Staging deployment | 🟢 Done |
| DEV-005 | Production deployment | 🟢 Done |
| DEV-006 | Docker Compose | 🟢 Done |
| DEV-007 | Observability | 🟢 Done |
| DEV-008 | Client status automation | 🟡 In PR |

---

## What is complete today

- [x] M0 stories DEV-001–007 on `staging`
- [x] v0.1.0 on `main` with production deploy
- [x] Staging health + observability (`/api/health` with DB/Redis checks)
- [ ] **You:** LanceFlow Build cards updated ([guide](./GITHUB_PROJECT_UPDATES.md))
- [ ] **You:** Optional Sentry DSN in Vercel ([OBSERVABILITY.md](./OBSERVABILITY.md))

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-21 | DEV-007 observability merged (#33); staging redeployed |
| 2026-05-21 | v0.1.0 + M0 release on `main` (#28) |
| 2026-05-20 | DEV-004–006 staging pipeline, Docker, prod workflow |

---

*Technical plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
