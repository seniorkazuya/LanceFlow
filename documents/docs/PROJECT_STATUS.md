# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-25  
> **Current phase:** M4 — Analytics  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **KPI-004** — Control Center dashboard UI (PR in flight) |
| **Just completed** | **KPI-003** on staging ([#91](https://github.com/seniorkazuya/LanceFlow/pull/91)) |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.5.0** — M3 Automation |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Production (v0.5.0)

M3 Automation: rules engine, auto-approve/assign, payments, notifications, Control Center exception inbox.

| Variable | Purpose |
|----------|---------|
| `AUTO_ASSIGN_ENABLED` | Auto-assign on activate |
| `PAYMENT_ESCALATION_JOBS_ENABLED` | Payment escalation worker |
| `REDIS_URL` | BullMQ worker |
| `RESEND_API_KEY` | Optional email |

---

## Staging (M4)

| Story | PR | Feature |
|-------|-----|---------|
| KPI-001 | #89 | Role KPI calculators |
| KPI-002 | #90 | Nightly `kpi_records` rollup |
| KPI-003 | #91 | `GET /api/control-center/summary` |
| KPI-004 | (in flight) | Control Center StatusBadge cards |

### Staging env (M4 jobs)

| Variable | Purpose |
|----------|---------|
| `KPI_ROLLUP_JOBS_ENABLED` | Enable KPI rollup in worker |
| `KPI_ROLLUP_CRON` | Cron pattern (default `0 3 * * *`) |

Trigger manually: `POST /api/jobs/kpi-rollup` (CEO/Ops).

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0–M3** | Done (production **v0.5.0**) |
| **M4** Analytics | KPI-001–002 on staging; KPI-003 in flight |

---

## Recommended sprint order (next)

1. **KPI-003** — merge and QA `GET /api/control-center/summary`  
2. **KPI-004** — Control Center dashboard UI  

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-25 | KPI-002 staging (#90); KPI-003 in flight |
| 2026-05-25 | **v0.5.0** production — M3 Automation |
| 2026-05-23 | **v0.4.1** — M2 Operations |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
