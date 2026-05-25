# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-25  
> **Current phase:** M3 — Automation complete on staging (QA)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | M3 QA on staging — prep **v0.5.0** |
| **Just completed** | **AUTO-008** on staging ([#86](https://github.com/seniorkazuya/LanceFlow/pull/86)) |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.4.1** — M2 Operations complete (not yet M3) |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Staging (M3 — Automation)

| Story | PR | Feature |
|-------|-----|---------|
| AUTO-001–006 | #78–#84 | Rules engine, auto-approve, auto-assign, payments, escalation, risk pre-screen |
| AUTO-007 | #85 | In-app bell + email adapter |
| AUTO-008 | #86 | Leadership exception inbox (Control Center) |

### Staging env (M3)

| Variable | Purpose |
|----------|---------|
| `AUTO_ASSIGN_ENABLED` | Auto-assign on project activate |
| `PAYMENT_ESCALATION_JOBS_ENABLED` | BullMQ payment escalation worker |
| `PAYMENT_ESCALATION_CRON` | Cron for daily escalation job |
| `PAYMENT_ESCALATION_NOTIFY_EMAIL` | `true` to email Ops on escalation |
| `RESEND_API_KEY` | Optional — Resend email; omit for in-app only |
| `NOTIFICATION_FROM_EMAIL` | Sender for Resend |
| `REDIS_URL` | Worker queue (staging) |

### Staging DB migrations (run once)

`rule_decisions`, `payment_schedules`, `notifications`, `leadership_exceptions` — deploy with `pnpm db:migrate:deploy`.

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0–M2** | Done (production v0.4.1) |
| **M3** Automation | **8/8 merged to staging** — QA before v0.5.0 |

---

## Recommended sprint order (next)

1. QA M3 on staging (Control Center → refresh inbox, acknowledge, notifications bell)  
2. Run `pnpm db:migrate:deploy` on staging Neon  
3. Merge `staging` → `main` and tag **v0.5.0**  

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-25 | M3 complete on staging — AUTO-008 (#86) |
| 2026-05-25 | AUTO-007 staging (#85) |
| 2026-05-25 | AUTO-006 staging (#84) |
| 2026-05-24 | AUTO-005 staging (#82) |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
