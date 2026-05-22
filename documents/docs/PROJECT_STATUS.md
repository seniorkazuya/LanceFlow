# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-22  
> **Current phase:** M2 — Operations (in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | M2 wrap-up — OPS-006+ (reports, SOP, ops console) |
| **Just completed** | OPS-005 assignment ranking · OPS-004 workload · UX (toasts, themes, live refresh) |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.3.0** on `main` (M1 + clients + risk) — see [DEPLOY_PRODUCTION.md](./DEPLOY_PRODUCTION.md) |
| **Next release** | `staging` → `main` tag **v0.4.0** (projects, workload, assignments) |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Staging demo

| | |
|--|--|
| **URL** | https://lance-flow-web.vercel.app |
| **Health** | https://lance-flow-web.vercel.app/api/health |
| **Sign-in** | `/auth/signin` — `AUTH_SECRET` + `DEV_AUTH_*` on Vercel |
| **Theme** | Light/dark toggle in top navbar (app + landing) |

### Staging feature set (ahead of production)

| Area | Routes | Status |
|------|--------|--------|
| Landing + auth | `/`, `/auth/signin` | Done |
| Clients + risk | `/clients` | Done |
| Projects lifecycle | `/projects` | Done |
| Team workload | `/workers` | Done |
| Assignment rank v1 | Project detail → Assign | Done |
| Control / hiring / audit | `/control`, `/hiring/ceo-queue`, `/audit` | Done |

---

## Production (v0.3.0)

| | |
|--|--|
| **Tag** | [v0.3.0](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.3.0) |
| **Includes** | M1 Foundation, OPS-001 clients, OPS-002 client risk |
| **Not yet** | Projects, workers, assignments (staging only until v0.4.0) |
| **Verify** | `PRODUCTION_URL/api/health` + sign-in + `/clients` |

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0** Platform & DevOps | Done |
| **M1** Foundation | Done |
| **M2** Operations | In progress (~5/8 stories on staging) |

### M2 — Operations stories

| Story | Title | Staging | Production |
|-------|-------|---------|------------|
| OPS-001 | Clients | Done | Done |
| OPS-002 | Client risk v0 | Done | Done |
| OPS-003 | Project lifecycle | Done | Pending v0.4.0 |
| OPS-004 | Skills & workload | Done | Pending v0.4.0 |
| OPS-005 | Assignment algorithm | Done | Pending v0.4.0 |
| OPS-006 | Daily reports | Backlog | — |
| OPS-007 | SOP store | Backlog | — |
| OPS-008 | Ops console | Backlog | — |

---

## Recommended sprint order (next)

1. **Release v0.4.0** — merge `staging` → `main` (OPS-003–005 + UX)
2. **OPS-006** — Daily reports  
3. **OPS-008** — Ops console (ties M2 demo together)  
4. **AUTO-001** — Rules engine registry (M3)

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-22 | OPS-005 assignment + `@lanceflow/rules-engine` (#68) |
| 2026-05-22 | OPS-004 team workload (#67) |
| 2026-05-22 | UX: Sonner toasts, light theme, mutation cache refresh |
| 2026-05-21 | OPS-003 projects (#66) |
| 2026-05-21 | v0.3.0 production — M1 + OPS-001/002 (#65) |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
