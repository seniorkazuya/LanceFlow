# AUTO-002: Project auto-approval

| Field | Value |
|-------|-------|
| **Epic** | E3 Automation |
| **Milestone** | M3 |
| **Priority** | P0 |
| **Estimate** | 3d |
| **Modules** | `packages/modules/automation, packages/rules-engine` |
| **Depends on** | AUTO-001,OPS-003 |
| **Branch** | `feature/AUTO-002-auto-approve` |
| **Status** | QA / Staging |

---

## User story

As CEO, projects auto-approve when thresholds met.

---

## Acceptance criteria

- [x] risk<60 AND margin>25% AND scope>80%
- [x] RuleDecision stored

---

## Technical notes

Thresholds in config.

---

## DevOps & delivery

Boundary integration tests.

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
You are implementing LanceFlow story AUTO-002: Project auto-approval.

### Context
- Monorepo: apps/web (Next.js BFF), packages/modules/*, packages/rules-engine, packages/core/*
- Read: documents/docs/MODULAR_ARCHITECTURE.md, documents/docs/PLANNING_SUMMARY_AND_GUIDE.md
- This story touches: packages/modules/automation, packages/rules-engine

### User story
As CEO, projects auto-approve when thresholds met.

### Acceptance criteria
- [ ] risk<60 AND margin>25% AND scope>80%
- [ ] RuleDecision stored

### Technical requirements
Thresholds in config.

### DevOps
Boundary integration tests.

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
