# LanceFlow — Modular Architecture

Extendable monorepo layout so teams can own modules, ship via isolated PRs, and extract services later without rewrites.

**Related:** [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md) · [DEVOPS_AND_GITHUB_WORKFLOW.md](./DEVOPS_AND_GITHUB_WORKFLOW.md)

---

## 1. Principles (CTO intent)

1. **Bounded contexts** — Operations, Hiring, Rules, Analytics, and Platform do not import each other’s internals; only shared `packages/*`.
2. **Dependency rule** — `apps/*` → `packages/modules/*` → `packages/core/*`. No upward imports.
3. **Stable contracts** — Public API of each module is `index.ts` + Zod DTOs; internal folders are private.
4. **Rules as data** — Scoring and automation formulas live in `packages/rules-engine` with version IDs stored on every decision.
5. **Audit everything** — Cross-cutting `packages/audit` used by all modules for overrides and automated outcomes.
6. **Feature flags** — New automation paths ship behind flags until Ops validates thresholds.

---

## 2. Repository layout (target)

```
lanceflow/
├── apps/
│   ├── web/                    # Next.js App Router (UI + BFF API routes)
│   └── worker/                 # Background jobs (BullMQ consumers) — optional split later
├── packages/
│   ├── core/
│   │   ├── database/           # Prisma schema, client, migrations
│   │   ├── auth/               # Session, RBAC policies, role enum
│   │   ├── config/             # Env validation (zod), feature flags
│   │   ├── ui/                 # shadcn, StatusBadge, layouts
│   │   └── types/              # Shared enums, IDs, pagination
│   ├── modules/
│   │   ├── operations/         # clients, projects, assignments, daily-reports
│   │   ├── automation/         # rules runner, notifications, exception queue
│   │   ├── analytics/          # KPI calculators, control-center aggregations
│   │   ├── payments/           # milestones, escrow state, payment jobs
│   │   ├── hiring/             # ATS, candidates, pipeline
│   │   └── ai-hiring/          # LLM/STT adapters (depends on hiring)
│   ├── rules-engine/           # Pure functions: THS, RS, RP, approval, assignment
│   └── audit/                  # AuditLog writer, query helpers
├── documents/                  # Planning (this folder)
├── .github/
│   ├── workflows/              # ci.yml, deploy-staging.yml, deploy-prod.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── ISSUE_TEMPLATE/
├── turbo.json                  # Turborepo task graph
├── pnpm-workspace.yaml
└── package.json
```

---

## 3. Module ownership map

| Module | Owns | Does not own |
|--------|------|----------------|
| `operations` | Client, Project, Assignment, DailyReport, SOP links | KPI formulas, payment escrow |
| `automation` | Rule execution orchestration, jobs, notifications | Business entity CRUD |
| `analytics` | KPI rollups, Control Center queries | Hiring scores |
| `payments` | Milestones, payment status, escalation | Project approval rules |
| `hiring` | Candidate pipeline, applications | LLM prompt templates |
| `ai-hiring` | Resume parse, EI sim, transcript analysis | Core THS math (uses rules-engine) |
| `rules-engine` | All scored formulas (versioned) | Database, HTTP |
| `core/*` | Infra primitives | Domain logic |

---

## 4. API boundary (BFF pattern)

`apps/web/app/api/**` routes are thin:

1. Authenticate + RBAC (`packages/core/auth`)
2. Call module service (`packages/modules/...`)
3. Write audit if mutating (`packages/audit`)
4. Return DTO

**Do not** put business logic in route handlers beyond validation.

---

## 5. Database strategy

- **Single PostgreSQL database** in v1; schemas namespaced by table prefix if needed (`ops_projects`, `hire_candidates`).
- Prisma schema split into logical files under `packages/core/database/prisma/schema/` merged at build.
- Migrations owned by `core/database`; modules request migration PRs via platform team or module lead.

---

## 6. Extension points (future)

| Need | Extension |
|------|-----------|
| New role type | Add enum + RBAC policy in `core/auth`; extend KPI weights in `rules-engine` |
| New automation rule | Register rule in `automation/registry.ts` + formula in `rules-engine` |
| Payment provider | Adapter interface in `payments/providers/` |
| New hiring signal | Pipeline stage + `ai-hiring` analyzer plugin |
| Extract microservice | Move `packages/modules/X` to standalone service; keep DTO contracts |

---

## 7. Testing per module

| Package | Unit | Integration |
|---------|------|-------------|
| `rules-engine` | 100% formula coverage | — |
| `operations` | Services with mocked DB | API routes + test DB |
| `automation` | Rule orchestration | Job handlers with Redis test |
| `analytics` | KPI math | Nightly job snapshot tests |
| `hiring` / `ai-hiring` | Parsers with fixtures | Golden-file LLM evals (CI optional) |

Run via Turborepo: `pnpm turbo test --filter=@lanceflow/operations`.

---

## 8. Story → module mapping

See [STORY_DEVELOPMENT_PLAN.md](./STORY_DEVELOPMENT_PLAN.md) — each story lists `Modules:` in its frontmatter.
