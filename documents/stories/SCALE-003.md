# SCALE-003: Hiring ROI calculator

| Field | Value |
|-------|-------|
| **Epic** | E8 Scale |
| **Milestone** | M8 |
| **Priority** | P2 |
| **Estimate** | 3d |
| **Modules** | `packages/modules/analytics` |
| **Depends on** | HIRE-007,KPI-002 |
| **Branch** | `feature/SCALE-003-hiring-roi` |
| **Status** | Backlog |

---

## User story

As CEO, I see cost per hire vs realized RP.

---

## Acceptance criteria

- [ ] Dashboard widget with clear labels

---

## Technical notes

Needs production data.

---

## DevOps & delivery

None.

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
You are implementing LanceFlow story SCALE-003: Hiring ROI calculator.

### Context
- Monorepo: apps/web (Next.js BFF), packages/modules/*, packages/rules-engine, packages/core/*
- Read: documents/docs/MODULAR_ARCHITECTURE.md, documents/docs/PLANNING_SUMMARY_AND_GUIDE.md
- This story touches: packages/modules/analytics

### User story
As CEO, I see cost per hire vs realized RP.

### Acceptance criteria
- [ ] Dashboard widget with clear labels

### Technical requirements
Needs production data.

### DevOps
None.

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
