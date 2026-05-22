# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-23  
> **Current phase:** M3 — Automation (starting)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **AUTO-003** Auto task assignment on activate |
| **Just completed** | **AUTO-002** merged to staging (#79) |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.4.1** — full M2 Operations (8/8 stories) |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Production (v0.4.1)

| | |
|--|--|
| **Release** | [v0.4.1](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.4.1) |
| **Deploy** | Success ([run](https://github.com/seniorkazuya/LanceFlow/actions/runs/26306445495)) |
| **Includes** | v0.4.0 + OPS-006 daily reports, OPS-007 SOPs, OPS-008 ops console |
| **URL** | `PRODUCTION_URL` in GitHub environment **production** |

### Production routes

| Area | Routes |
|------|--------|
| Clients + risk | `/clients` |
| Projects | `/projects` |
| Team workload | `/workers` |
| Daily reports | `/daily-reports`, `/daily-reports/missing` |
| SOPs | `/sops` |
| Ops console | `/ops` |

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0** Platform & DevOps | Done |
| **M1** Foundation | Done |
| **M2** Operations | Done (production v0.4.1) |
| **M3** Automation | In progress (AUTO-001–002 on staging; AUTO-003 in flight) |

### M2 — Operations (complete)

| Story | Production |
|-------|------------|
| OPS-001 … OPS-008 | v0.4.0 / v0.4.1 |

---

## Recommended sprint order (next)

1. **AUTO-003** — Auto-assign on project activate (`AUTO_ASSIGN_ENABLED`)  
2. Staging QA for AUTO-001 / AUTO-002  
3. Sync `staging` with `main` before next production release  

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-23 | AUTO-002 staging (#79) · AUTO-003 branch started |
| 2026-05-23 | v0.4.1 production (#77) — M2 complete |
| 2026-05-22 | v0.4.0 production (#70) |
| 2026-05-22 | OPS-008 (#75) · OPS-007 (#74) · OPS-006 (#71) |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
