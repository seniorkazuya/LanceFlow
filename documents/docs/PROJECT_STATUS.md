# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-25  
> **Current phase:** M4 — Analytics (release to production)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **PAY-001** — Project milestone model (PR in flight) |
| **Just completed** | **v0.6.0** production — M4 Analytics |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.6.0** — M4 Analytics |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Production (target v0.6.0)

M4 Analytics: role KPIs, Control Center summary + dashboard, CEO thresholds, Ops-approved bonus/penalty suggestions.

| Variable | Purpose |
|----------|---------|
| `KPI_ROLLUP_JOBS_ENABLED` | KPI rollup + compensation suggestions in worker |
| `KPI_ROLLUP_CRON` | Nightly cron (default `0 3 * * *`) |
| `AUTO_ASSIGN_ENABLED` | (M3) Auto-assign on activate |
| `PAYMENT_ESCALATION_JOBS_ENABLED` | (M3) Payment escalation worker |
| `REDIS_URL` | BullMQ worker |
| `RESEND_API_KEY` | Optional email |

Manual: `POST /api/jobs/kpi-rollup` (CEO/Ops).

---

## Staging (M4 complete)

| Story | PR | Feature |
|-------|-----|---------|
| KPI-001 | #89 | Role KPI calculators |
| KPI-002 | #90 | Nightly `kpi_records` rollup |
| KPI-003 | #91 | `GET /api/control-center/summary` |
| KPI-004 | #92 | Control Center StatusBadge cards |
| KPI-005 | #93 | CEO threshold config + audit |
| KPI-006 | #94 | Bonus/penalty suggestions (Ops approve) |

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0–M3** | Done (production **v0.5.0**) |
| **M4** Analytics | Complete on staging; **v0.6.0** release PR in flight |

---

## Recommended sprint order (next)

1. Merge **release/v0.6.0** → `main`, tag **v0.6.0**, approve production deploy  
2. Staging/production QA: `/control`, KPI rollup, compensation suggestions  
3. **M5** Payments / Hiring per [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-25 | KPI-005–006 staging (#93–#94); preparing **v0.6.0** |
| 2026-05-25 | **v0.5.0** production — M3 Automation |
| 2026-05-23 | **v0.4.1** — M2 Operations |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
