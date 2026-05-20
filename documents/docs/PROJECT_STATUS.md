# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-20  
> **Current phase:** M0 — Platform & DevOps (in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  
> **Staging demo:** _Not deployed yet_ (local: http://localhost:3000)  
> **Latest release:** DEV-002 on `main`

---

## Current work

| | |
|--|--|
| **Active story** | DEV-004 — Staging deployment |
| **Just completed** | DEV-003 — CI pipeline ✅ |
| **Next up** | DEV-004 — Staging URL for client demos |
| **Branch convention** | `feature/<STORY-ID>-<slug>` → PR → `staging` |

Engineering: [stories index](../stories/README.md) · DevOps: [DEVOPS_GUIDE.md](./DEVOPS_GUIDE.md)

---

## Executive summary

GitHub **CI runs on every PR** (`lint`, `typecheck`, `test`, `build`). Integration tests use Postgres 16 + Redis 7 in CI. Branch protection can require these checks after merging DEV-003. Next: deploy **staging** so clients can see the app online.

---

## Progress at a glance

| Milestone | Status | Target | Notes |
|-----------|--------|--------|-------|
| M0 — Platform & DevOps | 🟡 In progress | Week 1–2 | DEV-001–003 done; DEV-004 next |
| M1 — Foundation | 🔴 Not started | Week 2–3 | Auth, RBAC |
| M2–M8 | 🔴 Not started | | |

**Legend:** 🟢 Done · 🟡 In progress · 🔴 Not started

---

## Story progress (M0)

| Story | Title | Status |
|-------|-------|--------|
| DEV-001 | Monorepo scaffold | 🟢 Done |
| DEV-002 | GitHub + branch protection | 🟢 Done |
| DEV-003 | CI pipeline | 🟢 Done |
| DEV-004 | Staging deployment | 🟡 **Next** |
| DEV-006 | Docker Compose | 🔴 Backlog |
| DEV-007 | Observability | 🔴 Backlog |
| DEV-008 | Client status automation | 🔴 Backlog |

---

## What is complete today

- [x] Monorepo + GitHub + branch protection
- [x] **CI workflow** — `.github/workflows/ci.yml`
- [x] Unit + integration tests (Postgres/Redis in CI)
- [ ] Staging URL (DEV-004)
- [ ] Production deploy automation (DEV-005)

---

## Demo & environments

| Environment | URL | Access |
|-------------|-----|--------|
| **Local** | http://localhost:3000 | `pnpm dev` |
| Staging | _pending DEV-004_ | |
| Production | _pending_ | |

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-20 | DEV-003: CI (lint, typecheck, test, build) + Vitest |
| 2026-05-19 | DEV-002: GitHub templates, branch protection |
| 2026-05-19 | DEV-001: Monorepo scaffold |

---

*Technical plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
