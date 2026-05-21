# Changelog

All notable changes to the LanceFlow application are documented here.

## [Unreleased]

### Added

- **CORE-002** — `@lanceflow/auth`, NextAuth (credentials), `/auth/signin`, `/dashboard`, `/api/me`, AUTH.md
- **CORE-001** — Prisma client singleton, database package README, integration tests for User/AuditLog
- **DEV-008** — PR status checklist, `remind-project-status` workflow, GitHub Project board template
- **DEV-007** — `@lanceflow/config` health checks, structured API JSON logs, optional Sentry, `/api/health` DB+Redis status
- **DEV-006** — Docker Compose (Postgres 16, Redis 7, optional MinIO profile), README local stack docs
- **DEV-005** — Deploy Production workflow (tag `v*` + manual), DEPLOY_PRODUCTION.md with rollback runbook
- **DEV-004** — Deploy Staging workflow (Neon migrate, Vercel, health check), initial Prisma migration, DEPLOY_STAGING.md
- **DEV-003** — GitHub Actions CI (lint, typecheck, test, build), Vitest unit/integration tests, ESLint for web
- **DEV-002** — GitHub PR/issue templates, CODEOWNERS, Dependabot, branch protection on `main`/`staging`, setup docs
- **DEV-001** — Monorepo with Turborepo, Next.js 15 (`apps/web`), `@lanceflow/types`, `@lanceflow/database` (Prisma schema placeholder), `/api/health`

## [0.2.1] — 2026-05-21

M1 foundation (staging): Prisma client and schema tests (CORE-001), NextAuth credentials and protected routes (CORE-002).

## [0.2.0] — 2026-05-21

M0 completion on `main`: observability (DEV-007), client status automation (DEV-008).

## [0.1.0] — 2026-05-21

M0 platform release: monorepo, CI, staging deployment (Vercel + Neon), production deploy workflow, Docker local stack.
