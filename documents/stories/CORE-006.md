# CORE-006: Audit log service

| Field | Value |
|-------|-------|
| **Epic** | E1 Foundation |
| **Milestone** | M1 |
| **Priority** | P0 |
| **Estimate** | 2d |
| **Modules** | `packages/audit` |
| **Depends on** | CORE-001 |
| **Branch** | `feature/CORE-006-audit` |
| **Status** | Done |

---

## User story

As CTO, every sensitive action is auditable.

---

## Acceptance criteria

- [x] audit.log({ actorId, action, entityType, entityId, payload })
- [x] Query API for CEO read-only paginated (`GET /api/audit/logs`)

---

## Technical notes

Immutable insert-only; no update/delete.

---

## DevOps & delivery

Include in integration test harness.

---

## Definition of Done

- [x] Acceptance criteria met
- [x] Unit/integration tests in CI
- [x] RBAC verified on new routes
- [x] Audit log for sign-in; mutations in later stories
- [ ] PR merged to `staging` with story ID in title
- [x] `PROJECT_STATUS.md` updated if milestone-visible

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
You are implementing LanceFlow story CORE-006: Audit log service.

### Context
- Monorepo: apps/web (Next.js BFF), packages/modules/*, packages/rules-engine, packages/core/*
- Read: documents/docs/MODULAR_ARCHITECTURE.md, documents/docs/PLANNING_SUMMARY_AND_GUIDE.md
- This story touches: packages/audit

### User story
As CTO, every sensitive action is auditable.

### Acceptance criteria
- [ ] audit.log({ actorId, action, entityType, entityId, payload })
- [ ] Query API for CEO read-only paginated

### Technical requirements
Immutable insert-only; no update/delete.

### DevOps
Include in integration test harness.

### Constraints
- Do not break module import boundaries.

### Before finishing
1. List files created/changed by package
2. Add/update tests (rules-engine = 100% for new formulas)
3. Confirm no business logic in route handlers beyond validation
4. Document env vars in .env.example if new
5. Output PR description with acceptance checklist

Implement only this story. Do not refactor unrelated modules. Ask if a dependency story is not merged yet.
```
