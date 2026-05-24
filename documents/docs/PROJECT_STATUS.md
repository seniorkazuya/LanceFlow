# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-23  
> **Current phase:** M3 — Automation (staging QA)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **AUTO-004** Payment schedule entity |
| **Just completed** | **AUTO-003** on staging ([#80](https://github.com/seniorkazuya/LanceFlow/pull/80)) |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.4.1** — M2 Operations complete (not yet M3) |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Production (v0.4.1)

| | |
|--|--|
| **Release** | [v0.4.1](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.4.1) |
| **Includes** | OPS-001–008 (clients, projects, assignments, daily reports, SOPs, ops console) |
| **Not on prod yet** | M3 automation (AUTO-001–003) — staging only until next release |

---

## Staging (M3 — Automation)

| Story | PR | Feature |
|-------|-----|---------|
| AUTO-001 | [#78](https://github.com/seniorkazuya/LanceFlow/pull/78) | `evaluateRule()`, rule registry |
| AUTO-002 | [#79](https://github.com/seniorkazuya/LanceFlow/pull/79) | Project auto-approval + `RuleDecision` |
| AUTO-003 | [#80](https://github.com/seniorkazuya/LanceFlow/pull/80) | Auto-assign on activate (`AUTO_ASSIGN_ENABLED`) |

### Staging QA checklist (M3)

1. **AUTO-002** — Project in `pending_approval` with risk &lt; 60, margin &gt; 25%, scope &gt; 80% → **Run auto-approval** → status `active`, `RuleDecision` stored.
2. **AUTO-003** — Set Vercel `AUTO_ASSIGN_ENABLED=true`, activate project → top-ranked engineer assigned; override with reason ≥ 8 chars → new assignment + audit.
3. **Ops console** — `/ops` still shows workflow projects and assignments after automation runs.

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0** Platform & DevOps | Done |
| **M1** Foundation | Done |
| **M2** Operations | Done (production v0.4.1) |
| **M3** Automation | 3/8 stories on staging (AUTO-001–003); AUTO-004 in progress |

---

## Recommended sprint order (next)

1. **AUTO-004** — Payment schedule entity (`packages/modules/payments`)  
2. **AUTO-005** — Payment reminder jobs (depends on AUTO-004)  
3. Sync `staging` with `main`, then plan **v0.5.0** when M3 slice is QA-approved  

---

## Branch hygiene

| Branch | vs `main` (approx.) |
|--------|---------------------|
| `staging` | ~15 commits ahead, ~9 behind — merge `main` into `staging` before production release |

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-23 | AUTO-003 staging (#80) |
| 2026-05-23 | AUTO-002 staging (#79) |
| 2026-05-23 | AUTO-001 + staging/main sync (#78) |
| 2026-05-23 | v0.4.1 production (#77) — M2 complete |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
