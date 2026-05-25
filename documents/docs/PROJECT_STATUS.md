# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-25  
> **Current phase:** M3 — Automation (staging QA)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **AUTO-007** Notification service |
| **Just completed** | **AUTO-006** on staging ([#84](https://github.com/seniorkazuya/LanceFlow/pull/84)) |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.4.1** — M2 Operations complete (not yet M3) |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Staging (M3 — Automation)

| Story | PR | Feature |
|-------|-----|---------|
| AUTO-001–006 | #78–#84 | Rules engine, auto-approve, auto-assign, payments, escalation, risk pre-screen |
| AUTO-007 | (in flight) | In-app bell + email adapter |

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
| **M3** Automation | 6/8 on staging; AUTO-007 in flight |

---

## Recommended sprint order (next)

1. **AUTO-007** — merge and QA notification bell  
2. **AUTO-008** — Exception queue  
3. Sync `staging` with `main` → **v0.5.0**  

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-25 | AUTO-006 staging (#84) |
| 2026-05-24 | AUTO-005 staging (#82) |
| 2026-05-23 | AUTO-004 staging (#81) |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
