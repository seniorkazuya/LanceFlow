# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-21  
> **Current phase:** M1 — Foundation (in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | CORE-004 — Design system & app shell |
| **Just completed** | CORE-003 — RBAC ✅ (merged #48) |
| **Release** | [v0.2.1](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.2.1) on `main` |
| **Branch convention** | `feature/<STORY-ID>-<slug>` → PR → `staging` |

**Links:** [Staging](#staging-demo) · [Production](#production) · [Board guide](./GITHUB_PROJECT_UPDATES.md)

---

## Staging demo

| | |
|--|--|
| **URL** | https://lance-flow-web.vercel.app |
| **Health** | https://lance-flow-web.vercel.app/api/health |
| **Sign-in** | `/auth/signin` — requires `AUTH_SECRET` + `DEV_AUTH_*` on Vercel |
| **Local** | http://localhost:3000 · [LOCAL_DEV_WINDOWS.md](./LOCAL_DEV_WINDOWS.md) |

---

## Production

| | |
|--|--|
| **Releases** | [v0.1.0](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.1.0) · [v0.2.0](https://github.com/seniorkazuya/LanceFlow/pull/37) · **v0.2.1** (M1) |
| **Deploy** | Tag `v0.2.1` on `main` + Deploy Production workflow |

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
| CORE-002 | Authentication | 🟢 Done |
| CORE-003 | RBAC | 🟢 Done |
| CORE-004 | Design system & app shell | 🟡 In progress |
| CORE-005–006 | Marketing, audit | 🔴 Backlog |

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-21 | CORE-003 RBAC merged to `staging` (#48) |
| 2026-05-21 | v0.2.1 — CORE-002, CORE-001 released to `main` |
| 2026-05-21 | v0.2.0 on `main` (#37) — DEV-007/008 |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
