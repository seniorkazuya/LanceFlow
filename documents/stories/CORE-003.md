# CORE-003: RBAC policies and middleware

| Field | Value |
|-------|-------|
| **Epic** | E1 Foundation |
| **Milestone** | M1 |
| **Priority** | P0 |
| **Estimate** | 3d |
| **Modules** | `packages/core/auth` |
| **Depends on** | CORE-002 |
| **Branch** | `feature/CORE-003-rbac` |
| **Status** | Backlog |

---

## User story

As CTO, I need role-based access for CEO, OpsManager, Caller, Bidder, Engineer.

---

## Acceptance criteria

- [ ] Role enum and policy map
- [ ] assertRole() / withAuth(handler, roles)
- [ ] 403 on unauthorized API access
- [ ] Tests for each role boundary

---

## Technical notes

Policies: CEO+Ops see control routes; Engineer cannot see hiring CEO queue.

---

## DevOps & delivery

CI must include rbac unit tests.

---

## Definition of Done

- [ ] Acceptance criteria met
- [ ] Unit/integration tests in CI
- [ ] RBAC verified on new routes
- [ ] Audit log for mutations / rule outcomes
- [ ] PR merged to `staging` with story ID in title
- [ ] `PROJECT_STATUS.md` updated if milestone-visible

---

## CTO intent (do not violate)
- LanceFlow is a **structured performance ecosystem**, not a chaotic freelance marketplace.
- Encode leadership judgment as **rules + scores**, not ad-hoc UI logic.
- Every automated decision: store inputs, formula version, allow audited override.
- CEO/Ops touch **exceptions only**; default paths are automated.
- RBAC strict; no cross-role data leaks.
- Prefer extending `packages/modules/*` over growing `apps/web` with business logic.

---

## Development prompt (copy into Cursor / agent)

```
You are implementing LanceFlow story CORE-003: RBAC policies and middleware.

### Context
- Monorepo: apps/web (Next.js BFF), packages/modules/*, packages/rules-engine, packages/core/*
- Read: documents/docs/MODULAR_ARCHITECTURE.md, documents/docs/PLANNING_SUMMARY_AND_GUIDE.md
- This story touches: packages/core/auth

### User story
As CTO, I need role-based access for CEO, OpsManager, Caller, Bidder, Engineer.

### Acceptance criteria
- [ ] Role enum and policy map
- [ ] assertRole() / withAuth(handler, roles)
- [ ] 403 on unauthorized API access
- [ ] Tests for each role boundary

### Technical requirements
Policies: CEO+Ops see control routes; Engineer cannot see hiring CEO queue.

### DevOps
CI must include rbac unit tests.

### Constraints
- Default deny; explicit allow per route.

### Before finishing
1. List files created/changed by package
2. Add/update tests (rules-engine = 100% for new formulas)
3. Confirm no business logic in route handlers beyond validation
4. Document env vars in .env.example if new
5. Output PR description with acceptance checklist

Implement only this story. Do not refactor unrelated modules. Ask if a dependency story is not merged yet.
```
