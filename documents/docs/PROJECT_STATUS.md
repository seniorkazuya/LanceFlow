# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-25  
> **Current phase:** M4 — Analytics  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **KPI-002** — Nightly KPI rollup (PR in flight) |
| **Just completed** | **KPI-001** on staging ([#89](https://github.com/seniorkazuya/LanceFlow/pull/89)) · **v0.5.0** production ([#88](https://github.com/seniorkazuya/LanceFlow/pull/88)) |
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
| KPI-001 | #89 | Role KPI calculators (Worker, Bidder, Caller) |
| KPI-002 | (in flight) | Nightly `kpi_records` rollup job |

### Staging env (KPI-002)

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
| **M4** Analytics | KPI-001 done on staging; KPI-002 in flight |

---

## Recommended sprint order (next)

1. **KPI-002** — merge and QA rollup + `kpi_records` migration on staging  
2. **KPI-003** — Control Center summary API  
3. **KPI-004** — Dashboard UI  

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-25 | **v0.5.0** production — M3 Automation |
| 2026-05-25 | KPI-001 staging (#89) |
| 2026-05-23 | **v0.4.1** — M2 Operations |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
