# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-21  
> **Current phase:** M2 — Operations (in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  

---

## Current work

| | |
|--|--|
| **Active story** | OPS-003 — Project lifecycle |
| **Just completed** | OPS-002 — Client risk v0 · **Release v0.3.0** to production |
| **Release** | [v0.3.0](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.3.0) (staging → main) |
| **Branch convention** | `feature/<STORY-ID>-<slug>` → PR → `staging` |

**Links:** [Staging](#staging-demo) · [Production](#production) · [Board guide](./GITHUB_PROJECT_UPDATES.md)

---

## Staging demo

| | |
|--|--|
| **URL** | https://lance-flow-web.vercel.app |
| **Health** | https://lance-flow-web.vercel.app/api/health |
| **Sign-in** | `/auth/signin` — requires `AUTH_SECRET` + `DEV_AUTH_*` on Vercel |
| **UI guide** | [STAGING_DEMO.md](./STAGING_DEMO.md) — landing, clients, roles |

---

## Production

| | |
|--|--|
| **URL** | Set `PRODUCTION_URL` in GitHub **production** environment (Vercel prod project or same app) |
| **Releases** | [v0.1.0](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.1.0) · [v0.2.1](https://github.com/seniorkazuya/LanceFlow/releases/tag/v0.2.1) · **v0.3.0** (M1 + Ops clients) |
| **Deploy** | Tag `v0.3.0` on `main` → **Deploy Production** (requires environment approval) |

After deploy, verify: `curl $PRODUCTION_URL/api/health` and sign-in flow.

---

## Milestones

| Milestone | Status |
|-----------|--------|
| **M0** Platform & DevOps | 🟢 Done |
| **M1** Foundation | 🟢 Done |
| **M2** Operations | 🟡 In progress |

### M1 — stories (released in v0.3.0)

| Story | Title | Status |
|-------|-------|--------|
| CORE-001–006 | Foundation (DB, auth, RBAC, UI, brand, audit) | 🟢 Done |

### M2 — stories (partial, in v0.3.0)

| Story | Title | Status |
|-------|-------|--------|
| OPS-001 | Clients CRUD | 🟢 Done |
| OPS-002 | Client risk v0 | 🟢 Done |
| OPS-003+ | Projects, assignments, … | 🔴 Backlog |

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-21 | **v0.3.0** — M1 Foundation + OPS-001/002 to production |
| 2026-05-21 | OPS-002 client risk v0 (#64) |
| 2026-05-21 | OPS-001 clients module (#63) |
| 2026-05-21 | CORE-006 audit (#62), CORE-005 brand UI (#60), Prisma Vercel fix (#59) |
| 2026-05-21 | v0.2.1 — CORE-001/002 on `main` |

---

*Plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
