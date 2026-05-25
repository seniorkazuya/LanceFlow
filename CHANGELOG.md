# Changelog

All notable changes to the LanceFlow application are documented here.

## [Unreleased]

### Added

- (M4 — KPI / Control Center analytics in progress)

## [0.5.0] — 2026-05-25

M3 Automation on production: rules engine, auto-approve/assign, payments, notifications, and leadership exception inbox.

### Added

- **AUTO-008** — Leadership exception inbox at `/control` (red/yellow/green severity, sync, acknowledge + audit)
- **AUTO-007** — In-app notification bell + Resend/noop email adapter; ops alerts on payment escalation
- **AUTO-006** — Client risk pre-screen API for Bidders (`POST /api/clients/[id]/risk-prescreen`, RuleDecision + audit)
- **AUTO-005** — Daily payment escalation job (due reminder, day-3 escalate, day-7 risk); BullMQ worker + manual `/api/jobs/payment-escalations`
- **AUTO-004** — `PaymentSchedule` entity per project (due date, amount, `escalationLevel`); CRUD APIs and project UI
- **AUTO-003** — Auto-assign top-ranked engineer on activate when `AUTO_ASSIGN_ENABLED`; audited override via `/api/projects/[id]/assign-override`
- **AUTO-002** — Project auto-approval when risk under 60, margin over 25%, scope over 80%; `RuleDecision` persisted; `/api/projects/[id]/auto-approve`
- **AUTO-001** — `evaluateRule()` with formula version and explanation; rule registry for assignment rank v1
- **DEV-008** — GitHub Project #4 board sync from `board-sync.json` (prior staging merges)

### Database

Production migrate deploy adds:

- `rule_decisions`
- `payment_schedules`
- `notifications`
- `leadership_exceptions`

### Environment (production)

| Variable | Purpose |
|----------|---------|
| `AUTO_ASSIGN_ENABLED` | Auto-assign on project activate |
| `PAYMENT_ESCALATION_JOBS_ENABLED` | BullMQ payment escalation worker |
| `REDIS_URL` | Worker queue |
| `RESEND_API_KEY` | Optional email via Resend |

## [0.4.1] — 2026-05-23

M2 Operations completion on production: daily reports, SOP library, and Ops console.

### Added

- **OPS-008** — Ops Manager console at `/ops` (workflow projects, missing reports, active assignments)
- **OPS-007** — SOP library by category at `/sops` (placeholder doc links)
- **OPS-006** — Daily self-reports (`/daily-reports`), missing-report queue (`/daily-reports/missing`)
- **DEV-008** — GitHub Project #4 board sync from `board-sync.json` and PR workflows

### Database

Production migrate deploy adds:

- `ops_daily_reports`

## [0.4.1] — 2026-05-23

M2 Operations completion on production: daily reports, SOP library, and Ops console.

### Added

- **OPS-008** — Ops Manager console at `/ops` (workflow projects, missing reports, active assignments)
- **OPS-007** — SOP library by category at `/sops` (placeholder doc links)
- **OPS-006** — Daily self-reports (`/daily-reports`), missing-report queue (`/daily-reports/missing`)
- **DEV-008** — GitHub Project #4 board sync from `board-sync.json` and PR workflows

### Database

Production migrate deploy adds:

- `ops_daily_reports`

## [0.4.0] — 2026-05-22

M2 Operations core on production: projects, workload, assignment ranking, and app UX polish.

### Added

- **UX** — Sonner toasts (success/error/confirm), light/dark theme toggle in navbar and landing, `revalidatePath` after mutations so lists refresh
- **OPS-005** — `@lanceflow/rules-engine` assignment rank v1; assign engineers on project detail with `skillScore` snapshot
- **OPS-004** — Engineer `skill_tags`, `ops_assignments`, team workload UI (`/workers`)
- **OPS-003** — Project lifecycle (`draft` → `closed`), `/projects` UI, transition API

### Database

Production migrate deploy adds:

- `ops_projects`
- `users.skill_tags`, `ops_assignments`
- `ops_assignments.formula_version`

## [0.3.0] — 2026-05-21

M1 Foundation + Ops clients and client risk v0.

### Added

- **OPS-002** — Client risk v0 (`ops-client-risk-v0`), evaluate/override APIs, risk panel for Bidders, audited manual override
- **OPS-001** — `@lanceflow/operations` client CRUD, `/api/clients`, `/clients` UI, audit on mutations
- **CORE-006** — `@lanceflow/audit` (`auditLog`, `queryAuditLogs`), `GET /api/audit/logs` (CEO), `/audit` page, `auth.sign_in` logging
- **CORE-005** — Foundation narrative on landing; glass layout on app pages; `PageHeader` and `Input`
- **CORE-004** — Modern brand theme, `GlassCard`, `AppShell` with role-aware nav
- **CORE-003** — RBAC policies, protected API routes

### Fixed

- **Staging auth** — Prisma `rhel-openssl-3.0.x` binary target + Next.js monorepo `PrismaPlugin` for Vercel serverless

## [0.2.1] — 2026-05-21

### Added

- **CORE-002** — `@lanceflow/auth`, NextAuth (credentials), `/auth/signin`, `/dashboard`, `/api/me`, AUTH.md
- **CORE-001** — Prisma client singleton, database package README, integration tests for User/AuditLog

## [0.2.0] — 2026-05-21

### Added

- **DEV-008** — Client status automation (PROJECT_STATUS, GitHub Project board)
- **DEV-007** — Observability baseline (structured logging, health checks)
- **DEV-006** — Docker Compose for local Postgres and Redis
- **DEV-005** — Production deployment workflow with approvals
- **DEV-004** — Staging deployment (Vercel + Neon migrations)
- **DEV-003** — CI pipeline (lint, typecheck, test, build)
- **DEV-002** — GitHub templates, CODEOWNERS, branch protection
- **DEV-001** — Monorepo scaffold (Turborepo, pnpm workspaces)
