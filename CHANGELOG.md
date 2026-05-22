# Changelog

All notable changes to the LanceFlow application are documented here.

## [Unreleased]

_No unreleased changes._

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

- **DEV-008** — PR status checklist, `remind-project-status` workflow, GitHub Project board template
- **DEV-007** — `@lanceflow/config` health checks, structured API JSON logs, optional Sentry
- **DEV-006** — Docker Compose (Postgres 16, Redis 7), README local stack docs
- **DEV-005** — Deploy Production workflow, DEPLOY_PRODUCTION.md
- **DEV-004** — Deploy Staging workflow, Neon migrations, DEPLOY_STAGING.md
- **DEV-003** — GitHub Actions CI, Vitest, ESLint
- **DEV-002** — GitHub templates, CODEOWNERS, Dependabot
- **DEV-001** — Monorepo, Next.js 15, Prisma placeholder, `/api/health`

## [0.1.0] — 2026-05-21

M0 platform release: monorepo, CI, staging deployment (Vercel + Neon), production deploy workflow, Docker local stack.
