# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-22  
> **Current phase:** M2 — Operations (in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | **OPS-007** SOP store · then OPS-008 ops console |
| **Just completed** | **v0.4.0** on production (#70) · OPS-006 daily reports on staging (#71) |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production** | **v0.4.0** on `main` — M1 + clients + risk + projects + workload + assignments + UX |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## Staging (ahead of production)

| | |
|--|--|
| **URL** | https://lance-flow-web.vercel.app |
| **Health** | https://lance-flow-web.vercel.app/api/health |
| **Theme** | Light/dark toggle in navbar |

| Area | Routes | Staging | Production |
|------|--------|---------|--------------|
| Clients + risk | `/clients` | Yes | Yes |
| Projects | `/projects` | Yes | Yes |
| Team workload | `/workers` | Yes | Yes |
| Assignment | Project detail | Yes | Yes |
| Daily reports | `/daily-reports`, `/daily-reports/missing` | Yes | Pending v0.4.1 |
| SOPs | `/sops` | In progress | — |

---

## Production (v0.4.0)

| | |
|--|--|
| **Tag** | [v0.4.0](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.4.0) (create tag if not published) |
| **Includes** | M1, OPS-001–005, UX (toasts, themes, live refresh) |
| **Not yet** | Daily reports (staging until next release) |
| **URL** | `PRODUCTION_URL` in GitHub environment **production** |

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0** Platform & DevOps | Done |
| **M1** Foundation | Done |
| **M2** Operations | In progress (6/8 on staging) |

### M2 — Operations stories

| Story | Title | Staging | Production |
|-------|-------|---------|------------|
| OPS-001 | Clients | Done | v0.4.0 |
| OPS-002 | Client risk v0 | Done | v0.4.0 |
| OPS-003 | Project lifecycle | Done | v0.4.0 |
| OPS-004 | Skills & workload | Done | v0.4.0 |
| OPS-005 | Assignment algorithm | Done | v0.4.0 |
| OPS-006 | Daily reports | Done | Pending v0.4.1 |
| OPS-007 | SOP store | In progress | — |
| OPS-008 | Ops console | Backlog | — |

---

## Recommended sprint order (next)

1. **OPS-007** — SOP document store  
2. **OPS-008** — Ops Manager console (`/ops`)  
3. **v0.4.1** — OPS-006 daily reports to production  
4. **AUTO-001** — Rules engine registry (M3)

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-22 | v0.4.0 production (#70) · OPS-006 staging (#71) · project board automation (#72) |
| 2026-05-22 | OPS-005 (#68) · OPS-004 (#67) · UX (#69) |
| 2026-05-21 | OPS-003 (#66) · v0.3.0 (#65) |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
