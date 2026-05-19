# CORE-001: Database package and Prisma schema v0

| Field | Value |
|-------|-------|
| **Epic** | E1 Foundation |
| **Milestone** | M1 |
| **Priority** | P0 |
| **Estimate** | 3d |
| **Modules** | `packages/core/database` |
| **Depends on** | DEV-001 |
| **Branch** | `feature/CORE-001-database` |
| **Status** | Backlog |

---

## User story

As a platform, I need users and audit_logs persisted with migrations.

---

## Acceptance criteria

- [ ] Prisma in packages/core/database
- [ ] User model: id, email, role, status, displayName
- [ ] AuditLog model
- [ ] migrate dev + CI migration test

---

## Technical notes

Export Prisma client from package; apps import @lanceflow/database.

---

## DevOps & delivery

Migration runs in deploy-staging workflow.

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
You are implementing LanceFlow story CORE-001: Database package and Prisma schema v0.

### Context
- Monorepo: apps/web (Next.js BFF), packages/modules/*, packages/rules-engine, packages/core/*
- Read: documents/docs/MODULAR_ARCHITECTURE.md, documents/docs/PLANNING_SUMMARY_AND_GUIDE.md
- This story touches: packages/core/database

### User story
As a platform, I need users and audit_logs persisted with migrations.

### Acceptance criteria
- [ ] Prisma in packages/core/database
- [ ] User model: id, email, role, status, displayName
- [ ] AuditLog model
- [ ] migrate dev + CI migration test

### Technical requirements
Export Prisma client from package; apps import @lanceflow/database.

### DevOps
Migration runs in deploy-staging workflow.

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
