# CORE-005: Marketing and brand pages

| Field | Value |
|-------|-------|
| **Epic** | E1 Foundation |
| **Milestone** | M1 |
| **Priority** | P1 |
| **Estimate** | 2d |
| **Modules** | `apps/web` |
| **Depends on** | CORE-004 |
| **Branch** | `feature/CORE-005-brand` |
| **Status** | Backlog |

---

## User story

As a visitor, I understand LanceFlow vision from the public site.

---

## Acceptance criteria

- [ ] Landing page with Foundation narrative
- [ ] Tagline: Where Strong Action Meets Seamless Flow

---

## Technical notes

Content from documents Foundation doc.

---

## DevOps & delivery

Deploy to staging for client review.

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
You are implementing LanceFlow story CORE-005: Marketing and brand pages.

### Context
- Monorepo: apps/web (Next.js BFF), packages/modules/*, packages/rules-engine, packages/core/*
- Read: documents/docs/MODULAR_ARCHITECTURE.md, documents/docs/PLANNING_SUMMARY_AND_GUIDE.md
- This story touches: apps/web

### User story
As a visitor, I understand LanceFlow vision from the public site.

### Acceptance criteria
- [ ] Landing page with Foundation narrative
- [ ] Tagline: Where Strong Action Meets Seamless Flow

### Technical requirements
Content from documents Foundation doc.

### DevOps
Deploy to staging for client review.

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
