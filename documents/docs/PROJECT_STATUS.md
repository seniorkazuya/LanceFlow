# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-25  
> **Current phase:** M5 — Payments  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **PAY-003** — Milestone-linked payment reminders (in progress) |
| **Just completed** | **v0.6.0** production — M4 Analytics |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.6.0** — M4 Analytics |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Production (v0.6.0)

M4 Analytics: role KPIs, Control Center summary + dashboard, CEO thresholds, Ops-approved bonus/penalty suggestions.

| Variable | Purpose |
|----------|---------|
| `KPI_ROLLUP_JOBS_ENABLED` | KPI rollup + compensation suggestions in worker |
| `KPI_ROLLUP_CRON` | Nightly cron (default `0 3 * * *`) |
| `AUTO_ASSIGN_ENABLED` | Auto-assign on activate |
| `PAYMENT_ESCALATION_JOBS_ENABLED` | Payment escalation worker |
| `REDIS_URL` | BullMQ worker |
| `RESEND_API_KEY` | Optional email |

Manual: `POST /api/jobs/kpi-rollup` (CEO/Ops).

---

## Staging (M4 + M5)

| Story | PR | Feature |
|-------|-----|---------|
| KPI-001–006 | #89–#94 | M4 Analytics (complete) |
| PAY-001 | #96 | Project payment milestones (sum to 100%) |
| PAY-002 | merged | Escrow hold + overdue payment gating; Ops override |
| PAY-003 | (pending) | Milestone due dates → linked schedules; AUTO-005 reminders |

### Staging env (M4 jobs)

| Variable | Purpose |
|----------|---------|
| `KPI_ROLLUP_JOBS_ENABLED` | Enable KPI rollup in worker |
| `KPI_ROLLUP_CRON` | Cron pattern (default `0 3 * * *`) |

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0–M4** | Done (production **v0.6.0**) |
| **M5** Payments | PAY-001–002 on staging; PAY-003 in progress |

---

## Recommended sprint order (next)

1. Merge **#96** PAY-001; QA milestones on project detail  
2. QA PAY-002 escrow on staging (post-migrate)  
3. Merge PAY-003 PR; QA milestone due dates drive payment reminders  

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-25 | **v0.6.0** production — M4 Analytics |
| 2026-05-25 | PAY-001 staging (#96) |
| 2026-05-25 | **v0.5.0** production — M3 Automation |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
