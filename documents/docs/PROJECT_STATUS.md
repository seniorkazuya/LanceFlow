# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-25  
> **Current phase:** M3 — Automation (staging QA)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **AUTO-008** Exception queue (PR in flight) |
| **Just completed** | **AUTO-007** on staging ([#85](https://github.com/seniorkazuya/LanceFlow/pull/85)) |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.4.1** — M2 Operations complete (not yet M3) |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Staging (M3 — Automation)

| Story | PR | Feature |
|-------|-----|---------|
| AUTO-001–006 | #78–#84 | Rules engine, auto-approve, auto-assign, payments, escalation, risk pre-screen |
| AUTO-007 | #85 | In-app bell + email adapter |
| AUTO-008 | (in flight) | Leadership exception inbox |

### Staging env (notifications)

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Optional — enables Resend email; omit for in-app only |
| `NOTIFICATION_FROM_EMAIL` | Sender for Resend |
| `PAYMENT_ESCALATION_NOTIFY_EMAIL` | `true` to email Ops on escalation job |

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0–M2** | Done (production v0.4.1) |
| **M3** Automation | 7/8 on staging; AUTO-008 in flight |

---

## Recommended sprint order (next)

1. **AUTO-008** — merge and QA exception inbox  
2. Sync `staging` with `main` → **v0.5.0**  

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-25 | AUTO-007 staging (#85); AUTO-008 in flight |
| 2026-05-25 | AUTO-006 staging (#84) |
| 2026-05-24 | AUTO-005 staging (#82) |
| 2026-05-23 | AUTO-004 staging (#81) |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
