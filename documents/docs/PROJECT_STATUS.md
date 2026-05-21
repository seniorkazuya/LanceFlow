# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-21  
> **Current phase:** M1 — Foundation (in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | CORE-002 — Authentication (PR in progress) |
| **Just completed** | CORE-001 — Database & Prisma client ✅ |
| **Next up** | CORE-003 RBAC |
| **Branch convention** | `feature/<STORY-ID>-<slug>` → PR → `staging` |

**Links:** [Staging](#staging-demo) · [Production](#production) · [Board guide](./GITHUB_PROJECT_UPDATES.md)

---

## Staging demo

| | |
|--|--|
| **URL** | https://lance-flow-web.vercel.app |
| **Health** | https://lance-flow-web.vercel.app/api/health |
| **Sign-in** | `/auth/signin` after `AUTH_SECRET` + `DEV_AUTH_*` on Vercel |
| **Local** | http://localhost:3000 · `docker compose up -d` |

---

## Production

| | |
|--|--|
| **Releases** | [v0.1.0](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.1.0) · `main` includes [v0.2.0 merge](https://github.com/seniorkazuya/LanceFlow/pull/37) |
| **Staging ahead of main** | CORE-001 (+ CORE-002 when merged) — release PR when ready |

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0** Platform & DevOps | 🟢 Done |
| **M1** Foundation | 🟡 In progress |

### M1 — stories

| Story | Title | Status |
|-------|-------|--------|
| CORE-001 | Database / Prisma | 🟢 Done |
| CORE-002 | Authentication | 🟡 In progress |
| CORE-003 | RBAC | 🔴 Next |
| CORE-004–006 | UI, marketing, audit | 🔴 Backlog |

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-21 | CORE-001 merged (#38); CI Prisma fix |
| 2026-05-21 | Release to `main` (#37) — DEV-007/008 |
| 2026-05-21 | Staging deploy green; health `database: ok` |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
