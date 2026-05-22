# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-22  
> **Current phase:** M2 — Operations (in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Release in flight** | **v0.4.0** — [PR #70](https://github.com/seniorkazuya/LanceFlow/pull/70) → `main` |
| **Next on staging** | [PR #71](https://github.com/seniorkazuya/LanceFlow/pull/71) OPS-006 daily reports |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production today** | **v0.3.0** — M1 + clients + risk |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md)

---

## v0.4.0 release (staging → production)

| | |
|--|--|
| **PR** | [#70](https://github.com/seniorkazuya/LanceFlow/pull/70) — approve, merge, then tag `v0.4.0` |
| **Includes** | OPS-003 projects, OPS-004 workload, OPS-005 assignment rank, UX (toasts + themes) |
| **Migrations** | `ops_projects`, `skill_tags`, `ops_assignments`, `formula_version` |

---

## Staging (ahead of production)

| | |
|--|--|
| **URL** | https://lance-flow-web.vercel.app |
| **Health** | https://lance-flow-web.vercel.app/api/health |
| **Theme** | Light/dark toggle in navbar |

| Area | Routes | On staging |
|------|--------|------------|
| Clients + risk | `/clients` | Yes (also on prod v0.3.0) |
| Projects | `/projects` | Yes (v0.4.0) |
| Team workload | `/workers` | Yes (v0.4.0) |
| Assignment | Project detail | Yes (v0.4.0) |
| Daily reports | `/daily-reports`, `/daily-reports/missing` | After PR #71 |

---

## Production (v0.3.0 today)

| | |
|--|--|
| **Tag** | [v0.3.0](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.3.0) |
| **Includes** | M1 Foundation, OPS-001 clients, OPS-002 client risk |
| **Not yet** | `/projects`, `/workers`, assignment rank, toasts/theme (until v0.4.0) |
| **URL** | `PRODUCTION_URL` in GitHub environment **production** |

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0** Platform & DevOps | Done |
| **M1** Foundation | Done |
| **M2** Operations | In progress (5/8 on staging; 6/8 after #71) |

### M2 — Operations stories

| Story | Title | Staging | Production |
|-------|-------|---------|------------|
| OPS-001 | Clients | Done | v0.3.0 |
| OPS-002 | Client risk v0 | Done | v0.3.0 |
| OPS-003 | Project lifecycle | Done | v0.4.0 (pending) |
| OPS-004 | Skills & workload | Done | v0.4.0 (pending) |
| OPS-005 | Assignment algorithm | Done | v0.4.0 (pending) |
| OPS-006 | Daily reports | PR #71 | — |
| OPS-007 | SOP store | Backlog | — |
| OPS-008 | Ops console | Backlog | — |

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-22 | UX: toasts, light theme (#69) · OPS-005 (#68) · OPS-004 (#67) |
| 2026-05-21 | OPS-003 projects (#66) · v0.3.0 production (#65) |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
