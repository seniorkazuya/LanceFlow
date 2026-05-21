# Changelog

All notable changes to the LanceFlow application are documented here.

## [Unreleased]

### Added

- **CORE-003** — RBAC policies, `assertRole` / `withAuth`, `/api/control/summary`, `/api/hiring/ceo-queue`

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
