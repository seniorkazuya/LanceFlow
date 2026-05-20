# LanceFlow — Project Status (Client View)

> **Last updated:** 2026-05-19  
> **Current phase:** M0 — Platform & DevOps (in progress)  
> **Repository:** https://github.com/seniorkazuya/LanceFlow  
> **Staging demo:** _Not deployed yet_ (local: http://localhost:3000)  
> **Latest release:** _None_

---

## Current work

| | |
|--|--|
| **Active story** | DEV-003 — CI pipeline |
| **Just completed** | DEV-002 — GitHub setup & branch protection ✅ |
| **Next up** | DEV-004 — Staging deployment |
| **Branch convention** | `feature/<STORY-ID>-<slug>` → PR → `staging` |

Engineering: [stories index](../stories/README.md) · DevOps: [DEVOPS_GUIDE.md](./DEVOPS_GUIDE.md) · GitHub: [Project board](https://github.com/users/seniorkazuya/projects)

---

## Executive summary

The repo is on GitHub with **protected `main` and `staging`** branches (PR + 1 approval required). PR/issue templates and CODEOWNERS are in place. Next: **CI on every pull request**, then a **staging URL** for client demos.

---

## Progress at a glance

| Milestone | Status | Target | Notes |
|-----------|--------|--------|-------|
| M0 — Platform & DevOps | 🟡 In progress | Week 1–2 | DEV-001–002 done; DEV-003 next |
| M1 — Foundation | 🔴 Not started | Week 2–3 | Auth, RBAC after M0 |
| M2 — Operations Core | 🔴 Not started | Week 4–7 | |
| M3 — Automation | 🔴 Not started | Week 8–11 | |
| M4 — Control Center | 🔴 Not started | Week 12–15 | |
| M5 — Payments & Trust | 🔴 Not started | Week 16–19 | |
| M6 — Hiring MVP | 🔴 Not started | Week 20–25 | |
| M7 — AI Hiring | 🔴 Not started | Week 26–33 | |
| M8 — Scale | 🔴 Not started | Week 34+ | |

**Legend:** 🟢 Done · 🟡 In progress · 🔴 Not started

---

## Story progress (M0)

| Story | Title | Status |
|-------|-------|--------|
| DEV-001 | Monorepo scaffold | 🟢 Done |
| DEV-002 | GitHub + branch protection | 🟢 Done |
| DEV-003 | CI pipeline | 🟡 **Next** |
| DEV-004 | Staging deployment | 🔴 Backlog |
| DEV-006 | Docker Compose | 🔴 Backlog |
| DEV-007 | Observability | 🔴 Backlog |
| DEV-008 | Client status automation | 🔴 Backlog |

---

## What is complete today

- [x] Brand and product vision documented
- [x] Modular architecture & 62 user stories with dev prompts
- [x] Monorepo — `pnpm dev`, `pnpm build` locally
- [x] Health API — `/api/health`
- [x] **GitHub repo** — https://github.com/seniorkazuya/LanceFlow
- [x] **Branch protection** on `main` and `staging`
- [x] **PR template**, **story issue template**, **CODEOWNERS**, Dependabot
- [ ] CI on pull requests (DEV-003)
- [ ] Staging URL for client demos (DEV-004)

---

## Demo & environments

| Environment | URL | Access |
|-------------|-----|--------|
| **Local** | http://localhost:3000 | `pnpm dev` |
| Staging | _pending DEV-004_ | After CI + deploy |
| Production | _pending_ | After M4+ |

---

## Change log (recent)

| Date | Change |
|------|--------|
| 2026-05-19 | DEV-002 complete: templates, CODEOWNERS, branch protection, GitHub Project |
| 2026-05-19 | DEV-001 complete: monorepo scaffold |
| 2026-05-19 | Development started |

---

## Risks & blockers

| Item | Impact | Mitigation |
|------|--------|------------|
| CI not configured | No automated gate on PRs yet | DEV-003; then enable required checks on branches |
| Staging URL missing | Client cannot UAT online | DEV-004 after CI |

---

## How to track live progress

1. **This file** — updated each story  
2. **GitHub Project** — LanceFlow Build  
3. **GitHub Releases** — after first staging/production deploy  

---

*Technical plan: [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md)*
