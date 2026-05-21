# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-21  
> **Current phase:** M0 — Platform & DevOps (release to `main` in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | Release PR #28 — `staging` → `main` (v0.1.0) |
| **Just completed** | DEV-006 — Docker Compose ✅ |
| **Next up** | Merge #28 → tag `v0.1.0` → configure production secrets |
| **Branch convention** | `feature/<STORY-ID>-<slug>` → PR → `staging` |

Setup: **[DEPLOY_STAGING.md](./DEPLOY_STAGING.md)** · **[DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)**

---

## Staging demo

| | |
|--|--|
| **Staging URL** | https://lance-flow-web.vercel.app |
| **Health check** | https://lance-flow-web.vercel.app/api/health |
| **Local** | http://localhost:3000 (`docker compose up -d` for Postgres/Redis) |
| **Last deploy** | 2026-05-21 — Deploy Staging ✅ |

---

## Production

| | |
|--|--|
| **Production URL** | _Pending — after #28 merge + `v0.1.0` tag + prod secrets_ |
| **Health check** | `{PRODUCTION_URL}/api/health` |
| **Workflow** | `.github/workflows/deploy-production.yml` |

---

## Executive summary

CI on every PR. **Staging** auto-deploys on push to `staging`. **Production** deploys on tags `v*` with GitHub Environment approval after `main` is current.

---

## Progress at a glance

| Milestone | Status | Notes |
|-----------|--------|--------|
| M0 — Platform & DevOps | 🟡 In progress | Release PR #28; prod deploy after tag |
| M1 — Foundation | 🔴 Not started | Auth, RBAC after M0 |

---

## Story progress (M0)

| Story | Title | Status |
|-------|-------|--------|
| DEV-001 | Monorepo scaffold | 🟢 Done |
| DEV-002 | GitHub + branch protection | 🟢 Done |
| DEV-003 | CI pipeline | 🟢 Done |
| DEV-004 | Staging deployment | 🟢 Done |
| DEV-005 | Production deployment | 🟢 Done (workflow); prod release pending |
| DEV-006 | Docker Compose | 🟢 Done |
| DEV-007 | Observability | 🔴 Backlog |
| DEV-008 | Client status automation | 🔴 Backlog |

---

## What is complete today

- [x] Monorepo, GitHub, CI
- [x] Staging live + health check
- [x] Production deploy workflow + runbook
- [x] Docker Compose local stack
- [ ] **You:** Merge PR #28 (`staging` → `main`)
- [ ] **You:** `production` environment + Neon/Vercel prod secrets
- [ ] **You:** Tag `v0.1.0`, approve Deploy Production
- [ ] **You:** LanceFlow Build project cards ([GITHUB_PROJECT_UPDATES.md](./GITHUB_PROJECT_UPDATES.md))

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-21 | Release PR #28; DEV-006 merged; staging live |
| 2026-05-21 | DEV-005 production workflow (#22) |
| 2026-05-20 | DEV-004 staging pipeline |
| 2026-05-19 | DEV-001–003 |

---

*Technical plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
