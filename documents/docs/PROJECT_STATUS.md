# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-25  
> **Current phase:** M4 — Analytics  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **KPI-006** — Bonus/penalty suggestions (PR in flight) |
| **Just completed** | **KPI-005** on staging — Signal threshold configuration |
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
| KPI-004 | merged | Control Center StatusBadge cards |
| KPI-005 | merged | CEO threshold config + audit |
| KPI-006 | (in flight) | Bonus/penalty suggestions (Ops approve) |

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
| **M4** Analytics | KPI-001–005 on staging; KPI-006 in flight |

---

## Recommended sprint order (next)

1. **KPI-006** — merge compensation suggestions; QA on staging  
2. **DEV-005** / release — cut v0.6.0 when M4 slice is ready  

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-25 | KPI-002 staging (#90); KPI-003 in flight |
| 2026-05-25 | **v0.5.0** production — M3 Automation |
| 2026-05-23 | **v0.4.1** — M2 Operations |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
