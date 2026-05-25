# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-25  
> **Current phase:** M4 — Analytics (KPI calculators)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **KPI-001** — Role KPI calculators |
| **Just released** | **v0.5.0** — M3 Automation on production |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.5.0** — M3 Automation (deploy via tag `v0.5.0`) |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Production (v0.5.0 — M3 Automation)

| Story | Feature |
|-------|---------|
| AUTO-001–008 | Rules engine, auto-approve, auto-assign, payments, escalation, risk pre-screen, notifications, exception inbox |
| OPS-001–008 | Clients, projects, workload, assignment, daily reports, SOPs, ops console |

### Production env (M3 — set on Vercel production project)

| Variable | Purpose |
|----------|---------|
| `AUTO_ASSIGN_ENABLED` | Auto-assign on project activate |
| `PAYMENT_ESCALATION_JOBS_ENABLED` | BullMQ payment escalation worker |
| `PAYMENT_ESCALATION_CRON` | Cron for daily escalation job |
| `REDIS_URL` | Worker queue |
| `RESEND_API_KEY` | Optional — Resend email |
| `NOTIFICATION_FROM_EMAIL` | Sender for Resend |

### Production DB migrations

After deploy, **Deploy Production** workflow runs `pnpm db:migrate:deploy`. New since v0.4.1:

`rule_decisions`, `payment_schedules`, `notifications`, `leadership_exceptions`

---

## Staging

Same feature set as production v0.5.0; used for pre-release QA and M4 development.

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0–M3** | Done (production **v0.5.0**) |
| **M4** Analytics | In progress — KPI-001 |

---

## Recommended sprint order (next)

1. **KPI-001** — Worker / Bidder / Caller KPI calculators  
2. **KPI-002** — Nightly KPI job  
3. **KPI-003** — Control Center summary API  

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-25 | **v0.5.0** — M3 Automation to production |
| 2026-05-25 | M3 complete on staging — AUTO-008 (#86) |
| 2026-05-23 | **v0.4.1** — M2 Operations to production |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
