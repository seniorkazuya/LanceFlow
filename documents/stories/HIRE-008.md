# HIRE-008: Candidate email notifications

| Field | Value |
|-------|-------|
| **Epic** | E6 Hiring |
| **Milestone** | M6 |
| **Priority** | P2 |
| **Estimate** | 2d |
| **Modules** | `packages/modules/hiring, packages/modules/automation` |
| **Depends on** | HIRE-006,AUTO-007 |
| **Branch** | `feature/HIRE-008-candidate-email` |
| **Status** | Backlog |

---

## User story

As candidate, I receive decision emails.

---

## Acceptance criteria

- [ ] reject/hold/hire templates

---

## Technical notes

Use AUTO-007.

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
You are implementing LanceFlow story HIRE-008: Candidate email notifications.

### Context
- Monorepo: apps/web (Next.js BFF), packages/modules/*, packages/rules-engine, packages/core/*
- Read: documents/docs/MODULAR_ARCHITECTURE.md, documents/docs/PLANNING_SUMMARY_AND_GUIDE.md
- This story touches: packages/modules/hiring, packages/modules/automation

### User story
As candidate, I receive decision emails.

### Acceptance criteria
- [ ] reject/hold/hire templates

### Technical requirements
Use AUTO-007.

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
