# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-23  
> **Current phase:** M2 — Operations (wrapping up)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **M2 complete on staging** — plan **v0.4.1** release |
| **Just completed** | **OPS-008** Ops console (#75) · OPS-007 (#74) |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.4.0** — full M2 core (clients through assignments + UX) |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Staging (ahead of production)

| Area | Routes | Staging | Production |
|------|--------|---------|--------------|
| Clients + risk | `/clients` | Yes | Yes |
| Projects | `/projects` | Yes | Yes |
| Team workload | `/workers` | Yes | Yes |
| Assignment | Project detail | Yes | Yes |
| Daily reports | `/daily-reports`, `/daily-reports/missing` | Yes | Pending v0.4.1 |
| SOPs | `/sops` | Yes | Pending v0.4.1 |
| Ops console | `/ops` | Yes | Pending v0.4.1 |

---

## Production (v0.4.0)

| | |
|--|--|
| **Release** | [v0.4.0](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.4.0) |
| **Includes** | M1, OPS-001–005, UX (toasts, themes, live refresh) |
| **Next release** | **v0.4.1** — OPS-006, OPS-007 (+ OPS-008 when merged) |

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0** Platform & DevOps | Done |
| **M1** Foundation | Done |
| **M2** Operations | **Done on staging** (8/8) |

### M2 — Operations stories

| Story | Title | Staging | Production |
|-------|-------|---------|------------|
| OPS-001 | Clients | Done | v0.4.0 |
| OPS-002 | Client risk v0 | Done | v0.4.0 |
| OPS-003 | Project lifecycle | Done | v0.4.0 |
| OPS-004 | Skills & workload | Done | v0.4.0 |
| OPS-005 | Assignment algorithm | Done | v0.4.0 |
| OPS-006 | Daily reports | Done | Pending v0.4.1 |
| OPS-007 | SOP store | Done | Pending v0.4.1 |
| OPS-008 | Ops console | Done | Pending v0.4.1 |

---

## Recommended sprint order (next)

1. **v0.4.1 release** — OPS-006, OPS-007, OPS-008 to production  
3. **AUTO-001** — Rules engine registry (M3)

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-23 | OPS-008 ops console (in progress) |
| 2026-05-22 | OPS-007 SOPs (#74) · v0.4.0 prod (#70) · OPS-006 (#71) |
| 2026-05-21 | OPS-003 (#66) · v0.3.0 (#65) |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
