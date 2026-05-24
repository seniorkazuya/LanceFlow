# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-23  
> **Current phase:** M3 — Automation (staging QA)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **AUTO-006** Client risk pre-screen API |
| **Just completed** | **AUTO-005** on staging ([#82](https://github.com/seniorkazuya/LanceFlow/pull/82)) |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.4.1** — M2 Operations complete (not yet M3) |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Production (v0.4.1)

| | |
|--|--|
| **Release** | [v0.4.1](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.4.1) |
| **Includes** | OPS-001–008 |
| **Not on prod yet** | M3 automation (AUTO-001–004) — staging only until next release |

---

## Staging (M3 — Automation)

| Story | PR | Feature |
|-------|-----|---------|
| AUTO-001 | [#78](https://github.com/seniorkazuya/LanceFlow/pull/78) | Rules engine `evaluateRule()` + registry |
| AUTO-002 | [#79](https://github.com/seniorkazuya/LanceFlow/pull/79) | Project auto-approval + `RuleDecision` |
| AUTO-003 | [#80](https://github.com/seniorkazuya/LanceFlow/pull/80) | Auto-assign on activate |
| AUTO-004 | [#81](https://github.com/seniorkazuya/LanceFlow/pull/81) | Payment schedules per project |
| AUTO-005 | [#82](https://github.com/seniorkazuya/LanceFlow/pull/82) | Payment escalation jobs (BullMQ + manual API) |

### Staging QA checklist (M3)

1. **AUTO-002** — Auto-approve → `active` + `RuleDecision`.
2. **AUTO-003** — `AUTO_ASSIGN_ENABLED=true` → engineer assigned; override audited.
3. **AUTO-004** — Add payment due date on project → mark paid.
4. **AUTO-005** — Create overdue payment schedule → `POST /api/jobs/payment-escalations` → `escalationLevel` bumps + audit.
5. **Ops console** — `/ops` coherent after automation.

### Staging env (Vercel)

| Variable | Purpose |
|----------|---------|
| `AUTO_ASSIGN_ENABLED` | `true` for AUTO-003 |
| `REDIS_URL` | Required for AUTO-005 worker (optional for web-only manual job) |
| `PAYMENT_ESCALATION_JOBS_ENABLED` | `true` on worker host |

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0–M2** | Done (production v0.4.1) |
| **M3** Automation | 5/8 on staging; AUTO-006 next |

---

## Recommended sprint order (next)

1. **AUTO-006** — Client risk pre-screen API  
2. Sync `staging` with `main` → plan **v0.5.0**  

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-24 | AUTO-005 staging (#82) |
| 2026-05-23 | AUTO-004 staging (#81) |
| 2026-05-23 | AUTO-003 staging (#80) · AUTO-002 (#79) |
| 2026-05-23 | v0.4.1 production (#77) — M2 complete |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
