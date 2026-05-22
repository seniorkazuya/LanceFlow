# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-22  
> **Current phase:** M2 — Operations (in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Release in flight** | **v0.4.0** — staging → `main` (PR pending approval) |
| **Active story** | OPS-006 — Daily self-reporting |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production today** | **v0.3.0** — M1 + clients + risk |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md)

---

## v0.4.0 release (staging → production)

| | |
|--|--|
| **Includes** | OPS-003 projects, OPS-004 workload, OPS-005 assignment rank, UX (toasts + themes) |
| **Tag after merge** | `v0.4.0` → approve **Deploy Production** |
| **Migrations** | `ops_projects`, `skill_tags`, `ops_assignments`, `formula_version` |

---

## Staging feature set

| Area | Routes | Status |
|------|--------|--------|
| Landing + auth + themes | `/`, `/auth/signin` | Done |
| Clients + risk | `/clients` | Done |
| Projects lifecycle | `/projects` | Done |
| Team workload | `/workers` | Done |
| Assignment rank | Project detail → Assign | Done |
| Control / hiring / audit | `/control`, `/hiring/ceo-queue`, `/audit` | Done |
| Daily reports | `/daily-reports` | In progress (OPS-006) |

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0** Platform & DevOps | Done |
| **M1** Foundation | Done |
| **M2** Operations | In progress (5/8 stories on staging) |

### M2 — Operations stories

| Story | Title | Staging | Production (after v0.4.0) |
|-------|-------|---------|---------------------------|
| OPS-001 | Clients | Done | Done (v0.3.0) |
| OPS-002 | Client risk v0 | Done | Done (v0.3.0) |
| OPS-003 | Project lifecycle | Done | v0.4.0 |
| OPS-004 | Skills & workload | Done | v0.4.0 |
| OPS-005 | Assignment algorithm | Done | v0.4.0 |
| OPS-006 | Daily reports | In progress | — |
| OPS-007 | SOP store | Backlog | — |
| OPS-008 | Ops console | Backlog | — |

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-22 | UX: Sonner toasts, light theme, live refresh (#69) |
| 2026-05-22 | OPS-005 assignment + rules-engine (#68) |
| 2026-05-22 | OPS-004 team workload (#67) |
| 2026-05-21 | OPS-003 projects (#66) |
| 2026-05-21 | v0.3.0 production — M1 + OPS-001/002 (#65) |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
