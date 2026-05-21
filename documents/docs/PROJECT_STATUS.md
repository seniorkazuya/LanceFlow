# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-21  
> **Current phase:** M0 — Platform & DevOps (wrapping up)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | DEV-007 — Observability (next) |
| **Just completed** | **M0 release** — PR #28 merged to `main` ✅ |
| **Next up** | Merge PR #32 (sync staging); optional stable prod domain on Vercel |
| **Branch convention** | `feature/<STORY-ID>-<slug>` → PR → `staging` |

Setup: **[DEPLOY_STAGING.md](./DEPLOY_STAGING.md)** · **[DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md)**

---

## Staging demo

| | |
|--|--|
| **Staging URL** | https://lance-flow-web.vercel.app |
| **Health check** | https://lance-flow-web.vercel.app/api/health |
| **Local** | http://localhost:3000 (`docker compose up -d`) |
| **Last deploy** | 2026-05-21 — Deploy Staging ✅ |

---

## Production

| | |
|--|--|
| **Release** | **v0.1.0** — https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.1.0 |
| **Production URL** | Set in GitHub secret `PRODUCTION_URL` (see Deploy Production run) |
| **Health check** | `{PRODUCTION_URL}/api/health` |
| **Last deploy** | 2026-05-21 — Deploy Production ✅ ([run](https://github.com/seniorkazuya/LanceFlow/actions/runs/26225026548)) |
| **`main` branch** | M0 release merged (#28) |

---

## Executive summary

**M0 platform is on `main`.** Staging auto-deploys from `staging`. Production deploys on `v*` tags with GitHub Environment approval.

---

## Progress at a glance

| Milestone | Status | Notes |
|-----------|--------|--------|
| M0 — Platform & DevOps | 🟢 Done | v0.1.0 tagged; prod deploy green; DEV-007–008 optional polish |
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
| DEV-007 | Observability | 🟡 Next |
| DEV-008 | Client status automation | 🔴 Backlog |

---

## What is complete today

- [x] M0 code on **`main`** (release PR #28)
- [x] Staging live + CI + Docker local stack
- [x] Tag **`v0.1.0`** + Deploy Production green
- [ ] **You:** Confirm stable `PRODUCTION_URL` in GitHub + Vercel prod domain (if using alias)
- [ ] **You:** Sync **LanceFlow Build** cards ([GITHUB_PROJECT_UPDATES.md](./GITHUB_PROJECT_UPDATES.md))
- [ ] **You:** Close Dependabot PR #31 if not wanted

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-21 | **#28 merged** — M0 platform on `main` |
| 2026-05-21 | Staging live; DEV-005–006 on `staging` |
| 2026-05-20 | DEV-004 staging pipeline |
| 2026-05-19 | DEV-001–003 |

---

*Technical plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
