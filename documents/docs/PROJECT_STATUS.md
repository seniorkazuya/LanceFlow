# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-21  
> **Current phase:** M0 — Platform & DevOps (in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | DEV-006 — Docker Compose local stack (in PR) |
| **Just completed** | DEV-005 — Production deploy workflow on `staging` ✅ |
| **Next up** | Configure GitHub `production` env → `staging` → `main` release → tag `v0.1.0` |
| **Branch convention** | `feature/<STORY-ID>-<slug>` → PR → `staging` |

Setup: **[DEPLOY_STAGING.md](./DEPLOY_STAGING.md)** · **[DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)**

---

## Staging demo

| | |
|--|--|
| **Staging URL** | https://lance-flow-web.vercel.app |
| **Health check** | https://lance-flow-web.vercel.app/api/health |
| **Local** | http://localhost:3000 |
| **Last deploy** | 2026-05-21 — Deploy Staging ✅ ([run](https://github.com/seniorkazuya/LanceFlow/actions/runs/26217439572)) |

---

## Production

| | |
|--|--|
| **Production URL** | _Pending — GitHub `production` secrets + Vercel prod project + tag deploy_ |
| **Health check** | `{PRODUCTION_URL}/api/health` |
| **Workflow** | `.github/workflows/deploy-production.yml` (on `staging`; runs after merge to `main` + tag) |

---

## Executive summary

CI on every PR. **Staging** auto-deploys on push to `staging`. **Production** deploys on tags `v*` with GitHub Environment approval (configure secrets first).

---

## Progress at a glance

| Milestone | Status | Notes |
|-----------|--------|--------|
| M0 — Platform & DevOps | 🟡 In progress | Staging live; DEV-005 workflow merged; DEV-006 in PR |
| M1 — Foundation | 🔴 Not started | Auth, RBAC after M0 |

---

## Story progress (M0)

| Story | Title | Status |
|-------|-------|--------|
| DEV-001 | Monorepo scaffold | 🟢 Done |
| DEV-002 | GitHub + branch protection | 🟢 Done |
| DEV-003 | CI pipeline | 🟢 Done |
| DEV-004 | Staging deployment | 🟢 Done |
| DEV-005 | Production deployment | 🟢 Done (workflow); prod secrets + release pending |
| DEV-006 | Docker Compose | 🟡 In PR |
| DEV-007 | Observability | 🔴 Backlog |
| DEV-008 | Client status automation | 🔴 Backlog |

---

## What is complete today

- [x] Monorepo, GitHub, CI
- [x] Staging live + health check
- [x] Production deploy workflow + runbook (on `staging`)
- [ ] **You:** `production` environment + Neon/Vercel prod secrets ([DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md))
- [ ] **You:** PR `staging` → `main`, tag `v0.1.0`
- [ ] **You:** Move cards on **LanceFlow Build** ([GITHUB_PROJECT_UPDATES.md](./GITHUB_PROJECT_UPDATES.md))

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-21 | DEV-005 merged (#22); Deploy Staging green; DEV-006 Docker in PR |
| 2026-05-21 | Staging live; deploy fixes (#20, #21) |
| 2026-05-20 | DEV-004 staging pipeline |
| 2026-05-19 | DEV-001–003 |

---

*Technical plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
