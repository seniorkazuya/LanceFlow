# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-21  
> **Current phase:** M0 — Platform & DevOps (in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | DEV-005 — Production deployment (configure `production` environment + first release) |
| **Just completed** | DEV-004 — Staging live on Vercel ✅ |
| **Next up** | Merge DEV-005 PR → set production secrets → release tag `v0.1.0` from `main` |
| **Branch convention** | `feature/<STORY-ID>-<slug>` → PR → `staging` |

Setup: **[DEPLOY_STAGING.md](./DEPLOY_STAGING.md)** · **[DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)**

---

## Staging demo

| | |
|--|--|
| **Staging URL** | https://lance-flow-web.vercel.app |
| **Health check** | https://lance-flow-web.vercel.app/api/health |
| **Local** | http://localhost:3000 |
| **Last deploy** | 2026-05-21 — Deploy Staging ✅ ([run](https://github.com/seniorkazuya/LanceFlow/actions/runs/26216592098)) |

---

## Production

| | |
|--|--|
| **Production URL** | _Pending — configure after DEV-005 secrets + first tag deploy_ |
| **Health check** | `{PRODUCTION_URL}/api/health` |

---

## Executive summary

CI runs on every PR. **Staging** auto-deploys on push to `staging` (Neon + Vercel + health). **Production** deploys on version tags `v*` or manual workflow with GitHub **production** environment approval.

---

## Progress at a glance

| Milestone | Status | Notes |
|-----------|--------|--------|
| M0 — Platform & DevOps | 🟡 In progress | Staging live; DEV-005 code in PR |
| M1 — Foundation | 🔴 Not started | Auth, RBAC after M0 |

---

## Story progress (M0)

| Story | Title | Status |
|-------|-------|--------|
| DEV-001 | Monorepo scaffold | 🟢 Done |
| DEV-002 | GitHub + branch protection | 🟢 Done |
| DEV-003 | CI pipeline | 🟢 Done |
| DEV-004 | Staging deployment | 🟢 Done |
| DEV-005 | Production deployment | 🟡 In PR (secrets + tag pending) |
| DEV-006 | Docker Compose | 🔴 Backlog |
| DEV-007 | Observability | 🔴 Backlog |
| DEV-008 | Client status automation | 🔴 Backlog |

---

## What is complete today

- [x] Monorepo, GitHub, CI (lint / typecheck / test / build)
- [x] Staging deploy pipeline + live URL + health check
- [x] Production deploy workflow + runbook (DEV-005 — merge PR, then configure)
- [ ] **You:** GitHub `production` environment + reviewers + Neon/Vercel prod secrets
- [ ] **You:** PR `staging` → `main`, tag `v0.1.0`, first production deploy

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-21 | Staging live: `lance-flow-web.vercel.app`; Deploy Staging green |
| 2026-05-21 | DEV-005: deploy-production.yml, DEPLOY_PRODUCTION.md |
| 2026-05-20 | DEV-004: deploy-staging.yml, Neon migrate, Vercel fixes |
| 2026-05-20 | DEV-003: CI pipeline |
| 2026-05-19 | DEV-002, DEV-001 |

---

*Technical plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
