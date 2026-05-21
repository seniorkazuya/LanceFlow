# CORE-004: Design system and app shell

| Field | Value |
|-------|-------|
| **Epic** | E1 Foundation |
| **Milestone** | M1 |
| **Priority** | P0 |
| **Estimate** | 3d |
| **Modules** | `packages/core/ui, apps/web` |
| **Depends on** | DEV-001 |
| **Branch** | `feature/CORE-004-ui` |
| **Status** | Done |

---

## User story

As a user, I see a consistent LanceFlow UI with navigation by role.

---

## Acceptance criteria

- [x] Tailwind + shadcn in packages/core/ui
- [x] StatusBadge green/yellow/red
- [x] App shell: sidebar, header, role-aware nav
- [x] Modern brand theme (navy/teal, glass surfaces) — reference: [Screenpipe Teams](https://screenpi.pe/team)
- [x] Brand assets highlighted on landing (`/brand/lanceflow-icon.png`, `/brand/lanceflow-lockup.png`)

---

## Technical notes

Export components from @lanceflow/ui only.

---

## DevOps & delivery

No deploy-specific changes.

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
You are implementing LanceFlow story CORE-004: Design system and app shell.

### Context
- Monorepo: apps/web (Next.js BFF), packages/modules/*, packages/rules-engine, packages/core/*
- Read: documents/docs/MODULAR_ARCHITECTURE.md, documents/docs/PLANNING_SUMMARY_AND_GUIDE.md
- This story touches: packages/core/ui, apps/web

### User story
As a user, I see a consistent LanceFlow UI with navigation by role.

### Acceptance criteria
- [ ] Tailwind + shadcn in packages/core/ui
- [ ] StatusBadge green/yellow/red
- [ ] App shell: sidebar, header, role-aware nav

### Technical requirements
Export components from @lanceflow/ui only.

### DevOps
No deploy-specific changes.

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
