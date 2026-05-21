# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-21  
> **Current phase:** M1 — Foundation (started)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | CORE-001 — Database package & Prisma schema (in PR) |
| **Just completed** | **M0** — DEV-001 through DEV-008 ✅ |
| **Next up** | Merge CORE-001 → CORE-002 Auth |
| **Branch convention** | `feature/<STORY-ID>-<slug>` → PR → `staging` |

**Client links:** [Staging demo](#staging-demo) · [Production](#production) · [Story board](https://github.com/users/seniorkazuya/projects)

---

## Staging demo

| | |
|--|--|
| **Staging URL** | https://lance-flow-web.vercel.app |
| **Health check** | https://lance-flow-web.vercel.app/api/health |
| **Local** | http://localhost:3000 (`docker compose up -d`) |
| **Last deploy** | 2026-05-21 — DEV-008 ✅ |

---

## Production

| | |
|--|--|
| **Release** | **v0.1.0** on `main` — https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.1.0 |
| **Pending** | Release PR: `staging` → `main` for DEV-007/008 (v0.2.0) |
| **Last prod deploy** | 2026-05-21 — Deploy Production ✅ |

---

## Executive summary

**M0 complete on `staging`:** platform, CI/CD, staging + production deploys, Docker, observability, client status automation. **M1 started:** database client and schema tests.

---

## Progress at a glance

| Milestone | Status | Notes |
|-----------|--------|--------|
| M0 — Platform & DevOps | 🟢 Done | All DEV stories shipped |
| M1 — Foundation | 🟡 In progress | CORE-001 in PR |

---

## Story progress (M0)

| Story | Title | Status |
|-------|-------|--------|
| DEV-001 … DEV-008 | Platform & DevOps | 🟢 Done |

## Story progress (M1)

| Story | Title | Status |
|-------|-------|--------|
| CORE-001 | Database / Prisma v0 | 🟡 In PR |
| CORE-002 | Authentication | 🔴 Next |
| CORE-003 | RBAC | 🔴 Backlog |
| CORE-004 | Design system | 🔴 Backlog |
| CORE-005 | Marketing pages | 🔴 Backlog |
| CORE-006 | Audit log service | 🔴 Backlog |

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-21 | M0 complete — DEV-008 merged (#35) |
| 2026-05-21 | DEV-007 observability (#33) |
| 2026-05-21 | v0.1.0 on `main` (#28) |

---

*Technical plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
