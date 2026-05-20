# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-20  
> **Current phase:** M0 — Platform & DevOps (in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | DEV-005 — Production deployment (after staging secrets configured) |
| **Just completed** | DEV-004 — Staging deployment pipeline ✅ (code); **one-time setup required** |
| **Next up** | Configure Neon + Vercel secrets → first staging deploy |
| **Branch convention** | `feature/<STORY-ID>-<slug>` → PR → `staging` |

Setup guide: **[DEPLOY_STAGING.md](./DEPLOY_STAGING.md)**

---

## Staging demo

| | |
|--|--|
| **Staging URL** | _Set after first deploy — add to GitHub secret `STAGING_URL` and update this line_ |
| **Health check** | `{STAGING_URL}/api/health` |
| **Local** | http://localhost:3000 |

**Your action:** Complete [DEPLOY_STAGING.md](./DEPLOY_STAGING.md) §1–3, merge DEV-004 PR, then paste Vercel URL here.

---

## Executive summary

CI runs on every PR. **Deploy Staging** workflow runs on push to `staging`: Neon migrations → Vercel → health check. After you add secrets, clients can use the staging URL to see progress.

---

## Progress at a glance

| Milestone | Status | Notes |
|-----------|--------|--------|
| M0 — Platform & DevOps | 🟡 In progress | DEV-001–004 code done; first deploy pending secrets |
| M1 — Foundation | 🔴 Not started | Auth, RBAC after M0 |

---

## Story progress (M0)

| Story | Title | Status |
|-------|-------|--------|
| DEV-001 | Monorepo scaffold | 🟢 Done |
| DEV-002 | GitHub + branch protection | 🟢 Done |
| DEV-003 | CI pipeline | 🟢 Done |
| DEV-004 | Staging deployment | 🟢 Done (configure secrets) |
| DEV-005 | Production deployment | 🟡 Next |
| DEV-006 | Docker Compose | 🔴 Backlog |
| DEV-007 | Observability | 🔴 Backlog |
| DEV-008 | Client status automation | 🔴 Backlog |

---

## What is complete today

- [x] Monorepo, GitHub, CI (lint / typecheck / test / build)
- [x] Deploy workflow + Prisma initial migration + Vercel config
- [ ] **You:** Neon + Vercel + GitHub `staging` secrets (see DEPLOY_STAGING.md)
- [ ] **You:** First green Deploy Staging run + staging URL in this doc

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-20 | DEV-004: deploy-staging.yml, Neon migrate, Vercel, health check |
| 2026-05-20 | DEV-003: CI pipeline |
| 2026-05-19 | DEV-002, DEV-001 |

---

*Technical plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
