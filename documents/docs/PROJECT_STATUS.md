# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-23  
> **Current phase:** M2 — Operations (complete)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Release in flight** | **v0.4.1** — [PR](https://github.com/seniorkazuya/LanceFlow/compare/main...staging) → `main` |
| **Includes** | OPS-006 daily reports, OPS-007 SOPs, OPS-008 ops console |
| **Staging** | https://lance-flow-web.vercel.app |
| **Production today** | **v0.4.0** — M2 core (through OPS-005 + UX) |

**Links:** [Staging demo](./STAGING_DEMO.md) · [Production deploy](./DEPLOY_PRODUCTION.md) · [Story plan](./STORY_DEVELOPMENT_PLAN.md) · [GitHub Project #4](https://github.com/users/seniorkazuya/projects/4)

---

## v0.4.1 release (staging → production)

| | |
|--|--|
| **Stories** | OPS-006, OPS-007, OPS-008 |
| **Migrations** | `ops_daily_reports` |
| **After merge** | `git tag v0.4.1 && git push origin v0.4.1` · approve **Deploy Production** |

---

## Feature parity

| Area | Routes | Staging | Production (today) | Production (after v0.4.1) |
|------|--------|---------|-------------------|---------------------------|
| Clients + risk | `/clients` | Yes | Yes | Yes |
| Projects | `/projects` | Yes | Yes | Yes |
| Team workload | `/workers` | Yes | Yes | Yes |
| Assignment | Project detail | Yes | Yes | Yes |
| Daily reports | `/daily-reports`, `/daily-reports/missing` | Yes | No | Yes |
| SOPs | `/sops` | Yes | No | Yes |
| Ops console | `/ops` | Yes | No | Yes |

---

## Production (v0.4.0 today)

| | |
|--|--|
| **Release** | [v0.4.0](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.4.0) |
| **URL** | `PRODUCTION_URL` in GitHub environment **production** |

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0** Platform & DevOps | Done |
| **M1** Foundation | Done |
| **M2** Operations | Done (ships to prod with v0.4.1) |

### M2 — Operations stories

| Story | Title | Staging | Production |
|-------|-------|---------|------------|
| OPS-001 | Clients | Done | v0.4.0 |
| OPS-002 | Client risk v0 | Done | v0.4.0 |
| OPS-003 | Project lifecycle | Done | v0.4.0 |
| OPS-004 | Skills & workload | Done | v0.4.0 |
| OPS-005 | Assignment algorithm | Done | v0.4.0 |
| OPS-006 | Daily reports | Done | v0.4.1 (pending) |
| OPS-007 | SOP store | Done | v0.4.1 (pending) |
| OPS-008 | Ops console | Done | v0.4.1 (pending) |

---

## Next (M3)

1. **AUTO-001** — Rules engine registry  
2. Sync `staging` with `main` after v0.4.1 tag  

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-23 | v0.4.1 release PR — OPS-006–008 to production |
| 2026-05-22 | OPS-008 (#75) · OPS-007 (#74) · v0.4.0 prod (#70) |
| 2026-05-21 | OPS-003 (#66) · v0.3.0 (#65) |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
